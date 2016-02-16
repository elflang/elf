local function setup()
  setenv("quote", {_stash = true, macro = function (form)
    return(quoted(form))
  end})
  setenv("quasiquote", {_stash = true, macro = function (form)
    return(quasiexpand(form, 1))
  end})
  setenv("at", {_stash = true, macro = function (l, i)
    if target42 == "lua" and type(i) == "number" then
      i = i + 1
    else
      if target42 == "lua" then
        i = {"+", i, 1}
      end
    end
    return({"get", l, i})
  end})
  setenv("wipe", {_stash = true, macro = function (place)
    if target42 == "lua" then
      return({"assign", place, "nil"})
    else
      return({"%delete", place})
    end
  end})
  setenv("list", {_stash = true, macro = function (...)
    local body = unstash({...})
    local x = uniq("x")
    local l = {}
    local forms = {}
    local _l1 = body
    local k = nil
    for k in next, _l1 do
      local v = _l1[k]
      if type(k) == "number" then
        l[k] = v
      else
        add(forms, {"assign", {"get", x, {"quote", k}}, v})
      end
    end
    if #(forms) > 0 then
      return(join({"let", x, join({"%array"}, l)}, forms, {x}))
    else
      return(join({"%array"}, l))
    end
  end})
  setenv("xform", {_stash = true, macro = function (l, body)
    return({"map", {"%fn", {"do", body}}, l})
  end})
  setenv("if", {_stash = true, macro = function (...)
    local branches = unstash({...})
    return(expand_if(branches)[1])
  end})
  setenv("case", {_stash = true, macro = function (x, ...)
    local _r13 = unstash({...})
    local clauses = cut(_r13, 0)
    local e = uniq("e")
    local bs = map(function (_x41)
      local a = _x41[1]
      local b = _x41[2]
      if b == nil then
        return({a})
      else
        return({{"is", a, e}, b})
      end
    end, pair(clauses))
    return({"let", {e, x}, join({"if"}, apply(join, bs))})
  end})
  setenv("when", {_stash = true, macro = function (cond, ...)
    local _r16 = unstash({...})
    local body = cut(_r16, 0)
    return({"if", cond, join({"do"}, body)})
  end})
  setenv("unless", {_stash = true, macro = function (cond, ...)
    local _r18 = unstash({...})
    local body = cut(_r18, 0)
    return({"if", {"not", cond}, join({"do"}, body)})
  end})
  setenv("assert", {_stash = true, macro = function (cond)
    local x = "assert: " .. str(cond)
    return({"unless", cond, {"error", {"quote", x}}})
  end})
  setenv("obj", {_stash = true, macro = function (...)
    local body = unstash({...})
    return(join({"%object"}, mapo(function (_)
      return(_)
    end, body)))
  end})
  setenv("let", {_stash = true, macro = function (bs, ...)
    local _r24 = unstash({...})
    local body = cut(_r24, 0)
    if not( type(bs) == "table") then
      return(join({"let", {bs, body[1]}}, cut(body, 1)))
    else
      if #(bs) == 0 then
        return(join({"do"}, body))
      else
        local lh = bs[1]
        local rh = bs[2]
        local bs2 = cut(bs, 2)
        local _id13 = bind(lh, rh)
        local id = _id13[1]
        local val = _id13[2]
        local bs1 = cut(_id13, 2)
        local renames = {}
        if bound63(id) or toplevel63() then
          local id1 = uniq(id)
          renames = {id, id1}
          id = id1
        else
          setenv(id, {_stash = true, variable = true})
        end
        return({"do", {"%local", id, val}, {"w/sym", renames, join({"let", join(bs1, bs2)}, body)}})
      end
    end
  end})
  setenv("=", {_stash = true, macro = function (...)
    local l = unstash({...})
    local _e7 = #(l)
    if 0 == _e7 then
      return(nil)
    else
      if 1 == _e7 then
        return(join({"="}, l, {"nil"}))
      else
        if 2 == _e7 then
          local lh = l[1]
          local rh = l[2]
          local _id62 = not( type(lh) == "table")
          local _e17
          if _id62 then
            _e17 = _id62
          else
            local _e8 = lh[1]
            local _e18
            if "at" == _e8 then
              _e18 = true
            else
              local _e19
              if "get" == _e8 then
                _e19 = true
              end
              _e18 = _e19
            end
            _e17 = _e18
          end
          if _e17 then
            return({"assign", lh, rh})
          else
            local vars = {}
            local forms = bind(lh, rh, vars)
            return(join({"do"}, map(function (_)
              return({"var", _})
            end, vars), map(function (_x106)
              local id = _x106[1]
              local val = _x106[2]
              return({"=", id, val})
            end, pair(forms))))
          end
        else
          return(join({"do"}, map(function (_)
            return(join({"="}, _))
          end, pair(l))))
        end
      end
    end
  end})
  setenv("with", {_stash = true, macro = function (x, v, ...)
    local _r32 = unstash({...})
    local body = cut(_r32, 0)
    return(join({"let", {x, v}}, body, {x}))
  end})
  setenv("let-when", {_stash = true, macro = function (x, v, ...)
    local _r34 = unstash({...})
    local body = cut(_r34, 0)
    local y = uniq("y")
    return({"let", y, v, {"when", y, join({"let", {x, y}}, body)}})
  end})
  setenv("mac", {_stash = true, macro = function (name, args, ...)
    local _r36 = unstash({...})
    local body = cut(_r36, 0)
    local _x133 = {"setenv", {"quote", name}}
    _x133.macro = join({"fn", args}, body)
    local form = _x133
    eval(form)
    return(form)
  end})
  setenv("defspecial", {_stash = true, macro = function (name, args, ...)
    local _r38 = unstash({...})
    local body = cut(_r38, 0)
    local _x141 = {"setenv", {"quote", name}}
    _x141.special = join({"fn", args}, body)
    local form = join(_x141, keys(body))
    eval(form)
    return(form)
  end})
  setenv("defsym", {_stash = true, macro = function (name, expansion)
    setenv(name, {_stash = true, symbol = expansion})
    local _x147 = {"setenv", {"quote", name}}
    _x147.symbol = {"quote", expansion}
    return(_x147)
  end})
  setenv("var", {_stash = true, macro = function (name, x, ...)
    local _r42 = unstash({...})
    local body = cut(_r42, 0)
    setenv(name, {_stash = true, variable = true})
    if #(body) > 0 then
      return(join({"%local-function", name}, bind42(x, body)))
    else
      return({"%local", name, x})
    end
  end})
  setenv("def", {_stash = true, macro = function (name, x, ...)
    local _r44 = unstash({...})
    local body = cut(_r44, 0)
    setenv(name, {_stash = true, toplevel = true, variable = true})
    if #(body) > 0 then
      return(join({"%global-function", name}, bind42(x, body)))
    else
      return({"=", name, x})
    end
  end})
  setenv("w/frame", {_stash = true, macro = function (...)
    local body = unstash({...})
    local x = uniq("x")
    return({"do", {"add", "environment*", {"obj"}}, {"with", x, join({"do"}, body), {"drop", "environment*"}}})
  end})
  setenv("w/bindings", {_stash = true, macro = function (_x181, ...)
    local names = _x181[1]
    local _r46 = unstash({...})
    local body = cut(_r46, 0)
    local x = uniq("x")
    local _x185 = {"setenv", x}
    _x185.variable = true
    return(join({"w/frame", {"each", x, names, _x185}}, body))
  end})
  setenv("w/mac", {_stash = true, macro = function (name, args, definition, ...)
    local _r48 = unstash({...})
    local body = cut(_r48, 0)
    add(environment42, {})
    macroexpand({"mac", name, args, definition})
    local _x191 = join({"do"}, macroexpand(body))
    drop(environment42)
    return(_x191)
  end})
  setenv("w/sym", {_stash = true, macro = function (expansions, ...)
    local _r51 = unstash({...})
    local body = cut(_r51, 0)
    if not( type(expansions) == "table") then
      return(join({"w/sym", {expansions, body[1]}}, cut(body, 1)))
    else
      add(environment42, {})
      map(function (_x205)
        local name = _x205[1]
        local exp = _x205[2]
        return(macroexpand({"defsym", name, exp}))
      end, pair(expansions))
      local _x204 = join({"do"}, macroexpand(body))
      drop(environment42)
      return(_x204)
    end
  end})
  setenv("w/uniq", {_stash = true, macro = function (names, ...)
    local _r55 = unstash({...})
    local body = cut(_r55, 0)
    local _e20
    if type(names) == "table" then
      _e20 = names
    else
      _e20 = {names}
    end
    return(join({"let", apply(join, map(function (_)
      return({_, {"uniq", {"quote", _}}})
    end, _e20))}, body))
  end})
  setenv("fn", {_stash = true, macro = function (args, ...)
    local _r58 = unstash({...})
    local body = cut(_r58, 0)
    return(join({"%function"}, bind42(args, body)))
  end})
  setenv("guard", {_stash = true, macro = function (expr)
    if target42 == "js" then
      return({{"%fn", {"%try", {"list", true, expr}}}})
    else
      local x = uniq("x")
      local msg = uniq("msg")
      local trace = uniq("trace")
      return({"let", {x, "nil", msg, "nil", trace, "nil"}, {"if", {"xpcall", {"%fn", {"=", x, expr}}, {"%fn", {"do", {"=", msg, {"clip", "_", {"+", {"search", "_", "\": \""}, 2}}}, {"=", trace, {{"get", "debug", {"quote", "traceback"}}}}}}}, {"list", true, x}, {"list", false, msg, trace}}})
    end
  end})
  setenv("each", {_stash = true, macro = function (x, t, ...)
    local _r62 = unstash({...})
    local body = cut(_r62, 0)
    local l = uniq("l")
    local n = uniq("n")
    local i = uniq("i")
    local _e21
    if not( type(x) == "table") then
      _e21 = {i, x}
    else
      local _e22
      if #(x) > 1 then
        _e22 = x
      else
        _e22 = {i, x[1]}
      end
      _e21 = _e22
    end
    local _id48 = _e21
    local k = _id48[1]
    local v = _id48[2]
    local _e23
    if target42 == "lua" then
      _e23 = body
    else
      _e23 = {join({"let", k, {"if", {"numeric?", k}, {"parseInt", k}, k}}, body)}
    end
    return({"let", {l, t, k, "nil"}, {"%for", l, k, join({"let", {v, {"get", l, k}}}, _e23)}})
  end})
  setenv("for", {_stash = true, macro = function (i, ...)
    local _r64 = unstash({...})
    local body = cut(_r64, 0)
    local from = 0
    local to = 0
    local increment = 1
    if not( type(i) == "table") then
      to = body[1]
      body = cut(body, 1)
    else
      local _id52
      _id52 = i
      i = _id52[1]
      from = _id52[2]
      to = _id52[3]
      local _e24
      if _id52[4] == nil then
        _e24 = 1
      else
        _e24 = _id52[4]
      end
      increment = _e24
    end
    if not( type(increment) == "number") then
      error("assert: (\"number?\" \"increment\")")
    end
    if increment > 0 then
      return({"let", {i, from}, join({"while", {"<", i, to}}, body, {{"++", i, increment}})})
    else
      return({"let", {i, {"-", to, 1}}, join({"while", {">=", i, from}}, body, {{"--", i, - increment}})})
    end
  end})
  setenv("step", {_stash = true, macro = function (v, t, ...)
    local _r66 = unstash({...})
    local body = cut(_r66, 0)
    local x = uniq("x")
    local n = uniq("n")
    local i = uniq("i")
    return({"let", {x, t, n, {"#", x}}, {"for", i, n, join({"let", {v, {"at", x, i}}}, body)}})
  end})
  setenv("set-of", {_stash = true, macro = function (...)
    local xs = unstash({...})
    local l = {}
    local _l3 = xs
    local _i3 = nil
    for _i3 in next, _l3 do
      local x = _l3[_i3]
      l[x] = true
    end
    return(join({"obj"}, l))
  end})
  setenv("language", {_stash = true, macro = function ()
    return({"quote", target42})
  end})
  setenv("target", {_stash = true, macro = function (...)
    local clauses = unstash({...})
    return(clauses[target42])
  end})
  setenv("join!", {_stash = true, macro = function (a, ...)
    local _r70 = unstash({...})
    local bs = cut(_r70, 0)
    return({"=", a, join({"join", a}, bs)})
  end})
  setenv("cat!", {_stash = true, macro = function (a, ...)
    local _r72 = unstash({...})
    local bs = cut(_r72, 0)
    return({"=", a, join({"cat", a}, bs)})
  end})
  setenv("++", {_stash = true, macro = function (n, by)
    return({"=", n, {"+", n, by or 1}})
  end})
  setenv("--", {_stash = true, macro = function (n, by)
    return({"=", n, {"-", n, by or 1}})
  end})
  setenv("export", {_stash = true, macro = function (...)
    local names = unstash({...})
    if target42 == "js" then
      return(join({"do"}, map(function (_)
        return({"=", {"get", "exports", {"quote", _}}, _})
      end, names)))
    else
      local x = {}
      local _l5 = names
      local _i5 = nil
      for _i5 in next, _l5 do
        local k = _l5[_i5]
        x[k] = k
      end
      return({"return", join({"obj"}, x)})
    end
  end})
  setenv("undef?", {_stash = true, macro = function (_var)
    if target42 == "js" then
      return({"is", {"typeof", _var}, "\"undefined\""})
    else
      return({"is", _var, "nil"})
    end
  end})
  setenv("%js", {_stash = true, macro = function (...)
    local forms = unstash({...})
    if target42 == "js" then
      return(join({"do"}, forms))
    end
  end})
  setenv("%lua", {_stash = true, macro = function (...)
    local forms = unstash({...})
    if target42 == "lua" then
      return(join({"do"}, forms))
    end
  end})
  setenv("%compile-time", {_stash = true, macro = function (...)
    local forms = unstash({...})
    eval(join({"do"}, forms))
    return(nil)
  end})
  setenv("once", {_stash = true, macro = function (...)
    local forms = unstash({...})
    local x = uniq("x")
    return(join({"when", {"undef?", x}, {"=", x, true}}, forms))
  end})
  setenv("elf", {_stash = true, macro = function ()
    return({"require", {"quote", "elf"}})
  end})
  setenv("lib", {_stash = true, macro = function (...)
    local modules = unstash({...})
    return(join({"do"}, map(function (_)
      return({"def", _, {"require", {"quote", _}}})
    end, modules)))
  end})
  setenv("use", {_stash = true, macro = function (...)
    local modules = unstash({...})
    return(join({"do"}, map(function (_)
      return({"var", _, {"require", {"quote", _}}})
    end, modules)))
  end})
  setenv("nil?", {_stash = true, macro = function (x)
    local _x446 = {"target"}
    _x446.lua = {"is", x, "nil"}
    local _e25
    if not( type(x) == "table") then
      _e25 = {"let", join(), {"or", {"is", {"typeof", x}, "\"undefined\""}, {"is", x, "null"}}}
    else
      _e25 = {"let", {"x", x}, {"nil?", "x"}}
    end
    _x446.js = _e25
    return(_x446)
  end})
  setenv("%len", {_stash = true, special = function (x)
    return("#(" .. compile(x) .. ")")
  end})
  setenv("#", {_stash = true, macro = function (x)
    local _x461 = {"target"}
    _x461.lua = {"%len", x}
    _x461.js = {"or", {"get", x, {"quote", "length"}}, 0}
    return(_x461)
  end})
  setenv("none?", {_stash = true, macro = function (x)
    return({"is", {"#", x}, 0})
  end})
  setenv("some?", {_stash = true, macro = function (x)
    return({">", {"#", x}, 0})
  end})
  setenv("one?", {_stash = true, macro = function (x)
    return({"is", {"#", x}, 1})
  end})
  setenv("two?", {_stash = true, macro = function (x)
    return({"is", {"#", x}, 2})
  end})
  setenv("hd", {_stash = true, macro = function (l)
    return({"at", l, 0})
  end})
  setenv("tl", {_stash = true, macro = function (l)
    return({"cut", l, 1})
  end})
  setenv("type", {_stash = true, macro = function (x)
    local _x490 = {"target"}
    _x490.lua = {{"do", "type"}, x}
    _x490.js = {"typeof", x}
    return(_x490)
  end})
  setenv("string?", {_stash = true, macro = function (x)
    return({"is", {"type", x}, {"quote", "string"}})
  end})
  setenv("number?", {_stash = true, macro = function (x)
    return({"is", {"type", x}, {"quote", "number"}})
  end})
  setenv("boolean?", {_stash = true, macro = function (x)
    return({"is", {"type", x}, {"quote", "boolean"}})
  end})
  setenv("function?", {_stash = true, macro = function (x)
    return({"is", {"type", x}, {"quote", "function"}})
  end})
  setenv("table?", {_stash = true, macro = function (x)
    local _x525 = {"target"}
    _x525.lua = {"quote", "table"}
    _x525.js = {"quote", "object"}
    return({"is", {"type", x}, _x525})
  end})
  setenv("atom?", {_stash = true, macro = function (x)
    return({"~table?", x})
  end})
  setenv("listify", {_stash = true, macro = function (x)
    if not not( type(x) == "table") then
      error("assert: (\"atom?\" \"x\")")
    end
    return({"if", {"table?", x}, x, {"list", x}})
  end})
  return(nil)
