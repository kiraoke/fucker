import { ensureDir } from "jsr:@std/fs";
import { error } from "../utils/colors.ts";
import { rootPath } from "../utils/constants.ts";
import { getCacheTimestamp, renewCache } from "../db/cache.ts";
import { daysBetweenDates } from "../utils/utils.ts";
import { getFiles } from "../db/ops.ts";
import { spinner } from "npm:@clack/prompts";

async function init() {
  try {
    await ensureDir(rootPath);
    const spin = spinner();

    spin.start("Initializing cache");
    const timestamp: number = await getCacheTimestamp();
    const currentTimestamp: number = Date.now();

    const distance: number = daysBetweenDates(currentTimestamp, timestamp);

    if (distance >= 1) {
      const files = await getFiles();
      await renewCache(files);
    }

    spin.stop("Cache initialized");
  } catch (err) {
    console.log(error(`Error initializing: ${err}`));
  }
}

export default init;
