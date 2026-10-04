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
import {
  brands, cats, colors, lookTabs, looks, occasions,
  products, shopCats, styles, wardrobe,
} from "../../frontend/src/data.js";
import {
  CatalogItem, Occasion, CatalogWardrobe, Look, Product, AppConfig, User,
} from "../models/index.js";

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

    // 2. Seed dedicated Wardrobes collection
    await CatalogWardrobe.bulkWrite(
      wardrobe.map((item) => ({
        replaceOne: {
          filter: { id: item.id },
          replacement: { ...item, updatedAt: new Date() },
          upsert: true,
        },
      })),
    );

    // 3. Seed dedicated Looks collection
    await Look.bulkWrite(
      looks.map((item) => ({
        replaceOne: {
          filter: { id: item.id },
          replacement: { ...item, updatedAt: new Date() },
          upsert: true,
        },
      })),
    );

    // 4. Seed dedicated Products collection
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
  } catch (error) {
    console.error("Error seeding MongoDB Atlas:", error.message);
  }
}

// Legacy stub
export async function seedImages() {}
