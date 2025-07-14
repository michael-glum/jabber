// shared/components/user/UserCard.tsx
import React, { useMemo, useCallback } from 'react'
import { Pressable } from 'react-native'
import { YStack, XStack, Text, View } from 'tamagui'
import { Trophy, Flame, TrendingUp, MapPin, Crown, Star, Zap } from '@tamagui/lucide-icons'
import { User } from '~/shared/models/types'

interface UserCardProps {
  user: User
  rank: number
  onPress?: () => void
  variant?: 'leaderboard' | 'profile'
  trendingPercentage?: number
}

// Rank display with animations
const RankDisplay = React.memo(({ 
  rank 
}: { 
  rank: number;
}) => {
  const getRankDisplay = () => {
    switch (rank) {
      case 1:
        return (
          <YStack items="center" gap="$1">
            <Crown size={32} color="$yellow10" fill="$yellow10" />
            <Text fontSize="$2" fontWeight="bold" color="$yellow10">
              KING
            </Text>
          </YStack>
        );
      case 2:
        return (
          <YStack items="center" gap="$1">
            <Star size={28} color="$color10" fill="$color10" />
            <Text fontSize="$2" fontWeight="bold" color="$color10">
              #2
            </Text>
          </YStack>
        );
      case 3:
        return (
          <YStack items="center" gap="$1">
            <Star size={24} color="$red10" fill="$red10" />
            <Text fontSize="$2" fontWeight="bold" color="$red10">
              #3
            </Text>
          </YStack>
        );
      default:
        return (
          <View 
            width={50} 
            height={50} 
            rounded="$10" 
            bg="$color2" 
            items="center" 
            justify="center"
          >
            <Text fontSize="$5" fontWeight="bold" color="$color">
              {rank}
            </Text>
          </View>
        );
    }
  };

  return (
    <View 
      width={60} 
      items="center" 
      animation="bouncy"
      enterStyle={{ scale: 0 }}
      scale={1}
    >
      {getRankDisplay()}
    </View>
  );
});

// Streak display
const StreakDisplay = React.memo(({ streak }: { streak?: number }) => {
  if (!streak || streak === 0) return null;

  return (
    <XStack items="center" gap="$1" bg="$red2" px="$2" py="$1" rounded="$10">
      <Flame size={14} color="$red10" fill="$red10" />
      <Text fontSize="$2" color="$red10" fontWeight="600">
        {streak}d
      </Text>
    </XStack>
  );
});

export const UserCard = React.memo(({ 
  user, 
  rank, 
  onPress, 
  variant = 'leaderboard',
  trendingPercentage 
}: UserCardProps) => {
  const isTopThree = rank <= 3;
  
  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  const cardBg = useMemo(() => {
    if (rank === 1) return '$yellow1';
    if (rank === 2) return '$color1';
    if (rank === 3) return '$red1';
    return '$background';
  }, [rank]);

  return (
    <Pressable onPress={handlePress}>
      <XStack
        p="$4"
        bg={cardBg}
        borderBottomWidth={1}
        borderColor="$borderColor"
        items="center"
        gap="$3"
        pressStyle={{ opacity: 0.8, scale: 0.99 }}
        animation="quick"
      >
        {/* Rank Display */}
        <RankDisplay rank={rank} />

        {/* User Info */}
        <YStack flex={1} gap="$2">
          <XStack items="center" gap="$2">
            <Text 
              fontSize="$5" 
              fontWeight="700" 
              color="$color"
              textTransform="lowercase"
            >
              @{user.username}
            </Text>
          </XStack>
          
          <XStack items="center" gap="$3">
            {/* Location */}
            <XStack items="center" gap="$1" opacity={0.7}>
              <MapPin size={14} color="$color10" />
              <Text fontSize="$2" color="$color10">
                {user.region}
              </Text>
            </XStack>
            
            {/* Level */}
            {user.level && (
              <XStack items="center" gap="$1" bg="$accent" px="$2" py="$0.5" rounded="$10">
                <Zap size={12} color="white" fill="white" />
                <Text fontSize="$2" color="white" fontWeight="600">
                  LV{user.level}
                </Text>
              </XStack>
            )}
            
            {/* Streak */}
            <StreakDisplay streak={user.streak} />
            
            {/* Trending indicator for top users */}
            {isTopThree && trendingPercentage && trendingPercentage > 0 && (
              <XStack items="center" gap="$1" bg="$green2" px="$2" py="$0.5" rounded="$10">
                <TrendingUp size={12} color="$green10" />
                <Text fontSize="$2" color="$green10" fontWeight="600">
                  +{trendingPercentage}%
                </Text>
              </XStack>
            )}
          </XStack>
        </YStack>

        {/* Jabber Score */}
        <YStack items="flex-end" gap="$1">
          <XStack 
            items="center" 
            gap="$2" 
            bg={isTopThree ? "$color2" : "$color1"} 
            px="$3" 
            py="$2" 
            rounded="$10"
          >
            <Trophy 
              size={20} 
              color={rank === 1 ? "$yellow10" : "$color10"} 
              fill={rank === 1 ? "$yellow10" : "transparent"}
            />
            <Text 
              fontSize="$5" 
              fontWeight="bold"
              color={rank === 1 ? "$yellow10" : "$color"}
            >
              {user.jabberScore.toLocaleString()}
            </Text>
          </XStack>
          <Text fontSize="$1" color="$color10" textTransform="uppercase">
            jabber score
          </Text>
        </YStack>
      </XStack>
    </Pressable>
  );
});

UserCard.displayName = 'UserCard';