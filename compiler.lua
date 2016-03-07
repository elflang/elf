local reader = require("reader")
function getenv(k, p)
  if type(k) == "string" then
    local i = #(environment42) - 1
    while i >= 0 do
      local b = environment42[i + 1][k]
      if not( b == nil) then
        local _e9
        if p then
          _e9 = b[p]
        else
          _e9 = b
        end
        return(_e9)
      end
      i = i - 1
    end
  end
end
local function macro_function(k)
  return(getenv(k, "macro"))
end
local function macro63(k)
  return(not( macro_function(k) == nil))
end
local function special63(k)
  return(not( getenv(k, "special") == nil))
end
local function special_form63(form)
  return(type(form) == "table" and special63(form[1]))
end
local function statement63(k)
  return(special63(k) and getenv(k, "stmt"))
end
local function symbol_expansion(k)
  return(getenv(k, "symbol"))
end
local function symbol63(k)
  return(not( symbol_expansion(k) == nil))
end
local function variable63(k)
  local b = first(function (_)
    return(_[k])
  end, rev(environment42))
  return(type(b) == "table" and not( b.variable == nil))
end
function bound63(x)
  return(macro63(x) or special63(x) or symbol63(x) or variable63(x))
end
function quoted(form)
  if type(form) == "string" then
    return(escape(form))
  else
    if not( type(form) == "table") then
      return(form)
    else
      return(join({"list"}, map(quoted, form)))
    end
  end
end
local function literal(s)
  if string_literal63(s) then
    return(s)
  else
    return(quoted(s))
  end
end
local names = {}
function uniq(x)
  if names[x] then
    local i = names[x]
    names[x] = names[x] + 1
    return(uniq(x .. i))
  else
    names[x] = 1
    return("_" .. x)
  end
end
local function reset()
  names = {}
  return(names)
end
local function stash42(args)
  if keys63(args) then
    local l = {"%object"}
    local _l = args
    local k = nil
    for k in next, _l do
      local v = _l[k]
      if not( type(k) == "number") then
        add(l, literal(k))
        add(l, v)
      end
    end
    return(join(args, {{"stash!", l}}))
  else
    return(args)
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
  return(k)
