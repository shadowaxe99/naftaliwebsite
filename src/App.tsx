/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Scale, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
  };

  const floatingVariants = {
    float: (i: number) => ({
      y: [0, -10, 0],
      rotate: [0, i % 2 === 0 ? 2 : -2, 0],
      transition: {
        duration: 4 + i,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.5,
      },
    }),
  };

  const roles = [
    { icon: <Scale className="w-4 h-4" />, label: "Future Attorney", color: "bg-emerald-100/90 text-emerald-900 border-emerald-200" },
    { icon: <BookOpen className="w-4 h-4" />, label: "Novelist", color: "bg-amber-100/90 text-amber-900 border-amber-200" },
    { icon: <GraduationCap className="w-4 h-4" />, label: "Educator", color: "bg-blue-100/90 text-blue-900 border-blue-200" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FDFBF7] text-[#1A1C20] flex flex-col items-center justify-center p-6 font-sans selection:bg-[#D97757] selection:text-white cursor-none">
      
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full border border-[#D97757] pointer-events-none z-[9999] flex items-center justify-center"
        animate={{ x: mousePosition.x - 12, y: mousePosition.y - 12 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
      </motion.div>

      {/* Texture Overlay for Editorial Feel */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-50" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* Abstract Whimsical Background Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[30%] -right-[10%] w-[80vw] h-[80vw] rounded-full border border-[#D97757]/20 border-dashed opacity-60 pointer-events-none"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[30%] -left-[10%] w-[70vw] h-[70vw] rounded-full border border-[#1A1C20]/10 opacity-60 pointer-events-none"
      />

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl text-center relative z-10 flex flex-col items-center"
      >
        {/* Whimsical Colored Role Badges */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-16 md:mb-20">
          {roles.map((role, i) => (
            <motion.div
              key={role.label}
              custom={i}
              variants={floatingVariants}
              animate="float"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border shadow-sm backdrop-blur-md ${role.color}`}
            >
              {role.icon}
              <span className="text-xs uppercase tracking-[0.15em] font-bold">{role.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Massive Editorial Typography */}
        <motion.div variants={itemVariants} className="relative w-full mb-12 md:mb-16">
          <h1 className="font-serif flex flex-col items-center justify-center text-[18vw] md:text-[11rem] leading-[0.85] tracking-tighter text-[#1A1C20]">
            <span className="block transform -translate-x-4 md:-translate-x-12">Nathan</span>
            <span className="block italic text-[#D97757] transform translate-x-4 md:translate-x-12">Gruen</span>
          </h1>
        </motion.div>

        {/* Refined Subheadline */}
        <motion.p variants={itemVariants} className="text-xl md:text-3xl font-light text-[#1A1C20]/60 max-w-3xl mx-auto leading-relaxed tracking-wide px-4">
          Building a career at the intersection of <br className="hidden md:block" />
          <span className="italic font-serif text-[#1A1C20]">advocacy</span>, <span className="italic font-serif text-[#1A1C20]">storytelling</span>, and <span className="italic font-serif text-[#1A1C20]">rigorous textual analysis</span>.
        </motion.p>

        {/* Footer / CTA */}
        <motion.footer variants={itemVariants} className="mt-24 md:mt-32 flex flex-col items-center gap-10">
          <div className="flex items-center gap-6 opacity-50">
            <div className="h-px w-12 md:w-24 bg-[#1A1C20]" />
            <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-semibold">Digital Home Coming Soon</p>
            <div className="h-px w-12 md:w-24 bg-[#1A1C20]" />
          </div>
          
          <a 
            href="mailto:naftaligruen@gmail.com" 
            className="group relative inline-flex items-center gap-4 px-8 py-4 rounded-full bg-[#1A1C20] text-[#FDFBF7] overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#D97757]/20"
          >
            <span className="relative z-10 text-xs md:text-sm tracking-[0.2em] uppercase font-medium">Contact Nathan</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            <div className="absolute inset-0 bg-[#D97757] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
          </a>
        </motion.footer>

      </motion.main>
    </div>
  );
}
