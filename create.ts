import { error, msg, success } from "./colors.ts";
import { SimpleGit, simpleGit } from "npm:simple-git";

async function create(folder: string) {
  try {
    await Deno.mkdir(folder);
    await Deno.mkdir(`${folder}/data`);
    await Deno.mkdir(`${folder}/.fucker`);

    const dataGit: SimpleGit = simpleGit(`${folder}/data`);
    await dataGit.init();
    console.log(msg(`Initialized empty git repository in ${folder}/data`));

    const fuckerGit: SimpleGit = simpleGit(`${folder}/.fucker`);
    await fuckerGit.init();
    console.log(msg(`Initialized empty git repository in ${folder}/.fucker`));

    console.log(
      success(
        `\nSuccessfully created a new fucker project in ${folder}`,
      ),
    );
  } catch (err) {
    console.log(error(`Error: ${err}`));
  }
}

export default create;
