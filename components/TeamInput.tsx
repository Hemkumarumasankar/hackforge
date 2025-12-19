import React from 'react';
import { Tooltip } from './Tooltip';

interface TeamInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TeamInput: React.FC<TeamInputProps> = ({ value, onChange }) => {
  return (
    <div className="w-full relative z-40 mb-6">
      <div className="flex items-center mb-3">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Team Identity
        </label>
        <Tooltip content="Enter your registered Hackathon team name." />
      </div>
      
      <div className="relative group">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter Team Name..."
          className="w-full p-5 glass-input rounded-2xl text-white placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
           <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${value.length > 2 ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-slate-600'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default TeamInput;