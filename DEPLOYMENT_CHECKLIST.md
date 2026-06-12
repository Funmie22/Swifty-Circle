# SwiftyCircle Telegram Mini App - Deployment Checklist

Complete this checklist to deploy SwiftyCircle as a Telegram Mini App.

## Pre-Deployment

- [ ] Read [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md) for full integration guide
- [ ] Read [BOT_SETUP.md](./BOT_SETUP.md) for bot configuration
- [ ] Have a Telegram account and @BotFather access
- [ ] Have a domain name (HTTPS required)
- [ ] Have a hosting provider for frontend (Vercel, Heroku, etc.)
- [ ] Have a hosting provider for backend (same or separate server)

## Bot Setup

- [ ] Create bot via @BotFather
- [ ] Save bot token securely (never share!)
- [ ] Set bot username (must end with "bot")
- [ ] Set bot description in @BotFather
- [ ] Configure Menu Button → Web App in @BotFather
- [ ] Test bot responds to `/start`
- [ ] Set bot commands (optional): `/start`, `/leaderboard`, `/profile`

## Frontend Deployment

- [ ] Create `.env` file from `.env.example`
- [ ] Set `VITE_API_URL` to your backend domain
- [ ] Verify `index.html` includes Telegram script:

  ```html
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  ```

- [ ] Run `npm run build` locally to test
- [ ] Deploy to Vercel/Heroku/your server
- [ ] Verify URL is HTTPS (required by Telegram)
- [ ] Test app loads at your domain
- [ ] Update bot Menu Button URL in @BotFather to your deployed URL

## Backend Deployment

- [ ] Create `.env` file (or use defaults)
- [ ] Set `PORT` if not 5000
- [ ] Verify CORS is enabled (already configured)
- [ ] Deploy to server (Vercel, Heroku, AWS, DigitalOcean, etc.)
- [ ] Verify backend URL is HTTPS and accessible
- [ ] Test API endpoints manually:
  - [ ] GET `/api/health` returns `{ok: true}`
  - [ ] GET `/api/user/12345` creates/returns user profile
  - [ ] GET `/api/leaderboard` returns top players

## Frontend-Backend Integration

- [ ] Frontend can reach backend API
- [ ] WebSocket connection works (test in browser console)
- [ ] User profile loads from Telegram ID
- [ ] Dashboard displays correctly with Telegram user data

## Telegram Integration Tests

- [ ] Open bot in Telegram
- [ ] Click Menu Button / Web App
- [ ] App loads and shows initialization message
- [ ] User data displays (name, ID from Telegram)
- [ ] Haptic feedback works (phone vibrates on action)
- [ ] Can start solo game
- [ ] Can join matchmaking queue
- [ ] Can complete a case
- [ ] Leaderboard shows players (if implemented)

## Security Checklist

- [ ] Bot token stored in environment variable (not in code)
- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS configured to allow requests from Telegram domain
- [ ] User input sanitized before storage
- [ ] API endpoints validate user ownership (user can only access own data)
- [ ] No sensitive data logged to console in production
- [ ] Database credentials not exposed in frontend

## Performance Checks

- [ ] App loads in under 3 seconds
- [ ] No console errors
- [ ] Mobile responsive (test on mobile)
- [ ] WebSocket stays connected during gameplay
- [ ] Game doesn't crash after extended play

## Post-Deployment

- [ ] Monitor error logs for crashes
- [ ] Check user feedback in @BotFather
- [ ] Monitor server resources (CPU, memory, bandwidth)
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Create backup/restore procedure
- [ ] Document deployment process for future updates

## Monitoring & Maintenance

### Setup Monitoring

- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Error logging (Sentry, LogRocket)
- [ ] Performance monitoring (New Relic, Datadog)
- [ ] Database monitoring (if using database)

### Weekly Checks

- [ ] Check error logs for issues
- [ ] Verify bot still responds
- [ ] Check user count and activity
- [ ] Monitor server resources

### Monthly Updates

- [ ] Review player data and balance
- [ ] Check for security updates in dependencies
- [ ] Update case content if needed
- [ ] Review and respond to user feedback

## Rollback Plan

If something goes wrong:

1. **Frontend Issue**
   - Revert to previous deployment
   - Update bot Menu Button URL back to old version
   - Monitor for errors before re-deploying

2. **Backend Issue**
   - Restart server
   - Check logs for errors
   - Restore from backup if data corrupted
   - Notify affected players

3. **Critical Issues**
   - Disable bot via @BotFather
   - Post status update to Telegram channel
   - Work on fix in staging environment
   - Re-enable once fixed

## Environment Variables Reference

### Frontend (.env)

VITE_API_URL=<https://your-api.example.com>
VITE_ANALYTICS_ID=your-analytics-id
VITE_ENABLE_LEADERBOARD=true

### Backend (.env)

PORT=5000
NODE_ENV=production
BOT_TOKEN=your_telegram_bot_token

## Useful Commands

```bash
# Frontend
npm run dev              # Local development
npm run build           # Production build
npm run preview         # Preview production build

# Backend
npm start               # Start server
npm run dev             # Development with auto-reload

# Testing
curl http://localhost:5000/api/health
curl http://localhost:5000/api/user/123456
```

## Support Resources

- [Telegram Bot API Docs](https://core.telegram.org/bots/api)
- [Telegram Web Apps Docs](https://core.telegram.org/bots/webapps)
- [Node.js Socket.IO Docs](https://socket.io/docs/)
- [React Docs](https://react.dev)

## Notes

Add any deployment-specific notes here:

```text
- Deployed to: [DOMAIN]
- Bot token stored in: [LOCATION]
- Database: [TYPE/LOCATION]
- Monitoring: [SERVICES]
- Contact: [EMAIL/TELEGRAM]
```

---

**Deployment Date**: [DATE]
**Deployed By**: [NAME]
**Status**: [Active/Testing]
