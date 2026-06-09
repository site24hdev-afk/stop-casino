// Système de badges / récompenses — motivation par paliers

export type BadgeCategory = 'time' | 'money' | 'cravings';

export interface BadgeDefinition {
  id: string;
  emoji: string;
  title: string;
  description: string;
  category: BadgeCategory;
  /** Seuil pour débloquer le badge */
  threshold: number;
  /** Couleur d'accent */
  color: string;
  colorBg: string;
}

// ═══ BADGES TEMPS (jours sans casino) ═══
export const TIME_BADGES: BadgeDefinition[] = [
  {
    id: 'time_1',
    emoji: '🌱',
    title: 'Premier pas',
    description: '1 jour sans casino',
    category: 'time',
    threshold: 1,
    color: '#10B981',
    colorBg: 'rgba(16,185,129,0.08)',
  },
  {
    id: 'time_3',
    emoji: '🌿',
    title: 'Persévérance',
    description: '3 jours sans casino',
    category: 'time',
    threshold: 3,
    color: '#10B981',
    colorBg: 'rgba(16,185,129,0.08)',
  },
  {
    id: 'time_7',
    emoji: '🌳',
    title: 'Force intérieure',
    description: '1 semaine sans casino',
    category: 'time',
    threshold: 7,
    color: '#059669',
    colorBg: 'rgba(5,150,105,0.08)',
  },
  {
    id: 'time_14',
    emoji: '🏔️',
    title: 'Montagne gravie',
    description: '2 semaines sans casino',
    category: 'time',
    threshold: 14,
    color: '#3B82F6',
    colorBg: 'rgba(59,130,246,0.08)',
  },
  {
    id: 'time_30',
    emoji: '⭐',
    title: 'Étoile montante',
    description: '1 mois sans casino',
    category: 'time',
    threshold: 30,
    color: '#F59E0B',
    colorBg: 'rgba(245,158,11,0.08)',
  },
  {
    id: 'time_90',
    emoji: '💎',
    title: 'Diamant',
    description: '3 mois sans casino',
    category: 'time',
    threshold: 90,
    color: '#8B5CF6',
    colorBg: 'rgba(139,92,246,0.08)',
  },
  {
    id: 'time_180',
    emoji: '👑',
    title: 'Royauté',
    description: '6 mois sans casino',
    category: 'time',
    threshold: 180,
    color: '#F59E0B',
    colorBg: 'rgba(245,158,11,0.08)',
  },
  {
    id: 'time_365',
    emoji: '🏆',
    title: 'Légende',
    description: '1 an sans casino',
    category: 'time',
    threshold: 365,
    color: '#EF4444',
    colorBg: 'rgba(239,68,68,0.08)',
  },
];

// ═══ BADGES ARGENT (€ économisés) ═══
export const MONEY_BADGES: BadgeDefinition[] = [
  {
    id: 'money_100',
    emoji: '💰',
    title: 'Première épargne',
    description: '100 € économisés',
    category: 'money',
    threshold: 100,
    color: '#10B981',
    colorBg: 'rgba(16,185,129,0.08)',
  },
  {
    id: 'money_500',
    emoji: '💵',
    title: 'Épargnant',
    description: '500 € économisés',
    category: 'money',
    threshold: 500,
    color: '#059669',
    colorBg: 'rgba(5,150,105,0.08)',
  },
  {
    id: 'money_1000',
    emoji: '🏦',
    title: 'Millionnaire en devenir',
    description: '1 000 € économisés',
    category: 'money',
    threshold: 1000,
    color: '#3B82F6',
    colorBg: 'rgba(59,130,246,0.08)',
  },
  {
    id: 'money_5000',
    emoji: '🤑',
    title: 'Coffre-fort',
    description: '5 000 € économisés',
    category: 'money',
    threshold: 5000,
    color: '#F59E0B',
    colorBg: 'rgba(245,158,11,0.08)',
  },
];

// ═══ BADGES ENVIES SURMONTÉES ═══
export const CRAVINGS_BADGES: BadgeDefinition[] = [
  {
    id: 'cravings_1',
    emoji: '💪',
    title: 'Première victoire',
    description: '1 envie surmontée',
    category: 'cravings',
    threshold: 1,
    color: '#10B981',
    colorBg: 'rgba(16,185,129,0.08)',
  },
  {
    id: 'cravings_5',
    emoji: '🔥',
    title: 'En feu',
    description: '5 envies surmontées',
    category: 'cravings',
    threshold: 5,
    color: '#EF4444',
    colorBg: 'rgba(239,68,68,0.08)',
  },
  {
    id: 'cravings_10',
    emoji: '⚡',
    title: 'Éclair de force',
    description: '10 envies surmontées',
    category: 'cravings',
    threshold: 10,
    color: '#F59E0B',
    colorBg: 'rgba(245,158,11,0.08)',
  },
  {
    id: 'cravings_25',
    emoji: '🛡️',
    title: 'Bouclier d\'acier',
    description: '25 envies surmontées',
    category: 'cravings',
    threshold: 25,
    color: '#3B82F6',
    colorBg: 'rgba(59,130,246,0.08)',
  },
  {
    id: 'cravings_50',
    emoji: '🏅',
    title: 'Champion',
    description: '50 envies surmontées',
    category: 'cravings',
    threshold: 50,
    color: '#8B5CF6',
    colorBg: 'rgba(139,92,246,0.08)',
  },
];

// Tous les badges combinés
export const ALL_BADGES: BadgeDefinition[] = [
  ...TIME_BADGES,
  ...MONEY_BADGES,
  ...CRAVINGS_BADGES,
];
