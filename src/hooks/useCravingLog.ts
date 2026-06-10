import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CravingEntry } from '../types';
import { t } from '../i18n';

const STORAGE_KEY = '@stop_casino_cravings';

export function useCravingLog() {
  const [entries, setEntries] = useState<CravingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setEntries(parsed);
        }
      }
    } catch (e) {
      console.error('Erreur chargement journal:', e);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = useCallback(async (entry: Omit<CravingEntry, 'id' | 'date'>) => {
    const newEntry: CravingEntry = {
      ...entry,
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      date: new Date().toISOString(),
    };
    let updated: CravingEntry[] = [];
    setEntries(prev => {
      updated = [newEntry, ...prev];
      return updated;
    });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Erreur sauvegarde journal:', e);
    }
    return newEntry;
  }, []);

  // Stats
  const totalCravings = entries.length;
  const overcameCount = entries.filter(e => e.overcame).length;
  const averageIntensity = entries.length > 0
    ? entries.reduce((sum, e) => sum + e.intensity, 0) / entries.length
    : 0;

  // Moment le plus fréquent
  const peakHour = (() => {
    if (entries.length < 3) return null;
    const hours: Record<number, number> = {};
    entries.forEach(e => {
      const h = new Date(e.date).getHours();
      hours[h] = (hours[h] || 0) + 1;
    });
    const max = Math.max(...Object.values(hours));
    const hour = Number(Object.entries(hours).find(([, v]) => v === max)?.[0]);
    if (hour < 12) return t('stats.morning') || 'le matin';
    if (hour < 18) return t('stats.afternoon') || "l'après-midi";
    return t('stats.evening') || 'le soir';
  })();

  return {
    entries,
    loading,
    addEntry,
    totalCravings,
    overcameCount,
    averageIntensity,
    peakHour,
  };
}
