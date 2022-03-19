var setup = function () {
  setenv("t", stash33({["symbol"]: true}));
  setenv("js?", stash33({["symbol"]: ["is", "target*", ["quote", "js"]]}));
  setenv("lua?", stash33({["symbol"]: ["is", "target*", ["quote", "lua"]]}));
  var __x4 = ["target"];
  __x4.lua = "_G";
  __x4.js = ["if", ["nil?", "global"], "window", "global"];
  setenv("global*", stash33({["symbol"]: __x4}));
  var _37compile_time__macro = function () {
    var _forms = unstash(Array.prototype.slice.call(arguments, 0));
    compiler.eval(join(["do"], _forms));
    return undefined;
  };
  setenv("%compile-time", stash33({["macro"]: _37compile_time__macro}));
  var when_compiling__macro = function () {
    var _body = unstash(Array.prototype.slice.call(arguments, 0));
    return compiler.eval(join(["do"], _body));
  };
  setenv("when-compiling", stash33({["macro"]: when_compiling__macro}));
  var during_compilation__macro = function () {
    var _body1 = unstash(Array.prototype.slice.call(arguments, 0));
    var _form = join(["do"], _body1);
    compiler.eval(_form);
    return _form;
  };
  setenv("during-compilation", stash33({["macro"]: during_compilation__macro}));
  var _37js__macro = function () {
    var _forms1 = unstash(Array.prototype.slice.call(arguments, 0));
    if (target42 === "js") {
      return join(["do"], _forms1);
    }
  };
  setenv("%js", stash33({["macro"]: _37js__macro}));
  var _37lua__macro = function () {
    var _forms2 = unstash(Array.prototype.slice.call(arguments, 0));
    if (target42 === "lua") {
      return join(["do"], _forms2);
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
    var _body2 = unstash(Array.prototype.slice.call(arguments, 0));
    var _x20 = uniq("x");
    var _l = [];
    var _forms3 = [];
    var __l1 = _body2;
    var _k = undefined;
    for (_k in __l1) {
      var _v = __l1[_k];
      var _e4;
      if (numeric63(_k)) {
        _e4 = parseInt(_k);
      } else {
        _e4 = _k;
      }
      var _k1 = _e4;
      if (typeof(_k1) === "number") {
        _l[_k1] = _v;
      } else {
        add(_forms3, ["assign", ["get", _x20, ["quote", _k1]], _v]);
      }
    }
    if ((_forms3.length || 0) > 0) {
      return join(["let", _x20, join(["%array"], _l)], _forms3, [_x20]);
    } else {
      return join(["%array"], _l);
    }
  };
  setenv("list", stash33({["macro"]: list__macro}));
  var xform__macro = function (l, body) {
    return ["map", ["%fn", ["do", body]], l];
  };
  setenv("xform", stash33({["macro"]: xform__macro}));
  var if__macro = function () {
    var _branches = unstash(Array.prototype.slice.call(arguments, 0));
    return expand_if(_branches)[0];
  };
  setenv("if", stash33({["macro"]: if__macro}));
  var case__macro = function (x) {
    var __r6 = unstash(Array.prototype.slice.call(arguments, 1));
    var _clauses = cut(__r6, 0);
    var _e = uniq("e");
    var _bs = map(function (_x31) {
      var _a = _x31[0];
      var _b = _x31[1];
      if (typeof(_b) === "undefined" || _b === null) {
        return [_a];
      } else {
        return [["is", _a, _e], _b];
      }
    }, pair(_clauses));
    return ["let", [_e, x], join(["if"], apply(join, _bs))];
  };
  setenv("case", stash33({["macro"]: case__macro}));
  var when__macro = function (cond) {
    var __r8 = unstash(Array.prototype.slice.call(arguments, 1));
    var _body3 = cut(__r8, 0);
    return ["if", cond, join(["do"], _body3)];
  };
  setenv("when", stash33({["macro"]: when__macro}));
  var unless__macro = function (cond) {
    var __r9 = unstash(Array.prototype.slice.call(arguments, 1));
    var _body4 = cut(__r9, 0);
    return ["if", ["not", cond], join(["do"], _body4)];
  };
  setenv("unless", stash33({["macro"]: unless__macro}));
  var assert__macro = function (cond) {
    var _x44 = "assert: " + str(cond);
    return ["unless", cond, ["error", ["quote", _x44]]];
  };
  setenv("assert", stash33({["macro"]: assert__macro}));
  var obj__macro = function () {
    var _body5 = unstash(Array.prototype.slice.call(arguments, 0));
    return join(["%object"], mapo(function (_) {
      return _;
    }, _body5));
  };
  setenv("obj", stash33({["macro"]: obj__macro}));
  var let__macro = function (bs) {
    var __r12 = unstash(Array.prototype.slice.call(arguments, 1));
    var _body6 = cut(__r12, 0);
    if (!( typeof(bs) === "object")) {
      return join(["let", [bs, _body6[0]]], cut(_body6, 1));
    } else {
      if ((bs.length || 0) === 0) {
        return join(["do"], _body6);
      } else {
        var _lh = bs[0];
        var _rh = bs[1];
        var _bs2 = cut(bs, 2);
        var __id6 = bind(_lh, _rh);
        var _id7 = __id6[0];
        var _val = __id6[1];
        var _bs1 = cut(__id6, 2);
        var _id11 = uniq(_id7);
        return ["do", ["%local", _id11, _val], ["w/sym", _id7, _id11, join(["let", join(_bs1, _bs2)], _body6)]];
      }
    }
  };
  setenv("let", stash33({["macro"]: let__macro}));
  var _61__macro = function () {
    var _l2 = unstash(Array.prototype.slice.call(arguments, 0));
    var __e1 = _l2.length || 0;
    if (0 === __e1) {
      return undefined;
    } else {
      if (1 === __e1) {
        return join(["="], _l2, ["nil"]);
      } else {
        if (2 === __e1) {
          var _lh1 = _l2[0];
          var _rh1 = _l2[1];
          if (!( typeof(_lh1) === "object") || _lh1[0] === "at" || _lh1[0] === "get") {
            return ["assign", _lh1, _rh1];
          } else {
            var _vars = [];
            var _forms4 = bind(_lh1, _rh1, _vars);
            return join(["do"], map(function (_) {
              return ["var", _];
            }, _vars), map(function (_x60) {
              var _id10 = _x60[0];
              var _val1 = _x60[1];
              return ["=", _id10, _val1];
            }, pair(_forms4)));
          }
        } else {
          return join(["do"], map(function (_) {
            return join(["="], _);
          }, pair(_l2)));
        }
      }
    }
  };
  setenv("=", stash33({["macro"]: _61__macro}));
  var with__macro = function (x, v) {
    var __r16 = unstash(Array.prototype.slice.call(arguments, 2));
    var _body7 = cut(__r16, 0);
    return join(["let", [x, v]], _body7, [x]);
  };
  setenv("with", stash33({["macro"]: with__macro}));
  var iflet__macro = function (_var, expr, _then) {
    var __r17 = unstash(Array.prototype.slice.call(arguments, 3));
    var _rest = cut(__r17, 0);
    if (!( typeof(_var) === "object")) {
      return ["let", _var, expr, join(["if", _var, _then], _rest)];
    } else {
      var _gv = uniq("if");
      return ["let", _gv, expr, join(["if", _gv, ["let", [_var, _gv], _then]], _rest)];
    }
  };
  setenv("iflet", stash33({["macro"]: iflet__macro}));
  var whenlet__macro = function (_var, expr) {
    var __r18 = unstash(Array.prototype.slice.call(arguments, 2));
    var _body8 = cut(__r18, 0);
    return ["iflet", _var, expr, join(["do"], _body8)];
  };
  setenv("whenlet", stash33({["macro"]: whenlet__macro}));
  var do1__macro = function (x) {
    var __r19 = unstash(Array.prototype.slice.call(arguments, 1));
    var _ys = cut(__r19, 0);
    var _g = uniq("do");
    return join(["let", _g, x], _ys, [_g]);
  };
  setenv("do1", stash33({["macro"]: do1__macro}));
  var _37define__macro = function (kind, name, x) {
    var __r20 = unstash(Array.prototype.slice.call(arguments, 3));
    var _e5;
    var _x77 = __r20.eval;
    if (typeof(_x77) === "undefined" || _x77 === null) {
      _e5 = undefined;
    } else {
      _e5 = __r20.eval;
    }
    var _self_evaluating63 = _e5;
    var _body9 = cut(__r20, 0);
    var _label = name + "--" + kind;
    var _e6;
    if ((_body9.length || 0) === 0) {
      _e6 = ["quote", x];
    } else {
      var __x79 = ["fn", x];
      __x79.name = _label;
      _e6 = join(__x79, _body9);
    }
    var _expansion = _e6;
    var _form1 = join(["setenv", ["quote", name]], {[kind]: _expansion}, keys(_body9));
    if (_self_evaluating63) {
      return ["during-compilation", _form1];
    } else {
      return _form1;
    }
  };
  setenv("%define", stash33({["macro"]: _37define__macro}));
  var mac__macro = function (name, args) {
    var __r21 = unstash(Array.prototype.slice.call(arguments, 2));
    var _body10 = cut(__r21, 0);
    return join(["%define", "macro", name, args], _body10);
  };
  setenv("mac", stash33({["macro"]: mac__macro}));
  var defspecial__macro = function (name, args) {
    var __r22 = unstash(Array.prototype.slice.call(arguments, 2));
    var _body11 = cut(__r22, 0);
    return join(["%define", "special", name, args], _body11);
  };
  setenv("defspecial", stash33({["macro"]: defspecial__macro}));
  var deftransformer__macro = function (name, form) {
    var __r23 = unstash(Array.prototype.slice.call(arguments, 2));
    var _body12 = cut(__r23, 0);
    return join(["%define", "transformer", name, [form]], _body12);
  };
  setenv("deftransformer", stash33({["macro"]: deftransformer__macro}));
  var defsym__macro = function (name, expansion) {
    var __r24 = unstash(Array.prototype.slice.call(arguments, 2));
    var _props = cut(__r24, 0);
    return join(["%define", "symbol", name, expansion], keys(_props));
  };
  setenv("defsym", stash33({["macro"]: defsym__macro}));
  var var__macro = function (name, x) {
    var __r25 = unstash(Array.prototype.slice.call(arguments, 2));
    var _body13 = cut(__r25, 0);
    setenv(name, stash33({["variable"]: true}));
    if ((_body13.length || 0) > 0) {
      return join(["%local-function", name], bind42(x, _body13));
    } else {
      return ["%local", name, x];
    }
  };
  setenv("var", stash33({["macro"]: var__macro}));
  var def__macro = function (name, x) {
    var __r26 = unstash(Array.prototype.slice.call(arguments, 2));
    var _body14 = cut(__r26, 0);
    setenv(name, stash33({["toplevel"]: true, ["variable"]: true}));
    if ((_body14.length || 0) > 0) {
      return join(["%global-function", name], bind42(x, _body14));
    } else {
      return ["=", name, x];
    }
  };
  setenv("def", stash33({["macro"]: def__macro}));
  var w47frame__macro = function () {
    var _body15 = unstash(Array.prototype.slice.call(arguments, 0));
    var _x92 = uniq("x");
    return ["do", ["add", "environment*", ["obj"]], ["with", _x92, join(["do"], _body15), ["drop", "environment*"]]];
  };
  setenv("w/frame", stash33({["macro"]: w47frame__macro}));
  var w47bindings__macro = function (_x99) {
    var _names = _x99[0];
    var __r27 = unstash(Array.prototype.slice.call(arguments, 1));
    var _body16 = cut(__r27, 0);
    var _x100 = uniq("x");
    var __x103 = ["setenv", _x100];
    __x103.variable = true;
    return join(["w/frame", ["each", _x100, _names, __x103]], _body16);
  };
  setenv("w/bindings", stash33({["macro"]: w47bindings__macro}));
  var _37scope__macro = function () {
    var _body17 = unstash(Array.prototype.slice.call(arguments, 0));
    add(environment42, {});
    var __x104 = ["%expansion", macroexpand(join(["do"], _body17))];
    drop(environment42);
    return __x104;
  };
  setenv("%scope", stash33({["macro"]: _37scope__macro}));
  var w47mac__macro = function (name, args, definition) {
    var __r28 = unstash(Array.prototype.slice.call(arguments, 3));
    var _body18 = cut(__r28, 0);
    return join(["%scope", ["%compile-time", ["mac", name, args, definition]]], _body18);
  };
  setenv("w/mac", stash33({["macro"]: w47mac__macro}));
  var w47sym__macro = function (expansions) {
    var __r29 = unstash(Array.prototype.slice.call(arguments, 1));
    var _body19 = cut(__r29, 0);
    if (!( typeof(expansions) === "object")) {
      return join(["w/sym", [expansions, _body19[0]]], cut(_body19, 1));
    } else {
      return join(["%scope", join(["%compile-time"], map(function (_) {
        return join(["defsym"], _);
      }, pair(expansions)))], _body19);
    }
  };
  setenv("w/sym", stash33({["macro"]: w47sym__macro}));
  var w47uniq__macro = function (names) {
    var __r31 = unstash(Array.prototype.slice.call(arguments, 1));
    var _body20 = cut(__r31, 0);
    if (!( typeof(names) === "object")) {
      names = [names];
    }
    return join(["let", apply(join, map(function (_) {
      return [_, ["uniq", ["quote", _]]];
    }, names))], _body20);
  };
  setenv("w/uniq", stash33({["macro"]: w47uniq__macro}));
  var fn__macro = function (args) {
    var __r33 = unstash(Array.prototype.slice.call(arguments, 1));
    var _name = __r33.name;
    var _body21 = cut(__r33, 0);
    if (typeof(_name) === "undefined" || _name === null) {
      return join(["%function"], bind42(args, _body21));
    } else {
      return ["do", join(["%local-function", _name], bind42(args, _body21)), _name];
    }
  };
  setenv("fn", stash33({["macro"]: fn__macro}));
  var guard__macro = function (expr) {
    if (target42 === "js") {
      return [["%fn", ["%try", ["list", "t", expr]]]];
    } else {
      var _x127 = uniq("x");
      var _msg = uniq("msg");
      var _trace = uniq("trace");
      return ["let", [_x127, "nil", _msg, "nil", _trace, "nil"], ["if", ["xpcall", ["%fn", ["=", _x127, expr]], ["%fn", ["do", ["=", _msg, ["clip", "_", ["+", ["search", "_", "\": \""], 2]]], ["=", _trace, [["get", "debug", ["quote", "traceback"]]]]]]], ["list", "t", _x127], ["list", false, _msg, _trace]]];
    }
  };
  setenv("guard", stash33({["macro"]: guard__macro}));
  var for__macro = function (i, n) {
    var __r35 = unstash(Array.prototype.slice.call(arguments, 2));
    var _body22 = cut(__r35, 0);
    return ["let", i, 0, join(["while", ["<", i, n]], _body22, [["++", i]])];
  };
  setenv("for", stash33({["macro"]: for__macro}));
  var step__macro = function (v, l) {
    var __r36 = unstash(Array.prototype.slice.call(arguments, 2));
    var _body23 = cut(__r36, 0);
    var _index = __r36.index;
    var _e7;
    if (typeof(_index) === "undefined" || _index === null) {
      _e7 = uniq("i");
    } else {
      _e7 = _index;
    }
    var _i1 = _e7;
    if (_i1 === true) {
      _i1 = "index";
    }
    var _x151 = uniq("x");
    var _n1 = uniq("n");
    return ["let", [_x151, l, _n1, ["len", _x151]], ["for", _i1, _n1, join(["let", [v, ["at", _x151, _i1]]], _body23)]];
  };
  setenv("step", stash33({["macro"]: step__macro}));
  var each__macro = function (x, lst) {
    var __r37 = unstash(Array.prototype.slice.call(arguments, 2));
    var _body24 = cut(__r37, 0);
    var _l3 = uniq("l");
    var _n2 = uniq("n");
    var _i2 = uniq("i");
    var _e8;
    if (!( typeof(x) === "object")) {
      _e8 = [_i2, x];
    } else {
      var _e9;
      if ((x.length || 0) > 1) {
        _e9 = x;
      } else {
        _e9 = [_i2, x[0]];
      }
      _e8 = _e9;
    }
    var __id31 = _e8;
    var _k2 = __id31[0];
    var _v1 = __id31[1];
    var _e10;
    if (target42 === "lua") {
      _e10 = _body24;
    } else {
      _e10 = [join(["let", _k2, ["if", ["numeric?", _k2], ["parseInt", _k2], _k2]], _body24)];
    }
    return ["let", [_l3, lst, _k2, "nil"], ["%for", _l3, _k2, join(["let", [_v1, ["get", _l3, _k2]]], _e10)]];
  };
  setenv("each", stash33({["macro"]: each__macro}));
  var set_of__macro = function () {
    var _xs = unstash(Array.prototype.slice.call(arguments, 0));
    var _l4 = [];
    var __l5 = _xs;
    var __i3 = undefined;
    for (__i3 in __l5) {
      var _x174 = __l5[__i3];
      var _e11;
      if (numeric63(__i3)) {
        _e11 = parseInt(__i3);
      } else {
        _e11 = __i3;
      }
      var __i31 = _e11;
      _l4[_x174] = true;
    }
    return join(["obj"], _l4);
  };
  setenv("set-of", stash33({["macro"]: set_of__macro}));
  var language__macro = function () {
    return ["quote", target42];
  };
  setenv("language", stash33({["macro"]: language__macro}));
  var target__macro = function () {
    var _clauses1 = unstash(Array.prototype.slice.call(arguments, 0));
    return _clauses1[target42];
  };
  setenv("target", stash33({["macro"]: target__macro}));
  var join33__macro = function (a) {
    var __r39 = unstash(Array.prototype.slice.call(arguments, 1));
    var _bs11 = cut(__r39, 0);
    return ["=", a, join(["join", a], _bs11)];
  };
  setenv("join!", stash33({["macro"]: join33__macro}));
  var cat33__macro = function (a) {
    var __r40 = unstash(Array.prototype.slice.call(arguments, 1));
    var _bs21 = cut(__r40, 0);
    return ["=", a, join(["cat", a], _bs21)];
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
    var _names1 = unstash(Array.prototype.slice.call(arguments, 0));
    if (target42 === "js") {
      return join(["do"], map(function (_) {
        return ["=", ["get", "exports", ["quote", _]], _];
      }, _names1));
    } else {
      var _x189 = {};
      var __l6 = _names1;
      var __i4 = undefined;
      for (__i4 in __l6) {
        var _k3 = __l6[__i4];
        var _e12;
        if (numeric63(__i4)) {
          _e12 = parseInt(__i4);
        } else {
          _e12 = __i4;
        }
        var __i41 = _e12;
        _x189[_k3] = _k3;
      }
      return ["return", join(["obj"], _x189)];
    }
  };
  setenv("export", stash33({["macro"]: export__macro}));
  var once__macro = function () {
    var _forms5 = unstash(Array.prototype.slice.call(arguments, 0));
    var _x192 = uniq("x");
    return ["when", ["nil?", _x192], ["=", _x192, "t"], join(["let", join()], _forms5)];
  };
  setenv("once", stash33({["macro"]: once__macro}));
  var elf__macro = function () {
    var __x198 = ["target"];
    __x198.js = "\"elf.js\"";
    __x198.lua = "\"elf\"";
    return ["require", __x198];
  };
  setenv("elf", stash33({["macro"]: elf__macro}));
  var lib__macro = function () {
    var _modules = unstash(Array.prototype.slice.call(arguments, 0));
    return join(["do"], map(function (_) {
      return ["def", _, ["require", ["quote", _]]];
    }, _modules));
  };
  setenv("lib", stash33({["macro"]: lib__macro}));
  var use__macro = function () {
    var _modules1 = unstash(Array.prototype.slice.call(arguments, 0));
    return join(["do"], map(function (_) {
      return ["var", _, ["require", ["quote", _]]];
    }, _modules1));
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
    var __x217 = ["target"];
    __x217.lua = ["%len", x];
    __x217.js = ["or", ["get", x, ["quote", "length"]], 0];
    return __x217;
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
    var __x234 = ["target"];
    __x234.js = "typeof";
    __x234.lua = "type";
    return ["is", [__x234, x], y];
  };
  setenv("isa", stash33({["macro"]: isa__macro}));
  var list63__macro = function (x) {
    var __x236 = ["target"];
    __x236.js = ["quote", "object"];
    __x236.lua = ["quote", "table"];
    return ["isa", x, __x236];
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
  var compose__transformer = function (_x248) {
    var __id35 = _x248[0];
    var _compose = __id35[0];
    var _fns = cut(__id35, 1);
    var _body25 = cut(_x248, 1);
    var _e13;
    if ((_fns.length || 0) === 0) {
      _e13 = join(["do"], _body25);
    } else {
      var _e14;
      if ((_fns.length || 0) === 1) {
        _e14 = join(_fns, _body25);
      } else {
        _e14 = [join([_compose], almost(_fns)), join([last(_fns)], _body25)];
      }
      _e13 = _e14;
    }
    return macroexpand(_e13);
  };
  setenv("compose", stash33({["transformer"]: compose__transformer}));
  var complement__transformer = function (_x253) {
    var __id37 = _x253[0];
    var _complement = __id37[0];
    var _form2 = __id37[1];
    var _body26 = cut(_x253, 1);
    var _e15;
    if (hd63(_form2, "complement")) {
      _e15 = join([_form2[1]], _body26);
    } else {
      _e15 = ["not", join([_form2], _body26)];
    }
    return macroexpand(_e15);
  };
  setenv("complement", stash33({["transformer"]: complement__transformer}));
  return undefined;
};
if (typeof(_x257) === "undefined" || _x257 === null) {
  _x257 = true;
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
  var _e18;
  if (_id41) {
    var _e19;
    if (typeof(x) === "function") {
      _e19 = x(l[0]);
    } else {
      var _e20;
      if (typeof(x) === "undefined" || x === null) {
        _e20 = l[0];
      } else {
        _e20 = l[0] === x;
      }
      _e19 = _e20;
    }
    _e18 = _e19;
  } else {
    _e18 = _id41;
  }
  return _e18;
};
complement = function (f) {
  return function () {
    var _args = unstash(Array.prototype.slice.call(arguments, 0));
    return no(apply(f, _args));
  };
};
idfn = function (x) {
  return x;
};
compose = function (f) {
  var __r73 = unstash(Array.prototype.slice.call(arguments, 1));
  var _fs = cut(__r73, 0);
  if (typeof(f) === "undefined" || f === null) {
    f = idfn;
  }
  if ((_fs.length || 0) === 0) {
    return f;
  } else {
    var _g1 = apply(compose, _fs);
    return function () {
      var _args1 = unstash(Array.prototype.slice.call(arguments, 0));
      return f(apply(_g1, _args1));
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
  var _l7 = [];
  var j = 0;
  var i = max(0, from);
  var to = min(x.length || 0, upto);
  while (i < to) {
    _l7[j] = x[i];
    i = i + 1;
    j = j + 1;
  }
  var __l8 = x;
  var _k4 = undefined;
  for (_k4 in __l8) {
    var _v2 = __l8[_k4];
    var _e21;
    if (numeric63(_k4)) {
      _e21 = parseInt(_k4);
    } else {
      _e21 = _k4;
    }
    var _k5 = _e21;
    if (!( typeof(_k5) === "number")) {
      _l7[_k5] = _v2;
    }
  }
  return _l7;
};
keys = function (x) {
  var _l9 = [];
  var __l10 = x;
  var _k6 = undefined;
  for (_k6 in __l10) {
    var _v3 = __l10[_k6];
    var _e22;
    if (numeric63(_k6)) {
      _e22 = parseInt(_k6);
    } else {
      _e22 = _k6;
    }
    var _k7 = _e22;
    if (!( typeof(_k7) === "number")) {
      _l9[_k7] = _v3;
    }
  }
  return _l9;
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
  var _l11 = keys(l);
  var n = (l.length || 0) - 1;
  var _i7 = 0;
  while (_i7 < (l.length || 0)) {
    add(_l11, l[n - _i7]);
    _i7 = _i7 + 1;
  }
  return _l11;
};
reduce = function (f, x) {
  var __e2 = x.length || 0;
  if (0 === __e2) {
    return undefined;
  } else {
    if (1 === __e2) {
      return x[0];
    } else {
      return f(x[0], reduce(f, cut(x, 1)));
    }
  }
};
join = function () {
  var _ls = unstash(Array.prototype.slice.call(arguments, 0));
  if ((_ls.length || 0) === 2) {
    var _a1 = _ls[0];
    var _b1 = _ls[1];
    if (_a1 && _b1) {
      var _c = [];
      var _o = _a1.length || 0;
      var __l111 = _a1;
      var _k8 = undefined;
      for (_k8 in __l111) {
        var _v4 = __l111[_k8];
        var _e23;
        if (numeric63(_k8)) {
          _e23 = parseInt(_k8);
        } else {
          _e23 = _k8;
        }
        var _k9 = _e23;
        _c[_k9] = _v4;
      }
      var __l12 = _b1;
      var _k10 = undefined;
      for (_k10 in __l12) {
        var _v5 = __l12[_k10];
        var _e24;
        if (numeric63(_k10)) {
          _e24 = parseInt(_k10);
        } else {
          _e24 = _k10;
        }
        var _k11 = _e24;
        if (typeof(_k11) === "number") {
          _k11 = _k11 + _o;
        }
        _c[_k11] = _v5;
      }
      return _c;
    } else {
      return _a1 || _b1 || [];
    }
  } else {
    return reduce(join, _ls) || [];
  }
};
find = function (f, l) {
  var __l13 = l;
  var __i10 = undefined;
  for (__i10 in __l13) {
    var _x259 = __l13[__i10];
    var _e25;
    if (numeric63(__i10)) {
      _e25 = parseInt(__i10);
    } else {
      _e25 = __i10;
    }
    var __i101 = _e25;
    var _y = f(_x259);
    if (_y) {
      return _y;
    }
  }
};
first = function (f, l) {
  var __x260 = l;
  var __n10 = __x260.length || 0;
  var __i11 = 0;
  while (__i11 < __n10) {
    var _x261 = __x260[__i11];
    var _y1 = f(_x261);
    if (_y1) {
      return _y1;
    }
    __i11 = __i11 + 1;
  }
};
in63 = function (x, l) {
  return find(function (_) {
    return x === _;
  }, l);
};
pair = function (l) {
  var _l121 = [];
  var _i12 = 0;
  while (_i12 < (l.length || 0)) {
    add(_l121, [l[_i12], l[_i12 + 1]]);
    _i12 = _i12 + 1;
    _i12 = _i12 + 1;
  }
  return _l121;
};
sort = function (l, f) {
  var _e26;
  if (f) {
    _e26 = function (_0, _1) {
      if (f(_0, _1)) {
        return -1;
      } else {
        return 1;
      }
    };
  }
  return l.sort(_e26);
};
map = function (f, x) {
  var _l14 = [];
  var __x263 = x;
  var __n11 = __x263.length || 0;
  var __i13 = 0;
  while (__i13 < __n11) {
    var _v6 = __x263[__i13];
    var _y2 = f(_v6);
    if (!( typeof(_y2) === "undefined" || _y2 === null)) {
      add(_l14, _y2);
    }
    __i13 = __i13 + 1;
  }
  var __l15 = x;
  var _k12 = undefined;
  for (_k12 in __l15) {
    var _v7 = __l15[_k12];
    var _e27;
    if (numeric63(_k12)) {
      _e27 = parseInt(_k12);
    } else {
      _e27 = _k12;
    }
    var _k13 = _e27;
    if (!( typeof(_k13) === "number")) {
      var _y3 = f(_v7);
      if (!( typeof(_y3) === "undefined" || _y3 === null)) {
        _l14[_k13] = _y3;
      }
    }
  }
  return _l14;
};
keep = function (f, x) {
  return map(function (_) {
    if (f(_)) {
      return _;
    }
  }, x);
};
keys63 = function (l) {
  var __l16 = l;
  var _k14 = undefined;
  for (_k14 in __l16) {
    var _v8 = __l16[_k14];
    var _e28;
    if (numeric63(_k14)) {
      _e28 = parseInt(_k14);
    } else {
      _e28 = _k14;
    }
    var _k15 = _e28;
    if (!( typeof(_k15) === "number")) {
      return true;
    }
  }
  return false;
};
empty63 = function (l) {
  var __l17 = l;
  var __i16 = undefined;
  for (__i16 in __l17) {
    var _x264 = __l17[__i16];
    var _e29;
    if (numeric63(__i16)) {
      _e29 = parseInt(__i16);
    } else {
      _e29 = __i16;
    }
    var __i161 = _e29;
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
    var __l18 = keys42;
    var _k16 = undefined;
    for (_k16 in __l18) {
      var _v9 = __l18[_k16];
      var _e30;
      if (numeric63(_k16)) {
        _e30 = parseInt(_k16);
      } else {
        _e30 = _k16;
      }
      var _k17 = _e30;
      args[_k17] = _v9;
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
    var _l19 = [];
    var _n16 = sep.length || 0;
    while (true) {
      var _i18 = search(s, sep);
      if (typeof(_i18) === "undefined" || _i18 === null) {
        break;
      } else {
        add(_l19, clip(s, 0, _i18));
        s = clip(s, _i18 + _n16);
      }
    }
    add(_l19, s);
    return _l19;
  }
};
cat = function () {
  var _xs1 = unstash(Array.prototype.slice.call(arguments, 0));
  return reduce(function (_0, _1) {
    return _0 + _1;
  }, _xs1) || "";
};
_43 = function () {
  var _xs2 = unstash(Array.prototype.slice.call(arguments, 0));
  return reduce(function (_0, _1) {
    return _0 + _1;
  }, _xs2) || 0;
};
_42 = function () {
  var _xs3 = unstash(Array.prototype.slice.call(arguments, 0));
  return reduce(function (_0, _1) {
    return _0 * _1;
  }, _xs3) || 1;
};
_ = function () {
  var _xs4 = unstash(Array.prototype.slice.call(arguments, 0));
  return reduce(function (_0, _1) {
    return _1 - _0;
  }, rev(_xs4)) || 0;
};
_47 = function () {
  var _xs5 = unstash(Array.prototype.slice.call(arguments, 0));
  return reduce(function (_0, _1) {
    return _1 / _0;
  }, rev(_xs5)) || 1;
};
_37 = function () {
  var _xs6 = unstash(Array.prototype.slice.call(arguments, 0));
  return reduce(function (_0, _1) {
    return _1 % _0;
  }, rev(_xs6)) || 1;
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
  var _n17 = parseFloat(s);
  if (! isNaN(_n17)) {
    return _n17;
  }
};
number_code63 = function (n) {
  return n > 47 && n < 58;
};
numeric63 = function (s) {
  var _n18 = s.length || 0;
  var _i19 = 0;
  while (_i19 < _n18) {
    if (! number_code63(code(s, _i19))) {
      return false;
    }
    _i19 = _i19 + 1;
  }
  return true;
};
tostring = function (x) {
  return x.toString();
};
escape = function (s) {
  var s1 = "\"";
  var _i20 = 0;
  while (_i20 < (s.length || 0)) {
    var c = char(s, _i20);
    var __e3 = c;
    var _e31;
    if ("\n" === __e3) {
      _e31 = "\\n";
    } else {
      var _e32;
      if ("\"" === __e3) {
        _e32 = "\\\"";
      } else {
        var _e33;
        if ("\\" === __e3) {
          _e33 = "\\\\";
        } else {
          _e33 = c;
        }
        _e32 = _e33;
      }
      _e31 = _e32;
    }
    s1 = s1 + _e31;
    _i20 = _i20 + 1;
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
                      var _s = "(";
                      var _sp = "";
                      var _fs1 = [];
                      var _xs7 = [];
                      var _ks = [];
                      var _stack = stack || [];
                      add(_stack, x);
                      var __l20 = x;
                      var _k18 = undefined;
                      for (_k18 in __l20) {
                        var _v10 = __l20[_k18];
                        var _e34;
                        if (numeric63(_k18)) {
                          _e34 = parseInt(_k18);
                        } else {
                          _e34 = _k18;
                        }
                        var _k19 = _e34;
                        if (typeof(_k19) === "number") {
                          _xs7[_k19] = str(_v10, _stack);
                        } else {
                          if (typeof(_v10) === "function") {
                            add(_fs1, _k19);
                          } else {
                            add(_ks, _k19 + ":");
                            add(_ks, str(_v10, _stack));
                          }
                        }
                      }
                      drop(_stack);
                      var __l21 = join(sort(_fs1), _xs7, _ks);
                      var __i22 = undefined;
                      for (__i22 in __l21) {
                        var _v11 = __l21[__i22];
                        var _e35;
                        if (numeric63(__i22)) {
                          _e35 = parseInt(__i22);
                        } else {
                          _e35 = __i22;
                        }
                        var __i221 = _e35;
                        _s = _s + _sp + _v11;
                        _sp = " ";
                      }
                      return _s + ")";
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
  var __r126 = unstash(Array.prototype.slice.call(arguments, 1));
  var _keys = cut(__r126, 0);
  if (typeof(k) === "string") {
    var _e36;
    if (_keys.toplevel) {
      _e36 = environment42[0];
    } else {
      _e36 = last(environment42);
    }
    var _frame = _e36;
    var _entry = _frame[k] || {};
    var __l22 = _keys;
    var _k20 = undefined;
    for (_k20 in __l22) {
      var _v12 = __l22[_k20];
      var _e37;
      if (numeric63(_k20)) {
        _e37 = parseInt(_k20);
      } else {
        _e37 = _k20;
      }
      var _k21 = _e37;
      _entry[_k21] = _v12;
    }
    _frame[k] = _entry;
    return _frame[k];
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
