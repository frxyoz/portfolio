# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: a mixed audience arriving at two different speeds, on the same surface.**

- **Recruiters and university-pipeline sourcers.** Arriving from a resume link, LinkedIn, or a
  referral. On a clock, doing a fast pass over many candidates. They need to place Olric in a
  bucket in roughly twenty seconds and move on.
- **Engineering hiring managers and interviewers.** Arriving with more intent, often with the
  resume already open, looking for evidence of depth. They will read a case study end to end if
  it earns it — the MindDo page at `/projects/minddo` is written on that assumption and runs to
  eleven sections with interactive diagrams.

Both land on the same home page. It has to survive the skim and reward the reader, and neither
group can be served by making the other's experience worse.

## Product Purpose

A personal portfolio for Olric Zeng, a Computer Science student at Cornell, presenting real
engineering work to people evaluating him for internships and roles.

**Success is being remembered.** Not a form submission, not a resume download, not a completed
read — those are all available and none of them is the goal. The site succeeds when a visitor
recalls Olric by name later, when a role opens or a referral comes up. That makes distinctiveness
a functional requirement rather than decoration, and it means conversion metrics are the wrong
instrument for judging this surface.

## Positioning

The work itself is the differentiator, and specifically its *depth relative to career stage*. The
MindDo case study documents a deployed distributed system — queue/worker separation, KEDA
autoscaling on queue depth, four self-found security holes including an SSRF into the EC2 metadata
endpoint, and measurements the author disqualifies when they turn out to be wrong. That is
graduate-level systems reasoning presented by an undergraduate, and it is not something a
neighboring student portfolio could truthfully copy.

The secondary position is range: backend and infrastructure (REST APIs, data models, Kubernetes,
Postgres) and frontend (React, Flutter) in the same person, evidenced on both sides.

## Operating Context

- **Entry is rarely the home page's top.** Deep links to `/projects/minddo` circulate on their own,
  from a resume or a message. Every route has to introduce itself.
- **Evaluation happens alongside other tabs.** A resume PDF, a LinkedIn profile, a GitHub account,
  and four other candidates' sites. The visit is comparative and interruptible.
- **The resume is a parallel artifact, not a downstream one.** `/resume.pdf` is served from the
  site and also circulates independently; the two must not contradict each other.
- **Live production site** at `https://olriczeng.com`, deployed on Vercel with Analytics and Speed
  Insights active.

## Capabilities and Constraints

**Routes**

- `/` — single-page composition: hero, about/timeline, projects, contact. Projects open in a
  full-screen slide-up overlay with keyboard navigation (Escape closes, arrows move between
  projects); `NavBar` and the overlay coordinate through `OverlayContext`.
- `/projects/minddo` — a standalone long-form engineering case study with its own sticky table of
  contents, seven interactive SVG diagrams, and an embedded demo video.

**Technical**

- Next.js 16 App Router, React 19, TypeScript, Tailwind v4 (CSS-based `@theme`, no
  `tailwind.config.ts`), framer-motion, three.js. Node 20.
- Content lives in `src/data/` (`profile.ts`, `projects.ts`, `minddo.ts`) separated from
  presentation. New project entries are data edits.
- Contact form posts to Formspree via `NEXT_PUBLIC_FORMSPREE_KEY`.
- A custom cursor is global; the MindDo case study deliberately opts out of it via a
  `body.plain-cursor` class, because that page is dense interactive documentation.

**Undecided / open**

- Whether other projects get MindDo-depth standalone case study pages, or whether MindDo stays the
  single deep artifact. Currently MindDo is the only one; the other three live in the overlay.

## Brand Commitments

**Binding — must be preserved by any future work:**

- **The scroll-traced signature.** In `HeroSection.tsx`, a four-path SVG signature draws itself in
  via `pathLength` bound to `scrollYProgress` as the hero recedes. The user named this explicitly
  as fixed. It is the site's single most memorable moment and, given that success is defined as
  being remembered, it is load-bearing rather than ornamental.
- **Factual content.** The timeline (Hack4Impact, Cornell, Coding Mind), the three awards, org
  names and logos, the MindDo measurements. All real and verified. Nothing here may be embellished,
  softened, rounded, or padded with invented context.

