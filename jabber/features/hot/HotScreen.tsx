// features/hot/HotScreen.tsx
import React, { useCallback } from 'react'
import { Text, View, YStack } from 'tamagui'
import { Feed } from '~/shared/components/feed/Feed'
import { Screen } from '~/shared/components/ui/Screen'
import { useHotPosts } from './hooks/useHotPosts'
import Header from '~/shared/components/header/header'
import JabberScore from '~/shared/components/jabberscore/jabberscore'
import { PostCard } from '~/shared/components/post/PostCard'
import { Post } from '~/shared/models/types'

const HeaderRight = React.memo(() => <JabberScore />)

export default function HotScreen() {
  // Stable render function with callbacks
  const renderPost = useCallback((post: Post) => {
    const handleReact = (emoji: string) => {
      console.log('Reacted with:', emoji, 'on post:', post.id)
    }

    const handleComment = () => {
      console.log('Comment on post:', post.id)
    }

    const handleVote = (type: 'up' | 'down') => {
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
        title="hot" 
        rightComponent={<HeaderRight />}
      />
      <YStack flex={1} bg="$background">
        <Feed
          tabNames={['trending', 'all time'] as const}
          dataHookMap={{
            'trending': () => useHotPosts('trending'),
            'all time': () => useHotPosts('allTime'),
          }}
          renderItem={renderPost}
        />
      </YStack>
    </Screen>
  )
}