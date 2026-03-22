import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock } from 'lucide-react';
import { useCanvasGame, GameType } from '../hooks/useCanvasGame';

export default function LockScreen({ onAuthenticate }: { onAuthenticate: () => void }) {
  const [gameType, setGameType] = useState<GameType>('brick');
  const canvasRef = useCanvasGame(gameType, true);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hash the input to compare securely
    const encoder = new TextEncoder();
    const data = encoder.encode(passwordInput);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Compare with the pre-computed hash of "admin"
    if (hashHex === '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918') {
      onAuthenticate();
    } else {
      setPasswordError(true);
      setPasswordInput('');
    }
  };

  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center p-6 relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-50" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-0" />
      <div className="film-grain z-0" />

      {/* Blueprint Annotations */}
      <div className="absolute top-10 left-10 text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] hidden lg:block select-none">
        Project: Portfolio_v2.0<br />
        Status: Construction_In_Progress<br />
        Auth_Required: True
      </div>
      <div className="absolute bottom-10 right-10 text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] hidden lg:block text-right select-none">
        Coord: 40.6247° N, 73.9450° W<br />
        © 2029 Nathan Gruen
      </div>

      {/* Zen Game Indicator */}
      <AnimatePresence>
        {gameType === 'zen' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-[10px] font-mono text-white/60 uppercase tracking-widest flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Zen Mode: Move and press mouse to interact with the field
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center bg-black/60 p-1 sm:p-1.5 rounded-full backdrop-blur-xl border border-white/10 max-w-[90vw] sm:max-w-[80vw] overflow-hidden">
        <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-1.5 sm:gap-2 px-2 py-1">
          <button 
            onClick={() => setGameType('brick')}
            className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all ${gameType === 'brick' ? 'bg-white text-black shadow-lg' : 'text-white hover:bg-white/20'}`}
          >
            Brick
          </button>
          <button 
            onClick={() => setGameType('galaga')}
            className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all ${gameType === 'galaga' ? 'bg-white text-black shadow-lg' : 'text-white hover:bg-white/20'}`}
          >
            Galaga
          </button>
          <button 
            onClick={() => setGameType('zen')}
            className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all ${gameType === 'zen' ? 'bg-white text-black shadow-lg' : 'text-white hover:bg-white/20'}`}
          >
            Zen
          </button>
          <button 
            onClick={() => setGameType('koi')}
            className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all ${gameType === 'koi' ? 'bg-white text-black shadow-lg' : 'text-white hover:bg-white/20'}`}
          >
            Koi
          </button>
          <button 
            onClick={() => setGameType('sakura')}
            className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all ${gameType === 'sakura' ? 'bg-white text-black shadow-lg' : 'text-white hover:bg-white/20'}`}
          >
            Sakura
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-black/20 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
            <Lock className="text-white/80" size={28} />
          </div>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif text-white font-medium mb-2">Restricted Access</h1>
          <p className="text-white/50 text-sm font-light">Play a game while you think of the password.</p>
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
              className={`w-full bg-black/40 border ${passwordError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white/30'} rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none transition-colors text-center tracking-widest font-mono`}
            />
            {passwordError && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs text-center mt-2 font-medium">
                Incorrect password.
              </motion.p>
            )}
          </div>
          <button 
            type="submit"
            className="w-full bg-white text-black font-medium rounded-xl px-4 py-3 hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Enter Site
          </button>
        </form>
      </motion.div>
    </div>
  );
}
