// components/feed/FeedTabs.tsx
import { XStack, Text } from 'tamagui'

interface FeedTabsProps {
  tabs: readonly string[]
  selectedTab: string
  onTabSelect: (tab: string) => void
}

export function FeedTabs({ tabs, selectedTab, onTabSelect }: FeedTabsProps) {
  return (
    <XStack borderBottomWidth={1} borderColor="$borderColor" bg="$background">
      {tabs.map(tab => {
        const isSelected = selectedTab === tab
        return (
          <XStack
            key={tab}
            flex={1} 
            justify="center"
            onPress={() => onTabSelect(tab)}
            px="$4"
            py="$3"
            mx="$1"
            position="relative"
            pressStyle={{ opacity: 0.7 }}
          >
            <Text fontSize="$5" fontWeight="600" color={isSelected ? '$color' : '$color10'}>
              {tab}
            </Text>
            {isSelected && (
              <XStack
                height={3}
                bg="$color"
                position="absolute"
                b={0}
                l={0}
                r={0}
                rounded="$1"
              />
            )}
          </XStack>
        )
      })}
    </XStack>
  )
}
