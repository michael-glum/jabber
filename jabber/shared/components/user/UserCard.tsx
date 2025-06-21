
// shared/components/user/UserCard.tsx
import React from 'react'
import { Pressable } from 'react-native'
import { YStack, XStack, Text, View } from 'tamagui'
import { Trophy, Flame, TrendingUp, MapPin } from '@tamagui/lucide-icons'
import { User } from '~/shared/models/types'

interface UserCardProps {
  user: User
  rank: number
  onPress?: () => void
  variant?: 'leaderboard' | 'profile'
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

export function UserCard({ user, rank, onPress, variant = 'leaderboard' }: UserCardProps) {
  const rankEmoji = getRankEmoji(rank)
  const isTopThree = rank <= 3

  return (
    <Pressable onPress={onPress}>
      <XStack
        p="$4"
        borderBottomWidth={1}
        borderColor="$borderColor"
        items="center"
        gap="$3"
        bg={isTopThree ? '$color1' : '$background'}
        pressStyle={{ opacity: 0.8, scale: 0.99 }}
        animation="quick"
      >
        {/* Rank */}
        <XStack 
          width={50} 
          items="center" 
          justify="center"
          animation="bouncy"
          enterStyle={{ scale: 0 }}
          scale={1}
        >
          {rankEmoji ? (
            <Text fontSize="$7">{rankEmoji}</Text>
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
            <XStack items="center" gap="$1" opacity={0.7}>
              <MapPin size={14} color="$color10" />
              <Text fontSize="$2" color="$color10">
                {user.region}
              </Text>
            </XStack>
            
            {/* Show trending indicator for top users */}
            {isTopThree && (
              <XStack items="center" gap="$1">
                <TrendingUp size={14} color="$green10" />
                <Text fontSize="$2" color="$green10" fontWeight="600">
                  +{Math.floor(Math.random() * 50)}%
                </Text>
              </XStack>
            )}
          </XStack>
        </YStack>

        {/* Jabber Score */}
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
              {user.jabberScore.toLocaleString()}
            </Text>
          </XStack>
          <Text fontSize="$1" color="$color10" textTransform="uppercase">
            jabber score
          </Text>
        </YStack>
      </XStack>
    </Pressable>
  )
}