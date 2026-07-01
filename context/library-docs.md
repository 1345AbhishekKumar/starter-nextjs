# Library Docs

Project-specific usage patterns for every third party library in this starter kit. This file only covers how we use each library in this specific project — rules, patterns, and constraints for the starter template.

Read the relevant section before implementing any feature that touches these libraries.

---

## Before Using Any Library

Before implementing any feature that uses a third party library:

1. **Check AGENTS.md** at the project root — it lists every skill installed for this project and how to use them. Skills contain up-to-date API documentation, usage patterns, and best practices specific to this codebase.

2. **Check if an MCP server is configured** for that library. Some tools have MCP servers that give the AI agent direct access to documentation, logs, and debugging tools. If an MCP server is available — use it before falling back to general knowledge.

3. **Read this file** for project-specific patterns that override general library knowledge.

The order of authority is:

```
MCP server (real-time docs) → Skills via AGENTS.md → This file (project rules) → General training knowledge
```

Never rely on general training knowledge alone for library APIs — they change frequently and training data may be outdated.

---

## Next.js 16 (App Router)

**Check first:** Check AGENTS.md for an installed Next.js skill. If a Next.js MCP server is configured — use it.

### Server Actions vs API Routes

**Primary: Server Actions** — use for all mutations and form submissions.

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().optional(),
});

export async function updateProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const parsed = updateProfileSchema.parse({
    name: formData.get('name'),
    bio: formData.get('bio'),
  });

  await db.update(parsed).where({ userId });
  revalidatePath('/profile');
}
```

**Secondary: Route Handlers (`route.ts`)** — use for:

- Webhooks (Stripe, Clerk) — need raw body parsing
- External API endpoints that need to be called by third parties
- Streaming responses

**Rules:**

- Never use Route Handlers for internal data fetching — use Server Components or Server Actions
- Always validate input with Zod in Server Actions
- Always call `revalidatePath` or `revalidateTag` after mutations
- Use `'use server'` directive at the top of Server Action files

### Server Components (RSC)

```typescript
// src/app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return redirect('/sign-in');

  const data = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.clerkId, userId),
  });

  return <DashboardClient data={data} />;
}
```

**Rules:**

- Server Components are the default — use them unless you need client-side interactivity
- Never use `useState`, `useEffect`, or event handlers in Server Components
- Use `'use client'` directive at the top of Client Components only
- Prefer fetching data directly in RSC over client-side fetching

### Metadata & SEO

```typescript
// src/app/layout.tsx
export const metadata = {
  title: {
    template: '%s | App Name',
    default: 'App Name',
  },
  description: 'Description',
};

// src/app/dashboard/page.tsx
export const metadata = {
  title: 'Dashboard',
};
```

**Rules:**

- Always export `metadata` from layout and page files
- Use `generateMetadata` for dynamic routes
- Include Open Graph and Twitter card metadata

---

## Clerk

**Check first:** Check AGENTS.md for an installed Clerk skill. If a Clerk MCP server is configured — use it.

### Auth in Server Context

```typescript
// src/app/dashboard/page.tsx — Server Component
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Role from metadata
  const role = sessionClaims?.metadata?.role as 'admin' | 'member';

  return <Dashboard userId={userId} role={role} />;
}
```

```typescript
// src/server/actions/profile.ts — Server Action
'use server';

import { auth } from '@clerk/nextjs/server';

export async function getProfile() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  // ...
}
```

### Auth in Client Context

```typescript
// src/components/Navbar.tsx
'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { SignOutButton } from '@clerk/nextjs';

export function Navbar() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  if (!isSignedIn) return <SignInButton />;

  return (
    <div>
      <span>{user?.fullName}</span>
      <SignOutButton />
    </div>
  );
}
```

### Middleware

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/pricing',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (!userId && !isPublicRoute(req)) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
```

**Rules:**

- Always call `auth()` on the server — never trust client-side auth state for authorization
- Store custom user data (role, plan) in Clerk metadata — sync to DB via webhooks
- Use `createRouteMatcher` for route protection in middleware
- Never store Clerk secrets in client-side code — use environment variables only on server

---

## Drizzle ORM + Neon

**Check first:** Check AGENTS.md for an installed Drizzle skill. If a Drizzle MCP server is configured — use it.

### Client Setup (Neon HTTP)

