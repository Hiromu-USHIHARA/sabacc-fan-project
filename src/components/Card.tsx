import type React from 'react';
import type { Card as CardType } from '../types/sabacc';
import './Card.css';

interface CardProps {
  card: CardType;
  isFaceDown?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
  isSelectable?: boolean;
  isSelected?: boolean;
}

const CardComponent: React.FC<CardProps> = ({
  card,
  isFaceDown = false,
  isLocked = false,
  onClick,
  isSelectable = false,
  isSelected = false,
}) => {
  const getSuitSymbol = (suit: string | null) => {
    switch (suit) {
      case 'Flasks':
        return '🧪';
      case 'Sabers':
        return '⚔️';
      case 'Staves':
        return '🦯';
      case 'Coins':
        return '🪙';
      default:
        return '⭐';
    }
  };

  const getCardColor = (suit: string | null) => {
    if (suit === null) return 'purple';
    switch (suit) {
      case 'Flasks':
        return 'blue';
      case 'Sabers':
        return 'red';
      case 'Staves':
        return 'green';
      case 'Coins':
        return 'gold';
      default:
        return 'purple';
    }
  };

  const handleClick = () => {
    if (onClick && isSelectable) {
      onClick();
    }
  };

  if (isFaceDown) {
    return (
      <div className="card card-face-down">
        <div className="card-back">🂠</div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`card ${isLocked ? 'card-locked' : ''} ${isSelectable ? 'card-selectable' : ''} ${isSelected ? 'card-selected' : ''}`}
      onClick={handleClick}
      style={{ borderColor: getCardColor(card.suit) }}
      disabled={!isSelectable}
    >
      <div className="card-header">
        <span className="card-value">{card.value}</span>
        <span className="card-suit">{getSuitSymbol(card.suit)}</span>
      </div>
      <div className="card-name">{card.name}</div>
      {isLocked && <div className="card-lock-indicator">🔒</div>}
    </button>
  );
};

export default CardComponent;
