import api from "./api";
export async function getKategori() {
  const response = await api.get("/kategori");
  return response.data;
}
export async function getKategoriById(id) {
  const response = await api.get(`/kategori/${id}`);
  return response.data;
}
export async function createKategori(data) {
  const response = await api.post("/kategori", data);
  return response.data;
}
export async function updateKategori(id, data) {
  const response = await api.patch(`/kategori/${id}`, data);
  return response.data;
}
export async function deleteKategori(id) {
  const response = await api.delete(`/kategori/${id}`);
  return response.data;
}
