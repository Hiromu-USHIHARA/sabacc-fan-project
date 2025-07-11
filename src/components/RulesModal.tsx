import React from 'react';
import './RulesModal.css';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2 className="modal-title">Sabacc ルール説明</h2>
        
        <div className="rules-content">
          <section className="rule-section">
            <h3>🎯 ゲームの目的</h3>
            <p>手札の合計値を±23に近づけることが目標です。</p>
          </section>

          <section className="rule-section">
            <h3>🃏 カード構成</h3>
            <ul>
              <li><strong>スタンダードカード（60枚）</strong>
                <ul>
                  <li>Flasks（⚗️）: 1-11, Commander(12), Mistress(13), Master(14), Ace(15)</li>
                  <li>Sabers（⚔️）: 1-11, Commander(12), Mistress(13), Master(14), Ace(15)</li>
                  <li>Staves（🏹）: 1-11, Commander(12), Mistress(13), Master(14), Ace(15)</li>
                  <li>Coins（💰）: 1-11, Commander(12), Mistress(13), Master(14), Ace(15)</li>
                </ul>
              </li>
              <li><strong>特殊カード（16枚）</strong>
                <ul>
                  <li>Balance: -11</li>
                  <li>The Idiot: 0</li>
                  <li>Endurance: -8</li>
                  <li>Moderation: -14</li>
                  <li>The Evil One: -15</li>
                  <li>The Queen of Air and Darkness: -2</li>
                  <li>Demise: -13</li>
                  <li>The Star: -10</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="rule-section">
            <h3>🎮 ゲームフロー</h3>
            <ol>
              <li><strong>初期化</strong>: 各プレイヤーに2枚ずつカードを配布</li>
              <li><strong>プレイヤーターン</strong>: 以下のアクションから選択
                <ul>
                  <li><strong>ドロー</strong>: カードを1枚引く（最大5枚まで）</li>
                  <li><strong>交換</strong>: 手札1枚と山札のトップカードを交換</li>
                  <li><strong>スタンド</strong>: 手札を確定</li>
                  <li><strong>ロック</strong>: 手札1枚をSabacc Shiftから保護</li>
                </ul>
              </li>
              <li><strong>ディーラーターン</strong>: AIが自動で行動を決定</li>
              <li><strong>Sabacc Shift</strong>: 両者がスタンド後、25%の確率で発生</li>
              <li><strong>勝敗判定</strong>: 特別条件または通常の比較で勝者決定</li>
            </ol>
          </section>

          <section className="rule-section">
            <h3>🏆 特別勝利条件</h3>
            <ul>
              <li><strong>Idiot's Array</strong>: The Idiot + 2 + 3 → 即勝利</li>
              <li><strong>Pure Sabacc</strong>: 合計が23または-23 → 特別勝利</li>
              <li><strong>爆発（Bomb Out）</strong>: 合計が±24以上 → 即敗北</li>
            </ul>
          </section>

          <section className="rule-section">
            <h3>🎲 Sabacc Shift</h3>
            <p>ラウンド終了時に25%の確率で発生します。ロックされていないカードの値がランダムに変更されます。</p>
          </section>

          <section className="rule-section">
            <h3>⚖️ 勝敗判定</h3>
            <ol>
              <li>Idiot's Arrayをチェック</li>
              <li>Pure Sabaccをチェック</li>
              <li>爆発をチェック</li>
              <li>±23に近い方が勝利（引き分けの場合はランダム）</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RulesModal; 