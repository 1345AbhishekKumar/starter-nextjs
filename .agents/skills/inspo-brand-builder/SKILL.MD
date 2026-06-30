---
name: inspo-brand-builder
description: >
  Turn design inspiration images + app context into a custom brand identity and polished HTML sections via an iterative loop. Trigger whenever a user uploads reference images alongside an app description and wants a hero, landing page section, or brand guidelines — even casual phrasing like "here are some inspo images", "design my hero based on these", "match this aesthetic", or "create brand guidelines from these images" qualifies. Analyzes images for visual DNA, generates custom brand guidelines, builds production-quality HTML, then iterates until the user approves and locks in a DESIGN.md. Trigger proactively any time images are uploaded with any hint of designing an app — do not wait for an explicit request.
---

# Inspo Brand Builder

Turn inspiration images + app context into a custom brand identity and production-quality HTML sections. Iterate until the user loves the result, then lock in a complete `DESIGN.md`.

---

## Phase 0 — Gather Context

Confirm you have all three before proceeding:

1. **Inspiration images** — at least one uploaded image (mood boards, UI screenshots, color palettes, photography, anything visually inspiring)
2. **App context** — what the app does, who it's for, what tone is desired
3. **Sections requested** — which section(s) to build (default: hero)

If any are missing, ask one targeted question at a time:

- No images → "Could you upload some inspiration images? Anything works — UI screenshots, color palettes, photography, or designs you admire."
- No app context → "Tell me about your app — what does it do, who uses it, and what feeling should it have?"
- No sections specified → assume hero section; confirm after presenting

Do not proceed until images and app context are confirmed.

---

## Phase 1 — Full Inspiration Extraction

