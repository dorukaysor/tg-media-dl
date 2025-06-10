import User from "../models/User";

export async function enforceRateLimits(userId: number) {
  const user = await User.findOne({ telegramId: userId });
  if (!user) return { allowed: true };

  const now = new Date();
  const isNewDay = now.getUTCDate() !== new Date(user.lastReset).getUTCDate();
  if (isNewDay) {
    user.dailyDownloadCount = 0;
    user.lastReset = now;
    await user.save();
  }

  if (!user.isPremium && user.dailyDownloadCount >= 10) {
    return { allowed: false, reason: "Daily download limit reached for free users." };
  }

  return { allowed: true };
}