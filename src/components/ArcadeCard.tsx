import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, Info, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { useCanvasGame, GameType } from '../hooks/useCanvasGame';

export default function ArcadeCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameType, setGameType] = useState<GameType>('brick');
  const [showCardGames, setShowCardGames] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const canvasRef = useCanvasGame(gameType, isPlaying, soundEnabled);

  const [isInfoHovered, setIsInfoHovered] = useState(false);

  const cardGames: { type: GameType, label: string, jp: string, info: string }[] = [
    { 
      type: 'hanafuda', 
      label: 'Hanafuda', 
      jp: '花札',
      info: 'Match cards of the same month/flower. Click to flip.'
    },
    { 
      type: 'karuta', 
      label: 'Karuta', 
      jp: 'かるた',
      info: 'Find the matching Kana card for the letter shown at the top.'
    },
    { 
      type: 'menko', 
      label: 'Menko', 
      jp: 'めんこ',
      info: 'Click to throw your card. Try to flip the target card with the wind of your throw!'
    }
  ];

  const [showInfo, setShowInfo] = useState<string | null>(null);

  const getNavBtnClass = (type: GameType | 'card') => {
    const isLightBg = ['bonsai', 'zen', 'sakura', 'infringement'].includes(gameType);
    const isActive = type === 'card' 
      ? cardGames.some(g => g.type === gameType) 
      : gameType === type;
    
    if (isActive) {
      return `px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors shadow-sm ${isLightBg ? 'bg-black text-white' : 'bg-white text-black'}`;
    } else {
      // If dropdown is open but no card game is active, keep it gray
      const isDropdownOpen = type === 'card' && showCardGames;
      return `px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors shadow-sm ${isLightBg ? (isDropdownOpen ? 'bg-black/20 text-black' : 'bg-black/10 text-black hover:bg-black/20 border border-black/5') : (isDropdownOpen ? 'bg-white/20 text-white' : 'bg-white/10 text-white hover:bg-white/20 border border-white/5')}`;
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[400px] bg-[#171717] rounded-3xl overflow-hidden border border-neutral-200 shadow-sm group"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="film-grain" />
      
      {isPlaying ? (
        <>
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 z-10 touch-none"
          />
          
          {showInfo && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm p-8">
              <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 max-w-sm shadow-2xl">
                <h4 className="text-xl font-serif text-white mb-2 flex items-center gap-2">
                  {cardGames.find(g => g.type === showInfo)?.label} 
                  <span className="text-sm opacity-50">{cardGames.find(g => g.type === showInfo)?.jp}</span>
                </h4>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  {cardGames.find(g => g.type === showInfo)?.info}
                </p>
                <button 
                  onClick={() => setShowInfo(null)}
                  className="w-full py-2 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest"
                >
                  Got it
                </button>
              </div>
            </div>
          )}

          <div className={`absolute top-4 right-4 z-20 flex gap-2 p-2 flex-wrap justify-end max-w-[95vw] sm:max-w-[90vw] rounded-2xl transition-all ${['bonsai', 'zen', 'sakura', 'infringement'].includes(gameType) ? 'bg-white/40 backdrop-blur-md border border-white/20 shadow-sm' : ''}`}>
            {gameType === 'infringement' && (
              <div className="relative">
                <button 
                  onClick={() => setIsInfoHovered(!isInfoHovered)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all shadow-lg border ${
                    isInfoHovered 
                      ? 'bg-red-600 text-white border-red-500' 
                      : (['bonsai', 'zen', 'sakura', 'infringement'].includes(gameType) ? 'bg-white/90 text-red-600 border-red-200 hover:bg-white' : 'bg-white/10 text-white hover:bg-white/20 border border-white/5')
                  }`}
                >
                  <Info size={14} />
                  <span className="hidden sm:inline">How to Play</span>
                </button>
                
                <AnimatePresence>
                  {isInfoHovered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-md border border-red-100 rounded-2xl p-4 shadow-2xl z-40"
                    >
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-2">Takedown Protocol</h4>
                      <p className="text-[11px] text-red-900 leading-relaxed font-medium">
                        Click infringing marks <span className="font-bold">(©, ™, ®)</span> before the timer ring closes. 
                        <br /><br />
                        <span className="opacity-70 italic">"Protect the brand at all costs. Every miss is a liability."</span>
                      </p>
                      <div className="mt-3 pt-3 border-t border-red-100 flex justify-between items-center">
                        <span className="text-[8px] font-mono text-red-400 uppercase">Status: Active</span>
                        <button 
                          onClick={() => setIsInfoHovered(false)}
                          className="text-[9px] font-bold text-red-600 hover:underline"
                        >
                          Dismiss
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button 
              onClick={() => { setGameType('brick'); setShowCardGames(false); }}
              className={getNavBtnClass('brick')}
            >
              Brick
            </button>
            <button 
              onClick={() => { setGameType('galaga'); setShowCardGames(false); }}
              className={getNavBtnClass('galaga')}
            >
              Galaga
            </button>
            <button 
              onClick={() => { setGameType('tetris'); setShowCardGames(false); }}
              className={getNavBtnClass('tetris')}
            >
              Law Stacker
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowCardGames(!showCardGames)}
                className={getNavBtnClass('card')}
              >
                <span className="flex items-center gap-1">
                  Card Games <ChevronDown size={10} className={`transition-transform ${showCardGames ? 'rotate-180' : ''}`} />
                </span>
              </button>
              {showCardGames && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowCardGames(false)}
                  />
                  <div className="absolute top-full right-0 pt-2 z-50 transition-all duration-200">
                    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col gap-1 min-w-[160px] shadow-2xl">
                      {cardGames.map(game => (
                        <div key={game.type} className="flex items-center gap-1">
                          <button
                            onClick={() => { setGameType(game.type); setShowCardGames(false); }}
                            className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase text-left transition-colors ${gameType === game.type ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                          >
                            {game.label} <span className="opacity-40 ml-1">{game.jp}</span>
                          </button>
                          <button 
                            onClick={() => setShowInfo(game.type)}
                            className="p-2 text-white/40 hover:text-white transition-colors"
                          >
                            <Info size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={() => { setGameType('zen'); setShowCardGames(false); }}
              className={getNavBtnClass('zen')}
            >
              Zen
            </button>
            <button 
              onClick={() => { setGameType('koi'); setShowCardGames(false); }}
              className={getNavBtnClass('koi')}
            >
              Koi
            </button>
            <button 
              onClick={() => { setGameType('sakura'); setShowCardGames(false); }}
              className={getNavBtnClass('sakura')}
            >
              Sakura
            </button>
            <button 
              onClick={() => { setGameType('lanterns'); setShowCardGames(false); }}
              className={getNavBtnClass('lanterns')}
            >
              Lanterns
            </button>
            <button 
              onClick={() => { setGameType('bonsai'); setShowCardGames(false); }}
              className={getNavBtnClass('bonsai')}
            >
              Bonsai
            </button>
            <button 
              onClick={() => { setGameType('infringement'); setShowCardGames(false); }}
              className={getNavBtnClass('infringement')}
            >
              IP Takedown
            </button>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors shadow-sm ${soundEnabled ? 'bg-emerald-500/80 text-white' : (['bonsai', 'zen', 'sakura', 'infringement'].includes(gameType) ? 'bg-black/5 text-black hover:bg-black/10' : 'bg-white/10 text-white hover:bg-white/20')} flex items-center gap-1.5 ml-2`}
            >
              {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />} Sound
            </button>
            <button 
              onClick={() => setIsPlaying(false)}
              className="px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-red-500/80 text-white hover:bg-red-500 transition-all flex items-center gap-1.5 shadow-lg shadow-red-500/20"
            >
              <Square size={10} fill="currentColor" /> Stop
            </button>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-500 group-hover:bg-black/20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(true)}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,255,255,0.3)] mb-4"
          >
            <Play className="ml-1" size={24} />
          </motion.button>
          <h3 className="text-white font-serif text-2xl font-medium mb-2">Interactive Canvas</h3>
          <p className="text-white/70 text-sm font-light tracking-wide">Take a break. Play a game.</p>
        </div>
      )}
    </div>
  );
}
