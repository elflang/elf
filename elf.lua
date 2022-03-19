local function setup()
  setenv("t", stash33({["symbol"] = true}))
  setenv("js?", stash33({["symbol"] = {"is", "target*", {"quote", "js"}}}))
  setenv("lua?", stash33({["symbol"] = {"is", "target*", {"quote", "lua"}}}))
  local _x4 = {"target"}
  _x4.lua = "_G"
  _x4.js = {"if", {"nil?", "global"}, "window", "global"}
  setenv("global*", stash33({["symbol"] = _x4}))
  setenv("%compile-time", stash33({["macro"] = function (...)
    local forms = unstash({...})
    compiler.eval(join({"do"}, forms))
    return nil
  end}))
  setenv("when-compiling", stash33({["macro"] = function (...)
    local body = unstash({...})
    return compiler.eval(join({"do"}, body))
  end}))
  setenv("during-compilation", stash33({["macro"] = function (...)
    local body = unstash({...})
    local form = join({"do"}, body)
    compiler.eval(form)
    return form
  end}))
  setenv("%js", stash33({["macro"] = function (...)
    local forms = unstash({...})
    if target42 == "js" then
      return join({"do"}, forms)
    end
  end}))
  setenv("%lua", stash33({["macro"] = function (...)
    local forms = unstash({...})
    if target42 == "lua" then
      return join({"do"}, forms)
    end
  end}))
  setenv("quote", stash33({["macro"] = function (form)
    return quoted(form)
  end}))
  setenv("quasiquote", stash33({["macro"] = function (form)
    return quasiexpand(form, 1)
  end}))
  setenv("at", stash33({["macro"] = function (l, i)
    if type(i) == "number" and i < 0 then
      if type(l) == "table" then
        return {"let", "l", l, {"at", "l", i}}
      end
      i = {"+", {"len", l}, i}
    end
    if target42 == "lua" then
      if type(i) == "number" then
        i = i + 1
      else
        i = {"+", i, 1}
      end
    end
    return {"get", l, i}
  end}))
  setenv("wipe", stash33({["macro"] = function (place)
    if target42 == "lua" then
      return {"assign", place, "nil"}
    else
      return {"%delete", place}
    end
  end}))
  setenv("list", stash33({["macro"] = function (...)
    local body = unstash({...})
    local x = uniq("x")
    local l = {}
    local forms = {}
    local _l = body
    local k = nil
    for k in next, _l do
      local v = _l[k]
      if type(k) == "number" then
        l[k] = v
      else
        add(forms, {"assign", {"get", x, {"quote", k}}, v})
      end
    end
    if #(forms) > 0 then
      return join({"let", x, join({"%array"}, l)}, forms, {x})
    else
      return join({"%array"}, l)
    end
  end}))
  setenv("xform", stash33({["macro"] = function (l, body)
    return {"map", {"%fn", {"do", body}}, l}
  end}))
  setenv("if", stash33({["macro"] = function (...)
    local branches = unstash({...})
    return expand_if(branches)[1]
  end}))
  setenv("case", stash33({["macro"] = function (x, ...)
    local _r6 = unstash({...})
    local clauses = cut(_r6, 0)
    local e = uniq("e")
    local bs = map(function (_x38)
      local a = _x38[1]
      local b = _x38[2]
      if b == nil then
        return {a}
      else
        return {{"is", a, e}, b}
      end
    end, pair(clauses))
    return {"let", {e, x}, join({"if"}, apply(join, bs))}
  end}))
  setenv("when", stash33({["macro"] = function (cond, ...)
    local _r8 = unstash({...})
    local body = cut(_r8, 0)
    return {"if", cond, join({"do"}, body)}
  end}))
  setenv("unless", stash33({["macro"] = function (cond, ...)
    local _r9 = unstash({...})
    local body = cut(_r9, 0)
    return {"if", {"not", cond}, join({"do"}, body)}
  end}))
  setenv("assert", stash33({["macro"] = function (cond)
    local x = "assert: " .. str(cond)
    return {"unless", cond, {"error", {"quote", x}}}
  end}))
  setenv("obj", stash33({["macro"] = function (...)
    local body = unstash({...})
    return join({"%object"}, mapo(function (_)
      return _
    end, body))
  end}))
  setenv("let", stash33({["macro"] = function (bs, ...)
    local _r12 = unstash({...})
    local body = cut(_r12, 0)
    if toplevel63() then
      add(environment42, {})
      local _x58 = macroexpand(join({"let", bs}, body))
      drop(environment42)
      return _x58
    end
    if not( type(bs) == "table") then
      return join({"let", {bs, body[1]}}, cut(body, 1))
    else
      if #(bs) == 0 then
        return join({"do"}, body)
      else
        local lh = bs[1]
        local rh = bs[2]
        local bs2 = cut(bs, 2)
        local _id6 = bind(lh, rh)
        local id = _id6[1]
        local val = _id6[2]
        local bs1 = cut(_id6, 2)
        local renames = {}
        if bound63(id) or toplevel63() then
          local id1 = uniq(id)
          renames = {id, id1}
          id = id1
        else
          setenv(id, stash33({["variable"] = true}))
        end
        return {"do", {"%local", id, val}, {"w/sym", renames, join({"let", join(bs1, bs2)}, body)}}
      end
    end
  end}))
  setenv("=", stash33({["macro"] = function (...)
    local l = unstash({...})
    local _e = #(l)
    if 0 == _e then
      return nil
    else
      if 1 == _e then
        return join({"="}, l, {"nil"})
      else
        if 2 == _e then
          local lh = l[1]
          local rh = l[2]
          if not( type(lh) == "table") or lh[1] == "at" or lh[1] == "get" then
            return {"assign", lh, rh}
          else
            local vars = {}
            local forms = bind(lh, rh, vars)
            return join({"do"}, map(function (_)
              return {"var", _}
            end, vars), map(function (_x74)
              local id = _x74[1]
              local val = _x74[2]
              return {"=", id, val}
            end, pair(forms)))
          end
        else
          return join({"do"}, map(function (_)
            return join({"="}, _)
          end, pair(l)))
        end
      end
    end
  end}))
  setenv("with", stash33({["macro"] = function (x, v, ...)
    local _r16 = unstash({...})
    local body = cut(_r16, 0)
    return join({"let", {x, v}}, body, {x})
  end}))
  setenv("iflet", stash33({["macro"] = function (_var, expr, _then, ...)
    local _r17 = unstash({...})
    local rest = cut(_r17, 0)
    if not( type(_var) == "table") then
      return {"let", _var, expr, join({"if", _var, _then}, rest)}
    else
      local gv = uniq("if")
      return {"let", gv, expr, join({"if", gv, {"let", {_var, gv}, _then}}, rest)}
    end
  end}))
  setenv("whenlet", stash33({["macro"] = function (_var, expr, ...)
    local _r18 = unstash({...})
    local body = cut(_r18, 0)
    return {"iflet", _var, expr, join({"do"}, body)}
  end}))
  setenv("do1", stash33({["macro"] = function (x, ...)
    local _r19 = unstash({...})
    local ys = cut(_r19, 0)
    local g = uniq("do")
    return join({"let", g, x}, ys, {g})
  end}))
  setenv("mac", stash33({["macro"] = function (name, args, ...)
    local _r20 = unstash({...})
    local body = cut(_r20, 0)
    local _x96 = {"setenv", {"quote", name}}
    _x96.macro = join({"fn", args}, body)
    return join(_x96, keys(body))
  end}))
  setenv("defspecial", stash33({["macro"] = function (name, args, ...)
    local _r21 = unstash({...})
    local body = cut(_r21, 0)
    local _x100 = {"setenv", {"quote", name}}
    _x100.special = join({"fn", args}, body)
    return join(_x100, keys(body))
  end}))
  setenv("defsym", stash33({["macro"] = function (name, expansion, ...)
    local _r22 = unstash({...})
    local props = cut(_r22, 0)
    local _x104 = {"setenv", {"quote", name}}
    _x104.symbol = {"quote", expansion}
    return join(_x104, keys(props))
  end}))
  setenv("var", stash33({["macro"] = function (name, x, ...)
    local _r23 = unstash({...})
    local body = cut(_r23, 0)
    setenv(name, stash33({["variable"] = true}))
    if #(body) > 0 then
      return join({"%local-function", name}, bind42(x, body))
    else
      return {"%local", name, x}
    end
  end}))
  setenv("def", stash33({["macro"] = function (name, x, ...)
    local _r24 = unstash({...})
    local body = cut(_r24, 0)
    setenv(name, stash33({["toplevel"] = true, ["variable"] = true}))
    if #(body) > 0 then
      return join({"%global-function", name}, bind42(x, body))
    else
      return {"=", name, x}
    end
  end}))
  setenv("w/frame", stash33({["macro"] = function (...)
    local body = unstash({...})
    local x = uniq("x")
    return {"do", {"add", "environment*", {"obj"}}, {"with", x, join({"do"}, body), {"drop", "environment*"}}}
  end}))
  setenv("w/bindings", stash33({["macro"] = function (_x120, ...)
    local names = _x120[1]
    local _r25 = unstash({...})
    local body = cut(_r25, 0)
    local x = uniq("x")
    local _x124 = {"setenv", x}
    _x124.variable = true
    return join({"w/frame", {"each", x, names, _x124}}, body)
  end}))
  setenv("w/mac", stash33({["macro"] = function (name, args, definition, ...)
    local _r26 = unstash({...})
    local body = cut(_r26, 0)
    add(environment42, {})
    local _x126 = macroexpand(join({"do", {"%compile-time", {"mac", name, args, definition}}}, body))
    drop(environment42)
    return _x126
  end}))
  setenv("w/sym", stash33({["macro"] = function (expansions, ...)
    local _r27 = unstash({...})
    local body = cut(_r27, 0)
    if not( type(expansions) == "table") then
      return join({"w/sym", {expansions, body[1]}}, cut(body, 1))
    else
      add(environment42, {})
      local _x133 = macroexpand(join({"do", join({"%compile-time"}, map(function (_)
        return join({"defsym"}, _)
      end, pair(expansions)))}, body))
      drop(environment42)
      return _x133
    end
  end}))
  setenv("w/uniq", stash33({["macro"] = function (names, ...)
    local _r29 = unstash({...})
    local body = cut(_r29, 0)
    if not( type(names) == "table") then
      names = {names}
    end
    return join({"let", apply(join, map(function (_)
      return {_, {"uniq", {"quote", _}}}
    end, names))}, body)
  end}))
  setenv("fn", stash33({["macro"] = function (args, ...)
    local _r31 = unstash({...})
    local body = cut(_r31, 0)
    return join({"%function"}, bind42(args, body))
  end}))
  setenv("guard", stash33({["macro"] = function (expr)
    if target42 == "js" then
      return {{"%fn", {"%try", {"list", "t", expr}}}}
    else
      local x = uniq("x")
      local msg = uniq("msg")
      local trace = uniq("trace")
      return {"let", {x, "nil", msg, "nil", trace, "nil"}, {"if", {"xpcall", {"%fn", {"=", x, expr}}, {"%fn", {"do", {"=", msg, {"clip", "_", {"+", {"search", "_", "\": \""}, 2}}}, {"=", trace, {{"get", "debug", {"quote", "traceback"}}}}}}}, {"list", "t", x}, {"list", false, msg, trace}}}
    end
  end}))
  setenv("for", stash33({["macro"] = function (i, n, ...)
    local _r33 = unstash({...})
    local body = cut(_r33, 0)
    return {"let", i, 0, join({"while", {"<", i, n}}, body, {{"++", i}})}
  end}))
  setenv("step", stash33({["macro"] = function (v, l, ...)
    local _r34 = unstash({...})
    local body = cut(_r34, 0)
    local index = _r34.index
    local _e3
    if index == nil then
      _e3 = uniq("i")
    else
      _e3 = index
    end
    local i = _e3
    if i == true then
      i = "index"
    end
    local x = uniq("x")
    local n = uniq("n")
    return {"let", {x, l, n, {"len", x}}, {"for", i, n, join({"let", {v, {"at", x, i}}}, body)}}
  end}))
  setenv("each", stash33({["macro"] = function (x, lst, ...)
    local _r35 = unstash({...})
    local body = cut(_r35, 0)
    local l = uniq("l")
    local n = uniq("n")
    local i = uniq("i")
    local _e4
    if not( type(x) == "table") then
      _e4 = {i, x}
    else
      local _e5
      if #(x) > 1 then
        _e5 = x
      else
        _e5 = {i, x[1]}
      end
      _e4 = _e5
    end
    local _id27 = _e4
    local k = _id27[1]
    local v = _id27[2]
    local _e6
    if target42 == "lua" then
      _e6 = body
    else
      _e6 = {join({"let", k, {"if", {"numeric?", k}, {"parseInt", k}, k}}, body)}
    end
    return {"let", {l, lst, k, "nil"}, {"%for", l, k, join({"let", {v, {"get", l, k}}}, _e6)}}
  end}))
  setenv("set-of", stash33({["macro"] = function (...)
    local xs = unstash({...})
    local l = {}
    local _l1 = xs
    local _i1 = nil
    for _i1 in next, _l1 do
      local x = _l1[_i1]
      l[x] = true
    end
    return join({"obj"}, l)
  end}))
  setenv("language", stash33({["macro"] = function ()
    return {"quote", target42}
  end}))
  setenv("target", stash33({["macro"] = function (...)
    local clauses = unstash({...})
    return clauses[target42]
  end}))
  setenv("join!", stash33({["macro"] = function (a, ...)
    local _r37 = unstash({...})
    local bs = cut(_r37, 0)
    return {"=", a, join({"join", a}, bs)}
  end}))
  setenv("cat!", stash33({["macro"] = function (a, ...)
    local _r38 = unstash({...})
    local bs = cut(_r38, 0)
    return {"=", a, join({"cat", a}, bs)}
  end}))
  setenv("++", stash33({["macro"] = function (n, by)
    return {"=", n, {"+", n, by or 1}}
  end}))
  setenv("--", stash33({["macro"] = function (n, by)
    return {"=", n, {"-", n, by or 1}}
  end}))
  setenv("export", stash33({["macro"] = function (...)
    local names = unstash({...})
    if target42 == "js" then
      return join({"do"}, map(function (_)
        return {"=", {"get", "exports", {"quote", _}}, _}
      end, names))
    else
      local x = {}
      local _l2 = names
      local _i2 = nil
      for _i2 in next, _l2 do
        local k = _l2[_i2]
        x[k] = k
      end
      return {"return", join({"obj"}, x)}
    end
  end}))
  setenv("once", stash33({["macro"] = function (...)
    local forms = unstash({...})
    local x = uniq("x")
    return {"when", {"nil?", x}, {"=", x, "t"}, join({"let", join()}, forms)}
  end}))
  setenv("elf", stash33({["macro"] = function ()
    local _x224 = {"target"}
    _x224.js = "\"elf.js\""
    _x224.lua = "\"elf\""
    return {"require", _x224}
  end}))
  setenv("lib", stash33({["macro"] = function (...)
    local modules = unstash({...})
    return join({"do"}, map(function (_)
      return {"def", _, {"require", {"quote", _}}}
    end, modules))
  end}))
  setenv("use", stash33({["macro"] = function (...)
    local modules = unstash({...})
    return join({"do"}, map(function (_)
      return {"var", _, {"require", {"quote", _}}}
    end, modules))
  end}))
  setenv("nil?", stash33({["macro"] = function (x)
    if target42 == "lua" then
      return {"is", x, "nil"}
    else
      if type(x) == "table" then
        return {"let", "x", x, {"nil?", "x"}}
      else
        return {"or", {"is", {"typeof", x}, {"quote", "undefined"}}, {"is", x, "null"}}
      end
    end
  end}))
  setenv("hd", stash33({["macro"] = function (l)
    return {"at", l, 0}
  end}))
  setenv("tl", stash33({["macro"] = function (l)
    return {"cut", l, 1}
  end}))
  setenv("%len", stash33({["special"] = function (x)
    return "#(" .. compile(x) .. ")"
  end}))
  setenv("len", stash33({["macro"] = function (x)
    local _x245 = {"target"}
    _x245.lua = {"%len", x}
    _x245.js = {"or", {"get", x, {"quote", "length"}}, 0}
    return _x245
  end}))
  setenv("edge", stash33({["macro"] = function (x)
    return {"-", {"len", x}, 1}
  end}))
  setenv("one?", stash33({["macro"] = function (x)
    return {"is", {"len", x}, 1}
  end}))
  setenv("two?", stash33({["macro"] = function (x)
    return {"is", {"len", x}, 2}
  end}))
  setenv("some?", stash33({["macro"] = function (x)
    return {">", {"len", x}, 0}
  end}))
  setenv("none?", stash33({["macro"] = function (x)
    return {"is", {"len", x}, 0}
  end}))
  setenv("isa", stash33({["macro"] = function (x, y)
    local _x262 = {"target"}
    _x262.js = "typeof"
    _x262.lua = "type"
    return {"is", {_x262, x}, y}
  end}))
  setenv("list?", stash33({["macro"] = function (x)
    local _x264 = {"target"}
    _x264.js = {"quote", "object"}
    _x264.lua = {"quote", "table"}
    return {"isa", x, _x264}
  end}))
  setenv("atom?", stash33({["macro"] = function (x)
    return {"~list?", x}
  end}))
  setenv("bool?", stash33({["macro"] = function (x)
    return {"isa", x, {"quote", "boolean"}}
  end}))
  setenv("num?", stash33({["macro"] = function (x)
    return {"isa", x, {"quote", "number"}}
  end}))
  setenv("str?", stash33({["macro"] = function (x)
    return {"isa", x, {"quote", "string"}}
  end}))
  setenv("fn?", stash33({["macro"] = function (x)
    return {"isa", x, {"quote", "function"}}
  end}))
  return nil
