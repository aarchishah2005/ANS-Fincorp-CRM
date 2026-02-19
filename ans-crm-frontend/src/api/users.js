import api from "./axios";

export const getSalespersons = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const addSalesperson = async (data) => {
  const response = await api.post("/users", data);
  return response.data;
};

export const updateSalesperson = async (id, data) => {
  const response = await api.patch(`/users/${id}`, data);
  return response.data;
};

export const deleteSalesperson = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
