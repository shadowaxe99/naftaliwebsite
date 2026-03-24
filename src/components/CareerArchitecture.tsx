import React, { useRef, useState, useEffect, memo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue } from 'motion/react';
import { ChevronDown, MapPin, Ruler, Hammer, PenTool, Sparkles, Construction } from 'lucide-react';

const blocks = [
  {
    id: 'foundation',
    title: 'Foundation',
    subtitle: 'Excelsior University',
    year: '2021-2024',
    location: 'Albany, NY',
    description: 'Recipient of the U.S. Presidential Academic Excellence Award. Focused on liberal arts with a strong emphasis on textual analysis and critical thinking.',
    color: 'bg-neutral-500',
    textColor: 'text-white',
    width: 'w-full md:w-[65%]',
    height: 'min-h-[120px]',
    align: 'self-center',
    icon: '🏛️',
    blueprintIcon: '🏗️',
    stamp: 'FOUNDATION'
  },
  {
    id: 'creative',
    title: 'Creative Strategy',
    subtitle: 'American Dream Mall',
    year: '2021',
    location: 'East Rutherford, NJ',
    description: 'Consulted with VP of Theme Park Development on creative strategy for successfully constructed PAW Park attraction. Drafted comprehensive script for Avatar: The Last Airbender motion simulator ride reviewed by park leadership.',
    color: 'bg-red-600',
    textColor: 'text-white',
    width: 'w-[80%] md:w-[45%]',
    height: 'min-h-[110px]',
    align: 'self-start md:ml-[5%]',
    icon: '🎢',
    blueprintIcon: '🎨',
    annotation: 'CREATIVE_BRICK',
    stamp: 'STRATEGY'
  },
  {
    id: 'analysis',
    title: 'Rigorous Analysis',
    subtitle: 'Rabbinic Ordination',
    year: '2022-2024',
    location: 'Lakewood, NJ',
    description: 'Intensive graduate-level study of Jewish law involving rigorous textual analysis and application of complex legal frameworks. Specialized in intricate reasoning, such as the laws of mixtures (Ta’aruvos) and procedural prohibitions (Shabbos).',
    color: 'bg-yellow-400',
    textColor: 'text-neutral-900',
    width: 'w-[90%] md:w-[55%]',
    height: 'min-h-[110px]',
    align: 'self-end md:mr-[10%]',
    icon: '📜',
    blueprintIcon: '🔍',
    annotation: 'ANALYTICAL_BRICK',
    stamp: 'CERTIFIED'
  },
  {
    id: 'tech',
    title: 'Tech & Design',
    subtitle: 'BrandWhatever',
    year: '2024',
    location: 'Brooklyn, NY',
    description: 'Collaborated with senior design staff to produce digital and print advertising materials using Adobe Creative Suite. Gained proficiency in AI technologies by training Stable Diffusion models for creative asset generation.',
    color: 'bg-neutral-900',
    textColor: 'text-white',
    width: 'w-[85%] md:w-[50%]',
    height: 'min-h-[120px]',
    align: 'self-center md:ml-[5%]',
    icon: '🤖',
    blueprintIcon: '⚙️',
    annotation: 'DIGITAL_BRICK',
    stamp: 'BETA_TEST'
  },
  {
    id: 'law',
    title: 'Legal Frameworks',
    subtitle: 'New York Law School',
    year: '2026 - 2029',
    location: 'New York, NY',
    description: 'Juris Doctor (J.D.) Candidate. Building upon a foundation of rigorous analysis to specialize in Copyright & Trademark Law with a focus on Japanese Intellectual Property.',
    color: 'bg-blue-600',
    textColor: 'text-white',
    width: 'w-full md:w-[60%]',
    height: 'min-h-[140px]',
    align: 'self-center',
    icon: '⚖️',
    blueprintIcon: '🏛️',
    annotation: 'LEGAL_BRICK',
    stamp: 'IN_PROGRESS'
  }
];

