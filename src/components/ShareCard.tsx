import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

interface ShareCardProps {
  days: number;
  moneySaved: number;
  cravingsOvercome: number;
}

export default function ShareCard({ days, moneySaved, cravingsOvercome }: ShareCardProps) {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.shield}>🛡️</Text>
        <Text style={styles.appName}>Stop Casino</Text>
      </View>

      {/* Main counter */}
      <View style={styles.counterWrap}>
        <Text style={styles.counterNumber}>{days}</Text>
        <Text style={styles.counterLabel}>
          {days <= 1 ? 'jour sans casino' : 'jours sans casino'}
        </Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>💰</Text>
          <Text style={styles.statValue}>{moneySaved.toLocaleString('fr-FR')} €</Text>
          <Text style={styles.statLabel}>économisés</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>💪</Text>
          <Text style={styles.statValue}>{cravingsOvercome}</Text>
          <Text style={styles.statLabel}>envies surmontées</Text>
        </View>
      </View>

      {/* Motivational */}
      <View style={styles.motivWrap}>
        <Text style={styles.motivText}>Chaque jour compte. Je reprends le contrôle.</Text>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>Télécharge Stop Casino — 100% gratuit & privé</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    width: 340,
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  shield: { fontSize: 24 },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  counterWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  counterNumber: {
    fontSize: 72,
    fontWeight: '900',
    color: COLORS.primary,
    lineHeight: 80,
    letterSpacing: -3,
  },
  counterLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statEmoji: { fontSize: 20 },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  motivWrap: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  motivText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  footer: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
