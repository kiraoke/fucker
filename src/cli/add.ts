import split from "../split/split.ts";
import { rootPath } from "../utils/constants.ts";
import { randomID } from "../utils/utils.ts";
import { error } from "../utils/colors.ts";
import { sendFile } from "../bot/bot.ts";
import { addFiles } from "../db/ops.ts";
import { addFileToCache } from "../db/cache.ts";
import ora from "npm:ora";
import cliSpinners from "npm:cli-spinners";
import { compress } from "../compression/zstd.ts";

async function add(file: string) {
  const spin = ora({
    spinner: cliSpinners.circleQuarters,
    color: "white",
  });

  try {
    spin.start("Compressing file");

    const channel: string | undefined = Deno.env.get("CHANNEL_NAME");
    if (!channel) throw new Error("Channel name is not provided");
    
    const fileStat: Deno.FileInfo = await Deno.stat(file);

    const compressedFile: string = await compress(file, fileStat.size);

    spin.stop();

    spin.start("Splitting file");

    const fileStream: Deno.FsFile = await Deno.open(compressedFile);
    const fileReader: ReadableStreamDefaultReader<Uint8Array> = fileStream
      .readable.getReader();

    const parts: string[] = compressedFile.split("/");

    if (!parts.length) throw new Error("Invalid file path");

    const fileName: string = parts[parts.length - 1];
    const outDir: string = `${rootPath}/${fileName}_${randomID()}`;

    await split(fileReader, fileName, outDir);

    spin.stop();

    const urls: string[] = []; // a string will be about 200bytes so a 82gb file will only make 6.63mb of urls in memory so it is fine
    let index: number = 0;

    for await (const dirEntry of Deno.readDir(outDir)) {
      if (!dirEntry.isFile) continue;

      spin.start(`Uploading Part: ${index}`);
      const filePath: string = `${outDir}/${dirEntry.name}`;

      const url: string = await sendFile(filePath, channel);
      urls.push(url);

      index++;
      spin.stop();
    }

    spin.start("Adding file to database");

    const id: number = await addFiles(fileName, urls);

    spin.stop();

    spin.start("Adding file to cache");

    await addFileToCache({
      id: id,
      fileName: fileName,
    });

    spin.stop();

    spin.start("Cleaning up");

    await Deno.remove(outDir, { recursive: true });
    await Deno.remove(compressedFile);

    spin.stop();
  } catch (err) {
    spin.stop();
    console.log(error(`Error adding file: ${err}`));
  }
}

export default add;
