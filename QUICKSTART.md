# SwiftyCircle - Quick Start Guide

## What's New

SwiftyCircle is now **fully integrated with Telegram Mini Apps**! 🚀

### Key Features

- ✅ Telegram authentication (uses your Telegram ID)
- ✅ Haptic feedback (phone vibrations)
- ✅ Share to Telegram functionality
- ✅ Theme awareness (dark/light mode)
- ✅ Bottom button integration
- ✅ Dynamic user profiles from Telegram data

## Quick Setup (5 minutes)

### 1. Create Telegram Bot

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Type `/newbot`
3. Follow prompts to create bot
4. **Save the Bot Token** you receive

Full guide: [BOT_SETUP.md](./BOT_SETUP.md)

### 2. Deploy Frontend

Choose one:

**Option A: Vercel (Easiest)**

```bash
npm install -g vercel
cd frontend
vercel
```

**Option B: Your Own Server**

- Build: `npm run build`
- Serve `dist/` folder with HTTPS

### 3. Deploy Backend

**Option A: Vercel**

```bash
cd backend
vercel
```

**Option B: Your Own Server**

```bash
npm install
npm start  # or: node server.js
```

### 4. Configure Bot

1. Go to @BotFather
2. Select `/mybots` → Your Bot
3. **Menu Button** → **Web App**
4. Set URL to your frontend domain (must be HTTPS!)

### 5. Test

1. Open your Telegram bot
2. Click the Menu Button or Web App button
3. App should load and authenticate via Telegram!

## File Structure

```text
SwiftyCircle/
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   ├── SocketContext.jsx      # WebSocket connection
│   │   │   └── TelegramContext.jsx    # NEW: Telegram integration
│   │   ├── services/
│   │   │   └── TelegramService.js     # NEW: Telegram utilities
│   │   ├── App.jsx                    # Updated for Telegram auth
│   │   └── main.jsx
│   ├── package.json
│   └── .env                           # Add VITE_API_URL
│
├── backend/
│   ├── server.js                      # Updated for Telegram user IDs
│   ├── data/                          # Game cases
│   ├── package.json
│   └── .env
│
├── TELEGRAM_SETUP.md                  # Full Telegram integration guide
├── BOT_SETUP.md                       # Telegram bot creation
└── DEPLOYMENT_CHECKLIST.md            # Deploy checklist
```

## Key Changes Made

### Frontend

- Added TelegramContext provider for authentication
- Modified App.jsx to use Telegram user ID instead of mock profiles
- Added TelegramService utility class
- Updated index.html with Telegram Web App script
- User profiles created dynamically from Telegram data

### Backend

- Updated `/api/user/:id` to create profiles for new users
- Added `/api/user/:id/profile` for updating Telegram metadata
- Added `/api/leaderboard` endpoint
- Users stored by Telegram ID
- Backward compatible with test users (IDs 1, 2)

## Development Mode

Without Telegram:

```bash
cd frontend
npm run dev
# Open http://localhost:5173
# App creates mock user automatically
```

With Telegram (local testing):

- Telegram requires HTTPS, so local dev won't work via Telegram
- Test via browser, Telegram functions fallback gracefully

## Important: Environment Variables

### Frontend (.env)

```bash
VITE_API_URL=http://localhost:5000  # Local dev
# or
VITE_API_URL=https://your-backend.example.com  # Production
```

### Backend (.env)

```bash
PORT=5000
NODE_ENV=development  # or production
```

## Testing Checklist

- [ ] Bot created and token saved
- [ ] Frontend deployed with HTTPS
- [ ] Backend deployed with HTTPS
- [ ] Bot Menu Button configured
- [ ] Open bot in Telegram → Web App loads
- [ ] Telegram user ID displays in game
- [ ] Can start solo game
- [ ] Can join matchmaking
- [ ] WebSocket connects (check console)
- [ ] User rep/tier display correctly

## Common Issues

**"Telegram Web App not found"**

- Make sure accessing from Telegram (not browser)
- Check index.html has Telegram script

**"API not reachable"**

- Check VITE_API_URL is correct
- Verify backend is running and accessible
- Check CORS (already enabled)

**"User profile empty"**

- Frontend needs to be in Telegram
- Check browser console for fetch errors
- Verify /api/user/:id returns data

## Next Steps

1. Read [BOT_SETUP.md](./BOT_SETUP.md) for detailed bot setup
2. Read [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md) for full integration guide
3. Follow [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) before going live
4. Test thoroughly in Telegram

## API Endpoints

All endpoints accept Telegram user ID as the user identifier:

- `GET /api/user/:telegramId` - Get/create user profile
- `POST /api/user/:telegramId/profile` - Update profile
- `GET /api/leaderboard` - Top 100 players
- `GET /api/cases` - Available cases
- `GET /api/health` - Server status

## Socket.IO Events

Same as before, but now uses Telegram ID:

**Solo Mode**

- `start_solo` - Begin solo investigation
- `submit_solo_answer` - Submit answer
- `request_solo_hint` - Get hint

**PvP Mode**

- `join_queue` - Queue for PvP match
- `submit_solution` - Submit solution
- `request_hint` - Get hint

## Telegram Features Used

- 🔐 User authentication via Telegram ID
- 📱 Haptic feedback (vibrations)
- 🔄 Share functionality
- 🎨 Theme awareness
- 🔘 Bottom button integration
- 📤 Data submission to bot

## What's Next?

Consider adding:

- Real database (MongoDB/PostgreSQL)
- User authentication validation
- Referral system with deep linking
- Bot notifications
- Admin dashboard
- Wallet integration for SwiftyEx

## Support

Issues? Check:

1. Browser console for errors
2. Backend logs for API errors
3. @BotFather for bot issues
4. Network tab for request failures

---

**Ready to deploy?** Follow the [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

**Questions?** Check [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md) for details
