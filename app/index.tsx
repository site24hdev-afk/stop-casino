import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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

export default function HomeScreen() {
  const router = useRouter();
  const { userData, loading, saveData, daysSinceQuit, moneySaved } = useUserData();
  const { isPaid, tier, canAccess } = useSubscription();
  const [encouragement, setEncouragement] = useState('');

  useEffect(() => {
    const quotes = i18n.t('quotes') as unknown as string[];
    const idx = Math.floor(Math.random() * quotes.length);
    setEncouragement(quotes[idx]);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={GRADIENTS.screenBg} style={StyleSheet.absoluteFill} />
        <Text style={styles.loadingEmoji}>🛡️</Text>
        <Text style={styles.loadingText}>Stop Casino</Text>
      </View>
    );
  }

  if (!userData.onboarded) {
    return <Onboarding onComplete={saveData} />;
  }

  const tierKey = tier === 'free' ? 'essentiel' : tier as 'essentiel' | 'pro' | 'premium' | 'elite';

  const menuItems = [
    {
      icon: 'book' as const,
      title: t('home.journal'),
      desc: t('home.journalDesc'),
      gradient: GRADIENTS.menuGreen,
      locked: !canAccess('journal'),
      onPress: () => canAccess('journal') ? router.push('/journal') : router.push('/abonnement'),
    },
    {
      icon: 'call' as const,
      title: t('home.aide'),
      desc: canAccess('fullAide') ? t('home.aideDesc') : t('home.aideDescFree'),
      gradient: GRADIENTS.menuBlue,
      locked: false,
      onPress: () => router.push('/aide'),
    },
    {
      icon: 'library' as const,
      title: t('home.library'),
      desc: t('home.libraryDesc'),
      gradient: GRADIENTS.menuPurple,
      locked: !canAccess('library'),
      onPress: () => canAccess('library') ? router.push('/bibliotheque') : router.push('/abonnement'),
    },
    {
      icon: 'stats-chart' as const,
      title: t('home.stats'),
      desc: t('home.statsDesc'),
      gradient: GRADIENTS.menuAmber,
      locked: !canAccess('stats'),
      onPress: () => canAccess('stats') ? router.push('/stats') : router.push('/abonnement'),
    },
    {
      icon: 'game-controller' as const,
      title: t('home.games'),
      desc: t('home.gamesDesc'),
      gradient: GRADIENTS.menuRed,
      locked: !canAccess('games'),
      onPress: () => canAccess('games') ? router.push('/jeux') : router.push('/abonnement'),
    },
  ];

  return (
    <View style={styles.root}>
      <LinearGradient colors={GRADIENTS.screenBg} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* ═══ Header ═══ */}
          <View style={styles.header}>
            <View>
              <Text style={styles.appName} accessibilityRole="header">Stop Casino</Text>
              <Text style={styles.greeting}>{t('home.greeting')} 💪</Text>
            </View>
            <View style={styles.headerRight}>
              {isPaid ? (
                <TouchableOpacity
                  style={[styles.tierBadge, { borderColor: `${PLANS[tierKey].color}40`, backgroundColor: `${PLANS[tierKey].color}15` }]}
                  onPress={() => router.push('/abonnement')}
                >
                  <Ionicons name={PLANS[tierKey].icon} size={14} color={PLANS[tierKey].color} />
                  <Text style={[styles.tierText, { color: PLANS[tierKey].color }]}>{tier.toUpperCase()}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.proBadge} onPress={() => router.push('/abonnement')}>
                  <Ionicons name="diamond" size={14} color="#F59E0B" />
                  <Text style={styles.proText}>PRO</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/parametres')}>
                <Ionicons name="cog" size={21} color={COLORS.textMuted} />
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
            <View style={styles.heroGlow1} />
            <View style={styles.heroGlow2} />
            <View style={styles.heroTrophy}>
              <Ionicons name="trophy" size={24} color="#F59E0B" />
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

          {/* ═══ Quick Stats ═══ */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statDot, { backgroundColor: COLORS.primary }]} />
              <Text style={[styles.statValue, { color: COLORS.primaryLight }]}>
                {moneySaved.toLocaleString('fr-FR')} €
              </Text>
              <Text style={styles.statLabel}>{t('home.saved')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <View style={[styles.statDot, { backgroundColor: COLORS.info }]} />
              <Text style={[styles.statValue, { color: COLORS.infoLight }]}>
                {userData.cravingsOvercome}
              </Text>
              <Text style={styles.statLabel}>{t('home.cravingsWon')}</Text>
            </View>
          </View>

          {/* ═══ SOS Button ═══ */}
          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/sos')}>
            <LinearGradient
              colors={GRADIENTS.sos}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.sosBtn}
            >
              <View style={styles.sosGlow} />
              <View style={styles.sosRow}>
                <View style={styles.sosIconWrap}>
                  <Ionicons name="warning" size={26} color="#FFF" />
                </View>
                <View style={styles.sosTextWrap}>
                  <Text style={styles.sosTitle}>{t('home.sosTitle')}</Text>
                  <Text style={styles.sosSub}>{t('home.sosSub')}</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.5)" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* ═══ Quote ═══ */}
          <View style={styles.quoteCard}>
            <View style={styles.quoteBar} />
            <Text style={styles.quoteText}>{encouragement}</Text>
          </View>

          {/* ═══ Menu ═══ */}
          <Text style={styles.sectionTitle}>{t('home.explore')}</Text>
          <View style={styles.menuList}>
            {menuItems.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.menuItem, item.locked && { opacity: 0.45 }]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <LinearGradient colors={item.gradient as any} style={styles.menuIcon}>
                  <Ionicons name={item.icon} size={22} color="#FFF" />
                </LinearGradient>
                <View style={styles.menuTextWrap}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDesc} numberOfLines={1}>{item.desc}</Text>
                </View>
                {item.locked ? (
                  <View style={styles.menuLock}>
                    <Ionicons name="lock-closed" size={12} color="#F59E0B" />
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                )}
              </TouchableOpacity>
            ))}

            {/* Abonnement */}
            <TouchableOpacity
              style={styles.menuItemGold}
              onPress={() => router.push('/abonnement')}
              activeOpacity={0.7}
            >
              <LinearGradient colors={GRADIENTS.menuAmber} style={styles.menuIcon}>
                <Ionicons name="diamond" size={22} color="#FFF" />
              </LinearGradient>
              <View style={styles.menuTextWrap}>
                <Text style={styles.menuTitle}>
                  {isPaid ? PLANS[tierKey].name : t('home.unlock')}
                </Text>
                <Text style={styles.menuDesc} numberOfLines={1}>
                  {isPaid ? t('home.manageOffer') : t('home.unlockDesc')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#F59E0B" />
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 8 : 16, paddingBottom: 40 },

  // Loading
  loadingContainer: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', gap: 14 },
  loadingEmoji: { fontSize: 52 },
  loadingText: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  appName: { fontSize: 28, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  greeting: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  proBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(245,158,11,0.10)', paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 14, borderWidth: 1, borderColor: 'rgba(245,158,11,0.20)',
  },
  proText: { fontSize: 12, fontWeight: '800', color: '#F59E0B', letterSpacing: 0.5 },
  tierBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14, borderWidth: 1,
  },
  tierText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  settingsBtn: {
    width: 40, height: 40, borderRadius: 14,
    backgroundColor: COLORS.surfaceGlass, borderWidth: 1, borderColor: COLORS.borderLight,
    justifyContent: 'center', alignItems: 'center',
  },

  // Hero
  heroCard: {
    borderRadius: 24, paddingVertical: 28, paddingHorizontal: 24, alignItems: 'center',
    marginBottom: 14, borderWidth: 1, borderColor: 'rgba(16,185,129,0.12)',
    overflow: 'hidden', ...SHADOWS.md,
  },
  heroGlow1: { position: 'absolute', top: -40, left: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(16,185,129,0.08)' },
  heroGlow2: { position: 'absolute', bottom: -30, right: -10, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(59,130,246,0.06)' },
  heroTrophy: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(245,158,11,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  heroNumber: { fontSize: 68, fontWeight: '900', color: COLORS.primaryLight, lineHeight: 76, letterSpacing: -3 },
  heroLabel: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, letterSpacing: 0.5, marginTop: 2 },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(245,158,11,0.10)', paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, marginTop: 10, borderWidth: 1, borderColor: 'rgba(245,158,11,0.18)',
  },
  heroBadgeText: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.warning },

  // Stats
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surfaceGlass, borderRadius: 20, padding: 18,
    marginBottom: 14, borderWidth: 1, borderColor: COLORS.borderLight,
  },
  statCard: { flex: 1, alignItems: 'center', gap: 4 },
  statDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 2 },
  statValue: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },
  statDivider: { width: 1, height: 36, backgroundColor: COLORS.borderLight },

  // SOS
  sosBtn: {
    borderRadius: 20, paddingVertical: 18, paddingHorizontal: 20, marginBottom: 14,
    overflow: 'hidden', ...SHADOWS.lg, shadowColor: '#EF4444',
  },
  sosGlow: { position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.07)' },
  sosRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  sosIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center' },
  sosTextWrap: { flex: 1 },
  sosTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', letterSpacing: 0.3 },
  sosSub: { fontSize: FONT_SIZE.xs, color: 'rgba(255,255,255,0.60)', marginTop: 3 },

  // Quote
  quoteCard: {
    flexDirection: 'row', gap: 12,
    backgroundColor: COLORS.surfaceGlass, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16,
    marginBottom: 24, borderWidth: 1, borderColor: COLORS.borderLight,
  },
  quoteBar: { width: 3, borderRadius: 2, backgroundColor: COLORS.primary, alignSelf: 'stretch' },
  quoteText: { flex: 1, fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 20 },

  // Menu
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 12, letterSpacing: -0.3 },
  menuList: { gap: 6 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.surfaceGlass, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: COLORS.borderLight,
  },
  menuItemGold: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(245,158,11,0.06)', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: 'rgba(245,158,11,0.12)',
  },
  menuIcon: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  menuTextWrap: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  menuDesc: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: 2 },
  menuLock: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(245,158,11,0.12)', justifyContent: 'center', alignItems: 'center',
  },
});
