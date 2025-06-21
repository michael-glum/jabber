// shared/hooks/useCurrentUser.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.getCurrentUser(),
    staleTime: 1000 * 60 * 5,
  });
}