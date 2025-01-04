import { spinner } from "npm:@clack/prompts";
import SqlString from "npm:sqlstring";
import split from "../split/split.ts";
import { rootPath } from "../utils/constants.ts";
import { randomID } from "../utils/utils.ts";
import { error } from "../utils/colors.ts";
import { sendFile } from "../bot/bot.ts";
import { addFiles } from "../db/ops.ts";
import { addFileToCache } from "../db/cache.ts";

async function add(file: string) {
  try {
    const spin = spinner();
    spin.start("Splitting files");

    const channel: string | undefined = Deno.env.get("CHANNEL_NAME");
    if (!channel) throw new Error("Channel name is not provided");
    if (channel[0] !== "@") {
      throw new Error(
        "Channel name is invalid! Channel name must start with @",
      );
    }

    const fileStream: Deno.FsFile = await Deno.open(file);
    const fileReader: ReadableStreamDefaultReader<Uint8Array> = fileStream
      .readable.getReader();

    const parts: string[] = file.split("/");

    if (!parts.length) throw new Error("Invalid file path");

    const fileName: string = parts[parts.length - 1];
    const outDir: string = `${rootPath}/${fileName}_${randomID()}`;

    await split(fileReader, fileName, outDir);

    spin.stop(`Splitted ${fileName}`);

    const urls: string[] = []; // a string will be about 200bytes so a 82gb file will only make 6.63mb of urls in memory so it is fine
    let index: number = 0;

    for await (const dirEntry of Deno.readDir(outDir)) {
      if (!dirEntry.isFile) continue;

      spin.start(`Uploading Part: ${index}`);
      const filePath: string = `${outDir}/${dirEntry.name}`;

      const url: string = await sendFile(filePath, channel);
      const escapedUrl: string = SqlString.escape(url);
      urls.push(escapedUrl);

      index++;
      spin.stop("");
    }

    spin.start("Adding file to database");

    const id: number = await addFiles(SqlString.escape(fileName), urls);

    spin.stop("File added to database");

    spin.start("Adding file to cache");

    await addFileToCache({
      id: id,
      fileName: fileName,
    });

    spin.stop("File added to cache");

    spin.start("Cleaning up");

    await Deno.remove(outDir, { recursive: true });

    spin.stop("Cleaned up");
  } catch (err) {
    console.log(error(`Error adding file: ${err}`));
  }
}

export default add;
