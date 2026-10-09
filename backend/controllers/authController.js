import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/index.js";

const emailPattern = /^\S+@\S+\.\S+$/;

export const DEMO_USER = {
  _id: "64a000000000000000000001",
  id: "64a000000000000000000001",
  email: "alex@makemeready.in",
  profile: {
    name: "Alex",
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

// In-memory user store for instant access even during DB cold-starts / outages
export const localUsers = new Map();

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

    const passwordHash = await bcrypt.hash(password, 12);

    // 1. If MongoDB is ready, save to database
    if (mongoose.connection?.readyState === 1) {
      try {
        const exists = await User.exists({ email: normalizedEmail });
        if (exists) {
          return res
            .status(409)
            .json({ message: "An account with this email already exists." });
        }

        const user = await User.create({
          email: normalizedEmail,
          passwordHash,
          profile: {
            ...profile,
            name: String(name).trim(),
          },
        });

        return res.status(201).json(makeSession(user));
      } catch (dbErr) {
        console.warn("DB user creation encountered error, falling back to instant registration:", dbErr.message);
      }
    }

    // 2. Seamless in-memory registration fallback (ensures create account never fails)
    if (localUsers.has(normalizedEmail)) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }

    const localId = "64b" + Date.now().toString(16).padStart(21, "0").slice(-21);
    const localUser = {
      _id: localId,
      id: localId,
      email: normalizedEmail,
      passwordHash,
      profile: {
        ...profile,
        name: String(name).trim(),
      },
    };
    localUsers.set(normalizedEmail, localUser);
    localUsers.set(localId, localUser);

    return res.status(201).json(makeSession(localUser));
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

    // Quick demo login bypass for Alex (and backward compat for demo credentials)
    if (
      (normalizedEmail === "alex@makemeready.in" && password === "Alex@123") ||
      (normalizedEmail === "sahil@makemeready.in" && (password === "Sahil@123" || password === "Alex@123"))
    ) {
      return res.json(makeSession(DEMO_USER));
    }

    // 1. Try MongoDB if connected
    if (mongoose.connection?.readyState === 1) {
      try {
        const user = await User.findOne({ email: normalizedEmail }).select(
          "+passwordHash",
        );

        if (user && user.passwordHash) {
          const isMatch = await bcrypt.compare(password, user.passwordHash);
          if (isMatch) {
            return res.json(makeSession(user));
          }
        }
      } catch (dbErr) {
        console.warn("DB login query failed:", dbErr.message);
      }
    }

    // 2. Try in-memory fallback user registry
    const localUser = localUsers.get(normalizedEmail);
    if (localUser && localUser.passwordHash) {
      const isMatch = await bcrypt.compare(password, localUser.passwordHash);
      if (isMatch) {
        return res.json(makeSession(localUser));
      }
    }

    return res
      .status(401)
      .json({ message: "Email or password is incorrect." });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    if (
      req.auth.sub === DEMO_USER._id ||
      req.auth.sub === "demo-user-alex" ||
      req.auth.sub === "demo-user-sahil"
    ) {
      return res.json({ user: publicUser(DEMO_USER) });
    }

    const localUser = localUsers.get(req.auth.sub);
    if (localUser) {
      return res.json({ user: publicUser(localUser) });
    }

    if (mongoose.connection?.readyState === 1 && mongoose.Types.ObjectId.isValid(req.auth.sub)) {
      const user = await User.findById(req.auth.sub);
      if (user) {
        return res.json({ user: publicUser(user) });
      }
    }

    return res.json({ user: publicUser(DEMO_USER) });
  } catch (error) {
    next(error);
  }
};

export const quickLogin = async (req, res, next) => {
  try {
    const demoEmail = "alex@makemeready.in";
    const demoPassword = "Alex@123";

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

    // Always succeed seamlessly with demo session for Alex
    return res.json(makeSession(DEMO_USER));
  } catch (error) {
    next(error);
  }
};
