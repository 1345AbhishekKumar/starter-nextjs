Here, we will list every mistake we made in the past—including the little details—so we do not repeat them:

- **Clerk Custom Flow CAPTCHA DOM Element Warning & Turnstile Duplicate Import**
  - **Issue**: Clerk logged warnings about `clerk-captcha` DOM element not found, falling back to Invisible CAPTCHA, along with Turnstile being loaded multiple times.
  - **Cause**: Rendering the `<div id="clerk-captcha" />` placeholder inside the `SignUpPage` component caused timing/hydration conflicts when React unmounted the page component on early returns (e.g., when the user is already authenticated) or during Next.js SPA client-side route transitions, while ClerkJS script was still executing.
  - **Solution**: Move the `<div id="clerk-captcha" />` element to the shared parent layout (`app/(auth)/layout.tsx`). This keeps the element permanently mounted and stable during transitions and early page returns, eliminating the warnings.
  - **Action**: Removed it from the page component and added it to the root of `AuthLayout`.

- **Clerk Dashboard Project Setup**
  - **Guideline**: Always create a new project in the Clerk Dashboard for new environments because Clerk uses internal configuration versions to match your Next.js project SDK version and structure correctly. Do not reuse old Clerk projects across different major SDK updates.

---

## 2026-07-19

- **Neon DB Cold-Start Crashing the Dashboard**
  - **Issue**: Navigating to `/dashboard` threw `NeonDbError: Error connecting to database: TypeError: fetch failed` after ~12 seconds, crashing the page with a 500 error.
  - **Cause**: Neon free-tier branches auto-suspend after inactivity. The `@neondatabase/serverless` driver uses HTTP fetch to query Neon. When the branch is asleep, the fetch times out before the branch wakes up. `ensureUserAndProfile` in `lib/users.ts` had no retry logic, so a single timeout was fatal.
  - **Solution**: Added `withDbRetry` utility to `lib/utils.ts` that retries only on transient connectivity errors (`fetch failed` / `Error connecting to database`) with exponential backoff (600ms → 1200ms, 3 attempts max). All other errors propagate immediately. Wrapped all three `db.query` reads in `ensureUserAndProfile` with it.
  - **Files Changed**: `lib/utils.ts` (new `withDbRetry`), `lib/users.ts` (wrapped DB reads).
  - **Note**: The DB connection itself was valid — `SELECT 1` succeeded immediately from the same machine. This was a cold-start timing issue, not a misconfiguration.

- **TypeScript Build Failure — Corrupted `routes.d.ts`**
  - **Issue**: `next build` failed with `Type error: Unexpected keyword or identifier` at line 64 of `.next/dev/types/routes.d.ts`, where the word `tSlotMap {` appeared as a bare statement (truncated from `LayoutSlotMap`).
  - **Cause**: The file was written twice concurrently — a race condition between the dev server's background type-writer and the build's type-checker. The second write clobbered the first mid-write, producing a doubled, partially-overwritten file.
  - **Solution**: Delete `.next` entirely and run a clean build. The file is auto-generated and regenerates correctly when written fresh.
  - **Prevention**: Never run `next dev` and `next build` simultaneously. They both write to `.next/dev/types/routes.d.ts` and will corrupt it.

- **Arcjet Test `TS2345` — Wrong `withRule` Call Shape**
  - **Issue**: `bun tsc --noEmit` reported `TS2345: Argument of type '{}' is not assignable to parameter of type 'ArcjetRule[]'` in `tests/unit/arcjet.test.ts` at lines 84 and 103.
  - **Cause**: The tests called `arcjetClient.withRule(customRule)` with a plain `{}` object. The actual `@arcjet/next` signature is `withRule<Rule extends ArcjetRule>(rule: Array<Rule>)` — it requires an **array**, not a single rule.
  - **Solution**: Cast the stub as `{} as unknown as ArcjetRule` and wrap it in an array: `arcjetClient.withRule([customRule])`.
  - **Files Changed**: `tests/unit/arcjet.test.ts` (lines 84 and 103).

---

## 2026-07-20

- **Next.js `<Image>` CDN Domain Blocking (Uploadcare Previews)**
  - **Issue**: Uploaded files on Uploadcare CDN did not render in the gallery preview divs (showing as broken images/alt text), but clicking them to open in a new tab worked.
  - **Cause**: Next.js `<Image>` component restricts allowed hostnames via `remotePatterns` in `next.config.ts`. The configuration only allowed subdomains `*.ucarecdn.com`, but the uploaded file URLs used the root/apex domain `ucarecdn.com` (and potentially `ucarecdn.net` / subdomains). Since the hostnames were not matched by the wildcard, Next.js blocked client-side rendering of the images.
  - **Solution**: Updated `next.config.ts`'s `images.remotePatterns` list to match wildcard subdomains and apex domains for both `.com` and `.net` domains via `"**.ucarecdn.com"` and `"**.ucarecdn.net"`.
  - **Files Changed**: `next.config.ts`

- **Avoid Using `any` and Loose `unknown` Types**
  - **Issue**: Using `any` or `unknown` types without proper runtime validation undermines TypeScript strict mode, allowing unvalidated data into server actions and components.
  - **Rule**: Do not use `any` or `unknown` types in the codebase. Always use strongly-typed TypeScript interfaces/types or validate `unknown` parameters using Zod schemas.
