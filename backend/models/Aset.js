// backend/models/Aset.js
import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Aset = db.define(
  "aset",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    kode_aset: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nama_aset: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kategori_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    kondisi: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Baik",
    },
    lokasi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // TAMBAHAN: Field tanggal perolehan
    tanggal_perolehan: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "aset",
  }
);

export default Aset;