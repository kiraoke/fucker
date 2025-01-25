async function compress(
  filePath: string,
  fileSize: number,
): Promise<string> {
  const inMb = fileSize / (1024 * 1024);
  const fileName: string = filePath.split("/").pop() || filePath;

  const compressionLevel = inMb > 100 ? 4 : 9;

  const command: Deno.Command = new Deno.Command("zstd", {
    args: [`-${compressionLevel}`, filePath],
  });

  const { success }: Deno.CommandOutput = await command.output();

  if (!success) {
    throw new Error(`Failed to compress ${fileName}`);
  }

  return `${filePath}.zst`;
}

async function decompress(filePath: string): Promise<void> {
  const fileName: string = filePath.split("/").pop() || filePath;

  const command: Deno.Command = new Deno.Command("zstd", {
    args: ["-d", filePath],
  });

  const { success }: Deno.CommandOutput = await command.output();

  if (!success) {
    throw new Error(`Failed to decompress ${fileName}`);
  }
}

export { compress, decompress };
