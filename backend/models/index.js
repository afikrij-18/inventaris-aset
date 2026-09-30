import User from "./User.js";
import Kategori from "./Kategori.js";
import Aset from "./Aset.js";
Kategori.hasMany(Aset, {
  foreignKey: "kategori_id",
  as: "aset",
  onDelete: "RESTRICT",
});
Aset.belongsTo(Kategori, {
  foreignKey: "kategori_id",
  as: "kategori",
  onDelete: "RESTRICT",
});
export { User, Kategori, Aset };
