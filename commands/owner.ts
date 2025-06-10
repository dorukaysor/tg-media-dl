import { Context } from "telegraf";
import { OWNER_ID } from "../config";

export async function ownerCommand(ctx: Context) {
  await ctx.reply(`This bot is owned by: [tg://user?id=${OWNER_ID}](tg://user?id=${OWNER_ID})`, {
    parse_mode: "Markdown"
  });
}