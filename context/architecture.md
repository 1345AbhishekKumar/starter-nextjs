## 🏗️ Architecture Structure

This section describes the high‑level architecture of the starter template – the layers, their responsibilities, and how they interact. The design follows **Next.js App Router** best practices and separates concerns clearly.

---

### 📐 Layered Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                               │
│  React Client Components · TanStack Query · Zustand · nuqs · shadcn/ui    │
│  React Hook Form · UploadThing Client · PostHog · Sentry Browser           │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │ HTTP / WebSockets
┌───────────────────────────────▼─────────────────────────────────────────────┐
│                              EDGE (Middleware)                              │
│  Clerk Auth · next‑intl i18n · Arcjet (rate‑limit / bot) · Security Headers │
│  Request ID · CSP nonce                                                    │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────────────┐
│                              SERVER (Next.js)                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  Server Components (RSC) · Server Actions · Route Handlers (API)    │   │
│  │  Zod validation · Drizzle ORM · Pino logging · Sentry Server        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────────────┐
│                              DATA LAYER                                    │
│  Neon PostgreSQL (via @neondatabase/serverless) · Drizzle ORM              │
│  Stripe · UploadThing S3 · Resend (email) · Upstash Redis (optional)      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 🔄 Request Flow (Detailed)

1. **Browser request** → Next.js application.

2. **Edge Middleware** (`proxy.ts`):
   - `next-intl` middleware detects and sets the locale.
   - `clerkMiddleware` validates the user session.
   - Arcjet applies rate limiting and bot detection.
   - Security headers (`X-Frame-Options`, CSP, etc.) are added.
   - If the user is unauthenticated and trying to access a protected route, they are redirected to `/sign‑in`.
   - A `x‑request‑id` header is injected for request tracing.

3. **Server Component (RSC)**:
   - Clerk provides the user session via `auth()`.
   - Data is fetched using Drizzle ORM (with Zod‑validated inputs).
   - The RSC renders the initial HTML (or streams with Suspense).
   - TanStack Query **prefetches** data and serialises it into the client bundle via `dehydrate` + `HydrationBoundary`.

4. **Client‑side Hydration**:
   - The `HydrationBoundary` restores the query cache.
   - Client Components use `useQuery`/`useMutation` to interact with server data.
   - UI state (modal open, theme, sidebar collapsed) is managed by Zustand.
   - URL state (pagination, filters) is synchronised with `nuqs` (which uses the browser URL).
   - Forms use React Hook Form; validation schemas are shared with the server via Zod.
   - File uploads use UploadThing’s client SDK (direct to S3, no server proxy).

5. **Mutations (Server Actions)**:
   - When a form is submitted, a Server Action is called.
   - The action validates input with Zod (again, server‑side).
   - It performs database operations via Drizzle and returns a typed result.
   - On success, `revalidatePath` / `revalidateTag` invalidates caches, and TanStack Query updates optimistically.
   - Audit logging (if implemented) is a separate concern.

6. **Background / Payments**:
   - Stripe webhooks (raw body, HMAC verification) update subscription status.
   - clerk webhooks update status like user deleted , updated , created.
   - Email sending (via Resend) can be invoked from Server Actions (synchronous) or enqueued later.

---

### 📁 Folder Structure (Feature‑First)

```
src/
├── app/                           # Next.js App Router
│   ├── (auth)/                    # Route group for auth (login, signup)
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (dashboard)/               # Protected routes (dashboard, settings)
│   │   ├── layout.tsx             # Authenticated layout (Clerk UserButton, sidebar)
│   │   ├── dashboard/page.tsx
│   │   ├── settings/page.tsx
│   │   └── admin/                 # Admin‑only area (with role guard)
│   ├── (marketing)/               # Public marketing pages
│   │   ├── layout.tsx
│   │   └── page.tsx               # Landing page
│   ├── api/
│   │   ├── webhooks/
│   │   │   └── stripe/route.ts    # Stripe webhook (raw body)
│   │   └── trpc/                  # (Optional) if you later add tRPC
│   ├── layout.tsx                 # Root layout (providers, fonts)
│   ├── error.tsx                  # Global error boundary
│   └── not-found.tsx
├── components/
│   ├── ui/                        # shadcn/ui components (you own them)
│   ├── forms/                     # Reusable form components
│   ├── layouts/                   # DashboardShell, Sidebar, Header
│   └── shared/                    # DataTable, EmptyState, PageHeader
├── config/
│   ├── env.ts                     # @t3‑oss/env-nextjs validation
│   └── app.ts                     # App‑wide constants (metadata, site config)
├── db/
│   ├── index.ts                   # Drizzle client (Neon HTTP)
│   ├── schema/                    # Tables definitions (users, posts, etc.)
│   │   ├── users.ts
│   │   ├── posts.ts
│   │   └── index.ts
│   └── migrations/                # drizzle‑kit generated migrations
├── features/                      # Feature‑based modules (optional, for scale)
│   ├── auth/                      # Auth‑related logic (if not using Clerk)
│   ├── billing/                   # Stripe integration helpers
│   └── notifications/             # Notification utils
├── hooks/                         # Shared React hooks (useDebounce, useMediaQuery)
├── i18n/                          # next‑intl configuration
│   ├── config.ts
│   └── messages/                  # en.json, es.json, ...
├── lib/                           # Utilities
│   ├── logger.ts                  # Pino logger singleton
│   ├── stripe.ts                  # Stripe client
│   ├── uploadthing.ts             # UploadThing client
│   └── utils.ts                   # cn(), formatDate(), etc.
├── middleware.ts                  # Clerk + i18n + Arcjet (edge)
├── instrumentation.ts             # (Optional) OpenTelemetry / Sentry init
├── server/                        # Server‑only code (not bundled to client)
│   ├── actions/                   # Server Actions (reusable)
│   └── services/                  # Business logic (e.g., emailService)
├── stores/                        # Zustand stores (UI state)
├── styles/
│   └── globals.css                # Tailwind imports + custom CSS
└── types/                         # Global TypeScript types
    └── global.d.ts                # Module augmentations
```

