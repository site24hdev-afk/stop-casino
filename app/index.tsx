import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../src/constants/theme';
import { ENCOURAGEMENTS } from '../src/constants/messages';
import { useUserData } from '../src/hooks/useUserData';
import Onboarding from '../src/components/Onboarding';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { userData, loading, saveData, daysSinceQuit, moneySaved } = useUserData();
  const [encouragement, setEncouragement] = useState('');

  useEffect(() => {
    const idx = Math.floor(Math.random() * ENCOURAGEMENTS.length);
    setEncouragement(ENCOURAGEMENTS[idx]);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="shield-checkmark" size={48} color={COLORS.primary} />
      </View>
    );
  }

  if (!userData.onboarded) {
    return <Onboarding onComplete={saveData} />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.appName}>Stop Casino</Text>
            <Text style={styles.subtitle}>Ton compagnon de liberté</Text>
          </View>
          <TouchableOpacity
            style={styles.journalButton}
            onPress={() => router.push('/journal')}
          >
            <Ionicons name="book-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Compteur principal */}
      <View style={styles.counterCard}>
        <View style={styles.counterGlow} />
        <Text style={styles.counterLabel}>Jours sans casino</Text>
        <Text style={styles.counterNumber}>{daysSinceQuit}</Text>
        <Text style={styles.counterUnit}>
          {daysSinceQuit <= 1 ? 'jour' : 'jours'}
        </Text>
        {daysSinceQuit >= 7 && (
          <View style={styles.badge}>
            <Ionicons name="trophy" size={14} color={COLORS.warning} />
            <Text style={styles.badgeText}>
              {daysSinceQuit >= 365 ? '1 an !' :
               daysSinceQuit >= 30 ? `${Math.floor(daysSinceQuit / 30)} mois !` :
               `${Math.floor(daysSinceQuit / 7)} semaine${Math.floor(daysSinceQuit / 7) > 1 ? 's' : ''} !`}
            </Text>
          </View>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: COLORS.primaryBg }]}>
          <Ionicons name="wallet-outline" size={24} color={COLORS.primary} />
          <Text style={styles.statValue}>{moneySaved.toLocaleString('fr-FR')} €</Text>
          <Text style={styles.statLabel}>Économisés</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: COLORS.infoBg }]}>
          <Ionicons name="fitness-outline" size={24} color={COLORS.info} />
          <Text style={[styles.statValue, { color: COLORS.info }]}>
            {userData.cravingsOvercome}
          </Text>
          <Text style={styles.statLabel}>Envies surmontées</Text>
        </View>
      </View>

      {/* Encouragement */}
      <View style={styles.encouragementCard}>
        <Ionicons name="heart" size={20} color={COLORS.primaryLight} />
        <Text style={styles.encouragementText}>{encouragement}</Text>
      </View>

      {/* Bouton SOS */}
      <TouchableOpacity
        style={styles.sosButton}
        onPress={() => router.push('/sos')}
        activeOpacity={0.8}
      >
        <View style={styles.sosInner}>
          <Ionicons name="alert-circle" size={32} color="#FFF" />
          <Text style={styles.sosText}>SOS Envie</Text>
          <Text style={styles.sosSubtext}>Appuie ici si tu as envie de jouer</Text>
        </View>
      </TouchableOpacity>

      {/* Actions rapides */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/aide')}
        >
          <View style={[styles.actionIcon, { backgroundColor: COLORS.infoBg }]}>
            <Ionicons name="call" size={20} color={COLORS.info} />
          </View>
          <Text style={styles.actionText}>Aide</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/journal')}
        >
          <View style={[styles.actionIcon, { backgroundColor: COLORS.warningBg }]}>
            <Ionicons name="book-outline" size={20} color={COLORS.warning} />
          </View>
          <Text style={styles.actionText}>Journal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/bibliotheque')}
        >
          <View style={[styles.actionIcon, { backgroundColor: 'rgba(167, 139, 250, 0.12)' }]}>
            <Ionicons name="library-outline" size={20} color="#A78BFA" />
          </View>
          <Text style={styles.actionText}>Lire</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/stats')}
        >
          <View style={[styles.actionIcon, { backgroundColor: COLORS.primaryBg }]}>
            <Ionicons name="stats-chart" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.actionText}>Stats</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  journalButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Compteur
  counterCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    overflow: 'hidden',
  },
  counterGlow: {
    position: 'absolute',
    top: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primaryBg,
  },
  counterLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  counterNumber: {
    fontSize: 72,
    fontWeight: '900',
    color: COLORS.primary,
    lineHeight: 80,
  },
  counterUnit: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningBg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.md,
    gap: 6,
  },
  badgeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.warning,
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  // Encouragement
  encouragementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  encouragementText: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  // SOS
  sosButton: {
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  sosInner: {
    backgroundColor: COLORS.danger,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sosText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
  },
  sosSubtext: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  // Actions rapides
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
});
