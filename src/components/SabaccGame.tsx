import type React from 'react';
import { useEffect, useState, useCallback } from 'react';
import type { GameState, PlayerAction, Card } from '../types/sabacc';
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
import SabaccShiftModal from './SabaccShiftModal';
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
  const [showSabaccShift, setShowSabaccShift] = useState(false);
  const [sabaccShiftData, setSabaccShiftData] = useState<{
    playerHand: Card[];
    dealerHand: Card[];
    playerLockedCard: Card | null;
    dealerLockedCard: Card | null;
  } | null>(null);
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
        gameStart: 'ゲーム開始！あなたのターンです．',
        cardLocked: 'カードをロックしました．',
        cardUnlocked: 'カードのロックを解除しました．',
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
        dealerTurn: "Stand. Dealer's turn now.",
        gameStart: 'Game started! Your turn.',
        cardLocked: 'Card locked.',
        cardUnlocked: 'Card unlocked.',
        dealerTurnComplete: "Dealer's turn completed.",
        sabaccShiftPending: 'Sabacc Shift may occur...',
        sabaccShiftOccurred: 'Sabacc Shift occurred!',
        idiotsArrayPlayer: "Idiot's Array! You win!",
        idiotsArrayDealer: "Idiot's Array! Dealer wins!",
        pureSabaccPlayer: 'Pure Sabacc! You win!',
        pureSabaccDealer: 'Pure Sabacc! Dealer wins!',
        playerVictory: 'You win!',
        dealerVictory: 'Dealer wins!',
      },
    },
  };

  const currentTexts = texts[language];

  // 勝敗判定とゲーム状態更新を行う関数
  const determineWinnerAndUpdateGame = useCallback((gameStateToUpdate: GameState) => {
    const playerTotal = calculateHandTotal(gameStateToUpdate.player.hand);
    const dealerTotal = calculateHandTotal(gameStateToUpdate.dealer.hand);

    // 特別な勝利条件をチェック
    const playerHasIdiotsArray = checkIdiotsArray(gameStateToUpdate.player.hand);
    const dealerHasIdiotsArray = checkIdiotsArray(gameStateToUpdate.dealer.hand);
    const playerHasPureSabacc = checkPureSabacc(playerTotal);
    const dealerHasPureSabacc = checkPureSabacc(dealerTotal);

    // 両者がイディオットズ・アレイの場合
    if (playerHasIdiotsArray && dealerHasIdiotsArray) {
      setShowCoinToss(true);
      return;
    }
    
    // 両者がピュア・サバックの場合
    if (playerHasPureSabacc && dealerHasPureSabacc) {
      setShowCoinToss(true);
      return;
    }

    // 片方のみの特別な勝利条件
    if (playerHasIdiotsArray) {
      gameStateToUpdate.winner = 'player';
      gameStateToUpdate.message = currentTexts.messages.idiotsArrayPlayer;
    } else if (dealerHasIdiotsArray) {
      gameStateToUpdate.winner = 'dealer';
      gameStateToUpdate.message = currentTexts.messages.idiotsArrayDealer;
    } else if (playerHasPureSabacc) {
      gameStateToUpdate.winner = 'player';
      gameStateToUpdate.message = currentTexts.messages.pureSabaccPlayer;
    } else if (dealerHasPureSabacc) {
      gameStateToUpdate.winner = 'dealer';
      gameStateToUpdate.message = currentTexts.messages.pureSabaccDealer;
    } else {
      gameStateToUpdate.winner = determineWinner(playerTotal, dealerTotal);
      if (gameStateToUpdate.winner === 'player') {
        gameStateToUpdate.message = currentTexts.messages.playerVictory;
      } else if (gameStateToUpdate.winner === 'dealer') {
        gameStateToUpdate.message = currentTexts.messages.dealerVictory;
      } else {
        // 引き分けの場合はコイントスを表示
        setShowCoinToss(true);
        return; // ここで処理を終了
      }
    }

    gameStateToUpdate.gamePhase = 'finished';
    setGameState(gameStateToUpdate);
  }, [currentTexts.messages]);

  // ゲーム開始時のメッセージを設定
  useEffect(() => {
    if (gameState.message === '') {
      setGameState((prev) => ({
        ...prev,
        message: currentTexts.messages.gameStart,
      }));
    }
  }, [gameState.message, currentTexts.messages.gameStart]);

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
        if (playerTurnPhase === 'drawing') {
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
        if (playerTurnPhase === 'drawing' || playerTurnPhase === 'exchanging' || playerTurnPhase === 'locking') {
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
          (playerTurnPhase === 'drawing' ||
            playerTurnPhase === 'exchanging' ||
            playerTurnPhase === 'locking')
        ) {
          // ロック解除の場合（ロックされたカードが存在する場合）
          if (player.lockedCard !== null) {
            player.lockedCard = null;
            newGameState.message = currentTexts.messages.cardUnlocked;
            setSelectedCardIndex(undefined);
            setPlayerTurnPhase('drawing');
          }
          // ロックする場合（ロックされていないカードを選択している場合）
          else if (selectedCardIndex !== undefined) {
            player.lockedCard = player.hand[selectedCardIndex];
            newGameState.message = currentTexts.messages.cardLocked;
            setSelectedCardIndex(undefined);
            setPlayerTurnPhase('locking');
          }
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
      // ディーラーの行動を逐次実行
      setTimeout(() => {
        const newGameState = { ...gameState };
        let dealer = { ...newGameState.dealer };
        let actionCount = 0;
        const maxActions = 5; // 最大5回の行動まで

        // 複数の行動を逐次実行
        while (actionCount < maxActions && !dealer.hasStood) {
          // 現在の状態で戦略を決定
          const strategy = getDealerStrategy(
            dealer.hand,
            newGameState.player.hand
          );

          let actionTaken = false;

          // 1. カードを引く（必要に応じて）
          if (strategy.shouldDraw && !actionTaken) {
            const drawCount = strategy.drawCount || 1;
            const actualDrawCount = Math.min(
              drawCount,
              maxActions - actionCount // 最大行動回数まで
            );
            
            for (let i = 0; i < actualDrawCount; i++) {
              const { card, newDeck } = drawCard(newGameState.deck);
              dealer.hand.push(card);
              newGameState.deck = newDeck;
              actionCount++;
              actionTaken = true;
            }
          }

          // 2. カードを交換する（必要に応じて）
          if (
            strategy.shouldExchange &&
            newGameState.deck.length > 0 &&
            actionCount < maxActions &&
            !actionTaken
          ) {
            const exchangeIndex = strategy.exchangeCardIndex ?? 0;
            const { card: newCard, newDeck } = drawCard(newGameState.deck);
            const oldCard = dealer.hand[exchangeIndex];
            dealer.hand[exchangeIndex] = newCard;
            newGameState.deck = [oldCard, ...newDeck];
            actionCount++;
            actionTaken = true;
          }

          // 3. カードをロックする（必要に応じて）
          if (strategy.shouldLock && !dealer.lockedCard && actionCount < maxActions && !actionTaken) {
            const lockIndex = strategy.lockCardIndex ?? 0;
            dealer.lockedCard = dealer.hand[lockIndex];
            actionCount++;
            actionTaken = true;
          }

          // 4. スタンドする
          if (strategy.shouldStand && !actionTaken) {
            dealer.hasStood = true;
            actionTaken = true;
          }

          // 行動を取らなかった場合はループを終了
          if (!actionTaken) {
            break;
          }
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
            // ロックされたカード以外を変更
            const { newHand: newPlayerHand, newDeck: deckAfterPlayer } = performSabaccShift(
              finalGameState.player.hand,
              finalGameState.player.lockedCard,
              finalGameState.deck
            );
            const { newHand: newDealerHand } = performSabaccShift(
              finalGameState.dealer.hand,
              finalGameState.dealer.lockedCard,
              deckAfterPlayer
            );

            // Sabacc Shiftの結果をポップアップで表示
            setSabaccShiftData({
              playerHand: newPlayerHand,
              dealerHand: newDealerHand,
              playerLockedCard: finalGameState.player.lockedCard,
              dealerLockedCard: finalGameState.dealer.lockedCard,
            });
            setShowSabaccShift(true);
            return; // ポップアップが閉じられるまで待機
          }

          // Sabacc Shiftが発生しなかった場合、直接勝敗判定
          determineWinnerAndUpdateGame(finalGameState);
        }, 2000);

        setGameState(newGameState);
      }, 1000);
    }
  }, [
    gameState.currentTurn,
    gameState.gamePhase,
    gameState,
    currentTexts.messages,
    determineWinnerAndUpdateGame,
  ]);

  const handleSabaccShiftComplete = () => {
    setShowSabaccShift(false);
    if (sabaccShiftData) {
      const finalGameState = { ...gameState };
      finalGameState.player.hand = sabaccShiftData.playerHand;
      finalGameState.dealer.hand = sabaccShiftData.dealerHand;
      finalGameState.message = currentTexts.messages.sabaccShiftOccurred;
      finalGameState.gamePhase = 'playing'; // ゲームフェーズをリセット
      setGameState(finalGameState); // まずゲーム状態を更新
      determineWinnerAndUpdateGame(finalGameState);
    }
  };

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
    setShowSabaccShift(false);
    setSabaccShiftData(null);
    setPlayerTurnPhase('drawing');
  };

  const canDraw =
    gameState.currentTurn === 'player' &&
    gameState.gamePhase === 'playing' &&
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
    (playerTurnPhase === 'drawing' || playerTurnPhase === 'exchanging' || playerTurnPhase === 'locking');

  const canLock =
    gameState.currentTurn === 'player' &&
    gameState.gamePhase === 'playing' &&
    (playerTurnPhase === 'drawing' ||
      playerTurnPhase === 'exchanging' ||
      playerTurnPhase === 'locking') &&
    (
      // ロックされたカードが存在する場合（ロック解除のみ、選択状態は問わない）
      gameState.player.lockedCard !== null ||
      // ロックされていない場合のみカード選択時にロック可能
      (gameState.player.lockedCard === null && selectedCardIndex !== undefined)
    );

  return (
    <div className="sabacc-game">
      <div className="game-header">
        <div className="header-top">
          <button type="button" className="back-btn" onClick={onBackToTop}>
            {currentTexts.backButton}
          </button>
          <div className="title-section">
            <h1>{currentTexts.title}</h1>
            {/* <p className="fan-made-subtitle">Fan-Made Game</p> */}
          </div>
          <button type="button" className="rules-btn" onClick={onShowRules}>
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
            isLockedCardSelected={gameState.player.lockedCard !== null}
          />
        )}

      {gameState.gamePhase === 'finished' && (
        <ActionButtons
          showResetButton={true}
          onReset={resetGame}
          language={language}
        />
      )}

      <SabaccShiftModal
        isVisible={showSabaccShift}
        onContinue={handleSabaccShiftComplete}
        language={language}
        playerHand={sabaccShiftData?.playerHand || []}
        dealerHand={sabaccShiftData?.dealerHand || []}
        playerLockedCard={sabaccShiftData?.playerLockedCard || null}
        dealerLockedCard={sabaccShiftData?.dealerLockedCard || null}
      />

      <CoinToss
        isVisible={showCoinToss}
        onComplete={handleCoinTossComplete}
        onClose={() => setShowCoinToss(false)}
        language={language}
      />
    </div>
  );
};

export default SabaccGame;
 