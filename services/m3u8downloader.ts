// Only works for m3u8 and blob URLs (simplified, real implementation varies)

import axios from "axios";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function downloadM3U8orBlob(url: string): Promise<string> {
  const id = uuidv4();
  const filePath = path.join("downloads", `${id}.mp4`);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream"
  });

  const writer = fs.createWriteStream(filePath);
  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on("finish", () => resolve(filePath));
    writer.on("error", reject);
  });
}