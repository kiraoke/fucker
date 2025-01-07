import { ensureDir } from "jsr:@std/fs/ensure-dir";
import { error } from "../utils/colors.ts";
import { MEGABYTE_IN_64_KB } from "../utils/constants.ts";

export type Meta = {
  name: string;
  dirName: string;
  timestamp: number;
};

async function split(
  file: ReadableStreamDefaultReader<Uint8Array>,
  name: string,
  outputDir: string,
) {
  try {
    let pushed: number = 0;
    let chunk: number = 0;

    await ensureDir(outputDir);

    let writer: WritableStreamDefaultWriter<Uint8Array> =
      (await Deno.open(`${outputDir}/${name}.fuck`, {
        append: true,
        createNew: true,
      })).writable.getWriter();

    let ready: boolean = false;

    await writer.ready;

    ready = true;

    while (true) { // it splits into 64kb chunks
      if (!ready) break;

      const { value, done }: ReadableStreamReadResult<Uint8Array> = await file
        .read();

      if (done) break;

      await writer.write(value);
      pushed++;

      if (pushed === MEGABYTE_IN_64_KB) { // 25 mbs done
        pushed = 0;
        chunk++;

        await writer.close();

        writer = (await Deno.open(`${outputDir}/${name}${chunk}.fuck`, {
          append: true,
          createNew: true,
        })).writable.getWriter();

        ready = false;

        await writer.ready;

        ready = true;
      }
    }

    await writer.close();
 } catch (err) {
    console.log(error(`Error splitting file: ${name} ${err}`));
  }
}

export default split;
