import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../src/constants/theme';
import { useUserData } from '../src/hooks/useUserData';
import { useColors } from '../src/context/ThemeContext';
import { t } from '../src/i18n';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function HistoriqueScreen() {
  const router = useRouter();
  const { relapseHistory, daysSinceQuit, moneySaved, userData } = useUserData();
  const c = useColors();

  const bestStreak = relapseHistory.length > 0
    ? Math.max(daysSinceQuit, ...relapseHistory.map(e => e.days))
    : daysSinceQuit;

  const totalSaved = relapseHistory.reduce((sum, e) => sum + e.moneySaved, 0) + moneySaved;
  const totalDays = relapseHistory.reduce((sum, e) => sum + e.days, 0) + daysSinceQuit;

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/stats')} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={c.text} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.headerTitle, { color: c.text }]}>{t('history.title')}</Text>
              <Text style={[styles.headerSub, { color: c.textMuted }]}>{t('history.subtitle')}</Text>
            </View>
          </View>

          {/* Summary cards — only show when there's actual history */}
          {relapseHistory.length > 0 && (
            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, { backgroundColor: c.surfaceGlass }]}>
                <View style={[styles.summaryIcon, { backgroundColor: COLORS.primaryBg }]}>
                  <Ionicons name="trophy" size={18} color={COLORS.primary} />
                </View>
                <Text style={[styles.summaryValue, { color: COLORS.primary }]}>{bestStreak}{t('history.daysSuffix')}</Text>
                <Text style={[styles.summaryLabel, { color: c.textMuted }]}>{t('history.bestStreak')}</Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: c.surfaceGlass }]}>
                <View style={[styles.summaryIcon, { backgroundColor: 'rgba(59,130,246,0.08)' }]}>
                  <Ionicons name="calendar" size={18} color="#3B82F6" />
                </View>
                <Text style={[styles.summaryValue, { color: '#3B82F6' }]}>{totalDays}{t('history.daysSuffix')}</Text>
                <Text style={[styles.summaryLabel, { color: c.textMuted }]}>{t('history.totalDays')}</Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: c.surfaceGlass }]}>
                <View style={[styles.summaryIcon, { backgroundColor: 'rgba(245,158,11,0.08)' }]}>
                  <Ionicons name="cash" size={18} color="#F59E0B" />
                </View>
                <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>{totalSaved.toLocaleString('fr-FR')}€</Text>
                <Text style={[styles.summaryLabel, { color: c.textMuted }]}>{t('history.totalSaved')}</Text>
              </View>
            </View>
          )}

          {/* Current streak */}
          {daysSinceQuit > 0 && relapseHistory.length > 0 && (
            <View style={[styles.currentCard, { backgroundColor: c.surfaceGlass }]}>
              <View style={styles.timelineDot}>
                <View style={[styles.dotInner, { backgroundColor: COLORS.primary }]} />
              </View>
              <View style={styles.currentContent}>
                <View style={styles.currentBadge}>
                  <Ionicons name="flame" size={12} color={COLORS.primary} />
                  <Text style={styles.currentBadgeText}>{t('history.currentStreak')}</Text>
                </View>
                <Text style={[styles.currentDays, { color: c.text }]}>
                  {daysSinceQuit} {daysSinceQuit <= 1 ? t('day') : t('days')}
                </Text>
                <Text style={[styles.currentDate, { color: c.textMuted }]}>
                  {t('history.since')} {userData.quitDate ? formatDate(userData.quitDate) : '—'}
                </Text>
                <Text style={[styles.currentSaved, { color: COLORS.primary }]}>
                  +{moneySaved.toLocaleString('fr-FR')} €
                </Text>
              </View>
            </View>
          )}

          {/* History timeline */}
          {relapseHistory.length > 0 ? (
            <View style={styles.timeline}>
              {relapseHistory.map((entry, index) => {
                const isLong = entry.days >= 30;
                const isBest = entry.days === bestStreak;
                return (
                  <View key={entry.id} style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={[styles.timelineDot, isBest && styles.timelineDotBest]}>
                        <View style={[
                          styles.dotInner,
                          { backgroundColor: isBest ? '#F59E0B' : isLong ? COLORS.primary : c.textMuted },
                        ]} />
                      </View>
                      {index < relapseHistory.length - 1 && (
                        <View style={[styles.timelineLine, { backgroundColor: c.borderLight }]} />
                      )}
                    </View>
                    <View style={[styles.historyCard, { backgroundColor: c.surfaceGlass }]}>
                      <View style={styles.historyHeader}>
                        <Text style={[styles.historyPeriod, { color: c.text }]}>
                          {t('history.streakNumber')} #{relapseHistory.length - index}
                        </Text>
                        {isBest && (
                          <View style={styles.bestBadge}>
                            <Ionicons name="trophy" size={10} color="#F59E0B" />
                            <Text style={styles.bestBadgeText}>BEST</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.historyDays, { color: c.text }]}>
                        {entry.days} {entry.days <= 1 ? t('day') : t('days')}
                      </Text>
                      <Text style={[styles.historyDates, { color: c.textMuted }]}>
                        {t('history.from')} {formatDate(entry.startDate)} {t('history.to')} {formatDate(entry.endDate)}
                      </Text>
                      <View style={styles.historySavedRow}>
                        <Ionicons name="cash-outline" size={14} color={COLORS.primary} />
                        <Text style={[styles.historySaved, { color: COLORS.primary }]}>
                          +{entry.moneySaved.toLocaleString('fr-FR')} €
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={[styles.emptyCard, { backgroundColor: c.surfaceGlass }]}>
              <Ionicons name="time-outline" size={48} color={c.textMuted} />
              <Text style={[styles.emptyTitle, { color: c.text }]}>{t('history.noHistory')}</Text>
              <Text style={[styles.emptyText, { color: c.textMuted }]}>{t('history.noHistoryText')}</Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: SPACING.lg, paddingBottom: 20 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24 },
  backBtn: { width: 40, height: 40, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { fontSize: FONT_SIZE.sm, marginTop: 2 },

  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  summaryCard: {
    flex: 1, borderRadius: 16, padding: 14, alignItems: 'center', gap: 6, ...SHADOWS.sm,
  },
  summaryIcon: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  summaryValue: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  summaryLabel: { fontSize: 10, fontWeight: '600', textAlign: 'center' },

  currentCard: {
    flexDirection: 'row', borderRadius: 20, padding: 18, marginBottom: 24,
    borderWidth: 1.5, borderColor: 'rgba(16,185,129,0.20)', ...SHADOWS.sm,
  },
  currentContent: { flex: 1, marginLeft: 14 },
  currentBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.primaryBg, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 10, alignSelf: 'flex-start', marginBottom: 8,
  },
  currentBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  currentDays: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  currentDate: { fontSize: FONT_SIZE.sm, marginTop: 4 },
  currentSaved: { fontSize: FONT_SIZE.md, fontWeight: '700', marginTop: 6 },

  timeline: { gap: 0 },
  timelineItem: { flexDirection: 'row', minHeight: 100 },
  timelineLeft: { width: 32, alignItems: 'center' },
  timelineDot: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(16,185,129,0.12)', justifyContent: 'center', alignItems: 'center',
    zIndex: 1,
  },
  timelineDotBest: { backgroundColor: 'rgba(245,158,11,0.15)' },
  dotInner: { width: 10, height: 10, borderRadius: 5 },
  timelineLine: { width: 2, flex: 1, marginVertical: 4 },

  historyCard: {
    flex: 1, borderRadius: 16, padding: 16, marginLeft: 10, marginBottom: 12, ...SHADOWS.sm,
  },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  historyPeriod: { fontSize: FONT_SIZE.sm, fontWeight: '700' },
  bestBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(245,158,11,0.10)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  bestBadgeText: { fontSize: 9, fontWeight: '800', color: '#F59E0B' },
  historyDays: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  historyDates: { fontSize: 12, marginTop: 4 },
  historySavedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  historySaved: { fontSize: FONT_SIZE.sm, fontWeight: '700' },

  emptyCard: {
    borderRadius: 20, padding: SPACING.xl, alignItems: 'center', gap: 12, ...SHADOWS.sm,
  },
  emptyTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700' },
  emptyText: { fontSize: FONT_SIZE.sm, textAlign: 'center', lineHeight: 22 },
});
