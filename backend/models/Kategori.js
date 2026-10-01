import { DataTypes } from "sequelize";
import db from "../config/database.js";
const Kategori = db.define(
  "kategori",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_kategori: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    aktif: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValues: true,
    },
  },
  {
    tableName: "kategori",
  },
);
export default Kategori;
