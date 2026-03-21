import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Briefcase, GraduationCap, Mail, MapPin, Phone, Globe, 
  Mic, PenTool, ChevronRight, Command, Search, Copy, Check, 
  Download, ArrowUpRight, Terminal, Database, Code, Lock
} from 'lucide-react';
import { Analytics } from "@vercel/analytics/react";
import LockScreen from './components/LockScreen';
import ArcadeCard from './components/ArcadeCard';
import CareerArchitecture from './components/CareerArchitecture';

// --- Components ---

function CopyButton({ text, label, icon: Icon }: { text: string, label: string, icon: any }) {
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
      className="group flex items-center justify-between w-full p-4 bg-white border border-neutral-200 rounded-2xl hover:border-neutral-300 hover:shadow-sm transition-all text-left"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-900 group-hover:bg-neutral-100 transition-colors">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">{label}</p>
          <p className="text-neutral-900 font-medium">{text}</p>
        </div>
      </div>
      <div className="text-neutral-400 group-hover:text-neutral-900 transition-colors">
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
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-neutral-900 selection:text-white relative">
      <div className="film-grain" />
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-neutral-900 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 glass-nav px-6 py-4 flex justify-between items-center">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-serif text-xl font-bold tracking-tight cursor-pointer hover:opacity-70 transition-opacity"
        >
          NG.
        </button>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-neutral-600">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            Home
          </button>
          <a href="#about" className="hover:text-neutral-900 transition-colors">About</a>
          <a href="#experience" className="hover:text-neutral-900 transition-colors">Experience</a>
          <a href="#projects" className="hover:text-neutral-900 transition-colors">Projects</a>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCmdOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-500 rounded-lg text-xs font-medium transition-colors border border-neutral-200"
          >
            <Search size={14} />
            <span>Search</span>
            <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-neutral-200 shadow-sm ml-2">⌘K</kbd>
          </button>
          <a href="#contact" className="px-5 py-2 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors shadow-sm">
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
              className="fixed inset-0 z-50 cmd-backdrop"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white/80 backdrop-blur-xl border border-neutral-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center px-4 py-3 border-b border-neutral-100">
                <Search size={18} className="text-neutral-400 mr-3" />
                <input 
                  ref={inputRef}
                  type="text" 
                  placeholder="Type a command or search..." 
                  className="flex-1 bg-transparent outline-none text-neutral-900 placeholder:text-neutral-400 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <kbd className="font-mono text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-500 border border-neutral-200">ESC</kbd>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                <div className="px-2 py-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Navigation</div>
                <button onClick={() => handleNav('about')} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-100 rounded-xl text-sm text-left transition-colors">
                  <Terminal size={16} className="text-neutral-500" /> <span>About Me</span>
                </button>
                <button onClick={() => handleNav('experience')} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-100 rounded-xl text-sm text-left transition-colors">
                  <Briefcase size={16} className="text-neutral-500" /> <span>Experience & Education</span>
                </button>
                <button onClick={() => handleNav('projects')} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-100 rounded-xl text-sm text-left transition-colors">
                  <BookOpen size={16} className="text-neutral-500" /> <span>Creative Projects</span>
                </button>
                
                <div className="px-2 py-1.5 mt-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Actions</div>
                <button onClick={() => handleCopyFromCmd('naftaligruen@gmail.com')} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-100 rounded-xl text-sm text-left transition-colors">
                  <Copy size={16} className="text-neutral-500" /> <span>Copy Email Address</span>
                </button>
                <button onClick={() => handleCopyFromCmd('646-415-3514')} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-100 rounded-xl text-sm text-left transition-colors">
                  <Phone size={16} className="text-neutral-500" /> <span>Copy Phone Number</span>
                </button>
                <button onClick={() => { setCmdOpen(false); alert('Resume download initiated.'); }} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-100 rounded-xl text-sm text-left transition-colors">
                  <Download size={16} className="text-neutral-500" /> <span>Download Résumé</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="relative">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none" />

        <div className="relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <motion.section 
            className="min-h-[75vh] flex flex-col justify-center"
            initial="initial" animate="animate" variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="mb-8 inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-neutral-200 bg-white/50 backdrop-blur-md text-xs font-semibold text-neutral-700 uppercase tracking-wider shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>J.D. Candidate, Fall 2026</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-6xl md:text-8xl lg:text-[7rem] font-serif font-medium leading-[1.05] tracking-tight max-w-5xl mb-8">
              Nathan Gruen
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-neutral-600 max-w-3xl font-light leading-relaxed mb-12">
              Aspiring attorney focusing on <strong className="font-medium text-neutral-900">Copyright & Trademark Law</strong>. 
              Bridging the gap in international entertainment with a specialization in Japanese Intellectual Property.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
              <a href="#about" className="group px-8 py-4 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-lg shadow-neutral-900/20">
                Explore Profile <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <button onClick={() => setCmdOpen(true)} className="px-8 py-4 bg-white border border-neutral-200 text-neutral-900 rounded-full font-medium hover:bg-neutral-50 transition-all shadow-sm flex items-center gap-2">
                <Command size={18} /> Command Menu
              </button>
            </motion.div>

            {/* Vertical Japanese Accent */}
            <motion.div 
              variants={fadeIn}
              className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 hidden lg:block"
            >
              <div className="vertical-text text-neutral-300 font-bold text-4xl tracking-[0.5em] uppercase opacity-50 mix-blend-multiply">
                著作権と商標法
              </div>
            </motion.div>
          </motion.section>

          {/* Cinematic Marquee */}
          <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="w-screen relative left-1/2 -translate-x-1/2 bg-neutral-900 text-white py-5 mb-24 overflow-hidden flex shadow-2xl"
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
            className="py-24"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
          >
            <div className="mb-12 flex items-end gap-4">
              <div>
                <h2 className="text-3xl font-serif font-medium mb-2">About Me</h2>
                <p className="text-neutral-500 text-sm uppercase tracking-widest font-semibold">Advocacy & Expertise</p>
              </div>
              <div className="text-neutral-300 font-bold text-2xl mb-1 hidden sm:block">私について</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Box 1: The Story */}
              <div className="md:col-span-2 bg-white border border-neutral-200 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6">
                  <Terminal className="text-neutral-900" size={24} />
                </div>
                <h3 className="text-2xl font-serif font-medium mb-4">Advocacy & Persistence</h3>
                <div className="space-y-4 text-neutral-600 leading-relaxed font-light">
                  <p>
                    My path to the legal profession began with a seemingly impossible request. As a teenager, I noticed a gap in our education: we had a strong focus on memorization and analysis of texts, but no training on how to translate that into actionable knowledge. I approached the dean to establish a semichah (rabbinical ordination) program.
                  </p>
                  <p>
                    I was tasked with bringing together students, an instructor, and accreditation. I handled the logistics, synthesized curricula from three different institutions, and negotiated group rates. Eleven months later, thirteen of us sat for a four-hour final exam—and we all passed.
                  </p>
                  <p className="font-medium text-neutral-900">
                    That experience taught me how one person can make a profound difference through advocacy, structure, and persistence. Becoming a lawyer will enable me to do that on a more meaningful scale.
                  </p>
                </div>
              </div>

              {/* Box 2: Japanese IP */}
              <div className="bg-neutral-900 text-white rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 opacity-50"></div>
                
                {/* Decorative background element */}
                <div className="absolute top-0 right-8 bottom-0 flex items-center opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none select-none">
                  <div className="text-8xl md:text-[120px] font-black tracking-widest" style={{ writingMode: 'vertical-rl' }}>
                    知的財産
                  </div>
                </div>

                <div className="relative z-10 h-full flex flex-col justify-end">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif font-medium mb-3">Japanese IP Focus</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Currently learning Japanese to bridge the language gap and specialize in Japanese intellectual property within the entertainment sector.
                  </p>
                </div>
              </div>

              {/* Box 3: NYLS */}
              <div className="bg-white border border-neutral-200 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                {/* Decorative background element */}
                <div className="absolute -right-12 -top-12 text-neutral-50 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none select-none">
                  <GraduationCap size={240} strokeWidth={1} />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-end">
                  <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <GraduationCap className="w-6 h-6 text-neutral-900" />
                  </div>
                  <div>
                    <div className="inline-block px-2.5 py-1 bg-neutral-100 text-neutral-600 text-xs font-bold rounded mb-3">FALL 2026</div>
                    <h3 className="text-2xl font-serif font-medium mb-3">New York Law School</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                      Attending the J.D. program, building upon a foundation of rigorous textual analysis and complex legal frameworks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 4: Tech & Data */}
              <div className="md:col-span-2 bg-neutral-50 border border-neutral-200 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-neutral-100">
                    <Database className="text-neutral-900" size={24} />
                  </div>
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-neutral-100">
                    <Code className="text-neutral-900" size={24} />
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-medium mb-3">Data & AI Proficiency</h3>
                <p className="text-neutral-600 leading-relaxed font-light mb-6 max-w-2xl">
                  Unique intersection of legal analysis and technical capability. Completed the <strong className="font-medium text-neutral-900">Google Data Analytics Career Certificate</strong> (SQL, R) and gained proficiency in AI technologies by training <strong className="font-medium text-neutral-900">Stable Diffusion models</strong> for creative asset generation during my design internship.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['SQL', 'R', 'Data Analysis', 'Stable Diffusion', 'AI Model Training'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-white border border-neutral-200 rounded-full text-xs font-medium text-neutral-600">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Experience & Education */}
          <motion.section 
            id="experience" 
            className="py-24 border-t border-neutral-200"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
          >
            <CareerArchitecture />
          </motion.section>

          {/* Creative Projects */}
          <motion.section 
            id="projects" 
            className="py-24 border-t border-neutral-200"
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
              <div className="col-span-1 md:col-span-2 bg-neutral-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/10 transition-colors duration-700"></div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-xs font-medium text-white uppercase tracking-wider mb-6">
                      <BookOpen size={14} />
                      <span>Forthcoming Publication</span>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-serif font-medium mb-4">The Kohen's Treasure</h3>
                    <p className="text-white/70 text-lg font-light leading-relaxed mb-6">
                      A full-length novel co-authored with Dr. Benny Gruen, published by ArtScroll Mesorah Publications—the leading publisher of Jewish literature worldwide.
                    </p>
                    <p className="text-white/50 text-sm leading-relaxed">
                      Blending historical fiction and religious thriller, the narrative follows a young man who uncovers a two-thousand-year-old cipher tied to the destruction of the Second Temple, exploring questions of faith, heritage, and identity.
                    </p>
                  </div>
                  <div className="hidden lg:flex justify-end">
                    <div className="w-56 h-80 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-lg flex items-center justify-center shadow-2xl transform rotate-3 group-hover:rotate-6 group-hover:scale-105 transition-all duration-500 backdrop-blur-sm">
                      <BookOpen className="w-16 h-16 text-white/30" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Projects */}
              <div className="bg-white border border-neutral-200 rounded-3xl p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mb-6 border border-neutral-100">
                  <PenTool className="w-6 h-6 text-neutral-900" />
                </div>
                <h3 className="text-xl font-medium mb-2">Self-Published Author</h3>
                <p className="text-neutral-400 font-mono text-xs mb-4">2020 – Present</p>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Authored and self-published four full-length novels spanning Romantic Comedy, Teen Mental Health, and Fantasy genres. Managed the entire publication lifecycle from drafting to distribution.
                </p>
              </div>

              <div className="bg-white border border-neutral-200 rounded-3xl p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mb-6 border border-neutral-100">
                  <Mic className="w-6 h-6 text-neutral-900" />
                </div>
                <h3 className="text-xl font-medium mb-2">Freelance Voice Actor</h3>
                <p className="text-neutral-400 font-mono text-xs mb-4">2021 – 2024</p>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Contributed vocal performances to various digital media projects, reaching a global audience of over 14 million viewers.
                </p>
              </div>

              {/* Arcade Card */}
              <div className="col-span-1 md:col-span-2 mt-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-serif font-medium mb-1">Interactive Playground</h3>
                    <p className="text-neutral-500 text-sm">A custom HTML5 canvas experience. Take a break and play.</p>
                  </div>
                  <div className="hidden sm:flex gap-2">
                    <span className="px-3 py-1 bg-neutral-100 text-neutral-500 text-xs font-mono rounded-full">TypeScript</span>
                    <span className="px-3 py-1 bg-neutral-100 text-neutral-500 text-xs font-mono rounded-full">Canvas API</span>
                  </div>
                </div>
                <ArcadeCard />
              </div>
            </div>
          </motion.section>

          {/* Contact Section */}
          <motion.section 
            id="contact" 
            className="py-24 border-t border-neutral-200"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
          >
            <div className="bg-neutral-50 border border-neutral-200 rounded-[2.5rem] p-8 md:p-16 text-center max-w-4xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent opacity-50"></div>
              
              <div className="text-neutral-300 font-bold text-2xl mb-4">連絡先</div>
              <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6">Let's Connect</h2>
              <p className="text-neutral-600 text-lg font-light mb-12 max-w-2xl mx-auto">
                Whether you're interested in discussing intellectual property law, creative projects, or opportunities in the entertainment sector, I'd love to hear from you.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <CopyButton text="naftaligruen@gmail.com" label="Email Address" icon={Mail} />
                <CopyButton text="646-415-3514" label="Phone Number" icon={Phone} />
                <div className="sm:col-span-2 flex items-center justify-between w-full p-4 bg-white border border-neutral-200 rounded-2xl text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-900">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Location</p>
                      <p className="text-neutral-900 font-medium">Brooklyn, NY</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-200 text-center text-neutral-500 text-sm bg-white">
        <p>&copy; {new Date().getFullYear()} Nathan Gruen. All rights reserved.</p>
        <p className="mt-2 text-xs font-mono">J.D. Candidate &middot; Author &middot; Creative Consultant</p>
      </footer>
      <Analytics />
    </div>
  );
}
