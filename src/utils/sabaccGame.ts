import type {
  Card,
  CardName,
  GameState,
  Player,
  PlayerAction,
  Suit,
} from '../types/sabacc';

// カードの定義
const STANDARD_CARDS: Array<{ name: CardName; suit: Suit; value: number }> = [
  // Flasks (1-11, Commander, Mistress, Master, Ace)
  ...Array.from({ length: 11 }, (_, i) => ({
    name: String(i + 1) as CardName,
    suit: 'Flasks' as Suit,
    value: i + 1,
  })),
  { name: 'Commander', suit: 'Flasks', value: 12 },
  { name: 'Mistress', suit: 'Flasks', value: 13 },
  { name: 'Master', suit: 'Flasks', value: 14 },
  { name: 'Ace', suit: 'Flasks', value: 15 },

  // Sabers
  ...Array.from({ length: 11 }, (_, i) => ({
    name: String(i + 1) as CardName,
    suit: 'Sabers' as Suit,
    value: i + 1,
  })),
  { name: 'Commander', suit: 'Sabers', value: 12 },
  { name: 'Mistress', suit: 'Sabers', value: 13 },
  { name: 'Master', suit: 'Sabers', value: 14 },
  { name: 'Ace', suit: 'Sabers', value: 15 },

  // Staves
  ...Array.from({ length: 11 }, (_, i) => ({
    name: String(i + 1) as CardName,
    suit: 'Staves' as Suit,
    value: i + 1,
  })),
  { name: 'Commander', suit: 'Staves', value: 12 },
  { name: 'Mistress', suit: 'Staves', value: 13 },
  { name: 'Master', suit: 'Staves', value: 14 },
  { name: 'Ace', suit: 'Staves', value: 15 },

  // Coins
  ...Array.from({ length: 11 }, (_, i) => ({
    name: String(i + 1) as CardName,
    suit: 'Coins' as Suit,
    value: i + 1,
  })),
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
  STANDARD_CARDS.forEach((card) => {
    deck.push({
      id: `card_${id++}`,
      name: card.name,
      suit: card.suit,
      value: card.value,
    });
  });

  // 特殊カード（各2枚ずつ）
  SPECIAL_CARDS.forEach((card) => {
    deck.push({
      id: `card_${id++}`,
      name: card.name,
      suit: card.suit,
      value: card.value,
    });
    deck.push({
      id: `card_${id++}`,
      name: card.name,
      suit: card.suit,
      value: card.value,
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
  const hasIdiot = hand.some((card) => card.name === 'The Idiot');
  const hasTwo = hand.some((card) => card.name === '2');
  const hasThree = hand.some((card) => card.name === '3');

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
export function determineWinner(
  playerTotal: number,
  dealerTotal: number
): 'player' | 'dealer' | 'tie' {
  // 爆発チェック
  if (checkBombOut(playerTotal)) return 'dealer';
  if (checkBombOut(dealerTotal)) return 'player';

  // Idiot's Arrayチェック
  // 注意: Idiot's Arrayは最強なので、ここではチェックしない（SabaccGame.tsxでチェック）

  // Pure Sabaccチェック（同じ得点の場合は引き分け）
  const playerPureSabacc = checkPureSabacc(playerTotal);
  const dealerPureSabacc = checkPureSabacc(dealerTotal);

  if (playerPureSabacc && dealerPureSabacc) {
    // 両方ともPure Sabaccの場合は引き分け
    return 'tie';
  } else if (playerPureSabacc) {
    return 'player';
  } else if (dealerPureSabacc) {
    return 'dealer';
  }

  // 通常の得点比較
  if (playerTotal === dealerTotal || playerTotal === -dealerTotal) {
    return 'tie';
  }

  // 23に近い方が勝ち
  const playerDiff = Math.abs(playerTotal - 23);
  const dealerDiff = Math.abs(dealerTotal - 23);

  return playerDiff < dealerDiff ? 'player' : 'dealer';
}

// ディーラーの行動を決定（プレイヤーの手札も考慮）
export function getDealerAction(
  hand: Card[],
  playerHand: Card[]
): PlayerAction {
  const total = calculateHandTotal(hand);
  const playerTotal = calculateHandTotal(playerHand);

  // 手札が5枚の場合はスタンド
  if (hand.length >= 5) {
    return 'stand';
  }

  // Idiot's Arrayの可能性をチェック
  if (checkIdiotsArray(hand)) {
    return 'stand';
  }

  // Pure Sabaccの場合はスタンド
  if (checkPureSabacc(total)) {
    return 'stand';
  }

  // プレイヤーがIdiot's Arrayを持っている場合、より積極的に行動
  if (checkIdiotsArray(playerHand)) {
    if (total < 15 && total > -15) {
      return 'draw';
    }
  }

  // プレイヤーがPure Sabaccを持っている場合、より積極的に行動
  if (checkPureSabacc(playerTotal)) {
    if (total < 18 && total > -18) {
      return 'draw';
    }
  }

  // プレイヤーとの得点差を詳細に分析
  const scoreDifference = playerTotal - total;
  const absPlayerTotal = Math.abs(playerTotal);
  const absTotal = Math.abs(total);

  // プレイヤーが大幅にリードしている場合（10点以上差）
  if (scoreDifference > 10) {
    if (total < 15 && total > -15) {
      return 'draw';
    }
  }

  // プレイヤーが大幅に負けている場合（10点以上差）
  if (scoreDifference < -10) {
    if (total >= 16 || total <= -16) {
      return 'stand';
    }
  }

  // プレイヤーが23に近い場合（20点以上）
  if (absPlayerTotal >= 20) {
    if (total < 12 && total > -12) {
      return 'draw';
    }
  }

  // プレイヤーが低得点の場合（5点以下）
  if (absPlayerTotal <= 5) {
    if (total >= 18 || total <= -18) {
      return 'stand';
    }
  }

  // 自分が23に近い場合（20点以上）
  if (absTotal >= 20) {
    return 'stand';
  }

  // 自分が低得点の場合（5点以下）
  if (absTotal <= 5) {
    if (hand.length < 4) {
      return 'draw';
    }
  }

  // 爆発の可能性が高い場合はスタンド
  if (total >= 22 || total <= -22) {
    return 'stand';
  }

  // 手札が4枚で、合計が16以上または-16以下の場合はスタンド
  if (hand.length >= 4 && (total >= 16 || total <= -16)) {
    return 'stand';
  }

  // 手札が3枚で、合計が19以上または-19以下の場合はスタンド
  if (hand.length >= 3 && (total >= 19 || total <= -19)) {
    return 'stand';
  }

  // 手札が2枚で、合計が21以上または-21以下の場合はスタンド
  if (hand.length >= 2 && (total >= 21 || total <= -21)) {
    return 'stand';
  }

  // 非常に低い合計値の場合はカードを引く
  if (total < 8 && total > -8) {
    return 'draw';
  }

  // 中程度の合計値の場合は戦略的に行動
  if ((total >= 8 && total < 16) || (total <= -8 && total > -16)) {
    // 手札の内容を分析して最適な行動を決定
    const hasHighValueCard = hand.some((card) => card.value >= 10);
    const hasLowValueCard = hand.some((card) => card.value <= 3);
    const hasSpecialCard = hand.some((card) => card.suit === null);

    // プレイヤーの手札も考慮
    const playerHasSpecialCard = playerHand.some((card) => card.suit === null);
    // const playerHasHighValueCard = playerHand.some(card => card.value >= 10);

    // プレイヤーとの点数比較に基づく戦略
    if (scoreDifference > 5) {
      // プレイヤーがリードしている場合、より積極的に行動
      if (hasLowValueCard) {
        return 'exchange';
      } else {
        return Math.random() < 0.6 ? 'draw' : 'exchange';
      }
    } else if (scoreDifference < -5) {
      // プレイヤーが負けている場合、より保守的に行動
      if (hasHighValueCard) {
        return 'lock';
      } else {
        return Math.random() < 0.7 ? 'stand' : 'lock';
      }
    } else {
      // 互角の場合、通常の戦略
      if (hasHighValueCard && !hasLowValueCard) {
        return 'lock';
      } else if (hasLowValueCard && !hasHighValueCard) {
        return 'exchange';
      } else if (hasSpecialCard) {
        return 'lock';
      } else if (playerHasSpecialCard && !hasSpecialCard) {
        return Math.random() < 0.7 ? 'draw' : 'exchange';
      } else {
        return Math.random() < 0.5 ? 'exchange' : 'lock';
      }
    }
  }

  // 高い合計値の場合は慎重に行動
  if ((total >= 16 && total < 22) || (total <= -16 && total > -22)) {
    const hasHighValueCard = hand.some((card) => card.value >= 12);
    if (hasHighValueCard) {
      return 'lock';
    } else {
      return Math.random() < 0.7 ? 'stand' : 'lock';
    }
  }

  // それ以外の場合はランダムに行動を決定
  const actions: PlayerAction[] = ['draw', 'exchange', 'lock', 'stand'];
  const weights = [0.2, 0.3, 0.3, 0.2]; // 各行動の重み

  const random = Math.random();
  let cumulativeWeight = 0;

  for (let i = 0; i < actions.length; i++) {
    cumulativeWeight += weights[i];
    if (random < cumulativeWeight) {
      return actions[i];
    }
  }

  return 'stand'; // デフォルト
}

// ディーラーの戦略的な行動を決定（プレイヤーの手札も考慮）
export function getDealerStrategy(
  hand: Card[],
  playerHand: Card[]
): {
  shouldDraw: boolean;
  shouldExchange: boolean;
  shouldLock: boolean;
  shouldStand: boolean;
  exchangeCardIndex?: number;
  lockCardIndex?: number;
} {
  // 基本戦略（プレイヤーの手札も考慮）
  const action = getDealerAction(hand, playerHand);

  // 交換するカードを選択
  let exchangeCardIndex: number | undefined;
  if (action === 'exchange' && hand.length > 0) {
    // 最も価値の低いカードを交換対象とする
    let minValue = Infinity;
    for (let i = 0; i < hand.length; i++) {
      if (hand[i].value < minValue) {
        minValue = hand[i].value;
        exchangeCardIndex = i;
      }
    }
  }

  // ロックするカードを選択（プレイヤーの手札も考慮）
  let lockCardIndex: number | undefined;
  if (action === 'lock' && hand.length > 0) {
    // 戦略的に最適なカードをロック対象とする
    const specialCards = hand.filter((card) => card.suit === null);
    const highValueCards = hand.filter((card) => card.value >= 10);
    const playerSpecialCards = playerHand.filter((card) => card.suit === null);
    // const playerHighValueCards = playerHand.filter(card => card.value >= 10);

    // プレイヤーとの点数比較に基づく戦略
    const scoreDifference =
      calculateHandTotal(playerHand) - calculateHandTotal(hand);

    if (specialCards.length > 0) {
      // 特殊カードを優先的にロック
      lockCardIndex = hand.findIndex((card) => card.id === specialCards[0].id);
    } else if (highValueCards.length > 0) {
      // 高価値カードをロック
      lockCardIndex = hand.findIndex(
        (card) => card.id === highValueCards[0].id
      );
    } else if (playerSpecialCards.length > 0 && !specialCards.length) {
      // プレイヤーが特殊カードを持っている場合、最も価値の高いカードをロック
      let maxValue = -Infinity;
      for (let i = 0; i < hand.length; i++) {
        if (hand[i].value > maxValue) {
          maxValue = hand[i].value;
          lockCardIndex = i;
        }
      }
    } else if (scoreDifference > 5) {
      // プレイヤーがリードしている場合、最も価値の高いカードをロック
      let maxValue = -Infinity;
      for (let i = 0; i < hand.length; i++) {
        if (hand[i].value > maxValue) {
          maxValue = hand[i].value;
          lockCardIndex = i;
        }
      }
    } else if (scoreDifference < -5) {
      // プレイヤーが負けている場合、最も価値の低いカードをロック（リスク回避）
      let minValue = Infinity;
      for (let i = 0; i < hand.length; i++) {
        if (hand[i].value < minValue) {
          minValue = hand[i].value;
          lockCardIndex = i;
        }
      }
    } else {
      // 互角の場合、通常の戦略
      let maxValue = -Infinity;
      for (let i = 0; i < hand.length; i++) {
        if (hand[i].value > maxValue) {
          maxValue = hand[i].value;
          lockCardIndex = i;
        }
      }
    }
  }

  return {
    shouldDraw: action === 'draw',
    shouldExchange: action === 'exchange',
    shouldLock: action === 'lock',
    shouldStand: action === 'stand',
    exchangeCardIndex,
    lockCardIndex,
  };
}

// Sabacc Shiftを実行
export function performSabaccShift(
  hand: Card[],
  lockedCard: Card | null
): Card[] {
  const suits: Suit[] = ['Flasks', 'Sabers', 'Staves', 'Coins'];
  const values = [
    -15, -14, -13, -11, -10, -8, -2, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    13, 14, 15,
  ];

  return hand.map((card) => {
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
    isDealer: false,
  };

  const dealer: Player = {
    hand: [card2, card4],
    lockedCard: null,
    hasStood: false,
    isDealer: true,
  };

  return {
    deck: deck4,
    player,
    dealer,
    currentTurn: 'player',
    gamePhase: 'playing',
    winner: null,
    message: '', // メッセージはSabaccGameコンポーネントで設定
  };
}
