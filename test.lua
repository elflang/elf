require("elf")
local reader = require("reader")
local compiler = require("compiler")
local passed = 0
local failed = 0
local tests = {}
setenv("test", {_stash = true, macro = function (x, msg)
  return({"if", {"not", x}, {"do", {"=", "failed", {"+", "failed", 1}}, {"return", msg}}, {"inc", "passed"}})
end})
local function equal63(a, b)
  if not( type(a) == "table") then
    return(a == b)
  else
    return(str(a) == str(b))
  end
end
setenv("eq", {_stash = true, macro = function (a, b)
  return({"test", {"equal?", a, b}, {"cat", "\"failed: expected \"", {"str", a}, "\", was \"", {"str", b}}})
end})
setenv("deftest", {_stash = true, macro = function (name, ...)
  local _r6 = unstash({...})
  local _id1 = _r6
  local body = cut(_id1, 0)
  return({"add", "tests", {"list", {"quote", name}, {"%fn", join({"do"}, body)}}})
end})
function run_tests()
  local _l = tests
  local _i = nil
  for _i in next, _l do
    local _id2 = _l[_i]
    local name = _id2[1]
    local f = _id2[2]
    local result = f()
    if type(result) == "string" then
      print(" " .. name .. " " .. result)
    end
  end
  return(print(" " .. passed .. " passed, " .. failed .. " failed"))
