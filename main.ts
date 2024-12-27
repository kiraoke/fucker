const MEGABYTE_IN_64_KB = 2; // 25 megabytes = 400 x 64 kilobytes

const file = await Deno.open("test.txt");
const fileReader = file.readable.getReader();

// Write each stream of 64kb in a file
// Once it you've wrote 400 of em, close the file and open a new one
// Do it till the end of the file

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

async function join() {
  const writer = (await Deno.open("whore.txt", {
    append: true,
    createNew: true,
  })).writable.getWriter();

  for await (const dirEntry of Deno.readDir("output/")) {
    const file = dirEntry.name;

    const data = await Deno.readFile(`output/${file}`);

    await writer.write(data);
  }

  writer.close();

  console.log("ig done");
}

join();
