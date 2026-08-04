# The Ivy — Design System

Shared design tokens and components live in [`design-system.css`](design-system.css). Every page should link to this file so typography, color, and layout stay consistent as the site grows.

```html
<link rel="stylesheet" href="design-system.css">
```

## Typography

| Token | Value | Usage |
|---|---|---|
| `--font-heading` | `"Playfair Display", Georgia, "Times New Roman", serif` | Headings and subtitles |
| `--font-body` | System sans-serif stack | Body copy, UI text |

Playfair Display is loaded from Google Fonts with weights/styles `400`, `600`, and italic `400`. Add more weights to the `<link>` in the page `<head>` only if a new use case needs them.

## Color

| Token | Value | Usage |
|---|---|---|
| `--color-text-primary` | `#ffffff` | Headings over photography |
| `--color-text-secondary` | `rgba(255, 255, 255, 0.8)` | Subtitles / secondary text over photography |
| `--color-overlay` | `rgba(0, 0, 0, 0.35)` | Darkening overlay on hero images for text contrast |

## Text Shadow

| Token | Value | Usage |
|---|---|---|
| `--shadow-text-strong` | `0 2px 12px rgba(0, 0, 0, 0.5)` | Headings |
| `--shadow-text-soft` | `0 1px 6px rgba(0, 0, 0, 0.4)` | Subtitles / smaller text |

## Letter Spacing

| Token | Value | Usage |
|---|---|---|
| `--tracking-heading` | `0.08em` | Headings |
| `--tracking-body` | `0.02em` | Subtitles / body text |

## Spacing Scale

| Token | Value |
|---|---|
| `--space-xs` | `0.5rem` |
| `--space-sm` | `1rem` |
| `--space-md` | `1.5rem` |
| `--space-lg` | `3rem` |

## Components

### Hero

A full-viewport image with centered, top-weighted overlay text. Used for page headers / landing sections.

```html
<section class="hero" style="background-image: url('images/your-image.jpg')">
  <div class="hero-content">
    <h1>Heading<br>Line Two</h1>
    <p>Optional subtitle</p>
  </div>
</section>
```

- `.hero` sets the background image, full-viewport height (`100svh`, with a `100vh` fallback for older browsers), and a dark overlay for contrast.
- `.hero-content` centers the text block and is pushed toward the top of the viewport (`padding-top: 12vh`) so the image is visible below the text.
- `.hero h1` uses the heading font at a responsive size (`clamp(2.25rem, 9vw, 6rem)`).
- `.hero p` uses the same heading font, italicized, at a smaller responsive size (`clamp(1.05rem, 2.3vw, 1.4rem)`) so it reads as a quieter companion to the title.

Each page sets its own background image via an inline `style` or a page-specific `<style>` block targeting `.hero`, keeping `design-system.css` free of page-specific content.

## Adding a New Page

1. Link `design-system.css` in the `<head>`.
2. Reuse existing components (e.g. `.hero`) rather than writing new one-off styles.
3. If a new component is needed, add it to `design-system.css` with tokens (not hardcoded values) and document it here.
