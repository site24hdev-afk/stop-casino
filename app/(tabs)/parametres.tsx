import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../src/constants/theme';
import i18n, { t, setLanguage, AVAILABLE_LANGUAGES } from '../../src/i18n';

export default function ParametresScreen() {
  const router = useRouter();
  const [showLangModal, setShowLangModal] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.locale);

  const currentLanguageLabel = AVAILABLE_LANGUAGES.find(l => l.code === currentLang)?.label ?? currentLang;
  const currentFlag = AVAILABLE_LANGUAGES.find(l => l.code === currentLang)?.flag ?? '🌐';

  const handleLanguageChange = async (langCode: string) => {
    await setLanguage(langCode);
    setCurrentLang(langCode);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowLangModal(false);
    Alert.alert(t('settings.languageChanged'), t('settings.restartHint'));
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Language */}
          <Text style={styles.sectionLabel}>{t('settings.language')}</Text>
          <TouchableOpacity style={styles.card} onPress={() => setShowLangModal(true)} activeOpacity={0.7}>
            <View style={[styles.cardIcon, { backgroundColor: COLORS.infoBg }]}>
              <Ionicons name="language" size={22} color={COLORS.info} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{t('settings.languageDesc')}</Text>
              <Text style={styles.cardValue}>{currentFlag} {currentLanguageLabel}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          {/* App Info */}
          <Text style={styles.sectionLabel}>{t('settings.appInfo')}</Text>
          <View style={styles.card}>
            <View style={[styles.cardIcon, { backgroundColor: COLORS.primaryBg }]}>
              <Ionicons name="shield-checkmark" size={22} color={COLORS.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Stop Casino</Text>
              <Text style={styles.cardValue}>{t('settings.version')} 1.0.0</Text>
            </View>
          </View>

          {/* Privacy */}
          <Text style={styles.sectionLabel}>{t('settings.dataPrivacy')}</Text>
          <View style={styles.card}>
            <View style={[styles.cardIcon, { backgroundColor: COLORS.warningBg }]}>
              <Ionicons name="lock-closed" size={22} color={COLORS.warning} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{t('settings.dataPrivacy')}</Text>
              <Text style={styles.cardValue}>{t('settings.dataLocal')}</Text>
            </View>
          </View>

          {/* Subscription */}
          <Text style={styles.sectionLabel}>{t('sub.mySubscription')}</Text>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/abonnement')} activeOpacity={0.7}>
            <View style={[styles.cardIcon, { backgroundColor: 'rgba(245,158,11,0.08)' }]}>
              <Ionicons name="diamond" size={22} color="#F59E0B" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{t('sub.mySubscription')}</Text>
              <Text style={styles.cardValue}>Gérer votre offre</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </ScrollView>

        {/* Language Modal */}
        <Modal visible={showLangModal} transparent animationType="slide" onRequestClose={() => setShowLangModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('settings.selectLanguage')}</Text>
                <TouchableOpacity onPress={() => setShowLangModal(false)} style={styles.modalClose}>
                  <Ionicons name="close" size={22} color={COLORS.text} />
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
                    <Text style={[styles.langLabel, currentLang === lang.code && styles.langLabelActive]}>
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
});
