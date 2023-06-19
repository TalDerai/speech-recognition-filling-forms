// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
var define;


"use strict";

var dotenv = _interopRequireWildcard(require("dotenv"));

var _common = require("./utils/common.js");

var _moment = _interopRequireDefault(require("moment"));

var _crossFetch = _interopRequireDefault(require("cross-fetch"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _expressMinifyHtml = _interopRequireDefault(require("express-minify-html-2"));

var _filetToStt = require("./utils/filetToStt.js");

var _formidable = _interopRequireDefault(require("formidable"));

var _url = require("url");

var _path = require("path");

var _formGenerator = require("./utils/formGenerator.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

dotenv.config(); //import urlExists from 'url-exists-deep'

var _filename = (0, _url.fileURLToPath)(import.meta.url);

var _dirname = (0, _path.dirname)(_filename);

var app = (0, _express.default)();
app.set('view engine', 'ejs');
app.set('views', './views');
var port = 7000;
app.use((0, _cors.default)());
app.use(_bodyParser.default.json()); // to support JSON-encoded bodies

app.use(_bodyParser.default.urlencoded({
  // to support URL-encoded bodies
  extended: true
}));
app.use((0, _expressMinifyHtml.default)({
  override: true,
  exception_url: false,
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    minifyJS: true
  }
}));
app.use('/', _express.default.static(_dirname + '/public'));
app.use((0, _expressSession.default)({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
})); // login page

app.get('/login', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            try {
              res.render('login', {
                page: 'login',
                error: ''
              });
            } catch (e) {
              console.log(e.message);
              res.render('error', {
                page: 'login',
                title: 'login',
                error: e.message
              });
            }

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}()); // login operation

app.post('/login', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var _req$body, mail, password, loginUrl, respU, o, statUrl, respSt, stat;

    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body = req.body, mail = _req$body.mail, password = _req$body.password;
            loginUrl = "".concat(_common.API_PATH, "account/loginExt?").concat(_common.admin.key, "=").concat(_common.admin.id, "&mail=").concat(mail, "&password=").concat(password);
            _context2.next = 4;
            return (0, _crossFetch.default)(loginUrl);

          case 4:
            respU = _context2.sent;
            _context2.next = 7;
            return respU.json();

          case 7:
            o = _context2.sent;

            if (!(o && o.user)) {
              _context2.next = 20;
              break;
            }

            statUrl = "".concat(_common.API_PATH, "account/userStat?").concat(_common.admin.key, "=").concat(_common.admin.id, "&id=").concat(o.user.Id, "&prm=").concat(o.user.Permission);
            _context2.next = 12;
            return (0, _crossFetch.default)(statUrl);

          case 12:
            respSt = _context2.sent;
            _context2.next = 15;
            return respSt.json();

          case 15:
            stat = _context2.sent;
            req.session.data = {
              page: 'index',
              user: _objectSpread(_objectSpread({}, o.user), {}, {
                'Stat': stat,
                'Image': "".concat(_common.FILE_PATH).concat(o.user.Image.substring(1))
              }),
              desks: o.desks,
              selectedDesk: 0,
              selectedWorker: 0,
              selectedType: 'opened',
              types: _common.eTypes,
              bLinks: _common.bLinks
            };
            res.redirect('/');
            _context2.next = 21;
            break;

          case 20:
            res.render('login', {
              page: 'login',
              error: 'זיהוי משתמש נכשל'
            });

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}()); // home page

app.get('/', function (req, res) {
  if (!req.session.data) res.render('login', {
    page: 'login',
    error: ''
  });else res.render('index', _objectSpread(_objectSpread({}, req.session.data), {}, {
    page: 'index',
    title: 'ברוכים הבאים!',
    newEventParams: ''
  }));
}); // reports

