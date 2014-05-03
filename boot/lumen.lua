setenv = function (k, v)
  last(environment)[k] = v
end

getenv = function (k)
  if string63(k) then
    return(find(function (e)
      return(e[k])
    end, reverse(environment)))
  end
end

symbol_expansion = function (k)
  local x = getenv(k)
  return((x and x.symbol))
end

symbol63 = function (k)
  return(is63(symbol_expansion(k)))
end

macro_function = function (k)
  local x = getenv(k)
  return((x and x.macro))
end

macro63 = function (k)
  return(is63(macro_function(k)))
end

variable63 = function (k)
  local x = last(environment)[k]
  return((x and x.variable))
end

bound63 = function (x)
  return((symbol63(x) or macro63(x) or variable63(x)))
end

escape = function (str)
  local str1 = "\""
  local i = 0
  while (i < length(str)) do
    local c = char(str, i)
    local c1 = (function ()
      if (c == "\n") then
        return("\\n")
      elseif (c == "\"") then
        return("\\\"")
      elseif (c == "\\") then
        return("\\\\")
      else
        return(c)
      end
    end)()
    str1 = (str1 .. c1)
    i = (i + 1)
  end
  return((str1 .. "\""))
end

quoted = function (form)
  if string63(form) then
    return(escape(form))
  elseif atom63(form) then
    return(form)
  else
    return(join({"list"}, map42(quoted, form)))
  end
end

stash = function (args)
  if keys63(args) then
    local p = {_stash = true}
    local k = nil
    local _g49 = args
    for k in next, _g49 do
      if (not number63(k)) then
        local v = _g49[k]
        p[k] = v
      end
    end
    return(join(args, {p}))
  else
    return(args)
  end
end

stash42 = function (args)
  if keys63(args) then
    local l = {"%object", "_stash", true}
    local k = nil
    local _g50 = args
    for k in next, _g50 do
      if (not number63(k)) then
        local v = _g50[k]
        add(l, k)
        add(l, v)
      end
    end
    return(join(args, {l}))
  else
    return(args)
  end
end

unstash = function (args)
  if empty63(args) then
    return({})
  else
    local l = last(args)
    if (table63(l) and l._stash) then
      local args1 = sub(args, 0, (length(args) - 1))
      local k = nil
      local _g51 = l
      for k in next, _g51 do
        if (not number63(k)) then
          local v = _g51[k]
          if (k ~= "_stash") then
            args1[k] = v
          end
        end
      end
      return(args1)
    else
      return(args)
    end
  end
end

bind_arguments = function (args, body)
  local args1 = {}
  local rest = function ()
    if (target == "js") then
      return({"unstash", {"sub", "arguments", length(args1)}})
    else
      add(args1, "|...|")
      return({"unstash", {"list", "|...|"}})
    end
  end
  if atom63(args) then
    return({args1, {join({"let", {args, rest()}}, body)}})
  else
    local bs = {}
    local r = (args.rest or (keys63(args) and make_id()))
    local _g53 = 0
    local _g52 = args
    while (_g53 < length(_g52)) do
      local arg = _g52[(_g53 + 1)]
      if atom63(arg) then
        add(args1, arg)
      elseif (list63(arg) or keys63(arg)) then
        local v = make_id()
        add(args1, v)
        bs = join(bs, {arg, v})
      end
      _g53 = (_g53 + 1)
    end
    if r then
      bs = join(bs, {r, rest()})
    end
    if keys63(args) then
      bs = join(bs, {sub(args, length(args)), r})
    end
    if empty63(bs) then
      return({args1, body})
    else
      return({args1, {join({"let", bs}, body)}})
    end
  end
end

bind = function (lh, rh)
  if (list63(lh) and list63(rh)) then
    local id = make_id()
    return(join({{id, rh}}, bind(lh, id)))
  elseif atom63(lh) then
    return({{lh, rh}})
  else
    local bs = {}
    local r = lh.rest
    local i = 0
    local _g54 = lh
    while (i < length(_g54)) do
      local x = _g54[(i + 1)]
      bs = join(bs, bind(x, {"at", rh, i}))
      i = (i + 1)
    end
    if r then
      bs = join(bs, bind(r, {"sub", rh, length(lh)}))
    end
    local k = nil
    local _g55 = lh
    for k in next, _g55 do
      if (not number63(k)) then
        local v = _g55[k]
        if (v == true) then
          v = k
        end
        if (k ~= "rest") then
          bs = join(bs, bind(v, {"get", rh, {"quote", k}}))
        end
      end
    end
    return(bs)
  end
end

expand_function = function (args, body)
  local _g56 = bind_arguments(args, body)
  local _g57 = _g56[1]
  local _g58 = _g56[2]
  add(environment, {})
  local _g60 = 0
  local _g59 = _g57
  while (_g60 < length(_g59)) do
    local arg = _g59[(_g60 + 1)]
    setenv(arg, {variable = true})
    _g60 = (_g60 + 1)
  end
  local _g61 = macroexpand(_g58)
  drop(environment)
  return({_g57, _g61})
end

message_handler = function (msg)
  local i = search(msg, ": ")
  return(sub(msg, (i + 2)))
end

self_expanding63 = function (x)
  return(((x == "%function") or (x == "define-macro")))
end

quoting63 = function (depth)
  return(number63(depth))
end

quasiquoting63 = function (depth)
  return((quoting63(depth) and (depth > 0)))
end

can_unquote63 = function (depth)
  return((quoting63(depth) and (depth == 1)))
end

quasisplice63 = function (x, depth)
  return((list63(x) and can_unquote63(depth) and (hd(x) == "unquote-splicing")))
end

macroexpand = function (form)
  if symbol63(form) then
    return(macroexpand(symbol_expansion(form)))
  elseif atom63(form) then
    return(form)
  else
    local name = hd(form)
    if self_expanding63(name) then
      return(form)
    elseif macro63(name) then
      return(macroexpand(apply(macro_function(name), tl(form))))
    else
      return(map42(macroexpand, form))
    end
  end
end

quasiexpand = function (form, depth)
  if quasiquoting63(depth) then
    if atom63(form) then
      return({"quote", form})
    elseif (can_unquote63(depth) and (hd(form) == "unquote")) then
      return(quasiexpand(form[2]))
    elseif ((hd(form) == "unquote") or (hd(form) == "unquote-splicing")) then
      return(quasiquote_list(form, (depth - 1)))
    elseif (hd(form) == "quasiquote") then
      return(quasiquote_list(form, (depth + 1)))
    else
      return(quasiquote_list(form, depth))
    end
  elseif atom63(form) then
    return(form)
  elseif (hd(form) == "quote") then
    return(form)
  elseif (hd(form) == "quasiquote") then
    return(quasiexpand(form[2], 1))
  else
    return(map42(function (x)
      return(quasiexpand(x, depth))
    end, form))
  end
end

