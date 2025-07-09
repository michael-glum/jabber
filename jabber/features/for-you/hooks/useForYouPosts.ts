// features/for-you/hooks/useForYouPosts.ts
import type { InfiniteData } from '@tanstack/react-query'
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { FeedData } from "~/shared/components/feed/types";
import { api } from '~/shared/services/api';
import { Post } from "~/shared/models/types";
import { useLocalPostStore } from "~/shared/store/postStore";
import { useMemo, useCallback, useEffect } from "react";

const MAX_PAGES_IN_MEMORY = 5;

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
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    maxPages: MAX_PAGES_IN_MEMORY,
  });

  // Manual cleanup of old pages when we have too many
  useEffect(() => {
    if (data?.pages && data.pages.length > MAX_PAGES_IN_MEMORY) {
      const currentData = queryClient.getQueryData<InfiniteData<Post[]>>(['posts', 'for-you']);
      
      if (currentData) {
        // Keep only the most recent pages
        const recentPages = currentData.pages.slice(-MAX_PAGES_IN_MEMORY);
        const recentPageParams = currentData.pageParams.slice(-MAX_PAGES_IN_MEMORY);
        
        // Update the cache with limited data
        queryClient.setQueryData<InfiniteData<Post[]>>(['posts', 'for-you'], {
          pages: recentPages,
          pageParams: recentPageParams,
        });
      }
    }
  }, [data?.pages?.length, queryClient]);

  // Memoize flattened data
  const allPosts = useMemo(() => 
    data?.pages.flatMap(page => page) ?? [],
    [data?.pages]
  );

  // Stable callbacks
  const onRefresh = useCallback(() => {
    setLocalNewPost(null);
    queryClient.removeQueries({ queryKey: ['posts', 'forYou'] });
    queryClient.invalidateQueries({ queryKey: ['posts', 'forYou'] });
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