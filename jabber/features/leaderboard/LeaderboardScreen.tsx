import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { Feed } from '~/shared/components/feed/Feed';
import { useLeaderboardUsers } from './hooks/useLeaderboardUsers';
import { User } from '~/shared/models/types';
import { Screen } from '~/shared/components/ui/Screen';
import Header from '~/shared/components/header/header';
import JabberScore from '~/shared/components/jabberscore/jabberscore';
import { UserCard } from '~/shared/components/user/UserCard';

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
            <UserCard 
              user={user} 
              rank={index + 1}
              onPress={() => console.log('Navigate to user:', user.username)}
            />
          )}
        />
      </YStack>
    </Screen>
  );
}
