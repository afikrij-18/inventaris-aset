import { useEffect, useState } from "react";
import { getStatistik } from "../services/asetService";
import { kondisiBadge } from "../utils/kondisi";
const Dashboard = () => {
  const [stat, setStat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function loadStatistik() {
      try {
        const response = await getStatistik();
        setStat(response.data);
      } catch {
        setError("Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    }
    loadStatistik();
  }, []);
  return (
    <main className="min-h-screen bg-base-200 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-2xl font-bold">Dashboard Inventaris</h1>
        {loading && <p>Memuat data...</p>}
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}
        {stat && (
          <>
            <div className="stats stats-vertical w-full bg-base-100 shadow-sm sm:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Total Aset</div>
                <div className="stat-value">{stat.totalAset}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Total Unit</div>
                <div className="stat-value">{stat.totalUnit}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Total Kategori</div>
                <div className="stat-value">{stat.totalKategori}</div>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <section className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h2 className="card-title">Aset per Kategori</h2>
                  {stat.perKategori.length === 0 ? (
                    <p>Belum ada data kategori.</p>
                  ) : (
                    <ul className="space-y-3">
                      {stat.perKategori.map((k) => (
                        <li key={k.id}>
                          <div className="flex justify-between text-sm">
                            <span>{k.nama_kategori}</span>
                            <span>{k.total_aset}</span>
                          </div>
                          <progress
                            className="progress progress-primary w-full"
                            value={k.total_aset}
                            max={stat.totalAset || 1}
                          ></progress>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
              <section className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h2 className="card-title">Aset per Kondisi</h2>
                  {stat.perKondisi.length === 0 ? (
                    <p>Belum ada data aset.</p>
                  ) : (
                    <ul className="space-y-3">
                      {stat.perKondisi.map((k) => (
                        <li
                          key={k.kondisi}
                          className="flex items-center justify-between"
                        >
                          <span className={`badge ${kondisiBadge[k.kondisi]}`}>
                            {k.kondisi}
                          </span>
                          <span className="font-semibold">{k.total}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
};
export default Dashboard;
