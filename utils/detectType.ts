import { lookup } from "mime-types";

export function detectMediaType(url: string): string {
  const mime = lookup(url);

  if (!mime) return "unknown";
  if (mime.startsWith("video")) return "video";
  if (mime.startsWith("audio")) return "audio";
  if (mime.startsWith("image")) return "image";

  return "file";
}