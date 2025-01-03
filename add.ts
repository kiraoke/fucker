import { spinner } from "npm:@clack/prompts";
import split from "./split.ts";
import { rootPath } from "./constants.ts";
import { randomID } from "./utils.ts";
import { error } from "./colors.ts";

async function add(file: string) {
  try {
    const spin = spinner();
    spin.start("Adding file");
    const fileStream: Deno.FsFile = await Deno.open(file);
    const fileReader: ReadableStreamDefaultReader<Uint8Array> = fileStream
      .readable.getReader();

    const parts = file.split("/");

    if (!parts.length) throw new Error("Invalid file path");

    const fileName = parts[parts.length - 1];

    await split(fileReader, fileName, `${rootPath}/${fileName}_${randomID()}`);
    spin.stop("File added" + file);
  } catch (err) {
    console.log(error(`Error adding file: ${err}`));
  }
}

export default add;
