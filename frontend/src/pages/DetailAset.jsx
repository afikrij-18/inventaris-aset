// frontend/src/pages/DetailAset.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAsetById } from "../services/asetService";
import { API_URL } from "../services/api";
import { kondisiBadge } from "../utils/kondisi";

const DetailAset = () => {
  const { id } = useParams();
  const [aset, setAset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDetail() {
      try {
        setLoading(true);
        const response = await getAsetById(id);
        setAset(response.data);
      } catch (err) {
        setError(err.response?.status === 404 ? "Aset tidak ditemukan." : "Gagal memuat detail aset.");
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  if (loading) {
    return <main className="min-h-screen bg-base-200 p-6"><p>Memuat data...</p></main>;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-base-200 p-6">
        <div className="mx-auto max-w-xl alert alert-error">
          <span>{error}</span>
        </div>
        <div className="mt-4 text-center">
          <Link to="/aset" className="btn btn-primary btn-sm">Kembali ke Daftar Aset</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-200 p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Detail Aset</h1>
          <Link to="/aset" className="btn btn-ghost btn-sm">← Kembali</Link>
        </div>

        <section className="card bg-base-100 shadow-sm">
          <div className="card-body space-y-4">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              {/* Foto Besar */}
              {aset.foto ? (
                <img
                  src={`${API_URL}/uploads/${aset.foto}`}
                  alt={aset.nama_aset}
                  className="h-48 w-48 rounded-lg object-cover border"
                />
              ) : (
                <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-base-200 text-sm font-semibold">
                  Tidak Ada Foto
                </div>
              )}

              <div className="space-y-2 flex-1">
                <div>
                  <span className="text-xs uppercase text-gray-400 font-semibold">Kode Aset</span>
                  <p className="text-lg font-mono font-bold">{aset.kode_aset}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-gray-400 font-semibold">Nama Aset</span>
                  <p className="text-xl font-bold">{aset.nama_aset}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-gray-400 font-semibold">Kategori</span>
                  <p className="font-medium">{aset.kategori?.nama_kategori}</p>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400 block">Jumlah Unit</span>
                <span className="font-semibold text-base">{aset.jumlah} Unit</span>
              </div>
              <div>
                <span className="text-gray-400 block">Kondisi</span>
                <span className={`badge ${kondisiBadge[aset.kondisi]} mt-1`}>
                  {aset.kondisi}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">Lokasi Penyimpanan</span>
                <span className="font-semibold text-base">{aset.lokasi || "-"}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Tanggal Perolehan</span>
                <span className="font-semibold text-base">{aset.tanggal_perolehan || "-"}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default DetailAset;