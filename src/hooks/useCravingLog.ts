import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CravingEntry } from '../types';

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
        setEntries(JSON.parse(stored));
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
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    const updated = [newEntry, ...entries];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setEntries(updated);
    return newEntry;
  }, [entries]);

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
    if (hour < 12) return 'le matin';
    if (hour < 18) return "l'après-midi";
    return 'le soir';
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
