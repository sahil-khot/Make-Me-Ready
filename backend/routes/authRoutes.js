import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, getMe, quickLogin } from "../controllers/authController.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/quick-login", authLimiter, quickLogin);
router.get("/me", authRequired, getMe);

export default router;
