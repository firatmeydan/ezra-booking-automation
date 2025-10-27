import { Page, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { PageHelpers } from '../utils/pageHelpers';

export class DashboardPage extends BasePage {
  private readonly appointmentCard = '.card:has-text("MRI Scan")';
  private readonly appointmentTitle = 'p.h4:has-text("MRI Scan")';
  private readonly medicalQuestionnaireText = 'text=Medical Questionnaire';

  constructor(page: Page) {
    super(page);
  }

  async confirmTimezone() {
    await PageHelpers.smartWait(this.page, 1000);
    await expect(this.page.getByRole('heading', { name: 'Confirm your time zone' })).toBeVisible({ timeout: 10000 });
    console.log('[Dashboard] Confirming timezone');
    await this.page.locator('button.yellow').filter({ hasText: 'Confirm' }).click();
    await PageHelpers.smartWait(this.page, 1000);
  }

  async verifyAppointmentCardVisible() {
    await PageHelpers.smartWait(this.page, 3000);
    
    await expect(this.page.locator(this.appointmentCard)).toBeVisible({ timeout: 10000 });
    await expect(this.page.locator(this.appointmentTitle)).toBeVisible();
    
    const appointmentText = this.page.locator('.card:has-text("MRI Scan") p:has-text("Scheduled on")');
    await expect(appointmentText).toBeVisible();
    
    const details = await appointmentText.textContent();
    console.log(`[Dashboard] Appointment verified: ${details?.trim()}`);
    
    await expect(appointmentText).toContainText('Scheduled on');
    await expect(appointmentText).toContainText('EST at');
    await expect(appointmentText).toContainText('Aventura');
    await expect(this.page.getByText(/Your scan date is pending confirmation/)).toBeVisible();
  }

  async verifyMedicalQuestionnaireTaskVisible() {
    await expect(this.page.locator(this.medicalQuestionnaireText)).toBeVisible({ timeout: 10000 });
  }
}
