---
name: Concourse
description: A transit wayfinding sign system for Olric Zeng's portfolio — signal-yellow enamel fields, black steel rails, and a live split-flap departures board.
colors:
  signal: "#ffd100"
  signal-deep: "#e0b400"
  signal-ink-soft: "#6b5400"
  enamel: "#0a2a66"
  enamel-lit: "#123c8c"
  enamel-ink-soft: "#9fb4de"
  steel: "#141414"
  steel-soft: "#2a2a2a"
  board: "#0d0d0d"
  board-lit: "#1a1a1a"
  sign-white: "#f4f3ef"
  chalk: "#e6e4dd"
  sign-ink: "#1b1b1b"
  sign-ink-soft: "#55534d"
  board-ink: "#f4f3ef"
  board-ink-soft: "#a3a099"
  disabled-text: "#6e6b64"
  red: "#a81a14"
  red-lamp: "#ff4b3e"
  green: "#005c38"
  green-lamp: "#2ed47a"
  rule: "#d5d2ca"
  rule-strong: "#bdb9b0"
  rule-dark: "#2a2a2a"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3.4rem, 8.6vw, 9.6rem)"
    fontWeight: 800
    lineHeight: 0.84
    letterSpacing: "-0.035em"
    fontVariation: "wdth 112"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3rem, 6vw, 5rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.03em"
    fontVariation: "wdth 112"
  subhead:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontVariation: "wdth 104"
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.32rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.012em"
    fontVariation: "wdth 96"
  lede:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.14rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
    fontVariation: "wdth 100"
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "normal"
    fontVariation: "wdth 100"
  copy:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
    fontVariation: "wdth 100"
  meta:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.06em"
    fontFeature: "tnum 1"
    fontVariation: "wdth 88"
  control:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.18em"
    fontVariation: "wdth 88"
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.66rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.18em"
    fontVariation: "wdth 88"
  micro:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.58rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.2em"
    fontVariation: "wdth 88"
  board:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.04em"
    fontFeature: "tnum 1"
    fontVariation: "wdth 88"
rounded:
  none: "0px"
  station: "50%"
spacing:
  hairline: "4px"
  xs: "6px"
  sm: "12px"
  md: "20px"
  lg: "28px"
  xl: "48px"
  section-y: "128px"
  section-y-mobile: "72px"
components:
  button-gate:
    backgroundColor: "{colors.steel}"
    textColor: "{colors.signal}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "48px"
  button-gate-hover:
    backgroundColor: "{colors.sign-white}"
    textColor: "{colors.steel}"
  button-signal:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.steel}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 26px"
    height: "50px"
  button-signal-hover:
    backgroundColor: "{colors.sign-white}"
    textColor: "{colors.steel}"
  button-signal-disabled:
    backgroundColor: "{colors.signal-deep}"
    textColor: "{colors.steel}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.signal}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.steel}"
  plate-discipline:
    backgroundColor: "{colors.steel}"
    textColor: "{colors.signal}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "7px 13px"
  chip-stack:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.steel}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "5px 10px"
  chip-stack-lit:
    backgroundColor: "{colors.steel}"
    textColor: "{colors.signal}"
  input-field:
    backgroundColor: "{colors.sign-white}"
    textColor: "{colors.sign-ink}"
    rounded: "{rounded.none}"
    padding: "13px 16px"
    height: "50px"
  nav-link:
    backgroundColor: "{colors.steel}"
    textColor: "{colors.board-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "60px"
  nav-link-active:
    textColor: "{colors.signal}"
  board-row:
    backgroundColor: "{colors.board}"
    textColor: "{colors.board-ink}"
    typography: "{typography.board}"
    rounded: "{rounded.none}"
    padding: "0 28px"
    height: "56px"
  board-row-hover:
    backgroundColor: "{colors.board-lit}"
  platform-panel-lit:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.steel}"
    rounded: "{rounded.none}"
    padding: "32px 28px 34px"
---

# Design System: Concourse

<!-- Scope: the whole site. The home page (`src/app/page.tsx`), the interest
     corridor (`src/components/MindMap.tsx` and `src/components/mindmap/`)
     and the MindDo case study (`src/app/projects/minddo/` and
     `src/components/minddo/`) are all inside this system and all read
     `src/design/tokens.ts`. The case study carries one documented exemption —
     see "The schematic exemption" under Colors — and one scoped second face,
     recorded under Typography. `src/app/globals.css` mirrors only the handful
     of values CSS itself needs. -->

## Overview

**Creative North Star: "The Concourse"**

