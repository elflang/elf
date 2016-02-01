var setup = function () {
  setenv("quote", {_stash: true, macro: function (form) {
    return(quoted(form));
  }});
  setenv("quasiquote", {_stash: true, macro: function (form) {
    return(quasiexpand(form, 1));
  }});
  setenv("at", {_stash: true, macro: function (l, i) {
    if (target === "lua" && number63(i)) {
      i = i + 1;
    } else {
      if (target === "lua") {
        i = ["+", i, 1];
      }
    }
    return(["get", l, i]);
  }});
  setenv("wipe", {_stash: true, macro: function (place) {
    if (target === "lua") {
      return(["assign", place, "nil"]);
    } else {
      return(["%delete", place]);
    }
  }});
  setenv("list", {_stash: true, macro: function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    var x = unique("x");
    var l = [];
    var forms = [];
    var _o1 = body;
    var k = undefined;
    for (k in _o1) {
      var v = _o1[k];
      var _e13;
      if (numeric63(k)) {
        _e13 = parseInt(k);
      } else {
        _e13 = k;
      }
      var _k = _e13;
      if (number63(_k)) {
        l[_k] = v;
      } else {
        add(forms, ["assign", ["get", x, ["quote", _k]], v]);
      }
    }
    if (some63(forms)) {
      return(join(["let", x, join(["%array"], l)], forms, [x]));
    } else {
      return(join(["%array"], l));
    }
  }});
  setenv("if", {_stash: true, macro: function () {
    var branches = unstash(Array.prototype.slice.call(arguments, 0));
    return(hd(expand_if(branches)));
  }});
  setenv("case", {_stash: true, macro: function (x) {
    var _r11 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id2 = _r11;
    var clauses = cut(_id2, 0);
    var e = unique("e");
    var bs = map(function (_x32) {
      var _id3 = _x32;
      var a = _id3[0];
      var b = _id3[1];
      if (nil63(b)) {
        return([a]);
      } else {
        return([["is", a, e], b]);
      }
    }, pair(clauses));
    return(["let", [e, x], join(["if"], apply(join, bs))]);
  }});
  setenv("when", {_stash: true, macro: function (cond) {
    var _r14 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id5 = _r14;
    var body = cut(_id5, 0);
    return(["if", cond, join(["do"], body)]);
  }});
  setenv("unless", {_stash: true, macro: function (cond) {
    var _r16 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id7 = _r16;
    var body = cut(_id7, 0);
    return(["if", ["not", cond], join(["do"], body)]);
  }});
  setenv("obj", {_stash: true, macro: function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    return(join(["%object"], mapo(function (x) {
      return(x);
    }, body)));
  }});
  setenv("let", {_stash: true, macro: function (bs) {
    var _r20 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id11 = _r20;
    var body = cut(_id11, 0);
    if (atom63(bs)) {
      return(join(["let", [bs, hd(body)]], tl(body)));
    } else {
      if (none63(bs)) {
        return(join(["do"], body));
      } else {
        var _id12 = bs;
        var lh = _id12[0];
        var rh = _id12[1];
        var bs2 = cut(_id12, 2);
        var _id13 = bind(lh, rh);
        var id = _id13[0];
        var val = _id13[1];
        var bs1 = cut(_id13, 2);
        var renames = [];
        if (bound63(id) || toplevel63()) {
          var id1 = unique(id);
          renames = [id, id1];
          id = id1;
        } else {
          setenv(id, {_stash: true, variable: true});
        }
        return(["do", ["%local", id, val], ["let-symbol", renames, join(["let", join(bs1, bs2)], body)]]);
      }
    }
  }});
  setenv("=", {_stash: true, macro: function () {
    var l = unstash(Array.prototype.slice.call(arguments, 0));
    var _e7 = _35(l);
    if (0 === _e7) {
      return(undefined);
    } else {
      if (1 === _e7) {
        return(join(["="], l, ["nil"]));
      } else {
        if (2 === _e7) {
          var _id17 = l;
          var lh = _id17[0];
          var rh = _id17[1];
          var _id63 = atom63(lh);
          var _e16;
          if (_id63) {
            _e16 = _id63;
          } else {
            var _e8 = hd(lh);
            var _e17;
            if ("at" === _e8) {
              _e17 = true;
            } else {
              var _e18;
              if ("get" === _e8) {
                _e18 = true;
              }
              _e17 = _e18;
            }
            _e16 = _e17;
          }
          if (_e16) {
            return(["assign", lh, rh]);
          } else {
            var vars = [];
            var forms = bind(lh, rh, vars);
            return(join(["do"], map(function (id) {
              return(["var", id]);
            }, vars), map(function (_x86) {
              var _id18 = _x86;
              var id = _id18[0];
              var val = _id18[1];
              return(["=", id, val]);
            }, pair(forms))));
          }
        } else {
          return(join(["do"], map(function (l) {
            return(join(["="], l));
          }, pair(l))));
        }
      }
    }
  }});
  setenv("with", {_stash: true, macro: function (x, v) {
    var _r28 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id20 = _r28;
    var body = cut(_id20, 0);
    return(join(["let", [x, v]], body, [x]));
  }});
  setenv("let-when", {_stash: true, macro: function (x, v) {
    var _r30 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id22 = _r30;
    var body = cut(_id22, 0);
    var y = unique("y");
    return(["let", y, v, ["when", y, join(["let", [x, y]], body)]]);
  }});
  setenv("mac", {_stash: true, macro: function (name, args) {
    var _r32 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id24 = _r32;
    var body = cut(_id24, 0);
    var _x110 = ["setenv", ["quote", name]];
    _x110.macro = join(["fn", args], body);
    var form = _x110;
    eval(form);
    return(form);
  }});
  setenv("defspecial", {_stash: true, macro: function (name, args) {
    var _r34 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id26 = _r34;
    var body = cut(_id26, 0);
    var _x117 = ["setenv", ["quote", name]];
    _x117.special = join(["fn", args], body);
    var form = join(_x117, keys(body));
    eval(form);
    return(form);
  }});
  setenv("defsym", {_stash: true, macro: function (name, expansion) {
    setenv(name, {_stash: true, symbol: expansion});
    var _x123 = ["setenv", ["quote", name]];
    _x123.symbol = ["quote", expansion];
    return(_x123);
  }});
  setenv("var", {_stash: true, macro: function (name, x) {
    var _r38 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id28 = _r38;
    var body = cut(_id28, 0);
    setenv(name, {_stash: true, variable: true});
    if (some63(body)) {
      return(join(["%local-function", name], bind42(x, body)));
    } else {
      return(["%local", name, x]);
    }
  }});
  setenv("def", {_stash: true, macro: function (name, x) {
    var _r40 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id30 = _r40;
    var body = cut(_id30, 0);
    setenv(name, {_stash: true, toplevel: true, variable: true});
    if (some63(body)) {
      return(join(["%global-function", name], bind42(x, body)));
    } else {
      return(["=", name, x]);
    }
  }});
  setenv("with-frame", {_stash: true, macro: function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    var x = unique("x");
    return(["do", ["add", "environment", ["obj"]], ["with", x, join(["do"], body), ["drop", "environment"]]]);
  }});
  setenv("with-bindings", {_stash: true, macro: function (_x154) {
    var _id33 = _x154;
    var names = _id33[0];
    var _r42 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id34 = _r42;
    var body = cut(_id34, 0);
    var x = unique("x");
    var _x157 = ["setenv", x];
    _x157.variable = true;
    return(join(["with-frame", ["each", x, names, _x157]], body));
  }});
  setenv("let-macro", {_stash: true, macro: function (definitions) {
    var _r45 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id36 = _r45;
    var body = cut(_id36, 0);
    add(environment, {});
    map(function (m) {
      return(macroexpand(join(["mac"], m)));
    }, definitions);
    var _x162 = join(["do"], macroexpand(body));
    drop(environment);
    return(_x162);
  }});
  setenv("let-symbol", {_stash: true, macro: function (expansions) {
    var _r49 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id39 = _r49;
    var body = cut(_id39, 0);
    add(environment, {});
    map(function (_x171) {
      var _id40 = _x171;
      var name = _id40[0];
      var exp = _id40[1];
      return(macroexpand(["defsym", name, exp]));
    }, pair(expansions));
    var _x170 = join(["do"], macroexpand(body));
    drop(environment);
    return(_x170);
  }});
  setenv("let-unique", {_stash: true, macro: function (names) {
    var _r53 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id42 = _r53;
    var body = cut(_id42, 0);
    var bs = map(function (n) {
      return([n, ["unique", ["quote", n]]]);
    }, names);
    return(join(["let", apply(join, bs)], body));
  }});
  setenv("fn", {_stash: true, macro: function (args) {
    var _r56 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id44 = _r56;
    var body = cut(_id44, 0);
    return(join(["%function"], bind42(args, body)));
  }});
  setenv("guard", {_stash: true, macro: function (expr) {
    if (target === "js") {
      return([["fn", join(), ["%try", ["list", true, expr]]]]);
    } else {
      var x = unique("x");
      var msg = unique("msg");
      var trace = unique("trace");
      return(["let", [x, "nil", msg, "nil", trace, "nil"], ["if", ["xpcall", ["fn", join(), ["=", x, expr]], ["fn", ["m"], ["=", msg, ["clip", "m", ["+", ["search", "m", "\": \""], 2]]], ["=", trace, [["get", "debug", ["quote", "traceback"]]]]]], ["list", true, x], ["list", false, msg, trace]]]);
    }
  }});
  setenv("each", {_stash: true, macro: function (x, t) {
    var _r60 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id47 = _r60;
    var body = cut(_id47, 0);
    var o = unique("o");
    var n = unique("n");
    var i = unique("i");
    var _e19;
    if (atom63(x)) {
      _e19 = [i, x];
    } else {
      var _e20;
      if (_35(x) > 1) {
        _e20 = x;
      } else {
        _e20 = [i, hd(x)];
      }
      _e19 = _e20;
    }
    var _id48 = _e19;
    var k = _id48[0];
    var v = _id48[1];
    var _e21;
    if (target === "lua") {
      _e21 = body;
    } else {
      _e21 = [join(["let", k, ["if", ["numeric?", k], ["parseInt", k], k]], body)];
    }
    return(["let", [o, t, k, "nil"], ["%for", o, k, join(["let", [v, ["get", o, k]]], _e21)]]);
  }});
  setenv("for-1", {_stash: true, macro: function (_x264) {
    var _id51 = _x264;
    var i = _id51[0];
    var from = _id51[1];
    var to = _id51[2];
    var _e22;
    if (is63(_id51[3])) {
      _e22 = _id51[3];
    } else {
      _e22 = 1;
    }
    var by = _e22;
    var _r62 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id52 = _r62;
    var body = cut(_id52, 0);
    return(["let", i, from, join(["while", ["<", i, to]], body, [["inc", i, by]])]);
  }});
  setenv("for", {_stash: true, macro: function (i) {
    var _r64 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id54 = _r64;
    var body = cut(_id54, 0);
    if (atom63(i)) {
      return(join(["for-1", [i, 0, hd(body)]], tl(body)));
    } else {
      return(join(["for-1", i], body));
    }
  }});
  setenv("step", {_stash: true, macro: function (v, t) {
    var _r66 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id56 = _r66;
    var body = cut(_id56, 0);
    var x = unique("x");
    var n = unique("n");
    var i = unique("i");
    return(["let", [x, t, n, ["#", x]], ["for", i, n, join(["let", [v, ["at", x, i]]], body)]]);
  }});
  setenv("set-of", {_stash: true, macro: function () {
    var xs = unstash(Array.prototype.slice.call(arguments, 0));
    var l = [];
    var _o3 = xs;
    var _i3 = undefined;
    for (_i3 in _o3) {
      var x = _o3[_i3];
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
    return(["quote", target]);
  }});
  setenv("target", {_stash: true, macro: function () {
    var clauses = unstash(Array.prototype.slice.call(arguments, 0));
    return(clauses[target]);
  }});
  setenv("join!", {_stash: true, macro: function (a) {
    var _r70 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id58 = _r70;
    var bs = cut(_id58, 0);
    return(["=", a, join(["join", a], bs)]);
  }});
  setenv("cat!", {_stash: true, macro: function (a) {
    var _r72 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id60 = _r72;
    var bs = cut(_id60, 0);
    return(["=", a, join(["cat", a], bs)]);
  }});
  setenv("inc", {_stash: true, macro: function (n, by) {
    return(["=", n, ["+", n, by || 1]]);
  }});
  setenv("dec", {_stash: true, macro: function (n, by) {
    return(["=", n, ["-", n, by || 1]]);
  }});
  setenv("with-indent", {_stash: true, macro: function (form) {
    var x = unique("x");
    return(["do", ["inc", "indent-level"], ["with", x, form, ["dec", "indent-level"]]]);
  }});
  setenv("export", {_stash: true, macro: function () {
    var names = unstash(Array.prototype.slice.call(arguments, 0));
    if (target === "js") {
      return(join(["do"], map(function (k) {
        return(["=", ["get", "exports", ["quote", k]], k]);
      }, names)));
    } else {
      var x = {};
      var _o5 = names;
      var _i5 = undefined;
      for (_i5 in _o5) {
        var k = _o5[_i5];
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
  setenv("undef?", {_stash: true, macro: function (_var) {
    if (target === "js") {
      return(["is", ["typeof", _var], "\"undefined\""]);
    } else {
      return(["is", _var, "nil"]);
    }
  }});
  setenv("%js", {_stash: true, macro: function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    if (target === "js") {
      return(join(["do"], forms));
    }
  }});
  setenv("%lua", {_stash: true, macro: function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    if (target === "lua") {
      return(join(["do"], forms));
    }
  }});
  setenv("%compiling", {_stash: true, macro: function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    eval(join(["do"], forms));
    return(undefined);
  }});
  setenv("once", {_stash: true, macro: function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    var x = unique("x");
    return(join(["when", ["undef?", x], ["=", x, true]], forms));
  }});
  setenv("assert", {_stash: true, macro: function (cond) {
    return(["unless", cond, ["error", ["quote", "assert"]]]);
  }});
  setenv("elf", {_stash: true, macro: function () {
    return(["require", ["quote", "elf"]]);
  }});
  setenv("lib", {_stash: true, macro: function () {
    var modules = unstash(Array.prototype.slice.call(arguments, 0));
    return(join(["do"], map(function (x) {
      return(["def", x, ["require", ["quote", x]]]);
    }, modules)));
  }});
  setenv("use", {_stash: true, macro: function () {
    var modules = unstash(Array.prototype.slice.call(arguments, 0));
    return(join(["do"], map(function (x) {
      return(["var", x, ["require", ["quote", x]]]);
    }, modules)));
  }});
  return(undefined);
};
if (typeof(_x387) === "undefined") {
  _x387 = true;
  environment = [{}];
  target = "js";
}
nil63 = function (x) {
  return(x === undefined || x === null);
};
is63 = function (x) {
  return(! nil63(x));
};
_35 = function (x) {
  return(x.length || 0);
};
none63 = function (x) {
  return(_35(x) === 0);
};
some63 = function (x) {
  return(_35(x) > 0);
};
one63 = function (x) {
  return(_35(x) === 1);
};
two63 = function (x) {
  return(_35(x) === 2);
};
hd = function (l) {
  return(l[0]);
};
type = function (x) {
  return(typeof(x));
};
string63 = function (x) {
  return(type(x) === "string");
};
number63 = function (x) {
  return(type(x) === "number");
};
boolean63 = function (x) {
  return(type(x) === "boolean");
};
function63 = function (x) {
  return(type(x) === "function");
};
atom63 = function (x) {
  return(nil63(x) || string63(x) || number63(x) || boolean63(x));
};
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
  var l = [];
  var j = 0;
  var _e25;
  if (nil63(from) || from < 0) {
    _e25 = 0;
  } else {
    _e25 = from;
  }
  var i = _e25;
  var n = _35(x);
  var _e26;
  if (nil63(upto) || upto > n) {
    _e26 = n;
  } else {
    _e26 = upto;
  }
  var _upto = _e26;
  while (i < _upto) {
    l[j] = x[i];
    i = i + 1;
    j = j + 1;
  }
  var _o6 = x;
  var k = undefined;
  for (k in _o6) {
    var v = _o6[k];
    var _e27;
    if (numeric63(k)) {
      _e27 = parseInt(k);
    } else {
      _e27 = k;
    }
    var _k1 = _e27;
    if (! number63(_k1)) {
      l[_k1] = v;
    }
  }
  return(l);
};
keys = function (x) {
  var t = [];
  var _o7 = x;
  var k = undefined;
  for (k in _o7) {
    var v = _o7[k];
    var _e28;
    if (numeric63(k)) {
      _e28 = parseInt(k);
    } else {
      _e28 = k;
    }
    var _k2 = _e28;
    if (! number63(_k2)) {
      t[_k2] = v;
    }
  }
  return(t);
};
edge = function (x) {
  return(_35(x) - 1);
};
inner = function (x) {
  return(clip(x, 1, edge(x)));
};
tl = function (l) {
  return(cut(l, 1));
};
char = function (s, n) {
  return(s.charAt(n));
};
code = function (s, n) {
  return(s.charCodeAt(n));
};
string_literal63 = function (x) {
  return(string63(x) && char(x, 0) === "\"");
};
id_literal63 = function (x) {
  return(string63(x) && char(x, 0) === "|");
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
  return(cut(l, 0, edge(l)));
};
reverse = function (l) {
  var l1 = keys(l);
  var i = edge(l);
  while (i >= 0) {
    add(l1, l[i]);
    i = i - 1;
  }
  return(l1);
};
reduce = function (f, x) {
  if (none63(x)) {
    return(undefined);
  } else {
    if (one63(x)) {
      return(hd(x));
    } else {
      return(f(hd(x), reduce(f, tl(x))));
    }
  }
};
join = function () {
  var ls = unstash(Array.prototype.slice.call(arguments, 0));
  if (two63(ls)) {
    var _id61 = ls;
    var a = _id61[0];
    var b = _id61[1];
    if (a && b) {
      var c = [];
      var o = _35(a);
      var _o8 = a;
      var k = undefined;
      for (k in _o8) {
        var v = _o8[k];
        var _e29;
        if (numeric63(k)) {
          _e29 = parseInt(k);
        } else {
          _e29 = k;
        }
        var _k3 = _e29;
        c[_k3] = v;
      }
      var _o9 = b;
      var k = undefined;
      for (k in _o9) {
        var v = _o9[k];
        var _e30;
        if (numeric63(k)) {
          _e30 = parseInt(k);
        } else {
          _e30 = k;
        }
        var _k4 = _e30;
        if (number63(_k4)) {
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
find = function (f, t) {
  var _o10 = t;
  var _i10 = undefined;
  for (_i10 in _o10) {
    var x = _o10[_i10];
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
  var _x389 = l;
  var _n11 = _35(_x389);
  var _i11 = 0;
  while (_i11 < _n11) {
    var x = _x389[_i11];
    var y = f(x);
    if (y) {
      return(y);
    }
    _i11 = _i11 + 1;
  }
};
in63 = function (x, t) {
  return(find(function (y) {
    return(x === y);
  }, t));
};
pair = function (l) {
  var l1 = [];
  var i = 0;
  while (i < _35(l)) {
    add(l1, [l[i], l[i + 1]]);
    i = i + 1;
    i = i + 1;
  }
  return(l1);
};
sort = function (l, f) {
  var _e32;
  if (f) {
    _e32 = function (a, b) {
      if (f(a, b)) {
        return(-1);
      } else {
        return(1);
      }
    };
  }
  return(l.sort(_e32));
};
map = function (f, x) {
  var t = [];
  var _x391 = x;
  var _n12 = _35(_x391);
  var _i12 = 0;
  while (_i12 < _n12) {
    var v = _x391[_i12];
    var y = f(v);
    if (is63(y)) {
      add(t, y);
    }
    _i12 = _i12 + 1;
  }
  var _o11 = x;
  var k = undefined;
  for (k in _o11) {
    var v = _o11[k];
    var _e33;
    if (numeric63(k)) {
      _e33 = parseInt(k);
    } else {
      _e33 = k;
    }
    var _k5 = _e33;
    if (! number63(_k5)) {
      var y = f(v);
      if (is63(y)) {
        t[_k5] = y;
      }
    }
  }
  return(t);
};
keep = function (f, x) {
  return(map(function (v) {
    if (f(v)) {
      return(v);
    }
  }, x));
};
keys63 = function (t) {
  var _o12 = t;
  var k = undefined;
  for (k in _o12) {
    var v = _o12[k];
    var _e34;
    if (numeric63(k)) {
      _e34 = parseInt(k);
    } else {
      _e34 = k;
    }
    var _k6 = _e34;
    if (! number63(_k6)) {
      return(true);
    }
  }
  return(false);
};
empty63 = function (t) {
  var _o13 = t;
  var _i15 = undefined;
  for (_i15 in _o13) {
    var x = _o13[_i15];
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
    var _o14 = args;
    var k = undefined;
    for (k in _o14) {
      var v = _o14[k];
      var _e36;
      if (numeric63(k)) {
        _e36 = parseInt(k);
      } else {
        _e36 = k;
      }
      var _k7 = _e36;
      if (! number63(_k7)) {
        p[_k7] = v;
      }
    }
    p._stash = true;
    add(args, p);
  }
  return(args);
};
unstash = function (args) {
  if (none63(args)) {
    return([]);
  } else {
    var l = last(args);
    if (! atom63(l) && ! function63(l) && l._stash) {
      var args1 = almost(args);
      var _o15 = l;
      var k = undefined;
      for (k in _o15) {
        var v = _o15[k];
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
    var n = _35(sep);
    while (true) {
      var i = search(s, sep);
      if (nil63(i)) {
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
  return(reduce(function (a, b) {
    return(a + b);
  }, xs) || "");
};
_43 = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (a, b) {
    return(a + b);
  }, xs) || 0);
};
_ = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (b, a) {
    return(a - b);
  }, reverse(xs)) || 0);
};
_42 = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (a, b) {
    return(a * b);
  }, xs) || 1);
};
_47 = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (b, a) {
    return(a / b);
  }, reverse(xs)) || 1);
};
_37 = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (b, a) {
    return(a % b);
  }, reverse(xs)) || 0);
};
_62 = function (a, b) {
  return(a > b);
};
_60 = function (a, b) {
  return(a < b);
};
_61 = function (a, b) {
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
  var n = _35(s);
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
  while (i < _35(s)) {
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
str = function (x, depth) {
  if (depth && depth > 40) {
    return("circular");
  } else {
    if (nil63(x)) {
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
            if (boolean63(x)) {
              if (x) {
                return("true");
              } else {
                return("false");
              }
            } else {
              if (string63(x)) {
                return(escape(x));
              } else {
                if (atom63(x)) {
                  return(tostring(x));
                } else {
                  if (function63(x)) {
                    return("fn");
                  } else {
                    var s = "(";
                    var sp = "";
                    var xs = [];
                    var ks = [];
                    var d = (depth || 0) + 1;
                    var _o16 = x;
                    var k = undefined;
                    for (k in _o16) {
                      var v = _o16[k];
                      var _e41;
                      if (numeric63(k)) {
                        _e41 = parseInt(k);
                      } else {
                        _e41 = k;
                      }
                      var _k9 = _e41;
                      if (number63(_k9)) {
                        xs[_k9] = str(v, d);
                      } else {
                        add(ks, _k9 + ":");
                        add(ks, str(v, d));
                      }
                    }
                    var _o17 = join(xs, ks);
                    var _i19 = undefined;
                    for (_i19 in _o17) {
                      var v = _o17[_i19];
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
call = function (f) {
  return(f());
};
toplevel63 = function () {
  return(one63(environment));
};
setenv = function (k) {
  var _r159 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id62 = _r159;
  var _keys = cut(_id62, 0);
  if (string63(k)) {
    var _e43;
    if (_keys.toplevel) {
      _e43 = hd(environment);
    } else {
      _e43 = last(environment);
    }
    var frame = _e43;
    var entry = frame[k] || {};
    var _o18 = _keys;
    var _k10 = undefined;
    for (_k10 in _o18) {
      var v = _o18[_k10];
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
