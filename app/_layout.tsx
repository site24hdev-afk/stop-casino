import { useEffect } from 'react';
import { Stack } from 'expo-router';
let StatusBar: any = () => null;
try { StatusBar = require('expo-status-bar').StatusBar; } catch (e) {}
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from '../src/constants/theme';
import { loadSavedLanguage } from '../src/i18n';
import { useNotifications } from '../src/hooks/useNotifications';
import { ThemeProvider, useTheme, DARK_COLORS } from '../src/context/ThemeContext';

function RootLayoutInner() {
  const { isDark } = useTheme();
  const bg = isDark ? DARK_COLORS.background : COLORS.background;

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  useNotifications();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: bg },
          animation: 'ios_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen name="aide" />
        <Stack.Screen name="bibliotheque" />
        <Stack.Screen name="jeux" />
        <Stack.Screen name="communaute" />
        <Stack.Screen name="abonnement" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootLayoutInner />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
