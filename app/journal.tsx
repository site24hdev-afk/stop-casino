import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../src/constants/theme';
import { useCravingLog } from '../src/hooks/useCravingLog';
import { useSubscription } from '../src/hooks/useSubscription';
import * as Haptics from 'expo-haptics';
import i18n, { t } from '../src/i18n';

const TRIGGER_KEYS = ['boredom', 'stress', 'sadness', 'money', 'ads', 'friends', 'alcohol', 'other'] as const;
const LOCATION_KEYS = ['home', 'work', 'transport', 'outside', 'restaurant', 'other'] as const;

export default function JournalScreen() {
  const router = useRouter();
  const { entries, addEntry, overcameCount, peakHour, totalCravings } = useCravingLog();
  const { limits } = useSubscription();
  const [showModal, setShowModal] = useState(false);

  // Vérifier la limite d'entrées par mois
  const now = new Date();
  const thisMonthEntries = entries.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const entryLimit = limits.journalEntries;
  const isLimited = entryLimit > 0; // -1 = illimité
  const canAddEntry = entryLimit === -1 || thisMonthEntries.length < entryLimit;
  const entriesRemaining = entryLimit === -1 ? Infinity : Math.max(0, entryLimit - thisMonthEntries.length);

  // Form state
  const [intensity, setIntensity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [location, setLocation] = useState('');
  const [trigger, setTrigger] = useState('');
  const [action, setAction] = useState('');
  const [overcame, setOvercame] = useState(true);

  const handleSubmit = async () => {
    await addEntry({
      intensity,
      location: location || 'Non précisé',
      trigger: trigger || 'Non précisé',
      actionTaken: action || 'Non précisé',
      overcame,
    });
    Haptics.notificationAsync(
      overcame
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Warning
    );
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setIntensity(3);
    setLocation('');
    setTrigger('');
    setAction('');
    setOvercame(true);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityRole="button" accessibilityLabel={t('back')}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} accessibilityRole="header">{t('journal.headerTitle')}</Text>
        <TouchableOpacity
          style={[styles.addButton, !canAddEntry && { backgroundColor: COLORS.textMuted }]}
          onPress={() => {
            if (canAddEntry) {
              setShowModal(true);
            } else {
              Alert.alert(
                t('journal.limitTitle'),
                t('journal.limitText', { count: entryLimit }),
                [
                  { text: t('cancel'), style: 'cancel' },
                  { text: t('journal.upgrade'), onPress: () => router.push('/abonnement') },
                ]
              );
            }
          }}
          accessibilityRole="button"
          accessibilityLabel="Add new journal entry"
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Compteur d'entrées restantes (si limité) */}
      {isLimited && (
        <View style={styles.limitBanner}>
          <Ionicons name="information-circle" size={16} color={canAddEntry ? COLORS.info : COLORS.danger} />
          <Text style={[styles.limitText, !canAddEntry && { color: COLORS.danger }]}>
            {canAddEntry
              ? t('journal.entriesLeft', { count: entriesRemaining, total: entryLimit })
              : t('journal.limitReached')}
          </Text>
          {!canAddEntry && (
            <TouchableOpacity onPress={() => router.push('/abonnement')}>
              <Text style={styles.upgradeLink}>{t('journal.upgrade')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Stats */}
      {totalCravings > 0 && (
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalCravings}</Text>
            <Text style={styles.statLabel}>{t('journal.logged')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: COLORS.primary }]}>
              {overcameCount}
            </Text>
            <Text style={styles.statLabel}>{t('journal.overcome')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: COLORS.warning }]}>
              {peakHour || '—'}
            </Text>
            <Text style={styles.statLabel}>{t('journal.peak')}</Text>
          </View>
        </View>
      )}

      {/* Liste */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>{t('journal.noEntries')}</Text>
            <Text style={styles.emptyText}>{t('journal.noEntriesText')}</Text>
          </View>
        ) : (
          entries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                <View style={[
                  styles.entryBadge,
                  entry.overcame ? styles.overcomeBadge : styles.failBadge,
                ]}>
                  <Text style={[
                    styles.entryBadgeText,
                    { color: entry.overcame ? COLORS.primary : COLORS.danger },
                  ]}>
                    {entry.overcame ? t('journal.overcame') : t('journal.relapse')}
                  </Text>
                </View>
              </View>
              <View style={styles.entryDetails}>
                <View style={styles.entryDetail}>
                  <Text style={styles.detailLabel}>{t('journal.intensity')}</Text>
                  <View style={styles.intensityDots}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <View
                        key={i}
                        style={[
                          styles.dot,
                          i <= entry.intensity && styles.dotActive,
                        ]}
                      />
                    ))}
                  </View>
                </View>
                <View style={styles.entryDetail}>
                  <Text style={styles.detailLabel}>{t('journal.location')}</Text>
                  <Text style={styles.detailValue}>{entry.location}</Text>
                </View>
                <View style={styles.entryDetail}>
                  <Text style={styles.detailLabel}>{t('journal.trigger')}</Text>
                  <Text style={styles.detailValue}>{entry.trigger}</Text>
                </View>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modal ajout */}
      <Modal visible={showModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('journal.newCraving')}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} accessibilityRole="button" accessibilityLabel={t('close')}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Intensité */}
              <Text style={styles.fieldLabel}>{t('journal.intensity')}</Text>
              <View style={styles.intensityRow}>
                {([1, 2, 3, 4, 5] as const).map(i => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.intensityButton,
                      intensity === i && styles.intensityActive,
                    ]}
                    onPress={() => setIntensity(i)}
                  >
                    <Text style={[
                      styles.intensityText,
                      intensity === i && styles.intensityTextActive,
                    ]}>
                      {i}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Lieu */}
              <Text style={styles.fieldLabel}>{t('journal.whereAreYou')}</Text>
              <View style={styles.chipRow}>
                {LOCATION_KEYS.map(key => {
                  const label = t(`journal.locations.${key}`);
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[styles.chip, location === label && styles.chipActive]}
                      onPress={() => setLocation(label)}
                    >
                      <Text style={[
                        styles.chipText,
                        location === label && styles.chipTextActive,
                      ]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Déclencheur */}
              <Text style={styles.fieldLabel}>{t('journal.whatTriggered')}</Text>
              <View style={styles.chipRow}>
                {TRIGGER_KEYS.map(key => {
                  const label = t(`journal.triggers.${key}`);
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[styles.chip, trigger === label && styles.chipActive]}
                      onPress={() => setTrigger(label)}
                    >
                      <Text style={[
                        styles.chipText,
                        trigger === label && styles.chipTextActive,
                      ]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Action prise */}
              <Text style={styles.fieldLabel}>{t('journal.whatDidYouDo')}</Text>
              <TextInput
                style={styles.textArea}
                value={action}
                onChangeText={setAction}
                placeholder={t('journal.whatDidYouDoPlaceholder')}
                placeholderTextColor={COLORS.textMuted}
                multiline
              />

              {/* Surmonté ? */}
              <Text style={styles.fieldLabel}>{t('journal.didYouResist')}</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[styles.toggleButton, overcame && styles.toggleActive]}
                  onPress={() => setOvercame(true)}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={overcame ? '#FFF' : COLORS.textMuted}
                  />
                  <Text style={[
                    styles.toggleText,
                    overcame && styles.toggleTextActive,
                  ]}>
                    {t('yes')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, !overcame && styles.toggleFail]}
                  onPress={() => setOvercame(false)}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={!overcame ? '#FFF' : COLORS.textMuted}
                  />
                  <Text style={[
                    styles.toggleText,
                    !overcame && styles.toggleTextActive,
                  ]}>
                    {t('no')}
                  </Text>
                </TouchableOpacity>
              </View>

              {!overcame && (
                <Text style={styles.encourageText}>
                  {t('journal.encourageText')}
                </Text>
              )}

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} accessibilityRole="button" accessibilityLabel={t('save')}>
                <Text style={styles.submitText}>{t('save')}</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Stats
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  statNumber: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  // Liste
  list: {
    flex: 1,
  },
  entryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  entryDate: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  entryBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  overcomeBadge: {
    backgroundColor: COLORS.primaryBg,
  },
  failBadge: {
    backgroundColor: COLORS.dangerBg,
  },
  entryBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  entryDetails: {
    gap: SPACING.sm,
  },
  entryDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
  detailValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  intensityDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceLight,
  },
  dotActive: {
    backgroundColor: COLORS.danger,
  },
  // Empty
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  fieldLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
  intensityRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  intensityButton: {
    flex: 1,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  intensityActive: {
    backgroundColor: COLORS.danger,
  },
  intensityText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  intensityTextActive: {
    color: '#FFF',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
  },
  chipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleFail: {
    backgroundColor: COLORS.danger,
  },
  toggleText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#FFF',
  },
  encourageText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  submitText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: '#FFF',
  },
  // Limite banner
  limitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  limitText: {
    flex: 1,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  upgradeLink: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.info,
    fontWeight: '700',
  },
});
