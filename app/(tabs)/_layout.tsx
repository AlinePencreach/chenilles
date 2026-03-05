import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '@/constants/colors';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: focused ? 22 : 18, opacity: focused ? 1 : 0.6 }}>
      {emoji}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.bark },
        headerTitleStyle: {
          fontFamily: 'Fraunces-SemiBold',
          color: colors.cream,
          fontSize: 18,
        },
        headerTintColor: colors.cream,
        tabBarStyle: {
          backgroundColor: colors.bark,
          borderTopColor: colors.moss,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.lichen,
        tabBarInactiveTintColor: colors.cream + '80',
        tabBarLabelStyle: {
          fontFamily: 'DMMono-Regular',
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Carte',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🗺" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="signaler"
        options={{
          title: 'Signaler',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚠️" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="proximite"
        options={{
          title: 'À proximité',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="actus"
        options={{
          title: 'Actus',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📰" focused={focused} />,
          tabBarBadge: undefined,
        }}
      />
      <Tabs.Screen
        name="moderation"
        options={{
          title: 'Mairie',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏛️" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
