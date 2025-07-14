// ui/Screen.tsx
import { View } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const Screen = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets()

  return (
    <View
      flex={1}
      pt={insets.top}
      px={4}
      bg="white"
    >
      {children}
    </View>
  )
}
