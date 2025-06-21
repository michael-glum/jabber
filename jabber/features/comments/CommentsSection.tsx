import React from 'react'
import { Feed } from '~/shared/components/feed/Feed'
import { useComments } from './hooks/useComments'
import { Comment } from '~/shared/models/types'
import { YStack, Text } from 'tamagui'
import { useLocalCommentStore } from '~/shared/store/commentStore'

export function CommentsSection({ postId }: { postId: string }) {
  const localNewComment = useLocalCommentStore((state) => state.getLocalComment(postId));

  return (
    <Feed
      dataHookMap={{
        default: () => useComments(postId),
      }}
      renderItem={(comment) => (
        <YStack p="$4" borderBottomWidth={1} borderColor="$borderColor">
          <Text fontSize="$5">{comment.text}</Text>
        </YStack>
      )}
      localNewItem={localNewComment}
    />
  )
}