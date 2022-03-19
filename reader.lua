local function defreader__macro(_x, ...)
  local char = _x[1]
  local s = _x[2]
  local _r = unstash({...})
  local body = cut(_r, 0)
  return {"=", {"get", "read-table", char}, join({"fn", {s}}, body)}
end
setenv("defreader", stash33({["macro"] = defreader__macro}))
local delimiters = {["["] = true, [")"] = true, ["}"] = true, [";"] = true, ["]"] = true, ["\n"] = true, ["\r"] = true, ["{"] = true, ["("] = true}
local whitespace = {["\t"] = true, ["\r"] = true, [" "] = true, ["\n"] = true}
local function stream(str, more)
  return {["len"] = #(str), ["pos"] = 0, ["more"] = more, ["string"] = str}
end
local function peek_char(s)
  local _len = s.len
  local pos = s.pos
  local string = s.string
  if pos < _len then
    return char(string, pos)
  end
end
local function read_char(s)
  local c = peek_char(s)
  if c then
    s.pos = s.pos + 1
    return c
  end
end
local function skip_non_code(s)
  local any63 = nil
  while true do
    local c = peek_char(s)
    if c == nil then
      break
    else
      if whitespace[c] then
        read_char(s)
      else
        if c == ";" then
          while c and not( c == "\n") do
            c = read_char(s)
          end
          skip_non_code(s)
        else
          break
        end
      end
    end
    any63 = true
  end
  return any63
end
local read_table = {}
local eof = {}
local function read(s)
  skip_non_code(s)
  local c = peek_char(s)
  if c == nil then
    return eof
  else
    return (read_table[c] or read_table[""])(s)
  end
end
local function read_all(s)
  if type(s) == "string" then
    s = stream(s)
  end
  local l = {}
  while true do
    local form = read(s)
    if form == eof then
      break
    end
    add(l, form)
  end
  return l
end
local function read_string(str, more)
  local x = read(stream(str, more))
  if not( x == eof) then
    return x
  end
end
local function key63(atom)
  return type(atom) == "string" and #(atom) > 1 and char(atom, #(atom) - 1) == ":"
end
local function flag63(atom)
  return type(atom) == "string" and #(atom) > 1 and char(atom, 0) == ":"
end
local function expected(s, c)
  local pos = s.pos
  local more = s.more
  local _id6 = more
  local _e1
  if _id6 then
    _e1 = _id6
  else
    error("Expected " .. c .. " at " .. pos)
    _e1 = nil
  end
  return _e1
end
local function wrap(s, x)
  local y = read(s)
  if y == s.more then
    return y
  else
    return {x, y}
  end
end
local function maybe_number(str)
  if number_code63(code(str, #(str) - 1)) then
    return number(str)
  end
end
local function real63(x)
  return type(x) == "number" and not nan63(x) and not inf63(x)
end
local function valid_access63(str)
  return #(str) > 2 and not( "." == char(str, 0)) and not( "." == char(str, #(str) - 1)) and not search(str, "..")
end
local function parse_index(a, b)
  local n = number(a)
  if n == nil then
    return {"get", b, {"quote", a}}
  else
    return {"at", b, n}
  end
end
local function parse_access(str, prev)
  local _e2
  if prev then
    _e2 = {prev}
  else
    _e2 = {}
  end
  local parts = _e2
  return reduce(parse_index, rev(join(parts, split(str, "."))))
end
local function read_atom(s, basic63)
  local str = ""
  local dot63 = false
  while true do
    local c = peek_char(s)
    if not c or whitespace[c] or delimiters[c] then
      break
    end
    if c == "." then
      dot63 = true
    end
    if c == "\\" then
      read_char(s)
    end
    str = str .. read_char(s)
  end
  if str == "true" then
    return true
  else
    if str == "false" then
      return false
    else
      if str == "nan" then
        return nan
      else
        if str == "-nan" then
          return nan
        else
          if str == "inf" then
            return inf
          else
            if str == "-inf" then
              return -inf
            else
              if basic63 then
                return str
              else
                local n = maybe_number(str)
                if real63(n) then
                  return n
                else
                  if dot63 and valid_access63(str) then
                    return parse_access(str)
                  else
                    return str
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
local function read_list(s, ending)
  read_char(s)
  local r = nil
  local l = {}
  while r == nil do
    skip_non_code(s)
    local c = peek_char(s)
    if c == ending then
      read_char(s)
      r = l
    else
      if c == nil then
        r = expected(s, ending)
      else
        local x = read(s)
        if key63(x) then
          local k = clip(x, 0, #(x) - 1)
          local v = read(s)
          l[k] = v
        else
          if flag63(x) then
            l[clip(x, 1)] = true
          else
            add(l, x)
          end
        end
      end
    end
  end
  return r
end
local function read_next(s, prev, ws63)
  local _e = peek_char(s)
  if "." == _e then
    read_char(s)
    skip_non_code(s)
    if not peek_char(s) then
      return s.more or eof
    else
      local x = read_atom(s, true)
      if x == eof or x == s.more then
        return x
      else
        return read_next(s, parse_access(x, prev))
      end
    end
  else
    if "(" == _e then
      if ws63 then
        return prev
      else
        local _x11 = read_list(s, ")")
        if _x11 == s.more then
          return _x11
        else
          return read_next(s, join({prev}, _x11), skip_non_code(s))
        end
      end
    else
      return prev
    end
  end
end
read_table[""] = function (s)
  return read_next(s, read_atom(s))
end
read_table["("] = function (s)
  return read_next(s, read_list(s, ")"), skip_non_code(s))
end
read_table[")"] = function (s)
  error("Unexpected ) at " .. s.pos)
end
function ontree(f, l, ...)
  local _r23 = unstash({...})
  local skip = _r23.skip
  if not( skip and skip(l)) then
    local y = f(l)
    if y then
      return y
    end
    if not not( type(l) == "table") then
      local _l = l
      local _i = nil
      for _i in next, _l do
        local x = _l[_i]
        local _y = ontree(f, x, stash33({["skip"] = skip}))
        if _y then
          return _y
        end
      end
    end
  end
end
function hd_is63(l, val)
  return type(l) == "table" and l[1] == val
end
local function _37fn__macro(body)
  local n = -1
  local l = {}
  local any63 = nil
  ontree(function (_)
    if type(_) == "string" and #(_) <= 2 and code(_, 0) == 95 then
      any63 = true
      local c = code(_, 1)
      if c and c >= 48 and c <= 57 then
        while n < c - 48 do
          n = n + 1
          add(l, "_" .. chr(48 + n))
        end
      end
      return nil
    end
  end, body, stash33({["skip"] = function (_)
    return hd_is63(_, "%fn")
  end}))
  if any63 and #(l) == 0 then
    add(l, "_")
  end
  return {"fn", l, body}
end
setenv("%fn", stash33({["macro"] = _37fn__macro}))
read_table["["] = function (s)
  local x = read_list(s, "]")
  if x == s.more then
    return x
  else
    return read_next(s, {"%fn", x}, skip_non_code(s))
  end
end
read_table["]"] = function (s)
  error("Unexpected ] at " .. s.pos)
end
read_table["{"] = function (s)
  local x = read_list(s, "}")
  if x == s.more then
    return x
  else
    local e = x[1]
    x = cut(x, 1)
    while #(x) > 1 do
      local op = x[1]
      local a = x[2]
      local bs = cut(x, 2)
      e = {op, e, a}
      x = bs
    end
    return read_next(s, e, skip_non_code(s))
  end
end
read_table["}"] = function (s)
  error("Unexpected } at " .. s.pos)
end
read_table["\""] = function (s)
  read_char(s)
  local r = nil
  local str = "\""
  while r == nil do
    local c = peek_char(s)
    if c == "\"" then
      r = str .. read_char(s)
    else
      if c == nil then
        r = expected(s, "\"")
      else
        if c == "\\" then
          str = str .. read_char(s)
        end
        str = str .. read_char(s)
      end
    end
  end
  return r
end
read_table["|"] = function (s)
  read_char(s)
  local r = nil
  local str = "|"
  while r == nil do
    local c = peek_char(s)
    if c == "|" then
      r = str .. read_char(s)
    else
      if c == nil then
        r = expected(s, "|")
      else
        str = str .. read_char(s)
      end
    end
  end
  return r
end
read_table["'"] = function (s)
  read_char(s)
  return wrap(s, "quote")
end
read_table["`"] = function (s)
  read_char(s)
  return wrap(s, "quasiquote")
end
read_table[","] = function (s)
  read_char(s)
  if peek_char(s) == "@" then
    read_char(s)
    return wrap(s, "unquote-splicing")
  else
    return wrap(s, "unquote")
  end
end
return {["read-string"] = read_string, ["read-all"] = read_all, ["read"] = read, ["read-table"] = read_table, ["stream"] = stream}
