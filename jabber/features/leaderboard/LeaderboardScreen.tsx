// features/leaderboard/LeaderboardScreen.tsx
import React, { useCallback, useMemo } from 'react';
import { YStack, XStack, Text, View } from 'tamagui';
import { Feed } from '~/shared/components/feed/Feed';
import { useLeaderboardUsers } from './hooks/useLeaderboardUsers';
import { User } from '~/shared/models/types';
import { Screen } from '~/shared/components/ui/Screen';
import Header from '~/shared/components/header/header';
import JabberScore from '~/shared/components/jabberscore/jabberscore';
import { UserCard } from '~/shared/components/user/UserCard';
import { Crown, TrendingUp, Flame } from '@tamagui/lucide-icons';

const HeaderRight = React.memo(() => <JabberScore />)

// Leaderboard header with top 3 preview
const LeaderboardHeader = React.memo(({ type }: { type: string }) => (
  <YStack bg="$backgroundStrong" p="$4" gap="$3" borderBottomWidth={2} borderColor="$borderColor">
    <XStack items="center" justify="center" gap="$2">
      {type === 'Trending' ? (
        <>
          <TrendingUp size={24} color="$green10" />
          <Text fontSize="$6" fontWeight="bold" color="$green10">
            trending now
          </Text>
        </>
      ) : (
        <>
          <Crown size={24} color="$yellow10" fill="$yellow10" />
          <Text fontSize="$6" fontWeight="bold" color="$yellow10">
            all time legends
          </Text>
        </>
      )}
    </XStack>
    
    <Text fontSize="$3" color="$color10" text="center">
      {type === 'Trending' 
        ? "hottest jabbers in the last 24h 🔥"
        : "the ultimate chaos champions 👑"
      }
    </Text>
  </YStack>
));

export default function LeaderboardScreen() {
  const [selectedTab, setSelectedTab] = React.useState<'Trending' | 'All Time'>('Trending');

  // Pre-generate trending percentages once
  const trendingPercentages = useMemo(() => {
    // Generate 100 random percentages for top users
    return Array.from({ length: 100 }, () => Math.floor(Math.random() * 50) + 10);
  }, []);

  // Stable render function
  const renderUser = useCallback((user: User, _tab: string, index: number) => {
    const rank = index + 1;
    const trendingPercentage = selectedTab === 'Trending' && rank <= 10 
      ? trendingPercentages[index] 
      : undefined;

    return (
      <UserCard 
        key={user.id}
        user={user} 
        rank={rank}
        trendingPercentage={trendingPercentage}
        onPress={() => console.log('Navigate to user:', user.username)}
      />
    );
  }, [selectedTab, trendingPercentages]);

  const handleTabSelect = useCallback((tab: string) => {
    setSelectedTab(tab as 'Trending' | 'All Time');
  }, []);

  return (
    <Screen>
      <Header 
        title="leaderboard" 
        rightComponent={<HeaderRight />}
      />
      
      <LeaderboardHeader type={selectedTab} />
      
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