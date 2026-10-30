/* =========================================================================
   Pull request list page.
   US-1.3: auth-guard (redirect to sign-in if not signed in); show only the
           pull requests that list the signed-in user as a reviewer.
   US-2.1: each row shows title, author, branches and a status badge.
   ========================================================================= */
(function () {
  "use strict";

  // US-1.3: opening this page without signing in returns the user to sign-in.
  if (!window.Auth || !Auth.requireAuth("signin.html")) return;

  Common.renderHeader(document.getElementById("app-header"));

  var user = Auth.currentUser();
  var data = window.APP_DATA || { pullRequests: [] };

  // US-1.3: only PRs that list the signed-in user as a reviewer.
  var mine = data.pullRequests.filter(function (pr) {
    return Array.isArray(pr.reviewers) && pr.reviewers.indexOf(user.username) !== -1;
  });

  var subtitle = document.getElementById("prlist-subtitle");
  subtitle.textContent = "Signed in as " + user.username +
    " · " + mine.length + " pull request" + (mine.length === 1 ? "" : "s") + " waiting for your review";

  var list = document.getElementById("prlist-items");
  var empty = document.getElementById("prlist-empty");

  if (mine.length === 0) {
    empty.hidden = false;
    return;
  }

  list.innerHTML = mine.map(function (pr) {
    return '' +
      '<li class="prlist__row">' +
        '<span class="prlist__icon">' + statusMiniIcon(pr.status) + '</span>' +
        '<div class="prlist__main">' +
          '<a class="prlist__link" href="pr.html?id=' + pr.id + '">' +
            Common.escapeHtml(pr.title) +
          '</a> ' +
          Common.statusBadge(pr.status) +
          '<div class="prlist__meta">' +
            '#' + pr.id + ' opened ' + Common.escapeHtml(pr.createdAt) +
            ' by <span class="link-user">' + Common.escapeHtml(pr.author) + '</span>' +
            ' · <span class="branch-ref">' + Common.escapeHtml(pr.sourceBranch) + '</span>' +
            ' &rarr; <span class="branch-ref">' + Common.escapeHtml(pr.targetBranch) + '</span>' +
          '</div>' +
        '</div>' +
      '</li>';
  }).join("");

  function statusMiniIcon(status) {
    var color = status === "merged" ? "var(--done-fg)"
              : status === "closed" ? "var(--danger-fg)"
              : "var(--success-fg)";
    return '<span style="color:' + color + '">' +
      '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354Z"/></svg></span>';
  }
})();
