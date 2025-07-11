import React, { useState, useEffect } from 'react';
import type { GameState, PlayerAction } from '../types/sabacc';
import { 
  initializeGame, 
  drawCard, 
  calculateHandTotal, 
  getDealerAction, 
  performSabaccShift,
  determineWinner,
  checkIdiotsArray,
  checkPureSabacc,
  checkBombOut
} from '../utils/sabaccGame';
import PlayerHand from './PlayerHand';
import ActionButtons from './ActionButtons';
import CoinToss from './CoinToss';
import './SabaccGame.css';

interface SabaccGameProps {
  onBackToTop: () => void;
  onShowRules: () => void;
}

const SabaccGame: React.FC<SabaccGameProps> = ({ onBackToTop, onShowRules }) => {
  const [gameState, setGameState] = useState<GameState>(initializeGame());
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | undefined>();
  const [showCoinToss, setShowCoinToss] = useState(false);
  const [playerTurnPhase, setPlayerTurnPhase] = useState<'drawing' | 'exchanging' | 'locking' | 'complete'>('drawing');

  const handlePlayerAction = (action: PlayerAction) => {
    if (gameState.currentTurn !== 'player' || gameState.gamePhase !== 'playing') {
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
          newGameState.message = 'カードを引きました。';
          // 引き続き交換やスタンドが可能
        }
        break;

      case 'exchange':
        if (selectedCardIndex !== undefined && newGameState.deck.length > 0 && 
            (playerTurnPhase === 'drawing' || playerTurnPhase === 'exchanging')) {
          const { card: newCard, newDeck } = drawCard(newGameState.deck);
          const oldCard = player.hand[selectedCardIndex];
          player.hand[selectedCardIndex] = newCard;
          newGameState.deck = [oldCard, ...newDeck];
          newGameState.message = 'カードを交換しました。';
          setSelectedCardIndex(undefined);
          setPlayerTurnPhase('exchanging');
        }
        break;

      case 'stand':
        if (playerTurnPhase === 'drawing' || playerTurnPhase === 'exchanging') {
          player.hasStood = true;
          newGameState.message = 'スタンドしました。';
          setPlayerTurnPhase('complete');
        }
        break;

      case 'lock':
        if (selectedCardIndex !== undefined && !player.lockedCard && 
            (playerTurnPhase === 'drawing' || playerTurnPhase === 'exchanging' || playerTurnPhase === 'locking')) {
          player.lockedCard = player.hand[selectedCardIndex];
          newGameState.message = 'カードを干渉フィールドに配置しました。';
          setSelectedCardIndex(undefined);
          setPlayerTurnPhase('locking');
        }
        break;

      case 'complete':
        // プレイヤーのターンを完了
        newGameState.currentTurn = 'dealer';
        newGameState.message = 'プレイヤーのターンが完了しました。ディーラーのターンです。';
        setPlayerTurnPhase('drawing');
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
    if (gameState.currentTurn === 'dealer' && gameState.gamePhase === 'playing') {
      const dealer = { ...gameState.dealer };
      
      // ディーラーの行動を決定（複数の行動を一度に実行）
      setTimeout(() => {
        const newGameState = { ...gameState };
        
        // ディーラーは複数の行動を一度に実行
        let actionTaken = false;
        
        // 1. カードを引く（必要に応じて）
        if (dealer.hand.length < 5) {
          const action = getDealerAction(dealer.hand);
          if (action === 'draw') {
            const { card, newDeck } = drawCard(newGameState.deck);
            dealer.hand.push(card);
            newGameState.deck = newDeck;
            actionTaken = true;
          }
        }
        
        // 2. カードを交換する（必要に応じて）
        if (newGameState.deck.length > 0 && !actionTaken) {
          const action = getDealerAction(dealer.hand);
          if (action === 'exchange') {
            const { card: newCard, newDeck } = drawCard(newGameState.deck);
            const oldCard = dealer.hand[0];
            dealer.hand[0] = newCard;
            newGameState.deck = [oldCard, ...newDeck];
            actionTaken = true;
          }
        }
        
        // 3. カードをロックする（必要に応じて）
        if (!dealer.lockedCard && !actionTaken) {
          const action = getDealerAction(dealer.hand);
          if (action === 'lock') {
            dealer.lockedCard = dealer.hand[0];
            actionTaken = true;
          }
        }
        
        // 4. スタンドする
        dealer.hasStood = true;
        
        newGameState.dealer = dealer;
        newGameState.message = 'ディーラーのターンが完了しました。';
        
        // ディーラーの行動が終わったら、Sabacc Shiftと勝敗判定に移行
        newGameState.gamePhase = 'sabaccShift';
        newGameState.message = 'Sabacc Shiftが発生する可能性があります...';
        
        setTimeout(() => {
          const finalGameState = { ...newGameState };
          
          // 25%の確率でSabacc Shift
          if (Math.random() < 0.25) {
            // 干渉フィールドに置かれたカード以外を変更
            finalGameState.player.hand = performSabaccShift(finalGameState.player.hand, finalGameState.player.lockedCard);
            finalGameState.dealer.hand = performSabaccShift(finalGameState.dealer.hand, finalGameState.dealer.lockedCard);
            finalGameState.message = 'Sabacc Shiftが発生しました！';
          }
          
          // 勝敗判定
          const playerTotal = calculateHandTotal(finalGameState.player.hand);
          const dealerTotal = calculateHandTotal(finalGameState.dealer.hand);
          
          // 特別な勝利条件をチェック
          if (checkIdiotsArray(finalGameState.player.hand)) {
            finalGameState.winner = 'player';
            finalGameState.message = 'Idiot\'s Array！プレイヤーの勝利！';
          } else if (checkIdiotsArray(finalGameState.dealer.hand)) {
            finalGameState.winner = 'dealer';
            finalGameState.message = 'Idiot\'s Array！ディーラーの勝利！';
          } else if (checkPureSabacc(playerTotal)) {
            finalGameState.winner = 'player';
            finalGameState.message = 'Pure Sabacc！プレイヤーの勝利！';
          } else if (checkPureSabacc(dealerTotal)) {
            finalGameState.winner = 'dealer';
            finalGameState.message = 'Pure Sabacc！ディーラーの勝利！';
          } else {
            finalGameState.winner = determineWinner(playerTotal, dealerTotal);
            if (finalGameState.winner === 'player') {
              finalGameState.message = 'プレイヤーの勝利！';
            } else if (finalGameState.winner === 'dealer') {
              finalGameState.message = 'ディーラーの勝利！';
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
  }, [gameState.currentTurn, gameState.gamePhase]);

  const handleCoinTossComplete = (winner: 'player' | 'dealer') => {
    setShowCoinToss(false);
    const finalGameState = { ...gameState };
    finalGameState.winner = winner;
    finalGameState.gamePhase = 'finished';
    finalGameState.message = winner === 'player' ? 'プレイヤーの勝利！' : 'ディーラーの勝利！';
    setGameState(finalGameState);
  };

  const resetGame = () => {
    setGameState(initializeGame());
    setSelectedCardIndex(undefined);
    setShowCoinToss(false);
    setPlayerTurnPhase('drawing');
  };

  const canDraw = gameState.currentTurn === 'player' && 
                  gameState.gamePhase === 'playing' && 
                  gameState.player.hand.length < 5 &&
                  playerTurnPhase === 'drawing';

  const canExchange = gameState.currentTurn === 'player' && 
                     gameState.gamePhase === 'playing' && 
                     gameState.deck.length > 0 && 
                     selectedCardIndex !== undefined &&
                     (playerTurnPhase === 'drawing' || playerTurnPhase === 'exchanging');

  const canStand = gameState.currentTurn === 'player' && 
                   gameState.gamePhase === 'playing' &&
                   (playerTurnPhase === 'drawing' || playerTurnPhase === 'exchanging');

  const canLock = gameState.currentTurn === 'player' && 
                  gameState.gamePhase === 'playing' && 
                  selectedCardIndex !== undefined && 
                  !gameState.player.lockedCard &&
                  (playerTurnPhase === 'drawing' || playerTurnPhase === 'exchanging' || playerTurnPhase === 'locking');

  const canComplete = gameState.currentTurn === 'player' && 
                     gameState.gamePhase === 'playing' &&
                     (playerTurnPhase === 'drawing' || playerTurnPhase === 'exchanging' || playerTurnPhase === 'locking');

  return (
    <div className="sabacc-game">
      <div className="game-header">
        <div className="header-top">
          <button className="back-btn" onClick={onBackToTop}>
            ← トップページに戻る
          </button>
          <h1>Sabacc</h1>
          <button className="rules-btn" onClick={onShowRules}>
            📖 ルール
          </button>
        </div>
        {gameState.gamePhase === 'finished' && (
          <button className="reset-btn" onClick={resetGame}>
            新しいゲーム
          </button>
        )}
      </div>

      <div className="game-board">
        <PlayerHand
          player={gameState.dealer}
          isCurrentTurn={gameState.currentTurn === 'dealer'}
        />
        
        <div className="game-center">
          <div className={`game-message ${gameState.gamePhase === 'finished' ? 'game-message-finished' : ''} ${gameState.gamePhase === 'sabaccShift' ? 'game-message-shift' : ''}`}>
            {gameState.message}
          </div>
          <div className="deck-info">
            残りカード: {gameState.deck.length}
          </div>
        </div>
        
        <PlayerHand
          player={gameState.player}
          isCurrentTurn={gameState.currentTurn === 'player'}
          onCardSelect={handleCardSelect}
          selectedCardIndex={selectedCardIndex}
        />
      </div>

      {gameState.currentTurn === 'player' && gameState.gamePhase === 'playing' && (
        <ActionButtons
          onAction={handlePlayerAction}
          canDraw={canDraw}
          canExchange={canExchange}
          canStand={canStand}
          canLock={canLock}
          canComplete={canComplete}
          selectedCardIndex={selectedCardIndex}
        />
      )}
      
      <CoinToss 
        isVisible={showCoinToss}
        onComplete={handleCoinTossComplete}
      />
    </div>
  );
};

export default SabaccGame; 