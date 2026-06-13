import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../src/constants/theme';
import { useColors } from '../src/context/ThemeContext';
import { t } from '../src/i18n';

type Tab = 'privacy' | 'terms';

export default function LegalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<Tab>((params.tab as Tab) || 'privacy');
  const c = useColors();

  const sections = activeTab === 'privacy'
    ? [
        { title: t('legal.privacyIntroTitle'), body: t('legal.privacyIntroBody') },
        { title: t('legal.dataCollectedTitle'), body: t('legal.dataCollectedBody') },
        { title: t('legal.dataStorageTitle'), body: t('legal.dataStorageBody') },
        { title: t('legal.dataSharingTitle'), body: t('legal.dataSharingBody') },
        { title: t('legal.subscriptionDataTitle'), body: t('legal.subscriptionDataBody') },
        { title: t('legal.rightsTitle'), body: t('legal.rightsBody') },
        { title: t('legal.contactTitle'), body: t('legal.contactBody') },
      ]
    : [
        { title: t('legal.termsIntroTitle'), body: t('legal.termsIntroBody') },
        { title: t('legal.acceptanceTitle'), body: t('legal.acceptanceBody') },
        { title: t('legal.serviceDescTitle'), body: t('legal.serviceDescBody') },
        { title: t('legal.subscriptionTermsTitle'), body: t('legal.subscriptionTermsBody') },
        { title: t('legal.disclaimerTitle'), body: t('legal.disclaimerBody') },
        { title: t('legal.limitationTitle'), body: t('legal.limitationBody') },
        { title: t('legal.terminationTitle'), body: t('legal.terminationBody') },
        { title: t('legal.governingLawTitle'), body: t('legal.governingLawBody') },
        { title: t('legal.contactTermsTitle'), body: t('legal.contactTermsBody') },
      ];

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.surfaceGlass, borderColor: c.borderLight }]}>
            <Ionicons name="arrow-back" size={22} color={c.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.text }]}>{t('legal.title')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'privacy' && styles.tabActive]}
            onPress={() => setActiveTab('privacy')}
          >
            <Text style={[styles.tabText, activeTab === 'privacy' && styles.tabTextActive]}>
              {t('legal.privacyTab')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'terms' && styles.tabActive]}
            onPress={() => setActiveTab('terms')}
          >
            <Text style={[styles.tabText, activeTab === 'terms' && styles.tabTextActive]}>
              {t('legal.termsTab')}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Text style={[styles.lastUpdated, { color: c.textMuted }]}>
            {t('legal.lastUpdated')}
          </Text>

          {sections.map((s, i) => (
            <View key={i} style={[styles.section, { backgroundColor: c.surfaceGlass }]}>
              <Text style={[styles.sectionTitle, { color: c.text }]}>{s.title}</Text>
              <Text style={[styles.sectionBody, { color: c.textSecondary }]}>{s.body}</Text>
            </View>
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: SPACING.lg, paddingBottom: 20 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.lg, marginBottom: SPACING.md,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 14,
    borderWidth: 1, justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700' },
  tabBar: {
    flexDirection: 'row', marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md, backgroundColor: COLORS.surfaceGlass,
    borderRadius: 14, padding: 4,
  },
  tab: {
    flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: '#FFF',
  },
  lastUpdated: {
    fontSize: FONT_SIZE.xs, textAlign: 'center', marginBottom: SPACING.md,
  },
  section: {
    borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.sm, ...SHADOWS.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md, fontWeight: '700', marginBottom: SPACING.xs,
  },
  sectionBody: {
    fontSize: FONT_SIZE.sm, lineHeight: 22,
  },
});
