// components/feed/FeedTabs.tsx
import React, { useCallback } from 'react'
import { XStack, Text } from 'tamagui'

interface FeedTabsProps {
  tabs: readonly string[]
  selectedTab: string
  onTabSelect: (tab: string) => void
}

// Memoized tab item
const TabItem = React.memo(({ 
  tab, 
  isSelected, 
  onPress 
}: { 
  tab: string; 
  isSelected: boolean; 
  onPress: () => void;
}) => (
  <XStack
    flex={1} 
    justify="center"
    onPress={onPress}
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
));

export const FeedTabs = React.memo(({ tabs, selectedTab, onTabSelect }: FeedTabsProps) => {
  // Create stable callbacks for each tab
  const handleTabPress = useCallback((tab: string) => {
    return () => onTabSelect(tab);
  }, [onTabSelect]);

  return (
    <XStack borderBottomWidth={1} borderColor="$borderColor" bg="$background">
      {tabs.map(tab => (
        <TabItem
          key={tab}
          tab={tab}
          isSelected={selectedTab === tab}
          onPress={handleTabPress(tab)}
        />
      ))}
    </XStack>
  )
});

FeedTabs.displayName = 'FeedTabs';