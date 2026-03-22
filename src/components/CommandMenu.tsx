import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Home, Briefcase, FileText, Mail, Moon, Sun, X, FileSignature } from 'lucide-react';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  openResume: () => void;
}

export default function CommandMenu({ isOpen, onClose, isDarkMode, toggleTheme, openResume }: CommandMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('naftaligruen@gmail.com');
    // Could add a toast here
  };

  const commands = [
    { id: 'home', title: 'Go to Home', icon: Home, action: () => scrollToSection('home'), category: 'Navigation' },
    { id: 'experience', title: 'Go to Experience', icon: Briefcase, action: () => scrollToSection('experience'), category: 'Navigation' },
    { id: 'insights', title: 'Go to Analysis', icon: FileSignature, action: () => scrollToSection('insights'), category: 'Navigation' },
    { id: 'projects', title: 'Go to Creative Portfolio', icon: FileText, action: () => scrollToSection('projects'), category: 'Navigation' },
    { id: 'contact', title: 'Go to Contact', icon: Mail, action: () => scrollToSection('contact'), category: 'Navigation' },
    { id: 'resume', title: 'View Official Résumé', icon: FileText, action: openResume, category: 'Actions' },
    { id: 'theme', title: `Toggle ${isDarkMode ? 'Light' : 'Dark'} Mode`, icon: isDarkMode ? Sun : Moon, action: toggleTheme, category: 'Actions' },
    { id: 'email', title: 'Copy Email Address', icon: Mail, action: copyEmail, category: 'Actions' },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-paper border-neutral-200'}`}
          >
            <div className={`flex items-center px-4 py-3 border-b ${isDarkMode ? 'border-neutral-800' : 'border-neutral-100'}`}>
              <Search size={20} className={isDarkMode ? 'text-neutral-500' : 'text-neutral-400'} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 bg-transparent border-none outline-none px-4 py-2 text-lg ${isDarkMode ? 'text-white placeholder:text-neutral-600' : 'text-neutral-900 placeholder:text-neutral-400'}`}
              />
              <button 
                onClick={onClose}
                className={`p-1 rounded-md ${isDarkMode ? 'hover:bg-neutral-800 text-neutral-500' : 'hover:bg-neutral-100 text-neutral-400'}`}
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2 no-scrollbar">
              {filteredCommands.length === 0 ? (
                <div className={`py-12 text-center text-sm ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  No results found for "{searchQuery}"
                </div>
              ) : (
                <div className="space-y-4">
                  {['Navigation', 'Actions'].map(category => {
                    const categoryCommands = filteredCommands.filter(c => c.category === category);
                    if (categoryCommands.length === 0) return null;
                    
                    return (
                      <div key={category}>
                        <div className={`px-3 py-2 text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                          {category}
                        </div>
                        <div className="space-y-1">
                          {categoryCommands.map(cmd => (
                            <button
                              key={cmd.id}
                              onClick={() => handleAction(cmd.action)}
                              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                                isDarkMode 
                                  ? 'hover:bg-neutral-800 text-neutral-300 hover:text-white' 
                                  : 'hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900'
                              }`}
                            >
                              <cmd.icon size={18} className={isDarkMode ? 'text-neutral-500' : 'text-neutral-400'} />
                              <span className="font-medium">{cmd.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className={`px-4 py-3 border-t text-xs flex items-center justify-between ${isDarkMode ? 'border-neutral-800 bg-neutral-900/50 text-neutral-500' : 'border-neutral-100 bg-paper/50 text-neutral-400'}`}>
              <div className="flex items-center gap-2">
                <span className="font-mono bg-neutral-500/10 px-1.5 py-0.5 rounded">↑</span>
                <span className="font-mono bg-neutral-500/10 px-1.5 py-0.5 rounded">↓</span>
                <span>to navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono bg-neutral-500/10 px-1.5 py-0.5 rounded">esc</span>
                <span>to close</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
