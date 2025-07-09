// shared/components/post/PostCard.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { YStack, XStack, Text, AnimatePresence, View, Button } from 'tamagui';
import { MessageCircle, ChevronUp, ChevronDown, Sparkles, Zap, TrendingUp, Plus } from '@tamagui/lucide-icons';
import { Post } from '~/shared/models/types';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';

interface PostCardProps {
  post: Post;
  onReact?: (emoji: string) => void;
  onComment?: () => void;
  onVote?: (type: 'up' | 'down') => void;
  onShowReactionPicker?: (postId: string) => void;
}

// Memoized sub-components
const VoteButton = React.memo(({ 
  type, 
  isActive, 
  onPress 
}: { 
  type: 'up' | 'down'; 
  isActive: boolean; 
  onPress: () => void;
}) => {
  const Icon = type === 'up' ? ChevronUp : ChevronDown;
  const activeColor = type === 'up' ? '$green10' : '$red10';
  
  return (
    <Button
      size="$2"
      bg="transparent"
      onPress={onPress}
      pressStyle={{ scale: 0.95 }}
      animation="bouncy"
      px="$1"
    >
      <Icon 
        size={24} 
        color={isActive ? activeColor : "$color10"} 
        strokeWidth={2.5}
      />
    </Button>
  );
});

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
  <Pressable onPress={onPress}>
    <XStack
      bg={isUserReaction ? "$accent" : "$backgroundStrong"}
      borderWidth={2}
      borderColor={isUserReaction ? "$accentForeground" : "$borderColor"}
      rounded="$10"
      px="$2"
      py="$1"
      items="center"
      gap="$1"
      pressStyle={{ scale: 0.95 }}
    >
      <Text fontSize="$3">{emoji}</Text>
      <Text 
        fontSize="$2" 
        fontWeight="bold"
        color={isUserReaction ? "white" : "$color10"}
      >
        {count > 999 ? `${(count / 1000).toFixed(1)}k` : count}
      </Text>
    </XStack>
  </Pressable>
));

const CommentButton = React.memo(({ 
  count, 
  onPress 
}: { 
  count: number; 
  onPress?: () => void;
}) => (
  <Button
    size="$3"
    bg="transparent"
    onPress={onPress}
    pressStyle={{ opacity: 0.7 }}
    px="$2"
  >
    <XStack items="center" gap="$2">
      <MessageCircle size={20} color="$color10" />
      <Text fontSize="$3" fontWeight="600" color="$color10">
        {count > 999 ? `${(count / 1000).toFixed(1)}k` : count}
      </Text>
    </XStack>
  </Button>
));

const AddReactionButton = React.memo(({ 
  onPress 
}: { 
  onPress: () => void;
}) => (
  <Button
    size="$1.5"
    bg="$backgroundStrong"
    borderWidth={1}
    borderColor="$color10"
          onPress={onPress}
      pressStyle={{ scale: 0.95 }}
      circular
      px="$2"
  >
    <Plus size={18} color="$color10" />
  </Button>
));

// Jabber score calculation with boost multiplier
const calculateJabberScore = (post: Post) => {
  const reactionCount = Object.values(post.reactions || {}).reduce((a, b) => a + b, 0);
  const baseScore = post.likes + (reactionCount * 2) + (post.commentCount * 3);
  const boostMultiplier = 1 + (post.boostLevel * 0.5);
  return Math.floor(baseScore * boostMultiplier);
};

// Badge for trending posts
const TrendingBadge = React.memo(({ trendingRank }: { trendingRank?: number }) => {
  if (!trendingRank) return null;
  
  return (
    <XStack 
      position="absolute" 
      t={-10} 
      r={10}
      bg="$yellow10"
      px="$2"
      py="$1"
      rounded="$10"
      items="center"
      gap="$1"
      shadowColor="$shadowColor"
      shadowOpacity={0.3}
      shadowRadius={4}
      shadowOffset={{ width: 0, height: 2 }}
    >
      <TrendingUp size={14} color="white" fill="white" />
      <Text fontSize="$2" fontWeight="bold" color="white">
        #{trendingRank} Trending
      </Text>
    </XStack>
  );
});

