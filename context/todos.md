# TODOS.md — Starter NextJS

> Phased, start-to-end build plan for the Starter NextJS project.
> **Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, next-themes, Clerk Auth, Drizzle ORM, Neon DB, Uploadcare, Stripe, Resend, Pino, Sentry, PostHog, Vitest, Playwright.
> **Type:** Web | **Solo**
> **Generated:** 2026-07-01

---

## Legend

- [ ] Not started | [~] In progress | [x] Done
- 🔴 High priority | 🟡 Medium | 🟢 Low
- **Complexity:** `S` < 2hrs · `M` half-day · `L` full day · `XL` 2+ days

---

## Phase 1 — Foundation

> **Goal:** Set up the base project workspace, configure dependencies, validate environments, and create the core UI layout shell.
> **Estimated:** 2 days
> **Ships when:** The Next.js dev server runs locally with a clean dashboard layout, theme toggle, and environment variable checking.

### Project Setup & UI Foundation

- [ ] **Configure Project & Base UI Layout** `[L]` 🔴
  - **What:** Initialize project configurations, setup base CSS, write environment schema rules, and construct root layout files with header navbar and footer containers.
  - **Why:** Establishes codebase configuration rules and baseline responsive layouts before implementing features.
  - **Stack notes:** Next.js 16, `@t3-oss/env-nextjs`, `next-themes`, Tailwind CSS, shadcn/ui.
  - **Subtasks:**
    - [x] Verify core Next.js configuration and folder structures (`src/app`, `src/components`, `src/lib`)
    - [x] Install core dependencies (`clsx`, `tailwind-merge`, `lucide-react`, `next-themes`, etc.)
    - [x] Set up Zustand, TanStack Query, and nuqs dependencies and providers
    - [ ] Write environment schemas in `src/env.js` validating system values
    - [x] Configure Tailwind CSS rules and import global design variables in global CSS files
    - [x] Implement responsive root layouts with unified metadata, custom fonts, and theme providers
    - [x] Build core UI layout modules: `Navbar`, `Footer`, and `ThemeToggle`
  - **Acceptance criteria:**
    - [x] running `npm run dev` builds the layout shell on `localhost:3000` with zero compile errors
    - [x] Theme toggle switches between light and dark modes, updating HTML classes appropriately
    - [x] Unset required environment variables trigger `@t3-oss/env-nextjs` validation crash during startup

---

## Phase 2 — Landing Page (Homepage)

> **Goal:** Construct a static landing homepage showcasing value props and routing users to registration/login portals.
> **Estimated:** 2 days
> **Ships when:** A responsive marketing homepage is online containing CTA routes to authentication endpoints.

### Marketing Landing Page

- [x] **Build Static Homepage** `[M]` 🔴
  - **What:** Create landing page sections including Hero graphics, value prop lists, testimonial modules, and bottom Call-To-Action segments.
  - **Why:** Communicates product features to unregistered traffic, converting them to active users.
  - **Stack notes:** Tailwind CSS, `next/image` for media files, standard shadcn buttons.
  - **Subtasks:**
    - [x] Create landing route at `app/page.tsx` displaying the hero element with CTA links
    - [x] Design value proposition grids containing cards detailing app features
    - [x] Design social proof and user testimonial sections with mock reviews
    - [x] Build bottom signup banner container with secondary action buttons
    - [x] Wire links routing unauthenticated traffic to `/sign-up` and signed-in traffic to `/dashboard`
  - **Acceptance criteria:**
    - [x] Responsive grid structure scales fluidly without overflow across mobile, tablet, and wide screens
    - [x] Clicking CTA buttons successfully changes URL paths targeting `/sign-up` or `/dashboard`

---

## Phase 3 — Authentication

> **Goal:** Secure the application and manage user identities using Clerk.
> **Estimated:** 1.5 days
> **Ships when:** Sign-in and sign-up interfaces are active, and unauthorized navigation to dashboard routes is blocked.

### Authentication & Routing

