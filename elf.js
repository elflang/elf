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
      return(["set", place, "nil"]);
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
      var _e3;
      if (numeric63(k)) {
        _e3 = parseInt(k);
      } else {
        _e3 = k;
      }
      var _k = _e3;
      if (number63(_k)) {
        l[_k] = v;
      } else {
        add(forms, ["set", ["get", x, ["quote", _k]], v]);
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
        return([["=", a, e], b]);
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
  setenv("with", {_stash: true, macro: function (x, v) {
    var _r22 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id15 = _r22;
    var body = cut(_id15, 0);
    return(join(["let", [x, v]], body, [x]));
  }});
  setenv("let-when", {_stash: true, macro: function (x, v) {
    var _r24 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id17 = _r24;
    var body = cut(_id17, 0);
    var y = unique("y");
    return(["let", y, v, ["when", y, join(["let", [x, y]], body)]]);
  }});
  setenv("mac", {_stash: true, macro: function (name, args) {
    var _r26 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id19 = _r26;
    var body = cut(_id19, 0);
    var _x91 = ["setenv", ["quote", name]];
    _x91.macro = join(["fn", args], body);
    var form = _x91;
    eval(form);
    return(form);
  }});
  setenv("defspecial", {_stash: true, macro: function (name, args) {
    var _r28 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id21 = _r28;
    var body = cut(_id21, 0);
    var _x98 = ["setenv", ["quote", name]];
    _x98.special = join(["fn", args], body);
    var form = join(_x98, keys(body));
    eval(form);
    return(form);
  }});
  setenv("defsym", {_stash: true, macro: function (name, expansion) {
    setenv(name, {_stash: true, symbol: expansion});
    var _x104 = ["setenv", ["quote", name]];
    _x104.symbol = ["quote", expansion];
    return(_x104);
  }});
  setenv("var", {_stash: true, macro: function (name, x) {
    var _r32 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id23 = _r32;
    var body = cut(_id23, 0);
    setenv(name, {_stash: true, variable: true});
    if (some63(body)) {
      return(join(["%local-function", name], bind42(x, body)));
    } else {
      return(["%local", name, x]);
    }
  }});
  setenv("def", {_stash: true, macro: function (name, x) {
    var _r34 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id25 = _r34;
    var body = cut(_id25, 0);
    setenv(name, {_stash: true, toplevel: true, variable: true});
    if (some63(body)) {
      return(join(["%global-function", name], bind42(x, body)));
    } else {
      return(["set", name, x]);
    }
  }});
  setenv("with-frame", {_stash: true, macro: function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    var x = unique("x");
    return(["do", ["add", "environment", ["obj"]], ["with", x, join(["do"], body), ["drop", "environment"]]]);
  }});
  setenv("with-bindings", {_stash: true, macro: function (_x135) {
    var _id28 = _x135;
    var names = _id28[0];
    var _r36 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id29 = _r36;
    var body = cut(_id29, 0);
    var x = unique("x");
    var _x138 = ["setenv", x];
    _x138.variable = true;
    return(join(["with-frame", ["each", x, names, _x138]], body));
  }});
  setenv("let-macro", {_stash: true, macro: function (definitions) {
    var _r39 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id31 = _r39;
    var body = cut(_id31, 0);
    add(environment, {});
    map(function (m) {
      return(macroexpand(join(["mac"], m)));
    }, definitions);
    var _x143 = join(["do"], macroexpand(body));
    drop(environment);
    return(_x143);
  }});
  setenv("let-symbol", {_stash: true, macro: function (expansions) {
    var _r43 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id34 = _r43;
    var body = cut(_id34, 0);
    add(environment, {});
    map(function (_x152) {
      var _id35 = _x152;
      var name = _id35[0];
      var exp = _id35[1];
      return(macroexpand(["defsym", name, exp]));
    }, pair(expansions));
    var _x151 = join(["do"], macroexpand(body));
    drop(environment);
    return(_x151);
  }});
  setenv("let-unique", {_stash: true, macro: function (names) {
    var _r47 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id37 = _r47;
    var body = cut(_id37, 0);
    var bs = map(function (n) {
      return([n, ["unique", ["quote", n]]]);
    }, names);
    return(join(["let", apply(join, bs)], body));
  }});
  setenv("fn", {_stash: true, macro: function (args) {
    var _r50 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id39 = _r50;
    var body = cut(_id39, 0);
    return(join(["%function"], bind42(args, body)));
  }});
  setenv("guard", {_stash: true, macro: function (expr) {
    if (target === "js") {
      return([["fn", join(), ["%try", ["list", true, expr]]]]);
    } else {
      var x = unique("x");
      var msg = unique("msg");
      var trace = unique("trace");
      return(["let", [x, "nil", msg, "nil", trace, "nil"], ["if", ["xpcall", ["fn", join(), ["set", x, expr]], ["fn", ["m"], ["set", msg, ["clip", "m", ["+", ["search", "m", "\": \""], 2]]], ["set", trace, [["get", "debug", ["quote", "traceback"]]]]]], ["list", true, x], ["list", false, msg, trace]]]);
    }
  }});
  setenv("each", {_stash: true, macro: function (x, t) {
    var _r54 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id42 = _r54;
    var body = cut(_id42, 0);
    var o = unique("o");
    var n = unique("n");
    var i = unique("i");
    var _e4;
    if (atom63(x)) {
      _e4 = [i, x];
    } else {
      var _e5;
      if (_35(x) > 1) {
        _e5 = x;
      } else {
        _e5 = [i, hd(x)];
      }
      _e4 = _e5;
    }
    var _id43 = _e4;
    var k = _id43[0];
    var v = _id43[1];
    var _e6;
    if (target === "lua") {
      _e6 = body;
    } else {
      _e6 = [join(["let", k, ["if", ["numeric?", k], ["parseInt", k], k]], body)];
    }
    return(["let", [o, t, k, "nil"], ["%for", o, k, join(["let", [v, ["get", o, k]]], _e6)]]);
  }});
  setenv("for", {_stash: true, macro: function (i, to) {
    var _r56 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id45 = _r56;
    var body = cut(_id45, 0);
    return(["let", i, 0, join(["while", ["<", i, to]], body, [["inc", i]])]);
  }});
  setenv("step", {_stash: true, macro: function (v, t) {
    var _r58 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id47 = _r58;
    var body = cut(_id47, 0);
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
      var _e7;
      if (numeric63(_i3)) {
        _e7 = parseInt(_i3);
      } else {
        _e7 = _i3;
      }
      var __i3 = _e7;
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
    var _r62 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id49 = _r62;
    var bs = cut(_id49, 0);
    return(["set", a, join(["join", a], bs)]);
  }});
  setenv("cat!", {_stash: true, macro: function (a) {
    var _r64 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id51 = _r64;
    var bs = cut(_id51, 0);
    return(["set", a, join(["cat", a], bs)]);
  }});
  setenv("inc", {_stash: true, macro: function (n, by) {
    return(["set", n, ["+", n, by || 1]]);
  }});
  setenv("dec", {_stash: true, macro: function (n, by) {
    return(["set", n, ["-", n, by || 1]]);
  }});
  setenv("with-indent", {_stash: true, macro: function (form) {
    var x = unique("x");
    return(["do", ["inc", "indent-level"], ["with", x, form, ["dec", "indent-level"]]]);
  }});
  setenv("export", {_stash: true, macro: function () {
    var names = unstash(Array.prototype.slice.call(arguments, 0));
    if (target === "js") {
      return(join(["do"], map(function (k) {
        return(["set", ["get", "exports", ["quote", k]], k]);
      }, names)));
    } else {
      var x = {};
      var _o5 = names;
      var _i5 = undefined;
      for (_i5 in _o5) {
        var k = _o5[_i5];
        var _e8;
        if (numeric63(_i5)) {
          _e8 = parseInt(_i5);
        } else {
          _e8 = _i5;
        }
        var __i5 = _e8;
        x[k] = k;
      }
      return(["return", join(["obj"], x)]);
    }
  }});
  setenv("undef?", {_stash: true, macro: function (_var) {
    if (target === "js") {
      return(["=", ["typeof", _var], "\"undefined\""]);
    } else {
      return(["=", _var, "nil"]);
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
  setenv("eval-compile", {_stash: true, macro: function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    eval(join(["do"], forms));
    return(undefined);
  }});
  return(setenv("eval-once", {_stash: true, macro: function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    var x = unique("x");
    return(join(["when", ["undef?", x], ["set", x, true]], forms));
  }}));
};
if (typeof(_x331) === "undefined") {
  _x331 = true;
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
  var _e9;
  if (nil63(from) || from < 0) {
    _e9 = 0;
  } else {
    _e9 = from;
  }
  var i = _e9;
  var n = _35(x);
  var _e10;
  if (nil63(upto) || upto > n) {
    _e10 = n;
  } else {
    _e10 = upto;
  }
  var _upto = _e10;
  while (i < _upto) {
    l[j] = x[i];
    i = i + 1;
    j = j + 1;
  }
  var _o6 = x;
  var k = undefined;
  for (k in _o6) {
    var v = _o6[k];
    var _e11;
    if (numeric63(k)) {
      _e11 = parseInt(k);
    } else {
      _e11 = k;
    }
    var _k1 = _e11;
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
    var _e12;
    if (numeric63(k)) {
      _e12 = parseInt(k);
    } else {
      _e12 = k;
    }
    var _k2 = _e12;
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
    var _id52 = ls;
    var a = _id52[0];
    var b = _id52[1];
    if (a && b) {
      var c = [];
      var o = _35(a);
      var _o8 = a;
      var k = undefined;
      for (k in _o8) {
        var v = _o8[k];
        var _e13;
        if (numeric63(k)) {
          _e13 = parseInt(k);
        } else {
          _e13 = k;
        }
        var _k3 = _e13;
        c[_k3] = v;
      }
      var _o9 = b;
      var k = undefined;
      for (k in _o9) {
        var v = _o9[k];
        var _e14;
        if (numeric63(k)) {
          _e14 = parseInt(k);
        } else {
          _e14 = k;
        }
        var _k4 = _e14;
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
    var _e15;
    if (numeric63(_i10)) {
      _e15 = parseInt(_i10);
    } else {
      _e15 = _i10;
    }
    var __i10 = _e15;
    var y = f(x);
    if (y) {
      return(y);
    }
  }
};
first = function (f, l) {
  var _x333 = l;
  var _n11 = _35(_x333);
  var _i11 = 0;
  while (_i11 < _n11) {
    var x = _x333[_i11];
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
  var _e16;
  if (f) {
    _e16 = function (a, b) {
      if (f(a, b)) {
        return(-1);
      } else {
        return(1);
      }
    };
  }
  return(l.sort(_e16));
};
map = function (f, x) {
  var t = [];
  var _x335 = x;
  var _n12 = _35(_x335);
  var _i12 = 0;
  while (_i12 < _n12) {
    var v = _x335[_i12];
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
    var _e17;
    if (numeric63(k)) {
      _e17 = parseInt(k);
    } else {
      _e17 = k;
    }
    var _k5 = _e17;
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
    var _e18;
    if (numeric63(k)) {
      _e18 = parseInt(k);
    } else {
      _e18 = k;
    }
    var _k6 = _e18;
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
    var _e19;
    if (numeric63(_i15)) {
      _e19 = parseInt(_i15);
    } else {
      _e19 = _i15;
    }
    var __i15 = _e19;
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
      var _e20;
      if (numeric63(k)) {
        _e20 = parseInt(k);
      } else {
        _e20 = k;
      }
      var _k7 = _e20;
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
        var _e21;
        if (numeric63(k)) {
          _e21 = parseInt(k);
        } else {
          _e21 = k;
        }
        var _k8 = _e21;
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
    var _e22;
    if (c === "\n") {
      _e22 = "\\n";
    } else {
      var _e23;
      if (c === "\"") {
        _e23 = "\\\"";
      } else {
        var _e24;
        if (c === "\\") {
          _e24 = "\\\\";
        } else {
          _e24 = c;
        }
        _e23 = _e24;
      }
      _e22 = _e23;
    }
    var c1 = _e22;
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
                      var _e25;
                      if (numeric63(k)) {
                        _e25 = parseInt(k);
                      } else {
                        _e25 = k;
                      }
                      var _k9 = _e25;
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
                      var _e26;
                      if (numeric63(_i19)) {
                        _e26 = parseInt(_i19);
                      } else {
                        _e26 = _i19;
                      }
                      var __i19 = _e26;
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
  var _r143 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id53 = _r143;
  var _keys = cut(_id53, 0);
  if (string63(k)) {
    var _e27;
    if (_keys.toplevel) {
      _e27 = hd(environment);
    } else {
      _e27 = last(environment);
    }
    var frame = _e27;
    var entry = frame[k] || {};
    var _o18 = _keys;
    var _k10 = undefined;
    for (_k10 in _o18) {
      var v = _o18[_k10];
      var _e28;
      if (numeric63(_k10)) {
        _e28 = parseInt(_k10);
      } else {
        _e28 = _k10;
      }
      var _k11 = _e28;
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
setenv("bang", {_stash: true, special: function () {
  return("#!/usr/bin/env " + "node");
}});
setenv("elf", {_stash: true, macro: function () {
  var p = ["get", [["get", "debug", ["quote", "getinfo"]], 1, "\"S\""], ["quote", "source"]];
  return(["do", ["bang"], ["when", ["undef?", "elf*"], ["def", "elf*", true], ["%js", ["unless", ["undef?", "process"], ["let-symbol", ["p", ["get", ["get", "process", ["quote", "env"]], ["quote", "NODE_PATH"]]], ["if", ["and", "p", [">", ["get", "p", ["quote", "length"]], 0]], ["cat!", "p", "\":\"", "__dirname"], ["set", "p", "__dirname"]]], ["let", "Module", ["require", ["quote", "module"]], [["get", "Module", ["quote", "_initPaths"]]]]]], ["%lua", ["cat!", ["get", "package", ["quote", "path"]], "\";\"", ["or", [["get", p, ["quote", "match"]], p, "\"[@]?(.*/)[^/]+[.]lua\""], "\"./\""], "\"?.lua\""]]], ["require", ["quote", "elf"]]]);
}});
