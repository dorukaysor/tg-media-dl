import axios from "axios";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function downloadMediaFromUrl(url: string, slowMode = false): Promise<string> {
  const id = uuidv4();
  const ext = path.extname(new URL(url).pathname) || ".dat";
  const filePath = path.join("downloads", `${id}${ext}`);

  const response = await axios.get(url, {
    responseType: "stream",
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const writer = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    const stream = response.data;

    if (slowMode) {
      const throttle = setInterval(() => {
        const chunk = stream.read(64 * 1024);
        if (chunk) writer.write(chunk);
        else if (stream._readableState.ended) {
          clearInterval(throttle);
          writer.end(() => resolve(filePath));
        }
      }, 500);
    } else {
      stream.pipe(writer);
      writer.on("finish", () => resolve(filePath));
      writer.on("error", reject);
    }
  });
}