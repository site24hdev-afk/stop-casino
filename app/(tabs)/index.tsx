import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, GRADIENTS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { useUserData } from '../../src/hooks/useUserData';
import { useSubscription, PLANS } from '../../src/hooks/useSubscription';
import { useBadges } from '../../src/hooks/useBadges';
import i18n, { t } from '../../src/i18n';
import Onboarding from '../../src/components/Onboarding';

// Citations encourageantes pour la rechute
const RELAPSE_QUOTES = [
  "Tomber, c'est humain. Se relever, c'est héroïque.",
  "Chaque jour est une nouvelle chance de recommencer.",
  "Le courage, ce n'est pas de ne jamais tomber, c'est de se relever à chaque fois.",
  "Tu n'as pas perdu tout ton progrès. Tu as gagné de l'expérience.",
  "La rechute fait partie du chemin. L'abandon, jamais.",
  "Un faux pas ne définit pas ton parcours. Continue d'avancer.",
  "Les plus grandes victoires viennent après les plus dures batailles.",
  "Pardonne-toi. Puis recommence, plus fort qu'avant.",
  "Ce qui compte, ce n'est pas combien de fois tu tombes, mais combien de fois tu te relèves.",
  "Aujourd'hui est le premier jour du reste de ta vie sans casino.",
];