app.get('/reports', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var dataUrls, respD, _desks, periods;

    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (req.session.data) {
              _context3.next = 4;
              break;
            }

            res.render('login', _objectSpread(_objectSpread({}, req.session.data), {}, {
              page: 'login',
              error: ''
            }));
            _context3.next = 13;
            break;

          case 4:
            dataUrls = "".concat(_common.API_PATH, "desks?").concat(_common.admin.key, "=").concat(_common.admin.id, "&limit=100");
            _context3.next = 7;
            return (0, _crossFetch.default)(dataUrls);

          case 7:
            respD = _context3.sent;
            _context3.next = 10;
            return respD.json();

          case 10:
            _desks = _context3.sent.items;
            periods = {
              to: (0, _moment.default)().valueOf(),
              month: (0, _moment.default)().startOf('month').valueOf(),
              quarter: (0, _moment.default)().startOf('quarter').valueOf(),
              year: (0, _moment.default)().startOf('year').valueOf(),
              all: (0, _moment.default)().add(-10, 'Y').valueOf()
            };
            res.render('reports', _objectSpread(_objectSpread({}, req.session.data), {}, {
              page: 'reports',
              title: 'מחולל דוחות',
              newEventParams: '',
              desks: _desks,
              periods: periods,
              selectedDesk: _desks[0].Id
            }));

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}()); // manual

app.get('/manual', function (req, res) {
  if (!req.session.data) res.render('login', _objectSpread(_objectSpread({}, req.session.data), {}, {
    page: 'login',
    error: ''
  }));else res.render('manual', _objectSpread(_objectSpread({}, req.session.data), {}, {
    page: 'manual',
    title: 'מדריך למשתמש',
    newEventParams: ''
  }));
}); // pages

app.get('/events', /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var _req$session$data, selectedDesk, selectedWorker, selectedType, dataUrls, respD, dw, _desks2, workers, worker, sd, sw, uEvents, respE, events;

    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (req.session.data) {
              _context4.next = 4;
              break;
            }

            res.render('login', {
              page: 'login',
              error: ''
            });
            _context4.next = 38;
            break;

          case 4:
            _context4.prev = 4;
            if (req.query.desk) req.session.data.selectedDesk = parseInt(req.query.desk);
            if (req.query.worker) req.session.data.selectedWorker = parseInt(req.query.worker);
            if (req.query.type) req.session.data.selectedType = req.query.type; //console.log(req.query.worker, typeof(req.query.worker))

            _req$session$data = req.session.data, selectedDesk = _req$session$data.selectedDesk, selectedWorker = _req$session$data.selectedWorker, selectedType = _req$session$data.selectedType;
            dataUrls = "".concat(_common.API_PATH, "dataForStt?").concat(_common.admin.key, "=").concat(_common.admin.id); //dataForFilters

            _context4.next = 12;
            return (0, _crossFetch.default)(dataUrls);

          case 12:
            respD = _context4.sent;
            _context4.next = 15;
            return respD.json();

          case 15:
            dw = _context4.sent;
            _desks2 = dw.desks;

            _desks2.unshift({
              "Id": 0,
              "Name": "כל הקופות"
            });

            workers = dw.workers;
            workers.unshift({
              "Id": 0,
              "Name1": "כל העובדים"
            });
            worker = workers.find(function (d) {
              return d.Id == selectedWorker;
            });
            sd = selectedDesk === 0 ? '' : "&desk=".concat(selectedDesk);
            sw = selectedWorker === 0 ? '' : "&worker=".concat(selectedWorker);
            uEvents = "".concat(_common.API_PATH, "events?").concat(_common.admin.key, "=").concat(_common.admin.id, "&type=").concat(selectedType).concat(sd).concat(sw, "&limit=100");
            _context4.next = 26;
            return (0, _crossFetch.default)(uEvents);

          case 26:
            respE = _context4.sent;
            _context4.next = 29;
            return respE.json();

          case 29:
            events = _context4.sent.items;
            _context4.next = 32;
            return res.render('events', _objectSpread(_objectSpread({}, req.session.data), {}, {
              page: 'events',
              title: 'אירועים',
              id: 0,
              newEventParams: '',
              desks: _desks2,
              workers: workers,
              events: events,
              eventIcon: _common.eventIcon,
              eventSummary: _common.eventSummary
            }));

          case 32:
            _context4.next = 38;
            break;

          case 34:
            _context4.prev = 34;
            _context4.t0 = _context4["catch"](4);
            console.log(_context4.t0.message);
            res.render('error', {
              page: 'events',
              title: 'אירועים',
              error: _context4.t0.message
            });

          case 38:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[4, 34]]);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
