import { Text, YStack } from 'tamagui'
import { Feed } from '~/shared/components/feed/Feed'
import { Screen } from '~/shared/components/ui/Screen'
import { useForYouPosts } from './hooks/useForYouPosts'
import { useLocalPostStore } from '~/shared/store/postStore';
import Header from '~/shared/components/header/header';
import JabberScore from '~/shared/components/jabberscore/jabberscore';

export default function ForYouScreen() {
  const localNewPost = useLocalPostStore((state) => state.localNewPost);

  return (
    <Screen>
      <Header 
        title="Jabber" 
        rightComponent={<JabberScore />}
      />
      <YStack flex={1} bg="$background">
        <Feed
          tabNames={['For You'] as const}
          dataHookMap={{
            'For You': useForYouPosts,
          }}
          renderItem={(post) => (
            <YStack p="$4" borderBottomWidth={1} borderBottomColor="$borderColor">
              <Text fontSize="$5">{post.text}</Text>  
            </YStack>
          )}
          localNewItem={localNewPost}
        />
      </YStack>
    </Screen>
  )
}
