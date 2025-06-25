// components/feed/Feed.tsx
import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { Text, YStack } from 'tamagui';
import { FeedData } from './types';
import { FeedTabs } from './FeedTabs';

interface FeedProps<T> {
  tabNames?: readonly string[];
  dataHookMap: Record<string, () => FeedData<T>>;
  renderItem: (item: T, tabName: string, index: number) => React.ReactElement;
  localNewItem?: T | null;
}

// Memoized empty component
const EmptyComponent = React.memo(() => (
  <YStack flex={1} justify="center" items="center" p="$6">
    <Text fontSize="$5" color="$color">No content yet</Text>
    <Text fontSize="$5" color="$color9">Pull to refresh</Text>
  </YStack>
));

// Memoized loading component
const LoadingComponent = React.memo(() => (
  <YStack flex={1} justify="center" items="center">
    <Text fontSize="$5" color="$color">Loading...</Text>
  </YStack>
));

export function Feed<T>({ tabNames, dataHookMap, renderItem, localNewItem }: FeedProps<T>) {
  const defaultTab = tabNames ? tabNames[0] : 'default';
  const [selectedTab, setSelectedTab] = React.useState(defaultTab);
  const feed = dataHookMap[selectedTab]?.();

  // Memoize combined data to prevent recreating array on every render
  const combinedData = useMemo(() => {
    const items = [...(feed.data ?? [])];

    if (localNewItem && typeof localNewItem === 'object' && 'id' in localNewItem) {
      const localKey = feed.keyExtractor(localNewItem, -1);
      const alreadyExists = items.some((item, index) => feed.keyExtractor(item, index) === localKey);

      if (!alreadyExists) {
        items.unshift(localNewItem);
      }
    }

    return items;
  }, [feed.data, feed.keyExtractor, localNewItem]);

  // Stable renderItem callback
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

  // Stable callbacks
  const handleRefresh = useCallback(() => {
    feed.onRefresh();
  }, [feed.onRefresh]);

  const handleEndReached = useCallback(() => {
    feed.onEndReached();
  }, [feed.onEndReached]);

  const handleTabSelect = useCallback((tab: string) => {
    setSelectedTab(tab);
  }, []);

  if ((!feed.data || feed.data.length === 0) && feed.isLoading) {
    return <LoadingComponent />;
  }

  return (
    <YStack flex={1}>
      {tabNames && (
        <FeedTabs
          tabs={tabNames}
          selectedTab={selectedTab}
          onTabSelect={handleTabSelect}
        />
      )}
      <FlatList
        data={combinedData}
        keyExtractor={keyExtractor}
        renderItem={renderListItem}
        onRefresh={handleRefresh}
        refreshing={feed.isLoading && combinedData.length === 0}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={EmptyComponent}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}

        // Performance optimizations
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        
        // Additional optimizations
        getItemLayout={
          // Only use if items have consistent height
          undefined
        }
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />
    </YStack>
  );
}