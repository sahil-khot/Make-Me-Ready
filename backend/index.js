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
import { seedCatalog } from "./services/seedService.js";

const app = express();
let databaseReady = false;
let databaseMessage = "Connecting to database...";

app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/api/health", (_req, res) =>
  res.json({
    status: databaseReady ? "ready" : "degraded",
    database: databaseReady ? "connected" : "disconnected",
    message: databaseMessage,
  }),
);

// Image serving routes (GridFS with public/img fallback)
app.get("/img/:filename", sendImage);
app.get("/api/images/:filename", sendImage);

const wardrobeDir = fileURLToPath(
  new URL("../frontend/public/wardrobe", import.meta.url),
);
if (existsSync(wardrobeDir)) {
  app.use("/wardrobe", express.static(wardrobeDir));
}

// Main API routes
app.use("/api", apiRoutes);

// Global Error Handler
app.use(errorHandler);

// Production frontend static file serving
const dist = fileURLToPath(new URL("../frontend/dist/", import.meta.url));
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*path", (_req, res) => res.sendFile(join(dist, "index.html")));
}

// Start Server
const server = app.listen(env.PORT, () => {
  console.log(`Make Me Ready API listening on http://localhost:${env.PORT}`);
});

// Asynchronously connect to MongoDB & seed
const initDatabase = async () => {
  try {
    await connectDB();
    databaseReady = true;
    databaseMessage = "MongoDB connected.";
    console.log("Database connected. Seeding catalog…");
    await seedCatalog();
    console.log("✓ Catalog seeded and ready.");
  } catch (error) {
    databaseReady = false;
    databaseMessage = `MongoDB connection failed: ${error.message}`;
    console.warn(`Database not ready: ${error.message}`);
  }
};

initDatabase();

export default app;