Analyze the inspiration image(s) across two parallel layers: **Visual DNA** (how it feels) and **Layout DNA** (how it's structured). Both layers directly shape Phase 3. Do not skip layout analysis even for mood boards or photography — infer structural intent from what's present.

---

### 1A — Visual DNA

**Color Signals**
- Background tone: dark / light / midtone
- 3–6 specific hex colors visible or implied
- Accent / highlight color(s)
- Temperature: warm / cool / neutral
- Saturation: muted / vibrant / pastel / neon

**Typography Signals**
- Dominant feeling: serif / sans-serif / display / mixed
- Display personality: editorial, geometric, humanist, slab, experimental
- Weight character: thin/light vs bold/heavy dominant
- Letter-spacing vibe: tight / open

**Mood & Personality**
- 3–5 adjectives describing the images (minimal, editorial, cinematic, raw, playful, clinical, luxe, etc.)
- Design era / influence: Swiss/International, Bauhaus, Y2K, brutalist, Material, Fluent, Apple HIG
- Energy level: calm / energetic / intense
- Premium vs. approachable

**Visual Language**
- Key motifs or shapes: geometric, organic, grid-heavy, diagonal, overlapping, flowing
- Texture: grainy, glossy, flat, glassmorphic, noise-layered
- Spatial rhythm: dense vs. airy

---

### 1B — Layout & Structure DNA

Extract the structural skeleton from the images. If an image is a UI screenshot, read it literally. If it is a mood board, photography, or abstract reference, infer the structural intent (e.g. a wide landscape photo with subject on the left implies a split composition).

**Navigation Anatomy**
- Position: top bar / side nav / floating / hidden / bottom / none visible
- Style: transparent / solid / sticky / blurred backdrop
- Content: logo placement, link alignment, CTA in nav, avatar/profile

**Compositional Structure**
- Dominant layout type: centered mass / left-anchored / right-anchored / split-screen / full-bleed / diagonal flow / asymmetric / grid-first
- Visual gravity: where does the eye land first, second, third?
- Balance: symmetric / asymmetric / radial
- Negative space use: generous breathing room vs. controlled density

**Content Hierarchy**
- How many levels of visual hierarchy are visible (headline / sub / body / meta)?
- What carries the most visual weight (type, image, color block, white space)?
- Is text overlaid on imagery, separated from it, or used as the visual element itself?

**Section Patterns** (for each section visible in the images)
- Hero: eyebrow + headline + sub + CTA stack? Split text/image? Full-bleed image with text overlay? Centered? Offset?
- Features: card grid / icon list / alternating rows / horizontal scroll / tabbed?
- General: how are sections separated (whitespace, color, divider, overlap)?

**Grid Signals**
- Estimated columns: 1 / 2 / 3 / 4 / 12-col grid
- Gutter character: tight (8-12px) / standard (16-24px) / generous (32-48px)
- Max-width feel: full-bleed / contained (1200px range) / narrow editorial (800px range)
- Alignment: strict grid / grid-breaking / freeform

**Spacing Character**
- Overall density: tight and dense / balanced / airy and spacious
- Section padding: compact / standard / generous
- Internal component spacing: tight / comfortable

**Component Placement Patterns**
- Where do CTAs live? (inline in hero / floating / sticky / end of sections)
- How does imagery relate to text? (beside / behind / below / overlapping)
- Are there layered / overlapping elements or strict separation?
- Any decorative elements? (floating blobs, geometric shapes, lines, gradients, illustrations)

**Wireframe Sketch**
Produce a rough ASCII wireframe of the primary layout observed across the images. If multiple images show different sections, combine them into one unified sketch:

```
+--------------------------------------+
| NAV: Logo          Links        CTA  |
+--------------------------------------+
|                                      |
|   [describe hero composition here]   |
|                                      |
+--------------------------------------+
|   [describe next section if visible] |
+--------------------------------------+
```

This wireframe becomes the structural blueprint Phase 3 builds from.

---

## Phase 2 — Custom Brand Guidelines

Using Visual DNA from Phase 1 and the app context, generate a **custom brand identity** for the user's app — not a generic template, but a system that could only belong to this specific product.

Present the brand guidelines in this format:

```
╔══════════════════════════════════════════════════════════╗
║  [APP NAME] — BRAND GUIDELINES                          ║
║  Direction: [Aesthetic Archetype Name]                  ║
╠══════════════════════════════════════════════════════════╣
║  PERSONALITY                                            ║
║  [3–5 brand traits derived from images + app context]   ║
╠══════════════════════════════════════════════════════════╣
║  COLOR PALETTE                                          ║
║  Primary:    #XXXXXX — [role: base bg or dominant text] ║
║  Secondary:  #XXXXXX — [role: surfaces, subtle bg]      ║
║  Accent:     #XXXXXX — [role: CTAs, highlights, focus]  ║
║  Text:       #XXXXXX — [role: primary body copy]        ║
║  Muted:      #XXXXXX — [role: secondary text, icons]    ║
║  Border:     #XXXXXX — [role: dividers, strokes]        ║
╠══════════════════════════════════════════════════════════╣
║  TYPOGRAPHY                                             ║
║  Display:  [Font Name] — [weight used for headlines]    ║
║  Body:     [Font Name] — [weight used for body text]    ║
║  Mono:     [Font Name, if applicable]                   ║
╠══════════════════════════════════════════════════════════╣
║  VISUAL LANGUAGE                                        ║
║  [2–3 sentences: what makes this design distinctive,    ║
║   how it reflects the images, and what sets it apart]   ║
╠══════════════════════════════════════════════════════════╣
║  DESIGN RULES                                           ║
║  • [rule 1 — e.g. "Corners: sharp 0px radius"]         ║
║  • [rule 2 — e.g. "Motion: fast, no bounce"]           ║
║  • [rule 3 — e.g. "Never mix more than 2 type families"]║
╠══════════════════════════════════════════════════════════╣
║  LAYOUT BLUEPRINT                                       ║
║  Composition: [centered / split / asymmetric / etc.]   ║
║  Nav:         [top bar / transparent / sticky / etc.]  ║
║  Grid:        [e.g. 12-col, 24px gutter, 1200px max]  ║
║  Spacing:     [tight / balanced / airy]                ║
║  Key pattern: [e.g. "headline left, image overlaps     ║
║                right edge; CTA floats below fold"]     ║
╚══════════════════════════════════════════════════════════╝
```

Choose font names that are available on Google Fonts. Avoid Inter, Roboto, Arial, system-ui, and other overused defaults.

---

## Phase 3 — HTML Section Generation

Using the brand guidelines from Phase 2 **and the Layout DNA from Phase 1B**, generate production-quality HTML for each requested section.

### Layout-First Principle
Before writing any code, map the structural blueprint:
- Start from the wireframe sketch produced in Phase 1B
- Identify the compositional structure (split-screen? centered? asymmetric?)
- Apply the grid signals (columns, gutter, max-width) as the CSS layout foundation
- Replicate the navigation anatomy observed (position, style, content arrangement)
- Honor the spacing character (dense vs. airy) in section padding and component gaps
- Place CTAs where the inspiration images placed emphasis — not just "below the fold"
- Carry over any distinctive placement patterns (overlapping elements, diagonal breaks, text-over-image)

The HTML layout structure should feel like it was directly inspired by the images, not just sharing their color palette.

### Code Standards
- Single self-contained HTML file — `<style>` and `<script>` embedded inline
- Google Fonts imported via `<link>` in `<head>`
- All brand tokens defined as CSS custom properties in `:root`
- At least one well-orchestrated entrance animation (staggered `animation-delay`)
- No external dependencies except Google Fonts

---

### Responsive Design Mandate

> **Reference:** `reference/responsive-design.md` — read it before writing any layout code.

Production-grade responsive design uses **three layers simultaneously** — never only breakpoints:

| Layer | Tool | Purpose |
|---|---|---|
| Intrinsic | `clamp()`, `fr`, `minmax()` | Fluid text, spacing, and grids — zero breakpoints needed |
| Device-Agnostic | Container Queries | Components adapt to their container, not the global viewport |
| Mobile-First Fallback | `min-width` media queries | Structural overrides only when intrinsic sizing can't do the job |

#### Required in every section generated:

**1. Fluid sizing with `clamp()` for all font sizes and spacing:**
```css
:root {
  --fs-display:    clamp(2.5rem, 7vw, 6rem);
  --fs-headline:   clamp(1.75rem, 4vw, 3.5rem);
  --fs-body:       clamp(1rem, 1.25vw, 1.125rem);
  --space-section: clamp(4rem, 10vw, 8rem);
  --space-gap:     clamp(1rem, 3vw, 2.5rem);
  --max-width:     min(1200px, 90vw);
}
```

**2. Intrinsic fluid grids (no breakpoints for column count):**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: var(--space-gap);
}
```

**3. Container query on any reusable component:**
```css
.component-wrapper { container-type: inline-size; }

