var setup = function () {
  setenv("t", stash33({["symbol"]: true}));
  setenv("js?", stash33({["symbol"]: ["is", "target*", ["quote", "js"]]}));
  setenv("lua?", stash33({["symbol"]: ["is", "target*", ["quote", "lua"]]}));
  var _x4 = ["target"];
  _x4.lua = "_G";
  _x4.js = ["if", ["nil?", "global"], "window", "global"];
  setenv("global*", stash33({["symbol"]: _x4}));
  setenv("%compile-time", stash33({["macro"]: function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    compiler.eval(join(["do"], forms));
    return undefined;
  }}));
  setenv("when-compiling", stash33({["macro"]: function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    return compiler.eval(join(["do"], body));
  }}));
  setenv("during-compilation", stash33({["macro"]: function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    var form = join(["do"], body);
    compiler.eval(form);
    return form;
  }}));
  setenv("%js", stash33({["macro"]: function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    if (target42 === "js") {
      return join(["do"], forms);
    }
  }}));
  setenv("%lua", stash33({["macro"]: function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    if (target42 === "lua") {
      return join(["do"], forms);
    }
  }}));
  setenv("quote", stash33({["macro"]: function (form) {
    return quoted(form);
  }}));
  setenv("quasiquote", stash33({["macro"]: function (form) {
    return quasiexpand(form, 1);
  }}));
  setenv("at", stash33({["macro"]: function (l, i) {
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
  }}));
  setenv("wipe", stash33({["macro"]: function (place) {
    if (target42 === "lua") {
      return ["assign", place, "nil"];
    } else {
      return ["%delete", place];
    }
  }}));
  setenv("list", stash33({["macro"]: function () {
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
  }}));
  setenv("xform", stash33({["macro"]: function (l, body) {
    return ["map", ["%fn", ["do", body]], l];
  }}));
  setenv("if", stash33({["macro"]: function () {
    var branches = unstash(Array.prototype.slice.call(arguments, 0));
    return expand_if(branches)[0];
  }}));
  setenv("case", stash33({["macro"]: function (x) {
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
  }}));
  setenv("when", stash33({["macro"]: function (cond) {
    var _r8 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r8, 0);
    return ["if", cond, join(["do"], body)];
  }}));
  setenv("unless", stash33({["macro"]: function (cond) {
    var _r9 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r9, 0);
    return ["if", ["not", cond], join(["do"], body)];
  }}));
  setenv("assert", stash33({["macro"]: function (cond) {
    var x = "assert: " + str(cond);
    return ["unless", cond, ["error", ["quote", x]]];
  }}));
  setenv("obj", stash33({["macro"]: function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    return join(["%object"], mapo(function (_) {
      return _;
    }, body));
  }}));
  setenv("let", stash33({["macro"]: function (bs) {
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
  }}));
  setenv("=", stash33({["macro"]: function () {
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
  }}));
  setenv("with", stash33({["macro"]: function (x, v) {
    var _r16 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r16, 0);
    return join(["let", [x, v]], body, [x]);
  }}));
  setenv("iflet", stash33({["macro"]: function (_var, expr, _then) {
    var _r17 = unstash(Array.prototype.slice.call(arguments, 3));
    var rest = cut(_r17, 0);
    if (!( typeof(_var) === "object")) {
      return ["let", _var, expr, join(["if", _var, _then], rest)];
    } else {
      var gv = uniq("if");
      return ["let", gv, expr, join(["if", gv, ["let", [_var, gv], _then]], rest)];
    }
  }}));
  setenv("whenlet", stash33({["macro"]: function (_var, expr) {
    var _r18 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r18, 0);
    return ["iflet", _var, expr, join(["do"], body)];
  }}));
  setenv("do1", stash33({["macro"]: function (x) {
    var _r19 = unstash(Array.prototype.slice.call(arguments, 1));
    var ys = cut(_r19, 0);
    var g = uniq("do");
    return join(["let", g, x], ys, [g]);
  }}));
  setenv("mac", stash33({["macro"]: function (name, args) {
    var _r20 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r20, 0);
    var _x78 = ["setenv", ["quote", name]];
    _x78.macro = join(["fn", args], body);
    return join(_x78, keys(body));
  }}));
  setenv("defspecial", stash33({["macro"]: function (name, args) {
    var _r21 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r21, 0);
    var _x81 = ["setenv", ["quote", name]];
    _x81.special = join(["fn", args], body);
    return join(_x81, keys(body));
  }}));
  setenv("defsym", stash33({["macro"]: function (name, expansion) {
    var _r22 = unstash(Array.prototype.slice.call(arguments, 2));
    var props = cut(_r22, 0);
    var _x84 = ["setenv", ["quote", name]];
    _x84.symbol = ["quote", expansion];
    return join(_x84, keys(props));
  }}));
  setenv("var", stash33({["macro"]: function (name, x) {
    var _r23 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r23, 0);
    setenv(name, stash33({["variable"]: true}));
    if ((body.length || 0) > 0) {
      return join(["%local-function", name], bind42(x, body));
    } else {
      return ["%local", name, x];
    }
  }}));
  setenv("def", stash33({["macro"]: function (name, x) {
    var _r24 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r24, 0);
    setenv(name, stash33({["toplevel"]: true, ["variable"]: true}));
    if ((body.length || 0) > 0) {
      return join(["%global-function", name], bind42(x, body));
    } else {
      return ["=", name, x];
    }
  }}));
  setenv("w/frame", stash33({["macro"]: function () {
    var body = unstash(Array.prototype.slice.call(arguments, 0));
    var x = uniq("x");
    return ["do", ["add", "environment*", ["obj"]], ["with", x, join(["do"], body), ["drop", "environment*"]]];
  }}));
  setenv("w/bindings", stash33({["macro"]: function (_x97) {
    var names = _x97[0];
    var _r25 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r25, 0);
    var x = uniq("x");
    var _x100 = ["setenv", x];
    _x100.variable = true;
    return join(["w/frame", ["each", x, names, _x100]], body);
  }}));
  setenv("w/mac", stash33({["macro"]: function (name, args, definition) {
    var _r26 = unstash(Array.prototype.slice.call(arguments, 3));
    var body = cut(_r26, 0);
    add(environment42, {});
    var _x101 = macroexpand(join(["do", ["%compile-time", ["mac", name, args, definition]]], body));
    drop(environment42);
    return _x101;
  }}));
  setenv("w/sym", stash33({["macro"]: function (expansions) {
    var _r27 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r27, 0);
    if (!( typeof(expansions) === "object")) {
      return join(["w/sym", [expansions, body[0]]], cut(body, 1));
    } else {
      add(environment42, {});
      var _x107 = macroexpand(join(["do", join(["%compile-time"], map(function (_) {
        return join(["defsym"], _);
      }, pair(expansions)))], body));
      drop(environment42);
      return _x107;
    }
  }}));
  setenv("w/uniq", stash33({["macro"]: function (names) {
    var _r29 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r29, 0);
    if (!( typeof(names) === "object")) {
      names = [names];
    }
    return join(["let", apply(join, map(function (_) {
      return [_, ["uniq", ["quote", _]]];
    }, names))], body);
  }}));
  setenv("fn", stash33({["macro"]: function (args) {
    var _r31 = unstash(Array.prototype.slice.call(arguments, 1));
    var body = cut(_r31, 0);
    return join(["%function"], bind42(args, body));
  }}));
  setenv("guard", stash33({["macro"]: function (expr) {
    if (target42 === "js") {
      return [["%fn", ["%try", ["list", "t", expr]]]];
    } else {
      var x = uniq("x");
      var msg = uniq("msg");
      var trace = uniq("trace");
      return ["let", [x, "nil", msg, "nil", trace, "nil"], ["if", ["xpcall", ["%fn", ["=", x, expr]], ["%fn", ["do", ["=", msg, ["clip", "_", ["+", ["search", "_", "\": \""], 2]]], ["=", trace, [["get", "debug", ["quote", "traceback"]]]]]]], ["list", "t", x], ["list", false, msg, trace]]];
    }
  }}));
  setenv("for", stash33({["macro"]: function (i, n) {
    var _r33 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r33, 0);
    return ["let", i, 0, join(["while", ["<", i, n]], body, [["++", i]])];
  }}));
  setenv("step", stash33({["macro"]: function (v, l) {
    var _r34 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r34, 0);
    var index = _r34.index;
    var _e4;
    if (typeof(index) === "undefined" || index === null) {
      _e4 = uniq("i");
    } else {
      _e4 = index;
    }
    var i = _e4;
    if (i === true) {
      i = "index";
    }
    var x = uniq("x");
    var n = uniq("n");
    return ["let", [x, l, n, ["len", x]], ["for", i, n, join(["let", [v, ["at", x, i]]], body)]];
  }}));
  setenv("each", stash33({["macro"]: function (x, lst) {
    var _r35 = unstash(Array.prototype.slice.call(arguments, 2));
    var body = cut(_r35, 0);
    var l = uniq("l");
    var n = uniq("n");
    var i = uniq("i");
    var _e5;
    if (!( typeof(x) === "object")) {
      _e5 = [i, x];
    } else {
      var _e6;
      if ((x.length || 0) > 1) {
        _e6 = x;
      } else {
        _e6 = [i, x[0]];
      }
      _e5 = _e6;
    }
    var _id27 = _e5;
    var k = _id27[0];
    var v = _id27[1];
    var _e7;
    if (target42 === "lua") {
      _e7 = body;
    } else {
      _e7 = [join(["let", k, ["if", ["numeric?", k], ["parseInt", k], k]], body)];
    }
    return ["let", [l, lst, k, "nil"], ["%for", l, k, join(["let", [v, ["get", l, k]]], _e7)]];
  }}));
  setenv("set-of", stash33({["macro"]: function () {
    var xs = unstash(Array.prototype.slice.call(arguments, 0));
    var l = [];
    var _l1 = xs;
    var _i1 = undefined;
    for (_i1 in _l1) {
      var x = _l1[_i1];
      var _e8;
      if (numeric63(_i1)) {
        _e8 = parseInt(_i1);
      } else {
        _e8 = _i1;
      }
      var __i1 = _e8;
      l[x] = true;
    }
    return join(["obj"], l);
  }}));
  setenv("language", stash33({["macro"]: function () {
    return ["quote", target42];
  }}));
  setenv("target", stash33({["macro"]: function () {
    var clauses = unstash(Array.prototype.slice.call(arguments, 0));
    return clauses[target42];
  }}));
  setenv("join!", stash33({["macro"]: function (a) {
    var _r37 = unstash(Array.prototype.slice.call(arguments, 1));
    var bs = cut(_r37, 0);
    return ["=", a, join(["join", a], bs)];
  }}));
  setenv("cat!", stash33({["macro"]: function (a) {
    var _r38 = unstash(Array.prototype.slice.call(arguments, 1));
    var bs = cut(_r38, 0);
    return ["=", a, join(["cat", a], bs)];
  }}));
  setenv("++", stash33({["macro"]: function (n, by) {
    return ["=", n, ["+", n, by || 1]];
  }}));
  setenv("--", stash33({["macro"]: function (n, by) {
    return ["=", n, ["-", n, by || 1]];
  }}));
  setenv("export", stash33({["macro"]: function () {
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
        var _e9;
        if (numeric63(_i2)) {
          _e9 = parseInt(_i2);
        } else {
          _e9 = _i2;
        }
        var __i2 = _e9;
        x[k] = k;
      }
      return ["return", join(["obj"], x)];
    }
  }}));
  setenv("once", stash33({["macro"]: function () {
    var forms = unstash(Array.prototype.slice.call(arguments, 0));
    var x = uniq("x");
    return ["when", ["nil?", x], ["=", x, "t"], join(["let", join()], forms)];
  }}));
  setenv("elf", stash33({["macro"]: function () {
    var _x187 = ["target"];
    _x187.js = "\"elf.js\"";
    _x187.lua = "\"elf\"";
    return ["require", _x187];
  }}));
  setenv("lib", stash33({["macro"]: function () {
    var modules = unstash(Array.prototype.slice.call(arguments, 0));
    return join(["do"], map(function (_) {
      return ["def", _, ["require", ["quote", _]]];
    }, modules));
  }}));
  setenv("use", stash33({["macro"]: function () {
    var modules = unstash(Array.prototype.slice.call(arguments, 0));
    return join(["do"], map(function (_) {
      return ["var", _, ["require", ["quote", _]]];
    }, modules));
  }}));
  setenv("nil?", stash33({["macro"]: function (x) {
    if (target42 === "lua") {
      return ["is", x, "nil"];
    } else {
      if (typeof(x) === "object") {
        return ["let", "x", x, ["nil?", "x"]];
      } else {
        return ["or", ["is", ["typeof", x], ["quote", "undefined"]], ["is", x, "null"]];
      }
    }
  }}));
  setenv("hd", stash33({["macro"]: function (l) {
    return ["at", l, 0];
  }}));
  setenv("tl", stash33({["macro"]: function (l) {
    return ["cut", l, 1];
  }}));
  setenv("%len", stash33({["special"]: function (x) {
    return "#(" + compile(x) + ")";
  }}));
  setenv("len", stash33({["macro"]: function (x) {
    var _x206 = ["target"];
    _x206.lua = ["%len", x];
    _x206.js = ["or", ["get", x, ["quote", "length"]], 0];
    return _x206;
  }}));
  setenv("edge", stash33({["macro"]: function (x) {
    return ["-", ["len", x], 1];
  }}));
  setenv("one?", stash33({["macro"]: function (x) {
    return ["is", ["len", x], 1];
  }}));
  setenv("two?", stash33({["macro"]: function (x) {
    return ["is", ["len", x], 2];
  }}));
  setenv("some?", stash33({["macro"]: function (x) {
    return [">", ["len", x], 0];
  }}));
  setenv("none?", stash33({["macro"]: function (x) {
    return ["is", ["len", x], 0];
  }}));
  setenv("isa", stash33({["macro"]: function (x, y) {
    var _x223 = ["target"];
    _x223.js = "typeof";
    _x223.lua = "type";
    return ["is", [_x223, x], y];
  }}));
  setenv("list?", stash33({["macro"]: function (x) {
    var _x225 = ["target"];
    _x225.js = ["quote", "object"];
    _x225.lua = ["quote", "table"];
    return ["isa", x, _x225];
  }}));
  setenv("atom?", stash33({["macro"]: function (x) {
    return ["~list?", x];
  }}));
  setenv("bool?", stash33({["macro"]: function (x) {
    return ["isa", x, ["quote", "boolean"]];
  }}));
  setenv("num?", stash33({["macro"]: function (x) {
    return ["isa", x, ["quote", "number"]];
  }}));
  setenv("str?", stash33({["macro"]: function (x) {
    return ["isa", x, ["quote", "string"]];
  }}));
  setenv("fn?", stash33({["macro"]: function (x) {
    return ["isa", x, ["quote", "function"]];
  }}));
  return undefined;
};
if (typeof(_x237) === "undefined" || _x237 === null) {
  _x237 = true;
  environment42 = [{}];
  target42 = "js";
  keys42 = undefined;
}
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
    var _e10;
    if (numeric63(k)) {
      _e10 = parseInt(k);
    } else {
      _e10 = k;
    }
    var _k1 = _e10;
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
    var _e11;
    if (numeric63(k)) {
      _e11 = parseInt(k);
    } else {
      _e11 = k;
    }
    var _k2 = _e11;
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
        var _e12;
        if (numeric63(k)) {
          _e12 = parseInt(k);
        } else {
          _e12 = k;
        }
        var _k3 = _e12;
        c[_k3] = v;
      }
      var _l6 = b;
      var k = undefined;
      for (k in _l6) {
        var v = _l6[k];
        var _e13;
        if (numeric63(k)) {
          _e13 = parseInt(k);
        } else {
          _e13 = k;
        }
        var _k4 = _e13;
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
    var _e14;
    if (numeric63(_i7)) {
      _e14 = parseInt(_i7);
    } else {
      _e14 = _i7;
    }
    var __i7 = _e14;
    var y = f(x);
    if (y) {
      return y;
    }
  }
};
first = function (f, l) {
  var _x239 = l;
  var _n8 = _x239.length || 0;
  var _i8 = 0;
  while (_i8 < _n8) {
    var x = _x239[_i8];
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
  var _e15;
  if (f) {
    _e15 = function (_0, _1) {
      if (f(_0, _1)) {
        return -1;
      } else {
        return 1;
      }
    };
  }
  return l.sort(_e15);
};
map = function (f, x) {
  var l = [];
  var _x241 = x;
  var _n9 = _x241.length || 0;
  var _i9 = 0;
  while (_i9 < _n9) {
    var v = _x241[_i9];
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
    var _e16;
    if (numeric63(k)) {
      _e16 = parseInt(k);
    } else {
      _e16 = k;
    }
    var _k5 = _e16;
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
    var _e17;
    if (numeric63(k)) {
      _e17 = parseInt(k);
    } else {
      _e17 = k;
    }
    var _k6 = _e17;
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
    var _e18;
    if (numeric63(_i12)) {
      _e18 = parseInt(_i12);
    } else {
      _e18 = _i12;
    }
    var __i12 = _e18;
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
      var _e19;
      if (numeric63(k)) {
        _e19 = parseInt(k);
      } else {
        _e19 = k;
      }
      var _k7 = _e19;
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
    var _e20;
    if ("\n" === _e2) {
      _e20 = "\\n";
    } else {
      var _e21;
      if ("\"" === _e2) {
        _e21 = "\\\"";
      } else {
        var _e22;
        if ("\\" === _e2) {
          _e22 = "\\\\";
        } else {
          _e22 = c;
        }
        _e21 = _e22;
      }
      _e20 = _e21;
    }
    s1 = s1 + _e20;
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
                        var _e23;
                        if (numeric63(k)) {
                          _e23 = parseInt(k);
                        } else {
                          _e23 = k;
                        }
                        var _k8 = _e23;
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
                        var _e24;
                        if (numeric63(_i15)) {
                          _e24 = parseInt(_i15);
                        } else {
                          _e24 = _i15;
                        }
                        var __i15 = _e24;
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
  var _r114 = unstash(Array.prototype.slice.call(arguments, 1));
  var _keys = cut(_r114, 0);
  if (typeof(k) === "string") {
    var _e25;
    if (_keys.toplevel) {
      _e25 = environment42[0];
    } else {
      _e25 = last(environment42);
    }
    var frame = _e25;
    var entry = frame[k] || {};
    var _l14 = _keys;
    var _k9 = undefined;
    for (_k9 in _l14) {
      var v = _l14[_k9];
      var _e26;
      if (numeric63(_k9)) {
        _e26 = parseInt(_k9);
      } else {
        _e26 = _k9;
      }
      var _k10 = _e26;
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
