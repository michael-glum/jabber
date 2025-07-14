// shared/components/post/ReactionPickerModal.tsx
import React, { useCallback } from 'react';
import { Modal, Pressable, Dimensions } from 'react-native';
import { YStack, XStack, Text, View } from 'tamagui';
import { X, Sparkles } from '@tamagui/lucide-icons';

interface ReactionPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectReaction: (emoji: string) => void;
  currentReaction?: string;
}

// All emojis in a single grid - added more for another row
const ALL_EMOJIS = [
  '🔥', '💀', '😭', '🤯', '👀', '✨', '💯', '🗿',
  '😈', '🥴', '🤡', '👻', '🫠', '🤌', '🫡', '😎',
  '🚀', '🎉', '🌈', '🧠', '👁️', '⚡', '🪐', '🎯',
  '😤', '🥺', '😳', '🙄', '😮‍💨', '🤨', '😏', '🥰',
  '💖', '🙃', '🤷', '💅', '🍑', '🫶', '👑', '🎭',
];

const { width: screenWidth } = Dimensions.get('window');

// Individual reaction item component
const ReactionItem = React.memo(({ 
  emoji, 
  isSelected, 
  onPress,
}: { 
  emoji: string; 
  isSelected: boolean; 
  onPress: () => void;
}) => {
  return (
    <YStack
      onPress={onPress}
      bg={isSelected ? "$accent" : "$color1"}
      borderWidth={1}
      borderColor={isSelected ? "$accentForeground" : "$borderColor"}
      p="$2"
      rounded="$3"
      items="center"
      justify="center"
      pressStyle={{ scale: 1.1 }}
    >
      <Text fontSize="$5">{emoji}</Text>
      {isSelected && (
        <View
          position="absolute"
          t={-4}
          r={-4}
          bg="$accent"
          width={14}
          height={14}
          rounded="$10"
          items="center"
          justify="center"
        >
          <Text fontSize="$1" color="white" fontWeight="bold">✓</Text>
        </View>
      )}
    </YStack>
  );
});

export const ReactionPickerModal = React.memo(({ 
  visible, 
  onClose, 
  onSelectReaction,
  currentReaction 
}: ReactionPickerModalProps) => {
  const [selectedEmoji, setSelectedEmoji] = React.useState<string | undefined>(currentReaction);
  const [isClosing, setIsClosing] = React.useState(false);

  // Update selected emoji when currentReaction changes
  React.useEffect(() => {
    setSelectedEmoji(currentReaction);
  }, [currentReaction]);

  // Reset closing state when modal becomes visible
  React.useEffect(() => {
    if (visible) {
      setIsClosing(false);
    }
  }, [visible]);

  const handleSelectReaction = useCallback((emoji: string) => {
    setSelectedEmoji(emoji);
    onSelectReaction(emoji);
    // Start closing animation
    setIsClosing(true);
    // Close modal after a slight delay to show the selection
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onSelectReaction, onClose]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  }, [onClose]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable 
        style={{ flex: 1 }}
        onPress={handleClose}
      >
        <YStack
          flex={1}
          items="center"
          justify="center"
          pointerEvents="box-none"
          animation="bouncy"
        >
        <YStack
          onPress={(e) => e.stopPropagation()}
          bg="white"
          rounded="$6"
          p="$3"
          width={screenWidth * 0.85}
          maxW={320}
          shadowColor="$shadowColor"
          shadowOpacity={0.3}
          shadowRadius={10}
          shadowOffset={{ width: 0, height: 5 }}
          borderWidth={1}
          borderColor="$borderColor"
          animation="bouncy"
          enterStyle={{ scale: 0.8, opacity: 0 }}
          exitStyle={{ scale: 0.8, opacity: 0 }}
          scale={isClosing ? 0.8 : 1}
          opacity={isClosing ? 0 : 1}
        >
          {/* Header */}
          <XStack items="center" justify="space-between" mb="$3">
            <XStack items="center" gap="$2">
              <View
                bg="$accent"
                p="$1.5"
                rounded="$3"
              >
                <Sparkles size={16} color="white" fill="white" />
              </View>
              <Text fontSize="$5" fontWeight="bold">
                Choose Reaction
              </Text>
            </XStack>
            
            <YStack
              onPress={handleClose}
              bg="$color2"
              p="$1.5"
              rounded="$10"
              pressStyle={{ scale: 0.9 }}
            >
              <X size={18} color="$color10" />
            </YStack>
          </XStack>

          {/* Emoji Grid */}
          <XStack flexWrap="wrap" gap="$2" justify="center">
            {ALL_EMOJIS.map(emoji => (
              <ReactionItem
                key={emoji}
                emoji={emoji}
                isSelected={emoji === selectedEmoji}
                onPress={() => handleSelectReaction(emoji)}
              />
            ))}
          </XStack>
                  </YStack>
        </YStack>
      </Pressable>
    </Modal>
  );
});

ReactionPickerModal.displayName = 'ReactionPickerModal';