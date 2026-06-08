import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from '../src/constants/theme';
import { loadSavedLanguage } from '../src/i18n';
import { useNotifications } from '../src/hooks/useNotifications';

export default function RootLayout() {
  // Charger la langue sauvegardée au démarrage
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  // Configurer les notifications de rappel
  useNotifications();

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: 'slide_from_right',
        }}
      />
    </SafeAreaProvider>
  );
}
