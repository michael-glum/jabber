// shared/components/jabberscore/jabberscore.tsx
import React, { useEffect, useState } from 'react'
import { Text, XStack, YStack, AnimatePresence } from 'tamagui'
import { Trophy, Flame, TrendingUp, Zap } from '@tamagui/lucide-icons'
import { useCurrentUser } from '../../hooks/useCurrentUser'

const ScoreAnimation = React.memo(({ 
  score, 
  previousScore 
}: { 
  score: number; 
  previousScore: number;
}) => {
  const [displayScore, setDisplayScore] = useState(previousScore);
  const [showDiff, setShowDiff] = useState(false);
  const diff = score - previousScore;

  useEffect(() => {
    if (diff !== 0) {
      setShowDiff(true);
      // Animate score change
      const duration = 1000;
      const steps = 20;
      const increment = diff / steps;
      let current = previousScore;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current += increment;
        if (step >= steps) {
          setDisplayScore(score);
          clearInterval(timer);
          setTimeout(() => setShowDiff(false), 2000);
        } else {
          setDisplayScore(Math.round(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [score, previousScore, diff]);

  return (
    <>
      <Text 
        fontSize="$4" 
        color="$yellow10" 
        fontWeight="bold"
        animation="quick"
      >
        {displayScore.toLocaleString()}
      </Text>
      
      <AnimatePresence>
        {showDiff && diff > 0 && (
          <Text
            position="absolute"
            t={-20}
            r={0}
            fontSize="$2"
            color="$green10"
            fontWeight="bold"
            animation="quick"
            enterStyle={{ opacity: 0, y: 10 }}
            exitStyle={{ opacity: 0, y: -10 }}
          >
            +{diff}
          </Text>
        )}
      </AnimatePresence>
    </>
  );
});

export default function JabberScore() {
  const { data: user, isLoading } = useCurrentUser()
  const [previousScore, setPreviousScore] = useState(0);
  
  useEffect(() => {
    if (user?.jabberScore && user.jabberScore !== previousScore) {
      setPreviousScore(user.jabberScore);
    }
  }, [user?.jabberScore]);

  if (isLoading) {
    return (
      <XStack 
        items="center" 
        gap="$2" 
        bg="$color2" 
        px="$3" 
        py="$2" 
        rounded="$10"
        animation="quick"
        opacity={0.5}
      >
        <Trophy size={16} color="$yellow10" />
        <Text fontSize="$3" color="$color10">...</Text>
      </XStack>
    )
  }

  const level = user?.level || 1;
  const streak = user?.streak || 0;

  return (
    <YStack gap="$1" items="flex-end">
      {/* Main Score Display */}
      <XStack 
        items="center" 
        gap="$2" 
        bg="$color2" 
        px="$3" 
        py="$2" 
        rounded="$10"
        pressStyle={{ scale: 0.95 }}
        animation="bouncy"
      >
        <Trophy size={18} color="$yellow10" fill="$yellow10" />
        <ScoreAnimation 
          score={user?.jabberScore ?? 0} 
          previousScore={previousScore}
        />
      </XStack>

      {/* Level & Streak Row */}
      <XStack gap="$2">
        {/* Level Badge */}
        <XStack 
          items="center" 
          gap="$1" 
          bg="$accent" 
          px="$2" 
          py="$1" 
          rounded="$10"
        >
          <Zap size={12} color="white" fill="white" />
          <Text fontSize="$1" color="white" fontWeight="bold">
            LV{level}
          </Text>
        </XStack>

        {/* Streak Badge */}
        {streak > 0 && (
          <XStack 
            items="center" 
            gap="$1" 
            bg="$yellow10" 
            px="$2" 
            py="$1" 
            rounded="$10"
            animation="quick"
            enterStyle={{ scale: 0 }}
          >
            <Flame size={12} color="white" fill="white" />
            <Text fontSize="$1" color="white" fontWeight="bold">
              {streak}
            </Text>
          </XStack>
        )}
      </XStack>
    </YStack>
  )
}