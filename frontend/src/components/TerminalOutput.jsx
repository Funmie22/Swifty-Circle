// import React, { useEffect, useRef } from 'react';

// export default function TerminalOutput({ logs }) {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.scrollTop = containerRef.current.scrollHeight;
//     }
//   }, [logs]);

//   return (
//     <div className="border border-cyber-border bg-black/60 rounded p-4 font-mono text-[11px] leading-relaxed relative">
//       <div className="absolute top-2 right-3 text-[9px] text-cyber-muted tracking-widest uppercase select-none">
//         Live Buffer Stream
//       </div>
//       <div 
//         ref={containerRef}
//         className="h-44 overflow-y-auto space-y-1 pr-2 text-cyber-muted"
//       >
//         {Array.isArray(logs) && logs.length > 0 ? (
//           logs.map((log, index) => {
//             let colorClass = "text-gray-400";
//             if (log.includes("WARNING")) colorClass = "text-yellow-400 font-semibold";
//             if (log.includes("FAILSAFE") || log.includes("EMERGENCY")) colorClass = "text-cyber-alert font-bold";
//             if (log.includes("SECURE") || log.includes("SUCCESS")) colorClass = "text-cyber-primary";
            
//             return (
//               <div key={index} className={`whitespace-pre-wrap ${colorClass}`}>
//                 {log}
//               </div>
//             );
//           })
//         ) : (
//           <div className="text-cyber-muted italic animate-pulse">
//             No active terminal traces broadcasting on this channel.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useRef } from 'react';

export default function TerminalOutput({ logs }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="border border-zinc-800/60 bg-black/60 rounded-xl p-4 font-mono text-[11px] leading-relaxed relative overflow-hidden shadow-inner">
      {/* Absolute Header Tag */}
      <div className="absolute top-3 right-4 text-[9px] text-zinc-500 tracking-widest font-bold uppercase select-none">
        Live Buffer Stream
      </div>
      
      <div 
        ref={containerRef}
        className="h-44 overflow-y-auto space-y-1.5 pr-2 text-zinc-400 mt-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
      >
        {Array.isArray(logs) && logs.length > 0 ? (
          logs.map((log, index) => {
            let colorClass = "text-zinc-400";
            if (log.includes("WARNING")) colorClass = "text-yellow-400/90 font-medium";
            if (log.includes("FAILSAFE") || log.includes("EMERGENCY")) colorClass = "text-red-400 font-bold";
            if (log.includes("SECURE") || log.includes("SUCCESS")) colorClass = "text-emerald-400 font-medium";
            
            return (
              <div key={index} className={`whitespace-pre-wrap tracking-wide ${colorClass}`}>
                {log}
              </div>
            );
          })
        ) : (
          <div className="text-zinc-600 italic animate-pulse py-1">
            No active terminal traces broadcasting on this channel.
          </div>
        )}
      </div>
    </div>
  );
}