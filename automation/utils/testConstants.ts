export class TestConstants {
  static readonly DEFAULT_PASSWORD = 'MyFunc7!Test2';

  static readonly STRIPE_CARDS = {
    VALID: '4242424242424242',
    DECLINED: '4000000000000002',
    INSUFFICIENT_FUNDS: '4000000000009995',
    PROCESSING_ERROR: '4000000000000119'
  };

  static readonly PAYMENT = {
    VALID: {
      cardNumber: '4242424242424242',
      expiration: '12 / 28',
      cvc: '123',
      zip: '10001'
    },
    DECLINED: {
      cardNumber: '4000000000000002',
      expiration: '12 / 28',
      cvc: '123',
      zip: '10001'
    }
  };

  static readonly LOCATIONS = {
    FLORIDA_AVENTURA: {
      state: 'Florida',
      name: 'Aventura',
      fullAddress: 'Aventura20803 Biscayne Blvd, STE 103, Aventura, FL'
    }
  };

  static readonly SCAN_DATA = {
    ADULT_MALE: {
      dob: '01-01-2000',
      sex: 'Male' as const
    },
    ADULT_FEMALE: {
      dob: '01-01-1995',
      sex: 'Female' as const
    }
  };

  static getTimesForDay(day: 'M' | 'W' | 'F' | 'S') {
    const mapping = {
      'M': this.SCHEDULE.MONDAY_SLOTS.times,
      'W': this.SCHEDULE.WEDNESDAY_SLOTS.times,
      'F': this.SCHEDULE.FRIDAY_SLOTS.times,
      'S': this.SCHEDULE.SATURDAY_SLOTS.times
    };
    return mapping[day];
  }

  static readonly SCHEDULE = {
    MONDAY_SLOTS: {
      dayNumber: '3',
      times: [
        { time: '7:30 AM', index: 1, needsAcknowledge: true },
        { time: '8:00 AM', index: 1 },
        { time: '8:30 AM', index: 1 }
      ]
    },
    WEDNESDAY_SLOTS: {
      dayNumber: '5',
      times: [
        { time: '9:34 AM', index: 1, needsAcknowledge: true },
        { time: '10:04 AM', index: 1 },
        { time: '10:34 AM', index: 1 }
      ]
    },
    FRIDAY_SLOTS: {
      dayNumber: '7',
      times: [
        { time: '5:03 AM', index: 1, needsAcknowledge: true },
        { time: '5:33 AM', index: 1 },
        { time: '6:03 AM', index: 1 }
      ]
    },
    SATURDAY_SLOTS: {
      dayNumber: '8',
      times: [
        { time: '9:34 AM', index: 1, needsAcknowledge: true },
        { time: '10:04 AM', index: 1 },
        { time: '10:34 AM', index: 1 }
      ]
    }
  };

  static readonly URLS = {
    BASE: 'https://myezra-staging.ezra.com',
    DASHBOARD: 'https://myezra-staging.ezra.com/dashboard',
    CONFIRMATION: 'https://myezra-staging.ezra.com/sign-up/scan-confirm'
  };
}

