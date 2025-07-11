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
            <p>手札の合計値を23または-23に近づけることが目標です。23に近いほど良い手札になります。</p>
          </section>

          <section className="rule-section">
            <h3>🃏 カードの種類</h3>
            <ul>
              <li><strong>通常のカード（60枚）</strong>
                <ul>
                  <li>Flasks（🧪）: 数字1-11、Commander(12)、Mistress(13)、Master(14)、Ace(15)</li>
                  <li>Sabers（⚔️）: 数字1-11、Commander(12)、Mistress(13)、Master(14)、Ace(15)</li>
                  <li>Staves（🦯）: 数字1-11、Commander(12)、Mistress(13)、Master(14)、Ace(15)</li>
                  <li>Coins（🪙）: 数字1-11、Commander(12)、Mistress(13)、Master(14)、Ace(15)</li>
                </ul>
              </li>
              <li><strong>特別なカード（16枚）</strong>
                <ul>
                  <li>Balance（バランス）: -11</li>
                  <li>The Idiot（愚者）: 0</li>
                  <li>Endurance（忍耐）: -8</li>
                  <li>Moderation（節制）: -14</li>
                  <li>The Evil One（悪者）: -15</li>
                  <li>The Queen of Air and Darkness（闇の女王）: -2</li>
                  <li>Demise（終焉）: -13</li>
                  <li>The Star（星）: -10</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="rule-section">
            <h3>🎮 ゲームの流れ</h3>
            <ol>
              <li><strong>ゲーム開始</strong>: プレイヤーとディーラーに2枚ずつカードが配られます</li>
              <li><strong>プレイヤーの番</strong>: 以下の行動から選んでください
                <ul>
                  <li><strong>カードを引く</strong>: 山札からカードを1枚引きます（手札は最大5枚まで）</li>
                  <li><strong>カードを交換</strong>: 手札の1枚を選んで、山札の一番上のカードと交換します</li>
                  <li><strong>手札を確定</strong>: これ以上の行動をやめて、現在の手札で勝負します</li>
                  <li><strong>カードをロック</strong>: 手札の1枚を選んで、Sabacc Shiftから守ります</li>
                </ul>
              </li>
              <li><strong>ディーラーの番</strong>: コンピュータが自動的に行動を決めます</li>
              <li><strong>Sabacc Shift</strong>: 両者が手札を確定した後、25%の確率でカードの値が変わります</li>
              <li><strong>勝敗の決定</strong>: 特別な条件や通常の比較で勝者が決まります</li>
            </ol>
          </section>

          <section className="rule-section">
            <h3>🏆 特別な勝利条件</h3>
            <ul>
              <li><strong>Idiot's Array（愚者の配列）</strong>: The Idiot + 2 + 3 の組み合わせ → 即座に勝利</li>
              <li><strong>Pure Sabacc（純粋なサバック）</strong>: 手札の合計が23または-23 → 特別な勝利</li>
              <li><strong>爆発（Bomb Out）</strong>: 手札の合計が24以上または-24以下 → 即座に敗北</li>
            </ul>
          </section>

          <section className="rule-section">
            <h3>🎲 Sabacc Shift（サバック・シフト）</h3>
            <p>両者が手札を確定した後、25%の確率でSabacc Shiftが起こります。ロックしていないカードの値が、ランダムに変わってしまいます。これがSabaccの醍醐味です！</p>
          </section>

          <section className="rule-section">
            <h3>⚖️ 勝敗の決め方</h3>
            <ol>
              <li>まず、Idiot's Arrayがあるかチェックします</li>
              <li>次に、Pure Sabaccがあるかチェックします</li>
              <li>爆発していないかチェックします</li>
              <li>最後に、手札の合計が23に近い方が勝利です（同じ場合はランダムで決まります）</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RulesModal; 