import React, { useState } from 'react';
import TopPage from './components/TopPage';
import SabaccGame from './components/SabaccGame';
import RulesModal from './components/RulesModal';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'top' | 'game'>('top');
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  const handleStartGame = () => {
    setCurrentPage('game');
  };

  const handleShowRules = () => {
    setIsRulesModalOpen(true);
  };

  const handleBackToTop = () => {
    setCurrentPage('top');
  };

  return (
    <div className="App">
      {currentPage === 'top' ? (
        <>
          <TopPage 
            onStartGame={handleStartGame}
            onShowRules={handleShowRules}
          />
          <Footer />
        </>
      ) : (
        <>
          <SabaccGame onBackToTop={handleBackToTop} onShowRules={handleShowRules} />
          <Footer />
        </>
      )}
      
      <RulesModal 
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
}

export default App;
