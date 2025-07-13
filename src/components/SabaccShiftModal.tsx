import type React from 'react';
import type { Card } from '../types/sabacc';
import CardComponent from './Card';
import './SabaccShiftModal.css';

type Language = 'ja' | 'en';

interface SabaccShiftModalProps {
  isVisible: boolean;
  onContinue: () => void;
  language: Language;
  playerHand: Card[];
  dealerHand: Card[];
  playerLockedCard: Card | null;
  dealerLockedCard: Card | null;
}

const SabaccShiftModal: React.FC<SabaccShiftModalProps> = ({
  isVisible,
  onContinue,
  language,
  playerHand,
  dealerHand,
  playerLockedCard,
  dealerLockedCard,
}) => {
  const texts = {
    ja: {
      title: '🎲 Sabacc Shift 発生！',
      subtitle: 'ロックされていないカードの値が変化しました',
      playerHand: 'プレイヤーの手札',
      dealerHand: 'ディーラーの手札',
      lockedCard: 'ロックされたカード',
      continue: '続行',
    },
    en: {
      title: '🎲 Sabacc Shift Occurred!',
      subtitle: 'Unlocked card values have changed',
      playerHand: 'Player Hand',
      dealerHand: 'Dealer Hand',
      lockedCard: 'Locked Card',
      continue: 'Continue',
    },
  };

  if (!isVisible) return null;

  const currentTexts = texts[language];

  return (
    <div className="sabacc-shift-modal-overlay">
      <div className="sabacc-shift-modal-content">
        <h2 className="sabacc-shift-modal-title">{currentTexts.title}</h2>
        <p className="sabacc-shift-modal-subtitle">{currentTexts.subtitle}</p>

        <div className="sabacc-shift-hands">
          <div className="sabacc-shift-hand">
            <h3>{currentTexts.dealerHand}</h3>
            <div className="sabacc-shift-cards">
              {dealerHand.map((card) => (
                <div
                  key={`dealer-${card.id}`}
                  className={`sabacc-shift-card-wrapper ${dealerLockedCard?.id === card.id ? 'locked' : ''}`}
                >
                  <CardComponent
                    card={card}
                    isLocked={dealerLockedCard?.id === card.id}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="sabacc-shift-hand">
            <h3>{currentTexts.playerHand}</h3>
            <div className="sabacc-shift-cards">
              {playerHand.map((card) => (
                <div
                  key={`player-${card.id}`}
                  className={`sabacc-shift-card-wrapper ${playerLockedCard?.id === card.id ? 'locked' : ''}`}
                >
                  <CardComponent
                    card={card}
                    isLocked={playerLockedCard?.id === card.id}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="sabacc-shift-continue-btn"
          onClick={onContinue}
        >
          {currentTexts.continue}
        </button>
      </div>
    </div>
  );
};

export default SabaccShiftModal; 