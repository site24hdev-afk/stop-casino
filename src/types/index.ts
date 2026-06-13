export interface UserData {
  /** Date ISO de la dernière visite au casino */
  quitDate: string;
  /** Dépense moyenne quotidienne au casino (en €) */
  averageDailySpend: number;
  /** Nom du proche de confiance */
  trustedContactName: string;
  /** Numéro du proche de confiance */
  trustedContactPhone: string;
  /** Envies surmontées */
  cravingsOvercome: number;
  /** Première configuration terminée */
  onboarded: boolean;
}

export interface RelapseHistoryEntry {
  id: string;
  startDate: string;
  endDate: string;
  days: number;
  moneySaved: number;
}

export interface CravingEntry {
  id: string;
  date: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  location: string;
  trigger: string;
  actionTaken: string;
  overcame: boolean;
}

export interface SOSStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  durationSeconds: number;
}
