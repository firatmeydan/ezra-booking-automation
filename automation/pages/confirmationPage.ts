import { Page, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { PageHelpers } from '../utils/pageHelpers';

export class ConfirmationPage extends BasePage {
  private readonly locationLabel = 'p.b4:has-text("Location")';
  private readonly dashboardLink = 'a[aria-label="Home"]';
  private readonly medicalQuestionnaireButton = 'button:has-text("Begin Medical Questionnaire")';

  constructor(page: Page) {
    super(page);
  }

  async verifyConfirmationPage() {
    await expect(this.page.getByRole('heading', { name: /Your requested time slots have been received/i })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'MRI Scan Appointment' })).toBeVisible();
  }

  async verifyAppointmentDetails(locationName: string) {
    await expect(this.page.locator(this.locationLabel)).toBeVisible();
    await expect(this.page.locator('p.b2', { hasText: locationName }).first()).toBeVisible();
  }

  async verifyRequestedTimeSlots(expectedCount: number = 3) {
    await expect(this.page.getByText('Requested Times')).toBeVisible();
    await expect(this.page.getByText('Appointment 1')).toBeVisible();
    
    const timeSlotItems = this.page.locator('.scan-details__row ul li');
    await expect(timeSlotItems).toHaveCount(expectedCount);
    
    const timeSlots = await timeSlotItems.allTextContents();
    const timeSlotPattern = /[A-Z][a-z]+\s+\d{1,2},\s+\d{4}\s+•\s+\d{1,2}:\d{2}\s+(AM|PM)\s+(EST|EDT)/;
    
    console.log(`[Confirmation] Verified ${timeSlots.length} requested time slots:`);
    timeSlots.forEach((slot, index) => {
      console.log(`  ${index + 1}. ${slot.trim()}`);
    });
    
    for (const slot of timeSlots) {
      await PageHelpers.verifyTextFormat(slot.trim(), timeSlotPattern);
    }
    
    return timeSlots;
  }

  async goToDashboard() {
    await this.page.locator(this.dashboardLink).click();
  }

  async beginMedicalQuestionnaire() {
    await this.page.locator(this.medicalQuestionnaireButton).click();
  }
}
