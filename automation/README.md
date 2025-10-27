# Ezra Booking Flow - Test Automation

This project automates the top 3 critical test cases for Ezra's booking flow using Playwright and TypeScript. The tests cover the full revenue chain from sign-up through payment, ensuring the core business functionality works reliably.

## What's Automated

We've automated the three most important test cases that hit revenue, trust, and data quality:

1. **TC-01: Happy Path** - Full end-to-end booking with payment and dashboard verification
2. **TC-02: Payment Declined** - Ensures failed payments don't create ghost appointments
3. **TC-03: Duplicate Email Prevention** - Blocks duplicate accounts while documenting the phone gap

## Project Structure

```
automation/
├── package.json                    # Dependencies and scripts
├── playwright.config.ts            # Playwright configuration
├── README.md                       # This file
├── tests/                          # Test specifications
│   ├── booking-happy-path.spec.ts        # TC-01: Full booking flow
│   ├── booking-payment-declined.spec.ts  # TC-02: Declined payment handling
│   └── booking-duplicate-email.spec.ts   # TC-03: Duplicate prevention
├── pages/                          # Page Object classes
│   ├── basePage.ts                 # Base class with common functionality
│   ├── joinPage.ts                 # Sign-up/registration page
│   ├── selectScanPage.ts           # Scan selection page with DOB/sex
│   ├── schedulePage.ts             # Location and time scheduling page
│   ├── paymentPage.ts              # Stripe payment page
│   ├── confirmationPage.ts         # Booking confirmation page
│   ├── loginPage.ts                # Login page for dashboard verification
│   └── dashboardPage.ts            # Member dashboard page
└── utils/                          # Test utilities
    ├── pageHelpers.ts              # Reusable page interactions
    ├── datePickerHelper.ts         # Date picker logic
    ├── testDataGenerator.ts        # Random test data using Faker
    └── testConstants.ts            # Static test data (passwords, locations, cards)
```

## Architecture

### Page Object Model (POM)

Each page in the booking flow has its own class that handles all interactions with that page. This keeps tests clean and maintainable.

**What each page object has:**
- Locators as class variables (preferring ID attributes when available)
- Methods for user actions (click, fill, select)
- Methods for verifications (checking page loaded, content visible)
- Extends `BasePage` for common functionality

**Example:**
```typescript
export class JoinPage extends BasePage {
  private readonly emailInput = 'input#email';
  
  async fillEmail(email: string) {
    await this.page.locator(this.emailInput).fill(email);
  }
}
```

### Helper Utilities

**PageHelpers** - Reusable operations across all pages:
- `smartWait()` - Centralized waits instead of scattered timeouts
- `selectFromDropdown()` - Handles combobox selections consistently
- `handleModalIfVisible()` - Conditional modal handling
- `getVisibleEnabledElements()` - Filters interactive elements

**DatePickerHelper** - Date selection logic:
- `getNextMonthName()` - Calculates next month dynamically
- `selectFirstAvailableDate()` - Finds available M/W/F/S dates
- Handles 7-day minimum booking rule

These helpers keep the page objects clean and avoid duplicating common patterns.

### Test Data Strategy

**Random Data (Faker.js):**
We generate unique names, emails, and phone numbers for each test run. This prevents conflicts when tests run in parallel and gives more realistic coverage.

**Static Data (TestConstants):**
Things that shouldn't change - passwords, credit cards, locations, URLs - live in one central file.

**Why this matters:**
```typescript
// Without constants - scattered everywhere
const card = '4242424242424242';
const password = 'MyFunc7!Test2';

// With constants - change once, updates everywhere
await paymentPage.completePayment(TestConstants.PAYMENT.VALID);
```

**Debugging Support:**
All registration and login methods log credentials to console, so if a test fails you can manually reproduce it.

## Setup

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

```bash
cd automation
npm install
```

This installs:
- `@playwright/test` - Testing framework
- `@faker-js/faker` - Test data generation
- Playwright browsers (Chromium, Firefox, WebKit)

### Running Tests

```bash
# Run all tests (headless, parallel - default)
npx playwright test
# Takes ~45 seconds (3 tests run in parallel with 3 workers)

# Run all tests in headed mode (slower, sequential)
npx playwright test --headed

# Run specific test
npx playwright test booking-happy-path.spec.ts

# Run with debug mode (step through each action)
npx playwright test --debug

# View HTML report after test run
npx playwright show-report
```

**Performance:**
- **Headless (default)**: ~45 seconds for full suite (parallel execution)
- **Headed mode**: ~1.5 minutes for full suite (sequential execution)
- Playwright automatically runs tests in parallel using multiple workers for speed

## Test Cases

### TC-01: Happy Path - End to End Booking
**File**: `tests/booking-happy-path.spec.ts` | **Duration**: ~46 seconds (headed) | ~42 seconds (headless)

