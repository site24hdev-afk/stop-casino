import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { t } from '../i18n';

type BetType = 'rouge' | 'noir' | 'pair' | 'impair' | 'number';

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

interface Bet {
  type: BetType;
  label: string;
  number?: number;
}

export default function RouletteGame() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [bet, setBet] = useState<Bet | null>(null);
  const [won, setWon] = useState<boolean | null>(null);
  const [stats, setStats] = useState({ wins: 0, losses: 0 });
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const spinAnim = useRef(new Animated.Value(0)).current;

  const spin = () => {
    if (!bet) return;

    setSpinning(true);
    setWon(null);
    setResult(null);

    // Animation
    spinAnim.setValue(0);
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      // Résultat aléatoire 0-36
      const num = Math.floor(Math.random() * 37);
      setResult(num);
      setSpinning(false);

      const isRed = RED_NUMBERS.includes(num);
      const isEven = num > 0 && num % 2 === 0;

      let playerWon = false;
      if (bet.type === 'rouge') playerWon = isRed;
      else if (bet.type === 'noir') playerWon = num > 0 && !isRed;
      else if (bet.type === 'pair') playerWon = isEven;
      else if (bet.type === 'impair') playerWon = num > 0 && !isEven;
      else if (bet.type === 'number') playerWon = num === bet.number;

      // Le 0 fait perdre tout le monde (sauf mise sur numéro 0)
      if (num === 0 && bet.type !== 'number') playerWon = false;

      setWon(playerWon);
      setStats(prev => ({
        wins: prev.wins + (playerWon ? 1 : 0),
        losses: prev.losses + (playerWon ? 0 : 1),
      }));
    });
  };

  const getNumberColor = (n: number): string => {
    if (n === 0) return '#059669';
    return RED_NUMBERS.includes(n) ? '#DC2626' : '#1a1a1a';
  };

  const rotation = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1440deg'],
  });

  const total = stats.wins + stats.losses;
  const winRate = total > 0 ? Math.round((stats.wins / total) * 100) : 0;

  return (
    <View style={styles.container}>
      {/* Roue */}
      <View style={styles.wheelContainer}>
        <Animated.View
          style={[styles.wheel, { transform: [{ rotate: rotation }] }]}
        >
          <View style={styles.wheelInner}>
            {result !== null && !spinning ? (
              <>
                <Text style={[styles.wheelNumber, { color: getNumberColor(result) }]}>
                  {result}
                </Text>
                <Text style={styles.wheelLabel}>
                  {result === 0 ? t('roulette.zero') : RED_NUMBERS.includes(result) ? t('roulette.red') : t('roulette.black')}
                </Text>
              </>
            ) : (
              <Text style={styles.wheelPlaceholder}>
                {spinning ? '...' : '?'}
              </Text>
            )}
          </View>
        </Animated.View>
      </View>

      {/* Résultat */}
      {won !== null && (
        <View style={[styles.resultCard, won ? styles.winCard : styles.loseCard]}>
          <Text style={styles.resultText}>
            {won
              ? t('roulette.youWin')
              : result === 0
                ? t('roulette.zeroLose')
                : t('roulette.youLose')}
          </Text>
          {total >= 5 && (
            <Text style={styles.statsHint}>
              {t('roulette.statsLine', { total, winRate })}
              {bet?.type !== 'number'
                ? ` ${t('roulette.theoretic48')}`
                : ` ${t('roulette.theoretic2')}`}
            </Text>
          )}
        </View>
      )}

      {/* Paris */}
      <View style={styles.betSection}>
        <Text style={styles.betLabel}>{t('roulette.chooseBet')}</Text>

        <View style={styles.betRow}>
          <TouchableOpacity
            style={[
              styles.betButton,
              styles.redBet,
              bet?.type === 'rouge' && styles.betActive,
            ]}
            onPress={() => setBet({ type: 'rouge', label: t('roulette.red') })}
          >
            <Text style={styles.betText}>{t('roulette.red')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.betButton,
              styles.blackBet,
              bet?.type === 'noir' && styles.betActive,
            ]}
            onPress={() => setBet({ type: 'noir', label: t('roulette.black') })}
          >
            <Text style={styles.betText}>{t('roulette.black')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.betRow}>
          <TouchableOpacity
            style={[
              styles.betButton,
              styles.evenBet,
              bet?.type === 'pair' && styles.betActive,
            ]}
            onPress={() => setBet({ type: 'pair', label: t('roulette.even') })}
          >
            <Text style={styles.betText}>{t('roulette.even')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.betButton,
              styles.oddBet,
              bet?.type === 'impair' && styles.betActive,
            ]}
            onPress={() => setBet({ type: 'impair', label: t('roulette.odd') })}
          >
            <Text style={styles.betText}>{t('roulette.odd')}</Text>
          </TouchableOpacity>
        </View>

        {/* Numéros */}
        <View style={styles.numbersGrid}>
          {Array.from({ length: 37 }, (_, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.numberButton,
                { backgroundColor: getNumberColor(i) },
                bet?.type === 'number' && bet.number === i && styles.numberActive,
              ]}
              onPress={() => setBet({ type: 'number', label: `N°${i}`, number: i })}
            >
              <Text style={styles.numberText}>{i}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bouton spin */}
      <TouchableOpacity
        style={[styles.spinButton, (!bet || spinning) && styles.spinDisabled]}
        onPress={spin}
        disabled={!bet || spinning}
      >
        <Text style={styles.spinText}>
          {spinning ? t('roulette.spinning') : bet ? `${t('roulette.spin')} (${bet.label})` : t('roulette.chooseBet')}
        </Text>
      </TouchableOpacity>

      {/* Stats session */}
      <View style={styles.sessionStats}>
        <Text style={styles.sessionText}>
          {t('blackjack.w')}: {stats.wins} | {t('blackjack.l')}: {stats.losses}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: SPACING.md,
  },
  // Wheel
  wheelContainer: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  wheel: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: COLORS.surface,
    borderWidth: 4,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelInner: {
    alignItems: 'center',
  },
  wheelNumber: {
    fontSize: 40,
    fontWeight: '900',
  },
  wheelLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  wheelPlaceholder: {
    fontSize: 40,
    fontWeight: '900',
    color: COLORS.textMuted,
  },
  // Result
  resultCard: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 4,
  },
  winCard: {
    backgroundColor: COLORS.primaryBg,
  },
  loseCard: {
    backgroundColor: COLORS.dangerBg,
  },
  resultText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  statsHint: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Bets
  betSection: {
    gap: SPACING.sm,
  },
  betLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  betRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  betButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  betActive: {
    borderColor: COLORS.primaryLight,
  },
  redBet: { backgroundColor: '#7F1D1D' },
  blackBet: { backgroundColor: '#1a1a1a' },
  evenBet: { backgroundColor: COLORS.surface },
  oddBet: { backgroundColor: COLORS.surface },
  betText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: '#FFF',
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    justifyContent: 'center',
  },
  numberButton: {
    width: 34,
    height: 30,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberActive: {
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
  },
  numberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  // Spin
  spinButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  spinDisabled: {
    opacity: 0.5,
  },
  spinText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: '#FFF',
  },
  // Session
  sessionStats: {
    alignItems: 'center',
  },
  sessionText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
});
