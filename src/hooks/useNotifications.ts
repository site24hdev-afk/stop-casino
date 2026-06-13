import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

let Notifications: typeof import('expo-notifications') | null = null;
try {
  Notifications = require('expo-notifications');
} catch (e) {
  // Native module not available (simulator/web)
}

const NOTIF_KEY = '@stop_casino_notif_enabled';
const NOTIF_HOUR_KEY = '@stop_casino_notif_hour';
const NOTIF_SETUP_KEY = '@stop_casino_notif_setup';

const MORNING_QUOTES = [
  "Chaque jour sans casino est une victoire. Continue, guerrier ! 💪",
  "Tu es plus fort que tu ne le crois. Bonne journée ! 🌟",
  "L'argent que tu gardes aujourd'hui, c'est ta liberté de demain. 💰",
  "Un jour de plus. Un pas de plus. Tu avances ! 🚀",
  "Rappelle-toi pourquoi tu as commencé. Tu es sur la bonne voie. ❤️",
  "La meilleure victoire, c'est celle contre soi-même. 🏆",
  "Aujourd'hui encore, tu choisis ta vie. Bravo. 🌅",
  "Chaque envie surmontée te rend plus fort. ⚡",
  "Tu mérites mieux que le casino. Et tu le prouves chaque jour. 🎯",
  "Personne ne peut te voler ce que tu construis jour après jour. 🛡️",
  "Le courage, c'est avancer malgré la peur. 🦁",
  "Ton futur toi te remerciera. Tiens bon ! 🙏",
  "Les petites victoires font les grandes transformations. 🌱",
  "Tu n'es pas seul dans ce combat. On est avec toi. 🤝",
  "Le casino a perdu. Tu as gagné un jour de plus. 🎉",
];

function getRandomQuote(): string {
  try {
    const quotes = i18n.t('quotes') as unknown as string[];
    if (Array.isArray(quotes) && quotes.length > 0) {
      return quotes[Math.floor(Math.random() * quotes.length)];
    }
  } catch (e) {}
  return MORNING_QUOTES[Math.floor(Math.random() * MORNING_QUOTES.length)];
}

// Configuration du handler de notifications
try {
  Notifications?.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (e) {
  // Native module not available
}

async function requestPermissions(): Promise<boolean> {
  if (!Notifications) return false;
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily', {
        name: 'Rappels quotidiens',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 100, 100, 100],
      });
    }
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch (e) {
    return false;
  }
}

async function scheduleDailyReminder(hour: number) {
  if (!Notifications) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Stop Casino 🛡️',
        body: getRandomQuote(),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute: 0,
      },
    });

    const eveningHour = Math.min(hour + 11, 21);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Stop Casino 💪',
        body: getRandomQuote(),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: eveningHour,
        minute: 0,
      },
    });
  } catch (e) {
    // Scheduling failed (simulator/web)
  }
}

export function useNotifications() {
  const [enabled, setEnabled] = useState(false);
  const [hour, setHour] = useState(9);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const storedEnabled = await AsyncStorage.getItem(NOTIF_KEY);
        const storedHour = await AsyncStorage.getItem(NOTIF_HOUR_KEY);
        if (storedEnabled !== null) setEnabled(storedEnabled === 'true');
        if (storedHour !== null) {
          const parsed = parseInt(storedHour, 10);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 23) setHour(parsed);
        }

        const alreadySetup = await AsyncStorage.getItem(NOTIF_SETUP_KEY);
        if (!alreadySetup && Notifications) {
          const granted = await requestPermissions();
          if (granted) {
            const h = storedHour ? parseInt(storedHour, 10) : 9;
            await scheduleDailyReminder(h);
            setEnabled(true);
            await AsyncStorage.setItem(NOTIF_KEY, 'true');
            await AsyncStorage.setItem(NOTIF_SETUP_KEY, 'true');
          }
        }
      } catch (e) {
        // silently fail
      }
      setLoaded(true);
    })();
  }, []);

  const toggleNotifications = useCallback(async (newEnabled: boolean) => {
    if (!Notifications) return false;
    try {
      if (newEnabled) {
        const granted = await requestPermissions();
        if (!granted) return false;
        await scheduleDailyReminder(hour);
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
      setEnabled(newEnabled);
      await AsyncStorage.setItem(NOTIF_KEY, String(newEnabled));
      return true;
    } catch (e) {
      return false;
    }
  }, [hour]);

  const changeHour = useCallback(async (newHour: number) => {
    setHour(newHour);
    await AsyncStorage.setItem(NOTIF_HOUR_KEY, String(newHour));
    if (enabled) {
      await scheduleDailyReminder(newHour);
    }
  }, [enabled]);

  return {
    enabled,
    hour,
    loaded,
    toggleNotifications,
    changeHour,
  };
}
