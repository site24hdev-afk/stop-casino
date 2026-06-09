import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

const SUBSCRIPTION_KEY = '@stop_casino_subscription';

// 4 paliers + gratuit
export type TierType = 'free' | 'essentiel' | 'pro' | 'premium' | 'elite';

export interface SubscriptionData {
  tier: TierType;
  billingCycle: 'monthly' | 'yearly' | 'lifetime' | null;
  startDate: string | null;
  expiryDate: string | null;
  isActive: boolean;
}

const DEFAULT_SUB: SubscriptionData = {
  tier: 'free',
  billingCycle: null,
  startDate: null,
  expiryDate: null,
  isActive: false,
};

// Grille de prix
export const PLANS = {
  essentiel: {
    name: 'Essentiel',
    monthly: { amount: 4.99, label: '4,99 €/mois' },
    yearly: { amount: 39.99, label: '39,99 €/an', perMonth: '3,33 €/mois', savings: '44%' },
    color: '#3B82F6',
    icon: 'star-outline' as const,
    tagline: 'Le premier pas',
  },
  pro: {
    name: 'Pro',
    monthly: { amount: 9.99, label: '9,99 €/mois' },
    yearly: { amount: 79.99, label: '79,99 €/an', perMonth: '6,67 €/mois', savings: '44%' },
    color: '#10B981',
    icon: 'diamond-outline' as const,
    tagline: 'Le plus populaire',
    recommended: true,
  },
  premium: {
    name: 'Premium',
    monthly: { amount: 14.99, label: '14,99 €/mois' },
    yearly: { amount: 109.99, label: '109,99 €/an', perMonth: '9,17 €/mois', savings: '39%' },
    color: '#8B5CF6',
    icon: 'shield-checkmark-outline' as const,
    tagline: 'L\'engagement total',
  },
  elite: {
    name: 'Elite',
    lifetime: { amount: 149.99, label: '149,99 € une fois' },
    color: '#F59E0B',
    icon: 'trophy-outline' as const,
    tagline: 'Pour toujours',
  },
};

// Ce que chaque palier débloque
export const TIER_FEATURES = {
  free: {
    label: 'Gratuit',
    features: [
      { text: 'Compteur de jours', included: true },
      { text: 'SOS : 1 étape sur 4', included: true },
      { text: 'Aide : numéro urgence', included: true },
      { text: '1 citation fixe', included: true },
      { text: 'Journal', included: false },
      { text: 'Bibliothèque', included: false },
      { text: 'Statistiques', included: false },
      { text: 'Jeux simulés', included: false },
    ],
  },
  essentiel: {
    label: 'Essentiel',
    features: [
      { text: 'Tout le gratuit +', included: true },
      { text: 'SOS complet (4 étapes)', included: true },
      { text: 'Aide complète + contact', included: true },
      { text: 'Journal (5 entrées/mois)', included: true },
      { text: '3 articles bibliothèque', included: true },
      { text: 'Stats basiques', included: true },
      { text: 'Citations quotidiennes', included: true },
      { text: 'Sans publicité', included: true },
      { text: 'Jeux simulés', included: false },
      { text: 'Stats avancées', included: false },
    ],
  },
  pro: {
    label: 'Pro',
    features: [
      { text: 'Tout Essentiel +', included: true },
      { text: 'Journal illimité', included: true },
      { text: 'Bibliothèque complète', included: true },
      { text: 'Stats avancées + graphiques', included: true },
      { text: 'Jeux simulés (Blackjack, Roulette)', included: true },
      { text: 'Analyse des déclencheurs', included: true },
    ],
  },
  premium: {
    label: 'Premium',
    features: [
      { text: 'Tout Pro +', included: true },
      { text: 'Rappels personnalisés', included: true },
      { text: 'Export données (PDF)', included: true },
      { text: 'Widget iOS', included: true },
      { text: 'Thèmes personnalisés', included: true },
      { text: 'Support prioritaire', included: true },
    ],
  },
  elite: {
    label: 'Elite',
    features: [
      { text: 'Tout Premium, pour toujours', included: true },
      { text: 'Paiement unique', included: true },
      { text: 'Accès prioritaire nouveautés', included: true },
      { text: 'Badge Elite exclusif', included: true },
    ],
  },
};

