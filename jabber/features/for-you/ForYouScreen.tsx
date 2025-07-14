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