```typescript
// src/db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

export type Database = typeof db;
```

### Schema Definition

```typescript
// src/db/schema/users.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('member'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### Queries

```typescript
// src/server/actions/users.ts
'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function getUser() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.clerkId, userId),
  });
}
```

### Inserts & Updates

```typescript
// Insert
const [newUser] = await db
  .insert(users)
  .values({
    clerkId: userId,
    email: email,
    name: name,
  })
  .returning();

// Update
await db
  .update(users)
  .set({ name: newName, updatedAt: new Date() })
  .where(eq(users.clerkId, userId));
```

### Migrations

```bash
# Generate migration
pnpm drizzle-kit generate

# Apply migration
pnpm drizzle-kit migrate

# Generate and apply in one command
pnpm db:push
```

**Rules:**

- Always use the Neon HTTP driver — never use `pg` directly
- Always import `db` from `@/db` — never create new instances
- Always scope queries to `userId` — never query without user filter
- Use `returning()` for inserts and updates when you need the result
- Use `drizzle-kit` for migrations — never manually modify the database schema
- Always define types with `$inferSelect` and `$inferInsert`

---

## Zod

**Check first:** Check AGENTS.md for an installed Zod skill. If a Zod MCP server is configured — use it.

### Shared Schemas

```typescript
// src/lib/validations/profile.ts
import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  role: z.enum(['member', 'admin']).default('member'),
});

export type ProfileInput = z.infer<typeof profileSchema>;
```

### Validation in Server Actions

```typescript
// src/server/actions/profile.ts
'use server';

import { profileSchema } from '@/lib/validations/profile';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';

export async function updateProfile(data: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // Validate — always on server, never trust client
  const validated = profileSchema.parse(data);

  await db
    .update(users)
    .set({ name: validated.name, bio: validated.bio })
    .where(eq(users.clerkId, userId));
}
```

### Validation in React Hook Form

```typescript
// src/components/forms/ProfileForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileInput } from '@/lib/validations/profile';

export function ProfileForm({
  defaultValues,
}: {
  defaultValues: ProfileInput;
}) {
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  // ...
}
```

### Environment Variables

```typescript
// src/config/env.ts
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    CLERK_SECRET_KEY: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
});
```

**Rules:**

- Always define schemas in `src/lib/validations/` — never inline in components
- Always validate on the server — client validation is convenience, not security
- Use `z.infer<typeof schema>` for TypeScript types — never duplicate types manually
- Use `safeParse` when you need to handle errors gracefully
- Never use `any` or `unknown` without validation — always parse

---

## React Hook Form

**Check first:** Check AGENTS.md for an installed React Hook Form skill. If an RHF MCP server is configured — use it.

### Basic Form Setup

```typescript
// src/components/forms/ProfileForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileInput } from '@/lib/validations/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

export function ProfileForm({ defaultValues }: { defaultValues: ProfileInput }) {
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  async function onSubmit(data: ProfileInput) {
    // Call Server Action
    const result = await updateProfile(data);
    if (result.error) {
      form.setError('root', { message: result.error });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* More fields... */}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Form>
  );
}
```

### Server Action Integration

```typescript
// src/server/actions/profile.ts
'use server';

import { profileSchema } from '@/lib/validations/profile';

type ActionResult<T = void> =
  { success: true; data: T } | { success: false; error: string };

export async function updateProfile(data: unknown): Promise<ActionResult> {
  try {
    const validated = profileSchema.parse(data);
    // ... update database
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Something went wrong' };
  }
}
```

**Rules:**

- Always use `zodResolver` — never write custom validation logic
- Always pass `defaultValues` from server data — never fetch inside the form component
- Use `form.setError` for server-side errors (e.g., duplicate email)
- Always show loading state with `form.formState.isSubmitting`
- Never use `useEffect` to sync form values — use `defaultValues` or `reset`

---

## TanStack Query

**Check first:** Check AGENTS.md for an installed TanStack Query skill. If a TQ MCP server is configured — use it.

### Query Provider Setup

```typescript
// src/app/providers/QueryProvider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### RSC Prefetching

```typescript
// src/app/dashboard/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getDashboardData } from '@/server/queries/dashboard';

export default async function DashboardPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient />
    </HydrationBoundary>
  );
}
```

### Client Query

