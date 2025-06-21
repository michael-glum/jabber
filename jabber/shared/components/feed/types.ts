// components/feed/types.ts
export interface FeedData<T> {
  data: T[] | undefined;
  isLoading: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  keyExtractor: (item: T, index: number) => string;
}