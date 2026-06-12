# Production Deployment Guide - Telegram Mini App

This guide explains how to deploy SwiftyCircle to production with proper Telegram Mini App security.

## Prerequisites

1. **Telegram Bot Token** - Get from @BotFather on Telegram
2. **Backend Server** - Node.js hosting with HTTPS
3. **Frontend Server** - Static hosting with HTTPS (Vercel, Netlify, etc.)
4. **Environment Variables** - Set up BOT_TOKEN on backend

## Step 1: Enable Telegram Validation Middleware

### Development Mode (Current)
In development, the middleware is commented out to allow testing without Telegram:

```javascript
// backend/server.js - DEVELOPMENT (allows requests without Telegram)
// app.use('/api/', verifyTelegramBasic);
```

### Production Mode
In production, enable strict validation using your bot token:

```javascript
// backend/server.js - PRODUCTION (requires valid Telegram initData)
app.use('/api/', createVerifyTelegramMiddleware(process.env.BOT_TOKEN));
```

Or for gradual rollout, enable basic validation first:

```javascript
// backend/server.js - STAGING (validates but doesn't verify signature)
app.use('/api/', verifyTelegramBasic);
```

## Step 2: Set Environment Variables

### Backend (.env)
```bash
# Telegram Bot Token from @BotFather
BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11

# API Configuration
PORT=5000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://your-telegram-mini-app.com
```

### Frontend (.env.production)
```bash
VITE_API_URL=https://your-backend.com
```

## Step 3: Deploy Backend

### Option A: Heroku (Free tier available)
```bash
heroku create your-app-name
heroku config:set BOT_TOKEN=your_token_here
git push heroku main
```

### Option B: Railway.app
1. Create account on railway.app
2. Connect GitHub repo
3. Add environment variables in Railway dashboard
4. Deploy automatically on push

### Option C: Self-hosted (VPS)
```bash
# SSH into server
ssh user@your-server.com

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo
git clone your-repo-url
cd your-repo/backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add BOT_TOKEN=your_token_here

# Install PM2 for process management
npm install -g pm2

# Start server
pm2 start server.js --name swifty-circle

# Set up systemd service for automatic startup
pm2 startup
pm2 save
```

## Step 4: Deploy Frontend

### Option A: Vercel (Recommended for Telegram Mini Apps)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

### Option B: Netlify
1. Connect GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Option C: Traditional Hosting
```bash
cd frontend
npm run build

# Upload 'dist' folder to your web host
# Example with SCP:
scp -r dist/* user@your-server.com:/var/www/swifty-circle/
```

## Step 5: Configure Telegram Bot

1. Open Telegram and message @BotFather
2. Select your bot (or create with `/newbot`)
3. Send `/webapp`
4. Choose your bot
5. Paste the frontend URL where you deployed it
6. Save

Example response from @BotFather:
```
Bot web app updated successfully!
URL: https://your-telegram-mini-app.com
```

## Step 6: Enable Production Middleware

Once everything is deployed and tested:

### In backend/server.js:
```javascript
// Change from:
// app.use('/api/', verifyTelegramBasic);

// To:
app.use('/api/', createVerifyTelegramMiddleware(process.env.BOT_TOKEN));
```

Then redeploy the backend.

## Step 7: Test Production Deployment

1. Open Telegram
2. Search for your bot
3. Click "Open Web App"
4. Test:
   - [ ] Dashboard loads with your Telegram user
   - [ ] Solo mode works
   - [ ] PvP matchmaking works
   - [ ] Leaderboard loads
   - [ ] Profile updates save

## Security Checklist

- [ ] BOT_TOKEN is in .env (never in code)
- [ ] HTTPS is enabled on both frontend and backend
- [ ] CORS is configured correctly (backend allows frontend domain)
- [ ] Middleware is enabled with `createVerifyTelegramMiddleware`
- [ ] All API routes validate `req.tgUser` before returning data
- [ ] User IDs are isolated (can't access other users' data)
- [ ] Rate limiting is enabled (optional but recommended)
- [ ] Secrets are not logged in server logs

## Monitoring & Logs

### View Live Logs
```bash
# If using PM2
pm2 logs swifty-circle

# If using Heroku
heroku logs --tail

# If using Railway
railway logs
```

### Error Monitoring (Recommended)
Set up error tracking with services like:
- Sentry (Free tier available)
- LogRocket
- Datadog

Add to backend:
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({ dsn: process.env.SENTRY_DSN });
```

## Troubleshooting

### "Invalid initData" error
- **Cause**: Middleware enabled but BOT_TOKEN not set
- **Fix**: Add BOT_TOKEN to .env with exact token from @BotFather

### "CORS error" in browser
- **Cause**: Frontend and backend domains don't match CORS config
- **Fix**: Update `cors()` in server.js or add specific origin

### Users can't login
- **Cause**: Frontend not sending initData
- **Fix**: Ensure TelegramContext.jsx is working - check browser console

### WebSocket disconnects frequently
- **Cause**: Connection timeout or server issues
- **Fix**: Add reconnection logic (already in code) or increase timeout

## Rollback Plan

If there's an issue in production:

### Option 1: Disable Strict Validation (Fast)
```javascript
// Temporarily comment out strict validation
// app.use('/api/', createVerifyTelegramMiddleware(process.env.BOT_TOKEN));

// Use basic validation instead
app.use('/api/', verifyTelegramBasic);
```

### Option 2: Revert Commit
```bash
git revert <commit-hash>
git push
# Service redeploys automatically
```

## Performance Optimization

### Enable Caching
```javascript
// In routes, cache case data
const caseCache = new Map();

app.get('/api/cases', (req, res) => {
  if (caseCache.has('cases')) {
    return res.json(caseCache.get('cases'));
  }
  
  const cases = pvpCases.slice(0, 10);
  caseCache.set('cases', cases);
  res.json(cases);
});
```

### Enable Compression
```bash
npm install compression
```

```javascript
import compression from 'compression';
app.use(compression());
```

### Database Optimization
Currently uses in-memory objects. For production, migrate to:
- PostgreSQL (reliability)
- MongoDB (flexibility)
- Firebase (managed)

## Scaling for Growth

When you have 1000+ users:

1. **Database**: Migrate from in-memory to PostgreSQL
2. **Caching**: Add Redis for session/leaderboard caching
3. **Load Balancing**: Use multiple backend instances with load balancer
4. **CDN**: Serve frontend from CloudFlare or similar

## References

- [Telegram Web App Documentation](https://core.telegram.org/bots/webapps)
- [Bot Father Guide](https://core.telegram.org/bots#botfather)
- [Heroku Deployment](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Vercel Deployment](https://vercel.com/docs/frameworks/express)

## Support

For issues during deployment:
1. Check logs: `pm2 logs` or service dashboard
2. Test middleware: Create test endpoint without authentication
3. Verify BOT_TOKEN: Compare with @BotFather's /token output
4. Check CORS: Use CORS browser plugin to test headers
