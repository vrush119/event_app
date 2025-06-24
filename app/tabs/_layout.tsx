import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerShown: false, // Use the global header from app/_layout.tsx
        tabBarStyle: {
          backgroundColor: '#25292e',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/images/event-custom.png')}
              style={{
                width: 24,
                height: 24,
                opacity: focused ? 1 : 0.6,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}