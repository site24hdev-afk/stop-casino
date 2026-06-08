import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUBSCRIPTION_KEY = '@stop_casino_subscription';

export type PlanType = 'free' | 'monthly' | 'yearly';

export interface SubscriptionData {
  plan: PlanType;
  startDate: string | null;
  expiryDate: string | null;
  isActive: boolean;
}

const DEFAULT_SUB: SubscriptionData = {
  plan: 'free',
  startDate: null,
  expiryDate: null,
  isActive: false,
};

// Prix
export const PRICES = {
  monthly: { amount: 4.99, label: '4,99 €/mois', period: 'mois' },
  yearly: { amount: 29.99, label: '29,99 €/an', period: 'an', savings: '50%' },
};

// Fonctionnalités premium
export const PREMIUM_FEATURES = [
  { icon: 'library-outline', title: 'Bibliothèque complète', desc: '10+ articles et exercices' },
  { icon: 'stats-chart-outline', title: 'Statistiques avancées', desc: 'Graphiques et analyses détaillées' },
  { icon: 'book-outline', title: 'Journal illimité', desc: 'Historique complet de tes envies' },
  { icon: 'game-controller-outline', title: 'Jeux simulés', desc: 'Blackjack & Roulette sans argent' },
  { icon: 'heart-outline', title: 'Citations quotidiennes', desc: 'Nouvelles motivations chaque jour' },
  { icon: 'shield-checkmark-outline', title: 'Sans publicité', desc: 'Expérience 100% clean' },
];

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionData>(DEFAULT_SUB);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
      if (data) {
        const parsed: SubscriptionData = JSON.parse(data);
        // Vérifier si l'abonnement est encore actif
        if (parsed.expiryDate) {
          const expiry = new Date(parsed.expiryDate);
          parsed.isActive = expiry > new Date();
        }
        setSubscription(parsed);
      }
    } catch (e) {
      console.error('Error loading subscription:', e);
    }
    setLoading(false);
  };

  const subscribe = async (plan: 'monthly' | 'yearly') => {
    // En production : intégrer RevenueCat / StoreKit
    // Pour l'instant : simulation locale
    const now = new Date();
    const expiry = new Date(now);
    if (plan === 'monthly') {
      expiry.setMonth(expiry.getMonth() + 1);
    } else {
      expiry.setFullYear(expiry.getFullYear() + 1);
    }

    const newSub: SubscriptionData = {
      plan,
      startDate: now.toISOString(),
      expiryDate: expiry.toISOString(),
      isActive: true,
    };

    await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(newSub));
    setSubscription(newSub);
    return true;
  };

  const restorePurchase = async () => {
    // En production : vérifier via RevenueCat
    await loadSubscription();
  };

  const cancelSubscription = async () => {
    await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(DEFAULT_SUB));
    setSubscription(DEFAULT_SUB);
  };

  const isPremium = subscription.isActive && subscription.plan !== 'free';

  const daysRemaining = () => {
    if (!subscription.expiryDate) return 0;
    const diff = new Date(subscription.expiryDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return {
    subscription,
    loading,
    isPremium,
    subscribe,
    restorePurchase,
    cancelSubscription,
    daysRemaining,
  };
}