@container (min-width: 600px) {
  .hero-content { display: grid; grid-template-columns: 1fr 1fr; }
}

@supports not (container-type: inline-size) {
  @media (min-width: 600px) {
    .hero-content { display: grid; grid-template-columns: 1fr 1fr; }
  }
}
```

**4. CLS prevention on all images:**
```css
.image-wrapper { aspect-ratio: 16/9; overflow: hidden; width: 100%; }
.image-wrapper img { width: 100%; height: 100%; object-fit: cover; display: block; }
```

**5. User preference queries — mandatory in every file:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

@media (prefers-color-scheme: dark) { :root { /* override tokens */ } }

@media (pointer: coarse) {
  .btn, nav a, button { min-height: 44px; padding: 12px 20px; }
}

@media (hover: hover) {
  .card:hover { transform: translateY(-4px); }
}
```

**6. Anti-Mix Law for CSS variables:**
Never hardcode a hex, rem, or px value that is also declared as a CSS variable. All color and spacing usage must go through `var(--token-name)`.

**7. Images — LCP vs. below-fold rules:**
- LCP/hero image → `loading="eager"` + `fetchpriority="high"` + explicit `width`/`height`
- All other images → `loading="lazy"` + `decoding="async"` + explicit `width`/`height`
- Art direction (different crop per screen) → use `<picture>` with `<source media="...">`

**8. Logical properties for internationalisation:**
Use `margin-inline`, `margin-block`, `padding-inline`, `padding-block`, `border-block-end` over their physical equivalents.

### Design Quality Bar

Before writing a line of code, commit to a bold aesthetic direction and execute it with precision.

**Must-haves:**
- **Typography**: Distinctive, characterful font pairing that matches the brand guidelines
- **Color**: Dominant palette from Phase 2 — clear hierarchy, not evenly distributed
- **Motion**: Staggered load animation + purposeful hover states on interactive elements
- **Layout**: Unexpected composition — asymmetry, overlap, diagonal accents, or dramatic negative space
- **Background**: Atmosphere over flat color — gradient mesh, noise overlay, geometric decoration, or layered depth
- **Detail**: Custom CTA button style, precise spacing, micro-interactions that feel designed

