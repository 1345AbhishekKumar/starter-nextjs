---
name: todos-md-generator
description: Generates a complete, phased, start-to-end TODOS.md build plan for any project — with full detail per task including subtasks, tech stack notes, and acceptance criteria. Use this skill whenever a user wants to plan a project build from scratch, says things like "help me plan my app", "create a todos list for building X", "break down my project into phases", "what should I build first", "project roadmap for X", "generate a build plan", "plan out my SaaS", "what do I need to build", or describes an app idea and wants to know what to build and in what order. Also trigger when the user uploads a project overview, brief, PRD, AGENTS.md, or README and wants a phased build plan from it. Trigger proactively any time a user describes a new app or feature set and hasn't yet planned how to build it — even if they don't say "todos" explicitly.
---
 
# TODOS.md Generator
 
Takes any project idea — from a one-liner to a full brief — and generates a complete, phased, start-to-end `TODOS.md` with rich detail per task: subtasks, tech notes, and acceptance criteria.
 
---
 
## Step 1 — Read Context First
 
**Before asking anything**, check what's already available:
 
| If you have... | Then... |
|---|---|
| An uploaded file (AGENTS.md, PRD, overview, README, design doc) | Extract everything from it. Only ask if genuinely unclear. |
| A detailed description in the user's message | Use it. Skip questions already answered. |
| A bare one-liner ("build a job board") | Go to Step 2 — full interview. |
 
**Rule**: Never ask a question whose answer is already implied or stated. If you're not confused, don't ask.
 
---
 
## Step 2 — Interview (only when needed)
 
Ask questions in **groups**, one group at a time. Wait for answers before the next group. Skip any question you already know the answer to.
 
### Group A — The Project
1. What are you building? *(one or two sentences)*
2. Who is it for? *(consumers, businesses, internal team, developers?)*
3. What's the single most important thing it must do well?
### Group B — Tech Stack
4. What's your tech stack? *(or say "help me choose" and Claude will suggest)*
5. Web app, mobile app, or both?
### Group C — Scope
6. What are the key features / pages you know you want? *(rough list is fine)*
7. Any integrations? *(payments, email, AI, analytics, third-party APIs)*
8. Solo dev or team? Any timeline pressure?
**Hard rules:**
- If context file exists → skip everything already answered
- Never ask more than 3–4 questions if you have partial context
- If you'd only be asking for completeness, not because it changes the output → skip it
---
 
## Step 3 — Phase Overview First
 
Before generating the full file, output a **compact phase overview table** so the user can validate scope:
 
```
## Phase Plan — [Project Name]
 
| Phase | Name | Focus | Est. Time |
|-------|------|-------|-----------|
| 0 | Project Setup | Repo, env, tooling | 0.5 days |
| 1 | Foundation | Layout, routing, design system, DB schema | 2 days |
| 2 | Homepage | Hero, features, pricing, footer | 2 days |
| 3 | Auth | Sign up, sign in, sessions, protected routes | 1.5 days |
| ... | ... | ... | ... |
```
 
Then ask:
> "Does this phase breakdown look right? Anything to add, remove, or reorder before I generate the full plan?"
 
If the user says **"looks good / just generate it / yes"** → proceed to Step 4.
 
---
 
## Step 4 — Generate the Full TODOS.md
 
### File Header
 
```markdown
# TODOS.md — [Project Name]
 
> [One-line project description]
> **Stack:** [full tech stack]
> **Type:** [Web / Mobile / Both] | **Solo / Team**
> **Generated:** [date]
 
---
 
## Legend
- [ ] Not started  |  [~] In progress  |  [x] Done
- 🔴 High priority  |  🟡 Medium  |  🟢 Low
- **Complexity:** `S` < 2hrs · `M` half-day · `L` full day · `XL` 2+ days
```
 
---
 
### Phase Structure
 
```markdown
---
 
## Phase [N] — [Phase Name]
> **Goal:** [One sentence — what this phase achieves and what it unlocks]
> **Estimated:** [X days]
> **Ships when:** [What a user/dev can do at the end of this phase]
 
### [Section / Feature Name]
 
- [ ] **[Task Name]** `[S/M/L/XL]` 🔴
  - **What:** [Clear description of what this task involves]
  - **Why:** [Why it matters — what it enables or unblocks]
  - **Stack notes:** [Specific libraries, hooks, components, APIs — be precise]
  - **Subtasks:**
    - [ ] [Subtask 1]
    - [ ] [Subtask 2]
    - [ ] [Subtask 3]
  - **Acceptance criteria:**
    - [ ] [Criterion 1 — observable, testable]
    - [ ] [Criterion 2]
    - [ ] [Criterion 3]
```
 
---
 
### Standard Phase Order
 
Adapt this to the project. Collapse phases that don't apply; split large phases if needed.
 
| Phase | Name | Typical Contents |
|-------|------|-----------------|
| 0 | Project Setup | Repo init, env vars, linting, CI skeleton, folder structure |
| 1 | Foundation | Core layout, navigation shell, design tokens, DB schema, routing |
| 2 | Marketing / Homepage | Landing page sections (hero, features, pricing, footer, etc.) |
| 3 | Auth & Users | Sign up, sign in, sign out, sessions, protected routes, user profile |
| 4 | Core Feature(s) | The primary thing the app does — main screens/flows |
| 5 | Secondary Features | Supporting pages, dashboards, settings, notifications |
| 6 | Integrations | Payments, email, AI, analytics, third-party APIs |
| 7 | Polish & UX | Animations, empty states, error states, loading skeletons, accessibility |
| 8 | Performance & SEO | Lighthouse, OG tags, lazy loading, caching, Core Web Vitals |
| 9 | Testing | Unit tests, integration tests, E2E flows |
| 10 | Launch Prep | Deployment, monitoring, backups, documentation, go-live checklist |
 
**Reorder rules:**
- If auth gates every feature → move Phase 3 to Phase 1 or 2
- If it's a pure API/backend → remove marketing phases
- If it's mobile-only → adapt accordingly (navigation = tab bar, etc.)
- Merge phases when total tasks are < 5 in either
---
 
### Quality Rules (non-negotiable)
 
- **Every task has subtasks** — no bare single-line checkboxes
- **Every task has acceptance criteria** — minimum 2, written as observable facts
- **Stack notes are specific** — name actual packages, hooks, APIs (e.g. `useForm` from `react-hook-form` + `zodResolver`, not just "use a form library")
- **Each phase is independently shippable** — ends in something runnable or reviewable
- **No fluff tasks** — every item is something a developer would genuinely check off
- **Complexity tags are honest** — if a task is `XL`, say so; don't underestimate
- **Phases have "Ships when" lines** — so the dev knows what done looks like per phase
---
 
## Step 5 — Save and Present
 
1. Save the full output as `TODOS.md` in the output directory
2. Present the file to the user
3. Offer follow-ups:
   > "Want me to also generate an AGENTS.md for this project, or break any phase into more granular tasks?"