```typescript
// src/components/dashboard/DashboardClient.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '@/server/queries/dashboard';

export function DashboardClient() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  });

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <div>Error loading dashboard</div>;

  return <DashboardContent data={data} />;
}
```

### Mutations with Optimistic Updates

```typescript
// src/components/forms/ProfileForm.tsx
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '@/server/actions/profile';

export function ProfileForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateProfile,
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['profile'] });
      const previous = queryClient.getQueryData(['profile']);
      queryClient.setQueryData(['profile'], newData);
      return { previous };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(['profile'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  // ...
}
```

**Rules:**

- Always use `HydrationBoundary` for RSC prefetching
- Always set `staleTime` to avoid unnecessary refetches
- Use optimistic updates for better UX on mutations
- Invalidate queries after mutations with `invalidateQueries`
- Use `queryKey` arrays with specific identifiers — never use strings alone

---

## Zustand

**Check first:** Check AGENTS.md for an installed Zustand skill. If a Zustand MCP server is configured — use it.

### Store Definition

```typescript
// src/stores/ui.ts
import { create } from 'zustand';

interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  modalOpen: boolean;
  modalContent: React.ReactNode | null;

  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'system',
  sidebarOpen: true,
  modalOpen: false,
  modalContent: null,

  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openModal: (content) => set({ modalOpen: true, modalContent: content }),
  closeModal: () => set({ modalOpen: false, modalContent: null }),
}));
```

### Store with Persistence

```typescript
// src/stores/settings.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  language: string;
  notifications: boolean;
  setLanguage: (lang: string) => void;
  toggleNotifications: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      notifications: true,
      setLanguage: (language) => set({ language }),
      toggleNotifications: () =>
        set((state) => ({ notifications: !state.notifications })),
    }),
    {
      name: 'settings-storage', // localStorage key
    },
  ),
);
```

### Usage in Components

```typescript
// src/components/layout/Sidebar.tsx
'use client';

import { useUIStore } from '@/stores/ui';

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside className={sidebarOpen ? 'w-64' : 'w-0'}>
      <button onClick={toggleSidebar}>Toggle</button>
    </aside>
  );
}
```

**Rules:**

- Use Zustand only for client-side UI state — never for server data
- Never store canonical data in Zustand — use TanStack Query for server data
- Use `persist` middleware for settings and preferences
- Keep stores small and focused — one store per domain
- Use selectors to avoid unnecessary re-renders: `useUIStore((state) => state.sidebarOpen)`

---

## nuqs

**Check first:** Check AGENTS.md for an installed nuqs skill. If a nuqs MCP server is configured — use it.

### Setup

```typescript
// src/app/providers/NuqsAdapter.tsx
'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

export function NuqsProvider({ children }: { children: React.ReactNode }) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}
```

### URL State with Schema

```typescript
// src/components/jobs/JobFilters.tsx
'use client';

import { useQueryState } from 'nuqs';
import { z } from 'zod';

const filterSchema = z.object({
  status: z.enum(['all', 'active', 'closed']).default('all'),
  search: z.string().default(''),
  page: z.number().min(1).default(1),
});

export function JobFilters() {
  const [status, setStatus] = useQueryState('status', {
    defaultValue: 'all',
    parse: (value) => value as 'all' | 'active' | 'closed',
    serialize: (value) => value,
  });

  const [search, setSearch] = useQueryState('search', {
    defaultValue: '',
    parse: (value) => value || '',
  });

  const [page, setPage] = useQueryState('page', {
    defaultValue: 1,
    parse: (value) => parseInt(value, 10) || 1,
  });

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="closed">Closed</option>
      </select>
    </div>
  );
}
```

### With Zod Parser

```typescript
import { useQueryState } from 'nuqs';
import { parseAsString, parseAsInteger, withDefault } from 'nuqs';

const [search, setSearch] = useQueryState(
  'search',
  withDefault(parseAsString, ''),
);
const [page, setPage] = useQueryState('page', withDefault(parseAsInteger, 1));
const [sort, setSort] = useQueryState('sort', {
  defaultValue: 'newest',
  parse: (value) => value as 'newest' | 'oldest' | 'score',
  serialize: (value) => value,
});
```

**Rules:**

