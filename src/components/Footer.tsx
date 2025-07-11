import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-text">
          <p>🎮 <strong>Sabacc Fan</strong> - ファンメイド作品</p>
          <p>スター・ウォーズに登場するカードゲームを体験しよう！</p>
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
          <p>This is a fan-made project and is not affiliated with Lucasfilm Ltd.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 