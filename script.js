/* =========================================================================
   GitHub PR Review page — frontend interactions
   Kept dependency-free. Progressive enhancement only.
   ========================================================================= */
(function () {
  "use strict";

  /* ---- Comment form: Write / Preview tabs + submit enable + preview ---- */
  var form = document.querySelector(".comment-form");
  if (form) {
    var tabs = form.querySelectorAll(".comment-form__tab");
    var writePane = form.querySelector('[data-pane="write"]');
    var previewPane = form.querySelector('[data-pane="preview"]');
    var textarea = form.querySelector(".comment-form__textarea");
    var submit = form.querySelector(".comment-form__submit");

    function activateTab(name) {
      tabs.forEach(function (t) {
        t.classList.toggle("comment-form__tab--active", t.dataset.tab === name);
      });
      var isWrite = name === "write";
      if (writePane) writePane.hidden = !isWrite;
      if (previewPane) previewPane.hidden = isWrite;
      if (!isWrite) renderPreview();
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () { activateTab(tab.dataset.tab); });
    });

    // Enable Comment button only when there is text.
    if (textarea && submit) {
      textarea.addEventListener("input", function () {
        submit.disabled = textarea.value.trim().length === 0;
      });
    }

    // Minimal, safe markdown preview (escapes HTML first).
    function renderPreview() {
      if (!previewPane || !textarea) return;
      var raw = textarea.value.trim();
      if (!raw) {
        previewPane.innerHTML = '<p class="comment-form__preview-empty">Nothing to preview</p>';
        return;
      }
      previewPane.innerHTML = miniMarkdown(raw);
    }

    function escapeHtml(s) {
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;")
              .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function miniMarkdown(src) {
      var html = escapeHtml(src);
      // inline code
      html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
      // bold + italic
      html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
      // headings
      html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>");
      html = html.replace(/^## (.*)$/gm, "<h2>$1</h2>");
      // paragraphs
      return html.split(/\n{2,}/).map(function (block) {
        if (/^<h[23]>/.test(block)) return block;
        return "<p>" + block.replace(/\n/g, "<br>") + "</p>";
      }).join("");
    }
  }

  /* ---- Toolbar buttons wrap simple markdown around selection ---- */
  var wrapMap = {
    "Bold": ["**", "**"], "Italic": ["_", "_"], "Code": ["`", "`"],
    "Quote": ["> ", ""], "Heading": ["### ", ""], "Link": ["[", "](url)"],
    "Numbered list": ["1. ", ""], "Bulleted list": ["- ", ""], "Task list": ["- [ ] ", ""]
  };
  document.querySelectorAll(".md-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var ta = document.querySelector(".comment-form__textarea");
      if (!ta) return;
      var pair = wrapMap[btn.getAttribute("aria-label")];
      if (!pair) return;
      var start = ta.selectionStart, end = ta.selectionEnd;
      var sel = ta.value.slice(start, end);
      ta.value = ta.value.slice(0, start) + pair[0] + sel + pair[1] + ta.value.slice(end);
      ta.focus();
      ta.selectionStart = start + pair[0].length;
      ta.selectionEnd = end + pair[0].length;
      ta.dispatchEvent(new Event("input"));
    });
  });

  /* ---- Copy branch name to clipboard ---- */
  var copyBtn = document.querySelector(".pr-header__copy");
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText("s1/fr-1-data-foundation").then(function () {
        copyBtn.setAttribute("aria-label", "Copied!");
        setTimeout(function () { copyBtn.setAttribute("aria-label", "Copy branch name"); }, 1500);
      });
    });
  }

  /* ---- "/" focuses the global search, matching GitHub ---- */
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && !/^(input|textarea)$/i.test(document.activeElement.tagName)) {
      var search = document.querySelector(".gh-search__input");
      if (search) { e.preventDefault(); search.focus(); }
    }
  });
})();
