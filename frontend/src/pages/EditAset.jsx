import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AsetForm from "../components/AsetForm";
import { getAsetById, updateAset } from "../services/asetService";
import { getKategori } from "../services/kategoriService";
const EditAset = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aset, setAset] = useState(null);
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  useEffect(() => {
    async function loadData() {
      try {
        const [asetRes, kategoriRes] = await Promise.all([
          getAsetById(id),
          getKategori(),
        ]);
        setAset(asetRes.data);
        setKategoriList(kategoriRes.data);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "Aset tidak ditemukan."
            : "Gagal memuat data.",
        );
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);
  async function handleSubmit(formData) {
    try {
      setSaving(true);
      setSubmitError("");
      await updateAset(id, formData);
      navigate("/aset");
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Gagal memperbarui aset.");
      setSaving(false);
    }
  }
  return (
    <main className="min-h-screen bg-base-200 p-6">
      <div className="mx-auto max-w-2xl">
        <section className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h1 className="card-title">Edit Aset</h1>
            {loading ? (
              <p>Memuat data...</p>
            ) : error ? (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            ) : (
              <>
                {submitError && (
                  <div className="alert alert-error">
                    <span>{submitError}</span>
                  </div>
                )}
                <AsetForm
                  initialData={aset}
                  kategoriList={kategoriList}
                  onSubmit={handleSubmit}
                  saving={saving}
                  submitLabel="Simpan Perubahan"
                />
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
export default EditAset;
