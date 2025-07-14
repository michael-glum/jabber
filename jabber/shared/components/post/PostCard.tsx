// shared/components/post/PostCard.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { YStack, XStack, Text, AnimatePresence, View, Button, useTheme } from 'tamagui';
import { MessageCircle, Sparkles, Zap, TrendingUp, CirclePlus } from '@tamagui/lucide-icons';
import { Post } from '~/shared/models/types';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '~/shared/services/api';
import { useRouter } from 'expo-router';
import { ReactionPickerModal } from './ReactionPickerModal';
import Svg, { Path } from 'react-native-svg';

interface PostCardProps {
  post: Post;
}

// Custom Heart Icon Component
const HeartIcon = React.memo(({ 
  size = 22, 
  color = "$color10", 
  isFilled = false 
}: { 
  size?: number; 
  color?: string; 
  isFilled?: boolean;
}) => {
  const theme = useTheme();
  const colorValue = theme[color.replace('$', '')]?.val || color;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill={isFilled ? colorValue : "none"}
        stroke={colorValue}
        strokeWidth={isFilled ? 2 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

// Memoized sub-components
const LikeButton = React.memo(({ 
  isLiked, 
  onPress,
  likeCount 
}: { 
  isLiked: boolean; 
  onPress: () => void;
  likeCount: number;
}) => {
  return (
    <XStack
      bg={isLiked ? "$red2" : "transparent"}
      onPress={onPress}
      pressStyle={{ scale: 0.95 }}
      px="$2"
      py="$1"
      gap="$2"
      items="center"
      rounded="$10"
      borderWidth={isLiked ? 1 : 0}
      borderColor={isLiked ? "$red5" : "transparent"}
    >
      <HeartIcon 
        size={22} 
        color={isLiked ? "$red10" : "$color10"} 
        isFilled={isLiked}
      />
      <Text 
        fontSize="$3" 
        fontWeight="bold" 
        color={isLiked ? "$red10" : "$color10"}
      >
        {likeCount > 999 ? `${(likeCount / 1000).toFixed(1)}k` : String(likeCount)}
      </Text>
    </XStack>
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
  <XStack
    onPress={onPress}
    bg={isUserReaction ? "$yellow2" : "$backgroundStrong"}
    borderWidth={2}
    borderColor={isUserReaction ? "$yellow5" : "$borderColor"}
    rounded="$10"
    px="$2"
    py="$1"
    items="center"
    gap="$1"
    pressStyle={{ scale: 0.95 }}
  >
    <Text fontSize="$3" color={isUserReaction ? "$yellow10" : "$color"}>{emoji}</Text>
    <Text 
      fontSize="$2" 
      fontWeight="bold"
      color={isUserReaction ? "$yellow10" : "$color10"}
    >
      {count > 999 ? `${(count / 1000).toFixed(1)}k` : String(count)}
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
        {count > 999 ? `${(count / 1000).toFixed(1)}k` : String(count)}
      </Text>
    </XStack>
  </Button>
));

const AddReactionButton = React.memo(({ 
  onPress 
}: { 
  onPress: () => void;
}) => (
  <XStack
    bg="$backgroundStrong"
    onPress={onPress}
    pressStyle={{ scale: 0.95 }}
  >
    <CirclePlus size={22} color="$color10" />
  </XStack>
));

// Jabber score calculation with boost multiplier
const calculateJabberScore = (post: Post, localReactions: Record<string, number>) => {
  const reactionCount = Object.values(localReactions).reduce((a, b) => a + b, 0);
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
      <TrendingUp size={14} color="white" />
      <Text fontSize="$2" fontWeight="bold" color="white">
        #{trendingRank} Trending
      </Text>
    </XStack>
  );
});

export const PostCard = React.memo(({ 
  post
}: PostCardProps) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [userReaction, setUserReaction] = useState(post.userReaction);
  
  // Local reactions state to track changes
  const [localReactions, setLocalReactions] = useState<Record<string, number>>(post.reactions || {});
  
  // Modal state management
  const [reactionPickerVisible, setReactionPickerVisible] = useState(false);
  
  // Memoize calculated values
  const jabberScore = useMemo(() => calculateJabberScore(post, localReactions), [post, localReactions]);
  const likeCount = useMemo(() => {
    let count = post.likes;
    if (isLiked && !post.isLiked) count += 1;
    if (!isLiked && post.isLiked) count -= 1;
    return count;
  }, [post.likes, isLiked, post.isLiked]);
  
  const sortedReactions = useMemo(() => 
    Object.entries(localReactions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([emoji, count]) => ({ emoji, count })),
    [localReactions]
  );

  const isBoosted = Boolean(post.boostLevel && post.boostLevel > 0);
  const isTrending = Boolean(post.trendingRank && post.trendingRank <= 10);

  // Update local reactions when post.reactions changes
  React.useEffect(() => {
    setLocalReactions(post.reactions || {});
  }, [post.reactions]);

  // Stable callbacks
  const handleLike = useCallback(async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    try {
      if (newLikedState) {
        await api.likePost(post.id);
      } else {
        await api.unlikePost(post.id);
      }
    } catch (error) {
      // Revert state on error
      setIsLiked(!newLikedState);
      console.error('Error handling like:', error);
    }
  }, [isLiked, post.id]);

  const handleReactionPress = useCallback(async (emoji: string) => {
    const isTogglingOff = emoji === userReaction;
    const newReaction = isTogglingOff ? undefined : emoji;
    const previousReaction = userReaction;
    
    setUserReaction(newReaction);
    
    // Update local reactions state
    setLocalReactions(prev => {
      const newReactions = { ...prev };
      
      if (isTogglingOff) {
        // User is removing their reaction
        if (newReactions[emoji]) {
          newReactions[emoji] = Math.max(0, newReactions[emoji] - 1);
          if (newReactions[emoji] === 0) {
            delete newReactions[emoji];
          }
        }
      } else {
        // User is adding a new reaction
        // First, remove the previous reaction (decrement count if it exists in original post)
        if (previousReaction) {
          if (newReactions[previousReaction]) {
            newReactions[previousReaction] = Math.max(0, newReactions[previousReaction] - 1);
            if (newReactions[previousReaction] === 0) {
              delete newReactions[previousReaction];
            }
          }
        }
        
        // Add or increment the new reaction
        newReactions[emoji] = (newReactions[emoji] || 0) + 1;
      }
      
      return newReactions;
    });
    
    try {
      if (newReaction) {
        await api.reactToPost(post.id, emoji);
      } else {
        await api.removeReaction(post.id);
      }
    } catch (error) {
      // Revert state on error
      setUserReaction(previousReaction);
      setLocalReactions(post.reactions || {});
      console.error('Error handling reaction:', error);
    }
  }, [userReaction, post.id, post.reactions]);

  const handleComment = useCallback(() => {
    // Navigate to comments screen - using a modal approach for now
    console.log('Navigate to comments for post:', post.id);
    // TODO: Implement proper navigation to comments
  }, [post.id]);

  const handleAddReaction = useCallback(() => {
    setReactionPickerVisible(true);
  }, []);

  const handleSelectReaction = useCallback(async (emoji: string) => {
    await handleReactionPress(emoji);
  }, [handleReactionPress]);

  const handleCloseReactionPicker = useCallback(() => {
    setReactionPickerVisible(false);
  }, []);

  return (
    <>
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
            <XStack items="center" gap="$3">
              {/* Username and Title */}
              <YStack gap="$0.5">
                <Text
                  fontSize="$4"
                  fontWeight="600"
                  color="$color10"
                  textTransform="lowercase"
                >
                  @{post.username}
                </Text>
                {post.userTitle && (
                  <Text
                    fontSize="$2"
                    fontWeight="500"
                    color="$color8"
                    fontStyle="italic"
                  >
                    {post.userTitle}
                  </Text>
                )}
              </YStack>
              
              {isBoosted && (
                <XStack 
                  items="center" 
                  gap="$1" 
                  bg="$yellow2" 
                  px="$2" 
                  py="$0.5" 
                  rounded="$10"
                >
                  <Zap size={14} color="$yellow10" />
                  <Text fontSize="$2" fontWeight="bold" color="$yellow10">
                    {post.boostLevel}x
                  </Text>
                </XStack>
              )}
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
              <CommentButton count={post.commentCount} onPress={handleComment} />
              <AddReactionButton onPress={handleAddReaction} />
            </XStack>
            {/* Right side: Like button and count */}
            <LikeButton
              isLiked={isLiked}
              onPress={handleLike}
              likeCount={likeCount}
            />
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

      {/* Reaction Picker Modal */}
      <ReactionPickerModal
        visible={reactionPickerVisible}
        onClose={handleCloseReactionPicker}
        onSelectReaction={handleSelectReaction}
        currentReaction={userReaction}
      />
    </>
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