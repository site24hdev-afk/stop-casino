import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SPACING, FONT_SIZE, SHADOWS } from '../src/constants/theme';
import { useColors, useTheme } from '../src/context/ThemeContext';
import { t } from '../src/i18n';

const RESOURCES = [
  {
    icon: 'call',
    titleKey: 'communaute.joueurs',
    descKey: 'communaute.joueursDesc',
    detailKey: 'communaute.joueursDetail',
    color: COLORS.danger,
    bg: COLORS.dangerBg,
    url: 'tel:0974751313',
  },
  {
    icon: 'chatbubbles',
    titleKey: 'communaute.chatOnline',
    descKey: 'communaute.chatDesc',
    detailKey: 'communaute.chatDetail',
    color: COLORS.info,
    bg: COLORS.infoBg,
    url: 'https://www.joueurs-info-service.fr',
  },
  {
    icon: 'people',
    titleKey: 'communaute.joueursAnonymes',
    descKey: 'communaute.jaDesc',
    detailKey: 'communaute.jaDetail',
    color: COLORS.primary,
    bg: COLORS.primaryBg,
    url: 'https://www.joueursanonymes.org',
  },
  {
    icon: 'medical',
    titleKey: 'communaute.sosJoueurs',
    descKey: 'communaute.sosDesc',
    detailKey: 'communaute.sosDetail',
    color: COLORS.purple,
    bg: COLORS.purpleBg,
    url: 'tel:0969395512',
  },
];

const TIPS = [
  { emoji: '🗣️', titleKey: 'communaute.tipTalk', textKey: 'communaute.tipTalkText' },
  { emoji: '📝', titleKey: 'communaute.tipJournal', textKey: 'communaute.tipJournalText' },
  { emoji: '🏃', titleKey: 'communaute.tipReplace', textKey: 'communaute.tipReplaceText' },
  { emoji: '💰', titleKey: 'communaute.tipMoney', textKey: 'communaute.tipMoneyText' },
  { emoji: '🚫', titleKey: 'communaute.tipExclude', textKey: 'communaute.tipExcludeText' },
  { emoji: '🧘', titleKey: 'communaute.tipStress', textKey: 'communaute.tipStressText' },
];

const FORUMS = [
  {
    icon: 'globe',
    titleKey: 'communaute.forumJIS',
    descKey: 'communaute.forumJISDesc',
    url: 'https://www.joueurs-info-service.fr/Aide-en-ligne/Forum',
  },
  {
    icon: 'logo-reddit',
    titleKey: 'communaute.reddit',
    descKey: 'communaute.redditDesc',
    url: 'https://www.reddit.com/r/problemgambling/',
  },
  {
    icon: 'logo-facebook',
    titleKey: 'communaute.facebook',
    descKey: 'communaute.facebookDesc',
    url: 'https://www.facebook.com/search/groups/?q=addiction%20jeux',
  },
];

