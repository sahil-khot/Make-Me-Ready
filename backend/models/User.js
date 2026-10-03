import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, default: "" },
    gender: { type: String, default: "" },
    dob: { type: String, default: "" },
    height: { type: String, default: "" },
    weight: { type: String, default: "" },
    body: { type: String, default: "" },
    location: { type: String, default: "" },
    avatar: { type: String, default: "" },
    colors: { type: [String], default: [] },
    styles: { type: [String], default: [] },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    profile: { type: profileSchema, required: true },
    favorites: { type: [String], default: [] },
    savedLooks: { type: [String], default: [] },
    cart: {
      type: [{ productId: String, name: String, price: Number, image: String }],
      default: [],
    },
  },
  { timestamps: true },
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
