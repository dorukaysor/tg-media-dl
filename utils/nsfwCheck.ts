import User from "../models/User";

export async function isNSFWAllowed(telegramId: number): Promise<boolean> {
  const user = await User.findOne({ telegramId });
  return user?.nsfwEnabled ?? false;
}