This is a wayfinding sign system, not a page decorated to look like one. The premise is that a stranger with twenty seconds and eight tabs open is a traveler in a terminal: they need to be oriented at a glance, told which direction is forward, and handed a legible board they can read in one pass. Every device on the page is drawn from European airport and rail signage — signal-yellow enamel fields, deep enamel-blue service plates, black steel rails, matte split-flap cells, a route diagram with station markers, hatched platform-edge marking. It explicitly refuses the developer-portfolio arrangement of a dark hero, a one-line role, and a grid of project cards.

The system's load-bearing law is that **colour is category, not emphasis**. A colour appearing on this page is always making a claim about what a thing is. Red means an award and nothing else; green means deployed-and-running and nothing else; signal yellow is the path forward; enamel blue is information and services; steel is structure. Nothing is ever tinted for mood. This is enforced hard enough that third-party employer logos were removed from the route diagram rather than tinted — several arrive in their own brands' red and green, and drawing them would have spent two reserved colours on rows making no such claim.

The material register is flat, painted, and physical. There are no elevation shadows anywhere in the system. Depth comes from committed grounds meeting on steel seams, the way two enamel fields are physically bolted together on a real sign. Density is high on the board and generous in the reading sections: the page has two reading speeds and serves both by changing ground rather than by changing typeface.

**Key Characteristics:**

- Colour is category by law; five roles, no decorative tint
- One typeface (Archivo Variable) exercised across width and weight, never a second family
- Four committed grounds in sequence down the page, closed by a steel rail
- Zero radius everywhere except the route diagram's station markers
- Flat by construction — no elevation shadows, depth by ground change and steel seam
- Solid pictograms on a 24×24 grid, never stroked, never a Unicode glyph
- Tabular figures globally; a column of years or times stays in column

## Colors

An enamel sign palette: two saturated fields (signal and enamel), two structural blacks, two painted whites, and two reserved status lamps that each ship in a light-ground and a board-ground value.

### Primary

- **Signal Yellow** (`{colors.signal}`): The path forward. The hero's full-bleed field, the OZ plate on the rail, primary actions, board column heads, the active nav bar, the section accent rule, the keyboard focus ring on dark and coloured grounds, and the signature's stroke. Everything black on it clears 12:1.
- **Signal Deep** (`{colors.signal-deep}`): The pressed/sending state of a signal-filled control, and the caret colour in form fields.
- **Signal Ink Soft** (`{colors.signal-ink-soft}`): Secondary text *on* the yellow field — tinted from the field's own hue rather than greyed, so the field stays one material.

### Secondary

- **Enamel Blue** (`{colors.enamel}`): Information and services. The contact section's ground, the route-line diagram, the Background section's accent rule, section sub-headings inside the project sheet, and organisation links.
- **Enamel Lit** (`{colors.enamel-lit}`): A raised or hovered enamel element.
- **Enamel Ink Soft** (`{colors.enamel-ink-soft}`): Secondary text and hairline dividers on the enamel ground.

### Tertiary — Status lamps, reserved by law

- **Award Red** (`{colors.red}` on light grounds / `{colors.red-lamp}` on the board): An award, and nothing else. The light value is set by the hardest ground it has to survive — a platform panel under the pointer takes the signal field, and the lamp on it is 10px bold text with no 1.4.3 exemption.
- **Live Green** (`{colors.green}` on light grounds / `{colors.green-lamp}` on the board): Deployed and running, and nothing else. Also carries the "Open to internships" availability lamp in Contact, which is the same claim about a different thing.

### Neutral

- **Steel** (`{colors.steel}`): Structure. Rails, frames, sign edges, plate fills, the seam between two fields, and type on any light ground. Also the focus ring on the yellow field, where a yellow ring would vanish into its own ground.
- **Steel Soft** (`{colors.steel-soft}`): A rail's inner division and the seam across a flap cell.
- **Board Black** (`{colors.board}`) / **Board Lit** (`{colors.board-lit}`): The departures board's ground, deeper than the rails so the board reads as recessed; Board Lit is a row under the pointer before it takes the signal field.
- **Sign White** (`{colors.sign-white}`) / **Chalk** (`{colors.chalk}`): The light grounds. Sign White is deliberately not pure white — a painted panel never is, and the eye reads the difference as material. Chalk is one step down, for plates laid on Sign White.
- **Inks**: `{colors.sign-ink}` / `{colors.sign-ink-soft}` on light grounds; `{colors.board-ink}` / `{colors.board-ink-soft}` on the board; `{colors.disabled-text}` for a switched-off control.
- **Rules**: `{colors.rule}` hairline on light, `{colors.rule-strong}` where a hairline must survive a plate's own fill, `{colors.rule-dark}` between two flap rows.

