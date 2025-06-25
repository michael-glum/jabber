// features/leaderboard/hooks/useLeaderboardUsers.ts
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { FeedData } from "~/shared/components/feed/types";
import { api } from '~/shared/services/api';
import { User } from "~/shared/models/types";
import { useMemo, useCallback } from "react";

export function useLeaderboardUsers(
  type: 'trending' | 'allTime'
): FeedData<User> {
  const queryClient = useQueryClient();
  
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['leaderboard', type],
    queryFn: ({ pageParam = 0 }) => api.getLeaderboardUsers(type, pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 50) return undefined;
      return pages.length;
    },
    initialPageParam: 0,
    staleTime: type === 'allTime' ? 1000 * 60 * 30 : 1000 * 60 * 5,
  });

  // Memoize flattened data
  const allUsers = useMemo(() => 
    data?.pages.flatMap(page => page) ?? [],
    [data?.pages]
  );

  // Stable callbacks
  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['leaderboard', type] });
    refetch();
  }, [queryClient, refetch, type]);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, isLoading, fetchNextPage]);

  const keyExtractor = useCallback(
    (user: User) => user.id,
    []
  );

  return {
    data: allUsers,
    isLoading,
    onRefresh,
    onEndReached,
    keyExtractor,
  };
}