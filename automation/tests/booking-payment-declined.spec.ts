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

test.describe('Booking Flow - Payment Declined', () => {

  test('TC-02: Handling a declined payment properly', async ({ browser }) => {
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
    await paymentPage.completePayment(TestConstants.PAYMENT.DECLINED);

    // Step 5: Verify payment error and no appointment created
    // User should see an error message and remain on payment page
    await expect(page.getByText(/declined|error|failed/i)).toBeVisible({ timeout: 10000 });

    // Verify we're still on the payment page, not redirected to confirmation
    await expect(page).toHaveURL(/reserve|payment/i);

    // Navigate to dashboard and verify no appointment card exists
    await page.goto(TestConstants.URLS.DASHBOARD);
    const dashboardPage = new DashboardPage(page);

    // The appointment card should NOT be visible since payment failed
    await expect(page.locator('.appointment-cards > div:nth-child(2)')).not.toBeVisible({ timeout: 5000 });
  });
});
