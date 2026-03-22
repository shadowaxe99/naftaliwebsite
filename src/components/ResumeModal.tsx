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
              className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col ${
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
            <div className="flex-1 overflow-y-auto p-8 md:p-12 print:p-0 print:overflow-visible resume-content relative z-10">
              <div className="max-w-3xl mx-auto">
                {/* Personal Info */}
                <header className="mb-12 text-center md:text-left relative">
                  <div className="absolute -left-8 top-0 bottom-0 w-px bg-blue-600/20 hidden md:block print:hidden" />
                  <h1 className="text-5xl font-serif font-bold mb-4 tracking-tight">Nathan Gruen</h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 text-sm text-neutral-500 font-medium">
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-600" /> 3323 Avenue K, Brooklyn, NY 11210</span>
                    <span className="flex items-center gap-1.5"><Phone size={14} className="text-blue-600" /> (646) 415-3514</span>
                    <span className="flex items-center gap-1.5"><Mail size={14} className="text-blue-600" /> naftaligruen@gmail.com</span>
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_2.5fr] gap-12">
                  {/* Left Column: Skills & Meta */}
                  <aside className="space-y-10">
                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">Technical Skills</h3>
                      <ul className="space-y-2 text-sm opacity-80 font-light">
                        <li>Data Analysis (SQL, Basic R)</li>
                        <li>Microsoft Excel & Google Suite</li>
                        <li>HTML / CSS</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">Creative Skills</h3>
                      <ul className="space-y-2 text-sm opacity-80 font-light">
                        <li>Adobe Creative Suite</li>
                        <li>Blender 3D</li>
                        <li>Audacity</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">Languages</h3>
                      <ul className="space-y-2 text-sm opacity-80 font-light">
                        <li>English (Native)</li>
                        <li>Hebrew (Reading & Liturgy)</li>
                        <li>Japanese (Learning)</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">Involvement</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-bold">Mentor</p>
                          <p className="text-xs opacity-60">My Extended Family (2021–2022)</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold">Choir Member</p>
                          <p className="text-xs opacity-60">Synagogue Choir</p>
                        </div>
                      </div>
                    </section>
                  </aside>

                  {/* Right Column: Main Content */}
                  <div className="space-y-12">
                    {/* Education */}
                    <section>
                      <div className="flex items-center gap-4 mb-6">
                        <h3 className="text-lg font-serif font-bold">Education</h3>
                        <div className="h-px flex-1 bg-neutral-200" />
                      </div>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold">Juris Doctor (J.D.) Candidate</h4>
                            <span className="text-xs font-mono opacity-50">Expected 2029</span>
                          </div>
                          <p className="text-sm text-blue-600 mb-2">New York Law School, New York, NY</p>
                          <p className="text-xs opacity-70 leading-relaxed">
                            Specializing in Intellectual Property, Entertainment Law, and Digital Rights.
                          </p>
                        </div>
                        <div className="h-px w-full bg-neutral-100" />
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold">Bachelors of Liberal Arts</h4>
                            <span className="text-xs font-mono opacity-50">2024</span>
                          </div>
                          <p className="text-sm text-blue-600 mb-2">Excelsior University, Albany, NY</p>
                          <p className="text-xs opacity-70 leading-relaxed">
                            Relevant Coursework: Business Writing, American History, Jewish History, Earth Science.
                          </p>
                          <p className="text-xs mt-2 font-bold text-emerald-600">Honors: U.S. Presidential Academic Excellence Award</p>
                        </div>
                      </div>
                    </section>

                    {/* Analytical & Legal Training */}
                    <section>
                      <div className="flex items-center gap-4 mb-6">
                        <h3 className="text-lg font-serif font-bold">Analytical & Legal Training</h3>
                        <div className="h-px flex-1 bg-neutral-200" />
                      </div>
                      <div className="space-y-8">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold">Yoreh Deah Smicha (Rabbinic Ordination)</h4>
                            <span className="text-xs font-mono opacity-50">2024</span>
                          </div>
                          <p className="text-sm text-blue-600 mb-2">Yeshiva Pirchei Shoshana</p>
                          <ul className="text-xs opacity-70 space-y-2 list-disc pl-4 leading-relaxed">
                            <li>Intensive graduate-level study of Jewish law, involving rigorous textual analysis, logical deduction, and application of complex legal frameworks.</li>
                            <li>Specialized in areas requiring intricate reasoning, such as the laws of mixtures (Ta’aruvos) and procedural prohibitions (Shabbos).</li>
                          </ul>
                        </div>
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold">Data Analytics Professional Certificate</h4>
                            <span className="text-xs font-mono opacity-50">2023</span>
                          </div>
                          <p className="text-sm text-blue-600 mb-2">Google Career Certificates</p>
                          <p className="text-xs opacity-70 leading-relaxed">
                            Completed a comprehensive program focused on quantitative reasoning, data analysis, and evidence-based problem-solving using SQL and R.
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Professional Experience */}
                    <section>
                      <div className="flex items-center gap-4 mb-6">
                        <h3 className="text-lg font-serif font-bold">Professional Experience</h3>
                        <div className="h-px flex-1 bg-neutral-200" />
                      </div>
                      <div className="space-y-8">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold">Intern</h4>
                            <span className="text-xs font-mono opacity-50">Summer 2024</span>
                          </div>
                          <p className="text-sm text-blue-600 mb-2">BrandWhatever, Brooklyn, NY</p>
                          <ul className="text-xs opacity-70 space-y-2 list-disc pl-4 leading-relaxed">
                            <li>Collaborated with senior design staff to produce digital and print advertising materials using Adobe Creative Suite.</li>
                            <li>Gained proficiency in emerging AI technologies by training Stable Diffusion models for creative asset generation.</li>
                          </ul>
                        </div>
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold">Theme Park Creative Consultant (Freelance)</h4>
                            <span className="text-xs font-mono opacity-50">2021</span>
                          </div>
                          <p className="text-sm text-blue-600 mb-2">American Dream Mall, East Rutherford, NJ</p>
                          <ul className="text-xs opacity-70 space-y-2 list-disc pl-4 leading-relaxed">
                            <li>Consulted directly with senior leadership, including the VP of Theme Park Development, on creative strategy for a major IP-based attraction (PAW Patrol).</li>
                            <li>Drafted a comprehensive script for a motion simulator ride based on the Avatar: The Last Airbender intellectual property.</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    {/* Publications & Creative */}
                    <section>
                      <div className="flex items-center gap-4 mb-6">
                        <h3 className="text-lg font-serif font-bold">Publications & Creative Projects</h3>
                        <div className="h-px flex-1 bg-neutral-200" />
                      </div>
                      <div className="space-y-8">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold">Author & Publisher</h4>
                            <span className="text-xs font-mono opacity-50">2021–Present</span>
                          </div>
                          <p className="text-sm text-blue-600 mb-2">Self-Employed</p>
                          <ul className="text-xs opacity-70 space-y-2 list-disc pl-4 leading-relaxed">
                            <li>Authored and self-published four full-length novels, managing the entire lifecycle from concept to market distribution.</li>
                            <li>Genres include fantasy, romance, and mental health fiction.</li>
                          </ul>
                        </div>
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold">Voice Actor (Freelance)</h4>
                            <span className="text-xs font-mono opacity-50">2021–2024</span>
                          </div>
                          <p className="text-sm text-blue-600 mb-2">Various Online Projects</p>
                          <p className="text-xs opacity-70 leading-relaxed">
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
