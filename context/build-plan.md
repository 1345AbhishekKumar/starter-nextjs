# Build Plan

## Core Principle

Full page UI built with mock data first — verified visually before any logic is written. Then functionality is built and wired to the UI step by step. Every feature must be visible and testable before moving to the next. No invisible backend phases.

---

## Phase 1 — Foundation

### 01 Project Setup & UI Foundation

Set up the project and install all dependencies. Create the base UI shell.

**UI:**

- Root layout with fonts, metadata, and `ThemeProvider`
- Navbar — logo, navigation links (Dashboard, Settings, Admin), user avatar (placeholder until auth), theme toggle
- Footer with copyright, links
- Global CSS with Tailwind and shadcn/ui variables
- Basic `cn()` utility and component primitives (Button, Card, etc.)

**Logic:**

- Initialize Next.js 16 with TypeScript, App Router
- Install all dependencies (see package list)
- Configure Tailwind CSS v3, shadcn/ui, next-themes
- Set up `@t3-oss/env-nextjs` with environment validation
- Create folder structure (`src/app`, `src/components`, `src/lib`, etc.)
- Configure ESLint, Prettier, Husky, lint-staged

---

## Phase 2 — Landing Page (Homepage)

### 02 Homepage — Full UI with Mock Data

Build the complete homepage UI.

**UI:**

- Navbar (from foundation) with links to /sign-in, /sign-up, /dashboard (if logged in)
- Hero section — headline, subheadline, CTA buttons (Get Started, Learn More)
- Features section — 3-4 value props with icons and descriptions
- Testimonial or trust section (logos, quotes)
- Bottom CTA section
- Footer

**Logic:**

- CTA buttons → `/sign-up` for unauthenticated, `/dashboard` for authenticated (middleware handles redirect)
- No other logic yet — purely static.

---

## Phase 3 — Authentication

### 03 Sign In / Sign Up Pages

Build the authentication pages using Clerk components.

**UI:**

- Sign-in page (`/sign-in`) — email/password + Google/GitHub OAuth buttons (Clerk pre-built)
- Sign-up page (`/sign-up`) — similar, with full name field

**Logic:**

- Install `@clerk/nextjs` and configure with env vars
- Add `ClerkProvider` in root layout
- Create `middleware.ts` protecting `/dashboard`, `/settings`, `/admin`
- After sign-in → redirect to `/dashboard`
- Session available via `auth()` in Server Components, `useUser()` in Client

---

## Phase 4 — Database & Initial Data

### 04 Database Schema & Migrations

Define the core tables and set up migrations.

**UI:**

- No UI — infrastructure phase.

**Logic:**

- Install `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`
- Create Drizzle client with Neon HTTP driver in `src/db/index.ts`
- Define schemas: `users` (sync with Clerk webhook), `profiles`, `posts` (example), `subscriptions`
- Generate and run migrations
- Set up seed script for development

---

## Phase 5 — Dashboard Page

### 05 Dashboard — Full UI with Mock Data

Build the dashboard page UI with mock stats and charts.

**UI:**

- Protected route (middleware)
- Stats cards: Total Users, Active Sessions, New Sign-ups (this week) — mock numbers
- Recent activity feed (mock entries)
- Charts placeholder (e.g., user growth over time, activity by day)
- Quick actions (e.g., "Create Post", "Invite User")

**Logic:**

- No real data yet — mock data hardcoded for visual testing.

---

## Phase 6 — Profile / Settings Page

### 06 Profile Page — Full UI with Mock Data

Build the user profile/settings page.

**UI:**

- Profile form — Name, Email (read-only), Bio, Website, Avatar upload placeholder
- Two sections: "Profile Information" and "Account Settings" (change password, delete account — Clerk handles)
- Save button

**Logic:**

- No save logic yet — mock data pre-filled.

---

## Phase 7 — Example CRUD Page (e.g., "Posts")

### 07 Posts List Page — Full UI with Mock Data

Build a page to demonstrate data listing, filtering, and pagination.

**UI:**

- Page header with "Create Post" button
- Search bar
- Filter dropdown (e.g., status: Draft/Published)
- Table columns: Title, Status, Created At, Actions (Edit, Delete)
- Pagination controls

**Logic:**

- Mock data array rendered in table
- Search and filter filter the mock array (client-side)
- Pagination works on mock data (split array)

---

### 08 Create/Edit Post Page — Full UI with Mock Form

Build a form page for creating/editing a post.

**UI:**

- Form fields: Title (input), Content (textarea), Status (select: Draft/Published)
- Submit and Cancel buttons
- Validation error display (mock)

**Logic:**

- Form with React Hook Form and Zod (mock schema)
- No actual DB save — just console.log on submit

---

## Phase 8 — Database Integration (Post CRUD)

### 09 Posts CRUD — Real Data

Wire the posts pages to actual database operations.

**UI:**

- Same as above — no UI changes.

**Logic:**

- Create Server Actions: `getPosts`, `createPost`, `updatePost`, `deletePost`
- Use Drizzle ORM with `userId` from Clerk session
- Server Action validation with Zod (same schema as form)
- `revalidatePath` after mutations to refresh list
- TanStack Query for list page (prefetch in RSC, useQuery on client)

---

## Phase 9 — Profile Save Logic

### 10 Profile Save — Real Data

Wire profile form to actual database updates.

**UI:**

- No UI changes.

**Logic:**

