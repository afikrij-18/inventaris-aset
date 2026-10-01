// frontend/src/pages/CreateAset.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AsetForm from "../components/AsetForm";
import { createAset } from "../services/asetService";
import { getKategoriAktif } from "../services/kategoriService"; // <-- Perubahan di sini

const CreateAset = () => {
  const navigate = useNavigate();
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    async function loadKategori() {
      try {
        // Mengambil hanya kategori yang aktif saja untuk dropdown form aset
        const response = await getKategoriAktif(); // <-- Perubahan di sini
        setKategoriList(response.data);
      } catch {
        setError("Gagal memuat data kategori.");
      } finally {
        setLoading(false);
      }
    }
    loadKategori();
  }, []);

  async function handleSubmit(formData) {
    try {
      setSaving(true);
      setSubmitError("");
      await createAset(formData);
      navigate("/aset");
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Gagal menyimpan aset.");
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-base-200 p-6">
      <div className="mx-auto max-w-2xl">
        <section className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h1 className="card-title">Tambah Aset</h1>
            {loading ? (
              <p>Memuat data...</p>
            ) : error ? (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            ) : kategoriList.length === 0 ? (
              <div className="alert alert-warning">
                <span>
                  Belum ada kategori aktif.{" "}
                  <Link to="/kategori" className="link">
                    Kelola kategori
                  </Link>{" "}
                  terlebih dahulu.
                </span>
              </div>
            ) : (
              <>
                {submitError && (
                  <div className="alert alert-error">
                    <span>{submitError}</span>
                  </div>
                )}
                <AsetForm
                  kategoriList={kategoriList}
                  onSubmit={handleSubmit}
                  saving={saving}
                  submitLabel="Simpan Aset"
                />
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default CreateAset;