local function setup()
  setenv("t", {_stash = true, symbol = true})
  setenv("lua?", {_stash = true, symbol = {"is", "target*", {"quote", "lua"}}})
  setenv("js?", {_stash = true, symbol = {"is", "target*", {"quote", "js"}}})
  setenv("quote", {_stash = true, macro = function (form)
    return(quoted(form))
  end})
  setenv("quasiquote", {_stash = true, macro = function (form)
    return(quasiexpand(form, 1))
  end})
  setenv("at", {_stash = true, macro = function (l, i)
    if type(i) == "number" and i < 0 then
      if type(l) == "table" then
        return({"let", {"l", l}, {"at", "l", i}})
      end
      local _e19
      if i == -1 then
        _e19 = {"edge", l}
      else
        _e19 = {"+", {"len", l}, i}
      end
      i = _e19
    end
    if target42 == "lua" then
      local _e20
      if type(i) == "number" then
        _e20 = i + 1
      else
        _e20 = {"+", i, 1}
      end
      i = _e20
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
    local bs = map(function (_x57)
      local a = _x57[1]
      local b = _x57[2]
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
    local _e9 = #(l)
    if 0 == _e9 then
      return(nil)
    else
      if 1 == _e9 then
        return(join({"="}, l, {"nil"}))
      else
        if 2 == _e9 then
          local lh = l[1]
          local rh = l[2]
          local _id64 = not( type(lh) == "table")
          local _e23
          if _id64 then
            _e23 = _id64
          else
            local _e10 = lh[1]
            local _e24
            if "at" == _e10 then
              _e24 = true
            else
              local _e25
              if "get" == _e10 then
                _e25 = true
              end
              _e24 = _e25
            end
            _e23 = _e24
          end
          if _e23 then
            return({"assign", lh, rh})
          else
            local vars = {}
            local forms = bind(lh, rh, vars)
            return(join({"do"}, map(function (_)
              return({"var", _})
            end, vars), map(function (_x122)
              local id = _x122[1]
              local val = _x122[2]
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
  setenv("whenlet", {_stash = true, macro = function (x, v, ...)
    local _r34 = unstash({...})
    local body = cut(_r34, 0)
    local y = uniq("y")
    return({"let", y, v, {"when", y, join({"let", {x, y}}, body)}})
  end})
  setenv("mac", {_stash = true, macro = function (name, args, ...)
    local _r36 = unstash({...})
    local body = cut(_r36, 0)
    local _x149 = {"setenv", {"quote", name}}
    _x149.macro = join({"fn", args}, body)
    local form = _x149
    eval(form)
    return(form)
  end})
  setenv("defspecial", {_stash = true, macro = function (name, args, ...)
    local _r38 = unstash({...})
    local body = cut(_r38, 0)
    local _x157 = {"setenv", {"quote", name}}
    _x157.special = join({"fn", args}, body)
    local form = join(_x157, keys(body))
    eval(form)
    return(form)
  end})
  setenv("defsym", {_stash = true, macro = function (name, expansion)
    setenv(name, {_stash = true, symbol = expansion})
    local _x163 = {"setenv", {"quote", name}}
    _x163.symbol = {"quote", expansion}
    return(_x163)
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
  setenv("w/bindings", {_stash = true, macro = function (_x197, ...)
    local names = _x197[1]
    local _r46 = unstash({...})
    local body = cut(_r46, 0)
    local x = uniq("x")
    local _x201 = {"setenv", x}
    _x201.variable = true
    return(join({"w/frame", {"each", x, names, _x201}}, body))
  end})
  setenv("w/mac", {_stash = true, macro = function (name, args, definition, ...)
    local _r48 = unstash({...})
    local body = cut(_r48, 0)
    add(environment42, {})
    macroexpand({"mac", name, args, definition})
    local _x207 = join({"do"}, macroexpand(body))
    drop(environment42)
    return(_x207)
  end})
  setenv("w/sym", {_stash = true, macro = function (expansions, ...)
    local _r51 = unstash({...})
    local body = cut(_r51, 0)
    if not( type(expansions) == "table") then
      return(join({"w/sym", {expansions, body[1]}}, cut(body, 1)))
    else
      add(environment42, {})
      map(function (_x221)
        local name = _x221[1]
        local exp = _x221[2]
        return(macroexpand({"defsym", name, exp}))
      end, pair(expansions))
      local _x220 = join({"do"}, macroexpand(body))
      drop(environment42)
      return(_x220)
    end
  end})
  setenv("w/uniq", {_stash = true, macro = function (names, ...)
    local _r55 = unstash({...})
    local body = cut(_r55, 0)
    local _e26
    if type(names) == "table" then
      _e26 = names
    else
      _e26 = {names}
    end
    return(join({"let", apply(join, map(function (_)
      return({_, {"uniq", {"quote", _}}})
    end, _e26))}, body))
  end})
  setenv("fn", {_stash = true, macro = function (args, ...)
    local _r58 = unstash({...})
    local body = cut(_r58, 0)
    return(join({"%function"}, bind42(args, body)))
  end})
  setenv("guard", {_stash = true, macro = function (expr)
    if target42 == "js" then
      return({{"%fn", {"%try", {"list", "t", expr}}}})
    else
      local x = uniq("x")
      local msg = uniq("msg")
      local trace = uniq("trace")
      return({"let", {x, "nil", msg, "nil", trace, "nil"}, {"if", {"xpcall", {"%fn", {"=", x, expr}}, {"%fn", {"do", {"=", msg, {"clip", "_", {"+", {"search", "_", "\": \""}, 2}}}, {"=", trace, {{"get", "debug", {"quote", "traceback"}}}}}}}, {"list", "t", x}, {"list", false, msg, trace}}})
    end
  end})
  setenv("each", {_stash = true, macro = function (x, lst, ...)
    local _r62 = unstash({...})
    local body = cut(_r62, 0)
    local l = uniq("l")
    local n = uniq("n")
    local i = uniq("i")
    local _e27
    if not( type(x) == "table") then
      _e27 = {i, x}
    else
      local _e28
      if #(x) > 1 then
        _e28 = x
      else
        _e28 = {i, x[1]}
      end
      _e27 = _e28
    end
    local _id48 = _e27
    local k = _id48[1]
    local v = _id48[2]
    local _e29
    if target42 == "lua" then
      _e29 = body
    else
      _e29 = {join({"let", k, {"if", {"numeric?", k}, {"parseInt", k}, k}}, body)}
    end
    return({"let", {l, lst, k, "nil"}, {"%for", l, k, join({"let", {v, {"get", l, k}}}, _e29)}})
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
      local _e30
      if _id52[4] == nil then
        _e30 = 1
      else
        _e30 = _id52[4]
      end
      increment = _e30
    end
    if not( type(increment) == "number") then
      error("assert: (\"num?\" \"increment\")")
    end
    if increment > 0 then
      return({"let", {i, from}, join({"while", {"<", i, to}}, body, {{"++", i, increment}})})
    else
      return({"let", {i, {"-", to, 1}}, join({"while", {">=", i, from}}, body, {{"--", i, - increment}})})
    end
  end})
  setenv("step", {_stash = true, macro = function (v, l, ...)
    local _r66 = unstash({...})
    local body = cut(_r66, 0)
    local x = uniq("x")
    local n = uniq("n")
    local i = uniq("i")
    return({"let", {x, l, n, {"len", x}}, {"for", i, n, join({"let", {v, {"at", x, i}}}, body)}})
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
    return(join({"when", {"nil?", x}, {"=", x, "t"}}, forms))
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
    local _x455 = {"target"}
    _x455.lua = {"is", x, "nil"}
    local _e31
    if not( type(x) == "table") then
      _e31 = {"or", {"is", {"typeof", x}, "\"undefined\""}, {"is", x, "null"}}
    else
      _e31 = {"let", {"x", x}, {"nil?", "x"}}
    end
    _x455.js = _e31
    return(_x455)
  end})
  setenv("%len", {_stash = true, special = function (x)
    return("#(" .. compile(x) .. ")")
  end})
  setenv("len", {_stash = true, macro = function (x)
    local _x469 = {"target"}
    _x469.lua = {"%len", x}
    _x469.js = {"or", {"get", x, {"quote", "length"}}, 0}
    return(_x469)
  end})
  setenv("none?", {_stash = true, macro = function (x)
    return({"is", {"len", x}, 0})
  end})
  setenv("some?", {_stash = true, macro = function (x)
    return({">", {"len", x}, 0})
  end})
  setenv("one?", {_stash = true, macro = function (x)
    return({"is", {"len", x}, 1})
  end})
  setenv("two?", {_stash = true, macro = function (x)
    return({"is", {"len", x}, 2})
  end})
  setenv("hd", {_stash = true, macro = function (l)
    return({"at", l, 0})
  end})
  setenv("tl", {_stash = true, macro = function (l)
    return({"cut", l, 1})
  end})
  setenv("type", {_stash = true, macro = function (x)
    local _x498 = {"target"}
    _x498.lua = {{"do", "type"}, x}
    _x498.js = {"typeof", x}
    return(_x498)
  end})
  setenv("str?", {_stash = true, macro = function (x)
    return({"is", {"type", x}, {"quote", "string"}})
  end})
  setenv("num?", {_stash = true, macro = function (x)
    return({"is", {"type", x}, {"quote", "number"}})
  end})
  setenv("bool?", {_stash = true, macro = function (x)
    return({"is", {"type", x}, {"quote", "boolean"}})
  end})
  setenv("fn?", {_stash = true, macro = function (x)
    return({"is", {"type", x}, {"quote", "function"}})
  end})
  setenv("list?", {_stash = true, macro = function (x)
    local _x533 = {"target"}
    _x533.lua = {"quote", "table"}
    _x533.js = {"quote", "object"}
    return({"is", {"type", x}, _x533})
  end})
  setenv("atom?", {_stash = true, macro = function (x)
    return({"~list?", x})
  end})
  setenv("1eval!", {_stash = true, macro = function (...)
    local bs = unstash({...})
    local function rebind63(xs)
      local e = map(function (_)
        return({"list?", _})
      end, xs)
      if #(xs) == 1 then
        return(e[1])
      else
        return(join({"or"}, e))
      end
    end
    local function rebind(xs, name, args)
      local e = {}
      local _e32
      if type(xs) == "table" then
        _e32 = xs
      else
        _e32 = {xs}
      end
      local _x556 = _e32
      local _n7 = #(_x556)
      local _i7 = 0
      while _i7 < _n7 do
        local x = _x556[_i7 + 1]
        add(e, {"quote", x})
        add(e, x)
        _i7 = _i7 + 1
      end
      return({"list", {"quote", "let"}, join({"list"}, e), join({"list", {"quote", name}}, map(function (_)
        if in63(_, e) then
          return({"quote", _})
        else
          return(_)
        end
      end, args))})
    end
    local _id60 = last(bs)
    local macro = _id60[1]
    local args = cut(_id60, 1)
    local _e33
    if almost(bs) == nil then
      _e33 = {args[1]}
    else
      _e33 = almost(bs)
    end
    local which = _e33
    return({"when", rebind63(which), {"return", rebind(which, macro, args)}})
  end})
  setenv("listify", {_stash = true, macro = function (x)
    if type(x) == "table" then
      return({"let", {"x", x}, {"listify", "x"}})
    end
    return({"if", {"list?", x}, x, {"list", x}})
  end})
  return(nil)
end
if _x580 == nil then
  _x580 = true
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
  local l = {}
  local _l7 = x
  local k = nil
  for k in next, _l7 do
    local v = _l7[k]
    if not( type(k) == "number") then
      l[k] = v
    end
  end
  return(l)
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
  local _e34
  if n then
    _e34 = n + 1
  end
  return(string.byte(s, _e34))
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
function rev(l)
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
function find(f, l)
  local _l10 = l
  local _i12 = nil
  for _i12 in next, _l10 do
    local x = _l10[_i12]
    local y = f(x)
    if y then
      return(y)
    end
  end
end
function ontree(f, l, ...)
  local _r146 = unstash({...})
  local skip = _r146.skip
  if not( skip and skip(l)) then
    local y = f(l)
    if y then
      return(y)
    end
    if not not( type(l) == "table") then
      local _l11 = l
      local _i13 = nil
      for _i13 in next, _l11 do
        local x = _l11[_i13]
        local _y = ontree(f, x, {_stash = true, skip = skip})
        if _y then
          return(_y)
        end
      end
    end
  end
end
function hd_is63(l, val)
  return(type(l) == "table" and l[1] == val)
end
function first(f, l)
  local _x584 = l
  local _n14 = #(_x584)
  local _i14 = 0
  while _i14 < _n14 do
    local x = _x584[_i14 + 1]
    local y = f(x)
    if y then
      return(y)
    end
    _i14 = _i14 + 1
  end
end
function in63(x, l)
  return(find(function (_)
    return(x == _)
  end, l))
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
  local l = {}
  local _x586 = x
  local _n15 = #(_x586)
  local _i15 = 0
  while _i15 < _n15 do
    local v = _x586[_i15 + 1]
    local y = f(v)
    if not( y == nil) then
      add(l, y)
    end
    _i15 = _i15 + 1
  end
  local _l12 = x
  local k = nil
  for k in next, _l12 do
    local v = _l12[k]
    if not( type(k) == "number") then
      local y = f(v)
      if not( y == nil) then
        l[k] = y
      end
    end
  end
  return(l)
end
function keep(f, x)
  return(map(function (_)
    if f(_) then
      return(_)
    end
  end, x))
end
function keys63(l)
  local _l13 = l
  local k = nil
  for k in next, _l13 do
    local v = _l13[k]
    if not( type(k) == "number") then
      return(true)
    end
  end
  return(false)
end
function empty63(l)
  local _l14 = l
  local _i18 = nil
  for _i18 in next, _l14 do
    local x = _l14[_i18]
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
    if type(l) == "table" and l._stash then
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
  local _e35
  if start then
    _e35 = start + 1
  end
  local _start = _e35
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
  end, rev(xs)) or 0)
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
  end, rev(xs)) or 1)
end
function _37(...)
  local xs = unstash({...})
  return(reduce(function (_0, _1)
    return(_1 % _0)
  end, rev(xs)) or 1)
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
    local _e36
    if c == "\n" then
      _e36 = "\\n"
    else
      local _e37
      if c == "\"" then
        _e37 = "\\\""
      else
        local _e38
        if c == "\\" then
          _e38 = "\\\\"
        else
          _e38 = c
        end
        _e37 = _e38
      end
      _e36 = _e37
    end
    local c1 = _e36
    s1 = s1 .. c1
    i = i + 1
  end
  return(s1 .. "\"")
end
function str(x, stack)
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
          if type(x) == "number" then
            return(tostring(x))
          else
            if type(x) == "boolean" then
              if x then
                return("t")
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
                  if type(x) == "table" then
                    if stack and in63(x, stack) then
                      return("circular")
                    else
                      local s = "("
                      local sp = ""
                      local fs = {}
                      local xs = {}
                      local ks = {}
                      stack = stack or {}
                      add(stack, x)
                      local _l17 = x
                      local k = nil
                      for k in next, _l17 do
                        local v = _l17[k]
                        if type(k) == "number" then
                          xs[k] = str(v, stack)
                        else
                          if type(v) == "function" then
                            add(fs, k)
                          else
                            add(ks, k .. ":")
                            add(ks, str(v, stack))
                          end
                        end
                      end
                      drop(stack)
                      local _l18 = join(sort(fs), xs, ks)
                      local _i22 = nil
                      for _i22 in next, _l18 do
                        local v = _l18[_i22]
                        s = s .. sp .. v
                        sp = " "
                      end
                      return(s .. ")")
                    end
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
  local _r180 = unstash({...})
  local _keys = cut(_r180, 0)
  if type(k) == "string" then
    local _e39
    if _keys.toplevel then
      _e39 = environment42[1]
    else
      _e39 = last(environment42)
    end
    local frame = _e39
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
