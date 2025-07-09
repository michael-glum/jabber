// shared/components/post/ReactionPickerModal.tsx
import React, { useCallback, useState, useMemo } from 'react';
import { Modal, Pressable, Dimensions, ScrollView } from 'react-native';
import { YStack, XStack, Text, View, AnimatePresence } from 'tamagui';
import { X, Sparkles, Search } from '@tamagui/lucide-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface ReactionPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectReaction: (emoji: string) => void;
  currentReaction?: string;
}

const REACTION_CATEGORIES = {
  trending: {
    title: '🔥 Trending',
    emojis: ['🔥', '💀', '😭', '🤯', '👀', '✨', '💯', '🗿'],
  },
  vibes: {
    title: '✨ Vibes',
    emojis: ['😈', '🥴', '🤡', '👻', '🫠', '🤌', '🫡', '😎'],
  },
  chaos: {
    title: '🌈 Chaos',
    emojis: ['🚀', '🎉', '🌈', '🧠', '👁️', '⚡', '🪐', '🎯'],
  },
  mood: {
    title: '💭 Mood',
    emojis: ['😤', '🥺', '😳', '🙄', '😮‍💨', '🤨', '😏', '🥰'],
  },
};

const QUICK_REACTIONS = ['🔥', '💀', '😭', '🤯', '✨', '💯'];

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Individual reaction item component
const ReactionItem = React.memo(({ 
  emoji, 
  isSelected, 
  onPress,
  size = 'medium'
}: { 
  emoji: string; 
  isSelected: boolean; 
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
}) => {
  const sizes = {
    small: { emoji: '$6', padding: '$2', rounded: '$4' },
    medium: { emoji: '$8', padding: '$3', rounded: '$5' },
    large: { emoji: '$10', padding: '$4', rounded: '$6' },
  };

  const config = sizes[size];

  return (
    <Pressable onPress={onPress}>
      <YStack
        bg={isSelected ? "$accent" : "$backgroundStrong"}
        borderWidth={2}
        borderColor={isSelected ? "$accentForeground" : "$borderColor"}
        p={config.padding as any}
        rounded={config.rounded as any}
        items="center"
        justify="center"
        animation="bouncy"
        pressStyle={{ scale: 1.1 }}
        enterStyle={{ scale: 0, opacity: 0 }}
        scale={1}
        opacity={1}
      >
        <Text fontSize={config.emoji as any}>{emoji}</Text>
        {isSelected && (
          <View
            position="absolute"
            t={-4}
            r={-4}
            bg="$accent"
            width={16}
            height={16}
            rounded="$10"
            items="center"
            justify="center"
          >
            <Text fontSize="$1" color="white" fontWeight="bold">✓</Text>
          </View>
        )}
      </YStack>
    </Pressable>
  );
});

