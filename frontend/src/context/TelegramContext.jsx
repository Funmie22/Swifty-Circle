import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApi } from '../services/api';

const TelegramContext = createContext();

export const TelegramProvider = ({ children }) => {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isWebApp, setIsWebApp] = useState(false);

  useEffect(() => {
    const initTelegram = async () => {
      let webApp = null;
      try {
        // Check if Telegram Web App is available
        if (window.Telegram && window.Telegram.WebApp) {
          webApp = window.Telegram.WebApp;
          const isLocalHost = typeof window !== 'undefined' && /localhost|127\.0\.0\.1/.test(window.location.hostname);
          let parsedTelegramUser = null;
          try {
            const rawUser = new URLSearchParams(webApp?.initData || '').get('user');
            parsedTelegramUser = rawUser ? JSON.parse(rawUser) : null;
          } catch (_) {
            parsedTelegramUser = null;
          }
          const hasRealTelegramAuth = Boolean(
            webApp?.initData &&
            /(^|&)hash=/.test(webApp.initData) &&
            (webApp?.initDataUnsafe?.user?.id || parsedTelegramUser?.id)
          );
          const isActualTelegramWebApp = hasRealTelegramAuth && !isLocalHost;
          setTg(webApp);
          setIsWebApp(isActualTelegramWebApp);

          // Ready the web app
          webApp.ready();

          const fallbackUser = {
            id: String(Math.floor(Math.random() * 10000)),
            firstName: 'Dev',
            lastName: 'User',
            username: 'devuser',
            photoUrl: null,
            isPremium: false,
            languageCode: 'en',
          };

          // Extract user data. If Telegram did not provide a real user payload,
          // synthesize a deterministic dev user and fake initData so API calls
          // keep working in localhost / browser-based testing.
          const telegramUser = webApp.initDataUnsafe?.user || parsedTelegramUser;
          const hasRealUser = Boolean(telegramUser && telegramUser.id && /(^|&)hash=/.test(webApp.initData || ''));
          const userData = hasRealUser
            ? {
                id: telegramUser.id,
                firstName: telegramUser.first_name,
                lastName: telegramUser.last_name,
                username: telegramUser.username,
                photoUrl: telegramUser.photo_url,
                isPremium: telegramUser.is_premium,
                languageCode: telegramUser.language_code,
              }
            : fallbackUser;

          setUser(userData);
          window.localStorage?.setItem('swifty-circle-dev-user', JSON.stringify(userData));

          if (!webApp.initData || !webApp.initData.includes('hash=')) {
            webApp.initData = new URLSearchParams({ user: JSON.stringify(userData) }).toString();
          }
          webApp.initDataUnsafe = {
            ...(webApp.initDataUnsafe || {}),
            user: userData,
          };

          // Set theme color
          try {
            webApp.setHeaderColor(webApp.themeParams?.bg_color || '#000000');
          } catch (_) {}

          // Set main button
          try {
            webApp.MainButton.setText('Play');
            webApp.MainButton.show();
          } catch (_) {}
        } else {
          // Fallback for non-Telegram environment (development)
          setIsWebApp(false);
          const fallbackUser = {
            id: String(Math.floor(Math.random() * 10000)),
            firstName: 'Dev',
            lastName: 'User',
            username: 'devuser',
            photoUrl: null,
            isPremium: false,
            languageCode: 'en',
          };
          setUser(fallbackUser);
          window.localStorage?.setItem('swifty-circle-dev-user', JSON.stringify(fallbackUser));
          // Create a fake initData string containing the user JSON so the
          // backend's basic verifier can extract user info in dev.
          // We'll pass this object to initializeApi below. Also provide
          // initDataUnsafe.user so components can read user fields.
          webApp = {
            initData: new URLSearchParams({ user: JSON.stringify(fallbackUser) }).toString(),
            initDataUnsafe: { user: fallbackUser },
          };
        }
      } catch (err) {
        console.error('Error initializing Telegram:', err);
        // Fallback user
        setUser({
          id: Math.floor(Math.random() * 10000),
          firstName: 'Test',
          lastName: 'User',
          username: 'testuser',
          photoUrl: null,
          isPremium: false,
          languageCode: 'en',
        });
      }
      
      // Initialize API client with Telegram data
      const RENDER_URL = 'https://swifty-circle.onrender.com';
      const envApi = import.meta.env.VITE_API_URL;
      const isLocalHost = typeof window !== 'undefined' && /localhost|127\.0\.0\.1/.test(window.location.hostname);
      const effectiveTg = webApp || window.Telegram?.WebApp;
      const apiUrl = envApi || (isLocalHost ? 'http://localhost:5000' : RENDER_URL);
      console.debug('[TelegramContext] initializing API with tg:', !!effectiveTg, 'hasInitDataUnsafe:', !!effectiveTg?.initDataUnsafe, 'apiUrl:', apiUrl);
      initializeApi(effectiveTg, apiUrl);

      // Ensure we have a user before marking the app ready. Try to parse user from initData if not set.
      if (!user) {
        try {
          const rawInit = effectiveTg?.initData || '';
          if (rawInit) {
            const maybeUser = new URLSearchParams(rawInit).get('user');
            if (maybeUser) {
              const parsed = JSON.parse(maybeUser);
              const userData = {
                id: parsed.id || parsed.user_id || String(parsed.id),
                firstName: parsed.first_name || parsed.firstName || parsed.firstName,
                lastName: parsed.last_name || parsed.lastName || parsed.lastName,
                username: parsed.username,
                photoUrl: parsed.photo_url || parsed.photoUrl,
                isPremium: parsed.is_premium || false,
                languageCode: parsed.language_code || parsed.languageCode || 'en',
              };
              setUser(userData);
              console.debug('[TelegramContext] parsed user from initData', userData);
            }
          }
        } catch (err) {
          console.debug('[TelegramContext] could not parse initData user:', err);
        }
      }

      // If still no user, create a deterministic fallback user so downstream callers never see undefined
      if (!user) {
        const fallbackUser2 = {
          id: String(Math.floor(Math.random() * 10000)),
          firstName: 'Dev',
          lastName: 'User',
          username: 'devuser',
          photoUrl: null,
          isPremium: false,
          languageCode: 'en',
        };
        setUser(fallbackUser2);
        console.debug('[TelegramContext] set fallback user for readiness', fallbackUser2);
      }

      setIsReady(true);
    };

    initTelegram();
  }, []);

  const sendData = (data) => {
    if (tg && tg.sendData) {
      tg.sendData(JSON.stringify(data));
    }
  };

  const showAlert = (message) => {
    if (tg && tg.showAlert) {
      tg.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showConfirm = (message, callback) => {
    if (tg && tg.showConfirm) {
      tg.showConfirm(message, callback);
    } else {
      const result = window.confirm(message);
      callback(result);
    }
  };

  const showPopup = (params, callback) => {
    if (tg && tg.showPopup) {
      tg.showPopup(params, callback);
    }
  };

  const hapticFeedback = (type = 'light') => {
    if (tg && tg.HapticFeedback) {
      if (type === 'light') {
        tg.HapticFeedback.impactOccurred('light');
      } else if (type === 'medium') {
        tg.HapticFeedback.impactOccurred('medium');
      } else if (type === 'heavy') {
        tg.HapticFeedback.impactOccurred('heavy');
      }
    }
  };

  const shareScore = (text) => {
    if (tg && tg.shareUrl) {
      // Share via Telegram
      const url = `${window.location.origin}?ref=${user?.id}`;
      tg.shareUrl(url, text);
    }
  };

  const value = {
    tg,
    user,
    isReady,
    isWebApp,
    sendData,
    showAlert,
    showConfirm,
    showPopup,
    hapticFeedback,
    shareScore,
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider');
  }
  return context;
};
