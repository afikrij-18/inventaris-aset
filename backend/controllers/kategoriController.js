import { fn, col, Op } from "sequelize";
import { Aset, Kategori } from "../models/index.js";

const serverError = (res, error) => {
  console.error(error);
  return res.status(500).json({ message: "Terjadi kesalahan pada server" });
};

const validasiNama = (nama) => {
  if (!nama || nama.trim().length < 3) {
    return "Nama kategori minimal 3 karakter";
  }
  return null;
};

export const getKategori = async (req, res) => {
  try {
    const { aktif } = req.query;
    const where = {};
    if (aktif === "true") {
      where.aktif = true;
    }

    const data = await Kategori.findAll({
      where,
      attributes: [
        "id",
        "nama_kategori",
        "aktif",
        [fn("COUNT", col("aset.id")), "total_aset"],
      ],
      include: [
        {
          model: Aset,
          as: "aset",
          attributes: [],
        },
      ],
      // Perhatikan bagian group ini, pastikan mencakup seluruh kolom non-agregat yang dipilih di attributes
      group: ["kategori.id", "kategori.nama_kategori", "kategori.aktif"],
      order: [["nama_kategori", "ASC"]],
      raw: true,
    });
    return res.status(200).json({ data });
  } catch (error) {
    return serverError(res, error);
  }
};

export const getKategoriById = async (req, res) => {
  try {
    const data = await Kategori.findOne({ where: { id: req.params.id } });
    if (!data) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    return res.status(200).json({ data });
  } catch (error) {
    return serverError(res, error);
  }
};

export const createKategori = async (req, res) => {
  try {
    const pesan = validasiNama(req.body.nama_kategori);
    if (pesan) return res.status(400).json({ message: pesan });
    const nama_kategori = req.body.nama_kategori.trim();
    
    const sudahAda = await Kategori.findOne({ where: { nama_kategori } });
    if (sudahAda) {
      // Jika kategori sebelumnya nonaktif dan dibuat lagi, diaktifkan kembali
      if (!sudahAda.aktif) {
        await sudahAda.update({ aktif: true });
        // PERBAIKAN DI SINI (menggunakan res.status, bukan return.status)
        return res.status(200).json({ message: "Kategori berhasil diaktifkan kembali", data: sudahAda });
      }
      return res.status(409).json({ message: "Nama kategori sudah digunakan" });
    }

    const data = await Kategori.create({ nama_kategori, aktif: true });
    return res.status(201).json({ message: "Kategori berhasil ditambahkan", data });
  } catch (error) {
    return serverError(res, error);
  }
};

export const updateKategori = async (req, res) => {
  try {
    const kategori = await Kategori.findByPk(req.params.id);
    if (!kategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    const pesan = validasiNama(req.body.nama_kategori);
    if (pesan) return res.status(400).json({ message: pesan });
    
    const nama_kategori = req.body.nama_kategori.trim();
    const sudahAda = await Kategori.findOne({
      where: { nama_kategori, id: { [Op.ne]: kategori.id } },
    });
    if (sudahAda) {
      return res.status(409).json({ message: "Nama kategori sudah digunakan" });
    }

    // Bisa juga mengizinkan update status aktif dari request body jika diperlukan
    const aktif = req.body.aktif !== undefined ? req.body.aktif : kategori.aktif;

    await kategori.update({ nama_kategori, aktif });
    return res.status(200).json({ message: "Kategori berhasil diperbarui", data: kategori });
  } catch (error) {
    return serverError(res, error);
  }
};

export const deleteKategori = async (req, res) => {
  try {
    const kategori = await Kategori.findByPk(req.params.id);
    if (!kategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    
    // Cek apakah kategori masih dipakai oleh aset
    const totalAset = await Aset.count({ where: { kategori_id: kategori.id } });
    if (totalAset > 0) {
      return res.status(400).json({
        message: `Kategori masih dipakai oleh ${totalAset} aset dan tidak dapat dihapus`,
      });
    }

    await kategori.destroy();
    return res.status(200).json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    return serverError(res, error);
  }
};

export const toggleAktifKategori = async (req, res) => {
  try {
    const kategori = await Kategori.findByPk(req.params.id);
    if (!kategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    // Balik status aktif saat ini
    const statusBaru = !kategori.aktif;
    await kategori.update({ aktif: statusBaru });

    const pesan = statusBaru ? "Kategori berhasil diaktifkan" : "Kategori berhasil dinonaktifkan";
    return res.status(200).json({ message: pesan, data: kategori });
  } catch (error) {
    return serverError(res, error);
  }
};
