if environment == nil then
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
  local _e6
  if nil63(from) or from < 0 then
    _e6 = 0
  else
    _e6 = from
  end
  local i = _e6
  local n = _35(x)
  local _e7
  if nil63(upto) or upto > n then
    _e7 = n
  else
    _e7 = upto
  end
  local _upto = _e7
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
  local _e8
  if n then
    _e8 = n + 1
  end
  return(string.byte(s, _e8))
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
    local _id56 = ls
    local a = _id56[1]
    local b = _id56[2]
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
  local _i12 = nil
  for _i12 in next, _o10 do
    local x = _o10[_i12]
    local y = f(x)
    if y then
      return(y)
    end
  end
end
function first(f, l)
  local _x366 = l
  local _n13 = _35(_x366)
  local _i13 = 0
  while _i13 < _n13 do
    local x = _x366[_i13 + 1]
    local y = f(x)
    if y then
      return(y)
    end
    _i13 = _i13 + 1
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
  local _x368 = x
  local _n14 = _35(_x368)
  local _i14 = 0
  while _i14 < _n14 do
    local v = _x368[_i14 + 1]
    local y = f(v)
    if is63(y) then
      add(t, y)
    end
    _i14 = _i14 + 1
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
  local _i17 = nil
  for _i17 in next, _o13 do
    local x = _o13[_i17]
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
    if not atom63(l) and l._stash then
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
  local _e9
  if start then
    _e9 = start + 1
  end
  local _start = _e9
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
    local _e10
    if c == "\n" then
      _e10 = "\\n"
    else
      local _e11
      if c == "\"" then
        _e11 = "\\\""
      else
        local _e12
        if c == "\\" then
          _e12 = "\\\\"
        else
          _e12 = c
        end
        _e11 = _e12
      end
      _e10 = _e11
    end
    local c1 = _e10
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
                    local _i21 = nil
                    for _i21 in next, _o17 do
                      local v = _o17[_i21]
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
  local _r146 = unstash({...})
  local _id57 = _r146
  local _keys = cut(_id57, 0)
  if string63(k) then
    local _e13
    if _keys.toplevel then
      _e13 = hd(environment)
    else
      _e13 = last(environment)
    end
    local frame = _e13
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
local math = math
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
  local _o20 = body
  local k = nil
  for k in next, _o20 do
    local v = _o20[k]
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
  local _r157 = unstash({...})
  local _id60 = _r157
  local clauses = cut(_id60, 0)
  local bs = map(function (_x410)
    local _id61 = _x410
    local a = _id61[1]
    local b = _id61[2]
    if nil63(b) then
      return({a})
    else
      return({{"=", {"quote", a}, x}, b})
    end
  end, pair(clauses))
  return(join({"if"}, apply(join, bs)))
