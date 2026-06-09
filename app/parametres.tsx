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
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../src/constants/theme';
import i18n, { t, setLanguage, AVAILABLE_LANGUAGES } from '../src/i18n';

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
    Alert.alert(
      t('settings.languageChanged'),
      t('settings.restartHint')
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityRole="button" accessibilityLabel={t('back')}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} accessibilityRole="header">{t('settings.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Section Langue */}
        <Text style={styles.sectionLabel}>{t('settings.language')}</Text>
        <TouchableOpacity
          style={styles.card}
          onPress={() => setShowLangModal(true)}
          accessibilityRole="button"
          accessibilityLabel="Change language"
        >
          <View style={[styles.cardIconBg, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}>
            <Ionicons name="language" size={24} color={COLORS.info} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{t('settings.languageDesc')}</Text>
            <Text style={styles.cardValue}>{currentFlag} {currentLanguageLabel}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Section App Info */}
        <Text style={styles.sectionLabel}>{t('settings.appInfo')}</Text>
        <View style={styles.card}>
          <View style={[styles.cardIconBg, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Stop Casino</Text>
            <Text style={styles.cardValue}>{t('settings.version')} 1.0.0</Text>
          </View>
        </View>

        {/* Données & Confidentialité */}
        <Text style={styles.sectionLabel}>{t('settings.dataPrivacy')}</Text>
        <View style={styles.card}>
          <View style={[styles.cardIconBg, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
            <Ionicons name="lock-closed" size={24} color={COLORS.warning} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{t('settings.dataPrivacy')}</Text>
            <Text style={styles.cardValue}>{t('settings.dataLocal')}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal sélection de langue */}
      <Modal
        visible={showLangModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLangModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.selectLanguage')}</Text>
              <TouchableOpacity onPress={() => setShowLangModal(false)} accessibilityRole="button" accessibilityLabel={t('close')}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {AVAILABLE_LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.langOption,
                    currentLang === lang.code && styles.langOptionActive,
                  ]}
                  onPress={() => handleLanguageChange(lang.code)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select language: ${lang.label}`}
                >
                  <Text style={styles.langFlag}>{lang.flag}</Text>
                  <Text style={[
                    styles.langLabel,
                    currentLang === lang.code && styles.langLabelActive,
                  ]}>
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
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  cardIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  cardValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: 40,
    maxHeight: '75%',
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
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xs,
    gap: SPACING.md,
  },
  langOptionActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  langFlag: {
    fontSize: 28,
  },
  langLabel: {
    flex: 1,
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    fontWeight: '500',
  },
  langLabelActive: {
    fontWeight: '700',
    color: COLORS.primary,
  },
});
