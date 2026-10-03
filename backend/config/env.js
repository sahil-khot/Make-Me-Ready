import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const backendEnv = fileURLToPath(new URL("../.env", import.meta.url));
const rootEnv = fileURLToPath(new URL("../../.env", import.meta.url));

if (existsSync(backendEnv)) {
  dotenv.config({ path: backendEnv });
} else if (existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
} else {
  dotenv.config();
}

export const env = {
  PORT: Number(process.env.PORT || 3001),
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/make_me_ready",
  JWT_SECRET:
    process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 16
      ? process.env.JWT_SECRET
      : "super_secret_make_me_ready_jwt_token_key_development_2026_xyz",
  CLIENT_ORIGIN: (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((item) => item.trim()),
};
