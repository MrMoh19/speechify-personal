# Epidemiology Matters — Website

A bolder, more interactive rebuild of the companion site for the textbook
*Epidemiology Matters* (Keyes, Abba-Aji & Galea — Oxford University Press, 2028).

## What's in here

```
.
├── index.html             ← Homepage (hero, tools, seven steps, lab, authors, signup)
├── instructors.html       ← Adoption resources, syllabus alignment, LMS embeds
├── privacy.html           ← Privacy policy
├── terms.html             ← Terms of use
├── 404.html               ← Friendly 404
├── styles/main.css        ← All styles
├── scripts/main.js        ← All interactive behavior
├── assets/favicon.svg     ← Favicon
├── netlify.toml           ← Netlify config (caching, headers, redirects)
├── robots.txt
└── sitemap.xml
```

No build step. Pure HTML/CSS/JS. Drop the folder into Netlify and it works.

## Deploying to Netlify

### Option A — Drag & drop (fastest)

1. Go to https://app.netlify.com/drop
2. Drag the entire `epimatters/` folder onto the page
3. Netlify gives you a URL like `random-name-12345.netlify.app`
4. In **Site configuration → Domain management**, add `epidemiologymatters.com`
   as a custom domain and follow Netlify's DNS instructions
5. Done. Re-deploy by drag-and-dropping again, or connect a Git repo.

### Option B — Git-based (recommended long term)

1. Put this folder in a Git repo (GitHub, GitLab, or Bitbucket)
2. In Netlify: **Add new site → Import an existing project**
3. Connect the repo. Build command: leave blank. Publish directory: `.`
4. Every push to `main` auto-deploys.

### Option C — Netlify CLI

```bash
npm install -g netlify-cli
cd epimatters
netlify deploy --prod
```

## Forms

The newsletter and waitlist forms use **Netlify Forms** — no third-party
service needed. Netlify auto-detects the `data-netlify="true"` attribute
when the site deploys. You'll see submissions in your Netlify dashboard
under **Forms**. Free tier includes 100 submissions/month.

To get email notifications when someone subscribes:
**Site → Forms → [form name] → Settings → Form notifications → Add
notification → Email notification**.

To export your list, click any form and use **Download as CSV**.

## Customizing

### Buy button → real OUP product page
Open `index.html` and `instructors.html`, search for `https://global.oup.com/`,
and replace with the OUP product URL once the second edition is listed.

### Change the palette
Edit the `:root` block at the top of `styles/main.css`:

```css
--rust: #c2410c;       /* primary accent */
--bg: #fbf6ee;         /* page background */
--ink: #1a1410;        /* primary text */
```

### Add a new tool to the homepage grid
In `index.html`, find the `.tools` block and copy a `.tool-card` element.

### Add a real Mohammed profile link
In `index.html` find `<a href="#" target="_blank"` in the authors section
and replace `#` with your faculty URL.

## Accessibility

- Skip-to-main link
- Single H1 per page
- Visible focus states on all interactive elements
- `prefers-reduced-motion` respected — animations disabled
- All form inputs labeled
- Color contrast meets WCAG 2.1 AA
- Mobile menu, keyboard-accessible

## Browser support

Tested on the last 2 versions of Chrome, Safari, Firefox, Edge. Graceful
degradation on older browsers (no `backdrop-filter` → solid nav background).

## License

All rights reserved © 2026 Keyes, Abba-Aji & Galea.
