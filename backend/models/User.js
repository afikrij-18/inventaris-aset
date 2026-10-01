import { DataTypes } from "sequelize";
import db from "../config/database.js";

const User = db.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "petugas"),
      allowNull: false,
      defaultValue: "petugas",
    },
  },
  { tableName: "users" },
);

export default User;

// Otomatis membuat tabel di database jika belum ada
// (async () => {
//   await db.sync();
// })();
