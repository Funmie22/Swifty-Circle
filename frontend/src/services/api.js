/**
 * API Client with Telegram initData validation
 * Automatically includes initData with every request for server-side verification
 */

import { useTelegram } from '../context/TelegramContext';

let cachedInitData = '';
let cachedApiBase = '';

// Initialize on app load
export function initializeApi(tg, apiUrl) {
  // Prefer explicit initData string. If missing, construct from initDataUnsafe.user
  if (tg?.initData) {
    cachedInitData = tg.initData;
  } else if (tg?.initDataUnsafe && tg.initDataUnsafe.user) {
    try {
      cachedInitData = new URLSearchParams({ user: JSON.stringify(tg.initDataUnsafe.user) }).toString();
    } catch (e) {
      cachedInitData = '';
    }
  } else {
    cachedInitData = '';
  }
  // Debug: log what initData was captured to help diagnose auth timing issues
  console.debug('[api] initializeApi cachedInitData:', cachedInitData);
  cachedApiBase = apiUrl || (import.meta.env.VITE_API_URL || 'http://localhost:5000');
}

export function getApiBase() {
  return cachedApiBase;
}

export function getInitData() {
  return cachedInitData;
}

/**
 * Trigger haptic feedback
 * @param {string} type - 'light', 'medium', 'heavy'
 */
export function haptic(type = 'light') {
  try {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
    }
  } catch (_) {
    // Silently fail if haptics not available
  }
}

/**
 * Make API request with automatic initData inclusion
 * @param {string} path - API endpoint path
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} options.body - Request body
 * @returns {Promise<any>} Response JSON
 */
export async function api(
  path,
  { method = 'POST', body = {} } = {}
) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (!cachedInitData) {
    console.warn('[api] initData is empty when making request to', path);
  }

  // Include initData for server-side validation
  if (method !== 'GET') {
    opts.body = JSON.stringify({
      initData: cachedInitData,
      ...body,
    });
  } else {
    // For GET requests, add initData as query param
    const url = new URL(`${cachedApiBase}${path}`);
    url.searchParams.append('initData', cachedInitData);
    return fetchWithErrorHandling(url.toString(), opts);
  }

  return fetchWithErrorHandling(`${cachedApiBase}${path}`, opts);
}

/**
 * Handle fetch response and errors
 */
async function fetchWithErrorHandling(url, opts) {
  try {
    const res = await fetch(url, opts);

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`${res.status}: ${txt || res.statusText}`);
    }

    return res.json();
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
}

/**
 * Convenience methods for common operations
 */

export const apiUser = {
  /**
   * Get current user profile
   */
  getProfile: async (userId) => {
    return api(`/api/user/${userId}`, { method: 'GET' });
  },

  /**
   * Update user profile
   */
  updateProfile: async (userId, data) => {
    return api(`/api/user/${userId}/profile`, {
      method: 'POST',
      body: data,
    });
  },
};

export const apiGame = {
  /**
   * Get available cases
   */
  getCases: async () => {
    return api('/api/cases', { method: 'GET' });
  },

  /**
   * Get leaderboard
   */
  getLeaderboard: async () => {
    return api('/api/leaderboard', { method: 'GET' });
  },

  /**
   * Start solo game
   */
  startSolo: async (userId) => {
    return api('/api/game/solo/start', {
      method: 'POST',
      body: { userId },
    });
  },

  /**
   * Submit solo answer
   */
  submitSoloAnswer: async (sessionId, answer) => {
    return api('/api/game/solo/submit', {
      method: 'POST',
      body: { sessionId, answer },
    });
  },

  /**
   * Get solo hint
   */
  getSoloHint: async (sessionId) => {
    return api('/api/game/solo/hint', {
      method: 'POST',
      body: { sessionId },
    });
  },

  /**
   * Join PvP queue
   */
  joinQueue: async (userId, stake) => {
    return api('/api/game/pvp/queue/join', {
      method: 'POST',
      body: { userId, stake },
    });
  },

  /**
   * Leave PvP queue
   */
  leaveQueue: async (userId) => {
    return api('/api/game/pvp/queue/leave', {
      method: 'POST',
      body: { userId },
    });
  },

  /**
   * Submit PvP solution
   */
  submitPvPSolution: async (matchId, solution) => {
    return api('/api/game/pvp/submit', {
      method: 'POST',
      body: { matchId, solution },
    });
  },

  /**
   * Get PvP hint
   */
  getPvPHint: async (matchId) => {
    return api('/api/game/pvp/hint', {
      method: 'POST',
      body: { matchId },
    });
  },
};

/**
 * Hook for using API with automatic initData
 * Use in React components: const { api: myApi } = useApi();
 */
export function useApi() {
  const { tg, isReady } = useTelegram();

  if (!isReady) {
    console.warn('Telegram not ready for API calls');
  }

  return {
    api,
    apiUser,
    apiGame,
    haptic,
    isReady,
  };
}

export default {
  api,
  apiUser,
  apiGame,
  haptic,
  initializeApi,
  getApiBase,
  getInitData,
};
