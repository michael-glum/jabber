// shared/components/post/PostCard.tsx
import React, { useState, useRef } from 'react';
import { ScrollView, Pressable } from 'react-native';
import { YStack, XStack, Text, AnimatePresence, View } from 'tamagui';
import { MessageCircle, Trophy, Plus } from '@tamagui/lucide-icons';
import { Post } from '~/shared/models/types';

interface PostCardProps {
  post: Post;
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
  { emoji: '🚀', key: 'rocket' },
  { emoji: '🥴', key: 'woozy' },
  { emoji: '📈', key: 'chart' },
  { emoji: '🫡', key: 'salute' },
  { emoji: '🗿', key: 'moai' },
  { emoji: '🤌', key: 'chefskiss' },
  { emoji: '🫠', key: 'melting' },
  { emoji: '😈', key: 'devil' },
  { emoji: '🌈', key: 'rainbow' },
  { emoji: '🧠', key: 'brain' },
  { emoji: '👁️', key: 'eye' },
];

// Calculate jabber score based on engagement
const calculateJabberScore = (post: Post) => {
  const reactionCount = Object.values(post.reactions || {}).reduce((a, b) => a + b, 0);
  // Base score of 10 + reactions + double weight for comments
  return 10 + reactionCount + (post.commentCount * 2);
};

export default function PostCard({ post, onReact, onComment }: PostCardProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [userReaction, setUserReaction] = useState(post.userReaction);
  const scrollRef = useRef<ScrollView>(null);
  const jabberScore = calculateJabberScore(post);

  const handleReact = (emoji: string) => {
    // Users can only react once - if they tap their current reaction, remove it
    if (emoji === userReaction) {
      setUserReaction(undefined);
    } else {
      setUserReaction(emoji);
    }
    onReact?.(emoji);
    setShowReactionPicker(false);
  };

  // Get sorted reactions for display
  const sortedReactions = Object.entries(post.reactions || {})
    .sort(([, a], [, b]) => b - a)
    .map(([emoji, count]) => ({ emoji, count }));

  return (
    <YStack
      bg="$backgroundStrong"
      rounded="$4"
      mx="$3"
      my="$2"
      p="$4"
      gap="$3"
      shadowColor="$shadowColor"
      shadowOpacity={0.05}
      shadowRadius={4}
      shadowOffset={{ width: 0, height: 2 }}
      pressStyle={{ opacity: 0.98, scale: 0.995 }}
      animation="quick"
    >
      {/* Header with username and jabber score */}
      <XStack items="center" justify="space-between">
        <Text
          fontSize="$4"
          fontWeight="600"
          color="$color10"
          textTransform="lowercase"
        >
          @{post.username}
        </Text>
        
        {/* Jabber Score */}
        <XStack items="center" gap="$1.5">
          <Trophy size={16} color="$yellow10" />
          <Text fontSize="$3" fontWeight="600" color="$yellow10">
            {jabberScore}
          </Text>
        </XStack>
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

      {/* Bottom section with comments and reactions */}
      <XStack items="center" justify="space-between" gap="$3">
        {/* Comment count */}
        <Pressable onPress={onComment}>
          <XStack items="center" gap="$2" opacity={0.7} pressStyle={{ opacity: 0.5 }}>
            <MessageCircle size={20} color="$color10"/>
            <Text fontSize="$3" color="$color10">
              {post.commentCount}
            </Text>
          </XStack>
        </Pressable>

        {/* Reactions section */}
        <XStack flex={1} items="center" justify="flex-end" gap="$2">
          {/* Scrollable reactions */}
          {sortedReactions.length > 0 && (
            <ScrollView
              ref={scrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flex: 1 }}
              contentContainerStyle={{ 
                paddingRight: 8,
                alignItems: 'center',
                gap: 8
              }}
            >
              <XStack gap="$2">
                {sortedReactions.map(({ emoji, count }) => (
                  <Pressable key={emoji} onPress={() => handleReact(emoji)}>
                    <XStack
                      items="center"
                      gap="$1"
                      px="$2.5"
                      py="$1.5"
                      rounded="$10"
                      bg={emoji === userReaction ? "$accent" : "$backgroundStrong"}
                      borderWidth={1}
                      borderColor={emoji === userReaction ? "$accentForeground" : "$borderColor"}
                      pressStyle={{ scale: 0.95 }}
                      animation="quick"
                    >
                      <Text fontSize="$3">{emoji}</Text>
                      <Text 
                        fontSize="$2" 
                        color={emoji === userReaction ? "$accentForeground" : "$color10"} 
                        fontWeight="600"
                      >
                        {count}
                      </Text>
                    </XStack>
                  </Pressable>
                ))}
              </XStack>
            </ScrollView>
          )}

          {/* Plus button */}
          <Pressable onPress={() => setShowReactionPicker(!showReactionPicker)}>
            <XStack
              items="center"
              justify="center"
              width={36}
              height={36}
              rounded="$10"
              bg={showReactionPicker ? "$color2" : "$backgroundStrong"}
              borderWidth={1}
              borderColor="$borderColor"
              pressStyle={{ scale: 0.9 }}
              animation="quick"
            >
              <Plus size={18} color="$color10" />
            </XStack>
          </Pressable>
        </XStack>
      </XStack>

      {/* Reaction Picker Popover */}
      <AnimatePresence>
        {showReactionPicker && (
          <>
            {/* Overlay to close popover on outside tap */}
            <Pressable 
              onPress={() => setShowReactionPicker(false)}
              style={{
                position: 'absolute',
                top: -1000,
                bottom: -1000,
                left: -1000,
                right: -1000,
                zIndex: 999
              }}
            />
            
            <View
              animation="quick"
              enterStyle={{ opacity: 0, scale: 0.9, y: 10 }}
              exitStyle={{ opacity: 0, scale: 0.9, y: 10 }}
              opacity={1}
              scale={1}
              y={0}
              position="absolute"
              b={60}
              r={16}
              z={1000}
            >
              <YStack
                bg="$backgroundStrong"
                rounded="$4"
                p="$3"
                shadowColor="$shadowColor"
                shadowOpacity={0.15}
                shadowRadius={8}
                shadowOffset={{ width: 0, height: 4 }}
                borderWidth={1}
                borderColor="$borderColor"
                gap="$2"
                width={240}
              >
                <Text fontSize="$3" fontWeight="600" color="$color10" mb="$2">
                  React with:
                </Text>
                <XStack flexWrap="wrap" gap="$2">
                  {REACTION_EMOJIS.map(({ emoji, key }) => (
                    <Pressable key={key} onPress={() => handleReact(emoji)}>
                      <XStack
                        px="$3"
                        py="$2"
                        rounded="$10"
                        bg={emoji === userReaction ? "$accent" : "$color2"}
                        borderWidth={1}
                        borderColor={emoji === userReaction ? "$accentForeground" : "$borderColor"}
                        pressStyle={{ scale: 1.1 }}
                        animation="bouncy"
                      >
                        <Text fontSize="$5">{emoji}</Text>
                      </XStack>
                    </Pressable>
                  ))}
                </XStack>
              </YStack>
            </View>
          </>
        )}
      </AnimatePresence>
    </YStack>
  );
}