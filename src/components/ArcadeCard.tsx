import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Square } from 'lucide-react';

export default function ArcadeCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameType, setGameType] = useState<'brick' | 'galaga'>('galaga');

  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = true;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    window.addEventListener('resize', resize);
    resize();

    const mouse = { x: canvas.width / 2, y: canvas.height / 2, clicked: false };
    
    const handleMouseMove = (e: MouseEvent) => { 
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; 
      mouse.y = e.clientY - rect.top; 
    };
    const handleMouseDown = () => { mouse.clicked = true; };
    const handleMouseUp = () => { mouse.clicked = false; };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Brick Breaker State
    let ball = { x: canvas.width/2, y: canvas.height - 50, dx: 4, dy: -4, radius: 6 };
    let paddle = { w: 100, h: 12, x: canvas.width/2 - 50, y: canvas.height - 30 };
    let bricks: any[] = [];
    const initBricks = () => {
      bricks = [];
      const rows = 4;
      const cols = Math.floor(canvas.width / 80);
      const padding = 10;
      const w = 60;
      const h = 20;
      const offsetX = (canvas.width - (cols * (w + padding))) / 2;
      for(let r=0; r<rows; r++) {
        for(let c=0; c<cols; c++) {
          bricks.push({ x: offsetX + c*(w+padding), y: 40 + r*(h+padding), w, h, active: true });
        }
      }
    };

    // Galaga State
    let player = { w: 40, h: 40, x: canvas.width/2 - 20, y: canvas.height - 60 };
    let projectiles: any[] = [];
    let enemies: any[] = [];
    let enemyDir = 2;
    let lastShot = 0;
    const initEnemies = () => {
      enemies = [];
      const rows = 3;
      const cols = Math.floor(canvas.width / 60) - 1;
      const offsetX = (canvas.width - (cols * 50)) / 2;
      for(let r=0; r<rows; r++) {
        for(let c=0; c<cols; c++) {
          enemies.push({ x: offsetX + c*50, y: 40 + r*40, w: 30, h: 30, active: true });
        }
      }
    };

    if(gameType === 'brick') initBricks();
    if(gameType === 'galaga') initEnemies();

    const draw = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (gameType === 'brick') {
        paddle.x = mouse.x - paddle.w/2;
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx *= -1;
        if (ball.y - ball.radius < 0) ball.dy *= -1;
        if (ball.y + ball.radius > canvas.height) {
          ball.x = canvas.width/2;
          ball.y = canvas.height - 50;
          ball.dy = -4;
          initBricks();
        }

        if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
          ball.dy = -Math.abs(ball.dy);
          ball.dx = ((ball.x - (paddle.x + paddle.w/2)) / (paddle.w/2)) * 6;
        }

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
        ctx.fillStyle = '#E50000';
        ctx.fill();
        ctx.closePath();

        let activeBricks = 0;
        bricks.forEach(b => {
          if (!b.active) return;
          activeBricks++;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.strokeRect(b.x, b.y, b.w, b.h);

          if (ball.x > b.x && ball.x < b.x + b.w && ball.y - ball.radius < b.y + b.h && ball.y + ball.radius > b.y) {
            b.active = false;
            ball.dy *= -1;
          }
        });
        if (activeBricks === 0) initBricks();

      } else if (gameType === 'galaga') {
        player.x = mouse.x - player.w/2;
        if (player.x < 0) player.x = 0;
        if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(player.x + player.w/2, player.y);
        ctx.lineTo(player.x + player.w, player.y + player.h);
        ctx.lineTo(player.x, player.y + player.h);
        ctx.fill();

        if (mouse.clicked && Date.now() - lastShot > 200) {
          projectiles.push({ x: player.x + player.w/2 - 2, y: player.y, w: 4, h: 15, dy: -8 });
          lastShot = Date.now();
        }

        projectiles.forEach((p, i) => {
          p.y += p.dy;
          ctx.fillStyle = '#E50000';
          ctx.fillRect(p.x, p.y, p.w, p.h);
          if (p.y < 0) projectiles.splice(i, 1);
        });

        let hitEdge = false;
        let activeEnemies = 0;
        enemies.forEach(e => {
          if (!e.active) return;
          activeEnemies++;
          e.x += enemyDir;
          if (e.x + e.w > canvas.width || e.x < 0) hitEdge = true;

          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.fillRect(e.x, e.y, e.w, e.h);

          projectiles.forEach((p, pi) => {
            if (p.x < e.x + e.w && p.x + p.w > e.x && p.y < e.y + e.h && p.y + p.h > e.y) {
              e.active = false;
              projectiles.splice(pi, 1);
            }
          });
        });

        if (hitEdge) {
          enemyDir *= -1;
          enemies.forEach(e => { if (e.active) e.y += 20; });
        }
        if (activeEnemies === 0) initEnemies();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPlaying, gameType]);

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
          <div className="absolute top-4 right-4 z-20 flex gap-2 bg-black/40 p-1 rounded-full backdrop-blur-md border border-white/10">
            <button 
              onClick={() => setGameType('brick')}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${gameType === 'brick' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
            >
              Brick
            </button>
            <button 
              onClick={() => setGameType('galaga')}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${gameType === 'galaga' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
            >
              Galaga
            </button>
            <button 
              onClick={() => setIsPlaying(false)}
              className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-red-400 hover:bg-white/10 transition-colors flex items-center gap-1"
            >
              <Square size={10} /> Stop
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
