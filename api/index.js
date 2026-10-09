import app, { initDatabase } from "../backend/app.js";

/**
 * Vercel Serverless Function entry point
 * Bridges incoming HTTP requests to the Express application
 */
export default async function handler(req, res) {
  try {
    await initDatabase();
  } catch (err) {
    console.error("Vercel handler initDatabase error:", err);
  }
  return app(req, res);
}
