import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
type PurchasesPackage = any;
import { COLORS, GRADIENTS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../src/constants/theme';
import { useColors, useTheme } from '../src/context/ThemeContext';
import { useSubscription, TierType } from '../src/hooks/useSubscription';
import { t } from '../src/i18n';

const PLAN_CONFIGS = {
  essentiel: { color: '#3B82F6', icon: 'star' as const, iconOutline: 'star-outline' as const },
  pro: { color: '#10B981', icon: 'diamond' as const, iconOutline: 'diamond-outline' as const },
  premium: { color: '#8B5CF6', icon: 'shield-checkmark' as const, iconOutline: 'shield-checkmark-outline' as const },
  elite: { color: '#F59E0B', icon: 'trophy' as const, iconOutline: 'trophy-outline' as const },
};

const TIER_FEATURE_KEYS: Record<string, { keys: string[]; allIncluded?: boolean }> = {
  free: {
    keys: [
      'features.counter', 'features.sos1step', 'features.emergencyOnly',
      'features.noJournal', 'features.noLibrary', 'features.noStats', 'features.fixedQuote',
    ],
  },
  essentiel: {
    keys: [
      'features.freePlus', 'features.fullSos', 'features.fullAide',
      'features.journal5', 'features.articles3', 'features.basicStats',
      'features.dailyQuotes', 'features.noAds',
    ],
    allIncluded: true,
  },
  pro: {
    keys: [
      'features.essentielPlus', 'features.unlimitedJournal', 'features.fullLibrary',
      'features.advancedStats', 'features.simulatedGames', 'features.triggerAnalysis',
    ],
    allIncluded: true,
  },
  premium: {
    keys: [
      'features.proPlus', 'features.customReminders', 'features.exportPdf',
      'features.iosWidget', 'features.customThemes', 'features.prioritySupport',
    ],
    allIncluded: true,
  },
  elite: {
    keys: [
      'features.allProForever', 'features.oneTimePayment',
      'features.priorityAccess', 'features.eliteBadge',
    ],
    allIncluded: true,
  },
};

type PlanTier = 'essentiel' | 'pro' | 'premium' | 'elite';

type SelectedPlan = {
  tier: PlanTier;
  cycle?: 'monthly' | 'yearly';
};

function getPackageForSelection(
  offering: any,
  selected: SelectedPlan,
): PurchasesPackage | undefined {
  if (!offering?.availablePackages) return undefined;
  const pkgs: PurchasesPackage[] = offering.availablePackages;
  const prefix = `sc_${selected.tier}`;
  if (selected.tier === 'elite') {
    return pkgs.find(p => p.product.identifier.includes(prefix));
  }
  const suffix = selected.cycle === 'monthly' ? 'monthly' : 'yearly';
  return pkgs.find(p => p.product.identifier.includes(`${prefix}_${suffix}`));
}

export default function AbonnementScreen() {
  const router = useRouter();
  const c = useColors();
  const { isDark } = useTheme();
  const {
    subscription, tier, isPaid, isElite,
    subscribe, restorePurchase, cancelSubscription,
    daysRemaining, offering, useRevenueCat,
  } = useSubscription();
  const [selected, setSelected] = useState<SelectedPlan>({ tier: 'pro', cycle: 'yearly' });
  const [processing, setProcessing] = useState(false);

  const getPriceLabel = (): string => {
    if (useRevenueCat && offering) {
      const pkg = getPackageForSelection(offering, selected);
      if (pkg) return pkg.product.priceString;
    }
    // Fallback statique
    const prices: Record<string, Record<string, string>> = {
      essentiel: { monthly: '4,99 €', yearly: '39,99 €' },
      pro: { monthly: '9,99 €', yearly: '79,99 €' },
      premium: { monthly: '14,99 €', yearly: '109,99 €' },
      elite: { lifetime: '149,99 €' },
    };
    if (selected.tier === 'elite') return prices.elite.lifetime;
    return prices[selected.tier][selected.cycle || 'yearly'];
  };

  const getCycleLabel = (planTier: PlanTier, cycle: 'monthly' | 'yearly'): string => {
    if (useRevenueCat && offering) {
      const pkg = getPackageForSelection(offering, { tier: planTier, cycle });
      if (pkg) return pkg.product.priceString + (cycle === 'yearly' ? t('sub.perYear') : t('sub.perMonth'));
    }
    const fallback: Record<string, Record<string, string>> = {
      essentiel: { monthly: '4,99 €' + t('sub.perMonth'), yearly: '39,99 €' + t('sub.perYear') },
      pro: { monthly: '9,99 €' + t('sub.perMonth'), yearly: '79,99 €' + t('sub.perYear') },
      premium: { monthly: '14,99 €' + t('sub.perMonth'), yearly: '109,99 €' + t('sub.perYear') },
    };
    return fallback[planTier]?.[cycle] || '';
  };

  const getSavings = (planTier: PlanTier): string => {
    if (useRevenueCat && offering) {
      const monthly = getPackageForSelection(offering, { tier: planTier, cycle: 'monthly' });
      const yearly = getPackageForSelection(offering, { tier: planTier, cycle: 'yearly' });
      if (monthly && yearly) {
        const saved = Math.round((1 - yearly.product.price / (monthly.product.price * 12)) * 100);
        return `-${saved}%`;
      }
    }
    return '-44%';
  };

  const handleSubscribe = async () => {
    setProcessing(true);
    try {
      const pkg = useRevenueCat ? getPackageForSelection(offering, selected) : undefined;
      const success = await subscribe(selected.tier, selected.cycle, pkg);
      if (success) {
        Alert.alert(
          selected.tier === 'elite'
            ? t('sub.welcomeElite')
            : t('sub.welcomeTitle', { tier: t(`plans.${selected.tier}`) }),
          t('sub.welcomeText'),
          [{ text: t('sub.great'), onPress: () => router.back() }],
        );
      }
    } catch (e) {
      Alert.alert(t('error'), t('sub.errorText'));
    }
    setProcessing(false);
  };

  const handleRestore = async () => {
    setProcessing(true);
    const restored = await restorePurchase();
    setProcessing(false);
    if (restored) {
      Alert.alert(t('sub.restored'), t('sub.restoredText'));
    } else {
      Alert.alert(t('sub.noSub'), t('sub.noSubText'));
    }
  };

  const openStoreManagement = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/account/subscriptions');
    } else {
      Linking.openURL('https://play.google.com/store/account/subscriptions');
    }
  };

  const renderFeatures = (tierKey: string, color: string) => {
    const config = TIER_FEATURE_KEYS[tierKey];
    if (!config) return null;
    const freeIncluded = [0, 1, 2, 3, 4, 5, 6]; // indices included for free tier
    return (
      <View style={styles.featuresList}>
        {config.keys.map((key, i) => {
          const included = config.allIncluded !== undefined ? config.allIncluded : freeIncluded.includes(i);
          return (
            <View key={i} style={styles.featureItem}>
              <Ionicons
                name={included ? 'checkmark-circle' : 'close-circle'}
                size={16}
                color={included ? color : c.textMuted}
              />
              <Text style={[styles.featureText, { color: c.text }, !included && [styles.featureTextLocked, { color: c.textMuted }]]}>
                {t(key)}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  // ═══ Écran gestion abonné ═══
  if (isPaid) {
    const planColor = PLAN_CONFIGS[tier === 'free' ? 'essentiel' : tier as PlanTier].color;
    const planIcon = PLAN_CONFIGS[tier === 'free' ? 'essentiel' : tier as PlanTier].iconOutline;
    const tierConfig = TIER_FEATURE_KEYS[tier];

    return (
      <View style={{ flex: 1, backgroundColor: c.background }}>
        {!isDark && <LinearGradient colors={GRADIENTS.screenBg} style={StyleSheet.absoluteFill} />}
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.surfaceGlass, borderColor: c.borderLight }]}>
              <Ionicons name="arrow-back" size={22} color={c.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: c.text }]} accessibilityRole="header">{t('sub.mySubscription')}</Text>
            <View style={{ width: 40 }} />
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.lg }}>
            <View style={[styles.activeCard, { backgroundColor: c.surfaceGlass, borderColor: `${planColor}40` }]}>
              <View style={[styles.activeBadge, { backgroundColor: planColor }]}>
                <Ionicons name="checkmark-circle" size={16} color="#FFF" />
                <Text style={styles.activeBadgeText}>{t(`plans.${tier}`).toUpperCase()} {t('sub.active')}</Text>
              </View>
              <View style={[styles.activeIconCircle, { backgroundColor: `${planColor}20` }]}>
                <Ionicons name={planIcon} size={36} color={planColor} />
              </View>
              <Text style={[styles.activeTitle, { color: c.text }]}>Stop Casino {t(`plans.${tier}`)}</Text>
              <Text style={[styles.activePlan, { color: c.textSecondary }]}>
                {subscription.billingCycle === 'lifetime' ? t('sub.lifetimeAccess') :
                 subscription.billingCycle === 'yearly' ? t('sub.annual') : t('sub.monthly')}
              </Text>
              {subscription.billingCycle !== 'lifetime' && (
                <Text style={[styles.activeDays, { color: planColor }]}>
                  {t('sub.daysLeft', { count: daysRemaining() })}
                </Text>
              )}
              {isElite && (
                <Text style={[styles.activeDays, { color: planColor }]}>{t('sub.forever')}</Text>
              )}
            </View>

            <Text style={[styles.sectionTitle, { color: c.text }]}>{t('sub.benefits')}</Text>
            {tierConfig?.keys.filter((_, i) => tierConfig.allIncluded || i < 7).map((key, i) => (
              <View key={i} style={styles.featureCheckRow}>
                <View style={[styles.featureCheck, { backgroundColor: planColor }]}>
                  <Ionicons name="checkmark" size={12} color="#FFF" />
                </View>
                <Text style={[styles.featureCheckText, { color: c.text }]}>{t(key)}</Text>
              </View>
            ))}

            {tier !== 'elite' && (
              <TouchableOpacity
                style={[styles.upgradeButton, { backgroundColor: PLAN_CONFIGS.pro.color }]}
                accessibilityRole="button"
                onPress={() => {
                  if (useRevenueCat) {
                    openStoreManagement();
                  } else {
                    cancelSubscription();
                  }
                }}
              >
                <Ionicons name="arrow-up-circle" size={20} color="#FFF" />
                <Text style={styles.upgradeText}>{t('sub.changeOffer')}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.cancelBtn}
              accessibilityRole="button"
              onPress={() => {
                if (useRevenueCat) {
                  openStoreManagement();
                } else {
                  Alert.alert(t('cancel'), t('sub.cancelConfirm'), [
                    { text: t('no'), style: 'cancel' },
                    { text: t('yes'), style: 'destructive', onPress: cancelSubscription },
                  ]);
                }
              }}
            >
              <Text style={[styles.cancelText, { color: c.danger || COLORS.danger }]}>
                {useRevenueCat ? t('sub.manageInStore') : t('sub.cancelSub')}
              </Text>
            </TouchableOpacity>
            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // ═══ PAYWALL ═══
  const planTiers: PlanTier[] = ['essentiel', 'pro', 'premium', 'elite'];

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      {!isDark && <LinearGradient colors={GRADIENTS.screenBg} style={StyleSheet.absoluteFill} />}
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel={t('close')}>
            <Ionicons name="close" size={28} color={c.text} />
          </TouchableOpacity>

          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <Ionicons name="rocket" size={40} color="#F59E0B" />
            </View>
            <Text style={[styles.heroTitle, { color: c.text }]}>{t('sub.choosePlan')}</Text>
            <Text style={[styles.heroSub, { color: c.textSecondary }]}>{t('sub.heroText')}</Text>
          </View>

          {/* Gratuit */}
          <View style={styles.planSection}>
            <View style={[styles.planHeader, { backgroundColor: c.surfaceGlass, borderColor: 'rgba(148,163,184,0.2)', opacity: 0.7 }]}>
              <View style={styles.planHeaderTop}>
                <View style={[styles.planIcon, { backgroundColor: 'rgba(148,163,184,0.15)' }]}>
                  <Ionicons name="gift-outline" size={22} color="#94A3B8" />
                </View>
                <View style={styles.planHeaderInfo}>
                  <Text style={[styles.planName, { color: c.text }]}>{t('sub.freeName')}</Text>
                  <Text style={[styles.planTagline, { color: c.textSecondary }]}>{t('sub.freeTagline')}</Text>
                </View>
                <Text style={styles.freeLabel}>{t('sub.freePrice')}</Text>
              </View>
              {renderFeatures('free', '#94A3B8')}
            </View>
          </View>

          {/* Plans payants */}
          {planTiers.map((planTier) => {
            const config = PLAN_CONFIGS[planTier];
            const isSelected = selected.tier === planTier;
            const isRecommended = planTier === 'pro';
            const isElitePlan = planTier === 'elite';

            return (
              <View key={planTier} style={styles.planSection}>
                {isRecommended && (
                  <View style={styles.recommendBadge}>
                    <Ionicons name="flame" size={12} color="#FFF" />
                    <Text style={styles.recommendText}>{t('sub.recommended')}</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={[
                    styles.planHeader,
                    isRecommended && styles.planHeaderPro,
                    { backgroundColor: c.surfaceGlass },
                    isSelected && { borderColor: config.color },
                  ]}
                  onPress={() => setSelected(isElitePlan ? { tier: planTier } : { tier: planTier, cycle: 'yearly' })}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                >
                  <View style={styles.planHeaderTop}>
                    <View style={[styles.planIcon, { backgroundColor: `${config.color}20` }]}>
                      <Ionicons name={config.icon} size={22} color={config.color} />
                    </View>
                    <View style={styles.planHeaderInfo}>
                      <Text style={[styles.planName, { color: c.text }]}>{t(`plans.${planTier}`)}</Text>
                      <Text style={[styles.planTagline, { color: c.textSecondary }]}>{t(`plans.${planTier}Tag`)}</Text>
                    </View>
                    <View style={[styles.radio, isSelected && { borderColor: config.color }]}>
                      {isSelected && <View style={[styles.radioInner, { backgroundColor: config.color }]} />}
                    </View>
                  </View>

                  {/* Cycle picker (pas pour Elite) */}
                  {isSelected && !isElitePlan && (
                    <View style={styles.cycleRow}>
                      <TouchableOpacity
                        style={[styles.cycleChip, selected.cycle === 'yearly' && { backgroundColor: config.color }]}
                        onPress={() => setSelected({ tier: planTier, cycle: 'yearly' })}
                      >
                        <Text style={[styles.cycleText, { color: c.textSecondary }, selected.cycle === 'yearly' && styles.cycleTextActive]}>
                          {getCycleLabel(planTier, 'yearly')}
                        </Text>
                        <View style={styles.saveBadge}>
                          <Text style={styles.saveText}>{getSavings(planTier)}</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.cycleChip, selected.cycle === 'monthly' && { backgroundColor: config.color }]}
                        onPress={() => setSelected({ tier: planTier, cycle: 'monthly' })}
                      >
                        <Text style={[styles.cycleText, { color: c.textSecondary }, selected.cycle === 'monthly' && styles.cycleTextActive]}>
                          {getCycleLabel(planTier, 'monthly')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Prix Elite */}
                  {isElitePlan && (
                    <View style={styles.elitePriceRow}>
                      <Text style={[styles.elitePrice, { color: config.color }]}>{getPriceLabel()}</Text>
                      <Text style={[styles.eliteDetail, { color: c.textSecondary }]}>{t('sub.lifetime')}</Text>
                    </View>
                  )}

                  {renderFeatures(planTier, config.color)}
                </TouchableOpacity>
              </View>
            );
          })}

          {/* CTA */}
          <TouchableOpacity
            style={[styles.cta, { backgroundColor: PLAN_CONFIGS[selected.tier].color }]}
            onPress={handleSubscribe}
            disabled={processing}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            {processing ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name={PLAN_CONFIGS[selected.tier].icon} size={20} color="#FFF" />
                <Text style={styles.ctaText}>
                  {selected.tier === 'elite' ? t('sub.eliteBtn') : t('sub.startBtn')} — {getPriceLabel()}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={handleRestore} accessibilityRole="button">
              <Text style={styles.footerLink}>{t('sub.restore')}</Text>
            </TouchableOpacity>
            <Text style={[styles.footerText, { color: c.textMuted }]}>{t('sub.securePayment')}</Text>
            <View style={styles.footerLinks}>
              <TouchableOpacity>
                <Text style={[styles.footerSmall, { color: c.textMuted }]}>{t('sub.terms')}</Text>
              </TouchableOpacity>
              <Text style={[styles.footerDot, { color: c.textMuted }]}>·</Text>
              <TouchableOpacity>
                <Text style={[styles.footerSmall, { color: c.textMuted }]}>{t('sub.privacy')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg,
  },
  headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text },
  backBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: COLORS.surfaceGlass, borderWidth: 1, borderColor: COLORS.borderLight, justifyContent: 'center', alignItems: 'center' },
  closeBtn: { alignSelf: 'flex-end', padding: SPACING.lg },

  hero: { alignItems: 'center', paddingHorizontal: SPACING.xl, marginBottom: SPACING.xl },
  heroIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(245,158,11,0.12)', justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.md,
  },
  heroTitle: { fontSize: 28, fontWeight: '900', color: COLORS.text, marginBottom: 6 },
  heroSub: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24 },

  planSection: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.md, position: 'relative' },
  recommendBadge: {
    position: 'absolute', top: -10, right: SPACING.lg + 16, zIndex: 10,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  recommendText: { fontSize: 10, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },

  planHeader: {
    backgroundColor: COLORS.surfaceGlass, borderRadius: 22,
    padding: SPACING.lg, borderWidth: 1.5, borderColor: COLORS.borderGlass,
  },
  planHeaderPro: { borderColor: 'rgba(16,185,129,0.15)' },
  planHeaderTop: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  planIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  planHeaderInfo: { flex: 1, marginLeft: SPACING.md },
  planName: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.text },
  planTagline: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },

  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: COLORS.textMuted,
    justifyContent: 'center', alignItems: 'center',
  },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  freeLabel: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: '#94A3B8' },

  cycleRow: { flexDirection: 'row', gap: SPACING.sm, marginVertical: SPACING.sm },
  cycleChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surfaceLight, gap: 6,
  },
  cycleText: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.textSecondary },
  cycleTextActive: { color: '#FFF' },
  saveBadge: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  saveText: { fontSize: 10, fontWeight: '800', color: '#FFF' },

  elitePriceRow: { marginVertical: SPACING.sm, alignItems: 'center' },
  elitePrice: { fontSize: FONT_SIZE.xl, fontWeight: '900' },
  eliteDetail: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },

  featuresList: { gap: 6, marginTop: SPACING.xs },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: FONT_SIZE.sm, color: COLORS.text },
  featureTextLocked: { color: COLORS.textMuted, textDecorationLine: 'line-through' },

  cta: {
    flexDirection: 'row', marginHorizontal: SPACING.lg, borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 18, justifyContent: 'center', alignItems: 'center', gap: SPACING.sm,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
    marginBottom: SPACING.xl,
  },
  ctaText: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: '#FFF' },

  footer: { alignItems: 'center', paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  footerLink: { fontSize: FONT_SIZE.sm, color: COLORS.info, fontWeight: '600' },
  footerText: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18 },
  footerLinks: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  footerSmall: { fontSize: 11, color: COLORS.textMuted, textDecorationLine: 'underline' },
  footerDot: { fontSize: 11, color: COLORS.textMuted },

  activeCard: {
    backgroundColor: COLORS.surfaceGlass, borderRadius: 22,
    padding: SPACING.xl, alignItems: 'center', borderWidth: 1.5, marginBottom: SPACING.xl,
  },
  activeBadge: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 16, gap: 5, marginBottom: SPACING.lg,
  },
  activeBadgeText: { fontSize: 11, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },
  activeIconCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  activeTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '900', color: COLORS.text, marginBottom: 4 },
  activePlan: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary },
  activeDays: { fontSize: FONT_SIZE.sm, fontWeight: '600', marginTop: 4 },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md, paddingHorizontal: 4 },
  featureCheckRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: 6 },
  featureCheck: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  featureCheckText: { fontSize: FONT_SIZE.md, color: COLORS.text },
  upgradeButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.lg, marginTop: SPACING.xl,
  },
  upgradeText: { fontSize: FONT_SIZE.md, fontWeight: '700', color: '#FFF' },
  cancelBtn: { alignSelf: 'center', paddingVertical: SPACING.lg },
  cancelText: { fontSize: FONT_SIZE.sm, color: COLORS.danger, fontWeight: '600' },
});
