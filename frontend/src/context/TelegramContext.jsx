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
          setTg(webApp);
          setIsWebApp(true);

          // Ready the web app
          webApp.ready();

          // Extract user data
          if (webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
            const userData = {
              id: webApp.initDataUnsafe.user.id,
              firstName: webApp.initDataUnsafe.user.first_name,
              lastName: webApp.initDataUnsafe.user.last_name,
              username: webApp.initDataUnsafe.user.username,
              photoUrl: webApp.initDataUnsafe.user.photo_url,
              isPremium: webApp.initDataUnsafe.user.is_premium,
              languageCode: webApp.initDataUnsafe.user.language_code,
            };
            setUser(userData);
          }

          // Set theme color
          webApp.setHeaderColor(webApp.themeParams.bg_color || '#000000');

          // Set main button
          webApp.MainButton.setText('Play');
          webApp.MainButton.show();
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // Use real Telegram WebApp when available, otherwise the synthetic one above
      const effectiveTg = webApp || window.Telegram?.WebApp;
      console.debug('[TelegramContext] initializing API with tg:', !!effectiveTg, 'hasInitDataUnsafe:', !!effectiveTg?.initDataUnsafe);
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
