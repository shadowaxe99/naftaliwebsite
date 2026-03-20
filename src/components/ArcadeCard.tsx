import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Square } from 'lucide-react';

export default function ArcadeCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameType, setGameType] = useState<'brick' | 'galaga' | 'zen' | 'koi' | 'sakura'>('galaga');

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
    let lastMouse = {x: mouse.x, y: mouse.y};
    
    let firstMove = true;
    const handleMouseMove = (e: MouseEvent) => { 
      const rect = canvas.getBoundingClientRect();
      if (firstMove) {
        lastMouse.x = e.clientX - rect.left;
        lastMouse.y = e.clientY - rect.top;
        firstMove = false;
      }
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

    // Zen State
    let rocks: {x: number, y: number, r: number}[] = [];
    let zenInitialized = false;

    // Koi State
    let kois: {x: number, y: number, vx: number, vy: number, size: number, color: string, angle: number}[] = [];
    let ripples: {x: number, y: number, r: number, maxR: number, alpha: number}[] = [];
    const initKoi = () => {
      kois = [];
      const colors = ['#FF4500', '#FFA500', '#FFFFFF', '#000000', '#FF6347'];
      for(let i=0; i<5; i++) {
        kois.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: 0, vy: 0,
          size: 15 + Math.random() * 10,
          color: colors[i % colors.length],
          angle: 0
        });
      }
    };

    // Sakura State
    let petals: {x: number, y: number, vx: number, vy: number, size: number, angle: number, spin: number}[] = [];
    const initSakura = () => {
      petals = [];
      for(let i=0; i<80; i++) {
        petals.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: 1 + Math.random() * 2,
          size: 4 + Math.random() * 6,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.05
        });
      }
    };

    if(gameType === 'brick') initBricks();
    if(gameType === 'galaga') initEnemies();
    if(gameType === 'koi') initKoi();
    if(gameType === 'sakura') initSakura();

    const draw = () => {
      if (!isRunning) return;
      
      if (gameType !== 'zen') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        if (!zenInitialized) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          zenInitialized = true;
        }
      }

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
      } else if (gameType === 'zen') {
        // Draw rake lines
        const dx = mouse.x - lastMouse.x;
        const dy = mouse.y - lastMouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > 2) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
          ctx.lineWidth = 2;
          
          // Perpendicular vector for parallel lines
          const nx = -dy / dist;
          const ny = dx / dist;
          
          for(let i=-3; i<=3; i++) {
            const spacing = 12;
            ctx.beginPath();
            ctx.moveTo(lastMouse.x + nx * i * spacing, lastMouse.y + ny * i * spacing);
            ctx.lineTo(mouse.x + nx * i * spacing, mouse.y + ny * i * spacing);
            ctx.stroke();
          }
          lastMouse = {x: mouse.x, y: mouse.y};
        }

        if (mouse.clicked) {
          rocks.push({x: mouse.x, y: mouse.y, r: 15 + Math.random() * 25});
          mouse.clicked = false;
        }

        // Draw rocks
        rocks.forEach(rock => {
          ctx.beginPath();
          ctx.arc(rock.x, rock.y, rock.r, 0, Math.PI*2);
          ctx.fillStyle = '#2a2a2a';
          ctx.fill();
          ctx.strokeStyle = '#1a1a1a';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Rock highlight
          ctx.beginPath();
          ctx.arc(rock.x - rock.r*0.3, rock.y - rock.r*0.3, rock.r*0.2, 0, Math.PI*2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fill();
        });
      } else if (gameType === 'koi') {
        if (mouse.clicked) {
          ripples.push({x: mouse.x, y: mouse.y, r: 0, maxR: 100, alpha: 1});
          mouse.clicked = false;
        }

        // Draw ripples
        for(let i=ripples.length-1; i>=0; i--) {
          let rip = ripples[i];
          rip.r += 1.5;
          rip.alpha -= 0.015;
          if (rip.alpha <= 0) {
            ripples.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI*2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${rip.alpha * 0.4})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Draw koi
        kois.forEach(koi => {
          const dx = mouse.x - koi.x;
          const dy = mouse.y - koi.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist > 0) {
            koi.vx += (dx / dist) * 0.03;
            koi.vy += (dy / dist) * 0.03;
          }
          
          // Friction and speed limit
          koi.vx *= 0.98;
          koi.vy *= 0.98;
          
          const speed = Math.sqrt(koi.vx*koi.vx + koi.vy*koi.vy);
          if (speed > 2.5) {
            koi.vx = (koi.vx / speed) * 2.5;
            koi.vy = (koi.vy / speed) * 2.5;
          }
          
          koi.x += koi.vx;
          koi.y += koi.vy;
          
          if (speed > 0.1) {
            // Smooth rotation
            const targetAngle = Math.atan2(koi.vy, koi.vx);
            let diff = targetAngle - koi.angle;
            while (diff < -Math.PI) diff += Math.PI*2;
            while (diff > Math.PI) diff -= Math.PI*2;
            koi.angle += diff * 0.1;
          }

          ctx.save();
          ctx.translate(koi.x, koi.y);
          ctx.rotate(koi.angle);
          
          // Body
          ctx.beginPath();
          ctx.ellipse(0, 0, koi.size, koi.size/2, 0, 0, Math.PI*2);
          ctx.fillStyle = koi.color;
          ctx.fill();
          
          // Tail
          const tailWiggle = Math.sin(Date.now() * 0.005) * 0.5;
          ctx.beginPath();
          ctx.moveTo(-koi.size*0.8, 0);
          ctx.lineTo(-koi.size*1.8, -koi.size*0.6 + tailWiggle * 10);
          ctx.lineTo(-koi.size*1.8, koi.size*0.6 + tailWiggle * 10);
          ctx.fillStyle = koi.color;
          ctx.fill();
          
          ctx.restore();
        });
      } else if (gameType === 'sakura') {
        const wind = (mouse.x - canvas.width/2) / (canvas.width/2) * 3;
        
        petals.forEach(p => {
          p.x += p.vx + wind;
          p.y += p.vy;
          p.angle += p.spin;
          
          if (p.y > canvas.height + 20) {
            p.y = -20;
            p.x = Math.random() * canvas.width;
          }
          if (p.x > canvas.width + 20) p.x = -20;
          if (p.x < -20) p.x = canvas.width + 20;
          
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          
          ctx.beginPath();
          // Petal shape
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(p.size, -p.size, p.size*2, 0, 0, p.size*2);
          ctx.bezierCurveTo(-p.size*2, 0, -p.size, -p.size, 0, 0);
          
          ctx.fillStyle = 'rgba(255, 183, 197, 0.6)';
          ctx.fill();
          ctx.restore();
        });
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
          <div className="absolute top-4 right-4 z-20 flex gap-2 bg-black/40 p-1 rounded-full backdrop-blur-md border border-white/10 flex-wrap justify-end max-w-[80vw]">
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
              onClick={() => setGameType('zen')}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${gameType === 'zen' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
            >
              Zen
            </button>
            <button 
              onClick={() => setGameType('koi')}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${gameType === 'koi' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
            >
              Koi
            </button>
            <button 
              onClick={() => setGameType('sakura')}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${gameType === 'sakura' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
            >
              Sakura
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
