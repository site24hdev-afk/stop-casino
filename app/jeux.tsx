import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../src/constants/theme';
import { useUserData } from '../src/hooks/useUserData';
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
      <View style={styles.reminderContainer}>
        <View style={styles.reminderCard}>
          <Ionicons name="time-outline" size={48} color={COLORS.warning} />
          <Text style={styles.reminderTitle}>Petit rappel</Text>
          <Text style={styles.reminderText}>
            Tu joues depuis {sessionMinutes} minutes.{'\n\n'}
            En vrai casino, ça t'aurait coûté environ{' '}
            <Text style={styles.reminderAmount}>{estimatedLoss} €</Text>.
          </Text>
          <TouchableOpacity
            style={styles.reminderButton}
            onPress={() => router.back()}
          >
            <Text style={styles.reminderButtonText}>J'arrête, merci</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => setShowReminder(false)}
          >
            <Text style={styles.continueText}>Continuer encore un peu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!selectedGame) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Jeux simulés</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.warningCard}>
          <Ionicons name="information-circle" size={24} color={COLORS.warning} />
          <Text style={styles.warningText}>
            Ces jeux sont sans argent réel ni monnaie virtuelle.
            Ils sont là pour te montrer que le casino gagne toujours.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.gameCard}
          onPress={() => setSelectedGame('blackjack')}
        >
          <View style={styles.gameIcon}>
            <Text style={styles.gameEmoji}>🃏</Text>
          </View>
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>Blackjack</Text>
            <Text style={styles.gameDesc}>
              Essaie d'approcher 21 sans dépasser
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gameCard}
          onPress={() => setSelectedGame('roulette')}
        >
          <View style={styles.gameIcon}>
            <Text style={styles.gameEmoji}>🎰</Text>
          </View>
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>Roulette</Text>
            <Text style={styles.gameDesc}>
              Rouge, noir, pair, impair...
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        {sessionMinutes > 0 && (
          <View style={styles.timerBadge}>
            <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.timerText}>
              Session : {sessionMinutes} min · ~{estimatedLoss} € en vrai casino
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectedGame(null)}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedGame === 'blackjack' ? 'Blackjack' : 'Roulette'}
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
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
            {sessionMinutes} min · ~{estimatedLoss} € en vrai casino
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
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
