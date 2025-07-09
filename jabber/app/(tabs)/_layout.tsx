import { Link, Tabs } from 'expo-router'
import { Button, useTheme } from 'tamagui'
import { Flame, HeartHandshake, Sparkles, Trophy, User } from '@tamagui/lucide-icons'

export default function TabLayout() {
  const theme = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.yellow10.val,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
        },
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.background.val,
          borderBottomColor: theme.borderColor.val,
        },
        headerTintColor: theme.color.val,
      }}
    >
      <Tabs.Screen
        name="for-you"
        options={{
          title: 'For You',
          tabBarIcon: ({ color }) => <HeartHandshake color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="hot"
        options={{
          title: 'Hot',
          tabBarIcon: ({ color }) => <Flame color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="add-post"
        options={{
          title: 'Add Post',
          tabBarIcon: ({ color, focused }) =>
            <Sparkles 
              color={color as any} 
              fill={focused ? color : 'transparent'}
              size={28}
            />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => <Trophy color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color as any} />,
        }}
      />
      </Tabs>
  )
}
