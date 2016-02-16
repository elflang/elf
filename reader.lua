setenv("defreader", {_stash = true, macro = function (_x6, ...)
  local char = _x6[1]
  local s = _x6[2]
  local _r1 = unstash({...})
  local body = cut(_r1, 0)
  return({"=", {"get", "read-table", char}, join({"fn", {s}}, body)})
end})
local delimiters = {["("] = true, [")"] = true, [";"] = true, ["]"] = true, ["\n"] = true, ["["] = true}
local whitespace = {[" "] = true, ["\n"] = true, ["\t"] = true}
local function stream(str, more)
  return({more = more, pos = 0, len = #(str), string = str})
end
local function peek_char(s)
  local pos = s.pos
  local _len = s.len
  local string = s.string
  if pos < _len then
    return(char(string, pos))
  end
end
local function read_char(s)
  local c = peek_char(s)
  if c then
    s.pos = s.pos + 1
    return(c)
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
  return(any63)
end
local read_table = {}
local eof = {}
local function read(s)
  skip_non_code(s)
  local c = peek_char(s)
  if c == nil then
    return(eof)
  else
    return((read_table[c] or read_table[""])(s))
  end
end
local function read_all(s)
  local l = {}
  while true do
    local form = read(s)
    if form == eof then
      break
    end
    add(l, form)
  end
  return(l)
end
local function read_string(str, more)
  local x = read(stream(str, more))
  if not( x == eof) then
    return(x)
  end
end
local function key63(atom)
  return(type(atom) == "string" and #(atom) > 1 and char(atom, edge(atom)) == ":")
end
local function flag63(atom)
  return(type(atom) == "string" and #(atom) > 1 and char(atom, 0) == ":")
end
local function expected(s, c)
  local more = s.more
  local pos = s.pos
  local _id6 = more
  local _e1
  if _id6 then
    _e1 = _id6
  else
    error("Expected " .. c .. " at " .. pos)
    _e1 = nil
  end
  return(_e1)
end
local function wrap(s, x)
  local y = read(s)
  if y == s.more then
    return(y)
  else
    return({x, y})
  end
end
local function maybe_number(str)
  if number_code63(code(str, edge(str))) then
    return(number(str))
  end
end
local function real63(x)
  return(type(x) == "number" and not nan63(x) and not inf63(x))
end
local function valid_access63(str)
  return(#(str) > 2 and not( "." == char(str, 0)) and not( "." == char(str, edge(str))) and not search(str, ".."))
end
local function parse_index(a, b)
  local n = number(a)
  if n == nil then
    return({"get", b, {"quote", a}})
  else
    return({"at", b, n})
  end
end
local function parse_access(str)
  return(reduce(parse_index, rev(split(str, "."))))
end
local function read_atom(s)
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
    str = str .. read_char(s)
  end
  if str == "true" then
    return(true)
  else
    if str == "false" then
      return(false)
    else
      if str == "nan" then
        return(nan)
      else
        if str == "-nan" then
          return(nan)
        else
          if str == "inf" then
            return(inf)
          else
            if str == "-inf" then
              return(-inf)
            else
              local n = maybe_number(str)
              if real63(n) then
                return(n)
              else
                if dot63 and valid_access63(str) then
                  return(parse_access(str))
                else
                  return(str)
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
          local k = clip(x, 0, edge(x))
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
  return(r)
end
local function read_next(s, prev, ws63)
  local _e = peek_char(s)
  if "." == _e then
    read_char(s)
    skip_non_code(s)
    if not peek_char(s) then
      return(s.more or eof)
    else
      local x = read_atom(s)
      if x == eof or x == s.more then
        return(x)
      else
        return(read_next(s, parse_index(x, prev)))
      end
    end
  else
    if "(" == _e then
      if ws63 then
        return(prev)
      else
        local _x16 = read_list(s, ")")
        if _x16 == s.more then
          return(_x16)
        else
          return(read_next(s, join({prev}, _x16), skip_non_code(s)))
        end
      end
    else
      return(prev)
    end
  end
end
read_table[""] = function (s)
  return(read_next(s, read_atom(s)))
end
read_table["("] = function (s)
  return(read_next(s, read_list(s, ")"), skip_non_code(s)))
end
read_table[")"] = function (s)
  error("Unexpected ) at " .. s.pos)
end
setenv("%fn", {_stash = true, macro = function (body)
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
      return(nil)
    end
  end, body, {_stash = true, skip = function (_)
    return(hd_is63(_, "%fn"))
  end})
  if any63 and #(l) == 0 then
    add(l, "_")
  end
  return({"fn", l, body})
end})
read_table["["] = function (s)
  local x = read_list(s, "]")
  if x == s.more then
    return(x)
  else
    return(read_next(s, {"%fn", x}, skip_non_code(s)))
  end
end
read_table["]"] = function (s)
  error("Unexpected ] at " .. s.pos)
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
  return(r)
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
  return(r)
end
read_table["'"] = function (s)
  read_char(s)
  return(wrap(s, "quote"))
end
read_table["`"] = function (s)
  read_char(s)
  return(wrap(s, "quasiquote"))
end
read_table[","] = function (s)
  read_char(s)
  if peek_char(s) == "@" then
    read_char(s)
    return(wrap(s, "unquote-splicing"))
  else
    return(wrap(s, "unquote"))
  end
end
return({["read-string"] = read_string, ["read-all"] = read_all, read = read, ["read-table"] = read_table, stream = stream})
