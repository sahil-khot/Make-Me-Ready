import { env } from "./config/env.js";
import app, { initDatabase } from "./app.js";

// Only start the HTTP listener if not running in a serverless environment like Vercel
if (!process.env.VERCEL) {
  app.listen(env.PORT, () => {
    console.log(`Make Me Ready API listening on http://localhost:${env.PORT}`);
  });

  // Asynchronously initialize database and catalog for local server
  initDatabase().catch((err) => {
    console.warn(`Database initialization warning: ${err.message}`);
  });
}

export default app;
