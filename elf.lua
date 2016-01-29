#!/usr/bin/env luajit

local function setup()
  setenv("quote", {_stash = true, macro = function (form)
    return(quoted(form))
  end})
  setenv("quasiquote", {_stash = true, macro = function (form)
    return(quasiexpand(form, 1))
  end})
  setenv("at", {_stash = true, macro = function (l, i)
    if target == "lua" and number63(i) then
      i = i + 1
    else
      if target == "lua" then
        i = {"+", i, 1}
      end
    end
    return({"get", l, i})
  end})
  setenv("wipe", {_stash = true, macro = function (place)
    if target == "lua" then
      return({"set", place, "nil"})
    else
      return({"%delete", place})
    end
  end})
  setenv("list", {_stash = true, macro = function (...)
    local body = unstash({...})
    local x = unique("x")
    local l = {}
    local forms = {}
    local _o1 = body
    local k = nil
    for k in next, _o1 do
      local v = _o1[k]
      if number63(k) then
        l[k] = v
      else
        add(forms, {"set", {"get", x, {"quote", k}}, v})
      end
    end
    if some63(forms) then
      return(join({"let", x, join({"%array"}, l)}, forms, {x}))
    else
      return(join({"%array"}, l))
    end
  end})
  setenv("if", {_stash = true, macro = function (...)
    local branches = unstash({...})
    return(hd(expand_if(branches)))
  end})
  setenv("case", {_stash = true, macro = function (x, ...)
    local _r11 = unstash({...})
    local _id2 = _r11
    local clauses = cut(_id2, 0)
    local e = unique("e")
    local bs = map(function (_x35)
      local _id3 = _x35
      local a = _id3[1]
      local b = _id3[2]
      if nil63(b) then
        return({a})
      else
        return({{"=", a, e}, b})
      end
    end, pair(clauses))
    return({"let", {e, x}, join({"if"}, apply(join, bs))})
  end})
  setenv("when", {_stash = true, macro = function (cond, ...)
    local _r14 = unstash({...})
    local _id5 = _r14
    local body = cut(_id5, 0)
    return({"if", cond, join({"do"}, body)})
  end})
  setenv("unless", {_stash = true, macro = function (cond, ...)
    local _r16 = unstash({...})
    local _id7 = _r16
    local body = cut(_id7, 0)
    return({"if", {"not", cond}, join({"do"}, body)})
  end})
  setenv("obj", {_stash = true, macro = function (...)
    local body = unstash({...})
    return(join({"%object"}, mapo(function (x)
      return(x)
    end, body)))
  end})
  setenv("let", {_stash = true, macro = function (bs, ...)
    local _r20 = unstash({...})
    local _id11 = _r20
    local body = cut(_id11, 0)
    if atom63(bs) then
      return(join({"let", {bs, hd(body)}}, tl(body)))
    else
      if none63(bs) then
        return(join({"do"}, body))
      else
        local _id12 = bs
        local lh = _id12[1]
        local rh = _id12[2]
        local bs2 = cut(_id12, 2)
        local _id13 = bind(lh, rh)
        local id = _id13[1]
        local val = _id13[2]
        local bs1 = cut(_id13, 2)
        local renames = {}
        if bound63(id) or toplevel63() then
          local id1 = unique(id)
          renames = {id, id1}
          id = id1
        else
          setenv(id, {_stash = true, variable = true})
        end
        return({"do", {"%local", id, val}, {"let-symbol", renames, join({"let", join(bs1, bs2)}, body)}})
      end
    end
  end})
  setenv("with", {_stash = true, macro = function (x, v, ...)
    local _r22 = unstash({...})
    local _id15 = _r22
    local body = cut(_id15, 0)
    return(join({"let", {x, v}}, body, {x}))
  end})
  setenv("let-when", {_stash = true, macro = function (x, v, ...)
    local _r24 = unstash({...})
    local _id17 = _r24
    local body = cut(_id17, 0)
    local y = unique("y")
    return({"let", y, v, {"when", y, join({"let", {x, y}}, body)}})
  end})
  setenv("mac", {_stash = true, macro = function (name, args, ...)
    local _r26 = unstash({...})
    local _id19 = _r26
    local body = cut(_id19, 0)
    local _x101 = {"setenv", {"quote", name}}
    _x101.macro = join({"fn", args}, body)
    local form = _x101
    eval(form)
    return(form)
  end})
  setenv("defspecial", {_stash = true, macro = function (name, args, ...)
    local _r28 = unstash({...})
    local _id21 = _r28
    local body = cut(_id21, 0)
    local _x109 = {"setenv", {"quote", name}}
    _x109.special = join({"fn", args}, body)
    local form = join(_x109, keys(body))
    eval(form)
    return(form)
  end})
  setenv("defsym", {_stash = true, macro = function (name, expansion)
    setenv(name, {_stash = true, symbol = expansion})
    local _x115 = {"setenv", {"quote", name}}
    _x115.symbol = {"quote", expansion}
    return(_x115)
  end})
  setenv("var", {_stash = true, macro = function (name, x, ...)
    local _r32 = unstash({...})
    local _id23 = _r32
    local body = cut(_id23, 0)
    setenv(name, {_stash = true, variable = true})
    if some63(body) then
      return(join({"%local-function", name}, bind42(x, body)))
    else
      return({"%local", name, x})
    end
  end})
  setenv("def", {_stash = true, macro = function (name, x, ...)
    local _r34 = unstash({...})
    local _id25 = _r34
    local body = cut(_id25, 0)
    setenv(name, {_stash = true, toplevel = true, variable = true})
    if some63(body) then
      return(join({"%global-function", name}, bind42(x, body)))
    else
      return({"set", name, x})
    end
  end})
  setenv("with-frame", {_stash = true, macro = function (...)
    local body = unstash({...})
    local x = unique("x")
    return({"do", {"add", "environment", {"obj"}}, {"with", x, join({"do"}, body), {"drop", "environment"}}})
  end})
  setenv("with-bindings", {_stash = true, macro = function (_x149, ...)
    local _id28 = _x149
    local names = _id28[1]
    local _r36 = unstash({...})
    local _id29 = _r36
    local body = cut(_id29, 0)
    local x = unique("x")
    local _x153 = {"setenv", x}
    _x153.variable = true
    return(join({"with-frame", {"each", x, names, _x153}}, body))
  end})
  setenv("let-macro", {_stash = true, macro = function (definitions, ...)
    local _r39 = unstash({...})
    local _id31 = _r39
    local body = cut(_id31, 0)
    add(environment, {})
    map(function (m)
      return(macroexpand(join({"mac"}, m)))
    end, definitions)
    local _x159 = join({"do"}, macroexpand(body))
    drop(environment)
    return(_x159)
  end})
  setenv("let-symbol", {_stash = true, macro = function (expansions, ...)
    local _r43 = unstash({...})
    local _id34 = _r43
    local body = cut(_id34, 0)
    add(environment, {})
    map(function (_x169)
      local _id35 = _x169
      local name = _id35[1]
      local exp = _id35[2]
      return(macroexpand({"defsym", name, exp}))
    end, pair(expansions))
    local _x168 = join({"do"}, macroexpand(body))
    drop(environment)
    return(_x168)
  end})
  setenv("let-unique", {_stash = true, macro = function (names, ...)
    local _r47 = unstash({...})
    local _id37 = _r47
    local body = cut(_id37, 0)
    local bs = map(function (n)
      return({n, {"unique", {"quote", n}}})
    end, names)
    return(join({"let", apply(join, bs)}, body))
  end})
  setenv("fn", {_stash = true, macro = function (args, ...)
    local _r50 = unstash({...})
    local _id39 = _r50
    local body = cut(_id39, 0)
    return(join({"%function"}, bind42(args, body)))
  end})
  setenv("guard", {_stash = true, macro = function (expr)
    if target == "js" then
      return({{"fn", join(), {"%try", {"list", true, expr}}}})
    else
      local x = unique("x")
      local msg = unique("msg")
      local trace = unique("trace")
      return({"let", {x, "nil", msg, "nil", trace, "nil"}, {"if", {"xpcall", {"fn", join(), {"set", x, expr}}, {"fn", {"m"}, {"set", msg, {"clip", "m", {"+", {"search", "m", "\": \""}, 2}}}, {"set", trace, {{"get", "debug", {"quote", "traceback"}}}}}}, {"list", true, x}, {"list", false, msg, trace}}})
    end
  end})
  setenv("each", {_stash = true, macro = function (x, t, ...)
    local _r54 = unstash({...})
    local _id42 = _r54
    local body = cut(_id42, 0)
    local o = unique("o")
    local n = unique("n")
    local i = unique("i")
    local _e4
    if atom63(x) then
      _e4 = {i, x}
    else
      local _e5
      if _35(x) > 1 then
        _e5 = x
      else
        _e5 = {i, hd(x)}
      end
      _e4 = _e5
    end
    local _id43 = _e4
    local k = _id43[1]
    local v = _id43[2]
    local _e6
    if target == "lua" then
      _e6 = body
    else
      _e6 = {join({"let", k, {"if", {"numeric?", k}, {"parseInt", k}, k}}, body)}
    end
    return({"let", {o, t, k, "nil"}, {"%for", o, k, join({"let", {v, {"get", o, k}}}, _e6)}})
  end})
  setenv("for", {_stash = true, macro = function (i, to, ...)
    local _r56 = unstash({...})
    local _id45 = _r56
    local body = cut(_id45, 0)
    return({"let", i, 0, join({"while", {"<", i, to}}, body, {{"inc", i}})})
  end})
  setenv("step", {_stash = true, macro = function (v, t, ...)
    local _r58 = unstash({...})
    local _id47 = _r58
    local body = cut(_id47, 0)
    local x = unique("x")
    local n = unique("n")
    local i = unique("i")
    return({"let", {x, t, n, {"#", x}}, {"for", i, n, join({"let", {v, {"at", x, i}}}, body)}})
  end})
  setenv("set-of", {_stash = true, macro = function (...)
    local xs = unstash({...})
    local l = {}
    local _o3 = xs
    local _i3 = nil
    for _i3 in next, _o3 do
      local x = _o3[_i3]
      l[x] = true
    end
    return(join({"obj"}, l))
  end})
  setenv("language", {_stash = true, macro = function ()
    return({"quote", target})
  end})
  setenv("target", {_stash = true, macro = function (...)
    local clauses = unstash({...})
    return(clauses[target])
  end})
  setenv("join!", {_stash = true, macro = function (a, ...)
    local _r62 = unstash({...})
    local _id49 = _r62
    local bs = cut(_id49, 0)
    return({"set", a, join({"join", a}, bs)})
  end})
  setenv("cat!", {_stash = true, macro = function (a, ...)
    local _r64 = unstash({...})
    local _id51 = _r64
    local bs = cut(_id51, 0)
    return({"set", a, join({"cat", a}, bs)})
  end})
  setenv("inc", {_stash = true, macro = function (n, by)
    return({"set", n, {"+", n, by or 1}})
  end})
  setenv("dec", {_stash = true, macro = function (n, by)
    return({"set", n, {"-", n, by or 1}})
  end})
  setenv("with-indent", {_stash = true, macro = function (form)
    local x = unique("x")
    return({"do", {"inc", "indent-level"}, {"with", x, form, {"dec", "indent-level"}}})
  end})
  setenv("export", {_stash = true, macro = function (...)
    local names = unstash({...})
    if target == "js" then
      return(join({"do"}, map(function (k)
        return({"set", {"get", "exports", {"quote", k}}, k})
      end, names)))
    else
      local x = {}
      local _o5 = names
      local _i5 = nil
      for _i5 in next, _o5 do
        local k = _o5[_i5]
        x[k] = k
      end
      return({"return", join({"obj"}, x)})
    end
  end})
  setenv("undef?", {_stash = true, macro = function (_var)
    if target == "js" then
      return({"=", {"typeof", _var}, "\"undefined\""})
    else
      return({"=", _var, "nil"})
    end
  end})
  setenv("%js", {_stash = true, macro = function (...)
    local forms = unstash({...})
    if target == "js" then
      return(join({"do"}, forms))
    end
  end})
  setenv("%lua", {_stash = true, macro = function (...)
    local forms = unstash({...})
    if target == "lua" then
      return(join({"do"}, forms))
    end
  end})
  setenv("eval-compile", {_stash = true, macro = function (...)
    local forms = unstash({...})
    eval(join({"do"}, forms))
    return(nil)
  end})
  setenv("eval-once", {_stash = true, macro = function (...)
    local forms = unstash({...})
    local x = unique("x")
    return(join({"when", {"undef?", x}, {"set", x, true}}, forms))
  end})
  setenv("assert", {_stash = true, macro = function (cond)
    return({"unless", cond, {"error", {"quote", "assert"}}})
  end})
  return(nil)