### Named Rules

**The Reserved Lamp Rule.** Red is an award. Green is deployed-and-live. Nothing on this page is ever tinted red or green for emphasis, severity, delight, or brand fidelity. If neither claim is true, the thing takes an ink, not a lamp.

**The Two Values Per Lamp Rule.** Every reserved colour ships in two values — one measured against the light grounds, one against the board — carrying one meaning. A lamp that only clears contrast on one ground is a lamp that fails somewhere on the page.

**The Schematic Exemption (case study only).** Seven diagrams on
`/projects/minddo` turn on a blocked-versus-allowed distinction, and red and
green are the only honest colours for it. On that surface, and nowhere else,
the two reserved lamps carry a second reading: **red is a request that is
refused, green is a request that is admitted.** The readings never collide,
because no award appears anywhere on that page and "deployed and running"
appears exactly once, in the hero's status row, where it keeps its original
meaning. The other three schematic tones are drawn out of the palette rather
than invented — compute is signal, storage is enamel, anything outside the
system is steel — and every figure that uses them ships a legend naming which
is which. The values live in `T` in `src/components/minddo/ui.tsx`.

**The Foreign Mark Rule.** Third-party marks are not *drawn* in this system,
but they are no longer refused by it. An employer's logo arrives in its own
brand's colours — among the four on the timeline, a red seal and a green bubble
— and stripping it to one ink turns it to a smudge at 20px. So a mark is
**quarantined instead of recoloured**: it sits at full colour on a sign-white
plate inside a 2px steel frame, the way a licensed operator's roundel is
mounted onto a station sign rather than painted into it. The frame is what
declares that nothing inside it is speaking this palette, which is how a red
seal can sit two hundred pixels from a reserved award lamp without either one
lying. Outside a frame, the rule stands: name the organisation and link it.

**The Committed Ground Rule.** The page runs four grounds in sequence — signal yellow (hero), sign white (Background), board black (Projects), enamel blue (Contact) — and closes on a steel rail. A section commits to one ground fully. There is no third neutral surface layered on top to soften a transition.

## Typography

**Sign Font:** Archivo Variable (with Helvetica Neue, Arial fallbacks), loaded with both the `wght` and `wdth` axes via `next/font`, exposed as `--font-sign`.

There is no second family. A real wayfinding programme is built from one face read at many widths and weights, and all of this system's drama comes from scale and from the width axis. The condensed cut (`wdth` 80–88%) carries labels, column heads, and board data; the expanded black cut (`wdth` 104–112%) carries panel lettering and platform numbers; the normal width carries body copy.

**Character:** Institutional and load-bearing. Tight, negative-tracked display caps that read as painted signage; wide-tracked uppercase micro-labels that read as engraved plates; a plain, unfussy body voice between them.

### The ramp

Every non-display size on this page comes from one closed set, exported as
`TYPE` in `src/design/tokens.ts`. There are no literal font sizes left in the
home page's components. A sign programme sets its lettering at a fixed set of
heights because the height is what encodes rank: a visitor reads *this is a
column head, that is a destination* before they read a word. Steps sit about
1.12 apart — tight enough that neighbouring ranks stay distinguishable, loose
enough that nothing ever needs a half-step.

| Step | Size | Carries |
|---|---|---|
| `TYPE.MICRO` | 0.58rem | Board column heads, the smallest plate lettering |
| `TYPE.LABEL` | 0.66rem | Chips, status lamps, plate labels — the workhorse caps size |
| `TYPE.CONTROL` | 0.74rem | Anything you click: nav links, buttons, gates, social rows |
| `TYPE.META` | 0.82rem | Years, counts, secondary rows, the rail clock |
| `TYPE.COPY` | 0.90rem | Supporting copy inside a panel |
| `TYPE.BODY` | 1.00rem | Default reading size, and the floor for any form field |
| `TYPE.LEDE` | 1.14rem | The opening paragraph of a section |
| `TYPE.TITLE` | 1.32rem | Station titles, stack entries, detail headings |
| `TYPE.SUBHEAD` | 1.50rem | The largest step that is not a clamped display size |

Above the ramp sit three fluid sizes, all clamped, all display-only: the hero
name at `clamp(3.4rem, 8.6vw, 9.6rem)`, section headlines at
`clamp(3rem, 6vw, 5rem)`, and — on the case study only — the in-document
section opener at `clamp(1.9rem, 3.4vw, 2.5rem)`. The third exists because
eleven section openers inside one long read cannot be set at the page-section
headline size without the document becoming a stack of billboards; it is still
followed by the same solid accent bar, at 12 × 120px rather than 12 × 180px.
The case study's hero name takes `clamp(2.6rem, 6.4vw, 5rem)`, between the two
page-level display sizes.

