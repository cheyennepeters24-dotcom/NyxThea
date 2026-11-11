(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __copyProps = (to, from, except, desc2) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const esc = (v) => String(v != null ? v : "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  let credential = null;
  let settingsAuthToken = null;
  let sessionRestoreError = null;
  let conversationHistory = [];
  let conversationEpoch = 0;
  let chatControllers = /* @__PURE__ */ new Set();
  try {
    localStorage.removeItem("nyxtheaCredential");
  } catch (e) {
  }
  const modal = $("#modal");
  const title = $("#modalTitle");
  const body = $("#modalBody");
  const input = $("#input");
  const rose = $("#livingRose");
  const mic = $("#mic");
  let guideSession = null;
  let guideStream = null;
  let guideTimer = null;
  let guideRecognition = null;
  let guideTranscript = "";
  let guideBusy = false;
  let guideToken = 0;
  let guidePending = [];
  let guideResumeHandsFree = false;
  function session() {
    let ok = !!credential, s = $("#sideStatus");
    s.classList.toggle("unlocked", ok);
    s.lastElementChild.textContent = ok ? "Signed in as " + credential.displayName : "Session locked";
    $("#unlock").lastElementChild.textContent = ok ? credential.displayName : "Private profile";
  }
  async function api(path, o = {}) {
    const method = String(o.method || "GET").toUpperCase(), sensitiveSettingsRequest = ["/api/settings/change-password", "/api/recovery/email/start", "/api/recovery/email/confirm", "/api/household/member-identity", "/api/profile-lock/pin"].includes(path) || path === "/api/profile-lock/biometric" && (method === "POST" || method === "DELETE") || /^\/api\/devices\/[^/]+\/trust$/.test(path) || path === "/api/profile-lock" && method === "DELETE";
    const timeoutMs = Number(o.timeoutMs) || (path.startsWith("/api/voice/") || path.startsWith("/api/live-guide") ? 7e3 : 12e3), controller = new AbortController(), external = o.signal;
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    if (external) {
      if (external.aborted) controller.abort();
      else external.addEventListener("abort", () => controller.abort(), { once: true });
    }
    const _a = o, { timeoutMs: _timeout, signal: _signal, settingsAuth = false } = _a, rest = __objRest(_a, ["timeoutMs", "signal", "settingsAuth"]);
    try {
      const r = await fetch(path, __spreadProps(__spreadValues({}, rest), { signal: controller.signal, credentials: "same-origin", headers: __spreadValues(__spreadValues({ "content-type": "application/json", "x-nyxthea-device": nyxDeviceId() }, settingsAuth && settingsAuthToken ? { "x-nyxthea-settings-auth": settingsAuthToken } : {}), o.headers || {}) }));
      const d = await r.json().catch(() => ({ error: "Unreadable response." }));
      if (!r.ok) {
        let e = Error(d.error || "Request failed");
        e.status = r.status;
        throw e;
      }
      if (sensitiveSettingsRequest) settingsAuthToken = null;
      return d;
    } catch (e) {
      if (timedOut) {
        const err = Error("Nyx took too long to respond. Try that again.");
        err.status = 504;
        throw err;
      }
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }
  async function nyxMediaRequest(promise, ms = 7e3, label = "Media permission timed out.") {
    let expired = false;
    try {
      return await nyxTimed(promise, ms, label);
    } catch (e) {
      expired = true;
      Promise.resolve(promise).then((stream) => {
        var _a;
        try {
          (_a = stream == null ? void 0 : stream.getTracks) == null ? void 0 : _a.call(stream).forEach((t) => t.stop());
        } catch (e2) {
        }
      }).catch(() => {
      });
      throw e;
    }
  }
  let nyxSessionDeviceId = null;
  function nyxDeviceId() {
    if (nyxSessionDeviceId) return nyxSessionDeviceId;
    try {
      nyxSessionDeviceId = localStorage.getItem("nyxtheaDeviceId");
    } catch (e) {
    }
    if (!nyxSessionDeviceId) {
      nyxSessionDeviceId = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
      try {
        localStorage.setItem("nyxtheaDeviceId", nyxSessionDeviceId);
      } catch (e) {
      }
    }
    return nyxSessionDeviceId;
  }
  async function registerThisDevice() {
    if (!credential) return;
    try {
      await api("/api/devices/register", { method: "POST", timeoutMs: 6e3, body: JSON.stringify({ deviceId: nyxDeviceId(), label: navigator.platform || "This device", platform: navigator.platform || null }) });
    } catch (e) {
    }
  }
  async function restoreSession() {
    try {
      let d = await api("/api/auth/session", { timeoutMs: 6e3 });
      sessionRestoreError = null;
      credential = d.profile;
      session();
      if (credential) void registerThisDevice();
      return !!credential;
    } catch (e) {
      sessionRestoreError = e;
      credential = null;
      session();
      return false;
    }
  }
  async function loadConversationHistory() {
    if (!credential) {
      conversationHistory = [];
      return conversationHistory;
    }
    try {
      const d = await api("/api/conversation/recent", { timeoutMs: 6e3 });
      conversationHistory = Array.isArray(d.conversation) ? d.conversation : [];
    } catch (e) {
      conversationHistory = [];
    }
    return conversationHistory;
  }
  function conversationMarkup() {
    return conversationHistory.slice(-12).map((turn) => '<div class="msg '.concat(turn.role === "assistant" ? "assistant" : "user", '">').concat(esc(turn.text), "</div>")).join("");
  }
  function invalidateConversationRequests() {
    conversationEpoch++;
    for (const controller of chatControllers) {
      try {
        controller.abort();
      } catch (e) {
      }
    }
    chatControllers.clear();
  }
  function panel(t, h) {
    title.textContent = t;
    body.innerHTML = h;
    modal.classList.add("open");
    $("#close").focus();
  }
  function shut() {
    if (guideSession) endLiveGuide(false);
    modal.classList.remove("open");
    input.focus();
  }
  $("#close").onclick = shut;
  modal.onclick = (e) => {
    if (e.target === modal) shut();
  };
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") shut();
  });
  async function showSessionRestoreRetry(error = sessionRestoreError) {
    panel("I couldn\u2019t verify your session", '<p>Your profile may still be signed in. I won\u2019t make you log in again just because the connection check failed.</p><button id="retrySessionRestore" class="primary">Try again</button><button id="useAnotherProfile" class="secondary">Use another profile</button><p id="sessionRestoreNote" class="small">'.concat(esc((error == null ? void 0 : error.message) || "Session check failed."), "</p>"));
    $("#retrySessionRestore").onclick = async () => {
      const note = $("#sessionRestoreNote");
      note.textContent = "Checking\u2026";
      await restoreSession();
      if (sessionRestoreError) {
        note.textContent = sessionRestoreError.message || "Session check failed.";
        return;
      }
      if (!credential) {
        unlock();
        return;
      }
      await NYXExperience.load();
      await loadConversationHistory();
      const unlocked = await enforceProfileLock();
      if (!unlocked) return;
      shut();
      if (NYXExperience.needsOnboarding()) NYXExperience.onboard();
      else if (NYXExperience.voiceSessionEnabled()) NYXExperience.startVoiceSession();
    };
    $("#useAnotherProfile").onclick = () => {
      sessionRestoreError = null;
      unlock();
    };
  }
  function unlock(mode = "login") {
    const signup = mode === "register";
    panel(signup ? "Meet NyxThea" : "Welcome back", "<p>".concat(signup ? "Create your private profile to start talking with NyxThea." : "Sign in to continue your conversation.", '</p><form id="authForm"><input id="authUser" class="field" name="username" autocomplete="username" required minlength="3" maxlength="32" placeholder="Username">').concat(signup ? '<input id="authName" class="field" name="name" autocomplete="name" required maxlength="80" placeholder="What should NyxThea call you?">' : "", '<input id="authPass" class="field" name="password" type="password" autocomplete="').concat(signup ? "new-password" : "current-password", '" required minlength="12" placeholder="Password (at least 12 characters)"><button class="primary" type="submit">').concat(signup ? "Create my profile" : "Sign in", '</button></form><button id="switchAuth" class="secondary">').concat(signup ? "I already have an account" : "Create an account", "</button>").concat(signup ? "" : '<button id="claimAuth" class="secondary">I have a household invite</button><button id="recoverAuth" class="secondary">Use my recovery code</button>', '<p id="authNote" class="small" role="status"></p>'));
    $("#switchAuth").onclick = () => unlock(signup ? "login" : "register");
    if (!signup) {
      $("#claimAuth").onclick = claimHouseholdProfile;
      $("#recoverAuth").onclick = recover;
    }
    $("#authForm").onsubmit = async (e) => {
      var _a;
      e.preventDefault();
      let note = $("#authNote");
      note.textContent = "One moment\u2026";
      try {
        let d = await api(signup ? "/api/auth/register" : "/api/auth/login", { method: "POST", body: JSON.stringify(__spreadValues({ username: $("#authUser").value, password: $("#authPass").value }, signup ? { displayName: $("#authName").value } : {})) });
        credential = d.profile;
        session();
        void registerThisDevice();
        await NYXExperience.load();
        await loadConversationHistory();
        if (signup) {
          showRecoveryCode(d.recoveryCode, () => NYXExperience.onboard());
          return;
        }
        shut();
        if (!((_a = NYXExperience.settings) == null ? void 0 : _a.onboarded)) NYXExperience.onboard();
      } catch (err) {
        note.textContent = err.message;
      }
    };
  }
  function showRecoveryCode(code, next) {
    panel("Save your recovery code", '<p>This code is shown once. Save it somewhere private; you can use it if you forget your password.</p><div class="item" style="overflow-wrap:anywhere"><strong id="recoveryCode">'.concat(esc(code), '</strong></div><button id="copyRecovery" class="secondary">Copy code</button><button id="savedRecovery" class="primary">I saved it</button>'));
    $("#copyRecovery").onclick = () => {
      var _a;
      return (_a = navigator.clipboard) == null ? void 0 : _a.writeText(code);
    };
    $("#savedRecovery").onclick = next;
  }
  function claimHouseholdProfile() {
    panel("Join your NyxThea profile", '<p>Use the one-time household invite code from the person who introduced you to NyxThea. This attaches this device to the profile Nyx already created for you.</p><form id="claimForm"><input id="claimCode" class="field" required placeholder="Household invite code"><input id="claimUser" class="field" autocomplete="username" required placeholder="Choose a username"><input id="claimPassword" class="field" type="password" autocomplete="new-password" required minlength="12" placeholder="Choose a password (at least 12 characters)"><button class="primary" type="submit">Claim my profile</button></form><p id="claimNote" class="small" role="status"></p>');
    $("#claimForm").onsubmit = async (e) => {
      e.preventDefault();
      let note = $("#claimNote");
      note.textContent = "Connecting your profile\u2026";
      try {
        let d = await api("/api/auth/claim", { method: "POST", body: JSON.stringify({ inviteCode: $("#claimCode").value.trim(), username: $("#claimUser").value, password: $("#claimPassword").value }) });
        credential = d.profile;
        session();
        void registerThisDevice();
        await NYXExperience.load();
        await loadConversationHistory();
        showRecoveryCode(d.recoveryCode, () => {
          var _a;
          shut();
          if (!((_a = NYXExperience.settings) == null ? void 0 : _a.onboarded)) NYXExperience.onboard();
        });
      } catch (err) {
        note.textContent = err.message;
      }
    };
  }
  function recover() {
    panel("Recover your account", '<p>Use your saved recovery code, or send a code to your verified recovery email.</p><input id="recoverUser" class="field" autocomplete="username" required placeholder="Username"><div class="item"><strong>Recovery code</strong><input id="recoverCode" class="field" placeholder="Saved recovery code"><input id="recoverPassword" class="field" type="password" autocomplete="new-password" minlength="12" placeholder="New password (at least 12 characters)"><button id="recoverWithCode" class="primary">Reset with recovery code</button></div><div class="item"><strong>Recovery email</strong><button id="sendRecoveryEmail" class="secondary">Email me a 6-digit code</button><input id="emailRecoveryCode" class="field" inputmode="numeric" maxlength="6" placeholder="6-digit email code"><input id="emailRecoveryPassword" class="field" type="password" autocomplete="new-password" minlength="12" placeholder="New password (at least 12 characters)"><button id="recoverWithEmail" class="secondary">Reset with email code</button></div><p id="recoveryNote" class="small" role="status"></p>');
    $("#recoverWithCode").onclick = async () => {
      try {
        let d = await api("/api/auth/recover", { method: "POST", body: JSON.stringify({ username: $("#recoverUser").value, recoveryCode: $("#recoverCode").value, newPassword: $("#recoverPassword").value }) });
        credential = d.profile;
        session();
        await NYXExperience.load();
        await loadConversationHistory();
        showRecoveryCode(d.recoveryCode, () => {
          var _a;
          shut();
          if (!((_a = NYXExperience.settings) == null ? void 0 : _a.onboarded)) NYXExperience.onboard();
        });
      } catch (err) {
        $("#recoveryNote").textContent = err.message;
      }
    };
    $("#sendRecoveryEmail").onclick = async () => {
      let note = $("#recoveryNote");
      try {
        let d = await api("/api/auth/recover-email/start", { method: "POST", body: JSON.stringify({ username: $("#recoverUser").value }) });
        note.textContent = "If that account has a verified recovery email, a 6-digit code has been sent.";
      } catch (err) {
        note.textContent = err.message;
      }
    };
    $("#recoverWithEmail").onclick = async () => {
      try {
        let d = await api("/api/auth/recover-email/complete", { method: "POST", body: JSON.stringify({ username: $("#recoverUser").value, code: $("#emailRecoveryCode").value, newPassword: $("#emailRecoveryPassword").value }) });
        credential = d.profile;
        session();
        await NYXExperience.load();
        await loadConversationHistory();
        showRecoveryCode(d.recoveryCode, () => shut());
      } catch (err) {
        $("#recoveryNote").textContent = err.message;
      }
    };
  }
  $("#unlock").onclick = () => credential ? openSettingsVerified() : unlock();
  async function signOut() {
    invalidateConversationRequests();
    NYXExperience.stopOnboardingStream();
    NYXHandsFree.stop();
    NYXVoice.stop();
    try {
      await api("/api/auth/logout", { method: "POST", timeoutMs: 4e3, body: "{}" });
    } catch (e) {
    } finally {
      credential = null;
      conversationHistory = [];
      NYXExperience.settings = null;
      settingsAuthToken = null;
      session();
      shut();
      unlock();
    }
  }
  function setVoiceSpeaker(profileId, name) {
    NYXHandsFree.speakerProfileId = profileId || null;
    NYXHandsFree.speakerName = name || null;
    state(NYXHandsFree.active ? "listening" : "ready", profileId && name ? "Talking with " + name : "Talking with " + ((credential == null ? void 0 : credential.displayName) || "you"));
  }
  async function chooseHouseholdSpeaker() {
    var _a;
    try {
      const d = await api("/api/household/identity"), members = ((_a = d.household) == null ? void 0 : _a.members) || [];
      const buttons = members.map((m) => {
        var _a2;
        const name = ((_a2 = m.identity) == null ? void 0 : _a2.preferredName) || (m.profileId === credential.id ? credential.displayName : m.profileId);
        return '<button class="secondary household-speaker" data-speaker-id="'.concat(esc(m.profileId), '" data-speaker-name="').concat(esc(name), '">').concat(esc(name)).concat(m.profileId === credential.id ? " \u2014 me" : "", "</button>");
      }).join("");
      panel("Who\u2019s talking?", "<p>Choose who is speaking on this device. Nyx uses that person\u2019s age/child-safety rules for voice without exposing another profile\u2019s private memory.</p>".concat(buttons, '<button id="newHouseholdSpeaker" class="primary">Meet someone new</button>'));
      $$(".household-speaker").forEach((btn) => btn.onclick = () => {
        setVoiceSpeaker(btn.dataset.speakerId, btn.dataset.speakerName);
        shut();
      });
      $("#newHouseholdSpeaker").onclick = meetSomeoneNew;
    } catch (e) {
      panel("Who\u2019s talking?", "<p>".concat(esc(e.message), "</p>"));
    }
  }
  function meetSomeoneNew() {
    panel("NyxThea is meeting someone new", '<p>Create their household profile, then Nyx can hand the voice session to them on this device.</p><input id="newPersonName" class="field" maxlength="80" placeholder="What should I call you?"><input id="newPersonPron" class="field" maxlength="120" placeholder="How is your name pronounced? (optional)"><input id="newPersonBirthday" class="field" type="date"><input id="newPersonRelation" class="field" maxlength="48" placeholder="Relationship to me \u2014 e.g. spouse, daughter, son"><button id="createNewPerson" class="primary">Nice to meet you</button><p id="newPersonNote" class="small"></p>');
    $("#createNewPerson").onclick = async () => {
      var _a, _b, _c;
      const note = $("#newPersonNote");
      try {
        const payload = { displayName: $("#newPersonName").value.trim(), pronunciation: $("#newPersonPron").value.trim() || void 0, birthday: $("#newPersonBirthday").value || void 0, relationshipToRequester: $("#newPersonRelation").value.trim() || void 0 };
        const d = await api("/api/household/meet", { method: "POST", body: JSON.stringify(payload) });
        const name = ((_a = d.identity) == null ? void 0 : _a.pronunciation) || ((_b = d.identity) == null ? void 0 : _b.preferredName) || d.profile.displayName;
        setVoiceSpeaker(d.profile.id, ((_c = d.identity) == null ? void 0 : _c.preferredName) || d.profile.displayName);
        note.innerHTML = "Profile created for " + esc(d.profile.displayName) + '. Voice is now handed to them on this device.<br><strong>Household invite code:</strong> <span style="overflow-wrap:anywhere">' + esc(d.claimCode) + '</span><br><span class="small">They can use that code later to claim the same profile on their own device.</span>';
        void NYXVoice.say("Nice to meet you, " + name + ". You can talk to me now.");
      } catch (e) {
        note.textContent = e.message;
      }
    };
  }
  async function profileLockState() {
    try {
      return await api("/api/profile-lock?deviceId=" + encodeURIComponent(nyxDeviceId()), { timeoutMs: 6e3 });
    } catch (e) {
      if (e.status === 403) return null;
      throw e;
    }
  }
  function bytesToB64url(bytes) {
    return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function b64urlToBytes(value) {
    const b64 = String(value).replace(/-/g, "+").replace(/_/g, "/") + "===".slice((String(value).length + 3) % 4);
    const raw = atob(b64);
    return Uint8Array.from(raw, (c) => c.charCodeAt(0));
  }
  async function setupDeviceBiometric() {
    var _a, _b, _c, _d;
    const note = $("#profileLockNote") || $("#securityNote");
    if (!note) return;
    if (!window.PublicKeyCredential || !navigator.credentials) {
      note.textContent = "This browser does not support device biometric/passkey unlock.";
      return;
    }
    try {
      const begin = await api("/api/profile-lock/biometric/begin", { method: "POST", body: JSON.stringify({ deviceId: nyxDeviceId(), purpose: "register" }) }), userId = new TextEncoder().encode(credential.id.slice(0, 64));
      const created = await navigator.credentials.create({ publicKey: { challenge: b64urlToBytes(begin.challenge), rp: { name: "NyxThea" }, user: { id: userId, name: credential.displayName || "NyxThea user", displayName: credential.displayName || "NyxThea user" }, pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }], authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required", residentKey: "discouraged" }, timeout: 6e4, attestation: "none" } });
      if (!created) throw Error("Device biometric setup was cancelled.");
      const publicKey = (_b = (_a = created.response).getPublicKey) == null ? void 0 : _b.call(_a), algorithm = (_d = (_c = created.response).getPublicKeyAlgorithm) == null ? void 0 : _d.call(_c);
      if (!publicKey || !algorithm) throw Error("This browser cannot register a secure device passkey for NyxThea yet.");
      await api("/api/profile-lock/biometric", { method: "POST", settingsAuth: true, body: JSON.stringify({ deviceId: nyxDeviceId(), credentialId: bytesToB64url(created.rawId), publicKey: bytesToB64url(publicKey), algorithm, label: navigator.platform || "This device", clientDataJSON: bytesToB64url(created.response.clientDataJSON), authenticatorData: bytesToB64url(created.response.getAuthenticatorData()) }) });
      localStorage.setItem("nyxtheaBiometricCredential:" + credential.id, bytesToB64url(created.rawId));
      note.textContent = "Device biometric/passkey unlock is enabled. Nyx stores the public credential only\u2014not your face or fingerprint.";
    } catch (e) {
      note.textContent = e.message || "Could not enable device biometric unlock.";
    }
  }
  async function unlockWithBiometric(purpose = "unlock") {
    var _a;
    const saved = localStorage.getItem("nyxtheaBiometricCredential:" + credential.id);
    if (!saved || !window.PublicKeyCredential || !navigator.credentials) throw Error("Device biometric unlock is not set up here.");
    const begin = await api("/api/profile-lock/biometric/begin", { method: "POST", body: JSON.stringify({ deviceId: nyxDeviceId(), purpose }) });
    const assertion = await navigator.credentials.get({ publicKey: { challenge: b64urlToBytes(begin.challenge), allowCredentials: [{ type: "public-key", id: b64urlToBytes(saved) }], userVerification: "required", timeout: 6e4 } });
    if (!assertion) throw Error("Device biometric unlock was cancelled.");
    const d = await api("/api/profile-lock/biometric/verify", { method: "POST", body: JSON.stringify({ deviceId: nyxDeviceId(), purpose, credentialId: saved, clientDataJSON: bytesToB64url(assertion.response.clientDataJSON), authenticatorData: bytesToB64url(assertion.response.authenticatorData), signature: bytesToB64url(assertion.response.signature) }) });
    if (purpose === "settings" && ((_a = d.authorization) == null ? void 0 : _a.token)) settingsAuthToken = d.authorization.token;
    return d;
  }
  async function openSettingsVerified() {
    var _a;
    if (!credential) {
      unlock();
      return;
    }
    settingsAuthToken = null;
    let lockInfo = null;
    try {
      lockInfo = await profileLockState();
    } catch (e) {
      panel("Settings", "<p>".concat(esc(e.message), "</p>"));
      return;
    }
    const hasPin = Boolean((_a = lockInfo == null ? void 0 : lockInfo.lock) == null ? void 0 : _a.pinEnabled);
    panel("Verify adult access", "<p>".concat(hasPin ? "Use your PIN, account password, or device biometric." : "You haven\u2019t created a PIN yet. Use your account password once, then you can create a PIN or enable Face ID / Touch ID.", "</p>").concat(hasPin ? '<input id="settingsPin" class="field" inputmode="numeric" maxlength="8" placeholder="Adult PIN"><button id="settingsPinBtn" class="primary">Verify with PIN</button>' : "", '<input id="settingsPassword" class="field" type="password" autocomplete="current-password" placeholder="Account password"><button id="settingsPasswordBtn" class="').concat(hasPin ? "secondary" : "primary", '">Continue with account password</button><button id="settingsBioBtn" class="secondary">Use Face ID / Touch ID / device biometric</button><p id="settingsVerifyNote" class="small"></p>'));
    const note = () => $("#settingsVerifyNote");
    if (hasPin) $("#settingsPinBtn").onclick = async () => {
      try {
        const d = await api("/api/settings/verify-pin", { method: "POST", body: JSON.stringify({ pin: $("#settingsPin").value, deviceId: nyxDeviceId() }) });
        settingsAuthToken = d.authorization.token;
        await accountSettings();
      } catch (e) {
        note().textContent = e.message;
      }
    };
    $("#settingsPasswordBtn").onclick = async () => {
      try {
        const d = await api("/api/settings/verify-password", { method: "POST", body: JSON.stringify({ password: $("#settingsPassword").value, deviceId: nyxDeviceId() }) });
        settingsAuthToken = d.authorization.token;
        await accountSettings();
      } catch (e) {
        note().textContent = e.message;
      }
    };
    $("#settingsBioBtn").onclick = async () => {
      try {
        await unlockWithBiometric("settings");
        await accountSettings();
      } catch (e) {
        note().textContent = e.message;
      }
    };
  }
  async function enforceProfileLock() {
    var _a;
    if (!credential) return true;
    let d;
    try {
      d = await profileLockState();
    } catch (e) {
      const host2 = document.getElementById("nyxOnboard"), card2 = document.getElementById("nyxOnboardCard");
      host2.classList.add("show");
      card2.innerHTML = '<h2>I couldn\u2019t verify this profile\u2019s lock state.</h2><p>For privacy, I won\u2019t open the profile until that check succeeds.</p><button id="retryProfileLock" class="primary">Try again</button><button id="lockCheckSignOut" class="secondary">Use a different profile</button><p class="small">' + esc(e.message || "Connection check failed.") + "</p>";
      $("#retryProfileLock").onclick = async () => {
        host2.classList.remove("show");
        const ok = await enforceProfileLock();
        if (ok && NYXExperience.voiceSessionEnabled() && !NYXExperience.needsOnboarding()) setTimeout(() => NYXExperience.startVoiceSession(), 180);
      };
      $("#lockCheckSignOut").onclick = signOut;
      return false;
    }
    if (!((_a = d == null ? void 0 : d.state) == null ? void 0 : _a.enabled) || !d.state.locked) return true;
    const host = document.getElementById("nyxOnboard"), card = document.getElementById("nyxOnboardCard");
    host.classList.add("show");
    card.innerHTML = '<h2>Profile locked.</h2><p>This adult profile is private on this device.</p><input id="unlockProfilePin" class="field" inputmode="numeric" pattern="[0-9]*" maxlength="8" placeholder="PIN"><button id="unlockProfilePinBtn" class="primary">Unlock with PIN</button><button id="unlockProfileBioBtn" class="secondary">Use Face ID / Touch ID / device biometric</button><input id="unlockProfilePassword" class="field" type="password" autocomplete="current-password" placeholder="Forgot PIN? Use account password"><button id="unlockProfilePasswordBtn" class="secondary">Unlock with password</button><button id="lockedSignOut" class="secondary">Use a different profile</button><p id="profileUnlockNote" class="small"></p>';
    $("#unlockProfilePinBtn").onclick = async () => {
      let note = $("#profileUnlockNote");
      try {
        await api("/api/profile-lock/pin/verify", { method: "POST", body: JSON.stringify({ pin: $("#unlockProfilePin").value, deviceId: nyxDeviceId() }) });
        host.classList.remove("show");
        NYXSound.cue("unlock");
        note.textContent = "";
        if (NYXExperience.voiceSessionEnabled() && !NYXExperience.needsOnboarding()) setTimeout(() => NYXExperience.startVoiceSession(), 180);
      } catch (e) {
        note.textContent = e.message;
      }
    };
    $("#unlockProfileBioBtn").onclick = async () => {
      let note = $("#profileUnlockNote");
      try {
        await unlockWithBiometric("unlock");
        host.classList.remove("show");
        if (NYXExperience.voiceSessionEnabled() && !NYXExperience.needsOnboarding()) setTimeout(() => NYXExperience.startVoiceSession(), 180);
      } catch (e) {
        note.textContent = e.message;
      }
    };
    $("#unlockProfilePasswordBtn").onclick = async () => {
      let note = $("#profileUnlockNote");
      try {
        await api("/api/profile-lock/password/verify", { method: "POST", body: JSON.stringify({ password: $("#unlockProfilePassword").value, deviceId: nyxDeviceId() }) });
        host.classList.remove("show");
        if (NYXExperience.voiceSessionEnabled() && !NYXExperience.needsOnboarding()) setTimeout(() => NYXExperience.startVoiceSession(), 180);
      } catch (e) {
        note.textContent = e.message;
      }
    };
    $("#lockedSignOut").onclick = signOut;
    return false;
  }
  const NYX_MODULES = [
    { key: "world", label: "Your World", view: "Your World" },
    { key: "devices", label: "Devices", view: "Devices" },
    { key: "health", label: "Health", view: "Health" },
    { key: "security", label: "Security", view: "Security" },
    { key: "memories", label: "Memories", view: "Memories" },
    { key: "music", label: "Music", view: "Music" },
    { key: "vehicle", label: "Vehicle", view: "Vehicle" },
    { key: "apple_siri_iphone", label: "iPhone / Siri" },
    { key: "amazon_alexa_echo", label: "Alexa / Echo" },
    { key: "google_nest", label: "Google Nest" },
    { key: "smart_home", label: "Smart home" },
    { key: "tv", label: "TV / streaming" },
    { key: "wearable", label: "Wearables" },
    { key: "computer", label: "Computer" },
    { key: "health_data", label: "Health data" },
    { key: "pet_care", label: "Pet care" },
    { key: "emergency_contacts", label: "Emergency contacts" }
  ];
  function applyInterfacePreferences() {
    var _a;
    const selected = new Set(((_a = NYXExperience.settings) == null ? void 0 : _a.visibleModules) || NYX_MODULES.filter((x) => x.view).map((x) => x.key));
    const byView = Object.fromEntries(NYX_MODULES.filter((x) => x.view).map((x) => [x.view, x.key]));
    $$("[data-view]").forEach((el) => {
      const key = byView[el.dataset.view];
      if (key) el.hidden = !selected.has(key);
    });
    renderIntegrationShelf(selected).catch(() => {
    });
  }
  async function renderIntegrationShelf(selected = new Set(((_a) => (_a = NYXExperience.settings) == null ? void 0 : _a.visibleModules)() || [])) {
    const shelf = $("#integrationShelf"), grid = $("#integrationShelfGrid");
    if (!shelf || !grid) return;
    const external = NYX_MODULES.filter((x) => !x.view && selected.has(x.key));
    if (!external.length) {
      shelf.hidden = true;
      grid.innerHTML = "";
      return;
    }
    let states = [];
    try {
      states = (await api("/api/integrations")).integrations || [];
    } catch (e) {
    }
    const byKind = Object.fromEntries(states.map((x) => [x.kind, x]));
    grid.innerHTML = external.map((item) => {
      var _a2, _b, _c;
      const state2 = ((_b = (_a2 = byKind[item.key]) == null ? void 0 : _a2.connection) == null ? void 0 : _b.state) || ((_c = byKind[item.key]) == null ? void 0 : _c.state) || "designed_not_connected";
      const text = state2 === "active_connection" ? "Connected" : state2 === "requires_authorization" ? "Selected \u2014 authorization needed" : "Selected";
      return '<button class="glass integration-card" data-integration="'.concat(esc(item.key), '"><span class="domain-icon">\u2301</span><strong>').concat(esc(item.label), "</strong><small>").concat(esc(text), '</small><span class="card-state">Manage</span></button>');
    }).join("");
    shelf.hidden = false;
    $$("[data-integration]").forEach((btn) => btn.onclick = () => integrationDetail(btn.dataset.integration));
  }
  async function integrationDetail(kind) {
    var _a, _b;
    const item = NYX_MODULES.find((x) => x.key === kind), label = (item == null ? void 0 : item.label) || kind;
    let current = null;
    try {
      current = (_a = (await api("/api/integrations")).integrations) == null ? void 0 : _a.find((x) => x.kind === kind);
    } catch (e) {
    }
    const state2 = ((_b = current == null ? void 0 : current.connection) == null ? void 0 : _b.state) || (current == null ? void 0 : current.state) || "designed_not_connected";
    panel(label, '<p>This module is on your interface.</p><div class="item"><strong>Status</strong><p class="small">'.concat(esc(state2 === "active_connection" ? "Connected and active" : state2 === "requires_authorization" ? "Selected; provider authorization still needs to be completed." : "Available on your interface; no provider connection is active yet."), '</p></div><button id="removeModule" class="secondary">Remove from my interface</button>'));
    $("#removeModule").onclick = async () => {
      var _a2;
      const visible = (((_a2 = NYXExperience.settings) == null ? void 0 : _a2.visibleModules) || []).filter((x) => x !== kind);
      try {
        await NYXExperience.save({ visibleModules: visible });
        applyInterfacePreferences();
        shut();
      } catch (e) {
        panel(label, "<p>".concat(esc(e.message), '</p><button id="removeModuleRetry" class="secondary">Try again</button>'));
        $("#removeModuleRetry").onclick = () => integrationDetail(kind);
      }
    };
  }
  async function ensureSettingsAuthorization(note) {
    if (settingsAuthToken) return true;
    if (note) note.textContent = "Verify adult access again to make this security change.";
    await openSettingsVerified();
    return false;
  }
  async function refreshSettingsAuthorization() {
    var _a;
    settingsAuthToken = null;
    try {
      const lock = await profileLockState();
      if ((_a = lock == null ? void 0 : lock.lock) == null ? void 0 : _a.biometricEnabled) {
        await unlockWithBiometric("settings");
        return true;
      }
    } catch (e) {
    }
    await openSettingsVerified();
    return false;
  }
  async function accountSettings() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    let recovery = null, lockInfo = null;
    const [recoveryResult, lockResult] = await Promise.allSettled([api("/api/recovery/status", { timeoutMs: 6e3 }), profileLockState()]);
    if (recoveryResult.status === "fulfilled") recovery = recoveryResult.value;
    if (lockResult.status === "fulfilled") lockInfo = lockResult.value;
    const selected = new Set(((_a = NYXExperience.settings) == null ? void 0 : _a.visibleModules) || NYX_MODULES.filter((x) => x.view).map((x) => x.key));
    const moduleChoices = NYX_MODULES.map((x) => '<label class="choice"><input type="checkbox" data-module-choice="'.concat(esc(x.key), '" ').concat(selected.has(x.key) ? "checked" : "", "> ").concat(esc(x.label), "</label>")).join("");
    let adminAccess = { householdAdmin: false, systemAdmin: false };
    try {
      adminAccess = await api("/api/admin/access", { timeoutMs: 5e3 });
    } catch (e) {
    }
    const adminButtons = '<div class="item"><strong>Administration</strong><p class="small">Household administration and NyxThea system administration are separate permissions.</p>'.concat(adminAccess.householdAdmin ? '<button id="householdAdminBtn" class="secondary">Household Admin</button>' : "").concat(adminAccess.systemAdmin ? '<button id="systemAdminBtn" class="secondary">System Admin</button>' : "", "</div>");
    panel("Your profile", "<p>Signed in as ".concat(esc(credential.displayName), '.</p><button id="nameSettings" class="primary">Name, birthday and pronunciation</button><button id="meetPerson" class="secondary">Someone new is talking</button><button id="chooseSpeaker" class="secondary">Choose active household speaker</button>').concat(adminButtons, '\n <div class="item"><strong>Security setup</strong><p class="small">').concat(((_b = lockInfo == null ? void 0 : lockInfo.lock) == null ? void 0 : _b.pinEnabled) ? "PIN is set. You can change it here." : "No PIN yet. Create one now, or keep using your account password.", '</p><input id="newProfilePinInline" class="field" inputmode="numeric" pattern="[0-9]{4,8}" minlength="4" maxlength="8" placeholder="4\u20138 digit PIN"><button id="saveProfilePinInline" class="primary">').concat(((_c = lockInfo == null ? void 0 : lockInfo.lock) == null ? void 0 : _c.pinEnabled) ? "Change PIN" : "Create PIN", '</button><button id="enableBiometricInline" class="secondary">Enable Face ID / Touch ID / passkey</button><p id="securityNote" class="small"></p></div>\n <div class="item"><strong>Change account password</strong><input id="currentAccountPassword" class="field" type="password" autocomplete="current-password" placeholder="Current password"><input id="newAccountPassword" class="field" type="password" autocomplete="new-password" placeholder="New password \u2014 at least 12 characters"><button id="changeAccountPassword" class="secondary">Change password</button><p id="passwordNote" class="small"></p></div>\n <div class="item"><strong>Your interface</strong><p class="small">Choose what Nyx puts on your dashboard. A module can be visible even before its external provider is connected.</p><div class="nyx-choice">').concat(moduleChoices, '</div><button id="saveInterfaceModules" class="primary">Save my interface</button><p id="interfaceNote" class="small"></p></div>\n <div class="item"><strong>Voice activation</strong><label class="choice"><input id="voiceEnabled" type="checkbox" ').concat(((_d = NYXExperience.settings) == null ? void 0 : _d.voiceEnabled) !== false ? "checked" : "", '> Allow voice interaction</label><label class="choice"><input id="handsFreeEnabled" type="checkbox" ').concat(((_e = NYXExperience.settings) == null ? void 0 : _e.handsFreeEnabled) ? "checked" : "", '> Wake by <strong>Nyx</strong> while this page is open</label><p class="small">NyxThea and Nixie are conversational names; the wake word is always Nyx.</p><p class="small">').concat(NYXExperience.wakeEnrollmentReady() ? "Nyx is taught on this device." : "This device still needs the 5-sample Nyx setup.", '</p><button id="teachNyx" class="secondary">').concat(NYXExperience.wakeEnrollmentReady() ? "Re-teach Nyx on this device" : "Teach Nyx my voice", '</button><button id="exportNyxSamples" class="secondary">Export Nyx training samples</button><button id="clearNyxSamples" class="secondary">Delete local Nyx training samples</button><p id="wakeSampleNote" class="small">Checking local samples\u2026</p><p id="voiceNote" class="small"></p></div>\n <div class="item"><strong>Interface sounds</strong><select id="soundMode" class="field"><option value="off">Off</option><option value="minimal">Minimal</option><option value="full">Full</option></select><label class="choice"><input id="decorativeSounds" type="checkbox"> Allow decorative interface sounds</label><button id="testSound" class="secondary">Preview Nyx sound</button><p id="soundNote" class="small"></p></div>\n <div class="item"><strong>Recovery email</strong><input id="recoveryEmail" class="field" type="email" placeholder="Recovery email"><button id="sendRecoveryVerify" class="secondary">Send verification code</button><input id="recoveryEmailCode" class="field" inputmode="numeric" maxlength="6" placeholder="6-digit verification code"><button id="confirmRecoveryEmail" class="secondary">Verify recovery email</button><button id="reverifyRecoveryEmail" class="secondary" style="display:none">Verify adult access again</button><p id="recoveryEmailNote" class="small"></p></div><button id="signOut" class="secondary">Sign out</button>'));
    $("#nameSettings").onclick = () => NYXExperience.onboard(true);
    $("#meetPerson").onclick = meetSomeoneNew;
    $("#chooseSpeaker").onclick = chooseHouseholdSpeaker;
    if ($("#householdAdminBtn")) $("#householdAdminBtn").onclick = async () => {
      var _a2;
      try {
        const d = await api("/api/admin/household");
        const members = (((_a2 = d.household) == null ? void 0 : _a2.members) || []).map((m) => {
          var _a3;
          return '<div class="item"><strong>' + esc(((_a3 = m.identity) == null ? void 0 : _a3.preferredName) || m.profileId) + '</strong><br><span class="small">' + esc(m.role || "member") + "</span></div>";
        }).join("");
        panel("Household Admin", "<p>Manage this household only. This does not grant NyxThea platform access.</p>" + members + '<div class="item"><strong>Devices</strong><br><span class="small">' + esc(String((d.devices || []).length)) + ' registered</span></div><div class="item"><strong>Integrations</strong><br><span class="small">' + esc(String((d.integrations || []).filter((x) => x.connection).length)) + " configured</span></div>");
      } catch (e) {
        panel("Household Admin", "<p>" + esc(e.message) + "</p>");
      }
    };
    if ($("#systemAdminBtn")) $("#systemAdminBtn").onclick = async () => {
      try {
        const d = await api("/api/admin/system"), runs = d.buildHealth || [], groups = /* @__PURE__ */ new Map();
        for (const run of runs) {
          const failed = (run.jobs || []).filter((job) => job.result !== "success" && job.result !== "skipped").map((job) => job.name).sort(), key = run.conclusion === "success" ? "success" : failed.join(",") || run.conclusion || "unknown", group = groups.get(key) || { key, count: 0, latest: run };
          group.count++;
          if (String(run.receivedAt || "") > String(group.latest.receivedAt || "")) group.latest = run;
          groups.set(key, group);
        }
        const buildRows = [...groups.values()].slice(0, 12).map((group) => {
          const run = group.latest, failed = (run.jobs || []).filter((job) => job.result !== "success" && job.result !== "skipped"), label = run.conclusion === "success" ? "Passed" : "Needs attention" + (failed.length ? ": " + failed.map((job) => job.name).join(", ") : ""), repeat = group.count > 1 ? " \xB7 " + group.count + " similar runs" : "", when = run.receivedAt ? new Date(run.receivedAt).toLocaleString() : "time unavailable", link = run.url ? '<br><a href="' + esc(run.url) + '" target="_blank" rel="noopener noreferrer">Open CI run</a>' : "";
          return '<div class="item"><strong>' + esc(label) + '</strong><br><span class="small">' + esc((run.branch || "unknown branch") + " \xB7 " + String(run.sha || "").slice(0, 8) + repeat + " \xB7 " + when) + "</span>" + link + "</div>";
        }).join("");
        panel("System Admin", '<p>Platform-level diagnostics and audit access. Separate from household administration.</p><div class="item"><strong>Build health</strong><br><span class="small">' + esc(runs.length ? String(runs.length) + " recent CI reports" : "No CI reports received yet.") + "</span></div>" + buildRows + '<div class="item"><strong>System audit</strong><br><span class="small">' + esc(String((d.systemAudit || []).length)) + ' events</span></div><div class="item"><strong>Access audit</strong><br><span class="small">' + esc(String((d.accessAudit || []).length)) + ' events</span></div><div class="item"><strong>Integration audit</strong><br><span class="small">' + esc(String((d.integrationAudit || []).length)) + ' events</span></div><pre class="small" style="white-space:pre-wrap">' + esc(JSON.stringify(d.monitoring, null, 2)) + "</pre>");
      } catch (e) {
        panel("System Admin", "<p>" + esc(e.message) + "</p>");
      }
    };
    $("#saveProfilePinInline").onclick = async () => {
      const note = $("#securityNote");
      if (!await ensureSettingsAuthorization(note)) return;
      const pin = $("#newProfilePinInline").value.trim();
      if (!/^\d{4,8}$/.test(pin)) {
        note.textContent = "Enter a 4\u20138 digit PIN. Leading zeroes are allowed.";
        return;
      }
      try {
        await api("/api/profile-lock/pin", { method: "POST", settingsAuth: true, body: JSON.stringify({ pin, stayUnlockedOnDevice: true, deviceId: nyxDeviceId() }) });
        note.textContent = "PIN saved. This device stays unlocked.";
      } catch (e) {
        note.textContent = e.message;
      }
    };
    $("#enableBiometricInline").onclick = async () => {
      const note = $("#securityNote");
      if (!settingsAuthToken) {
        note.textContent = "Verify your account password or PIN first, then enable Face ID / Touch ID.";
        return;
      }
      await setupDeviceBiometric();
    };
    $("#changeAccountPassword").onclick = async () => {
      const note = $("#passwordNote");
      if (!await ensureSettingsAuthorization(note)) return;
      const currentPassword = $("#currentAccountPassword").value, newPassword = $("#newAccountPassword").value;
      try {
        await api("/api/settings/change-password", { method: "POST", settingsAuth: true, body: JSON.stringify({ currentPassword, newPassword, deviceId: nyxDeviceId() }) });
        note.textContent = "Password changed. This device remains signed in.";
      } catch (e) {
        note.textContent = e.message;
      }
    };
    $("#saveInterfaceModules").onclick = async () => {
      const visible = $$("[data-module-choice]:checked").map((x) => x.dataset.moduleChoice);
      try {
        await NYXExperience.save({ visibleModules: visible });
        applyInterfacePreferences();
        $("#interfaceNote").textContent = "Your interface is updated.";
      } catch (e) {
        $("#interfaceNote").textContent = e.message;
      }
    };
    $("#voiceEnabled").onchange = async (e) => {
      try {
        await NYXExperience.save({ voiceEnabled: e.target.checked });
        if (!e.target.checked) {
          NYXHandsFree.stop();
          NYXVoice.stop();
        }
        $("#voiceNote").textContent = "Voice preference saved.";
      } catch (err) {
        $("#voiceNote").textContent = err.message;
      }
    };
    $("#teachNyx").onclick = async () => {
      const ok = await NYXExperience.enrollWakeWord({ returnToSettings: true });
      if (ok) $("#voiceNote").textContent = "Nyx is ready on this device.";
    };
    void NYXWakeTraining.count().then((count) => {
      const note = $("#wakeSampleNote");
      if (note) note.textContent = count ? "".concat(count, " local Nyx training sample").concat(count === 1 ? "" : "s", " stored on this device.") : "No local Nyx training samples stored yet.";
    });
    $("#exportNyxSamples").onclick = async () => {
      const note = $("#wakeSampleNote");
      try {
        const count = await NYXWakeTraining.count();
        if (!count) {
          note.textContent = "There are no local Nyx samples to export yet.";
          return;
        }
        await NYXWakeTraining.export();
        note.textContent = "Exported ".concat(count, " local Nyx training samples.");
      } catch (e) {
        note.textContent = e.message;
      }
    };
    $("#clearNyxSamples").onclick = async () => {
      const note = $("#wakeSampleNote");
      try {
        await NYXWakeTraining.clear();
        note.textContent = "Local Nyx training samples deleted from this device.";
      } catch (e) {
        note.textContent = e.message;
      }
    };
    $("#handsFreeEnabled").onchange = async (e) => {
      const note = $("#voiceNote");
      if (e.target.checked && !NYXExperience.wakeEnrollmentReady()) {
        note.textContent = "Teach Nyx your voice first.";
        const ok = await NYXExperience.enrollWakeWord({ returnToSettings: true });
        if (!ok) {
          e.target.checked = false;
          return;
        }
      }
      if (e.target.checked) NYXHandsFree.start();
      else NYXHandsFree.stop();
      try {
        await NYXExperience.save({ handsFreeEnabled: e.target.checked, handsFreeConfigured: true });
        note.textContent = e.target.checked ? "Wake-by-Nyx saved." : "Wake-by-Nyx turned off.";
      } catch (err) {
        note.textContent = err.message;
      }
    };
    const soundMode = $("#soundMode"), decorative = $("#decorativeSounds"), soundNote = $("#soundNote");
    soundMode.value = ((_f = NYXExperience.settings) == null ? void 0 : _f.soundMode) || "minimal";
    decorative.checked = ((_g = NYXExperience.settings) == null ? void 0 : _g.decorativeSounds) !== false;
    soundMode.onchange = async () => {
      try {
        await NYXExperience.save({ soundMode: soundMode.value });
        soundNote.textContent = "Sound mode saved.";
      } catch (e) {
        soundNote.textContent = e.message;
      }
    };
    decorative.onchange = async () => {
      try {
        await NYXExperience.save({ decorativeSounds: decorative.checked });
        soundNote.textContent = "Sound preference saved.";
      } catch (e) {
        soundNote.textContent = e.message;
      }
    };
    $("#testSound").onclick = async () => {
      await NYXSound.prime();
      NYXSound.cue("startup");
    };
    const recoveryNote = $("#recoveryEmailNote");
    if ((_h = recovery == null ? void 0 : recovery.recovery) == null ? void 0 : _h.recoveryEmailVerified) {
      $("#recoveryEmail").value = recovery.recovery.recoveryEmail || "";
      recoveryNote.textContent = "Verified recovery email is active.";
    } else if (recovery && !recovery.emailDeliveryConfigured) recoveryNote.textContent = "Recovery email delivery is not configured yet; your saved recovery code still works.";
    $("#sendRecoveryVerify").onclick = async () => {
      if (!await ensureSettingsAuthorization(recoveryNote)) return;
      try {
        const d = await api("/api/recovery/email/start", { method: "POST", settingsAuth: true, body: JSON.stringify({ email: $("#recoveryEmail").value, deviceId: nyxDeviceId() }) });
        recoveryNote.textContent = d.sent ? "Verification code sent. Verify adult access again before confirming the code." : "Could not send verification email.";
        if (d.sent) $("#reverifyRecoveryEmail").style.display = "";
      } catch (e) {
        recoveryNote.textContent = e.message;
      }
    };
    $("#reverifyRecoveryEmail").onclick = async () => {
      await refreshSettingsAuthorization();
    };
    $("#confirmRecoveryEmail").onclick = async () => {
      if (!settingsAuthToken) {
        recoveryNote.textContent = "Verify adult access again before confirming the recovery email.";
        $("#reverifyRecoveryEmail").style.display = "";
        return;
      }
      try {
        await api("/api/recovery/email/confirm", { method: "POST", settingsAuth: true, body: JSON.stringify({ code: $("#recoveryEmailCode").value, deviceId: nyxDeviceId() }) });
        recoveryNote.textContent = "Recovery email verified.";
      } catch (e) {
        recoveryNote.textContent = e.message;
      }
    };
    $("#signOut").onclick = signOut;
  }
  function state(s, label) {
    const prior = document.body.dataset.nyxState;
    rose.classList.toggle("listening", s === "listening");
    rose.classList.toggle("speaking", s === "speaking");
    mic.classList.toggle("listening", s === "listening");
    $("#roseStatus").lastElementChild.textContent = label || "Ready when you are";
    if (s !== prior) {
      document.body.dataset.nyxState = s === "ready" ? "idle" : s;
      if (s === "listening") NYXSound.cue("listening");
      else if (s === "thinking") NYXSound.cue("thinking");
    }
  }
  async function speak(text) {
    var _a, _b, _c;
    if (((_a = NYXExperience.settings) == null ? void 0 : _a.voiceEnabled) === false) return false;
    const name = (_b = NYXExperience.settings) == null ? void 0 : _b.preferredName, phonetic = (_c = NYXExperience.settings) == null ? void 0 : _c.pronunciation;
    let spoken = String(text || "");
    if (name && phonetic) spoken = spoken.replaceAll(name, phonetic);
    return window.NYXVoice ? await NYXVoice.say(spoken) : false;
  }
  async function send(m = input.value.trim(), { voiceTurn = false } = {}) {
    if (!m) return;
    if (!credential) {
      unlock();
      return;
    }
    const epoch = conversationEpoch, profileId = credential.id, controller = new AbortController();
    chatControllers.add(controller);
    input.value = "";
    if (NYXHandsFree.active) {
      for (const c of NYXHandsFree.wakeAborts) {
        try {
          c.abort();
        } catch (e) {
        }
      }
      NYXHandsFree.pause();
    }
    if (!voiceTurn) panel("Nyxthea", "".concat(conversationMarkup(), '<div class="msg user">').concat(esc(m), '</div><div class="msg assistant" id="reply">Thinking\u2026</div>'));
    state("thinking", "Thinking");
    let answer = "";
    try {
      const d = await api(voiceTurn ? "/api/voice/chat" : "/api/chat", { method: "POST", timeoutMs: voiceTurn ? 9500 : 12e3, signal: controller.signal, body: JSON.stringify(voiceTurn ? { message: m, speakerProfileId: NYXHandsFree.speakerProfileId } : { message: m }) });
      if (epoch !== conversationEpoch || (credential == null ? void 0 : credential.id) !== profileId) return;
      answer = String(d.answer || "").trim();
      if (!voiceTurn && Array.isArray(d.conversation)) conversationHistory = d.conversation;
      else if (!voiceTurn) {
        conversationHistory.push({ role: "user", text: m }, { role: "assistant", text: answer });
      }
    } catch (e) {
      if (epoch !== conversationEpoch || (credential == null ? void 0 : credential.id) !== profileId || controller.signal.aborted) return;
    } finally {
      chatControllers.delete(controller);
    }
    if (epoch !== conversationEpoch || (credential == null ? void 0 : credential.id) !== profileId) return;
    if (!answer) answer = "I hit a snag. Ask me that again.";
    if (!voiceTurn) {
      const reply = $("#reply");
      if (reply) reply.textContent = answer;
    }
    let spoken = false;
    try {
      spoken = await speak(answer);
    } finally {
      if (epoch !== conversationEpoch || (credential == null ? void 0 : credential.id) !== profileId) return;
      if (!spoken) NYXHandsFree.resume();
      if (!NYXVoice.speaking) state(NYXHandsFree.active ? "listening" : "ready", NYXHandsFree.active ? "Listening for Nyx" : "Ready when you are");
    }
  }
  $("#send").onclick = () => send();
  input.onkeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };
  $$(".quick button[data-prefix]").forEach((b) => b.onclick = () => {
    input.value = b.dataset.prefix;
    input.focus();
  });
  function toggleVoice() {
    var _a;
    if (!credential) {
      unlock();
      return;
    }
    if (((_a = NYXExperience.settings) == null ? void 0 : _a.voiceEnabled) === false) {
      state("ready", "Voice is disabled in your profile");
      return;
    }
    const wasHandsFree = NYXHandsFree.active;
    if (wasHandsFree) NYXHandsFree.pause();
    NYXVoice.toggle((t) => {
      const spoken = String(t || "").trim();
      if (spoken) send(spoken, { voiceTurn: true });
      else if (wasHandsFree) NYXHandsFree.resume();
    });
  }
  mic.onclick = toggleVoice;
  async function memories() {
    if (!credential) {
      unlock();
      return;
    }
    try {
      let d = await api("/api/memories"), list = d.memories.length ? d.memories.map((x) => '<div class="item">'.concat(esc(x.text), "</div>")).join("") : '<div class="item">Nothing is saved yet.</div>';
      panel("Your memory", "<p>".concat(esc(d.notice || "Memory remains under your control."), "</p>").concat(list, '<input id="memText" class="field" placeholder="Save something you choose"><button id="saveMem" class="primary">Remember</button>'));
      $("#saveMem").onclick = async () => {
        let text = $("#memText").value.trim();
        if (!text) return;
        try {
          await api("/api/memories", { method: "POST", body: JSON.stringify({ text }) });
          memories();
        } catch (e) {
          panel("Your memory", "<p>".concat(esc(e.message), '</p><button id="memoryRetry" class="secondary">Back to memories</button>'));
          $("#memoryRetry").onclick = memories;
        }
      };
    } catch (e) {
      panel("Your memory", "<p>".concat(esc(e.message), "</p>"));
    }
  }
  $("#memory").onclick = memories;
  const emergencyLabels = { i_need_help: "I need help", i_cannot_speak: "I cannot speak", medical: "Medical", fire_smoke: "Fire or smoke", intruder: "Intruder", home_emergency: "Home emergency", vehicle_crash: "Vehicle crash", lost_or_unsafe: "Lost or unsafe" };
  function emergencySetup() {
    let choices = Object.entries(emergencyLabels).map(([value, label], i) => '<label class="choice"><input type="radio" name="emergencyType" value="'.concat(value, '" ').concat(i === 0 ? "checked" : "", "> ").concat(label, "</label>")).join("");
    panel("Emergency help", '<a class="emergency-call" href="tel:911">Call 911 now (U.S.)</a><div class="item emergency-note"><strong>Nyxthea has not contacted 911 or anyone else.</strong><p>This screen works silently. The call button opens your phone\'s native dialer; you must place the call.</p></div><div class="choice-grid">'.concat(choices, '</div><label class="choice"><input id="emergencyPractice" type="checkbox"> Practice mode \u2014 records a test only</label><button id="startEmergency" class="primary">Confirm and start</button><p id="emergencyStatus" class="small">').concat(credential ? "A confirmed incident will be saved to your private profile." : "You can call 911 without unlocking. Unlock is required only to save a Nyxthea incident timeline.", "</p>"));
    $("#startEmergency").onclick = startEmergency;
  }
  async function startEmergency() {
    var _a;
    let status = $("#emergencyStatus"), type = (_a = $("input[name=emergencyType]:checked")) == null ? void 0 : _a.value, practice = $("#emergencyPractice").checked;
    if (!credential) {
      status.textContent = "Session locked. The 911 call button still works; unlock only if you want to save an incident timeline.";
      return;
    }
    try {
      status.textContent = "Starting\u2026";
      let d = await api("/api/emergency/incidents", { method: "POST", body: JSON.stringify({ type, practice, confirm: true }) });
      renderEmergency(d.incident);
    } catch (e) {
      status.textContent = e.message;
    }
  }
  function renderEmergency(incident) {
    let label = emergencyLabels[incident.type] || incident.type, practice = incident.practice, timeline = incident.timeline.map((item) => '<div class="small">'.concat(new Date(item.at).toLocaleTimeString(), " \xB7 ").concat(esc(item.detail), "</div>")).join("");
    panel(practice ? "Emergency practice" : "Emergency active", "".concat(practice ? "" : '<a class="emergency-call" href="tel:911">Call 911 now (U.S.)</a>', '<div class="item emergency-note"><strong>').concat(practice ? "Practice only \u2014 no one was contacted." : "Nyxthea has NOT contacted 911 or trusted adults.", "</strong><p>").concat(practice ? "Use this screen to learn the controls safely." : "Use the call button if emergency help is needed. Stay quiet if speaking could put you in danger.", '</p></div><div class="item"><strong>').concat(esc(label), '</strong><br><span class="small">Status: ').concat(esc(incident.status), " \xB7 ").concat(new Date(incident.createdAt).toLocaleString(), '</span></div><div id="emergencyLocation">').concat(incident.location ? locationMarkup(incident.location) : '<span class="small">No location has been requested or saved.</span>', '</div><div class="emergency-actions"><button id="getEmergencyLocation" class="secondary">Use location once</button><button id="markEmergencySafe" class="secondary">Mark safe locally</button></div><div class="item"><strong>Local timeline</strong>').concat(timeline, '</div><div class="item"><strong>Not connected yet</strong><p class="small">Automatic emergency dispatch, trusted-contact messages, background location, and audio/video recording are not active.</p></div><p id="emergencyStatus" class="small"></p>'));
    $("#getEmergencyLocation").onclick = () => shareEmergencyLocation(incident);
    $("#markEmergencySafe").onclick = () => markEmergencySafe(incident);
  }
  function locationMarkup(location) {
    return '<div class="item"><strong>One-time location</strong><p>'.concat(esc(location.latitude.toFixed(5)), ", ").concat(esc(location.longitude.toFixed(5)), " \xB7 accuracy about ").concat(esc(Math.round(location.accuracy)), ' m</p><span class="small">This is a single browser reading, not continuous tracking.</span></div>');
  }
  function shareEmergencyLocation(incident) {
    let status = $("#emergencyStatus");
    if (!navigator.geolocation) {
      status.textContent = "Location is not supported by this browser.";
      return;
    }
    status.textContent = "Waiting for browser location permission\u2026";
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        let d = await api("/api/emergency/incidents/".concat(incident.id, "/location"), { method: "POST", body: JSON.stringify({ share: true, latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy, observedAt: new Date(position.timestamp).toISOString() }) });
        $("#emergencyLocation").innerHTML = locationMarkup(d.incident.location);
        status.textContent = "One-time location saved to this incident. It is not being tracked.";
      } catch (e) {
        status.textContent = e.message;
      }
    }, (error) => {
      status.textContent = error.message || "Location permission was not granted.";
    }, { enableHighAccuracy: true, timeout: 12e3, maximumAge: 0 });
  }
  async function markEmergencySafe(incident) {
    let status = $("#emergencyStatus");
    try {
      let d = await api("/api/emergency/incidents/".concat(incident.id, "/mark-safe"), { method: "POST", body: JSON.stringify({ confirm: true }) });
      status.textContent = d.incident.practice ? "Practice complete." : "Marked safe only inside Nyxthea. This did not cancel or update emergency services.";
      $("#markEmergencySafe").disabled = true;
    } catch (e) {
      status.textContent = e.message;
    }
  }
  $("#emergency").onclick = emergencySetup;
  function guideSetup() {
    if (!credential) {
      unlock();
      return;
    }
    panel("Live Guide", '<p>Nyxthea can look at a temporary camera or screen view and guide you one step at a time.</p><div class="item"><strong>Child-safe guidance</strong><p>Kids can use Live Guide for chores, routines, and learning. For schoolwork, Nyxthea may point out which item needs another look and give a concept, hint, or guiding question\u2014but never the corrected answer.</p></div><input id="guideObjective" class="field" maxlength="500" placeholder="What are you trying to fix or check?"><div class="choice-grid"><label class="choice"><input type="radio" name="guideSource" value="camera" checked> Camera</label><label class="choice"><input type="radio" name="guideSource" value="screen"> Screen share</label></div><label class="choice"><input id="guideMic" type="checkbox"> Use microphone transcript too</label><label class="choice"><input id="guideConsent" type="checkbox"> I give permission for this session. I understand snapshots are sent to Cloudflare Workers AI for analysis and are not saved in Nyxthea memory.</label><button id="startGuide" class="primary">Start Live Guide</button><p id="guideNote" class="small">Your browser will show its own camera, microphone, or screen permission prompt. Access ends when you close Live Guide.</p>');
    $("#startGuide").onclick = startLiveGuide;
  }
  async function startLiveGuide() {
    let objective = $("#guideObjective").value.trim(), source = $("input[name=guideSource]:checked").value, microphone = $("#guideMic").checked, confirm = $("#guideConsent").checked, note = $("#guideNote");
    if (!objective) {
      note.textContent = "Tell Nyxthea what you are trying to fix.";
      return;
    }
    if (!confirm) {
      note.textContent = "Live Guide needs your explicit permission before it can view or listen.";
      return;
    }
    guideResumeHandsFree = NYXHandsFree.active;
    if (guideResumeHandsFree) NYXHandsFree.pause();
    let sources = [source, ...microphone ? ["microphone"] : []], token = ++guideToken;
    try {
      let d = await api("/api/live-guide", { method: "POST", body: JSON.stringify({ objective, sources, confirm: true }) });
      if (token !== guideToken || document.hidden) return;
      guideSession = d.session;
      if (d.session.status === "safety_hold") {
        panel("Live Guide safety stop", '<div class="item risk-stop"><strong>Stop here.</strong><p>'.concat(esc(d.session.safety.message), "</p></div>"));
        guideSession = null;
        return;
      }
      let visual = source === "screen" ? await nyxMediaRequest(navigator.mediaDevices.getDisplayMedia({ video: true, audio: false }), 9e3, "Screen-share permission timed out.") : await nyxMediaRequest(navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false }), 9e3, "Camera permission timed out.");
      let tracks = [...visual.getTracks()];
      guidePending = tracks;
      if (token !== guideToken || document.hidden) {
        tracks.forEach((t) => t.stop());
        return;
      }
      if (microphone) {
        let audio = await nyxMediaRequest(navigator.mediaDevices.getUserMedia({ audio: true, video: false }), 7e3, "Microphone permission timed out.");
        tracks.push(...audio.getAudioTracks());
        if (token !== guideToken || document.hidden) {
          tracks.forEach((t) => t.stop());
          return;
        }
        startGuideTranscript();
      }
      guidePending = [];
      guideStream = new MediaStream(tracks);
      tracks.forEach((track) => track.onended = () => {
        if (guideSession) endLiveGuide(true);
      });
      renderLiveGuide();
    } catch (e) {
      guidePending.forEach((t) => t.stop());
      guidePending = [];
      if (token !== guideToken) return;
      if (guideSession) api("/api/live-guide/".concat(guideSession.id), { method: "DELETE" }).catch(() => {
      });
      guideSession = null;
      if (guideStream) guideStream.getTracks().forEach((t) => t.stop());
      guideStream = null;
      if (guideResumeHandsFree) {
        guideResumeHandsFree = false;
        NYXHandsFree.resume();
      }
      panel("Live Guide could not start", "<p>".concat(esc(e.message || "Camera, microphone, or screen access was not granted."), '</p><button class="secondary" id="tryGuide">Try again</button>'));
      $("#tryGuide").onclick = guideSetup;
    }
  }
  function startGuideTranscript() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const token = guideToken;
    const cycle = () => {
      if (!guideSession || token !== guideToken || document.hidden) return;
      const r = new SR();
      guideRecognition = r;
      r.continuous = false;
      r.interimResults = false;
      r.lang = "en-US";
      r.onresult = (e) => {
        var _a, _b, _c, _d;
        const heard = (_d = (_c = (_b = (_a = e.results) == null ? void 0 : _a[0]) == null ? void 0 : _b[0]) == null ? void 0 : _c.transcript) == null ? void 0 : _d.trim();
        if (heard) guideTranscript = (guideTranscript + " " + heard).trim().slice(-1200);
      };
      r.onerror = () => {
      };
      r.onend = () => {
        if (guideRecognition === r) guideRecognition = null;
        if (guideSession && token === guideToken && !document.hidden) setTimeout(cycle, 250);
      };
      try {
        r.start();
      } catch (e) {
        if (guideRecognition === r) guideRecognition = null;
        if (guideSession && token === guideToken) setTimeout(cycle, 500);
      }
    };
    cycle();
  }
  function renderLiveGuide() {
    panel("Live Guide", '<div class="guide-live">Viewing only this session</div><video id="guideVideo" class="guide-video" autoplay muted playsinline></video><input id="guideUserNote" class="field" maxlength="1200" placeholder="Optional: tell Nyxthea what changed"><div class="guide-actions"><button id="checkGuide" class="primary">Check this step</button><button id="endGuide" class="secondary">End access</button></div><label class="choice"><input id="autoGuide" type="checkbox"> Check automatically every 7 seconds</label><div id="guideResult" class="guide-result"><div class="item"><span class="small">Aim the camera or shared screen at the problem, then choose Check this step.</span></div></div>');
    $("#guideVideo").srcObject = guideStream;
    $("#checkGuide").onclick = analyzeGuide;
    $("#endGuide").onclick = () => endLiveGuide(true);
    $("#autoGuide").onchange = (e) => {
      clearInterval(guideTimer);
      guideTimer = e.target.checked ? setInterval(analyzeGuide, 7e3) : null;
    };
  }
  function guideFrame() {
    let video = $("#guideVideo");
    if (!video || !video.videoWidth) return "";
    let scale = Math.min(1, 768 / video.videoWidth), canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
    canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.72);
  }
  async function analyzeGuide() {
    var _a;
    if (guideBusy || !guideSession) return;
    guideBusy = true;
    let out = $("#guideResult"), button = $("#checkGuide"), note = ((_a = $("#guideUserNote")) == null ? void 0 : _a.value.trim()) || "";
    if (button) button.textContent = "Checking\u2026";
    try {
      let d = await api("/api/live-guide/".concat(guideSession.id, "/analyze"), { method: "POST", timeoutMs: 1e4, body: JSON.stringify({ image: guideFrame(), transcript: guideTranscript, note }) });
      guideTranscript = "";
      guideSession = d.session;
      let g = d.guidance;
      out.innerHTML = '<div class="item '.concat(g.risk === "stop" ? "risk-stop" : "", '"><strong>What I can see</strong><p>').concat(esc(g.observation), "</p><strong>Next step</strong><p>").concat(esc(g.nextStep), "</p><strong>How to verify</strong><p>").concat(esc(g.verification), '</p><span class="small">').concat(esc(g.caution), " \xB7 Confidence: ").concat(esc(g.confidence), "</span></div>");
      speak(g.nextStep);
      if (g.risk === "stop") {
        clearInterval(guideTimer);
        guideTimer = null;
        guideStream == null ? void 0 : guideStream.getTracks().forEach((t) => t.stop());
        guideStream = null;
      }
    } catch (e) {
      out.innerHTML = '<div class="item risk-stop"><strong>Live Guide paused</strong><p>'.concat(esc(e.message), "</p></div>");
    } finally {
      guideBusy = false;
      if (button) button.textContent = "Check this step";
    }
  }
  async function endLiveGuide(show = true) {
    guideToken++;
    guidePending.forEach((t) => t.stop());
    guidePending = [];
    clearInterval(guideTimer);
    guideTimer = null;
    try {
      guideRecognition == null ? void 0 : guideRecognition.abort();
    } catch (e) {
    }
    guideRecognition = null;
    let active = guideSession;
    guideSession = null;
    guideStream == null ? void 0 : guideStream.getTracks().forEach((t) => t.stop());
    guideStream = null;
    if (active) api("/api/live-guide/".concat(active.id), { method: "DELETE" }).catch(() => {
    });
    const resumeWake = guideResumeHandsFree;
    guideResumeHandsFree = false;
    state("ready");
    if (resumeWake) setTimeout(() => NYXHandsFree.resume(), 250);
    if (show) panel("Live Guide ended", "<p>Camera, screen, and microphone access has stopped. Nyxthea did not save the raw media.</p>");
  }
  $("#liveGuide").onclick = $("#liveGuideQuick").onclick = guideSetup;
  function privacy() {
    panel("Privacy by design", "<p>Memory is opt-in and profile-separated. Nyxthea asks permission before protected actions, uses approved official connections, and never claims an action happened when it did not.</p><div class='item'><strong>Human control stays permanent.</strong><br><span class='small'>Privacy, authorization, safety, honesty, and consent cannot be bypassed by learning or automation.</span></div>");
  }
  $("#privacy").onclick = $("#privacyTop").onclick = privacy;
  $("#caps").onclick = async () => {
    try {
      let d = await api("/api/capabilities");
      panel("What Nyxthea can do", d.capabilities.map((c) => '<div class="item"><strong>'.concat(esc(c.name), '</strong><br><span class="small">').concat(esc(c.description), "</span></div>")).join(""));
    } catch (e) {
      panel("Capabilities", "<p>".concat(esc(e.message), "</p>"));
    }
  };
  const desc = { Home: "The living command center for your Nyxthea intelligence.", "Your World": "People, places, routines, goals, and household context will live here under your control.", Devices: "Authorized phones, speakers, screens, appliances, and sensors appear only after an official adapter is connected.", Health: "Consent-controlled wellness information and recovery support. No health source is connected yet.", Security: "Presence and multi-signal safety proposals without silent surveillance or unverified emergency action.", Memories: "Layered, explicit memory that you can inspect and remove.", Music: "Provider-neutral music intelligence. A music provider has not been connected yet.", Vehicle: "Maintenance, diagnostics, travel context, and future authorized telemetry.", Settings: "Identity, privacy, permissions, integrations, voice, and interface preferences." };
  function view(v) {
    if (v === "Home") {
      scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (v === "Memories") {
      memories();
      return;
    }
    if (v === "Settings") {
      if (credential) openSettingsVerified();
      else unlock();
      return;
    }
    $$(".nav-button").forEach((b) => b.classList.toggle("active", b.dataset.view === v));
    panel(v, '<div class="mini-head"><span class="compact-rose"></span><div><strong>'.concat(esc(v), "</strong><span>Connected to the same Nyxthea Core</span></div></div><p>").concat(esc(desc[v] || "This area belongs to your command center."), '</p><div class="item"><span class="small">Future controls appear only after you authorize a working official integration.</span></div>'));
  }
  $$("[data-view]").forEach((b) => b.onclick = () => view(b.dataset.view));
  session();
  const NYXSound = {
    ctx: null,
    master: null,
    ready: false,
    lastCue: null,
    lastAt: 0,
    forceSession: false,
    enabled(kind) {
      var _a, _b;
      const mode = ((_a = NYXExperience == null ? void 0 : NYXExperience.settings) == null ? void 0 : _a.soundMode) || "minimal";
      if (this.forceSession && ["startup", "listening", "success", "warning", "lock", "unlock"].includes(kind)) return true;
      if (mode === "off") return false;
      if (((_b = NYXExperience == null ? void 0 : NYXExperience.settings) == null ? void 0 : _b.decorativeSounds) === false) return false;
      if (mode === "minimal" && ["thinking", "speaking"].includes(kind)) return false;
      return true;
    },
    async prime() {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return false;
        this.ctx = this.ctx || new Ctx();
        await this.ctx.resume();
        if (!this.master) {
          this.master = this.ctx.createGain();
          this.master.gain.value = 0.42;
          this.master.connect(this.ctx.destination);
        } else this.master.gain.setValueAtTime(0.42, this.ctx.currentTime);
        this.ready = this.ctx.state === "running";
        return this.ready;
      } catch (e) {
        return false;
      }
    },
    tone(freq, start, duration, gain = 0.12, type = "sine", endFreq = null) {
      if (!this.ctx || !this.master) return;
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, start);
      if (endFreq) o.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), start + duration);
      g.gain.setValueAtTime(1e-4, start);
      g.gain.exponentialRampToValueAtTime(Math.max(2e-4, gain), start + 0.025);
      g.gain.exponentialRampToValueAtTime(1e-4, start + duration);
      o.connect(g);
      g.connect(this.master);
      o.start(start);
      o.stop(start + duration + 0.02);
    },
    cue(kind) {
      if (!this.enabled(kind) || !this.ready || !this.ctx) return false;
      const now = this.ctx.currentTime;
      if (this.lastCue === kind && Date.now() - this.lastAt < 350) return false;
      this.lastCue = kind;
      this.lastAt = Date.now();
      if (kind === "startup") {
        this.tone(262, now, 0.34, 0.2, "sine", 392);
        this.tone(392, now + 0.16, 0.42, 0.22, "sine", 659);
        this.tone(659, now + 0.34, 0.58, 0.18, "sine", 988);
      } else if (kind === "listening") {
        this.tone(660, now, 0.12, 0.16, "sine", 880);
        this.tone(988, now + 0.07, 0.14, 0.12, "sine", 1175);
      } else if (kind === "thinking") {
        this.tone(330, now, 0.16, 0.03, "sine", 390);
      } else if (kind === "speaking") {
        this.tone(520, now, 0.1, 0.025, "sine", 610);
      } else if (kind === "success") {
        this.tone(523, now, 0.14, 0.15, "sine", 698);
        this.tone(784, now + 0.1, 0.22, 0.14, "sine", 1047);
      } else if (kind === "warning") {
        this.tone(300, now, 0.18, 0.14, "triangle", 240);
        this.tone(220, now + 0.18, 0.22, 0.12, "triangle", 170);
      } else if (kind === "lock") {
        this.tone(430, now, 0.13, 0.13, "sine", 300);
        this.tone(260, now + 0.11, 0.18, 0.11, "sine", 190);
      } else if (kind === "unlock") {
        this.tone(300, now, 0.13, 0.12, "sine", 470);
        this.tone(520, now + 0.08, 0.2, 0.13, "sine", 740);
      }
      return true;
    }
  };
  window.NYXSound = NYXSound;
  const NYXVoice = {
    synth: window.speechSynthesis || null,
    recognition: null,
    recorder: null,
    stream: null,
    timer: null,
    token: 0,
    speechToken: 0,
    speaking: false,
    listening: false,
    transcribing: false,
    audioEl: null,
    audioUrl: null,
    preferred: null,
    choose() {
      if (!this.synth) return null;
      const vs = this.synth.getVoices();
      this.preferred = vs.find((v) => /^en[-_]GB/i.test(v.lang) && /kate|martha|serena|female/i.test(v.name)) || vs.find((v) => /samantha|ava|allison|serena|victoria/i.test(v.name)) || vs.find((v) => /^en[-_]GB/i.test(v.lang) && !/daniel|male/i.test(v.name)) || null;
      return this.preferred;
    },
    stopSpeech() {
      var _a, _b;
      this.speechToken++;
      try {
        (_a = this.synth) == null ? void 0 : _a.cancel();
      } catch (e) {
      }
      try {
        (_b = this.audioEl) == null ? void 0 : _b.pause();
      } catch (e) {
      }
      if (this.audioUrl) {
        try {
          URL.revokeObjectURL(this.audioUrl);
        } catch (e) {
        }
      }
      this.audioUrl = null;
      if (this.audioEl) {
        this.audioEl.onended = null;
        this.audioEl.onerror = null;
      }
      this.speaking = false;
      document.body.dataset.nyxState = "idle";
    },
    stop() {
      this.cancelInput();
      this.stopSpeech();
    },
    show(s, label) {
      state(s, label);
      NYXExperience.state(s === "ready" ? "idle" : s);
      const b = document.getElementById("nyxMic");
      b.classList.toggle("listening", s === "listening");
      b.setAttribute("aria-label", s === "listening" ? "Stop recording and send" : "Tap to start voice input");
    },
    cancelInput() {
      var _a, _b;
      this.token++;
      clearTimeout(this.timer);
      this.timer = null;
      const r = this.recorder;
      this.recorder = null;
      if (r) {
        r.onstop = null;
        r.ondataavailable = null;
        try {
          if (r.state !== "inactive") r.stop();
        } catch (e) {
        }
      }
      try {
        (_a = this.recognition) == null ? void 0 : _a.abort();
      } catch (e) {
      }
      this.recognition = null;
      (_b = this.stream) == null ? void 0 : _b.getTracks().forEach((t) => t.stop());
      this.stream = null;
      this.listening = false;
      this.transcribing = false;
      this.show("ready");
      NYXHandsFree.resume();
    },
    async prime() {
      try {
        if (!this.audioEl) {
          this.audioEl = new Audio();
          this.audioEl.setAttribute("playsinline", "");
          this.audioEl.playsInline = true;
        }
        this.audioEl.muted = true;
        this.audioEl.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=";
        await this.audioEl.play().catch(() => {
        });
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
        this.audioEl.muted = false;
      } catch (e) {
      }
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) {
          this.ctx = this.ctx || new Ctx();
          await this.ctx.resume();
        }
      } catch (e) {
      }
    },
    fallback(text, token) {
      if (!this.synth || !text) return Promise.resolve(false);
      return new Promise((resolve) => {
        var _a;
        const u = new SpeechSynthesisUtterance(String(text));
        u.voice = this.choose();
        u.lang = ((_a = u.voice) == null ? void 0 : _a.lang) || "en-US";
        u.rate = 0.98;
        u.pitch = 0.94;
        u.volume = 1;
        let settled = false;
        const watchdog = setTimeout(() => done(false), Math.max(9e3, Math.min(3e4, String(text).length * 75)));
        u.onstart = () => {
          if (token !== this.speechToken) return;
          this.speaking = true;
          document.body.dataset.nyxState = "speaking";
        };
        const done = (value = true) => {
          if (settled) return;
          settled = true;
          clearTimeout(watchdog);
          if (token !== this.speechToken) {
            resolve(false);
            return;
          }
          this.speaking = false;
          document.body.dataset.nyxState = "idle";
          setTimeout(() => NYXHandsFree.resume(), 320);
          resolve(value);
        };
        u.onend = () => done(true);
        u.onerror = () => done(false);
        try {
          this.synth.speak(u);
        } catch (e) {
          done(false);
        }
      });
    },
    async say(text) {
      var _a, _b;
      if (!text) return false;
      this.speechToken++;
      const token = this.speechToken;
      try {
        (_a = this.synth) == null ? void 0 : _a.cancel();
      } catch (e) {
      }
      try {
        (_b = this.audioEl) == null ? void 0 : _b.pause();
      } catch (e) {
      }
      if (this.audioUrl) {
        try {
          URL.revokeObjectURL(this.audioUrl);
        } catch (e) {
        }
        this.audioUrl = null;
      }
      this.speaking = true;
      document.body.dataset.nyxState = "speaking";
      try {
        const controller = new AbortController(), fetchTimer = setTimeout(() => controller.abort(), 6500);
        let r;
        try {
          r = await fetch("/api/voice/speak", { method: "POST", signal: controller.signal, credentials: "same-origin", headers: __spreadValues({ "content-type": "application/json", "x-nyxthea-device": nyxDeviceId() }, settingsAuthToken ? { "x-nyxthea-settings-auth": settingsAuthToken } : {}), body: JSON.stringify({ text: String(text), speaker: "luna" }) });
        } finally {
          clearTimeout(fetchTimer);
        }
        ;
        if (!r.ok) throw Error("Natural voice unavailable");
        const contentType = String(r.headers.get("content-type") || "").toLowerCase();
        if (!contentType.startsWith("audio/")) throw Error("Natural voice returned an invalid response");
        const blob = await nyxTimed(r.blob(), 6500, "Voice audio download timed out.");
        if (!blob.size) throw Error("Natural voice returned empty audio");
        if (token !== this.speechToken) return false;
        const url = URL.createObjectURL(blob), audio = this.audioEl || new Audio();
        this.audioEl = audio;
        this.audioUrl = url;
        audio.src = url;
        audio.preload = "auto";
        audio.muted = false;
        audio.playbackRate = 0.98;
        const result = await new Promise(async (resolve) => {
          let settled = false, watchdog = setTimeout(() => finish(false), Math.max(9e3, Math.min(3e4, String(text).length * 70)));
          const finish = (value) => {
            if (settled) return;
            settled = true;
            clearTimeout(watchdog);
            if (this.audioUrl) {
              try {
                URL.revokeObjectURL(this.audioUrl);
              } catch (e) {
              }
              this.audioUrl = null;
            }
            if (token === this.speechToken) {
              this.speaking = false;
              document.body.dataset.nyxState = "idle";
              setTimeout(() => NYXHandsFree.resume(), 320);
            }
            resolve(value);
          };
          audio.onended = () => finish(true);
          audio.onerror = () => finish(false);
          try {
            await audio.play();
          } catch (e) {
            finish(false);
          }
        });
        if (result) return true;
        if (token !== this.speechToken) return false;
        return await this.fallback(text, token);
      } catch (e) {
        if (token !== this.speechToken) return false;
        this.speaking = false;
        const fallback = await this.fallback(text, token);
        if (!fallback) setTimeout(() => NYXHandsFree.resume(), 180);
        return fallback;
      }
    },
    async toggle(onText) {
      var _a, _b;
      if (this.listening) {
        this.finish();
        return;
      }
      if (this.transcribing) return;
      this.stopSpeech();
      const token = ++this.token;
      this.listening = true;
      this.show("listening", "Opening microphone\u2026");
      if (((_a = navigator.mediaDevices) == null ? void 0 : _a.getUserMedia) && window.MediaRecorder) {
        try {
          const stream = await nyxMediaRequest(navigator.mediaDevices.getUserMedia({ audio: true, video: false }), 7e3, "Microphone permission timed out.");
          if (token !== this.token || document.hidden) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          this.stream = stream;
          const type = ["audio/mp4", "audio/webm", "audio/ogg"].find((t) => MediaRecorder.isTypeSupported(t));
          const recorder = type ? new MediaRecorder(stream, { mimeType: type }) : new MediaRecorder(stream);
          this.recorder = recorder;
          const chunks = [];
          recorder.ondataavailable = (e) => {
            if (e.data.size) chunks.push(e.data);
          };
          recorder.onstop = async () => {
            var _a2;
            stream.getTracks().forEach((t) => t.stop());
            if (this.stream === stream) this.stream = null;
            if (token !== this.token) return;
            this.recorder = null;
            this.listening = false;
            this.transcribing = true;
            this.show("thinking", "Transcribing\u2026");
            try {
              const blob = new Blob(chunks, { type: recorder.mimeType || "audio/mp4" });
              if (blob.size < 100) throw Error("No speech was captured. Please try again.");
              if (blob.size > 1e6) throw Error("Recording was too large. Please try a shorter message.");
              const audio = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result).split(",")[1]);
                reader.onerror = () => reject(Error("Could not read the recording."));
                reader.readAsDataURL(blob);
              });
              if (token !== this.token || document.hidden) return;
              const result = await api("/api/voice/transcribe", { method: "POST", body: JSON.stringify({ audio, type: blob.type.split(";")[0] }) });
              if (token !== this.token || document.hidden) return;
              if ((_a2 = result.text) == null ? void 0 : _a2.trim()) {
                this.show("ready");
                onText(result.text.trim());
              } else {
                this.show("ready", "No speech heard \u2014 try again");
                NYXHandsFree.resume();
              }
            } catch (e) {
              if (token === this.token) {
                this.show("ready", e.message);
                NYXHandsFree.resume();
              }
            } finally {
              if (token === this.token) this.transcribing = false;
            }
          };
          recorder.start();
          this.show("listening", "Listening \u2014 tap again to send");
          this.timer = setTimeout(() => this.finish(), 1e4);
          return;
        } catch (e) {
          (_b = this.stream) == null ? void 0 : _b.getTracks().forEach((t) => t.stop());
          this.stream = null;
          this.recorder = null;
          if (token !== this.token) return;
          this.listening = false;
          this.show("ready", e.name === "NotAllowedError" ? "Microphone access denied \u2014 check browser permissions" : e.message || "Microphone could not start");
          NYXHandsFree.resume();
          return;
        }
      }
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        this.listening = false;
        this.show("ready", "Microphone unavailable in this browser");
        NYXHandsFree.resume();
        return;
      }
      try {
        const r = new SR();
        this.recognition = r;
        r.lang = "en-US";
        r.continuous = false;
        r.interimResults = false;
        r.onresult = (e) => {
          var _a2, _b2, _c, _d;
          const t = (_d = (_c = (_b2 = (_a2 = e.results) == null ? void 0 : _a2[0]) == null ? void 0 : _b2[0]) == null ? void 0 : _c.transcript) == null ? void 0 : _d.trim();
          if (token !== this.token) return;
          clearTimeout(this.timer);
          this.listening = false;
          this.recognition = null;
          try {
            r.stop();
          } catch (e2) {
          }
          this.show("ready", t ? void 0 : "No speech heard \u2014 try again");
          if (t) onText(t);
          else NYXHandsFree.resume();
        };
        r.onerror = (e) => {
          if (token !== this.token) return;
          this.listening = false;
          this.recognition = null;
          clearTimeout(this.timer);
          this.show("ready", "Voice input failed: ".concat(e.error || "unknown error"));
          NYXHandsFree.resume();
        };
        r.onend = () => {
          if (token === this.token && this.listening) {
            this.listening = false;
            this.recognition = null;
            clearTimeout(this.timer);
            this.show("ready", "No speech heard \u2014 try again");
            NYXHandsFree.resume();
          }
        };
        r.start();
        this.show("listening", "Listening \u2014 tap again to finish");
        this.timer = setTimeout(() => this.finish(), 1e4);
      } catch (e) {
        this.listening = false;
        this.recognition = null;
        this.show("ready", e.message || "Voice input could not start");
        NYXHandsFree.resume();
      }
    },
    finish() {
      var _a;
      clearTimeout(this.timer);
      this.timer = null;
      if (this.recorder) {
        const r = this.recorder;
        try {
          if (r.state !== "inactive") r.stop();
        } catch (e) {
          this.cancelInput();
        }
        (_a = this.stream) == null ? void 0 : _a.getTracks().forEach((t) => t.stop());
        return;
      }
      if (this.recognition) {
        try {
          this.recognition.stop();
        } catch (e) {
          this.cancelInput();
        }
        return;
      }
      this.cancelInput();
    }
  };
  if (window.speechSynthesis) {
    speechSynthesis.onvoiceschanged = () => NYXVoice.choose();
    NYXVoice.choose();
  }
  window.NYXVoice = NYXVoice;
  const NYXLocalWake = {
    detector: null,
    module: null,
    loading: null,
    active: false,
    lastError: null,
    async loadOrt() {
      var _a, _b, _c, _d;
      if ((_a = window.ort) == null ? void 0 : _a.InferenceSession) {
        try {
          if ((_c = (_b = window.ort) == null ? void 0 : _b.env) == null ? void 0 : _c.wasm) {
            window.ort.env.wasm.wasmPaths = "/vendor/";
            window.ort.env.wasm.numThreads = 1;
          }
        } catch (e) {
        }
        return window.ort;
      }
      if (document.querySelector("script[data-nyx-ort]")) {
        for (let i = 0; i < 20 && !((_d = window.ort) == null ? void 0 : _d.InferenceSession); i++) await nyxDelay(100);
        return window.ort || null;
      }
      return await new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "/vendor/ort.min.js";
        script.async = true;
        script.dataset.nyxOrt = "true";
        script.onload = () => {
          var _a2, _b2;
          try {
            if ((_b2 = (_a2 = window.ort) == null ? void 0 : _a2.env) == null ? void 0 : _b2.wasm) {
              window.ort.env.wasm.wasmPaths = "/vendor/";
              window.ort.env.wasm.numThreads = 1;
            }
          } catch (e) {
          }
          resolve(window.ort || null);
        };
        script.onerror = () => resolve(null);
        document.head.appendChild(script);
      });
    },
    async ensure() {
      if (this.detector) return true;
      if (this.loading) return this.loading;
      this.loading = (async () => {
        try {
          const ort = await this.loadOrt();
          if (!ort) return false;
          this.module = this.module || await Promise.resolve().then(() => __toESM(require("./nyx-wake-detector.js")));
          this.detector = new this.module.NyxOnnxWakeDetector({
            ort,
            onWake: async (detail) => {
              if (!NYXHandsFree.active || NYXHandsFree.paused || NYXHandsFree.turnBusy) return;
              await NYXHandsFree.heard("Nyx", 1);
            },
            onError: (error) => {
              this.lastError = error;
            }
          });
          await this.detector.init();
          return true;
        } catch (error) {
          this.lastError = error;
          this.detector = null;
          return false;
        } finally {
          this.loading = null;
        }
      })();
      return this.loading;
    },
    async start(stream) {
      if (!stream) return false;
      if (!await this.ensure()) return false;
      try {
        await this.detector.start(stream);
        this.active = true;
        return true;
      } catch (error) {
        this.lastError = error;
        this.active = false;
        return false;
      }
    },
    async stop() {
      var _a;
      this.active = false;
      try {
        await ((_a = this.detector) == null ? void 0 : _a.stop({ stopTracks: false }));
      } catch (e) {
      }
    },
    async release() {
      var _a;
      this.active = false;
      try {
        await ((_a = this.detector) == null ? void 0 : _a.release());
      } catch (e) {
      }
      this.detector = null;
    }
  };
  window.NYXLocalWake = NYXLocalWake;
  const NYXHandsFree = {
    active: false,
    paused: false,
    stream: null,
    recorder: null,
    timer: null,
    wakeInFlight: 0,
    wakeAborts: /* @__PURE__ */ new Set(),
    turnBusy: false,
    engagedUntil: 0,
    failures: 0,
    generation: 0,
    recognition: null,
    persistentStream: false,
    speakerProfileId: null,
    speakerName: null,
    label(message) {
      const b = document.getElementById("wakeToggle");
      b.textContent = this.active ? "Stop voice activation" : "Enable voice activation";
      b.setAttribute("aria-pressed", String(this.active));
      const speaker = this.speakerName ? " \xB7 " + this.speakerName : "";
      if (message) state(this.active ? "listening" : "ready", message + speaker);
    },
    async activateWakeMode() {
      if (!this.active || this.paused || document.hidden || !this.stream) return;
      const engaged = Date.now() < this.engagedUntil;
      if (!engaged && await NYXLocalWake.start(this.stream)) {
        this.label("Listening for Nyx");
        return;
      }
      await NYXLocalWake.stop();
      this.recordChunk();
    },
    async start() {
      var _a;
      if (this.active) return;
      if (!credential) {
        unlock();
        return;
      }
      if (((_a = NYXExperience.settings) == null ? void 0 : _a.voiceEnabled) === false) {
        state("ready", "Voice is disabled in your profile");
        return;
      }
      this.active = true;
      this.paused = false;
      this.failures = 0;
      this.engagedUntil = 0;
      this.generation++;
      this.label("Listening for Nyx");
      await this.open();
    },
    async startWithStream(stream) {
      if (!stream) return this.start();
      if (!credential) {
        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch (e) {
        }
        ;
        unlock();
        return;
      }
      this.active = true;
      this.paused = false;
      this.failures = 0;
      this.engagedUntil = 0;
      this.generation++;
      this.stream = stream;
      this.persistentStream = true;
      this.label("Listening for Nyx");
      await this.activateWakeMode();
    },
    stop(message = "Voice activation off") {
      var _a, _b;
      NYXSound.forceSession = false;
      void NYXLocalWake.stop();
      this.persistentStream = false;
      for (const c of this.wakeAborts) {
        try {
          c.abort();
        } catch (e) {
        }
      }
      this.wakeAborts.clear();
      this.wakeInFlight = 0;
      const wasActive = this.active;
      this.active = false;
      this.paused = false;
      this.turnBusy = false;
      this.speakerProfileId = null;
      this.speakerName = null;
      this.engagedUntil = 0;
      this.generation++;
      clearTimeout(this.timer);
      this.timer = null;
      try {
        if (this.recorder && this.recorder.state !== "inactive") this.recorder.stop();
      } catch (e) {
      }
      this.recorder = null;
      try {
        (_a = this.recognition) == null ? void 0 : _a.abort();
      } catch (e) {
      }
      this.recognition = null;
      try {
        (_b = this.stream) == null ? void 0 : _b.getTracks().forEach((t) => t.stop());
      } catch (e) {
      }
      this.stream = null;
      if (wasActive) this.label(message);
    },
    async enable() {
      await this.start();
      if (this.active) await NYXExperience.save({ handsFreeEnabled: true, voiceAssistantMode: true }).catch(() => {
      });
    },
    disable() {
      this.stop();
      NYXExperience.save({ handsFreeEnabled: false, voiceAssistantMode: false }).catch(() => {
      });
    },
    pause() {
      var _a, _b;
      if (!this.active) return;
      this.paused = true;
      void NYXLocalWake.stop();
      clearTimeout(this.timer);
      this.timer = null;
      for (const c of this.wakeAborts) {
        try {
          c.abort();
        } catch (e) {
        }
      }
      this.wakeAborts.clear();
      this.wakeInFlight = 0;
      try {
        if (this.recorder && this.recorder.state !== "inactive") this.recorder.stop();
      } catch (e) {
      }
      this.recorder = null;
      try {
        (_a = this.recognition) == null ? void 0 : _a.abort();
      } catch (e) {
      }
      this.recognition = null;
      if (!this.persistentStream) {
        try {
          (_b = this.stream) == null ? void 0 : _b.getTracks().forEach((t) => t.stop());
        } catch (e) {
        }
        this.stream = null;
      }
      state("thinking", "Thinking");
    },
    resume() {
      if (!this.active || !this.paused || document.hidden || guideSession) return;
      if (this.engagedUntil > Date.now()) this.engagedUntil = Date.now() + 45e3;
      this.paused = false;
      this.label("Listening for Nyx");
      setTimeout(() => {
        if (this.persistentStream && this.stream) void this.activateWakeMode();
        else this.open();
      }, 260);
    },
    async open() {
      var _a;
      if (!this.active || this.paused || document.hidden || this.stream || this.recorder || this.recognition) return;
      if (((_a = navigator.mediaDevices) == null ? void 0 : _a.getUserMedia) && window.MediaRecorder) {
        try {
          const stream = await nyxMediaRequest(navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false }), 7e3, "Microphone permission timed out.");
          if (!this.active || this.paused || document.hidden) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          this.stream = stream;
          this.persistentStream = true;
          this.failures = 0;
          await this.activateWakeMode();
          return;
        } catch (e) {
          this.stream = null;
          this.persistentStream = false;
          if ((e == null ? void 0 : e.name) === "NotAllowedError") {
            this.label("Microphone permission is needed for Nyx");
            return;
          }
        }
      }
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        this.openSpeechFallback();
        return;
      }
      this.label("Wake listening is unavailable in this browser");
    },
    recordChunk() {
      var _a;
      if (!this.active || this.paused || !this.stream || this.recorder || document.hidden) return;
      if (NYXLocalWake.active) void NYXLocalWake.stop();
      try {
        const type = ["audio/mp4", "audio/webm", "audio/ogg"].find((t) => MediaRecorder.isTypeSupported(t));
        const recorder = type ? new MediaRecorder(this.stream, { mimeType: type }) : new MediaRecorder(this.stream);
        this.recorder = recorder;
        const chunks = [], token = this.generation;
        recorder.ondataavailable = (e) => {
          if (e.data.size) chunks.push(e.data);
        };
        recorder.onstop = () => {
          if (this.recorder === recorder) this.recorder = null;
          clearTimeout(this.timer);
          this.timer = null;
          if (!this.active || this.paused || token !== this.generation) return;
          const blob = new Blob(chunks, { type: recorder.mimeType || "audio/mp4" });
          if (this.active && !this.paused && token === this.generation) {
            if (Date.now() >= this.engagedUntil) setTimeout(() => void this.activateWakeMode(), 40);
            else setTimeout(() => this.recordChunk(), 40);
          }
          if (blob.size > 180 && this.wakeInFlight < 2) void this.processChunk(blob, token);
        };
        recorder.start();
        const engaged = Date.now() < this.engagedUntil;
        this.timer = setTimeout(() => {
          try {
            if (recorder.state !== "inactive") recorder.stop();
          } catch (e) {
          }
        }, engaged ? 2100 : 1600);
      } catch (e) {
        this.recorder = null;
        if (this.persistentStream) {
          try {
            (_a = this.stream) == null ? void 0 : _a.getTracks().forEach((t) => t.stop());
          } catch (e2) {
          }
          this.stream = null;
          this.persistentStream = false;
        }
        this.openSpeechFallback();
      }
    },
    async processChunk(blob, token) {
      if (this.wakeInFlight >= 2 || !this.active || this.paused || token !== this.generation) return;
      this.wakeInFlight++;
      const controller = new AbortController();
      this.wakeAborts.add(controller);
      try {
        const audio = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result).split(",")[1]);
          reader.onerror = () => reject(Error("Could not read wake audio."));
          reader.readAsDataURL(blob);
        });
        if (!this.active || this.paused || token !== this.generation || controller.signal.aborted) return;
        const result = await api("/api/voice/transcribe", { method: "POST", timeoutMs: 6e3, signal: controller.signal, body: JSON.stringify({ audio, type: blob.type.split(";")[0] || "audio/mp4" }) });
        const spoken = String(result.text || "").trim();
        if (spoken && this.active && !this.paused && token === this.generation && !controller.signal.aborted) await this.heard(spoken, 0.7);
      } catch (e) {
        if ((e == null ? void 0 : e.name) !== "AbortError") {
          this.failures++;
          if (this.failures >= 3 && this.active) {
            this.label("Listening for Nyx");
            this.failures = 0;
          }
        }
      } finally {
        this.wakeAborts.delete(controller);
        this.wakeInFlight = Math.max(0, this.wakeInFlight - 1);
      }
    },
    openSpeechFallback() {
      if (!this.active || this.paused || this.recognition || document.hidden) return;
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        this.label("Wake listening is unavailable in this browser");
        return;
      }
      const token = this.generation, r = new SR();
      this.recognition = r;
      r.lang = "en-US";
      r.continuous = false;
      r.interimResults = false;
      r.maxAlternatives = 3;
      let heardSomething = false;
      r.onstart = () => {
        this.failures = 0;
        this.label("Listening for Nyx");
      };
      r.onresult = (e) => {
        var _a, _b;
        if (!this.active || this.paused || token !== this.generation) return;
        const result = (_a = e.results) == null ? void 0 : _a[0], heard = result == null ? void 0 : result[0], spoken = (_b = heard == null ? void 0 : heard.transcript) == null ? void 0 : _b.trim();
        if (spoken) {
          heardSomething = true;
          void this.heard(spoken, heard.confidence);
        }
      };
      r.onerror = (e) => {
        if (!this.active || token !== this.generation || ["aborted", "no-speech"].includes(e.error)) return;
        this.failures++;
        if (this.failures >= 3) {
          this.label("Wake listener is retrying");
          this.failures = 0;
        }
      };
      r.onend = () => {
        if (this.recognition === r) this.recognition = null;
        if (!this.active || this.paused || token !== this.generation || document.hidden) return;
        setTimeout(() => this.openSpeechFallback(), heardSomething ? 180 : 260);
      };
      try {
        r.start();
      } catch (e) {
        this.recognition = null;
        if (this.active && !this.paused) setTimeout(() => this.openSpeechFallback(), 350);
      }
    },
    async heard(spoken, confidence) {
      if (!this.active || this.paused || this.turnBusy) return;
      this.turnBusy = true;
      try {
        if (/\b(?:goodnight|stop listening|go to sleep)\b/i.test(spoken)) {
          this.disable();
          return;
        }
        const aliases = ["nyx"];
        const raw = String(spoken || "").trim(), lower = raw.toLowerCase(), engaged = Date.now() < this.engagedUntil, conf = Number(confidence);
        if (engaged && Number.isFinite(conf) && conf > 0 && conf < 0.38) {
          this.pause();
          await NYXVoice.say("I didn\u2019t catch that. Could you say it again?");
          this.resume();
          return;
        }
        let wakeIndex = -1, wakeAlias = "";
        if (!engaged) {
          for (const alias of aliases) {
            const idx = lower.indexOf(alias);
            if (idx >= 0 && (wakeIndex < 0 || idx < wakeIndex)) {
              wakeIndex = idx;
              wakeAlias = alias;
            }
          }
          if (wakeIndex < 0) return;
        }
        this.pause();
        let message = raw;
        if (!engaged) {
          const after = raw.slice(wakeIndex + wakeAlias.length).replace(/^[\s,.:;!?-]+/, "").trim();
          message = after.replace(/^(?:hey|hi|hello)\b[\s,.:;!?-]*/i, "").trim();
          if (!message) {
            this.engagedUntil = Date.now() + 45e3;
            await NYXVoice.say("Yeah?");
            this.resume();
            return;
          }
        }
        if (!message || message.length < 2) {
          await NYXVoice.say("I didn\u2019t catch that. Could you say it again?");
          this.resume();
          return;
        }
        this.engagedUntil = Date.now() + 45e3;
        await send(message, { voiceTurn: true });
      } finally {
        this.turnBusy = false;
      }
    }
  };
  document.getElementById("wakeToggle").onclick = () => NYXHandsFree.active ? NYXHandsFree.disable() : NYXHandsFree.enable();
  const nyxDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  async function nyxTimed(promise, ms, label) {
    let timer;
    try {
      return await Promise.race([Promise.resolve(promise), new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(label || "Timed out")), ms);
      })]);
    } finally {
      clearTimeout(timer);
    }
  }
  async function nyxPrimeFirstRun() {
    var _a;
    if (!((_a = navigator.mediaDevices) == null ? void 0 : _a.getUserMedia)) throw new Error("Microphone access is not available in this browser.");
    const microphone = nyxMediaRequest(navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false }), 5500, "Microphone permission timed out.");
    const sound = nyxTimed(NYXSound.prime(), 1800, "Sound startup timed out").then(() => NYXSound.cue("startup")).catch(() => false);
    const voice = nyxTimed(NYXVoice.prime(), 1800, "Voice startup timed out").catch(() => false);
    const [stream] = await Promise.all([microphone, sound, voice]);
    return stream;
  }
  let nyxStartupAudioCache = null;
  const NYXWakeTraining = {
    module: null,
    async load() {
      if (!this.module) this.module = await Promise.resolve().then(() => __toESM(require("./nyx-wake-training.js")));
      return this.module;
    },
    async count() {
      try {
        return (await (await this.load()).listWakeTrainingSamples({ profileId: credential == null ? void 0 : credential.id, deviceId: nyxDeviceId() })).length;
      } catch (e) {
        return 0;
      }
    },
    async clear() {
      return (await this.load()).clearWakeTrainingSamples({ profileId: credential == null ? void 0 : credential.id, deviceId: nyxDeviceId() });
    },
    async export() {
      return (await this.load()).exportWakeTrainingBundle({ profileId: credential == null ? void 0 : credential.id, deviceId: nyxDeviceId(), download: true });
    },
    async save(blob, meta = {}) {
      return (await this.load()).saveWakeTrainingSample(__spreadValues({ profileId: credential == null ? void 0 : credential.id, deviceId: nyxDeviceId(), blob, mimeType: blob.type }, meta));
    }
  };
  window.NYXWakeTraining = NYXWakeTraining;
  function nyxStartupAudio() {
    if (nyxStartupAudioCache) return nyxStartupAudioCache;
    const rate = 22050, segments = [{ f: 262, d: 0.22 }, { f: 392, d: 0.24 }, { f: 659, d: 0.34 }], gap = 0.045, total = segments.reduce((n, x) => n + x.d, 0) + gap * (segments.length - 1), samples = Math.ceil(total * rate), bytes = new ArrayBuffer(44 + samples * 2), view2 = new DataView(bytes);
    const write = (o, t) => {
      for (let i = 0; i < t.length; i++) view2.setUint8(o + i, t.charCodeAt(i));
    };
    write(0, "RIFF");
    view2.setUint32(4, 36 + samples * 2, true);
    write(8, "WAVE");
    write(12, "fmt ");
    view2.setUint32(16, 16, true);
    view2.setUint16(20, 1, true);
    view2.setUint16(22, 1, true);
    view2.setUint32(24, rate, true);
    view2.setUint32(28, rate * 2, true);
    view2.setUint16(32, 2, true);
    view2.setUint16(34, 16, true);
    write(36, "data");
    view2.setUint32(40, samples * 2, true);
    let cursor = 0;
    for (const seg of segments) {
      const count = Math.floor(seg.d * rate);
      for (let i = 0; i < count; i++) {
        const env = Math.sin(Math.PI * i / Math.max(1, count - 1));
        const sample = Math.sin(2 * Math.PI * seg.f * i / rate) * env * 0.42;
        view2.setInt16(44 + (cursor + i) * 2, Math.max(-1, Math.min(1, sample)) * 32767, true);
      }
      cursor += count;
      cursor += Math.floor(gap * rate);
    }
    const url = URL.createObjectURL(new Blob([bytes], { type: "audio/wav" })), audio = new Audio(url);
    audio.preload = "auto";
    audio.volume = 1;
    nyxStartupAudioCache = audio;
    return audio;
  }
  const NYXExperience = {
    settings: null,
    onboardingStream: null,
    async prompt(text) {
      const speech = NYXVoice.say(text), token = NYXVoice.speechToken;
      try {
        return await nyxTimed(speech, 7e3, "Voice prompt timed out.");
      } catch (e) {
        if (token === NYXVoice.speechToken) NYXVoice.stopSpeech();
        return false;
      }
    },
    onboardingStreamReady() {
      var _a, _b;
      return Boolean((_b = (_a = this.onboardingStream) == null ? void 0 : _a.getAudioTracks) == null ? void 0 : _b.call(_a).some((track) => track.readyState === "live"));
    },
    stopOnboardingStream() {
      var _a, _b;
      try {
        (_b = (_a = this.onboardingStream) == null ? void 0 : _a.getTracks) == null ? void 0 : _b.call(_a).forEach((track) => track.stop());
      } catch (e) {
      }
      this.onboardingStream = null;
    },
    async ensureOnboardingStream() {
      var _a;
      if (this.onboardingStreamReady()) return this.onboardingStream;
      if (!((_a = navigator.mediaDevices) == null ? void 0 : _a.getUserMedia)) throw new Error("Microphone access is not available.");
      this.stopOnboardingStream();
      this.onboardingStream = await nyxMediaRequest(navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false }), 5500, "Microphone permission timed out.");
      return this.onboardingStream;
    },
    async load() {
      try {
        const d = await api("/api/experience", { timeoutMs: 6e3 });
        this.settings = d.settings;
        applyInterfacePreferences();
      } catch (e) {
        this.settings = this.settings || { voiceEnabled: true, voiceAssistantMode: true, handsFreeEnabled: false, handsFreeConfigured: false, wakeEnrollmentComplete: false, wakeEnrollmentSamples: 0, wakeEnrollmentVersion: 0, wakeEnrollmentDeviceId: null, wakeEnrollments: {}, soundMode: "minimal", decorativeSounds: true, onboarded: true, onboardingVersion: 2, preferredName: (credential == null ? void 0 : credential.displayName) || null, visibleModules: ["world", "devices", "health", "security", "memories", "music", "vehicle"] };
        applyInterfacePreferences();
      }
    },
    async save(patch) {
      try {
        const d = await api("/api/experience", { method: "POST", body: JSON.stringify(patch) });
        this.settings = d.settings;
      } catch (e) {
        const card = document.getElementById("nyxOnboardCard");
        if (card) card.insertAdjacentHTML("beforeend", '<p class="small" role="alert">'.concat(esc(e.message), ". Please try again.</p>"));
        throw e;
      }
    },
    state(value) {
      var _a, _b;
      document.body.dataset.nyxState = value;
      (_a = document.querySelector(".living-rose")) == null ? void 0 : _a.classList.toggle("listening", value === "listening");
      (_b = document.querySelector(".living-rose")) == null ? void 0 : _b.classList.toggle("speaking", value === "speaking");
    },
    needsOnboarding() {
      var _a;
      return Number(((_a = this.settings) == null ? void 0 : _a.onboardingVersion) || 0) < 2;
    },
    voiceSessionEnabled() {
      var _a, _b, _c;
      return ((_a = this.settings) == null ? void 0 : _a.voiceEnabled) !== false && ((_b = this.settings) == null ? void 0 : _b.handsFreeEnabled) === true && ((_c = this.settings) == null ? void 0 : _c.voiceAssistantMode) !== false;
    },
    wakeEnrollmentRecord() {
      var _a, _b, _c, _d, _e, _f, _g;
      const id = nyxDeviceId(), record = (_b = (_a = this.settings) == null ? void 0 : _a.wakeEnrollments) == null ? void 0 : _b[id];
      if (record) return record;
      if (((_c = this.settings) == null ? void 0 : _c.wakeEnrollmentDeviceId) === id) return { complete: ((_d = this.settings) == null ? void 0 : _d.wakeEnrollmentComplete) === true, samples: Number(((_e = this.settings) == null ? void 0 : _e.wakeEnrollmentSamples) || 0), version: Number(((_f = this.settings) == null ? void 0 : _f.wakeEnrollmentVersion) || 0), updatedAt: ((_g = this.settings) == null ? void 0 : _g.wakeEnrollmentUpdatedAt) || null };
      return null;
    },
    wakeEnrollmentReady() {
      const record = this.wakeEnrollmentRecord();
      return (record == null ? void 0 : record.complete) === true && Number((record == null ? void 0 : record.version) || 0) >= 1 && Number((record == null ? void 0 : record.samples) || 0) >= 5;
    },
    async saveWakeEnrollment({ complete, samples }) {
      var _a;
      const deviceId = nyxDeviceId(), wakeEnrollments = __spreadValues({}, ((_a = this.settings) == null ? void 0 : _a.wakeEnrollments) || {}), updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      wakeEnrollments[deviceId] = { complete: complete === true, samples: Number(samples) || 0, version: 1, updatedAt };
      await this.save({ wakeEnrollments, wakeEnrollmentComplete: complete === true, wakeEnrollmentSamples: Number(samples) || 0, wakeEnrollmentVersion: 1, wakeEnrollmentDeviceId: deviceId, wakeEnrollmentUpdatedAt: updatedAt, handsFreeConfigured: true });
    },
    async captureWakeSample(promptKind, promptText) {
      var _a;
      const host = document.getElementById("nyxOnboard"), card = document.getElementById("nyxOnboardCard");
      card.innerHTML = "<h2>".concat(esc(promptText), '</h2><div style="display:grid;place-items:center;padding:24px 0"><div class="nyx-voice-orb" style="width:92px;height:92px;border-radius:50%;border:1px solid #83d0ff88;box-shadow:0 0 34px #287cff66,inset 0 0 24px #1b59b855;display:grid;place-items:center;font-size:1.8rem">\u25C9</div></div><p id="nyxWakeCaptureStatus" class="small" style="text-align:center">Get ready\u2026</p>');
      await NYXVoice.say(promptText);
      if (!((_a = navigator.mediaDevices) == null ? void 0 : _a.getUserMedia) || !window.MediaRecorder) throw new Error("This browser cannot capture wake-training audio.");
      const stream = await nyxMediaRequest(navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false }), 5500, "Microphone permission timed out.");
      const type = ["audio/mp4", "audio/webm", "audio/ogg"].find((t) => MediaRecorder.isTypeSupported(t));
      const recorder = type ? new MediaRecorder(stream, { mimeType: type }) : new MediaRecorder(stream), chunks = [];
      const status = document.getElementById("nyxWakeCaptureStatus");
      recorder.ondataavailable = (e) => {
        var _a2;
        if ((_a2 = e.data) == null ? void 0 : _a2.size) chunks.push(e.data);
      };
      const stopped = new Promise((resolve) => recorder.onstop = resolve);
      status.textContent = "Say \u201CNyx\u201D now.";
      this.state("listening");
      recorder.start();
      await nyxDelay(1800);
      try {
        if (recorder.state !== "inactive") recorder.stop();
      } catch (e) {
      }
      await stopped;
      stream.getTracks().forEach((t) => t.stop());
      this.state("idle");
      const blob = new Blob(chunks, { type: recorder.mimeType || "audio/mp4" });
      if (blob.size < 180) throw new Error("I didn\u2019t capture enough audio.");
      const audio = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = () => reject(Error("Could not read wake sample."));
        reader.readAsDataURL(blob);
      });
      status.textContent = "Checking that sample\u2026";
      const result = await api("/api/voice/transcribe", { method: "POST", timeoutMs: 7e3, body: JSON.stringify({ audio, type: blob.type.split(";")[0] || "audio/mp4" }) });
      const transcript = String(result.text || "").trim(), normalized = transcript.toLowerCase().replace(/[^a-z]/g, "");
      const accepted = ["nyx", "nix", "nicks"].includes(normalized);
      if (accepted) await NYXWakeTraining.save(blob, { label: "positive", promptKind, transcript });
      return { accepted, transcript, blob };
    },
    async enrollWakeWord({ returnToSettings = false } = {}) {
      if (!credential) return false;
      NYXHandsFree.stop();
      NYXVoice.stopSpeech();
      const host = document.getElementById("nyxOnboard"), card = document.getElementById("nyxOnboardCard");
      host.classList.add("show");
      card.innerHTML = '<h2>Teach me how you say Nyx</h2><p>I\u2019ll record five short wake-word samples and keep the accepted clips only in this browser on this device for Nyx wake-model training. During setup, each clip is temporarily sent through NyxThea transcription only to confirm that it says \u201CNyx\u201D; the raw clip is not stored on the server.</p><button id="beginWakeSamples" class="primary">Record my five Nyx samples</button><button id="cancelWakeSamples" class="secondary">Not now</button>';
      const consent = await new Promise((resolve) => {
        document.getElementById("beginWakeSamples").onclick = () => resolve(true);
        document.getElementById("cancelWakeSamples").onclick = () => resolve(false);
      });
      if (!consent) {
        host.classList.remove("show");
        if (returnToSettings) void accountSettings();
        return false;
      }
      const prompts = [["normal", "Say Nyx in your normal voice."], ["soft", "Say Nyx a little softer."], ["loud", "Say Nyx a little louder."], ["attention", "Say Nyx naturally, like you\u2019re getting my attention."], ["final", "One more time. Say Nyx."]];
      let completed = 0;
      for (let i = 0; i < prompts.length; i++) {
        let accepted = false, tries = 0;
        while (!accepted && tries < 3) {
          tries++;
          try {
            const sample = await this.captureWakeSample(prompts[i][0], prompts[i][1]);
            accepted = sample.accepted;
          } catch (error) {
            card.insertAdjacentHTML("beforeend", '<p class="small" role="alert">'.concat(esc(error.message || "Wake sample capture failed."), "</p>"));
          }
          if (!accepted) {
            card.insertAdjacentHTML("beforeend", '<p class="small" role="alert">I didn\u2019t hear \u201CNyx\u201D clearly enough. Try that sample again.</p>');
            await nyxDelay(500);
          }
        }
        if (!accepted) {
          await this.saveWakeEnrollment({ complete: false, samples: completed });
          await this.save({ handsFreeEnabled: false });
          card.innerHTML = '<h2>Nyx setup paused</h2><p>I couldn\u2019t confirm all five samples. Hands-free wake stays off, but you can still use tap-to-talk and text.</p><button id="retryWakeEnrollment" class="primary">Try Nyx setup again</button><button id="leaveWakeEnrollment" class="secondary">Not now</button>';
          return await new Promise((resolve) => {
            document.getElementById("retryWakeEnrollment").onclick = async () => resolve(await this.enrollWakeWord({ returnToSettings }));
            document.getElementById("leaveWakeEnrollment").onclick = () => {
              host.classList.remove("show");
              if (returnToSettings) void accountSettings();
              resolve(false);
            };
          });
        }
        completed = i + 1;
        await this.saveWakeEnrollment({ complete: false, samples: completed });
      }
      await this.saveWakeEnrollment({ complete: true, samples: 5 });
      NYXSound.cue("success");
      card.innerHTML = '<h2>Nyx knows this device</h2><p>Five wake samples confirmed. Say \u201CNyx\u201D to get my attention. This setup is calibration, not identity verification.</p><button id="finishWakeEnrollment" class="primary">Continue</button>';
      return await new Promise((resolve) => {
        document.getElementById("finishWakeEnrollment").onclick = () => {
          host.classList.remove("show");
          if (returnToSettings) void accountSettings();
          resolve(true);
        };
      });
    },
    async startVoiceSession() {
      var _a, _b, _c;
      if (!this.voiceSessionEnabled()) {
        state("ready", ((_a = this.settings) == null ? void 0 : _a.voiceEnabled) === false ? "Voice is disabled in your profile." : "Wake-by-name is off. Use the microphone button when you want to talk.");
        return;
      }
      if (!this.wakeEnrollmentReady()) {
        const enrolled = await this.enrollWakeWord();
        if (!enrolled) return;
      }
      const host = document.getElementById("nyxOnboard"), card = document.getElementById("nyxOnboardCard");
      host.classList.add("show");
      const name = ((_b = this.settings) == null ? void 0 : _b.pronunciation) || ((_c = this.settings) == null ? void 0 : _c.preferredName) || (credential == null ? void 0 : credential.displayName) || "";
      const greeting = name ? "Hey " + name + ". I\u2019m here." : "Hey. I\u2019m here.";
      card.innerHTML = '<h2>Start NYX</h2><p>Tap once to start voice for this iPhone session.</p><button id="nyxStartSession" class="primary">Start NYX</button><p id="nyxStartSessionStatus" class="small"></p>';
      const button = document.getElementById("nyxStartSession"), status = document.getElementById("nyxStartSessionStatus");
      button.onclick = async () => {
        var _a2;
        if (button.disabled) return;
        button.disabled = true;
        button.textContent = "Starting\u2026";
        status.textContent = "Opening microphone\u2026";
        NYXSound.forceSession = true;
        try {
          const cue = nyxStartupAudio();
          cue.currentTime = 0;
          void cue.play().catch(() => {
          });
        } catch (e) {
        }
        let wakeStream = null;
        try {
          if (!((_a2 = navigator.mediaDevices) == null ? void 0 : _a2.getUserMedia)) throw new Error("Microphone access is not available.");
          wakeStream = await nyxMediaRequest(navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false }), 4500, "Microphone permission timed out.");
        } catch (e) {
          status.textContent = ((e == null ? void 0 : e.message) || "Microphone could not start.") + " Tap Start NYX to try again.";
          button.disabled = false;
          button.textContent = "Start NYX";
          return;
        }
        host.classList.remove("show");
        status.textContent = "NYX is ready.";
        const greetingResult = NYXVoice.say(greeting);
        const spoken = await nyxTimed(greetingResult, 7e3, "Greeting voice timed out.").catch(() => false);
        if (!spoken) {
          NYXVoice.stopSpeech();
          state("ready", "Voice ready");
        }
        await NYXHandsFree.startWithStream(wakeStream);
      };
    },
    async sayAndListen(prompt, { hint = "I\u2019m listening\u2026", timeout = 12e3, allowTyped = true, requireTap = false } = {}) {
      const card = document.getElementById("nyxOnboardCard");
      card.innerHTML = "<h2>".concat(esc(prompt), '</h2><div style="display:grid;place-items:center;padding:26px 0"><div class="nyx-voice-orb" style="width:92px;height:92px;border-radius:50%;border:1px solid #83d0ff88;box-shadow:0 0 34px #287cff66, inset 0 0 24px #1b59b855;display:grid;place-items:center;font-size:1.8rem">\u25C9</div></div><p id="nyxVoiceStatus" class="small" style="text-align:center">').concat(esc(hint), '</p><button id="nyxVoiceRetry" class="secondary" hidden>Tap once to answer</button><button id="nyxTypeInstead" class="secondary"').concat(allowTyped ? "" : " hidden", '>Type instead</button><input id="nyxVoiceTyped" class="field" hidden placeholder="Type your answer instead"><button id="nyxVoiceTypedSubmit" class="secondary" hidden>Continue with typed answer</button>');
      return new Promise((resolve) => {
        const status = document.getElementById("nyxVoiceStatus"), retry = document.getElementById("nyxVoiceRetry"), typed = document.getElementById("nyxVoiceTyped"), typedSubmit = document.getElementById("nyxVoiceTypedSubmit");
        let finished = false, typing = false, timer = null, attempts = 0, retrying = false, stream = null, recorder = null, recognition = null;
        const cleanup = () => {
          clearTimeout(timer);
          timer = null;
          const active = recorder;
          recorder = null;
          if (active) {
            active.onstop = null;
            active.onerror = null;
            try {
              if (active.state !== "inactive") active.stop();
            } catch (e) {
            }
          }
          const speech = recognition;
          recognition = null;
          if (speech) {
            speech.onend = null;
            speech.onerror = null;
            try {
              speech.abort();
            } catch (e) {
            }
          }
          stream = null;
          this.state("idle");
        };
        const done = (value) => {
          if (finished) return;
          finished = true;
          NYXVoice.stopSpeech();
          cleanup();
          resolve(String(value || "").trim());
        };
        const showTyped = (message) => {
          if (finished) return;
          typing = true;
          NYXVoice.stopSpeech();
          cleanup();
          status.textContent = message || "You can type this answer instead.";
          retry.hidden = true;
          if (allowTyped) {
            typed.hidden = false;
            typedSubmit.hidden = false;
            typed.focus();
          } else done("");
        };
        const miss = async (message) => {
          if (finished || typing || retrying) return;
          retrying = true;
          cleanup();
          attempts++;
          if (attempts <= 2) {
            status.textContent = message || "I didn\u2019t catch that.";
            await this.prompt("I didn\u2019t catch that. Say that again for me.");
            retrying = false;
            if (!finished && !typing) timer = setTimeout(begin, 380);
          } else {
            status.textContent = "I\u2019m having trouble hearing you. Tap once and try again, or type your answer.";
            retry.hidden = false;
            if (allowTyped) {
              typed.hidden = false;
              typedSubmit.hidden = false;
            }
          }
        };
        const transcribeBlob = async (blob) => {
          if (blob.size < 100) throw new Error("No speech was captured.");
          if (blob.size > 1e6) throw new Error("Recording was too large.");
          const audio = await new Promise((resolveAudio, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolveAudio(String(reader.result).split(",")[1]);
            reader.onerror = () => reject(Error("Could not read the recording."));
            reader.readAsDataURL(blob);
          });
          const result = await api("/api/voice/transcribe", { method: "POST", timeoutMs: 7e3, body: JSON.stringify({ audio, type: blob.type.split(";")[0] || "audio/mp4" }) });
          return String(result.text || "").trim();
        };
        const beginMedia = async () => {
          try {
            stream = await this.ensureOnboardingStream();
            if (finished || typing) return;
            const type = ["audio/mp4", "audio/webm", "audio/ogg"].find((t) => MediaRecorder.isTypeSupported(t));
            recorder = type ? new MediaRecorder(stream, { mimeType: type }) : new MediaRecorder(stream);
            const chunks = [];
            recorder.ondataavailable = (e) => {
              var _a;
              if ((_a = e.data) == null ? void 0 : _a.size) chunks.push(e.data);
            };
            recorder.onstart = () => {
              status.textContent = "Listening\u2026";
              this.state("listening");
            };
            recorder.onerror = () => void miss("I couldn\u2019t use the microphone.");
            recorder.onstop = async () => {
              stream = null;
              const localRecorder = recorder;
              recorder = null;
              if (finished || typing || retrying) return;
              this.state("thinking");
              status.textContent = "Listening back\u2026";
              try {
                const blob = new Blob(chunks, { type: (localRecorder == null ? void 0 : localRecorder.mimeType) || type || "audio/mp4" }), text = await transcribeBlob(blob);
                if (finished || typing) return;
                if (text) done(text);
                else await miss("I didn\u2019t catch that.");
              } catch (error) {
                await miss((error == null ? void 0 : error.message) || "I didn\u2019t catch that.");
              }
            };
            recorder.start();
            timer = setTimeout(() => {
              try {
                if ((recorder == null ? void 0 : recorder.state) !== "inactive") recorder.stop();
              } catch (e) {
              }
            }, Math.min(6500, Math.max(3e3, timeout - 1500)));
          } catch (error) {
            if ((error == null ? void 0 : error.name) === "NotAllowedError") {
              showTyped("Microphone access is blocked. You can type this answer instead.");
              return;
            }
            await miss((error == null ? void 0 : error.message) || "I couldn\u2019t start the microphone.");
          }
        };
        const beginSpeech = () => {
          const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (!SR) {
            showTyped("Voice recognition isn\u2019t available here.");
            return;
          }
          try {
            recognition = new SR();
            recognition.lang = "en-US";
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
            recognition.onstart = () => {
              status.textContent = "Listening\u2026";
              this.state("listening");
            };
            recognition.onresult = (e) => {
              var _a, _b, _c, _d;
              const text = ((_d = (_c = (_b = (_a = e.results) == null ? void 0 : _a[0]) == null ? void 0 : _b[0]) == null ? void 0 : _c.transcript) == null ? void 0 : _d.trim()) || "";
              if (text) done(text);
              else void miss("I didn\u2019t catch that.");
            };
            recognition.onerror = (e) => {
              if (["not-allowed", "service-not-allowed"].includes(e.error)) showTyped("Microphone recognition is blocked. You can type this answer instead.");
              else void miss("I didn\u2019t catch that.");
            };
            recognition.onend = () => {
              if (!finished && !retrying && recognition) {
                recognition = null;
                void miss("I didn\u2019t catch that.");
              }
            };
            recognition.start();
            timer = setTimeout(() => void miss("I didn\u2019t catch that."), timeout);
          } catch (e) {
            showTyped("Voice recognition isn\u2019t available here. You can type this answer instead.");
          }
        };
        const begin = () => {
          var _a;
          if (finished || typing || retrying) return;
          cleanup();
          if (((_a = navigator.mediaDevices) == null ? void 0 : _a.getUserMedia) && window.MediaRecorder) void beginMedia();
          else beginSpeech();
        };
        retry.onclick = () => {
          retry.hidden = true;
          typed.hidden = true;
          typedSubmit.hidden = true;
          attempts = 0;
          typing = false;
          NYXVoice.stopSpeech();
          begin();
        };
        typedSubmit.onclick = () => {
          const value = typed.value.trim();
          if (value) done(value);
        };
        typed.onkeydown = (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            typedSubmit.click();
          }
        };
        document.getElementById("nyxTypeInstead").onclick = () => showTyped("Type your answer below.");
        if (this.onboardingTyped) {
          showTyped("Type your answer below.");
          return;
        }
        void this.prompt(prompt).then(() => {
          if (finished || typing) return;
          if (requireTap) {
            status.textContent = hint || "Tap once when you're ready.";
            retry.hidden = false;
            retry.textContent = "Tap to answer";
          } else timer = setTimeout(begin, 420);
        });
      });
    },
    async onboard(edit = false) {
      try {
        return await this.runOnboarding(edit);
      } catch (error) {
        this.stopOnboardingStream();
        NYXVoice.stopSpeech();
        const card = document.getElementById("nyxOnboardCard");
        card.innerHTML = '<h2>Let\u2019s try that step again</h2><p role="alert">'.concat(esc((error == null ? void 0 : error.message) || "Setup could not finish."), '</p><button id="nyxRetrySetup" class="primary">Retry setup</button><button id="nyxLeaveSetup" class="secondary">Back to Home</button>');
        document.getElementById("nyxRetrySetup").onclick = () => this.onboard(edit);
        document.getElementById("nyxLeaveSetup").onclick = () => document.getElementById("nyxOnboard").classList.remove("show");
      }
    },
    async runOnboarding(edit = false) {
      if (!credential) {
        unlock();
        return;
      }
      this.onboardingTyped = false;
      shut();
      NYXHandsFree.stop();
      const host = document.getElementById("nyxOnboard"), card = document.getElementById("nyxOnboardCard");
      host.classList.add("show");
      card.innerHTML = '<h2>Meet NYX</h2><p>One tap lets NYX use your speaker and microphone for this introduction. After that, you can talk naturally without typing.</p><button id="nyxBeginVoice" class="primary">Meet NYX</button><button id="nyxBeginTyped" class="secondary">Use typed setup instead</button><p id="nyxBeginStatus" class="small"></p>';
      await new Promise((resolve) => {
        const button = document.getElementById("nyxBeginVoice"), status = document.getElementById("nyxBeginStatus");
        let running = false;
        document.getElementById("nyxBeginTyped").onclick = () => {
          if (running) return;
          this.onboardingTyped = true;
          resolve();
        };
        button.onclick = async () => {
          if (running) return;
          running = true;
          button.disabled = true;
          button.textContent = "Opening NYX\u2026";
          status.textContent = "Opening voice\u2026";
          try {
            this.stopOnboardingStream();
            this.onboardingStream = await nyxPrimeFirstRun();
            status.textContent = "Voice ready.";
            button.textContent = "Ready";
            resolve();
          } catch (e) {
            NYXSound.cue("warning");
            status.textContent = ((e == null ? void 0 : e.message) || "Voice could not start.") + " Tap Meet NYX to try again.";
            button.disabled = false;
            button.textContent = "Meet NYX";
            running = false;
          }
        };
      });
      const cleanName = (value) => {
        let text = String(value || "").trim().replace(/[.!?]+$/, "");
        text = text.replace(/^(?:hello[,.]?\s*)?(?:my name is|i am|i'm|im|you can call me|call me|just call me|it's|its)\s+/i, "").trim();
        if (/\s+is\s+/i.test(text) && /^my\s+name/i.test(String(value || ""))) text = text.split(/\s+is\s+/i).pop().trim();
        return text.slice(0, 80);
      };
      const askConfirm = async (prompt) => {
        card.innerHTML = "<h2>".concat(esc(prompt), '</h2><p class="small">Confirm what Nyx heard before continuing.</p><div class="nyx-choice"><button id="nyxConfirmYes" class="primary">Yes, that\'s right</button><button id="nyxConfirmNo" class="secondary">No, try again</button></div>');
        return await new Promise((resolve) => {
          const answer = (value) => {
            NYXVoice.stopSpeech();
            resolve(value);
          };
          document.getElementById("nyxConfirmYes").onclick = () => answer(true);
          document.getElementById("nyxConfirmNo").onclick = () => answer(false);
          void this.prompt(prompt);
        });
      };
      let name = "";
      while (!name) {
        const rawName = await this.sayAndListen("Hello. I\u2019m NYX. Before we begin, I\u2019d like to know what to call you.", { hint: "Say your name, for example: My name is Cheyenne." });
        if (!rawName) {
          this.stopOnboardingStream();
          card.innerHTML = '<h2>I lost the microphone.</h2><p>Tap below to try the spoken introduction again.</p><button id="nyxRestartVoice" class="primary">Try again</button>';
          document.getElementById("nyxRestartVoice").onclick = () => this.onboard(edit);
          return;
        }
        const heardName = cleanName(rawName) || String(rawName).trim().slice(0, 80);
        const nameCorrect = await askConfirm("I heard " + heardName + ". Is that what you want me to call you?");
        if (nameCorrect) {
          name = heardName;
          break;
        }
        await this.prompt("Okay. I won\u2019t save that. Tell me your name again.");
      }
      await this.save({ preferredName: name });
      await api("/api/household/identity", { method: "POST", body: JSON.stringify({ preferredName: name }) });
      await this.prompt("Nice to meet you, " + name + ".");
      let pronunciation = name, pronunciationConfirmed = false;
      while (!pronunciationConfirmed) {
        const spokenPronunciation = await this.sayAndListen("How would you like me to pronounce " + name + "? Say it exactly the way you want me to say it.", { hint: "Tap once, then say your name the way it should sound.", requireTap: true });
        if (spokenPronunciation) pronunciation = cleanName(spokenPronunciation) || pronunciation;
        await this.prompt("Let me try it. " + pronunciation + ".");
        pronunciationConfirmed = await askConfirm("Did I pronounce " + name + " correctly?");
        if (!pronunciationConfirmed) await this.prompt("Okay. Let\u2019s try that again. I won\u2019t move on until I get it right.");
      }
      await this.save({ pronunciation });
      await api("/api/household/identity", { method: "POST", body: JSON.stringify({ pronunciation }) });
      const birthdaySpoken = await this.sayAndListen("When is your birthday? You can say something like July fourth nineteen ninety.", { hint: "Say your month, day, and year." });
      if (birthdaySpoken) {
        const parsed = new Date(birthdaySpoken);
        if (!Number.isNaN(parsed.getTime())) {
          const birthday = [parsed.getFullYear(), String(parsed.getMonth() + 1).padStart(2, "0"), String(parsed.getDate()).padStart(2, "0")].join("-");
          try {
            await api("/api/household/identity", { method: "POST", body: JSON.stringify({ birthday }) });
          } catch (e) {
          }
        }
      }
      card.innerHTML = '<h2>How much should I speak up?</h2><div class="nyx-choice"><button data-p="quiet"><strong>Quiet</strong><br>I\u2019m here when you ask.</button><button data-p="helpful"><strong>Helpful \u2014 Recommended</strong><br>I\u2019ll speak up when something genuinely matters.</button><button data-p="engaged"><strong>Engaged</strong><br>Be involved. Notice things and suggest what\u2019s next.</button></div>';
      host.querySelectorAll("[data-p]").forEach((b) => b.onclick = async () => {
        try {
          await this.save({ proactiveMode: b.dataset.p });
          this.style(name, host);
        } catch (e) {
          const status = host.querySelector("#nyxOnboardCard");
          status.innerHTML += '<p class="small">'.concat(esc(e.message), "</p>");
        }
      });
    },
    style(name, host) {
      this.stopOnboardingStream();
      host.querySelector("#nyxOnboardCard").innerHTML = '<h2>How should we talk?</h2><div class="nyx-choice"><button data-s="professional"><strong>Professional</strong><br>Straightforward and polished.</button><button data-s="natural"><strong>Natural \u2014 Recommended</strong><br>Relaxed, warm, occasional humor.</button><button data-s="unfiltered"><strong>Unfiltered</strong><br>More personality, teasing and casual language.</button></div>';
      host.querySelectorAll("[data-s]").forEach((b) => b.onclick = async () => {
        try {
          await this.save({ communicationStyle: b.dataset.s, onboarded: true, onboardingVersion: 2, voiceAssistantMode: true, handsFreeEnabled: false, handsFreeConfigured: true });
          NYXSound.cue("success");
          await this.prompt("Perfect. Now teach me how you say Nyx.");
          const enrolled = await this.enrollWakeWord();
          if (enrolled) {
            await this.save({ handsFreeEnabled: true });
            NYXHandsFree.start();
          } else {
            host.classList.remove("show");
          }
        } catch (e) {
          host.querySelector("#nyxOnboardCard").innerHTML += '<p class="small">'.concat(esc(e.message), "</p>");
        }
      });
    },
    initMic() {
      document.getElementById("nyxMic").onclick = toggleVoice;
    }
  };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      NYXExperience.stopOnboardingStream();
      NYXHandsFree.stop();
      NYXVoice.stop();
      if (guideSession || guidePending.length) endLiveGuide(false);
    } else if (credential && !NYXExperience.needsOnboarding() && NYXExperience.voiceSessionEnabled()) {
      void (async () => {
        const unlocked = await enforceProfileLock();
        if (unlocked) NYXExperience.startVoiceSession();
      })();
    }
  });
  window.addEventListener("pagehide", () => {
    NYXExperience.stopOnboardingStream();
    NYXHandsFree.stop();
    NYXVoice.stop();
    if (guideSession || guidePending.length) endLiveGuide(false);
  });
  function dismissNyxLaunch() {
    var _a;
    (_a = document.getElementById("nyxLaunch")) == null ? void 0 : _a.classList.add("done");
  }
  window.addEventListener("DOMContentLoaded", () => {
    const launchTimer = setTimeout(dismissNyxLaunch, 3200);
    setTimeout(dismissNyxLaunch, 5200);
    void (async () => {
      let unlocked = true, needs = false;
      try {
        await restoreSession();
        if (credential) {
          await NYXExperience.load();
          await loadConversationHistory();
        }
        NYXExperience.initMic();
        unlocked = credential ? await enforceProfileLock() : true;
        needs = Boolean(unlocked && credential && NYXExperience.needsOnboarding());
      } catch (e) {
        console.error("Nyx startup recovered from an initialization error.", e);
        NYXExperience.initMic();
      } finally {
        clearTimeout(launchTimer);
        dismissNyxLaunch();
      }
      setTimeout(() => {
        try {
          if (needs) NYXExperience.onboard();
          else if (sessionRestoreError) showSessionRestoreRetry(sessionRestoreError);
          else if (!credential) unlock();
          else if (unlocked && NYXExperience.voiceSessionEnabled()) NYXExperience.startVoiceSession();
        } catch (e) {
          console.error("Nyx post-launch recovery.", e);
          state("ready", "Ready when you are");
        }
      }, 250);
    })();
  });
})();
