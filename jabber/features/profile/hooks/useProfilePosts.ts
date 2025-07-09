// features/profile/hooks/useProfilePosts.ts
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { FeedData } from '~/shared/components/feed/types';
import { Post } from '~/shared/models/types';
import { api } from '~/shared/services/api';
import { useLocalPostStore } from '~/shared/store/postStore';
import { useMemo, useCallback } from 'react';
import { useCurrentUser } from '~/shared/hooks/useCurrentUser';

export function useProfilePosts(type: 'mine' | 'reactions'): FeedData<Post> {
  const queryClient = useQueryClient();
  const setLocalNewPost = useLocalPostStore((state) => state.setLocalNewPost);
  const localNewPost = useLocalPostStore((s) => s.localNewPost);
  const { data: currentUser } = useCurrentUser();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['posts', type, currentUser?.id],
    queryFn: ({ pageParam = 0 }) => api.getPosts(type, pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 10) return undefined;
      return pages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    enabled: !!currentUser, // Only fetch when we have the current user
  });

  // Memoize flattened data
  const allPosts = useMemo(() => {
    const posts = data?.pages.flatMap(page => page) ?? [];
    
    // For 'mine' tab, include local new post if it exists and belongs to current user
    if (type === 'mine' && localNewPost && localNewPost.userId === currentUser?.id) {
      // Check if it's already in the list
      const exists = posts.some(p => p.id === localNewPost.id);
      if (!exists) {
        return [localNewPost, ...posts];
      }
    }
    
    return posts;
  }, [data?.pages, type, localNewPost, currentUser?.id]);

  // Stable callbacks
  const onRefresh = useCallback(() => {
    setLocalNewPost(null);
    queryClient.invalidateQueries({ queryKey: ['posts', type, currentUser?.id] });
    refetch();
  }, [queryClient, refetch, type, setLocalNewPost, currentUser?.id]);

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