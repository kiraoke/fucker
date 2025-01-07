import { text } from "npm:@clack/prompts";
import { Files, getFile } from "../db/ops.ts";
import { error } from "../utils/colors.ts";
import { rootPath } from "../utils/constants.ts";
import { randomID } from "../utils/utils.ts";

async function get(fileName: string) {
  try {
    const files: Files | undefined = await getFile(fileName);
    if (!files) throw new Error("File not found");

    const destination: string | symbol = await text({
      message: "Enter file destination",
      validate: (value) => {
        if (!value) return "Destination cannot be empty";
      },
    });

    if (typeof destination === "symbol") {
      throw new Error("Invalid destination");
    }

    // download files in ~/.fucker/filename_nanaoid
    const tempLocation: string = `${rootPath}/${fileName}_${randomID()}_join`;

    await Deno.mkdir(tempLocation, { recursive: true });

    for (let i = 0; i < files.urls.length; i++) {
      const url: string = files.urls[i];
    }
  } catch (err) {
    console.log(error(`Error: ${err}`));
  }
}

export default get;
