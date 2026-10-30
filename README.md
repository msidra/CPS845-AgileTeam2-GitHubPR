# CPS845-AgileTeam2-GitHubPR

**GitHub Pull Request Review Page — Frontend (Vibe-Coded)**

- Course: **CPS845 — Extreme Agile Processes**
- Team: **Agile Team 2** (Kevin Khuu, Setayesh Hamzehpour, Parvir Jooty, Sidra Musheer)
- Project topic: **GitHub PR Review**

This is a static frontend that copies the look of GitHub's Pull Request page. It was built by **vibe coding** — describing what we wanted to an AI and reviewing the result. This README also records how the AI helped.

---

## 1. What it is

- A fake GitHub PR review site. Frontend only, no real backend.
- Dark theme, matching GitHub's colours, fonts, and layout.
- Sample data lives in `data.js` (users, pull requests, files, checks, comments).
- Three personas from our user stories sign in: **Jane** (author), **John** (reviewer), **Bob** (new contributor).

---

## 2. How to run

- Open `index.html` (or `signin.html`) in any modern browser. No install needed.
- Sign in with any of these (password is `password123` for all):
  - `john` — reviewer, sees PRs waiting for his review
  - `jane` — author, also reviews one PR
  - `bob` — new contributor, authors PRs

---

## 3. Features (mapped to our user stories)

**Sign in — US-1.1**
- Username field and password field (characters hidden).
- Sign in button.
- After signing in, your username and avatar show at the top.

**Sign-in errors — US-1.2 (matched to real GitHub)**
- Empty field: message names the missing field.
- Password under 8 characters: "Password must be at least 8 characters".
- Wrong username: red banner "Incorrect username or password." (GitHub does not reveal which field is wrong).
- Valid username, wrong password: "Invalid password." next to the field.
- The typed username is kept when an error shows.

**Go straight to work — US-1.3**
- After sign in you land on the PR list with no extra clicks.
- You only see pull requests where you are a reviewer.
- Opening any page without signing in sends you back to sign in.

**PR overview — US-2.1**
- Shows title, author, source → target branch, and a status badge (Open / Merged / Closed).
- Stays at the top, visible without scrolling.

**PR description — US-2.2**
- Shown under the overview with paragraphs and line breaks kept.
- Shows "No description provided" when empty.

**Files changed — US-2.3**
- Lists every changed file by name.
- Shows lines added (+) and removed (−) per file.
- Summary bar at the top with total files, additions, and deletions.

**Conversation — US-3.1**
- Comments and events shown oldest to newest.
- Each entry shows who, when, and what.
- Shows "No comments yet" when empty.

**Add a comment — US-3.2**
- Comment box with a Comment button.
- Button is disabled while the box is empty.
- New comment appears at the bottom with your name and time.

**Check readiness — US-3.3**
- Each check shows Passed, Failed, or Pending.
- Shows the number of approving reviews.
- "Ready to merge" only when all checks pass and there is at least one approval; otherwise it lists what is blocking.

**Other GitHub-style touches**
- Global header, repo nav tabs, PR sub-tabs (Conversation / Checks / Files changed) with counts.
- Diffstat (+/−) and status badges.
- Profile pictures for Jane, John, and Bob (generated initials avatars, no external images).
- Repo shown as `agile-team-2 / github-pr-review`.
- Footer with links.

---

## 4. Files

| File | What it does |
|------|--------------|
| `index.html` | Entry point; sends you to sign in or the PR list |
| `signin.html` / `signin.js` | Sign-in page and its validation |
| `prs.html` / `prs.js` | PR list, filtered to your reviews |
| `pr.html` / `pr.js` | Full PR page (overview, description, files, checks, conversation) |
| `data.js` | Sample users and pull requests |
| `auth.js` | Session + sign-in guard |
| `common.js` | Shared header, status badges, avatars, markdown |
| `styles.css` | All styling (GitHub Primer dark theme) |

---

## 5. Tools used

- **Kiro IDE** — AI-powered editor built on VS Code.
- **Model: Auto** — Kiro picked the model on the server each turn, so no single model name applies.
- **Languages:** HTML, CSS, plain JavaScript. No frameworks, no build step.
- **Reference:** screenshots of a real GitHub PR page plus its HTML structure.

---

## 6. Prompts we gave the AI

1. Build the PR review page frontend. Make the layout, colours, and fonts the same as the example screenshots. Add all mandatory features. Use best practices.
2. Push it to GitHub.
3. Clarify: signed into Kiro as `sidramusheer` but want to push to `msidra`.
4. Write this README for the CPS845 analysis.
5. Add all the features listed in our backlog and sprint files.
6. Change the usernames to the personas from our user stories (Jane, John, Bob).
7. Give Jane, John, and Bob profile pictures and rename the repo.
8. Fix the bold text and make the sign-in errors match real GitHub.
9. Update this README in short bullet points.

**What we noticed:** our prompts were high-level ("make it the same", "add all features"). The AI had to turn that into concrete work by reading our screenshots and backlog files.

---

## 7. How the AI generated the code

- Read the workspace first before writing anything.
- Listed the mandatory features in chat before coding, so scope was clear.
- Chose a simple setup: static HTML + CSS + JS, no framework.
- Reused GitHub's real colour tokens (Primer) and font stack for an accurate look.
- Built the data model from our Product Backlog acceptance criteria.
- Checked its own work (syntax checks, tracing the data against each story).

---

## 8. Best practices followed

- Semantic HTML tags and ARIA labels for accessibility.
- One place for all colours (CSS variables).
- Clear, consistent class naming.
- Responsive layout (sidebar stacks on small screens).
- No external dependencies; works offline.
- Safe comment/markdown rendering (escapes HTML to prevent XSS).
- Small, single-purpose JavaScript functions.
- Clear git commit message.

---

## 9. Known limits

- Static mock only — buttons like Comment, Revert, and Restore branch are for show.
- Not pushed to GitHub yet: pushing to `msidra` was blocked (403) because our git login is `sidramusheer`, which has no write access. The commit exists locally.
- Accessibility was built in but not formally tested with assistive tools.
- "Works in Chrome and Safari with no console errors" (our Definition of Done) still needs a manual browser check.

---

## 10. Short analysis (for CPS845)

- AI sped up the work by turning vague requests into concrete features.
- It was strong at recalling exact details (GitHub colours, fonts) and at self-checking.
- We still had to: give a good reference, judge the look, catch bugs (like the bold text), and handle the GitHub permission issue the AI could flag but not fix.
- Lesson: AI is a fast helper, but every output still needs a human check against the backlog and the real target.
