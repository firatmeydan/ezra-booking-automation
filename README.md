# FunctionHealth - Ezra QA Automation Engineer Assessment

This repository contains my complete submission for the Ezra QA Automation Engineer assessment. It includes test case design, security analysis, and production-ready test automation.

## Assessment Overview

This submission covers all three questions from the assessment:

### Question 1: Booking Flow Test Cases
- **15 prioritized test cases** for the booking flow (ranked most to least important)
- **Deep rationale** for the top 3 test cases
- **Location**: [`docs/question1/`](docs/question1/)

### Question 2: Privacy & Security Testing
- **Integration test case** preventing access to other members' medical data
- **HTTP requests** implementing the test case (no Postman needed)
- **Security strategy** for managing 100+ endpoints with sensitive data
- **Location**: [`docs/question2/`](docs/question2/)

### Automation: Top 3 Test Cases Automated
Three high-priority test cases automated with Playwright + TypeScript:

1. **TC-01: Happy Path** - Full end-to-end booking with payment and dashboard verification
2. **TC-02: Payment Declined** - Ensures failed payments don't create phantom appointments
3. **TC-03: Duplicate Email Prevention** - Blocks duplicate accounts and documents data quality gaps

**Location**: [`automation/`](automation/)

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

## Complete Documentation

### Assessment Questions
- **[Question 1: Test Case Design](docs/question1/)** - 15 prioritized booking flow test cases with detailed rationale
- **[Question 2: Privacy & Security](docs/question2/)** - Integration test, HTTP requests, and security strategy

### Automation
- **[Automation Guide](automation/README.md)** - Complete setup, architecture, trade-offs, and future roadmap
- Production-ready code with Page Object Model and helper utilities

## Tech Stack

- **Playwright** - Browser automation and testing framework
- **TypeScript** - Type-safe test code
- **Faker.js** - Test data generation
- **Page Object Model** - Clean, maintainable test architecture

## Running Tests

```bash
# Run all tests (headless, parallel - recommended)
npx playwright test

# Run all tests in headed mode (see browser)
npx playwright test --headed

# Run specific test
npx playwright test booking-happy-path

# Run with debug mode
npx playwright test --debug

# View HTML test report
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

**Headless Mode (Default - Parallel Execution):**
- Full suite: **~45 seconds** (all 3 tests run in parallel)
- Uses 3 workers for maximum efficiency

**Headed Mode (Sequential):**
- TC-01 Happy Path: ~46 seconds
- TC-02 Payment Declined: ~28 seconds
- TC-03 Duplicate Email: ~21 seconds
- Total: ~1.5 minutes

## Contributing

Tests follow standard Playwright conventions. To add new tests:

1. Create page objects in `automation/pages/`
2. Add test specs in `automation/tests/`
3. Use `PageHelpers` for common operations
4. Log credentials for debugging

## Environment

Tests run against staging: `https://myezra-staging.ezra.com`

## What's Included

✅ **Question 1 - Complete**
- 15 test cases ranked by priority
- Top 3 explained with real-world reasoning
- Manual test documentation

✅ **Question 2 - Complete**  
- Privacy integration test case
- HTTP request specifications
- Security strategy with trade-offs

✅ **Automation - Complete**
- 3 automated tests (exceeds 2-3 requirement)
- Page Object Model architecture
- Trade-offs, assumptions, and scalability documented
- Production-level code quality

---

**Submitted by**: Firat Meydan  
**Assessment**: Ezra QA Automation Engineer  
**Tech Stack**: Playwright, TypeScript, Page Object Model, Faker.js

