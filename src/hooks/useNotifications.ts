import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

const NOTIF_SETUP_KEY = '@stop_casino_notif_setup';

// Configuration du handler de notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Citations d'encouragement (on pioche dans la langue active)
function getRandomQuote(): string {
  const quotes = i18n.t('quotes') as unknown as string[];
  if (Array.isArray(quotes) && quotes.length > 0) {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
  return 'Un jour à la fois. Tu y arrives.';
}

// Demander la permission
async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily', {
      name: 'Rappels quotidiens',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 100, 100, 100],
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

// Programmer le rappel quotidien (9h du matin)
async function scheduleDailyReminder() {
  // Annuler les anciens rappels
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Rappel matinal — 9h
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Stop Casino 🛡️',
      body: getRandomQuote(),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 0,
    },
  });

  // Rappel soir — 20h
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Stop Casino 💪',
      body: getRandomQuote(),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });
}

// Hook principal
export function useNotifications() {
  useEffect(() => {
    (async () => {
      try {
        const alreadySetup = await AsyncStorage.getItem(NOTIF_SETUP_KEY);
        if (alreadySetup) return;

        const granted = await requestPermissions();
        if (granted) {
          await scheduleDailyReminder();
          await AsyncStorage.setItem(NOTIF_SETUP_KEY, 'true');
        }
      } catch (e) {
        // Silently fail — notifications are not critical
      }
    })();
  }, []);
}
