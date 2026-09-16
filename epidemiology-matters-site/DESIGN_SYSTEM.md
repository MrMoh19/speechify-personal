# EpiMatters — Design System v2

Anchored to the *Epidemiology Matters* (Keyes & Galea, OUP) book cover.
This is not a vibe document. Every value is sampled, every choice is justified.

---

## 1. Palette

Sampled directly from the cover JPEG.

| Token              | Hex       | Source / use                                                  |
| ------------------ | --------- | ------------------------------------------------------------- |
| `--paper`          | `#ffffff` | Pure white. Body background. Never tinted.                    |
| `--paper-sunk`     | `#fafbfc` | Subtle card / section recess. Use sparingly.                  |
| `--ink`            | `#0a0a0a` | Headings, primary type.                                       |
| `--ink-2`          | `#2a2a2a` | Body copy.                                                    |
| `--ink-mute`       | `#5b6066` | Captions, eyebrows, meta.                                     |
| `--rule`           | `#e5e8ed` | Hairlines, dividers. Same as figure-fill so rules and figures share a single tone. |
| `--pop-grey`       | `#d9e0e6` | Stick-figure outline grey from cover.                         |
| `--pop-grey-deep`  | `#b8c2cc` | Hover / emphasis grey.                                        |
| `--signal`         | `#cb493c` | The one red figure. Used **rarely** — only for the focal idea on a page. |
| `--signal-deep`    | `#a8362a` | Active / pressed state for signal.                            |
| `--signal-tint`    | `#fbe9e6` | Background tint for callouts using signal. ~6% opacity equivalent. |

**Color rules (do not break):**
1. Red appears on at most **one element per viewport**. If two reds would be visible at once, demote one to ink.
2. Never tint paper with cream or warm hues. The cover is cold white; the site is cold white.
3. Grey is cool (blue cast). Do not warm it. No #cccccc / #dddddd defaults.
4. Black is true black `#000000` for the page-level page title only; everything else is `--ink` (`#0a0a0a`) to reduce harshness on long-form reading.
5. No teal, rust, green, amber, cyan. Those colors belonged to the previous identity and are gone.

---

## 2. Typography

The book cover uses condensed, all-caps Franklin Gothic / Helvetica Neue Condensed Bold for title, regular condensed sans for subtitle, no italics.

**Site adapts** (book as foundation, expand from there):

| Role         | Family                          | Why                                                                 |
| ------------ | ------------------------------- | ------------------------------------------------------------------- |
| Display      | **Oswald** (weight 500/600/700) | Open-source condensed sans, very close to the cover's Franklin Gothic Condensed. All-caps display. |
| Subhead      | **Inter Tight** (weight 500)    | Slightly condensed, modern grotesque. For non-shouty section heads. |
| Body         | **Source Serif 4** (weight 400) | Already in use. Reads as a textbook companion. Calm, academic.      |
| UI / Mono    | **JetBrains Mono** (weight 400/500) | Eyebrows, DAG labels, code, data values.                        |
| Italic       | **Source Serif 4 Italic**       | Used **only** for the wordmark accent ("*Matters*") and inline emphasis in body prose. Not for headings. |

**Type scale (rem, base 16px):**

```
--text-xs    : 0.75rem  / 12px   -- eyebrows, meta, caption mono
--text-sm    : 0.875rem / 14px   -- body small, secondary
--text-base  : 1rem     / 16px   -- body
--text-md    : 1.125rem / 18px   -- lead paragraphs
--text-lg    : 1.375rem / 22px   -- section intro
--text-xl    : 1.875rem / 30px   -- subheads
--text-2xl   : 2.5rem   / 40px   -- page heads (sans condensed)
--text-3xl   : 3.5rem   / 56px   -- feature heads
--text-hero  : 5.5rem   / 88px   -- home hero only
```

**Rules:**
- Display headers (Oswald) are **always uppercase** with `letter-spacing: 0.02em` on hero, `0.04em` on smaller.
- Body paragraphs cap at **64ch** (~10–11 words per line). No exceptions for prose.
- Line-height 1.55 for body, 1.05 for display, 1.25 for subheads.
- Mono eyebrows: `letter-spacing: 0.18em`, uppercase.

**Loaded via Google Fonts** (`display=swap`):
`Oswald:wght@500;600;700`, `Inter+Tight:wght@500;600`, `Source+Serif+4:ital,wght@0,400;0,600;1,400`, `JetBrains+Mono:wght@400;500`.

---

## 3. Spacing & layout

8-pixel base grid. All spacing is a multiple of 8.

| Token         | px  | Use                                          |
| ------------- | --- | -------------------------------------------- |
| `--space-1`   | 4   | tight inline gaps                            |
| `--space-2`   | 8   | inline gaps                                  |
| `--space-3`   | 16  | small block separation                       |
| `--space-4`   | 24  | paragraph spacing                            |
| `--space-5`   | 32  | between cards                                |
| `--space-6`   | 48  | between minor sections                       |
| `--space-7`   | 80  | between major sections                       |
| `--space-8`   | 128 | hero padding, page top/bottom                |

