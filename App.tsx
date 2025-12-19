import React, { useState, useEffect } from 'react';
import CompanySelector from './components/CompanySelector';
import FileDropzone from './components/FileDropzone';
import TeamInput from './components/TeamInput';
import SuccessModal from './components/SuccessModal';
import { Company, AIAnalysisResult } from './types';
import { LoaderIcon } from './components/Icons';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [teamName, setTeamName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleFileSelect = (file: File, analysis: AIAnalysisResult | null) => {
    setSelectedFile(file);
    setAiAnalysis(analysis);
  };

  const handleSubmit = async () => {
    if (!selectedCompany || !selectedFile || !teamName) return;

    setIsSubmitting(true);
    setUploadProgress('Preparing secure transmission...');

    try {
      // Build FormData for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('company', selectedCompany);
      formData.append('teamName', teamName);
      if (aiAnalysis?.tags) {
        formData.append('aiTags', aiAnalysis.tags.join(', '));
      }
      if (aiAnalysis?.summary) {
        formData.append('aiSummary', aiAnalysis.summary);
      }

      setUploadProgress('Uploading to secure storage...');

      // API URL - uses env variable in production, localhost in development
      let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      if (!API_URL.startsWith('http')) {
        API_URL = `https://${API_URL}`;
      }

      // Use XMLHttpRequest for upload progress tracking
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            if (percentComplete < 100) {
              setUploadProgress(`Uploading: ${percentComplete}%`);
            } else {
              setUploadProgress('File received! Encrypting & Transferring to MEGA... (This may take a while)');
            }
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText);
              if (result.success) {
                resolve(result);
              } else {
                reject(new Error(result.message || 'Upload failed'));
              }
            } catch (e) {
              reject(new Error('Invalid server response'));
            }
          } else {
            // Try to parse error message from response body
            try {
              const errorResult = JSON.parse(xhr.responseText);
              reject(new Error(errorResult.message || `Server Error (${xhr.status})`));
            } catch {
              reject(new Error(`Server Error: ${xhr.status} ${xhr.statusText}`));
            }
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        xhr.open('POST', `${API_URL}/api/upload`);
        xhr.send(formData);
      });

      setUploadProgress('Finalizing submission...');
      setIsSuccess(true);

    } catch (error: any) {
      console.error('Submission error:', error);
      alert(`Submission failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      // Don't clear progress immediately on success so user sees 100%
      if (!isSuccess) {
        setUploadProgress('');
      }
    }
  };

  const resetForm = () => {
    setSelectedCompany(null);
    setTeamName('');
    setSelectedFile(null);
    setAiAnalysis(null);
    setIsSuccess(false);
  };

  const isFormValid = selectedCompany && selectedFile && teamName.length > 0 && !isSubmitting;

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        <div className="relative">
          <div className="w-16 h-16 border-t-2 border-indigo-500 border-r-2 border-cyan-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-8 font-mono text-xs text-indigo-400 tracking-[0.3em] uppercase animate-pulse">HackForge OS Initializing...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-4 relative overflow-hidden bg-black selection:bg-indigo-500/30 selection:text-indigo-200">

      {/* 🌌 Aurora Background Animation */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="w-full flex-grow flex items-center justify-center relative z-10 py-10">
        <div className="w-full max-w-lg">
          <header className="mb-10 text-center relative group">
            <div className="inline-flex items-center justify-center mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.25em] text-cyan-400 uppercase backdrop-blur-md shadow-lg transition-transform duration-500 hover:scale-105 cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
              HackForge'2025
            </div>
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tight mb-3 drop-shadow-sm">
              Data Upload
            </h1>
            <p className="text-slate-400 text-sm font-light tracking-wide">Deploy your genius. Break the simulation.</p>
          </header>

          {isSuccess && (
            <SuccessModal onReset={resetForm} teamName={teamName} />
          )}

          <div className="glass-panel rounded-[40px] p-8 shadow-2xl relative animate-in fade-in slide-in-from-bottom-8 duration-1000 ring-1 ring-white/10">
            {/* Cyberpunk Accents */}
            <div className="absolute top-10 right-0 w-[2px] h-12 bg-gradient-to-b from-transparent via-indigo-500 to-transparent opacity-50"></div>
            <div className="absolute bottom-10 left-0 w-[2px] h-12 bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-50"></div>

            <div className="space-y-6">
              <CompanySelector
                selected={selectedCompany}
                onSelect={setSelectedCompany}
              />

              <TeamInput
                value={teamName}
                onChange={setTeamName}
              />

              <FileDropzone
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
              />

              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`
                  w-full py-5 rounded-2xl font-bold text-sm tracking-[0.2em] uppercase transition-all duration-500 relative overflow-hidden group
                  ${isFormValid
                    ? 'bg-white text-black hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.3)]'
                    : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'}
                `}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <LoaderIcon className="w-5 h-5 animate-spin mr-3 text-slate-900" />
                      {uploadProgress || 'Processing...'}
                    </>
                  ) : (
                    "Submit Project"
                  )}
                </span>

                {/* Button Hover Shimmer */}
                {isFormValid && !isSubmitting && (
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent z-0"></div>
                )}
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-6 opacity-60">
              <div className="flex items-center text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_10px_#10b981]"></span>
                System Operational
              </div>
              <div className="flex items-center text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 shadow-[0_0_10px_#6366f1]"></span>
                256-bit Encrypted
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full text-center py-6 relative z-10 text-slate-500 text-[10px] uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity">
        <p>&copy; 2025 Webbed & Senesense Solutions. Designed for the Future.</p>
      </footer>
    </div>
  );
}

export default App;