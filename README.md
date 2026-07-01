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

---

## ⚙️ Development Scripts & Commands

All development commands configured in `package.json` can be run using your package manager (`bun`, `npm`, `pnpm`, or `yarn`):

### Code Quality & Linting

| Command            | Action                     | Tool Description                                                                          |
| :----------------- | :------------------------- | :---------------------------------------------------------------------------------------- |
| `bun run lint`     | Check ESLint violations    | Inspects JavaScript/TypeScript code for syntax, style, and programmatic errors.           |
| `bun run lint:fix` | Auto-fix ESLint violations | Automatically resolves auto-fixable lint warnings/errors in the codebase.                 |
| `bun run format`   | Auto-format files          | Uses **Prettier** to rewrite all files matching the configurations in `.prettierrc.json`. |

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
