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
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../src/constants/theme';
import {
  useSubscription,
  PRICES,
  PREMIUM_FEATURES,
  PlanType,
} from '../src/hooks/useSubscription';

export default function AbonnementScreen() {
  const router = useRouter();
  const { subscription, isPremium, subscribe, restorePurchase, cancelSubscription, daysRemaining } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [processing, setProcessing] = useState(false);

  const handleSubscribe = async () => {
    setProcessing(true);
    try {
      // En production : ouvrir le flow de paiement StoreKit / RevenueCat
      const success = await subscribe(selectedPlan);
      if (success) {
        Alert.alert(
          'Bienvenue dans Pro !',
          'Ton abonnement Stop Casino Pro est actif. Merci de soutenir ton parcours.',
          [{ text: 'Super !', onPress: () => router.back() }]
        );
      }
    } catch (e) {
      Alert.alert('Erreur', "Une erreur est survenue. Réessaie.");
    }
    setProcessing(false);
  };

  const handleRestore = async () => {
    setProcessing(true);
    await restorePurchase();
    setProcessing(false);
    if (isPremium) {
      Alert.alert('Abonnement restauré', 'Ton abonnement Pro a été restauré avec succès.');
    } else {
      Alert.alert('Aucun abonnement', "Aucun abonnement actif n'a été trouvé.");
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Annuler l\'abonnement',
      'Es-tu sûr de vouloir annuler ton abonnement Pro ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: async () => {
            await cancelSubscription();
            Alert.alert('Abonnement annulé', 'Tu peux te réabonner à tout moment.');
          },
        },
      ]
    );
  };

  // Écran pour les abonnés actifs
  if (isPremium) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mon abonnement</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.activeCard}>
            <View style={styles.activeBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#FFF" />
              <Text style={styles.activeBadgeText}>PRO ACTIF</Text>
            </View>
            <View style={styles.activeIconCircle}>
              <Ionicons name="diamond" size={40} color="#F59E0B" />
            </View>
            <Text style={styles.activeTitle}>Stop Casino Pro</Text>
            <Text style={styles.activePlan}>
              Abonnement {subscription.plan === 'monthly' ? 'mensuel' : 'annuel'}
            </Text>
            <Text style={styles.activeDays}>
              {daysRemaining()} jours restants
            </Text>
          </View>

          <View style={styles.activeFeatures}>
            <Text style={styles.sectionTitle}>Tes avantages</Text>
            {PREMIUM_FEATURES.map((feat, i) => (
              <View key={i} style={styles.featureRowActive}>
                <View style={styles.featureCheckCircle}>
                  <Ionicons name="checkmark" size={14} color="#FFF" />
                </View>
                <Text style={styles.featureActiveText}>{feat.title}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Annuler l'abonnement</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Écran paywall
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>

        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconCircle}>
            <Ionicons name="diamond" size={44} color="#F59E0B" />
          </View>
          <Text style={styles.heroTitle}>Stop Casino Pro</Text>
          <Text style={styles.heroSubtitle}>
            Débloque tous les outils pour{'\n'}vaincre l'addiction
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          {PREMIUM_FEATURES.map((feat, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.featureIconBg, {
                backgroundColor: i % 2 === 0
                  ? 'rgba(16, 185, 129, 0.12)'
                  : 'rgba(59, 130, 246, 0.12)',
              }]}>
                <Ionicons
                  name={feat.icon as any}
                  size={22}
                  color={i % 2 === 0 ? COLORS.primary : COLORS.info}
                />
              </View>
              <View style={styles.featureTextBlock}>
                <Text style={styles.featureTitle}>{feat.title}</Text>
                <Text style={styles.featureDesc}>{feat.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Plans */}
        <View style={styles.plansSection}>
          {/* Yearly — recommended */}
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'yearly' && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan('yearly')}
            activeOpacity={0.8}
          >
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>-50%</Text>
            </View>
            <View style={styles.planRadio}>
              <View style={[
                styles.planRadioInner,
                selectedPlan === 'yearly' && styles.planRadioInnerSelected,
              ]} />
            </View>
            <View style={styles.planInfo}>
              <Text style={[
                styles.planName,
                selectedPlan === 'yearly' && styles.planNameSelected,
              ]}>
                Annuel
              </Text>
              <Text style={styles.planPrice}>{PRICES.yearly.label}</Text>
              <Text style={styles.planDetail}>
                Soit 2,50 €/mois — Le plus avantageux
              </Text>
            </View>
          </TouchableOpacity>

          {/* Monthly */}
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan('monthly')}
            activeOpacity={0.8}
          >
            <View style={styles.planRadio}>
              <View style={[
                styles.planRadioInner,
                selectedPlan === 'monthly' && styles.planRadioInnerSelected,
              ]} />
            </View>
            <View style={styles.planInfo}>
              <Text style={[
                styles.planName,
                selectedPlan === 'monthly' && styles.planNameSelected,
              ]}>
                Mensuel
              </Text>
              <Text style={styles.planPrice}>{PRICES.monthly.label}</Text>
              <Text style={styles.planDetail}>Sans engagement</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleSubscribe}
          disabled={processing}
          activeOpacity={0.85}
        >
          {processing ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="diamond" size={20} color="#FFF" />
              <Text style={styles.ctaText}>
                Commencer — {selectedPlan === 'yearly' ? PRICES.yearly.label : PRICES.monthly.label}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleRestore}>
            <Text style={styles.footerLink}>Restaurer mon achat</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>
            Paiement sécurisé via l'App Store.{'\n'}
            Annulable à tout moment.
          </Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerSmallLink}>Conditions d'utilisation</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>·</Text>
            <TouchableOpacity>
              <Text style={styles.footerSmallLink}>Politique de confidentialité</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: SPACING.lg,
  },

  // Hero
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  heroIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Features
  featuresSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  featureIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextBlock: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  // Plans
  plansSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'visible',
  },
  planCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  planBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
  },
  planRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  planRadioInnerSelected: {
    backgroundColor: COLORS.primary,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  planNameSelected: {
    color: COLORS.primary,
  },
  planPrice: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 2,
  },
  planDetail: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },

  // CTA
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: SPACING.xl,
  },
  ctaText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: '#FFF',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  footerLink: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.info,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  footerText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  footerSmallLink: {
    fontSize: 11,
    color: COLORS.textMuted,
    textDecorationLine: 'underline',
  },
  footerDot: {
    fontSize: 11,
    color: COLORS.textMuted,
  },

  // Active subscription screen
  activeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginHorizontal: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: SPACING.xl,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: SPACING.lg,
  },
  activeBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 1,
  },
  activeIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  activeTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 4,
  },
  activePlan: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  activeDays: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  activeFeatures: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  featureRowActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  featureCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureActiveText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  cancelButton: {
    alignSelf: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  cancelText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.danger,
    fontWeight: '600',
  },
});