app.get('/eventCard', /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var dwUrl, respW, dataW, _desks3, workers, fUrl, respF, files, id, fileList, data, dataUrl, respD, form;

    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (req.session.data) {
              _context5.next = 4;
              break;
            }

            res.render('login', {
              page: 'login',
              error: ''
            });
            _context5.next = 43;
            break;

          case 4:
            _context5.prev = 4;
            // desk and workers
            dwUrl = "".concat(_common.API_PATH, "events/desksAndWorkers?").concat(_common.admin.key, "=").concat(_common.admin.id, "&id=").concat(req.query.id);
            _context5.next = 8;
            return (0, _crossFetch.default)(dwUrl);

          case 8:
            respW = _context5.sent;
            _context5.next = 11;
            return respW.json();

          case 11:
            dataW = _context5.sent;
            _desks3 = dataW.desks.map(function (d) {
              return {
                'v': d.Id,
                'n': d.Name
              };
            });
            workers = dataW.workers.map(function (d) {
              return {
                'v': d.Id,
                'n': d.Name
              };
            });
            fUrl = "".concat(_common.API_PATH, "events/files?").concat(_common.admin.key, "=").concat(_common.admin.id, "&id=").concat(req.query.id);
            _context5.next = 17;
            return (0, _crossFetch.default)(fUrl);

          case 17:
            respF = _context5.sent;
            _context5.next = 20;
            return respF.json();

          case 20:
            files = _context5.sent;
            id = parseInt(req.query.id);
            fileList = (0, _common.renderFileList)(files, id); // card data

            if (!(id === 0 && req.query.isDep)) {
              _context5.next = 27;
              break;
            }

            data = _objectSpread({}, (0, _common.newEvent)(req, _desks3, workers));
            _context5.next = 34;
            break;

          case 27:
            dataUrl = "".concat(_common.API_PATH, "events/card?").concat(_common.admin.key, "=").concat(_common.admin.id, "&id=").concat(id);
            _context5.next = 30;
            return (0, _crossFetch.default)(dataUrl);

          case 30:
            respD = _context5.sent;
            _context5.next = 33;
            return respD.json();

          case 33:
            data = _context5.sent;

          case 34:
            data = _objectSpread(_objectSpread({}, data), {}, {
              desks: _desks3,
              workers: workers,
              files: files
            });
            form = new _formGenerator.myForm('event', data); //console.log(data)

            res.render('eventCard', _objectSpread(_objectSpread({}, req.session.data), {}, {
              page: 'eventCard',
              title: id === 0 ? 'אירוע חדש' : "\u05D0\u05D9\u05E8\u05D5\u05E2 ".concat(id),
              id: id,
              newEventParams: "&worker=".concat(data.WorkerId, "&desk=").concat(data.DeskId),
              fileList: fileList,
              form: [form.render(0), form.render(1)],
              isDep: data.Amount > 0,
              message: !req.query.msg ? '' : req.query.msg == '1' ? {
                tp: 'success',
                txt: 'הפעולה בוצעה בהצלחה'
              } : {
                tp: 'danger',
                txt: 'שגיאה'
              }
            }));
            _context5.next = 43;
            break;

          case 39:
            _context5.prev = 39;
            _context5.t0 = _context5["catch"](4);
            console.log(_context5.t0.message);
            res.render('error', {
              page: 'eventCard',
              title: "\u05D0\u05D9\u05E8\u05D5\u05E2 ".concat(req.query.id),
              error: _context5.t0.message
            });

          case 43:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[4, 39]]);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
