import { createReadStream, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import {
  brands,
  cats,
  colors,
  lookTabs,
  looks,
  occasions,
  products,
  shopCats,
  styles,
  wardrobe,
} from "../../frontend/src/data.js";
import { CatalogItem } from "../models/index.js";
import { getGridFSBucket } from "../config/db.js";

const imageDirectory = fileURLToPath(
  new URL("../../frontend/public/img/", import.meta.url),
);

export async function seedImages() {
  if (!mongoose.connection?.db) return;
  const bucket = getGridFSBucket();
  const collection = mongoose.connection.db.collection("images.files");

  if (!existsSync(imageDirectory)) return;

  for (const filename of readdirSync(imageDirectory)) {
    if (!/\.(jpe?g|png|webp|gif)$/i.test(filename)) continue;
    const exists = await collection.findOne(
      { filename },
      { projection: { _id: 1 } },
    );
    if (exists) continue;

    await new Promise((resolve, reject) => {
      const upload = bucket.openUploadStream(filename, {
        contentType: `image/${filename.split(".").pop().replace("jpg", "jpeg")}`,
      });
      upload.on("error", reject);
      upload.on("finish", resolve);
      createReadStream(join(imageDirectory, filename)).pipe(upload);
    });
  }
}

export async function seedCatalog() {
  if (!mongoose.connection?.db) return;
  const records = [
    ...occasions.map((data) => ({ type: "occasions", key: data.id, data })),
    ...wardrobe.map((data) => ({ type: "wardrobe", key: data.id, data })),
    ...looks.map((data) => ({ type: "looks", key: data.id, data })),
    ...products.map((data) => ({ type: "products", key: data.id, data })),
    {
      type: "config",
      key: "main",
      data: { brands, cats, colors, lookTabs, shopCats, styles },
    },
  ];

  await CatalogItem.bulkWrite(
    records.map(({ type, key, data }) => ({
      updateOne: {
        filter: { type, key },
        update: { $setOnInsert: { type, key, data } },
        upsert: true,
      },
    })),
  );
}

export function getImageBucket() {
  return getGridFSBucket();
}
