import api from "./api";
export async function login(data) {
  const response = await api.post("/auth/login", data);
  return response.data;
}
export async function getMe() {
  const response = await api.get("/auth/me");
  return response.data;
}
