// import React, { useState, useEffect } from 'react';
// import { useSocket } from '../context/SocketContext';
// import { RefreshCw, Users, Shield, Target } from 'lucide-react';

// export default function MatchmakingQueue({ user, onMatchFound, onCancel }) {
//   const { socket } = useSocket();
//   const [stake, setStake] = useState(100);
//   const [preferredCaseId, setPreferredCaseId] = useState('');
//   const [availableCases, setAvailableCases] = useState([]);
//   const [inQueue, setInQueue] = useState(false);
//   const [queueError, setQueueError] = useState('');

//   useEffect(() => {
//     // Fetch system options
//     fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cases`)
//       .then((res) => res.json())
//       .then((data) => setAvailableCases(data))
//       .catch((err) => console.error("Could not trace available cases:", err));
//   }, []);

//   useEffect(() => {
//     if (!socket) return;

//     socket.on('match_found', (payload) => {
//       onMatchFound(payload);
//     });

//     socket.on('match_rejected', (data) => {
//       setInQueue(false);
//       setQueueError(data.reason);
//     });

//     return () => {
//       socket.off('match_found');
//       socket.off('match_rejected');
//     };
//   }, [socket, onMatchFound]);

//   const joinQueue = (e) => {
//     e.preventDefault();
//     if (!socket || !user) return;

//     setQueueError('');
//     setInQueue(true);

//     socket.emit('join_queue', {
//       userId: user.id,
//       detectiveName: user.name,
//       stake: Number(stake),
//       preferredCaseId: preferredCaseId || undefined
//     });
//   };

//   if (inQueue) {
//     return (
//       <div className="max-w-md mx-auto border border-cyber-secondary bg-cyber-card p-8 text-center rounded relative shadow-[0_0_20px_rgba(0,229,255,0.05)] animate-fadeIn">
//         <div className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-secondary animate-pulse" />
//         <div className="relative mb-4 flex justify-center">
//           <RefreshCw className="w-10 h-10 text-cyber-secondary animate-spin" />
//         </div>
//         <h3 className="text-md font-bold tracking-widest text-white mb-2">MATCHMAKING STACK RUNNING</h3>
//         <p className="text-xs text-cyber-muted mb-4 max-w-xs mx-auto leading-relaxed">
//           Polling active network registers to match parameters against alternative available proxies.
//         </p>
//         <div className="bg-black/40 border border-cyber-border rounded p-3 mb-6 space-y-1.5 text-xs text-left max-w-xs mx-auto font-mono">
//           <div className="flex justify-between"><span className="text-cyber-muted">Identity Asset:</span> <span className="text-white">{user?.name}</span></div>
//           <div className="flex justify-between"><span className="text-cyber-muted">Allocated Stake:</span> <span className="text-cyber-secondary font-bold">{stake} RP</span></div>
//         </div>
//         <button 
//           onClick={() => {
//             // Hard clean reload to drop connections and state safety safely
//             window.location.reload();
//           }}
//           className="text-xs px-4 py-1.5 border border-cyber-alert/40 text-cyber-alert rounded hover:bg-cyber-alert hover:text-black font-bold transition-all"
//         >
//           DISCONNECT QUEUE
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-xl mx-auto border border-cyber-border bg-cyber-card rounded overflow-hidden shadow-xl animate-scaleIn">
//       <div className="border-b border-cyber-border px-5 py-4 bg-black/20 flex items-center gap-3">
//         <Users className="w-5 h-5 text-cyber-secondary" />
//         <div>
//           <h2 className="text-sm font-bold tracking-wider text-white">LIVE PVP MATCHMAKING REGISTRY</h2>
//           <p className="text-[11px] text-cyber-muted">Configure execution parameters before linking nodes.</p>
//         </div>
//       </div>

