// features/profile/ProfileScreen.tsx
import React, { useCallback } from 'react';
import { YStack, Text, XStack, View, AnimatePresence } from 'tamagui';
import { Feed } from '~/shared/components/feed/Feed';
import { useProfilePosts } from './hooks/useProfilePosts';
import { useLocalPostStore } from '~/shared/store/postStore';
import { Screen } from '~/shared/components/ui/Screen';
import { useCurrentUser } from '~/shared/hooks/useCurrentUser';
import JabberScore from '~/shared/components/jabberscore/jabberscore';
import Header from '~/shared/components/header/header';
import { MapPin, Trophy, Flame, ShoppingBag, Star } from '@tamagui/lucide-icons';
import { PostCard } from '~/shared/components/post/PostCard';
import { Post } from '~/shared/models/types';

const HeaderRight = React.memo(() => <JabberScore />)

// Gamified profile header
const ProfileHeader = React.memo(({ user }: { user: any }) => (
  <YStack 
    bg="$backgroundStrong" 
    borderBottomWidth={2} 
    borderColor="$borderColor"
    p="$4"
    gap="$4"
  >
    {/* Main user info */}
    <YStack gap="$3">
      <XStack items="center" justify="space-between">
        <YStack gap="$1">
          <Text fontSize="$7" fontWeight="bold" textTransform="lowercase">
            @{user?.username || 'loading...'}
          </Text>
          
          <XStack items="center" gap="$2">
            <MapPin size={16} color="$color10" />
            <Text fontSize="$3" color="$color10">
              {user?.region || '...'}
            </Text>
          </XStack>
        </YStack>

        {/* Shop button */}
        <YStack items="center" gap="$1">
          <ShoppingBag size={20} color="$color10" />
          <Text fontSize="$2" color="$color10">
            SHOP
          </Text>
        </YStack>
      </XStack>

      {/* Stats row */}
      <XStack gap="$3" justify="space-around" pt="$2">
        {/* Jabber Score */}
        <YStack items="center" gap="$1" flex={1}>
          <XStack items="center" gap="$2">
            <Trophy size={24} color="$yellow10" fill="$yellow10" />
            <Text fontSize="$6" fontWeight="bold" color="$yellow10">
              {user?.jabberScore?.toLocaleString() || '...'}
            </Text>
          </XStack>
          <Text fontSize="$2" color="$color10" textTransform="uppercase">
            jabberscore
          </Text>
        </YStack>

        {/* Streak */}
        {user?.streak && user.streak > 0 && (
          <YStack items="center" gap="$1" flex={1}>
            <XStack items="center" gap="$2">
              <Flame size={24} color="$red10" fill="$red10" />
              <Text fontSize="$6" fontWeight="bold" color="$red10">
                {user.streak}
              </Text>
            </XStack>
            <Text fontSize="$2" color="$color10" textTransform="uppercase">
              streak
            </Text>
          </YStack>
        )}

        {/* Level */}
        {user?.level && (
          <YStack items="center" gap="$1" flex={1}>
            <XStack items="center" gap="$2">
              <Star size={24} color="$accent" fill="$accent" />
              <Text fontSize="$6" fontWeight="bold" color="$accent">
                {user.level}
              </Text>
            </XStack>
            <Text fontSize="$2" color="$color10" textTransform="uppercase">
              level
            </Text>
          </YStack>
        )}
      </XStack>
    </YStack>

    {/* Progress to next level */}
    {user?.level && (
      <YStack gap="$2">
        <XStack items="center" justify="space-between">
          <Text fontSize="$3" color="$color10">
            Progress to Level {user.level + 1}
          </Text>
          <Text fontSize="$3" fontWeight="bold" color="$accent">
            65%
          </Text>
        </XStack>
        <View height={8} bg="$color2" rounded="$10" overflow="hidden">
          <View 
            height="100%" 
            width="65%" 
            bg="$accent"
            animation="quick"
          />
        </View>
      </YStack>
    )}
  </YStack>
));

export default function ProfileScreen() {
  const localNewPost = useLocalPostStore((s) => s.localNewPost);
  const { data: currentUser } = useCurrentUser();

  // Stable render function
  const renderPost = useCallback((post: Post) => {
    return (
      <PostCard
        key={post.id}
        post={post}
      />
    )
  }, []);

  return (
    <Screen>
      <ProfileHeader user={currentUser} />
      
      <YStack flex={1} bg="$background">
        <Feed
          tabNames={['posts', 'reactions'] as const}
          dataHookMap={{
            posts: () => useProfilePosts('mine'),
            reactions: () => useProfilePosts('reactions'),
          }}
          renderItem={renderPost}
          localNewItem={localNewPost}
        />
      </YStack>
    </Screen>
  )
}