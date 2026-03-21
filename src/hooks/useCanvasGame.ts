import { useEffect, useRef } from 'react';

export type GameType = 'brick' | 'galaga' | 'zen' | 'koi' | 'sakura' | 'tetris' | 'lanterns' | 'bonsai' | 'hanafuda' | 'karuta' | 'menko';

export function useCanvasGame(gameType: GameType, isPlaying: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = true;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', resize);
    resize();

    const mouse = { x: canvas.width / 2, y: canvas.height / 2, clicked: false };
    let lastMouse = { x: mouse.x, y: mouse.y };
    let firstMove = true;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (firstMove) {
        lastMouse.x = x;
        lastMouse.y = y;
        firstMove = false;
      }
      mouse.x = x;
      mouse.y = y;
    };
    const handleMouseDown = () => { mouse.clicked = true; };
    const handleMouseUp = () => { mouse.clicked = false; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // --- Game States ---
    let particles: { x: number, y: number, vx: number, vy: number, size: number, color: string, alpha: number, life: number }[] = [];
    const spawnParticles = (x: number, y: number, color: string, count = 10) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          size: 2 + Math.random() * 4,
          color,
          alpha: 1,
          life: 1
        });
      }
    };

    let screenShake = 0;
    const shake = (amt: number) => { screenShake = Math.max(screenShake, amt); };

    // 1. Brick Breaker
    let ball = { x: canvas.width / 2, y: canvas.height - 50, dx: 5, dy: -5, radius: 6 };
    let ballTrail: { x: number, y: number }[] = [];
    let paddle = { w: 100, h: 12, x: canvas.width / 2 - 50, y: canvas.height - 30 };
    let bricks: any[] = [];
    const initBricks = () => {
      bricks = [];
      const rows = 4;
      const cols = Math.floor(canvas.width / 80);
      const padding = 10;
      const w = 60;
      const h = 20;
      const offsetX = (canvas.width - (cols * (w + padding))) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          bricks.push({ x: offsetX + c * (w + padding), y: 80 + r * (h + padding), w, h, active: true });
        }
      }
    };

    // 2. Galaga
    let player = { w: 40, h: 40, x: canvas.width / 2 - 20, y: canvas.height - 60 };
    let projectiles: any[] = [];
    let enemies: any[] = [];
    let enemyDir = 2;
    let lastShot = 0;
    let stars: { x: number, y: number, size: number, speed: number }[] = [];
    const initStars = () => {
      stars = [];
      for (let i = 0; i < 50; i++) {
        stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 2, speed: 0.5 + Math.random() * 2 });
      }
    };
    const initEnemies = () => {
      initStars();
      enemies = [];
      const rows = 3;
      const cols = Math.floor(canvas.width / 60) - 1;
      const offsetX = (canvas.width - (cols * 50)) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          enemies.push({ x: offsetX + c * 50, y: 80 + r * 40, w: 30, h: 30, active: true });
        }
      }
    };

    // 3. Zen Garden (Improved)
    let rocks: { x: number, y: number, r: number, color: string }[] = [];
    let zenInitialized = false;
    let mossPatches: { x: number, y: number, r: number }[] = [];
    const rockColors = ['#2a2a2a', '#3d4035', '#4a4a4a', '#1f2421'];

    // 4. Koi Pond
    let kois: { x: number, y: number, vx: number, vy: number, size: number, color: string, angle: number }[] = [];
    let ripples: { x: number, y: number, r: number, maxR: number, alpha: number }[] = [];
    const initKoi = () => {
      kois = [];
      const colors = ['#FF4500', '#FFA500', '#FFFFFF', '#000000', '#FF6347'];
      for (let i = 0; i < 5; i++) {
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

    // 5. Sakura
    let petals: { x: number, y: number, vx: number, vy: number, size: number, angle: number, spin: number }[] = [];
    const initSakura = () => {
      petals = [];
      for (let i = 0; i < 80; i++) {
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

    // 6. Tetris (Law Stacker - Improved)
    const tetrisWords = [
      "COPYRIGHT", "TRADEMARK", "IP LAW", "ENTERTAINMENT", "NYLS", "JAPANESE LAW",
      "NOVELIST", "VOICE ACTING", "SQL", "STABLE DIFFUSION", "ART SCROLL",
      "KOHENS TREASURE", "SEMICHAH", "TALMUD", "HALACHA", "ADVOCACY",
      "JURISPRUDENCE", "LITIGATION", "FAIR USE", "PUBLIC DOMAIN", "WIPO",
      "BERNE", "LANHAM ACT", "DMCA", "著作権", "商標", "知的財産", "特許",
      "法律", "裁判", "弁護士", "SAKURA", "HANAFUDA", "KARUTA", "MENKO",
      "TOKYO", "KYOTO", "OSAKA", "BROOKLYN", "NEW YORK", "PRECEDENT",
      "STATUTE", "TORT", "EQUITY", "CONTRACT", "LIABILITY", "CONSTITUTION"
    ];
    const tetrisColors = ['#E50000', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];
    let tetrisBlocks: { x: number, y: number, w: number, h: number, word: string, color: string, active: boolean }[] = [];
    let currentBlock: any = null;
    let nextBlock: any = null;
    let tetrisLastDrop = Date.now();
    let tetrisScore = 0;

    const spawnTetrisBlock = () => {
      if (!nextBlock) {
        const word = tetrisWords[Math.floor(Math.random() * tetrisWords.length)];
        const color = tetrisColors[Math.floor(Math.random() * tetrisColors.length)];
        const w = Math.max(80, word.length * 10);
        const h = 30;
        nextBlock = { word, color, w, h };
      }
      
      currentBlock = { 
        ...nextBlock,
        x: Math.floor(Math.random() * (canvas.width - nextBlock.w)), 
        y: -40, 
        active: true, 
        rotated: false 
      };

      const nextWord = tetrisWords[Math.floor(Math.random() * tetrisWords.length)];
      const nextColor = tetrisColors[Math.floor(Math.random() * tetrisColors.length)];
      nextBlock = { 
        word: nextWord, 
        color: nextColor, 
        w: Math.max(80, nextWord.length * 10), 
        h: 30 
      };
    };

    const rotateTetrisBlock = () => {
      if (!currentBlock) return;
      const oldW = currentBlock.w;
      const oldH = currentBlock.h;
      currentBlock.w = oldH;
      currentBlock.h = oldW;
      currentBlock.rotated = !currentBlock.rotated;
      // Keep in bounds
      if (currentBlock.x + currentBlock.w > canvas.width) {
        currentBlock.x = canvas.width - currentBlock.w;
      }
    };

    // 9. Hanafuda (Flower Cards - Matching)
    const hanafudaMonths = [
      { name: "Pine", jp: "松", symbol: "🌲" },
      { name: "Plum", jp: "梅", symbol: "🌸" },
      { name: "Cherry", jp: "桜", symbol: "💮" },
      { name: "Wisteria", jp: "藤", symbol: "🍇" },
      { name: "Iris", jp: "菖蒲", symbol: "🌿" },
      { name: "Peony", jp: "牡丹", symbol: "🌺" }
    ];
    let hanafudaCards: { id: number, month: number, x: number, y: number, w: number, h: number, flipped: boolean, matched: boolean, color: string, symbol: string, jp: string }[] = [];
    let hanafudaSelected: number[] = [];
    const initHanafuda = () => {
      hanafudaCards = [];
      hanafudaSelected = [];
      const cardW = 55, cardH = 80;
      const colors = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6'];
      
      let deck: any[] = [];
      hanafudaMonths.forEach((m, i) => {
        deck.push({ month: i, color: colors[i], symbol: m.symbol, jp: m.jp });
        deck.push({ month: i, color: colors[i], symbol: m.symbol, jp: m.jp });
      });
      // Shuffle
      deck.sort(() => Math.random() - 0.5);
      
      const cols = 4;
      const spacing = 12;
      const totalW = cols * (cardW + spacing) - spacing;
      const startX = (canvas.width - totalW) / 2;
      const startY = 100; 
      
      deck.forEach((c, i) => {
        hanafudaCards.push({
          id: i,
          month: c.month,
          color: c.color,
          symbol: c.symbol,
          jp: c.jp,
          x: startX + (i % cols) * (cardW + spacing),
          y: startY + Math.floor(i / cols) * (cardH + spacing),
          w: cardW,
          h: cardH,
          flipped: false,
          matched: false
        });
      });
    };

    // 10. Karuta (Poetry Cards)
    let karutaReadingCard: { read: string, grab: string } | null = null;
    let karutaCards: { text: string, x: number, y: number, w: number, h: number, correct: boolean, found: boolean }[] = [];
    const karutaData = [
      { read: "A", grab: "あ" }, { read: "I", grab: "い" }, { read: "U", grab: "う" },
      { read: "E", grab: "え" }, { read: "O", grab: "お" }, { read: "KA", grab: "か" },
      { read: "KI", grab: "き" }, { read: "KU", grab: "く" }, { read: "KE", grab: "け" },
      { read: "KO", grab: "こ" }, { read: "SA", grab: "さ" }, { read: "SHI", grab: "し" },
      { read: "SU", grab: "す" }, { read: "SE", grab: "せ" }, { read: "SO", grab: "そ" }
    ];
    const initKaruta = () => {
      const pool = [...karutaData].sort(() => Math.random() - 0.5).slice(0, 9);
      const target = pool[Math.floor(Math.random() * pool.length)];
      karutaReadingCard = target;
      
      const cardW = 60, cardH = 70;
      const cols = 3;
      const spacing = 12;
      const totalW = cols * (cardW + spacing) - spacing;
      const startX = (canvas.width - totalW) / 2;
      const startY = 155; 

      karutaCards = pool.map((p, i) => ({
        text: p.grab,
        x: startX + (i % cols) * (cardW + spacing),
        y: startY + Math.floor(i / cols) * (cardH + spacing),
        w: cardW,
        h: cardH,
        correct: p.read === target.read,
        found: false
      }));
    };

    // 11. Menko (Card Flipping)
    let menkoPlayerCard = { x: 0, y: 0, w: 60, h: 60, vx: 0, vy: 0, active: false, rotation: 0, spin: 0 };
    let menkoTargetCard = { x: 0, y: 0, w: 70, h: 70, flipped: false, angle: 0, flipProgress: 0 };
    const initMenko = () => {
      menkoTargetCard = { 
        x: canvas.width / 2 - 35, 
        y: canvas.height / 2 - 35, 
        w: 70, h: 70, 
        flipped: false, 
        angle: Math.random() * Math.PI,
        flipProgress: 0
      };
      menkoPlayerCard.active = false;
    };

    // 7. Lanterns
    let lanterns: { x: number, y: number, vx: number, vy: number, size: number, alpha: number, flicker: number }[] = [];
    const initLanterns = () => {
      lanterns = [];
      for (let i = 0; i < 15; i++) {
        lanterns.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -0.5 - Math.random() * 1,
          size: 15 + Math.random() * 15,
          alpha: 0.5 + Math.random() * 0.5,
          flicker: Math.random() * Math.PI * 2
        });
      }
    };

    // 8. Bonsai
    let branches: { x: number, y: number, length: number, angle: number, width: number, generation: number }[] = [];
    let leaves: { x: number, y: number, size: number, color: string, alpha: number }[] = [];
    let bonsaiInitialized = false;
    const growBonsai = (x: number, y: number, length: number, angle: number, width: number, generation: number) => {
      if (generation > 6) {
        // Add leaves at the end of branches
        for (let i = 0; i < 5; i++) {
          const isBlossom = Math.random() > 0.8;
          leaves.push({
            x: x + (Math.random() - 0.5) * 30,
            y: y + (Math.random() - 0.5) * 30,
            size: 4 + Math.random() * 6,
            color: isBlossom ? '#fda4af' : (Math.random() > 0.5 ? '#4ade80' : '#22c55e'),
            alpha: 0
          });
        }
        return;
      }
      branches.push({ x, y, length, angle, width, generation });
      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;
      
      setTimeout(() => {
        if (!isRunning || gameType !== 'bonsai') return;
        const numBranches = generation === 1 ? 3 : 2;
        for (let i = 0; i < numBranches; i++) {
          const newAngle = angle + (Math.random() - 0.5) * 1.2;
          const newLength = length * (0.7 + Math.random() * 0.2);
          growBonsai(endX, endY, newLength, newAngle, width * 0.75, generation + 1);
        }
      }, 200);
    };

    const initBonsai = () => {
      branches = [];
      leaves = [];
      bonsaiInitialized = true;
      growBonsai(canvas.width / 2, canvas.height, canvas.height * 0.25, -Math.PI / 2, 20, 1);
    };

    // Initialize selected game
    if (gameType === 'brick') initBricks();
    if (gameType === 'galaga') initEnemies();
    if (gameType === 'koi') initKoi();
    if (gameType === 'sakura') initSakura();
    if (gameType === 'tetris') spawnTetrisBlock();
    if (gameType === 'lanterns') initLanterns();
    if (gameType === 'bonsai') initBonsai();
    if (gameType === 'hanafuda') initHanafuda();
    if (gameType === 'karuta') initKaruta();
    if (gameType === 'menko') initMenko();

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (gameType === 'tetris') {
        rotateTetrisBlock();
      } else if (gameType === 'hanafuda') {
        hanafudaCards.forEach(c => {
          if (!c.matched && !c.flipped && x > c.x && x < c.x + c.w && y > c.y && y < c.y + c.h) {
            c.flipped = true;
            hanafudaSelected.push(c.id);
            if (hanafudaSelected.length === 2) {
              const [id1, id2] = hanafudaSelected;
              if (hanafudaCards[id1].month === hanafudaCards[id2].month) {
                hanafudaCards[id1].matched = true;
                hanafudaCards[id2].matched = true;
                hanafudaSelected = [];
                shake(5);
                spawnParticles(x, y, '#fbbf24');
              } else {
                setTimeout(() => {
                  hanafudaCards[id1].flipped = false;
                  hanafudaCards[id2].flipped = false;
                  hanafudaSelected = [];
                }, 500);
              }
            }
          }
        });
      } else if (gameType === 'karuta') {
        karutaCards.forEach(c => {
          if (!c.found && x > c.x && x < c.x + c.w && y > c.y && y < c.y + c.h) {
            if (c.correct) {
              c.found = true;
              shake(10);
              spawnParticles(x, y, '#10b981');
              setTimeout(initKaruta, 1000);
            } else {
              shake(5);
              spawnParticles(x, y, '#ef4444');
            }
          }
        });
      } else if (gameType === 'menko') {
        if (!menkoPlayerCard.active) {
          const dx = x - (menkoTargetCard.x + menkoTargetCard.w / 2);
          const dy = y - (menkoTargetCard.y + menkoTargetCard.h / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          menkoPlayerCard = { 
            x, y: canvas.height, 
            w: 60, h: 60, 
            vx: (canvas.width / 2 - x) * 0.05, 
            vy: -18, 
            active: true,
            rotation: 0,
            spin: (Math.random() - 0.5) * 0.5
          };
          shake(2);
        }
      }
    };
    canvas.addEventListener('click', handleCanvasClick);

    const draw = () => {
      if (!isRunning) return;

      // Handle screen shake
      let shakeX = 0, shakeY = 0;
      if (screenShake > 0) {
        shakeX = (Math.random() - 0.5) * screenShake;
        shakeY = (Math.random() - 0.5) * screenShake;
        screenShake *= 0.9;
      }

      ctx.save();
      ctx.translate(shakeX, shakeY);

      if (gameType === 'zen') {
        if (!zenInitialized) {
          // Draw sand gradient
          const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          grad.addColorStop(0, '#e5e0d8');
          grad.addColorStop(1, '#d4cdbd');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          zenInitialized = true;
        }
      } else if (gameType === 'bonsai') {
        ctx.fillStyle = '#fdfbf7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (gameType === 'lanterns') {
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      if (gameType === 'brick') {
        paddle.x = mouse.x - paddle.w / 2;
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;

        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255,255,255,0.5)';
        ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
        ctx.shadowBlur = 0;

        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball trail
        ballTrail.push({ x: ball.x, y: ball.y });
        if (ballTrail.length > 10) ballTrail.shift();
        ballTrail.forEach((t, i) => {
          ctx.beginPath();
          ctx.arc(t.x, t.y, ball.radius * (i / 10), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(229, 0, 0, ${i / 20})`;
          ctx.fill();
        });

        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
          ball.dx *= -1;
          shake(2);
        }
        if (ball.y - ball.radius < 0) {
          ball.dy *= -1;
          shake(2);
        }
        if (ball.y + ball.radius > canvas.height) {
          ball.x = canvas.width / 2;
          ball.y = canvas.height - 50;
          ball.dy = -5;
          initBricks();
          shake(10);
        }

        if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
          ball.dy = -Math.abs(ball.dy);
          ball.dx = ((ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2)) * 6;
          shake(3);
          spawnParticles(ball.x, ball.y, '#ffffff', 5);
        }

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#E50000';
        ctx.fill();
        ctx.closePath();

        let activeBricks = 0;
        bricks.forEach(b => {
          if (!b.active) return;
          activeBricks++;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 1;
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.strokeRect(b.x, b.y, b.w, b.h);

          if (ball.x > b.x && ball.x < b.x + b.w && ball.y - ball.radius < b.y + b.h && ball.y + ball.radius > b.y) {
            b.active = false;
            ball.dy *= -1;
            spawnParticles(b.x + b.w / 2, b.y + b.h / 2, '#ffffff');
            shake(5);
          }
        });
        if (activeBricks === 0) initBricks();

      } else if (gameType === 'galaga') {
        // Starfield
        ctx.fillStyle = '#ffffff';
        stars.forEach(s => {
          s.y += s.speed;
          if (s.y > canvas.height) s.y = 0;
          ctx.globalAlpha = 0.5;
          ctx.fillRect(s.x, s.y, s.size, s.size);
          ctx.globalAlpha = 1;
        });

        player.x = mouse.x - player.w / 2;
        if (player.x < 0) player.x = 0;
        if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;

        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#3b82f6';
        ctx.beginPath();
        ctx.moveTo(player.x + player.w / 2, player.y);
        ctx.lineTo(player.x + player.w, player.y + player.h);
        ctx.lineTo(player.x, player.y + player.h);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (mouse.clicked && Date.now() - lastShot > 150) {
          projectiles.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 15, dy: -10 });
          lastShot = Date.now();
        }

        projectiles.forEach((p, i) => {
          p.y += p.dy;
          ctx.fillStyle = '#3b82f6';
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

          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(e.x + e.w / 2, e.y + e.h / 2, e.w / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(e.x + e.w / 4, e.y + e.h / 4, e.w / 2, e.h / 2);

          projectiles.forEach((p, pi) => {
            if (p.x < e.x + e.w && p.x + p.w > e.x && p.y < e.y + e.h && p.y + p.h > e.y) {
              e.active = false;
              projectiles.splice(pi, 1);
              spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#ef4444', 15);
              shake(8);
            }
          });
        });

        if (hitEdge) {
          enemyDir *= -1;
          enemies.forEach(e => { if (e.active) e.y += 20; });
        }
        if (activeEnemies === 0) initEnemies();

      } else if (gameType === 'zen') {
        const dx = mouse.x - lastMouse.x;
        const dy = mouse.y - lastMouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 2) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          
          const nx = -dy / dist;
          const ny = dx / dist;
          
          for (let i = -3; i <= 3; i++) {
            const spacing = 14;
            ctx.beginPath();
            ctx.moveTo(lastMouse.x + nx * i * spacing, lastMouse.y + ny * i * spacing);
            ctx.lineTo(mouse.x + nx * i * spacing, mouse.y + ny * i * spacing);
            ctx.stroke();
          }
          lastMouse = { x: mouse.x, y: mouse.y };
        }

        if (mouse.clicked) {
          if (Math.random() > 0.7) {
            mossPatches.push({ x: mouse.x, y: mouse.y, r: 20 + Math.random() * 30 });
            spawnParticles(mouse.x, mouse.y, '#4ade80', 5);
            shake(1);
          } else {
            rocks.push({ 
              x: mouse.x, 
              y: mouse.y, 
              r: 15 + Math.random() * 25,
              color: rockColors[Math.floor(Math.random() * rockColors.length)]
            });
            spawnParticles(mouse.x, mouse.y, '#9ca3af', 8);
            shake(3);
          }
          mouse.clicked = false;
        }

        // Draw moss
        mossPatches.forEach(moss => {
          ctx.beginPath();
          ctx.arc(moss.x, moss.y, moss.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(74, 124, 89, 0.8)'; // Vibrant moss green
          ctx.fill();
          // Moss texture
          for(let i=0; i<5; i++) {
            ctx.beginPath();
            ctx.arc(moss.x + (Math.random()-0.5)*moss.r, moss.y + (Math.random()-0.5)*moss.r, moss.r*0.3, 0, Math.PI*2);
            ctx.fillStyle = 'rgba(92, 148, 109, 0.9)';
            ctx.fill();
          }
        });

        // Draw rocks
        rocks.forEach(rock => {
          ctx.beginPath();
          ctx.arc(rock.x, rock.y, rock.r, 0, Math.PI * 2);
          ctx.fillStyle = rock.color;
          ctx.fill();
          ctx.strokeStyle = 'rgba(0,0,0,0.3)';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          ctx.beginPath();
          ctx.arc(rock.x - rock.r * 0.3, rock.y - rock.r * 0.3, rock.r * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.fill();
        });

      } else if (gameType === 'koi') {
        // Water background
        const waterGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width);
        waterGrad.addColorStop(0, '#0ea5e9');
        waterGrad.addColorStop(1, '#0369a1');
        ctx.fillStyle = waterGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (mouse.clicked) {
          ripples.push({ x: mouse.x, y: mouse.y, r: 0, maxR: 100, alpha: 1 });
          mouse.clicked = false;
        }

        for (let i = ripples.length - 1; i >= 0; i--) {
          let rip = ripples[i];
          rip.r += 1.5;
          rip.alpha -= 0.015;
          if (rip.alpha <= 0) {
            ripples.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${rip.alpha * 0.4})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        kois.forEach(koi => {
          const dx = mouse.x - koi.x;
          const dy = mouse.y - koi.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > 0) {
            koi.vx += (dx / dist) * 0.03;
            koi.vy += (dy / dist) * 0.03;
          }
          
          koi.vx *= 0.98;
          koi.vy *= 0.98;
          
          const speed = Math.sqrt(koi.vx * koi.vx + koi.vy * koi.vy);
          if (speed > 2.5) {
            koi.vx = (koi.vx / speed) * 2.5;
            koi.vy = (koi.vy / speed) * 2.5;
          }
          
          koi.x += koi.vx;
          koi.y += koi.vy;
          
          if (speed > 0.1) {
            const targetAngle = Math.atan2(koi.vy, koi.vx);
            let diff = targetAngle - koi.angle;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            koi.angle += diff * 0.1;
          }

          ctx.save();
          ctx.translate(koi.x, koi.y);
          ctx.rotate(koi.angle);
          
          ctx.beginPath();
          ctx.ellipse(0, 0, koi.size, koi.size / 2, 0, 0, Math.PI * 2);
          ctx.fillStyle = koi.color;
          ctx.fill();
          
          const tailWiggle = Math.sin(Date.now() * 0.005) * 0.5;
          ctx.beginPath();
          ctx.moveTo(-koi.size * 0.8, 0);
          ctx.lineTo(-koi.size * 1.8, -koi.size * 0.6 + tailWiggle * 10);
          ctx.lineTo(-koi.size * 1.8, koi.size * 0.6 + tailWiggle * 10);
          ctx.fillStyle = koi.color;
          ctx.fill();
          
          ctx.restore();
        });

      } else if (gameType === 'sakura') {
        // Soft sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGrad.addColorStop(0, '#fff1f2');
        skyGrad.addColorStop(1, '#ffe4e6');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const wind = (mouse.x - canvas.width / 2) / (canvas.width / 2) * 3;
        
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
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(p.size, -p.size, p.size * 2, 0, 0, p.size * 2);
          ctx.bezierCurveTo(-p.size * 2, 0, -p.size, -p.size, 0, 0);
          
          ctx.fillStyle = 'rgba(255, 183, 197, 0.6)';
          ctx.fill();
          ctx.restore();
        });

      } else if (gameType === 'tetris') {
        // Law Stacker (Improved)
        // Draw Next Block Preview - moved down to avoid nav bar
        if (nextBlock) {
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          ctx.fillRect(10, 60, 120, 50);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px sans-serif';
          ctx.fillText('NEXT:', 20, 75);
          ctx.fillStyle = nextBlock.color;
          ctx.font = 'bold 8px sans-serif';
          ctx.fillText(nextBlock.word, 20, 90);
        }

        if (currentBlock) {
          // Move with mouse but stay in bounds
          const targetX = mouse.x - currentBlock.w / 2;
          currentBlock.x += (targetX - currentBlock.x) * 0.2;
          if (currentBlock.x < 0) currentBlock.x = 0;
          if (currentBlock.x + currentBlock.w > canvas.width) currentBlock.x = canvas.width - currentBlock.w;

          // Ghost block
          let ghostY = currentBlock.y;
          while (ghostY + currentBlock.h < canvas.height) {
            let hit = false;
            for (let b of tetrisBlocks) {
              if (ghostY + currentBlock.h >= b.y && ghostY < b.y + b.h && currentBlock.x + currentBlock.w > b.x && currentBlock.x < b.x + b.w) {
                hit = true;
                break;
              }
            }
            if (hit) break;
            ghostY += 2;
          }
          ctx.fillStyle = currentBlock.color;
          ctx.globalAlpha = 0.1;
          ctx.fillRect(currentBlock.x, ghostY, currentBlock.w, currentBlock.h);
          ctx.globalAlpha = 1;

          if (Date.now() - tetrisLastDrop > 20) {
            currentBlock.y += 4;
            tetrisLastDrop = Date.now();
          }

          let collision = false;
          if (currentBlock.y + currentBlock.h >= canvas.height) {
            currentBlock.y = canvas.height - currentBlock.h;
            collision = true;
          } else {
            for (let b of tetrisBlocks) {
              if (currentBlock.y + currentBlock.h >= b.y && currentBlock.y < b.y + b.h && currentBlock.x + currentBlock.w > b.x && currentBlock.x < b.x + b.w) {
                currentBlock.y = b.y - currentBlock.h;
                collision = true;
                break;
              }
            }
          }

          if (collision) {
            tetrisBlocks.push({ ...currentBlock });
            shake(5);
            spawnParticles(currentBlock.x + currentBlock.w / 2, currentBlock.y + currentBlock.h / 2, currentBlock.color, 12);
            
            // Check for line clearing (simplified: if a horizontal range is mostly full)
            // In this "stacker" version, we'll just check if we have many blocks at similar Y
            const rowY = Math.floor(currentBlock.y / 10) * 10;
            const blocksInRow = tetrisBlocks.filter(b => Math.abs(b.y - rowY) < 20).length;
            if (blocksInRow > 5) {
              tetrisScore += 100;
              // Clear some blocks in that row
              tetrisBlocks = tetrisBlocks.filter(b => Math.abs(b.y - rowY) >= 20);
              shake(15);
              spawnParticles(canvas.width / 2, rowY, '#ffffff', 30);
            }

            if (currentBlock.y < 80) {
              const shiftAmount = 120;
              tetrisBlocks.forEach(b => b.y += shiftAmount);
            }
            spawnTetrisBlock();
          }
        }

        // Draw all blocks
        [...tetrisBlocks, currentBlock].forEach(b => {
          if (!b) return;
          ctx.save();
          ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
          
          ctx.fillStyle = b.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = b.color;
          ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
          ctx.shadowBlur = 0;
          
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.lineWidth = 1;
          ctx.strokeRect(-b.w / 2, -b.h / 2, b.w, b.h);
          
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${b.rotated ? '10px' : '12px'} monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(b.word, 0, 0);
          ctx.restore();
        });

        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`SCORE: ${tetrisScore}`, 20, 30);
        ctx.fillText('CLICK TO ROTATE', 20, 50);

      } else if (gameType === 'hanafuda') {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        hanafudaCards.forEach(c => {
          ctx.save();
          ctx.translate(c.x, c.y);
          
          if (c.matched) {
            ctx.globalAlpha = 0.2;
          }

          // Card shadow
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          ctx.fillRect(4, 4, c.w, c.h);

          if (c.flipped || c.matched) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, c.w, c.h);
            
            // Month symbol
            ctx.fillStyle = c.color;
            ctx.font = '30px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(c.symbol, c.w / 2, c.h / 2 - 10);
            
            ctx.font = '12px serif';
            ctx.fillStyle = '#333';
            ctx.fillText(c.jp, c.w / 2, c.h / 2 + 25);

            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, c.w, c.h);
          } else {
            ctx.fillStyle = '#991b1b'; // Traditional red back
            ctx.fillRect(0, 0, c.w, c.h);
            
            // Back pattern
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2;
            ctx.strokeRect(5, 5, c.w - 10, c.h - 10);
            ctx.beginPath();
            ctx.moveTo(c.w / 2, 15);
            ctx.lineTo(c.w / 2, c.h - 15);
            ctx.moveTo(15, c.h / 2);
            ctx.lineTo(c.w - 15, c.h / 2);
            ctx.stroke();
          }
          ctx.restore();
        });

        if (hanafudaCards.every(c => c.matched)) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px serif';
          ctx.textAlign = 'center';
          ctx.fillText('ZEN MATCH!', canvas.width / 2, canvas.height - 40);
          setTimeout(initHanafuda, 2000);
        }

      } else if (gameType === 'karuta') {
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Reading area - moved down to avoid nav bar
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(20, 60, canvas.width - 40, 90);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px serif';
        ctx.textAlign = 'center';
        ctx.fillText(karutaReadingCard?.read || "", canvas.width / 2, 115);
        
        ctx.font = '12px sans-serif';
        ctx.globalAlpha = 0.6;
        ctx.fillText('LISTEN TO THE READING...', canvas.width / 2, 140);
        ctx.globalAlpha = 1;

        karutaCards.forEach(c => {
          if (c.found) return;
          
          // Card shadow
          ctx.fillStyle = 'rgba(0,0,0,0.2)';
          ctx.fillRect(c.x + 3, c.y + 3, c.w, c.h);

          ctx.fillStyle = '#fef3c7';
          ctx.fillRect(c.x, c.y, c.w, c.h);
          ctx.strokeStyle = '#92400e';
          ctx.lineWidth = 2;
          ctx.strokeRect(c.x, c.y, c.w, c.h);
          
          ctx.fillStyle = '#000000';
          ctx.font = '36px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(c.text, c.x + c.w / 2, c.y + c.h / 2);
        });

      } else if (gameType === 'menko') {
        ctx.fillStyle = '#451a03';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Ground texture
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        for (let i = 0; i < canvas.width; i += 40) {
          ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        }

        // Target Card
        ctx.save();
        ctx.translate(menkoTargetCard.x + menkoTargetCard.w / 2, menkoTargetCard.y + menkoTargetCard.h / 2);
        
        if (menkoTargetCard.flipped) {
          const flipScale = Math.cos(menkoTargetCard.flipProgress);
          ctx.scale(1, flipScale);
        }
        
        ctx.rotate(menkoTargetCard.angle);
        ctx.fillStyle = menkoTargetCard.flipped ? '#d1d5db' : '#b91c1c';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.fillRect(-menkoTargetCard.w / 2, -menkoTargetCard.h / 2, menkoTargetCard.w, menkoTargetCard.h);
        ctx.shadowBlur = 0;
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(-menkoTargetCard.w / 2, -menkoTargetCard.h / 2, menkoTargetCard.w, menkoTargetCard.h);
        
        // Target art
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();

        // Player Card
        if (menkoPlayerCard.active) {
          menkoPlayerCard.x += menkoPlayerCard.vx;
          menkoPlayerCard.y += menkoPlayerCard.vy;
          menkoPlayerCard.vy += 0.8; // Gravity
          menkoPlayerCard.rotation += menkoPlayerCard.spin;

          ctx.save();
          ctx.translate(menkoPlayerCard.x, menkoPlayerCard.y);
          ctx.rotate(menkoPlayerCard.rotation);
          ctx.fillStyle = '#1e40af';
          ctx.shadowBlur = 15;
          ctx.shadowColor = 'rgba(30, 64, 175, 0.5)';
          ctx.fillRect(-menkoPlayerCard.w / 2, -menkoPlayerCard.h / 2, menkoPlayerCard.w, menkoPlayerCard.h);
          ctx.restore();

          // Collision / Wind effect
          const dx = menkoPlayerCard.x - (menkoTargetCard.x + menkoTargetCard.w / 2);
          const dy = menkoPlayerCard.y - (menkoTargetCard.y + menkoTargetCard.h / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 60 && !menkoTargetCard.flipped && menkoPlayerCard.vy > 0) {
            menkoTargetCard.flipped = true;
            menkoTargetCard.flipProgress = 0;
            shake(25);
            spawnParticles(menkoTargetCard.x + menkoTargetCard.w / 2, menkoTargetCard.y + menkoTargetCard.h / 2, '#ffffff', 30);
          }

          if (menkoPlayerCard.y > canvas.height + 100) {
            menkoPlayerCard.active = false;
            if (menkoTargetCard.flipped) setTimeout(initMenko, 1000);
          }
        }

        if (menkoTargetCard.flipped && menkoTargetCard.flipProgress < Math.PI) {
          menkoTargetCard.flipProgress += 0.2;
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(menkoTargetCard.flipped ? 'IPPON! (一本!)' : 'SLAM THE GROUND NEAR THE CARD!', canvas.width / 2, canvas.height - 30);

      } else if (gameType === 'lanterns') {
        // Deep night sky gradient
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.7, '#1e1b4b');
        grad.addColorStop(1, '#312e81');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Water reflection area at bottom
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, canvas.height * 0.8, canvas.width, canvas.height * 0.2);

        if (mouse.clicked) {
          lanterns.push({
            x: mouse.x,
            y: mouse.y,
            vx: (Math.random() - 0.5) * 1,
            vy: -1 - Math.random() * 2,
            size: 15 + Math.random() * 20,
            alpha: 1,
            flicker: Math.random() * Math.PI * 2
          });
          mouse.clicked = false;
        }

        lanterns.forEach((l, i) => {
          l.x += l.vx + (Math.sin(Date.now() * 0.001 + l.flicker) * 0.5);
          l.y += l.vy;
          
          if (l.y < -50) {
            lanterns[i].y = canvas.height + 50;
            lanterns[i].x = Math.random() * canvas.width;
          }

          ctx.save();
          ctx.translate(l.x, l.y);
          
          // Glow
          const flickerVal = Math.sin(Date.now() * 0.005 + l.flicker) * 0.2 + 0.8;
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, l.size * 2);
          gradient.addColorStop(0, `rgba(255, 200, 100, ${l.alpha * flickerVal})`);
          gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, l.size * 2, 0, Math.PI * 2);
          ctx.fill();

          // Lantern body
          ctx.fillStyle = `rgba(255, 220, 150, ${l.alpha})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, l.size * 0.8, l.size, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Lantern bottom
          ctx.fillStyle = `rgba(200, 100, 50, ${l.alpha})`;
          ctx.fillRect(-l.size * 0.4, l.size * 0.8, l.size * 0.8, l.size * 0.2);

          ctx.restore();

          // Water reflection
          if (l.y > canvas.height * 0.6) {
            ctx.save();
            ctx.translate(l.x, canvas.height - (l.y - canvas.height * 0.8) * 0.5);
            ctx.scale(1, -0.3);
            ctx.globalAlpha = l.alpha * 0.3;
            
            const refGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, l.size * 2);
            refGrad.addColorStop(0, 'rgba(255, 200, 100, 0.8)');
            refGrad.addColorStop(1, 'rgba(255, 100, 0, 0)');
            ctx.fillStyle = refGrad;
            ctx.beginPath();
            ctx.arc(0, 0, l.size * 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
          }
        });

      } else if (gameType === 'bonsai') {
        // Draw branches
        branches.forEach(b => {
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          const endX = b.x + Math.cos(b.angle) * b.length;
          const endY = b.y + Math.sin(b.angle) * b.length;
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = '#4a3b32';
          ctx.lineWidth = b.width;
          ctx.lineCap = 'round';
          ctx.stroke();
        });

        // Draw leaves
        leaves.forEach(l => {
          if (l.alpha < 1) l.alpha += 0.05;
          ctx.beginPath();
          ctx.arc(l.x, l.y, l.size, 0, Math.PI * 2);
          ctx.fillStyle = l.color;
          ctx.globalAlpha = l.alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        });

        if (mouse.clicked) {
          initBonsai();
          mouse.clicked = false;
          shake(5);
        }
        
        ctx.fillStyle = '#1a1a1a';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Click to regrow', canvas.width / 2, canvas.height - 20);
      }

      // Draw global particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.life -= 0.02;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.restore();
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
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [isPlaying, gameType]);

  return canvasRef;
}
