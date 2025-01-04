import {
  cancel,
  intro,
  isCancel,
  outro,
  select,
  text,
} from "npm:@clack/prompts";
import { command } from "./constants.ts";
import process from "node:process";
import add from "./add.ts";
import init from "./init.ts";

async function cli() {
  await init();

  intro("Welcome to fucker");

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

  if (commandType === command.add) {
    const file = await text({
      message: "Enter the file name",
      validate: (value) => {
        if (!value) return "File name cannot be empty";
      },
    });

    if (isCancel(file)) {
      cancel("Operation cancelled.");
      process.exit(0);
    }

    await add(file);
  } else if (commandType === command.get) {
    const file = await text({
      message: "Enter the file name",
      validate: (value) => {
        if (!value) return "File name cannot be empty";
      },
    });
  }

  outro("Hope you had good fun");
  process.exit(0);
}

await cli();
