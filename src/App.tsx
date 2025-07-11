import { useState } from 'react';
import TopPage from './components/TopPage';
import SabaccGame from './components/SabaccGame';
import RulesModal from './components/RulesModal';
import Footer from './components/Footer';
import './App.css';

type Language = 'ja' | 'en';

function App() {
  const [currentPage, setCurrentPage] = useState<'top' | 'game'>('top');
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('ja');

  const handleStartGame = () => {
    setCurrentPage('game');
  };

  const handleShowRules = () => {
    setIsRulesModalOpen(true);
  };

  const handleBackToTop = () => {
    setCurrentPage('top');
  };

  const handleLanguageChange = () => {
    setLanguage(language === 'ja' ? 'en' : 'ja');
  };

  return (
    <div className="App">
      {currentPage === 'top' ? (
        <>
          <TopPage 
            onStartGame={handleStartGame}
            onShowRules={handleShowRules}
            language={language}
            onLanguageChange={handleLanguageChange}
          />
          <Footer language={language} />
        </>
      ) : (
        <>
          <SabaccGame 
            onBackToTop={handleBackToTop} 
            onShowRules={handleShowRules}
            language={language}
          />
          <Footer language={language} />
        </>
      )}
      
      <RulesModal 
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        language={language}
      />
    </div>
  );
}

export default App;
