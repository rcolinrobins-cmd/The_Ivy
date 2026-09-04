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

Brand title + tagline, white background, sits above the main content, with a CTA button pinned to the far right that opens the "Join our Journey" modal.

```html
<header class="site-header site-header--compact">
  <a class="site-header__cta site-header__cta--spacer" aria-hidden="true" tabindex="-1">
    Join our journey
    <svg class="site-header__cta-icon" ...>...</svg>
  </a>

  <div class="site-header__brand">
    <h1 class="site-title">The Ivy</h1>
    <p class="site-subtitle">Weddings <span class="dot">&bull;</span> Events <span class="dot">&bull;</span> Retail</p>
  </div>

  <a class="site-header__cta" id="join-journey" href="#">
    Join our journey
    <svg class="site-header__cta-icon" ...>...</svg>
  </a>
</header>
```

- `.site-header--compact` is the variant used with `.landing` (small padding, `flex: 0 0 auto`, three-column grid). Plain `.site-header` (more padding, no grid/CTA) is available for a page that isn't a full-viewport layout.
- `.site-subtitle .dot` renders each `&bull;` as a small accent-colored circle instead of a plain character.
- The brand block stays truly centered regardless of the CTA button's label length: `.site-header__cta--spacer` is an invisible mirror of the real button (same markup, `visibility: hidden`), balancing the grid's left column so it always matches the real button's width in the right column. Below 800px width the header stacks (spacer hidden entirely via `display: none`; brand and CTA centered, one above the other).
- The CTA's actual open/close/focus-management logic lives in `index.html`'s inline script, not in CSS.

### Split hero

A dark, full-width section below the header with a **centered** image carousel — currently the dominant element on the page. Green shows as a symmetric margin on either side of the carousel (80% width on desktop, 92% on screens ≤800px) rather than the carousel running edge-to-edge.

```html
<div class="split-hero">
  <div class="split-hero__carousel">
    <div class="carousel carousel--full">...</div>
  </div>
</div>
```

- `.split-hero` itself is the solid dark background (`--color-dark-bg`) and centers its child horizontally.
- `.split-hero__carousel::after` adds an 18%-opacity dark tint over the images so their tone reads as one piece with the background.
- A two-column variant (dark text panel at 1/4 width beside the carousel at 3/4, instead of a single centered carousel) is still defined but not currently used — see `.split-hero__text` in `design-system.css` for the full markup/notes if a future page wants it back.

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

### Modal

A centered dialog over a dark backdrop — currently used for the "Join our Journey" form (Name, Email, and an interest dropdown left empty pending real options — see the `TODO` in `index.html`). Mobile-friendly: width-constrained with side padding at all sizes, and scrolls internally (`max-height: 90vh`) instead of overflowing on short viewports.

```html
<div class="modal-overlay" id="join-modal-overlay">
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="join-modal-title">
    <button class="modal-close" type="button" aria-label="Close">&times;</button>
    <h2 id="join-modal-title">Join our Journey</h2>
    <form class="modal-form">
      <label class="modal-field">
        <span>Name</span>
        <input type="text" required>
      </label>
      <!-- ...email, select... -->
      <button type="submit">Submit</button>
    </form>
    <p class="modal-success" hidden>Thank you!</p>
  </div>
</div>
```

- Toggle visibility with the `is-open` class on `.modal-overlay` — **not** the `hidden` attribute. `.modal-overlay` and `.modal-form` both set an explicit `display`, which (being author CSS) would otherwise permanently override the browser's default `[hidden] { display: none }`; `.modal-form[hidden] { display: none; }` restates the override so hiding the form after submit actually works. Keep this in mind when adding any new element that needs to be hide-able inside a component that already sets `display` on it.
- `index.html`'s inline script handles opening (focuses the first field, remembers what to refocus on close), closing (X button, Escape key, or clicking the dark backdrop — clicks inside the modal box don't propagate to the backdrop), and resetting the form each time it reopens.
- Submission is **not yet wired to a backend** — there's a `TODO` marking where a Google Apps Script web app POST call should go once the Sheet is set up.

## Components available but not currently used

Kept in `design-system.css` for reuse on future pages/sections:

- **`.hero`** — full-viewport photo with centered, top-weighted overlay text (the original homepage layout, before the split-hero redesign).
- **`.split-hero__text`** — the dark text panel (heading + signup form) from the split-hero's two-column variant; see the "Split hero" section above.
- **`.signup-form`** / **`.signup-success`** — the original signup form styles (as opposed to `.modal-form`, which is what's active now). Still used by `.split-hero__text`, `.cta-bar`, and `.carousel-overlay` if any of those are reintroduced.
- **`.cta-bar`** — light-background bar pairing a heading with an inline signup form; pairs with `.carousel--75vh` (fixes a carousel to 75% of the viewport, leaving the bar the rest).
- **`.carousel-overlay`** — a translucent card of text/form centered on top of a full-bleed carousel image.
- **`.content-section`** / **`.signup`** — centered heading + body copy block, with a muted-background variant for a standalone signup section.

## Adding a New Page

1. Link `design-system.css` in the `<head>`.
2. Reuse existing components rather than writing new one-off styles.
3. If a new component is needed, add it to `design-system.css` with tokens (not hardcoded values) and document it here.
