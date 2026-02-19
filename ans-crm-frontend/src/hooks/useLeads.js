import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLeads, getLeadById, createLead, updateLead, deleteLead } from "../api/leads";

export const useLeads = (filters = {}) => {
  return useQuery({
    queryKey: ["leads", filters],
    queryFn: () => getLeads(filters),
  });
};

export const useLeadById = (id) => {
  return useQuery({
    queryKey: ["leads", id],
    queryFn: () => getLeadById(id),
    enabled: !!id,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};
