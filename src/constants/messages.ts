/** Phrases d'encouragement affichées sur l'écran d'accueil */
export const ENCOURAGEMENTS = [
  "Chaque jour sans jouer est une victoire.",
  "Tu es plus fort que l'envie.",
  "La liberté se construit jour après jour.",
  "Ton courage inspire. Continue.",
  "L'argent que tu gardes, c'est ta vie que tu reprends.",
  "Un jour à la fois. Tu y arrives.",
  "Ta famille compte sur toi. Tu assures.",
  "Le casino ne gagne que si tu y retournes.",
  "Respire. Tu es sur le bon chemin.",
  "Chaque envie surmontée te rend plus libre.",
  "Tu mérites mieux qu'un écran de machine.",
  "Le vrai jackpot, c'est ta vie sans casino.",
  "Hier tu as tenu. Aujourd'hui aussi.",
  "Ta volonté est ton meilleur atout.",
  "Pas de mise, pas de perte. Tu gagnes déjà.",
  "Le temps que tu passes ici, c'est du temps gagné.",
  "Les rechutes font partie du chemin. L'important c'est de se relever.",
  "Tu n'es pas seul dans ce combat.",
  "Chaque euro non joué est un euro pour ta vie.",
  "Félicitations. Tu choisis la vraie vie.",
];

/** Étapes du flux SOS — titres/descriptions via i18n (clés sos.*) */
export const SOS_STEPS = [
  {
    id: 1,
    titleKey: 'sos.breatheTitle',
    descKey: 'sos.breatheDesc',
    icon: 'leaf-outline',
    durationSeconds: 60,
  },
  {
    id: 2,
    titleKey: 'sos.walkTitle',
    descKey: 'sos.walkDesc',
    icon: 'footsteps-outline',
    durationSeconds: 120,
  },
  {
    id: 3,
    titleKey: 'sos.writeTitle',
    descKey: 'sos.writeDesc',
    icon: 'create-outline',
    durationSeconds: 120,
  },
  {
    id: 4,
    titleKey: 'sos.callTitle',
    descKey: 'sos.callDesc',
    icon: 'call-outline',
    durationSeconds: 0,
  },
];
