# The Ivy — Design System

Shared design tokens and components live in [`design-system.css`](design-system.css). Every page should link to this file so typography, color, and layout stay consistent as the site grows.

```html
<link rel="stylesheet" href="design-system.css">
```

## Typography

| Token | Value | Usage |
|---|---|---|
| `--font-heading` | `"Playfair Display", Georgia, "Times New Roman", serif` | Headings, subtitles, brand name |
| `--font-body` | System sans-serif stack | Body copy, form inputs/buttons |
| `--font-size-page-title` | `clamp(1.75rem, 4vw, 2.75rem)` | Top-level page/brand title (e.g. site header) |
| `--font-size-section-heading` | `clamp(1.5rem, 3vw, 2.25rem)` | h2/h3-level section headings |

Playfair Display is loaded from Google Fonts with weights/styles `400`, `600`, and italic `400`. Add more weights to the `<link>` in the page `<head>` only if a new use case needs them.

## Color

**Light-background pages / panels**

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#ffffff` | Page background |
| `--color-bg-muted` | `#faf9f7` | Muted section background |
| `--color-text-dark` | `#1c1c1c` | Body text, headings on light backgrounds |
| `--color-text-muted` | `#666666` | Secondary/body copy |
| `--color-border` | `#e2e2e2` | Input borders, dots |
| `--color-accent` | `#b08d57` | Buttons, links, focus states (warm gold) |
| `--color-accent-hover` | `#c7a06a` | Hover state for accent buttons on dark backgrounds |

**Dark panels** (e.g. `.split-hero__text`)

| Token | Value | Usage |
|---|---|---|
| `--color-dark-bg` | `#202b22` | Dark panel background (deep ivy green) |
| `--color-on-dark` | `#f5f2ea` | Text on dark backgrounds |
| `--color-on-dark-muted` | `rgba(245, 242, 234, 0.75)` | Secondary text on dark backgrounds |

**Over photography**

| Token | Value | Usage |
|---|---|---|
| `--color-text-primary` | `#ffffff` | Headings over a photo |
| `--color-text-secondary` | `rgba(255, 255, 255, 0.8)` | Subtitles over a photo |
| `--color-overlay` | `rgba(0, 0, 0, 0.35)` | Darkening overlay for text contrast |
| `--shadow-text-strong` / `--shadow-text-soft` | see file | Text shadow over photography |

## Letter Spacing & Spacing Scale

| Token | Value |
|---|---|
| `--tracking-heading` | `0.08em` |
| `--tracking-body` | `0.02em` |
| `--space-xs` … `--space-2xl` | `0.5rem, 1rem, 1.5rem, 3rem, 4rem, 6rem` |

## Page Layout: `.landing`

The homepage uses a full-viewport, no-scroll layout: a compact header, then one component that fills the rest of the screen.

```html
<body class="landing">
  <header class="site-header site-header--compact">...</header>
  <!-- one component with flex: 1 1 auto, e.g. .split-hero -->
</body>
```

`body.landing` is `height: 100svh` (with a `100vh` fallback) and `display: flex; flex-direction: column; overflow: hidden`. Anything meant to fill the remaining space below the header should use `flex: 1 1 auto; min-height: 0;`.

## Components in use on `index.html`

### Site header

Brand title + tagline, white background, sits above the main content.

```html
<header class="site-header site-header--compact">
  <h1 class="site-title">The Ivy</h1>
  <p class="site-subtitle">Weddings <span class="dot">&bull;</span> Events <span class="dot">&bull;</span> Retail</p>
</header>
```

- `.site-header--compact` is the variant used with `.landing` (small padding, `flex: 0 0 auto`). Plain `.site-header` (more padding) is available for a page that isn't a full-viewport layout.
- `.site-subtitle .dot` renders each `&bull;` as a small accent-colored circle instead of a plain character.

### Split hero

Two-column section: a 1/3-width dark text panel (heading + signup form) beside a 2/3-width full-bleed image carousel, sharing one dark background so both halves read as one cohesive section. Below 800px width it stacks (text on top, carousel below, 50/50 height).

```html
<div class="split-hero">
  <div class="split-hero__text">
    <div class="split-hero__text-inner">
      <h2>Heading</h2>
      <form class="signup-form" id="signup-form">
        <input type="email" required placeholder="Your email address">
        <button type="submit">Sign Up</button>
      </form>
      <p class="signup-success" hidden>Thank you!</p>
    </div>
  </div>
  <div class="split-hero__carousel">
    <div class="carousel carousel--full">...</div>
  </div>
</div>
```

- Padding lives on `.split-hero__text-inner`, not `.split-hero__text` itself — padding directly on the flex item would count against its flex-basis and throw off the 1/3-vs-2/3 split.
- `.split-hero__carousel::after` adds an 18%-opacity dark tint over the images so their tone matches the text panel's solid dark background.
- Within `.split-hero__text`, the heading, signup form (stacked: input full-width, button below it left-aligned), and success message all have dark-panel color overrides already applied — no extra classes needed.

### Carousel

Horizontal, swipeable image gallery with prev/next arrows and dots. Prev/next wrap around (last slide's "next" goes to the first, and vice versa).

```html
<div class="carousel carousel--full">
  <div class="carousel-track">
    <div class="carousel-slide"><img src="..." alt="..."></div>
    ...
  </div>
  <button class="carousel-arrow carousel-arrow--prev" aria-label="Previous slide">&#8249;</button>
  <button class="carousel-arrow carousel-arrow--next" aria-label="Next slide">&#8250;</button>
  <div class="carousel-dots"></div>
</div>
```

Dots are populated by the inline script in `index.html` (`goToSlide()` handles the wraparound and keeps dots/arrows/swipe in sync). `.carousel--full` is the edge-to-edge variant that fills its container's height, with dots overlaid on the image; the bare `.carousel` (max-width 1100px, dots below the image) is available for a non-full-bleed use.

### Signup form

Base styles (`.signup-form`, `.signup-form input[type="email"]`, `.signup-form button`, `.signup-success`) are shared by every context; `.split-hero__text`, `.cta-bar`, and `.carousel-overlay` each layer on their own layout/color overrides (see file for specifics). The form is **not yet wired to a backend** — `index.html` has a `TODO` marking where a Google Apps Script web app POST call should go once the Sheet is set up.

## Components available but not currently used

Kept in `design-system.css` for reuse on future pages/sections:

- **`.hero`** — full-viewport photo with centered, top-weighted overlay text (the original homepage layout, before the split-hero redesign).
- **`.cta-bar`** — light-background bar pairing a heading with an inline signup form; pairs with `.carousel--75vh` (fixes a carousel to 75% of the viewport, leaving the bar the rest).
- **`.carousel-overlay`** — a translucent card of text/form centered on top of a full-bleed carousel image.
- **`.content-section`** / **`.signup`** — centered heading + body copy block, with a muted-background variant for a standalone signup section.

## Adding a New Page

1. Link `design-system.css` in the `<head>`.
2. Reuse existing components rather than writing new one-off styles.
3. If a new component is needed, add it to `design-system.css` with tokens (not hardcoded values) and document it here.
