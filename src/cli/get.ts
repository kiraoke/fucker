import { spinner, text } from "npm:@clack/prompts";
import { ensureDir } from "jsr:@std/fs";
import { Files, getFile } from "../db/ops.ts";
import { error } from "../utils/colors.ts";
import { rootPath } from "../utils/constants.ts";
import { downloadFile, randomID } from "../utils/utils.ts";
import join from "../split/join.ts";

async function get(fileName: string) {
  const spin = spinner();

  try {
    spin.start("Initiating download");

    const files: Files | undefined = await getFile(fileName);
    if (!files) throw new Error("File not found");

    spin.stop("Found file in Database");

    const destination: string | symbol = await text({
      message: "Enter file destination",
      validate: (value) => {
        if (!value) return "Destination cannot be empty";
      },
    });

    if (typeof destination === "symbol") {
      throw new Error("Invalid destination");
    }

    await ensureDir(destination);

    // download files in ~/.fucker/filename_nanaoid
    const tempLocation: string = `${rootPath}/${fileName}_${randomID()}_join`;

    await Deno.mkdir(tempLocation, { recursive: true });

    spin.stop("Initiated files");

    for (let i = 0; i < files.urls.length; i++) {
      spin.start(`Downloading part: ${i}`);

      const url: string = files.urls[i];
      const destination = `${tempLocation}/out${i}.fuck`;

      await downloadFile(url, destination);

      spin.stop(`Downloaded part: ${i}`);
    }

    spin.start("Joining files");

    const location: string = `${destination}/${fileName}`;

    await join(location, tempLocation);

    spin.stop("");

    spin.start("Cleaning up");

    await Deno.remove(tempLocation, { recursive: true });

    spin.stop(`Joined files at ${location}`);
  } catch (err) {
    spin.stop("Error");
    console.log(error(`Error: ${err}`));
  }
}

export default get;
