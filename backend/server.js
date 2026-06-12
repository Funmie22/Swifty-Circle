import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { localCases as soloCases } from './data/solocases.js';
import cyberCases from './data/cases.js';
import { createVerifyTelegramMiddleware, verifyTelegramBasic, extractUserFromInitData } from './middleware/telegramAuth.js';

const pvpCases = cyberCases;

const app = express();
app.use(cors());
app.use(express.json());

// Telegram authentication middleware for API routes
// Comment out for development without strict signature validation
app.use('/api/', verifyTelegramBasic);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const users = {
  '1': {
    id: '1',
    name: 'Ada Lovelace',
    rep: 1250,
    tier: 'Apex Trader',
    streak: 5,
    volume: 15400,
    level: 18,
    nextTier: { name: 'The Oracle', threshold: 2500 }
  },
  '2': {
    id: '2',
    name: 'Satoshi Osun',
    rep: 320,
    tier: 'Apprentice',
    streak: 2,
    volume: 450,
    level: 14,
    nextTier: { name: 'Strategist', threshold: 500 }
  }
};

// Function to create a default user profile from Telegram ID
function createDefaultUserProfile(telegramId) {
  return {
    id: String(telegramId),
    telegramId: telegramId,
    name: `User ${telegramId}`,
    rep: 0,
    tier: 'Initiate',
    streak: 0,
    volume: 0,
    level: 1,
    casesSolved: 0,
    nextTier: { name: 'Apprentice', threshold: 100 },
    joinedAt: new Date().toISOString(),
  };
}

const queue = [];
const matches = new Map();
const soloSessions = new Map();

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function answerMatches(expected, received) {
  if (!received || !expected) return false;
  const normalizedAnswer = normalizeText(received);
  const normalizedExpected = normalizeText(expected);
  return normalizedAnswer.includes(normalizedExpected) || normalizedExpected.includes(normalizedAnswer);
}

function answerMatchesKeywords(keywords, received) {
  if (!Array.isArray(keywords) || !received) return false;
  const normalizedAnswer = normalizeText(received);
  return keywords.some((keyword) =>
    normalizedAnswer.includes(normalizeText(keyword))
  );
}

function createSoloPayload(session) {
  const base = session.case;
  const stage = base.stages[session.stageIndex];

  return {
    id: base.id,
    caseNumber: `SOLO-${base.id}`,
    title: base.title,
    briefing: base.briefing,
    report: `Stage ${session.stageIndex + 1} of ${base.stages.length}`,
    question: stage.prompt,
    clues: [stage.type],
    theories: [],
    stageType: stage.type,
    expectedAnswer: stage.expected
  };
}

