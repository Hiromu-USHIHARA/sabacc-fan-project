import React from 'react';
import './TopPage.css';

interface TopPageProps {
  onStartGame: () => void;
  onShowRules: () => void;
}

const TopPage: React.FC<TopPageProps> = ({ onStartGame, onShowRules }) => {
  return (
    <div className="top-page">
      <div className="top-content">
        <h1 className="game-title">Sabacc Fan</h1>
        <div className="game-subtitle">スター・ウォーズに登場するカードゲームのファンメイド作品です</div>
        {/* <div className="fan-made-badge">Fan-Made Game</div> */}
        
        <div className="game-description">
          <p>プレイヤーとディーラーが対戦するSabaccゲームです。</p>
          <p>目標は手札の合計値を23または-23に近づけることです。</p>
        </div>
        
        <div className="action-buttons">
          <button className="start-btn" onClick={onStartGame}>
            🎮 ゲーム開始
          </button>
          <button className="rules-btn" onClick={onShowRules}>
            📖 ルール説明
          </button>
        </div>
        
        <div className="game-features">
          <div className="feature">
            <span className="feature-icon">🧪⚔️🦯🪙</span>
            <span>4つのスート（Flasks, Sabers, Staves, Coins）</span>
          </div>
          <div className="feature">
            <span className="feature-icon">⭐</span>
            <span>8種類の特殊カード</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎲</span>
            <span>Sabacc Shift機能</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🏆</span>
            <span>特別勝利条件（Idiot's Array, Pure Sabacc）</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPage; 