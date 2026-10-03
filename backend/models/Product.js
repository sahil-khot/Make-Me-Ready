import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 4.5 },
    reviews: { type: String, default: "1k" },
    cat: { type: String, required: true, index: true },
    g: { type: String, required: true },
    brand: { type: String, default: "" },
    img: { type: String, required: true },
  },
  { timestamps: true },
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