export const PostCard = React.memo(({ 
  post, 
  onReact, 
  onComment, 
  onVote,
  onShowReactionPicker 
}: PostCardProps) => {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [userReaction, setUserReaction] = useState(post.userReaction);
  
  // Memoize calculated values
  const jabberScore = useMemo(() => calculateJabberScore(post), [post]);
  const voteCount = useMemo(() => {
    let count = post.likes;
    if (userVote === 'up') count += 1;
    if (userVote === 'down') count -= 1;
    return count;
  }, [post.likes, userVote]);
  
  const sortedReactions = useMemo(() => 
    Object.entries(post.reactions || {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([emoji, count]) => ({ emoji, count })),
    [post.reactions]
  );

  const isBoosted = post.boostLevel && post.boostLevel > 0;
  const isTrending = post.trendingRank && post.trendingRank <= 10;

  // Stable callbacks
  const handleVote = useCallback((type: 'up' | 'down') => {
    setUserVote(current => current === type ? null : type);
    onVote?.(type);
  }, [onVote]);

  const handleReactionPress = useCallback((emoji: string) => {
    setUserReaction(current => emoji === current ? undefined : emoji);
    onReact?.(emoji);
  }, [onReact]);

  const handleAddReaction = useCallback(() => {
    onShowReactionPicker?.(post.id);
  }, [onShowReactionPicker, post.id]);

  return (
    <YStack
      bg="$backgroundStrong"
      rounded="$6"
      mx="$2"
      my="$2"
      overflow="hidden"
      borderWidth={isBoosted ? 3 : 2}
      borderColor={isBoosted ? "$yellow5" : "$borderColor"}
      shadowColor={isBoosted ? "$yellow10" : "$shadowColor"}
      shadowOpacity={isBoosted ? 0.3 : 0.1}
      shadowRadius={isBoosted ? 12 : 4}
      shadowOffset={{ width: 0, height: 4 }}
      animation="quick"
      pressStyle={{ scale: 0.99 }}
    >
      {/* Gradient background for boosted posts */}
      {isBoosted && (
        <View 
          position="absolute" 
          t={0} 
          l={0} 
          r={0} 
          height={4}
          opacity={0.8}
        >
          <LinearGradient
            colors={['#FCD34D', '#F59E0B', '#DC2626']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </View>
      )}

      {/* Trending badge */}
      {isTrending && <TrendingBadge trendingRank={post.trendingRank} />}

      {/* Content */}
      <YStack p="$4" gap="$3">
        {/* Header */}
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
            {isBoosted && (
              <XStack 
                items="center" 
                gap="$1" 
                bg="$yellow2" 
                px="$2" 
                py="$0.5" 
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
          <XStack 
            items="center" 
            gap="$1.5"
            bg="$accent"
            px="$2.5"
            py="$1"
            rounded="$10"
          >
            <Text fontSize="$3" fontWeight="bold" color="white">
              {jabberScore}
            </Text>
            <Text fontSize="$2" color="white">
              pts
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

        {/* Action buttons */}
        <XStack items="center" justify="space-between" mt="$2">
          {/* Left side: Comment and React buttons */}
          <XStack items="center" gap="$2">
            <CommentButton count={post.commentCount} onPress={onComment} />
            <AddReactionButton onPress={handleAddReaction} />
          </XStack>

          {/* Right side: Vote buttons and count */}
          <XStack items="center" gap="$1">
            <VoteButton
              type="up"
              isActive={userVote === 'up'}
              onPress={() => handleVote('up')}
            />
            <Text 
              fontSize="$3" 
              fontWeight="bold" 
              color="$color10"
            >
              {voteCount > 999 ? `${(voteCount / 1000).toFixed(1)}k` : voteCount}
            </Text>
            <VoteButton
              type="down"
              isActive={userVote === 'down'}
              onPress={() => handleVote('down')}
            />
          </XStack>
        </XStack>

        {/* Reactions */}
        {sortedReactions.length > 0 && (
          <XStack flexWrap="wrap" gap="$2" mt="$1">
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
      </YStack>
    </YStack>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.reactions === nextProps.post.reactions &&
    prevProps.post.commentCount === nextProps.post.commentCount &&
    prevProps.post.likes === nextProps.post.likes &&
    prevProps.post.userReaction === nextProps.post.userReaction &&
    prevProps.post.boostLevel === nextProps.post.boostLevel &&
    prevProps.post.trendingRank === nextProps.post.trendingRank
  );
});

PostCard.displayName = 'PostCard';