export const COLORS = {
  // Fond clair (Apple Health style)
  background: '#F2F4F7',
  surface: '#EAECF0',
  surfaceLight: '#E5E7EB',
  surfaceGlass: '#FFFFFF',

  // Accent vert (progrès, espoir)
  primary: '#10B981',
  primaryLight: '#059669',
  primaryDark: '#047857',
  primaryBg: 'rgba(16, 185, 129, 0.08)',
  primaryGlow: 'rgba(16, 185, 129, 0.15)',

  // SOS rouge (urgence)
  danger: '#EF4444',
  dangerLight: '#DC2626',
  dangerBg: 'rgba(239, 68, 68, 0.08)',

  // Orange (attention)
  warning: '#F59E0B',
  warningLight: '#D97706',
  warningBg: 'rgba(245, 158, 11, 0.08)',

  // Bleu (aide, information)
  info: '#3B82F6',
  infoLight: '#2563EB',
  infoBg: 'rgba(59, 130, 246, 0.08)',

  // Violet (premium)
  purple: '#8B5CF6',
  purpleBg: 'rgba(139, 92, 246, 0.08)',

  // Cyan
  cyan: '#06B6D4',
  cyanBg: 'rgba(6, 182, 212, 0.08)',

  // Texte — foncé sur fond clair
  text: '#1A1D26',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  // Bordures
  border: '#D1D5DB',
  borderLight: '#E5E7EB',
  borderGlass: '#E5E7EB',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.4)',

  // Fond de carte avec accent subtil
  cardGreen: 'rgba(16, 185, 129, 0.06)',
  cardBlue: 'rgba(59, 130, 246, 0.06)',
  cardPurple: 'rgba(139, 92, 246, 0.06)',
  cardRed: 'rgba(239, 68, 68, 0.06)',
  cardAmber: 'rgba(245, 158, 11, 0.06)',
} as const;

// Gradients pour LinearGradient
export const GRADIENTS = {
  // Fond écran (subtil, clair)
  screenBg: ['#F2F4F7', '#EEF0F4', '#F2F4F7'] as const,
  // Hero card
  heroCard: ['rgba(16,185,129,0.08)', 'rgba(16,185,129,0.03)', 'rgba(59,130,246,0.05)'] as const,
  // SOS button
  sos: ['#EF4444', '#DC2626', '#B91C1C'] as const,
  sosSoft: ['rgba(239,68,68,0.08)', 'rgba(239,68,68,0.02)'] as const,
  // Accent cards
  green: ['rgba(16,185,129,0.08)', 'rgba(16,185,129,0.02)'] as const,
  blue: ['rgba(59,130,246,0.08)', 'rgba(59,130,246,0.02)'] as const,
  purple: ['rgba(139,92,246,0.08)', 'rgba(139,92,246,0.02)'] as const,
  amber: ['rgba(245,158,11,0.08)', 'rgba(245,158,11,0.02)'] as const,
  // Menu icons — gardent couleurs vibrantes
  menuGreen: ['#10B981', '#059669'] as const,
  menuBlue: ['#3B82F6', '#2563EB'] as const,
  menuPurple: ['#8B5CF6', '#7C3AED'] as const,
  menuAmber: ['#F59E0B', '#D97706'] as const,
  menuRed: ['#EF4444', '#DC2626'] as const,
  menuCyan: ['#06B6D4', '#0891B2'] as const,
  // Paywall
  premium: ['#8B5CF6', '#6D28D9'] as const,
  elite: ['#F59E0B', '#D97706'] as const,
  // Screens spécifiques (teintes subtiles)
  screenSOS: ['#FEF2F2', '#FFF5F5', '#F2F4F7'] as const,
  screenStats: ['#EFF6FF', '#F0F9FF', '#F2F4F7'] as const,
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

// Shadows pour fond clair
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  }),
} as const;
