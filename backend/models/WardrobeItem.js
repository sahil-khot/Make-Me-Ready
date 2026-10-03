import mongoose from "mongoose";

const wardrobeItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    cat: { type: String, required: true, maxlength: 40 },
    tag: { type: String, default: "Casual", maxlength: 40 },
    imageFile: { type: String, required: true },
  },
  { timestamps: true },
);

export const WardrobeItem =
  mongoose.models.WardrobeItem ||
  mongoose.model("WardrobeItem", wardrobeItemSchema);
