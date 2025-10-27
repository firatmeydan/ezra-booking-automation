import { Page } from '@playwright/test';

export class DatePickerHelper {
  static getNextMonthName(): string {
    const currentDate = new Date();
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[nextMonth.getMonth()];
  }

  static getMinimumDateNumber(): number {
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    return minDate.getDate();
  }

  static async selectFirstAvailableDate(page: Page, skipDates: number[] = []): Promise<{ day: string; dateNumber: number }> {
    const availableDays = ['M', 'W', 'F', 'S'];
    const minDateNumber = this.getMinimumDateNumber();
    const allCells = await page.locator('.vuecal__cell:not(.vuecal__cell--disabled):not(.vuecal__cell--out-of-scope):not(.vuecal__cell--before-min) .vc-day-content').all();
    
    for (const cell of allCells) {
      const dayText = await cell.locator('.eyebrow').textContent();
      const dateText = await cell.locator('.b3--bold').textContent();
      
      if (!dayText || !dateText) continue;
      
      const dateNumber = parseInt(dateText);
      
      if (skipDates.includes(dateNumber)) {
        continue;
      }
      
      if (availableDays.includes(dayText) && dateNumber >= minDateNumber) {
        await cell.click();
        return { day: dayText, dateNumber };
      }
    }
    
    throw new Error('No available dates found for M, W, F, or S that are at least 7 days from today');
  }
}