end
add(tests, {"reader", function ()
  local read = reader["read-string"]
  if not equal63(nil, read("")) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(read("")))
  else
    passed = passed + 1
  end
  if not equal63("nil", read("nil")) then
    failed = failed + 1
    return("failed: expected " .. str("nil") .. ", was " .. str(read("nil")))
  else
    passed = passed + 1
  end
  if not equal63(17, read("17")) then
    failed = failed + 1
    return("failed: expected " .. str(17) .. ", was " .. str(read("17")))
  else
    passed = passed + 1
  end
  if not equal63(0.015, read("1.5e-2")) then
    failed = failed + 1
    return("failed: expected " .. str(0.015) .. ", was " .. str(read("1.5e-2")))
  else
    passed = passed + 1
  end
  if not equal63(true, read("true")) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(read("true")))
  else
    passed = passed + 1
  end
  if not equal63(not true, read("false")) then
    failed = failed + 1
    return("failed: expected " .. str(not true) .. ", was " .. str(read("false")))
  else
    passed = passed + 1
  end
  if not equal63("hi", read("hi")) then
    failed = failed + 1
    return("failed: expected " .. str("hi") .. ", was " .. str(read("hi")))
  else
    passed = passed + 1
  end
  if not equal63("\"hi\"", read("\"hi\"")) then
    failed = failed + 1
    return("failed: expected " .. str("\"hi\"") .. ", was " .. str(read("\"hi\"")))
  else
    passed = passed + 1
  end
  if not equal63("|hi|", read("|hi|")) then
    failed = failed + 1
    return("failed: expected " .. str("|hi|") .. ", was " .. str(read("|hi|")))
  else
    passed = passed + 1
  end
  if not equal63({1, 2}, read("(1 2)")) then
    failed = failed + 1
    return("failed: expected " .. str({1, 2}) .. ", was " .. str(read("(1 2)")))
  else
    passed = passed + 1
  end
  if not equal63({1, {"a"}}, read("(1 (a))")) then
    failed = failed + 1
    return("failed: expected " .. str({1, {"a"}}) .. ", was " .. str(read("(1 (a))")))
  else
    passed = passed + 1
  end
  if not equal63({"quote", "a"}, read("'a")) then
    failed = failed + 1
    return("failed: expected " .. str({"quote", "a"}) .. ", was " .. str(read("'a")))
  else
    passed = passed + 1
  end
  if not equal63({"quasiquote", "a"}, read("`a")) then
    failed = failed + 1
    return("failed: expected " .. str({"quasiquote", "a"}) .. ", was " .. str(read("`a")))
  else
    passed = passed + 1
  end
  if not equal63({"quasiquote", {"unquote", "a"}}, read("`,a")) then
    failed = failed + 1
    return("failed: expected " .. str({"quasiquote", {"unquote", "a"}}) .. ", was " .. str(read("`,a")))
  else
    passed = passed + 1
  end
  if not equal63({"quasiquote", {"unquote-splicing", "a"}}, read("`,@a")) then
    failed = failed + 1
    return("failed: expected " .. str({"quasiquote", {"unquote-splicing", "a"}}) .. ", was " .. str(read("`,@a")))
  else
    passed = passed + 1
  end
  if not equal63(2, #(read("(1 2 a: 7)"))) then
    failed = failed + 1
    return("failed: expected " .. str(2) .. ", was " .. str(#(read("(1 2 a: 7)"))))
  else
    passed = passed + 1
  end
  if not equal63(7, read("(1 2 a: 7)").a) then
    failed = failed + 1
    return("failed: expected " .. str(7) .. ", was " .. str(read("(1 2 a: 7)").a))
  else
    passed = passed + 1
  end
  if not equal63(true, read("(:a)").a) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(read("(:a)").a))
  else
    passed = passed + 1
  end
  if not equal63(1, - -1) then
    failed = failed + 1
    return("failed: expected " .. str(1) .. ", was " .. str(- -1))
  else
    passed = passed + 1
  end
  if not equal63(true, nan63(read("nan"))) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(nan63(read("nan"))))
  else
    passed = passed + 1
  end
  if not equal63(true, nan63(read("-nan"))) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(nan63(read("-nan"))))
  else
    passed = passed + 1
  end
  if not equal63(true, inf63(read("inf"))) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(inf63(read("inf"))))
  else
    passed = passed + 1
  end
  if not equal63(true, inf63(read("-inf"))) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(inf63(read("-inf"))))
  else
    passed = passed + 1
  end
  if not equal63("0?", read("0?")) then
    failed = failed + 1
    return("failed: expected " .. str("0?") .. ", was " .. str(read("0?")))
  else
    passed = passed + 1
  end
  if not equal63("0!", read("0!")) then
    failed = failed + 1
    return("failed: expected " .. str("0!") .. ", was " .. str(read("0!")))
  else
    passed = passed + 1
  end
  if not equal63("0.", read("0.")) then
    failed = failed + 1
    return("failed: expected " .. str("0.") .. ", was " .. str(read("0.")))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"read-more", function ()
  local read = reader["read-string"]
  if not equal63(17, read("17", true)) then
    failed = failed + 1
    return("failed: expected " .. str(17) .. ", was " .. str(read("17", true)))
  else
    passed = passed + 1
  end
  local more = {}
  if not equal63(more, read("(open", more)) then
    failed = failed + 1
    return("failed: expected " .. str(more) .. ", was " .. str(read("(open", more)))
  else
    passed = passed + 1
  end
  if not equal63(more, read("\"unterminated ", more)) then
    failed = failed + 1
    return("failed: expected " .. str(more) .. ", was " .. str(read("\"unterminated ", more)))
  else
    passed = passed + 1
  end
  if not equal63(more, read("|identifier", more)) then
    failed = failed + 1
    return("failed: expected " .. str(more) .. ", was " .. str(read("|identifier", more)))
  else
    passed = passed + 1
  end
  if not equal63(more, read("'(a b c", more)) then
    failed = failed + 1
    return("failed: expected " .. str(more) .. ", was " .. str(read("'(a b c", more)))
  else
    passed = passed + 1
  end
  if not equal63(more, read("`(a b c", more)) then
    failed = failed + 1
    return("failed: expected " .. str(more) .. ", was " .. str(read("`(a b c", more)))
  else
    passed = passed + 1
  end
  if not equal63(more, read("`(a b ,(z", more)) then
    failed = failed + 1
    return("failed: expected " .. str(more) .. ", was " .. str(read("`(a b ,(z", more)))
  else
    passed = passed + 1
  end
  if not equal63(more, read("`\"biz", more)) then
    failed = failed + 1
    return("failed: expected " .. str(more) .. ", was " .. str(read("`\"biz", more)))
  else
    passed = passed + 1
  end
  if not equal63(more, read("'\"boz", more)) then
    failed = failed + 1
    return("failed: expected " .. str(more) .. ", was " .. str(read("'\"boz", more)))
  else
    passed = passed + 1
  end
  local _x56 = nil
  local _msg = nil
  local _trace = nil
  local _e6
  if xpcall(function ()
    _x56 = read("(open")
    return(_x56)
  end, function (_)
    _msg = clip(_, search(_, ": ") + 2)
    _trace = debug.traceback()
    return(_trace)
  end) then
    _e6 = {true, _x56}
  else
    _e6 = {false, _msg, _trace}
  end
  local _id3 = _e6
  local ok = _id3[1]
  local msg = _id3[2]
  if not equal63(false, ok) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(ok))
  else
    passed = passed + 1
  end
  if not equal63("Expected ) at 5", msg) then
    failed = failed + 1
    return("failed: expected " .. str("Expected ) at 5") .. ", was " .. str(msg))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"boolean", function ()
  if not equal63(true, true or false) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(true or false))
  else
    passed = passed + 1
  end
  if not equal63(false, false or false) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(false or false))
  else
    passed = passed + 1
  end
  if not equal63(true, false or false or true) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(false or false or true))
  else
    passed = passed + 1
  end
  if not equal63(true, not false) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(not false))
  else
    passed = passed + 1
  end
  if not equal63(true, not( false and true)) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(not( false and true)))
  else
    passed = passed + 1
  end
  if not equal63(false, not( false or true)) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(not( false or true)))
  else
    passed = passed + 1
  end
  if not equal63(true, not( false and true)) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(not( false and true)))
  else
    passed = passed + 1
  end
  if not equal63(false, not( false or true)) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(not( false or true)))
  else
    passed = passed + 1
  end
  if not equal63(true, true and true) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(true and true))
  else
    passed = passed + 1
  end
  if not equal63(false, true and false) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(true and false))
  else
    passed = passed + 1
  end
  if not equal63(false, true and true and false) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(true and true and false))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"short", function ()
  local _id46 = true
  local _e7
  if _id46 then
    _e7 = _id46
  else
    error("bad")
    _e7 = nil
  end
  if not equal63(true, _e7) then
    failed = failed + 1
    local _id47 = true
    local _e8
    if _id47 then
      _e8 = _id47
    else
      error("bad")
      _e8 = nil
    end
    return("failed: expected " .. str(true) .. ", was " .. str(_e8))
  else
    passed = passed + 1
  end
  local _id48 = false
  local _e9
  if _id48 then
    error("bad")
    _e9 = nil
  else
    _e9 = _id48
  end
  if not equal63(false, _e9) then
    failed = failed + 1
    local _id49 = false
    local _e10
    if _id49 then
      error("bad")
      _e10 = nil
    else
      _e10 = _id49
    end
    return("failed: expected " .. str(false) .. ", was " .. str(_e10))
  else
    passed = passed + 1
  end
  local a = true
  local _id50 = true
  local _e11
  if _id50 then
    _e11 = _id50
  else
    a = false
    _e11 = false
  end
  if not equal63(true, _e11) then
    failed = failed + 1
    local _id51 = true
    local _e12
    if _id51 then
      _e12 = _id51
    else
      a = false
      _e12 = false
    end
    return("failed: expected " .. str(true) .. ", was " .. str(_e12))
  else
    passed = passed + 1
  end
  if not equal63(true, a) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  local _id52 = false
  local _e13
  if _id52 then
    a = false
    _e13 = true
  else
    _e13 = _id52
  end
  if not equal63(false, _e13) then
    failed = failed + 1
    local _id53 = false
    local _e14
    if _id53 then
      a = false
      _e14 = true
    else
      _e14 = _id53
    end
    return("failed: expected " .. str(false) .. ", was " .. str(_e14))
  else
    passed = passed + 1
  end
  if not equal63(true, a) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  local b = true
  b = false
  local _id54 = false
  local _e15
  if _id54 then
    _e15 = _id54
  else
    b = true
    _e15 = b
  end
  if not equal63(true, _e15) then
    failed = failed + 1
    b = false
    local _id55 = false
    local _e16
    if _id55 then
      _e16 = _id55
    else
      b = true
      _e16 = b
    end
    return("failed: expected " .. str(true) .. ", was " .. str(_e16))
  else
    passed = passed + 1
  end
  if not equal63(true, b) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(b))
  else
    passed = passed + 1
  end
  b = true
  local _id56 = b
  local _e17
  if _id56 then
    _e17 = _id56
  else
    b = true
    _e17 = b
  end
  if not equal63(true, _e17) then
    failed = failed + 1
    b = true
    local _id57 = b
    local _e18
    if _id57 then
      _e18 = _id57
    else
      b = true
      _e18 = b
    end
    return("failed: expected " .. str(true) .. ", was " .. str(_e18))
  else
    passed = passed + 1
  end
  if not equal63(true, b) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(b))
  else
    passed = passed + 1
  end
  b = false
  local _id58 = true
  local _e19
  if _id58 then
    b = true
    _e19 = b
  else
    _e19 = _id58
  end
  if not equal63(true, _e19) then
    failed = failed + 1
    b = false
    local _id59 = true
    local _e20
    if _id59 then
      b = true
      _e20 = b
    else
      _e20 = _id59
    end
    return("failed: expected " .. str(true) .. ", was " .. str(_e20))
  else
    passed = passed + 1
  end
  if not equal63(true, b) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(b))
  else
    passed = passed + 1
  end
  b = false
  local _id60 = b
  local _e21
  if _id60 then
    b = true
    _e21 = b
  else
    _e21 = _id60
  end
  if not equal63(false, _e21) then
    failed = failed + 1
    b = false
    local _id61 = b
    local _e22
    if _id61 then
      b = true
      _e22 = b
    else
      _e22 = _id61
    end
    return("failed: expected " .. str(false) .. ", was " .. str(_e22))
  else
    passed = passed + 1
  end
  if not equal63(false, b) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(b))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"numeric", function ()
  if not equal63(4, 2 + 2) then
    failed = failed + 1
    return("failed: expected " .. str(4) .. ", was " .. str(2 + 2))
  else
    passed = passed + 1
  end
  if not equal63(4, apply(_43, {2, 2})) then
    failed = failed + 1
    return("failed: expected " .. str(4) .. ", was " .. str(apply(_43, {2, 2})))
  else
    passed = passed + 1
  end
  if not equal63(0, apply(_43, {})) then
    failed = failed + 1
    return("failed: expected " .. str(0) .. ", was " .. str(apply(_43, {})))
  else
    passed = passed + 1
  end
  if not equal63(18, 18) then
    failed = failed + 1
    return("failed: expected " .. str(18) .. ", was " .. str(18))
  else
    passed = passed + 1
  end
  if not equal63(4, 7 - 3) then
    failed = failed + 1
    return("failed: expected " .. str(4) .. ", was " .. str(7 - 3))
  else
    passed = passed + 1
  end
  if not equal63(4, apply(_, {7, 3})) then
    failed = failed + 1
    return("failed: expected " .. str(4) .. ", was " .. str(apply(_, {7, 3})))
  else
    passed = passed + 1
  end
  if not equal63(0, apply(_, {})) then
    failed = failed + 1
    return("failed: expected " .. str(0) .. ", was " .. str(apply(_, {})))
  else
    passed = passed + 1
  end
  if not equal63(5, 10 / 2) then
    failed = failed + 1
    return("failed: expected " .. str(5) .. ", was " .. str(10 / 2))
  else
    passed = passed + 1
  end
  if not equal63(5, apply(_47, {10, 2})) then
    failed = failed + 1
    return("failed: expected " .. str(5) .. ", was " .. str(apply(_47, {10, 2})))
  else
    passed = passed + 1
  end
  if not equal63(1, apply(_47, {})) then
    failed = failed + 1
    return("failed: expected " .. str(1) .. ", was " .. str(apply(_47, {})))
  else
    passed = passed + 1
  end
  if not equal63(6, 2 * 3) then
    failed = failed + 1
    return("failed: expected " .. str(6) .. ", was " .. str(2 * 3))
  else
    passed = passed + 1
  end
  if not equal63(6, apply(_42, {2, 3})) then
    failed = failed + 1
    return("failed: expected " .. str(6) .. ", was " .. str(apply(_42, {2, 3})))
  else
    passed = passed + 1
  end
  if not equal63(1, apply(_42, {})) then
    failed = failed + 1
    return("failed: expected " .. str(1) .. ", was " .. str(apply(_42, {})))
  else
    passed = passed + 1
  end
  if not equal63(true, 2.01 > 2) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(2.01 > 2))
  else
    passed = passed + 1
  end
  if not equal63(true, 5 >= 5) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(5 >= 5))
  else
    passed = passed + 1
  end
  if not equal63(true, 2100 > 2000) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(2100 > 2000))
  else
    passed = passed + 1
  end
  if not equal63(true, 0.002 < 0.0021) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(0.002 < 0.0021))
  else
    passed = passed + 1
  end
  if not equal63(false, 2 < 2) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(2 < 2))
  else
    passed = passed + 1
  end
  if not equal63(true, 2 <= 2) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(2 <= 2))
  else
    passed = passed + 1
  end
  if not equal63(-7, - 7) then
    failed = failed + 1
    return("failed: expected " .. str(-7) .. ", was " .. str(- 7))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"math", function ()
  if not equal63(3, max(1, 3)) then
    failed = failed + 1
    return("failed: expected " .. str(3) .. ", was " .. str(max(1, 3)))
  else
    passed = passed + 1
  end
  if not equal63(2, min(2, 7)) then
    failed = failed + 1
    return("failed: expected " .. str(2) .. ", was " .. str(min(2, 7)))
  else
    passed = passed + 1
  end
  local n = random()
  if not equal63(true, n > 0 and n < 1) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(n > 0 and n < 1))
  else
    passed = passed + 1
  end
  if not equal63(4, floor(4.78)) then
    failed = failed + 1
    return("failed: expected " .. str(4) .. ", was " .. str(floor(4.78)))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"precedence", function ()
  if not equal63(-3, -( 1 + 2)) then
    failed = failed + 1
    return("failed: expected " .. str(-3) .. ", was " .. str(-( 1 + 2)))
  else
    passed = passed + 1
  end
  if not equal63(10, 12 - (1 + 1)) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(12 - (1 + 1)))
  else
    passed = passed + 1
  end
  if not equal63(11, 12 - 1 * 1) then
    failed = failed + 1
    return("failed: expected " .. str(11) .. ", was " .. str(12 - 1 * 1))
  else
    passed = passed + 1
  end
  if not equal63(10, 4 / 2 + 8) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(4 / 2 + 8))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"standalone", function ()
  if not equal63(10, 10) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(10))
  else
    passed = passed + 1
  end
  local x = nil
  x = 10
  if not equal63(9, 9) then
    failed = failed + 1
    x = 10
    return("failed: expected " .. str(9) .. ", was " .. str(9))
  else
    passed = passed + 1
  end
  if not equal63(10, x) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(x))
  else
    passed = passed + 1
  end
  if not equal63(12, 12) then
    failed = failed + 1
    return("failed: expected " .. str(12) .. ", was " .. str(12))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"string", function ()
  if not equal63(3, #("foo")) then
    failed = failed + 1
    return("failed: expected " .. str(3) .. ", was " .. str(#("foo")))
  else
    passed = passed + 1
  end
  if not equal63(3, #("\"a\"")) then
    failed = failed + 1
    return("failed: expected " .. str(3) .. ", was " .. str(#("\"a\"")))
  else
    passed = passed + 1
  end
  if not equal63("a", "a") then
    failed = failed + 1
    return("failed: expected " .. str("a") .. ", was " .. str("a"))
  else
    passed = passed + 1
  end
  if not equal63("a", char("bar", 1)) then
    failed = failed + 1
    return("failed: expected " .. str("a") .. ", was " .. str(char("bar", 1)))
  else
    passed = passed + 1
  end
  local s = "a\nb"
  if not equal63(3, #(s)) then
    failed = failed + 1
    return("failed: expected " .. str(3) .. ", was " .. str(#(s)))
  else
    passed = passed + 1
  end
  local _s = "a\nb\nc"
  if not equal63(5, #(_s)) then
    failed = failed + 1
    return("failed: expected " .. str(5) .. ", was " .. str(#(_s)))
  else
    passed = passed + 1
  end
  if not equal63(3, #("a\nb")) then
    failed = failed + 1
    return("failed: expected " .. str(3) .. ", was " .. str(#("a\nb")))
  else
    passed = passed + 1
  end
  if not equal63(3, #("a\\b")) then
    failed = failed + 1
    return("failed: expected " .. str(3) .. ", was " .. str(#("a\\b")))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"quote", function ()
  if not equal63(7, 7) then
    failed = failed + 1
    return("failed: expected " .. str(7) .. ", was " .. str(7))
  else
    passed = passed + 1
  end
  if not equal63(true, true) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(true))
  else
    passed = passed + 1
  end
  if not equal63(false, false) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(false))
  else
    passed = passed + 1
  end
  if not equal63("a", "a") then
    failed = failed + 1
    return("failed: expected " .. str("a") .. ", was " .. str("a"))
  else
    passed = passed + 1
  end
  if not equal63({"quote", "a"}, {"quote", "a"}) then
    failed = failed + 1
    return("failed: expected " .. str({"quote", "a"}) .. ", was " .. str({"quote", "a"}))
  else
    passed = passed + 1
  end
  if not equal63("\"a\"", "\"a\"") then
    failed = failed + 1
    return("failed: expected " .. str("\"a\"") .. ", was " .. str("\"a\""))
  else
    passed = passed + 1
  end
  if not equal63("\"\\n\"", "\"\\n\"") then
    failed = failed + 1
    return("failed: expected " .. str("\"\\n\"") .. ", was " .. str("\"\\n\""))
  else
    passed = passed + 1
  end
  if not equal63("\"\\\\\"", "\"\\\\\"") then
    failed = failed + 1
    return("failed: expected " .. str("\"\\\\\"") .. ", was " .. str("\"\\\\\""))
  else
    passed = passed + 1
  end
  if not equal63({"quote", "\"a\""}, {"quote", "\"a\""}) then
    failed = failed + 1
    return("failed: expected " .. str({"quote", "\"a\""}) .. ", was " .. str({"quote", "\"a\""}))
  else
    passed = passed + 1
  end
  if not equal63("|(|", "|(|") then
    failed = failed + 1
    return("failed: expected " .. str("|(|") .. ", was " .. str("|(|"))
  else
    passed = passed + 1
  end
  if not equal63("unquote", "unquote") then
    failed = failed + 1
    return("failed: expected " .. str("unquote") .. ", was " .. str("unquote"))
  else
    passed = passed + 1
  end
  if not equal63({"unquote"}, {"unquote"}) then
    failed = failed + 1
    return("failed: expected " .. str({"unquote"}) .. ", was " .. str({"unquote"}))
  else
    passed = passed + 1
  end
  if not equal63({"unquote", "a"}, {"unquote", "a"}) then
    failed = failed + 1
    return("failed: expected " .. str({"unquote", "a"}) .. ", was " .. str({"unquote", "a"}))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"list", function ()
  if not equal63({}, {}) then
    failed = failed + 1
    return("failed: expected " .. str({}) .. ", was " .. str({}))
  else
    passed = passed + 1
  end
  if not equal63({}, {}) then
    failed = failed + 1
    return("failed: expected " .. str({}) .. ", was " .. str({}))
  else
    passed = passed + 1
  end
  if not equal63({"a"}, {"a"}) then
    failed = failed + 1
    return("failed: expected " .. str({"a"}) .. ", was " .. str({"a"}))
  else
    passed = passed + 1
  end
  if not equal63({"a"}, {"a"}) then
    failed = failed + 1
    return("failed: expected " .. str({"a"}) .. ", was " .. str({"a"}))
  else
    passed = passed + 1
  end
  if not equal63({{}}, {{}}) then
    failed = failed + 1
    return("failed: expected " .. str({{}}) .. ", was " .. str({{}}))
  else
    passed = passed + 1
  end
  if not equal63(0, #({})) then
    failed = failed + 1
    return("failed: expected " .. str(0) .. ", was " .. str(#({})))
  else
    passed = passed + 1
  end
  if not equal63(2, #({1, 2})) then
    failed = failed + 1
    return("failed: expected " .. str(2) .. ", was " .. str(#({1, 2})))
  else
    passed = passed + 1
  end
  if not equal63({1, 2, 3}, {1, 2, 3}) then
    failed = failed + 1
    return("failed: expected " .. str({1, 2, 3}) .. ", was " .. str({1, 2, 3}))
  else
    passed = passed + 1
  end
  local _x124 = {}
  _x124.foo = 17
  if not equal63(17, _x124.foo) then
    failed = failed + 1
    local _x125 = {}
    _x125.foo = 17
    return("failed: expected " .. str(17) .. ", was " .. str(_x125.foo))
  else
    passed = passed + 1
  end
  local _x126 = {1}
  _x126.foo = 17
  if not equal63(17, _x126.foo) then
    failed = failed + 1
    local _x127 = {1}
    _x127.foo = 17
    return("failed: expected " .. str(17) .. ", was " .. str(_x127.foo))
  else
    passed = passed + 1
  end
  local _x128 = {}
  _x128.foo = true
  if not equal63(true, _x128.foo) then
    failed = failed + 1
    local _x129 = {}
    _x129.foo = true
    return("failed: expected " .. str(true) .. ", was " .. str(_x129.foo))
  else
    passed = passed + 1
  end
  local _x130 = {}
  _x130.foo = true
  if not equal63(true, _x130.foo) then
    failed = failed + 1
    local _x131 = {}
    _x131.foo = true
    return("failed: expected " .. str(true) .. ", was " .. str(_x131.foo))
  else
    passed = passed + 1
  end
  local _x133 = {}
  _x133.foo = true
  if not equal63(true, ({_x133})[1].foo) then
    failed = failed + 1
    local _x135 = {}
    _x135.foo = true
    return("failed: expected " .. str(true) .. ", was " .. str(({_x135})[1].foo))
  else
    passed = passed + 1
  end
  local _x136 = {}
  _x136.a = true
  local _x137 = {}
  _x137.a = true
  if not equal63(_x136, _x137) then
    failed = failed + 1
    local _x138 = {}
    _x138.a = true
    local _x139 = {}
    _x139.a = true
    return("failed: expected " .. str(_x138) .. ", was " .. str(_x139))
  else
    passed = passed + 1
  end
  local _x140 = {}
  _x140.b = false
  local _x141 = {}
  _x141.b = false
  if not equal63(_x140, _x141) then
    failed = failed + 1
    local _x142 = {}
    _x142.b = false
    local _x143 = {}
    _x143.b = false
    return("failed: expected " .. str(_x142) .. ", was " .. str(_x143))
  else
    passed = passed + 1
  end
  local _x144 = {}
  _x144.c = 0
  local _x145 = {}
  _x145.c = 0
  if not equal63(_x144, _x145) then
    failed = failed + 1
    local _x146 = {}
    _x146.c = 0
    local _x147 = {}
    _x147.c = 0
    return("failed: expected " .. str(_x146) .. ", was " .. str(_x147))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"quasiquote", function ()
  if not equal63("a", "a") then
    failed = failed + 1
    return("failed: expected " .. str("a") .. ", was " .. str("a"))
  else
    passed = passed + 1
  end
  if not equal63("a", "a") then
    failed = failed + 1
    return("failed: expected " .. str("a") .. ", was " .. str("a"))
  else
    passed = passed + 1
  end
  if not equal63({}, join()) then
    failed = failed + 1
    return("failed: expected " .. str({}) .. ", was " .. str(join()))
  else
    passed = passed + 1
  end
  if not equal63(2, 2) then
    failed = failed + 1
    return("failed: expected " .. str(2) .. ", was " .. str(2))
  else
    passed = passed + 1
  end
  if not equal63(nil, nil) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(nil))
  else
    passed = passed + 1
  end
  local a = 42
  if not equal63(42, a) then
    failed = failed + 1
    return("failed: expected " .. str(42) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  if not equal63(42, a) then
    failed = failed + 1
    return("failed: expected " .. str(42) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  if not equal63({"quasiquote", {"unquote", "a"}}, {"quasiquote", {"unquote", "a"}}) then
    failed = failed + 1
    return("failed: expected " .. str({"quasiquote", {"unquote", "a"}}) .. ", was " .. str({"quasiquote", {"unquote", "a"}}))
  else
    passed = passed + 1
  end
  if not equal63({"quasiquote", {"unquote", 42}}, {"quasiquote", {"unquote", a}}) then
    failed = failed + 1
    return("failed: expected " .. str({"quasiquote", {"unquote", 42}}) .. ", was " .. str({"quasiquote", {"unquote", a}}))
  else
    passed = passed + 1
  end
  if not equal63({"quasiquote", {"quasiquote", {"unquote", {"unquote", "a"}}}}, {"quasiquote", {"quasiquote", {"unquote", {"unquote", "a"}}}}) then
    failed = failed + 1
    return("failed: expected " .. str({"quasiquote", {"quasiquote", {"unquote", {"unquote", "a"}}}}) .. ", was " .. str({"quasiquote", {"quasiquote", {"unquote", {"unquote", "a"}}}}))
  else
    passed = passed + 1
  end
  if not equal63({"quasiquote", {"quasiquote", {"unquote", {"unquote", 42}}}}, {"quasiquote", {"quasiquote", {"unquote", {"unquote", a}}}}) then
    failed = failed + 1
    return("failed: expected " .. str({"quasiquote", {"quasiquote", {"unquote", {"unquote", 42}}}}) .. ", was " .. str({"quasiquote", {"quasiquote", {"unquote", {"unquote", a}}}}))
  else
    passed = passed + 1
  end
  if not equal63({"a", {"quasiquote", {"b", {"unquote", "c"}}}}, {"a", {"quasiquote", {"b", {"unquote", "c"}}}}) then
    failed = failed + 1
    return("failed: expected " .. str({"a", {"quasiquote", {"b", {"unquote", "c"}}}}) .. ", was " .. str({"a", {"quasiquote", {"b", {"unquote", "c"}}}}))
  else
    passed = passed + 1
  end
  if not equal63({"a", {"quasiquote", {"b", {"unquote", 42}}}}, {"a", {"quasiquote", {"b", {"unquote", a}}}}) then
    failed = failed + 1
    return("failed: expected " .. str({"a", {"quasiquote", {"b", {"unquote", 42}}}}) .. ", was " .. str({"a", {"quasiquote", {"b", {"unquote", a}}}}))
  else
    passed = passed + 1
  end
  local b = "c"
  if not equal63({"quote", "c"}, {"quote", b}) then
    failed = failed + 1
    return("failed: expected " .. str({"quote", "c"}) .. ", was " .. str({"quote", b}))
  else
    passed = passed + 1
  end
  if not equal63({42}, {a}) then
    failed = failed + 1
    return("failed: expected " .. str({42}) .. ", was " .. str({a}))
  else
    passed = passed + 1
  end
  if not equal63({{42}}, {{a}}) then
    failed = failed + 1
    return("failed: expected " .. str({{42}}) .. ", was " .. str({{a}}))
  else
    passed = passed + 1
  end
  if not equal63({41, {42}}, {41, {a}}) then
    failed = failed + 1
    return("failed: expected " .. str({41, {42}}) .. ", was " .. str({41, {a}}))
  else
    passed = passed + 1
  end
  local c = {1, 2, 3}
  if not equal63({{1, 2, 3}}, {c}) then
    failed = failed + 1
    return("failed: expected " .. str({{1, 2, 3}}) .. ", was " .. str({c}))
  else
    passed = passed + 1
  end
  if not equal63({1, 2, 3}, c) then
    failed = failed + 1
    return("failed: expected " .. str({1, 2, 3}) .. ", was " .. str(c))
  else
    passed = passed + 1
  end
  if not equal63({0, 1, 2, 3}, join({0}, c)) then
    failed = failed + 1
    return("failed: expected " .. str({0, 1, 2, 3}) .. ", was " .. str(join({0}, c)))
  else
    passed = passed + 1
  end
  if not equal63({0, 1, 2, 3, 4}, join({0}, c, {4})) then
    failed = failed + 1
    return("failed: expected " .. str({0, 1, 2, 3, 4}) .. ", was " .. str(join({0}, c, {4})))
  else
    passed = passed + 1
  end
  if not equal63({0, {1, 2, 3}, 4}, {0, c, 4}) then
    failed = failed + 1
    return("failed: expected " .. str({0, {1, 2, 3}, 4}) .. ", was " .. str({0, c, 4}))
  else
    passed = passed + 1
  end
  if not equal63({1, 2, 3, 1, 2, 3}, join(c, c)) then
    failed = failed + 1
    return("failed: expected " .. str({1, 2, 3, 1, 2, 3}) .. ", was " .. str(join(c, c)))
  else
    passed = passed + 1
  end
  if not equal63({{1, 2, 3}, 1, 2, 3}, join({c}, c)) then
    failed = failed + 1
    return("failed: expected " .. str({{1, 2, 3}, 1, 2, 3}) .. ", was " .. str(join({c}, c)))
  else
    passed = passed + 1
  end
  local _a = 42
  if not equal63({"quasiquote", {{"unquote-splicing", {"list", "a"}}}}, {"quasiquote", {{"unquote-splicing", {"list", "a"}}}}) then
    failed = failed + 1
    return("failed: expected " .. str({"quasiquote", {{"unquote-splicing", {"list", "a"}}}}) .. ", was " .. str({"quasiquote", {{"unquote-splicing", {"list", "a"}}}}))
  else
    passed = passed + 1
  end
  if not equal63({"quasiquote", {{"unquote-splicing", {"list", 42}}}}, {"quasiquote", {{"unquote-splicing", {"list", _a}}}}) then
    failed = failed + 1
    return("failed: expected " .. str({"quasiquote", {{"unquote-splicing", {"list", 42}}}}) .. ", was " .. str({"quasiquote", {{"unquote-splicing", {"list", _a}}}}))
  else
    passed = passed + 1
  end
  local _x318 = {}
  _x318.foo = true
  if not equal63(true, _x318.foo) then
    failed = failed + 1
    local _x319 = {}
    _x319.foo = true
    return("failed: expected " .. str(true) .. ", was " .. str(_x319.foo))
  else
    passed = passed + 1
  end
  local _a1 = 17
  local b = {1, 2}
  local _c = {a = 10}
  local _x321 = {}
  _x321.a = 10
  local d = _x321
  local _x322 = {}
  _x322.foo = _a1
  if not equal63(17, _x322.foo) then
    failed = failed + 1
    local _x323 = {}
    _x323.foo = _a1
    return("failed: expected " .. str(17) .. ", was " .. str(_x323.foo))
  else
    passed = passed + 1
  end
  local _x324 = {}
  _x324.foo = _a1
  if not equal63(2, #(join(_x324, b))) then
    failed = failed + 1
    local _x325 = {}
    _x325.foo = _a1
    return("failed: expected " .. str(2) .. ", was " .. str(#(join(_x325, b))))
  else
    passed = passed + 1
  end
  local _x326 = {}
  _x326.foo = _a1
  if not equal63(17, _x326.foo) then
    failed = failed + 1
    local _x327 = {}
    _x327.foo = _a1
    return("failed: expected " .. str(17) .. ", was " .. str(_x327.foo))
  else
    passed = passed + 1
  end
  local _x328 = {1}
  _x328.a = 10
  if not equal63(_x328, join({1}, _c)) then
    failed = failed + 1
    local _x330 = {1}
    _x330.a = 10
    return("failed: expected " .. str(_x330) .. ", was " .. str(join({1}, _c)))
  else
    passed = passed + 1
  end
  local _x332 = {1}
  _x332.a = 10
  if not equal63(_x332, join({1}, d)) then
    failed = failed + 1
    local _x334 = {1}
    _x334.a = 10
    return("failed: expected " .. str(_x334) .. ", was " .. str(join({1}, d)))
  else
    passed = passed + 1
  end
  local _x337 = {}
  _x337.foo = true
  if not equal63(true, ({_x337})[1].foo) then
    failed = failed + 1
    local _x339 = {}
    _x339.foo = true
    return("failed: expected " .. str(true) .. ", was " .. str(({_x339})[1].foo))
  else
    passed = passed + 1
  end
  local _x341 = {}
  _x341.foo = true
  if not equal63(true, ({_x341})[1].foo) then
    failed = failed + 1
    local _x343 = {}
    _x343.foo = true
    return("failed: expected " .. str(true) .. ", was " .. str(({_x343})[1].foo))
  else
    passed = passed + 1
  end
  local _x344 = {}
  _x344.foo = true
  if not equal63(true, _x344.foo) then
    failed = failed + 1
    local _x345 = {}
    _x345.foo = true
    return("failed: expected " .. str(true) .. ", was " .. str(_x345.foo))
  else
    passed = passed + 1
  end
  local _x347 = {}
  _x347.foo = true
  if not equal63(true, join({1, 2, 3}, _x347).foo) then
    failed = failed + 1
    local _x349 = {}
    _x349.foo = true
    return("failed: expected " .. str(true) .. ", was " .. str(join({1, 2, 3}, _x349).foo))
  else
    passed = passed + 1
  end
  if not equal63(true, ({foo = true}).foo) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(({foo = true}).foo))
  else
    passed = passed + 1
  end
  if not equal63(17, ({bar = 17}).bar) then
    failed = failed + 1
    return("failed: expected " .. str(17) .. ", was " .. str(({bar = 17}).bar))
  else
    passed = passed + 1
  end
  if not equal63(17, ({baz = function ()
    return(17)
  end}).baz()) then
    failed = failed + 1
    return("failed: expected " .. str(17) .. ", was " .. str(({baz = function ()
      return(17)
    end}).baz()))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"quasiexpand", function ()
  if not equal63("a", macroexpand("a")) then
    failed = failed + 1
    return("failed: expected " .. str("a") .. ", was " .. str(macroexpand("a")))
  else
    passed = passed + 1
  end
  if not equal63({17}, macroexpand({17})) then
    failed = failed + 1
    return("failed: expected " .. str({17}) .. ", was " .. str(macroexpand({17})))
  else
    passed = passed + 1
  end
  if not equal63({1, "z"}, macroexpand({1, "z"})) then
    failed = failed + 1
    return("failed: expected " .. str({1, "z"}) .. ", was " .. str(macroexpand({1, "z"})))
  else
    passed = passed + 1
  end
  if not equal63({"%array", 1, "\"z\""}, macroexpand({"quasiquote", {1, "z"}})) then
    failed = failed + 1
    return("failed: expected " .. str({"%array", 1, "\"z\""}) .. ", was " .. str(macroexpand({"quasiquote", {1, "z"}})))
  else
    passed = passed + 1
  end
  if not equal63({"%array", 1, "z"}, macroexpand({"quasiquote", {{"unquote", 1}, {"unquote", "z"}}})) then
    failed = failed + 1
    return("failed: expected " .. str({"%array", 1, "z"}) .. ", was " .. str(macroexpand({"quasiquote", {{"unquote", 1}, {"unquote", "z"}}})))
  else
    passed = passed + 1
  end
  if not equal63("z", macroexpand({"quasiquote", {{"unquote-splicing", "z"}}})) then
    failed = failed + 1
    return("failed: expected " .. str("z") .. ", was " .. str(macroexpand({"quasiquote", {{"unquote-splicing", "z"}}})))
  else
    passed = passed + 1
  end
  if not equal63({"join", {"%array", 1}, "z"}, macroexpand({"quasiquote", {{"unquote", 1}, {"unquote-splicing", "z"}}})) then
    failed = failed + 1
    return("failed: expected " .. str({"join", {"%array", 1}, "z"}) .. ", was " .. str(macroexpand({"quasiquote", {{"unquote", 1}, {"unquote-splicing", "z"}}})))
  else
    passed = passed + 1
  end
  if not equal63({"join", {"%array", 1}, "x", "y"}, macroexpand({"quasiquote", {{"unquote", 1}, {"unquote-splicing", "x"}, {"unquote-splicing", "y"}}})) then
    failed = failed + 1
    return("failed: expected " .. str({"join", {"%array", 1}, "x", "y"}) .. ", was " .. str(macroexpand({"quasiquote", {{"unquote", 1}, {"unquote-splicing", "x"}, {"unquote-splicing", "y"}}})))
  else
    passed = passed + 1
  end
  if not equal63({"join", {"%array", 1}, "z", {"%array", 2}}, macroexpand({"quasiquote", {{"unquote", 1}, {"unquote-splicing", "z"}, {"unquote", 2}}})) then
    failed = failed + 1
    return("failed: expected " .. str({"join", {"%array", 1}, "z", {"%array", 2}}) .. ", was " .. str(macroexpand({"quasiquote", {{"unquote", 1}, {"unquote-splicing", "z"}, {"unquote", 2}}})))
  else
    passed = passed + 1
  end
  if not equal63({"join", {"%array", 1}, "z", {"%array", "\"a\""}}, macroexpand({"quasiquote", {{"unquote", 1}, {"unquote-splicing", "z"}, "a"}})) then
    failed = failed + 1
    return("failed: expected " .. str({"join", {"%array", 1}, "z", {"%array", "\"a\""}}) .. ", was " .. str(macroexpand({"quasiquote", {{"unquote", 1}, {"unquote-splicing", "z"}, "a"}})))
  else
    passed = passed + 1
  end
  if not equal63("\"x\"", macroexpand({"quasiquote", "x"})) then
    failed = failed + 1
    return("failed: expected " .. str("\"x\"") .. ", was " .. str(macroexpand({"quasiquote", "x"})))
  else
    passed = passed + 1
  end
  if not equal63({"%array", "\"quasiquote\"", "\"x\""}, macroexpand({"quasiquote", {"quasiquote", "x"}})) then
    failed = failed + 1
    return("failed: expected " .. str({"%array", "\"quasiquote\"", "\"x\""}) .. ", was " .. str(macroexpand({"quasiquote", {"quasiquote", "x"}})))
  else
    passed = passed + 1
  end
  if not equal63({"%array", "\"quasiquote\"", {"%array", "\"quasiquote\"", "\"x\""}}, macroexpand({"quasiquote", {"quasiquote", {"quasiquote", "x"}}})) then
    failed = failed + 1
    return("failed: expected " .. str({"%array", "\"quasiquote\"", {"%array", "\"quasiquote\"", "\"x\""}}) .. ", was " .. str(macroexpand({"quasiquote", {"quasiquote", {"quasiquote", "x"}}})))
  else
    passed = passed + 1
  end
  if not equal63("x", macroexpand({"quasiquote", {"unquote", "x"}})) then
    failed = failed + 1
    return("failed: expected " .. str("x") .. ", was " .. str(macroexpand({"quasiquote", {"unquote", "x"}})))
  else
    passed = passed + 1
  end
  if not equal63({"%array", "\"quote\"", "x"}, macroexpand({"quasiquote", {"quote", {"unquote", "x"}}})) then
    failed = failed + 1
    return("failed: expected " .. str({"%array", "\"quote\"", "x"}) .. ", was " .. str(macroexpand({"quasiquote", {"quote", {"unquote", "x"}}})))
  else
    passed = passed + 1
  end
  if not equal63({"%array", "\"quasiquote\"", {"%array", "\"x\""}}, macroexpand({"quasiquote", {"quasiquote", {"x"}}})) then
    failed = failed + 1
    return("failed: expected " .. str({"%array", "\"quasiquote\"", {"%array", "\"x\""}}) .. ", was " .. str(macroexpand({"quasiquote", {"quasiquote", {"x"}}})))
  else
    passed = passed + 1
  end
  if not equal63({"%array", "\"quasiquote\"", {"%array", "\"unquote\"", "\"a\""}}, macroexpand({"quasiquote", {"quasiquote", {"unquote", "a"}}})) then
    failed = failed + 1
    return("failed: expected " .. str({"%array", "\"quasiquote\"", {"%array", "\"unquote\"", "\"a\""}}) .. ", was " .. str(macroexpand({"quasiquote", {"quasiquote", {"unquote", "a"}}})))
  else
    passed = passed + 1
  end
  if not equal63({"%array", "\"quasiquote\"", {"%array", {"%array", "\"unquote\"", "\"x\""}}}, macroexpand({"quasiquote", {"quasiquote", {{"unquote", "x"}}}})) then
    failed = failed + 1
    return("failed: expected " .. str({"%array", "\"quasiquote\"", {"%array", {"%array", "\"unquote\"", "\"x\""}}}) .. ", was " .. str(macroexpand({"quasiquote", {"quasiquote", {{"unquote", "x"}}}})))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"calls", function (_)
  local f = function ()
    return(42)
  end
  local l = {f}
  local t = {f = f}
  if not equal63(42, f()) then
    failed = failed + 1
    return("failed: expected " .. str(42) .. ", was " .. str(f()))
  else
    passed = passed + 1
  end
  if not equal63(42, l[1]()) then
    failed = failed + 1
    return("failed: expected " .. str(42) .. ", was " .. str(l[1]()))
  else
    passed = passed + 1
  end
  if not equal63(42, t.f()) then
    failed = failed + 1
    return("failed: expected " .. str(42) .. ", was " .. str(t.f()))
  else
    passed = passed + 1
  end
  if not equal63(nil, (function ()
    return
  end)()) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str((function ()
      return
    end)()))
  else
    passed = passed + 1
  end
  if not equal63(10, (function (_)
    return(_ - 2)
  end)(12)) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str((function (_)
      return(_ - 2)
    end)(12)))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"id", function ()
  local a = 10
  local b = {x = 20}
  local f = function ()
    return(30)
  end
  if not equal63(10, a) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  if not equal63(10, a) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  if not equal63(20, b.x) then
    failed = failed + 1
    return("failed: expected " .. str(20) .. ", was " .. str(b.x))
  else
    passed = passed + 1
  end
  if not equal63(30, f()) then
    failed = failed + 1
    return("failed: expected " .. str(30) .. ", was " .. str(f()))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"names", function ()
  local a33 = 0
  local b63 = 1
  local _37 = 2
  local _4242 = 3
  local _break = 4
  if not equal63(0, a33) then
    failed = failed + 1
    return("failed: expected " .. str(0) .. ", was " .. str(a33))
  else
    passed = passed + 1
  end
  if not equal63(1, b63) then
    failed = failed + 1
    return("failed: expected " .. str(1) .. ", was " .. str(b63))
  else
    passed = passed + 1
  end
  if not equal63(2, _37) then
    failed = failed + 1
    return("failed: expected " .. str(2) .. ", was " .. str(_37))
  else
    passed = passed + 1
  end
  if not equal63(3, _4242) then
    failed = failed + 1
    return("failed: expected " .. str(3) .. ", was " .. str(_4242))
  else
    passed = passed + 1
  end
  if not equal63(4, _break) then
    failed = failed + 1
    return("failed: expected " .. str(4) .. ", was " .. str(_break))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"assign", function ()
  local a = 42
  a = "bar"
  if not equal63("bar", a) then
    failed = failed + 1
    return("failed: expected " .. str("bar") .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  a = 10
  local x = a
  if not equal63(10, x) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(x))
  else
    passed = passed + 1
  end
  if not equal63(10, a) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  a = false
  if not equal63(false, a) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  a = nil
  if not equal63(nil, a) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(a))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"=", function ()
  local a = 42
  local b = 7
  a = "foo"
  b = "bar"
  if not equal63("foo", a) then
    failed = failed + 1
    return("failed: expected " .. str("foo") .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  if not equal63("bar", b) then
    failed = failed + 1
    return("failed: expected " .. str("bar") .. ", was " .. str(b))
  else
    passed = passed + 1
  end
  a = 10
  local x = a
  if not equal63(10, x) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(x))
  else
    passed = passed + 1
  end
  if not equal63(10, a) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  a = false
  if not equal63(false, a) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  a = nil
  if not equal63(nil, a) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(a))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"wipe", function ()
  local _x518 = {}
  _x518.b = true
  _x518.c = true
  _x518.a = true
  local x = _x518
  x.a = nil
  if not equal63(nil, x.a) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(x.a))
  else
    passed = passed + 1
  end
  if not equal63(true, x.b) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(x.b))
  else
    passed = passed + 1
  end
  x.c = nil
  if not equal63(nil, x.c) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(x.c))
  else
    passed = passed + 1
  end
  if not equal63(true, x.b) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(x.b))
  else
    passed = passed + 1
  end
  x.b = nil
  if not equal63(nil, x.b) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(x.b))
  else
    passed = passed + 1
  end
  if not equal63({}, x) then
    failed = failed + 1
    return("failed: expected " .. str({}) .. ", was " .. str(x))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"do", function ()
  local a = 17
  a = 10
  if not equal63(10, a) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  if not equal63(10, a) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  a = 2
  local b = a + 5
  if not equal63(a, 2) then
    failed = failed + 1
    return("failed: expected " .. str(a) .. ", was " .. str(2))
  else
    passed = passed + 1
  end
  if not equal63(b, 7) then
    failed = failed + 1
    return("failed: expected " .. str(b) .. ", was " .. str(7))
  else
    passed = passed + 1
  end
  a = 10
  a = 20
  if not equal63(20, a) then
    failed = failed + 1
    return("failed: expected " .. str(20) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  a = 10
  a = 20
  if not equal63(20, a) then
    failed = failed + 1
    a = 10
    a = 20
    return("failed: expected " .. str(20) .. ", was " .. str(a))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"if", function ()
  if not equal63("a", macroexpand({"if", "a"})) then
    failed = failed + 1
    return("failed: expected " .. str("a") .. ", was " .. str(macroexpand({"if", "a"})))
  else
    passed = passed + 1
  end
  if not equal63({"%if", "a", "b"}, macroexpand({"if", "a", "b"})) then
    failed = failed + 1
    return("failed: expected " .. str({"%if", "a", "b"}) .. ", was " .. str(macroexpand({"if", "a", "b"})))
  else
    passed = passed + 1
  end
  if not equal63({"%if", "a", "b", "c"}, macroexpand({"if", "a", "b", "c"})) then
    failed = failed + 1
    return("failed: expected " .. str({"%if", "a", "b", "c"}) .. ", was " .. str(macroexpand({"if", "a", "b", "c"})))
  else
    passed = passed + 1
  end
  if not equal63({"%if", "a", "b", {"%if", "c", "d"}}, macroexpand({"if", "a", "b", "c", "d"})) then
    failed = failed + 1
    return("failed: expected " .. str({"%if", "a", "b", {"%if", "c", "d"}}) .. ", was " .. str(macroexpand({"if", "a", "b", "c", "d"})))
  else
    passed = passed + 1
  end
  if not equal63({"%if", "a", "b", {"%if", "c", "d", "e"}}, macroexpand({"if", "a", "b", "c", "d", "e"})) then
    failed = failed + 1
    return("failed: expected " .. str({"%if", "a", "b", {"%if", "c", "d", "e"}}) .. ", was " .. str(macroexpand({"if", "a", "b", "c", "d", "e"})))
  else
    passed = passed + 1
  end
  if true then
    if not equal63(true, true) then
      failed = failed + 1
      return("failed: expected " .. str(true) .. ", was " .. str(true))
    else
      passed = passed + 1
    end
  else
    if not equal63(true, false) then
      failed = failed + 1
      return("failed: expected " .. str(true) .. ", was " .. str(false))
    else
      passed = passed + 1
    end
  end
  if false then
    if not equal63(true, false) then
      failed = failed + 1
      return("failed: expected " .. str(true) .. ", was " .. str(false))
    else
      passed = passed + 1
    end
  else
    if false then
      if not equal63(false, true) then
        failed = failed + 1
        return("failed: expected " .. str(false) .. ", was " .. str(true))
      else
        passed = passed + 1
      end
    else
      if not equal63(true, true) then
        failed = failed + 1
        return("failed: expected " .. str(true) .. ", was " .. str(true))
      else
        passed = passed + 1
      end
    end
  end
  if false then
    if not equal63(true, false) then
      failed = failed + 1
      return("failed: expected " .. str(true) .. ", was " .. str(false))
    else
      passed = passed + 1
    end
  else
    if false then
      if not equal63(false, true) then
        failed = failed + 1
        return("failed: expected " .. str(false) .. ", was " .. str(true))
      else
        passed = passed + 1
      end
    else
      if false then
        if not equal63(false, true) then
          failed = failed + 1
          return("failed: expected " .. str(false) .. ", was " .. str(true))
        else
          passed = passed + 1
        end
      else
        if not equal63(true, true) then
          failed = failed + 1
          return("failed: expected " .. str(true) .. ", was " .. str(true))
        else
          passed = passed + 1
        end
      end
    end
  end
  if false then
    if not equal63(true, false) then
      failed = failed + 1
      return("failed: expected " .. str(true) .. ", was " .. str(false))
    else
      passed = passed + 1
    end
  else
    if true then
      if not equal63(true, true) then
        failed = failed + 1
        return("failed: expected " .. str(true) .. ", was " .. str(true))
      else
        passed = passed + 1
      end
    else
      if false then
        if not equal63(false, true) then
          failed = failed + 1
          return("failed: expected " .. str(false) .. ", was " .. str(true))
        else
          passed = passed + 1
        end
      else
        if not equal63(true, true) then
          failed = failed + 1
          return("failed: expected " .. str(true) .. ", was " .. str(true))
        else
          passed = passed + 1
        end
      end
    end
  end
  local _e23
  if true then
    _e23 = 1
  else
    _e23 = 2
  end
  if not equal63(1, _e23) then
    failed = failed + 1
    local _e24
    if true then
      _e24 = 1
    else
      _e24 = 2
    end
    return("failed: expected " .. str(1) .. ", was " .. str(_e24))
  else
    passed = passed + 1
  end
  local _e25
  local a = 10
  if a then
    _e25 = 1
  else
    _e25 = 2
  end
  if not equal63(1, _e25) then
    failed = failed + 1
    local _e26
    local _a2 = 10
    if _a2 then
      _e26 = 1
    else
      _e26 = 2
    end
    return("failed: expected " .. str(1) .. ", was " .. str(_e26))
  else
    passed = passed + 1
  end
  local _e27
  if true then
    local _a3 = 1
    _e27 = _a3
  else
    _e27 = 2
  end
  if not equal63(1, _e27) then
    failed = failed + 1
    local _e28
    if true then
      local _a4 = 1
      _e28 = _a4
    else
      _e28 = 2
    end
    return("failed: expected " .. str(1) .. ", was " .. str(_e28))
  else
    passed = passed + 1
  end
  local _e29
  if false then
    _e29 = 2
  else
    local _a5 = 1
    _e29 = _a5
  end
  if not equal63(1, _e29) then
    failed = failed + 1
    local _e30
    if false then
      _e30 = 2
    else
      local _a6 = 1
      _e30 = _a6
    end
    return("failed: expected " .. str(1) .. ", was " .. str(_e30))
  else
    passed = passed + 1
  end
  local _e31
  if false then
    _e31 = 2
  else
    local _e32
    if true then
      local _a7 = 1
      _e32 = _a7
    end
    _e31 = _e32
  end
  if not equal63(1, _e31) then
    failed = failed + 1
    local _e33
    if false then
      _e33 = 2
    else
      local _e34
      if true then
        local _a8 = 1
        _e34 = _a8
      end
      _e33 = _e34
    end
    return("failed: expected " .. str(1) .. ", was " .. str(_e33))
  else
    passed = passed + 1
  end
  local _e35
  if false then
    _e35 = 2
  else
    local _e36
    if false then
      _e36 = 3
    else
      local _a9 = 1
      _e36 = _a9
    end
    _e35 = _e36
  end
  if not equal63(1, _e35) then
    failed = failed + 1
    local _e37
    if false then
      _e37 = 2
    else
      local _e38
      if false then
        _e38 = 3
      else
        local _a10 = 1
        _e38 = _a10
      end
      _e37 = _e38
    end
    return("failed: expected " .. str(1) .. ", was " .. str(_e37))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"case", function ()
  local x = 10
  local _e = x
  local _e39
  if 9 == _e then
    _e39 = 9
  else
    local _e40
    if 10 == _e then
      _e40 = 2
    else
      _e40 = 4
    end
    _e39 = _e40
  end
  if not equal63(2, _e39) then
    failed = failed + 1
    local _e1 = x
    local _e41
    if 9 == _e1 then
      _e41 = 9
    else
      local _e42
      if 10 == _e1 then
        _e42 = 2
      else
        _e42 = 4
      end
      _e41 = _e42
    end
    return("failed: expected " .. str(2) .. ", was " .. str(_e41))
  else
    passed = passed + 1
  end
  local _x544 = "z"
  local _e2 = _x544
  local _e43
  if "z" == _e2 then
    _e43 = 9
  else
    _e43 = 10
  end
  if not equal63(9, _e43) then
    failed = failed + 1
    local _e3 = _x544
    local _e44
    if "z" == _e3 then
      _e44 = 9
    else
      _e44 = 10
    end
    return("failed: expected " .. str(9) .. ", was " .. str(_e44))
  else
    passed = passed + 1
  end
  local _e4 = _x544
  local _e45
  if "a" == _e4 then
    _e45 = 1
  else
    local _e46
    if "b" == _e4 then
      _e46 = 2
    else
      _e46 = 7
    end
    _e45 = _e46
  end
  if not equal63(7, _e45) then
    failed = failed + 1
    local _e5 = _x544
    local _e47
    if "a" == _e5 then
      _e47 = 1
    else
      local _e48
      if "b" == _e5 then
        _e48 = 2
      else
        _e48 = 7
      end
      _e47 = _e48
    end
    return("failed: expected " .. str(7) .. ", was " .. str(_e47))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"while", function ()
  local i = 0
  while i < 5 do
    if i == 3 then
      break
    else
      i = i + 1
    end
  end
  if not equal63(3, i) then
    failed = failed + 1
    return("failed: expected " .. str(3) .. ", was " .. str(i))
  else
    passed = passed + 1
  end
  while i < 10 do
    i = i + 1
  end
  if not equal63(10, i) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(i))
  else
    passed = passed + 1
  end
  while i < 15 do
    i = i + 1
  end
  local a
  if not equal63(nil, a) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  if not equal63(15, i) then
    failed = failed + 1
    return("failed: expected " .. str(15) .. ", was " .. str(i))
  else
    passed = passed + 1
  end
  while i < 20 do
    if i == 19 then
      break
    else
      i = i + 1
    end
  end
  local b
  if not equal63(nil, a) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  if not equal63(19, i) then
    failed = failed + 1
    return("failed: expected " .. str(19) .. ", was " .. str(i))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"for", function ()
  local l = {}
  local i = 0
  while i < 5 do
    add(l, i)
    i = i + 1
  end
  if not equal63({0, 1, 2, 3, 4}, l) then
    failed = failed + 1
    return("failed: expected " .. str({0, 1, 2, 3, 4}) .. ", was " .. str(l))
  else
    passed = passed + 1
  end
  local _l1 = {}
  local i = 0
  while i < 2 do
    add(_l1, i)
    i = i + 1
  end
  if not equal63({0, 1}, _l1) then
    failed = failed + 1
    local _l2 = {}
    local i = 0
    while i < 2 do
      add(_l2, i)
      i = i + 1
    end
    return("failed: expected " .. str({0, 1}) .. ", was " .. str(_l2))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"table", function ()
  if not equal63(10, ({a = 10}).a) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(({a = 10}).a))
  else
    passed = passed + 1
  end
  if not equal63(true, ({a = true}).a) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(({a = true}).a))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"empty", function ()
  if not equal63(true, empty63({})) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(empty63({})))
  else
    passed = passed + 1
  end
  if not equal63(true, empty63({})) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(empty63({})))
  else
    passed = passed + 1
  end
  if not equal63(false, empty63({1})) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(empty63({1})))
  else
    passed = passed + 1
  end
  local _x555 = {}
  _x555.a = true
  if not equal63(false, empty63(_x555)) then
    failed = failed + 1
    local _x556 = {}
    _x556.a = true
    return("failed: expected " .. str(false) .. ", was " .. str(empty63(_x556)))
  else
    passed = passed + 1
  end
  if not equal63(false, empty63({a = true})) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(empty63({a = true})))
  else
    passed = passed + 1
  end
  local _x557 = {}
  _x557.b = false
  if not equal63(false, empty63(_x557)) then
    failed = failed + 1
    local _x558 = {}
    _x558.b = false
    return("failed: expected " .. str(false) .. ", was " .. str(empty63(_x558)))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"at", function ()
  local l = {"a", "b", "c", "d"}
  if not equal63("a", l[1]) then
    failed = failed + 1
    return("failed: expected " .. str("a") .. ", was " .. str(l[1]))
  else
    passed = passed + 1
  end
  if not equal63("a", l[1]) then
    failed = failed + 1
    return("failed: expected " .. str("a") .. ", was " .. str(l[1]))
  else
    passed = passed + 1
  end
  if not equal63("b", l[2]) then
    failed = failed + 1
    return("failed: expected " .. str("b") .. ", was " .. str(l[2]))
  else
    passed = passed + 1
  end
  l[1] = 9
  if not equal63(9, l[1]) then
    failed = failed + 1
    return("failed: expected " .. str(9) .. ", was " .. str(l[1]))
  else
    passed = passed + 1
  end
  l[4] = 10
  if not equal63(10, l[4]) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(l[4]))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"get-=", function ()
  local t = {}
  t.foo = "bar"
  if not equal63("bar", t.foo) then
    failed = failed + 1
    return("failed: expected " .. str("bar") .. ", was " .. str(t.foo))
  else
    passed = passed + 1
  end
  if not equal63("bar", t.foo) then
    failed = failed + 1
    return("failed: expected " .. str("bar") .. ", was " .. str(t.foo))
  else
    passed = passed + 1
  end
  if not equal63("bar", t.foo) then
    failed = failed + 1
    return("failed: expected " .. str("bar") .. ", was " .. str(t.foo))
  else
    passed = passed + 1
  end
  local k = "foo"
  if not equal63("bar", t[k]) then
    failed = failed + 1
    return("failed: expected " .. str("bar") .. ", was " .. str(t[k]))
  else
    passed = passed + 1
  end
  if not equal63("bar", t["f" .. "oo"]) then
    failed = failed + 1
    return("failed: expected " .. str("bar") .. ", was " .. str(t["f" .. "oo"]))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"each", function ()
  local _x563 = {1, 2, 3}
  _x563.b = false
  _x563.a = true
  local t = _x563
  local a = 0
  local b = 0
  local _l3 = t
  local k = nil
  for k in next, _l3 do
    local v = _l3[k]
    if type(k) == "number" then
      a = a + 1
    else
      b = b + 1
    end
  end
  if not equal63(3, a) then
    failed = failed + 1
    return("failed: expected " .. str(3) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  if not equal63(2, b) then
    failed = failed + 1
    return("failed: expected " .. str(2) .. ", was " .. str(b))
  else
    passed = passed + 1
  end
  local _a11 = 0
  local _l4 = t
  local _i2 = nil
  for _i2 in next, _l4 do
    local x = _l4[_i2]
    _a11 = _a11 + 1
  end
  if not equal63(5, _a11) then
    failed = failed + 1
    return("failed: expected " .. str(5) .. ", was " .. str(_a11))
  else
    passed = passed + 1
  end
  local _x564 = {{1}, {2}}
  _x564.b = {3}
  local _t = _x564
  local _l5 = _t
  local _i3 = nil
  for _i3 in next, _l5 do
    local x = _l5[_i3]
    if not equal63(false, not( type(x) == "table")) then
      failed = failed + 1
      return("failed: expected " .. str(false) .. ", was " .. str(not( type(x) == "table")))
    else
      passed = passed + 1
    end
  end
  local _l6 = _t
  local _i4 = nil
  for _i4 in next, _l6 do
    local x = _l6[_i4]
    if not equal63(false, not( type(x) == "table")) then
      failed = failed + 1
      return("failed: expected " .. str(false) .. ", was " .. str(not( type(x) == "table")))
    else
      passed = passed + 1
    end
  end
  local _l7 = _t
  local _i5 = nil
  for _i5 in next, _l7 do
    local _id4 = _l7[_i5]
    local x = _id4[1]
    if not equal63(true, type(x) == "number") then
      failed = failed + 1
      return("failed: expected " .. str(true) .. ", was " .. str(type(x) == "number"))
    else
      passed = passed + 1
    end
  end
end})
add(tests, {"fn", function (_)
  local f = function (_)
    return(_ + 10)
  end
  if not equal63(20, f(10)) then
    failed = failed + 1
    return("failed: expected " .. str(20) .. ", was " .. str(f(10)))
  else
    passed = passed + 1
  end
  if not equal63(30, f(20)) then
    failed = failed + 1
    return("failed: expected " .. str(30) .. ", was " .. str(f(20)))
  else
    passed = passed + 1
  end
  if not equal63(40, (function (_)
    return(_ + 10)
  end)(30)) then
    failed = failed + 1
    return("failed: expected " .. str(40) .. ", was " .. str((function (_)
      return(_ + 10)
    end)(30)))
  else
    passed = passed + 1
  end
  if not equal63({2, 3, 4}, map(function (_)
    return(_ + 1)
  end, {1, 2, 3})) then
    failed = failed + 1
    return("failed: expected " .. str({2, 3, 4}) .. ", was " .. str(map(function (_)
      return(_ + 1)
    end, {1, 2, 3})))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"define", function ()
  local x = 20
  local function f()
    return(42)
  end
  if not equal63(20, x) then
    failed = failed + 1
    return("failed: expected " .. str(20) .. ", was " .. str(x))
  else
    passed = passed + 1
  end
  if not equal63(42, f()) then
    failed = failed + 1
    return("failed: expected " .. str(42) .. ", was " .. str(f()))
  else
    passed = passed + 1
  end
  (function ()
    local function f()
      return(38)
    end
    if not equal63(38, f()) then
      failed = failed + 1
      return("failed: expected " .. str(38) .. ", was " .. str(f()))
    else
      passed = passed + 1
      return(passed)
    end
  end)()
  if not equal63(42, f()) then
    failed = failed + 1
    return("failed: expected " .. str(42) .. ", was " .. str(f()))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"return", function ()
  local a = (function ()
    return(17)
  end)()
  if not equal63(17, a) then
    failed = failed + 1
    return("failed: expected " .. str(17) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  local _a12 = (function ()
    if true then
      return(10)
    else
      return(20)
    end
  end)()
  if not equal63(10, _a12) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(_a12))
  else
    passed = passed + 1
  end
  local _a13 = (function ()
    while false do
      blah()
    end
  end)()
  if not equal63(nil, _a13) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(_a13))
  else
    passed = passed + 1
  end
  local _a14 = 11
  local b = (function ()
    _a14 = _a14 + 1
    return(_a14)
  end)()
  if not equal63(12, b) then
    failed = failed + 1
    return("failed: expected " .. str(12) .. ", was " .. str(b))
  else
    passed = passed + 1
  end
  if not equal63(12, _a14) then
    failed = failed + 1
    return("failed: expected " .. str(12) .. ", was " .. str(_a14))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"guard", function ()
  local _x581 = nil
  local _msg1 = nil
  local _trace1 = nil
  local _e49
  if xpcall(function ()
    _x581 = 42
    return(_x581)
  end, function (_)
    _msg1 = clip(_, search(_, ": ") + 2)
    _trace1 = debug.traceback()
    return(_trace1)
  end) then
    _e49 = {true, _x581}
  else
    _e49 = {false, _msg1, _trace1}
  end
  if not equal63({true, 42}, cut(_e49, 0, 2)) then
    failed = failed + 1
    local _x585 = nil
    local _msg2 = nil
    local _trace2 = nil
    local _e50
    if xpcall(function ()
      _x585 = 42
      return(_x585)
    end, function (_)
      _msg2 = clip(_, search(_, ": ") + 2)
      _trace2 = debug.traceback()
      return(_trace2)
    end) then
      _e50 = {true, _x585}
    else
      _e50 = {false, _msg2, _trace2}
    end
    return("failed: expected " .. str({true, 42}) .. ", was " .. str(cut(_e50, 0, 2)))
  else
    passed = passed + 1
  end
  local _x589 = nil
  local _msg3 = nil
  local _trace3 = nil
  local _e51
  if xpcall(function ()
    error("foo")
    _x589 = nil
    return(_x589)
  end, function (_)
    _msg3 = clip(_, search(_, ": ") + 2)
    _trace3 = debug.traceback()
    return(_trace3)
  end) then
    _e51 = {true, _x589}
  else
    _e51 = {false, _msg3, _trace3}
  end
  if not equal63({false, "foo"}, cut(_e51, 0, 2)) then
    failed = failed + 1
    local _x593 = nil
    local _msg4 = nil
    local _trace4 = nil
    local _e52
    if xpcall(function ()
      error("foo")
      _x593 = nil
      return(_x593)
    end, function (_)
      _msg4 = clip(_, search(_, ": ") + 2)
      _trace4 = debug.traceback()
      return(_trace4)
    end) then
      _e52 = {true, _x593}
    else
      _e52 = {false, _msg4, _trace4}
    end
    return("failed: expected " .. str({false, "foo"}) .. ", was " .. str(cut(_e52, 0, 2)))
  else
    passed = passed + 1
  end
  local _x597 = nil
  local _msg5 = nil
  local _trace5 = nil
  local _e53
  if xpcall(function ()
    error("foo")
    error("baz")
    _x597 = nil
    return(_x597)
  end, function (_)
    _msg5 = clip(_, search(_, ": ") + 2)
    _trace5 = debug.traceback()
    return(_trace5)
  end) then
    _e53 = {true, _x597}
  else
    _e53 = {false, _msg5, _trace5}
  end
  if not equal63({false, "foo"}, cut(_e53, 0, 2)) then
    failed = failed + 1
    local _x601 = nil
    local _msg6 = nil
    local _trace6 = nil
    local _e54
    if xpcall(function ()
      error("foo")
      error("baz")
      _x601 = nil
      return(_x601)
    end, function (_)
      _msg6 = clip(_, search(_, ": ") + 2)
      _trace6 = debug.traceback()
      return(_trace6)
    end) then
      _e54 = {true, _x601}
    else
      _e54 = {false, _msg6, _trace6}
    end
    return("failed: expected " .. str({false, "foo"}) .. ", was " .. str(cut(_e54, 0, 2)))
  else
    passed = passed + 1
  end
  local _x605 = nil
  local _msg7 = nil
  local _trace7 = nil
  local _e55
  if xpcall(function ()
    local _x606 = nil
    local _msg8 = nil
    local _trace8 = nil
    local _e56
    if xpcall(function ()
      error("foo")
      _x606 = nil
      return(_x606)
    end, function (_)
      _msg8 = clip(_, search(_, ": ") + 2)
      _trace8 = debug.traceback()
      return(_trace8)
    end) then
      _e56 = {true, _x606}
    else
      _e56 = {false, _msg8, _trace8}
    end
    cut(_e56, 0, 2)
    error("baz")
    _x605 = nil
    return(_x605)
  end, function (_)
    _msg7 = clip(_, search(_, ": ") + 2)
    _trace7 = debug.traceback()
    return(_trace7)
  end) then
    _e55 = {true, _x605}
  else
    _e55 = {false, _msg7, _trace7}
  end
  if not equal63({false, "baz"}, cut(_e55, 0, 2)) then
    failed = failed + 1
    local _x612 = nil
    local _msg9 = nil
    local _trace9 = nil
    local _e57
    if xpcall(function ()
      local _x613 = nil
      local _msg10 = nil
      local _trace10 = nil
      local _e58
      if xpcall(function ()
        error("foo")
        _x613 = nil
        return(_x613)
      end, function (_)
        _msg10 = clip(_, search(_, ": ") + 2)
        _trace10 = debug.traceback()
        return(_trace10)
      end) then
        _e58 = {true, _x613}
      else
        _e58 = {false, _msg10, _trace10}
      end
      cut(_e58, 0, 2)
      error("baz")
      _x612 = nil
      return(_x612)
    end, function (_)
      _msg9 = clip(_, search(_, ": ") + 2)
      _trace9 = debug.traceback()
      return(_trace9)
    end) then
      _e57 = {true, _x612}
    else
      _e57 = {false, _msg9, _trace9}
    end
    return("failed: expected " .. str({false, "baz"}) .. ", was " .. str(cut(_e57, 0, 2)))
  else
    passed = passed + 1
  end
  local _x619 = nil
  local _msg11 = nil
  local _trace11 = nil
  local _e59
  if xpcall(function ()
    local _e60
    if true then
      _e60 = 42
    else
      error("baz")
      _e60 = nil
    end
    _x619 = _e60
    return(_x619)
  end, function (_)
    _msg11 = clip(_, search(_, ": ") + 2)
    _trace11 = debug.traceback()
    return(_trace11)
  end) then
    _e59 = {true, _x619}
  else
    _e59 = {false, _msg11, _trace11}
  end
  if not equal63({true, 42}, cut(_e59, 0, 2)) then
    failed = failed + 1
    local _x623 = nil
    local _msg12 = nil
    local _trace12 = nil
    local _e61
    if xpcall(function ()
      local _e62
      if true then
        _e62 = 42
      else
        error("baz")
        _e62 = nil
      end
      _x623 = _e62
      return(_x623)
    end, function (_)
      _msg12 = clip(_, search(_, ": ") + 2)
      _trace12 = debug.traceback()
      return(_trace12)
    end) then
      _e61 = {true, _x623}
    else
      _e61 = {false, _msg12, _trace12}
    end
    return("failed: expected " .. str({true, 42}) .. ", was " .. str(cut(_e61, 0, 2)))
  else
    passed = passed + 1
  end
  local _x627 = nil
  local _msg13 = nil
  local _trace13 = nil
  local _e63
  if xpcall(function ()
    local _e64
    if false then
      _e64 = 42
    else
      error("baz")
      _e64 = nil
    end
    _x627 = _e64
    return(_x627)
  end, function (_)
    _msg13 = clip(_, search(_, ": ") + 2)
    _trace13 = debug.traceback()
    return(_trace13)
  end) then
    _e63 = {true, _x627}
  else
    _e63 = {false, _msg13, _trace13}
  end
  if not equal63({false, "baz"}, cut(_e63, 0, 2)) then
    failed = failed + 1
    local _x631 = nil
    local _msg14 = nil
    local _trace14 = nil
    local _e65
    if xpcall(function ()
      local _e66
      if false then
        _e66 = 42
      else
        error("baz")
        _e66 = nil
      end
      _x631 = _e66
      return(_x631)
    end, function (_)
      _msg14 = clip(_, search(_, ": ") + 2)
      _trace14 = debug.traceback()
      return(_trace14)
    end) then
      _e65 = {true, _x631}
    else
      _e65 = {false, _msg14, _trace14}
    end
    return("failed: expected " .. str({false, "baz"}) .. ", was " .. str(cut(_e65, 0, 2)))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"let", function (_)
  local a = 10
  if not equal63(10, a) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  local _a15 = 10
  if not equal63(10, _a15) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(_a15))
  else
    passed = passed + 1
  end
  local _a16 = 11
  local b = 12
  if not equal63(11, _a16) then
    failed = failed + 1
    return("failed: expected " .. str(11) .. ", was " .. str(_a16))
  else
    passed = passed + 1
  end
  if not equal63(12, b) then
    failed = failed + 1
    return("failed: expected " .. str(12) .. ", was " .. str(b))
  else
    passed = passed + 1
  end
  local _a17 = 1
  if not equal63(1, _a17) then
    failed = failed + 1
    return("failed: expected " .. str(1) .. ", was " .. str(_a17))
  else
    passed = passed + 1
  end
  local _a18 = 2
  if not equal63(2, _a18) then
    failed = failed + 1
    return("failed: expected " .. str(2) .. ", was " .. str(_a18))
  else
    passed = passed + 1
  end
  if not equal63(1, _a17) then
    failed = failed + 1
    return("failed: expected " .. str(1) .. ", was " .. str(_a17))
  else
    passed = passed + 1
  end
  local _a19 = 1
  local _a20 = 2
  local _a21 = 3
  if not equal63(_a21, 3) then
    failed = failed + 1
    return("failed: expected " .. str(_a21) .. ", was " .. str(3))
  else
    passed = passed + 1
  end
  if not equal63(_a20, 2) then
    failed = failed + 1
    return("failed: expected " .. str(_a20) .. ", was " .. str(2))
  else
    passed = passed + 1
  end
  if not equal63(_a19, 1) then
    failed = failed + 1
    return("failed: expected " .. str(_a19) .. ", was " .. str(1))
  else
    passed = passed + 1
  end
  local _a22 = 20
  if not equal63(20, _a22) then
    failed = failed + 1
    return("failed: expected " .. str(20) .. ", was " .. str(_a22))
  else
    passed = passed + 1
  end
  local _a23 = _a22 + 7
  if not equal63(27, _a23) then
    failed = failed + 1
    return("failed: expected " .. str(27) .. ", was " .. str(_a23))
  else
    passed = passed + 1
  end
  local _a24 = _a22 + 10
  if not equal63(30, _a24) then
    failed = failed + 1
    return("failed: expected " .. str(30) .. ", was " .. str(_a24))
  else
    passed = passed + 1
  end
  if not equal63(20, _a22) then
    failed = failed + 1
    return("failed: expected " .. str(20) .. ", was " .. str(_a22))
  else
    passed = passed + 1
  end
  local _a25 = 10
  if not equal63(10, _a25) then
    failed = failed + 1
    local _a26 = 10
    return("failed: expected " .. str(10) .. ", was " .. str(_a26))
  else
    passed = passed + 1
  end
  local b = 12
  local _a27 = b
  if not equal63(12, _a27) then
    failed = failed + 1
    return("failed: expected " .. str(12) .. ", was " .. str(_a27))
  else
    passed = passed + 1
  end
  local _a29 = 10
  local _a28 = _a29
  if not equal63(10, _a28) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(_a28))
  else
    passed = passed + 1
  end
  local _a31 = 0
  _a31 = 10
  local _a30 = _a31 + 2 + 3
  if not equal63(_a30, 15) then
    failed = failed + 1
    return("failed: expected " .. str(_a30) .. ", was " .. str(15))
  else
    passed = passed + 1
  end
  (function (_)
    if not equal63(20, _) then
      failed = failed + 1
      return("failed: expected " .. str(20) .. ", was " .. str(_))
    else
      passed = passed + 1
    end
    local __ = 21
    if not equal63(21, __) then
      failed = failed + 1
      return("failed: expected " .. str(21) .. ", was " .. str(__))
    else
      passed = passed + 1
    end
    if not equal63(20, _) then
      failed = failed + 1
      return("failed: expected " .. str(20) .. ", was " .. str(_))
    else
      passed = passed + 1
      return(passed)
    end
  end)(20)
  local q = 9
  return((function ()
    local _q = 10
    if not equal63(10, _q) then
      failed = failed + 1
      return("failed: expected " .. str(10) .. ", was " .. str(_q))
    else
      passed = passed + 1
    end
    if not equal63(9, q) then
      failed = failed + 1
      return("failed: expected " .. str(9) .. ", was " .. str(q))
    else
      passed = passed + 1
      return(passed)
    end
  end)())
end})
add(tests, {"with", function ()
  local x = 9
  x = x + 1
  if not equal63(10, x) then
    failed = failed + 1
    local _x636 = 9
    _x636 = _x636 + 1
    return("failed: expected " .. str(10) .. ", was " .. str(_x636))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"let-when", function ()
  local _y = "a" == "b"
  local _e67
  if _y then
    local frips = _y
    _e67 = 19
  end
  if not equal63(nil, _e67) then
    failed = failed + 1
    local _y1 = "a" == "b"
    local _e68
    if _y1 then
      local frips = _y1
      _e68 = 19
    end
    return("failed: expected " .. str(nil) .. ", was " .. str(_e68))
  else
    passed = passed + 1
  end
  local _y2 = 20
  local _e69
  if _y2 then
    local frips = _y2
    _e69 = frips - 1
  end
  if not equal63(19, _e69) then
    failed = failed + 1
    local _y3 = 20
    local _e70
    if _y3 then
      local frips = _y3
      _e70 = frips - 1
    end
    return("failed: expected " .. str(19) .. ", was " .. str(_e70))
  else
    passed = passed + 1
  end
  local _y4 = {19, 20}
  local _e71
  if _y4 then
    local _id5 = _y4
    local a = _id5[1]
    local b = _id5[2]
    _e71 = b
  end
  if not equal63(20, _e71) then
    failed = failed + 1
    local _y5 = {19, 20}
    local _e72
    if _y5 then
      local _id6 = _y5
      local a = _id6[1]
      local b = _id6[2]
      _e72 = b
    end
    return("failed: expected " .. str(20) .. ", was " .. str(_e72))
  else
    passed = passed + 1
  end
  local _y6 = nil
  local _e73
  if _y6 then
    local _id7 = _y6
    local a = _id7[1]
    local b = _id7[2]
    _e73 = b
  end
  if not equal63(nil, _e73) then
    failed = failed + 1
    local _y7 = nil
    local _e74
    if _y7 then
      local _id8 = _y7
      local a = _id8[1]
      local b = _id8[2]
      _e74 = b
    end
    return("failed: expected " .. str(nil) .. ", was " .. str(_e74))
  else
    passed = passed + 1
    return(passed)
  end
end})
local zzop = 99
local zzap = 100
local _zzop = 10
local _zzap = _zzop + 10
local _x640 = {1, 2, 3}
_x640.b = 20
_x640.a = 10
local _id9 = _x640
local zza = _id9[1]
local zzb = _id9[2]
add(tests, {"let-toplevel1", function ()
  if not equal63(10, _zzop) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(_zzop))
  else
    passed = passed + 1
  end
  if not equal63(20, _zzap) then
    failed = failed + 1
    return("failed: expected " .. str(20) .. ", was " .. str(_zzap))
  else
    passed = passed + 1
  end
  if not equal63(1, zza) then
    failed = failed + 1
    return("failed: expected " .. str(1) .. ", was " .. str(zza))
  else
    passed = passed + 1
  end
  if not equal63(2, zzb) then
    failed = failed + 1
    return("failed: expected " .. str(2) .. ", was " .. str(zzb))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"let-toplevel", function ()
  if not equal63(99, zzop) then
    failed = failed + 1
    return("failed: expected " .. str(99) .. ", was " .. str(zzop))
  else
    passed = passed + 1
  end
  if not equal63(100, zzap) then
    failed = failed + 1
    return("failed: expected " .. str(100) .. ", was " .. str(zzap))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"reserved", function ()
  local _end = "zz"
  local _try = "yy"
  local _return = 99
  if not equal63("zz", _end) then
    failed = failed + 1
    _return("failed: expected " .. str("zz") .. ", was " .. str(_end))
  else
    passed = passed + 1
  end
  if not equal63("yy", _try) then
    failed = failed + 1
    _return("failed: expected " .. str("yy") .. ", was " .. str(_try))
  else
    passed = passed + 1
  end
  if not equal63(99, _return) then
    failed = failed + 1
    _return("failed: expected " .. str(99) .. ", was " .. str(_return))
  else
    passed = passed + 1
  end
  local function _var(_if, _end, _return)
    return(_if + _end + _return)
  end
  if not equal63(6, _var(1, 2, 3)) then
    failed = failed + 1
    return("failed: expected " .. str(6) .. ", was " .. str(_var(1, 2, 3)))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"destructuring", function ()
  local _id10 = {1, 2, 3}
  local a = _id10[1]
  local b = _id10[2]
  local c = _id10[3]
  if not equal63(1, a) then
    failed = failed + 1
    return("failed: expected " .. str(1) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  if not equal63(2, b) then
    failed = failed + 1
    return("failed: expected " .. str(2) .. ", was " .. str(b))
  else
    passed = passed + 1
  end
  if not equal63(3, c) then
    failed = failed + 1
    return("failed: expected " .. str(3) .. ", was " .. str(c))
  else
    passed = passed + 1
  end
  local _id11 = {1, {2, {3}, 4}}
  local w = _id11[1]
  local _id12 = _id11[2]
  local x = _id12[1]
  local _id13 = _id12[2]
  local y = _id13[1]
  local z = _id12[3]
  if not equal63(1, w) then
    failed = failed + 1
    return("failed: expected " .. str(1) .. ", was " .. str(w))
  else
    passed = passed + 1
  end
  if not equal63(2, x) then
    failed = failed + 1
    return("failed: expected " .. str(2) .. ", was " .. str(x))
  else
    passed = passed + 1
  end
  if not equal63(3, y) then
    failed = failed + 1
    return("failed: expected " .. str(3) .. ", was " .. str(y))
  else
    passed = passed + 1
  end
  if not equal63(4, z) then
    failed = failed + 1
    return("failed: expected " .. str(4) .. ", was " .. str(z))
  else
    passed = passed + 1
  end
  local _id14 = {1, 2, 3, 4}
  local a = _id14[1]
  local b = _id14[2]
  local c = cut(_id14, 2)
  if not equal63({3, 4}, c) then
    failed = failed + 1
    return("failed: expected " .. str({3, 4}) .. ", was " .. str(c))
  else
    passed = passed + 1
  end
  local _id15 = {1, {2, 3, 4}, 5, 6, 7}
  local w = _id15[1]
  local _id16 = _id15[2]
  local x = _id16[1]
  local y = cut(_id16, 1)
  local z = cut(_id15, 2)
  if not equal63({3, 4}, y) then
    failed = failed + 1
    return("failed: expected " .. str({3, 4}) .. ", was " .. str(y))
  else
    passed = passed + 1
  end
  if not equal63({5, 6, 7}, z) then
    failed = failed + 1
    return("failed: expected " .. str({5, 6, 7}) .. ", was " .. str(z))
  else
    passed = passed + 1
  end
  local _id17 = {foo = 99}
  local foo = _id17.foo
  if not equal63(99, foo) then
    failed = failed + 1
    return("failed: expected " .. str(99) .. ", was " .. str(foo))
  else
    passed = passed + 1
  end
  local _x658 = {}
  _x658.foo = 99
  local _id18 = _x658
  local foo = _id18.foo
  if not equal63(99, foo) then
    failed = failed + 1
    return("failed: expected " .. str(99) .. ", was " .. str(foo))
  else
    passed = passed + 1
  end
  local _id19 = {foo = 99}
  local a = _id19.foo
  if not equal63(99, a) then
    failed = failed + 1
    return("failed: expected " .. str(99) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  local _id20 = {foo = {98, 99}}
  local _id21 = _id20.foo
  local a = _id21[1]
  local b = _id21[2]
  if not equal63(98, a) then
    failed = failed + 1
    return("failed: expected " .. str(98) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  if not equal63(99, b) then
    failed = failed + 1
    return("failed: expected " .. str(99) .. ", was " .. str(b))
  else
    passed = passed + 1
  end
  local _x660 = {99}
  _x660.baz = true
  local _id22 = {foo = 42, bar = _x660}
  local foo = _id22.foo
  local _id23 = _id22.bar
  local baz = _id23.baz
  if not equal63(42, foo) then
    failed = failed + 1
    return("failed: expected " .. str(42) .. ", was " .. str(foo))
  else
    passed = passed + 1
  end
  if not equal63(true, baz) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(baz))
  else
    passed = passed + 1
  end
  local _x662 = {20}
  _x662.foo = 17
  local _x661 = {10, _x662}
  _x661.bar = {1, 2, 3}
  local _id24 = _x661
  local a = _id24[1]
  local _id25 = _id24[2]
  local b = _id25[1]
  local foo = _id25.foo
  local bar = _id24.bar
  if not equal63(10, a) then
    failed = failed + 1
    return("failed: expected " .. str(10) .. ", was " .. str(a))
  else
    passed = passed + 1
  end
  if not equal63(20, b) then
    failed = failed + 1
    return("failed: expected " .. str(20) .. ", was " .. str(b))
  else
    passed = passed + 1
  end
  if not equal63(17, foo) then
    failed = failed + 1
    return("failed: expected " .. str(17) .. ", was " .. str(foo))
  else
    passed = passed + 1
  end
  if not equal63({1, 2, 3}, bar) then
    failed = failed + 1
    return("failed: expected " .. str({1, 2, 3}) .. ", was " .. str(bar))
  else
    passed = passed + 1
  end
  local yy = {1, 2, 3}
  local _id26 = yy
  local xx = _id26[1]
  local _yy = _id26[2]
  local zz = cut(_id26, 2)
  if not equal63(1, xx) then
    failed = failed + 1
    return("failed: expected " .. str(1) .. ", was " .. str(xx))
  else
    passed = passed + 1
  end
  if not equal63(2, _yy) then
    failed = failed + 1
    return("failed: expected " .. str(2) .. ", was " .. str(_yy))
  else
    passed = passed + 1
  end
  if not equal63({3}, zz) then
    failed = failed + 1
    return("failed: expected " .. str({3}) .. ", was " .. str(zz))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"let-macro", function ()
  if not equal63(17, 17) then
    failed = failed + 1
    return("failed: expected " .. str(17) .. ", was " .. str(17))
  else
    passed = passed + 1
  end
  if not equal63(42, 32 + 10) then
    failed = failed + 1
    return("failed: expected " .. str(42) .. ", was " .. str(32 + 10))
  else
    passed = passed + 1
  end
  if not equal63(1, 1) then
    failed = failed + 1
    return("failed: expected " .. str(1) .. ", was " .. str(1))
  else
    passed = passed + 1
  end
  if not equal63(17, 17) then
    failed = failed + 1
    return("failed: expected " .. str(17) .. ", was " .. str(17))
  else
    passed = passed + 1
  end
  local b = function ()
    return(20)
  end
  if not equal63(18, 18) then
    failed = failed + 1
    return("failed: expected " .. str(18) .. ", was " .. str(18))
  else
    passed = passed + 1
  end
  if not equal63(20, b()) then
    failed = failed + 1
    return("failed: expected " .. str(20) .. ", was " .. str(b()))
  else
    passed = passed + 1
  end
  if not equal63(2, 1 + 1) then
    failed = failed + 1
    return("failed: expected " .. str(2) .. ", was " .. str(1 + 1))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"let-symbol", function ()
  if not equal63(17, 17) then
    failed = failed + 1
    return("failed: expected " .. str(17) .. ", was " .. str(17))
  else
    passed = passed + 1
  end
  if not equal63(17, 10 + 7) then
    failed = failed + 1
    return("failed: expected " .. str(17) .. ", was " .. str(10 + 7))
  else
    passed = passed + 1
  end
  if not equal63(1, 1) then
    failed = failed + 1
    return("failed: expected " .. str(1) .. ", was " .. str(1))
  else
    passed = passed + 1
  end
  if not equal63(17, 17) then
    failed = failed + 1
    return("failed: expected " .. str(17) .. ", was " .. str(17))
  else
    passed = passed + 1
  end
  local b = 20
  if not equal63(18, 18) then
    failed = failed + 1
    return("failed: expected " .. str(18) .. ", was " .. str(18))
  else
    passed = passed + 1
  end
  if not equal63(20, b) then
    failed = failed + 1
    return("failed: expected " .. str(20) .. ", was " .. str(b))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"defsym", function ()
  setenv("zzz", {_stash = true, symbol = 42})
  if not equal63(42, 42) then
    failed = failed + 1
    return("failed: expected " .. str(42) .. ", was " .. str(42))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"macros-and-symbols", function ()
  if not equal63(2, 2) then
    failed = failed + 1
    return("failed: expected " .. str(2) .. ", was " .. str(2))
  else
    passed = passed + 1
  end
  if not equal63(1, 1) then
    failed = failed + 1
    return("failed: expected " .. str(1) .. ", was " .. str(1))
  else
    passed = passed + 1
  end
  if not equal63(1, 1) then
    failed = failed + 1
    return("failed: expected " .. str(1) .. ", was " .. str(1))
  else
    passed = passed + 1
  end
  if not equal63(2, 2) then
    failed = failed + 1
    return("failed: expected " .. str(2) .. ", was " .. str(2))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"macros-and-let", function ()
  local a = 10
  if not equal63(a, 10) then
    failed = failed + 1
    return("failed: expected " .. str(a) .. ", was " .. str(10))
  else
    passed = passed + 1
  end
  if not equal63(12, 12) then
    failed = failed + 1
    return("failed: expected " .. str(12) .. ", was " .. str(12))
  else
    passed = passed + 1
  end
  if not equal63(a, 10) then
    failed = failed + 1
    return("failed: expected " .. str(a) .. ", was " .. str(10))
  else
    passed = passed + 1
  end
  local b = 20
  if not equal63(b, 20) then
    failed = failed + 1
    return("failed: expected " .. str(b) .. ", was " .. str(20))
  else
    passed = passed + 1
  end
  if not equal63(22, 22) then
    failed = failed + 1
    return("failed: expected " .. str(22) .. ", was " .. str(22))
  else
    passed = passed + 1
  end
  if not equal63(b, 20) then
    failed = failed + 1
    return("failed: expected " .. str(b) .. ", was " .. str(20))
  else
    passed = passed + 1
  end
  if not equal63(30, 30) then
    failed = failed + 1
    return("failed: expected " .. str(30) .. ", was " .. str(30))
  else
    passed = passed + 1
  end
  local _c1 = 32
  if not equal63(32, _c1) then
    failed = failed + 1
    return("failed: expected " .. str(32) .. ", was " .. str(_c1))
  else
    passed = passed + 1
  end
  if not equal63(30, 30) then
    failed = failed + 1
    return("failed: expected " .. str(30) .. ", was " .. str(30))
  else
    passed = passed + 1
  end
  if not equal63(40, 40) then
    failed = failed + 1
    return("failed: expected " .. str(40) .. ", was " .. str(40))
  else
    passed = passed + 1
  end
  local _d = 42
  if not equal63(42, _d) then
    failed = failed + 1
    return("failed: expected " .. str(42) .. ", was " .. str(_d))
  else
    passed = passed + 1
  end
  if not equal63(40, 40) then
    failed = failed + 1
    return("failed: expected " .. str(40) .. ", was " .. str(40))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"let-unique", function ()
  local ham = unique("ham")
  local chap = unique("chap")
  if not equal63("_ham", ham) then
    failed = failed + 1
    return("failed: expected " .. str("_ham") .. ", was " .. str(ham))
  else
    passed = passed + 1
  end
  if not equal63("_chap", chap) then
    failed = failed + 1
    return("failed: expected " .. str("_chap") .. ", was " .. str(chap))
  else
    passed = passed + 1
  end
  local _ham = unique("ham")
  if not equal63("_ham1", _ham) then
    failed = failed + 1
    return("failed: expected " .. str("_ham1") .. ", was " .. str(_ham))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"literals", function ()
  if not equal63(true, true) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(true))
  else
    passed = passed + 1
  end
  if not equal63(false, false) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(false))
  else
    passed = passed + 1
  end
  if not equal63(true, -inf < -10000000000) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(-inf < -10000000000))
  else
    passed = passed + 1
  end
  if not equal63(false, inf < -10000000000) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(inf < -10000000000))
  else
    passed = passed + 1
  end
  if not equal63(false, nan == nan) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(nan == nan))
  else
    passed = passed + 1
  end
  if not equal63(true, nan63(nan)) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(nan63(nan)))
  else
    passed = passed + 1
  end
  if not equal63(true, nan63(nan * 20)) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(nan63(nan * 20)))
  else
    passed = passed + 1
  end
  if not equal63(-inf, - inf) then
    failed = failed + 1
    return("failed: expected " .. str(-inf) .. ", was " .. str(- inf))
  else
    passed = passed + 1
  end
  if not equal63(inf, - -inf) then
    failed = failed + 1
    return("failed: expected " .. str(inf) .. ", was " .. str(- -inf))
  else
    passed = passed + 1
  end
  local Inf = 1
  local NaN = 2
  local _Inf = "a"
  local _NaN = "b"
  if not equal63(Inf, 1) then
    failed = failed + 1
    return("failed: expected " .. str(Inf) .. ", was " .. str(1))
  else
    passed = passed + 1
  end
  if not equal63(NaN, 2) then
    failed = failed + 1
    return("failed: expected " .. str(NaN) .. ", was " .. str(2))
  else
    passed = passed + 1
  end
  if not equal63(_Inf, "a") then
    failed = failed + 1
    return("failed: expected " .. str(_Inf) .. ", was " .. str("a"))
  else
    passed = passed + 1
  end
  if not equal63(_NaN, "b") then
    failed = failed + 1
    return("failed: expected " .. str(_NaN) .. ", was " .. str("b"))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"add", function ()
  local l = {}
  add(l, "a")
  add(l, "b")
  add(l, "c")
  if not equal63({"a", "b", "c"}, l) then
    failed = failed + 1
    return("failed: expected " .. str({"a", "b", "c"}) .. ", was " .. str(l))
  else
    passed = passed + 1
  end
  if not equal63(nil, add({}, "a")) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(add({}, "a")))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"drop", function ()
  local l = {"a", "b", "c"}
  if not equal63("c", drop(l)) then
    failed = failed + 1
    return("failed: expected " .. str("c") .. ", was " .. str(drop(l)))
  else
    passed = passed + 1
  end
  if not equal63("b", drop(l)) then
    failed = failed + 1
    return("failed: expected " .. str("b") .. ", was " .. str(drop(l)))
  else
    passed = passed + 1
  end
  if not equal63("a", drop(l)) then
    failed = failed + 1
    return("failed: expected " .. str("a") .. ", was " .. str(drop(l)))
  else
    passed = passed + 1
  end
  if not equal63(nil, drop(l)) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(drop(l)))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"last", function ()
  if not equal63(3, last({1, 2, 3})) then
    failed = failed + 1
    return("failed: expected " .. str(3) .. ", was " .. str(last({1, 2, 3})))
  else
    passed = passed + 1
  end
  if not equal63(nil, last({})) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(last({})))
  else
    passed = passed + 1
  end
  if not equal63("c", last({"a", "b", "c"})) then
    failed = failed + 1
    return("failed: expected " .. str("c") .. ", was " .. str(last({"a", "b", "c"})))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"join", function ()
  if not equal63({1, 2, 3}, join({1, 2}, {3})) then
    failed = failed + 1
    return("failed: expected " .. str({1, 2, 3}) .. ", was " .. str(join({1, 2}, {3})))
  else
    passed = passed + 1
  end
  if not equal63({1, 2}, join({}, {1, 2})) then
    failed = failed + 1
    return("failed: expected " .. str({1, 2}) .. ", was " .. str(join({}, {1, 2})))
  else
    passed = passed + 1
  end
  if not equal63({}, join({}, {})) then
    failed = failed + 1
    return("failed: expected " .. str({}) .. ", was " .. str(join({}, {})))
  else
    passed = passed + 1
  end
  if not equal63({}, join(nil, nil)) then
    failed = failed + 1
    return("failed: expected " .. str({}) .. ", was " .. str(join(nil, nil)))
  else
    passed = passed + 1
  end
  if not equal63({}, join(nil, {})) then
    failed = failed + 1
    return("failed: expected " .. str({}) .. ", was " .. str(join(nil, {})))
  else
    passed = passed + 1
  end
  if not equal63({}, join()) then
    failed = failed + 1
    return("failed: expected " .. str({}) .. ", was " .. str(join()))
  else
    passed = passed + 1
  end
  if not equal63({}, join({})) then
    failed = failed + 1
    return("failed: expected " .. str({}) .. ", was " .. str(join({})))
  else
    passed = passed + 1
  end
  if not equal63({1}, join({1}, nil)) then
    failed = failed + 1
    return("failed: expected " .. str({1}) .. ", was " .. str(join({1}, nil)))
  else
    passed = passed + 1
  end
  if not equal63({"a"}, join({"a"}, {})) then
    failed = failed + 1
    return("failed: expected " .. str({"a"}) .. ", was " .. str(join({"a"}, {})))
  else
    passed = passed + 1
  end
  if not equal63({"a"}, join(nil, {"a"})) then
    failed = failed + 1
    return("failed: expected " .. str({"a"}) .. ", was " .. str(join(nil, {"a"})))
  else
    passed = passed + 1
  end
  if not equal63({"a"}, join({"a"})) then
    failed = failed + 1
    return("failed: expected " .. str({"a"}) .. ", was " .. str(join({"a"})))
  else
    passed = passed + 1
  end
  local _x720 = {"a"}
  _x720.b = true
  if not equal63(_x720, join({"a"}, {b = true})) then
    failed = failed + 1
    local _x722 = {"a"}
    _x722.b = true
    return("failed: expected " .. str(_x722) .. ", was " .. str(join({"a"}, {b = true})))
  else
    passed = passed + 1
  end
  local _x724 = {"a", "b"}
  _x724.b = true
  local _x726 = {"b"}
  _x726.b = true
  if not equal63(_x724, join({"a"}, _x726)) then
    failed = failed + 1
    local _x727 = {"a", "b"}
    _x727.b = true
    local _x729 = {"b"}
    _x729.b = true
    return("failed: expected " .. str(_x727) .. ", was " .. str(join({"a"}, _x729)))
  else
    passed = passed + 1
  end
  local _x730 = {"a"}
  _x730.b = 10
  local _x731 = {"a"}
  _x731.b = true
  if not equal63(_x730, join(_x731, {b = 10})) then
    failed = failed + 1
    local _x732 = {"a"}
    _x732.b = 10
    local _x733 = {"a"}
    _x733.b = true
    return("failed: expected " .. str(_x732) .. ", was " .. str(join(_x733, {b = 10})))
  else
    passed = passed + 1
  end
  local _x734 = {}
  _x734.b = 10
  local _x735 = {}
  _x735.b = 10
  if not equal63(_x734, join({b = true}, _x735)) then
    failed = failed + 1
    local _x736 = {}
    _x736.b = 10
    local _x737 = {}
    _x737.b = 10
    return("failed: expected " .. str(_x736) .. ", was " .. str(join({b = true}, _x737)))
  else
    passed = passed + 1
  end
  local _x738 = {"a"}
  _x738.b = 1
  local _x739 = {"b"}
  _x739.c = 2
  local t = join(_x738, _x739)
  if not equal63(1, t.b) then
    failed = failed + 1
    return("failed: expected " .. str(1) .. ", was " .. str(t.b))
  else
    passed = passed + 1
  end
  if not equal63(2, t.c) then
    failed = failed + 1
    return("failed: expected " .. str(2) .. ", was " .. str(t.c))
  else
    passed = passed + 1
  end
  if not equal63("b", t[2]) then
    failed = failed + 1
    return("failed: expected " .. str("b") .. ", was " .. str(t[2]))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"reverse", function ()
  if not equal63({}, reverse({})) then
    failed = failed + 1
    return("failed: expected " .. str({}) .. ", was " .. str(reverse({})))
  else
    passed = passed + 1
  end
  if not equal63({3, 2, 1}, reverse({1, 2, 3})) then
    failed = failed + 1
    return("failed: expected " .. str({3, 2, 1}) .. ", was " .. str(reverse({1, 2, 3})))
  else
    passed = passed + 1
  end
  local _x745 = {3, 2, 1}
  _x745.a = true
  local _x746 = {1, 2, 3}
  _x746.a = true
  if not equal63(_x745, reverse(_x746)) then
    failed = failed + 1
    local _x747 = {3, 2, 1}
    _x747.a = true
    local _x748 = {1, 2, 3}
    _x748.a = true
    return("failed: expected " .. str(_x747) .. ", was " .. str(reverse(_x748)))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"map", function (_)
  if not equal63({}, map(function (_)
    return(_)
  end, {})) then
    failed = failed + 1
    return("failed: expected " .. str({}) .. ", was " .. str(map(function (_)
      return(_)
    end, {})))
  else
    passed = passed + 1
  end
  if not equal63({1}, map(function (_)
    return(_)
  end, {1})) then
    failed = failed + 1
    return("failed: expected " .. str({1}) .. ", was " .. str(map(function (_)
      return(_)
    end, {1})))
  else
    passed = passed + 1
  end
  if not equal63({2, 3, 4}, map(function (_)
    return(_ + 1)
  end, {1, 2, 3})) then
    failed = failed + 1
    return("failed: expected " .. str({2, 3, 4}) .. ", was " .. str(map(function (_)
      return(_ + 1)
    end, {1, 2, 3})))
  else
    passed = passed + 1
  end
  local _x758 = {2, 3, 4}
  _x758.a = 5
  local _x759 = {1, 2, 3}
  _x759.a = 4
  if not equal63(_x758, map(function (_)
    return(_ + 1)
  end, _x759)) then
    failed = failed + 1
    local _x760 = {2, 3, 4}
    _x760.a = 5
    local _x761 = {1, 2, 3}
    _x761.a = 4
    return("failed: expected " .. str(_x760) .. ", was " .. str(map(function (_)
      return(_ + 1)
    end, _x761)))
  else
    passed = passed + 1
  end
  local _x762 = {}
  _x762.a = true
  local _x763 = {}
  _x763.a = true
  if not equal63(_x762, map(function (_)
    return(_)
  end, _x763)) then
    failed = failed + 1
    local _x764 = {}
    _x764.a = true
    local _x765 = {}
    _x765.a = true
    return("failed: expected " .. str(_x764) .. ", was " .. str(map(function (_)
      return(_)
    end, _x765)))
  else
    passed = passed + 1
  end
  local _x766 = {}
  _x766.b = false
  local _x767 = {}
  _x767.b = false
  if not equal63(_x766, map(function (_)
    return(_)
  end, _x767)) then
    failed = failed + 1
    local _x768 = {}
    _x768.b = false
    local _x769 = {}
    _x769.b = false
    return("failed: expected " .. str(_x768) .. ", was " .. str(map(function (_)
      return(_)
    end, _x769)))
  else
    passed = passed + 1
  end
  local _x770 = {}
  _x770.b = false
  _x770.a = true
  local _x771 = {}
  _x771.b = false
  _x771.a = true
  if not equal63(_x770, map(function (_)
    return(_)
  end, _x771)) then
    failed = failed + 1
    local _x772 = {}
    _x772.b = false
    _x772.a = true
    local _x773 = {}
    _x773.b = false
    _x773.a = true
    return("failed: expected " .. str(_x772) .. ", was " .. str(map(function (_)
      return(_)
    end, _x773)))
  else
    passed = passed + 1
  end
  local evens = function (_)
    if _ % 2 == 0 then
      return(_)
    end
  end
  if not equal63({2, 4, 6}, map(evens, {1, 2, 3, 4, 5, 6})) then
    failed = failed + 1
    return("failed: expected " .. str({2, 4, 6}) .. ", was " .. str(map(evens, {1, 2, 3, 4, 5, 6})))
  else
    passed = passed + 1
  end
  local _x778 = {2, 4, 6}
  _x778.b = 8
  local _x779 = {1, 2, 3, 4, 5, 6}
  _x779.b = 8
  _x779.a = 7
  if not equal63(_x778, map(evens, _x779)) then
    failed = failed + 1
    local _x780 = {2, 4, 6}
    _x780.b = 8
    local _x781 = {1, 2, 3, 4, 5, 6}
    _x781.b = 8
    _x781.a = 7
    return("failed: expected " .. str(_x780) .. ", was " .. str(map(evens, _x781)))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"cut", function ()
  if not equal63({}, cut({})) then
    failed = failed + 1
    return("failed: expected " .. str({}) .. ", was " .. str(cut({})))
  else
    passed = passed + 1
  end
  if not equal63({"a"}, cut({"a"})) then
    failed = failed + 1
    return("failed: expected " .. str({"a"}) .. ", was " .. str(cut({"a"})))
  else
    passed = passed + 1
  end
  if not equal63({"b", "c"}, cut({"a", "b", "c"}, 1)) then
    failed = failed + 1
    return("failed: expected " .. str({"b", "c"}) .. ", was " .. str(cut({"a", "b", "c"}, 1)))
  else
    passed = passed + 1
  end
  if not equal63({"b", "c"}, cut({"a", "b", "c", "d"}, 1, 3)) then
    failed = failed + 1
    return("failed: expected " .. str({"b", "c"}) .. ", was " .. str(cut({"a", "b", "c", "d"}, 1, 3)))
  else
    passed = passed + 1
  end
  if not equal63({1, 2, 3}, cut({1, 2, 3}, 0, 10)) then
    failed = failed + 1
    return("failed: expected " .. str({1, 2, 3}) .. ", was " .. str(cut({1, 2, 3}, 0, 10)))
  else
    passed = passed + 1
  end
  if not equal63({1}, cut({1, 2, 3}, -4, 1)) then
    failed = failed + 1
    return("failed: expected " .. str({1}) .. ", was " .. str(cut({1, 2, 3}, -4, 1)))
  else
    passed = passed + 1
  end
  if not equal63({1, 2, 3}, cut({1, 2, 3}, -4)) then
    failed = failed + 1
    return("failed: expected " .. str({1, 2, 3}) .. ", was " .. str(cut({1, 2, 3}, -4)))
  else
    passed = passed + 1
  end
  local _x807 = {2}
  _x807.a = true
  local _x808 = {1, 2}
  _x808.a = true
  if not equal63(_x807, cut(_x808, 1)) then
    failed = failed + 1
    local _x809 = {2}
    _x809.a = true
    local _x810 = {1, 2}
    _x810.a = true
    return("failed: expected " .. str(_x809) .. ", was " .. str(cut(_x810, 1)))
  else
    passed = passed + 1
  end
  local _x811 = {}
  _x811.b = 2
  _x811.a = true
  local _x812 = {}
  _x812.b = 2
  _x812.a = true
  if not equal63(_x811, cut(_x812)) then
    failed = failed + 1
    local _x813 = {}
    _x813.b = 2
    _x813.a = true
    local _x814 = {}
    _x814.b = 2
    _x814.a = true
    return("failed: expected " .. str(_x813) .. ", was " .. str(cut(_x814)))
  else
    passed = passed + 1
  end
  local t = {1, 2, 3}
  if not equal63({}, cut(t, #(t))) then
    failed = failed + 1
    return("failed: expected " .. str({}) .. ", was " .. str(cut(t, #(t))))
  else
    passed = passed + 1
  end
  local _x816 = {1, 2, 3}
  _x816.a = true
  local _t1 = _x816
  local _x817 = {}
  _x817.a = true
  if not equal63(_x817, cut(_t1, #(_t1))) then
    failed = failed + 1
    local _x818 = {}
    _x818.a = true
    return("failed: expected " .. str(_x818) .. ", was " .. str(cut(_t1, #(_t1))))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"clip", function ()
  if not equal63("uux", clip("quux", 1)) then
    failed = failed + 1
    return("failed: expected " .. str("uux") .. ", was " .. str(clip("quux", 1)))
  else
    passed = passed + 1
  end
  if not equal63("uu", clip("quux", 1, 3)) then
    failed = failed + 1
    return("failed: expected " .. str("uu") .. ", was " .. str(clip("quux", 1, 3)))
  else
    passed = passed + 1
  end
  if not equal63("", clip("quux", 5)) then
    failed = failed + 1
    return("failed: expected " .. str("") .. ", was " .. str(clip("quux", 5)))
  else
    passed = passed + 1
  end
  if not equal63("ab", clip("ab", 0, 4)) then
    failed = failed + 1
    return("failed: expected " .. str("ab") .. ", was " .. str(clip("ab", 0, 4)))
  else
    passed = passed + 1
  end
  if not equal63("ab", clip("ab", -4, 4)) then
    failed = failed + 1
    return("failed: expected " .. str("ab") .. ", was " .. str(clip("ab", -4, 4)))
  else
    passed = passed + 1
  end
  if not equal63("a", clip("ab", -1, 1)) then
    failed = failed + 1
    return("failed: expected " .. str("a") .. ", was " .. str(clip("ab", -1, 1)))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"search", function ()
  if not equal63(nil, search("", "a")) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(search("", "a")))
  else
    passed = passed + 1
  end
  if not equal63(0, search("", "")) then
    failed = failed + 1
    return("failed: expected " .. str(0) .. ", was " .. str(search("", "")))
  else
    passed = passed + 1
  end
  if not equal63(0, search("a", "")) then
    failed = failed + 1
    return("failed: expected " .. str(0) .. ", was " .. str(search("a", "")))
  else
    passed = passed + 1
  end
  if not equal63(0, search("abc", "a")) then
    failed = failed + 1
    return("failed: expected " .. str(0) .. ", was " .. str(search("abc", "a")))
  else
    passed = passed + 1
  end
  if not equal63(2, search("abcd", "cd")) then
    failed = failed + 1
    return("failed: expected " .. str(2) .. ", was " .. str(search("abcd", "cd")))
  else
    passed = passed + 1
  end
  if not equal63(nil, search("abcd", "ce")) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(search("abcd", "ce")))
  else
    passed = passed + 1
  end
  if not equal63(nil, search("abc", "z")) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(search("abc", "z")))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"split", function ()
  if not equal63({}, split("", "")) then
    failed = failed + 1
    return("failed: expected " .. str({}) .. ", was " .. str(split("", "")))
  else
    passed = passed + 1
  end
  if not equal63({}, split("", ",")) then
    failed = failed + 1
    return("failed: expected " .. str({}) .. ", was " .. str(split("", ",")))
  else
    passed = passed + 1
  end
  if not equal63({"a"}, split("a", ",")) then
    failed = failed + 1
    return("failed: expected " .. str({"a"}) .. ", was " .. str(split("a", ",")))
  else
    passed = passed + 1
  end
  if not equal63({"a", ""}, split("a,", ",")) then
    failed = failed + 1
    return("failed: expected " .. str({"a", ""}) .. ", was " .. str(split("a,", ",")))
  else
    passed = passed + 1
  end
  if not equal63({"a", "b"}, split("a,b", ",")) then
    failed = failed + 1
    return("failed: expected " .. str({"a", "b"}) .. ", was " .. str(split("a,b", ",")))
  else
    passed = passed + 1
  end
  if not equal63({"a", "b", ""}, split("a,b,", ",")) then
    failed = failed + 1
    return("failed: expected " .. str({"a", "b", ""}) .. ", was " .. str(split("a,b,", ",")))
  else
    passed = passed + 1
  end
  if not equal63({"a", "b"}, split("azzb", "zz")) then
    failed = failed + 1
    return("failed: expected " .. str({"a", "b"}) .. ", was " .. str(split("azzb", "zz")))
  else
    passed = passed + 1
  end
  if not equal63({"a", "b", ""}, split("azzbzz", "zz")) then
    failed = failed + 1
    return("failed: expected " .. str({"a", "b", ""}) .. ", was " .. str(split("azzbzz", "zz")))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"reduce", function (_0, _1)
  if not equal63("a", reduce(function (_0, _1)
    return(_0 + _1)
  end, {"a"})) then
    failed = failed + 1
    return("failed: expected " .. str("a") .. ", was " .. str(reduce(function (_0, _1)
      return(_0 + _1)
    end, {"a"})))
  else
    passed = passed + 1
  end
  if not equal63(6, reduce(function (_0, _1)
    return(_0 + _1)
  end, {1, 2, 3})) then
    failed = failed + 1
    return("failed: expected " .. str(6) .. ", was " .. str(reduce(function (_0, _1)
      return(_0 + _1)
    end, {1, 2, 3})))
  else
    passed = passed + 1
  end
  if not equal63({1, {2, 3}}, reduce(function (_0, _1)
    return({_0, _1})
  end, {1, 2, 3})) then
    failed = failed + 1
    return("failed: expected " .. str({1, {2, 3}}) .. ", was " .. str(reduce(function (_0, _1)
      return({_0, _1})
    end, {1, 2, 3})))
  else
    passed = passed + 1
  end
  if not equal63({1, 2, 3, 4, 5}, reduce(function (_0, _1)
    return(join(_0, _1))
  end, {{1}, {2, 3}, {4, 5}})) then
    failed = failed + 1
    return("failed: expected " .. str({1, 2, 3, 4, 5}) .. ", was " .. str(reduce(function (_0, _1)
      return(join(_0, _1))
    end, {{1}, {2, 3}, {4, 5}})))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"keep", function (_)
  if not equal63({}, keep(function (_)
    return(_)
  end, {})) then
    failed = failed + 1
    return("failed: expected " .. str({}) .. ", was " .. str(keep(function (_)
      return(_)
    end, {})))
  else
    passed = passed + 1
  end
  local even = function (_)
    return(_ % 2 == 0)
  end
  if not equal63({6}, keep(even, {5, 6, 7})) then
    failed = failed + 1
    return("failed: expected " .. str({6}) .. ", was " .. str(keep(even, {5, 6, 7})))
  else
    passed = passed + 1
  end
  if not equal63({{1}, {2, 3}}, keep(some63, {{}, {1}, {}, {2, 3}})) then
    failed = failed + 1
    return("failed: expected " .. str({{1}, {2, 3}}) .. ", was " .. str(keep(some63, {{}, {1}, {}, {2, 3}})))
  else
    passed = passed + 1
  end
  local even63 = function (_)
    return(_ % 2 == 0)
  end
  if not equal63({2, 4, 6}, keep(even63, {1, 2, 3, 4, 5, 6})) then
    failed = failed + 1
    return("failed: expected " .. str({2, 4, 6}) .. ", was " .. str(keep(even63, {1, 2, 3, 4, 5, 6})))
  else
    passed = passed + 1
  end
  local _x882 = {2, 4, 6}
  _x882.b = 8
  local _x883 = {1, 2, 3, 4, 5, 6}
  _x883.b = 8
  _x883.a = 7
  if not equal63(_x882, keep(even63, _x883)) then
    failed = failed + 1
    local _x884 = {2, 4, 6}
    _x884.b = 8
    local _x885 = {1, 2, 3, 4, 5, 6}
    _x885.b = 8
    _x885.a = 7
    return("failed: expected " .. str(_x884) .. ", was " .. str(keep(even63, _x885)))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"in?", function ()
  if not equal63(true, in63("x", {"x", "y", "z"})) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(in63("x", {"x", "y", "z"})))
  else
    passed = passed + 1
  end
  if not equal63(true, in63(7, {5, 6, 7})) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(in63(7, {5, 6, 7})))
  else
    passed = passed + 1
  end
  if not equal63(nil, in63("baz", {"no", "can", "do"})) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(in63("baz", {"no", "can", "do"})))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"find", function (_)
  if not equal63(nil, find(function (_)
    return(_)
  end, {})) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(find(function (_)
      return(_)
    end, {})))
  else
    passed = passed + 1
  end
  if not equal63(7, find(function (_)
    return(_)
  end, {7})) then
    failed = failed + 1
    return("failed: expected " .. str(7) .. ", was " .. str(find(function (_)
      return(_)
    end, {7})))
  else
    passed = passed + 1
  end
  if not equal63(true, find(function (_)
    return(_ == 7)
  end, {2, 4, 7})) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(find(function (_)
      return(_ == 7)
    end, {2, 4, 7})))
  else
    passed = passed + 1
  end
  local _x898 = {2, 4}
  _x898.foo = 7
  if not equal63(true, find(function (_)
    return(_ == 7)
  end, _x898)) then
    failed = failed + 1
    local _x899 = {2, 4}
    _x899.foo = 7
    return("failed: expected " .. str(true) .. ", was " .. str(find(function (_)
      return(_ == 7)
    end, _x899)))
  else
    passed = passed + 1
  end
  local _x900 = {2, 4}
  _x900.bar = true
  if not equal63(true, find(function (_)
    return(_ == true)
  end, _x900)) then
    failed = failed + 1
    local _x901 = {2, 4}
    _x901.bar = true
    return("failed: expected " .. str(true) .. ", was " .. str(find(function (_)
      return(_ == true)
    end, _x901)))
  else
    passed = passed + 1
  end
  if not equal63(true, in63(7, {2, 4, 7})) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(in63(7, {2, 4, 7})))
  else
    passed = passed + 1
  end
  local _x904 = {2, 4}
  _x904.foo = 7
  if not equal63(true, in63(7, _x904)) then
    failed = failed + 1
    local _x905 = {2, 4}
    _x905.foo = 7
    return("failed: expected " .. str(true) .. ", was " .. str(in63(7, _x905)))
  else
    passed = passed + 1
  end
  local _x906 = {2, 4}
  _x906.bar = true
  if not equal63(true, in63(true, _x906)) then
    failed = failed + 1
    local _x907 = {2, 4}
    _x907.bar = true
    return("failed: expected " .. str(true) .. ", was " .. str(in63(true, _x907)))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"first", function (_)
  if not equal63(nil, first(function (_)
    return(_)
  end, {})) then
    failed = failed + 1
    return("failed: expected " .. str(nil) .. ", was " .. str(first(function (_)
      return(_)
    end, {})))
  else
    passed = passed + 1
  end
  if not equal63(7, first(function (_)
    return(_)
  end, {7})) then
    failed = failed + 1
    return("failed: expected " .. str(7) .. ", was " .. str(first(function (_)
      return(_)
    end, {7})))
  else
    passed = passed + 1
  end
  if not equal63(true, first(function (_)
    return(_ == 7)
  end, {2, 4, 7})) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(first(function (_)
      return(_ == 7)
    end, {2, 4, 7})))
  else
    passed = passed + 1
  end
  if not equal63(4, first(function (_)
    return(_ > 3 and _)
  end, {1, 2, 3, 4, 5, 6})) then
    failed = failed + 1
    return("failed: expected " .. str(4) .. ", was " .. str(first(function (_)
      return(_ > 3 and _)
    end, {1, 2, 3, 4, 5, 6})))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"sort", function ()
  if not equal63({"a", "b", "c"}, sort({"c", "a", "b"})) then
    failed = failed + 1
    return("failed: expected " .. str({"a", "b", "c"}) .. ", was " .. str(sort({"c", "a", "b"})))
  else
    passed = passed + 1
  end
  if not equal63({3, 2, 1}, sort({1, 2, 3}, _62)) then
    failed = failed + 1
    return("failed: expected " .. str({3, 2, 1}) .. ", was " .. str(sort({1, 2, 3}, _62)))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"type", function ()
  if not equal63(true, type("abc") == "string") then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(type("abc") == "string"))
  else
    passed = passed + 1
  end
  if not equal63(false, type(17) == "string") then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(type(17) == "string"))
  else
    passed = passed + 1
  end
  if not equal63(false, type({"a"}) == "string") then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(type({"a"}) == "string"))
  else
    passed = passed + 1
  end
  if not equal63(false, type(true) == "string") then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(type(true) == "string"))
  else
    passed = passed + 1
  end
  if not equal63(false, type({}) == "string") then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(type({}) == "string"))
  else
    passed = passed + 1
  end
  if not equal63(false, type("abc") == "number") then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(type("abc") == "number"))
  else
    passed = passed + 1
  end
  if not equal63(true, type(17) == "number") then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(type(17) == "number"))
  else
    passed = passed + 1
  end
  if not equal63(false, type({"a"}) == "number") then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(type({"a"}) == "number"))
  else
    passed = passed + 1
  end
  if not equal63(false, type(true) == "number") then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(type(true) == "number"))
  else
    passed = passed + 1
  end
  if not equal63(false, type({}) == "number") then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(type({}) == "number"))
  else
    passed = passed + 1
  end
  if not equal63(false, type("abc") == "boolean") then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(type("abc") == "boolean"))
  else
    passed = passed + 1
  end
  if not equal63(false, type(17) == "boolean") then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(type(17) == "boolean"))
  else
    passed = passed + 1
  end
  if not equal63(false, type({"a"}) == "boolean") then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(type({"a"}) == "boolean"))
  else
    passed = passed + 1
  end
  if not equal63(true, type(true) == "boolean") then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(type(true) == "boolean"))
  else
    passed = passed + 1
  end
  if not equal63(false, type({}) == "boolean") then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(type({}) == "boolean"))
  else
    passed = passed + 1
  end
  if not equal63(true, not( type(nil) == "table")) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(not( type(nil) == "table")))
  else
    passed = passed + 1
  end
  if not equal63(true, not( type("abc") == "table")) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(not( type("abc") == "table")))
  else
    passed = passed + 1
  end
  if not equal63(true, not( type(42) == "table")) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(not( type(42) == "table")))
  else
    passed = passed + 1
  end
  if not equal63(true, not( type(true) == "table")) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(not( type(true) == "table")))
  else
    passed = passed + 1
  end
  if not equal63(true, not( type(function ()
  end) == "table")) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(not( type(function ()
    end) == "table")))
  else
    passed = passed + 1
  end
  if not equal63(false, not( type({1}) == "table")) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(not( type({1}) == "table")))
  else
    passed = passed + 1
  end
  if not equal63(false, not( type({}) == "table")) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(not( type({}) == "table")))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"apply", function (_0, _1)
  if not equal63(4, apply(function (_0, _1)
    return(_0 + _1)
  end, {2, 2})) then
    failed = failed + 1
    return("failed: expected " .. str(4) .. ", was " .. str(apply(function (_0, _1)
      return(_0 + _1)
    end, {2, 2})))
  else
    passed = passed + 1
  end
  if not equal63({2, 2}, apply(function (...)
    local a = unstash({...})
    return(a)
  end, {2, 2})) then
    failed = failed + 1
    return("failed: expected " .. str({2, 2}) .. ", was " .. str(apply(function (...)
      local a = unstash({...})
      return(a)
    end, {2, 2})))
  else
    passed = passed + 1
  end
  local t = {1}
  t.foo = 17
  if not equal63(17, apply(function (...)
    local a = unstash({...})
    return(a.foo)
  end, t)) then
    failed = failed + 1
    return("failed: expected " .. str(17) .. ", was " .. str(apply(function (...)
      local a = unstash({...})
      return(a.foo)
    end, t)))
  else
    passed = passed + 1
  end
  local _x946 = {}
  _x946.foo = 42
  if not equal63(42, apply(function (...)
    local _r198 = unstash({...})
    local _id27 = _r198
    local foo = _id27.foo
    return(foo)
  end, _x946)) then
    failed = failed + 1
    local _x948 = {}
    _x948.foo = 42
    return("failed: expected " .. str(42) .. ", was " .. str(apply(function (...)
      local _r199 = unstash({...})
      local _id28 = _r199
      local foo = _id28.foo
      return(foo)
    end, _x948)))
  else
    passed = passed + 1
  end
  local _x951 = {}
  _x951.foo = 42
  if not equal63(42, apply(function (_x949)
    local _id29 = _x949
    local foo = _id29.foo
    return(foo)
  end, {_x951})) then
    failed = failed + 1
    local _x954 = {}
    _x954.foo = 42
    return("failed: expected " .. str(42) .. ", was " .. str(apply(function (_x952)
      local _id30 = _x952
      local foo = _id30.foo
      return(foo)
    end, {_x954})))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"eval", function ()
  local eval = compiler.eval
  if not equal63(4, eval({"+", 2, 2})) then
    failed = failed + 1
    return("failed: expected " .. str(4) .. ", was " .. str(eval({"+", 2, 2})))
  else
    passed = passed + 1
  end
  if not equal63(5, eval({"let", "a", 3, {"+", 2, "a"}})) then
    failed = failed + 1
    return("failed: expected " .. str(5) .. ", was " .. str(eval({"let", "a", 3, {"+", 2, "a"}})))
  else
    passed = passed + 1
  end
  if not equal63(9, eval({"do", {"var", "x", 7}, {"+", "x", 2}})) then
    failed = failed + 1
    return("failed: expected " .. str(9) .. ", was " .. str(eval({"do", {"var", "x", 7}, {"+", "x", 2}})))
  else
    passed = passed + 1
  end
  if not equal63(6, eval({"apply", "+", {"quote", {1, 2, 3}}})) then
    failed = failed + 1
    return("failed: expected " .. str(6) .. ", was " .. str(eval({"apply", "+", {"quote", {1, 2, 3}}})))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"call", function ()
  local f = function ()
    return(42)
  end
  if not equal63(42, call(f)) then
    failed = failed + 1
    return("failed: expected " .. str(42) .. ", was " .. str(call(f)))
  else
    passed = passed + 1
  end
  local fs = {function ()
    return(1)
  end, function ()
    return(10)
  end}
  if not equal63({1, 10}, map(call, fs)) then
    failed = failed + 1
    return("failed: expected " .. str({1, 10}) .. ", was " .. str(map(call, fs)))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"parameters", function ()
  if not equal63(42, (function (_x979)
    local _id31 = _x979
    local a = _id31[1]
    return(a)
  end)({42})) then
    failed = failed + 1
    return("failed: expected " .. str(42) .. ", was " .. str((function (_x981)
      local _id32 = _x981
      local a = _id32[1]
      return(a)
    end)({42})))
  else
    passed = passed + 1
  end
  local f = function (a, _x983)
    local _id33 = _x983
    local b = _id33[1]
    local c = _id33[2]
    return({a, b, c})
  end
  if not equal63({1, 2, 3}, f(1, {2, 3})) then
    failed = failed + 1
    return("failed: expected " .. str({1, 2, 3}) .. ", was " .. str(f(1, {2, 3})))
  else
    passed = passed + 1
  end
  local _f = function (a, _x989, ...)
    local _id34 = _x989
    local b = _id34[1]
    local c = cut(_id34, 1)
    local _r211 = unstash({...})
    local _id35 = _r211
    local d = cut(_id35, 0)
    return({a, b, c, d})
  end
  if not equal63({1, 2, {3, 4}, {5, 6, 7}}, _f(1, {2, 3, 4}, 5, 6, 7)) then
    failed = failed + 1
    return("failed: expected " .. str({1, 2, {3, 4}, {5, 6, 7}}) .. ", was " .. str(_f(1, {2, 3, 4}, 5, 6, 7)))
  else
    passed = passed + 1
  end
  if not equal63({3, 4}, (function (a, b, ...)
    local _r212 = unstash({...})
    local _id36 = _r212
    local c = cut(_id36, 0)
    return(c)
  end)(1, 2, 3, 4)) then
    failed = failed + 1
    return("failed: expected " .. str({3, 4}) .. ", was " .. str((function (a, b, ...)
      local _r213 = unstash({...})
      local _id37 = _r213
      local c = cut(_id37, 0)
      return(c)
    end)(1, 2, 3, 4)))
  else
    passed = passed + 1
  end
  local _f1 = function (w, _x1004, ...)
    local _id38 = _x1004
    local x = _id38[1]
    local y = cut(_id38, 1)
    local _r214 = unstash({...})
    local _id39 = _r214
    local z = cut(_id39, 0)
    return({y, z})
  end
  if not equal63({{3, 4}, {5, 6, 7}}, _f1(1, {2, 3, 4}, 5, 6, 7)) then
    failed = failed + 1
    return("failed: expected " .. str({{3, 4}, {5, 6, 7}}) .. ", was " .. str(_f1(1, {2, 3, 4}, 5, 6, 7)))
  else
    passed = passed + 1
  end
  if not equal63(42, (function (...)
    local _r215 = unstash({...})
    local _id40 = _r215
    local foo = _id40.foo
    return(foo)
  end)({_stash = true, foo = 42})) then
    failed = failed + 1
    return("failed: expected " .. str(42) .. ", was " .. str((function (...)
      local _r216 = unstash({...})
      local _id41 = _r216
      local foo = _id41.foo
      return(foo)
    end)({_stash = true, foo = 42})))
  else
    passed = passed + 1
  end
  local _x1018 = {}
  _x1018.foo = 42
  if not equal63(42, (function (_x1017)
    local _id42 = _x1017
    local foo = _id42.foo
    return(foo)
  end)(_x1018)) then
    failed = failed + 1
    local _x1020 = {}
    _x1020.foo = 42
    return("failed: expected " .. str(42) .. ", was " .. str((function (_x1019)
      local _id43 = _x1019
      local foo = _id43.foo
      return(foo)
    end)(_x1020)))
  else
    passed = passed + 1
  end
  local _f2 = function (a, _x1021, ...)
    local _id44 = _x1021
    local foo = _id44.foo
    local _r219 = unstash({...})
    local _id45 = _r219
    local b = _id45.bar
    return({a, b, foo})
  end
  local _x1025 = {}
  _x1025.foo = 42
  if not equal63({10, 20, 42}, _f2(10, _x1025, {_stash = true, bar = 20})) then
    failed = failed + 1
    local _x1027 = {}
    _x1027.foo = 42
    return("failed: expected " .. str({10, 20, 42}) .. ", was " .. str(_f2(10, _x1027, {_stash = true, bar = 20})))
  else
    passed = passed + 1
  end
  local _f3 = function (...)
    local args = unstash({...})
    return(args)
  end
  if not equal63({1, 2, 3}, _f3(1, 2, 3)) then
    failed = failed + 1
    return("failed: expected " .. str({1, 2, 3}) .. ", was " .. str(_f3(1, 2, 3)))
  else
    passed = passed + 1
    return(passed)
  end
end})
if _x1031 == nil then
  _x1031 = true
  run_tests()
end