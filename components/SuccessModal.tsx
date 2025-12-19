import React from 'react';
import { CheckCircleIcon, SparklesIcon } from './Icons';

interface SuccessModalProps {
  onReset: () => void;
  teamName: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onReset, teamName }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Heavy Blur Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[30px] animate-in fade-in duration-700"></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] text-center animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]">

        <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
          <CheckCircleIcon className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Submission Complete!</h2>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Team <span className="font-semibold text-white">{teamName}</span> - Your project has been securely uploaded and submitted.
        </p>

        <div className="bg-emerald-500/10 rounded-2xl p-4 mb-6 border border-emerald-500/20">
          <div className="flex items-center justify-center space-x-2 text-sm font-medium text-emerald-400">
            <SparklesIcon className="w-4 h-4" />
            <span>Upload Successful</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Your ZIP file has been securely transmitted to the designated storage.
          </p>
        </div>

        <button
          onClick={onReset}
          className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300"
        >
          Submit Another Project
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;