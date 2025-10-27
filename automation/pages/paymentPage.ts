import { Page, FrameLocator } from '@playwright/test';
import { BasePage } from './basePage';
import { PageHelpers } from '../utils/pageHelpers';

export class PaymentPage extends BasePage {
  private readonly submitButton = '[data-test="submit"]';
  private readonly stripeFrameSelector = 'iframe[title="Secure payment input frame"]:not([aria-hidden="true"])';
  private readonly cardNumberInput = 'input[name="number"]';
  private readonly expirationInput = 'input[name="expiry"]';
  private readonly cvcInput = 'input[name="cvc"]';
  private readonly zipInput = 'input[name="postalCode"]';

  constructor(page: Page) {
    super(page);
  }

  private getStripeFrame(): FrameLocator {
    return this.page.frameLocator(this.stripeFrameSelector);
  }

  async fillCardDetails(cardNumber: string, expiration: string, cvc: string, zip: string) {
    const stripeFrame = this.getStripeFrame();

    await stripeFrame.locator(this.cardNumberInput).click();
    await stripeFrame.locator(this.cardNumberInput).fill(cardNumber);
    await stripeFrame.locator(this.expirationInput).fill(expiration);
    await stripeFrame.locator(this.cvcInput).fill(cvc);
    await stripeFrame.locator(this.zipInput).click();
    await stripeFrame.locator(this.zipInput).fill(zip);
  }

  async submitPayment() {
    await this.page.locator(this.submitButton).click();
  }

  async completePayment(cardData: {
    cardNumber: string;
    expiration: string;
    cvc: string;
    zip: string;
  }) {
    console.log(`[Payment] Card: ${cardData.cardNumber} (Exp: ${cardData.expiration}, ZIP: ${cardData.zip})`);
    await this.fillCardDetails(cardData.cardNumber, cardData.expiration, cardData.cvc, cardData.zip);
    await this.submitPayment();
    await PageHelpers.smartWait(this.page, 1000);
  }
}