**Container widths:**
- `--measure-prose`: 64ch (~640px) — body prose
- `--measure-narrow`: 720px — single-column page content
- `--measure-wide`: 1120px — multi-column / hero
- `--measure-bleed`: 1440px — full-width sections (lattice backgrounds, dividers)

**Grid:**
- 12-column at ≥1024px, 8-column at 640–1023px, 4-column below
- Column gutter: 24px desktop, 16px mobile
- Outer margin: 48px desktop, 24px tablet, 16px mobile

---

## 4. The Stick-Figure System

The figure is the brand. It must be a single SVG component used everywhere, never an inline duplicate.

### 4.1 The figure SVG (canonical)

A single stick figure derived from the book cover proportions:

- Head: circle, r=8, centered at (24, 12)
- Neck: line down to (24, 22)
- Torso: filled chamfered rectangle from (16, 22) to (32, 50) — slight shoulder taper
- Arms: from (16, 24) angling out to (8, 42), and (32, 24) to (40, 42)
- Legs: from (20, 50) to (16, 78), and (28, 50) to (32, 78)

Single-path SVG, fillable via `currentColor` or explicit `fill`. 48×88 viewbox.

### 4.2 The lattice generator

A pure-JS module (`scripts/lattice.js`) that:

1. Takes a container and config: `{ rows, cols, tilt, gap, signalCell }`
2. Lays figures on a tilted lattice (default tilt = 15°)
3. Fills all with `--pop-grey`, except the cell at `signalCell` index which is `--signal`
4. Returns the SVG element

Used by:
- Home hero (large lattice, signal at off-center position)
- Section dividers (single row, signal varies by section)
- Episode cards (3×3 mini-lattice, signal marks "this one")
- Inline illustrations (pedagogical contexts — "100 people, 10 exposed")

### 4.3 Where figures appear (and where they don't)

**Yes:**
- Hero backgrounds (faint, ~20% opacity, behind text)
- Section dividers
- Episode cards (3×3 mini)
- Pedagogical illustrations in articles ("imagine these 100 people…")
- 404 page (lone red figure)
- Footer signature mark (small, single figure)

**No:**
- Inside DAG diagrams (DAGs use abstract circles)
- Inside the holographic mock (separate visual language)
- As bullet icons or decorative inline glyphs
- Animated gratuitously — they move only when motion serves comprehension

---

## 5. Motion

Restrained. The book cover is static; the site is static-feeling with purposeful motion.

| Use                          | Motion                                              |
| ---------------------------- | --------------------------------------------------- |
| Hero lattice on load         | Figures fade in row-by-row over 600ms, signal last  |
| Scroll past sections         | None. No fade-in-on-scroll for body content.        |
| Episode card hover           | Translate up 4px, signal figure slides one position |
| Link hover                   | Underline draw left-to-right, 200ms                 |
| Image / illustration enter   | None. Hard cut.                                     |
| DAG animations (in /journal) | Their own system, unchanged                         |

`prefers-reduced-motion: reduce` → all motion disabled, figures appear instantly.

---

## 6. Imagery

**Photography**: rare. When used, monochrome or duotone with `--pop-grey` and `--ink`. Never full-color photography of people (it competes with the figure system).

**Diagrams**: line-only, `--ink` strokes, `--signal` for the focal node. Same as DAG aesthetic.

**No stock photography. Ever.**

---

## 7. Voice & tone (copy)

- Sentences shorter than I would naturally write.
- No exclamation points.
- Body prose can be warm and pedagogical; UI copy is dry and structural.
- "Epidemiology" is the noun the brand revolves around — never abbreviate to "epi" in titles, only in informal body where it suits the reader.
- Use the word "population" where most sites would use "users" or "audience" — it's a tonal reminder of what this is.

---

## 8. Anti-patterns (the "not vibe code" guardrails)

1. Don't add a new color because a section "needs" one. Demote to grey or ink instead.
2. Don't add italic outside body emphasis and the wordmark.
3. Don't reach for a card with rounded corners and a shadow. Use a hairline rule.
4. Don't put text on a tilted axis. The lattice tilts; type stays orthogonal.
5. Don't use the signal red on a link. Underline + ink is the link style.
6. Don't add gradients. Period.
7. Don't add icons next to nav items.
8. Don't increase the type scale to "fill space." If a heading looks small, add white space, don't enlarge.
9. Don't animate to grab attention. Animate only to clarify a relationship.
10. Don't introduce a new font for a special case. Five families is the cap.

---

## 9. Component inventory (built in this pass)

- `<nav class="topnav">` — sparse top nav, wordmark left, links right
- `<header class="hero">` — h1 + sub + lattice background
- `<section class="divider">` — single row of figures, configurable signal index
- `<article class="ep-card">` — episode card with mini-lattice
- `<aside class="callout">` — boxed signal-tinted block for key points
- `<footer class="sitefoot">` — small, three-column, single figure mark
- `<svg class="figure">` — the canonical stick figure
- `lattice(container, opts)` — JS function to mint a lattice

That's the v2 inventory. No more components without explicit need.
