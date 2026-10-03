import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import {
  getUserState,
  updateProfile,
  toggleFavorite,
  toggleSavedLook,
  addToCart,
} from "../controllers/userController.js";

const router = Router();

router.use(authRequired);

router.get("/state", getUserState);
router.patch("/profile", updateProfile);
router.put("/favorites", toggleFavorite);
router.put("/saved-looks", toggleSavedLook);
router.post("/cart", addToCart);

export default router;
