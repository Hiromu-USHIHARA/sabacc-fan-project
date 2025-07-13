import type React from 'react';
import './TopPage.css';

type Language = 'ja' | 'en';

interface TopPageProps {
  onStartGame: () => void;
  onShowRules: () => void;
  language: Language;
  onLanguageChange: () => void;
}

const TopPage: React.FC<TopPageProps> = ({
  onStartGame,
  onShowRules,
  language,
  onLanguageChange,
}) => {
  const texts = {
    ja: {
      title: 'Sabacc Fan',
      subtitle: 'スター・ウォーズに登場するカードゲームのファンメイド作品です',
      description: [
        'プレイヤーとディーラーが対戦するSabaccゲームです．',
        '目標は手札の合計値を23または-23に近づけることです．',
      ],
      startButton: '🎮 ゲーム開始',
      rulesButton: '📖 ルール説明',
      languageButton: '🌐 English',
      features: [
        {
          icon: '🧪⚔️🦯🪙',
          text: '4つのスート（Flasks, Sabers, Staves, Coins）',
        },
        { icon: '⭐', text: '8種類の特殊カード' },
        { icon: '🎲', text: 'Sabacc Shift機能' },
        { icon: '🏆', text: "特別な勝利条件（Idiot's Array, Pure Sabacc）" },
      ],
    },
    en: {
      title: 'Sabacc Fan',
      subtitle: 'A fan-made implementation of the card game from Star Wars',
      description: [
        'A Sabacc game where you compete against the dealer.',
        'The goal is to get your hand total close to 23 or -23.',
      ],
      startButton: '🎮 Start Game',
      rulesButton: '📖 Rules',
      languageButton: '🌐 日本語',
      features: [
        { icon: '🧪⚔️🦯🪙', text: '4 suits (Flasks, Sabers, Staves, Coins)' },
        { icon: '⭐', text: '8 special cards' },
        { icon: '🎲', text: 'Sabacc Shift feature' },
        {
          icon: '🏆',
          text: "Special winning conditions (Idiot's Array, Pure Sabacc)",
        },
      ],
    },
  };

  const currentTexts = texts[language];

  return (
    <div className="top-page">
      <div className="top-content">
        <div className="header-section">
          <h1 className="game-title">{currentTexts.title}</h1>
          <button type="button" className="language-toggle" onClick={onLanguageChange}>
            {currentTexts.languageButton}
          </button>
        </div>

        <div className="game-subtitle">{currentTexts.subtitle}</div>

        <div className="game-description">
          {currentTexts.description.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>

        <div className="action-buttons">
          <button type="button" className="start-btn" onClick={onStartGame}>
            {currentTexts.startButton}
          </button>
          <button type="button" className="rules-btn" onClick={onShowRules}>
            {currentTexts.rulesButton}
          </button>
        </div>

        <div className="game-features">
          {currentTexts.features.map((feature) => (
            <div className="feature" key={feature.text}>
              <span className="feature-icon">{feature.icon}</span>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopPage;
 