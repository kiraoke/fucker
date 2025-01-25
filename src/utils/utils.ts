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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function daysBetweenDates(timestamp1: number, timestamp2: number): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor(Math.abs((timestamp1 - timestamp2) / oneDay));
}

async function downloadFile(url: string, destination: string): Promise<void> {
  const response = await fetch(url);
  const stream = response.body;

  if (!stream) throw new Error("Invalid url returned empty stream");

  let fileStream: Uint8Array = new Uint8Array();

  for await (const chunk of stream) {
    const merged = new Uint8Array(fileStream.length + chunk.length);
    merged.set(fileStream);
    merged.set(chunk, fileStream.length);

    fileStream = merged;
  }

  await Deno.writeFile(destination, fileStream);
}

export { daysBetweenDates, downloadFile, randomID, sleep };
