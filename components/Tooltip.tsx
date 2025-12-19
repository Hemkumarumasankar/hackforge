import React, { useState } from 'react';
import { InfoIcon } from './Icons';

interface TooltipProps {
  content: string;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, className }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className={`relative inline-flex items-center ml-2 ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className="cursor-help text-slate-500 hover:text-indigo-400 transition-colors">
        <InfoIcon className="w-4 h-4" />
      </div>
      {isVisible && (
        <div className="absolute z-50 w-48 p-3 mt-2 left-1/2 -translate-x-1/2 top-full text-xs leading-relaxed text-slate-200 bg-slate-900/95 border border-slate-700/80 rounded-lg shadow-xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute -top-1 left-1/2 -ml-1 w-2 h-2 bg-slate-900 border-t border-l border-slate-700 transform rotate-45"></div>
          <p className="relative z-10">{content}</p>
        </div>
      )}
    </div>
  );
};