end})
setenv("when", {_stash = true, macro = function (cond, ...)
  local _r160 = unstash({...})
  local _id63 = _r160
  local body = cut(_id63, 0)
  return({"if", cond, join({"do"}, body)})
end})
setenv("unless", {_stash = true, macro = function (cond, ...)
  local _r162 = unstash({...})
  local _id65 = _r162
  local body = cut(_id65, 0)
  return({"if", {"not", cond}, join({"do"}, body)})
end})
setenv("obj", {_stash = true, macro = function (...)
  local body = unstash({...})
  return(join({"%object"}, mapo(function (x)
    return(x)
  end, body)))
end})
setenv("let", {_stash = true, macro = function (bs, ...)
  local _r166 = unstash({...})
  local _id69 = _r166
  local body = cut(_id69, 0)
  if atom63(bs) then
    return(join({"let", {bs, hd(body)}}, tl(body)))
  else
    if none63(bs) then
      return(join({"do"}, body))
    else
      local _id70 = bs
      local lh = _id70[1]
      local rh = _id70[2]
      local bs2 = cut(_id70, 2)
      local _id71 = bind(lh, rh)
      local id = _id71[1]
      local val = _id71[2]
      local bs1 = cut(_id71, 2)
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
  local _r168 = unstash({...})
  local _id73 = _r168
  local body = cut(_id73, 0)
  return(join({"let", {x, v}}, body, {x}))
end})
setenv("let-when", {_stash = true, macro = function (x, v, ...)
  local _r170 = unstash({...})
  local _id75 = _r170
  local body = cut(_id75, 0)
  local y = unique("y")
  return({"let", y, v, {"when", y, join({"let", {x, y}}, body)}})
end})
setenv("define-macro", {_stash = true, macro = function (name, args, ...)
  local _r172 = unstash({...})
  local _id77 = _r172
  local body = cut(_id77, 0)
  local _x475 = {"setenv", {"quote", name}}
  _x475.macro = join({"fn", args}, body)
  local form = _x475
  eval(form)
  return(form)
end})
setenv("define-special", {_stash = true, macro = function (name, args, ...)
  local _r174 = unstash({...})
  local _id79 = _r174
  local body = cut(_id79, 0)
  local _x483 = {"setenv", {"quote", name}}
  _x483.special = join({"fn", args}, body)
  local form = join(_x483, keys(body))
  eval(form)
  return(form)
end})
setenv("define-symbol", {_stash = true, macro = function (name, expansion)
  setenv(name, {_stash = true, symbol = expansion})
  local _x489 = {"setenv", {"quote", name}}
  _x489.symbol = {"quote", expansion}
  return(_x489)
end})
setenv("define-reader", {_stash = true, macro = function (_x498, ...)
  local _id82 = _x498
  local _char1 = _id82[1]
  local s = _id82[2]
  local _r178 = unstash({...})
  local _id83 = _r178
  local body = cut(_id83, 0)
  return({"set", {"get", "read-table", _char1}, join({"fn", {s}}, body)})
end})
setenv("define", {_stash = true, macro = function (name, x, ...)
  local _r180 = unstash({...})
  local _id85 = _r180
  local body = cut(_id85, 0)
  setenv(name, {_stash = true, variable = true})
  if some63(body) then
    return(join({"%local-function", name}, bind42(x, body)))
  else
    return({"%local", name, x})
  end
end})
setenv("define-global", {_stash = true, macro = function (name, x, ...)
  local _r182 = unstash({...})
  local _id87 = _r182
  local body = cut(_id87, 0)
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
setenv("with-bindings", {_stash = true, macro = function (_x535, ...)
  local _id90 = _x535
  local names = _id90[1]
  local _r184 = unstash({...})
  local _id91 = _r184
  local body = cut(_id91, 0)
  local x = unique("x")
  local _x539 = {"setenv", x}
  _x539.variable = true
  return(join({"with-frame", {"each", x, names, _x539}}, body))
end})
setenv("let-macro", {_stash = true, macro = function (definitions, ...)
  local _r187 = unstash({...})
  local _id93 = _r187
  local body = cut(_id93, 0)
  add(environment, {})
  map(function (m)
    return(macroexpand(join({"define-macro"}, m)))
  end, definitions)
  local _x545 = join({"do"}, macroexpand(body))
  drop(environment)
  return(_x545)
end})
setenv("let-symbol", {_stash = true, macro = function (expansions, ...)
  local _r191 = unstash({...})
  local _id96 = _r191
  local body = cut(_id96, 0)
  add(environment, {})
  map(function (_x555)
    local _id97 = _x555
    local name = _id97[1]
    local exp = _id97[2]
    return(macroexpand({"define-symbol", name, exp}))
  end, pair(expansions))
  local _x554 = join({"do"}, macroexpand(body))
  drop(environment)
  return(_x554)
end})
setenv("let-unique", {_stash = true, macro = function (names, ...)
  local _r195 = unstash({...})
  local _id99 = _r195
  local body = cut(_id99, 0)
  local bs = map(function (n)
    return({n, {"unique", {"quote", n}}})
  end, names)
  return(join({"let", apply(join, bs)}, body))
end})
setenv("fn", {_stash = true, macro = function (args, ...)
  local _r198 = unstash({...})
  local _id101 = _r198
  local body = cut(_id101, 0)
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
  local _r202 = unstash({...})
  local _id104 = _r202
  local body = cut(_id104, 0)
  local o = unique("o")
  local n = unique("n")
  local i = unique("i")
  local _e17
  if atom63(x) then
    _e17 = {i, x}
  else
    local _e18
    if _35(x) > 1 then
      _e18 = x
    else
      _e18 = {i, hd(x)}
    end
    _e17 = _e18
  end
  local _id105 = _e17
  local k = _id105[1]
  local v = _id105[2]
  local _e19
  if target == "lua" then
    _e19 = body
  else
    _e19 = {join({"let", k, {"if", {"numeric?", k}, {"parseInt", k}, k}}, body)}
  end
  return({"let", {o, t, k, "nil"}, {"%for", o, k, join({"let", {v, {"get", o, k}}}, _e19)}})
end})
setenv("for", {_stash = true, macro = function (i, to, ...)
  local _r204 = unstash({...})
  local _id107 = _r204
  local body = cut(_id107, 0)
  return({"let", i, 0, join({"while", {"<", i, to}}, body, {{"inc", i}})})
end})
setenv("step", {_stash = true, macro = function (v, t, ...)
  local _r206 = unstash({...})
  local _id109 = _r206
  local body = cut(_id109, 0)
  local x = unique("x")
  local n = unique("n")
  local i = unique("i")
  return({"let", {x, t, n, {"#", x}}, {"for", i, n, join({"let", {v, {"at", x, i}}}, body)}})
end})
setenv("set-of", {_stash = true, macro = function (...)
  local xs = unstash({...})
  local l = {}
  local _o22 = xs
  local _i26 = nil
  for _i26 in next, _o22 do
    local x = _o22[_i26]
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
  local _r210 = unstash({...})
  local _id111 = _r210
  local bs = cut(_id111, 0)
  return({"set", a, join({"join", a}, bs)})
end})
setenv("cat!", {_stash = true, macro = function (a, ...)
  local _r212 = unstash({...})
  local _id113 = _r212
  local bs = cut(_id113, 0)
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
    local _o24 = names
    local _i28 = nil
    for _i28 in next, _o24 do
      local k = _o24[_i28]
      x[k] = k
    end
    return({"return", join({"obj"}, x)})
  end
end})
setenv("undefined?", {_stash = true, macro = function (_var)
  if target == "js" then
    return({"=", {"typeof", _var}, "\"undefined\""})
  else
    return({"=", _var, "nil"})
  end
end})
setenv("set-default", {_stash = true, macro = function (_var, val)
  return({"if", {"undefined?", _var}, {"set", _var, val}})
end})
setenv("compile-later", {_stash = true, macro = function (...)
  local forms = unstash({...})
  if _37defer == nil then
    _37defer = {}
  end
  eval(join({"do"}, forms))
  _37defer = join(_37defer, forms)
  return(nil)
end})
setenv("finish-compiling", {_stash = true, special = function ()
  if _37defer == nil then
    _37defer = {}
  end
  local o = ""
  if some63(_37defer) then
    local _x739 = _37defer
    local _n30 = _35(_x739)
    local _i30 = 0
    while _i30 < _n30 do
      local e = _x739[_i30 + 1]
      o = o .. compile(require("compiler").expand(e), {_stash = true, stmt = true})
      _i30 = _i30 + 1
    end
    _37defer = {}
  end
  return(o)
end})
function reload(module)
  package.loaded[module] = nil
  return(require(module))
end

local reader = require("reader")
local compiler = require("compiler")
local system = require("system")
local function eval_print(form)
  local _x = nil
  local _msg = nil
  local _trace = nil
  local _e
  if xpcall(function ()
    _x = compiler.eval(form)
    return(_x)
  end, function (m)
    _msg = clip(m, search(m, ": ") + 2)
    _trace = debug.traceback()
    return(_trace)
  end) then
    _e = {true, _x}
  else
    _e = {false, _msg, _trace}
  end
  local _id = _e
  local ok = _id[1]
  local x = _id[2]
  local trace = _id[3]
  if not ok then
    return(print("error: " .. x .. "\n" .. trace))
  else
    if is63(x) then
      return(print(str(x)))
    end
  end
end
local function rep(s)
  return(eval_print(reader["read-string"](s)))
end
local function repl()
  local buf = ""
  local function rep1(s)
    buf = buf .. s
    local more = {}
    local form = reader["read-string"](buf, more)
    if not( form == more) then
      eval_print(form)
      buf = ""
      return(system.write("> "))
    end
  end
  system.write("> ")
  while true do
    local s = io.read()
    if s then
      rep1(s .. "\n")
    else
      break
    end
  end
end
function compile_file(path)
  local s = reader.stream(system["read-file"](path))
  local body = reader["read-all"](s)
  local form = compiler.expand(join({"do"}, body))
  return(compiler.compile(form, {_stash = true, stmt = true}))
end
function load(path)
  return(compiler.run(compile_file(path)))
end
local function run_file(path)
  return(compiler.run(system["read-file"](path)))
end
local function usage()
  print("usage: elf [options] <object files>")
  print("options:")
  print("  -c <input>\tCompile input file")
  print("  -o <output>\tOutput file")
  print("  -t <target>\tTarget language (default: lua)")
  print("  -e <expr>\tExpression to evaluate")
  return(system.exit())
end
local function main()
  local arg = hd(system.argv)
  if arg == "-h" or arg == "--help" then
    usage()
  end
  local pre = {}
  local input = nil
  local output = nil
  local target1 = nil
  local expr = nil
  local argv = system.argv
  local n = _35(argv)
  local i = 0
  while i < n do
    local a = argv[i + 1]
    if a == "-c" or a == "-o" or a == "-t" or a == "-e" then
      if i == n - 1 then
        print("missing argument for " .. a)
      else
        i = i + 1
        local val = argv[i + 1]
        if a == "-c" then
          input = val
        else
          if a == "-o" then
            output = val
          else
            if a == "-t" then
              target1 = val
            else
              if a == "-e" then
                expr = val
              end
            end
          end
        end
      end
    else
      if not( "-" == char(a, 0)) then
        add(pre, a)
      end
    end
    i = i + 1
  end
  local _x4 = pre
  local _n = _35(_x4)
  local _i = 0
  while _i < _n do
    local file = _x4[_i + 1]
    run_file(file)
    _i = _i + 1
  end
  if nil63(input) then
    if expr then
      return(rep(expr))
    else
      return(repl())
    end
  else
    if target1 then
      target = target1
    end
    local code = compile_file(input)
    if nil63(output) or output == "-" then
      return(print(code))
    else
      return(system["write-file"](output, code))
    end
  end
end
if running42 == nil then
  running42 = false
end
if not running42 then
  running42 = true
  main()
end
