// components/feed/FeedTabs.tsx
import React, { useCallback, useRef, useEffect, useState } from 'react'
import { XStack, Text, View } from 'tamagui'
import { Animated } from 'react-native'

interface FeedTabsProps {
  tabs: readonly string[]
  selectedTab: string
  onTabSelect: (tab: string) => void
}

// Individual tab item with animations
const TabItem = React.memo(({ 
  tab, 
  isSelected, 
  onPress,
  index,
  totalTabs
}: { 
  tab: string; 
  isSelected: boolean; 
  onPress: () => void;
  index: number;
  totalTabs: number;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1.05 : 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  return (
    <XStack
      flex={1} 
      justify="center"
      onPress={onPress}
      px="$3"
      py="$3"
      pressStyle={{ opacity: 0.7 }}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text 
          fontSize="$5" 
          fontWeight="700" 
          color={isSelected ? '$accent' : '$color10'}
          textTransform="lowercase"
          letterSpacing={-0.5}
        >
          {tab}
        </Text>
      </Animated.View>
    </XStack>
  );
});

export const FeedTabs = React.memo(({ tabs, selectedTab, onTabSelect }: FeedTabsProps) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const selectedIndex = tabs.indexOf(selectedTab);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: selectedIndex * (100 / tabs.length),
      tension: 300,
      friction: 20,
      useNativeDriver: true,
    }).start();
  }, [selectedIndex, tabs.length]);

  // Create stable callbacks for each tab
  const handleTabPress = useCallback((tab: string) => {
    return () => onTabSelect(tab);
  }, [onTabSelect]);

  return (
    <XStack 
      borderBottomWidth={2} 
      borderColor="$borderColor" 
      bg="$background"
      position="relative"
    >
      {/* Animated underline */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: -2,
          left: 0,
          height: 2,
          width: `${100 / tabs.length}%`,
          backgroundColor: 'var(--accent)',
          transform: [{
            translateX: slideAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          }],
        }}
      />
      
      {/* Tab items */}
      {tabs.map((tab, index) => (
        <TabItem
          key={tab}
          tab={tab}
          isSelected={selectedTab === tab}
          onPress={handleTabPress(tab)}
          index={index}
          totalTabs={tabs.length}
        />
      ))}
    </XStack>
  );
});

FeedTabs.displayName = 'FeedTabs';