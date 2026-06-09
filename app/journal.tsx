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
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../src/constants/theme';
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

  const now = new Date();
  const thisMonthEntries = entries.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const entryLimit = limits.journalEntries;
  const isLimited = entryLimit > 0;
  const canAddEntry = entryLimit === -1 || thisMonthEntries.length < entryLimit;
  const entriesRemaining = entryLimit === -1 ? Infinity : Math.max(0, entryLimit - thisMonthEntries.length);

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
    Haptics.notificationAsync(overcame ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => { setIntensity(3); setLocation(''); setTrigger(''); setAction(''); setOvercame(true); };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={GRADIENTS.screenBg} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('journal.headerTitle')}</Text>
          <TouchableOpacity
            style={[styles.addBtn, !canAddEntry && { backgroundColor: COLORS.textMuted }]}
            onPress={() => {
              if (canAddEntry) { setShowModal(true); }
              else {
                Alert.alert(t('journal.limitTitle'), t('journal.limitText', { count: entryLimit }), [
                  { text: t('cancel'), style: 'cancel' },
                  { text: t('journal.upgrade'), onPress: () => router.push('/abonnement') },
                ]);
              }
            }}
          >
            <Ionicons name="add" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Limit banner */}
        {isLimited && (
          <View style={styles.limitBanner}>
            <Ionicons name="information-circle" size={16} color={canAddEntry ? COLORS.info : COLORS.danger} />
            <Text style={[styles.limitText, !canAddEntry && { color: COLORS.danger }]}>
              {canAddEntry ? t('journal.entriesLeft', { count: entriesRemaining, total: entryLimit }) : t('journal.limitReached')}
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
              <Text style={styles.statNum}>{totalCravings}</Text>
              <Text style={styles.statLabel}>{t('journal.logged')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: COLORS.primaryLight }]}>{overcameCount}</Text>
              <Text style={styles.statLabel}>{t('journal.overcome')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: COLORS.warningLight }]}>{peakHour || '—'}</Text>
              <Text style={styles.statLabel}>{t('journal.peak')}</Text>
            </View>
          </View>
        )}

        {/* List */}
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
                  <View style={[styles.entryBadge, entry.overcame ? styles.overcomeBadge : styles.failBadge]}>
                    <Text style={[styles.entryBadgeText, { color: entry.overcame ? COLORS.primary : COLORS.danger }]}>
                      {entry.overcame ? t('journal.overcame') : t('journal.relapse')}
                    </Text>
                  </View>
                </View>
                <View style={styles.entryDetails}>
                  <View style={styles.entryDetail}>
                    <Text style={styles.detailLabel}>{t('journal.intensity')}</Text>
                    <View style={styles.dots}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <View key={i} style={[styles.dot, i <= entry.intensity && styles.dotActive]} />
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

        {/* Add Modal */}
        <Modal visible={showModal} animationType="slide" transparent>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('journal.newCraving')}</Text>
                <TouchableOpacity onPress={() => setShowModal(false)} style={styles.modalClose}>
                  <Ionicons name="close" size={22} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.fieldLabel}>{t('journal.intensity')}</Text>
                <View style={styles.intensityRow}>
                  {([1, 2, 3, 4, 5] as const).map(i => (
                    <TouchableOpacity key={i} style={[styles.intensityBtn, intensity === i && styles.intensityActive]} onPress={() => setIntensity(i)}>
                      <Text style={[styles.intensityText, intensity === i && styles.intensityTextActive]}>{i}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.fieldLabel}>{t('journal.whereAreYou')}</Text>
                <View style={styles.chipRow}>
                  {LOCATION_KEYS.map(key => {
                    const label = t(`journal.locations.${key}`);
                    return (
                      <TouchableOpacity key={key} style={[styles.chip, location === label && styles.chipActive]} onPress={() => setLocation(label)}>
                        <Text style={[styles.chipText, location === label && styles.chipTextActive]}>{label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.fieldLabel}>{t('journal.whatTriggered')}</Text>
                <View style={styles.chipRow}>
                  {TRIGGER_KEYS.map(key => {
                    const label = t(`journal.triggers.${key}`);
                    return (
                      <TouchableOpacity key={key} style={[styles.chip, trigger === label && styles.chipActive]} onPress={() => setTrigger(label)}>
                        <Text style={[styles.chipText, trigger === label && styles.chipTextActive]}>{label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.fieldLabel}>{t('journal.whatDidYouDo')}</Text>
                <TextInput
                  style={styles.textArea}
                  value={action}
                  onChangeText={setAction}
                  placeholder={t('journal.whatDidYouDoPlaceholder')}
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                />

                <Text style={styles.fieldLabel}>{t('journal.didYouResist')}</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity style={[styles.toggleBtn, overcame && styles.toggleActive]} onPress={() => setOvercame(true)}>
                    <Ionicons name="checkmark-circle" size={20} color={overcame ? '#FFF' : COLORS.textMuted} />
                    <Text style={[styles.toggleText, overcame && styles.toggleTextActive]}>{t('yes')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.toggleBtn, !overcame && styles.toggleFail]} onPress={() => setOvercame(false)}>
                    <Ionicons name="close-circle" size={20} color={!overcame ? '#FFF' : COLORS.textMuted} />
                    <Text style={[styles.toggleText, !overcame && styles.toggleTextActive]}>{t('no')}</Text>
                  </TouchableOpacity>
                </View>

                {!overcame && <Text style={styles.encourageText}>{t('journal.encourageText')}</Text>}

                <TouchableOpacity onPress={handleSubmit} style={{ borderRadius: BORDER_RADIUS.lg, overflow: 'hidden', marginTop: SPACING.xl }}>
                  <LinearGradient colors={GRADIENTS.menuGreen} style={styles.submitBtn}>
                    <Text style={styles.submitText}>{t('save')}</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  safeArea: { flex: 1, paddingHorizontal: SPACING.lg },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  backBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: COLORS.surfaceGlass, borderWidth: 1, borderColor: COLORS.borderLight, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text },
  addBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },

  // Limit
  limitBanner: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.surfaceGlass, borderRadius: 14, padding: 12, paddingHorizontal: 14,
    marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.borderLight,
  },
  limitText: { flex: 1, fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
  upgradeLink: { fontSize: FONT_SIZE.xs, color: COLORS.info, fontWeight: '700' },

  // Stats
  statsCard: {
    flexDirection: 'row', backgroundColor: COLORS.surfaceGlass, borderRadius: 20, padding: SPACING.lg,
    marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.borderGlass,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: COLORS.borderLight },
  statNum: { fontSize: FONT_SIZE.xl, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  statLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },

  // List
  list: { flex: 1 },
  entryCard: {
    backgroundColor: COLORS.surfaceGlass, borderRadius: 16, padding: SPACING.lg,
    marginBottom: 8, borderWidth: 1, borderColor: COLORS.borderGlass,
  },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  entryDate: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary },
  entryBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: BORDER_RADIUS.full },
  overcomeBadge: { backgroundColor: COLORS.primaryBg },
  failBadge: { backgroundColor: COLORS.dangerBg },
  entryBadgeText: { fontSize: FONT_SIZE.xs, fontWeight: '600' },
  entryDetails: { gap: SPACING.sm },
  entryDetail: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
  detailValue: { fontSize: FONT_SIZE.sm, color: COLORS.text, fontWeight: '500' },
  dots: { flexDirection: 'row', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.surfaceLight },
  dotActive: { backgroundColor: COLORS.danger },

  // Empty
  emptyState: { alignItems: 'center', paddingTop: 80, gap: SPACING.md },
  emptyTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text },
  emptyText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.lg, maxHeight: '90%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.surfaceLight, alignSelf: 'center', marginBottom: SPACING.md },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text },
  modalClose: { width: 36, height: 36, borderRadius: 12, backgroundColor: COLORS.surfaceGlass, borderWidth: 1, borderColor: COLORS.borderLight, justifyContent: 'center', alignItems: 'center' },
  fieldLabel: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.textSecondary, marginBottom: SPACING.sm, marginTop: SPACING.lg },
  intensityRow: { flexDirection: 'row', gap: SPACING.sm },
  intensityBtn: { flex: 1, height: 48, borderRadius: 14, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  intensityActive: { backgroundColor: COLORS.danger },
  intensityText: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textMuted },
  intensityTextActive: { color: '#FFF' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, backgroundColor: COLORS.surface },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary },
  chipTextActive: { color: '#FFF', fontWeight: '600' },
  textArea: { backgroundColor: COLORS.surface, borderRadius: 14, padding: SPACING.md, fontSize: FONT_SIZE.md, color: COLORS.text, minHeight: 80, textAlignVertical: 'top' },
  toggleRow: { flexDirection: 'row', gap: SPACING.md },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: 14, borderRadius: 14, backgroundColor: COLORS.surface },
  toggleActive: { backgroundColor: COLORS.primary },
  toggleFail: { backgroundColor: COLORS.danger },
  toggleText: { fontSize: FONT_SIZE.md, color: COLORS.textMuted, fontWeight: '600' },
  toggleTextActive: { color: '#FFF' },
  encourageText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, fontStyle: 'italic', marginTop: SPACING.md, textAlign: 'center' },
  submitBtn: { paddingVertical: 16, alignItems: 'center' },
  submitText: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: '#FFF' },
});
