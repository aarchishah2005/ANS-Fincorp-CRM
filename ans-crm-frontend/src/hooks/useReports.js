import { useQuery } from "@tanstack/react-query";
import { getReportSummary, getReportBySales, getReportByDate } from "../api/reports";

export const useReportSummary = () => {
  return useQuery({
    queryKey: ["reports", "summary"],
    queryFn: getReportSummary,
  });
};

export const useReportBySales = () => {
  return useQuery({
    queryKey: ["reports", "by-sales"],
    queryFn: getReportBySales,
  });
};

export const useReportByDate = (from, to) => {
  return useQuery({
    queryKey: ["reports", "by-date", from, to],
    queryFn: () => getReportByDate(from, to),
    enabled: !!from && !!to,
  });
};
