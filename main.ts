import split from "./split.ts";

const file = await Deno.open("test/boira.png");
const fileReader = file.readable.getReader();

split(fileReader)
