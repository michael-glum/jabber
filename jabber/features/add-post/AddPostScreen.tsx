// features/add-post/AddPostScreen.tsx
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { TextInput, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Animated } from 'react-native'
import { YStack, XStack, Text, View, Button, Slider } from 'tamagui'
import { Sparkles, Zap, Send, X, Plus, Minus, Flame, TrendingUp } from '@tamagui/lucide-icons'
import { Screen } from '~/shared/components/ui/Screen'
import Header from '~/shared/components/header/header'
import { useLocalPostStore } from '~/shared/store/postStore'
import { useCurrentUser } from '~/shared/hooks/useCurrentUser'
import { Post } from '~/shared/models/types'
import { useRouter } from 'expo-router'

const MAX_CHARS = 140
const MAX_BOOSTS = 10
const MAX_LINES = 10
const CHARS_PER_LINE = 40 // Approximate characters per line
const MAX_CHARS_WITH_LINES = MAX_LINES * CHARS_PER_LINE

const PLACEHOLDER_TEXTS = [
  "what's the tea? ☕",
  "drop your chaos here...",
  "brain dump incoming...",
  "thoughts? share 'em",
  "type your masterpiece...",
  "let's hear it bestie",
  "go off, i'm listening...",
  "your stage, your mic 🎤",
];

// Animated character counter
const CharacterCounter = React.memo(({ 
  current, 
  max 
}: { 
  current: number; 
  max: number;
}) => {
  const left = max - current;
  const percentage = (current / max) * 100;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (left < 20 && left >= 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [left]);

  const getColor = () => {
    if (left < 0) return '$red10';
    if (left < 20) return '$yellow10';
    return '$accent';
  };

  return (
    <YStack gap="$2">
      <View 
        height={6} 
        bg="$color2" 
        rounded="$10" 
        overflow="hidden"
      >
        <View 
          height="100%" 
          width={`${Math.min(percentage, 100)}%`}
          bg={getColor()}
          animation="quick"
        />
      </View>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Text 
          fontSize="$3" 
          fontWeight="bold" 
          color={getColor()}
          text="center"
        >
          {left}
        </Text>
      </Animated.View>
    </YStack>
  );
});

