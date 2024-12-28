import {MEGABYTE_IN_64_KB} from "./constants.ts";


async function split(file: ReadableStreamDefaultReader<Uint8Array>) {
  let pushed = 0;
  let chunk = 0;

  await Deno.mkdir("output");

  let writer = (await Deno.open("output/out.fuck", {
    append: true,
    createNew: true,
  })).writable.getWriter();

  let ready = false;

  await writer.ready;

  ready = true;

  while (true) { // it splits into 64kb chunks
    if (!ready) break;

    const { value, done } = await file.read();

    if (done) break;

    await writer.write(value);
    pushed++;

    if (pushed === MEGABYTE_IN_64_KB) { // 25 mbs done
      pushed = 0;
      chunk++;

      writer = (await Deno.open(`output/out${chunk}.fuck`, {
        append: true,
        createNew: true,
      })).writable.getWriter();

      ready = false;

      await writer.ready;

      ready = true;
    }
  }

  await writer.close();
  console.log("done probably ig");
}

export default split
