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

const RESOURCES = [
  {
    icon: 'call',
    title: 'Joueurs Info Service',
    desc: 'Ligne d\'écoute gratuite et anonyme',
    detail: '09 74 75 13 13 — 7j/7 de 8h à 2h',
    color: COLORS.danger,
    bg: COLORS.dangerBg,
    url: 'tel:0974751313',
  },
  {
    icon: 'chatbubbles',
    title: 'Chat en ligne',
    desc: 'Parler à un conseiller par chat',
    detail: 'www.joueurs-info-service.fr',
    color: COLORS.info,
    bg: COLORS.infoBg,
    url: 'https://www.joueurs-info-service.fr',
  },
  {
    icon: 'people',
    title: 'Joueurs Anonymes France',
    desc: 'Groupes de parole et réunions',
    detail: 'Trouvez un groupe près de chez vous',
    color: COLORS.primary,
    bg: COLORS.primaryBg,
    url: 'https://www.joueursanonymes.org',
  },
  {
    icon: 'medical',
    title: 'SOS Joueurs',
    desc: 'Association d\'aide aux joueurs',
    detail: '09 69 39 55 12',
    color: COLORS.purple,
    bg: COLORS.purpleBg,
    url: 'tel:0969395512',
  },
];

const TIPS = [
  {
    emoji: '🗣️',
    title: 'Parle à quelqu\'un',
    text: 'Briser le silence est le premier pas. Confie-toi à un proche, un ami, ou appelle une ligne d\'écoute.',
  },
  {
    emoji: '📝',
    title: 'Tiens un journal',
    text: 'Note tes envies, tes déclencheurs et tes victoires. L\'écrit aide à prendre du recul.',
  },
  {
    emoji: '🏃',
    title: 'Remplace l\'habitude',
    text: 'Sport, marche, cuisine, lecture… Trouve une activité qui t\'occupe quand l\'envie monte.',
  },
  {
    emoji: '💰',
    title: 'Bloque l\'accès à l\'argent',
    text: 'Limite tes moyens de paiement. Confie ta carte à un proche si besoin.',
  },
  {
    emoji: '🚫',
    title: 'Auto-exclusion',
    text: 'Inscris-toi sur la liste des interdits de jeu. C\'est gratuit, confidentiel et réversible après 3 ans.',
  },
  {
    emoji: '🧘',
    title: 'Gère le stress autrement',
    text: 'Méditation, respiration, yoga… Le casino n\'est jamais la solution au stress.',
  },
];

const FORUMS = [
  {
    icon: 'globe',
    title: 'Forum Joueurs Info Service',
    desc: 'Espace de discussion entre joueurs et proches',
    url: 'https://www.joueurs-info-service.fr/Aide-en-ligne/Forum',
  },
  {
    icon: 'logo-reddit',
    title: 'r/problemgambling',
    desc: 'Communauté anglophone (100k+ membres)',
    url: 'https://www.reddit.com/r/problemgambling/',
  },
  {
    icon: 'logo-facebook',
    title: 'Groupes Facebook',
    desc: 'Groupes francophones d\'entraide',
    url: 'https://www.facebook.com/search/groups/?q=addiction%20jeux',
  },
];

export default function CommunauteScreen() {
  const router = useRouter();

  const openURL = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Communauté & Aide</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Intro */}
          <View style={styles.introCard}>
            <Text style={styles.introEmoji}>🤝</Text>
            <Text style={styles.introTitle}>Tu n'es pas seul</Text>
            <Text style={styles.introText}>
              Des milliers de personnes traversent la même épreuve. Des ressources gratuites et confidentielles existent pour t'aider.
            </Text>
          </View>

          {/* Lignes d'aide */}
          <Text style={styles.sectionTitle}>Lignes d'aide</Text>
          <View style={styles.resourcesList}>
            {RESOURCES.map((r, i) => (
              <TouchableOpacity
                key={i}
                style={styles.resourceCard}
                onPress={() => openURL(r.url)}
                activeOpacity={0.7}
              >
                <View style={[styles.resourceIcon, { backgroundColor: r.bg }]}>
                  <Ionicons name={r.icon as any} size={22} color={r.color} />
                </View>
                <View style={styles.resourceContent}>
                  <Text style={styles.resourceTitle}>{r.title}</Text>
                  <Text style={styles.resourceDesc}>{r.desc}</Text>
                  <Text style={[styles.resourceDetail, { color: r.color }]}>{r.detail}</Text>
                </View>
                <Ionicons name="open-outline" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Forums & communautés en ligne */}
          <Text style={styles.sectionTitle}>Forums & communautés</Text>
          <View style={styles.forumsList}>
            {FORUMS.map((f, i) => (
              <TouchableOpacity
                key={i}
                style={styles.forumCard}
                onPress={() => openURL(f.url)}
                activeOpacity={0.7}
              >
                <View style={[styles.forumIcon, { backgroundColor: COLORS.infoBg }]}>
                  <Ionicons name={f.icon as any} size={20} color={COLORS.info} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.forumTitle}>{f.title}</Text>
                  <Text style={styles.forumDesc}>{f.desc}</Text>
                </View>
                <Ionicons name="open-outline" size={16} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Conseils pratiques */}
          <Text style={styles.sectionTitle}>Conseils pratiques</Text>
          <View style={styles.tipsList}>
            {TIPS.map((tip, i) => (
              <View key={i} style={styles.tipCard}>
                <Text style={styles.tipEmoji}>{tip.emoji}</Text>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipText}>{tip.text}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Urgence */}
          <View style={styles.urgenceCard}>
            <LinearGradient colors={GRADIENTS.sos} style={styles.urgenceGradient}>
              <Ionicons name="warning" size={28} color="#FFF" />
              <Text style={styles.urgenceTitle}>En situation d'urgence ?</Text>
              <Text style={styles.urgenceText}>
                Si tu es en danger ou en détresse, appelle le 3114 (numéro national de prévention du suicide) ou le 15 (SAMU).
              </Text>
              <TouchableOpacity style={styles.urgenceBtn} onPress={() => openURL('tel:3114')}>
                <Ionicons name="call" size={18} color={COLORS.danger} />
                <Text style={styles.urgenceBtnText}>Appeler le 3114</Text>
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
