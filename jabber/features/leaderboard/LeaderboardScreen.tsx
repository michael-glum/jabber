import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { Feed } from '~/shared/components/feed/Feed';
import { useLeaderboardUsers } from './hooks/useLeaderboardUsers';
import { User } from '~/shared/models/types';
import { Screen } from '~/shared/components/ui/Screen';
import Header from '~/shared/components/header/header';
import JabberScore from '~/shared/components/jabberscore/jabberscore';

function UserCard({ user, rank }: { user: User; rank: number }) {
  return (
    <XStack
      p="$3"
      borderBottomWidth={1}
      borderColor="$borderColor"
      items="center"
      gap="$3"
    >
      <Text fontWeight="bold" fontSize="$5" width={30}>#{rank}</Text>
      <YStack flex={1}>
        <Text fontSize="$5">{user.username}</Text>
        <Text fontSize="$2" color="$color10">{user.region}</Text>
      </YStack>
      <Text fontWeight="600" fontSize="$4">{user.jabberScore}</Text>
    </XStack>
  );
}

export default function LeaderboardScreen() {
  return (
    <Screen>
      <Header 
        title="Leaderboard" 
        rightComponent={<JabberScore />}
      />
      <YStack flex={1} bg="$background">
        <Feed
          tabNames={['Trending', 'All Time'] as const}
          dataHookMap={{
            'Trending': () => useLeaderboardUsers('trending'),
            'All Time': () => useLeaderboardUsers('allTime'),
          }}
          renderItem={(user, _tab, index = 0) => (
            <UserCard user={user} rank={index + 1} />
          )}
        />
      </YStack>
    </Screen>
  );
}
