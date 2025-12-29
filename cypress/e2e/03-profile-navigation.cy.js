/// <reference types="cypress" />

/**
 * Test 3: Profile Navigation
 * 
 * Scenario:
 * 1. Login to the application
 * 2. Navigate to profile page/menu via UI
 * 3. Verify current profile data is loaded (including avatar)
 */

describe('TEST 3: Profile Navigation', () => {
  // Dynamic test run identifier
  const testRunId = `profile-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  before(() => {
    cy.logTerminal('🚀 STARTING TEST 3: PROFILE NAVIGATION');
    cy.logTerminal(`📋 Test Run ID: ${testRunId}`);
  });

  it('should navigate to profile and display user data', () => {
    // ============================================
    // STEP 1: Login to the application
    // ============================================
    cy.logTerminal('📌 STEP 1: Logging in to the application');
    cy.logTerminal('   → Using credentials: Ochko228 / ******');
    
    cy.login('Ochko228', 'Zxcvbn');

    // Verify login successful
    cy.url().should('include', '/dashboard');
    cy.contains('Ochko228', { timeout: 10000 }).should('be.visible');
    
    cy.logTerminal('   ✓ Login successful');
    cy.logTerminal('   ✓ Dashboard loaded');
    cy.logTerminal('   ✓ Username visible');

    // ============================================
    // STEP 2: Set up intercept for profile data
    // ============================================
    cy.logTerminal('📌 STEP 2: Setting up profile data intercept');
    
    cy.intercept('GET', '**/api/**').as('profileData');
    
    cy.logTerminal('   ✓ Intercept for GET /api/** configured');

    // ============================================
    // STEP 3: Navigate to Settings page
    // ============================================
    cy.logTerminal('📌 STEP 3: Opening Settings page');
    cy.logTerminal('   → Clicking on avatar/profile picture');

    // Click on avatar image (profile picture in circle)
    cy.contains('Ochko228').parents().find('img').filter(':visible').first().click({ force: true });
    cy.logTerminal('   ✓ Profile avatar clicked');

    // Wait for Settings page to load
    cy.contains('Settings', { timeout: 15000 }).should('be.visible');
    cy.logTerminal('   ✓ "Settings" text visible');
    
    cy.url().should('include', 'settings').then((url) => {
      cy.logTerminal(`   ✓ Navigated to settings page`);
      cy.logTerminal(`   ✓ Current URL: ${url}`);
    });

    // ============================================
    // STEP 4: Verify profile data is displayed
    // ============================================
    cy.logTerminal('📌 STEP 4: Verifying profile data is loaded');

    // Username should be visible
    cy.get('body').should('contain.text', 'Ochko228');
    cy.logTerminal('   ✓ Username "Ochko228" displayed');

    // Avatar should be present
    cy.get('img[alt="avatar"]', { timeout: 10000 }).should('be.visible').and('have.attr', 'src');
    cy.logTerminal('   ✓ Avatar image element found');

    // Store avatar src for reference
    cy.get('img[alt="avatar"]').invoke('attr', 'src').then((src) => {
      cy.logTerminal(`   ✓ Current avatar src: ${src}`);
      expect(src).to.not.be.empty;
      cy.logTerminal('   ✓ Avatar has valid src attribute');
    });

    // ============================================
    // STEP 5: Navigate to Edit Profile page
    // ============================================
    cy.logTerminal('📌 STEP 5: Opening Edit Profile page');
    cy.logTerminal('   → Clicking pencil/edit button near avatar');

    // Click pencil/edit button near avatar
    cy.get('img[alt="avatar"]').parent().parent().find('[aria-label="mini-btn"]').click({ force: true });
    cy.logTerminal('   ✓ Edit button (pencil icon) clicked');

    // Wait for edit profile page
    cy.url().should('include', 'edit-profile', { timeout: 10000 }).then((url) => {
      cy.logTerminal(`   ✓ Navigated to edit-profile page`);
      cy.logTerminal(`   ✓ Current URL: ${url}`);
    });
    
    cy.contains('Edit profile', { timeout: 10000 }).should('be.visible');
    cy.logTerminal('   ✓ "Edit profile" title visible');

    // Verify user info is displayed on edit page
    cy.get('body').should('contain.text', 'Ochko228');
    cy.logTerminal('   ✓ Username displayed on edit page');

    // Verify Edit photo button is available
    cy.contains('Edit photo', { timeout: 10000 }).should('be.visible');
    cy.logTerminal('   ✓ "Edit photo" button visible');

    cy.logTerminal('🎉 TEST 3 PASSED: Profile navigation successful');
    cy.logTerminal('   • Settings page accessed via avatar click');
    cy.logTerminal('   • User profile data displayed');
    cy.logTerminal('   • Avatar image loaded');
    cy.logTerminal('   • Edit profile page accessible');
  });
});

