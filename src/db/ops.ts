import db from "./db.ts";

export type Files = {
  id: number;
  file_name: string;
  urls: string[];
  timestamp: Date;
};

type FileName = {
  file_name: string;
};

export async function getFiles(): Promise<Files[]> {
  const result: Files[] = await db`
    SELECT * FROM files
    ` as Files[];

  return result;
}


export async function getFileNames(): Promise<string[]> {
  const result: FileName[] = await db`
    SELECT file_name FROM files
    ` as FileName[];

  return result.map((file) => file.file_name);
}

export async function getFile(fileName: string): Promise<Files | undefined> {
  const result: Files[] = await db`
    SELECT * FROM files
    WHERE file_name = ${fileName}
    ` as Files[];

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
