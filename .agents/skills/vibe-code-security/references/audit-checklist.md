# Audit Checklist — Per Category

Full checklist for MODE 1 (AUDIT). Check each item and note findings.

---

## 1. Authentication & Authorization

- [ ] No frontend-only auth checks (`localStorage`, `sessionStorage`, client state)
- [ ] JWT/session validated server-side on every protected route
- [ ] Tokens signed with strong secret, short expiry (access: 15m, refresh: 7d)
- [ ] RBAC implemented — roles checked server-side, not client-side
- [ ] No hardcoded user role bypasses or debug flags left in production code
- [ ] MFA available for admin/privileged accounts
- [ ] Password reset tokens are single-use, time-limited, and invalidated after use
- [ ] Account lockout after repeated failed login attempts

**Common AI-gen failures:** frontend-only checks, missing role validation on API routes, no token expiry

---

## 2. Secrets & Environment Variables

- [ ] No API keys, DB passwords, or JWT secrets in source code
- [ ] `.env` files in `.gitignore`
- [ ] `.env.example` exists with placeholder values only
- [ ] Client-side env vars (`NEXT_PUBLIC_`, `VITE_`) contain no sensitive values
- [ ] Production secrets use a secret manager (Vercel env, AWS Secrets Manager, Doppler)
- [ ] No secrets in logs, error messages, or API responses

**Common AI-gen failures:** hardcoded API keys in fetch calls, secrets in frontend constants

---

## 3. Input Validation & Sanitization

- [ ] All API inputs validated (body, params, query, headers)
- [ ] Validation covers: type, format, length, range, allowed values
- [ ] Schema validation library used (Zod, Valibot, Joi)
- [ ] File uploads: MIME type, size limit, extension checked; never executed server-side
- [ ] HTML/Markdown content sanitized before rendering (DOMPurify or equivalent)
- [ ] Redirect targets validated against allowlist (open redirect prevention)

**Common AI-gen failures:** no schema validation, trusting `req.body` shape directly

---

## 4. API Security

- [ ] HTTPS enforced (redirect HTTP → HTTPS)
- [ ] CORS configured to specific trusted origins — no `*` on authenticated endpoints
- [ ] Rate limiting on all public endpoints and auth routes
- [ ] Request size limits configured
- [ ] Auth token required on all protected endpoints (not just documented ones)
- [ ] API returns 401/403 correctly — not 200 with an error in body
- [ ] No sensitive data in URL parameters (use POST body instead)
- [ ] Security headers present: CSP, X-Frame-Options, HSTS, X-Content-Type-Options

**Common AI-gen failures:** missing rate limiting, no CORS config, security headers absent

---

## 5. Database Security

- [ ] All queries use parameterized statements or ORM methods
- [ ] No string interpolation in SQL queries
- [ ] DB user has minimum required privileges (no root/superuser in app)
- [ ] Passwords hashed with bcrypt or Argon2id (never MD5, SHA-1, plain)
- [ ] Sensitive fields encrypted at rest (PII, tokens, payment data)
- [ ] DB not directly accessible from frontend (always via API layer)
- [ ] Connection strings in environment variables only
- [ ] Automated backups configured and tested

**Common AI-gen failures:** raw SQL with template literals, storing plaintext passwords, superuser DB connections

---

## 6. Frontend Security

- [ ] No private API keys or secrets in client bundle
- [ ] CSP header configured
- [ ] `X-Frame-Options: DENY` set (clickjacking prevention)
- [ ] Cookies use `HttpOnly; Secure; SameSite=Lax`
- [ ] No sensitive data stored in `localStorage` (use memory or HttpOnly cookies)
- [ ] User-generated content sanitized before rendering
- [ ] No `dangerouslySetInnerHTML` with unsanitized content (React)
- [ ] Source maps disabled or restricted in production

**Common AI-gen failures:** JWT stored in localStorage, dangerouslySetInnerHTML without sanitization

---

## 7. Error Handling

- [ ] All async functions wrapped in try/catch
- [ ] Generic error messages returned to clients
- [ ] Full error details logged server-side only
- [ ] No stack traces, framework info, or file paths in API responses
- [ ] Error monitoring configured (Sentry, Datadog)
- [ ] 404 responses don't confirm whether a resource exists (user enumeration)

**Common AI-gen failures:** no try/catch, stack traces in JSON responses, missing error monitoring

---

## 8. Business Logic

- [ ] Coupon/promo codes: single-use enforced server-side, expiry validated, bound to user
- [ ] Subscription status verified server-side before granting access
- [ ] Pricing calculated server-side — never trust client-submitted price
- [ ] Quantity/amount limits enforced (can't order -1 items, can't set price to $0)
- [ ] State transitions validated (order can't skip states, refund can't exceed charge)
- [ ] User can only access their own data (horizontal privilege escalation check)
- [ ] Admin actions require re-authentication or confirmation for destructive ops

**Common AI-gen failures:** price from client body, infinite coupon reuse, no ownership checks on resources

---

## 9. AI / LLM Features

*(Skip if app has no AI/LLM integration)*

- [ ] User input sanitized before injection into prompts
- [ ] LLM output treated as untrusted — sanitized before rendering or executing
- [ ] System prompt not exposed in client-side code or API responses
- [ ] No secrets, credentials, or PII in LLM context
- [ ] AI endpoints rate-limited aggressively
- [ ] Generated code not executed without human review
- [ ] Generated SQL/queries not executed directly
- [ ] Abuse monitoring: unusual token usage, repeated jailbreak attempts

**Common AI-gen failures:** unsanitized user input in prompts, no rate limiting on AI routes, system prompt leakage

---

## 10. Dependencies & Supply Chain

- [ ] `npm audit` / `pnpm audit` run — no critical CVEs unaddressed
- [ ] Unused packages removed
- [ ] Dependencies up to date (especially auth, crypto, parsing libraries)
- [ ] Dependabot or Renovate configured for automated PRs
- [ ] No abandoned packages (last commit > 2 years, no maintainer response)
- [ ] Lock file committed (`package-lock.json` or `pnpm-lock.yaml`)
- [ ] No packages with suspicious install scripts

**Common AI-gen failures:** outdated dependencies suggested by LLM training data, no audit step

---

## 11. CI/CD & Repository

- [ ] Secrets not hardcoded in CI config files
- [ ] Branch protection on `main`/`production` (requires PR + review)
- [ ] GitHub secret scanning enabled
- [ ] 2FA required for all team members
- [ ] SAST tool integrated (Snyk, Semgrep, or SonarQube)
- [ ] Deployment blocked on critical vulnerability detection
- [ ] Production access restricted (SSO, VPN, or IP allowlist)