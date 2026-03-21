import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Square, Info } from 'lucide-react';
import { useCanvasGame, GameType } from '../hooks/useCanvasGame';

export default function ArcadeCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameType, setGameType] = useState<GameType>('brick');
  const [showCardGames, setShowCardGames] = useState(false);
  const canvasRef = useCanvasGame(gameType, isPlaying);

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

          <div className="absolute top-4 right-4 z-20 flex gap-2 bg-black/20 p-1.5 rounded-full backdrop-blur-md border border-white/10 flex-wrap justify-end max-w-[90vw]">
            <button 
              onClick={() => { setGameType('brick'); setShowCardGames(false); }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${gameType === 'brick' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
            >
              Brick
            </button>
            <button 
              onClick={() => { setGameType('galaga'); setShowCardGames(false); }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${gameType === 'galaga' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
            >
              Galaga
            </button>
            <button 
              onClick={() => { setGameType('tetris'); setShowCardGames(false); }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${gameType === 'tetris' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
            >
              Law Stacker
            </button>
            
            <div 
              className="relative"
              onMouseEnter={() => setShowCardGames(true)}
              onMouseLeave={() => setShowCardGames(false)}
            >
              <button 
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${cardGames.some(g => g.type === gameType) ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
              >
                Card Games
              </button>
              {showCardGames && (
                <div className="absolute top-full right-0 pt-2 z-50">
                  <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col gap-1 min-w-[160px] shadow-2xl">
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
              )}
            </div>

            <button 
              onClick={() => { setGameType('zen'); setShowCardGames(false); }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${gameType === 'zen' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
            >
              Zen
            </button>
            <button 
              onClick={() => { setGameType('koi'); setShowCardGames(false); }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${gameType === 'koi' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
            >
              Koi
            </button>
            <button 
              onClick={() => { setGameType('sakura'); setShowCardGames(false); }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${gameType === 'sakura' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
            >
              Sakura
            </button>
            <button 
              onClick={() => { setGameType('lanterns'); setShowCardGames(false); }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${gameType === 'lanterns' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
            >
              Lanterns
            </button>
            <button 
              onClick={() => { setGameType('bonsai'); setShowCardGames(false); }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${gameType === 'bonsai' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
            >
              Bonsai
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
