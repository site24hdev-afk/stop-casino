import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REASONS_KEY = '@stop_casino_reasons';

export interface Reason {
  id: string;
  text: string;
  emoji: string;
  createdAt: string;
}

const EMOJI_OPTIONS = ['💪', '❤️', '👨‍👩‍👧‍👦', '💰', '🧠', '🏠', '🎯', '🌟', '🙏', '😊'];

export function useReasons() {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(REASONS_KEY);
        if (stored) {
          setReasons(JSON.parse(stored));
        }
      } catch (e) {
        // silently fail
      }
      setLoaded(true);
    })();
  }, []);

  const addReason = useCallback(async (text: string, emoji: string) => {
    const newReason: Reason = {
      id: Date.now().toString(),
      text: text.trim(),
      emoji,
      createdAt: new Date().toISOString(),
    };
    const updated = [...reasons, newReason];
    setReasons(updated);
    await AsyncStorage.setItem(REASONS_KEY, JSON.stringify(updated));
    return newReason;
  }, [reasons]);

  const removeReason = useCallback(async (id: string) => {
    const updated = reasons.filter(r => r.id !== id);
    setReasons(updated);
    await AsyncStorage.setItem(REASONS_KEY, JSON.stringify(updated));
  }, [reasons]);

  return {
    reasons,
    loaded,
    addReason,
    removeReason,
    emojiOptions: EMOJI_OPTIONS,
  };
}
