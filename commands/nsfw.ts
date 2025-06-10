import User from "../models/User";
import { Context } from "telegraf";

export async function nsfwCommand(ctx: Context) {
  const telegramId = ctx.from?.id;
  let user = await User.findOne({ telegramId });

  if (!user) {
    user = await User.create({ telegramId, username: ctx.from?.username });
  }

  user.nsfwEnabled = !user.nsfwEnabled;
  await user.save();

  ctx.reply(`NSFW content is now ${user.nsfwEnabled ? "enabled" : "disabled"}.`);
}