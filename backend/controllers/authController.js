import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/index.js";

const emailPattern = /^\S+@\S+\.\S+$/;

export const DEMO_USER = {
  _id: "64a000000000000000000001",
  id: "64a000000000000000000001",
  email: "sahil@makemeready.in",
  profile: {
    name: "Sahil Khot",
    city: "Mumbai",
    gender: "Male",
    avatar: "",
    styles: ["Casual", "Minimal"],
    occasions: ["Office / Work", "Party"],
    brands: ["NIKE", "adidas"],
    pantsSize: "32",
    shirtSize: "L",
    shoeSize: "UK 9",
    tagline: "Style that completes you.",
  },
};

export const publicUser = (user) => {
  if (!user) return null;
  const profile = user.profile
    ? typeof user.profile.toObject === "function"
      ? user.profile.toObject()
      : user.profile
    : {};
  return {
    id: user._id?.toString() || user.id,
    email: user.email,
    ...profile,
  };
};

export const makeSession = (user) => ({
  token: jwt.sign(
    { sub: (user._id || user.id || DEMO_USER._id).toString() },
    env.JWT_SECRET,
    { expiresIn: "7d" },
  ),
  user: publicUser(user),
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password, ...profile } = req.body || {};
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!String(name || "").trim() || !emailPattern.test(normalizedEmail)) {
      return res
        .status(400)
        .json({ message: "Enter a name and a valid email address." });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    }

    if (mongoose.connection?.readyState !== 1) {
      return res.status(503).json({
        message:
          "Database is currently unavailable. Please verify your MongoDB Atlas connection string in Vercel settings, or click Quick Login to explore immediately.",
      });
    }

    const exists = await User.exists({ email: normalizedEmail });
    if (exists) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      profile: {
        ...profile,
        name: String(name).trim(),
      },
    });

    return res.status(201).json(makeSession(user));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const normalizedEmail = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || "");

    if (!normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Demo account fallback if database is offline or connecting
    if (
      normalizedEmail === "sahil@makemeready.in" &&
      password === "Sahil@123" &&
      mongoose.connection?.readyState !== 1
    ) {
      return res.json(makeSession(DEMO_USER));
    }

    if (mongoose.connection?.readyState !== 1) {
      return res.status(503).json({
        message:
          "Database connection is not ready. Please use Quick Login or verify your MongoDB Atlas connection string in Vercel settings.",
      });
    }

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+passwordHash",
    );

    if (
      !user ||
      !user.passwordHash ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect." });
    }

    return res.json(makeSession(user));
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    if (
      req.auth.sub === DEMO_USER._id ||
      req.auth.sub === "demo-user-sahil" ||
      mongoose.connection?.readyState !== 1
    ) {
      return res.json({ user: publicUser(DEMO_USER) });
    }

    const user = await User.findById(req.auth.sub);
    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }
    return res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const quickLogin = async (req, res, next) => {
  try {
    const demoEmail = "sahil@makemeready.in";
    const demoPassword = "Sahil@123";

    if (mongoose.connection?.readyState === 1) {
      try {
        let user = await User.findOne({ email: demoEmail });

        if (!user) {
          const passwordHash = await bcrypt.hash(demoPassword, 12);
          user = await User.create({
            email: demoEmail,
            passwordHash,
            profile: DEMO_USER.profile,
          });
        } else if (user.profile?.avatar?.includes("534528741775-53994a69daeb")) {
          user.profile.avatar = "";
          await user.save();
        }

        return res.json(makeSession(user));
      } catch (dbErr) {
        console.warn("DB query in quickLogin failed, falling back to demo user:", dbErr.message);
      }
    }

    // Always succeed seamlessly with demo session
    return res.json(makeSession(DEMO_USER));
  } catch (error) {
    next(error);
  }
};
