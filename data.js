/* =========================================================================
   Sample data for the GitHub PR Review prototype (CPS845 Agile Team 2).
   No backend — this JSON-like data drives the sign-in, PR list, and PR page.
   Reviewer filtering (US-1.3) matches the signed-in username against the
   `reviewers` array on each pull request.
   ========================================================================= */
window.APP_DATA = {
  // Known users (prototype only — passwords are NOT real credentials).
  users: [
    { username: "jane", password: "password123", name: "Jane" },   // author persona
    { username: "john", password: "password123", name: "John" },   // reviewer persona
    { username: "bob", password: "password123", name: "Bob" }      // new-contributor persona
  ],

  pullRequests: [
    {
      id: 8,
      title: "S1 FR-1: Data Foundation (ingestion + mapping + data-quality)",
      author: "jane",
      status: "merged",                 // open | merged | closed
      sourceBranch: "s1/fr-1-data-foundation",
      targetBranch: "main",
      mergedBy: "john",
      commitsCount: 10,
      createdAt: "2 days ago",
      reviewers: ["john"],              // US-1.3: only shown to these reviewers
      approvals: 1,
      diff: { filesChanged: 58, additions: 1733, deletions: 3 },
      description:
        "Unit S1 / requirement FR-1 (Data Foundation) of the Customer Demand Forecasting MVP.\n\n" +
        "## What\n" +
        "- Ingestion run orchestration: overwrite-in-place (Q1-8), source_manifest with per-file SHA-256, row_counts, status lifecycle, correlation_id, lineage emitted in the same transaction as the status change.\n" +
        "- PPS to material mapping: mapping_snapshots with the four frozen mapping_status values and historical/target versions, stable sort.\n" +
        "- Input data-quality engine IV1-IV7 (Group A, stop) and IR1-IR14 (Group B, report-only) semantics: fail-closed (checks first, no partial output).\n" +
        "- Deterministic standardization of the six sell-out source datasets.\n" +
        "- Celery ingestion worker wiring: standardize to map to data-quality end to end.\n\n" +
        "## Tests / verification\n" +
        "98 unit + Hypothesis property tests pass; ruff check + ruff format --check clean (ruff 0.7.3).\n\n" +
        "## Review\n" +
        "Semantic reviewer verdict: APPROVED. One non-blocking finding: IV1 missing-dataset result row committed in a separate transaction from the fail transition (cosmetic; will tidy in FR-2).",
      // US-2.3 — changed files
      files: [
        { name: "src/ingestion/orchestration.py", additions: 412, deletions: 0 },
        { name: "src/ingestion/mapping.py", additions: 288, deletions: 1 },
        { name: "src/ingestion/data_quality.py", additions: 356, deletions: 0 },
        { name: "src/ingestion/standardize.py", additions: 274, deletions: 2 },
        { name: "tests/test_data_foundation.py", additions: 403, deletions: 0 }
      ],
      // US-3.3 — checks
      checks: [
        { name: "CI / acceptance", status: "passed" },
        { name: "CI / unit-tests", status: "passed" },
        { name: "ruff / lint", status: "passed" },
        { name: "SonarQube Cloud / quality-gate", status: "passed" }
      ],
      // US-3.1 — conversation, oldest to newest
      conversation: [
        { type: "comment", author: "jane", time: "2 days ago",
          body: "Opened this PR for FR-1. Ready for review when you have a moment." },
        { type: "event", actor: "jane", time: "2 days ago", text: "added 8 commits" },
        { type: "event", actor: "jane", time: "2 days ago", text: "added 2 commits" },
        { type: "comment", author: "john", time: "2 days ago",
          body: "Looks good. Approving — nice work on the fail-closed semantics." },
        { type: "event", actor: "john", time: "2 days ago", text: "merged this pull request" }
      ]
    },
    {
      id: 12,
      title: "US-2.3: Files changed summary bar",
      author: "bob",
      status: "open",
      sourceBranch: "feat/files-changed-summary",
      targetBranch: "main",
      commitsCount: 3,
      createdAt: "5 hours ago",
      reviewers: ["john"],
      approvals: 0,
      diff: { filesChanged: 4, additions: 96, deletions: 12 },
      description:
        "Adds the diffstat summary bar above the file list.\n\n" +
        "Shows total files changed, additions and deletions.",
      files: [
        { name: "index.html", additions: 40, deletions: 4 },
        { name: "styles.css", additions: 48, deletions: 6 },
        { name: "script.js", additions: 8, deletions: 2 }
      ],
      checks: [
        { name: "CI / acceptance", status: "passed" },
        { name: "CI / unit-tests", status: "pending" }
      ],
      conversation: [
        { type: "comment", author: "bob", time: "5 hours ago",
          body: "First pass at the summary bar. Numbers are wired to the sample data." }
      ]
    },
    {
      id: 15,
      title: "US-1.2: Sign-in error messaging",
      author: "bob",
      status: "closed",
      sourceBranch: "feat/signin-errors",
      targetBranch: "main",
      commitsCount: 2,
      createdAt: "1 day ago",
      reviewers: ["jane"],
      approvals: 0,
      diff: { filesChanged: 2, additions: 61, deletions: 0 },
      description: "",   // demonstrates "No description provided" (US-2.2)
      files: [
        { name: "signin.html", additions: 24, deletions: 0 },
        { name: "signin.js", additions: 37, deletions: 0 }
      ],
      checks: [
        { name: "CI / acceptance", status: "failed" }
      ],
      conversation: []    // demonstrates "No comments yet" (US-3.1)
    }
  ]
};
