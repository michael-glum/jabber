import { Text, XStack } from 'tamagui'

interface HeaderProps {
  title: string
  leftComponent?: React.ReactNode
  rightComponent?: React.ReactNode
}

export default function Header({ title, leftComponent, rightComponent }: HeaderProps) {
  return (
    <XStack
      height="$6"
      px="$4"
      items="center"
      justify="space-between"
      borderBottomWidth={1}
      borderColor="$borderColor"
      bg="$background"
    >
      {/* Left section */}
      <XStack width="$6" items="center">
        {leftComponent}
      </XStack>
      
      {/* Center title */}
      <Text fontSize="$6" fontWeight="bold" color="$color">
        {title}
      </Text>
      
      {/* Right section */}
      <XStack width="$6" items="center" justify="flex-end">
        {rightComponent}
      </XStack>
    </XStack>
  )
}