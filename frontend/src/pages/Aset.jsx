// frontend/src/pages/Aset.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AsetTable from "../components/AsetTable";
import Pagination from "../components/Pagination";
import { deleteAset, getAset } from "../services/asetService";
import { getKategori } from "../services/kategoriService";
import { KONDISI } from "../utils/kondisi";

const LIMIT = 5;

const Aset = () => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
  });
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [kondisi, setKondisi] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  // State untuk modal konfirmasi hapus aset
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    async function loadKategori() {
      try {
        const response = await getKategori();
        setKategoriList(response.data);
      } catch {
        // biarkan kosong
      }
    }
    loadKategori();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let ignore = false;
    async function loadAset() {
      try {
        setLoading(true);
        setError("");
        const response = await getAset({
          search,
          kategori_id: kategoriId,
          kondisi,
          sort,
          order,
          page,
          limit: LIMIT,
        });
        if (!ignore) {
          setItems(response.data);
          setPagination(response.pagination);
        }
      } catch {
        if (!ignore) setError("Gagal memuat data aset.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadAset();
    return () => {
      ignore = true;
    };
  }, [search, kategoriId, kondisi, sort, order, page, refreshKey]);

  function showToast(msg) {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  }

  function handleKategoriChange(e) {
    setKategoriId(e.target.value);
    setPage(1);
  }

  function handleKondisiChange(e) {
    setKondisi(e.target.value);
    setPage(1);
  }

  function handleSort(column) {
    if (sort === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(column);
      setOrder("asc");
    }
    setPage(1);
  }

  function handleResetFilter() {
    setSearchInput("");
    setSearch("");
    setKategoriId("");
    setKondisi("");
    setSort("createdAt");
    setOrder("desc");
    setPage(1);
  }

  async function confirmDelete() {
    if (!itemToDelete) return;
    try {
      setActionError("");
      await deleteAset(itemToDelete.id);
      setItemToDelete(null);
      showToast("Aset berhasil dihapus!");
      if (items.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        setRefreshKey((key) => key + 1);
      }
    } catch (err) {
      setItemToDelete(null);
      setActionError(err.response?.data?.message || "Gagal menghapus aset.");
    }
  }

  return (
    <main className="min-h-screen bg-base-200 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Toast Notifikasi Sukses */}
        {successMessage && (
          <div className="toast toast-top toast-end z-50">
            <div className="alert alert-success text-white shadow-lg">
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        <section className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="card-title text-xl">Daftar Aset</h1>
              <Link to="/aset/create" className="btn btn-primary btn-sm">
                Tambah Aset
              </Link>
            </div>
            
            {/* Bagian Filter Responsif */}
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 mt-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Cari nama/kode aset..."
              />
              <select
                value={kategoriId}
                onChange={handleKategoriChange}
                className="select select-bordered w-full"
              >
                <option value="">Semua kategori</option>
                {kategoriList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama_kategori}
                  </option>
                ))}
              </select>
              <select
                value={kondisi}
                onChange={handleKondisiChange}
                className="select select-bordered w-full"
              >
                <option value="">Semua kondisi</option>
                {KONDISI.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleResetFilter}
                className="btn btn-outline w-full"
              >
                Reset Filter
              </button>
            </div>

            {actionError && (
              <div className="alert alert-error mt-4">
                <span>{actionError}</span>
              </div>
            )}

            {loading ? (
              <p className="mt-4">Memuat data...</p>
            ) : error ? (
              <div className="alert alert-error mt-4">
                <span>{error}</span>
              </div>
            ) : items.length === 0 ? (
              <p className="mt-4">Belum ada data aset.</p>
            ) : (
              <div className="mt-4 space-y-4">
                <AsetTable
                  items={items}
                  startNumber={(page - 1) * LIMIT + 1}
                  onDelete={(item) => setItemToDelete(item)}
                  sort={sort}
                  order={order}
                  onSort={handleSort}
                />
                <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                  <p className="text-sm">
                    Menampilkan {items.length} dari {pagination.totalItems} aset
                  </p>
                  <Pagination
                    page={page}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* DaisyUI Modal Konfirmasi Hapus Aset */}
      {itemToDelete && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Konfirmasi Hapus Aset</h3>
            <p className="py-4">
              Apakah Anda yakin ingin menghapus aset{" "}
              <span className="font-semibold text-error">
                "{itemToDelete.nama_aset}"
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
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

export default Aset; // Atau export default Aset; (sesuaikan kapitalisasi file Anda)