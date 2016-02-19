var setup = function () {
  setenv("t", {_stash: true, symbol: true});
  setenv("lua?", {_stash: true, symbol: ["is", "target*", ["quote", "lua"]]});
  setenv("js?", {_stash: true, symbol: ["is", "target*", ["quote", "js"]]});
  setenv("quote", {_stash: true, macro: function (form) {
    return(quoted(form));
  }});
  setenv("quasiquote", {_stash: true, macro: function (form) {
    return(quasiexpand(form, 1));
  }});
  setenv("at", {_stash: true, macro: function (l, i) {
    if (typeof(i) === "number" && i < 0) {
      if (typeof(l) === "object") {
        return(["let", ["l", l], ["at", "l", i]]);
      }
      var _e18;
      if (i === -1) {
        _e18 = ["edge", l];
      } else {
        _e18 = ["+", ["len", l], i];
      }
      i = _e18;
    }
    if (target42 === "lua") {
      var _e19;
      if (typeof(i) === "number") {
        _e19 = i + 1;
      } else {
        _e19 = ["+", i, 1];
      }
      i = _e19;
    }
    return(["get", l, i]);
  }});
  setenv("wipe", {_stash: true, macro: function (place) {
    if (target42 === "lua") {
      return(["assign", place, "nil"]);
    } else {
      return(["%delete", place]);
    }
  }});
  setenv("list", {_stash: true, macro: function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    var x = uniq("x");
    var l = [];
    var forms = [];
    var _l1 = body;
    var k = undefined;
    for (k in _l1) {
      var v = _l1[k];
      var _e20;
      if (numeric63(k)) {
        _e20 = parseInt(k);
      } else {
        _e20 = k;
      }
      var _k = _e20;
      if (typeof(_k) === "number") {
        l[_k] = v;
      } else {
        add(forms, ["assign", ["get", x, ["quote", _k]], v]);
      }
    }
    if ((forms.length || 0) > 0) {
      return(join(["let", x, join(["%array"], l)], forms, [x]));
    } else {
      return(join(["%array"], l));
    }
  }});
  setenv("xform", {_stash: true, macro: function (l, body) {
    return(["map", ["%fn", ["do", body]], l]);
  }});
  setenv("if", {_stash: true, macro: function () {
    var branches = unstash(Array.prototype.slice.call(arguments, 0));
    return(expand_if(branches)[0]);
  }});
  setenv("case", {_stash: true, macro: function (x) {
    var _r13 = unstash(Array.prototype.slice.call(arguments, 1));
    var clauses = cut(_r13, 0);
    var e = uniq("e");
    var bs = map(function (_x54) {
      var a = _x54[0];
      var b = _x54[1];
      if (typeof(b) === "undefined" || b === null) {
        return([a]);
      } else {
        return([["is", a, e], b]);
      }
    }, pair(clauses));
    return(["let", [e, x], join(["if"], apply(join, bs))]);
  }});
  setenv("when", {_stash: true, macro: function (cond) {
    var _r16 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r16, 0);
    return(["if", cond, join(["do"], body)]);
  }});
  setenv("unless", {_stash: true, macro: function (cond) {
    var _r18 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r18, 0);
    return(["if", ["not", cond], join(["do"], body)]);
  }});
  setenv("assert", {_stash: true, macro: function (cond) {
    var x = "assert: " + str(cond);
    return(["unless", cond, ["error", ["quote", x]]]);
  }});
  setenv("obj", {_stash: true, macro: function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    return(join(["%object"], mapo(function (_) {
      return(_);
    }, body)));
  }});
  setenv("let", {_stash: true, macro: function (bs) {
    var _r24 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r24, 0);
    if (!( typeof(bs) === "object")) {
      return(join(["let", [bs, body[0]]], cut(body, 1)));
    } else {
      if ((bs.length || 0) === 0) {
        return(join(["do"], body));
      } else {
        var lh = bs[0];
        var rh = bs[1];
        var bs2 = cut(bs, 2);
        var _id13 = bind(lh, rh);
        var id = _id13[0];
        var val = _id13[1];
        var bs1 = cut(_id13, 2);
        var renames = [];
        if (bound63(id) || toplevel63()) {
          var id1 = uniq(id);
          renames = [id, id1];
          id = id1;
        } else {
          setenv(id, {_stash: true, variable: true});
        }
        return(["do", ["%local", id, val], ["w/sym", renames, join(["let", join(bs1, bs2)], body)]]);
      }
    }
  }});
  setenv("=", {_stash: true, macro: function () {
    var l = unstash(Array.prototype.slice.call(arguments, 0));
    var _e9 = l.length || 0;
    if (0 === _e9) {
      return(undefined);
    } else {
      if (1 === _e9) {
        return(join(["="], l, ["nil"]));
      } else {
        if (2 === _e9) {
          var lh = l[0];
          var rh = l[1];
          var _id70 = !( typeof(lh) === "object");
          var _e23;
          if (_id70) {
            _e23 = _id70;
          } else {
            var _e10 = lh[0];
            var _e24;
            if ("at" === _e10) {
              _e24 = true;
            } else {
              var _e25;
              if ("get" === _e10) {
                _e25 = true;
              }
              _e24 = _e25;
            }
            _e23 = _e24;
          }
          if (_e23) {
            return(["assign", lh, rh]);
          } else {
            var vars = [];
            var forms = bind(lh, rh, vars);
            return(join(["do"], map(function (_) {
              return(["var", _]);
            }, vars), map(function (_x114) {
              var id = _x114[0];
              var val = _x114[1];
              return(["=", id, val]);
            }, pair(forms))));
          }
        } else {
          return(join(["do"], map(function (_) {
            return(join(["="], _));
          }, pair(l))));
        }
      }
    }
  }});
  setenv("with", {_stash: true, macro: function (x, v) {
    var _r32 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r32, 0);
    return(join(["let", [x, v]], body, [x]));
  }});
  setenv("whenlet", {_stash: true, macro: function (x, v) {
    var _r34 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r34, 0);
    var y = uniq("y");
    return(["let", y, v, ["when", y, join(["let", [x, y]], body)]]);
  }});
  setenv("mac", {_stash: true, macro: function (name, args) {
    var _r36 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r36, 0);
    var _x138 = ["setenv", ["quote", name]];
    _x138.macro = join(["fn", args], body);
    var form = _x138;
    eval(form);
    return(form);
  }});
  setenv("defspecial", {_stash: true, macro: function (name, args) {
    var _r38 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r38, 0);
    var _x145 = ["setenv", ["quote", name]];
    _x145.special = join(["fn", args], body);
    var form = join(_x145, keys(body));
    eval(form);
    return(form);
  }});
  setenv("defsym", {_stash: true, macro: function (name, expansion) {
    setenv(name, {_stash: true, symbol: expansion});
    var _x151 = ["setenv", ["quote", name]];
    _x151.symbol = ["quote", expansion];
    return(_x151);
  }});
  setenv("var", {_stash: true, macro: function (name, x) {
    var _r42 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r42, 0);
    setenv(name, {_stash: true, variable: true});
    if ((body.length || 0) > 0) {
      return(join(["%local-function", name], bind42(x, body)));
    } else {
      return(["%local", name, x]);
    }
  }});
  setenv("def", {_stash: true, macro: function (name, x) {
    var _r44 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r44, 0);
    setenv(name, {_stash: true, toplevel: true, variable: true});
    if ((body.length || 0) > 0) {
      return(join(["%global-function", name], bind42(x, body)));
    } else {
      return(["=", name, x]);
    }
  }});
  setenv("w/frame", {_stash: true, macro: function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    var x = uniq("x");
    return(["do", ["add", "environment*", ["obj"]], ["with", x, join(["do"], body), ["drop", "environment*"]]]);
  }});
  setenv("w/bindings", {_stash: true, macro: function (_x182) {
    var names = _x182[0];
    var _r46 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r46, 0);
    var x = uniq("x");
    var _x185 = ["setenv", x];
    _x185.variable = true;
    return(join(["w/frame", ["each", x, names, _x185]], body));
  }});
  setenv("w/mac", {_stash: true, macro: function (name, args, definition) {
    var _r48 = unstash(Array.prototype.slice.call(arguments, 3));
    var body = cut(_r48, 0);
    add(environment42, {});
    macroexpand(["mac", name, args, definition]);
    var _x190 = join(["do"], macroexpand(body));
    drop(environment42);
    return(_x190);
  }});
  setenv("w/sym", {_stash: true, macro: function (expansions) {
    var _r51 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r51, 0);
    if (!( typeof(expansions) === "object")) {
      return(join(["w/sym", [expansions, body[0]]], cut(body, 1)));
    } else {
      add(environment42, {});
      map(function (_x203) {
        var name = _x203[0];
        var exp = _x203[1];
        return(macroexpand(["defsym", name, exp]));
      }, pair(expansions));
      var _x202 = join(["do"], macroexpand(body));
      drop(environment42);
      return(_x202);
    }
  }});
  setenv("w/uniq", {_stash: true, macro: function (names) {
    var _r55 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r55, 0);
    var _e26;
    if (typeof(names) === "object") {
      _e26 = names;
    } else {
      _e26 = [names];
    }
    return(join(["let", apply(join, map(function (_) {
      return([_, ["uniq", ["quote", _]]]);
    }, _e26))], body));
  }});
  setenv("fn", {_stash: true, macro: function (args) {
    var _r58 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r58, 0);
    return(join(["%function"], bind42(args, body)));
  }});
  setenv("guard", {_stash: true, macro: function (expr) {
    if (target42 === "js") {
      return([["%fn", ["%try", ["list", "t", expr]]]]);
    } else {
      var x = uniq("x");
      var msg = uniq("msg");
      var trace = uniq("trace");
      return(["let", [x, "nil", msg, "nil", trace, "nil"], ["if", ["xpcall", ["%fn", ["=", x, expr]], ["%fn", ["do", ["=", msg, ["clip", "_", ["+", ["search", "_", "\": \""], 2]]], ["=", trace, [["get", "debug", ["quote", "traceback"]]]]]]], ["list", "t", x], ["list", false, msg, trace]]]);
    }
  }});
  setenv("each", {_stash: true, macro: function (x, lst) {
    var _r62 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r62, 0);
    var l = uniq("l");
    var n = uniq("n");
    var i = uniq("i");
    var _e27;
    if (!( typeof(x) === "object")) {
      _e27 = [i, x];
    } else {
      var _e28;
      if ((x.length || 0) > 1) {
        _e28 = x;
      } else {
        _e28 = [i, x[0]];
      }
      _e27 = _e28;
    }
    var _id48 = _e27;
    var k = _id48[0];
    var v = _id48[1];
    var _e29;
    if (target42 === "lua") {
      _e29 = body;
    } else {
      _e29 = [join(["let", k, ["if", ["numeric?", k], ["parseInt", k], k]], body)];
    }
    return(["let", [l, lst, k, "nil"], ["%for", l, k, join(["let", [v, ["get", l, k]]], _e29)]]);
  }});
  setenv("for", {_stash: true, macro: function () {
    var args = unstash(Array.prototype.slice.call(arguments, 0));
    var i = args[0];
    var body = cut(args, 1);
    var from = 0;
    var n = 0;
    var incr = 1;
    if (!( typeof(i) === "object")) {
      n = body[0];
      body = cut(body, 1);
    } else {
      var _id52;
      _id52 = i;
      i = _id52[0];
      from = _id52[1];
      n = _id52[2];
      var _e30;
      var x = _id52[3];
      if (typeof(x) === "undefined" || x === null) {
        _e30 = 1;
      } else {
        _e30 = _id52[3];
      }
      incr = _e30;
    }
    if (!( typeof(incr) === "number")) {
      throw new Error("assert: (\"num?\" \"incr\")");
    }
    return(["let", [i, from], join(["while", ["<", i, n]], body, [["++", i, incr]])]);
  }});
  setenv("revfor", {_stash: true, macro: function () {
    var args = unstash(Array.prototype.slice.call(arguments, 0));
    var i = args[0];
    var body = cut(args, 1);
    var from = 0;
    var n = 0;
    var incr = 1;
    if (!( typeof(i) === "object")) {
      n = body[0];
      body = cut(body, 1);
    } else {
      var _id56;
      _id56 = i;
      i = _id56[0];
      from = _id56[1];
      n = _id56[2];
      var _e31;
      var x = _id56[3];
      if (typeof(x) === "undefined" || x === null) {
        _e31 = 1;
      } else {
        _e31 = _id56[3];
      }
      incr = _e31;
    }
    if (!( typeof(incr) === "number")) {
      throw new Error("assert: (\"num?\" \"incr\")");
    }
    return(["let", [i, ["-", n, 1]], join(["while", [">=", i, from]], body, [["--", i, incr]])]);
  }});
  setenv("step", {_stash: true, macro: function (v, l) {
    var _r64 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r64, 0);
    var x = uniq("x");
    var n = uniq("n");
    var i = uniq("i");
    return(["let", [x, l, n, ["len", x]], ["for", i, n, join(["let", [v, ["at", x, i]]], body)]]);
  }});
  setenv("revstep", {_stash: true, macro: function (_var, l) {
    var _r66 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r66, 0);
    if (typeof(l) === "object") {
      var gl = uniq("l");
      return(["let", [gl, l], join(["revstep", _var, gl], body)]);
    } else {
      var i = uniq("i");
      return(["revfor", i, ["len", l], join(["let", [_var, ["at", l, i]]], body)]);
    }
  }});
  setenv("set-of", {_stash: true, macro: function () {
    var xs = unstash(Array.prototype.slice.call(arguments, 0));
    var l = [];
    var _l3 = xs;
    var _i3 = undefined;
    for (_i3 in _l3) {
      var x = _l3[_i3];
      var _e32;
      if (numeric63(_i3)) {
        _e32 = parseInt(_i3);
      } else {
        _e32 = _i3;
      }
      var __i3 = _e32;
      l[x] = true;
    }
    return(join(["obj"], l));
  }});
  setenv("language", {_stash: true, macro: function () {
    return(["quote", target42]);
  }});
  setenv("target", {_stash: true, macro: function () {
    var clauses = unstash(Array.prototype.slice.call(arguments, 0));
    return(clauses[target42]);
  }});
  setenv("join!", {_stash: true, macro: function (a) {
    var _r70 = unstash(Array.prototype.slice.call(arguments, 1));
    var bs = cut(_r70, 0);
    return(["=", a, join(["join", a], bs)]);
  }});
  setenv("cat!", {_stash: true, macro: function (a) {
    var _r72 = unstash(Array.prototype.slice.call(arguments, 1));
    var bs = cut(_r72, 0);
    return(["=", a, join(["cat", a], bs)]);
  }});
  setenv("++", {_stash: true, macro: function (n, by) {
    return(["=", n, ["+", n, by || 1]]);
  }});
  setenv("--", {_stash: true, macro: function (n, by) {
    return(["=", n, ["-", n, by || 1]]);
  }});
  setenv("export", {_stash: true, macro: function () {
    var names = unstash(Array.prototype.slice.call(arguments, 0));
    if (target42 === "js") {
      return(join(["do"], map(function (_) {
        return(["=", ["get", "exports", ["quote", _]], _]);
      }, names)));
    } else {
      var x = {};
      var _l5 = names;
      var _i5 = undefined;
      for (_i5 in _l5) {
        var k = _l5[_i5];
        var _e33;
        if (numeric63(_i5)) {
          _e33 = parseInt(_i5);
        } else {
          _e33 = _i5;
        }
        var __i5 = _e33;
        x[k] = k;
      }
      return(["return", join(["obj"], x)]);
    }
  }});
  setenv("%js", {_stash: true, macro: function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    if (target42 === "js") {
      return(join(["do"], forms));
    }
  }});
  setenv("%lua", {_stash: true, macro: function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    if (target42 === "lua") {
      return(join(["do"], forms));
    }
  }});
  setenv("%compile-time", {_stash: true, macro: function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    eval(join(["do"], forms));
    return(undefined);
  }});
  setenv("once", {_stash: true, macro: function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    var x = uniq("x");
    return(join(["when", ["nil?", x], ["=", x, "t"]], forms));
  }});
  setenv("elf", {_stash: true, macro: function () {
    return(["require", ["quote", "elf"]]);
  }});
  setenv("lib", {_stash: true, macro: function () {
    var modules = unstash(Array.prototype.slice.call(arguments, 0));
    return(join(["do"], map(function (_) {
      return(["def", _, ["require", ["quote", _]]]);
    }, modules)));
  }});
  setenv("use", {_stash: true, macro: function () {
    var modules = unstash(Array.prototype.slice.call(arguments, 0));
    return(join(["do"], map(function (_) {
      return(["var", _, ["require", ["quote", _]]]);
    }, modules)));
  }});
  setenv("nil?", {_stash: true, macro: function (x) {
    var _x470 = ["target"];
    _x470.lua = ["is", x, "nil"];
    var _e34;
    if (!( typeof(x) === "object")) {
      _e34 = ["or", ["is", ["typeof", x], "\"undefined\""], ["is", x, "null"]];
    } else {
      _e34 = ["let", ["x", x], ["nil?", "x"]];
    }
    _x470.js = _e34;
    return(_x470);
  }});
  setenv("%len", {_stash: true, special: function (x) {
    return("#(" + compile(x) + ")");
  }});
  setenv("len", {_stash: true, macro: function (x) {
    var _x484 = ["target"];
    _x484.lua = ["%len", x];
    _x484.js = ["or", ["get", x, ["quote", "length"]], 0];
    return(_x484);
  }});
  setenv("none?", {_stash: true, macro: function (x) {
    return(["is", ["len", x], 0]);
  }});
  setenv("some?", {_stash: true, macro: function (x) {
    return([">", ["len", x], 0]);
  }});
  setenv("one?", {_stash: true, macro: function (x) {
    return(["is", ["len", x], 1]);
  }});
  setenv("two?", {_stash: true, macro: function (x) {
    return(["is", ["len", x], 2]);
  }});
  setenv("hd", {_stash: true, macro: function (l) {
    return(["at", l, 0]);
  }});
  setenv("tl", {_stash: true, macro: function (l) {
    return(["cut", l, 1]);
  }});
  setenv("type", {_stash: true, macro: function (x) {
    var _x513 = ["target"];
    _x513.lua = [["do", "type"], x];
    _x513.js = ["typeof", x];
    return(_x513);
  }});
  setenv("isa", {_stash: true, macro: function (x, kind) {
    return(["is", ["type", x], kind]);
  }});
  setenv("str?", {_stash: true, macro: function (x) {
    return(["isa", x, ["quote", "string"]]);
  }});
  setenv("num?", {_stash: true, macro: function (x) {
    return(["isa", x, ["quote", "number"]]);
  }});
  setenv("bool?", {_stash: true, macro: function (x) {
    return(["isa", x, ["quote", "boolean"]]);
  }});
  setenv("fn?", {_stash: true, macro: function (x) {
    return(["isa", x, ["quote", "function"]]);
  }});
  setenv("list?", {_stash: true, macro: function (x) {
    var _x542 = ["target"];
    _x542.lua = ["quote", "table"];
    _x542.js = ["quote", "object"];
    return(["isa", x, _x542]);
  }});
  setenv("atom?", {_stash: true, macro: function (x) {
    return(["~list?", x]);
  }});
  setenv("%eval-arg", {_stash: true, macro: function (v, _x558) {
    var macro = _x558[0];
    var xs = cut(_x558, 1);
    var esc = function (x, l) {
      return(map(function (_) {
        if (_ === x) {
          return(["quote", _]);
        } else {
          return(_);
        }
      }, l));
    };
    return(["when", ["list?", v], ["return", ["list", ["quote", "let"], ["list", ["quote", v], v], join(["list", ["quote", macro]], esc(v, xs))]]]);
  }});
  setenv("listify", {_stash: true, macro: function (x) {
    if (typeof(x) === "object") {
      return(["let", ["x", x], ["listify", "x"]]);
    }
    return(["if", ["list?", x], x, ["list", x]]);
  }});
  return(undefined);
};
if (typeof(_x581) === "undefined" || _x581 === null) {
  _x581 = true;
  environment42 = [{}];
  target42 = "js";
}
nan = 0 / 0;
inf = 1 / 0;
nan63 = function (n) {
  return(!( n === n));
};
inf63 = function (n) {
  return(n === inf || n === -inf);
};
clip = function (s, from, upto) {
  return(s.substring(from, upto));
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
  var to = min(x.length || 0, upto);
  var i = max(0, from);
  while (i < to) {
    l[j] = x[i];
    j = j + 1;
    i = i + 1;
  }
  var _l6 = x;
  var k = undefined;
  for (k in _l6) {
    var v = _l6[k];
    var _e35;
    if (numeric63(k)) {
      _e35 = parseInt(k);
    } else {
      _e35 = k;
    }
    var _k1 = _e35;
    if (!( typeof(_k1) === "number")) {
      l[_k1] = v;
    }
  }
  return(l);
};
keys = function (x) {
  var l = [];
  var _l7 = x;
  var k = undefined;
  for (k in _l7) {
    var v = _l7[k];
    var _e36;
    if (numeric63(k)) {
      _e36 = parseInt(k);
    } else {
      _e36 = k;
    }
    var _k2 = _e36;
    if (!( typeof(_k2) === "number")) {
      l[_k2] = v;
    }
  }
  return(l);
};
edge = function (x) {
  return((x.length || 0) - 1);
};
inner = function (x) {
  return(clip(x, 1, edge(x)));
};
char = function (s, n) {
  return(s.charAt(n));
};
code = function (s, n) {
  return(s.charCodeAt(n));
};
chr = function (c) {
  return(String.fromCharCode(c));
};
string_literal63 = function (x) {
  return(typeof(x) === "string" && char(x, 0) === "\"");
};
id_literal63 = function (x) {
  return(typeof(x) === "string" && char(x, 0) === "|");
};
add = function (l, x) {
  l.push(x);
  return(undefined);
};
drop = function (l) {
  return(l.pop());
};
last = function (l) {
  return(l[edge(l)]);
};
almost = function (l) {
  if (typeof(l) === "string") {
    return(clip(l, 0, edge(l)));
  } else {
    return(cut(l, 0, edge(l)));
  }
};
rev = function (l) {
  var l1 = keys(l);
  var _i8 = (l.length || 0) - 1;
  while (_i8 >= 0) {
    var x = l[_i8];
    add(l1, x);
    _i8 = _i8 - 1;
  }
  return(l1);
};
reduce = function (f, x) {
  if ((x.length || 0) === 0) {
    return(undefined);
  } else {
    if ((x.length || 0) === 1) {
      return(x[0]);
    } else {
      return(f(x[0], reduce(f, cut(x, 1))));
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
      var _l8 = a;
      var k = undefined;
      for (k in _l8) {
        var v = _l8[k];
        var _e37;
        if (numeric63(k)) {
          _e37 = parseInt(k);
        } else {
          _e37 = k;
        }
        var _k3 = _e37;
        c[_k3] = v;
      }
      var _l9 = b;
      var k = undefined;
      for (k in _l9) {
        var v = _l9[k];
        var _e38;
        if (numeric63(k)) {
          _e38 = parseInt(k);
        } else {
          _e38 = k;
        }
        var _k4 = _e38;
        if (typeof(_k4) === "number") {
          _k4 = _k4 + o;
        }
        c[_k4] = v;
      }
      return(c);
    } else {
      return(a || b || []);
    }
  } else {
    return(reduce(join, ls) || []);
  }
};
find = function (f, l) {
  var _l10 = l;
  var _i11 = undefined;
  for (_i11 in _l10) {
    var x = _l10[_i11];
    var _e39;
    if (numeric63(_i11)) {
      _e39 = parseInt(_i11);
    } else {
      _e39 = _i11;
    }
    var __i11 = _e39;
    var y = f(x);
    if (y) {
      return(y);
    }
  }
};
ontree = function (f, l) {
  var _r146 = unstash(Array.prototype.slice.call(arguments, 2));
  var skip = _r146.skip;
  if (!( skip && skip(l))) {
    var y = f(l);
    if (y) {
      return(y);
    }
    if (! !( typeof(l) === "object")) {
      var _l11 = l;
      var _i12 = undefined;
      for (_i12 in _l11) {
        var x = _l11[_i12];
        var _e40;
        if (numeric63(_i12)) {
          _e40 = parseInt(_i12);
        } else {
          _e40 = _i12;
        }
        var __i12 = _e40;
        var _y = ontree(f, x, {_stash: true, skip: skip});
        if (_y) {
          return(_y);
        }
      }
    }
  }
};
hd_is63 = function (l, val) {
  return(typeof(l) === "object" && l[0] === val);
};
first = function (f, l) {
  var _x583 = l;
  var _n12 = _x583.length || 0;
  var _i13 = 0;
  while (_i13 < _n12) {
    var x = _x583[_i13];
    var y = f(x);
    if (y) {
      return(y);
    }
    _i13 = _i13 + 1;
  }
};
in63 = function (x, l) {
  return(find(function (_) {
    return(x === _);
  }, l));
};
pair = function (l) {
  var l1 = [];
  var i = 0;
  while (i < (l.length || 0)) {
    add(l1, [l[i], l[i + 1]]);
    i = i + 1;
    i = i + 1;
  }
  return(l1);
};
sort = function (l, f) {
  var _e41;
  if (f) {
    _e41 = function (_0, _1) {
      if (f(_0, _1)) {
        return(-1);
      } else {
        return(1);
      }
    };
  }
  return(l.sort(_e41));
};
map = function (f, x) {
  var l = [];
  var _x585 = x;
  var _n13 = _x585.length || 0;
  var _i14 = 0;
  while (_i14 < _n13) {
    var v = _x585[_i14];
    var y = f(v);
    if (!( typeof(y) === "undefined" || y === null)) {
      add(l, y);
    }
    _i14 = _i14 + 1;
  }
  var _l12 = x;
  var k = undefined;
  for (k in _l12) {
    var v = _l12[k];
    var _e42;
    if (numeric63(k)) {
      _e42 = parseInt(k);
    } else {
      _e42 = k;
    }
    var _k5 = _e42;
    if (!( typeof(_k5) === "number")) {
      var y = f(v);
      if (!( typeof(y) === "undefined" || y === null)) {
        l[_k5] = y;
      }
    }
  }
  return(l);
};
keep = function (f, x) {
  return(map(function (_) {
    if (f(_)) {
      return(_);
    }
  }, x));
};
keys63 = function (l) {
  var _l13 = l;
  var k = undefined;
  for (k in _l13) {
    var v = _l13[k];
    var _e43;
    if (numeric63(k)) {
      _e43 = parseInt(k);
    } else {
      _e43 = k;
    }
    var _k6 = _e43;
    if (!( typeof(_k6) === "number")) {
      return(true);
    }
  }
  return(false);
};
empty63 = function (l) {
  var _l14 = l;
  var _i17 = undefined;
  for (_i17 in _l14) {
    var x = _l14[_i17];
    var _e44;
    if (numeric63(_i17)) {
      _e44 = parseInt(_i17);
    } else {
      _e44 = _i17;
    }
    var __i17 = _e44;
    return(false);
  }
  return(true);
};
stash = function (args) {
  if (keys63(args)) {
    var p = [];
    var _l15 = args;
    var k = undefined;
    for (k in _l15) {
      var v = _l15[k];
      var _e45;
      if (numeric63(k)) {
        _e45 = parseInt(k);
      } else {
        _e45 = k;
      }
      var _k7 = _e45;
      if (!( typeof(_k7) === "number")) {
        p[_k7] = v;
      }
    }
    p._stash = true;
    add(args, p);
  }
  return(args);
};
unstash = function (args) {
  if ((args.length || 0) === 0) {
    return([]);
  } else {
    var l = last(args);
    if (typeof(l) === "object" && l._stash) {
      var args1 = almost(args);
      var _l16 = l;
      var k = undefined;
      for (k in _l16) {
        var v = _l16[k];
        var _e46;
        if (numeric63(k)) {
          _e46 = parseInt(k);
        } else {
          _e46 = k;
        }
        var _k8 = _e46;
        if (!( _k8 === "_stash")) {
          args1[_k8] = v;
        }
      }
      return(args1);
    } else {
      return(args);
    }
  }
};
search = function (s, pattern, start) {
  var i = s.indexOf(pattern, start);
  if (i >= 0) {
    return(i);
  }
};
split = function (s, sep) {
  if (s === "" || sep === "") {
    return([]);
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
    return(l);
  }
};
cat = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (_0, _1) {
    return(_0 + _1);
  }, xs) || "");
};
_43 = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (_0, _1) {
    return(_0 + _1);
  }, xs) || 0);
};
_ = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (_0, _1) {
    return(_1 - _0);
  }, rev(xs)) || 0);
};
_42 = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (_0, _1) {
    return(_0 * _1);
  }, xs) || 1);
};
_47 = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (_0, _1) {
    return(_1 / _0);
  }, rev(xs)) || 1);
};
_37 = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (_0, _1) {
    return(_1 % _0);
  }, rev(xs)) || 1);
};
_62 = function (a, b) {
  return(a > b);
};
_60 = function (a, b) {
  return(a < b);
};
is = function (a, b) {
  return(a === b);
};
_6261 = function (a, b) {
  return(a >= b);
};
_6061 = function (a, b) {
  return(a <= b);
};
number = function (s) {
  var n = parseFloat(s);
  if (! isNaN(n)) {
    return(n);
  }
};
number_code63 = function (n) {
  return(n > 47 && n < 58);
};
numeric63 = function (s) {
  var n = s.length || 0;
  var i = 0;
  while (i < n) {
    if (! number_code63(code(s, i))) {
      return(false);
    }
    i = i + 1;
  }
  return(true);
};
var tostring = function (x) {
  return(x.toString());
};
escape = function (s) {
  var s1 = "\"";
  var i = 0;
  while (i < (s.length || 0)) {
    var c = char(s, i);
    var _e47;
    if (c === "\n") {
      _e47 = "\\n";
    } else {
      var _e48;
      if (c === "\"") {
        _e48 = "\\\"";
      } else {
        var _e49;
        if (c === "\\") {
          _e49 = "\\\\";
        } else {
          _e49 = c;
        }
        _e48 = _e49;
      }
      _e47 = _e48;
    }
    var c1 = _e47;
    s1 = s1 + c1;
    i = i + 1;
  }
  return(s1 + "\"");
};
str = function (x, stack) {
  if (typeof(x) === "undefined" || x === null) {
    return("nil");
  } else {
    if (nan63(x)) {
      return("nan");
    } else {
      if (x === inf) {
        return("inf");
      } else {
        if (x === -inf) {
          return("-inf");
        } else {
          if (typeof(x) === "number") {
            return(tostring(x));
          } else {
            if (typeof(x) === "boolean") {
              if (x) {
                return("t");
              } else {
                return("false");
              }
            } else {
              if (typeof(x) === "string") {
                return(escape(x));
              } else {
                if (typeof(x) === "function") {
                  return("fn");
                } else {
                  if (typeof(x) === "object") {
                    if (stack && in63(x, stack)) {
                      return("circular");
                    } else {
                      var s = "(";
                      var sp = "";
                      var fs = [];
                      var xs = [];
                      var ks = [];
                      stack = stack || [];
                      add(stack, x);
                      var _l17 = x;
                      var k = undefined;
                      for (k in _l17) {
                        var v = _l17[k];
                        var _e50;
                        if (numeric63(k)) {
                          _e50 = parseInt(k);
                        } else {
                          _e50 = k;
                        }
                        var _k9 = _e50;
                        if (typeof(_k9) === "number") {
                          xs[_k9] = str(v, stack);
                        } else {
                          if (typeof(v) === "function") {
                            add(fs, _k9);
                          } else {
                            add(ks, _k9 + ":");
                            add(ks, str(v, stack));
                          }
                        }
                      }
                      drop(stack);
                      var _l18 = join(sort(fs), xs, ks);
                      var _i21 = undefined;
                      for (_i21 in _l18) {
                        var v = _l18[_i21];
                        var _e51;
                        if (numeric63(_i21)) {
                          _e51 = parseInt(_i21);
                        } else {
                          _e51 = _i21;
                        }
                        var __i21 = _e51;
                        s = s + sp + v;
                        sp = " ";
                      }
                      return(s + ")");
                    }
                  } else {
                    return(escape(tostring(x)));
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
  var _args = stash(args);
  return(f.apply(f, _args));
};
toplevel63 = function () {
  return((environment42.length || 0) === 1);
};
setenv = function (k) {
  var _r182 = unstash(Array.prototype.slice.call(arguments, 1));
  var _keys = cut(_r182, 0);
  if (typeof(k) === "string") {
    var _e52;
    if (_keys.toplevel) {
      _e52 = environment42[0];
    } else {
      _e52 = last(environment42);
    }
    var frame = _e52;
    var entry = frame[k] || {};
    var _l19 = _keys;
    var _k10 = undefined;
    for (_k10 in _l19) {
      var v = _l19[_k10];
      var _e53;
      if (numeric63(_k10)) {
        _e53 = parseInt(_k10);
      } else {
        _e53 = _k10;
      }
      var _k11 = _e53;
      entry[_k11] = v;
    }
    frame[k] = entry;
    return(frame[k]);
  }
};
print = function (x) {
  return(console.log(x));
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