// Beautiful boost selector
const BoostSelector = React.memo(({ 
  level, 
  onChange,
  onDragStart,
  onDragEnd,
  setIsDragging
}: { 
  level: number; 
  onChange: (level: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  setIsDragging?: (dragging: boolean) => void;
}) => {
  const getBoostColor = (lvl: number) => {
    if (lvl === 0) return '$color10';
    if (lvl <= 3) return '$jabberYellow';
    if (lvl <= 6) return '$jabberOrange';
    if (lvl <= 9) return '$jabberRed';
    return '$accent';
  };

  const getBoostEmoji = (lvl: number) => {
    if (lvl === 0) return '😴';
    if (lvl <= 2) return '⚡';
    if (lvl <= 4) return '🔥';
    if (lvl <= 6) return '🚀';
    if (lvl <= 8) return '💥';
    return '🌟';
  };

  return (
    <YStack gap="$3">
      <XStack items="center" justify="space-between">
        <XStack items="center" gap="$2">
          <Zap size={20} color="$yellow10" fill="$yellow10" />
          <Text fontSize="$5" fontWeight="bold">
            boost power
          </Text>
        </XStack>
        <XStack items="center" gap="$2" bg="$color1" px="$3" py="$1" rounded="$10">
          <Text fontSize="$6">{getBoostEmoji(level)}</Text>
          <Text fontSize="$4" fontWeight="bold" color={getBoostColor(level)}>
            {level}x
          </Text>
        </XStack>
      </XStack>

      {/* Boost level slider */}
      <XStack items="center" gap="$3">
        <Button
          size="$3"
          circular
          bg="$color2"
          disabled={level <= 0}
          onPress={() => onChange(Math.max(0, level - 1))}
          pressStyle={{ scale: 0.9 }}
          animation="quick"
        >
          <Minus size={16} />
        </Button>

        <View flex={1}>
          <Slider
            size="$4"
            defaultValue={[level]}
            max={MAX_BOOSTS}
            min={0}
            step={1}
            value={[level]}
            onValueChange={(values) => {
              onChange(values[0])
              setIsDragging?.(true)
              // Reset dragging state after a short delay
              setTimeout(() => setIsDragging?.(false), 100)
            }}
            orientation="horizontal"
            flex={1}
          >
            <Slider.Track bg="$color2" height={8} borderRadius="$10">
              <Slider.TrackActive bg={getBoostColor(level)} />
            </Slider.Track>
            <Slider.Thumb
              index={0}
              size="$2"
              bg={getBoostColor(level)}
              borderWidth={0}
              rounded="$10"
              shadowColor="$color"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.25}
              shadowRadius={4}
              elevation={4}
            />
          </Slider>
        </View>

        <Button
          size="$3"
          circular
          bg={getBoostColor(level)}
          disabled={level >= MAX_BOOSTS}
          onPress={() => onChange(Math.min(MAX_BOOSTS, level + 1))}
          pressStyle={{ scale: 0.9 }}
          animation="quick"
        >
          <Plus size={16} color="white" />
        </Button>
      </XStack>

      {/* Boost info */}
      <XStack bg="$color1" p="$3" rounded="$4" items="center" gap="$2">
        <TrendingUp size={16} color={getBoostColor(level)} />
        <Text fontSize="$2" color="$color10" flex={1}>
          {level === 0 && "no boost = organic reach"}
          {level > 0 && level <= 3 && "small boost = more eyes on your post"}
          {level > 3 && level <= 6 && "medium boost = trending potential"}
          {level > 6 && "mega boost = maximum chaos"}
        </Text>
      </XStack>
    </YStack>
  );
});

