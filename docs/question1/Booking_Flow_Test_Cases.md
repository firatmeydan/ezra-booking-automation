Booking Flow — Top 15 (v3, cleaner and more human)

I walked the flow a few times and wrote these the way I usually think when testing. Kept it short, real, and focused on what matters.

---

TC-01: End to end happy path through booking
Sign up, pick MRI ($499), choose Aventura, pick times, pay, see confirmation, land on dashboard.

- I expect clear headings at each step and the right breadcrumb.
- Confirmation should say the “requested time slots” line and show the site I picked.
- Dashboard should already show the questionnaire tile and an MRI appointment card (pending).

Why: This one's #1 because it's the full revenue chain. If any part breaks, no bookings happen, and that's the business gone. I've seen at Signify how one API glitch stopped a day's worth of member matches – this test catches if sign-up, plans, scheduling, and payment all connect right in one go.

---

TC-02: Handling a declined payment properly
Do the same flow but pay with the decline card (4000 0000 0000 0002).

- I should get a helpful error and stay on the payment page.
- No appointment card should appear on the dashboard.

Why: Payments are tricky – a decline should stop everything cleanly, no half-created appointments lurking. From my time handling data at Signify, mismatches like that meant support headaches cleaning up ghosts. This protects trust so users don't show up thinking they booked.

---

TC-03: Blocking duplicate email and phone at sign up
Try an email that already exists, then try a phone number that already exists (with new email).

- For email: I saw the message: “If you have previously created an account try logging in instead.” Should not advance.
- For phone: It allows creation with same phone (but new email) – note: this could create data duplicates.

Why: Duplicates fragment data and cause login messes, especially with PHI in health apps. Happened too often in testing at Signify/CVS – catching it early with a nice message prevents bigger issues down the line. (Blocks email but not phone – I'd flag that for the team to tighten.)

---

TC-04: Enforcing the required consent checkbox
Fill everything but don’t check the required consent box.

- Submit stays disabled. No extra message. That’s fine, but it’s easy to miss.

Why: Legal/compliance. No consent, no account.

---

TC-05: Validating DOB formats and rules
Bad formats (13-40-9999), future date, underage.

- I saw “Invalid date of birth” for junk.
- Underage got: “You need to be 18 years or older to qualify for a scan.”
- Can’t continue until fixed.

Why: Medical rules and data quality.

---

TC-06: Detecting and following time selection rules
Pick a site, choose a date, click the first available time.

- If a popup says “Please select 3 times…”, I’ll pick exactly three before continuing.
- If there’s no popup and only one stays selected, that site expects a single time.
- For sites tagged “Available instead. MRI Scan with Spine,” I’ll get a plan warning first. After that, the site’s time rule still applies.

Why: Different sites, different rules. Let the app tell us, then we verify it enforces the rule.

---

TC-07: Verifying selected times show correctly later
After 3 time sites, the confirmation should list all 3. After 1 time sites, just 1.

- No drops or extras on confirmation or dashboard.

Why: Consistency across steps.

---

TC-08: Testing promo code application
Try an obviously bad code. If we have a test good one, try that too.

- Bad, friendly error, total stays $499.
- Good, total drops and a discount line appears in the right summary.

Why: Pricing trust.

---

TC-09: Ensuring Stripe form fields work reliably
Enter 4242…; 02/27; 123; ZIP.

- Fields should accept input smoothly. No focus jumping.
- The iframe name changes, so I stick to the title selector.

Why: Reliability at payment.

---

TC-10: Checking questionnaire task appears on dashboard
After booking, look at My Tasks.

- I expect the questionnaire tile with the “complete 5 days before” note.
- I didn’t see it in one run—flagging for the team to check env/state.

Why: Operationally important.

---

TC-11: Canceling an appointment pre confirmation
On the dashboard, hit Cancel on the MRI card.

- I expect a prompt. After confirming, the card disappears or shows canceled and stays that way on refresh.

Why: State transitions.

---

TC-12: Managing locations without geolocation enabled
Block location, set state to Florida, hit “Find closest,” then try to go back to Florida.

- When I blocked geo, it showed NY centers by default.
- Toggling to another state and back to FL brought the FL list again.

Why: People block geo. The list still has to be usable.

---

TC-13: Sex at birth dropdown with keyboard use and persistence
Tab to the field, pick Male/Female, move forward and back.

- Keyboard should open/select options, screen reader should announce it, and the choice should persist.

Why: Accessibility + correctness.

---

TC-14: Basic keyboard navigation check (with scan card note)
Tab through plan, schedule, payment.

- Inputs and buttons should be reachable.
- The scan cards are divs without tabindex, so Tab skips them. I’d ask to expose them as real buttons/links.

Why: Keyboard users exist, and this helps automation too.

---

TC-15: Handling page refreshes without losing progress
Refresh on plan (after DOB), on scheduling (after state), and on confirmation.

- Reasonable persistence or a clear re‑prompt. No crashes.

Why: People refresh. A lot.

---

Top 3 — Why They're Most Important

1) End to end happy path through booking
This one's #1 because it's the full revenue chain. If any part breaks, no bookings happen, and that's the business gone. I've seen at Signify how one API glitch stopped a day's worth of member matches – this test catches if sign-up, plans, scheduling, and payment all connect right in one go.

2) Handling a declined payment properly
Payments are tricky – a decline should stop everything cleanly, no half-created appointments lurking. From my time handling data at Signify, mismatches like that meant support headaches cleaning up ghosts. This protects trust so users don't show up thinking they booked.

3) Blocking duplicate email at sign up
Duplicates fragment data and cause login messes, especially with PHI in health apps. Happened too often in testing at Signify/CVS – catching it early with a nice message prevents bigger issues down the line.

These three hit revenue, trust, and data quality hard – the rest build from there.
