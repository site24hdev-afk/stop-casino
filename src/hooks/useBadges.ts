import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ALL_BADGES,
  TIME_BADGES,
  MONEY_BADGES,
  CRAVINGS_BADGES,
  BadgeDefinition,
} from '../constants/badges';

const BADGES_KEY = '@stop_casino_badges';

export function useBadges(daysSinceQuit: number, moneySaved: number, cravingsOvercome: number) {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [newBadge, setNewBadge] = useState<BadgeDefinition | null>(null);
  const [loaded, setLoaded] = useState(false);
  const prevUnlockedRef = useRef<string[]>([]);

  // Charger les badges déjà débloqués
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(BADGES_KEY);
        if (stored) {
          const ids = JSON.parse(stored) as string[];
          setUnlockedIds(ids);
          prevUnlockedRef.current = ids;
        }
      } catch (e) {
        // silently fail
      }
      setLoaded(true);
    })();
  }, []);

  // Vérifier les nouveaux badges chaque fois que les valeurs changent
  useEffect(() => {
    if (!loaded) return;

    const nowUnlocked: string[] = [];

    // Badges temps
    for (const badge of TIME_BADGES) {
      if (daysSinceQuit >= badge.threshold) {
        nowUnlocked.push(badge.id);
      }
    }

    // Badges argent
    for (const badge of MONEY_BADGES) {
      if (moneySaved >= badge.threshold) {
        nowUnlocked.push(badge.id);
      }
    }

    // Badges envies
    for (const badge of CRAVINGS_BADGES) {
      if (cravingsOvercome >= badge.threshold) {
        nowUnlocked.push(badge.id);
      }
    }

    // Trouver les NOUVEAUX badges (pas encore connus)
    const previousIds = prevUnlockedRef.current;
    const brandNew = nowUnlocked.filter(id => !previousIds.includes(id));

    if (brandNew.length > 0) {
      // Afficher le dernier badge débloqué (le plus impressionnant)
      const latestBadge = ALL_BADGES.find(b => b.id === brandNew[brandNew.length - 1]);
      if (latestBadge) {
        setNewBadge(latestBadge);
      }
    }

    // Sauvegarder si changement
    if (nowUnlocked.length !== unlockedIds.length) {
      setUnlockedIds(nowUnlocked);
      prevUnlockedRef.current = nowUnlocked;
      AsyncStorage.setItem(BADGES_KEY, JSON.stringify(nowUnlocked)).catch(() => {});
    }
  }, [daysSinceQuit, moneySaved, cravingsOvercome, loaded]);

  const dismissNewBadge = useCallback(() => {
    setNewBadge(null);
  }, []);

  // Badges avec état unlocked/locked
  const allBadgesWithStatus = ALL_BADGES.map(badge => ({
    ...badge,
    unlocked: unlockedIds.includes(badge.id),
  }));

  const unlockedCount = unlockedIds.length;
  const totalCount = ALL_BADGES.length;

  // Prochain badge à débloquer par catégorie
  const nextTimeBadge = TIME_BADGES.find(b => !unlockedIds.includes(b.id));
  const nextMoneyBadge = MONEY_BADGES.find(b => !unlockedIds.includes(b.id));
  const nextCravingsBadge = CRAVINGS_BADGES.find(b => !unlockedIds.includes(b.id));

  return {
    allBadges: allBadgesWithStatus,
    unlockedCount,
    totalCount,
    newBadge,
    dismissNewBadge,
    nextTimeBadge,
    nextMoneyBadge,
    nextCravingsBadge,
  };
}
