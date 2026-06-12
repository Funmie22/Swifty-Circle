import crypto from 'crypto';

/**
 * Verify Telegram initData signature
 * @param {string} initData - Raw initData from Telegram Web App
 * @param {string} botToken - Bot token from @BotFather
 * @returns {boolean} True if signature is valid
 */
export function verifyTelegramSignature(initData, botToken) {
  if (!initData) return false;

  try {
    const data = new URLSearchParams(initData);
    const hash = data.get('hash');

    if (!hash) return false;

    // Create data-check-string (all params except hash, sorted alphabetically)
    const entries = [];
    data.forEach((value, key) => {
      if (key !== 'hash') {
        entries.push([key, value]);
      }
    });

    entries.sort(([a], [b]) => a.localeCompare(b));

    const dataCheckString = entries
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Create secret key from bot token
    const secretKey = crypto.createHash('sha256').update(botToken).digest();

    // Create HMAC
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return hash === calculatedHash;
  } catch (err) {
    console.error('Error verifying Telegram signature:', err);
    return false;
  }
}

/**
 * Extract user data from initData
 * @param {string} initData - Raw initData from Telegram Web App
 * @returns {Object|null} User data or null if invalid
 */
export function extractUserFromInitData(initData) {
  if (!initData) return null;

  try {
    const data = new URLSearchParams(initData);
    const userJson = data.get('user');

    if (!userJson) return null;

    const user = JSON.parse(userJson);
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      photoUrl: user.photo_url,
      isPremium: user.is_premium,
      languageCode: user.language_code,
      isBot: user.is_bot,
    };
  } catch (err) {
    console.error('Error extracting user from initData:', err);
    return null;
  }
}

/**
 * Middleware to verify Telegram initData
 * Usage: app.use(verifyTelegramMiddleware);
 */
export function createVerifyTelegramMiddleware(botToken) {
  return (req, res, next) => {
    // Get initData from request body or query
    const initData = req.body?.initData || req.query?.initData;

    if (!initData) {
      return res.status(401).json({
        error: 'Missing initData',
        message: 'Telegram authentication required',
      });
    }

    // Verify signature
    if (!verifyTelegramSignature(initData, botToken)) {
      return res.status(401).json({
        error: 'Invalid initData',
        message: 'Telegram signature verification failed',
      });
    }

    // Extract user data
    const user = extractUserFromInitData(initData);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid user data',
        message: 'Could not extract user from initData',
      });
    }

    // Attach user to request for use in route handlers
    req.tgUser = user;
    next();
  };
}

/**
 * Alternative simpler verification (for development)
 * Only validates that initData is present and parseable
 */
export function verifyTelegramBasic(req, res, next) {
  const initData = req.body?.initData || req.query?.initData;

  if (!initData) {
    return res.status(401).json({
      error: 'Missing initData',
      message: 'Telegram authentication required',
    });
  }

  const user = extractUserFromInitData(initData);
  if (!user) {
    return res.status(401).json({
      error: 'Invalid user data',
      message: 'Could not extract user from initData',
    });
  }

  req.tgUser = user;
  next();
}