`TYPE.BODY` is 1rem and not a hair less, because Safari zooms into any form
field below 16px on focus and never zooms back out. That is a floor, not a
preference.

### Hierarchy

- **Display** (800, `clamp(3.4rem, 8.6vw, 9.6rem)`, `wdth` 112%, line-height 0.84, tracking −0.035em): The hero name only, set as a two-line stack of black expanded caps in Steel on the signal field.
- **Headline** (800, `clamp(3rem, 6vw, 5rem)`, `wdth` 112%, line-height 0.9, tracking −0.03em): Section titles — Background, Projects, Contact — and the project sheet's title. Always followed immediately by a 12px accent bar.
- **Title** (700, `TYPE.TITLE`, `wdth` 96%, tracking −0.012em): Station names on the route diagram, detail headings inside the project sheet, onward-travel destination names.
- **Body** (500 / 400, `TYPE.COPY` to `TYPE.LEDE`, line-height 1.55–1.7): Reading copy. Measure is capped explicitly and varies with the job: 34ch for a station note, 38–46ch for a lede, 58–62ch for an overview, 66ch for the sheet's long detail column.
- **Label** (700–800, `TYPE.MICRO` to `TYPE.CONTROL`, `wdth` 88%, tracking 0.12–0.20em, uppercase): The system's most-used role. Plates, chips, buttons, column heads, status text, nav links, footer. Tracking scales with smallness — 0.20em at `TYPE.MICRO`, 0.16em at `TYPE.CONTROL`.
- **Board data** (700, `TYPE.META` / `TYPE.BODY`, `wdth` 88%, tracking 0.04–0.06em, tabular): Years, infrastructure strings, gate numbers, the rail clock.

### Named Rules

**The One Face Rule.** Archivo, at every width and weight the variable axes
allow. A second family is never the answer to a hierarchy problem — reach for
the width axis, the weight axis, or scale.

*One exemption, scoped to what a monospace is actually for.* The case study
sets identifiers, routes, filenames and config keys — strings whose
character-by-character shape is the content — in a system monospace. It is not
allowed to carry a figure label, a metric, a heading or a section index, all of
which it used to and all of which are Archivo now. A monospace worn as a
costume for "technical" is still banned; a monospace around `task_acks_late` is
doing a job no width axis can do.

**The Tabular Rule.** `font-variant-numeric: tabular-nums` is set at the root, not per call site. On this page there is no figure that wants to be proportional: years, times, counts, and platform numbers all sit in columns.

**The Closed-Ramp Rule.** A component never invents a size. If a new role does
not fit a step, the ramp gains a step in `tokens.ts` and this table records it —
it does not gain a one-off literal in a component. The whole page drifted onto
23 distinct sizes before this rule existed, which is a continuum, not a scale.

**The Tracking-Inverse Rule.** Display type tracks negative (−0.03em and tighter); uppercase micro-labels track wide (0.12em and wider). There is no mid-scale uppercase label at normal tracking.

## Layout

The page is a vertical sequence of committed grounds, each a full-bleed section, with a fixed 60px steel rail pinned across the top. Content inside a section is centred in a max-width container: **1180px** for Background and Projects, **1080px** for Contact and the project sheet's interior.

**Section rhythm.** Desktop sections run 112–148px of vertical padding and 48px horizontal (28px inside Projects, where the panels want the extra width); mobile drops to 64–88px vertical and 18–20px horizontal. The single mobile breakpoint is driven by a `useIsMobile` hook rather than CSS media queries, because the components are inline-styled — layouts switch shape at that boundary (the route diagram stands on end, the board sheds its Infrastructure and Status columns, the portrait is replaced by a plate) rather than merely reflowing.

**Section heading pattern.** Every section opens with the Headline, then a solid accent bar — 12px tall, 180px wide on desktop and 120px on mobile — in the colour that section's ground calls for (enamel on sign white, signal on the board and on enamel). The hero uses the same device at 4px, full width, animating out from the left.

**The hero's proportion.** The first viewport is a two-row grid: the signal panel takes the remaining height, the departures board takes a fixed height derived from its own row count (56px rows, 46px on mobile, plus a 30px header and 14px of board frame). On desktop the panel splits again — the right `min(38vw, 600px)` is a sign-white column divided from the yellow field by a 3px steel seam.

