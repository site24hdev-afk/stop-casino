import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../src/constants/theme';
import { SOS_STEPS } from '../src/constants/messages';
import { useUserData } from '../src/hooks/useUserData';
import { useSubscription } from '../src/hooks/useSubscription';
import { t } from '../src/i18n';

export default function SOSScreen() {
  const router = useRouter();
  const { incrementCravingsOvercome, userData } = useUserData();
  const { limits } = useSubscription();
  const maxSteps = limits.sosSteps; // 2 pour gratuit, 4 pour payant
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(SOS_STEPS[0].durationSeconds);
  const [timerActive, setTimerActive] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [showGameOption, setShowGameOption] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Animation de pulsation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Timer
  useEffect(() => {
    if (!timerActive || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, currentStep]);

  // Progress bar
  useEffect(() => {
    const step = SOS_STEPS[currentStep];
    if (step.durationSeconds === 0) return;
    const progress = 1 - timer / step.durationSeconds;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [timer]);

  const step = SOS_STEPS[currentStep];

  const handleNext = () => {
    const nextIdx = currentStep + 1;
    // Vérifier la limite du tier (gratuit = 2 étapes, payant = 4)
    if (nextIdx >= maxSteps && maxSteps < SOS_STEPS.length) {
      Alert.alert(
        t('sos.lockedTitle'),
        t('sos.lockedText', { current: maxSteps, total: SOS_STEPS.length }),
        [
          { text: t('sos.urgePassed'), onPress: handleOvercome },
          { text: t('sos.unlockAll'), onPress: () => router.push('/abonnement') },
        ]
      );
      return;
    }
    if (currentStep < SOS_STEPS.length - 1) {
      setCurrentStep(nextIdx);
      setTimer(SOS_STEPS[nextIdx].durationSeconds);
      setTimerActive(true);
      progressAnim.setValue(0);
    } else {
      // Après toutes les étapes, proposer le jeu simulé en dernier recours
      setShowGameOption(true);
    }
  };

  const handleOvercome = async () => {
    await incrementCravingsOvercome();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCompleted(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (showGameOption && !completed) {
    return (
      <SafeAreaView style={styles.completedContainer}>
        <View style={[styles.completedCircle, { backgroundColor: COLORS.warningBg }]}>
          <Ionicons name="game-controller-outline" size={60} color={COLORS.warning} />
        </View>
        <Text style={styles.completedTitle}>{t('sos.urgePersists')}</Text>
        <Text style={styles.completedText}>{t('sos.urgePersistsText')}</Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: COLORS.primary, marginBottom: SPACING.md }]}
          onPress={handleOvercome}
          accessibilityRole="button"
          accessibilityLabel="I held strong"
        >
          <Text style={[styles.backButtonText, { color: '#FFF' }]}>{t('sos.iHeldStrong')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: COLORS.surface }]}
          onPress={() => router.replace('/jeux')}
          accessibilityRole="button"
          accessibilityLabel="Play simulated game"
        >
          <Text style={styles.backButtonText}>{t('sos.simulatedGame')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (completed) {
    return (
      <SafeAreaView style={styles.completedContainer}>
        <View style={styles.completedCircle}>
          <Ionicons name="checkmark-circle" size={80} color={COLORS.primary} />
        </View>
        <Text style={styles.completedTitle}>{t('sos.bravo')}</Text>
        <Text style={styles.completedText}>{t('sos.bravoText')}</Text>
        <Text style={styles.completedCount}>
          {userData.cravingsOvercome > 0
            ? t('sos.cravingsCountPlural', { count: userData.cravingsOvercome + 1 })
            : t('sos.cravingsCount', { count: 1 })}
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('back')}
        >
          <Text style={styles.backButtonText}>{t('sos.backHome')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityRole="button" accessibilityLabel={t('close')}>
          <Ionicons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} accessibilityRole="header">{t('sos.sosUrge')}</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>{currentStep + 1}/{SOS_STEPS.length}</Text>
        </View>
      </View>

      {/* Progression steps */}
      <View style={styles.stepsBar}>
        {SOS_STEPS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.stepDot,
              i <= currentStep && styles.stepDotActive,
              i < currentStep && styles.stepDotDone,
            ]}
          />
        ))}
      </View>

      {/* Contenu principal */}
      <View style={styles.mainContent}>
        <Animated.View
          style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}
        >
          <Ionicons name={step.icon as any} size={56} color={COLORS.text} />
        </Animated.View>

        <Text style={styles.stepTitle}>{t(step.titleKey)}</Text>
        <Text style={styles.stepDescription}>{t(step.descKey)}</Text>

        {/* Timer */}
        {step.durationSeconds > 0 && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {timer === 0 || step.durationSeconds === 0 ? (
          <TouchableOpacity style={styles.primaryButton} onPress={handleNext} accessibilityRole="button" accessibilityLabel={currentStep < SOS_STEPS.length - 1 ? "Next step" : "I resisted"}>
            <Text style={styles.primaryButtonText}>
              {currentStep < SOS_STEPS.length - 1 ? t('sos.nextStep') : t('sos.iResisted')}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.waitingMessage}>
            <Ionicons name="time-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.waitingText}>{t('sos.waitExercise')}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.overcomeButton}
          onPress={handleOvercome}
          accessibilityRole="button"
          accessibilityLabel="Urge has passed"
        >
          <Text style={styles.overcomeText}>{t('sos.urgePassed')}</Text>
        </TouchableOpacity>
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
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.danger,
  },
  stepIndicator: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  stepText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  stepsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xxl,
  },
  stepDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.surfaceLight,
  },
  stepDotActive: {
    backgroundColor: COLORS.danger,
  },
  stepDotDone: {
    backgroundColor: COLORS.primary,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.dangerBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  stepTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  stepDescription: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: SPACING.lg,
  },
  timerContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
    width: '80%',
  },
  timerText: {
    fontSize: FONT_SIZE.hero,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  actions: {
    paddingBottom: 40,
    gap: SPACING.md,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  primaryButtonText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: '#FFF',
  },
  waitingMessage: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  waitingText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  overcomeButton: {
    alignSelf: 'center',
    paddingVertical: SPACING.sm,
  },
  overcomeText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  // Completed
  completedContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  completedCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  completedTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  completedText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: SPACING.lg,
  },
  completedCount: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textMuted,
    marginBottom: SPACING.xxl,
  },
  backButton: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  backButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
});
