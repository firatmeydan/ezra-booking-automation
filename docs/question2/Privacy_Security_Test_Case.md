Question 2: Privacy & Security Testing - Part 1

I went through the assessment hint about the medical questionnaire and built this test case. Kept it straightforward, like how I test in real projects. Focused on what matters most - making sure one member's data stays private from others.

---

Integration Test Case - Stopping Members from Grabbing Others' Medical Data

This test checks that Member A can't pull Member B's questionnaire info. It's all about privacy, which is huge in health tech.

---

Setup I Used

Accounts:
- User (like admin): michael.krakovsky+test_interview@ezra.com
- Member A: Made one in the member portal, got submission ID 2098
- Member B: Made another, submission ID 2100

Sites:
- Member side: https://myezra-staging.ezra.com/
- User side: https://staging-hub.ezra.com/
- API base: https://stage-api.ezra.com/

---

Test Case 1: Member Trying to Access Another Member's Stuff

What I'm Checking: Member A shouldn't get Member B's medical questionnaire data with their own token.

Steps I Took:
1. Created Member A, had them start the questionnaire.
2. Grabbed Member A's token from DevTools.
3. Noted Member A's ID: 2098.
4. Did the same for Member B, ID 2100.
5. Used Member A's token to try hitting Member B's data:
   ```
   GET https://stage-api.ezra.com/diagnostics/api/medicaldata/forms/mq/submissions/2100/data
   Authorization: Bearer {memberA_token}
   ```

What Should Happen:
- 403 Forbidden
- Response:
  ```json
  {
    "message": "Authentication failed",
    "path": "/api/medicaldata/forms/mq/submissions/2100/data"
  }
  ```
- No data leaks from Member B.

What Actually Happened:
PASS - Got the 403, no data came through. System blocked it right.

---

Test Case 2: Checking Profile Access Between Members

What I'm Checking: Members can't hit other members' profiles via the API.

Steps I Took:
1. Got Member A's UUID: 71dc2be6-90c5-4b06-8889-8f9d7c4f852e
2. Tried accessing it with Member A's token:
   ```
   GET https://stage-api.ezra.com/members/api/members/71dc2be6-90c5-4b06-8889-8f9d7c4f852e
   Authorization: Bearer {memberA_token}
   ```
3. Then with Member B's token on the same URL.

What Should Happen:
- 403 Forbidden for both.
- No profile data shows up.

What Actually Happened:
PASS - 403 on both tries. Even their own UUID doesn't work for members. They have to use the general /members/api/members/ endpoint for their own stuff.

---

Test Case 3: Looking at User Role Access

What I'm Checking: How the user account (admin-like) can access stuff, for comparison.

Steps I Took:
1. Logged in as the user.
2. Went to the hub at https://staging-hub.ezra.com/.
3. Grabbed the user token.
4. Hit Member A's data:
   ```
   GET https://stage-api.ezra.com/diagnostics/api/hub/medicaldata/forms/mq/submissions/2098/data
   Authorization: Bearer {user_token}
   ```
5. Same for Member B: change to 2100.
6. Also tried member profiles:
   ```
   GET https://stage-api.ezra.com/members/api/members/{any_member_uuid}
   Authorization: Bearer {user_token}
   ```

What Should Happen:
- User gets access to all, probably for support or clinical reasons.
- Should be logged somewhere.

What Actually Happened:
VERIFIED - User can pull all member data via the /hub/ path and profiles. Makes sense for the role, but needs good logging.

Note on Security: This seems on purpose for providers, but I'd make sure it's documented, audited, and limited to who needs it. Like role-based stuff.

---

What I Found Overall

Good Stuff:
1. Members Can't Touch Each Other's Data - Questionnaire and profiles are locked down.
2. Tokens Work Right - Checked on each call, mismatches get blocked.

Things to Watch:
1. User Access is Wide - Can see everything. Needs policies and logs.
2. Different Paths - /diagnostics/api/ for members, /hub/ for users. Good split, but document it.

---

Why This Test is Key

Privacy is everything in our field. One slip, and trust is gone. I've dealt with PHI at Signify and CVS - a small leak can mean big problems, like support fixing messed up records. This test proves the basics are solid: your data stays yours, unless it's a authorized provider. The member isolation works, which is the main thing for compliance and user confidence.

