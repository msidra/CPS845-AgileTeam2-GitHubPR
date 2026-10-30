/* =========================================================================
   Pull request detail page — data-driven.
   US-1.3: auth-guard.
   US-2.1: overview (title, author, source->target branch, status badge),
           kept at the top and visible without scrolling.
   US-2.2: description with paragraphs/line breaks; "No description provided".
   US-2.3: files changed — name, +/- per file, and a totals summary bar.
   US-3.1: conversation oldest->newest, who/when/what; "No comments yet".
   US-3.2: add-comment box; Comment disabled while empty; new comment appends
           with the author's name and time.
   US-3.3: checks Passed/Failed/Pending, approval count, Ready-to-merge gate.
   ========================================================================= */
(function () {
  "use strict";

  if (!window.Auth || !Auth.requireAuth("signin.html")) return;
  Common.renderHeader(document.getElementById("app-header"));

  var user = Auth.currentUser();
  var data = window.APP_DATA || { pullRequests: [] };

  // Resolve the PR from ?id= ; default to the first one.
  var id = parseInt(new URLSearchParams(window.location.search).get("id"), 10);
  var pr = data.pullRequests.filter(function (p) { return p.id === id; })[0]
        || data.pullRequests[0];

  if (!pr) {
    document.getElementById("pr-header").innerHTML =
      '<p>Pull request not found. <a href="prs.html" class="link">Back to list</a></p>';
    return;
  }

  var esc = Common.escapeHtml;

  /* ----------------------------- US-2.1 overview ----------------------------- */
  function verbForStatus(s) {
    return s === "merged" ? "merged" : s === "closed" ? "closed" : "wants to merge";
  }
  document.getElementById("pr-header").innerHTML =
    '<div class="pr-header__title-row">' +
      '<h1 class="pr-header__title">' + esc(pr.title) +
        ' <span class="pr-header__number">#' + pr.id + '</span></h1>' +
    '</div>' +
    '<div class="pr-header__meta">' +
      Common.statusBadge(pr.status) +
      '<span class="pr-header__meta-text">' +
        '<a href="#" class="link-user">' + esc(pr.author) + '</a> ' +
        verbForStatus(pr.status) + ' ' + pr.commitsCount + ' commits into ' +
        '<span class="branch-ref">' + esc(pr.targetBranch) + '</span> from ' +
        '<span class="branch-ref">' + esc(pr.sourceBranch) + '</span>' +
        ' <span class="pr-header__time">' + esc(pr.createdAt) + '</span>' +
      '</span>' +
    '</div>';

  /* ----------------------------- sub-tabs ----------------------------- */
  var commentCount = pr.conversation.filter(function (e) { return e.type === "comment"; }).length;
  document.getElementById("pr-tabs").innerHTML =
    '<ul class="pr-tabs__list">' +
      '<li><a href="#conversation" class="pr-tabs__item pr-tabs__item--active" data-tab="conversation">' +
        'Conversation <span class="counter">' + commentCount + '</span></a></li>' +
      '<li><a href="#checks" class="pr-tabs__item" data-tab="checks">' +
        'Checks <span class="counter">' + pr.checks.length + '</span></a></li>' +
      '<li><a href="#files" class="pr-tabs__item" data-tab="files">' +
        'Files changed <span class="counter">' + pr.diff.filesChanged + '</span></a></li>' +
    '</ul>' +
    '<div class="pr-tabs__diffstat">' +
      '<span class="diffstat-added">+' + pr.diff.additions.toLocaleString() + '</span>' +
      '<span class="diffstat-removed">-' + pr.diff.deletions.toLocaleString() + '</span>' +
    '</div>';

  /* ----------------------------- US-2.2 + US-3.1 + US-3.2 (conversation) ----------------------------- */
  var convPanel = document.querySelector('[data-panel="conversation"]');

  // Description block (US-2.2)
  var descHtml = pr.description && pr.description.trim()
    ? Common.renderMarkdown(pr.description)
    : '<p class="muted">No description provided</p>';

  var timelineHtml =
    '<article class="timeline-comment">' +
      '<span class="timeline-comment__avatar">' + Common.avatar(pr.author) + '</span>' +
      '<div class="comment-box">' +
        '<div class="comment-box__header">' +
          '<span class="comment-box__meta"><a href="#" class="link-user">' + esc(pr.author) +
          '</a> commented <span class="comment-box__time">' + esc(pr.createdAt) + '</span></span>' +
          '<span class="label label--author">Author</span>' +
        '</div>' +
        '<div class="comment-box__body markdown-body">' + descHtml + '</div>' +
      '</div>' +
    '</article>';

  // US-3.1: conversation oldest->newest (data is already in order).
  var events = pr.conversation;
  if (events.length === 0) {
    timelineHtml += '<p class="muted conversation-empty">No comments yet</p>';
  } else {
    timelineHtml += '<div id="conversation-stream">' +
      events.map(renderConversationEntry).join("") + '</div>';
  }

  // US-3.2: add-comment form.
  timelineHtml +=
    '<article class="timeline-comment timeline-comment--new">' +
      '<span class="timeline-comment__avatar">' + Common.avatar(user.username) + '</span>' +
      '<form class="comment-form" id="comment-form">' +
        '<div class="comment-form__header">Add a comment</div>' +
        '<div class="comment-form__body">' +
          '<textarea class="comment-form__textarea" id="comment-text" ' +
            'placeholder="Add your comment here..." aria-label="Comment body"></textarea>' +
        '</div>' +
        '<div class="comment-form__footer">' +
          '<span class="comment-form__hint">Markdown is supported</span>' +
          '<button type="submit" class="btn btn--primary comment-form__submit" id="comment-submit" disabled>Comment</button>' +
        '</div>' +
      '</form>' +
    '</article>';

  convPanel.innerHTML = timelineHtml;

  function renderConversationEntry(entry) {
    if (entry.type === "comment") {
      return '<article class="timeline-comment">' +
        '<span class="timeline-comment__avatar">' + Common.avatar(entry.author) + '</span>' +
        '<div class="comment-box">' +
          '<div class="comment-box__header">' +
            '<span class="comment-box__meta"><a href="#" class="link-user">' + esc(entry.author) +
            '</a> commented <span class="comment-box__time">' + esc(entry.time) + '</span></span>' +
          '</div>' +
          '<div class="comment-box__body markdown-body">' + Common.renderMarkdown(entry.body) + '</div>' +
        '</div>' +
      '</article>';
    }
    // event (US-3.1: who + when + what)
    return '<div class="timeline-event">' +
      '<span class="timeline-event__icon"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Z"/></svg></span>' +
      '<span class="timeline-event__text"><a href="#" class="link-user">' + esc(entry.actor) +
      '</a> ' + esc(entry.text) + ' <span class="timeline-event__time">' + esc(entry.time) + '</span></span>' +
    '</div>';
  }

  /* US-3.2: enable Comment only with text; append comment with name + time. */
  var textarea = document.getElementById("comment-text");
  var submit = document.getElementById("comment-submit");
  var form = document.getElementById("comment-form");

  textarea.addEventListener("input", function () {
    submit.disabled = textarea.value.trim().length === 0;
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var body = textarea.value.trim();
    if (!body) return;

    var stream = document.getElementById("conversation-stream");
    if (!stream) {
      // Replace the "No comments yet" placeholder with a stream container.
      var emptyEl = convPanel.querySelector(".conversation-empty");
      stream = document.createElement("div");
      stream.id = "conversation-stream";
      if (emptyEl) emptyEl.replaceWith(stream);
    }
    stream.insertAdjacentHTML("beforeend", renderConversationEntry({
      type: "comment",
      author: user.username,
      time: "just now",
      body: body
    }));

    textarea.value = "";
    submit.disabled = true;

    // keep the Conversation counter in sync
    var counter = document.querySelector('[data-tab="conversation"] .counter');
    if (counter) counter.textContent = String(parseInt(counter.textContent, 10) + 1);
  });

  /* ----------------------------- US-2.3 files changed ----------------------------- */
  var filesPanel = document.querySelector('[data-panel="files"]');
  filesPanel.innerHTML =
    '<div class="files-summary">' +
      '<strong>' + pr.diff.filesChanged + '</strong> changed file' + (pr.diff.filesChanged === 1 ? "" : "s") +
      ' with <span class="diffstat-added">' + pr.diff.additions.toLocaleString() + ' addition' +
        (pr.diff.additions === 1 ? "" : "s") + '</span>' +
      ' and <span class="diffstat-removed">' + pr.diff.deletions.toLocaleString() + ' deletion' +
        (pr.diff.deletions === 1 ? "" : "s") + '</span>' +
    '</div>' +
    '<ul class="files-list">' +
      pr.files.map(function (f) {
        return '<li class="files-row">' +
          '<span class="files-row__icon"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Z"/></svg></span>' +
          '<span class="files-row__name">' + esc(f.name) + '</span>' +
          '<span class="files-row__stat">' +
            '<span class="diffstat-added">+' + f.additions + '</span> ' +
            '<span class="diffstat-removed">-' + f.deletions + '</span>' +
          '</span>' +
        '</li>';
      }).join("") +
    '</ul>';

  /* ----------------------------- US-3.3 checks + readiness ----------------------------- */
  var checksPanel = document.querySelector('[data-panel="checks"]');
  var allPassed = pr.checks.length > 0 && pr.checks.every(function (c) { return c.status === "passed"; });
  var hasApproval = (pr.approvals || 0) >= 1;
  var ready = allPassed && hasApproval;

  var blockers = [];
  if (!allPassed) {
    var notPassed = pr.checks.filter(function (c) { return c.status !== "passed"; });
    blockers.push(notPassed.length + " check" + (notPassed.length === 1 ? "" : "s") + " not passing");
  }
  if (!hasApproval) blockers.push("At least one approving review is required");

  checksPanel.innerHTML =
    '<div class="readiness ' + (ready ? "readiness--ready" : "readiness--blocked") + '">' +
      (ready
        ? '<span class="readiness__icon icon-pass">&#10003;</span>' +
          '<div><strong>Ready to merge</strong>' +
          '<p class="muted">All checks have passed and this pull request has ' + pr.approvals +
          ' approving review' + (pr.approvals === 1 ? "" : "s") + '.</p></div>'
        : '<span class="readiness__icon icon-fail">&#33;</span>' +
          '<div><strong>Not ready to merge</strong>' +
          '<ul class="readiness__blockers">' +
            blockers.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join("") +
          '</ul></div>'
      ) +
    '</div>' +
    '<div class="checks-meta">' + pr.approvals + ' approving review' +
      (pr.approvals === 1 ? "" : "s") + '</div>' +
    '<ul class="checks-list">' +
      pr.checks.map(function (c) {
        var cls = c.status === "passed" ? "check--pass"
                : c.status === "failed" ? "check--fail" : "check--pending";
        var icon = c.status === "passed" ? "&#10003;" : c.status === "failed" ? "&#10007;" : "&#8226;";
        var label = c.status.charAt(0).toUpperCase() + c.status.slice(1);
        return '<li class="checks-row">' +
          '<span class="checks-row__icon ' + cls + '">' + icon + '</span>' +
          '<span class="checks-row__name">' + esc(c.name) + '</span>' +
          '<span class="checks-row__status ' + cls + '">' + label + '</span>' +
        '</li>';
      }).join("") +
    '</ul>';

  /* ----------------------------- sidebar ----------------------------- */
  document.getElementById("pr-sidebar").innerHTML =
    '<div class="sidebar-section">' +
      '<div class="sidebar-section__header"><span>Reviewers</span></div>' +
      '<div class="sidebar-section__body">' +
        (pr.reviewers.length
          ? pr.reviewers.map(function (r) {
              return '<div class="reviewer-row"><span class="reviewer-row__user">' +
                Common.avatar(r, "gh-avatar--xs") + ' <a href="#" class="link-user">' + esc(r) + '</a></span>' +
                (pr.approvals >= 1 ? '<span class="reviewer-row__status reviewer-row__status--approved" title="Approved">&#10003;</span>' : '') +
              '</div>';
            }).join("")
          : '<span class="sidebar-section__body--muted">No reviewers</span>') +
      '</div>' +
    '</div>' +
    '<div class="sidebar-section">' +
      '<div class="sidebar-section__header"><span>Assignees</span></div>' +
      '<div class="sidebar-section__body sidebar-section__body--muted">No one assigned</div>' +
    '</div>' +
    '<div class="sidebar-section">' +
      '<div class="sidebar-section__header"><span>Labels</span></div>' +
      '<div class="sidebar-section__body sidebar-section__body--muted">None yet</div>' +
    '</div>' +
    '<div class="sidebar-section sidebar-section--borderless">' +
      '<a href="prs.html" class="link">&larr; Back to pull requests</a>' +
    '</div>';

  /* ----------------------------- tab switching ----------------------------- */
  var tabs = document.querySelectorAll(".pr-tabs__item");
  var panels = document.querySelectorAll("[data-panel]");
  function activate(name) {
    tabs.forEach(function (t) { t.classList.toggle("pr-tabs__item--active", t.dataset.tab === name); });
    panels.forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== name; });
  }
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function (e) { e.preventDefault(); activate(tab.dataset.tab); });
  });
})();
