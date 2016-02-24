var setup = function () {
  setenv("t", {_stash: true, symbol: true});
  setenv("js?", {_stash: true, symbol: ["is", "target*", ["quote", "js"]]});
  setenv("lua?", {_stash: true, symbol: ["is", "target*", ["quote", "lua"]]});
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
  setenv("quote", {_stash: true, macro: function (form) {
    return(quoted(form));
  }});
  setenv("quasiquote", {_stash: true, macro: function (form) {
    return(quasiexpand(form, 1));
  }});
  setenv("at", {_stash: true, macro: function (l, i) {
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
      var _e14;
      if (numeric63(k)) {
        _e14 = parseInt(k);
      } else {
        _e14 = k;
      }
      var _k = _e14;
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
    var bs = map(function (_x56) {
      var a = _x56[0];
      var b = _x56[1];
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
    if (toplevel63()) {
      add(environment42, {});
      var _x95 = macroexpand(join(["let", bs], body));
      drop(environment42);
      return(_x95);
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
          setenv(id, {_stash: true, variable: true});
        }
        return(["do", ["%local", id, val], ["w/sym", renames, join(["let", join(bs1, bs2)], body)]]);
      }
    }
  }});
  setenv("=", {_stash: true, macro: function () {
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
          var _id59 = !( typeof(lh) === "object");
          var _e17;
          if (_id59) {
            _e17 = _id59;
          } else {
            var _e8 = lh[0];
            var _e18;
            if ("at" === _e8) {
              _e18 = true;
            } else {
              var _e19;
              if ("get" === _e8) {
                _e19 = true;
              }
              _e18 = _e19;
            }
            _e17 = _e18;
          }
          if (_e17) {
            return(["assign", lh, rh]);
          } else {
            var vars = [];
            var forms = bind(lh, rh, vars);
            return(join(["do"], map(function (_) {
              return(["var", _]);
            }, vars), map(function (_x120) {
              var id = _x120[0];
              var val = _x120[1];
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
    var _x144 = ["setenv", ["quote", name]];
    _x144.macro = join(["fn", args], body);
    var form = _x144;
    eval(form);
    return(form);
  }});
  setenv("defspecial", {_stash: true, macro: function (name, args) {
    var _r38 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r38, 0);
    var _x151 = ["setenv", ["quote", name]];
    _x151.special = join(["fn", args], body);
    var form = join(_x151, keys(body));
    eval(form);
    return(form);
  }});
  setenv("defsym", {_stash: true, macro: function (name, expansion) {
    setenv(name, {_stash: true, symbol: expansion});
    var _x157 = ["setenv", ["quote", name]];
    _x157.symbol = ["quote", expansion];
    return(_x157);
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
  setenv("w/bindings", {_stash: true, macro: function (_x188) {
    var names = _x188[0];
    var _r46 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r46, 0);
    var x = uniq("x");
    var _x191 = ["setenv", x];
    _x191.variable = true;
    return(join(["w/frame", ["each", x, names, _x191]], body));
  }});
  setenv("w/mac", {_stash: true, macro: function (name, args, definition) {
    var _r48 = unstash(Array.prototype.slice.call(arguments, 3));
    var body = cut(_r48, 0);
    add(environment42, {});
    macroexpand(["mac", name, args, definition]);
    var _x196 = join(["do"], macroexpand(body));
    drop(environment42);
    return(_x196);
  }});
  setenv("w/sym", {_stash: true, macro: function (expansions) {
    var _r51 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r51, 0);
    if (!( typeof(expansions) === "object")) {
      return(join(["w/sym", [expansions, body[0]]], cut(body, 1)));
    } else {
      add(environment42, {});
      map(function (_x209) {
        var name = _x209[0];
        var exp = _x209[1];
        return(macroexpand(["defsym", name, exp]));
      }, pair(expansions));
      var _x208 = join(["do"], macroexpand(body));
      drop(environment42);
      return(_x208);
    }
  }});
  setenv("w/uniq", {_stash: true, macro: function (names) {
    var _r55 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r55, 0);
    if (!( typeof(names) === "object")) {
      names = [names];
    }
    return(join(["let", apply(join, map(function (_) {
      return([_, ["uniq", ["quote", _]]]);
    }, names))], body));
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
  setenv("for", {_stash: true, macro: function (i, n) {
    var _r62 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r62, 0);
    return(["let", [i, 0], join(["while", ["<", i, n]], body, [["++", i]])]);
  }});
  setenv("step", {_stash: true, macro: function (v, l) {
    var _r64 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r64, 0);
    var x = uniq("x");
    var n = uniq("n");
    var i = uniq("i");
    return(["let", [x, l, n, ["len", x]], ["for", i, n, join(["let", [v, ["at", x, i]]], body)]]);
  }});
  setenv("each", {_stash: true, macro: function (x, lst) {
    var _r66 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r66, 0);
    var l = uniq("l");
    var n = uniq("n");
    var i = uniq("i");
    var _e20;
    if (!( typeof(x) === "object")) {
      _e20 = [i, x];
    } else {
      var _e21;
      if ((x.length || 0) > 1) {
        _e21 = x;
      } else {
        _e21 = [i, x[0]];
      }
      _e20 = _e21;
    }
    var _id52 = _e20;
    var k = _id52[0];
    var v = _id52[1];
    var _e22;
    if (target42 === "lua") {
      _e22 = body;
    } else {
      _e22 = [join(["let", k, ["if", ["numeric?", k], ["parseInt", k], k]], body)];
    }
    return(["let", [l, lst, k, "nil"], ["%for", l, k, join(["let", [v, ["get", l, k]]], _e22)]]);
  }});
  setenv("set-of", {_stash: true, macro: function () {
    var xs = unstash(Array.prototype.slice.call(arguments, 0));
    var l = [];
    var _l3 = xs;
    var _i3 = undefined;
    for (_i3 in _l3) {
      var x = _l3[_i3];
      var _e23;
      if (numeric63(_i3)) {
        _e23 = parseInt(_i3);
      } else {
        _e23 = _i3;
      }
      var __i3 = _e23;
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
        var _e24;
        if (numeric63(_i5)) {
          _e24 = parseInt(_i5);
        } else {
          _e24 = _i5;
        }
        var __i5 = _e24;
        x[k] = k;
      }
      return(["return", join(["obj"], x)]);
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
    return(["when", ["nil?", x], ["=", x, "t"], join(["let", join()], forms)]);
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
    var _x410 = ["target"];
    _x410.lua = ["is", x, "nil"];
    var _e25;
    if (typeof(x) === "object") {
      _e25 = ["let", ["x", x], ["nil?", "x"]];
    } else {
      _e25 = ["or", ["is", ["typeof", x], ["quote", "undefined"]], ["is", x, "null"]];
    }
    _x410.js = _e25;
    return(_x410);
  }});
  setenv("%len", {_stash: true, special: function (x) {
    return("#(" + compile(x) + ")");
  }});
  setenv("len", {_stash: true, macro: function (x) {
    var _x425 = ["target"];
    _x425.lua = ["%len", x];
    _x425.js = ["or", ["get", x, ["quote", "length"]], 0];
    return(_x425);
  }});
  setenv("edge", {_stash: true, macro: function (x) {
    return(["-", ["len", x], 1]);
  }});
  setenv("one?", {_stash: true, macro: function (x) {
    return(["is", ["len", x], 1]);
  }});
  setenv("two?", {_stash: true, macro: function (x) {
    return(["is", ["len", x], 2]);
  }});
  setenv("some?", {_stash: true, macro: function (x) {
    return([">", ["len", x], 0]);
  }});
  setenv("none?", {_stash: true, macro: function (x) {
    return(["is", ["len", x], 0]);
  }});
  setenv("hd", {_stash: true, macro: function (l) {
    return(["at", l, 0]);
  }});
  setenv("tl", {_stash: true, macro: function (l) {
    return(["cut", l, 1]);
  }});
  setenv("isa", {_stash: true, macro: function (x, kind) {
    var _e26;
    if (target42 === "js") {
      _e26 = "typeof";
    } else {
      _e26 = "type";
    }
    return(["is", [_e26, x], kind]);
  }});
  setenv("fn?", {_stash: true, macro: function (x) {
    return(["isa", x, ["quote", "function"]]);
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
  setenv("list?", {_stash: true, macro: function (x) {
    var _x479 = ["target"];
    _x479.lua = ["quote", "table"];
    _x479.js = ["quote", "object"];
    return(["isa", x, _x479]);
  }});
  setenv("atom?", {_stash: true, macro: function (x) {
    return(["~list?", x]);
  }});
  return(undefined);
};
if (typeof(_x484) === "undefined" || _x484 === null) {
  _x484 = true;
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
  var _x486 = l;
  var _n11 = _x486.length || 0;
  var _i11 = 0;
  while (_i11 < _n11) {
    var x = _x486[_i11];
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
  var _x488 = x;
  var _n12 = _x488.length || 0;
  var _i12 = 0;
  while (_i12 < _n12) {
    var v = _x488[_i12];
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
stash = function (args) {
  if (keys63(args)) {
    var p = [];
    var _l14 = args;
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
      var _l15 = l;
      var k = undefined;
      for (k in _l15) {
        var v = _l15[k];
        var _e37;
        if (numeric63(k)) {
          _e37 = parseInt(k);
        } else {
          _e37 = k;
        }
        var _k8 = _e37;
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
    var _e38;
    if (c === "\n") {
      _e38 = "\\n";
    } else {
      var _e39;
      if (c === "\"") {
        _e39 = "\\\"";
      } else {
        var _e40;
        if (c === "\\") {
          _e40 = "\\\\";
        } else {
          _e40 = c;
        }
        _e39 = _e40;
      }
      _e38 = _e39;
    }
    var c1 = _e38;
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
                      var _l16 = x;
                      var k = undefined;
                      for (k in _l16) {
                        var v = _l16[k];
                        var _e41;
                        if (numeric63(k)) {
                          _e41 = parseInt(k);
                        } else {
                          _e41 = k;
                        }
                        var _k9 = _e41;
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
                      var _l17 = join(sort(fs), xs, ks);
                      var _i19 = undefined;
                      for (_i19 in _l17) {
                        var v = _l17[_i19];
                        var _e42;
                        if (numeric63(_i19)) {
                          _e42 = parseInt(_i19);
                        } else {
                          _e42 = _i19;
                        }
                        var __i19 = _e42;
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
  var _r171 = unstash(Array.prototype.slice.call(arguments, 1));
  var _keys = cut(_r171, 0);
  if (typeof(k) === "string") {
    var _e43;
    if (_keys.toplevel) {
      _e43 = environment42[0];
    } else {
      _e43 = last(environment42);
    }
    var frame = _e43;
    var entry = frame[k] || {};
    var _l18 = _keys;
    var _k10 = undefined;
    for (_k10 in _l18) {
      var v = _l18[_k10];
      var _e44;
      if (numeric63(_k10)) {
        _e44 = parseInt(_k10);
      } else {
        _e44 = _k10;
      }
      var _k11 = _e44;
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
