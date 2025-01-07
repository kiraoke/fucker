async function join(
  destination: string,
  splitDir: string,
): Promise<void> {
  const writer = (await Deno.open(destination, {
    append: true,
    createNew: true,
  })).writable.getWriter();

  for await (const dirEntry of Deno.readDir(splitDir)) {
    const file = dirEntry.name;

    const data = await Deno.readFile(`${splitDir}/${file}`);

    await writer.write(data);
  }

  writer.close();
}

export default join;
