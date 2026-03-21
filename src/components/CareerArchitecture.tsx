import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ChevronDown, MapPin } from 'lucide-react';

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
    icon: '🏛️'
  },
  {
    id: 'creative',
    title: 'Creative Strategy',
    subtitle: 'American Dream Mall',
    year: '2021',
    location: 'East Rutherford, NJ',
    description: 'Consulted with VP of Theme Park Development on creative strategy for successfully constructed Paw Patrol attraction. Drafted comprehensive script for Avatar: The Last Airbender motion simulator ride reviewed by park leadership.',
    color: 'bg-neutral-200',
    textColor: 'text-neutral-900',
    width: 'w-[80%] md:w-[40%]',
    height: 'min-h-[110px]',
    align: 'self-start md:ml-[10%]',
    icon: '🎢'
  },
  {
    id: 'analysis',
    title: 'Rigorous Analysis',
    subtitle: 'Rabbinic Ordination',
    year: '2022-2024',
    location: 'Lakewood, NJ',
    description: 'Intensive graduate-level study of Jewish law involving rigorous textual analysis and application of complex legal frameworks. Successfully established and completed a semichah program.',
    color: 'bg-neutral-300',
    textColor: 'text-neutral-900',
    width: 'w-[90%] md:w-[50%]',
    height: 'min-h-[110px]',
    align: 'self-end md:mr-[15%] -mt-4',
    icon: '📜'
  },
  {
    id: 'tech',
    title: 'Tech & Design',
    subtitle: 'BrandWhatever',
    year: '2024',
    location: 'Brooklyn, NY',
    description: 'Collaborated with senior design staff to produce digital and print advertising materials. Gained proficiency in AI technologies by training Stable Diffusion models for creative asset generation.',
    color: 'bg-neutral-900',
    textColor: 'text-white',
    width: 'w-[85%] md:w-[45%]',
    height: 'min-h-[120px]',
    align: 'self-center md:ml-[5%] -mt-6',
    icon: '🤖'
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
    icon: '⚖️'
  }
];

export default function CareerArchitecture() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"]
  });

  return (
    <div ref={containerRef} className="py-16 relative w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="text-center mb-16 flex flex-col items-center">
        <div className="text-neutral-300 font-bold text-2xl mb-2">経歴</div>
        <h3 className="text-3xl font-serif font-medium mb-2">Career Architecture</h3>
        <p className="text-neutral-500 text-sm uppercase tracking-widest font-semibold">Building the Foundation</p>
      </div>
      
      <div className="relative w-full flex flex-col-reverse gap-2 px-4">
        {blocks.map((block, index) => {
          const yOffset = useTransform(scrollYProgress, [0, 1], [100 * (blocks.length - index), 0]);
          const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
          const isExpanded = expandedId === block.id;

          return (
            <motion.div
              key={block.id}
              style={{ y: yOffset, opacity, zIndex: index * 10 }}
              layout
              className={`
                ${block.width} ${block.color} ${block.textColor} ${block.align}
                rounded-xl shadow-lg border border-white/10 relative overflow-hidden
                flex flex-col justify-center transition-all hover:scale-[1.01] cursor-pointer
                p-6 md:p-8
              `}
              onClick={() => setExpandedId(isExpanded ? null : block.id)}
            >
              {/* Subtle top studs */}
              {index !== blocks.length - 1 && (
                <div className="absolute top-0 left-0 w-full flex justify-around px-8 -mt-2 opacity-20">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-4 rounded-t-lg bg-current" />
                  ))}
                </div>
              )}
              
              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-mono opacity-70">{block.year}</p>
                    {block.location && (
                      <span className="flex items-center gap-0.5 text-[10px] opacity-50 uppercase tracking-tighter">
                        <MapPin size={10} /> {block.location}
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg md:text-xl font-bold tracking-tight">{block.title}</h4>
                  <p className="text-sm opacity-90 font-light">{block.subtitle}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-3xl opacity-80 mix-blend-luminosity">
                    {block.icon}
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="opacity-40"
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 border-t border-current/10 mt-4">
                      <p className="text-sm leading-relaxed opacity-80 font-light">
                        {block.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Glass reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 pointer-events-none" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
