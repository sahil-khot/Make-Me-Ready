import multer from "multer";

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, done) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return done(new Error("Upload a JPG, PNG, WEBP, or GIF image."));
    }
    done(null, true);
  },
});
