import { Platform } from 'react-native';

export const REVENUECAT_API_KEY = Platform.select({
  ios: 'appl_XXXXXXXXXXXXXXXXXXXXXXXX',
  android: 'goog_XXXXXXXXXXXXXXXXXXXXXXXX',
}) as string;

export const PRODUCT_IDS = {
  essentiel_monthly: 'sc_essentiel_monthly',
  essentiel_yearly: 'sc_essentiel_yearly',
  pro_monthly: 'sc_pro_monthly',
  pro_yearly: 'sc_pro_yearly',
  premium_monthly: 'sc_premium_monthly',
  premium_yearly: 'sc_premium_yearly',
  elite_lifetime: 'sc_elite_lifetime',
} as const;

export const ENTITLEMENT_IDS = {
  essentiel: 'essentiel',
  pro: 'pro',
  premium: 'premium',
  elite: 'elite',
} as const;

export const isRevenueCatConfigured = () =>
  !REVENUECAT_API_KEY.includes('XXXX');
