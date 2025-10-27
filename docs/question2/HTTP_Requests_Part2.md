Question 2 - Part 2: HTTP Requests for Privacy Testing

I took the test case from Part 1 and turned it into actual HTTP calls. Used Postman like I do in my daily work. Kept it simple, showed what works and what gets blocked. No changes to what I found, just the requests.

---

Scenario 1: Member Trying to Hit Another Member's Questionnaire

Step 1: Member A Getting Their Own Data (Should Work)

```http
GET /diagnostics/api/medicaldata/forms/mq/submissions/2098/data HTTP/1.1
Host: stage-api.ezra.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [Member A's Token]
Content-Type: application/json
Accept: application/json
```

**Expected Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

[
    {
        "key": "abnormalFindingDescription",
        "value": null,
        "hasAnswer": false,
        "isAutoFill": null
    },
    {
        "key": "address",
        "value": null,
        "hasAnswer": false,
        "isAutoFill": null
    },
    {
        "key": "allergies",
        "value": null,
        "hasAnswer": false,
        "isAutoFill": null
    },
    // ... more fields ...
    {
        "key": "bloodPressureReadings",
        "value": null,
        "hasAnswer": false,
        "isAutoFill": null
    }
]
```

---

Step 2: Member A Trying Member B's Data (Should Fail)

```http
GET /diagnostics/api/medicaldata/forms/mq/submissions/2100/data HTTP/1.1
Host: stage-api.ezra.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [Member A's Token - SAME AS ABOVE]
Content-Type: application/json
Accept: application/json
```

**Expected Response:**
```http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "message": "Authentication failed",
  "path": "/api/medicaldata/forms/mq/submissions/2100/data"
}
```

**What Happened:** PASS - Blocked with 403, like it should.

---

Step 3: Member B Getting Their Own Data

```http
GET /diagnostics/api/medicaldata/forms/mq/submissions/2100/data HTTP/1.1
Host: stage-api.ezra.com
Authorization: Bearer dGhpc2lzYW5vdGhlcnRva2VuZXhhbXBsZQ... [Member B's Token]
Content-Type: application/json
Accept: application/json
```

**Expected Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

[
    {
        "key": "abnormalFindingDescription",
        "value": null,
        "hasAnswer": false,
        "isAutoFill": null
    },
    {
        "key": "address",
        "value": null,
        "hasAnswer": false,
        "isAutoFill": null
    },
    {
        "key": "allergies",
        "value": null,
        "hasAnswer": false,
        "isAutoFill": null
    },
    // ... more fields ...
    {
        "key": "bloodPressureReadings",
        "value": null,
        "hasAnswer": false,
        "isAutoFill": null
    }
]
```

---

Step 4: Member B Trying Member A's Data (Should Fail)

```http
GET /diagnostics/api/medicaldata/forms/mq/submissions/2098/data HTTP/1.1
Host: stage-api.ezra.com
Authorization: Bearer dGhpc2lzYW5vdGhlcnRva2VuZXhhbXBsZQ... [Member B's Token]
Content-Type: application/json
Accept: application/json
```

**Expected Response:**
```http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "message": "Authentication failed",
  "path": "/api/medicaldata/forms/mq/submissions/2098/data"
}
```

**What Happened:** PASS - 403 again. Good block.

---

Scenario 2: Profile Access with Member Tokens

Step 5: Member A Trying Their Own Profile by ID (Should Fail)

```http
GET /members/api/members/71dc2be6-90c5-4b06-8889-8f9d7c4f852e HTTP/1.1
Host: stage-api.ezra.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [Member A's Token]
Content-Type: application/json
Accept: application/json
```

**Expected Response:**
```http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "message": "Authentication failed",
  "path": "/api/members/71dc2be6-90c5-4b06-8889-8f9d7c4f852e"
}
```

**Note:** Even for their own ID, it blocks. Members use /members/api/members/ without ID for their info.

---

Step 6: Member A Getting Own Profile (General Endpoint)

```http
GET /members/api/members/ HTTP/1.1
Host: stage-api.ezra.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [Member A's Token]
Content-Type: application/json
Accept: application/json
```

**Expected Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "memberId": "71dc2be6-90c5-4b06-8889-8f9d7c4f852e",
  "email": "memberA@example.com",
  "firstName": "John",
  "lastName": "Doe",
  // ... other profile data for Member A
}
```

---

Scenario 3: User Access (Just for Comparison)

Step 7: User Pulling Member A's Questionnaire

```http
GET /diagnostics/api/hub/medicaldata/forms/mq/submissions/2098/data HTTP/1.1
Host: stage-api.ezra.com
Authorization: Bearer YWRtaW50b2tlbmV4YW1wbGVoZXJl... [User Token from michael.krakovsky+test_interview@ezra.com]
Content-Type: application/json
Accept: application/json
```

**Expected Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

[
    {
        "key": "abnormalFindingDescription",
        "value": null,
        "hasAnswer": false,
        "isAutoFill": null
    },
    {
        "key": "address",
        "value": null,
        "hasAnswer": false,
        "isAutoFill": null
    },
    {
        "key": "allergies",
        "value": null,
        "hasAnswer": false,
        "isAutoFill": null
    },
    // ... more fields ...
    {
        "key": "bloodPressureReadings",
        "value": null,
        "hasAnswer": false,
        "isAutoFill": null
    }
]
```

