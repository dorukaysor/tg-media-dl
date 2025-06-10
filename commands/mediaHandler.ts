import { Context } from "telegraf";
import { detectMediaType } from "../utils/detectType";
import { downloadMediaFromUrl } from "../utils/downloadMedia";
import User from "../models/User";
import Media from "../models/Media";
import fs from "fs";
import path from "path";
import { downloadM3U8orBlob } from "../services/m3u8Downloader";
import { enforceRateLimits } from "../utils/rateLimiter";

export async function handleMediaLink(ctx: Context) {
  const url = ctx.message?.text;
  const telegramId = ctx.from?.id;
  const rate = await enforceRateLimits(telegramId!);
  if (!rate.allowed) return ctx.reply(rate.reason);
  
  if (!url || !url.startsWith("http")) {
    return ctx.reply("Please send a valid media link.");
  }
  
  let user = await User.findOne({ telegramId });
  if (!user) {
    user = await User.create({ telegramId, username: ctx.from?.username });
  }
  
  if (!user.isPremium && user.dailyDownloadCount >= 10) {
    return ctx.reply("Download limit reached. Upgrade to premium.");
  }
  
  if (!user.isPremium && (url.includes("m3u8") || url.includes("blob") || url.includes("webp"))) {
    return ctx.reply("This media type is for Premium users only.");
  }
  
  const isSpecial = url.includes("m3u8") || url.includes("blob") || url.includes("webp");
  const filePath = isSpecial ?
    await downloadM3U8orBlob(url) :
    await downloadMediaFromUrl(url);
  
  try {
    const type = detectMediaType(url);
    const filePath = await downloadMediaFromUrl(url);
    
    const sent = await ctx.replyWithDocument({ source: filePath });
    
    await Media.create({
      userId: user._id,
      fileId: sent.document?.file_id,
      filePath,
    });
    
    user.dailyDownloadCount++;
    await user.save();
  } catch (e) {
    ctx.reply("Download failed.");
  }
}