import db from "./db.ts";

export type Files = {
  id: number;
  fileName: string;
  urls: string[];
  timestamp: Date;
};

export async function getFiles(): Promise<Files[]> {
  const result: Files[] = await db`
    SELECT * FROM files
    ` as Files[];

  return result;
}

export async function getFile(fileName: string): Promise<Files | undefined> {
  const result: Files[] = await db`
    SELECT * FROM files
    WHERE file_name = ${fileName}
    ` as Files[]; // filename must be in '' because of escaping sql before

  return result[0];
}

interface Id {
  id: number;
}

export async function addFiles(
  fileName: string,
  urls: string[],
): Promise<number> {
  const { id } = (await db`
    INSERT INTO files (file_name, urls)
    VALUES (${fileName}, ${urls})
    RETURNING id
    ` as Id[])[0];

  return id;
}

console.log(await getFile("test"));