This is the most important test because it covers the full revenue chain. If any part breaks, bookings stop and that's the business gone.

**What it does:**
1. Creates a new user account with unique test data
2. Selects MRI scan ($499) with DOB and sex validation
3. Schedules at Florida Aventura location with 3 time slots
4. Completes payment with Stripe test card (4242...)
5. Verifies confirmation page shows all 3 requested times
6. Logs out and back in to verify appointment persists on dashboard

**Why it matters:** From experience at Signify Health, I've seen how one API glitch stopped a day's worth of member matches. This test catches if sign-up, plans, scheduling, and payment all connect properly in one go.

---

### TC-02: Payment Declined Handling
**File**: `tests/booking-payment-declined.spec.ts` | **Duration**: ~28-29 seconds

This test ensures declined payments stop everything cleanly without creating half-baked appointments.

**What it does:**
1. Completes sign-up, scan selection, and scheduling
2. Attempts payment with declined test card (4000 0000 0000 0002)
3. Verifies error message appears
4. Confirms user stays on payment page (doesn't advance)
5. Checks dashboard to ensure no appointment card exists

**Why it matters:** Payments are tricky. A decline should stop everything cleanly, no ghost appointments. From handling data at Signify, these mismatches meant support headaches cleaning up records. This protects trust so users don't show up thinking they booked.

---

### TC-03: Duplicate Email Prevention
**File**: `tests/booking-duplicate-email.spec.ts` | **Duration**: ~19-21 seconds

This test verifies duplicate email blocking while documenting a gap with phone validation.

**What it does:**
1. **First Registration**: Creates account successfully with unique data
2. **Duplicate Email Attempt**: Tries to register with same email but different name - properly blocked with message "If you have previously created an account try logging in instead"
3. **Same Phone Check**: Verifies same phone with different email is currently allowed (documents this as a data quality gap to flag to the team)

**Why it matters:** Duplicates fragment data and cause login messes, especially with PHI in health apps. This happened too often in testing at Signify/CVS. Catching it early with a nice message prevents bigger issues. Email is blocked properly, phone isn't - we flag that.

## Assumptions

These are things I assumed about the staging environment based on testing:

1. **Staging is stable enough** - Tests run against `https://myezra-staging.ezra.com` and I'm assuming it's not getting reset frequently or going down during test runs.

2. **No email verification needed** - I can create accounts without clicking verification links. If that changes, we'd need to integrate with an email testing service or use test hooks.

3. **Stripe test mode is on** - The test cards from Stripe docs work consistently (4242... for valid, 4000...0002 for declined).

4. **Florida locations stay available** - Specifically Aventura. If locations get removed or schedules change drastically, tests would need updating.

5. **Enough time slots exist** - The scheduling logic tries up to 10 dates to find 3 available slots. In a heavily used staging environment, this might not always work.

6. **Chromium-only for now** - Tests run on Chromium. Firefox and Safari would be added for full coverage, but Chromium catches most issues in my experience.

7. **No captchas or rate limiting** - I'm assuming staging doesn't have aggressive bot detection that would block automated signups.

8. **Stable network** - Tests expect reliable connectivity. In CI/CD, I'd add retry logic for flaky network conditions.

## Trade-offs

Here are the real decisions I made and why:

### 1. Random vs. Static Test Data

**What I did:** Generate unique emails/names each run, but keep passwords static.

**Why:**
- Random data lets tests run in parallel without stepping on each other
- If a test fails, I can see the exact email/password in the logs and manually reproduce it
- Static password (`MyFunc7!Test2`) means one less variable when debugging

**Downside:** Leaves more test accounts in staging. In production, I'd add cleanup scripts or use dedicated test accounts.

---

### 2. Stripe Iframe - The Brittle Part

**What I did:** Used stable iframe selector `iframe[title="Secure payment input frame"]` instead of the random Stripe-generated name.

**Why:** Stripe changes iframe names dynamically. Using the title attribute makes it more stable, but it's still an iframe so it's inherently a bit fragile.

**If this breaks:** The title attribute would need updating. Long-term, working with devs to add `data-test` attributes would help.

---

### 3. Scheduling Logic - Smart but Complex

**What I did:** Dynamic scheduling that tries up to 10 different dates to find one with 3 available time slots.

**Why:** Time slots get booked. Instead of hardcoding dates that might be full, the test adapts and finds what's available.

**Downside:** More code complexity. If all dates are booked (unlikely in staging), the test fails after 10 attempts. In a prod-like environment, I'd either clean up old bookings or use dedicated test time blocks.

---

### 4. Browser Context Management

**What I did:** Each test step (registration, duplicate attempt) gets its own browser context.

**Why:** Proper isolation - no cookies or session bleed between scenarios. This mirrors real user behavior better than reusing the same session.

**Cost:** Slightly slower tests due to context creation, but worth it for accuracy.

---

### 5. Locator Strategy - IDs When Possible

**What I did:** Prefer ID attributes (`input#email`) over classes or text content.

**Why:** IDs are unique, stable, and fast. When IDs aren't available, I use role-based selectors or visible text with filters.

**What would be better:** Getting devs to add `data-testid` attributes throughout the app. That's the gold standard for test stability.

---

### 6. Waits - Explicit but Pragmatic

**What I did:** Mix of explicit waits (`waitForTimeout`) and smart waits (`toBeVisible` with timeouts).

**Why:** Playwright's auto-waiting is good, but date pickers and payment iframes need explicit waits sometimes. I put these in a `PageHelpers.smartWait()` utility so they're centralized and easy to tune.

**Better approach:** Work with devs to add loading states or data attributes we can wait for reliably.

---

### 7. Logs for Debugging

**What I did:** Log credentials, selected times, and key milestones to console.

**Why:** When a test fails at 3 AM in CI, I need to know exactly what data it used. These logs let me manually reproduce the failure.

**Clean vs. Verbose:** I kept logs minimal but informative - `[Login] Email: test@example.com` instead of paragraphs of explanation.

## Architecture Details

### Adding New Pages

To add a new page object:
1. Create new file in `pages/` directory
2. Extend `BasePage` class
3. Define locators as class variables at the top
4. Export the class
5. Import and use in test files

### Test Data Generation

The `utils/testDataGenerator.ts` utility provides methods for generating unique test data:

```typescript
import { TestDataGenerator } from '../utils/testDataGenerator';

// Generate complete user data
const userData = TestDataGenerator.getRandomUserData();
// Returns: { firstName, lastName, email, phone, password }

// Or generate individual fields
const email = TestDataGenerator.getUniqueEmail(); // test-123456789@example.com
const phone = TestDataGenerator.getRandomUSPhone(); // (555) 123-4567
```

This prevents test conflicts and enables parallel execution.

### Static Test Data

The `utils/testConstants.ts` file centralizes all hardcoded values:

```typescript
import { TestConstants } from '../utils/testConstants';

// Payment data
await paymentPage.completePayment(TestConstants.PAYMENT.VALID);
await paymentPage.completePayment(TestConstants.PAYMENT.DECLINED);

// Locations
TestConstants.LOCATIONS.FLORIDA_AVENTURA.state  // "Florida"

// URLs
await page.goto(TestConstants.URLS.DASHBOARD);

// Stripe test cards
TestConstants.STRIPE_CARDS.VALID    // Always succeeds
TestConstants.STRIPE_CARDS.DECLINED // Always fails
```

### Reusing Common Flows

Common flows (like completing registration) can be extracted into helper functions or fixtures for reuse across multiple tests.

## What I'd Do Next

If I were continuing this work, here's what would make the biggest impact:

### Immediate Next Steps

**1. Add `data-testid` Attributes (Work with Devs)**
The biggest win would be getting devs to add `data-testid="booking-email-input"` type attributes to key elements. This makes tests way more stable than relying on IDs or classes that might change for styling reasons.

**2. Environment Config**
Move the base URL and any other environment-specific stuff to a `.env` file. Right now it's hardcoded to staging, but we'd want to run these against QA, staging, and prod-like environments.

**3. CI/CD Integration**
Hook these into GitHub Actions or whatever the team uses. Run on every PR to catch breaking changes early. Would include:
- Test parallelization (all 3 tests can run at once)
- Screenshots on failure
- HTML reports uploaded as artifacts

### High-Value Additions

**4. More Negative Tests**
- Underage DOB (under 18)
- Invalid credit cards (insufficient funds, processing errors)
- Network timeouts (using Playwright's route interception)
- Promo code validation (if those exist)

**5. API Verification**
After booking, hit an API endpoint to verify the appointment actually got created in the database. UI tests can lie - the page might look right but data could be wrong.

**6. Cleanup Scripts**
Add a utility to delete test accounts older than 7 days. Keeps staging clean and prevents weird conflicts.

### Nice to Have

**7. Cross-Browser**
Run on Firefox and Safari in CI. Chromium catches 90% of issues, but some browser-specific quirks exist (especially Safari date pickers).

**8. Mobile Viewport Testing**
Use Playwright's device emulation to test iPhone/Android viewports. The booking flow likely has responsive design considerations.

**9. Visual Regression**
Snapshot testing for key pages - catches unintended UI changes. Tools like Percy or Playwright's built-in screenshot comparison.

**10. Accessibility Checks**
Add `@axe-core/playwright` to flag accessibility issues. Important for a healthcare app that needs to meet WCAG standards.
