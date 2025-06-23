import { Text, YStack } from 'tamagui'
import { Feed } from '~/shared/components/feed/Feed'
import { Screen } from '~/shared/components/ui/Screen'
import { useForYouPosts } from './hooks/useForYouPosts'
import { useLocalPostStore } from '~/shared/store/postStore';
import Header from '~/shared/components/header/header';
import JabberScore from '~/shared/components/jabberscore/jabberscore';
import PostCard from '~/shared/components/post/PostCard';

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
            <PostCard
              post={post}
              onReact={(emoji) => console.log('Reacted with:', emoji)}
              onComment={() => console.log('Commented on post:', post.id)}
            />
          )}
          localNewItem={localNewPost}
        />
      </YStack>
    </Screen>
  )
}
