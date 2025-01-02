import yargs from "https://deno.land/x/yargs/deno.ts";
import { Arguments } from "https://deno.land/x/yargs/deno-types.ts";
import create from "./create.ts";
import update from "./update.ts";

yargs(Deno.args)
  .command("create <folder...>", "create a fucker folder", (yargs: any) => {
    return yargs.positional("folder", {
      describe: "provide the name of a folder where to initialize fucker",
    });
  }, (argv: Arguments) => {
    const [folder] = argv.folder;
    create(folder);
  })
  .command("update", "update fucker", () => {}, update)
  .strictCommands()
  .demandCommand(1)
  .parse();
