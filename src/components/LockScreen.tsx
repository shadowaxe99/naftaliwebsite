import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Moon, Sun, ChevronDown, Info } from 'lucide-react';
import { useCanvasGame, GameType } from '../hooks/useCanvasGame';

export default function LockScreen({ onAuthenticate, isDarkMode, toggleTheme }: { onAuthenticate: () => void, isDarkMode: boolean, toggleTheme: () => void }) {
  const [gameType, setGameType] = useState<GameType>('brick');
  const canvasRef = useCanvasGame(gameType, true, false, isDarkMode);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Compare with the plaintext password
    if (passwordInput === 'admin3323') {
      onAuthenticate();
    } else {
      setPasswordError(true);
      setPasswordInput('');
    }
  };

  const [isZenInstructionsMinimized, setIsZenInstructionsMinimized] = useState(true);
  const [isUIVisible, setIsUIVisible] = useState(true);

  return (
    <div 
      className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#171717]' : 'bg-paper'}`}
      onMouseDown={(e) => {
        // If clicking background (canvas), hide UI
        if (e.target === e.currentTarget) {
          setIsUIVisible(false);
        }
      }}
    >
      <canvas ref={canvasRef} className={`absolute inset-0 z-0 ${isDarkMode ? 'opacity-80' : 'opacity-60'}`} />
      <div className={`absolute inset-0 bg-grid-pattern pointer-events-none z-0 ${isDarkMode ? 'opacity-10' : 'opacity-[0.03]'}`} />
      <div className={`absolute inset-0 pointer-events-none z-0 ${isDarkMode ? 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]' : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.4)_100%)]'}`} />
      <div className="film-grain z-0" />

      {/* Blueprint Annotations */}
      <div className={`absolute top-10 left-10 text-[10px] font-mono uppercase tracking-[0.3em] hidden lg:block select-none transition-opacity duration-700 opacity-100 ${isDarkMode ? 'text-white/30' : 'text-black/30'}`}>
        Project: Portfolio_v2.0<br />
        Status: Construction_In_Progress<br />
        Auth_Required: True<br />
        Local_Time: {time.toLocaleTimeString()}<br />
        Session_ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
      </div>
      <div className={`absolute bottom-10 right-10 text-[10px] font-mono uppercase tracking-[0.3em] hidden lg:block text-right select-none transition-opacity duration-700 opacity-100 ${isDarkMode ? 'text-white/30' : 'text-black/30'}`}>
        Coord: 40.6247° N, 73.9450° W<br />
        © {time.getFullYear()} Nathan Gruen
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex flex-col items-end gap-3 max-w-[90vw] sm:max-w-[80vw]">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Game Toggle */}
          <div className={`flex items-center p-1 sm:p-1.5 rounded-full backdrop-blur-xl border overflow-hidden ${isDarkMode ? 'bg-black/60 border-white/10' : 'bg-paper/60 border-black/10'}`}>
            <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-1.5 sm:gap-2 px-2 py-1">
              <button 
                onClick={() => setGameType('brick')}
                className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all ${gameType === 'brick' ? (isDarkMode ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg') : (isDarkMode ? 'text-white hover:bg-white/20' : 'text-black hover:bg-black/10')}`}
              >
                Brick
              </button>
              <button 
                onClick={() => setGameType('galaga')}
                className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all ${gameType === 'galaga' ? (isDarkMode ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg') : (isDarkMode ? 'text-white hover:bg-white/20' : 'text-black hover:bg-black/10')}`}
              >
                Galaga
              </button>
              <button 
                onClick={() => setGameType('zen')}
                className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all ${gameType === 'zen' ? (isDarkMode ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg') : (isDarkMode ? 'text-white hover:bg-white/20' : 'text-black hover:bg-black/10')}`}
              >
                Zen
              </button>
              <button 
                onClick={() => setGameType('koi')}
                className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all ${gameType === 'koi' ? (isDarkMode ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg') : (isDarkMode ? 'text-white hover:bg-white/20' : 'text-black hover:bg-black/10')}`}
              >
                Koi
              </button>
              <button 
                onClick={() => setGameType('sakura')}
                className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all ${gameType === 'sakura' ? (isDarkMode ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg') : (isDarkMode ? 'text-white hover:bg-white/20' : 'text-black hover:bg-black/10')}`}
              >
                Sakura
              </button>
            </div>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className={`p-2 sm:p-3 rounded-full backdrop-blur-xl border transition-all flex-shrink-0 ${isDarkMode ? 'bg-black/60 border-white/10 text-white hover:bg-white/20' : 'bg-paper/60 border-black/10 text-black hover:bg-black/10'}`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {gameType === 'zen' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-1.5 rounded-full backdrop-blur-xl border flex items-center gap-2 shadow-xl ${isDarkMode ? 'bg-black/60 border-white/10 text-white/50' : 'bg-paper/60 border-black/10 text-black/50'}`}
            >
              {!isZenInstructionsMinimized ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0 ml-2" />
                  <span className="text-[9px] font-mono uppercase tracking-[0.15em] leading-relaxed max-w-[200px] text-left">
                    Zen Garden: Drag to rake. Click to place items.
                  </span>
                  <button 
                    onClick={() => setIsZenInstructionsMinimized(true)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsZenInstructionsMinimized(false)}
                  className="flex items-center gap-2 px-3 py-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Info className="w-3 h-3" />
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em]">Zen Guide</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isUIVisible ? (
          <motion.div 
            key="login-box"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              pointerEvents: 'auto'
            }}
            exit={{ opacity: 0, scale: 0.95, pointerEvents: 'none' }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`w-full max-w-md backdrop-blur-sm border rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-paper/40 border-black/10'}`}
          >
            <div className="flex justify-center mb-8">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                <Lock className={isDarkMode ? 'text-white/40' : 'text-black/40'} size={28} />
              </div>
            </div>
            <div className="text-center mb-8">
              <h1 className={`text-2xl font-serif font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Restricted Access</h1>
              <p className={`text-sm font-light ${isDarkMode ? 'text-white/50' : 'text-black/50'}`}>Play a game while you think of the password.</p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="Enter password"
                  className={`w-full border rounded-xl px-4 py-3 outline-none transition-colors text-center tracking-widest font-mono ${isDarkMode ? 'bg-black/40 text-white placeholder:text-white/30' : 'bg-paper/40 text-black placeholder:text-black/30'} ${passwordError ? 'border-red-500/50 focus:border-red-500' : (isDarkMode ? 'border-white/10 focus:border-white/30' : 'border-black/10 focus:border-black/30')}`}
                />
                {passwordError && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs text-center mt-2 font-medium">
                    Incorrect password.
                  </motion.p>
                )}
              </div>
              <button 
                type="submit"
                className={`w-full font-medium rounded-xl px-4 py-3 transition-colors ${isDarkMode ? 'bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'bg-black text-white hover:bg-neutral-800 shadow-[0_0_20px_rgba(0,0,0,0.1)]'}`}
              >
                Enter Site
              </button>
            </form>
            <button 
              onClick={() => setIsUIVisible(false)}
              className={`mt-6 w-full text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-white' : 'text-black'}`}
            >
              Hide UI to Play
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="restore-ui"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20"
          >
            <button 
              onClick={() => setIsUIVisible(true)}
              className={`px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] shadow-2xl backdrop-blur-xl border transition-all ${isDarkMode ? 'bg-white text-black border-white/20 hover:bg-neutral-200' : 'bg-black text-white border-black/20 hover:bg-neutral-800'}`}
            >
              Show Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Restore Button removed */}
    </div>
  );
}
