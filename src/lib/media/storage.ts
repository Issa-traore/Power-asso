import "server-only";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import sharp from "sharp";

// Storage is a thin abstraction so this can later be swapped for an
// S3-compatible bucket without touching call sites — see saveUpload().

const MAX_DIMENSION = 2400;
const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);

export type SavedUpload = {
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
};

export async function saveUpload(organizationId: string, file: File): Promise<SavedUpload> {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error(`Type de fichier non autorisé : ${file.type}`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadRoot = process.env.UPLOAD_DIR || "./public/uploads";
  const orgDir = path.join(/* turbopackIgnore: true */ process.cwd(), uploadRoot, organizationId);
  await mkdir(orgDir, { recursive: true });

  const isSvg = file.type === "image/svg+xml";
  const ext = isSvg ? "svg" : (file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1]);
  const filename = `${nanoid(12)}.${ext}`;
  const absolutePath = path.join(/* turbopackIgnore: true */ orgDir, filename);

  let width: number | null = null;
  let height: number | null = null;
  let outBuffer = buffer;

  if (!isSvg) {
    const image = sharp(buffer, { limitInputPixels: 40_000_000 });
    const metadata = await image.metadata();
    if (metadata.width && metadata.height && (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION)) {
      outBuffer = await image.resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside" }).toBuffer();
      const resized = await sharp(outBuffer).metadata();
      width = resized.width ?? null;
      height = resized.height ?? null;
    } else {
      width = metadata.width ?? null;
      height = metadata.height ?? null;
    }
  }

  await writeFile(absolutePath, outBuffer);

  const uploadUrlRoot = uploadRoot.replace(/^\.?\/?public/, "");
  return {
    url: `${uploadUrlRoot}/${organizationId}/${filename}`.replace(/\/{2,}/g, "/"),
    filename,
    mimeType: file.type,
    sizeBytes: outBuffer.byteLength,
    width,
    height,
  };
}
