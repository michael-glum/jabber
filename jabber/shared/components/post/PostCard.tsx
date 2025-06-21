// shared/components/post/PostCard.tsx
import React, { useState, useRef } from 'react';
import { ScrollView, Pressable } from 'react-native';
import { YStack, XStack, Text, AnimatePresence, View } from 'tamagui';
import { Heart, MessageCircle, Zap, Flame, Skull, Sparkles, Ghost, PartyPopper} from '@tamagui/lucide-icons';
import { Post } from '~/shared/models/types';

interface PostCardProps {
  post: Post;
  onLike?: () => void;
  onReact?: (emoji: string) => void;
  onComment?: () => void;
}

const REACTION_EMOJIS = [
  { emoji: '🔥', key: 'fire' },
  { emoji: '💀', key: 'skull' },
  { emoji: '😭', key: 'crying' },
  { emoji: '🤯', key: 'mindblown' },
  { emoji: '👀', key: 'eyes' },
  { emoji: '✨', key: 'sparkles' },
  { emoji: '🤡', key: 'clown' },
  { emoji: '💯', key: 'hundred' },
  { emoji: '👻', key: 'ghost' },
  { emoji: '🎉', key: 'party' },
];

export default function PostCard({ post, onLike, onReact, onComment }: PostCardProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [userReaction, setUserReaction] = useState(post.userReaction);
  const scrollRef = useRef<ScrollView>(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount -1 : likeCount + 1);
    onLike?.();
  }

  const handleReact = (emoji: string) => {
    setUserReaction(emoji === userReaction ? undefined : emoji);
    onReact?.(emoji);
    setShowReactions(false);
  }

  return (
    <YStack
      bg="$background"
      borderBottomWidth={1}
      borderColor="$borderColor"
      p="$4"
      gap="$3"
      pressStyle={{ opacity: 0.98 }}
    >
      {/* Username */}
      <XStack items="center" justify="space-between">
        <Text
          fontSize="$4"
          fontWeight="600"
          color="$color10"
          textTransform="lowercase"
        >
          @{post.username}
        </Text>
      </XStack>

      {/* Post Text */}
      <Text
        fontSize="$5"
        lineHeight="$6"
        color="$color"
        fontWeight="500"
      >
        {post.text}
      </Text>

      {/* Actions */}
      <XStack items="center" justify="space-between">
        {/* Left side - comment count */}
        <Pressable onPress={onComment}>
          <XStack items="center" gap="$2" opacity={0.7}>
            <MessageCircle size={20} color="$color10"/>
            <Text fontSize="$3" color="$color10">
              {post.commentCount}
            </Text>
          </XStack>
        </Pressable>

        {/* Right side - reactions and like */}
        <XStack items="center" gap="$3">
          {/* Reaction Button */}
          <Pressable onPress={() => setShowReactions(!showReactions)}>
            <XStack
              items="center"
              px="$3"
              py="$2"
              rounded="$10"
              bg={showReactions || userReaction ? "$color2" : "transparent"}
              borderWidth={1}
              borderColor={userReaction ? "$accentForeground" : "$borderColor"}
              pressStyle={{ opacity: 0.95 }}
              animation="quick"
            >
              {userReaction ? (
                <Text fontSize="$4">{userReaction}</Text>
              ) : (
                <Sparkles size={18} color="$yellow10" />
              )}
            </XStack>
          </Pressable>

          {/* Like Button */}
          <Pressable onPress={handleLike}>
            <XStack
              items="center"
              gap="$2"
              px="$3"
              py="$2"
              rounded="$10"
              bg={isLiked ? "$red2" : "transparent"}
              borderWidth={1}
              borderColor={isLiked ? "$red8" : "$borderColor"}
              pressStyle={{ scale: 0.95}}
              animation="quick"
            >
              <Heart
                size={20}
                color={isLiked ? "$red10" : "$color10"}
                fill={isLiked ? "$red10" : "transparent"}
              />
              <Text
                fontSize="$3"
                fontWeight="600"
                color={isLiked ? "$red10" : "$color10"}
              >
                {likeCount}
              </Text>
            </XStack>
          </Pressable>
        </XStack>
      </XStack>

      {/* Emoji Reactions Picker */}
      <AnimatePresence>
        {showReactions && (
          <View
            animation="quick"
            enterStyle={{ opacity: 0, y: -10 }}
            exitStyle={{ opacity: 0, y: -10 }}
            opacity={1}
            y={0}
          >
            <ScrollView
              ref={scrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              <XStack gap="$2" py="$2">
                {REACTION_EMOJIS.map((emoji, key) => (
                  <Pressable key={key} onPress={() => handleReact(emoji.key)}>
                    <XStack
                      px="$3"
                      py="$2"
                      rounded="$10"
                      bg="$color2"
                      borderWidth={1}
                      borderColor="$borderColor"
                      pressStyle={{ scale: 1.1}}
                      animation="bouncy"
                    >
                      <Text fontSize="$6">{emoji.emoji}</Text>
                    </XStack>
                  </Pressable>
                ))}
              </XStack>
            </ScrollView>
          </View>
        )}
      </AnimatePresence>

      {/* Show existing reactions */}
      {post.reactions && Object.keys(post.reactions).length > 0 && (
        <XStack flexWrap="wrap" gap="$2">
          {Object.entries(post.reactions)
            .sort(([, a], [, b]) => b - a) // Sort by count descending
            .slice(0, 5) // Show top 5 reactions
            .map(([emoji, count]) => (
              <XStack
                key={emoji}
                items="center"
                gap="$1"
                px="$2"
                py="$1"
                rounded="$8"
                bg={emoji === userReaction ? "$accent" : "$color2"}
                borderWidth={emoji === userReaction ? 1 : 0}
                borderColor="$accentForeground"
                animation="quick"
                enterStyle={{ scale: 0 }}
                scale={1}
              >
                <Text fontSize="$3">{emoji}</Text>
                <Text fontSize="$2" color={emoji === userReaction ? "$accentForeground" : "$color10"} fontWeight="600">
                  {count}
                </Text>
              </XStack>
            ))
          }
        </XStack>
      )}
    </YStack>
  );
};