function getRandomCase(array, excludeId) {
  const candidates = excludeId ? array.filter((item) => item.id !== excludeId) : array;
  if (!candidates.length) {
    return array[Math.floor(Math.random() * array.length)];
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

app.get('/api/user/:id', (req, res) => {
  const id = req.params.id;
  
  // Check if user exists
  if (users[id]) {
    return res.json(users[id]);
  }
  
  // Create new user profile from Telegram ID
  const newUser = createDefaultUserProfile(id);
  users[id] = newUser;
  
  res.json(newUser);
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/user/:id/profile', (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, username, photoUrl } = req.body;
  
  if (!users[id]) {
    users[id] = createDefaultUserProfile(id);
  }
  
  // Update profile with Telegram metadata
  if (firstName) users[id].firstName = firstName;
  if (lastName) users[id].lastName = lastName;
  if (username) users[id].username = username;
  if (photoUrl) users[id].photoUrl = photoUrl;
  
  res.json(users[id]);
});

app.get('/api/leaderboard', (req, res) => {
  const sorted = Object.values(users)
    .sort((a, b) => (b.rep || 0) - (a.rep || 0))
    .slice(0, 100)
    .map((user, index) => ({
      ...user,
      rank: index + 1
    }));
  
  res.json(sorted);
});

app.get('/api/cases', (req, res) => {
  res.json(
    pvpCases.map((c) => ({
      id: c.id,
      title: c.title,
      difficulty: c.difficulty,
      briefing: c.briefing
    }))
  );
});

io.on('connection', (socket) => {
  console.log('[socket] client connected', socket.id, 'remoteAddress=', socket.handshake.address);

  // ---------------- SOLO MODE ----------------
  socket.on('start_solo', ({ userId }) => {
    const selectedCase = getRandomCase(soloCases);

    const session = {
      userId,
      case: selectedCase,
      stageIndex: 0,
      progress: 1
    };

    soloSessions.set(socket.id, session);

    socket.emit('solo_started', {
      caseData: createSoloPayload(session),
      caseProgress: 1
    });
  });

  socket.on('request_solo_hint', () => {
    const session = soloSessions.get(socket.id);

    if (!session) {
      socket.emit('solo_hint_result', {
        success: false,
        message: 'No active solo session found.'
      });
      return;
    }

    const hint = session.case.stages[session.stageIndex].expected;

    socket.emit('solo_hint_result', {
      success: true,
      hint: `Focus on this key answer phrase: ${hint}`
    });
  });

  socket.on('submit_solo_answer', ({ solution }) => {
    const session = soloSessions.get(socket.id);

    if (!session) {
      socket.emit('solo_answer_result', {
        correct: false,
        message: 'No active solo session found.'
      });
      return;
    }

    const expected = session.case.stages[session.stageIndex].expected;

    const correct =
      answerMatches(expected, solution) ||
      answerMatchesKeywords([expected], solution);

    if (!correct) {
      socket.emit('solo_answer_result', {
        correct: false,
        message: 'That answer does not match the current stage. Re-examine the prompt.'
      });
      return;
    }

    session.stageIndex += 1;
    session.progress += 1;

    if (session.stageIndex < session.case.stages.length) {
      socket.emit('solo_answer_result', {
        correct: true,
        message: 'Correct. Advancing to the next stage.',
        nextCase: createSoloPayload(session),
        caseProgress: session.progress,
        repGain: 30
      });
      return;
    }

    socket.emit('solo_answer_result', {
      correct: true,
      message: 'Solo investigation complete. Case solved.',
      caseProgress: session.progress,
      repGain: 75,
      caseComplete: true
    });
  });

  socket.on('request_next_solo_case', () => {
    const session = soloSessions.get(socket.id);

    if (!session) {
      socket.emit('solo_next_case', {
        error: 'No active solo session found.'
      });
      return;
    }

    const nextCase = getRandomCase(soloCases, session.case.id);
    session.case = nextCase;
    session.stageIndex = 0;
    session.progress += 1;

    socket.emit('solo_next_case', {
      caseData: createSoloPayload(session),
      caseProgress: session.progress
    });
  });

  socket.on('abandon_solo', () => {
    soloSessions.delete(socket.id);
  });

  // ---------------- MATCHMAKING ----------------
  socket.on('join_queue', ({ userId, detectiveName, stake, preferredCaseId }) => {
    console.log('[socket] join_queue received from socket', socket.id, { userId, detectiveName, stake, preferredCaseId });
    const existing = queue.find((entry) => entry.userId === userId);

    if (existing) {
      socket.emit('match_rejected', { reason: 'Already in queue.' });
      return;
    }

    queue.push({ socket, userId, detectiveName, stake, preferredCaseId });

    // Wait for at least 2 players to match (no CPU fallback - require real PvP)
    if (queue.length >= 2) {
      const playerOne = queue.shift();
      const playerTwo = queue.shift();

      const preferred = playerOne.preferredCaseId || playerTwo.preferredCaseId;

      let selectedCase = null;

      if (preferred) {
        selectedCase = pvpCases.find((c) => c.id === preferred) || null;
      }

      if (!selectedCase) {
        selectedCase = getRandomCase(pvpCases);
      }

      const matchId = `match-${Date.now()}-${Math.random().toString(16).slice(2)}`;

      console.log('Selected PvP case for match', matchId);

      const matchData = {
        id: matchId,
        case: selectedCase,
        pot: (playerOne.stake || 0) + (playerTwo.stake || 0),
        players: [playerOne.userId, playerTwo.userId],
        sockets: [playerOne.socket.id, playerTwo.socket.id],
        ready: {}, // socketId -> boolean
      };

      matches.set(matchId, matchData);

      // Send an invitation to each player to confirm readiness before starting
      const inviteOne = {
        matchId,
        opponent: playerTwo.detectiveName,
        pot: matchData.pot,
      };

      const inviteTwo = {
        matchId,
        opponent: playerOne.detectiveName,
        pot: matchData.pot,
      };

      // initialize readiness map
      matchData.ready[playerOne.socket.id] = false;
      matchData.ready[playerTwo.socket.id] = false;

      matches.set(matchId, matchData);

      console.log('[socket] emitting match_invite to', playerOne.socket.id, playerTwo.socket.id, { matchId, caseId: selectedCase.id });
      playerOne.socket.emit('match_invite', inviteOne);
      playerTwo.socket.emit('match_invite', inviteTwo);
    }
  });

  socket.on('leave_queue', ({ userId }) => {
    const queueIndex = queue.findIndex(
      (entry) => entry.socket.id === socket.id || entry.userId === userId
    );

    if (queueIndex !== -1) {
      queue.splice(queueIndex, 1);
    }

    socket.emit('left_queue');
  });

  // Player signals they are ready to start the match
  socket.on('player_ready', ({ matchId }) => {
    const match = matches.get(matchId);
    if (!match) {
      socket.emit('match_error', { message: 'Match not found.' });
      return;
    }

    // mark this socket as ready
    match.ready = match.ready || {};
    match.ready[socket.id] = true;

    console.log('[socket] player_ready from', socket.id, 'for match', matchId);

    // notify the other party that this player is ready
    match.sockets.forEach((sockId) => {
      const target = io.sockets.sockets.get(sockId);
      if (!target) return;
      target.emit('player_ready_update', { matchId, socketId: socket.id });
    });

    // Check if all participants are ready (for PvP both sockets must be true)
    const allReady = match.sockets.every((sockId) => match.ready[sockId]);

    if (allReady) {
      // Start the match by emitting caseData to all sockets
      const payload = {
        matchId: match.id,
        caseData: match.case,
        pot: match.pot,
        currentStage: 1,
        totalStages: 1
      };

      console.log('[socket] all players ready, emitting match_start for', matchId);
      match.sockets.forEach((sockId) => {
        const target = io.sockets.sockets.get(sockId);
        if (!target) return;
        target.emit('match_start', payload);
      });
    }
  });

  socket.on('request_hint', ({ matchId }) => {
    const match = matches.get(matchId);

    if (!match) {
      socket.emit('hint_result', {
        success: false,
        message: 'Match not found.'
      });
      return;
    }

    socket.emit('hint_result', {
      success: true,
      hint: match.case.hint || 'Review the case details and focus on the answer keywords.'
    });
  });

  socket.on('submit_solution', ({ matchId, solution }) => {
    const match = matches.get(matchId);

    if (!match) {
      socket.emit('solution_result', {
        correct: false,
        message: 'No active match found.'
      });
      return;
    }

    const pvpCase = match.case || {};
    const stageExpected =
      (pvpCase.stages && pvpCase.stages[0] && pvpCase.stages[0].expected) || null;

    const expectedAnswer = pvpCase.correctAnswer || stageExpected;

    const keywords =
      pvpCase.answerKeywords ||
      (pvpCase.stages && pvpCase.stages[0] && pvpCase.stages[0].answerKeywords) ||
      [];

    const correct =
      answerMatches(expectedAnswer, solution) ||
      answerMatchesKeywords(keywords, solution);

    if (correct) {
      match.sockets.forEach((socketId) => {
        const target = io.sockets.sockets.get(socketId);
        if (!target) return;

        target.emit('solution_result', {
          correct: true,
          message:
            target.id === socket.id
              ? 'Correct. Case cracked.'
              : 'Opponent solved the case.'
        });

        target.emit('game_over', {
          result: target.id === socket.id ? 'WON' : 'LOST',
          looted: match.pot,
          behaviorMessage:
            target.id === socket.id
              ? 'You dominated the raid.'
              : 'Your rival cracked the case first.'
        });
      });

      matches.delete(matchId);
      return;
    }

    socket.emit('solution_result', {
      correct: false,
      message: 'Wrong theory. Re-examine the evidence.'
    });
  });

  // ---------------- DISCONNECT ----------------
  socket.on('disconnect', () => {
    const queueIndex = queue.findIndex((entry) => entry.socket.id === socket.id);

    if (queueIndex !== -1) queue.splice(queueIndex, 1);

    soloSessions.delete(socket.id);

    for (const [matchId, match] of matches.entries()) {
      if (match.sockets.includes(socket.id)) {
        matches.delete(matchId);

        match.sockets.forEach((socketId) => {
          if (socketId === socket.id) return;

          const otherSocket = io.sockets.sockets.get(socketId);

          if (otherSocket) {
            otherSocket.emit('game_over', {
              result: 'WON',
              looted: match.pot,
              behaviorMessage: 'Your opponent left the raid early. You win by default.'
            });
          }
        });
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});