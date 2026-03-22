import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Mail, Phone, MapPin, Download, ExternalLink } from 'lucide-react';
import { playUISound } from '../utils/sound';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  globalMute: boolean;
}

export default function ResumeModal({ isOpen, onClose, isDarkMode, globalMute }: ResumeModalProps) {
  useEffect(() => {
    if (isOpen) {
      playUISound('expand', globalMute);
    } else {
      playUISound('collapse', globalMute);
    }
  }, [isOpen, globalMute]);

  const handlePrint = () => {
    document.body.classList.add('printing');
    setTimeout(() => {
      window.print();
      document.body.classList.remove('printing');
    }, 100);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 resume-modal-wrapper">
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-md resume-modal-backdrop"
            />
            
            <motion.div
              id="resume-print-container"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-4xl max-h-[90vh] print:max-h-none overflow-hidden print:overflow-visible rounded-3xl print:rounded-none shadow-2xl print:shadow-none flex flex-col ${
                isDarkMode ? 'bg-neutral-900 text-neutral-100' : 'bg-paper text-neutral-900'
              }`}
            >
              {/* Blueprint Background Overlay */}
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none no-print" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 no-print" />
              
            {/* Header / Toolbar */}
            <div className={`flex items-center justify-between px-6 py-4 border-b no-print relative z-10 ${
              isDarkMode ? 'border-neutral-800 bg-neutral-900/50' : 'border-neutral-100 bg-paper/50'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                  <Download size={16} />
                </div>
                <div>
                  <h2 className="font-serif font-medium leading-none">Nathan Gruen</h2>
                  <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Official Résumé — v2029.03</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className={`p-2 rounded-xl transition-all active:scale-95 ${
                    isDarkMode ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white' : 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900'
                  }`}
                  title="Print Résumé"
                >
                  <Printer size={20} />
                </button>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-xl transition-all active:scale-95 ${
                    isDarkMode ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white' : 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Resume Content */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 print:p-8 print:overflow-visible resume-content relative z-10">
              <div className="max-w-4xl mx-auto">
                {/* Personal Info */}
                <header className="mb-10 text-center md:text-left print:text-left relative border-b pb-8 print:border-neutral-300">
                  <div className="absolute -left-8 top-0 bottom-0 w-px bg-blue-600/20 hidden md:block print:hidden" />
                  <h1 className="text-5xl font-serif font-bold mb-4 tracking-tight print:text-black">Nathan Gruen</h1>
                  <div className="flex flex-wrap justify-center md:justify-start print:justify-start gap-y-2 gap-x-6 text-sm text-neutral-500 print:text-neutral-600 font-medium">
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-600 print:text-neutral-800" /> 3323 Avenue K, Brooklyn, NY 11210</span>
                    <span className="flex items-center gap-1.5"><Phone size={14} className="text-blue-600 print:text-neutral-800" /> 201-719-1103</span>
                    <span className="flex items-center gap-1.5"><Mail size={14} className="text-blue-600 print:text-neutral-800" /> naftaligruen@gmail.com</span>
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_2.5fr] print:grid-cols-[1fr_2.5fr] gap-12 print:gap-8">
                  {/* Left Column: Skills & Meta */}
                  <aside className="space-y-8 print:space-y-6">
                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 print:text-black mb-3">Technical Skills</h3>
                      <ul className="space-y-1.5 text-sm opacity-80 print:opacity-100 font-light print:text-black">
                        <li>Data Analysis (SQL, Basic R)</li>
                        <li>Microsoft Excel & Google Suite</li>
                        <li>HTML / CSS</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 print:text-black mb-3">Creative Skills</h3>
                      <ul className="space-y-1.5 text-sm opacity-80 print:opacity-100 font-light print:text-black">
                        <li>Adobe Creative Suite</li>
                        <li>Blender 3D</li>
                        <li>Audacity</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 print:text-black mb-3">Languages</h3>
                      <ul className="space-y-1.5 text-sm opacity-80 print:opacity-100 font-light print:text-black">
                        <li>English (Native)</li>
                        <li>Hebrew (Reading & Liturgy)</li>
                        <li>Japanese (Learning)</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 print:text-black mb-3">Involvement</h3>
                      <div className="space-y-3 print:text-black">
                        <div>
                          <p className="text-sm font-bold">Mentor</p>
                          <p className="text-xs opacity-60 print:opacity-80">My Extended Family (2021–2022)</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold">Choir Member</p>
                          <p className="text-xs opacity-60 print:opacity-80">Synagogue Choir</p>
                        </div>
                      </div>
                    </section>
                  </aside>

                  {/* Right Column: Main Content */}
                  <div className="print:block">
                    {/* Education */}
                    <section className="print:break-inside-avoid">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-lg font-serif font-bold print:text-black">Education</h3>
                        <div className="h-px flex-1 bg-neutral-200 print:bg-neutral-300" />
                      </div>
                      <div className="space-y-5">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold print:text-black">Juris Doctor (J.D.) Candidate</h4>
                            <span className="text-xs font-mono opacity-50 print:opacity-80 print:text-black">Expected 2029</span>
                          </div>
                          <p className="text-sm text-blue-600 print:text-neutral-700 mb-1.5">New York Law School, New York, NY</p>
                          <p className="text-xs opacity-70 print:opacity-100 print:text-black leading-relaxed">
                            Specializing in Intellectual Property, Entertainment Law, and Digital Rights.
                          </p>
                        </div>
                        <div className="h-px w-full bg-neutral-100 print:bg-neutral-200" />
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold print:text-black">Bachelors of Liberal Arts</h4>
                            <span className="text-xs font-mono opacity-50 print:opacity-80 print:text-black">2024</span>
                          </div>
                          <p className="text-sm text-blue-600 print:text-neutral-700 mb-1.5">Excelsior University, Albany, NY</p>
                          <p className="text-xs opacity-70 print:opacity-100 print:text-black leading-relaxed">
                            Relevant Coursework: Business Writing, American History, Jewish History, Earth Science.
                          </p>
                          <p className="text-xs mt-1.5 font-bold text-emerald-600 print:text-neutral-800">Honors: U.S. Presidential Academic Excellence Award</p>
                        </div>
                      </div>
                    </section>

                    {/* Analytical & Legal Training */}
                    <section className="print:break-inside-avoid mt-10 print:mt-8">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-lg font-serif font-bold print:text-black">Analytical & Legal Training</h3>
                        <div className="h-px flex-1 bg-neutral-200 print:bg-neutral-300" />
                      </div>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold print:text-black">Yoreh Deah Smicha (Rabbinic Ordination)</h4>
                            <span className="text-xs font-mono opacity-50 print:opacity-80 print:text-black">2024</span>
                          </div>
                          <p className="text-sm text-blue-600 print:text-neutral-700 mb-1.5">Yeshiva Pirchei Shoshana</p>
                          <ul className="text-xs opacity-70 print:opacity-100 print:text-black space-y-1.5 list-disc pl-4 leading-relaxed">
                            <li>Intensive graduate-level study of Jewish law, involving rigorous textual analysis, logical deduction, and application of complex legal frameworks.</li>
                            <li>Specialized in areas requiring intricate reasoning, such as the laws of mixtures (Ta’aruvos) and procedural prohibitions (Shabbos).</li>
                          </ul>
                        </div>
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold print:text-black">Data Analytics Professional Certificate</h4>
                            <span className="text-xs font-mono opacity-50 print:opacity-80 print:text-black">2023</span>
                          </div>
                          <p className="text-sm text-blue-600 print:text-neutral-700 mb-1.5">Google Career Certificates</p>
                          <p className="text-xs opacity-70 print:opacity-100 print:text-black leading-relaxed">
                            Completed a comprehensive program focused on quantitative reasoning, data analysis, and evidence-based problem-solving using SQL and R.
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Professional Experience */}
                    <section className="print:break-inside-avoid mt-10 print:mt-8">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-lg font-serif font-bold print:text-black">Professional Experience</h3>
                        <div className="h-px flex-1 bg-neutral-200 print:bg-neutral-300" />
                      </div>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold print:text-black">Intern</h4>
                            <span className="text-xs font-mono opacity-50 print:opacity-80 print:text-black">Summer 2024</span>
                          </div>
                          <p className="text-sm text-blue-600 print:text-neutral-700 mb-1.5">BrandWhatever, Brooklyn, NY</p>
                          <ul className="text-xs opacity-70 print:opacity-100 print:text-black space-y-1.5 list-disc pl-4 leading-relaxed">
                            <li>Collaborated with senior design staff to produce digital and print advertising materials using Adobe Creative Suite.</li>
                            <li>Gained proficiency in emerging AI technologies by training Stable Diffusion models for creative asset generation.</li>
                          </ul>
                        </div>
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold print:text-black">Theme Park Creative Consultant (Freelance)</h4>
                            <span className="text-xs font-mono opacity-50 print:opacity-80 print:text-black">2021</span>
                          </div>
                          <p className="text-sm text-blue-600 print:text-neutral-700 mb-1.5">American Dream Mall, East Rutherford, NJ</p>
                          <ul className="text-xs opacity-70 print:opacity-100 print:text-black space-y-1.5 list-disc pl-4 leading-relaxed">
                            <li>Consulted directly with senior leadership, including the VP of Theme Park Development, on creative strategy for a major IP-based attraction (PAW Patrol).</li>
                            <li>Drafted a comprehensive script for a motion simulator ride based on the Avatar: The Last Airbender intellectual property.</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    {/* Publications & Creative */}
                    <section className="print:break-inside-avoid mt-10 print:mt-8">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-lg font-serif font-bold print:text-black">Publications & Creative Projects</h3>
                        <div className="h-px flex-1 bg-neutral-200 print:bg-neutral-300" />
                      </div>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold print:text-black">Author & Publisher</h4>
                            <span className="text-xs font-mono opacity-50 print:opacity-80 print:text-black">2021–Present</span>
                          </div>
                          <p className="text-sm text-blue-600 print:text-neutral-700 mb-1.5">Self-Employed</p>
                          <ul className="text-xs opacity-70 print:opacity-100 print:text-black space-y-1.5 list-disc pl-4 leading-relaxed">
                            <li>Authored and self-published four full-length novels, managing the entire lifecycle from concept to market distribution.</li>
                            <li>Genres include fantasy, romance, and mental health fiction.</li>
                          </ul>
                        </div>
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold print:text-black">Voice Actor (Freelance)</h4>
                            <span className="text-xs font-mono opacity-50 print:opacity-80 print:text-black">2021–2024</span>
                          </div>
                          <p className="text-sm text-blue-600 print:text-neutral-700 mb-1.5">Various Online Projects</p>
                          <p className="text-xs opacity-70 print:opacity-100 print:text-black leading-relaxed">
                            Contributed vocal performances to collaborative digital media projects, reaching a global audience of over 14 million viewers.
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
