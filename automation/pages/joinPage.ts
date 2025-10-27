import { Page, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { TestConstants } from '../utils/testConstants';

export class JoinPage extends BasePage {
  private readonly joinLink = 'a:has-text("Join")';
  private readonly firstNameInput = 'input#firstName';
  private readonly lastNameInput = 'input#lastName';
  private readonly emailInput = 'input#email';
  private readonly phoneInput = 'input#phoneNumber';
  private readonly passwordInput = 'input#password';
  private readonly termsCheckbox = 'button.checkbox:has-text("I agree to Ezra\'s terms of")';
  private readonly submitButton = 'button[type="submit"]';
  private readonly selectScanHeading = 'h4:has-text("Select your Scan")';

  constructor(page: Page) {
    super(page);
  }

  async navigateToJoin() {
    await this.page.goto(TestConstants.URLS.BASE);
    await this.page.locator(this.joinLink).first().click();
  }

  async fillFirstName(firstName: string) {
    await this.page.locator(this.firstNameInput).fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.page.locator(this.lastNameInput).fill(lastName);
  }

  async fillEmail(email: string) {
    await this.page.locator(this.emailInput).fill(email);
  }

  async fillPhoneNumber(phone: string) {
    await this.page.locator(this.phoneInput).fill(phone);
  }

  async fillPassword(password: string) {
    await this.page.locator(this.passwordInput).fill(password);
  }

  async acceptTerms() {
    await this.page.locator(this.termsCheckbox).first().click();
  }

  async clickSubmit() {
    await this.page.locator(this.submitButton).click();
  }

  async completeRegistration(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    console.log('[Registration] User Data:', {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      phone: userData.phone,
      password: userData.password
    });
    
    await this.fillFirstName(userData.firstName);
    await this.fillLastName(userData.lastName);
    await this.fillEmail(userData.email);
    await this.fillPhoneNumber(userData.phone);
    await this.fillPassword(userData.password);
    await this.acceptTerms();
    await this.clickSubmit();
  }

  async verifySelectScanPageLoaded() {
    await expect(this.page.locator(this.selectScanHeading)).toBeVisible();
  }
}
