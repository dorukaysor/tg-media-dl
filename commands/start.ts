import { Context } from "telegraf";

export async function startCommand(ctx: Context) {
  const username = ctx.from?.username || "user";
  await ctx.reply(`Welcome ${username}!\nSend me a media link to begin downloading.`);
}