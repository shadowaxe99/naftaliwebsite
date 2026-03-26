/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useTransform, useSpring, useMotionValue, AnimatePresence } from 'motion/react';
import { Scale, BookOpen, GraduationCap, ArrowRight, Linkedin, Twitter, FileText, Check, Copy, Moon, Sun, X, MousePointer2 } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';

export default function App() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [useCustomCursor, setUseCustomCursor] = useState(true);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('naftaligruen@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile, mouseX, mouseY]);

  const springConfig = { damping: 15, stiffness: 300 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
  };

  const floatingVariants = {
    float: (i: number) => ({
      y: [0, -16, 0],
      rotate: [i % 2 === 0 ? -2 : 2, i % 2 === 0 ? 3 : -3, i % 2 === 0 ? -2 : 2],
      scale: [1, 1.03, 1],
      transition: {
        duration: 4 + (i * 0.5),
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.2,
      },
    }),
  };

  const roles = useMemo(() => [
    { 
      icon: <Scale className="w-4 h-4 drop-shadow-sm" />, 
      label: "Future Attorney", 
      color: "bg-gradient-to-b from-emerald-100 to-emerald-50 border-emerald-200/60 shadow-[0_12px_24px_-8px_rgba(16,185,129,0.5),inset_0_2px_4px_rgba(255,255,255,0.9)] text-emerald-900" 
    },
    { 
      icon: <BookOpen className="w-4 h-4 drop-shadow-sm" />, 
      label: "Novelist", 
      color: "bg-gradient-to-b from-amber-100 to-amber-50 border-amber-200/60 shadow-[0_12px_24px_-8px_rgba(245,158,11,0.5),inset_0_2px_4px_rgba(255,255,255,0.9)] text-amber-900" 
    },
    { 
      icon: <GraduationCap className="w-4 h-4 drop-shadow-sm" />, 
      label: "Educator", 
      color: "bg-gradient-to-b from-blue-100 to-blue-50 border-blue-200/60 shadow-[0_12px_24px_-8px_rgba(59,130,246,0.5),inset_0_2px_4px_rgba(255,255,255,0.9)] text-blue-900" 
    },
  ], []);

  return (
    <div className={`h-screen relative overflow-hidden transition-colors duration-700 ${darkMode ? 'bg-[#0A0B0D] text-[#FDFBF7]' : 'bg-[#FDFBF7] text-[#1A1C20]'} flex flex-col items-center justify-center p-6 font-sans selection:bg-[#D97757] selection:text-white ${(!isMobile && useCustomCursor) ? 'cursor-none' : ''}`}>
      
      {/* Editorial Frame */}
      <div className={`pointer-events-none fixed inset-0 z-[100] border-[12px] md:border-[24px] transition-colors duration-700 ${darkMode ? 'border-white/5' : 'border-white/40'} mix-blend-overlay`} />
      <div className={`pointer-events-none fixed inset-0 z-[100] border-[1px] md:border-[2px] transition-colors duration-700 ${darkMode ? 'border-white/10' : 'border-[#1A1C20]/5'} m-[12px] md:m-[24px]`} />

      {/* Controls */}
      <div className="fixed top-8 right-8 md:top-12 md:right-12 z-[110] flex items-center gap-3">
        {/* Cursor Toggle */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setUseCustomCursor(!useCustomCursor)}
          className={`p-3 rounded-full border transition-all duration-300 ${darkMode ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-black/5 border-black/10 text-black hover:bg-black/10'} ${!useCustomCursor ? 'bg-[#D97757]/20 border-[#D97757]/40 text-[#D97757]' : ''}`}
          title={useCustomCursor ? "Switch to System Cursor" : "Switch to Custom Cursor"}
        >
          <MousePointer2 className="w-5 h-5" />
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-full border transition-all duration-300 ${darkMode ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-black/5 border-black/10 text-black hover:bg-black/10'}`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Custom Cursor (Desktop Only) */}
      {!isMobile && useCustomCursor && (
        <motion.div
          className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#D97757]/40 pointer-events-none z-[9999] flex items-center justify-center mix-blend-difference"
          style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
        </motion.div>
      )}

      {/* Subtle Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-50 mix-blend-multiply" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* Vignette Effect */}
      <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(26,28,32,0.03)_100%)]" />

      {/* Central Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] transition-colors duration-700 ${darkMode ? 'bg-[#D97757]/[0.08]' : 'bg-[#D97757]/[0.03]'} rounded-full blur-[100px] pointer-events-none`} />

      {/* Status Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute top-8 left-8 md:top-12 md:left-12 z-50 flex items-center gap-3"
      >
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </div>
        <span className={`text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-700 ${darkMode ? 'text-white/40' : 'text-[#1A1C20]/60'}`}>Accepting Inquiries</span>
      </motion.div>

      {/* Dynamic Background Elements */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className={`absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full transition-colors duration-700 ${darkMode ? 'bg-emerald-900/10' : 'bg-emerald-100/30'} blur-[120px] pointer-events-none mix-blend-multiply`}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className={`absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full transition-colors duration-700 ${darkMode ? 'bg-amber-900/10' : 'bg-amber-100/30'} blur-[120px] pointer-events-none mix-blend-multiply`}
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], y: [0, -50, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full transition-colors duration-700 ${darkMode ? 'bg-blue-900/10' : 'bg-blue-100/30'} blur-[100px] pointer-events-none mix-blend-multiply`}
      />

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl text-center relative z-10 flex flex-col items-center"
      >
        {/* 3D Animated Role Badges */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 md:mb-12">
          {roles.map((role, i) => (
            <motion.div
              key={role.label}
              custom={i}
              variants={floatingVariants}
              animate="float"
              whileHover={{ scale: 1.1, y: -5 }}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full border backdrop-blur-xl transition-all duration-300 cursor-default ${darkMode ? 'bg-white/5 border-white/10 text-white shadow-none' : role.color}`}
            >
              {role.icon}
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold drop-shadow-sm">{role.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Hero Typography */}
        <motion.div variants={itemVariants} className="relative w-full mb-6 md:mb-10">
          <h1 className={`font-serif flex flex-col items-center justify-center text-[20vw] md:text-[11rem] leading-[0.8] tracking-tighter transition-colors duration-700 ${darkMode ? 'text-white' : 'text-[#1A1C20]'} drop-shadow-sm`}>
            <motion.span 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="block transform md:-translate-x-16"
            >
              Nathan
            </motion.span>
            <motion.span 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="block italic text-[#D97757] transform md:translate-x-16"
            >
              Gruen
            </motion.span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-6">
          <p className={`text-lg md:text-2xl font-light transition-colors duration-700 ${darkMode ? 'text-white/60' : 'text-[#1A1C20]/70'} max-w-4xl mx-auto leading-relaxed tracking-tight px-6`}>
            Building a career at the intersection of <br className="hidden md:block" />
            <span className={`italic font-serif font-medium transition-colors duration-700 ${darkMode ? 'text-white' : 'text-[#1A1C20]'}`}>advocacy</span>, <span className={`italic font-serif font-medium transition-colors duration-700 ${darkMode ? 'text-white' : 'text-[#1A1C20]'}`}>storytelling</span>, and <span className={`italic font-serif font-medium transition-colors duration-700 ${darkMode ? 'text-white' : 'text-[#1A1C20]'}`}>rigorous textual analysis</span>.
          </p>

          <button 
            onClick={() => setShowAbout(true)}
            className={`text-[10px] uppercase tracking-[0.3em] font-bold border-b transition-all duration-300 pb-1 ${darkMode ? 'text-white/40 border-white/20 hover:text-white hover:border-white' : 'text-black/40 border-black/20 hover:text-black hover:border-black'}`}
          >
            Read Brief Bio
          </button>
        </motion.div>

        {/* Footer Section */}
        <motion.footer variants={itemVariants} className="mt-12 md:mt-16 flex flex-col items-center gap-8 relative z-20">
          <div className="flex items-center gap-8 opacity-40 group">
            <div className={`h-px w-16 md:w-32 transition-all duration-700 group-hover:w-48 ${darkMode ? 'bg-white' : 'bg-[#1A1C20]'}`} />
            <p className="text-[9px] md:text-xs uppercase tracking-[0.4em] font-bold">Digital Home Coming Soon</p>
            <div className={`h-px w-16 md:w-32 transition-all duration-700 group-hover:w-48 ${darkMode ? 'bg-white' : 'bg-[#1A1C20]'}`} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <button 
              onClick={handleCopyEmail}
              className={`group relative inline-flex items-center gap-5 px-10 py-5 rounded-full bg-transparent border overflow-hidden transition-all duration-700 hover:border-transparent hover:scale-105 hover:shadow-[0_20px_50px_rgba(217,119,87,0.2)] ${darkMode ? 'text-white border-white/20' : 'text-[#1A1C20] border-[#1A1C20]/20'}`}
            >
              <div className={`absolute inset-0 transition-colors duration-700 ${darkMode ? 'bg-[#0A0B0D]' : 'bg-[#FDFBF7]'} opacity-50 backdrop-blur-md`} />
              <div className={`absolute inset-0 bg-[#D97757] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700 ease-[0.16,1,0.3,1]`} />
              <span className={`relative z-10 text-xs md:text-sm tracking-[0.25em] uppercase font-bold group-hover:text-white transition-colors duration-500`}>
                {copied ? 'Email Copied!' : 'Connect with Nathan'}
              </span>
              {copied ? (
                <Check className="relative z-10 w-5 h-5 text-emerald-400" />
              ) : (
                <Copy className="relative z-10 w-5 h-5 group-hover:scale-110 group-hover:text-white transition-all duration-500" />
              )}
            </button>

            <div className="flex items-center gap-4">
              {[
                { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com", label: "Twitter" },
                { icon: <FileText className="w-5 h-5" />, href: "#", label: "Resume" }
              ].map((link, i) => (
                <a 
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className={`p-4 rounded-full border transition-all duration-300 hover:scale-110 backdrop-blur-sm ${darkMode ? 'border-white/10 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5' : 'border-[#1A1C20]/10 text-[#1A1C20]/60 hover:text-[#1A1C20] hover:border-[#1A1C20]/30 hover:bg-[#1A1C20]/5'}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.footer>

      </motion.main>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-black/40"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative w-full max-w-2xl p-8 md:p-12 rounded-[2rem] border shadow-2xl ${darkMode ? 'bg-[#14161A] border-white/10 text-white' : 'bg-white border-black/5 text-[#1A1C20]'}`}
            >
              <button 
                onClick={() => setShowAbout(false)}
                className="absolute top-8 right-8 p-2 rounded-full hover:bg-current/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">The Narrative</p>
                  <h2 className="text-3xl md:text-5xl font-serif italic">A Multi-Hyphenate Approach</h2>
                </div>
                
                <div className={`space-y-6 text-lg md:text-xl font-light leading-relaxed ${darkMode ? 'text-white/70' : 'text-black/70'}`}>
                  <p>
                    Nathan Gruen is a scholar and creator dedicated to the power of language. Currently pursuing a legal career, he brings a novelist's eye for detail and an educator's passion for clarity to every project.
                  </p>
                  <p>
                    His work focuses on how rigorous textual analysis can be used to advocate for justice, build compelling narratives, and empower others through education.
                  </p>
                </div>

                <div className="pt-8 border-t border-current/10 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-current/5 text-xs font-bold tracking-widest uppercase">
                    <Scale className="w-3 h-3" /> Law
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-current/5 text-xs font-bold tracking-widest uppercase">
                    <BookOpen className="w-3 h-3" /> Literature
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-current/5 text-xs font-bold tracking-widest uppercase">
                    <GraduationCap className="w-3 h-3" /> Education
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
