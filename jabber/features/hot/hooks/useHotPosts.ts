// features/hot/hooks/useHotPosts.ts
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { FeedData } from "~/shared/components/feed/types";
import { api } from '~/shared/services/api';
import { Post } from "~/shared/models/types";
import { useMemo, useCallback } from "react";

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

  // Memoize flattened data
  const allPosts = useMemo(() => 
    data?.pages.flatMap(page => page) ?? [],
    [data?.pages]
  );

  // Stable callbacks
  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['posts', type] });
    refetch();
  }, [queryClient, refetch, type]);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, isLoading, fetchNextPage]);

  const keyExtractor = useCallback(
    (post: Post) => post.id,
    []
  );

  return {
    data: allPosts,
    isLoading,
    onRefresh,
    onEndReached,
    keyExtractor,
  };
}
