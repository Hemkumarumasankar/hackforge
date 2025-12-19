import React, { useState, useRef, useEffect } from 'react';
import { Company } from '../types';
import { ChevronDownIcon } from './Icons';
import { Tooltip } from './Tooltip';

interface CompanySelectorProps {
  selected: Company | null;
  onSelect: (company: Company) => void;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (company: Company) => {
    onSelect(company);
    setIsOpen(false);
  };

  const getCompanyDisplay = (company: Company) => {
    switch (company) {
      case Company.WEBBED:
        return <span>Webbed <span className="text-slate-500 text-xs ml-1 font-mono">(WB)</span></span>;
      case Company.SENESENSE:
        return <span>Senesense Solutions <span className="text-slate-500 text-xs ml-1 font-mono">(SS)</span></span>;
      case Company.TECHKNOTS:
        return <span>Techknots <span className="text-slate-500 text-xs ml-1 font-mono">(TK)</span></span>;
      default:
        return company;
    }
  };

  return (
    <div className="relative w-full z-50" ref={containerRef}>
      <div className="flex items-center mb-3">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Target Entity
        </label>
        <Tooltip content="Select the recipient organization for this classified data transmission." />
      </div>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-5 glass-input rounded-2xl text-slate-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:bg-white/10 ${isOpen ? 'ring-2 ring-indigo-500/50 bg-white/10' : ''}`}
      >
        <span className={`text-base tracking-wide ${selected ? 'text-white font-medium' : 'text-slate-500'}`}>
          {selected ? getCompanyDisplay(selected) : 'Select an organization...'}
        </span>
        <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? 'rotate-180 text-white' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-3 bg-[#1c1c1e] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 origin-top">
          <ul className="py-2">
            {Object.values(Company).map((company) => (
              <li key={company} className="px-2">
                <button
                  type="button"
                  onClick={() => handleSelect(company)}
                  className={`w-full text-left px-4 py-3.5 text-sm rounded-xl transition-all duration-200 flex items-center group ${
                    selected === company
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full mr-3 transition-all duration-300 ${selected === company ? 'bg-white shadow-[0_0_10px_white]' : 'bg-slate-600 group-hover:bg-slate-400'}`}></span>
                  {getCompanyDisplay(company)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CompanySelector;