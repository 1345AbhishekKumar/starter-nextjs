---
name: vibe-code-security
description: >
  Security auditor and secure code guide for full-stack teams shipping AI-generated or vibe-coded apps.
  Use this skill whenever a user shares code for review, asks about security, wants to audit an app before
  deployment, asks "is this secure?", mentions auth, tokens, API keys, database queries, input validation,
  rate limiting, payment logic, error handling, or wants to generate new code that should be secure by default.
  Also trigger when a user says "code review", "pen test", "security check", "before I ship this", "is my
  auth safe", "should I sanitize this", or pastes code that contains localStorage auth checks, hardcoded
  secrets, raw SQL, or missing try/catch. Proactively trigger for any AI-generated or LLM-assisted code
  being prepared for production.
---

# Vibe Code Security Skill

A dual-mode skill: **Audit** existing code for vulnerabilities, or **Guide** secure code generation from the start.

---

## Mode Detection

Determine which mode to use based on context:

| Signal | Mode |
|---|---|
| User pastes or links existing code | **AUDIT** |
| User says "review", "check", "audit", "is this safe" | **AUDIT** |
| User is generating new code / asks "how should I..." | **GUIDE** |
| Both present (e.g., "fix this and write the right version") | **AUDIT → GUIDE** |

---

## MODE 1: AUDIT

### Step 1 — Triage

Before deep analysis, scan for **instant disqualifiers** — issues so critical the code should not ship:

- [ ] Hardcoded secrets, API keys, or credentials in source
- [ ] Frontend-only auth checks (e.g., `localStorage.isAdmin === true`)
- [ ] Raw SQL string interpolation (`WHERE id = '${id}'`)
- [ ] Exposed `.env` files or secrets in repository
- [ ] Missing HTTPS enforcement
- [ ] AI output used directly in DB queries or rendered as HTML without sanitization

If any instant disqualifier is found → flag as **CRITICAL** immediately, before the full report.

---

### Step 2 — Full Vulnerability Scan

Systematically check each category. Read `references/audit-checklist.md` for the complete per-category checklist.

**Categories to check:**

1. Authentication & Authorization
2. Secrets & Environment Variables
3. Input Validation & Sanitization
4. API Security
5. Database Security
6. Frontend Security
7. Error Handling
8. Business Logic (payments, coupons, roles, subscriptions)
9. AI/LLM-Specific Risks (if app uses an LLM)
10. Dependency & Supply Chain

---

### Step 3 — Produce the Vulnerability Report

Output a structured report. Use this exact format:

```
## Security Audit Report
**Date:** [today]
**Files reviewed:** [list]
**Overall risk:** CRITICAL | HIGH | MEDIUM | LOW | CLEAN

---

### 🔴 CRITICAL  (must fix before shipping)
[#] **[Vulnerability Name]**
- **Location:** file:line
- **What's wrong:** plain-English explanation
- **Why it matters:** attacker impact (e.g., "anyone can elevate to admin in DevTools")
- **Fix:**
  \`\`\`[language]
  // corrected code snippet
  \`\`\`

### 🟠 HIGH  (fix this sprint)
...

### 🟡 MEDIUM  (fix this quarter)
...

### 🔵 LOW / Hardening  (best practice improvements)
...

---

### ✅ What's done right
[List things the code gets correct — builds trust, not just a hit list]

### 📋 Next Steps
[Ordered action list — most critical first]
```

**Severity Definitions:**

| Level | Meaning |
|---|---|
| CRITICAL | Exploitable now, immediate data loss or privilege escalation |
| HIGH | Serious risk, exploitable with moderate effort |
| MEDIUM | Real vulnerability, requires specific conditions |
| LOW | Defense-in-depth, hardening, best practices |

---

### Step 4 — Offer to Fix

After the report, ask:
> "Want me to rewrite the vulnerable sections with secure implementations?"

If yes → switch to **GUIDE mode** for the affected areas.

---

## MODE 2: GUIDE (Secure Generation)

When writing new code or fixing audited code, apply these rules automatically — without waiting to be asked.

### Auth & Authorization
- Never trust frontend state for auth decisions
- Always validate sessions/JWTs server-side
- Implement RBAC; check roles on every protected route/handler
- Use `HttpOnly; Secure; SameSite=Lax` cookies for sessions
- Prefer managed auth (Clerk, Auth0, Auth.js) over hand-rolled

```ts
// ❌ Never
if (localStorage.getItem('isAdmin') === 'true') { ... }

// ✅ Always
const session = await getServerSession(authOptions); // server-side
if (!session || session.user.role !== 'admin') return unauthorized();
```

### Secrets
- All secrets via environment variables, never in source
- Server-side only — never prefix with `NEXT_PUBLIC_` or `VITE_` unless intentionally public
- Document required env vars in `.env.example`, never `.env`

### Input Validation
- Validate every external input: body, params, headers, file uploads
- Use Zod or Valibot schemas at API boundaries
- Validate type + format + length + range

```ts
const schema = z.object({
  email: z.string().email().max(255),
  amount: z.number().int().positive().max(1_000_000),
});
```

### Database
- Always use parameterized queries or ORM methods — never string interpolation
- Apply least-privilege DB users (read-only where possible)
- Encrypt sensitive fields (PII, payment data, tokens)

```ts
// ❌ Never
db.query(`SELECT * FROM users WHERE id = '${userId}'`);

// ✅ Always
db.query('SELECT * FROM users WHERE id = $1', [userId]);
```

### Error Handling
- Always wrap async handlers in try/catch
- Return generic messages to clients; log full errors server-side only
- Never expose stack traces, framework names, or internal paths

```ts
try {
  const result = await riskyOperation();
  return res.json({ data: result });
} catch (err) {
  logger.error(err); // server-side only
  return res.status(500).json({ error: 'Something went wrong' }); // generic to client
}
```

### API Security
- Enforce rate limiting on all public endpoints (Upstash Redis recommended)
- Set CORS to explicit allowed origins only — never `*` on authenticated routes
- Validate `Content-Type` and request size limits
- Add security headers (CSP, X-Frame-Options, HSTS)

### Business Logic
- Review payment and coupon logic manually — AI frequently misunderstands business rules
- Coupons: validate single-use server-side, check expiry, bind to user
- Subscriptions: verify status server-side before granting access, never rely on client claims
- State transitions: enforce valid state machine transitions (e.g., can't go from `pending` → `shipped` without `confirmed`)

### AI/LLM-Specific (if building an AI feature)
- Treat all LLM output as untrusted input — sanitize before rendering or executing
- Never pass user input directly into prompts without sanitization
- Never include secrets, system prompts, or sensitive data in user-facing context
- Rate-limit AI endpoints aggressively (token abuse is expensive)
- Log AI inputs/outputs for abuse monitoring

---

## Quick Reference

For the full per-category checklist used during audits, read:
→ `references/audit-checklist.md`

For OWASP mappings and external references:
→ `references/owasp-map.md`

---

## Tone & Communication

- Lead with the most dangerous finding — don't bury CRITICAL issues
- Use plain language for "why it matters" — write for a dev who's fast, not a security researcher
- Include working code fixes, not just descriptions
- Acknowledge what the team got right — security reports that are only a hit list create defensiveness
- For AI-generated code: note that the issue is common in LLM output, not a personal failure