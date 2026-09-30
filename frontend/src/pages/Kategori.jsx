// frontend/src/pages/Kategori.jsx
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
  const [successMessage, setSuccessMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [nama, setNama] = useState("");
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // State untuk modal konfirmasi hapus
  const [itemToDelete, setItemToDelete] = useState(null);

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

  // Fungsi helper untuk menampilkan toast sukses sementara (3 detik)
  function showToast(msg) {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  }

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
        showToast("Kategori berhasil diperbarui!");
      } else {
        await createKategori({ nama_kategori: nama.trim() });
        showToast("Kategori berhasil ditambahkan!");
      }
      resetForm();
      setRefreshKey((key) => key + 1);
    } catch (err) {
      setFormError(err.response?.data?.message || "Gagal menyimpan kategori.");
    } finally {
      setSaving(false);
    }
  }

  // Eksekusi hapus setelah dikonfirmasi lewat modal
  async function confirmDelete() {
    if (!itemToDelete) return;
    try {
      setActionError("");
      await deleteKategori(itemToDelete.id);
      setItemToDelete(null);
      showToast("Kategori berhasil dihapus!");
      setRefreshKey((key) => key + 1);
    } catch (err) {
      setItemToDelete(null);
      setActionError(
        err.response?.data?.message || "Gagal menghapus kategori.",
      );
    }
  }

  return (
    <main className="min-h-screen bg-base-200 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Toast Notifikasi Sukses Mengambang */}
        {successMessage && (
          <div className="toast toast-top toast-end z-50">
            <div className="alert alert-success text-white shadow-lg">
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Card Form Tambah/Edit */}
        <section className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h1 className="card-title text-xl">
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

        {/* Card Daftar Kategori */}
        <section className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-xl">Daftar Kategori</h2>
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
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Kategori</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td className="font-medium">{item.nama_kategori}</td>
                        <td className="text-right">
                          <div className="flex justify-end gap-2">
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
                              onClick={() => setItemToDelete(item)}
                            >
                              Delete
                            </button>
                          </div>
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

      {/* DaisyUI Modal Konfirmasi Hapus */}
      {itemToDelete && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Konfirmasi Hapus</h3>
            <p className="py-4">
              Apakah Anda yakin ingin menghapus kategori{" "}
              <span className="font-semibold text-error">
                "{itemToDelete.nama_kategori}"
              </span>
              ?
            </p>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => setItemToDelete(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-error"
                onClick={confirmDelete}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </dialog>
      )}
    </main>
  );
};

export default Kategori;
