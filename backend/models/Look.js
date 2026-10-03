import mongoose from "mongoose";

const lookSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    occ: { type: String, required: true, index: true },
    tags: [{ type: String }],
    img: { type: String, required: true },
    items: [{ type: String }],
  },
  { timestamps: true },
);

export const Look = mongoose.models.Look || mongoose.model("Look", lookSchema);
