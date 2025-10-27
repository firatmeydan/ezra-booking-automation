Question 2 - Part 3: Handling Security for 100+ Endpoints

With over 100 endpoints dealing with sensitive data at Ezra, we can't just test manually. Here's how I'd manage it, based on what I did at Signify and CVS. Kept it practical, focused on what works in real teams.

---

Main Approach: Layers of Testing

Automated Checks for Who Can Access What

I'd build a framework that tests permissions automatically. At my past roles at CVS and Signify, we managed this by using API scopes. Each test user was assigned specific scopes—like `memberapi`, `providerapi`, or `profileapi`—which defined exactly what that user was authorized to do.

This approach lets us build a clear testing matrix. It's like a grid for all our endpoints.

How It Works:
```
For each endpoint:
  For each role (Member, Provider, Admin, Anonymous):
    For each resource (own data, other's data):
      Test: Can this role access this resource?
      Assert: Expected permission matches actual permission
```
We can automate tests for each combination. For example, a test would grab a token with only the `memberapi` scope and then try to hit an admin endpoint. It should be blocked.

Examples:
- User with `memberapi` scope → Member A's own data = Allow
- User with `memberapi` scope → Member B's data = Deny
- User with `providerapi` scope → Assigned patient data = Allow
- User with `providerapi` scope → Unassigned patient data = Deny
- User without any scope → Any PHI = Deny

Tradeoff:
- Good: Catches bugs before production, scales easy.
- Bad: Setup takes time, like 2-3 weeks. Needs updates when roles change.

---

Contracts with Built-in Security Rules

Use API contracts, but add security parts. Every endpoint has rules for auth and access.

Sample Contract:
```yaml
endpoint: /api/medicaldata/forms/mq/submissions/{id}/data
authentication: required
authorization:
  - role: member
    access_rule: "submission.member_id == authenticated_user.id"
    failure_code: 403
  - role: provider
    access_rule: "submission.member_id in provider.assigned_members"
    failure_code: 403
rate_limit: 100 requests/minute
```

Tradeoff:
- Good: Rules are clear and versioned, catches changes.
- Bad: Have to keep them updated, can slow devs if not smooth.

---

Test Data with Real-like Users

Keep a set of test users that act like real ones. Not random, but planned. This is where we connect the personas to the API scopes.

Personas I’d Use:
1.  "Member_Standard": Regular member, given `memberapi` and `profileapi` scopes.
2.  "Member_Multiple": Same scopes as standard, just more data.
3.  "Member_Shared_Family": Might have a special `familyapi` scope.
4.  "Provider_Primary": Given `providerapi` and limited `memberapi` scopes.
5.  "Provider_Specialist": Similar to primary, but maybe with a `referralapi` scope.
6.  "Admin_Support": Read-only scopes across multiple APIs.
7.  "Admin_Clinical": Read/write scopes for clinical data.

Testing:
For each endpoint, check own access (Allow) and others (Deny). Plus edges like expired tokens.

Tradeoff:
- Good: Tests feel real, easy to get.
- Bad: Data can get old. Risk if test accounts get hacked.

---

Put It in the Pipeline

Security tests run on every code change, block if they fail.

Stages:
```
1. Unit Tests (Fast - 2 min)
   └─ Basic auth/authz logic tests

2. Integration Tests (Medium - 10 min)
   └─ Authorization matrix tests (100+ endpoints)
   └─ Role-based access tests with test personas

3. Security Scan (Medium - 5 min)
   └─ OWASP ZAP or similar tool
   └─ Check for common vulnerabilities (CSRF, XSS, SQL injection)

4. Contract Tests (Fast - 3 min)
   └─ Validate all endpoint contracts including security rules

5. Smoke Tests (Post-Deploy - 2 min)
   └─ Verify critical security controls in staging/prod
```

Tradeoff:
- Good: Quick feedback, stops bad code.
- Bad: Can slow releases, flaky tests annoy.

---

Watching in Production

Tests are great, but monitor real use to catch weird stuff.

What to Watch:
- Failed auths: Too many 403s from one user.
- Cross-access: Member hitting another's data (shouldn't happen).
- Big pulls: Provider grabbing 100 records fast.
- Odd times: Access at 3am.
- Location jumps: NY to Russia suddenly.

Alerts:
```
MEDIUM: User "member@example.com" had 15 failed authorization attempts in 5 minutes
HIGH: Admin "support@ezra.com" accessed 50 different member records in 10 minutes
CRITICAL: Member token used to successfully access another member's data (should never happen)
```

Tradeoff:
- Good: Catches attacks tests miss, good for audits.
- Bad: Needs setup, too many alerts tire people.
- Risk: Logs must be secure too.

---

Risks and How to Handle

Risk 1: Thinking It's All Good When It's Not
Tests pass, but miss edges. Saw this at CVS - high coverage, but still holes.

Fix:
- Test negatives always.
- Add edges like expired stuff.
- Yearly outside audits.

---

Risk 2: Test Data Mess
Endpoints grow, data gets inconsistent. Tests flake.

