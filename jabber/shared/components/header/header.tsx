// shared/components/header/header.tsx
import React from 'react'
import { Text, XStack, View } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'
import { Flame } from '@tamagui/lucide-icons'
import { useCurrentUser } from '../../hooks/useCurrentUser'

interface HeaderProps {
  title: string
  leftComponent?: React.ReactNode
  rightComponent?: React.ReactNode
}

const TitleWithStreak = React.memo(({ title }: { title: string }) => {
  const { data: user } = useCurrentUser()
  const streak = user?.streak || 0

  return (
    <XStack items="center" gap="$2">
      <Text 
        fontSize="$7" 
        fontWeight="800" 
        color="$accent"
        textTransform="lowercase"
        letterSpacing={-1}
      >
        {title}
      </Text>
      
      {/* Streak Badge - only show for "jabber" title and when streak > 0 */}
      {title === "jabber" && streak > 0 && (
        <XStack 
          items="center" 
          gap="$1" 
          bg="$yellow10" 
          px="$2" 
          py="$1" 
          rounded="$10"
          animation="quick"
          enterStyle={{ scale: 0 }}
        >
          <Flame size={14} color="white" fill="white" />
          <Text fontSize="$2" color="white" fontWeight="bold">
            {streak}
          </Text>
        </XStack>
      )}
    </XStack>
  )
})

export default function Header({ title, leftComponent, rightComponent }: HeaderProps) {
  return (
    <XStack
      height={60}
      px="$4"
      items="center"
      justify="space-between"
      borderBottomWidth={2}
      borderColor="$borderColor"
      bg="$backgroundStrong"
    >
      {/* Left section */}
      <View width={80} items="flex-start">
        {leftComponent}
      </View>
      
      {/* Center title with gradient text effect */}
      <View flex={1} items="center">
        <TitleWithStreak title={title} />
      </View>
      
      {/* Right section */}
      <View width={80} items="flex-end">
        {rightComponent}
      </View>
    </XStack>
  )
}