end
function bind(lh, rh, vars)
  if not( type(lh) == "table") then
    return({lh, rh})
  else
    if lh[1] == "o" then
      local _ = lh[1]
      local _var = lh[2]
      local val = lh[3]
      return({_var, {"if", {"nil?", rh}, val, rh}})
    else
      local id = uniq("id")
      local bs = {id, rh}
      if not( type(macroexpand(rh)) == "table") and not ontree(function (_)
        return(_ == rh)
      end, lh) then
        bs = {}
        id = rh
      else
        if vars then
          add(vars, id)
        end
      end
      local _l1 = lh
      local k = nil
      for k in next, _l1 do
        local v = _l1[k]
        local _e10
        if k == "rest" then
          _e10 = {"cut", id, #(lh)}
        else
          _e10 = {"get", id, {"quote", bias(k)}}
        end
        local x = _e10
        if not( k == nil) then
          local _e11
          if v == true then
            _e11 = k
          else
            _e11 = v
          end
          local _k = _e11
          bs = join(bs, bind(_k, x, vars))
        end
      end
      return(bs)
    end
  end
end
setenv("arguments%", stash33({macro = function (from)
  return({{"get", {"get", {"get", "Array", {"quote", "prototype"}}, {"quote", "slice"}}, {"quote", "call"}}, "arguments", from})
end}))
function bind42(args, body)
  local args1 = {}
  local function rest()
    if target42 == "js" then
      return({"unstash", {"arguments%", #(args1)}})
    else
      add(args1, "|...|")
      return({"unstash", {"list", "|...|"}})
    end
  end
  if not( type(args) == "table") then
    return({args1, join({"let", {args, rest()}}, body)})
  else
    local bs = {}
    local inits = {}
    local r = uniq("r")
    local _x33 = args
    local _n2 = #(_x33)
    local _i2 = 0
    while _i2 < _n2 do
      local v = _x33[_i2 + 1]
      if not( type(v) == "table") then
        add(args1, v)
      else
        if v[1] == "o" then
          local _ = v[1]
          local _var1 = v[2]
          local val = v[3]
          add(args1, _var1)
          add(inits, {"if", {"nil?", _var1}, {"=", _var1, val}})
        else
          local x = uniq("x")
          add(args1, x)
          bs = join(bs, {v, x})
        end
      end
      _i2 = _i2 + 1
    end
    if keys63(args) then
      bs = join(bs, {r, rest()})
      bs = join(bs, {keys(args), r})
    end
    return({args1, join({"let", bs}, inits, body)})
  end
end
local function quoting63(depth)
  return(type(depth) == "number")
end
local function quasiquoting63(depth)
  return(quoting63(depth) and depth > 0)
end
local function can_unquote63(depth)
  return(quoting63(depth) and depth == 1)
end
local function quasisplice63(x, depth)
  return(can_unquote63(depth) and type(x) == "table" and x[1] == "unquote-splicing")
end
local function expand_local(_x42)
  local x = _x42[1]
  local name = _x42[2]
  local value = _x42[3]
  return({"%local", name, macroexpand(value)})
end
local function expand_function(_x44)
  local x = _x44[1]
  local args = _x44[2]
  local body = cut(_x44, 2)
  add(environment42, {})
  local _l2 = args
  local _i3 = nil
  for _i3 in next, _l2 do
    local _x45 = _l2[_i3]
    setenv(_x45, stash33({variable = true}))
  end
  local _x46 = join({"%function", args}, macroexpand(body))
  drop(environment42)
  return(_x46)
end
local function expand_definition(_x48)
  local x = _x48[1]
  local name = _x48[2]
  local args = _x48[3]
  local body = cut(_x48, 3)
  add(environment42, {})
  local _l3 = args
  local _i4 = nil
  for _i4 in next, _l3 do
    local _x49 = _l3[_i4]
    setenv(_x49, stash33({variable = true}))
  end
  local _x50 = join({x, name, args}, macroexpand(body))
  drop(environment42)
  return(_x50)
end
local function expand_macro(_x52)
  local name = _x52[1]
  local body = cut(_x52, 1)
  return(macroexpand(apply(macro_function(name), body)))
end
function macroexpand(form)
  if symbol63(form) then
    return(macroexpand(symbol_expansion(form)))
  else
    if not( type(form) == "table") then
      return(form)
    else
      local x = form[1]
      if x == "%local" then
        return(expand_local(form))
      else
        if x == "%function" then
          return(expand_function(form))
        else
          if x == "%global-function" then
            return(expand_definition(form))
          else
            if x == "%local-function" then
              return(expand_definition(form))
            else
              if type(x) == "string" and char(x, 0) == "~" then
                return(macroexpand({"not", join({clip(x, 1)}, cut(form, 1))}))
              else
                if macro63(x) then
                  return(expand_macro(form))
                else
                  return(map(macroexpand, form))
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
  local xs = {{"list"}}
  local _l4 = form
  local k = nil
  for k in next, _l4 do
    local v = _l4[k]
    if not( type(k) == "number") then
      local _e12
      if quasisplice63(v, depth) then
        _e12 = quasiexpand(v[2])
      else
        _e12 = quasiexpand(v, depth)
      end
      local _v = _e12
      last(xs)[k] = _v
    end
  end
  local _x57 = form
  local _n6 = #(_x57)
  local _i6 = 0
  while _i6 < _n6 do
    local x = _x57[_i6 + 1]
    if quasisplice63(x, depth) then
      local _x58 = quasiexpand(x[2])
      add(xs, _x58)
      add(xs, {"list"})
    else
      add(last(xs), quasiexpand(x, depth))
    end
    _i6 = _i6 + 1
  end
  local pruned = keep(function (_)
    return(#(_) > 1 or not( _[1] == "list") or keys63(_))
  end, xs)
  if #(pruned) == 1 then
    return(pruned[1])
  else
    return(join({"join"}, pruned))
  end
end
function quasiexpand(form, depth)
  if quasiquoting63(depth) then
    if not( type(form) == "table") then
      return({"quote", form})
    else
      if can_unquote63(depth) and form[1] == "unquote" then
        return(quasiexpand(form[2]))
      else
        if form[1] == "unquote" or form[1] == "unquote-splicing" then
          return(quasiquote_list(form, depth - 1))
        else
          if form[1] == "quasiquote" then
            return(quasiquote_list(form, depth + 1))
          else
            return(quasiquote_list(form, depth))
          end
        end
      end
    end
  else
    if not( type(form) == "table") then
      return(form)
    else
      if form[1] == "quote" then
        return(form)
      else
        if form[1] == "quasiquote" then
          return(quasiexpand(form[2], 1))
        else
          return(map(function (_)
            return(quasiexpand(_, depth))
          end, form))
        end
      end
    end
  end
end
function expand_if(_x62)
  local a = _x62[1]
  local b = _x62[2]
  local c = cut(_x62, 2)
  if not( b == nil) then
    return({join({"%if", a, b}, expand_if(c))})
  else
    if not( a == nil) then
      return({a})
    end
  end
end
if _x66 == nil then
  _x66 = true
  indent_level42 = 0
end
function indentation()
  local s = ""
  local i = 0
  while i < indent_level42 do
    s = s .. "  "
    i = i + 1
  end
  return(s)
end
setenv("w/indent", stash33({macro = function (form)
  local x = uniq("x")
  return({"do", {"++", "indent-level*"}, {"with", x, form, {"--", "indent-level*"}}})
end}))
local reserved = {["else"] = true, ["<"] = true, ["true"] = true, ["/"] = true, ["end"] = true, ["typeof"] = true, ["break"] = true, ["import"] = true, ["="] = true, ["or"] = true, ["try"] = true, ["catch"] = true, ["with"] = true, ["until"] = true, ["false"] = true, ["repeat"] = true, ["-"] = true, ["function"] = true, ["switch"] = true, ["=="] = true, ["and"] = true, ["for"] = true, ["if"] = true, ["do"] = true, ["<="] = true, ["local"] = true, ["return"] = true, ["debugger"] = true, ["nil"] = true, ["then"] = true, [">="] = true, ["case"] = true, ["delete"] = true, ["elseif"] = true, ["+"] = true, ["not"] = true, ["void"] = true, ["var"] = true, ["%"] = true, ["in"] = true, ["continue"] = true, ["throw"] = true, ["new"] = true, ["finally"] = true, ["this"] = true, ["while"] = true, ["instanceof"] = true, ["default"] = true, ["*"] = true, [">"] = true}
function reserved63(x)
  return(reserved[x])
end
local function valid_code63(n)
  return(number_code63(n) or n > 64 and n < 91 or n > 96 and n < 123 or n == 95)
end
function valid_id63(id)
  if #(id) == 0 or reserved63(id) then
    return(false)
  else
    local i = 0
    while i < #(id) do
      if not valid_code63(code(id, i)) then
        return(false)
      end
      i = i + 1
    end
    return(true)
  end
end
function key(k)
  local i = inner(k)
  if valid_id63(i) then
    return(i)
  else
    if target42 == "js" then
      return(k)
    else
      return("[" .. k .. "]")
    end
  end
end
function mapo(f, l)
  local o = {}
  local _l5 = l
  local k = nil
  for k in next, _l5 do
    local v = _l5[k]
    local x = f(v)
    if not( x == nil) then
      add(o, literal(k))
      add(o, x)
    end
  end
  return(o)
end
local _x76 = {}
local _x77 = {}
_x77.lua = "not"
_x77.js = "!"
_x76["not"] = _x77
local _x78 = {}
_x78["/"] = true
_x78["*"] = true
_x78["%"] = true
local _x79 = {}
_x79["+"] = true
_x79["-"] = true
local _x80 = {}
local _x81 = {}
_x81.lua = ".."
_x81.js = "+"
_x80.cat = _x81
local _x82 = {}
_x82["<="] = true
_x82[">="] = true
_x82["<"] = true
_x82[">"] = true
local _x83 = {}
local _x84 = {}
_x84.lua = "=="
_x84.js = "==="
_x83.is = _x84
local _x85 = {}
local _x86 = {}
_x86.lua = "and"
_x86.js = "&&"
_x85["and"] = _x86
local _x87 = {}
local _x88 = {}
_x88.lua = "or"
_x88.js = "||"
_x87["or"] = _x88
local infix = {_x76, _x78, _x79, _x80, _x82, _x83, _x85, _x87}
local function unary63(form)
  return(#(form) == 2 and in63(form[1], {"not", "-"}))
end
local function index(k)
  if type(k) == "number" then
    return(k - 1)
  end
end
local function precedence(form)
  if not( not( type(form) == "table") or unary63(form)) then
    local _l6 = infix
    local k = nil
    for k in next, _l6 do
      local v = _l6[k]
      if v[form[1]] then
        return(index(k))
      end
    end
  end
  return(0)
end
local function getop(op)
  return(find(function (_)
    local x = _[op]
    if x == true then
      return(op)
    else
      if not( x == nil) then
        return(x[target42])
      end
    end
  end, infix))
end
local function infix63(x)
  return(not( getop(x) == nil))
end
local function compile_args(args)
  local s = "("
  local c = ""
  local _x90 = args
  local _n9 = #(_x90)
  local _i9 = 0
  while _i9 < _n9 do
    local x = _x90[_i9 + 1]
    s = s .. c .. compile(x)
    c = ", "
    _i9 = _i9 + 1
  end
  return(s .. ")")
end
local function escape_newlines(s)
  local s1 = ""
  local i = 0
  while i < #(s) do
    local c = char(s, i)
    local _e13
    if c == "\n" then
      _e13 = "\\n"
    else
      _e13 = c
    end
    s1 = s1 .. _e13
    i = i + 1
  end
  return(s1)
end
local function id(id)
  local id1 = ""
  local i = 0
  while i < #(id) do
    local c = char(id, i)
    local n = code(c)
    local _e14
    if c == "-" then
      _e14 = "_"
    else
      local _e15
      if valid_code63(n) then
        _e15 = c
      else
        local _e16
        if i == 0 then
          _e16 = "_" .. n
        else
          _e16 = n
        end
        _e15 = _e16
      end
      _e14 = _e15
    end
    local c1 = _e14
    id1 = id1 .. c1
    i = i + 1
  end
  if reserved63(id1) then
    return("_" .. id1)
  else
    return(id1)
  end
end
local function compile_atom(x)
  if x == "nil" and target42 == "lua" then
    return(x)
  else
    if x == "nil" then
      return("undefined")
    else
      if id_literal63(x) then
        return(inner(x))
      else
        if string_literal63(x) then
          return(escape_newlines(x))
        else
          if type(x) == "string" then
            return(id(x))
          else
            if type(x) == "boolean" then
              if x then
                return("true")
              else
                return("false")
              end
            else
              if nan63(x) then
                return("nan")
              else
                if x == inf then
                  return("inf")
                else
                  if x == -inf then
                    return("-inf")
                  else
                    if type(x) == "number" then
                      return(x .. "")
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
    return("")
  else
    if target42 == "js" then
      return(";\n")
    else
      return("\n")
    end
  end
end
local function compile_special(form, stmt63)
  local x = form[1]
  local args = cut(form, 1)
  local _id8 = getenv(x)
  local self_tr63 = _id8.tr
  local stmt = _id8.stmt
  local special = _id8.special
  local tr = terminator(stmt63 and not self_tr63)
  return(apply(special, args) .. tr)
end
local function parenthesize_call63(x)
  return(type(x) == "table" and x[1] == "%function" or precedence(x) > 0)
end
local function compile_call(form)
  local f = form[1]
  local f1 = compile(f)
  local args = compile_args(stash42(cut(form, 1)))
  if parenthesize_call63(f) then
    return("(" .. f1 .. ")" .. args)
  else
    return(f1 .. args)
  end
end
local function op_delims(parent, child, ...)
  local _r59 = unstash({...})
  local right = _r59.right
  local _e17
  if right then
    _e17 = precedence(child) >= precedence(parent)
  else
    _e17 = precedence(child) > precedence(parent)
  end
  if _e17 then
    return({"(", ")"})
  else
    return({"", ""})
  end
end
local function compile_infix(form)
  local op = form[1]
  local _id11 = cut(form, 1)
  local a = _id11[1]
  local b = _id11[2]
  local _id12 = op_delims(form, a)
  local ao = _id12[1]
  local ac = _id12[2]
  local _id13 = op_delims(form, b, stash33({right = true}))
  local bo = _id13[1]
  local bc = _id13[2]
  local _a = compile(a)
  local _b = compile(b)
  local _op = getop(op)
  if unary63(form) then
    return(_op .. ao .. " " .. _a .. ac)
  else
    return(ao .. _a .. ac .. " " .. _op .. " " .. bo .. _b .. bc)
  end
end
function compile_function(args, body, ...)
  local _r61 = unstash({...})
  local name = _r61.name
  local prefix = _r61.prefix
  local _e18
  if name then
    _e18 = compile(name)
  else
    _e18 = ""
  end
  local _id15 = _e18
  local _args = compile_args(args)
  indent_level42 = indent_level42 + 1
  local _x95 = compile(body, stash33({stmt = true}))
  indent_level42 = indent_level42 - 1
  local _body = _x95
  local ind = indentation()
  local _e19
  if prefix then
    _e19 = prefix .. " "
  else
    _e19 = ""
  end
  local p = _e19
  local _e20
  if target42 == "js" then
    _e20 = ""
  else
    _e20 = "end"
  end
  local tr = _e20
  if name then
    tr = tr .. "\n"
  end
  if target42 == "js" then
    return("function " .. _id15 .. _args .. " {\n" .. _body .. ind .. "}" .. tr)
  else
    return(p .. "function " .. _id15 .. _args .. "\n" .. _body .. ind .. tr)
  end
end
local function can_return63(form)
  return(not( form == nil) and (not( type(form) == "table") or not( form[1] == "return") and not statement63(form[1])))
end
function compile(form, ...)
  local _r63 = unstash({...})
  local stmt = _r63.stmt
  if form == nil then
    return("")
  else
    if special_form63(form) then
      return(compile_special(form, stmt))
    else
      local tr = terminator(stmt)
      local _e21
      if stmt then
        _e21 = indentation()
      else
        _e21 = ""
      end
      local ind = _e21
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
      local _form = _e22
      return(ind .. _form .. tr)
    end
  end
end
local function lower_statement(form, tail63)
  local hoist = {}
  local e = lower(form, hoist, true, tail63)
  if #(hoist) > 0 and not( e == nil) then
    return(join({"do"}, hoist, {e}))
  else
    if not( e == nil) then
      return(e)
    else
      if #(hoist) > 1 then
        return(join({"do"}, hoist))
      else
        return(hoist[1])
      end
    end
  end
end
local function lower_body(body, tail63)
  return(lower_statement(join({"do"}, body), tail63))
end
local function literal63(form)
  return(not( type(form) == "table") or form[1] == "%array" or form[1] == "%object")
end
local function standalone63(form)
  return(type(form) == "table" and not infix63(form[1]) and not literal63(form) and not( "get" == form[1]) or id_literal63(form))
end
local function lower_do(args, hoist, stmt63, tail63)
  local _x101 = almost(args)
  local _n10 = #(_x101)
  local _i10 = 0
  while _i10 < _n10 do
    local x = _x101[_i10 + 1]
    local e = lower(x, hoist, stmt63)
    if standalone63(e) then
      add(hoist, e)
    end
    _i10 = _i10 + 1
  end
  local e = lower(last(args), hoist, stmt63, tail63)
  if tail63 and can_return63(e) then
    return({"return", e})
  else
    return(e)
  end
end
local function lower_assign(args, hoist, stmt63, tail63)
  local lh = args[1]
  local rh = args[2]
  add(hoist, {"assign", lh, lower(rh, hoist)})
  if not( stmt63 and not tail63) then
    return(lh)
  end
end
local function lower_if(args, hoist, stmt63, tail63)
  local cond = args[1]
  local _then = args[2]
  local _else = args[3]
  if stmt63 or tail63 then
    local _e25
    if _else then
      _e25 = {lower_body({_else}, tail63)}
    end
    return(add(hoist, join({"%if", lower(cond, hoist), lower_body({_then}, tail63)}, _e25)))
  else
    local e = uniq("e")
    add(hoist, {"%local", e})
    local _e24
    if _else then
      _e24 = {lower({"assign", e, _else})}
    end
    add(hoist, join({"%if", lower(cond, hoist), lower({"assign", e, _then})}, _e24))
    return(e)
  end
end
local function lower_short(x, args, hoist)
  local a = args[1]
  local b = args[2]
  local hoist1 = {}
  local b1 = lower(b, hoist1)
  if #(hoist1) > 0 then
    local _id20 = uniq("id")
    local _e26
    if x == "and" then
      _e26 = {"%if", _id20, b, _id20}
    else
      _e26 = {"%if", _id20, _id20, b}
    end
    return(lower({"do", {"%local", _id20, a}, _e26}, hoist))
  else
    return({x, lower(a, hoist), b1})
  end
end
local function lower_try(args, hoist, tail63)
  return(add(hoist, {"%try", lower_body(args, tail63)}))
end
local function lower_while(args, hoist)
  local c = args[1]
  local body = cut(args, 1)
  local hoist1 = {}
  local _c = lower(c, hoist1)
  local _e27
  if #(hoist1) == 0 then
    _e27 = {"while", _c, lower_body(body)}
  else
    _e27 = {"while", true, join({"do"}, hoist1, {{"%if", {"not", _c}, {"break"}}, lower_body(body)})}
  end
  return(add(hoist, _e27))
end
local function lower_for(args, hoist)
  local l = args[1]
  local k = args[2]
  local body = cut(args, 2)
  return(add(hoist, {"%for", lower(l, hoist), k, lower_body(body)}))
end
local function lower_function(args)
  local a = args[1]
  local body = cut(args, 1)
  return({"%function", a, lower_body(body, true)})
end
local function lower_definition(kind, args, hoist)
  local _id24 = args
  local name = _id24[1]
  local _args1 = _id24[2]
  local body = cut(_id24, 2)
  return(add(hoist, {kind, name, _args1, lower_body(body, true)}))
end
local function lower_call(form, hoist)
  local _form1 = map(function (_)
    return(lower(_, hoist))
  end, form)
  if #(_form1) > 0 then
    return(_form1)
  end
end
local function lower_infix63(form)
  return(infix63(form[1]) and #(form) > 3)
end
local function lower_infix(form, hoist)
  local x = form[1]
  local args = cut(form, 1)
  return(lower(reduce(function (_0, _1)
    return({x, _1, _0})
  end, rev(args)), hoist))
end
local function lower_special(form, hoist)
  local e = lower_call(form, hoist)
  if e then
    return(add(hoist, e))
  end
end
function lower(form, hoist, stmt63, tail63)
  if not( type(form) == "table") then
    return(form)
  else
    if empty63(form) then
      return({"%array"})
    else
      if hoist == nil then
        return(lower_statement(form))
      else
        if lower_infix63(form) then
          return(lower_infix(form, hoist))
        else
          local x = form[1]
          local args = cut(form, 1)
          if x == "do" then
            return(lower_do(args, hoist, stmt63, tail63))
          else
            if x == "assign" then
              return(lower_assign(args, hoist, stmt63, tail63))
            else
              if x == "%if" then
                return(lower_if(args, hoist, stmt63, tail63))
              else
                if x == "%try" then
                  return(lower_try(args, hoist, tail63))
                else
                  if x == "while" then
                    return(lower_while(args, hoist))
                  else
                    if x == "%for" then
                      return(lower_for(args, hoist))
                    else
                      if x == "%function" then
                        return(lower_function(args))
                      else
                        if x == "%local-function" or x == "%global-function" then
                          return(lower_definition(x, args, hoist))
                        else
                          if in63(x, {"and", "or"}) then
                            return(lower_short(x, args, hoist))
                          else
                            if statement63(x) then
                              return(lower_special(form, hoist))
                            else
                              return(lower_call(form, hoist))
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
  return(lower(macroexpand(form)))
end
if _x132 == nil then
  _x132 = true
  run_lua = load
end
local function run(code)
  local f,e = run_lua(code)
  if f then
    return(f())
  else
    error(e .. " in " .. code)
  end
end
local function eval(form)
  local previous = target42
  target42 = "lua"
  _37result = nil
  local code = compile(expand({"assign", "%result", form}))
  target42 = previous
  run(code)
  return(_37result)
end
setenv("do", stash33({tr = true, special = function (...)
  local forms = unstash({...})
  local s = ""
  local _x137 = forms
  local _n12 = #(_x137)
  local _i12 = 0
  while _i12 < _n12 do
    local x = _x137[_i12 + 1]
    s = s .. compile(x, stash33({stmt = true}))
    if not not( type(x) == "table") then
      if x[1] == "return" or x[1] == "break" then
        break
      end
    end
    _i12 = _i12 + 1
  end
  return(s)
end, stmt = true}))
setenv("%if", stash33({tr = true, special = function (cond, cons, alt)
  local _cond1 = compile(cond)
  indent_level42 = indent_level42 + 1
  local _x140 = compile(cons, stash33({stmt = true}))
  indent_level42 = indent_level42 - 1
  local _cons1 = _x140
  local _e28
  if alt then
    indent_level42 = indent_level42 + 1
    local _x141 = compile(alt, stash33({stmt = true}))
    indent_level42 = indent_level42 - 1
    _e28 = _x141
  end
  local _alt1 = _e28
  local ind = indentation()
  local s = ""
  if target42 == "js" then
    s = s .. ind .. "if (" .. _cond1 .. ") {\n" .. _cons1 .. ind .. "}"
  else
    s = s .. ind .. "if " .. _cond1 .. " then\n" .. _cons1
  end
  if _alt1 and target42 == "js" then
    s = s .. " else {\n" .. _alt1 .. ind .. "}"
  else
    if _alt1 then
      s = s .. ind .. "else\n" .. _alt1
    end
  end
  if target42 == "lua" then
    return(s .. ind .. "end\n")
  else
    return(s .. "\n")
  end
end, stmt = true}))
setenv("while", stash33({tr = true, special = function (cond, form)
  local _cond3 = compile(cond)
  indent_level42 = indent_level42 + 1
  local _x143 = compile(form, stash33({stmt = true}))
  indent_level42 = indent_level42 - 1
  local body = _x143
  local ind = indentation()
  if target42 == "js" then
    return(ind .. "while (" .. _cond3 .. ") {\n" .. body .. ind .. "}\n")
  else
    return(ind .. "while " .. _cond3 .. " do\n" .. body .. ind .. "end\n")
  end
end, stmt = true}))
setenv("%for", stash33({tr = true, special = function (l, k, form)
  local _l8 = compile(l)
  local ind = indentation()
  indent_level42 = indent_level42 + 1
  local _x145 = compile(form, stash33({stmt = true}))
  indent_level42 = indent_level42 - 1
  local body = _x145
  if target42 == "lua" then
    return(ind .. "for " .. k .. " in next, " .. _l8 .. " do\n" .. body .. ind .. "end\n")
  else
    return(ind .. "for (" .. k .. " in " .. _l8 .. ") {\n" .. body .. ind .. "}\n")
  end
end, stmt = true}))
setenv("%try", stash33({tr = true, special = function (form)
  local e = uniq("e")
  local ind = indentation()
  indent_level42 = indent_level42 + 1
  local _x152 = compile(form, stash33({stmt = true}))
  indent_level42 = indent_level42 - 1
  local body = _x152
  local hf = {"return", {"%array", false, {"get", e, "\"message\""}, {"get", e, "\"stack\""}}}
  indent_level42 = indent_level42 + 1
  local _x157 = compile(hf, stash33({stmt = true}))
  indent_level42 = indent_level42 - 1
  local h = _x157
  return(ind .. "try {\n" .. body .. ind .. "}\n" .. ind .. "catch (" .. e .. ") {\n" .. h .. ind .. "}\n")
end, stmt = true}))
setenv("%delete", stash33({special = function (place)
  return(indentation() .. "delete " .. compile(place))
end, stmt = true}))
setenv("break", stash33({special = function ()
  return(indentation() .. "break")
end, stmt = true}))
setenv("%function", stash33({special = function (args, body)
  return(compile_function(args, body))
end}))
setenv("%global-function", stash33({tr = true, special = function (name, args, body)
  if target42 == "lua" then
    local x = compile_function(args, body, stash33({name = name}))
    return(indentation() .. x)
  else
    return(compile({"assign", name, {"%function", args, body}}, stash33({stmt = true})))
  end
end, stmt = true}))
setenv("%local-function", stash33({tr = true, special = function (name, args, body)
  if target42 == "lua" then
    local x = compile_function(args, body, stash33({name = name, prefix = "local"}))
    return(indentation() .. x)
  else
    return(compile({"%local", name, {"%function", args, body}}, stash33({stmt = true})))
  end
end, stmt = true}))
setenv("return", stash33({special = function (x)
  local _e29
  if x == nil then
    _e29 = "return"
  else
    _e29 = "return(" .. compile(x) .. ")"
  end
  local _x167 = _e29
  return(indentation() .. _x167)
end, stmt = true}))
setenv("new", stash33({special = function (x)
  return("new " .. compile(x))
end}))
setenv("typeof", stash33({special = function (x)
  return("typeof(" .. compile(x) .. ")")
end}))
setenv("error", stash33({special = function (x)
  local _e30
  if target42 == "js" then
    _e30 = "throw " .. compile({"new", {"Error", x}})
  else
    _e30 = "error(" .. compile(x) .. ")"
  end
  local e = _e30
  return(indentation() .. e)
end, stmt = true}))
setenv("%local", stash33({special = function (name, value)
  local _id28 = compile(name)
  local value1 = compile(value)
  local _e31
  if not( value == nil) then
    _e31 = " = " .. value1
  else
    _e31 = ""
  end
  local rh = _e31
  local _e32
  if target42 == "js" then
    _e32 = "var "
  else
    _e32 = "local "
  end
  local keyword = _e32
  local ind = indentation()
  return(ind .. keyword .. _id28 .. rh)
end, stmt = true}))
setenv("assign", stash33({special = function (lh, rh)
  local _lh1 = compile(lh)
  local _e33
  if rh == nil then
    _e33 = "nil"
  else
    _e33 = rh
  end
  local _rh1 = compile(_e33)
  return(indentation() .. _lh1 .. " = " .. _rh1)
end, stmt = true}))
setenv("get", stash33({special = function (l, k)
  local _l10 = compile(l)
  local k1 = compile(k)
  if target42 == "lua" and char(_l10, 0) == "{" then
    _l10 = "(" .. _l10 .. ")"
  end
  if string_literal63(k) and valid_id63(inner(k)) then
    return(_l10 .. "." .. inner(k))
  else
    return(_l10 .. "[" .. k1 .. "]")
  end
end}))
setenv("%array", stash33({special = function (...)
  local forms = unstash({...})
  local _e34
  if target42 == "lua" then
    _e34 = "{"
  else
    _e34 = "["
  end
  local open = _e34
  local _e35
  if target42 == "lua" then
    _e35 = "}"
  else
    _e35 = "]"
  end
  local close = _e35
  local s = ""
  local c = ""
  local _l12 = forms
  local k = nil
  for k in next, _l12 do
    local v = _l12[k]
    if type(k) == "number" then
      s = s .. c .. compile(v)
      c = ", "
    end
  end
  return(open .. s .. close)
end}))
setenv("%object", stash33({special = function (...)
  local forms = unstash({...})
  local s = "{"
  local c = ""
  local _e36
  if target42 == "lua" then
    _e36 = " = "
  else
    _e36 = ": "
  end
  local sep = _e36
  local _l14 = pair(forms)
  local k = nil
  for k in next, _l14 do
    local v = _l14[k]
    if type(k) == "number" then
      local _id30 = v
      local _k2 = _id30[1]
      local _v2 = _id30[2]
      if not( type(_k2) == "string") then
        error("Illegal key: " .. str(_k2))
      end
      s = s .. c .. key(_k2) .. sep .. compile(_v2)
      c = ", "
    end
  end
  return(s .. "}")
end}))
return({run = run, expand = expand, reset = reset, eval = eval, compile = compile})
