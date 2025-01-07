import { Bot, InputFile } from "https://deno.land/x/grammy@v1.34.0/mod.ts";
import {
  File,
  Message,
} from "https://deno.land/x/grammy_types@v3.18.0/message.ts";

const token: string | undefined = Deno.env.get("BOT_TOKEN");

if (!token) throw new Error("BOT_TOKEN is not provided");

const bot: Bot = new Bot(token);

async function sendFile(filePath: string, channel: string): Promise<string> {
  const msg: Message.DocumentMessage = await bot.api.sendDocument(
    channel,
    new InputFile(await Deno.open(filePath)),
  );

  const doc: File = await bot.api.getFile(msg.document.file_id);
  const path: string | undefined = doc.file_path;

  if (!path) {
    throw new Error(
      `Encountered and error while getting file path for id ${msg.document.file_id}: File Path invalid`,
    );
  }

  const url: string = `https://api.telegram.org/file/bot${token}/${path}`;

  return url;
}

export { sendFile };

export default bot;
