// import React from 'react';
// import { Shield, Terminal, Zap, Layers, Award } from 'lucide-react';

// export default function Dashboard({ user, onSelectSolo, onSelectPvP, onlineCount = 1 }) {
//   if (!user) return <div className="text-cyber-primary animate-pulse text-xs">SYNCHRONIZING USER CONTEXT...</div>;

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
//       {/* Profiler Card */}
//       <div className="border border-cyber-border bg-cyber-card p-6 relative rounded shadow-lg overflow-hidden">
//         <div className="absolute top-0 right-0 bg-cyber-primary/10 border-l border-b border-cyber-border px-3 py-1 text-[10px] text-cyber-primary font-bold">
//           {user.tier}
//         </div>
//         <div className="flex items-center gap-4 mb-6">
//           <div className="w-14 h-14 border border-cyber-primary bg-cyber-primary/5 flex items-center justify-center rounded relative">
//             <Shield className="w-7 h-7 text-cyber-primary" />
//             <div className="absolute -bottom-1 -right-1 bg-cyber-primary text-cyber-bg text-[10px] px-1 font-extrabold rounded">
//               Lvl {user.level}
//             </div>
//           </div>
//           <div>
//             <h2 className="text-lg font-bold tracking-wide text-white">{user.name}</h2>
//             <p className="text-xs text-cyber-muted font-mono">ID: {user.id}</p>
//           </div>
//         </div>

//         <div className="space-y-3 text-xs">
//           <div className="flex justify-between items-center py-1.5 border-b border-cyber-border/40">
//             <span className="text-cyber-muted">Reputation Pool</span>
//             <span className="font-bold text-cyber-primary">{user.rep} RP</span>
//           </div>
//           <div className="flex justify-between items-center py-1.5 border-b border-cyber-border/40">
//             <span className="text-cyber-muted">Streak Lock</span>
//             <span className="font-bold text-cyber-secondary flex items-center gap-1">
//               <Zap className="w-3 h-3 fill-current" /> {user.streak} Days
//             </span>
//           </div>
//           <div className="flex justify-between items-center py-1.5 border-b border-cyber-border/40">
//             <span className="text-cyber-muted">Sustained Volume</span>
//             <span className="font-bold text-white">${user.volume.toLocaleString()}</span>
//           </div>

//           <div className="pt-2">
//             <div className="flex justify-between text-[11px] mb-1">
//               <span className="text-cyber-muted">Next Rank Tier: {user.nextTier?.name}</span>
//               <span className="text-cyber-primary font-bold">{user.rep}/{user.nextTier?.threshold}</span>
//             </div>
//             <div className="w-full bg-cyber-bg border border-cyber-border h-2 rounded-full overflow-hidden p-[1px]">
//               <div 
//                 className="bg-cyber-primary h-full rounded-full shadow-[0_0_8px_#00ff66]" 
//                 style={{ width: `${Math.min((user.rep / user.nextTier?.threshold) * 100, 100)}%` }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mode Allocators */}
//       <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Solo Terminal Mode */}
//         <div className="border border-cyber-border bg-cyber-card p-6 flex flex-col justify-between rounded group hover:border-cyber-primary/40 transition-all duration-300 relative">
//           <div>
//             <div className="flex items-center gap-3 text-cyber-primary mb-3">
//               <Terminal className="w-5 h-5" />
//               <h3 className="font-bold tracking-wider text-sm">SOLO INVESTIGATION LABS</h3>
//             </div>
//             <p className="text-xs text-gray-400 leading-relaxed mb-4">
//               Analyze isolated infrastructure failure payloads, trace cryptographic leaks, and unlock multi-stage network matrices asynchronously. Great for building operational skills.
//             </p>
//           </div>
//           <button 
//             onClick={onSelectSolo}
//             className="w-full py-2.5 bg-cyber-primary/5 border border-cyber-primary text-cyber-primary text-xs font-bold tracking-wider hover:bg-cyber-primary hover:text-black transition-all duration-200"
//           >
//             BOOT INTERROGATION CORE
//           </button>
//         </div>

//         {/* Competitive PvP Grid */}
//         <div className="border border-cyber-border bg-cyber-card p-6 flex flex-col justify-between rounded group hover:border-cyber-secondary/40 transition-all duration-300 relative">
//           <div className="absolute top-3 right-3 flex items-center gap-1.5">
//             <span className="w-2 h-2 rounded-full bg-cyber-secondary animate-ping" />
//             <span className="text-[10px] text-cyber-secondary font-bold">NODE ACTIVE</span>
//           </div>
//           <div>
//             <div className="flex items-center gap-3 text-cyber-secondary mb-3">
//               <Layers className="w-5 h-5" />
//               <h3 className="font-bold tracking-wider text-sm">STAKED PVP RAIDS</h3>
//             </div>
//             <p className="text-xs text-gray-400 leading-relaxed mb-4">
//               Match parameters live against rival analysts. Race head-to-head to extract unverified signatures, resolve memory loops, and siphon active staking pots.
//             </p>
//           </div>
//           <button 
//             onClick={onSelectPvP}
//             className="w-full py-2.5 bg-cyber-secondary/5 border border-cyber-secondary text-cyber-secondary text-xs font-bold tracking-wider hover:bg-cyber-secondary hover:text-black transition-all duration-200"
//           >
//             INITIALIZE MATCHMAKING
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from 'react';

