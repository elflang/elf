var reader = require("reader");
getenv = function (k, p) {
  if (typeof(k) === "string") {
    var i = (environment42.length || 0) - 1;
    while (i >= 0) {
      var _b = environment42[i][k];
      if (!( typeof(_b) === "undefined" || _b === null)) {
        var _e7;
        if (p) {
          _e7 = _b[p];
        } else {
          _e7 = _b;
        }
        return _e7;
      }
      i = i - 1;
    }
  }
};
var transformer_function = function (k) {
  return getenv(k, "transformer");
};
var transformer63 = function (k) {
  var _x = transformer_function(k);
  return !( typeof(_x) === "undefined" || _x === null);
};
var macro_function = function (k) {
  return getenv(k, "macro");
};
var macro63 = function (k) {
  var _x1 = macro_function(k);
  return !( typeof(_x1) === "undefined" || _x1 === null);
};
var special63 = function (k) {
  var _x2 = getenv(k, "special");
  return !( typeof(_x2) === "undefined" || _x2 === null);
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
  var _x3 = symbol_expansion(k);
  return !( typeof(_x3) === "undefined" || _x3 === null);
};
var variable63 = function (k) {
  var _b1 = first(function (_) {
    return _[k];
  }, rev(environment42));
  var _id31 = typeof(_b1) === "object";
  var _e8;
  if (_id31) {
    var _x4 = _b1.variable;
    _e8 = !( typeof(_x4) === "undefined" || _x4 === null);
  } else {
    _e8 = _id31;
  }
  return _e8;
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
var _names = {};
uniq = function (x) {
  if (_names[x]) {
    var _i = _names[x];
    _names[x] = _names[x] + 1;
    return uniq(x + _i);
  } else {
    _names[x] = 1;
    return "_" + x;
  }
};
var reset = function () {
  _names = {};
  return _names;
};
var stash42 = function (args) {
  if (keys63(args)) {
    var _l = ["%object"];
    var __l1 = args;
    var _k = undefined;
    for (_k in __l1) {
      var _v = __l1[_k];
      var _e9;
      if (numeric63(_k)) {
        _e9 = parseInt(_k);
      } else {
        _e9 = _k;
      }
      var _k1 = _e9;
      if (!( typeof(_k1) === "number")) {
        add(_l, literal(_k1));
        add(_l, _v);
      }
    }
    return join(args, [["stash!", _l]]);
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
      var __ = lh[0];
      var _var = lh[1];
      var _e13;
      var _x10 = lh[2];
      if (typeof(_x10) === "undefined" || _x10 === null) {
        _e13 = "nil";
      } else {
        _e13 = lh[2];
      }
      var _val = _e13;
      return [_var, ["if", ["nil?", rh], _val, rh]];
    } else {
      var _id1 = uniq("id");
      var _bs = [_id1, rh];
      if (!( typeof(macroexpand(rh)) === "object") && ! ontree(function (_) {
        return _ === rh;
      }, lh)) {
        _bs = [];
        _id1 = rh;
      } else {
        if (vars) {
          add(vars, _id1);
        }
      }
      var __l2 = lh;
      var _k2 = undefined;
      for (_k2 in __l2) {
        var _v1 = __l2[_k2];
        var _e10;
        if (numeric63(_k2)) {
          _e10 = parseInt(_k2);
        } else {
          _e10 = _k2;
        }
        var _k3 = _e10;
        var _e11;
        if (_k3 === "rest") {
          _e11 = ["cut", _id1, lh.length || 0];
        } else {
          _e11 = ["get", _id1, ["quote", bias(_k3)]];
        }
        var _x15 = _e11;
        if (!( typeof(_k3) === "undefined" || _k3 === null)) {
          var _e12;
          if (_v1 === true) {
            _e12 = _k3;
          } else {
            _e12 = _v1;
          }
          var _k4 = _e12;
          _bs = join(_bs, bind(_k4, _x15, vars));
        }
      }
      return _bs;
    }
  }
};
var arguments37__macro = function (from) {
  return [["get", ["get", ["get", "Array", ["quote", "prototype"]], ["quote", "slice"]], ["quote", "call"]], "arguments", from];
};
setenv("arguments%", stash33({["macro"]: arguments37__macro}));
bind42 = function (args, body) {
  var _args1 = [];
  var rest = function () {
    if (target42 === "js") {
      return ["unstash", ["arguments%", _args1.length || 0]];
    } else {
      add(_args1, "|...|");
      return ["unstash", ["list", "|...|"]];
    }
  };
  if (!( typeof(args) === "object")) {
    return [_args1, join(["let", [args, rest()]], body)];
  } else {
    var _bs1 = [];
    var _inits = [];
    var _r24 = uniq("r");
    var __x33 = args;
    var __n2 = __x33.length || 0;
    var __i3 = 0;
    while (__i3 < __n2) {
      var _v2 = __x33[__i3];
      if (!( typeof(_v2) === "object")) {
        add(_args1, _v2);
      } else {
        if (_v2[0] === "o") {
          var __1 = _v2[0];
          var _var1 = _v2[1];
          var _val1 = _v2[2];
          add(_args1, _var1);
          add(_inits, ["if", ["nil?", _var1], ["=", _var1, _val1]]);
        } else {
          var _x37 = uniq("x");
          add(_args1, _x37);
          _bs1 = join(_bs1, [_v2, _x37]);
        }
      }
      __i3 = __i3 + 1;
    }
    if (keys63(args)) {
      _bs1 = join(_bs1, [_r24, rest()]);
      _bs1 = join(_bs1, [keys(args), _r24]);
    }
    return [_args1, join(["let", _bs1], _inits, body)];
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
var expand_local = function (_x43) {
  var _x44 = _x43[0];
  var _name = _x43[1];
  var _value = _x43[2];
  return ["%local", macroexpand(_name), macroexpand(_value)];
};
var expand_function = function (_x46) {
  var _x47 = _x46[0];
  var _args = _x46[1];
  var _body = cut(_x46, 2);
  add(environment42, {});
  var __l3 = _args;
  var __i4 = undefined;
  for (__i4 in __l3) {
    var __x48 = __l3[__i4];
    var _e14;
    if (numeric63(__i4)) {
      _e14 = parseInt(__i4);
    } else {
      _e14 = __i4;
    }
    var __i41 = _e14;
    setenv(__x48, stash33({["variable"]: true}));
  }
  var __x49 = join(["%function", _args], map(macroexpand, _body));
  drop(environment42);
  return __x49;
};
var expand_definition = function (_x51) {
  var _x52 = _x51[0];
  var _name1 = _x51[1];
  var _args11 = _x51[2];
  var _body1 = cut(_x51, 3);
  add(environment42, {});
  var __l4 = _args11;
  var __i5 = undefined;
  for (__i5 in __l4) {
    var __x53 = __l4[__i5];
    var _e15;
    if (numeric63(__i5)) {
      _e15 = parseInt(__i5);
    } else {
      _e15 = __i5;
    }
    var __i51 = _e15;
    setenv(__x53, stash33({["variable"]: true}));
  }
  var __x54 = join([_x52, macroexpand(_name1), _args11], map(macroexpand, _body1));
  drop(environment42);
  return __x54;
};
var expand_macro = function (form) {
  return macroexpand(expand1(form));
};
expand1 = function (_x56) {
  var _name2 = _x56[0];
  var _body2 = cut(_x56, 1);
  return apply(macro_function(_name2), _body2);
};
var expand_transformer = function (form) {
  return transformer_function(form[0][0])(form);
};
expand_complement63 = function (form) {
  return typeof(form) === "string" && str_starts63(form, "~") && !( form === "~");
};
expand_complement = function (form) {
  return ["complement", expand_atom(clip(form, 1))];
};
expand_len63 = function (form) {
  return typeof(form) === "string" && str_starts63(form, "#") && !( form === "#");
};
expand_len = function (form) {
  return ["len", expand_atom(clip(form, 1))];
};
expand_atom_functions42 = [[symbol63, symbol_expansion], [expand_complement63, expand_complement], [expand_len63, expand_len]];
expand_atom = function (form) {
  var __x63 = expand_atom_functions42;
  var __n5 = __x63.length || 0;
  var __i6 = 0;
  while (__i6 < __n5) {
    var __id7 = __x63[__i6];
    var _predicate = __id7[0];
    var _expander = __id7[1];
    if (_predicate(form)) {
      return macroexpand(_expander(form));
    }
    __i6 = __i6 + 1;
  }
  return form;
};
macroexpand = function (form) {
  if (! obj63(form)) {
    return expand_atom(form);
  } else {
    if ((form.length || 0) === 0) {
      return map(macroexpand, form);
    } else {
      var _x64 = macroexpand(form[0]);
      var _args2 = cut(form, 1);
      var _form = join([_x64], _args2);
      if (_x64 === undefined) {
        return map(macroexpand, _args2);
      } else {
        if (_x64 === "%expansion") {
          return _args2[0];
        } else {
          if (_x64 === "%local") {
            return expand_local(_form);
          } else {
            if (_x64 === "%function") {
              return expand_function(_form);
            } else {
              if (_x64 === "%global-function") {
                return expand_definition(_form);
              } else {
                if (_x64 === "%local-function") {
                  return expand_definition(_form);
                } else {
                  if (macro63(_x64)) {
                    return expand_macro(_form);
                  } else {
                    if (hd63(_x64, transformer63)) {
                      return expand_transformer(_form);
                    } else {
                      return join([_x64], map(macroexpand, _args2));
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
var quasiquote_list = function (form, depth) {
  var _xs = [["list"]];
  var __l5 = form;
  var _k5 = undefined;
  for (_k5 in __l5) {
    var _v3 = __l5[_k5];
    var _e16;
    if (numeric63(_k5)) {
      _e16 = parseInt(_k5);
    } else {
      _e16 = _k5;
    }
    var _k6 = _e16;
    if (!( typeof(_k6) === "number")) {
      var _e17;
      if (quasisplice63(_v3, depth)) {
        _e17 = quasiexpand(_v3[1]);
      } else {
        _e17 = quasiexpand(_v3, depth);
      }
      var _v4 = _e17;
      last(_xs)[_k6] = _v4;
    }
  }
  var __x69 = form;
  var __n7 = __x69.length || 0;
  var __i8 = 0;
  while (__i8 < __n7) {
    var _x70 = __x69[__i8];
    if (quasisplice63(_x70, depth)) {
      var _x71 = quasiexpand(_x70[1]);
      add(_xs, _x71);
      add(_xs, ["list"]);
    } else {
      add(last(_xs), quasiexpand(_x70, depth));
    }
    __i8 = __i8 + 1;
  }
  var _pruned = keep(function (_) {
    return (_.length || 0) > 1 || !( _[0] === "list") || keys63(_);
  }, _xs);
  if ((_pruned.length || 0) === 1) {
    return _pruned[0];
  } else {
    return join(["join"], _pruned);
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
expand_if = function (_x75) {
  var _a = _x75[0];
  var _b2 = _x75[1];
  var _c = cut(_x75, 2);
  if (!( typeof(_b2) === "undefined" || _b2 === null)) {
    return [join(["%if", _a, _b2], expand_if(_c))];
  } else {
    if (!( typeof(_a) === "undefined" || _a === null)) {
      return [_a];
    }
  }
};
if (typeof(_x79) === "undefined" || _x79 === null) {
  _x79 = true;
  indent_level42 = 0;
}
indentation = function () {
  var _s = "";
  var _i9 = 0;
  while (_i9 < indent_level42) {
    _s = _s + "  ";
    _i9 = _i9 + 1;
  }
  return _s;
};
var w47indent__macro = function (form) {
  var _x80 = uniq("x");
  return ["do", ["++", "indent-level*"], ["with", _x80, form, ["--", "indent-level*"]]];
};
setenv("w/indent", stash33({["macro"]: w47indent__macro}));
var reserved = {["for"]: true, ["-"]: true, ["import"]: true, ["repeat"]: true, ["%"]: true, ["else"]: true, ["case"]: true, ["do"]: true, ["or"]: true, ["<"]: true, ["try"]: true, ["if"]: true, ["/"]: true, ["<="]: true, ["var"]: true, ["debugger"]: true, ["return"]: true, ["*"]: true, ["typeof"]: true, ["and"]: true, ["with"]: true, ["break"]: true, ["delete"]: true, ["end"]: true, ["="]: true, ["finally"]: true, ["+"]: true, ["default"]: true, ["void"]: true, [">"]: true, ["catch"]: true, [">="]: true, ["local"]: true, ["function"]: true, ["continue"]: true, ["throw"]: true, ["=="]: true, ["switch"]: true, ["until"]: true, ["while"]: true, ["elseif"]: true, ["not"]: true, ["true"]: true, ["in"]: true, ["false"]: true, ["new"]: true, ["then"]: true, ["nil"]: true, ["instanceof"]: true};
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
    var _i10 = 0;
    while (_i10 < (id.length || 0)) {
      if (! valid_code63(code(id, _i10))) {
        return false;
      }
      _i10 = _i10 + 1;
    }
    return true;
  }
};
key = function (k) {
  return "[" + compile(k) + "]";
};
mapo = function (f, l) {
  var _o = [];
  var __l6 = l;
  var _k7 = undefined;
  for (_k7 in __l6) {
    var _v5 = __l6[_k7];
    var _e18;
    if (numeric63(_k7)) {
      _e18 = parseInt(_k7);
    } else {
      _e18 = _k7;
    }
    var _k8 = _e18;
    var _x85 = f(_v5);
    if (!( typeof(_x85) === "undefined" || _x85 === null)) {
      add(_o, literal(_k8));
      add(_o, _x85);
    }
  }
  return _o;
};
var __x87 = [];
var __x88 = [];
__x88.js = "!";
__x88.lua = "not";
__x87["not"] = __x88;
var __x89 = [];
__x89["*"] = true;
__x89["%"] = true;
__x89["/"] = true;
var __x90 = [];
__x90["+"] = true;
__x90["-"] = true;
var __x91 = [];
var __x92 = [];
__x92.js = "+";
__x92.lua = "..";
__x91.cat = __x92;
var __x93 = [];
__x93["<"] = true;
__x93[">="] = true;
__x93[">"] = true;
__x93["<="] = true;
var __x94 = [];
var __x95 = [];
__x95.js = "===";
__x95.lua = "==";
__x94.is = __x95;
var __x96 = [];
var __x97 = [];
__x97.js = "&&";
__x97.lua = "and";
__x96["and"] = __x97;
var __x98 = [];
var __x99 = [];
__x99.js = "||";
__x99.lua = "or";
__x98["or"] = __x99;
var infix = [__x87, __x89, __x90, __x91, __x93, __x94, __x96, __x98];
var unary63 = function (form) {
  return (form.length || 0) === 2 && in63(form[0], ["not", "-"]);
};
index = function (k) {
  return k;
};
var precedence = function (form) {
  if (!( !( typeof(form) === "object") || unary63(form))) {
    var __l7 = infix;
    var _k9 = undefined;
    for (_k9 in __l7) {
      var _v6 = __l7[_k9];
      var _e19;
      if (numeric63(_k9)) {
        _e19 = parseInt(_k9);
      } else {
        _e19 = _k9;
      }
      var _k10 = _e19;
      if (_v6[form[0]]) {
        return index(_k10);
      }
    }
  }
  return 0;
};
var getop = function (op) {
  return find(function (_) {
    var _x101 = _[op];
    if (_x101 === true) {
      return op;
    } else {
      if (!( typeof(_x101) === "undefined" || _x101 === null)) {
        return _x101[target42];
      }
    }
  }, infix);
};
infix63 = function (x) {
  var _x102 = getop(x);
  return !( typeof(_x102) === "undefined" || _x102 === null);
};
infix_operator63 = function (x) {
  return !( typeof(x) === "undefined" || x === null) && typeof(x) === "object" && infix63(x[0]);
};
var compile_args = function (args) {
  var _s1 = "(";
  var _c1 = "";
  var __x103 = args;
  var __n10 = __x103.length || 0;
  var __i13 = 0;
  while (__i13 < __n10) {
    var _x104 = __x103[__i13];
    _s1 = _s1 + _c1 + compile(_x104);
    _c1 = ", ";
    __i13 = __i13 + 1;
  }
  return _s1 + ")";
};
var escape_newlines = function (s) {
  var _s11 = "";
  var _i14 = 0;
  while (_i14 < (s.length || 0)) {
    var _c2 = char(s, _i14);
    var _e20;
    if (_c2 === "\n") {
      _e20 = "\\n";
    } else {
      _e20 = _c2;
    }
    _s11 = _s11 + _e20;
    _i14 = _i14 + 1;
  }
  return _s11;
};
var id = function (id) {
  var _id11 = "";
  var _i15 = 0;
  while (_i15 < (id.length || 0)) {
    var _c3 = char(id, _i15);
    var _n11 = code(_c3);
    var _e21;
    if (_c3 === "-") {
      _e21 = "_";
    } else {
      var _e22;
      if (valid_code63(_n11)) {
        _e22 = _c3;
      } else {
        var _e23;
        if (_i15 === 0) {
          _e23 = "_" + _n11;
        } else {
          _e23 = _n11;
        }
        _e22 = _e23;
      }
      _e21 = _e22;
    }
    var _c11 = _e21;
    _id11 = _id11 + _c11;
    _i15 = _i15 + 1;
  }
  if (reserved63(_id11)) {
    return "_" + _id11;
  } else {
    return _id11;
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
  var _x105 = form[0];
  var _args3 = cut(form, 1);
  var __id10 = getenv(_x105);
  var _self_tr63 = __id10.tr;
  var _stmt = __id10.stmt;
  var _special = __id10.special;
  var _tr = terminator(stmt63 && ! _self_tr63);
  return apply(_special, _args3) + _tr;
};
var parenthesize_call63 = function (x) {
  return typeof(x) === "object" && x[0] === "%function" || precedence(x) > 0;
};
var compile_call = function (form) {
  var _f = form[0];
  var _f1 = compile(_f);
  var _args4 = compile_args(stash42(cut(form, 1)));
  if (parenthesize_call63(_f)) {
    return "(" + _f1 + ")" + _args4;
  } else {
    return _f1 + _args4;
  }
};
var op_delims = function (parent, child) {
  var __r68 = unstash(Array.prototype.slice.call(arguments, 2));
  var _right = __r68.right;
  var _e24;
  if (_right) {
    _e24 = precedence(child) >= precedence(parent);
  } else {
    _e24 = precedence(child) > precedence(parent);
  }
  if (_e24) {
    return ["(", ")"];
  } else {
    return ["", ""];
  }
};
var compile_infix = function (form) {
  var _op = form[0];
  var __id13 = cut(form, 1);
  var _a1 = __id13[0];
  var _b3 = __id13[1];
  var __id14 = op_delims(form, _a1);
  var _ao = __id14[0];
  var _ac = __id14[1];
  var __id15 = op_delims(form, _b3, stash33({["right"]: true}));
  var _bo = __id15[0];
  var _bc = __id15[1];
  var _a2 = compile(_a1);
  var _b4 = compile(_b3);
  var _op1 = getop(_op);
  if (unary63(form)) {
    return _op1 + _ao + " " + _a2 + _ac;
  } else {
    return _ao + _a2 + _ac + " " + _op1 + " " + _bo + _b4 + _bc;
  }
};
compile_function = function (args, body) {
  var __r70 = unstash(Array.prototype.slice.call(arguments, 2));
  var _name3 = __r70.name;
  var _prefix = __r70.prefix;
  var _e25;
  if (_name3) {
    _e25 = compile(_name3);
  } else {
    _e25 = "";
  }
  var _id17 = _e25;
  var _args5 = compile_args(args);
  indent_level42 = indent_level42 + 1;
  var __x108 = compile(body, stash33({["stmt"]: true}));
  indent_level42 = indent_level42 - 1;
  var _body3 = __x108;
  var _ind = indentation();
  var _e26;
  if (_prefix) {
    _e26 = _prefix + " ";
  } else {
    _e26 = "";
  }
  var _p = _e26;
  var _e27;
  if (target42 === "js") {
    _e27 = "";
  } else {
    _e27 = "end";
  }
  var _tr1 = _e27;
  if (_name3) {
    _tr1 = _tr1 + "\n";
  }
  if (target42 === "js") {
    return "function " + _id17 + _args5 + " {\n" + _body3 + _ind + "}" + _tr1;
  } else {
    return _p + "function " + _id17 + _args5 + "\n" + _body3 + _ind + _tr1;
  }
};
var can_return63 = function (form) {
  return !( typeof(form) === "undefined" || form === null) && (!( typeof(form) === "object") || !( form[0] === "return") && ! statement63(form[0]));
};
compile = function (form) {
  var __r72 = unstash(Array.prototype.slice.call(arguments, 1));
  var _stmt1 = __r72.stmt;
  if (typeof(form) === "undefined" || form === null) {
    return "";
  } else {
    if (special_form63(form)) {
      return compile_special(form, _stmt1);
    } else {
      var _tr2 = terminator(_stmt1);
      var _e28;
      if (_stmt1) {
        _e28 = indentation();
      } else {
        _e28 = "";
      }
      var _ind1 = _e28;
      var _e29;
      if (!( typeof(form) === "object")) {
        _e29 = compile_atom(form);
      } else {
        var _e30;
        if (infix63(form[0])) {
          _e30 = compile_infix(form);
        } else {
          _e30 = compile_call(form);
        }
        _e29 = _e30;
      }
      var _form1 = _e29;
      return _ind1 + _form1 + _tr2;
    }
  }
};
var lower_statement = function (form, tail63) {
  var _hoist = [];
  var _e = lower(form, _hoist, true, tail63);
  if ((_hoist.length || 0) > 0 && !( typeof(_e) === "undefined" || _e === null)) {
    return join(["do"], _hoist, [_e]);
  } else {
    if (!( typeof(_e) === "undefined" || _e === null)) {
      return _e;
    } else {
      if ((_hoist.length || 0) > 1) {
        return join(["do"], _hoist);
      } else {
        return _hoist[0];
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
  var __x113 = almost(args);
  var __n12 = __x113.length || 0;
  var __i16 = 0;
  while (__i16 < __n12) {
    var _x114 = __x113[__i16];
    var _e1 = lower(_x114, hoist, stmt63);
    if (standalone63(_e1)) {
      add(hoist, _e1);
    }
    __i16 = __i16 + 1;
  }
  var _e2 = lower(last(args), hoist, stmt63, tail63);
  if (tail63 && can_return63(_e2)) {
    return ["return", _e2];
  } else {
    return _e2;
  }
};
var lower_assign = function (args, hoist, stmt63, tail63) {
  var _lh = args[0];
  var _rh = args[1];
  add(hoist, ["assign", _lh, lower(_rh, hoist)]);
  if (!( stmt63 && ! tail63)) {
    return _lh;
  }
};
var lower_if = function (args, hoist, stmt63, tail63) {
  var _cond = args[0];
  var _then = args[1];
  var _else = args[2];
  if (stmt63 || tail63) {
    var _e32;
    if (_else) {
      _e32 = [lower_body([_else], tail63)];
    }
    return add(hoist, join(["%if", lower(_cond, hoist), lower_body([_then], tail63)], _e32));
  } else {
    var _e3 = uniq("e");
    add(hoist, ["%local", _e3]);
    var _e31;
    if (_else) {
      _e31 = [lower(["assign", _e3, _else])];
    }
    add(hoist, join(["%if", lower(_cond, hoist), lower(["assign", _e3, _then])], _e31));
    return _e3;
  }
};
var lower_short = function (x, args, hoist) {
  var _a3 = args[0];
  var _b5 = args[1];
  var _hoist1 = [];
  var _b11 = lower(_b5, _hoist1);
  if ((_hoist1.length || 0) > 0) {
    var _id22 = uniq("id");
    var _e33;
    if (x === "and") {
      _e33 = ["%if", _id22, _b5, _id22];
    } else {
      _e33 = ["%if", _id22, _id22, _b5];
    }
    return lower(["do", ["%local", _id22, _a3], _e33], hoist);
  } else {
    return [x, lower(_a3, hoist), _b11];
  }
};
var lower_try = function (args, hoist, tail63) {
  return add(hoist, ["%try", lower_body(args, tail63)]);
};
var lower_while = function (args, hoist) {
  var _c4 = args[0];
  var _body4 = cut(args, 1);
  var _hoist11 = [];
  var _c5 = lower(_c4, _hoist11);
  var _e34;
  if ((_hoist11.length || 0) === 0) {
    _e34 = ["while", _c5, lower_body(_body4)];
  } else {
    _e34 = ["while", true, join(["do"], _hoist11, [["%if", ["not", _c5], ["break"]], lower_body(_body4)])];
  }
  return add(hoist, _e34);
};
var lower_for = function (args, hoist) {
  var _l8 = args[0];
  var _k11 = args[1];
  var _body5 = cut(args, 2);
  return add(hoist, ["%for", lower(_l8, hoist), _k11, lower_body(_body5)]);
};
var lower_function = function (args) {
  var _a4 = args[0];
  var _body6 = cut(args, 1);
  return ["%function", _a4, lower_body(_body6, true)];
};
var lower_definition = function (kind, args, hoist) {
  var __id26 = args;
  var _name4 = __id26[0];
  var _args6 = __id26[1];
  var _body7 = cut(__id26, 2);
  return add(hoist, [kind, _name4, _args6, lower_body(_body7, true)]);
};
var lower_call = function (form, hoist) {
  var _form2 = map(function (_) {
    return lower(_, hoist);
  }, form);
  if ((_form2.length || 0) > 0) {
    return _form2;
  }
};
var lower_infix63 = function (form) {
  return infix63(form[0]) && (form.length || 0) > 3;
};
var lower_infix = function (form, hoist) {
  var _x142 = form[0];
  var _args7 = cut(form, 1);
  return lower(reduce(function (_0, _1) {
    return [_x142, _1, _0];
  }, rev(_args7)), hoist);
};
var lower_special = function (form, hoist) {
  var _e4 = lower_call(form, hoist);
  if (_e4) {
    return add(hoist, _e4);
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
          var _x145 = form[0];
          var _args8 = cut(form, 1);
          if (_x145 === "do") {
            return lower_do(_args8, hoist, stmt63, tail63);
          } else {
            if (_x145 === "assign") {
              return lower_assign(_args8, hoist, stmt63, tail63);
            } else {
              if (_x145 === "%if") {
                return lower_if(_args8, hoist, stmt63, tail63);
              } else {
                if (_x145 === "%try") {
                  return lower_try(_args8, hoist, tail63);
                } else {
                  if (_x145 === "while") {
                    return lower_while(_args8, hoist);
                  } else {
                    if (_x145 === "%for") {
                      return lower_for(_args8, hoist);
                    } else {
                      if (_x145 === "%function") {
                        return lower_function(_args8);
                      } else {
                        if (_x145 === "%local-function" || _x145 === "%global-function") {
                          return lower_definition(_x145, _args8, hoist);
                        } else {
                          if (in63(_x145, ["and", "or"])) {
                            return lower_short(_x145, _args8, hoist);
                          } else {
                            if (statement63(_x145)) {
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
if (typeof(_x147) === "undefined" || _x147 === null) {
  _x147 = true;
  if (!( typeof(global) === "undefined" || global === null)) {
    global.require = require;
  }
  var _e35;
  if (typeof(global) === "undefined" || global === null) {
    _e35 = window.eval;
  } else {
    _e35 = global.eval;
  }
  run_js = _e35;
}
var run = run_js;
var eval = function (form) {
  var _previous = target42;
  target42 = "js";
  _37result = undefined;
  var _code = compile(expand(["assign", "%result", form]));
  target42 = _previous;
  run(_code);
  return _37result;
};
var do__special = function () {
  var _forms = unstash(Array.prototype.slice.call(arguments, 0));
  var _s2 = "";
  var __x149 = _forms;
  var __n13 = __x149.length || 0;
  var __i17 = 0;
  while (__i17 < __n13) {
    var _x150 = __x149[__i17];
    _s2 = _s2 + compile(_x150, stash33({["stmt"]: true}));
    if (! !( typeof(_x150) === "object")) {
      if (_x150[0] === "return" || _x150[0] === "break") {
        break;
      }
    }
    __i17 = __i17 + 1;
  }
  return _s2;
};
setenv("do", stash33({["tr"]: true, ["special"]: do__special, ["stmt"]: true}));
var _37if__special = function (cond, cons, alt) {
  var _cond1 = compile(cond);
  indent_level42 = indent_level42 + 1;
  var __x151 = compile(cons, stash33({["stmt"]: true}));
  indent_level42 = indent_level42 - 1;
  var _cons = __x151;
  var _e36;
  if (alt) {
    indent_level42 = indent_level42 + 1;
    var __x152 = compile(alt, stash33({["stmt"]: true}));
    indent_level42 = indent_level42 - 1;
    _e36 = __x152;
  }
  var _alt = _e36;
  var _ind2 = indentation();
  var _s3 = "";
  if (target42 === "js") {
    _s3 = _s3 + _ind2 + "if (" + _cond1 + ") {\n" + _cons + _ind2 + "}";
  } else {
    _s3 = _s3 + _ind2 + "if " + _cond1 + " then\n" + _cons;
  }
  if (_alt && target42 === "js") {
    _s3 = _s3 + " else {\n" + _alt + _ind2 + "}";
  } else {
    if (_alt) {
      _s3 = _s3 + _ind2 + "else\n" + _alt;
    }
  }
  if (target42 === "lua") {
    return _s3 + _ind2 + "end\n";
  } else {
    return _s3 + "\n";
  }
};
setenv("%if", stash33({["tr"]: true, ["special"]: _37if__special, ["stmt"]: true}));
var while__special = function (cond, form) {
  var _cond2 = compile(cond);
  indent_level42 = indent_level42 + 1;
  var __x153 = compile(form, stash33({["stmt"]: true}));
  indent_level42 = indent_level42 - 1;
  var _body8 = __x153;
  var _ind3 = indentation();
  if (target42 === "js") {
    return _ind3 + "while (" + _cond2 + ") {\n" + _body8 + _ind3 + "}\n";
  } else {
    return _ind3 + "while " + _cond2 + " do\n" + _body8 + _ind3 + "end\n";
  }
};
setenv("while", stash33({["tr"]: true, ["special"]: while__special, ["stmt"]: true}));
var _37for__special = function (l, k, form) {
  var _l9 = compile(l);
  var _ind4 = indentation();
  indent_level42 = indent_level42 + 1;
  var __x154 = compile(form, stash33({["stmt"]: true}));
  indent_level42 = indent_level42 - 1;
  var _body9 = __x154;
  if (target42 === "lua") {
    return _ind4 + "for " + k + " in next, " + _l9 + " do\n" + _body9 + _ind4 + "end\n";
  } else {
    return _ind4 + "for (" + k + " in " + _l9 + ") {\n" + _body9 + _ind4 + "}\n";
  }
};
setenv("%for", stash33({["tr"]: true, ["special"]: _37for__special, ["stmt"]: true}));
var _37try__special = function (form) {
  var _e5 = uniq("e");
  var _ind5 = indentation();
  indent_level42 = indent_level42 + 1;
  var __x155 = compile(form, stash33({["stmt"]: true}));
  indent_level42 = indent_level42 - 1;
  var _body10 = __x155;
  var _hf = ["return", ["%array", false, ["get", _e5, "\"message\""], ["get", _e5, "\"stack\""]]];
  indent_level42 = indent_level42 + 1;
  var __x160 = compile(_hf, stash33({["stmt"]: true}));
  indent_level42 = indent_level42 - 1;
  var _h = __x160;
  return _ind5 + "try {\n" + _body10 + _ind5 + "}\n" + _ind5 + "catch (" + _e5 + ") {\n" + _h + _ind5 + "}\n";
};
setenv("%try", stash33({["tr"]: true, ["special"]: _37try__special, ["stmt"]: true}));
var _37delete__special = function (place) {
  return indentation() + "delete " + compile(place);
};
setenv("%delete", stash33({["stmt"]: true, ["special"]: _37delete__special}));
var break__special = function () {
  return indentation() + "break";
};
setenv("break", stash33({["stmt"]: true, ["special"]: break__special}));
var _37function__special = function (args, body) {
  return compile_function(args, body);
};
setenv("%function", stash33({["special"]: _37function__special}));
var _37global_function__special = function (name, args, body) {
  setenv(name, stash33({["variable"]: true}));
  if (target42 === "lua") {
    var _x161 = compile_function(args, body, stash33({["name"]: name}));
    return indentation() + _x161;
  } else {
    return compile(["assign", name, ["%function", args, body]], stash33({["stmt"]: true}));
  }
};
setenv("%global-function", stash33({["tr"]: true, ["special"]: _37global_function__special, ["stmt"]: true}));
var _37local_function__special = function (name, args, body) {
  setenv(name, stash33({["variable"]: true}));
  if (target42 === "lua") {
    var _x164 = compile_function(args, body, stash33({["name"]: name, ["prefix"]: "local"}));
    return indentation() + _x164;
  } else {
    return compile(["%local", name, ["%function", args, body]], stash33({["stmt"]: true}));
  }
};
setenv("%local-function", stash33({["tr"]: true, ["special"]: _37local_function__special, ["stmt"]: true}));
var return__special = function (x) {
  var _e37;
  if (typeof(x) === "undefined" || x === null) {
    _e37 = "return";
  } else {
    _e37 = "return " + compile(x);
  }
  var _x167 = _e37;
  return indentation() + _x167;
};
setenv("return", stash33({["stmt"]: true, ["special"]: return__special}));
var new__special = function (x) {
  return "new " + compile(x);
};
setenv("new", stash33({["special"]: new__special}));
var typeof__special = function (x) {
  return "typeof(" + compile(x) + ")";
};
setenv("typeof", stash33({["special"]: typeof__special}));
var error__special = function (x) {
  var _e38;
  if (target42 === "js") {
    _e38 = "throw " + compile(["new", ["Error", x]]);
  } else {
    _e38 = "error(" + compile(x) + ")";
  }
  var _e6 = _e38;
  return indentation() + _e6;
};
setenv("error", stash33({["stmt"]: true, ["special"]: error__special}));
var _37local__special = function (name, value) {
  setenv(name, stash33({["variable"]: true}));
  var _id29 = compile(name);
  var _value1 = compile(value);
  var _e39;
  if (!( typeof(value) === "undefined" || value === null)) {
    _e39 = " = " + _value1;
  } else {
    _e39 = "";
  }
  var _rh1 = _e39;
  var _e40;
  if (target42 === "js") {
    _e40 = "var ";
  } else {
    _e40 = "local ";
  }
  var _keyword = _e40;
  var _ind6 = indentation();
  return _ind6 + _keyword + _id29 + _rh1;
};
setenv("%local", stash33({["stmt"]: true, ["special"]: _37local__special}));
var assign__special = function (lh, rh) {
  var _lh1 = compile(lh);
  var _e41;
  if (typeof(rh) === "undefined" || rh === null) {
    _e41 = "nil";
  } else {
    _e41 = rh;
  }
  var _rh2 = compile(_e41);
  return indentation() + _lh1 + " = " + _rh2;
};
setenv("assign", stash33({["stmt"]: true, ["special"]: assign__special}));
var get__special = function (l, k) {
  var _l11 = compile(l);
  var _k111 = compile(k);
  if (target42 === "lua" && char(_l11, 0) === "{" || infix_operator63(l)) {
    _l11 = "(" + _l11 + ")";
  }
  if (string_literal63(k) && valid_id63(inner(k))) {
    return _l11 + "." + inner(k);
  } else {
    return _l11 + "[" + _k111 + "]";
  }
};
setenv("get", stash33({["literal"]: true, ["special"]: get__special}));
var _37array__special = function () {
  var _forms1 = unstash(Array.prototype.slice.call(arguments, 0));
  var _e42;
  if (target42 === "lua") {
    _e42 = "{";
  } else {
    _e42 = "[";
  }
  var _open = _e42;
  var _e43;
  if (target42 === "lua") {
    _e43 = "}";
  } else {
    _e43 = "]";
  }
  var _close = _e43;
  var _s4 = "";
  var _c6 = "";
  var __l10 = _forms1;
  var _k12 = undefined;
  for (_k12 in __l10) {
    var _v7 = __l10[_k12];
    var _e44;
    if (numeric63(_k12)) {
      _e44 = parseInt(_k12);
    } else {
      _e44 = _k12;
    }
    var _k13 = _e44;
    if (typeof(_k13) === "number") {
      _s4 = _s4 + _c6 + compile(_v7);
      _c6 = ", ";
    }
  }
  return _open + _s4 + _close;
};
setenv("%array", stash33({["literal"]: true, ["special"]: _37array__special}));
var _37object__special = function () {
  var _forms2 = unstash(Array.prototype.slice.call(arguments, 0));
  var _s5 = "{";
  var _c7 = "";
  var _e45;
  if (target42 === "lua") {
    _e45 = " = ";
  } else {
    _e45 = ": ";
  }
  var _sep = _e45;
  var __l111 = pair(_forms2);
  var _k14 = undefined;
  for (_k14 in __l111) {
    var _v8 = __l111[_k14];
    var _e46;
    if (numeric63(_k14)) {
      _e46 = parseInt(_k14);
    } else {
      _e46 = _k14;
    }
    var _k15 = _e46;
    if (typeof(_k15) === "number") {
      var __id30 = _v8;
      var _k16 = __id30[0];
      var _v9 = __id30[1];
      _s5 = _s5 + _c7 + key(_k16) + _sep + compile(_v9);
      _c7 = ", ";
    }
  }
  return _s5 + "}";
};
setenv("%object", stash33({["literal"]: true, ["special"]: _37object__special}));
var _37unpack__special = function (x) {
  var _e47;
  if (target42 === "lua") {
    _e47 = "table.unpack";
  } else {
    _e47 = "...";
  }
  var _s6 = _e47;
  return _s6 + "(" + compile(x) + ")";
};
setenv("%unpack", stash33({["special"]: _37unpack__special}));
exports.run = run;
exports.eval = eval;
exports.expand = expand;
exports.compile = compile;
exports.reset = reset;
