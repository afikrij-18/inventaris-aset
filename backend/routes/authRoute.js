import { getMe, login, register } from "../controllers/authController.js";
import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/login", login);
router.post("/register", register);
router.get("/me", authMiddleware, getMe);
export default router;