Fix:
- One place for test data.
- Auto create/destroy in tests.
- Fake PHI tools for safety.

---

Risk 3: Too Many Roles
Start simple, end with 15. Testing all is hard.

Fix:
- Simple hierarchy.
- Group permissions.
- Document roles clear.

---

Risk 4: Leaking Tokens in Tests
Code has tokens, they get in Git.

Fix:
- No hardcodes.
- Use env vars or vaults.
- Rotate often.
- Scan for secrets.

---

Risk 5: Staging vs Prod Difference
Tests pass in staging, prod acts different.

Fix:
- Prod-like data in staging.
- Smoke tests in prod.
- Monitor for surprises.
- Blue-green deploys.

---

What I'd Do First

If starting at Ezra, my plan would be to learn first, then act.

First Month: Onboarding, Learning, and Understanding
- The first couple of weeks are all about getting up to speed. I'd focus on meeting the team (devs, product, ops), getting my dev environment working, and learning the current processes for testing and releases. I would go through the Ezra member and hub portals myself to understand the user experience.
- I'd spend time reading any existing documentation on the architecture, the APIs, and the current test suites. I'd want to understand what security testing, if any, is already being done.
- By week 3 or 4, I'd aim to contribute in a small way, like fixing a minor bug or adding a simple test case. This helps me learn the codebase and the contribution workflow. At the same time, I would start mapping out the sensitive endpoints and asking questions to build a clear picture of the system.

Month 2: Laying the Foundation with a Quick Win
- Now that I understand the system, I can start building. I'd formalize the map of the 100+ endpoints and work with the team to define the 5-7 key user personas we need for testing.
- I'd propose and build a small proof-of-concept for the automated authorization framework. I wouldn't try to test all 100 endpoints at once. I'd pick 2-3 of the most critical ones, like the medical data and member profile endpoints we've already looked at.
- A good quick win would be to work with the Ops or Platform team on monitoring. We'd use whatever logging tool they have, like Splunk, Kibana, or New Relic. The first step is to ensure the application is logging every failed authorization attempt—specifically, any API call that results in a `401 Unauthorized` or `403 Forbidden` response. These logs need to include the IP address, the user ID (if they were logged in), and the endpoint they tried to hit. Then, we'd set up a simple alert with logic like this: `ALERT if the count of 403 Forbidden responses from a single IP address exceeds 50 within a 5-minute period.` This alert would go to a team Slack channel or PagerDuty. It's a low-effort way to get immediate visibility into potential brute-force attacks or scraping attempts.

Month 3: Scaling the Solution
- With a successful proof-of-concept, now it's time to expand. I'd start adding more endpoints to the authorization test framework, prioritizing them by sensitivity.
- I would get the first set of these security tests running automatically in the CI/CD pipeline, so they block any pull request that introduces a security regression.
- I'd also start conversations about introducing contract testing for security on any *new* endpoints being developed.

Month 4 and Beyond: Improving and Maturing
- From here, it's about continuous improvement.
- Keep expanding test coverage until all sensitive endpoints are included.
- Refine the monitoring and alerts to reduce noise and catch more sophisticated issues.
- Work with developers to make security part of the design process, not an afterthought.
- And eventually, bring in a third party for a full penetration test to find the things we might have missed.

---

From My Experience

While my main focus in past roles wasn't building security frameworks from scratch, my work has always involved protecting sensitive data and ensuring system integrity. The strategies I've outlined are a direct application of the skills I used every day at CVS and Apple. Here’s how my experience connects:

What My Experience Shows:
- At Apple, I was one of the lead backend Quality Engineers for the ""Mobile Driver's License (mDL) initiative". This project handled extremely sensitive personal data (driver's licenses, biometric data) and had strict security requirements from government partners. My role was to validate complex identity verification flows and ensure the highest security standards. I maintained "comprehensive API regression suites in Java and TestNG" to validate data encryption and security protocols. This is the same skill set I would use to test the authorization rules for Ezra's endpoints.

- As part of the mDL project, I used Splunk to monitor application logs for security-related anomalies and set up automated alerts. This is exactly the kind of proactive monitoring I am proposing for Ezra's production environment. It's about finding potential threats before they become major incidents.

- During the CVS-Signify Health integration, I was responsible for ensuring the integrity of massive amounts of member healthcare data. I built a system to generate and validate over 500,000 realistic member records using SQL and C#. This experience in deep data validation is critical for security—it's the same process you would use to verify that one member’s private data never gets mixed with another's.

- In all my recent roles, I have integrated automated tests into CI/CD pipelines using tools like TeamCity and Azure DevOps. We would apply the exact same principle here. The security tests we build would run on every single code change, providing fast feedback and preventing security bugs from ever reaching production.

What This Means for Ezra:
My experience isn't in writing security policy, it's in the practical, hands-on work of building the automated systems that *enforce* that policy. I know how to test complex APIs with sensitive data, how to validate data integrity at scale, and how to build the automated checks and monitoring that form the backbone of a modern security quality strategy.

