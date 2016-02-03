var setup = function () {
  setenv("quote", {_stash: true, macro: function (form) {
    return(quoted(form));
  }});
  setenv("quasiquote", {_stash: true, macro: function (form) {
    return(quasiexpand(form, 1));
  }});
  setenv("at", {_stash: true, macro: function (l, i) {
    if (target === "lua" && type(i) === "number") {
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
      if (type(_k) === "number") {
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
    var _id2 = _r13;
    var clauses = cut(_id2, 0);
    var e = unique("e");
    var bs = map(function (_x38) {
      var _id3 = _x38;
      var a = _id3[0];
      var b = _id3[1];
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
    var _id5 = _r16;
    var body = cut(_id5, 0);
    return(["if", cond, join(["do"], body)]);
  }});
  setenv("unless", {_stash: true, macro: function (cond) {
    var _r18 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id7 = _r18;
    var body = cut(_id7, 0);
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
    var _id11 = _r24;
    var body = cut(_id11, 0);
    if (!( type(bs) === "object")) {
      return(join(["let", [bs, body[0]]], cut(body, 1)));
    } else {
      if ((bs.length || 0) === 0) {
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
    var _e7 = l.length || 0;
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
          var _id61 = !( type(lh) === "object");
          var _e17;
          if (_id61) {
            _e17 = _id61;
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
            }, vars), map(function (_x98) {
              var _id18 = _x98;
              var id = _id18[0];
              var val = _id18[1];
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
    var _id20 = _r32;
    var body = cut(_id20, 0);
    return(join(["let", [x, v]], body, [x]));
  }});
  setenv("let-when", {_stash: true, macro: function (x, v) {
    var _r34 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id22 = _r34;
    var body = cut(_id22, 0);
    var y = unique("y");
    return(["let", y, v, ["when", y, join(["let", [x, y]], body)]]);
  }});
  setenv("mac", {_stash: true, macro: function (name, args) {
    var _r36 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id24 = _r36;
    var body = cut(_id24, 0);
    var _x122 = ["setenv", ["quote", name]];
    _x122.macro = join(["fn", args], body);
    var form = _x122;
    eval(form);
    return(form);
  }});
  setenv("defspecial", {_stash: true, macro: function (name, args) {
    var _r38 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id26 = _r38;
    var body = cut(_id26, 0);
    var _x129 = ["setenv", ["quote", name]];
    _x129.special = join(["fn", args], body);
    var form = join(_x129, keys(body));
    eval(form);
    return(form);
  }});
  setenv("defsym", {_stash: true, macro: function (name, expansion) {
    setenv(name, {_stash: true, symbol: expansion});
    var _x135 = ["setenv", ["quote", name]];
    _x135.symbol = ["quote", expansion];
    return(_x135);
  }});
  setenv("var", {_stash: true, macro: function (name, x) {
    var _r42 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id28 = _r42;
    var body = cut(_id28, 0);
    setenv(name, {_stash: true, variable: true});
    if ((body.length || 0) > 0) {
      return(join(["%local-function", name], bind42(x, body)));
    } else {
      return(["%local", name, x]);
    }
  }});
  setenv("def", {_stash: true, macro: function (name, x) {
    var _r44 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id30 = _r44;
    var body = cut(_id30, 0);
    setenv(name, {_stash: true, toplevel: true, variable: true});
    if ((body.length || 0) > 0) {
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
  setenv("with-bindings", {_stash: true, macro: function (_x166) {
    var _id33 = _x166;
    var names = _id33[0];
    var _r46 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id34 = _r46;
    var body = cut(_id34, 0);
    var x = unique("x");
    var _x169 = ["setenv", x];
    _x169.variable = true;
    return(join(["with-frame", ["each", x, names, _x169]], body));
  }});
  setenv("let-macro", {_stash: true, macro: function (definitions) {
    var _r49 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id36 = _r49;
    var body = cut(_id36, 0);
    add(environment, {});
    map(function (_) {
      return(macroexpand(join(["mac"], _)));
    }, definitions);
    var _x174 = join(["do"], macroexpand(body));
    drop(environment);
    return(_x174);
  }});
  setenv("let-symbol", {_stash: true, macro: function (expansions) {
    var _r53 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id39 = _r53;
    var body = cut(_id39, 0);
    add(environment, {});
    map(function (_x183) {
      var _id40 = _x183;
      var name = _id40[0];
      var exp = _id40[1];
      return(macroexpand(["defsym", name, exp]));
    }, pair(expansions));
    var _x182 = join(["do"], macroexpand(body));
    drop(environment);
    return(_x182);
  }});
  setenv("let-unique", {_stash: true, macro: function (names) {
    var _r57 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id42 = _r57;
    var body = cut(_id42, 0);
    var bs = map(function (_) {
      return([_, ["unique", ["quote", _]]]);
    }, names);
    return(join(["let", apply(join, bs)], body));
  }});
  setenv("fn", {_stash: true, macro: function (args) {
    var _r60 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id44 = _r60;
    var body = cut(_id44, 0);
    return(join(["%function"], bind42(args, body)));
  }});
  setenv("guard", {_stash: true, macro: function (expr) {
    if (target === "js") {
      return([["%fn", ["%try", ["list", true, expr]]]]);
    } else {
      var x = unique("x");
      var msg = unique("msg");
      var trace = unique("trace");
      return(["let", [x, "nil", msg, "nil", trace, "nil"], ["if", ["xpcall", ["%fn", ["=", x, expr]], ["%fn", ["do", ["=", msg, ["clip", "_", ["+", ["search", "_", "\": \""], 2]]], ["=", trace, [["get", "debug", ["quote", "traceback"]]]]]]], ["list", true, x], ["list", false, msg, trace]]]);
    }
  }});
  setenv("each", {_stash: true, macro: function (x, t) {
    var _r64 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id47 = _r64;
    var body = cut(_id47, 0);
    var l = unique("l");
    var n = unique("n");
    var i = unique("i");
    var _e20;
    if (!( type(x) === "object")) {
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
    var _id48 = _e20;
    var k = _id48[0];
    var v = _id48[1];
    var _e22;
    if (target === "lua") {
      _e22 = body;
    } else {
      _e22 = [join(["let", k, ["if", ["numeric?", k], ["parseInt", k], k]], body)];
    }
    return(["let", [l, t, k, "nil"], ["%for", l, k, join(["let", [v, ["get", l, k]]], _e22)]]);
  }});
  setenv("for", {_stash: true, macro: function (i) {
    var _r66 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id51 = _r66;
    var body = cut(_id51, 0);
    var from = 0;
    var to = 0;
    var increment = 1;
    if (!( type(i) === "object")) {
      to = body[0];
      body = cut(body, 1);
    } else {
      var _id52;
      _id52 = i;
      i = _id52[0];
      from = _id52[1];
      to = _id52[2];
      var _e23;
      var x = _id52[3];
      if (typeof(x) === "undefined" || x === null) {
        _e23 = 1;
      } else {
        _e23 = _id52[3];
      }
      increment = _e23;
    }
    if (!( type(increment) === "number")) {
      throw new Error("assert: (\"number?\" \"increment\")");
    }
    if (increment > 0) {
      return(["let", [i, from], join(["while", ["<", i, to]], body, [["inc", i, increment]])]);
    } else {
      return(["let", [i, ["-", to, 1]], join(["while", [">=", i, from]], body, [["dec", i, - increment]])]);
    }
  }});
  setenv("step", {_stash: true, macro: function (v, t) {
    var _r68 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id54 = _r68;
    var body = cut(_id54, 0);
    var x = unique("x");
    var n = unique("n");
    var i = unique("i");
    return(["let", [x, t, n, ["#", x]], ["for", i, n, join(["let", [v, ["at", x, i]]], body)]]);
  }});
  setenv("set-of", {_stash: true, macro: function () {
    var xs = unstash(Array.prototype.slice.call(arguments, 0));
    var l = [];
    var _l3 = xs;
    var _i3 = undefined;
    for (_i3 in _l3) {
      var x = _l3[_i3];
      var _e24;
      if (numeric63(_i3)) {
        _e24 = parseInt(_i3);
      } else {
        _e24 = _i3;
      }
      var __i3 = _e24;
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
    var _r72 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id56 = _r72;
    var bs = cut(_id56, 0);
    return(["=", a, join(["join", a], bs)]);
  }});
  setenv("cat!", {_stash: true, macro: function (a) {
    var _r74 = unstash(Array.prototype.slice.call(arguments, 1));
    var _id58 = _r74;
    var bs = cut(_id58, 0);
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
      return(join(["do"], map(function (_) {
        return(["=", ["get", "exports", ["quote", _]], _]);
      }, names)));
    } else {
      var x = {};
      var _l5 = names;
      var _i5 = undefined;
      for (_i5 in _l5) {
        var k = _l5[_i5];
        var _e25;
        if (numeric63(_i5)) {
          _e25 = parseInt(_i5);
        } else {
          _e25 = _i5;
        }
        var __i5 = _e25;
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
    var _e26;
    if (!( type(x) === "object")) {
      _e26 = ["let", join(), ["or", ["is", ["typeof", x], "\"undefined\""], ["is", x, "null"]]];
    } else {
      _e26 = ["let", ["x", x], ["nil?", "x"]];
    }
    _x410.js = _e26;
    return(_x410);
  }});
  setenv("%len", {_stash: true, special: function (x) {
    return("#(" + compile(x) + ")");
  }});
  setenv("#", {_stash: true, macro: function (x) {
    var _x425 = ["target"];
    _x425.lua = ["%len", x];
    _x425.js = ["or", ["get", x, ["quote", "length"]], 0];
    return(_x425);
  }});
  setenv("none?", {_stash: true, macro: function (x) {
    return(["is", ["#", x], 0]);
  }});
  setenv("some?", {_stash: true, macro: function (x) {
    return([">", ["#", x], 0]);
  }});
  setenv("one?", {_stash: true, macro: function (x) {
    return(["is", ["#", x], 1]);
  }});
  setenv("two?", {_stash: true, macro: function (x) {
    return(["is", ["#", x], 2]);
  }});
  setenv("hd", {_stash: true, macro: function (l) {
    return(["at", l, 0]);
  }});
  setenv("tl", {_stash: true, macro: function (l) {
    return(["cut", l, 1]);
  }});
  setenv("type", {_stash: true, macro: function (x) {
    return(["typeof", x]);
  }});
  setenv("string?", {_stash: true, macro: function (x) {
    return(["is", ["type", x], ["quote", "string"]]);
  }});
  setenv("number?", {_stash: true, macro: function (x) {
    return(["is", ["type", x], ["quote", "number"]]);
  }});
  setenv("boolean?", {_stash: true, macro: function (x) {
    return(["is", ["type", x], ["quote", "boolean"]]);
  }});
  setenv("function?", {_stash: true, macro: function (x) {
    return(["is", ["type", x], ["quote", "function"]]);
  }});
  setenv("table?", {_stash: true, macro: function (x) {
    var _x483 = ["target"];
    _x483.lua = ["quote", "table"];
    _x483.js = ["quote", "object"];
    return(["is", ["type", x], _x483]);
  }});
  setenv("atom?", {_stash: true, macro: function (x) {
    return(["~table?", x]);
  }});
  return(undefined);
};
if (typeof(_x488) === "undefined") {
  _x488 = true;
  environment = [{}];
  target = "js";
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
cut = function (x, _x490, _x491) {
  var _e27;
  if (typeof(_x490) === "undefined" || _x490 === null) {
    _e27 = 0;
  } else {
    _e27 = _x490;
  }
  var from = _e27;
  var _e28;
  if (typeof(_x491) === "undefined" || _x491 === null) {
    _e28 = x.length || 0;
  } else {
    _e28 = _x491;
  }
  var upto = _e28;
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
    var _e29;
    if (numeric63(k)) {
      _e29 = parseInt(k);
    } else {
      _e29 = k;
    }
    var _k1 = _e29;
    if (!( typeof(_k1) === "number")) {
      l[_k1] = v;
    }
  }
  return(l);
};
keys = function (x) {
  var t = [];
  var _l7 = x;
  var k = undefined;
  for (k in _l7) {
    var v = _l7[k];
    var _e30;
    if (numeric63(k)) {
      _e30 = parseInt(k);
    } else {
      _e30 = k;
    }
    var _k2 = _e30;
    if (!( typeof(_k2) === "number")) {
      t[_k2] = v;
    }
  }
  return(t);
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
  return(cut(l, 0, edge(l)));
};
reverse = function (l) {
  var l1 = keys(l);
  var i = (l.length || 0) - 1;
  while (i >= 0) {
    add(l1, l[i]);
    i = i - 1;
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
    var _id59 = ls;
    var a = _id59[0];
    var b = _id59[1];
    if (a && b) {
      var c = [];
      var o = a.length || 0;
      var _l8 = a;
      var k = undefined;
      for (k in _l8) {
        var v = _l8[k];
        var _e31;
        if (numeric63(k)) {
          _e31 = parseInt(k);
        } else {
          _e31 = k;
        }
        var _k3 = _e31;
        c[_k3] = v;
      }
      var _l9 = b;
      var k = undefined;
      for (k in _l9) {
        var v = _l9[k];
        var _e32;
        if (numeric63(k)) {
          _e32 = parseInt(k);
        } else {
          _e32 = k;
        }
        var _k4 = _e32;
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
find = function (f, t) {
  var _l10 = t;
  var _i10 = undefined;
  for (_i10 in _l10) {
    var x = _l10[_i10];
    var _e33;
    if (numeric63(_i10)) {
      _e33 = parseInt(_i10);
    } else {
      _e33 = _i10;
    }
    var __i10 = _e33;
    var y = f(x);
    if (y) {
      return(y);
    }
  }
};
first = function (f, l) {
  var _x492 = l;
  var _n11 = _x492.length || 0;
  var _i11 = 0;
  while (_i11 < _n11) {
    var x = _x492[_i11];
    var y = f(x);
    if (y) {
      return(y);
    }
    _i11 = _i11 + 1;
  }
};
in63 = function (x, t) {
  return(find(function (_) {
    return(x === _);
  }, t));
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
  var _e34;
  if (f) {
    _e34 = function (_0, _1) {
      if (f(_0, _1)) {
        return(-1);
      } else {
        return(1);
      }
    };
  }
  return(l.sort(_e34));
};
map = function (f, x) {
  var t = [];
  var _x494 = x;
  var _n12 = _x494.length || 0;
  var _i12 = 0;
  while (_i12 < _n12) {
    var v = _x494[_i12];
    var y = f(v);
    if (!( typeof(y) === "undefined" || y === null)) {
      add(t, y);
    }
    _i12 = _i12 + 1;
  }
  var _l11 = x;
  var k = undefined;
  for (k in _l11) {
    var v = _l11[k];
    var _e35;
    if (numeric63(k)) {
      _e35 = parseInt(k);
    } else {
      _e35 = k;
    }
    var _k5 = _e35;
    if (!( typeof(_k5) === "number")) {
      var y = f(v);
      if (!( typeof(y) === "undefined" || y === null)) {
        t[_k5] = y;
      }
    }
  }
  return(t);
};
cons = function (x, y) {
  return(join([x], y));
};
treewise = function (f, base, tree) {
  if (!( typeof(tree) === "object")) {
    return(base(tree));
  } else {
    if ((tree.length || 0) === 0) {
      return([]);
    } else {
      return(f(treewise(f, base, tree[0]), treewise(f, base, cut(tree, 1))));
    }
  }
};
keep = function (f, x) {
  return(map(function (_) {
    if (f(_)) {
      return(_);
    }
  }, x));
};
keys63 = function (t) {
  var _l12 = t;
  var k = undefined;
  for (k in _l12) {
    var v = _l12[k];
    var _e36;
    if (numeric63(k)) {
      _e36 = parseInt(k);
    } else {
      _e36 = k;
    }
    var _k6 = _e36;
    if (!( typeof(_k6) === "number")) {
      return(true);
    }
  }
  return(false);
};
empty63 = function (t) {
  var _l13 = t;
  var _i15 = undefined;
  for (_i15 in _l13) {
    var x = _l13[_i15];
    var _e37;
    if (numeric63(_i15)) {
      _e37 = parseInt(_i15);
    } else {
      _e37 = _i15;
    }
    var __i15 = _e37;
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
      var _e38;
      if (numeric63(k)) {
        _e38 = parseInt(k);
      } else {
        _e38 = k;
      }
      var _k7 = _e38;
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
    if (! !( typeof(l) === "object") && l._stash) {
      var args1 = almost(args);
      var _l15 = l;
      var k = undefined;
      for (k in _l15) {
        var v = _l15[k];
        var _e39;
        if (numeric63(k)) {
          _e39 = parseInt(k);
        } else {
          _e39 = k;
        }
        var _k8 = _e39;
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
  }, reverse(xs)) || 0);
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
  }, reverse(xs)) || 1);
};
_37 = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (_0, _1) {
    return(_1 % _0);
  }, reverse(xs)) || 1);
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
    var _e40;
    if (c === "\n") {
      _e40 = "\\n";
    } else {
      var _e41;
      if (c === "\"") {
        _e41 = "\\\"";
      } else {
        var _e42;
        if (c === "\\") {
          _e42 = "\\\\";
        } else {
          _e42 = c;
        }
        _e41 = _e42;
      }
      _e40 = _e41;
    }
    var c1 = _e40;
    s1 = s1 + c1;
    i = i + 1;
  }
  return(s1 + "\"");
};
str = function (x, depth) {
  if (depth && depth > 40) {
    return("circular");
  } else {
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
            if (typeof(x) === "boolean") {
              if (x) {
                return("true");
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
                  if (!( typeof(x) === "object")) {
                    return(tostring(x));
                  } else {
                    var s = "(";
                    var sp = "";
                    var xs = [];
                    var ks = [];
                    var d = (depth || 0) + 1;
                    var _l16 = x;
                    var k = undefined;
                    for (k in _l16) {
                      var v = _l16[k];
                      var _e43;
                      if (numeric63(k)) {
                        _e43 = parseInt(k);
                      } else {
                        _e43 = k;
                      }
                      var _k9 = _e43;
                      if (typeof(_k9) === "number") {
                        xs[_k9] = str(v, d);
                      } else {
                        add(ks, _k9 + ":");
                        add(ks, str(v, d));
                      }
                    }
                    var _l17 = join(xs, ks);
                    var _i19 = undefined;
                    for (_i19 in _l17) {
                      var v = _l17[_i19];
                      var _e44;
                      if (numeric63(_i19)) {
                        _e44 = parseInt(_i19);
                      } else {
                        _e44 = _i19;
                      }
                      var __i19 = _e44;
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
  return((environment.length || 0) === 1);
};
setenv = function (k) {
  var _r179 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id60 = _r179;
  var _keys = cut(_id60, 0);
  if (typeof(k) === "string") {
    var _e45;
    if (_keys.toplevel) {
      _e45 = environment[0];
    } else {
      _e45 = last(environment);
    }
    var frame = _e45;
    var entry = frame[k] || {};
    var _l18 = _keys;
    var _k10 = undefined;
    for (_k10 in _l18) {
      var v = _l18[_k10];
      var _e46;
      if (numeric63(_k10)) {
        _e46 = parseInt(_k10);
      } else {
        _e46 = _k10;
      }
      var _k11 = _e46;
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