export default function CommunauteScreen() {
  const router = useRouter();
  const c = useColors();
  const { isDark } = useTheme();

  const openURL = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.surfaceGlass, borderColor: c.borderLight }]}>
            <Ionicons name="arrow-back" size={22} color={c.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.text }]}>{t('communaute.title')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Intro */}
          <View style={[styles.introCard, { backgroundColor: c.surfaceGlass }]}>
            <Text style={styles.introEmoji}>🤝</Text>
            <Text style={[styles.introTitle, { color: c.text }]}>{t('communaute.intro')}</Text>
            <Text style={[styles.introText, { color: c.textSecondary }]}>
              {t('communaute.introText')}
            </Text>
          </View>

          {/* Lignes d'aide */}
          <Text style={[styles.sectionTitle, { color: c.text }]}>{t('communaute.helpLines')}</Text>
          <View style={styles.resourcesList}>
            {RESOURCES.map((r, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.resourceCard, { backgroundColor: c.surfaceGlass }]}
                onPress={() => openURL(r.url)}
                activeOpacity={0.7}
              >
                <View style={[styles.resourceIcon, { backgroundColor: r.bg }]}>
                  <Ionicons name={r.icon as any} size={22} color={r.color} />
                </View>
                <View style={styles.resourceContent}>
                  <Text style={[styles.resourceTitle, { color: c.text }]}>{t(r.titleKey)}</Text>
                  <Text style={[styles.resourceDesc, { color: c.textSecondary }]}>{t(r.descKey)}</Text>
                  <Text style={[styles.resourceDetail, { color: r.color }]}>{t(r.detailKey)}</Text>
                </View>
                <Ionicons name="open-outline" size={18} color={c.textMuted} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Forums & communautés en ligne */}
          <Text style={[styles.sectionTitle, { color: c.text }]}>{t('communaute.forums')}</Text>
          <View style={styles.forumsList}>
            {FORUMS.map((f, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.forumCard, { backgroundColor: c.surfaceGlass }]}
                onPress={() => openURL(f.url)}
                activeOpacity={0.7}
              >
                <View style={[styles.forumIcon, { backgroundColor: c.infoBg }]}>
                  <Ionicons name={f.icon as any} size={20} color={c.info} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.forumTitle, { color: c.text }]}>{t(f.titleKey)}</Text>
                  <Text style={[styles.forumDesc, { color: c.textMuted }]}>{t(f.descKey)}</Text>
                </View>
                <Ionicons name="open-outline" size={16} color={c.textMuted} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Conseils pratiques */}
          <Text style={[styles.sectionTitle, { color: c.text }]}>{t('communaute.tips')}</Text>
          <View style={styles.tipsList}>
            {TIPS.map((tip, i) => (
              <View key={i} style={[styles.tipCard, { backgroundColor: c.surfaceGlass }]}>
                <Text style={styles.tipEmoji}>{tip.emoji}</Text>
                <View style={styles.tipContent}>
                  <Text style={[styles.tipTitle, { color: c.text }]}>{t(tip.titleKey)}</Text>
                  <Text style={[styles.tipText, { color: c.textSecondary }]}>{t(tip.textKey)}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Urgence */}
          <View style={styles.urgenceCard}>
            <LinearGradient colors={GRADIENTS.sos} style={styles.urgenceGradient}>
              <Ionicons name="warning" size={28} color="#FFF" />
              <Text style={styles.urgenceTitle}>{t('communaute.emergency')}</Text>
              <Text style={styles.urgenceText}>
                {t('communaute.emergencyText')}
              </Text>
              <TouchableOpacity style={styles.urgenceBtn} onPress={() => openURL('tel:3114')}>
                <Ionicons name="call" size={18} color={COLORS.danger} />
                <Text style={styles.urgenceBtnText}>{t('communaute.call3114')}</Text>
              </TouchableOpacity>
            </LinearGradient>
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
  content: { paddingHorizontal: SPACING.lg, paddingBottom: 20 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.lg, marginBottom: SPACING.md,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 14, backgroundColor: COLORS.surfaceGlass,
    borderWidth: 1, borderColor: COLORS.borderLight, justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text },

  // Intro
  introCard: {
    backgroundColor: COLORS.surfaceGlass, borderRadius: 20, padding: SPACING.xl,
    alignItems: 'center', marginBottom: SPACING.lg, ...SHADOWS.sm,
  },
  introEmoji: { fontSize: 40, marginBottom: SPACING.sm },
  introTitle: { fontSize: FONT_SIZE.xl, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.sm },
  introText: {
    fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22,
  },

  // Section
  sectionTitle: {
    fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text,
    marginBottom: SPACING.md, marginTop: SPACING.sm,
  },

  // Resources
  resourcesList: { gap: 10, marginBottom: SPACING.lg },
  resourceCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.surfaceGlass, borderRadius: 18, padding: 16, ...SHADOWS.sm,
  },
  resourceIcon: {
    width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center',
  },
  resourceContent: { flex: 1 },
  resourceTitle: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  resourceDesc: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  resourceDetail: { fontSize: FONT_SIZE.xs, fontWeight: '600', marginTop: 4 },

  // Forums
  forumsList: { gap: 8, marginBottom: SPACING.lg },
  forumCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surfaceGlass, borderRadius: 16, padding: 14, ...SHADOWS.sm,
  },
  forumIcon: {
    width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
  },
  forumTitle: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text },
  forumDesc: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: 2 },

  // Tips
  tipsList: { gap: 10, marginBottom: SPACING.lg },
  tipCard: {
    flexDirection: 'row', gap: 14,
    backgroundColor: COLORS.surfaceGlass, borderRadius: 18, padding: 16, ...SHADOWS.sm,
  },
  tipEmoji: { fontSize: 28, marginTop: 2 },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  tipText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, lineHeight: 20 },

  // Urgence
  urgenceCard: {
    borderRadius: 20, overflow: 'hidden', marginTop: SPACING.sm,
  },
  urgenceGradient: {
    padding: SPACING.xl, alignItems: 'center', gap: SPACING.sm,
  },
  urgenceTitle: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: '#FFF' },
  urgenceText: {
    fontSize: FONT_SIZE.sm, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 22,
  },
  urgenceBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFF', borderRadius: 14, paddingHorizontal: 20, paddingVertical: 12,
    marginTop: SPACING.sm,
  },
  urgenceBtnText: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.danger },
});