- [x] **Integrate Clerk Authentication** `[M]` 🔴
  - **What:** Configure the Clerk auth provider, create dedicated auth pages, and set up route protection middleware.
  - **Why:** Restricts access to sensitive workspace dashboard paths and handles user login flows securely.
  - **Stack notes:** `@clerk/nextjs` SDK, `ClerkProvider`, `auth()`, `useUser()`, Next middleware.
  - **Subtasks:**
    - [x] Set up Clerk API key configurations inside local environment settings
    - [x] Wrap root layouts in the unified `<ClerkProvider>` context
    - [x] Create the sign-in page at `app/sign-in/[[...sign-in]]/page.tsx` using Clerk `<SignIn />`
    - [x] Create the sign-up page at `app/sign-up/[[...sign-up]]/page.tsx` using Clerk `<SignUp />`
    - [x] Build `proxy.ts` protecting `/dashboard`, `/settings`, and `/admin` routes
    - [x] Update Navbar controls showing authenticated profiles or sign-in buttons conditionally
  - **Acceptance criteria:**
    - [x] Direct navigation to `/dashboard` while signed out redirects user to `/sign-in`
    - [x] Completing credentials login routes the user to the secure `/dashboard` screen
    - [x] Clicking logout terminates the user session and returns route to homepage

---

## Phase 4 — Database & Initial Data

> **Goal:** Set up the database infrastructure, define relations schemas, and populate mock data for development.
> **Estimated:** 1 day
> **Ships when:** Database tables are configured, and migrations run successfully on the live Neon service.

### Database Setup

- [x] **Setup Drizzle ORM & Neon Connection** `[M]` 🔴
  - **What:** Connect database clients, map ORM schemas, generate SQL migrations, and configure data seed scripts.
  - **Why:** Prepares the persistence layer representing users, settings, and CRUD tables.
  - **Stack notes:** `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless` connection driver.
  - **Subtasks:**
    - [x] Install database packages and configure `drizzle.config.ts` options
    - [x] Initialize the Neon HTTP connection instance in `src/db/index.ts`
    - [x] Write schema models at `src/db/schema.ts` defining `users`, `profiles`, `posts`, and `subscriptions`
    - [x] Generate SQL migrations using `npx drizzle-kit generate` command
    - [x] Apply migrations to the live database using `npx drizzle-kit migrate` command
    - [x] Write a development seed script file inserting dummy records for test profiles
  - **Acceptance criteria:**
    - [x] Migration outputs produce valid files in database migrations directories
    - [x] Running seed scripts successfully populates target database tables without constraint violations

---

## Phase 5 — Dashboard Page

> **Goal:** Create a visual workspace dashboard displaying summary panels and activity statistics using mock values.
> **Estimated:** 1.5 days
> **Ships when:** Authenticated users see an interactive dashboard populated with status cards and chart placeholders.

### User Dashboard

- [ ] **Build Dashboard Workspace Layout** `[M]` 🟡
  - **What:** Implement the secure dashboard page wrapper presenting stats metrics, activity feeds, and action buttons.
  - **Why:** Serves as the primary operational user interface after authentication.
  - **Stack notes:** Recharts (or styling charts), shadcn cards, protected routes.
  - **Subtasks:**
    - [ ] Create page layout container at `app/dashboard/page.tsx`
    - [ ] Design numerical KPI metrics blocks (Active Sessions, New Users) using mock numbers
    - [ ] Add mock recent user action feed lists detailing recent events
    - [ ] Render visual charts summarizing activity trends using mock data points
    - [ ] Add top dashboard action buttons linking to creation page portals
  - **Acceptance criteria:**
    - [ ] Dashboard is inaccessible to unauthenticated users, triggering redirect flows
    - [ ] Grid contents automatically wrap, aligning vertically on small screen viewports

---

## Phase 6 — Profile / Settings Page

> **Goal:** Design the profile customization screen containing validated settings inputs.
> **Estimated:** 1 day
> **Ships when:** Users can view the settings page form displaying correct input validation.

### Profile Settings

- [ ] **Build Profile Form Interface** `[S]` 🟡
  - **What:** Write user profile settings pages displaying username, biographical text, and avatar fields.
  - **Why:** Grants users control over details displayed publicly on their profiles.
  - **Stack notes:** `react-hook-form`, `zod`, `@hookform/resolvers/zod`.
  - **Subtasks:**
    - [ ] Design route at `app/settings/page.tsx` with dedicated sidebar options tabs
    - [ ] Build form fields mapping to Name, read-only Email, Bio, and Website inputs
    - [ ] Apply Zod validation constraints enforcing string limits and URL formatting rules
    - [ ] Integrate Clerk credentials hooks enabling profile updates within settings
  - **Acceptance criteria:**
    - [ ] Submitting blank mandatory inputs triggers inline form validation errors
    - [ ] Submitting valid settings outputs inputs to the browser console logs (mocked)

---

## Phase 7 — Example CRUD Page (e.g., "Posts")

> **Goal:** Implement posts management interfaces using mock arrays before connecting database logic.
> **Estimated:** 2 days
> **Ships when:** Users can search, filter, paginate mock post items, and see forms validating input fields.

### CRUD UI Interface

