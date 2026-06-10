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
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { IMAGES } from '../constants/images';
import i18n, { t } from '../i18n';
import { UserData } from '../types';

const { width, height } = Dimensions.get('window');
const TOTAL_STEPS = 4;

interface Props {
  onComplete: (data: Partial<UserData>) => void;
}

// Options rapides pour la date d'arrêt
const DATE_OPTIONS = [
  { key: 'today', labelKey: 'onboardingExtra.today', icon: 'sunny' as const, days: 0 },
  { key: 'yesterday', labelKey: 'onboardingExtra.yesterday', icon: 'time' as const, days: 1 },
  { key: '3days', labelKey: 'onboardingExtra.threeDaysAgo', icon: 'calendar' as const, days: 3 },
  { key: '1week', labelKey: 'onboardingExtra.oneWeekAgo', icon: 'calendar-outline' as const, days: 7 },
  { key: '1month', labelKey: 'onboardingExtra.oneMonthAgo', icon: 'calendar-clear' as const, days: 30 },
];

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [averageSpend, setAverageSpend] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Date d'arrêt
  const [quitDate, setQuitDate] = useState(new Date());
  const [dateOption, setDateOption] = useState('today');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectDateOption = (key: string, days: number) => {
    setDateOption(key);
    setShowDatePicker(false);
    const d = new Date();
    d.setDate(d.getDate() - days);
    d.setHours(0, 0, 0, 0);
    setQuitDate(d);
  };

  const onDatePickerChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) {
      setQuitDate(selectedDate);
      setDateOption('custom');
    }
  };

  const formatDate = (d: Date) => {
    const locale = i18n.locale || 'fr';
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleFinish = () => {
    onComplete({
      quitDate: quitDate.toISOString(),
      averageDailySpend: Number(averageSpend) || 50,
      trustedContactName: contactName,
      trustedContactPhone: contactPhone,
      cravingsOvercome: 0,
      onboarded: true,
    });
  };

  const renderDots = (activeIdx: number) => (
    <View style={styles.dots}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <View key={i} style={[styles.dot, i === activeIdx && styles.dotActive]} />
      ))}
    </View>
  );

  const steps = [
    // ═══ Étape 0 — Bienvenue ═══
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
        <Text style={styles.title}>{t('onboarding.welcome')}</Text>
        <Text style={styles.description}>{t('onboarding.welcomeText')}</Text>
        <Text style={styles.privacy}>
          <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} />
          {' '}{t('onboarding.privacy')}
        </Text>
        <TouchableOpacity style={styles.nextButton} onPress={() => setStep(1)}>
          <Text style={styles.nextText}>{t('onboarding.start')}</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
      {renderDots(0)}
    </View>,

    // ═══ Étape 1 — Dépense moyenne ═══
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
        <Text style={styles.title}>{t('onboarding.spendTitle')}</Text>
        <Text style={styles.description}>{t('onboarding.spendText')}</Text>
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
          <Text style={styles.inputUnit}>{t('onboarding.perDay')}</Text>
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={() => setStep(2)}>
          <Text style={styles.nextText}>{t('next')}</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
      {renderDots(1)}
    </KeyboardAvoidingView>,

    // ═══ Étape 2 — Date d'arrêt (NOUVEAU) ═══
    <View key="quitdate" style={styles.stepContainer}>
      <View style={styles.imageContainerSmall}>
        <Image
          source={IMAGES.onboarding.quitDate}
          style={styles.stepImage}
          contentFit="cover"
          transition={600}
        />
        <View style={styles.imageOverlay} />
        <View style={styles.imageContent}>
          <View style={[styles.iconBadge, { backgroundColor: 'rgba(16,185,129,0.9)' }]}>
            <Ionicons name="calendar" size={28} color="#FFF" />
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.dateArea} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('onboardingExtra.dateTitle')}</Text>
        <Text style={styles.description}>
          {t('onboardingExtra.dateDesc')}
        </Text>

        {/* Quick options */}
        <View style={styles.dateOptions}>
          {DATE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.dateOptionBtn,
                dateOption === opt.key && styles.dateOptionBtnActive,
              ]}
              onPress={() => selectDateOption(opt.key, opt.days)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={opt.icon}
                size={18}
                color={dateOption === opt.key ? COLORS.primary : COLORS.textMuted}
              />
              <Text
                style={[
                  styles.dateOptionText,
                  dateOption === opt.key && styles.dateOptionTextActive,
                ]}
              >
                {t(opt.labelKey)}
              </Text>
              {dateOption === opt.key && (
                <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}

          {/* Custom date picker button */}
          <TouchableOpacity
            style={[
              styles.dateOptionBtn,
              dateOption === 'custom' && styles.dateOptionBtnActive,
            ]}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="create"
              size={18}
              color={dateOption === 'custom' ? COLORS.primary : COLORS.textMuted}
            />
            <Text
              style={[
                styles.dateOptionText,
                dateOption === 'custom' && styles.dateOptionTextActive,
              ]}
            >
              {t('onboardingExtra.chooseDate')}
            </Text>
            {dateOption === 'custom' && (
              <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Selected date display */}
        <View style={styles.selectedDateCard}>
          <Ionicons name="flag" size={18} color={COLORS.primary} />
          <Text style={styles.selectedDateText}>{formatDate(quitDate)}</Text>
        </View>

        {/* Date picker (iOS inline, Android modal) */}
        {showDatePicker && (
          <DateTimePicker
            value={quitDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDatePickerChange}
            maximumDate={new Date()}
            locale="fr-FR"
            style={styles.datePicker}
          />
        )}

        {!showDatePicker && (
          <TouchableOpacity style={styles.nextButton} onPress={() => setStep(3)}>
            <Text style={styles.nextText}>{t('next')}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        )}

        {showDatePicker && Platform.OS === 'ios' && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => {
              setShowDatePicker(false);
              setDateOption('custom');
            }}
          >
            <Text style={styles.nextText}>{t('onboardingExtra.validate')}</Text>
            <Ionicons name="checkmark" size={20} color="#FFF" />
          </TouchableOpacity>
        )}
      </ScrollView>
      {renderDots(2)}
    </View>,

    // ═══ Étape 3 — Proche de confiance ═══
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
        <Text style={styles.title}>{t('onboarding.contactTitle')}</Text>
        <Text style={styles.description}>{t('onboarding.contactText')}</Text>
        <TextInput
          style={styles.inputFull}
          value={contactName}
          onChangeText={setContactName}
          placeholder={t('onboarding.firstName')}
          placeholderTextColor={COLORS.textMuted}
        />
        <TextInput
          style={styles.inputFull}
          value={contactPhone}
          onChangeText={setContactPhone}
          placeholder={t('onboarding.phone')}
          placeholderTextColor={COLORS.textMuted}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.nextButton} onPress={handleFinish}>
          <Text style={styles.nextText}>{t('onboarding.letsGo')}</Text>
          <Ionicons name="checkmark" size={20} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={handleFinish}>
          <Text style={styles.skipText}>{t('onboarding.skipStep')}</Text>
        </TouchableOpacity>
      </ScrollView>
      {renderDots(3)}
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
  imageContainerSmall: {
    height: height * 0.25,
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
  dateArea: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
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

  // Date options
  dateOptions: {
    gap: 8,
    marginBottom: SPACING.md,
  },
  dateOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surfaceGlass,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  dateOptionBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(16,185,129,0.06)',
  },
  dateOptionText: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  dateOptionTextActive: {
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Selected date
  selectedDateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(16,185,129,0.08)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: SPACING.lg,
  },
  selectedDateText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Date picker
  datePicker: {
    height: 160,
    marginBottom: SPACING.md,
  },

  // Buttons
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
