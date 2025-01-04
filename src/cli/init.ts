import { ensureDir } from "jsr:@std/fs";
import { error } from "./colors.ts";
import { rootPath } from "./constants.ts";

async function init() {
  try {
    await ensureDir(rootPath);
  } catch (err) {
    console.log(error(`Error initializing: ${err}`));
  }
}

export default init;