app.get('/eventFiles', /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var fUrl, respF, files, fileList;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (req.session.data) {
              _context6.next = 4;
              break;
            }

            res.render('login', {
              page: 'login',
              error: ''
            });
            _context6.next = 20;
            break;

          case 4:
            _context6.prev = 4;
            fUrl = "".concat(_common.API_PATH, "events/files?").concat(_common.admin.key, "=").concat(_common.admin.id, "&id=").concat(req.query.id);
            _context6.next = 8;
            return (0, _crossFetch.default)(fUrl);

          case 8:
            respF = _context6.sent;
            _context6.next = 11;
            return respF.json();

          case 11:
            files = _context6.sent;
            fileList = (0, _common.renderFileList)(files, parseInt(req.query.id));
            res.json({
              files: fileList
            });
            _context6.next = 20;
            break;

          case 16:
            _context6.prev = 16;
            _context6.t0 = _context6["catch"](4);
            console.log(_context6.t0.message);
            res.json({
              page: 'eventFiles',
              title: "\u05D0\u05D9\u05E8\u05D5\u05E2 ".concat(req.query.id),
              error: _context6.t0.message
            });

          case 20:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[4, 16]]);
  }));

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());
app.post('/eventCard', /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var action, dataUrl, body, respD, result, id;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            if (req.session.data) {
              _context7.next = 4;
              break;
            }

            res.render('login', {
              page: 'login',
              error: ''
            });
            _context7.next = 21;
            break;

          case 4:
            _context7.prev = 4;
            action = parseInt(req.body.Id) === 0 ? 'create' : 'update';
            dataUrl = "".concat(_common.API_PATH, "events/").concat(action, "?").concat(_common.admin.key, "=").concat(_common.admin.id);
            body = JSON.stringify(_objectSpread(_objectSpread({}, req.body), {}, {
              Amount: (req.body.EventType === 'הפקדה' ? 1 : -1) * req.body.Amount,
              Date: (0, _moment.default)(req.body.Date, 'YYYY-MM-DD').format('DD/MM/YYYY'),
              CloseDate: (0, _moment.default)(req.body.CloseDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
            }));
            _context7.next = 10;
            return (0, _crossFetch.default)(dataUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: body
            });

          case 10:
            respD = _context7.sent;
            _context7.next = 13;
            return respD.json();

          case 13:
            result = _context7.sent;

            if (result.error) {
              console.log(result.error);
              res.redirect("/eventCard?id=".concat(req.body.Id, "&msg=0"));
            } else {
              id = parseInt(req.body.Id) === 0 ? result.lastID : req.body.Id;
              res.redirect("/eventCard?id=".concat(id, "&msg=1"));
            }

            _context7.next = 21;
            break;

          case 17:
            _context7.prev = 17;
            _context7.t0 = _context7["catch"](4);
            console.log(_context7.t0.message);
            res.render('error', {
              page: 'eventCard',
              title: "\u05D0\u05D9\u05E8\u05D5\u05E2 ".concat(req.query.id),
              error: _context7.t0.message
            });

          case 21:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[4, 17]]);
  }));

  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}());
app.get('/desks', /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var dataUrls, respD, _desks4;

    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (req.session.data) {
              _context8.next = 4;
              break;
            }

            res.render('login', {
              page: 'login',
              error: ''
            });
            _context8.next = 19;
            break;

          case 4:
            _context8.prev = 4;
            dataUrls = "".concat(_common.API_PATH, "desks?").concat(_common.admin.key, "=").concat(_common.admin.id, "&limit=100");
            _context8.next = 8;
            return (0, _crossFetch.default)(dataUrls);

          case 8:
            respD = _context8.sent;
            _context8.next = 11;
            return respD.json();

          case 11:
            _desks4 = _context8.sent.items;
            res.render('desks', _objectSpread(_objectSpread({}, req.session.data), {}, {
              page: 'desks',
              title: 'קופות',
              id: 0,
              newEventParams: '',
              desks: _desks4
            }));
            _context8.next = 19;
            break;

          case 15:
            _context8.prev = 15;
            _context8.t0 = _context8["catch"](4);
            console.log(_context8.t0.message);
            res.render('error', {
              page: 'desks',
              title: 'קופות',
              error: _context8.t0.message
            });

          case 19:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[4, 15]]);
  }));

  return function (_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}());
