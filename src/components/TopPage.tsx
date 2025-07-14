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
      subtitle: 'スター・ウォーズに登場するカードゲーム「Sabacc」のファンメイド作品です',
      description: [
        'ディーラーと対戦するカードゲームです．',
        '手札の合計値を23または-23に近づけることを目指します．',
      ],
      startButton: '🎮 ゲーム開始',
      rulesButton: '📖 ルール説明',
      languageButton: '🌐 English',
      features: [
        {
          icon: '🃏',
          text: 'ブラックジャックに似たシンプルなルール',
        },
        { icon: '⭐', text: '4種類のスートと8種類の特殊カード' },
        { icon: '🎲', text: 'ランダムに手札が変化するSabacc Shift' },
        { icon: '🏆', text: "特別な役（Idiot's Array, Pure Sabacc）" },
      ],
    },
    en: {
      title: 'Sabacc Fan',
      subtitle: 'A fan-made implementation of the card game "Sabacc" from Star Wars',
      description: [
        'A card game where you compete against the dealer.',
        'Make your hand total close to 23 or -23.',
      ],
      startButton: '🎮 Start Game',
      rulesButton: '📖 Rules',
      languageButton: '🌐 日本語',
      features: [
        { icon: '🃏', text: 'A simple rule similar to Blackjack' },
        { icon: '⭐', text: '4 suits and 8 special cards' },
        { icon: '🎲', text: 'Randomly changing hand with Sabacc Shift' },
        {
          icon: '🏆',
          text: "Special winning conditions (Idiot's Array, Pure Sabacc)"
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
 