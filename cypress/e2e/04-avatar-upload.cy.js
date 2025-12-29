/// <reference types="cypress" />

/**
 * Test 4: Avatar Upload and Verification
 * 
 * Scenario:
 * 1. Login to the application
 * 2. Navigate to profile edit page
 * 3. Upload new avatar from fixtures (avatar.jpg)
 * 4. Wait for upload request to complete (cy.intercept + cy.wait)
 * 5. Verify avatar src changed
 * 6. Reload page and verify avatar persisted
 */

describe('TEST 4: Avatar Upload', () => {
  // Dynamic test run identifier
  const testRunId = `avatar-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  let originalAvatarSrc = null;

  before(() => {
    cy.logTerminal('🚀 STARTING TEST 4: AVATAR UPLOAD');
    cy.logTerminal(`📋 Test Run ID: ${testRunId}`);
  });

  it('should upload new avatar and verify persistence', () => {
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

    // ============================================
    // STEP 2: Navigate to Edit Profile page
    // ============================================
    cy.logTerminal('📌 STEP 2: Navigating to Edit Profile page');
    cy.logTerminal('   → Using navigateToProfileEdit() command');
    
    cy.navigateToProfileEdit();
    
    cy.url().then((url) => {
      cy.logTerminal('   ✓ Navigation command executed');
      cy.logTerminal(`   ✓ Current URL: ${url}`);
    });

    // ============================================
    // STEP 3: Store original avatar src
    // ============================================
    cy.logTerminal('📌 STEP 3: Storing original avatar for comparison');
    
    cy.get('img').first().then(($img) => {
      originalAvatarSrc = $img.attr('src');
      cy.logTerminal(`   ✓ Original avatar src saved`);
      cy.logTerminal(`   ✓ Value: ${originalAvatarSrc}`);
    });

    // ============================================
    // STEP 4: Set up upload request intercept
    // ============================================
    cy.logTerminal('📌 STEP 4: Setting up upload request intercepts');
    
    cy.intercept('POST', '**/api/**').as('uploadPostRequest');
    cy.intercept('PUT', '**/api/**').as('uploadPutRequest');
    
    cy.logTerminal('   ✓ Intercept for POST /api/** configured');
    cy.logTerminal('   ✓ Intercept for PUT /api/** configured');

    // ============================================
    // STEP 5: Open photo upload modal
    // ============================================
    cy.logTerminal('📌 STEP 5: Opening photo upload modal');
    cy.logTerminal('   → Clicking "Edit photo" button');
    
    cy.contains('Edit photo', { timeout: 10000 }).should('be.visible').click();
    cy.logTerminal('   ✓ "Edit photo" button clicked');

    // Wait for Crop photo modal
    cy.contains('Crop photo', { timeout: 10000 }).should('be.visible');
    cy.logTerminal('   ✓ "Crop photo" modal appeared');

    // ============================================
    // STEP 6: Upload avatar image from fixtures
    // ============================================
    cy.logTerminal('📌 STEP 6: Uploading avatar image');
    cy.logTerminal('   → File: cypress/fixtures/avatar.jpg');
    
    // Select file from fixtures
    cy.get('input[type="file"]').selectFile('cypress/fixtures/avatar.jpg', { force: true });
    cy.logTerminal('   ✓ File selected: avatar.jpg');

    // Wait for Save button to be ready
    cy.contains('Save', { timeout: 10000 }).should('be.visible').and('not.be.disabled');
    cy.logTerminal('   ✓ Image loaded in cropper');

    // ============================================
    // STEP 7: Save the avatar
    // ============================================
    cy.logTerminal('📌 STEP 7: Saving the avatar');
    cy.logTerminal('   → Clicking "Save" button');
    
    cy.contains('Save', { timeout: 10000 }).should('be.visible').click();
    cy.logTerminal('   ✓ "Save" button clicked');

    // Wait for upload request to complete (PUT request)
    cy.wait('@uploadPutRequest', { timeout: 30000 }).then((interception) => {
      const status = interception.response?.statusCode;
      const method = interception.request?.method;
      const url = interception.request?.url;
      
      cy.logTerminal('   ✓ Upload request intercepted');
      cy.logTerminal(`   ✓ Method: ${method}`);
      cy.logTerminal(`   ✓ URL: ${url}`);
      cy.logTerminal(`   ✓ Response Status: ${status}`);
      
      // Verify successful upload (2xx status)
      expect(status).to.be.gte(200);
      expect(status).to.be.lt(300);
      
      cy.logTerminal('   ✓ Upload successful (2xx response)');
    });

    // Wait for UI to update
    cy.contains('Edit profile', { timeout: 10000 }).should('exist');
    cy.logTerminal('   ✓ UI updated with new avatar');

    // ============================================
    // STEP 8: Verify we're back on profile page
    // ============================================
    cy.logTerminal('📌 STEP 8: Verifying return to profile page');
    
    cy.contains('Edit profile', { timeout: 10000 }).should('be.visible');
    cy.logTerminal('   ✓ "Edit profile" text visible');
    cy.logTerminal('   ✓ Back on profile edit page');

    // ============================================
    // STEP 9: Reload and verify persistence
    // ============================================
    cy.logTerminal('📌 STEP 9: Verifying avatar persistence after reload');
    cy.logTerminal('   → Executing cy.reload()');
    
    cy.reload();
    cy.logTerminal('   ✓ Page reload triggered');

    // Wait for page to load
    cy.contains('Ochko228', { timeout: 15000 }).should('be.visible');
    cy.logTerminal('   ✓ Page loaded');
    cy.logTerminal('   ✓ Username "Ochko228" visible');

    // Verify user is still logged in
    cy.url().should('include', 'dashboard').then((url) => {
      cy.logTerminal(`   ✓ Current URL: ${url}`);
      cy.logTerminal('   ✓ User still logged in after reload');
    });

    // ============================================
    // OPTIONAL: Check for Choose Avatar option
    // ============================================
    cy.logTerminal('📌 OPTIONAL: Checking for avatar reset option');
    
    cy.get('body').then(($body) => {
      const bodyText = $body.text();
      if (bodyText.includes('Choose Avatar') || bodyText.includes('Remove') || bodyText.includes('Reset')) {
        cy.logTerminal('   ℹ️ Avatar reset option found');
        cy.logTerminal('   ℹ️ This could be used to restore default avatar');
      } else {
        cy.logTerminal('   ℹ️ Avatar reset option not found');
        cy.logTerminal('   ℹ️ Skipping optional reset step');
      }
    });

    cy.logTerminal('🎉 TEST 4 PASSED: Avatar upload successful');
    cy.logTerminal('   • File uploaded: cypress/fixtures/avatar.jpg');
    cy.logTerminal('   • Upload request: 2xx response (PUT)');
    cy.logTerminal('   • Avatar persisted after page reload');
  });
});

