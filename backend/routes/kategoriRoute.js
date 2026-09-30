import express from "express";
import {
  getKategori,
  getKategoriById,
  createKategori,
  updateKategori,
  deleteKategori,
} from "../controllers/kategoriController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();
router.use(authMiddleware);
router.get("/", getKategori);
router.get("/:id", getKategoriById);
router.post("/", createKategori);
router.patch("/:id", updateKategori);
router.delete("/:id", deleteKategori);
export default router;
