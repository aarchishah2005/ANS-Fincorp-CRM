// hooks/useNotifications.js  ← REPLACE existing file
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import api from "../services/api";
import api from "../api/axios"; 


export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get("/notifications");
      return data;
    },
    staleTime:       5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
};

export const useToggleDone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, field }) => {
      const { data } = await api.post("/notifications/done", { leadId, field });
      return data;
    },
    // Optimistic update — instantly flip isDone in cache before server responds
    onMutate: async ({ leadId, field }) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData(["notifications"]);

      queryClient.setQueryData(["notifications"], (old) => {
        if (!old) return old;
        return {
          ...old,
          notifications: old.notifications.map((n) =>
            n.leadId === leadId && n.field === field
              ? { ...n, isDone: !n.isDone }
              : n
          ),
        };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      // Roll back on error
      if (context?.previous) {
        queryClient.setQueryData(["notifications"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};