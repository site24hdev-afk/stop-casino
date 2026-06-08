import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import fr from './fr';
import en from './en';
import de from './de';
import zh from './zh';
import es from './es';
import ar from './ar';
import pt from './pt';
import it from './it';

const i18n = new I18n({
  fr,
  en,
  de,
  zh,
  es,
  ar,
  pt,
  it,
});

// Langue par défaut = français
i18n.defaultLocale = 'fr';
i18n.enableFallback = true;

// Détection automatique de la langue du téléphone
const deviceLocale = getLocales()[0]?.languageCode ?? 'fr';
i18n.locale = deviceLocale;

const LANG_KEY = '@stop_casino_language';

// Charger la langue sauvegardée (si l'utilisateur a changé manuellement)
export async function loadSavedLanguage() {
  try {
    const saved = await AsyncStorage.getItem(LANG_KEY);
    if (saved && Object.keys(i18n.translations).includes(saved)) {
      i18n.locale = saved;
    }
  } catch (e) {
    // On garde la langue du device
  }
}

// Changer la langue manuellement
export async function setLanguage(lang: string) {
  i18n.locale = lang;
  await AsyncStorage.setItem(LANG_KEY, lang);
}

// Langues disponibles
export const AVAILABLE_LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
];

export default i18n;
export const t = (key: string, options?: object) => i18n.t(key, options);