- Use nuqs for all URL state — filters, pagination, sorting, tabs
- Always provide default values — URL state should never be undefined
- Use `parseAsString`, `parseAsInteger`, etc. for type safety
- Keep URL state separate from other state — it's a source of truth, not a cache
- Never store sensitive data in URL state

---

## UploadThing

**Check first:** Check AGENTS.md for an installed UploadThing skill. If an UploadThing MCP server is configured — use it.

### File Route Definition

```typescript
// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@clerk/nextjs/server';

const f = createUploadthing();

export const ourFileRouter = {
  // Avatar upload
  avatarUploader: f({
    image: {
      maxFileSize: '2MB',
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new Error('Unauthorized');
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Save file URL to database
      const { userId } = metadata;
      await db
        .update(users)
        .set({ avatarUrl: file.url })
        .where(eq(users.clerkId, userId));
    }),

  // Resume upload
  resumeUploader: f({
    pdf: {
      maxFileSize: '5MB',
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new Error('Unauthorized');
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Save resume URL to database
      await db
        .update(profiles)
        .set({ resumeUrl: file.url })
        .where(eq(profiles.clerkId, metadata.userId));
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
```

### Client Upload Component

```typescript
// src/components/upload/AvatarUpload.tsx
'use client';

import { UploadButton } from '@uploadthing/react';
import { ourFileRouter } from '@/app/api/uploadthing/core';

export function AvatarUpload({ userId }: { userId: string }) {
  return (
    <UploadButton<OurFileRouter>
      endpoint="avatarUploader"
      onClientUploadComplete={(res) => {
        // File uploaded successfully
        const url = res[0]?.url;
        // Update UI with new avatar
      }}
      onUploadError={(error) => {
        console.error(error);
        // Show error toast
      }}
    />
  );
}
```

**Rules:**

- Always use `middleware` to check authentication
- Always store file URL in database in `onUploadComplete`
- Define all file routes in `core.ts` — never inline in components
- Use `maxFileSize` and `maxFileCount` to enforce limits
- Always handle upload errors with user feedback

---

## Stripe

**Check first:** Check AGENTS.md for an installed Stripe skill. If a Stripe MCP server is configured — use it.

### Client Setup

```typescript
// src/lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
```

### Checkout Session

```typescript
// src/server/actions/stripe.ts
'use server';

import { stripe } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';

export async function createCheckoutSession(priceId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    customer_email: user.email,
    metadata: { userId },
  });

  return { url: session.url };
}
```

### Webhook Handler

```typescript
// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe';
import { db } from '@/db';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      if (userId) {
        await db
          .update(users)
          .set({ plan: 'pro', stripeCustomerId: session.customer as string })
          .where(eq(users.clerkId, userId));
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      // Find user by customer ID and downgrade plan
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

**Rules:**

- Always use `req.text()` for webhooks — never `req.json()` (raw body needed for signature)
- Always verify webhook signatures with `constructEvent`
- Store `stripeCustomerId` in database for webhook lookups
- Use metadata to pass `userId` through Checkout
- Always handle webhook errors gracefully — Stripe will retry on non-2xx responses

---

## Resend

**Check first:** Check AGENTS.md for an installed Resend skill. If a Resend MCP server is configured — use it.

### Client Setup

```typescript
// src/lib/resend.ts
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY!);
```

### Email Template

```typescript
// src/emails/WelcomeEmail.tsx
import { Html, Body, Container, Text, Preview, Heading } from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Preview>Welcome to {process.env.NEXT_PUBLIC_APP_NAME}!</Preview>
      <Body>
        <Container>
          <Heading>Welcome, {name}!</Heading>
          <Text>Thanks for signing up. We're excited to have you.</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

### Sending Email

```typescript
// src/server/actions/email.ts
'use server';

import { resend } from '@/lib/resend';
import { WelcomeEmail } from '@/emails/WelcomeEmail';

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: `${process.env.NEXT_PUBLIC_APP_NAME} <noreply@${process.env.NEXT_PUBLIC_DOMAIN}>`,
    to: email,
    subject: 'Welcome!',
    react: WelcomeEmail({ name }),
  });
}
```

**Rules:**

- Always use React Email templates — never plain HTML
- Store templates in `src/emails/` — one file per template
- Use `react` property with JSX — not `html`
- Always use a verified sender domain

---

## Pino

**Check first:** Check AGENTS.md for an installed Pino skill. If a Pino MCP server is configured — use it.

