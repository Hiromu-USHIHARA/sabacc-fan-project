import type React from 'react';
import type { PlayerAction } from '../types/sabacc';
import './ActionButtons.css';

type Language = 'ja' | 'en';

interface ActionButtonsProps {
  onAction?: (action: PlayerAction) => void;
  canDraw?: boolean;
  canExchange?: boolean;
  canStand?: boolean;
  canLock?: boolean;
  selectedCardIndex?: number;
  showResetButton?: boolean;
  onReset?: () => void;
  language?: Language;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAction,
  canDraw,
  canExchange,
  canStand,
  canLock,
  selectedCardIndex,
  showResetButton = false,
  onReset,
  language = 'ja',
}) => {
  const texts = {
    ja: {
      draw: '🃏 ドロー',
      exchange: '🔄 交換',
      stand: '✋ スタンド',
      lock: '🔒 ロック',
      newGame: '🎮 新しいゲーム',
    },
    en: {
      draw: '🃏 Draw',
      exchange: '🔄 Exchange',
      stand: '✋ Stand',
      lock: '🔒 Lock',
      newGame: '🎮 New Game',
    },
  };

  const currentTexts = texts[language];

  return (
    <div className="action-buttons">
      {!showResetButton ? (
        <>
          <button
            type="button"
            className="action-btn draw-btn"
            onClick={() => onAction?.('draw')}
            disabled={!canDraw}
          >
            {currentTexts.draw}
          </button>

          <button
            type="button"
            className="action-btn exchange-btn"
            onClick={() => onAction?.('exchange')}
            disabled={!canExchange || selectedCardIndex === undefined}
          >
            {currentTexts.exchange}
          </button>

          <button
            type="button"
            className="action-btn stand-btn"
            onClick={() => onAction?.('stand')}
            disabled={!canStand}
          >
            {currentTexts.stand}
          </button>

          <button
            type="button"
            className="action-btn lock-btn"
            onClick={() => onAction?.('lock')}
            disabled={!canLock || selectedCardIndex === undefined}
          >
            {currentTexts.lock}
          </button>
        </>
      ) : (
        <button type="button" className="action-btn reset-btn" onClick={onReset}>
          {currentTexts.newGame}
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
