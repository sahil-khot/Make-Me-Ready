import mongoose from "mongoose";

const lookSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    occ: { type: String, required: true, index: true },
    gender: { type: String, default: "Men", index: true },
    matchScore: { type: Number, default: 95 },
    tags: [{ type: String }],
    img: { type: String, required: true },
    items: [{ type: String }],
  },
  { timestamps: true },
);

export const Look = mongoose.models.Look || mongoose.model("Look", lookSchema);
