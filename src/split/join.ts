async function join() {
  const writer = (await Deno.open("test/whore.png", {
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


export default join
