# Design System: Meadow

**Project ID:** starter-nextjs

## 1. Visual Theme & Atmosphere

- **Aesthetic Mood:** Warm, organic, cozy, and minimalist. It is designed to feel like a tactile, physical "analogue" space rather than a cold, corporate digital interface.
- **Density & Breathing Room:** Highly airy and spacious layout, using generous margins and soft whitespace to establish a calm, peaceful visual flow ("meadow of imagination").
- **Physical Texture:** Utilizes a fixed background overlay (`.paper-texture`) featuring a subtle, high-frequency SVG noise filter with very low opacity (5% / `0.05`). This gives the entire interface the organic feel of textured watercolor paper or fine linen.

---

## 2. Color Palette & Roles

- **Alabaster Background (`#f9f8f6`):**
  - **Role:** Primary background color for the application body.
  - **Atmosphere:** A soft, comforting, off-white hue that mimics physical paper and reduces eye strain compared to harsh whites.
- **Accent Black (`#111111`):**
  - **Role:** High-contrast text, primary logo, outline borders, and main interactive button backgrounds.
  - **Atmosphere:** A deep, rich charcoal black that anchors the organic layout and provides crisp structure.
- **Meadow Green (`#6e9c4e`):**
  - **Role:** Brand identifier, accent elements, badges, icons, and decorative circle highlights.
  - **Atmosphere:** A muted, organic, herbal sage green that reinforces the nature-focused identity.
- **Soft Sage Green Tints (`#8fbc6a` / `#a8d08d`):**
  - **Role:** Secondary badge background rings, avatar borders, and supportive brand graphics.
  - **Atmosphere:** Soft gradients and tints that add depth to the community/social elements.
- **Charcoal Gray / Secondary Text (`#525252`):**
  - **Role:** Body text, secondary copy, inline subtitles, form labels, and placeholder texts.
  - **Atmosphere:** Medium-gray contrast that provides comfortable readability while maintaining a soft, human aesthetic.
- **Translucent Glass White (`rgba(255, 255, 255, 0.7)` / `rgba(255, 255, 255, 0.6)` / `rgba(255, 255, 255, 0.85)`):**
  - **Role:** Bento card backgrounds, floating navigation panels, and interactive controls.
  - **Atmosphere:** Paired with `backdrop-filter: blur(12px)` and thin borders to create soft, modern glass layers.

---

## 3. Typography Rules

- **Main Body / Sans-Serif:** Inter (`var(--font-inter)`), sans-serif.
  - **Usage:** Used for body copy, buttons, interface labels, and navigation.
  - **Character:** Clean, highly legible, and structured.
- **Accent / Handwritten:** Caveat (`var(--font-caveat)`), cursive.
  - **Usage:** Used for major headings, quotes, and decorative titles (e.g., "Create from the Heart," "Morning Light," "Earth & Clay").
  - **Character:** Highly personal, hand-crafted, fluid, and artistic. Adds a human signature to the layout.
- **Labels & Subtitles / Monospace:** Space Mono (`var(--font-space-mono)`), monospace.
  - **Usage:** All-caps tags, user counts, dates, category metadata, and input form text.
  - **Character:** Rigid and typed. Usually paired with wide letter-spacing (`tracking-widest` / `tracking-[0.12em]` to `tracking-[0.2em]`) and small text size (`10px` - `13px`). Grounds the layout like typewriter text in an editorial zine.

---

## 4. Component Stylings

### Buttons

- **Primary / Magnetic Button (`.magnetic-btn`):**
  - **Shape:** Pill-shaped/fully rounded (`border-radius: 100px`).
  - **Styling:** Accent Black (`#111111`) solid background, white text, 500 weight, 14px size, and 2% letter-spacing.
  - **Behavior:** Integrates a magnetic attraction effect on hover, accompanied by a smooth, deep drop shadow (`0 8px 24px -4px rgba(17, 17, 17, 0.3)`).
- **Secondary / Outline Button (`.outline-btn`):**
  - **Shape:** Pill-shaped/fully rounded (`border-radius: 100px`).
  - **Styling:** Transparent background, crisp black outline border (`1.5px solid var(--accent-black)`), black text.
  - **Behavior:** Smoothly inverts color settings on hover, transitioning to a solid black background with white text.

### Cards & Containers

- **Bento Cards (`.bento-cell` and `.bento-cell-img`):**
  - **Shape:** Generously rounded corners (`border-radius: 24px`).
  - **Styling:** Translucent Glass White (`rgba(255, 255, 255, 0.7)`) background with a backdrop blur of `12px`. Outlined with a high-opacity white border (`1px solid rgba(255, 255, 255, 0.9)`) and a delicate drop shadow (`0 4px 24px -4px rgba(17, 17, 17, 0.04)`).
  - **Behavior:** Elevated translation on hover (`translateY(-2px)`) with a custom easing curve (`0.4s cubic-bezier(0.25, 1, 0.5, 1)`) and a deeper, softer shadow hover state (`0 12px 32px -8px rgba(17, 17, 17, 0.08)`).
- **Floating Navigation Bar (`.floating-nav`):**
  - **Shape:** Pill-shaped (`border-radius: 100px`).
  - **Styling:** Positioned fixed at the top (`top: 24px`), centered. Translucent Glass White background (`rgba(255, 255, 255, 0.6)`) with `16px` backdrop blur, a light border (`1px solid rgba(255, 255, 255, 0.8)`), and soft shadow.

### Inputs & Forms

- **Form Input Fields:**
  - **Shape:** Pill-shaped (`rounded-full`).
  - **Styling:** Semi-translucent white background (`bg-white/80`), thin charcoal border (`border-[#111111]/10`), and Space Mono text font (`font-mono-custom`) with a 14px size (`text-sm`).
  - **Behavior:** Smooth focus border-color transition to solid charcoal (`focus:border-[#111111]/30`) and outline-none active state.

---

## 5. Layout Principles

- **Whitespace Strategy:** Generous padding (`py-24 md:py-32`) to separate major thematic sections, encouraging quiet visual breathing space.
- **Section Dividers:** Discrete horizontal rule dividers (`.section-divider`) with `1px` height, a light charcoal tint (`rgba(17, 17, 17, 0.08)`), and a maximum content width of `1200px` (`max-w-300`).
- **Bento Grid Architecture:**
  - Grids utilize 3-column (`md:grid-cols-3`) or 4-column (`md:grid-cols-4`) structures with `16px` gaps (`gap-4`).
  - **Responsive Rules:** Grids collapse to a single column (`grid-template-columns: 1fr`) and columns reset to `span 1` on viewport widths smaller than 768px (`max-width: 768px`).
