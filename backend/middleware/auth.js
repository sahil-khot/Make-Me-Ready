import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const authRequired = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return res.status(401).json({ message: "Sign in to continue." });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.auth = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Your session expired or is invalid. Please sign in again.",
    });
  }
};
