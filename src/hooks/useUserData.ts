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
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          setUserData(prev => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {
      console.error('Erreur chargement données:', e);
    } finally {
      setLoading(false);
    }
  };

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
    await saveData({ quitDate: new Date().toISOString() });
  }, [saveData]);

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
    handleRelapse,
    daysSinceQuit,
    moneySaved,
  };
}
