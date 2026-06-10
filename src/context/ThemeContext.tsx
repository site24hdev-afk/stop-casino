import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@stop_casino_theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  loaded: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  isDark: false,
  toggleTheme: () => {},
  loaded: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_KEY);
        if (stored === 'dark') setMode('dark');
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  const toggleTheme = useCallback(async () => {
    const next: ThemeMode = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    await AsyncStorage.setItem(THEME_KEY, next);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, isDark: mode === 'dark', toggleTheme, loaded }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Hook pratique : retourne la bonne palette de couleurs
export function useColors() {
  const { isDark } = useContext(ThemeContext);
  return isDark ? DARK_COLORS : LIGHT_COLORS;
}

// Re-export des couleurs light (même objet que COLORS de theme.ts)
const LIGHT_COLORS = {
  background: '#F2F4F7',
  surface: '#EAECF0',
  surfaceLight: '#E5E7EB',
  surfaceGlass: '#FFFFFF',
  primary: '#10B981',
  primaryLight: '#059669',
  primaryDark: '#047857',
  primaryBg: 'rgba(16, 185, 129, 0.08)',
  primaryGlow: 'rgba(16, 185, 129, 0.15)',
  danger: '#EF4444',
  dangerLight: '#DC2626',
  dangerBg: 'rgba(239, 68, 68, 0.08)',
  warning: '#F59E0B',
  warningLight: '#D97706',
  warningBg: 'rgba(245, 158, 11, 0.08)',
  info: '#3B82F6',
  infoLight: '#2563EB',
  infoBg: 'rgba(59, 130, 246, 0.08)',
  purple: '#8B5CF6',
  purpleBg: 'rgba(139, 92, 246, 0.08)',
  cyan: '#06B6D4',
  cyanBg: 'rgba(6, 182, 212, 0.08)',
  text: '#1A1D26',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#D1D5DB',
  borderLight: '#E5E7EB',
  borderGlass: '#E5E7EB',
  overlay: 'rgba(0, 0, 0, 0.4)',
  cardGreen: 'rgba(16, 185, 129, 0.06)',
  cardBlue: 'rgba(59, 130, 246, 0.06)',
  cardPurple: 'rgba(139, 92, 246, 0.06)',
  cardRed: 'rgba(239, 68, 68, 0.06)',
  cardAmber: 'rgba(245, 158, 11, 0.06)',
} as const;

// Dark color palette
export const DARK_COLORS = {
  background: '#0F1119',
  surface: '#1A1D2E',
  surfaceLight: '#252A3A',
  surfaceGlass: '#1E2233',

  primary: '#10B981',
  primaryLight: '#34D399',
  primaryDark: '#059669',
  primaryBg: 'rgba(16, 185, 129, 0.12)',
  primaryGlow: 'rgba(16, 185, 129, 0.20)',

  danger: '#EF4444',
  dangerLight: '#F87171',
  dangerBg: 'rgba(239, 68, 68, 0.12)',

  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningBg: 'rgba(245, 158, 11, 0.12)',

  info: '#3B82F6',
  infoLight: '#60A5FA',
  infoBg: 'rgba(59, 130, 246, 0.12)',

  purple: '#8B5CF6',
  purpleBg: 'rgba(139, 92, 246, 0.12)',

  cyan: '#06B6D4',
  cyanBg: 'rgba(6, 182, 212, 0.12)',

  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  border: '#334155',
  borderLight: '#1E293B',
  borderGlass: '#1E293B',

  overlay: 'rgba(0, 0, 0, 0.6)',

  cardGreen: 'rgba(16, 185, 129, 0.10)',
  cardBlue: 'rgba(59, 130, 246, 0.10)',
  cardPurple: 'rgba(139, 92, 246, 0.10)',
  cardRed: 'rgba(239, 68, 68, 0.10)',
  cardAmber: 'rgba(245, 158, 11, 0.10)',
} as const;