app.get('/deskCard', /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var data, dataUrl, respD, form, id;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            if (req.session.data) {
              _context9.next = 4;
              break;
            }

            res.render('login', {
              page: 'login',
              error: ''
            });
            _context9.next = 25;
            break;

          case 4:
            _context9.prev = 4;

            if (!(parseInt(req.query.id) === 0)) {
              _context9.next = 9;
              break;
            }

            data = _objectSpread({}, _common.newDesk);
            _context9.next = 16;
            break;

          case 9:
            dataUrl = "".concat(_common.API_PATH, "desks/card?").concat(_common.admin.key, "=").concat(_common.admin.id, "&id=").concat(req.query.id);
            _context9.next = 12;
            return (0, _crossFetch.default)(dataUrl);

          case 12:
            respD = _context9.sent;
            _context9.next = 15;
            return respD.json();

          case 15:
            data = _context9.sent;

          case 16:
            form = new _formGenerator.myForm('desk', data);
            id = parseInt(req.query.id);
            res.render('deskCard', _objectSpread(_objectSpread({}, req.session.data), {}, {
              page: 'deskCard',
              id: id,
              title: "\u05E7\u05D5\u05E4\u05D4 ".concat(id === 0 ? 'חדשה' : id),
              newEventParams: "&desk=".concat(id),
              form: form.render(),
              message: !req.query.msg ? '' : req.query.msg == '1' ? {
                tp: 'success',
                txt: 'הפעולה בוצעה בהצלחה'
              } : {
                tp: 'danger',
                txt: 'שגיאה'
              }
            }));
            _context9.next = 25;
            break;

          case 21:
            _context9.prev = 21;
            _context9.t0 = _context9["catch"](4);
            console.log(_context9.t0.message);
            res.render('error', {
              page: 'deskCard',
              title: "\u05E7\u05D5\u05E4\u05D4 ".concat(req.query.id),
              error: _context9.t0.message
            });

          case 25:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[4, 21]]);
  }));

  return function (_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}());
app.post('/deskCard', /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var action, dataUrl, body, respD, result, id;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            if (req.session.data) {
              _context10.next = 4;
              break;
            }

            res.render('login', {
              page: 'login',
              error: ''
            });
            _context10.next = 21;
            break;

          case 4:
            _context10.prev = 4;
            action = parseInt(req.body.Id) === 0 ? 'create' : 'update';
            dataUrl = "".concat(_common.API_PATH, "desks/").concat(action, "?").concat(_common.admin.key, "=").concat(_common.admin.id);
            body = JSON.stringify(_objectSpread(_objectSpread({}, req.body), {}, {
              StartDate: (0, _moment.default)(req.body.StartDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
            }));
            _context10.next = 10;
            return (0, _crossFetch.default)(dataUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: body
            });

          case 10:
            respD = _context10.sent;
            _context10.next = 13;
            return respD.json();

          case 13:
            result = _context10.sent;

            if (result.error) {
              console.log(result.error);
              res.redirect("/deskCard?id=".concat(req.body.Id, "&msg=0"));
            } else {
              id = parseInt(req.body.Id) === 0 ? result.lastID : req.body.Id;
              res.redirect("/deskCard?id=".concat(id, "&msg=1"));
            }

            _context10.next = 21;
            break;

          case 17:
            _context10.prev = 17;
            _context10.t0 = _context10["catch"](4);
            console.log(_context10.t0.message);
            res.render('error', {
              page: 'deskCard',
              title: "\u05E7\u05D5\u05E4\u05D4 ".concat(req.query.id),
              error: _context10.t0.message
            });

          case 21:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[4, 17]]);
  }));

  return function (_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}());
