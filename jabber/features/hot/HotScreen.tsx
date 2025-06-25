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
  const renderPost = useCallback((post: Post) => (
    <PostCard
      key={post.id}
      post={post}
      onReact={(emoji) => console.log('Reacted with:', emoji)}
      onComment={() => console.log('Commented on post:', post.id)}
    />
  ), [])

  return (
    <Screen>
      <Header 
        title="Hot" 
        rightComponent={<HeaderRight />}
      />
      <YStack flex={1} bg="$background">
        <Feed
          tabNames={['Trending', 'All Time'] as const}
          dataHookMap={{
            'Trending': () => useHotPosts('trending'),
            'All Time': () => useHotPosts('allTime'),
          }}
          renderItem={renderPost}
        />
      </YStack>
    </Screen>
  )
}