export const ReactionPickerModal = React.memo(({ 
  visible, 
  onClose, 
  onSelectReaction,
  currentReaction 
}: ReactionPickerModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('trending');

  // Filter emojis based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return REACTION_CATEGORIES;
    
    const filtered: Partial<typeof REACTION_CATEGORIES> = {};
    Object.entries(REACTION_CATEGORIES).forEach(([key, category]) => {
      const filteredEmojis = category.emojis.filter(emoji => 
        emoji.includes(searchQuery)
      );
      if (filteredEmojis.length > 0) {
        filtered[key as keyof typeof REACTION_CATEGORIES] = {
          ...category,
          emojis: filteredEmojis,
        };
      }
    });
    return filtered;
  }, [searchQuery]);

  const handleSelectReaction = useCallback((emoji: string) => {
    onSelectReaction(emoji);
    onClose();
  }, [onSelectReaction, onClose]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable 
        style={{ flex: 1 }} 
        onPress={onClose}
      >
        <BlurView
          intensity={80}
          tint="dark"
          style={{
            position: 'absolute',
            width: screenWidth,
            height: screenHeight,
          }}
        />
        
        <View
          flex={1}
          items="center"
          justify="center"
          pointerEvents="box-none"
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <YStack
              bg="$backgroundStrong"
              rounded="$8"
              p="$4"
              width={screenWidth * 0.9}
              maxW={400}
              maxH={screenHeight * 0.8}
              shadowColor="$shadowColor"
              shadowOpacity={0.5}
              shadowRadius={20}
              shadowOffset={{ width: 0, height: 10 }}
              borderWidth={2}
              borderColor="$borderColor"
              animation="quick"
              enterStyle={{ scale: 0.9, opacity: 0 }}
              scale={1}
              opacity={1}
            >
              {/* Header */}
              <XStack items="center" justify="space-between" mb="$4">
                <XStack items="center" gap="$2">
                  <View
                    bg="$accent"
                    p="$2"
                    rounded="$4"
                  >
                    <Sparkles size={20} color="white" fill="white" />
                  </View>
                  <Text fontSize="$6" fontWeight="bold">
                    Choose Your Vibe
                  </Text>
                </XStack>
                
                <Pressable onPress={onClose}>
                  <View
                    bg="$color2"
                    p="$2"
                    rounded="$10"
                    pressStyle={{ scale: 0.9 }}
                  >
                    <X size={20} color="$color10" />
                  </View>
                </Pressable>
              </XStack>

              {/* Quick Reactions */}
              <YStack gap="$2" mb="$4">
                <Text fontSize="$3" fontWeight="600" color="$color10">
                  Quick Reactions
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8 }}
                >
                  {QUICK_REACTIONS.map(emoji => (
                    <ReactionItem
                      key={emoji}
                      emoji={emoji}
                      isSelected={emoji === currentReaction}
                      onPress={() => handleSelectReaction(emoji)}
                      size="large"
                    />
                  ))}
                </ScrollView>
              </YStack>

              {/* Category Tabs */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 16 }}
              >
                <XStack gap="$2">
                  {Object.entries(REACTION_CATEGORIES).map(([key, category]) => (
                    <Pressable 
                      key={key}
                      onPress={() => setSelectedCategory(key)}
                    >
                      <XStack
                        bg={selectedCategory === key ? "$accent" : "$color2"}
                        px="$3"
                        py="$2"
                        rounded="$10"
                        items="center"
                        gap="$1"
                        animation="quick"
                        pressStyle={{ scale: 0.95 }}
                      >
                        <Text 
                          fontSize="$3" 
                          fontWeight="600"
                          color={selectedCategory === key ? "white" : "$color"}
                        >
                          {category.title}
                        </Text>
                      </XStack>
                    </Pressable>
                  ))}
                </XStack>
              </ScrollView>

              {/* Category Emojis */}
              <ScrollView 
                style={{ flex: 1 }} 
                showsVerticalScrollIndicator={false}
              >
                <YStack gap="$4" pb="$4">
                  {Object.entries(filteredCategories).map(([key, category]) => (
                    selectedCategory === key && (
                      <YStack key={key} gap="$3">
                        <XStack flexWrap="wrap" gap="$3">
                          {category.emojis.map(emoji => (
                            <ReactionItem
                              key={emoji}
                              emoji={emoji}
                              isSelected={emoji === currentReaction}
                              onPress={() => handleSelectReaction(emoji)}
                            />
                          ))}
                        </XStack>
                      </YStack>
                    )
                  ))}
                </YStack>
              </ScrollView>

              {/* Fun gradient border */}
              <View
                position="absolute"
                t={-2}
                l={-2}
                r={-2}
                b={-2}
                rounded="$8"
                overflow="hidden"
                pointerEvents="none"
                z={-1}
              >
                <LinearGradient
                  colors={['#9333EA', '#EC4899', '#FCD34D']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1 }}
                />
              </View>
            </YStack>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
});

ReactionPickerModal.displayName = 'ReactionPickerModal';