# Telegram Bot Setup for SwiftyCircle

This guide walks you through creating a Telegram bot and configuring it to launch the SwiftyCircle Mini App.

## Step 1: Create a Bot with BotFather

1. Open Telegram and search for **@BotFather**
2. Send the message `/newbot`
3. Follow the prompts:
   - Choose a name: e.g., "SwiftyCircle Bot"
   - Choose a username: e.g., "swiftycircle_bot" (must be unique and end with "bot")
4. BotFather will send you a **Bot Token**. Save this carefully!

Example token: `6234567890:ABCDefghIjklmnopQRSTuvwxyzABCDefgh`

## Step 2: Test Your Bot

1. Search for your new bot in Telegram
2. Click "Start" - you should see a welcome message

## Step 3: Configure the Menu Button (Web App)

Send these commands to @BotFather in order:

```bash
/mybots
```

Select your bot, then:

```text
Menu Button → Web App → https://your-deployed-app.com
```

Replace `https://your-deployed-app.com` with your actual frontend URL.

## Step 4: Configure Commands (Optional)

Send to @BotFather:

```bash
/mybots
[Select your bot]
Edit Commands
```

Add these commands:

- `/start` - Start the game
- `/leaderboard` - View global leaderboard
- `/profile` - View your profile
- `/help` - Get help

## Step 5: Set Bot Description

```bash
/mybots
[Select your bot]
Edit description
```

Add something like:

```text
🎮 Play cybersecurity mini-games on Telegram
Solve cryptographic cases in solo or PvP mode
Compete for reputation and climb the ranks
```

## Step 6: Verify Everything Works

1. Open your Telegram bot
2. Click the **Menu Button** at the bottom
3. Click **Web App** or the button you configured
4. The SwiftyCircle Mini App should load!

## Bot Token Security

⚠️ **IMPORTANT**: Never share your bot token publicly!

If your token is leaked:

1. Go back to @BotFather
2. Select your bot
3. Click "Edit Token"
4. Request a new token

## Webhook Setup (For Bot Commands)

If you want your bot to respond to commands (e.g., `/leaderboard`), configure a webhook:

1. Set webhook URL in your backend:

```javascript
// Example: backend/bot-webhook.js
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.BOT_TOKEN);

bot.onText(/\/leaderboard/, (msg) => {
  // Send leaderboard
  bot.sendMessage(msg.chat.id, 'Open the app to see leaderboard');
});

bot.onText(/\/start/, (msg) => {
  // Send welcome
  bot.sendMessage(msg.chat.id, 'Welcome to SwiftyCircle!');
});
```

1. Install node-telegram-bot-api:

```bash
npm install node-telegram-bot-api
```

## Advanced: Deep Linking

You can create links that open your bot and pass parameters:

```text
https://t.me/your_bot_username?start=PARAMETER
```

This parameter will be available in `tg.initDataUnsafe.start_param` in your Mini App.

Example use cases:

- Referral links: `?start=ref_USER123`
- Tournament links: `?start=tournament_MATCH456`
- Share rewards: `?start=claim_REWARD`

## Troubleshooting

### Bot doesn't respond

- Make sure bot token is correct
- Verify bot is added to your account
- Check @BotFather for bot status

### Web App doesn't load

- Verify URL is HTTPS (not HTTP)
- Check that domain is accessible from internet
- Look for CORS errors in browser console

### Button doesn't appear

- Make sure you set Menu Button in BotFather
- Try `/start` command
- Restart Telegram app

## Next Steps

1. Add bot commands handling in backend
2. Implement referral system with deep links
3. Send notifications to players via bot
4. Create admin commands for moderation

## Support

If you have issues:

1. Check [@BotFather](https://t.me/BotFather) settings
2. Review [Telegram Bot API docs](https://core.telegram.org/bots)
3. Check Mini App loading in browser console
