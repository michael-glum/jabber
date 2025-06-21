// features/for-you/hooks/useForYouPosts.ts
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { FeedData } from "~/shared/components/feed/types";
import { api } from '~/shared/services/api';
import { Post } from "~/shared/models/types";
import { useLocalPostStore } from "~/shared/store/postStore";

export function useForYouPosts(): FeedData<Post> {
  const queryClient = useQueryClient();
  const setLocalNewPost = useLocalPostStore((state) => state.setLocalNewPost);
  const _localNewPost = useLocalPostStore((s) => s.localNewPost);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['posts', 'for-you'],
    queryFn: ({ pageParam = 0 }) => api.getPosts('forYou', pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 10) return undefined;
      return pages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
  });

  const allPosts = data?.pages.flatMap(page => page) ?? [];

  return {
    data: allPosts,
    isLoading,
    onRefresh: () => {
      setLocalNewPost(null);
      queryClient.invalidateQueries({ queryKey: ['posts', 'forYou'] });
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