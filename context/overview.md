# Starter Kit Overview

## About the Project

This starter kit is a production‑ready, opinionated foundation for building modern SaaS applications, AI‑powered tools, internal dashboards, and B2B portals. It comes with a carefully curated stack—Next.js 16 (App Router), TypeScript, Clerk for authentication, Drizzle ORM with Neon PostgreSQL, and a full suite of utilities for state management, payments, file uploads, analytics, and observability.

The starter is designed to eliminate the weeks of boilerplate setup and architectural decision‑making, so you can focus on your product’s unique value proposition from day one.

---

## The Problem It Solves

Starting a new web application involves dozens of repetitive, time‑consuming decisions:

- Which authentication library? (Clerk vs Auth.js vs custom)
- How to handle database migrations? (Prisma, Drizzle, or raw SQL?)
- How to structure state? (Redux, Zustand, Context, or URL?)
- Which UI component library? (shadcn, MUI, Radix?)
- How to handle forms, validation, file uploads, payments, email, logging, error tracking, and analytics?

Every project faces the same questions. This starter answers all of them with battle‑tested choices that work together seamlessly. It gives you a solid codebase, a clear folder structure, and a set of best practices—so you can start building your features immediately, not after weeks of plumbing.

---

## Pages

```
/                  → Landing page (marketing)
/sign-in           → Clerk authentication (Google + GitHub OAuth)
/sign-up           → Registration
/dashboard         → Protected overview (user profile, stats, quick actions)
/settings          → User settings, profile editing
/admin             → Admin dashboard (role‑protected)
/api/webhooks/…   → Stripe, Clerk, custom webhooks
```

---

## Navigation

Top navbar with clean, minimal design. Includes:

- Logo / brand link
- Navigation links: Dashboard, Settings, (optional Admin)
- User avatar with dropdown (profile, sign out)
- Theme toggle (dark/light)

Full‑width layout on all pages. No sidebar.

---

## Core User Flow

### Sign‑up / Onboarding

- User signs up via Clerk (Google or GitHub OAuth, or email/password)
- On first login → redirected to onboarding or dashboard
- Incomplete profile banner appears if profile is not filled

### Authentication & Authorization

- Clerk manages sessions, MFA, organizations (for multi‑tenant SaaS)
- Middleware protects routes, redirects unauthenticated users
- Role‑based access control (RBAC) via Clerk metadata (`admin`, `member`)
- Admin routes guarded with role checks

### Dashboard

- Stats cards: total users, active sessions, recent sign‑ups (customise to your product)
- Recent activity feed (from your own data or audit logs)
- Quick actions (e.g., “Create new project”, “Invite team member”)

### Profile & Settings

- User profile form (name, email, avatar)
- Profile updates stored in database (Drizzle)
- Secure file uploads for avatar or documents via UploadThing

### Admin Area (optional)

- Admin‑only route group with role guard
- User management list (search, filter, role changes)
- System status or analytics

### Payments (Stripe)

- Subscription plans defined in Stripe
- Checkout session redirects
- Customer Portal for managing subscriptions
- Webhooks handle subscription updates, cancellations, payment failures
- User plan stored in DB and synced via webhooks

### File Uploads

- UploadThing provides type‑safe file routes
- Direct‑to‑S3 uploads from the client (no server proxy)
- File metadata stored in DB; validation rules (size, type) enforced

### Real‑time (optional)

- Socket.io for live notifications, chat, or collaborative features
- Upstash Redis used as pub/sub backend for horizontal scaling

### AI / Automation (optional)

- OpenAI SDK ready for integrating LLM capabilities
- Playwright for browser automation or web scraping workflows

### Observability

- Pino logs every request (request ID, user ID, duration)
- Sentry captures errors on server, client, and edge
- PostHog tracks product analytics and feature flags
- OpenTelemetry exports distributed traces for performance monitoring

---

## Data Architecture

### Core Tables (Drizzle + Neon)