**Incumbent but explicitly not binding:**

The current visual world — Cormorant Garamond display type, DM Sans body, deep gold `#b8860b`,
white canvas with warm off-white alternating sections, art-deco corner ornaments, the dark contact
section — was offered as a constraint and *not* selected. Treat it as the existing implementation
and as evidence, not as a commitment. The same applies to the MindDo case study's deliberate
divergence from that world (single UI typeface, neutral ink palette, its own diagram colors): it
is intentional and it works, but it is not pinned.

**Voice.** First person, plain, specific. Measured claims with the caveats attached — the case
study reports a benchmark number it then disqualifies, and states which results prove nothing.
Marketing register was deliberately removed from the site's copy in a prior pass. Do not
reintroduce it.

## Evidence on Hand

**Real and verifiable:**

- **MindDo AI** (2026) — deployed on AWS, k3s on a t3.large. Measured: 20/20 jobs under load test,
  1→4 worker scale-up in 17 s, 18.9 min queue drain, 257 s median per job, 102.7 s uncontended
  baseline, ~$0.023 per showcase. Demo video embedded from YouTube. Full case study at
  `src/data/minddo.ts` and `src/components/minddo/`.
- **gz-metro** (2026) — Network History, 1997–2026. Live at
  `gzmetro.olriczeng.com`. MapLibre GL over a temporal GeoJSON of real track geometry; 19 lines
  and 140 stations, each filtered by its own opening and closing date.
  Source: `github.com/frxyoz/gz-metro`.
- **Luminary** (2025) — Study Tracker App. *Best Overall App, AppDev Hack Challenge 2025.*
  Source: `github.com/tnt07-t/luminary-backend`.
- **Boroughs** (2025) — NYC Housing Compatibility Finder. *#1 Live Right Award, Cornell Claude
  Hackathon, 100+ participants.* Source: `github.com/aayanhussainw07/Boroughs`.
- **NoteForm** (2024) — iOS Piano Hand Posture Analyzer. *1st Place, IgniteCS Programming Expo
  2024.* Source: `github.com/frxyoz/noteform`.
- **Coding Mind internship** (2024) — AI nutrition app, Flutter/Firebase/Flask, classifying 100K+
  food items.
- Resume at `/resume.pdf`. Screenshots in `public/`. Org logos for Hack4Impact, Cornell, Coding
  Mind.

**Absences future work must not fabricate:**

- No testimonials, references, quotes, or endorsements from anyone.
- No traffic, user, or download numbers for any project.
- No public repository for MindDo (`githubUrl` is deliberately empty).
- No professional employment beyond the listed internship and the Hack4Impact role.
- No claim that any project has real users. MindDo's load numbers come from a synthetic load
  generator, and the case study says so.

## Product Principles

1. **Two reading speeds, every surface.** A twenty-second skim and a twenty-minute read have to
   both succeed on the same page. Depth is layered underneath the skim, never placed in front of
   it as a toll.
2. **Memorability is the metric.** Success is recall, not conversion. When a choice is between
   safe and distinctive, distinctive is the correct answer — and a design that merely avoids
   mistakes has failed the actual brief.
3. **Every claim survives a follow-up question.** The work is real, so it is stated plainly with
   its limits attached. Overstatement is a bigger risk to credibility here than understatement,
   because the audience interviews people for a living.
4. **The engineering is the content.** Evidence of how something was built and reasoned about
   outranks a description of what it does. Show the decision, the failure, and the correction.
5. **Every route is an entry point.** Deep links circulate independently; no page may assume the
   visitor arrived through the home page or read anything before it.

## Accessibility & Inclusion

No product-specific standard has been established. Baseline expectations apply: keyboard operation
of the project overlay (already implemented), and sufficient contrast on the gold accent against
white.

**Known gap:** `prefers-reduced-motion` is not honored anywhere in the codebase — no CSS media
query, no `useReducedMotion`. The site runs a scroll-traced signature, scroll-driven blur and
scale, a custom cursor, framer-motion reveals, and three.js. For a visitor with vestibular
sensitivity this is currently unmitigated. Recorded as a fact, not scheduled as work.
