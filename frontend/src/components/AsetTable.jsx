// frontend/src/components/AsetTable.jsx
import { Link } from "react-router-dom";
import { API_URL } from "../services/api";
import { kondisiBadge } from "../utils/kondisi";


const AsetTable = ({ items, startNumber, onDelete, sort, order, onSort }) => {
  const userRole = localStorage.getItem("role");
  // Fungsi helper untuk ikon panah sorting sederhana
  const renderSortArrow = (columnName) => {
    if (sort !== columnName) return null;
    return order === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Foto</th>
            <th>Kode</th>
            {/* Kolom Nama Aset bisa diklik untuk sorting */}
            <th 
              className="cursor-pointer hover:bg-base-200"
              onClick={() => onSort("nama_aset")}
            >
              Nama Aset{renderSortArrow("nama_aset")}
            </th>
            <th>Kategori</th>
            {/* Kolom Jumlah bisa diklik untuk sorting */}
            <th 
              className="cursor-pointer hover:bg-base-200"
              onClick={() => onSort("jumlah")}
            >
              Jumlah{renderSortArrow("jumlah")}
            </th>
            <th>Kondisi</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td>{startNumber + index}</td>
              <td>
                {item.foto ? (
                  <img
                    src={`${API_URL}/uploads/${item.foto}`}
                    alt={item.nama_aset}
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-base-200 text-xs">
                    N/A
                  </div>
                )}
              </td>
              <td>{item.kode_aset}</td>
              <td>{item.nama_aset}</td>
              <td>{item.kategori?.nama_kategori}</td>
              <td>{item.jumlah}</td>
              <td>
                <span className={`badge ${kondisiBadge[item.kondisi]}`}>
                  {item.kondisi}
                </span>
              </td>
              <td>
                <div className="flex gap-2">
                  {/* Tombol Detail */}
                  <Link
                    to={`/aset/${item.id}`}
                    className="btn btn-info btn-xs"
                  >
                    Detail
                  </Link>
                  <Link
                    to={`/aset/${item.id}/edit`}
                    className="btn btn-warning btn-xs"
                  >
                    Edit
                  </Link>
                  {userRole === "admin" && (            

                    <button
                    type="button"
                    className="btn btn-error btn-xs"
                    onClick={() => onDelete(item)}
                    >
                    Delete
                  </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AsetTable;