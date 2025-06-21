// features/for-you/hooks/useForYouFeed.ts
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { FeedData } from "~/shared/components/feed/types";
import { api } from '~/shared/services/api';
import { User } from "~/shared/models/types";

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

  const allUsers = data?.pages.flatMap(page => page) ?? [];

  return {
    data: allUsers,
    isLoading,
    onRefresh: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard', type] });
      refetch();
    },
    onEndReached: () => {
      if (hasNextPage && !isLoading) {
        fetchNextPage();
      }
    },
    keyExtractor: (user) => user.id,
  };
}