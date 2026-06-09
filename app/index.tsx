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
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../src/constants/theme';
import { useUserData } from '../src/hooks/useUserData';
import { useSubscription, PLANS } from '../src/hooks/useSubscription';
import i18n, { t } from '../src/i18n';
import Onboarding from '../src/components/Onboarding';

const { width } = Dimensions.get('window');
const CARD_W = (width - 56) / 2;

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

  const tierKey = tier === 'free' ? 'essentiel' : tier as 'essentiel' | 'pro' | 'premium' | 'elite';

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={GRADIENTS.screenBg}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* ═══ Header ═══ */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{t('home.greeting')} 💪</Text>
              <Text style={styles.appName} accessibilityRole="header">{t('appName')}</Text>
            </View>
            <View style={styles.headerRight}>
              {isPaid ? (
                <TouchableOpacity
                  style={[styles.tierBadge, { borderColor: `${PLANS[tierKey].color}50`, backgroundColor: `${PLANS[tierKey].color}18` }]}
                  onPress={() => router.push('/abonnement')}
                  accessibilityRole="button"
                  accessibilityLabel="View subscription tier"
                >
                  <Ionicons name={PLANS[tierKey].icon} size={13} color={PLANS[tierKey].color} />
                  <Text style={[styles.tierBadgeText, { color: PLANS[tierKey].color }]}>{tier.toUpperCase()}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.proButton}
                  onPress={() => router.push('/abonnement')}
                  accessibilityRole="button"
                  accessibilityLabel="Upgrade to Pro"
                >
                  <Ionicons name="diamond" size={13} color="#F59E0B" />
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

          {/* ═══ Hero Counter ═══ */}
          <LinearGradient
            colors={GRADIENTS.heroCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            {/* Decorative glow circles */}
            <View style={styles.heroGlow1} />
            <View style={styles.heroGlow2} />

            <View style={styles.heroTrophy}>
              <Ionicons name="trophy" size={28} color="#F59E0B" />
            </View>
            <Text style={styles.heroNumber}>{daysSinceQuit}</Text>
            <Text style={styles.heroLabel}>
              {daysSinceQuit <= 1 ? t('home.daySingle') : t('home.dayPlural')}
            </Text>
            {daysSinceQuit >= 7 && (
              <View style={styles.heroBadge}>
                <Ionicons name="flame" size={13} color={COLORS.warning} />
                <Text style={styles.heroBadgeText}>
                  {daysSinceQuit >= 365 ? t('home.yearCount') :
                   daysSinceQuit >= 30 ? t('home.monthCount', { count: Math.floor(daysSinceQuit / 30) }) :
                   Math.floor(daysSinceQuit / 7) > 1 ? t('home.weeksCount', { count: Math.floor(daysSinceQuit / 7) }) : t('home.weekCount', { count: Math.floor(daysSinceQuit / 7) })}
                </Text>
              </View>
            )}
          </LinearGradient>

          {/* ═══ Stats compactes ═══ */}
          <View style={styles.statsRow}>
            <LinearGradient
              colors={GRADIENTS.green}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statIconBg}>
                <Ionicons name="wallet" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.statValue}>{moneySaved.toLocaleString('fr-FR')} €</Text>
              <Text style={styles.statLabel}>{t('home.saved')}</Text>
            </LinearGradient>

            <LinearGradient
              colors={GRADIENTS.blue}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={[styles.statIconBg, { backgroundColor: 'rgba(59,130,246,0.15)' }]}>
                <Ionicons name="shield-checkmark" size={18} color={COLORS.info} />
              </View>
              <Text style={[styles.statValue, { color: COLORS.infoLight }]}>
                {userData.cravingsOvercome}
              </Text>
              <Text style={styles.statLabel}>{t('home.cravingsWon')}</Text>
            </LinearGradient>
          </View>

          {/* ═══ Citation ═══ */}
          <View style={styles.quoteCard}>
            <View style={styles.quoteAccent} />
            <Text style={styles.quoteText}>{encouragement}</Text>
          </View>

          {/* ═══ SOS Button ═══ */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/sos')}
            accessibilityRole="button"
            accessibilityLabel="SOS - Urge to gamble"
          >
            <LinearGradient
              colors={GRADIENTS.sos}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sosButton}
            >
              <View style={styles.sosGlow} />
              <View style={styles.sosContent}>
                <View style={styles.sosIconCircle}>
                  <Ionicons name="warning" size={24} color="#FFF" />
                </View>
                <View style={styles.sosTextWrap}>
                  <Text style={styles.sosTitle}>{t('home.sosTitle')}</Text>
                  <Text style={styles.sosSubtitle}>{t('home.sosSub')}</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.6)" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* ═══ Navigation Grid ═══ */}
          <Text style={styles.sectionTitle}>{t('home.explore')}</Text>
          <View style={styles.navGrid}>
            {/* Journal */}
            <NavCard
              icon="book"
              iconColor={COLORS.primary}
              gradient={GRADIENTS.green}
              title={t('home.journal')}
              desc={t('home.journalDesc')}
              locked={!canAccess('journal')}
              onPress={() => canAccess('journal') ? router.push('/journal') : router.push('/abonnement')}
            />
            {/* Aide */}
            <NavCard
              icon="call"
              iconColor={COLORS.info}
              gradient={GRADIENTS.blue}
              title={t('home.aide')}
              desc={canAccess('fullAide') ? t('home.aideDesc') : t('home.aideDescFree')}
              onPress={() => router.push('/aide')}
            />
            {/* Bibliothèque */}
            <NavCard
              icon="library"
              iconColor={COLORS.purple}
              gradient={GRADIENTS.purple}
              title={t('home.library')}
              desc={t('home.libraryDesc')}
              locked={!canAccess('library')}
              onPress={() => canAccess('library') ? router.push('/bibliotheque') : router.push('/abonnement')}
            />
            {/* Statistiques */}
            <NavCard
              icon="stats-chart"
              iconColor={COLORS.warning}
              gradient={GRADIENTS.amber}
              title={t('home.stats')}
              desc={t('home.statsDesc')}
              locked={!canAccess('stats')}
              onPress={() => canAccess('stats') ? router.push('/stats') : router.push('/abonnement')}
            />
            {/* Jeux */}
            <NavCard
              icon="game-controller"
              iconColor={COLORS.danger}
              gradient={GRADIENTS.sosSoft}
              title={t('home.games')}
              desc={t('home.gamesDesc')}
              locked={!canAccess('games')}
              onPress={() => canAccess('games') ? router.push('/jeux') : router.push('/abonnement')}
            />
            {/* Abonnement */}
            <TouchableOpacity
              style={[styles.navCard]}
              onPress={() => router.push('/abonnement')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Subscription plans"
            >
              <LinearGradient
                colors={['rgba(245,158,11,0.18)', 'rgba(245,158,11,0.04)']}
                style={styles.navCardInner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={[styles.navIconBg, { backgroundColor: 'rgba(245,158,11,0.18)' }]}>
                  <Ionicons name="diamond" size={24} color="#F59E0B" />
                </View>
                <Text style={styles.navTitle}>
                  {isPaid ? PLANS[tierKey].name : t('home.unlock')}
                </Text>
                <Text style={styles.navDesc}>
                  {isPaid ? t('home.manageOffer') : t('home.unlockDesc')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ═══ Composant NavCard ═══ */
function NavCard({ icon, iconColor, gradient, title, desc, locked, onPress }: {
  icon: string;
  iconColor: string;
  gradient: readonly [string, string];
  title: string;
  desc: string;
  locked?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.navCard, locked && { opacity: 0.5 }]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <LinearGradient
        colors={gradient as any}
        style={styles.navCardInner}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.navIconBg, { backgroundColor: `${iconColor}20` }]}>
          <Ionicons name={icon as any} size={24} color={locked ? COLORS.textMuted : iconColor} />
        </View>
        <View style={styles.navTitleRow}>
          <Text style={[styles.navTitle, locked && { color: COLORS.textMuted }]}>{title}</Text>
          {locked && (
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={9} color="#F59E0B" />
            </View>
          )}
        </View>
        <Text style={styles.navDesc}>{desc}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
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
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 4 : 16,
    paddingBottom: 40,
  },

  // ═══ Header ═══
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  greeting: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  appName: {
    fontSize: 24,
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
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  proButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 0.5,
  },
  settingsButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceGlass,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
  },
  tierBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // ═══ Hero Counter ═══
  heroCard: {
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  heroGlow1: {
    position: 'absolute',
    top: -50,
    left: -20,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  heroGlow2: {
    position: 'absolute',
    bottom: -30,
    right: -10,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(59, 130, 246, 0.06)',
  },
  heroTrophy: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  heroNumber: {
    fontSize: FONT_SIZE.giant,
    fontWeight: '900',
    color: COLORS.primaryLight,
    lineHeight: 80,
    letterSpacing: -2,
  },
  heroLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,158,11,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  heroBadgeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.warning,
  },

  // ═══ Stats Row ═══
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(16,185,129,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primaryLight,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },

  // ═══ Quote ═══
  quoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceGlass,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 12,
  },
  quoteAccent: {
    width: 3,
    height: 32,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  quoteText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },

  // ═══ SOS Button ═══
  sosButton: {
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 24,
    overflow: 'hidden',
    ...SHADOWS.lg,
    shadowColor: '#EF4444',
  },
  sosGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  sosContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  sosIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosTextWrap: {
    flex: 1,
  },
  sosTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.3,
  },
  sosSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },

  // ═══ Nav Section ═══
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  navCard: {
    width: CARD_W,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  navCardInner: {
    padding: 16,
    gap: 6,
  },
  navIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  navTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  lockBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navDesc: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    lineHeight: 15,
  },
});