- [ ] **Build Posts Listing Table** `[M]` 🟡
  - **What:** Build a data table showing mock post records, search filters, and status dropdowns.
  - **Why:** Provides administrative control and lists post entries.
  - **Stack notes:** Table UI elements, client-side pagination, client-side array search.
  - **Subtasks:**
    - [ ] Create route at `app/dashboard/posts/page.tsx` with headers and creation buttons
    - [ ] Build custom tables mapping data fields (Title, Status, Created At, Action Links)
    - [ ] Write client search logic filtering mock data arrays on keyup events
    - [ ] Write status category dropdown filtering active mock rows
    - [ ] Implement pagination selectors slicing array ranges
  - **Acceptance criteria:**
    - [ ] Typing query strings updates the visible table rows matches the title keys
    - [ ] Changing page indices displays correct pagination subsets of data arrays

- [ ] **Build Posts Creation Form** `[S]` 🟡
  - **What:** Create input forms for writing new posts with title, text editor, and publishing options.
  - **Why:** Provides the UI canvas to author content.
  - **Stack notes:** `react-hook-form`, `zod` schema resolvers.
  - **Subtasks:**
    - [ ] Create the new post form container page under `app/dashboard/posts/new/page.tsx`
    - [ ] Add Form fields for Title, Content text area, and Status selection
    - [ ] Apply validation rules requiring titles and contents before submitting
  - **Acceptance criteria:**
    - [ ] Incomplete inputs trigger visual validation messages on screen
    - [ ] Submitting valid configurations fires alert toast notifications (mocked)

---

## Phase 8 — Database Integration (Post CRUD)

> **Goal:** Connect database integrations to posts CRUD pages using Next.js Server Actions and TanStack Query.
> **Estimated:** 2 days
> **Ships when:** Database queries perform all post listings, creation, edits, and deletions securely.

### DB Post Integration

- [ ] **Connect CRUD to Database Server Actions** `[L]` 🔴
  - **What:** Implement mutation Server Actions, wrap queries in TanStack Query, and replace mock layers.
  - **Why:** Enables persistent data storage for all user posts.
  - **Stack notes:** Server Actions, `drizzle-orm`, `@tanstack/react-query` query hooks.
  - **Subtasks:**
    - [ ] Write Server Actions: `getPosts`, `createPost`, `updatePost`, and `deletePost`
    - [ ] Add Zod inputs parser inside Server Actions, validating owner user IDs
    - [ ] Configure `revalidatePath` calls inside actions to update client caching layers
    - [ ] Wire TanStack Query providers to manage post list queries and mutations
    - [ ] Replace UI mock array templates with database query hooks
  - **Acceptance criteria:**
    - [ ] Creating posts writes records to Neon DB tables
    - [ ] Deleting posts deletes database row entries and updates current list tables instantly

---

## Phase 9 — Profile Save Logic

> **Goal:** Wire settings forms to write profile updates to the database.
> **Estimated:** 1 day
> **Ships when:** Saved profile setting configurations are stored in the database.

### DB Settings Integration

- [ ] **Wire Profile Settings Actions** `[S]` 🟡
  - **What:** Create the `updateProfile` Server Action, connect the form, and show success toasts.
  - **Why:** Ensures settings adjustments persist across logins.
  - **Stack notes:** Server Actions, `drizzle-orm` update statements, shadcn toasts.
  - **Subtasks:**
    - [ ] Write `updateProfile` Server Action with inputs validation
    - [ ] Connect settings form submit events to trigger the new Server Action
    - [ ] Add loading indicators and toast confirmations on response completion
  - **Acceptance criteria:**
    - [ ] Submitting profile form writes changes to the database
    - [ ] Refreshing pages displays correct saved settings values

---

## Phase 10 — File Uploads (Uploadcare)

> **Goal:** Implement image file uploads to Uploadcare CDN and store metadata in Neon for user avatars.
> **Estimated:** 1 day
> **Ships when:** Users can upload custom images from settings and see updated avatar icons immediately.

### Asset Uploads

- [ ] **Integrate Uploadcare Media Service** `[M]` 🟡
  - **What:** Set up API upload integration, render upload button/widget, and save asset CDN URLs and UUIDs.
  - **Why:** Enables users to upload custom profile pictures.
  - **Stack notes:** `@uploadcare/upload-client`, `uploadcare_files` metadata table in Neon DB.
  - **Subtasks:**
    - [ ] Set up Uploadcare keys, dependencies, and metadata table schema in Neon
    - [ ] Create backend API route/Server Action for saving and validating metadata
    - [ ] Integrate Uploadcare upload widget/SDK in settings page
    - [ ] Update profile database columns with the returned image URLs on upload success
  - **Acceptance criteria:**
    - [ ] Uploading an image to Uploadcare executes successfully and metadata is saved in Neon DB
    - [ ] New images update profile database records and display in page headers

