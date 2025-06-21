import { Text, View, YStack } from 'tamagui'
import { Feed } from '~/shared/components/feed/Feed'
import { Screen } from '~/shared/components/ui/Screen'
import { useHotPosts } from './hooks/useHotPosts'
import Header from '~/shared/components/header/header'
import JabberScore from '~/shared/components/jabberscore/jabberscore'

export default function HotScreen() {
  return (
    <Screen>
      <Header 
        title="Hot" 
        rightComponent={<JabberScore />}
      />
      <YStack flex={1} bg="$background">
        <Feed
          tabNames={['Trending', 'All Time'] as const}
          dataHookMap={{
            'Trending': () => useHotPosts('trending'),
            'All Time': () => useHotPosts('allTime'),
          }}
          renderItem={(post) => (
            <YStack p="$4" borderBottomWidth={1} borderColor="$borderColor">
              <Text fontSize="$5">{post.text}</Text>
            </YStack>
          )}
        />
      </YStack>
    </Screen>
  )
}
