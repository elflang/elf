require("elf")
local reader = require("reader")
local compiler = require("compiler")
local passed = 0
local failed = 0
local tests = {}
setenv("test", stash33({macro = function (x, msg)
  return({"if", {"not", x}, {"do", {"=", "failed", {"+", "failed", 1}}, {"return", msg}}, {"++", "passed"}})
end}))
local function equal63(a, b)
  if not( type(a) == "table") then
    return(a == b)
  else
    return(str(a) == str(b))
  end
end
setenv("eq", stash33({macro = function (a, b)
  return({"test", {"equal?", a, b}, {"cat", "\"failed: expected \"", {"str", a}, "\", was \"", {"str", b}}})
end}))
setenv("deftest", stash33({macro = function (name, ...)
  local _r6 = unstash({...})
  local body = cut(_r6, 0)
  return({"add", "tests", {"list", {"quote", name}, {"%fn", join({"do"}, body)}}})
end}))
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
  local _x59 = nil
  local _msg1 = nil
  local _trace1 = nil
  local _e6
  if xpcall(function ()
    _x59 = read("(open")
    return(_x59)
  end, function (_)
    _msg1 = clip(_, search(_, ": ") + 2)
    _trace1 = debug.traceback()
    return(_trace1)
  end) then
    _e6 = {true, _x59}
  else
    _e6 = {false, _msg1, _trace1}
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
add(tests, {"bool", function ()
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
  local _id48 = true
  local _e7
  if _id48 then
    _e7 = _id48
  else
    error("bad")
    _e7 = nil
  end
  if not equal63(true, _e7) then
    failed = failed + 1
    local _id49 = true
    local _e8
    if _id49 then
      _e8 = _id49
    else
      error("bad")
      _e8 = nil
    end
    return("failed: expected " .. str(true) .. ", was " .. str(_e8))
  else
    passed = passed + 1
  end
  local _id50 = false
  local _e9
  if _id50 then
    error("bad")
    _e9 = nil
  else
    _e9 = _id50
  end
  if not equal63(false, _e9) then
    failed = failed + 1
    local _id51 = false
    local _e10
    if _id51 then
      error("bad")
      _e10 = nil
    else
      _e10 = _id51
    end
    return("failed: expected " .. str(false) .. ", was " .. str(_e10))
  else
    passed = passed + 1
  end
  local a = true
  local _id52 = true
  local _e11
  if _id52 then
    _e11 = _id52
  else
    a = false
    _e11 = false
  end
  if not equal63(true, _e11) then
    failed = failed + 1
    local _id53 = true
    local _e12
    if _id53 then
      _e12 = _id53
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
  local _id54 = false
  local _e13
  if _id54 then
    a = false
    _e13 = true
  else
    _e13 = _id54
  end
  if not equal63(false, _e13) then
    failed = failed + 1
    local _id55 = false
    local _e14
    if _id55 then
      a = false
      _e14 = true
    else
      _e14 = _id55
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
  local _id56 = false
  local _e15
  if _id56 then
    _e15 = _id56
  else
    b = true
    _e15 = b
  end
  if not equal63(true, _e15) then
    failed = failed + 1
    b = false
    local _id57 = false
    local _e16
    if _id57 then
      _e16 = _id57
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
  local _id58 = b
  local _e17
  if _id58 then
    _e17 = _id58
  else
    b = true
    _e17 = b
  end
  if not equal63(true, _e17) then
    failed = failed + 1
    b = true
    local _id59 = b
    local _e18
    if _id59 then
      _e18 = _id59
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
  local _id60 = true
  local _e19
  if _id60 then
    b = true
    _e19 = b
  else
    _e19 = _id60
  end
  if not equal63(true, _e19) then
    failed = failed + 1
    b = false
    local _id61 = true
    local _e20
    if _id61 then
      b = true
      _e20 = b
    else
      _e20 = _id61
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
  local _id62 = b
  local _e21
  if _id62 then
    b = true
    _e21 = b
  else
    _e21 = _id62
  end
  if not equal63(false, _e21) then
    failed = failed + 1
    b = false
    local _id63 = b
    local _e22
    if _id63 then
      b = true
      _e22 = b
    else
      _e22 = _id63
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
  local _x127 = {}
  _x127.foo = 17
  if not equal63(17, _x127.foo) then
    failed = failed + 1
    local _x128 = {}
    _x128.foo = 17
    return("failed: expected " .. str(17) .. ", was " .. str(_x128.foo))
  else
    passed = passed + 1
  end
  local _x129 = {1}
  _x129.foo = 17
  if not equal63(17, _x129.foo) then
    failed = failed + 1
    local _x130 = {1}
    _x130.foo = 17
    return("failed: expected " .. str(17) .. ", was " .. str(_x130.foo))
  else
    passed = passed + 1
  end
  local _x131 = {}
  _x131.foo = true
  if not equal63(true, _x131.foo) then
    failed = failed + 1
    local _x132 = {}
    _x132.foo = true
    return("failed: expected " .. str(true) .. ", was " .. str(_x132.foo))
  else
    passed = passed + 1
  end
  local _x133 = {}
  _x133.foo = true
  if not equal63(true, _x133.foo) then
    failed = failed + 1
    local _x134 = {}
    _x134.foo = true
    return("failed: expected " .. str(true) .. ", was " .. str(_x134.foo))
  else
    passed = passed + 1
  end
  local _x136 = {}
  _x136.foo = true
  if not equal63(true, ({_x136})[1].foo) then
    failed = failed + 1
    local _x138 = {}
    _x138.foo = true
    return("failed: expected " .. str(true) .. ", was " .. str(({_x138})[1].foo))
  else
    passed = passed + 1
  end
  local _x139 = {}
  _x139.a = true
  local _x140 = {}
  _x140.a = true
  if not equal63(_x139, _x140) then
    failed = failed + 1
    local _x141 = {}
    _x141.a = true
    local _x142 = {}
    _x142.a = true
    return("failed: expected " .. str(_x141) .. ", was " .. str(_x142))
  else
    passed = passed + 1
  end
  local _x143 = {}
  _x143.b = false
  local _x144 = {}
  _x144.b = false
  if not equal63(_x143, _x144) then
    failed = failed + 1
    local _x145 = {}
    _x145.b = false
    local _x146 = {}
    _x146.b = false
    return("failed: expected " .. str(_x145) .. ", was " .. str(_x146))
  else
    passed = passed + 1
  end
  local _x147 = {}
  _x147.c = 0
  local _x148 = {}
  _x148.c = 0
  if not equal63(_x147, _x148) then
    failed = failed + 1
    local _x149 = {}
    _x149.c = 0
    local _x150 = {}
    _x150.c = 0
    return("failed: expected " .. str(_x149) .. ", was " .. str(_x150))
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
  local _x321 = {}
  _x321.foo = true
  if not equal63(true, _x321.foo) then
    failed = failed + 1
    local _x322 = {}
    _x322.foo = true
    return("failed: expected " .. str(true) .. ", was " .. str(_x322.foo))
  else
    passed = passed + 1
  end
  local _a1 = 17
  local b = {1, 2}
  local _c = {a = 10}
  local _x324 = {}
  _x324.a = 10
  local d = _x324
  local _x325 = {}
  _x325.foo = _a1
  if not equal63(17, _x325.foo) then
    failed = failed + 1
    local _x326 = {}
    _x326.foo = _a1
    return("failed: expected " .. str(17) .. ", was " .. str(_x326.foo))
  else
    passed = passed + 1
  end
  local _x327 = {}
  _x327.foo = _a1
  if not equal63(2, #(join(_x327, b))) then
    failed = failed + 1
    local _x328 = {}
    _x328.foo = _a1
    return("failed: expected " .. str(2) .. ", was " .. str(#(join(_x328, b))))
  else
    passed = passed + 1
  end
  local _x329 = {}
  _x329.foo = _a1
  if not equal63(17, _x329.foo) then
    failed = failed + 1
    local _x330 = {}
    _x330.foo = _a1
    return("failed: expected " .. str(17) .. ", was " .. str(_x330.foo))
  else
    passed = passed + 1
  end
  local _x331 = {1}
  _x331.a = 10
  if not equal63(_x331, join({1}, _c)) then
    failed = failed + 1
    local _x333 = {1}
    _x333.a = 10
    return("failed: expected " .. str(_x333) .. ", was " .. str(join({1}, _c)))
  else
    passed = passed + 1
  end
  local _x335 = {1}
  _x335.a = 10
  if not equal63(_x335, join({1}, d)) then
    failed = failed + 1
    local _x337 = {1}
    _x337.a = 10
    return("failed: expected " .. str(_x337) .. ", was " .. str(join({1}, d)))
  else
    passed = passed + 1
  end
  local _x340 = {}
  _x340.foo = true
  if not equal63(true, ({_x340})[1].foo) then
    failed = failed + 1
    local _x342 = {}
    _x342.foo = true
    return("failed: expected " .. str(true) .. ", was " .. str(({_x342})[1].foo))
  else
    passed = passed + 1
  end
  local _x344 = {}
  _x344.foo = true
  if not equal63(true, ({_x344})[1].foo) then
    failed = failed + 1
    local _x346 = {}
    _x346.foo = true
    return("failed: expected " .. str(true) .. ", was " .. str(({_x346})[1].foo))
  else
    passed = passed + 1
  end
  local _x347 = {}
  _x347.foo = true
  if not equal63(true, _x347.foo) then
    failed = failed + 1
    local _x348 = {}
    _x348.foo = true
    return("failed: expected " .. str(true) .. ", was " .. str(_x348.foo))
  else
    passed = passed + 1
  end
  local _x350 = {}
  _x350.foo = true
  if not equal63(true, join({1, 2, 3}, _x350).foo) then
    failed = failed + 1
    local _x352 = {}
    _x352.foo = true
    return("failed: expected " .. str(true) .. ", was " .. str(join({1, 2, 3}, _x352).foo))
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
add(tests, {"calls", function ()
  local f = function ()
    return(42)
  end
  local l = {f}
  local o = {f = f}
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
  if not equal63(42, o.f()) then
    failed = failed + 1
    return("failed: expected " .. str(42) .. ", was " .. str(o.f()))
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
  local _x521 = {}
  _x521.b = true
  _x521.a = true
  _x521.c = true
  local x = _x521
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
  local _x547 = "z"
  local _e2 = _x547
  local _e43
  if "z" == _e2 then
    _e43 = 9
  else
    _e43 = 10
  end
  if not equal63(9, _e43) then
    failed = failed + 1
    local _e3 = _x547
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
  local _e4 = _x547
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
    local _e5 = _x547
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
  local _x558 = {}
  _x558.a = true
  if not equal63(false, empty63(_x558)) then
    failed = failed + 1
    local _x559 = {}
    _x559.a = true
    return("failed: expected " .. str(false) .. ", was " .. str(empty63(_x559)))
  else
    passed = passed + 1
  end
  if not equal63(false, empty63({a = true})) then
    failed = failed + 1
    return("failed: expected " .. str(false) .. ", was " .. str(empty63({a = true})))
  else
    passed = passed + 1
  end
  local _x560 = {}
  _x560.b = false
  if not equal63(false, empty63(_x560)) then
    failed = failed + 1
    local _x561 = {}
    _x561.b = false
    return("failed: expected " .. str(false) .. ", was " .. str(empty63(_x561)))
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
  if not equal63("d", l[#(l) + -1 + 1]) then
    failed = failed + 1
    return("failed: expected " .. str("d") .. ", was " .. str(l[#(l) + -1 + 1]))
  else
    passed = passed + 1
  end
  if not equal63("c", l[#(l) + -2 + 1]) then
    failed = failed + 1
    return("failed: expected " .. str("c") .. ", was " .. str(l[#(l) + -2 + 1]))
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
  local l = {}
  l.foo = "bar"
  if not equal63("bar", l.foo) then
    failed = failed + 1
    return("failed: expected " .. str("bar") .. ", was " .. str(l.foo))
  else
    passed = passed + 1
  end
  if not equal63("bar", l.foo) then
    failed = failed + 1
    return("failed: expected " .. str("bar") .. ", was " .. str(l.foo))
  else
    passed = passed + 1
  end
  if not equal63("bar", l.foo) then
    failed = failed + 1
    return("failed: expected " .. str("bar") .. ", was " .. str(l.foo))
  else
    passed = passed + 1
  end
  local k = "foo"
  if not equal63("bar", l[k]) then
    failed = failed + 1
    return("failed: expected " .. str("bar") .. ", was " .. str(l[k]))
  else
    passed = passed + 1
  end
  if not equal63("bar", l["f" .. "oo"]) then
    failed = failed + 1
    return("failed: expected " .. str("bar") .. ", was " .. str(l["f" .. "oo"]))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"each", function ()
  local _x566 = {1, 2, 3}
  _x566.a = true
  _x566.b = false
  local l = _x566
  local a = 0
  local b = 0
  local _l3 = l
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
  local _l4 = l
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
  local _x567 = {{1}, {2}}
  _x567.b = {3}
  local _l5 = _x567
  local _l6 = _l5
  local _i3 = nil
  for _i3 in next, _l6 do
    local x = _l6[_i3]
    if not equal63(false, not( type(x) == "table")) then
      failed = failed + 1
      return("failed: expected " .. str(false) .. ", was " .. str(not( type(x) == "table")))
    else
      passed = passed + 1
    end
  end
  local _l7 = _l5
  local _i4 = nil
  for _i4 in next, _l7 do
    local x = _l7[_i4]
    if not equal63(false, not( type(x) == "table")) then
      failed = failed + 1
      return("failed: expected " .. str(false) .. ", was " .. str(not( type(x) == "table")))
    else
      passed = passed + 1
    end
  end
  local _l8 = _l5
  local _i5 = nil
  for _i5 in next, _l8 do
    local _id4 = _l8[_i5]
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
  local _x584 = nil
  local _msg2 = nil
  local _trace2 = nil
  local _e49
  if xpcall(function ()
    _x584 = 42
    return(_x584)
  end, function (_)
    _msg2 = clip(_, search(_, ": ") + 2)
    _trace2 = debug.traceback()
    return(_trace2)
  end) then
    _e49 = {true, _x584}
  else
    _e49 = {false, _msg2, _trace2}
  end
  if not equal63({true, 42}, cut(_e49, 0, 2)) then
    failed = failed + 1
    local _x588 = nil
    local _msg3 = nil
    local _trace3 = nil
    local _e50
    if xpcall(function ()
      _x588 = 42
      return(_x588)
    end, function (_)
      _msg3 = clip(_, search(_, ": ") + 2)
      _trace3 = debug.traceback()
      return(_trace3)
    end) then
      _e50 = {true, _x588}
    else
      _e50 = {false, _msg3, _trace3}
    end
    return("failed: expected " .. str({true, 42}) .. ", was " .. str(cut(_e50, 0, 2)))
  else
    passed = passed + 1
  end
  local _x592 = nil
  local _msg4 = nil
  local _trace4 = nil
  local _e51
  if xpcall(function ()
    error("foo")
    _x592 = nil
    return(_x592)
  end, function (_)
    _msg4 = clip(_, search(_, ": ") + 2)
    _trace4 = debug.traceback()
    return(_trace4)
  end) then
    _e51 = {true, _x592}
  else
    _e51 = {false, _msg4, _trace4}
  end
  if not equal63({false, "foo"}, cut(_e51, 0, 2)) then
    failed = failed + 1
    local _x596 = nil
    local _msg5 = nil
    local _trace5 = nil
    local _e52
    if xpcall(function ()
      error("foo")
      _x596 = nil
      return(_x596)
    end, function (_)
      _msg5 = clip(_, search(_, ": ") + 2)
      _trace5 = debug.traceback()
      return(_trace5)
    end) then
      _e52 = {true, _x596}
    else
      _e52 = {false, _msg5, _trace5}
    end
    return("failed: expected " .. str({false, "foo"}) .. ", was " .. str(cut(_e52, 0, 2)))
  else
    passed = passed + 1
  end
  local _x600 = nil
  local _msg6 = nil
  local _trace6 = nil
  local _e53
  if xpcall(function ()
    error("foo")
    error("baz")
    _x600 = nil
    return(_x600)
  end, function (_)
    _msg6 = clip(_, search(_, ": ") + 2)
    _trace6 = debug.traceback()
    return(_trace6)
  end) then
    _e53 = {true, _x600}
  else
    _e53 = {false, _msg6, _trace6}
  end
  if not equal63({false, "foo"}, cut(_e53, 0, 2)) then
    failed = failed + 1
    local _x604 = nil
    local _msg7 = nil
    local _trace7 = nil
    local _e54
    if xpcall(function ()
      error("foo")
      error("baz")
      _x604 = nil
      return(_x604)
    end, function (_)
      _msg7 = clip(_, search(_, ": ") + 2)
      _trace7 = debug.traceback()
      return(_trace7)
    end) then
      _e54 = {true, _x604}
    else
      _e54 = {false, _msg7, _trace7}
    end
    return("failed: expected " .. str({false, "foo"}) .. ", was " .. str(cut(_e54, 0, 2)))
  else
    passed = passed + 1
  end
  local _x608 = nil
  local _msg8 = nil
  local _trace8 = nil
  local _e55
  if xpcall(function ()
    local _x609 = nil
    local _msg9 = nil
    local _trace9 = nil
    local _e56
    if xpcall(function ()
      error("foo")
      _x609 = nil
      return(_x609)
    end, function (_)
      _msg9 = clip(_, search(_, ": ") + 2)
      _trace9 = debug.traceback()
      return(_trace9)
    end) then
      _e56 = {true, _x609}
    else
      _e56 = {false, _msg9, _trace9}
    end
    cut(_e56, 0, 2)
    error("baz")
    _x608 = nil
    return(_x608)
  end, function (_)
    _msg8 = clip(_, search(_, ": ") + 2)
    _trace8 = debug.traceback()
    return(_trace8)
  end) then
    _e55 = {true, _x608}
  else
    _e55 = {false, _msg8, _trace8}
  end
  if not equal63({false, "baz"}, cut(_e55, 0, 2)) then
    failed = failed + 1
    local _x615 = nil
    local _msg10 = nil
    local _trace10 = nil
    local _e57
    if xpcall(function ()
      local _x616 = nil
      local _msg11 = nil
      local _trace11 = nil
      local _e58
      if xpcall(function ()
        error("foo")
        _x616 = nil
        return(_x616)
      end, function (_)
        _msg11 = clip(_, search(_, ": ") + 2)
        _trace11 = debug.traceback()
        return(_trace11)
      end) then
        _e58 = {true, _x616}
      else
        _e58 = {false, _msg11, _trace11}
      end
      cut(_e58, 0, 2)
      error("baz")
      _x615 = nil
      return(_x615)
    end, function (_)
      _msg10 = clip(_, search(_, ": ") + 2)
      _trace10 = debug.traceback()
      return(_trace10)
    end) then
      _e57 = {true, _x615}
    else
      _e57 = {false, _msg10, _trace10}
    end
    return("failed: expected " .. str({false, "baz"}) .. ", was " .. str(cut(_e57, 0, 2)))
  else
    passed = passed + 1
  end
  local _x622 = nil
  local _msg12 = nil
  local _trace12 = nil
  local _e59
  if xpcall(function ()
    local _e60
    if true then
      _e60 = 42
    else
      error("baz")
      _e60 = nil
    end
    _x622 = _e60
    return(_x622)
  end, function (_)
    _msg12 = clip(_, search(_, ": ") + 2)
    _trace12 = debug.traceback()
    return(_trace12)
  end) then
    _e59 = {true, _x622}
  else
    _e59 = {false, _msg12, _trace12}
  end
  if not equal63({true, 42}, cut(_e59, 0, 2)) then
    failed = failed + 1
    local _x626 = nil
    local _msg13 = nil
    local _trace13 = nil
    local _e61
    if xpcall(function ()
      local _e62
      if true then
        _e62 = 42
      else
        error("baz")
        _e62 = nil
      end
      _x626 = _e62
      return(_x626)
    end, function (_)
      _msg13 = clip(_, search(_, ": ") + 2)
      _trace13 = debug.traceback()
      return(_trace13)
    end) then
      _e61 = {true, _x626}
    else
      _e61 = {false, _msg13, _trace13}
    end
    return("failed: expected " .. str({true, 42}) .. ", was " .. str(cut(_e61, 0, 2)))
  else
    passed = passed + 1
  end
  local _x630 = nil
  local _msg14 = nil
  local _trace14 = nil
  local _e63
  if xpcall(function ()
    local _e64
    if false then
      _e64 = 42
    else
      error("baz")
      _e64 = nil
    end
    _x630 = _e64
    return(_x630)
  end, function (_)
    _msg14 = clip(_, search(_, ": ") + 2)
    _trace14 = debug.traceback()
    return(_trace14)
  end) then
    _e63 = {true, _x630}
  else
    _e63 = {false, _msg14, _trace14}
  end
  if not equal63({false, "baz"}, cut(_e63, 0, 2)) then
    failed = failed + 1
    local _x634 = nil
    local _msg15 = nil
    local _trace15 = nil
    local _e65
    if xpcall(function ()
      local _e66
      if false then
        _e66 = 42
      else
        error("baz")
        _e66 = nil
      end
      _x634 = _e66
      return(_x634)
    end, function (_)
      _msg15 = clip(_, search(_, ": ") + 2)
      _trace15 = debug.traceback()
      return(_trace15)
    end) then
      _e65 = {true, _x634}
    else
      _e65 = {false, _msg15, _trace15}
    end
    return("failed: expected " .. str({false, "baz"}) .. ", was " .. str(cut(_e65, 0, 2)))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"let", function ()
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
    local _x639 = 9
    _x639 = _x639 + 1
    return("failed: expected " .. str(10) .. ", was " .. str(_x639))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"whenlet", function ()
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
    local a = _y4[1]
    local b = _y4[2]
    _e71 = b
  end
  if not equal63(20, _e71) then
    failed = failed + 1
    local _y5 = {19, 20}
    local _e72
    if _y5 then
      local a = _y5[1]
      local b = _y5[2]
      _e72 = b
    end
    return("failed: expected " .. str(20) .. ", was " .. str(_e72))
  else
    passed = passed + 1
  end
  local _y6 = nil
  local _e73
  if _y6 then
    local a = _y6[1]
    local b = _y6[2]
    _e73 = b
  end
  if not equal63(nil, _e73) then
    failed = failed + 1
    local _y7 = nil
    local _e74
    if _y7 then
      local a = _y7[1]
      local b = _y7[2]
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
local _x644 = {1, 2, 3}
_x644.a = 10
_x644.b = 20
local _id9 = _x644
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
  local _x670 = {}
  _x670.foo = 99
  local _id18 = _x670
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
  local _x674 = {99}
  _x674.baz = true
  local _id22 = {foo = 42, bar = _x674}
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
  local _x679 = {20}
  _x679.foo = 17
  local _x678 = {10, _x679}
  _x678.bar = {1, 2, 3}
  local _id24 = _x678
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
add(tests, {"w/mac", function ()
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
add(tests, {"w/sym", function ()
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
  setenv("zzz", stash33({symbol = 42}))
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
add(tests, {"w/uniq", function ()
  local ham = uniq("ham")
  local chap = uniq("chap")
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
  local _ham = uniq("ham")
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
  local _x737 = {"a"}
  _x737.b = true
  if not equal63(_x737, join({"a"}, {b = true})) then
    failed = failed + 1
    local _x739 = {"a"}
    _x739.b = true
    return("failed: expected " .. str(_x739) .. ", was " .. str(join({"a"}, {b = true})))
  else
    passed = passed + 1
  end
  local _x741 = {"a", "b"}
  _x741.b = true
  local _x743 = {"b"}
  _x743.b = true
  if not equal63(_x741, join({"a"}, _x743)) then
    failed = failed + 1
    local _x744 = {"a", "b"}
    _x744.b = true
    local _x746 = {"b"}
    _x746.b = true
    return("failed: expected " .. str(_x744) .. ", was " .. str(join({"a"}, _x746)))
  else
    passed = passed + 1
  end
  local _x747 = {"a"}
  _x747.b = 10
  local _x748 = {"a"}
  _x748.b = true
  if not equal63(_x747, join(_x748, {b = 10})) then
    failed = failed + 1
    local _x749 = {"a"}
    _x749.b = 10
    local _x750 = {"a"}
    _x750.b = true
    return("failed: expected " .. str(_x749) .. ", was " .. str(join(_x750, {b = 10})))
  else
    passed = passed + 1
  end
  local _x751 = {}
  _x751.b = 10
  local _x752 = {}
  _x752.b = 10
  if not equal63(_x751, join({b = true}, _x752)) then
    failed = failed + 1
    local _x753 = {}
    _x753.b = 10
    local _x754 = {}
    _x754.b = 10
    return("failed: expected " .. str(_x753) .. ", was " .. str(join({b = true}, _x754)))
  else
    passed = passed + 1
  end
  local _x755 = {"a"}
  _x755.b = 1
  local _x756 = {"b"}
  _x756.c = 2
  local l = join(_x755, _x756)
  if not equal63(1, l.b) then
    failed = failed + 1
    return("failed: expected " .. str(1) .. ", was " .. str(l.b))
  else
    passed = passed + 1
  end
  if not equal63(2, l.c) then
    failed = failed + 1
    return("failed: expected " .. str(2) .. ", was " .. str(l.c))
  else
    passed = passed + 1
  end
  if not equal63("b", l[2]) then
    failed = failed + 1
    return("failed: expected " .. str("b") .. ", was " .. str(l[2]))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"rev", function ()
  if not equal63({}, rev({})) then
    failed = failed + 1
    return("failed: expected " .. str({}) .. ", was " .. str(rev({})))
  else
    passed = passed + 1
  end
  if not equal63({3, 2, 1}, rev({1, 2, 3})) then
    failed = failed + 1
    return("failed: expected " .. str({3, 2, 1}) .. ", was " .. str(rev({1, 2, 3})))
  else
    passed = passed + 1
  end
  local _x762 = {3, 2, 1}
  _x762.a = true
  local _x763 = {1, 2, 3}
  _x763.a = true
  if not equal63(_x762, rev(_x763)) then
    failed = failed + 1
    local _x764 = {3, 2, 1}
    _x764.a = true
    local _x765 = {1, 2, 3}
    _x765.a = true
    return("failed: expected " .. str(_x764) .. ", was " .. str(rev(_x765)))
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
  local _x775 = {2, 3, 4}
  _x775.a = 5
  local _x776 = {1, 2, 3}
  _x776.a = 4
  if not equal63(_x775, map(function (_)
    return(_ + 1)
  end, _x776)) then
    failed = failed + 1
    local _x777 = {2, 3, 4}
    _x777.a = 5
    local _x778 = {1, 2, 3}
    _x778.a = 4
    return("failed: expected " .. str(_x777) .. ", was " .. str(map(function (_)
      return(_ + 1)
    end, _x778)))
  else
    passed = passed + 1
  end
  local _x779 = {}
  _x779.a = true
  local _x780 = {}
  _x780.a = true
  if not equal63(_x779, map(function (_)
    return(_)
  end, _x780)) then
    failed = failed + 1
    local _x781 = {}
    _x781.a = true
    local _x782 = {}
    _x782.a = true
    return("failed: expected " .. str(_x781) .. ", was " .. str(map(function (_)
      return(_)
    end, _x782)))
  else
    passed = passed + 1
  end
  local _x783 = {}
  _x783.b = false
  local _x784 = {}
  _x784.b = false
  if not equal63(_x783, map(function (_)
    return(_)
  end, _x784)) then
    failed = failed + 1
    local _x785 = {}
    _x785.b = false
    local _x786 = {}
    _x786.b = false
    return("failed: expected " .. str(_x785) .. ", was " .. str(map(function (_)
      return(_)
    end, _x786)))
  else
    passed = passed + 1
  end
  local _x787 = {}
  _x787.a = true
  _x787.b = false
  local _x788 = {}
  _x788.a = true
  _x788.b = false
  if not equal63(_x787, map(function (_)
    return(_)
  end, _x788)) then
    failed = failed + 1
    local _x789 = {}
    _x789.a = true
    _x789.b = false
    local _x790 = {}
    _x790.a = true
    _x790.b = false
    return("failed: expected " .. str(_x789) .. ", was " .. str(map(function (_)
      return(_)
    end, _x790)))
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
  local _x795 = {2, 4, 6}
  _x795.b = 8
  local _x796 = {1, 2, 3, 4, 5, 6}
  _x796.a = 7
  _x796.b = 8
  if not equal63(_x795, map(evens, _x796)) then
    failed = failed + 1
    local _x797 = {2, 4, 6}
    _x797.b = 8
    local _x798 = {1, 2, 3, 4, 5, 6}
    _x798.a = 7
    _x798.b = 8
    return("failed: expected " .. str(_x797) .. ", was " .. str(map(evens, _x798)))
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
  local _x824 = {2}
  _x824.a = true
  local _x825 = {1, 2}
  _x825.a = true
  if not equal63(_x824, cut(_x825, 1)) then
    failed = failed + 1
    local _x826 = {2}
    _x826.a = true
    local _x827 = {1, 2}
    _x827.a = true
    return("failed: expected " .. str(_x826) .. ", was " .. str(cut(_x827, 1)))
  else
    passed = passed + 1
  end
  local _x828 = {}
  _x828.a = true
  _x828.b = 2
  local _x829 = {}
  _x829.a = true
  _x829.b = 2
  if not equal63(_x828, cut(_x829)) then
    failed = failed + 1
    local _x830 = {}
    _x830.a = true
    _x830.b = 2
    local _x831 = {}
    _x831.a = true
    _x831.b = 2
    return("failed: expected " .. str(_x830) .. ", was " .. str(cut(_x831)))
  else
    passed = passed + 1
  end
  local l = {1, 2, 3}
  if not equal63({}, cut(l, #(l))) then
    failed = failed + 1
    return("failed: expected " .. str({}) .. ", was " .. str(cut(l, #(l))))
  else
    passed = passed + 1
  end
  local _x833 = {1, 2, 3}
  _x833.a = true
  local _l9 = _x833
  local _x834 = {}
  _x834.a = true
  if not equal63(_x834, cut(_l9, #(_l9))) then
    failed = failed + 1
    local _x835 = {}
    _x835.a = true
    return("failed: expected " .. str(_x835) .. ", was " .. str(cut(_l9, #(_l9))))
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
add(tests, {"reduce", function ()
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
add(tests, {"keep", function ()
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
  if not equal63({{1}, {2, 3}}, keep(function (_)
    return(#(_) > 0)
  end, {{}, {1}, {}, {2, 3}})) then
    failed = failed + 1
    return("failed: expected " .. str({{1}, {2, 3}}) .. ", was " .. str(keep(function (_)
      return(#(_) > 0)
    end, {{}, {1}, {}, {2, 3}})))
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
  local _x899 = {2, 4, 6}
  _x899.b = 8
  local _x900 = {1, 2, 3, 4, 5, 6}
  _x900.a = 7
  _x900.b = 8
  if not equal63(_x899, keep(even63, _x900)) then
    failed = failed + 1
    local _x901 = {2, 4, 6}
    _x901.b = 8
    local _x902 = {1, 2, 3, 4, 5, 6}
    _x902.a = 7
    _x902.b = 8
    return("failed: expected " .. str(_x901) .. ", was " .. str(keep(even63, _x902)))
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
add(tests, {"find", function ()
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
  local _x915 = {2, 4}
  _x915.foo = 7
  if not equal63(true, find(function (_)
    return(_ == 7)
  end, _x915)) then
    failed = failed + 1
    local _x916 = {2, 4}
    _x916.foo = 7
    return("failed: expected " .. str(true) .. ", was " .. str(find(function (_)
      return(_ == 7)
    end, _x916)))
  else
    passed = passed + 1
  end
  local _x917 = {2, 4}
  _x917.bar = true
  if not equal63(true, find(function (_)
    return(_ == true)
  end, _x917)) then
    failed = failed + 1
    local _x918 = {2, 4}
    _x918.bar = true
    return("failed: expected " .. str(true) .. ", was " .. str(find(function (_)
      return(_ == true)
    end, _x918)))
  else
    passed = passed + 1
  end
  if not equal63(true, in63(7, {2, 4, 7})) then
    failed = failed + 1
    return("failed: expected " .. str(true) .. ", was " .. str(in63(7, {2, 4, 7})))
  else
    passed = passed + 1
  end
  local _x921 = {2, 4}
  _x921.foo = 7
  if not equal63(true, in63(7, _x921)) then
    failed = failed + 1
    local _x922 = {2, 4}
    _x922.foo = 7
    return("failed: expected " .. str(true) .. ", was " .. str(in63(7, _x922)))
  else
    passed = passed + 1
  end
  local _x923 = {2, 4}
  _x923.bar = true
  if not equal63(true, in63(true, _x923)) then
    failed = failed + 1
    local _x924 = {2, 4}
    _x924.bar = true
    return("failed: expected " .. str(true) .. ", was " .. str(in63(true, _x924)))
  else
    passed = passed + 1
    return(passed)
  end
end})
add(tests, {"first", function ()
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
add(tests, {"apply", function ()
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
  local l = {1}
  l.foo = 17
  if not equal63(17, apply(function (...)
    local a = unstash({...})
    return(a.foo)
  end, l)) then
    failed = failed + 1
    return("failed: expected " .. str(17) .. ", was " .. str(apply(function (...)
      local a = unstash({...})
      return(a.foo)
    end, l)))
  else
    passed = passed + 1
  end
  local _x963 = {}
  _x963.foo = 42
  if not equal63(42, apply(function (...)
    local _r202 = unstash({...})
    local foo = _r202.foo
    return(foo)
  end, _x963)) then
    failed = failed + 1
    local _x965 = {}
    _x965.foo = 42
    return("failed: expected " .. str(42) .. ", was " .. str(apply(function (...)
      local _r203 = unstash({...})
      local foo = _r203.foo
      return(foo)
    end, _x965)))
  else
    passed = passed + 1
  end
  local _x968 = {}
  _x968.foo = 42
  if not equal63(42, apply(function (_x966)
    local foo = _x966.foo
    return(foo)
  end, {_x968})) then
    failed = failed + 1
    local _x971 = {}
    _x971.foo = 42
    return("failed: expected " .. str(42) .. ", was " .. str(apply(function (_x969)
      local foo = _x969.foo
      return(foo)
    end, {_x971})))
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
add(tests, {"parameters", function ()
  if not equal63(42, (function (_x992)
    local a = _x992[1]
    return(a)
  end)({42})) then
    failed = failed + 1
    return("failed: expected " .. str(42) .. ", was " .. str((function (_x994)
      local a = _x994[1]
      return(a)
    end)({42})))
  else
    passed = passed + 1
  end
  local f = function (a, _x996)
    local b = _x996[1]
    local c = _x996[2]
    return({a, b, c})
  end
  if not equal63({1, 2, 3}, f(1, {2, 3})) then
    failed = failed + 1
    return("failed: expected " .. str({1, 2, 3}) .. ", was " .. str(f(1, {2, 3})))
  else
    passed = passed + 1
  end
  local _f = function (a, _x1002, ...)
    local b = _x1002[1]
    local c = cut(_x1002, 1)
    local _r211 = unstash({...})
    local d = cut(_r211, 0)
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
    local c = cut(_r212, 0)
    return(c)
  end)(1, 2, 3, 4)) then
    failed = failed + 1
    return("failed: expected " .. str({3, 4}) .. ", was " .. str((function (a, b, ...)
      local _r213 = unstash({...})
      local c = cut(_r213, 0)
      return(c)
    end)(1, 2, 3, 4)))
  else
    passed = passed + 1
  end
  local _f1 = function (w, _x1017, ...)
    local x = _x1017[1]
    local y = cut(_x1017, 1)
    local _r214 = unstash({...})
    local z = cut(_r214, 0)
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
    local foo = _r215.foo
    return(foo)
  end)(stash33({foo = 42}))) then
    failed = failed + 1
    return("failed: expected " .. str(42) .. ", was " .. str((function (...)
      local _r216 = unstash({...})
      local foo = _r216.foo
      return(foo)
    end)(stash33({foo = 42}))))
  else
    passed = passed + 1
  end
  local _x1031 = {}
  _x1031.foo = 42
  if not equal63(42, (function (_x1030)
    local foo = _x1030.foo
    return(foo)
  end)(_x1031)) then
    failed = failed + 1
    local _x1033 = {}
    _x1033.foo = 42
    return("failed: expected " .. str(42) .. ", was " .. str((function (_x1032)
      local foo = _x1032.foo
      return(foo)
    end)(_x1033)))
  else
    passed = passed + 1
  end
  local _f2 = function (a, _x1034, ...)
    local foo = _x1034.foo
    local _r219 = unstash({...})
    local b = _r219.bar
    return({a, b, foo})
  end
  local _x1038 = {}
  _x1038.foo = 42
  if not equal63({10, 20, 42}, _f2(10, _x1038, stash33({bar = 20}))) then
    failed = failed + 1
    local _x1040 = {}
    _x1040.foo = 42
    return("failed: expected " .. str({10, 20, 42}) .. ", was " .. str(_f2(10, _x1040, stash33({bar = 20}))))
  else
    passed = passed + 1
  end
  if not equal63(1, (function (a, ...)
    local _r220 = unstash({...})
    local b = _r220.b
    return((a or 0) + b)
  end)(stash33({b = 1}))) then
    failed = failed + 1
    return("failed: expected " .. str(1) .. ", was " .. str((function (a, ...)
      local _r221 = unstash({...})
      local b = _r221.b
      return((a or 0) + b)
    end)(stash33({b = 1}))))
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
if _x1046 == nil then
  _x1046 = true
  run_tests()
end
