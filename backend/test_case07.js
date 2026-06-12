import { io } from 'socket.io-client';

const URL = 'http://localhost:5000';

const clientA = io(URL);
const clientB = io(URL);

function log(prefix, ...args) {
  console.log(`[${prefix}]`, ...args);
}

let matchId = null;

clientA.on('connect', () => {
  log('A', 'connected', clientA.id);
  clientA.emit('join_queue', { userId: '1', detectiveName: 'Ada', stake: 10, preferredCaseId: 'case_07' });
});

clientB.on('connect', () => {
  log('B', 'connected', clientB.id);
  clientB.emit('join_queue', { userId: '2', detectiveName: 'Satoshi', stake: 15, preferredCaseId: 'case_07' });
});

clientA.on('match_found', (data) => {
  log('A', 'match_found', data.caseData?.id || data.caseData);
  matchId = data.matchId;
  // wait briefly then submit the expected answer 'S' for case_07
  setTimeout(() => {
    log('A', 'submitting solution S');
    clientA.emit('submit_solution', { matchId, solution: 'S' });
  }, 500);
});

clientA.on('match_invite', (data) => {
  log('A', 'match_invite', data.matchId || data);
  clientA.emit('player_ready', { matchId: data.matchId });
});

clientB.on('match_invite', (data) => {
  log('B', 'match_invite', data.matchId || data);
  clientB.emit('player_ready', { matchId: data.matchId });
});

clientA.on('match_start', (data) => log('A', 'match_start', data.caseData?.id || data.caseData));
clientB.on('match_start', (data) => log('B', 'match_start', data.caseData?.id || data.caseData));
clientB.on('game_over', (p) => log('B', 'game_over', p));

setTimeout(() => {
  log('TEST', 'timed out');
  clientA.disconnect();
  clientB.disconnect();
  process.exit(0);
}, 8000);
