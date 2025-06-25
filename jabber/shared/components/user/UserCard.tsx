// shared/components/user/UserCard.tsx
import React, { useMemo, useCallback } from 'react'
import { Pressable } from 'react-native'
import { YStack, XStack, Text, View } from 'tamagui'
import { Trophy, Flame, TrendingUp, MapPin } from '@tamagui/lucide-icons'
import { User } from '~/shared/models/types'

interface UserCardProps {
  user: User
  rank: number
  onPress?: () => void
  variant?: 'leaderboard' | 'profile'
  trendingPercentage?: number // Pass this from parent to avoid random generation
}

const getRankEmoji = (rank: number) => {
  switch (rank) {
    case 1: return '👑'
    case 2: return '🥈'
    case 3: return '🥉'
    default: return null
  }
}

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1: return '$yellow10'
    case 2: return '$color10'
    case 3: return '$jabberOrange'
    default: return '$color'
  }
}

// Memoized sub-components
const RankDisplay = React.memo(({ rank, emoji }: { rank: number; emoji: string | null }) => (
  <XStack 
    width={50} 
    items="center" 
    justify="center"
    animation="bouncy"
    enterStyle={{ scale: 0 }}
    scale={1}
  >
    {emoji ? (
      <Text fontSize="$7">{emoji}</Text>
    ) : (
      <Text 
        fontSize="$6" 
        fontWeight="bold" 
        color={getRankColor(rank)}
      >
        #{rank}
      </Text>
    )}
  </XStack>
));

const LocationBadge = React.memo(({ region }: { region: string }) => (
  <XStack items="center" gap="$1" opacity={0.7}>
    <MapPin size={14} color="$color10" />
    <Text fontSize="$2" color="$color10">
      {region}
    </Text>
  </XStack>
));

const TrendingIndicator = React.memo(({ percentage }: { percentage: number }) => (
  <XStack items="center" gap="$1">
    <TrendingUp size={14} color="$green10" />
    <Text fontSize="$2" color="$green10" fontWeight="600">
      +{percentage}%
    </Text>
  </XStack>
));

const JabberScoreDisplay = React.memo(({ 
  score, 
  isTopThree, 
  rank 
}: { 
  score: number; 
  isTopThree: boolean; 
  rank: number 
}) => (
  <YStack items="flex-end" gap="$1">
    <XStack items="center" gap="$2">
      <Trophy 
        size={20} 
        color={isTopThree ? getRankColor(rank) : "$yellow10"} 
        fill={isTopThree ? getRankColor(rank) : "transparent"}
      />
      <Text 
        fontSize="$5" 
        fontWeight="bold"
        color={isTopThree ? getRankColor(rank) : "$yellow10"}
      >
        {score.toLocaleString()}
      </Text>
    </XStack>
    <Text fontSize="$1" color="$color10" textTransform="uppercase">
      jabber score
    </Text>
  </YStack>
));

export const UserCard = React.memo(({ 
  user, 
  rank, 
  onPress, 
  variant = 'leaderboard',
  trendingPercentage 
}: UserCardProps) => {
  const rankEmoji = useMemo(() => getRankEmoji(rank), [rank]);
  const isTopThree = rank <= 3;
  
  // Use provided trending percentage or calculate once
  const trendingValue = useMemo(() => 
    trendingPercentage ?? (isTopThree ? Math.floor(Math.random() * 50) : 0),
    [isTopThree, trendingPercentage]
  );

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  const cardStyle = useMemo(() => ({
    backgroundColor: isTopThree ? '$color1' : '$background',
  }), [isTopThree]);

  return (
    <Pressable onPress={handlePress}>
      <XStack
        p="$4"
        borderBottomWidth={1}
        borderColor="$borderColor"
        items="center"
        gap="$3"
        pressStyle={{ opacity: 0.8, scale: 0.99 }}
        animation="quick"
      >
        {/* Rank */}
        <RankDisplay rank={rank} emoji={rankEmoji} />

        {/* User Info */}
        <YStack flex={1} gap="$1">
          <XStack items="center" gap="$2">
            <Text 
              fontSize="$5" 
              fontWeight="600" 
              color="$color"
              textTransform="lowercase"
            >
              @{user.username}
            </Text>
            {rank === 1 && (
              <Flame size={16} color="$yellow10" fill="$yellow10" />
            )}
          </XStack>
          
          <XStack items="center" gap="$3">
            <LocationBadge region={user.region} />
            
            {/* Show trending indicator for top users */}
            {isTopThree && trendingValue > 0 && (
              <TrendingIndicator percentage={trendingValue} />
            )}
          </XStack>
        </YStack>

        {/* Jabber Score */}
        <JabberScoreDisplay 
          score={user.jabberScore} 
          isTopThree={isTopThree} 
          rank={rank} 
        />
      </XStack>
    </Pressable>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.jabberScore === nextProps.user.jabberScore &&
    prevProps.rank === nextProps.rank &&
    prevProps.variant === nextProps.variant
  );
});

UserCard.displayName = 'UserCard';