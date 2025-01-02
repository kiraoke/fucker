import { SimpleGit, simpleGit, StatusResult } from "npm:simple-git";
import split from "./split.ts";
import { error, msg } from "./colors.ts";
import { randomID } from "./utils.ts";

async function update() {
  try {
    const path = `./whore`;
    const dataPath = `${path}/data`;
    const fuckerPath = `${path}/.fucker`;

    const dataGit: SimpleGit = simpleGit(dataPath);

    const status: StatusResult = await dataGit.status();

    const files: string[] = status.not_added.concat(status.modified);
    const fuckerGit: SimpleGit = simpleGit(fuckerPath);

    for (let i = 0; i < files.length; ++i) {
      const fileName = files[i];
      const outputDir = `${fuckerPath}/${fileName}`;

      // delete the folder in .fucker
      await Deno.remove(outputDir, { recursive: true });
      console.log(msg(`Deleted ${fileName} from .fucker`));

      // split files
      const file = await Deno.open(`${dataPath}/${fileName}`);
      const fileReader = file.readable.getReader();

      console.log(msg(`Splitting ${fileName} into 25mb chunks`));
      split(fileReader, fileName, outputDir);
      console.log(msg(`Finished splitting ${fileName}`));

      // all files are split now add and commit them
      const trackGitLfs = new Deno.Command("git", {
        args: ["lfs", "track", `${outputDir}/*`],
      });

      const { stderr, code }: Deno.CommandOutput = await trackGitLfs.output();

      if (code !== 0) { // an error occurred
        throw new Error(
          `Encountered and error while tracking through git lfs: ${
            new TextDecoder().decode(stderr)
          }`,
        );
      }

      console.log(msg(`Tracked ${fileName} through git lfs`));

      fuckerGit.c
    }
  } catch (err) {
    console.log(error(`Encountered an error ${err}`));
  }
}

export default update;
