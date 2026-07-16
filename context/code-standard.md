# STRTER-KITs: Code Standards

Implementation rules and conventions for the entire project. The AI agent must follow these in every session without exception. These rules prevent pattern drift across sessions.

---

## Engineering Mindset

The AI agent on this project operates as a senior engineer. This means:

- **Think before implementing** — understand what is being built and why before writing a single line
- **Read context files first** — never assume, always verify against architecture.md and project-overview.md
- **Scope is sacred** — only build what the current feature requires. Never go beyond scope even if it seems helpful
- **Every feature must be testable** — if it cannot be verified immediately after implementation, it is incomplete
- **Clean over clever** — simple readable code that a junior developer can understand is always preferred over clever abstractions
- **One thing at a time** — complete one feature fully before touching the next
- **Failures are expected** — wrap agent operations in try/catch, log failures, never let one failure crash everything

---

# Code Quality Standards

## General Rules

- Production-ready code only.
- No duplicate code.
- No dead code.
- No unused imports.
- No unused variables.
- No commented-out code.
- Reuse existing utilities and abstractions whenever possible.
- Keep implementations predictable and easy to maintain.

## TypeScript

- Strict mode enabled in tsconfig.json — no exceptions
- Never use `any` — use `unknown` and narrow the type
- Never use type assertions (`as SomeType`) unless absolutely necessary and commented why
- All function parameters and return types must be explicitly typed
- Use `type` for object shapes and unions — use `interface` only for extendable component props
- All async functions must have proper error handling — never let promises float unhandled
- Use `const` by default — only use `let` when reassignment is necessary

---

## Next.js 16 Conventions

- App Router only — no Pages Router
- React 19 — use React 19 APIs throughout
- All components are Server Components by default
- Only add `"use client"` when the component requires:
  - useState or useReducer
  - useEffect
  - Browser APIs
  - Event listeners
  - Client-side state/queries (Zustand, TanStack Query, React Hook Form)
  - Third party client-only libraries (PostHog browser side)
- Never add `"use client"` to layout files unless absolutely required
- Data fetching happens in Server Components (initial load) or TanStack Query (client actions) — never fetch raw endpoints directly in components without caching layers
- Route handlers live in `app/api/` — never put business logic directly in route handlers
- Server Actions live in `actions/` — never define Server Actions inline in components
- Caching is uncached by default — all dynamic code runs at request time
- Always read Next.js documentation before implementing any Next.js specific feature — APIs may differ from training data

---

## File and Folder Naming

- Folders: kebab-case — `project-details`, `task-board`, `organization-settings`
- Component files: PascalCase — `StatsBar.tsx`, `RecentActivity.tsx`
- Utility files: camelCase — `insforge-client.ts`, `posthog-client.ts`
- Type files: camelCase — `index.ts`
- API route files: always `route.ts`
- Server Action files: camelCase — `project.ts`, `task.ts`, `org.ts`
- One component per file — never export multiple components from one file
- Index files only in `components/ui/` — never barrel export from other folders

---

use for image optimization:

import Image from 'next/image'

export default function Page() {
return (
<Image
      src="/profile.png"
      width={500}
      height={500}
      alt="Picture of the author"
    />
)
}

## Component Structure

Every component follows this exact order:

```typescript
'use client'; // only if needed

// 1. External imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Internal imports
import { StatsCard } from '@/components/dashboard/StatsCard';

// 3. Type definitions
type Props = {
  taskId: string;
  projectId: string;
};

// 4. Component
export function ComponentName({ taskId, projectId }: Props) {
  // state
  // derived values
  // handlers
  // return JSX
}
```

- Never use default exports for components — always named exports
- Props type defined directly above the component — not in a separate types file unless shared
- No inline styles — all styling via Tailwind classes using CSS variables from ui-tokens.md

---

## API Route Handlers

```typescript
// app/api/agent/run/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // validate body
    // call agent function
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    logger.error({ error, path: '/api/agent/run' }, 'Failed to run agent');
    Sentry.captureException(error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
```

- Every route handler has a try/catch
- Every route handler validates the request body before processing (using Zod)
- Errors are logged via Pino with descriptive context
- Exceptions are sent to Sentry
- Always return `{ success: boolean, data?: T, error?: string }`

---

## Server Actions

```typescript
// actions/task.ts

'use server';

import { revalidatePath } from 'next/cache';
import { createInsforgeServer } from '@/lib/insforge-server';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

export async function updateTaskStatus(
  taskId: string,
  status: string,
  projectId: string,
) {
  try {
    const insforge = createInsforgeServer();
    // validate input
    // write to DB
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    logger.error({ error, taskId, status }, 'Failed to update task status');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to update task status' };
  }
}
```

- Every Server Action has a try/catch
- Errors are logged via Pino and reported to Sentry
- Every Server Action returns `{ success: boolean, error?: string }`
- Always call `revalidatePath` after mutations that affect page data
- Never throw from Server Actions — always return the error payload

---

## Agent Code

