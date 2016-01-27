if (typeof(environment) === "undefined") {
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
  var _e6;
  if (nil63(from) || from < 0) {
    _e6 = 0;
  } else {
    _e6 = from;
  }
  var i = _e6;
  var n = _35(x);
  var _e7;
  if (nil63(upto) || upto > n) {
    _e7 = n;
  } else {
    _e7 = upto;
  }
  var _upto = _e7;
  while (i < _upto) {
    l[j] = x[i];
    i = i + 1;
    j = j + 1;
  }
  var _o6 = x;
  var k = undefined;
  for (k in _o6) {
    var v = _o6[k];
    var _e8;
    if (numeric63(k)) {
      _e8 = parseInt(k);
    } else {
      _e8 = k;
    }
    var _k = _e8;
    if (! number63(_k)) {
      l[_k] = v;
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
    var _e9;
    if (numeric63(k)) {
      _e9 = parseInt(k);
    } else {
      _e9 = k;
    }
    var _k1 = _e9;
    if (! number63(_k1)) {
      t[_k1] = v;
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
    var _id56 = ls;
    var a = _id56[0];
    var b = _id56[1];
    if (a && b) {
      var c = [];
      var o = _35(a);
      var _o8 = a;
      var k = undefined;
      for (k in _o8) {
        var v = _o8[k];
        var _e10;
        if (numeric63(k)) {
          _e10 = parseInt(k);
        } else {
          _e10 = k;
        }
        var _k2 = _e10;
        c[_k2] = v;
      }
      var _o9 = b;
      var k = undefined;
      for (k in _o9) {
        var v = _o9[k];
        var _e11;
        if (numeric63(k)) {
          _e11 = parseInt(k);
        } else {
          _e11 = k;
        }
        var _k3 = _e11;
        if (number63(_k3)) {
          _k3 = _k3 + o;
        }
        c[_k3] = v;
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
  var _i12 = undefined;
  for (_i12 in _o10) {
    var x = _o10[_i12];
    var _e12;
    if (numeric63(_i12)) {
      _e12 = parseInt(_i12);
    } else {
      _e12 = _i12;
    }
    var __i12 = _e12;
    var y = f(x);
    if (y) {
      return(y);
    }
  }
};
first = function (f, l) {
  var _x365 = l;
  var _n13 = _35(_x365);
  var _i13 = 0;
  while (_i13 < _n13) {
    var x = _x365[_i13];
    var y = f(x);
    if (y) {
      return(y);
    }
    _i13 = _i13 + 1;
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
  var _e13;
  if (f) {
    _e13 = function (a, b) {
      if (f(a, b)) {
        return(-1);
      } else {
        return(1);
      }
    };
  }
  return(l.sort(_e13));
};
map = function (f, x) {
  var t = [];
  var _x367 = x;
  var _n14 = _35(_x367);
  var _i14 = 0;
  while (_i14 < _n14) {
    var v = _x367[_i14];
    var y = f(v);
    if (is63(y)) {
      add(t, y);
    }
    _i14 = _i14 + 1;
  }
  var _o11 = x;
  var k = undefined;
  for (k in _o11) {
    var v = _o11[k];
    var _e14;
    if (numeric63(k)) {
      _e14 = parseInt(k);
    } else {
      _e14 = k;
    }
    var _k4 = _e14;
    if (! number63(_k4)) {
      var y = f(v);
      if (is63(y)) {
        t[_k4] = y;
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
    var _e15;
    if (numeric63(k)) {
      _e15 = parseInt(k);
    } else {
      _e15 = k;
    }
    var _k5 = _e15;
    if (! number63(_k5)) {
      return(true);
    }
  }
  return(false);
};
empty63 = function (t) {
  var _o13 = t;
  var _i17 = undefined;
  for (_i17 in _o13) {
    var x = _o13[_i17];
    var _e16;
    if (numeric63(_i17)) {
      _e16 = parseInt(_i17);
    } else {
      _e16 = _i17;
    }
    var __i17 = _e16;
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
      var _e17;
      if (numeric63(k)) {
        _e17 = parseInt(k);
      } else {
        _e17 = k;
      }
      var _k6 = _e17;
      if (! number63(_k6)) {
        p[_k6] = v;
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
        var _e18;
        if (numeric63(k)) {
          _e18 = parseInt(k);
        } else {
          _e18 = k;
        }
        var _k7 = _e18;
        if (!( _k7 === "_stash")) {
          args1[_k7] = v;
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
    var _e19;
    if (c === "\n") {
      _e19 = "\\n";
    } else {
      var _e20;
      if (c === "\"") {
        _e20 = "\\\"";
      } else {
        var _e21;
        if (c === "\\") {
          _e21 = "\\\\";
        } else {
          _e21 = c;
        }
        _e20 = _e21;
      }
      _e19 = _e20;
    }
    var c1 = _e19;
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
                      var _e22;
                      if (numeric63(k)) {
                        _e22 = parseInt(k);
                      } else {
                        _e22 = k;
                      }
                      var _k8 = _e22;
                      if (number63(_k8)) {
                        xs[_k8] = str(v, d);
                      } else {
                        add(ks, _k8 + ":");
                        add(ks, str(v, d));
                      }
                    }
                    var _o17 = join(xs, ks);
                    var _i21 = undefined;
                    for (_i21 in _o17) {
                      var v = _o17[_i21];
                      var _e23;
                      if (numeric63(_i21)) {
                        _e23 = parseInt(_i21);
                      } else {
                        _e23 = _i21;
                      }
                      var __i21 = _e23;
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
  var _r149 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id57 = _r149;
  var _keys = cut(_id57, 0);
  if (string63(k)) {
    var _e24;
    if (_keys.toplevel) {
      _e24 = hd(environment);
    } else {
      _e24 = last(environment);
    }
    var frame = _e24;
    var entry = frame[k] || {};
    var _o18 = _keys;
    var _k9 = undefined;
    for (_k9 in _o18) {
      var v = _o18[_k9];
      var _e25;
      if (numeric63(_k9)) {
        _e25 = parseInt(_k9);
      } else {
        _e25 = _k9;
      }
      var _k10 = _e25;
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
  var _o20 = body;
  var k = undefined;
  for (k in _o20) {
    var v = _o20[k];
    var _e26;
    if (numeric63(k)) {
      _e26 = parseInt(k);
    } else {
      _e26 = k;
    }
    var _k11 = _e26;
    if (number63(_k11)) {
      l[_k11] = v;
    } else {
      add(forms, ["set", ["get", x, ["quote", _k11]], v]);
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
  var _r161 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id60 = _r161;
  var clauses = cut(_id60, 0);
  var bs = map(function (_x399) {
    var _id61 = _x399;
    var a = _id61[0];
    var b = _id61[1];
    if (nil63(b)) {
      return([a]);
    } else {
      return([["=", ["quote", a], x], b]);
    }
  }, pair(clauses));
  return(join(["if"], apply(join, bs)));
}});
setenv("when", {_stash: true, macro: function (cond) {
  var _r164 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id63 = _r164;
  var body = cut(_id63, 0);
  return(["if", cond, join(["do"], body)]);
}});
setenv("unless", {_stash: true, macro: function (cond) {
  var _r166 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id65 = _r166;
  var body = cut(_id65, 0);
  return(["if", ["not", cond], join(["do"], body)]);
}});
setenv("obj", {_stash: true, macro: function () {
  var body = unstash(Array.prototype.slice.call(arguments, 0));
  return(join(["%object"], mapo(function (x) {
    return(x);
  }, body)));
}});
setenv("let", {_stash: true, macro: function (bs) {
  var _r170 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id69 = _r170;
  var body = cut(_id69, 0);
  if (atom63(bs)) {
    return(join(["let", [bs, hd(body)]], tl(body)));
  } else {
    if (none63(bs)) {
      return(join(["do"], body));
    } else {
      var _id70 = bs;
      var lh = _id70[0];
      var rh = _id70[1];
      var bs2 = cut(_id70, 2);
      var _id71 = bind(lh, rh);
      var id = _id71[0];
      var val = _id71[1];
      var bs1 = cut(_id71, 2);
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
  var _r172 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id73 = _r172;
  var body = cut(_id73, 0);
  return(join(["let", [x, v]], body, [x]));
}});
setenv("let-when", {_stash: true, macro: function (x, v) {
  var _r174 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id75 = _r174;
  var body = cut(_id75, 0);
  var y = unique("y");
  return(["let", y, v, ["when", y, join(["let", [x, y]], body)]]);
}});
setenv("define-macro", {_stash: true, macro: function (name, args) {
  var _r176 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id77 = _r176;
  var body = cut(_id77, 0);
  var _x457 = ["setenv", ["quote", name]];
  _x457.macro = join(["fn", args], body);
  var form = _x457;
  eval(form);
  return(form);
}});
setenv("define-special", {_stash: true, macro: function (name, args) {
  var _r178 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id79 = _r178;
  var body = cut(_id79, 0);
  var _x464 = ["setenv", ["quote", name]];
  _x464.special = join(["fn", args], body);
  var form = join(_x464, keys(body));
  eval(form);
  return(form);
}});
setenv("define-symbol", {_stash: true, macro: function (name, expansion) {
  setenv(name, {_stash: true, symbol: expansion});
  var _x470 = ["setenv", ["quote", name]];
  _x470.symbol = ["quote", expansion];
  return(_x470);
}});
setenv("define-reader", {_stash: true, macro: function (_x479) {
  var _id82 = _x479;
  var _char1 = _id82[0];
  var s = _id82[1];
  var _r182 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id83 = _r182;
  var body = cut(_id83, 0);
  return(["set", ["get", "read-table", _char1], join(["fn", [s]], body)]);
}});
setenv("define", {_stash: true, macro: function (name, x) {
  var _r184 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id85 = _r184;
  var body = cut(_id85, 0);
  setenv(name, {_stash: true, variable: true});
  if (some63(body)) {
    return(join(["%local-function", name], bind42(x, body)));
  } else {
    return(["%local", name, x]);
  }
}});
setenv("define-global", {_stash: true, macro: function (name, x) {
  var _r186 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id87 = _r186;
  var body = cut(_id87, 0);
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
setenv("with-bindings", {_stash: true, macro: function (_x512) {
  var _id90 = _x512;
  var names = _id90[0];
  var _r188 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id91 = _r188;
  var body = cut(_id91, 0);
  var x = unique("x");
  var _x515 = ["setenv", x];
  _x515.variable = true;
  return(join(["with-frame", ["each", x, names, _x515]], body));
}});
setenv("let-macro", {_stash: true, macro: function (definitions) {
  var _r191 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id93 = _r191;
  var body = cut(_id93, 0);
  add(environment, {});
  map(function (m) {
    return(macroexpand(join(["define-macro"], m)));
  }, definitions);
  var _x520 = join(["do"], macroexpand(body));
  drop(environment);
  return(_x520);
}});
setenv("let-symbol", {_stash: true, macro: function (expansions) {
  var _r195 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id96 = _r195;
  var body = cut(_id96, 0);
  add(environment, {});
  map(function (_x529) {
    var _id97 = _x529;
    var name = _id97[0];
    var exp = _id97[1];
    return(macroexpand(["define-symbol", name, exp]));
  }, pair(expansions));
  var _x528 = join(["do"], macroexpand(body));
  drop(environment);
  return(_x528);
}});
setenv("let-unique", {_stash: true, macro: function (names) {
  var _r199 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id99 = _r199;
  var body = cut(_id99, 0);
  var bs = map(function (n) {
    return([n, ["unique", ["quote", n]]]);
  }, names);
  return(join(["let", apply(join, bs)], body));
}});
setenv("fn", {_stash: true, macro: function (args) {
  var _r202 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id101 = _r202;
  var body = cut(_id101, 0);
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
  var _r206 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id104 = _r206;
  var body = cut(_id104, 0);
  var o = unique("o");
  var n = unique("n");
  var i = unique("i");
  var _e30;
  if (atom63(x)) {
    _e30 = [i, x];
  } else {
    var _e31;
    if (_35(x) > 1) {
      _e31 = x;
    } else {
      _e31 = [i, hd(x)];
    }
    _e30 = _e31;
  }
  var _id105 = _e30;
  var k = _id105[0];
  var v = _id105[1];
  var _e32;
  if (target === "lua") {
    _e32 = body;
  } else {
    _e32 = [join(["let", k, ["if", ["numeric?", k], ["parseInt", k], k]], body)];
  }
  return(["let", [o, t, k, "nil"], ["%for", o, k, join(["let", [v, ["get", o, k]]], _e32)]]);
}});
setenv("for", {_stash: true, macro: function (i, to) {
  var _r208 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id107 = _r208;
  var body = cut(_id107, 0);
  return(["let", i, 0, join(["while", ["<", i, to]], body, [["inc", i]])]);
}});
setenv("step", {_stash: true, macro: function (v, t) {
  var _r210 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id109 = _r210;
  var body = cut(_id109, 0);
  var x = unique("x");
  var n = unique("n");
  var i = unique("i");
  return(["let", [x, t, n, ["#", x]], ["for", i, n, join(["let", [v, ["at", x, i]]], body)]]);
}});
setenv("set-of", {_stash: true, macro: function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  var l = [];
  var _o22 = xs;
  var _i26 = undefined;
  for (_i26 in _o22) {
    var x = _o22[_i26];
    var _e33;
    if (numeric63(_i26)) {
      _e33 = parseInt(_i26);
    } else {
      _e33 = _i26;
    }
    var __i26 = _e33;
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
  var _r214 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id111 = _r214;
  var bs = cut(_id111, 0);
  return(["set", a, join(["join", a], bs)]);
}});
setenv("cat!", {_stash: true, macro: function (a) {
  var _r216 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id113 = _r216;
  var bs = cut(_id113, 0);
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
    var _o24 = names;
    var _i28 = undefined;
    for (_i28 in _o24) {
      var k = _o24[_i28];
      var _e34;
      if (numeric63(_i28)) {
        _e34 = parseInt(_i28);
      } else {
        _e34 = _i28;
      }
      var __i28 = _e34;
      x[k] = k;
    }
    return(["return", join(["obj"], x)]);
  }
}});
setenv("undefined?", {_stash: true, macro: function (_var) {
  if (target === "js") {
    return(["=", ["typeof", _var], "\"undefined\""]);
  } else {
    return(["=", _var, "nil"]);
  }
}});
setenv("set-default", {_stash: true, macro: function (_var, val) {
  return(["if", ["undefined?", _var], ["set", _var, val]]);
}});
setenv("compile-later", {_stash: true, macro: function () {
  var forms = unstash(Array.prototype.slice.call(arguments, 0));
  if (typeof(_37defer) === "undefined") {
    _37defer = [];
  }
  eval(join(["do"], forms));
  _37defer = join(_37defer, forms);
  return(undefined);
}});
setenv("finish-compiling", {_stash: true, special: function () {
  if (typeof(_37defer) === "undefined") {
    _37defer = [];
  }
  var o = "";
  if (some63(_37defer)) {
    var _x702 = _37defer;
    var _n30 = _35(_x702);
    var _i30 = 0;
    while (_i30 < _n30) {
      var e = _x702[_i30];
      o = o + compile(require("compiler").expand(e), {_stash: true, stmt: true});
      _i30 = _i30 + 1;
    }
    _37defer = [];
  }
  return(o);
}});
reload = function (module) {
  if (module === "elf") {
    module = module + ".js";
  }
  delete require.cache[require.resolve(module)];
  return(require(module));
};
;
var reader = require("reader");
var compiler = require("compiler");
var system = require("system");
var eval_print = function (form) {
  var _id = (function () {
    try {
      return([true, compiler.eval(form)]);
    }
    catch (_e) {
      return([false, _e.message, _e.stack]);
    }
  })();
  var ok = _id[0];
  var x = _id[1];
  var trace = _id[2];
  if (! ok) {
    return(print(trace));
  } else {
    if (is63(x)) {
      return(print(str(x)));
    }
  }
};
var rep = function (s) {
  return(eval_print(reader["read-string"](s)));
};
var repl = function () {
  var buf = "";
  var rep1 = function (s) {
    buf = buf + s;
    var more = [];
    var form = reader["read-string"](buf, more);
    if (!( form === more)) {
      eval_print(form);
      buf = "";
      return(system.write("> "));
    }
  };
  system.write("> ");
  var _in = process.stdin;
  _in.setEncoding("utf8");
  return(_in.on("data", rep1));
};
compile_file = function (path) {
  var s = reader.stream(system["read-file"](path));
  var body = reader["read-all"](s);
  var form = compiler.expand(join(["do"], body));
  return(compiler.compile(form, {_stash: true, stmt: true}));
};
load = function (path) {
  return(compiler.run(compile_file(path)));
};
var run_file = function (path) {
  return(compiler.run(system["read-file"](path)));
};
var usage = function () {
  print("usage: elf [options] <object files>");
  print("options:");
  print("  -c <input>\tCompile input file");
  print("  -o <output>\tOutput file");
  print("  -t <target>\tTarget language (default: lua)");
  print("  -e <expr>\tExpression to evaluate");
  return(system.exit());
};
var main = function () {
  var arg = hd(system.argv);
  if (arg === "-h" || arg === "--help") {
    usage();
  }
  var pre = [];
  var input = undefined;
  var output = undefined;
  var target1 = undefined;
  var expr = undefined;
  var argv = system.argv;
  var n = _35(argv);
  var i = 0;
  while (i < n) {
    var a = argv[i];
    if (a === "-c" || a === "-o" || a === "-t" || a === "-e") {
      if (i === n - 1) {
        print("missing argument for " + a);
      } else {
        i = i + 1;
        var val = argv[i];
        if (a === "-c") {
          input = val;
        } else {
          if (a === "-o") {
            output = val;
          } else {
            if (a === "-t") {
              target1 = val;
            } else {
              if (a === "-e") {
                expr = val;
              }
            }
          }
        }
      }
    } else {
      if (!( "-" === char(a, 0))) {
        add(pre, a);
      }
    }
    i = i + 1;
  }
  var _x2 = pre;
  var _n = _35(_x2);
  var _i = 0;
  while (_i < _n) {
    var file = _x2[_i];
    run_file(file);
    _i = _i + 1;
  }
  if (nil63(input)) {
    if (expr) {
      return(rep(expr));
    } else {
      return(repl());
    }
  } else {
    if (target1) {
      target = target1;
    }
    var code = compile_file(input);
    if (nil63(output) || output === "-") {
      return(print(code));
    } else {
      return(system["write-file"](output, code));
    }
  }
};
if (typeof(running42) === "undefined") {
  running42 = false;
}
if (! running42) {
  running42 = true;
  main();
}
