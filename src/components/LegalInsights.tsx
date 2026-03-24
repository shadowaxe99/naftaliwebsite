import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, ChevronRight, BookOpen, Globe, Shield } from 'lucide-react';
import { playUISound } from '../utils/sound';

interface LegalInsightsProps {
  isDarkMode: boolean;
  globalMute: boolean;
}

export default function LegalInsights({ isDarkMode, globalMute }: LegalInsightsProps) {
  const [expandedBrief, setExpandedBrief] = useState<string | null>(null);
  const [expandedDossier, setExpandedDossier] = useState<number | null>(null);
  
  const caseFilesContainerRef = useRef<HTMLDivElement>(null);
  const strategyContainerRef = useRef<HTMLDivElement>(null);
  const caseFileRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const strategyItemRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const toggleBrief = (id: string) => {
    if (expandedBrief === id) {
      setExpandedBrief(null);
      playUISound('collapse', globalMute);
    } else {
      setExpandedBrief(id);
      playUISound('expand', globalMute);
      
      // Auto-scroll after a short delay to allow animation to start
      setTimeout(() => {
        caseFileRefs.current[id]?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest',
          inline: 'nearest'
        });
      }, 100);
    }
  };

  const toggleDossier = (index: number) => {
    if (expandedDossier === index) {
      setExpandedDossier(null);
      playUISound('collapse', globalMute);
    } else {
      setExpandedDossier(index);
      playUISound('expand', globalMute);
      
      // Auto-scroll after a short delay
      setTimeout(() => {
        strategyItemRefs.current[index]?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest',
          inline: 'nearest'
        });
      }, 100);
    }
  };

  const caseFiles = [
    {
      id: '2026-CR-01',
      date: 'MARCH 2026',
      category: 'COPYRIGHT',
      status: 'PUBLISHED',
      title: 'The Ghost in the Machine: AI Training Data',
      subtitle: "Analyzing the industrialization of human expression and the 'transformation' of cultural heritage into proprietary weights.",
      brief: "We are witnessing the industrialization of human expression. The legal question isn't just about 'copying'—it's about the 'transformation' of a collective cultural heritage into proprietary algorithmic weights. If the law fails to recognize the 'human-in-the-loop' as the primary source of value, we risk a future where the echo is louder than the voice. We must redefine 'Fair Use' for an era where consumption is performed by silicon, not souls."
    },
    {
      id: '2026-TM-04',
      date: 'JANUARY 2026',
      category: 'TRADEMARK',
      status: 'UNDER REVIEW',
      title: 'Digital Sovereignty: The Virtual Borderlands',
      subtitle: "How brand identity survives when physical reality is optional and 'origin' becomes a fluid, decentralized concept.",
      brief: "A trademark is a promise of origin. In a decentralized metaverse, 'origin' becomes a fluid concept. We must move beyond the 'likelihood of confusion' in the physical sense and toward a 'likelihood of dilution' in the experiential sense. Your brand isn't just a logo anymore; it's a verified coordinate in a digital multiverse. Protecting a brand in 3D space requires a 4D legal strategy that accounts for time, space, and user-generated reality."
    },
    {
      id: '2026-JP-09',
      date: 'FEBRUARY 2026',
      category: 'LICENSING',
      status: 'ARCHIVED',
      title: 'Cultural Alchemy: The Transpacific IP Bridge',
      subtitle: "Navigating the clash between Japanese 'Moral Rights' and Western 'Economic Rights' in global media distribution.",
      brief: "Japanese IP is built on a foundation of 'Moral Rights' that often clash with Western 'Economic Rights.' Navigating this requires more than just a translation of words; it requires a translation of intent. To protect a character like a Pokémon or a Studio Ghibli spirit is to protect a piece of a nation's soul in a global marketplace. The 'Transpacific Bridge' isn't just about contracts; it's about the legal stewardship of cultural mythology."
    },
    {
      id: '2025-PR-11',
      date: 'NOVEMBER 2025',
      category: 'PRIVACY',
      status: 'PUBLISHED',
      title: 'The Architecture of Anonymity',
      subtitle: "Designing legal frameworks for data privacy in an era of ubiquitous surveillance and ambient computing.",
      brief: "Privacy is no longer just about hiding; it's about controlling the flow of information. As ambient computing integrates into the physical world, the legal definition of 'personal data' must expand to include behavioral exhaust. We need an architecture of anonymity that protects the user's right to be unobserved in a hyper-connected environment."
    },
    {
      id: '2025-AI-07',
      date: 'JULY 2025',
      category: 'ARTIFICIAL INTELLIGENCE',
      status: 'ARCHIVED',
      title: 'Algorithmic Liability',
      subtitle: "Determining fault when autonomous systems make decisions that impact human lives and livelihoods.",
      brief: "When an algorithm makes a mistake, who is liable? The programmer, the user, or the machine itself? As AI systems become more autonomous, the chain of causation becomes opaque. We must develop new legal doctrines that allocate risk and responsibility in a way that encourages innovation while protecting the public from algorithmic harm."
    }
  ];

  return (
    <section id="insights" className="py-24 relative overflow-hidden rounded-[3rem] my-12">
      {/* Blueprint Background Layer */}
      <div className="absolute inset-0 bg-blueprint z-0" />
      
      {/* Technical Border Overlay */}
      <div className="absolute inset-4 border border-white/20 pointer-events-none z-10" />
      
      {/* Corner Callouts */}
      <div className="absolute top-8 left-8 text-[10px] font-mono text-white/40 z-10 uppercase tracking-widest">Sheet No. 03 // Legal Architecture</div>
      <div className="absolute top-8 right-8 text-[10px] font-mono text-white/40 z-10 uppercase tracking-widest">Rev. 2026.03.22</div>
      <div className="absolute bottom-8 left-8 text-[10px] font-mono text-white/40 z-10 uppercase tracking-widest">Scale: 1:1 // Metric</div>
      <div className="absolute bottom-8 right-8 text-[10px] font-mono text-white/40 z-10 uppercase tracking-widest">Auth: Nathan Gruen</div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-[10px] font-mono font-bold uppercase tracking-[0.3em] mb-6">
              <FileText size={12} /> Legal Analysis & Strategy
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-medium text-white tracking-tight">
              IP & Entertainment Law
            </h2>
          </div>
          <div className="text-right hidden md:block">
            <p 
              className="text-5xl font-bold text-white/10 tracking-widest select-none" 
              style={{ fontFamily: '"Noto Serif JP", serif' }}
            >
              法的洞察
            </p>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Case Files (Fig. 1) */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2rem] p-8 h-[600px] relative overflow-hidden flex flex-col shadow-2xl group">
            {/* Drafting Crosshairs */}
            <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-white/30 opacity-50" />
            <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-white/30 opacity-50" />
            <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-white/30 opacity-50" />
            <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-white/30 opacity-50" />

            <div className="relative z-10 flex flex-col h-full">
              {/* Header */}
              <div className="mb-6 shrink-0">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-[0.2em]">Fig. 1 // Archive</p>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Ref: 2026-CASE-LIB</p>
                </div>
                <h3 className="text-3xl font-serif font-medium text-white">
                  Case Files
                </h3>
                <div className="w-full h-px mt-4 bg-white/10" />
              </div>

              {/* Scrollable Content */}
              <div 
                ref={caseFilesContainerRef}
                className="space-y-4 overflow-y-scroll pr-4 custom-scrollbar flex-1"
              >
                {caseFiles.map((file) => (
                  <div 
                    key={file.id}
                    ref={(el) => (caseFileRefs.current[file.id] = el)}
                    onClick={() => toggleBrief(file.id)}
                    className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer ${
                      expandedBrief === file.id 
                        ? 'bg-white/10 border-cyan-500/50 shadow-[inset_4px_0_0_rgba(34,211,238,1)]' 
                        : 'bg-white/5 border-white/10 hover:border-white/20 hover:shadow-[inset_4px_0_0_rgba(34,211,238,0.5)]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{file.id}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{file.date}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest ${
                        file.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        file.status === 'UNDER REVIEW' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {file.status}
                      </span>
                    </div>

                    <h4 className="text-xl font-serif font-medium mb-2 text-white">
                      {file.title}
                    </h4>
                    <p className="text-white/60 text-xs leading-relaxed mb-4">
                      {file.subtitle}
                    </p>

                    <div 
                      className={`flex items-center justify-between w-full mt-4 pt-4 border-t border-white/5 group/btn transition-colors ${
                        expandedBrief === file.id ? 'text-cyan-400' : 'text-white/40 group-hover:text-white'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">
                        {expandedBrief === file.id ? 'Close Brief' : 'Read Brief'}
                      </span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        expandedBrief === file.id ? 'border-cyan-500 text-cyan-400 rotate-45' : 'border-white/20 text-white/40 group-hover/btn:border-white/40'
                      }`}>
                        <ChevronRight size={12} className={expandedBrief === file.id ? 'rotate-90' : ''} />
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedBrief === file.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-white/10 border-dashed relative">
                            <p className="text-cyan-100/80 text-sm leading-relaxed font-serif italic">
                              {file.brief}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Japanese IP Strategy (Fig. 2) */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2rem] p-8 h-[600px] relative overflow-hidden flex flex-col shadow-2xl group">
            {/* Drafting Crosshairs */}
            <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-white/30 opacity-50" />
            <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-white/30 opacity-50" />
            <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-white/30 opacity-50" />
            <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-white/30 opacity-50" />
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Header */}
              <div className="mb-6 shrink-0">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-[0.2em]">Fig. 2 // Strategy</p>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Ref: J-IP-2026</p>
                </div>
                <h3 className="text-3xl font-serif font-medium mb-2 text-white">
                  Japanese IP Strategy
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Navigating the unique legal intersection where Japanese creative heritage meets global market frameworks.
                </p>
                <div className="w-full h-px mt-4 bg-white/10" />
              </div>

              {/* Scrollable Content */}
              <div 
                ref={strategyContainerRef}
                className="space-y-4 overflow-y-scroll pr-4 custom-scrollbar flex-1"
              >
                {[
                  {
                    icon: '📚',
                    title: 'Manga & Anime Licensing',
                    subtitle: 'International distribution & sub-licensing frameworks.',
                    content: "Licensing isn't just a contract; it's a cultural transmission protocol. We aren't just selling 'content'; we're exporting a narrative architecture that defines how the world perceives Japanese creativity. The legal challenge is ensuring the integrity of the 'Source Code' while allowing for the 'Forking' of local adaptations."
                  },
                  {
                    icon: '👾',
                    title: 'Character Rights',
                    subtitle: 'Global protection of iconic Japanese IP assets.',
                    content: "A character is more than a drawing; it's a set of behaviors, a history, and a brand promise. In the age of digital replication, we must protect the 'Essence' of the IP. This means legal frameworks that recognize the character as a living asset, capable of evolving across media while remaining anchored to its origin."
                  },
                  {
                    icon: '⛩️',
                    title: 'Localization Law',
                    subtitle: 'Legal nuances in cross-cultural adaptation.',
                    content: "Localization is a legal act of translation. It's about navigating the 'Uncanny Valley' of cultural mismatch. We must ensure that the 'Spirit' of the work survives the 'Letter' of the law in a new territory. It's the art of making the foreign feel familiar without losing the magic of its difference."
                  }
                ].map((item, index) => {
                  const isMiddle = index === 1;
                  const isExpanded = expandedDossier === index;

                  return (
                    <div 
                      key={index} 
                      ref={(el) => (strategyItemRefs.current[index] = el)}
                      onClick={() => toggleDossier(index)}
                      className={`rounded-2xl border transition-all duration-300 relative cursor-pointer ${
                        isExpanded 
                          ? 'bg-white/10 border-cyan-500/50 shadow-[inset_4px_0_0_rgba(34,211,238,1)]' 
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:shadow-[inset_4px_0_0_rgba(34,211,238,0.5)]'
                      }`}
                    >
                      {/* Expanded Content for Middle Item (Expands ABOVE) */}
                      <AnimatePresence>
                        {isExpanded && isMiddle && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pt-5 pb-2 ml-[68px] relative">
                              <div className="absolute left-[-24px] top-8 bottom-0 w-px border-l border-dashed border-cyan-500/30" />
                              
                              <div className="flex items-center justify-between mb-4 border-b border-cyan-500/30 pb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">Dossier Detail // {item.title}</span>
                                </div>
                              </div>

                              <p className="text-xs leading-relaxed text-cyan-50 font-serif italic">
                                {item.content}
                              </p>

                              <div className="mt-6 pt-4 flex justify-between items-end">
                                <div className="space-y-1">
                                  <div className="text-[8px] font-mono text-cyan-500/40 uppercase">Classification</div>
                                  <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-tighter">Top Secret // Level {4 + index}</div>
                                </div>
                                <div className="text-[8px] font-mono text-cyan-500/50 uppercase tracking-widest">End_of_Transmission</div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div 
                        className={`w-full flex items-center justify-between p-5 text-left group/item ${isExpanded && isMiddle ? 'border-t border-cyan-500/20 mt-2' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 ${
                            isExpanded
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 scale-110'
                              : 'bg-white/5 text-white border-white/10 group-hover/item:scale-105'
                          }`}>
                            {item.icon}
                          </div>
                          <div>
                            <h4 className={`font-serif font-medium mb-1 transition-colors ${
                              isExpanded ? 'text-cyan-400' : 'text-white'
                            }`}>{item.title}</h4>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">{item.subtitle}</p>
                          </div>
                        </div>
                        
                        {/* Expansion Indicator */}
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          isExpanded ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'border-white/20 text-white/40 group-hover/item:border-white/40'
                        }`}>
                          <ChevronRight size={14} className={`transition-transform duration-300 ${isExpanded ? (isMiddle ? '-rotate-90' : 'rotate-90') : ''}`} />
                        </div>
                      </div>
                      
                      {/* Expanded Content for Normal Items (Expands BELOW) */}
                      <AnimatePresence>
                        {isExpanded && !isMiddle && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-2 ml-[68px] relative">
                              <div className="absolute left-[-24px] top-0 bottom-5 w-px border-l border-dashed border-cyan-500/30" />
                              <div className="absolute left-[-24px] top-4 w-4 h-px border-t border-dashed border-cyan-500/30" />
                              
                              <div className="flex items-center justify-between mb-4 border-b border-cyan-500/30 pb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">Dossier Detail // {item.title}</span>
                                </div>
                              </div>

                              <p className="text-xs leading-relaxed text-cyan-50 font-serif italic">
                                {item.content}
                              </p>

                              <div className="mt-6 pt-4 border-t border-cyan-500/20 flex justify-between items-end">
                                <div className="space-y-1">
                                  <div className="text-[8px] font-mono text-cyan-500/40 uppercase">Classification</div>
                                  <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-tighter">Top Secret // Level {4 + index}</div>
                                </div>
                                <div className="text-[8px] font-mono text-cyan-500/50 uppercase tracking-widest">End_of_Transmission</div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>

  );
}
