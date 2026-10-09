import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User, WardrobeItem, CatalogItem, Product } from "../models/index.js";
import { publicUser, DEMO_USER, localUsers } from "./authController.js";
import { products } from "../../frontend/src/data.js";

const formatImageUrl = (img) => {
  if (!img) return "/img/white-shirt.jpg";
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/")) {
    return img;
  }
  return `/img/${encodeURIComponent(img)}`;
};

export const getUserState = async (req, res, next) => {
  try {
    const isDemo =
      req.auth.sub === DEMO_USER._id ||
      req.auth.sub === "demo-user-alex" ||
      req.auth.sub === "demo-user-sahil";
    const dbConnected = mongoose.connection?.readyState === 1;

    const localUser = localUsers?.get(req.auth.sub);
    if (localUser) {
      return res.json({
        user: publicUser(localUser),
        favorites: localUser.favorites || [],
        savedLooks: localUser.savedLooks || [],
        cart: localUser.cart || [],
        wardrobe: [],
      });
    }

    if (dbConnected && mongoose.Types.ObjectId.isValid(req.auth.sub)) {
      try {
        const user = await User.findById(req.auth.sub);
        if (user) {
          if (user.profile?.avatar?.includes("534528741775-53994a69daeb")) {
            user.profile.avatar = "";
            await user.save();
          }

          const wardrobe = await WardrobeItem.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .lean();

          return res.json({
            user: publicUser(user),
            favorites: user.favorites || [],
            savedLooks: user.savedLooks || [],
            cart: (user.cart || []).map((line) => ({
              id: line.productId,
              name: line.name,
              price: line.price,
              img: line.image,
            })),
            wardrobe: wardrobe.map((item) => ({
              id: item._id.toString(),
              name: item.name,
              cat: item.cat,
              tag: item.tag,
              img: formatImageUrl(item.imageFile),
            })),
          });
        }
      } catch (err) {
        console.warn("DB query in getUserState failed:", err.message);
      }
    }

    if (isDemo || !dbConnected) {
      return res.json({
        user: publicUser(DEMO_USER),
        favorites: [],
        savedLooks: [],
        cart: [],
        wardrobe: [],
      });
    }

    return res.status(401).json({ message: "Account not found." });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowed = [
      "name",
      "phone",
      "gender",
      "dob",
      "height",
      "weight",
      "body",
      "location",
      "city",
      "tagline",
      "avatar",
      "colors",
      "styles",
      "brands",
      "occasions",
      "shirtSize",
      "pantsSize",
      "shoeSize",
      "otherMeasurements",
      "fashionPreferences",
      "addresses",
    ];

    // Filter only allowed keys and trim string values
    const updates = Object.fromEntries(
      Object.entries(req.body || {})
        .filter(([key]) => allowed.includes(key))
        .map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ]),
    );

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided to update." });
    }

    if (updates.name !== undefined && !updates.name) {
      return res.status(400).json({ message: "Name cannot be empty." });
    }

    const isDemo = req.auth.sub === DEMO_USER._id || req.auth.sub === "demo-user-sahil";
    const dbConnected = mongoose.connection?.readyState === 1;

    if (!dbConnected || isDemo) {
      return res.json({
        user: {
          ...publicUser(DEMO_USER),
          ...updates,
        },
      });
    }

    const updateFields = Object.fromEntries(
      Object.entries(updates).map(([key, value]) => [`profile.${key}`, value]),
    );

    const user = await User.findByIdAndUpdate(
      req.auth.sub,
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    return res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const id = String(req.body?.id || "");
    if (!id || id.length > 120) {
      return res.status(400).json({ message: "Favorite ID is required." });
    }

    const isDemo = req.auth.sub === DEMO_USER._id || req.auth.sub === "demo-user-sahil";
    const dbConnected = mongoose.connection?.readyState === 1;

    if (!dbConnected || isDemo) {
      return res.json({ favorites: [id] });
    }

    const user = await User.findById(req.auth.sub);
    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    user.favorites = user.favorites || [];
    user.favorites = user.favorites.includes(id)
      ? user.favorites.filter((item) => item !== id)
      : [...user.favorites, id];

    await user.save();
    return res.json({ favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

export const toggleSavedLook = async (req, res, next) => {
  try {
    const id = String(req.body?.id || "");
    if (!id || id.length > 120) {
      return res.status(400).json({ message: "Look ID is required." });
    }

    const isDemo = req.auth.sub === DEMO_USER._id || req.auth.sub === "demo-user-sahil";
    const dbConnected = mongoose.connection?.readyState === 1;

    if (!dbConnected || isDemo) {
      return res.json({ savedLooks: [id] });
    }

    const user = await User.findById(req.auth.sub);
    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    user.savedLooks = user.savedLooks || [];
    user.savedLooks = user.savedLooks.includes(id)
      ? user.savedLooks.filter((item) => item !== id)
      : [...user.savedLooks, id];

    await user.save();
    return res.json({ savedLooks: user.savedLooks });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const productId = String(req.body?.id || "");
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    let productData = null;

    if (mongoose.connection?.readyState === 1) {
      const prodDoc = await Product.findOne({ id: productId }).lean();
      if (prodDoc) {
        productData = prodDoc;
      } else {
        const catalogItem = await CatalogItem.findOne({
          type: "products",
          key: productId,
        }).lean();
        if (catalogItem) {
          productData = catalogItem.data;
        }
      }
    }

    if (!productData) {
      productData = products.find((p) => p.id === productId);
    }

    if (!productData) {
      return res.status(404).json({ message: "Product not found." });
    }

    const isDemo = req.auth.sub === DEMO_USER._id || req.auth.sub === "demo-user-sahil";
    const dbConnected = mongoose.connection?.readyState === 1;

    if (!dbConnected || isDemo) {
      return res.json({
        cart: [
          {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            img: productData.img,
          },
        ],
      });
    }

    const user = await User.findById(req.auth.sub);
    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    user.cart = user.cart || [];
    const alreadyExists = user.cart.some((c) => c.productId === productId);
    if (!alreadyExists) {
      user.cart.push({
        productId,
        name: productData.name,
        price: productData.price,
        image: productData.img,
      });
      await user.save();
    }

    return res.json({
      cart: user.cart.map((line) => ({
        id: line.productId,
        name: line.name,
        price: line.price,
        img: line.image,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isDemo = req.auth.sub === DEMO_USER._id || req.auth.sub === "demo-user-sahil";
    const dbConnected = mongoose.connection?.readyState === 1;

    if (!dbConnected || isDemo) {
      return res.json({ cart: [] });
    }

    const user = await User.findById(req.auth.sub);
    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    user.cart = (user.cart || []).filter((item) => item.productId !== id);
    await user.save();

    return res.json({
      cart: user.cart.map((line) => ({
        id: line.productId,
        name: line.name,
        price: line.price,
        img: line.image,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const isDemo = req.auth.sub === DEMO_USER._id || req.auth.sub === "demo-user-sahil";
    const dbConnected = mongoose.connection?.readyState === 1;

    if (!dbConnected || isDemo) {
      return res.json({ cart: [] });
    }

    const user = await User.findById(req.auth.sub);
    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    user.cart = [];
    await user.save();

    return res.json({ cart: [] });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required." });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters long." });
    }

    const isDemo = req.auth.sub === DEMO_USER._id || req.auth.sub === "demo-user-sahil";
    const dbConnected = mongoose.connection?.readyState === 1;

    if (!dbConnected || isDemo) {
      return res.json({ message: "Password updated successfully." });
    }

    const user = await User.findById(req.auth.sub).select("+passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password." });
    }
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();
    return res.json({ message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
};
