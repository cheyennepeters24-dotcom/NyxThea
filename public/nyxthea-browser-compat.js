function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regenerator() { var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
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
  var __defNormalProp = function __defNormalProp(obj, key, value) {
    return key in obj ? __defProp(obj, key, {
      enumerable: true,
      configurable: true,
      writable: true,
      value
    }) : obj[key] = value;
  };
  var __spreadValues = function __spreadValues(a, b) {
    for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols) {
      var _iterator = _createForOfIteratorHelper(__getOwnPropSymbols(b)),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var prop = _step.value;
          if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return a;
  };
  var __spreadProps = function __spreadProps(a, b) {
    return __defProps(a, __getOwnPropDescs(b));
  };
  var __objRest = function __objRest(source, exclude) {
    var target = {};
    for (var prop in source) if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0) target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols) {
      var _iterator2 = _createForOfIteratorHelper(__getOwnPropSymbols(source)),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var prop = _step2.value;
          if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop)) target[prop] = source[prop];
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    return target;
  };
  var __copyProps = function __copyProps(to, from, except, desc2) {
    if (from && typeof from === "object" || typeof from === "function") {
      var _iterator3 = _createForOfIteratorHelper(__getOwnPropNames(from)),
        _step3;
      try {
        var _loop = function _loop() {
          var key = _step3.value;
          if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: function get() {
              return from[key];
            },
            enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable
          });
        };
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
    return to;
  };
  var __toESM = function __toESM(mod, isNodeMode, target) {
    return target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
      value: mod,
      enumerable: true
    }) : target, mod);
  };
  var $ = function $(s) {
    return document.querySelector(s);
  };
  var $$ = function $$(s) {
    return _toConsumableArray(document.querySelectorAll(s));
  };
  var esc = function esc(v) {
    return String(v != null ? v : "").replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[c];
    });
  };
  var credential = null;
  var settingsAuthToken = null;
  var sessionRestoreError = null;
  var conversationHistory = [];
  var conversationEpoch = 0;
  var chatControllers = new Set();
  try {
    localStorage.removeItem("nyxtheaCredential");
  } catch (e) {}
  var modal = $("#modal");
  var title = $("#modalTitle");
  var body = $("#modalBody");
  var input = $("#input");
  var rose = $("#livingRose");
  var mic = $("#mic");
  var guideSession = null;
  var guideStream = null;
  var guideTimer = null;
  var guideRecognition = null;
  var guideTranscript = "";
  var guideBusy = false;
  var guideToken = 0;
  var guidePending = [];
  var guideResumeHandsFree = false;
  function session() {
    var ok = !!credential,
      s = $("#sideStatus");
    s.classList.toggle("unlocked", ok);
    s.lastElementChild.textContent = ok ? "Signed in as " + credential.displayName : "Session locked";
    $("#unlock").lastElementChild.textContent = ok ? credential.displayName : "Private profile";
  }
  function api(_x) {
    return _api.apply(this, arguments);
  }
  function _api() {
    _api = _asyncToGenerator(_regenerator().m(function _callee55(path) {
      var o,
        method,
        sensitiveSettingsRequest,
        timeoutMs,
        controller,
        external,
        timedOut,
        timer,
        _a,
        _timeout,
        _signal,
        _a$settingsAuth,
        settingsAuth,
        rest,
        r,
        d,
        e,
        err,
        _args55 = arguments,
        _t38;
      return _regenerator().w(function (_context55) {
        while (1) switch (_context55.p = _context55.n) {
          case 0:
            o = _args55.length > 1 && _args55[1] !== undefined ? _args55[1] : {};
            method = String(o.method || "GET").toUpperCase(), sensitiveSettingsRequest = ["/api/settings/change-password", "/api/recovery/email/start", "/api/recovery/email/confirm", "/api/household/member-identity", "/api/profile-lock/pin"].includes(path) || path === "/api/profile-lock/biometric" && (method === "POST" || method === "DELETE") || /^\/api\/devices\/[^/]+\/trust$/.test(path) || path === "/api/profile-lock" && method === "DELETE";
            timeoutMs = Number(o.timeoutMs) || (path.startsWith("/api/voice/") || path.startsWith("/api/live-guide") ? 7e3 : 12e3), controller = new AbortController(), external = o.signal;
            timedOut = false;
            timer = setTimeout(function () {
              timedOut = true;
              controller.abort();
            }, timeoutMs);
            if (external) {
              if (external.aborted) controller.abort();else external.addEventListener("abort", function () {
                return controller.abort();
              }, {
                once: true
              });
            }
            _a = o, _timeout = _a.timeoutMs, _signal = _a.signal, _a$settingsAuth = _a.settingsAuth, settingsAuth = _a$settingsAuth === void 0 ? false : _a$settingsAuth, rest = __objRest(_a, ["timeoutMs", "signal", "settingsAuth"]);
            _context55.p = 1;
            _context55.n = 2;
            return fetch(path, __spreadProps(__spreadValues({}, rest), {
              signal: controller.signal,
              credentials: "same-origin",
              headers: __spreadValues(__spreadValues({
                "content-type": "application/json",
                "x-nyxthea-device": nyxDeviceId()
              }, settingsAuth && settingsAuthToken ? {
                "x-nyxthea-settings-auth": settingsAuthToken
              } : {}), o.headers || {})
            }));
          case 2:
            r = _context55.v;
            _context55.n = 3;
            return r.json().catch(function () {
              return {
                error: "Unreadable response."
              };
            });
          case 3:
            d = _context55.v;
            if (r.ok) {
              _context55.n = 4;
              break;
            }
            e = Error(d.error || "Request failed");
            e.status = r.status;
            throw e;
          case 4:
            if (sensitiveSettingsRequest) settingsAuthToken = null;
            return _context55.a(2, d);
          case 5:
            _context55.p = 5;
            _t38 = _context55.v;
            if (!timedOut) {
              _context55.n = 6;
              break;
            }
            err = Error("Nyx took too long to respond. Try that again.");
            err.status = 504;
            throw err;
          case 6:
            throw _t38;
          case 7:
            _context55.p = 7;
            clearTimeout(timer);
            return _context55.f(7);
          case 8:
            return _context55.a(2);
        }
      }, _callee55, null, [[1, 5, 7, 8]]);
    }));
    return _api.apply(this, arguments);
  }
  function nyxMediaRequest(_x2) {
    return _nyxMediaRequest.apply(this, arguments);
  }
  function _nyxMediaRequest() {
    _nyxMediaRequest = _asyncToGenerator(_regenerator().m(function _callee56(promise) {
      var ms,
        label,
        expired,
        _args56 = arguments,
        _t39;
      return _regenerator().w(function (_context56) {
        while (1) switch (_context56.p = _context56.n) {
          case 0:
            ms = _args56.length > 1 && _args56[1] !== undefined ? _args56[1] : 7e3;
            label = _args56.length > 2 && _args56[2] !== undefined ? _args56[2] : "Media permission timed out.";
            expired = false;
            _context56.p = 1;
            _context56.n = 2;
            return nyxTimed(promise, ms, label);
          case 2:
            return _context56.a(2, _context56.v);
          case 3:
            _context56.p = 3;
            _t39 = _context56.v;
            expired = true;
            Promise.resolve(promise).then(function (stream) {
              var _a;
              try {
                (_a = stream == null ? void 0 : stream.getTracks) == null ? void 0 : _a.call(stream).forEach(function (t) {
                  return t.stop();
                });
              } catch (e2) {}
            }).catch(function () {});
            throw _t39;
          case 4:
            return _context56.a(2);
        }
      }, _callee56, null, [[1, 3]]);
    }));
    return _nyxMediaRequest.apply(this, arguments);
  }
  var nyxSessionDeviceId = null;
  function nyxDeviceId() {
    if (nyxSessionDeviceId) return nyxSessionDeviceId;
    try {
      nyxSessionDeviceId = localStorage.getItem("nyxtheaDeviceId");
    } catch (e) {}
    if (!nyxSessionDeviceId) {
      nyxSessionDeviceId = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint8Array(16)), function (b) {
        return b.toString(16).padStart(2, "0");
      }).join("");
      try {
        localStorage.setItem("nyxtheaDeviceId", nyxSessionDeviceId);
      } catch (e) {}
    }
    return nyxSessionDeviceId;
  }
  function registerThisDevice() {
    return _registerThisDevice.apply(this, arguments);
  }
  function _registerThisDevice() {
    _registerThisDevice = _asyncToGenerator(_regenerator().m(function _callee57() {
      var _t40;
      return _regenerator().w(function (_context57) {
        while (1) switch (_context57.p = _context57.n) {
          case 0:
            if (credential) {
              _context57.n = 1;
              break;
            }
            return _context57.a(2);
          case 1:
            _context57.p = 1;
            _context57.n = 2;
            return api("/api/devices/register", {
              method: "POST",
              timeoutMs: 6e3,
              body: JSON.stringify({
                deviceId: nyxDeviceId(),
                label: navigator.platform || "This device",
                platform: navigator.platform || null
              })
            });
          case 2:
            _context57.n = 4;
            break;
          case 3:
            _context57.p = 3;
            _t40 = _context57.v;
          case 4:
            return _context57.a(2);
        }
      }, _callee57, null, [[1, 3]]);
    }));
    return _registerThisDevice.apply(this, arguments);
  }
  function restoreSession() {
    return _restoreSession.apply(this, arguments);
  }
  function _restoreSession() {
    _restoreSession = _asyncToGenerator(_regenerator().m(function _callee58() {
      var d, _t41;
      return _regenerator().w(function (_context58) {
        while (1) switch (_context58.p = _context58.n) {
          case 0:
            _context58.p = 0;
            _context58.n = 1;
            return api("/api/auth/session", {
              timeoutMs: 6e3
            });
          case 1:
            d = _context58.v;
            sessionRestoreError = null;
            credential = d.profile;
            session();
            if (credential) void registerThisDevice();
            return _context58.a(2, !!credential);
          case 2:
            _context58.p = 2;
            _t41 = _context58.v;
            sessionRestoreError = _t41;
            credential = null;
            session();
            return _context58.a(2, false);
        }
      }, _callee58, null, [[0, 2]]);
    }));
    return _restoreSession.apply(this, arguments);
  }
  function loadConversationHistory() {
    return _loadConversationHistory.apply(this, arguments);
  }
  function _loadConversationHistory() {
    _loadConversationHistory = _asyncToGenerator(_regenerator().m(function _callee59() {
      var d, _t42;
      return _regenerator().w(function (_context59) {
        while (1) switch (_context59.p = _context59.n) {
          case 0:
            if (credential) {
              _context59.n = 1;
              break;
            }
            conversationHistory = [];
            return _context59.a(2, conversationHistory);
          case 1:
            _context59.p = 1;
            _context59.n = 2;
            return api("/api/conversation/recent", {
              timeoutMs: 6e3
            });
          case 2:
            d = _context59.v;
            conversationHistory = Array.isArray(d.conversation) ? d.conversation : [];
            _context59.n = 4;
            break;
          case 3:
            _context59.p = 3;
            _t42 = _context59.v;
            conversationHistory = [];
          case 4:
            return _context59.a(2, conversationHistory);
        }
      }, _callee59, null, [[1, 3]]);
    }));
    return _loadConversationHistory.apply(this, arguments);
  }
  function conversationMarkup() {
    return conversationHistory.slice(-12).map(function (turn) {
      return '<div class="msg '.concat(turn.role === "assistant" ? "assistant" : "user", '">').concat(esc(turn.text), "</div>");
    }).join("");
  }
  function invalidateConversationRequests() {
    conversationEpoch++;
    var _iterator4 = _createForOfIteratorHelper(chatControllers),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var controller = _step4.value;
        try {
          controller.abort();
        } catch (e) {}
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
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
  modal.onclick = function (e) {
    if (e.target === modal) shut();
  };
  addEventListener("keydown", function (e) {
    if (e.key === "Escape") shut();
  });
  function showSessionRestoreRetry() {
    return _showSessionRestoreRetry.apply(this, arguments);
  }
  function _showSessionRestoreRetry() {
    _showSessionRestoreRetry = _asyncToGenerator(_regenerator().m(function _callee61() {
      var error,
        _args61 = arguments;
      return _regenerator().w(function (_context61) {
        while (1) switch (_context61.n) {
          case 0:
            error = _args61.length > 0 && _args61[0] !== undefined ? _args61[0] : sessionRestoreError;
            panel("I couldn\u2019t verify your session", '<p>Your profile may still be signed in. I won\u2019t make you log in again just because the connection check failed.</p><button id="retrySessionRestore" class="primary">Try again</button><button id="useAnotherProfile" class="secondary">Use another profile</button><p id="sessionRestoreNote" class="small">'.concat(esc((error == null ? void 0 : error.message) || "Session check failed."), "</p>"));
            $("#retrySessionRestore").onclick = _asyncToGenerator(_regenerator().m(function _callee60() {
              var note, unlocked;
              return _regenerator().w(function (_context60) {
                while (1) switch (_context60.n) {
                  case 0:
                    note = $("#sessionRestoreNote");
                    note.textContent = "Checking\u2026";
                    _context60.n = 1;
                    return restoreSession();
                  case 1:
                    if (!sessionRestoreError) {
                      _context60.n = 2;
                      break;
                    }
                    note.textContent = sessionRestoreError.message || "Session check failed.";
                    return _context60.a(2);
                  case 2:
                    if (credential) {
                      _context60.n = 3;
                      break;
                    }
                    unlock();
                    return _context60.a(2);
                  case 3:
                    _context60.n = 4;
                    return NYXExperience.load();
                  case 4:
                    _context60.n = 5;
                    return loadConversationHistory();
                  case 5:
                    _context60.n = 6;
                    return enforceProfileLock();
                  case 6:
                    unlocked = _context60.v;
                    if (unlocked) {
                      _context60.n = 7;
                      break;
                    }
                    return _context60.a(2);
                  case 7:
                    shut();
                    if (NYXExperience.needsOnboarding()) NYXExperience.onboard();else if (NYXExperience.voiceSessionEnabled()) NYXExperience.startVoiceSession();
                  case 8:
                    return _context60.a(2);
                }
              }, _callee60);
            }));
            $("#useAnotherProfile").onclick = function () {
              sessionRestoreError = null;
              unlock();
            };
          case 1:
            return _context61.a(2);
        }
      }, _callee61);
    }));
    return _showSessionRestoreRetry.apply(this, arguments);
  }
  function unlock() {
    var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "login";
    var signup = mode === "register";
    panel(signup ? "Meet NyxThea" : "Welcome back", "<p>".concat(signup ? "Create your private profile to start talking with NyxThea." : "Sign in to continue your conversation.", '</p><form id="authForm"><input id="authUser" class="field" name="username" autocomplete="username" required minlength="3" maxlength="32" placeholder="Username">').concat(signup ? '<input id="authName" class="field" name="name" autocomplete="name" required maxlength="80" placeholder="What should NyxThea call you?">' : "", '<input id="authPass" class="field" name="password" type="password" autocomplete="').concat(signup ? "new-password" : "current-password", '" required minlength="12" placeholder="Password (at least 12 characters)"><button class="primary" type="submit">').concat(signup ? "Create my profile" : "Sign in", '</button></form><button id="switchAuth" class="secondary">').concat(signup ? "I already have an account" : "Create an account", "</button>").concat(signup ? "" : '<button id="claimAuth" class="secondary">I have a household invite</button><button id="recoverAuth" class="secondary">Use my recovery code</button>', '<p id="authNote" class="small" role="status"></p>'));
    $("#switchAuth").onclick = function () {
      return unlock(signup ? "login" : "register");
    };
    if (!signup) {
      $("#claimAuth").onclick = claimHouseholdProfile;
      $("#recoverAuth").onclick = recover;
    }
    $("#authForm").onsubmit = function () {
      var _ref = _asyncToGenerator(_regenerator().m(function _callee(e) {
        var _a, note, d, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              e.preventDefault();
              note = $("#authNote");
              note.textContent = "One moment\u2026";
              _context.p = 1;
              _context.n = 2;
              return api(signup ? "/api/auth/register" : "/api/auth/login", {
                method: "POST",
                body: JSON.stringify(__spreadValues({
                  username: $("#authUser").value,
                  password: $("#authPass").value
                }, signup ? {
                  displayName: $("#authName").value
                } : {}))
              });
            case 2:
              d = _context.v;
              credential = d.profile;
              session();
              void registerThisDevice();
              _context.n = 3;
              return NYXExperience.load();
            case 3:
              _context.n = 4;
              return loadConversationHistory();
            case 4:
              if (!signup) {
                _context.n = 5;
                break;
              }
              showRecoveryCode(d.recoveryCode, function () {
                return NYXExperience.onboard();
              });
              return _context.a(2);
            case 5:
              shut();
              if (!((_a = NYXExperience.settings) == null ? void 0 : _a.onboarded)) NYXExperience.onboard();
              _context.n = 7;
              break;
            case 6:
              _context.p = 6;
              _t = _context.v;
              note.textContent = _t.message;
            case 7:
              return _context.a(2);
          }
        }, _callee, null, [[1, 6]]);
      }));
      return function (_x3) {
        return _ref.apply(this, arguments);
      };
    }();
  }
  function showRecoveryCode(code, next) {
    panel("Save your recovery code", '<p>This code is shown once. Save it somewhere private; you can use it if you forget your password.</p><div class="item" style="overflow-wrap:anywhere"><strong id="recoveryCode">'.concat(esc(code), '</strong></div><button id="copyRecovery" class="secondary">Copy code</button><button id="savedRecovery" class="primary">I saved it</button>'));
    $("#copyRecovery").onclick = function () {
      var _a;
      return (_a = navigator.clipboard) == null ? void 0 : _a.writeText(code);
    };
    $("#savedRecovery").onclick = next;
  }
  function claimHouseholdProfile() {
    panel("Join your NyxThea profile", '<p>Use the one-time household invite code from the person who introduced you to NyxThea. This attaches this device to the profile Nyx already created for you.</p><form id="claimForm"><input id="claimCode" class="field" required placeholder="Household invite code"><input id="claimUser" class="field" autocomplete="username" required placeholder="Choose a username"><input id="claimPassword" class="field" type="password" autocomplete="new-password" required minlength="12" placeholder="Choose a password (at least 12 characters)"><button class="primary" type="submit">Claim my profile</button></form><p id="claimNote" class="small" role="status"></p>');
    $("#claimForm").onsubmit = function () {
      var _ref2 = _asyncToGenerator(_regenerator().m(function _callee2(e) {
        var note, d, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              e.preventDefault();
              note = $("#claimNote");
              note.textContent = "Connecting your profile\u2026";
              _context2.p = 1;
              _context2.n = 2;
              return api("/api/auth/claim", {
                method: "POST",
                body: JSON.stringify({
                  inviteCode: $("#claimCode").value.trim(),
                  username: $("#claimUser").value,
                  password: $("#claimPassword").value
                })
              });
            case 2:
              d = _context2.v;
              credential = d.profile;
              session();
              void registerThisDevice();
              _context2.n = 3;
              return NYXExperience.load();
            case 3:
              _context2.n = 4;
              return loadConversationHistory();
            case 4:
              showRecoveryCode(d.recoveryCode, function () {
                var _a;
                shut();
                if (!((_a = NYXExperience.settings) == null ? void 0 : _a.onboarded)) NYXExperience.onboard();
              });
              _context2.n = 6;
              break;
            case 5:
              _context2.p = 5;
              _t2 = _context2.v;
              note.textContent = _t2.message;
            case 6:
              return _context2.a(2);
          }
        }, _callee2, null, [[1, 5]]);
      }));
      return function (_x4) {
        return _ref2.apply(this, arguments);
      };
    }();
  }
  function recover() {
    panel("Recover your account", '<p>Use your saved recovery code, or send a code to your verified recovery email.</p><input id="recoverUser" class="field" autocomplete="username" required placeholder="Username"><div class="item"><strong>Recovery code</strong><input id="recoverCode" class="field" placeholder="Saved recovery code"><input id="recoverPassword" class="field" type="password" autocomplete="new-password" minlength="12" placeholder="New password (at least 12 characters)"><button id="recoverWithCode" class="primary">Reset with recovery code</button></div><div class="item"><strong>Recovery email</strong><button id="sendRecoveryEmail" class="secondary">Email me a 6-digit code</button><input id="emailRecoveryCode" class="field" inputmode="numeric" maxlength="6" placeholder="6-digit email code"><input id="emailRecoveryPassword" class="field" type="password" autocomplete="new-password" minlength="12" placeholder="New password (at least 12 characters)"><button id="recoverWithEmail" class="secondary">Reset with email code</button></div><p id="recoveryNote" class="small" role="status"></p>');
    $("#recoverWithCode").onclick = _asyncToGenerator(_regenerator().m(function _callee3() {
      var d, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            _context3.p = 0;
            _context3.n = 1;
            return api("/api/auth/recover", {
              method: "POST",
              body: JSON.stringify({
                username: $("#recoverUser").value,
                recoveryCode: $("#recoverCode").value,
                newPassword: $("#recoverPassword").value
              })
            });
          case 1:
            d = _context3.v;
            credential = d.profile;
            session();
            _context3.n = 2;
            return NYXExperience.load();
          case 2:
            _context3.n = 3;
            return loadConversationHistory();
          case 3:
            showRecoveryCode(d.recoveryCode, function () {
              var _a;
              shut();
              if (!((_a = NYXExperience.settings) == null ? void 0 : _a.onboarded)) NYXExperience.onboard();
            });
            _context3.n = 5;
            break;
          case 4:
            _context3.p = 4;
            _t3 = _context3.v;
            $("#recoveryNote").textContent = _t3.message;
          case 5:
            return _context3.a(2);
        }
      }, _callee3, null, [[0, 4]]);
    }));
    $("#sendRecoveryEmail").onclick = _asyncToGenerator(_regenerator().m(function _callee4() {
      var note, d, _t4;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            note = $("#recoveryNote");
            _context4.p = 1;
            _context4.n = 2;
            return api("/api/auth/recover-email/start", {
              method: "POST",
              body: JSON.stringify({
                username: $("#recoverUser").value
              })
            });
          case 2:
            d = _context4.v;
            note.textContent = "If that account has a verified recovery email, a 6-digit code has been sent.";
            _context4.n = 4;
            break;
          case 3:
            _context4.p = 3;
            _t4 = _context4.v;
            note.textContent = _t4.message;
          case 4:
            return _context4.a(2);
        }
      }, _callee4, null, [[1, 3]]);
    }));
    $("#recoverWithEmail").onclick = _asyncToGenerator(_regenerator().m(function _callee5() {
      var d, _t5;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            _context5.p = 0;
            _context5.n = 1;
            return api("/api/auth/recover-email/complete", {
              method: "POST",
              body: JSON.stringify({
                username: $("#recoverUser").value,
                code: $("#emailRecoveryCode").value,
                newPassword: $("#emailRecoveryPassword").value
              })
            });
          case 1:
            d = _context5.v;
            credential = d.profile;
            session();
            _context5.n = 2;
            return NYXExperience.load();
          case 2:
            _context5.n = 3;
            return loadConversationHistory();
          case 3:
            showRecoveryCode(d.recoveryCode, function () {
              return shut();
            });
            _context5.n = 5;
            break;
          case 4:
            _context5.p = 4;
            _t5 = _context5.v;
            $("#recoveryNote").textContent = _t5.message;
          case 5:
            return _context5.a(2);
        }
      }, _callee5, null, [[0, 4]]);
    }));
  }
  $("#unlock").onclick = function () {
    return credential ? openSettingsVerified() : unlock();
  };
  function signOut() {
    return _signOut.apply(this, arguments);
  }
  function _signOut() {
    _signOut = _asyncToGenerator(_regenerator().m(function _callee62() {
      var _t43;
      return _regenerator().w(function (_context62) {
        while (1) switch (_context62.p = _context62.n) {
          case 0:
            invalidateConversationRequests();
            NYXExperience.stopOnboardingStream();
            NYXHandsFree.stop();
            NYXVoice.stop();
            _context62.p = 1;
            _context62.n = 2;
            return api("/api/auth/logout", {
              method: "POST",
              timeoutMs: 4e3,
              body: "{}"
            });
          case 2:
            _context62.n = 4;
            break;
          case 3:
            _context62.p = 3;
            _t43 = _context62.v;
          case 4:
            _context62.p = 4;
            credential = null;
            conversationHistory = [];
            NYXExperience.settings = null;
            settingsAuthToken = null;
            session();
            shut();
            unlock();
            return _context62.f(4);
          case 5:
            return _context62.a(2);
        }
      }, _callee62, null, [[1, 3, 4, 5]]);
    }));
    return _signOut.apply(this, arguments);
  }
  function setVoiceSpeaker(profileId, name) {
    NYXHandsFree.speakerProfileId = profileId || null;
    NYXHandsFree.speakerName = name || null;
    state(NYXHandsFree.active ? "listening" : "ready", profileId && name ? "Talking with " + name : "Talking with " + ((credential == null ? void 0 : credential.displayName) || "you"));
  }
  function chooseHouseholdSpeaker() {
    return _chooseHouseholdSpeaker.apply(this, arguments);
  }
  function _chooseHouseholdSpeaker() {
    _chooseHouseholdSpeaker = _asyncToGenerator(_regenerator().m(function _callee63() {
      var _a, d, members, buttons, _t44;
      return _regenerator().w(function (_context63) {
        while (1) switch (_context63.p = _context63.n) {
          case 0:
            _context63.p = 0;
            _context63.n = 1;
            return api("/api/household/identity");
          case 1:
            d = _context63.v;
            members = ((_a = d.household) == null ? void 0 : _a.members) || [];
            buttons = members.map(function (m) {
              var _a2;
              var name = ((_a2 = m.identity) == null ? void 0 : _a2.preferredName) || (m.profileId === credential.id ? credential.displayName : m.profileId);
              return '<button class="secondary household-speaker" data-speaker-id="'.concat(esc(m.profileId), '" data-speaker-name="').concat(esc(name), '">').concat(esc(name)).concat(m.profileId === credential.id ? " \u2014 me" : "", "</button>");
            }).join("");
            panel("Who\u2019s talking?", "<p>Choose who is speaking on this device. Nyx uses that person\u2019s age/child-safety rules for voice without exposing another profile\u2019s private memory.</p>".concat(buttons, '<button id="newHouseholdSpeaker" class="primary">Meet someone new</button>'));
            $$(".household-speaker").forEach(function (btn) {
              return btn.onclick = function () {
                setVoiceSpeaker(btn.dataset.speakerId, btn.dataset.speakerName);
                shut();
              };
            });
            $("#newHouseholdSpeaker").onclick = meetSomeoneNew;
            _context63.n = 3;
            break;
          case 2:
            _context63.p = 2;
            _t44 = _context63.v;
            panel("Who\u2019s talking?", "<p>".concat(esc(_t44.message), "</p>"));
          case 3:
            return _context63.a(2);
        }
      }, _callee63, null, [[0, 2]]);
    }));
    return _chooseHouseholdSpeaker.apply(this, arguments);
  }
  function meetSomeoneNew() {
    panel("NyxThea is meeting someone new", '<p>Create their household profile, then Nyx can hand the voice session to them on this device.</p><input id="newPersonName" class="field" maxlength="80" placeholder="What should I call you?"><input id="newPersonPron" class="field" maxlength="120" placeholder="How is your name pronounced? (optional)"><input id="newPersonBirthday" class="field" type="date"><input id="newPersonRelation" class="field" maxlength="48" placeholder="Relationship to me \u2014 e.g. spouse, daughter, son"><button id="createNewPerson" class="primary">Nice to meet you</button><p id="newPersonNote" class="small"></p>');
    $("#createNewPerson").onclick = _asyncToGenerator(_regenerator().m(function _callee6() {
      var _a, _b, _c, note, payload, d, name, _t6;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.p = _context6.n) {
          case 0:
            note = $("#newPersonNote");
            _context6.p = 1;
            payload = {
              displayName: $("#newPersonName").value.trim(),
              pronunciation: $("#newPersonPron").value.trim() || void 0,
              birthday: $("#newPersonBirthday").value || void 0,
              relationshipToRequester: $("#newPersonRelation").value.trim() || void 0
            };
            _context6.n = 2;
            return api("/api/household/meet", {
              method: "POST",
              body: JSON.stringify(payload)
            });
          case 2:
            d = _context6.v;
            name = ((_a = d.identity) == null ? void 0 : _a.pronunciation) || ((_b = d.identity) == null ? void 0 : _b.preferredName) || d.profile.displayName;
            setVoiceSpeaker(d.profile.id, ((_c = d.identity) == null ? void 0 : _c.preferredName) || d.profile.displayName);
            note.innerHTML = "Profile created for " + esc(d.profile.displayName) + '. Voice is now handed to them on this device.<br><strong>Household invite code:</strong> <span style="overflow-wrap:anywhere">' + esc(d.claimCode) + '</span><br><span class="small">They can use that code later to claim the same profile on their own device.</span>';
            void NYXVoice.say("Nice to meet you, " + name + ". You can talk to me now.");
            _context6.n = 4;
            break;
          case 3:
            _context6.p = 3;
            _t6 = _context6.v;
            note.textContent = _t6.message;
          case 4:
            return _context6.a(2);
        }
      }, _callee6, null, [[1, 3]]);
    }));
  }
  function profileLockState() {
    return _profileLockState.apply(this, arguments);
  }
  function _profileLockState() {
    _profileLockState = _asyncToGenerator(_regenerator().m(function _callee64() {
      var _t45;
      return _regenerator().w(function (_context64) {
        while (1) switch (_context64.p = _context64.n) {
          case 0:
            _context64.p = 0;
            _context64.n = 1;
            return api("/api/profile-lock?deviceId=" + encodeURIComponent(nyxDeviceId()), {
              timeoutMs: 6e3
            });
          case 1:
            return _context64.a(2, _context64.v);
          case 2:
            _context64.p = 2;
            _t45 = _context64.v;
            if (!(_t45.status === 403)) {
              _context64.n = 3;
              break;
            }
            return _context64.a(2, null);
          case 3:
            throw _t45;
          case 4:
            return _context64.a(2);
        }
      }, _callee64, null, [[0, 2]]);
    }));
    return _profileLockState.apply(this, arguments);
  }
  function bytesToB64url(bytes) {
    return btoa(String.fromCharCode.apply(String, _toConsumableArray(new Uint8Array(bytes)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function b64urlToBytes(value) {
    var b64 = String(value).replace(/-/g, "+").replace(/_/g, "/") + "===".slice((String(value).length + 3) % 4);
    var raw = atob(b64);
    return Uint8Array.from(raw, function (c) {
      return c.charCodeAt(0);
    });
  }
  function setupDeviceBiometric() {
    return _setupDeviceBiometric.apply(this, arguments);
  }
  function _setupDeviceBiometric() {
    _setupDeviceBiometric = _asyncToGenerator(_regenerator().m(function _callee65() {
      var _a, _b, _c, _d, note, begin, userId, created, publicKey, algorithm, _t46;
      return _regenerator().w(function (_context65) {
        while (1) switch (_context65.p = _context65.n) {
          case 0:
            note = $("#profileLockNote") || $("#securityNote");
            if (note) {
              _context65.n = 1;
              break;
            }
            return _context65.a(2);
          case 1:
            if (!(!window.PublicKeyCredential || !navigator.credentials)) {
              _context65.n = 2;
              break;
            }
            note.textContent = "This browser does not support device biometric/passkey unlock.";
            return _context65.a(2);
          case 2:
            _context65.p = 2;
            _context65.n = 3;
            return api("/api/profile-lock/biometric/begin", {
              method: "POST",
              body: JSON.stringify({
                deviceId: nyxDeviceId(),
                purpose: "register"
              })
            });
          case 3:
            begin = _context65.v;
            userId = new TextEncoder().encode(credential.id.slice(0, 64));
            _context65.n = 4;
            return navigator.credentials.create({
              publicKey: {
                challenge: b64urlToBytes(begin.challenge),
                rp: {
                  name: "NyxThea"
                },
                user: {
                  id: userId,
                  name: credential.displayName || "NyxThea user",
                  displayName: credential.displayName || "NyxThea user"
                },
                pubKeyCredParams: [{
                  type: "public-key",
                  alg: -7
                }, {
                  type: "public-key",
                  alg: -257
                }],
                authenticatorSelection: {
                  authenticatorAttachment: "platform",
                  userVerification: "required",
                  residentKey: "discouraged"
                },
                timeout: 6e4,
                attestation: "none"
              }
            });
          case 4:
            created = _context65.v;
            if (created) {
              _context65.n = 5;
              break;
            }
            throw Error("Device biometric setup was cancelled.");
          case 5:
            publicKey = (_b = (_a = created.response).getPublicKey) == null ? void 0 : _b.call(_a), algorithm = (_d = (_c = created.response).getPublicKeyAlgorithm) == null ? void 0 : _d.call(_c);
            if (!(!publicKey || !algorithm)) {
              _context65.n = 6;
              break;
            }
            throw Error("This browser cannot register a secure device passkey for NyxThea yet.");
          case 6:
            _context65.n = 7;
            return api("/api/profile-lock/biometric", {
              method: "POST",
              settingsAuth: true,
              body: JSON.stringify({
                deviceId: nyxDeviceId(),
                credentialId: bytesToB64url(created.rawId),
                publicKey: bytesToB64url(publicKey),
                algorithm,
                label: navigator.platform || "This device",
                clientDataJSON: bytesToB64url(created.response.clientDataJSON),
                authenticatorData: bytesToB64url(created.response.getAuthenticatorData())
              })
            });
          case 7:
            localStorage.setItem("nyxtheaBiometricCredential:" + credential.id, bytesToB64url(created.rawId));
            note.textContent = "Device biometric/passkey unlock is enabled. Nyx stores the public credential only\u2014not your face or fingerprint.";
            _context65.n = 9;
            break;
          case 8:
            _context65.p = 8;
            _t46 = _context65.v;
            note.textContent = _t46.message || "Could not enable device biometric unlock.";
          case 9:
            return _context65.a(2);
        }
      }, _callee65, null, [[2, 8]]);
    }));
    return _setupDeviceBiometric.apply(this, arguments);
  }
  function unlockWithBiometric() {
    return _unlockWithBiometric.apply(this, arguments);
  }
  function _unlockWithBiometric() {
    _unlockWithBiometric = _asyncToGenerator(_regenerator().m(function _callee66() {
      var purpose,
        _a,
        saved,
        begin,
        assertion,
        d,
        _args66 = arguments;
      return _regenerator().w(function (_context66) {
        while (1) switch (_context66.n) {
          case 0:
            purpose = _args66.length > 0 && _args66[0] !== undefined ? _args66[0] : "unlock";
            saved = localStorage.getItem("nyxtheaBiometricCredential:" + credential.id);
            if (!(!saved || !window.PublicKeyCredential || !navigator.credentials)) {
              _context66.n = 1;
              break;
            }
            throw Error("Device biometric unlock is not set up here.");
          case 1:
            _context66.n = 2;
            return api("/api/profile-lock/biometric/begin", {
              method: "POST",
              body: JSON.stringify({
                deviceId: nyxDeviceId(),
                purpose
              })
            });
          case 2:
            begin = _context66.v;
            _context66.n = 3;
            return navigator.credentials.get({
              publicKey: {
                challenge: b64urlToBytes(begin.challenge),
                allowCredentials: [{
                  type: "public-key",
                  id: b64urlToBytes(saved)
                }],
                userVerification: "required",
                timeout: 6e4
              }
            });
          case 3:
            assertion = _context66.v;
            if (assertion) {
              _context66.n = 4;
              break;
            }
            throw Error("Device biometric unlock was cancelled.");
          case 4:
            _context66.n = 5;
            return api("/api/profile-lock/biometric/verify", {
              method: "POST",
              body: JSON.stringify({
                deviceId: nyxDeviceId(),
                purpose,
                credentialId: saved,
                clientDataJSON: bytesToB64url(assertion.response.clientDataJSON),
                authenticatorData: bytesToB64url(assertion.response.authenticatorData),
                signature: bytesToB64url(assertion.response.signature)
              })
            });
          case 5:
            d = _context66.v;
            if (purpose === "settings" && ((_a = d.authorization) == null ? void 0 : _a.token)) settingsAuthToken = d.authorization.token;
            return _context66.a(2, d);
        }
      }, _callee66);
    }));
    return _unlockWithBiometric.apply(this, arguments);
  }
  function openSettingsVerified() {
    return _openSettingsVerified.apply(this, arguments);
  }
  function _openSettingsVerified() {
    _openSettingsVerified = _asyncToGenerator(_regenerator().m(function _callee70() {
      var _a, lockInfo, hasPin, note, _t50;
      return _regenerator().w(function (_context70) {
        while (1) switch (_context70.p = _context70.n) {
          case 0:
            if (credential) {
              _context70.n = 1;
              break;
            }
            unlock();
            return _context70.a(2);
          case 1:
            settingsAuthToken = null;
            lockInfo = null;
            _context70.p = 2;
            _context70.n = 3;
            return profileLockState();
          case 3:
            lockInfo = _context70.v;
            _context70.n = 5;
            break;
          case 4:
            _context70.p = 4;
            _t50 = _context70.v;
            panel("Settings", "<p>".concat(esc(_t50.message), "</p>"));
            return _context70.a(2);
          case 5:
            hasPin = Boolean((_a = lockInfo == null ? void 0 : lockInfo.lock) == null ? void 0 : _a.pinEnabled);
            panel("Verify adult access", "<p>".concat(hasPin ? "Use your PIN, account password, or device biometric." : "You haven\u2019t created a PIN yet. Use your account password once, then you can create a PIN or enable Face ID / Touch ID.", "</p>").concat(hasPin ? '<input id="settingsPin" class="field" inputmode="numeric" maxlength="8" placeholder="Adult PIN"><button id="settingsPinBtn" class="primary">Verify with PIN</button>' : "", '<input id="settingsPassword" class="field" type="password" autocomplete="current-password" placeholder="Account password"><button id="settingsPasswordBtn" class="').concat(hasPin ? "secondary" : "primary", '">Continue with account password</button><button id="settingsBioBtn" class="secondary">Use Face ID / Touch ID / device biometric</button><p id="settingsVerifyNote" class="small"></p>'));
            note = function note() {
              return $("#settingsVerifyNote");
            };
            if (hasPin) $("#settingsPinBtn").onclick = _asyncToGenerator(_regenerator().m(function _callee67() {
              var d, _t47;
              return _regenerator().w(function (_context67) {
                while (1) switch (_context67.p = _context67.n) {
                  case 0:
                    _context67.p = 0;
                    _context67.n = 1;
                    return api("/api/settings/verify-pin", {
                      method: "POST",
                      body: JSON.stringify({
                        pin: $("#settingsPin").value,
                        deviceId: nyxDeviceId()
                      })
                    });
                  case 1:
                    d = _context67.v;
                    settingsAuthToken = d.authorization.token;
                    _context67.n = 2;
                    return accountSettings();
                  case 2:
                    _context67.n = 4;
                    break;
                  case 3:
                    _context67.p = 3;
                    _t47 = _context67.v;
                    note().textContent = _t47.message;
                  case 4:
                    return _context67.a(2);
                }
              }, _callee67, null, [[0, 3]]);
            }));
            $("#settingsPasswordBtn").onclick = _asyncToGenerator(_regenerator().m(function _callee68() {
              var d, _t48;
              return _regenerator().w(function (_context68) {
                while (1) switch (_context68.p = _context68.n) {
                  case 0:
                    _context68.p = 0;
                    _context68.n = 1;
                    return api("/api/settings/verify-password", {
                      method: "POST",
                      body: JSON.stringify({
                        password: $("#settingsPassword").value,
                        deviceId: nyxDeviceId()
                      })
                    });
                  case 1:
                    d = _context68.v;
                    settingsAuthToken = d.authorization.token;
                    _context68.n = 2;
                    return accountSettings();
                  case 2:
                    _context68.n = 4;
                    break;
                  case 3:
                    _context68.p = 3;
                    _t48 = _context68.v;
                    note().textContent = _t48.message;
                  case 4:
                    return _context68.a(2);
                }
              }, _callee68, null, [[0, 3]]);
            }));
            $("#settingsBioBtn").onclick = _asyncToGenerator(_regenerator().m(function _callee69() {
              var _t49;
              return _regenerator().w(function (_context69) {
                while (1) switch (_context69.p = _context69.n) {
                  case 0:
                    _context69.p = 0;
                    _context69.n = 1;
                    return unlockWithBiometric("settings");
                  case 1:
                    _context69.n = 2;
                    return accountSettings();
                  case 2:
                    _context69.n = 4;
                    break;
                  case 3:
                    _context69.p = 3;
                    _t49 = _context69.v;
                    note().textContent = _t49.message;
                  case 4:
                    return _context69.a(2);
                }
              }, _callee69, null, [[0, 3]]);
            }));
          case 6:
            return _context70.a(2);
        }
      }, _callee70, null, [[2, 4]]);
    }));
    return _openSettingsVerified.apply(this, arguments);
  }
  function enforceProfileLock() {
    return _enforceProfileLock.apply(this, arguments);
  }
  function _enforceProfileLock() {
    _enforceProfileLock = _asyncToGenerator(_regenerator().m(function _callee75() {
      var _a, d, host2, card2, host, card, _t54;
      return _regenerator().w(function (_context75) {
        while (1) switch (_context75.p = _context75.n) {
          case 0:
            if (credential) {
              _context75.n = 1;
              break;
            }
            return _context75.a(2, true);
          case 1:
            _context75.p = 1;
            _context75.n = 2;
            return profileLockState();
          case 2:
            d = _context75.v;
            _context75.n = 4;
            break;
          case 3:
            _context75.p = 3;
            _t54 = _context75.v;
            host2 = document.getElementById("nyxOnboard"), card2 = document.getElementById("nyxOnboardCard");
            host2.classList.add("show");
            card2.innerHTML = '<h2>I couldn\u2019t verify this profile\u2019s lock state.</h2><p>For privacy, I won\u2019t open the profile until that check succeeds.</p><button id="retryProfileLock" class="primary">Try again</button><button id="lockCheckSignOut" class="secondary">Use a different profile</button><p class="small">' + esc(_t54.message || "Connection check failed.") + "</p>";
            $("#retryProfileLock").onclick = _asyncToGenerator(_regenerator().m(function _callee71() {
              var ok;
              return _regenerator().w(function (_context71) {
                while (1) switch (_context71.n) {
                  case 0:
                    host2.classList.remove("show");
                    _context71.n = 1;
                    return enforceProfileLock();
                  case 1:
                    ok = _context71.v;
                    if (ok && NYXExperience.voiceSessionEnabled() && !NYXExperience.needsOnboarding()) setTimeout(function () {
                      return NYXExperience.startVoiceSession();
                    }, 180);
                  case 2:
                    return _context71.a(2);
                }
              }, _callee71);
            }));
            $("#lockCheckSignOut").onclick = signOut;
            return _context75.a(2, false);
          case 4:
            if (!(!((_a = d == null ? void 0 : d.state) == null ? void 0 : _a.enabled) || !d.state.locked)) {
              _context75.n = 5;
              break;
            }
            return _context75.a(2, true);
          case 5:
            host = document.getElementById("nyxOnboard"), card = document.getElementById("nyxOnboardCard");
            host.classList.add("show");
            card.innerHTML = '<h2>Profile locked.</h2><p>This adult profile is private on this device.</p><input id="unlockProfilePin" class="field" inputmode="numeric" pattern="[0-9]*" maxlength="8" placeholder="PIN"><button id="unlockProfilePinBtn" class="primary">Unlock with PIN</button><button id="unlockProfileBioBtn" class="secondary">Use Face ID / Touch ID / device biometric</button><input id="unlockProfilePassword" class="field" type="password" autocomplete="current-password" placeholder="Forgot PIN? Use account password"><button id="unlockProfilePasswordBtn" class="secondary">Unlock with password</button><button id="lockedSignOut" class="secondary">Use a different profile</button><p id="profileUnlockNote" class="small"></p>';
            $("#unlockProfilePinBtn").onclick = _asyncToGenerator(_regenerator().m(function _callee72() {
              var note, _t51;
              return _regenerator().w(function (_context72) {
                while (1) switch (_context72.p = _context72.n) {
                  case 0:
                    note = $("#profileUnlockNote");
                    _context72.p = 1;
                    _context72.n = 2;
                    return api("/api/profile-lock/pin/verify", {
                      method: "POST",
                      body: JSON.stringify({
                        pin: $("#unlockProfilePin").value,
                        deviceId: nyxDeviceId()
                      })
                    });
                  case 2:
                    host.classList.remove("show");
                    NYXSound.cue("unlock");
                    note.textContent = "";
                    if (NYXExperience.voiceSessionEnabled() && !NYXExperience.needsOnboarding()) setTimeout(function () {
                      return NYXExperience.startVoiceSession();
                    }, 180);
                    _context72.n = 4;
                    break;
                  case 3:
                    _context72.p = 3;
                    _t51 = _context72.v;
                    note.textContent = _t51.message;
                  case 4:
                    return _context72.a(2);
                }
              }, _callee72, null, [[1, 3]]);
            }));
            $("#unlockProfileBioBtn").onclick = _asyncToGenerator(_regenerator().m(function _callee73() {
              var note, _t52;
              return _regenerator().w(function (_context73) {
                while (1) switch (_context73.p = _context73.n) {
                  case 0:
                    note = $("#profileUnlockNote");
                    _context73.p = 1;
                    _context73.n = 2;
                    return unlockWithBiometric("unlock");
                  case 2:
                    host.classList.remove("show");
                    if (NYXExperience.voiceSessionEnabled() && !NYXExperience.needsOnboarding()) setTimeout(function () {
                      return NYXExperience.startVoiceSession();
                    }, 180);
                    _context73.n = 4;
                    break;
                  case 3:
                    _context73.p = 3;
                    _t52 = _context73.v;
                    note.textContent = _t52.message;
                  case 4:
                    return _context73.a(2);
                }
              }, _callee73, null, [[1, 3]]);
            }));
            $("#unlockProfilePasswordBtn").onclick = _asyncToGenerator(_regenerator().m(function _callee74() {
              var note, _t53;
              return _regenerator().w(function (_context74) {
                while (1) switch (_context74.p = _context74.n) {
                  case 0:
                    note = $("#profileUnlockNote");
                    _context74.p = 1;
                    _context74.n = 2;
                    return api("/api/profile-lock/password/verify", {
                      method: "POST",
                      body: JSON.stringify({
                        password: $("#unlockProfilePassword").value,
                        deviceId: nyxDeviceId()
                      })
                    });
                  case 2:
                    host.classList.remove("show");
                    if (NYXExperience.voiceSessionEnabled() && !NYXExperience.needsOnboarding()) setTimeout(function () {
                      return NYXExperience.startVoiceSession();
                    }, 180);
                    _context74.n = 4;
                    break;
                  case 3:
                    _context74.p = 3;
                    _t53 = _context74.v;
                    note.textContent = _t53.message;
                  case 4:
                    return _context74.a(2);
                }
              }, _callee74, null, [[1, 3]]);
            }));
            $("#lockedSignOut").onclick = signOut;
            return _context75.a(2, false);
        }
      }, _callee75, null, [[1, 3]]);
    }));
    return _enforceProfileLock.apply(this, arguments);
  }
  var NYX_MODULES = [{
    key: "world",
    label: "Your World",
    view: "Your World"
  }, {
    key: "devices",
    label: "Devices",
    view: "Devices"
  }, {
    key: "health",
    label: "Health",
    view: "Health"
  }, {
    key: "security",
    label: "Security",
    view: "Security"
  }, {
    key: "memories",
    label: "Memories",
    view: "Memories"
  }, {
    key: "music",
    label: "Music",
    view: "Music"
  }, {
    key: "vehicle",
    label: "Vehicle",
    view: "Vehicle"
  }, {
    key: "apple_siri_iphone",
    label: "iPhone / Siri"
  }, {
    key: "amazon_alexa_echo",
    label: "Alexa / Echo"
  }, {
    key: "google_nest",
    label: "Google Nest"
  }, {
    key: "smart_home",
    label: "Smart home"
  }, {
    key: "tv",
    label: "TV / streaming"
  }, {
    key: "wearable",
    label: "Wearables"
  }, {
    key: "computer",
    label: "Computer"
  }, {
    key: "health_data",
    label: "Health data"
  }, {
    key: "pet_care",
    label: "Pet care"
  }, {
    key: "emergency_contacts",
    label: "Emergency contacts"
  }];
  function applyInterfacePreferences() {
    var _a;
    var selected = new Set(((_a = NYXExperience.settings) == null ? void 0 : _a.visibleModules) || NYX_MODULES.filter(function (x) {
      return x.view;
    }).map(function (x) {
      return x.key;
    }));
    var byView = Object.fromEntries(NYX_MODULES.filter(function (x) {
      return x.view;
    }).map(function (x) {
      return [x.view, x.key];
    }));
    $$("[data-view]").forEach(function (el) {
      var key = byView[el.dataset.view];
      if (key) el.hidden = !selected.has(key);
    });
    renderIntegrationShelf(selected).catch(function () {});
  }
  function renderIntegrationShelf() {
    return _renderIntegrationShelf.apply(this, arguments);
  }
  function _renderIntegrationShelf() {
    _renderIntegrationShelf = _asyncToGenerator(_regenerator().m(function _callee76() {
      var selected,
        shelf,
        grid,
        external,
        states,
        byKind,
        _args76 = arguments,
        _t55,
        _t56;
      return _regenerator().w(function (_context76) {
        while (1) switch (_context76.p = _context76.n) {
          case 0:
            selected = _args76.length > 0 && _args76[0] !== undefined ? _args76[0] : new Set(function (_a) {
              return (_a = NYXExperience.settings) == null ? void 0 : _a.visibleModules;
            }() || []);
            shelf = $("#integrationShelf"), grid = $("#integrationShelfGrid");
            if (!(!shelf || !grid)) {
              _context76.n = 1;
              break;
            }
            return _context76.a(2);
          case 1:
            external = NYX_MODULES.filter(function (x) {
              return !x.view && selected.has(x.key);
            });
            if (external.length) {
              _context76.n = 2;
              break;
            }
            shelf.hidden = true;
            grid.innerHTML = "";
            return _context76.a(2);
          case 2:
            states = [];
            _context76.p = 3;
            _context76.n = 4;
            return api("/api/integrations");
          case 4:
            _t55 = _context76.v.integrations;
            if (_t55) {
              _context76.n = 5;
              break;
            }
            _t55 = [];
          case 5:
            states = _t55;
            _context76.n = 7;
            break;
          case 6:
            _context76.p = 6;
            _t56 = _context76.v;
          case 7:
            byKind = Object.fromEntries(states.map(function (x) {
              return [x.kind, x];
            }));
            grid.innerHTML = external.map(function (item) {
              var _a2, _b, _c;
              var state2 = ((_b = (_a2 = byKind[item.key]) == null ? void 0 : _a2.connection) == null ? void 0 : _b.state) || ((_c = byKind[item.key]) == null ? void 0 : _c.state) || "designed_not_connected";
              var text = state2 === "active_connection" ? "Connected" : state2 === "requires_authorization" ? "Selected \u2014 authorization needed" : "Selected";
              return '<button class="glass integration-card" data-integration="'.concat(esc(item.key), '"><span class="domain-icon">\u2301</span><strong>').concat(esc(item.label), "</strong><small>").concat(esc(text), '</small><span class="card-state">Manage</span></button>');
            }).join("");
            shelf.hidden = false;
            $$("[data-integration]").forEach(function (btn) {
              return btn.onclick = function () {
                return integrationDetail(btn.dataset.integration);
              };
            });
          case 8:
            return _context76.a(2);
        }
      }, _callee76, null, [[3, 6]]);
    }));
    return _renderIntegrationShelf.apply(this, arguments);
  }
  function integrationDetail(_x5) {
    return _integrationDetail.apply(this, arguments);
  }
  function _integrationDetail() {
    _integrationDetail = _asyncToGenerator(_regenerator().m(function _callee78(kind) {
      var _a, _b, item, label, current, state2, _t58, _t59, _t60;
      return _regenerator().w(function (_context78) {
        while (1) switch (_context78.p = _context78.n) {
          case 0:
            item = NYX_MODULES.find(function (x) {
              return x.key === kind;
            }), label = (item == null ? void 0 : item.label) || kind;
            current = null;
            _context78.p = 1;
            _context78.n = 2;
            return api("/api/integrations");
          case 2:
            _t58 = _a = _context78.v.integrations;
            if (!(_t58 == null)) {
              _context78.n = 3;
              break;
            }
            _t59 = void 0;
            _context78.n = 4;
            break;
          case 3:
            _t59 = _a.find(function (x) {
              return x.kind === kind;
            });
          case 4:
            current = _t59;
            _context78.n = 6;
            break;
          case 5:
            _context78.p = 5;
            _t60 = _context78.v;
          case 6:
            state2 = ((_b = current == null ? void 0 : current.connection) == null ? void 0 : _b.state) || (current == null ? void 0 : current.state) || "designed_not_connected";
            panel(label, '<p>This module is on your interface.</p><div class="item"><strong>Status</strong><p class="small">'.concat(esc(state2 === "active_connection" ? "Connected and active" : state2 === "requires_authorization" ? "Selected; provider authorization still needs to be completed." : "Available on your interface; no provider connection is active yet."), '</p></div><button id="removeModule" class="secondary">Remove from my interface</button>'));
            $("#removeModule").onclick = _asyncToGenerator(_regenerator().m(function _callee77() {
              var _a2, visible, _t57;
              return _regenerator().w(function (_context77) {
                while (1) switch (_context77.p = _context77.n) {
                  case 0:
                    visible = (((_a2 = NYXExperience.settings) == null ? void 0 : _a2.visibleModules) || []).filter(function (x) {
                      return x !== kind;
                    });
                    _context77.p = 1;
                    _context77.n = 2;
                    return NYXExperience.save({
                      visibleModules: visible
                    });
                  case 2:
                    applyInterfacePreferences();
                    shut();
                    _context77.n = 4;
                    break;
                  case 3:
                    _context77.p = 3;
                    _t57 = _context77.v;
                    panel(label, "<p>".concat(esc(_t57.message), '</p><button id="removeModuleRetry" class="secondary">Try again</button>'));
                    $("#removeModuleRetry").onclick = function () {
                      return integrationDetail(kind);
                    };
                  case 4:
                    return _context77.a(2);
                }
              }, _callee77, null, [[1, 3]]);
            }));
          case 7:
            return _context78.a(2);
        }
      }, _callee78, null, [[1, 5]]);
    }));
    return _integrationDetail.apply(this, arguments);
  }
  function ensureSettingsAuthorization(_x6) {
    return _ensureSettingsAuthorization.apply(this, arguments);
  }
  function _ensureSettingsAuthorization() {
    _ensureSettingsAuthorization = _asyncToGenerator(_regenerator().m(function _callee79(note) {
      return _regenerator().w(function (_context79) {
        while (1) switch (_context79.n) {
          case 0:
            if (!settingsAuthToken) {
              _context79.n = 1;
              break;
            }
            return _context79.a(2, true);
          case 1:
            if (note) note.textContent = "Verify adult access again to make this security change.";
            _context79.n = 2;
            return openSettingsVerified();
          case 2:
            return _context79.a(2, false);
        }
      }, _callee79);
    }));
    return _ensureSettingsAuthorization.apply(this, arguments);
  }
  function refreshSettingsAuthorization() {
    return _refreshSettingsAuthorization.apply(this, arguments);
  }
  function _refreshSettingsAuthorization() {
    _refreshSettingsAuthorization = _asyncToGenerator(_regenerator().m(function _callee80() {
      var _a, lock, _t61;
      return _regenerator().w(function (_context80) {
        while (1) switch (_context80.p = _context80.n) {
          case 0:
            settingsAuthToken = null;
            _context80.p = 1;
            _context80.n = 2;
            return profileLockState();
          case 2:
            lock = _context80.v;
            if (!((_a = lock == null ? void 0 : lock.lock) == null ? void 0 : _a.biometricEnabled)) {
              _context80.n = 4;
              break;
            }
            _context80.n = 3;
            return unlockWithBiometric("settings");
          case 3:
            return _context80.a(2, true);
          case 4:
            _context80.n = 6;
            break;
          case 5:
            _context80.p = 5;
            _t61 = _context80.v;
          case 6:
            _context80.n = 7;
            return openSettingsVerified();
          case 7:
            return _context80.a(2, false);
        }
      }, _callee80, null, [[1, 5]]);
    }));
    return _refreshSettingsAuthorization.apply(this, arguments);
  }
  function accountSettings() {
    return _accountSettings.apply(this, arguments);
  }
  function _accountSettings() {
    _accountSettings = _asyncToGenerator(_regenerator().m(function _callee99() {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, recovery, lockInfo, _yield$Promise$allSet, _yield$Promise$allSet2, recoveryResult, lockResult, selected, moduleChoices, adminAccess, adminButtons, soundMode, decorative, soundNote, recoveryNote, _t76;
      return _regenerator().w(function (_context99) {
        while (1) switch (_context99.p = _context99.n) {
          case 0:
            recovery = null, lockInfo = null;
            _context99.n = 1;
            return Promise.allSettled([api("/api/recovery/status", {
              timeoutMs: 6e3
            }), profileLockState()]);
          case 1:
            _yield$Promise$allSet = _context99.v;
            _yield$Promise$allSet2 = _slicedToArray(_yield$Promise$allSet, 2);
            recoveryResult = _yield$Promise$allSet2[0];
            lockResult = _yield$Promise$allSet2[1];
            if (recoveryResult.status === "fulfilled") recovery = recoveryResult.value;
            if (lockResult.status === "fulfilled") lockInfo = lockResult.value;
            selected = new Set(((_a = NYXExperience.settings) == null ? void 0 : _a.visibleModules) || NYX_MODULES.filter(function (x) {
              return x.view;
            }).map(function (x) {
              return x.key;
            }));
            moduleChoices = NYX_MODULES.map(function (x) {
              return '<label class="choice"><input type="checkbox" data-module-choice="'.concat(esc(x.key), '" ').concat(selected.has(x.key) ? "checked" : "", "> ").concat(esc(x.label), "</label>");
            }).join("");
            adminAccess = {
              householdAdmin: false,
              systemAdmin: false
            };
            _context99.p = 2;
            _context99.n = 3;
            return api("/api/admin/access", {
              timeoutMs: 5e3
            });
          case 3:
            adminAccess = _context99.v;
            _context99.n = 5;
            break;
          case 4:
            _context99.p = 4;
            _t76 = _context99.v;
          case 5:
            adminButtons = '<div class="item"><strong>Administration</strong><p class="small">Household administration and NyxThea system administration are separate permissions.</p>'.concat(adminAccess.householdAdmin ? '<button id="householdAdminBtn" class="secondary">Household Admin</button>' : "").concat(adminAccess.systemAdmin ? '<button id="systemAdminBtn" class="secondary">System Admin</button>' : "", "</div>");
            panel("Your profile", "<p>Signed in as ".concat(esc(credential.displayName), '.</p><button id="nameSettings" class="primary">Name, birthday and pronunciation</button><button id="meetPerson" class="secondary">Someone new is talking</button><button id="chooseSpeaker" class="secondary">Choose active household speaker</button>').concat(adminButtons, '\n <div class="item"><strong>Security setup</strong><p class="small">').concat(((_b = lockInfo == null ? void 0 : lockInfo.lock) == null ? void 0 : _b.pinEnabled) ? "PIN is set. You can change it here." : "No PIN yet. Create one now, or keep using your account password.", '</p><input id="newProfilePinInline" class="field" inputmode="numeric" pattern="[0-9]{4,8}" minlength="4" maxlength="8" placeholder="4\u20138 digit PIN"><button id="saveProfilePinInline" class="primary">').concat(((_c = lockInfo == null ? void 0 : lockInfo.lock) == null ? void 0 : _c.pinEnabled) ? "Change PIN" : "Create PIN", '</button><button id="enableBiometricInline" class="secondary">Enable Face ID / Touch ID / passkey</button><p id="securityNote" class="small"></p></div>\n <div class="item"><strong>Change account password</strong><input id="currentAccountPassword" class="field" type="password" autocomplete="current-password" placeholder="Current password"><input id="newAccountPassword" class="field" type="password" autocomplete="new-password" placeholder="New password \u2014 at least 12 characters"><button id="changeAccountPassword" class="secondary">Change password</button><p id="passwordNote" class="small"></p></div>\n <div class="item"><strong>How Nyx talks with you</strong><select id="communicationStyle" class="field"><option value="professional">Professional \u2014 polished and direct</option><option value="natural">Natural \u2014 warm, witty and playful</option><option value="unfiltered">Unfiltered \u2014 adult language, swearing and innuendo</option></select><p class="small">Unfiltered is an adult opt-in for stronger language and playful mature banter. Child profiles stay age appropriate.</p><button id="saveCommunicationStyle" class="primary">Save conversation style</button><p id="communicationNote" class="small" role="status"></p></div>\n <div class="item"><strong>Your interface</strong><p class="small">Choose what Nyx puts on your dashboard. A module can be visible even before its external provider is connected.</p><div class="nyx-choice">').concat(moduleChoices, '</div><button id="saveInterfaceModules" class="primary">Save my interface</button><p id="interfaceNote" class="small"></p></div>\n <div class="item"><strong>Voice activation</strong><label class="choice"><input id="voiceEnabled" type="checkbox" ').concat(((_d = NYXExperience.settings) == null ? void 0 : _d.voiceEnabled) !== false ? "checked" : "", '> Allow voice interaction</label><label class="choice"><input id="handsFreeEnabled" type="checkbox" ').concat(((_e = NYXExperience.settings) == null ? void 0 : _e.handsFreeEnabled) ? "checked" : "", '> Wake by <strong>Nyx</strong> while this page is open</label><p class="small">NyxThea and Nixie are conversational names; the wake word is always Nyx.</p><p class="small">').concat(NYXExperience.wakeEnrollmentReady() ? "Nyx is taught on this device." : "This device still needs the 5-sample Nyx setup.", '</p><button id="teachNyx" class="secondary">').concat(NYXExperience.wakeEnrollmentReady() ? "Re-teach Nyx on this device" : "Teach Nyx my voice", '</button><button id="exportNyxSamples" class="secondary">Export Nyx training samples</button><button id="clearNyxSamples" class="secondary">Delete local Nyx training samples</button><p id="wakeSampleNote" class="small">Checking local samples\u2026</p><p id="voiceNote" class="small"></p></div>\n <div class="item"><strong>Interface sounds</strong><select id="soundMode" class="field"><option value="off">Off</option><option value="minimal">Minimal</option><option value="full">Full</option></select><label class="choice"><input id="decorativeSounds" type="checkbox"> Allow decorative interface sounds</label><button id="testSound" class="secondary">Preview Nyx sound</button><p id="soundNote" class="small"></p></div>\n <div class="item"><strong>Recovery email</strong><input id="recoveryEmail" class="field" type="email" placeholder="Recovery email"><button id="sendRecoveryVerify" class="secondary">Send verification code</button><input id="recoveryEmailCode" class="field" inputmode="numeric" maxlength="6" placeholder="6-digit verification code"><button id="confirmRecoveryEmail" class="secondary">Verify recovery email</button><button id="reverifyRecoveryEmail" class="secondary" style="display:none">Verify adult access again</button><p id="recoveryEmailNote" class="small"></p></div><button id="signOut" class="secondary">Sign out</button>'));
            $("#nameSettings").onclick = function () {
              return NYXExperience.onboard(true);
            };
            $("#meetPerson").onclick = meetSomeoneNew;
            $("#chooseSpeaker").onclick = chooseHouseholdSpeaker;
            if ($("#householdAdminBtn")) $("#householdAdminBtn").onclick = _asyncToGenerator(_regenerator().m(function _callee81() {
              var _a2, d, members, _t62;
              return _regenerator().w(function (_context81) {
                while (1) switch (_context81.p = _context81.n) {
                  case 0:
                    _context81.p = 0;
                    _context81.n = 1;
                    return api("/api/admin/household");
                  case 1:
                    d = _context81.v;
                    members = (((_a2 = d.household) == null ? void 0 : _a2.members) || []).map(function (m) {
                      var _a3;
                      return '<div class="item"><strong>' + esc(((_a3 = m.identity) == null ? void 0 : _a3.preferredName) || m.profileId) + '</strong><br><span class="small">' + esc(m.role || "member") + "</span></div>";
                    }).join("");
                    panel("Household Admin", "<p>Manage this household only. This does not grant NyxThea platform access.</p>" + members + '<div class="item"><strong>Devices</strong><br><span class="small">' + esc(String((d.devices || []).length)) + ' registered</span></div><div class="item"><strong>Integrations</strong><br><span class="small">' + esc(String((d.integrations || []).filter(function (x) {
                      return x.connection;
                    }).length)) + " configured</span></div>");
                    _context81.n = 3;
                    break;
                  case 2:
                    _context81.p = 2;
                    _t62 = _context81.v;
                    panel("Household Admin", "<p>" + esc(_t62.message) + "</p>");
                  case 3:
                    return _context81.a(2);
                }
              }, _callee81, null, [[0, 2]]);
            }));
            if ($("#systemAdminBtn")) $("#systemAdminBtn").onclick = _asyncToGenerator(_regenerator().m(function _callee82() {
              var d, runs, groups, _iterator8, _step8, run, failed, key, group, buildRows, _t63;
              return _regenerator().w(function (_context82) {
                while (1) switch (_context82.p = _context82.n) {
                  case 0:
                    _context82.p = 0;
                    _context82.n = 1;
                    return api("/api/admin/system");
                  case 1:
                    d = _context82.v;
                    runs = d.buildHealth || [];
                    groups = new Map();
                    _iterator8 = _createForOfIteratorHelper(runs);
                    try {
                      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                        run = _step8.value;
                        failed = (run.jobs || []).filter(function (job) {
                          return job.result !== "success" && job.result !== "skipped";
                        }).map(function (job) {
                          return job.name;
                        }).sort(), key = run.conclusion === "success" ? "success" : failed.join(",") || run.conclusion || "unknown", group = groups.get(key) || {
                          key,
                          count: 0,
                          latest: run
                        };
                        group.count++;
                        if (String(run.receivedAt || "") > String(group.latest.receivedAt || "")) group.latest = run;
                        groups.set(key, group);
                      }
                    } catch (err) {
                      _iterator8.e(err);
                    } finally {
                      _iterator8.f();
                    }
                    buildRows = _toConsumableArray(groups.values()).slice(0, 12).map(function (group) {
                      var run = group.latest,
                        failed = (run.jobs || []).filter(function (job) {
                          return job.result !== "success" && job.result !== "skipped";
                        }),
                        label = run.conclusion === "success" ? "Passed" : "Needs attention" + (failed.length ? ": " + failed.map(function (job) {
                          return job.name;
                        }).join(", ") : ""),
                        repeat = group.count > 1 ? " \xB7 " + group.count + " similar runs" : "",
                        when = run.receivedAt ? new Date(run.receivedAt).toLocaleString() : "time unavailable",
                        link = run.url ? '<br><a href="' + esc(run.url) + '" target="_blank" rel="noopener noreferrer">Open CI run</a>' : "";
                      return '<div class="item"><strong>' + esc(label) + '</strong><br><span class="small">' + esc((run.branch || "unknown branch") + " \xB7 " + String(run.sha || "").slice(0, 8) + repeat + " \xB7 " + when) + "</span>" + link + "</div>";
                    }).join("");
                    panel("System Admin", '<p>Platform-level diagnostics and audit access. Separate from household administration.</p><div class="item"><strong>Build health</strong><br><span class="small">' + esc(runs.length ? String(runs.length) + " recent CI reports" : "No CI reports received yet.") + "</span></div>" + buildRows + '<div class="item"><strong>System audit</strong><br><span class="small">' + esc(String((d.systemAudit || []).length)) + ' events</span></div><div class="item"><strong>Access audit</strong><br><span class="small">' + esc(String((d.accessAudit || []).length)) + ' events</span></div><div class="item"><strong>Integration audit</strong><br><span class="small">' + esc(String((d.integrationAudit || []).length)) + ' events</span></div><pre class="small" style="white-space:pre-wrap">' + esc(JSON.stringify(d.monitoring, null, 2)) + "</pre>");
                    _context82.n = 3;
                    break;
                  case 2:
                    _context82.p = 2;
                    _t63 = _context82.v;
                    panel("System Admin", "<p>" + esc(_t63.message) + "</p>");
                  case 3:
                    return _context82.a(2);
                }
              }, _callee82, null, [[0, 2]]);
            }));
            $("#communicationStyle").value = ((_f = NYXExperience.settings) == null ? void 0 : _f.communicationStyle) || "natural";
            $("#saveCommunicationStyle").onclick = _asyncToGenerator(_regenerator().m(function _callee83() {
              var note, _t64;
              return _regenerator().w(function (_context83) {
                while (1) switch (_context83.p = _context83.n) {
                  case 0:
                    note = $("#communicationNote");
                    _context83.p = 1;
                    _context83.n = 2;
                    return NYXExperience.save({
                      communicationStyle: $("#communicationStyle").value
                    });
                  case 2:
                    $("#communicationStyle").value = NYXExperience.settings.communicationStyle;
                    note.textContent = NYXExperience.settings.communicationStyle === "unfiltered" ? "Adult language and playful mature banter enabled for this profile." : "Conversation style saved.";
                    _context83.n = 4;
                    break;
                  case 3:
                    _context83.p = 3;
                    _t64 = _context83.v;
                    note.textContent = _t64.message;
                  case 4:
                    return _context83.a(2);
                }
              }, _callee83, null, [[1, 3]]);
            }));
            $("#saveProfilePinInline").onclick = _asyncToGenerator(_regenerator().m(function _callee84() {
              var note, pin, _t65;
              return _regenerator().w(function (_context84) {
                while (1) switch (_context84.p = _context84.n) {
                  case 0:
                    note = $("#securityNote");
                    _context84.n = 1;
                    return ensureSettingsAuthorization(note);
                  case 1:
                    if (_context84.v) {
                      _context84.n = 2;
                      break;
                    }
                    return _context84.a(2);
                  case 2:
                    pin = $("#newProfilePinInline").value.trim();
                    if (/^\d{4,8}$/.test(pin)) {
                      _context84.n = 3;
                      break;
                    }
                    note.textContent = "Enter a 4\u20138 digit PIN. Leading zeroes are allowed.";
                    return _context84.a(2);
                  case 3:
                    _context84.p = 3;
                    _context84.n = 4;
                    return api("/api/profile-lock/pin", {
                      method: "POST",
                      settingsAuth: true,
                      body: JSON.stringify({
                        pin,
                        stayUnlockedOnDevice: true,
                        deviceId: nyxDeviceId()
                      })
                    });
                  case 4:
                    note.textContent = "PIN saved. This device stays unlocked.";
                    _context84.n = 6;
                    break;
                  case 5:
                    _context84.p = 5;
                    _t65 = _context84.v;
                    note.textContent = _t65.message;
                  case 6:
                    return _context84.a(2);
                }
              }, _callee84, null, [[3, 5]]);
            }));
            $("#enableBiometricInline").onclick = _asyncToGenerator(_regenerator().m(function _callee85() {
              var note;
              return _regenerator().w(function (_context85) {
                while (1) switch (_context85.n) {
                  case 0:
                    note = $("#securityNote");
                    if (settingsAuthToken) {
                      _context85.n = 1;
                      break;
                    }
                    note.textContent = "Verify your account password or PIN first, then enable Face ID / Touch ID.";
                    return _context85.a(2);
                  case 1:
                    _context85.n = 2;
                    return setupDeviceBiometric();
                  case 2:
                    return _context85.a(2);
                }
              }, _callee85);
            }));
            $("#changeAccountPassword").onclick = _asyncToGenerator(_regenerator().m(function _callee86() {
              var note, currentPassword, newPassword, _t66;
              return _regenerator().w(function (_context86) {
                while (1) switch (_context86.p = _context86.n) {
                  case 0:
                    note = $("#passwordNote");
                    _context86.n = 1;
                    return ensureSettingsAuthorization(note);
                  case 1:
                    if (_context86.v) {
                      _context86.n = 2;
                      break;
                    }
                    return _context86.a(2);
                  case 2:
                    currentPassword = $("#currentAccountPassword").value, newPassword = $("#newAccountPassword").value;
                    _context86.p = 3;
                    _context86.n = 4;
                    return api("/api/settings/change-password", {
                      method: "POST",
                      settingsAuth: true,
                      body: JSON.stringify({
                        currentPassword,
                        newPassword,
                        deviceId: nyxDeviceId()
                      })
                    });
                  case 4:
                    note.textContent = "Password changed. This device remains signed in.";
                    _context86.n = 6;
                    break;
                  case 5:
                    _context86.p = 5;
                    _t66 = _context86.v;
                    note.textContent = _t66.message;
                  case 6:
                    return _context86.a(2);
                }
              }, _callee86, null, [[3, 5]]);
            }));
            $("#saveInterfaceModules").onclick = _asyncToGenerator(_regenerator().m(function _callee87() {
              var visible, _t67;
              return _regenerator().w(function (_context87) {
                while (1) switch (_context87.p = _context87.n) {
                  case 0:
                    visible = $$("[data-module-choice]:checked").map(function (x) {
                      return x.dataset.moduleChoice;
                    });
                    _context87.p = 1;
                    _context87.n = 2;
                    return NYXExperience.save({
                      visibleModules: visible
                    });
                  case 2:
                    applyInterfacePreferences();
                    $("#interfaceNote").textContent = "Your interface is updated.";
                    _context87.n = 4;
                    break;
                  case 3:
                    _context87.p = 3;
                    _t67 = _context87.v;
                    $("#interfaceNote").textContent = _t67.message;
                  case 4:
                    return _context87.a(2);
                }
              }, _callee87, null, [[1, 3]]);
            }));
            $("#voiceEnabled").onchange = function () {
              var _ref43 = _asyncToGenerator(_regenerator().m(function _callee88(e) {
                var _t68;
                return _regenerator().w(function (_context88) {
                  while (1) switch (_context88.p = _context88.n) {
                    case 0:
                      _context88.p = 0;
                      _context88.n = 1;
                      return NYXExperience.save({
                        voiceEnabled: e.target.checked
                      });
                    case 1:
                      if (!e.target.checked) {
                        NYXHandsFree.stop();
                        NYXVoice.stop();
                      }
                      $("#voiceNote").textContent = "Voice preference saved.";
                      _context88.n = 3;
                      break;
                    case 2:
                      _context88.p = 2;
                      _t68 = _context88.v;
                      $("#voiceNote").textContent = _t68.message;
                    case 3:
                      return _context88.a(2);
                  }
                }, _callee88, null, [[0, 2]]);
              }));
              return function (_x16) {
                return _ref43.apply(this, arguments);
              };
            }();
            $("#teachNyx").onclick = _asyncToGenerator(_regenerator().m(function _callee89() {
              var ok;
              return _regenerator().w(function (_context89) {
                while (1) switch (_context89.n) {
                  case 0:
                    _context89.n = 1;
                    return NYXExperience.enrollWakeWord({
                      returnToSettings: true
                    });
                  case 1:
                    ok = _context89.v;
                    if (ok) $("#voiceNote").textContent = "Nyx is ready on this device.";
                  case 2:
                    return _context89.a(2);
                }
              }, _callee89);
            }));
            void NYXWakeTraining.count().then(function (count) {
              var note = $("#wakeSampleNote");
              if (note) note.textContent = count ? "".concat(count, " local Nyx training sample").concat(count === 1 ? "" : "s", " stored on this device.") : "No local Nyx training samples stored yet.";
            });
            $("#exportNyxSamples").onclick = _asyncToGenerator(_regenerator().m(function _callee90() {
              var note, count, _t69;
              return _regenerator().w(function (_context90) {
                while (1) switch (_context90.p = _context90.n) {
                  case 0:
                    note = $("#wakeSampleNote");
                    _context90.p = 1;
                    _context90.n = 2;
                    return NYXWakeTraining.count();
                  case 2:
                    count = _context90.v;
                    if (count) {
                      _context90.n = 3;
                      break;
                    }
                    note.textContent = "There are no local Nyx samples to export yet.";
                    return _context90.a(2);
                  case 3:
                    _context90.n = 4;
                    return NYXWakeTraining.export();
                  case 4:
                    note.textContent = "Exported ".concat(count, " local Nyx training samples.");
                    _context90.n = 6;
                    break;
                  case 5:
                    _context90.p = 5;
                    _t69 = _context90.v;
                    note.textContent = _t69.message;
                  case 6:
                    return _context90.a(2);
                }
              }, _callee90, null, [[1, 5]]);
            }));
            $("#clearNyxSamples").onclick = _asyncToGenerator(_regenerator().m(function _callee91() {
              var note, _t70;
              return _regenerator().w(function (_context91) {
                while (1) switch (_context91.p = _context91.n) {
                  case 0:
                    note = $("#wakeSampleNote");
                    _context91.p = 1;
                    _context91.n = 2;
                    return NYXWakeTraining.clear();
                  case 2:
                    note.textContent = "Local Nyx training samples deleted from this device.";
                    _context91.n = 4;
                    break;
                  case 3:
                    _context91.p = 3;
                    _t70 = _context91.v;
                    note.textContent = _t70.message;
                  case 4:
                    return _context91.a(2);
                }
              }, _callee91, null, [[1, 3]]);
            }));
            $("#handsFreeEnabled").onchange = function () {
              var _ref47 = _asyncToGenerator(_regenerator().m(function _callee92(e) {
                var note, ok, _t71;
                return _regenerator().w(function (_context92) {
                  while (1) switch (_context92.p = _context92.n) {
                    case 0:
                      note = $("#voiceNote");
                      if (!(e.target.checked && !NYXExperience.wakeEnrollmentReady())) {
                        _context92.n = 2;
                        break;
                      }
                      note.textContent = "Teach Nyx your voice first.";
                      _context92.n = 1;
                      return NYXExperience.enrollWakeWord({
                        returnToSettings: true
                      });
                    case 1:
                      ok = _context92.v;
                      if (ok) {
                        _context92.n = 2;
                        break;
                      }
                      e.target.checked = false;
                      return _context92.a(2);
                    case 2:
                      if (e.target.checked) NYXHandsFree.start();else NYXHandsFree.stop();
                      _context92.p = 3;
                      _context92.n = 4;
                      return NYXExperience.save({
                        handsFreeEnabled: e.target.checked,
                        handsFreeConfigured: true
                      });
                    case 4:
                      note.textContent = e.target.checked ? "Wake-by-Nyx saved." : "Wake-by-Nyx turned off.";
                      _context92.n = 6;
                      break;
                    case 5:
                      _context92.p = 5;
                      _t71 = _context92.v;
                      note.textContent = _t71.message;
                    case 6:
                      return _context92.a(2);
                  }
                }, _callee92, null, [[3, 5]]);
              }));
              return function (_x17) {
                return _ref47.apply(this, arguments);
              };
            }();
            soundMode = $("#soundMode"), decorative = $("#decorativeSounds"), soundNote = $("#soundNote");
            soundMode.value = ((_g = NYXExperience.settings) == null ? void 0 : _g.soundMode) || "minimal";
            decorative.checked = ((_h = NYXExperience.settings) == null ? void 0 : _h.decorativeSounds) !== false;
            soundMode.onchange = _asyncToGenerator(_regenerator().m(function _callee93() {
              var _t72;
              return _regenerator().w(function (_context93) {
                while (1) switch (_context93.p = _context93.n) {
                  case 0:
                    _context93.p = 0;
                    _context93.n = 1;
                    return NYXExperience.save({
                      soundMode: soundMode.value
                    });
                  case 1:
                    soundNote.textContent = "Sound mode saved.";
                    _context93.n = 3;
                    break;
                  case 2:
                    _context93.p = 2;
                    _t72 = _context93.v;
                    soundNote.textContent = _t72.message;
                  case 3:
                    return _context93.a(2);
                }
              }, _callee93, null, [[0, 2]]);
            }));
            decorative.onchange = _asyncToGenerator(_regenerator().m(function _callee94() {
              var _t73;
              return _regenerator().w(function (_context94) {
                while (1) switch (_context94.p = _context94.n) {
                  case 0:
                    _context94.p = 0;
                    _context94.n = 1;
                    return NYXExperience.save({
                      decorativeSounds: decorative.checked
                    });
                  case 1:
                    soundNote.textContent = "Sound preference saved.";
                    _context94.n = 3;
                    break;
                  case 2:
                    _context94.p = 2;
                    _t73 = _context94.v;
                    soundNote.textContent = _t73.message;
                  case 3:
                    return _context94.a(2);
                }
              }, _callee94, null, [[0, 2]]);
            }));
            $("#testSound").onclick = _asyncToGenerator(_regenerator().m(function _callee95() {
              return _regenerator().w(function (_context95) {
                while (1) switch (_context95.n) {
                  case 0:
                    _context95.n = 1;
                    return NYXSound.prime();
                  case 1:
                    NYXSound.cue("startup");
                  case 2:
                    return _context95.a(2);
                }
              }, _callee95);
            }));
            recoveryNote = $("#recoveryEmailNote");
            if ((_i = recovery == null ? void 0 : recovery.recovery) == null ? void 0 : _i.recoveryEmailVerified) {
              $("#recoveryEmail").value = recovery.recovery.recoveryEmail || "";
              recoveryNote.textContent = "Verified recovery email is active.";
            } else if (recovery && !recovery.emailDeliveryConfigured) recoveryNote.textContent = "Recovery email delivery is not configured yet; your saved recovery code still works.";
            $("#sendRecoveryVerify").onclick = _asyncToGenerator(_regenerator().m(function _callee96() {
              var d, _t74;
              return _regenerator().w(function (_context96) {
                while (1) switch (_context96.p = _context96.n) {
                  case 0:
                    _context96.n = 1;
                    return ensureSettingsAuthorization(recoveryNote);
                  case 1:
                    if (_context96.v) {
                      _context96.n = 2;
                      break;
                    }
                    return _context96.a(2);
                  case 2:
                    _context96.p = 2;
                    _context96.n = 3;
                    return api("/api/recovery/email/start", {
                      method: "POST",
                      settingsAuth: true,
                      body: JSON.stringify({
                        email: $("#recoveryEmail").value,
                        deviceId: nyxDeviceId()
                      })
                    });
                  case 3:
                    d = _context96.v;
                    recoveryNote.textContent = d.sent ? "Verification code sent. Verify adult access again before confirming the code." : "Could not send verification email.";
                    if (d.sent) $("#reverifyRecoveryEmail").style.display = "";
                    _context96.n = 5;
                    break;
                  case 4:
                    _context96.p = 4;
                    _t74 = _context96.v;
                    recoveryNote.textContent = _t74.message;
                  case 5:
                    return _context96.a(2);
                }
              }, _callee96, null, [[2, 4]]);
            }));
            $("#reverifyRecoveryEmail").onclick = _asyncToGenerator(_regenerator().m(function _callee97() {
              return _regenerator().w(function (_context97) {
                while (1) switch (_context97.n) {
                  case 0:
                    _context97.n = 1;
                    return refreshSettingsAuthorization();
                  case 1:
                    return _context97.a(2);
                }
              }, _callee97);
            }));
            $("#confirmRecoveryEmail").onclick = _asyncToGenerator(_regenerator().m(function _callee98() {
              var _t75;
              return _regenerator().w(function (_context98) {
                while (1) switch (_context98.p = _context98.n) {
                  case 0:
                    if (settingsAuthToken) {
                      _context98.n = 1;
                      break;
                    }
                    recoveryNote.textContent = "Verify adult access again before confirming the recovery email.";
                    $("#reverifyRecoveryEmail").style.display = "";
                    return _context98.a(2);
                  case 1:
                    _context98.p = 1;
                    _context98.n = 2;
                    return api("/api/recovery/email/confirm", {
                      method: "POST",
                      settingsAuth: true,
                      body: JSON.stringify({
                        code: $("#recoveryEmailCode").value,
                        deviceId: nyxDeviceId()
                      })
                    });
                  case 2:
                    recoveryNote.textContent = "Recovery email verified.";
                    _context98.n = 4;
                    break;
                  case 3:
                    _context98.p = 3;
                    _t75 = _context98.v;
                    recoveryNote.textContent = _t75.message;
                  case 4:
                    return _context98.a(2);
                }
              }, _callee98, null, [[1, 3]]);
            }));
            $("#signOut").onclick = signOut;
          case 6:
            return _context99.a(2);
        }
      }, _callee99, null, [[2, 4]]);
    }));
    return _accountSettings.apply(this, arguments);
  }
  function state(s, label) {
    var prior = document.body.dataset.nyxState;
    rose.classList.toggle("listening", s === "listening");
    rose.classList.toggle("speaking", s === "speaking");
    mic.classList.toggle("listening", s === "listening");
    $("#roseStatus").lastElementChild.textContent = label || "Ready when you are";
    if (s !== prior) {
      document.body.dataset.nyxState = s === "ready" ? "idle" : s;
      if (s === "listening") NYXSound.cue("listening");else if (s === "thinking") NYXSound.cue("thinking");
    }
  }
  function speak(_x7) {
    return _speak.apply(this, arguments);
  }
  function _speak() {
    _speak = _asyncToGenerator(_regenerator().m(function _callee100(text) {
      var _a, _b, _c, name, phonetic, spoken, _t77;
      return _regenerator().w(function (_context100) {
        while (1) switch (_context100.n) {
          case 0:
            if (!(((_a = NYXExperience.settings) == null ? void 0 : _a.voiceEnabled) === false)) {
              _context100.n = 1;
              break;
            }
            return _context100.a(2, false);
          case 1:
            name = (_b = NYXExperience.settings) == null ? void 0 : _b.preferredName, phonetic = (_c = NYXExperience.settings) == null ? void 0 : _c.pronunciation;
            spoken = String(text || "");
            if (name && phonetic) spoken = spoken.replaceAll(name, phonetic);
            if (!window.NYXVoice) {
              _context100.n = 3;
              break;
            }
            _context100.n = 2;
            return NYXVoice.say(spoken);
          case 2:
            _t77 = _context100.v;
            _context100.n = 4;
            break;
          case 3:
            _t77 = false;
          case 4:
            return _context100.a(2, _t77);
        }
      }, _callee100);
    }));
    return _speak.apply(this, arguments);
  }
  function send() {
    return _send.apply(this, arguments);
  }
  function _send() {
    _send = _asyncToGenerator(_regenerator().m(function _callee101() {
      var m,
        _ref54,
        _ref54$voiceTurn,
        voiceTurn,
        epoch,
        profileId,
        controller,
        _iterator9,
        _step9,
        c,
        answer,
        d,
        reply,
        spoken,
        _args101 = arguments,
        _t78;
      return _regenerator().w(function (_context101) {
        while (1) switch (_context101.p = _context101.n) {
          case 0:
            m = _args101.length > 0 && _args101[0] !== undefined ? _args101[0] : input.value.trim();
            _ref54 = _args101.length > 1 && _args101[1] !== undefined ? _args101[1] : {}, _ref54$voiceTurn = _ref54.voiceTurn, voiceTurn = _ref54$voiceTurn === void 0 ? false : _ref54$voiceTurn;
            if (m) {
              _context101.n = 1;
              break;
            }
            return _context101.a(2);
          case 1:
            if (credential) {
              _context101.n = 2;
              break;
            }
            unlock();
            return _context101.a(2);
          case 2:
            epoch = conversationEpoch, profileId = credential.id, controller = new AbortController();
            chatControllers.add(controller);
            input.value = "";
            if (NYXHandsFree.active) {
              _iterator9 = _createForOfIteratorHelper(NYXHandsFree.wakeAborts);
              try {
                for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                  c = _step9.value;
                  try {
                    c.abort();
                  } catch (e) {}
                }
              } catch (err) {
                _iterator9.e(err);
              } finally {
                _iterator9.f();
              }
              NYXHandsFree.pause();
            }
            if (!voiceTurn) panel("Nyxthea", "".concat(conversationMarkup(), '<div class="msg user">').concat(esc(m), '</div><div class="msg assistant" id="reply">Thinking\u2026</div>'));
            state("thinking", "Thinking");
            answer = "";
            _context101.p = 3;
            _context101.n = 4;
            return api(voiceTurn ? "/api/voice/chat" : "/api/chat", {
              method: "POST",
              timeoutMs: voiceTurn ? 9500 : 12e3,
              signal: controller.signal,
              body: JSON.stringify(voiceTurn ? {
                message: m,
                speakerProfileId: NYXHandsFree.speakerProfileId
              } : {
                message: m
              })
            });
          case 4:
            d = _context101.v;
            if (!(epoch !== conversationEpoch || (credential == null ? void 0 : credential.id) !== profileId)) {
              _context101.n = 5;
              break;
            }
            return _context101.a(2);
          case 5:
            answer = String(d.answer || "").trim();
            if (!voiceTurn && Array.isArray(d.conversation)) conversationHistory = d.conversation;else if (!voiceTurn) {
              conversationHistory.push({
                role: "user",
                text: m
              }, {
                role: "assistant",
                text: answer
              });
            }
            _context101.n = 7;
            break;
          case 6:
            _context101.p = 6;
            _t78 = _context101.v;
            if (!(epoch !== conversationEpoch || (credential == null ? void 0 : credential.id) !== profileId || controller.signal.aborted)) {
              _context101.n = 7;
              break;
            }
            return _context101.a(2);
          case 7:
            _context101.p = 7;
            chatControllers.delete(controller);
            return _context101.f(7);
          case 8:
            if (!(epoch !== conversationEpoch || (credential == null ? void 0 : credential.id) !== profileId)) {
              _context101.n = 9;
              break;
            }
            return _context101.a(2);
          case 9:
            if (!answer) answer = "I hit a snag. Ask me that again.";
            if (!voiceTurn) {
              reply = $("#reply");
              if (reply) reply.textContent = answer;
            }
            spoken = false;
            _context101.p = 10;
            _context101.n = 11;
            return speak(answer);
          case 11:
            spoken = _context101.v;
          case 12:
            _context101.p = 12;
            if (!(epoch !== conversationEpoch || (credential == null ? void 0 : credential.id) !== profileId)) {
              _context101.n = 13;
              break;
            }
            return _context101.a(2);
          case 13:
            if (!spoken) NYXHandsFree.resume();
            if (!NYXVoice.speaking) state(NYXHandsFree.active ? "listening" : "ready", NYXHandsFree.active ? "Listening for Nyx" : "Ready when you are");
            return _context101.f(12);
          case 14:
            return _context101.a(2);
        }
      }, _callee101, null, [[10,, 12, 14], [3, 6, 7, 8]]);
    }));
    return _send.apply(this, arguments);
  }
  $("#send").onclick = function () {
    return send();
  };
  input.onkeydown = function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };
  $$(".quick button[data-prefix]").forEach(function (b) {
    return b.onclick = function () {
      input.value = b.dataset.prefix;
      input.focus();
    };
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
    var wasHandsFree = NYXHandsFree.active;
    if (wasHandsFree) NYXHandsFree.pause();
    NYXVoice.toggle(function (t) {
      var spoken = String(t || "").trim();
      if (spoken) send(spoken, {
        voiceTurn: true
      });else if (wasHandsFree) NYXHandsFree.resume();
    });
  }
  mic.onclick = toggleVoice;
  function memories() {
    return _memories.apply(this, arguments);
  }
  function _memories() {
    _memories = _asyncToGenerator(_regenerator().m(function _callee103() {
      var d, list, _t80;
      return _regenerator().w(function (_context103) {
        while (1) switch (_context103.p = _context103.n) {
          case 0:
            if (credential) {
              _context103.n = 1;
              break;
            }
            unlock();
            return _context103.a(2);
          case 1:
            _context103.p = 1;
            _context103.n = 2;
            return api("/api/memories");
          case 2:
            d = _context103.v;
            list = d.memories.length ? d.memories.map(function (x) {
              return '<div class="item">'.concat(esc(x.text), "</div>");
            }).join("") : '<div class="item">Nothing is saved yet.</div>';
            panel("Your memory", "<p>".concat(esc(d.notice || "Memory remains under your control."), "</p>").concat(list, '<input id="memText" class="field" placeholder="Save something you choose"><button id="saveMem" class="primary">Remember</button>'));
            $("#saveMem").onclick = _asyncToGenerator(_regenerator().m(function _callee102() {
              var text, _t79;
              return _regenerator().w(function (_context102) {
                while (1) switch (_context102.p = _context102.n) {
                  case 0:
                    text = $("#memText").value.trim();
                    if (text) {
                      _context102.n = 1;
                      break;
                    }
                    return _context102.a(2);
                  case 1:
                    _context102.p = 1;
                    _context102.n = 2;
                    return api("/api/memories", {
                      method: "POST",
                      body: JSON.stringify({
                        text
                      })
                    });
                  case 2:
                    memories();
                    _context102.n = 4;
                    break;
                  case 3:
                    _context102.p = 3;
                    _t79 = _context102.v;
                    panel("Your memory", "<p>".concat(esc(_t79.message), '</p><button id="memoryRetry" class="secondary">Back to memories</button>'));
                    $("#memoryRetry").onclick = memories;
                  case 4:
                    return _context102.a(2);
                }
              }, _callee102, null, [[1, 3]]);
            }));
            _context103.n = 4;
            break;
          case 3:
            _context103.p = 3;
            _t80 = _context103.v;
            panel("Your memory", "<p>".concat(esc(_t80.message), "</p>"));
          case 4:
            return _context103.a(2);
        }
      }, _callee103, null, [[1, 3]]);
    }));
    return _memories.apply(this, arguments);
  }
  $("#memory").onclick = memories;
  var emergencyLabels = {
    i_need_help: "I need help",
    i_cannot_speak: "I cannot speak",
    medical: "Medical",
    fire_smoke: "Fire or smoke",
    intruder: "Intruder",
    home_emergency: "Home emergency",
    vehicle_crash: "Vehicle crash",
    lost_or_unsafe: "Lost or unsafe"
  };
  function emergencySetup() {
    var choices = Object.entries(emergencyLabels).map(function (_ref7, i) {
      var _ref8 = _slicedToArray(_ref7, 2),
        value = _ref8[0],
        label = _ref8[1];
      return '<label class="choice"><input type="radio" name="emergencyType" value="'.concat(value, '" ').concat(i === 0 ? "checked" : "", "> ").concat(label, "</label>");
    }).join("");
    panel("Emergency help", '<a class="emergency-call" href="tel:911">Call 911 now (U.S.)</a><div class="item emergency-note"><strong>Nyxthea has not contacted 911 or anyone else.</strong><p>This screen works silently. The call button opens your phone\'s native dialer; you must place the call.</p></div><div class="choice-grid">'.concat(choices, '</div><label class="choice"><input id="emergencyPractice" type="checkbox"> Practice mode \u2014 records a test only</label><button id="startEmergency" class="primary">Confirm and start</button><p id="emergencyStatus" class="small">').concat(credential ? "A confirmed incident will be saved to your private profile." : "You can call 911 without unlocking. Unlock is required only to save a Nyxthea incident timeline.", "</p>"));
    $("#startEmergency").onclick = startEmergency;
  }
  function startEmergency() {
    return _startEmergency.apply(this, arguments);
  }
  function _startEmergency() {
    _startEmergency = _asyncToGenerator(_regenerator().m(function _callee104() {
      var _a, status, type, practice, d, _t81;
      return _regenerator().w(function (_context104) {
        while (1) switch (_context104.p = _context104.n) {
          case 0:
            status = $("#emergencyStatus"), type = (_a = $("input[name=emergencyType]:checked")) == null ? void 0 : _a.value, practice = $("#emergencyPractice").checked;
            if (credential) {
              _context104.n = 1;
              break;
            }
            status.textContent = "Session locked. The 911 call button still works; unlock only if you want to save an incident timeline.";
            return _context104.a(2);
          case 1:
            _context104.p = 1;
            status.textContent = "Starting\u2026";
            _context104.n = 2;
            return api("/api/emergency/incidents", {
              method: "POST",
              body: JSON.stringify({
                type,
                practice,
                confirm: true
              })
            });
          case 2:
            d = _context104.v;
            renderEmergency(d.incident);
            _context104.n = 4;
            break;
          case 3:
            _context104.p = 3;
            _t81 = _context104.v;
            status.textContent = _t81.message;
          case 4:
            return _context104.a(2);
        }
      }, _callee104, null, [[1, 3]]);
    }));
    return _startEmergency.apply(this, arguments);
  }
  function renderEmergency(incident) {
    var label = emergencyLabels[incident.type] || incident.type,
      practice = incident.practice,
      timeline = incident.timeline.map(function (item) {
        return '<div class="small">'.concat(new Date(item.at).toLocaleTimeString(), " \xB7 ").concat(esc(item.detail), "</div>");
      }).join("");
    panel(practice ? "Emergency practice" : "Emergency active", "".concat(practice ? "" : '<a class="emergency-call" href="tel:911">Call 911 now (U.S.)</a>', '<div class="item emergency-note"><strong>').concat(practice ? "Practice only \u2014 no one was contacted." : "Nyxthea has NOT contacted 911 or trusted adults.", "</strong><p>").concat(practice ? "Use this screen to learn the controls safely." : "Use the call button if emergency help is needed. Stay quiet if speaking could put you in danger.", '</p></div><div class="item"><strong>').concat(esc(label), '</strong><br><span class="small">Status: ').concat(esc(incident.status), " \xB7 ").concat(new Date(incident.createdAt).toLocaleString(), '</span></div><div id="emergencyLocation">').concat(incident.location ? locationMarkup(incident.location) : '<span class="small">No location has been requested or saved.</span>', '</div><div class="emergency-actions"><button id="getEmergencyLocation" class="secondary">Use location once</button><button id="markEmergencySafe" class="secondary">Mark safe locally</button></div><div class="item"><strong>Local timeline</strong>').concat(timeline, '</div><div class="item"><strong>Not connected yet</strong><p class="small">Automatic emergency dispatch, trusted-contact messages, background location, and audio/video recording are not active.</p></div><p id="emergencyStatus" class="small"></p>'));
    $("#getEmergencyLocation").onclick = function () {
      return shareEmergencyLocation(incident);
    };
    $("#markEmergencySafe").onclick = function () {
      return markEmergencySafe(incident);
    };
  }
  function locationMarkup(location) {
    return '<div class="item"><strong>One-time location</strong><p>'.concat(esc(location.latitude.toFixed(5)), ", ").concat(esc(location.longitude.toFixed(5)), " \xB7 accuracy about ").concat(esc(Math.round(location.accuracy)), ' m</p><span class="small">This is a single browser reading, not continuous tracking.</span></div>');
  }
  function shareEmergencyLocation(incident) {
    var status = $("#emergencyStatus");
    if (!navigator.geolocation) {
      status.textContent = "Location is not supported by this browser.";
      return;
    }
    status.textContent = "Waiting for browser location permission\u2026";
    navigator.geolocation.getCurrentPosition(function () {
      var _ref9 = _asyncToGenerator(_regenerator().m(function _callee7(position) {
        var d, _t7;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              _context7.p = 0;
              _context7.n = 1;
              return api("/api/emergency/incidents/".concat(incident.id, "/location"), {
                method: "POST",
                body: JSON.stringify({
                  share: true,
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  accuracy: position.coords.accuracy,
                  observedAt: new Date(position.timestamp).toISOString()
                })
              });
            case 1:
              d = _context7.v;
              $("#emergencyLocation").innerHTML = locationMarkup(d.incident.location);
              status.textContent = "One-time location saved to this incident. It is not being tracked.";
              _context7.n = 3;
              break;
            case 2:
              _context7.p = 2;
              _t7 = _context7.v;
              status.textContent = _t7.message;
            case 3:
              return _context7.a(2);
          }
        }, _callee7, null, [[0, 2]]);
      }));
      return function (_x8) {
        return _ref9.apply(this, arguments);
      };
    }(), function (error) {
      status.textContent = error.message || "Location permission was not granted.";
    }, {
      enableHighAccuracy: true,
      timeout: 12e3,
      maximumAge: 0
    });
  }
  function markEmergencySafe(_x9) {
    return _markEmergencySafe.apply(this, arguments);
  }
  function _markEmergencySafe() {
    _markEmergencySafe = _asyncToGenerator(_regenerator().m(function _callee105(incident) {
      var status, d, _t82;
      return _regenerator().w(function (_context105) {
        while (1) switch (_context105.p = _context105.n) {
          case 0:
            status = $("#emergencyStatus");
            _context105.p = 1;
            _context105.n = 2;
            return api("/api/emergency/incidents/".concat(incident.id, "/mark-safe"), {
              method: "POST",
              body: JSON.stringify({
                confirm: true
              })
            });
          case 2:
            d = _context105.v;
            status.textContent = d.incident.practice ? "Practice complete." : "Marked safe only inside Nyxthea. This did not cancel or update emergency services.";
            $("#markEmergencySafe").disabled = true;
            _context105.n = 4;
            break;
          case 3:
            _context105.p = 3;
            _t82 = _context105.v;
            status.textContent = _t82.message;
          case 4:
            return _context105.a(2);
        }
      }, _callee105, null, [[1, 3]]);
    }));
    return _markEmergencySafe.apply(this, arguments);
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
  function startLiveGuide() {
    return _startLiveGuide.apply(this, arguments);
  }
  function _startLiveGuide() {
    _startLiveGuide = _asyncToGenerator(_regenerator().m(function _callee106() {
      var objective, source, microphone, confirm, note, sources, token, d, visual, tracks, audio, _t83, _t84;
      return _regenerator().w(function (_context106) {
        while (1) switch (_context106.p = _context106.n) {
          case 0:
            objective = $("#guideObjective").value.trim(), source = $("input[name=guideSource]:checked").value, microphone = $("#guideMic").checked, confirm = $("#guideConsent").checked, note = $("#guideNote");
            if (objective) {
              _context106.n = 1;
              break;
            }
            note.textContent = "Tell Nyxthea what you are trying to fix.";
            return _context106.a(2);
          case 1:
            if (confirm) {
              _context106.n = 2;
              break;
            }
            note.textContent = "Live Guide needs your explicit permission before it can view or listen.";
            return _context106.a(2);
          case 2:
            guideResumeHandsFree = NYXHandsFree.active;
            if (guideResumeHandsFree) NYXHandsFree.pause();
            sources = [source].concat(_toConsumableArray(microphone ? ["microphone"] : [])), token = ++guideToken;
            _context106.p = 3;
            _context106.n = 4;
            return api("/api/live-guide", {
              method: "POST",
              body: JSON.stringify({
                objective,
                sources,
                confirm: true
              })
            });
          case 4:
            d = _context106.v;
            if (!(token !== guideToken || document.hidden)) {
              _context106.n = 5;
              break;
            }
            return _context106.a(2);
          case 5:
            guideSession = d.session;
            if (!(d.session.status === "safety_hold")) {
              _context106.n = 6;
              break;
            }
            panel("Live Guide safety stop", '<div class="item risk-stop"><strong>Stop here.</strong><p>'.concat(esc(d.session.safety.message), "</p></div>"));
            guideSession = null;
            return _context106.a(2);
          case 6:
            if (!(source === "screen")) {
              _context106.n = 8;
              break;
            }
            _context106.n = 7;
            return nyxMediaRequest(navigator.mediaDevices.getDisplayMedia({
              video: true,
              audio: false
            }), 9e3, "Screen-share permission timed out.");
          case 7:
            _t83 = _context106.v;
            _context106.n = 10;
            break;
          case 8:
            _context106.n = 9;
            return nyxMediaRequest(navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: {
                  ideal: "environment"
                }
              },
              audio: false
            }), 9e3, "Camera permission timed out.");
          case 9:
            _t83 = _context106.v;
          case 10:
            visual = _t83;
            tracks = _toConsumableArray(visual.getTracks());
            guidePending = tracks;
            if (!(token !== guideToken || document.hidden)) {
              _context106.n = 11;
              break;
            }
            tracks.forEach(function (t) {
              return t.stop();
            });
            return _context106.a(2);
          case 11:
            if (!microphone) {
              _context106.n = 14;
              break;
            }
            _context106.n = 12;
            return nyxMediaRequest(navigator.mediaDevices.getUserMedia({
              audio: true,
              video: false
            }), 7e3, "Microphone permission timed out.");
          case 12:
            audio = _context106.v;
            tracks.push.apply(tracks, _toConsumableArray(audio.getAudioTracks()));
            if (!(token !== guideToken || document.hidden)) {
              _context106.n = 13;
              break;
            }
            tracks.forEach(function (t) {
              return t.stop();
            });
            return _context106.a(2);
          case 13:
            startGuideTranscript();
          case 14:
            guidePending = [];
            guideStream = new MediaStream(tracks);
            tracks.forEach(function (track) {
              return track.onended = function () {
                if (guideSession) endLiveGuide(true);
              };
            });
            renderLiveGuide();
            _context106.n = 17;
            break;
          case 15:
            _context106.p = 15;
            _t84 = _context106.v;
            guidePending.forEach(function (t) {
              return t.stop();
            });
            guidePending = [];
            if (!(token !== guideToken)) {
              _context106.n = 16;
              break;
            }
            return _context106.a(2);
          case 16:
            if (guideSession) api("/api/live-guide/".concat(guideSession.id), {
              method: "DELETE"
            }).catch(function () {});
            guideSession = null;
            if (guideStream) guideStream.getTracks().forEach(function (t) {
              return t.stop();
            });
            guideStream = null;
            if (guideResumeHandsFree) {
              guideResumeHandsFree = false;
              NYXHandsFree.resume();
            }
            panel("Live Guide could not start", "<p>".concat(esc(_t84.message || "Camera, microphone, or screen access was not granted."), '</p><button class="secondary" id="tryGuide">Try again</button>'));
            $("#tryGuide").onclick = guideSetup;
          case 17:
            return _context106.a(2);
        }
      }, _callee106, null, [[3, 15]]);
    }));
    return _startLiveGuide.apply(this, arguments);
  }
  function startGuideTranscript() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    var token = guideToken;
    var _cycle = function cycle() {
      if (!guideSession || token !== guideToken || document.hidden) return;
      var r = new SR();
      guideRecognition = r;
      r.continuous = false;
      r.interimResults = false;
      r.lang = "en-US";
      r.onresult = function (e) {
        var _a, _b, _c, _d;
        var heard = (_d = (_c = (_b = (_a = e.results) == null ? void 0 : _a[0]) == null ? void 0 : _b[0]) == null ? void 0 : _c.transcript) == null ? void 0 : _d.trim();
        if (heard) guideTranscript = (guideTranscript + " " + heard).trim().slice(-1200);
      };
      r.onerror = function () {};
      r.onend = function () {
        if (guideRecognition === r) guideRecognition = null;
        if (guideSession && token === guideToken && !document.hidden) setTimeout(_cycle, 250);
      };
      try {
        r.start();
      } catch (e) {
        if (guideRecognition === r) guideRecognition = null;
        if (guideSession && token === guideToken) setTimeout(_cycle, 500);
      }
    };
    _cycle();
  }
  function renderLiveGuide() {
    panel("Live Guide", '<div class="guide-live">Viewing only this session</div><video id="guideVideo" class="guide-video" autoplay muted playsinline></video><input id="guideUserNote" class="field" maxlength="1200" placeholder="Optional: tell Nyxthea what changed"><div class="guide-actions"><button id="checkGuide" class="primary">Check this step</button><button id="endGuide" class="secondary">End access</button></div><label class="choice"><input id="autoGuide" type="checkbox"> Check automatically every 7 seconds</label><div id="guideResult" class="guide-result"><div class="item"><span class="small">Aim the camera or shared screen at the problem, then choose Check this step.</span></div></div>');
    $("#guideVideo").srcObject = guideStream;
    $("#checkGuide").onclick = analyzeGuide;
    $("#endGuide").onclick = function () {
      return endLiveGuide(true);
    };
    $("#autoGuide").onchange = function (e) {
      clearInterval(guideTimer);
      guideTimer = e.target.checked ? setInterval(analyzeGuide, 7e3) : null;
    };
  }
  function guideFrame() {
    var video = $("#guideVideo");
    if (!video || !video.videoWidth) return "";
    var scale = Math.min(1, 768 / video.videoWidth),
      canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
    canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.72);
  }
  function analyzeGuide() {
    return _analyzeGuide.apply(this, arguments);
  }
  function _analyzeGuide() {
    _analyzeGuide = _asyncToGenerator(_regenerator().m(function _callee107() {
      var _a, out, button, note, d, g, _t85;
      return _regenerator().w(function (_context107) {
        while (1) switch (_context107.p = _context107.n) {
          case 0:
            if (!(guideBusy || !guideSession)) {
              _context107.n = 1;
              break;
            }
            return _context107.a(2);
          case 1:
            guideBusy = true;
            out = $("#guideResult"), button = $("#checkGuide"), note = ((_a = $("#guideUserNote")) == null ? void 0 : _a.value.trim()) || "";
            if (button) button.textContent = "Checking\u2026";
            _context107.p = 2;
            _context107.n = 3;
            return api("/api/live-guide/".concat(guideSession.id, "/analyze"), {
              method: "POST",
              timeoutMs: 1e4,
              body: JSON.stringify({
                image: guideFrame(),
                transcript: guideTranscript,
                note
              })
            });
          case 3:
            d = _context107.v;
            guideTranscript = "";
            guideSession = d.session;
            g = d.guidance;
            out.innerHTML = '<div class="item '.concat(g.risk === "stop" ? "risk-stop" : "", '"><strong>What I can see</strong><p>').concat(esc(g.observation), "</p><strong>Next step</strong><p>").concat(esc(g.nextStep), "</p><strong>How to verify</strong><p>").concat(esc(g.verification), '</p><span class="small">').concat(esc(g.caution), " \xB7 Confidence: ").concat(esc(g.confidence), "</span></div>");
            speak(g.nextStep);
            if (g.risk === "stop") {
              clearInterval(guideTimer);
              guideTimer = null;
              guideStream == null ? void 0 : guideStream.getTracks().forEach(function (t) {
                return t.stop();
              });
              guideStream = null;
            }
            _context107.n = 5;
            break;
          case 4:
            _context107.p = 4;
            _t85 = _context107.v;
            out.innerHTML = '<div class="item risk-stop"><strong>Live Guide paused</strong><p>'.concat(esc(_t85.message), "</p></div>");
          case 5:
            _context107.p = 5;
            guideBusy = false;
            if (button) button.textContent = "Check this step";
            return _context107.f(5);
          case 6:
            return _context107.a(2);
        }
      }, _callee107, null, [[2, 4, 5, 6]]);
    }));
    return _analyzeGuide.apply(this, arguments);
  }
  function endLiveGuide() {
    return _endLiveGuide.apply(this, arguments);
  }
  function _endLiveGuide() {
    _endLiveGuide = _asyncToGenerator(_regenerator().m(function _callee108() {
      var show,
        active,
        resumeWake,
        _args108 = arguments;
      return _regenerator().w(function (_context108) {
        while (1) switch (_context108.n) {
          case 0:
            show = _args108.length > 0 && _args108[0] !== undefined ? _args108[0] : true;
            guideToken++;
            guidePending.forEach(function (t) {
              return t.stop();
            });
            guidePending = [];
            clearInterval(guideTimer);
            guideTimer = null;
            try {
              guideRecognition == null ? void 0 : guideRecognition.abort();
            } catch (e) {}
            guideRecognition = null;
            active = guideSession;
            guideSession = null;
            guideStream == null ? void 0 : guideStream.getTracks().forEach(function (t) {
              return t.stop();
            });
            guideStream = null;
            if (active) api("/api/live-guide/".concat(active.id), {
              method: "DELETE"
            }).catch(function () {});
            resumeWake = guideResumeHandsFree;
            guideResumeHandsFree = false;
            state("ready");
            if (resumeWake) setTimeout(function () {
              return NYXHandsFree.resume();
            }, 250);
            if (show) panel("Live Guide ended", "<p>Camera, screen, and microphone access has stopped. Nyxthea did not save the raw media.</p>");
          case 1:
            return _context108.a(2);
        }
      }, _callee108);
    }));
    return _endLiveGuide.apply(this, arguments);
  }
  $("#liveGuide").onclick = $("#liveGuideQuick").onclick = guideSetup;
  function privacy() {
    panel("Privacy by design", "<p>Memory is opt-in and profile-separated. Nyxthea asks permission before protected actions, uses approved official connections, and never claims an action happened when it did not.</p><div class='item'><strong>Human control stays permanent.</strong><br><span class='small'>Privacy, authorization, safety, honesty, and consent cannot be bypassed by learning or automation.</span></div>");
  }
  $("#privacy").onclick = $("#privacyTop").onclick = privacy;
  $("#caps").onclick = _asyncToGenerator(_regenerator().m(function _callee8() {
    var d, _t8;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          _context8.n = 1;
          return api("/api/capabilities");
        case 1:
          d = _context8.v;
          panel("What Nyxthea can do", d.capabilities.map(function (c) {
            return '<div class="item"><strong>'.concat(esc(c.name), '</strong><br><span class="small">').concat(esc(c.description), "</span></div>");
          }).join(""));
          _context8.n = 3;
          break;
        case 2:
          _context8.p = 2;
          _t8 = _context8.v;
          panel("Capabilities", "<p>".concat(esc(_t8.message), "</p>"));
        case 3:
          return _context8.a(2);
      }
    }, _callee8, null, [[0, 2]]);
  }));
  var desc = {
    Home: "The living command center for your Nyxthea intelligence.",
    "Your World": "People, places, routines, goals, and household context will live here under your control.",
    Devices: "Authorized phones, speakers, screens, appliances, and sensors appear only after an official adapter is connected.",
    Health: "Consent-controlled wellness information and recovery support. No health source is connected yet.",
    Security: "Presence and multi-signal safety proposals without silent surveillance or unverified emergency action.",
    Memories: "Layered, explicit memory that you can inspect and remove.",
    Music: "Provider-neutral music intelligence. A music provider has not been connected yet.",
    Vehicle: "Maintenance, diagnostics, travel context, and future authorized telemetry.",
    Settings: "Identity, privacy, permissions, integrations, voice, and interface preferences."
  };
  function view(v) {
    if (v === "Home") {
      scrollTo({
        top: 0,
        behavior: "smooth"
      });
      return;
    }
    if (v === "Memories") {
      memories();
      return;
    }
    if (v === "Settings") {
      if (credential) openSettingsVerified();else unlock();
      return;
    }
    $$(".nav-button").forEach(function (b) {
      return b.classList.toggle("active", b.dataset.view === v);
    });
    panel(v, '<div class="mini-head"><span class="compact-rose"></span><div><strong>'.concat(esc(v), "</strong><span>Connected to the same Nyxthea Core</span></div></div><p>").concat(esc(desc[v] || "This area belongs to your command center."), '</p><div class="item"><span class="small">Future controls appear only after you authorize a working official integration.</span></div>'));
  }
  $$("[data-view]").forEach(function (b) {
    return b.onclick = function () {
      return view(b.dataset.view);
    };
  });
  session();
  var NYXSound = {
    ctx: null,
    master: null,
    ready: false,
    lastCue: null,
    lastAt: 0,
    forceSession: false,
    enabled(kind) {
      var _a, _b;
      var mode = ((_a = NYXExperience == null ? void 0 : NYXExperience.settings) == null ? void 0 : _a.soundMode) || "minimal";
      if (this.forceSession && ["startup", "listening", "success", "warning", "lock", "unlock"].includes(kind)) return true;
      if (mode === "off") return false;
      if (((_b = NYXExperience == null ? void 0 : NYXExperience.settings) == null ? void 0 : _b.decorativeSounds) === false) return false;
      if (mode === "minimal" && ["thinking", "speaking"].includes(kind)) return false;
      return true;
    },
    prime() {
      var _this = this;
      return _asyncToGenerator(_regenerator().m(function _callee9() {
        var Ctx, _t9;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.p = _context9.n) {
            case 0:
              _context9.p = 0;
              Ctx = window.AudioContext || window.webkitAudioContext;
              if (Ctx) {
                _context9.n = 1;
                break;
              }
              return _context9.a(2, false);
            case 1:
              _this.ctx = _this.ctx || new Ctx();
              _context9.n = 2;
              return _this.ctx.resume();
            case 2:
              if (!_this.master) {
                _this.master = _this.ctx.createGain();
                _this.master.gain.value = 0.42;
                _this.master.connect(_this.ctx.destination);
              } else _this.master.gain.setValueAtTime(0.42, _this.ctx.currentTime);
              _this.ready = _this.ctx.state === "running";
              return _context9.a(2, _this.ready);
            case 3:
              _context9.p = 3;
              _t9 = _context9.v;
              return _context9.a(2, false);
          }
        }, _callee9, null, [[0, 3]]);
      }))();
    },
    tone(freq, start, duration) {
      var gain = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.12;
      var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "sine";
      var endFreq = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
      if (!this.ctx || !this.master) return;
      var o = this.ctx.createOscillator(),
        g = this.ctx.createGain();
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
      var now = this.ctx.currentTime;
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
  var NYXVoice = {
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
      var vs = this.synth.getVoices();
      this.preferred = vs.find(function (v) {
        return /^en[-_]GB/i.test(v.lang) && /kate|martha|serena|female/i.test(v.name);
      }) || vs.find(function (v) {
        return /samantha|ava|allison|serena|victoria/i.test(v.name);
      }) || vs.find(function (v) {
        return /^en[-_]GB/i.test(v.lang) && !/daniel|male/i.test(v.name);
      }) || null;
      return this.preferred;
    },
    stopSpeech() {
      var _a, _b;
      this.speechToken++;
      try {
        (_a = this.synth) == null ? void 0 : _a.cancel();
      } catch (e) {}
      try {
        (_b = this.audioEl) == null ? void 0 : _b.pause();
      } catch (e) {}
      if (this.audioUrl) {
        try {
          URL.revokeObjectURL(this.audioUrl);
        } catch (e) {}
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
      var b = document.getElementById("nyxMic");
      b.classList.toggle("listening", s === "listening");
      b.setAttribute("aria-label", s === "listening" ? "Stop recording and send" : "Tap to start voice input");
    },
    cancelInput() {
      var _a, _b;
      this.token++;
      clearTimeout(this.timer);
      this.timer = null;
      var r = this.recorder;
      this.recorder = null;
      if (r) {
        r.onstop = null;
        r.ondataavailable = null;
        try {
          if (r.state !== "inactive") r.stop();
        } catch (e) {}
      }
      try {
        (_a = this.recognition) == null ? void 0 : _a.abort();
      } catch (e) {}
      this.recognition = null;
      (_b = this.stream) == null ? void 0 : _b.getTracks().forEach(function (t) {
        return t.stop();
      });
      this.stream = null;
      this.listening = false;
      this.transcribing = false;
      this.show("ready");
      NYXHandsFree.resume();
    },
    prime() {
      var _this2 = this;
      return _asyncToGenerator(_regenerator().m(function _callee0() {
        var Ctx, _t0, _t1;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.p = _context0.n) {
            case 0:
              _context0.p = 0;
              if (!_this2.audioEl) {
                _this2.audioEl = new Audio();
                _this2.audioEl.setAttribute("playsinline", "");
                _this2.audioEl.playsInline = true;
              }
              _this2.audioEl.muted = true;
              _this2.audioEl.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=";
              _context0.n = 1;
              return _this2.audioEl.play().catch(function () {});
            case 1:
              _this2.audioEl.pause();
              _this2.audioEl.currentTime = 0;
              _this2.audioEl.muted = false;
              _context0.n = 3;
              break;
            case 2:
              _context0.p = 2;
              _t0 = _context0.v;
            case 3:
              _context0.p = 3;
              Ctx = window.AudioContext || window.webkitAudioContext;
              if (!Ctx) {
                _context0.n = 4;
                break;
              }
              _this2.ctx = _this2.ctx || new Ctx();
              _context0.n = 4;
              return _this2.ctx.resume();
            case 4:
              _context0.n = 6;
              break;
            case 5:
              _context0.p = 5;
              _t1 = _context0.v;
            case 6:
              return _context0.a(2);
          }
        }, _callee0, null, [[3, 5], [0, 2]]);
      }))();
    },
    fallback(text, token) {
      var _this3 = this;
      if (!this.synth || !text) return Promise.resolve(false);
      return new Promise(function (resolve) {
        var _a;
        var u = new SpeechSynthesisUtterance(String(text));
        u.voice = _this3.choose();
        u.lang = ((_a = u.voice) == null ? void 0 : _a.lang) || "en-US";
        u.rate = 0.98;
        u.pitch = 0.94;
        u.volume = 1;
        var settled = false;
        var watchdog = setTimeout(function () {
          return done(false);
        }, Math.max(9e3, Math.min(3e4, String(text).length * 75)));
        u.onstart = function () {
          if (token !== _this3.speechToken) return;
          _this3.speaking = true;
          document.body.dataset.nyxState = "speaking";
        };
        var done = function done() {
          var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
          if (settled) return;
          settled = true;
          clearTimeout(watchdog);
          if (token !== _this3.speechToken) {
            resolve(false);
            return;
          }
          _this3.speaking = false;
          document.body.dataset.nyxState = "idle";
          setTimeout(function () {
            return NYXHandsFree.resume();
          }, 320);
          resolve(value);
        };
        u.onend = function () {
          return done(true);
        };
        u.onerror = function () {
          return done(false);
        };
        try {
          _this3.synth.speak(u);
        } catch (e) {
          done(false);
        }
      });
    },
    say(text) {
      var _this4 = this;
      return _asyncToGenerator(_regenerator().m(function _callee10() {
        var _a, _b, token, controller, fetchTimer, r, contentType, blob, url, audio, result, fallback, _t11;
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.p = _context10.n) {
            case 0:
              if (text) {
                _context10.n = 1;
                break;
              }
              return _context10.a(2, false);
            case 1:
              _this4.speechToken++;
              token = _this4.speechToken;
              try {
                (_a = _this4.synth) == null ? void 0 : _a.cancel();
              } catch (e) {}
              try {
                (_b = _this4.audioEl) == null ? void 0 : _b.pause();
              } catch (e) {}
              if (_this4.audioUrl) {
                try {
                  URL.revokeObjectURL(_this4.audioUrl);
                } catch (e) {}
                _this4.audioUrl = null;
              }
              _this4.speaking = true;
              document.body.dataset.nyxState = "speaking";
              _context10.p = 2;
              controller = new AbortController(), fetchTimer = setTimeout(function () {
                return controller.abort();
              }, 6500);
              _context10.p = 3;
              _context10.n = 4;
              return fetch("/api/voice/speak", {
                method: "POST",
                signal: controller.signal,
                credentials: "same-origin",
                headers: __spreadValues({
                  "content-type": "application/json",
                  "x-nyxthea-device": nyxDeviceId()
                }, settingsAuthToken ? {
                  "x-nyxthea-settings-auth": settingsAuthToken
                } : {}),
                body: JSON.stringify({
                  text: String(text),
                  speaker: "luna"
                })
              });
            case 4:
              r = _context10.v;
            case 5:
              _context10.p = 5;
              clearTimeout(fetchTimer);
              return _context10.f(5);
            case 6:
              ;
              if (r.ok) {
                _context10.n = 7;
                break;
              }
              throw Error("Natural voice unavailable");
            case 7:
              contentType = String(r.headers.get("content-type") || "").toLowerCase();
              if (contentType.startsWith("audio/")) {
                _context10.n = 8;
                break;
              }
              throw Error("Natural voice returned an invalid response");
            case 8:
              _context10.n = 9;
              return nyxTimed(r.blob(), 6500, "Voice audio download timed out.");
            case 9:
              blob = _context10.v;
              if (blob.size) {
                _context10.n = 10;
                break;
              }
              throw Error("Natural voice returned empty audio");
            case 10:
              if (!(token !== _this4.speechToken)) {
                _context10.n = 11;
                break;
              }
              return _context10.a(2, false);
            case 11:
              url = URL.createObjectURL(blob), audio = _this4.audioEl || new Audio();
              _this4.audioEl = audio;
              _this4.audioUrl = url;
              audio.src = url;
              audio.preload = "auto";
              audio.muted = false;
              audio.playbackRate = 0.98;
              _context10.n = 12;
              return new Promise(function () {
                var _ref1 = _asyncToGenerator(_regenerator().m(function _callee1(resolve) {
                  var settled, watchdog, finish, _t10;
                  return _regenerator().w(function (_context1) {
                    while (1) switch (_context1.p = _context1.n) {
                      case 0:
                        settled = false, watchdog = setTimeout(function () {
                          return finish(false);
                        }, Math.max(9e3, Math.min(3e4, String(text).length * 70)));
                        finish = function finish(value) {
                          if (settled) return;
                          settled = true;
                          clearTimeout(watchdog);
                          if (_this4.audioUrl) {
                            try {
                              URL.revokeObjectURL(_this4.audioUrl);
                            } catch (e) {}
                            _this4.audioUrl = null;
                          }
                          if (token === _this4.speechToken) {
                            _this4.speaking = false;
                            document.body.dataset.nyxState = "idle";
                            setTimeout(function () {
                              return NYXHandsFree.resume();
                            }, 320);
                          }
                          resolve(value);
                        };
                        audio.onended = function () {
                          return finish(true);
                        };
                        audio.onerror = function () {
                          return finish(false);
                        };
                        _context1.p = 1;
                        _context1.n = 2;
                        return audio.play();
                      case 2:
                        _context1.n = 4;
                        break;
                      case 3:
                        _context1.p = 3;
                        _t10 = _context1.v;
                        finish(false);
                      case 4:
                        return _context1.a(2);
                    }
                  }, _callee1, null, [[1, 3]]);
                }));
                return function (_x0) {
                  return _ref1.apply(this, arguments);
                };
              }());
            case 12:
              result = _context10.v;
              if (!result) {
                _context10.n = 13;
                break;
              }
              return _context10.a(2, true);
            case 13:
              if (!(token !== _this4.speechToken)) {
                _context10.n = 14;
                break;
              }
              return _context10.a(2, false);
            case 14:
              _context10.n = 15;
              return _this4.fallback(text, token);
            case 15:
              return _context10.a(2, _context10.v);
            case 16:
              _context10.p = 16;
              _t11 = _context10.v;
              if (!(token !== _this4.speechToken)) {
                _context10.n = 17;
                break;
              }
              return _context10.a(2, false);
            case 17:
              _this4.speaking = false;
              _context10.n = 18;
              return _this4.fallback(text, token);
            case 18:
              fallback = _context10.v;
              if (!fallback) setTimeout(function () {
                return NYXHandsFree.resume();
              }, 180);
              return _context10.a(2, fallback);
          }
        }, _callee10, null, [[3,, 5, 6], [2, 16]]);
      }))();
    },
    toggle(onText) {
      var _this5 = this;
      return _asyncToGenerator(_regenerator().m(function _callee12() {
        var _a, _b, token, stream, type, recorder, chunks, SR, r, _t13;
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.p = _context12.n) {
            case 0:
              if (!_this5.listening) {
                _context12.n = 1;
                break;
              }
              _this5.finish();
              return _context12.a(2);
            case 1:
              if (!_this5.transcribing) {
                _context12.n = 2;
                break;
              }
              return _context12.a(2);
            case 2:
              _this5.stopSpeech();
              token = ++_this5.token;
              _this5.listening = true;
              _this5.show("listening", "Opening microphone\u2026");
              if (!(((_a = navigator.mediaDevices) == null ? void 0 : _a.getUserMedia) && window.MediaRecorder)) {
                _context12.n = 8;
                break;
              }
              _context12.p = 3;
              _context12.n = 4;
              return nyxMediaRequest(navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
              }), 7e3, "Microphone permission timed out.");
            case 4:
              stream = _context12.v;
              if (!(token !== _this5.token || document.hidden)) {
                _context12.n = 5;
                break;
              }
              stream.getTracks().forEach(function (t) {
                return t.stop();
              });
              return _context12.a(2);
            case 5:
              _this5.stream = stream;
              type = ["audio/mp4", "audio/webm", "audio/ogg"].find(function (t) {
                return MediaRecorder.isTypeSupported(t);
              });
              recorder = type ? new MediaRecorder(stream, {
                mimeType: type
              }) : new MediaRecorder(stream);
              _this5.recorder = recorder;
              chunks = [];
              recorder.ondataavailable = function (e) {
                if (e.data.size) chunks.push(e.data);
              };
              recorder.onstop = _asyncToGenerator(_regenerator().m(function _callee11() {
                var _a2, blob, audio, result, _t12;
                return _regenerator().w(function (_context11) {
                  while (1) switch (_context11.p = _context11.n) {
                    case 0:
                      stream.getTracks().forEach(function (t) {
                        return t.stop();
                      });
                      if (_this5.stream === stream) _this5.stream = null;
                      if (!(token !== _this5.token)) {
                        _context11.n = 1;
                        break;
                      }
                      return _context11.a(2);
                    case 1:
                      _this5.recorder = null;
                      _this5.listening = false;
                      _this5.transcribing = true;
                      _this5.show("thinking", "Transcribing\u2026");
                      _context11.p = 2;
                      blob = new Blob(chunks, {
                        type: recorder.mimeType || "audio/mp4"
                      });
                      if (!(blob.size < 100)) {
                        _context11.n = 3;
                        break;
                      }
                      throw Error("No speech was captured. Please try again.");
                    case 3:
                      if (!(blob.size > 1e6)) {
                        _context11.n = 4;
                        break;
                      }
                      throw Error("Recording was too large. Please try a shorter message.");
                    case 4:
                      _context11.n = 5;
                      return new Promise(function (resolve, reject) {
                        var reader = new FileReader();
                        reader.onload = function () {
                          return resolve(String(reader.result).split(",")[1]);
                        };
                        reader.onerror = function () {
                          return reject(Error("Could not read the recording."));
                        };
                        reader.readAsDataURL(blob);
                      });
                    case 5:
                      audio = _context11.v;
                      if (!(token !== _this5.token || document.hidden)) {
                        _context11.n = 6;
                        break;
                      }
                      return _context11.a(2);
                    case 6:
                      _context11.n = 7;
                      return api("/api/voice/transcribe", {
                        method: "POST",
                        body: JSON.stringify({
                          audio,
                          type: blob.type.split(";")[0]
                        })
                      });
                    case 7:
                      result = _context11.v;
                      if (!(token !== _this5.token || document.hidden)) {
                        _context11.n = 8;
                        break;
                      }
                      return _context11.a(2);
                    case 8:
                      if ((_a2 = result.text) == null ? void 0 : _a2.trim()) {
                        _this5.show("ready");
                        onText(result.text.trim());
                      } else {
                        _this5.show("ready", "No speech heard \u2014 try again");
                        NYXHandsFree.resume();
                      }
                      _context11.n = 10;
                      break;
                    case 9:
                      _context11.p = 9;
                      _t12 = _context11.v;
                      if (token === _this5.token) {
                        _this5.show("ready", _t12.message);
                        NYXHandsFree.resume();
                      }
                    case 10:
                      _context11.p = 10;
                      if (token === _this5.token) _this5.transcribing = false;
                      return _context11.f(10);
                    case 11:
                      return _context11.a(2);
                  }
                }, _callee11, null, [[2, 9, 10, 11]]);
              }));
              recorder.start();
              _this5.show("listening", "Listening \u2014 tap again to send");
              _this5.timer = setTimeout(function () {
                return _this5.finish();
              }, 1e4);
              return _context12.a(2);
            case 6:
              _context12.p = 6;
              _t13 = _context12.v;
              (_b = _this5.stream) == null ? void 0 : _b.getTracks().forEach(function (t) {
                return t.stop();
              });
              _this5.stream = null;
              _this5.recorder = null;
              if (!(token !== _this5.token)) {
                _context12.n = 7;
                break;
              }
              return _context12.a(2);
            case 7:
              _this5.listening = false;
              _this5.show("ready", _t13.name === "NotAllowedError" ? "Microphone access denied \u2014 check browser permissions" : _t13.message || "Microphone could not start");
              NYXHandsFree.resume();
              return _context12.a(2);
            case 8:
              SR = window.SpeechRecognition || window.webkitSpeechRecognition;
              if (SR) {
                _context12.n = 9;
                break;
              }
              _this5.listening = false;
              _this5.show("ready", "Microphone unavailable in this browser");
              NYXHandsFree.resume();
              return _context12.a(2);
            case 9:
              try {
                r = new SR();
                _this5.recognition = r;
                r.lang = "en-US";
                r.continuous = false;
                r.interimResults = false;
                r.onresult = function (e) {
                  var _a2, _b2, _c, _d;
                  var t = (_d = (_c = (_b2 = (_a2 = e.results) == null ? void 0 : _a2[0]) == null ? void 0 : _b2[0]) == null ? void 0 : _c.transcript) == null ? void 0 : _d.trim();
                  if (token !== _this5.token) return;
                  clearTimeout(_this5.timer);
                  _this5.listening = false;
                  _this5.recognition = null;
                  try {
                    r.stop();
                  } catch (e2) {}
                  _this5.show("ready", t ? void 0 : "No speech heard \u2014 try again");
                  if (t) onText(t);else NYXHandsFree.resume();
                };
                r.onerror = function (e) {
                  if (token !== _this5.token) return;
                  _this5.listening = false;
                  _this5.recognition = null;
                  clearTimeout(_this5.timer);
                  _this5.show("ready", "Voice input failed: ".concat(e.error || "unknown error"));
                  NYXHandsFree.resume();
                };
                r.onend = function () {
                  if (token === _this5.token && _this5.listening) {
                    _this5.listening = false;
                    _this5.recognition = null;
                    clearTimeout(_this5.timer);
                    _this5.show("ready", "No speech heard \u2014 try again");
                    NYXHandsFree.resume();
                  }
                };
                r.start();
                _this5.show("listening", "Listening \u2014 tap again to finish");
                _this5.timer = setTimeout(function () {
                  return _this5.finish();
                }, 1e4);
              } catch (e) {
                _this5.listening = false;
                _this5.recognition = null;
                _this5.show("ready", e.message || "Voice input could not start");
                NYXHandsFree.resume();
              }
            case 10:
              return _context12.a(2);
          }
        }, _callee12, null, [[3, 6]]);
      }))();
    },
    finish() {
      var _a;
      clearTimeout(this.timer);
      this.timer = null;
      if (this.recorder) {
        var r = this.recorder;
        try {
          if (r.state !== "inactive") r.stop();
        } catch (e) {
          this.cancelInput();
        }
        (_a = this.stream) == null ? void 0 : _a.getTracks().forEach(function (t) {
          return t.stop();
        });
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
    speechSynthesis.onvoiceschanged = function () {
      return NYXVoice.choose();
    };
    NYXVoice.choose();
  }
  window.NYXVoice = NYXVoice;
  var NYXLocalWake = {
    detector: null,
    module: null,
    loading: null,
    active: false,
    lastError: null,
    loadOrt() {
      return _asyncToGenerator(_regenerator().m(function _callee13() {
        var _a, _b, _c, _d, i;
        return _regenerator().w(function (_context13) {
          while (1) switch (_context13.n) {
            case 0:
              if (!((_a = window.ort) == null ? void 0 : _a.InferenceSession)) {
                _context13.n = 1;
                break;
              }
              try {
                if ((_c = (_b = window.ort) == null ? void 0 : _b.env) == null ? void 0 : _c.wasm) {
                  window.ort.env.wasm.wasmPaths = "/vendor/";
                  window.ort.env.wasm.numThreads = 1;
                }
              } catch (e) {}
              return _context13.a(2, window.ort);
            case 1:
              if (!document.querySelector("script[data-nyx-ort]")) {
                _context13.n = 5;
                break;
              }
              i = 0;
            case 2:
              if (!(i < 20 && !((_d = window.ort) == null ? void 0 : _d.InferenceSession))) {
                _context13.n = 4;
                break;
              }
              _context13.n = 3;
              return nyxDelay(100);
            case 3:
              i++;
              _context13.n = 2;
              break;
            case 4:
              return _context13.a(2, window.ort || null);
            case 5:
              _context13.n = 6;
              return new Promise(function (resolve) {
                var script = document.createElement("script");
                script.src = "/vendor/ort.min.js";
                script.async = true;
                script.dataset.nyxOrt = "true";
                script.onload = function () {
                  var _a2, _b2;
                  try {
                    if ((_b2 = (_a2 = window.ort) == null ? void 0 : _a2.env) == null ? void 0 : _b2.wasm) {
                      window.ort.env.wasm.wasmPaths = "/vendor/";
                      window.ort.env.wasm.numThreads = 1;
                    }
                  } catch (e) {}
                  resolve(window.ort || null);
                };
                script.onerror = function () {
                  return resolve(null);
                };
                document.head.appendChild(script);
              });
            case 6:
              return _context13.a(2, _context13.v);
          }
        }, _callee13);
      }))();
    },
    ensure() {
      var _this6 = this;
      return _asyncToGenerator(_regenerator().m(function _callee16() {
        return _regenerator().w(function (_context16) {
          while (1) switch (_context16.n) {
            case 0:
              if (!_this6.detector) {
                _context16.n = 1;
                break;
              }
              return _context16.a(2, true);
            case 1:
              if (!_this6.loading) {
                _context16.n = 2;
                break;
              }
              return _context16.a(2, _this6.loading);
            case 2:
              _this6.loading = _asyncToGenerator(_regenerator().m(function _callee15() {
                var ort, _t14, _t15;
                return _regenerator().w(function (_context15) {
                  while (1) switch (_context15.p = _context15.n) {
                    case 0:
                      _context15.p = 0;
                      _context15.n = 1;
                      return _this6.loadOrt();
                    case 1:
                      ort = _context15.v;
                      if (ort) {
                        _context15.n = 2;
                        break;
                      }
                      return _context15.a(2, false);
                    case 2:
                      _t14 = _this6.module;
                      if (_t14) {
                        _context15.n = 4;
                        break;
                      }
                      _context15.n = 3;
                      return Promise.resolve().then(function () {
                        return __toESM(require("./nyx-wake-detector.js"));
                      });
                    case 3:
                      _t14 = _context15.v;
                    case 4:
                      _this6.module = _t14;
                      _this6.detector = new _this6.module.NyxOnnxWakeDetector({
                        ort,
                        onWake: function () {
                          var _onWake = _asyncToGenerator(_regenerator().m(function _callee14(detail) {
                            return _regenerator().w(function (_context14) {
                              while (1) switch (_context14.n) {
                                case 0:
                                  if (!(!NYXHandsFree.active || NYXHandsFree.paused || NYXHandsFree.turnBusy)) {
                                    _context14.n = 1;
                                    break;
                                  }
                                  return _context14.a(2);
                                case 1:
                                  _context14.n = 2;
                                  return NYXHandsFree.heard("Nyx", 1);
                                case 2:
                                  return _context14.a(2);
                              }
                            }, _callee14);
                          }));
                          function onWake(_x1) {
                            return _onWake.apply(this, arguments);
                          }
                          return onWake;
                        }(),
                        onError: function onError(error) {
                          _this6.lastError = error;
                        }
                      });
                      _context15.n = 5;
                      return _this6.detector.init();
                    case 5:
                      return _context15.a(2, true);
                    case 6:
                      _context15.p = 6;
                      _t15 = _context15.v;
                      _this6.lastError = _t15;
                      _this6.detector = null;
                      return _context15.a(2, false);
                    case 7:
                      _context15.p = 7;
                      _this6.loading = null;
                      return _context15.f(7);
                    case 8:
                      return _context15.a(2);
                  }
                }, _callee15, null, [[0, 6, 7, 8]]);
              }))();
              return _context16.a(2, _this6.loading);
          }
        }, _callee16);
      }))();
    },
    start(stream) {
      var _this7 = this;
      return _asyncToGenerator(_regenerator().m(function _callee17() {
        var _t16;
        return _regenerator().w(function (_context17) {
          while (1) switch (_context17.p = _context17.n) {
            case 0:
              if (stream) {
                _context17.n = 1;
                break;
              }
              return _context17.a(2, false);
            case 1:
              _context17.n = 2;
              return _this7.ensure();
            case 2:
              if (_context17.v) {
                _context17.n = 3;
                break;
              }
              return _context17.a(2, false);
            case 3:
              _context17.p = 3;
              _context17.n = 4;
              return _this7.detector.start(stream);
            case 4:
              _this7.active = true;
              return _context17.a(2, true);
            case 5:
              _context17.p = 5;
              _t16 = _context17.v;
              _this7.lastError = _t16;
              _this7.active = false;
              return _context17.a(2, false);
          }
        }, _callee17, null, [[3, 5]]);
      }))();
    },
    stop() {
      var _this8 = this;
      return _asyncToGenerator(_regenerator().m(function _callee18() {
        var _a, _t17;
        return _regenerator().w(function (_context18) {
          while (1) switch (_context18.p = _context18.n) {
            case 0:
              _this8.active = false;
              _context18.p = 1;
              _context18.n = 2;
              return (_a = _this8.detector) == null ? void 0 : _a.stop({
                stopTracks: false
              });
            case 2:
              _context18.n = 4;
              break;
            case 3:
              _context18.p = 3;
              _t17 = _context18.v;
            case 4:
              return _context18.a(2);
          }
        }, _callee18, null, [[1, 3]]);
      }))();
    },
    release() {
      var _this9 = this;
      return _asyncToGenerator(_regenerator().m(function _callee19() {
        var _a, _t18;
        return _regenerator().w(function (_context19) {
          while (1) switch (_context19.p = _context19.n) {
            case 0:
              _this9.active = false;
              _context19.p = 1;
              _context19.n = 2;
              return (_a = _this9.detector) == null ? void 0 : _a.release();
            case 2:
              _context19.n = 4;
              break;
            case 3:
              _context19.p = 3;
              _t18 = _context19.v;
            case 4:
              _this9.detector = null;
            case 5:
              return _context19.a(2);
          }
        }, _callee19, null, [[1, 3]]);
      }))();
    }
  };
  window.NYXLocalWake = NYXLocalWake;
  var NYXHandsFree = {
    active: false,
    paused: false,
    stream: null,
    recorder: null,
    timer: null,
    wakeInFlight: 0,
    wakeAborts: new Set(),
    turnBusy: false,
    engagedUntil: 0,
    failures: 0,
    generation: 0,
    recognition: null,
    persistentStream: false,
    speakerProfileId: null,
    speakerName: null,
    label(message) {
      var b = document.getElementById("wakeToggle");
      b.textContent = this.active ? "Stop voice activation" : "Enable voice activation";
      b.setAttribute("aria-pressed", String(this.active));
      var speaker = this.speakerName ? " \xB7 " + this.speakerName : "";
      if (message) state(this.active ? "listening" : "ready", message + speaker);
    },
    activateWakeMode() {
      var _this0 = this;
      return _asyncToGenerator(_regenerator().m(function _callee20() {
        var engaged, _t19;
        return _regenerator().w(function (_context20) {
          while (1) switch (_context20.n) {
            case 0:
              if (!(!_this0.active || _this0.paused || document.hidden || !_this0.stream)) {
                _context20.n = 1;
                break;
              }
              return _context20.a(2);
            case 1:
              engaged = Date.now() < _this0.engagedUntil;
              _t19 = !engaged;
              if (!_t19) {
                _context20.n = 3;
                break;
              }
              _context20.n = 2;
              return NYXLocalWake.start(_this0.stream);
            case 2:
              _t19 = _context20.v;
            case 3:
              if (!_t19) {
                _context20.n = 4;
                break;
              }
              _this0.label("Listening for Nyx");
              return _context20.a(2);
            case 4:
              _context20.n = 5;
              return NYXLocalWake.stop();
            case 5:
              _this0.recordChunk();
            case 6:
              return _context20.a(2);
          }
        }, _callee20);
      }))();
    },
    start() {
      var _this1 = this;
      return _asyncToGenerator(_regenerator().m(function _callee21() {
        var _a;
        return _regenerator().w(function (_context21) {
          while (1) switch (_context21.n) {
            case 0:
              if (!_this1.active) {
                _context21.n = 1;
                break;
              }
              return _context21.a(2);
            case 1:
              if (credential) {
                _context21.n = 2;
                break;
              }
              unlock();
              return _context21.a(2);
            case 2:
              if (!(((_a = NYXExperience.settings) == null ? void 0 : _a.voiceEnabled) === false)) {
                _context21.n = 3;
                break;
              }
              state("ready", "Voice is disabled in your profile");
              return _context21.a(2);
            case 3:
              _this1.active = true;
              _this1.paused = false;
              _this1.failures = 0;
              _this1.engagedUntil = 0;
              _this1.generation++;
              _this1.label("Listening for Nyx");
              _context21.n = 4;
              return _this1.open();
            case 4:
              return _context21.a(2);
          }
        }, _callee21);
      }))();
    },
    startWithStream(stream) {
      var _this10 = this;
      return _asyncToGenerator(_regenerator().m(function _callee22() {
        return _regenerator().w(function (_context22) {
          while (1) switch (_context22.n) {
            case 0:
              if (stream) {
                _context22.n = 1;
                break;
              }
              return _context22.a(2, _this10.start());
            case 1:
              if (credential) {
                _context22.n = 2;
                break;
              }
              try {
                stream.getTracks().forEach(function (t) {
                  return t.stop();
                });
              } catch (e) {}
              ;
              unlock();
              return _context22.a(2);
            case 2:
              _this10.active = true;
              _this10.paused = false;
              _this10.failures = 0;
              _this10.engagedUntil = 0;
              _this10.generation++;
              _this10.stream = stream;
              _this10.persistentStream = true;
              _this10.label("Listening for Nyx");
              _context22.n = 3;
              return _this10.activateWakeMode();
            case 3:
              return _context22.a(2);
          }
        }, _callee22);
      }))();
    },
    stop() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Voice activation off";
      var _a, _b;
      NYXSound.forceSession = false;
      void NYXLocalWake.stop();
      this.persistentStream = false;
      var _iterator5 = _createForOfIteratorHelper(this.wakeAborts),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var c = _step5.value;
          try {
            c.abort();
          } catch (e) {}
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      this.wakeAborts.clear();
      this.wakeInFlight = 0;
      var wasActive = this.active;
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
      } catch (e) {}
      this.recorder = null;
      try {
        (_a = this.recognition) == null ? void 0 : _a.abort();
      } catch (e) {}
      this.recognition = null;
      try {
        (_b = this.stream) == null ? void 0 : _b.getTracks().forEach(function (t) {
          return t.stop();
        });
      } catch (e) {}
      this.stream = null;
      if (wasActive) this.label(message);
    },
    enable() {
      var _this11 = this;
      return _asyncToGenerator(_regenerator().m(function _callee23() {
        return _regenerator().w(function (_context23) {
          while (1) switch (_context23.n) {
            case 0:
              _context23.n = 1;
              return _this11.start();
            case 1:
              if (!_this11.active) {
                _context23.n = 2;
                break;
              }
              _context23.n = 2;
              return NYXExperience.save({
                handsFreeEnabled: true,
                voiceAssistantMode: true
              }).catch(function () {});
            case 2:
              return _context23.a(2);
          }
        }, _callee23);
      }))();
    },
    disable() {
      this.stop();
      NYXExperience.save({
        handsFreeEnabled: false,
        voiceAssistantMode: false
      }).catch(function () {});
    },
    pause() {
      var _a, _b;
      if (!this.active) return;
      this.paused = true;
      void NYXLocalWake.stop();
      clearTimeout(this.timer);
      this.timer = null;
      var _iterator6 = _createForOfIteratorHelper(this.wakeAborts),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var c = _step6.value;
          try {
            c.abort();
          } catch (e) {}
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
      this.wakeAborts.clear();
      this.wakeInFlight = 0;
      try {
        if (this.recorder && this.recorder.state !== "inactive") this.recorder.stop();
      } catch (e) {}
      this.recorder = null;
      try {
        (_a = this.recognition) == null ? void 0 : _a.abort();
      } catch (e) {}
      this.recognition = null;
      if (!this.persistentStream) {
        try {
          (_b = this.stream) == null ? void 0 : _b.getTracks().forEach(function (t) {
            return t.stop();
          });
        } catch (e) {}
        this.stream = null;
      }
      state("thinking", "Thinking");
    },
    resume() {
      var _this12 = this;
      if (!this.active || !this.paused || document.hidden || guideSession) return;
      if (this.engagedUntil > Date.now()) this.engagedUntil = Date.now() + 45e3;
      this.paused = false;
      this.label("Listening for Nyx");
      setTimeout(function () {
        if (_this12.persistentStream && _this12.stream) void _this12.activateWakeMode();else _this12.open();
      }, 260);
    },
    open() {
      var _this13 = this;
      return _asyncToGenerator(_regenerator().m(function _callee24() {
        var _a, stream, SR, _t20;
        return _regenerator().w(function (_context24) {
          while (1) switch (_context24.p = _context24.n) {
            case 0:
              if (!(!_this13.active || _this13.paused || document.hidden || _this13.stream || _this13.recorder || _this13.recognition)) {
                _context24.n = 1;
                break;
              }
              return _context24.a(2);
            case 1:
              if (!(((_a = navigator.mediaDevices) == null ? void 0 : _a.getUserMedia) && window.MediaRecorder)) {
                _context24.n = 7;
                break;
              }
              _context24.p = 2;
              _context24.n = 3;
              return nyxMediaRequest(navigator.mediaDevices.getUserMedia({
                audio: {
                  echoCancellation: true,
                  noiseSuppression: true,
                  autoGainControl: true
                },
                video: false
              }), 7e3, "Microphone permission timed out.");
            case 3:
              stream = _context24.v;
              if (!(!_this13.active || _this13.paused || document.hidden)) {
                _context24.n = 4;
                break;
              }
              stream.getTracks().forEach(function (t) {
                return t.stop();
              });
              return _context24.a(2);
            case 4:
              _this13.stream = stream;
              _this13.persistentStream = true;
              _this13.failures = 0;
              _context24.n = 5;
              return _this13.activateWakeMode();
            case 5:
              return _context24.a(2);
            case 6:
              _context24.p = 6;
              _t20 = _context24.v;
              _this13.stream = null;
              _this13.persistentStream = false;
              if (!((_t20 == null ? void 0 : _t20.name) === "NotAllowedError")) {
                _context24.n = 7;
                break;
              }
              _this13.label("Microphone permission is needed for Nyx");
              return _context24.a(2);
            case 7:
              SR = window.SpeechRecognition || window.webkitSpeechRecognition;
              if (!SR) {
                _context24.n = 8;
                break;
              }
              _this13.openSpeechFallback();
              return _context24.a(2);
            case 8:
              _this13.label("Wake listening is unavailable in this browser");
            case 9:
              return _context24.a(2);
          }
        }, _callee24, null, [[2, 6]]);
      }))();
    },
    recordChunk() {
      var _this14 = this;
      var _a;
      if (!this.active || this.paused || !this.stream || this.recorder || document.hidden) return;
      if (NYXLocalWake.active) void NYXLocalWake.stop();
      try {
        var type = ["audio/mp4", "audio/webm", "audio/ogg"].find(function (t) {
          return MediaRecorder.isTypeSupported(t);
        });
        var recorder = type ? new MediaRecorder(this.stream, {
          mimeType: type
        }) : new MediaRecorder(this.stream);
        this.recorder = recorder;
        var chunks = [],
          token = this.generation;
        recorder.ondataavailable = function (e) {
          if (e.data.size) chunks.push(e.data);
        };
        recorder.onstop = function () {
          if (_this14.recorder === recorder) _this14.recorder = null;
          clearTimeout(_this14.timer);
          _this14.timer = null;
          if (!_this14.active || _this14.paused || token !== _this14.generation) return;
          var blob = new Blob(chunks, {
            type: recorder.mimeType || "audio/mp4"
          });
          if (_this14.active && !_this14.paused && token === _this14.generation) {
            if (Date.now() >= _this14.engagedUntil) setTimeout(function () {
              return void _this14.activateWakeMode();
            }, 40);else setTimeout(function () {
              return _this14.recordChunk();
            }, 40);
          }
          if (blob.size > 180 && _this14.wakeInFlight < 2) void _this14.processChunk(blob, token);
        };
        recorder.start();
        var engaged = Date.now() < this.engagedUntil;
        this.timer = setTimeout(function () {
          try {
            if (recorder.state !== "inactive") recorder.stop();
          } catch (e) {}
        }, engaged ? 2100 : 1600);
      } catch (e) {
        this.recorder = null;
        if (this.persistentStream) {
          try {
            (_a = this.stream) == null ? void 0 : _a.getTracks().forEach(function (t) {
              return t.stop();
            });
          } catch (e2) {}
          this.stream = null;
          this.persistentStream = false;
        }
        this.openSpeechFallback();
      }
    },
    processChunk(blob, token) {
      var _this15 = this;
      return _asyncToGenerator(_regenerator().m(function _callee25() {
        var controller, audio, result, spoken, _t21;
        return _regenerator().w(function (_context25) {
          while (1) switch (_context25.p = _context25.n) {
            case 0:
              if (!(_this15.wakeInFlight >= 2 || !_this15.active || _this15.paused || token !== _this15.generation)) {
                _context25.n = 1;
                break;
              }
              return _context25.a(2);
            case 1:
              _this15.wakeInFlight++;
              controller = new AbortController();
              _this15.wakeAborts.add(controller);
              _context25.p = 2;
              _context25.n = 3;
              return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.onload = function () {
                  return resolve(String(reader.result).split(",")[1]);
                };
                reader.onerror = function () {
                  return reject(Error("Could not read wake audio."));
                };
                reader.readAsDataURL(blob);
              });
            case 3:
              audio = _context25.v;
              if (!(!_this15.active || _this15.paused || token !== _this15.generation || controller.signal.aborted)) {
                _context25.n = 4;
                break;
              }
              return _context25.a(2);
            case 4:
              _context25.n = 5;
              return api("/api/voice/transcribe", {
                method: "POST",
                timeoutMs: 6e3,
                signal: controller.signal,
                body: JSON.stringify({
                  audio,
                  type: blob.type.split(";")[0] || "audio/mp4"
                })
              });
            case 5:
              result = _context25.v;
              spoken = String(result.text || "").trim();
              if (!(spoken && _this15.active && !_this15.paused && token === _this15.generation && !controller.signal.aborted)) {
                _context25.n = 6;
                break;
              }
              _context25.n = 6;
              return _this15.heard(spoken, 0.7);
            case 6:
              _context25.n = 8;
              break;
            case 7:
              _context25.p = 7;
              _t21 = _context25.v;
              if ((_t21 == null ? void 0 : _t21.name) !== "AbortError") {
                _this15.failures++;
                if (_this15.failures >= 3 && _this15.active) {
                  _this15.label("Listening for Nyx");
                  _this15.failures = 0;
                }
              }
            case 8:
              _context25.p = 8;
              _this15.wakeAborts.delete(controller);
              _this15.wakeInFlight = Math.max(0, _this15.wakeInFlight - 1);
              return _context25.f(8);
            case 9:
              return _context25.a(2);
          }
        }, _callee25, null, [[2, 7, 8, 9]]);
      }))();
    },
    openSpeechFallback() {
      var _this16 = this;
      if (!this.active || this.paused || this.recognition || document.hidden) return;
      var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        this.label("Wake listening is unavailable in this browser");
        return;
      }
      var token = this.generation,
        r = new SR();
      this.recognition = r;
      r.lang = "en-US";
      r.continuous = false;
      r.interimResults = false;
      r.maxAlternatives = 3;
      var heardSomething = false;
      r.onstart = function () {
        _this16.failures = 0;
        _this16.label("Listening for Nyx");
      };
      r.onresult = function (e) {
        var _a, _b;
        if (!_this16.active || _this16.paused || token !== _this16.generation) return;
        var result = (_a = e.results) == null ? void 0 : _a[0],
          heard = result == null ? void 0 : result[0],
          spoken = (_b = heard == null ? void 0 : heard.transcript) == null ? void 0 : _b.trim();
        if (spoken) {
          heardSomething = true;
          void _this16.heard(spoken, heard.confidence);
        }
      };
      r.onerror = function (e) {
        if (!_this16.active || token !== _this16.generation || ["aborted", "no-speech"].includes(e.error)) return;
        _this16.failures++;
        if (_this16.failures >= 3) {
          _this16.label("Wake listener is retrying");
          _this16.failures = 0;
        }
      };
      r.onend = function () {
        if (_this16.recognition === r) _this16.recognition = null;
        if (!_this16.active || _this16.paused || token !== _this16.generation || document.hidden) return;
        setTimeout(function () {
          return _this16.openSpeechFallback();
        }, heardSomething ? 180 : 260);
      };
      try {
        r.start();
      } catch (e) {
        this.recognition = null;
        if (this.active && !this.paused) setTimeout(function () {
          return _this16.openSpeechFallback();
        }, 350);
      }
    },
    heard(spoken, confidence) {
      var _this17 = this;
      return _asyncToGenerator(_regenerator().m(function _callee26() {
        var aliases, raw, lower, engaged, conf, wakeIndex, wakeAlias, _iterator7, _step7, alias, idx, message, after;
        return _regenerator().w(function (_context26) {
          while (1) switch (_context26.p = _context26.n) {
            case 0:
              if (!(!_this17.active || _this17.paused || _this17.turnBusy)) {
                _context26.n = 1;
                break;
              }
              return _context26.a(2);
            case 1:
              _this17.turnBusy = true;
              _context26.p = 2;
              if (!/\b(?:goodnight|stop listening|go to sleep)\b/i.test(spoken)) {
                _context26.n = 3;
                break;
              }
              _this17.disable();
              return _context26.a(2);
            case 3:
              aliases = ["nyx"];
              raw = String(spoken || "").trim(), lower = raw.toLowerCase(), engaged = Date.now() < _this17.engagedUntil, conf = Number(confidence);
              if (!(engaged && Number.isFinite(conf) && conf > 0 && conf < 0.38)) {
                _context26.n = 5;
                break;
              }
              _this17.pause();
              _context26.n = 4;
              return NYXVoice.say("I didn\u2019t catch that. Could you say it again?");
            case 4:
              _this17.resume();
              return _context26.a(2);
            case 5:
              wakeIndex = -1, wakeAlias = "";
              if (engaged) {
                _context26.n = 6;
                break;
              }
              _iterator7 = _createForOfIteratorHelper(aliases);
              try {
                for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                  alias = _step7.value;
                  idx = lower.indexOf(alias);
                  if (idx >= 0 && (wakeIndex < 0 || idx < wakeIndex)) {
                    wakeIndex = idx;
                    wakeAlias = alias;
                  }
                }
              } catch (err) {
                _iterator7.e(err);
              } finally {
                _iterator7.f();
              }
              if (!(wakeIndex < 0)) {
                _context26.n = 6;
                break;
              }
              return _context26.a(2);
            case 6:
              _this17.pause();
              message = raw;
              if (engaged) {
                _context26.n = 8;
                break;
              }
              after = raw.slice(wakeIndex + wakeAlias.length).replace(/^[\s,.:;!?-]+/, "").trim();
              message = after.replace(/^(?:hey|hi|hello)\b[\s,.:;!?-]*/i, "").trim();
              if (message) {
                _context26.n = 8;
                break;
              }
              _this17.engagedUntil = Date.now() + 45e3;
              _context26.n = 7;
              return NYXVoice.say("Yeah?");
            case 7:
              _this17.resume();
              return _context26.a(2);
            case 8:
              if (!(!message || message.length < 2)) {
                _context26.n = 10;
                break;
              }
              _context26.n = 9;
              return NYXVoice.say("I didn\u2019t catch that. Could you say it again?");
            case 9:
              _this17.resume();
              return _context26.a(2);
            case 10:
              _this17.engagedUntil = Date.now() + 45e3;
              _context26.n = 11;
              return send(message, {
                voiceTurn: true
              });
            case 11:
              _context26.p = 11;
              _this17.turnBusy = false;
              return _context26.f(11);
            case 12:
              return _context26.a(2);
          }
        }, _callee26, null, [[2,, 11, 12]]);
      }))();
    }
  };
  document.getElementById("wakeToggle").onclick = function () {
    return NYXHandsFree.active ? NYXHandsFree.disable() : NYXHandsFree.enable();
  };
  var nyxDelay = function nyxDelay(ms) {
    return new Promise(function (resolve) {
      return setTimeout(resolve, ms);
    });
  };
  function nyxTimed(_x10, _x11, _x12) {
    return _nyxTimed.apply(this, arguments);
  }
  function _nyxTimed() {
    _nyxTimed = _asyncToGenerator(_regenerator().m(function _callee109(promise, ms, label) {
      var timer;
      return _regenerator().w(function (_context109) {
        while (1) switch (_context109.p = _context109.n) {
          case 0:
            _context109.p = 0;
            _context109.n = 1;
            return Promise.race([Promise.resolve(promise), new Promise(function (_, reject) {
              timer = setTimeout(function () {
                return reject(new Error(label || "Timed out"));
              }, ms);
            })]);
          case 1:
            return _context109.a(2, _context109.v);
          case 2:
            _context109.p = 2;
            clearTimeout(timer);
            return _context109.f(2);
          case 3:
            return _context109.a(2);
        }
      }, _callee109, null, [[0,, 2, 3]]);
    }));
    return _nyxTimed.apply(this, arguments);
  }
  function nyxPrimeFirstRun() {
    return _nyxPrimeFirstRun.apply(this, arguments);
  }
  function _nyxPrimeFirstRun() {
    _nyxPrimeFirstRun = _asyncToGenerator(_regenerator().m(function _callee110() {
      var _a, microphone, sound, voice, _yield$Promise$all, _yield$Promise$all2, stream;
      return _regenerator().w(function (_context110) {
        while (1) switch (_context110.n) {
          case 0:
            if ((_a = navigator.mediaDevices) == null ? void 0 : _a.getUserMedia) {
              _context110.n = 1;
              break;
            }
            throw new Error("Microphone access is not available in this browser.");
          case 1:
            microphone = nyxMediaRequest(navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
              },
              video: false
            }), 5500, "Microphone permission timed out.");
            sound = nyxTimed(NYXSound.prime(), 1800, "Sound startup timed out").then(function () {
              return NYXSound.cue("startup");
            }).catch(function () {
              return false;
            });
            voice = nyxTimed(NYXVoice.prime(), 1800, "Voice startup timed out").catch(function () {
              return false;
            });
            _context110.n = 2;
            return Promise.all([microphone, sound, voice]);
          case 2:
            _yield$Promise$all = _context110.v;
            _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 1);
            stream = _yield$Promise$all2[0];
            return _context110.a(2, stream);
        }
      }, _callee110);
    }));
    return _nyxPrimeFirstRun.apply(this, arguments);
  }
  var nyxStartupAudioCache = null;
  var NYXWakeTraining = {
    module: null,
    load() {
      var _this18 = this;
      return _asyncToGenerator(_regenerator().m(function _callee27() {
        return _regenerator().w(function (_context27) {
          while (1) switch (_context27.n) {
            case 0:
              if (_this18.module) {
                _context27.n = 2;
                break;
              }
              _context27.n = 1;
              return Promise.resolve().then(function () {
                return __toESM(require("./nyx-wake-training.js"));
              });
            case 1:
              _this18.module = _context27.v;
            case 2:
              return _context27.a(2, _this18.module);
          }
        }, _callee27);
      }))();
    },
    count() {
      var _this19 = this;
      return _asyncToGenerator(_regenerator().m(function _callee28() {
        var _t22;
        return _regenerator().w(function (_context28) {
          while (1) switch (_context28.p = _context28.n) {
            case 0:
              _context28.p = 0;
              _context28.n = 1;
              return _this19.load();
            case 1:
              _context28.n = 2;
              return _context28.v.listWakeTrainingSamples({
                profileId: credential == null ? void 0 : credential.id,
                deviceId: nyxDeviceId()
              });
            case 2:
              return _context28.a(2, _context28.v.length);
            case 3:
              _context28.p = 3;
              _t22 = _context28.v;
              return _context28.a(2, 0);
          }
        }, _callee28, null, [[0, 3]]);
      }))();
    },
    clear() {
      var _this20 = this;
      return _asyncToGenerator(_regenerator().m(function _callee29() {
        return _regenerator().w(function (_context29) {
          while (1) switch (_context29.n) {
            case 0:
              _context29.n = 1;
              return _this20.load();
            case 1:
              return _context29.a(2, _context29.v.clearWakeTrainingSamples({
                profileId: credential == null ? void 0 : credential.id,
                deviceId: nyxDeviceId()
              }));
          }
        }, _callee29);
      }))();
    },
    export() {
      var _this21 = this;
      return _asyncToGenerator(_regenerator().m(function _callee30() {
        return _regenerator().w(function (_context30) {
          while (1) switch (_context30.n) {
            case 0:
              _context30.n = 1;
              return _this21.load();
            case 1:
              return _context30.a(2, _context30.v.exportWakeTrainingBundle({
                profileId: credential == null ? void 0 : credential.id,
                deviceId: nyxDeviceId(),
                download: true
              }));
          }
        }, _callee30);
      }))();
    },
    save(blob) {
      var _arguments = arguments,
        _this22 = this;
      return _asyncToGenerator(_regenerator().m(function _callee31() {
        var meta;
        return _regenerator().w(function (_context31) {
          while (1) switch (_context31.n) {
            case 0:
              meta = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : {};
              _context31.n = 1;
              return _this22.load();
            case 1:
              return _context31.a(2, _context31.v.saveWakeTrainingSample(__spreadValues({
                profileId: credential == null ? void 0 : credential.id,
                deviceId: nyxDeviceId(),
                blob,
                mimeType: blob.type
              }, meta)));
          }
        }, _callee31);
      }))();
    }
  };
  window.NYXWakeTraining = NYXWakeTraining;
  function nyxStartupAudio() {
    if (nyxStartupAudioCache) return nyxStartupAudioCache;
    var rate = 22050,
      segments = [{
        f: 262,
        d: 0.22
      }, {
        f: 392,
        d: 0.24
      }, {
        f: 659,
        d: 0.34
      }],
      gap = 0.045,
      total = segments.reduce(function (n, x) {
        return n + x.d;
      }, 0) + gap * (segments.length - 1),
      samples = Math.ceil(total * rate),
      bytes = new ArrayBuffer(44 + samples * 2),
      view2 = new DataView(bytes);
    var write = function write(o, t) {
      for (var i = 0; i < t.length; i++) view2.setUint8(o + i, t.charCodeAt(i));
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
    var cursor = 0;
    for (var _i2 = 0, _segments = segments; _i2 < _segments.length; _i2++) {
      var seg = _segments[_i2];
      var count = Math.floor(seg.d * rate);
      for (var i = 0; i < count; i++) {
        var env = Math.sin(Math.PI * i / Math.max(1, count - 1));
        var sample = Math.sin(2 * Math.PI * seg.f * i / rate) * env * 0.42;
        view2.setInt16(44 + (cursor + i) * 2, Math.max(-1, Math.min(1, sample)) * 32767, true);
      }
      cursor += count;
      cursor += Math.floor(gap * rate);
    }
    var url = URL.createObjectURL(new Blob([bytes], {
        type: "audio/wav"
      })),
      audio = new Audio(url);
    audio.preload = "auto";
    audio.volume = 1;
    nyxStartupAudioCache = audio;
    return audio;
  }
  var NYXExperience = {
    settings: null,
    onboardingStream: null,
    prompt(text) {
      return _asyncToGenerator(_regenerator().m(function _callee32() {
        var speech, token, _t23;
        return _regenerator().w(function (_context32) {
          while (1) switch (_context32.p = _context32.n) {
            case 0:
              speech = NYXVoice.say(text), token = NYXVoice.speechToken;
              _context32.p = 1;
              _context32.n = 2;
              return nyxTimed(speech, 7e3, "Voice prompt timed out.");
            case 2:
              return _context32.a(2, _context32.v);
            case 3:
              _context32.p = 3;
              _t23 = _context32.v;
              if (token === NYXVoice.speechToken) NYXVoice.stopSpeech();
              return _context32.a(2, false);
          }
        }, _callee32, null, [[1, 3]]);
      }))();
    },
    onboardingStreamReady() {
      var _a, _b;
      return Boolean((_b = (_a = this.onboardingStream) == null ? void 0 : _a.getAudioTracks) == null ? void 0 : _b.call(_a).some(function (track) {
        return track.readyState === "live";
      }));
    },
    stopOnboardingStream() {
      var _a, _b;
      try {
        (_b = (_a = this.onboardingStream) == null ? void 0 : _a.getTracks) == null ? void 0 : _b.call(_a).forEach(function (track) {
          return track.stop();
        });
      } catch (e) {}
      this.onboardingStream = null;
    },
    ensureOnboardingStream() {
      var _this23 = this;
      return _asyncToGenerator(_regenerator().m(function _callee33() {
        var _a;
        return _regenerator().w(function (_context33) {
          while (1) switch (_context33.n) {
            case 0:
              if (!_this23.onboardingStreamReady()) {
                _context33.n = 1;
                break;
              }
              return _context33.a(2, _this23.onboardingStream);
            case 1:
              if ((_a = navigator.mediaDevices) == null ? void 0 : _a.getUserMedia) {
                _context33.n = 2;
                break;
              }
              throw new Error("Microphone access is not available.");
            case 2:
              _this23.stopOnboardingStream();
              _context33.n = 3;
              return nyxMediaRequest(navigator.mediaDevices.getUserMedia({
                audio: {
                  echoCancellation: true,
                  noiseSuppression: true,
                  autoGainControl: true
                },
                video: false
              }), 5500, "Microphone permission timed out.");
            case 3:
              _this23.onboardingStream = _context33.v;
              return _context33.a(2, _this23.onboardingStream);
          }
        }, _callee33);
      }))();
    },
    load() {
      var _this24 = this;
      return _asyncToGenerator(_regenerator().m(function _callee34() {
        var d, _t24;
        return _regenerator().w(function (_context34) {
          while (1) switch (_context34.p = _context34.n) {
            case 0:
              _context34.p = 0;
              _context34.n = 1;
              return api("/api/experience", {
                timeoutMs: 6e3
              });
            case 1:
              d = _context34.v;
              _this24.settings = d.settings;
              applyInterfacePreferences();
              _context34.n = 3;
              break;
            case 2:
              _context34.p = 2;
              _t24 = _context34.v;
              _this24.settings = _this24.settings || {
                voiceEnabled: true,
                voiceAssistantMode: true,
                handsFreeEnabled: false,
                handsFreeConfigured: false,
                wakeEnrollmentComplete: false,
                wakeEnrollmentSamples: 0,
                wakeEnrollmentVersion: 0,
                wakeEnrollmentDeviceId: null,
                wakeEnrollments: {},
                soundMode: "minimal",
                decorativeSounds: true,
                onboarded: true,
                onboardingVersion: 2,
                preferredName: (credential == null ? void 0 : credential.displayName) || null,
                visibleModules: ["world", "devices", "health", "security", "memories", "music", "vehicle"]
              };
              applyInterfacePreferences();
            case 3:
              return _context34.a(2);
          }
        }, _callee34, null, [[0, 2]]);
      }))();
    },
    save(patch) {
      var _this25 = this;
      return _asyncToGenerator(_regenerator().m(function _callee35() {
        var d, card, _t25;
        return _regenerator().w(function (_context35) {
          while (1) switch (_context35.p = _context35.n) {
            case 0:
              _context35.p = 0;
              _context35.n = 1;
              return api("/api/experience", {
                method: "POST",
                body: JSON.stringify(patch)
              });
            case 1:
              d = _context35.v;
              _this25.settings = d.settings;
              _context35.n = 3;
              break;
            case 2:
              _context35.p = 2;
              _t25 = _context35.v;
              card = document.getElementById("nyxOnboardCard");
              if (card) card.insertAdjacentHTML("beforeend", '<p class="small" role="alert">'.concat(esc(_t25.message), ". Please try again.</p>"));
              throw _t25;
            case 3:
              return _context35.a(2);
          }
        }, _callee35, null, [[0, 2]]);
      }))();
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
      var id = nyxDeviceId(),
        record = (_b = (_a = this.settings) == null ? void 0 : _a.wakeEnrollments) == null ? void 0 : _b[id];
      if (record) return record;
      if (((_c = this.settings) == null ? void 0 : _c.wakeEnrollmentDeviceId) === id) return {
        complete: ((_d = this.settings) == null ? void 0 : _d.wakeEnrollmentComplete) === true,
        samples: Number(((_e = this.settings) == null ? void 0 : _e.wakeEnrollmentSamples) || 0),
        version: Number(((_f = this.settings) == null ? void 0 : _f.wakeEnrollmentVersion) || 0),
        updatedAt: ((_g = this.settings) == null ? void 0 : _g.wakeEnrollmentUpdatedAt) || null
      };
      return null;
    },
    wakeEnrollmentReady() {
      var record = this.wakeEnrollmentRecord();
      return (record == null ? void 0 : record.complete) === true && Number((record == null ? void 0 : record.version) || 0) >= 1 && Number((record == null ? void 0 : record.samples) || 0) >= 5;
    },
    saveWakeEnrollment(_ref12) {
      var _this26 = this;
      return _asyncToGenerator(_regenerator().m(function _callee36() {
        var complete, samples, _a, deviceId, wakeEnrollments, updatedAt;
        return _regenerator().w(function (_context36) {
          while (1) switch (_context36.n) {
            case 0:
              complete = _ref12.complete, samples = _ref12.samples;
              deviceId = nyxDeviceId(), wakeEnrollments = __spreadValues({}, ((_a = _this26.settings) == null ? void 0 : _a.wakeEnrollments) || {}), updatedAt = (new Date()).toISOString();
              wakeEnrollments[deviceId] = {
                complete: complete === true,
                samples: Number(samples) || 0,
                version: 1,
                updatedAt
              };
              _context36.n = 1;
              return _this26.save({
                wakeEnrollments,
                wakeEnrollmentComplete: complete === true,
                wakeEnrollmentSamples: Number(samples) || 0,
                wakeEnrollmentVersion: 1,
                wakeEnrollmentDeviceId: deviceId,
                wakeEnrollmentUpdatedAt: updatedAt,
                handsFreeConfigured: true
              });
            case 1:
              return _context36.a(2);
          }
        }, _callee36);
      }))();
    },
    captureWakeSample(promptKind, promptText) {
      var _this27 = this;
      return _asyncToGenerator(_regenerator().m(function _callee37() {
        var _a, host, card, stream, type, recorder, chunks, status, stopped, blob, audio, result, transcript, normalized, accepted;
        return _regenerator().w(function (_context37) {
          while (1) switch (_context37.n) {
            case 0:
              host = document.getElementById("nyxOnboard"), card = document.getElementById("nyxOnboardCard");
              card.innerHTML = "<h2>".concat(esc(promptText), '</h2><div style="display:grid;place-items:center;padding:24px 0"><div class="nyx-voice-orb" style="width:92px;height:92px;border-radius:50%;border:1px solid #83d0ff88;box-shadow:0 0 34px #287cff66,inset 0 0 24px #1b59b855;display:grid;place-items:center;font-size:1.8rem">\u25C9</div></div><p id="nyxWakeCaptureStatus" class="small" style="text-align:center">Get ready\u2026</p>');
              _context37.n = 1;
              return NYXVoice.say(promptText);
            case 1:
              if (!(!((_a = navigator.mediaDevices) == null ? void 0 : _a.getUserMedia) || !window.MediaRecorder)) {
                _context37.n = 2;
                break;
              }
              throw new Error("This browser cannot capture wake-training audio.");
            case 2:
              _context37.n = 3;
              return nyxMediaRequest(navigator.mediaDevices.getUserMedia({
                audio: {
                  echoCancellation: true,
                  noiseSuppression: true,
                  autoGainControl: true
                },
                video: false
              }), 5500, "Microphone permission timed out.");
            case 3:
              stream = _context37.v;
              type = ["audio/mp4", "audio/webm", "audio/ogg"].find(function (t) {
                return MediaRecorder.isTypeSupported(t);
              });
              recorder = type ? new MediaRecorder(stream, {
                mimeType: type
              }) : new MediaRecorder(stream), chunks = [];
              status = document.getElementById("nyxWakeCaptureStatus");
              recorder.ondataavailable = function (e) {
                var _a2;
                if ((_a2 = e.data) == null ? void 0 : _a2.size) chunks.push(e.data);
              };
              stopped = new Promise(function (resolve) {
                return recorder.onstop = resolve;
              });
              status.textContent = "Say \u201CNyx\u201D now.";
              _this27.state("listening");
              recorder.start();
              _context37.n = 4;
              return nyxDelay(1800);
            case 4:
              try {
                if (recorder.state !== "inactive") recorder.stop();
              } catch (e) {}
              _context37.n = 5;
              return stopped;
            case 5:
              stream.getTracks().forEach(function (t) {
                return t.stop();
              });
              _this27.state("idle");
              blob = new Blob(chunks, {
                type: recorder.mimeType || "audio/mp4"
              });
              if (!(blob.size < 180)) {
                _context37.n = 6;
                break;
              }
              throw new Error("I didn\u2019t capture enough audio.");
            case 6:
              _context37.n = 7;
              return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.onload = function () {
                  return resolve(String(reader.result).split(",")[1]);
                };
                reader.onerror = function () {
                  return reject(Error("Could not read wake sample."));
                };
                reader.readAsDataURL(blob);
              });
            case 7:
              audio = _context37.v;
              status.textContent = "Checking that sample\u2026";
              _context37.n = 8;
              return api("/api/voice/transcribe", {
                method: "POST",
                timeoutMs: 7e3,
                body: JSON.stringify({
                  audio,
                  type: blob.type.split(";")[0] || "audio/mp4"
                })
              });
            case 8:
              result = _context37.v;
              transcript = String(result.text || "").trim(), normalized = transcript.toLowerCase().replace(/[^a-z]/g, "");
              accepted = ["nyx", "nix", "nicks"].includes(normalized);
              if (!accepted) {
                _context37.n = 9;
                break;
              }
              _context37.n = 9;
              return NYXWakeTraining.save(blob, {
                label: "positive",
                promptKind,
                transcript
              });
            case 9:
              return _context37.a(2, {
                accepted,
                transcript,
                blob
              });
          }
        }, _callee37);
      }))();
    },
    enrollWakeWord() {
      var _arguments2 = arguments,
        _this28 = this;
      return _asyncToGenerator(_regenerator().m(function _callee39() {
        var _ref13, _ref13$returnToSettin, returnToSettings, host, card, consent, prompts, completed, i, accepted, tries, sample, _t27;
        return _regenerator().w(function (_context39) {
          while (1) switch (_context39.p = _context39.n) {
            case 0:
              _ref13 = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : {}, _ref13$returnToSettin = _ref13.returnToSettings, returnToSettings = _ref13$returnToSettin === void 0 ? false : _ref13$returnToSettin;
              if (credential) {
                _context39.n = 1;
                break;
              }
              return _context39.a(2, false);
            case 1:
              NYXHandsFree.stop();
              NYXVoice.stopSpeech();
              host = document.getElementById("nyxOnboard"), card = document.getElementById("nyxOnboardCard");
              host.classList.add("show");
              card.innerHTML = '<h2>Teach me how you say Nyx</h2><p>I\u2019ll record five short wake-word samples and keep the accepted clips only in this browser on this device for Nyx wake-model training. During setup, each clip is temporarily sent through NyxThea transcription only to confirm that it says \u201CNyx\u201D; the raw clip is not stored on the server.</p><button id="beginWakeSamples" class="primary">Record my five Nyx samples</button><button id="cancelWakeSamples" class="secondary">Not now</button>';
              _context39.n = 2;
              return new Promise(function (resolve) {
                document.getElementById("beginWakeSamples").onclick = function () {
                  return resolve(true);
                };
                document.getElementById("cancelWakeSamples").onclick = function () {
                  return resolve(false);
                };
              });
            case 2:
              consent = _context39.v;
              if (consent) {
                _context39.n = 3;
                break;
              }
              host.classList.remove("show");
              if (returnToSettings) void accountSettings();
              return _context39.a(2, false);
            case 3:
              prompts = [["normal", "Say Nyx in your normal voice."], ["soft", "Say Nyx a little softer."], ["loud", "Say Nyx a little louder."], ["attention", "Say Nyx naturally, like you\u2019re getting my attention."], ["final", "One more time. Say Nyx."]];
              completed = 0;
              i = 0;
            case 4:
              if (!(i < prompts.length)) {
                _context39.n = 17;
                break;
              }
              accepted = false, tries = 0;
            case 5:
              if (!(!accepted && tries < 3)) {
                _context39.n = 11;
                break;
              }
              tries++;
              _context39.p = 6;
              _context39.n = 7;
              return _this28.captureWakeSample(prompts[i][0], prompts[i][1]);
            case 7:
              sample = _context39.v;
              accepted = sample.accepted;
              _context39.n = 9;
              break;
            case 8:
              _context39.p = 8;
              _t27 = _context39.v;
              card.insertAdjacentHTML("beforeend", '<p class="small" role="alert">'.concat(esc(_t27.message || "Wake sample capture failed."), "</p>"));
            case 9:
              if (accepted) {
                _context39.n = 10;
                break;
              }
              card.insertAdjacentHTML("beforeend", '<p class="small" role="alert">I didn\u2019t hear \u201CNyx\u201D clearly enough. Try that sample again.</p>');
              _context39.n = 10;
              return nyxDelay(500);
            case 10:
              _context39.n = 5;
              break;
            case 11:
              if (accepted) {
                _context39.n = 15;
                break;
              }
              _context39.n = 12;
              return _this28.saveWakeEnrollment({
                complete: false,
                samples: completed
              });
            case 12:
              _context39.n = 13;
              return _this28.save({
                handsFreeEnabled: false
              });
            case 13:
              card.innerHTML = '<h2>Nyx setup paused</h2><p>I couldn\u2019t confirm all five samples. Hands-free wake stays off, but you can still use tap-to-talk and text.</p><button id="retryWakeEnrollment" class="primary">Try Nyx setup again</button><button id="leaveWakeEnrollment" class="secondary">Not now</button>';
              _context39.n = 14;
              return new Promise(function (resolve) {
                document.getElementById("retryWakeEnrollment").onclick = _asyncToGenerator(_regenerator().m(function _callee38() {
                  var _t26;
                  return _regenerator().w(function (_context38) {
                    while (1) switch (_context38.n) {
                      case 0:
                        _t26 = resolve;
                        _context38.n = 1;
                        return _this28.enrollWakeWord({
                          returnToSettings
                        });
                      case 1:
                        return _context38.a(2, _t26(_context38.v));
                    }
                  }, _callee38);
                }));
                document.getElementById("leaveWakeEnrollment").onclick = function () {
                  host.classList.remove("show");
                  if (returnToSettings) void accountSettings();
                  resolve(false);
                };
              });
            case 14:
              return _context39.a(2, _context39.v);
            case 15:
              completed = i + 1;
              _context39.n = 16;
              return _this28.saveWakeEnrollment({
                complete: false,
                samples: completed
              });
            case 16:
              i++;
              _context39.n = 4;
              break;
            case 17:
              _context39.n = 18;
              return _this28.saveWakeEnrollment({
                complete: true,
                samples: 5
              });
            case 18:
              NYXSound.cue("success");
              card.innerHTML = '<h2>Nyx knows this device</h2><p>Five wake samples confirmed. Say \u201CNyx\u201D to get my attention. This setup is calibration, not identity verification.</p><button id="finishWakeEnrollment" class="primary">Continue</button>';
              _context39.n = 19;
              return new Promise(function (resolve) {
                document.getElementById("finishWakeEnrollment").onclick = function () {
                  host.classList.remove("show");
                  if (returnToSettings) void accountSettings();
                  resolve(true);
                };
              });
            case 19:
              return _context39.a(2, _context39.v);
          }
        }, _callee39, null, [[6, 8]]);
      }))();
    },
    startVoiceSession() {
      var _this29 = this;
      return _asyncToGenerator(_regenerator().m(function _callee41() {
        var _a, _b, _c, enrolled, host, card, name, greeting, button, status;
        return _regenerator().w(function (_context41) {
          while (1) switch (_context41.n) {
            case 0:
              if (_this29.voiceSessionEnabled()) {
                _context41.n = 1;
                break;
              }
              state("ready", ((_a = _this29.settings) == null ? void 0 : _a.voiceEnabled) === false ? "Voice is disabled in your profile." : "Wake-by-name is off. Use the microphone button when you want to talk.");
              return _context41.a(2);
            case 1:
              if (_this29.wakeEnrollmentReady()) {
                _context41.n = 3;
                break;
              }
              _context41.n = 2;
              return _this29.enrollWakeWord();
            case 2:
              enrolled = _context41.v;
              if (enrolled) {
                _context41.n = 3;
                break;
              }
              return _context41.a(2);
            case 3:
              host = document.getElementById("nyxOnboard"), card = document.getElementById("nyxOnboardCard");
              host.classList.add("show");
              name = ((_b = _this29.settings) == null ? void 0 : _b.pronunciation) || ((_c = _this29.settings) == null ? void 0 : _c.preferredName) || (credential == null ? void 0 : credential.displayName) || "";
              greeting = name ? "Hey " + name + ". I\u2019m here." : "Hey. I\u2019m here.";
              card.innerHTML = '<h2>Start NYX</h2><p>Tap once to start voice for this iPhone session.</p><button id="nyxStartSession" class="primary">Start NYX</button><p id="nyxStartSessionStatus" class="small"></p>';
              button = document.getElementById("nyxStartSession"), status = document.getElementById("nyxStartSessionStatus");
              button.onclick = _asyncToGenerator(_regenerator().m(function _callee40() {
                var _a2, cue, wakeStream, greetingResult, spoken, _t28;
                return _regenerator().w(function (_context40) {
                  while (1) switch (_context40.p = _context40.n) {
                    case 0:
                      if (!button.disabled) {
                        _context40.n = 1;
                        break;
                      }
                      return _context40.a(2);
                    case 1:
                      button.disabled = true;
                      button.textContent = "Starting\u2026";
                      status.textContent = "Opening microphone\u2026";
                      NYXSound.forceSession = true;
                      try {
                        cue = nyxStartupAudio();
                        cue.currentTime = 0;
                        void cue.play().catch(function () {});
                      } catch (e) {}
                      wakeStream = null;
                      _context40.p = 2;
                      if ((_a2 = navigator.mediaDevices) == null ? void 0 : _a2.getUserMedia) {
                        _context40.n = 3;
                        break;
                      }
                      throw new Error("Microphone access is not available.");
                    case 3:
                      _context40.n = 4;
                      return nyxMediaRequest(navigator.mediaDevices.getUserMedia({
                        audio: {
                          echoCancellation: true,
                          noiseSuppression: true,
                          autoGainControl: true
                        },
                        video: false
                      }), 4500, "Microphone permission timed out.");
                    case 4:
                      wakeStream = _context40.v;
                      _context40.n = 6;
                      break;
                    case 5:
                      _context40.p = 5;
                      _t28 = _context40.v;
                      status.textContent = ((_t28 == null ? void 0 : _t28.message) || "Microphone could not start.") + " Tap Start NYX to try again.";
                      button.disabled = false;
                      button.textContent = "Start NYX";
                      return _context40.a(2);
                    case 6:
                      host.classList.remove("show");
                      status.textContent = "NYX is ready.";
                      greetingResult = NYXVoice.say(greeting);
                      _context40.n = 7;
                      return nyxTimed(greetingResult, 7e3, "Greeting voice timed out.").catch(function () {
                        return false;
                      });
                    case 7:
                      spoken = _context40.v;
                      if (!spoken) {
                        NYXVoice.stopSpeech();
                        state("ready", "Voice ready");
                      }
                      _context40.n = 8;
                      return NYXHandsFree.startWithStream(wakeStream);
                    case 8:
                      return _context40.a(2);
                  }
                }, _callee40, null, [[2, 5]]);
              }));
            case 4:
              return _context41.a(2);
          }
        }, _callee41);
      }))();
    },
    sayAndListen(prompt) {
      var _arguments3 = arguments,
        _this30 = this;
      return _asyncToGenerator(_regenerator().m(function _callee46() {
        var _ref16, _ref16$hint, hint, _ref16$timeout, timeout, _ref16$allowTyped, allowTyped, _ref16$requireTap, requireTap, card;
        return _regenerator().w(function (_context46) {
          while (1) switch (_context46.n) {
            case 0:
              _ref16 = _arguments3.length > 1 && _arguments3[1] !== undefined ? _arguments3[1] : {}, _ref16$hint = _ref16.hint, hint = _ref16$hint === void 0 ? "I\u2019m listening\u2026" : _ref16$hint, _ref16$timeout = _ref16.timeout, timeout = _ref16$timeout === void 0 ? 12e3 : _ref16$timeout, _ref16$allowTyped = _ref16.allowTyped, allowTyped = _ref16$allowTyped === void 0 ? true : _ref16$allowTyped, _ref16$requireTap = _ref16.requireTap, requireTap = _ref16$requireTap === void 0 ? false : _ref16$requireTap;
              card = document.getElementById("nyxOnboardCard");
              card.innerHTML = "<h2>".concat(esc(prompt), '</h2><div style="display:grid;place-items:center;padding:26px 0"><div class="nyx-voice-orb" style="width:92px;height:92px;border-radius:50%;border:1px solid #83d0ff88;box-shadow:0 0 34px #287cff66, inset 0 0 24px #1b59b855;display:grid;place-items:center;font-size:1.8rem">\u25C9</div></div><p id="nyxVoiceStatus" class="small" style="text-align:center">').concat(esc(hint), '</p><button id="nyxVoiceRetry" class="secondary" hidden>Tap once to answer</button><button id="nyxTypeInstead" class="secondary"').concat(allowTyped ? "" : " hidden", '>Type instead</button><input id="nyxVoiceTyped" class="field" hidden placeholder="Type your answer instead"><button id="nyxVoiceTypedSubmit" class="secondary" hidden>Continue with typed answer</button>');
              return _context46.a(2, new Promise(function (resolve) {
                var status = document.getElementById("nyxVoiceStatus"),
                  retry = document.getElementById("nyxVoiceRetry"),
                  typed = document.getElementById("nyxVoiceTyped"),
                  typedSubmit = document.getElementById("nyxVoiceTypedSubmit");
                var finished = false,
                  typing = false,
                  timer = null,
                  attempts = 0,
                  retrying = false,
                  stream = null,
                  recorder = null,
                  recognition = null;
                var cleanup = function cleanup() {
                  clearTimeout(timer);
                  timer = null;
                  var active = recorder;
                  recorder = null;
                  if (active) {
                    active.onstop = null;
                    active.onerror = null;
                    try {
                      if (active.state !== "inactive") active.stop();
                    } catch (e) {}
                  }
                  var speech = recognition;
                  recognition = null;
                  if (speech) {
                    speech.onend = null;
                    speech.onerror = null;
                    try {
                      speech.abort();
                    } catch (e) {}
                  }
                  stream = null;
                  _this30.state("idle");
                };
                var done = function done(value) {
                  if (finished) return;
                  finished = true;
                  NYXVoice.stopSpeech();
                  cleanup();
                  resolve(String(value || "").trim());
                };
                var showTyped = function showTyped(message) {
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
                var miss = function () {
                  var _ref17 = _asyncToGenerator(_regenerator().m(function _callee42(message) {
                    return _regenerator().w(function (_context42) {
                      while (1) switch (_context42.n) {
                        case 0:
                          if (!(finished || typing || retrying)) {
                            _context42.n = 1;
                            break;
                          }
                          return _context42.a(2);
                        case 1:
                          retrying = true;
                          cleanup();
                          attempts++;
                          if (!(attempts <= 2)) {
                            _context42.n = 3;
                            break;
                          }
                          status.textContent = message || "I didn\u2019t catch that.";
                          _context42.n = 2;
                          return _this30.prompt("I didn\u2019t catch that. Say that again for me.");
                        case 2:
                          retrying = false;
                          if (!finished && !typing) timer = setTimeout(begin, 380);
                          _context42.n = 4;
                          break;
                        case 3:
                          status.textContent = "I\u2019m having trouble hearing you. Tap once and try again, or type your answer.";
                          retry.hidden = false;
                          if (allowTyped) {
                            typed.hidden = false;
                            typedSubmit.hidden = false;
                          }
                        case 4:
                          return _context42.a(2);
                      }
                    }, _callee42);
                  }));
                  return function miss(_x13) {
                    return _ref17.apply(this, arguments);
                  };
                }();
                var transcribeBlob = function () {
                  var _ref18 = _asyncToGenerator(_regenerator().m(function _callee43(blob) {
                    var audio, result;
                    return _regenerator().w(function (_context43) {
                      while (1) switch (_context43.n) {
                        case 0:
                          if (!(blob.size < 100)) {
                            _context43.n = 1;
                            break;
                          }
                          throw new Error("No speech was captured.");
                        case 1:
                          if (!(blob.size > 1e6)) {
                            _context43.n = 2;
                            break;
                          }
                          throw new Error("Recording was too large.");
                        case 2:
                          _context43.n = 3;
                          return new Promise(function (resolveAudio, reject) {
                            var reader = new FileReader();
                            reader.onload = function () {
                              return resolveAudio(String(reader.result).split(",")[1]);
                            };
                            reader.onerror = function () {
                              return reject(Error("Could not read the recording."));
                            };
                            reader.readAsDataURL(blob);
                          });
                        case 3:
                          audio = _context43.v;
                          _context43.n = 4;
                          return api("/api/voice/transcribe", {
                            method: "POST",
                            timeoutMs: 7e3,
                            body: JSON.stringify({
                              audio,
                              type: blob.type.split(";")[0] || "audio/mp4"
                            })
                          });
                        case 4:
                          result = _context43.v;
                          return _context43.a(2, String(result.text || "").trim());
                      }
                    }, _callee43);
                  }));
                  return function transcribeBlob(_x14) {
                    return _ref18.apply(this, arguments);
                  };
                }();
                var beginMedia = function () {
                  var _ref19 = _asyncToGenerator(_regenerator().m(function _callee45() {
                    var type, chunks, _t30;
                    return _regenerator().w(function (_context45) {
                      while (1) switch (_context45.p = _context45.n) {
                        case 0:
                          _context45.p = 0;
                          _context45.n = 1;
                          return _this30.ensureOnboardingStream();
                        case 1:
                          stream = _context45.v;
                          if (!(finished || typing)) {
                            _context45.n = 2;
                            break;
                          }
                          return _context45.a(2);
                        case 2:
                          type = ["audio/mp4", "audio/webm", "audio/ogg"].find(function (t) {
                            return MediaRecorder.isTypeSupported(t);
                          });
                          recorder = type ? new MediaRecorder(stream, {
                            mimeType: type
                          }) : new MediaRecorder(stream);
                          chunks = [];
                          recorder.ondataavailable = function (e) {
                            var _a;
                            if ((_a = e.data) == null ? void 0 : _a.size) chunks.push(e.data);
                          };
                          recorder.onstart = function () {
                            status.textContent = "Listening\u2026";
                            _this30.state("listening");
                          };
                          recorder.onerror = function () {
                            return void miss("I couldn\u2019t use the microphone.");
                          };
                          recorder.onstop = _asyncToGenerator(_regenerator().m(function _callee44() {
                            var localRecorder, blob, text, _t29;
                            return _regenerator().w(function (_context44) {
                              while (1) switch (_context44.p = _context44.n) {
                                case 0:
                                  stream = null;
                                  localRecorder = recorder;
                                  recorder = null;
                                  if (!(finished || typing || retrying)) {
                                    _context44.n = 1;
                                    break;
                                  }
                                  return _context44.a(2);
                                case 1:
                                  _this30.state("thinking");
                                  status.textContent = "Listening back\u2026";
                                  _context44.p = 2;
                                  blob = new Blob(chunks, {
                                    type: (localRecorder == null ? void 0 : localRecorder.mimeType) || type || "audio/mp4"
                                  });
                                  _context44.n = 3;
                                  return transcribeBlob(blob);
                                case 3:
                                  text = _context44.v;
                                  if (!(finished || typing)) {
                                    _context44.n = 4;
                                    break;
                                  }
                                  return _context44.a(2);
                                case 4:
                                  if (!text) {
                                    _context44.n = 5;
                                    break;
                                  }
                                  done(text);
                                  _context44.n = 6;
                                  break;
                                case 5:
                                  _context44.n = 6;
                                  return miss("I didn\u2019t catch that.");
                                case 6:
                                  _context44.n = 8;
                                  break;
                                case 7:
                                  _context44.p = 7;
                                  _t29 = _context44.v;
                                  _context44.n = 8;
                                  return miss((_t29 == null ? void 0 : _t29.message) || "I didn\u2019t catch that.");
                                case 8:
                                  return _context44.a(2);
                              }
                            }, _callee44, null, [[2, 7]]);
                          }));
                          recorder.start();
                          timer = setTimeout(function () {
                            try {
                              if ((recorder == null ? void 0 : recorder.state) !== "inactive") recorder.stop();
                            } catch (e) {}
                          }, Math.min(6500, Math.max(3e3, timeout - 1500)));
                          _context45.n = 5;
                          break;
                        case 3:
                          _context45.p = 3;
                          _t30 = _context45.v;
                          if (!((_t30 == null ? void 0 : _t30.name) === "NotAllowedError")) {
                            _context45.n = 4;
                            break;
                          }
                          showTyped("Microphone access is blocked. You can type this answer instead.");
                          return _context45.a(2);
                        case 4:
                          _context45.n = 5;
                          return miss((_t30 == null ? void 0 : _t30.message) || "I couldn\u2019t start the microphone.");
                        case 5:
                          return _context45.a(2);
                      }
                    }, _callee45, null, [[0, 3]]);
                  }));
                  return function beginMedia() {
                    return _ref19.apply(this, arguments);
                  };
                }();
                var beginSpeech = function beginSpeech() {
                  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
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
                    recognition.onstart = function () {
                      status.textContent = "Listening\u2026";
                      _this30.state("listening");
                    };
                    recognition.onresult = function (e) {
                      var _a, _b, _c, _d;
                      var text = ((_d = (_c = (_b = (_a = e.results) == null ? void 0 : _a[0]) == null ? void 0 : _b[0]) == null ? void 0 : _c.transcript) == null ? void 0 : _d.trim()) || "";
                      if (text) done(text);else void miss("I didn\u2019t catch that.");
                    };
                    recognition.onerror = function (e) {
                      if (["not-allowed", "service-not-allowed"].includes(e.error)) showTyped("Microphone recognition is blocked. You can type this answer instead.");else void miss("I didn\u2019t catch that.");
                    };
                    recognition.onend = function () {
                      if (!finished && !retrying && recognition) {
                        recognition = null;
                        void miss("I didn\u2019t catch that.");
                      }
                    };
                    recognition.start();
                    timer = setTimeout(function () {
                      return void miss("I didn\u2019t catch that.");
                    }, timeout);
                  } catch (e) {
                    showTyped("Voice recognition isn\u2019t available here. You can type this answer instead.");
                  }
                };
                var begin = function begin() {
                  var _a;
                  if (finished || typing || retrying) return;
                  cleanup();
                  if (((_a = navigator.mediaDevices) == null ? void 0 : _a.getUserMedia) && window.MediaRecorder) void beginMedia();else beginSpeech();
                };
                retry.onclick = function () {
                  retry.hidden = true;
                  typed.hidden = true;
                  typedSubmit.hidden = true;
                  attempts = 0;
                  typing = false;
                  NYXVoice.stopSpeech();
                  begin();
                };
                typedSubmit.onclick = function () {
                  var value = typed.value.trim();
                  if (value) done(value);
                };
                typed.onkeydown = function (e) {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    typedSubmit.click();
                  }
                };
                document.getElementById("nyxTypeInstead").onclick = function () {
                  return showTyped("Type your answer below.");
                };
                if (_this30.onboardingTyped) {
                  showTyped("Type your answer below.");
                  return;
                }
                void _this30.prompt(prompt).then(function () {
                  if (finished || typing) return;
                  if (requireTap) {
                    status.textContent = hint || "Tap once when you're ready.";
                    retry.hidden = false;
                    retry.textContent = "Tap to answer";
                  } else timer = setTimeout(begin, 420);
                });
              }));
          }
        }, _callee46);
      }))();
    },
    onboard() {
      var _arguments4 = arguments,
        _this31 = this;
      return _asyncToGenerator(_regenerator().m(function _callee47() {
        var edit, card, _t31;
        return _regenerator().w(function (_context47) {
          while (1) switch (_context47.p = _context47.n) {
            case 0:
              edit = _arguments4.length > 0 && _arguments4[0] !== undefined ? _arguments4[0] : false;
              _context47.p = 1;
              _context47.n = 2;
              return _this31.runOnboarding(edit);
            case 2:
              return _context47.a(2, _context47.v);
            case 3:
              _context47.p = 3;
              _t31 = _context47.v;
              _this31.stopOnboardingStream();
              NYXVoice.stopSpeech();
              card = document.getElementById("nyxOnboardCard");
              card.innerHTML = '<h2>Let\u2019s try that step again</h2><p role="alert">'.concat(esc((_t31 == null ? void 0 : _t31.message) || "Setup could not finish."), '</p><button id="nyxRetrySetup" class="primary">Retry setup</button><button id="nyxLeaveSetup" class="secondary">Back to Home</button>');
              document.getElementById("nyxRetrySetup").onclick = function () {
                return _this31.onboard(edit);
              };
              document.getElementById("nyxLeaveSetup").onclick = function () {
                return document.getElementById("nyxOnboard").classList.remove("show");
              };
            case 4:
              return _context47.a(2);
          }
        }, _callee47, null, [[1, 3]]);
      }))();
    },
    runOnboarding() {
      var _arguments5 = arguments,
        _this32 = this;
      return _asyncToGenerator(_regenerator().m(function _callee51() {
        var edit, host, card, cleanName, askConfirm, name, rawName, heardName, nameCorrect, pronunciation, pronunciationConfirmed, spokenPronunciation, birthdaySpoken, parsed, birthday, _t34;
        return _regenerator().w(function (_context51) {
          while (1) switch (_context51.p = _context51.n) {
            case 0:
              edit = _arguments5.length > 0 && _arguments5[0] !== undefined ? _arguments5[0] : false;
              if (credential) {
                _context51.n = 1;
                break;
              }
              unlock();
              return _context51.a(2);
            case 1:
              _this32.onboardingTyped = false;
              shut();
              NYXHandsFree.stop();
              host = document.getElementById("nyxOnboard"), card = document.getElementById("nyxOnboardCard");
              host.classList.add("show");
              card.innerHTML = '<h2>Meet NYX</h2><p>One tap lets NYX use your speaker and microphone for this introduction. After that, you can talk naturally without typing.</p><button id="nyxBeginVoice" class="primary">Meet NYX</button><button id="nyxBeginTyped" class="secondary">Use typed setup instead</button><p id="nyxBeginStatus" class="small"></p>';
              _context51.n = 2;
              return new Promise(function (resolve) {
                var button = document.getElementById("nyxBeginVoice"),
                  status = document.getElementById("nyxBeginStatus");
                var running = false;
                document.getElementById("nyxBeginTyped").onclick = function () {
                  if (running) return;
                  _this32.onboardingTyped = true;
                  resolve();
                };
                button.onclick = _asyncToGenerator(_regenerator().m(function _callee48() {
                  var _t32;
                  return _regenerator().w(function (_context48) {
                    while (1) switch (_context48.p = _context48.n) {
                      case 0:
                        if (!running) {
                          _context48.n = 1;
                          break;
                        }
                        return _context48.a(2);
                      case 1:
                        running = true;
                        button.disabled = true;
                        button.textContent = "Opening NYX\u2026";
                        status.textContent = "Opening voice\u2026";
                        _context48.p = 2;
                        _this32.stopOnboardingStream();
                        _context48.n = 3;
                        return nyxPrimeFirstRun();
                      case 3:
                        _this32.onboardingStream = _context48.v;
                        status.textContent = "Voice ready.";
                        button.textContent = "Ready";
                        resolve();
                        _context48.n = 5;
                        break;
                      case 4:
                        _context48.p = 4;
                        _t32 = _context48.v;
                        NYXSound.cue("warning");
                        status.textContent = ((_t32 == null ? void 0 : _t32.message) || "Voice could not start.") + " Tap Meet NYX to try again.";
                        button.disabled = false;
                        button.textContent = "Meet NYX";
                        running = false;
                      case 5:
                        return _context48.a(2);
                    }
                  }, _callee48, null, [[2, 4]]);
                }));
              });
            case 2:
              cleanName = function cleanName(value) {
                var text = String(value || "").trim().replace(/[.!?]+$/, "");
                text = text.replace(/^(?:hello[,.]?\s*)?(?:my name is|i am|i'm|im|you can call me|call me|just call me|it's|its)\s+/i, "").trim();
                if (/\s+is\s+/i.test(text) && /^my\s+name/i.test(String(value || ""))) text = text.split(/\s+is\s+/i).pop().trim();
                return text.slice(0, 80);
              };
              askConfirm = function () {
                var _ref22 = _asyncToGenerator(_regenerator().m(function _callee49(prompt) {
                  return _regenerator().w(function (_context49) {
                    while (1) switch (_context49.n) {
                      case 0:
                        card.innerHTML = "<h2>".concat(esc(prompt), '</h2><p class="small">Confirm what Nyx heard before continuing.</p><div class="nyx-choice"><button id="nyxConfirmYes" class="primary">Yes, that\'s right</button><button id="nyxConfirmNo" class="secondary">No, try again</button></div>');
                        _context49.n = 1;
                        return new Promise(function (resolve) {
                          var answer = function answer(value) {
                            NYXVoice.stopSpeech();
                            resolve(value);
                          };
                          document.getElementById("nyxConfirmYes").onclick = function () {
                            return answer(true);
                          };
                          document.getElementById("nyxConfirmNo").onclick = function () {
                            return answer(false);
                          };
                          void _this32.prompt(prompt);
                        });
                      case 1:
                        return _context49.a(2, _context49.v);
                    }
                  }, _callee49);
                }));
                return function askConfirm(_x15) {
                  return _ref22.apply(this, arguments);
                };
              }();
              name = "";
            case 3:
              if (name) {
                _context51.n = 9;
                break;
              }
              _context51.n = 4;
              return _this32.sayAndListen("Hello. I\u2019m NYX. Before we begin, I\u2019d like to know what to call you.", {
                hint: "Say your name, for example: My name is Cheyenne."
              });
            case 4:
              rawName = _context51.v;
              if (rawName) {
                _context51.n = 5;
                break;
              }
              _this32.stopOnboardingStream();
              card.innerHTML = '<h2>I lost the microphone.</h2><p>Tap below to try the spoken introduction again.</p><button id="nyxRestartVoice" class="primary">Try again</button>';
              document.getElementById("nyxRestartVoice").onclick = function () {
                return _this32.onboard(edit);
              };
              return _context51.a(2);
            case 5:
              heardName = cleanName(rawName) || String(rawName).trim().slice(0, 80);
              _context51.n = 6;
              return askConfirm("I heard " + heardName + ". Is that what you want me to call you?");
            case 6:
              nameCorrect = _context51.v;
              if (!nameCorrect) {
                _context51.n = 7;
                break;
              }
              name = heardName;
              return _context51.a(3, 9);
            case 7:
              _context51.n = 8;
              return _this32.prompt("Okay. I won\u2019t save that. Tell me your name again.");
            case 8:
              _context51.n = 3;
              break;
            case 9:
              _context51.n = 10;
              return _this32.save({
                preferredName: name
              });
            case 10:
              _context51.n = 11;
              return api("/api/household/identity", {
                method: "POST",
                body: JSON.stringify({
                  preferredName: name
                })
              });
            case 11:
              _context51.n = 12;
              return _this32.prompt("Nice to meet you, " + name + ".");
            case 12:
              pronunciation = name, pronunciationConfirmed = false;
            case 13:
              if (pronunciationConfirmed) {
                _context51.n = 18;
                break;
              }
              _context51.n = 14;
              return _this32.sayAndListen("How would you like me to pronounce " + name + "? Say it exactly the way you want me to say it.", {
                hint: "Tap once, then say your name the way it should sound.",
                requireTap: true
              });
            case 14:
              spokenPronunciation = _context51.v;
              if (spokenPronunciation) pronunciation = cleanName(spokenPronunciation) || pronunciation;
              _context51.n = 15;
              return _this32.prompt("Let me try it. " + pronunciation + ".");
            case 15:
              _context51.n = 16;
              return askConfirm("Did I pronounce " + name + " correctly?");
            case 16:
              pronunciationConfirmed = _context51.v;
              if (pronunciationConfirmed) {
                _context51.n = 17;
                break;
              }
              _context51.n = 17;
              return _this32.prompt("Okay. Let\u2019s try that again. I won\u2019t move on until I get it right.");
            case 17:
              _context51.n = 13;
              break;
            case 18:
              _context51.n = 19;
              return _this32.save({
                pronunciation
              });
            case 19:
              _context51.n = 20;
              return api("/api/household/identity", {
                method: "POST",
                body: JSON.stringify({
                  pronunciation
                })
              });
            case 20:
              _context51.n = 21;
              return _this32.sayAndListen("When is your birthday? You can say something like July fourth nineteen ninety.", {
                hint: "Say your month, day, and year."
              });
            case 21:
              birthdaySpoken = _context51.v;
              if (!birthdaySpoken) {
                _context51.n = 25;
                break;
              }
              parsed = new Date(birthdaySpoken);
              if (Number.isNaN(parsed.getTime())) {
                _context51.n = 25;
                break;
              }
              birthday = [parsed.getFullYear(), String(parsed.getMonth() + 1).padStart(2, "0"), String(parsed.getDate()).padStart(2, "0")].join("-");
              _context51.p = 22;
              _context51.n = 23;
              return api("/api/household/identity", {
                method: "POST",
                body: JSON.stringify({
                  birthday
                })
              });
            case 23:
              _context51.n = 25;
              break;
            case 24:
              _context51.p = 24;
              _t34 = _context51.v;
            case 25:
              card.innerHTML = '<h2>How much should I speak up?</h2><div class="nyx-choice"><button data-p="quiet"><strong>Quiet</strong><br>I\u2019m here when you ask.</button><button data-p="helpful"><strong>Helpful \u2014 Recommended</strong><br>I\u2019ll speak up when something genuinely matters.</button><button data-p="engaged"><strong>Engaged</strong><br>Be involved. Notice things and suggest what\u2019s next.</button></div>';
              host.querySelectorAll("[data-p]").forEach(function (b) {
                return b.onclick = _asyncToGenerator(_regenerator().m(function _callee50() {
                  var status, _t33;
                  return _regenerator().w(function (_context50) {
                    while (1) switch (_context50.p = _context50.n) {
                      case 0:
                        _context50.p = 0;
                        _context50.n = 1;
                        return _this32.save({
                          proactiveMode: b.dataset.p
                        });
                      case 1:
                        _this32.style(name, host);
                        _context50.n = 3;
                        break;
                      case 2:
                        _context50.p = 2;
                        _t33 = _context50.v;
                        status = host.querySelector("#nyxOnboardCard");
                        status.innerHTML += '<p class="small">'.concat(esc(_t33.message), "</p>");
                      case 3:
                        return _context50.a(2);
                    }
                  }, _callee50, null, [[0, 2]]);
                }));
              });
            case 26:
              return _context51.a(2);
          }
        }, _callee51, null, [[22, 24]]);
      }))();
    },
    style(name, host) {
      var _this33 = this;
      this.stopOnboardingStream();
      host.querySelector("#nyxOnboardCard").innerHTML = '<h2>How should we talk?</h2><div class="nyx-choice"><button data-s="professional"><strong>Professional</strong><br>Straightforward and polished.</button><button data-s="natural"><strong>Natural \u2014 Recommended</strong><br>Relaxed, warm, occasional humor.</button><button data-s="unfiltered"><strong>Unfiltered</strong><br>Adult opt-in: swearing, sarcasm and non-graphic innuendo.</button></div>';
      host.querySelectorAll("[data-s]").forEach(function (b) {
        return b.onclick = _asyncToGenerator(_regenerator().m(function _callee52() {
          var enrolled, _t35;
          return _regenerator().w(function (_context52) {
            while (1) switch (_context52.p = _context52.n) {
              case 0:
                _context52.p = 0;
                _context52.n = 1;
                return _this33.save({
                  communicationStyle: b.dataset.s,
                  onboarded: true,
                  onboardingVersion: 2,
                  voiceAssistantMode: true,
                  handsFreeEnabled: false,
                  handsFreeConfigured: true
                });
              case 1:
                NYXSound.cue("success");
                _context52.n = 2;
                return _this33.prompt("Perfect. Now teach me how you say Nyx.");
              case 2:
                _context52.n = 3;
                return _this33.enrollWakeWord();
              case 3:
                enrolled = _context52.v;
                if (!enrolled) {
                  _context52.n = 5;
                  break;
                }
                _context52.n = 4;
                return _this33.save({
                  handsFreeEnabled: true
                });
              case 4:
                NYXHandsFree.start();
                _context52.n = 6;
                break;
              case 5:
                host.classList.remove("show");
              case 6:
                _context52.n = 8;
                break;
              case 7:
                _context52.p = 7;
                _t35 = _context52.v;
                host.querySelector("#nyxOnboardCard").innerHTML += '<p class="small">'.concat(esc(_t35.message), "</p>");
              case 8:
                return _context52.a(2);
            }
          }, _callee52, null, [[0, 7]]);
        }));
      });
    },
    initMic() {
      document.getElementById("nyxMic").onclick = toggleVoice;
    }
  };
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      NYXExperience.stopOnboardingStream();
      NYXHandsFree.stop();
      NYXVoice.stop();
      if (guideSession || guidePending.length) endLiveGuide(false);
    } else if (credential && !NYXExperience.needsOnboarding() && NYXExperience.voiceSessionEnabled()) {
      void _asyncToGenerator(_regenerator().m(function _callee53() {
        var unlocked;
        return _regenerator().w(function (_context53) {
          while (1) switch (_context53.n) {
            case 0:
              _context53.n = 1;
              return enforceProfileLock();
            case 1:
              unlocked = _context53.v;
              if (unlocked) NYXExperience.startVoiceSession();
            case 2:
              return _context53.a(2);
          }
        }, _callee53);
      }))();
    }
  });
  window.addEventListener("pagehide", function () {
    NYXExperience.stopOnboardingStream();
    NYXHandsFree.stop();
    NYXVoice.stop();
    if (guideSession || guidePending.length) endLiveGuide(false);
  });
  function dismissNyxLaunch() {
    var launch = document.getElementById("nyxLaunch");
    if (launch) {
      launch.classList.add("done");
      launch.style.display = "none";
      launch.style.pointerEvents = "none";
      launch.setAttribute("aria-hidden", "true");
    }
  }
  window.addEventListener("DOMContentLoaded", function () {
    var launchTimer = setTimeout(dismissNyxLaunch, 3200);
    setTimeout(dismissNyxLaunch, 5200);
    void _asyncToGenerator(_regenerator().m(function _callee54() {
      var unlocked, needs, _t36, _t37;
      return _regenerator().w(function (_context54) {
        while (1) switch (_context54.p = _context54.n) {
          case 0:
            unlocked = true, needs = false;
            _context54.p = 1;
            _context54.n = 2;
            return restoreSession();
          case 2:
            if (!credential) {
              _context54.n = 4;
              break;
            }
            _context54.n = 3;
            return NYXExperience.load();
          case 3:
            _context54.n = 4;
            return loadConversationHistory();
          case 4:
            NYXExperience.initMic();
            if (!credential) {
              _context54.n = 6;
              break;
            }
            _context54.n = 5;
            return enforceProfileLock();
          case 5:
            _t36 = _context54.v;
            _context54.n = 7;
            break;
          case 6:
            _t36 = true;
          case 7:
            unlocked = _t36;
            needs = Boolean(unlocked && credential && NYXExperience.needsOnboarding());
            _context54.n = 9;
            break;
          case 8:
            _context54.p = 8;
            _t37 = _context54.v;
            console.error("Nyx startup recovered from an initialization error.", _t37);
            NYXExperience.initMic();
          case 9:
            _context54.p = 9;
            clearTimeout(launchTimer);
            dismissNyxLaunch();
            return _context54.f(9);
          case 10:
            setTimeout(function () {
              try {
                if (needs) NYXExperience.onboard();else if (sessionRestoreError) showSessionRestoreRetry(sessionRestoreError);else if (!credential) unlock();else if (unlocked && NYXExperience.voiceSessionEnabled()) NYXExperience.startVoiceSession();
              } catch (e) {
                console.error("Nyx post-launch recovery.", e);
                state("ready", "Ready when you are");
              }
            }, 250);
          case 11:
            return _context54.a(2);
        }
      }, _callee54, null, [[1, 8, 9, 10]]);
    }))();
  });
})();