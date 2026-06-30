---
name: web-design-pro
description: >
  A comprehensive professional web design knowledge system covering layout, typography, color theory,
  UX, conversion optimization, and advanced visual techniques. Use this skill whenever the user asks
  for design feedback, help designing a page or component, typography or color advice, layout
  decisions, UX critique, or conversion improvement. Trigger proactively for any request involving
  visual design quality — even casual phrasing like "does this look good", "what font should I use",
  "improve my hero section", "critique my landing page", "how should I design X", "what color
  palette works here", "my design feels off", or "make this look more professional". If there's a
  design decision being made, use this skill.
---

# Web Design Pro

A structured knowledge system for giving expert-level web design guidance. When this skill triggers,
Claude should reason from first principles across all relevant domains below — not just the one
explicitly asked about. Great design is holistic: a typography question often reveals a hierarchy
problem; a "boring" layout is often a whitespace or color problem.

---

## 1. Layout Fundamentals

### Grid Systems
- Use a **12-column grid** as the standard; never use arbitrary widths.
- Prefer **1, 2, or 3-column layouts** — complexity doesn't equal quality.
- Two-column: feature+icon blocks, testimonials, alternating image/text, bento grids.
- One-column: hero sections, CTAs, focused messaging.
- **Bento box** layouts (variable-size cards) work well for mixed content — always establish a clear visual priority within them.

### Visual Hierarchy (The 1-2-3 Rule)
1. **Level 1** — Largest: main headlines, hero images. Commands immediate attention.
2. **Level 2** — Medium: supporting text, subheadings, secondary imagery.
3. **Level 3** — Smallest: background details, labels, minor links.

Hierarchy is established through: size contrast, color/opacity, weight, and spatial position.

### White Space
- White space is not empty — it's breathing room that signals confidence and clarity.
- Give elements room to breathe; tight spacing signals amateur design.
- The **4-8-16 rule**: use 4px for tight padding, 8px for moderate gaps, 16px+ for section breathing room. Scale in multiples of 4.

### Layout Variation
- Alternate layouts as users scroll (1-col → 2-col → 1-col) to maintain engagement.
- Use **diagonal balance** or **asymmetric balance** — avoid perfectly centered, equally weighted elements.

### The F-Pattern is Outdated
- Don't rely on the F-pattern. Use visual hierarchy to actively guide the eye instead of assuming passive scanning behavior.

---

## 2. Typography

### Typeface Categories & Personality
| Category | Feel | Best Used For |
|---|---|---|
| Serif | Authoritative, classic, trustworthy | Banks, law, editorial, luxury |
| Sans-serif | Clean, modern, versatile | Tech, SaaS, consumer products |
| Display | Expressive, eye-catching | Logos, hero headlines only |
| Script | Elegant, calligraphic | Luxury brands, invitations |
| Handwritten | Playful, personal | Lifestyle, informal brands |
| Monospace | Technical, precise | Code, developer tools |