---

## Phase 11 — Payments (Stripe)

> **Goal:** Set up monetization checkout pipelines using Stripe subscription billing.
> **Estimated:** 2 days
> **Ships when:** Users can purchase subscription plans and view updated tier settings on success.

### Payments Integration

- [ ] **Integrate Stripe Billing Pipelines** `[XL]` 🔴
  - **What:** Create billing tables, checkout page redirect hooks, webhook handlers, and plan checks.
  - **Why:** Monetizes the application platform.
  - **Stack notes:** `stripe` NPM package, Stripe Webhooks, API routes.
  - **Subtasks:**
    - [ ] Configure Stripe Developer credentials inside local environment variables
    - [ ] Design pricing tier selections showing Free, Pro, and Enterprise options
    - [ ] Write `createCheckoutSession` Server Action redirecting users to checkout portal
    - [ ] Create API route handler at `app/api/webhooks/stripe/route.ts` parsing checkout events
    - [ ] Handle `checkout.session.completed` events updating subscriber status in DB
  - **Acceptance criteria:**
    - [ ] Clicking premium plan buttons opens Stripe's Hosted payment dashboard
    - [ ] Test purchase webhook signals success, upgrading database profiles to premium tiers

---

## Phase 12 — Email (Resend)

> **Goal:** Set up automatic welcome email delivery using Resend.
> **Estimated:** 1 day
> **Ships when:** Registering a new account triggers delivery of welcome emails to the user's inbox.

### Email Notification System

- [ ] **Setup Resend Transactional Email** `[M]` 🟢
  - **What:** Configure email templates using React Email components, trigger sends via Resend client APIs.
  - **Why:** Welcomes new users and delivers transactional details.
  - **Stack notes:** `resend`, `@react-email/components`.
  - **Subtasks:**
    - [ ] Set up Resend API credentials inside environment configuration files
    - [ ] Design welcome email templates using `@react-email/components`
    - [ ] Wire welcome email dispatching to trigger when user signup events complete
    - [ ] Write email sending helper methods for general use
  - **Acceptance criteria:**
    - [ ] Completing new signups triggers API requests delivering emails
    - [ ] HTML email templates render properly across mobile and desktop clients

---

## Phase 13 — Logging & Error Tracking

> **Goal:** Set up Pino logging and Sentry error boundaries to trace logs and catch exceptions.
> **Estimated:** 1 day
> **Ships when:** System logs format as JSON and unhandled exceptions upload to Sentry dashboards.

### Monitoring & Error Tracking

- [x] **Setup Pino and Sentry Monitoring** `[M]` 🔴
  - **What:** Write log singleton helpers, set up Sentry configurations, and wrap app errors in custom boundary layouts.
  - **Why:** Provides observability and diagnostic tools for production incidents.
  - **Stack notes:** `pino`, `pino-pretty`, `@sentry/nextjs`.
  - **Subtasks:**
    - [x] Implement Pino logging clients configuring standard JSON output formats
    - [x] Run Sentry Next.js configuration scripts initializing server/client tracers
    - [x] Insert global error boundary elements at root React layout modules
    - [x] Add try-catch blocks to API endpoints and actions reporting issues to Sentry
  - **Acceptance criteria:**
    - [x] Fatal application crashes render custom error UI fallbacks
    - [x] Logged failures upload details to Sentry issues console pages

---

## Phase 14 — Analytics (PostHog)

> **Goal:** Integrate PostHog product tracking to record user behavior analytics.
> **Estimated:** 1 day
> **Ships when:** Client navigation actions and custom feature interactions are sent to PostHog.

### Product Analytics

- [ ] **Integrate PostHog Analytics** `[S]` 🟢
  - **What:** Set up client provider contexts, log pageview changes, and track custom features.
  - **Why:** Observes user interaction trends to guide product updates.
  - **Stack notes:** `posthog-js`, `posthog-node`.
  - **Subtasks:**
    - [ ] Register PostHog scripts inside root layout client files
    - [ ] Enable automatic path routing pageview logging features
    - [ ] Write event capture commands for user signups, checkouts, and post creation
  - **Acceptance criteria:**
    - [ ] Page navigation events appear in the PostHog debugger panel
    - [ ] Custom feature events (e.g. checkout click) send associated metadata parameters

---

## Phase 15 — Testing

