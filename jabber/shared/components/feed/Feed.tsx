// components/feed/Feed.tsx
import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, RefreshControl } from 'react-native';
import { Text, YStack, View } from 'tamagui';
import { FeedData } from './types';
import { FeedTabs } from './FeedTabs';

interface FeedProps<T> {
  tabNames?: readonly string[];
  dataHookMap: Record<string, () => FeedData<T>>;
  renderItem: (item: T, tabName: string, index: number) => React.ReactElement;
  localNewItem?: T | null;
}

// Optimized empty component
const EmptyComponent = React.memo(() => (
  <YStack flex={1} justify="center" items="center" p="$6">
    <Text fontSize="$8" mb="$4">🫥</Text>
    <Text fontSize="$5" color="$color" fontWeight="600">
      nothing here yet
    </Text>
    <Text fontSize="$4" color="$color10" mt="$2">
      pull down to refresh
    </Text>
  </YStack>
));

// Optimized loading component with skeleton
const LoadingComponent = React.memo(() => (
  <YStack flex={1} p="$3" gap="$2">
    {[1, 2, 3].map((i) => (
      <YStack 
        key={i} 
        bg="$backgroundStrong" 
        height={120} 
        rounded="$6" 
        p="$4"
        gap="$3"
        animation="quick"
        opacity={0.5}
        animateOnly={["opacity"]}
      >
        <View height={20} width="40%" bg="$color2" rounded="$2" />
        <View height={16} width="100%" bg="$color1" rounded="$2" />
        <View height={16} width="80%" bg="$color1" rounded="$2" />
      </YStack>
    ))}
  </YStack>
));

// Optimized item separator
const ItemSeparator = React.memo(() => <View height={8} />);

export function Feed<T>({ tabNames, dataHookMap, renderItem, localNewItem }: FeedProps<T>) {
  const defaultTab = tabNames ? tabNames[0] : 'default';
  const [selectedTab, setSelectedTab] = React.useState(defaultTab);
  const feed = dataHookMap[selectedTab]?.();
  const flatListRef = React.useRef<FlatList<T>>(null);

  // Memoize combined data more efficiently
  const combinedData = useMemo(() => {
    if (!feed.data) return [];
    
    const items = [...feed.data];
    
    // Only add local item if it's not already in the list
    if (localNewItem && typeof localNewItem === 'object' && 'id' in localNewItem) {
      const localKey = feed.keyExtractor(localNewItem, -1);
      const exists = items.some((item, index) => 
        feed.keyExtractor(item, index) === localKey
      );
      
      if (!exists) {
        items.unshift(localNewItem);
      }
    }

    return items;
  }, [feed.data, feed.keyExtractor, localNewItem]);

  // Auto-scroll to top when new local item is added
  React.useEffect(() => {
    if (localNewItem && flatListRef.current) {
      // Small delay to ensure the item is rendered
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    }
  }, [localNewItem]);

  // Optimized render function with better memoization
  const renderListItem = useCallback(
    ({ item, index }: ListRenderItemInfo<T>) => {
      return renderItem(item, selectedTab, index);
    },
    [renderItem, selectedTab]
  );

  // Stable keyExtractor
  const keyExtractor = useCallback(
    (item: T, index: number) => feed.keyExtractor(item, index),
    [feed.keyExtractor]
  );

  // Optimized callbacks
  const handleRefresh = useCallback(() => {
    feed.onRefresh();
  }, [feed]);

  const handleEndReached = useCallback(() => {
    if (!feed.isLoading) {
      feed.onEndReached();
    }
  }, [feed.isLoading, feed.onEndReached]);

  const handleTabSelect = useCallback((tab: string) => {
    setSelectedTab(tab);
  }, []);

  // Custom refresh control for better UX
  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={feed.isLoading && combinedData.length > 0}
        onRefresh={handleRefresh}
        tintColor="#A855F7"
        colors={["#A855F7"]}
        progressBackgroundColor="#ffffff"
      />
    ),
    [feed.isLoading, combinedData.length, handleRefresh]
  );

  return (
    <YStack flex={1}>
      {tabNames && (
        <FeedTabs
          tabs={tabNames}
          selectedTab={selectedTab}
          onTabSelect={handleTabSelect}
        />
      )}
      {(!feed.data || feed.data.length === 0) && feed.isLoading ? (
        <LoadingComponent />
      ) : (
        <FlatList
        ref={flatListRef}
        data={combinedData}
        keyExtractor={keyExtractor}
        renderItem={renderListItem}
        refreshControl={refreshControl}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={EmptyComponent}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={{ 
          flexGrow: 1,
          paddingVertical: 8,
        }}
        showsVerticalScrollIndicator={false}

        // Enhanced performance optimizations
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={30}
        windowSize={7}
        
        // Optimize for scroll performance
        scrollEventThrottle={16}
        decelerationRate="fast"
        
        // Prevent unnecessary re-renders
        extraData={selectedTab}
        
        // Better memory management
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
        
        // Disable overscroll on iOS
        bounces={true}
        overScrollMode="never"
      />
      )}
    </YStack>
  );
}