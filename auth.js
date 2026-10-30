/* =========================================================================
   Shared auth helpers (prototype — session kept in sessionStorage).
   Covers the auth parts of US-1.1, US-1.3.
   ========================================================================= */
window.Auth = (function () {
  "use strict";
  var KEY = "gh_pr_prototype_user";

  function signIn(username, name) {
    sessionStorage.setItem(KEY, JSON.stringify({ username: username, name: name }));
  }
  function signOut() {
    sessionStorage.removeItem(KEY);
  }
  function currentUser() {
    try { return JSON.parse(sessionStorage.getItem(KEY)); }
    catch (e) { return null; }
  }
  function isSignedIn() {
    return !!currentUser();
  }
  /* US-1.3: pages that require auth call this; it redirects to sign-in. */
  function requireAuth(redirect) {
    if (!isSignedIn()) {
      window.location.href = redirect || "signin.html";
      return false;
    }
    return true;
  }

  return {
    signIn: signIn, signOut: signOut, currentUser: currentUser,
    isSignedIn: isSignedIn, requireAuth: requireAuth
  };
})();
