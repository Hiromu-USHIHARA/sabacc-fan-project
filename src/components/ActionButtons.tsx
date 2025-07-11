import React from 'react';
import type { PlayerAction } from '../types/sabacc';
import './ActionButtons.css';

interface ActionButtonsProps {
  onAction?: (action: PlayerAction) => void;
  canDraw?: boolean;
  canExchange?: boolean;
  canStand?: boolean;
  canLock?: boolean;
  selectedCardIndex?: number;
  showResetButton?: boolean;
  onReset?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAction,
  canDraw,
  canExchange,
  canStand,
  canLock,
  selectedCardIndex,
  showResetButton = false,
  onReset
}) => {
  return (
    <div className="action-buttons">
      {!showResetButton ? (
        <>
          <button
            className="action-btn draw-btn"
            onClick={() => onAction?.('draw')}
            disabled={!canDraw}
          >
            🃏 ドロー
          </button>
          
          <button
            className="action-btn exchange-btn"
            onClick={() => onAction?.('exchange')}
            disabled={!canExchange || selectedCardIndex === undefined}
          >
            🔄 交換
          </button>
          
          <button
            className="action-btn stand-btn"
            onClick={() => onAction?.('stand')}
            disabled={!canStand}
          >
            ✋ スタンド
          </button>
          
          <button
            className="action-btn lock-btn"
            onClick={() => onAction?.('lock')}
            disabled={!canLock || selectedCardIndex === undefined}
          >
            🔒 ロック
          </button>
        </>
      ) : (
        <button
          className="action-btn reset-btn"
          onClick={onReset}
        >
          🎮 新しいゲーム
        </button>
      )}
    </div>
  );
};

export default ActionButtons; 