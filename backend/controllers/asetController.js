import fs from "fs";
import path from "path";
import { Op, fn, col } from "sequelize";
import { Aset, Kategori } from "../models/index.js";

const KONDISI = ["Baik", "Rusak Ringan", "Rusak Berat"];

const includeKategori = {
  model: Kategori,
  as: "kategori",
  attributes: ["id", "nama_kategori"],
};

const serverError = (res, error) => {
  console.error(error);
  return res.status(500).json({ message: "Terjadi kesalahan pada server" });
};

const hapusFile = (namaFile) => {
  if (!namaFile) return;
  fs.unlink(path.join("uploads", namaFile), () => {});
};

const validasiAset = (body) => {
  const {
    kode_aset,
    nama_aset,
    kategori_id,
    jumlah,
    kondisi,
    tanggal_perolehan,
  } = body;

  if (!kode_aset || !kode_aset.trim()) return "Kode aset wajib diisi";
  if (!nama_aset || nama_aset.trim().length < 3) {
    return "Nama aset minimal 3 karakter";
  }
  if (!kategori_id) return "Kategori wajib dipilih";
  if (!Number.isInteger(Number(jumlah)) || Number(jumlah) < 1) {
    return "Jumlah harus berupa angka bulat minimal 1";
  }
  if (!KONDISI.includes(kondisi)) {
    return "Kondisi harus Baik, Rusak Ringan, atau Rusak Berat";
  }

  // LATIHAN: Validasi tanggal perolehan (tidak boleh lebih dari hari ini)
  if (tanggal_perolehan) {
    const tglInput = new Date(tanggal_perolehan);
    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);

    if (isNaN(tglInput.getTime())) {
      return "Format tanggal perolehan tidak valid";
    }
    if (tglInput > hariIni) {
      return "Tanggal perolehan tidak boleh lebih besar dari hari ini";
    }
  }

  return null;
};

