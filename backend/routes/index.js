import { Router } from "express";
import authRoutes from "./authRoutes.js";
import catalogRoutes from "./catalogRoutes.js";
import userRoutes from "./userRoutes.js";
import wardrobeRoutes from "./wardrobeRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/catalog", catalogRoutes);
router.use("/wardrobe", wardrobeRoutes);
router.use("/", userRoutes);

export default router;
