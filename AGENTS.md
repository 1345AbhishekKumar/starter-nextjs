<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Read Before Anything Else

    do not read .env.local , you can read only .env.example
    do not hard code api keys , use from `config` folder
    Use the `D:\MyProjects\stater-kits\starter-nextjs\.agents\skills\find-skills` functionality to identify relevant skills based on the task.

## Development Rules & Constraints

### Scope Control

- Do not read, analyze, or modify files that are not explicitly mentioned in the prompt.
- Only inspect the files, folders, functions, or code sections specifically requested.
- Do not make assumptions about unrelated parts of the codebase.

### Project Structure

- All UI-related components must be placed inside:
  `app/components/<feature>/`
- If the required UI folder does not exist, create it before adding components.
- Keep UI components organized by feature/domain.
- add proper caching
- use sentry , and logger

### Caching in Next.js

- **Request Memoization** (automatic)
  - Dedupes identical `fetch` calls within the same request.
  - No config. Lasts for the duration of the request only.

- **`fetch` Cache** (legacy, opt‑in)
  - Caches `fetch` responses across requests via `cache: 'force-cache'`.
  - Deprecated in favor of Cache Components.

- **Full Route Cache** (build‑time)
  - Pre‑renders entire pages to static HTML (no dynamic APIs).
  - Revalidated via `revalidateTag`/`revalidatePath` or time intervals.

- **Router Cache** (client‑side)
  - Stores prefetched pages in browser memory for instant back/forward nav.
  - Cleared via `router.refresh()` or full reload.

- **Cache Components** (✨ v16+, recommended)
  - `'use cache'` caches async functions, components, or routes.
  - TTL: `cacheLife('seconds'|'minutes'|'hours'|'days'|'weeks'|'max')`.
  - Invalidation: `cacheTag()` + `revalidateTag()` for precise control.

  Invalidation Methods

- **Time‑based** – `cacheLife` or `revalidate` intervals.
- **On‑demand** – `revalidateTag(tag)` or `revalidatePath(path)`.
- **Automatic** – `router.refresh()` (client) or new deployment (build caches).

  Best Practices

- Prefer **Cache Components** (`'use cache'`) over legacy `fetch` caching.
- Use **`cacheTag`** to group related entries (e.g., `'products'`) for bulk invalidation.
- Omit `'use cache'` + wrap in **`<Suspense>`** for truly real‑time data.

### Validation

- Use **Zod** for all input validation.
- Validate:

  - Forms
  - API requests
  - Server actions
  - Query parameters
  - Environment variables when applicable

### State Management

- Use **Zustand** for client-side state management.
- Use **TanStack Query** for:

  - Data fetching
  - Caching
  - Mutations
  - Server state synchronization

- Avoid unnecessary global state when TanStack Query can handle the data.

### Code Organization

- Follow clean architecture and separation of concerns.
- Keep files between **200–300 lines maximum**.
- If a file grows beyond this limit:

  - Extract components
  - Extract hooks
  - Extract utilities
  - Extract types
  - Extract services
  - Extract validation schemas

### Error Handling

- Implement proper error handling everywhere.
- Handle:

  - API failures
  - Network errors
  - Database errors
  - Validation errors
  - Authentication/authorization failures
  - Unexpected runtime exceptions

- Provide meaningful error messages.
- Never silently ignore errors.

### Next.js Best Practices

- Always follow current Next.js best practices for performance, scalability, and maintainability.
- Prefer: from '/.agents/skills/next-best-practices' skill

  - Server Components by default
  - Server Actions when appropriate
  - Streaming and Suspense
  - Route-based code splitting
  - Optimized data fetching patterns
  - Proper caching and revalidation strategies
  - Dynamic imports for heavy components
  - `next/image` for images
  - `next/font` for fonts
  - Metadata API for SEO

- Minimize client-side JavaScript whenever possible.

### Next.js Advanced Routing Rules

- Always choose the routing primitive based on UI behavior (persistence, concurrency, or masking), not folder structure alone.

- **Nested Layouts**: Use for persistent UI (sidebars/headers) across child routes. Never put data-fetching in a parent layout if children need fresh, independent data—use `loading.tsx` or Suspense instead.

- **Parallel Routes (`@slot`)**: Use to render independent sibling views simultaneously. **Mandatory rule:** Always export a `default.tsx` inside every slot folder to prevent 404s when navigating to routes missing that slot.

- **Intercepting Routes (`(.)`, `(..)`)**: Use exclusively for client-side modal overlays that mask a URL. **Critical rule:** Always maintain a standard full-page route at the target path (`/photo/[id]`) alongside the interceptor—interceptors are bypassed on refresh or direct URL entry.

- **Route Groups (`(folder)`)**: Use strictly for code organization and scoping multiple root layouts. Never place a `page.tsx` directly inside the group folder—it must be nested (e.g., `(auth)/login/page.tsx` resolves to `/login`).

- **The Modal Combo**: When building bookmarkable modals, **must combine** Parallel Routes (`@modal`) + Intercepting Routes (`(..)`) inside the same layout. The slot provides the overlay container; the interceptor provides the URL mask.

- Minimize complexity: avoid parallel or intercepting routes unless the UX explicitly requires simultaneous views or masked URLs—prefer simple nested layouts or query parameters otherwise.

### Performance Requirements

- Optimize for:

  - Fast page loads
  - Low bundle size
  - Reduced re-renders
  - Efficient database queries
  - Minimal network requests
  - Strong Core Web Vitals scores

### Implementation Rules

- Write production-ready code only.
- Avoid duplicate code.
- Reuse existing utilities and abstractions whenever possible.
- Follow TypeScript strict mode.
- Use clear naming conventions.
- Add comments only when they provide meaningful context.
- Prioritize maintainability, readability, and long-term scalability.

Read in this exact order before any implementation:

1. context/overview.md
2. context/architecture.md
3. context/design.md
4. context/code-standards.md
5. context/library-docs.md
6. context/build-plan.md
7. context/progress-tracker.md
8. context/ui-rules.md

## Rules That Never Change

- Never use hardcoded hex values or raw Tailwind color classes
- Update `progress-tracker.md` after every feature
- Before any third party library — load its installed skill first,
  then read `context/libs.md` for project-specific rules
- If the same problem persists after one corrective prompt —
  stop immediately and run /recover

## Invariants — Never Violate These

- API routes contain no UI logic. Components contain no DB logic.
- Agent code in agent/ never imports from components/ or actions/
- Server Actions never call agent functions — only API routes call agent functions
- All neon DB writes from the agent go through lib/neon.ts only
- Easy Apply is never touched — external apply URLs only
- Every Stagehand act() call is wrapped in try/catch
- Match threshold always comes from MATCH_THRESHOLD in `lib/utils.ts`
- AgentSpan step IDs always use format apply-{job_id}

Before completing any implementation:

[ ] No duplicate code
[ ] No unnecessary client components
[ ] No unnecessary re-renders
[ ] No file exceeds 200 lines
[ ] TypeScript strict mode passes
[ ] Existing abstractions reused
[ ] Proper loading states implemented
[ ] Performance optimized
[ ] Accessibility considered
[ ] SEO configured where required
[ ] Code is production-ready
