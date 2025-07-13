import type React from 'react';
import './RulesModal.css';

type Language = 'ja' | 'en';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const texts = {
    ja: {
      title: 'Sabacc ルール説明',
      close: '×',
      sections: {
        objective: {
          title: '🎯 ゲームの目的',
          content:
            '手札の合計値を23または-23に近づけることが目標です．<br />23または-23に近いほど良い手札になります．',
        },
        cards: {
          title: '🃏 カードの種類',
          content: {
            normal: '通常のカード（60枚）',
            special: '特別なカード（16枚）',
            suits: [
                          'Flasks（🧪）: 数字1-11，Commander(12)，Mistress(13)，Master(14)，Ace(15)',
            'Sabers（⚔️）: 数字1-11，Commander(12)，Mistress(13)，Master(14)，Ace(15)',
            'Staves（🦯）: 数字1-11，Commander(12)，Mistress(13)，Master(14)，Ace(15)',
            'Coins（🪙）: 数字1-11，Commander(12)，Mistress(13)，Master(14)，Ace(15)',
            ],
            specialCards: [
              'Balance（バランス）: -11',
              'The Idiot（愚者）: 0',
              'Endurance（忍耐）: -8',
              'Moderation（節制）: -14',
              'The Evil One（悪者）: -15',
              'The Queen of Air and Darkness（闇の女王）: -2',
              'Demise（終焉）: -13',
              'The Star（星）: -10',
            ],
          },
        },
        gameplay: {
          title: '📋 ゲームの流れ',
          steps: [
            'ゲーム開始: プレイヤーとディーラーに2枚ずつカードが配られます',
            'プレイヤーの番: 画面下部のボタンから選んでください',
            'ディーラーの番: コンピュータが自動的に行動を決めます',
            'Sabacc Shift: 両者が手札を確定した後，25%の確率でロックされていないカードの値が変わります',
            '勝敗の決定: 特別な条件や通常の比較で勝者が決まります',
          ],
          actions: [
            '➕ ドロー: 山札からカードを1枚引きます（手札は最大5枚まで）',
            '🔄 交換: 手札の1枚をクリックして選んでから，交換ボタンを押します',
            '✋ スタンド: これ以上の行動をやめて，現在の手札で勝負します',
            '🔒 ロック: 手札の1枚をクリックして選んでから，ロックボタンを押します',
          ],
        },
        victory: {
          title: '🏆 特別な勝利条件',
          conditions: [
            "Idiot's Array（愚者の配列）: The Idiot（愚者）+ 2 + 3 の3枚の組み合わせ → 即座に勝利",
            'Pure Sabacc（純粋なサバック）: 手札の合計が23または-23 → 特別な勝利',
            '爆発（Bomb Out）: 手札の合計が24以上または-24以下 → 即座に敗北',
          ],
        },
        shift: {
          title: '🎲 Sabacc Shift（サバック・シフト）',
          content:
            '両者が手札を確定した後，25%の確率でSabacc Shiftが起こります．ロックされていないカードの値が，ランダムに変わってしまいます．',
        },
        scoring: {
          title: '🏁 勝敗の決め方',
          steps: [
            "まず，Idiot's Arrayがあるかチェックします",
            '次に，Pure Sabaccがあるかチェックします',
            '爆発していないかチェックします',
            '最後に，手札の合計が23または-23に近い方が勝利です（同じ場合はランダムで決まります）',
          ],
          details: [
            'The Idiot + 2 + 3 の組み合わせがある場合は即座に勝利',
            '手札の合計が23または-23の場合は特別な勝利',
            '手札の合計が24以上または-24以下の場合は即座に敗北',
          ],
        },
      },
    },
    en: {
      title: 'Sabacc Rules',
      close: '×',
      sections: {
        objective: {
          title: '🎯 Game Objective',
          content:
            'The goal is to get your hand total close to 23 or -23.<br />The closer to 23 or -23, the better your hand.',
        },
        cards: {
          title: '🃏 Card Types',
          content: {
            normal: 'Normal Cards (60 cards)',
            special: 'Special Cards (16 cards)',
            suits: [
              'Flasks (🧪): Numbers 1-11, Commander(12), Mistress(13), Master(14), Ace(15)',
              'Sabers (⚔️): Numbers 1-11, Commander(12), Mistress(13), Master(14), Ace(15)',
              'Staves (🦯): Numbers 1-11, Commander(12), Mistress(13), Master(14), Ace(15)',
              'Coins (🪙): Numbers 1-11, Commander(12), Mistress(13), Master(14), Ace(15)',
            ],
            specialCards: [
              'Balance: -11',
              'The Idiot: 0',
              'Endurance: -8',
              'Moderation: -14',
              'The Evil One: -15',
              'The Queen of Air and Darkness: -2',
              'Demise: -13',
              'The Star: -10',
            ],
          },
        },
        gameplay: {
          title: '📋 Game Flow',
          steps: [
            'Game Start: Both player and dealer receive 2 cards each',
            'Player Turn: Choose from the buttons at the bottom of the screen',
            'Dealer Turn: Computer automatically decides actions',
            "Sabacc Shift: After both players finalize their hands, there's a 25% chance that unlocked card values change",
            'Win Decision: Winner is determined by special conditions or normal comparison',
          ],
          actions: [
            '➕ Draw: Draw 1 card from the deck (maximum 5 cards in hand)',
            '🔄 Exchange: Click on a card in your hand to select it, then press the exchange button',
            '✋ Stand: Stop taking actions and compete with your current hand',
            '🔒 Lock: Click on a card in your hand to select it, then press the lock button',
          ],
        },
        victory: {
          title: '🏆 Special Winning Conditions',
          conditions: [
            "Idiot's Array: The Idiot + 2 + 3 combination → Instant win",
            'Pure Sabacc: Hand total of 23 or -23 → Special win',
            'Bomb Out: Hand total of 24 or higher, or -24 or lower → Instant loss',
          ],
        },
        shift: {
          title: '🎲 Sabacc Shift',
          content:
            "After both players finalize their hands, there's a 25% chance that Sabacc Shift occurs. Unlocked card values change randomly.",
        },
        scoring: {
          title: '🏁 Win Determination',
          steps: [
            "First, check for Idiot's Array",
            'Next, check for Pure Sabacc',
            'Check for Bomb Out',
            'Finally, the hand total closest to 23 or -23 wins (if tied, decided randomly)',
          ],
          details: [
            'The Idiot + 2 + 3 combination results in instant win',
            'Hand total of 23 or -23 results in special win',
            'Hand total of 24 or higher, or -24 or lower results in instant loss',
          ],
        },
      },
    },
  };

  if (!isOpen) return null;

  const currentTexts = texts[language];

  return (
    <button
      type="button"
      className="modal-overlay"
      onClick={onClose}
      onKeyDown={(e) => (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') && onClose()}
      aria-label="Close rules modal"
    >
      <div 
        className="modal-content" 
      >
        <button type="button" className="modal-close" onClick={onClose}>
          {currentTexts.close}
        </button>

        <h2 className="modal-title">{currentTexts.title}</h2>

        <div className="rules-content">
          <section className="rule-section">
            <h3>{currentTexts.sections.objective.title}</h3>
            <p>{currentTexts.sections.objective.content.replace(/<br \/>/g, '\n')}</p>
          </section>

          <section className="rule-section">
            <h3>{currentTexts.sections.cards.title}</h3>
            <ul>
              <li>
                <strong>{currentTexts.sections.cards.content.normal}</strong>
                <ul>
                  {currentTexts.sections.cards.content.suits.map(
                    (suit) => (
                      <li key={suit}>{suit}</li>
                    )
                  )}
                </ul>
              </li>
              <li>
                <strong>{currentTexts.sections.cards.content.special}</strong>
                <ul>
                  {currentTexts.sections.cards.content.specialCards.map(
                    (card) => (
                      <li key={card}>{card}</li>
                    )
                  )}
                </ul>
              </li>
            </ul>
          </section>

          <section className="rule-section">
            <h3>{currentTexts.sections.gameplay.title}</h3>
            <ol>
              {currentTexts.sections.gameplay.steps.map((step, index) => (
                <li key={step}>
                  <strong>{step.split(':')[0]}</strong>: {step.split(':')[1]}
                  {index === 1 && (
                    <ul>
                      {currentTexts.sections.gameplay.actions.map(
                        (action) => (
                          <li key={action}>{action}</li>
                        )
                      )}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </section>

          <section className="rule-section">
            <h3>{currentTexts.sections.victory.title}</h3>
            <ul>
              {currentTexts.sections.victory.conditions.map(
                (condition) => (
                  <li key={condition}>
                    <strong>{condition.split(':')[0]}</strong>:{' '}
                    {condition.split(':')[1]}
                  </li>
                )
              )}
            </ul>
          </section>

          <section className="rule-section">
            <h3>{currentTexts.sections.shift.title}</h3>
            <p>{currentTexts.sections.shift.content}</p>
          </section>

          <section className="rule-section">
            <h3>{currentTexts.sections.scoring.title}</h3>
            <ol>
              {currentTexts.sections.scoring.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            {currentTexts.sections.scoring.details.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
          </section>
        </div>
      </div>
    </button>
  );
};

export default RulesModal;
 