//       <form onSubmit={joinQueue} className="p-6 space-y-5">
//         {queueError && (
//           <div className="p-3 bg-cyber-alert/5 border border-cyber-alert text-cyber-alert text-xs font-bold rounded">
//             Registration Refused: {queueError}
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="text-[10px] text-cyber-muted font-bold uppercase block mb-1.5">Staking Parameter (RP)</label>
//             <div className="relative">
//               <Shield className="absolute left-3 top-2.5 w-4 h-4 text-cyber-muted" />
//               <input 
//                 type="number"
//                 min="0"
//                 max={user?.rep || 1000}
//                 value={stake}
//                 onChange={(e) => setStake(e.target.value)}
//                 className="w-full bg-black/50 border border-cyber-border rounded pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyber-secondary font-mono"
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-[10px] text-cyber-muted font-bold uppercase block mb-1.5">Target Specific Case Matrix</label>
//             <div className="relative">
//               <Target className="absolute left-3 top-2.5 w-4 h-4 text-cyber-muted" />
//               <select
//                 value={preferredCaseId}
//                 onChange={(e) => setPreferredCaseId(e.target.value)}
//                 className="w-full bg-black/50 border border-cyber-border rounded pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyber-secondary font-mono appearance-none"
//               >
//                 <option value="">Randomized Node Target</option>
//                 {availableCases.map((c) => (
//                   <option key={c.id} value={c.id}>{c.title}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="pt-2 flex gap-3">
//           <button 
//             type="button"
//             onClick={onCancel}
//             className="w-1/3 py-2 border border-cyber-border text-cyber-muted text-xs font-bold hover:bg-black/40 transition-all rounded"
//           >
//             RETURN
//           </button>
//           <button 
//             type="submit"
//             className="w-2/3 py-2 bg-cyber-secondary text-cyber-bg font-extrabold text-xs tracking-wider hover:bg-white transition-all rounded shadow-[0_0_12px_rgba(0,229,255,0.1)]"
//           >
//             LINK TO MATCHMAKING STACK
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useApi } from '../services/api';
import { RefreshCw, Users, Shield, Target } from 'lucide-react';

