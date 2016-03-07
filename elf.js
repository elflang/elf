var setup = function () {
  setenv("t", stash33({symbol: true}));
  setenv("js?", stash33({symbol: ["is", "target*", ["quote", "js"]]}));
  setenv("lua?", stash33({symbol: ["is", "target*", ["quote", "lua"]]}));
  var _x4 = ["target"];
  _x4.lua = "_G";
  _x4.js = ["if", ["nil?", "global"], "window", "global"];
  setenv("global*", stash33({symbol: _x4}));
  setenv("%js", stash33({macro: function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    if (target42 === "js") {
      return(join(["do"], forms));
    }
  }}));
  setenv("%lua", stash33({macro: function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    if (target42 === "lua") {
      return(join(["do"], forms));
    }
  }}));
  setenv("quote", stash33({macro: function (form) {
    return(quoted(form));
  }}));
  setenv("quasiquote", stash33({macro: function (form) {
    return(quasiexpand(form, 1));
  }}));
  setenv("at", stash33({macro: function (l, i) {
    if (typeof(i) === "number" && i < 0) {
      if (typeof(l) === "object") {
        return(["let", "l", l, ["at", "l", i]]);
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
    return(["get", l, i]);
  }}));
  setenv("wipe", stash33({macro: function (place) {
    if (target42 === "lua") {
      return(["assign", place, "nil"]);
    } else {
      return(["%delete", place]);
    }
  }}));
  setenv("list", stash33({macro: function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    var x = uniq("x");
    var l = [];
    var forms = [];
    var _l1 = body;
    var k = undefined;
    for (k in _l1) {
      var v = _l1[k];
      var _e15;
      if (numeric63(k)) {
        _e15 = parseInt(k);
      } else {
        _e15 = k;
      }
      var _k = _e15;
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
  }}));
  setenv("xform", stash33({macro: function (l, body) {
    return(["map", ["%fn", ["do", body]], l]);
  }}));
  setenv("if", stash33({macro: function () {
    var branches = unstash(Array.prototype.slice.call(arguments, 0));
    return(expand_if(branches)[0]);
  }}));
  setenv("case", stash33({macro: function (x) {
    var _r13 = unstash(Array.prototype.slice.call(arguments, 1));
    var clauses = cut(_r13, 0);
    var e = uniq("e");
    var bs = map(function (_x59) {
      var a = _x59[0];
      var b = _x59[1];
      if (typeof(b) === "undefined" || b === null) {
        return([a]);
      } else {
        return([["is", a, e], b]);
      }
    }, pair(clauses));
    return(["let", [e, x], join(["if"], apply(join, bs))]);
  }}));
  setenv("when", stash33({macro: function (cond) {
    var _r16 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r16, 0);
    return(["if", cond, join(["do"], body)]);
  }}));
  setenv("unless", stash33({macro: function (cond) {
    var _r18 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r18, 0);
    return(["if", ["not", cond], join(["do"], body)]);
  }}));
  setenv("assert", stash33({macro: function (cond) {
    var x = "assert: " + str(cond);
    return(["unless", cond, ["error", ["quote", x]]]);
  }}));
  setenv("obj", stash33({macro: function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    return(join(["%object"], mapo(function (_) {
      return(_);
    }, body)));
  }}));
  setenv("let", stash33({macro: function (bs) {
    var _r24 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r24, 0);
    if (toplevel63()) {
      add(environment42, {});
      var _x98 = macroexpand(join(["let", bs], body));
      drop(environment42);
      return(_x98);
    }
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
          setenv(id, stash33({variable: true}));
        }
        return(["do", ["%local", id, val], ["w/sym", renames, join(["let", join(bs1, bs2)], body)]]);
      }
    }
  }}));
  setenv("=", stash33({macro: function () {
    var l = unstash(Array.prototype.slice.call(arguments, 0));
    var _e7 = l.length || 0;
    if (0 === _e7) {
      return(undefined);
    } else {
      if (1 === _e7) {
        return(join(["="], l, ["nil"]));
      } else {
        if (2 === _e7) {
          var lh = l[0];
          var rh = l[1];
          var _id63 = !( typeof(lh) === "object");
          var _e18;
          if (_id63) {
            _e18 = _id63;
          } else {
            var _e8 = lh[0];
            var _e19;
            if ("at" === _e8) {
              _e19 = true;
            } else {
              var _e20;
              if ("get" === _e8) {
                _e20 = true;
              }
              _e19 = _e20;
            }
            _e18 = _e19;
          }
          if (_e18) {
            return(["assign", lh, rh]);
          } else {
            var vars = [];
            var forms = bind(lh, rh, vars);
            return(join(["do"], map(function (_) {
              return(["var", _]);
            }, vars), map(function (_x123) {
              var id = _x123[0];
              var val = _x123[1];
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
  }}));
  setenv("with", stash33({macro: function (x, v) {
    var _r32 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r32, 0);
    return(join(["let", [x, v]], body, [x]));
  }}));
  setenv("iflet", stash33({macro: function (_var, expr, _then) {
    var _r34 = unstash(Array.prototype.slice.call(arguments, 3));
    var rest = cut(_r34, 0);
    if (!( typeof(_var) === "object")) {
      return(["let", _var, expr, join(["if", _var, _then], rest)]);
    } else {
      var gv = uniq("if");
      return(["let", gv, expr, join(["if", gv, ["let", [_var, gv], _then]], rest)]);
    }
  }}));
  setenv("whenlet", stash33({macro: function (_var, expr) {
    var _r36 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r36, 0);
    return(["iflet", _var, expr, join(["do"], body)]);
  }}));
  setenv("do1", stash33({macro: function (x) {
    var _r38 = unstash(Array.prototype.slice.call(arguments, 1));
    var ys = cut(_r38, 0);
    var g = uniq("do");
    return(join(["let", g, x], ys, [g]));
  }}));
  setenv("mac", stash33({macro: function (name, args) {
    var _r40 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r40, 0);
    var _x161 = ["setenv", ["quote", name]];
    _x161.macro = join(["fn", args], body);
    var form = _x161;
    eval(form);
    return(form);
  }}));
  setenv("defspecial", stash33({macro: function (name, args) {
    var _r42 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r42, 0);
    var _x168 = ["setenv", ["quote", name]];
    _x168.special = join(["fn", args], body);
    var form = join(_x168, keys(body));
    eval(form);
    return(form);
  }}));
  setenv("defsym", stash33({macro: function (name, expansion) {
    setenv(name, stash33({symbol: expansion}));
    var _x174 = ["setenv", ["quote", name]];
    _x174.symbol = ["quote", expansion];
    return(_x174);
  }}));
  setenv("var", stash33({macro: function (name, x) {
    var _r46 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r46, 0);
    setenv(name, stash33({variable: true}));
    if ((body.length || 0) > 0) {
      return(join(["%local-function", name], bind42(x, body)));
    } else {
      return(["%local", name, x]);
    }
  }}));
  setenv("def", stash33({macro: function (name, x) {
    var _r48 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r48, 0);
    setenv(name, stash33({toplevel: true, variable: true}));
    if ((body.length || 0) > 0) {
      return(join(["%global-function", name], bind42(x, body)));
    } else {
      return(["=", name, x]);
    }
  }}));
  setenv("w/frame", stash33({macro: function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    var x = uniq("x");
    return(["do", ["add", "environment*", ["obj"]], ["with", x, join(["do"], body), ["drop", "environment*"]]]);
  }}));
  setenv("w/bindings", stash33({macro: function (_x205) {
    var names = _x205[0];
    var _r50 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r50, 0);
    var x = uniq("x");
    var _x208 = ["setenv", x];
    _x208.variable = true;
    return(join(["w/frame", ["each", x, names, _x208]], body));
  }}));
  setenv("w/mac", stash33({macro: function (name, args, definition) {
    var _r52 = unstash(Array.prototype.slice.call(arguments, 3));
    var body = cut(_r52, 0);
    add(environment42, {});
    macroexpand(["mac", name, args, definition]);
    var _x213 = join(["do"], macroexpand(body));
    drop(environment42);
    return(_x213);
  }}));
  setenv("w/sym", stash33({macro: function (expansions) {
    var _r55 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r55, 0);
    if (!( typeof(expansions) === "object")) {
      return(join(["w/sym", [expansions, body[0]]], cut(body, 1)));
    } else {
      add(environment42, {});
      map(function (_x226) {
        var name = _x226[0];
        var exp = _x226[1];
        return(macroexpand(["defsym", name, exp]));
      }, pair(expansions));
      var _x225 = join(["do"], macroexpand(body));
      drop(environment42);
      return(_x225);
    }
  }}));
  setenv("w/uniq", stash33({macro: function (names) {
    var _r59 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r59, 0);
    if (!( typeof(names) === "object")) {
      names = [names];
    }
    return(join(["let", apply(join, map(function (_) {
      return([_, ["uniq", ["quote", _]]]);
    }, names))], body));
  }}));
  setenv("fn", stash33({macro: function (args) {
    var _r62 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r62, 0);
    return(join(["%function"], bind42(args, body)));
  }}));
  setenv("guard", stash33({macro: function (expr) {
    if (target42 === "js") {
      return([["%fn", ["%try", ["list", "t", expr]]]]);
    } else {
      var x = uniq("x");
      var msg = uniq("msg");
      var trace = uniq("trace");
      return(["let", [x, "nil", msg, "nil", trace, "nil"], ["if", ["xpcall", ["%fn", ["=", x, expr]], ["%fn", ["do", ["=", msg, ["clip", "_", ["+", ["search", "_", "\": \""], 2]]], ["=", trace, [["get", "debug", ["quote", "traceback"]]]]]]], ["list", "t", x], ["list", false, msg, trace]]]);
    }
  }}));
  setenv("for", stash33({macro: function (i, n) {
    var _r66 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r66, 0);
    return(["let", i, 0, join(["while", ["<", i, n]], body, [["++", i]])]);
  }}));
  setenv("step", stash33({macro: function (v, l) {
    var _r68 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r68, 0);
    var index = _r68.index;
    var _e21;
    if (typeof(index) === "undefined" || index === null) {
      _e21 = uniq("i");
    } else {
      _e21 = index;
    }
    var i = _e21;
    if (i === true) {
      i = "index";
    }
    var x = uniq("x");
    var n = uniq("n");
    return(["let", [x, l, n, ["len", x]], ["for", i, n, join(["let", [v, ["at", x, i]]], body)]]);
  }}));
  setenv("each", stash33({macro: function (x, lst) {
    var _r70 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r70, 0);
    var l = uniq("l");
    var n = uniq("n");
    var i = uniq("i");
    var _e22;
    if (!( typeof(x) === "object")) {
      _e22 = [i, x];
    } else {
      var _e23;
      if ((x.length || 0) > 1) {
        _e23 = x;
      } else {
        _e23 = [i, x[0]];
      }
      _e22 = _e23;
    }
    var _id56 = _e22;
    var k = _id56[0];
    var v = _id56[1];
    var _e24;
    if (target42 === "lua") {
      _e24 = body;
    } else {
      _e24 = [join(["let", k, ["if", ["numeric?", k], ["parseInt", k], k]], body)];
    }
    return(["let", [l, lst, k, "nil"], ["%for", l, k, join(["let", [v, ["get", l, k]]], _e24)]]);
  }}));
  setenv("set-of", stash33({macro: function () {
    var xs = unstash(Array.prototype.slice.call(arguments, 0));
    var l = [];
    var _l3 = xs;
    var _i3 = undefined;
    for (_i3 in _l3) {
      var x = _l3[_i3];
      var _e25;
      if (numeric63(_i3)) {
        _e25 = parseInt(_i3);
      } else {
        _e25 = _i3;
      }
      var __i3 = _e25;
      l[x] = true;
    }
    return(join(["obj"], l));
  }}));
  setenv("language", stash33({macro: function () {
    return(["quote", target42]);
  }}));
  setenv("target", stash33({macro: function () {
    var clauses = unstash(Array.prototype.slice.call(arguments, 0));
    return(clauses[target42]);
  }}));
  setenv("join!", stash33({macro: function (a) {
    var _r74 = unstash(Array.prototype.slice.call(arguments, 1));
    var bs = cut(_r74, 0);
    return(["=", a, join(["join", a], bs)]);
  }}));
  setenv("cat!", stash33({macro: function (a) {
    var _r76 = unstash(Array.prototype.slice.call(arguments, 1));
    var bs = cut(_r76, 0);
    return(["=", a, join(["cat", a], bs)]);
  }}));
  setenv("++", stash33({macro: function (n, by) {
    return(["=", n, ["+", n, by || 1]]);
  }}));
  setenv("--", stash33({macro: function (n, by) {
    return(["=", n, ["-", n, by || 1]]);
  }}));
  setenv("export", stash33({macro: function () {
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
        var _e26;
        if (numeric63(_i5)) {
          _e26 = parseInt(_i5);
        } else {
          _e26 = _i5;
        }
        var __i5 = _e26;
        x[k] = k;
      }
      return(["return", join(["obj"], x)]);
    }
  }}));
  setenv("%compile-time", stash33({macro: function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    eval(join(["do"], forms));
    return(undefined);
  }}));
  setenv("once", stash33({macro: function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    var x = uniq("x");
    return(["when", ["nil?", x], ["=", x, "t"], join(["let", join()], forms)]);
  }}));
  setenv("elf", stash33({macro: function () {
    return(["require", ["quote", "elf"]]);
  }}));
  setenv("lib", stash33({macro: function () {
    var modules = unstash(Array.prototype.slice.call(arguments, 0));
    return(join(["do"], map(function (_) {
      return(["def", _, ["require", ["quote", _]]]);
    }, modules)));
  }}));
  setenv("use", stash33({macro: function () {
    var modules = unstash(Array.prototype.slice.call(arguments, 0));
    return(join(["do"], map(function (_) {
      return(["var", _, ["require", ["quote", _]]]);
    }, modules)));
  }}));
  setenv("nil?", stash33({macro: function (x) {
    if (target42 === "lua") {
      return(["is", x, "nil"]);
    } else {
      if (typeof(x) === "object") {
        return(["let", "x", x, ["nil?", "x"]]);
      } else {
        return(["or", ["is", ["typeof", x], ["quote", "undefined"]], ["is", x, "null"]]);
      }
    }
  }}));
  setenv("hd", stash33({macro: function (l) {
    return(["at", l, 0]);
  }}));
  setenv("tl", stash33({macro: function (l) {
    return(["cut", l, 1]);
  }}));
  setenv("%len", stash33({special: function (x) {
    return("#(" + compile(x) + ")");
  }}));
  setenv("len", stash33({macro: function (x) {
    var _x440 = ["target"];
    _x440.lua = ["%len", x];
    _x440.js = ["or", ["get", x, ["quote", "length"]], 0];
    return(_x440);
  }}));
  setenv("edge", stash33({macro: function (x) {
    return(["-", ["len", x], 1]);
  }}));
  setenv("one?", stash33({macro: function (x) {
    return(["is", ["len", x], 1]);
  }}));
  setenv("two?", stash33({macro: function (x) {
    return(["is", ["len", x], 2]);
  }}));
  setenv("some?", stash33({macro: function (x) {
    return([">", ["len", x], 0]);
  }}));
  setenv("none?", stash33({macro: function (x) {
    return(["is", ["len", x], 0]);
  }}));
  setenv("isa", stash33({macro: function (x, y) {
    var _x470 = ["target"];
    _x470.lua = "type";
    _x470.js = "typeof";
    return(["is", [_x470, x], y]);
  }}));
  setenv("list?", stash33({macro: function (x) {
    var _x476 = ["target"];
    _x476.lua = ["quote", "table"];
    _x476.js = ["quote", "object"];
    return(["isa", x, _x476]);
  }}));
  setenv("atom?", stash33({macro: function (x) {
    return(["~list?", x]);
  }}));
  setenv("bool?", stash33({macro: function (x) {
    return(["isa", x, ["quote", "boolean"]]);
  }}));
  setenv("num?", stash33({macro: function (x) {
    return(["isa", x, ["quote", "number"]]);
  }}));
  setenv("str?", stash33({macro: function (x) {
    return(["isa", x, ["quote", "string"]]);
  }}));
  setenv("fn?", stash33({macro: function (x) {
    return(["isa", x, ["quote", "function"]]);
  }}));
  return(undefined);
};
if (typeof(_x497) === "undefined" || _x497 === null) {
  _x497 = true;
  environment42 = [{}];
  target42 = "js";
  keys42 = undefined;
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
  var i = max(0, from);
  var to = min(x.length || 0, upto);
  while (i < to) {
    l[j] = x[i];
    i = i + 1;
    j = j + 1;
  }
  var _l6 = x;
  var k = undefined;
  for (k in _l6) {
    var v = _l6[k];
    var _e27;
    if (numeric63(k)) {
      _e27 = parseInt(k);
    } else {
      _e27 = k;
    }
    var _k1 = _e27;
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
    var _e28;
    if (numeric63(k)) {
      _e28 = parseInt(k);
    } else {
      _e28 = k;
    }
    var _k2 = _e28;
    if (!( typeof(_k2) === "number")) {
      l[_k2] = v;
    }
  }
  return(l);
};
inner = function (x) {
  return(clip(x, 1, (x.length || 0) - 1));
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
  return(l[(l.length || 0) - 1]);
};
almost = function (l) {
  return(cut(l, 0, (l.length || 0) - 1));
};
rev = function (l) {
  var l1 = keys(l);
  var n = (l.length || 0) - 1;
  var i = 0;
  while (i < (l.length || 0)) {
    add(l1, l[n - i]);
    i = i + 1;
  }
  return(l1);
};
reduce = function (f, x) {
  var _e13 = x.length || 0;
  if (0 === _e13) {
    return(undefined);
  } else {
    if (1 === _e13) {
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
        var _e29;
        if (numeric63(k)) {
          _e29 = parseInt(k);
        } else {
          _e29 = k;
        }
        var _k3 = _e29;
        c[_k3] = v;
      }
      var _l9 = b;
      var k = undefined;
      for (k in _l9) {
        var v = _l9[k];
        var _e30;
        if (numeric63(k)) {
          _e30 = parseInt(k);
        } else {
          _e30 = k;
        }
        var _k4 = _e30;
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
  var _i10 = undefined;
  for (_i10 in _l10) {
    var x = _l10[_i10];
    var _e31;
    if (numeric63(_i10)) {
      _e31 = parseInt(_i10);
    } else {
      _e31 = _i10;
    }
    var __i10 = _e31;
    var y = f(x);
    if (y) {
      return(y);
    }
  }
};
first = function (f, l) {
  var _x499 = l;
  var _n11 = _x499.length || 0;
  var _i11 = 0;
  while (_i11 < _n11) {
    var x = _x499[_i11];
    var y = f(x);
    if (y) {
      return(y);
    }
    _i11 = _i11 + 1;
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
  var _e32;
  if (f) {
    _e32 = function (_0, _1) {
      if (f(_0, _1)) {
        return(-1);
      } else {
        return(1);
      }
    };
  }
  return(l.sort(_e32));
};
map = function (f, x) {
  var l = [];
  var _x501 = x;
  var _n12 = _x501.length || 0;
  var _i12 = 0;
  while (_i12 < _n12) {
    var v = _x501[_i12];
    var y = f(v);
    if (!( typeof(y) === "undefined" || y === null)) {
      add(l, y);
    }
    _i12 = _i12 + 1;
  }
  var _l11 = x;
  var k = undefined;
  for (k in _l11) {
    var v = _l11[k];
    var _e33;
    if (numeric63(k)) {
      _e33 = parseInt(k);
    } else {
      _e33 = k;
    }
    var _k5 = _e33;
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
  var _l12 = l;
  var k = undefined;
  for (k in _l12) {
    var v = _l12[k];
    var _e34;
    if (numeric63(k)) {
      _e34 = parseInt(k);
    } else {
      _e34 = k;
    }
    var _k6 = _e34;
    if (!( typeof(_k6) === "number")) {
      return(true);
    }
  }
  return(false);
};
empty63 = function (l) {
  var _l13 = l;
  var _i15 = undefined;
  for (_i15 in _l13) {
    var x = _l13[_i15];
    var _e35;
    if (numeric63(_i15)) {
      _e35 = parseInt(_i15);
    } else {
      _e35 = _i15;
    }
    var __i15 = _e35;
    return(false);
  }
  return(true);
};
stash33 = function (args) {
  keys42 = args;
  return(undefined);
};
unstash = function (args) {
  if (keys42) {
    var _l14 = keys42;
    var k = undefined;
    for (k in _l14) {
      var v = _l14[k];
      var _e36;
      if (numeric63(k)) {
        _e36 = parseInt(k);
      } else {
        _e36 = k;
      }
      var _k7 = _e36;
      args[_k7] = v;
    }
    keys42 = undefined;
  }
  return(args);
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
_42 = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (_0, _1) {
    return(_0 * _1);
  }, xs) || 1);
};
_ = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (_0, _1) {
    return(_1 - _0);
  }, rev(xs)) || 0);
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
    var _e14 = c;
    var _e37;
    if ("\n" === _e14) {
      _e37 = "\\n";
    } else {
      var _e38;
      if ("\"" === _e14) {
        _e38 = "\\\"";
      } else {
        var _e39;
        if ("\\" === _e14) {
          _e39 = "\\\\";
        } else {
          _e39 = c;
        }
        _e38 = _e39;
      }
      _e37 = _e38;
    }
    s1 = s1 + _e37;
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
                  if (false) {
                    return(escape(tostring(x)));
                  } else {
                    if (stack && in63(x, stack)) {
                      return("circular");
                    } else {
                      var s = "(";
                      var sp = "";
                      var fs = [];
                      var xs = [];
                      var ks = [];
                      var _stack = stack || [];
                      add(_stack, x);
                      var _l15 = x;
                      var k = undefined;
                      for (k in _l15) {
                        var v = _l15[k];
                        var _e40;
                        if (numeric63(k)) {
                          _e40 = parseInt(k);
                        } else {
                          _e40 = k;
                        }
                        var _k8 = _e40;
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
                      var _l16 = join(sort(fs), xs, ks);
                      var _i18 = undefined;
                      for (_i18 in _l16) {
                        var v = _l16[_i18];
                        var _e41;
                        if (numeric63(_i18)) {
                          _e41 = parseInt(_i18);
                        } else {
                          _e41 = _i18;
                        }
                        var __i18 = _e41;
                        s = s + sp + v;
                        sp = " ";
                      }
                      return(s + ")");
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
  return(f.apply(f, args));
};
toplevel63 = function () {
  return((environment42.length || 0) === 1);
};
setenv = function (k) {
  var _r175 = unstash(Array.prototype.slice.call(arguments, 1));
  var _keys = cut(_r175, 0);
  if (typeof(k) === "string") {
    var _e42;
    if (_keys.toplevel) {
      _e42 = environment42[0];
    } else {
      _e42 = last(environment42);
    }
    var frame = _e42;
    var entry = frame[k] || {};
    var _l17 = _keys;
    var _k9 = undefined;
    for (_k9 in _l17) {
      var v = _l17[_k9];
      var _e43;
      if (numeric63(_k9)) {
        _e43 = parseInt(_k9);
      } else {
        _e43 = _k9;
      }
      var _k10 = _e43;
      entry[_k10] = v;
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
