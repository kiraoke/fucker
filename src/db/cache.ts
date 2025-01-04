import { JSONFilePreset } from "lowdb/node";
import Fuse, { FuseResult } from "npm:fuse.js";
import { rootPath } from "../utils/constants.ts";

export interface File {
  fileName: string;
  id: number;
}

export interface Cache {
  timestamp: number;
  files: File[];
}

const defaultCache: Cache = {
  timestamp: Date.now(),
  files: [],
};

const db = await JSONFilePreset<Cache>(`${rootPath}/cache.json`, defaultCache);

async function getCacheTimestamp(): Promise<number> {
  await db.read();

  return db.data.timestamp;
}

async function searchCache(
  fileName: string,
): Promise<FuseResult<File>[]> {
  await db.read();

  const { files } = db.data;

  const fuse = new Fuse<File>(files, {
    keys: ["fileName"],
    findAllMatches: true,
  });

  const results: FuseResult<File>[] = fuse.search(fileName);

  return results;
}

async function renewCache(files: File[]): Promise<void> {
  db.data = {
    timestamp: Date.now(),
    files: files,
  };

  await db.write();
}

async function addFileToCache(file: File): Promise<void> {
  await db.update((data) => {
    data.files.push(file);
    return data;
  });
}

export default db;
export { addFileToCache, getCacheTimestamp, renewCache, searchCache };
