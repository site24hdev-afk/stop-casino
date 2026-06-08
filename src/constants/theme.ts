export const COLORS = {
  // Fond sombre apaisant
  background: '#0F172A',
  surface: '#1E293B',
  surfaceLight: '#334155',

  // Accent vert (progrès, espoir)
  primary: '#10B981',
  primaryLight: '#34D399',
  primaryDark: '#059669',
  primaryBg: 'rgba(16, 185, 129, 0.12)',

  // SOS rouge (urgence)
  danger: '#EF4444',
  dangerLight: '#FCA5A5',
  dangerBg: 'rgba(239, 68, 68, 0.15)',

  // Orange (attention)
  warning: '#F59E0B',
  warningBg: 'rgba(245, 158, 11, 0.12)',

  // Bleu (aide, information)
  info: '#3B82F6',
  infoBg: 'rgba(59, 130, 246, 0.12)',

  // Texte
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Bordures
  border: '#334155',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 48,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
