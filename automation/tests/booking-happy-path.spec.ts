import { test, expect } from '@playwright/test';
import { JoinPage } from '../pages/joinPage';
import { SelectScanPage } from '../pages/selectScanPage';
import { SchedulePage } from '../pages/schedulePage';
import { PaymentPage } from '../pages/paymentPage';
import { ConfirmationPage } from '../pages/confirmationPage';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import { TestDataGenerator } from '../utils/testDataGenerator';
import { TestConstants } from '../utils/testConstants';

test.describe('Booking Flow - Happy Path', () => {

  test('TC-01: End to end happy path through booking', async ({ browser }) => {
    // Create a new browser context for the booking flow
    const context = await browser.newContext();
    const page = await context.newPage();
    // Generate unique test data for this test run
    const userData = TestDataGenerator.getRandomUserData();

    // Step 1: Join/Sign up
    const joinPage = new JoinPage(page);
    await joinPage.navigateToJoin();
    await joinPage.completeRegistration(userData);
    await joinPage.verifySelectScanPageLoaded();

    // Step 2: Select Scan
    const selectScanPage = new SelectScanPage(page);
    await selectScanPage.verifyScanOptionsVisible();
    await selectScanPage.clickAcceptAge();
    await selectScanPage.verifyDOBFieldVisible();
    await selectScanPage.verifySexAtBirthVisible();
    await selectScanPage.completeScanSelection(
      TestConstants.SCAN_DATA.ADULT_MALE.dob,
      TestConstants.SCAN_DATA.ADULT_MALE.sex
    );
    await selectScanPage.verifySchedulePageLoaded();

    // Step 3: Schedule - Dynamically selects first 3 available time slots
    const schedulePage = new SchedulePage(page);
    await schedulePage.verifySchedulePageElements();
    await schedulePage.completeScheduling(
      TestConstants.LOCATIONS.FLORIDA_AVENTURA.state,
      TestConstants.LOCATIONS.FLORIDA_AVENTURA.name,
      3 // Number of time slots to select
    );

    // Step 4: Payment
    const paymentPage = new PaymentPage(page);
    await paymentPage.completePayment(TestConstants.PAYMENT.VALID);

    // Step 5: Wait for automatic redirect to confirmation page
    console.log('Waiting for redirect to confirmation page...');
    await page.waitForURL(/scan-confirm/, { timeout: 30000 });
    console.log(`Redirected to: ${page.url()}`);
    const confirmationPage = new ConfirmationPage(page);
    await confirmationPage.verifyConfirmationPage();
    await confirmationPage.verifyAppointmentDetails(TestConstants.LOCATIONS.FLORIDA_AVENTURA.name);
    
    // Verify all 3 requested time slots are displayed correctly
    await confirmationPage.verifyRequestedTimeSlots(3);
    
    console.log('\n✓ Confirmation page validated successfully!');
    
    // Close the browser to end the booking session
    console.log('\nClosing browser after confirmation...');
    await context.close();
    
    // Step 6: Dashboard Verification - Reopen browser and login to verify appointment persists
    console.log('\n--- Step 6: Dashboard Verification ---');
    console.log('Reopening browser for dashboard validation...');
    
    // Create a new browser context for dashboard validation
    const dashboardContext = await browser.newContext();
    const dashboardPage_new = await dashboardContext.newPage();
    
    // Login with the same credentials
    const loginPage = new LoginPage(dashboardPage_new);
    await loginPage.navigateToLogin(TestConstants.URLS.BASE);
    await loginPage.login(userData.email, userData.password);
    
    // Handle timezone confirmation modal
    const dashboardPage = new DashboardPage(dashboardPage_new);
    await dashboardPage.confirmTimezone();
    
    // Verify appointment card is visible on dashboard
    await dashboardPage.verifyAppointmentCardVisible();
    
    console.log('\n✓ Happy path with dashboard validation completed successfully!');
    
    // Close the dashboard browser context
    await dashboardContext.close();
  });
});
