/* =========================================================================
   Shared UI helpers used by the PR list and PR detail pages.
   - renderHeader(): injects the global header and shows the signed-in
     username (US-1.1 "username shown at the top of the page") + Sign out.
   - statusBadge(): the Open / Merged / Closed labelled badge (US-2.1).
   - escapeHtml(), renderMarkdown(): safe text rendering.
   ========================================================================= */
window.Common = (function () {
  "use strict";

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ------------------------------ Avatars ------------------------------
     Generates a self-contained SVG data-URI avatar (initials on a colour
     derived from the username) so profile pictures render with no external
     image dependency. */
  var AVATAR_COLORS = ["#1f6feb", "#8957e5", "#2ea043", "#bf8700", "#db61a2", "#0969da"];

  function avatarColor(name) {
    var h = 0;
    for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return AVATAR_COLORS[h % AVATAR_COLORS.length];
  }

  function initials(name) {
    var parts = String(name).trim().split(/[\s._-]+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /* Returns a data: URI for an SVG avatar. */
  function avatarUri(name) {
    var bg = avatarColor(name);
    var txt = initials(name);
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">' +
      '<rect width="64" height="64" rx="32" fill="' + bg + '"/>' +
      '<text x="32" y="33" font-family="-apple-system,Segoe UI,Helvetica,Arial,sans-serif" ' +
      'font-size="26" font-weight="600" fill="#ffffff" text-anchor="middle" ' +
      'dominant-baseline="central">' + txt + '</text></svg>';
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  /* Returns an <img> avatar element markup for a username, with the display
     name used for initials when available in APP_DATA. */
  function avatar(username, sizeClass) {
    var data = window.APP_DATA || { users: [] };
    var u = (data.users || []).filter(function (x) { return x.username === username; })[0];
    var displayName = u ? u.name : username;
    var cls = "gh-avatar" + (sizeClass ? " " + sizeClass : "");
    return '<img class="' + cls + '" src="' + avatarUri(displayName) + '" alt="' +
      escapeHtml(username) + '" />';
  }

  /* Minimal, safe markdown parser (line-based so headings, lists and
     paragraphs render independently like GitHub does). Escapes first, then
     applies inline code and bold. Preserves paragraphs/line breaks (US-2.2).
     Only text explicitly marked with ## / ### / ** becomes a heading/bold;
     normal prose stays regular weight. */
  function renderMarkdown(src) {
    var lines = escapeHtml(src).split(/\n/);
    var out = [];
    var para = [];     // buffer for consecutive plain-text lines
    var list = [];     // buffer for consecutive list items

    function inline(text) {
      return text
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    }
    function flushPara() {
      if (para.length) { out.push("<p>" + para.map(inline).join("<br>") + "</p>"); para = []; }
    }
    function flushList() {
      if (list.length) {
        out.push("<ul>" + list.map(function (i) { return "<li>" + inline(i) + "</li>"; }).join("") + "</ul>");
        list = [];
      }
    }

    lines.forEach(function (line) {
      if (/^### /.test(line)) { flushPara(); flushList(); out.push("<h3>" + inline(line.slice(4)) + "</h3>"); }
      else if (/^## /.test(line)) { flushPara(); flushList(); out.push("<h2>" + inline(line.slice(3)) + "</h2>"); }
      else if (/^- /.test(line)) { flushPara(); list.push(line.slice(2)); }
      else if (line.trim() === "") { flushPara(); flushList(); }
      else { flushList(); para.push(line); }
    });
    flushPara(); flushList();
    return out.join("");
  }

  var STATUS = {
    open:   { label: "Open",   cls: "state-badge--open" },
    merged: { label: "Merged", cls: "state-badge--merged" },
    closed: { label: "Closed", cls: "state-badge--closed" }
  };

  function statusIcon(status) {
    if (status === "merged") {
      return '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218Z"/></svg>';
    }
    if (status === "closed") {
      return '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.25 1A2.25 2.25 0 0 1 4 5.372v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.251 2.251 0 0 1 3.25 1Zm9.5 5.75a.75.75 0 0 1 .75.75v2.378a2.251 2.251 0 1 1-1.5 0V7.5a.75.75 0 0 1 .75-.75Zm-2.03-5.273a.75.75 0 0 1 1.06 0l.97.97.97-.97a.749.749 0 0 1 1.06 1.06l-.97.97.97.97a.749.749 0 0 1-1.06 1.06l-.97-.97-.97.97a.749.749 0 0 1-1.06-1.06l.97-.97-.97-.97a.75.75 0 0 1 0-1.06Z"/></svg>';
    }
    return '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354Z"/></svg>';
  }

  function statusBadge(status) {
    var s = STATUS[status] || STATUS.open;
    return '<span class="state-badge ' + s.cls + '">' + statusIcon(status) + " " + s.label + "</span>";
  }

  /* Build the global header into `mount`, showing the signed-in user. */
  function renderHeader(mount) {
    var user = window.Auth ? Auth.currentUser() : null;
    var name = user ? escapeHtml(user.username) : "";
    mount.innerHTML =
      '<div class="gh-header__left">' +
        '<a class="gh-header__logo" href="prs.html" aria-label="Homepage">' +
          '<svg height="32" viewBox="0 0 16 16" width="32" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>' +
        '</a>' +
        '<nav class="gh-breadcrumb" aria-label="Repository">' +
          '<a href="prs.html" class="gh-breadcrumb__owner">agile-team-2</a>' +
          '<span class="gh-breadcrumb__sep">/</span>' +
          '<a href="prs.html" class="gh-breadcrumb__repo">github-pr-review</a>' +
        '</nav>' +
      '</div>' +
      '<div class="gh-header__right">' +
        '<div class="gh-search">' +
          '<svg class="gh-search__icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/></svg>' +
          '<input type="text" class="gh-search__input" placeholder="Type / to search" aria-label="Search" />' +
        '</div>' +
        (user
          ? '<span class="gh-header__user" title="Signed in">' +
              avatar(user.username, "gh-avatar--sm") +
              '<span class="gh-header__username">' + name + '</span>' +
            '</span>' +
            '<button class="btn btn--sm" id="signout-btn">Sign out</button>'
          : '<a class="btn btn--sm" href="signin.html">Sign in</a>'
        ) +
      '</div>';

    var out = document.getElementById("signout-btn");
    if (out) {
      out.addEventListener("click", function () {
        Auth.signOut();
        window.location.href = "signin.html";
      });
    }
  }

  return {
    escapeHtml: escapeHtml, renderMarkdown: renderMarkdown,
    statusBadge: statusBadge, renderHeader: renderHeader,
    avatar: avatar, avatarUri: avatarUri
  };
})();
