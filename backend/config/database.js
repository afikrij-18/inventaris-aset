import { Sequelize } from "sequelize";

const db = new Sequelize ("inventaris_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

export default db;

// (async () => {
//   await db.sync();
// })();