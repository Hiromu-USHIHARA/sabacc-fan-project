import React from 'react';
import './Footer.css';

type Language = 'ja' | 'en';

interface FooterProps {
  language: Language;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const texts = {
    ja: {
      title: '🎮 Sabacc Fan - ファンメイド作品',
      subtitle: 'スター・ウォーズに登場するカードゲームを体験しよう！',
      disclaimer: 'This is a fan-made project and is not affiliated with Lucasfilm Ltd.'
    },
    en: {
      title: '🎮 Sabacc Fan - Fan-Made Project',
      subtitle: 'Experience the card game from Star Wars!',
      disclaimer: 'This is a fan-made project and is not affiliated with Lucasfilm Ltd.'
    }
  };

  const currentTexts = texts[language];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-text">
          <p><strong>{currentTexts.title}</strong></p>
          <p>{currentTexts.subtitle}</p>
        </div>
        <div className="footer-links">
          <p>
            <a 
              href="https://github.com/Hiromu-USHIHARA/sabacc-fan-project.git" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              📁 GitHub Repository
            </a>
          </p>
          <p>
            Designed by{' '}
            <a 
              href="https://github.com/Hiromu-USHIHARA" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              Hiromu Ushihara
            </a>
          </p>
          <p>{currentTexts.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 