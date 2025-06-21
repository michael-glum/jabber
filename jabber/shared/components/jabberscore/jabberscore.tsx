// shared/components/jabberscore/jabberscore.tsx

import { Text, XStack } from 'tamagui'
import { Trophy } from '@tamagui/lucide-icons'
import { useCurrentUser } from '../../hooks/useCurrentUser'

export default function JabberScore() {
  const { data: user, isLoading } = useCurrentUser()
  
  if (isLoading) {
    return (
      <XStack items="center" gap="$2">
        <Trophy size={20} color="$yellow10" />
        <Text fontSize="$4" color="$yellow10" fontWeight="bold">
          ...
        </Text>
      </XStack>
    )
  }

  return (
    <XStack items="center" gap="$2">
      <Trophy size={20} color="$yellow10" />
      <Text fontSize="$4" color="$yellow10" fontWeight="bold">
        {user?.jabberScore ?? 0}
      </Text>
    </XStack>
  )
}