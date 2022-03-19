local reader = require("reader")
function getenv(k, p)
  if type(k) == "string" then
    local i = #(environment42) - 1
    while i >= 0 do
      local _b = environment42[i + 1][k]
      if not( _b == nil) then
        local _e8
        if p then
          _e8 = _b[p]
        else
          _e8 = _b
        end
        return _e8
      end
      i = i - 1
    end
  end
end
local function transformer_function(k)
  return getenv(k, "transformer")
end
local function transformer63(k)
  return not( transformer_function(k) == nil)
end
local function macro_function(k)
  return getenv(k, "macro")
end
local function macro63(k)
  return not( macro_function(k) == nil)
end
local function special63(k)
  return not( getenv(k, "special") == nil)
end
local function special_form63(form)
  return type(form) == "table" and special63(form[1])
end
local function statement63(k)
  return special63(k) and getenv(k, "stmt")
end
local function symbol_expansion(k)
  return getenv(k, "symbol")
end
local function symbol63(k)
  return not( symbol_expansion(k) == nil)
end
local function variable63(k)
  local _b1 = first(function (_)
    return _[k]
  end, rev(environment42))
  return type(_b1) == "table" and not( _b1.variable == nil)
end
function bound63(x)
  return macro63(x) or special63(x) or symbol63(x) or variable63(x)
end
function quoted(form)
  if type(form) == "string" then
    return escape(form)
  else
    if not( type(form) == "table") then
      return form
    else
      return join({"list"}, map(quoted, form))
    end
  end
end
local function literal(s)
  if string_literal63(s) then
    return s
  else
    return quoted(s)
  end
end
local _names = {}
function uniq(x)
  if _names[x] then
    local _i = _names[x]
    _names[x] = _names[x] + 1
    return uniq(x .. _i)
  else
    _names[x] = 1
    return "_" .. x
  end
end
local function reset()
  _names = {}
  return _names
end
local function stash42(args)
  if keys63(args) then
    local _l = {"%object"}
    local __l1 = args
    local _k = nil
    for _k in next, __l1 do
      local _v = __l1[_k]
      if not( type(_k) == "number") then
        add(_l, literal(_k))
        add(_l, _v)
      end
    end
    return join(args, {{"stash!", _l}})
  else
    return args
  end
end
local function bias(k)
  if type(k) == "number" and not( target42 == "lua") then
    if target42 == "js" then
      k = k - 1
    else
      k = k + 1
    end
  end
  return k