> **Goal:** Set up unit, integration, and E2E test suites to verify stability.
> **Estimated:** 2.5 days
> **Ships when:** Vitest and Playwright test commands execute successfully and meet code coverage targets.

### Quality Assurance Testing

- [ ] **Write Vitest Unit and Integration Tests** `[M]` 🔴
  - **What:** Set up Vitest configuration, write unit tests for utils and component validation tests.
  - **Why:** Verifies logical components perform correctly in isolation.
  - **Stack notes:** `vitest`, `@testing-library/react`, `jsdom`.
  - **Subtasks:**
    - [ ] Configure `vitest.config.ts` environment options
    - [ ] Write unit tests verifying core logic helpers (formatters, parser functions)
    - [ ] Write integration test cases mocking settings form Server Actions
  - **Acceptance criteria:**
    - [ ] Running testing commands passes all local unit tests
    - [ ] Test coverage results exceed the 70% threshold configuration target

- [ ] **Write Playwright E2E Tests** `[M]` 🔴
  - **What:** Setup Playwright testing suites, write user scenario tests, and test accessibility rules.
  - **Why:** Validates end-to-end user actions under simulated browser sessions.
  - **Stack notes:** `@playwright/test`, `@axe-core/playwright`.
  - **Subtasks:**
    - [ ] Install Playwright browser frameworks
    - [ ] Write E2E login/logout session navigation flows
    - [ ] Write post creation tests (navigating dashboard, writing data, listing results)
    - [ ] Integrate automated accessibility scanning checking public page compliance
  - **Acceptance criteria:**
    - [ ] Running E2E scripts executes and passes all browser tests successfully
    - [ ] Accessibility reviews output zero critical WCAG AA warnings on landing pages

---

## Phase 16 — CI/CD (GitHub Actions)

> **Goal:** Automate code linting, building, and deployment checks on code delivery.
> **Estimated:** 2 days
> **Ships when:** Pull requests run build steps automatically, and commits to main deploy updates to Vercel.

### Deployment & CI Pipeline

- [ ] **Setup GitHub Actions CI Pipeline** `[M]` 🔴
  - **What:** Write GitHub workflow files checking types, syntax, formatting, and executing tests.
  - **Why:** Prevents breaking changes from merging into the main branch.
  - **Stack notes:** GitHub Actions.
  - **Subtasks:**
    - [ ] Create YAML configuration files at `.github/workflows/ci.yml`
    - [ ] Configure environment setups caching active package folders
    - [ ] Set up lint runs, formatter reviews, and TypeScript type-check steps
    - [ ] Run Vitest unit tests and headless Playwright runs on PR updates
  - **Acceptance criteria:**
    - [ ] GitHub Actions trigger and run checks when updating pull requests
    - [ ] Merges are blocked if any pipeline checks fail

- [ ] **Setup Continuous CD Deployment** `[M]` 🔴
  - **What:** Connect Vercel hosting, run database migrations, and deploy live updates.
  - **Why:** Automates release procedures on the main branch.
  - **Stack notes:** Vercel Hosting CLI, Drizzle ORM migrations.
  - **Subtasks:**
    - [ ] Link production repository folders to Vercel hosting platforms
    - [ ] Write deployment commands executing migration scripts before app bundle creation
    - [ ] Add production secret keys inside hosting dashboard variable sections
  - **Acceptance criteria:**
    - [ ] Commits pushed to the main branch start production builds on Vercel
    - [ ] DB changes migrate automatically before traffic points to new build

---

## Phase 17 — Polish & Documentation

> **Goal:** Run optimization checks, design favicon files, and write developer onboarding guides.
> **Estimated:** 1 day
> **Ships when:** Lighthouse scores exceed 90, and complete setup docs are present.

### Final Production Polish

- [ ] **Final Polish & Documentation** `[S]` 🟢
  - **What:** Add asset files, SEO tags, clean mock layers, and write developer READMEs.
  - **Why:** Organizes codebases for production handoffs and live traffic.
  - **Stack notes:** Next.js Metadata API.
  - **Subtasks:**
    - [ ] Add site favicon, apple-touch-icons, and social share OG images
    - [ ] Configure SEO keywords and descriptions on layouts using Metadata APIs
    - [ ] Audit application codebases removing leftover debugging flags or mock variables
    - [ ] Write `README.md` explaining configurations, setup steps, and directory layout
    - [ ] Create `.env.example` documenting all configuration keys
  - **Acceptance criteria:**
    - [ ] Lighthouse audits report performance, accessibility, and SEO scores above 90
    - [ ] Production compilation commands run without formatting or lint warnings