---

### 🧩 Key Integration Points

#### Middleware – Clerk + i18n

Both require middleware. They are composed in `proxy.ts` (see the example in the `.md` file).

## Auth

- Provider: Clerk
- Methods: Email/Pass, Google OAuth, GitHub OAuth
- Protected: `/dashboard`, ``, `/projects/**`, `/profile` (via middleware)
- Public: `/`, `/login`, `/register`
- Middleware (`proxy.ts`) verify auth sessions.

#### Database – Drizzle + Neon

Uses the `@neondatabase/serverless` HTTP driver for edge compatibility. Schema is defined with Drizzle's `pgTable` and relations.

#### State – TanStack Query + Zustand + nuqs

- **TanStack Query** manages server state – data fetching, caching, mutations.
- **Zustand** holds client‑only UI state (modal visibility, theme toggle, sidebar).
- **nuqs** synchronises complex UI state with the URL (filters, pagination, sorting).
- **The boundary**: Zustand stores **IDs** and selections, but the **actual data** lives in TanStack Query.

#### Forms – React Hook Form + Zod

Shared Zod schemas are defined in a central location and used both on the client (for validation) and in Server Actions (for re‑validation).

#### Security – Arcjet + Clerk

Arcjet runs at the edge, before your app code, and provides rate limiting + bot protection. Clerk handles authentication and session management.

#### Internationalisation – next‑intl

Used in Server Components via `useTranslations()`. Locale detection is done in middleware, and messages are loaded per request.

#### Theming – next‑themes

Powers dark/light mode with a `ThemeProvider` at the root. Works seamlessly with shadcn/ui’s CSS variables.

---

### 🔒 Security Posture

| Layer          | Control                      | Implementation                                                |
| -------------- | ---------------------------- | ------------------------------------------------------------- |
| Edge           | Rate limiting, bot detection | Arcjet middleware                                             |
| Edge           | CSP, X‑Frame‑Options, etc.   | Security headers in middleware                                |
| Edge           | Authentication & session     | Clerk (httpOnly, secure cookies)                              |
| Server         | Input validation             | Zod (Server Actions + API routes)                             |
| Server         | SQL injection prevention     | Drizzle parameterised queries                                 |
| Server         | XSS prevention               | React escapes by default; CSP blocks inline scripts           |
| Server         | CSRF protection              | Next.js Server Actions built‑in; API routes use Origin checks |
| External       | Webhook authenticity         | Stripe SDK `constructEvent()` + HMAC for custom webhooks      |
| Infrastructure | Secrets management           | Environment variables (validated with @t3‑oss)                |

---

### 🧪 Testing Strategy

| Test Type          | Tool                     | Scope                                                        |
| ------------------ | ------------------------ | ------------------------------------------------------------ |
| Unit / Integration | Vitest + Testing Library | Components, hooks, utilities, Server Actions (mocked DB)     |
| E2E                | Playwright               | Full user journeys across browsers (Chrome, Firefox, WebKit) |
| Accessibility      | @axe‑core/playwright     | Automated a11y checks in CI                                  |
| Coverage           | v8 (Vitest)              | Enforced thresholds (80% statements, branches)               |

## Invariants

- **No DB writes on Browser:** All writes via Server Actions (`/actions/`) or API using `createNeonServer()`.
- **Zod Validations:** Actions validate inputs via Zod before writes.
- **Tenant Isolation:** All reads/writes filtered by `organization_id`. No cross-tenant leaks.
- **Style Consistency:** No hardcoded hex/raw Tailwind colors. Use HSL/CSS variables from `DESIGN.md` + `ui-tokens.md` in `components/ui/`.
- **Role Permissions:** Validate user role (`OWNER`, `ADMIN`, `MEMBER`) before project/membership changes.
- **Separation of Concerns:** API no UI logic. Components no DB logic.
- **Agent Imports:** `/agent` never imports from `/components` or `/actions`.
- **Server Actions & Agents:** Actions never call agent fns. Agents only from API.
- **Agent Error Handling:** Every action in try/catch. Log to `agent_logs`, never crash.
- **Resource Management:** Cleanup resources + API clients when done. No leaks.

---

This architecture ensures **separation of concerns**, **type safety**, **edge‑first performance**, and **maintainability** – exactly what you need for a production SaaS starter.