end
function bind(lh, rh, vars)
  if not( type(lh) == "table") or lh[1] == "at" or lh[1] == "get" then
    return {lh, rh}
  else
    if lh[1] == "o" then
      local __ = lh[1]
      local _var = lh[2]
      local _e11
      if lh[3] == nil then
        _e11 = "nil"
      else
        _e11 = lh[3]
      end
      local _val = _e11
      return {_var, {"if", {"nil?", rh}, _val, rh}}
    else
      local _id1 = uniq("id")
      local _bs = {_id1, rh}
      if not( type(macroexpand(rh)) == "table") and not ontree(function (_)
        return _ == rh
      end, lh) then
        _bs = {}
        _id1 = rh
      else
        if vars then
          add(vars, _id1)
        end
      end
      local __l2 = lh
      local _k1 = nil
      for _k1 in next, __l2 do
        local _v1 = __l2[_k1]
        local _e9
        if _k1 == "rest" then
          _e9 = {"cut", _id1, #(lh)}
        else
          _e9 = {"get", _id1, {"quote", bias(_k1)}}
        end
        local _x9 = _e9
        if not( _k1 == nil) then
          local _e10
          if _v1 == true then
            _e10 = _k1
          else
            _e10 = _v1
          end
          local _k2 = _e10
          _bs = join(_bs, bind(_k2, _x9, vars))
        end
      end
      return _bs
    end
  end
end
local function arguments37__macro(from)
  return {{"get", {"get", {"get", "Array", {"quote", "prototype"}}, {"quote", "slice"}}, {"quote", "call"}}, "arguments", from}
end
setenv("arguments%", stash33({["macro"] = arguments37__macro}))
function bind42(args, body)
  local _args1 = {}
  local function rest()
    if target42 == "js" then
      return {"unstash", {"arguments%", #(_args1)}}
    else
      add(_args1, "|...|")
      return {"unstash", {"list", "|...|"}}
    end
  end
  if not( type(args) == "table") then
    return {_args1, join({"let", {args, rest()}}, body)}
  else
    local _bs1 = {}
    local _inits = {}
    local _r24 = uniq("r")
    local __x27 = args
    local __n2 = #(__x27)
    local __i3 = 0
    while __i3 < __n2 do
      local _v2 = __x27[__i3 + 1]
      if not( type(_v2) == "table") then
        add(_args1, _v2)
      else
        if _v2[1] == "o" then
          local __1 = _v2[1]
          local _var1 = _v2[2]
          local _val1 = _v2[3]
          add(_args1, _var1)
          add(_inits, {"if", {"nil?", _var1}, {"=", _var1, _val1}})
        else
          local _x31 = uniq("x")
          add(_args1, _x31)
          _bs1 = join(_bs1, {_v2, _x31})
        end
      end
      __i3 = __i3 + 1
    end
    if keys63(args) then
      _bs1 = join(_bs1, {_r24, rest()})
      _bs1 = join(_bs1, {keys(args), _r24})
    end
    return {_args1, join({"let", _bs1}, _inits, body)}
  end
end
local function quoting63(depth)
  return type(depth) == "number"
end
local function quasiquoting63(depth)
  return quoting63(depth) and depth > 0
end
local function can_unquote63(depth)
  return quoting63(depth) and depth == 1
end
local function quasisplice63(x, depth)
  return can_unquote63(depth) and type(x) == "table" and x[1] == "unquote-splicing"
end
local function expand_local(_x37)
  local _x38 = _x37[1]
  local _name = _x37[2]
  local _value = _x37[3]
  return {"%local", macroexpand(_name), macroexpand(_value)}
end
local function expand_function(_x40)
  local _x41 = _x40[1]
  local _args = _x40[2]
  local _body = cut(_x40, 2)
  add(environment42, {})
  local __l3 = _args
  local __i4 = nil
  for __i4 in next, __l3 do
    local __x42 = __l3[__i4]
    setenv(__x42, stash33({["variable"] = true}))
  end
  local __x43 = join({"%function", _args}, map(macroexpand, _body))
  drop(environment42)
  return __x43
end
local function expand_definition(_x45)
  local _x46 = _x45[1]
  local _name1 = _x45[2]
  local _args11 = _x45[3]
  local _body1 = cut(_x45, 3)
  add(environment42, {})
  local __l4 = _args11
  local __i5 = nil
  for __i5 in next, __l4 do
    local __x47 = __l4[__i5]
    setenv(__x47, stash33({["variable"] = true}))
  end
  local __x48 = join({_x46, macroexpand(_name1), _args11}, map(macroexpand, _body1))
  drop(environment42)
  return __x48
end
local function expand_macro(form)
  return macroexpand(expand1(form))
end
function expand1(_x50)
  local _name2 = _x50[1]
  local _body2 = cut(_x50, 1)
  return apply(macro_function(_name2), _body2)
end
local function expand_transformer(form)
  return transformer_function(form[1][1])(form)
end
function expand_complement63(form)
  return type(form) == "string" and str_starts63(form, "~") and not( form == "~")
end
function expand_complement(form)
  return {"complement", expand_atom(clip(form, 1))}
end
function expand_len63(form)
  return type(form) == "string" and str_starts63(form, "#") and not( form == "#")
end
function expand_len(form)
  return {"len", expand_atom(clip(form, 1))}
end
expand_atom_functions42 = {{symbol63, symbol_expansion}, {expand_complement63, expand_complement}, {expand_len63, expand_len}}
function expand_atom(form)
  local __x57 = expand_atom_functions42
  local __n5 = #(__x57)
  local __i6 = 0
  while __i6 < __n5 do
    local __id7 = __x57[__i6 + 1]
    local _predicate = __id7[1]
    local _expander = __id7[2]
    if _predicate(form) then
      return macroexpand(_expander(form))
    end
    __i6 = __i6 + 1
  end
  return form
end
function macroexpand(form)
  if not obj63(form) then
    return expand_atom(form)
  else
    if #(form) == 0 then
      return map(macroexpand, form)
    else
      local _x58 = macroexpand(form[1])
      local _args2 = cut(form, 1)
      local _form = join({_x58}, _args2)
      if _x58 == nil then
        return map(macroexpand, _args2)
      else
        if _x58 == "%expansion" then
          return _args2[1]
        else
          if _x58 == "%local" then
            return expand_local(_form)
          else
            if _x58 == "%function" then
              return expand_function(_form)
            else
              if _x58 == "%global-function" then
                return expand_definition(_form)
              else
                if _x58 == "%local-function" then
                  return expand_definition(_form)
                else
                  if macro63(_x58) then
                    return expand_macro(_form)
                  else
                    if hd63(_x58, transformer63) then
                      return expand_transformer(_form)
                    else
                      return join({_x58}, map(macroexpand, _args2))
                    end
                  end
                end
              end
            end
          end
        end
      end
    end
  end
end
local function quasiquote_list(form, depth)
  local _xs = {{"list"}}
  local __l5 = form
  local _k3 = nil
  for _k3 in next, __l5 do
    local _v3 = __l5[_k3]
    if not( type(_k3) == "number") then
      local _e12
      if quasisplice63(_v3, depth) then
        _e12 = quasiexpand(_v3[2])
      else
        _e12 = quasiexpand(_v3, depth)
      end
      local _v4 = _e12
      last(_xs)[_k3] = _v4
    end
  end
  local __x63 = form
  local __n7 = #(__x63)
  local __i8 = 0
  while __i8 < __n7 do
    local _x64 = __x63[__i8 + 1]
    if quasisplice63(_x64, depth) then
      local _x65 = quasiexpand(_x64[2])
      add(_xs, _x65)
      add(_xs, {"list"})
    else
      add(last(_xs), quasiexpand(_x64, depth))
    end
    __i8 = __i8 + 1
  end
  local _pruned = keep(function (_)
    return #(_) > 1 or not( _[1] == "list") or keys63(_)
  end, _xs)
  if #(_pruned) == 1 then
    return _pruned[1]
  else
    return join({"join"}, _pruned)
  end
end
function quasiexpand(form, depth)
  if quasiquoting63(depth) then
    if not( type(form) == "table") then
      return {"quote", form}
    else
      if can_unquote63(depth) and form[1] == "unquote" then
        return quasiexpand(form[2])
      else
        if form[1] == "unquote" or form[1] == "unquote-splicing" then
          return quasiquote_list(form, depth - 1)
        else
          if form[1] == "quasiquote" then
            return quasiquote_list(form, depth + 1)
          else
            return quasiquote_list(form, depth)
          end
        end
      end
    end
  else
    if not( type(form) == "table") then
      return form
    else
      if form[1] == "quote" then
        return form
      else
        if form[1] == "quasiquote" then
          return quasiexpand(form[2], 1)
        else
          return map(function (_)
            return quasiexpand(_, depth)
          end, form)
        end
      end
    end
  end
end
function expand_if(_x69)
  local _a = _x69[1]
  local _b2 = _x69[2]
  local _c = cut(_x69, 2)
  if not( _b2 == nil) then
    return {join({"%if", _a, _b2}, expand_if(_c))}
  else
    if not( _a == nil) then
      return {_a}
    end
  end
end
if _x73 == nil then
  _x73 = true
  indent_level42 = 0
end
function indentation()
  local _s = ""
  local _i9 = 0
  while _i9 < indent_level42 do
    _s = _s .. "  "
    _i9 = _i9 + 1
  end
  return _s
end
local function w47indent__macro(form)
  local _x74 = uniq("x")
  return {"do", {"++", "indent-level*"}, {"with", _x74, form, {"--", "indent-level*"}}}
end
setenv("w/indent", stash33({["macro"] = w47indent__macro}))
local reserved = {["for"] = true, ["-"] = true, ["import"] = true, ["repeat"] = true, ["%"] = true, ["else"] = true, ["case"] = true, ["do"] = true, ["or"] = true, ["<"] = true, ["try"] = true, ["if"] = true, ["/"] = true, ["<="] = true, ["var"] = true, ["debugger"] = true, ["return"] = true, ["*"] = true, ["typeof"] = true, ["and"] = true, ["with"] = true, ["break"] = true, ["delete"] = true, ["end"] = true, ["="] = true, ["finally"] = true, ["+"] = true, ["default"] = true, ["void"] = true, [">"] = true, ["catch"] = true, [">="] = true, ["local"] = true, ["function"] = true, ["continue"] = true, ["throw"] = true, ["=="] = true, ["switch"] = true, ["until"] = true, ["while"] = true, ["elseif"] = true, ["not"] = true, ["true"] = true, ["in"] = true, ["false"] = true, ["new"] = true, ["then"] = true, ["nil"] = true, ["instanceof"] = true}
function reserved63(x)
  return reserved[x]
end
local function valid_code63(n)
  return number_code63(n) or n > 64 and n < 91 or n > 96 and n < 123 or n == 95
end
function valid_id63(id)
  if #(id) == 0 or reserved63(id) then
    return false
  else
    local _i10 = 0
    while _i10 < #(id) do
      if not valid_code63(code(id, _i10)) then
        return false
      end
      _i10 = _i10 + 1
    end
    return true
  end
end
function key(k)
  return "[" .. compile(k) .. "]"
end
function mapo(f, l)
  local _o = {}
  local __l6 = l
  local _k4 = nil
  for _k4 in next, __l6 do
    local _v5 = __l6[_k4]
    local _x79 = f(_v5)
    if not( _x79 == nil) then
      add(_o, literal(_k4))
      add(_o, _x79)
    end
  end
  return _o
end
local __x81 = {}
local __x82 = {}
__x82.js = "!"
__x82.lua = "not"
__x81["not"] = __x82
local __x83 = {}
__x83["*"] = true
__x83["%"] = true
__x83["/"] = true
local __x84 = {}
__x84["+"] = true
__x84["-"] = true
local __x85 = {}
local __x86 = {}
__x86.js = "+"
__x86.lua = ".."
__x85.cat = __x86
local __x87 = {}
__x87["<"] = true
__x87[">="] = true
__x87[">"] = true
__x87["<="] = true
local __x88 = {}
local __x89 = {}
__x89.js = "==="
__x89.lua = "=="
__x88.is = __x89
local __x90 = {}
local __x91 = {}
__x91.js = "&&"
__x91.lua = "and"
__x90["and"] = __x91
local __x92 = {}
local __x93 = {}
__x93.js = "||"
__x93.lua = "or"
__x92["or"] = __x93
local infix = {__x81, __x83, __x84, __x85, __x87, __x88, __x90, __x92}
local function unary63(form)
  return #(form) == 2 and in63(form[1], {"not", "-"})
end
function index(k)
  if type(k) == "number" then
    return k - 1
  else
    return k
  end
end
local function precedence(form)
  if not( not( type(form) == "table") or unary63(form)) then
    local __l7 = infix
    local _k5 = nil
    for _k5 in next, __l7 do
      local _v6 = __l7[_k5]
      if _v6[form[1]] then
        return index(_k5)
      end
    end
  end
  return 0
end
local function getop(op)
  return find(function (_)
    local _x95 = _[op]
    if _x95 == true then
      return op
    else
      if not( _x95 == nil) then
        return _x95[target42]
      end
    end
  end, infix)
end
function infix63(x)
  return not( getop(x) == nil)
end
function infix_operator63(x)
  return not( x == nil) and type(x) == "table" and infix63(x[1])
end
local function compile_args(args)
  local _s1 = "("
  local _c1 = ""
  local __x96 = args
  local __n10 = #(__x96)
  local __i13 = 0
  while __i13 < __n10 do
    local _x97 = __x96[__i13 + 1]
    _s1 = _s1 .. _c1 .. compile(_x97)
    _c1 = ", "
    __i13 = __i13 + 1
  end
  return _s1 .. ")"
end
local function escape_newlines(s)
  local _s11 = ""
  local _i14 = 0
  while _i14 < #(s) do
    local _c2 = char(s, _i14)
    local _e13
    if _c2 == "\n" then
      _e13 = "\\n"
    else
      _e13 = _c2
    end
    _s11 = _s11 .. _e13
    _i14 = _i14 + 1
  end
  return _s11
end
local function id(id)
  local _id11 = ""
  local _i15 = 0
  while _i15 < #(id) do
    local _c3 = char(id, _i15)
    local _n11 = code(_c3)
    local _e14
    if _c3 == "-" then
      _e14 = "_"
    else
      local _e15
      if valid_code63(_n11) then
        _e15 = _c3
      else
        local _e16
        if _i15 == 0 then
          _e16 = "_" .. _n11
        else
          _e16 = _n11
        end
        _e15 = _e16
      end
      _e14 = _e15
    end
    local _c11 = _e14
    _id11 = _id11 .. _c11
    _i15 = _i15 + 1
  end
  if reserved63(_id11) then
    return "_" .. _id11
  else
    return _id11
  end
end
local function compile_atom(x)
  if x == "nil" and target42 == "lua" then
    return x
  else
    if x == "nil" then
      return "undefined"
    else
      if id_literal63(x) then
        return inner(x)
      else
        if string_literal63(x) then
          return escape_newlines(x)
        else
          if type(x) == "string" then
            return id(x)
          else
            if type(x) == "boolean" then
              if x then
                return "true"
              else
                return "false"
              end
            else
              if nan63(x) then
                return "nan"
              else
                if x == inf then
                  return "inf"
                else
                  if x == -inf then
                    return "-inf"
                  else
                    if type(x) == "number" then
                      return x .. ""
                    else
                      error("Cannot compile atom: " .. str(x))
                    end
                  end
                end
              end
            end
          end
        end
      end
    end
  end
end
local function terminator(stmt63)
  if not stmt63 then
    return ""
  else
    if target42 == "js" then
      return ";\n"
    else
      return "\n"
    end
  end
end
local function compile_special(form, stmt63)
  local _x98 = form[1]
  local _args3 = cut(form, 1)
  local __id10 = getenv(_x98)
  local _self_tr63 = __id10.tr
  local _stmt = __id10.stmt
  local _special = __id10.special
  local _tr = terminator(stmt63 and not _self_tr63)
  return apply(_special, _args3) .. _tr
end
local function parenthesize_call63(x)
  return type(x) == "table" and x[1] == "%function" or precedence(x) > 0
end
local function compile_call(form)
  local _f = form[1]
  local _f1 = compile(_f)
  local _args4 = compile_args(stash42(cut(form, 1)))
  if parenthesize_call63(_f) then
    return "(" .. _f1 .. ")" .. _args4
  else
    return _f1 .. _args4
  end
end
local function op_delims(parent, child, ...)
  local __r68 = unstash({...})
  local _right = __r68.right
  local _e17
  if _right then
    _e17 = precedence(child) >= precedence(parent)
  else
    _e17 = precedence(child) > precedence(parent)
  end
  if _e17 then
    return {"(", ")"}
  else
    return {"", ""}
  end
end
local function compile_infix(form)
  local _op = form[1]
  local __id13 = cut(form, 1)
  local _a1 = __id13[1]
  local _b3 = __id13[2]
  local __id14 = op_delims(form, _a1)
  local _ao = __id14[1]
  local _ac = __id14[2]
  local __id15 = op_delims(form, _b3, stash33({["right"] = true}))
  local _bo = __id15[1]
  local _bc = __id15[2]
  local _a2 = compile(_a1)
  local _b4 = compile(_b3)
  local _op1 = getop(_op)
  if unary63(form) then
    return _op1 .. _ao .. " " .. _a2 .. _ac
  else
    return _ao .. _a2 .. _ac .. " " .. _op1 .. " " .. _bo .. _b4 .. _bc
  end
end
function compile_function(args, body, ...)
  local __r70 = unstash({...})
  local _name3 = __r70.name
  local _prefix = __r70.prefix
  local _e18
  if _name3 then
    _e18 = compile(_name3)
  else
    _e18 = ""
  end
  local _id17 = _e18
  local _args5 = compile_args(args)
  indent_level42 = indent_level42 + 1
  local __x103 = compile(body, stash33({["stmt"] = true}))
  indent_level42 = indent_level42 - 1
  local _body3 = __x103
  local _ind = indentation()
  local _e19
  if _prefix then
    _e19 = _prefix .. " "
  else
    _e19 = ""
  end
  local _p = _e19
  local _e20
  if target42 == "js" then
    _e20 = ""
  else
    _e20 = "end"
  end
  local _tr1 = _e20
  if _name3 then
    _tr1 = _tr1 .. "\n"
  end
  if target42 == "js" then
    return "function " .. _id17 .. _args5 .. " {\n" .. _body3 .. _ind .. "}" .. _tr1
  else
    return _p .. "function " .. _id17 .. _args5 .. "\n" .. _body3 .. _ind .. _tr1
  end
end
local function can_return63(form)
  return not( form == nil) and (not( type(form) == "table") or not( form[1] == "return") and not statement63(form[1]))
end
function compile(form, ...)
  local __r72 = unstash({...})
  local _stmt1 = __r72.stmt
  if form == nil then
    return ""
  else
    if special_form63(form) then
      return compile_special(form, _stmt1)
    else
      local _tr2 = terminator(_stmt1)
      local _e21
      if _stmt1 then
        _e21 = indentation()
      else
        _e21 = ""
      end
      local _ind1 = _e21
      local _e22
      if not( type(form) == "table") then
        _e22 = compile_atom(form)
      else
        local _e23
        if infix63(form[1]) then
          _e23 = compile_infix(form)
        else
          _e23 = compile_call(form)
        end
        _e22 = _e23
      end
      local _form1 = _e22
      return _ind1 .. _form1 .. _tr2
    end
  end
end
local function lower_statement(form, tail63)
  local _hoist = {}
  local _e = lower(form, _hoist, true, tail63)
  if #(_hoist) > 0 and not( _e == nil) then
    return join({"do"}, _hoist, {_e})
  else
    if not( _e == nil) then
      return _e
    else
      if #(_hoist) > 1 then
        return join({"do"}, _hoist)
      else
        return _hoist[1]
      end
    end
  end
end
local function lower_body(body, tail63)
  return lower_statement(join({"do"}, body), tail63)
end
function literal63(form)
  return not( type(form) == "table") or getenv(form[1], "literal")
end
function standalone63(form)
  return type(form) == "table" and not infix63(form[1]) and not literal63(form) or id_literal63(form)
end
local function lower_do(args, hoist, stmt63, tail63)
  local __x109 = almost(args)
  local __n12 = #(__x109)
  local __i16 = 0
  while __i16 < __n12 do
    local _x110 = __x109[__i16 + 1]
    local _e1 = lower(_x110, hoist, stmt63)
    if standalone63(_e1) then
      add(hoist, _e1)
    end
    __i16 = __i16 + 1
  end
  local _e2 = lower(last(args), hoist, stmt63, tail63)
  if tail63 and can_return63(_e2) then
    return {"return", _e2}
  else
    return _e2
  end
end
local function lower_assign(args, hoist, stmt63, tail63)
  local _lh = args[1]
  local _rh = args[2]
  add(hoist, {"assign", _lh, lower(_rh, hoist)})
  if not( stmt63 and not tail63) then
    return _lh
  end
end
local function lower_if(args, hoist, stmt63, tail63)
  local _cond = args[1]
  local _then = args[2]
  local _else = args[3]
  if stmt63 or tail63 then
    local _e25
    if _else then
      _e25 = {lower_body({_else}, tail63)}
    end
    return add(hoist, join({"%if", lower(_cond, hoist), lower_body({_then}, tail63)}, _e25))
  else
    local _e3 = uniq("e")
    add(hoist, {"%local", _e3})
    local _e24
    if _else then
      _e24 = {lower({"assign", _e3, _else})}
    end
    add(hoist, join({"%if", lower(_cond, hoist), lower({"assign", _e3, _then})}, _e24))
    return _e3
  end
end
local function lower_short(x, args, hoist)
  local _a3 = args[1]
  local _b5 = args[2]
  local _hoist1 = {}
  local _b11 = lower(_b5, _hoist1)
  if #(_hoist1) > 0 then
    local _id22 = uniq("id")
    local _e26
    if x == "and" then
      _e26 = {"%if", _id22, _b5, _id22}
    else
      _e26 = {"%if", _id22, _id22, _b5}
    end
    return lower({"do", {"%local", _id22, _a3}, _e26}, hoist)
  else
    return {x, lower(_a3, hoist), _b11}
  end
end
local function lower_try(args, hoist, tail63)
  return add(hoist, {"%try", lower_body(args, tail63)})
end
local function lower_while(args, hoist)
  local _c4 = args[1]
  local _body4 = cut(args, 1)
  local _hoist11 = {}
  local _c5 = lower(_c4, _hoist11)
  local _e27
  if #(_hoist11) == 0 then
    _e27 = {"while", _c5, lower_body(_body4)}
  else
    _e27 = {"while", true, join({"do"}, _hoist11, {{"%if", {"not", _c5}, {"break"}}, lower_body(_body4)})}
  end
  return add(hoist, _e27)
end
local function lower_for(args, hoist)
  local _l8 = args[1]
  local _k6 = args[2]
  local _body5 = cut(args, 2)
  return add(hoist, {"%for", lower(_l8, hoist), _k6, lower_body(_body5)})
end
local function lower_function(args)
  local _a4 = args[1]
  local _body6 = cut(args, 1)
  return {"%function", _a4, lower_body(_body6, true)}
end
local function lower_definition(kind, args, hoist)
  local __id26 = args
  local _name4 = __id26[1]
  local _args6 = __id26[2]
  local _body7 = cut(__id26, 2)
  return add(hoist, {kind, _name4, _args6, lower_body(_body7, true)})
end
local function lower_call(form, hoist)
  local _form2 = map(function (_)
    return lower(_, hoist)
  end, form)
  if #(_form2) > 0 then
    return _form2
  end
end
local function lower_infix63(form)
  return infix63(form[1]) and #(form) > 3
end
local function lower_infix(form, hoist)
  local _x138 = form[1]
  local _args7 = cut(form, 1)
  return lower(reduce(function (_0, _1)
    return {_x138, _1, _0}
  end, rev(_args7)), hoist)
end
local function lower_special(form, hoist)
  local _e4 = lower_call(form, hoist)
  if _e4 then
    return add(hoist, _e4)
  end
end
function lower(form, hoist, stmt63, tail63)
  if not( type(form) == "table") then
    return form
  else
    if empty63(form) then
      return {"%array"}
    else
      if hoist == nil then
        return lower_statement(form)
      else
        if lower_infix63(form) then
          return lower_infix(form, hoist)
        else
          local _x141 = form[1]
          local _args8 = cut(form, 1)
          if _x141 == "do" then
            return lower_do(_args8, hoist, stmt63, tail63)
          else
            if _x141 == "assign" then
              return lower_assign(_args8, hoist, stmt63, tail63)
            else
              if _x141 == "%if" then
                return lower_if(_args8, hoist, stmt63, tail63)
              else
                if _x141 == "%try" then
                  return lower_try(_args8, hoist, tail63)
                else
                  if _x141 == "while" then
                    return lower_while(_args8, hoist)
                  else
                    if _x141 == "%for" then
                      return lower_for(_args8, hoist)
                    else
                      if _x141 == "%function" then
                        return lower_function(_args8)
                      else
                        if _x141 == "%local-function" or _x141 == "%global-function" then
                          return lower_definition(_x141, _args8, hoist)
                        else
                          if in63(_x141, {"and", "or"}) then
                            return lower_short(_x141, _args8, hoist)
                          else
                            if statement63(_x141) then
                              return lower_special(form, hoist)
                            else
                              return lower_call(form, hoist)
                            end
                          end
                        end
                      end
                    end
                  end
                end
              end
            end
          end
        end
      end
    end
  end
end
local function expand(form)
  return lower(macroexpand(form))
end
if _x143 == nil then
  _x143 = true
  run_lua = loadstring
end
local function run(code, name)
  local __id29 = {run_lua(code, name)}
  local _f11 = __id29[1]
  local _e5 = __id29[2]
  if _f11 then
    return _f11()
  else
    error(_e5 .. " in " .. code)
  end
end
local function eval(form)
  local _previous = target42
  target42 = "lua"
  _37result = nil
  local _code = compile(expand({"assign", "%result", form}))
  target42 = _previous
  run(_code)
  return _37result
end
local function do__special(...)
  local _forms = unstash({...})
  local _s2 = ""
  local __x148 = _forms
  local __n13 = #(__x148)
  local __i17 = 0
  while __i17 < __n13 do
    local _x149 = __x148[__i17 + 1]
    _s2 = _s2 .. compile(_x149, stash33({["stmt"] = true}))
    if not not( type(_x149) == "table") then
      if _x149[1] == "return" or _x149[1] == "break" then
        break
      end
    end
    __i17 = __i17 + 1
  end
  return _s2
end
setenv("do", stash33({["tr"] = true, ["special"] = do__special, ["stmt"] = true}))
local function _37if__special(cond, cons, alt)
  local _cond1 = compile(cond)
  indent_level42 = indent_level42 + 1
  local __x150 = compile(cons, stash33({["stmt"] = true}))
  indent_level42 = indent_level42 - 1
  local _cons = __x150
  local _e28
  if alt then
    indent_level42 = indent_level42 + 1
    local __x151 = compile(alt, stash33({["stmt"] = true}))
    indent_level42 = indent_level42 - 1
    _e28 = __x151
  end
  local _alt = _e28
  local _ind2 = indentation()
  local _s3 = ""
  if target42 == "js" then
    _s3 = _s3 .. _ind2 .. "if (" .. _cond1 .. ") {\n" .. _cons .. _ind2 .. "}"
  else
    _s3 = _s3 .. _ind2 .. "if " .. _cond1 .. " then\n" .. _cons
  end
  if _alt and target42 == "js" then
    _s3 = _s3 .. " else {\n" .. _alt .. _ind2 .. "}"
  else
    if _alt then
      _s3 = _s3 .. _ind2 .. "else\n" .. _alt
    end
  end
  if target42 == "lua" then
    return _s3 .. _ind2 .. "end\n"
  else
    return _s3 .. "\n"
  end
end
setenv("%if", stash33({["tr"] = true, ["special"] = _37if__special, ["stmt"] = true}))
local function while__special(cond, form)
  local _cond2 = compile(cond)
  indent_level42 = indent_level42 + 1
  local __x152 = compile(form, stash33({["stmt"] = true}))
  indent_level42 = indent_level42 - 1
  local _body8 = __x152
  local _ind3 = indentation()
  if target42 == "js" then
    return _ind3 .. "while (" .. _cond2 .. ") {\n" .. _body8 .. _ind3 .. "}\n"
  else
    return _ind3 .. "while " .. _cond2 .. " do\n" .. _body8 .. _ind3 .. "end\n"
  end
end
setenv("while", stash33({["tr"] = true, ["special"] = while__special, ["stmt"] = true}))
local function _37for__special(l, k, form)
  local _l9 = compile(l)
  local _ind4 = indentation()
  indent_level42 = indent_level42 + 1
  local __x153 = compile(form, stash33({["stmt"] = true}))
  indent_level42 = indent_level42 - 1
  local _body9 = __x153
  if target42 == "lua" then
    return _ind4 .. "for " .. k .. " in next, " .. _l9 .. " do\n" .. _body9 .. _ind4 .. "end\n"
  else
    return _ind4 .. "for (" .. k .. " in " .. _l9 .. ") {\n" .. _body9 .. _ind4 .. "}\n"
  end
end
setenv("%for", stash33({["tr"] = true, ["special"] = _37for__special, ["stmt"] = true}))
local function _37try__special(form)
  local _e6 = uniq("e")
  local _ind5 = indentation()
  indent_level42 = indent_level42 + 1
  local __x154 = compile(form, stash33({["stmt"] = true}))
  indent_level42 = indent_level42 - 1
  local _body10 = __x154
  local _hf = {"return", {"%array", false, {"get", _e6, "\"message\""}, {"get", _e6, "\"stack\""}}}
  indent_level42 = indent_level42 + 1
  local __x159 = compile(_hf, stash33({["stmt"] = true}))
  indent_level42 = indent_level42 - 1
  local _h = __x159
  return _ind5 .. "try {\n" .. _body10 .. _ind5 .. "}\n" .. _ind5 .. "catch (" .. _e6 .. ") {\n" .. _h .. _ind5 .. "}\n"
end
setenv("%try", stash33({["tr"] = true, ["special"] = _37try__special, ["stmt"] = true}))
local function _37delete__special(place)
  return indentation() .. "delete " .. compile(place)
end
setenv("%delete", stash33({["stmt"] = true, ["special"] = _37delete__special}))
local function break__special()
  return indentation() .. "break"
end
setenv("break", stash33({["stmt"] = true, ["special"] = break__special}))
local function _37function__special(args, body)
  return compile_function(args, body)
end
setenv("%function", stash33({["special"] = _37function__special}))
local function _37global_function__special(name, args, body)
  setenv(name, stash33({["variable"] = true}))
  if target42 == "lua" then
    local _x160 = compile_function(args, body, stash33({["name"] = name}))
    return indentation() .. _x160
  else
    return compile({"assign", name, {"%function", args, body}}, stash33({["stmt"] = true}))
  end
end
setenv("%global-function", stash33({["tr"] = true, ["special"] = _37global_function__special, ["stmt"] = true}))
local function _37local_function__special(name, args, body)
  setenv(name, stash33({["variable"] = true}))
  if target42 == "lua" then
    local _x163 = compile_function(args, body, stash33({["name"] = name, ["prefix"] = "local"}))
    return indentation() .. _x163
  else
    return compile({"%local", name, {"%function", args, body}}, stash33({["stmt"] = true}))
  end
end
setenv("%local-function", stash33({["tr"] = true, ["special"] = _37local_function__special, ["stmt"] = true}))
local function return__special(x)
  local _e29
  if x == nil then
    _e29 = "return"
  else
    _e29 = "return " .. compile(x)
  end
  local _x166 = _e29
  return indentation() .. _x166
end
setenv("return", stash33({["stmt"] = true, ["special"] = return__special}))
local function new__special(x)
  return "new " .. compile(x)
end
setenv("new", stash33({["special"] = new__special}))
local function typeof__special(x)
  return "typeof(" .. compile(x) .. ")"
end
setenv("typeof", stash33({["special"] = typeof__special}))
local function error__special(x)
  local _e30
  if target42 == "js" then
    _e30 = "throw " .. compile({"new", {"Error", x}})
  else
    _e30 = "error(" .. compile(x) .. ")"
  end
  local _e7 = _e30
  return indentation() .. _e7
end
setenv("error", stash33({["stmt"] = true, ["special"] = error__special}))
local function _37local__special(name, value)
  setenv(name, stash33({["variable"] = true}))
  local _id30 = compile(name)
  local _value1 = compile(value)
  local _e31
  if not( value == nil) then
    _e31 = " = " .. _value1
  else
    _e31 = ""
  end
  local _rh1 = _e31
  local _e32
  if target42 == "js" then
    _e32 = "var "
  else
    _e32 = "local "
  end
  local _keyword = _e32
  local _ind6 = indentation()
  return _ind6 .. _keyword .. _id30 .. _rh1
end
setenv("%local", stash33({["stmt"] = true, ["special"] = _37local__special}))
local function assign__special(lh, rh)
  local _lh1 = compile(lh)
  local _e33
  if rh == nil then
    _e33 = "nil"
  else
    _e33 = rh
  end
  local _rh2 = compile(_e33)
  return indentation() .. _lh1 .. " = " .. _rh2
end
setenv("assign", stash33({["stmt"] = true, ["special"] = assign__special}))
local function get__special(l, k)
  local _l11 = compile(l)
  local _k11 = compile(k)
  if target42 == "lua" and char(_l11, 0) == "{" or infix_operator63(l) then
    _l11 = "(" .. _l11 .. ")"
  end
  if string_literal63(k) and valid_id63(inner(k)) then
    return _l11 .. "." .. inner(k)
  else
    return _l11 .. "[" .. _k11 .. "]"
  end
end
setenv("get", stash33({["literal"] = true, ["special"] = get__special}))
local function _37array__special(...)
  local _forms1 = unstash({...})
  local _e34
  if target42 == "lua" then
    _e34 = "{"
  else
    _e34 = "["
  end
  local _open = _e34
  local _e35
  if target42 == "lua" then
    _e35 = "}"
  else
    _e35 = "]"
  end
  local _close = _e35
  local _s4 = ""
  local _c6 = ""
  local __l10 = _forms1
  local _k7 = nil
  for _k7 in next, __l10 do
    local _v7 = __l10[_k7]
    if type(_k7) == "number" then
      _s4 = _s4 .. _c6 .. compile(_v7)
      _c6 = ", "
    end
  end
  return _open .. _s4 .. _close
end
setenv("%array", stash33({["literal"] = true, ["special"] = _37array__special}))
local function _37object__special(...)
  local _forms2 = unstash({...})
  local _s5 = "{"
  local _c7 = ""
  local _e36
  if target42 == "lua" then
    _e36 = " = "
  else
    _e36 = ": "
  end
  local _sep = _e36
  local __l111 = pair(_forms2)
  local _k8 = nil
  for _k8 in next, __l111 do
    local _v8 = __l111[_k8]
    if type(_k8) == "number" then
      local __id31 = _v8
      local _k9 = __id31[1]
      local _v9 = __id31[2]
      _s5 = _s5 .. _c7 .. key(_k9) .. _sep .. compile(_v9)
      _c7 = ", "
    end
  end
  return _s5 .. "}"
end
setenv("%object", stash33({["literal"] = true, ["special"] = _37object__special}))
local function _37unpack__special(x)
  local _e37
  if target42 == "lua" then
    _e37 = "table.unpack"
  else
    _e37 = "..."
  end
  local _s6 = _e37
  return _s6 .. "(" .. compile(x) .. ")"
end
setenv("%unpack", stash33({["special"] = _37unpack__special}))
return {["expand"] = expand, ["compile"] = compile, ["eval"] = eval, ["reset"] = reset, ["run"] = run}
