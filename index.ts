import { Telegraf } from "telegraf";
import mongoose from "mongoose";
import { BOT_TOKEN, MONGODB_URI } from "./config";
import { handleMediaLink } from "./commands/mediaHandler";

import { adminDashboard } from "./admin/dashboard";

import { startCommand } from "./commands/start";
import { ownerCommand } from "./commands/owner";
import { nsfwCommand } from "./commands/nsfw";
import { reportCommand } from "./commands/report";

import { purgeOldFiles } from "./utils/purgeOldMedia";
setInterval(purgeOldFiles, 10 * 60 * 1000);


const bot = new Telegraf(BOT_TOKEN);

mongoose.connect(MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");
  bot.launch();
});

bot.start(startCommand);
bot.start((ctx) => ctx.reply("Send a media link to begin."));
bot.command("owner", ownerCommand);
bot.command("nsfw", nsfwCommand);
bot.command("report", reportCommand);

bot.command("dashboard", adminDashboard);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

//handle media link...
bot.on("text", async (ctx) => {
  if (ctx.message?.text?.startsWith("http")) {
    await handleMediaLink(ctx);
  }
});