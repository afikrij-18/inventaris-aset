import { useEffect, useState } from "react";
import {
  createKategori,
  deleteKategori,
  getKategori,
  updateKategori,
} from "../services/kategoriService";
const Kategori = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [nama, setNama] = useState("");
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const response = await getKategori();
        setItems(response.data);
      } catch {
        setError("Gagal memuat data kategori.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [refreshKey]);
  function resetForm() {
    setEditId(null);
    setNama("");
    setFormError("");
  }
  function handleEdit(item) {
    setEditId(item.id);
    setNama(item.nama_kategori);
    setFormError("");
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (nama.trim().length < 3) {
      setFormError("Nama kategori minimal 3 karakter.");
      return;
    }

    try {
      setSaving(true);
      setFormError("");
      if (editId) {
        await updateKategori(editId, { nama_kategori: nama.trim() });
      } else {
        await createKategori({ nama_kategori: nama.trim() });
      }
      resetForm();
      setRefreshKey((key) => key + 1);
    } catch (err) {
      setFormError(err.response?.data?.message || "Gagal menyimpan kategori.");
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete(item) {
    if (!window.confirm(`Hapus kategori "${item.nama_kategori}"?`)) return;
    try {
      setActionError("");
      await deleteKategori(item.id);
      setItems((prev) => prev.filter((k) => k.id !== item.id));
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Gagal menghapus kategori.",
      );
    }
  }

  return (
    <main className="min-h-screen bg-base-200 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h1 className="card-title">
              {editId ? "Edit Kategori" : "Tambah Kategori"}
            </h1>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Nama kategori"
                />
                {formError && (
                  <p className="mt-1 text-sm text-error">{formError}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Menyimpan..." : editId ? "Simpan" : "Tambah"}
                </button>
                {editId && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={resetForm}
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>
        <section className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Daftar Kategori</h2>
            {actionError && (
              <div className="alert alert-error">
                <span>{actionError}</span>
              </div>
            )}
            {loading ? (
              <p>Memuat data...</p>
            ) : error ? (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            ) : items.length === 0 ? (
              <p>Belum ada data kategori.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Kategori</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.nama_kategori}</td>
                        <td className="flex gap-2">
                          <button
                            type="button"
                            className="btn btn-warning btn-xs"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-error btn-xs"
                            onClick={() => handleDelete(item)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
export default Kategori;
