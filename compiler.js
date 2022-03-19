var reader = require("reader");
getenv = function (k, p) {
  if (typeof(k) === "string") {
    var i = (environment42.length || 0) - 1;
    while (i >= 0) {
      var b = environment42[i][k];
      if (!( typeof(b) === "undefined" || b === null)) {
        var _e;
        if (p) {
          _e = b[p];
        } else {
          _e = b;
        }
        return _e;
      }
      i = i - 1;
    }
  }
};
var macro_function = function (k) {
  return getenv(k, "macro");
};
var macro63 = function (k) {
  var x = macro_function(k);
  return !( typeof(x) === "undefined" || x === null);
};
var special63 = function (k) {
  var x = getenv(k, "special");
  return !( typeof(x) === "undefined" || x === null);
};
var special_form63 = function (form) {
  return typeof(form) === "object" && special63(form[0]);
};
var statement63 = function (k) {
  return special63(k) && getenv(k, "stmt");
};
var symbol_expansion = function (k) {
  return getenv(k, "symbol");
};
var symbol63 = function (k) {
  var x = symbol_expansion(k);
  return !( typeof(x) === "undefined" || x === null);
};
var variable63 = function (k) {
  var b = first(function (_) {
    return _[k];
  }, rev(environment42));
  var _id29 = typeof(b) === "object";
  var _e1;
  if (_id29) {
    var x = b.variable;
    _e1 = !( typeof(x) === "undefined" || x === null);
  } else {
    _e1 = _id29;
  }
  return _e1;
};
bound63 = function (x) {
  return macro63(x) || special63(x) || symbol63(x) || variable63(x);
};
quoted = function (form) {
  if (typeof(form) === "string") {
    return escape(form);
  } else {
    if (!( typeof(form) === "object")) {
      return form;
    } else {
      return join(["list"], map(quoted, form));
    }
  }
};
var literal = function (s) {
  if (string_literal63(s)) {
    return s;
  } else {
    return quoted(s);
  }
};
var names = {};
uniq = function (x) {
  if (names[x]) {
    var i = names[x];
    names[x] = names[x] + 1;
    return uniq(x + i);
  } else {
    names[x] = 1;
    return "_" + x;
  }
};
var reset = function () {
  names = {};
  return names;
};
var stash42 = function (args) {
  if (keys63(args)) {
    var l = ["%object"];
    var _l = args;
    var k = undefined;
    for (k in _l) {
      var v = _l[k];
      var _e2;
      if (numeric63(k)) {
        _e2 = parseInt(k);
      } else {
        _e2 = k;
      }
      var _k = _e2;
      if (!( typeof(_k) === "number")) {
        add(l, literal(_k));
        add(l, v);
      }
    }
    return join(args, [["stash!", l]]);
  } else {
    return args;
  }
};
var bias = function (k) {
  if (typeof(k) === "number" && !( target42 === "js")) {
    if (target42 === "js") {
      k = k - 1;
    } else {
      k = k + 1;
    }
  }
  return k;
};
bind = function (lh, rh, vars) {
  if (!( typeof(lh) === "object") || lh[0] === "at" || lh[0] === "get") {
    return [lh, rh];
  } else {
    if (lh[0] === "o") {
      var _ = lh[0];
      var _var = lh[1];
      var val = lh[2];
      return [_var, ["if", ["nil?", rh], val, rh]];
    } else {
      var id = uniq("id");
      var bs = [id, rh];
      if (!( typeof(macroexpand(rh)) === "object") && ! ontree(function (_) {
        return _ === rh;
      }, lh)) {
        bs = [];
        id = rh;
      } else {
        if (vars) {
          add(vars, id);
        }
      }
      var _l1 = lh;
      var k = undefined;
      for (k in _l1) {
        var v = _l1[k];
        var _e3;
        if (numeric63(k)) {
          _e3 = parseInt(k);
        } else {
          _e3 = k;
        }
        var _k1 = _e3;
        var _e4;
        if (_k1 === "rest") {
          _e4 = ["cut", id, lh.length || 0];
        } else {
          _e4 = ["get", id, ["quote", bias(_k1)]];
        }
        var x = _e4;
        if (!( typeof(_k1) === "undefined" || _k1 === null)) {
          var _e5;
          if (v === true) {
            _e5 = _k1;
          } else {
            _e5 = v;
          }
          var _k2 = _e5;
          bs = join(bs, bind(_k2, x, vars));
        }
      }
      return bs;
    }
  }
};
setenv("arguments%", stash33({["macro"]: function (from) {
  return [["get", ["get", ["get", "Array", ["quote", "prototype"]], ["quote", "slice"]], ["quote", "call"]], "arguments", from];
}}));
bind42 = function (args, body) {
  var args1 = [];
  var rest = function () {
    if (target42 === "js") {
      return ["unstash", ["arguments%", args1.length || 0]];
    } else {
      add(args1, "|...|");
      return ["unstash", ["list", "|...|"]];
    }
  };
  if (!( typeof(args) === "object")) {
    return [args1, join(["let", [args, rest()]], body)];
  } else {
    var bs = [];
    var inits = [];
    var r = uniq("r");
    var _x26 = args;
    var _n2 = _x26.length || 0;
    var _i2 = 0;
    while (_i2 < _n2) {
      var v = _x26[_i2];
      if (!( typeof(v) === "object")) {
        add(args1, v);
      } else {
        if (v[0] === "o") {
          var _ = v[0];
          var _var1 = v[1];
          var val = v[2];
          add(args1, _var1);
          add(inits, ["if", ["nil?", _var1], ["=", _var1, val]]);
        } else {
          var x = uniq("x");
          add(args1, x);
          bs = join(bs, [v, x]);
        }
      }
      _i2 = _i2 + 1;
    }
    if (keys63(args)) {
      bs = join(bs, [r, rest()]);
      bs = join(bs, [keys(args), r]);
    }
    return [args1, join(["let", bs], inits, body)];
  }
};
var quoting63 = function (depth) {
  return typeof(depth) === "number";
};
var quasiquoting63 = function (depth) {
  return quoting63(depth) && depth > 0;
};
var can_unquote63 = function (depth) {
  return quoting63(depth) && depth === 1;
};
var quasisplice63 = function (x, depth) {
  return can_unquote63(depth) && typeof(x) === "object" && x[0] === "unquote-splicing";
};
var expand_local = function (_x35) {
  var x = _x35[0];
  var name = _x35[1];
  var value = _x35[2];
  return ["%local", name, macroexpand(value)];
};
var expand_function = function (_x37) {
  var x = _x37[0];
  var args = _x37[1];
  var body = cut(_x37, 2);
  add(environment42, {});
  var _l2 = args;
  var _i3 = undefined;
  for (_i3 in _l2) {
    var _x38 = _l2[_i3];
    var _e6;
    if (numeric63(_i3)) {
      _e6 = parseInt(_i3);
    } else {
      _e6 = _i3;
    }
    var __i3 = _e6;
    setenv(_x38, stash33({["variable"]: true}));
  }
  var _x39 = join(["%function", args], macroexpand(body));
  drop(environment42);
  return _x39;
};
var expand_definition = function (_x41) {
  var x = _x41[0];
  var name = _x41[1];
  var args = _x41[2];
  var body = cut(_x41, 3);
  add(environment42, {});
  var _l3 = args;
  var _i4 = undefined;
  for (_i4 in _l3) {
    var _x42 = _l3[_i4];
    var _e7;
    if (numeric63(_i4)) {
      _e7 = parseInt(_i4);
    } else {
      _e7 = _i4;
    }
    var __i4 = _e7;
    setenv(_x42, stash33({["variable"]: true}));
  }
  var _x43 = join([x, name, args], macroexpand(body));
  drop(environment42);
  return _x43;
};
var expand_macro = function (_x45) {
  var name = _x45[0];
  var body = cut(_x45, 1);
  return macroexpand(apply(macro_function(name), body));
};
macroexpand = function (form) {
  if (symbol63(form)) {
    return macroexpand(symbol_expansion(form));
  } else {
    if (!( typeof(form) === "object")) {
      return form;
    } else {
      var x = form[0];
      if (x === "%local") {
        return expand_local(form);
      } else {
        if (x === "%function") {
          return expand_function(form);
        } else {
          if (x === "%global-function") {
            return expand_definition(form);
          } else {
            if (x === "%local-function") {
              return expand_definition(form);
            } else {
              if (typeof(x) === "string" && char(x, 0) === "~") {
                return macroexpand(["not", join([clip(x, 1)], cut(form, 1))]);
              } else {
                if (macro63(x)) {
                  return expand_macro(form);
                } else {
                  return map(macroexpand, form);
                }
              }
            }
          }
        }
      }
    }
  }
};
var quasiquote_list = function (form, depth) {
  var xs = [["list"]];
  var _l4 = form;
  var k = undefined;
  for (k in _l4) {
    var v = _l4[k];
    var _e8;
    if (numeric63(k)) {
      _e8 = parseInt(k);
    } else {
      _e8 = k;
    }
    var _k3 = _e8;
    if (!( typeof(_k3) === "number")) {
      var _e9;
      if (quasisplice63(v, depth)) {
        _e9 = quasiexpand(v[1]);
      } else {
        _e9 = quasiexpand(v, depth);
      }
      var _v = _e9;
      last(xs)[_k3] = _v;
    }
  }
  var _x50 = form;
  var _n6 = _x50.length || 0;
  var _i6 = 0;
  while (_i6 < _n6) {
    var x = _x50[_i6];
    if (quasisplice63(x, depth)) {
      var _x51 = quasiexpand(x[1]);
      add(xs, _x51);
      add(xs, ["list"]);
    } else {
      add(last(xs), quasiexpand(x, depth));
    }
    _i6 = _i6 + 1;
  }
  var pruned = keep(function (_) {
    return (_.length || 0) > 1 || !( _[0] === "list") || keys63(_);
  }, xs);
  if ((pruned.length || 0) === 1) {
    return pruned[0];
  } else {
    return join(["join"], pruned);
  }
};
quasiexpand = function (form, depth) {
  if (quasiquoting63(depth)) {
    if (!( typeof(form) === "object")) {
      return ["quote", form];
    } else {
      if (can_unquote63(depth) && form[0] === "unquote") {
        return quasiexpand(form[1]);
      } else {
        if (form[0] === "unquote" || form[0] === "unquote-splicing") {
          return quasiquote_list(form, depth - 1);
        } else {
          if (form[0] === "quasiquote") {
            return quasiquote_list(form, depth + 1);
          } else {
            return quasiquote_list(form, depth);
          }
        }
      }
    }
  } else {
    if (!( typeof(form) === "object")) {
      return form;
    } else {
      if (form[0] === "quote") {
        return form;
      } else {
        if (form[0] === "quasiquote") {
          return quasiexpand(form[1], 1);
        } else {
          return map(function (_) {
            return quasiexpand(_, depth);
          }, form);
        }
      }
    }
  }
};
expand_if = function (_x55) {
  var a = _x55[0];
  var b = _x55[1];
  var c = cut(_x55, 2);
  if (!( typeof(b) === "undefined" || b === null)) {
    return [join(["%if", a, b], expand_if(c))];
  } else {
    if (!( typeof(a) === "undefined" || a === null)) {
      return [a];
    }
  }
};
if (typeof(_x59) === "undefined" || _x59 === null) {
  _x59 = true;
  indent_level42 = 0;
}
indentation = function () {
  var s = "";
  var i = 0;
  while (i < indent_level42) {
    s = s + "  ";
    i = i + 1;
  }
  return s;
};
setenv("w/indent", stash33({["macro"]: function (form) {
  var x = uniq("x");
  return ["do", ["++", "indent-level*"], ["with", x, form, ["--", "indent-level*"]]];
}}));
var reserved = {["for"]: true, ["-"]: true, ["/"]: true, ["repeat"]: true, ["%"]: true, ["else"]: true, ["and"]: true, ["do"]: true, ["or"]: true, ["<"]: true, ["try"]: true, ["in"]: true, ["case"]: true, ["typeof"]: true, ["var"]: true, ["import"]: true, ["default"]: true, ["new"]: true, ["<="]: true, ["false"]: true, ["with"]: true, ["break"]: true, ["delete"]: true, ["nil"]: true, ["="]: true, ["finally"]: true, ["+"]: true, ["return"]: true, ["void"]: true, [">"]: true, ["function"]: true, [">="]: true, ["local"]: true, ["=="]: true, ["while"]: true, ["throw"]: true, ["catch"]: true, ["continue"]: true, ["until"]: true, ["switch"]: true, ["elseif"]: true, ["not"]: true, ["true"]: true, ["if"]: true, ["debugger"]: true, ["*"]: true, ["then"]: true, ["end"]: true, ["instanceof"]: true};
reserved63 = function (x) {
  return reserved[x];
};
var valid_code63 = function (n) {
  return number_code63(n) || n > 64 && n < 91 || n > 96 && n < 123 || n === 95;
};
valid_id63 = function (id) {
  if ((id.length || 0) === 0 || reserved63(id)) {
    return false;
  } else {
    var i = 0;
    while (i < (id.length || 0)) {
      if (! valid_code63(code(id, i))) {
        return false;
      }
      i = i + 1;
    }
    return true;
  }
};
key = function (k) {
  return "[" + compile(k) + "]";
};
mapo = function (f, l) {
  var o = [];
  var _l5 = l;
  var k = undefined;
  for (k in _l5) {
    var v = _l5[k];
    var _e10;
    if (numeric63(k)) {
      _e10 = parseInt(k);
    } else {
      _e10 = k;
    }
    var _k4 = _e10;
    var x = f(v);
    if (!( typeof(x) === "undefined" || x === null)) {
      add(o, literal(_k4));
      add(o, x);
    }
  }
  return o;
};
var _x65 = [];
var _x66 = [];
_x66.js = "!";
_x66.lua = "not";
_x65["not"] = _x66;
var _x67 = [];
_x67["*"] = true;
_x67["%"] = true;
_x67["/"] = true;
var _x68 = [];
_x68["+"] = true;
_x68["-"] = true;
var _x69 = [];
var _x70 = [];
_x70.js = "+";
_x70.lua = "..";
_x69.cat = _x70;
var _x71 = [];
_x71["<"] = true;
_x71["<="] = true;
_x71[">="] = true;
_x71[">"] = true;
var _x72 = [];
var _x73 = [];
_x73.js = "===";
_x73.lua = "==";
_x72.is = _x73;
var _x74 = [];
var _x75 = [];
_x75.js = "&&";
_x75.lua = "and";
_x74["and"] = _x75;
var _x76 = [];
var _x77 = [];
_x77.js = "||";
_x77.lua = "or";
_x76["or"] = _x77;
var infix = [_x65, _x67, _x68, _x69, _x71, _x72, _x74, _x76];
var unary63 = function (form) {
  return (form.length || 0) === 2 && in63(form[0], ["not", "-"]);
};
index = function (k) {
  return k;
};
var precedence = function (form) {
  if (!( !( typeof(form) === "object") || unary63(form))) {
    var _l6 = infix;
    var k = undefined;
    for (k in _l6) {
      var v = _l6[k];
      var _e11;
      if (numeric63(k)) {
        _e11 = parseInt(k);
      } else {
        _e11 = k;
      }
      var _k5 = _e11;
      if (v[form[0]]) {
        return index(_k5);
      }
    }
  }
  return 0;
};
var getop = function (op) {
  return find(function (_) {
    var x = _[op];
    if (x === true) {
      return op;
    } else {
      if (!( typeof(x) === "undefined" || x === null)) {
        return x[target42];
      }
    }
  }, infix);
};
infix63 = function (x) {
  var _x79 = getop(x);
  return !( typeof(_x79) === "undefined" || _x79 === null);
};
infix_operator63 = function (x) {
  return !( typeof(x) === "undefined" || x === null) && typeof(x) === "object" && infix63(x[0]);
};
var compile_args = function (args) {
  var s = "(";
  var c = "";
  var _x80 = args;
  var _n9 = _x80.length || 0;
  var _i9 = 0;
  while (_i9 < _n9) {
    var x = _x80[_i9];
    s = s + c + compile(x);
    c = ", ";
    _i9 = _i9 + 1;
  }
  return s + ")";
};
var escape_newlines = function (s) {
  var s1 = "";
  var i = 0;
  while (i < (s.length || 0)) {
    var c = char(s, i);
    var _e12;
    if (c === "\n") {
      _e12 = "\\n";
    } else {
      _e12 = c;
    }
    s1 = s1 + _e12;
    i = i + 1;
  }
  return s1;
};
var id = function (id) {
  var id1 = "";
  var i = 0;
  while (i < (id.length || 0)) {
    var c = char(id, i);
    var n = code(c);
    var _e13;
    if (c === "-") {
      _e13 = "_";
    } else {
      var _e14;
      if (valid_code63(n)) {
        _e14 = c;
      } else {
        var _e15;
        if (i === 0) {
          _e15 = "_" + n;
        } else {
          _e15 = n;
        }
        _e14 = _e15;
      }
      _e13 = _e14;
    }
    var c1 = _e13;
    id1 = id1 + c1;
    i = i + 1;
  }
  if (reserved63(id1)) {
    return "_" + id1;
  } else {
    return id1;
  }
};
var compile_atom = function (x) {
  if (x === "nil" && target42 === "lua") {
    return x;
  } else {
    if (x === "nil") {
      return "undefined";
    } else {
      if (id_literal63(x)) {
        return inner(x);
      } else {
        if (string_literal63(x)) {
          return escape_newlines(x);
        } else {
          if (typeof(x) === "string") {
            return id(x);
          } else {
            if (typeof(x) === "boolean") {
              if (x) {
                return "true";
              } else {
                return "false";
              }
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
                      return x + "";
                    } else {
                      throw new Error("Cannot compile atom: " + str(x));
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
var terminator = function (stmt63) {
  if (! stmt63) {
    return "";
  } else {
    if (target42 === "js") {
      return ";\n";
    } else {
      return "\n";
    }
  }
};
var compile_special = function (form, stmt63) {
  var x = form[0];
  var args = cut(form, 1);
  var _id8 = getenv(x);
  var self_tr63 = _id8.tr;
  var stmt = _id8.stmt;
  var special = _id8.special;
  var tr = terminator(stmt63 && ! self_tr63);
  return apply(special, args) + tr;
};
var parenthesize_call63 = function (x) {
  return typeof(x) === "object" && x[0] === "%function" || precedence(x) > 0;
};
var compile_call = function (form) {
  var f = form[0];
  var f1 = compile(f);
  var args = compile_args(stash42(cut(form, 1)));
  if (parenthesize_call63(f)) {
    return "(" + f1 + ")" + args;
  } else {
    return f1 + args;
  }
};
var op_delims = function (parent, child) {
  var _r58 = unstash(Array.prototype.slice.call(arguments, 2));
  var right = _r58.right;
  var _e16;
  if (right) {
    _e16 = precedence(child) >= precedence(parent);
  } else {
    _e16 = precedence(child) > precedence(parent);
  }
  if (_e16) {
    return ["(", ")"];
  } else {
    return ["", ""];
  }
};
var compile_infix = function (form) {
  var op = form[0];
  var _id11 = cut(form, 1);
  var a = _id11[0];
  var b = _id11[1];
  var _id12 = op_delims(form, a);
  var ao = _id12[0];
  var ac = _id12[1];
  var _id13 = op_delims(form, b, stash33({["right"]: true}));
  var bo = _id13[0];
  var bc = _id13[1];
  var _a = compile(a);
  var _b = compile(b);
  var _op = getop(op);
  if (unary63(form)) {
    return _op + ao + " " + _a + ac;
  } else {
    return ao + _a + ac + " " + _op + " " + bo + _b + bc;
  }
};
compile_function = function (args, body) {
  var _r60 = unstash(Array.prototype.slice.call(arguments, 2));
  var name = _r60.name;
  var prefix = _r60.prefix;
  var _e17;
  if (name) {
    _e17 = compile(name);
  } else {
    _e17 = "";
  }
  var _id15 = _e17;
  var _args = compile_args(args);
  indent_level42 = indent_level42 + 1;
  var _x83 = compile(body, stash33({["stmt"]: true}));
  indent_level42 = indent_level42 - 1;
  var _body = _x83;
  var ind = indentation();
  var _e18;
  if (prefix) {
    _e18 = prefix + " ";
  } else {
    _e18 = "";
  }
  var p = _e18;
  var _e19;
  if (target42 === "js") {
    _e19 = "";
  } else {
    _e19 = "end";
  }
  var tr = _e19;
  if (name) {
    tr = tr + "\n";
  }
  if (target42 === "js") {
    return "function " + _id15 + _args + " {\n" + _body + ind + "}" + tr;
  } else {
    return p + "function " + _id15 + _args + "\n" + _body + ind + tr;
  }
};
var can_return63 = function (form) {
  return !( typeof(form) === "undefined" || form === null) && (!( typeof(form) === "object") || !( form[0] === "return") && ! statement63(form[0]));
};
compile = function (form) {
  var _r62 = unstash(Array.prototype.slice.call(arguments, 1));
  var stmt = _r62.stmt;
  if (typeof(form) === "undefined" || form === null) {
    return "";
  } else {
    if (special_form63(form)) {
      return compile_special(form, stmt);
    } else {
      var tr = terminator(stmt);
      var _e20;
      if (stmt) {
        _e20 = indentation();
      } else {
        _e20 = "";
      }
      var ind = _e20;
      var _e21;
      if (!( typeof(form) === "object")) {
        _e21 = compile_atom(form);
      } else {
        var _e22;
        if (infix63(form[0])) {
          _e22 = compile_infix(form);
        } else {
          _e22 = compile_call(form);
        }
        _e21 = _e22;
      }
      var _form = _e21;
      return ind + _form + tr;
    }
  }
};
var lower_statement = function (form, tail63) {
  var hoist = [];
  var e = lower(form, hoist, true, tail63);
  if ((hoist.length || 0) > 0 && !( typeof(e) === "undefined" || e === null)) {
    return join(["do"], hoist, [e]);
  } else {
    if (!( typeof(e) === "undefined" || e === null)) {
      return e;
    } else {
      if ((hoist.length || 0) > 1) {
        return join(["do"], hoist);
      } else {
        return hoist[0];
      }
    }
  }
};
var lower_body = function (body, tail63) {
  return lower_statement(join(["do"], body), tail63);
};
literal63 = function (form) {
  return !( typeof(form) === "object") || getenv(form[0], "literal");
};
standalone63 = function (form) {
  return typeof(form) === "object" && ! infix63(form[0]) && ! literal63(form) || id_literal63(form);
};
var lower_do = function (args, hoist, stmt63, tail63) {
  var _x88 = almost(args);
  var _n10 = _x88.length || 0;
  var _i10 = 0;
  while (_i10 < _n10) {
    var x = _x88[_i10];
    var e = lower(x, hoist, stmt63);
    if (standalone63(e)) {
      add(hoist, e);
    }
    _i10 = _i10 + 1;
  }
  var e = lower(last(args), hoist, stmt63, tail63);
  if (tail63 && can_return63(e)) {
    return ["return", e];
  } else {
    return e;
  }
};
var lower_assign = function (args, hoist, stmt63, tail63) {
  var lh = args[0];
  var rh = args[1];
  add(hoist, ["assign", lh, lower(rh, hoist)]);
  if (!( stmt63 && ! tail63)) {
    return lh;
  }
};
var lower_if = function (args, hoist, stmt63, tail63) {
  var cond = args[0];
  var _then = args[1];
  var _else = args[2];
  if (stmt63 || tail63) {
    var _e24;
    if (_else) {
      _e24 = [lower_body([_else], tail63)];
    }
    return add(hoist, join(["%if", lower(cond, hoist), lower_body([_then], tail63)], _e24));
  } else {
    var e = uniq("e");
    add(hoist, ["%local", e]);
    var _e23;
    if (_else) {
      _e23 = [lower(["assign", e, _else])];
    }
    add(hoist, join(["%if", lower(cond, hoist), lower(["assign", e, _then])], _e23));
    return e;
  }
};
var lower_short = function (x, args, hoist) {
  var a = args[0];
  var b = args[1];
  var hoist1 = [];
  var b1 = lower(b, hoist1);
  if ((hoist1.length || 0) > 0) {
    var _id20 = uniq("id");
    var _e25;
    if (x === "and") {
      _e25 = ["%if", _id20, b, _id20];
    } else {
      _e25 = ["%if", _id20, _id20, b];
    }
    return lower(["do", ["%local", _id20, a], _e25], hoist);
  } else {
    return [x, lower(a, hoist), b1];
  }
};
var lower_try = function (args, hoist, tail63) {
  return add(hoist, ["%try", lower_body(args, tail63)]);
};
var lower_while = function (args, hoist) {
  var c = args[0];
  var body = cut(args, 1);
  var hoist1 = [];
  var _c = lower(c, hoist1);
  var _e26;
  if ((hoist1.length || 0) === 0) {
    _e26 = ["while", _c, lower_body(body)];
  } else {
    _e26 = ["while", true, join(["do"], hoist1, [["%if", ["not", _c], ["break"]], lower_body(body)])];
  }
  return add(hoist, _e26);
};
var lower_for = function (args, hoist) {
  var l = args[0];
  var k = args[1];
  var body = cut(args, 2);
  return add(hoist, ["%for", lower(l, hoist), k, lower_body(body)]);
};
var lower_function = function (args) {
  var a = args[0];
  var body = cut(args, 1);
  return ["%function", a, lower_body(body, true)];
};
var lower_definition = function (kind, args, hoist) {
  var _id24 = args;
  var name = _id24[0];
  var _args1 = _id24[1];
  var body = cut(_id24, 2);
  return add(hoist, [kind, name, _args1, lower_body(body, true)]);
};
var lower_call = function (form, hoist) {
  var _form1 = map(function (_) {
    return lower(_, hoist);
  }, form);
  if ((_form1.length || 0) > 0) {
    return _form1;
  }
};
var lower_infix63 = function (form) {
  return infix63(form[0]) && (form.length || 0) > 3;
};
var lower_infix = function (form, hoist) {
  var x = form[0];
  var args = cut(form, 1);
  return lower(reduce(function (_0, _1) {
    return [x, _1, _0];
  }, rev(args)), hoist);
};
var lower_special = function (form, hoist) {
  var e = lower_call(form, hoist);
  if (e) {
    return add(hoist, e);
  }
};
lower = function (form, hoist, stmt63, tail63) {
  if (!( typeof(form) === "object")) {
    return form;
  } else {
    if (empty63(form)) {
      return ["%array"];
    } else {
      if (typeof(hoist) === "undefined" || hoist === null) {
        return lower_statement(form);
      } else {
        if (lower_infix63(form)) {
          return lower_infix(form, hoist);
        } else {
          var x = form[0];
          var args = cut(form, 1);
          if (x === "do") {
            return lower_do(args, hoist, stmt63, tail63);
          } else {
            if (x === "assign") {
              return lower_assign(args, hoist, stmt63, tail63);
            } else {
              if (x === "%if") {
                return lower_if(args, hoist, stmt63, tail63);
              } else {
                if (x === "%try") {
                  return lower_try(args, hoist, tail63);
                } else {
                  if (x === "while") {
                    return lower_while(args, hoist);
                  } else {
                    if (x === "%for") {
                      return lower_for(args, hoist);
                    } else {
                      if (x === "%function") {
                        return lower_function(args);
                      } else {
                        if (x === "%local-function" || x === "%global-function") {
                          return lower_definition(x, args, hoist);
                        } else {
                          if (in63(x, ["and", "or"])) {
                            return lower_short(x, args, hoist);
                          } else {
                            if (statement63(x)) {
                              return lower_special(form, hoist);
                            } else {
                              return lower_call(form, hoist);
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
        }
      }
    }
  }
};
var expand = function (form) {
  return lower(macroexpand(form));
};
if (typeof(_x119) === "undefined" || _x119 === null) {
  _x119 = true;
  if (!( typeof(global) === "undefined" || global === null)) {
    global.require = require;
  }
  var _e27;
  if (typeof(global) === "undefined" || global === null) {
    _e27 = window.eval;
  } else {
    _e27 = global.eval;
  }
  run_js = _e27;
}
var run = run_js;
var eval = function (form) {
  var previous = target42;
  target42 = "js";
  _37result = undefined;
  var code = compile(expand(["assign", "%result", form]));
  target42 = previous;
  run(code);
  return _37result;
};
setenv("do", stash33({["tr"]: true, ["special"]: function () {
  var forms = unstash(Array.prototype.slice.call(arguments, 0));
  var s = "";
  var _x121 = forms;
  var _n11 = _x121.length || 0;
  var _i11 = 0;
  while (_i11 < _n11) {
    var x = _x121[_i11];
    s = s + compile(x, stash33({["stmt"]: true}));
    if (! !( typeof(x) === "object")) {
      if (x[0] === "return" || x[0] === "break") {
        break;
      }
    }
    _i11 = _i11 + 1;
  }
  return s;
}, ["stmt"]: true}));
setenv("%if", stash33({["tr"]: true, ["special"]: function (cond, cons, alt) {
  var _cond = compile(cond);
  indent_level42 = indent_level42 + 1;
  var _x122 = compile(cons, stash33({["stmt"]: true}));
  indent_level42 = indent_level42 - 1;
  var _cons = _x122;
  var _e28;
  if (alt) {
    indent_level42 = indent_level42 + 1;
    var _x123 = compile(alt, stash33({["stmt"]: true}));
    indent_level42 = indent_level42 - 1;
    _e28 = _x123;
  }
  var _alt = _e28;
  var ind = indentation();
  var s = "";
  if (target42 === "js") {
    s = s + ind + "if (" + _cond + ") {\n" + _cons + ind + "}";
  } else {
    s = s + ind + "if " + _cond + " then\n" + _cons;
  }
  if (_alt && target42 === "js") {
    s = s + " else {\n" + _alt + ind + "}";
  } else {
    if (_alt) {
      s = s + ind + "else\n" + _alt;
    }
  }
  if (target42 === "lua") {
    return s + ind + "end\n";
  } else {
    return s + "\n";
  }
}, ["stmt"]: true}));
setenv("while", stash33({["tr"]: true, ["special"]: function (cond, form) {
  var _cond1 = compile(cond);
  indent_level42 = indent_level42 + 1;
  var _x124 = compile(form, stash33({["stmt"]: true}));
  indent_level42 = indent_level42 - 1;
  var body = _x124;
  var ind = indentation();
  if (target42 === "js") {
    return ind + "while (" + _cond1 + ") {\n" + body + ind + "}\n";
  } else {
    return ind + "while " + _cond1 + " do\n" + body + ind + "end\n";
  }
}, ["stmt"]: true}));
setenv("%for", stash33({["tr"]: true, ["special"]: function (l, k, form) {
  var _l7 = compile(l);
  var ind = indentation();
  indent_level42 = indent_level42 + 1;
  var _x125 = compile(form, stash33({["stmt"]: true}));
  indent_level42 = indent_level42 - 1;
  var body = _x125;
  if (target42 === "lua") {
    return ind + "for " + k + " in next, " + _l7 + " do\n" + body + ind + "end\n";
  } else {
    return ind + "for (" + k + " in " + _l7 + ") {\n" + body + ind + "}\n";
  }
}, ["stmt"]: true}));
setenv("%try", stash33({["tr"]: true, ["special"]: function (form) {
  var e = uniq("e");
  var ind = indentation();
  indent_level42 = indent_level42 + 1;
  var _x126 = compile(form, stash33({["stmt"]: true}));
  indent_level42 = indent_level42 - 1;
  var body = _x126;
  var hf = ["return", ["%array", false, ["get", e, "\"message\""], ["get", e, "\"stack\""]]];
  indent_level42 = indent_level42 + 1;
  var _x131 = compile(hf, stash33({["stmt"]: true}));
  indent_level42 = indent_level42 - 1;
  var h = _x131;
  return ind + "try {\n" + body + ind + "}\n" + ind + "catch (" + e + ") {\n" + h + ind + "}\n";
}, ["stmt"]: true}));
setenv("%delete", stash33({["special"]: function (place) {
  return indentation() + "delete " + compile(place);
}, ["stmt"]: true}));
setenv("break", stash33({["special"]: function () {
  return indentation() + "break";
}, ["stmt"]: true}));
setenv("%function", stash33({["special"]: function (args, body) {
  return compile_function(args, body);
}}));
setenv("%global-function", stash33({["tr"]: true, ["special"]: function (name, args, body) {
  if (target42 === "lua") {
    var x = compile_function(args, body, stash33({["name"]: name}));
    return indentation() + x;
  } else {
    return compile(["assign", name, ["%function", args, body]], stash33({["stmt"]: true}));
  }
}, ["stmt"]: true}));
setenv("%local-function", stash33({["tr"]: true, ["special"]: function (name, args, body) {
  if (target42 === "lua") {
    var x = compile_function(args, body, stash33({["name"]: name, ["prefix"]: "local"}));
    return indentation() + x;
  } else {
    return compile(["%local", name, ["%function", args, body]], stash33({["stmt"]: true}));
  }
}, ["stmt"]: true}));
setenv("return", stash33({["special"]: function (x) {
  var _e29;
  if (typeof(x) === "undefined" || x === null) {
    _e29 = "return";
  } else {
    _e29 = "return " + compile(x);
  }
  var _x136 = _e29;
  return indentation() + _x136;
}, ["stmt"]: true}));
setenv("new", stash33({["special"]: function (x) {
  return "new " + compile(x);
}}));
setenv("typeof", stash33({["special"]: function (x) {
  return "typeof(" + compile(x) + ")";
}}));
setenv("error", stash33({["special"]: function (x) {
  var _e30;
  if (target42 === "js") {
    _e30 = "throw " + compile(["new", ["Error", x]]);
  } else {
    _e30 = "error(" + compile(x) + ")";
  }
  var e = _e30;
  return indentation() + e;
}, ["stmt"]: true}));
setenv("%local", stash33({["special"]: function (name, value) {
  var _id27 = compile(name);
  var value1 = compile(value);
  var _e31;
  if (!( typeof(value) === "undefined" || value === null)) {
    _e31 = " = " + value1;
  } else {
    _e31 = "";
  }
  var rh = _e31;
  var _e32;
  if (target42 === "js") {
    _e32 = "var ";
  } else {
    _e32 = "local ";
  }
  var keyword = _e32;
  var ind = indentation();
  return ind + keyword + _id27 + rh;
}, ["stmt"]: true}));
setenv("assign", stash33({["special"]: function (lh, rh) {
  var _lh = compile(lh);
  var _e33;
  if (typeof(rh) === "undefined" || rh === null) {
    _e33 = "nil";
  } else {
    _e33 = rh;
  }
  var _rh = compile(_e33);
  return indentation() + _lh + " = " + _rh;
}, ["stmt"]: true}));
setenv("get", stash33({["special"]: function (l, k) {
  var l1 = compile(l);
  var k1 = compile(k);
  if (target42 === "lua" && char(l1, 0) === "{" || infix_operator63(l)) {
    l1 = "(" + l1 + ")";
  }
  if (string_literal63(k) && valid_id63(inner(k))) {
    return l1 + "." + inner(k);
  } else {
    return l1 + "[" + k1 + "]";
  }
}, ["literal"]: true}));
setenv("%array", stash33({["special"]: function () {
  var forms = unstash(Array.prototype.slice.call(arguments, 0));
  var _e34;
  if (target42 === "lua") {
    _e34 = "{";
  } else {
    _e34 = "[";
  }
  var open = _e34;
  var _e35;
  if (target42 === "lua") {
    _e35 = "}";
  } else {
    _e35 = "]";
  }
  var close = _e35;
  var s = "";
  var c = "";
  var _l8 = forms;
  var k = undefined;
  for (k in _l8) {
    var v = _l8[k];
    var _e36;
    if (numeric63(k)) {
      _e36 = parseInt(k);
    } else {
      _e36 = k;
    }
    var _k6 = _e36;
    if (typeof(_k6) === "number") {
      s = s + c + compile(v);
      c = ", ";
    }
  }
  return open + s + close;
}, ["literal"]: true}));
setenv("%object", stash33({["special"]: function () {
  var forms = unstash(Array.prototype.slice.call(arguments, 0));
  var s = "{";
  var c = "";
  var _e37;
  if (target42 === "lua") {
    _e37 = " = ";
  } else {
    _e37 = ": ";
  }
  var sep = _e37;
  var _l9 = pair(forms);
  var k = undefined;
  for (k in _l9) {
    var v = _l9[k];
    var _e38;
    if (numeric63(k)) {
      _e38 = parseInt(k);
    } else {
      _e38 = k;
    }
    var _k7 = _e38;
    if (typeof(_k7) === "number") {
      var _id28 = v;
      var _k8 = _id28[0];
      var _v1 = _id28[1];
      s = s + c + key(_k8) + sep + compile(_v1);
      c = ", ";
    }
  }
  return s + "}";
}, ["literal"]: true}));
setenv("%unpack", stash33({["special"]: function (x) {
  var _e39;
  if (target42 === "lua") {
    _e39 = "table.unpack";
  } else {
    _e39 = "...";
  }
  var s = _e39;
  return s + "(" + compile(x) + ")";
}}));
exports.run = run;
exports.eval = eval;
exports.expand = expand;
exports.compile = compile;
exports.reset = reset;
