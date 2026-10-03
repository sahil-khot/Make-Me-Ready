import mongoose from "mongoose";

const occasionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    sub: { type: String, required: true },
    group: { type: String, required: true, index: true },
    img: { type: String, required: true },
  },
  { timestamps: true },
);

export const Occasion =
  mongoose.models.Occasion || mongoose.model("Occasion", occasionSchema);
