import { Context } from "telegraf";
import User from "../models/User";
import { OWNER_ID } from "../config";

export async function adminDashboard(ctx: Context) {
  if (ctx.from?.id !== OWNER_ID) return;

  const totalUsers = await User.countDocuments();
  const premiumUsers = await User.countDocuments({ isPremium: true });
  const nsfwUsers = await User.countDocuments({ nsfwEnabled: true });

  ctx.reply(
    `📊 Admin Dashboard:\n\nTotal Users: ${totalUsers}\nPremium Users: ${premiumUsers}\nNSFW Enabled: ${nsfwUsers}`
  );
}