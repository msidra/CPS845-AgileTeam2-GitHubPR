# CPS845-AgileTeam2-GitHubPR

**GitHub Pull Request Review Page — Frontend (Vibe-Coded)**

Course: **CPS845 — Extreme Agile Processes**
Team: **Agile Team 2**

This repository is a course exercise in **vibe coding**: building software by
describing intent to an AI agent in natural language and iterating on its
output, rather than hand-writing every line. The deliverable is a static
frontend that recreates GitHub's Pull Request "Conversation" review page, and
this README is the accompanying analysis of *how the AI helped produce it*.

---

## 1. What was built

A pixel-faithful, static reproduction of a GitHub PR review page (dark theme),
matching the layout, colour palette, and typography of the real GitHub UI.

| File | Purpose |
|------|---------|
| `index.html` | Page markup — header, repo nav, PR header, tabs, conversation timeline, sidebar, footer |
| `styles.css` | GitHub **Primer** dark-theme styling, driven by CSS custom properties |
| `script.js` | Dependency-free interactions (Write/Preview tabs, markdown preview, toolbar, `/` search shortcut) |

### Features reproduced
- Global header: nav menu, logo, `owner / repo` breadcrumb, search with `/` shortcut, action icons, avatar
- Repository nav tabs (Code, Issues, Pull requests, …) with the active-tab underline
- PR title + number, **Merged** state badge, "merged N commits into main from …" with copy-branch button
- PR sub-tabs: Conversation / Commits / Checks / Files changed, with counters and the `+1,733 −3` diffstat
- Conversation timeline: author comment (full markdown body), "added commits" events, commit rows with pass/fail checks and SHAs, the **SonarQube Quality Gate passed** bot card, the merge event, branch-deleted event, and the merged-and-closed banner
- Right metadata sidebar: Reviewers (approved ✓), Assignees, Labels, Projects, Milestone, Development, Notifications, participants, Lock conversation
- "Add a comment" box: Write/Preview tabs, formatting toolbar, Comment button
- Footer with copyright and link row

---

## 2. Tooling

| Aspect | Detail |
|--------|--------|
| AI environment | **Kiro IDE** (AI-powered development environment built on VS Code) |
| Interaction mode | Agentic chat — the AI reads/writes files and runs commands directly |
| Model | **Auto** — Kiro selected the model dynamically on the server for each turn, so no single fixed model name applies to this session |
| Languages | HTML5, CSS3, vanilla JavaScript (no frameworks, no build step) |
| Reference input | Two screenshots of a real GitHub PR page + the page's DOM/HTML outline |

> **On the model:** this session used Kiro's *Auto* setting. The analysis below
> focuses on observable AI behaviour (how it interpreted prompts and generated
> code) rather than attributing results to a named model, because the model was
> chosen server-side per turn.

---

## 3. Inputs I gave the AI (prompt log)

The project was produced across a short series of natural-language prompts.
Paraphrased for the record:

1. **Initial build prompt** — "I have to program the frontend of a GitHub PR
   review page. Frontend only. Make the layout, colours, fonts — everything —
   the same. Here is an example of a PR review page (take this as the example)
   and add all the mandatory features. Use best practices to write this code."
   - Attached: two screenshots of the live GitHub PR page, plus a screenshot of
     the page's HTML/DOM structure.

2. **This README** — "Write the README for this. It's for CPS845 Extreme Agile
   Processes. We are vibe coding the frontend of a GitHub PR review page to
   analyse how AI helps write it: what inputs I gave, which model was used, how
   you generated the code, and best practices followed."

**Observation for the analysis:** the prompts were high-level and
intent-focused ("make it the same", "add all mandatory features", "use best
practices"). The AI had to infer concrete requirements — which PR features count
as "mandatory", what the exact colours and fonts are — from the screenshots and
from general knowledge of GitHub's design system.

---

## 4. How the AI generated the code

The agent followed a read → plan → implement → verify loop:

1. **Read the workspace** — opened the existing `README.md` to understand the
   starting point before writing anything.
2. **Interpreted the reference** — derived the structure from the screenshots
   and DOM outline, then enumerated the "mandatory" PR features explicitly in
   chat before coding (so scope was visible and reviewable).
3. **Chose an architecture** — static HTML + CSS + JS, no framework or build
   step, matching a "frontend only" brief and keeping the artifact easy to open
   and grade.
4. **Wrote the three files** in order: markup, then styling, then behaviour.
5. **Reconstructed GitHub's design tokens** — mapped the dark theme to GitHub's
   **Primer** palette (e.g. `#0d1117` canvas, `#161b22` surfaces, `#30363d`
   borders, `#8957e5` merged-purple, `#2f81f7` links) and the Primer system font
   stack.
6. **Verified** — ran a sanity check confirming `<div>` tags balanced (62/62)
   and that both assets were correctly linked from the HTML.

**Observation for the analysis:** the AI did not just emit code — it made the
implicit explicit (listing features, naming the colour system, verifying the
output). This mirrors agile practices of small, reviewable increments and
"done" criteria.

---

## 5. Best practices followed

**HTML / accessibility**
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<article>`, `<footer>`
- `aria-label` on icon-only buttons; `aria-hidden` on decorative SVGs
- Keyboard-focusable, native interactive controls

**CSS**
- A single source of truth for the palette via CSS custom properties (`:root`),
  so theming and maintenance happen in one place
- BEM-style class naming for readable, collision-resistant selectors
- Responsive breakpoints (sidebar stacks below 1012px; header condenses below 767px)
- Reused GitHub's actual Primer tokens for colour fidelity

**JavaScript**
- Zero dependencies; progressive enhancement (the page is usable without JS)
- `"use strict";` and an IIFE to avoid polluting global scope
- **Security:** the markdown preview escapes HTML *before* rendering to prevent
  XSS from user input
- Small, single-purpose functions (tab switch, preview render, toolbar wrap)

**Process / version control**
- Clear, scoped commit message
- Files committed together as one coherent increment
- Permission/credential issues surfaced and explained rather than worked around

---

## 6. Notes & known limitations

- **Static mock only.** There is no backend; data is hard-coded to mirror the
  reference PR. Buttons like *Comment*, *Revert*, and *Restore branch* are
  presentational.
- **Push blocked by permissions.** Pushing to `msidra/CPS845-AgileTeam2-GitHubPR`
  returned `403` because the cached git credentials authenticate as
  `sidramusheer`, who lacks write access to the `msidra` repo. Kiro login is
  independent of git credentials. Resolution requires either collaborator access
  for `sidramusheer` or authenticating git as `msidra` (e.g. a Personal Access
  Token). The commit exists locally regardless.
- **Accessibility is not formally audited.** Semantic structure and ARIA labels
  were applied, but full WCAG conformance would require manual testing with
  assistive technology.

---

## 7. How to view

Open `index.html` directly in any modern browser — no server or install needed.

```
# optional: serve locally
python -m http.server 8000
# then visit http://localhost:8000
```

---

## 8. Analysis summary (for CPS845)

Vibe coding compressed the work from "write every tag and rule by hand" to
"describe the target and review the result." The AI's value showed up in three
places: (1) **translating vague intent into concrete scope** (turning "mandatory
features" into an explicit checklist), (2) **recalling domain knowledge** (the
exact Primer colour tokens and font stack, so the clone matched without manual
colour-picking), and (3) **self-verification** (tag-balance and asset-link
checks before declaring done). The main human responsibilities that remained
were *providing a faithful reference*, *judging visual fidelity*, and *handling
environment/permission concerns the AI could surface but not resolve on its own*.
