import { useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../services/api";
import { KONDISI } from "../utils/kondisi";
const FORMAT_FOTO = ["image/jpeg", "image/png", "image/webp"];
const MAKS_UKURAN = 2 * 1024 * 1024;
const formKosong = {
  kode_aset: "",
  nama_aset: "",
  kategori_id: "",
  jumlah: "1",
  kondisi: "Baik",
  lokasi: "",
};
// ubah data dari API menjadi nilai form (semua bertipe string)
const dariData = (data) => ({
  kode_aset: data.kode_aset,
  nama_aset: data.nama_aset,
  kategori_id: String(data.kategori_id),
  jumlah: String(data.jumlah),
  kondisi: data.kondisi,
  lokasi: data.lokasi ?? "",
});
const Field = ({ label, error, children }) => (
  <label className="form-control w-full">
    <span className="label-text mb-1 block">{label}</span>
    {children}
    {error && <span className="mt-1 block text-sm text-error">{error}</span>}
  </label>
);
const AsetForm = ({
  initialData,
  kategoriList,
  onSubmit,
  saving,
  submitLabel,
}) => {
  const [form, setForm] = useState(
    initialData ? dariData(initialData) : formKosong,
  );
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(
    initialData?.foto ? `${API_URL}/uploads/${initialData.foto}` : null,
  );
  const [errors, setErrors] = useState({});
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!FORMAT_FOTO.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        foto: "Format foto harus JPG, PNG, atau WEBP.",
      }));
      e.target.value = "";
      return;
    }
    if (file.size > MAKS_UKURAN) {
      setErrors((prev) => ({ ...prev, foto: "Ukuran foto maksimal 2 MB." }));
      e.target.value = "";
      return;
    }
    if (foto) URL.revokeObjectURL(preview);
    setFoto(file);
    setPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, foto: "" }));
  }
  function validate() {
    const hasil = {};
    if (!form.kode_aset.trim()) hasil.kode_aset = "Kode aset wajib diisi.";
    if (form.nama_aset.trim().length < 3) {
      hasil.nama_aset = "Nama aset minimal 3 karakter.";
    }
    if (!form.kategori_id) hasil.kategori_id = "Kategori wajib dipilih.";
    if (!Number.isInteger(Number(form.jumlah)) || Number(form.jumlah) < 1) {
      hasil.jumlah = "Jumlah harus berupa angka bulat minimal 1.";
    }
    return hasil;
  }
  function handleSubmit(e) {
    e.preventDefault();
    const hasil = validate();
    setErrors(hasil);
    if (Object.keys(hasil).length > 0) return;
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (foto) formData.append("foto", foto);
    onSubmit(formData);
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kode Aset" error={errors.kode_aset}>
          <input
            type="text"
            name="kode_aset"
            value={form.kode_aset}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="AST-001"
          />
        </Field>
        <Field label="Nama Aset" error={errors.nama_aset}>
          <input
            type="text"
            name="nama_aset"
            value={form.nama_aset}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Laptop Lenovo"
          />
        </Field>
      </div>
      <Field label="Kategori" error={errors.kategori_id}>
        <select
          name="kategori_id"
          value={form.kategori_id}
          onChange={handleChange}
          className="select select-bordered w-full mb-3"
        >
          <option value="">-- Pilih kategori --</option>
          {kategoriList.map((k) => (
            <option key={k.id} value={k.id}>
              {k.nama_kategori}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Jumlah" error={errors.jumlah}>
          <input
            type="number"
            name="jumlah"
            min="1"
            value={form.jumlah}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </Field>
        <Field label="Kondisi">
          <select
            name="kondisi"
            value={form.kondisi}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            {KONDISI.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Lokasi">
        <input
          type="text"
          name="lokasi"
          value={form.lokasi}
          onChange={handleChange}
          className="input input-bordered w-full mb-3"
          placeholder="Lab Komputer 1"
        />
      </Field>
      <Field label="Foto (JPG/PNG/WEBP, maks. 2 MB)" error={errors.foto}>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full mb-3"
        />
      </Field>
      {preview && (
        <img
          src={preview}
          alt="Preview foto aset"
          className="h-32 w-32 rounded border object-cover"
        />
      )}
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Menyimpan..." : submitLabel}
        </button>
        <Link to="/aset" className="btn btn-ghost">
          Batal
        </Link>
      </div>
    </form>
  );
};
export default AsetForm;
