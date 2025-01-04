import { ensureDir } from "jsr:@std/fs";
import { error } from "../utils/colors.ts";
import { rootPath } from "../utils/constants.ts";

async function init() {
  try {
    await ensureDir(rootPath);
  } catch (err) {
    console.log(error(`Error initializing: ${err}`));
  }
}

export default init;
