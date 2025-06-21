// features/for-you/hooks/useHotPosts.ts
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { FeedData } from "~/shared/components/feed/types";
import { api } from '~/shared/services/api';
import { Post } from "~/shared/models/types";

export function useHotPosts(type: 'allTime' | 'trending'): FeedData<Post> {
  const queryClient = useQueryClient();
  
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['posts', type],
    queryFn: ({ pageParam = 0 }) => api.getPosts(type, pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 10) return undefined;
      return pages.length;
    },
    initialPageParam: 0,
    staleTime: type === 'allTime' ? 1000 * 60 * 30 : 1000 * 60 * 5,
  });

  const allPosts = data?.pages.flatMap(page => page) ?? [];

  return {
    data: allPosts,
    isLoading,
    onRefresh: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', type] });
      refetch();
    },
    onEndReached: () => {
      if (hasNextPage && !isLoading) {
        fetchNextPage();
      }
    },
    keyExtractor: (post) => post.id,
  };
}