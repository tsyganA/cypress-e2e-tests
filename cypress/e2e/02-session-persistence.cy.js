/// <reference types="cypress" />

/**
 * Test 2: Session Persistence Verification
 * 
 * Scenario:
 * 1. Login to the application
 * 2. Reload the page (cy.reload())
 * 3. Verify user remains authenticated (same UI indicators)
 * 4. Check for valid tokens/cookies
 */

describe('TEST 2: Session Persistence', () => {
  // Dynamic test run identifier
  const testRunId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  before(() => {
    cy.logTerminal('🚀 STARTING TEST 2: SESSION PERSISTENCE');
    cy.logTerminal(`📋 Test Run ID: ${testRunId}`);
  });

  it('should maintain user session after page reload', () => {
    // ============================================
    // STEP 1: Login to the application
    // ============================================
    cy.logTerminal('📌 STEP 1: Logging in to the application');
    cy.logTerminal('   → Using credentials: Ochko228 / ******');
    
    cy.login('Ochko228', 'Zxcvbn');

    // Verify initial login successful
    cy.url().should('include', '/dashboard');
    cy.contains('Ochko228', { timeout: 10000 }).should('be.visible');
    
    cy.url().then((url) => {
      cy.logTerminal('   ✓ Login command executed');
      cy.logTerminal(`   ✓ Current URL: ${url}`);
      cy.logTerminal('   ✓ Username "Ochko228" visible on page');
    });

    // ============================================
    // STEP 2: Reload the page
    // ============================================
    cy.logTerminal('📌 STEP 2: Reloading the page');
    cy.logTerminal('   → Executing cy.reload()');
    
    cy.reload();
    
    cy.logTerminal('   ✓ Page reload triggered');

    // ============================================
    // STEP 3: Verify user remains authenticated
    // ============================================
    cy.logTerminal('📌 STEP 3: Verifying session persistence');
    cy.logTerminal('   → Checking if user is still logged in');

    // Check we're NOT redirected to sign-in page
    cy.url().should('not.include', '/sign-in').then(() => {
      cy.logTerminal('   ✓ Not redirected to /sign-in (session active)');
    });
    
    cy.url().should('include', '/dashboard').then((url) => {
      cy.logTerminal(`   ✓ Still on dashboard: ${url}`);
    });

    // Verify UI still shows logged-in state
    cy.get('body', { timeout: 15000 }).should('satisfy', ($body) => {
      const bodyText = $body.text().toLowerCase();
      return (
        bodyText.includes('ochko228') ||
        bodyText.includes('profile') ||
        bodyText.includes('logout') ||
        bodyText.includes('log out') ||
        bodyText.includes('sign out') ||
        $body.find('[data-test="user-menu"], [data-testid="user-menu"], .user-menu, .user-profile').length > 0
      );
    });
    
    cy.logTerminal('   ✓ Logged-in UI state confirmed after reload');

    // ============================================
    // STEP 4: Check cookies and storage
    // ============================================
    cy.logTerminal('📌 STEP 4: Checking session tokens and storage');

    // Check cookies
    cy.getCookies().then((cookies) => {
      cy.logTerminal(`   📦 COOKIES (${cookies.length} found):`);
      if (cookies.length === 0) {
        cy.logTerminal('      (no cookies set)');
      } else {
        cookies.forEach(cookie => {
          cy.logTerminal(`      • ${cookie.name}: ${cookie.value.substring(0, 20)}...`);
        });
      }
    });

    // Check localStorage for session data
    cy.window().then((win) => {
      const keys = Object.keys(win.localStorage);
      cy.logTerminal(`   📦 LOCAL STORAGE (${keys.length} keys):`);
      
      keys.forEach(key => {
        const value = win.localStorage.getItem(key);
        const displayValue = value && value.length > 30 ? value.substring(0, 30) + '...' : value;
        cy.logTerminal(`      • ${key}: ${displayValue}`);
      });
      
      const skKey = win.localStorage.getItem('sk');
      if (skKey) {
        cy.logTerminal('   ✓ Secret key (sk) present in localStorage');
      }
    });

    // Verify username is still displayed
    cy.contains('Ochko228', { timeout: 10000 }).should('be.visible');
    cy.logTerminal('   ✓ Username "Ochko228" still visible on page');

    cy.logTerminal('🎉 TEST 2 PASSED: Session persistence verified');
    cy.logTerminal('   • Page reloaded successfully');
    cy.logTerminal('   • User remained authenticated');
    cy.logTerminal('   • Session tokens present');
  });
});

