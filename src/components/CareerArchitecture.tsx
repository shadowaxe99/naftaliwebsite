import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'motion/react';
import { ChevronDown, MapPin, Ruler, Hammer, PenTool, Sparkles, Construction } from 'lucide-react';

const blocks = [
  {
    id: 'foundation',
    title: 'Foundation',
    subtitle: 'Excelsior University',
    year: '2021-2024',
    location: 'Albany, NY',
    description: 'Recipient of the U.S. Presidential Academic Excellence Award. Focused on liberal arts with a strong emphasis on textual analysis and critical thinking.',
    color: 'bg-neutral-800',
    textColor: 'text-white',
    width: 'w-full md:w-[60%]',
    height: 'min-h-[120px]',
    align: 'self-center',
    icon: '🏛️',
    stamp: 'APPROVED'
  },
  {
    id: 'creative',
    title: 'Creative Strategy',
    subtitle: 'American Dream Mall',
    year: '2021',
    location: 'East Rutherford, NJ',
    description: 'Consulted with VP of Theme Park Development on creative strategy for successfully constructed PAW Patrol attraction. Drafted comprehensive script for Avatar: The Last Airbender motion simulator ride reviewed by park leadership.',
    color: 'bg-neutral-200',
    textColor: 'text-neutral-900',
    width: 'w-[80%] md:w-[40%]',
    height: 'min-h-[110px]',
    align: 'self-start md:ml-[10%]',
    icon: '🎢',
    annotation: 'IMAGINATION',
    stamp: 'CREATIVE'
  },
  {
    id: 'analysis',
    title: 'Rigorous Analysis',
    subtitle: 'Rabbinic Ordination',
    year: '2022-2024',
    location: 'Lakewood, NJ',
    description: 'Intensive graduate-level study of Jewish law involving rigorous textual analysis and application of complex legal frameworks. Specialized in intricate reasoning, such as the laws of mixtures (Ta’aruvos) and procedural prohibitions (Shabbos).',
    color: 'bg-neutral-300',
    textColor: 'text-neutral-900',
    width: 'w-[90%] md:w-[50%]',
    height: 'min-h-[110px]',
    align: 'self-end md:mr-[15%] -mt-4',
    icon: '📜',
    annotation: 'DEEP DIVE',
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
    width: 'w-[85%] md:w-[45%]',
    height: 'min-h-[120px]',
    align: 'self-center md:ml-[5%] -mt-6',
    icon: '🤖',
    annotation: 'FUTURE-PROOF',
    stamp: 'BETA'
  },
  {
    id: 'law',
    title: 'Legal Frameworks',
    subtitle: 'New York Law School',
    year: 'Entering Fall 2026',
    location: 'New York, NY',
    description: 'Juris Doctor (J.D.) Candidate. Building upon a foundation of rigorous analysis to specialize in Copyright & Trademark Law with a focus on Japanese Intellectual Property.',
    color: 'bg-emerald-600',
    textColor: 'text-white',
    width: 'w-full md:w-[55%]',
    height: 'min-h-[140px]',
    align: 'self-center -mt-8',
    icon: '⚖️',
    annotation: 'FINAL FORM',
    stamp: 'IN PROGRESS'
  }
];

