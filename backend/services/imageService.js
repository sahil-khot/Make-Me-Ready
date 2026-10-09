import { createReadStream, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { getGridFSBucket } from "../config/db.js";

const publicBaseDir = fileURLToPath(
  new URL("../../frontend/public/", import.meta.url),
);
const distBaseDir = fileURLToPath(
  new URL("../../frontend/dist/", import.meta.url),
);

const searchSubdirs = [
  "img",
  "img/outfits",
  "Occasions",
  "Recommendations",
  "wardrobe",
  "BackGround Images",
  "",
];

const getLocalImagePath = (filename) => {
  if (!filename) return null;
  const decoded = decodeURIComponent(filename);

  // 1. Search in public directory and subdirectories
  for (const sub of searchSubdirs) {
    const candidate = join(publicBaseDir, sub, decoded);
    if (existsSync(candidate)) return candidate;
  }

  // 2. Search in dist directory and subdirectories
  for (const sub of searchSubdirs) {
    const candidate = join(distBaseDir, sub, decoded);
    if (existsSync(candidate)) return candidate;
  }

  return null;
};

const mimeTypes = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

export const sendImage = async (req, res, next) => {
  const rawFilename = req.params.filename;
  if (!rawFilename) return res.status(404).json({ message: "Image not found." });

  const filename = decodeURIComponent(rawFilename);
  const ext = filename.split(".").pop().toLowerCase();
  const contentType = mimeTypes[ext] || "application/octet-stream";

  try {
    // 1. Try to find in GridFS if MongoDB is connected
    if (mongoose.connection?.readyState === 1 && mongoose.connection.db) {
      const file = await mongoose.connection.db
        .collection("images.files")
        .findOne({
          $or: [{ filename }, { filename: rawFilename }],
        });

      if (file) {
        res.set("Content-Type", file.contentType || contentType);
        res.set("Cache-Control", "public, max-age=31536000, immutable");
        return getGridFSBucket()
          .openDownloadStream(file._id)
          .on("error", next)
          .pipe(res);
      }
    }

    // 2. Fallback to local static images
    const localPath = getLocalImagePath(filename);
    if (localPath) {
      res.set("Content-Type", contentType);
      res.set("Cache-Control", "public, max-age=31536000, immutable");
      return createReadStream(localPath).pipe(res);
    }

    return res.status(404).json({ message: "Image not found." });
  } catch (error) {
    // If GridFS failed, try local file fallback
    const localPath = getLocalImagePath(filename);
    if (localPath) {
      res.set("Content-Type", contentType);
      res.set("Cache-Control", "public, max-age=31536000, immutable");
      return createReadStream(localPath).pipe(res);
    }
    next(error);
  }
};
