/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useTransform, useSpring, useMotionValue } from 'motion/react';
import { Scale, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

export default function App() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);

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

  const springConfig = { damping: 25, stiffness: 150 };
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
    <div className={`min-h-screen relative overflow-hidden bg-[#FDFBF7] text-[#1A1C20] flex flex-col items-center justify-center p-6 font-sans selection:bg-[#D97757] selection:text-white ${!isMobile ? 'cursor-none' : ''}`}>
      
      {/* Custom Cursor (Desktop Only) */}
      {!isMobile && (
        <motion.div
          className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#D97757]/40 pointer-events-none z-[9999] flex items-center justify-center mix-blend-difference"
          style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
        </motion.div>
      )}

      {/* Subtle Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-50" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* Dynamic Background Elements */}
      <motion.div
        style={{ 
          x: useTransform(cursorX, [0, 2000], [20, -20]),
          y: useTransform(cursorY, [0, 2000], [20, -20])
        }}
        className="absolute -top-[20%] -right-[10%] w-[90vw] h-[90vw] rounded-full border border-[#D97757]/10 border-dashed opacity-40 pointer-events-none"
      />
      <motion.div
        style={{ 
          x: useTransform(cursorX, [0, 2000], [-30, 30]),
          y: useTransform(cursorY, [0, 2000], [-30, 30])
        }}
        className="absolute -bottom-[20%] -left-[10%] w-[80vw] h-[80vw] rounded-full border border-[#1A1C20]/5 opacity-40 pointer-events-none"
      />

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl text-center relative z-10 flex flex-col items-center"
      >
        {/* 3D Animated Role Badges */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12 md:mb-20">
          {roles.map((role, i) => (
            <motion.div
              key={role.label}
              custom={i}
              variants={floatingVariants}
              animate="float"
              whileHover={{ scale: 1.1, y: -5 }}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full border backdrop-blur-xl transition-all duration-300 cursor-default ${role.color}`}
            >
              {role.icon}
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold drop-shadow-sm">{role.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Hero Typography */}
        <motion.div variants={itemVariants} className="relative w-full mb-10 md:mb-16">
          <h1 className="font-serif flex flex-col items-center justify-center text-[20vw] md:text-[13rem] leading-[0.8] tracking-tighter text-[#1A1C20]">
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
        <motion.p variants={itemVariants} className="text-lg md:text-4xl font-light text-[#1A1C20]/70 max-w-4xl mx-auto leading-tight tracking-tight px-6">
          Building a career at the intersection of <br className="hidden md:block" />
          <span className="italic font-serif text-[#1A1C20] border-b border-[#D97757]/30 pb-1">advocacy</span>, <span className="italic font-serif text-[#1A1C20] border-b border-[#D97757]/30 pb-1">storytelling</span>, and <span className="italic font-serif text-[#1A1C20] border-b border-[#D97757]/30 pb-1">rigorous textual analysis</span>.
        </motion.p>

        {/* Footer Section */}
        <motion.footer variants={itemVariants} className="mt-20 md:mt-32 flex flex-col items-center gap-12">
          <div className="flex items-center gap-8 opacity-40 group">
            <div className="h-px w-16 md:w-32 bg-[#1A1C20] transition-all duration-700 group-hover:w-48" />
            <p className="text-[9px] md:text-xs uppercase tracking-[0.4em] font-bold">Digital Home Coming Soon</p>
            <div className="h-px w-16 md:w-32 bg-[#1A1C20] transition-all duration-700 group-hover:w-48" />
          </div>
          
          <a 
            href="mailto:naftaligruen@gmail.com" 
            className="group relative inline-flex items-center gap-5 px-10 py-5 rounded-full bg-[#1A1C20] text-[#FDFBF7] overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-[0_20px_50px_rgba(217,119,87,0.2)]"
          >
            <span className="relative z-10 text-xs md:text-sm tracking-[0.25em] uppercase font-bold">Connect with Nathan</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
            <div className="absolute inset-0 bg-[#D97757] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
          </a>
        </motion.footer>

      </motion.main>
    </div>
  );
}
