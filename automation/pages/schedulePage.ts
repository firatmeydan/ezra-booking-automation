import { Page, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { DatePickerHelper } from '../utils/datePickerHelper';
import { PageHelpers } from '../utils/pageHelpers';

export class SchedulePage extends BasePage {
  private readonly stateFiltersText = 'text=StateAll AvailableAll';
  private readonly findCentersButton = 'button:has-text("Find closest centers to me")';
  private readonly stateCombobox = '[role="combobox"]';
  private readonly datepicker = '.datepicker';
  private readonly timeConflictModal = 'button:has-text("I understand")';
  private readonly continueButton = '[data-test="submit"]';

  constructor(page: Page) {
    super(page);
  }

  async verifySchedulePageElements() {
    await expect(this.page.locator(this.stateFiltersText)).toBeVisible();
    await expect(this.page.locator(this.findCentersButton)).toBeVisible();
  }

  async selectState(state: string) {
    await PageHelpers.selectFromDropdown(this.page, this.stateCombobox, state);
  }

  async selectLocation() {
    const card = this.page.locator('.location-card', { hasText: 'Aventura' });
    await PageHelpers.smartWait(this.page, 300);
    await card.click();
  }

  async verifyDatePickerVisible() {
    await expect(this.page.locator(this.datepicker)).toBeVisible();
  }

  async navigateToNextMonth() {
    await this.page.locator('button.trigger-btn').click();
    const nextMonthName = DatePickerHelper.getNextMonthName();
    await this.page.locator(`.vuecal__cell-content[aria-label="${nextMonthName}"]`).first().click();
  }

  async selectFirstAvailableDate(skipDates: number[] = []): Promise<{ day: string; dateNumber: number }> {
    return await DatePickerHelper.selectFirstAvailableDate(this.page, skipDates);
  }

  async acknowledgeTimeConflict() {
    await PageHelpers.handleModalIfVisible(this.page, this.timeConflictModal);
  }

  async countAvailableTimeSlots(): Promise<number> {
    await PageHelpers.smartWait(this.page, 1000);
    const timeSlotPattern = /\d{1,2}:\d{2}\s*(AM|PM)/;
    const availableElements = await PageHelpers.getVisibleEnabledElements(
      this.page, 
      'label, button'
    );
    
    return availableElements.filter(async el => {
      const text = await el.textContent();
      return text && timeSlotPattern.test(text);
    }).length;
  }

  async selectAvailableTimeSlots(numberOfSlots: number = 3) {
    await PageHelpers.smartWait(this.page, 1000);
    const timeSlotPattern = /\d{1,2}:\d{2}\s*(AM|PM)/;
    const allTimeElements = await this.page.locator('label, button').filter({ 
      hasText: timeSlotPattern 
    }).all();

    let selectedCount = 0;
    const selectedTimes: string[] = [];
    
    for (const element of allTimeElements) {
      if (selectedCount >= numberOfSlots) break;
      
      try {
        if (await element.isVisible() && await element.isEnabled()) {
          const timeText = await element.textContent();
          await element.click();
          selectedCount++;
          selectedTimes.push(timeText?.trim() || '');
          
          if (selectedCount === 1) {
            await this.acknowledgeTimeConflict();
          }
          
          await PageHelpers.smartWait(this.page, 500);
        }
      } catch (error) {
        continue;
      }
    }

    if (selectedCount < numberOfSlots) {
      throw new Error(`Only found ${selectedCount} available time slots, needed ${numberOfSlots}`);
    }
    
    console.log(`[Schedule] Selected ${selectedCount} time slots:`, selectedTimes);
  }

  async clickContinue() {
    await this.page.locator(this.continueButton).click();
  }

  async completeScheduling(state: string, location: string, numberOfTimeSlots: number = 3) {
    console.log(`[Schedule] Location: ${state}, ${location}`);
    await this.selectState(state);
    await this.selectLocation();
    await PageHelpers.smartWait(this.page, 2000);
    await this.verifyDatePickerVisible();
    await this.navigateToNextMonth();
    
    const triedDates: number[] = [];
    const maxAttempts = 10;
    let slotsSelected = false;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const selectedDate = await this.selectFirstAvailableDate(triedDates);
        const { day, dateNumber } = selectedDate;
        triedDates.push(dateNumber);
        
        console.log(`[Schedule] Attempt ${attempt}: Trying ${day} ${dateNumber}`);
        await PageHelpers.smartWait(this.page, 1000);
        const availableSlots = await this.countAvailableTimeSlots();
        
        if (availableSlots >= numberOfTimeSlots) {
          console.log(`[Schedule] Found ${availableSlots} available slots on ${day} ${dateNumber}`);
          await this.selectAvailableTimeSlots(numberOfTimeSlots);
          slotsSelected = true;
          break;
        } else {
          console.log(`[Schedule] Only ${availableSlots} slots available, need ${numberOfTimeSlots}. Trying next date...`);
        }
      } catch (error) {
        if (attempt === maxAttempts) {
          throw new Error(
            `Could not find a date with ${numberOfTimeSlots} available slots after ${maxAttempts} attempts. ` +
            `Tried dates: ${triedDates.join(', ')}`
          );
        }
      }
    }
    
    if (!slotsSelected) {
      throw new Error(`Failed to select ${numberOfTimeSlots} time slots after trying ${triedDates.length} dates`);
    }
    
    await this.clickContinue();
  }
}
