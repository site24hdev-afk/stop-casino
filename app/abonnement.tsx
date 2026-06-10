import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../src/constants/theme';
import { useColors, useTheme } from '../src/context/ThemeContext';
import {
  useSubscription,
  PLANS,
  TIER_FEATURES,
  TierType,
} from '../src/hooks/useSubscription';
import { t } from '../src/i18n';

type SelectedPlan = {
  tier: 'essentiel' | 'pro' | 'premium' | 'elite';
  cycle?: 'monthly' | 'yearly';
};

export default function AbonnementScreen() {
  const router = useRouter();
  const c = useColors();
  const { isDark } = useTheme();
  const { subscription, tier, isPaid, isElite, subscribe, restorePurchase, cancelSubscription, daysRemaining } = useSubscription();
  const [selected, setSelected] = useState<SelectedPlan>({ tier: 'pro', cycle: 'yearly' });
  const [processing, setProcessing] = useState(false);
  const [showDetails, setShowDetails] = useState<TierType | null>(null);

  const getPrice = () => {
    if (selected.tier === 'elite') return PLANS.elite.lifetime.label;
    const plan = PLANS[selected.tier as 'essentiel' | 'pro' | 'premium'];
    return selected.cycle === 'yearly' ? plan.yearly.label : plan.monthly.label;
  };

  const handleSubscribe = async () => {
    setProcessing(true);
    try {
      const success = await subscribe(selected.tier, selected.cycle);
      if (success) {
        Alert.alert(
          selected.tier === 'elite' ? t('sub.welcomeElite') : t('sub.welcomeTitle', { tier: PLANS[selected.tier].name }),
          t('sub.welcomeText'),
          [{ text: t('sub.great'), onPress: () => router.back() }]
        );
      }
    } catch (e) {
      Alert.alert(t('error'), t('sub.errorText'));
    }
    setProcessing(false);
  };

  const handleRestore = async () => {
    setProcessing(true);
    await restorePurchase();
    setProcessing(false);
    if (isPaid) {
      Alert.alert(t('sub.restored'), t('sub.restoredText'));
    } else {
      Alert.alert(t('sub.noSub'), t('sub.noSubText'));
    }
  };

  // Écran gestion pour abonnés actifs
  if (isPaid) {
    const tierInfo = PLANS[tier === 'free' ? 'essentiel' : tier as 'essentiel' | 'pro' | 'premium' | 'elite'];
    const features = TIER_FEATURES[tier];
    return (
      <View style={{ flex: 1, backgroundColor: c.background }}>
      <LinearGradient colors={GRADIENTS.screenBg} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.surfaceGlass, borderColor: c.borderLight }]}>
            <Ionicons name="arrow-back" size={22} color={c.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.text }]} accessibilityRole="header">{t('sub.mySubscription')}</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.lg }}>
          <View style={[styles.activeCard, { backgroundColor: c.surfaceGlass, borderColor: `${tierInfo.color}40` }]}>
            <View style={[styles.activeBadge, { backgroundColor: tierInfo.color }]}>
              <Ionicons name="checkmark-circle" size={16} color="#FFF" />
              <Text style={styles.activeBadgeText}>{tierInfo.name.toUpperCase()} {t('sub.active')}</Text>
            </View>
            <View style={[styles.activeIconCircle, { backgroundColor: `${tierInfo.color}20` }]}>
              <Ionicons name={tierInfo.icon} size={36} color={tierInfo.color} />
            </View>
            <Text style={[styles.activeTitle, { color: c.text }]}>Stop Casino {tierInfo.name}</Text>
            <Text style={[styles.activePlan, { color: c.textSecondary }]}>
              {subscription.billingCycle === 'lifetime' ? t('sub.lifetimeAccess') :
               subscription.billingCycle === 'yearly' ? t('sub.annual') : t('sub.monthly')}
            </Text>
            {subscription.billingCycle !== 'lifetime' && (
              <Text style={[styles.activeDays, { color: tierInfo.color }]}>
                {t('sub.daysLeft', { count: daysRemaining() })}
              </Text>
            )}
            {isElite && (
              <Text style={[styles.activeDays, { color: tierInfo.color }]}>{t('sub.forever')}</Text>
            )}
          </View>

          <Text style={[styles.sectionTitle, { color: c.text }]}>{t('sub.benefits')}</Text>
          {features.features.filter(f => f.included).map((feat, i) => (
            <View key={i} style={styles.featureCheckRow}>
              <View style={[styles.featureCheck, { backgroundColor: tierInfo.color }]}>
                <Ionicons name="checkmark" size={12} color="#FFF" />
              </View>
              <Text style={[styles.featureCheckText, { color: c.text }]}>{feat.text}</Text>
            </View>
          ))}

          {tier !== 'elite' && (
            <TouchableOpacity
              style={[styles.upgradeButton, { backgroundColor: PLANS.pro.color }]}
              accessibilityRole="button"
              accessibilityLabel="Change subscription offer"
              onPress={() => {
                // Reset pour montrer le paywall
                cancelSubscription().then(() => {
                  // L'écran va re-render en mode paywall
                });
              }}
            >
              <Ionicons name="arrow-up-circle" size={20} color="#FFF" />
              <Text style={styles.upgradeText}>{t('sub.changeOffer')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.cancelBtn} accessibilityRole="button" accessibilityLabel="Cancel subscription" onPress={() => {
            Alert.alert(t('cancel'), t('sub.cancelConfirm'), [
              { text: t('no'), style: 'cancel' },
              { text: t('yes'), style: 'destructive', onPress: cancelSubscription },
            ]);
          }}>
            <Text style={[styles.cancelText, { color: c.danger || COLORS.danger }]}>{t('sub.cancelSub')}</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
      </View>
    );
  }

  // PAYWALL — 3 paliers
  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
    <LinearGradient colors={GRADIENTS.screenBg} style={StyleSheet.absoluteFill} />
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Close */}
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

        {/* === GRATUIT (info card, non sélectionnable) === */}
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
            <View style={styles.featuresList}>
              {TIER_FEATURES.free.features.slice(0, 7).map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Ionicons
                    name={f.included ? 'checkmark-circle' : 'close-circle'}
                    size={16}
                    color={f.included ? '#94A3B8' : c.textMuted}
                  />
                  <Text style={[styles.featureText, { color: c.text }, !f.included && [styles.featureTextLocked, { color: c.textMuted }]]}>
                    {f.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* === ESSENTIEL === */}
        <View style={styles.planSection}>
          <TouchableOpacity
            style={[
              styles.planHeader,
              { backgroundColor: c.surfaceGlass },
              selected.tier === 'essentiel' && { borderColor: PLANS.essentiel.color },
            ]}
            onPress={() => setSelected({ tier: 'essentiel', cycle: 'yearly' })}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Select Essentiel plan"
          >
            <View style={styles.planHeaderTop}>
              <View style={[styles.planIcon, { backgroundColor: `${PLANS.essentiel.color}20` }]}>
                <Ionicons name="star" size={22} color={PLANS.essentiel.color} />
              </View>
              <View style={styles.planHeaderInfo}>
                <Text style={[styles.planName, { color: c.text }]}>{PLANS.essentiel.name}</Text>
                <Text style={[styles.planTagline, { color: c.textSecondary }]}>{PLANS.essentiel.tagline}</Text>
              </View>
              <View style={[styles.radio, selected.tier === 'essentiel' && { borderColor: PLANS.essentiel.color }]}>
                {selected.tier === 'essentiel' && <View style={[styles.radioInner, { backgroundColor: PLANS.essentiel.color }]} />}
              </View>
            </View>

            {/* Prix Essentiel */}
            {selected.tier === 'essentiel' && (
              <View style={styles.cycleRow}>
                <TouchableOpacity
                  style={[styles.cycleChip, selected.cycle === 'yearly' && { backgroundColor: PLANS.essentiel.color }]}
                  onPress={() => setSelected({ tier: 'essentiel', cycle: 'yearly' })}
                >
                  <Text style={[styles.cycleText, { color: c.textSecondary }, selected.cycle === 'yearly' && styles.cycleTextActive]}>
                    {PLANS.essentiel.yearly.label}
                  </Text>
                  <View style={styles.saveBadge}>
                    <Text style={styles.saveText}>-{PLANS.essentiel.yearly.savings}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.cycleChip, selected.cycle === 'monthly' && { backgroundColor: PLANS.essentiel.color }]}
                  onPress={() => setSelected({ tier: 'essentiel', cycle: 'monthly' })}
                >
                  <Text style={[styles.cycleText, { color: c.textSecondary }, selected.cycle === 'monthly' && styles.cycleTextActive]}>
                    {PLANS.essentiel.monthly.label}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Features Essentiel */}
            <View style={styles.featuresList}>
              {TIER_FEATURES.essentiel.features.slice(0, 4).map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Ionicons
                    name={f.included ? 'checkmark-circle' : 'close-circle'}
                    size={16}
                    color={f.included ? PLANS.essentiel.color : c.textMuted}
                  />
                  <Text style={[styles.featureText, { color: c.text }, !f.included && [styles.featureTextLocked, { color: c.textMuted }]]}>{f.text}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        </View>

        {/* === PRO (recommandé) === */}
        <View style={styles.planSection}>
          <View style={styles.recommendBadge}>
            <Ionicons name="flame" size={12} color="#FFF" />
            <Text style={styles.recommendText}>{t('sub.recommended')}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.planHeader,
              styles.planHeaderPro,
              { backgroundColor: c.surfaceGlass },
              selected.tier === 'pro' && { borderColor: PLANS.pro.color },
            ]}
            onPress={() => setSelected({ tier: 'pro', cycle: 'yearly' })}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Select Pro plan"
          >
            <View style={styles.planHeaderTop}>
              <View style={[styles.planIcon, { backgroundColor: `${PLANS.pro.color}20` }]}>
                <Ionicons name="diamond" size={22} color={PLANS.pro.color} />
              </View>
              <View style={styles.planHeaderInfo}>
                <Text style={[styles.planName, { color: c.text }]}>{PLANS.pro.name}</Text>
                <Text style={[styles.planTagline, { color: c.textSecondary }]}>{PLANS.pro.tagline}</Text>
              </View>
              <View style={[styles.radio, selected.tier === 'pro' && { borderColor: PLANS.pro.color }]}>
                {selected.tier === 'pro' && <View style={[styles.radioInner, { backgroundColor: PLANS.pro.color }]} />}
              </View>
            </View>

            {selected.tier === 'pro' && (
              <View style={styles.cycleRow}>
                <TouchableOpacity
                  style={[styles.cycleChip, selected.cycle === 'yearly' && { backgroundColor: PLANS.pro.color }]}
                  onPress={() => setSelected({ tier: 'pro', cycle: 'yearly' })}
                >
                  <Text style={[styles.cycleText, { color: c.textSecondary }, selected.cycle === 'yearly' && styles.cycleTextActive]}>
                    {PLANS.pro.yearly.label}
                  </Text>
                  <View style={styles.saveBadge}>
                    <Text style={styles.saveText}>-{PLANS.pro.yearly.savings}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.cycleChip, selected.cycle === 'monthly' && { backgroundColor: PLANS.pro.color }]}
                  onPress={() => setSelected({ tier: 'pro', cycle: 'monthly' })}
                >
                  <Text style={[styles.cycleText, { color: c.textSecondary }, selected.cycle === 'monthly' && styles.cycleTextActive]}>
                    {PLANS.pro.monthly.label}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.featuresList}>
              {TIER_FEATURES.pro.features.map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={PLANS.pro.color} />
                  <Text style={[styles.featureText, { color: c.text }]}>{f.text}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        </View>

        {/* === PREMIUM === */}
        <View style={styles.planSection}>
          <TouchableOpacity
            style={[
              styles.planHeader,
              { backgroundColor: c.surfaceGlass },
              selected.tier === 'premium' && { borderColor: PLANS.premium.color },
            ]}
            onPress={() => setSelected({ tier: 'premium', cycle: 'yearly' })}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Select Premium plan"
          >
            <View style={styles.planHeaderTop}>
              <View style={[styles.planIcon, { backgroundColor: `${PLANS.premium.color}20` }]}>
                <Ionicons name="shield-checkmark" size={22} color={PLANS.premium.color} />
              </View>
              <View style={styles.planHeaderInfo}>
                <Text style={[styles.planName, { color: c.text }]}>{PLANS.premium.name}</Text>
                <Text style={[styles.planTagline, { color: c.textSecondary }]}>{PLANS.premium.tagline}</Text>
              </View>
              <View style={[styles.radio, selected.tier === 'premium' && { borderColor: PLANS.premium.color }]}>
                {selected.tier === 'premium' && <View style={[styles.radioInner, { backgroundColor: PLANS.premium.color }]} />}
              </View>
            </View>

            {selected.tier === 'premium' && (
              <View style={styles.cycleRow}>
                <TouchableOpacity
                  style={[styles.cycleChip, selected.cycle === 'yearly' && { backgroundColor: PLANS.premium.color }]}
                  onPress={() => setSelected({ tier: 'premium', cycle: 'yearly' })}
                >
                  <Text style={[styles.cycleText, { color: c.textSecondary }, selected.cycle === 'yearly' && styles.cycleTextActive]}>
                    {PLANS.premium.yearly.label}
                  </Text>
                  <View style={styles.saveBadge}>
                    <Text style={styles.saveText}>-{PLANS.premium.yearly.savings}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.cycleChip, selected.cycle === 'monthly' && { backgroundColor: PLANS.premium.color }]}
                  onPress={() => setSelected({ tier: 'premium', cycle: 'monthly' })}
                >
                  <Text style={[styles.cycleText, { color: c.textSecondary }, selected.cycle === 'monthly' && styles.cycleTextActive]}>
                    {PLANS.premium.monthly.label}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.featuresList}>
              {TIER_FEATURES.premium.features.map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={PLANS.premium.color} />
                  <Text style={[styles.featureText, { color: c.text }]}>{f.text}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        </View>

        {/* === ELITE === */}
        <View style={styles.planSection}>
          <TouchableOpacity
            style={[
              styles.planHeader,
              { backgroundColor: c.surfaceGlass },
              selected.tier === 'elite' && { borderColor: PLANS.elite.color },
            ]}
            onPress={() => setSelected({ tier: 'elite' })}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Select Elite plan"
          >
            <View style={styles.planHeaderTop}>
              <View style={[styles.planIcon, { backgroundColor: `${PLANS.elite.color}20` }]}>
                <Ionicons name="trophy" size={22} color={PLANS.elite.color} />
              </View>
              <View style={styles.planHeaderInfo}>
                <Text style={[styles.planName, { color: c.text }]}>{PLANS.elite.name}</Text>
                <Text style={[styles.planTagline, { color: c.textSecondary }]}>{PLANS.elite.tagline}</Text>
              </View>
              <View style={[styles.radio, selected.tier === 'elite' && { borderColor: PLANS.elite.color }]}>
                {selected.tier === 'elite' && <View style={[styles.radioInner, { backgroundColor: PLANS.elite.color }]} />}
              </View>
            </View>

            <View style={styles.elitePriceRow}>
              <Text style={[styles.elitePrice, { color: PLANS.elite.color }]}>{PLANS.elite.lifetime.label}</Text>
              <Text style={[styles.eliteDetail, { color: c.textSecondary }]}>{t('sub.lifetime')}</Text>
            </View>

            <View style={styles.featuresList}>
              {TIER_FEATURES.elite.features.map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={PLANS.elite.color} />
                  <Text style={[styles.featureText, { color: c.text }]}>{f.text}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.cta, { backgroundColor: PLANS[selected.tier].color }]}
          onPress={handleSubscribe}
          disabled={processing}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Subscribe now"
        >
          {processing ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name={PLANS[selected.tier].icon} size={20} color="#FFF" />
              <Text style={styles.ctaText}>
                {selected.tier === 'elite' ? t('sub.eliteBtn') : t('sub.startBtn')} — {getPrice()}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleRestore} accessibilityRole="button" accessibilityLabel="Restore purchase">
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

  // Hero
  hero: { alignItems: 'center', paddingHorizontal: SPACING.xl, marginBottom: SPACING.xl },
  heroIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(245,158,11,0.12)', justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.md,
  },
  heroTitle: { fontSize: 28, fontWeight: '900', color: COLORS.text, marginBottom: 6 },
  heroSub: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24 },

  // Plan cards
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

  // Cycle picker
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

  // Elite price
  elitePriceRow: { marginVertical: SPACING.sm, alignItems: 'center' },
  elitePrice: { fontSize: FONT_SIZE.xl, fontWeight: '900' },
  eliteDetail: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },

  // Features
  featuresList: { gap: 6, marginTop: SPACING.xs },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: FONT_SIZE.sm, color: COLORS.text },
  featureTextLocked: { color: COLORS.textMuted, textDecorationLine: 'line-through' },

  // CTA
  cta: {
    flexDirection: 'row', marginHorizontal: SPACING.lg, borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 18, justifyContent: 'center', alignItems: 'center', gap: SPACING.sm,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
    marginBottom: SPACING.xl,
  },
  ctaText: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: '#FFF' },

  // Footer
  footer: { alignItems: 'center', paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  footerLink: { fontSize: FONT_SIZE.sm, color: COLORS.info, fontWeight: '600' },
  footerText: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18 },
  footerLinks: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  footerSmall: { fontSize: 11, color: COLORS.textMuted, textDecorationLine: 'underline' },
  footerDot: { fontSize: 11, color: COLORS.textMuted },

  // Active subscription
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
