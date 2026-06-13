import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
let Purchases: any = null;
let LOG_LEVEL: any = {};
try {
  const rc = require('react-native-purchases');
  Purchases = rc.default;
  LOG_LEVEL = rc.LOG_LEVEL;
} catch (e) {
  // Native module not available (simulator/web)
}
type PurchasesOffering = any;
type PurchasesPackage = any;
type CustomerInfo = any;
import {
  REVENUECAT_API_KEY,
  ENTITLEMENT_IDS,
  isRevenueCatConfigured,
} from '../config/revenueCat';

const SUBSCRIPTION_KEY = '@stop_casino_subscription';

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

export const TIER_LIMITS = {
  free: {
    sosSteps: 2,
    journalEntries: 2,
    libraryArticles: 1,
    hasStats: true,
    hasAdvancedStats: false,
    hasGames: false,
    hasCitations: true,
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
    journalEntries: 5,
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
    journalEntries: -1,
    libraryArticles: -1,
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

let rcInitialized = false;

async function initRevenueCat() {
  if (rcInitialized || !isRevenueCatConfigured() || !Purchases) return;
  try {
    if (__DEV__ && Purchases.setLogLevel) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    rcInitialized = true;
  } catch (e) {
    console.warn('RevenueCat init failed:', e);
  }
}

function tierFromCustomerInfo(info: CustomerInfo): TierType {
  if (info.entitlements.active[ENTITLEMENT_IDS.elite]) return 'elite';
  if (info.entitlements.active[ENTITLEMENT_IDS.premium]) return 'premium';
  if (info.entitlements.active[ENTITLEMENT_IDS.pro]) return 'pro';
  if (info.entitlements.active[ENTITLEMENT_IDS.essentiel]) return 'essentiel';
  return 'free';
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionData>(DEFAULT_SUB);
  const [loading, setLoading] = useState(true);
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const useRC = isRevenueCatConfigured();

  useEffect(() => {
    init();
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshStatus();
    }, [])
  );

  const init = async () => {
    if (useRC) {
      await initRevenueCat();
      await refreshStatus();
      await loadOfferings();
    } else {
      await loadFromStorage();
    }
    setLoading(false);
  };

  // --- RevenueCat mode ---

  const refreshStatus = async () => {
    if (!useRC || !rcInitialized) {
      await loadFromStorage();
      return;
    }
    try {
      const info = await Purchases.getCustomerInfo();
      const detectedTier = tierFromCustomerInfo(info);
      const activeSub: SubscriptionData = {
        tier: detectedTier,
        billingCycle: detectedTier === 'elite' ? 'lifetime' : null,
        startDate: info.originalPurchaseDate ?? null,
        expiryDate: info.latestExpirationDate ?? null,
        isActive: detectedTier !== 'free',
      };
      setSubscription(activeSub);
    } catch (e) {
      console.warn('RevenueCat refresh failed:', e);
      await loadFromStorage();
    }
  };

  const loadOfferings = async () => {
    if (!rcInitialized) return;
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        setOffering(offerings.current);
      }
    } catch (e) {
      console.warn('Failed to load offerings:', e);
    }
  };

  const purchasePackage = async (pkg: PurchasesPackage): Promise<boolean> => {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const detectedTier = tierFromCustomerInfo(customerInfo);
      setSubscription({
        tier: detectedTier,
        billingCycle: detectedTier === 'elite' ? 'lifetime' : null,
        startDate: customerInfo.originalPurchaseDate ?? null,
        expiryDate: customerInfo.latestExpirationDate ?? null,
        isActive: detectedTier !== 'free',
      });
      return true;
    } catch (e: any) {
      if (!e.userCancelled) throw e;
      return false;
    }
  };

  const restorePurchaseRC = async (): Promise<boolean> => {
    try {
      const info = await Purchases.restorePurchases();
      const detectedTier = tierFromCustomerInfo(info);
      setSubscription({
        tier: detectedTier,
        billingCycle: detectedTier === 'elite' ? 'lifetime' : null,
        startDate: info.originalPurchaseDate ?? null,
        expiryDate: info.latestExpirationDate ?? null,
        isActive: detectedTier !== 'free',
      });
      return detectedTier !== 'free';
    } catch (e) {
      console.warn('Restore failed:', e);
      return false;
    }
  };

  // --- Mock mode (dev / pas de clé RC) ---

  const loadFromStorage = async () => {
    try {
      const data = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
      if (data) {
        const parsed: SubscriptionData = JSON.parse(data);
        if (parsed.billingCycle === 'lifetime') {
          parsed.isActive = true;
        } else if (parsed.expiryDate) {
          parsed.isActive = new Date(parsed.expiryDate) > new Date();
        }
        if (!parsed.isActive) parsed.tier = 'free';
        setSubscription(parsed);
      }
    } catch (e) {
      console.error('Error loading subscription:', e);
    }
  };

  const subscribeMock = async (
    selectedTier: 'essentiel' | 'pro' | 'premium' | 'elite',
    cycle?: 'monthly' | 'yearly',
  ): Promise<boolean> => {
    const now = new Date();
    let expiryDate: string | null = null;
    let billingCycle: 'monthly' | 'yearly' | 'lifetime' = 'lifetime';

    if (selectedTier === 'elite') {
      billingCycle = 'lifetime';
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
      tier: selectedTier,
      billingCycle,
      startDate: now.toISOString(),
      expiryDate,
      isActive: true,
    };

    await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(newSub));
    setSubscription(newSub);
    return true;
  };

  // --- API publique unifiée ---

  const subscribe = async (
    selectedTier: 'essentiel' | 'pro' | 'premium' | 'elite',
    cycle?: 'monthly' | 'yearly',
    pkg?: PurchasesPackage,
  ): Promise<boolean> => {
    if (useRC && pkg) {
      return purchasePackage(pkg);
    }
    return subscribeMock(selectedTier, cycle);
  };

  const restorePurchase = async (): Promise<boolean> => {
    if (useRC) return restorePurchaseRC();
    await loadFromStorage();
    return subscription.isActive;
  };

  const cancelSubscription = async () => {
    if (useRC) {
      // Sur iOS/Android, l'annulation se fait via les réglages du store
      // On ne peut pas annuler programmatiquement
      return;
    }
    await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(DEFAULT_SUB));
    setSubscription(DEFAULT_SUB);
  };

  const tier = subscription.isActive ? subscription.tier : 'free';
  const limits = TIER_LIMITS[tier] || TIER_LIMITS.free;

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
    offering,
    useRevenueCat: useRC,
  };
}
