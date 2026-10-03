import { createReadStream, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { getGridFSBucket } from "../config/db.js";

const publicImgDir = fileURLToPath(
  new URL("../../frontend/public/img/", import.meta.url),
);

const mimeTypes = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

export const sendImage = async (req, res, next) => {
  const filename = req.params.filename;
  if (!filename) return res.status(404).json({ message: "Image not found." });

  const ext = filename.split(".").pop().toLowerCase();
  const contentType = mimeTypes[ext] || "application/octet-stream";

  try {
    // 1. Try to find in GridFS if MongoDB is connected
    if (mongoose.connection?.readyState === 1 && mongoose.connection.db) {
      const file = await mongoose.connection.db
        .collection("images.files")
        .findOne({ filename });

      if (file) {
        res.set("Content-Type", file.contentType || contentType);
        res.set("Cache-Control", "public, max-age=31536000, immutable");
        return getGridFSBucket()
          .openDownloadStream(file._id)
          .on("error", next)
          .pipe(res);
      }
    }

    // 2. Fallback to local static images in frontend/public/img
    const localPath = join(publicImgDir, filename);
    if (existsSync(localPath)) {
      res.set("Content-Type", contentType);
      res.set("Cache-Control", "public, max-age=31536000, immutable");
      return createReadStream(localPath).pipe(res);
    }

    return res.status(404).json({ message: "Image not found." });
  } catch (error) {
    // If GridFS failed, try local file fallback
    const localPath = join(publicImgDir, filename);
    if (existsSync(localPath)) {
      res.set("Content-Type", contentType);
      res.set("Cache-Control", "public, max-age=31536000, immutable");
      return createReadStream(localPath).pipe(res);
    }
    next(error);
  }
};
