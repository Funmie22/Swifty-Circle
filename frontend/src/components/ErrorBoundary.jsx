// import React, { Component } from 'react';
// import { AlertTriangle } from 'lucide-react';

// export class ErrorBoundary extends Component {
//   state = { hasError: false, error: null };

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("Critical System Defect Intercepted:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 font-mono">
//           <div className="max-w-md w-full border border-red-500 bg-[#0c1017] p-6 rounded shadow-2xl relative overflow-hidden">
//             <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-pulse" />
//             <div className="flex items-center gap-3 text-red-500 mb-4">
//               <AlertTriangle className="w-6 h-6" />
//               <h2 className="text-lg font-bold tracking-wider">KERNEL PANIC IN CORE UI</h2>
//             </div>
//             <p className="text-gray-400 text-xs mb-4 leading-relaxed">
//               An unhandled runtime error crashed the visualization layer. Trace logs recorded below.
//             </p>
//             <div className="bg-black/40 p-3 rounded text-[11px] text-red-400 overflow-x-auto border border-red-950 mb-4 font-mono">
//               {this.state.error?.toString()}
//             </div>
//             <button 
//               onClick={() => window.location.reload()} 
//               className="w-full py-2 bg-red-950 border border-red-500 text-red-200 hover:bg-red-500 hover:text-black transition-all text-xs font-bold"
//             >
//               INITIALIZE HARD SYSTEM RESET
//             </button>
//           </div>
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

import React, { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical System Defect Intercepted:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 font-mono selection:bg-red-500 selection:text-black">
          <div className="max-w-md w-full bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Top thematic layout strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-500/80 animate-pulse" />
            
            {/* Alert Header Block */}
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
              <h2 className="text-sm font-black tracking-widest uppercase">
                Kernel Panic In Core UI
              </h2>
            </div>
            
            <p className="text-zinc-400 text-xs mb-4 leading-relaxed">
              An unhandled runtime error crashed the visualization layer. Terminal traces have been intercepted and recorded below.
            </p>
            
            {/* Exception Output Console */}
            <div className="bg-black/60 p-3 rounded-xl text-[11px] text-red-400/90 overflow-x-auto border border-zinc-900 mb-5 font-mono max-h-40 leading-normal">
              {this.state.error?.toString() || "Unknown core interface exception."}
            </div>
            
            {/* Hard Reset System Trigger */}
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-3 bg-zinc-900 hover:bg-red-950/20 border border-zinc-800 hover:border-red-900/50 text-zinc-300 hover:text-red-400 text-xs font-bold tracking-wider uppercase rounded-xl transition-all duration-200"
            >
              Initialize Hard System Reset
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