app.get('/workerCard', /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var data, dataUrl, respD, form, id;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            if (req.session.data) {
              _context11.next = 4;
              break;
            }

            res.render('login', {
              page: 'login',
              error: ''
            });
            _context11.next = 25;
            break;

          case 4:
            _context11.prev = 4;

            if (!(parseInt(req.query.id) === 0)) {
              _context11.next = 9;
              break;
            }

            data = _objectSpread({}, _common.newWorker);
            _context11.next = 16;
            break;

          case 9:
            dataUrl = "".concat(_common.API_PATH, "workers/card?").concat(_common.admin.key, "=").concat(_common.admin.id, "&id=").concat(req.query.id);
            _context11.next = 12;
            return (0, _crossFetch.default)(dataUrl);

          case 12:
            respD = _context11.sent;
            _context11.next = 15;
            return respD.json();

          case 15:
            data = _context11.sent;

          case 16:
            //console.log(data)
            form = new _formGenerator.myForm('worker', data);
            id = parseInt(req.query.id);
            res.render('deskCard', _objectSpread(_objectSpread({}, req.session.data), {}, {
              page: 'workerCard',
              title: id === 0 ? 'עובד חדש' : "\u05E2\u05D5\u05D1\u05D3 ".concat(req.query.id),
              id: id,
              newEventParams: "&worker=".concat(id),
              form: form.render(),
              message: !req.query.msg ? '' : req.query.msg == '1' ? {
                tp: 'success',
                txt: 'הפעולה בוצעה בהצלחה'
              } : {
                tp: 'danger',
                txt: 'שגיאה'
              }
            }));
            _context11.next = 25;
            break;

          case 21:
            _context11.prev = 21;
            _context11.t0 = _context11["catch"](4);
            console.log(_context11.t0.message);
            res.render('error', {
              page: 'workerCard',
              title: "\u05E2\u05D5\u05D1\u05D3 ".concat(req.query.id),
              error: _context11.t0.message
            });

          case 25:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[4, 21]]);
  }));

  return function (_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}());
app.post('/workerCard', /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(req, res) {
    var action, dataUrl, body, respD, result, id;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            if (req.session.data) {
              _context12.next = 4;
              break;
            }

            res.render('login', {
              page: 'login',
              error: ''
            });
            _context12.next = 21;
            break;

          case 4:
            _context12.prev = 4;
            action = parseInt(req.body.Id) === 0 ? 'create' : 'update';
            dataUrl = "".concat(_common.API_PATH, "workers/").concat(action, "?").concat(_common.admin.key, "=").concat(_common.admin.id);
            body = JSON.stringify(_objectSpread({}, req.body));
            _context12.next = 10;
            return (0, _crossFetch.default)(dataUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: body
            });

          case 10:
            respD = _context12.sent;
            _context12.next = 13;
            return respD.json();

          case 13:
            result = _context12.sent;

            if (result.error) {
              console.log(result.error);
              res.redirect("/workerCard?id=".concat(req.body.Id, "&msg=0"));
            } else {
              id = parseInt(req.body.Id) === 0 ? result.lastID : req.body.Id;
              res.redirect("/workerCard?id=".concat(id, "&msg=1"));
            }

            _context12.next = 21;
            break;

          case 17:
            _context12.prev = 17;
            _context12.t0 = _context12["catch"](4);
            console.log(_context12.t0.message);
            res.render('error', {
              page: 'workerCard',
              title: "\u05E2\u05D5\u05D1\u05D3 ".concat(req.query.id),
              error: _context12.t0.message
            });

          case 21:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[4, 17]]);
  }));

  return function (_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}());