// Limites par palier
export const TIER_LIMITS = {
  free: {
    sosSteps: 1,            // 1 seule étape SOS
    journalEntries: 0,      // pas de journal
    libraryArticles: 0,     // pas de biblio
    hasStats: false,
    hasAdvancedStats: false,
    hasGames: false,
    hasCitations: false,     // 1 citation fixe seulement
    hasAds: true,
    hasFullAide: false,
    hasCustomReminders: false,
    hasExport: false,
    hasWidget: false,
    hasThemes: false,
    hasPrioritySupport: false,
  },
  essentiel: {
    sosSteps: 4,
    journalEntries: 5,      // 5 par mois
    libraryArticles: 3,
    hasStats: true,
    hasAdvancedStats: false,
    hasGames: false,
    hasCitations: true,
    hasAds: false,
    hasFullAide: true,
    hasCustomReminders: false,
    hasExport: false,
    hasWidget: false,
    hasThemes: false,
    hasPrioritySupport: false,
  },
  pro: {
    sosSteps: 4,
    journalEntries: -1,     // illimité
    libraryArticles: -1,    // illimité
    hasStats: true,
    hasAdvancedStats: true,
    hasGames: true,
    hasCitations: true,
    hasAds: false,
    hasFullAide: true,
    hasCustomReminders: false,
    hasExport: false,
    hasWidget: false,
    hasThemes: false,
    hasPrioritySupport: false,
  },
  premium: {
    sosSteps: 4,
    journalEntries: -1,
    libraryArticles: -1,
    hasStats: true,
    hasAdvancedStats: true,
    hasGames: true,
    hasCitations: true,
    hasAds: false,
    hasFullAide: true,
    hasCustomReminders: true,
    hasExport: true,
    hasWidget: true,
    hasThemes: true,
    hasPrioritySupport: true,
  },
  elite: {
    sosSteps: 4,
    journalEntries: -1,
    libraryArticles: -1,
    hasStats: true,
    hasAdvancedStats: true,
    hasGames: true,
    hasCitations: true,
    hasAds: false,
    hasFullAide: true,
    hasCustomReminders: true,
    hasExport: true,
    hasWidget: true,
    hasThemes: true,
    hasPrioritySupport: true,
  },
};

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionData>(DEFAULT_SUB);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  // Recharger quand l'écran revient au premier plan
  useFocusEffect(
    useCallback(() => {
      loadSubscription();
    }, [])
  );

  const loadSubscription = async () => {
    try {
      const data = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
      if (data) {
        const parsed: SubscriptionData = JSON.parse(data);
        // Vérifier expiration (sauf lifetime)
        if (parsed.billingCycle === 'lifetime') {
          parsed.isActive = true;
        } else if (parsed.expiryDate) {
          const expiry = new Date(parsed.expiryDate);
          parsed.isActive = expiry > new Date();
        }
        if (!parsed.isActive) {
          parsed.tier = 'free';
        }
        setSubscription(parsed);
      }
    } catch (e) {
      console.error('Error loading subscription:', e);
    }
    setLoading(false);
  };

  const subscribe = async (tier: 'essentiel' | 'pro' | 'premium' | 'elite', cycle?: 'monthly' | 'yearly') => {
    // En production : intégrer RevenueCat / StoreKit
    const now = new Date();
    let expiryDate: string | null = null;
    let billingCycle: 'monthly' | 'yearly' | 'lifetime' = 'lifetime';

    if (tier === 'elite') {
      billingCycle = 'lifetime';
      expiryDate = null; // jamais
    } else if (cycle === 'monthly') {
      billingCycle = 'monthly';
      const expiry = new Date(now);
      expiry.setMonth(expiry.getMonth() + 1);
      expiryDate = expiry.toISOString();
    } else {
      billingCycle = 'yearly';
      const expiry = new Date(now);
      expiry.setFullYear(expiry.getFullYear() + 1);
      expiryDate = expiry.toISOString();
    }

    const newSub: SubscriptionData = {
      tier,
      billingCycle,
      startDate: now.toISOString(),
      expiryDate,
      isActive: true,
    };

    await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(newSub));
    setSubscription(newSub);
    return true;
  };

  const restorePurchase = async () => {
    await loadSubscription();
  };

  const cancelSubscription = async () => {
    await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(DEFAULT_SUB));
    setSubscription(DEFAULT_SUB);
  };

  const tier = subscription.isActive ? subscription.tier : 'free';
  const limits = TIER_LIMITS[tier];

  // Helpers pratiques
  const isPaid = tier !== 'free';
  const isEssentiel = tier === 'essentiel' || tier === 'pro' || tier === 'premium' || tier === 'elite';
  const isPro = tier === 'pro' || tier === 'premium' || tier === 'elite';
  const isPremium = tier === 'premium' || tier === 'elite';
  const isElite = tier === 'elite';

  const canAccess = (feature: 'journal' | 'library' | 'stats' | 'advancedStats' | 'games' | 'fullSos' | 'fullAide' | 'citations') => {
    switch (feature) {
      case 'journal': return limits.journalEntries !== 0;
      case 'library': return limits.libraryArticles !== 0;
      case 'stats': return limits.hasStats;
      case 'advancedStats': return limits.hasAdvancedStats;
      case 'games': return limits.hasGames;
      case 'fullSos': return limits.sosSteps === 4;
      case 'fullAide': return limits.hasFullAide;
      case 'citations': return limits.hasCitations;
      default: return false;
    }
  };

  const daysRemaining = () => {
    if (subscription.billingCycle === 'lifetime') return Infinity;
    if (!subscription.expiryDate) return 0;
    const diff = new Date(subscription.expiryDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return {
    subscription,
    loading,
    tier,
    limits,
    isPaid,
    isEssentiel,
    isPro,
    isPremium,
    isElite,
    canAccess,
    subscribe,
    restorePurchase,
    cancelSubscription,
    daysRemaining,
  };
}
