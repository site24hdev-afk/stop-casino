import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../src/constants/theme';
import { useUserData } from '../src/hooks/useUserData';
import { useCravingLog } from '../src/hooks/useCravingLog';
import i18n, { t } from '../src/i18n';

const { width } = Dimensions.get('window');
const BAR_WIDTH = (width - 80) / 7;

export default function StatsScreen() {
  const router = useRouter();
  const { daysSinceQuit, moneySaved, userData } = useUserData();
  const { entries, overcameCount, totalCravings, peakHour } = useCravingLog();

  // Stats par jour de la semaine
  const dayNames = i18n.t('stats.days') as unknown as string[];
  const dayStats = dayNames.map((name, i) => {
    const dayEntries = entries.filter(e => {
      const d = new Date(e.date).getDay();
      // JS: 0=dim, 1=lun... on convertit
      const adjusted = d === 0 ? 6 : d - 1;
      return adjusted === i;
    });
    return { name, count: dayEntries.length };
  });
  const maxDayCount = Math.max(...dayStats.map(d => d.count), 1);

  // Stats par heure (tranches de 4h)
  const timeSlots = [
    { label: '0h-6h', range: [0, 6] },
    { label: '6h-12h', range: [6, 12] },
    { label: '12h-18h', range: [12, 18] },
    { label: '18h-0h', range: [18, 24] },
  ];
  const timeStats = timeSlots.map(slot => {
    const count = entries.filter(e => {
      const h = new Date(e.date).getHours();
      return h >= slot.range[0] && h < slot.range[1];
    }).length;
    return { ...slot, count };
  });
  const maxTimeCount = Math.max(...timeStats.map(t => t.count), 1);

  // Déclencheurs fréquents
  const triggerCounts: Record<string, number> = {};
  entries.forEach(e => {
    if (e.trigger && e.trigger !== 'Non précisé') {
      triggerCounts[e.trigger] = (triggerCounts[e.trigger] || 0) + 1;
    }
  });
  const topTriggers = Object.entries(triggerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const maxTriggerCount = topTriggers.length > 0 ? topTriggers[0][1] : 1;

  // Streak actuel (jours consécutifs sans rechute)
  const successRate = totalCravings > 0
    ? Math.round((overcameCount / totalCravings) * 100)
    : 100;

  // Argent projeté
  const monthProjection = userData.averageDailySpend * 30;
  const yearProjection = userData.averageDailySpend * 365;

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('stats.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Grande carte résumé */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{daysSinceQuit}</Text>
            <Text style={styles.summaryLabel}>{t('days')}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: COLORS.primary }]}>
              {moneySaved.toLocaleString('fr-FR')} €
            </Text>
            <Text style={styles.summaryLabel}>{t('stats.saved')}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: COLORS.info }]}>
              {successRate}%
            </Text>
            <Text style={styles.summaryLabel}>{t('stats.resistance')}</Text>
          </View>
        </View>
      </View>

      {/* Projections */}
      <View style={styles.projectionCard}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="trending-up" size={18} color={COLORS.primary} />
          {'  '}{t('stats.projections')}
        </Text>
        <View style={styles.projectionRow}>
          <View style={styles.projectionItem}>
            <Text style={styles.projectionValue}>
              {monthProjection.toLocaleString('fr-FR')} €
            </Text>
            <Text style={styles.projectionLabel}>{t('stats.inOneMonth')}</Text>
          </View>
          <View style={styles.projectionItem}>
            <Text style={[styles.projectionValue, { color: COLORS.primaryLight }]}>
              {yearProjection.toLocaleString('fr-FR')} €
            </Text>
            <Text style={styles.projectionLabel}>{t('stats.inOneYear')}</Text>
          </View>
        </View>
      </View>

      {/* Envies par jour */}
      {totalCravings > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.warning} />
            {'  '}{t('stats.cravingsByDay')}
          </Text>
          <View style={styles.barChart}>
            {dayStats.map((day, i) => (
              <View key={i} style={styles.barColumn}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${(day.count / maxDayCount) * 100}%`,
                        backgroundColor: day.count === maxDayCount ? COLORS.danger : COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{day.name}</Text>
                <Text style={styles.barValue}>{day.count}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Envies par tranche horaire */}
      {totalCravings > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="time-outline" size={18} color={COLORS.info} />
            {'  '}{t('stats.cravingsByTime')}
          </Text>
          {peakHour && (
            <Text style={styles.insightText}>
              {t('stats.peakTime', { time: peakHour })}
            </Text>
          )}
          <View style={styles.horizontalBars}>
            {timeStats.map((slot, i) => (
              <View key={i} style={styles.hBarRow}>
                <Text style={styles.hBarLabel}>{slot.label}</Text>
                <View style={styles.hBarContainer}>
                  <View
                    style={[
                      styles.hBar,
                      {
                        width: `${(slot.count / maxTimeCount) * 100}%`,
                        backgroundColor: slot.count === maxTimeCount ? COLORS.warning : COLORS.info,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.hBarValue}>{slot.count}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Déclencheurs */}
      {topTriggers.length > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="flash-outline" size={18} color={COLORS.danger} />
            {'  '}{t('stats.topTriggers')}
          </Text>
          <View style={styles.horizontalBars}>
            {topTriggers.map(([trigger, count], i) => (
              <View key={i} style={styles.hBarRow}>
                <Text style={[styles.hBarLabel, { width: 100 }]}>{trigger}</Text>
                <View style={styles.hBarContainer}>
                  <View
                    style={[
                      styles.hBar,
                      {
                        width: `${(count / maxTriggerCount) * 100}%`,
                        backgroundColor: i === 0 ? COLORS.danger : COLORS.warning,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.hBarValue}>{count}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Message si pas de données */}
      {totalCravings === 0 && (
        <View style={styles.emptyCard}>
          <Ionicons name="analytics-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>{t('stats.noData')}</Text>
          <Text style={styles.emptyText}>{t('stats.noDataText')}</Text>
        </View>
      )}

      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
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
  // Summary
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  summaryNumber: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
    color: COLORS.text,
  },
  summaryLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  // Projections
  projectionCard: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  projectionRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    gap: SPACING.lg,
  },
  projectionItem: {
    flex: 1,
    alignItems: 'center',
  },
  projectionValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  projectionLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  // Charts
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  insightText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    fontStyle: 'italic',
  },
  insightHighlight: {
    color: COLORS.warning,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  // Vertical bars
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    marginTop: SPACING.sm,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 100,
    width: BAR_WIDTH - 8,
    justifyContent: 'flex-end',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  barValue: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  // Horizontal bars
  horizontalBars: {
    gap: SPACING.sm,
  },
  hBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  hBarLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    width: 60,
    textAlign: 'right',
  },
  hBarContainer: {
    flex: 1,
    height: 24,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  hBar: {
    height: '100%',
    borderRadius: 4,
    minWidth: 4,
  },
  hBarValue: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
    width: 24,
  },
  // Empty
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptyText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