export default function MatchmakingQueue({ user, onMatchFound, onCancel }) {
  const { socket } = useSocket();
  const { apiGame, apiUser } = useApi();
  const [stake, setStake] = useState(100);
  const [preferredCaseId, setPreferredCaseId] = useState('');
  const [availableCases, setAvailableCases] = useState([]);
  const [inQueue, setInQueue] = useState(false);
  const [queueError, setQueueError] = useState('');

  const displayName = user?.name || user?.username || user?.firstName || 'Anonymous Node';
  const isLocalProfile = ['1', '2'].includes(String(user?.id)) || /^(ada|satoshi)$/i.test(String(user?.username || ''));

  const leaveQueue = () => {
    if (!socket || !inQueue) return;
    socket.emit('leave_queue', { userId: user?.id });
    setInQueue(false);
    setQueueError('');
  };

  const handleCancel = () => {
    if (inQueue) leaveQueue();
    onCancel();
  };

  useEffect(() => {
    // Fetch system options using API client
    apiGame
      .getCases()
      .then((data) => setAvailableCases(data))
      .catch((err) => console.error('Could not trace available cases:', err));
  }, [apiGame]);

  useEffect(() => {
    if (!socket) return;

    socket.on('match_invite', (payload) => {
      console.log('[client] match_invite received', payload);
      setInQueue(false);
      onMatchFound(payload);
    });

    socket.on('match_rejected', (data) => {
      setInQueue(false);
      setQueueError(data.reason);
    });

    socket.on('left_queue', () => {
      setInQueue(false);
      setQueueError('');
    });

    return () => {
      socket.off('match_invite');
      socket.off('match_rejected');
      socket.off('left_queue');
    };
  }, [socket, onMatchFound]);

  useEffect(() => {
    return () => {
      if (socket && inQueue) {
        socket.emit('leave_queue', { userId: user?.id });
      }
    };
  }, [socket, inQueue, user?.id]);

  const joinQueue = async (e) => {
    e.preventDefault();
    if (!socket || !user) return;

    setQueueError('');
    setInQueue(true);

    const fallbackName = user?.name || user?.firstName || user?.username || 'Unknown Detective';
    let detectiveName = fallbackName;

    if (isLocalProfile) {
      detectiveName = fallbackName;
      console.log('[client] using stable local profile name for queue join', { detectiveName });
      socket.emit('join_queue', {
        userId: user.id,
        detectiveName,
        stake: Number(stake),
        preferredCaseId: preferredCaseId || undefined,
      });
      return;
    }

    const isGenericName = (value) =>
      !value || /^(devuser|dev user|user\s*\d+)$/i.test(String(value).trim());

    try {
      const profile = await apiUser.getProfile(String(user.id));
      const remoteName = isGenericName(profile?.name) ? '' : profile?.name;
      const remoteUsername = isGenericName(profile?.username) ? '' : profile?.username;
      detectiveName = remoteName || remoteUsername || profile?.firstName || fallbackName;
    } catch (err) {
      console.debug('[client] could not fetch authoritative profile before join_queue:', err);
    }

    if (isGenericName(detectiveName)) {
      detectiveName = fallbackName;
    }

    console.log('[client] emitting join_queue', { userId: user.id, detectiveName, stake: Number(stake), preferredCaseId });
    socket.emit('join_queue', {
      userId: user.id,
      detectiveName,
      stake: Number(stake),
      preferredCaseId: preferredCaseId || undefined
    });
  };

  // --- STATE 1: RUNNING SYNC MATCHMAKING QUEUE ---
  if (inQueue) {
    return (
      <div className="max-w-md mx-auto bg-zinc-900/40 border border-zinc-800/80 p-8 text-center rounded-2xl relative shadow-2xl animate-fadeIn font-mono">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500/80 animate-pulse" />
        
        <div className="relative mb-5 flex justify-center">
          <RefreshCw className="w-10 h-10 text-emerald-400Safe text-emerald-400 animate-spin" />
        </div>
        
        <h3 className="text-sm font-black tracking-widest text-white uppercase mb-2">
          Matchmaking Stack Running
        </h3>
        <p className="text-[11px] text-zinc-500 mb-6 max-w-xs mx-auto leading-relaxed">
          Polling active network registers to match parameters against alternative available proxies.
        </p>
        
        <div className="bg-black/40 border border-zinc-900 rounded-xl p-4 mb-6 space-y-2 text-xs text-left max-w-xs mx-auto font-mono">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Identity Asset:</span> 
            <span className="text-zinc-200 font-medium">{displayName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Allocated Stake:</span> 
            <span className="text-emerald-400 font-bold">{stake} Rep</span>
          </div>
        </div>
        
        <button 
          onClick={leaveQueue}
          className="text-[10px] tracking-wider uppercase px-5 py-2.5 bg-zinc-900 hover:bg-red-950/20 border border-zinc-800 hover:border-red-900/40 text-zinc-400 hover:text-red-400 rounded-xl font-bold transition-all duration-200"
        >
          Disconnect Queue
        </button>
      </div>
    );
  }

  // --- STATE 2: CONFIGURATION GATE / REGISTRY SETTINGS ---
  return (
    <div className="max-w-xl mx-auto bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl animate-scaleIn font-mono text-zinc-300">
      
      {/* Header Container */}
      <div className="border-b border-zinc-900 px-6 py-5 bg-zinc-900/20 flex items-center gap-3.5">
        <Users className="w-5 h-5 text-emerald-400" />
        <div>
          <h2 className="text-sm font-black tracking-widest text-white uppercase">Live PvP Matchmaking Registry</h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">Configure execution parameters before linking nodes.</p>
        </div>
      </div>

      <form onSubmit={joinQueue} className="p-6 space-y-5">
        {queueError && (
          <div className="p-4 bg-red-950/10 border border-red-900/30 text-red-400 text-xs font-bold rounded-xl font-mono">
            Registration Refused: <span className="opacity-90 font-medium">{queueError}</span>
          </div>
        )}

        {/* Input Parameters Twin Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Column A: Staking Target parameter */}
          <div className="space-y-1.5">
            <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">Staking Parameter (Rep)</label>
            <div className="relative">
              <Shield className="absolute left-3.5 top-3 w-4 h-4 text-zinc-600" />
              <input 
                type="number"
                min="0"
                max={user?.rep || 1000}
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-zinc-700 font-mono shadow-inner"
                required
              />
            </div>
          </div>

          {/* Column B: Selected Dropdown Matrix Case */}
          <div className="space-y-1.5">
            <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">Target Specific Case Matrix</label>
            <div className="relative">
              <Target className="absolute left-3.5 top-3 w-4 h-4 text-zinc-600" />
              <select
                value={preferredCaseId}
                onChange={(e) => setPreferredCaseId(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-8 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 font-mono appearance-none cursor-pointer"
              >
                <option value="">Randomized Node Target</option>
                {availableCases.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-zinc-600 text-[9px]">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Form Action Controls Footer */}
        <div className="pt-3 flex flex-col sm:flex-row gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="sm:w-1/3 py-3 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-bold hover:bg-zinc-900 rounded-xl transition-all tracking-wider uppercase order-2 sm:order-1"
          >
            Return
          </button>
          <button 
            type="submit"
            className="sm:w-2/3 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-emerald-400 font-black text-xs tracking-wider rounded-xl transition-all uppercase order-1 sm:order-2 shadow-sm"
          >
            Link to Matchmaking Stack
          </button>
        </div>
      </form>
    </div>
  );
}