import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Briefcase, GraduationCap, Mail, MapPin, Phone, Globe, 
  Mic, PenTool, ChevronRight, Command, Search, Copy, Check, Gamepad2,
  Download, ArrowUpRight, Terminal, Database, Code, Lock, Moon, Sun, FileText, Volume2, VolumeX
} from 'lucide-react';
import { Analytics } from "@vercel/analytics/react";
import LockScreen from './components/LockScreen';
import ArcadeCard from './components/ArcadeCard';
import CareerArchitecture from './components/CareerArchitecture';

import ResumeModal from './components/ResumeModal';

// --- Components ---

function CopyButton({ text, label, icon: Icon, isDarkMode }: { text: string, label: string, icon: any, isDarkMode?: boolean }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy} 
      className={`group flex items-center justify-between w-full p-4 ${isDarkMode ? 'bg-neutral-800 border-neutral-700 hover:border-neutral-600' : 'bg-white border-neutral-200 hover:border-neutral-300'} rounded-2xl hover:shadow-sm transition-all text-left border`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 ${isDarkMode ? 'bg-neutral-700 text-white' : 'bg-neutral-50 text-neutral-900'} rounded-full flex items-center justify-center ${isDarkMode ? 'group-hover:bg-neutral-600' : 'group-hover:bg-neutral-100'} transition-colors`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">{label}</p>
          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{text}</p>
        </div>
      </div>
      <div className={`${isDarkMode ? 'text-neutral-500 group-hover:text-neutral-300' : 'text-neutral-400 group-hover:text-neutral-900'} transition-colors`}>
        {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
      </div>
    </button>
  );
}

// --- Main App ---

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [expandedInsightId, setExpandedInsightId] = useState<string | null>(null);
  const [isBookExpanded, setIsBookExpanded] = useState(false);
  const [isGlobalSoundOn, setIsGlobalSoundOn] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setCmdOpen(false);
  };

  // Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Cmd+K Listener
  useEffect(() => {
    if (!isAuthenticated) return;
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isAuthenticated]);

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

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  const handleNav = (id: string) => {
    setCmdOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyFromCmd = (text: string) => {
    navigator.clipboard.writeText(text);
    setCmdOpen(false);
  };

  if (!isAuthenticated) {
    return <LockScreen onAuthenticate={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-neutral-950 text-neutral-100 selection:bg-neutral-100 selection:text-neutral-950' : 'bg-[#fdfdfc] text-neutral-900 selection:bg-neutral-900 selection:text-white'} relative overflow-x-hidden transition-colors duration-500`}>
      {/* Subtle background gradients */}
      <div className={`absolute top-0 left-0 w-full h-[1000px] bg-gradient-to-b ${isDarkMode ? 'from-neutral-900/50' : 'from-neutral-100/50'} to-transparent pointer-events-none z-0`} />
      <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] ${isDarkMode ? 'bg-blue-900/10' : 'bg-blue-50/30'} rounded-full blur-[120px] pointer-events-none z-0`} />
      <div className={`absolute top-[10%] right-[-10%] w-[50%] h-[50%] ${isDarkMode ? 'bg-emerald-900/10' : 'bg-emerald-50/30'} rounded-full blur-[120px] pointer-events-none z-0`} />
      
      <div className="film-grain z-[100] pointer-events-none" />
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className={`fixed top-0 left-0 right-0 h-1 ${isDarkMode ? 'bg-white' : 'bg-neutral-900'} origin-left z-[100]`}
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-40 ${isDarkMode ? 'bg-neutral-950/80' : 'bg-white/80'} backdrop-blur-md border-b ${isDarkMode ? 'border-neutral-800' : 'border-neutral-100'} px-6 py-6 flex justify-between items-center transition-colors`}>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-serif text-xl font-bold tracking-tight cursor-pointer hover:opacity-70 transition-opacity"
        >
          NG.
        </button>
        <div className={`hidden md:flex space-x-8 text-sm font-medium ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`hover:${isDarkMode ? 'text-white' : 'text-neutral-900'} transition-colors cursor-pointer`}
          >
            Home
          </button>
          <a href="#about" className={`hover:${isDarkMode ? 'text-white' : 'text-neutral-900'} transition-colors`}>About</a>
          <a href="#experience" className={`hover:${isDarkMode ? 'text-white' : 'text-neutral-900'} transition-colors`}>Experience</a>
          <a href="#projects" className={`hover:${isDarkMode ? 'text-white' : 'text-neutral-900'} transition-colors`}>Projects</a>
          <a href="#insights" className={`hover:${isDarkMode ? 'text-white' : 'text-neutral-900'} transition-colors`}>Insights</a>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCmdOpen(true)}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 ${isDarkMode ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border-neutral-800' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-500 border-neutral-200'} rounded-lg text-xs font-medium transition-colors border`}
          >
            <Search size={14} />
            <span>Search</span>
            <kbd className={`font-mono ${isDarkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-400' : 'bg-white border-neutral-200'} px-1.5 py-0.5 rounded border shadow-sm ml-2`}>⌘K</kbd>
          </button>
          <a 
            href="#canvas"
            className={`p-2 rounded-full ${isDarkMode ? 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'} transition-colors`}
            title="Interactive Canvas"
          >
            <Gamepad2 size={18} />
          </a>
          <button 
            onClick={() => setCmdOpen(true)}
            className={`flex sm:hidden p-2 rounded-full ${isDarkMode ? 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'} transition-colors`}
          >
            <Search size={18} />
          </button>
          <button 
            onClick={() => setIsGlobalSoundOn(!isGlobalSoundOn)}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'} transition-colors`}
            title={isGlobalSoundOn ? "Mute Site Sounds" : "Enable Site Sounds"}
          >
            {isGlobalSoundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-neutral-900 text-yellow-400 hover:bg-neutral-800' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'} transition-colors`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a href="#contact" className={`px-5 py-2 ${isDarkMode ? 'bg-white text-neutral-900 hover:bg-neutral-100' : 'bg-neutral-900 text-white hover:bg-neutral-800'} text-sm font-medium rounded-full transition-colors shadow-sm`}>
            Contact
          </a>
        </div>
      </nav>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {cmdOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCmdOpen(false)}
              className="fixed inset-0 z-[200] cmd-backdrop"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={`fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-lg ${isDarkMode ? 'bg-neutral-950/80 border-neutral-800' : 'bg-white/80 border-neutral-200'} backdrop-blur-xl border rounded-2xl shadow-2xl z-[200] overflow-hidden`}
            >
              <div className={`flex items-center px-4 py-3 border-b ${isDarkMode ? 'border-neutral-800' : 'border-neutral-100'}`}>
                <Search size={18} className="text-neutral-400 mr-3" />
                <input 
                  ref={inputRef}
                  type="text" 
                  placeholder="Type a command or search..." 
                  className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-white placeholder:text-neutral-600' : 'text-neutral-900 placeholder:text-neutral-400'} text-sm`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <kbd className={`font-mono text-[10px] ${isDarkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-500' : 'bg-neutral-100 border-neutral-200 text-neutral-500'} px-1.5 py-0.5 rounded border`}>ESC</kbd>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                <div className="px-2 py-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Navigation</div>
                <button onClick={() => handleNav('about')} className={`w-full flex items-center gap-3 px-3 py-2.5 ${isDarkMode ? 'hover:bg-neutral-900 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-900'} rounded-xl text-sm text-left transition-colors`}>
                  <Terminal size={16} className="text-neutral-500" /> <span>About Me</span>
                </button>
                <button onClick={() => handleNav('experience')} className={`w-full flex items-center gap-3 px-3 py-2.5 ${isDarkMode ? 'hover:bg-neutral-900 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-900'} rounded-xl text-sm text-left transition-colors`}>
                  <Briefcase size={16} className="text-neutral-500" /> <span>Experience & Education</span>
                </button>
                <button onClick={() => handleNav('projects')} className={`w-full flex items-center gap-3 px-3 py-2.5 ${isDarkMode ? 'hover:bg-neutral-900 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-900'} rounded-xl text-sm text-left transition-colors`}>
                  <BookOpen size={16} className="text-neutral-500" /> <span>Creative Projects</span>
                </button>
                <button onClick={() => handleNav('insights')} className={`w-full flex items-center gap-3 px-3 py-2.5 ${isDarkMode ? 'hover:bg-neutral-900 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-900'} rounded-xl text-sm text-left transition-colors`}>
                  <Globe size={16} className="text-neutral-500" /> <span>Legal Insights</span>
                </button>
                
                <div className="px-2 py-1.5 mt-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Actions</div>
                <button onClick={toggleTheme} className={`w-full flex items-center gap-3 px-3 py-2.5 ${isDarkMode ? 'hover:bg-neutral-900 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-900'} rounded-xl text-sm text-left transition-colors`}>
                  {isDarkMode ? <Sun size={16} className="text-neutral-500" /> : <Moon size={16} className="text-neutral-500" />} 
                  <span>Switch to {isDarkMode ? 'Light' : 'Dark'} Mode</span>
                </button>
                <button onClick={() => handleCopyFromCmd('naftaligruen@gmail.com')} className={`w-full flex items-center gap-3 px-3 py-2.5 ${isDarkMode ? 'hover:bg-neutral-900 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-900'} rounded-xl text-sm text-left transition-colors`}>
                  <Copy size={16} className="text-neutral-500" /> <span>Copy Email Address</span>
                </button>
                <button onClick={() => handleCopyFromCmd('646-415-3514')} className={`w-full flex items-center gap-3 px-3 py-2.5 ${isDarkMode ? 'hover:bg-neutral-900 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-900'} rounded-xl text-sm text-left transition-colors`}>
                  <Phone size={16} className="text-neutral-500" /> <span>Copy Phone Number</span>
                </button>
                <button onClick={() => { setCmdOpen(false); setResumeOpen(true); }} className={`w-full flex items-center gap-3 px-3 py-2.5 ${isDarkMode ? 'hover:bg-neutral-900 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-900'} rounded-xl text-sm text-left transition-colors`}>
                  <BookOpen size={16} className="text-neutral-500" /> <span>View Résumé</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="relative">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none" />

        <div className="relative z-10 pt-32 pb-0 px-6 md:px-12 max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <motion.section 
            className="min-h-[75vh] flex flex-col justify-center relative py-12"
            initial="initial" animate="animate" variants={staggerContainer}
          >
            {/* Blueprint Grid Overlay for Hero */}
            <div className={`absolute inset-0 z-0 opacity-[0.03] pointer-events-none ${isDarkMode ? 'bg-grid-white' : 'bg-grid-black'}`} />

            <motion.div variants={fadeIn} className="mb-8 inline-flex items-center space-x-3 px-6 py-3 rounded-full border border-neutral-200 bg-white/50 backdrop-blur-md text-xs font-bold text-neutral-700 uppercase tracking-[0.2em] shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>J.D. Candidate &middot; Fall 2026</span>
            </motion.div>
            
            <div className="relative">
              <motion.h1 className="text-5xl md:text-7xl lg:text-[7.5rem] font-serif font-medium leading-none tracking-[-0.07em] max-w-5xl mb-6 relative z-10 flex flex-wrap gap-x-[0.15em]">
                {"Nathan Gruen".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.04 + 0.3,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className={char === " " ? "w-[0.2em]" : ""}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h1>
              
              {/* Floating Japanese Calligraphy Accent */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.15, x: 0 }}
                transition={{ delay: 1.2, duration: 1.5 }}
                className="absolute -right-4 md:right-0 top-0 vertical-text text-neutral-400 font-black text-5xl md:text-7xl tracking-[0.4em] pointer-events-none select-none"
              >
                ネイサン
              </motion.div>
            </div>
            
            <motion.p variants={fadeIn} className="text-lg md:text-2xl text-neutral-500 max-w-2xl font-light leading-relaxed mb-10">
              Defining the legal architecture of <strong className={`font-medium ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Intellectual Property</strong>. 
              Specializing in the cross-cultural frameworks of Japanese Copyright & Trademark Law.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-wrap gap-4 items-center mb-12">
              <a href="#about" className="group px-8 py-4 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-all flex items-center gap-3 shadow-xl shadow-neutral-900/20 text-sm">
                Explore Profile <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              <button onClick={() => setResumeOpen(true)} className={`px-8 py-4 ${isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700' : 'bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-50'} border rounded-full font-medium transition-all shadow-sm flex items-center gap-3 text-sm`}>
                <BookOpen size={18} /> View Résumé
              </button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="absolute bottom-0 left-0 flex flex-col items-center gap-4"
            >
              <div className="w-px h-12 bg-gradient-to-b from-neutral-400 to-transparent" />
            </motion.div>

            {/* Vertical Japanese Accent - Repositioned and refined */}
            <motion.div 
              variants={fadeIn}
              className="absolute right-0 bottom-0 hidden lg:block"
            >
              <div className="vertical-text text-neutral-200 font-bold text-5xl tracking-[0.6em] uppercase opacity-20 mix-blend-multiply select-none">
                著作権と商標法
              </div>
            </motion.div>
          </motion.section>

          {/* Cinematic Marquee */}
          <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="w-screen relative left-1/2 -translate-x-1/2 bg-neutral-900 text-white py-4 mb-0 overflow-hidden flex shadow-2xl"
          >
            <div className="animate-marquee whitespace-nowrap flex items-center">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="mx-4 text-sm font-mono tracking-widest uppercase flex items-center">
                  Entertainment Law <span className="text-[#E50000] mx-6">✦</span> Intellectual Property <span className="text-[#E50000] mx-6">✦</span> Japanese Media <span className="text-[#E50000] mx-6">✦</span> Copyright & Trademark <span className="text-[#E50000] mx-6">✦</span>
                </span>
              ))}
            </div>
          </motion.div>

          {/* Bento Grid About Section */}
          <motion.section 
            id="about" 
            className={`py-16 ${isDarkMode ? 'text-neutral-100' : 'text-neutral-900'}`}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
          >
            <div className="mb-8 flex items-end gap-4">
              <div>
                <h2 className="text-3xl font-serif font-medium mb-2">About Me</h2>
                <p className="text-neutral-500 text-sm uppercase tracking-widest font-semibold">Advocacy & Expertise</p>
              </div>
              <div className="text-neutral-300 font-bold text-2xl mb-1 hidden sm:block">私について</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Box 1: The Story */}
              <div className={`md:col-span-2 ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'} rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-500 border group relative overflow-hidden`}>
                {/* Blueprint Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-grid-pattern" />
                
                <h3 className="text-2xl font-serif font-medium mb-4 relative z-10">Advocacy & Persistence</h3>
                <div className={`space-y-4 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'} leading-relaxed font-light text-base relative z-10`}>
                  <p>
                    My path to the legal profession began with a seemingly impossible request. As a teenager, I noticed a gap in our education: we had a strong focus on memorization and analysis of texts, but no training on how to translate that into actionable knowledge. I approached the dean to establish a semichah (rabbinical ordination) program.
                  </p>
                  <p>
                    I was tasked with bringing together students, an instructor, and accreditation. I handled the logistics, synthesized curricula from three different institutions, and negotiated group rates. Eleven months later, thirteen of us sat for a four-hour final exam—and we all passed.
                  </p>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                    That experience taught me how one person can make a profound difference through advocacy, structure, and persistence.
                  </p>
                </div>
                
                {/* Blueprint Dimension Line */}
                <div className="mt-6 pt-6 border-t border-neutral-200/10 flex items-center justify-between text-[8px] font-mono text-neutral-400 uppercase tracking-widest relative z-10">
                  <span>Ref: ADV-2026</span>
                  <div className="h-px flex-1 mx-4 bg-neutral-200/10" />
                  <span>Status: Verified</span>
                </div>
              </div>

              {/* Box 2: Japanese IP */}
              <div className={`${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-900'} text-white rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group border transition-all duration-500 hover:-translate-y-2`}>
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 opacity-50"></div>
                
                {/* Decorative background element: Intricate Pattern */}
                <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-700 pointer-events-none select-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                
                <div className="absolute top-0 right-8 bottom-0 flex items-center opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-700 pointer-events-none select-none transform group-hover:scale-110">
                  <div className="text-8xl md:text-[120px] font-black tracking-widest" style={{ writingMode: 'vertical-rl' }}>
                    知的財産
                  </div>
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10 group-hover:rotate-12 transition-all duration-500">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-medium mb-3">Japanese IP Focus</h3>
                    <p className="text-white/70 text-sm leading-relaxed font-light mb-6">
                      Bridging the language gap to specialize in Japanese intellectual property within the global entertainment sector.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Copyright', 'Trademark', 'Licensing'].map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-mono uppercase tracking-widest">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 3: NYLS */}
              <div className={`${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'} rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border`}>
                {/* Blueprint Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-grid-pattern" />
                
                {/* Decorative background element */}
                <div className={`absolute -right-12 -top-12 ${isDarkMode ? 'text-neutral-800' : 'text-neutral-50'} opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none select-none absolute z-0`}>
                  <GraduationCap size={240} strokeWidth={1} />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-end">
                  <div className={`w-12 h-12 ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-100'} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 animate-float`} style={{ animationDelay: '1s' }}>
                    <GraduationCap className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
                  </div>
                  <div>
                    <div className={`inline-block px-2.5 py-1 ${isDarkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-600'} text-xs font-bold rounded mb-3`}>FALL 2026</div>
                    <h3 className="text-2xl font-serif font-medium mb-3">New York Law School</h3>
                    <p className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'} text-sm leading-relaxed mb-6`}>
                      Attending the J.D. program, building upon a foundation of rigorous textual analysis and complex legal frameworks.
                    </p>
                    
                    {/* Blueprint Dimension Line */}
                    <div className="pt-4 border-t border-neutral-200/10 flex items-center justify-between text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
                      <span>Ref: NYLS-2026</span>
                      <div className="h-px flex-1 mx-4 bg-neutral-200/10" />
                      <span>JD CANDIDATE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 4: Tech & Data */}
              <div className={`md:col-span-2 ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'} rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow border relative overflow-hidden group`}>
                {/* Blueprint Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-grid-pattern" />
                
                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif font-medium mb-3">Data & AI Proficiency</h3>
                    <p className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'} leading-relaxed font-light text-sm mb-6 max-w-2xl`}>
                      Unique intersection of legal analysis and technical capability. Completed the <strong className={`font-medium ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Google Data Analytics Career Certificate</strong> (SQL, R) and gained proficiency in AI technologies by training <strong className={`font-medium ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Stable Diffusion models</strong> for creative asset generation during my design internship.
                    </p>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {['SQL', 'R', 'Data Analysis', 'Stable Diffusion', 'AI Model Training'].map(skill => (
                        <span key={skill} className={`px-3 py-1 ${isDarkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-400' : 'bg-white border-neutral-200 text-neutral-600'} border rounded-full text-xs font-medium`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-neutral-800/50' : 'bg-white'} border ${isDarkMode ? 'border-neutral-700' : 'border-neutral-100'} text-[10px] font-mono text-neutral-400 leading-relaxed`}>
                      <span className="text-emerald-500">✓</span> Certification: Google Data Analytics<br />
                      <span className="text-emerald-500">✓</span> Specialization: Generative AI Models<br />
                      <span className="text-emerald-500">✓</span> Stack: SQL, R, Python, SDXL
                    </div>
                  </div>
                </div>

                {/* Blueprint Dimension Line */}
                <div className="pt-6 mt-6 border-t border-neutral-200/10 flex items-center justify-between text-[8px] font-mono text-neutral-400 uppercase tracking-widest relative z-10">
                  <span>Ref: TECH-2026</span>
                  <div className="h-px flex-1 mx-4 bg-neutral-200/10" />
                  <span>AI & DATA STACK</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Experience & Education */}
          <motion.section 
            id="experience" 
            className={`py-24 border-t ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
          >
            <CareerArchitecture isDarkMode={isDarkMode} />
          </motion.section>

          {/* Legal Insights & Japanese IP Section */}
          <motion.section 
            id="insights" 
            className={`py-24 border-t ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
          >
            <div className="mb-16 flex items-end gap-4">
              <div>
                <h2 className="text-3xl font-serif font-medium mb-2">Legal Insights</h2>
                <p className="text-neutral-500 text-sm uppercase tracking-widest font-semibold">IP & Entertainment Law</p>
              </div>
              <div className="text-neutral-300 font-bold text-2xl mb-1 hidden sm:block">法的洞察</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Case Files Column */}
              <div className="space-y-6">
                {[
                  {
                    id: "ai-copyright",
                    date: "MARCH 2026",
                    tag: "Copyright",
                    title: "The Ghost in the Machine: AI Training Data",
                    description: "Analyzing the industrialization of human expression and the 'transformation' of cultural heritage into proprietary weights.",
                    brief: "We are witnessing the industrialization of human expression. The legal question isn't just about 'copying'—it's about the 'transformation' of a collective cultural heritage into proprietary algorithmic weights. If the law fails to recognize the 'human-in-the-loop' as the primary source of value, we risk a future where the echo is louder than the voice. We must redefine 'Fair Use' for an era where consumption is performed by silicon, not souls.",
                    status: "PUBLISHED",
                    caseNo: "2026-CR-01"
                  },
                  {
                    id: "metaverse-tm",
                    date: "JANUARY 2026",
                    tag: "Trademark",
                    title: "Digital Sovereignty: The Virtual Borderlands",
                    description: "How brand identity survives when physical reality is optional and 'origin' becomes a fluid, decentralized concept.",
                    brief: "A trademark is a promise of origin. In a decentralized metaverse, 'origin' becomes a fluid concept. We must move beyond the 'likelihood of confusion' in the physical sense and toward a 'likelihood of dilution' in the experiential sense. Your brand isn't just a logo anymore; it's a verified coordinate in a digital multiverse. Protecting a brand in 3D space requires a 4D legal strategy that accounts for time, space, and user-generated reality.",
                    status: "UNDER REVIEW",
                    caseNo: "2026-TM-04"
                  },
                  {
                    id: "jp-licensing",
                    date: "FEBRUARY 2026",
                    tag: "Licensing",
                    title: "Cultural Alchemy: The Transpacific IP Bridge",
                    description: "Navigating the clash between Japanese 'Moral Rights' and Western 'Economic Rights' in global media distribution.",
                    brief: "Japanese IP is built on a foundation of 'Moral Rights' that often clash with Western 'Economic Rights.' Navigating this requires more than just a translation of words; it requires a translation of intent. To protect a character like a Pokémon or a Studio Ghibli spirit is to protect a piece of a nation's soul in a global marketplace. The 'Transpacific Bridge' isn't just about contracts; it's about the legal stewardship of cultural mythology.",
                    status: "ARCHIVED",
                    caseNo: "2026-JP-09"
                  }
                ].map((insight, idx) => {
                  const isExpanded = expandedInsightId === insight.id;
                  return (
                    <motion.div 
                      key={insight.id}
                      layout
                      onClick={() => setExpandedInsightId(isExpanded ? null : insight.id)}
                      whileHover={{ x: isExpanded ? 0 : 10 }}
                      className={`group relative p-8 rounded-[2rem] border transition-all cursor-pointer ${
                        isDarkMode 
                          ? 'bg-neutral-900 border-neutral-800 hover:border-blue-500/50' 
                          : 'bg-white border-neutral-200 hover:border-blue-500/50 shadow-sm hover:shadow-xl'
                      }`}
                    >
                      {/* Folder Tab Aesthetic */}
                      <div className={`absolute -top-3 left-8 px-4 py-1 rounded-t-lg text-[8px] font-mono font-bold uppercase tracking-[0.2em] ${
                        isDarkMode ? 'bg-neutral-800 text-neutral-500' : 'bg-neutral-100 text-neutral-400'
                      }`}>
                        CASE FILE: {insight.caseNo}
                      </div>

                      {/* Confidential Stamp */}
                      <div className={`absolute top-1/2 right-12 -translate-y-1/2 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity -rotate-12 pointer-events-none select-none z-0`}>
                        <div className={`border-4 ${isDarkMode ? 'border-white' : 'border-neutral-900'} px-4 py-2 rounded-lg text-6xl font-black uppercase tracking-tighter`}>
                          CONFIDENTIAL
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4 relative z-10">
                        <span className="text-[10px] font-mono text-neutral-400">{insight.date}</span>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider ${
                          isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {insight.tag}
                        </span>
                        <div className="h-px flex-1 bg-neutral-200/20" />
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border ${
                          insight.status === 'PUBLISHED' 
                            ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' 
                            : insight.status === 'ARCHIVED'
                              ? 'border-neutral-500/30 text-neutral-500 bg-neutral-500/5'
                              : 'border-amber-500/30 text-amber-500 bg-amber-500/5'
                        }`}>
                          {insight.status}
                        </span>
                      </div>

                      <h3 className={`text-2xl font-serif font-medium mb-4 group-hover:text-blue-500 transition-colors`}>
                        {insight.title}
                      </h3>
                      
                      <p className={`text-sm font-light leading-relaxed ${isExpanded ? 'mb-6' : 'mb-6'} ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {insight.description}
                      </p>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className={`p-6 rounded-2xl mb-6 font-mono text-[11px] leading-relaxed border-l-2 border-blue-500 ${
                              isDarkMode ? 'bg-blue-500/5 text-blue-100/80' : 'bg-blue-50 text-blue-900/80'
                            }`}>
                              <div className="flex items-center gap-2 mb-3 opacity-50">
                                <FileText size={12} />
                                <span className="uppercase tracking-widest font-black">Internal Briefing Note</span>
                              </div>
                              {insight.brief}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest group-hover:gap-4 transition-all">
                          {isExpanded ? 'Close Brief' : 'Read Brief'} <ArrowUpRight size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
                            <Copy size={14} className="text-neutral-400" />
                          </div>
                        </div>
                      </div>

                      {/* Subtle Scanline Effect on Hover */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-b from-transparent via-blue-500/20 to-transparent h-1/2 animate-scanline" />
                    </motion.div>
                  );
                })}
              </div>

              {/* Japanese IP Practice Card */}
              <div className={`h-full flex flex-col ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'} rounded-[2.5rem] p-8 md:p-12 border relative overflow-hidden group shadow-2xl`}>
                {/* Decorative Background: Japanese Calligraphy */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none select-none">
                  <div className="text-[180px] font-black tracking-widest leading-none" style={{ writingMode: 'vertical-rl' }}>
                    知的財産
                  </div>
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500 ${
                      isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-100'
                    }`}>
                      <Globe size={28} className="text-blue-500" />
                    </div>
                    <div>
                      <div className={`inline-block px-3 py-1 ${isDarkMode ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'} text-[10px] font-bold rounded-full mb-1 tracking-widest uppercase`}>
                        Specialization
                      </div>
                      <h3 className="text-3xl font-serif font-medium">Japanese IP Practice</h3>
                    </div>
                  </div>

                  <p className={`${isDarkMode ? 'text-neutral-300' : 'text-neutral-700'} font-light leading-relaxed mb-10 text-lg`}>
                    Navigating the unique legal intersection where Japanese creative heritage meets global market frameworks.
                  </p>

                  <div className="space-y-4 flex-1">
                    {[
                      { id: "jp-manga", title: "Manga & Anime Licensing", desc: "International distribution & sub-licensing frameworks.", icon: "📚", brief: "Licensing isn't just a contract; it's a cultural transmission protocol. We aren't just selling 'content'; we're exporting a narrative architecture that defines how the world perceives Japanese creativity. The legal challenge is ensuring the integrity of the 'Source Code' while allowing for the 'Forking' of local adaptations." },
                      { id: "jp-char", title: "Character Rights", desc: "Global protection of iconic Japanese IP assets.", icon: "👾", brief: "A character is more than a drawing; it's a set of behaviors, a history, and a brand promise. In the age of digital replication, we must protect the 'Essence' of the IP. This means legal frameworks that recognize the character as a living asset, capable of evolving across media while remaining anchored to its origin." },
                      { id: "jp-loc", title: "Localization Law", desc: "Legal nuances in cross-cultural adaptation.", icon: "⛩️", brief: "Localization is a legal act of translation. It's about navigating the 'Uncanny Valley' of cultural mismatch. We must ensure that the 'Spirit' of the work survives the 'Letter' of the law in a new territory. It's the art of making the foreign feel familiar without losing the magic of its difference." }
                    ].map((item, idx) => {
                      const isExpanded = expandedInsightId === item.id;
                      return (
                        <motion.div 
                          key={item.id}
                          layout
                          onClick={() => setExpandedInsightId(isExpanded ? null : item.id)}
                          whileHover={{ x: 15, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                          className={`flex flex-col gap-4 p-4 rounded-2xl border border-transparent transition-all cursor-pointer ${
                            isExpanded ? (isDarkMode ? 'bg-neutral-800/50' : 'bg-white shadow-md') : ''
                          }`}
                        >
                          <div className="flex gap-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${
                              isDarkMode ? 'bg-neutral-800' : 'bg-white'
                            }`}>
                              {item.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className={`font-bold text-base mb-1 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                {item.title}
                              </h4>
                              <p className={`text-xs ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                {item.desc}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <ChevronRight size={16} className={`text-blue-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </div>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className={`p-4 rounded-xl font-mono text-[10px] leading-relaxed border-l-2 border-blue-500 ${
                                  isDarkMode ? 'bg-blue-500/5 text-blue-100/70' : 'bg-blue-50 text-blue-900/70'
                                }`}>
                                  {item.brief}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Blueprint Dimension Line at bottom */}
                  <div className="mt-6 pt-6 border-t border-neutral-200/10 flex items-center justify-between text-[8px] font-mono text-neutral-500 uppercase tracking-widest">
                    <span>Ref: J-IP-2026</span>
                    <div className="h-px flex-1 mx-4 bg-neutral-200/10" />
                    <span>Verified: 100%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Creative Projects */}
          <motion.section 
            id="projects" 
            className={`py-24 border-t ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
          >
            <div className="mb-16 flex items-end gap-4">
              <div>
                <h2 className="text-3xl font-serif font-medium mb-2">Creative Projects</h2>
                <p className="text-neutral-500 text-sm uppercase tracking-widest font-semibold">Writing & Media</p>
              </div>
              <div className="text-neutral-300 font-bold text-2xl mb-1 hidden sm:block">創作活動</div>
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
                <span>Ref: CONTACT-2026</span>
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
