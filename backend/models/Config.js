import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    brands: [{ type: String }],
    cats: [{ type: String }],
    colors: { type: mongoose.Schema.Types.Mixed },
    lookTabs: [{ type: String }],
    shopCats: { type: mongoose.Schema.Types.Mixed },
    styles: [{ type: String }],
  },
  { timestamps: true, collection: "configs" },
);

export const AppConfig =
  mongoose.models.AppConfig || mongoose.model("AppConfig", configSchema);
