# EnergyBot Exit-Intent Popup

A single-file, no-build-step exit-intent popup. Drop the script tag onto any
Webflow page and it detects the visitor moving toward the browser chrome
(tabs/address bar) and shows a popup with one or more CTAs.

Which CTA(s) show, and the headline/subhead copy, are controlled entirely by
`data-*` attributes on the `<script>` tag — **no code edits needed** to set up
a new page. Just copy one of the snippets below into Webflow's page settings
→ Custom Code → *before* `</body>`.

## Base install

```html
<script src="https://cdn.jsdelivr.net/gh/thadwarren-eb/eb-exit-popup/exit-intent-popup.js" defer></script>
```

With no `data-variant` attribute, this shows all 3 tools (the original
behavior) — good for general pages that don't have a more specific angle.

## Variants

| `data-variant` value | Shows | Best for |
|---|---|---|
| *(omitted)* | Rate Tracker, Is Now a Good Time to Switch?, Compare My Bill | General pages, homepage |
| `xray` | Energy X-Ray only | X-Ray-focused landing pages / blog posts |
| `switch` | "Is Now a Good Time to Switch?" only | Rate/pricing content |
| `usage` | "Pull My Usage" only | Usage/billing-focused content |
| `custom` | One-off CTA you define inline | Anything else — promos, campaigns, one-time landing pages |

Single-CTA variants (`xray`, `switch`, `usage`, `custom`) also show a small
EnergyBot mascot celebration animation under the CTA card. The 3-CTA default
does not, to keep that layout uncluttered.

### Energy X-Ray only

```html
<script src="https://cdn.jsdelivr.net/gh/thadwarren-eb/eb-exit-popup/exit-intent-popup.js" defer
  data-variant="xray"></script>
```

### Should I Switch only

```html
<script src="https://cdn.jsdelivr.net/gh/thadwarren-eb/eb-exit-popup/exit-intent-popup.js" defer
  data-variant="switch"></script>
```

### Pull My Usage only

```html
<script src="https://cdn.jsdelivr.net/gh/thadwarren-eb/eb-exit-popup/exit-intent-popup.js" defer
  data-variant="usage"></script>
```

### Custom / one-off CTA

For a page that needs its own link — a promo, a campaign, anything not
covered by the presets above — use `data-variant="custom"` with:

- `data-cta-name` — the button/card label (required, defaults to "Learn More")
- `data-cta-href` — the destination URL (required, defaults to "#")

```html
<script src="https://cdn.jsdelivr.net/gh/thadwarren-eb/eb-exit-popup/exit-intent-popup.js" defer
  data-variant="custom"
  data-cta-name="Check Our Fall Promo"
  data-cta-href="https://www.energybot.com/promo/fall"></script>
```

### Overriding headline/subhead (any variant)

Every variant — including the default — can have its headline and subhead
swapped per page with `data-headline` / `data-subhead`, without touching the
JS file:

```html
<script src="https://cdn.jsdelivr.net/gh/thadwarren-eb/eb-exit-popup/exit-intent-popup.js" defer
  data-variant="xray"
  data-headline="Still deciding?"
  data-subhead="See exactly where your money's going — 30 seconds, free."></script>
```

If omitted, each variant falls back to its own default copy (see
`VARIANTS` in `exit-intent-popup.js`).

## How it behaves

- **Arms 3 seconds after page load**, then fires the first time the cursor
  leaves the page from the top (toward the tabs/address bar).
- **Suppressed for 7 days** after being shown or dismissed, via the
  `eb_exit_popup_seen` cookie — shared across all variants and pages, so one
  visitor won't get shown a different popup right after dismissing another.
- **`debug: true`** by default — open the console and look for `[eb-exit]`
  log lines to see when it arms, fires, or gets suppressed. Set to `false` in
  `exit-intent-popup.js` before a final production push if you want it quiet.

## Re-testing on the same page

The suppression cookie will block repeat pop-ups. To force it to show again:
DevTools → Application → Cookies → delete `eb_exit_popup_seen` → reload.

## Files in this repo

- `exit-intent-popup.js` — the whole thing. Edit `VARIANTS`/`ICONS` here to
  add a new named preset or change styling.
- `mascot-celebration.json` — Lottie animation for the single-CTA variants.
  Fetched automatically from wherever `exit-intent-popup.js` itself is
  loaded from, so it doesn't need its own URL configured anywhere.

## Local testing

Open `demo.html` in a browser — it dynamically injects the script and
supports `?variant=xray`, `?variant=switch`, `?variant=usage`, or
`?variant=custom` in the URL (note: some browsers restrict `fetch()` and
query strings on `file://` pages — testing via a local dev server avoids
that).