**Hard avoids:**
- Purple gradients on white backgrounds
- Generic card grids with shadows and rounded corners
- Standard SaaS "hero with mockup on the right" layout
- Inter, Roboto, Arial, system fonts
- Predictable layouts that lack visual identity

The HTML should look like it could appear on Awwwards or Mobbin.

### Section Templates (build whichever are requested)

**Hero** (default):
- Full viewport height (`100svh`)
- Headline + sub-headline + CTA(s)
- Background treatment matching brand visual language
- Decorative element reflecting brand motifs
- Optional: animated element, subtle particle field, or typographic decoration

**Features**:
- 3–6 feature items with icon/illustration and description
- Grid or alternating-row layout with visual rhythm
- Section eyebrow + headline

**Pricing**:
- 2–3 tiers, highlighted recommended tier
- Feature list per tier, clear CTA per tier

**Testimonials / Social Proof**:
- Quote cards or marquee strip
- Avatar + name + title attribution

**CTA / Conversion**:
- Bold full-width section
- Single sharp CTA button
- Supporting copy — minimal

**Footer**:
- Logo, navigation, social links
- Newsletter input (optional)
- Legal / copyright line

---

## Phase 4 — Review Prompt

After presenting brand guidelines + HTML, always end with:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Design Direction: [Aesthetic Archetype Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
What would you like to do?

  "I like it" or "that's the one"
    → I'll generate your complete DESIGN.md

  Tell me what to change (colors, fonts, layout, mood...)
    → I'll revise this direction

  "Try something different" or "start over"
    → I'll explore a completely new aesthetic archetype
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Phase 5 — Iteration Loop

### Partial revision (user wants specific changes):
- Keep the same Visual DNA extraction
- Adjust only what the user specified
- Note what changed at the top: "Updated: [what changed and why]"
- Regenerate brand guidelines + HTML

### Full aesthetic reset (user wants something different):
- Return to Phase 1 and pick a **new aesthetic archetype** — nothing should carry over except app context
- Explicitly contrast old vs. new at the top:

```
── Iteration [N] ─────────────────────────────
Previously: [Old Archetype] — [brief descriptor]
Now trying:  [New Archetype] — [brief descriptor]
What's different: [2–3 sentences]
──────────────────────────────────────────────
```

Never repeat an aesthetic archetype within the same session.

---

## Phase 6 — DESIGN.md (on approval only)

When the user says "I like it", "looks good", "that's it", "approved", "yes", "perfect", or any clear affirmation:

Apply the `design-md-from-image` skill's full 16-layer extraction protocol to the approved brand guidelines and HTML code as the design source.

Extract all layers:
1. Brand Impression → `## Overview`
2. Color System → `## Colors` + YAML `colors:`
3. Gradients → `## Gradients` + YAML `gradients:`
4. Typography System → `## Typography` + YAML `typography:`
5. Spacing Scale → `## Layout` + YAML `spacing:`
6. Grid System → `## Grid` + YAML `grid:`
7. Shadows & Elevation → `## Elevation & Depth` + YAML `shadows:`
8. Border System → `## Borders` + YAML `borders:`
9. Opacity Scale → `## Opacity` + YAML `opacity:`
10. Z-Index Scale → YAML `z-index:`
11. Border Radius → `## Shapes` + YAML `rounded:`
12. Motion Tokens → `## Motion` + YAML `motion:`
13. Icon System → `## Icons` (prose)
14. Layout Structure → `## Layout Structure` + ASCII wireframe
15. Component Deep Extraction → `## Components` + YAML `components:`
16. Dark/Light Mode → `## Color Schemes` + YAML (if both modes exist)

Save as `DESIGN.md` and present to the user via `present_files`.

---

## Aesthetic Archetype Library

Draw from these when choosing a direction. Never repeat within a session. Feel free to invent new archetypes that better fit the images.

| Archetype | Feeling | Type Character | Color Character |
|---|---|---|---|
| Dark Editorial | Cinematic, serious | Display serif + light sans | Near-black bg, off-white text, warm accent |
| Warm Brutalism | Raw, honest, bold | Heavy grotesque + mono | Sand, terracotta, ink black |
| Neon Clarity | Electric, sharp | Geometric sans | Deep navy/black bg, neon accent |
| Soft Systems | Calm, trustworthy | Rounded sans | Pale blue, cloud gray, soft teal |
| Cold Precision | Surgical, premium | Condensed sans + mono | White/platinum, steel, cold blue accent |
| Organic Flow | Human, creative | Humanist serif | Earth, botanical green, warm beige |
| Retro Futurism | Nostalgic + forward | Display slab + mono | Aged cream, muted gold, space black |
| Glass Noir | Luxe, dark, layered | Thin serif + geometric | Black, charcoal, chrome, jewel accent |
| Playful Dense | Energetic, fun | Display rounded + bold | Saturated multi-color, bold contrast |
| Swiss Minimal | Rational, austere | Grotesque (not Inter) | Pure white, black, single strong accent |
| Ink & Paper | Editorial, literary | Classic serif | Cream, deep ink, muted sepia |
| Cyber Industrial | Techy, raw | Mono + stencil | Dark steel, electric, safety orange |

---

## Self-Review Checklist (run before presenting HTML)

**Visual fidelity**
- [ ] Colors match the brand guidelines exactly — use CSS variables, not inline hex
- [ ] Fonts loaded from Google Fonts, not generic fallbacks
- [ ] CSS custom properties defined in `:root` for every brand token
- [ ] At least one entrance animation with staggered timing
- [ ] Background has atmosphere — not a flat solid color
- [ ] No generic SaaS defaults (no Inter, no purple gradients, no standard card grids)

**Layout fidelity**
- [ ] Compositional structure matches the wireframe sketch from Phase 1B
- [ ] Nav position and style matches what was observed in the inspiration images
- [ ] Grid columns and gutter character (tight/standard/generous) are reflected in CSS
- [ ] Spacing density (airy vs. dense) is consistent with the inspiration
- [ ] CTA placement matches the emphasis patterns from the inspiration images
- [ ] Any distinctive structural features (overlaps, diagonals, text-over-image) are carried through

**Responsive — Intrinsic Sizing**
- [ ] `clamp()` used for every `font-size`, `padding`, `gap`, and section margin in `:root`
- [ ] No raw pixel values for spacing that would cause overflow at 320px
- [ ] Container max-width uses `min(Xpx, 90vw)` pattern — not a fixed `px` max-width

**Responsive — Layout**
- [ ] Multi-column grids use `auto-fit`/`auto-fill` + `minmax(min(X, 100%), 1fr)` — no breakpoints for column count
- [ ] Container query declared on at least the primary reusable component
- [ ] `@supports not (container-type: inline-size)` fallback provided

**Responsive — Images**
- [ ] LCP/hero image has `loading="eager"` + `fetchpriority="high"` — never lazy
- [ ] Below-fold images have `loading="lazy"` + `decoding="async"`
- [ ] All `<img>` have explicit `width` and `height` attributes
- [ ] Image wrappers use `aspect-ratio` to prevent CLS
- [ ] Art-directed images use `<picture>` with `<source media="...">`

**Responsive — Preferences & Accessibility**
- [ ] `prefers-reduced-motion: reduce` block is present and REMOVES animations (never adds)
- [ ] `prefers-color-scheme: dark` overrides CSS custom properties in `:root`
- [ ] `pointer: coarse` ensures min 44px tap targets on `.btn`, `nav a`, interactive elements
- [ ] Hover effects gated behind `@media (hover: hover)` — never applied unconditionally
- [ ] Meaningful SVGs have `role="img"` + `<title>`; decorative SVGs have `aria-hidden="true"`

**Responsive — Maintainability**
- [ ] ALL colors, font sizes, spacing values declared as CSS custom properties in `:root`
- [ ] Anti-Mix Law: zero hardcoded hex/rem/px values that duplicate a `:root` variable
- [ ] Logical properties (`margin-inline`, `padding-block`, `border-block-end`) used in place of physical equivalents

**Overall quality**
- [ ] Mental model test passed at 320px, 375px, 768px, 1024px, 1440px — no overflow, no broken grids
- [ ] Design looks directly inspired by the images, not just sharing their color palette
- [ ] The overall result looks genuinely designed, not generated