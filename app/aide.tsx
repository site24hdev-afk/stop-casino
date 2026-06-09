import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../src/constants/theme';
import { useUserData } from '../src/hooks/useUserData';
import { t } from '../src/i18n';

export default function AideScreen() {
  const router = useRouter();
  const { userData } = useUserData();

  const handleCall = (number: string, name: string) => {
    Alert.alert(
      t('aide.callConfirm', { name }),
      t('aide.callNumber', { number }),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('aide.call'), onPress: () => Linking.openURL(`tel:${number}`) },
      ]
    );
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
          <Text style={styles.headerTitle}>{t('aide.title')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Emergency Card */}
          <TouchableOpacity
            style={styles.mainCard}
            onPress={() => handleCall(t('aide.emergencyNumber').replace(/\s/g, ''), t('aide.emergencyName'))}
            activeOpacity={0.8}
          >
            <LinearGradient colors={['rgba(59,130,246,0.15)', 'rgba(59,130,246,0.04)']} style={styles.mainCardGrad}>
              <View style={styles.mainIcon}>
                <LinearGradient colors={GRADIENTS.menuBlue} style={styles.mainIconGrad}>
                  <Ionicons name="headset" size={32} color="#FFF" />
                </LinearGradient>
              </View>
              <Text style={styles.mainTitle}>{t('aide.emergencyName')}</Text>
              <Text style={styles.mainNumber}>{t('aide.emergencyNumber')}</Text>
              <Text style={styles.mainDesc}>{t('aide.emergencyFullDesc')}</Text>
              <LinearGradient colors={GRADIENTS.menuBlue} style={styles.callBadge}>
                <Ionicons name="call" size={18} color="#FFF" />
                <Text style={styles.callBadgeText}>{t('aide.callNow')}</Text>
              </LinearGradient>
            </LinearGradient>
          </TouchableOpacity>

          {/* Trusted Contact */}
          {userData.trustedContactName ? (
            <TouchableOpacity
              style={styles.contactCard}
              onPress={() => handleCall(userData.trustedContactPhone, userData.trustedContactName)}
              activeOpacity={0.7}
            >
              <View style={styles.contactIcon}>
                <LinearGradient colors={GRADIENTS.menuGreen} style={styles.contactIconGrad}>
                  <Ionicons name="person" size={22} color="#FFF" />
                </LinearGradient>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{userData.trustedContactName}</Text>
                <Text style={styles.contactLabel}>{t('aide.trustedContact')}</Text>
              </View>
              <View style={styles.contactCallBtn}>
                <Ionicons name="call" size={18} color={COLORS.primary} />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.contactCard}>
              <View style={styles.contactIcon}>
                <View style={styles.contactIconEmpty}>
                  <Ionicons name="person-add" size={20} color={COLORS.textMuted} />
                </View>
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactName, { color: COLORS.textMuted }]}>{t('aide.noContact')}</Text>
                <Text style={styles.contactLabel}>{t('aide.noContactSub')}</Text>
              </View>
            </View>
          )}

          {/* Resources */}
          <Text style={styles.sectionTitle}>{t('aide.resources')}</Text>

          <TouchableOpacity style={styles.resourceCard} onPress={() => Linking.openURL(t('aide.resource1Url'))} activeOpacity={0.7}>
            <View style={[styles.resourceIcon, { backgroundColor: COLORS.infoBg }]}>
              <Ionicons name="globe" size={18} color={COLORS.info} />
            </View>
            <Text style={styles.resourceText}>{t('aide.resource1Name')}</Text>
            <Ionicons name="open-outline" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceCard} onPress={() => Linking.openURL(t('aide.resource2Url'))} activeOpacity={0.7}>
            <View style={[styles.resourceIcon, { backgroundColor: COLORS.infoBg }]}>
              <Ionicons name="globe" size={18} color={COLORS.info} />
            </View>
            <Text style={styles.resourceText}>{t('aide.resource2Name')}</Text>
            <Ionicons name="open-outline" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceCard} onPress={() => handleCall(t('aide.resource3Number'), t('aide.resource3FullName'))} activeOpacity={0.7}>
            <View style={[styles.resourceIcon, { backgroundColor: COLORS.dangerBg }]}>
              <Ionicons name="heart" size={18} color={COLORS.danger} />
            </View>
            <Text style={styles.resourceText}>{t('aide.resource3Name')}</Text>
            <Ionicons name="call-outline" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>

          {/* Footer message */}
          <View style={styles.messageCard}>
            <Ionicons name="shield-checkmark" size={18} color={COLORS.primary} />
            <Text style={styles.messageText}>{t('aide.helpMessage')}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  safeArea: { flex: 1, paddingHorizontal: SPACING.lg },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  backBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: COLORS.surfaceGlass, borderWidth: 1, borderColor: COLORS.borderLight, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text },

  // Main Card
  mainCard: { borderRadius: 22, overflow: 'hidden', marginBottom: SPACING.lg, ...SHADOWS.sm },
  mainCardGrad: { padding: SPACING.xl, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(59,130,246,0.15)', borderRadius: 22 },
  mainIcon: { width: 64, height: 64, borderRadius: 20, overflow: 'hidden', marginBottom: SPACING.md },
  mainIconGrad: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  mainTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  mainNumber: { fontSize: FONT_SIZE.xxl, fontWeight: '900', color: COLORS.infoLight, letterSpacing: 2, marginBottom: SPACING.md },
  mainDesc: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: SPACING.lg },
  callBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: 10, borderRadius: BORDER_RADIUS.full, gap: SPACING.sm },
  callBadgeText: { fontSize: FONT_SIZE.md, fontWeight: '700', color: '#FFF' },

  // Contact
  contactCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.surfaceGlass, borderRadius: 18, padding: 16,
    marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.borderGlass,
  },
  contactIcon: { width: 48, height: 48, borderRadius: 16, overflow: 'hidden' },
  contactIconGrad: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  contactIconEmpty: { width: '100%', height: '100%', backgroundColor: COLORS.surfaceLight, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  contactInfo: { flex: 1 },
  contactName: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  contactLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: 2 },
  contactCallBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: COLORS.primaryBg, justifyContent: 'center', alignItems: 'center' },

  // Resources
  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  resourceCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surfaceGlass, borderRadius: 14, padding: 14,
    marginBottom: 8, borderWidth: 1, borderColor: COLORS.borderGlass,
  },
  resourceIcon: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  resourceText: { flex: 1, fontSize: FONT_SIZE.sm, color: COLORS.text },

  // Message
  messageCard: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.primaryBg, borderRadius: 16, padding: SPACING.lg, marginTop: SPACING.md,
  },
  messageText: { flex: 1, fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 22 },
});
