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

export const addLeadNote = async (id, data) => {
  const response = await api.post(`/leads/${id}/notes`, data);
  return response.data;
};

// ── NEW: Check if a mobile number already exists in any lead ──────────────
// excludeLeadId: pass current lead._id in edit forms so own lead is skipped
export const checkDuplicateMobile = async (mobile, excludeLeadId = "") => {
  const params = new URLSearchParams({ mobile });
  if (excludeLeadId) params.append("excludeLeadId", excludeLeadId);
  const response = await api.get(`/leads/check-duplicate?${params}`);
  return response.data; // { found: bool, leads: [...] }
};

// ── NEW: Add current user as co-assignee of an existing lead ─────────────
export const addCoAssigneeToLead = async (leadId) => {
  const response = await api.patch(`/leads/${leadId}/co-assignee`);
  return response.data;
};