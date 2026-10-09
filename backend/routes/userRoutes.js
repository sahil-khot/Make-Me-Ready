import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import {
  getUserState,
  updateProfile,
  toggleFavorite,
  toggleSavedLook,
  addToCart,
  removeFromCart,
  clearCart,
  changePassword,
} from "../controllers/userController.js";

const router = Router();

router.use(authRequired);

router.get("/state", getUserState);
router.patch("/profile", updateProfile);
router.post("/change-password", changePassword);
router.put("/favorites", toggleFavorite);
router.put("/saved-looks", toggleSavedLook);
router.post("/cart", addToCart);
router.delete("/cart/:id", removeFromCart);
router.delete("/cart", clearCart);

export default router;
