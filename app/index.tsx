import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../src/constants/theme';
import { useUserData } from '../src/hooks/useUserData';
import { useSubscription, PLANS } from '../src/hooks/useSubscription';
import i18n, { t } from '../src/i18n';
import Onboarding from '../src/components/Onboarding';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { userData, loading, saveData, daysSinceQuit, moneySaved } = useUserData();
  const { isPaid, tier, canAccess, isElite } = useSubscription();
  const [encouragement, setEncouragement] = useState('');

  useEffect(() => {
    const quotes = i18n.t('quotes') as unknown as string[];
    const idx = Math.floor(Math.random() * quotes.length);
    setEncouragement(quotes[idx]);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingInner}>
          <Text style={styles.loadingEmoji}>🛡️</Text>
          <Text style={styles.loadingText}>Stop Casino</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData.onboarded) {
    return <Onboarding onComplete={saveData} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{t('home.greeting')} 💪</Text>
            <Text style={styles.appName} accessibilityRole="header">{t('appName')}</Text>
          </View>
          <View style={styles.headerRight}>
            {isPaid ? (
              <TouchableOpacity
                style={[styles.tierBadge, { borderColor: `${PLANS[tier === 'free' ? 'essentiel' : tier as 'essentiel' | 'pro' | 'premium' | 'elite'].color}40`, backgroundColor: `${PLANS[tier === 'free' ? 'essentiel' : tier as 'essentiel' | 'pro' | 'premium' | 'elite'].color}15` }]}
                onPress={() => router.push('/abonnement')}
                accessibilityRole="button"
                accessibilityLabel="View subscription tier"
              >
                <Ionicons name={PLANS[tier === 'free' ? 'essentiel' : tier as 'essentiel' | 'pro' | 'premium' | 'elite'].icon} size={14} color={PLANS[tier === 'free' ? 'essentiel' : tier as 'essentiel' | 'pro' | 'premium' | 'elite'].color} />
                <Text style={[styles.tierBadgeText, { color: PLANS[tier === 'free' ? 'essentiel' : tier as 'essentiel' | 'pro' | 'premium' | 'elite'].color }]}>{tier.toUpperCase()}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.proButton}
                onPress={() => router.push('/abonnement')}
                accessibilityRole="button"
                accessibilityLabel="Upgrade to Pro"
              >
                <Ionicons name="diamond" size={14} color="#F59E0B" />
                <Text style={styles.proButtonText}>PRO</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('/parametres')}
              accessibilityRole="button"
              accessibilityLabel={t('settings.title')}
            >
              <Ionicons name="settings-outline" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Compteur principal — héro */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow1} />
          <View style={styles.heroGlow2} />
          <View style={styles.heroTrophy}>
            <Ionicons name="trophy" size={32} color="#F59E0B" />
          </View>
          <Text style={styles.heroNumber}>{daysSinceQuit}</Text>
          <Text style={styles.heroLabel}>
            {daysSinceQuit <= 1 ? t('home.daySingle') : t('home.dayPlural')}
          </Text>
          {daysSinceQuit >= 7 && (
            <View style={styles.heroBadge}>
              <Ionicons name="flame" size={14} color={COLORS.warning} />
              <Text style={styles.heroBadgeText}>
                {daysSinceQuit >= 365 ? t('home.yearCount') :
                 daysSinceQuit >= 30 ? t('home.monthCount', { count: Math.floor(daysSinceQuit / 30) }) :
                 Math.floor(daysSinceQuit / 7) > 1 ? t('home.weeksCount', { count: Math.floor(daysSinceQuit / 7) }) : t('home.weekCount', { count: Math.floor(daysSinceQuit / 7) })}
              </Text>
            </View>
          )}
        </View>

        {/* Stats compactes */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
              <Ionicons name="wallet-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.statValue}>{moneySaved.toLocaleString('fr-FR')} €</Text>
            <Text style={styles.statLabel}>{t('home.saved')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.info} />
            </View>
            <Text style={[styles.statValue, { color: COLORS.info }]}>
              {userData.cravingsOvercome}
            </Text>
            <Text style={styles.statLabel}>{t('home.cravingsWon')}</Text>
          </View>
        </View>

        {/* Citation */}
        <View style={styles.quoteCard}>
          <View style={styles.quoteIconBg}>
            <Ionicons name="heart" size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.quoteText}>{encouragement}</Text>
        </View>

        {/* Gros bouton SOS */}
        <TouchableOpacity
          style={styles.sosButton}
          onPress={() => router.push('/sos')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="SOS - Urge to gamble"
        >
          <View style={styles.sosGlow} />
          <View style={styles.sosIconCircle}>
            <Ionicons name="warning" size={28} color="#FFF" />
          </View>
          <Text style={styles.sosTitle}>{t('home.sosTitle')}</Text>
          <Text style={styles.sosSubtitle}>{t('home.sosSub')}</Text>
        </TouchableOpacity>

        {/* Navigation — 2x2 grid */}
        <Text style={styles.sectionTitle}>{t('home.explore')}</Text>
        <View style={styles.navGrid}>
          {/* Journal — verrouillé en gratuit */}
          <TouchableOpacity
            style={[styles.navCard, !canAccess('journal') && styles.navCardLocked]}
            onPress={() => canAccess('journal') ? router.push('/journal') : router.push('/abonnement')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t('home.journal')}
          >
            <View style={[styles.navIconBg, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Ionicons name="book-outline" size={26} color={canAccess('journal') ? COLORS.primary : COLORS.textMuted} />
            </View>
            <View style={styles.navTitleRow}>
              <Text style={[styles.navTitle, !canAccess('journal') && styles.navTitleLocked]}>{t('home.journal')}</Text>
              {!canAccess('journal') && (
                <View style={styles.lockBadge}>
                  <Ionicons name="lock-closed" size={10} color="#F59E0B" />
                </View>
              )}
            </View>
            <Text style={styles.navDesc}>{t('home.journalDesc')}</Text>
          </TouchableOpacity>

          {/* Aide — toujours accessible (basique en gratuit) */}
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => router.push('/aide')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t('home.aide')}
          >
            <View style={[styles.navIconBg, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Ionicons name="call-outline" size={26} color={COLORS.info} />
            </View>
            <Text style={styles.navTitle}>{t('home.aide')}</Text>
            <Text style={styles.navDesc}>{canAccess('fullAide') ? t('home.aideDesc') : t('home.aideDescFree')}</Text>
          </TouchableOpacity>

          {/* Bibliothèque — verrouillé en gratuit */}
          <TouchableOpacity
            style={[styles.navCard, !canAccess('library') && styles.navCardLocked]}
            onPress={() => canAccess('library') ? router.push('/bibliotheque') : router.push('/abonnement')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t('home.library')}
          >
            <View style={[styles.navIconBg, { backgroundColor: 'rgba(167, 139, 250, 0.15)' }]}>
              <Ionicons name="library-outline" size={26} color={canAccess('library') ? '#A78BFA' : COLORS.textMuted} />
            </View>
            <View style={styles.navTitleRow}>
              <Text style={[styles.navTitle, !canAccess('library') && styles.navTitleLocked]}>{t('home.library')}</Text>
              {!canAccess('library') && (
                <View style={styles.lockBadge}>
                  <Ionicons name="lock-closed" size={10} color="#F59E0B" />
                </View>
              )}
            </View>
            <Text style={styles.navDesc}>{t('home.libraryDesc')}</Text>
          </TouchableOpacity>

          {/* Stats — verrouillé en gratuit */}
          <TouchableOpacity
            style={[styles.navCard, !canAccess('stats') && styles.navCardLocked]}
            onPress={() => canAccess('stats') ? router.push('/stats') : router.push('/abonnement')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t('home.stats')}
          >
            <View style={[styles.navIconBg, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Ionicons name="stats-chart-outline" size={26} color={canAccess('stats') ? COLORS.warning : COLORS.textMuted} />
            </View>
            <View style={styles.navTitleRow}>
              <Text style={[styles.navTitle, !canAccess('stats') && styles.navTitleLocked]}>{t('home.stats')}</Text>
              {!canAccess('stats') && (
                <View style={styles.lockBadge}>
                  <Ionicons name="lock-closed" size={10} color="#F59E0B" />
                </View>
              )}
            </View>
            <Text style={styles.navDesc}>{t('home.statsDesc')}</Text>
          </TouchableOpacity>

          {/* Jeux — Pro+ seulement */}
          <TouchableOpacity
            style={[styles.navCard, !canAccess('games') && styles.navCardLocked]}
            onPress={() => canAccess('games') ? router.push('/jeux') : router.push('/abonnement')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t('home.games')}
          >
            <View style={[styles.navIconBg, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <Ionicons name="game-controller-outline" size={26} color={canAccess('games') ? COLORS.danger : COLORS.textMuted} />
            </View>
            <View style={styles.navTitleRow}>
              <Text style={[styles.navTitle, !canAccess('games') && styles.navTitleLocked]}>{t('home.games')}</Text>
              {!canAccess('games') && (
                <View style={styles.lockBadge}>
                  <Ionicons name="lock-closed" size={10} color="#F59E0B" />
                </View>
              )}
            </View>
            <Text style={styles.navDesc}>{t('home.gamesDesc')}</Text>
          </TouchableOpacity>

          {/* Abonnement */}
          <TouchableOpacity
            style={[styles.navCard, styles.navCardPro]}
            onPress={() => router.push('/abonnement')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Subscription plans"
          >
            <View style={[styles.navIconBg, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Ionicons name="diamond" size={26} color="#F59E0B" />
            </View>
            <Text style={styles.navTitle}>{isPaid ? PLANS[tier === 'free' ? 'essentiel' : tier as 'essentiel' | 'pro' | 'premium' | 'elite'].name : t('home.unlock')}</Text>
            <Text style={styles.navDesc}>{isPaid ? t('home.manageOffer') : t('home.unlockDesc')}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingInner: {
    alignItems: 'center',
    gap: 12,
  },
  loadingEmoji: {
    fontSize: 48,
  },
  loadingText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 8 : 20,
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  proButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  proButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 0.5,
  },
  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Hero counter
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    overflow: 'hidden',
  },
  heroGlow1: {
    position: 'absolute',
    top: -60,
    left: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  heroGlow2: {
    position: 'absolute',
    bottom: -40,
    right: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(59, 130, 246, 0.06)',
  },
  heroTrophy: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroNumber: {
    fontSize: 80,
    fontWeight: '900',
    color: COLORS.primary,
    lineHeight: 88,
  },
  heroLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningBg,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    gap: 4,
  },
  heroBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.warning,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 44,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  },
  statIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  // Quote
  quoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  quoteIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontStyle: 'italic',
    lineHeight: 22,
  },

  // SOS Button
  sosButton: {
    backgroundColor: '#DC2626',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 28,
    overflow: 'hidden',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  sosGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  sosIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  sosTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  sosSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },

  // Nav section
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  navCard: {
    width: (width - 52) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  navIconBg: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  lockBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navCardPro: {
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  navCardLocked: {
    opacity: 0.6,
  },
  navTitleLocked: {
    color: COLORS.textMuted,
  },
  navDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
    borderWidth: 1,
  },
  tierBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
