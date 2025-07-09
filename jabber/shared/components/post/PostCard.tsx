// shared/components/post/PostCard.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { YStack, XStack, Text, AnimatePresence, View } from 'tamagui';
import { MessageCircle, Trophy, Plus, Zap } from '@tamagui/lucide-icons';
import { Post } from '~/shared/models/types';

interface PostCardProps {
  post: Post;
  onReact?: (emoji: string) => void;
  onComment?: () => void;
}

// TODO: boost level only indicated (and included in memo) for user's own posts

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

// Memoized sub-components
const ReactionButton = React.memo(({ 
  emoji, 
  count, 
  isUserReaction, 
  onPress 
}: { 
  emoji: string; 
  count: number; 
  isUserReaction: boolean; 
  onPress: () => void;
}) => (
  <XStack
    onPress={onPress}
    items="center"
    gap="$1"
    px="$2"
    py="$1.5"
    rounded="$8"
    bg={isUserReaction ? "$yellow2" : "$backgroundStrong"}
    borderWidth={1.5}
    borderColor={isUserReaction ? "$yellow5" : "$borderColor"}
    shadowColor="$shadowColor"
    shadowOpacity={0.05}
    shadowRadius={2}
    shadowOffset={{ width: 0, height: 1 }}
    pressStyle={{ scale: 0.9, opacity: 0.9 }}
    animation="bouncy"
  >
    <Text fontSize="$3" color={isUserReaction ? "$yellow10" : "$color"}>{emoji}</Text>
    <Text 
      fontSize="$1" 
      color={isUserReaction ? "$yellow10" : "$color10"} 
      fontWeight="700"
    >
      {count}
    </Text>
  </XStack>
));

const CommentButton = React.memo(({ 
  count, 
  onPress 
}: { 
  count: number; 
  onPress?: () => void;
}) => (
  <XStack onPress={onPress} items="center" gap="$2" opacity={0.7} pressStyle={{ opacity: 0.5 }}>
    <MessageCircle size={20} color="$color10"/>
    <Text fontSize="$3" color="$color10">
      {count}
    </Text>
  </XStack>
));

const ReactionPicker = React.memo(({ 
  userReaction, 
  onReact, 
  onClose 
}: { 
  userReaction?: string;
  onReact: (emoji: string) => void;
  onClose: () => void;
}) => (
  <>
    <View 
      onPress={onClose}
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
            <XStack
              key={key}
              onPress={() => onReact(emoji)}
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
          ))}
        </XStack>
      </YStack>
    </View>
  </>
));

// Calculate jabber score based on engagement
const calculateJabberScore = (post: Post) => {
  const reactionCount = Object.values(post.reactions || {}).reduce((a, b) => a + b, 0);
  return 10 + reactionCount + (post.commentCount * 2);
};

export const PostCard = React.memo(({ post, onReact, onComment }: PostCardProps) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [userReaction, setUserReaction] = useState(post.userReaction);
  
  // Memoize calculated values
  const jabberScore = useMemo(() => calculateJabberScore(post), [post]);
  const sortedReactions = useMemo(() => 
    Object.entries(post.reactions || {})
      .sort(([, a], [, b]) => b - a)
      .map(([emoji, count]) => ({ emoji, count })),
    [post.reactions]
  );

  // Stable callbacks
  const handleReact = useCallback((emoji: string) => {
    setUserReaction(current => emoji === current ? undefined : emoji);
    onReact?.(emoji);
    setShowReactionPicker(false);
  }, [onReact]);

  const toggleReactionPicker = useCallback(() => {
    setShowReactionPicker(prev => !prev);
  }, []);

  const closeReactionPicker = useCallback(() => {
    setShowReactionPicker(false);
  }, []);

  const handleReactionPress = useCallback((emoji: string) => {
    handleReact(emoji);
  }, [handleReact]);

  return (
    <YStack
      bg="$backgroundStrong"
      rounded="$6"
      mx="$2"
      my="$2"
      p="$4"
      gap="$3"
      borderWidth={post.boostLevel && post.boostLevel > 0 ? 4 : 4}
      borderColor={post.boostLevel && post.boostLevel > 0 ? "$yellow5" : "$blue4"}
      pressStyle={{ opacity: 0.9, scale: 0.9 }}
      animation="quick"
      shadowColor={post.boostLevel && post.boostLevel > 0 ? "$yellow10" : "$shadowColor"}
      shadowOpacity={post.boostLevel && post.boostLevel > 0 ? 0.2 : 0}
      shadowRadius={post.boostLevel && post.boostLevel > 0 ? 8 : 0}
      shadowOffset={{ width: 0, height: 2 }}
    >
      {/* Header with username and jabber score */}
      <XStack items="center" justify="space-between">
        <XStack items="center" gap="$2">
          <Text
            fontSize="$4"
            fontWeight="600"
            color="$color10"
            textTransform="lowercase"
          >
            @{post.username}
          </Text>
          {/* Boost indicator */}
          {post.boostLevel !== undefined && post.boostLevel > 0 && (
            <XStack 
              items="center" 
              gap="$1" 
              bg="$yellow2" 
              px="$2" 
              py="$1" 
              rounded="$10"
            >
              <Zap size={14} color="$yellow10" fill="$yellow10" />
              <Text fontSize="$2" fontWeight="bold" color="$yellow10">
                {post.boostLevel}x
              </Text>
            </XStack>
          )}
        </XStack>
        
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

      {/* Bottom section with comments and plus button */}
      <XStack items="center" justify="space-between" gap="$3">
        {/* Comment count */}
        <CommentButton count={post.commentCount} onPress={onComment} />

        {/* Plus button */}
        <XStack
          onPress={toggleReactionPicker}
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
      </XStack>

      {/* Reactions section - wrapped row */}
      {sortedReactions.length > 0 && (
        <XStack flexWrap="wrap" gap="$2">
          {sortedReactions.map(({ emoji, count }) => (
            <ReactionButton 
              key={emoji}
              emoji={emoji}
              count={count}
              isUserReaction={emoji === userReaction}
              onPress={() => handleReactionPress(emoji)}
            />
          ))}
        </XStack>
      )}

      {/* Reaction Picker Popover */}
      <AnimatePresence>
        {showReactionPicker && (
          <ReactionPicker 
            userReaction={userReaction}
            onReact={handleReact}
            onClose={closeReactionPicker}
          />
        )}
      </AnimatePresence>
    </YStack>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.reactions === nextProps.post.reactions &&
    prevProps.post.commentCount === nextProps.post.commentCount &&
    prevProps.post.userReaction === nextProps.post.userReaction &&
    prevProps.post.boostLevel === nextProps.post.boostLevel
  );
});

PostCard.displayName = 'PostCard';