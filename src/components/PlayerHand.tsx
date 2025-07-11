import React from 'react';
import type { Player } from '../types/sabacc';
import CardComponent from './Card';
import { calculateHandTotal } from '../utils/sabaccGame';
import './PlayerHand.css';

interface PlayerHandProps {
  player: Player;
  isCurrentTurn: boolean;
  onCardSelect?: (cardIndex: number) => void;
  selectedCardIndex?: number;
}

const PlayerHand: React.FC<PlayerHandProps> = ({ 
  player, 
  isCurrentTurn, 
  onCardSelect, 
  selectedCardIndex 
}) => {
  const total = calculateHandTotal(player.hand);
  
  return (
    <div className="player-hand">
      <div className="player-info">
        <h3>{player.isDealer ? 'ディーラー' : 'プレイヤー'}</h3>
        <div className="hand-total">
          合計: <span className={total >= 24 || total <= -24 ? 'bomb-out' : ''}>{total}</span>
        </div>
        {player.lockedCard && (
          <div className="locked-card-info">
            ロック済み: {player.lockedCard.name} ({player.lockedCard.value})
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
        <div className="stood-indicator">スタンド済み</div>
      )}
    </div>
  );
};

export default PlayerHand; 