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
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../src/constants/theme';
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

  // Timer de jeu — toutes les 5 minutes, rappel doux
  React.useEffect(() => {
    const interval = setInterval(() => {
      const mins = Math.floor((Date.now() - sessionStart) / 60000);
      setSessionMinutes(mins);
      if (mins > 0 && mins % 5 === 0) {
        setShowReminder(true);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  const estimatedLoss = Math.round(sessionMinutes * (userData.averageDailySpend / 60));

  if (showReminder) {
    return (
      <SafeAreaView style={styles.reminderContainer}>
        <View style={styles.reminderCard}>
          <Ionicons name="time-outline" size={48} color={COLORS.warning} />
          <Text style={styles.reminderTitle}>{t('games.reminderTitle')}</Text>
          <Text style={styles.reminderText}>
            {t('games.reminderText', { mins: sessionMinutes })}{' '}
            <Text style={styles.reminderAmount}>{estimatedLoss} €</Text>.
          </Text>
          <TouchableOpacity
            style={styles.reminderButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Stop playing"
          >
            <Text style={styles.reminderButtonText}>{t('games.stopPlaying')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => setShowReminder(false)}
            accessibilityRole="button"
            accessibilityLabel="Continue playing"
          >
            <Text style={styles.continueText}>{t('games.continuePlay')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!selectedGame) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityRole="button" accessibilityLabel={t('back')}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} accessibilityRole="header">{t('games.title')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.warningCard}>
          <Ionicons name="information-circle" size={24} color={COLORS.warning} />
          <Text style={styles.warningText}>{t('games.warning')}</Text>
        </View>

        <TouchableOpacity
          style={styles.gameCard}
          onPress={() => setSelectedGame('blackjack')}
          accessibilityRole="button"
          accessibilityLabel="Play Blackjack"
        >
          <View style={styles.gameIcon}>
            <Text style={styles.gameEmoji}>🃏</Text>
          </View>
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>{t('games.blackjack')}</Text>
            <Text style={styles.gameDesc}>{t('games.blackjackDesc')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gameCard}
          onPress={() => setSelectedGame('roulette')}
          accessibilityRole="button"
          accessibilityLabel="Play Roulette"
        >
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
            <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.timerText}>
              {t('games.session', { mins: sessionMinutes, cost: estimatedLoss })}
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectedGame(null)} accessibilityRole="button" accessibilityLabel={t('back')}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} accessibilityRole="header">
          {selectedGame === 'blackjack' ? t('games.blackjack') : t('games.roulette')}
        </Text>
        <TouchableOpacity onPress={() => router.back()} accessibilityRole="button" accessibilityLabel={t('close')}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {selectedGame === 'blackjack' ? (
        <BlackjackGame />
      ) : (
        <RouletteGame />
      )}

      {sessionMinutes > 0 && (
        <View style={styles.timerBadge}>
          <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.timerText}>
            {t('games.session', { mins: sessionMinutes, cost: estimatedLoss })}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.warningBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  warningText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  gameIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameEmoji: {
    fontSize: 28,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  gameDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: SPACING.md,
  },
  timerText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  // Reminder
  reminderContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  reminderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.md,
  },
  reminderTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  reminderText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  reminderAmount: {
    color: COLORS.danger,
    fontWeight: '800',
  },
  reminderButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.md,
  },
  reminderButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: '#FFF',
  },
  continueButton: {
    paddingVertical: SPACING.sm,
  },
  continueText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
});
