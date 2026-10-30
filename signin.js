/* =========================================================================
   Sign-in page logic.
   US-1.1: username + password + Sign in; on success record the session.
   US-1.2: validation — empty field names the field, password < 8 chars
           shows "Password must be at least 8 characters", messages sit next
           to the field, and the typed username is kept.
   US-1.3: on success redirect straight to the PR list (no extra clicks).
   ========================================================================= */
(function () {
  "use strict";

  // If already signed in, skip straight to the PR list.
  if (window.Auth && Auth.isSignedIn()) {
    window.location.replace("prs.html");
    return;
  }

  var form = document.getElementById("signin-form");
  var usernameEl = document.getElementById("username");
  var passwordEl = document.getElementById("password");
  var usernameErr = document.getElementById("username-error");
  var passwordErr = document.getElementById("password-error");
  var banner = document.getElementById("signin-banner");

  function showError(inputEl, errEl, message) {
    errEl.textContent = message;
    errEl.hidden = false;
    inputEl.classList.add("field__input--error");
  }
  function clearError(inputEl, errEl) {
    errEl.textContent = "";
    errEl.hidden = true;
    inputEl.classList.remove("field__input--error");
  }
  // GitHub-style red banner above the form (used for "Incorrect username or password").
  function showBanner(message) {
    banner.textContent = message;
    banner.hidden = false;
  }
  function clearBanner() {
    banner.textContent = "";
    banner.hidden = true;
  }

  // Clear errors as soon as the user edits a field.
  usernameEl.addEventListener("input", function () { clearError(usernameEl, usernameErr); clearBanner(); });
  passwordEl.addEventListener("input", function () { clearError(passwordEl, passwordErr); clearBanner(); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearError(usernameEl, usernameErr);
    clearError(passwordEl, passwordErr);
    clearBanner();

    var username = usernameEl.value.trim();
    var password = passwordEl.value;          // US-1.2: username is preserved (never cleared)
    var ok = true;

    // US-1.2: empty field names the missing field (field-level validation first).
    if (!username) { showError(usernameEl, usernameErr, "Username or email address is required"); ok = false; }
    if (!password) {
      showError(passwordEl, passwordErr, "Password is required"); ok = false;
    } else if (password.length < 8) {
      // US-1.2: exact required wording for the client-side length rule.
      showError(passwordEl, passwordErr, "Password must be at least 8 characters"); ok = false;
    }
    if (!ok) return;

    // Credential check against known users.
    var data = window.APP_DATA || { users: [] };
    var byName = data.users.filter(function (u) { return u.username === username; })[0];

    if (!byName) {
      // Username not found. Real GitHub does not reveal which field is wrong
      // (anti username-enumeration); it shows one banner: "Incorrect username or password."
      showBanner("Incorrect username or password.");
      return;
    }
    if (byName.password !== password) {
      // Valid username, wrong password — you asked for a clear "Invalid password."
      showError(passwordEl, passwordErr, "Invalid password.");
      return;
    }
    var user = byName;

    // US-1.1 + US-1.3: record session and go straight to the PR list.
    Auth.signIn(user.username, user.name);
    window.location.href = "prs.html";
  });
})();
