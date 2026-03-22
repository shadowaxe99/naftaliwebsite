import React, { useState, Suspense, lazy, useEffect } from 'react';
import LockScreen from './components/LockScreen';

// Lazy load the portfolio content to ensure it's not in the main bundle
const Portfolio = lazy(() => import('./components/Portfolio'));

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [globalMute, setGlobalMute] = useState(false);
  const [cursorType, setCursorType] = useState<'anime' | 'mecha' | 'default'>('anime');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    // Remove all cursor classes
    document.body.classList.remove('cursor-anime', 'cursor-mecha', 'cursor-default');
    // Add the current cursor class
    document.body.classList.add(`cursor-${cursorType}`);
  }, [cursorType]);

  if (!isAuthenticated) {
    return <LockScreen onAuthenticate={() => setIsAuthenticated(true)} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
  }

  return (
    <Suspense fallback={
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
        <div className="animate-pulse font-mono text-xs uppercase tracking-[0.5em] opacity-50">
          Loading Portfolio...
        </div>
      </div>
    }>
      <Portfolio 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        globalMute={globalMute}
        setGlobalMute={setGlobalMute}
        cursorType={cursorType}
        setCursorType={setCursorType}
      />
    </Suspense>
  );
}