app.get('/workers', /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(req, res) {
    var uWorkers, respW, workers;
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            if (req.session.data) {
              _context13.next = 4;
              break;
            }

            res.render('login', {
              page: 'login',
              error: ''
            });
            _context13.next = 19;
            break;

          case 4:
            _context13.prev = 4;
            uWorkers = "".concat(_common.API_PATH, "workers?").concat(_common.admin.key, "=").concat(_common.admin.id, "&limit=200");
            _context13.next = 8;
            return (0, _crossFetch.default)(uWorkers);

          case 8:
            respW = _context13.sent;
            _context13.next = 11;
            return respW.json();

          case 11:
            workers = _context13.sent.items;
            res.render('workers', _objectSpread(_objectSpread({}, req.session.data), {}, {
              page: 'workers',
              title: 'עובדים',
              id: 0,
              newEventParams: '',
              workers: workers,
              workerCategory: _common.workerCategory,
              fullName: _common.fullName
            }));
            _context13.next = 19;
            break;

          case 15:
            _context13.prev = 15;
            _context13.t0 = _context13["catch"](4);
            console.log(_context13.t0.message);
            res.render('error', {
              page: 'workers',
              title: 'עובדים',
              error: _context13.t0.message
            });

          case 19:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[4, 15]]);
  }));

  return function (_x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}()); // search
//const url = `/api/desks?limit=${initState.size}&skip=${skip}&arc=${state.arc}&sort=${state.sort}&dir=${state.dir}&key=${state.key}`

app.get('/search', /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(req, res) {
    var _req$query$type, type, key, url, resp, data, st, pageData;

    return _regeneratorRuntime().wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            if (req.session.data) {
              _context14.next = 4;
              break;
            }

            res.render('login', {
              page: 'login',
              error: ''
            });
            _context14.next = 24;
            break;

          case 4:
            _context14.prev = 4;
            type = (_req$query$type = req.query.type) !== null && _req$query$type !== void 0 ? _req$query$type : 'events';
            key = req.query.key;
            url = "".concat(_common.API_PATH).concat(type, "?").concat(_common.admin.key, "=").concat(_common.admin.id, "&limit=200&key=").concat(key);
            _context14.next = 10;
            return (0, _crossFetch.default)(url);

          case 10:
            resp = _context14.sent;
            _context14.next = 13;
            return resp.json();

          case 13:
            data = _context14.sent;
            st = 'חיפוש';
            pageData = _objectSpread(_objectSpread({}, req.session.data), {}, {
              page: 'search',
              title: "".concat(st, " - ").concat(_common.dic[type]),
              id: 0,
              newEventParams: '',
              type: type,
              key: key,
              amount: data.items.length,
              workerCategory: _common.workerCategory,
              fullName: _common.fullName,
              eventIcon: _common.eventIcon,
              eventSummary: _common.eventSummary
            });
            pageData[type] = data.items;
            res.render('search', pageData);
            _context14.next = 24;
            break;

          case 20:
            _context14.prev = 20;
            _context14.t0 = _context14["catch"](4);
            console.log(_context14.t0.message);
            res.render('error', {
              page: 'search',
              title: 'תוצאות חיפוש',
              error: _context14.t0.message
            });

          case 24:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[4, 20]]);
  }));

  return function (_x27, _x28) {
    return _ref14.apply(this, arguments);
  };
}());
/* app.get('/loginExt', async (req, res) => {
    try {
        const url = `${API_PATH}/api/account/loginExt/?alex=1&mail=alex@k.com&password=123`
        const resp = await fetch(url)
        const result = (await resp.json())
        res.json(result)
    } catch (e) {
        console.log(e.message)
        res.json({ page: 'login', title: 'login', error: e.message })
    }
}) */

app.get('/logout', /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(req, res) {
    return _regeneratorRuntime().wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            req.session.destroy(function () {
              res.redirect('/login');
            });

          case 1:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function (_x29, _x30) {
    return _ref15.apply(this, arguments);
  };
}());
app.get('/proxy_get/*', /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16(req, res) {
    var base, url, resp, result;
    return _regeneratorRuntime().wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            base = _common.API_PATH.slice(0, -1);
            url = req.originalUrl.replace('/proxy_get', base);
            _context16.next = 4;
            return (0, _crossFetch.default)(url);

          case 4:
            resp = _context16.sent;
            _context16.next = 7;
            return resp.json();

          case 7:
            result = _context16.sent;
            res.json(result);

          case 9:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function (_x31, _x32) {
    return _ref16.apply(this, arguments);
  };
}()); // voice commands

