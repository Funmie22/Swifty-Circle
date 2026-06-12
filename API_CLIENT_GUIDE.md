# Using the Secure API Client

This guide explains how to use the new API client with automatic Telegram `initData` validation.

## Quick Start

### Import and Use

```javascript
import { useApi } from '../services/api';

function MyComponent() {
  const { api, apiUser, apiGame, haptic } = useApi();

  // All API calls automatically include initData
  const fetchProfile = async () => {
    const user = await apiUser.getProfile('123');
    haptic('light');
  };

  return <button onClick={fetchProfile}>Load</button>;
}
```

## API Methods

### User Methods

```javascript
// Get user profile (auto-includes initData)
const user = await apiUser.getProfile(userId);

// Update user profile
const updated = await apiUser.updateProfile(userId, {
  username: 'newname'
});
```

### Game Methods

```javascript
// Get available cases
const cases = await apiGame.getCases();

// Get global leaderboard
const leaderboard = await apiGame.getLeaderboard();

// Solo mode
const session = await apiGame.startSolo(userId);
const result = await apiGame.submitSoloAnswer(sessionId, 'answer');
const hint = await apiGame.getSoloHint(sessionId);

// PvP mode
await apiGame.joinQueue(userId, 10); // stake = 10
await apiGame.leaveQueue(userId);
const result = await apiGame.submitPvPSolution(matchId, 'solution');
const hint = await apiGame.getPvPHint(matchId);
```

### Direct API Calls

```javascript
// POST request (includes initData in body)
const result = await api('/api/custom/endpoint', {
  method: 'POST',
  body: { myData: 'value' }
});

// GET request (includes initData in query params)
const data = await api('/api/endpoint', { method: 'GET' });
```

### Haptic Feedback

```javascript
import { haptic } from '../services/api';

haptic('light');   // Light vibration
haptic('medium');  // Medium vibration
haptic('heavy');   // Heavy vibration
```

## How It Works

### Frontend

1. **Initialization**: When app loads, `TelegramContext` calls `initializeApi(tg, apiUrl)`
2. **Auto-include**: Every API call includes `initData` automatically
3. **Validation**: Server validates `initData` before processing

### Backend

1. **Middleware**: `verifyTelegramBasic` or `createVerifyTelegramMiddleware` validates
2. **Extract User**: User data extracted from `initData`
3. **Attach to Request**: `req.tgUser` contains authenticated user
4. **Use in Routes**: Routes can trust `req.tgUser` is legitimate

## Examples

### Example 1: Get User Profile

```javascript
// Frontend
import { useApi } from '../services/api';

function ProfilePage() {
  const { apiUser } = useApi();
  const [profile, setProfile] = useState(null);

  useEffect(async () => {
    const user = await apiUser.getProfile('12345');
    setProfile(user);
  }, []);

  return <div>{profile?.name}</div>;
}

// Backend
app.get('/api/user/:id', verifyTelegramBasic, (req, res) => {
  // req.tgUser contains authenticated user
  const userId = req.params.id;
  
  // Only return data for the authenticated user
  if (req.tgUser.id !== parseInt(userId)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.json(users[userId]);
});
```

### Example 2: Submit Game Answer

```javascript
// Frontend
const { apiGame, haptic } = useApi();

const handleSubmit = async (answer) => {
  try {
    const result = await apiGame.submitSoloAnswer(sessionId, answer);
    if (result.correct) {
      haptic('heavy');
      console.log('Correct!');
    }
  } catch (err) {
    console.error('Error:', err);
  }
};

// Backend
app.post('/api/game/solo/submit', verifyTelegramBasic, (req, res) => {
  const { sessionId, answer } = req.body;
  const userId = req.tgUser.id; // Authenticated user
  
  // Verify user owns this session
  const session = soloSessions.get(sessionId);
  if (session.userId !== userId) {
    return res.status(403).json({ error: 'Not your session' });
  }

  // Process answer
  const correct = checkAnswer(session, answer);
  res.json({ correct });
});
```

### Example 3: Join PvP Queue

```javascript
// Frontend
const { apiGame, haptic } = useApi();

const handleJoinQueue = async (stake) => {
  try {
    await apiGame.joinQueue(userId, stake);
    haptic('light');
    // Show waiting UI
  } catch (err) {
    console.error('Failed to join:', err);
  }
};

// Backend
app.post('/api/game/pvp/queue/join', verifyTelegramBasic, (req, res) => {
  const { userId, stake } = req.body;
  const authenticatedId = req.tgUser.id;
  
  // Verify user is joining their own queue
  if (userId !== authenticatedId) {
    return res.status(403).json({ error: 'Cannot join for another user' });
  }

  // Add to queue
  queue.push({ userId, stake });
  res.json({ queued: true });
});
```

## Error Handling

```javascript
const { apiUser } = useApi();

try {
  const user = await apiUser.getProfile(userId);
} catch (err) {
  console.error(err.message);
  // Output: "401: Missing initData"
  // Output: "401: Invalid initData"
  // Output: "403: Forbidden"
}
```

## Development Without Telegram

In local development, the API still works but `initData` will be empty:

```javascript
// Frontend (in dev mode without Telegram)
const { apiUser, isReady } = useApi();

// isReady = false until API is initialized
// But you can still make calls
const user = await apiUser.getProfile('1');
```

Backend handles it gracefully:

```javascript
// backend/server.js
// Comment out the middleware to allow requests without initData:
// app.use('/api/', verifyTelegramBasic);
```

## Migrating from Fetch

### Before
```javascript
fetch(`${apiUrl}/api/user/${userId}`)
  .then(r => r.json())
  .then(data => setUser(data))
  .catch(err => console.error(err));
```

### After
```javascript
const { apiUser } = useApi();

apiUser.getProfile(userId)
  .then(data => setUser(data))
  .catch(err => console.error(err));
```

## Security Features

✅ **Automatic initData** - Every request includes Telegram's authentication  
✅ **Server Validation** - Backend verifies `initData` signature  
✅ **User Isolation** - Each user can only access their own data  
✅ **Error Handling** - Clear error messages for failed authentication  
✅ **Type Safety** - Consistent request/response structure  

## Checklist for Implementation

- [ ] All HTTP requests use `api()`, `apiUser.*`, or `apiGame.*`
- [ ] Backend routes use `req.tgUser` for authenticated user
- [ ] All routes validate user owns the data they're accessing
- [ ] Error responses include proper status codes (401, 403)
- [ ] Haptic feedback integrated where appropriate
- [ ] Middleware enabled: `app.use('/api/', verifyTelegramBasic);`
- [ ] Production: Enable strict validation with bot token

## References

- [API_SECURITY.md](./API_SECURITY.md) - Full security documentation
- [api.js](./frontend/src/services/api.js) - API client implementation
- [telegramAuth.js](./backend/middleware/telegramAuth.js) - Verification middleware
