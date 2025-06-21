// features/for-you/hooks/useForYouFeed.ts
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { FeedData } from "~/shared/components/feed/types";
import { api } from '~/shared/services/api';
import { Comment } from "~/shared/models/types";
import { useLocalCommentStore } from "~/shared/store/commentStore";

export function useComments(postId: string): FeedData<Comment> {
  const queryClient = useQueryClient();
  const setLocalComment = useLocalCommentStore((state) => state.setLocalComment);
  
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam = 0 }) => api.getComments(postId, pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 10) return undefined;
      return pages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 2,
  });

  const allComments = data?.pages.flatMap(page => page) ?? [];

  return {
    data: allComments,
    isLoading,
    onRefresh: () => {
      setLocalComment(postId, null);
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      refetch();
    },
    onEndReached: () => {
      if (hasNextPage && !isLoading) {
        fetchNextPage();
      }
    },
    keyExtractor: (comment) => comment.id,
  };
}