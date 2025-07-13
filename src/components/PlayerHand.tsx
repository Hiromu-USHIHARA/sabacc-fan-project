import type React from 'react';
import type { Player } from '../types/sabacc';
import { calculateHandTotal } from '../utils/sabaccGame';
import CardComponent from './Card';
import './PlayerHand.css';

type Language = 'ja' | 'en';

interface PlayerHandProps {
  player: Player;
  isCurrentTurn: boolean;
  onCardSelect?: (cardIndex: number) => void;
  selectedCardIndex?: number;
  language?: Language;
}

const PlayerHand: React.FC<PlayerHandProps> = ({
  player,
  isCurrentTurn,
  onCardSelect,
  selectedCardIndex,
  language = 'ja',
}) => {
  const total = calculateHandTotal(player.hand);

  const texts = {
    ja: {
      dealer: 'ディーラー',
      player: 'プレイヤー',
      total: '合計:',
      locked: 'ロック済み:',
      stood: 'スタンド済み',
    },
    en: {
      dealer: 'Dealer',
      player: 'You',
      total: 'Total:',
      locked: 'Locked:',
      stood: 'Stood',
    },
  };

  const currentTexts = texts[language];

  return (
    <div className="player-hand">
      <div className="player-info">
        <h3>{player.isDealer ? currentTexts.dealer : currentTexts.player}</h3>
        <div className="hand-total">
          {currentTexts.total}{' '}
          <span className={total >= 24 || total <= -24 ? 'bomb-out' : ''}>
            {total}
          </span>
        </div>
        {player.lockedCard && (
          <div className="locked-card-info">
            {currentTexts.locked} {player.lockedCard.name} (
            {player.lockedCard.value})
          </div>
        )}
      </div>

      <div className="cards-container">
        {player.hand.map((card, index) => (
          <CardComponent
            key={card.id}
            card={card}
            isLocked={player.lockedCard?.id === card.id}
            onClick={() => onCardSelect?.(index)}
            isSelectable={isCurrentTurn && !player.isDealer}
            isSelected={selectedCardIndex === index}
          />
        ))}
      </div>

      {player.hasStood && (
        <div className="stood-indicator">{currentTexts.stood}</div>
      )}
    </div>
  );
};

export default PlayerHand;
