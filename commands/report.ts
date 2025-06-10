import { Context } from "telegraf";
import { OWNER_ID } from "../config";

export async function reportCommand(ctx: Context) {
  const msg = ctx.message?.text?.split(" ").slice(1).join(" ");
  if (!msg) return ctx.reply("Please include a message to report.");

  const from = ctx.from?.username || ctx.from?.id;
  const report = `🚨 New Report from @${from}:\n\n${msg}`;

  await ctx.telegram.sendMessage(OWNER_ID, report);
  ctx.reply("Report sent to the admin.");
}