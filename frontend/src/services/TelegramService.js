/**
 * Telegram Mini App Service
 * Provides utilities for interacting with Telegram Web App API
 */

export class TelegramService {
  constructor(tg) {
    this.tg = tg;
  }

  /**
   * Get current theme
   * @returns {'light' | 'dark'}
   */
  getTheme() {
    if (!this.tg) return 'dark';
    return this.tg.colorScheme || 'dark';
  }

  /**
   * Get theme parameters
   * @returns {Object} Theme colors and styling
   */
  getThemeParams() {
    if (!this.tg) return {};
    return this.tg.themeParams || {};
  }

  /**
   * Get safe area insets
   * @returns {Object} Safe area dimensions
   */
  getSafeAreaInset() {
    if (!this.tg) return { top: 0, bottom: 0, left: 0, right: 0 };
    return this.tg.safeAreaInset || { top: 0, bottom: 0, left: 0, right: 0 };
  }

  /**
   * Get viewport height
   * @returns {number} Height in pixels
   */
  getViewportHeight() {
    if (!this.tg) return window.innerHeight;
    return this.tg.viewportHeight || window.innerHeight;
  }

  /**
   * Get viewport width
   * @returns {number} Width in pixels
   */
  getViewportWidth() {
    if (!this.tg) return window.innerWidth;
    return this.tg.viewportWidth || window.innerWidth;
  }

  /**
   * Trigger haptic feedback
   * @param {'impactLight' | 'impactMedium' | 'impactHeavy' | 'notificationSuccess' | 'notificationError' | 'notificationWarning'} type
   */
  hapticFeedback(type = 'impactLight') {
    if (!this.tg || !this.tg.HapticFeedback) return;

    const typeMap = {
      light: () => this.tg.HapticFeedback.impactOccurred('light'),
      medium: () => this.tg.HapticFeedback.impactOccurred('medium'),
      heavy: () => this.tg.HapticFeedback.impactOccurred('heavy'),
      impactLight: () => this.tg.HapticFeedback.impactOccurred('light'),
      impactMedium: () => this.tg.HapticFeedback.impactOccurred('medium'),
      impactHeavy: () => this.tg.HapticFeedback.impactOccurred('heavy'),
      notificationSuccess: () => this.tg.HapticFeedback.notificationOccurred('success'),
      notificationError: () => this.tg.HapticFeedback.notificationOccurred('error'),
      notificationWarning: () => this.tg.HapticFeedback.notificationOccurred('warning'),
    };

    if (typeMap[type]) {
      typeMap[type]();
    }
  }

  /**
   * Share the current app/score to Telegram
   * @param {string} text - Share text
   * @param {string} url - Share URL
   */
  shareToTelegram(text, url = window.location.href) {
    if (!this.tg || !this.tg.shareUrl) {
      // Fallback for non-Telegram environment
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
      return;
    }
    this.tg.shareUrl(url, text);
  }

  /**
   * Show an alert dialog
   * @param {string} message
   * @param {Function} callback
   */
  showAlert(message, callback) {
    if (!this.tg || !this.tg.showAlert) {
      alert(message);
      if (callback) callback();
      return;
    }
    this.tg.showAlert(message, callback);
  }

  /**
   * Show a confirmation dialog
   * @param {string} message
   * @param {Function} callback
   */
  showConfirm(message, callback) {
    if (!this.tg || !this.tg.showConfirm) {
      const result = window.confirm(message);
      if (callback) callback(result);
      return;
    }
    this.tg.showConfirm(message, callback);
  }

  /**
   * Show a popup with buttons
   * @param {Object} params
   * @param {Function} callback
   */
  showPopup(params, callback) {
    if (!this.tg || !this.tg.showPopup) {
      // Simple fallback
      if (callback) {
        callback(params.buttons?.[0]?.id);
      }
      return;
    }
    this.tg.showPopup(params, callback);
  }

  /**
   * Open a URL in Telegram
   * @param {string} url
   */
  openUrl(url) {
    if (!this.tg) {
      window.open(url, '_blank');
      return;
    }
    this.tg.openUrl(url);
  }

  /**
   * Close the Web App
   */
  close() {
    if (!this.tg || !this.tg.close) {
      window.close();
      return;
    }
    this.tg.close();
  }

  /**
   * Send data back to Telegram bot
   * @param {*} data
   */
  sendData(data) {
    if (!this.tg || !this.tg.sendData) {
      console.log('Would send to bot:', data);
      return;
    }
    this.tg.sendData(JSON.stringify(data));
  }

  /**
   * Set the main button text and show it
   * @param {string} text
   * @param {Function} onClick
   */
  setMainButton(text, onClick) {
    if (!this.tg || !this.tg.MainButton) return;

    this.tg.MainButton.setText(text);
    this.tg.MainButton.show();

    // Remove previous click handlers
    this.tg.MainButton.offClick(onClick);
    this.tg.MainButton.onClick(onClick);
  }

  /**
   * Hide the main button
   */
  hideMainButton() {
    if (!this.tg || !this.tg.MainButton) return;
    this.tg.MainButton.hide();
  }

  /**
   * Set header color
   * @param {string} color - Hex color code
   */
  setHeaderColor(color) {
    if (!this.tg || !this.tg.setHeaderColor) return;
    this.tg.setHeaderColor(color);
  }

  /**
   * Set background color
   * @param {string} color - Hex color code
   */
  setBackgroundColor(color) {
    if (!this.tg || !this.tg.setBackgroundColor) return;
    this.tg.setBackgroundColor(color);
  }

  /**
   * Expand the Web App to full screen
   */
  expand() {
    if (!this.tg || !this.tg.expand) return;
    this.tg.expand();
  }

  /**
   * Check if Web App is ready
   */
  isReady() {
    return !!this.tg;
  }

  /**
   * Get current user
   * @returns {Object} User data from Telegram
   */
  getCurrentUser() {
    if (!this.tg || !this.tg.initDataUnsafe) return null;
    return this.tg.initDataUnsafe.user || null;
  }

  /**
   * Get start parameter from deep link
   * @returns {string|null}
   */
  getStartParameter() {
    if (!this.tg || !this.tg.initDataUnsafe) return null;
    return this.tg.initDataUnsafe.start_param || null;
  }

  /**
   * Enable/disable vertical swipes
   * @param {boolean} enabled
   */
  setVerticalSwipesEnabled(enabled) {
    if (!this.tg) return;
    if (enabled && this.tg.enableVerticalSwipes) {
      this.tg.enableVerticalSwipes();
    } else if (!enabled && this.tg.disableVerticalSwipes) {
      this.tg.disableVerticalSwipes();
    }
  }

  /**
   * Ready the Web App (should be called after initialization)
   */
  ready() {
    if (!this.tg || !this.tg.ready) return;
    this.tg.ready();
  }
}

export default TelegramService;