### Logger Setup

```typescript
// src/lib/logger.ts
import pino from 'pino';

const isDev = process.env.NODE_ENV === 'development';

export const logger = pino({
  level: isDev ? 'debug' : 'info',
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: { colorize: true, ignore: 'pid,hostname' },
      }
    : undefined,
  base: {
    env: process.env.NODE_ENV,
    service: process.env.NEXT_PUBLIC_APP_NAME || 'app',
  },
  redact: {
    paths: [
      'password',
      'token',
      'secret',
      'authorization',
      '*.password',
      '*.token',
    ],
    censor: '[REDACTED]',
  },
});

// Request-scoped logger
export function createReqLogger(requestId: string, userId?: string) {
  return logger.child({ requestId, userId });
}
```

### Usage

```typescript
// src/middleware.ts — Inject request ID
import { logger } from '@/lib/logger';

// In middleware
const requestId = crypto.randomUUID();
const reqLogger = logger.child({ requestId });
reqLogger.info({ path: req.nextUrl.pathname }, 'Request started');
```

```typescript
// src/server/actions/profile.ts
import { logger } from '@/lib/logger';

export async function updateProfile(data: unknown) {
  try {
    // ...
    logger.info(
      { userId, action: 'profile.updated' },
      'Profile updated successfully',
    );
  } catch (error) {
    logger.error({ error, userId }, 'Failed to update profile');
    throw error;
  }
}
```

**Rules:**

- Always use `logger.child()` for request-scoped logging
- Never log passwords, tokens, or secrets — use `redact`
- Always include structured data as object — never in message string
- Use `debug` for development, `info` for production
- Always log errors with `error` level

---

## Sentry

**Check first:** Check AGENTS.md for an installed Sentry skill. If a Sentry MCP server is configured — use it.

### Setup

```typescript
// next.config.ts
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {
  // ...
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG!,
  project: process.env.SENTRY_PROJECT!,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
});
```

### Error Capture

```typescript
// src/server/actions/profile.ts
import * as Sentry from '@sentry/nextjs';
import { logger } from '@/lib/logger';

export async function updateProfile(data: unknown) {
  try {
    // ...
  } catch (error) {
    logger.error({ error }, 'Failed to update profile');
    Sentry.captureException(error, {
      tags: { action: 'profile.update' },
      extra: { userId },
    });
    throw error;
  }
}
```

### Error Boundary

```typescript
// src/app/error.tsx
'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Rules:**

- Always capture exceptions with `Sentry.captureException`
- Always include tags for filtering (action, route, userId)
- Never include sensitive data in Sentry logs
- Use error boundaries at route level

---

## PostHog

**Check first:** Check AGENTS.md for an installed PostHog skill. If a PostHog MCP server is configured — use it.

### Client Setup

```typescript
// src/lib/posthog-client.ts
import posthog from 'posthog-js';

export function initPostHog() {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
      capture_pageview: false,
    });
  }
}
```

### Server Setup

```typescript
// src/lib/posthog-server.ts
import { PostHog } from 'posthog-node';

export const createPostHogServer = () =>
  new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
    flushAt: 1,
    flushInterval: 0,
  });
```

### Event Tracking

```typescript
// src/lib/posthog.ts
import { createPostHogServer } from './posthog-server';

export async function trackEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, any>,
) {
  const posthog = createPostHogServer();
  posthog.capture({
    distinctId,
    event,
    properties,
  });
  await posthog.shutdown();
}
```

### Usage

```typescript
// src/server/actions/profile.ts
import { trackEvent } from '@/lib/posthog';

export async function updateProfile(data: unknown) {
  // ...
  await trackEvent(userId, 'profile_updated', {
    fields: Object.keys(validated),
  });
}
```

**Rules:**

- Always call `await posthog.shutdown()` in server functions — events are lost without it
- Always set `flushAt: 1` and `flushInterval: 0` on server client
- Always include `userId` as a property on every event
- Call `posthog.identify(userId)` after login on client
- Call `posthog.reset()` on logout on client

---

## Arcjet

**Check first:** Check AGENTS.md for an installed Arcjet skill. If an Arcjet MCP server is configured — use it.

### Middleware Setup

```typescript
// src/middleware.ts
import arcjet, { tokenBucket, detectBot } from '@arcjet/next';
import { clerkMiddleware } from '@clerk/nextjs/server';

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: 'LIVE',
      refillRate: 100,
      interval: 60,
      capacity: 200,
    }),
    detectBot({
      mode: 'LIVE',
      allow: ['GOOGLEBOT', 'BINGBOT'],
    }),
  ],
});

