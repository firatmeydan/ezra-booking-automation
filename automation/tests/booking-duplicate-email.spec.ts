import { test, expect } from '@playwright/test';
import { JoinPage } from '../pages/joinPage';
import { TestDataGenerator } from '../utils/testDataGenerator';

test.describe('Booking Flow - Duplicate Email Prevention', () => {

  test('TC-03: Blocking duplicate email at sign up', async ({ browser }) => {
    const userData = TestDataGenerator.getRandomUserData();

    // Step 1: First registration - should succeed
    console.log('\n--- Step 1: First Registration (Should Succeed) ---');
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    
    const joinPage1 = new JoinPage(page1);
    await joinPage1.navigateToJoin();
    await joinPage1.completeRegistration(userData);
    await joinPage1.verifySelectScanPageLoaded();
    console.log('[Test] First registration successful');
    
    // Close the first browser context (logs user out completely)
    await context1.close();
    console.log('[Test] Signed out (closed browser context)');

    // Step 2: Try to register again with the same email - should fail
    console.log('\n--- Step 2: Duplicate Email Registration (Should Fail) ---');
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    
    const joinPage2 = new JoinPage(page2);
    await joinPage2.navigateToJoin();
    
    // Generate different user data but keep the same email
    const duplicateAttempt = TestDataGenerator.getRandomUserData();
    duplicateAttempt.email = userData.email; // Same email as first registration
    
    console.log('[Test] Attempting duplicate email with different details:');
    console.log(`  - Original name: ${userData.firstName} ${userData.lastName}`);
    console.log(`  - New name: ${duplicateAttempt.firstName} ${duplicateAttempt.lastName}`);
    console.log(`  - Same email: ${duplicateAttempt.email}`);
    
    // Try to register with the same email but different name/phone
    await joinPage2.fillFirstName(duplicateAttempt.firstName);
    await joinPage2.fillLastName(duplicateAttempt.lastName);
    await joinPage2.fillEmail(duplicateAttempt.email);
    await joinPage2.fillPhoneNumber(duplicateAttempt.phone);
    await joinPage2.fillPassword(duplicateAttempt.password);
    await joinPage2.acceptTerms();
    await joinPage2.clickSubmit();

    // Verify error message appears for duplicate email
    await expect(page2.getByText(/If you have previously created an account try logging in instead/i)).toBeVisible({ timeout: 10000 });
    console.log('[Test] ✓ Duplicate email properly blocked with error message');

    // Verify we're still on the join page, not advanced to select scan
    await expect(page2).toHaveURL(/join/i);
    console.log('[Test] ✓ User stayed on join page (did not advance)');

    // Close the second browser context
    await context2.close();

    // Step 3: Try with same phone but different email (known to be allowed)
    console.log('\n--- Step 3: Same Phone, Different Email (Known Issue) ---');
    const context3 = await browser.newContext();
    const page3 = await context3.newPage();
    
    const newUserData = TestDataGenerator.getRandomUserData();
    newUserData.phone = userData.phone; // Keep same phone
    
    console.log(`[Test] Attempting registration with:`);
    console.log(`  - Same phone: ${userData.phone}`);
    console.log(`  - New email: ${newUserData.email}`);
    
    const joinPage3 = new JoinPage(page3);
    await joinPage3.navigateToJoin();
    await joinPage3.completeRegistration(newUserData);
    
    // Verify it allows registration (this is the current behavior, but a gap)
    await joinPage3.verifySelectScanPageLoaded();
    console.log('[Test] ✓ Same phone with different email was allowed (as expected)');
    console.log('[Test] ⚠️  NOTE: This creates potential data duplicates - should be flagged to team for validation tightening');

    // Close the third browser context
    await context3.close();

    console.log('\n✓ Duplicate email prevention test completed');
  });
});

