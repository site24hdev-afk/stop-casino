import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

type Card = { suit: string; value: string; numValue: number };
type GameState = 'betting' | 'playing' | 'dealer' | 'result';

const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'V', 'D', 'R'];

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      let numValue = parseInt(value);
      if (['V', 'D', 'R'].includes(value)) numValue = 10;
      if (value === 'A') numValue = 11;
      deck.push({ suit, value, numValue });
    }
  }
  // Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function handValue(cards: Card[]): number {
  let total = cards.reduce((sum, c) => sum + c.numValue, 0);
  let aces = cards.filter(c => c.value === 'A').length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

function CardView({ card, hidden }: { card: Card; hidden?: boolean }) {
  const isRed = card.suit === '♥' || card.suit === '♦';
  if (hidden) {
    return (
      <View style={[cardStyles.card, cardStyles.hiddenCard]}>
        <Text style={cardStyles.hiddenText}>?</Text>
      </View>
    );
  }
  return (
    <View style={cardStyles.card}>
      <Text style={[cardStyles.value, isRed && cardStyles.red]}>
        {card.value}
      </Text>
      <Text style={[cardStyles.suit, isRed && cardStyles.red]}>
        {card.suit}
      </Text>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    width: 56,
    height: 80,
    backgroundColor: '#FFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  hiddenCard: {
    backgroundColor: COLORS.primary,
  },
  hiddenText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  suit: {
    fontSize: 18,
    color: '#1a1a1a',
  },
  red: {
    color: '#DC2626',
  },
});

export default function BlackjackGame() {
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<GameState>('betting');
  const [result, setResult] = useState('');
  const [stats, setStats] = useState({ wins: 0, losses: 0, ties: 0 });
  const [deckIndex, setDeckIndex] = useState(0);

  const drawCard = useCallback((): Card => {
    const card = deck[deckIndex];
    setDeckIndex(prev => prev + 1);
    return card;
  }, [deck, deckIndex]);

  const startGame = () => {
    let newDeck = deck;
    let newIdx = deckIndex;

    if (deckIndex > 40) {
      newDeck = createDeck();
      setDeck(newDeck);
      newIdx = 0;
    }

    const p1 = newDeck[newIdx];
    const d1 = newDeck[newIdx + 1];
    const p2 = newDeck[newIdx + 2];
    const d2 = newDeck[newIdx + 3];

    setPlayerHand([p1, p2]);
    setDealerHand([d1, d2]);
    setDeckIndex(newIdx + 4);
    setGameState('playing');
    setResult('');

    // Blackjack naturel
    if (handValue([p1, p2]) === 21) {
      finishGame([p1, p2], [d1, d2], newIdx + 4, newDeck);
    }
  };

  const hit = () => {
    const card = deck[deckIndex];
    const newHand = [...playerHand, card];
    setPlayerHand(newHand);
    setDeckIndex(deckIndex + 1);

    if (handValue(newHand) > 21) {
      setGameState('result');
      setResult('Tu as dépassé 21. Le casino gagne.');
      setStats(prev => ({ ...prev, losses: prev.losses + 1 }));
    }
  };

  const stand = () => {
    finishGame(playerHand, dealerHand, deckIndex, deck);
  };

  const finishGame = (pHand: Card[], dHand: Card[], idx: number, currentDeck: Card[]) => {
    let newDealerHand = [...dHand];
    let currentIdx = idx;

    while (handValue(newDealerHand) < 17) {
      newDealerHand.push(currentDeck[currentIdx]);
      currentIdx++;
    }

    setDealerHand(newDealerHand);
    setDeckIndex(currentIdx);
    setGameState('result');

    const pv = handValue(pHand);
    const dv = handValue(newDealerHand);

    if (pv > 21) {
      setResult('Tu as dépassé 21. Le casino gagne.');
      setStats(prev => ({ ...prev, losses: prev.losses + 1 }));
    } else if (dv > 21) {
      setResult('Le croupier dépasse 21. Tu gagnes cette fois !');
      setStats(prev => ({ ...prev, wins: prev.wins + 1 }));
    } else if (pv > dv) {
      setResult('Tu as le meilleur score. Tu gagnes cette fois !');
      setStats(prev => ({ ...prev, wins: prev.wins + 1 }));
    } else if (dv > pv) {
      setResult('Le casino gagne. Comme d\'habitude...');
      setStats(prev => ({ ...prev, losses: prev.losses + 1 }));
    } else {
      setResult('Égalité. Au casino, personne ne gagne.');
      setStats(prev => ({ ...prev, ties: prev.ties + 1 }));
    }
  };

  const total = stats.wins + stats.losses + stats.ties;
  const winRate = total > 0 ? Math.round((stats.wins / total) * 100) : 0;

  return (
    <View style={styles.container}>
      {/* Dealer */}
      <View style={styles.section}>
        <Text style={styles.label}>
          Croupier {gameState === 'result' ? `(${handValue(dealerHand)})` : ''}
        </Text>
        <View style={styles.hand}>
          {dealerHand.map((card, i) => (
            <CardView
              key={i}
              card={card}
              hidden={i === 1 && gameState === 'playing'}
            />
          ))}
        </View>
      </View>

      {/* Résultat */}
      {result ? (
        <View style={styles.resultCard}>
          <Text style={styles.resultText}>{result}</Text>
          {total >= 5 && (
            <Text style={styles.statsText}>
              En {total} parties : {winRate}% de victoires.
              {winRate < 50 ? ' Le casino gagne sur la durée.' : ''}
            </Text>
          )}
        </View>
      ) : null}

      {/* Player */}
      <View style={styles.section}>
        <Text style={styles.label}>
          Toi ({handValue(playerHand)})
        </Text>
        <View style={styles.hand}>
          {playerHand.map((card, i) => (
            <CardView key={i} card={card} />
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {gameState === 'betting' && (
          <TouchableOpacity style={styles.dealButton} onPress={startGame}>
            <Text style={styles.dealText}>Distribuer</Text>
          </TouchableOpacity>
        )}

        {gameState === 'playing' && (
          <View style={styles.playActions}>
            <TouchableOpacity style={styles.hitButton} onPress={hit}>
              <Text style={styles.actionText}>Carte</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.standButton} onPress={stand}>
              <Text style={styles.actionText}>Rester</Text>
            </TouchableOpacity>
          </View>
        )}

        {gameState === 'result' && (
          <TouchableOpacity style={styles.dealButton} onPress={startGame}>
            <Text style={styles.dealText}>Rejouer</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stats session */}
      <View style={styles.sessionStats}>
        <Text style={styles.sessionText}>
          V: {stats.wins} | D: {stats.losses} | É: {stats.ties}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  section: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  hand: {
    flexDirection: 'row',
    gap: SPACING.sm,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  resultText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  statsText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actions: {
    alignItems: 'center',
  },
  playActions: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  dealButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
  },
  dealText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: '#FFF',
  },
  hitButton: {
    backgroundColor: COLORS.info,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  standButton: {
    backgroundColor: COLORS.warning,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  actionText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: '#FFF',
  },
  sessionStats: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  sessionText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
});
