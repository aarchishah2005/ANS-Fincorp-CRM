import api from "./axios";

export const getReportSummary = async () => {
  const response = await api.get("/reports/summary");
  return response.data;
};

export const getReportBySales = async () => {
  const response = await api.get("/reports/by-sales");
  return response.data;
};

export const getReportByDate = async (from, to) => {
  const response = await api.get(`/reports/by-date?from=${from}&to=${to}`);
  return response.data;
};
