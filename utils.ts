import { customAlphabet } from "https://deno.land/x/nanoid/mod.ts";

const randomID: () => string = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYabcdefghijklmnopqrstuvwxyzZ1234567890",
  10,
);

export type Spinner = () => {
    start: (msg?: string) => void;
    stop: (msg?: string, code?: number) => void;
    message: (msg?: string) => void;
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export { randomID , sleep};