export const getAset = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 5, 1), 50);
    const offset = (page - 1) * limit;

    // LATIHAN: Tangkap parameter sort dan order dari query string
    const { search, kategori_id, kondisi, sort, order } = req.query;

    const where = {};
    if (search) {
      where[Op.or] = [
        { nama_aset: { [Op.like]: `%${search}%` } },
        { kode_aset: { [Op.like]: `%${search}%` } },
      ];
    }
    if (kategori_id) where.kategori_id = kategori_id;
    if (kondisi) where.kondisi = kondisi;

    // LATIHAN: Atur kolom sorting yang diizinkan untuk keamanan
    const allowedSortColumns = [
      "nama_aset",
      "kode_aset",
      "jumlah",
      "createdAt",
      "tanggal_perolehan",
    ];
    const sortBy = allowedSortColumns.includes(sort) ? sort : "createdAt";
    const sortOrder = order && order.toLowerCase() === "asc" ? "ASC" : "DESC";

    const { count, rows } = await Aset.findAndCountAll({
      where,
      include: [includeKategori],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    return res.status(200).json({
      data: rows,
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    return serverError(res, error);
  }
};

export const getAsetById = async (req, res) => {
  try {
    const data = await Aset.findByPk(req.params.id, {
      include: [includeKategori],
    });
    if (!data) {
      return res.status(404).json({ message: "Aset tidak ditemukan" });
    }
    return res.status(200).json({ data });
  } catch (error) {
    return serverError(res, error);
  }
};

export const createAset = async (req, res) => {
  const foto = req.file ? req.file.filename : null;
  try {
    const pesan = validasiAset(req.body);
    if (pesan) {
      hapusFile(foto);
      return res.status(400).json({ message: pesan });
    }
    const kategori = await Kategori.findByPk(req.body.kategori_id);
    if (!kategori) {
      hapusFile(foto);
      return res.status(400).json({ message: "Kategori tidak ditemukan" });
    }
    const kode_aset = req.body.kode_aset.trim();
    const duplikat = await Aset.findOne({ where: { kode_aset } });
    if (duplikat) {
      hapusFile(foto);
      return res.status(409).json({ message: "Kode aset sudah digunakan" });
    }
    const data = await Aset.create({
      kode_aset,
      nama_aset: req.body.nama_aset.trim(),
      kategori_id: kategori.id,
      jumlah: Number(req.body.jumlah),
      kondisi: req.body.kondisi,
      lokasi: req.body.lokasi?.trim() || null,
      foto,
      // LATIHAN: Menyimpan tanggal perolehan
      tanggal_perolehan: req.body.tanggal_perolehan || null,
    });
    return res.status(201).json({ message: "Aset berhasil ditambahkan", data });
  } catch (error) {
    hapusFile(foto);
    return serverError(res, error);
  }
};

export const updateAset = async (req, res) => {
  const fotoBaru = req.file ? req.file.filename : null;
  try {
    const aset = await Aset.findByPk(req.params.id);
    if (!aset) {
      hapusFile(fotoBaru);
      return res.status(404).json({ message: "Aset tidak ditemukan" });
    }
    const pesan = validasiAset(req.body);
    if (pesan) {
      hapusFile(fotoBaru);
      return res.status(400).json({ message: pesan });
    }
    const kategori = await Kategori.findByPk(req.body.kategori_id);
    if (!kategori) {
      hapusFile(fotoBaru);
      return res.status(400).json({ message: "Kategori tidak ditemukan" });
    }
    const kode_aset = req.body.kode_aset.trim();
    const duplikat = await Aset.findOne({
      where: { kode_aset, id: { [Op.ne]: aset.id } },
    });
    if (duplikat) {
      hapusFile(fotoBaru);
      return res.status(409).json({ message: "Kode aset sudah digunakan" });
    }
    const fotoLama = aset.foto;
    await aset.update({
      kode_aset,
      nama_aset: req.body.nama_aset.trim(),
      kategori_id: kategori.id,
      jumlah: Number(req.body.jumlah),
      kondisi: req.body.kondisi,
      lokasi: req.body.lokasi?.trim() || null,
      foto: fotoBaru || fotoLama,
      // LATIHAN: Memperbarui tanggal perolehan
      tanggal_perolehan: req.body.tanggal_perolehan || null,
    });
    if (fotoBaru) hapusFile(fotoLama);
    return res
      .status(200)
      .json({ message: "Aset berhasil diperbarui", data: aset });
  } catch (error) {
    hapusFile(fotoBaru);
    return serverError(res, error);
  }
};

export const deleteAset = async (req, res) => {
  try {
    const aset = await Aset.findByPk(req.params.id);
    if (!aset) {
      return res.status(404).json({ message: "Aset tidak ditemukan" });
    }
    const foto = aset.foto;
    await aset.destroy();
    hapusFile(foto);
    return res.status(200).json({ message: "Aset berhasil dihapus" });
  } catch (error) {
    return serverError(res, error);
  }
};

export const getStatistik = async (req, res) => {
  try {
    const [totalAset, totalKategori, totalUnit, perKondisi, perKategori] =
      await Promise.all([
        Aset.count(),
        Kategori.count(),
        Aset.sum("jumlah"),
        Aset.findAll({
          attributes: ["kondisi", [fn("COUNT", col("id")), "total"]],
          group: ["kondisi"],
          raw: true,
        }),
        Kategori.findAll({
          attributes: [
            "id",
            "nama_kategori",
            [fn("COUNT", col("aset.id")), "total_aset"],
          ],
          include: [{ model: Aset, as: "aset", attributes: [] }],
          group: ["kategori.id"],
          raw: true,
        }),
      ]);
    return res.status(200).json({
      data: {
        totalAset,
        totalKategori,
        totalUnit: totalUnit || 0,
        perKondisi: perKondisi.map((item) => ({
          kondisi: item.kondisi,
          total: Number(item.total),
        })),
        perKategori: perKategori.map((item) => ({
          id: item.id,
          nama_kategori: item.nama_kategori,
          total_aset: Number(item.total_aset),
        })),
      },
    });
  } catch (error) {
    return serverError(res, error);
  }
};
