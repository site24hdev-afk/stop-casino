import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData, RelapseHistoryEntry } from '../types';

const STORAGE_KEY = '@stop_casino_user';
const HISTORY_KEY = '@stop_casino_relapse_history';

const DEFAULT_USER: UserData = {
  quitDate: '',
  averageDailySpend: 0,
  trustedContactName: '',
  trustedContactPhone: '',
  cravingsOvercome: 0,
  onboarded: false,
};

export function useUserData() {
  const [userData, setUserData] = useState<UserData>(DEFAULT_USER);
  const [relapseHistory, setRelapseHistory] = useState<RelapseHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [stored, historyStored] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(HISTORY_KEY),
      ]);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          setUserData(prev => ({ ...prev, ...parsed }));
        }
      }
      if (historyStored) {
        const parsedHistory = JSON.parse(historyStored);
        if (Array.isArray(parsedHistory)) {
          setRelapseHistory(parsedHistory);
        }
      }
    } catch (e) {
      console.error('Erreur chargement données:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const saveData = useCallback(async (data: Partial<UserData>) => {
    try {
      let updated: UserData = DEFAULT_USER;
      setUserData(prev => {
        updated = { ...prev, ...data };
        return updated;
      });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Erreur sauvegarde données:', e);
    }
  }, []);

  const incrementCravingsOvercome = useCallback(async () => {
    let updated: UserData = DEFAULT_USER;
    setUserData(prev => {
      updated = { ...prev, cravingsOvercome: prev.cravingsOvercome + 1 };
      return updated;
    });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Erreur sauvegarde données:', e);
    }
  }, []);

  const handleRelapse = useCallback(async () => {
    const now = new Date().toISOString();

    if (userData.quitDate) {
      const startDate = userData.quitDate;
      const days = Math.max(0, Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000));
      const moneySaved = days * userData.averageDailySpend;

      if (days > 0) {
        const entry: RelapseHistoryEntry = {
          id: Date.now().toString(),
          startDate,
          endDate: now,
          days,
          moneySaved,
        };
        const updated = [entry, ...relapseHistory];
        setRelapseHistory(updated);
        try {
          await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error('Erreur sauvegarde historique:', e);
        }
      }
    }

    await saveData({ quitDate: now });
  }, [saveData, userData.quitDate, userData.averageDailySpend, relapseHistory]);

  const daysSinceQuit = userData.quitDate
    ? Math.max(0, Math.floor((Date.now() - new Date(userData.quitDate).getTime()) / 86400000))
    : 0;

  const moneySaved = daysSinceQuit * userData.averageDailySpend;

  return {
    userData,
    loading,
    saveData,
    incrementCravingsOvercome,
    handleRelapse,
    daysSinceQuit,
    moneySaved,
    relapseHistory,
  };
}
