import React, { useState, Suspense, lazy } from 'react';
import LockScreen from './components/LockScreen';

// Lazy load the portfolio content to ensure it's not in the main bundle
const Portfolio = lazy(() => import('./components/Portfolio'));

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!isAuthenticated) {
    return <LockScreen onAuthenticate={() => setIsAuthenticated(true)} />;
  }

  return (
    <Suspense fallback={
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
        <div className="animate-pulse font-mono text-xs uppercase tracking-[0.5em] opacity-50">
          Loading Portfolio...
        </div>
      </div>
    }>
      <Portfolio isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </Suspense>
  );
}
