import { text } from "npm:@clack/prompts";
import { getFile } from "../db/ops.ts";
import { error } from "../utils/colors.ts";

async function get(fileName: string) {
  try {
    const file = await getFile(fileName);
    if (!file) throw new Error("File not found");

    const destination: string | symbol = await text({
      message: "Enter file destination",
      validate: (value) => {
        if (!value) return "Destination cannot be empty";
      },
    });

    if (typeof destination === "symbol") {
      throw new Error("Invalid destination");
    }
  } catch (err) {
    console.log(error(`Error: ${err}`));
  }
}

export default get;
