var setup = function () {
  setenv("t", stash33({["symbol"]: true}));
  setenv("js?", stash33({["symbol"]: ["is", "target*", ["quote", "js"]]}));
  setenv("lua?", stash33({["symbol"]: ["is", "target*", ["quote", "lua"]]}));
  var _x4 = ["target"];
  _x4.lua = "_G";
  _x4.js = ["if", ["nil?", "global"], "window", "global"];
  setenv("global*", stash33({["symbol"]: _x4}));
  var _37compile_time__macro = function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    compiler.eval(join(["do"], forms));
    return undefined;
  };
  setenv("%compile-time", stash33({["macro"]: _37compile_time__macro}));
  var when_compiling__macro = function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    return compiler.eval(join(["do"], body));
  };
  setenv("when-compiling", stash33({["macro"]: when_compiling__macro}));
  var during_compilation__macro = function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    var form = join(["do"], body);
    compiler.eval(form);
    return form;
  };
  setenv("during-compilation", stash33({["macro"]: during_compilation__macro}));
  var _37js__macro = function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    if (target42 === "js") {
      return join(["do"], forms);
    }
  };
  setenv("%js", stash33({["macro"]: _37js__macro}));
  var _37lua__macro = function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    if (target42 === "lua") {
      return join(["do"], forms);
    }
  };
  setenv("%lua", stash33({["macro"]: _37lua__macro}));
  var quote__macro = function (form) {
    return quoted(form);
  };
  setenv("quote", stash33({["macro"]: quote__macro}));
  var quasiquote__macro = function (form) {
    return quasiexpand(form, 1);
  };
  setenv("quasiquote", stash33({["macro"]: quasiquote__macro}));
  var at__macro = function (l, i) {
    if (typeof(i) === "number" && i < 0) {
      if (typeof(l) === "object") {
        return ["let", "l", l, ["at", "l", i]];
      }
      i = ["+", ["len", l], i];
    }
    if (target42 === "lua") {
      if (typeof(i) === "number") {
        i = i + 1;
      } else {
        i = ["+", i, 1];
      }
    }
    return ["get", l, i];
  };
  setenv("at", stash33({["macro"]: at__macro}));
  var wipe__macro = function (place) {
    if (target42 === "lua") {
      return ["assign", place, "nil"];
    } else {
      return ["%delete", place];
    }
  };
  setenv("wipe", stash33({["macro"]: wipe__macro}));
  var list__macro = function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    var x = uniq("x");
    var l = [];
    var forms = [];
    var _l = body;
    var k = undefined;
    for (k in _l) {
      var v = _l[k];
      var _e3;
      if (numeric63(k)) {
        _e3 = parseInt(k);
      } else {
        _e3 = k;
      }
      var _k = _e3;
      if (typeof(_k) === "number") {
        l[_k] = v;
      } else {
        add(forms, ["assign", ["get", x, ["quote", _k]], v]);
      }
    }
    if ((forms.length || 0) > 0) {
      return join(["let", x, join(["%array"], l)], forms, [x]);
    } else {
      return join(["%array"], l);
    }
  };
  setenv("list", stash33({["macro"]: list__macro}));
  var xform__macro = function (l, body) {
    return ["map", ["%fn", ["do", body]], l];
  };
  setenv("xform", stash33({["macro"]: xform__macro}));
  var if__macro = function () {
    var branches = unstash(Array.prototype.slice.call(arguments, 0));
    return expand_if(branches)[0];
  };
  setenv("if", stash33({["macro"]: if__macro}));
  var case__macro = function (x) {
    var _r6 = unstash(Array.prototype.slice.call(arguments, 1));
    var clauses = cut(_r6, 0);
    var e = uniq("e");
    var bs = map(function (_x30) {
      var a = _x30[0];
      var b = _x30[1];
      if (typeof(b) === "undefined" || b === null) {
        return [a];
      } else {
        return [["is", a, e], b];
      }
    }, pair(clauses));
    return ["let", [e, x], join(["if"], apply(join, bs))];
  };
  setenv("case", stash33({["macro"]: case__macro}));
  var when__macro = function (cond) {
    var _r8 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r8, 0);
    return ["if", cond, join(["do"], body)];
  };
  setenv("when", stash33({["macro"]: when__macro}));
  var unless__macro = function (cond) {
    var _r9 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r9, 0);
    return ["if", ["not", cond], join(["do"], body)];
  };
  setenv("unless", stash33({["macro"]: unless__macro}));
  var assert__macro = function (cond) {
    var x = "assert: " + str(cond);
    return ["unless", cond, ["error", ["quote", x]]];
  };
  setenv("assert", stash33({["macro"]: assert__macro}));
  var obj__macro = function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    return join(["%object"], mapo(function (_) {
      return _;
    }, body));
  };
  setenv("obj", stash33({["macro"]: obj__macro}));
  var let__macro = function (bs) {
    var _r12 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r12, 0);
    if (toplevel63()) {
      add(environment42, {});
      var _x46 = macroexpand(join(["let", bs], body));
      drop(environment42);
      return _x46;
    }
    if (!( typeof(bs) === "object")) {
      return join(["let", [bs, body[0]]], cut(body, 1));
    } else {
      if ((bs.length || 0) === 0) {
        return join(["do"], body);
      } else {
        var lh = bs[0];
        var rh = bs[1];
        var bs2 = cut(bs, 2);
        var _id6 = bind(lh, rh);
        var id = _id6[0];
        var val = _id6[1];
        var bs1 = cut(_id6, 2);
        var renames = [];
        if (bound63(id) || toplevel63()) {
          var id1 = uniq(id);
          renames = [id, id1];
          id = id1;
        } else {
          setenv(id, stash33({["variable"]: true}));
        }
        return ["do", ["%local", id, val], ["w/sym", renames, join(["let", join(bs1, bs2)], body)]];
      }
    }
  };
  setenv("let", stash33({["macro"]: let__macro}));
  var _61__macro = function () {
    var l = unstash(Array.prototype.slice.call(arguments, 0));
    var _e = l.length || 0;
    if (0 === _e) {
      return undefined;
    } else {
      if (1 === _e) {
        return join(["="], l, ["nil"]);
      } else {
        if (2 === _e) {
          var lh = l[0];
          var rh = l[1];
          if (!( typeof(lh) === "object") || lh[0] === "at" || lh[0] === "get") {
            return ["assign", lh, rh];
          } else {
            var vars = [];
            var forms = bind(lh, rh, vars);
            return join(["do"], map(function (_) {
              return ["var", _];
            }, vars), map(function (_x61) {
              var id = _x61[0];
              var val = _x61[1];
              return ["=", id, val];
            }, pair(forms)));
          }
        } else {
          return join(["do"], map(function (_) {
            return join(["="], _);
          }, pair(l)));
        }
      }
    }
  };
  setenv("=", stash33({["macro"]: _61__macro}));
  var with__macro = function (x, v) {
    var _r16 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r16, 0);
    return join(["let", [x, v]], body, [x]);
  };
  setenv("with", stash33({["macro"]: with__macro}));
  var iflet__macro = function (_var, expr, _then) {
    var _r17 = unstash(Array.prototype.slice.call(arguments, 3));
    var rest = cut(_r17, 0);
    if (!( typeof(_var) === "object")) {
      return ["let", _var, expr, join(["if", _var, _then], rest)];
    } else {
      var gv = uniq("if");
      return ["let", gv, expr, join(["if", gv, ["let", [_var, gv], _then]], rest)];
    }
  };
  setenv("iflet", stash33({["macro"]: iflet__macro}));
  var whenlet__macro = function (_var, expr) {
    var _r18 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r18, 0);
    return ["iflet", _var, expr, join(["do"], body)];
  };
  setenv("whenlet", stash33({["macro"]: whenlet__macro}));
  var do1__macro = function (x) {
    var _r19 = unstash(Array.prototype.slice.call(arguments, 1));
    var ys = cut(_r19, 0);
    var g = uniq("do");
    return join(["let", g, x], ys, [g]);
  };
  setenv("do1", stash33({["macro"]: do1__macro}));
  var _37define__macro = function (kind, name, x) {
    var _r20 = unstash(Array.prototype.slice.call(arguments, 3));
    var _e4;
    var _x78 = _r20.eval;
    if (typeof(_x78) === "undefined" || _x78 === null) {
      _e4 = undefined;
    } else {
      _e4 = _r20.eval;
    }
    var self_evaluating63 = _e4;
    var body = cut(_r20, 0);
    var label = name + "--" + kind;
    var _e5;
    if ((body.length || 0) === 0) {
      _e5 = ["quote", x];
    } else {
      var _x80 = ["fn", x];
      _x80.name = label;
      _e5 = join(_x80, body);
    }
    var expansion = _e5;
    var form = join(["setenv", ["quote", name]], {[kind]: expansion}, keys(body));
    if (self_evaluating63) {
      return ["during-compilation", form];
    } else {
      return form;
    }
  };
  setenv("%define", stash33({["macro"]: _37define__macro}));
  var mac__macro = function (name, args) {
    var _r21 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r21, 0);
    return join(["%define", "macro", name, args], body);
  };
  setenv("mac", stash33({["macro"]: mac__macro}));
  var defspecial__macro = function (name, args) {
    var _r22 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r22, 0);
    return join(["%define", "special", name, args], body);
  };
  setenv("defspecial", stash33({["macro"]: defspecial__macro}));
  var deftransformer__macro = function (name, form) {
    var _r23 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r23, 0);
    return join(["%define", "transformer", name, [form]], body);
  };
  setenv("deftransformer", stash33({["macro"]: deftransformer__macro}));
  var defsym__macro = function (name, expansion) {
    var _r24 = unstash(Array.prototype.slice.call(arguments, 2));
    var props = cut(_r24, 0);
    return join(["%define", "symbol", name, expansion], keys(props));
  };
  setenv("defsym", stash33({["macro"]: defsym__macro}));
  var var__macro = function (name, x) {
    var _r25 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r25, 0);
    setenv(name, stash33({["variable"]: true}));
    if ((body.length || 0) > 0) {
      return join(["%local-function", name], bind42(x, body));
    } else {
      return ["%local", name, x];
    }
  };
  setenv("var", stash33({["macro"]: var__macro}));
  var def__macro = function (name, x) {
    var _r26 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r26, 0);
    setenv(name, stash33({["toplevel"]: true, ["variable"]: true}));
    if ((body.length || 0) > 0) {
      return join(["%global-function", name], bind42(x, body));
    } else {
      return ["=", name, x];
    }
  };
  setenv("def", stash33({["macro"]: def__macro}));
  var w47frame__macro = function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    var x = uniq("x");
    return ["do", ["add", "environment*", ["obj"]], ["with", x, join(["do"], body), ["drop", "environment*"]]];
  };
  setenv("w/frame", stash33({["macro"]: w47frame__macro}));
  var w47bindings__macro = function (_x99) {
    var names = _x99[0];
    var _r27 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r27, 0);
    var x = uniq("x");
    var _x102 = ["setenv", x];
    _x102.variable = true;
    return join(["w/frame", ["each", x, names, _x102]], body);
  };
  setenv("w/bindings", stash33({["macro"]: w47bindings__macro}));
  var w47mac__macro = function (name, args, definition) {
    var _r28 = unstash(Array.prototype.slice.call(arguments, 3));
    var body = cut(_r28, 0);
    add(environment42, {});
    var _x103 = macroexpand(join(["do", ["%compile-time", ["mac", name, args, definition]]], body));
    drop(environment42);
    return _x103;
  };
  setenv("w/mac", stash33({["macro"]: w47mac__macro}));
  var w47sym__macro = function (expansions) {
    var _r29 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r29, 0);
    if (!( typeof(expansions) === "object")) {
      return join(["w/sym", [expansions, body[0]]], cut(body, 1));
    } else {
      add(environment42, {});
      var _x109 = macroexpand(join(["do", join(["%compile-time"], map(function (_) {
        return join(["defsym"], _);
      }, pair(expansions)))], body));
      drop(environment42);
      return _x109;
    }
  };
  setenv("w/sym", stash33({["macro"]: w47sym__macro}));
  var w47uniq__macro = function (names) {
    var _r31 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r31, 0);
    if (!( typeof(names) === "object")) {
      names = [names];
    }
    return join(["let", apply(join, map(function (_) {
      return [_, ["uniq", ["quote", _]]];
    }, names))], body);
  };
  setenv("w/uniq", stash33({["macro"]: w47uniq__macro}));
  var fn__macro = function (args) {
    var _r33 = unstash(Array.prototype.slice.call(arguments, 1));
    var name = _r33.name;
    var body = cut(_r33, 0);
    if (typeof(name) === "undefined" || name === null) {
      return join(["%function"], bind42(args, body));
    } else {
      return ["do", join(["%local-function", name], bind42(args, body)), name];
    }
  };
  setenv("fn", stash33({["macro"]: fn__macro}));
  var guard__macro = function (expr) {
    if (target42 === "js") {
      return [["%fn", ["%try", ["list", "t", expr]]]];
    } else {
      var x = uniq("x");
      var msg = uniq("msg");
      var trace = uniq("trace");
      return ["let", [x, "nil", msg, "nil", trace, "nil"], ["if", ["xpcall", ["%fn", ["=", x, expr]], ["%fn", ["do", ["=", msg, ["clip", "_", ["+", ["search", "_", "\": \""], 2]]], ["=", trace, [["get", "debug", ["quote", "traceback"]]]]]]], ["list", "t", x], ["list", false, msg, trace]]];
    }
  };
  setenv("guard", stash33({["macro"]: guard__macro}));
  var for__macro = function (i, n) {
    var _r35 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r35, 0);
    return ["let", i, 0, join(["while", ["<", i, n]], body, [["++", i]])];
  };
  setenv("for", stash33({["macro"]: for__macro}));
  var step__macro = function (v, l) {
    var _r36 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r36, 0);
    var index = _r36.index;
    var _e6;
    if (typeof(index) === "undefined" || index === null) {
      _e6 = uniq("i");
    } else {
      _e6 = index;
    }
    var i = _e6;
    if (i === true) {
      i = "index";
    }
    var x = uniq("x");
    var n = uniq("n");
    return ["let", [x, l, n, ["len", x]], ["for", i, n, join(["let", [v, ["at", x, i]]], body)]];
  };
  setenv("step", stash33({["macro"]: step__macro}));
  var each__macro = function (x, lst) {
    var _r37 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r37, 0);
    var l = uniq("l");
    var n = uniq("n");
    var i = uniq("i");
    var _e7;
    if (!( typeof(x) === "object")) {
      _e7 = [i, x];
    } else {
      var _e8;
      if ((x.length || 0) > 1) {
        _e8 = x;
      } else {
        _e8 = [i, x[0]];
      }
      _e7 = _e8;
    }
    var _id29 = _e7;
    var k = _id29[0];
    var v = _id29[1];
    var _e9;
    if (target42 === "lua") {
      _e9 = body;
    } else {
      _e9 = [join(["let", k, ["if", ["numeric?", k], ["parseInt", k], k]], body)];
    }
    return ["let", [l, lst, k, "nil"], ["%for", l, k, join(["let", [v, ["get", l, k]]], _e9)]];
  };
  setenv("each", stash33({["macro"]: each__macro}));
  var set_of__macro = function () {
    var xs = unstash(Array.prototype.slice.call(arguments, 0));
    var l = [];
    var _l1 = xs;
    var _i1 = undefined;
    for (_i1 in _l1) {
      var x = _l1[_i1];
      var _e10;
      if (numeric63(_i1)) {
        _e10 = parseInt(_i1);
      } else {
        _e10 = _i1;
      }
      var __i1 = _e10;
      l[x] = true;
    }
    return join(["obj"], l);
  };
  setenv("set-of", stash33({["macro"]: set_of__macro}));
  var language__macro = function () {
    return ["quote", target42];
  };
  setenv("language", stash33({["macro"]: language__macro}));
  var target__macro = function () {
    var clauses = unstash(Array.prototype.slice.call(arguments, 0));
    return clauses[target42];
  };
  setenv("target", stash33({["macro"]: target__macro}));
  var join33__macro = function (a) {
    var _r39 = unstash(Array.prototype.slice.call(arguments, 1));
    var bs = cut(_r39, 0);
    return ["=", a, join(["join", a], bs)];
  };
  setenv("join!", stash33({["macro"]: join33__macro}));
  var cat33__macro = function (a) {
    var _r40 = unstash(Array.prototype.slice.call(arguments, 1));
    var bs = cut(_r40, 0);
    return ["=", a, join(["cat", a], bs)];
  };
  setenv("cat!", stash33({["macro"]: cat33__macro}));
  var _4343__macro = function (n, by) {
    return ["=", n, ["+", n, by || 1]];
  };
  setenv("++", stash33({["macro"]: _4343__macro}));
  var ____macro = function (n, by) {
    return ["=", n, ["-", n, by || 1]];
  };
  setenv("--", stash33({["macro"]: ____macro}));
  var export__macro = function () {
    var names = unstash(Array.prototype.slice.call(arguments, 0));
    if (target42 === "js") {
      return join(["do"], map(function (_) {
        return ["=", ["get", "exports", ["quote", _]], _];
      }, names));
    } else {
      var x = {};
      var _l2 = names;
      var _i2 = undefined;
      for (_i2 in _l2) {
        var k = _l2[_i2];
        var _e11;
        if (numeric63(_i2)) {
          _e11 = parseInt(_i2);
        } else {
          _e11 = _i2;
        }
        var __i2 = _e11;
        x[k] = k;
      }
      return ["return", join(["obj"], x)];
    }
  };
  setenv("export", stash33({["macro"]: export__macro}));
  var once__macro = function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    var x = uniq("x");
    return ["when", ["nil?", x], ["=", x, "t"], join(["let", join()], forms)];
  };
  setenv("once", stash33({["macro"]: once__macro}));
  var elf__macro = function () {
    var _x191 = ["target"];
    _x191.js = "\"elf.js\"";
    _x191.lua = "\"elf\"";
    return ["require", _x191];
  };
  setenv("elf", stash33({["macro"]: elf__macro}));
  var lib__macro = function () {
    var modules = unstash(Array.prototype.slice.call(arguments, 0));
    return join(["do"], map(function (_) {
      return ["def", _, ["require", ["quote", _]]];
    }, modules));
  };
  setenv("lib", stash33({["macro"]: lib__macro}));
  var use__macro = function () {
    var modules = unstash(Array.prototype.slice.call(arguments, 0));
    return join(["do"], map(function (_) {
      return ["var", _, ["require", ["quote", _]]];
    }, modules));
  };
  setenv("use", stash33({["macro"]: use__macro}));
  var nil63__macro = function (x) {
    if (target42 === "lua") {
      return ["is", x, "nil"];
    } else {
      if (typeof(x) === "object") {
        return ["let", "x", x, ["nil?", "x"]];
      } else {
        return ["or", ["is", ["typeof", x], ["quote", "undefined"]], ["is", x, "null"]];
      }
    }
  };
  setenv("nil?", stash33({["macro"]: nil63__macro}));
  var hd__macro = function (l) {
    return ["at", l, 0];
  };
  setenv("hd", stash33({["macro"]: hd__macro}));
  var tl__macro = function (l) {
    return ["cut", l, 1];
  };
  setenv("tl", stash33({["macro"]: tl__macro}));
  var _37len__special = function (x) {
    return "#(" + compile(x) + ")";
  };
  setenv("%len", stash33({["special"]: _37len__special}));
  var len__macro = function (x) {
    var _x210 = ["target"];
    _x210.lua = ["%len", x];
    _x210.js = ["or", ["get", x, ["quote", "length"]], 0];
    return _x210;
  };
  setenv("len", stash33({["macro"]: len__macro}));
  var edge__macro = function (x) {
    return ["-", ["len", x], 1];
  };
  setenv("edge", stash33({["macro"]: edge__macro}));
  var one63__macro = function (x) {
    return ["is", ["len", x], 1];
  };
  setenv("one?", stash33({["macro"]: one63__macro}));
  var two63__macro = function (x) {
    return ["is", ["len", x], 2];
  };
  setenv("two?", stash33({["macro"]: two63__macro}));
  var some63__macro = function (x) {
    return [">", ["len", x], 0];
  };
  setenv("some?", stash33({["macro"]: some63__macro}));
  var none63__macro = function (x) {
    return ["is", ["len", x], 0];
  };
  setenv("none?", stash33({["macro"]: none63__macro}));
  var isa__macro = function (x, y) {
    var _x227 = ["target"];
    _x227.js = "typeof";
    _x227.lua = "type";
    return ["is", [_x227, x], y];
  };
  setenv("isa", stash33({["macro"]: isa__macro}));
  var list63__macro = function (x) {
    var _x229 = ["target"];
    _x229.js = ["quote", "object"];
    _x229.lua = ["quote", "table"];
    return ["isa", x, _x229];
  };
  setenv("list?", stash33({["macro"]: list63__macro}));
  var atom63__macro = function (x) {
    return ["~list?", x];
  };
  setenv("atom?", stash33({["macro"]: atom63__macro}));
  var bool63__macro = function (x) {
    return ["isa", x, ["quote", "boolean"]];
  };
  setenv("bool?", stash33({["macro"]: bool63__macro}));
  var num63__macro = function (x) {
    return ["isa", x, ["quote", "number"]];
  };
  setenv("num?", stash33({["macro"]: num63__macro}));
  var str63__macro = function (x) {
    return ["isa", x, ["quote", "string"]];
  };
  setenv("str?", stash33({["macro"]: str63__macro}));
  var fn63__macro = function (x) {
    return ["isa", x, ["quote", "function"]];
  };
  setenv("fn?", stash33({["macro"]: fn63__macro}));
  var compose__transformer = function (_x241) {
    var _id33 = _x241[0];
    var compose = _id33[0];
    var fns = cut(_id33, 1);
    var body = cut(_x241, 1);
    if ((fns.length || 0) === 0) {
      return macroexpand(join(["do"], body));
    } else {
      if ((fns.length || 0) === 1) {
        return macroexpand(join(fns, body));
      } else {
        return macroexpand([join([compose], almost(fns)), join([last(fns)], body)]);
      }
    }
  };
  setenv("compose", stash33({["transformer"]: compose__transformer}));
  var complement__transformer = function (_x246) {
    var _id35 = _x246[0];
    var complement = _id35[0];
    var form = _id35[1];
    var body = cut(_x246, 1);
    if (hd63(form, "complement")) {
      return macroexpand(join([form[1]], body));
    } else {
      return macroexpand(["not", join([form], body)]);
    }
  };
  setenv("complement", stash33({["transformer"]: complement__transformer}));
  var expansion__transformer = function (_x250) {
    var _id37 = _x250[0];
    var expansion = _id37[0];
    var form = _x250[1];
    return form;
  };
  setenv("expansion", stash33({["transformer"]: expansion__transformer}));
  return undefined;
};
if (typeof(_x251) === "undefined" || _x251 === null) {
  _x251 = true;
  environment42 = [{}];
  target42 = "js";
  keys42 = undefined;
}
id = function (a, b) {
  return a === b;
};
no = function (x) {
  return typeof(x) === "undefined" || x === null || id(x, false);
};
yes = function (x) {
  return ! no(x);
};
obj63 = function (x) {
  return !( typeof(x) === "undefined" || x === null) && typeof(x) === "object";
};
hd63 = function (l, x) {
  var _id41 = obj63(l);
  var _e14;
  if (_id41) {
    var _e15;
    if (typeof(x) === "function") {
      _e15 = x(l[0]);
    } else {
      var _e16;
      if (typeof(x) === "undefined" || x === null) {
        _e16 = l[0];
      } else {
        _e16 = l[0] === x;
      }
      _e15 = _e16;
    }
    _e14 = _e15;
  } else {
    _e14 = _id41;
  }
  return _e14;
};
complement = function (f) {
  return function () {
    var args = unstash(Array.prototype.slice.call(arguments, 0));
    return no(apply(f, args));
  };
};
idfn = function (x) {
  return x;
};
compose = function (f) {
  var _r74 = unstash(Array.prototype.slice.call(arguments, 1));
  var fs = cut(_r74, 0);
  if (typeof(f) === "undefined" || f === null) {
    f = idfn;
  }
  if ((fs.length || 0) === 0) {
    return f;
  } else {
    var g = apply(compose, fs);
    return function () {
      var args = unstash(Array.prototype.slice.call(arguments, 0));
      return f(apply(g, args));
    };
  }
};
nan = 0 / 0;
inf = 1 / 0;
nan63 = function (n) {
  return !( n === n);
};
inf63 = function (n) {
  return n === inf || n === -inf;
};
clip = function (s, from, upto) {
  return s.substring(from, upto);
};
cut = function (x, from, upto) {
  if (typeof(from) === "undefined" || from === null) {
    from = 0;
  }
  if (typeof(upto) === "undefined" || upto === null) {
    upto = x.length || 0;
  }
  var l = [];
  var j = 0;
  var i = max(0, from);
  var to = min(x.length || 0, upto);
  while (i < to) {
    l[j] = x[i];
    i = i + 1;
    j = j + 1;
  }
  var _l3 = x;
  var k = undefined;
  for (k in _l3) {
    var v = _l3[k];
    var _e17;
    if (numeric63(k)) {
      _e17 = parseInt(k);
    } else {
      _e17 = k;
    }
    var _k1 = _e17;
    if (!( typeof(_k1) === "number")) {
      l[_k1] = v;
    }
  }
  return l;
};
keys = function (x) {
  var l = [];
  var _l4 = x;
  var k = undefined;
  for (k in _l4) {
    var v = _l4[k];
    var _e18;
    if (numeric63(k)) {
      _e18 = parseInt(k);
    } else {
      _e18 = k;
    }
    var _k2 = _e18;
    if (!( typeof(_k2) === "number")) {
      l[_k2] = v;
    }
  }
  return l;
};
inner = function (x) {
  return clip(x, 1, (x.length || 0) - 1);
};
char = function (s, n) {
  return s.charAt(n);
};
code = function (s, n) {
  return s.charCodeAt(n);
};
chr = function (c) {
  return String.fromCharCode(c);
};
string_literal63 = function (x) {
  return typeof(x) === "string" && char(x, 0) === "\"";
};
id_literal63 = function (x) {
  return typeof(x) === "string" && char(x, 0) === "|";
};
add = function (l, x) {
  l.push(x);
  return undefined;
};
drop = function (l) {
  return l.pop();
};
last = function (l) {
  return l[(l.length || 0) - 1];
};
almost = function (l) {
  return cut(l, 0, (l.length || 0) - 1);
};
rev = function (l) {
  var l1 = keys(l);
  var n = (l.length || 0) - 1;
  var i = 0;
  while (i < (l.length || 0)) {
    add(l1, l[n - i]);
    i = i + 1;
  }
  return l1;
};
reduce = function (f, x) {
  var _e1 = x.length || 0;
  if (0 === _e1) {
    return undefined;
  } else {
    if (1 === _e1) {
      return x[0];
    } else {
      return f(x[0], reduce(f, cut(x, 1)));
    }
  }
};
join = function () {
  var ls = unstash(Array.prototype.slice.call(arguments, 0));
  if ((ls.length || 0) === 2) {
    var a = ls[0];
    var b = ls[1];
    if (a && b) {
      var c = [];
      var o = a.length || 0;
      var _l5 = a;
      var k = undefined;
      for (k in _l5) {
        var v = _l5[k];
        var _e19;
        if (numeric63(k)) {
          _e19 = parseInt(k);
        } else {
          _e19 = k;
        }
        var _k3 = _e19;
        c[_k3] = v;
      }
      var _l6 = b;
      var k = undefined;
      for (k in _l6) {
        var v = _l6[k];
        var _e20;
        if (numeric63(k)) {
          _e20 = parseInt(k);
        } else {
          _e20 = k;
        }
        var _k4 = _e20;
        if (typeof(_k4) === "number") {
          _k4 = _k4 + o;
        }
        c[_k4] = v;
      }
      return c;
    } else {
      return a || b || [];
    }
  } else {
    return reduce(join, ls) || [];
  }
};
find = function (f, l) {
  var _l7 = l;
  var _i7 = undefined;
  for (_i7 in _l7) {
    var x = _l7[_i7];
    var _e21;
    if (numeric63(_i7)) {
      _e21 = parseInt(_i7);
    } else {
      _e21 = _i7;
    }
    var __i7 = _e21;
    var y = f(x);
    if (y) {
      return y;
    }
  }
};
first = function (f, l) {
  var _x253 = l;
  var _n8 = _x253.length || 0;
  var _i8 = 0;
  while (_i8 < _n8) {
    var x = _x253[_i8];
    var y = f(x);
    if (y) {
      return y;
    }
    _i8 = _i8 + 1;
  }
};
in63 = function (x, l) {
  return find(function (_) {
    return x === _;
  }, l);
};
pair = function (l) {
  var l1 = [];
  var i = 0;
  while (i < (l.length || 0)) {
    add(l1, [l[i], l[i + 1]]);
    i = i + 1;
    i = i + 1;
  }
  return l1;
};
sort = function (l, f) {
  var _e22;
  if (f) {
    _e22 = function (_0, _1) {
      if (f(_0, _1)) {
        return -1;
      } else {
        return 1;
      }
    };
  }
  return l.sort(_e22);
};
map = function (f, x) {
  var l = [];
  var _x255 = x;
  var _n9 = _x255.length || 0;
  var _i9 = 0;
  while (_i9 < _n9) {
    var v = _x255[_i9];
    var y = f(v);
    if (!( typeof(y) === "undefined" || y === null)) {
      add(l, y);
    }
    _i9 = _i9 + 1;
  }
  var _l8 = x;
  var k = undefined;
  for (k in _l8) {
    var v = _l8[k];
    var _e23;
    if (numeric63(k)) {
      _e23 = parseInt(k);
    } else {
      _e23 = k;
    }
    var _k5 = _e23;
    if (!( typeof(_k5) === "number")) {
      var y = f(v);
      if (!( typeof(y) === "undefined" || y === null)) {
        l[_k5] = y;
      }
    }
  }
  return l;
};
keep = function (f, x) {
  return map(function (_) {
    if (f(_)) {
      return _;
    }
  }, x);
};
keys63 = function (l) {
  var _l9 = l;
  var k = undefined;
  for (k in _l9) {
    var v = _l9[k];
    var _e24;
    if (numeric63(k)) {
      _e24 = parseInt(k);
    } else {
      _e24 = k;
    }
    var _k6 = _e24;
    if (!( typeof(_k6) === "number")) {
      return true;
    }
  }
  return false;
};
empty63 = function (l) {
  var _l10 = l;
  var _i12 = undefined;
  for (_i12 in _l10) {
    var x = _l10[_i12];
    var _e25;
    if (numeric63(_i12)) {
      _e25 = parseInt(_i12);
    } else {
      _e25 = _i12;
    }
    var __i12 = _e25;
    return false;
  }
  return true;
};
stash33 = function (args) {
  keys42 = args;
  return undefined;
};
unstash = function (args) {
  if (keys42) {
    var _l11 = keys42;
    var k = undefined;
    for (k in _l11) {
      var v = _l11[k];
      var _e26;
      if (numeric63(k)) {
        _e26 = parseInt(k);
      } else {
        _e26 = k;
      }
      var _k7 = _e26;
      args[_k7] = v;
    }
    keys42 = undefined;
  }
  return args;
};
search = function (s, pattern, start) {
  var i = s.indexOf(pattern, start);
  if (i >= 0) {
    return i;
  }
};
split = function (s, sep) {
  if (s === "" || sep === "") {
    return [];
  } else {
    var l = [];
    var n = sep.length || 0;
    while (true) {
      var i = search(s, sep);
      if (typeof(i) === "undefined" || i === null) {
        break;
      } else {
        add(l, clip(s, 0, i));
        s = clip(s, i + n);
      }
    }
    add(l, s);
    return l;
  }
};
cat = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return reduce(function (_0, _1) {
    return _0 + _1;
  }, xs) || "";
};
_43 = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return reduce(function (_0, _1) {
    return _0 + _1;
  }, xs) || 0;
};
_42 = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return reduce(function (_0, _1) {
    return _0 * _1;
  }, xs) || 1;
};
_ = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return reduce(function (_0, _1) {
    return _1 - _0;
  }, rev(xs)) || 0;
};
_47 = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return reduce(function (_0, _1) {
    return _1 / _0;
  }, rev(xs)) || 1;
};
_37 = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return reduce(function (_0, _1) {
    return _1 % _0;
  }, rev(xs)) || 1;
};
_62 = function (a, b) {
  return a > b;
};
_60 = function (a, b) {
  return a < b;
};
is = function (a, b) {
  return a === b;
};
_6261 = function (a, b) {
  return a >= b;
};
_6061 = function (a, b) {
  return a <= b;
};
number = function (s) {
  var n = parseFloat(s);
  if (! isNaN(n)) {
    return n;
  }
};
number_code63 = function (n) {
  return n > 47 && n < 58;
};
numeric63 = function (s) {
  var n = s.length || 0;
  var i = 0;
  while (i < n) {
    if (! number_code63(code(s, i))) {
      return false;
    }
    i = i + 1;
  }
  return true;
};
tostring = function (x) {
  return x.toString();
};
escape = function (s) {
  var s1 = "\"";
  var i = 0;
  while (i < (s.length || 0)) {
    var c = char(s, i);
    var _e2 = c;
    var _e27;
    if ("\n" === _e2) {
      _e27 = "\\n";
    } else {
      var _e28;
      if ("\"" === _e2) {
        _e28 = "\\\"";
      } else {
        var _e29;
        if ("\\" === _e2) {
          _e29 = "\\\\";
        } else {
          _e29 = c;
        }
        _e28 = _e29;
      }
      _e27 = _e28;
    }
    s1 = s1 + _e27;
    i = i + 1;
  }
  return s1 + "\"";
};
str = function (x, stack) {
  if (typeof(x) === "undefined" || x === null) {
    return "nil";
  } else {
    if (nan63(x)) {
      return "nan";
    } else {
      if (x === inf) {
        return "inf";
      } else {
        if (x === -inf) {
          return "-inf";
        } else {
          if (typeof(x) === "number") {
            return tostring(x);
          } else {
            if (typeof(x) === "boolean") {
              if (x) {
                return "t";
              } else {
                return "false";
              }
            } else {
              if (typeof(x) === "string") {
                return escape(x);
              } else {
                if (typeof(x) === "function") {
                  return "fn";
                } else {
                  if (!( typeof(x) === "object")) {
                    return escape(tostring(x));
                  } else {
                    if (stack && in63(x, stack)) {
                      return "circular";
                    } else {
                      var s = "(";
                      var sp = "";
                      var fs = [];
                      var xs = [];
                      var ks = [];
                      var _stack = stack || [];
                      add(_stack, x);
                      var _l12 = x;
                      var k = undefined;
                      for (k in _l12) {
                        var v = _l12[k];
                        var _e30;
                        if (numeric63(k)) {
                          _e30 = parseInt(k);
                        } else {
                          _e30 = k;
                        }
                        var _k8 = _e30;
                        if (typeof(_k8) === "number") {
                          xs[_k8] = str(v, _stack);
                        } else {
                          if (typeof(v) === "function") {
                            add(fs, _k8);
                          } else {
                            add(ks, _k8 + ":");
                            add(ks, str(v, _stack));
                          }
                        }
                      }
                      drop(_stack);
                      var _l13 = join(sort(fs), xs, ks);
                      var _i15 = undefined;
                      for (_i15 in _l13) {
                        var v = _l13[_i15];
                        var _e31;
                        if (numeric63(_i15)) {
                          _e31 = parseInt(_i15);
                        } else {
                          _e31 = _i15;
                        }
                        var __i15 = _e31;
                        s = s + sp + v;
                        sp = " ";
                      }
                      return s + ")";
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
apply = function (f, args) {
  stash33(keys(args));
  return f(...(args));
};
toplevel63 = function () {
  return (environment42.length || 0) === 1;
};
setenv = function (k) {
  var _r127 = unstash(Array.prototype.slice.call(arguments, 1));
  var _keys = cut(_r127, 0);
  if (typeof(k) === "string") {
    var _e32;
    if (_keys.toplevel) {
      _e32 = environment42[0];
    } else {
      _e32 = last(environment42);
    }
    var frame = _e32;
    var entry = frame[k] || {};
    var _l14 = _keys;
    var _k9 = undefined;
    for (_k9 in _l14) {
      var v = _l14[_k9];
      var _e33;
      if (numeric63(_k9)) {
        _e33 = parseInt(_k9);
      } else {
        _e33 = _k9;
      }
      var _k10 = _e33;
      entry[_k10] = v;
    }
    frame[k] = entry;
    return frame[k];
  }
};
print = function (x) {
  return console.log(x);
};
var math = Math;
abs = math.abs;
acos = math.acos;
asin = math.asin;
atan = math.atan;
atan2 = math.atan2;
ceil = math.ceil;
cos = math.cos;
floor = math.floor;
log = math.log;
log10 = math.log10;
max = math.max;
min = math.min;
pow = math.pow;
random = math.random;
sin = math.sin;
sinh = math.sinh;
sqrt = math.sqrt;
tan = math.tan;
tanh = math.tanh;
setup();