export default function CareerArchitecture({ isDarkMode }: { isDarkMode?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"]
  });

  const springScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const initAudio = () => {
      if (!audioCtx) {
        setAudioCtx(new (window.AudioContext || (window as any).webkitAudioContext)());
      }
    };
    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, [audioCtx]);

  const playClick = () => {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  };

  return (
    <div ref={containerRef} className="py-24 relative w-full max-w-5xl mx-auto flex flex-col items-center overflow-hidden">
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
          className="absolute top-10 left-10 text-blue-500/20"
        >
          <Ruler size={120} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 text-blue-500/20"
        >
          <Hammer size={100} />
        </motion.div>
      </div>

      <div className="text-center mb-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
        >
          <PenTool size={12} /> Architecting the Future
        </motion.div>
        <div className="text-neutral-300 font-bold text-4xl mb-2 opacity-30">経歴</div>
        <h3 className={`text-4xl md:text-5xl font-serif font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Career Architecture</h3>
        <p className="text-neutral-500 text-sm uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
          <Sparkles size={14} className="text-yellow-500" /> 
          Building the Foundation 
          <Sparkles size={14} className="text-yellow-500" />
        </p>
      </div>
      
      <div className="relative w-full flex flex-col-reverse gap-4 px-4 md:px-12">
        {blocks.map((block, index) => {
          const yOffset = useTransform(springScroll, [0, 1], [150 * (blocks.length - index), 0]);
          const opacity = useTransform(springScroll, [0, 0.2], [0, 1]);
          const rotate = useTransform(springScroll, [0, 1], [index % 2 === 0 ? 5 : -5, 0]);
          const isExpanded = expandedId === block.id;

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
            <div key={block.id} className={`relative flex flex-col ${block.align} ${block.width}`}>
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
                layout
                whileHover={{ 
                  scale: 1.02,
                  rotate: index % 2 === 0 ? 1 : -1,
                  transition: { type: 'spring', stiffness: 400, damping: 10 }
                }}
                className={`
                  w-full ${blockColor} ${blockTextColor}
                  rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden
                  flex flex-col justify-center cursor-pointer
                  p-6 md:p-10 group
                `}
                onClick={() => {
                  setExpandedId(isExpanded ? null : block.id);
                  playClick();
                }}
              >
                {/* Hover Blueprint Tooltip - Refined to look like a professional callout */}
                <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 transform -translate-x-4 group-hover:translate-x-0">
                  <div className="flex items-center">
                    <div className={`px-2 py-1 rounded-sm border shadow-xl flex items-center gap-2 ${
                      isDarkMode 
                        ? 'bg-blue-600/40 border-blue-400/50 text-blue-100' 
                        : 'bg-blue-600 border-blue-700 text-white'
                    }`}>
                      <Ruler size={10} className="animate-pulse" />
                      <div className="flex flex-col leading-none">
                        <span className="text-[7px] font-mono font-black uppercase tracking-tighter opacity-70">Architectural Spec</span>
                        <span className="text-[9px] font-mono font-bold whitespace-nowrap">
                          DIM: {1200 + (index * 240)}mm x {600 + (index * 120)}mm
                        </span>
                      </div>
                    </div>
                    {/* Blueprint Leader Line */}
                    <div className={`w-6 h-px ${isDarkMode ? 'bg-blue-400/40' : 'bg-blue-600/60'}`} />
                  </div>
                </div>
                {/* LEGO Studs Detail */}
                <div className="absolute top-0 left-0 w-full flex justify-around px-12 -mt-3 opacity-30 group-hover:opacity-60 transition-opacity">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-10 h-6 rounded-t-xl bg-current shadow-inner" />
                  ))}
                </div>

                {/* Whimsical Stamp - Moved to background and lowered opacity */}
                <div className={`absolute top-1/2 right-12 -translate-y-1/2 opacity-[0.03] -rotate-12 pointer-events-none select-none transition-opacity group-hover:opacity-[0.07] z-0`}>
                  <div className="border-4 border-current px-4 py-2 rounded-lg text-6xl font-black uppercase tracking-tighter">
                    {block.stamp}
                  </div>
                </div>
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-xs font-mono font-bold opacity-60 bg-current/10 px-2 py-0.5 rounded">{block.year}</p>
                      {block.location && (
                        <span className="flex items-center gap-1 text-[10px] opacity-40 uppercase tracking-widest font-bold">
                          <MapPin size={10} /> {block.location}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xl md:text-3xl font-serif font-medium tracking-tight mb-1">{block.title}</h4>
                    <p className="text-sm md:text-base opacity-80 font-light italic">{block.subtitle}</p>
                  </div>
                  <div className="flex flex-col items-end gap-4">
                    <motion.div 
                      animate={{ 
                        scale: isExpanded ? 1.2 : 1,
                        rotate: isExpanded ? [0, -10, 10, 0] : 0
                      }}
                      className="text-4xl md:text-5xl filter drop-shadow-lg"
                    >
                      {block.icon}
                    </motion.div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="opacity-40 p-2 rounded-full bg-current/5"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-8 border-t border-current/10 mt-6 relative z-10">
                        {/* Whimsical Mini-icon - Moved to bottom right to avoid blocking words */}
                        <div className="absolute bottom-0 right-0 text-4xl opacity-10 pointer-events-none">
                          {block.id === 'law' ? <Construction size={48} /> : <Sparkles size={48} />}
                        </div>
                        <p className="text-sm md:text-lg leading-relaxed opacity-90 font-light max-w-2xl relative z-10">
                          {block.description}
                        </p>
                        
                        {block.id === 'law' && (
                          <div className="mt-6 flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest relative z-10">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Loading Future...
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Gloss reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20" />
              </motion.div>

              {/* Architectural Dimension Lines */}
              <div className={`absolute -bottom-2 left-0 w-full flex items-center justify-between px-4 opacity-10 pointer-events-none`}>
                <div className="h-4 w-px bg-current" />
                <div className="h-px flex-1 bg-current mx-2" />
                <div className="text-[8px] font-mono font-bold">{block.id === 'foundation' ? '100%' : 'VARIES'}</div>
                <div className="h-px flex-1 bg-current mx-2" />
                <div className="h-4 w-px bg-current" />
              </div>
            </div>
          );
        })}
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
