// ***********************************************************
// This file is loaded automatically before your test files.
// This is a great place to put global configuration and
// behavior that modifies Cypress.
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Prevent uncaught exceptions from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

// Set secret key for dev environment access
// This bypasses Telegram authentication requirement
Cypress.on('window:before:load', (win) => {
  // Set the secret key in localStorage
  win.localStorage.setItem('sk', 'YJyKb5bbs0XkjR5DmPrD');
  console.log('✅ Secret key set in localStorage');
});

// Mock Telegram WebApp API for testing outside of Telegram
// This allows the Mini App to function in a regular browser/Cypress
Cypress.on('window:before:load', (win) => {
  // Create mock Telegram WebApp object
  win.Telegram = {
    WebApp: {
      // Basic properties
      initData: '',
      initDataUnsafe: {
        user: {
          id: 123456789,
          first_name: 'Test',
          last_name: 'User',
          username: 'Ochko228',
          language_code: 'en',
        },
        auth_date: Math.floor(Date.now() / 1000),
        hash: 'test_hash_for_cypress',
      },
      version: '7.0',
      platform: 'web',
      colorScheme: 'dark',
      themeParams: {
        bg_color: '#1c1c1c',
        text_color: '#ffffff',
        hint_color: '#999999',
        link_color: '#2481cc',
        button_color: '#2481cc',
        button_text_color: '#ffffff',
        secondary_bg_color: '#2c2c2c',
      },
      isExpanded: true,
      viewportHeight: 720,
      viewportStableHeight: 720,
      headerColor: '#1c1c1c',
      backgroundColor: '#1c1c1c',
      isClosingConfirmationEnabled: false,
      
      // Methods (stubs)
      ready: () => {},
      expand: () => {},
      close: () => {},
      sendData: (data) => console.log('Telegram.WebApp.sendData:', data),
      openLink: (url) => console.log('Telegram.WebApp.openLink:', url),
      openTelegramLink: (url) => console.log('Telegram.WebApp.openTelegramLink:', url),
      showPopup: (params, callback) => callback && callback('ok'),
      showAlert: (message, callback) => callback && callback(),
      showConfirm: (message, callback) => callback && callback(true),
      enableClosingConfirmation: () => {},
      disableClosingConfirmation: () => {},
      setHeaderColor: (color) => {},
      setBackgroundColor: (color) => {},
      MainButton: {
        text: '',
        color: '#2481cc',
        textColor: '#ffffff',
        isVisible: false,
        isActive: true,
        isProgressVisible: false,
        setText: function(text) { this.text = text; },
        onClick: (callback) => {},
        offClick: (callback) => {},
        show: function() { this.isVisible = true; },
        hide: function() { this.isVisible = false; },
        enable: function() { this.isActive = true; },
        disable: function() { this.isActive = false; },
        showProgress: function() { this.isProgressVisible = true; },
        hideProgress: function() { this.isProgressVisible = false; },
      },
      BackButton: {
        isVisible: false,
        onClick: (callback) => {},
        offClick: (callback) => {},
        show: function() { this.isVisible = true; },
        hide: function() { this.isVisible = false; },
      },
      HapticFeedback: {
        impactOccurred: (style) => {},
        notificationOccurred: (type) => {},
        selectionChanged: () => {},
      },
      CloudStorage: {
        setItem: (key, value, callback) => callback && callback(null, true),
        getItem: (key, callback) => callback && callback(null, ''),
        getItems: (keys, callback) => callback && callback(null, {}),
        removeItem: (key, callback) => callback && callback(null, true),
        removeItems: (keys, callback) => callback && callback(null, true),
        getKeys: (callback) => callback && callback(null, []),
      },
      onEvent: (eventType, callback) => {},
      offEvent: (eventType, callback) => {},
    },
  };
  
  console.log('✅ Telegram WebApp API mocked for Cypress testing');
});

