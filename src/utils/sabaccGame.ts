import type { Card, CardName, Suit, Player, GameState, PlayerAction } from '../types/sabacc';

// カードの定義
const STANDARD_CARDS: Array<{ name: CardName; suit: Suit; value: number }> = [
  // Flasks (1-11, Commander, Mistress, Master, Ace)
  ...Array.from({ length: 11 }, (_, i) => ({ name: String(i + 1) as CardName, suit: 'Flasks' as Suit, value: i + 1 })),
  { name: 'Commander', suit: 'Flasks', value: 12 },
  { name: 'Mistress', suit: 'Flasks', value: 13 },
  { name: 'Master', suit: 'Flasks', value: 14 },
  { name: 'Ace', suit: 'Flasks', value: 15 },
  
  // Sabers
  ...Array.from({ length: 11 }, (_, i) => ({ name: String(i + 1) as CardName, suit: 'Sabers' as Suit, value: i + 1 })),
  { name: 'Commander', suit: 'Sabers', value: 12 },
  { name: 'Mistress', suit: 'Sabers', value: 13 },
  { name: 'Master', suit: 'Sabers', value: 14 },
  { name: 'Ace', suit: 'Sabers', value: 15 },
  
  // Staves
  ...Array.from({ length: 11 }, (_, i) => ({ name: String(i + 1) as CardName, suit: 'Staves' as Suit, value: i + 1 })),
  { name: 'Commander', suit: 'Staves', value: 12 },
  { name: 'Mistress', suit: 'Staves', value: 13 },
  { name: 'Master', suit: 'Staves', value: 14 },
  { name: 'Ace', suit: 'Staves', value: 15 },
  
  // Coins
  ...Array.from({ length: 11 }, (_, i) => ({ name: String(i + 1) as CardName, suit: 'Coins' as Suit, value: i + 1 })),
  { name: 'Commander', suit: 'Coins', value: 12 },
  { name: 'Mistress', suit: 'Coins', value: 13 },
  { name: 'Master', suit: 'Coins', value: 14 },
  { name: 'Ace', suit: 'Coins', value: 15 },
];

const SPECIAL_CARDS: Array<{ name: CardName; suit: Suit; value: number }> = [
  { name: 'Balance', suit: null, value: -11 },
  { name: 'The Idiot', suit: null, value: 0 },
  { name: 'Endurance', suit: null, value: -8 },
  { name: 'Moderation', suit: null, value: -14 },
  { name: 'The Evil One', suit: null, value: -15 },
  { name: 'The Queen of Air and Darkness', suit: null, value: -2 },
  { name: 'Demise', suit: null, value: -13 },
  { name: 'The Star', suit: null, value: -10 },
];

// デッキを作成
export function createDeck(): Card[] {
  const deck: Card[] = [];
  let id = 0;
  
  // スタンダードカード（各スート15枚）
  STANDARD_CARDS.forEach(card => {
    deck.push({
      id: `card_${id++}`,
      name: card.name,
      suit: card.suit,
      value: card.value
    });
  });
  
  // 特殊カード（各2枚ずつ）
  SPECIAL_CARDS.forEach(card => {
    deck.push({
      id: `card_${id++}`,
      name: card.name,
      suit: card.suit,
      value: card.value
    });
    deck.push({
      id: `card_${id++}`,
      name: card.name,
      suit: card.suit,
      value: card.value
    });
  });
  
  return deck;
}

// デッキをシャッフル
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// カードを1枚引く
export function drawCard(deck: Card[]): { card: Card; newDeck: Card[] } {
  if (deck.length === 0) {
    throw new Error('デッキが空です');
  }
  const card = deck[0];
  const newDeck = deck.slice(1);
  return { card, newDeck };
}

// 手札の合計を計算
export function calculateHandTotal(hand: Card[]): number {
  return hand.reduce((sum, card) => sum + card.value, 0);
}

