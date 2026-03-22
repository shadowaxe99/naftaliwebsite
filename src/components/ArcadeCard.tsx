import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, Info, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { useCanvasGame, GameType } from '../hooks/useCanvasGame';

export default function ArcadeCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameType, setGameType] = useState<GameType>('brick');
  const [showCardGames, setShowCardGames] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const canvasRef = useCanvasGame(gameType, isPlaying, soundEnabled && isVisible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible && isPlaying) {
      setIsPlaying(false);
    }
  }, [isVisible, isPlaying]);

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
      info: 'Hold to charge power, release to slam! Use the wind of your throw to flip multiple target cards. Watch the wind indicator!'
    },
    {
      type: 'daifugo',
      label: 'Daifugō',
      jp: '大富豪',
      info: 'Play cards higher than the current pile. First to empty their hand wins!'
    },
    {
      type: 'oichokabu',
      label: 'Oicho-Kabu',
      jp: 'おいちょかぶ',
      info: 'Draw cards to get a total closest to 9. Similar to Baccarat.'
    }
  ];

  const [showInfo, setShowInfo] = useState<string | null>(null);

  const toggleInfo = (type: string | null) => {
    setShowInfo(type);
    if (type) {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const getNavBtnClass = (type: GameType | 'card') => {
    const isActive = type === 'card' 
      ? cardGames.some(g => g.type === gameType) 
      : gameType === type;
    
    if (isActive) {
      return `flex-shrink-0 px-2 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase transition-all shadow-sm bg-white text-black`;
    } else {
      const isDropdownOpen = type === 'card' && showCardGames;
      return `flex-shrink-0 px-2 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase transition-all shadow-sm bg-white/10 text-white hover:bg-white/20 border border-white/5 ${isDropdownOpen ? 'bg-white/20' : ''}`;
    }
  };

  return (
    <>
      <motion.div 
        layout
        ref={containerRef} 
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full h-[450px] bg-[#121212] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group transition-all duration-300 flex flex-col rounded-[2rem] overflow-visible"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none rounded-[2rem] overflow-hidden" />
      <div className="film-grain rounded-[2rem] overflow-hidden" />
      
      {isPlaying ? (
        <>
          <div className="relative z-[60] flex items-center overflow-visible bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-lg rounded-t-[2rem]">
            <div className="flex-1 flex flex-wrap gap-1.5 p-2 items-center overflow-visible">
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
                Stacker
              </button>
              
              <div className="relative flex-shrink-0">
                <button 
                  onClick={() => setShowCardGames(!showCardGames)}
                  className={getNavBtnClass('card')}
                >
                  <span className="flex items-center gap-1">
                    Cards <ChevronDown size={10} className={`transition-transform ${showCardGames ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                <AnimatePresence>
                  {showCardGames && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowCardGames(false)}
                      />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 pt-2 z-[100] transition-all duration-200"
                      >
                        <div className="bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col gap-1 min-w-[160px] shadow-2xl">
                          {cardGames.map(game => (
                            <div key={game.type} className="flex items-center gap-1">
                              <button
                                onClick={() => { setGameType(game.type); setShowCardGames(false); setShowInfo(null); }}
                                className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase text-left transition-colors ${gameType === game.type ? 'bg-white text-black' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                              >
                                {game.label} <span className="opacity-40 ml-1">{game.jp}</span>
                              </button>
                              <button 
                                onClick={() => toggleInfo(game.type)}
                                className="p-2 text-white/40 hover:text-white transition-colors"
                              >
                                <Info size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={() => { setGameType('zen'); setShowCardGames(false); setShowInfo(null); }}
                className={getNavBtnClass('zen')}
              >
                Zen
              </button>
              <button 
                onClick={() => { setGameType('koi'); setShowCardGames(false); setShowInfo(null); }}
                className={getNavBtnClass('koi')}
              >
                Koi
              </button>
              <button 
                onClick={() => { setGameType('sakura'); setShowCardGames(false); setShowInfo(null); }}
                className={getNavBtnClass('sakura')}
              >
                Sakura
              </button>
              <button 
                onClick={() => { setGameType('lanterns'); setShowCardGames(false); setShowInfo(null); }}
                className={getNavBtnClass('lanterns')}
              >
                Lanterns
              </button>
              <button 
                onClick={() => { setGameType('bonsai'); setShowCardGames(false); setShowInfo(null); }}
                className={getNavBtnClass('bonsai')}
              >
                Bonsai
              </button>
              <button 
                onClick={() => { setGameType('infringement'); setShowCardGames(false); setShowInfo(null); }}
                className={getNavBtnClass('infringement')}
              >
                Takedown
              </button>
            </div>

            <div className="flex items-center gap-2 px-4 border-l border-white/10 bg-black/40 h-full py-3">
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`flex-shrink-0 w-9 h-9 rounded-full transition-all flex items-center justify-center ${soundEnabled ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
                title={soundEnabled ? "Mute" : "Unmute"}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              
              <button 
                onClick={() => setIsPlaying(false)}
                className="flex-shrink-0 w-9 h-9 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                title="Stop Game"
              >
                <Square size={14} fill="currentColor" />
              </button>
            </div>
          </div>

          <div className="relative flex-1 w-full h-full overflow-hidden rounded-b-[2rem]">
            <canvas 
              ref={canvasRef} 
              onContextMenu={(e) => e.preventDefault()}
              className={`absolute inset-0 z-10 touch-none ${gameType === 'infringement' ? 'cursor-crosshair' : 'cursor-default'}`}
            />
            
            {gameType === 'zen' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-[10px] font-mono text-white/60 uppercase tracking-widest flex items-center gap-2 pointer-events-none"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Zen Mode: Move and press mouse to interact with the field
              </motion.div>
            )}

            {gameType === 'koi' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-[10px] font-mono text-white/60 uppercase tracking-widest flex items-center gap-2 pointer-events-none"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Koi Mode: Move and press mouse to interact with the field
              </motion.div>
            )}

            {gameType === 'sakura' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-[10px] font-mono text-white/60 uppercase tracking-widest flex items-center gap-2 pointer-events-none"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Sakura Mode: Move and press mouse to interact with the field
              </motion.div>
            )}

            {gameType === 'lanterns' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-[10px] font-mono text-white/60 uppercase tracking-widest flex items-center gap-2 pointer-events-none"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Lanterns Mode: Move and press mouse to interact with the field
              </motion.div>
            )}

            {gameType === 'bonsai' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-[10px] font-mono text-white/60 uppercase tracking-widest flex items-center gap-2 pointer-events-none"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Bonsai Mode: Click anywhere to regrow
              </motion.div>
            )}

            {gameType === 'menko' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-[10px] font-mono text-white/60 uppercase tracking-widest flex items-center gap-2 pointer-events-none"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Menko: Drag to aim, hold to charge, release to slam!
              </motion.div>
            )}

            {gameType === 'infringement' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 bg-black/90 backdrop-blur-md border border-red-500/50 px-4 py-2 rounded-full text-[10px] font-mono text-white font-bold uppercase tracking-widest flex items-center gap-2 pointer-events-none shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Takedown: Click infringing marks (©, ™, ®) before the ring closes
              </motion.div>
            )}

            {gameType === 'tetris' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-[10px] font-mono text-white/60 uppercase tracking-widest flex items-center gap-2 pointer-events-none"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Stacker: Move mouse to position, click to rotate
              </motion.div>
            )}
            
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
                    onClick={() => toggleInfo(null)}
                    className="w-full py-2 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest"
                  >
                    Got it
                  </button>
                </div>
              </div>
            )}


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
      </motion.div>
    </>
  );
}
