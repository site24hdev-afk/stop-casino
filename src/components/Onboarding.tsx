import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { UserData } from '../types';

interface Props {
  onComplete: (data: Partial<UserData>) => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [averageSpend, setAverageSpend] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const handleFinish = () => {
    onComplete({
      quitDate: new Date().toISOString(),
      averageDailySpend: Number(averageSpend) || 50,
      trustedContactName: contactName,
      trustedContactPhone: contactPhone,
      cravingsOvercome: 0,
      onboarded: true,
    });
  };

  const steps = [
    // Étape 0 — Bienvenue
    <View key="welcome" style={styles.stepContainer}>
      <View style={styles.iconCircle}>
        <Ionicons name="shield-checkmark" size={64} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>Bienvenue</Text>
      <Text style={styles.description}>
        Cette app est ton allié pour arrêter le casino.{'\n\n'}
        Pas de jugement. Pas de compte à rendre.{'\n'}
        Juste toi et ta décision de reprendre le contrôle.
      </Text>
      <Text style={styles.privacy}>
        <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} />
        {' '}Toutes tes données restent sur ton téléphone.
      </Text>
      <TouchableOpacity style={styles.nextButton} onPress={() => setStep(1)}>
        <Text style={styles.nextText}>Commencer</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>,

    // Étape 1 — Dépense moyenne
    <KeyboardAvoidingView
      key="spend"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.stepContainer}
    >
      <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.iconCircle, { backgroundColor: COLORS.warningBg }]}>
          <Ionicons name="wallet" size={48} color={COLORS.warning} />
        </View>
        <Text style={styles.title}>Combien dépensais-tu ?</Text>
        <Text style={styles.description}>
          En moyenne, combien dépensais-tu par jour au casino ?{'\n'}
          Ça servira à calculer l'argent que tu économises.
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={averageSpend}
            onChangeText={setAverageSpend}
            keyboardType="numeric"
            placeholder="50"
            placeholderTextColor={COLORS.textMuted}
            maxLength={5}
          />
          <Text style={styles.inputUnit}>€ / jour</Text>
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={() => setStep(2)}>
          <Text style={styles.nextText}>Suivant</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>,

    // Étape 2 — Proche de confiance
    <KeyboardAvoidingView
      key="contact"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.stepContainer}
    >
      <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.iconCircle, { backgroundColor: COLORS.infoBg }]}>
          <Ionicons name="people" size={48} color={COLORS.info} />
        </View>
        <Text style={styles.title}>Ton proche de confiance</Text>
        <Text style={styles.description}>
          Quelqu'un à appeler quand l'envie est forte.{'\n'}
          Tu peux sauter cette étape et l'ajouter plus tard.
        </Text>
        <TextInput
          style={styles.inputFull}
          value={contactName}
          onChangeText={setContactName}
          placeholder="Prénom"
          placeholderTextColor={COLORS.textMuted}
        />
        <TextInput
          style={styles.inputFull}
          value={contactPhone}
          onChangeText={setContactPhone}
          placeholder="Numéro de téléphone"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.nextButton} onPress={handleFinish}>
          <Text style={styles.nextText}>C'est parti</Text>
          <Ionicons name="checkmark" size={20} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={handleFinish}>
          <Text style={styles.skipText}>Passer cette étape</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>,
  ];

  return <View style={styles.container}>{steps[step]}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  stepContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: SPACING.lg,
  },
  privacy: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    width: 120,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputUnit: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  inputFull: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  nextText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: '#FFF',
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: SPACING.md,
    marginTop: SPACING.sm,
  },
  skipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
});
