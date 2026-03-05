import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useLocation } from '@/hooks/useLocation';
import { useNotifications } from '@/hooks/useNotifications';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'Fraunces-Regular': require('../assets/fonts/Fraunces-Regular.ttf'),
    'Fraunces-SemiBold': require('../assets/fonts/Fraunces-SemiBold.ttf'),
    'DMMono-Regular': require('../assets/fonts/DMMono-Regular.ttf'),
  });

  const { location } = useLocation();
  useNotifications(location);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="#1A0E06" />
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
