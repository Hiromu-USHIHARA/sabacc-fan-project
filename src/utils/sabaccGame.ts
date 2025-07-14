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
  // 注意: Idiot's Arrayは最強なので，ここではチェックしない（SabaccGame.tsxでチェック）

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

  // 【1】爆発状態（スコアが ±24 を超えている）
  if (Math.abs(total) >= 24) {
    return 'exchange';
  }

  // 【2】スコアが ±20 未満
  if (Math.abs(total) < 20) {
    return 'draw';
  }

  // 【3】スコアが ±20〜±22
  if (Math.abs(total) >= 20 && Math.abs(total) <= 22) {
    if (total > playerTotal) {
      return 'stand';
    } else if (total < playerTotal) {
      return Math.random() < 0.5 ? 'draw' : 'exchange';
    } else {
      // 同点時：スタンド or ロック（50%ランダム）
      return Math.random() < 0.5 ? 'stand' : 'lock';
    }
  }

  // 【4】スコアが ±23（Pure Sabacc）
  if (Math.abs(total) === 23) {
    return 'stand';
  }

  // それ以外の場合はランダムに行動を決定
  const actions: PlayerAction[] = ['draw', 'exchange', 'lock', 'stand'];
  const weights = [0.3, 0.3, 0.2, 0.2]; // 各行動の重み

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
  drawCount?: number; // 何枚引くかを指定
} {
  const total = calculateHandTotal(hand);
  const playerTotal = calculateHandTotal(playerHand);

  // 手札が5枚の場合はスタンド
  if (hand.length >= 5) {
    return {
      shouldDraw: false,
      shouldExchange: false,
      shouldLock: false,
      shouldStand: true,
    };
  }

  // Idiot's Arrayの可能性をチェック
  if (checkIdiotsArray(hand)) {
    return {
      shouldDraw: false,
      shouldExchange: false,
      shouldLock: false,
      shouldStand: true,
    };
  }

  // Pure Sabaccの場合はスタンド
  if (checkPureSabacc(total)) {
    return {
      shouldDraw: false,
      shouldExchange: false,
      shouldLock: false,
      shouldStand: true,
    };
  }

  // 爆発状態（スコアが ±24 を超えている）
  if (Math.abs(total) >= 24) {
    // 最も数値が大きい（または小さい）カードを交換
    let exchangeCardIndex: number | undefined;
    if (total >= 24) {
      let maxValue = -Infinity;
      for (let i = 0; i < hand.length; i++) {
        if (hand[i].value > maxValue) {
          maxValue = hand[i].value;
          exchangeCardIndex = i;
        }
      }
    } else {
      let minValue = Infinity;
      for (let i = 0; i < hand.length; i++) {
        if (hand[i].value < minValue) {
          minValue = hand[i].value;
          exchangeCardIndex = i;
        }
      }
    }

    return {
      shouldDraw: false,
      shouldExchange: true,
      shouldLock: false,
      shouldStand: false,
      exchangeCardIndex,
    };
  }

  // スコアが ±20 未満の場合
  if (Math.abs(total) < 20) {
    // 手札の枚数とスコアに応じて複数枚引く
    let drawCount = 1;
    if (hand.length <= 3 && Math.abs(total) < 15) {
      drawCount = 2; // 手札が少なく、スコアが低い場合は2枚引く
    } else if (hand.length <= 2 && Math.abs(total) < 10) {
      drawCount = 3; // 手札が非常に少なく、スコアが非常に低い場合は3枚引く
    }

    return {
      shouldDraw: true,
      shouldExchange: false,
      shouldLock: false,
      shouldStand: false,
      drawCount,
    };
  }

  // スコアが ±20〜±22 の場合
  if (Math.abs(total) >= 20 && Math.abs(total) <= 22) {
    if (total > playerTotal) {
      return {
        shouldDraw: false,
        shouldExchange: false,
        shouldLock: false,
        shouldStand: true,
      };
    } else if (total < playerTotal) {
      // プレイヤーより低い場合は、1枚引くか交換する
      const shouldDraw = Math.random() < 0.5;
      if (shouldDraw) {
        return {
          shouldDraw: true,
          shouldExchange: false,
          shouldLock: false,
          shouldStand: false,
          drawCount: 1,
        };
      } else {
        // 最も価値の低いカードを交換
        let minValue = Infinity;
        let exchangeCardIndex: number | undefined;
        for (let i = 0; i < hand.length; i++) {
          if (hand[i].value < minValue) {
            minValue = hand[i].value;
            exchangeCardIndex = i;
          }
        }
        return {
          shouldDraw: false,
          shouldExchange: true,
          shouldLock: false,
          shouldStand: false,
          exchangeCardIndex,
        };
      }
    } else {
      // 同点時：スタンド or ロック（50%ランダム）
      const shouldStand = Math.random() < 0.5;
      if (shouldStand) {
        return {
          shouldDraw: false,
          shouldExchange: false,
          shouldLock: false,
          shouldStand: true,
        };
      } else {
        // ロックするカードを選択
        const specialCards = hand.filter((card) => card.suit === null);
        const highValueCards = hand.filter((card) => card.value >= 10);
        const idiotCard = hand.find((card) => card.name === 'The Idiot');

        let lockCardIndex: number | undefined;
        if (idiotCard) {
          lockCardIndex = hand.findIndex((card) => card.id === idiotCard.id);
        } else if (specialCards.length > 0) {
          lockCardIndex = hand.findIndex((card) => card.id === specialCards[0].id);
        } else if (highValueCards.length > 0) {
          lockCardIndex = hand.findIndex((card) => card.id === highValueCards[0].id);
        } else {
          let maxValue = -Infinity;
          for (let i = 0; i < hand.length; i++) {
            if (hand[i].value > maxValue) {
              maxValue = hand[i].value;
              lockCardIndex = i;
            }
          }
        }

        return {
          shouldDraw: false,
          shouldExchange: false,
          shouldLock: true,
          shouldStand: false,
          lockCardIndex,
        };
      }
    }
  }

  // スコアが ±23（Pure Sabacc）の場合
  if (Math.abs(total) === 23) {
    return {
      shouldDraw: false,
      shouldExchange: false,
      shouldLock: false,
      shouldStand: true,
    };
  }

  // それ以外の場合はランダムに行動を決定
  const actions: Array<'draw' | 'exchange' | 'lock' | 'stand'> = ['draw', 'exchange', 'lock', 'stand'];
  const weights = [0.3, 0.3, 0.2, 0.2];

  const random = Math.random();
  let cumulativeWeight = 0;

  for (let i = 0; i < actions.length; i++) {
    cumulativeWeight += weights[i];
    if (random < cumulativeWeight) {
      const action = actions[i];
      if (action === 'draw') {
        return {
          shouldDraw: true,
          shouldExchange: false,
          shouldLock: false,
          shouldStand: false,
          drawCount: 1,
        };
      } else if (action === 'exchange') {
        // 最も価値の低いカードを交換
        let minValue = Infinity;
        let exchangeCardIndex: number | undefined;
        for (let i = 0; i < hand.length; i++) {
          if (hand[i].value < minValue) {
            minValue = hand[i].value;
            exchangeCardIndex = i;
          }
        }
        return {
          shouldDraw: false,
          shouldExchange: true,
          shouldLock: false,
          shouldStand: false,
          exchangeCardIndex,
        };
      } else if (action === 'lock') {
        // ロックするカードを選択
        const specialCards = hand.filter((card) => card.suit === null);
        const highValueCards = hand.filter((card) => card.value >= 10);
        const idiotCard = hand.find((card) => card.name === 'The Idiot');

        let lockCardIndex: number | undefined;
        if (idiotCard) {
          lockCardIndex = hand.findIndex((card) => card.id === idiotCard.id);
        } else if (specialCards.length > 0) {
          lockCardIndex = hand.findIndex((card) => card.id === specialCards[0].id);
        } else if (highValueCards.length > 0) {
          lockCardIndex = hand.findIndex((card) => card.id === highValueCards[0].id);
        } else {
          let maxValue = -Infinity;
          for (let i = 0; i < hand.length; i++) {
            if (hand[i].value > maxValue) {
              maxValue = hand[i].value;
              lockCardIndex = i;
            }
          }
        }

        return {
          shouldDraw: false,
          shouldExchange: false,
          shouldLock: true,
          shouldStand: false,
          lockCardIndex,
        };
      } else {
        return {
          shouldDraw: false,
          shouldExchange: false,
          shouldLock: false,
          shouldStand: true,
        };
      }
    }
  }

  return {
    shouldDraw: false,
    shouldExchange: false,
    shouldLock: false,
    shouldStand: true,
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
