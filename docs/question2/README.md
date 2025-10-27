Question 2: Privacy & Security Testing - My Full Submission

This folder has everything I did for Question 2. Focused on privacy like the assessment says. Kept it real, based on what I actually tested.

---

What's Here

Privacy_Security_Test_Case.md (Part 1)
Integration test to block members from others' medical data.

Key stuff:
- Members can't access each other's PHI.
- 403 errors work right.
- User accounts get wider access via /hub/ (probably for staff).

Scenarios:
1. Member A can't get Member B's questionnaire.
2. No profile access between members via UUID.
3. Admin access uses different paths.

---

HTTP_Requests_Part2.md (Part 2)
Actual HTTP calls I ran to test.

Has 9 examples:
- What works (own data).
- What fails (others' data).
- Admin patterns.

Plus a matrix of all tests and results.

---

Security_Strategy_Part3.md (Part 3)
My plan for 100+ endpoints.

Includes:
1. Auto permission tests.
2. Contracts with rules.
3. Test users like real ones.
4. Pipeline integration.
5. Production watching.

Risks, fixes, and a start plan.

---

How I Tested

Tools: DevTools for networks, Postman for requests, portals for creating members.

Accounts:
- User: michael.krakovsky+test_interview@ezra.com
- Member A: ID 2098, UUID 71dc2be6-90c5-4b06-8889-8f9d7c4f852e
- Member B: ID 2100

---

Main Takeaways

Security is Good on Basics
Member A can't touch Member B's data. That's key. Shows auth checks work deep in the system.

Roles Are Split Well
Members limited, admins wider via /hub/. Prevents mistakes.

Suggestions
Log admin access for HIPAA. Rate limit endpoints. Track why someone accessed data.

---

My View

Protecting medical data is trust. One leak hurts bad. At Signify and CVS, I saw how strong checks save headaches. Ezra's setup has good bones - tokens, blocks, paths. Part 3 scales it to all endpoints.

---

Screenshots

In screenshots_part2/ - 12 shots of flows, calls, Postman, responses. Visual proof.

---

If More

I'd check token expire, logouts, sessions, deleted users. Happy to talk.

For Function Health Assessment
October 2025

