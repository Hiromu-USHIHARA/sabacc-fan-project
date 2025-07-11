export type Suit = 'Flasks' | 'Sabers' | 'Staves' | 'Coins' | null;

export type CardName =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | 'Commander'
  | 'Mistress'
  | 'Master'
  | 'Ace'
  | 'Balance'
  | 'The Idiot'
  | 'Endurance'
  | 'Moderation'
  | 'The Evil One'
  | 'The Queen of Air and Darkness'
  | 'Demise'
  | 'The Star';

export interface Card {
  id: string;
  name: CardName;
  suit: Suit;
  value: number;
}

export interface Player {
  hand: Card[];
  lockedCard: Card | null;
  hasStood: boolean;
  isDealer: boolean;
}

export interface GameState {
  deck: Card[];
  player: Player;
  dealer: Player;
  currentTurn: 'player' | 'dealer';
  gamePhase: 'playing' | 'sabaccShift' | 'finished';
  winner: 'player' | 'dealer' | 'tie' | null;
  message: string;
}

export type PlayerAction = 'draw' | 'exchange' | 'stand' | 'lock';
