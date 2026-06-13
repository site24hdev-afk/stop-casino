import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
let Haptics: any = null;
try { Haptics = require('expo-haptics'); } catch (e) {}
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../src/constants/theme';
import { useNotifications } from '../../src/hooks/useNotifications';
import { useTheme, useColors } from '../../src/context/ThemeContext';
import i18n, { t, setLanguage, AVAILABLE_LANGUAGES } from '../../src/i18n';

const HOUR_OPTIONS = [6, 7, 8, 9, 10, 11, 12];

export default function ParametresScreen() {
  const router = useRouter();
  const [showLangModal, setShowLangModal] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.locale);
  const { enabled: notifEnabled, hour: notifHour, toggleNotifications, changeHour } = useNotifications();
  const { isDark, toggleTheme } = useTheme();
  const c = useColors();

  const currentLanguageLabel = AVAILABLE_LANGUAGES.find(l => l.code === currentLang)?.label ?? currentLang;
  const currentFlag = AVAILABLE_LANGUAGES.find(l => l.code === currentLang)?.flag ?? '🌐';

  const handleLanguageChange = async (langCode: string) => {
    await setLanguage(langCode);
    setCurrentLang(langCode);
    Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowLangModal(false);
    Alert.alert(t('settings.languageChanged'), t('settings.restartHint'));
  };

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: c.text }]}>{t('settings.title')}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Language */}
          <Text style={[styles.sectionLabel, { color: c.textMuted }]}>{t('settings.language')}</Text>
          <TouchableOpacity style={[styles.card, { backgroundColor: c.surfaceGlass }]} onPress={() => setShowLangModal(true)} activeOpacity={0.7}>
            <View style={[styles.cardIcon, { backgroundColor: COLORS.infoBg }]}>
              <Ionicons name="language" size={22} color={COLORS.info} />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: c.text }]}>{t('settings.languageDesc')}</Text>
              <Text style={[styles.cardValue, { color: c.textSecondary }]}>{currentFlag} {currentLanguageLabel}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={c.textMuted} />
          </TouchableOpacity>

          {/* Notifications */}
          <Text style={[styles.sectionLabel, { color: c.textMuted }]}>{t('settings.notifications')}</Text>
          <View style={[styles.card, { backgroundColor: c.surfaceGlass }]}>
            <View style={[styles.cardIcon, { backgroundColor: COLORS.dangerBg }]}>
              <Ionicons name="notifications" size={22} color={COLORS.danger} />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: c.text }]}>{t('settings.dailyReminders')}</Text>
              <Text style={[styles.cardValue, { color: c.textSecondary }]}>
                {notifEnabled ? t('settings.dailyAt', { hour: notifHour }) : t('settings.disabled')}
              </Text>
            </View>
            <Switch
              value={notifEnabled}
              onValueChange={async (val) => {
                const success = await toggleNotifications(val);
                if (success) Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              trackColor={{ false: COLORS.surfaceLight, true: COLORS.primary }}
              thumbColor="#FFF"
            />
          </View>
          {notifEnabled && (
            <View style={styles.hourRow}>
              {HOUR_OPTIONS.map((h) => (
                <TouchableOpacity
                  key={h}
                  style={[styles.hourBtn, notifHour === h && styles.hourBtnActive]}
                  onPress={() => { changeHour(h); Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                >
                  <Text style={[styles.hourText, notifHour === h && styles.hourTextActive]}>{h}h</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Apparence */}
          <Text style={[styles.sectionLabel, { color: c.textMuted }]}>{t('settings.appearance')}</Text>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: c.surfaceGlass }]}
            activeOpacity={0.7}
            onPress={() => {
              toggleTheme();
              Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <View style={[styles.cardIcon, { backgroundColor: isDark ? 'rgba(139,92,246,0.12)' : c.purpleBg }]}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color={c.purple} />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: c.text }]}>{t('settings.darkMode')}</Text>
              <Text style={[styles.cardValue, { color: c.textSecondary }]}>
                {isDark ? t('settings.enabled') : t('settings.disabled')}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={() => {
                toggleTheme();
                Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              trackColor={{ false: c.surfaceLight, true: c.purple }}
              thumbColor="#FFF"
            />
          </TouchableOpacity>

          {/* App Info */}
          <Text style={[styles.sectionLabel, { color: c.textMuted }]}>{t('settings.appInfo')}</Text>
          <View style={[styles.card, { backgroundColor: c.surfaceGlass }]}>
            <View style={[styles.cardIcon, { backgroundColor: c.primaryBg }]}>
              <Ionicons name="shield-checkmark" size={22} color={c.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: c.text }]}>Stop Casino</Text>
              <Text style={[styles.cardValue, { color: c.textSecondary }]}>{t('settings.version')} 1.0.0</Text>
            </View>
          </View>

          {/* Privacy */}
          <Text style={[styles.sectionLabel, { color: c.textMuted }]}>{t('settings.dataPrivacy')}</Text>
          <TouchableOpacity style={[styles.card, { backgroundColor: c.surfaceGlass }]} onPress={() => router.push('/legal')} activeOpacity={0.7}>
            <View style={[styles.cardIcon, { backgroundColor: c.warningBg }]}>
              <Ionicons name="lock-closed" size={22} color={c.warning} />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: c.text }]}>{t('settings.dataPrivacy')}</Text>
              <Text style={[styles.cardValue, { color: c.textSecondary }]}>{t('settings.dataLocal')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={c.textMuted} />
          </TouchableOpacity>

          {/* Subscription */}
          <Text style={[styles.sectionLabel, { color: c.textMuted }]}>{t('sub.mySubscription')}</Text>
          <TouchableOpacity style={[styles.card, { backgroundColor: c.surfaceGlass }]} onPress={() => router.push('/abonnement')} activeOpacity={0.7}>
            <View style={[styles.cardIcon, { backgroundColor: 'rgba(245,158,11,0.08)' }]}>
              <Ionicons name="diamond" size={22} color="#F59E0B" />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: c.text }]}>{t('sub.mySubscription')}</Text>
              <Text style={[styles.cardValue, { color: c.textSecondary }]}>{t('settings.manageOffer')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={c.textMuted} />
          </TouchableOpacity>
        </ScrollView>

        {/* Language Modal */}
        <Modal visible={showLangModal} transparent animationType="slide" onRequestClose={() => setShowLangModal(false)}>
          <View style={[styles.modalOverlay, { backgroundColor: c.overlay }]}>
            <View style={[styles.modalContent, { backgroundColor: isDark ? c.surfaceGlass : '#FFFFFF' }]}>
              <View style={[styles.modalHandle, { backgroundColor: c.surfaceLight }]} />
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: c.text }]}>{t('settings.selectLanguage')}</Text>
                <TouchableOpacity onPress={() => setShowLangModal(false)} style={[styles.modalClose, { backgroundColor: c.surfaceGlass }]}>
                  <Ionicons name="close" size={22} color={c.text} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    style={[styles.langOption, currentLang === lang.code && styles.langOptionActive]}
                    onPress={() => handleLanguageChange(lang.code)}
                  >
                    <Text style={styles.langFlag}>{lang.flag}</Text>
                    <Text style={[styles.langLabel, { color: c.text }, currentLang === lang.code && styles.langLabelActive]}>
                      {lang.label}
                    </Text>
                    {currentLang === lang.code && (
                      <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  safeArea: { flex: 1, paddingHorizontal: SPACING.lg },

  // Header
  header: { marginBottom: SPACING.xl },
  headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text },

  // Section
  sectionLabel: {
    fontSize: FONT_SIZE.xs, fontWeight: '700', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm, marginTop: SPACING.lg,
  },

  // Cards
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.surfaceGlass, borderRadius: 18, padding: 16,
    ...SHADOWS.sm,
  },
  cardIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text },
  cardValue: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 2 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: 40, maxHeight: '75%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.surfaceLight, alignSelf: 'center', marginBottom: SPACING.md },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text },
  modalClose: { width: 36, height: 36, borderRadius: 12, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  langOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14, borderRadius: 14, marginBottom: SPACING.xs, gap: 14 },
  langOptionActive: { backgroundColor: 'rgba(16,185,129,0.08)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.20)' },
  langFlag: { fontSize: 28 },
  langLabel: { flex: 1, fontSize: FONT_SIZE.lg, color: COLORS.text, fontWeight: '500' },
  langLabelActive: { fontWeight: '700', color: COLORS.primary },

  // Hour picker
  hourRow: {
    flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap',
  },
  hourBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
    backgroundColor: COLORS.surfaceGlass, ...SHADOWS.sm,
  },
  hourBtnActive: {
    backgroundColor: COLORS.primary,
  },
  hourText: {
    fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.textMuted,
  },
  hourTextActive: {
    color: '#FFF',
  },
});
