import React, { useState, useEffect } from 'react';
import { useSocket } from './context/SocketContext';
import { useTelegram } from './context/TelegramContext';
import { useApi } from './services/api';
import DashBoard from './components/DashBoard';
import ActiveSolo from './components/ActiveSolo';
import MatchmakingQueue from './components/MatchmakingQueue';
import ActiveMatch from './components/ActiveMatch';
import { Cpu, Wifi, WifiOff } from 'lucide-react';

export default function App() {
  const { socket, connected, error } = useSocket();
  const { user: telegramUser, isReady, hapticFeedback, isWebApp } = useTelegram();
  const { apiUser, haptic } = useApi();
  const [currentView, setCurrentView] = useState('DASHBOARD'); // DASHBOARD, SOLO, QUEUE, MATCH
  const [activeMatchPayload, setActiveMatchPayload] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState('1'); // For local dev only

  // Detect if we're in local dev (not in Telegram)
  const isLocalDev = !isWebApp && isReady;

  const buildLocalProfile = (userId) => {
    const profile = devProfiles[String(userId)] || {
      id: String(userId),
      name: `Local Player ${userId}`,
      firstName: 'Local',
      lastName: 'Player',
      username: 'localplayer',
      rep: 0,
      tier: 'Initiate',
      streak: 0,
      volume: 0,
      level: 1,
      nextTier: { name: 'Apprentice', threshold: 100 },
    };

    return {
      ...profile,
      id: String(profile.id || userId),
      name: profile.name || 'Local Detective',
      firstName: profile.firstName || 'Local',
      lastName: profile.lastName || 'Detective',
      username: profile.username || 'localplayer',
    };
  };

  const devProfiles = {
    '1': {
      id: '1',
      name: 'Ada Lovelace',
      firstName: 'Ada',
      lastName: 'Lovelace',
      username: 'ada',
      rep: 1250,
      tier: 'Apex Trader',
      streak: 5,
      volume: 15400,
      level: 18,
      nextTier: { name: 'The Oracle', threshold: 2500 },
    },
    '2': {
      id: '2',
      name: 'Satoshi Osun',
      firstName: 'Satoshi',
      lastName: 'Osun',
      username: 'satoshi',
      rep: 320,
      tier: 'Apprentice',
      streak: 2,
      volume: 450,
      level: 14,
      nextTier: { name: 'Strategist', threshold: 500 },
    },
  };

  // Initialize user from Telegram data or manual selection
  useEffect(() => {
    if (!isReady) return;

    const userId = isLocalDev ? selectedPlayer : String(telegramUser?.id);

    if (!userId) {
      setLoading(false);
      return;
    }

    // Use API service with automatic initData
    apiUser
      .getProfile(userId)
      .then((data) => {
        if (isLocalDev) {
          const localProfile = buildLocalProfile(userId);

          setUser({
            ...localProfile,
            ...data,
            id: String(data.id || userId),
            name: localProfile.name,
            username: localProfile.username,
            firstName: localProfile.firstName,
            lastName: localProfile.lastName,
            rep: data.rep ?? localProfile.rep,
            tier: data.tier ?? localProfile.tier,
            streak: data.streak ?? localProfile.streak,
            volume: data.volume ?? localProfile.volume,
            level: data.level ?? localProfile.level,
            nextTier: data.nextTier ?? localProfile.nextTier,
          });
        } else {
          // Telegram: merge with Telegram data
          setUser({
            ...data,
            telegramId: telegramUser?.id,
            firstName: telegramUser?.firstName,
            lastName: telegramUser?.lastName,
            username: telegramUser?.username || data.name,
            photoUrl: telegramUser?.photoUrl,
          });
        }
      })
      .catch((err) => {
        console.error('Could not fetch user profile:', err);
        if (isLocalDev) {
          setUser(buildLocalProfile(userId));
        } else if (telegramUser) {
          // Telegram: create profile from Telegram data
          setUser({
            id: String(telegramUser.id),
            telegramId: telegramUser.id,
            name: `${telegramUser.firstName} ${telegramUser.lastName || ''}`.trim(),
            firstName: telegramUser.firstName,
            lastName: telegramUser.lastName,
            username: telegramUser.username,
            photoUrl: telegramUser.photoUrl,
            rep: 0,
            tier: 'Initiate',
            streak: 0,
            volume: 0,
            level: 1,
            nextTier: { name: 'Apprentice', threshold: 100 },
          });
        }
      })
      .finally(() => setLoading(false));
  }, [isReady, selectedPlayer, isLocalDev, telegramUser]);

  const initializeSoloMode = () => {
    if (!socket || !user) return;
    haptic('light');
    socket.emit('start_solo', { userId: user.id });
    setCurrentView('SOLO');
  };

  const handleMatchFound = (payload) => {
    haptic('medium');
    setActiveMatchPayload(payload);
    setCurrentView('MATCH');
  };

  const terminateActiveMatchContext = () => {
    haptic('heavy');
    setActiveMatchPayload(null);
    setCurrentView('DASHBOARD');
    // Refresh user data after match
    if (user && isReady) {
      apiUser
        .getProfile(user.id)
        .then((data) => setUser({ ...user, ...data }))
        .catch((err) => console.error('Could not refresh user:', err));
    }
  };

  if (!isReady || loading) {
    return (
      <div className="min-h-screen bg-cyber-bg flex flex-col items-center justify-center gap-6">
        <div className="text-cyber-primary animate-pulse text-sm font-mono tracking-widest uppercase">
          {isLocalDev ? 'Loading...' : 'INITIALIZING TELEGRAM...'}
        </div>

        {/* Local Dev: Show user selector */}
        {/* {isLocalDev && (
          <div className="flex gap-4">
            {['1', '2'].map((id) => (
              <button
                key={id}
                onClick={() => setSelectedPlayer(id)}
                className={`px-6 py-3 border rounded font-bold text-sm tracking-wider uppercase transition-all ${
                  selectedPlayer === id
                    ? 'bg-cyber-primary border-cyber-primary text-cyber-bg shadow-[0_0_10px_#00ff66]'
                    : 'border-cyber-border text-cyber-primary hover:border-cyber-primary'
                }`}
              >
                {id === '1' ? 'Ada Lovelace' : 'Satoshi Osun'}
              </button>
            ))}
          </div>
        )} */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-bg flex flex-col relative cyber-scanline selection:bg-cyber-primary selection:text-black">
      {/* Platform Header */}
      <header className="border-b border-cyber-border bg-cyber-card/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentView('DASHBOARD')}>
            <Cpu className="w-5 h-5 text-cyber-primary drop-shadow-[0_0_5px_#00ff66]" />
            <h1 className="text-sm font-extrabold tracking-widest text-white uppercase flex items-center gap-2">
              CYBER BUREAU <span className="text-[10px] text-cyber-muted font-normal lowercase tracking-normal">v1.2.0-alpha</span>
            </h1>
            {isLocalDev && (
              <span className="ml-3 text-[10px] bg-cyber-secondary/20 text-cyber-secondary border border-cyber-secondary/40 px-2 py-1 rounded font-bold">
                DEV MODE • {selectedPlayer === '1' ? 'Ada' : 'Satoshi'}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {(error || !connected) && (
              <span className="text-[10px] text-cyber-alert lowercase bg-cyber-alert/5 border border-cyber-alert/20 px-2 py-0.5 rounded animate-pulse font-bold">
                Connection Loss: {error || 'websocket error'}
              </span>
            )}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${
              connected ? 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20' : 'bg-cyber-alert/10 text-cyber-alert border border-cyber-alert/20'
            }`}>
              {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {connected ? 'LINK ONLINE' : 'LINK OFFLINE'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Mainframe Stage */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center">
        <div className="w-full">
          {currentView === 'DASHBOARD' && (
            <>
              <DashBoard 
                user={user} 
                selectedPlayer={selectedPlayer}
                onPlayerSelect={(id) => setSelectedPlayer(id)}
                onSelectSolo={initializeSoloMode} 
                onSelectPvP={() => setCurrentView('QUEUE')} 
              />
            </>
          )}

          {currentView === 'SOLO' && (
            <ActiveSolo onQuit={() => setCurrentView('DASHBOARD')} />
          )}

          {currentView === 'QUEUE' && (
            <MatchmakingQueue 
              user={user} 
              onMatchFound={handleMatchFound} 
              onCancel={() => setCurrentView('DASHBOARD')} 
            />
          )}

          {currentView === 'MATCH' && activeMatchPayload && (
            <ActiveMatch 
              matchPayload={activeMatchPayload} 
              onMatchEnd={terminateActiveMatchContext} 
            />
          )}
        </div>
      </main>

<footer className="border-t border-cyber-border bg-cyber-card/40 py-2.5 px-4 text-center font-mono text-[10px] tracking-widest uppercase flex flex-wrap justify-center items-center gap-x-6 gap-y-1">
  <span className="text-cyber-muted">
    SYS // STATUS: <span className={connected ? "text-cyber-primary font-bold" : "text-cyber-alert font-bold"}>{connected ? "ONLINE" : "DISCONNECTED"}</span>
  </span>
  
  <span className="text-cyber-muted hidden sm:inline">|</span>
  
  <span className="text-cyber-muted">
    STAGE: <span className="text-white font-bold">{currentView}</span>
  </span>

  {user && (
    <>
      {/* <span className="text-cyber-muted hidden sm:inline">|</span>
      <span className="text-cyber-muted">
        OPERATOR: <span className="text-cyber-secondary font-bold">@{user.username || 'unknown'}</span>
      </span> */}
      <span className="text-cyber-muted hidden sm:inline">|</span>
      <span className="text-cyber-muted">
        REP: <span className="text-yellow-400 font-bold">{user.rep}</span>
      </span>
    </>
  )}
</footer>      
    </div>
  );
}