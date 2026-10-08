/**
 * seedService.js
 *
 * Populates MongoDB Atlas with dedicated collections:
 * - occasions        (Occasion model)
 * - wardrobes        (CatalogWardrobe model)
 * - looks            (Look model)
 * - products         (Product model)
 * - configs          (AppConfig model)
 * - catalogitems     (CatalogItem model - backward compatibility)
 *
 * Uses replaceOne + upsert so every startup refreshes Unsplash image URLs
 * and keeps Atlas collections always up to date.
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { createReadStream, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  brands, cats, colors, lookTabs, looks, occasions,
  products, shopCats, styles, wardrobe,
} from "../../frontend/src/data.js";
import {
  CatalogItem, Occasion, CatalogWardrobe, Look, Product, AppConfig, User,
} from "../models/index.js";
import { getGridFSBucket } from "../config/db.js";

const outfitsDir = fileURLToPath(
  new URL("../../frontend/public/img/outfits", import.meta.url)
);
const wardrobeDir = fileURLToPath(
  new URL("../../frontend/public/wardrobe", import.meta.url)
);

/**
 * Uploads local outfit and wardrobe images to MongoDB GridFS (images bucket).
 * Skips files already in GridFS, so re-runs are safe.
 */
export async function seedImages() {
  if (!mongoose.connection?.db) return;

  const bucket = getGridFSBucket();
  const db = mongoose.connection.db;

  const dirsToSeed = [
    { dir: outfitsDir, category: "outfits" },
    { dir: wardrobeDir, category: "wardrobe" },
  ];

  let uploaded = 0;
  let skipped = 0;

  for (const { dir, category } of dirsToSeed) {
    if (!existsSync(dir)) continue;
    const files = readdirSync(dir).filter((f) =>
      /\.(png|jpg|jpeg|webp)$/i.test(f)
    );

    for (const filename of files) {
      try {
        const existing = await db
          .collection("images.files")
          .findOne({ filename });
        if (existing) {
          skipped++;
          continue;
        }

        const ext = filename.split(".").pop().toLowerCase();
        const contentType = ext === "png" ? "image/png" : "image/jpeg";
        const filePath = join(dir, filename);

        await new Promise((resolve, reject) => {
          const readStream = createReadStream(filePath);
          const uploadStream = bucket.openUploadStream(filename, {
            contentType,
            metadata: { category, source: "local-seed" },
          });
          readStream.pipe(uploadStream)
            .on("finish", resolve)
            .on("error", reject);
        });
        uploaded++;
      } catch (err) {
        console.warn(`GridFS upload skipped for ${filename}: ${err.message}`);
      }
    }
  }

  if (uploaded > 0 || skipped > 0) {
    console.log(
      `✓ GridFS images: ${uploaded} uploaded, ${skipped} already existed.`
    );
  }
}

export async function seedCatalog() {
  if (!mongoose.connection?.db) return;

  try {
    // 1. Seed dedicated Occasions collection
    await Occasion.bulkWrite(
      occasions.map((item) => ({
        replaceOne: {
          filter: { id: item.id },
          replacement: { ...item, updatedAt: new Date() },
          upsert: true,
        },
      })),
    );

    // 2. Seed dedicated Wardrobes collection - sync and upsert fresh items
    const validWardrobeIds = wardrobe.map((item) => item.id);
    await CatalogWardrobe.deleteMany({ id: { $nin: validWardrobeIds } });
    await CatalogWardrobe.bulkWrite(
      wardrobe.map((item) => ({
        replaceOne: {
          filter: { id: item.id },
          replacement: { ...item, updatedAt: new Date() },
          upsert: true,
        },
      })),
    );

    // 3. Seed dedicated Looks collection - sync and upsert all fresh looks
    const validLookIds = looks.map((item) => item.id);
    await Look.deleteMany({ id: { $nin: validLookIds } });
    await Look.bulkWrite(
      looks.map((item) => ({
        replaceOne: {
          filter: { id: item.id },
          replacement: { ...item, updatedAt: new Date() },
          upsert: true,
        },
      })),
    );

    // 4. Seed dedicated Products collection - sync and upsert fresh products
    const validProductIds = products.map((item) => item.id);
    await Product.deleteMany({ id: { $nin: validProductIds } });
    await Product.bulkWrite(
      products.map((item) => ({
        replaceOne: {
          filter: { id: item.id },
          replacement: { ...item, updatedAt: new Date() },
          upsert: true,
        },
      })),
    );

    // 5. Seed dedicated AppConfig collection
    await AppConfig.findOneAndUpdate(
      { key: "main" },
      {
        key: "main",
        brands,
        cats,
        colors,
        lookTabs,
        shopCats,
        styles,
        updatedAt: new Date(),
      },
      { upsert: true, returnDocument: "after" },
    );

    // 6. Also keep polymorphic catalogitems collection in sync for legacy compatibility
    const records = [
      ...occasions.map((data) => ({ type: "occasions", key: data.id, data })),
      ...wardrobe.map((data)  => ({ type: "wardrobe",  key: data.id, data })),
      ...looks.map((data)     => ({ type: "looks",     key: data.id, data })),
      ...products.map((data)  => ({ type: "products",  key: data.id, data })),
      {
        type: "config",
        key: "main",
        data: { brands, cats, colors, lookTabs, shopCats, styles },
      },
    ];

    await CatalogItem.bulkWrite(
      records.map(({ type, key, data }) => ({
        replaceOne: {
          filter: { type, key },
          replacement: { type, key, data, updatedAt: new Date() },
          upsert: true,
        },
      })),
    );

    // 7. Ensure demo quick-login user exists
    const demoEmail = "sahil@makemeready.in";
    const existingDemoUser = await User.findOne({ email: demoEmail });
    if (!existingDemoUser) {
      const passwordHash = await bcrypt.hash("Sahil@123", 12);
      await User.create({
        email: demoEmail,
        passwordHash,
        profile: {
          name: "Sahil Khot",
          city: "Mumbai",
          gender: "Male",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
        },
      });
    }

    console.log(
      `✓ Seeded MongoDB Atlas: ${occasions.length} occasions, ${wardrobe.length} wardrobes, ${looks.length} looks, ${products.length} products, configs, and demo account in dedicated collections.`,
    );

    // 8. Upload local outfit images to GridFS
    await seedImages();
  } catch (error) {
    console.error("Error seeding MongoDB Atlas:", error.message);
  }
}

