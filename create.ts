import { error, msg, success } from "./colors.ts";
import {simpleGit} from "npm:simple-git"

async function create(folder: string) {
  try {
    await Deno.mkdir(folder);
    await Deno.mkdir(`${folder}/data`);
    await Deno.mkdir(`${folder}/.fucker`);

    const initGit = new Deno.Command("git", {
      args: ["init", `${folder}/data`],
    });

    const dataGit = simpleGit(`${folder}/data`)

    const { code: code1, stdout: stdout1, stderr: stderr1 } = await initGit
      .output();

    // there is an error
    if (code1 !== 0) throw new Error(new TextDecoder().decode(stderr1));
    console.log(msg(`${new TextDecoder().decode(stdout1)}`));

    // do shit in .fucker

    const initGit2 = new Deno.Command("git", {
      args: ["init", `${folder}/.fucker`],
    });

    const { code: code2, stdout: stdout2, stderr: stderr2 } = await initGit2
      .output();

    if (code2 !== 0) throw new Error(new TextDecoder().decode(stderr2));
    console.log(msg(`${new TextDecoder().decode(stdout2)}`));

    console.log(
      success(
        `Successfully created a new fucker project in ${folder}`,
      ),
    );
  } catch (err) {
    console.log(error(`Error: ${err}`));
  }
}

export default create;
