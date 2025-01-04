import {
  cancel,
  intro,
  isCancel,
  outro,
  select,
  text,
} from "npm:@clack/prompts";
import { command } from "../utils/constants.ts";
import process from "node:process";
import add from "./add.ts";
import get from "./get.ts";
import init from "./init.ts";
import { error } from "../utils/colors.ts";

async function cli() {
  try {
  intro("Welcome to fucker");
  await init();

  // select command
  const commandType = await select({
    message: "Choose a task.",
    options: [
      { value: command.add, label: "Add a file" },
      { value: command.get, label: "Get a file" },
    ],
  });

  if (isCancel(commandType)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  const file: string | symbol = await text({
    message: "Enter the file name",
    validate: (value) => {
      if (!value) return "File name cannot be empty";
    },
  });

  if (isCancel(file)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  if (typeof file === "symbol") {
    throw new Error("Invalid file name");
  }

  if (commandType === command.add) await add(file);

  if (commandType === command.get) await get(file);

  outro("Hope you had good fun");
  process.exit(0);
  } catch (err) {
    console.log(error(`Error: ${err}`));
    process.exit(1)
  }
}

await cli();
