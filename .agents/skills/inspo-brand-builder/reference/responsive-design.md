# Responsive Design Reference
**For use by the `inspo-brand-builder` skill — Phase 3 code generation**

Source: _The New Standard: Building Production-Grade Interfaces with Intrinsic, Device-Agnostic Web Design_

---

## Strategy: Three Layers, Not One

Never rely solely on viewport breakpoints. Every section generated must combine all three layers:

| Layer | Paradigm | Primary Tool | Scope |
|---|---|---|---|
| 1 | Intrinsic Design | `clamp()`, `fr`, `minmax()` | Fluid sizing of text, spacing, grids |
| 2 | Device-Agnostic | Container Queries | Component-level context adaptation |
| 3 | Mobile-First Fallback | `min-width` media queries | Structural breakpoints only when needed |

The goal: components that look correct whether placed in a narrow sidebar or a full-bleed hero — without context-specific overrides.

---

## 1. Fluid Sizing — clamp() Everywhere

Replace any fixed `px` value for size, spacing, or gap with a `clamp()` range. This eliminates the need for repetitive breakpoint overrides.

```css
/* Typography scale */
--fs-display:    clamp(2.5rem, 7vw, 6rem);
--fs-headline:   clamp(1.75rem, 4vw, 3.5rem);
--fs-subhead:    clamp(1.125rem, 2.5vw, 1.5rem);
--fs-body:       clamp(1rem, 1.25vw, 1.125rem);
--fs-small:      clamp(0.8rem, 1vw, 0.9rem);

/* Spacing scale */
--space-section: clamp(4rem, 10vw, 8rem);   /* section padding */
--space-gap:     clamp(1rem, 3vw, 2.5rem);   /* grid/flex gaps */
--space-inset:   clamp(1rem, 5vw, 4rem);     /* container padding */
```

**Rule:** `MIN` = smallest still-legible/usable value. `IDEAL` = viewport-relative unit (`vw`, or calc mix). `MAX` = design ceiling. Never go below 1rem for body text.

---

## 2. Fluid Grids — auto-fit + minmax()

Multi-column layouts should reflow without any explicit breakpoints:

```css
/* Card grid — reflwos automatically from 1 → 2 → 3+ columns */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: var(--space-gap);
}

/* Icon / feature grid — tighter minimum */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr));
  gap: var(--space-gap);
}
```

The `min(300px, 100%)` guard prevents the minimum width from causing horizontal overflow on very narrow viewports.

---

## 3. Container Queries — Component-First Adaptation

Use container queries for any component that might appear in multiple layout contexts. This decouples the component's behavior from the global viewport.

```css
/* Step 1: declare containment on the parent */
.section-wrapper,
.card-container {
  container-type: inline-size;
  container-name: card;   /* optional name for specificity */
}

/* Step 2: query from inside the component */
@container card (min-width: 500px) {
  .hero-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
}

@container card (min-width: 800px) {
  .feature-card {
    flex-direction: row;
    gap: 2rem;
  }
}
```

**Fallback for unsupported browsers (Safari < 16.4):**
```css
@supports not (container-type: inline-size) {
  @media (min-width: 500px) {
    .hero-content { display: grid; grid-template-columns: 1fr 1fr; }
  }
}
```

---

## 4. Intrinsic Sizing Keywords

Use the browser's own content-sizing engine instead of forcing pixel values:

```css
.tag           { width: fit-content; }           /* pill/badge: shrinks to text */
.nav-logo      { width: max-content; }           /* never wraps */
.body-copy     { max-width: min(65ch, 100%); }   /* ideal reading line length */
.section-inner { width: min(1200px, 90vw); margin-inline: auto; } /* fluid max-width */
```

---

## 5. CSS Custom Properties as the Single Source of Truth

**All design tokens go into `:root`. Nothing else.**

```css
:root {
  /* Colors */
  --color-bg:      #0a0a0a;
  --color-text:    #f0f0f0;
  --color-accent:  #ff4e00;
  --color-muted:   #888;
  --color-border:  rgba(255,255,255,0.08);
  --color-surface: rgba(255,255,255,0.04);

  /* Typography */
  --fs-display:    clamp(2.5rem, 7vw, 6rem);
  --fs-headline:   clamp(1.75rem, 4vw, 3.5rem);
  --fs-body:       clamp(1rem, 1.25vw, 1.125rem);
  --font-display:  'Playfair Display', serif;
  --font-body:     'DM Sans', sans-serif;

  /* Layout */
  --max-width:     min(1200px, 90vw);
  --space-section: clamp(4rem, 10vw, 8rem);
  --space-gap:     clamp(1rem, 3vw, 2.5rem);
  --border-radius: 8px;

  /* Motion */
  --ease-out:      cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 180ms;
  --duration-base: 320ms;
}
```

**Anti-Mix Law:** Never hardcode a hex, rem, or px value that is also declared as a CSS variable. All usage must go through `var(--token-name)`. This makes theming, dark mode, and iteration trivially easy.

---

## 6. Responsive Images

### LCP (Hero, above-fold) — NEVER lazy-load

