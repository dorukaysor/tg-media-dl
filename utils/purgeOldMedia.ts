import fs from "fs";
import Media from "../models/Media";

export async function purgeOldFiles() {
  const expired = await Media.find({ createdAt: { $lte: new Date(Date.now() - 2 * 60 * 60 * 1000) } });

  for (const item of expired) {
    if (fs.existsSync(item.filePath)) fs.unlinkSync(item.filePath);
    await item.deleteOne();
  }
}