// components/feed/Feed.tsx
import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { Text, YStack } from 'tamagui';
import { FeedData } from './types';
import { FeedTabs } from './FeedTabs';

interface FeedProps<T> {
  tabNames?: readonly string[];
  dataHookMap: Record<string, () => FeedData<T>>;
  renderItem: (item: T, index: number) => React.ReactElement;
  localNewItem?: T | null;
}

export function Feed<T>({ tabNames, dataHookMap, renderItem, localNewItem }: FeedProps<T>) {
  const defaultTab = tabNames ? tabNames[0]: 'default';
  const [selectedTab, setSelectedTab] = React.useState(defaultTab);
  const feed = dataHookMap[selectedTab]?.();

  // Combine localNewItem with fetched data
  const combinedData = React.useMemo(() => {
    const items = [...(feed.data ?? [])];

    if (localNewItem && typeof localNewItem === 'object' && 'id' in localNewItem) {
      const localKey = feed.keyExtractor(localNewItem, -1);
      const alreadyExists = items.some((item, index) => feed.keyExtractor(item, index) === localKey);

      if (!alreadyExists) {
        items.unshift(localNewItem);
      }
    }

    return items;
  }, [feed.data, localNewItem]);

  const renderListItem = useCallback(
    ({ item, index }: ListRenderItemInfo<T>) => {
      return (renderItem as any)(item, index);
    },
    [renderItem]
  );

  if ((!feed.data || feed.data.length === 0) && feed.isLoading) {
    return (
      <YStack flex={1} justify="center" items="center">
        <Text fontSize="$5" color="$color">Loading...</Text>
      </YStack>
    );
  }

  const renderEmptyComponent = () => (
    <YStack flex={1} justify="center" items="center" p="$6">
      <Text fontSize="$5" color="$color">No content yet</Text>
      <Text fontSize="$5" color="$color9">Pull to refresh</Text>
    </YStack>
  );

  return (
    <YStack flex={1}>
      {tabNames && (
        <FeedTabs
          tabs={tabNames}
          selectedTab={selectedTab}
          onTabSelect={(tab) => {
            setSelectedTab(tab);
          }}
        />
      )}
      <FlatList
        data={combinedData}
        keyExtractor={(item, index) => feed.keyExtractor(item, index)}
        renderItem={renderListItem}
        onRefresh={feed.onRefresh}
        refreshing={feed.isLoading && combinedData.length === 0}
        onEndReached={feed.onEndReached}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}

        // Performance optimizations
        removeClippedSubviews={true}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        updateCellsBatchingPeriod={50}
        windowSize={12}
      />
    </YStack>
  );
}