```html
<picture>
  <!-- Art direction: wide crop for desktop -->
  <source media="(min-width: 768px)"
          srcset="hero-wide.webp 1x, hero-wide@2x.webp 2x"
          type="image/webp">
  <!-- Default: tall crop for mobile -->
  <img src="hero-tall.webp"
       alt="Descriptive alt text."
       loading="eager"
       fetchpriority="high"
       decoding="auto"
       width="800"
       height="1000">
</picture>
```

### Gallery / Below-fold images — always lazy

```html
<img
  srcset="img-400.webp 400w, img-800.webp 800w, img-1200.webp 1200w"
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 400px"
  src="img-800.webp"
  alt="..."
  loading="lazy"
  decoding="async"
  width="400"
  height="300">
```

**Non-negotiable rules:**
- `loading="eager"` + `fetchpriority="high"` on the single most important above-fold image
- `loading="lazy"` + `decoding="async"` on everything else
- ALWAYS provide explicit `width` and `height` attributes — this is how the browser reserves layout space before the image loads

---

## 7. CLS Prevention (Cumulative Layout Shift)

Reserve space before images and media load. Unexpected layout shift during load is a UX failure.

```css
/* Wrapper reserves the ratio; image fills it */
.image-wrapper {
  aspect-ratio: 16 / 9;    /* or 1/1, 4/3, 3/2, 21/9 — match the image */
  overflow: hidden;
  width: 100%;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

```css
/* Prevent scrollbar appearing/disappearing from shifting content */
html {
  scrollbar-gutter: stable;
}
```

---

## 8. Logical Properties (i18n Readiness)

Prefer logical over physical CSS properties. This makes layouts resilient to RTL languages and different writing modes at zero extra cost.

```css
/* ✅ Logical (use these) */
margin-inline: auto;            /* instead of margin-left + margin-right */
margin-block: 2rem;             /* instead of margin-top + margin-bottom */
padding-block: 1.5rem;          /* instead of padding-top + padding-bottom */
padding-inline: 1.5rem;         /* instead of padding-left + padding-right */
border-block-end: 1px solid var(--color-border); /* instead of border-bottom */
inset-inline-start: 0;          /* instead of left: 0 */
```

---

## 9. User Preference Queries

These three are mandatory in every section generated:

```css
/* ── REDUCED MOTION ──────────────────────────────────────── */
/* Rule: remove motion, never add it inside this block */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ── COLOR SCHEME ─────────────────────────────────────────── */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #000;
    --color-text: #fff;
    /* Override only what changes; everything else inherits */
  }
}

/* ── TOUCH TARGETS ────────────────────────────────────────── */
@media (pointer: coarse) {
  .btn, nav a, button, [role="button"] {
    min-height: 44px;
    padding: 12px 20px;
  }
}

/* ── HOVER EFFECTS ─────────────────────────────────────────── */
/* Only apply hover transforms/shadows on devices that support hover */
@media (hover: hover) {
  .card:hover  { transform: translateY(-4px); }
  .btn:hover   { filter: brightness(1.1); }
}
```

---

## 10. SVG Responsiveness

```html
<!-- Decorative icon: hide from screen readers -->
<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <!-- paths -->
</svg>

<!-- Meaningful icon: provide accessible name -->
<svg viewBox="0 0 24 24" role="img" aria-label="Search">
  <title>Search</title>
  <!-- paths -->
</svg>
```

**Always include `viewBox`.** Never set fixed `width`/`height` on responsive SVGs without `viewBox`. `preserveAspectRatio="xMidYMid meet"` is the safe default if the SVG needs to letterbox.

---

## 11. Production Responsive Audit

Run this checklist before every HTML section is delivered:

### Fluid Sizing
- [ ] `clamp()` used for every `font-size`, `padding`, `gap`, and `margin` value
- [ ] No raw pixel values for spacing that would cause overflow at ≤375px
- [ ] Container max-width uses `min(Xpx, 90vw)` pattern

### Layout
- [ ] Multi-column layouts use `auto-fit`/`auto-fill` + `minmax()` — no breakpoints for column count
- [ ] Container queries used for at least the primary reusable component
- [ ] `@supports not (container-type: inline-size)` fallback present

### Images
- [ ] LCP/hero image: `loading="eager"` + `fetchpriority="high"`, NO lazy
- [ ] Below-fold images: `loading="lazy"` + `decoding="async"`
- [ ] All `<img>` have explicit `width` and `height` attributes
- [ ] Image wrappers use `aspect-ratio` to prevent CLS

### Preferences & Accessibility
- [ ] `prefers-reduced-motion: reduce` block REMOVES animations
- [ ] `prefers-color-scheme: dark` overrides CSS custom properties
- [ ] `pointer: coarse` block ensures min 44px tap targets
- [ ] Hover effects gated behind `@media (hover: hover)`

### Maintainability
- [ ] ALL colors, sizes, fonts declared as CSS custom properties in `:root`
- [ ] Anti-Mix Law enforced: zero hardcoded values that duplicate a variable
- [ ] Logical properties used for directional margins/padding

### Mental Model Test Sizes
- [ ] 320px — no overflow, text readable
- [ ] 375px — standard mobile, primary design target
- [ ] 768px — tablet pivot point
- [ ] 1024px — laptop
- [ ] 1440px — wide desktop, no layout breaks, no runaway white space