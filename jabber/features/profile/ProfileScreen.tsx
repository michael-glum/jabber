// features/profile/ProfileScreen.tsx
import React from 'react';
import { YStack, Text, XStack } from 'tamagui';
import { Feed } from '~/shared/components/feed/Feed';
import { useProfilePosts } from './hooks/useProfilePosts';
import { useLocalPostStore } from '~/shared/store/postStore';
import { Screen } from '~/shared/components/ui/Screen';
import { useCurrentUser } from '~/shared/hooks/useCurrentUser';
import JabberScore from '~/shared/components/jabberscore/jabberscore';
import Header from '~/shared/components/header/header';
import { MapPin, Trophy } from '@tamagui/lucide-icons';
import PostCard from '~/shared/components/post/PostCard';

export default function ProfileScreen() {
  const localNewPost = useLocalPostStore((s) => s.localNewPost);
  const { data: currentUser } = useCurrentUser()

  return (
    <Screen>
      <Header
        title={currentUser?.username || 'Profile'}
        rightComponent={<JabberScore />}
      />
      
      {/* Profile Header */}
      <YStack 
        bg="$background" 
        borderBottomWidth={2} 
        borderColor="$borderColor"
        p="$4"
        gap="$3"
      >
        <YStack gap="$2">
          <Text fontSize="$7" fontWeight="bold" textTransform="lowercase">
            @{currentUser?.username || 'loading...'}
          </Text>
          
          <XStack items="center" gap="$4">
            <XStack items="center" gap="$1">
              <MapPin size={16} color="$color10" />
              <Text fontSize="$3" color="$color10">
                {currentUser?.region || '...'}
              </Text>
            </XStack>
            
            <XStack items="center" gap="$2">
              <Trophy size={20} color="$yellow10" />
              <Text fontSize="$5" fontWeight="bold" color="$yellow10">
                {currentUser?.jabberScore?.toLocaleString() || '...'}
              </Text>
            </XStack>
          </XStack>
        </YStack>
      </YStack>

      
      <YStack flex={1} bg="$background">
        <Feed
          tabNames={['Posts', 'Reactions'] as const}
          dataHookMap={{
            Posts: () => useProfilePosts('mine'),
            Reactions: () => useProfilePosts('reactions'),
          }}
          renderItem={(post) => (
            <PostCard
              post={post}
              onLike={() => console.log('Liked own post:', post.id)}
              onReact={(emoji) => console.log('Reacted with:', emoji)}
              onComment={() => console.log('Comment on own post:', post.id)}
            />
          )}
          localNewItem={localNewPost} // only shown on Posts tab
        />
      </YStack>
    </Screen>
  )
}
