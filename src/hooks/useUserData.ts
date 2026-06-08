import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData } from '../types';

const STORAGE_KEY = '@stop_casino_user';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUserData(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Erreur chargement données:', e);
    } finally {
      setLoading(false);
    }
  };

  const saveData = useCallback(async (data: Partial<UserData>) => {
    try {
      const updated = { ...userData, ...data };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setUserData(updated);
    } catch (e) {
      console.error('Erreur sauvegarde données:', e);
    }
  }, [userData]);

  const incrementCravingsOvercome = useCallback(async () => {
    await saveData({ cravingsOvercome: userData.cravingsOvercome + 1 });
  }, [userData.cravingsOvercome, saveData]);

  // Calculs dérivés
  const daysSinceQuit = userData.quitDate
    ? Math.max(0, Math.floor((Date.now() - new Date(userData.quitDate).getTime()) / 86400000))
    : 0;

  const moneySaved = daysSinceQuit * userData.averageDailySpend;

  return {
    userData,
    loading,
    saveData,
    incrementCravingsOvercome,
    daysSinceQuit,
    moneySaved,
  };
}
