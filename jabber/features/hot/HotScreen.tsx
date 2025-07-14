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
  // Stable render function
  const renderPost = useCallback((post: Post) => {
    return (
      <PostCard
        key={post.id}
        post={post}
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