// Idiot's Arrayをチェック
export function checkIdiotsArray(hand: Card[]): boolean {
  const hasIdiot = hand.some(card => card.name === 'The Idiot');
  const hasTwo = hand.some(card => card.name === '2');
  const hasThree = hand.some(card => card.name === '3');
  
  return hasIdiot && hasTwo && hasThree;
}

// Pure Sabaccをチェック
export function checkPureSabacc(total: number): boolean {
  return total === 23 || total === -23;
}

// 爆発をチェック
export function checkBombOut(total: number): boolean {
  return total >= 24 || total <= -24;
}

// 勝敗を判定
export function determineWinner(playerTotal: number, dealerTotal: number): 'player' | 'dealer' | 'tie' {
  // Idiot's Arrayチェック
  // Pure Sabaccチェック
  // 爆発チェック
  // 通常の比較
  
  if (checkBombOut(playerTotal)) return 'dealer';
  if (checkBombOut(dealerTotal)) return 'player';
  
  if (checkPureSabacc(playerTotal)) return 'player';
  if (checkPureSabacc(dealerTotal)) return 'dealer';
  
  // 引き分けの場合はランダム
  if (playerTotal === dealerTotal) {
    return Math.random() < 0.5 ? 'player' : 'dealer';
  }
  
  // 23に近い方が勝ち
  const playerDiff = Math.abs(playerTotal - 23);
  const dealerDiff = Math.abs(dealerTotal - 23);
  
  return playerDiff < dealerDiff ? 'player' : 'dealer';
}

// ディーラーの行動を決定
export function getDealerAction(hand: Card[]): PlayerAction {
  const total = calculateHandTotal(hand);
  
  // 手札が5枚の場合はスタンド
  if (hand.length >= 5) {
    return 'stand';
  }
  
  if (total < 15) {
    return 'draw';
  } else if (total >= 15 && total <= 20) {
    return Math.random() < 0.5 ? 'exchange' : 'lock';
  } else {
    return Math.random() < 0.8 ? 'stand' : 'lock';
  }
}

// Sabacc Shiftを実行
export function performSabaccShift(hand: Card[], lockedCard: Card | null): Card[] {
  const suits: Suit[] = ['Flasks', 'Sabers', 'Staves', 'Coins'];
  const values = [-15, -14, -13, -11, -10, -8, -2, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  
  return hand.map(card => {
    // ロックされたカードは変更しない
    if (lockedCard && card.id === lockedCard.id) {
      return card;
    }
    
    if (card.suit === null) {
      // 特殊カードは値のみ変更
      const newValue = values[Math.floor(Math.random() * values.length)];
      return { ...card, value: newValue };
    } else {
      // 通常カードはスートと値の両方を変更
      const newSuit = suits[Math.floor(Math.random() * suits.length)];
      const newValue = values[Math.floor(Math.random() * values.length)];
      return { ...card, suit: newSuit, value: newValue };
    }
  });
}

// ゲームを初期化
export function initializeGame(): GameState {
  const deck = shuffleDeck(createDeck());
  
  // 初期手札を配る（交互に2枚ずつ）
  const { card: card1, newDeck: deck1 } = drawCard(deck);
  const { card: card2, newDeck: deck2 } = drawCard(deck1);
  const { card: card3, newDeck: deck3 } = drawCard(deck2);
  const { card: card4, newDeck: deck4 } = drawCard(deck3);
  
  const player: Player = {
    hand: [card1, card3],
    lockedCard: null,
    hasStood: false,
    isDealer: false
  };
  
  const dealer: Player = {
    hand: [card2, card4],
    lockedCard: null,
    hasStood: false,
    isDealer: true
  };
  
  return {
    deck: deck4,
    player,
    dealer,
    currentTurn: 'player',
    gamePhase: 'playing',
    winner: null,
    message: 'ゲーム開始！あなたのターンです。'
  };
} 