// features/for-you/ForYouScreen.tsx
import React, { useCallback } from 'react'
import { YStack } from 'tamagui'
import { Feed } from '~/shared/components/feed/Feed'
import { Screen } from '~/shared/components/ui/Screen'
import { useForYouPosts } from './hooks/useForYouPosts'
import { useLocalPostStore } from '~/shared/store/postStore'
import Header from '~/shared/components/header/header'
import JabberScore from '~/shared/components/jabberscore/jabberscore'
import { PostCard } from '~/shared/components/post/PostCard'
import { Post } from '~/shared/models/types'

// Memoized header right component
const HeaderRight = React.memo(() => <JabberScore />)

export default function ForYouScreen() {
  const localNewPost = useLocalPostStore((state) => state.localNewPost)

  // Stable render function with proper callbacks
  const renderPost = useCallback((post: Post) => {
    const handleReact = (emoji: string) => {
      // TODO: Implement reaction logic
      console.log('Reacted with:', emoji, 'on post:', post.id)
    }

    const handleComment = () => {
      // TODO: Navigate to comments
      console.log('Comment on post:', post.id)
    }

    const handleVote = (type: 'up' | 'down') => {
      // TODO: Implement voting logic
      console.log('Voted', type, 'on post:', post.id)
    }

    return (
      <PostCard
        key={post.id}
        post={post}
        onReact={handleReact}
        onComment={handleComment}
        onVote={handleVote}
      />
    )
  }, [])

  return (
    <Screen>
      <Header 
        title="jabber" 
        rightComponent={<HeaderRight />}
      />
      <YStack flex={1} bg="$background">
        <Feed
          tabNames={['For You'] as const}
          dataHookMap={{
            'For You': useForYouPosts,
          }}
          renderItem={renderPost}
          localNewItem={localNewPost}
        />
      </YStack>
    </Screen>
  )
}