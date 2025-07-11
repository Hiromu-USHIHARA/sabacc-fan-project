import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-text">
          <p>🎮 <strong>Sabacc Game</strong> - ファンメイド作品</p>
          <p>スター・ウォーズの伝説的カードゲームをReact + TypeScriptで実装</p>
        </div>
        <div className="footer-links">
          <p>© 2025 Sabacc Fan Project</p>
          <p>This is a fan-made project and is not affiliated with Lucasfilm Ltd.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 