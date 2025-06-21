// features/profile/ProfileScreen.tsx
import React from 'react';
import { YStack, Text } from 'tamagui';
import { Feed } from '~/shared/components/feed/Feed';
import { useProfilePosts } from './hooks/useProfilePosts';
import { useLocalPostStore } from '~/shared/store/postStore';
import { Screen } from '~/shared/components/ui/Screen';

export default function ProfileScreen() {
  const localNewPost = useLocalPostStore((s) => s.localNewPost);

  return (
    <Screen>
      <YStack flex={1} bg="$background">
        <Feed
          tabNames={['Posts', 'Reactions'] as const}
          dataHookMap={{
            Posts: () => useProfilePosts('mine'),
            Reactions: () => useProfilePosts('reactions'),
          }}
          renderItem={(post) => (
            <YStack p="$4" borderBottomWidth={1} borderColor="$borderColor">
              <Text fontSize="$5">{post.text}</Text>
            </YStack>
          )}
          localNewItem={localNewPost} // still only shown on Posts tab
        />
      </YStack>
    </Screen>
  )
}
