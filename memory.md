# Memory — Uploadcare Integration and Neon DB Syncing

Last updated: 2026-07-04T12:11:22+05:30

## What was built

- **Uploadcare Integration & Neon DB Sync:**
  - Added new `uploadcareFiles` metadata table to [db/schema.ts](file:///d:/MyProjects/stater-kits/starter-nextjs/db/schema.ts) and successfully generated and applied Neon migrations.
  - Added environment schemas and validation in [config/env.client.ts](file:///d:/MyProjects/stater-kits/starter-nextjs/config/env.client.ts) and [config/env.server.ts](file:///d:/MyProjects/stater-kits/starter-nextjs/config/env.server.ts) with placeholders in [.env.example](file:///d:/MyProjects/stater-kits/starter-nextjs/.env.example).
  - Confired authorized image CDN hosts in [next.config.ts](file:///d:/MyProjects/stater-kits/starter-nextjs/next.config.ts) (`*.ucarecdn.com`).
  - Implemented Server Actions (`syncUploadcareFile`, `getSyncedFiles`, `deleteSyncedFile`) with Zod input schema validations in [actions/uploadcare.ts](file:///d:/MyProjects/stater-kits/starter-nextjs/actions/uploadcare.ts).
  - Configured TanStack Query custom hooks (`useFiles`, `useSyncFile`, `useDeleteFile`) in [hooks/use-files.ts](file:///d:/MyProjects/stater-kits/starter-nextjs/hooks/use-files.ts) for automatic cache invalidation and query synchronization.
  - Built styled client component [components/uploader/FileUploader.tsx](file:///d:/MyProjects/stater-kits/starter-nextjs/components/uploader/FileUploader.tsx) with custom theme color overrides added to [app/globals.css](file:///d:/MyProjects/stater-kits/starter-nextjs/app/globals.css) using Meadow's OKLCH palette.
  - Built gallery grid [components/uploader/FileGrid.tsx](file:///d:/MyProjects/stater-kits/starter-nextjs/components/uploader/FileGrid.tsx) displaying original images in a clickable container that opens the asset full-size in a new tab.
  - Integrated everything under a new dedicated route [app/dashboard/uploads/page.tsx](file:///d:/MyProjects/stater-kits/starter-nextjs/app/dashboard/uploads/page.tsx) and linked to it inside [app/dashboard/page.tsx](file:///d:/MyProjects/stater-kits/starter-nextjs/app/dashboard/page.tsx).
  - Updated status items for Phase 10 in [context/todos.md](file:///d:/MyProjects/stater-kits/starter-nextjs/context/todos.md).

## Decisions made

- **Separate Gallery Route:** Created a dedicated `/dashboard/uploads` subroute rather than integrating Uploadcare into settings profile pictures, since avatar updates are natively handled by Clerk.
- **TanStack Query Caching:** Leveraged the query key `'synced-files'` to synchronize state between the uploader and gallery grid dynamically, ensuring automated live refreshes without page reloads.

## Problems solved

- **Uploader Unique Constraint Violation (Error 23505):** Resolved duplicate sync attempts caused by multiple `onChange` event fires using client-side `useRef` batch tracking and appending `.onConflictDoNothing()` to Drizzle's db insert statement.

## Current state

- Uploadcare File Uploader and Neon DB syncing are 100% complete, fully functional, and styled.
- The gallery updates dynamically and supports clickable full-size asset views.
- All migrations are applied successfully.

## Next session starts with

- Phase 11 — Payments (Stripe integration) in [context/todos.md](file:///d:/MyProjects/stater-kits/starter-nextjs/context/todos.md) to set up subscription tiers and checkout sessions.

## Open questions

None.
