// features/for-you/hooks/useForYouPosts.ts
import type { InfiniteData } from '@tanstack/react-query'
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { FeedData } from "~/shared/components/feed/types";
import { api } from '~/shared/services/api';
import { Post } from "~/shared/models/types";
import { useLocalPostStore } from "~/shared/store/postStore";
import { useMemo, useCallback } from "react";

export function useForYouPosts(): FeedData<Post> {
  const queryClient = useQueryClient();
  const setLocalNewPost = useLocalPostStore((state) => state.setLocalNewPost);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', 'for-you'],
    queryFn: ({ pageParam = 0 }) => api.getPosts('forYou', pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 10) return undefined;
      return pages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Prevent refetch on mount
    refetchOnReconnect: false,
  });

  // Memoize flattened data
  const allPosts = useMemo(() => 
    data?.pages.flatMap(page => page) ?? [],
    [data?.pages]
  );

  // Stable callbacks
  const onRefresh = useCallback(() => {
    setLocalNewPost(null);
    // Clear cache and refetch
    api.clearCache();
    queryClient.invalidateQueries({ queryKey: ['posts', 'for-you'] });
    refetch();
  }, [queryClient, refetch, setLocalNewPost]);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isLoading && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isLoading, isFetchingNextPage, fetchNextPage]);

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