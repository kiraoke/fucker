import db from "./db.ts";

export type Files = {
  id: number;
  fileName: string;
  urls: string[];
  timestamp: Date;
};

export async function getFiles(): Promise<Files[]> {
  const result = await db`
    SELECT * FROM files
    ` as Files[];

  return result;
}

export async function addFiles(
  fileName: string,
  urls: string[],
): Promise<void> {
  await db`
    INSERT INTO files (file_name, urls)
    VALUES (${fileName}, ${urls})
    `;
}

addFiles("test", ["test"]);
