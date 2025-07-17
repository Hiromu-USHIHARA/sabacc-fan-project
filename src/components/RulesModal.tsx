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
            '76枚のカードからなるデッキから手札を作り，手札の合計値を23または-23に近づけることを目指します．',
        },
        cards: {
          title: '🃏 デッキ',
          content: {
            normal: '通常のカード（15枚✕4種類=60枚）',
            special: '特別なカード（2枚✕8種類=16枚）',
            suits: [
            'Flasks（🧪）: 数字1-11，Commander (12)，Mistress (13)，Master (14)，Ace (15)',
            'Sabers（⚔️）: 数字1-11，Commander (12)，Mistress (13)，Master (14)，Ace (15)',
            'Staves（🦯）: 数字1-11，Commander (12)，Mistress (13)，Master (14)，Ace (15)',
            'Coins（🪙）: 数字1-11，Commander (12)，Mistress (13)，Master (14)，Ace (15)',
            ],
            specialCards: [
              'The Idiot（愚者）: 0',
              'The Queen of Air and Darkness（空と闇の女王）: -2',
              'Endurance（忍耐）: -8',
              'Balance（バランス）: -11',
              'Demise（死滅）: -13',
              'Moderation（穏健）: -14',
              'The Evil One（邪悪なる者）: -15',
              'The Star（星）: -17',
            ],
          },
        },
        gameplay: {
          title: '📋 ゲームの流れ',
          steps: [
            'ゲーム開始: プレイヤーとディーラーに2枚ずつカードが配られます',
            'プレイヤーのターン: 画面下部のボタンから選んでください',
            'ディーラーのターン: コンピュータが自動的に行動を決めます',
            'Sabacc Shift: 両者が手札を確定した後，25%の確率でロックされていないカードの値が変わります',
            '勝敗の決定: 特別な条件やスコアの比較で勝者が決まります',
          ],
          actions: [
            '➕ ドロー: 最大5枚まで山札から手札に加えることができます',
            '🔄 交換: 手札の1枚を選択して山札から交換することができます',
            '✋ スタンド: 現在の手札で勝負します（ディーラーのターンに入ります）',
            '🔒 ロック: 手札の1枚を選択してSabacc Shiftの対象から外すことができます',
          ],
        },
        victory: {
          title: '🏆 特別な勝利条件',
          conditions: [
            "Idiot's Array（愚者の配列）: The Idiot（愚者）+ 2 + 3 の3枚の組み合わせ → 即座に勝利",
            'Pure Sabacc（純粋なサバック）: 手札の合計が23または-23 → 特別な勝利',
            'Bomb Out（爆発）: 手札の合計が24以上または-24以下 → 即座に敗北',
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
            '爆発していないかチェックします（両者爆発の場合はディーラーの勝利になります）',
            '最後に，手札の合計が23または-23に近い方が勝利です（同じ場合はコイントスで決まります）',
          ],
          details: [
            // 'The Idiot + 2 + 3 の組み合わせがある場合は即座に勝利',
            // '手札の合計が23または-23の場合は特別な勝利',
            // '手札の合計が24以上または-24以下の場合は即座に敗北',
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
            'Take cards from the deck with 76 cards to make your hand total close to 23 or -23.',
        },
        cards: {
          title: '🃏 Deck',
          content: {
            normal: 'Normal Cards (15 cards ✕ 4 suits = 60 cards)',
            special: 'Special Cards (8 kinds ✕ 2 cards = 16 cards)',
            suits: [
              'Flasks (🧪): Numbers 1-11, Commander (12), Mistress (13), Master (14), Ace (15)',
              'Sabers (⚔️): Numbers 1-11, Commander (12), Mistress (13), Master (14), Ace (15)',
              'Staves (🦯): Numbers 1-11, Commander (12), Mistress (13), Master (14), Ace (15)',
              'Coins (🪙): Numbers 1-11, Commander (12), Mistress (13), Master (14), Ace (15)',
            ],
            specialCards: [
              'The Idiot: 0',
              'The Queen of Air and Darkness: -2',
              'Endurance: -8',
              'Balance: -11',
              'Demise: -13',
              'Moderation: -14',
              'The Evil One: -15',
              'The Star: -17',
            ],
          },
        },
        gameplay: {
          title: '📋 Game Flow',
          steps: [
            'Game Start: Both player and dealer receive 2 cards each',
            'Player Turn: Choose from the buttons at the bottom of the screen',
            'Dealer Turn: Computer automatically decides actions',
            "Sabacc Shift: After both players finalize their hands, there's a 25% chance that unlocked card values will change",
            'Win Decision: Winner is determined by special conditions or normal comparison',
          ],
          actions: [
            '➕ Draw: Add up to 5 cards from the deck to your hand',
            '🔄 Exchange: Select a card in your hand and exchange it with a card from the deck',
            '✋ Stand: End your turn and compete with your current hand (enter the dealer\'s turn)',
            '🔒 Lock: Select a card in your hand and remove it from the Sabacc Shift target',
          ],
        },
        victory: {
          title: '🏆 Special Winning Conditions',
          conditions: [
            "Idiot's Array: The Idiot + 2 + 3 → Instant win",
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
            'Check for Bomb Out (if both players explode, the dealer wins)',
            'Finally, the hand total closest to 23 or -23 wins (if tied, decided by coin toss)',
          ],
          details: [
            // 'The Idiot + 2 + 3 combination results in instant win',
            // 'Hand total of 23 or -23 results in special win',
            // 'Hand total of 24 or higher, or -24 or lower results in instant loss',
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
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      aria-label="Close rules modal"
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
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
 