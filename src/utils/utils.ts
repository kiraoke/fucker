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
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function daysBetweenDates(timestamp1: number, timestamp2: number): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor(Math.abs((timestamp1 - timestamp2) / oneDay));
}

export { daysBetweenDates, randomID, sleep };
