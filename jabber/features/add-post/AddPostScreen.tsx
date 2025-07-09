// features/add-post/AddPostScreen.tsx
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { TextInput, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { YStack, XStack, Text, View, AnimatePresence, Button } from 'tamagui'
import { Sparkles, Zap, Send, X, Plus, Minus } from '@tamagui/lucide-icons'
import { Screen } from '~/shared/components/ui/Screen'
import Header from '~/shared/components/header/header'
import { useLocalPostStore } from '~/shared/store/postStore'
import { useCurrentUser } from '~/shared/hooks/useCurrentUser'
import { Post } from '~/shared/models/types'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const MAX_CHARS = 140
const MAX_BOOSTS = 10

const PLACEHOLDER_TEXTS = [
  "spill your chaotic thoughts...",
  "what's unhinged today?",
  "drop a hot take...",
  "share your brain rot...",
  "unleash the chaos...",
  "what's the vibe?",
  "speak your truth bestie...",
  "go off queen/king...",
  "let it out...",
  "what's brewing in that brain?",
]

const BOOST_MESSAGES = [
  "no boost? bold move",
  "one boost = subtle chaos",
  "double boost = now we're talking",
  "triple threat activated 🔥",
  "quad damage incoming!!!",
  "MAXIMUM CHAOS 🚀",
  "UNSTOPPABLE FORCE 💥",
  "LEGENDARY STATUS 🌟",
  "MYTHIC LEVEL POWER ⚡",
  "GOD MODE ACTIVATED 👑",
  "welp, this better be good",
]

const BoostCounter = React.memo(({ 
  boostLevel, 
  onIncrement, 
  onDecrement 
}: { 
  boostLevel: number; 
  onIncrement: () => void;
  onDecrement: () => void;
}) => {
  const getBoostEmoji = () => {
    if (boostLevel === 0) return '😴'
    if (boostLevel <= 2) return '⚡'
    if (boostLevel <= 4) return '🔥'
    if (boostLevel <= 6) return '🚀'
    if (boostLevel <= 8) return '💥'
    return '🌟'
  }

  return (
    <XStack 
      bg="$backgroundStrong"
      borderWidth={2}
      borderColor="$borderColor"
      rounded="$4"
      p="$4"
      items="center"
      justify="space-between"
      gap="$3"
    >
      <XStack items="center" gap="$3" flex={1}>
        <Text fontSize="$8">{getBoostEmoji()}</Text>
        <YStack flex={1}>
          <Text fontSize="$6" fontWeight="bold" color="$color">
            {boostLevel}x boost
          </Text>
          <Text fontSize="$3" color="$color10">
            {BOOST_MESSAGES[Math.min(boostLevel, BOOST_MESSAGES.length - 1)]}
          </Text>
        </YStack>
      </XStack>
      
      <XStack items="center" gap="$1">
        <Button
          size="$2.5"
          circular
          bg={boostLevel > 0 ? "$color2" : "$color1"}
          borderColor="$borderColor"
          borderWidth={1}
          opacity={boostLevel > 0 ? 1 : 0.5}
          disabled={boostLevel <= 0}
          onPress={onDecrement}
          pressStyle={{ scale: 0.95 }}
          animation="quick"
        >
          <Minus size={15} color="$color" />
        </Button>
        
        <View width={26} items="center">
          <Text fontSize="$6" fontWeight="bold" color="$accent">
            {boostLevel}
          </Text>
        </View>
        
        <Button
          size="$2.5"
          circular
          bg={boostLevel < MAX_BOOSTS ? "$accent" : "$color1"}
          borderColor="$borderColor"
          borderWidth={1}
          opacity={boostLevel < MAX_BOOSTS ? 1 : 0.5}
          disabled={boostLevel >= MAX_BOOSTS}
          onPress={onIncrement}
          pressStyle={{ scale: 0.95 }}
          animation="quick"
        >
          <Plus size={15} color={boostLevel < MAX_BOOSTS ? "white" : "$color"} />
        </Button>
      </XStack>
    </XStack>
  )
})

export default function AddPostScreen() {
  const router = useRouter()
  const { data: currentUser } = useCurrentUser()
  const setLocalNewPost = useLocalPostStore((state) => state.setLocalNewPost)
  
  const [postText, setPostText] = useState('')
  const [boostLevel, setBoostLevel] = useState(0)
  const [isPosting, setIsPosting] = useState(false)
  const textInputRef = useRef<TextInput>(null)

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

  const charactersLeft = MAX_CHARS - postText.length
  const characterPercentage = (postText.length / MAX_CHARS) * 100

  const getCharacterColor = () => {
    if (charactersLeft < 0) return '$red10'
    if (charactersLeft < 20) return '$yellow10'
    return '$color10'
  }

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
      boostLevel, // Add boost level to post
    }
    
    // Add to local store
    setLocalNewPost(newPost)
    
    // Simulate posting delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Navigate to for-you feed
    router.replace('/(tabs)/for-you')
    
    // Reset form
    setPostText('')
    setBoostLevel(0)
    setIsPosting(false)
  }, [canPost, postText, boostLevel, currentUser, setLocalNewPost, router])

  const handleTextChange = useCallback((text: string) => {
    setPostText(text)
  }, [])

  const handleBoostIncrement = useCallback(() => {
    if (boostLevel < MAX_BOOSTS) {
      setBoostLevel(boostLevel + 1)
    }
  }, [boostLevel])

  const handleBoostDecrement = useCallback(() => {
    if (boostLevel > 0) {
      setBoostLevel(boostLevel - 1)
    }
  }, [boostLevel])

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
        >
          <YStack flex={1} gap="$4" px="$4" py="$4">
            {/* Text Input Area */}
            <YStack 
              flex={1} 
              bg="$backgroundStrong" 
              rounded="$4" 
              p="$4"
              borderWidth={2}
              borderColor="$borderColor"
              gap="$3"
            >
              <TextInput
                ref={textInputRef}
                value={postText}
                onChangeText={handleTextChange}
                placeholder={placeholder}
                placeholderTextColor="#71717A"
                multiline
                style={{
                  fontSize: 20,
                  lineHeight: 28,
                  color: '$color',
                  minHeight: 120,
                  textAlignVertical: 'top',
                  fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
                }}
                maxLength={MAX_CHARS + 20} // Allow over-typing to show error
              />
            </YStack>

            {/* Character Count - Moved outside text input */}
            <XStack items="center" justify="space-between">
              <View 
                height={4} 
                flex={1} 
                bg="$color2" 
                rounded="$10" 
                overflow="hidden"
                mr="$3"
              >
                <View 
                  height="100%" 
                  width={`${Math.min(characterPercentage, 100)}%`}
                  bg={charactersLeft < 0 ? '$red10' : charactersLeft < 20 ? '$yellow10' : '$accent'}
                  animation="quick"
                />
              </View>
              <Text 
                fontSize="$3" 
                fontWeight="bold" 
                color={getCharacterColor()}
              >
                {charactersLeft}
              </Text>
            </XStack>

            {/* Boost Counter */}
            <YStack gap="$3">
              <XStack items="center" gap="$2">
                <Zap size={20} color="$yellow10" fill="$yellow10" />
                <Text fontSize="$5" fontWeight="bold">
                  boost your post
                </Text>
              </XStack>
              
              <BoostCounter
                boostLevel={boostLevel}
                onIncrement={handleBoostIncrement}
                onDecrement={handleBoostDecrement}
              />
            </YStack>

            {/* Post Button */}
            <Button
              size="$5"
              bg={canPost ? "$accent" : "$color2"}
              color={canPost ? "$accentForeground" : "$color10"}
              rounded="$4"
              py="$3"
              px="$4"
              disabled={!canPost}
              onPress={handlePost}
              pressStyle={{ scale: 0.97 }}
              animation="bouncy"
              opacity={canPost ? 1 : 0.5}
            >
              <XStack items="center" gap="$3">
                <Text 
                  fontSize="$6" 
                  fontWeight="bold" 
                  color={canPost ? "white" : "$color10"}
                  textTransform="lowercase"
                >
                  {isPosting ? 'posting...' : 'send it'}
                </Text>
                <Send 
                  size={24} 
                  color={canPost ? "white" : "$color10"}
                />
              </XStack>
            </Button>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}