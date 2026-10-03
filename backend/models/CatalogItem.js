import mongoose from "mongoose";

const catalogSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    type: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);
catalogSchema.index({ type: 1, key: 1 }, { unique: true });

export const CatalogItem =
  mongoose.models.CatalogItem || mongoose.model("CatalogItem", catalogSchema);
