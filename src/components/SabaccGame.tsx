import type React from 'react';
import { useEffect, useState } from 'react';
import type { GameState, PlayerAction } from '../types/sabacc';
import {
  calculateHandTotal,
  checkIdiotsArray,
  checkPureSabacc,
  determineWinner,
  drawCard,
  //   getDealerAction,
  getDealerStrategy,
  initializeGame,
  performSabaccShift,
  //   checkBombOut
} from '../utils/sabaccGame';
import ActionButtons from './ActionButtons';
import CoinToss from './CoinToss';
import PlayerHand from './PlayerHand';
import './SabaccGame.css';

type Language = 'ja' | 'en';

interface SabaccGameProps {
  onBackToTop: () => void;
  onShowRules: () => void;
  language: Language;
}

const SabaccGame: React.FC<SabaccGameProps> = ({
  onBackToTop,
  onShowRules,
  language,
}) => {
  const [gameState, setGameState] = useState<GameState>(initializeGame());
  const [selectedCardIndex, setSelectedCardIndex] = useState<
    number | undefined
  >();
  const [showCoinToss, setShowCoinToss] = useState(false);
  const [playerTurnPhase, setPlayerTurnPhase] = useState<
    'drawing' | 'exchanging' | 'locking'
  >('drawing');

  const texts = {
    ja: {
      backButton: '← トップページに戻る',
      title: 'Sabacc Fan',
      rulesButton: '📖 ルール',
      deckInfo: '残りカード:',
      messages: {
        cardDrawn: 'カードを引きました．',
        cardExchanged: 'カードを交換しました．',
        stood: 'スタンドしました．',
        dealerTurn: 'スタンドしました．ディーラーのターンです．',
        gameStart: 'ゲーム開始！あなたのターンです。',
        cardLocked: 'カードを干渉フィールドに配置しました．',
        dealerTurnComplete: 'ディーラーのターンが完了しました．',
        sabaccShiftPending: 'Sabacc Shiftが発生する可能性があります...',
        sabaccShiftOccurred: 'Sabacc Shiftが発生しました！',
        idiotsArrayPlayer: "Idiot's Array！プレイヤーの勝利！",
        idiotsArrayDealer: "Idiot's Array！ディーラーの勝利！",
        pureSabaccPlayer: 'Pure Sabacc！プレイヤーの勝利！',
        pureSabaccDealer: 'Pure Sabacc！ディーラーの勝利！',
        playerVictory: 'プレイヤーの勝利！',
        dealerVictory: 'ディーラーの勝利！',
      },
    },
    en: {
      backButton: '← Back to Top',
      title: 'Sabacc Fan',
      rulesButton: '📖 Rules',
      deckInfo: 'Cards remaining:',
      messages: {
        cardDrawn: 'Card drawn.',
        cardExchanged: 'Card exchanged.',
        stood: 'Stand.',
        dealerTurn: "Stand. Dealer's turn.",
        gameStart: 'Game started! Your turn.',
        cardLocked: 'Card locked in interference field.',
        dealerTurnComplete: "Dealer's turn completed.",
        sabaccShiftPending: 'Sabacc Shift may occur...',
        sabaccShiftOccurred: 'Sabacc Shift occurred!',
        idiotsArrayPlayer: "Idiot's Array! Player wins!",
        idiotsArrayDealer: "Idiot's Array! Dealer wins!",
        pureSabaccPlayer: 'Pure Sabacc! Player wins!',
        pureSabaccDealer: 'Pure Sabacc! Dealer wins!',
        playerVictory: 'Player wins!',
        dealerVictory: 'Dealer wins!',
      },
    },
  };

  const currentTexts = texts[language];

  // ゲーム開始時のメッセージを設定
  useEffect(() => {
    if (gameState.message === '') {
      setGameState((prev) => ({
        ...prev,
        message: currentTexts.messages.gameStart,
      }));
    }
  }, [currentTexts.messages.gameStart]);

  const handlePlayerAction = (action: PlayerAction) => {
    if (
      gameState.currentTurn !== 'player' ||
      gameState.gamePhase !== 'playing'
    ) {
      return;
    }

    const newGameState = { ...gameState };
    const player = { ...newGameState.player };

    switch (action) {
      case 'draw':
        if (player.hand.length < 5 && playerTurnPhase === 'drawing') {
          const { card, newDeck } = drawCard(newGameState.deck);
          player.hand.push(card);
          newGameState.deck = newDeck;
          newGameState.message = currentTexts.messages.cardDrawn;
          // 引き続き交換やスタンドが可能
        }
        break;

      case 'exchange':
        if (
          selectedCardIndex !== undefined &&
          newGameState.deck.length > 0 &&
          (playerTurnPhase === 'drawing' || playerTurnPhase === 'exchanging')
        ) {
          const { card: newCard, newDeck } = drawCard(newGameState.deck);
          const oldCard = player.hand[selectedCardIndex];
          player.hand[selectedCardIndex] = newCard;
          newGameState.deck = [oldCard, ...newDeck];
          newGameState.message = currentTexts.messages.cardExchanged;
          setSelectedCardIndex(undefined);
          setPlayerTurnPhase('exchanging');
        }
        break;

      case 'stand':
        if (playerTurnPhase === 'drawing' || playerTurnPhase === 'exchanging') {
          player.hasStood = true;
          newGameState.message = currentTexts.messages.stood;
          // スタンドしたら自動的にディーラーのターンに移行
          newGameState.currentTurn = 'dealer';
          newGameState.message = currentTexts.messages.dealerTurn;
          setPlayerTurnPhase('drawing');
        }
        break;

      case 'lock':
        if (
          selectedCardIndex !== undefined &&
          !player.lockedCard &&
          (playerTurnPhase === 'drawing' ||
            playerTurnPhase === 'exchanging' ||
            playerTurnPhase === 'locking')
        ) {
          player.lockedCard = player.hand[selectedCardIndex];
          newGameState.message = currentTexts.messages.cardLocked;
          setSelectedCardIndex(undefined);
          setPlayerTurnPhase('locking');
        }
        break;
    }

    newGameState.player = player;
    setGameState(newGameState);
  };

  const handleCardSelect = (cardIndex: number) => {
    if (gameState.currentTurn === 'player' && !gameState.player.isDealer) {
      setSelectedCardIndex(cardIndex);
    }
  };

  // ディーラーの自動行動
  useEffect(() => {
    if (
      gameState.currentTurn === 'dealer' &&
      gameState.gamePhase === 'playing'
    ) {
      const dealer = { ...gameState.dealer };

      // ディーラーの戦略を決定
      setTimeout(() => {
        const newGameState = { ...gameState };
        const strategy = getDealerStrategy(
          dealer.hand,
          newGameState.player.hand
        );

        // ディーラーは複数の行動を一度に実行
        let actionTaken = false;

        // 1. カードを引く（必要に応じて）
        if (strategy.shouldDraw && dealer.hand.length < 5) {
          const { card, newDeck } = drawCard(newGameState.deck);
          dealer.hand.push(card);
          newGameState.deck = newDeck;
          actionTaken = true;
        }

        // 2. カードを交換する（必要に応じて）
        if (
          strategy.shouldExchange &&
          newGameState.deck.length > 0 &&
          !actionTaken
        ) {
          const exchangeIndex = strategy.exchangeCardIndex ?? 0;
          const { card: newCard, newDeck } = drawCard(newGameState.deck);
          const oldCard = dealer.hand[exchangeIndex];
          dealer.hand[exchangeIndex] = newCard;
          newGameState.deck = [oldCard, ...newDeck];
          actionTaken = true;
        }

        // 3. カードをロックする（必要に応じて）
        if (strategy.shouldLock && !dealer.lockedCard && !actionTaken) {
          const lockIndex = strategy.lockCardIndex ?? 0;
          dealer.lockedCard = dealer.hand[lockIndex];
          actionTaken = true;
        }

        // 4. スタンドする
        if (strategy.shouldStand) {
          dealer.hasStood = true;
        }

        newGameState.dealer = dealer;
        newGameState.message = currentTexts.messages.dealerTurnComplete;

        // ディーラーの行動が終わったら、Sabacc Shiftと勝敗判定に移行
        newGameState.gamePhase = 'sabaccShift';
        newGameState.message = currentTexts.messages.sabaccShiftPending;

        setTimeout(() => {
          const finalGameState = { ...newGameState };

          // 25%の確率でSabacc Shift
          if (Math.random() < 0.25) {
            // 干渉フィールドに置かれたカード以外を変更
            finalGameState.player.hand = performSabaccShift(
              finalGameState.player.hand,
              finalGameState.player.lockedCard
            );
            finalGameState.dealer.hand = performSabaccShift(
              finalGameState.dealer.hand,
              finalGameState.dealer.lockedCard
            );
            finalGameState.message = currentTexts.messages.sabaccShiftOccurred;
          }

          // 勝敗判定
          const playerTotal = calculateHandTotal(finalGameState.player.hand);
          const dealerTotal = calculateHandTotal(finalGameState.dealer.hand);

          // 特別な勝利条件をチェック
          if (checkIdiotsArray(finalGameState.player.hand)) {
            finalGameState.winner = 'player';
            finalGameState.message = currentTexts.messages.idiotsArrayPlayer;
          } else if (checkIdiotsArray(finalGameState.dealer.hand)) {
            finalGameState.winner = 'dealer';
            finalGameState.message = currentTexts.messages.idiotsArrayDealer;
          } else if (checkPureSabacc(playerTotal)) {
            finalGameState.winner = 'player';
            finalGameState.message = currentTexts.messages.pureSabaccPlayer;
          } else if (checkPureSabacc(dealerTotal)) {
            finalGameState.winner = 'dealer';
            finalGameState.message = currentTexts.messages.pureSabaccDealer;
          } else {
            finalGameState.winner = determineWinner(playerTotal, dealerTotal);
            if (finalGameState.winner === 'player') {
              finalGameState.message = currentTexts.messages.playerVictory;
            } else if (finalGameState.winner === 'dealer') {
              finalGameState.message = currentTexts.messages.dealerVictory;
            } else {
              // 引き分けの場合はコイントスを表示
              setShowCoinToss(true);
              return; // ここで処理を終了
            }
          }

          finalGameState.gamePhase = 'finished';
          setGameState(finalGameState);
        }, 2000);

        setGameState(newGameState);
      }, 1000);
    }
  }, [
    gameState.currentTurn,
    gameState.gamePhase,
    gameState,
    currentTexts.messages,
  ]);

  const handleCoinTossComplete = (winner: 'player' | 'dealer') => {
    setShowCoinToss(false);
    const finalGameState = { ...gameState };
    finalGameState.winner = winner;
    finalGameState.gamePhase = 'finished';
    finalGameState.message =
      winner === 'player'
        ? currentTexts.messages.playerVictory
        : currentTexts.messages.dealerVictory;
    setGameState(finalGameState);
  };

  const resetGame = () => {
    const newGameState = initializeGame();
    newGameState.message = currentTexts.messages.gameStart;
    setGameState(newGameState);
    setSelectedCardIndex(undefined);
    setShowCoinToss(false);
    setPlayerTurnPhase('drawing');
  };

  const canDraw =
    gameState.currentTurn === 'player' &&
    gameState.gamePhase === 'playing' &&
    gameState.player.hand.length < 5 &&
    playerTurnPhase === 'drawing';

  const canExchange =
    gameState.currentTurn === 'player' &&
    gameState.gamePhase === 'playing' &&
    gameState.deck.length > 0 &&
    selectedCardIndex !== undefined &&
    (playerTurnPhase === 'drawing' || playerTurnPhase === 'exchanging');

  const canStand =
    gameState.currentTurn === 'player' &&
    gameState.gamePhase === 'playing' &&
    (playerTurnPhase === 'drawing' || playerTurnPhase === 'exchanging');

  const canLock =
    gameState.currentTurn === 'player' &&
    gameState.gamePhase === 'playing' &&
    selectedCardIndex !== undefined &&
    !gameState.player.lockedCard &&
    (playerTurnPhase === 'drawing' ||
      playerTurnPhase === 'exchanging' ||
      playerTurnPhase === 'locking');

  return (
    <div className="sabacc-game">
      <div className="game-header">
        <div className="header-top">
          <button className="back-btn" onClick={onBackToTop}>
            {currentTexts.backButton}
          </button>
          <div className="title-section">
            <h1>{currentTexts.title}</h1>
            {/* <p className="fan-made-subtitle">Fan-Made Game</p> */}
          </div>
          <button className="rules-btn" onClick={onShowRules}>
            {currentTexts.rulesButton}
          </button>
        </div>
      </div>

      <div className="game-board">
        <PlayerHand
          player={gameState.dealer}
          isCurrentTurn={gameState.currentTurn === 'dealer'}
          language={language}
        />

        <div className="game-center">
          <div
            className={`game-message ${gameState.gamePhase === 'finished' ? 'game-message-finished' : ''} ${gameState.gamePhase === 'sabaccShift' ? 'game-message-shift' : ''}`}
          >
            {gameState.message}
          </div>
          <div className="deck-info">
            {currentTexts.deckInfo} {gameState.deck.length}
          </div>
        </div>

        <PlayerHand
          player={gameState.player}
          isCurrentTurn={gameState.currentTurn === 'player'}
          onCardSelect={handleCardSelect}
          selectedCardIndex={selectedCardIndex}
          language={language}
        />
      </div>

      {gameState.currentTurn === 'player' &&
        gameState.gamePhase === 'playing' && (
          <ActionButtons
            onAction={handlePlayerAction}
            canDraw={canDraw}
            canExchange={canExchange}
            canStand={canStand}
            canLock={canLock}
            selectedCardIndex={selectedCardIndex}
            language={language}
          />
        )}

      {gameState.gamePhase === 'finished' && (
        <ActionButtons
          showResetButton={true}
          onReset={resetGame}
          language={language}
        />
      )}

      <CoinToss
        isVisible={showCoinToss}
        onComplete={handleCoinTossComplete}
        language={language}
      />
    </div>
  );
};

export default SabaccGame;
