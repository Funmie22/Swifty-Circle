# Telegram Mini App Integration Guide

This guide explains how to set up and deploy SwiftyCircle as a Telegram Mini App.

## Overview

SwiftyCircle is now fully integrated with Telegram Web Apps SDK. Users can access the game directly through a Telegram bot, and their Telegram user ID will be used for authentication and profile management.

## Prerequisites

- A Telegram Bot (created via [@BotFather](https://t.me/BotFather))
- A public server to host your Mini App (Telegram requires HTTPS)
- Node.js and npm installed

## Setup Steps

### 1. Create a Telegram Bot

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` and follow the instructions
3. Choose a name and username for your bot
4. You'll receive a **Bot Token** - save this!

Example token: `123456789:ABCDefghIjklmnopQRSTuvwxyzABCDefgh`

### 2. Register Your Mini App

1. Message [@BotFather](https://t.me/BotFather) again
2. Send `/mybots` and select your bot
3. Select **Bot Settings** → **Menu Button** → **Web App**
4. Set the URL to your deployed Mini App (must be HTTPS)

Example URL: `https://yourapp.example.com`

### 3. Deploy the Frontend

The frontend must be served over HTTPS. Options:

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend directory
cd frontend
vercel
```

#### Option B: Heroku
```bash
# Create a Vercel configuration
cat > frontend/vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    { "src": "/(.*)", "destination": "/" }
  ]
}
EOF

vercel
```

#### Option C: Your Own Server (Nginx)
```nginx
server {
    listen 443 ssl http2;
    server_name yourapp.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        root /var/www/swiftycircle/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

### 4. Configure Backend API URL

Update the frontend environment variable to point to your backend:

```bash
# frontend/.env
VITE_API_URL=https://your-backend.example.com
```

### 5. Deploy the Backend

The backend also needs HTTPS. Example with PM2 and Nginx reverse proxy:

```bash
# Install PM2 globally
npm install -g pm2

# Navigate to backend
cd backend

# Start the server
pm2 start server.js --name "swifty-backend"

# Save PM2 processes
pm2 save
pm2 startup
```

Configure Nginx as a reverse proxy:
```nginx
server {
    listen 443 ssl http2;
    server_name api.yourapp.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6. Test Your Mini App

1. Open your Telegram bot
2. Click the menu button (or send `/start`)
3. Select "Web App" or the button you configured
4. The Mini App should load and authenticate you via Telegram

## Architecture

### Authentication Flow

```
User Opens Telegram Bot
    ↓
Telegram Web App Initializes
    ↓
TelegramContext Extracts User Data
    ↓
Frontend Fetches User Profile from /api/user/:telegramId
    ↓
Backend Creates User Profile if New
    ↓
Game Launches with Authenticated User
```

### Key Components

- **TelegramContext.jsx**: Manages Telegram Web App initialization and user data
- **App.jsx**: Uses Telegram user for authentication instead of mock profiles
- **Backend /api/user/:id**: Creates and retrieves user profiles by Telegram ID

## Environment Variables

### Frontend (.env)
```bash
VITE_API_URL=https://your-backend.example.com
```

### Backend (.env)
```bash
PORT=5000
NODE_ENV=production
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/user/:id` - Get/create user profile
- `POST /api/user/:id/profile` - Update user profile with Telegram metadata
- `GET /api/leaderboard` - Get top 100 players
- `GET /api/cases` - Get available cases

## Socket.IO Events

### Solo Mode
- `start_solo` - Begin a solo investigation
- `submit_solo_answer` - Submit answer for current stage
- `request_solo_hint` - Get a hint for current stage

### PvP Mode
- `join_queue` - Join the matchmaking queue
- `leave_queue` - Leave the matchmaking queue
- `submit_solution` - Submit solution to PvP case
- `request_hint` - Get hint for PvP case

## Troubleshooting

### "Telegram Web App not found"
- Make sure the Telegram script is loaded in index.html
- Check browser console for errors
- Verify you're accessing the app from Telegram (not directly)

### CORS Errors
- Backend already has CORS enabled for all origins
- If issues persist, check that requests use correct domain

### User Data Not Loading
- Verify Telegram initDataUnsafe is available
- Check /api/user endpoint returns data
- Review browser console for fetch errors

### Development Mode
For local development without Telegram:
1. Mock user data is created automatically
2. You can test locally with `npm run dev`
3. Use `?user=1` or `?user=2` to switch test users

## Mini App Features

The Telegram integration enables:

- **Native Authentication**: Users identify via Telegram ID
- **Haptic Feedback**: Vibration on actions (light/medium/heavy)
- **Share Functionality**: Share score to Telegram
- **Theme Awareness**: App respects Telegram's dark/light theme
- **Bottom Button**: Telegram native main button integration
- **Data Submission**: Send match results back to Telegram bot

## Security Notes

⚠️ **Important**: In production, validate `initData` and `initDataHash` from Telegram for security.

Currently, the app trusts Telegram's Web App SDK validation. For additional security:

```javascript
// backend/middleware/verifyTelegram.js
import crypto from 'crypto';

export function verifyTelegramData(initData, botToken) {
  const data_check_string = Object.entries(JSON.parse(initData))
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secret_key = crypto.createHash('sha256')
    .update(botToken)
    .digest();

  const hash = crypto.createHmac('sha256', secret_key)
    .update(data_check_string)
    .digest('hex');

  return hash === json.parse(initData).hash;
}
```

## Support

For issues or questions:
1. Check the error logs in terminal
2. Review browser DevTools console
3. Verify all environment variables are set
4. Ensure backend is running and accessible

## Next Steps

- Add wallet connection for SwiftyEx integration
- Implement real database (MongoDB, PostgreSQL)
- Add bot notification system
- Create admin dashboard
- Add analytics tracking
