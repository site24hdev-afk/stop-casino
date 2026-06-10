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
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { useUserData } from '../../src/hooks/useUserData';
import { useCravingLog } from '../../src/hooks/useCravingLog';
import { useSubscription } from '../../src/hooks/useSubscription';
import { useColors } from '../../src/context/ThemeContext';
import i18n, { t } from '../../src/i18n';

const { width } = Dimensions.get('window');
const BAR_WIDTH = (width - 80) / 7;

export default function StatsScreen() {
  const router = useRouter();
  const { daysSinceQuit, moneySaved, userData } = useUserData();
  const { entries, overcameCount, totalCravings, peakHour } = useCravingLog();
  const { limits } = useSubscription();
  const hasAdvanced = limits.hasAdvancedStats;
  const c = useColors();

  // Données pour le graphique d'économies (derniers 7 jours)
  const savingsChartData = React.useMemo(() => {
    const days = Math.min(daysSinceQuit, 7);
    const data: { label: string; value: number }[] = [];
    for (let i = days; i >= 0; i--) {
      const d = daysSinceQuit - i;
      const savings = d * userData.averageDailySpend;
      const dayLabel = i === 0 ? t('stats.today') : `${t('stats.dayPrefix')}${i}`;
      data.push({ label: dayLabel, value: savings });
    }
    return data;
  }, [daysSinceQuit, userData.averageDailySpend]);

  const maxSavings = Math.max(...savingsChartData.map(d => d.value), 1);

  const dayNames = i18n.t('stats.days') as unknown as string[];
  const dayStats = dayNames.map((name, i) => {
    const dayEntries = entries.filter(e => {
      const d = new Date(e.date).getDay();
      const adjusted = d === 0 ? 6 : d - 1;
      return adjusted === i;
    });
    return { name, count: dayEntries.length };
  });
  const maxDayCount = Math.max(...dayStats.map(d => d.count), 1);

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

  const successRate = totalCravings > 0
    ? Math.round((overcameCount / totalCravings) * 100)
    : 100;

  const monthProjection = userData.averageDailySpend * 30;
  const yearProjection = userData.averageDailySpend * 365;

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: c.text }]}>{t('stats.title')}</Text>
          </View>

          {/* Summary */}
          <View style={[styles.summaryCard, { backgroundColor: c.surfaceGlass }]}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNum, { color: c.text }]}>{daysSinceQuit}</Text>
              <Text style={[styles.summaryLabel, { color: c.textMuted }]}>{t('days')}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNum, { color: COLORS.primary }]}>
                {moneySaved.toLocaleString('fr-FR')} €
              </Text>
              <Text style={styles.summaryLabel}>{t('stats.saved')}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNum, { color: COLORS.info }]}>
                {successRate}%
              </Text>
              <Text style={styles.summaryLabel}>{t('stats.resistance')}</Text>
            </View>
          </View>

          {/* Graphique économies */}
          {daysSinceQuit > 0 && (
            <View style={[styles.chartCard, { backgroundColor: c.surfaceGlass }]}>
              <View style={styles.chartHeader}>
                <View style={[styles.chartIconWrap, { backgroundColor: COLORS.primaryBg }]}>
                  <Ionicons name="trending-up" size={16} color={COLORS.primary} />
                </View>
                <Text style={styles.sectionTitle}>{t('stats.savingsChart')}</Text>
              </View>
              <View style={styles.savingsChart}>
                {savingsChartData.map((point, i) => (
                  <View key={i} style={styles.savingsBarCol}>
                    <View style={styles.savingsBarContainer}>
                      <LinearGradient
                        colors={[COLORS.primary, COLORS.primaryDark]}
                        style={[
                          styles.savingsBar,
                          { height: `${Math.max((point.value / maxSavings) * 100, 4)}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.savingsBarLabel}>{point.label}</Text>
                    <Text style={styles.savingsBarValue}>{point.value}€</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Anneau de progression */}
          <View style={[styles.progressRingCard, { backgroundColor: c.surfaceGlass }]}>
            <View style={styles.ringRow}>
              {/* Taux de résistance */}
              <View style={styles.ringItem}>
                <View style={styles.ringCircle}>
                  <View style={[
                    styles.ringFill,
                    {
                      backgroundColor: successRate >= 80 ? COLORS.primary : successRate >= 50 ? COLORS.warning : COLORS.danger,
                    },
                  ]}>
                    <Text style={styles.ringPercent}>{successRate}%</Text>
                  </View>
                </View>
                <Text style={styles.ringLabel}>{t('stats.resistanceRing')}</Text>
              </View>
              {/* Objectif 30 jours */}
              <View style={styles.ringItem}>
                <View style={styles.ringCircle}>
                  <View style={[
                    styles.ringFill,
                    {
                      backgroundColor: daysSinceQuit >= 30 ? COLORS.primary : COLORS.info,
                    },
                  ]}>
                    <Text style={styles.ringPercent}>{Math.min(Math.round((daysSinceQuit / 30) * 100), 100)}%</Text>
                  </View>
                </View>
                <Text style={styles.ringLabel}>{t('stats.objective30d')}</Text>
              </View>
              {/* Objectif 365 jours */}
              <View style={styles.ringItem}>
                <View style={styles.ringCircle}>
                  <View style={[
                    styles.ringFill,
                    {
                      backgroundColor: daysSinceQuit >= 365 ? COLORS.primary : COLORS.purple,
                    },
                  ]}>
                    <Text style={styles.ringPercent}>{Math.min(Math.round((daysSinceQuit / 365) * 100), 100)}%</Text>
                  </View>
                </View>
                <Text style={styles.ringLabel}>{t('stats.objective1y')}</Text>
              </View>
            </View>
          </View>

          {/* Projections */}
          <View style={[styles.projCard, { backgroundColor: c.surfaceGlass }]}>
            <View style={styles.projHeader}>
              <View style={styles.projIconWrap}>
                <Ionicons name="trending-up" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.sectionTitle}>{t('stats.projections')}</Text>
            </View>
            <View style={styles.projRow}>
              <View style={styles.projItem}>
                <Text style={styles.projValue}>{monthProjection.toLocaleString('fr-FR')} €</Text>
                <Text style={styles.projLabel}>{t('stats.inOneMonth')}</Text>
              </View>
              <View style={styles.projItem}>
                <Text style={[styles.projValue, { color: COLORS.primary }]}>
                  {yearProjection.toLocaleString('fr-FR')} €
                </Text>
                <Text style={styles.projLabel}>{t('stats.inOneYear')}</Text>
              </View>
            </View>
          </View>

          {/* Advanced Stats */}
          {hasAdvanced ? (
            <>
              {totalCravings > 0 && (
                <View style={styles.chartCard}>
                  <View style={styles.chartHeader}>
                    <View style={[styles.chartIconWrap, { backgroundColor: COLORS.warningBg }]}>
                      <Ionicons name="calendar" size={16} color={COLORS.warning} />
                    </View>
                    <Text style={styles.sectionTitle}>{t('stats.cravingsByDay')}</Text>
                  </View>
                  <View style={styles.barChart}>
                    {dayStats.map((day, i) => (
                      <View key={i} style={styles.barCol}>
                        <View style={styles.barContainer}>
                          <LinearGradient
                            colors={day.count === maxDayCount ? [COLORS.danger, '#B91C1C'] : [COLORS.primary, COLORS.primaryDark]}
                            style={[styles.bar, { height: `${Math.max((day.count / maxDayCount) * 100, 4)}%` }]}
                          />
                        </View>
                        <Text style={styles.barLabel}>{day.name}</Text>
                        <Text style={styles.barValue}>{day.count}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {totalCravings > 0 && (
                <View style={styles.chartCard}>
                  <View style={styles.chartHeader}>
                    <View style={[styles.chartIconWrap, { backgroundColor: COLORS.infoBg }]}>
                      <Ionicons name="time" size={16} color={COLORS.info} />
                    </View>
                    <Text style={styles.sectionTitle}>{t('stats.cravingsByTime')}</Text>
                  </View>
                  {peakHour && (
                    <Text style={styles.insightText}>{t('stats.peakTime', { time: peakHour })}</Text>
                  )}
                  <View style={styles.hBars}>
                    {timeStats.map((slot, i) => (
                      <View key={i} style={styles.hBarRow}>
                        <Text style={styles.hBarLabel}>{slot.label}</Text>
                        <View style={styles.hBarBg}>
                          <LinearGradient
                            colors={slot.count === maxTimeCount ? [COLORS.warning, '#D97706'] : [COLORS.info, '#2563EB']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={[styles.hBar, { width: `${Math.max((slot.count / maxTimeCount) * 100, 4)}%` }]}
                          />
                        </View>
                        <Text style={styles.hBarValue}>{slot.count}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {topTriggers.length > 0 && (
                <View style={styles.chartCard}>
                  <View style={styles.chartHeader}>
                    <View style={[styles.chartIconWrap, { backgroundColor: COLORS.dangerBg }]}>
                      <Ionicons name="flash" size={16} color={COLORS.danger} />
                    </View>
                    <Text style={styles.sectionTitle}>{t('stats.topTriggers')}</Text>
                  </View>
                  <View style={styles.hBars}>
                    {topTriggers.map(([trigger, count], i) => (
                      <View key={i} style={styles.hBarRow}>
                        <Text style={[styles.hBarLabel, { width: 100 }]}>{trigger}</Text>
                        <View style={styles.hBarBg}>
                          <LinearGradient
                            colors={i === 0 ? [COLORS.danger, '#B91C1C'] : [COLORS.warning, '#D97706']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={[styles.hBar, { width: `${Math.max((count / maxTriggerCount) * 100, 4)}%` }]}
                          />
                        </View>
                        <Text style={styles.hBarValue}>{count}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          ) : (
            <TouchableOpacity style={styles.lockedCard} onPress={() => router.push('/abonnement')} activeOpacity={0.8}>
              <Ionicons name="lock-closed" size={32} color={COLORS.warning} />
              <Text style={styles.lockedTitle}>{t('stats.advancedLocked')}</Text>
              <Text style={styles.lockedText}>{t('stats.advancedLockedText')}</Text>
              <LinearGradient colors={GRADIENTS.menuGreen} style={styles.lockedBtn}>
                <Ionicons name="diamond" size={14} color="#FFF" />
                <Text style={styles.lockedBtnText}>{t('stats.unlockAdvanced')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {totalCravings === 0 && (
            <View style={styles.emptyCard}>
              <Ionicons name="analytics-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>{t('stats.noData')}</Text>
              <Text style={styles.emptyText}>{t('stats.noDataText')}</Text>
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING.lg },

  // Header
  header: { marginBottom: SPACING.lg },
  headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text },

  // Summary
  summaryCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surfaceGlass, borderRadius: 20, padding: SPACING.lg,
    marginBottom: SPACING.md, ...SHADOWS.sm,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, height: 40, backgroundColor: COLORS.borderLight },
  summaryNum: { fontSize: FONT_SIZE.xxl, fontWeight: '900', color: COLORS.text },
  summaryLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: 4 },

  // Projections
  projCard: {
    backgroundColor: COLORS.surfaceGlass, borderRadius: 20, padding: SPACING.lg,
    marginBottom: SPACING.md, ...SHADOWS.sm,
  },
  projHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: SPACING.md },
  projIconWrap: { width: 32, height: 32, borderRadius: 10, backgroundColor: COLORS.primaryBg, justifyContent: 'center', alignItems: 'center' },
  projRow: { flexDirection: 'row', gap: SPACING.lg },
  projItem: { flex: 1, alignItems: 'center' },
  projValue: { fontSize: FONT_SIZE.xl, fontWeight: '800', color: COLORS.primary },
  projLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: 4 },

  // Section
  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },

  // Chart cards
  chartCard: {
    backgroundColor: COLORS.surfaceGlass, borderRadius: 20, padding: SPACING.lg,
    marginBottom: SPACING.md, ...SHADOWS.sm,
  },
  chartHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: SPACING.md },
  chartIconWrap: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  insightText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginBottom: SPACING.md, fontStyle: 'italic' },

  // Vertical bars
  barChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140, marginTop: SPACING.sm },
  barCol: { alignItems: 'center', flex: 1 },
  barContainer: { height: 100, width: BAR_WIDTH - 8, justifyContent: 'flex-end', borderRadius: 6, overflow: 'hidden', backgroundColor: COLORS.surface },
  bar: { width: '100%', borderRadius: 6 },
  barLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 6 },
  barValue: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '600', marginTop: 2 },

  // Horizontal bars
  hBars: { gap: SPACING.sm },
  hBarRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  hBarLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, width: 60, textAlign: 'right' },
  hBarBg: { flex: 1, height: 24, backgroundColor: COLORS.surface, borderRadius: 6, overflow: 'hidden' },
  hBar: { height: '100%', borderRadius: 6 },
  hBarValue: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '600', width: 24 },

  // Savings chart
  savingsChart: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    height: 140, marginTop: SPACING.sm,
  },
  savingsBarCol: { alignItems: 'center', flex: 1 },
  savingsBarContainer: {
    height: 100, width: BAR_WIDTH - 8, justifyContent: 'flex-end',
    borderRadius: 6, overflow: 'hidden', backgroundColor: COLORS.primaryBg,
  },
  savingsBar: { width: '100%', borderRadius: 6 },
  savingsBarLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 6 },
  savingsBarValue: { fontSize: 9, color: COLORS.textSecondary, fontWeight: '600', marginTop: 2 },

  // Progress rings
  progressRingCard: {
    backgroundColor: COLORS.surfaceGlass, borderRadius: 20, padding: SPACING.lg,
    marginBottom: SPACING.md, ...SHADOWS.sm,
  },
  ringRow: { flexDirection: 'row', justifyContent: 'space-around' },
  ringItem: { alignItems: 'center', gap: 8 },
  ringCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center',
  },
  ringFill: {
    width: 68, height: 68, borderRadius: 34,
    justifyContent: 'center', alignItems: 'center',
  },
  ringPercent: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  ringLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, fontWeight: '600' },

  // Empty
  emptyCard: {
    backgroundColor: COLORS.surfaceGlass, borderRadius: 20, padding: SPACING.xl,
    alignItems: 'center', gap: SPACING.md, ...SHADOWS.sm,
  },
  emptyTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text },
  emptyText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },

  // Locked
  lockedCard: {
    backgroundColor: COLORS.surfaceGlass, borderRadius: 20, padding: SPACING.xl,
    alignItems: 'center', gap: SPACING.md, borderWidth: 1, borderColor: 'rgba(245,158,11,0.15)',
    borderStyle: 'dashed', ...SHADOWS.sm,
  },
  lockedTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text },
  lockedText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
  lockedBtn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    paddingHorizontal: SPACING.lg, paddingVertical: 10, borderRadius: BORDER_RADIUS.full, marginTop: SPACING.sm,
  },
  lockedBtnText: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: '#FFF' },
});
