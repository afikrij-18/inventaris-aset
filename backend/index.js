import express from "express";
import cors from "cors";
import db from "./config/database.js";
import "./models/index.js";
import authRoute from "./routes/authRoute.js";
import kategoriRoute from "./routes/kategoriRoute.js";
import asetRoute from "./routes/asetRoute.js";
const app = express();
const PORT = 3000;
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.json({ message: "API Inventaris Aset aktif" });
});
app.use("/api/auth", authRoute);
app.use("/api/kategori", kategoriRoute);
app.use("/api/aset", asetRoute);
const startServer = async () => {
  try {
    await db.authenticate();
    await db.sync();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Gagal menjalankan server:", error);
  }
};
startServer();