```typescript
// agent/analyzer.ts

export async function analyzeProjectRisks(
  projectId: string,
  runId: string,
): Promise<{ success: boolean; risks?: string[]; error?: string }> {
  try {
    // implementation
    return { success: true, risks };
  } catch (error) {
    await logAgentError(runId, null, error);
    return { success: false, error: String(error) };
  }
}
```

- Every agent function returns `{ success: boolean, error?: string }`
- Every agent function has a try/catch — never let one failure crash the run
- Errors are always logged to agent_logs table before returning
- Agent functions never import from `components/` or `actions/`
- Agent functions never use React hooks or browser APIs

---

## State Management (Zustand & TanStack Query)

- **Client UI State (Zustand)**: Limit Zustand to global client-side UI states (sidebars, theme preferences, notifications panels, modals).
  - Define stores in `store/` using named, strictly-typed creators.
- **Server Cache (TanStack Query)**: Use TanStack Query for all client-side data fetching, caching, and background synchronizations.
  - Define query keys centrally to avoid key collision.
  - Invalidate query caches on mutation successes to guarantee dynamic, immediate client state validation.

---

## Forms (React Hook Form & Zod)

- **Form Management**: Manage client inputs using React Hook Form for performance.
- **Schema Validation**: Bind all forms to Zod validation schemas using `@hookform/resolvers/zod`.
- **Validation Execution**: Execute checks on user blur to trigger instant, inline warnings. Disable submit controls during submission transitions.

---

## Email Delivery (Resend)

- Reroute invite confirmations and workflow notifications via Resend.
- Always send emails from verified company domains.
- Log failures to Pino and wrap mail dispatch processes in safety try/catch blocks.

---

## Logging, Error Tracking & Observability

- **Structured Logging (Pino)**: Always write JSON logs using `pino`. Never use raw `console.log` or `console.error` in production paths.
- **Crash Reporting (Sentry)**: Catch-block errors must report crashes to Sentry using `Sentry.captureException()`.
- **Telemetry (OpenTelemetry)**: Instrument critical paths (DB calls, external API queries, agent run triggers) with OpenTelemetry trace spans.
- **User-Facing Sanitization**: Never bubble raw database errors to the client UI. Log the raw details to Pino/Sentry, then send a clean, standardized message to the user.

---

## Testing Standards

- **Unit & Integration Tests (Vitest + Testing Library)**:
  - Write Vitest tests for all utility math, date, and validation logic.
  - Test React components with Testing Library to verify accessibility and event interactions.
- **E2E Tests (Playwright)**:
  - Verify complete workflow paths (creation of organizations, task assignments, status changes, uploads, and Socket.IO events) using Playwright E2E browser runs.
  - Clean up database testing tenants between test executions.

## Environment Variables

All environment variables defined in `.env.local` for development. Never hardcode any key, URL, or secret anywhere in the codebase.

| Variable                            | Used In                 |
| ----------------------------------- | ----------------------- |
| `DATABASE_URL`                      | lib/db.ts               |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | proxy.ts, root layout   |
| `CLERK_SECRET_KEY`                  | proxy.ts, server config |
| `NVIDIA_API_KEY`                    | agent/ functions        |
| `NVIDIA_API_BASE_URL`               | agent/ functions        |
| `NEXT_PUBLIC_POSTHOG_KEY`           | lib/posthog-client.ts   |
| `NEXT_PUBLIC_POSTHOG_HOST`          | lib/posthog-client.ts   |
| `SENTRY_DSN`                        | sentry.server.config.ts |
| `NEXT_PUBLIC_SENTRY_DSN`            | sentry.client.config.ts |
| `RESEND_API_KEY`                    | lib/resend.ts           |
| `UPSTASH_REDIS_REST_URL`            | lib/redis.ts            |
| `UPSTASH_REDIS_REST_TOKEN`          | lib/redis.ts            |
| `NEXT_PUBLIC_SOCKET_SERVER_URL`     | lib/socket-client.ts    |

`NEXT_PUBLIC_` prefix means the variable is exposed to the browser. Never add `NEXT_PUBLIC_` to secret keys.

---

## Project Constants

Global project constants are defined once in a central utilities file. Never hardcode these values.

```typescript
// lib/utils.ts
export const DEFAULT_PAGE_SIZE = 25;
```

Import and use `DEFAULT_PAGE_SIZE` everywhere pagination or item limit value is needed.

---

## Import Aliases

Always use the `@/` alias — never use relative imports that go up more than one level.

```typescript
// Correct
import { Button } from '@/components/ui/button';
import { DEFAULT_PAGE_SIZE } from '@/lib/utils';

// Never
import { Button } from '../../../components/ui/button';
```

---

## Comments

- No comments explaining what the code does — code must be self-explanatory
- Comments only for why — explaining a non-obvious decision
- Agent functions may have a brief comment explaining the Playwright browser automation strategy (if applicable)
- Never leave TODO comments in committed code

---

## Dependencies

