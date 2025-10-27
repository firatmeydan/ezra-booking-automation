import { Page, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { PageHelpers } from '../utils/pageHelpers';

export class SelectScanPage extends BasePage {
  private readonly mriScanText = 'text=MRI Scan Available at $';
  private readonly spineScanText = 'text=MRI Scan with Spine Available at $';
  private readonly skeletalScanText = 'text=MRI Scan with Skeletal and Neurological Assessment Available at $';
  private readonly acceptAgeButton = 'button:has-text("Accept")';
  private readonly dobText = 'text=Date of birth (MM-DD-YYYY)';
  private readonly dobInput = 'input#dob';
  private readonly sexText = 'text=What was your sex at birth?';
  private readonly sexCombobox = '[role="combobox"]';
  private readonly continueButton = '[data-test="submit"]';
  private readonly scheduleHeading = 'h4:has-text("Schedule your scan")';
  private readonly scheduleSubText = 'text=Select a location, date and';

  constructor(page: Page) {
    super(page);
  }

  async verifyScanOptionsVisible() {
    await expect(this.page.locator(this.mriScanText).nth(1)).toBeVisible();
    await expect(this.page.locator(this.spineScanText).first()).toBeVisible();
    await expect(this.page.locator(this.skeletalScanText).nth(1)).toBeVisible();
  }

  async clickAcceptAge() {
    await this.page.locator(this.acceptAgeButton).click();
  }

  async verifyDOBFieldVisible() {
    await expect(this.page.locator(this.dobText)).toBeVisible();
    await expect(this.page.locator(this.dobInput)).toBeVisible();
  }

  async verifySexAtBirthVisible() {
    await expect(this.page.locator(this.sexText)).toBeVisible();
  }

  async fillDateOfBirth(dob: string) {
    await this.page.locator(this.dobInput).click();
    await this.page.locator(this.dobInput).fill(dob);
  }

  async selectSexAtBirth(sex: 'Male' | 'Female') {
    await PageHelpers.selectFromDropdown(this.page, this.sexCombobox, sex);
  }

  async selectMRIScan() {
    await this.page.locator(this.mriScanText).nth(1).click();
  }

  async clickContinue() {
    await this.page.locator(this.continueButton).click();
  }

  async completeScanSelection(dob: string, sex: 'Male' | 'Female') {
    await this.fillDateOfBirth(dob);
    await this.selectSexAtBirth(sex);
    await this.selectMRIScan();
    await this.clickContinue();
  }

  async verifySchedulePageLoaded() {
    await expect(this.page.locator(this.scheduleHeading)).toBeVisible();
    await expect(this.page.locator(this.scheduleSubText)).toBeVisible();
  }
}