**Touch and hit area.** No interactive control drops below 44px in its smallest dimension: 44px on the sheet's gate buttons, 46–48px on plate buttons, 50px on inputs and the submit, 56px on the contact link rows.

**Sideways scroll.** Regions genuinely wider than a phone carry `.scroll-region` with `tabindex="0"` so a keyboard can reach the far edge, and a focus ring that only shows for the keyboard.

## Elevation & Depth

**This system is flat by construction. There are no elevation shadows anywhere.** No card lifts, no plate floats, no hover raise via shadow. Depth is expressed three ways, all of them physical:

1. **Ground change.** The board is a darker black than the rails so it reads as recessed into the wall.
2. **Steel seams and frames.** Two fields meet on a 3px steel edge; a demo screen sits inside a 2px steel frame; the rail carries a 1px steel-soft underline. These are structural members, not borders drawn for decoration.
3. **Fill inversion on state.** A hovered platform panel takes the signal field and inverts its own ink, rather than lifting.

The only `box-shadow` values in the system are not shadows: `inset 0 -2px 0` and `inset 0 -4px 0` bars used as link underlines and the active nav marker, a `0 0 0 1.5px` steel edge on the cursor mark, and a `0 0 0 4px` sign-white knockout around the route diagram's terminus ring. There is exactly one soft glow on the page — a 22px signal drop-shadow behind the scroll-traced signature — and it belongs to that pinned moment alone.

### Named Rules

**The Flat Field Rule.** No element on this page casts a shadow. If something needs to read as forward, change its ground or invert its ink.

**The Structural Border Rule.** A border is a physical member of the sign — a seam, a rail, a frame, a hairline between two rows. Borders are never used to outline a shape for visual interest.

## Shapes

**Radius is zero everywhere.** Plates, chips, buttons, inputs, panels, the board, the sheet, the cursor mark, the status lamps: all square. Enamel signage is cut and bolted, not rounded.

**Exactly one circle exists in the whole system**: the route diagram's station marker in Background. An ordinary stop is a filled enamel disc (26px) printed on the line; the terminus is a hollow interchange ring (34px, 6px enamel wall, knocked out of sign white) — the only marker on the diagram that is not solid, and the whole legend of the drawing. Because that circle is reserved, the OZ brand mark is a square signal plate.

**The route diagram's own geometry** follows Beck's rule: horizontals, verticals, and 45° connectors, nothing else. The line runs at a single 12px weight and every rule in that section is derived from it. The 45° climb is drawn as a filled mitre polygon at a fixed pixel size rather than a stroked line, so the angle stays exactly 45° at every viewport width and the joins to the horizontal bars are cut flush.

