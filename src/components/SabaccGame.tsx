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

  const handlePlayerAction = (action: PlayerAction) => {
    if (gameState.currentTurn !== 'player' || gameState.gamePhase !== 'playing') {
      return;
    }

    const newGameState = { ...gameState };
    const player = { ...newGameState.player };

    switch (action) {
      case 'draw':
        if (player.hand.length < 5) {
          const { card, newDeck } = drawCard(newGameState.deck);
          player.hand.push(card);
          newGameState.deck = newDeck;
          newGameState.currentTurn = 'dealer';
          newGameState.message = 'カードを引きました。ディーラーのターンです。';
        }
        break;

      case 'exchange':
        if (selectedCardIndex !== undefined && newGameState.deck.length > 0) {
          const { card: newCard, newDeck } = drawCard(newGameState.deck);
          const oldCard = player.hand[selectedCardIndex];
          player.hand[selectedCardIndex] = newCard;
          newGameState.deck = [oldCard, ...newDeck];
          newGameState.currentTurn = 'dealer';
          newGameState.message = 'カードを交換しました。ディーラーのターンです。';
          setSelectedCardIndex(undefined);
        }
        break;

      case 'stand':
        player.hasStood = true;
        newGameState.currentTurn = 'dealer';
        newGameState.message = 'スタンドしました。ディーラーのターンです。';
        break;

      case 'lock':
        if (selectedCardIndex !== undefined && !player.lockedCard) {
          player.lockedCard = player.hand[selectedCardIndex];
          newGameState.currentTurn = 'dealer';
          newGameState.message = 'カードをロックしました。ディーラーのターンです。';
          setSelectedCardIndex(undefined);
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
    if (gameState.currentTurn === 'dealer' && gameState.gamePhase === 'playing') {
      const dealer = { ...gameState.dealer };
      
      // ディーラーの行動を決定
      const action = getDealerAction(dealer.hand);
      
      setTimeout(() => {
        const newGameState = { ...gameState };
        
        switch (action) {
          case 'draw':
            if (dealer.hand.length < 5) {
              const { card, newDeck } = drawCard(newGameState.deck);
              dealer.hand.push(card);
              newGameState.deck = newDeck;
              newGameState.message = 'ディーラーがカードを引きました。';
            }
            break;

          case 'exchange':
            if (newGameState.deck.length > 0) {
              const { card: newCard, newDeck } = drawCard(newGameState.deck);
              const oldCard = dealer.hand[0];
              dealer.hand[0] = newCard;
              newGameState.deck = [oldCard, ...newDeck];
              newGameState.message = 'ディーラーがカードを交換しました。';
            }
            break;

          case 'stand':
            dealer.hasStood = true;
            newGameState.message = 'ディーラーがスタンドしました。';
            break;

          case 'lock':
            if (!dealer.lockedCard) {
              dealer.lockedCard = dealer.hand[0];
              newGameState.message = 'ディーラーがカードをロックしました。';
            }
            break;
        }

        newGameState.dealer = dealer;
        
        // ディーラーがスタンドした場合、またはディーラーの手札が5枚になった場合
        if (dealer.hasStood || dealer.hand.length >= 5) {
          // 両者がスタンドしたらSabacc Shiftをチェック
          if (dealer.hasStood && newGameState.player.hasStood) {
            newGameState.gamePhase = 'sabaccShift';
            newGameState.message = 'Sabacc Shiftが発生する可能性があります...';
            
            setTimeout(() => {
              const finalGameState = { ...newGameState };
              
              // 25%の確率でSabacc Shift
              if (Math.random() < 0.25) {
                finalGameState.player.hand = performSabaccShift(finalGameState.player.hand);
                finalGameState.dealer.hand = performSabaccShift(finalGameState.dealer.hand);
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
          } else {
            // ディーラーがスタンドしたが、プレイヤーがまだスタンドしていない場合
            newGameState.currentTurn = 'player';
            setGameState(newGameState);
          }
        } else {
          // ディーラーがまだ行動できる場合、続行
          newGameState.currentTurn = 'player';
          setGameState(newGameState);
        }
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
  };

  const canDraw = gameState.currentTurn === 'player' && 
                  gameState.gamePhase === 'playing' && 
                  gameState.player.hand.length < 5;

  const canExchange = gameState.currentTurn === 'player' && 
                     gameState.gamePhase === 'playing' && 
                     gameState.deck.length > 0 && 
                     selectedCardIndex !== undefined;

  const canStand = gameState.currentTurn === 'player' && 
                   gameState.gamePhase === 'playing';

  const canLock = gameState.currentTurn === 'player' && 
                  gameState.gamePhase === 'playing' && 
                  selectedCardIndex !== undefined && 
                  !gameState.player.lockedCard;

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