- Server Action `updateProfile` validates with Zod and updates `profiles` table
- On success → revalidatePath, show toast
- Avatar upload: integrate Uploadcare

---

## Phase 10 — File Uploads (Uploadcare)

### 11 Avatar Upload — Real Data

Enable avatar upload directly to Uploadcare CDN and store metadata in Neon.

**UI:**

- Avatar upload button with drag-and-drop
- Progress indicator

**Logic:**

- Install `@uploadcare/upload-client` (JS) or `pyuploadcare` (Python) and set up credentials
- Create upload component using Uploadcare client SDK / widgets
- On success, save file metadata (UUID, CDN URL, userId) to Neon DB and update profile with new avatar URL

---

## Phase 11 — Payments (Stripe)

### 12 Pricing Page & Subscription

Build a pricing page and integrate Stripe Checkout.

**UI:**

- Pricing page with three plan cards (Free, Pro, Enterprise) — mock
- "Subscribe" button on each card
- Success and cancel pages

**Logic:**

- Install `stripe` SDK
- Server Action `createCheckoutSession` creates session and redirects
- Webhook handler for `checkout.session.completed` to update user plan in DB
- Dashboard shows current plan

---

## Phase 12 — Email (Resend)

### 13 Welcome Email & Notifications

Send transactional emails using Resend.

**UI:**

- No direct UI — but email templates are React components.

**Logic:**

- Install `resend` and `@react-email/components`
- Create `WelcomeEmail` template
- In sign-up webhook (or after user creation), send welcome email
- Provide Server Action `sendEmail` for future use

---

## Phase 13 — Logging & Error Tracking

### 14 Pino + Sentry Integration

Set up structured logging and error monitoring.

**UI:**

- No UI — but errors appear in Sentry dashboard.

**Logic:**

- Install `pino`, `pino-pretty`, `@sentry/nextjs`
- Create logger singleton with request context
- In middleware, inject request ID
- In Server Actions and API routes, add `Sentry.captureException` on errors
- Set up Sentry error boundary in root layout

---

## Phase 14 — Analytics (PostHog)

### 15 PostHog Integration

Set up product analytics and feature flags.

**UI:**

- No direct UI — but analytics events tracked.

**Logic:**

- Install `posthog-js` and `posthog-node`
- Provider in root layout, identify user after login
- Track events: `user_signed_up`, `profile_updated`, `post_created`, `subscription_started`

---

## Phase 15 — Testing

### 16 Unit & Integration Tests (Vitest)

Write tests for components, hooks, and Server Actions.

**UI:**

- No UI — test runner.

**Logic:**

- Install `vitest`, `@testing-library/react`, `jsdom`
- Configure with coverage thresholds (70%)
- Write tests for utility functions, `cn()`, `formatDate`
- Write tests for `updateProfile` Server Action (mocked DB)
- Write tests for `PostForm` component

---

### 17 E2E Tests (Playwright)

Write end-to-end tests covering key user flows.

**UI:**

- No UI — test runner.

**Logic:**

- Install `@playwright/test`
- Write tests for: sign-up, login, profile update, create post, logout
- Add accessibility checks with `@axe-core/playwright` in CI

---

## Phase 16 — CI/CD (GitHub Actions)

### 18 Continuous Integration Pipeline

Set up automated checks on every pull request.

**UI:**

- No UI — pipeline execution.

**Logic:**

- Create `.github/workflows/ci.yml` with:
  - Type-check
  - Lint
  - Format check
  - Unit tests with coverage
  - Build
  - E2E tests (Playwright) on built app
- Cache dependencies (pnpm)
- Enforce coverage thresholds

---

### 19 Deployment Pipeline (Vercel)

Set up automatic deployment to Vercel on main branch.

**UI:**

- No UI — deployment process.

**Logic:**

- Connect repo to Vercel
- Create `.github/workflows/deploy.yml` that runs on push to main
- Run migrations before deploy
- Deploy using Vercel CLI
- Post-deploy health check

---

## Phase 17 — Polish & Documentation

### 20 Final Polishing

Add final touches and developer documentation.

**UI:**

- Add favicon, metadata, Open Graph images
- Ensure consistent spacing and responsive design
- Tidy up any unused imports

**Logic:**

- Write comprehensive `README.md` with setup instructions, stack overview, and contribution guide
- Add `.env.example` with all required variables
- Create `docs/` folder with architecture diagrams and usage guides
- Remove all mock data fallbacks (ensure everything uses real data)

---

## Feature Count

| Phase                    | Features |
| ------------------------ | -------- |
| Phase 1 — Foundation     | 1        |
| Phase 2 — Landing        | 1        |
| Phase 3 — Auth           | 1        |
| Phase 4 — Database       | 1        |
| Phase 5 — Dashboard      | 1        |
| Phase 6 — Profile        | 1        |
| Phase 7 — Posts (CRUD)   | 2        |
| Phase 8 — DB Integration | 1        |
| Phase 9 — Profile Save   | 1        |
| Phase 10 — Uploads       | 1        |
| Phase 11 — Payments      | 1        |
| Phase 12 — Email         | 1        |
| Phase 13 — Logging       | 1        |
| Phase 14 — Analytics     | 1        |
| Phase 15 — Testing       | 2        |
| Phase 16 — CI/CD         | 2        |
| Phase 17 — Polish        | 1        |
| **Total**                | **20**   |
