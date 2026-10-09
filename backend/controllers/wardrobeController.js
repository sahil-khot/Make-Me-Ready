import { randomUUID } from "node:crypto";
import { WardrobeItem } from "../models/index.js";
import { getGridFSBucket } from "../config/db.js";

const extensionMap = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const formatImageUrl = (img) => {
  if (!img) return "/img/white-shirt.jpg";
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/")) {
    return img;
  }
  return `/img/${encodeURIComponent(img)}`;
};

export const addWardrobeItem = async (req, res, next) => {
  try {
    const name = String(req.body?.name || "").trim();
    const cat = String(req.body?.cat || "").trim();

    if (!name || !cat) {
      return res
        .status(400)
        .json({ message: "Item name and category are required." });
    }

    let imageFile = "white-shirt.jpg";

    if (req.file) {
      const ext = extensionMap[req.file.mimetype] || "jpg";
      imageFile = `user-${req.auth.sub}-${randomUUID()}.${ext}`;

      const bucket = getGridFSBucket();
      if (bucket) {
        await new Promise((resolve, reject) => {
          const stream = bucket.openUploadStream(imageFile, {
            contentType: req.file.mimetype,
            metadata: { owner: req.auth.sub },
          });
          stream.on("error", reject);
          stream.on("finish", resolve);
          stream.end(req.file.buffer);
        });
      }
    } else if (req.body?.imageFile || req.body?.img) {
      imageFile = String(req.body.imageFile || req.body.img).trim();
    }

    const item = await WardrobeItem.create({
      userId: req.auth.sub,
      name,
      cat,
      tag: String(req.body?.tag || "Casual"),
      brand: String(req.body?.brand || ""),
      color: String(req.body?.color || ""),
      size: String(req.body?.size || ""),
      imageFile,
    });

    return res.status(201).json({
      item: {
        id: item._id.toString(),
        name: item.name,
        cat: item.cat,
        tag: item.tag,
        brand: item.brand,
        color: item.color,
        size: item.size,
        img: formatImageUrl(item.imageFile),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getWardrobeItems = async (req, res, next) => {
  try {
    const items = await WardrobeItem.find({ userId: req.auth.sub })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      wardrobe: items.map((item) => ({
        id: item._id.toString(),
        name: item.name,
        cat: item.cat,
        tag: item.tag,
        brand: item.brand,
        color: item.color,
        size: item.size,
        img: formatImageUrl(item.imageFile),
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const removeWardrobeItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Item ID is required." });
    }

    await WardrobeItem.findOneAndDelete({
      _id: id,
      userId: req.auth.sub,
    });

    return res.json({ success: true, message: "Item removed successfully." });
  } catch (error) {
    next(error);
  }
};
