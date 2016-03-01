var setup = function () {
  setenv("t", stash33({symbol: true}));
  setenv("js?", stash33({symbol: ["is", "target*", ["quote", "js"]]}));
  setenv("lua?", stash33({symbol: ["is", "target*", ["quote", "lua"]]}));
  var _x15 = ["target"];
  _x15.lua = "_G";
  _x15.js = ["if", ["nil?", "global"], "window", "global"];
  setenv("global*", stash33({symbol: _x15}));
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
    var _l2 = body;
    var k = undefined;
    for (k in _l2) {
      var v = _l2[k];
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
    var _r21 = unstash(Array.prototype.slice.call(arguments, 1));
    var clauses = cut(_r21, 0);
    var e = uniq("e");
    var bs = map(function (_x70) {
      var a = _x70[0];
      var b = _x70[1];
      if (typeof(b) === "undefined" || b === null) {
        return([a]);
      } else {
        return([["is", a, e], b]);
      }
    }, pair(clauses));
    return(["let", [e, x], join(["if"], apply(join, bs))]);
  }}));
  setenv("when", stash33({macro: function (cond) {
    var _r24 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r24, 0);
    return(["if", cond, join(["do"], body)]);
  }}));
  setenv("unless", stash33({macro: function (cond) {
    var _r26 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r26, 0);
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
    var _r32 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r32, 0);
    if (toplevel63()) {
      add(environment42, {});
      var _x109 = macroexpand(join(["let", bs], body));
      drop(environment42);
      return(_x109);
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
        var _id15 = bind(lh, rh);
        var id = _id15[0];
        var val = _id15[1];
        var bs1 = cut(_id15, 2);
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
          var _id61 = !( typeof(lh) === "object");
          var _e18;
          if (_id61) {
            _e18 = _id61;
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
            }, vars), map(function (_x134) {
              var id = _x134[0];
              var val = _x134[1];
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
    var _r40 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r40, 0);
    return(join(["let", [x, v]], body, [x]));
  }}));
  setenv("whenlet", stash33({macro: function (x, v) {
    var _r42 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r42, 0);
    var y = uniq("y");
    return(["let", y, v, ["when", y, join(["let", [x, y]], body)]]);
  }}));
  setenv("mac", stash33({macro: function (name, args) {
    var _r44 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r44, 0);
    var _x158 = ["setenv", ["quote", name]];
    _x158.macro = join(["fn", args], body);
    var form = _x158;
    eval(form);
    return(form);
  }}));
  setenv("defspecial", stash33({macro: function (name, args) {
    var _r46 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r46, 0);
    var _x165 = ["setenv", ["quote", name]];
    _x165.special = join(["fn", args], body);
    var form = join(_x165, keys(body));
    eval(form);
    return(form);
  }}));
  setenv("defsym", stash33({macro: function (name, expansion) {
    setenv(name, stash33({symbol: expansion}));
    var _x171 = ["setenv", ["quote", name]];
    _x171.symbol = ["quote", expansion];
    return(_x171);
  }}));
  setenv("var", stash33({macro: function (name, x) {
    var _r50 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r50, 0);
    setenv(name, stash33({variable: true}));
    if ((body.length || 0) > 0) {
      return(join(["%local-function", name], bind42(x, body)));
    } else {
      return(["%local", name, x]);
    }
  }}));
  setenv("def", stash33({macro: function (name, x) {
    var _r52 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r52, 0);
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
  setenv("w/bindings", stash33({macro: function (_x202) {
    var names = _x202[0];
    var _r54 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r54, 0);
    var x = uniq("x");
    var _x205 = ["setenv", x];
    _x205.variable = true;
    return(join(["w/frame", ["each", x, names, _x205]], body));
  }}));
  setenv("w/mac", stash33({macro: function (name, args, definition) {
    var _r56 = unstash(Array.prototype.slice.call(arguments, 3));
    var body = cut(_r56, 0);
    add(environment42, {});
    macroexpand(["mac", name, args, definition]);
    var _x210 = join(["do"], macroexpand(body));
    drop(environment42);
    return(_x210);
  }}));
  setenv("w/sym", stash33({macro: function (expansions) {
    var _r59 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r59, 0);
    if (!( typeof(expansions) === "object")) {
      return(join(["w/sym", [expansions, body[0]]], cut(body, 1)));
    } else {
      add(environment42, {});
      map(function (_x223) {
        var name = _x223[0];
        var exp = _x223[1];
        return(macroexpand(["defsym", name, exp]));
      }, pair(expansions));
      var _x222 = join(["do"], macroexpand(body));
      drop(environment42);
      return(_x222);
    }
  }}));
  setenv("w/uniq", stash33({macro: function (names) {
    var _r63 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r63, 0);
    if (!( typeof(names) === "object")) {
      names = [names];
    }
    return(join(["let", apply(join, map(function (_) {
      return([_, ["uniq", ["quote", _]]]);
    }, names))], body));
  }}));
  setenv("fn", stash33({macro: function (args) {
    var _r66 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r66, 0);
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
    var _r70 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r70, 0);
    return(["let", i, 0, join(["while", ["<", i, n]], body, [["++", i]])]);
  }}));
  setenv("step", stash33({macro: function (v, l) {
    var _r72 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r72, 0);
    var index = _r72.index;
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
    var _r74 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r74, 0);
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
    var _id54 = _e22;
    var k = _id54[0];
    var v = _id54[1];
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
    var _l4 = xs;
    var _i4 = undefined;
    for (_i4 in _l4) {
      var x = _l4[_i4];
      var _e25;
      if (numeric63(_i4)) {
        _e25 = parseInt(_i4);
      } else {
        _e25 = _i4;
      }
      var __i4 = _e25;
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
    var _r78 = unstash(Array.prototype.slice.call(arguments, 1));
    var bs = cut(_r78, 0);
    return(["=", a, join(["join", a], bs)]);
  }}));
  setenv("cat!", stash33({macro: function (a) {
    var _r80 = unstash(Array.prototype.slice.call(arguments, 1));
    var bs = cut(_r80, 0);
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
      var _l6 = names;
      var _i6 = undefined;
      for (_i6 in _l6) {
        var k = _l6[_i6];
        var _e26;
        if (numeric63(_i6)) {
          _e26 = parseInt(_i6);
        } else {
          _e26 = _i6;
        }
        var __i6 = _e26;
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
    var _x437 = ["target"];
    _x437.lua = ["%len", x];
    _x437.js = ["or", ["get", x, ["quote", "length"]], 0];
    return(_x437);
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
    var _x467 = ["target"];
    _x467.lua = "type";
    _x467.js = "typeof";
    return(["is", [_x467, x], y]);
  }}));
  setenv("list?", stash33({macro: function (x) {
    var _x473 = ["target"];
    _x473.lua = ["quote", "table"];
    _x473.js = ["quote", "object"];
    return(["isa", x, _x473]);
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
if (typeof(_x494) === "undefined" || _x494 === null) {
  _x494 = true;
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
  var _l7 = x;
  var k = undefined;
  for (k in _l7) {
    var v = _l7[k];
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
  var _l8 = x;
  var k = undefined;
  for (k in _l8) {
    var v = _l8[k];
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
      var _l9 = a;
      var k = undefined;
      for (k in _l9) {
        var v = _l9[k];
        var _e29;
        if (numeric63(k)) {
          _e29 = parseInt(k);
        } else {
          _e29 = k;
        }
        var _k3 = _e29;
        c[_k3] = v;
      }
      var _l10 = b;
      var k = undefined;
      for (k in _l10) {
        var v = _l10[k];
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
  var _l11 = l;
  var _i11 = undefined;
  for (_i11 in _l11) {
    var x = _l11[_i11];
    var _e31;
    if (numeric63(_i11)) {
      _e31 = parseInt(_i11);
    } else {
      _e31 = _i11;
    }
    var __i11 = _e31;
    var y = f(x);
    if (y) {
      return(y);
    }
  }
};
first = function (f, l) {
  var _x496 = l;
  var _n12 = _x496.length || 0;
  var _i12 = 0;
  while (_i12 < _n12) {
    var x = _x496[_i12];
    var y = f(x);
    if (y) {
      return(y);
    }
    _i12 = _i12 + 1;
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
  var _x498 = x;
  var _n13 = _x498.length || 0;
  var i = 0;
  while (i < _n13) {
    var v = _x498[i];
    var y = f(v, stash33({key: i}));
    if (!( typeof(y) === "undefined" || y === null)) {
      add(l, y);
    }
    i = i + 1;
  }
  var _l12 = x;
  var k = undefined;
  for (k in _l12) {
    var v = _l12[k];
    var _e33;
    if (numeric63(k)) {
      _e33 = parseInt(k);
    } else {
      _e33 = k;
    }
    var _k5 = _e33;
    if (!( typeof(_k5) === "number")) {
      var y = f(v, stash33({key: _k5}));
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
  var _l14 = l;
  var _i15 = undefined;
  for (_i15 in _l14) {
    var x = _l14[_i15];
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
    var _l15 = keys42;
    var k = undefined;
    for (k in _l15) {
      var v = _l15[k];
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
                      var _l16 = x;
                      var k = undefined;
                      for (k in _l16) {
                        var v = _l16[k];
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
                      var _l17 = join(sort(fs), xs, ks);
                      var _i18 = undefined;
                      for (_i18 in _l17) {
                        var v = _l17[_i18];
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
  var _r179 = unstash(Array.prototype.slice.call(arguments, 1));
  var _keys = cut(_r179, 0);
  if (typeof(k) === "string") {
    var _e42;
    if (_keys.toplevel) {
      _e42 = environment42[0];
    } else {
      _e42 = last(environment42);
    }
    var frame = _e42;
    var entry = frame[k] || {};
    var _l18 = _keys;
    var _k9 = undefined;
    for (_k9 in _l18) {
      var v = _l18[_k9];
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
