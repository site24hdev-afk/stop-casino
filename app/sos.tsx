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
  const maxSteps = limits.sosSteps;
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(SOS_STEPS[0].durationSeconds);
  const [timerActive, setTimerActive] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [showGameOption, setShowGameOption] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

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

  useEffect(() => {
    const step = SOS_STEPS[currentStep];
    if (step.durationSeconds === 0) return;
    const progress = 1 - timer / step.durationSeconds;
    Animated.timing(progressAnim, { toValue: progress, duration: 300, useNativeDriver: false }).start();
  }, [timer]);

  const step = SOS_STEPS[currentStep];

  const handleNext = () => {
    const nextIdx = currentStep + 1;
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

  // Game option screen
  if (showGameOption && !completed) {
    return (
      <View style={styles.root}>
        <LinearGradient colors={GRADIENTS.screenBg} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.centeredContainer}>
          <View style={styles.resultCircle}>
            <LinearGradient colors={['rgba(245,158,11,0.20)', 'rgba(245,158,11,0.05)']} style={styles.resultCircleGrad}>
              <Ionicons name="game-controller" size={56} color={COLORS.warning} />
            </LinearGradient>
          </View>
          <Text style={styles.resultTitle}>{t('sos.urgePersists')}</Text>
          <Text style={styles.resultText}>{t('sos.urgePersistsText')}</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleOvercome}>
            <LinearGradient colors={GRADIENTS.menuGreen} style={styles.primaryBtnGrad}>
              <Text style={styles.primaryBtnText}>{t('sos.iHeldStrong')}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.replace('/jeux')}>
            <Text style={styles.secondaryBtnText}>{t('sos.simulatedGame')}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  // Completed screen
  if (completed) {
    return (
      <View style={styles.root}>
        <LinearGradient colors={GRADIENTS.screenBg} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.centeredContainer}>
          <View style={styles.resultCircle}>
            <LinearGradient colors={['rgba(16,185,129,0.20)', 'rgba(16,185,129,0.05)']} style={styles.resultCircleGrad}>
              <Ionicons name="checkmark-circle" size={72} color={COLORS.primary} />
            </LinearGradient>
          </View>
          <Text style={[styles.resultTitle, { color: COLORS.primary }]}>{t('sos.bravo')}</Text>
          <Text style={styles.resultText}>{t('sos.bravoText')}</Text>
          <Text style={styles.resultCount}>
            {userData.cravingsOvercome > 0
              ? t('sos.cravingsCountPlural', { count: userData.cravingsOvercome + 1 })
              : t('sos.cravingsCount', { count: 1 })}
          </Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.back()}>
            <LinearGradient colors={GRADIENTS.menuGreen} style={styles.primaryBtnGrad}>
              <Text style={styles.primaryBtnText}>{t('sos.backHome')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  // Main SOS screen
  return (
    <View style={styles.root}>
      <LinearGradient colors={GRADIENTS.screenSOS} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('sos.sosUrge')}</Text>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{currentStep + 1}/{SOS_STEPS.length}</Text>
          </View>
        </View>

        {/* Steps progress */}
        <View style={styles.stepsBar}>
          {SOS_STEPS.map((_, i) => (
            <View key={i} style={[styles.stepDot, i <= currentStep && styles.stepDotActive, i < currentStep && styles.stepDotDone]} />
          ))}
        </View>

        {/* Main content */}
        <View style={styles.mainContent}>
          <Animated.View style={[styles.iconCircle, { transform: [{ scale: pulseAnim }] }]}>
            <LinearGradient colors={['rgba(239,68,68,0.20)', 'rgba(239,68,68,0.05)']} style={styles.iconCircleGrad}>
              <Ionicons name={step.icon as any} size={52} color={COLORS.text} />
            </LinearGradient>
          </Animated.View>
          <Text style={styles.stepTitle}>{t(step.titleKey)}</Text>
          <Text style={styles.stepDesc}>{t(step.descKey)}</Text>

          {step.durationSeconds > 0 && (
            <View style={styles.timerWrap}>
              <Text style={styles.timerText}>{formatTime(timer)}</Text>
              <View style={styles.progressBar}>
                <Animated.View style={[styles.progressFill, {
                  width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                }]} />
              </View>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {timer === 0 || step.durationSeconds === 0 ? (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <LinearGradient colors={GRADIENTS.menuGreen} style={styles.nextBtnGrad}>
                <Text style={styles.nextBtnText}>
                  {currentStep < SOS_STEPS.length - 1 ? t('sos.nextStep') : t('sos.iResisted')}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.waitRow}>
              <Ionicons name="time-outline" size={18} color={COLORS.textMuted} />
              <Text style={styles.waitText}>{t('sos.waitExercise')}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.overcomeBtn} onPress={handleOvercome}>
            <Text style={styles.overcomeText}>{t('sos.urgePassed')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: SPACING.lg },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.xl },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  headerBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: COLORS.surfaceGlass, borderWidth: 1, borderColor: COLORS.borderLight, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.danger },
  stepBadge: { backgroundColor: COLORS.surfaceGlass, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1, borderColor: COLORS.borderLight },
  stepBadgeText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, fontWeight: '600' },

  // Steps
  stepsBar: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm, marginBottom: SPACING.xxl },
  stepDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: COLORS.surfaceLight },
  stepDotActive: { backgroundColor: COLORS.danger },
  stepDotDone: { backgroundColor: COLORS.primary },

  // Main
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  iconCircle: { width: 120, height: 120, borderRadius: 60, marginBottom: SPACING.xl, overflow: 'hidden' },
  iconCircleGrad: { width: '100%', height: '100%', borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
  stepTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.md, textAlign: 'center' },
  stepDesc: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 26, paddingHorizontal: SPACING.lg },

  // Timer
  timerWrap: { marginTop: SPACING.xl, alignItems: 'center', width: '80%' },
  timerText: { fontSize: FONT_SIZE.hero, fontWeight: '900', color: COLORS.text, marginBottom: SPACING.md },
  progressBar: { width: '100%', height: 6, backgroundColor: COLORS.surface, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },

  // Actions
  actions: { paddingBottom: 40, gap: SPACING.md },
  nextBtn: { borderRadius: BORDER_RADIUS.lg, overflow: 'hidden', ...SHADOWS.sm },
  nextBtnGrad: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.sm, paddingVertical: 16 },
  nextBtnText: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: '#FFF' },
  waitRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.md },
  waitText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, fontStyle: 'italic' },
  overcomeBtn: { alignSelf: 'center', paddingVertical: SPACING.sm },
  overcomeText: { fontSize: FONT_SIZE.md, color: COLORS.primaryLight, fontWeight: '600' },

  // Result screens
  resultCircle: { width: 140, height: 140, borderRadius: 70, marginBottom: SPACING.xl, overflow: 'hidden' },
  resultCircleGrad: { width: '100%', height: '100%', borderRadius: 70, justifyContent: 'center', alignItems: 'center' },
  resultTitle: { fontSize: 32, fontWeight: '900', color: COLORS.text, marginBottom: SPACING.md },
  resultText: { fontSize: FONT_SIZE.lg, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 28, marginBottom: SPACING.lg },
  resultCount: { fontSize: FONT_SIZE.md, color: COLORS.textMuted, marginBottom: SPACING.xxl },
  primaryBtn: { borderRadius: BORDER_RADIUS.lg, overflow: 'hidden', width: '100%', marginBottom: SPACING.md, ...SHADOWS.sm },
  primaryBtnGrad: { paddingVertical: 16, alignItems: 'center' },
  primaryBtnText: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: '#FFF' },
  secondaryBtn: { backgroundColor: COLORS.surfaceGlass, borderRadius: BORDER_RADIUS.lg, paddingVertical: 14, paddingHorizontal: SPACING.xl, borderWidth: 1, borderColor: COLORS.borderLight },
  secondaryBtnText: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text },
});