export default clerkMiddleware(async (auth, req) => {
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
    if (decision.reason.isBot()) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }
  // ...
});
```

**Rules:**

- Always run Arcjet before your app logic in middleware
- Use `LIVE` mode in production — `DRY_RUN` for testing
- Always handle rate limit and bot detection separately
- Set sensible limits based on your use case

---

## next-intl

**Check first:** Check AGENTS.md for an installed next-intl skill. If a next-intl MCP server is configured — use it.

### Middleware Setup

```typescript
// src/middleware.ts
import createIntlMiddleware from 'next-intl/middleware';

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'es', 'fr'],
  defaultLocale: 'en',
});

export default clerkMiddleware(async (auth, req) => {
  const response = intlMiddleware(req);
  // ... auth logic
  return response;
});
```

### Usage in Components

```typescript
// src/app/dashboard/page.tsx
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('welcome', { name: user.name })}</p>
    </div>
  );
}
```

### Message Files

```typescript
// src/i18n/messages/en.json
{
  "dashboard": {
    "title": "Dashboard",
    "welcome": "Welcome, {name}!"
  }
}
```

**Rules:**

- Always use `useTranslations` in Server Components — never pass translations as props
- Use ICU message format with variables: `{name, plural, ...}`
- Keep messages in `src/i18n/messages/` — one file per locale

---

## next-themes

**Check first:** Check AGENTS.md for an installed next-themes skill. If a next-themes MCP server is configured — use it.

### Provider Setup

```typescript
// src/app/providers/ThemeProvider.tsx
'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
```

### Usage

```typescript
// src/components/ThemeToggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

**Rules:**

- Always use `attribute="class"` for Tailwind dark mode
- Always use `disableTransitionOnChange` to avoid flash
- Use `useTheme` hook for accessing and changing theme

---

## @t3-oss/env-nextjs

**Check first:** Check AGENTS.md for an installed t3-env skill. If a t3-env MCP server is configured — use it.

### Setup

```typescript
// src/config/env.ts
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    CLERK_SECRET_KEY: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
    RESEND_API_KEY: z.string().startsWith('re_'),
    ARCJET_KEY: z.string().min(1),
    SENTRY_DSN: z.string().url().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    ARCJET_KEY: process.env.ARCJET_KEY,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
```

### Usage

```typescript
// src/server/actions/stripe.ts
import { env } from '@/config/env';

export async function createCheckoutSession() {
  const session = await stripe.checkout.sessions.create({
    success_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
    // ...
  });
}
```

**Rules:**

- Always import `env` from `@/config/env` — never access `process.env` directly
- Always validate server variables with Zod — fail fast on missing values
- Client variables must start with `NEXT_PUBLIC_`
- Use `skipValidation` only in development

---

## Vitest

**Check first:** Check AGENTS.md for an installed Vitest skill. If a Vitest MCP server is configured — use it.

### Config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/unit/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      thresholds: {
        statements: 70,
        branches: 65,
        functions: 70,
        lines: 70,
      },
      exclude: [
        'src/components/ui/**',
        'src/types/**',
        '**/*.d.ts',
        '**/index.ts',
      ],
    },
  },
});
```

### Test Example

```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('combines class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
    expect(cn('foo', { bar: true })).toBe('foo bar');
  });
});
```

### Component Test

```typescript
// src/components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

**Rules:**

- Use `describe` and `it` for test structure
- Use `render` and `screen` from `@testing-library/react`
- Always use `expect` from `vitest` (globals enabled)
- Keep coverage thresholds at 70%

---

## Playwright

**Check first:** Check AGENTS.md for an installed Playwright skill. If a Playwright MCP server is configured — use it.

### Config

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### Test Example

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can sign in', async ({ page }) => {
  await page.goto('/sign-in');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

**Rules:**

- Always use `baseURL` from config — never hardcode URLs
- Always include accessibility checks with `@axe-core/playwright`
- Use `trace: 'on-first-retry'` for debugging
- Run tests against built app in CI
