import multer from "multer";

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Images must be 8 MB or smaller."
          : error.message,
    });
  }

  if (error.message?.startsWith("Upload a ")) {
    return res.status(400).json({ message: error.message });
  }

  if (error.code === 11000) {
    return res
      .status(409)
      .json({ message: "An account with this email already exists." });
  }

  console.error("Unhandled Server Error:", error);
  res.status(error.status || 500).json({
    message: error.status
      ? error.message
      : "An unexpected server error occurred.",
  });
};