end
if _x536 == nil then
  _x536 = true
  environment42 = {{}}
  target42 = "lua"
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
  if from == nil then
    from = 0
  end
  if upto == nil then
    upto = #(x)
  end
  local l = {}
  local j = 0
  local to = min(#(x), upto)
  local i = max(0, from)
  while i < to do
    l[j + 1] = x[i + 1]
    j = j + 1
    i = i + 1
  end
  local _l6 = x
  local k = nil
  for k in next, _l6 do
    local v = _l6[k]
    if not( type(k) == "number") then
      l[k] = v
    end
  end
  return(l)
end
function keys(x)
  local t = {}
  local _l7 = x
  local k = nil
  for k in next, _l7 do
    local v = _l7[k]
    if not( type(k) == "number") then
      t[k] = v
    end
  end
  return(t)
end
function edge(x)
  return(#(x) - 1)
end
function inner(x)
  return(clip(x, 1, edge(x)))
end
function char(s, n)
  return(clip(s, n, n + 1))
end
function code(s, n)
  local _e26
  if n then
    _e26 = n + 1
  end
  return(string.byte(s, _e26))
end
function chr(c)
  return(string.char(c))
end
function string_literal63(x)
  return(type(x) == "string" and char(x, 0) == "\"")
end
function id_literal63(x)
  return(type(x) == "string" and char(x, 0) == "|")
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
  local i = #(l) - 1
  while i >= 0 do
    add(l1, l[i + 1])
    i = i - 1
  end
  return(l1)
end
function reduce(f, x)
  if #(x) == 0 then
    return(nil)
  else
    if #(x) == 1 then
      return(x[1])
    else
      return(f(x[1], reduce(f, cut(x, 1))))
    end
  end
end
function join(...)
  local ls = unstash({...})
  if #(ls) == 2 then
    local a = ls[1]
    local b = ls[2]
    if a and b then
      local c = {}
      local o = #(a)
      local _l8 = a
      local k = nil
      for k in next, _l8 do
        local v = _l8[k]
        c[k] = v
      end
      local _l9 = b
      local k = nil
      for k in next, _l9 do
        local v = _l9[k]
        if type(k) == "number" then
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
  local _l10 = t
  local _i10 = nil
  for _i10 in next, _l10 do
    local x = _l10[_i10]
    local y = f(x)
    if y then
      return(y)
    end
  end
end
function ontree(f, t, ...)
  local _r140 = unstash({...})
  local skip = _r140.skip
  if not( skip and skip(t)) then
    local y = f(t)
    if y then
      return(y)
    end
    if not not( type(t) == "table") then
      local _l11 = t
      local _i11 = nil
      for _i11 in next, _l11 do
        local x = _l11[_i11]
        local _y = ontree(f, x, {_stash = true, skip = skip})
        if _y then
          return(_y)
        end
      end
    end
  end
end
function hd_is63(l, val)
  return(not not( type(l) == "table") and l[1] == val)
end
function first(f, l)
  local _x540 = l
  local _n12 = #(_x540)
  local _i12 = 0
  while _i12 < _n12 do
    local x = _x540[_i12 + 1]
    local y = f(x)
    if y then
      return(y)
    end
    _i12 = _i12 + 1
  end
end
function in63(x, t)
  return(find(function (_)
    return(x == _)
  end, t))
end
function pair(l)
  local l1 = {}
  local i = 0
  while i < #(l) do
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
  local _x542 = x
  local _n13 = #(_x542)
  local _i13 = 0
  while _i13 < _n13 do
    local v = _x542[_i13 + 1]
    local y = f(v)
    if not( y == nil) then
      add(t, y)
    end
    _i13 = _i13 + 1
  end
  local _l12 = x
  local k = nil
  for k in next, _l12 do
    local v = _l12[k]
    if not( type(k) == "number") then
      local y = f(v)
      if not( y == nil) then
        t[k] = y
      end
    end
  end
  return(t)
end
function keep(f, x)
  return(map(function (_)
    if f(_) then
      return(_)
    end
  end, x))
end
function keys63(t)
  local _l13 = t
  local k = nil
  for k in next, _l13 do
    local v = _l13[k]
    if not( type(k) == "number") then
      return(true)
    end
  end
  return(false)
end
function empty63(t)
  local _l14 = t
  local _i16 = nil
  for _i16 in next, _l14 do
    local x = _l14[_i16]
    return(false)
  end
  return(true)
end
function stash(args)
  if keys63(args) then
    local p = {}
    local _l15 = args
    local k = nil
    for k in next, _l15 do
      local v = _l15[k]
      if not( type(k) == "number") then
        p[k] = v
      end
    end
    p._stash = true
    add(args, p)
  end
  return(args)
end
function unstash(args)
  if #(args) == 0 then
    return({})
  else
    local l = last(args)
    if not not( type(l) == "table") and l._stash then
      local args1 = almost(args)
      local _l16 = l
      local k = nil
      for k in next, _l16 do
        local v = _l16[k]
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
  local _e27
  if start then
    _e27 = start + 1
  end
  local _start = _e27
  local i = string.find(s, pattern, _start, true)
  return(i and i - 1)
end
function split(s, sep)
  if s == "" or sep == "" then
    return({})
  else
    local l = {}
    local n = #(sep)
    while true do
      local i = search(s, sep)
      if i == nil then
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
  return(reduce(function (_0, _1)
    return(_0 .. _1)
  end, xs) or "")
end
function _43(...)
  local xs = unstash({...})
  return(reduce(function (_0, _1)
    return(_0 + _1)
  end, xs) or 0)
end
function _(...)
  local xs = unstash({...})
  return(reduce(function (_0, _1)
    return(_1 - _0)
  end, reverse(xs)) or 0)
end
function _42(...)
  local xs = unstash({...})
  return(reduce(function (_0, _1)
    return(_0 * _1)
  end, xs) or 1)
end
function _47(...)
  local xs = unstash({...})
  return(reduce(function (_0, _1)
    return(_1 / _0)
  end, reverse(xs)) or 1)
end
function _37(...)
  local xs = unstash({...})
  return(reduce(function (_0, _1)
    return(_1 % _0)
  end, reverse(xs)) or 1)
end
function _62(a, b)
  return(a > b)
end
function _60(a, b)
  return(a < b)
end
function is(a, b)
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
  local n = #(s)
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
  while i < #(s) do
    local c = char(s, i)
    local _e28
    if c == "\n" then
      _e28 = "\\n"
    else
      local _e29
      if c == "\"" then
        _e29 = "\\\""
      else
        local _e30
        if c == "\\" then
          _e30 = "\\\\"
        else
          _e30 = c
        end
        _e29 = _e30
      end
      _e28 = _e29
    end
    local c1 = _e28
    s1 = s1 .. c1
    i = i + 1
  end
  return(s1 .. "\"")
end
function str(x, depth, stack)
  if stack == nil then
    stack = {}
  end
  if in63(x, stack) then
    return("circular")
  else
    if x == nil then
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
            if type(x) == "boolean" then
              if x then
                return("true")
              else
                return("false")
              end
            else
              if type(x) == "string" then
                return(escape(x))
              else
                if type(x) == "function" then
                  return("fn")
                else
                  if not not( type(x) == "table") then
                    local s = "("
                    local sp = ""
                    local xs = {}
                    local ks = {}
                    local d = (depth or 0) + 1
                    add(stack, x)
                    local _l17 = x
                    local k = nil
                    for k in next, _l17 do
                      local v = _l17[k]
                      if type(k) == "number" then
                        xs[k] = str(v, d, stack)
                      else
                        add(ks, k .. ":")
                        add(ks, str(v, d, stack))
                      end
                    end
                    drop(stack)
                    local _l18 = join(xs, ks)
                    local _i20 = nil
                    for _i20 in next, _l18 do
                      local v = _l18[_i20]
                      s = s .. sp .. v
                      sp = " "
                    end
                    return(s .. ")")
                  else
                    return(escape(tostring(x)))
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
function toplevel63()
  return(#(environment42) == 1)
end
function setenv(k, ...)
  local _r174 = unstash({...})
  local _keys = cut(_r174, 0)
  if type(k) == "string" then
    local _e31
    if _keys.toplevel then
      _e31 = environment42[1]
    else
      _e31 = last(environment42)
    end
    local frame = _e31
    local entry = frame[k] or {}
    local _l19 = _keys
    local _k = nil
    for _k in next, _l19 do
      local v = _l19[_k]
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
