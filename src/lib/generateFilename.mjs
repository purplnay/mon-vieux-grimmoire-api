import { existsSync } from "fs";
import { randomUUID } from "crypto";
import { mkdir } from "fs/promises";
import { join } from "path";

// Create the images directory if needed
export const imagesDir = join(import.meta.dirname, "..", "..", "images");

if (!existsSync(imagesDir)) {
  await mkdir(imagesDir);
}

export const generateFilename = () => {
  let filename;
  do {
    filename = `${randomUUID()}.webp`;
  } while (existsSync(join(imagesDir, filename)));

  return filename;
};
