import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { 
  BookOpen, Briefcase, GraduationCap, Mail, MapPin, Phone, Globe, 
  Mic, PenTool, ChevronRight, Command, Search, Gamepad2,
  Download, ArrowUpRight, Terminal, Database, Code, Moon, Sun, FileText, Volume2, VolumeX, MousePointer2
} from 'lucide-react';
import { Analytics } from "@vercel/analytics/react";
import ArcadeCard from './ArcadeCard';
import CareerArchitecture from './CareerArchitecture';
import ResumeModal from './ResumeModal';
import CopyButton from './CopyButton';
import CommandMenu from './CommandMenu';
import LegalInsights from './LegalInsights';

interface PortfolioProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  globalMute: boolean;
  setGlobalMute: (mute: boolean) => void;
  cursorType: 'anime' | 'mecha' | 'default';
  setCursorType: (type: 'anime' | 'mecha' | 'default') => void;
  onEngageChange?: (isEngaging: boolean) => void;
}

export default function Portfolio({ isDarkMode, toggleTheme, globalMute, setGlobalMute, cursorType, setCursorType, onEngageChange }: PortfolioProps) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [resumeOpen, setResumeOpen] = useState(false);
  const [expandedInsightId, setExpandedInsightId] = useState<string | null>(null);
  const [isBookExpanded, setIsBookExpanded] = useState(false);
  const [isGlobalSoundOn, setIsGlobalSoundOn] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isCanvasInView, setIsCanvasInView] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bookSectionRef = useRef<HTMLDivElement>(null);
  const canvasSectionRef = useRef<HTMLDivElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isEngaging, setIsEngaging] = useState(false);

  useEffect(() => {
    if (onEngageChange) {
      onEngageChange(isEngaging);
    }
  }, [isEngaging, onEngageChange]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCanvasInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (canvasSectionRef.current) {
      observer.observe(canvasSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleBookSynopsis = () => {
    const newState = !isBookExpanded;
    setIsBookExpanded(newState);
    if (newState) {
      setTimeout(() => {
        bookSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  // Scroll Progress
  const { scrollYProgress, scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 20, damping: 25, restDelta: 0.001 });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroY1 = useTransform(smoothScrollY, [0, 1000], [0, 200]);
  const heroY2 = useTransform(smoothScrollY, [0, 1000], [0, -150]);

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
    <div className={`min-h-screen ${isDarkMode ? 'bg-neutral-950 text-white selection:bg-blue-500/30' : 'bg-paper text-neutral-900 selection:bg-blue-200'} transition-colors duration-700 font-sans`}>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-blue-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Cmd+K Overlay */}
      <CommandMenu 
        isOpen={cmdOpen} 
        onClose={() => setCmdOpen(false)} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        openResume={() => setResumeOpen(true)} 
      />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? (isDarkMode ? 'bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800 shadow-lg shadow-black/20' : 'bg-paper/80 backdrop-blur-xl border-b border-neutral-200 shadow-sm') : 'bg-transparent border-transparent py-2'}`}>
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
              <a href="#insights" className="hover:text-blue-500 transition-colors">Analysis</a>
              <a href="#canvas" className="hover:text-blue-500 transition-colors">Playground</a>
              <a href="#contact" className="hover:text-blue-500 transition-colors">Contact</a>
            </div>
            
            <div className="h-6 w-px bg-neutral-800/10 hidden sm:block" />
            
            <div className="flex items-center gap-2">
              {/* Cursor Dropdown */}
              <div className="relative group/cursor hidden sm:block">
                <button className={`p-2.5 rounded-xl ${isDarkMode ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-500'} transition-all`} title="Cursor Style">
                  <MousePointer2 size={18} />
                </button>
                <div className={`absolute top-full right-0 mt-2 w-48 ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-paper border-neutral-200'} border rounded-xl shadow-xl opacity-0 invisible group-hover/cursor:opacity-100 group-hover/cursor:visible transition-all z-50 overflow-hidden`}>
                  <button onClick={() => setCursorType('anime')} className={`w-full text-left px-4 py-2.5 text-xs font-medium ${isDarkMode ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'} ${cursorType === 'anime' ? 'text-blue-500' : ''}`}>Anime (Red) - Default</button>
                  <button onClick={() => setCursorType('mecha')} className={`w-full text-left px-4 py-2.5 text-xs font-medium ${isDarkMode ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'} ${cursorType === 'mecha' ? 'text-blue-500' : ''}`}>Mecha (Cyan)</button>
                  <button onClick={() => setCursorType('default')} className={`w-full text-left px-4 py-2.5 text-xs font-medium ${isDarkMode ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'} ${cursorType === 'default' ? 'text-blue-500' : ''}`}>System Standard</button>
                </div>
              </div>

              {/* Mute Button */}
              <button 
                onClick={() => setGlobalMute(!globalMute)}
                className={`p-2.5 rounded-xl ${isDarkMode ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-500'} transition-all`}
                title={globalMute ? "Unmute UI Sounds" : "Mute UI Sounds"}
              >
                {globalMute ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              <button 
                onClick={() => setCmdOpen(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isDarkMode ? 'border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-400' : 'border-neutral-200 bg-paper hover:bg-neutral-100 text-neutral-500'} transition-all group relative`}
                title="Search (Cmd+K)"
              >
                <Search size={14} />
                <span className="text-xs hidden sm:inline-block">Search...</span>
                <kbd className={`hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded font-mono ${isDarkMode ? 'bg-neutral-800 text-neutral-500' : 'bg-neutral-200 text-neutral-500'}`}>⌘K</kbd>
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
          <section className="min-h-[70vh] flex flex-col justify-center py-20 relative">
            {/* Background Calligraphy - Nathan (ネイサン) */}
            <motion.div 
              variants={float}
              animate="animate"
              style={{ y: heroY1, fontFamily: '"Noto Serif JP", serif' }}
              className={`absolute top-10 right-4 text-[12vw] font-bold pointer-events-none select-none z-0 transition-colors duration-700 ${isDarkMode ? 'text-white/[0.15]' : 'text-neutral-900/[0.1]'}`}
            >
              <motion.span variants={shimmer} animate="animate">ネイサン</motion.span>
            </motion.div>

            {/* Background Calligraphy - Copyright & Trademark Law (著作権・商標法) */}
            <motion.div 
              variants={float}
              animate="animate"
              style={{ y: heroY2, fontFamily: '"Noto Serif JP", serif' }}
              className={`absolute bottom-10 left-4 text-[6vw] font-bold pointer-events-none select-none z-0 transition-colors duration-700 ${isDarkMode ? 'text-white/[0.12]' : 'text-neutral-900/[0.08]'}`}
            >
              <motion.span variants={shimmer} animate="animate">著作権・商標法</motion.span>
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
                  className={`relative overflow-hidden group px-8 py-4 ${isDarkMode ? 'bg-blue-600/20 border-blue-500/30 text-white' : 'bg-blue-600 border-blue-700 text-white'} backdrop-blur-md border rounded-2xl font-bold text-sm transition-all shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95`}
                >
                  <span className="relative z-10">Get in Touch</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
                <button 
                  onClick={() => setResumeOpen(true)}
                  className={`relative overflow-hidden group px-8 py-4 ${isDarkMode ? 'bg-white/5 backdrop-blur-md border-white/10 text-white' : 'bg-black/5 backdrop-blur-md border-black/10 text-neutral-900'} border rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Download size={18} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    View Resume
                  </span>
                  <div className={`absolute inset-0 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </button>
              </motion.div>
            </motion.div>

            {/* Hero Stats/Badges - Moved left */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-10 right-20 hidden lg:flex gap-12"
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
        <div className={`py-6 border-y ${isDarkMode ? 'border-neutral-800 bg-neutral-900/10' : 'border-neutral-200 bg-paper/30'} overflow-hidden relative z-10 w-full group`}>
          {/* Edge Fade Masks */}
          <div className={`absolute inset-y-0 left-0 w-32 bg-gradient-to-r ${isDarkMode ? 'from-neutral-950' : 'from-paper'} to-transparent z-20 pointer-events-none`} />
          <div className={`absolute inset-y-0 right-0 w-32 bg-gradient-to-l ${isDarkMode ? 'from-neutral-950' : 'from-paper'} to-transparent z-20 pointer-events-none`} />
          
          <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused] transition-all duration-500">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-10 px-6">
                <span className="text-lg md:text-xl font-serif italic text-neutral-500 hover:text-blue-500 transition-colors cursor-default">Intellectual Property</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                <span className="text-lg md:text-xl font-serif italic text-neutral-500 hover:text-blue-500 transition-colors cursor-default">Copyright Law</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                <span className="text-lg md:text-xl font-serif italic text-neutral-500 hover:text-blue-500 transition-colors cursor-default">Trademark Strategy</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                <span className="text-lg md:text-xl font-serif italic text-neutral-500 hover:text-blue-500 transition-colors cursor-default">Entertainment Law</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                <span className="text-lg md:text-xl font-serif italic text-neutral-500 hover:text-blue-500 transition-colors cursor-default">Creative Advocacy</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                <span className="text-lg md:text-xl font-serif italic text-neutral-500 hover:text-blue-500 transition-colors cursor-default">Digital Rights</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                <span className="text-lg md:text-xl font-serif italic text-neutral-500 hover:text-blue-500 transition-colors cursor-default">Japanese Made</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                <span className="text-lg md:text-xl font-serif italic text-neutral-500 hover:text-blue-500 transition-colors cursor-default">Legal Architecture</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                <span className="text-lg md:text-xl font-serif italic text-neutral-500 hover:text-blue-500 transition-colors cursor-default">Narrative Strategy</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* About Section - Bento Grid */}
          <motion.section 
            id="about" 
            className="py-20 relative"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Main Bio Card */}
              <div className={`col-span-1 md:col-span-8 ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-paper border-neutral-200'} rounded-[2.5rem] p-8 md:p-12 border relative overflow-hidden group`}>
                {/* Background Calligraphy - About Me (略歴) */}
                <motion.div 
                  variants={float}
                  animate="animate"
                  className={`absolute top-4 right-4 text-[8vw] font-bold pointer-events-none select-none z-0 transition-colors duration-700 ${isDarkMode ? 'text-white/[0.15]' : 'text-neutral-900/[0.1]'}`}
                  style={{ fontFamily: '"Noto Serif JP", serif' }}
                >
                  <motion.span variants={shimmer} animate="animate">略歴</motion.span>
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
              <div className={`col-span-1 md:col-span-4 ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-paper border-neutral-200'} rounded-[2.5rem] p-8 md:p-10 border relative overflow-hidden group`}>
                {/* Background Calligraphy - Jurisprudence (法学) */}
                <motion.div 
                  variants={float}
                  animate="animate"
                  className={`absolute bottom-4 right-4 text-[5vw] font-bold pointer-events-none select-none z-0 transition-colors duration-700 ${isDarkMode ? 'text-white/[0.15]' : 'text-neutral-900/[0.1]'}`}
                  style={{ fontFamily: '"Noto Serif JP", serif' }}
                >
                  <motion.span variants={shimmer} animate="animate">法学</motion.span>
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

          {/* Legal Philosophy Section */}
          <motion.section 
            className="py-20 border-y border-neutral-800/10"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              initial: { opacity: 0 },
              animate: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  id: '01',
                  title: 'Creative Advocacy',
                  color: 'blue',
                  desc: 'Empowering creators by providing robust legal frameworks that protect their intellectual property without stifling innovation.'
                },
                {
                  id: '02',
                  title: 'Digital Rights',
                  color: 'emerald',
                  desc: 'Navigating the complexities of digital distribution, AI training data, and the evolving landscape of online rights management.'
                },
                {
                  id: '03',
                  title: 'Narrative Strategy',
                  color: 'amber',
                  desc: 'Applying storytelling principles to legal advocacy, ensuring that every case and contract tells a clear, compelling story.'
                }
              ].map((item) => (
                <motion.div 
                  key={item.id}
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                  }}
                  className={`group p-6 rounded-3xl transition-all duration-500 hover:-translate-y-2 ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
                >
                  <div className="space-y-4 relative">
                    {/* Vertical Dimension Line Accent */}
                    <div className={`absolute -left-6 top-0 bottom-0 w-px scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top ${item.color === 'blue' ? 'bg-blue-500' : item.color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-10 h-10 ${item.color === 'blue' ? 'bg-blue-500/10' : item.color === 'emerald' ? 'bg-emerald-500/10' : 'bg-amber-500/10'} rounded-xl flex items-center justify-center transition-colors duration-500 group-hover:shadow-lg`}
                    >
                      <span className={`font-serif font-bold text-sm ${item.color === 'blue' ? 'text-blue-500' : item.color === 'emerald' ? 'text-emerald-500' : 'text-amber-500'}`}>{item.id}</span>
                    </motion.div>
                    <h3 className={`text-xl font-serif font-medium transition-colors duration-300 ${isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-neutral-900 group-hover:text-blue-600'}`}>{item.title}</h3>
                    <p className={`text-sm leading-relaxed transition-opacity duration-300 ${isDarkMode ? 'text-neutral-400 group-hover:text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-700'}`}>
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Experience Section - Career Architecture */}
          <motion.section 
            id="experience" 
            className="py-20"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
                  Experience
                </div>
                <h2 className={`text-5xl md:text-7xl font-serif font-medium ${isDarkMode ? 'text-white' : 'text-neutral-900'} tracking-tight`}>Professional <br /> Architecture</h2>
              </div>
            </div>

            <CareerArchitecture isDarkMode={isDarkMode} globalMute={globalMute} />
          </motion.section>

          {/* Legal Insights Section */}
          <LegalInsights isDarkMode={isDarkMode} globalMute={globalMute} />

          {/* Projects/Creative Section */}
          <motion.section 
            id="projects" 
            className="py-20"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-16">
              <h2 className={`text-4xl md:text-6xl font-serif font-medium ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Creative Portfolio</h2>
              <div className="h-px flex-1 bg-neutral-800/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Featured Book */}
              <div 
                ref={bookSectionRef}
                className={`col-span-1 md:col-span-2 ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-900'} text-white rounded-3xl p-8 md:p-16 relative overflow-hidden group border shadow-2xl transition-all duration-700`}
              >
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
                      onClick={toggleBookSynopsis}
                      className="flex items-center gap-3 text-xs font-bold text-white/40 hover:text-white transition-all uppercase tracking-[0.3em] mb-6 group/btn"
                    >
                      {isBookExpanded ? 'Hide Synopsis' : 'View Synopsis'} 
                      <ChevronRight size={16} className={`transition-transform duration-300 ${isBookExpanded ? 'rotate-90 text-white' : 'group-hover/btn:translate-x-1'}`} />
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
              <div className={`${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-paper border-neutral-200'} rounded-3xl p-8 hover:shadow-md transition-shadow border relative overflow-hidden group`}>
                {/* Blueprint Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-grid-pattern" />
                
                <div className={`w-12 h-12 ${isDarkMode ? 'bg-neutral-800' : 'bg-paper'} rounded-full flex items-center justify-center mb-6 border ${isDarkMode ? 'border-neutral-700' : 'border-neutral-100'} group-hover:scale-110 transition-transform duration-500 relative z-10`}>
                  <PenTool className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
                </div>
                <h3 className="text-xl font-medium mb-2 relative z-10">Self-Published Author</h3>
                <p className="text-neutral-400 font-mono text-xs mb-4 relative z-10">2020 – Present</p>
                <p className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'} text-sm leading-relaxed relative z-10`}>
                  Authored and self-published four full-length novels spanning Romantic Comedy, Teen Mental Health, and Fantasy genres. Managed the entire publication lifecycle from drafting to distribution.
                </p>
              </div>

              <div className={`${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-paper border-neutral-200'} rounded-3xl p-8 hover:shadow-md transition-shadow border relative overflow-hidden group`}>
                {/* Blueprint Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-grid-pattern" />
                
                <div className={`w-12 h-12 ${isDarkMode ? 'bg-neutral-800' : 'bg-paper'} rounded-full flex items-center justify-center mb-6 border ${isDarkMode ? 'border-neutral-700' : 'border-neutral-100'} group-hover:scale-110 transition-transform duration-500 relative z-10`}>
                  <Mic className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
                </div>
                <h3 className="text-xl font-medium mb-2 relative z-10">Freelance Voice Actor</h3>
                <p className="text-neutral-400 font-mono text-xs mb-4 relative z-10">2021 – 2024</p>
                <p className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'} text-sm leading-relaxed relative z-10`}>
                  Contributed vocal performances to various digital media projects, reaching a global audience of over 14 million viewers.
                </p>
              </div>

              {/* Arcade Card */}
              <div id="canvas" ref={canvasSectionRef} className={`col-span-1 md:col-span-2 mt-8 transition-all duration-500 ${isEngaging ? 'relative z-[70]' : 'relative z-10'}`}>
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
                <ArcadeCard isDarkMode={isDarkMode} onPlayChange={setIsEngaging} isEngaging={isEngaging} globalMute={globalMute} />

      {/* Game Mode Overlay / Shade */}
      <AnimatePresence>
        {isEngaging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
          >
            {/* Exit Button - repositioned to top right */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute top-8 right-8 z-10 pointer-events-auto"
            >
              <button 
                onClick={() => setIsEngaging(false)}
                className={`px-6 py-2.5 rounded-full font-bold text-[9px] uppercase tracking-[0.3em] shadow-2xl border transition-all flex items-center gap-3 group ${isDarkMode ? 'bg-white text-black border-white/20 hover:bg-neutral-200' : 'bg-black text-white border-black/20 hover:bg-neutral-800'}`}
              >
                <ChevronRight size={12} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                Back to Portfolio
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
              </div>
            </div>
          </motion.section>

          {/* Contact Section */}
          <motion.section 
            id="contact" 
            className={`py-20 border-t ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'} relative overflow-hidden`}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
          >
            {/* Background Accent */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ${isDarkMode ? 'bg-blue-900/5' : 'bg-blue-50/30'} rounded-full blur-[120px] pointer-events-none z-0`} />

            <div className={`${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-paper border-neutral-200'} rounded-[3rem] p-8 md:p-20 text-center max-w-5xl mx-auto relative z-10 border shadow-2xl overflow-hidden`}>
              {/* Blueprint Grid Overlay */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-grid-pattern" />
              
              <div className="mb-12 relative z-10">
                <div 
                  className="text-neutral-300 font-bold text-5xl mb-4 opacity-20 select-none"
                  style={{ fontFamily: '"Noto Serif JP", serif' }}
                >
                  連絡先
                </div>
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
                <CopyButton text="201-719-1103" label="Phone Number" icon={Phone} isDarkMode={isDarkMode} />
                <div className={`sm:col-span-2 flex items-center justify-between w-full p-6 ${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-paper border-neutral-100'} border rounded-[2rem] text-left group hover:shadow-md transition-all relative overflow-hidden`}>
                  {/* Blueprint Grid Overlay */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-grid-pattern" />
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className={`w-12 h-12 ${isDarkMode ? 'bg-neutral-700 text-white' : 'bg-paper text-neutral-900'} rounded-2xl flex items-center justify-center shadow-sm border border-neutral-200/10 group-hover:scale-110 transition-transform duration-500`}>
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
      <footer className={`py-8 border-t ${isDarkMode ? 'border-neutral-800 bg-neutral-950 text-neutral-500' : 'border-neutral-200 bg-paper text-neutral-500'} text-center text-sm`}>
        <p>&copy; {new Date().getFullYear()} Nathan Gruen. All rights reserved.</p>
        <p className="mt-2 text-xs font-mono">J.D. Candidate &middot; Author &middot; Creative Consultant</p>
      </footer>
      <Analytics />
      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && !isEngaging && !isCanvasInView && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed bottom-8 right-8 p-4 rounded-full shadow-2xl z-40 backdrop-blur-md border transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? 'bg-blue-600/80 border-blue-400/50 text-white hover:bg-blue-500' : 'bg-blue-600 border-blue-700 text-white hover:bg-blue-700'}`}
            title="Back to Top"
          >
            <ChevronRight size={24} className="-rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>

      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} isDarkMode={isDarkMode} globalMute={globalMute} />
    </div>
  );
}