export default function Dashboard({ user, selectedPlayer, onPlayerSelect, onSelectSolo, onSelectPvP }) {
  const profile = user || {
    username: "Ada Lovelace",
    title: "Apex Trader",
    streak: 5,
    volume: 15400,
    rep: 1250,
    ranking: "Top 4.2%",
    tierProgress: 100,
    nextTier: "The Oracle at 2500 Rep"
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 font-mono text-zinc-300">
      
      <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 flex justify-between items-center">
        <div>
          <p className="text-[20px] text-emerald-500 font-bold tracking-widest uppercase mb-1">
            SWIFTY CIRCLE
          </p>
          <h2 className="text-xl font-bold tracking-wide text-white">
            Circle Reputation Terminal
          </h2>
        </div>
        <div>
          <span className="bg-black/60 border border-zinc-800 text-xs px-4 py-2 rounded-full font-bold shadow-inner">
            Rep: <span className="text-white font-black">{profile.rep || 1250}</span>
          </span>
        </div>
      </div>

      <div className="bg-zinc-900/20 border border-zinc-800/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-white tracking-wide">Mock Match Mode</h4>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Select a mock player profile for local testing.
          </p>
        </div>
        <div className="relative min-w-[220px]">
          <select 
            value={selectedPlayer}
            onChange={(e) => onPlayerSelect(e.target.value)}
            className="w-full bg-black border border-zinc-800 text-emerald-400 text-xs px-3 py-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-emerald-500/50"
          >
            <option value="1">Player 1 — {profile.username}</option>
            <option value="2">Player 2 — Satoshi Osun</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-emerald-500 text-[10px]">
            ▼
          </div>
        </div>
      </div>

      {/* 3. CORE METRICS SUB-GRID INTERFACE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Ecosystem Identity Column */}
        <div className="md:col-span-4 bg-zinc-900/10 border border-zinc-800/40 rounded-xl p-5 space-y-5 min-h-[260px]">
          <div>
            <p className="text-[9px] text-zinc-500 tracking-widest font-bold uppercase mb-2">
              ECOSYSTEM IDENTITY CARD
            </p>
            <h3 className="text-lg font-black text-white tracking-wide">
              {profile.username}
            </h3>
          </div>

          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">
              Trader Status Rank
            </p>
            <p className="text-xs font-bold text-emerald-400">
              {profile.title}
            </p>
          </div>

          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
              Activity Chain Streak
            </p>
            <p className="text-xs font-medium text-zinc-200 flex items-center gap-1">
              🔥 {profile.streak || 5} Days active
            </p>
          </div>
        </div>

        {/* Right Side: Volume, Ranking, Telegram Link,  Progress */}
        <div className="md:col-span-8 space-y-4">
          
          {/* Volume and Ranking Split Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-xl p-4">
              <p className="text-[9px] text-zinc-500 tracking-wider uppercase mb-1">
                GROSS AGGREGATED VOLUME
              </p>
              <p className="text-xl font-bold text-white">
                ${(profile.volume || 15400).toLocaleString()}
              </p>
            </div>

            <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-xl p-4">
              <p className="text-[9px] text-zinc-500 tracking-wider uppercase mb-1">
                RANKING MOMENTUM
              </p>
              <p className="text-xl font-bold text-white">
                {profile.ranking || "Top 4.2%"}
              </p>
            </div>
          </div>

          {/* Telegram Networking Banner */}
          <div className="bg-emerald-950/10 border border-emerald-900/20 rounded-xl p-4 flex gap-3 items-start">
            <span className="text-emerald-400 text-xs mt-0.5">💡</span>
            <div>
              <h5 className="text-xs font-bold text-emerald-400 tracking-wide mb-1">
                Inline Telegram Networking Flex Enabled
              </h5>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Type <span className="text-emerald-400 font-semibold bg-emerald-950/40 px-1 py-0.5 rounded border border-emerald-900/30 font-mono">@SwiftyExBot</span> in any private group chat to drop a live "Circle" card of your tier, volume, and rank.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900/10 border border-zinc-800/30 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
              <span>Tier Progress</span>
            </div>
            <div className="w-full bg-zinc-950 rounded-full h-2 border border-zinc-900 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#00ff66]" 
                style={{ width: `${profile.tierProgress || 100}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-zinc-500">
              Next tier goal: <span className="text-zinc-300 font-medium">
                {typeof profile.nextTier === 'object'
                  ? `${profile.nextTier.name || 'Next Tier'} at ${profile.nextTier.threshold || '?'} Rep`
                  : (profile.nextTier || 'The Oracle at 2500 Rep')
                }
              </span>
            </p>
          </div>

        </div>
      </div>

      {/* 4. MODE ENGAGEMENT ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-900">
        <button 
          onClick={onSelectSolo}
          className="bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-800/40 hover:border-emerald-500/50 text-emerald-400 font-bold py-3 px-4 rounded-xl text-xs tracking-wider uppercase transition-all duration-200 shadow-sm"
        >
          Initialize Solo Run
        </button>
        <button 
          onClick={onSelectPvP}
          className="bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-bold py-3 px-4 rounded-xl text-xs tracking-wider uppercase transition-all duration-200"
        >
          Enter Matchmaking Queue
        </button>
      </div>

    </div>
  );
}