end
if _x276 == nil then
  _x276 = true
  environment42 = {{}}
  target42 = "lua"
  keys42 = nil
end
nan = 0 / 0
inf = 1 / 0
function nan63(n)
  return not( n == n)
end
function inf63(n)
  return n == inf or n == -inf
end
function clip(s, from, upto)
  return string.sub(s, from + 1, upto)
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
  local i = max(0, from)
  local to = min(#(x), upto)
  while i < to do
    l[j + 1] = x[i + 1]
    i = i + 1
    j = j + 1
  end
  local _l3 = x
  local k = nil
  for k in next, _l3 do
    local v = _l3[k]
    if not( type(k) == "number") then
      l[k] = v
    end
  end
  return l
end
function keys(x)
  local l = {}
  local _l4 = x
  local k = nil
  for k in next, _l4 do
    local v = _l4[k]
    if not( type(k) == "number") then
      l[k] = v
    end
  end
  return l
end
function inner(x)
  return clip(x, 1, #(x) - 1)
end
function char(s, n)
  return clip(s, n, n + 1)
end
function code(s, n)
  local _e7
  if n then
    _e7 = n + 1
  end
  return string.byte(s, _e7)
end
function chr(c)
  return string.char(c)
end
function string_literal63(x)
  return type(x) == "string" and char(x, 0) == "\""
end
function id_literal63(x)
  return type(x) == "string" and char(x, 0) == "|"
end
function add(l, x)
  return table.insert(l, x)
end
function drop(l)
  return table.remove(l)
end
function last(l)
  return l[#(l) - 1 + 1]
end
function almost(l)
  return cut(l, 0, #(l) - 1)
end
function rev(l)
  local l1 = keys(l)
  local n = #(l) - 1
  local i = 0
  while i < #(l) do
    add(l1, l[n - i + 1])
    i = i + 1
  end
  return l1
end
function reduce(f, x)
  local _e1 = #(x)
  if 0 == _e1 then
    return nil
  else
    if 1 == _e1 then
      return x[1]
    else
      return f(x[1], reduce(f, cut(x, 1)))
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
      local _l5 = a
      local k = nil
      for k in next, _l5 do
        local v = _l5[k]
        c[k] = v
      end
      local _l6 = b
      local k = nil
      for k in next, _l6 do
        local v = _l6[k]
        if type(k) == "number" then
          k = k + o
        end
        c[k] = v
      end
      return c
    else
      return a or b or {}
    end
  else
    return reduce(join, ls) or {}
  end
end
function find(f, l)
  local _l7 = l
  local _i7 = nil
  for _i7 in next, _l7 do
    local x = _l7[_i7]
    local y = f(x)
    if y then
      return y
    end
  end
end
function first(f, l)
  local _x279 = l
  local _n8 = #(_x279)
  local _i8 = 0
  while _i8 < _n8 do
    local x = _x279[_i8 + 1]
    local y = f(x)
    if y then
      return y
    end
    _i8 = _i8 + 1
  end
end
function in63(x, l)
  return find(function (_)
    return x == _
  end, l)
end
function pair(l)
  local l1 = {}
  local i = 0
  while i < #(l) do
    add(l1, {l[i + 1], l[i + 1 + 1]})
    i = i + 1
    i = i + 1
  end
  return l1
end
function sort(l, f)
  table.sort(l, f)
  return l
end
function map(f, x)
  local l = {}
  local _x281 = x
  local _n9 = #(_x281)
  local _i9 = 0
  while _i9 < _n9 do
    local v = _x281[_i9 + 1]
    local y = f(v)
    if not( y == nil) then
      add(l, y)
    end
    _i9 = _i9 + 1
  end
  local _l8 = x
  local k = nil
  for k in next, _l8 do
    local v = _l8[k]
    if not( type(k) == "number") then
      local y = f(v)
      if not( y == nil) then
        l[k] = y
      end
    end
  end
  return l
end
function keep(f, x)
  return map(function (_)
    if f(_) then
      return _
    end
  end, x)
end
function keys63(l)
  local _l9 = l
  local k = nil
  for k in next, _l9 do
    local v = _l9[k]
    if not( type(k) == "number") then
      return true
    end
  end
  return false
end
function empty63(l)
  local _l10 = l
  local _i12 = nil
  for _i12 in next, _l10 do
    local x = _l10[_i12]
    return false
  end
  return true
end
function stash33(args)
  keys42 = args
  return nil
end
function unstash(args)
  if keys42 then
    local _l11 = keys42
    local k = nil
    for k in next, _l11 do
      local v = _l11[k]
      args[k] = v
    end
    keys42 = nil
  end
  return args
end
function search(s, pattern, start)
  local _e8
  if start then
    _e8 = start + 1
  end
  local start = _e8
  local i = string.find(s, pattern, start, true)
  return i and i - 1
end
function split(s, sep)
  if s == "" or sep == "" then
    return {}
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
    return l
  end
end
function cat(...)
  local xs = unstash({...})
  return reduce(function (_0, _1)
    return _0 .. _1
  end, xs) or ""
end
function _43(...)
  local xs = unstash({...})
  return reduce(function (_0, _1)
    return _0 + _1
  end, xs) or 0
end
function _42(...)
  local xs = unstash({...})
  return reduce(function (_0, _1)
    return _0 * _1
  end, xs) or 1
end
function _(...)
  local xs = unstash({...})
  return reduce(function (_0, _1)
    return _1 - _0
  end, rev(xs)) or 0
end
function _47(...)
  local xs = unstash({...})
  return reduce(function (_0, _1)
    return _1 / _0
  end, rev(xs)) or 1
end
function _37(...)
  local xs = unstash({...})
  return reduce(function (_0, _1)
    return _1 % _0
  end, rev(xs)) or 1
end
function _62(a, b)
  return a > b
end
function _60(a, b)
  return a < b
end
function is(a, b)
  return a == b
end
function _6261(a, b)
  return a >= b
end
function _6061(a, b)
  return a <= b
end
function number(s)
  return tonumber(s)
end
function number_code63(n)
  return n > 47 and n < 58
end
function numeric63(s)
  local n = #(s)
  local i = 0
  while i < n do
    if not number_code63(code(s, i)) then
      return false
    end
    i = i + 1
  end
  return true
end
function escape(s)
  local s1 = "\""
  local i = 0
  while i < #(s) do
    local c = char(s, i)
    local _e2 = c
    local _e9
    if "\n" == _e2 then
      _e9 = "\\n"
    else
      local _e10
      if "\"" == _e2 then
        _e10 = "\\\""
      else
        local _e11
        if "\\" == _e2 then
          _e11 = "\\\\"
        else
          _e11 = c
        end
        _e10 = _e11
      end
      _e9 = _e10
    end
    s1 = s1 .. _e9
    i = i + 1
  end
  return s1 .. "\""
end
function str(x, stack)
  if x == nil then
    return "nil"
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
            return tostring(x)
          else
            if type(x) == "boolean" then
              if x then
                return "t"
              else
                return "false"
              end
            else
              if type(x) == "string" then
                return escape(x)
              else
                if type(x) == "function" then
                  return "fn"
                else
                  if not( type(x) == "table") then
                    return escape(tostring(x))
                  else
                    if stack and in63(x, stack) then
                      return "circular"
                    else
                      local s = "("
                      local sp = ""
                      local fs = {}
                      local xs = {}
                      local ks = {}
                      local _stack = stack or {}
                      add(_stack, x)
                      local _l12 = x
                      local k = nil
                      for k in next, _l12 do
                        local v = _l12[k]
                        if type(k) == "number" then
                          xs[k + 1] = str(v, _stack)
                        else
                          if type(v) == "function" then
                            add(fs, k)
                          else
                            add(ks, k .. ":")
                            add(ks, str(v, _stack))
                          end
                        end
                      end
                      drop(_stack)
                      local _l13 = join(sort(fs), xs, ks)
                      local _i15 = nil
                      for _i15 in next, _l13 do
                        local v = _l13[_i15]
                        s = s .. sp .. v
                        sp = " "
                      end
                      return s .. ")"
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
table.unpack = table.unpack or unpack
function apply(f, args)
  stash33(keys(args))
  return f(table.unpack(args))
end
function toplevel63()
  return #(environment42) == 1
end
function setenv(k, ...)
  local _r112 = unstash({...})
  local _keys = cut(_r112, 0)
  if type(k) == "string" then
    local _e12
    if _keys.toplevel then
      _e12 = environment42[1]
    else
      _e12 = last(environment42)
    end
    local frame = _e12
    local entry = frame[k] or {}
    local _l14 = _keys
    local _k = nil
    for _k in next, _l14 do
      local v = _l14[_k]
      entry[_k] = v
    end
    frame[k] = entry
    return frame[k]
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
