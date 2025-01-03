import { Bot } from "https://deno.land/x/grammy@v1.34.0/mod.ts";

const token = Deno.env.get("BOT_TOKEN") || "";

console.log(token);

const bot = new Bot(token);

bot.api.sendPhoto(
  "@kiraokek",
  "https://i.pinimg.com/736x/8a/26/76/8a26762c5e697204651dd06d8a8470b7.jpg",
);
