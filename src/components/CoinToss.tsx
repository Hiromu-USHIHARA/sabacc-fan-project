import React, { useState, useEffect } from 'react';
import './CoinToss.css';

interface CoinTossProps {
  isVisible: boolean;
  onComplete: (winner: 'player' | 'dealer') => void;
}

const CoinToss: React.FC<CoinTossProps> = ({ isVisible, onComplete }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [_, setFlipCount] = useState(0);
  const [result, setResult] = useState<'player' | 'dealer' | null>(null);

  useEffect(() => {
    if (isVisible && !isFlipping) {
      setIsFlipping(true);
      setFlipCount(0);
      setResult(null);
      
      // コイントスアニメーション開始
      const flipInterval = setInterval(() => {
        setFlipCount(prev => {
          if (prev >= 10) {
            // アニメーション終了、結果決定
            const winner = Math.random() < 0.5 ? 'player' : 'dealer';
            setResult(winner);
            setIsFlipping(false);
            clearInterval(flipInterval);
            
            // 結果表示後、コールバック実行
            setTimeout(() => {
              onComplete(winner);
            }, 2000);
            
            return prev;
          }
          return prev + 1;
        });
      }, 200);
    }
  }, [isVisible, isFlipping, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="coin-toss-overlay">
      <div className="coin-toss-container">
        <div className="coin-toss-title">引き分け！コイントスで勝者を決定</div>
        
        <div className="coin-container">
          <div className={`coin ${isFlipping ? 'flipping' : ''} ${result ? 'result-' + result : ''}`}>
            <div className="coin-front">
              <div className="coin-side player-side">
                <span className="coin-text">プレイヤー</span>
                <span className="coin-icon">👤</span>
              </div>
            </div>
            <div className="coin-back">
              <div className="coin-side dealer-side">
                <span className="coin-text">ディーラー</span>
                <span className="coin-icon">🤖</span>
              </div>
            </div>
          </div>
        </div>
        
        {result && (
          <div className="coin-result">
            <div className={`result-message ${result}`}>
              {result === 'player' ? 'プレイヤーの勝利！' : 'ディーラーの勝利！'}
            </div>
          </div>
        )}
        
        {!result && (
          <div className="coin-status">
            コインを投げています...
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinToss; 