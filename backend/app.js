import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import apiRoutes from "./routes/index.js";
import { sendImage } from "./services/imageService.js";
import { seedCatalogOnce } from "./services/seedService.js";

const app = express();
let databaseReady = false;
let databaseMessage = "Connecting to database...";

app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Permissive and secure CORS for local dev, Vercel preview domains, and configured origin
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        origin.endsWith(".vercel.app") ||
        env.CLIENT_ORIGIN.includes(origin) ||
        env.CLIENT_ORIGIN.includes("*")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Normalize Vercel URL paths if rewritten directly to the handler
app.use((req, _res, next) => {
  if (req.url.startsWith("/api/index.js")) {
    req.url = req.url.replace("/api/index.js", "/api") || "/api";
  }
  next();
});

// Health check endpoints (both /health and /api/health)
const healthHandler = (_req, res) =>
  res.json({
    status: databaseReady ? "ready" : "degraded",
    database: databaseReady ? "connected" : "disconnected",
    message: databaseMessage,
  });

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

// Image serving routes (GridFS with public/dist fallback)
app.get("/img/:filename", sendImage);
app.get("/api/images/:filename", sendImage);
app.get("/api/img/:filename", sendImage);

// Static public directory serving if present
const publicDir = fileURLToPath(
  new URL("../frontend/public", import.meta.url),
);
if (existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

// Main API routes
app.use("/api", apiRoutes);

// Global Error Handler
app.use(errorHandler);

// Production frontend static file serving (for standalone Node running)
const dist = fileURLToPath(new URL("../frontend/dist/", import.meta.url));
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*path", (_req, res) => res.sendFile(join(dist, "index.html")));
}

// Lazy/Cached database initialization function
export const initDatabase = async () => {
  if (databaseReady) return true;
  try {
    await connectDB();
    databaseReady = true;
    databaseMessage = "MongoDB connected.";
    await seedCatalogOnce();
    return true;
  } catch (error) {
    databaseReady = false;
    databaseMessage = `MongoDB connection failed: ${error.message}`;
    console.warn(`Database not ready: ${error.message}`);
    return false;
  }
};

export default app;
