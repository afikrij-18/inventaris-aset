// frontend/src/services/asetService.js
import api from "./api";

export async function getAset(params) {
  const response = await api.get("/aset", { params });
  return response.data;
}

export async function getAsetById(id) {
  const response = await api.get(`/aset/${id}`);
  return response.data;
}

export async function createAset(formData) {
  const response = await api.post("/aset", formData);
  return response.data;
}

export async function updateAset(id, formData) {
  const response = await api.patch(`/aset/${id}`, formData);
  return response.data;
}

export async function deleteAset(id) {
  const response = await api.delete(`/aset/${id}`);
  return response.data;
}

export async function getStatistik() {
  const response = await api.get("/aset/statistik");
  return response.data;
}