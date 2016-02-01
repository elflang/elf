setenv("defreader", {_stash = true, macro = function (_x6, ...)
  local _id2 = _x6
  local char = _id2[1]
  local s = _id2[2]
  local _r1 = unstash({...})
  local _id3 = _r1
  local body = cut(_id3, 0)
  return({"=", {"get", "read-table", char}, join({"fn", {s}}, body)})
end})
local delimiters = {["("] = true, [")"] = true, [";"] = true, ["]"] = true, ["\n"] = true, ["["] = true}
local whitespace = {[" "] = true, ["\n"] = true, ["\t"] = true}
local function stream(str, more)
  return({more = more, pos = 0, len = _35(str), string = str})
end
local function peek_char(s)
  local _id4 = s
  local pos = _id4.pos
  local len = _id4.len
  local string = _id4.string
  if pos < len then
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
    if nil63(c) then
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
  if is63(c) then
    return((read_table[c] or read_table[""])(s))
  else
    return(eof)
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
  return(string63(atom) and _35(atom) > 1 and char(atom, edge(atom)) == ":")
end
local function flag63(atom)
  return(string63(atom) and _35(atom) > 1 and char(atom, 0) == ":")
end
local function expected(s, c)
  local _id5 = s
  local more = _id5.more
  local pos = _id5.pos
  local _id6 = more
  local _e2
  if _id6 then
    _e2 = _id6
  else
    error("Expected " .. c .. " at " .. pos)
    _e2 = nil
  end
  return(_e2)
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
  return(number63(x) and not nan63(x) and not inf63(x))
end
local function valid_access63(str)
  return(_35(str) > 2 and not( "." == char(str, 0)) and not( "." == char(str, edge(str))) and not search(str, ".."))
end
local function parse_index(a, b)
  local n = number(a)
  if is63(n) then
    return({"at", b, n})
  else
    return({"get", b, {"quote", a}})
  end
end
local function parse_access(str)
  return(reduce(parse_index, reverse(split(str, "."))))
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
  while nil63(r) do
    skip_non_code(s)
    local c = peek_char(s)
    if c == ending then
      read_char(s)
      r = l
    else
      if nil63(c) then
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
    return(read_next(s, parse_index(read_atom(s), prev)))
  else
    if "(" == _e then
      if ws63 then
        return(prev)
      else
        local x = join({prev}, read_list(s, ")"))
        return(read_next(s, x, skip_non_code(s)))
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
  local _x20 = body
  local _n1 = _35(_x20)
  local _i1 = 0
  while _i1 < _n1 do
    local x = _x20[_i1 + 1]
    if string63(x) and two63(x) and code(x, 0) == 95 then
      if number_code63(code(x, 1)) then
        n = max(n, code(x, 1) - 48)
      end
    end
    _i1 = _i1 + 1
  end
  local i = 0
  while i < n + 1 do
    add(l, "_" .. str(i))
    i = i + 1
  end
  local _e3
  if none63(l) then
    _e3 = {"_"}
  else
    _e3 = l
  end
  return({"fn", _e3, body})
end})
read_table["["] = function (s)
  return(read_next(s, {"%fn", read_list(s, "]")}, skip_non_code(s)))
end
read_table["]"] = function (s)
  error("Unexpected ] at " .. s.pos)
end
read_table["\""] = function (s)
  read_char(s)
  local r = nil
  local str = "\""
  while nil63(r) do
    local c = peek_char(s)
    if c == "\"" then
      r = str .. read_char(s)
    else
      if nil63(c) then
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
  while nil63(r) do
    local c = peek_char(s)
    if c == "|" then
      r = str .. read_char(s)
    else
      if nil63(c) then
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
