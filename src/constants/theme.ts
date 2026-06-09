export const COLORS = {
  // Fond sombre riche (pas le même gris partout)
  background: '#080C14',
  surface: '#111827',
  surfaceLight: '#1F2937',
  surfaceGlass: 'rgba(255,255,255,0.05)',

  // Accent vert (progrès, espoir)
  primary: '#10B981',
  primaryLight: '#34D399',
  primaryDark: '#059669',
  primaryBg: 'rgba(16, 185, 129, 0.12)',
  primaryGlow: 'rgba(16, 185, 129, 0.25)',

  // SOS rouge (urgence)
  danger: '#EF4444',
  dangerLight: '#FCA5A5',
  dangerBg: 'rgba(239, 68, 68, 0.15)',

  // Orange (attention)
  warning: '#F59E0B',
  warningLight: '#FCD34D',
  warningBg: 'rgba(245, 158, 11, 0.12)',

  // Bleu (aide, information)
  info: '#3B82F6',
  infoLight: '#60A5FA',
  infoBg: 'rgba(59, 130, 246, 0.12)',

  // Violet (premium)
  purple: '#8B5CF6',
  purpleBg: 'rgba(139, 92, 246, 0.12)',

  // Texte
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Bordures
  border: '#1E293B',
  borderLight: 'rgba(255,255,255,0.06)',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.75)',

  // Fond de carte avec accent subtil
  cardGreen: 'rgba(16, 185, 129, 0.06)',
  cardBlue: 'rgba(59, 130, 246, 0.06)',
  cardPurple: 'rgba(139, 92, 246, 0.06)',
  cardRed: 'rgba(239, 68, 68, 0.06)',
  cardAmber: 'rgba(245, 158, 11, 0.06)',
} as const;

// Gradients pour LinearGradient
export const GRADIENTS = {
  // Fond écran principal (subtil)
  screenBg: ['#080C14', '#0B1120', '#080C14'] as const,
  // Hero card
  heroCard: ['rgba(16,185,129,0.12)', 'rgba(16,185,129,0.04)', 'rgba(59,130,246,0.06)'] as const,
  // SOS button
  sos: ['#EF4444', '#DC2626', '#B91C1C'] as const,
  sosSoft: ['rgba(239,68,68,0.15)', 'rgba(239,68,68,0.05)'] as const,
  // Accent cards
  green: ['rgba(16,185,129,0.15)', 'rgba(16,185,129,0.03)'] as const,
  blue: ['rgba(59,130,246,0.15)', 'rgba(59,130,246,0.03)'] as const,
  purple: ['rgba(139,92,246,0.15)', 'rgba(139,92,246,0.03)'] as const,
  amber: ['rgba(245,158,11,0.15)', 'rgba(245,158,11,0.03)'] as const,
  // Paywall
  premium: ['#8B5CF6', '#6D28D9'] as const,
  elite: ['#F59E0B', '#D97706'] as const,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 40,
} as const;

export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 22,
  xxl: 28,
  hero: 56,
  giant: 72,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

// Shadows modernes
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  }),
} as const;
