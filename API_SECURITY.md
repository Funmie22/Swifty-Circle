# API Security Implementation - Telegram initData Validation

## Overview

SwiftyCircle now uses **server-side Telegram `initData` validation** for enhanced security. Every API request includes Telegram's authentication data, which the server verifies before processing requests.

## How It Works

### 1. Frontend: Automatic initData Inclusion

The `api.js` service automatically includes Telegram's `initData` with every request:

```javascript
// Every API request includes initData
api('/api/user/profile', {
  method: 'POST',
  body: { rep: 100 }
  // Automatically adds: initData: tg.initData
})
```

### 2. Backend: Signature Verification

The backend validates the `initData` signature to ensure it came from Telegram:

```javascript
// Middleware automatically extracts and validates user
app.use('/api/', verifyTelegramBasic);
// req.tgUser contains authenticated user data
```

## Security Layers

### Layer 1: Signature Validation (Optional - for production)
```javascript
// Verify HMAC-SHA256 signature
const secretKey = crypto.createHash('sha256').update(botToken).digest();
const calculatedHash = crypto.createHmac('sha256', secretKey)
  .update(dataCheckString).digest('hex');
```

**When to enable:**
- Production deployment
- Public-facing app
- Handling sensitive data/transactions

### Layer 2: User Extraction (Always enabled)
```javascript
// Extract authenticated user from initData
const user = extractUserFromInitData(initData);
req.tgUser = {
  id: user.id,
  firstName: user.first_name,
  username: user.username,
  // ... more fields
}
```

### Layer 3: Request/Response Validation (Application level)
- Check `req.tgUser.id` matches request parameters
- Only return user's own data
- Log suspicious requests

## Files

### Frontend
- `frontend/src/services/api.js` - API client with automatic initData
- `frontend/src/context/TelegramContext.jsx` - Initializes API on app load

### Backend
- `backend/middleware/telegramAuth.js` - Signature verification & user extraction
- `backend/server.js` - Middleware integration

## Usage

### Frontend - Making API Calls

```javascript
import { useApi } from '../services/api';

function MyComponent() {
  const { api, apiUser, apiGame, haptic } = useApi();

  const fetchProfile = async () => {
    try {
      // Automatically includes initData
      const user = await apiUser.getProfile(userId);
      haptic('light');
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  return <button onClick={fetchProfile}>Load Profile</button>;
}
```

### Direct API Calls

```javascript
import { api, haptic } from '../services/api';

// POST request (includes initData)
const result = await api('/api/game/solo/start', {
  method: 'POST',
  body: { userId: '123' }
});

// GET request (includes initData as query param)
const cases = await api('/api/cases', { method: 'GET' });
```

### Backend - Using Authenticated User

```javascript
app.get('/api/user/:id', verifyTelegramBasic, (req, res) => {
  // req.tgUser contains the authenticated user
  const { id } = req.tgUser;

  // Only return data for authenticated user
  if (req.params.id !== String(id)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.json(users[req.params.id]);
});
```

## Enable Strict Validation

To enable full signature validation in production:

```javascript
// backend/server.js
const botToken = process.env.BOT_TOKEN; // From @BotFather
const verifyTelegram = createVerifyTelegramMiddleware(botToken);

app.use('/api/', verifyTelegram);
```

Requires:
```bash
# .env
BOT_TOKEN=your_bot_token_here
```

## Development vs Production

### Development (Current)
```javascript
// Uses basic verification (no signature check)
app.use('/api/', verifyTelegramBasic);
```
✅ Works without bot token  
⚠️ Less secure - doesn't verify Telegram signature  

### Production
```javascript
// Uses strict signature verification
const botToken = process.env.BOT_TOKEN;
app.use('/api/', createVerifyTelegramMiddleware(botToken));
```
✅ Cryptographically secure  
✅ Prevents request forgery  
⚠️ Requires bot token in environment  

## Disabling Verification (For Testing)

To temporarily disable verification:

```javascript
// backend/server.js
// Comment out the middleware line:
// app.use('/api/', verifyTelegramBasic);

// API will work without initData
```

## Error Responses

If verification fails:

```json
{
  "error": "Missing initData",
  "message": "Telegram authentication required"
}
```

```json
{
  "error": "Invalid initData",
  "message": "Telegram signature verification failed"
}
```

## Socket.IO Events

For WebSocket events, verification must be handled separately:

```javascript
io.on('connection', (socket) => {
  socket.on('join_queue', ({ userId, initData }) => {
    // Manually verify initData for socket events
    const user = extractUserFromInitData(initData);
    if (!user || user.id !== userId) {
      socket.emit('error', 'Authentication failed');
      return;
    }
    
    // Process request
  });
});
```

## Best Practices

### ✅ DO

- Always include `initData` with requests
- Validate `initData` on backend before processing
- Check that `req.tgUser.id` matches request parameters
- Log failed authentication attempts
- Use HTTPS for all communication

### ❌ DON'T

- Trust client-side user ID alone
- Skip verification in production
- Expose bot token in frontend
- Log sensitive user data
- Accept requests without `initData`

## Migration Checklist

When switching from old API to new:

- [ ] Import `useApi` in components using data
- [ ] Replace `fetch()` with `api()` or `apiUser.*` / `apiGame.*`
- [ ] Update backend routes to use `req.tgUser` for user data
- [ ] Test with Telegram Web App
- [ ] Enable strict verification before production
- [ ] Store bot token in environment variables
- [ ] Test error cases (missing/invalid initData)

## Testing

### Frontend
```bash
# Dev server automatically includes mock initData
npm run dev

# Check browser Network tab for initData in requests
```

### Backend
```bash
# Curl with initData
curl -X GET http://localhost:5000/api/user/123 \
  -H "Content-Type: application/json" \
  -d '{"initData":"user_id=123&..."}'
```

## Troubleshooting

**"Missing initData"**
- Check that `TelegramContext` is initialized
- Verify `initializeApi()` was called
- Check browser console for errors

**"Invalid initData" (Production)**
- Verify `BOT_TOKEN` in `.env` is correct
- Check that request includes valid initData
- Ensure initData hasn't expired

**"Forbidden" (403)**
- User trying to access another user's data
- Backend correctly rejecting unauthorized access
- ✅ This is expected behavior

## References

- [Telegram Web Apps Documentation](https://core.telegram.org/bots/webapps)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [HMAC-SHA256 Verification](https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app)
