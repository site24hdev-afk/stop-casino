export const COLORS = {
  // Fond profond
  background: '#06080F',
  surface: '#0E1420',
  surfaceLight: '#1A2233',
  surfaceGlass: 'rgba(255,255,255,0.04)',

  // Accent vert (progrès, espoir)
  primary: '#10B981',
  primaryLight: '#34D399',
  primaryDark: '#059669',
  primaryBg: 'rgba(16, 185, 129, 0.10)',
  primaryGlow: 'rgba(16, 185, 129, 0.25)',

  // SOS rouge (urgence)
  danger: '#EF4444',
  dangerLight: '#FCA5A5',
  dangerBg: 'rgba(239, 68, 68, 0.12)',

  // Orange (attention)
  warning: '#F59E0B',
  warningLight: '#FCD34D',
  warningBg: 'rgba(245, 158, 11, 0.10)',

  // Bleu (aide, information)
  info: '#3B82F6',
  infoLight: '#60A5FA',
  infoBg: 'rgba(59, 130, 246, 0.10)',

  // Violet (premium)
  purple: '#8B5CF6',
  purpleBg: 'rgba(139, 92, 246, 0.10)',

  // Cyan
  cyan: '#06B6D4',
  cyanBg: 'rgba(6, 182, 212, 0.10)',

  // Texte
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Bordures
  border: '#1E293B',
  borderLight: 'rgba(255,255,255,0.06)',
  borderGlass: 'rgba(255,255,255,0.08)',

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
  // Fond écran (subtil)
  screenBg: ['#06080F', '#0A0F1A', '#06080F'] as const,
  // Hero card
  heroCard: ['rgba(16,185,129,0.14)', 'rgba(16,185,129,0.04)', 'rgba(59,130,246,0.08)'] as const,
  // SOS button
  sos: ['#EF4444', '#DC2626', '#B91C1C'] as const,
  sosSoft: ['rgba(239,68,68,0.15)', 'rgba(239,68,68,0.05)'] as const,
  // Accent cards
  green: ['rgba(16,185,129,0.15)', 'rgba(16,185,129,0.03)'] as const,
  blue: ['rgba(59,130,246,0.15)', 'rgba(59,130,246,0.03)'] as const,
  purple: ['rgba(139,92,246,0.15)', 'rgba(139,92,246,0.03)'] as const,
  amber: ['rgba(245,158,11,0.15)', 'rgba(245,158,11,0.03)'] as const,
  // Menu icons
  menuGreen: ['#10B981', '#059669'] as const,
  menuBlue: ['#3B82F6', '#2563EB'] as const,
  menuPurple: ['#8B5CF6', '#7C3AED'] as const,
  menuAmber: ['#F59E0B', '#D97706'] as const,
  menuRed: ['#EF4444', '#DC2626'] as const,
  menuCyan: ['#06B6D4', '#0891B2'] as const,
  // Paywall
  premium: ['#8B5CF6', '#6D28D9'] as const,
  elite: ['#F59E0B', '#D97706'] as const,
  // Screens
  screenSOS: ['#1A0505', '#0F0808', '#06080F'] as const,
  screenStats: ['#060B14', '#080E1A', '#06080F'] as const,
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
