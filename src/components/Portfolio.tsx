import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  BookOpen, Briefcase, GraduationCap, Mail, MapPin, Phone, Globe, 
  Mic, PenTool, ChevronRight, Command, Search, Gamepad2,
  Download, ArrowUpRight, Terminal, Database, Code, Moon, Sun, FileText, Volume2, VolumeX
} from 'lucide-react';
import { Analytics } from "@vercel/analytics/react";
import ArcadeCard from './ArcadeCard';
import CareerArchitecture from './CareerArchitecture';
import ResumeModal from './ResumeModal';
import CopyButton from './CopyButton';

interface PortfolioProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Portfolio({ isDarkMode, toggleTheme }: PortfolioProps) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [resumeOpen, setResumeOpen] = useState(false);
  const [expandedInsightId, setExpandedInsightId] = useState<string | null>(null);
  const [isBookExpanded, setIsBookExpanded] = useState(false);
  const [isGlobalSoundOn, setIsGlobalSoundOn] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Cmd+K Listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Focus input when Cmd+K opens
  useEffect(() => {
    if (cmdOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setSearchQuery('');
    }
  }, [cmdOpen]);

  // Animations
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const float = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const shimmer = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-neutral-950 text-white selection:bg-blue-500/30' : 'bg-neutral-50 text-neutral-900 selection:bg-blue-200'} transition-colors duration-700 font-sans`}>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-blue-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Cmd+K Overlay */}
      <AnimatePresence>
        {cmdOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4"
            onClick={() => setCmdOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'} w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden`}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-neutral-800/10 flex items-center gap-4">
                <Search className="text-neutral-500" size={20} />
                <input 
                  ref={inputRef}
                  type="text" 
                  placeholder="Search projects, skills, or experience..." 
                  className="bg-transparent border-none outline-none w-full text-lg font-light"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-800/50 border border-neutral-700 text-[10px] font-mono text-neutral-500">
                  <span className="text-[12px]">ESC</span>
                </div>
              </div>
              <div className="p-4 max-h-[400px] overflow-y-auto">
                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest px-4 mb-4">Quick Actions</div>
                <button onClick={toggleTheme} className={`w-full flex items-center justify-between p-4 rounded-2xl ${isDarkMode ? 'hover:bg-neutral-800' : 'hover:bg-neutral-50'} transition-colors group`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
                      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </div>
                    <span className="font-medium">Switch to {isDarkMode ? 'Light' : 'Dark'} Mode</span>
                  </div>
                  <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button onClick={() => setResumeOpen(true)} className={`w-full flex items-center justify-between p-4 rounded-2xl ${isDarkMode ? 'hover:bg-neutral-800' : 'hover:bg-neutral-50'} transition-colors group`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
                      <Download size={18} />
                    </div>
                    <span className="font-medium">Download Resume</span>
                  </div>
                  <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isDarkMode ? 'bg-neutral-950/80' : 'bg-white/80'} backdrop-blur-xl border-b ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
              <span className="text-white font-serif font-bold text-xl">N</span>
            </div>
            <div className="hidden sm:block">
              <span className={`text-sm font-serif font-medium tracking-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Nathan Gruen</span>
              <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">J.D. Candidate</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2 sm:gap-8">
            <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              <a href="#about" className="hover:text-blue-500 transition-colors">About</a>
              <a href="#experience" className="hover:text-blue-500 transition-colors">Experience</a>
              <a href="#canvas" className="hover:text-blue-500 transition-colors">Playground</a>
              <a href="#contact" className="hover:text-blue-500 transition-colors">Contact</a>
            </div>
            
            <div className="h-6 w-px bg-neutral-800/10 hidden sm:block" />
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCmdOpen(true)}
                className={`p-2.5 rounded-xl ${isDarkMode ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-500'} transition-all group relative`}
                title="Search (Cmd+K)"
              >
                <Search size={18} />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-800 text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Search (⌘K)</span>
              </button>
              <a 
                href="#canvas"
                className={`p-2.5 rounded-xl ${isDarkMode ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-500'} transition-all group relative`}
                title="Interactive Playground"
              >
                <Gamepad2 size={18} />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-800 text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Playground</span>
              </a>
              <button 
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl ${isDarkMode ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-500'} transition-all`}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <section className="min-h-[85vh] flex flex-col justify-center py-20 relative">
            {/* Background Calligraphy - Nathan (ネイサン) */}
            <motion.div 
              variants={float}
              animate="animate"
              className={`absolute top-10 right-4 text-[12vw] font-bold pointer-events-none select-none z-0 transition-colors duration-700 ${isDarkMode ? 'text-white/[0.15]' : 'text-neutral-900/[0.1]'}`}
              style={{ fontFamily: '"Noto Serif JP", serif' }}
            >
              <motion.span variants={shimmer} animate="animate">ネイサン</motion.span>
            </motion.div>

            {/* Background Calligraphy - Copyright & Trademark Law (著作権と商標法) */}
            <motion.div 
              variants={float}
              animate="animate"
              className={`absolute bottom-10 left-4 text-[6vw] font-bold pointer-events-none select-none z-0 transition-colors duration-700 ${isDarkMode ? 'text-white/[0.12]' : 'text-neutral-900/[0.08]'}`}
              style={{ fontFamily: '"Noto Serif JP", serif' }}
            >
              <motion.span variants={shimmer} animate="animate">著作権と商標法</motion.span>
            </motion.div>

            <motion.div 
              variants={stagger} initial="initial" animate="animate"
              className="max-w-4xl relative z-10"
            >
              <motion.div variants={fadeIn} className="flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-blue-500" />
                <span className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.4em]">Intellectual Property Specialist</span>
              </motion.div>
              
              <motion.h1 variants={fadeIn} className={`text-6xl md:text-9xl font-serif font-medium mb-10 leading-[0.9] tracking-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                Bridging Law <br />
                <span className="text-neutral-500 italic">&</span> Creativity.
              </motion.h1>
              
              <motion.p variants={fadeIn} className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'} text-xl md:text-2xl font-light leading-relaxed mb-12 max-w-2xl`}>
                J.D. Candidate at New York Law School, specializing in Intellectual Property, Entertainment Law, and the evolving landscape of digital rights.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-wrap gap-6">
                <a 
                  href="#contact" 
                  className="px-8 py-4 bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/30 text-white rounded-2xl font-bold text-sm transition-all shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95"
                >
                  Get in Touch
                </a>
                <button 
                  onClick={() => setResumeOpen(true)}
                  className={`px-8 py-4 ${isDarkMode ? 'bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 text-white' : 'bg-black/5 backdrop-blur-md border-black/10 hover:bg-black/10 text-neutral-900'} border rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2`}
                >
                  <Download size={18} />
                  View Resume
                </button>
              </motion.div>
            </motion.div>

            {/* Hero Stats/Badges */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-10 right-0 hidden lg:flex gap-12"
            >
              <div className="text-right">
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Current Focus</p>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Copyright & Trademark</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Education</p>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>New York Law School</p>
              </div>
            </motion.div>
          </section>
        </div>

        {/* Rolling Expertise Marquee - Full Bleed */}
        <div className={`py-6 border-y ${isDarkMode ? 'border-neutral-800 bg-neutral-900/10' : 'border-neutral-200 bg-neutral-50/30'} overflow-hidden relative z-10 w-full`}>
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-10 px-6">
                <span className="text-lg md:text-xl font-serif italic text-neutral-500">Intellectual Property</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                <span className="text-lg md:text-xl font-serif italic text-neutral-500">Copyright Law</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                <span className="text-lg md:text-xl font-serif italic text-neutral-500">Trademark Strategy</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                <span className="text-lg md:text-xl font-serif italic text-neutral-500">Entertainment Law</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                <span className="text-lg md:text-xl font-serif italic text-neutral-500">Creative Advocacy</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                <span className="text-lg md:text-xl font-serif italic text-neutral-500">Digital Rights</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                <span className="text-lg md:text-xl font-serif italic text-neutral-500">Japanese Made</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                <span className="text-lg md:text-xl font-serif italic text-neutral-500">Legal Architecture</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                <span className="text-lg md:text-xl font-serif italic text-neutral-500">Narrative Strategy</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* About Section - Bento Grid */}
          <motion.section 
            id="about" 
            className="py-32 relative"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Main Bio Card */}
              <div className={`col-span-1 md:col-span-8 ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'} rounded-[2.5rem] p-8 md:p-12 border relative overflow-hidden group`}>
                {/* Background Calligraphy - About Me (私について) */}
                <motion.div 
                  variants={float}
                  animate="animate"
                  className={`absolute top-4 right-4 text-[8vw] font-bold pointer-events-none select-none z-0 transition-colors duration-700 ${isDarkMode ? 'text-white/[0.15]' : 'text-neutral-900/[0.1]'}`}
                  style={{ fontFamily: '"Noto Serif JP", serif' }}
                >
                  <motion.span variants={shimmer} animate="animate">私について</motion.span>
                </motion.div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Briefcase className="text-blue-500" size={20} />
                    </div>
                    <h2 className="text-2xl font-serif font-medium">The Professional Journey</h2>
                  </div>
                  <div className={`space-y-6 text-lg font-light leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    <p>
                      As a J.D. Candidate at New York Law School, I am dedicated to navigating the complex intersection of <span className={`${isDarkMode ? 'text-white' : 'text-neutral-900'} font-medium`}>intellectual property</span> and creative expression. My background as a self-published author and voice actor provides a unique, first-hand perspective on the legal challenges creators face in the digital age.
                    </p>
                    <p>
                      I focus on helping artists, writers, and innovators protect their work while fostering an environment where creativity can thrive. My approach combines rigorous legal analysis with a deep appreciation for the creative process.
                    </p>
                  </div>
                </div>
              </div>

              {/* Education Card */}
              <div className={`col-span-1 md:col-span-4 ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'} rounded-[2.5rem] p-8 md:p-10 border relative overflow-hidden group`}>
                {/* Background Calligraphy - Intellectual Property (知的財産) */}
                <motion.div 
                  variants={float}
                  animate="animate"
                  className={`absolute bottom-4 right-4 text-[5vw] font-bold pointer-events-none select-none z-0 transition-colors duration-700 ${isDarkMode ? 'text-white/[0.15]' : 'text-neutral-900/[0.1]'}`}
                  style={{ fontFamily: '"Noto Serif JP", serif' }}
                >
                  <motion.span variants={shimmer} animate="animate">知的財産</motion.span>
                </motion.div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <GraduationCap className="text-emerald-500" size={20} />
                    </div>
                    <h2 className="text-2xl font-serif font-medium">Education</h2>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>New York Law School</p>
                      <p className="text-sm text-neutral-500 font-mono">Juris Doctor Candidate</p>
                      <p className="text-xs text-blue-500 font-bold mt-2 uppercase tracking-widest">Expected 2029</p>
                    </div>
                    <div className="h-px w-full bg-neutral-800/10" />
                    <div>
                      <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Excelsior University</p>
                      <p className="text-sm text-neutral-500 font-mono">Bachelor of Arts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Experience Section - Career Architecture */}
          <motion.section 
            id="experience" 
            className="py-32"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
                  Experience
                </div>
                <h2 className={`text-5xl md:text-7xl font-serif font-medium ${isDarkMode ? 'text-white' : 'text-neutral-900'} tracking-tight`}>Professional <br /> Architecture</h2>
              </div>
              <p className={`max-w-md ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'} text-lg font-light leading-relaxed`}>
                A chronological blueprint of my professional evolution, from creative production to legal advocacy.
              </p>
            </div>

            <CareerArchitecture isDarkMode={isDarkMode} />
          </motion.section>

          {/* Projects/Creative Section */}
          <motion.section 
            id="projects" 
            className="py-32"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-16">
              <h2 className={`text-4xl md:text-6xl font-serif font-medium ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Creative Portfolio</h2>
              <div className="h-px flex-1 bg-neutral-800/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Featured Book */}
              <div className={`col-span-1 md:col-span-2 ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-900'} text-white rounded-3xl p-8 md:p-16 relative overflow-hidden group border shadow-2xl transition-all duration-700`}>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:bg-white/10 transition-colors duration-700"></div>
                
                {/* Blueprint Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-grid-white" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-8">
                      <BookOpen size={14} />
                      <span>Forthcoming Publication</span>
                    </div>
                    <h3 className="text-4xl md:text-6xl font-serif font-medium mb-6 leading-tight">The Kohen's <br /> Treasure</h3>
                    <p className="text-white/70 text-xl font-light leading-relaxed mb-8">
                      A full-length novel co-authored with Dr. Benny Gruen, published by ArtScroll Mesorah Publications—the leading publisher of Jewish literature worldwide.
                    </p>
                    
                    <button 
                      onClick={() => setIsBookExpanded(!isBookExpanded)}
                      className="flex items-center gap-3 text-xs font-bold text-white/40 hover:text-white transition-all uppercase tracking-[0.3em] mb-6 group/btn"
                    >
                      {isBookExpanded ? 'Hide Synopsis' : 'View Synopsis'} 
                      <ChevronRight size={16} className={`transition-transform duration-300 ${isBookExpanded ? 'rotate-90' : 'group-hover/btn:translate-x-1'}`} />
                    </button>

                    <AnimatePresence>
                      {isBookExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 rounded-2xl mb-8 bg-white/5 border border-white/10 backdrop-blur-sm relative">
                            <div className="absolute top-4 right-4 opacity-10">
                              <FileText size={40} />
                            </div>
                            <p className="text-white/60 text-base leading-relaxed italic font-light">
                              Blending historical fiction and religious thriller, the narrative follows a young man who uncovers a two-thousand-year-old cipher tied to the destruction of the Second Temple, exploring questions of faith, heritage, and identity.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="hidden lg:flex justify-end perspective-1000">
                    <motion.div 
                      whileHover={{ rotateY: -20, rotateX: 10, scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="w-64 h-96 bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/20 rounded-lg flex flex-col items-center justify-center shadow-[20px_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group/book"
                    >
                      {/* Book Spine Detail */}
                      <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/40 border-r border-white/10" />
                      
                      <BookOpen className="w-20 h-20 text-white/20 group-hover/book:text-white/40 transition-colors duration-500" />
                      
                      <div className="absolute bottom-8 left-8 right-8 text-center">
                        <div className="h-px w-full bg-white/10 mb-4" />
                        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30">ArtScroll</p>
                      </div>
                      
                      {/* Glossy Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Other Projects */}
              <div className={`${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'} rounded-3xl p-8 hover:shadow-md transition-shadow border relative overflow-hidden group`}>
                {/* Blueprint Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-grid-pattern" />
                
                <div className={`w-12 h-12 ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-50'} rounded-full flex items-center justify-center mb-6 border ${isDarkMode ? 'border-neutral-700' : 'border-neutral-100'} group-hover:scale-110 transition-transform duration-500 relative z-10`}>
                  <PenTool className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
                </div>
                <h3 className="text-xl font-medium mb-2 relative z-10">Self-Published Author</h3>
                <p className="text-neutral-400 font-mono text-xs mb-4 relative z-10">2020 – Present</p>
                <p className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'} text-sm leading-relaxed relative z-10`}>
                  Authored and self-published four full-length novels spanning Romantic Comedy, Teen Mental Health, and Fantasy genres. Managed the entire publication lifecycle from drafting to distribution.
                </p>
              </div>

              <div className={`${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'} rounded-3xl p-8 hover:shadow-md transition-shadow border relative overflow-hidden group`}>
                {/* Blueprint Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-grid-pattern" />
                
                <div className={`w-12 h-12 ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-50'} rounded-full flex items-center justify-center mb-6 border ${isDarkMode ? 'border-neutral-700' : 'border-neutral-100'} group-hover:scale-110 transition-transform duration-500 relative z-10`}>
                  <Mic className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
                </div>
                <h3 className="text-xl font-medium mb-2 relative z-10">Freelance Voice Actor</h3>
                <p className="text-neutral-400 font-mono text-xs mb-4 relative z-10">2021 – 2024</p>
                <p className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'} text-sm leading-relaxed relative z-10`}>
                  Contributed vocal performances to various digital media projects, reaching a global audience of over 14 million viewers.
                </p>
              </div>

              {/* Arcade Card */}
              <div id="canvas" className="col-span-1 md:col-span-2 mt-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-serif font-medium mb-1">Interactive Playground</h3>
                    <p className="text-neutral-500 text-sm">A custom HTML5 canvas experience. Take a break and play.</p>
                  </div>
                  <div className="hidden sm:flex gap-2">
                    <span className={`px-3 py-1 ${isDarkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-500'} text-xs font-mono rounded-full`}>TypeScript</span>
                    <span className={`px-3 py-1 ${isDarkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-500'} text-xs font-mono rounded-full`}>Canvas API</span>
                  </div>
                </div>
                <ArcadeCard isDarkMode={isDarkMode} />
              </div>
            </div>
          </motion.section>

          {/* Contact Section */}
          <motion.section 
            id="contact" 
            className={`py-32 border-t ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'} relative overflow-hidden`}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
          >
            {/* Background Accent */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ${isDarkMode ? 'bg-blue-900/5' : 'bg-blue-50/30'} rounded-full blur-[120px] pointer-events-none z-0`} />

            <div className={`${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'} rounded-[3rem] p-8 md:p-20 text-center max-w-5xl mx-auto relative z-10 border shadow-2xl overflow-hidden`}>
              {/* Blueprint Grid Overlay */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-grid-pattern" />
              
              <div className="mb-12 relative z-10">
                <div className="text-neutral-300 font-bold text-3xl mb-4 opacity-40 select-none">連絡先</div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">
                  Closing Statement
                </div>
                <h2 className={`text-5xl md:text-7xl font-serif font-medium mb-8 ${isDarkMode ? 'text-white' : 'text-neutral-900'} tracking-tight`}>Let's Connect</h2>
                <p className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'} text-xl font-light mb-16 max-w-3xl mx-auto leading-relaxed`}>
                  Whether you're interested in discussing intellectual property law, creative projects, or opportunities in the entertainment sector, I'd love to hear from you.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto relative z-10">
                <CopyButton text="naftaligruen@gmail.com" label="Email Address" icon={Mail} isDarkMode={isDarkMode} />
                <CopyButton text="646-415-3514" label="Phone Number" icon={Phone} isDarkMode={isDarkMode} />
                <div className={`sm:col-span-2 flex items-center justify-between w-full p-6 ${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-50 border-neutral-100'} border rounded-[2rem] text-left group hover:shadow-md transition-all relative overflow-hidden`}>
                  {/* Blueprint Grid Overlay */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-grid-pattern" />
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className={`w-12 h-12 ${isDarkMode ? 'bg-neutral-700 text-white' : 'bg-white text-neutral-900'} rounded-2xl flex items-center justify-center shadow-sm border border-neutral-200/10 group-hover:scale-110 transition-transform duration-500`}>
                      <MapPin size={22} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em] mb-1">Base of Operations</p>
                      <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Brooklyn, New York</p>
                    </div>
                  </div>
                  <div className="hidden sm:block relative z-10">
                    <div className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">EST (UTC-5)</div>
                  </div>
                </div>
              </div>

              {/* Blueprint Dimension Line at bottom */}
              <div className="mt-20 pt-10 border-t border-neutral-200/10 flex items-center justify-between text-[8px] font-mono text-neutral-500 uppercase tracking-widest">
                <span>Ref: CONTACT-2029</span>
                <div className="h-px flex-1 mx-8 bg-neutral-200/10" />
                <span>End of Brief</span>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-8 border-t ${isDarkMode ? 'border-neutral-800 bg-neutral-950 text-neutral-500' : 'border-neutral-200 bg-white text-neutral-500'} text-center text-sm`}>
        <p>&copy; {new Date().getFullYear()} Nathan Gruen. All rights reserved.</p>
        <p className="mt-2 text-xs font-mono">J.D. Candidate &middot; Author &middot; Creative Consultant</p>
      </footer>
      <Analytics />
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} isDarkMode={isDarkMode} />
    </div>
  );
}
