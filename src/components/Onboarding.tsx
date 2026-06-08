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
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { IMAGES } from '../constants/images';
import { UserData } from '../types';

const { width, height } = Dimensions.get('window');

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
      <View style={styles.imageContainer}>
        <Image
          source={IMAGES.onboarding.welcome}
          style={styles.stepImage}
          contentFit="cover"
          transition={600}
        />
        <View style={styles.imageOverlay} />
        <View style={styles.imageContent}>
          <View style={styles.iconBadge}>
            <Ionicons name="shield-checkmark" size={28} color="#FFF" />
          </View>
        </View>
      </View>

      <View style={styles.textArea}>
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
      </View>

      {/* Dots */}
      <View style={styles.dots}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
        ))}
      </View>
    </View>,

    // Étape 1 — Dépense moyenne
    <KeyboardAvoidingView
      key="spend"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.stepContainer}
    >
      <View style={styles.imageContainer}>
        <Image
          source={IMAGES.onboarding.money}
          style={styles.stepImage}
          contentFit="cover"
          transition={600}
        />
        <View style={styles.imageOverlay} />
        <View style={styles.imageContent}>
          <View style={[styles.iconBadge, { backgroundColor: 'rgba(245,158,11,0.9)' }]}>
            <Ionicons name="wallet" size={28} color="#FFF" />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.textArea} showsVerticalScrollIndicator={false}>
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

      <View style={styles.dots}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
        ))}
      </View>
    </KeyboardAvoidingView>,

    // Étape 2 — Proche de confiance
    <KeyboardAvoidingView
      key="contact"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.stepContainer}
    >
      <View style={styles.imageContainer}>
        <Image
          source={IMAGES.onboarding.community}
          style={styles.stepImage}
          contentFit="cover"
          transition={600}
        />
        <View style={styles.imageOverlay} />
        <View style={styles.imageContent}>
          <View style={[styles.iconBadge, { backgroundColor: 'rgba(59,130,246,0.9)' }]}>
            <Ionicons name="people" size={28} color="#FFF" />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.textArea} showsVerticalScrollIndicator={false}>
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

      <View style={styles.dots}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.dot, i === 2 && styles.dotActive]} />
        ))}
      </View>
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
  },

  // Image hero en haut
  imageContainer: {
    height: height * 0.38,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  stepImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15,23,42,0.4)',
  },
  imageContent: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(16,185,129,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // Texte en bas
  textArea: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
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

  // Dots
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceLight,
  },
  dotActive: {
    width: 24,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },

  // Inputs
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
    paddingVertical: 16,
    paddingHorizontal: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
