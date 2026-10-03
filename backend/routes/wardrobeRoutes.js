import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  addWardrobeItem,
  getWardrobeItems,
} from "../controllers/wardrobeController.js";

const router = Router();

router.use(authRequired);

router.post("/", upload.single("image"), addWardrobeItem);
router.get("/", getWardrobeItems);

export default router;
