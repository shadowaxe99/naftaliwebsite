import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label: string;
  icon: any;
  isDarkMode?: boolean;
}

export default function CopyButton({ text, label, icon: Icon, isDarkMode }: CopyButtonProps) {
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
