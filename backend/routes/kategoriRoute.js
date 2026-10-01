import express from "express";
import {
  getKategori,
  getKategoriById,
  createKategori,
  updateKategori,
  deleteKategori,
  toggleAktifKategori,
} from "../controllers/kategoriController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
const router = express.Router();
router.use(authMiddleware);
router.get("/", getKategori);
router.get("/:id", getKategoriById);
router.post("/", createKategori);
router.patch("/:id", updateKategori);
// router.delete("/:id", deleteKategori);
router.delete("/:id", authMiddleware, adminMiddleware, deleteKategori)
router.patch("/:id/toggle", toggleAktifKategori);
export default router;
