import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../src/constants/theme';
import { useUserData } from '../src/hooks/useUserData';

export default function AideScreen() {
  const router = useRouter();
  const { userData } = useUserData();

  const handleCall = (number: string, name: string) => {
    Alert.alert(
      `Appeler ${name}`,
      `Numéro : ${number}`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Appeler', onPress: () => Linking.openURL(`tel:${number}`) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aide</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Joueurs Info Service */}
      <TouchableOpacity
        style={styles.mainCard}
        onPress={() => handleCall('0974751313', 'Joueurs Info Service')}
      >
        <View style={styles.mainIcon}>
          <Ionicons name="headset" size={36} color={COLORS.info} />
        </View>
        <Text style={styles.mainTitle}>Joueurs Info Service</Text>
        <Text style={styles.mainNumber}>09 74 75 13 13</Text>
        <Text style={styles.mainDescription}>
          Service national d'aide aux joueurs.{'\n'}
          Appel non surtaxé, anonyme et confidentiel.{'\n'}
          Du lundi au vendredi, 8h-2h.
        </Text>
        <View style={styles.callBadge}>
          <Ionicons name="call" size={18} color="#FFF" />
          <Text style={styles.callBadgeText}>Appeler maintenant</Text>
        </View>
      </TouchableOpacity>

      {/* Proche de confiance */}
      {userData.trustedContactName ? (
        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => handleCall(
            userData.trustedContactPhone,
            userData.trustedContactName
          )}
        >
          <View style={[styles.contactIcon, { backgroundColor: COLORS.primaryBg }]}>
            <Ionicons name="person-circle" size={32} color={COLORS.primary} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{userData.trustedContactName}</Text>
            <Text style={styles.contactLabel}>Ton proche de confiance</Text>
          </View>
          <View style={styles.contactCallIcon}>
            <Ionicons name="call" size={20} color={COLORS.primary} />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.contactCard}>
          <View style={[styles.contactIcon, { backgroundColor: COLORS.surfaceLight }]}>
            <Ionicons name="person-add" size={24} color={COLORS.textMuted} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={[styles.contactName, { color: COLORS.textMuted }]}>
              Aucun proche enregistré
            </Text>
            <Text style={styles.contactLabel}>
              Tu pourras en ajouter un plus tard
            </Text>
          </View>
        </View>
      )}

      {/* Ressources */}
      <View style={styles.resourcesSection}>
        <Text style={styles.sectionTitle}>Ressources utiles</Text>

        <TouchableOpacity
          style={styles.resourceCard}
          onPress={() => Linking.openURL('https://www.joueurs-info-service.fr')}
        >
          <Ionicons name="globe-outline" size={20} color={COLORS.info} />
          <Text style={styles.resourceText}>joueurs-info-service.fr</Text>
          <Ionicons name="open-outline" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resourceCard}
          onPress={() => Linking.openURL('https://www.adictel.com')}
        >
          <Ionicons name="globe-outline" size={20} color={COLORS.info} />
          <Text style={styles.resourceText}>adictel.com — auto-exclusion</Text>
          <Ionicons name="open-outline" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resourceCard}
          onPress={() => handleCall('3114', 'Numéro national de prévention du suicide')}
        >
          <Ionicons name="heart-outline" size={20} color={COLORS.danger} />
          <Text style={styles.resourceText}>3114 — Prévention du suicide</Text>
          <Ionicons name="call-outline" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Message */}
      <View style={styles.messageCard}>
        <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
        <Text style={styles.messageText}>
          Demander de l'aide est un signe de force, pas de faiblesse.
        </Text>
      </View>
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
  // Main card
  mainCard: {
    backgroundColor: COLORS.infoBg,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  mainIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  mainTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  mainNumber: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
    color: COLORS.info,
    letterSpacing: 2,
    marginBottom: SPACING.md,
  },
  mainDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  callBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.info,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.sm,
  },
  callBadgeText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: '#FFF',
  },
  // Contact
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  contactLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  contactCallIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Resources
  resourcesSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  resourceText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
  },
  // Message
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  messageText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 22,
  },
});