export default function HomeScreen() {
  const router = useRouter();
  const { userData, loading, saveData, daysSinceQuit, moneySaved, handleRelapse } = useUserData();
  const { isPaid, tier, canAccess } = useSubscription();
  const { newBadge, dismissNewBadge, allBadges, unlockedCount, totalCount } = useBadges(
    daysSinceQuit, moneySaved, userData.cravingsOvercome
  );
  const [encouragement, setEncouragement] = useState('');
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [showRelapseModal, setShowRelapseModal] = useState(false);
  const [relapseQuote, setRelapseQuote] = useState('');
  const [relapseConfirmed, setRelapseConfirmed] = useState(false);

  useEffect(() => {
    const quotes = i18n.t('quotes') as unknown as string[];
    const idx = Math.floor(Math.random() * quotes.length);
    setEncouragement(quotes[idx]);
  }, []);

  // Afficher le modal célébration quand un nouveau badge est débloqué
  useEffect(() => {
    if (newBadge) {
      setShowBadgeModal(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [newBadge]);

  const openRelapseModal = () => {
    const idx = Math.floor(Math.random() * RELAPSE_QUOTES.length);
    setRelapseQuote(RELAPSE_QUOTES[idx]);
    setRelapseConfirmed(false);
    setShowRelapseModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const confirmRelapse = async () => {
    await handleRelapse();
    setRelapseConfirmed(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const closeRelapseModal = () => {
    setShowRelapseModal(false);
    setRelapseConfirmed(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
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
      <SafeAreaView style={styles.safeArea} edges={['top']}>
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
            {isPaid ? (
              <TouchableOpacity
                style={[styles.tierBadge, { borderColor: `${PLANS[tierKey].color}40`, backgroundColor: `${PLANS[tierKey].color}10` }]}
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
          </View>

          {/* ═══ Hero Counter ═══ */}
          <View style={styles.heroCard}>
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
          </View>

          {/* ═══ Bouton J'ai rejoué ═══ */}
          <TouchableOpacity
            style={styles.relapseBtn}
            onPress={openRelapseModal}
            activeOpacity={0.6}
          >
            <Ionicons name="refresh" size={14} color={COLORS.textMuted} />
            <Text style={styles.relapseBtnText}>J'ai rejoué</Text>
          </TouchableOpacity>

          {/* ═══ Quick Stats ═══ */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statDot, { backgroundColor: COLORS.primary }]} />
              <Text style={[styles.statValue, { color: COLORS.primary }]}>
                {moneySaved.toLocaleString('fr-FR')} €
              </Text>
              <Text style={styles.statLabel}>{t('home.saved')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <View style={[styles.statDot, { backgroundColor: COLORS.info }]} />
              <Text style={[styles.statValue, { color: COLORS.info }]}>
                {userData.cravingsOvercome}
              </Text>
              <Text style={styles.statLabel}>{t('home.cravingsWon')}</Text>
            </View>
          </View>

          {/* ═══ Badges ═══ */}
          <View style={styles.badgesSection}>
            <View style={styles.badgesHeader}>
              <Text style={styles.badgesTitle}>Récompenses</Text>
              <Text style={styles.badgesCount}>{unlockedCount}/{totalCount}</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.badgesScroll}
            >
              {allBadges.map((badge) => (
                <View
                  key={badge.id}
                  style={[
                    styles.badgeItem,
                    !badge.unlocked && styles.badgeItemLocked,
                  ]}
                >
                  <View style={[styles.badgeEmoji, { backgroundColor: badge.unlocked ? badge.colorBg : COLORS.surface }]}>
                    <Text style={{ fontSize: 24, opacity: badge.unlocked ? 1 : 0.3 }}>
                      {badge.emoji}
                    </Text>
                  </View>
                  <Text
                    style={[styles.badgeLabel, !badge.unlocked && { color: COLORS.textMuted }]}
                    numberOfLines={1}
                  >
                    {badge.title}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

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

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* ═══ Modal Rechute ═══ */}
        <Modal
          visible={showRelapseModal}
          transparent
          animationType="fade"
          onRequestClose={closeRelapseModal}
        >
          <View style={styles.relapseOverlay}>
            <View style={styles.relapseModal}>
              {!relapseConfirmed ? (
                <>
                  {/* Encouragement avant confirmation */}
                  <View style={styles.relapseEmojiWrap}>
                    <Text style={styles.relapseEmoji}>🤝</Text>
                  </View>
                  <Text style={styles.relapseTitle}>C'est pas grave</Text>
                  <Text style={styles.relapseSubtitle}>
                    La rechute fait partie du parcours. L'important, c'est que tu sois là, prêt à recommencer.
                  </Text>
                  <View style={styles.relapseQuoteCard}>
                    <View style={styles.relapseQuoteBar} />
                    <Text style={styles.relapseQuoteText}>« {relapseQuote} »</Text>
                  </View>
                  <TouchableOpacity style={styles.relapseConfirmBtn} onPress={confirmRelapse}>
                    <Text style={styles.relapseConfirmText}>Repartir de zéro</Text>
                    <Ionicons name="refresh" size={18} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.relapseCancelBtn} onPress={closeRelapseModal}>
                    <Text style={styles.relapseCancelText}>Annuler</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {/* Message après confirmation */}
                  <View style={styles.relapseEmojiWrap}>
                    <Text style={styles.relapseEmoji}>💪</Text>
                  </View>
                  <Text style={[styles.relapseTitle, { color: COLORS.primary }]}>
                    C'est reparti !
                  </Text>
                  <Text style={styles.relapseSubtitle}>
                    Ton compteur est remis à zéro. Chaque nouveau jour compte. Tu es plus fort que tu ne le crois.
                  </Text>
                  <View style={styles.relapseQuoteCard}>
                    <View style={[styles.relapseQuoteBar, { backgroundColor: COLORS.primary }]} />
                    <Text style={styles.relapseQuoteText}>« {relapseQuote} »</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.relapseConfirmBtn, { backgroundColor: COLORS.primary }]}
                    onPress={closeRelapseModal}
                  >
                    <Text style={styles.relapseConfirmText}>Continuer</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFF" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* ═══ Modal Célébration Badge ═══ */}
        <Modal
          visible={showBadgeModal && newBadge !== null}
          transparent
          animationType="fade"
          onRequestClose={() => { setShowBadgeModal(false); dismissNewBadge(); }}
        >
          <View style={styles.relapseOverlay}>
            <View style={styles.relapseModal}>
              <View style={[styles.relapseEmojiWrap, { backgroundColor: newBadge?.colorBg ?? COLORS.primaryBg }]}>
                <Text style={{ fontSize: 48 }}>{newBadge?.emoji}</Text>
              </View>
              <Text style={styles.badgeCelebTitle}>🎉 Nouveau badge !</Text>
              <Text style={[styles.relapseTitle, { color: newBadge?.color ?? COLORS.primary, fontSize: 22 }]}>
                {newBadge?.title}
              </Text>
              <Text style={styles.relapseSubtitle}>
                {newBadge?.description}
              </Text>
              <TouchableOpacity
                style={[styles.relapseConfirmBtn, { backgroundColor: newBadge?.color ?? COLORS.primary }]}
                onPress={() => { setShowBadgeModal(false); dismissNewBadge(); }}
              >
                <Text style={styles.relapseConfirmText}>Super !</Text>
                <Ionicons name="sparkles" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 8 : 16, paddingBottom: 20 },

  // Loading
  loadingContainer: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', gap: 14 },
  loadingEmoji: { fontSize: 52 },
  loadingText: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  appName: { fontSize: 28, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  greeting: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop: 2 },
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

  // Hero
  heroCard: {
    borderRadius: 24, paddingVertical: 28, paddingHorizontal: 24, alignItems: 'center',
    marginBottom: 14, backgroundColor: COLORS.surfaceGlass,
    overflow: 'hidden', ...SHADOWS.md,
  },
  heroTrophy: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(245,158,11,0.12)', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  heroNumber: { fontSize: 68, fontWeight: '900', color: COLORS.primary, lineHeight: 76, letterSpacing: -3 },
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
    marginBottom: 14, ...SHADOWS.sm,
  },
  statCard: { flex: 1, alignItems: 'center', gap: 4 },
  statDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 2 },
  statValue: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },
  statDivider: { width: 1, height: 36, backgroundColor: COLORS.borderLight },

  // Quote
  quoteCard: {
    flexDirection: 'row', gap: 12,
    backgroundColor: COLORS.surfaceGlass, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16,
    marginBottom: 24, ...SHADOWS.sm,
  },
  quoteBar: { width: 3, borderRadius: 2, backgroundColor: COLORS.primary, alignSelf: 'stretch' },
  quoteText: { flex: 1, fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 20 },

  // Menu
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 12, letterSpacing: -0.3 },
  menuList: { gap: 6 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.surfaceGlass, borderRadius: 16, padding: 14,
    ...SHADOWS.sm,
  },
  menuItemGold: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(245,158,11,0.06)', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: 'rgba(245,158,11,0.15)',
  },
  menuIcon: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  menuTextWrap: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  menuDesc: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: 2 },
  menuLock: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(245,158,11,0.12)', justifyContent: 'center', alignItems: 'center',
  },

  // Relapse button
  relapseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(156,163,175,0.08)',
  },
  relapseBtnText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },

  // Relapse modal
  relapseOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  relapseModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 28,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  relapseEmojiWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(245,158,11,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  relapseEmoji: {
    fontSize: 40,
  },
  relapseTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  relapseSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 20,
  },
  relapseQuoteCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(245,158,11,0.06)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
    width: '100%',
  },
  relapseQuoteBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: COLORS.warning,
    alignSelf: 'stretch',
  },
  relapseQuoteText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  relapseConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.warning,
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 32,
    width: '100%',
    marginBottom: 12,
    shadowColor: COLORS.warning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  relapseConfirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  relapseCancelBtn: {
    paddingVertical: 8,
  },
  relapseCancelText: {
    fontSize: 15,
    color: COLORS.textMuted,
    fontWeight: '500',
  },

  // Badges section
  badgesSection: {
    marginBottom: 14,
  },
  badgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  badgesCount: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  badgesScroll: {
    gap: 10,
    paddingRight: 8,
  },
  badgeItem: {
    alignItems: 'center',
    width: 72,
    gap: 6,
  },
  badgeItemLocked: {
    opacity: 0.5,
  },
  badgeEmoji: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },

  // Badge celebration
  badgeCelebTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
});
