import React, { useState, useRef, useCallback, useEffect } from 'react';
import { UploadCloudIcon, FileIcon, ShieldCheckIcon, SparklesIcon } from './Icons';
import { analyzeFile } from '../services/geminiService';
import { AIAnalysisResult } from '../types';
import { Tooltip } from './Tooltip';

interface FileDropzoneProps {
  onFileSelect: (file: File, analysis: AIAnalysisResult | null) => void;
  selectedFile: File | null;
}

const LOADING_STEPS = [
  "Initializing quantum handshake...",
  "Decompressing archive structure...",
  "Scanning heuristics...",
  "Verifying integrity signatures...",
  "Finalizing security report..."
];

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileSelect, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cycling text & Progress bar effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isScanning) {
      setLoadingStepIndex(0);
      setProgress(0);
      
      const stepDuration = 500; // ms per step
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
        setProgress((prev) => Math.min(prev + 20, 100));
      }, stepDuration);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateAndProcess = (file: File) => {
    // Strict ZIP check
    if (!file.name.toLowerCase().endsWith('.zip') && file.type !== 'application/zip' && file.type !== 'application/x-zip-compressed') {
      alert("System Protocol Mismatch: Only .ZIP archives are authorized.");
      return;
    }
    processFile(file);
  }

  const processFile = async (file: File) => {
    setIsScanning(true);
    setAnalysis(null);
    
    // Artificial minimum delay for effect
    const minDelay = new Promise(r => setTimeout(r, 2500));
    const analysisPromise = analyzeFile(file);

    const [_, aiResult] = await Promise.all([minDelay, analysisPromise]);
    
    setAnalysis(aiResult);
    setIsScanning(false);
    onFileSelect(file, aiResult);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcess(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndProcess(file);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null as any, null);
    setAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full mb-8">
       <div className="flex items-center mb-3">
         <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Document Payload
         </label>
         <Tooltip content="Upload your project source code archive. Only .ZIP format accepted." />
       </div>
      <div
        onClick={() => !isScanning && fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative group cursor-pointer overflow-hidden rounded-[24px] border transition-all duration-500 ease-out transform
          ${isDragging 
            ? 'border-indigo-400/50 bg-indigo-500/10 scale-[1.02] shadow-[0_0_40px_rgba(99,102,241,0.2)]' 
            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01] hover:shadow-2xl'}
          ${selectedFile ? 'h-auto' : 'h-72 flex items-center justify-center'}
          backdrop-blur-md
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          accept=".zip,application/zip,application/x-zip-compressed"
          disabled={isScanning}
        />

        {/* Dynamic Scanning Overlay */}
        {isScanning && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md transition-all duration-500">
             <div className="w-64 max-w-[80%]">
               <div className="flex justify-between text-xs text-indigo-300 font-mono mb-2 uppercase tracking-widest">
                  <span>Scanning</span>
                  <span>{progress}%</span>
               </div>
               <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 shadow-[0_0_15px_#6366f1] transition-all duration-500 ease-linear"
                    style={{ width: `${progress}%` }}
                  ></div>
               </div>
             </div>
             <p className="mt-8 text-sm font-medium text-slate-400 tracking-wider animate-pulse uppercase">
                {LOADING_STEPS[loadingStepIndex]}
             </p>
          </div>
        )}

        {!selectedFile ? (
          <div className="text-center px-8 relative z-10">
            <div className={`mx-auto w-20 h-20 mb-6 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-lg ${isDragging ? 'bg-indigo-500 text-white scale-110' : 'bg-gradient-to-br from-slate-800 to-slate-900 text-slate-400 group-hover:text-white border border-white/5'}`}>
              <UploadCloudIcon className="w-10 h-10" />
            </div>
            <p className="text-xl font-semibold text-white mb-2 tracking-tight group-hover:text-indigo-300 transition-colors">
              Drop your files here
            </p>
            <p className="text-sm text-slate-400 font-light">
              or <span className="text-indigo-400 font-medium">browse</span> from system
            </p>
            <p className="mt-6 text-[10px] uppercase tracking-widest text-slate-600 border px-3 py-1 rounded-full border-white/5 inline-block">
              .ZIP ARCHIVES ONLY
            </p>
          </div>
        ) : (
          <div className="w-full relative">
            {/* Header of the Card */}
            <div className="p-6 flex items-center justify-between border-b border-white/5 bg-white/5">
              <div className="flex items-center space-x-4">
                 <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-indigo-400 shadow-inner">
                    <FileIcon className="w-7 h-7" />
                 </div>
                 <div className="text-left">
                   <p className="text-white font-semibold text-lg truncate max-w-[180px] sm:max-w-xs">{selectedFile.name}</p>
                   <p className="text-xs text-indigo-300/80 font-mono mt-0.5">{(selectedFile.size / 1024).toFixed(1)} KB • READY</p>
                 </div>
              </div>
              
              <button 
                 onClick={clearFile}
                 className="p-3 rounded-full hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all duration-300 hover:rotate-90"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* AI Analysis Result Section - iOS Widget Style */}
            <div className="p-6 bg-gradient-to-b from-transparent to-black/20">
               {analysis ? (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    
                    {/* Security Bar */}
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div className="flex items-center text-emerald-400">
                          <ShieldCheckIcon className="w-4 h-4 mr-2" />
                          <span className="text-xs font-bold tracking-wider uppercase">Integrity Check</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold inline-block text-emerald-400">
                            {analysis.safetyScore}/100
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded-full bg-slate-800">
                        <div style={{ width: `${analysis.safetyScore}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-out"></div>
                      </div>
                    </div>
                    
                    {/* Insights Box */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                       <div className="flex items-start space-x-3">
                          <div className="mt-1 p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                            <SparklesIcon className="w-4 h-4" />
                          </div>
                          <div>
                             <p className="text-xs text-purple-300 uppercase font-bold mb-1 tracking-wider">AI Insight</p>
                             <p className="text-sm text-slate-300 leading-relaxed font-light">"{analysis.summary}"</p>
                          </div>
                       </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {analysis.tags.map((tag, i) => (
                        <span 
                          key={tag} 
                          className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-indigo-500 hover:text-indigo-400 transition-all cursor-default"
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                  </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-6 text-slate-500 opacity-50">
                    <p className="text-xs uppercase tracking-widest">Waiting for scan...</p>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDropzone;