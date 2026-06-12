# SwiftyCircle - Telegram Mini App 🎮

A real-time, multiplayer cybersecurity challenge platform built as a **Telegram Mini App**. Solve cryptographic cases, compete against other players, and climb the ranks!

## Features

### 🎮 Gameplay
- **Solo Mode**: Solve cybersecurity cases step-by-step, earn reputation
- **PvP Mode**: Real-time matchmaking with other players, race to solve the case first
- **Leaderboard**: Global rankings based on reputation points
- **Progression System**: Rank up through tiers as you gain reputation

### 🔐 Telegram Integration
- **Seamless Auth**: Login with Telegram ID automatically
- **Native Telegram UI**: Menu buttons, haptic feedback, share functionality
- **Theme Support**: Respects Telegram's dark/light theme
- **Zero Friction**: No usernames or passwords needed

### 🌐 Web3 Focused
- **Crypto Security Cases**: Learn about wallet exploits, NFT scams, bridge hacks, cryptographic signatures
- **Real-world Scenarios**: Based on actual blockchain security vulnerabilities
- **SwiftyEx Integration**: Complement to the SwiftyEx Telegram bot ecosystem

## Quick Start

1. **Create a Telegram Bot** (5 min)
   ```
   Message @BotFather → /newbot → Save token
   ```
   See [BOT_SETUP.md](./BOT_SETUP.md)

2. **Deploy Frontend** (5 min)
   ```bash
   cd frontend && npm run build
   Deploy to Vercel/Heroku/your server
   ```

3. **Deploy Backend** (5 min)
   ```bash
   cd backend && npm start
   Deploy to Vercel/Heroku/your server
   ```

4. **Configure Bot** (2 min)
   - @BotFather → Menu Button → Web App → your frontend URL

5. **Test**
   - Open bot in Telegram → Click Web App → Play! 🚀

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup.

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool (lightning fast)
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time communication
- **Telegram Web App SDK** - Telegram integration

### Backend
- **Node.js** - Runtime
- **Express** - Web server
- **Socket.IO** - WebSocket server for real-time gameplay
- **CORS** - Cross-origin requests

## Project Structure

```
SwiftyCircle/
│
├── frontend/                      # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ActiveSolo.jsx
│   │   │   ├── MatchmakingQueue.jsx
│   │   │   ├── ActiveMatch.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── context/
│   │   │   ├── SocketContext.jsx      # WebSocket management
│   │   │   └── TelegramContext.jsx    # Telegram auth & API
│   │   ├── services/
│   │   │   └── TelegramService.js     # Telegram utilities
│   │   ├── App.jsx                    # Main app component
│   │   └── index.css
│   └── vite.config.js
│
├── backend/                       # Express + Socket.IO backend
│   ├── server.js                  # Main server file
│   ├── data/
│   │   ├── cases.js               # PvP game cases
│   │   └── solocases.js           # Solo game cases
│   └── test_match.js              # Test matchmaking
│
├── QUICKSTART.md                  # 5-minute setup guide
├── TELEGRAM_SETUP.md              # Full integration guide
├── BOT_SETUP.md                   # Create Telegram bot
├── DEPLOYMENT_CHECKLIST.md        # Pre-launch checklist
└── README.md                      # This file
```

## Game Cases

Cases cover real web3 security scenarios:

### Solo Cases
- Drainer wallet analysis
- Phishing vault exploits
- Malicious smart contracts
- Hidden NFT approvals
- Bridge vulnerabilities
- Transaction signature spoofing

### PvP Cases
- Validator node drains
- Multi-sig bypasses
- Token bridge exploits
- Signature forgery
- Oracle manipulation

## API Reference

### User Management

```
GET  /api/user/:telegramId         # Get/create user profile
POST /api/user/:telegramId/profile # Update profile
GET  /api/leaderboard              # Top 100 players
GET  /api/health                   # Health check
```

### Game Data

```
GET  /api/cases                    # Available game cases
```

### WebSocket Events

**Solo Mode**

```
start_solo                 # Begin solo investigation
submit_solo_answer        # Submit answer for current stage
request_solo_hint         # Get hint for current puzzle
```

**PvP Mode**

```
join_queue                # Join matchmaking queue
match_invite              # Receive invite (both players must confirm)
player_ready              # Confirm readiness before match starts
match_start               # Match begins with case data
submit_solution           # Submit solution to case
request_hint              # Get hint for case
leave_queue               # Leave queue
```

**General**

```
disconnect                # Clean up on disconnect
```

## User Progression

```
Rep Points       Tier
0 - 100         Initiate (Level 1)
100 - 500       Apprentice (Level 2)
500 - 1,250     Strategist (Level 3)
1,250 - 2,500   Apex Trader (Level 4)
2,500+          The Oracle (Level 5)
```

## Telegram Features

### Implemented
✅ User authentication via Telegram ID  
✅ Haptic feedback (vibrations)  
✅ Share to Telegram  
✅ Theme awareness  
✅ Bottom button integration  
✅ Data submission to bot  

### Possible Future Features
📋 Notifications via bot  
📋 Deep linking with referrals  
📋 Tournament invites  
📋 Leaderboard sharing  
📋 Achievement badges  

## Local Development

```bash
# Frontend development server
cd frontend
npm install
npm run dev
# Open http://localhost:5173

# Backend development server
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

## Production Deployment

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for complete checklist.

Quick summary:
1. Build frontend: `npm run build`
2. Deploy both to HTTPS servers
3. Configure Telegram bot with frontend URL
4. Update backend API URL in frontend .env
5. Test in Telegram thoroughly

## Security Considerations

- **Telegram Authentication**: Automatic initData validation on every API request
- **Server-side Verification**: HMAC-SHA256 signature validation using bot token
- **User Isolation**: Each user can only access their own profile and match data
- **HTTPS Required**: Telegram Web App only works with HTTPS
- **Environment Variables**: Bot token kept in `process.env.BOT_TOKEN`

**See [API_SECURITY.md](./API_SECURITY.md) for detailed security documentation and [API_CLIENT_GUIDE.md](./API_CLIENT_GUIDE.md) for implementation examples.**

## Performance

- App loads in <3 seconds
- Real-time WebSocket connection
- Optimized React components
- CDN-friendly static assets
- Horizontal scalable backend

## Testing

```bash
# Manual testing
1. Create Telegram bot via @BotFather
2. Deploy frontend and backend
3. Configure bot with frontend URL
4. Open bot in Telegram
5. Click Web App
6. Test solo and PvP modes

# Automated testing
cd backend
node test_match.js  # Test matchmaking system
```

## Contributing

To add new features:

1. Cases: Edit `backend/data/*.js`
2. Components: Add to `frontend/src/components/`
3. Logic: Update `backend/server.js`
4. Styling: Modify Tailwind classes or `frontend/src/index.css`

## Troubleshooting

**App doesn't load in Telegram**
- Verify frontend is HTTPS
- Check bot Menu Button configuration
- Look for errors in browser console

**WebSocket disconnects**
- Check backend is running
- Verify firewall allows WebSocket
- Check browser console for errors

**User profile empty**
- Ensure app is accessed from Telegram
- Check `/api/user/:id` endpoint returns data
- Look for CORS errors

**Cases show wrong answers**
- Check `data/cases.js` format
- Verify answer matching logic in `server.js`
- Test with API endpoints

See [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md) for detailed troubleshooting.

## Roadmap

- [ ] Real database (MongoDB/PostgreSQL)
- [ ] User authentication validation
- [ ] Wallet connection (crypto features)
- [ ] Tournaments and seasonal leagues
- [ ] Admin dashboard for case management
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Custom themes

## License

MIT

## Credits

Built for **SwiftyEx × Hackfest** 2026

## Support

📖 **Quick Start**: [QUICKSTART.md](./QUICKSTART.md)  
🤖 **Bot Setup**: [BOT_SETUP.md](./BOT_SETUP.md)  
📱 **Telegram Guide**: [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md)  
✅ **Deploy Guide**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)  

---

**Ready to launch?** Start with [QUICKSTART.md](./QUICKSTART.md) 🚀
