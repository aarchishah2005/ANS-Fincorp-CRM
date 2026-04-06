import api from "./axios";

export const getLeads = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/leads?${params}`);
  return response.data;
};

export const getLeadById = async (id) => {
  const response = await api.get(`/leads/${id}`);
  return response.data;
};

export const createLead = async (data) => {
  const response = await api.post("/leads", data);
  return response.data;
};

export const updateLead = async (id, data) => {
  const response = await api.patch(`/leads/${id}`, data);
  return response.data;
};

export const deleteLead = async (id) => {
  const response = await api.delete(`/leads/${id}`);
  return response.data;
};

// ── NEW: Add a reminder note to a lead ───────────────────────────────────
// field: "callingDate" | "followUpDate" | "visitDate"
// message: string (required)
export const addLeadNote = async (id, data) => {
  const response = await api.post(`/leads/${id}/notes`, data);
  return response.data;
};