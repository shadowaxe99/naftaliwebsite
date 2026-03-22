import { useEffect, useRef } from 'react';

export type GameType = 'brick' | 'galaga' | 'zen' | 'koi' | 'sakura' | 'tetris' | 'lanterns' | 'bonsai' | 'hanafuda' | 'karuta' | 'menko' | 'infringement' | 'daifugo' | 'oichokabu';

let globalAudioCtx: AudioContext | null = null;

export function useCanvasGame(gameType: GameType, isPlaying: boolean, soundEnabled: boolean = false) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = true;

    // --- Audio System ---
    const initAudio = () => {
      if (!soundEnabledRef.current) return;
      if (!globalAudioCtx) {
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        if (AC) globalAudioCtx = new AC();
      }
      if (globalAudioCtx && globalAudioCtx.state === 'suspended') globalAudioCtx.resume();
    };

    const playTone = (freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
      if (!soundEnabledRef.current) return;
      initAudio();
      if (!globalAudioCtx) return;
      try {
        const osc = globalAudioCtx.createOscillator();
        const gain = globalAudioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, globalAudioCtx.currentTime);
        gain.gain.setValueAtTime(vol, globalAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, globalAudioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(globalAudioCtx.destination);
        osc.start();
        osc.stop(globalAudioCtx.currentTime + duration);
      } catch(e) {}
    };

    const playNoise = (duration: number, vol: number = 0.1) => {
      if (!soundEnabledRef.current) return;
      initAudio();
      if (!globalAudioCtx) return;
      try {
        const bufferSize = globalAudioCtx.sampleRate * duration;
        const buffer = globalAudioCtx.createBuffer(1, bufferSize, globalAudioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = globalAudioCtx.createBufferSource();
        noise.buffer = buffer;
        const gain = globalAudioCtx.createGain();
        gain.gain.setValueAtTime(vol, globalAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, globalAudioCtx.currentTime + duration);
        noise.connect(gain);
        gain.connect(globalAudioCtx.destination);
        noise.start();
      } catch(e) {}
    };

    const speakWord = (text: string) => {
      if (!soundEnabledRef.current) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    };

    let ambientGain: GainNode | null = null;
    let ambientOsc1: OscillatorNode | null = null;
    let ambientOsc2: OscillatorNode | null = null;
    let ambientNoise: AudioBufferSourceNode | null = null;
    let ambientFilter: BiquadFilterNode | null = null;
    let isStoppingAmbient = false;

    const manageAmbientSound = () => {
      if (!soundEnabledRef.current || !['zen', 'koi', 'sakura', 'lanterns', 'bonsai', 'hanafuda'].includes(gameType)) {
        if (ambientGain && globalAudioCtx && !isStoppingAmbient) {
          isStoppingAmbient = true;
          try {
            ambientGain.gain.setTargetAtTime(0, globalAudioCtx.currentTime, 0.5);
          } catch(e) {}
          setTimeout(() => {
            if (ambientOsc1) { try { ambientOsc1.stop(); } catch(e){} ambientOsc1.disconnect(); ambientOsc1 = null; }
            if (ambientOsc2) { try { ambientOsc2.stop(); } catch(e){} ambientOsc2.disconnect(); ambientOsc2 = null; }
            if (ambientNoise) { try { ambientNoise.stop(); } catch(e){} ambientNoise.disconnect(); ambientNoise = null; }
            if (ambientFilter) { ambientFilter.disconnect(); ambientFilter = null; }
            if (ambientGain) { ambientGain.disconnect(); ambientGain = null; }
            isStoppingAmbient = false;
          }, 1000);
        }
        return;
      }
      initAudio();
      if (!globalAudioCtx) return;
      if (!ambientGain && !isStoppingAmbient) {
        try {
          ambientGain = globalAudioCtx.createGain();
          ambientGain.gain.value = 0;
          ambientGain.gain.setTargetAtTime(0.05, globalAudioCtx.currentTime, 1);
          ambientGain.connect(globalAudioCtx.destination);
          
          if (gameType === 'koi') {
            // Water sound: Filtered noise with modulation
            const bufferSize = globalAudioCtx.sampleRate * 2;
            const buffer = globalAudioCtx.createBuffer(1, bufferSize, globalAudioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              data[i] = Math.random() * 2 - 1;
            }
            ambientNoise = globalAudioCtx.createBufferSource();
            ambientNoise.buffer = buffer;
            ambientNoise.loop = true;

            ambientFilter = globalAudioCtx.createBiquadFilter();
            ambientFilter.type = 'lowpass';
            ambientFilter.frequency.value = 400;
            ambientFilter.Q.value = 1;

            ambientNoise.connect(ambientFilter);
            ambientFilter.connect(ambientGain);
            ambientNoise.start();

            // Add some low frequency movement
            ambientOsc1 = globalAudioCtx.createOscillator();
            ambientOsc1.type = 'sine';
            ambientOsc1.frequency.value = 0.5; // 0.5 Hz modulation
            const lfoGain = globalAudioCtx.createGain();
            lfoGain.gain.value = 200;
            ambientOsc1.connect(lfoGain);
            lfoGain.connect(ambientFilter.frequency);
            ambientOsc1.start();
          } else {
            ambientOsc1 = globalAudioCtx.createOscillator();
            ambientOsc2 = globalAudioCtx.createOscillator();
            ambientOsc1.type = 'sine';
            ambientOsc2.type = 'sine';
            
            if (gameType === 'sakura') {
              ambientOsc1.frequency.value = 200;
              ambientOsc2.frequency.value = 203;
            } else {
              ambientOsc1.frequency.value = 150;
              ambientOsc2.frequency.value = 152;
            }

            ambientOsc1.connect(ambientGain);
            ambientOsc2.connect(ambientGain);
            ambientOsc1.start();
            ambientOsc2.start();
          }
        } catch(e) {}
      }
    };

    let lastSoundEnabled = soundEnabledRef.current;

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

    const mouse = { x: canvas.width / 2, y: canvas.height / 2, clicked: false, down: false };
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
    const handleMouseDown = () => { mouse.clicked = true; mouse.down = true; };
    const handleMouseUp = () => { mouse.clicked = false; mouse.down = false; };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isRunning) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (!isRunning) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      mouse.down = true;
      mouse.clicked = true;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (!isRunning) return;
      e.preventDefault();
      mouse.down = false;
      mouse.clicked = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

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
    let zenLeaves: { x: number, y: number, color: string, angle: number, size: number }[] = [];
    const rockColors = ['#2a2a2a', '#3d4035', '#4a4a4a', '#1f2421'];
    const leafColors = ['#f472b6', '#fb7185', '#e879f9', '#38bdf8', '#fbbf24', '#34d399'];

    // 4. Koi Pond
    let kois: { x: number, y: number, vx: number, vy: number, size: number, color: string, angle: number }[] = [];
    let ripples: { x: number, y: number, r: number, maxR: number, alpha: number }[] = [];
    let koiFood: { x: number, y: number, life: number }[] = [];
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
    let tetrisLastFact = "";
    let tetrisFactTimer = 0;
    const legalFacts = [
      "Fair Use is a legal doctrine that promotes freedom of expression.",
      "Trademark protection can last indefinitely if the mark is used.",
      "Copyright exists from the moment a work is fixed in a medium.",
      "Public Domain works are not restricted by copyright.",
      "The Lanham Act is the primary federal trademark statute in the US.",
      "Moral rights are personal rights of creators in their works.",
      "Derivative works require permission from the original owner.",
      "Patents protect inventions for a limited period of time."
    ];

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
    let hanafudaCards: { 
      id: number, 
      month: number, 
      x: number, 
      y: number, 
      w: number, 
      h: number, 
      flipped: boolean, 
      matched: boolean, 
      color: string, 
      symbol: string, 
      jp: string,
      flipAnim: number,
      scale: number
    }[] = [];
    let hanafudaSelected: number[] = [];
    let hanafudaScore = 0;
    let hanafudaMoves = 0;
    const initHanafuda = () => {
      hanafudaCards = [];
      hanafudaSelected = [];
      hanafudaScore = 0;
      hanafudaMoves = 0;
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
          matched: false,
          flipAnim: 0, // 0 = back, 1 = front
          scale: 1
        });
      });
    };

    // 10. Karuta (Poetry Cards)
    let karutaReadingCard: { read: string, grab: string } | null = null;
    let karutaCards: { text: string, x: number, y: number, w: number, h: number, correct: boolean, found: boolean }[] = [];
    let karutaScore = 0;
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
      speakWord(target.read);
      
      const cardW = 50, cardH = 60;
      const cols = 3;
      const spacing = 10;
      const totalW = cols * (cardW + spacing) - spacing;
      const startX = (canvas.width - totalW) / 2;
      const startY = 150; 

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

    // 11. Menko (Card Flipping - Enhanced)
    let menkoPlayerCard = { x: 0, y: 0, w: 60, h: 60, vx: 0, vy: 0, active: false, rotation: 0, spin: 0, power: 0, charging: false, powerDir: 1 };
    let menkoTargets: { x: number, y: number, w: number, h: number, flipped: boolean, angle: number, flipProgress: number, id: number, label: string }[] = [];
    let menkoScore = 0;
    let menkoWind = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };
    let menkoWindTimer = 0;
    let menkoLevel = 1;
    let menkoThrowsLeft = 3;
    const menkoLabels = ["侍", "忍者", "鬼", "天狗", "狐", "龍"];
    
    const initMenko = (resetLevel = false) => {
      if (resetLevel) {
        menkoLevel = 1;
        menkoScore = 0;
      }
      menkoTargets = [];
      const count = Math.min(5, 2 + Math.floor(menkoLevel / 2));
      menkoThrowsLeft = Math.max(3, count + 1); // Give enough throws based on targets
      
      for (let i = 0; i < count; i++) {
        menkoTargets.push({ 
          x: 100 + Math.random() * (canvas.width - 200), 
          y: 80 + Math.random() * (canvas.height * 0.45), 
          w: 70, h: 70, 
          flipped: false, 
          angle: Math.random() * Math.PI,
          flipProgress: 0,
          id: i,
          label: menkoLabels[Math.floor(Math.random() * menkoLabels.length)]
        });
      }
      menkoPlayerCard.active = false;
      menkoPlayerCard.power = 0;
      menkoPlayerCard.charging = false;
      menkoWind = { x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 2 };
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
    let branches: { x: number, y: number, length: number, angle: number, width: number, generation: number, targetAngle: number, currentAngle: number }[] = [];
    let leaves: { x: number, y: number, size: number, color: string, alpha: number, falling: boolean, vx: number, vy: number, rotation: number }[] = [];
    let bonsaiInitialized = false;
    let bonsaiTime = 0;

    const growBonsai = (x: number, y: number, length: number, angle: number, width: number, generation: number) => {
      if (generation > 7) {
        // Add leaves at the end of branches
        for (let i = 0; i < 6; i++) {
          const isBlossom = Math.random() > 0.85;
          leaves.push({
            x: x + (Math.random() - 0.5) * 40,
            y: y + (Math.random() - 0.5) * 40,
            size: 4 + Math.random() * 8,
            color: isBlossom ? '#fda4af' : (Math.random() > 0.5 ? '#4ade80' : '#22c55e'),
            alpha: 0,
            falling: false,
            vx: 0,
            vy: 0,
            rotation: Math.random() * Math.PI * 2
          });
        }
        return;
      }
      
      const targetAngle = angle + (Math.random() - 0.5) * 0.5;
      branches.push({ x, y, length, angle: targetAngle, width, generation, targetAngle, currentAngle: angle });
      
      const endX = x + Math.cos(targetAngle) * length;
      const endY = y + Math.sin(targetAngle) * length;
      
      setTimeout(() => {
        if (!isRunning || gameType !== 'bonsai') return;
        const numBranches = generation === 1 ? 3 : (Math.random() > 0.3 ? 2 : 1);
        for (let i = 0; i < numBranches; i++) {
          const newLength = length * (0.7 + Math.random() * 0.2);
          const newAngle = targetAngle + (Math.random() - 0.5) * 1.2;
          growBonsai(endX, endY, newLength, newAngle, width * 0.75, generation + 1);
        }
      }, 150 + Math.random() * 100);
    };

    const initBonsai = () => {
      branches = [];
      // Make existing leaves fall instead of clearing them instantly
      leaves.forEach(l => {
        l.falling = true;
        l.vx = (Math.random() - 0.5) * 2;
        l.vy = 1 + Math.random() * 2;
      });
      bonsaiInitialized = true;
      bonsaiTime = 0;
      playTone(200, 'sine', 0.5);
      growBonsai(canvas.width / 2, canvas.height - 40, canvas.height * 0.22, -Math.PI / 2, 24, 1);
    };

    // 11. Infringement (Whack-a-Mole)
    let infringementItems: { x: number, y: number, r: number, active: boolean, type: string, timer: number, maxTimer: number, isGolden: boolean }[] = [];
    let infringementScore = 0;
    let infringementMisses = 0;
    let infringementCombo = 0;
    let infringementMaxCombo = 0;
    let infringementLastSpawn = 0;
    let infringementLevel = 1;
    let infringementGameOver = false;
    let infringementFloatingTexts: { x: number, y: number, text: string, life: number, color: string }[] = [];
    const infringementTypes = ['©', '™', '®', 'IP'];

    const spawnInfringement = () => {
      if (infringementGameOver) return;
      const r = 30;
      const x = r + Math.random() * (canvas.width - r * 2);
      const y = r + 100 + Math.random() * (canvas.height - r * 2 - 100);
      const isGolden = Math.random() > 0.9;
      
      // Difficulty scaling
      const baseTimer = Math.max(40, 100 - (infringementLevel * 5));
      const timer = isGolden ? baseTimer * 0.6 : baseTimer;
      
      infringementItems.push({ 
        x, y, r, 
        active: true, 
        type: isGolden ? '★' : infringementTypes[Math.floor(Math.random() * infringementTypes.length)], 
        timer,
        maxTimer: timer,
        isGolden
      });
    };

    const initInfringement = () => {
      infringementItems = [];
      infringementScore = 0;
      infringementMisses = 0;
      infringementCombo = 0;
      infringementLevel = 1;
      infringementGameOver = false;
      infringementLastSpawn = Date.now();
      spawnInfringement();
    };

    // 12. Daifugo (Grand Millionaire - Simplified)
    let daifugoDeck: number[] = [];
    let daifugoPlayerHand: number[] = [];
    let daifugoAIHand: number[] = [];
    let daifugoPile: number[] = [];
    let daifugoTurn: 'player' | 'ai' = 'player';
    let daifugoGameOver = false;
    let daifugoMessage = '';
    let daifugoWins = 0;
    let daifugoLosses = 0;

    const initDaifugo = () => {
      daifugoDeck = [];
      for (let i = 1; i <= 13; i++) {
        daifugoDeck.push(i, i, i, i); // 4 suits
      }
      daifugoDeck.sort(() => Math.random() - 0.5);
      
      daifugoPlayerHand = daifugoDeck.splice(0, 7).sort((a, b) => a - b);
      daifugoAIHand = daifugoDeck.splice(0, 7).sort((a, b) => a - b);
      daifugoPile = [];
      daifugoTurn = 'player';
      daifugoGameOver = false;
      daifugoMessage = 'Your turn! Play a higher card.';
    };

    const playDaifugoAI = () => {
      if (daifugoGameOver) return;
      setTimeout(() => {
        const topCard = daifugoPile.length > 0 ? daifugoPile[daifugoPile.length - 1] : 0;
        // Find lowest card higher than topCard
        const playableIdx = daifugoAIHand.findIndex(c => c > topCard);
        
        if (playableIdx !== -1) {
          const card = daifugoAIHand.splice(playableIdx, 1)[0];
          daifugoPile.push(card);
          daifugoMessage = `AI played ${card}. Your turn!`;
          playTone(300, 'sine', 0.1);
        } else {
          daifugoMessage = `AI passed. Your turn!`;
          daifugoPile = []; // Clear pile on pass
          playTone(200, 'triangle', 0.1);
        }
        
        if (daifugoAIHand.length === 0) {
          daifugoGameOver = true;
          daifugoLosses++;
          daifugoMessage = 'AI Wins! Click to restart.';
          playTone(150, 'sawtooth', 0.5);
        } else {
          daifugoTurn = 'player';
        }
      }, 1000);
    };

    // 13. Oicho-Kabu
    let oichoDeck: number[] = [];
    let oichoPlayerHand: number[] = [];
    let oichoDealerHand: number[] = [];
    let oichoState: 'betting' | 'playerTurn' | 'dealerTurn' | 'gameOver' = 'playerTurn';
    let oichoMessage = '';
    let oichoChips = 100;

    const initOichokabu = () => {
      oichoDeck = [];
      for (let i = 1; i <= 10; i++) {
        oichoDeck.push(i, i, i, i); // 4 suits
      }
      oichoDeck.sort(() => Math.random() - 0.5);
      
      oichoPlayerHand = [oichoDeck.pop()!, oichoDeck.pop()!];
      oichoDealerHand = [oichoDeck.pop()!, oichoDeck.pop()!];
      oichoState = 'playerTurn';
      oichoMessage = 'Draw a 3rd card or Stand?';
    };

    const getOichoScore = (hand: number[]) => {
      return hand.reduce((a, b) => a + b, 0) % 10;
    };

    const resolveOichokabu = () => {
      oichoState = 'gameOver';
      const pScore = getOichoScore(oichoPlayerHand);
      const dScore = getOichoScore(oichoDealerHand);
      
      if (pScore > dScore) {
        oichoChips += 10;
        oichoMessage = `You win! ${pScore} vs ${dScore}. Click to restart.`;
        playTone(600, 'sine', 0.3);
      } else if (dScore > pScore) {
        oichoChips -= 10;
        oichoMessage = `Dealer wins! ${dScore} vs ${pScore}. Click to restart.`;
        playTone(200, 'sawtooth', 0.3);
      } else {
        oichoMessage = `Tie! ${pScore} vs ${dScore}. Click to restart.`;
        playTone(400, 'triangle', 0.3);
      }
    };

    const playOichoDealer = () => {
      oichoState = 'dealerTurn';
      setTimeout(() => {
        const dScore = getOichoScore(oichoDealerHand);
        if (dScore < 5) {
          oichoDealerHand.push(oichoDeck.pop()!);
          daifugoMessage = 'Dealer drew a card.';
          playTone(300, 'sine', 0.1);
        }
        setTimeout(resolveOichokabu, 1000);
      }, 1000);
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
    if (gameType === 'infringement') initInfringement();
    if (gameType === 'daifugo') initDaifugo();
    if (gameType === 'oichokabu') initOichokabu();

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (gameType === 'infringement') {
        if (infringementGameOver) {
          initInfringement();
          return;
        }
        let hit = false;
        infringementItems.forEach(item => {
          if (item.active) {
            const dx = x - item.x;
            const dy = y - item.y;
            if (Math.sqrt(dx * dx + dy * dy) < item.r) {
              item.active = false;
              infringementCombo++;
              infringementMaxCombo = Math.max(infringementMaxCombo, infringementCombo);
              
              const basePoints = item.isGolden ? 50 : 10;
              const bonus = infringementCombo > 1 ? infringementCombo * 5 : 0;
              const totalPoints = basePoints + bonus;
              infringementScore += totalPoints;
              
              // Level up every 100 points
              const newLevel = Math.floor(infringementScore / 100) + 1;
              if (newLevel > infringementLevel) {
                infringementLevel = newLevel;
                infringementFloatingTexts.push({
                  x: canvas.width / 2,
                  y: canvas.height / 2,
                  text: `LEVEL UP: ${infringementLevel}`,
                  life: 1.5,
                  color: '#dc2626'
                });
                playTone(600, 'sine', 0.5, 0.2);
              }

              hit = true;
              spawnParticles(item.x, item.y, item.isGolden ? '#fbbf24' : '#ef4444', 20);
              shake(15);
              playTone(item.isGolden ? 800 : 400 + (infringementCombo * 20), 'square', 0.1, 0.1);
              
              infringementFloatingTexts.push({
                x: item.x,
                y: item.y,
                text: item.isGolden ? `GOLDEN! +${totalPoints}` : `TAKEDOWN! +${totalPoints}`,
                life: 1.0,
                color: item.isGolden ? '#b45309' : '#ef4444'
              });
            }
          }
        });
        if (!hit) {
          infringementCombo = 0;
          playTone(100, 'sawtooth', 0.1, 0.05);
        }
      }

      if (gameType === 'tetris') {
        rotateTetrisBlock();
        playTone(400, 'triangle', 0.05);
      } else if (gameType === 'daifugo') {
        if (daifugoGameOver) {
          initDaifugo();
          return;
        }
        if (daifugoTurn !== 'player') return;

        // Check if player clicked a card in hand
        const cardW = 40;
        const cardH = 60;
        const spacing = 10;
        const totalW = daifugoPlayerHand.length * (cardW + spacing) - spacing;
        const startX = (canvas.width - totalW) / 2;
        const startY = canvas.height - cardH - 20;

        for (let i = 0; i < daifugoPlayerHand.length; i++) {
          const cx = startX + i * (cardW + spacing);
          const cy = startY;
          if (x >= cx && x <= cx + cardW && y >= cy && y <= cy + cardH) {
            const card = daifugoPlayerHand[i];
            const topCard = daifugoPile.length > 0 ? daifugoPile[daifugoPile.length - 1] : 0;
            
            if (card > topCard) {
              daifugoPlayerHand.splice(i, 1);
              daifugoPile.push(card);
              daifugoMessage = `You played ${card}. AI's turn...`;
              playTone(400, 'sine', 0.1);
              
              if (daifugoPlayerHand.length === 0) {
                daifugoGameOver = true;
                daifugoWins++;
                daifugoMessage = 'You Win! Click to restart.';
                playTone(600, 'triangle', 0.5);
              } else {
                daifugoTurn = 'ai';
                playDaifugoAI();
              }
            } else {
              daifugoMessage = `Must play higher than ${topCard}!`;
              playTone(150, 'sawtooth', 0.1);
            }
            return;
          }
        }

        // Pass button
        if (x >= canvas.width / 2 - 40 && x <= canvas.width / 2 + 40 && y >= canvas.height / 2 + 20 && y <= canvas.height / 2 + 50) {
          daifugoMessage = 'You passed. AI\'s turn...';
          daifugoPile = []; // Clear pile on pass
          daifugoTurn = 'ai';
          playTone(200, 'triangle', 0.1);
          playDaifugoAI();
        }
      } else if (gameType === 'oichokabu') {
        if (oichoState === 'gameOver') {
          initOichokabu();
          return;
        }
        if (oichoState !== 'playerTurn') return;

        // Draw button
        if (x >= canvas.width / 2 - 60 && x <= canvas.width / 2 - 10 && y >= canvas.height / 2 + 20 && y <= canvas.height / 2 + 50) {
          if (oichoPlayerHand.length < 3) {
            oichoPlayerHand.push(oichoDeck.pop()!);
            playTone(400, 'sine', 0.1);
            if (oichoPlayerHand.length === 3) {
              playOichoDealer();
            }
          }
        }
        // Stand button
        if (x >= canvas.width / 2 + 10 && x <= canvas.width / 2 + 60 && y >= canvas.height / 2 + 20 && y <= canvas.height / 2 + 50) {
          playTone(300, 'triangle', 0.1);
          playOichoDealer();
        }
      } else if (gameType === 'hanafuda') {
        if (hanafudaSelected.length >= 2) return; 
        const clickedCard = hanafudaCards.find(c => !c.matched && !c.flipped && x > c.x && x < c.x + c.w && y > c.y && y < c.y + c.h);
        if (clickedCard) {
          clickedCard.flipped = true;
          clickedCard.scale = 1.2;
          hanafudaSelected.push(clickedCard.id);
          playTone(600, 'triangle', 0.05);
          if (hanafudaSelected.length === 2) {
            hanafudaMoves++;
            const [id1, id2] = hanafudaSelected;
            if (hanafudaCards[id1].month === hanafudaCards[id2].month) {
              setTimeout(() => {
                hanafudaCards[id1].matched = true;
                hanafudaCards[id2].matched = true;
                hanafudaScore += 10;
                hanafudaSelected = [];
                shake(15);
                spawnParticles(hanafudaCards[id1].x + 25, hanafudaCards[id1].y + 40, '#fbbf24');
                spawnParticles(hanafudaCards[id2].x + 25, hanafudaCards[id2].y + 40, '#fbbf24');
                playTone(800, 'sine', 0.2);
              }, 400);
            } else {
              playTone(200, 'triangle', 0.2);
              setTimeout(() => {
                hanafudaCards[id1].flipped = false;
                hanafudaCards[id2].flipped = false;
                hanafudaSelected = [];
              }, 800);
            }
          }
        }
      } else if (gameType === 'karuta') {
        const clickedCard = karutaCards.find(c => !c.found && x > c.x && x < c.x + c.w && y > c.y && y < c.y + c.h);
        if (clickedCard) {
          if (clickedCard.correct) {
            clickedCard.found = true;
            karutaScore += 10;
            shake(10);
            spawnParticles(x, y, '#10b981');
            playTone(800, 'sine', 0.2);
            setTimeout(initKaruta, 1000);
          } else {
            karutaScore = Math.max(0, karutaScore - 5);
            shake(5);
            spawnParticles(x, y, '#ef4444');
            playTone(150, 'triangle', 0.3);
          }
        }
      } else if (gameType === 'menko') {
        // No click logic needed here, handled in draw loop via mouse.down
      }
    };
    canvas.addEventListener('click', handleCanvasClick);

    const draw = () => {
      if (!isRunning) return;

      manageAmbientSound();
      if (soundEnabledRef.current && !lastSoundEnabled) {
        if (gameType === 'karuta' && karutaReadingCard) {
          speakWord(karutaReadingCard.read);
        }
      }
      lastSoundEnabled = soundEnabledRef.current;

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
      } else if (gameType === 'brick') {
        ctx.fillStyle = '#f8fafc'; // light slate
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Subtle document lines
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        for (let i = 20; i < canvas.height; i += 20) {
          ctx.beginPath(); ctx.moveTo(20, i); ctx.lineTo(canvas.width - 20, i); ctx.stroke();
        }
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      if (gameType === 'brick') {
        paddle.x = mouse.x - paddle.w / 2;
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;

        ctx.fillStyle = '#334155'; // dark slate paddle
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(51, 65, 85, 0.5)';
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
          ctx.fillStyle = `rgba(59, 130, 246, ${i / 20})`; // blue trail
          ctx.fill();
        });

        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
          ball.dx *= -1;
          shake(2);
          playTone(400, 'triangle', 0.05);
        }
        if (ball.y - ball.radius < 0) {
          ball.dy *= -1;
          shake(2);
          playTone(400, 'triangle', 0.05);
        }
        if (ball.y + ball.radius > canvas.height) {
          ball.x = canvas.width / 2;
          ball.y = canvas.height - 50;
          ball.dy = -5;
          initBricks();
          shake(10);
          playTone(150, 'sawtooth', 0.3);
        }

        if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
          ball.dy = -Math.abs(ball.dy);
          ball.dx = ((ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2)) * 6;
          shake(3);
          spawnParticles(ball.x, ball.y, '#3b82f6', 5);
          playTone(600, 'sine', 0.1);
        }

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#3b82f6'; // blue ball
        ctx.fill();
        ctx.closePath();

        let activeBricks = 0;
        bricks.forEach(b => {
          if (!b.active) return;
          activeBricks++;
          ctx.fillStyle = '#94a3b8'; // slate bricks
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1;
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.strokeRect(b.x, b.y, b.w, b.h);

          if (ball.x > b.x && ball.x < b.x + b.w && ball.y - ball.radius < b.y + b.h && ball.y + ball.radius > b.y) {
            b.active = false;
            ball.dy *= -1;
            spawnParticles(b.x + b.w / 2, b.y + b.h / 2, '#94a3b8');
            shake(5);
            playTone(800, 'sine', 0.1);
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
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('RIGHTS HOLDER', 20, 30);
        ctx.fillText('DEFEND YOUR IP', 20, 50);

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
          playTone(800, 'triangle', 0.1);
        }

        projectiles.forEach((p, i) => {
          p.y += p.dy;
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(p.x, p.y, p.w, p.h);
          if (p.y < 0) projectiles.splice(i, 1);
        });

        let hitEdge = false;
        let activeEnemies = 0;
        let anyEnemyOffBottom = false;
        enemies.forEach(e => {
          if (!e.active) return;
          activeEnemies++;
          e.x += enemyDir;
          if (e.x + e.w > canvas.width || e.x < 0) hitEdge = true;
          if (e.y > canvas.height) anyEnemyOffBottom = true;

          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(e.x + e.w / 2, e.y + e.h / 2, e.w / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('©', e.x + e.w / 2, e.y + e.h / 2);

          projectiles.forEach((p, pi) => {
            if (p.x < e.x + e.w && p.x + p.w > e.x && p.y < e.y + e.h && p.y + p.h > e.y) {
              e.active = false;
              projectiles.splice(pi, 1);
              spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#ef4444', 15);
              shake(8);
              playNoise(0.1, 0.2);
            }
          });
        });

        if (hitEdge) {
          enemyDir *= -1;
          enemies.forEach(e => { if (e.active) e.y += 20; });
          playTone(200, 'triangle', 0.1);
        }
        if (activeEnemies === 0 || anyEnemyOffBottom) {
          initEnemies();
          shake(15);
          playTone(150, 'sawtooth', 0.5);
        }

      } else if (gameType === 'zen') {
        const dx = mouse.x - lastMouse.x;
        const dy = mouse.y - lastMouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 2 && mouse.down) {
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
          if (Math.random() > 0.8) {
            playNoise(0.01, 0.05);
          }
        }
        lastMouse = { x: mouse.x, y: mouse.y };

        if (mouse.clicked) {
          const rand = Math.random();
          if (rand > 0.7) {
            mossPatches.push({ x: mouse.x, y: mouse.y, r: 20 + Math.random() * 30 });
            spawnParticles(mouse.x, mouse.y, '#4ade80', 5);
            shake(1);
            playTone(300, 'sine', 0.5, 0.05);
          } else if (rand > 0.4) {
            rocks.push({ 
              x: mouse.x, 
              y: mouse.y, 
              r: 15 + Math.random() * 25,
              color: rockColors[Math.floor(Math.random() * rockColors.length)]
            });
            spawnParticles(mouse.x, mouse.y, '#9ca3af', 8);
            shake(3);
            playTone(150, 'triangle', 0.3, 0.1);
          } else {
            zenLeaves.push({
              x: mouse.x,
              y: mouse.y,
              color: leafColors[Math.floor(Math.random() * leafColors.length)],
              angle: Math.random() * Math.PI * 2,
              size: 10 + Math.random() * 10
            });
            spawnParticles(mouse.x, mouse.y, '#f472b6', 5);
            playTone(600, 'sine', 0.2, 0.05);
          }
          mouse.clicked = false;
        }

        // Draw leaves
        zenLeaves.forEach(leaf => {
          ctx.save();
          ctx.translate(leaf.x, leaf.y);
          ctx.rotate(leaf.angle);
          ctx.fillStyle = leaf.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, leaf.size, leaf.size/2, 0, 0, Math.PI*2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.beginPath();
          ctx.moveTo(-leaf.size, 0);
          ctx.lineTo(leaf.size, 0);
          ctx.stroke();
          ctx.restore();
        });

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

        // Draw Lily Pads
        ctx.fillStyle = 'rgba(21, 128, 61, 0.6)';
        ctx.strokeStyle = 'rgba(21, 128, 61, 0.8)';
        ctx.lineWidth = 2;
        
        const drawLilyPad = (x: number, y: number, r: number, angle: number) => {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.arc(0, 0, r, 0.2, Math.PI * 2 - 0.2);
          ctx.lineTo(0, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          // Veins
          ctx.beginPath();
          for(let i=0; i<5; i++) {
            ctx.moveTo(0,0);
            ctx.lineTo(Math.cos(i*Math.PI/2.5)*r*0.8, Math.sin(i*Math.PI/2.5)*r*0.8);
          }
          ctx.stroke();
          ctx.restore();
        };

        drawLilyPad(canvas.width * 0.2, canvas.height * 0.3, 40, 0.5);
        drawLilyPad(canvas.width * 0.8, canvas.height * 0.7, 50, -1.2);
        drawLilyPad(canvas.width * 0.7, canvas.height * 0.2, 30, 2.1);

        if (mouse.clicked) {
          ripples.push({ x: mouse.x, y: mouse.y, r: 0, maxR: 100, alpha: 1 });
          koiFood.push({ x: mouse.x, y: mouse.y, life: 1000 });
          mouse.clicked = false;
          playTone(300, 'sine', 0.2);
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

        // Draw and update food
        for (let i = koiFood.length - 1; i >= 0; i--) {
          let food = koiFood[i];
          food.life--;
          if (food.life <= 0) {
            koiFood.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(food.x, food.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(217, 119, 6, ${food.life / 1000})`;
          ctx.fill();
        }

        kois.forEach(koi => {
          let targetX = mouse.x;
          let targetY = mouse.y;
          
          // Find nearest food
          let nearestFoodDist = Infinity;
          let nearestFoodIdx = -1;
          koiFood.forEach((food, idx) => {
            const dx = food.x - koi.x;
            const dy = food.y - koi.y;
            const dist = dx * dx + dy * dy;
            if (dist < nearestFoodDist) {
              nearestFoodDist = dist;
              nearestFoodIdx = idx;
            }
          });

          if (nearestFoodIdx !== -1) {
            targetX = koiFood[nearestFoodIdx].x;
            targetY = koiFood[nearestFoodIdx].y;
            if (nearestFoodDist < 400) { // Eat food
              koiFood.splice(nearestFoodIdx, 1);
              playTone(500, 'triangle', 0.1);
            }
          }

          const dx = targetX - koi.x;
          const dy = targetY - koi.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > 0) {
            koi.vx += (dx / dist) * 0.05;
            koi.vy += (dy / dist) * 0.05;
          }
          
          koi.vx *= 0.98;
          koi.vy *= 0.98;
          
          const speed = Math.sqrt(koi.vx * koi.vx + koi.vy * koi.vy);
          if (speed > 2.5) {
            koi.vx = (koi.vx / speed) * 2.5;
            koi.vy = (koi.vy / speed) * 2.5;
          }

          // Occasional bubble sound
          if (Math.random() < 0.005) {
            playTone(400 + Math.random() * 400, 'sine', 0.1, 0.03);
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

        // Draw subtle branch
        ctx.strokeStyle = 'rgba(87, 62, 53, 0.4)';
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(canvas.width + 20, 50);
        ctx.quadraticCurveTo(canvas.width * 0.7, 80, canvas.width * 0.4, 30);
        ctx.stroke();
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.7, 70);
        ctx.quadraticCurveTo(canvas.width * 0.5, 120, canvas.width * 0.3, 100);
        ctx.stroke();

        const wind = (mouse.x - canvas.width / 2) / (canvas.width / 2) * 3;
        
        petals.forEach(p => {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            p.vx -= (dx / dist) * 0.5;
            p.vy -= (dy / dist) * 0.5;
          }

          p.vx *= 0.98; // Dampen horizontal velocity
          p.x += p.vx + wind;
          p.y += p.vy;
          p.angle += p.spin;
          
          if (p.y > canvas.height + 20) {
            p.y = -20;
            p.x = Math.random() * canvas.width;
            p.vx = (Math.random() - 0.5) * 2;
            p.vy = 1 + Math.random() * 2;
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

        if (mouse.clicked) {
          for (let i = 0; i < 10; i++) {
            petals.push({
              x: mouse.x,
              y: mouse.y,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5,
              size: 4 + Math.random() * 6,
              angle: Math.random() * Math.PI * 2,
              spin: (Math.random() - 0.5) * 0.2
            });
          }
          mouse.clicked = false;
          playTone(500, 'sine', 0.2);
        }

      } else if (gameType === 'tetris') {
        // Law Stacker (Improved)
        // Draw Blueprint Grid
        ctx.fillStyle = '#0f172a'; // dark slate
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)'; // light blue grid
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 20) {
          ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 20) {
          ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        // Draw Next Block Preview - moved down to avoid nav bar
        if (nextBlock) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
          ctx.fillRect(10, 60, 120, 50);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
          ctx.strokeRect(10, 60, 120, 50);
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 10px monospace';
          ctx.fillText('NEXT:', 20, 75);
          ctx.fillStyle = nextBlock.color;
          ctx.font = 'bold 10px monospace';
          ctx.fillText(nextBlock.word, 20, 95);
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
            playTone(200, 'triangle', 0.1);
            
            // Check for line clearing (simplified: if a horizontal range is mostly full)
            // In this "stacker" version, we'll just check if we have many blocks at similar Y
            const rowY = Math.floor(currentBlock.y / 10) * 10;
            const blocksInRow = tetrisBlocks.filter(b => Math.abs(b.y - rowY) < 20).length;
            if (blocksInRow > 5) {
              tetrisScore += 100;
              tetrisLastFact = legalFacts[Math.floor(Math.random() * legalFacts.length)];
              tetrisFactTimer = 120; // 2 seconds at 60fps
              // Clear some blocks in that row
              tetrisBlocks = tetrisBlocks.filter(b => Math.abs(b.y - rowY) >= 20);
              shake(15);
              spawnParticles(canvas.width / 2, rowY, '#ffffff', 30);
              playTone(600, 'sine', 0.2);
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
          
          // Block base
          ctx.fillStyle = b.color;
          ctx.shadowBlur = 15;
          ctx.shadowColor = b.color;
          ctx.beginPath();
          ctx.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, 4);
          ctx.fill();
          ctx.shadowBlur = 0;
          
          // Inner highlight for 3D effect
          ctx.strokeStyle = 'rgba(255,255,255,0.4)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(-b.w / 2 + 2, -b.h / 2 + 2, b.w - 4, b.h - 4, 2);
          ctx.stroke();
          
          // Dark bottom edge
          ctx.strokeStyle = 'rgba(0,0,0,0.3)';
          ctx.beginPath();
          ctx.moveTo(-b.w / 2 + 4, b.h / 2 - 2);
          ctx.lineTo(b.w / 2 - 4, b.h / 2 - 2);
          ctx.stroke();
          
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${b.rotated ? '10px' : '12px'} monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(b.word, 0, 0);
          ctx.restore();
        });

        // Draw Legal Fact
        if (tetrisFactTimer > 0) {
          ctx.save();
          ctx.fillStyle = 'rgba(0,0,0,0.85)';
          ctx.fillRect(0, canvas.height / 2 - 50, canvas.width, 100);
          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('LEGAL INSIGHT:', canvas.width / 2, canvas.height / 2 - 20);
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px monospace';
          const words = tetrisLastFact.split(' ');
          let line = '';
          let y = canvas.height / 2;
          words.forEach(word => {
            if ((line + word).length > 35) {
              ctx.fillText(line, canvas.width / 2, y);
              line = word + ' ';
              y += 12;
            } else {
              line += word + ' ';
            }
          });
          ctx.fillText(line, canvas.width / 2, y);
          ctx.restore();
          tetrisFactTimer--;
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`SCORE: ${tetrisScore}`, 20, 30);
        ctx.fillText('CLICK TO ROTATE', 20, 50);

      } else if (gameType === 'daifugo') {
        ctx.fillStyle = '#064e3b'; // Dark green table
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw AI Hand (hidden)
        const cardW = 40;
        const cardH = 60;
        const spacing = 10;
        const aiTotalW = daifugoAIHand.length * (cardW + spacing) - spacing;
        const aiStartX = (canvas.width - aiTotalW) / 2;
        const aiStartY = 20;

        for (let i = 0; i < daifugoAIHand.length; i++) {
          ctx.fillStyle = '#b91c1c'; // Red back
          ctx.fillRect(aiStartX + i * (cardW + spacing), aiStartY, cardW, cardH);
          ctx.strokeStyle = '#fca5a5';
          ctx.strokeRect(aiStartX + i * (cardW + spacing), aiStartY, cardW, cardH);
        }

        // Draw Pile
        if (daifugoPile.length > 0) {
          const topCard = daifugoPile[daifugoPile.length - 1];
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(canvas.width / 2 - cardW / 2, canvas.height / 2 - cardH / 2, cardW, cardH);
          ctx.strokeStyle = '#000000';
          ctx.strokeRect(canvas.width / 2 - cardW / 2, canvas.height / 2 - cardH / 2, cardW, cardH);
          ctx.fillStyle = '#000000';
          ctx.font = '20px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(topCard.toString(), canvas.width / 2, canvas.height / 2);
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.strokeRect(canvas.width / 2 - cardW / 2, canvas.height / 2 - cardH / 2, cardW, cardH);
        }

        // Draw Player Hand
        const pTotalW = daifugoPlayerHand.length * (cardW + spacing) - spacing;
        const pStartX = (canvas.width - pTotalW) / 2;
        const pStartY = canvas.height - cardH - 20;

        for (let i = 0; i < daifugoPlayerHand.length; i++) {
          const card = daifugoPlayerHand[i];
          const cx = pStartX + i * (cardW + spacing);
          const cy = pStartY;
          
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(cx, cy, cardW, cardH);
          ctx.strokeStyle = '#000000';
          ctx.strokeRect(cx, cy, cardW, cardH);
          
          ctx.fillStyle = '#000000';
          ctx.font = '16px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(card.toString(), cx + cardW / 2, cy + cardH / 2);
        }

        // Draw Pass Button
        if (daifugoTurn === 'player' && !daifugoGameOver) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(canvas.width / 2 - 40, canvas.height / 2 + 20, 80, 30);
          ctx.fillStyle = '#ffffff';
          ctx.font = '14px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('PASS', canvas.width / 2, canvas.height / 2 + 35);
        }

        // Draw Message
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(daifugoMessage, canvas.width / 2, canvas.height / 2 + 80);
        
        ctx.textAlign = 'left';
        ctx.fillText(`Wins: ${daifugoWins} | Losses: ${daifugoLosses}`, 10, 30);

      } else if (gameType === 'oichokabu') {
        ctx.fillStyle = '#1e3a8a'; // Dark blue table
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cardW = 40;
        const cardH = 60;
        const spacing = 10;

        const drawHand = (hand: number[], startY: number, hidden: boolean = false) => {
          const totalW = hand.length * (cardW + spacing) - spacing;
          const startX = (canvas.width - totalW) / 2;
          for (let i = 0; i < hand.length; i++) {
            const cx = startX + i * (cardW + spacing);
            if (hidden && i === 1 && oichoState !== 'gameOver') {
              ctx.fillStyle = '#b91c1c';
              ctx.fillRect(cx, startY, cardW, cardH);
              ctx.strokeStyle = '#fca5a5';
              ctx.strokeRect(cx, startY, cardW, cardH);
            } else {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(cx, startY, cardW, cardH);
              ctx.strokeStyle = '#000000';
              ctx.strokeRect(cx, startY, cardW, cardH);
              ctx.fillStyle = '#000000';
              ctx.font = '16px monospace';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(hand[i].toString(), cx + cardW / 2, startY + cardH / 2);
            }
          }
        };

        // Draw Dealer Hand
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('DEALER', canvas.width / 2, 20);
        drawHand(oichoDealerHand, 30, true);
        if (oichoState === 'gameOver') {
          ctx.fillText(`Score: ${getOichoScore(oichoDealerHand)}`, canvas.width / 2, 105);
        }

        // Draw Player Hand
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PLAYER', canvas.width / 2, canvas.height - 110);
        drawHand(oichoPlayerHand, canvas.height - 90);
        ctx.fillText(`Score: ${getOichoScore(oichoPlayerHand)}`, canvas.width / 2, canvas.height - 15);
        
        ctx.textAlign = 'left';
        ctx.fillText(`Chips: ${oichoChips}`, 10, canvas.height - 15);

        // Draw Buttons
        if (oichoState === 'playerTurn') {
          ctx.fillStyle = '#10b981';
          ctx.fillRect(canvas.width / 2 - 60, canvas.height / 2 + 20, 50, 30);
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('DRAW', canvas.width / 2 - 35, canvas.height / 2 + 35);

          ctx.fillStyle = '#ef4444';
          ctx.fillRect(canvas.width / 2 + 10, canvas.height / 2 + 20, 50, 30);
          ctx.fillStyle = '#ffffff';
          ctx.fillText('STAND', canvas.width / 2 + 35, canvas.height / 2 + 35);
        }

        // Draw Message
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(oichoMessage, canvas.width / 2, canvas.height / 2);

      } else if (gameType === 'hanafuda') {
        // Draw elegant background
        const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
        grad.addColorStop(0, '#1e293b');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        hanafudaCards.forEach(c => {
          // Animate flip and scale
          const targetFlip = (c.flipped || c.matched) ? 1 : 0;
          c.flipAnim += (targetFlip - c.flipAnim) * 0.15;
          c.scale += (1 - c.scale) * 0.1;

          ctx.save();
          ctx.translate(c.x + c.w/2, c.y + c.h/2);
          ctx.scale(Math.abs(Math.cos(c.flipAnim * Math.PI)), c.scale);
          ctx.translate(-c.w/2, -c.h/2);
          
          if (c.matched) {
            ctx.globalAlpha = 0.3;
          }

          // Card shadow with glow if selected
          const isSelected = hanafudaSelected.includes(c.id);
          ctx.shadowBlur = isSelected ? 20 : 10;
          ctx.shadowColor = isSelected ? '#fbbf24' : 'rgba(0,0,0,0.5)';
          
          // Card Base
          ctx.beginPath();
          ctx.roundRect(0, 0, c.w, c.h, 8);
          ctx.fillStyle = '#000';
          ctx.fill();
          ctx.shadowBlur = 0;

          if (c.flipAnim > 0.5) {
            // Front
            ctx.fillStyle = '#fffaf0';
            ctx.beginPath();
            ctx.roundRect(2, 2, c.w - 4, c.h - 4, 6);
            ctx.fill();
            
            // Decorative border
            ctx.strokeStyle = c.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(6, 6, c.w - 12, c.h - 12);
            
            // Month symbol
            ctx.fillStyle = c.color;
            ctx.font = '36px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(c.symbol, c.w / 2, c.h / 2 - 10);
            
            ctx.font = 'bold 10px serif';
            ctx.fillStyle = '#1a1a1a';
            ctx.fillText(c.jp, c.w / 2, c.h / 2 + 25);
          } else {
            // Back
            ctx.fillStyle = '#991b1b'; 
            ctx.beginPath();
            ctx.roundRect(2, 2, c.w - 4, c.h - 4, 6);
            ctx.fill();
            
            // Back pattern
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(8, 8, c.w - 16, c.h - 16);
            
            ctx.beginPath();
            ctx.arc(c.w/2, c.h/2, 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(c.w/2, 15); ctx.lineTo(c.w/2, c.h-15);
            ctx.moveTo(15, c.h/2); ctx.lineTo(c.w-15, c.h/2);
            ctx.stroke();
          }
          ctx.restore();
        });

        // UI Overlay
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`SCORE: ${hanafudaScore}`, 20, 35);
        ctx.textAlign = 'right';
        ctx.fillText(`MOVES: ${hanafudaMoves}`, canvas.width - 20, 35);

        if (hanafudaCards.every(c => c.matched)) {
          ctx.fillStyle = 'rgba(0,0,0,0.8)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 48px serif';
          ctx.textAlign = 'center';
          ctx.fillText('ZEN MASTER', canvas.width / 2, canvas.height / 2);
          ctx.font = '18px sans-serif';
          ctx.fillStyle = '#fff';
          ctx.fillText('Perfect Harmony Achieved', canvas.width / 2, canvas.height / 2 + 40);
          setTimeout(initHanafuda, 3000);
        }

      } else if (gameType === 'karuta') {
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#064e3b');
        grad.addColorStop(1, '#022c22');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Reading area with glowing effect
        const pulse = Math.sin(Date.now() / 300) * 0.2 + 0.8;
        ctx.fillStyle = `rgba(255,255,255,${0.1 * pulse})`;
        ctx.beginPath();
        ctx.roundRect(20, 50, canvas.width - 40, 100, 15);
        ctx.fill();
        
        ctx.shadowBlur = 15 * pulse;
        ctx.shadowColor = '#fbbf24';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 50px serif';
        ctx.textAlign = 'center';
        ctx.fillText(karutaReadingCard?.read || "", canvas.width / 2, 110);
        ctx.shadowBlur = 0;
        
        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('FIND THE MATCHING SYMBOL', canvas.width / 2, 135);

        karutaCards.forEach(c => {
          if (c.found) return;
          
          ctx.save();
          ctx.translate(c.x + c.w/2, c.y + c.h/2);
          const hover = (mouse.x > c.x && mouse.x < c.x + c.w && mouse.y > c.y && mouse.y < c.y + c.h);
          if (hover) ctx.scale(1.05, 1.05);
          ctx.translate(-c.w/2, -c.h/2);

          // Card shadow
          ctx.fillStyle = 'rgba(0,0,0,0.4)';
          ctx.beginPath();
          ctx.roundRect(4, 4, c.w, c.h, 4);
          ctx.fill();

          // Card Base
          ctx.fillStyle = '#fef3c7';
          ctx.beginPath();
          ctx.roundRect(0, 0, c.w, c.h, 4);
          ctx.fill();
          
          ctx.strokeStyle = '#92400e';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          ctx.fillStyle = '#1a1a1a';
          ctx.font = 'bold 32px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(c.text, c.w / 2, c.h / 2);
          ctx.restore();
        });

      } else if (gameType === 'menko') {
        // Update Menko logic
        if (!menkoPlayerCard.active && menkoThrowsLeft > 0) {
          if (mouse.down) {
            menkoPlayerCard.charging = true;
            
            // Oscillating power
            menkoPlayerCard.power += 3 * menkoPlayerCard.powerDir;
            if (menkoPlayerCard.power >= 100) {
              menkoPlayerCard.power = 100;
              menkoPlayerCard.powerDir = -1;
            } else if (menkoPlayerCard.power <= 0) {
              menkoPlayerCard.power = 0;
              menkoPlayerCard.powerDir = 1;
            }
          } else if (menkoPlayerCard.charging) {
            // Release throw
            const powerScale = menkoPlayerCard.power / 100;
            const throwAngle = Math.atan2(mouse.y - canvas.height, mouse.x - canvas.width / 2);
            const throwSpeed = 15 + (15 * powerScale);
            
            menkoPlayerCard = { 
              x: canvas.width / 2, y: canvas.height, 
              w: 60, h: 60, 
              vx: Math.cos(throwAngle) * throwSpeed + menkoWind.x, 
              vy: Math.sin(throwAngle) * throwSpeed, 
              active: true,
              rotation: 0,
              spin: (Math.random() - 0.5) * 0.8,
              power: menkoPlayerCard.power,
              charging: false,
              powerDir: 1
            };
            menkoThrowsLeft--;
            shake(5);
            playNoise(0.1, 0.2);
          }
        }

        // Background - Tatami mat style
        ctx.fillStyle = '#d4d4d8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Tatami lines
        ctx.strokeStyle = '#a1a1aa';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 60) {
          ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        }

        // Wind effect visualization
        menkoWindTimer += 0.05;
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          const wx = (Math.sin(menkoWindTimer + i) * 20) + (canvas.width / 2) + (menkoWind.x * 50);
          const wy = (Math.cos(menkoWindTimer * 0.5 + i) * 20) + (canvas.height / 2) + (menkoWind.y * 50);
          ctx.beginPath();
          ctx.moveTo(wx, wy);
          ctx.lineTo(wx + menkoWind.x * 10, wy + menkoWind.y * 10);
          ctx.stroke();
        }
        
        // Target Cards
        menkoTargets.forEach(target => {
          ctx.save();
          ctx.translate(target.x + target.w / 2, target.y + target.h / 2);
          
          if (target.flipped) {
            const flipScale = Math.cos(target.flipProgress);
            ctx.scale(1, flipScale);
          }
          
          ctx.rotate(target.angle);
          
          // Card Base
          ctx.shadowBlur = target.flipped ? 5 : 15;
          ctx.shadowColor = 'rgba(0,0,0,0.6)';
          ctx.fillStyle = target.flipped ? '#f3f4f6' : '#1e40af';
          ctx.beginPath();
          ctx.roundRect(-target.w / 2, -target.h / 2, target.w, target.h, 4);
          ctx.fill();
          ctx.shadowBlur = 0;
          
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();
          
          // Target art
          ctx.fillStyle = target.flipped ? '#111827' : '#fff';
          ctx.font = 'bold 24px "Noto Serif JP", serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(target.flipped ? '負' : target.label, 0, 0);
          
          ctx.restore();

          if (target.flipped && target.flipProgress < Math.PI) {
            target.flipProgress += 0.2;
          }
        });

        // Player Card
        if (menkoPlayerCard.active) {
          menkoPlayerCard.x += menkoPlayerCard.vx;
          menkoPlayerCard.y += menkoPlayerCard.vy;
          menkoPlayerCard.vy += 0.8; // Gravity
          menkoPlayerCard.rotation += menkoPlayerCard.spin;

          // Apply wind to player card while in air
          menkoPlayerCard.vx += menkoWind.x * 0.01;

          ctx.save();
          ctx.translate(menkoPlayerCard.x, menkoPlayerCard.y);
          ctx.rotate(menkoPlayerCard.rotation);
          
          ctx.shadowBlur = 20;
          ctx.shadowColor = 'rgba(220, 38, 38, 0.5)';
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.roundRect(-menkoPlayerCard.w / 2, -menkoPlayerCard.h / 2, menkoPlayerCard.w, menkoPlayerCard.h, 4);
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 3;
          ctx.stroke();
          
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 24px "Noto Serif JP", serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('勝', 0, 0);
          
          ctx.restore();

          // Collision / Wind effect on impact
          if (menkoPlayerCard.y > canvas.height - 20 && menkoPlayerCard.vy > 0) {
            shake(menkoPlayerCard.power / 2);
            playNoise(0.2, 0.3);
            
            // Draw impact ring
            ctx.beginPath();
            ctx.arc(menkoPlayerCard.x, canvas.height - 20, 80 + (menkoPlayerCard.power * 0.5), 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 5;
            ctx.stroke();
            
            let flipsThisSlam = 0;
            menkoTargets.forEach(target => {
              const dx = menkoPlayerCard.x - (target.x + target.w / 2);
              const dy = menkoPlayerCard.y - (target.y + target.h / 2);
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              // Wind shockwave flips cards
            const impactRadius = 180 + (menkoPlayerCard.power * 1.8);
            if (dist < impactRadius && !target.flipped) {
                target.flipped = true;
                target.flipProgress = 0;
                flipsThisSlam++;
                spawnParticles(target.x + target.w / 2, target.y + target.h / 2, '#ffffff', 20);
                playTone(200 + (Math.random() * 100), 'square', 0.2);
              }
            });

            if (flipsThisSlam > 0) {
              const comboBonus = flipsThisSlam > 1 ? flipsThisSlam : 1;
              menkoScore += 10 * menkoLevel * comboBonus;
              if (flipsThisSlam > 1) {
                shake(40);
                playTone(400, 'triangle', 0.3);
              }
            }

            // Check if all flipped
            if (menkoTargets.every(t => t.flipped)) {
              menkoLevel++;
              setTimeout(() => initMenko(false), 1500);
            } else if (menkoThrowsLeft <= 0) {
              setTimeout(() => initMenko(true), 2000);
            }
          }

          if (menkoPlayerCard.y > canvas.height + 100) {
            menkoPlayerCard.active = false;
            menkoPlayerCard.power = 0;
          }
        }

        // UI - Aiming Line
        if (menkoPlayerCard.charging && menkoThrowsLeft > 0) {
          const startX = canvas.width / 2;
          const startY = canvas.height;
          const throwAngle = Math.atan2(mouse.y - startY, mouse.x - startX);
          const powerScale = menkoPlayerCard.power / 100;
          const throwSpeed = 15 + (15 * powerScale);
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          
          // Draw predicted trajectory
          let px = startX;
          let py = startY;
          let pvx = Math.cos(throwAngle) * throwSpeed + menkoWind.x;
          let pvy = Math.sin(throwAngle) * throwSpeed;
          
          for (let i = 0; i < 20; i++) {
            px += pvx;
            py += pvy;
            pvy += 0.8; // gravity
            pvx += menkoWind.x * 0.01;
            ctx.lineTo(px, py);
            if (py > canvas.height) break;
          }
          
          ctx.strokeStyle = `rgba(239, 68, 68, ${0.3 + powerScale * 0.7})`;
          ctx.lineWidth = 2 + powerScale * 3;
          ctx.setLineDash([5, 5]);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Draw impact circle prediction
          if (py >= canvas.height - 20) {
            ctx.beginPath();
            ctx.arc(px, canvas.height - 20, 180 + (menkoPlayerCard.power * 1.8), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(239, 68, 68, ${0.1 + powerScale * 0.2})`;
            ctx.fill();
          }
        }

        // UI - Power Bar
        if (menkoPlayerCard.charging && menkoThrowsLeft > 0) {
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          ctx.fillRect(canvas.width / 2 - 50, canvas.height - 60, 100, 10);
          
          // Color based on power (green -> yellow -> red)
          const r = Math.min(255, (menkoPlayerCard.power / 50) * 255);
          const g = Math.min(255, ((100 - menkoPlayerCard.power) / 50) * 255);
          ctx.fillStyle = `rgb(${r}, ${g}, 0)`;
          
          ctx.fillRect(canvas.width / 2 - 50, canvas.height - 60, menkoPlayerCard.power, 10);
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('POWER', canvas.width / 2, canvas.height - 65);
        }

        // Wind Indicator
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`WIND: ${menkoWind.x > 0 ? '→' : '←'} ${Math.abs(menkoWind.x).toFixed(1)}`, 10, 50);
        
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        
        let statusText = '';
        if (menkoTargets.every(t => t.flipped)) {
          statusText = 'LEVEL CLEAR! 🔥';
        } else if (menkoThrowsLeft <= 0 && !menkoPlayerCard.active) {
          statusText = 'GAME OVER! RESTARTING... 💀';
        }
        ctx.fillText(statusText, canvas.width / 2, canvas.height - 30);
        
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${menkoScore}`, 10, 30);
        ctx.fillText(`Level: ${menkoLevel}`, 10, 70);
        
        // Throws left indicator
        ctx.textAlign = 'right';
        ctx.fillText(`Throws Left: ${menkoThrowsLeft}`, canvas.width - 10, 30);
        
        // Draw throw tokens
        for(let i=0; i < Math.max(0, menkoThrowsLeft); i++) {
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(canvas.width - 25 - (i * 20), 40, 15, 15);
          ctx.strokeStyle = '#fff';
          ctx.strokeRect(canvas.width - 25 - (i * 20), 40, 15, 15);
        }

      } else if (gameType === 'lanterns') {
        // Deep night sky gradient
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.7, '#1e1b4b');
        grad.addColorStop(1, '#312e81');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Moon
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 30;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(canvas.width * 0.8, canvas.height * 0.2, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

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
          playTone(400, 'sine', 0.3);
        }

        lanterns.forEach((l, i) => {
          const dx = mouse.x - l.x;
          const dy = mouse.y - l.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            l.vx -= (dx / dist) * 0.1;
            l.vy -= (dy / dist) * 0.1;
          }

          l.vx *= 0.99; // Dampen horizontal velocity
          l.x += l.vx + (Math.sin(Date.now() * 0.001 + l.flicker) * 0.5);
          l.y += l.vy;
          
          if (l.y < -50) {
            lanterns[i].y = canvas.height + 50;
            lanterns[i].x = Math.random() * canvas.width;
            lanterns[i].vx = (Math.random() - 0.5) * 0.5;
            lanterns[i].vy = -0.5 - Math.random() * 1;
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
        // Background
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#fdfbf7');
        grad.addColorStop(1, '#e5e0d8');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Sun/Moon
        ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
        ctx.beginPath();
        ctx.arc(canvas.width * 0.8, canvas.height * 0.3, 60, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.05)';
        ctx.beginPath();
        ctx.arc(canvas.width * 0.8, canvas.height * 0.3, 80, 0, Math.PI * 2);
        ctx.fill();

        bonsaiTime += 0.02;
        
        // Draw Pot
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height - 40);
        ctx.fillStyle = '#292524'; // Dark stone
        ctx.beginPath();
        ctx.moveTo(-60, 0);
        ctx.lineTo(60, 0);
        ctx.lineTo(50, 30);
        ctx.lineTo(-50, 30);
        ctx.closePath();
        ctx.fill();
        // Pot rim
        ctx.fillStyle = '#44403c';
        ctx.fillRect(-65, -5, 130, 10);
        ctx.restore();

        // Draw branches with gentle sway
        branches.forEach(b => {
          // Sway logic based on generation (thinner branches sway more)
          const sway = Math.sin(bonsaiTime + b.generation) * (b.generation * 0.02);
          b.currentAngle += (b.targetAngle + sway - b.currentAngle) * 0.1;

          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          const endX = b.x + Math.cos(b.currentAngle) * b.length;
          const endY = b.y + Math.sin(b.currentAngle) * b.length;
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = '#4a3b32';
          ctx.lineWidth = b.width;
          ctx.lineCap = 'round';
          ctx.stroke();
        });

        // Draw leaves
        for (let i = leaves.length - 1; i >= 0; i--) {
          const l = leaves[i];
          if (l.alpha < 1 && !l.falling) l.alpha += 0.05;
          
          if (l.falling) {
            l.x += l.vx;
            l.y += l.vy;
            l.rotation += l.vx * 0.1;
            l.alpha -= 0.005;
            if (l.alpha <= 0 || l.y > canvas.height + 20) {
              leaves.splice(i, 1);
              continue;
            }
          } else {
            // Gentle sway for attached leaves
            l.x += Math.sin(bonsaiTime * 2 + l.y) * 0.2;
          }

          ctx.save();
          ctx.translate(l.x, l.y);
          ctx.rotate(l.rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, l.size, l.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fillStyle = l.color;
          ctx.globalAlpha = l.alpha;
          ctx.fill();
          ctx.restore();
        }

        if (mouse.clicked) {
          initBonsai();
          mouse.clicked = false;
        }
        
        // Instructions handled by React UI
      } else if (gameType === 'infringement') {
        ctx.fillStyle = '#fef2f2';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Moving Grid
        const gridOffset = (Date.now() / 50) % 40;
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.lineWidth = 1;
        for (let i = -40; i < canvas.width; i += 40) {
          ctx.beginPath(); ctx.moveTo(i + gridOffset, 0); ctx.lineTo(i + gridOffset, canvas.height); ctx.stroke();
        }
        for (let i = -40; i < canvas.height; i += 40) {
          ctx.beginPath(); ctx.moveTo(0, i + gridOffset); ctx.lineTo(canvas.width, i + gridOffset); ctx.stroke();
        }

        if (!infringementGameOver) {
          const spawnRate = Math.max(300, 800 - (infringementLevel * 50));
          if (Date.now() - infringementLastSpawn > spawnRate) {
            spawnInfringement();
            infringementLastSpawn = Date.now();
          }
        }

        infringementItems.forEach((item, i) => {
          if (!item.active) {
            infringementItems.splice(i, 1);
            return;
          }
          if (!infringementGameOver) {
            item.timer--;
          }
          
          if (item.timer <= 0) {
            item.active = false;
            infringementMisses++;
            infringementCombo = 0;
            shake(10);
            playTone(150, 'sawtooth', 0.2, 0.1);
            
            if (infringementMisses >= 10) {
              infringementGameOver = true;
              playTone(100, 'sawtooth', 1, 0.2);
            }
            return;
          }

          const scale = Math.sin(item.timer * 0.1) * 0.05 + 1;
          ctx.save();
          ctx.translate(item.x, item.y);
          ctx.scale(scale, scale);
          
          // Shadow
          ctx.shadowBlur = 15;
          ctx.shadowColor = item.isGolden ? 'rgba(251, 191, 36, 0.6)' : 'rgba(239, 68, 68, 0.4)';
          
          // Outer dashed ring (like a stamp)
          ctx.strokeStyle = item.isGolden ? '#fbbf24' : '#ef4444';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(0, 0, item.r + 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Inner solid circle
          ctx.fillStyle = item.isGolden ? '#fbbf24' : '#ef4444';
          ctx.beginPath();
          ctx.arc(0, 0, item.r, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = item.isGolden ? '#92400e' : '#ffffff';
          ctx.font = 'bold 22px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item.type, 0, 0);
          
          // Timer ring
          ctx.strokeStyle = item.isGolden ? '#92400e' : '#ffffff';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(0, 0, item.r - 6, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * (item.timer / item.maxTimer)));
          ctx.stroke();
          
          ctx.restore();
        });

        // UI
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`TAKEDOWNS: ${infringementScore}`, 20, 40);
        ctx.fillStyle = '#991b1b';
        ctx.fillText(`LIABILITIES: ${infringementMisses}/10`, 20, 60);
        ctx.fillStyle = '#dc2626';
        ctx.fillText(`LEVEL: ${infringementLevel}`, 20, 80);
        
        if (infringementCombo > 1) {
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 24px monospace';
          ctx.fillText(`${infringementCombo}x COMBO!`, 20, 110);
        }

        if (infringementGameOver) {
          ctx.fillStyle = 'rgba(0,0,0,0.8)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 40px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('BRAND DILUTED', canvas.width / 2, canvas.height / 2 - 40);
          ctx.fillStyle = '#ffffff';
          ctx.font = '20px monospace';
          ctx.fillText(`FINAL SCORE: ${infringementScore}`, canvas.width / 2, canvas.height / 2 + 10);
          ctx.font = '14px monospace';
          ctx.fillText('CLICK TO RE-LITIGATE', canvas.width / 2, canvas.height / 2 + 50);
        }

        // Draw floating texts
        infringementFloatingTexts.forEach((ft, i) => {
          ctx.save();
          ctx.globalAlpha = ft.life;
          ctx.fillStyle = ft.color || '#ef4444';
          ctx.font = 'bold 16px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(ft.text, ft.x, ft.y - (1 - ft.life) * 50);
          ctx.restore();
          ft.life -= 0.02;
          if (ft.life <= 0) infringementFloatingTexts.splice(i, 1);
        });
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
      
      if (ambientGain && globalAudioCtx) {
        try {
          ambientGain.gain.setTargetAtTime(0, globalAudioCtx.currentTime, 0.1);
          if (ambientOsc1) { try { ambientOsc1.stop(); } catch(e){} ambientOsc1.disconnect(); }
          if (ambientOsc2) { try { ambientOsc2.stop(); } catch(e){} ambientOsc2.disconnect(); }
          ambientGain.disconnect();
        } catch(e) {}
      }
      window.speechSynthesis.cancel();
    };
  }, [isPlaying, gameType]);

  return canvasRef;
}
