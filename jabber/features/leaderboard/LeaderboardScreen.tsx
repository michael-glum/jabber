// features/leaderboard/LeaderboardScreen.tsx
import React, { useCallback, useMemo } from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { Feed } from '~/shared/components/feed/Feed';
import { useLeaderboardUsers } from './hooks/useLeaderboardUsers';
import { User } from '~/shared/models/types';
import { Screen } from '~/shared/components/ui/Screen';
import Header from '~/shared/components/header/header';
import JabberScore from '~/shared/components/jabberscore/jabberscore';
import { UserCard } from '~/shared/components/user/UserCard';

const HeaderRight = React.memo(() => <JabberScore />)

// Pre-generate trending percentages to avoid random generation in render
const generateTrendingPercentages = (count: number) => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 50));
};

export default function LeaderboardScreen() {
  // Pre-calculate trending percentages for top 3 users
  const trendingPercentages = useMemo(() => generateTrendingPercentages(3), []);

  // Stable render function
  const renderUser = useCallback((user: User, _tab: string, index: number) => {
    const rank = index + 1;
    return (
      <UserCard 
        key={user.id}
        user={user} 
        rank={rank}
        trendingPercentage={rank <= 3 ? trendingPercentages[rank - 1] : undefined}
        onPress={() => console.log('Navigate to user:', user.username)}
      />
    );
  }, [trendingPercentages]);

  return (
    <Screen>
      <Header 
        title="Leaderboard" 
        rightComponent={<HeaderRight />}
      />
      <YStack flex={1} bg="$background">
        <Feed
          tabNames={['Trending', 'All Time'] as const}
          dataHookMap={{
            'Trending': () => useLeaderboardUsers('trending'),
            'All Time': () => useLeaderboardUsers('allTime'),
          }}
          renderItem={renderUser}
        />
      </YStack>
    </Screen>
  );
}