Never install a new package without a clear reason. Before installing anything check:

1. Does shadcn/ui already have this component?
2. Does Next.js already provide this functionality?
3. Is there a simpler native solution?

Approved dependencies for this project:

- **Frontend & Styling**:
  - `next` — React framework with App Router, Server Components, and Server Actions
  - `react`, `react-dom` — Core UI library (React 19)
  - `tailwindcss` — CSS utility framework (v3, for shadcn/ui compatibility)
  - `lucide-react` — Lightweight, consistent icon pack
  - `gsap` — for animation , scrolling animation
  - `shadcn/ui` components — Primitive UI building blocks (Radix UI + Tailwind, fully owned in your codebase)

- **State Management & Data Fetching**:
  - `zustand` — Client‑side UI state (modals, theme, sidebar, ephemeral data)
  - `@tanstack/react-query` — Client‑side asynchronous server‑state management (caching, optimistic updates, background refetch)
  - `nuqs` — Type‑safe URL state management (synchronises filters, pagination, sorting with the browser URL)

- **Form Handling & Validation**:
  - `react-hook-form` — Client‑side form manager (uncontrolled inputs, minimal re‑renders)
  - `@hookform/resolvers` — Connects React Hook Form to validation libraries (Zod resolver)
  - `zod` — Runtime data schema validation (shared between client forms, server actions, and API endpoints)

- **Authentication, Database & Storage**:
  - `@clerk/nextjs` — Session management & user identity (OAuth, MFA, organizations, RBAC)
  - `drizzle-orm` — Type‑safe SQL ORM with zero runtime overhead (supports Edge runtime)
  - `drizzle-kit` — Schema migrations and database introspection (dev dependency)
  - `@neondatabase/serverless` — HTTP/WebSocket driver for Neon serverless PostgreSQL
  - `@uploadcare/upload-client` — Direct-to-CDN file uploads with metadata persisted in Neon

- **Payments & Email**:
  - `stripe` — Subscription billing, Checkout, Customer Portal, and webhook handling
  - `resend` — Transactional email delivery service (with React Email template support)

- **Realtime**:
  - `socket.io` — Server‑side realtime engine (bi‑directional, low‑latency messaging)
  - `socket.io-client` — Client‑side realtime connection library

- **Caching & Rate Limiting**:
  - `@upstash/redis` — Serverless HTTP Redis client for global caching, session storage, and pub/sub
  - `@upstash/ratelimit` — Sliding-window token and rate limiters for Redis
  - `@arcjet/next` — Edge‑native rate limiting, bot detection, and OWASP Top‑10 attack protection

- **AI & Automation**:
  - `ai` — Vercel AI SDK core library
  - `@ai-sdk/openai` — OpenAI provider for Vercel AI SDK (also used for NVIDIA NIM and OpenRouter)
  - `@ai-sdk/google` — Google provider for Vercel AI SDK (Gemini)
  - `openai` — SDK for connecting to OpenAI‑compatible APIs (e.g., NVIDIA GPT OSS 120B)
  - `openrouter` — SDK for connecting to APIs
  - `gemini` — SDK for connecting to APIs
  - `playwright` — Browser automation (used for AI agent workflows, web scraping, and also E2E testing)

- **Monitoring, Logging & Telemetry**:
  - `pino` — High‑performance structured JSON logging (with child loggers and redaction)
  - `pino-pretty` — Human‑readable log formatting for development (dev dependency)
  - `@sentry/nextjs` — Exception tracking, performance monitoring, and session replay (server + client + edge)
  - `posthog-js`, `posthog-node` — Product analytics, feature flags, and A/B testing
  - `@opentelemetry/api` — Vendor‑neutral distributed tracing API
  - `@opentelemetry/sdk-node` — OpenTelemetry Node.js SDK for exporting traces (e.g., to Grafana Tempo or Jaeger)

- **Internationalisation, Theming & Environment**:
  - `next-intl` — RSC‑ready i18n with type‑safe messages and locale routing
  - `next-themes` — Theme management (dark/light mode with zero FOUC, works with shadcn/ui)
  - `@t3-oss/env-nextjs` — Type‑safe environment variable validation (fails fast on missing keys)

- **Testing & Development Tooling**:
  - `vitest` — Fast, ESM‑native unit and integration test runner (with v8 coverage)
  - `@testing-library/react` — React component testing (queries by role, label, text)
  - `@testing-library/jest-dom` — Custom DOM matchers for expressive assertions
  - `@playwright/test` — Cross‑browser E2E testing (Chromium, Firefox, WebKit) with auto‑waiting
  - `prettier` — Opinionated code formatter (with import sorting plugin)
  - `eslint-config-prettier` — Turns off ESLint rules that conflict with Prettier
  - `eslint` — JavaScript/TypeScript linting (flat config with strict rules)
  - `husky` — Git hooks manager (pre‑commit, commit‑msg)
  - `lint-staged` — Runs linters only on staged files (speeds up commits)

---

Do not install any other packages without updating this list first.
