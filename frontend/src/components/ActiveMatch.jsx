import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import TerminalOutput from './TerminalOutput';
import { Swords, Trophy, HelpCircle, ShieldAlert } from 'lucide-react';

export default function ActiveMatch({ matchPayload, onMatchEnd }) {
  const { socket } = useSocket();
  const [matchId] = useState(matchPayload.matchId);
  const [caseData, setCaseData] = useState(matchPayload.caseData);
  const [pot] = useState(matchPayload.pot);
  const [opponent] = useState(matchPayload.opponent);
  const [isReadySent, setIsReadySent] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [solution, setSolution] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [hintText, setHintText] = useState('');
  const [gameOverState, setGameOverState] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('hint_result', (data) => {
      if (data.success) {
        setHintText(data.hint);
      } else {
        setFeedback({ correct: false, message: data.message });
      }
    });

    socket.on('solution_result', (data) => {
      setFeedback({ correct: data.correct, message: data.message });
    });

    socket.on('game_over', (data) => {
      setGameOverState(data);
    });

    // Match start will deliver the caseData when both players are ready
    socket.on('match_start', (data) => {
      if (data.matchId === matchId) {
        setCaseData(data.caseData);
        setFeedback(null);
      }
    });

    socket.on('player_ready_update', (data) => {
      if (data.matchId === matchId) {
        // mark opponent ready
        if (data.socketId !== socket.id) setOpponentReady(true);
      }
    });

    return () => {
      socket.off('hint_result');
      socket.off('solution_result');
      socket.off('game_over');
      socket.off('match_start');
      socket.off('player_ready_update');
    };
  }, [socket]);

  const submitSolution = (e) => {
    e.preventDefault();
    if (!solution.trim()) return;
    socket.emit('submit_solution', { matchId, solution });
  };

  const triggerHintRequest = () => {
    socket.emit('request_hint', { matchId });
  };

  const sendReady = () => {
    if (!socket) return;
    setIsReadySent(true);
    socket.emit('player_ready', { matchId });
  };

  if (gameOverState) {
    const isWinner = gameOverState.result === 'WON';
    return (
      <div className="max-w-md mx-auto bg-zinc-900/40 border border-zinc-800/80 p-6 text-center rounded-2xl shadow-2xl relative overflow-hidden animate-scaleIn mt-10 font-mono">
        <div className={`absolute top-0 left-0 right-0 h-1 ${isWinner ? 'bg-emerald-500' : 'bg-red-500'}`} />
        <div className="flex justify-center mb-4">
          <Trophy className={`w-12 h-12 ${isWinner ? 'text-emerald-400 drop-shadow-[0_0_8px_#00ff66]' : 'text-zinc-600'}`} />
        </div>
        <h2 className={`text-lg font-black tracking-widest uppercase ${isWinner ? 'text-emerald-400' : 'text-red-500'}`}>
          Raid {gameOverState.result}
        </h2>
        <p className="text-xs text-zinc-400 my-4 leading-relaxed">
          {gameOverState.behaviorMessage}
        </p>
        <div className="bg-black/40 border border-zinc-800/60 py-3 px-4 rounded-xl my-4 flex justify-between text-xs">
          <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-bold">Loot Pool Yielded:</span>
          <span className={`font-black ${isWinner ? 'text-emerald-400' : 'text-red-500'}`}>
            {isWinner ? `+${gameOverState.looted} STAKE` : '0 STAKE'}
          </span>
        </div>
        <button 
          onClick={onMatchEnd}
          className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-bold rounded-xl transition-all tracking-wider uppercase"
        >
          Return to Command Bureau
        </button>
      </div>
    );
  }

  // If no caseData yet, show ready prompt
  if (!caseData) {
    return (
      <div className="max-w-md mx-auto bg-zinc-900/40 border border-zinc-800/80 p-6 text-center rounded-2xl shadow-2xl relative overflow-hidden animate-scaleIn mt-10 font-mono">
        <h2 className="text-lg font-black text-white mb-2">Match Ready: {opponent || 'Opponent'}</h2>
        <p className="text-xs text-zinc-400 mb-4">Confirm you are ready to begin. Both players must press Ready to start the raid.</p>

        <div className="mb-4 text-[12px]">
          <div>Match ID: <span className="font-mono text-xs text-zinc-300">{matchId}</span></div>
          <div className="mt-2">Pot: <span className="font-bold text-emerald-400">{pot}</span></div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={sendReady}
            disabled={isReadySent}
            className={`px-6 py-2 rounded-xl font-bold text-sm ${isReadySent ? 'bg-zinc-800 text-zinc-400' : 'bg-emerald-400 text-black'}`}
          >
            {isReadySent ? 'Waiting...' : 'Ready'}
          </button>
          <button
            onClick={onMatchEnd}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300"
          >
            Cancel
          </button>
        </div>

        <div className="mt-4 text-xs text-zinc-500">
          {opponentReady ? <span className="text-emerald-400">Opponent is ready</span> : <span>Waiting for opponent</span>}
        </div>
      </div>
    );
  }
  // --- ACTIVE GAME INTERFACE ---
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono text-zinc-300 animate-fadeIn">
      
      {/* Left Area: Primary Investigation Matrix */}
      <div className="lg:col-span-8 bg-zinc-900/10 border border-zinc-800/40 rounded-2xl p-6 flex flex-col justify-between min-h-[540px] space-y-6">
        <div>
          {/* Active Header Block */}
          <div className="flex flex-wrap justify-between items-center border-b border-zinc-900 pb-4 gap-2">
            <div className="flex items-center gap-3">
              <Swords className="w-5 h-5 text-emerald-400 animate-pulse" />
              <div>
                <span className="text-[9px] text-zinc-500 block font-bold tracking-wider">MATCH_ID // {matchId.substring(0, 12).toUpperCase()}</span>
                <h2 className="text-base font-black tracking-wide text-white">
                  {caseData?.title || 'Resolving Active Encrypted Vector'}
                </h2>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-zinc-500 block uppercase tracking-wider font-bold">Staked Pot</span>
              <span className="text-sm font-black text-emerald-400">{pot} POOL</span>
            </div>
          </div>

          {/* Core Case Parameters Section */}
          <div className="space-y-4 mt-4">
            <div className="p-3 bg-zinc-900/30 border border-zinc-800/40 rounded-xl text-xs flex justify-between items-center">
              <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Target Competitor Proxy</span>
              <span className="text-emerald-400 font-bold tracking-wide text-xs">{opponent || 'UNKNOWN NODE'}</span>
            </div>

            <div className="text-xs">
              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-1.5">Raid Core Parameters</label>
              <p className="text-zinc-400 leading-relaxed bg-black/40 p-4 rounded-xl border border-zinc-900">
                {caseData?.briefing}
              </p>
            </div>

            {caseData?.question && (
              <div className="text-xs">
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-1.5">Objective</label>
                <p className="text-zinc-200 leading-relaxed bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 font-medium">
                  {caseData.question}
                </p>
              </div>
            )}

            {caseData?.fragments && caseData.fragments.length > 0 && (
              <div className="text-xs">
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">Fragments</label>
                <div className="flex flex-wrap gap-2">
                  {caseData.fragments.map((fragment, index) => (
                    <span
                      key={`${fragment}-${index}`}
                      className="inline-flex items-center px-3 py-2 rounded-full bg-emerald-950/30 border border-emerald-900 text-emerald-300 text-[10px] font-semibold tracking-wide"
                    >
                      {fragment}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {caseData?.encryptedText && (
              <div className="text-xs">
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-1.5">Encrypted Text</label>
                <div className="bg-black/60 p-3 border border-zinc-900 rounded-xl font-mono text-[11px] text-zinc-400 leading-normal break-all">
                  {caseData.encryptedText}
                </div>
              </div>
            )}

            {caseData?.signal && (
              <div className="text-xs">
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-1.5">Signal Pattern</label>
                <div className="bg-black/60 p-3 border border-zinc-900 rounded-xl font-mono text-[11px] text-zinc-400 leading-normal">
                  {caseData.signal}
                </div>
              </div>
            )}

            {caseData?.packets && caseData.packets.length > 0 && (
              <div className="text-xs">
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-1.5">Packet Trace</label>
                <div className="flex flex-wrap gap-2">
                  {caseData.packets.map((packet, index) => (
                    <span
                      key={`${packet}-${index}`}
                      className="inline-flex items-center px-3 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-[10px] font-semibold tracking-wide"
                    >
                      {packet}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {caseData?.hashes && caseData.hashes.length > 0 && (
              <div className="text-xs">
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-1.5">Hash Candidates</label>
                <div className="flex flex-wrap gap-2">
                  {caseData.hashes.map((hash, index) => (
                    <span
                      key={`${hash}-${index}`}
                      className="inline-flex items-center px-3 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-[10px] font-semibold tracking-wide"
                    >
                      {hash}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {caseData?.commandFragments && caseData.commandFragments.length > 0 && (
              <div className="text-xs">
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">Command Fragments</label>
                <div className="flex flex-wrap gap-2">
                  {caseData.commandFragments.map((fragment, index) => (
                    <span
                      key={`${fragment}-${index}`}
                      className="inline-flex items-center px-3 py-2 rounded-full bg-emerald-950/30 border border-emerald-900 text-emerald-300 text-[10px] font-semibold tracking-wide"
                    >
                      {fragment}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Hex Data Stream Panel */}
            {caseData?.payload && (
              <div className="text-xs">
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-1.5">Hex Stream Buffer</label>
                <div className="bg-black/60 p-3 border border-zinc-900 rounded-xl break-all font-mono text-[11px] text-zinc-400 leading-normal max-h-32 overflow-y-auto">
                  {caseData.payload}
                </div>
              </div>
            )}

            {caseData?.contractCode && (
              <div className="text-xs">
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-1.5">Decompiled Deployed Bytecode</label>
                <pre className="bg-black/60 p-3 border border-zinc-900 rounded-xl font-mono text-[10px] text-yellow-300/90 overflow-x-auto whitespace-pre max-h-48">
                  {caseData.contractCode.trim()}
                </pre>
              </div>
            )}

            {caseData?.puzzle && (
              <div className="text-xs">
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-1.5">Incomplete Block Matrix String</label>
                <div className="bg-black/60 p-3 border border-zinc-900 rounded-xl font-mono text-center text-emerald-400 tracking-widest font-black text-sm">
                  {caseData.puzzle}
                </div>
              </div>
            )}

            {/* System Output Logs Pipeline */}
            {caseData?.terminalLogs && (
              <div className="rounded-xl overflow-hidden border border-zinc-900">
                <TerminalOutput logs={caseData.terminalLogs} />
              </div>
            )}
          </div>
        </div>

        {/* Action Form Override Key Injection */}
        <form onSubmit={submitSolution} className="pt-4 border-t border-zinc-900">
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Inject precise case override key or decrypted string..."
              className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-zinc-700 text-white font-mono placeholder:text-zinc-600 shadow-inner"
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-emerald-400 font-bold text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 uppercase"
            >
              Execute
            </button>
          </div>
        </form>
      </div>

      {/* Right Area: Auxiliary Intelligence Intelligence Sidebar */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* Real-time Validation Engine Notifications */}
        {feedback && (
          <div className={`p-4 border rounded-xl text-xs flex items-start gap-3 animate-slideIn ${
            feedback.correct 
              ? 'bg-emerald-950/10 border-emerald-900/30 text-emerald-400' 
              : 'bg-red-950/10 border-red-900/30 text-red-400'
          }`}>
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold uppercase tracking-wider text-[10px] mb-0.5">
                {feedback.correct ? 'Verification Successful' : 'Signature Rejected'}
              </h4>
              <p className="leading-relaxed opacity-90 text-[11px] font-mono">{feedback.message}</p>
            </div>
          </div>
        )}

        {/* Signal Clue Panel */}
        {caseData?.clue && (
          <div className="border border-zinc-800/40 bg-zinc-900/10 p-4 rounded-xl text-xs space-y-1.5">
            <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">Intercepted Signal Clue</label>
            <p className="text-zinc-300 leading-relaxed font-medium bg-black/40 p-3 rounded-xl border border-zinc-900 font-mono text-[11px]">
              {caseData.clue}
            </p>
          </div>
        )}

        {caseData?.fragments && caseData.fragments.length > 0 && (
          <div className="border border-emerald-900/30 bg-emerald-950/5 p-4 rounded-xl text-xs">
            <label className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest block mb-2">Reassembly Fragments</label>
            <div className="grid grid-cols-1 gap-2">
              {caseData.fragments.map((fragment, index) => (
                <div
                  key={`${fragment}-${index}`}
                  className="inline-flex items-center px-3 py-2 rounded-full bg-emerald-950/20 border border-emerald-900 text-emerald-200 text-[10px] font-semibold tracking-widest"
                >
                  {fragment}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decryption Sub-Engine Utility Module */}
        <div className="border border-zinc-800/40 bg-zinc-900/10 p-4 rounded-xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-white tracking-widest uppercase min-w-0">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              <span className="truncate">Decryption</span>
            </div>

            <div className="flex-shrink-0">
              <button
                type="button"
                disabled={!!hintText}
                onClick={triggerHintRequest}
                className="text-[10px] text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 px-3 py-1 rounded-md hover:bg-emerald-950/40 transition-all disabled:opacity-30 disabled:pointer-events-none whitespace-nowrap"
              >
                Decrypt
              </button>
            </div>
          </div>

          {hintText ? (
            <div className="text-[11px] text-zinc-400 bg-black/40 border border-zinc-900 p-3 rounded-xl leading-relaxed font-mono animate-fadeIn mt-3">
              {hintText}
            </div>
          ) : (
            <p className="text-[11px] text-zinc-500 italic font-mono leading-normal mt-3">
              Decrypt structural metadata matrices if extraction parameters remain elusive.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}