- `users` – extends Clerk user data with app‑specific fields (plan, role, etc.)
- `profiles` – user‑editable profile information (bio, website, avatar)
- `organizations` (optional) – for multi‑tenant setups
- `subscriptions` – Stripe subscription status, plan, period
- `audit_logs` – immutable log of sensitive actions (optional, can be added)
- `webhook_events` – idempotency store for webhooks

### Storage

- User‑uploaded files stored in S3 (via UploadThing)
- Redis (Upstash) used for caching, rate‑limiting counters, and socket.io pub/sub

### Schema Design Principles

- Soft delete (`deletedAt`) on all tables
- Foreign keys indexed
- Audit fields (`createdAt`, `updatedAt`) on every table

---

## Features In Scope

- Next.js 16 App Router with Server Components, Server Actions, and React 19
- Full TypeScript support with strict mode
- Tailwind CSS v3 with shadcn/ui components (owned in your codebase)
- Clerk authentication with OAuth, MFA, organizations, and RBAC
- Drizzle ORM with Neon PostgreSQL (HTTP driver for edge compatibility)
- Zod validation (shared between client and server)
- React Hook Form with Zod resolver for forms
- TanStack Query for server‑state management (caching, optimistic updates)
- Zustand for client‑only UI state (modals, theme, sidebar)
- nuqs for type‑safe URL state (filters, pagination, sorting)
- UploadThing for file uploads (direct‑to‑S3)
- Stripe integration for subscription billing, checkouts, and webhooks
- Resend + React Email for transactional emails
- Socket.io (optional) for real‑time features
- Upstash Redis for caching and pub/sub
- Pino structured logging (with pino‑pretty in development)
- Sentry for error tracking and performance monitoring
- PostHog for product analytics and feature flags
- OpenTelemetry for distributed tracing (optional)
- next‑intl for internationalisation (i18n)
- next‑themes for dark/light mode
- @t3‑oss/env‑nextjs for type‑safe environment variables
- Vitest + Testing Library for unit/integration tests
- Playwright for E2E tests (with accessibility checks)
- ESLint (flat config), Prettier, Husky, lint‑staged for code quality
- GitHub Actions CI/CD pipeline (lint, test, build, deploy to Vercel)
- Dockerfile for self‑hosted deployment
- Feature‑based folder structure (scalable)

---

## Features Out of Scope

This starter intentionally does **not** include:

- A specific business domain (e.g., job hunting, e‑commerce) – it's a foundation, not an application
- Background job queues (BullMQ, QStash) – you can add them later if needed
- Full OpenTelemetry stack with Grafana/Prometheus (only SDK is included)
- Multi‑tenancy with RLS or schema‑per‑tenant (simple `tenantId` column pattern is included)
- Audit logs (we provide a schema, but you must implement the service)
- Real‑time features are optional (socket.io is in the stack but not wired by default)
- A complete admin panel (only a basic route group with role guard)
- A design system beyond shadcn/ui – you own and customise the components
- User‑facing documentation – this is for developers only

---

## PostHog Events (Optional)

The starter includes PostHog for analytics. You can track events like:

- `user_signed_up`
- `user_completed_onboarding`
- `payment_started`, `payment_succeeded`, `payment_failed`
- `file_uploaded`
- `feature_flag_evaluated`

---

## Target User

A developer or engineering team who wants to:

- Launch a SaaS product quickly without reinventing the wheel
- Have a clear, scalable architecture that avoids common pitfalls
- Use a modern, edge‑ready stack with full type safety
- Maintain full ownership of their code (no proprietary black boxes)
- Deploy to Vercel or self‑host with Docker

---

## Success Criteria

- A new developer can clone the repo, set up environment variables, and be running the app in under 5 minutes
- All integrations (auth, DB, payments, uploads, email, logging, analytics) work out of the box
- The codebase is well‑organised and easy to extend
- The starter covers 80% of what a typical SaaS needs, saving weeks of setup time
- The included testing and CI/CD pipeline ensure quality from day one
- The architecture scales from a solo developer to a team of 10+ without major rewrites