const CareerBlock = memo(({ block, index, totalBlocks, isDarkMode, expandedId, setExpandedId, mouseX, mouseY, springScroll, playClick, handleMouseMove }: any) => {
  const blockRef = useRef<HTMLDivElement>(null);
  const yOffset = useTransform(springScroll, [0, 1], [150 * (totalBlocks - index), 0]);
  const opacity = useTransform(springScroll, [0, 0.2], [0, 1]);
  const rotate = useTransform(springScroll, [0, 1], [index % 2 === 0 ? 5 : -5, 0]);
  const isExpanded = expandedId === block.id;

  useEffect(() => {
    if (isExpanded && blockRef.current) {
      setTimeout(() => {
        blockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }, [isExpanded]);

  // 3D Tilt values
  const rotateX = useTransform(mouseY, [0, 400], [5, -5]);
  const rotateY = useTransform(mouseX, [0, 800], [-5, 5]);

  let blockColor = block.color;
  let blockTextColor = block.textColor;

  if (isDarkMode) {
    if (block.id === 'creative') {
      blockColor = 'bg-neutral-800';
      blockTextColor = 'text-white';
    } else if (block.id === 'analysis') {
      blockColor = 'bg-neutral-700';
      blockTextColor = 'text-white';
    }
  }

  return (
    <motion.div layout key={block.id} ref={blockRef} className={`relative flex flex-col ${block.align} ${block.width}`}>
      {/* Whimsical Annotation */}
      {block.annotation && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          style={{ zIndex: index * 10 + 1 }}
          className={`absolute -top-2 ${index % 2 === 0 ? '-left-4' : '-right-4'}`}
        >
          <div className={`px-2 py-1 rounded border ${isDarkMode ? 'bg-neutral-900 border-neutral-700 text-neutral-500' : 'bg-white border-neutral-200 text-neutral-400'} text-[8px] font-mono font-bold uppercase tracking-tighter shadow-sm`}>
            {block.annotation}
          </div>
        </motion.div>
      )}

      <motion.div
        style={{ y: yOffset, opacity, rotate, zIndex: index * 10 }}
        className="w-full relative"
      >
        <motion.div
          layout
          style={{ rotateX, rotateY, perspective: 1000 }}
          whileHover={{ 
            scale: 1.02,
            y: -8,
            transition: { type: 'spring', stiffness: 400, damping: 10 }
          }}
          onMouseMove={handleMouseMove}
          className={`
            w-full ${blockColor} ${blockTextColor}
            rounded-2xl shadow-[inset_0_4px_8px_rgba(255,255,255,0.4),inset_0_-8px_8px_rgba(0,0,0,0.2),0_20px_40px_rgba(0,0,0,0.4)] border-t border-x border-white/20 border-b-[12px] border-b-black/20 relative overflow-visible
            flex flex-col justify-center cursor-pointer
            p-6 md:p-10 group
          `}
          onClick={() => {
            setExpandedId(isExpanded ? null : block.id);
            playClick();
          }}
        >
        {/* Dynamic 3D Spotlight (Follows Mouse) */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
          style={{
            background: `radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.4), transparent 40%)`
          }}
        />

        {/* LEGO Studs Detail - Refined 3D Cylinders */}
        <div className="absolute top-0 left-0 w-full flex justify-around px-8 md:px-12 -mt-4 z-20">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`w-12 h-6 rounded-t-xl ${blockColor} border-t border-x border-white/40 shadow-[inset_0_4px_6px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.4)] relative transition-all duration-300 group-hover:-translate-y-1 overflow-hidden`}>
              {/* Cylindrical Highlights */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              <div 
                className={`absolute inset-0 flex items-center justify-center opacity-80 text-[6px] font-black tracking-tighter ${blockTextColor}`}
                style={{ textShadow: isDarkMode ? '0px 1px 1px rgba(255,255,255,0.2), 0px -1px 1px rgba(0,0,0,0.8)' : '0px 1px 1px rgba(255,255,255,0.8), 0px -1px 1px rgba(0,0,0,0.3)' }}
              >
                B R I C K
              </div>
            </div>
          ))}
        </div>

        {/* Hover Blueprint Tooltip - Refined to look like a professional callout */}
        <div className="absolute top-10 left-6 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 transform -translate-x-4 group-hover:translate-x-0">
          <div className="flex items-center">
            <div className={`px-2 py-1 rounded-sm border shadow-xl flex items-center gap-2 ${
              isDarkMode 
                ? 'bg-blue-600/60 border-blue-400/50 text-blue-100' 
                : 'bg-blue-600 border-blue-700 text-white'
            }`}>
              <Ruler size={10} className="animate-pulse" />
              <div className="flex flex-col leading-none">
                <span className="text-[7px] font-mono font-black uppercase tracking-tighter opacity-70">Brick Spec</span>
                <span className="text-[9px] font-mono font-bold whitespace-nowrap">
                  TYPE: {index === 0 ? 'BASEPLATE' : 'BRICK_2x4'}
                </span>
              </div>
            </div>
            {/* Blueprint Leader Line */}
            <div className={`w-6 h-px ${isDarkMode ? 'bg-blue-400/40' : 'bg-blue-600/60'}`} />
          </div>
        </div>

        {/* Right Side Callout */}
        <div className="absolute bottom-10 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 transform translate-x-4 group-hover:translate-x-0">
          <div className="flex items-center">
            <div className={`w-6 h-px ${isDarkMode ? 'bg-blue-400/40' : 'bg-blue-600/60'}`} />
            <div className={`px-2 py-1 rounded-sm border shadow-xl flex items-center gap-2 ${
              isDarkMode 
                ? 'bg-blue-600/60 border-blue-400/50 text-blue-100' 
                : 'bg-blue-600 border-blue-700 text-white'
            }`}>
              <Hammer size={10} className="animate-bounce" />
              <div className="flex flex-col leading-none">
                <span className="text-[7px] font-mono font-black uppercase tracking-tighter opacity-70">Material Spec</span>
                <span className="text-[9px] font-mono font-bold whitespace-nowrap">
                  ABS_POLYMER: {index === 0 ? 'REINFORCED' : 'STANDARD'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Click to Build Indicator */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 translate-y-2 group-hover:translate-y-0">
          <div className={`px-3 py-1 rounded-full border text-[9px] font-mono font-black uppercase tracking-widest shadow-lg flex items-center gap-2 ${
            isDarkMode ? 'bg-neutral-900 border-neutral-700 text-neutral-400' : 'bg-white border-neutral-200 text-neutral-500'
          }`}>
            <Sparkles size={10} className="text-yellow-500" />
            Click to Expand Spec
          </div>
        </div>

        {/* LEGO Brand Stamp - Contained perfectly within the block's borders */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.07] -rotate-12 select-none transition-opacity group-hover:opacity-[0.12] flex justify-center`}>
            <div className="border-[8px] md:border-[12px] border-current px-6 py-3 md:px-8 md:py-4 rounded-[2rem] text-5xl md:text-6xl font-black uppercase tracking-tighter whitespace-nowrap">
              {block.stamp}
            </div>
          </div>
        </div>
        
        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <p className="text-xs font-mono font-bold opacity-60 bg-black/20 px-2 py-0.5 rounded">{block.year}</p>
              {block.location && (
                <span className="flex items-center gap-1 text-[10px] opacity-40 uppercase tracking-widest font-bold">
                  <MapPin size={10} /> {block.location}
                </span>
              )}
            </div>
            <h4 className="text-xl md:text-4xl font-serif font-black tracking-tight mb-1 uppercase">{block.title}</h4>
            <p className="text-sm md:text-lg opacity-80 font-bold italic">{block.subtitle}</p>
          </div>
          <div className="flex flex-col items-end gap-4">
            <motion.div 
              animate={{ 
                scale: isExpanded ? 1.2 : 1,
                rotate: isExpanded ? [0, -10, 10, 0] : 0
              }}
              className="text-5xl md:text-6xl filter drop-shadow-2xl"
            >
              {block.icon}
            </motion.div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="opacity-40 p-2 rounded-full bg-black/10"
            >
              <ChevronDown size={20} />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <>
              {/* Measuring Lines Animation */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -inset-8 pointer-events-none z-0"
              >
                {/* Horizontal measuring line */}
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className={`absolute top-1/2 left-0 right-0 h-px ${isDarkMode ? 'bg-blue-400/20' : 'bg-blue-600/20'} origin-left`}
                />
                {/* Vertical measuring line */}
                <motion.div 
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  className={`absolute left-1/2 top-0 bottom-0 w-px ${isDarkMode ? 'bg-blue-400/20' : 'bg-blue-600/20'} origin-top`}
                />
                {/* Corner callouts */}
                <div className={`absolute top-0 left-0 text-[6px] font-mono ${isDarkMode ? 'text-blue-400/40' : 'text-blue-600/40'}`}>X: 0.00</div>
                <div className={`absolute bottom-0 right-0 text-[6px] font-mono ${isDarkMode ? 'text-blue-400/40' : 'text-blue-600/40'}`}>Y: 1.00</div>
              </motion.div>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                className="overflow-hidden"
              >
              <div className={`mt-6 relative z-10 rounded-2xl border-x-[12px] border-b-[12px] border-t-[4px] border-black/50 shadow-[inset_0_20px_60px_rgba(0,0,0,1)] overflow-hidden ${isDarkMode ? 'bg-neutral-950' : 'bg-neutral-900'}`}>
                {/* Internal "Tubes" pattern - Authentic LEGO underside look */}
                <div className="absolute inset-0 opacity-80" style={{
                  backgroundImage: `
                    radial-gradient(circle at 24px 24px, rgba(0,0,0,0.95) 18%, transparent 19%),
                    radial-gradient(circle at 24px 24px, transparent 18%, rgba(255,255,255,0.05) 19%, rgba(255,255,255,0.05) 28%, transparent 29%),
                    radial-gradient(circle at 24px 24px, transparent 28%, rgba(0,0,0,0.7) 32%, transparent 33%),
                    radial-gradient(circle at 22px 22px, rgba(255,255,255,0.1) 18%, transparent 22%)
                  `,
                  backgroundSize: '48px 48px',
                  backgroundPosition: '0 0'
                }} />
                
                {/* Structural Ribs */}
                <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: '48px 48px'
                }} />
                
                {/* Ambient Depth Shadow */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

                {/* Blueprint Inner Container - Increased margin to show more "inside" */}
                <div className={`m-6 relative z-10 rounded-xl border-2 overflow-hidden ${isDarkMode ? 'bg-blue-950/90 border-blue-500/30' : 'bg-blue-900/90 border-blue-400/30'} shadow-2xl`}>
                  {/* Blueprint Grid Background */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `
                      linear-gradient(to right, white 1px, transparent 1px),
                      linear-gradient(to bottom, white 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }} />
                  
                  {/* Blueprint Technical Header */}
                  <div className="relative z-10 flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      <span className="text-[8px] font-mono font-black text-blue-200 uppercase tracking-[0.2em]">Technical Specification // {block.id.toUpperCase()}</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-white/20" />
                      <div className="w-1 h-1 bg-white/20" />
                      <div className="w-1 h-1 bg-white/20" />
                    </div>
                  </div>

                  <div className="p-6 relative z-10">
                    {/* Blueprint Callouts */}
                    <div className="absolute top-4 right-4 flex flex-col items-end gap-1 opacity-40">
                      <div className="text-[7px] font-mono text-blue-200 uppercase">Tolerance: ±0.01mm</div>
                      <div className="text-[7px] font-mono text-blue-200 uppercase">Material: ABS_POLYMER</div>
                      <div className="text-[7px] font-mono text-blue-200 uppercase">Scale: 1:1</div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-1">
                        <p className="text-sm md:text-xl leading-relaxed font-bold text-white mb-4 font-mono">
                          <span className="text-blue-400 mr-2 opacity-50">01.</span>
                          {block.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="p-3 rounded bg-white/5 border border-white/10">
                            <div className="text-[8px] font-mono text-blue-300 uppercase mb-1">Structural Integrity</div>
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '98%' }}
                                className="h-full bg-blue-400"
                              />
                            </div>
                          </div>
                          <div className="p-3 rounded bg-white/5 border border-white/10">
                            <div className="text-[8px] font-mono text-blue-300 uppercase mb-1">Complexity Rating</div>
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '85%' }}
                                className="h-full bg-cyan-400"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-32 flex flex-col gap-2">
                        <div className="aspect-square rounded border border-white/10 bg-white/5 flex items-center justify-center relative group/qr">
                          <div className="text-4xl opacity-40 group-hover:opacity-100 transition-opacity">
                            {block.blueprintIcon || block.icon}
                          </div>
                          <div className="absolute inset-0 border-[1px] border-blue-400/20 m-1" />
                        </div>
                        <div className="text-[7px] font-mono text-blue-300/50 text-center uppercase tracking-tighter">
                          ID: {block.id}-{Math.random().toString(36).substring(2, 6).toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {block.id === 'law' && (
                      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white font-mono text-[9px] font-black uppercase tracking-widest">
                          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                          ASSEMBLY_IN_PROGRESS // JD_CANDIDATE
                        </div>
                        <div className="text-[8px] font-mono text-white/30">REV_02.2026</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Blueprint Corner Marks */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/20" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/20" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/20" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/20" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
        
        {/* Plastic Gloss Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none rounded-2xl" />
        <div className="absolute top-2 left-2 right-2 h-1 bg-white/30 rounded-full blur-[1px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-black/20 rounded-b-2xl pointer-events-none" />
        </motion.div>
      </motion.div>

      {/* Architectural Dimension Lines */}
      <div className={`absolute -bottom-2 left-0 w-full flex items-center justify-between px-4 opacity-10 pointer-events-none`}>
        <div className="h-4 w-px bg-current" />
        <div className="h-px flex-1 bg-current mx-2" />
        <div className="text-[8px] font-mono font-bold">{block.id === 'foundation' ? '100%' : 'VARIES'}</div>
        <div className="h-px flex-1 bg-current mx-2" />
        <div className="h-4 w-px bg-current" />
      </div>
    </motion.div>
  );
}, (prev, next) => {
  return prev.expandedId === next.expandedId && prev.isDarkMode === next.isDarkMode;
});