end
if _x368 == nil then
  _x368 = true
  environment = {{}}
  target = "lua"
end
function nil63(x)
  return(x == nil)
end
function is63(x)
  return(not nil63(x))
end
function _35(x)
  return(#x)
end
function none63(x)
  return(_35(x) == 0)
end
function some63(x)
  return(_35(x) > 0)
end
function one63(x)
  return(_35(x) == 1)
end
function two63(x)
  return(_35(x) == 2)
end
function hd(l)
  return(l[1])
end
function string63(x)
  return(type(x) == "string")
end
function number63(x)
  return(type(x) == "number")
end
function boolean63(x)
  return(type(x) == "boolean")
end
function function63(x)
  return(type(x) == "function")
end
function atom63(x)
  return(nil63(x) or string63(x) or number63(x) or boolean63(x))
end
nan = 0 / 0
inf = 1 / 0
function nan63(n)
  return(not( n == n))
end
function inf63(n)
  return(n == inf or n == -inf)
end
function clip(s, from, upto)
  return(string.sub(s, from + 1, upto))
end
function cut(x, from, upto)
  local l = {}
  local j = 0
  local _e7
  if nil63(from) or from < 0 then
    _e7 = 0
  else
    _e7 = from
  end
  local i = _e7
  local n = _35(x)
  local _e8
  if nil63(upto) or upto > n then
    _e8 = n
  else
    _e8 = upto
  end
  local _upto = _e8
  while i < _upto do
    l[j + 1] = x[i + 1]
    i = i + 1
    j = j + 1
  end
  local _o6 = x
  local k = nil
  for k in next, _o6 do
    local v = _o6[k]
    if not number63(k) then
      l[k] = v
    end
  end
  return(l)
end
function keys(x)
  local t = {}
  local _o7 = x
  local k = nil
  for k in next, _o7 do
    local v = _o7[k]
    if not number63(k) then
      t[k] = v
    end
  end
  return(t)
end
function edge(x)
  return(_35(x) - 1)
end
function inner(x)
  return(clip(x, 1, edge(x)))
end
function tl(l)
  return(cut(l, 1))
end
function char(s, n)
  return(clip(s, n, n + 1))
end
function code(s, n)
  local _e9
  if n then
    _e9 = n + 1
  end
  return(string.byte(s, _e9))
end
function string_literal63(x)
  return(string63(x) and char(x, 0) == "\"")
end
function id_literal63(x)
  return(string63(x) and char(x, 0) == "|")
end
function add(l, x)
  return(table.insert(l, x))
end
function drop(l)
  return(table.remove(l))
end
function last(l)
  return(l[edge(l) + 1])
end
function almost(l)
  return(cut(l, 0, edge(l)))
end
function reverse(l)
  local l1 = keys(l)
  local i = edge(l)
  while i >= 0 do
    add(l1, l[i + 1])
    i = i - 1
  end
  return(l1)
end
function reduce(f, x)
  if none63(x) then
    return(nil)
  else
    if one63(x) then
      return(hd(x))
    else
      return(f(hd(x), reduce(f, tl(x))))
    end
  end
end
function join(...)
  local ls = unstash({...})
  if two63(ls) then
    local _id52 = ls
    local a = _id52[1]
    local b = _id52[2]
    if a and b then
      local c = {}
      local o = _35(a)
      local _o8 = a
      local k = nil
      for k in next, _o8 do
        local v = _o8[k]
        c[k] = v
      end
      local _o9 = b
      local k = nil
      for k in next, _o9 do
        local v = _o9[k]
        if number63(k) then
          k = k + o
        end
        c[k] = v
      end
      return(c)
    else
      return(a or b or {})
    end
  else
    return(reduce(join, ls) or {})
  end
end
function find(f, t)
  local _o10 = t
  local _i10 = nil
  for _i10 in next, _o10 do
    local x = _o10[_i10]
    local y = f(x)
    if y then
      return(y)
    end
  end
end
function first(f, l)
  local _x371 = l
  local _n11 = _35(_x371)
  local _i11 = 0
  while _i11 < _n11 do
    local x = _x371[_i11 + 1]
    local y = f(x)
    if y then
      return(y)
    end
    _i11 = _i11 + 1
  end
end
function in63(x, t)
  return(find(function (y)
    return(x == y)
  end, t))
end
function pair(l)
  local l1 = {}
  local i = 0
  while i < _35(l) do
    add(l1, {l[i + 1], l[i + 1 + 1]})
    i = i + 1
    i = i + 1
  end
  return(l1)
end
function sort(l, f)
  table.sort(l, f)
  return(l)
end
function map(f, x)
  local t = {}
  local _x373 = x
  local _n12 = _35(_x373)
  local _i12 = 0
  while _i12 < _n12 do
    local v = _x373[_i12 + 1]
    local y = f(v)
    if is63(y) then
      add(t, y)
    end
    _i12 = _i12 + 1
  end
  local _o11 = x
  local k = nil
  for k in next, _o11 do
    local v = _o11[k]
    if not number63(k) then
      local y = f(v)
      if is63(y) then
        t[k] = y
      end
    end
  end
  return(t)
end
function keep(f, x)
  return(map(function (v)
    if f(v) then
      return(v)
    end
  end, x))
end
function keys63(t)
  local _o12 = t
  local k = nil
  for k in next, _o12 do
    local v = _o12[k]
    if not number63(k) then
      return(true)
    end
  end
  return(false)
end
function empty63(t)
  local _o13 = t
  local _i15 = nil
  for _i15 in next, _o13 do
    local x = _o13[_i15]
    return(false)
  end
  return(true)
end
function stash(args)
  if keys63(args) then
    local p = {}
    local _o14 = args
    local k = nil
    for k in next, _o14 do
      local v = _o14[k]
      if not number63(k) then
        p[k] = v
      end
    end
    p._stash = true
    add(args, p)
  end
  return(args)
end
function unstash(args)
  if none63(args) then
    return({})
  else
    local l = last(args)
    if not atom63(l) and not function63(l) and l._stash then
      local args1 = almost(args)
      local _o15 = l
      local k = nil
      for k in next, _o15 do
        local v = _o15[k]
        if not( k == "_stash") then
          args1[k] = v
        end
      end
      return(args1)
    else
      return(args)
    end
  end
end
function search(s, pattern, start)
  local _e10
  if start then
    _e10 = start + 1
  end
  local _start = _e10
  local i = string.find(s, pattern, _start, true)
  return(i and i - 1)
end
function split(s, sep)
  if s == "" or sep == "" then
    return({})
  else
    local l = {}
    local n = _35(sep)
    while true do
      local i = search(s, sep)
      if nil63(i) then
        break
      else
        add(l, clip(s, 0, i))
        s = clip(s, i + n)
      end
    end
    add(l, s)
    return(l)
  end
end
function cat(...)
  local xs = unstash({...})
  return(reduce(function (a, b)
    return(a .. b)
  end, xs) or "")
end
function _43(...)
  local xs = unstash({...})
  return(reduce(function (a, b)
    return(a + b)
  end, xs) or 0)
end
function _(...)
  local xs = unstash({...})
  return(reduce(function (b, a)
    return(a - b)
  end, reverse(xs)) or 0)
end
function _42(...)
  local xs = unstash({...})
  return(reduce(function (a, b)
    return(a * b)
  end, xs) or 1)
end
function _47(...)
  local xs = unstash({...})
  return(reduce(function (b, a)
    return(a / b)
  end, reverse(xs)) or 1)
end
function _37(...)
  local xs = unstash({...})
  return(reduce(function (b, a)
    return(a % b)
  end, reverse(xs)) or 0)
end
function _62(a, b)
  return(a > b)
end
function _60(a, b)
  return(a < b)
end
function _61(a, b)
  return(a == b)
end
function _6261(a, b)
  return(a >= b)
end
function _6061(a, b)
  return(a <= b)
end
function number(s)
  return(tonumber(s))
end
function number_code63(n)
  return(n > 47 and n < 58)
end
function numeric63(s)
  local n = _35(s)
  local i = 0
  while i < n do
    if not number_code63(code(s, i)) then
      return(false)
    end
    i = i + 1
  end
  return(true)
end
function escape(s)
  local s1 = "\""
  local i = 0
  while i < _35(s) do
    local c = char(s, i)
    local _e11
    if c == "\n" then
      _e11 = "\\n"
    else
      local _e12
      if c == "\"" then
        _e12 = "\\\""
      else
        local _e13
        if c == "\\" then
          _e13 = "\\\\"
        else
          _e13 = c
        end
        _e12 = _e13
      end
      _e11 = _e12
    end
    local c1 = _e11
    s1 = s1 .. c1
    i = i + 1
  end
  return(s1 .. "\"")
end
function str(x, depth)
  if depth and depth > 40 then
    return("circular")
  else
    if nil63(x) then
      return("nil")
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
            if boolean63(x) then
              if x then
                return("true")
              else
                return("false")
              end
            else
              if string63(x) then
                return(escape(x))
              else
                if atom63(x) then
                  return(tostring(x))
                else
                  if function63(x) then
                    return("fn")
                  else
                    local s = "("
                    local sp = ""
                    local xs = {}
                    local ks = {}
                    local d = (depth or 0) + 1
                    local _o16 = x
                    local k = nil
                    for k in next, _o16 do
                      local v = _o16[k]
                      if number63(k) then
                        xs[k] = str(v, d)
                      else
                        add(ks, k .. ":")
                        add(ks, str(v, d))
                      end
                    end
                    local _o17 = join(xs, ks)
                    local _i19 = nil
                    for _i19 in next, _o17 do
                      local v = _o17[_i19]
                      s = s .. sp .. v
                      sp = " "
                    end
                    return(s .. ")")
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
local values = unpack or table.unpack
function apply(f, args)
  local _args = stash(args)
  return(f(values(_args)))
end
function call(f)
  return(f())
end
function toplevel63()
  return(one63(environment))
end
function setenv(k, ...)
  local _r142 = unstash({...})
  local _id53 = _r142
  local _keys = cut(_id53, 0)
  if string63(k) then
    local _e14
    if _keys.toplevel then
      _e14 = hd(environment)
    else
      _e14 = last(environment)
    end
    local frame = _e14
    local entry = frame[k] or {}
    local _o18 = _keys
    local _k = nil
    for _k in next, _o18 do
      local v = _o18[_k]
      entry[_k] = v
    end
    frame[k] = entry
    return(frame[k])
  end
end
abs = math.abs
acos = math.acos
asin = math.asin
atan = math.atan
atan2 = math.atan2
ceil = math.ceil
cos = math.cos
floor = math.floor
log = math.log
log10 = math.log10
max = math.max
min = math.min
pow = math.pow
random = math.random
sin = math.sin
sinh = math.sinh
sqrt = math.sqrt
tan = math.tan
tanh = math.tanh
setup()
setenv("bang", {_stash = true, tr = true, special = function ()
  if target == "js" then
    return("#!/usr/bin/env node\n\n")
  else
    return("#!/usr/bin/env luajit\n\n")
  end
end})
setenv("elf", {_stash = true, macro = function (_x423)
  local _e15
  if is63(_x423) then
    _e15 = _x423
  else
    _e15 = "."
  end
  local path = _e15
  local p = {"get", {{"get", "debug", {"quote", "getinfo"}}, 1, "\"S\""}, {"quote", "source"}}
  return({"do", {"when", {"undef?", "elf*"}, {"def", "elf*", true}, {"%js", {"unless", {"undef?", "process"}, {"let-symbol", {"p", {"get", {"get", "process", {"quote", "env"}}, {"quote", "NODE_PATH"}}}, {"if", {"and", "p", {">", {"get", "p", {"quote", "length"}}, 0}}, {"cat!", "p", "\":\"", "__dirname"}, {"set", "p", "__dirname"}}}, {"let", "Module", {"require", {"quote", "module"}}, {{"get", "Module", {"quote", "_initPaths"}}}}}}, {"%lua", {"cat!", {"get", "package", {"quote", "path"}}, "\";\"", {"or", {{"get", p, {"quote", "match"}}, p, "\"[@]?(.*/)[^/]+[.]lua\""}, "\"./\""}, escape(path), "\"/?.lua\""}}}, {"require", {"quote", "elf"}}})
end})
setenv("main?", {_stash = true, macro = function ()
  return({"do", {"%js", {"=", {"get", "require", {"quote", "main"}}, "module"}}, {"%lua", {"~pcall", "getfenv", 4}}})
end})
setenv("main", {_stash = true, macro = function (...)
  local l = unstash({...})
  return(join({"when", {"main?"}, {"elf"}}, l))
end})
if not pcall(getfenv, 4) then
  if elf42 == nil then
    elf42 = true
    package.path = package.path .. ";" .. (debug.getinfo(1, "S").source.match(debug.getinfo(1, "S").source, "[@]?(.*/)[^/]+[.]lua") or "./") .. "." .. "/?.lua"
  end
  require("elf")
  require("elf-main")
  elf_main()
end