**Note:** Works because of the /hub/ path for admins. Makes sense, but log it.

---

Step 8: User Pulling Member B's Questionnaire

```http
GET /diagnostics/api/hub/medicaldata/forms/mq/submissions/2100/data HTTP/1.1
Host: stage-api.ezra.com
Authorization: Bearer YWRtaW50b2tlbmV4YW1wbGVoZXJl... [User Token]
Content-Type: application/json
Accept: application/json
```

**Expected Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

[
    {
        "key": "abnormalFindingDescription",
        "value": null,
        "hasAnswer": false,
        "isAutoFill": null
    },
    {
        "key": "address",
        "value": null,
        "hasAnswer": false,
        "isAutoFill": null
    },
    {
        "key": "allergies",
        "value": null,
        "hasAnswer": false,
        "isAutoFill": null
    },
    // ... more fields ...
    {
        "key": "bloodPressureReadings",
        "value": null,
        "hasAnswer": false,
        "isAutoFill": null
    }
]
```

---

Step 9: User Getting Member Profile by ID

```http
GET /members/api/members/71dc2be6-90c5-4b06-8889-8f9d7c4f852e HTTP/1.1
Host: stage-api.ezra.com
Authorization: Bearer YWRtaW50b2tlbmV4YW1wbGVoZXJl... [User Token]
Content-Type: application/json
Accept: application/json
```

**Expected Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "memberId": "71dc2be6-90c5-4b06-8889-8f9d7c4f852e",
  "email": "memberA@example.com",
  "firstName": "John",
  "lastName": "Doe",
  // ... complete profile data for Member A
}
```

---

Quick Test Matrix

| Request | Token Used | Target Data | Expected | Actual | Result |
|---------|------------|-------------|----------|--------|--------|
| GET /submissions/2098/data | Member A | Member A data | 200 OK | 200 OK | PASS |
| GET /submissions/2100/data | Member A | Member B data | 403 Forbidden | 403 Forbidden | PASS |
| GET /submissions/2100/data | Member B | Member B data | 200 OK | 200 OK | PASS |
| GET /submissions/2098/data | Member B | Member A data | 403 Forbidden | 403 Forbidden | PASS |
| GET /members/{uuid} | Member A | Own profile | 403 Forbidden | 403 Forbidden | PASS |
| GET /members/{uuid} | Member B | Member A profile | 403 Forbidden | 403 Forbidden | PASS |
| GET /members/ | Member A | Own profile | 200 OK | 200 OK | PASS |
| GET /hub/.../2098/data | User | Member A data | 200 OK | 200 OK | INFO |
| GET /hub/.../2100/data | User | Member B data | 200 OK | 200 OK | INFO |
| GET /members/{any-uuid} | User | Any member profile | 200 OK | 200 OK | INFO |

What It Means:
- PASS: Security doing its job.
- INFO: Admin stuff, expected but needs watching.

---

What I Saw

1. Member Security Solid - Can't get to others' data, 403 stops them.
2. Roles Make Sense - Members limited, users wider via /hub/.
3. I'd Suggest: Log admin accesses for compliance, like we did at CVS. Rate limit to stop big pulls. Reason logging for why someone looked at data.

From Signify, I remember one time a loose endpoint let providers see too much. These tests would catch that early.

