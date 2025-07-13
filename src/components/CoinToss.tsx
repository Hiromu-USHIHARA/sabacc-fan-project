import type React from 'react';
import { useEffect, useState } from 'react';
import './CoinToss.css';

type Language = 'ja' | 'en';

interface CoinTossProps {
  isVisible: boolean;
  onComplete: (winner: 'player' | 'dealer') => void;
  language?: Language;
}

const CoinToss: React.FC<CoinTossProps> = ({
  isVisible,
  onComplete,
  language = 'ja',
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [result, setResult] = useState<'player' | 'dealer' | null>(null);

  const texts = {
    ja: {
      title: '引き分け！コイントスで勝者を決定',
      player: 'プレイヤー',
      dealer: 'ディーラー',
      status: 'コインを投げています...',
      playerVictory: 'プレイヤーの勝利！',
      dealerVictory: 'ディーラーの勝利！',
    },
    en: {
      title: 'Tie! Coin toss to determine winner',
      player: 'You',
      dealer: 'Dealer',
      status: 'Flipping coin...',
      playerVictory: 'You win!',
      dealerVictory: 'Dealer wins!',
    },
  };

  const currentTexts = texts[language];

  useEffect(() => {
    if (isVisible && !isAnimating) {
      setIsAnimating(true);
      setResult(null);

      // コイントスアニメーション
      setTimeout(() => {
        // アニメーション終了、結果決定
        const winner = Math.random() < 0.5 ? 'player' : 'dealer';
        setResult(winner);

        setTimeout(() => {
          // 結果表示後、コールバック実行
          onComplete(winner);
        }, 2000);
      }, 3000);
    }
  }, [isVisible, isAnimating, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="coin-toss-overlay">
      <div className="coin-toss-container">
        <div className="coin-toss-title">{currentTexts.title}</div>

        <div className="coin-container">
          <div
            className={`coin ${isAnimating ? 'flipping' : ''} ${result ? 'result-' + result : ''}`}
          >
            <div className="coin-front">
              <div className="coin-side player-side">
                <span className="coin-text">{currentTexts.player}</span>
                <span className="coin-icon">👤</span>
              </div>
            </div>
            <div className="coin-back">
              <div className="coin-side dealer-side">
                <span className="coin-text">{currentTexts.dealer}</span>
                <span className="coin-icon">🤖</span>
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div className="coin-result">
            <div className={`result-message ${result}`}>
              {result === 'player'
                ? currentTexts.playerVictory
                : currentTexts.dealerVictory}
            </div>
          </div>
        )}

        {!result && <div className="coin-status">{currentTexts.status}</div>}
      </div>
    </div>
  );
};

export default CoinToss;
