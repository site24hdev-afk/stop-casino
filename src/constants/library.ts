export interface Article {
  id: string;
  title: string;
  category: 'mecanisme' | 'piege' | 'temoignage' | 'exercice';
  categoryLabel: string;
  icon: string;
  readTime: string;
  image?: string;
  content: string[];
}

import { IMAGES } from './images';

export const CATEGORIES = [
  { key: 'all', labelKey: 'library.all', icon: 'grid-outline' },
  { key: 'mecanisme', labelKey: 'library.understand', icon: 'brain-outline' },
  { key: 'piege', labelKey: 'library.traps', icon: 'warning-outline' },
  { key: 'temoignage', labelKey: 'library.stories', icon: 'people-outline' },
  { key: 'exercice', labelKey: 'library.exercises', icon: 'barbell-outline' },
];

export const ARTICLES: Article[] = [
  {
    id: '1',
    title: "Comment fonctionne l'addiction au jeu",
    category: 'mecanisme',
    categoryLabel: 'Comprendre',
    icon: 'brain-outline',
    readTime: '4 min',
    image: IMAGES.articles.brain,
    content: [
      "Le jeu active le circuit de la récompense dans ton cerveau — le même que la nourriture, le sexe ou les drogues. Quand tu joues, ton cerveau libère de la dopamine, le neurotransmetteur du plaisir.",
      "Le problème : avec le temps, ton cerveau s'habitue. Il lui faut des doses de plus en plus fortes pour ressentir le même plaisir. C'est la tolérance. Tu joues plus, tu mises plus, tu restes plus longtemps.",
      "L'addiction n'est pas un manque de volonté. C'est une modification physique du cerveau. Les circuits de décision et de contrôle sont littéralement détournés par le circuit de la récompense.",
      "La bonne nouvelle : le cerveau est plastique. En arrêtant de jouer, les circuits se réparent progressivement. Les premières semaines sont les plus dures, puis ça s'améliore. Chaque jour compte.",
    ],
  },
  {
    id: '2',
    title: "L'illusion de contrôle",
    category: 'piege',
    categoryLabel: 'Pièges mentaux',
    icon: 'warning-outline',
    readTime: '3 min',
    image: IMAGES.articles.trigger,
    content: [
      "« Je connais la machine », « J'ai un système », « Je sens que ça va payer »… L'illusion de contrôle est le piège numéro 1 du joueur.",
      "En réalité, chaque tour de roulette, chaque main de blackjack, chaque tour de machine est INDÉPENDANT du précédent. Le casino n'a pas de mémoire. La bille ne « doit » rien à personne.",
      "Les casinos encouragent cette illusion : ils te laissent choisir tes numéros, souffler sur les dés, appuyer sur le bouton. Tout ça te donne le sentiment de contrôler quelque chose de totalement aléatoire.",
      "Rappelle-toi : si un système pour gagner existait, le casino aurait fermé. L'avantage mathématique est TOUJOURS du côté de la maison. Toujours.",
    ],
  },
  {
    id: '3',
    title: 'Le piège du « presque gagné »',
    category: 'piege',
    categoryLabel: 'Pièges mentaux',
    icon: 'warning-outline',
    readTime: '3 min',
    image: IMAGES.articles.cycle,
    content: [
      "Tu as 2 cerises sur 3, le numéro juste à côté du tien est sorti, tu avais 20 au blackjack et le croupier a fait 21… Ces « presque gagnés » sont le carburant de l'addiction.",
      "Ton cerveau traite un « presque gagné » presque comme une victoire. La dopamine monte. Tu te dis « j'y étais presque, la prochaine fois c'est la bonne ».",
      "Mais statistiquement, un « presque gagné » n'est pas plus proche d'un gain qu'un échec complet. 2 cerises sur 3, c'est une perte. Point.",
      "Les machines à sous sont CONÇUES pour maximiser les « presque gagnés ». Ce n'est pas de la malchance, c'est du design. Tu es programmé pour continuer.",
    ],
  },
  {
    id: '4',
    title: 'La martingale : pourquoi ça ne marche pas',
    category: 'piege',
    categoryLabel: 'Pièges mentaux',
    icon: 'warning-outline',
    readTime: '3 min',
    image: IMAGES.articles.finance,
    content: [
      "La martingale classique : doubler sa mise après chaque perte pour « se refaire ». Sur le papier, ça semble logique. En pratique, c'est une catastrophe.",
      "Après 7 pertes consécutives à 10 €, ta mise est à 1 280 €. Après 10 pertes : 10 240 €. Et tu n'as « gagné » que 10 €. Le risque est délirant pour un gain ridicule.",
      "De plus, les tables ont des limites de mise maximale. Même avec un budget infini, la martingale bute sur ce plafond. Le casino a pensé à tout.",
      "Aucune stratégie de mise ne peut battre l'avantage mathématique de la maison sur le long terme. C'est un théorème mathématique, pas une opinion.",
    ],
  },
  {
    id: '5',
    title: 'Karim, 34 ans — « 3 ans sans jouer »',
    category: 'temoignage',
    categoryLabel: 'Témoignages',
    icon: 'people-outline',
    readTime: '5 min',
    image: IMAGES.articles.success,
    content: [
      "« J'ai commencé aux machines à sous à 22 ans. Au début c'était pour rigoler avec les potes. En 6 mois, j'y allais seul, tous les jours après le boulot. »",
      "« J'ai perdu mon appart, ma copine, 40 000 euros d'économies. Le pire c'est que même quand je gagnais, je rejouais tout. Le gain n'était jamais assez. »",
      "« Le déclic, c'est quand ma mère m'a prêté 500 euros pour manger et que je les ai joués le soir même. J'ai appelé Joueurs Info Service en pleurant. »",
      "« Aujourd'hui ça fait 3 ans. Les premiers mois ont été l'enfer. Mais chaque semaine ça allait un peu mieux. J'ai retrouvé un appart, j'économise, j'ai une vie. Si j'ai pu le faire, toi aussi. »",
    ],
  },
  {
    id: '6',
    title: "Sofia, 28 ans — « Le poker en ligne m'a tout pris »",
    category: 'temoignage',
    categoryLabel: 'Témoignages',
    icon: 'people-outline',
    readTime: '4 min',
    image: IMAGES.articles.family,
    content: [
      "« Tout le monde pense que les joueurs problématiques c'est des vieux au PMU. Moi j'avais 24 ans, un master, un bon job. Et je jouais au poker en ligne jusqu'à 4h du matin. »",
      "« Je me disais que le poker c'est un jeu d'adresse, pas de hasard. C'est vrai en partie, mais l'addiction s'en fiche. Mon cerveau voulait juste la prochaine main. »",
      "« J'ai perdu 15 000 euros en 8 mois. Je cachais tout à mes proches. J'ai failli perdre mon job à force de dormir 3 heures par nuit. »",
      "« Ce qui m'a sauvée : en parler. À une amie d'abord, puis à un psy spécialisé. La honte m'empêchait de demander de l'aide. Mais la honte, c'est l'outil de l'addiction pour te garder isolé. »",
    ],
  },
  {
    id: '7',
    title: 'Exercice : ta lettre à toi-même',
    category: 'exercice',
    categoryLabel: 'Exercices',
    icon: 'barbell-outline',
    readTime: '10 min',
    image: IMAGES.articles.therapy,
    content: [
      "Prends 10 minutes pour écrire une lettre à toi-même. Cette lettre, tu la reliras quand l'envie sera forte.",
      "Écris pourquoi tu as décidé d'arrêter. Sois précis : qu'est-ce que tu as perdu ? De l'argent, du temps, des relations, ta santé mentale ? Note les montants si tu les connais.",
      "Écris ce que tu veux retrouver. La tranquillité ? La confiance de tes proches ? Pouvoir épargner ? Dormir sans stress ?",
      "Termine par un message d'encouragement pour le « toi du futur » qui aura envie de rejouer. Qu'est-ce que tu voudrais lui dire maintenant, avec les idées claires ?",
      "Conserve cette lettre précieusement. Elle est ton ancre.",
    ],
  },
  {
    id: '8',
    title: 'Exercice : identifier tes déclencheurs',
    category: 'exercice',
    categoryLabel: 'Exercices',
    icon: 'barbell-outline',
    readTime: '8 min',
    image: IMAGES.articles.nature,
    content: [
      "Les envies ne viennent pas de nulle part. Elles sont déclenchées par des situations, des émotions ou des environnements précis. Les identifier, c'est les désarmer.",
      "Fais la liste de tes 5 dernières envies fortes. Pour chacune, note : où étais-tu ? Avec qui ? Quelle heure ? Qu'est-ce que tu ressentais juste avant (ennui, stress, tristesse, excitation) ?",
      "Tu vas probablement voir des patterns. Peut-être que c'est toujours le soir, toujours seul, toujours après une journée stressante.",
      "Pour chaque déclencheur identifié, écris une alternative concrète : « Quand je m'ennuie le soir → j'appelle un ami / je sors marcher / je lance un film ». Le but est d'avoir un plan AVANT que l'envie arrive.",
      "Utilise le journal de l'app pour tracker tes envies au quotidien. Plus tu as de données, plus tes patterns seront clairs.",
    ],
  },
  {
    id: '9',
    title: "L'argent perdu ne reviendra pas",
    category: 'piege',
    categoryLabel: 'Pièges mentaux',
    icon: 'warning-outline',
    readTime: '3 min',
    image: IMAGES.articles.finance,
    content: [
      "« Je dois me refaire » — c'est la phrase la plus dangereuse du joueur. L'idée que tu peux récupérer l'argent perdu en jouant encore.",
      "En psychologie, on appelle ça l'aversion à la perte. Perdre 100 € fait deux fois plus mal que gagner 100 € fait plaisir. Ton cerveau te pousse à « réparer » cette douleur.",
      "Mais l'argent joué est PARTI. Que tu rejoues ou non, il ne reviendra pas. Chaque euro remis en jeu est un NOUVEL euro que tu risques de perdre.",
      "La seule façon de « se refaire », c'est d'arrêter de perdre. Chaque jour sans jouer, tu économises ta mise moyenne. En un mois, ça fait déjà une belle somme. C'est ça, le vrai gain.",
    ],
  },
  {
    id: '10',
    title: 'Exercice : la respiration 4-7-8',
    category: 'exercice',
    categoryLabel: 'Exercices',
    icon: 'barbell-outline',
    readTime: '5 min',
    image: IMAGES.articles.meditation,
    content: [
      "La respiration 4-7-8 est une technique puissante pour calmer une envie en quelques minutes. Elle active le système nerveux parasympathique (le mode « calme »).",
      "Comment faire :\n• Inspire par le nez pendant 4 secondes\n• Retiens ton souffle pendant 7 secondes\n• Expire lentement par la bouche pendant 8 secondes",
      "Répète ce cycle 4 fois. Ça prend moins de 2 minutes.",
      "Pourquoi ça marche : l'envie de jouer active le mode « combat ou fuite » de ton cerveau. La respiration lente envoie le signal inverse : « tout va bien, pas besoin de fuir vers le jeu ».",
      "Pratique cette technique même quand tu n'as pas d'envie. Plus tu la maîtrises en temps normal, plus elle sera efficace en moment de crise.",
    ],
  },
];
