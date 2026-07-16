# 🌿 Starter Next.js (Meadow Theme)

A production-ready, opinionated starter kit for building modern full-stack web applications. Built on **Next.js 16 (App Router)**, **React 19**, and **TypeScript**, with styling defined by the custom organic **Meadow Design System** (Tailwind CSS v4 + paper texture aesthetics).

Starter App Preview

![Starter App Preview](public/image.png)
---

## 🛠️ Core Technology Stack

- **Framework:** Next.js 16 (App Router) & React 19
- **Language:** TypeScript (Strict mode enabled)
- **Styling:** Tailwind CSS v4 & custom HSL-based design system (Meadow)
- **Authentication:** Clerk (`@clerk/nextjs`)
- **Database:** Neon PostgreSQL (Serverless) & Drizzle ORM
- **State Management:** Zustand (client state) & TanStack Query v5 (server-cache state)
- **Form Handling:** React Hook Form & Zod schema validation
- **Observability:** Pino logger & Sentry error tracking
- **Testing:** Vitest & Playwright E2E testing framework
- **Code Quality:** ESLint, Prettier, Stylelint, Husky, and lint-staged

---

## 🚀 Getting Started

### 1. Install Dependencies

This project uses **Bun** as its primary package manager (as indicated by the `bun.lock` file):

```bash
bun install
```

_(Alternatively, you can run `npm install`, `pnpm install`, or `yarn install`.)_

### 2. Environment Configuration

Copy the example environment variables file and configure your keys:

```bash
cp .env.example .env.local
```

> [!IMPORTANT]
> Never commit `.env.local` or raw secret keys to source control. Only verify and update keys in `.env.example` as a template for other developers.

### 3. Run Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Local Webhook Testing (Clerk & Stripe)

To receive webhooks locally from Clerk and Stripe, you need to expose your local development server to the internet using **ngrok** (or another tunnel like Tailscale Funnel):

1. **Install and Start ngrok**:

   ```bash
   ngrok http 3000
   ```

   _If you are using a custom/persistent ngrok domain:_

   ```bash
   ngrok http --domain=your-domain.ngrok-free.app 3000
   ```

2. **Configure Next.js Allowed Dev Origins**:
   When using a tunneling service in development, add your ngrok domain to `allowedDevOrigins` inside `next.config.ts` so Next.js accepts requests from the tunnel:

   ```typescript
   const nextConfig: NextConfig = {
     allowedDevOrigins: ['your-domain.ngrok-free.app'],
     // ...
   };
   ```

3. **Configure Clerk Webhooks**:
   - Go to your **Clerk Dashboard** > **Webhooks** > **Add Endpoint**.
   - Set the URL to: `https://your-domain.ngrok-free.app/api/webhooks/clerk`.
   - Select the events to listen to (e.g., `user.created`, `user.updated`).
   - Copy the **Signing Secret** and paste it in `.env.local` as `CLERK_WEBHOOK_SECRET`.

4. **Configure Stripe Webhooks**:
   - **Method A: Stripe CLI (Highly Recommended)**:
     Download and run the Stripe CLI to listen locally:
     ```bash
     stripe listen --forward-to localhost:3000/api/webhooks/stripe
     ```
     Copy the CLI-provided webhook signing secret (e.g., `whsec_...`) and set it as `STRIPE_WEBHOOK_SECRET` in `.env.local`.
   - **Method B: ngrok Endpoint**:
     - Go to your **Stripe Dashboard** > **Developers** > **Webhooks** > **Add endpoint**.
     - Set the URL to: `https://your-domain.ngrok-free.app/api/webhooks/stripe`.
     - Select events (e.g., `checkout.session.completed`, `customer.subscription.deleted`).
     - Copy the **Signing Secret** and set it as `STRIPE_WEBHOOK_SECRET` in `.env.local`.

---

## ⚙️ Development Scripts & Commands

All development commands configured in `package.json` can be run using your package manager (`bun`, `npm`, `pnpm`, or `yarn`):

### Code Quality & Linting

| Command              | Action                         | Tool Description                                                                          |
| :------------------- | :----------------------------- | :---------------------------------------------------------------------------------------- |
| `bun run lint`       | Check ESLint violations        | Inspects JavaScript/TypeScript code for syntax, style, and programmatic errors.           |
| `bun run lint:fix`   | Auto-fix ESLint violations     | Automatically resolves auto-fixable lint warnings/errors in the codebase.                 |
| `bun run format`     | Auto-format files              | Uses **Prettier** to rewrite all files matching the configurations in `.prettierrc.json`. |
| `bun x tsc --noEmit` | checking typscript error files |

### Styling & CSS Validation

To validate and lint stylesheet syntax (powered by **Stylelint**):

```bash
bunx stylelint "**/*.css" --allow-empty-input
```

This verifies that custom CSS variables and utility classes follow standard styling rules.

### Building & Production

| Command               | Action                        | Process Description                                                                                                                                                                         |
| :-------------------- | :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `bun run build`       | **Strict Production Build**   | Runs a Prettier format check, validates CSS via Stylelint, and compiles the Next.js production build (`prettier --check . && stylelint && next build`). If any step fails, the build halts. |
| `bun run build:local` | **Local Auto-Format & Build** | Formats files with Prettier (`--write`), lints CSS, and compiles the Next.js production bundle.                                                                                             |
| `bun run start`       | Start Production Server       | Serves the pre-compiled Next.js production application on `localhost:3000`.                                                                                                                 |

### Database & Drizzle ORM

Database operations are managed via **Drizzle Kit**. When working with the schema, use these commands:

- **Generate Schema Migrations:**
  ```bash
  bunx drizzle-kit generate
  ```
- **Push Schema Changes to DB Directly (Dev/Staging):**
  ```bash
  bunx drizzle-kit push
  ```
- **Apply Pending Schema Migrations:**
  ```bash
  bunx drizzle-kit migrate
  ```
- **Launch Database Visual Inspector (Drizzle Studio):**
  ```bash
  bunx drizzle-kit studio
  ```

### Git Hooks

- **Prepare Husky Hooks:**
  ```bash
  bun run prepare
  ```
  _(Automatically configures Husky pre-commit hooks to run `lint-staged` on modified files)._

---

## 📁 Project Architecture

A quick look at the codebase folder organization:

```
├── .agents/                 # AI agent workspace instructions and custom skills
├── app/                     # Next.js App Router (pages, layouts, routes, API)
├── components/              # UI components (ui/ primitives, forms, layouts, shared)
├── config/                  # App constants & validated type-safe env variables
├── context/                 # Core documentation (architecture, design system, build plan)
├── db/                      # Database clients, schemas (Drizzle), and migrations
├── hooks/                   # Reusable React custom hooks
├── lib/                     # Client singletons (Pino logger, Stripe, UploadThing, utils)
├── styles/                  # Global style files (globals.css containing Tailwind @theme)
├── package.json             # Scripts, engines, and package dependencies
└── README.md                # Project documentation
```