### Font Pairing — The Rule of Two
- **1 font**: perfectly fine and elegant.
- **2 fonts**: interesting — typically a display/serif anchor + a sans-serif workhorse.
- **3 fonts**: pushing it.
- **4 fonts**: almost always a mistake.
- Use **super-families** (fonts with serif + sans + mono variants) for easy harmonious pairing.
- Match **x-heights** when pairing — incompatible x-heights create visual friction.
- Use [Fonts in Use](https://fontsinuse.com) to find proven pairings.

### Sizing — The Golden Ratio System
- Base size × **1.618** = next size up (e.g., 16px → 26px → 42px → 68px).
- For dense UIs or mobile: use **square root of golden ratio** (~1.27×) for subtler scaling.
- For fluid typography: use CSS `clamp()` to scale between mobile min and desktop max.
- Pick sizes from a **predefined type scale** — never pick random pixel values.

### Hierarchy in Practice
- **H1**: Page summary, largest, boldest — the anchor.
- **H2**: Section dividers — must be easily scannable.
- **Body text**: 100% opacity, 16px minimum, 150% line-height.
- **Labels/captions**: 40–70% opacity, smaller size — "lightness" via opacity, not just size.

### Spacing Rules
| Context | Rule |
|---|---|
| Line height (body) | ~150% |
| Line height (headings) | 110–130% |
| Letter spacing (large/bold text) | Tighten — Gestalt proximity |
| Letter spacing (small text) | Loosen for legibility |
| Letter spacing (all-caps) | Always increase |
| Optimal line length | 13–15 words / 30–50 characters |

### Common Errors to Avoid
- **Widows & orphans**: lone words at paragraph end or column top — fix with manual line breaks.
- **Jagged rags**: uneven right edge of paragraph — aim for smooth, subtle curves.
- **Overlapping ascenders/descenders**: watch for clashes in tight line heights (g, y vs. b, h).
- **Italics in sans-serif**: too subtle for emphasis — use bold, color, or underlines instead.
- **Square text compositions**: avoid matching widths between heading levels — vary deliberately.
- **Overused defaults**: avoid Open Sans, Roboto unless intentional — invest in a distinctive typeface.

### Advanced Typography Techniques
- **Condensed headlines**: allow larger type without excessive vertical space.
- **Variable fonts**: adjust weight/width dynamically across breakpoints.
- **Intentional opacity hierarchy**: H1 at 100%, H2 at 87%, supporting text at 60% (Google Material Design system).
- **All-caps**: always increase letter-spacing — characters need breathing room.
- Skip **at least 3 weight steps** between hierarchy levels for clear contrast (e.g., Thin → Bold, not Light → Regular).
- For creative layouts: rotate 90°, mask with images, use text as texture/shape, overlap layers, follow geometric paths.

---

## 3. Color

### The 60-30-10 Rule
- **60%** — Dominant color (white, black, gray, or primary brand neutral).
- **30%** — Brand colors (secondary palette, used in sections, cards, backgrounds).
- **10%** — Accent color (CTA buttons, highlights, key links — one color only).

### Action Color Strategy
- Pick **one primary action color** for all interactive elements. This trains users where to look.
- Never use raw primary colors (pure red, green, blue) — always use tuned/desaturated versions.
- When in doubt: black & white is a valid and often powerful palette.

### Accessibility
- Text contrast ratio: **minimum 4.5:1** for normal text, **7:1** recommended.
- Tools: [coolors.co](https://coolors.co), Figma's built-in contrast checker, Photoshop "Proof Setup".
- Never rely on color alone — pair with icons, labels, or patterns for status communication.
- Check designs in color-blind simulation mode (Photoshop Proof Setup / browser plugins).

### Depth & Sophistication
- **Shadows**: never use pure black. Use dark gray (#4D4D4D), set to Multiply mode, 30–50% opacity.
- **Glassmorphism**: subtle blur + semi-transparent surfaces add depth and modernity.
- **Gaussian blur backgrounds**: 10–20px blur on images creates sophisticated hero/login backgrounds.
- **Grain/noise textures**: subtle noise (Figma "Noise and Texture" plugin) adds tactile quality.
- **Foreground blur elements**: out-of-focus shape in foreground = cinematic 3D depth.

---

## 4. Images & Visual Assets

### Technical Standards
- Keep images **under 300KB**.
- Save as **WebP** for photos (best compression + quality).
- Use **SVG** for logos, icons, illustrations.
- Use **JPEG/PNG** fallback for photos where WebP isn't supported.
- Apply **High Pass sharpening** (5–10px, Overlay/Soft Light) over standard sharpening.

### Composition
- **Rule of Thirds**: crop intentionally — subject on a grid intersection, not dead center.
- **Text on image**: always ensure high contrast — reduce image opacity or add overlay.
- **Image brightness variation**: design for both dark and light images in the same card/slot.

### Logos as Systems
Deliver logos as: primary mark + icon version + grayscale variant + clear space/usage rules.

---

## 5. UX & Conversion

### User-First Thinking
- Design for the **user's goal**, not your portfolio or client preferences.
- Think of web design as **a story guiding the user to an action**.
- **Design around intent**: start with the user's primary task; expand functionality only as their intent expands.

### The Top Fold
- The first section the user sees must be **immediately clear** about what the page offers.
- Include a headline (H1), supporting line, and a primary CTA above the fold.

### CTAs & Buttons
- Use **action-oriented labels**: "See Pricing", "Download the Guide" — not "Submit" or "Click Here".
- Create a clear **button hierarchy**: bold primary CTA vs. muted/outlined secondary.
- **Never use ghost buttons** as primary CTAs — they're low-contrast and often invisible.
- Keep the primary CTA **always in view** — sticky bars or frequent placement.
- **Limit choices per page**: too many actions = paralysis. One primary goal per page.

### Scannability
- Users scan, they don't read. Design for scanning:
  - Short paragraphs
  - Scannable subheadings
  - Icons alongside text
  - Card patterns with header + image + CTA

### Mobile-First
- Design mobile layout first — most users are on phones.
- Short paragraphs, tap-friendly buttons (minimum 44px tap target), single-column where possible.

### Fresh Eyes Techniques
- Scroll through your design **bottom to top** to spot imbalances and missed issues.
- **Test on real devices** — never trust emulators alone.
- View with a **fresh perspective** after stepping away.

### Progressive Disclosure & Animation
- Use animation to **reveal information progressively** — not just for decoration.
- Prefer **"Load More" buttons** over infinite scroll — gives users control + footer access.
- Subtle button hover animations: good. Scroll-jacking: use very sparingly.
- Animations should add clarity or functionality — never just movement.

### Anti-Pattern: Navigation Mistakes
- **Hamburger menu on desktop (≥1024px)**: A UX failure. Space exists — use it. Reserve hamburger for ≤768px only.
- **Too many top-level nav items**: Even large sites (Stripe) use ≤5–6. Prioritize ruthlessly.
- **Nav link font size too large**: Compare to logo size — links should be significantly smaller, not competitors.
- **Missing "Home" in nav**: Don't rely on logo-click alone — many users don't know this convention. Include it.
- **Logo not linking to home**: Always. Non-negotiable.
- **Missing footer links**: Users expect them. Include key links, social, and a repeat CTA in the footer.

### Anti-Pattern: Interaction & Flow Mistakes
- **No interactive feedback on buttons**: Every click must produce a visible response (pressed state, loading spinner). A silent click feels broken.
- **Splash pages / preloaders**: Never make users wait to enter. They add friction and hide performance problems.
- **Scroll hijacking**: Never intercept user scroll. It breaks expectation, ruins accessibility, and frustrates instantly.
- **Horizontal scroll for primary content**: Never force it. Only inside clearly bounded, labeled scroll areas.
- **Auto-playing carousels / sliders**: Few users see beyond the first slide. Auto-play harms UX and accessibility. Replace with a static hero or grid.
- **Typewriter text effects**: Delay information delivery. Remove unless there is a strong functional reason.
- **No skip option on optional onboarding steps**: Always provide a clear exit from non-mandatory flows. Sketch the full flow before designing.
- **Free-text input where a picker works**: If options are finite and predictable, use them. Free text means typos, inconsistency, and higher cognitive load. Offer a set of common options + "Other" that reveals a text field.
- **Slow, decorative animations**: Fast, purposeful motion only. Decorative slowness tests user patience — keep motion under 400ms.
- **Redundant elements**: Two buttons saying the same thing, extra arrows on obvious swipes, unnecessary strokes — each one adds noise and cognitive load. Remove everything that doesn't work.

---

## 6. Design Systems

### Why They Matter
- A design system provides shared rules for spacing, typography, color, and interaction patterns.
- Enables faster, more consistent design across a team or product.
- It's a **shared language** — not a constraint on creativity.

### Scale to Context
- Startup: lightweight system (spacing scale, 2–3 colors, 2 font sizes).
- Growth-stage: add component library, interaction patterns.
- Enterprise (Google-scale): deeply defined tokens, accessibility specs, motion standards.

### Key Systems to Define
1. **Spacing scale** (4/8/16/32/64 or similar)
2. **Type scale** (based on golden ratio or predefined scale)
3. **Color tokens** (semantic: primary, secondary, accent, error, success, etc.)
4. **Component states** (default, hover, active, disabled, focus)
5. **Shadow system** (sm/md/lg, always using multiply + dark gray)
6. **Animation system** (duration tokens: fast/normal/slow; easing curves)

---

## 7. Technical Foundations

### Code Basics Every Designer Should Know
- **HTML**: proper semantic tags (H1, H2, P, nav, section, article) for SEO + accessibility.
- **CSS**: understand flexbox, grid, custom properties, and `clamp()` for fluid type.
- **JavaScript**: basic interactivity, event listeners, scroll triggers.

### SEO
- One **H1** per page — the primary page summary.
- Descriptive **alt text** for every meaningful image.
- Logical heading hierarchy (H1 → H2 → H3, never skip levels).

### Accessibility
- **Contrast**: 4.5:1 minimum, 7:1 recommended.
- **Keyboard navigation**: all interactive elements must be focusable and operable.
- **Color-independent communication**: never use color as the only signal.
- **WCAG AA** compliance as the baseline; aim for AAA where possible.

---

## 8. Section-Specific Design Patterns

Each section of a page has its own anatomy, purpose, and failure modes. Apply these patterns before falling back to generic layout advice.

### Hero Section
- **Purpose**: Convert curiosity into intent. One message, one action.
- **Anatomy**: Mono accent label → H1 (condensed, large) → subheadline (≤12 words) → CTA → optional secondary prompt bar
- **The "Star" element**: Every great hero has one unforgettable thing — a unique font, a live product demo, a striking image carousel, a kinetic word. Identify it first, build around it.
- **Depth system** (back → front): noise texture → ambient glow → content/image → glassmorphism overlay elements → foreground blur
- **CTA button**: fit-content width, filled with accent color, never ghost, left-aligned on desktop
- **Image carousels**: 3–6 images, cross-fade dissolve 2–3s, dramatically different subjects to prove range
- **Live counters**: generation counts, user numbers — tick up in real time, add trust and energy
- **Common failures**: CTA too wide (mobile pattern on desktop), headline in 3+ equal lines (no rhythm), flat background (no depth), subtext too faint

### Footer Section
- **Purpose**: The last impression. Reinforce trust, provide navigation, capture emails.
- **Anatomy**: 4-column grid (brand 40% + 3× link columns 20% each) → bottom bar (copyright left, status/language/theme right)
- **Brand column must-haves**: logo + tagline (serif italic, ≤5 words) + newsletter bar + social icons
- **Link columns**: max 5 links each, 14px gap between links, amber mono heading, no bullet points
- **Top divider**: never a hard line — use radial gradient amber glow bleeding downward from above
- **Bottom bar**: copyright with accent-colored © symbol, system status dot (pulsing green), language selector
- **Continuity rule**: footer background = page background. Never introduce a new bg color — the footer is the same room, not a new one
- **Common failures**: too many links (sitemap, not footer), hard divider line at top, cold gray instead of warm neutral, ghost social icons

### Navigation
- **Sticky nav**: background should pick up page bg color with subtle blur — not solid opaque
- **Logo left, links center or right, CTA rightmost** — users expect this, don't break it
- **Active states**: current page link at 100% opacity, others at 55–65%
- **Mobile**: hamburger at 768px breakpoint, full-screen overlay or slide-in drawer

### Feature / Bento Sections
- **Vary card sizes** — not all equal. One hero card (2-col span) anchors the grid
- **Each card needs one visual hook**: icon, mini-screenshot, number stat, or short animation
- **Bento rule**: establish visual priority — the largest card must be the most important feature

### Pricing Section
- **3-tier is the standard**: Starter / Pro / Enterprise (or equivalent)
- **Middle tier should be visually highlighted**: 2px accent border, "Most Popular" badge
- **Annual/monthly toggle**: always offer both, default to annual (higher perceived value)
- **Feature list**: checkmarks in accent color, crossed-out items in muted gray

### Testimonial Section
- **Photo + name + role + company** — all four or skip the testimonial entirely
- **Pull quote large**: 24–32px, serif italic, accent color for quotation marks
- **Logos strip**: grayscale by default, full color on hover — signals prestigious clients without shouting

---

## 9. Design Critique Protocol

When the user shares a design (screenshot, description, or live URL), follow this exact sequence:

### Step 1 — Name the root cause first
Before listing issues, identify the ONE underlying problem generating most of the visual noise. State it clearly upfront: "The core issue is X." Everything else flows from that.

### Step 2 — Categorize issues by severity
- **Critical** (breaks intent or usability): wrong CTA weight, illegible text, broken hierarchy
- **Moderate** (degrades quality): spacing inconsistencies, weak color contrast, competing elements
- **Minor** (polish level): micro-details, hover states, subtle spacing

### Step 3 — Give specific values, not vague directions
Bad: "improve the typography"
Good: "increase H1 letter-spacing to -0.04em, set line-height to 0.95, bump size from 96px to 108px"

### Step 4 — Prioritize by impact
Give maximum 3 critical fixes. Mention moderates briefly. Save minor polish for last or omit entirely. A focused critique is more useful than an exhaustive one.

### Step 5 — End with a fix order
State which 3 fixes to make first and why: "Priority order: headline line breaks → CTA width → counter — these three alone will take this from template-level to designed."

---

## 10. Design Prompt Generation

When the user asks for a prompt to design or build a section, generate a structured design brief — not a vague paragraph. Every prompt should include:

### Prompt anatomy
1. **Concept line** — the mood/art direction in one sentence ("Cinematic Dark Atelier", "Brutalist Editorial", "Luxury Minimal")
2. **Typography spec** — font names, sizes, weights, colors, letter-spacing, line-height for each text level
3. **Color system** — explicit hex values mapped to 60-30-10 roles
4. **Layout spec** — column structure, padding values, gap values, breakpoints
5. **Depth system** — layered from back to front with opacity/blur values
6. **The star element** — the one thing that makes this section memorable
7. **CTA/interactive spec** — exact button styles, states, labels
8. **Animation sequence** — timing in ms, what animates, easing curves
9. **"Feel" line** — one sentence describing what a viewer should experience
10. **CONSTRAINTS block** — what NOT to change (when fixing existing designs)

### Prompt tone
- Use exact values: "96px", "-0.03em", "rgba(232,169,106,0.08)" — not "large" or "subtle"
- Separate concerns with clear headers — AI tools and humans both parse structure better than prose
- Include failure prevention: "never use ghost buttons", "max 5 links per column"

---

## 11. Page Continuity System

Great multi-section pages feel like **one continuous environment**, not stacked slides. Maintain continuity across sections:

- **Background**: same base color throughout — sections differentiate via surface cards, not bg swaps
- **Noise/texture**: apply once at the page level, continuous — don't restart per section
- **Ambient light**: use radial gradient glows as section dividers instead of hard lines
- **Accent color**: same hex used consistently from hero CTA to footer copyright symbol
- **Font system**: same type scale throughout — H1 in hero = same font as H1 in any other section
- **Spacing rhythm**: same base unit (4px or 8px) throughout — sections feel related because their internal spacing shares DNA

**The test**: if you screenshot any two sections and place them side by side, they should feel like they were designed in the same room on the same day.

---

## 12. Design Decision Framework

When reviewing or advising on a design, always consider these in order:

1. **Intent clarity** — Does the user immediately understand what this page is for and what to do next?
2. **Visual hierarchy** — Is there a clear 1-2-3 level system guiding the eye?
3. **Typography** — Is the type scale logical? Are spacing rules followed? Is it scannable?
4. **Color** — Is the 60-30-10 rule applied? Is contrast accessible? Is the accent used sparingly?
5. **Layout** — Is the grid consistent? Is there enough white space? Does the variation maintain engagement?
6. **UX & conversion** — Are CTAs clear and prominent? Is the top fold optimized? Is it mobile-first?
7. **Polish** — Shadows, depth, texture, animation — do they add clarity or just noise?
8. **Continuity** — Does this section feel like it belongs to the same page as the others?

---

## 13. Inspiration & Resources

| Resource | Use |
|---|---|
| [Awwwards](https://awwwards.com) | Award-caliber site inspiration |
| [SiteInspire](https://siteinspire.com) | Curated design gallery |
| [One Page Love](https://onepagelove.com) | Single-page site examples |
| [Fonts in Use](https://fontsinuse.com) | Real-world font pairing examples |
| [Future Fonts](https://futurefonts.xyz) | Unique typefaces in progress |
| [I Love Typography](https://ilovetypography.com) | Font discovery + inspiration |
| [Coolors](https://coolors.co) | Color palette generation + contrast checking |
| [Pimp My Type](https://youtube.com/@pimpmytype) | Deep typographic technique videos |

---

## 14. User Intent Framework

### Primary vs. Secondary Intent
- Every design has a **primary intent** — the core action the user came to perform.
  *Example: Vacation rental app → searching for accommodations. Lead with a search bar, not a hero image.*
- **Secondary intents** (browsing, exploring without a specific destination) are layered on top *after* the primary need is met.
- Let functionality expand in proportion to the depth of user intent. Never front-load complexity.

### Content Structure Before Visual Design
- Decide *which* content to display based on the user's interaction context before deciding how it looks.
  *Example: A listing scan needs location, rating, price — not a full description.*
- **Design for real-world variability first**: long names, light/dark images, empty states, truncated text, 0 or 1000 items. Unhandled edge cases always create unintended visual consequences.
- Content structure dictates layout — not the other way around.

### Respect Established Web Patterns
- Users carry 30+ years of learned behavior: nav at the top, left-to-right flow, logo links home, CTA is prominent and clearly labeled.
- Breaking conventions can work — but must be **intentional and purposeful**, never accidental.
- When in doubt, use the familiar pattern. Save subversion for moments where it adds clear, demonstrable value.

### Hierarchy of Needs for Any Screen
Ask these in order before designing:
1. What is the user's primary intent on this screen?
2. What is the single most important action they should take?
3. What content do they need to make that decision?
4. What secondary information supports — but doesn't compete with — the primary?

---

## 15. Common Design Mistakes: Full Taxonomy

A complete, actionable catalogue of recurring mistakes. Use this when auditing any design — match the symptom to the category.

### A. Layout, Spacing & Alignment
- **Cramped elements**: Use generous padding, especially on mobile. Never place content flush against screen edges.
- **Inconsistent spacing**: Use the 4/8/16 system strictly. Equal spacing groups related items; inconsistent spacing destroys perceived quality.
- **Broken alignment**: Everything must align to a clear vertical axis on a 12-column grid. Ad-hoc widths are always wrong.
- **Center-aligned body text**: Creates uneven starting points and reduces readability. Left-align all paragraphs and anything longer than 2 lines.
- **Unbalanced compositions**: Heavy elements in one area need a visual counterweight — even if it's whitespace.
- **Too much space within a headline**: Fractured headlines feel broken. Space *between* headlines and subheads should be larger than space *within* them.

### B. Typography & Readability
- **Too many font weights and sizes**: Limit to 2–3 weights and ~4 sizes. Fewer choices = more professional, more harmonious.
- **Poor contrast on images**: The #1 repeat offender. Fix: add a dark overlay/gradient, blur the image, or move text to a high-contrast area. Never dark text on a dark image.
- **Drop shadows on text**: Tacky and reduces readability. Avoid entirely.
- **Justified text**: Creates uneven word-spacing "rivers" through the text. Always use left-align.
- **Over-emphasis stacking**: Don't apply bold + underline + color to the same word. One emphasis style, or none.
- **Italics in sans-serif**: Too subtle to function as emphasis. Use bold, color, or underline instead.
- **Overused default fonts**: Open Sans, Roboto — unless intentional, invest in a more distinctive typeface.

### C. Navigation & User Flow
- **Hamburger menu on desktop (≥1024px)**: Wastes available space and adds an unnecessary interaction step.
- **Too many navigation items**: When everything is top-level, nothing is findable. Maximum 5–6 links.
- **Missing or weak CTA**: Every screen must answer "What do you want me to do next?" with visual clarity.
- **Redundant duplicate buttons**: Two buttons doing the same thing — remove one, merge them, or redesign the flow.
- **No skip button on optional steps**: Users who hit a wall in onboarding leave. Always design the full flow, including exits.
- **Auto-playing carousels / sliders**: Statistically ineffective. Very few users see past slide 1. Accessibility risk on auto-play. Replace with static or on-demand alternatives.
- **Splash pages & preloaders**: Pure friction. They hide performance problems instead of solving them.
- **Scroll hijacking**: Never. Users own their scroll — taking it away breaks trust immediately.
- **Forced horizontal scroll on primary content**: Never. Bounded, labeled horizontal scroll areas are the only exception.
- **Missing logo-to-home link**: Always.
- **Missing footer links**: Users look for them. Include key navigation, social links, and a secondary CTA.

### D. Visual Design & Consistency
- **Gradient overuse**: Stick to tints/shades of one hue family. Multi-color gradients usually cheapen the design. Flat color is often cleaner.
- **Harsh default drop shadows**: Figma default shadows are too heavy. Use dark gray (not black), Multiply blend mode, 30–50% opacity, high blur radius.
- **Inconsistent corner radius**: All cards, chips, and buttons of the same type must share a single radius (e.g., all 10px or all 16px — never mixed).
- **Mixed icon libraries**: Use exactly one library (Feather, Phosphor, Lucide, etc.). Match stroke width, fill style, and corner style throughout.
- **Ambiguous icons with no labels**: Icons accelerate scanning only if instantly recognizable. Label anything non-universal; tooltips for onboarding.
- **Too much accent color**: Violates the 10% rule. When everything is highlighted, nothing is. Reserve accent for CTAs and the most critical indicators.
- **Weak hierarchy — everything shouts**: If every element is bold, large, and colored, none leads. Establish an unmistakable Level 1, then Level 2, then Level 3.
- **Over-designed charts**: Rounded bar tops (hard to read exact values), missing axes, too many data points. Clarity always beats aesthetics in data visualization. A simple chart that communicates clearly beats a beautiful one that confuses.

### E. Responsive Design & Accessibility
- **No mobile view**: Over half of all traffic is mobile. An unadapted layout is completely unusable. Non-negotiable.
- **Desktop design pattern on mobile**: Separate, purpose-built mobile layouts are required — not just "zoomed out desktop."
- **Low text contrast**: Light gray text on white backgrounds can fail WCAG at 4.5:1. Check *all* text — not just text over images.
- **Color as the only status signal**: Always pair color with a label, icon, or pattern for colorblind accessibility.

### F. Interaction & Feedback
- **No button pressed/loading state**: Every interaction must produce a visible response. A silent click with no feedback feels broken.
- **Missing loading spinner on slow operations**: Users will double-click or abandon. Show progress.
- **Slow decorative animations**: Keep motion fast (200–400ms max for UI transitions). Slow motion draws attention to itself instead of the content.
- **Typewriter effects used decoratively**: Delay information delivery. Remove unless there is a strong, functional narrative reason.

---

## 16. Junior → Senior Designer Framework

### The Three Pillars of Seniority
1. **Ownership** — of tools, process, file quality, and the completeness of what gets handed off.
2. **Clarity** — approaching unfamiliar challenges with a structured methodology, not improvisation.
3. **Alignment** — proactively communicating decisions to developers, product owners, and business stakeholders before they have to ask.

### Five Concrete Actions to Stand Out at Any Level
1. **Organize your files and name every layer.** A clean, predictable file structure signals a clear mind. Any teammate should be able to open your Figma file and understand it without a walkthrough.
2. **Over-communicate your rationale.** Explicitly share *why* you made each decision — not just what it looks like. Half the job is getting developers and PMs aligned with your vision.
3. **Expand beyond pure design.** Learn enough tech, business, marketing, and psychology to solve bigger problems. The best designers can connect dots from disparate fields.
4. **Put your own spin on conventions.** Don't just copy best practices — challenge the status quo deliberately. Push the craft in the directions you believe in.
5. **Give yourself thinking time.** Innovation happens in lower-frequency brain states (alpha/theta), not under intense focus. Walk, disconnect, rest — let the synthesis happen off-screen.

### Four Core Senior Behaviors

**Think in systems, not screens.**
Seniors zoom out to see how every part of the product connects. A change to a payment input affects scheduled payments, history views, notifications, and reporting. Before designing, ask:
- Have we solved a version of this before?
- What reusable patterns or components exist?
- What is the user's mental model coming into this?
- What edge cases does this create downstream?

The outcome: a product that feels predictable, coherent, and designed as a whole — not assembled from disconnected screens.

**Connect design decisions to business impact.**
- Conduct *design spikes* — deep research aligned on business objectives — before opening Figma.
- Articulate *why* a solution matters in terms of user outcomes and business metrics, not aesthetic preferences.
- Defend decisions with logic and data. Stay flexible when real constraints change.

**Maintain extreme file precision.**
A senior's file tells the story unmistakably:
- Consistent layer naming, logical grouping, predictable frame arrangement
- All spacing uses a single system (e.g., 4px base — never ad-hoc values)
- Edge cases annotated in context (what happens with 1 item? 100 items? A very long name? No image?)
- Reusable components for anything that appears more than once
- Any developer can implement it without needing a Loom explanation

**Design for reality, not ideal scenarios.**
Proactively handle before handoff:
- Slow network connections and loading states
- Different device sizes, orientations, and input methods
- Accessibility: keyboard navigation, color contrast, screen reader hints
- User errors: what if they input something wrong? What's the recovery path?
- Extreme data: empty state (0 items), single item, very long strings, missing images

Seniors hand off designs that rarely need rework for edge cases — because they already solved them.

---

## 17. Experience as a Movie: Holistic UX Thinking

The hidden ceiling even many seniors hit: treating UI as a collection of static screens rather than a connected, temporal experience.

### From Screens to Story
- Think of the product as a **movie** — a connected, emotional experience that unfolds across time.
- Ask: How do screens *transition* into one another? What micro-interaction *rewards* a tap? How does the end-to-end flow *feel* at real-world pace?
- Design the **emotional arc**: onboarding should feel welcoming, errors should feel forgiving, success should feel rewarding. Each state has an emotional register — design it deliberately.

### Questions to Ask About Any Flow
- What does the user feel when they first land?
- What do they feel when they complete the primary action?
- What do they feel if something goes wrong?
- How long does it take to go from intent to completion — and does it feel that way?
- What transitions happen between screens, and do they communicate the relationship between states?

### Micro-Interaction Principles
- Every state change is an opportunity for delight and clarity: filling a save icon, animating a counter, a confirmation screen with motion that celebrates success.
- Micro-interactions should confirm the action happened, communicate what changed, and set expectation for what's next.
- Keep them fast: 200–400ms. Anything slower draws attention to the mechanic instead of the content.
- Use micro-interactions for: save/like/bookmark confirmation, form field validation feedback, loading progress, success/error state transitions.

### The AI Era Differentiator
As AI accelerates app development and lowers the cost of functional software, **memorable, emotion-driven experiences** become the primary differentiator a designer can offer.

- Functional code can be generated. Judgment about when and how to add delight, when to reduce friction, and how to create a coherent experience arc — that cannot be generated.
- Designers who master experience design — not just screen design — dramatically increase their irreplaceable value.

---

## Applying This Skill

When a user presents a design problem:
1. **Start with intent** — use the User Intent Framework (§14) to identify the primary task before evaluating aesthetics.
2. **Diagnose holistically** — identify the root issue across all domains, not just the stated one. A "boring" design is usually a hierarchy or color problem; a "cluttered" one is usually spacing or nav.
3. **Cross-reference the mistakes taxonomy** (§15) — run the design against all six categories (layout, typography, navigation, visual, responsive, interaction) before writing feedback.
4. **Prioritize ruthlessly** — give the 2–3 highest-impact changes, not a laundry list. Follow the Design Critique Protocol (§9).
5. **Be specific and actionable** — "increase line-height to 150% and tighten letter-spacing on the H1 to -0.03em" beats "improve typography".
6. **Use the section patterns** (§8) — match the problem to its section type (hero, footer, nav, pricing, etc.) before applying general principles.
7. **For prompts** — always use the 10-part prompt anatomy (§10). Exact values, structured headers, a feel line, and a constraints block.
8. **Think beyond screens** (§17) — if reviewing a flow or app, evaluate the experience arc, transitions, and micro-interactions, not just individual screens.
9. **Apply the seniority lens** (§16) — for design career or process questions, ground advice in the junior→senior framework: systems thinking, business impact, file precision, and designing for reality.
10. **Suggest iteration** — great design is never first-draft. Recommend at least 2–3 variants of the key element.