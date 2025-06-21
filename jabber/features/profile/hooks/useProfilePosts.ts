// features/profile/hooks/useProfilePosts.ts
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { FeedData } from '~/shared/components/feed/types';
import { Post } from '~/shared/models/types';
import { api } from '~/shared/services/api';
import { useLocalPostStore } from '~/shared/store/postStore';

export function useProfilePosts(type: 'mine' | 'reactions'): FeedData<Post> {
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
    queryKey: ['posts', type],
    queryFn: ({ pageParam = 0 }) => api.getPosts(type, pageParam),
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