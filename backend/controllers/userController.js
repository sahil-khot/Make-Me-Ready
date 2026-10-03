import { User, WardrobeItem, CatalogItem } from "../models/index.js";
import { publicUser } from "./authController.js";
import { products } from "../../frontend/src/data.js";

export const getUserState = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.sub);
    if (!user) {
      return res.status(401).json({ message: "Account not found." });
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
        img: `/img/${encodeURIComponent(item.imageFile)}`,
      })),
    });
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
      "colors",
      "styles",
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

    // Try finding in DB catalog
    const catalogItem = await CatalogItem.findOne({
      type: "products",
      key: productId,
    }).lean();

    if (catalogItem) {
      productData = catalogItem.data;
    } else {
      // Fallback search in products from data.js
      productData = products.find((p) => p.id === productId);
    }

    if (!productData) {
      return res.status(404).json({ message: "Product not found." });
    }

    const user = await User.findById(req.auth.sub);
    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    user.cart = user.cart || [];
    user.cart.push({
      productId,
      name: productData.name,
      price: productData.price,
      image: productData.img,
    });

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