quasiquote_list = function (form, depth)
  local xs = {{"list"}}
  local k = nil
  local _g62 = form
  for k in next, _g62 do
    if (not number63(k)) then
      local v = _g62[k]
      local v = (function ()
        if quasisplice63(v, depth) then
          return(quasiexpand(v[2]))
        else
          return(quasiexpand(v, depth))
        end
      end)()
      last(xs)[k] = v
    end
  end
  local _g64 = 0
  local _g63 = form
  while (_g64 < length(_g63)) do
    local x = _g63[(_g64 + 1)]
    if quasisplice63(x, depth) then
      local x = quasiexpand(x[2])
      add(xs, x)
      add(xs, {"list"})
    else
      add(last(xs), quasiexpand(x, depth))
    end
    _g64 = (_g64 + 1)
  end
  if (length(xs) == 1) then
    return(hd(xs))
  else
    return(reduce(function (a, b)
      return({"join", a, b})
    end, keep(function (x)
      return(((length(x) > 1) or (not (hd(x) == "list")) or keys63(x)))
    end, xs)))
  end
end

target = "lua"

length = function (x)
  return(#x)
end

empty63 = function (x)
  return((length(x) == 0))
end

sub = function (x, from, upto)
  local _g65 = (from or 0)
  if string63(x) then
    return((string.sub)(x, (_g65 + 1), upto))
  else
    local l = (function ()
      local i = _g65
      local j = 0
      local x2 = {}
      local upto = (upto or length(x))
      while (i < upto) do
        x2[(j + 1)] = x[(i + 1)]
        i = (i + 1)
        j = (j + 1)
      end
      return(x2)
    end)()
    local k = nil
    local _g66 = x
    for k in next, _g66 do
      if (not number63(k)) then
        local v = _g66[k]
        l[k] = v
      end
    end
    return(l)
  end
end

inner = function (x)
  return(sub(x, 1, (length(x) - 1)))
end

hd = function (l)
  return(l[1])
end

tl = function (l)
  return(sub(l, 1))
end

add = function (l, x)
  return((table.insert)(l, x))
end

drop = function (l)
  return((table.remove)(l))
end

last = function (l)
  return(l[((length(l) - 1) + 1)])
end

reverse = function (l)
  local l1 = {}
  local i = (length(l) - 1)
  while (i >= 0) do
    add(l1, l[(i + 1)])
    i = (i - 1)
  end
  return(l1)
end

join = function (l1, l2)
  if nil63(l1) then
    return(l2)
  elseif nil63(l2) then
    return(l1)
  else
    local l = {}
    local i = 0
    local len = length(l1)
    while (i < len) do
      l[(i + 1)] = l1[(i + 1)]
      i = (i + 1)
    end
    while (i < (len + length(l2))) do
      l[(i + 1)] = l2[((i - len) + 1)]
      i = (i + 1)
    end
    local k = nil
    local _g67 = l1
    for k in next, _g67 do
      if (not number63(k)) then
        local v = _g67[k]
        l[k] = v
      end
    end
    local _g69 = nil
    local _g68 = l2
    for _g69 in next, _g68 do
      if (not number63(_g69)) then
        local v = _g68[_g69]
        l[_g69] = v
      end
    end
    return(l)
  end
end

reduce = function (f, x)
  if empty63(x) then
    return(x)
  elseif (length(x) == 1) then
    return(hd(x))
  else
    return(f(hd(x), reduce(f, tl(x))))
  end
end

keep = function (f, l)
  local l1 = {}
  local _g71 = 0
  local _g70 = l
  while (_g71 < length(_g70)) do
    local x = _g70[(_g71 + 1)]
    if f(x) then
      add(l1, x)
    end
    _g71 = (_g71 + 1)
  end
  return(l1)
end

find = function (f, l)
  local _g73 = 0
  local _g72 = l
  while (_g73 < length(_g72)) do
    local x = _g72[(_g73 + 1)]
    local x = f(x)
    if x then
      return(x)
    end
    _g73 = (_g73 + 1)
  end
end

pairwise = function (l)
  local i = 0
  local l1 = {}
  while (i < length(l)) do
    add(l1, {l[(i + 1)], l[((i + 1) + 1)]})
    i = (i + 2)
  end
  return(l1)
end

iterate = function (f, count)
  local i = 0
  while (i < count) do
    f(i)
    i = (i + 1)
  end
end

replicate = function (n, x)
  local l = {}
  iterate(function ()
    return(add(l, x))
  end, n)
  return(l)
end

splice = function (x)
  return({_splice = x})
end

splice63 = function (x)
  if table63(x) then
    return(x._splice)
  end
end

map = function (f, l)
  local l1 = {}
  local _g88 = 0
  local _g87 = l
  while (_g88 < length(_g87)) do
    local x = _g87[(_g88 + 1)]
    local x1 = f(x)
    local s = splice63(x1)
    if list63(s) then
      l1 = join(l1, s)
    elseif is63(s) then
      add(l1, s)
    elseif is63(x1) then
      add(l1, x1)
    end
    _g88 = (_g88 + 1)
  end
  return(l1)
end

map42 = function (f, t)
  local l = map(f, t)
  local k = nil
  local _g89 = t
  for k in next, _g89 do
    if (not number63(k)) then
      local v = _g89[k]
      l[k] = f(v)
    end
  end
  return(l)
end

keys63 = function (t)
  local k63 = false
  local k = nil
  local _g90 = t
  for k in next, _g90 do
    if (not number63(k)) then
      local v = _g90[k]
      k63 = true
      break
    end
  end
  return(k63)
end

char = function (str, n)
  return(sub(str, n, (n + 1)))
end

code = function (str, n)
  return((string.byte)(str, (function ()
    if n then
      return((n + 1))
    end
  end)()))
end

search = function (str, pattern, start)
  local _g91 = (function ()
    if start then
      return((start + 1))
    end
  end)()
  local i = (string.find)(str, pattern, start, true)
  return((i and (i - 1)))
end

split = function (str, sep)
  if ((str == "") or (sep == "")) then
    return({})
  else
    local strs = {}
    while true do
      local i = search(str, sep)
      if nil63(i) then
        break
      else
        add(strs, sub(str, 0, i))
        str = sub(str, (i + 1))
      end
    end
    add(strs, str)
    return(strs)
  end
end

cat = function (...)
  local xs = unstash({...})
  local _g92 = sub(xs, 0)
  if empty63(_g92) then
    return("")
  else
    return(reduce(function (a, b)
      return((a .. b))
    end, _g92))
  end
end

_43 = function (...)
  local xs = unstash({...})
  local _g96 = sub(xs, 0)
  return(reduce(function (a, b)
    return((a + b))
  end, _g96))
end

_ = function (...)
  local xs = unstash({...})
  local _g97 = sub(xs, 0)
  return(reduce(function (a, b)
    return((b - a))
  end, reverse(_g97)))
end

_42 = function (...)
  local xs = unstash({...})
  local _g98 = sub(xs, 0)
  return(reduce(function (a, b)
    return((a * b))
  end, _g98))
end

_47 = function (...)
  local xs = unstash({...})
  local _g99 = sub(xs, 0)
  return(reduce(function (a, b)
    return((b / a))
  end, reverse(_g99)))
end

_37 = function (...)
  local xs = unstash({...})
  local _g100 = sub(xs, 0)
  return(reduce(function (a, b)
    return((b % a))
  end, reverse(_g100)))
end

_62 = function (a, b)
  return((a > b))
end

_60 = function (a, b)
  return((a < b))
end

_61 = function (a, b)
  return((a == b))
end

_6261 = function (a, b)
  return((a >= b))
end

_6061 = function (a, b)
  return((a <= b))
end

read_file = function (path)
  local f = (io.open)(path)
  return((f.read)(f, "*a"))
end

write_file = function (path, data)
  local f = (io.open)(path, "w")
  return((f.write)(f, data))
end

write = function (x)
  return((io.write)(x))
end

exit = function (code)
  return((os.exit)(code))
end

nil63 = function (x)
  return((x == nil))
end

is63 = function (x)
  return((not nil63(x)))
end

string63 = function (x)
  return((type(x) == "string"))
end

string_literal63 = function (x)
  return((string63(x) and (char(x, 0) == "\"")))
end

id_literal63 = function (x)
  return((string63(x) and (char(x, 0) == "|")))
end

number63 = function (x)
  return((type(x) == "number"))
end

boolean63 = function (x)
  return((type(x) == "boolean"))
end

function63 = function (x)
  return((type(x) == "function"))
end

composite63 = function (x)
  return((type(x) == "table"))
end

atom63 = function (x)
  return((not composite63(x)))
end

table63 = function (x)
  return((composite63(x) and nil63(hd(x))))
end

list63 = function (x)
  return((composite63(x) and is63(hd(x))))
end

parse_number = function (str)
  return(tonumber(str))
end

to_string = function (x)
  if nil63(x) then
    return("nil")
  elseif boolean63(x) then
    if x then
      return("true")
    else
      return("false")
    end
  elseif function63(x) then
    return("#<function>")
  elseif atom63(x) then
    return((x .. ""))
  else
    local str = "("
    local x1 = sub(x)
    local k = nil
    local _g101 = x
    for k in next, _g101 do
      if (not number63(k)) then
        local v = _g101[k]
        add(x1, (k .. ":"))
        add(x1, v)
      end
    end
    local i = 0
    local _g102 = x1
    while (i < length(_g102)) do
      local y = _g102[(i + 1)]
      str = (str .. to_string(y))
      if (i < (length(x1) - 1)) then
        str = (str .. " ")
      end
      i = (i + 1)
    end
    return((str .. ")"))
  end
end

apply = function (f, args)
  local _g103 = stash(args)
  return(f(unpack(_g103)))
end

id_count = 0

make_id = function ()
  id_count = (id_count + 1)
  return(("_g" .. id_count))
end

delimiters = {["("] = true, [")"] = true, [";"] = true, ["\n"] = true}

whitespace = {[" "] = true, ["\t"] = true, ["\n"] = true}

make_stream = function (str)
  return({pos = 0, string = str, len = length(str)})
end

peek_char = function (s)
  if (s.pos < s.len) then
    return(char(s.string, s.pos))
  end
end

read_char = function (s)
  local c = peek_char(s)
  if c then
    s.pos = (s.pos + 1)
    return(c)
  end
end

skip_non_code = function (s)
  while true do
    local c = peek_char(s)
    if nil63(c) then
      break
    elseif whitespace[c] then
      read_char(s)
    elseif (c == ";") then
      while (c and (not (c == "\n"))) do
        c = read_char(s)
      end
      skip_non_code(s)
    else
      break
    end
  end
end

read_table = {}

eof = {}

key63 = function (atom)
  return((string63(atom) and (length(atom) > 1) and (char(atom, (length(atom) - 1)) == ":")))
end

flag63 = function (atom)
  return((string63(atom) and (length(atom) > 1) and (char(atom, 0) == ":")))
end

read_table[""] = function (s)
  local str = ""
  local dot63 = false
  while true do
    local c = peek_char(s)
    if (c and ((not whitespace[c]) and (not delimiters[c]))) then
      if (c == ".") then
        dot63 = true
      end
      str = (str .. c)
      read_char(s)
    else
      break
    end
  end
  local n = parse_number(str)
  if is63(n) then
    return(n)
  elseif (str == "true") then
    return(true)
  elseif (str == "false") then
    return(false)
  elseif (str == "_") then
    return(make_id())
  elseif dot63 then
    return(reduce(function (a, b)
      return({"get", b, {"quote", a}})
    end, reverse(split(str, "."))))
  else
    return(str)
  end
end

read_table["("] = function (s)
  read_char(s)
  local l = {}
  while true do
    skip_non_code(s)
    local c = peek_char(s)
    if (c and (not (c == ")"))) then
      local x = read(s)
      if key63(x) then
        local k = sub(x, 0, (length(x) - 1))
        local v = read(s)
        l[k] = v
      elseif flag63(x) then
        l[sub(x, 1)] = true
      else
        add(l, x)
      end
    elseif c then
      read_char(s)
      break
    else
      error(("Expected ) at " .. s.pos))
    end
  end
  return(l)
end

read_table[")"] = function (s)
  error(("Unexpected ) at " .. s.pos))
end

read_table["\""] = function (s)
  read_char(s)
  local str = "\""
  while true do
    local c = peek_char(s)
    if (c and (not (c == "\""))) then
      if (c == "\\") then
        str = (str .. read_char(s))
      end
      str = (str .. read_char(s))
    elseif c then
      read_char(s)
      break
    else
      error(("Expected \" at " .. s.pos))
    end
  end
  return((str .. "\""))
end

read_table["|"] = function (s)
  read_char(s)
  local str = "|"
  while true do
    local c = peek_char(s)
    if (c and (not (c == "|"))) then
      str = (str .. read_char(s))
    elseif c then
      read_char(s)
      break
    else
      error(("Expected | at " .. s.pos))
    end
  end
  return((str .. "|"))
end

read_table["'"] = function (s)
  read_char(s)
  return({"quote", read(s)})
end

read_table["`"] = function (s)
  read_char(s)
  return({"quasiquote", read(s)})
end

read_table[","] = function (s)
  read_char(s)
  if (peek_char(s) == "@") then
    read_char(s)
    return({"unquote-splicing", read(s)})
  else
    return({"unquote", read(s)})
  end
end

read = function (s)
  skip_non_code(s)
  local c = peek_char(s)
  if is63(c) then
    return(((read_table[c] or read_table[""]))(s))
  else
    return(eof)
  end
end

read_from_string = function (str)
  return(read(make_stream(str)))
end

infix = {common = {["+"] = true, ["-"] = true, ["%"] = true, ["*"] = true, ["/"] = true, ["<"] = true, [">"] = true, ["<="] = true, [">="] = true}, js = {["="] = "===", ["~="] = "!=", ["and"] = "&&", ["or"] = "||", ["cat"] = "+"}, lua = {["="] = "==", ["cat"] = "..", ["~="] = true, ["and"] = true, ["or"] = true}}

getop = function (op)
  local op1 = (infix.common[op] or infix[target][op])
  if (op1 == true) then
    return(op)
  else
    return(op1)
  end
end

infix63 = function (form)
  return((list63(form) and is63(getop(hd(form)))))
end

indent_level = 0

indentation = function ()
  return(apply(cat, replicate(indent_level, "  ")))
end

compile_args = function (args)
  local str = "("
  local i = 0
  local _g109 = args
  while (i < length(_g109)) do
    local arg = _g109[(i + 1)]
    str = (str .. compile(arg))
    if (i < (length(args) - 1)) then
      str = (str .. ", ")
    end
    i = (i + 1)
  end
  return((str .. ")"))
end

compile_body = function (forms, ...)
  local _g110 = unstash({...})
  local tail63 = _g110["tail?"]
  local str = ""
  local i = 0
  local _g111 = forms
  while (i < length(_g111)) do
    local x = _g111[(i + 1)]
    local t63 = (tail63 and (i == (length(forms) - 1)))
    str = (str .. compile(x, {_stash = true, ["stmt?"] = true, ["tail?"] = t63}))
    i = (i + 1)
  end
  return(str)
end

numeric63 = function (n)
  return(((n > 47) and (n < 58)))
end

valid_char63 = function (n)
  return((numeric63(n) or ((n > 64) and (n < 91)) or ((n > 96) and (n < 123)) or (n == 95)))
end

valid_id63 = function (id)
  if empty63(id) then
    return(false)
  elseif special[id] then
    return(false)
  elseif getop(id) then
    return(false)
  else
    local i = 0
    while (i < length(id)) do
      local n = code(id, i)
      local valid63 = valid_char63(n)
      if ((not valid63) or ((i == 0) and numeric63(n))) then
        return(false)
      end
      i = (i + 1)
    end
    return(true)
  end
end

compile_id = function (id)
  local id1 = ""
  local i = 0
  while (i < length(id)) do
    local c = char(id, i)
    local n = code(c)
    local c1 = (function ()
      if (c == "-") then
        return("_")
      elseif valid_char63(n) then
        return(c)
      elseif (i == 0) then
        return(("_" .. n))
      else
        return(n)
      end
    end)()
    id1 = (id1 .. c1)
    i = (i + 1)
  end
  return(id1)
end

compile_atom = function (x)
  if ((x == "nil") and (target == "lua")) then
    return(x)
  elseif (x == "nil") then
    return("undefined")
  elseif id_literal63(x) then
    return(inner(x))
  elseif string_literal63(x) then
    return(x)
  elseif string63(x) then
    return(compile_id(x))
  elseif boolean63(x) then
    if x then
      return("true")
    else
      return("false")
    end
  elseif number63(x) then
    return((x .. ""))
  else
    error("Unrecognized atom")
  end
end

compile_call = function (form)
  if empty63(form) then
    return((compiler("%array"))(form))
  else
    local f = hd(form)
    local f1 = compile(f)
    local args = compile_args(stash42(tl(form)))
    if list63(f) then
      return(("(" .. f1 .. ")" .. args))
    elseif string63(f) then
      return((f1 .. args))
    else
      error("Invalid function call")
    end
  end
end

compile_infix = function (_g112)
  local op = _g112[1]
  local args = sub(_g112, 1)
  local str = "("
  local op = getop(op)
  local i = 0
  local _g113 = args
  while (i < length(_g113)) do
    local arg = _g113[(i + 1)]
    if ((op == "-") and (length(args) == 1)) then
      str = (str .. op .. compile(arg))
    else
      str = (str .. compile(arg))
      if (i < (length(args) - 1)) then
        str = (str .. " " .. op .. " ")
      end
    end
    i = (i + 1)
  end
  return((str .. ")"))
end

compile_branch = function (condition, body, first63, last63, tail63)
  local cond1 = compile(condition)
  local _g114 = (function ()
    indent_level = (indent_level + 1)
    local _g115 = compile(body, {_stash = true, ["stmt?"] = true, ["tail?"] = tail63})
    indent_level = (indent_level - 1)
    return(_g115)
  end)()
  local ind = indentation()
  local tr = (function ()
    if (last63 and (target == "lua")) then
      return((ind .. "end\n"))
    elseif last63 then
      return("\n")
    else
      return("")
    end
  end)()
  if (first63 and (target == "js")) then
    return((ind .. "if (" .. cond1 .. ") {\n" .. _g114 .. ind .. "}" .. tr))
  elseif first63 then
    return((ind .. "if " .. cond1 .. " then\n" .. _g114 .. tr))
  elseif (nil63(condition) and (target == "js")) then
    return((" else {\n" .. _g114 .. ind .. "}\n"))
  elseif nil63(condition) then
    return((ind .. "else\n" .. _g114 .. tr))
  elseif (target == "js") then
    return((" else if (" .. cond1 .. ") {\n" .. _g114 .. ind .. "}" .. tr))
  else
    return((ind .. "elseif " .. cond1 .. " then\n" .. _g114 .. tr))
  end
end

compile_function = function (args, body, name)
  local _g116 = (name or "")
  local _g117 = compile_args(args)
  local _g118 = (function ()
    indent_level = (indent_level + 1)
    local _g119 = compile_body(body, {_stash = true, ["tail?"] = true})
    indent_level = (indent_level - 1)
    return(_g119)
  end)()
  local ind = indentation()
  if (target == "js") then
    return(("function " .. _g116 .. _g117 .. " {\n" .. _g118 .. ind .. "}"))
  else
    return(("function " .. _g116 .. _g117 .. "\n" .. _g118 .. ind .. "end"))
  end
end

terminator = function (stmt63)
  if (not stmt63) then
    return("")
  elseif (target == "js") then
    return(";\n")
  else
    return("\n")
  end
end

compile_special = function (form, stmt63, tail63)
  local name = hd(form)
  if ((not stmt63) and statement63(name)) then
    return(compile({{"%function", {}, form}}, {_stash = true, ["tail?"] = tail63}))
  else
    local tr = terminator((stmt63 and (not self_tr63(name))))
    return(((compiler(name))(tl(form), tail63) .. tr))
  end
end

special = {}

special63 = function (form)
  return((list63(form) and is63(special[hd(form)])))
end

compiler = function (name)
  return(special[name].compiler)
end

statement63 = function (name)
  return(special[name].stmt)
end

self_tr63 = function (name)
  return(special[name].tr)
end

special["do"] = {compiler = function (forms, tail63)
  return(compile_body(forms, {_stash = true, ["tail?"] = tail63}))
end, stmt = true, tr = true}

special["if"] = {compiler = function (form, tail63)
  local str = ""
  local i = 0
  local _g126 = form
  while (i < length(_g126)) do
    local condition = _g126[(i + 1)]
    local last63 = (i >= (length(form) - 2))
    local else63 = (i == (length(form) - 1))
    local first63 = (i == 0)
    local body = form[((i + 1) + 1)]
    if else63 then
      body = condition
      condition = nil
    end
    str = (str .. compile_branch(condition, body, first63, last63, tail63))
    i = (i + 1)
    i = (i + 1)
  end
  return(str)
end, stmt = true, tr = true}

special["while"] = {compiler = function (form)
  local condition = compile(hd(form))
  local body = (function ()
    indent_level = (indent_level + 1)
    local _g127 = compile_body(tl(form))
    indent_level = (indent_level - 1)
    return(_g127)
  end)()
  local ind = indentation()
  if (target == "js") then
    return((ind .. "while (" .. condition .. ") {\n" .. body .. ind .. "}\n"))
  else
    return((ind .. "while " .. condition .. " do\n" .. body .. ind .. "end\n"))
  end
end, stmt = true, tr = true}

special["%for"] = {compiler = function (_g128)
  local _g129 = _g128[1]
  local t = _g129[1]
  local k = _g129[2]
  local body = sub(_g128, 1)
  local t = compile(t)
  local ind = indentation()
  local body = (function ()
    indent_level = (indent_level + 1)
    local _g130 = compile_body(body)
    indent_level = (indent_level - 1)
    return(_g130)
  end)()
  if (target == "lua") then
    return((ind .. "for " .. k .. " in next, " .. t .. " do\n" .. body .. ind .. "end\n"))
  else
    return((ind .. "for (" .. k .. " in " .. t .. ") {\n" .. body .. ind .. "}\n"))
  end
end, stmt = true, tr = true}

special["%try"] = {compiler = function (forms)
  local ind = indentation()
  local body = (function ()
    indent_level = (indent_level + 1)
    local _g131 = compile_body(forms, {_stash = true, ["tail?"] = true})
    indent_level = (indent_level - 1)
    return(_g131)
  end)()
  local e = make_id()
  local handler = {"return", {"%array", false, e}}
  local h = (function ()
    indent_level = (indent_level + 1)
    local _g132 = compile(handler, {_stash = true, ["stmt?"] = true})
    indent_level = (indent_level - 1)
    return(_g132)
  end)()
  return((ind .. "try {\n" .. body .. ind .. "}\n" .. ind .. "catch (" .. e .. ") {\n" .. h .. ind .. "}\n"))
end, stmt = true, tr = true}

special["break"] = {compiler = function (_g133)
  return((indentation() .. "break"))
end, stmt = true}

special["%function"] = {compiler = function (_g134)
  local args = _g134[1]
  local body = sub(_g134, 1)
  return(compile_function(args, body))
end}

special["define-macro"] = {compiler = function (_g135)
  local name = _g135[1]
  local args = _g135[2]
  local body = sub(_g135, 2)
  local form = join({"fn", args}, body)
  local macro = {"setenv", {"quote", name}, (function ()
    local _g136 = {"table"}
    _g136.macro = form
    _g136.value = form
    _g136.form = {"quote", form}
    return(_g136)
  end)()}
  eval(macro)
  return("")
end, stmt = true, tr = true}

special["return"] = {compiler = function (_g137)
  local x = _g137[1]
  return((indentation() .. compile_call({"return", x})))
end, stmt = true}

special["error"] = {compiler = function (_g138)
  local x = _g138[1]
  local e = (function ()
    if (target == "js") then
      return(("throw " .. compile(x)))
    else
      return(compile_call({"error", x}))
    end
  end)()
  return((indentation() .. e))
end, stmt = true}

special["%local"] = {compiler = function (_g139)
  local name = _g139[1]
  local value = _g139[2]
  local id = compile(name)
  local value = compile(value)
  local keyword = (function ()
    if (target == "js") then
      return("var ")
    else
      return("local ")
    end
  end)()
  local ind = indentation()
  return((ind .. keyword .. id .. " = " .. value))
end, stmt = true}

special["set"] = {compiler = function (_g140)
  local lh = _g140[1]
  local rh = _g140[2]
  if nil63(rh) then
    error("Missing right-hand side in assignment")
  end
  return((indentation() .. compile(lh) .. " = " .. compile(rh)))
end, stmt = true}

special["get"] = {compiler = function (_g141)
  local t = _g141[1]
  local k = _g141[2]
  local t = compile(t)
  local k1 = compile(k)
  if ((target == "lua") and (char(t, 0) == "{")) then
    t = ("(" .. t .. ")")
  end
  if (string_literal63(k) and valid_id63(inner(k))) then
    return((t .. "." .. inner(k)))
  else
    return((t .. "[" .. k1 .. "]"))
  end
end}

special["not"] = {compiler = function (_g142)
  local x = _g142[1]
  local x = compile(x)
  local open = (function ()
    if (target == "js") then
      return("!(")
    else
      return("(not ")
    end
  end)()
  return((open .. x .. ")"))
end}

special["%array"] = {compiler = function (forms)
  local open = (function ()
    if (target == "lua") then
      return("{")
    else
      return("[")
    end
  end)()
  local close = (function ()
    if (target == "lua") then
      return("}")
    else
      return("]")
    end
  end)()
  local str = ""
  local i = 0
  local _g143 = forms
  while (i < length(_g143)) do
    local x = _g143[(i + 1)]
    str = (str .. compile(x))
    if (i < (length(forms) - 1)) then
      str = (str .. ", ")
    end
    i = (i + 1)
  end
  return((open .. str .. close))
end}

special["%object"] = {compiler = function (forms)
  local str = "{"
  local sep = (function ()
    if (target == "lua") then
      return(" = ")
    else
      return(": ")
    end
  end)()
  local pairs = pairwise(forms)
  local i = 0
  local _g144 = pairs
  while (i < length(_g144)) do
    local _g145 = _g144[(i + 1)]
    local k = _g145[1]
    local v = _g145[2]
    if (not string63(k)) then
      error(("Illegal object key: " .. to_string(k)))
    end
    local v = compile(v)
    local k = (function ()
      if valid_id63(k) then
        return(k)
      elseif ((target == "js") and string_literal63(k)) then
        return(k)
      elseif (target == "js") then
        return(quoted(k))
      elseif string_literal63(k) then
        return(("[" .. k .. "]"))
      else
        return(("[" .. quoted(k) .. "]"))
      end
    end)()
    str = (str .. k .. sep .. v)
    if (i < (length(pairs) - 1)) then
      str = (str .. ", ")
    end
    i = (i + 1)
  end
  return((str .. "}"))
end}

can_return63 = function (form)
  return(((not special63(form)) or (not statement63(hd(form)))))
end

compile = function (form, ...)
  local _g146 = unstash({...})
  local stmt63 = _g146["stmt?"]
  local tail63 = _g146["tail?"]
  if (tail63 and can_return63(form)) then
    form = {"return", form}
  end
  if nil63(form) then
    return("")
  elseif special63(form) then
    return(compile_special(form, stmt63, tail63))
  else
    local tr = terminator(stmt63)
    local ind = (function ()
      if stmt63 then
        return(indentation())
      else
        return("")
      end
    end)()
    local form = (function ()
      if atom63(form) then
        return(compile_atom(form))
      elseif infix63(form) then
        return(compile_infix(form))
      else
        return(compile_call(form))
      end
    end)()
    return((ind .. form .. tr))
  end
end

compile_toplevel = function (form)
  local _g147 = compile(macroexpand(form), {_stash = true, ["stmt?"] = true})
  if (_g147 == "") then
    return("")
  else
    return((_g147 .. "\n"))
  end
end

run_result = nil
run = function (x)
  local f = load((compile("run-result") .. "=" .. x))
  if f then
    f()
    return(run_result)
  else
    local f,e = load(x)
    if f then
      return(f())
    else
      error((e .. " in " .. x))
    end
  end
end

eval = function (form)
  local previous = target
  target = "lua"
  local str = compile(macroexpand(form))
  target = previous
  return(run(str))
end

save_environment63 = false

save_environment = function ()
  local env = {"define", "environment", {"list", {"table"}}}
  local output = compile_toplevel(env)
  local toplevel = hd(environment)
  local entries = {}
  local k = nil
  local _g148 = toplevel
  for k in next, _g148 do
    if (not number63(k)) then
      local v = _g148[k]
      local form = v.form
      local macro = v.macro
      local symbol = v.symbol
      local entry = (function ()
        if is63(macro) then
          local _g149 = {"table"}
          _g149.macro = form
          _g149.form = {"quote", form}
          return(_g149)
        elseif is63(symbol) then
          local _g150 = {"table"}
          _g150.symbol = {"quote", symbol}
          return(_g150)
        end
      end)()
      if entry then
        entries[k] = entry
      end
    end
  end
  local _g152 = nil
  local _g151 = entries
  for _g152 in next, _g151 do
    if (not number63(_g152)) then
      local v = _g151[_g152]
      local compiled = compile_toplevel({"setenv", {"quote", _g152}, v})
      output = (output .. compiled)
    end
  end
  return(output)
end

compile_file = function (file)
  local output = ""
  local s = make_stream(read_file(file))
  while true do
    local form = read(s)
    if (form == eof) then
      break
    end
    output = (output .. compile_toplevel(form))
  end
  return(output)
end

compile_files = function (files)
  local output = ""
  local _g154 = 0
  local _g153 = files
  while (_g154 < length(_g153)) do
    local file = _g153[(_g154 + 1)]
    output = (output .. compile_file(file))
    _g154 = (_g154 + 1)
  end
  if save_environment63 then
    return((output .. save_environment()))
  else
    return(output)
  end
end

load_file = function (file)
  return(run(compile_file(file)))
end

rep = function (str)
  local _g156 = (function ()
    local _g157,_g158 = xpcall(function ()
      return(eval(read_from_string(str)))
    end, message_handler)
    return({_g157, _g158})
  end)()
  local _g155 = _g156[1]
  local x = _g156[2]
  if is63(x) then
    return(print((to_string(x) .. " ")))
  end
end

repl = function ()
  local step = function (str)
    rep(str)
    return(write("> "))
  end
  write("> ")
  while true do
    local str = (io.read)()
    if str then
      step(str)
    else
      break
    end
  end
end

usage = function ()
  print((to_string("usage: lumen [options] [inputs]") .. " "))
  print((to_string("options:") .. " "))
  print((to_string("  -o <output>\tOutput file") .. " "))
  print((to_string("  -t <target>\tTarget language (default: lua)") .. " "))
  print((to_string("  -e <expr>\tExpression to evaluate") .. " "))
  print((to_string("  -s \t\tSave environment") .. " "))
  return(exit())
end

main = function ()
  local args = arg
  if ((hd(args) == "-h") or (hd(args) == "--help")) then
    usage()
  end
  local inputs = {}
  local output = nil
  local target1 = nil
  local expr = nil
  local i = 0
  local _g159 = args
  while (i < length(_g159)) do
    local arg = _g159[(i + 1)]
    if ((arg == "-o") or (arg == "-t") or (arg == "-e")) then
      if (i == (length(args) - 1)) then
        print((to_string("missing argument for") .. " " .. to_string(arg) .. " "))
      else
        i = (i + 1)
        local val = args[(i + 1)]
        if (arg == "-o") then
          output = val
        elseif (arg == "-t") then
          target1 = val
        elseif (arg == "-e") then
          expr = val
        end
      end
    elseif (arg == "-s") then
      save_environment63 = true
    elseif ("-" ~= char(arg, 0)) then
      add(inputs, arg)
    end
    i = (i + 1)
  end
  if output then
    if target1 then
      target = target1
    end
    local compiled = compile_files(inputs)
    local main = compile({"main"})
    return(write_file(output, (compiled .. main)))
  else
    local _g161 = 0
    local _g160 = inputs
    while (_g161 < length(_g160)) do
      local file = _g160[(_g161 + 1)]
      load_file(file)
      _g161 = (_g161 + 1)
    end
    if expr then
      return(rep(expr))
    else
      return(repl())
    end
  end
end

environment = {{}}

setenv("set-of", {form = {"fn", "elements", {"let", {"l", {}}, {"across", {"elements", "e"}, {"set", {"get", "l", "e"}, true}}, {"quasiquote", {"table", {"unquote-splicing", "l"}}}}}, macro = function (...)
  local elements = unstash({...})
  local l = {}
  local _g163 = 0
  local _g162 = elements
  while (_g163 < length(_g162)) do
    local e = _g162[(_g163 + 1)]
    l[e] = true
    _g163 = (_g163 + 1)
  end
  return(join({"table"}, l))
end})

setenv("guard", {form = {"fn", {"expr"}, {"if", {"=", "target", {"quote", "js"}}, {"quasiquote", {{"fn", {}, {"%try", {"list", true, {"unquote", "expr"}}}}}}, {"let", {"e", {"make-id"}, "x", {"make-id"}, "ex", {"cat", "\"|\"", "e", "\",\"", "x", "\"|\""}}, {"quasiquote", {"let", {{"unquote", "ex"}, {"xpcall", {"fn", {}, {"unquote", "expr"}}, "message-handler"}}, {"list", {"unquote", "e"}, {"unquote", "x"}}}}}}}, macro = function (expr)
  if (target == "js") then
    return({{"fn", {}, {"%try", {"list", true, expr}}}})
  else
    local e = make_id()
    local x = make_id()
    local ex = ("|" .. e .. "," .. x .. "|")
    return({"let", {ex, {"xpcall", {"fn", {}, expr}, "message-handler"}}, {"list", e, x}})
  end
end})

setenv("at", {form = {"fn", {"l", "i"}, {"if", {"and", {"=", "target", {"quote", "lua"}}, {"number?", "i"}}, {"inc", "i"}, {"=", "target", {"quote", "lua"}}, {"set", "i", {"quasiquote", {"+", {"unquote", "i"}, 1}}}}, {"quasiquote", {"get", {"unquote", "l"}, {"unquote", "i"}}}}, macro = function (l, i)
  if ((target == "lua") and number63(i)) then
    i = (i + 1)
  elseif (target == "lua") then
    i = {"+", i, 1}
  end
  return({"get", l, i})
end})

setenv("language", {form = {"fn", {}, {"quasiquote", {"quote", {"unquote", "target"}}}}, macro = function ()
  return({"quote", target})
end})

setenv("join!", {form = {"fn", (function ()
  local _g164 = {"a"}
  _g164.rest = "bs"
  return(_g164)
end)(), {"quasiquote", {"set", {"unquote", "a"}, {"join*", {"unquote", "a"}, {"unquote-splicing", "bs"}}}}}, macro = function (a, ...)
  local bs = unstash({...})
  local _g165 = sub(bs, 0)
  return({"set", a, join({"join*", a}, _g165)})
end})

setenv("with-indent", {form = {"fn", {"form"}, {"let", {"result", {"make-id"}}, {"quasiquote", {"do", {"inc", "indent-level"}, {"let", {{"unquote", "result"}, {"unquote", "form"}}, {"dec", "indent-level"}, {"unquote", "result"}}}}}}, macro = function (form)
  local result = make_id()
  return({"do", {"inc", "indent-level"}, {"let", {result, form}, {"dec", "indent-level"}, result}})
end})

setenv("table", {form = {"fn", "body", {"let", {"l", {}}, {"each", {"body", "k", "v"}, {"add", "l", "k"}, {"add", "l", "v"}}, {"quasiquote", {"%object", {"unquote-splicing", "l"}}}}}, macro = function (...)
  local body = unstash({...})
  local l = {}
  local k = nil
  local _g166 = body
  for k in next, _g166 do
    if (not number63(k)) then
      local v = _g166[k]
      add(l, k)
      add(l, v)
    end
  end
  return(join({"%object"}, l))
end})

setenv("let-symbol", {form = {"fn", (function ()
  local _g167 = {"expansions"}
  _g167.rest = "body"
  return(_g167)
end)(), {"add", "environment", {"table"}}, {"map", {"fn", {{"name", "exp"}}, {"macroexpand", {"quasiquote", {"define-symbol", {"unquote", "name"}, {"unquote", "exp"}}}}}, {"pairwise", "expansions"}}, {"let", {"body", {"macroexpand", "body"}}, {"drop", "environment"}, {"quasiquote", {"do", {"unquote-splicing", "body"}}}}}, macro = function (expansions, ...)
  local body = unstash({...})
  local _g168 = sub(body, 0)
  add(environment, {})
  map(function (_g169)
    local name = _g169[1]
    local exp = _g169[2]
    return(macroexpand({"define-symbol", name, exp}))
  end, pairwise(expansions))
  local _g170 = macroexpand(_g168)
  drop(environment)
  return(join({"do"}, _g170))
end})

setenv("define", {form = {"fn", (function ()
  local _g171 = {"name", "x"}
  _g171.rest = "body"
  return(_g171)
end)(), {"if", {"not", {"empty?", "body"}}, {"set", "x", {"quasiquote", {"fn", {"unquote", "x"}, {"unquote-splicing", "body"}}}}}, {"quasiquote", {"set", {"unquote", "name"}, {"unquote", "x"}}}}, macro = function (name, x, ...)
  local body = unstash({...})
  local _g172 = sub(body, 0)
  if (not empty63(_g172)) then
    x = join({"fn", x}, _g172)
  end
  return({"set", name, x})
end})

setenv("across", {form = {"fn", (function ()
  local _g173 = {{"l", "v", "i", "start"}}
  _g173.rest = "body"
  return(_g173)
end)(), {"let", {"l1", {"make-id"}}, {"set", "i", {"or", "i", {"make-id"}}}, {"set", "start", {"or", "start", 0}}, {"quasiquote", {"let", {{"unquote", "i"}, {"unquote", "start"}, {"unquote", "l1"}, {"unquote", "l"}}, {"while", {"<", {"unquote", "i"}, {"length", {"unquote", "l1"}}}, {"let", {{"unquote", "v"}, {"at", {"unquote", "l1"}, {"unquote", "i"}}}, {"unquote-splicing", "body"}, {"inc", {"unquote", "i"}}}}}}}}, macro = function (_g174, ...)
  local l = _g174[1]
  local v = _g174[2]
  local i = _g174[3]
  local start = _g174[4]
  local body = unstash({...})
  local _g175 = sub(body, 0)
  local l1 = make_id()
  i = (i or make_id())
  start = (start or 0)
  return({"let", {i, start, l1, l}, {"while", {"<", i, {"length", l1}}, join({"let", {v, {"at", l1, i}}}, join(_g175, {{"inc", i}}))}})
end})

setenv("target", {form = {"fn", "clauses", {"get", "clauses", "target"}}, macro = function (...)
  local clauses = unstash({...})
  return(clauses[target])
end})

setenv("define-reader", {form = {"fn", (function ()
  local _g176 = {{"char", "stream"}}
  _g176.rest = "body"
  return(_g176)
end)(), {"quasiquote", {"set", {"get", "read-table", {"unquote", "char"}}, {"fn", {{"unquote", "stream"}}, {"unquote-splicing", "body"}}}}}, macro = function (_g177, ...)
  local char = _g177[1]
  local stream = _g177[2]
  local body = unstash({...})
  local _g178 = sub(body, 0)
  return({"set", {"get", "read-table", char}, join({"fn", {stream}}, _g178)})
end})

setenv("define-symbol", {form = {"fn", {"name", "expansion"}, {"setenv", "name", (function ()
  local _g179 = {"table"}
  _g179.symbol = "expansion"
  _g179.value = "expansion"
  return(_g179)
end)()}, "nil"}, macro = function (name, expansion)
  setenv(name, {symbol = expansion, value = expansion})
  return(nil)
end})

setenv("let", {form = {"fn", (function ()
  local _g180 = {"bindings"}
  _g180.rest = "body"
  return(_g180)
end)(), {"let", {"i", 0, "renames", {}, "locals", {}}, {"map", {"fn", {{"lh", "rh"}}, {"across", {{"bind", "lh", "rh"}, {"id", "val"}}, {"if", {"bound?", "id"}, {"let", {"rename", {"make-id"}}, {"add", "renames", "id"}, {"add", "renames", "rename"}, {"set", "id", "rename"}}, {"setenv", "id", (function ()
  local _g181 = {"table"}
  _g181.variable = true
  return(_g181)
end)()}}, {"add", "locals", {"quasiquote", {"%local", {"unquote", "id"}, {"unquote", "val"}}}}}}, {"pairwise", "bindings"}}, {"quasiquote", {"do", {"unquote-splicing", "locals"}, {"let-symbol", {"unquote", "renames"}, {"unquote-splicing", "body"}}}}}}, macro = function (bindings, ...)
  local body = unstash({...})
  local _g182 = sub(body, 0)
  local i = 0
  local renames = {}
  local locals = {}
  map(function (_g183)
    local lh = _g183[1]
    local rh = _g183[2]
    local _g185 = 0
    local _g184 = bind(lh, rh)
    while (_g185 < length(_g184)) do
      local _g186 = _g184[(_g185 + 1)]
      local id = _g186[1]
      local val = _g186[2]
      if bound63(id) then
        local rename = make_id()
        add(renames, id)
        add(renames, rename)
        id = rename
      else
        setenv(id, {variable = true})
      end
      add(locals, {"%local", id, val})
      _g185 = (_g185 + 1)
    end
  end, pairwise(bindings))
  return(join({"do"}, join(locals, {join({"let-symbol", renames}, _g182)})))
end})

setenv("inc", {form = {"fn", {"n", "by"}, {"quasiquote", {"set", {"unquote", "n"}, {"+", {"unquote", "n"}, {"unquote", {"or", "by", 1}}}}}}, macro = function (n, by)
  return({"set", n, {"+", n, (by or 1)}})
end})

setenv("dec", {form = {"fn", {"n", "by"}, {"quasiquote", {"set", {"unquote", "n"}, {"-", {"unquote", "n"}, {"unquote", {"or", "by", 1}}}}}}, macro = function (n, by)
  return({"set", n, {"-", n, (by or 1)}})
end})

setenv("let-macro", {form = {"fn", (function ()
  local _g187 = {"definitions"}
  _g187.rest = "body"
  return(_g187)
end)(), {"add", "environment", {"table"}}, {"map", {"fn", {"m"}, {"compile", {"quasiquote", {"define-macro", {"unquote-splicing", "m"}}}}}, "definitions"}, {"let", {"body", {"macroexpand", "body"}}, {"drop", "environment"}, {"quasiquote", {"do", {"unquote-splicing", "body"}}}}}, macro = function (definitions, ...)
  local body = unstash({...})
  local _g188 = sub(body, 0)
  add(environment, {})
  map(function (m)
    return(compile(join({"define-macro"}, m)))
  end, definitions)
  local _g189 = macroexpand(_g188)
  drop(environment)
  return(join({"do"}, _g189))
end})

setenv("list", {form = {"fn", "body", {"let", {"l", {"quasiquote", {"%array", {"unquote-splicing", "body"}}}}, {"if", {"not", {"keys?", "body"}}, "l", {"let", {"id", {"make-id"}, "init", {}}, {"each", {"body", "k", "v"}, {"add", "init", {"quasiquote", {"set", {"get", {"unquote", "id"}, {"quote", {"unquote", "k"}}}, {"unquote", "v"}}}}}, {"quasiquote", {"let", {{"unquote", "id"}, {"unquote", "l"}}, {"unquote-splicing", "init"}, {"unquote", "id"}}}}}}}, macro = function (...)
  local body = unstash({...})
  local l = join({"%array"}, body)
  if (not keys63(body)) then
    return(l)
  else
    local id = make_id()
    local init = {}
    local k = nil
    local _g190 = body
    for k in next, _g190 do
      if (not number63(k)) then
        local v = _g190[k]
        add(init, {"set", {"get", id, {"quote", k}}, v})
      end
    end
    return(join({"let", {id, l}}, join(init, {id})))
  end
end})

setenv("quasiquote", {form = {"fn", {"form"}, {"quasiexpand", "form", 1}}, macro = function (form)
  return(quasiexpand(form, 1))
end})

setenv("fn", {form = {"fn", (function ()
  local _g191 = {"args"}
  _g191.rest = "body"
  return(_g191)
end)(), {"let", {{"args", "body"}, {"expand-function", "args", "body"}}, {"quasiquote", {"%function", {"unquote", "args"}, {"unquote-splicing", "body"}}}}}, macro = function (args, ...)
  local body = unstash({...})
  local _g192 = sub(body, 0)
  local _g193 = expand_function(args, _g192)
  local args = _g193[1]
  local _g194 = _g193[2]
  return(join({"%function", args}, _g194))
end})

setenv("define-special", {form = {"fn", (function ()
  local _g195 = {"name", "args"}
  _g195.rest = "body"
  return(_g195)
end)(), {"quasiquote", {"set", {"get", "special", {"quote", {"unquote", "name"}}}, (function ()
  local _g196 = {"table", {"unquote-splicing", "body"}}
  _g196.compiler = {"fn", {"unquote", "args"}, {"unquote-splicing", "body"}}
  return(_g196)
end)()}}}, macro = function (name, args, ...)
  local body = unstash({...})
  local _g197 = sub(body, 0)
  return({"set", {"get", "special", {"quote", name}}, join((function ()
    local _g198 = {"table"}
    _g198.compiler = join({"fn", args}, _g197)
    return(_g198)
  end)(), _g197)})
end})

setenv("cat!", {form = {"fn", (function ()
  local _g199 = {"a"}
  _g199.rest = "bs"
  return(_g199)
end)(), {"quasiquote", {"set", {"unquote", "a"}, {"cat", {"unquote", "a"}, {"unquote-splicing", "bs"}}}}}, macro = function (a, ...)
  local bs = unstash({...})
  local _g200 = sub(bs, 0)
  return({"set", a, join({"cat", a}, _g200)})
end})

setenv("list*", {form = {"fn", "xs", {"if", {"empty?", "xs"}, {}, {"let", {"l", {}}, {"across", {"xs", "x", "i"}, {"if", {"=", "i", {"-", {"length", "xs"}, 1}}, {"set", "l", {"list", {"quote", "join"}, {"join", {"quote", {"list"}}, "l"}, "x"}}, {"add", "l", "x"}}}, "l"}}}, macro = function (...)
  local xs = unstash({...})
  if empty63(xs) then
    return({})
  else
    local l = {}
    local i = 0
    local _g201 = xs
    while (i < length(_g201)) do
      local x = _g201[(i + 1)]
      if (i == (length(xs) - 1)) then
        l = {"join", join({"list"}, l), x}
      else
        add(l, x)
      end
      i = (i + 1)
    end
    return(l)
  end
end})

setenv("join*", {form = {"fn", "xs", {"reduce", {"fn", {"a", "b"}, {"list", {"quote", "join"}, "a", "b"}}, "xs"}}, macro = function (...)
  local xs = unstash({...})
  return(reduce(function (a, b)
    return({"join", a, b})
  end, xs))
end})

setenv("quote", {form = {"fn", {"form"}, {"quoted", "form"}}, macro = function (form)
  return(quoted(form))
end})

setenv("pr", {form = {"fn", "xs", {"let", {"xs", {"map", {"fn", {"x"}, {"splice", {"quasiquote", {{"to-string", {"unquote", "x"}}, "\" \""}}}}, "xs"}}, {"quasiquote", {"print", {"cat", {"unquote-splicing", "xs"}}}}}}, macro = function (...)
  local xs = unstash({...})
  local xs = map(function (x)
    return(splice({{"to-string", x}, "\" \""}))
  end, xs)
  return({"print", join({"cat"}, xs)})
end})

setenv("each", {form = {"fn", (function ()
  local _g202 = {{"t", "k", "v"}}
  _g202.rest = "body"
  return(_g202)
end)(), {"let", {"t1", {"make-id"}}, {"quasiquote", {"let", {{"unquote", "k"}, "nil", {"unquote", "t1"}, {"unquote", "t"}}, {"%for", {{"unquote", "t1"}, {"unquote", "k"}}, {"if", (function ()
  local _g203 = {"target"}
  _g203.js = {"isNaN", {"parseInt", {"unquote", "k"}}}
  _g203.lua = {"not", {"number?", {"unquote", "k"}}}
  return(_g203)
end)(), {"let", {{"unquote", "v"}, {"get", {"unquote", "t1"}, {"unquote", "k"}}}, {"unquote-splicing", "body"}}}}}}}}, macro = function (_g204, ...)
  local t = _g204[1]
  local k = _g204[2]
  local v = _g204[3]
  local body = unstash({...})
  local _g205 = sub(body, 0)
  local t1 = make_id()
  return({"let", {k, "nil", t1, t}, {"%for", {t1, k}, {"if", (function ()
    local _g206 = {"target"}
    _g206.js = {"isNaN", {"parseInt", k}}
    _g206.lua = {"not", {"number?", k}}
    return(_g206)
  end)(), join({"let", {v, {"get", t1, k}}}, _g205)}}})
end})

main()