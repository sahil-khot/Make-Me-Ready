import mongoose from "mongoose";

const catalogWardrobeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    cat: { type: String, required: true, index: true },
    tag: { type: String, default: "Casual" },
    img: { type: String, required: true },
  },
  { timestamps: true, collection: "wardrobes" },
);

export const CatalogWardrobe =
  mongoose.models.CatalogWardrobe ||
  mongoose.model("CatalogWardrobe", catalogWardrobeSchema);
