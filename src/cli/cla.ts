import { Args, parseArgs } from "@std/cli";
import { error, success } from "../utils/colors.ts";
import { msg } from "../utils/colors.ts";
import cliSpinners from "npm:cli-spinners";
import ora from "npm:ora";
import { getFileNames } from "../db/ops.ts";

function printHelp(): void {
  console.log(msg(`
      Usage: fucker [options]

      Flags:
      -h, --help                            Show this help message and exit.
      -v, --version                         Show the version and exit.
      
      Commands:
      list                                  List all the files in the database.
      get <file> --destination <dest>       Get a file from the database and save it to the destination.
      add --source <source>                 Add a file to the database from source path.

      Alias:
      -h -> --help
      -v -> --version
      -d -> --destination
      -s -> --source
   `));
}

function parseArguments(args: string[]): Args {
  const booleanArgs = [
    "help",
    "version",
  ];

  const stringArgs = ["destination", "source"];

  const alias = {
    help: "h",
    version: "v",
    destination: "d",
    source: "s",
  };

  return parseArgs(args, {
    boolean: booleanArgs,
    string: stringArgs,
    alias: alias,
  });
}

type Command = "list" | "get" | "add" | undefined;

async function main(): Promise<void> {
  const args: Args = parseArguments(Deno.args);

  if (args.help) {
    printHelp();
    Deno.exit(0);
  }

  const command: Command = args._[0] as Command;

  if (!command) {
    console.error(error("No command provided."));
    Deno.exit(1);
  }

  const destination: string | undefined = args.destination;
  const source: string | undefined = args.source;

  if (command === "list") {
    const spinner = ora({
      text: "Loading files",
      spinner: cliSpinners.circleQuarters,
      color: "white",
    });

    spinner.start();

    const files: string[] = await getFileNames();

    spinner.stop();

    for (let i = 0; i < files.length; i++) {
      console.log(success(files[i]));
    }

    Deno.exit(0);
  }
}

main();