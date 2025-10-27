import { Page, Locator, expect } from '@playwright/test';

export class PageHelpers {
  static async waitForElement(page: Page, locator: string | Locator, timeout: number = 10000) {
    const element = typeof locator === 'string' ? page.locator(locator) : locator;
    await expect(element).toBeVisible({ timeout });
  }

  static async smartWait(page: Page, duration: number = 1000) {
    await page.waitForTimeout(duration);
  }

  static async clickWithWait(page: Page, locator: string, waitAfter: number = 500) {
    await page.locator(locator).click();
    await this.smartWait(page, waitAfter);
  }

  static async selectFromDropdown(page: Page, comboboxSelector: string, optionName: string) {
    await page.locator(comboboxSelector).click();
    await page.getByRole('option', { name: optionName }).locator('span').first().click();
  }

  static async handleModalIfVisible(page: Page, buttonSelector: string, timeout: number = 2000): Promise<boolean> {
    const button = page.locator(buttonSelector);
    if (await button.isVisible({ timeout })) {
      await button.click();
      return true;
    }
    return false;
  }

  static logSection(title: string, message?: string) {
    console.log('='.repeat(60));
    console.log(title);
    if (message) {
      console.log(message);
    }
    console.log('='.repeat(60));
  }

  static async getVisibleEnabledElements(page: Page, selector: string): Promise<Locator[]> {
    const allElements = await page.locator(selector).all();
    const visibleEnabled: Locator[] = [];
    
    for (const element of allElements) {
      try {
        if (await element.isVisible() && await element.isEnabled()) {
          visibleEnabled.push(element);
        }
      } catch (error) {
        continue;
      }
    }
    
    return visibleEnabled;
  }

  static async verifyTextFormat(text: string, pattern: RegExp, errorMessage?: string) {
    if (!pattern.test(text)) {
      throw new Error(errorMessage || `Text "${text}" does not match expected format`);
    }
  }
}