export default function CareerArchitecture({ isDarkMode, globalMute = false }: { isDarkMode?: boolean, globalMute?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const audioCtxRef = useRef(audioCtx);
  audioCtxRef.current = audioCtx;
  const globalMuteRef = useRef(globalMute);
  globalMuteRef.current = globalMute;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"]
  });

  const springScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  useEffect(() => {
    const initAudio = () => {
      if (!audioCtx) {
        setAudioCtx(new (window.AudioContext || (window as any).webkitAudioContext)());
      }
    };
    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, [audioCtx]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Collapse if we scroll away from the section
        if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
          setExpandedId(null);
        }
      },
      { threshold: [0, 0.2] }
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

  const playClick = React.useCallback(() => {
    if (globalMuteRef.current || !audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, audioCtxRef.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtxRef.current.currentTime + 0.05);
    gain.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + 0.05);
  }, []);

  return (
    <div ref={containerRef} className="py-16 relative w-full max-w-5xl mx-auto flex flex-col items-center overflow-hidden">
      {/* Blueprint Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-grid-white/[0.05]' : 'bg-grid-black/[0.05]'}`} />
        <motion.div 
          style={{ scaleY: springScroll }}
          className={`absolute left-1/2 top-0 w-px h-full ${isDarkMode ? 'bg-blue-500/30' : 'bg-blue-500/20'} origin-top`} 
        />
        <div className="absolute top-1/4 left-0 w-full h-px bg-blue-500/10" />
        <div className="absolute top-2/4 left-0 w-full h-px bg-blue-500/10" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-blue-500/10" />
        
        {/* Whimsical Blueprint Icons */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 text-blue-500/10"
        >
          <Ruler size={120} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 text-blue-500/10"
        >
          <Hammer size={100} />
        </motion.div>

        {/* Technical Annotations */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[8px] font-mono text-blue-500/20 vertical-text uppercase tracking-widest hidden lg:block">
          Drafting_Sheet_01 // Project_Evolution // Scale_1:1
        </div>
        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-[8px] font-mono text-blue-500/20 vertical-text uppercase tracking-widest hidden lg:block">
          Rev_2026_03_22 // Auth_Nathan_Gruen // Status_Active
        </div>
      </div>

      <div className="text-center mb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
        >
          <Construction size={12} /> System Assembly in Progress
        </motion.div>
        <div 
          className="text-neutral-300 font-bold text-5xl mb-2 opacity-20 select-none"
          style={{ fontFamily: '"Noto Serif JP", serif' }}
        >
          経歴
        </div>
        <h3 className={`text-4xl md:text-5xl font-serif font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Career Architecture</h3>
        <div className="flex items-center justify-center gap-8 text-[10px] font-mono text-neutral-500 uppercase tracking-[0.3em]">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-blue-500" />
            Scale: 1:1
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-blue-500" />
            Rev: 2026.03
          </div>
          <div className="flex items-center gap-2 text-blue-500/60">
            <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
            Live Build
          </div>
        </div>
      </div>
      
      <div className="relative w-full flex flex-col-reverse gap-4 px-4 md:px-12">
        {blocks.map((block, index) => (
          <CareerBlock 
            key={block.id}
            block={block}
            index={index}
            totalBlocks={blocks.length}
            isDarkMode={isDarkMode}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            mouseX={mouseX}
            mouseY={mouseY}
            springScroll={springScroll}
            playClick={playClick}
            handleMouseMove={handleMouseMove}
          />
        ))}
      </div>

      {/* Whimsical Footer Annotation */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-20 text-center relative z-10"
      >
        <div className={`inline-block px-6 py-3 rounded-2xl ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-100'} border shadow-xl`}>
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-[0.3em]">Architecture Complete</p>
          <div className="flex justify-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

