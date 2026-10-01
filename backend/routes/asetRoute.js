import express from "express";
import {
  getAset,
  getAsetById,
  createAset,
  updateAset,
  deleteAset,
  getStatistik,
} from "../controllers/asetController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { uploadFoto } from "../middleware/upload.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
const router = express.Router();
router.use(authMiddleware);
router.get("/statistik", getStatistik);
router.get("/", getAset);
router.get("/:id", getAsetById);
router.post("/", uploadFoto, createAset);
router.patch("/:id", uploadFoto, updateAset);
// router.delete("/:id", deleteAset);
router.delete("/:id", authMiddleware, adminMiddleware, deleteAset);
export default router;
