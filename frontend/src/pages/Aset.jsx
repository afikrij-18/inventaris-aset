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
  // data dari server
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
  });
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  // state parameter query
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [kondisi, setKondisi] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  // ambil daftar kategori untuk dropdown filter (sekali saat dibuka)
  useEffect(() => {
    async function loadKategori() {
      try {
        const response = await getKategori();
        setKategoriList(response.data);
      } catch {
        // dropdown filter tetap kosong; daftar aset tetap bisa dipakai
      }
    }
    loadKategori();
  }, []);

  // debounce: tunggu 500 ms setelah user berhenti mengetik
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ambil data aset setiap parameter query berubah
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

  async function handleDelete(item) {
    if (!window.confirm(`Hapus aset "${item.nama_aset}"?`)) return;
    try {
      setActionError("");
      await deleteAset(item.id);
      if (items.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        setRefreshKey((key) => key + 1);
      }
    } catch (err) {
      setActionError(err.response?.data?.message || "Gagal menghapus aset.");
    }
  }

  return (
    <main className="min-h-screen bg-base-200 p-6">
      <div className="mx-auto max-w-5xl">
        <section className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h1 className="card-title">Daftar Aset</h1>
              <Link to="/aset/create" className="btn btn-primary btn-sm">
                Tambah Aset
              </Link>
            </div>
            
            <div className="grid gap-3 md:grid-cols-4">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Cari nama atau kode aset..."
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
              <p>Belum ada data aset.</p>
            ) : (
              <>
                <AsetTable
                  items={items}
                  startNumber={(page - 1) * LIMIT + 1}
                  onDelete={handleDelete}
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
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Aset;