app.get('/test', function (req, res) {
  res.render('voiceTest', {
    page: 'voiceTest',
    error: ''
  });
});
app.get('/voice', /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17(req, res) {
    return _regeneratorRuntime().wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            res.render('voice', {
              page: 'voice',
              error: ''
            });

          case 1:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));

  return function (_x33, _x34) {
    return _ref17.apply(this, arguments);
  };
}());
var finder = null;
app.post('/stt', /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee19(req, res) {
    var form;
    return _regeneratorRuntime().wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            if (finder) {
              _context19.next = 4;
              break;
            }

            _context19.next = 3;
            return (0, _common.createFinderIndex)();

          case 3:
            finder = _context19.sent;

          case 4:
            form = new _formidable.default.IncomingForm();
            form.parse(req, /*#__PURE__*/function () {
              var _ref19 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18(err, fields, file) {
                var transcript, actions;
                return _regeneratorRuntime().wrap(function _callee18$(_context18) {
                  while (1) {
                    switch (_context18.prev = _context18.next) {
                      case 0:
                        _context18.next = 2;
                        return (0, _filetToStt.fileToStt)(file.file.filepath);

                      case 2:
                        transcript = _context18.sent;
                        actions = finder.find(transcript);
                        res.json({
                          src: transcript,
                          act: actions
                        });

                      case 5:
                      case "end":
                        return _context18.stop();
                    }
                  }
                }, _callee18);
              }));

              return function (_x37, _x38, _x39) {
                return _ref19.apply(this, arguments);
              };
            }());

          case 6:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19);
  }));

  return function (_x35, _x36) {
    return _ref18.apply(this, arguments);
  };
}());
app.get('/sttFromTranscript', /*#__PURE__*/function () {
  var _ref20 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee20(req, res) {
    var transcript, actions;
    return _regeneratorRuntime().wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            if (finder) {
              _context20.next = 4;
              break;
            }

            _context20.next = 3;
            return (0, _common.createFinderIndex)();

          case 3:
            finder = _context20.sent;

          case 4:
            transcript = req.query.text;
            actions = finder.find(transcript);
            res.json({
              src: transcript,
              act: actions
            });

          case 7:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20);
  }));

  return function (_x40, _x41) {
    return _ref20.apply(this, arguments);
  };
}());
var desks = null;
app.post('/sttFormTest', /*#__PURE__*/function () {
  var _ref21 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee22(req, res) {
    var form;
    return _regeneratorRuntime().wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            if (!desks) {//
            }

            form = new _formidable.default.IncomingForm();
            form.parse(req, /*#__PURE__*/function () {
              var _ref22 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee21(err, fields, file) {
                var transcript, result;
                return _regeneratorRuntime().wrap(function _callee21$(_context21) {
                  while (1) {
                    switch (_context21.prev = _context21.next) {
                      case 0:
                        _context21.next = 2;
                        return (0, _filetToStt.fileToStt)(file.file.filepath);

                      case 2:
                        transcript = _context21.sent;
                        result = (0, _common.checkFormField)(transcript);
                        res.json(_objectSpread({}, result));

                      case 5:
                      case "end":
                        return _context21.stop();
                    }
                  }
                }, _callee21);
              }));

              return function (_x44, _x45, _x46) {
                return _ref22.apply(this, arguments);
              };
            }());

          case 3:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22);
  }));

  return function (_x42, _x43) {
    return _ref21.apply(this, arguments);
  };
}());
app.listen(port, function () {
  console.log('Server started on: ' + port);
});
},{}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65499" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/index.js.map