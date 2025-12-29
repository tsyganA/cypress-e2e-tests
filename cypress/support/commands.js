// ***********************************************
// Custom Commands for E2E Tests
// ***********************************************

/**
 * Log message to terminal (visible in headless mode)
 * @param {string} message - Message to log
 */
Cypress.Commands.add('logTerminal', (message) => {
  cy.task('log', message, { log: false });
  cy.log(message); // Also log to Cypress GUI/video
});

/**
 * Generates a unique identifier using timestamp and random string
 * @returns {string} Unique identifier
 */
Cypress.Commands.add('generateUniqueId', () => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
});

/**
 * Waits for an element to be visible and stable before interacting
 * @param {string} selector - CSS selector or data-test attribute
 * @param {number} timeout - Optional timeout in ms
 */
Cypress.Commands.add('waitForElement', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible');
});

/**
 * Gets an element by data-test attribute
 * @param {string} dataTestValue - Value of data-test attribute
 */
Cypress.Commands.add('getByDataTest', (dataTestValue) => {
  return cy.get(`[data-test="${dataTestValue}"]`);
});

/**
 * Gets an element by data-testid attribute
 * @param {string} dataTestIdValue - Value of data-testid attribute
 */
Cypress.Commands.add('getByTestId', (dataTestIdValue) => {
  return cy.get(`[data-testid="${dataTestIdValue}"]`);
});

/**
 * Uploads a file to an input element
 * @param {string} selector - Input selector
 * @param {string} filePath - Path to file in fixtures
 */
Cypress.Commands.add('uploadFile', (selector, filePath) => {
  cy.get(selector).selectFile(`cypress/fixtures/${filePath}`, { force: true });
});

/**
 * Extracts src attribute from an image element
 * @param {string} selector - Image selector
 */
Cypress.Commands.add('getImageSrc', (selector) => {
  return cy.get(selector).invoke('attr', 'src');
});

/**
 * Login command - performs UI login with given credentials
 * @param {string} username - Username/login
 * @param {string} password - Password
 */
Cypress.Commands.add('login', (username = 'Ochko228', password = 'Zxcvbn') => {
  // Set up intercepts for auth
  cy.intercept('POST', '**/api/**').as('authRequest');
  cy.intercept('GET', '**/api/**').as('apiRequest');

  // Navigate to sign-in page
  cy.visit('/sign-in');

  // Wait for Login button to appear
  cy.contains('Login', { timeout: 15000 }).should('be.visible');

  // Click Login button on main page
  cy.contains('Login').click();

  // Wait for form inputs
  cy.get('input', { timeout: 10000 }).should('be.visible');

  // Fill username
  cy.get('input[name="username"], input[name="login"], input[type="text"], input[placeholder*="user" i], input[placeholder*="login" i], input[placeholder*="name" i], input[data-test="username"], input[data-testid="username"], #username, #login')
    .first()
    .should('be.visible')
    .clear()
    .type(username, { delay: 50 });

  // Fill password
  cy.get('input[name="password"], input[type="password"], input[data-test="password"], input[data-testid="password"], #password')
    .first()
    .should('be.visible')
    .clear()
    .type(password, { delay: 50 });

  // Submit form
  cy.contains(/^(Log in|Login|Sign in|Submit|Enter)$/i, { timeout: 5000 })
    .should('be.visible')
    .click();

  // Wait for auth request
  cy.wait('@authRequest', { timeout: 15000 });

  // Verify not on sign-in page anymore
  cy.url().should('not.include', '/sign-in');
});

/**
 * Navigate to profile settings page
 */
Cypress.Commands.add('navigateToProfileSettings', () => {
  // Wait for dashboard to load with username
  cy.contains('Ochko228', { timeout: 10000 }).should('be.visible');
  
  // Click on avatar image to open settings
  cy.contains('Ochko228').parents().find('img').filter(':visible').first().click({ force: true });

  // Wait for Settings page
  cy.contains('Settings', { timeout: 15000 }).should('be.visible');
  cy.url().should('include', 'settings');
});

/**
 * Navigate to profile edit page
 */
Cypress.Commands.add('navigateToProfileEdit', () => {
  cy.navigateToProfileSettings();
  
  // Click pencil/edit button
  cy.get('img[alt="avatar"]').parent().parent().find('[aria-label="mini-btn"]').click({ force: true });

  // Wait for edit page
  cy.url().should('include', 'edit-profile', { timeout: 10000 });
  cy.contains('Edit profile', { timeout: 10000 }).should('be.visible');
});

