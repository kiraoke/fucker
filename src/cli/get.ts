import { ensureDir } from "jsr:@std/fs";
import { Files, getFile } from "../db/ops.ts";
import { error } from "../utils/colors.ts";
import { rootPath } from "../utils/constants.ts";
import { downloadFile, randomID } from "../utils/utils.ts";
import join from "../split/join.ts";
import ora from "npm:ora";
import cliSpinners from "npm:cli-spinners";
import { decompress } from "../compression/zstd.ts";

async function get(fileName: string, destination: string): Promise<void> {
  const spin = ora({
    text: "Initiating download",
    spinner: cliSpinners.circleQuarters,
    color: "white",
  });

  try {
    spin.start("Initiating download");
    const files: Files | undefined = await getFile(fileName);
    if (!files) throw new Error("File not found");

    await ensureDir(destination);

    // download files in ~/.fucker/filename_nanaoid
    const tempLocation: string = `${rootPath}/${fileName}_${randomID()}_join`;

    await Deno.mkdir(tempLocation, { recursive: true });

    spin.stop();

    for (let i = 0; i < files.urls.length; i++) {
      spin.start(`Downloading part: ${i}`);

      const url: string = files.urls[i];
      const destination = `${tempLocation}/out${i}.fuck.zst`;

      await downloadFile(url, destination);

      spin.stop();
    }

    spin.start("Joining files");

    const location: string = `${destination}/${fileName}`;

    await join(location, tempLocation);

    spin.stop();

    spin.start("Cleaning up");

    await Deno.remove(tempLocation, { recursive: true });

    spin.stop();

    spin.start("Decompressing file");

    await decompress(location);

    await Deno.remove(location)

    spin.stop();
  } catch (err) {
    spin.stop();
    console.log(error(`Error: ${err}`));
  }
}

export default get;
