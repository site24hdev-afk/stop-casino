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
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      text: text.trim(),
      emoji,
      createdAt: new Date().toISOString(),
    };
    let updated: Reason[] = [];
    setReasons(prev => {
      updated = [...prev, newReason];
      return updated;
    });
    try {
      await AsyncStorage.setItem(REASONS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Erreur sauvegarde raison:', e);
    }
    return newReason;
  }, []);

  const removeReason = useCallback(async (id: string) => {
    let updated: Reason[] = [];
    setReasons(prev => {
      updated = prev.filter(r => r.id !== id);
      return updated;
    });
    try {
      await AsyncStorage.setItem(REASONS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Erreur suppression raison:', e);
    }
  }, []);

  return {
    reasons,
    loaded,
    addReason,
    removeReason,
    emojiOptions: EMOJI_OPTIONS,
  };
}
