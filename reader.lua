local function defreader__macro(_x, ...)
  local _char = _x[1]
  local _s = _x[2]
  local __r = unstash({...})
  local _body = cut(__r, 0)
  return {"=", {"get", "read-table", _char}, join({"fn", {_s}}, _body)}
end
setenv("defreader", stash33({["macro"] = defreader__macro}))
local delimiters = {["["] = true, [")"] = true, ["}"] = true, [";"] = true, ["]"] = true, ["\n"] = true, ["\r"] = true, ["{"] = true, ["("] = true}
local whitespace = {["\t"] = true, ["\r"] = true, [" "] = true, ["\n"] = true}
local function stream(str, more)
  return {["len"] = #(str), ["pos"] = 0, ["more"] = more, ["string"] = str}
end
local function peek_char(s)
  local _len = s.len
  local _pos = s.pos
  local _string = s.string
  if _pos < _len then
    return char(_string, _pos)
  end
end
local function read_char(s)
  local _c = peek_char(s)
  if _c then
    s.pos = s.pos + 1
    return _c
  end
end
local function skip_non_code(s)
  local _any63 = nil
  while true do
    local _c1 = peek_char(s)
    if _c1 == nil then
      break
    else
      if whitespace[_c1] then
        read_char(s)
      else
        if _c1 == ";" then
          while _c1 and not( _c1 == "\n") do
            _c1 = read_char(s)
          end
          skip_non_code(s)
        else
          break
        end
      end
    end
    _any63 = true
  end
  return _any63
end
local read_table = {}
local eof = {}
local function read(s)
  skip_non_code(s)
  local _c2 = peek_char(s)
  if _c2 == nil then
    return eof
  else
    return (read_table[_c2] or read_table[""])(s)
  end
end
local function read_all(s)
  if type(s) == "string" then
    s = stream(s)
  end
  local _l = {}
  while true do
    local _form = read(s)
    if _form == eof then
      break
    end
    add(_l, _form)
  end
  return _l
end
local function read_string(str, more)
  local _x6 = read(stream(str, more))
  if not( _x6 == eof) then
    return _x6
  end
end
local function key63(atom)
  return type(atom) == "string" and #(atom) > 1 and char(atom, #(atom) - 1) == ":"
end
local function flag63(atom)
  return type(atom) == "string" and #(atom) > 1 and char(atom, 0) == ":"
end
local function expected(s, c)
  local _pos1 = s.pos
  local _more = s.more
  local _id6 = _more
  local _e2
  if _id6 then
    _e2 = _id6
  else
    error("Expected " .. c .. " at " .. _pos1)
    _e2 = nil
  end
  return _e2
end
local function wrap(s, x)
  local _y = read(s)
  if _y == s.more then
    return _y
  else
    return {x, _y}
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
  local _n = number(a)
  if _n == nil then
    return {"get", b, {"quote", a}}
  else
    return {"at", b, _n}
  end
end
local function parse_access(str, prev)
  local _e3
  if prev then
    _e3 = {prev}
  else
    _e3 = {}
  end
  local _parts = _e3
  return reduce(parse_index, rev(join(_parts, split(str, "."))))
end
local function read_atom(s, basic63)
  local _str = ""
  local _dot63 = false
  while true do
    local _c3 = peek_char(s)
    if not _c3 or whitespace[_c3] or delimiters[_c3] then
      break
    end
    if _c3 == "." then
      _dot63 = true
    end
    if _c3 == "\\" then
      read_char(s)
    end
    _str = _str .. read_char(s)
  end
  if _str == "true" then
    return true
  else
    if _str == "false" then
      return false
    else
      if _str == "nan" then
        return nan
      else
        if _str == "-nan" then
          return nan
        else
          if _str == "inf" then
            return inf
          else
            if _str == "-inf" then
              return -inf
            else
              if basic63 then
                return _str
              else
                local _n1 = maybe_number(_str)
                if real63(_n1) then
                  return _n1
                else
                  if _dot63 and valid_access63(_str) then
                    return parse_access(_str)
                  else
                    return _str
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
  local _r19 = nil
  local _l1 = {}
  while _r19 == nil do
    skip_non_code(s)
    local _c4 = peek_char(s)
    if _c4 == ending then
      read_char(s)
      _r19 = _l1
    else
      if _c4 == nil then
        _r19 = expected(s, ending)
      else
        local _x12 = read(s)
        if key63(_x12) then
          local _k = clip(_x12, 0, #(_x12) - 1)
          local _v = read(s)
          _l1[_k] = _v
        else
          if flag63(_x12) then
            _l1[clip(_x12, 1)] = true
          else
            add(_l1, _x12)
          end
        end
      end
    end
  end
  return _r19
end
local function read_next(s, prev, ws63)
  local __e = peek_char(s)
  if "." == __e then
    read_char(s)
    skip_non_code(s)
    if not peek_char(s) then
      return s.more or eof
    else
      local _x13 = read_atom(s, true)
      if _x13 == eof or _x13 == s.more then
        return _x13
      else
        return read_next(s, parse_access(_x13, prev))
      end
    end
  else
    if "(" == __e then
      if ws63 then
        return prev
      else
        local _x14 = read_list(s, ")")
        if _x14 == s.more then
          return _x14
        else
          return read_next(s, join({prev}, _x14), skip_non_code(s))
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
  local __r24 = unstash({...})
  local _skip = __r24.skip
  if not( _skip and _skip(l)) then
    local _y1 = f(l)
    if _y1 then
      return _y1
    end
    if not not( type(l) == "table") then
      local __l2 = l
      local __i = nil
      for __i in next, __l2 do
        local _x17 = __l2[__i]
        local _y2 = ontree(f, _x17, stash33({["skip"] = _skip}))
        if _y2 then
          return _y2
        end
      end
    end
  end
end
function hd_is63(l, val)
  return type(l) == "table" and l[1] == val
end
local function _37fn__macro(body)
  local _n3 = -1
  local _l3 = {}
  local _any631 = nil
  ontree(function (_)
    if type(_) == "string" and #(_) <= 2 and code(_, 0) == 95 then
      _any631 = true
      local c = code(_, 1)
      if c and c >= 48 and c <= 57 then
        while _n3 < c - 48 do
          _n3 = _n3 + 1
          add(_l3, "_" .. chr(48 + _n3))
        end
      end
      return nil
    end
  end, body, stash33({["skip"] = function (_)
    return hd_is63(_, "%fn")
  end}))
  if _any631 and #(_l3) == 0 then
    add(_l3, "_")
  end
  return {"fn", _l3, body}
end
setenv("%fn", stash33({["macro"] = _37fn__macro}))
read_table["["] = function (s)
  local _x19 = read_list(s, "]")
  if _x19 == s.more then
    return _x19
  else
    return read_next(s, {"%fn", _x19}, skip_non_code(s))
  end
end
read_table["]"] = function (s)
  error("Unexpected ] at " .. s.pos)
end
read_table["{"] = function (s)
  local _x21 = read_list(s, "}")
  if _x21 == s.more then
    return _x21
  else
    local _e1 = _x21[1]
    _x21 = cut(_x21, 1)
    while #(_x21) > 1 do
      local _op = _x21[1]
      local _a = _x21[2]
      local _bs = cut(_x21, 2)
      _e1 = {_op, _e1, _a}
      _x21 = _bs
    end
    return read_next(s, _e1, skip_non_code(s))
  end
end
read_table["}"] = function (s)
  error("Unexpected } at " .. s.pos)
end
read_table["\""] = function (s)
  read_char(s)
  local _r34 = nil
  local _str1 = "\""
  while _r34 == nil do
    local _c5 = peek_char(s)
    if _c5 == "\"" then
      _r34 = _str1 .. read_char(s)
    else
      if _c5 == nil then
        _r34 = expected(s, "\"")
      else
        if _c5 == "\\" then
          _str1 = _str1 .. read_char(s)
        end
        _str1 = _str1 .. read_char(s)
      end
    end
  end
  return _r34
end
read_table["|"] = function (s)
  read_char(s)
  local _r36 = nil
  local _str2 = "|"
  while _r36 == nil do
    local _c6 = peek_char(s)
    if _c6 == "|" then
      _r36 = _str2 .. read_char(s)
    else
      if _c6 == nil then
        _r36 = expected(s, "|")
      else
        _str2 = _str2 .. read_char(s)
      end
    end
  end
  return _r36
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
