# Ezra - Booking Flow Test Automation

This repository contains automated tests for Ezra's member booking flow, built with Playwright and TypeScript. The tests cover the critical revenue path from sign-up through payment confirmation.

## What's Tested

Three high-priority test cases that protect revenue and data quality:

1. **Happy Path** - Full end-to-end booking with payment and dashboard verification
2. **Payment Declined** - Ensures failed payments don't create phantom appointments
3. **Duplicate Email Prevention** - Blocks duplicate accounts and documents data quality gaps

## Quick Start

```bash
cd automation
npm install
npx playwright test --headed
```

## Project Structure

```
├── automation/                      # Main test automation project
│   ├── tests/                      # Test specifications
│   ├── pages/                      # Page Object Model classes
│   ├── utils/                      # Test utilities and helpers
│   ├── playwright.config.ts        # Playwright configuration
│   └── README.md                   # Detailed automation docs
└── docs/                           # Assessment documentation
    ├── question1/                  # Test case design
    └── question2/                  # Security test cases
```

## Documentation

- **[Automation Guide](automation/README.md)** - Complete setup, architecture, and test details
- **[Test Cases](docs/question1/)** - Manual test case documentation
- **[Security Testing](docs/question2/)** - Privacy and security test scenarios

## Tech Stack

- **Playwright** - Browser automation and testing framework
- **TypeScript** - Type-safe test code
- **Faker.js** - Test data generation
- **Page Object Model** - Clean, maintainable test architecture

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific test
npx playwright test booking-happy-path

# Run in headed mode (see the browser)
npx playwright test --headed

# View test report
npx playwright show-report
```

## Key Features

- ✅ Dynamic scheduling (handles booked time slots automatically)
- ✅ Parallel-safe test data generation
- ✅ Browser context isolation for clean test runs
- ✅ Debugging logs with credentials for manual reproduction
- ✅ Stripe test card handling
- ✅ Dashboard verification after booking

## Test Execution Times

- **TC-01 Happy Path**: ~46 seconds
- **TC-02 Payment Declined**: ~28 seconds
- **TC-03 Duplicate Email**: ~21 seconds

**Total runtime for full suite**: ~1.5 minutes

## Contributing

Tests follow standard Playwright conventions. To add new tests:

1. Create page objects in `automation/pages/`
2. Add test specs in `automation/tests/`
3. Use `PageHelpers` for common operations
4. Log credentials for debugging

## Environment

Tests run against staging: `https://myezra-staging.ezra.com`

## Author

Built as part of the Ezra QA Automation Engineer assessment.

