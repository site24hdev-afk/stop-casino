import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from '../src/constants/theme';
import { loadSavedLanguage } from '../src/i18n';
import { useNotifications } from '../src/hooks/useNotifications';

export default function RootLayout() {
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  useNotifications();

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: 'ios_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen name="aide" />
        <Stack.Screen name="bibliotheque" />
        <Stack.Screen name="jeux" />
        <Stack.Screen name="abonnement" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
