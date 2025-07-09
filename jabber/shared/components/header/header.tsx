// shared/components/header/header.tsx
import { Text, XStack, View } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

interface HeaderProps {
  title: string
  leftComponent?: React.ReactNode
  rightComponent?: React.ReactNode
}

export default function Header({ title, leftComponent, rightComponent }: HeaderProps) {
  return (
    <XStack
      height={60}
      px="$4"
      items="center"
      justify="space-between"
      borderBottomWidth={2}
      borderColor="$borderColor"
      bg="$backgroundStrong"
    >
      {/* Left section */}
      <View width={80} items="flex-start">
        {leftComponent}
      </View>
      
      {/* Center title with gradient text effect */}
      <View flex={1} items="center">
        <Text 
          fontSize="$7" 
          fontWeight="800" 
          color="$accent"
          textTransform="lowercase"
          letterSpacing={-1}
        >
          {title}
        </Text>
      </View>
      
      {/* Right section */}
      <View width={80} items="flex-end">
        {rightComponent}
      </View>
    </XStack>
  )
}