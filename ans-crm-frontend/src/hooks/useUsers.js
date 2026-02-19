import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSalespersons, addSalesperson, updateSalesperson, deleteSalesperson } from "../api/users";

export const useSalespersons = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getSalespersons,
  });
};

export const useAddSalesperson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addSalesperson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateSalesperson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateSalesperson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteSalesperson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSalesperson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
