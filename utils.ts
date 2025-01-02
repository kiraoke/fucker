import { customAlphabet } from "https://deno.land/x/nanoid/mod.ts";

const randomID: () => string = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYabcdefghijklmnopqrstuvwxyzZ1234567890",
  10,
);

export { randomID };
