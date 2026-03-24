import React, { useState, Suspense, lazy, useEffect, useRef } from 'react';
import LockScreen from './components/LockScreen';
import { Lock } from 'lucide-react';

// Lazy load the portfolio content to ensure it's not in the main bundle
const Portfolio = lazy(() => import('./components/Portfolio'));

const IS_OFFLINE = false;

function NotFound({ showButton = true }: { showButton?: boolean }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans text-center select-none">
      <div className="max-w-md w-full">
        <h1 className="text-9xl font-bold text-gray-100 mb-4 select-none">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The requested resource could not be found on this server. 
          It may have been moved or deleted.
        </p>
        <div className="w-full h-px bg-gray-100 mb-8" />
        {showButton && (
          <a 
            href="/"
            className="inline-block px-8 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            Return Home
          </a>
        )}
        <div className={`${showButton ? 'mt-12' : ''} flex justify-center gap-4 text-[10px] text-gray-400 uppercase tracking-[0.2em]`}>
          <span>Status: 404</span>
          <span>•</span>
          <span>© 2026 Nathan Gruen</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [globalMute, setGlobalMute] = useState(false);
  const [cursorType, setCursorType] = useState<'anime' | 'mecha' | 'default'>('anime');
  const [path, setPath] = useState(window.location.pathname);

  const [isEngaging, setIsEngaging] = useState(false);

  // Hidden lock logic
  const lockClickCount = useRef(0);
  const lastClickTime = useRef(0);

  const handleHiddenLockClick = () => {
    const now = Date.now();
    if (now - lastClickTime.current < 500) {
      lockClickCount.current += 1;
    } else {
      lockClickCount.current = 1;
    }
    lastClickTime.current = now;

    if (lockClickCount.current >= 6) {
      if (isLocked) {
        setIsLocked(false);
      } else {
        setIsLocked(true);
        setIsAuthenticated(false);
      }
      lockClickCount.current = 0;
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Remove all cursor classes
    document.body.classList.remove('cursor-anime', 'cursor-mecha', 'cursor-default');
    // Add the current cursor class
    document.body.classList.add(`cursor-${cursorType}`);
  }, [cursorType]);

  // Hidden Lock Icon Component
  const HiddenLock = ({ forceDarkText = false, noHover = false }: { forceDarkText?: boolean, noHover?: boolean }) => {
    if (isEngaging) return null;
    const useDarkText = forceDarkText || !isDarkMode;
    return (
      <div className="fixed bottom-0 left-0 p-6 z-[9999] group">
        <button 
          onClick={handleHiddenLockClick}
          className={`p-3 rounded-full transition-all duration-300 ${noHover ? 'opacity-[0.12]' : 'opacity-[0.02] group-hover:opacity-25'} ${!useDarkText ? 'text-white bg-white/10' : 'text-black bg-black/10'} ${!noHover ? (!useDarkText ? 'group-hover:bg-white/20' : 'group-hover:bg-black/20') : ''}`}
          title="System Access"
        >
          <Lock size={16} />
        </button>
      </div>
    );
  };

  // 1. If not authenticated, always show 404 facade unless "unlocked" to the password screen
  if (!isAuthenticated) {
    if (isLocked) {
      return (
        <>
          <NotFound showButton={false} />
          <HiddenLock forceDarkText={true} noHover={true} />
        </>
      );
    }
    return (
      <>
        <LockScreen onAuthenticate={() => setIsAuthenticated(true)} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <HiddenLock />
      </>
    );
  }

  // 2. If authenticated, handle real 404s or show the portfolio
  const isInvalidPath = path !== '/' && path !== '';

  if (IS_OFFLINE || isInvalidPath) {
    return (
      <>
        <NotFound showButton={true} />
        <HiddenLock forceDarkText={true} noHover={true} />
      </>
    );
  }

  return (
    <div className="relative min-h-screen">
      <Suspense fallback={
        <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-neutral-950 text-white' : 'bg-paper text-neutral-900'}`}>
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
          onEngageChange={setIsEngaging}
        />
      </Suspense>

      <HiddenLock />
    </div>
  );
}
