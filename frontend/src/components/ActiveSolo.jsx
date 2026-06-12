import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import TerminalOutput from './TerminalOutput';
import { HelpCircle, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ActiveSolo({ onQuit }) {
  const { socket } = useSocket();
  const [caseData, setCaseData] = useState(null);
  const [progress, setProgress] = useState(1);
  const [solution, setSolution] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [hintText, setHintText] = useState('');
  const [loadingHint, setLoadingHint] = useState(false);
  const [caseComplete, setCaseComplete] = useState(false);
  const [loadingNextCase, setLoadingNextCase] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on('solo_started', (data) => {
      setCaseData(data.caseData);
      setProgress(data.caseProgress);
      resetInternalStageState();
    });

    socket.on('solo_hint_result', (data) => {
      setLoadingHint(false);
      if (data.success) {
        setHintText(data.hint);
      } else {
        setFeedback({ success: false, message: data.message });
      }
    });

    socket.on('solo_answer_result', (data) => {
      if (data.correct) {
        setFeedback({ success: true, message: data.message });
        if (data.caseComplete) {
          setCaseComplete(true);
        } else if (data.nextCase) {
          setTimeout(() => {
            setCaseData(data.nextCase);
            setProgress(data.caseProgress);
            resetInternalStageState();
          }, 1500);
        }
      } else {
        setFeedback({ success: false, message: data.message });
      }
    });

    socket.on('solo_next_case', (data) => {
      setCaseData(data.caseData);
      setProgress(data.caseProgress);
      setCaseComplete(false);
      setLoadingNextCase(false);
      resetInternalStageState();
    });

    return () => {
      socket.off('solo_started');
      socket.off('solo_hint_result');
      socket.off('solo_answer_result');
      socket.off('solo_next_case');
    };
  }, [socket, onQuit]);

  const resetInternalStageState = () => {
    setSolution('');
    setFeedback(null);
    setHintText('');
  };

  const handleQuit = () => {
    socket.emit('abandon_solo');
    onQuit();
  };

  const requestNextCase = () => {
    setLoadingNextCase(true);
    socket.emit('request_next_solo_case');
  };

  const submitAnswer = (e) => {
    e.preventDefault();
    if (!solution.trim()) return;
    socket.emit('submit_solo_answer', { solution });
  };

  const requestHint = () => {
    setLoadingHint(true);
    socket.emit('request_solo_hint');
  };

  if (!caseData) {
    return (
      <div className="border border-zinc-800/60 bg-zinc-900/10 p-12 text-center rounded-2xl max-w-xl mx-auto my-12 font-mono">
        <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent mx-auto mb-4 rounded-full" />
        <p className="text-xs text-emerald-400 font-bold tracking-widest uppercase animate-pulse">
          Searching for available solo cases...
        </p>
      </div>
    );
  }

  if (caseComplete) {
    return (
      <div className="border border-zinc-800/60 bg-zinc-900/10 p-12 rounded-2xl max-w-xl mx-auto my-12 font-mono text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-xl font-black text-white tracking-wide">Case Complete</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          You solved the current solo investigation. Choose your next move.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={requestNextCase}
            disabled={loadingNextCase}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none uppercase"
          >
            {loadingNextCase ? 'Loading...' : 'Next Case'}
          </button>
          <button
            type="button"
            onClick={handleQuit}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs tracking-wider rounded-xl transition-all uppercase"
          >
            End Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono text-zinc-300 animate-fadeIn">
      
      <div className="lg:col-span-8 bg-zinc-900/10 border border-zinc-800/40 rounded-2xl p-6 flex flex-col justify-between min-h-[500px] space-y-6">
        <div>
          {/* Header Metadata Section */}
          <div className="flex flex-wrap justify-between items-center border-b border-zinc-900 pb-4 gap-2">
            <div>
              <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-900/40 px-2.5 py-0.5 font-bold uppercase rounded-md tracking-wider">
                {caseData.caseNumber || 'CASE_ID'}
              </span>
              <h2 className="text-base font-black tracking-wide text-white mt-2">
                {caseData.title}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-500 font-mono tracking-wide">
                {caseData.report || 'SECURE LOG'}
              </span>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <div>
              <label className="text-[9px] uppercase text-zinc-500 block mb-1.5 font-bold tracking-widest">
                Investigation Briefing
              </label>
              <p className="text-xs text-zinc-400 leading-relaxed bg-black/40 p-4 rounded-xl border border-zinc-900">
                {caseData.briefing}
              </p>
            </div>

            <div>
              <label className="text-[9px] uppercase text-zinc-500 block mb-1.5 font-bold tracking-widest">
                Current Node Prompt
              </label>
              <div className="bg-black/60 border-l-2 border-emerald-500 border-y border-r border-zinc-900 p-4 rounded-xl text-xs text-white leading-relaxed font-semibold">
                {caseData.question}
              </div>
            </div>
          </div>
        </div>

        {/* Input Interface Actions */}
        <form onSubmit={submitAnswer} className="pt-4 border-t border-zinc-900">
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Inject solution hash or string keyword..."
              className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-zinc-700 text-white font-mono placeholder:text-zinc-600 shadow-inner"
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-emerald-400 font-bold text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 uppercase"
            >
              Resolve <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </div>

      {/* Right Area: Auxiliary Sidebar Module */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* Real-time Validation System Feedback */}
        {feedback && (
          <div className={`p-4 border rounded-xl text-xs flex items-start gap-3 animate-slideIn ${
            feedback.success 
              ? 'bg-emerald-950/10 border-emerald-900/30 text-emerald-400' 
              : 'bg-red-950/10 border-red-900/30 text-red-400'
          }`}>
            {feedback.success ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold uppercase tracking-wider text-[10px] mb-0.5">
                {feedback.success ? 'System Clear' : 'Exception Rejected'}
              </h4>
              <p className="leading-relaxed opacity-90 text-[11px] font-mono">{feedback.message}</p>
            </div>
          </div>
        )}

        {/* Intelligence Injection Asset Drawer */}
        <div className="border border-zinc-800/40 bg-zinc-900/10 p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-[10px] font-bold text-white tracking-widest uppercase">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              Intelligence Injector
            </div>
            <button 
              type="button"
              disabled={loadingHint || !!hintText}
              onClick={requestHint}
              className="text-[9px] text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 px-2.5 py-1 rounded-md hover:bg-emerald-950/40 transition-all disabled:opacity-30 disabled:pointer-events-none tracking-wide font-bold uppercase"
            >
              {loadingHint ? 'Requesting...' : 'Decrypt'}
            </button>
          </div>
          
          {hintText ? (
            <div className="text-[11px] text-zinc-400 bg-black/40 border border-zinc-900 p-3 rounded-xl leading-relaxed font-mono animate-fadeIn">
              {hintText}
            </div>
          ) : (
            <p className="text-[11px] text-zinc-500 italic font-mono leading-normal">
              Need intelligence assets? Use decryption to evaluate target metadata parameters.
            </p>
          )}
        </div>

        {/* Status Monitoring & Domain Progress Stats */}
        <div className="border border-zinc-800/40 bg-zinc-900/10 p-4 rounded-xl text-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Analysis Domain</span>
            <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
              {caseData.stageType || 'GENERAL'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Stage Progress</span>
            <span className="text-white font-bold">{progress}</span>
          </div>
          
          <button 
            type="button" 
            onClick={handleQuit}
            className="w-full mt-2 py-2.5 border border-zinc-800 hover:border-red-900/50 text-zinc-400 hover:text-red-400 hover:bg-red-950/10 transition-all rounded-xl text-[10px] tracking-wider uppercase font-bold"
          >
            Abort Investigation
          </button>
        </div>

      </div>
    </div>
  );
}