**Pictograms** are solid silhouettes on a 24×24 grid, authored in `src/components/concourse/Pictogram.tsx`. No strokes, ever — that is what separates a wayfinding symbol from a UI icon, and it is why they survive at 8px on a rail and 96px on a panel. Cut-outs (the clock's hands, the envelope's flap, the server's drive slots) are reversed out with `even-odd`; a small set whose subpaths are meant to union rather than cut — `cap`, `graph`, `braces` — is rendered `nonzero` instead.

**One hatch exists**: the platform-edge marking between the board and the enamel service hall, a −45° repeating signal/steel stripe at 14px. It means "the ground changes here", which is exactly what it does.

### Named Rules

**The One Circle Rule.** The only circle in this system is a station on the route line. Everything else is a plate or a rail. If a new element wants to be round, it wants to be square.

**The Solid Silhouette Rule.** Pictograms are filled silhouettes on the 24×24 grid, authored as path data in `Pictogram.tsx`. Never a stroked icon, never an icon-font, never a Unicode character standing in for a drawing.

## Components

### Buttons

- **Shape:** Square (0 radius), no exceptions.
- **Gate (primary):** Steel fill, signal text, a pictogram at 13–15px leading the label, uppercase label type, 0–26px horizontal padding, 48px minimum height. On hover it flips to sign-white fill with steel text — a sign panel being lit, not a colour shift.
- **Signal (form submit / rail brand):** Signal fill, steel text, 50px. Hover goes to sign white; the sending state holds Signal Deep and drops the pointer.
- **Outline (sheet gates, mobile mind-map):** Transparent fill, 2px signal or steel border, signal text, 44–46px. Hover fills with the border colour and inverts the text. Disabled takes a steel-soft border and `{colors.disabled-text}`.
- **Focus:** Never a custom per-button treatment — the global `:focus-visible` ring applies (3px signal, 2px offset, square), flipped to steel inside `[data-surface="signal"]`.

### Chips and Plates

- **Discipline plate:** Steel fill, signal text, pictogram + uppercase label, 7×13px padding. Reversed out of the yellow field.
- **Stack chip:** Chalk fill with steel text on light grounds; inverts to steel fill with signal text when its panel is lit.
- **Period plate** (route diagram): Chalk fill, or signal fill at the terminus, where it also takes a `pin` pictogram.
- **Status plate:** Steel fill carrying a lamp square and its one reserved word.

### Cards / Containers

There are no cards. Content sits in **panels** — full-width regions divided by hairlines, with no corner radius, no shadow, and no background of their own until state changes them. The platform panels in Projects are the canonical case: a 1px rule-dark top border, transparent ground, and on hover/focus the entire panel takes the signal field and inverts every ink inside it in one 0.22s move.

### Inputs / Fields

- **Style:** Sign-white fill with a 2px sign-white border — invisible at rest, so the field reads as a hole cut in the steel plate. 13×16px padding, 50px minimum height, square.
- **Font size is 1rem and must stay there:** Safari auto-zooms into any input below 16px on focus and never zooms back.
- **Focus:** The border turns signal. The caret is Signal Deep. Placeholders take `{colors.sign-ink-soft}` at full opacity rather than the browser's own grey.
- **Labels:** Every field carries a real `<label>`, visually hidden; placeholders are never the accessible name.
- **Error:** Red-lamp text with a `close` pictogram, plus a permanently-mounted `aria-live` region.

### Navigation

The rail is **opaque steel at every scroll position** — 60px tall, fixed, with a 1px steel-soft bottom edge. A frosted bar that materialises on scroll belongs to a world where the page is the subject; here the rail is a fixed piece of the building, and buildings do not fade in.

- **Brand:** OZ initials reversed out of a square signal plate at the head of the rail, whitening on hover.
- **Links:** Condensed uppercase labels at 0.16em tracking. Active takes signal text plus a 4px signal bar seated on the rail's own lower edge (`inset 0 -4px 0`), the way a platform sign underlines the line you are standing on.
- **Live clock:** Every board in every terminal carries the time. It sits behind a steel-soft divider with a `clock` pictogram, in signal, tabular, and holds its width while the links give ground. It renders empty on the server and fills after mount.

### Signature Components

**The departures board.** The lower band of the first viewport: a black board with silkscreened signal column heads (Platform / Destination / Service / Stops) and one 56px row per destination, 46px on mobile. Only the rows move — headers are painted, not flapped.

The board lists **routes, not contents**. A concourse board tells you where you can go and what runs on each service; it is not a preview of the contents of one of those services. The four rows are Background, Projects, Case Study and Contact — the last of which the nav rail does not offer at all, so the deepest artifact on the site gets its own route. Every row is a live link.

Each row carries a platform number in expanded signal caps, a destination flapping in character by character, a service line, a count of what the service is made of, and a direction arrow. **Every value on the board is derived from the data**, never written down twice: `4 stops` is the timeline's length, `4 gates` the project count, `11 sections` the case study's own section list (moved into `src/data/minddo.ts` so the board can count it without importing the case study's component tree), `3 channels` the social links.

**No status column.** An earlier board listed the four projects and its status column read LIVE / AWARD / AWARD / AWARD — a column where three of four rows say the same word is dead weight on a real board, and repetition cheapens the claim. The awards are now one aggregated fact on one line.

**The arrow encodes the kind of journey.** Down for a service on this concourse, up-and-out for one that leaves it. A board that pointed the same way at both would be telling you nothing. On hover the row takes Board Lit and the arrow travels in its own direction — 4px down, or 3px up and right.

**Platform and gate are different numberings, and both are real.** The board numbers destinations 01–04 as platforms. Platform 02 is Projects, and its service line reads `4 gates`; those gates are the 01–04 on the Projects panels, each captioned with a small GATE plate above the numeral. A platform serves several gates, which is how the two numberings coexist without either decaying into a bare ordinal — the exception the section-number ban requires.

**Split-flap text** (`concourse/FlapText.tsx`). The page's structural grammar, not a widget: the hero name, the board rows, the project names, and the loading curtain all flap. One tick is 38ms — close to the real mechanism and slow enough that the eye reads individual characters. Cells travel through a fixed drum order (that ordering, not randomness, is what reads as machinery) and no cell travels more than 14 steps, so the board lands as one gesture. The `cell` variant draws the physical flap — matte face, centre seam, 2px gap; the `bare` variant animates letters alone, for lettering painted on a panel. The real string is always present once in the DOM off-screen, and the turning cells are `aria-hidden`.

**The corridor** (`src/components/MindMap.tsx`, `src/components/mindmap/`).
The overlay behind the hero portrait: a tiled station passage scrolled sideways,
eleven posters pasted along it, a platform line running the floor. You walk it.
The zones you pass through are the four interests, the sheets are the stops, and
FIFA / FM is the only interchange because it sits on the seam where the Soccer
zone becomes the Gaming zone.

Everything on the wall is drawn rather than sourced. The tile is four repeating
gradients — a 64 × 34 brick offset every other course, grout showing as the gap
— so it stays crisp at any scale and loads nothing. The grime is two soft
washes, dark at the soffit and dark at the skirting, clean at eye level where a
cleaner's arm reaches. The graffiti is four authored letterforms (`oz`,
`wildstyle`, `throwup`, `scrawl`), each a single filled path so it behaves like
paint rather than like a stroke of type, placed by transform into the gaps the
sheets leave; chalk marker multiplies into the grout, spray sits on the glaze.
The stickers are the sign system's own pictograms printed on vinyl and slapped
on askew — the one place in the system where a mark from the signage ends up
somewhere the signage did not choose.

**A poster is not signage, and that is what lets it carry colour.** The sheets
are advertising pasted onto the wall beside the signs, so they are exempt from
"colour is category" — but they come off the same press, printed in one of four
schemes built from the system's own inks (`enamel`, `signal`, `steel`, `paper`),
which is what makes a wall of eleven read as one campaign rather than a
scrapbook. Two mounts carry the difference between paid and unpaid: a `panel` is
bolted into a steel frame and square; a `flyposter` is pasted onto the tile a
degree or two askew and tears along its bottom edge.

**The eleven drawings are the point.** They were authored for the original
poster deck, survived a redesign that replaced them with a diagram, and came
back. The reason anybody stops walking is the picture; the caption under it is
one line, and there is no reading panel anywhere on the surface.

The corridor is laid out once at `WALL_H` and scaled to fit **both** axes — a
height-only fit puts a single 400px sheet at 480px on a 430px phone. Whatever
height is left over becomes ceiling, hung with an overhead gantry: the
directional sign you read while walking, before you are close enough to read the
wall.

**The way in is a door.** Two steel platform-edge leaves hold shut for a fifth
of the run and then part on the site's deceleration curve, carrying the hatch
that already means "the ground changes here" down their closing edges and a
signal seam on the join. The passage behind them settles in from a hair under
full size. The entrance carries no opacity of its own: the doors live inside
the dialog, so a fade there makes them translucent and you watch the home page
through a shut door, which is a wipe wearing a door costume. Under reduced
motion the leaves cross-fade instead of travelling.

**The case study's contents rail** (`/projects/minddo`). The route diagram
again, stood on end: a 4px enamel bar with a station disc per section, the
section being read taking a signal disc inside a steel ring. A table of
contents is a line with eleven stops and the reader standing at one of them,
which is the thing the diagram was drawn for.

**The route diagram** (Background). The timeline drawn as a transit line: a 12px enamel bar running left to right with one 45° climb in the middle, station discs printed on the line, and a hollow interchange ring at the terminus. Data is reversed from résumé order — you board at the first station and the terminus is where he is now. On mobile the same line stands on end.

**The status lamp.** A square of a reserved colour beside its one reserved word. The Live lamp — and only the Live lamp — breathes on a 2.4s `lamp` keyframe, the way a real bulb does behind glass.

**The custom cursor.** A signal square with a 1.5px steel edge (square, because the circle is reserved), tracked tightly, plus a lagging registration frame — the corner marks a sign shop prints to align a panel — that closes in over anything interactive. The system cursor is only hidden once the component has actually mounted (`body.cursor-ready`), so a JS failure leaves a working pointer rather than none.

**The loading curtain.** The board waking up before the terminal does: one row flapping "OLRIC ZENG" on a dead board, over a signal progress bar seated in a steel channel. Floored at 700ms, ceilinged at 2500ms, shown once per session, and skipped entirely under reduced motion.

### Motion

One deceleration curve for the whole site — `cubic-bezier(.22, 1, .36, 1)` — with `cubic-bezier(.5, 0, .78, .2)` for things accelerating away. State changes run 0.18–0.24s; the project sheet opens in 0.45s; entrance reveals run 0.7–0.9s.

`prefers-reduced-motion` is honoured throughout, and it is honoured by subtraction of *travel*, never by a blanket `animation: none`. `globals.css` owns only what CSS drives (the slide-up loses its rise, the lamp stops pulsing, smooth scroll goes instant); every framer-motion component reads `useReducedMotion` itself, because framer writes transforms directly and no CSS media query reaches it. What goes: the flap cascade, the scroll blur and scale, the cursor's registration frame, the loading curtain, the 24px reveal rise. What stays, always: every state change, expressed as a cross-fade.

### Named Rules

**The One Authored Moment Rule.** The scroll-traced signature is the page's single authored moment; everything else is a state change. As the hero recedes, its signal field drains to board black and the four-path signature writes itself across the emptied departures board in signal yellow. This is a pinned brand commitment — its housing may change, the moment may not.

**The Signature Survives Reduced Motion Rule.** Under `prefers-reduced-motion`, the signature is not removed. It settles to its finished stroke instead of animating the pen, which keeps the moment without the scroll linkage.

**The Themed Surface Rule.** Browser chrome is themed from this palette, never left to defaults: selection (signal on steel), caret, scrollbar thumb and track with both `width` *and* `height` set, per-surface `:focus-visible` ring, the skip link (a real signal-on-steel sign plate), and root-level tabular numerals.

## Do's and Don'ts

### Do:

- **Do** treat colour as a claim. Before using red or green, answer what the element *is* — an award, or a deployed service. If the answer is neither, use an ink.
- **Do** ship every reserved colour in two values, one measured on the light grounds and one on the board.
- **Do** commit a new section to one ground from the palette's four and let it run full-bleed.
- **Do** solve hierarchy with Archivo's width and weight axes and with scale.
- **Do** open a section with the Headline followed by a 12px solid accent bar.
- **Do** author any new icon as a solid 24×24 silhouette path in `Pictogram.tsx`.
- **Do** keep every interactive control at 44px or larger in its smallest dimension.
- **Do** read `useReducedMotion` inside any new framer-motion component; `globals.css` cannot reach it.
- **Do** cap reading measure explicitly (34–66ch, depending on the job).
- **Do** import colour, easing, and type from `src/design/tokens.ts`. It is the canonical source; `globals.css` is a mirror of the few values CSS itself needs.

### Don't:

- **Don't** tint anything red or green for emphasis, severity, or delight. Those two colours are spoken for.
- **Don't** draw a third-party logo or brand mark into this system. Name the organisation and link it.
- **Don't** add a second typeface. There is one face.
- **Don't** round a corner. The only circle in the system is a station marker on the route line.
- **Don't** add a shadow for elevation, hover lift, or ambient depth. Change the ground or invert the ink.
- **Don't** use a border to outline a shape for interest — a border here is a seam, a rail, a frame, or a hairline between rows.
- **Don't** use a Unicode character or an icon font where a pictogram belongs.
- **Don't** let the split-flap shrink to a decorative widget on one element; it is the page's structural grammar.
- **Don't** set a form input below 1rem.
- **Don't** put a gradient anywhere except where it describes a material (the flap cell's seam, the platform-edge hatch). Gradients never imply depth here.
- **Don't** make the top rail translucent or let it fade in on scroll.