export default function AddPostScreen() {
  const router = useRouter()
  const { data: currentUser } = useCurrentUser()
  const setLocalNewPost = useLocalPostStore((state) => state.setLocalNewPost)
  
  const [postText, setPostText] = useState('')
  const [boostLevel, setBoostLevel] = useState(0)
  const [isPosting, setIsPosting] = useState(false)
  const [isSliderDragging, setIsSliderDragging] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const textInputRef = useRef<TextInput>(null)

  const handleTextChange = useCallback((text: string) => {
    const lines = text.split('\n')
    if (lines.length <= MAX_LINES) {
      setPostText(text)
    }
  }, [])

  const handleDone = useCallback(() => {
    textInputRef.current?.blur()
    Keyboard.dismiss()
  }, [])

  // Random placeholder
  const placeholder = useMemo(
    () => PLACEHOLDER_TEXTS[Math.floor(Math.random() * PLACEHOLDER_TEXTS.length)],
    []
  )

  // Auto-focus on mount
  useEffect(() => {
    setTimeout(() => {
      textInputRef.current?.focus()
    }, 100)
  }, [])

  // Keyboard event listeners
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', () => {
      setIsKeyboardVisible(true)
    })
    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => {
      setIsKeyboardVisible(false)
    })

    return () => {
      keyboardWillShowListener?.remove()
      keyboardWillHideListener?.remove()
    }
  }, [])

  const charactersLeft = MAX_CHARS - postText.length
  const canPost = postText.trim().length > 0 && charactersLeft >= 0 && !isPosting

  const handlePost = useCallback(async () => {
    if (!canPost) return
    
    setIsPosting(true)
    
    // Create the new post
    const newPost: Post = {
      id: `local-${Date.now()}`,
      text: postText.trim(),
      username: currentUser?.username || 'anonymous',
      userId: currentUser?.id || 'current-user',
      likes: 0,
      reactions: {},
      commentCount: 0,
      createdAt: new Date().toISOString(),
      boostLevel,
    }
    
    // Add to local store
    setLocalNewPost(newPost)
    
    // Simulate posting delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Navigate back
    router.replace('/(tabs)/for-you')
    
    // Reset form
    setPostText('')
    setBoostLevel(0)
    setIsPosting(false)
  }, [canPost, postText, boostLevel, currentUser, setLocalNewPost, router])

  return (
    <Screen>
      <Header 
        title="drop a jab" 
        leftComponent={
          <Button
            size="$3"
            circular
            bg="transparent"
            onPress={() => router.back()}
            pressStyle={{ scale: 0.95 }}
          >
            <X size={24} color="$color" />
          </Button>
        }
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!isSliderDragging}
        >
          <YStack flex={1} gap="$4" px="$4" py="$4" bg="$background">
            {/* Text Input Area */}
            <YStack 
              flex={1} 
              bg="$backgroundStrong" 
              rounded="$6" 
              p="$4"
              borderWidth={2}
              borderColor={postText.length > 0 ? "$accent" : "$borderColor"}
              gap="$3"
              animation="quick"
              onPress={() => textInputRef.current?.focus()}
            >
              <TextInput
                ref={textInputRef}
                value={postText}
                onChangeText={handleTextChange}
                placeholder={placeholder}
                placeholderTextColor="#71717A"
                multiline
                numberOfLines={MAX_LINES}
                scrollEnabled={false}
                style={{
                  fontSize: 20,
                  lineHeight: 28,
                  color: '$color',
                  maxHeight: MAX_LINES * 28, // MAX_LINES * line height
                  textAlignVertical: 'top',
                  fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
                  borderBottomWidth: postText.length > 0 ? 1.5 : 0,
                  borderBottomColor: '#E5E5E5',
                  paddingBottom: 8,
                }}
                maxLength={MAX_CHARS + 20} // Allow over-typing
              />
            </YStack>

            {/* Character Counter */}
            <CharacterCounter current={postText.length} max={MAX_CHARS} />

            {/* Conditional UI based on keyboard state */}
            {isKeyboardVisible && (
              /* Done Button */
              <Button
                size="$5"
                bg="$accent"
                rounded="$6"
                onPress={handleDone}
                pressStyle={{ scale: 0.96 }}
                animation="quick"
                enterStyle={{ opacity: 0, scale: 0.9 }}
                exitStyle={{ opacity: 0, scale: 0.9 }}
              >
                <XStack items="center" gap="$3">
                  <Text 
                    fontSize="$6" 
                    fontWeight="bold" 
                    color="white"
                    textTransform="lowercase"
                  >
                    done
                  </Text>
                </XStack>
              </Button>
            )}
            
            {!isKeyboardVisible && (
              <>
                {/* Boost Selector */}
                <View
                  animation="quick"
                  enterStyle={{ opacity: 0, y: 10 }}
                  exitStyle={{ opacity: 0, y: 10 }}
                >
                  <BoostSelector 
                    level={boostLevel} 
                    onChange={setBoostLevel}
                    setIsDragging={setIsSliderDragging}
                  />
                </View>

                {/* Post Button */}
                <View
                  animation="quick"
                  enterStyle={{ opacity: 0, y: 10 }}
                  exitStyle={{ opacity: 0, y: 10 }}
                >
                  <Button
                    size="$5"
                    bg={canPost ? "$accent" : "$color2"}
                    rounded="$6"
                    disabled={!canPost}
                    onPress={handlePost}
                    pressStyle={{ scale: 0.96 }}
                    animation="bouncy"
                    opacity={canPost ? 1 : 0.5}
                  >
                    <XStack items="center" gap="$3">
                      {isPosting ? (
                        <Sparkles size={24} color="white" animation="quick" rotate="360deg" />
                      ) : (
                        <Send size={24} color={canPost ? "white" : "$color10"} />
                      )}
                      <Text 
                        fontSize="$6" 
                        fontWeight="bold" 
                        color={canPost ? "white" : "$color10"}
                        textTransform="lowercase"
                      >
                        {isPosting ? 'sending...' : 'send it'}
                      </Text>
                    </XStack>
                  </Button>
                </View>
              </>
            )}
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}