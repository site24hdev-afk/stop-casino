import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../src/constants/theme';
import { useUserData } from '../src/hooks/useUserData';
import { t } from '../src/i18n';
import BlackjackGame from '../src/components/BlackjackGame';
import RouletteGame from '../src/components/RouletteGame';

export default function JeuxScreen() {
  const router = useRouter();
  const { game } = useLocalSearchParams<{ game?: string }>();
  const { userData } = useUserData();
  const [selectedGame, setSelectedGame] = useState<string | null>(game || null);
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [sessionStart] = useState(Date.now());
  const [showReminder, setShowReminder] = useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const mins = Math.floor((Date.now() - sessionStart) / 60000);
      setSessionMinutes(mins);
      if (mins > 0 && mins % 5 === 0) { setShowReminder(true); }
    }, 60000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  const estimatedLoss = Math.round(sessionMinutes * (userData.averageDailySpend / 60));

  // Reminder screen
  if (showReminder) {
    return (
      <View style={styles.root}>
        <LinearGradient colors={GRADIENTS.screenBg} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.centeredContainer}>
          <View style={styles.reminderCard}>
            <View style={styles.reminderIconWrap}>
              <Ionicons name="time" size={44} color={COLORS.warning} />
            </View>
            <Text style={styles.reminderTitle}>{t('games.reminderTitle')}</Text>
            <Text style={styles.reminderText}>
              {t('games.reminderText', { mins: sessionMinutes })}{' '}
              <Text style={styles.reminderAmount}>{estimatedLoss} €</Text>.
            </Text>
            <TouchableOpacity onPress={() => router.back()} style={{ borderRadius: BORDER_RADIUS.lg, overflow: 'hidden', width: '100%', marginTop: SPACING.md }}>
              <LinearGradient colors={GRADIENTS.menuGreen} style={styles.reminderBtn}>
                <Text style={styles.reminderBtnText}>{t('games.stopPlaying')}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.continueBtn} onPress={() => setShowReminder(false)}>
              <Text style={styles.continueText}>{t('games.continuePlay')}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Game selection
  if (!selectedGame) {
    return (
      <View style={styles.root}>
        <LinearGradient colors={GRADIENTS.screenBg} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('games.title')}</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.warningCard}>
            <View style={[styles.warningIcon, { backgroundColor: COLORS.warningBg }]}>
              <Ionicons name="information-circle" size={20} color={COLORS.warning} />
            </View>
            <Text style={styles.warningText}>{t('games.warning')}</Text>
          </View>

          <TouchableOpacity style={styles.gameCard} onPress={() => setSelectedGame('blackjack')} activeOpacity={0.7}>
            <View style={styles.gameIcon}>
              <Text style={styles.gameEmoji}>🃏</Text>
            </View>
            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle}>{t('games.blackjack')}</Text>
              <Text style={styles.gameDesc}>{t('games.blackjackDesc')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.gameCard} onPress={() => setSelectedGame('roulette')} activeOpacity={0.7}>
            <View style={styles.gameIcon}>
              <Text style={styles.gameEmoji}>🎰</Text>
            </View>
            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle}>{t('games.roulette')}</Text>
              <Text style={styles.gameDesc}>{t('games.rouletteDesc')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          {sessionMinutes > 0 && (
            <View style={styles.timerBadge}>
              <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
              <Text style={styles.timerText}>{t('games.session', { mins: sessionMinutes, cost: estimatedLoss })}</Text>
            </View>
          )}
        </SafeAreaView>
      </View>
    );
  }

  // In-game
  return (
    <View style={styles.root}>
      <LinearGradient colors={GRADIENTS.screenBg} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedGame(null)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {selectedGame === 'blackjack' ? t('games.blackjack') : t('games.roulette')}
          </Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="close" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {selectedGame === 'blackjack' ? <BlackjackGame /> : <RouletteGame />}

        {sessionMinutes > 0 && (
          <View style={styles.timerBadge}>
            <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.timerText}>{t('games.session', { mins: sessionMinutes, cost: estimatedLoss })}</Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: SPACING.lg },
  centeredContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: SPACING.xl },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  backBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: COLORS.surfaceGlass, borderWidth: 1, borderColor: COLORS.borderLight, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text },

  // Warning
  warningCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(245,158,11,0.06)', borderRadius: 18, padding: 16,
    marginBottom: SPACING.xl, borderWidth: 1, borderColor: 'rgba(245,158,11,0.12)',
  },
  warningIcon: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  warningText: { flex: 1, fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, lineHeight: 22 },

  // Game cards
  gameCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.surfaceGlass, borderRadius: 18, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: COLORS.borderGlass,
  },
  gameIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  gameEmoji: { fontSize: 28 },
  gameInfo: { flex: 1 },
  gameTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  gameDesc: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
  timerBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: SPACING.md },
  timerText: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },

  // Reminder
  reminderCard: {
    backgroundColor: COLORS.surfaceGlass, borderRadius: 24, padding: SPACING.xl,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.borderGlass,
  },
  reminderIconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.warningBg, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg,
  },
  reminderTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.sm },
  reminderText: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 26 },
  reminderAmount: { color: COLORS.danger, fontWeight: '800' },
  reminderBtn: { paddingVertical: 16, alignItems: 'center' },
  reminderBtnText: { fontSize: FONT_SIZE.md, fontWeight: '700', color: '#FFF' },
  continueBtn: { paddingVertical: SPACING.md },
  continueText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
});