## Known Ceiling

Recorded honestly rather than dropped — these are true of the build as shipped:

- ~~**The route diagram is used once.**~~ Closed. It now carries three things:
  the Background timeline, the platform line running the floor of the corridor
  behind the hero portrait, and the case study's table of contents, which is a
  line with eleven stops and the reader standing at one of them.
- **Arrows rarely name a destination.** Real wayfinding pairs a direction with a place. Here, arrow-plus-destination happens on the departures board and in the project sheet's onward-travel pair; elsewhere (nav, contact rows, buttons) the arrow travels alone.
- **`public/og-image.png` is stale.** It still shows the previous gold-and-serif visual world and must be reauthored before the site is shared anywhere that unfurls a link.
- **The cutout portrait keeps a soft edge.** `/public/subject.webp` was re-matted in this build (fringe pixels 1702 → 596 on a sampled measure) but retains a genuine soft hair edge, which is why the hero splits into a yellow field and a sign-white panel — the portrait stands on white rather than in the saturated field. A properly matted asset would free that composition.
- ~~**`src/components/MindMap.tsx` is outside the sign system.**~~ Closed. It is
  the corridor now. See "The corridor" under Signature Components.

- **The corridor is the third shape this content has taken.** It was a poster
  deck (visual, silent about structure), then a network map (structurally exact,
  airless — a diagram with a column of prose beside it). The corridor keeps the
  drawings and keeps the one structural fact worth drawing, and the cost is that
  the network's other relationships are now implied by adjacency rather than
  stated. That is the right trade for this surface and it is still a trade.

- **three.js is gone from the project.** The relief renderer was the only thing
  importing it. The dependency is uninstalled, and the home page no longer has a
  550 KB chunk waiting behind a click.
