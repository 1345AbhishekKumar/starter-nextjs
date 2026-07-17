/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const htmlContent = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Architecture review — starter-nextjs</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
    </script>
    <style>
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
      .deep { background: linear-gradient(135deg, #0f172a, #1e293b); }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header class="border-b border-stone-200 pb-6">
        <h1 class="text-3xl font-serif font-bold tracking-tight text-stone-900">Architecture Review: starter-nextjs</h1>
        <p class="text-sm text-stone-500 mt-2">Date: 2026-07-17 | System Theme: Meadow</p>
        
        <div class="mt-4 flex flex-wrap gap-6 text-xs text-stone-600 font-mono">
          <div class="flex items-center gap-2">
            <span class="inline-block w-4 h-4 bg-white border border-stone-300 rounded"></span>
            <span>Shallow Module</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-block w-4 h-4 bg-slate-900 rounded"></span>
            <span>Deep Module</span>
          </div>
          <div class="flex items-center gap-2 font-bold text-red-600">
            <span>&rarr;</span>
            <span>Leakage / Friction</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-block border border-dashed border-stone-500 w-6 h-0"></span>
            <span>Seam</span>
          </div>
        </div>
      </header>

      <section id="top-recommendation" class="bg-emerald-50 border border-emerald-200 rounded-xl p-6 shadow-sm">
        <h2 class="text-xl font-serif font-semibold text-emerald-950">Top Recommendation</h2>
        <p class="mt-2 text-stone-700">
          Tackle <a href="#ai-summarization" class="font-semibold text-emerald-800 underline hover:text-emerald-950">Candidate 1: Deepen the AI Content Summarization module</a> first.
          By isolating the text-generation providers behind a clean local seam, we resolve the rate limiting, subscription status, and token budgeting leakage that currently congests the drafts Server Action.
        </p>
      </section>

      <section id="candidates" class="space-y-12">
        <!-- Candidate 1 -->
        <article id="ai-summarization" class="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-4 scroll-mt-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-xl font-serif font-semibold text-stone-900">1. Deepen the AI Content Summarization module</h3>
              <div class="flex gap-2 mt-1">
                <span class="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-medium">Strong Recommendation</span>
                <span class="bg-stone-100 text-stone-700 text-xs px-2 py-0.5 rounded-full font-mono">ports & adapters</span>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs text-stone-400 font-mono">Location: lib/ai.ts</span>
            </div>
          </div>

          <div class="text-sm font-mono text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-100">
            Files: lib/ai.ts | actions/drafts.ts
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div class="border border-stone-100 rounded-lg p-4 bg-stone-50">
              <h4 class="text-xs uppercase tracking-wider text-stone-400 font-bold mb-2">Before: Shallow Integration & Procedural Callers</h4>
              <div class="rounded-lg border border-slate-200 bg-white p-4">
                <pre class="mermaid">
flowchart TD
    DA[actions/drafts.ts] -->|Reads config, parses model| AI[lib/ai.ts]
    DA -->|Direct dependency| AR[arcjetClient/rateLimiting]
    DA -->|Queries directly| SUB[actions/stripe.ts:getSubscriptionStatus]
    DA -->|Applies token bucket| LIMIT[lib/ai-limits.ts]
    AI -->|Inline instantiation| PROVIDER[Third-party Provider: Nvidia/Gemini/OpenRouter]
    classDef leak stroke:#dc2626,stroke-width:2.5px;
    class DA,LIMIT,SUB leak;
                </pre>
              </div>
            </div>
            <div class="border border-stone-100 rounded-lg p-4 bg-slate-900 text-white">
              <h4 class="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">After: Deep Module with a Clean Seam</h4>
              <div class="rounded-lg border border-slate-700 bg-slate-850 p-4 text-slate-900">
                <pre class="mermaid">
flowchart TD
    DA[actions/drafts.ts] -->|Simple request| AIService[DraftSummarizer Seam]
    subgraph AIServiceImpl [Deep Module Implementation]
        AIService -->|Adapter selection| Adapter[LiveAISummarizer / FakeAISummarizer]
        Adapter -->|Rate limits & token checks| Internals[Internal Token/Rate Rules]
        Adapter -->|Invokes provider| Network[API Providers]
    end
    classDef deep fill:#0f172a,stroke:#38bdf8,stroke-width:2px;
    class AIService,AIServiceImpl,Adapter,Internals,Network deep;
                </pre>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <p class="text-stone-800"><span class="font-semibold">Problem:</span> The content generation is a shallow module that performs remote fetching directly. The caller in <code class="font-mono text-xs bg-stone-100 px-1 py-0.5 rounded">actions/drafts.ts</code> has to coordinate auth, billing, and token checks procedurally, making it impossible to write predictable unit/integration tests without active network dependencies.</p>
            <p class="text-stone-800"><span class="font-semibold">Solution:</span> Put a seam in front of AI operations. The deepened <code class="font-mono text-xs bg-stone-100 px-1 py-0.5 rounded">DraftSummarizer</code> interface accepts content and configuration, handling token validation internally, and executes through either a production provider adapter or a predictable local fake adapter.</p>
            <div class="mt-3">
              <h5 class="text-xs uppercase font-bold tracking-wider text-stone-500">Wins:</h5>
              <ul class="list-disc list-inside text-sm text-stone-700 space-y-1 mt-1">
                <li>Locality: Prompts and limits stay encapsulated.</li>
                <li>Leverage: Callers use one simple interface.</li>
                <li>Seam exposes clean testing surface.</li>
                <li>Fakes replace complex mock configurations.</li>
              </ul>
            </div>
          </div>
        </article>

        <!-- Candidate 2 -->
        <article id="billing" class="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-4 scroll-mt-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-xl font-serif font-semibold text-stone-900">2. Deepen the Billing and Subscription module</h3>
              <div class="flex gap-2 mt-1">
                <span class="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-medium">Strong Recommendation</span>
                <span class="bg-stone-100 text-stone-700 text-xs px-2 py-0.5 rounded-full font-mono">ports & adapters</span>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs text-stone-400 font-mono">Location: lib/stripe.ts</span>
            </div>
          </div>

          <div class="text-sm font-mono text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-100">
            Files: lib/stripe.ts | actions/stripe.ts
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div class="border border-stone-100 rounded-lg p-4 bg-stone-50">
              <h4 class="text-xs uppercase tracking-wider text-stone-400 font-bold mb-2">Before: Procedural Stripe API Operations</h4>
              <div class="rounded-lg border border-slate-200 bg-white p-4">
                <pre class="mermaid">
flowchart TD
    Controller[actions/stripe.ts] -->|Direct call| Stripe[stripe.customers.create / stripe.checkout.sessions.create]
    Controller -->|Queries DB| DB[(Neon Database)]
    classDef leak stroke:#dc2626,stroke-width:2.5px;
    class Controller,Stripe leak;
                </pre>
              </div>
            </div>
            <div class="border border-stone-100 rounded-lg p-4 bg-slate-900 text-white">
              <h4 class="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">After: SubscriptionBilling Ports and Adapters Seam</h4>
              <div class="rounded-lg border border-slate-700 bg-slate-850 p-4 text-slate-900">
                <pre class="mermaid">
flowchart TD
    Caller[Server Actions / Routes] -->|Clean calls| Seam[SubscriptionBilling Seam]
    subgraph BillingImpl [Deep Module Implementation]
        Seam -->|Adapts to| Adapter[StripeBillingAdapter / MockBillingAdapter]
        Adapter -->|Encapsulated logic| DB[(Neon DB)]
        StripeBillingAdapter -->|Network calls| StripeAPI[Stripe Web API]
    end
    classDef deep fill:#0f172a,stroke:#38bdf8,stroke-width:2px;
    class Seam,BillingImpl,Adapter,StripeBillingAdapter deep;
                </pre>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <p class="text-stone-800"><span class="font-semibold">Problem:</span> The stripe integration resides inside server actions that communicate directly with the database and Stripe SDK client. This makes unit testing user lifecycles or checkout routing impossible without running against real external Stripe connections.</p>
            <p class="text-stone-800"><span class="font-semibold">Solution:</span> Establish a <code class="font-mono text-xs bg-stone-100 px-1 py-0.5 rounded">SubscriptionBilling</code> interface with methods like <code class="font-mono text-xs bg-stone-100 px-1 py-0.5 rounded">checkout</code>, <code class="font-mono text-xs bg-stone-100 px-1 py-0.5 rounded">portal</code>, and <code class="font-mono text-xs bg-stone-100 px-1 py-0.5 rounded">status</code>. Provide a live <code class="font-mono text-xs bg-stone-100 px-1 py-0.5 rounded">StripeBillingAdapter</code> and an in-memory <code class="font-mono text-xs bg-stone-100 px-1 py-0.5 rounded">MockBillingAdapter</code> for testing.</p>
            <div class="mt-3">
              <h5 class="text-xs uppercase font-bold tracking-wider text-stone-500">Wins:</h5>
              <ul class="list-disc list-inside text-sm text-stone-700 space-y-1 mt-1">
                <li>Locality: Encapsulates pricing configurations together.</li>
                <li>Leverage: Simple inputs for billing operations.</li>
                <li>Mock billing speeds up pipeline tests.</li>
                <li>Decouples Stripe dependency from controllers.</li>
              </ul>
            </div>
          </div>
        </article>

        <!-- Candidate 3 -->
        <article id="storage" class="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-4 scroll-mt-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-xl font-serif font-semibold text-stone-900">3. Deepen the Storage and Media optimization module</h3>
              <div class="flex gap-2 mt-1">
                <span class="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-medium">Worth exploring</span>
                <span class="bg-stone-100 text-stone-700 text-xs px-2 py-0.5 rounded-full font-mono">local-substitutable</span>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs text-stone-400 font-mono">Location: actions/uploadcare.ts</span>
            </div>
          </div>

          <div class="text-sm font-mono text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-100">
            Files: actions/uploadcare.ts | components/uploader/FileUploader.tsx | components/uploader/FileGrid.tsx
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div class="border border-stone-100 rounded-lg p-4 bg-stone-50">
              <h4 class="text-xs uppercase tracking-wider text-stone-400 font-bold mb-2">Before: Direct DB Writes and Scattered Transforms</h4>
              <div class="rounded-lg border border-slate-200 bg-white p-4">
                <pre class="mermaid">
flowchart TD
    Widget[Uploadcare Widget] -->|Upload success| Action[actions/uploadcare.ts:syncUploadcareFile]
    Action -->|Direct insert| DB[(Neon DB)]
    Grid[components/uploader/FileGrid.tsx] -->|Manual string manipulation| Transforms[On-the-fly CDN resize/format]
    classDef leak stroke:#dc2626,stroke-width:2.5px;
    class Action,Grid,Transforms leak;
                </pre>
              </div>
            </div>
            <div class="border border-stone-100 rounded-lg p-4 bg-slate-900 text-white">
              <h4 class="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">After: Unified MediaStorage Module</h4>
              <div class="rounded-lg border border-slate-700 bg-slate-850 p-4 text-slate-900">
                <pre class="mermaid">
flowchart TD
    Uploader[Uploader components] -->|Stores files| MediaStorage[MediaStorage Seam]
    subgraph StorageImpl [Deep Module Implementation]
        MediaStorage -->|Adapter selection| Adapter[UploadcareAdapter / LocalDiskAdapter]
        Adapter -->|Sync and transform metadata| DB[(Neon DB)]
    end
    classDef deep fill:#0f172a,stroke:#38bdf8,stroke-width:2px;
    class MediaStorage,StorageImpl,Adapter deep;
                </pre>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <p class="text-stone-800"><span class="font-semibold">Problem:</span> File registration, cleanup, and CDN image transformations are exposed as individual shallow actions and string manipulations in components. It's difficult to run tests on page renders containing galleries without real Uploadcare URLs.</p>
            <p class="text-stone-800"><span class="font-semibold">Solution:</span> Group file actions under a single <code class="font-mono text-xs bg-stone-100 px-1 py-0.5 rounded">MediaStorage</code> module. Let it govern image optimization and metadata syncing, supporting local storage fallback in local development and testing environments.</p>
            <div class="mt-3">
              <h5 class="text-xs uppercase font-bold tracking-wider text-stone-500">Wins:</h5>
              <ul class="list-disc list-inside text-sm text-stone-700 space-y-1 mt-1">
                <li>Locality: Group CDN url modifications in one place.</li>
                <li>Leverage: Abstract database insertions from views.</li>
                <li>Mock adapter facilitates instant file list mock seeding.</li>
              </ul>
            </div>
          </div>
        </article>
      </section>
    </main>
  </body>
</html>`;

const tempDir = os.tmpdir();
const timestamp = Date.now();
const filename = 'architecture-review-' + timestamp + '.html';
const filePath = path.join(tempDir, filename);

fs.writeFileSync(filePath, htmlContent, 'utf-8');
console.log('Report written to: ' + filePath);

let command = '';
if (process.platform === 'darwin') {
  command = 'open "' + filePath + '"';
} else if (process.platform === 'win32') {
  command = 'start "" "' + filePath + '"';
} else {
  command = 'xdg-open "' + filePath + '"';
}

exec(command, (err) => {
  if (err) {
    console.error('Failed to open the file automatically:', err);
  } else {
    console.log('Opened report in browser.');
  }
});
