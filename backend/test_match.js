import { io } from 'socket.io-client';

const URL = 'http://localhost:5000';

const clientA = io(URL);
const clientB = io(URL);

function log(prefix, ...args) {
  console.log(`[${prefix}]`, ...args);
}

clientA.on('connect', () => {
  log('A', 'connected', clientA.id);
  clientA.emit('join_queue', { userId: '1', detectiveName: 'Ada', stake: 10 });
});

clientB.on('connect', () => {
  log('B', 'connected', clientB.id);
  clientB.emit('join_queue', { userId: '2', detectiveName: 'Satoshi', stake: 15 });
});

// Auto-ready when invited (simulate pressing Ready)
clientA.on('match_invite', (p) => {
  log('A', 'auto-ready for', p.matchId);
  clientA.emit('player_ready', { matchId: p.matchId });
});

clientB.on('match_invite', (p) => {
  log('B', 'auto-ready for', p.matchId);
  clientB.emit('player_ready', { matchId: p.matchId });
});

['match_invite','match_start','solution_result','game_over','hint_result','match_rejected','player_ready_update'].forEach((ev) => {
  clientA.on(ev, (p) => log('A', ev, p));
  clientB.on(ev, (p) => log('B', ev, p));
});

// safety timeout
setTimeout(() => {
  log('TEST', 'timed out');
  clientA.disconnect();
  clientB.disconnect();
  process.exit(0);
}, 10000);
