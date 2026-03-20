import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';

export default function LockScreen({ onAuthenticate }: { onAuthenticate: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameType, setGameType] = useState<'brick' | 'galaga'>('brick');
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
    
    // Compare with the pre-computed hash of "DittoorQuag?"
    if (hashHex === 'e0311e81b4c1db71cd20894d36db2186f33052868ad91b7121885a49935102e0') {
      onAuthenticate();
    } else {
      setPasswordError(true);
      setPasswordInput('');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = true;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const mouse = { x: canvas.width / 2, y: canvas.height / 2, clicked: false };
    
    const handleMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const handleMouseDown = () => { mouse.clicked = true; };
    const handleMouseUp = () => { mouse.clicked = false; };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Brick Breaker State
    let ball = { x: canvas.width/2, y: canvas.height - 150, dx: 6, dy: -6, radius: 8 };
    let paddle = { w: 150, h: 16, x: canvas.width/2 - 75, y: canvas.height - 60 };
    let bricks: any[] = [];
    const initBricks = () => {
      bricks = [];
      const rows = 6;
      const cols = Math.floor(canvas.width / 120);
      const padding = 15;
      const w = 100;
      const h = 25;
      const offsetX = (canvas.width - (cols * (w + padding))) / 2;
      for(let r=0; r<rows; r++) {
        for(let c=0; c<cols; c++) {
          bricks.push({ x: offsetX + c*(w+padding), y: 80 + r*(h+padding), w, h, active: true });
        }
      }
    };

    // Galaga State
    let player = { w: 50, h: 50, x: canvas.width/2 - 25, y: canvas.height - 80 };
    let projectiles: any[] = [];
    let enemies: any[] = [];
    let enemyDir = 3;
    let lastShot = 0;
    const initEnemies = () => {
      enemies = [];
      const rows = 5;
      const cols = Math.floor(canvas.width / 90) - 2;
      const offsetX = (canvas.width - (cols * 70)) / 2;
      for(let r=0; r<rows; r++) {
        for(let c=0; c<cols; c++) {
          enemies.push({ x: offsetX + c*70, y: 80 + r*60, w: 40, h: 40, active: true });
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
          ball.y = canvas.height - 150;
          ball.dy = -6;
          initBricks();
        }

        if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
          ball.dy = -Math.abs(ball.dy);
          ball.dx = ((ball.x - (paddle.x + paddle.w/2)) / (paddle.w/2)) * 8;
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

        if (mouse.clicked && Date.now() - lastShot > 150) {
          projectiles.push({ x: player.x + player.w/2 - 3, y: player.y, w: 6, h: 20, dy: -12 });
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
          enemies.forEach(e => { if (e.active) e.y += 25; });
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [gameType]);

  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center p-6 relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-50" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0" />
      <div className="film-grain z-0" />

      {/* Game Toggle */}
      <div className="absolute top-6 right-6 z-20 flex gap-2 bg-black/40 p-1.5 rounded-full backdrop-blur-md border border-white/10">
        <button 
          onClick={() => setGameType('brick')}
          className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-colors ${gameType === 'brick' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
        >
          Brick Breaker
        </button>
        <button 
          onClick={() => setGameType('galaga')}
          className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-colors ${gameType === 'galaga' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
        >
          Galactica
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-[#1f1f1f]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10"
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
