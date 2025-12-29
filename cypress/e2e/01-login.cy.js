/// <reference types="cypress" />

/**
 * Test 1: Login via UI
 * 
 * Scenario:
 * 1. Open https://fufelka.ru/sign-in
 * 2. Enter login/password, click Log in
 * 3. Wait for auth endpoint response (cy.intercept + cy.wait)
 * 4. Verify successful login in UI (username/menu displayed, dashboard visible)
 */

describe('TEST 1: Login via UI', () => {
  // Dynamic test run identifier
  const testRunId = `login-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  before(() => {
    cy.logTerminal('🚀 STARTING TEST 1: LOGIN VIA UI');
    cy.logTerminal(`📋 Test Run ID: ${testRunId}`);
  });

  it('should successfully login with valid credentials', () => {
    // ============================================
    // STEP 1: Setup intercepts for auth requests
    // ============================================
    cy.logTerminal('📌 STEP 1: Setting up request intercepts');
    
    cy.intercept('POST', '**/api/**').as('authRequest');
    cy.intercept('GET', '**/api/**').as('apiRequest');
    
    cy.logTerminal('   ✓ Intercept for POST /api/** configured as @authRequest');
    cy.logTerminal('   ✓ Intercept for GET /api/** configured as @apiRequest');

    // ============================================
    // STEP 2: Navigate to sign-in page
    // ============================================
    cy.logTerminal('📌 STEP 2: Navigating to sign-in page');
    cy.logTerminal('   → URL: /sign-in');
    
    cy.visit('/sign-in');
    cy.contains('Login', { timeout: 15000 }).should('be.visible');
    
    cy.url().then((url) => {
      cy.logTerminal(`   ✓ Page loaded successfully`);
      cy.logTerminal(`   ✓ Current URL: ${url}`);
      cy.logTerminal('   ✓ "Login" button is visible on page');
    });

    // ============================================
    // STEP 3: Click Login button to open form
    // ============================================
    cy.logTerminal('📌 STEP 3: Opening login form');
    cy.logTerminal('   → Clicking "Login" button');
    
    cy.contains('Login').click();
    cy.get('input', { timeout: 10000 }).should('be.visible');
    
    cy.logTerminal('   ✓ Login button clicked');
    cy.logTerminal('   ✓ Login form appeared');
    cy.logTerminal('   ✓ Input fields are visible');

    // ============================================
    // STEP 4: Fill login credentials
    // ============================================
    cy.logTerminal('📌 STEP 4: Entering credentials');
    cy.logTerminal('   → Username: Ochko228');
    cy.logTerminal('   → Password: ******');
    
    // Enter username
    cy.get('input[name="username"], input[name="login"], input[type="text"], input[placeholder*="user" i], input[placeholder*="login" i], input[placeholder*="name" i], input[data-test="username"], input[data-testid="username"], #username, #login')
      .first()
      .should('be.visible')
      .clear()
      .type('Ochko228', { delay: 50 });
    
    cy.logTerminal('   ✓ Username entered: Ochko228');

    // Enter password
    cy.get('input[name="password"], input[type="password"], input[data-test="password"], input[data-testid="password"], #password')
      .first()
      .should('be.visible')
      .clear()
      .type('Zxcvbn', { delay: 50 });
    
    cy.logTerminal('   ✓ Password entered (masked for security)');

    // ============================================
    // STEP 5: Submit login form
    // ============================================
    cy.logTerminal('📌 STEP 5: Submitting login form');
    cy.logTerminal('   → Clicking submit button');
    
    cy.contains(/^(Log in|Login|Sign in|Submit|Enter)$/i, { timeout: 5000 })
      .should('be.visible')
      .click();
    
    cy.logTerminal('   ✓ Submit button clicked');

    // ============================================
    // STEP 6: Wait for auth request to complete
    // ============================================
    cy.wait('@authRequest', { timeout: 15000 }).then((interception) => {
      const status = interception.response?.statusCode;
      const method = interception.request?.method;
      const url = interception.request?.url;
      
      cy.logTerminal(`   ✓ Request intercepted`);
      cy.logTerminal(`   ✓ Method: ${method}`);
      cy.logTerminal(`   ✓ URL: ${url}`);
      cy.logTerminal(`   ✓ Response Status: ${status}`);
      
      // Verify successful response (2xx)
      expect(status).to.be.gte(200);
      expect(status).to.be.lt(300);
    });

    // ============================================
    // STEP 7: Verify successful login in UI
    // ============================================
    cy.logTerminal('📌 STEP 7: Verifying successful login in UI');
    
    // Check we're no longer on sign-in page
    cy.url().should('not.include', '/sign-in');
    cy.logTerminal('   ✓ No longer on /sign-in page');

    // Verify logged-in state indicators
    cy.get('body').should('satisfy', ($body) => {
      const bodyText = $body.text().toLowerCase();
      
      const hasUserIndicator = 
        bodyText.includes('ochko228') ||
        bodyText.includes('profile') ||
        bodyText.includes('logout') ||
        bodyText.includes('sign out') ||
        bodyText.includes('log out') ||
        bodyText.includes('dashboard') ||
        bodyText.includes('lobby') ||
        bodyText.includes('welcome') ||
        $body.find('[data-test="user-menu"], [data-testid="user-menu"], .user-menu, .user-profile, .avatar').length > 0;
      
      return hasUserIndicator;
    });
    
    cy.logTerminal('   ✓ Logged-in state indicators found in UI');

    // Verify dashboard URL
    cy.url().should('include', '/dashboard').then((url) => {
      cy.logTerminal(`   ✓ Redirected to dashboard`);
      cy.logTerminal(`   ✓ Current URL: ${url}`);
    });

    cy.logTerminal('🎉 TEST 1 PASSED: Login via UI successful');
    cy.logTerminal('   • User: Ochko228');
    cy.logTerminal('   • Auth request: 2xx response');
    cy.logTerminal('   • Location: /dashboard');
  });
});

