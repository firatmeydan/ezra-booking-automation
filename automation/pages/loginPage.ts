import { Page } from '@playwright/test';
import { BasePage } from './basePage';
import { PageHelpers } from '../utils/pageHelpers';

export class LoginPage extends BasePage {
  private readonly emailInput = 'input#email[type="email"]';
  private readonly passwordInput = 'input#password[type="password"]';
  private readonly submitButton = 'button.submit-btn';

  constructor(page: Page) {
    super(page);
  }

  async fillEmail(email: string) {
    await this.page.locator(this.emailInput).fill(email);
  }

  async fillPassword(password: string) {
    await this.page.locator(this.passwordInput).fill(password);
  }

  async clickSubmit() {
    await this.page.locator(this.submitButton).filter({ hasText: 'Submit' }).click();
  }

  async login(email: string, password: string) {
    console.log(`[Login] Email: ${email}`);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSubmit();
    await PageHelpers.smartWait(this.page, 3000);
  }

  async navigateToLogin(baseUrl: string) {
    await this.page.goto(baseUrl);
    await PageHelpers.smartWait(this.page, 2000);
  }
}

