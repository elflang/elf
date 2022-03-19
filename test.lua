require("elf")
local reader = require("reader")
local compiler = require("compiler")
local passed = 0
local failed = 0
local tests = {}
local function test__macro(x, msg)
  return {"if", {"not", x}, {"do", {"=", "failed", {"+", "failed", 1}}, {"return", msg}}, {"++", "passed"}}
end
setenv("test", stash33({["macro"] = test__macro}))
local function eq__macro(a, b)
  return {"test", {"equal?", a, b}, {"cat", "\"failed: expected \"", {"str", a}, "\", was \"", {"str", b}}}
end
setenv("eq", stash33({["macro"] = eq__macro}))
local function deftest__macro(name, ...)
  local __r5 = unstash({...})
  local _body1 = cut(__r5, 0)
  return {"add", "tests", {"list", {"quote", name}, {"%fn", join({"do"}, _body1)}}}
end
setenv("deftest", stash33({["macro"] = deftest__macro}))
local function equal63(a, b)
  if not( type(a) == "table") then
    return a == b
  else
    return str(a) == str(b)
  end
end
function run_tests()
  local __l = tests
  local __i = nil
  for __i in next, __l do
    local __id2 = __l[__i]
    local _name = __id2[1]
    local _f = __id2[2]
    local _result = _f()
    if type(_result) == "string" then
      print(" " .. _name .. " " .. _result)
    end
  end
  return print(" " .. passed .. " passed, " .. failed .. " failed")
end
add(tests, {"reader", function ()
  local _read = reader["read-string"]
  if not equal63(nil, _read("")) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(_read(""))
  else
    passed = passed + 1
  end
  if not equal63("nil", _read("nil")) then
    failed = failed + 1
    return "failed: expected " .. str("nil") .. ", was " .. str(_read("nil"))
  else
    passed = passed + 1
  end
  if not equal63(17, _read("17")) then
    failed = failed + 1
    return "failed: expected " .. str(17) .. ", was " .. str(_read("17"))
  else
    passed = passed + 1
  end
  if not equal63(0.015, _read("1.5e-2")) then
    failed = failed + 1
    return "failed: expected " .. str(0.015) .. ", was " .. str(_read("1.5e-2"))
  else
    passed = passed + 1
  end
  if not equal63(true, _read("true")) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(_read("true"))
  else
    passed = passed + 1
  end
  if not equal63(not true, _read("false")) then
    failed = failed + 1
    return "failed: expected " .. str(not true) .. ", was " .. str(_read("false"))
  else
    passed = passed + 1
  end
  if not equal63("hi", _read("hi")) then
    failed = failed + 1
    return "failed: expected " .. str("hi") .. ", was " .. str(_read("hi"))
  else
    passed = passed + 1
  end
  if not equal63("\"hi\"", _read("\"hi\"")) then
    failed = failed + 1
    return "failed: expected " .. str("\"hi\"") .. ", was " .. str(_read("\"hi\""))
  else
    passed = passed + 1
  end
  if not equal63("|hi|", _read("|hi|")) then
    failed = failed + 1
    return "failed: expected " .. str("|hi|") .. ", was " .. str(_read("|hi|"))
  else
    passed = passed + 1
  end
  if not equal63({1, 2}, _read("(1 2)")) then
    failed = failed + 1
    return "failed: expected " .. str({1, 2}) .. ", was " .. str(_read("(1 2)"))
  else
    passed = passed + 1
  end
  if not equal63({1, {"a"}}, _read("(1 (a))")) then
    failed = failed + 1
    return "failed: expected " .. str({1, {"a"}}) .. ", was " .. str(_read("(1 (a))"))
  else
    passed = passed + 1
  end
  if not equal63({"quote", "a"}, _read("'a")) then
    failed = failed + 1
    return "failed: expected " .. str({"quote", "a"}) .. ", was " .. str(_read("'a"))
  else
    passed = passed + 1
  end
  if not equal63({"quasiquote", "a"}, _read("`a")) then
    failed = failed + 1
    return "failed: expected " .. str({"quasiquote", "a"}) .. ", was " .. str(_read("`a"))
  else
    passed = passed + 1
  end
  if not equal63({"quasiquote", {"unquote", "a"}}, _read("`,a")) then
    failed = failed + 1
    return "failed: expected " .. str({"quasiquote", {"unquote", "a"}}) .. ", was " .. str(_read("`,a"))
  else
    passed = passed + 1
  end
  if not equal63({"quasiquote", {"unquote-splicing", "a"}}, _read("`,@a")) then
    failed = failed + 1
    return "failed: expected " .. str({"quasiquote", {"unquote-splicing", "a"}}) .. ", was " .. str(_read("`,@a"))
  else
    passed = passed + 1
  end
  if not equal63(2, #(_read("(1 2 a: 7)"))) then
    failed = failed + 1
    return "failed: expected " .. str(2) .. ", was " .. str(#(_read("(1 2 a: 7)")))
  else
    passed = passed + 1
  end
  if not equal63(7, _read("(1 2 a: 7)").a) then
    failed = failed + 1
    return "failed: expected " .. str(7) .. ", was " .. str(_read("(1 2 a: 7)").a)
  else
    passed = passed + 1
  end
  if not equal63(true, _read("(:a)").a) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(_read("(:a)").a)
  else
    passed = passed + 1
  end
  if not equal63(1, - -1) then
    failed = failed + 1
    return "failed: expected " .. str(1) .. ", was " .. str(- -1)
  else
    passed = passed + 1
  end
  if not equal63(true, nan63(_read("nan"))) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(nan63(_read("nan")))
  else
    passed = passed + 1
  end
  if not equal63(true, nan63(_read("-nan"))) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(nan63(_read("-nan")))
  else
    passed = passed + 1
  end
  if not equal63(true, inf63(_read("inf"))) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(inf63(_read("inf")))
  else
    passed = passed + 1
  end
  if not equal63(true, inf63(_read("-inf"))) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(inf63(_read("-inf")))
  else
    passed = passed + 1
  end
  if not equal63("0?", _read("0?")) then
    failed = failed + 1
    return "failed: expected " .. str("0?") .. ", was " .. str(_read("0?"))
  else
    passed = passed + 1
  end
  if not equal63("0!", _read("0!")) then
    failed = failed + 1
    return "failed: expected " .. str("0!") .. ", was " .. str(_read("0!"))
  else
    passed = passed + 1
  end
  if not equal63("0.", _read("0.")) then
    failed = failed + 1
    return "failed: expected " .. str("0.") .. ", was " .. str(_read("0."))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"read-more", function ()
  local _read1 = reader["read-string"]
  if not equal63(17, _read1("17", true)) then
    failed = failed + 1
    return "failed: expected " .. str(17) .. ", was " .. str(_read1("17", true))
  else
    passed = passed + 1
  end
  local _more = {}
  if not equal63(_more, _read1("(open", _more)) then
    failed = failed + 1
    return "failed: expected " .. str(_more) .. ", was " .. str(_read1("(open", _more))
  else
    passed = passed + 1
  end
  if not equal63(_more, _read1("\"unterminated ", _more)) then
    failed = failed + 1
    return "failed: expected " .. str(_more) .. ", was " .. str(_read1("\"unterminated ", _more))
  else
    passed = passed + 1
  end
  if not equal63(_more, _read1("|identifier", _more)) then
    failed = failed + 1
    return "failed: expected " .. str(_more) .. ", was " .. str(_read1("|identifier", _more))
  else
    passed = passed + 1
  end
  if not equal63(_more, _read1("'(a b c", _more)) then
    failed = failed + 1
    return "failed: expected " .. str(_more) .. ", was " .. str(_read1("'(a b c", _more))
  else
    passed = passed + 1
  end
  if not equal63(_more, _read1("`(a b c", _more)) then
    failed = failed + 1
    return "failed: expected " .. str(_more) .. ", was " .. str(_read1("`(a b c", _more))
  else
    passed = passed + 1
  end
  if not equal63(_more, _read1("`(a b ,(z", _more)) then
    failed = failed + 1
    return "failed: expected " .. str(_more) .. ", was " .. str(_read1("`(a b ,(z", _more))
  else
    passed = passed + 1
  end
  if not equal63(_more, _read1("`\"biz", _more)) then
    failed = failed + 1
    return "failed: expected " .. str(_more) .. ", was " .. str(_read1("`\"biz", _more))
  else
    passed = passed + 1
  end
  if not equal63(_more, _read1("'\"boz", _more)) then
    failed = failed + 1
    return "failed: expected " .. str(_more) .. ", was " .. str(_read1("'\"boz", _more))
  else
    passed = passed + 1
  end
  local __x59 = nil
  local __msg1 = nil
  local __trace1 = nil
  local _e6
  if xpcall(function ()
    __x59 = _read1("(open")
    return __x59
  end, function (_)
    __msg1 = clip(_, search(_, ": ") + 2)
    __trace1 = debug.traceback()
    return __trace1
  end) then
    _e6 = {true, __x59}
  else
    _e6 = {false, __msg1, __trace1}
  end
  local __id3 = _e6
  local _ok = __id3[1]
  local _msg2 = __id3[2]
  if not equal63(false, _ok) then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(_ok)
  else
    passed = passed + 1
  end
  if not equal63("Expected ) at 5", _msg2) then
    failed = failed + 1
    return "failed: expected " .. str("Expected ) at 5") .. ", was " .. str(_msg2)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"bool", function ()
  if not equal63(true, true or false) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(true or false)
  else
    passed = passed + 1
  end
  if not equal63(false, false or false) then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(false or false)
  else
    passed = passed + 1
  end
  if not equal63(true, false or false or true) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(false or false or true)
  else
    passed = passed + 1
  end
  if not equal63(true, not false) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(not false)
  else
    passed = passed + 1
  end
  if not equal63(true, not( false and true)) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(not( false and true))
  else
    passed = passed + 1
  end
  if not equal63(false, not( false or true)) then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(not( false or true))
  else
    passed = passed + 1
  end
  if not equal63(true, not( false and true)) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(not( false and true))
  else
    passed = passed + 1
  end
  if not equal63(false, not( false or true)) then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(not( false or true))
  else
    passed = passed + 1
  end
  if not equal63(true, true and true) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(true and true)
  else
    passed = passed + 1
  end
  if not equal63(false, true and false) then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(true and false)
  else
    passed = passed + 1
  end
  if not equal63(false, true and true and false) then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(true and true and false)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"short", function ()
  local _id58 = true
  local _e7
  if _id58 then
    _e7 = _id58
  else
    error("bad")
    _e7 = nil
  end
  if not equal63(true, _e7) then
    failed = failed + 1
    local _id59 = true
    local _e8
    if _id59 then
      _e8 = _id59
    else
      error("bad")
      _e8 = nil
    end
    return "failed: expected " .. str(true) .. ", was " .. str(_e8)
  else
    passed = passed + 1
  end
  local _id60 = false
  local _e9
  if _id60 then
    error("bad")
    _e9 = nil
  else
    _e9 = _id60
  end
  if not equal63(false, _e9) then
    failed = failed + 1
    local _id61 = false
    local _e10
    if _id61 then
      error("bad")
      _e10 = nil
    else
      _e10 = _id61
    end
    return "failed: expected " .. str(false) .. ", was " .. str(_e10)
  else
    passed = passed + 1
  end
  local _a = true
  local _id62 = true
  local _e11
  if _id62 then
    _e11 = _id62
  else
    _a = false
    _e11 = false
  end
  if not equal63(true, _e11) then
    failed = failed + 1
    local _id63 = true
    local _e12
    if _id63 then
      _e12 = _id63
    else
      _a = false
      _e12 = false
    end
    return "failed: expected " .. str(true) .. ", was " .. str(_e12)
  else
    passed = passed + 1
  end
  if not equal63(true, _a) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(_a)
  else
    passed = passed + 1
  end
  local _id64 = false
  local _e13
  if _id64 then
    _a = false
    _e13 = true
  else
    _e13 = _id64
  end
  if not equal63(false, _e13) then
    failed = failed + 1
    local _id65 = false
    local _e14
    if _id65 then
      _a = false
      _e14 = true
    else
      _e14 = _id65
    end
    return "failed: expected " .. str(false) .. ", was " .. str(_e14)
  else
    passed = passed + 1
  end
  if not equal63(true, _a) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(_a)
  else
    passed = passed + 1
  end
  local _b = true
  _b = false
  local _id66 = false
  local _e15
  if _id66 then
    _e15 = _id66
  else
    _b = true
    _e15 = _b
  end
  if not equal63(true, _e15) then
    failed = failed + 1
    _b = false
    local _id67 = false
    local _e16
    if _id67 then
      _e16 = _id67
    else
      _b = true
      _e16 = _b
    end
    return "failed: expected " .. str(true) .. ", was " .. str(_e16)
  else
    passed = passed + 1
  end
  if not equal63(true, _b) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(_b)
  else
    passed = passed + 1
  end
  _b = true
  local _id68 = _b
  local _e17
  if _id68 then
    _e17 = _id68
  else
    _b = true
    _e17 = _b
  end
  if not equal63(true, _e17) then
    failed = failed + 1
    _b = true
    local _id69 = _b
    local _e18
    if _id69 then
      _e18 = _id69
    else
      _b = true
      _e18 = _b
    end
    return "failed: expected " .. str(true) .. ", was " .. str(_e18)
  else
    passed = passed + 1
  end
  if not equal63(true, _b) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(_b)
  else
    passed = passed + 1
  end
  _b = false
  local _id70 = true
  local _e19
  if _id70 then
    _b = true
    _e19 = _b
  else
    _e19 = _id70
  end
  if not equal63(true, _e19) then
    failed = failed + 1
    _b = false
    local _id71 = true
    local _e20
    if _id71 then
      _b = true
      _e20 = _b
    else
      _e20 = _id71
    end
    return "failed: expected " .. str(true) .. ", was " .. str(_e20)
  else
    passed = passed + 1
  end
  if not equal63(true, _b) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(_b)
  else
    passed = passed + 1
  end
  _b = false
  local _id72 = _b
  local _e21
  if _id72 then
    _b = true
    _e21 = _b
  else
    _e21 = _id72
  end
  if not equal63(false, _e21) then
    failed = failed + 1
    _b = false
    local _id73 = _b
    local _e22
    if _id73 then
      _b = true
      _e22 = _b
    else
      _e22 = _id73
    end
    return "failed: expected " .. str(false) .. ", was " .. str(_e22)
  else
    passed = passed + 1
  end
  if not equal63(false, _b) then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(_b)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"numeric", function ()
  if not equal63(4, 2 + 2) then
    failed = failed + 1
    return "failed: expected " .. str(4) .. ", was " .. str(2 + 2)
  else
    passed = passed + 1
  end
  if not equal63(4, apply(_43, {2, 2})) then
    failed = failed + 1
    return "failed: expected " .. str(4) .. ", was " .. str(apply(_43, {2, 2}))
  else
    passed = passed + 1
  end
  if not equal63(0, apply(_43, {})) then
    failed = failed + 1
    return "failed: expected " .. str(0) .. ", was " .. str(apply(_43, {}))
  else
    passed = passed + 1
  end
  if not equal63(18, 18) then
    failed = failed + 1
    return "failed: expected " .. str(18) .. ", was " .. str(18)
  else
    passed = passed + 1
  end
  if not equal63(4, 7 - 3) then
    failed = failed + 1
    return "failed: expected " .. str(4) .. ", was " .. str(7 - 3)
  else
    passed = passed + 1
  end
  if not equal63(4, apply(_, {7, 3})) then
    failed = failed + 1
    return "failed: expected " .. str(4) .. ", was " .. str(apply(_, {7, 3}))
  else
    passed = passed + 1
  end
  if not equal63(0, apply(_, {})) then
    failed = failed + 1
    return "failed: expected " .. str(0) .. ", was " .. str(apply(_, {}))
  else
    passed = passed + 1
  end
  if not equal63(5, 10 / 2) then
    failed = failed + 1
    return "failed: expected " .. str(5) .. ", was " .. str(10 / 2)
  else
    passed = passed + 1
  end
  if not equal63(5, apply(_47, {10, 2})) then
    failed = failed + 1
    return "failed: expected " .. str(5) .. ", was " .. str(apply(_47, {10, 2}))
  else
    passed = passed + 1
  end
  if not equal63(1, apply(_47, {})) then
    failed = failed + 1
    return "failed: expected " .. str(1) .. ", was " .. str(apply(_47, {}))
  else
    passed = passed + 1
  end
  if not equal63(6, 2 * 3) then
    failed = failed + 1
    return "failed: expected " .. str(6) .. ", was " .. str(2 * 3)
  else
    passed = passed + 1
  end
  if not equal63(6, apply(_42, {2, 3})) then
    failed = failed + 1
    return "failed: expected " .. str(6) .. ", was " .. str(apply(_42, {2, 3}))
  else
    passed = passed + 1
  end
  if not equal63(1, apply(_42, {})) then
    failed = failed + 1
    return "failed: expected " .. str(1) .. ", was " .. str(apply(_42, {}))
  else
    passed = passed + 1
  end
  if not equal63(true, 2.01 > 2) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(2.01 > 2)
  else
    passed = passed + 1
  end
  if not equal63(true, 5 >= 5) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(5 >= 5)
  else
    passed = passed + 1
  end
  if not equal63(true, 2100 > 2000) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(2100 > 2000)
  else
    passed = passed + 1
  end
  if not equal63(true, 0.002 < 0.0021) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(0.002 < 0.0021)
  else
    passed = passed + 1
  end
  if not equal63(false, 2 < 2) then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(2 < 2)
  else
    passed = passed + 1
  end
  if not equal63(true, 2 <= 2) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(2 <= 2)
  else
    passed = passed + 1
  end
  if not equal63(-7, - 7) then
    failed = failed + 1
    return "failed: expected " .. str(-7) .. ", was " .. str(- 7)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"math", function ()
  if not equal63(3, max(1, 3)) then
    failed = failed + 1
    return "failed: expected " .. str(3) .. ", was " .. str(max(1, 3))
  else
    passed = passed + 1
  end
  if not equal63(2, min(2, 7)) then
    failed = failed + 1
    return "failed: expected " .. str(2) .. ", was " .. str(min(2, 7))
  else
    passed = passed + 1
  end
  local _n1 = random()
  if not equal63(true, _n1 > 0 and _n1 < 1) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(_n1 > 0 and _n1 < 1)
  else
    passed = passed + 1
  end
  if not equal63(4, floor(4.78)) then
    failed = failed + 1
    return "failed: expected " .. str(4) .. ", was " .. str(floor(4.78))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"precedence", function ()
  if not equal63(-3, -( 1 + 2)) then
    failed = failed + 1
    return "failed: expected " .. str(-3) .. ", was " .. str(-( 1 + 2))
  else
    passed = passed + 1
  end
  if not equal63(10, 12 - (1 + 1)) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(12 - (1 + 1))
  else
    passed = passed + 1
  end
  if not equal63(11, 12 - 1 * 1) then
    failed = failed + 1
    return "failed: expected " .. str(11) .. ", was " .. str(12 - 1 * 1)
  else
    passed = passed + 1
  end
  if not equal63(10, 4 / 2 + 8) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(4 / 2 + 8)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"standalone", function ()
  if not equal63(10, 10) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(10)
  else
    passed = passed + 1
  end
  local _x76 = nil
  _x76 = 10
  if not equal63(9, 9) then
    failed = failed + 1
    _x76 = 10
    return "failed: expected " .. str(9) .. ", was " .. str(9)
  else
    passed = passed + 1
  end
  if not equal63(10, _x76) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(_x76)
  else
    passed = passed + 1
  end
  if not equal63(12, 12) then
    failed = failed + 1
    return "failed: expected " .. str(12) .. ", was " .. str(12)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"string", function ()
  if not equal63(3, #("foo")) then
    failed = failed + 1
    return "failed: expected " .. str(3) .. ", was " .. str(#("foo"))
  else
    passed = passed + 1
  end
  if not equal63(3, #("\"a\"")) then
    failed = failed + 1
    return "failed: expected " .. str(3) .. ", was " .. str(#("\"a\""))
  else
    passed = passed + 1
  end
  if not equal63("a", "a") then
    failed = failed + 1
    return "failed: expected " .. str("a") .. ", was " .. str("a")
  else
    passed = passed + 1
  end
  if not equal63("a", char("bar", 1)) then
    failed = failed + 1
    return "failed: expected " .. str("a") .. ", was " .. str(char("bar", 1))
  else
    passed = passed + 1
  end
  local _s = "a\nb"
  if not equal63(3, #(_s)) then
    failed = failed + 1
    return "failed: expected " .. str(3) .. ", was " .. str(#(_s))
  else
    passed = passed + 1
  end
  local _s1 = "a\nb\nc"
  if not equal63(5, #(_s1)) then
    failed = failed + 1
    return "failed: expected " .. str(5) .. ", was " .. str(#(_s1))
  else
    passed = passed + 1
  end
  if not equal63(3, #("a\nb")) then
    failed = failed + 1
    return "failed: expected " .. str(3) .. ", was " .. str(#("a\nb"))
  else
    passed = passed + 1
  end
  if not equal63(3, #("a\\b")) then
    failed = failed + 1
    return "failed: expected " .. str(3) .. ", was " .. str(#("a\\b"))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"quote", function ()
  if not equal63(7, 7) then
    failed = failed + 1
    return "failed: expected " .. str(7) .. ", was " .. str(7)
  else
    passed = passed + 1
  end
  if not equal63(true, true) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(true)
  else
    passed = passed + 1
  end
  if not equal63(false, false) then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(false)
  else
    passed = passed + 1
  end
  if not equal63("a", "a") then
    failed = failed + 1
    return "failed: expected " .. str("a") .. ", was " .. str("a")
  else
    passed = passed + 1
  end
  if not equal63({"quote", "a"}, {"quote", "a"}) then
    failed = failed + 1
    return "failed: expected " .. str({"quote", "a"}) .. ", was " .. str({"quote", "a"})
  else
    passed = passed + 1
  end
  if not equal63("\"a\"", "\"a\"") then
    failed = failed + 1
    return "failed: expected " .. str("\"a\"") .. ", was " .. str("\"a\"")
  else
    passed = passed + 1
  end
  if not equal63("\"\\n\"", "\"\\n\"") then
    failed = failed + 1
    return "failed: expected " .. str("\"\\n\"") .. ", was " .. str("\"\\n\"")
  else
    passed = passed + 1
  end
  if not equal63("\"\\\\\"", "\"\\\\\"") then
    failed = failed + 1
    return "failed: expected " .. str("\"\\\\\"") .. ", was " .. str("\"\\\\\"")
  else
    passed = passed + 1
  end
  if not equal63({"quote", "\"a\""}, {"quote", "\"a\""}) then
    failed = failed + 1
    return "failed: expected " .. str({"quote", "\"a\""}) .. ", was " .. str({"quote", "\"a\""})
  else
    passed = passed + 1
  end
  if not equal63("|(|", "|(|") then
    failed = failed + 1
    return "failed: expected " .. str("|(|") .. ", was " .. str("|(|")
  else
    passed = passed + 1
  end
  if not equal63("unquote", "unquote") then
    failed = failed + 1
    return "failed: expected " .. str("unquote") .. ", was " .. str("unquote")
  else
    passed = passed + 1
  end
  if not equal63({"unquote"}, {"unquote"}) then
    failed = failed + 1
    return "failed: expected " .. str({"unquote"}) .. ", was " .. str({"unquote"})
  else
    passed = passed + 1
  end
  if not equal63({"unquote", "a"}, {"unquote", "a"}) then
    failed = failed + 1
    return "failed: expected " .. str({"unquote", "a"}) .. ", was " .. str({"unquote", "a"})
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"list", function ()
  if not equal63({}, {}) then
    failed = failed + 1
    return "failed: expected " .. str({}) .. ", was " .. str({})
  else
    passed = passed + 1
  end
  if not equal63({}, {}) then
    failed = failed + 1
    return "failed: expected " .. str({}) .. ", was " .. str({})
  else
    passed = passed + 1
  end
  if not equal63({"a"}, {"a"}) then
    failed = failed + 1
    return "failed: expected " .. str({"a"}) .. ", was " .. str({"a"})
  else
    passed = passed + 1
  end
  if not equal63({"a"}, {"a"}) then
    failed = failed + 1
    return "failed: expected " .. str({"a"}) .. ", was " .. str({"a"})
  else
    passed = passed + 1
  end
  if not equal63({{}}, {{}}) then
    failed = failed + 1
    return "failed: expected " .. str({{}}) .. ", was " .. str({{}})
  else
    passed = passed + 1
  end
  if not equal63(0, #({})) then
    failed = failed + 1
    return "failed: expected " .. str(0) .. ", was " .. str(#({}))
  else
    passed = passed + 1
  end
  if not equal63(2, #({1, 2})) then
    failed = failed + 1
    return "failed: expected " .. str(2) .. ", was " .. str(#({1, 2}))
  else
    passed = passed + 1
  end
  if not equal63({1, 2, 3}, {1, 2, 3}) then
    failed = failed + 1
    return "failed: expected " .. str({1, 2, 3}) .. ", was " .. str({1, 2, 3})
  else
    passed = passed + 1
  end
  local __x128 = {}
  __x128.foo = 17
  if not equal63(17, __x128.foo) then
    failed = failed + 1
    local __x129 = {}
    __x129.foo = 17
    return "failed: expected " .. str(17) .. ", was " .. str(__x129.foo)
  else
    passed = passed + 1
  end
  local __x130 = {1}
  __x130.foo = 17
  if not equal63(17, __x130.foo) then
    failed = failed + 1
    local __x131 = {1}
    __x131.foo = 17
    return "failed: expected " .. str(17) .. ", was " .. str(__x131.foo)
  else
    passed = passed + 1
  end
  local __x132 = {}
  __x132.foo = true
  if not equal63(true, __x132.foo) then
    failed = failed + 1
    local __x133 = {}
    __x133.foo = true
    return "failed: expected " .. str(true) .. ", was " .. str(__x133.foo)
  else
    passed = passed + 1
  end
  local __x134 = {}
  __x134.foo = true
  if not equal63(true, __x134.foo) then
    failed = failed + 1
    local __x135 = {}
    __x135.foo = true
    return "failed: expected " .. str(true) .. ", was " .. str(__x135.foo)
  else
    passed = passed + 1
  end
  local __x137 = {}
  __x137.foo = true
  if not equal63(true, ({__x137})[1].foo) then
    failed = failed + 1
    local __x139 = {}
    __x139.foo = true
    return "failed: expected " .. str(true) .. ", was " .. str(({__x139})[1].foo)
  else
    passed = passed + 1
  end
  local __x140 = {}
  __x140.a = true
  local __x141 = {}
  __x141.a = true
  if not equal63(__x140, __x141) then
    failed = failed + 1
    local __x142 = {}
    __x142.a = true
    local __x143 = {}
    __x143.a = true
    return "failed: expected " .. str(__x142) .. ", was " .. str(__x143)
  else
    passed = passed + 1
  end
  local __x144 = {}
  __x144.b = false
  local __x145 = {}
  __x145.b = false
  if not equal63(__x144, __x145) then
    failed = failed + 1
    local __x146 = {}
    __x146.b = false
    local __x147 = {}
    __x147.b = false
    return "failed: expected " .. str(__x146) .. ", was " .. str(__x147)
  else
    passed = passed + 1
  end
  local __x148 = {}
  __x148.c = 0
  local __x149 = {}
  __x149.c = 0
  if not equal63(__x148, __x149) then
    failed = failed + 1
    local __x150 = {}
    __x150.c = 0
    local __x151 = {}
    __x151.c = 0
    return "failed: expected " .. str(__x150) .. ", was " .. str(__x151)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"quasiquote", function ()
  if not equal63("a", "a") then
    failed = failed + 1
    return "failed: expected " .. str("a") .. ", was " .. str("a")
  else
    passed = passed + 1
  end
  if not equal63("a", "a") then
    failed = failed + 1
    return "failed: expected " .. str("a") .. ", was " .. str("a")
  else
    passed = passed + 1
  end
  if not equal63({}, join()) then
    failed = failed + 1
    return "failed: expected " .. str({}) .. ", was " .. str(join())
  else
    passed = passed + 1
  end
  if not equal63(2, 2) then
    failed = failed + 1
    return "failed: expected " .. str(2) .. ", was " .. str(2)
  else
    passed = passed + 1
  end
  if not equal63(nil, nil) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(nil)
  else
    passed = passed + 1
  end
  local _a1 = 42
  if not equal63(42, _a1) then
    failed = failed + 1
    return "failed: expected " .. str(42) .. ", was " .. str(_a1)
  else
    passed = passed + 1
  end
  if not equal63(42, _a1) then
    failed = failed + 1
    return "failed: expected " .. str(42) .. ", was " .. str(_a1)
  else
    passed = passed + 1
  end
  if not equal63({"quasiquote", {"unquote", "a"}}, {"quasiquote", {"unquote", "a"}}) then
    failed = failed + 1
    return "failed: expected " .. str({"quasiquote", {"unquote", "a"}}) .. ", was " .. str({"quasiquote", {"unquote", "a"}})
  else
    passed = passed + 1
  end
  if not equal63({"quasiquote", {"unquote", 42}}, {"quasiquote", {"unquote", _a1}}) then
    failed = failed + 1
    return "failed: expected " .. str({"quasiquote", {"unquote", 42}}) .. ", was " .. str({"quasiquote", {"unquote", _a1}})
  else
    passed = passed + 1
  end
  if not equal63({"quasiquote", {"quasiquote", {"unquote", {"unquote", "a"}}}}, {"quasiquote", {"quasiquote", {"unquote", {"unquote", "a"}}}}) then
    failed = failed + 1
    return "failed: expected " .. str({"quasiquote", {"quasiquote", {"unquote", {"unquote", "a"}}}}) .. ", was " .. str({"quasiquote", {"quasiquote", {"unquote", {"unquote", "a"}}}})
  else
    passed = passed + 1
  end
  if not equal63({"quasiquote", {"quasiquote", {"unquote", {"unquote", 42}}}}, {"quasiquote", {"quasiquote", {"unquote", {"unquote", _a1}}}}) then
    failed = failed + 1
    return "failed: expected " .. str({"quasiquote", {"quasiquote", {"unquote", {"unquote", 42}}}}) .. ", was " .. str({"quasiquote", {"quasiquote", {"unquote", {"unquote", _a1}}}})
  else
    passed = passed + 1
  end
  if not equal63({"a", {"quasiquote", {"b", {"unquote", "c"}}}}, {"a", {"quasiquote", {"b", {"unquote", "c"}}}}) then
    failed = failed + 1
    return "failed: expected " .. str({"a", {"quasiquote", {"b", {"unquote", "c"}}}}) .. ", was " .. str({"a", {"quasiquote", {"b", {"unquote", "c"}}}})
  else
    passed = passed + 1
  end
  if not equal63({"a", {"quasiquote", {"b", {"unquote", 42}}}}, {"a", {"quasiquote", {"b", {"unquote", _a1}}}}) then
    failed = failed + 1
    return "failed: expected " .. str({"a", {"quasiquote", {"b", {"unquote", 42}}}}) .. ", was " .. str({"a", {"quasiquote", {"b", {"unquote", _a1}}}})
  else
    passed = passed + 1
  end
  local _b1 = "c"
  if not equal63({"quote", "c"}, {"quote", _b1}) then
    failed = failed + 1
    return "failed: expected " .. str({"quote", "c"}) .. ", was " .. str({"quote", _b1})
  else
    passed = passed + 1
  end
  if not equal63({42}, {_a1}) then
    failed = failed + 1
    return "failed: expected " .. str({42}) .. ", was " .. str({_a1})
  else
    passed = passed + 1
  end
  if not equal63({{42}}, {{_a1}}) then
    failed = failed + 1
    return "failed: expected " .. str({{42}}) .. ", was " .. str({{_a1}})
  else
    passed = passed + 1
  end
  if not equal63({41, {42}}, {41, {_a1}}) then
    failed = failed + 1
    return "failed: expected " .. str({41, {42}}) .. ", was " .. str({41, {_a1}})
  else
    passed = passed + 1
  end
  local _c = {1, 2, 3}
  if not equal63({{1, 2, 3}}, {_c}) then
    failed = failed + 1
    return "failed: expected " .. str({{1, 2, 3}}) .. ", was " .. str({_c})
  else
    passed = passed + 1
  end
  if not equal63({1, 2, 3}, _c) then
    failed = failed + 1
    return "failed: expected " .. str({1, 2, 3}) .. ", was " .. str(_c)
  else
    passed = passed + 1
  end
  if not equal63({0, 1, 2, 3}, join({0}, _c)) then
    failed = failed + 1
    return "failed: expected " .. str({0, 1, 2, 3}) .. ", was " .. str(join({0}, _c))
  else
    passed = passed + 1
  end
  if not equal63({0, 1, 2, 3, 4}, join({0}, _c, {4})) then
    failed = failed + 1
    return "failed: expected " .. str({0, 1, 2, 3, 4}) .. ", was " .. str(join({0}, _c, {4}))
  else
    passed = passed + 1
  end
  if not equal63({0, {1, 2, 3}, 4}, {0, _c, 4}) then
    failed = failed + 1
    return "failed: expected " .. str({0, {1, 2, 3}, 4}) .. ", was " .. str({0, _c, 4})
  else
    passed = passed + 1
  end
  if not equal63({1, 2, 3, 1, 2, 3}, join(_c, _c)) then
    failed = failed + 1
    return "failed: expected " .. str({1, 2, 3, 1, 2, 3}) .. ", was " .. str(join(_c, _c))
  else
    passed = passed + 1
  end
  if not equal63({{1, 2, 3}, 1, 2, 3}, join({_c}, _c)) then
    failed = failed + 1
    return "failed: expected " .. str({{1, 2, 3}, 1, 2, 3}) .. ", was " .. str(join({_c}, _c))
  else
    passed = passed + 1
  end
  local _a2 = 42
  if not equal63({"quasiquote", {{"unquote-splicing", {"list", "a"}}}}, {"quasiquote", {{"unquote-splicing", {"list", "a"}}}}) then
    failed = failed + 1
    return "failed: expected " .. str({"quasiquote", {{"unquote-splicing", {"list", "a"}}}}) .. ", was " .. str({"quasiquote", {{"unquote-splicing", {"list", "a"}}}})
  else
    passed = passed + 1
  end
  if not equal63({"quasiquote", {{"unquote-splicing", {"list", 42}}}}, {"quasiquote", {{"unquote-splicing", {"list", _a2}}}}) then
    failed = failed + 1
    return "failed: expected " .. str({"quasiquote", {{"unquote-splicing", {"list", 42}}}}) .. ", was " .. str({"quasiquote", {{"unquote-splicing", {"list", _a2}}}})
  else
    passed = passed + 1
  end
  local __x322 = {}
  __x322.foo = true
  if not equal63(true, __x322.foo) then
    failed = failed + 1
    local __x323 = {}
    __x323.foo = true
    return "failed: expected " .. str(true) .. ", was " .. str(__x323.foo)
  else
    passed = passed + 1
  end
  local _a3 = 17
  local _b2 = {1, 2}
  local _c1 = {["a"] = 10}
  local __x325 = {}
  __x325.a = 10
  local _d = __x325
  local __x326 = {}
  __x326.foo = _a3
  if not equal63(17, __x326.foo) then
    failed = failed + 1
    local __x327 = {}
    __x327.foo = _a3
    return "failed: expected " .. str(17) .. ", was " .. str(__x327.foo)
  else
    passed = passed + 1
  end
  local __x328 = {}
  __x328.foo = _a3
  if not equal63(2, #(join(__x328, _b2))) then
    failed = failed + 1
    local __x329 = {}
    __x329.foo = _a3
    return "failed: expected " .. str(2) .. ", was " .. str(#(join(__x329, _b2)))
  else
    passed = passed + 1
  end
  local __x330 = {}
  __x330.foo = _a3
  if not equal63(17, __x330.foo) then
    failed = failed + 1
    local __x331 = {}
    __x331.foo = _a3
    return "failed: expected " .. str(17) .. ", was " .. str(__x331.foo)
  else
    passed = passed + 1
  end
  local __x332 = {1}
  __x332.a = 10
  if not equal63(__x332, join({1}, _c1)) then
    failed = failed + 1
    local __x334 = {1}
    __x334.a = 10
    return "failed: expected " .. str(__x334) .. ", was " .. str(join({1}, _c1))
  else
    passed = passed + 1
  end
  local __x336 = {1}
  __x336.a = 10
  if not equal63(__x336, join({1}, _d)) then
    failed = failed + 1
    local __x338 = {1}
    __x338.a = 10
    return "failed: expected " .. str(__x338) .. ", was " .. str(join({1}, _d))
  else
    passed = passed + 1
  end
  local __x341 = {}
  __x341.foo = true
  if not equal63(true, ({__x341})[1].foo) then
    failed = failed + 1
    local __x343 = {}
    __x343.foo = true
    return "failed: expected " .. str(true) .. ", was " .. str(({__x343})[1].foo)
  else
    passed = passed + 1
  end
  local __x345 = {}
  __x345.foo = true
  if not equal63(true, ({__x345})[1].foo) then
    failed = failed + 1
    local __x347 = {}
    __x347.foo = true
    return "failed: expected " .. str(true) .. ", was " .. str(({__x347})[1].foo)
  else
    passed = passed + 1
  end
  local __x348 = {}
  __x348.foo = true
  if not equal63(true, __x348.foo) then
    failed = failed + 1
    local __x349 = {}
    __x349.foo = true
    return "failed: expected " .. str(true) .. ", was " .. str(__x349.foo)
  else
    passed = passed + 1
  end
  local __x351 = {}
  __x351.foo = true
  if not equal63(true, join({1, 2, 3}, __x351).foo) then
    failed = failed + 1
    local __x353 = {}
    __x353.foo = true
    return "failed: expected " .. str(true) .. ", was " .. str(join({1, 2, 3}, __x353).foo)
  else
    passed = passed + 1
  end
  if not equal63(true, ({["foo"] = true}).foo) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(({["foo"] = true}).foo)
  else
    passed = passed + 1
  end
  if not equal63(17, ({["bar"] = 17}).bar) then
    failed = failed + 1
    return "failed: expected " .. str(17) .. ", was " .. str(({["bar"] = 17}).bar)
  else
    passed = passed + 1
  end
  if not equal63(17, ({["baz"] = function ()
    return 17
  end}).baz()) then
    failed = failed + 1
    return "failed: expected " .. str(17) .. ", was " .. str(({["baz"] = function ()
      return 17
    end}).baz())
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"quasiexpand", function ()
  if not equal63("a", macroexpand("a")) then
    failed = failed + 1
    return "failed: expected " .. str("a") .. ", was " .. str(macroexpand("a"))
  else
    passed = passed + 1
  end
  if not equal63({17}, macroexpand({17})) then
    failed = failed + 1
    return "failed: expected " .. str({17}) .. ", was " .. str(macroexpand({17}))
  else
    passed = passed + 1
  end
  if not equal63({1, "z"}, macroexpand({1, "z"})) then
    failed = failed + 1
    return "failed: expected " .. str({1, "z"}) .. ", was " .. str(macroexpand({1, "z"}))
  else
    passed = passed + 1
  end
  if not equal63({"%array", 1, "\"z\""}, macroexpand({"quasiquote", {1, "z"}})) then
    failed = failed + 1
    return "failed: expected " .. str({"%array", 1, "\"z\""}) .. ", was " .. str(macroexpand({"quasiquote", {1, "z"}}))
  else
    passed = passed + 1
  end
  if not equal63({"%array", 1, "z"}, macroexpand({"quasiquote", {{"unquote", 1}, {"unquote", "z"}}})) then
    failed = failed + 1
    return "failed: expected " .. str({"%array", 1, "z"}) .. ", was " .. str(macroexpand({"quasiquote", {{"unquote", 1}, {"unquote", "z"}}}))
  else
    passed = passed + 1
  end
  if not equal63("z", macroexpand({"quasiquote", {{"unquote-splicing", "z"}}})) then
    failed = failed + 1
    return "failed: expected " .. str("z") .. ", was " .. str(macroexpand({"quasiquote", {{"unquote-splicing", "z"}}}))
  else
    passed = passed + 1
  end
  if not equal63({"join", {"%array", 1}, "z"}, macroexpand({"quasiquote", {{"unquote", 1}, {"unquote-splicing", "z"}}})) then
    failed = failed + 1
    return "failed: expected " .. str({"join", {"%array", 1}, "z"}) .. ", was " .. str(macroexpand({"quasiquote", {{"unquote", 1}, {"unquote-splicing", "z"}}}))
  else
    passed = passed + 1
  end
  if not equal63({"join", {"%array", 1}, "x", "y"}, macroexpand({"quasiquote", {{"unquote", 1}, {"unquote-splicing", "x"}, {"unquote-splicing", "y"}}})) then
    failed = failed + 1
    return "failed: expected " .. str({"join", {"%array", 1}, "x", "y"}) .. ", was " .. str(macroexpand({"quasiquote", {{"unquote", 1}, {"unquote-splicing", "x"}, {"unquote-splicing", "y"}}}))
  else
    passed = passed + 1
  end
  if not equal63({"join", {"%array", 1}, "z", {"%array", 2}}, macroexpand({"quasiquote", {{"unquote", 1}, {"unquote-splicing", "z"}, {"unquote", 2}}})) then
    failed = failed + 1
    return "failed: expected " .. str({"join", {"%array", 1}, "z", {"%array", 2}}) .. ", was " .. str(macroexpand({"quasiquote", {{"unquote", 1}, {"unquote-splicing", "z"}, {"unquote", 2}}}))
  else
    passed = passed + 1
  end
  if not equal63({"join", {"%array", 1}, "z", {"%array", "\"a\""}}, macroexpand({"quasiquote", {{"unquote", 1}, {"unquote-splicing", "z"}, "a"}})) then
    failed = failed + 1
    return "failed: expected " .. str({"join", {"%array", 1}, "z", {"%array", "\"a\""}}) .. ", was " .. str(macroexpand({"quasiquote", {{"unquote", 1}, {"unquote-splicing", "z"}, "a"}}))
  else
    passed = passed + 1
  end
  if not equal63("\"x\"", macroexpand({"quasiquote", "x"})) then
    failed = failed + 1
    return "failed: expected " .. str("\"x\"") .. ", was " .. str(macroexpand({"quasiquote", "x"}))
  else
    passed = passed + 1
  end
  if not equal63({"%array", "\"quasiquote\"", "\"x\""}, macroexpand({"quasiquote", {"quasiquote", "x"}})) then
    failed = failed + 1
    return "failed: expected " .. str({"%array", "\"quasiquote\"", "\"x\""}) .. ", was " .. str(macroexpand({"quasiquote", {"quasiquote", "x"}}))
  else
    passed = passed + 1
  end
  if not equal63({"%array", "\"quasiquote\"", {"%array", "\"quasiquote\"", "\"x\""}}, macroexpand({"quasiquote", {"quasiquote", {"quasiquote", "x"}}})) then
    failed = failed + 1
    return "failed: expected " .. str({"%array", "\"quasiquote\"", {"%array", "\"quasiquote\"", "\"x\""}}) .. ", was " .. str(macroexpand({"quasiquote", {"quasiquote", {"quasiquote", "x"}}}))
  else
    passed = passed + 1
  end
  if not equal63("x", macroexpand({"quasiquote", {"unquote", "x"}})) then
    failed = failed + 1
    return "failed: expected " .. str("x") .. ", was " .. str(macroexpand({"quasiquote", {"unquote", "x"}}))
  else
    passed = passed + 1
  end
  if not equal63({"%array", "\"quote\"", "x"}, macroexpand({"quasiquote", {"quote", {"unquote", "x"}}})) then
    failed = failed + 1
    return "failed: expected " .. str({"%array", "\"quote\"", "x"}) .. ", was " .. str(macroexpand({"quasiquote", {"quote", {"unquote", "x"}}}))
  else
    passed = passed + 1
  end
  if not equal63({"%array", "\"quasiquote\"", {"%array", "\"x\""}}, macroexpand({"quasiquote", {"quasiquote", {"x"}}})) then
    failed = failed + 1
    return "failed: expected " .. str({"%array", "\"quasiquote\"", {"%array", "\"x\""}}) .. ", was " .. str(macroexpand({"quasiquote", {"quasiquote", {"x"}}}))
  else
    passed = passed + 1
  end
  if not equal63({"%array", "\"quasiquote\"", {"%array", "\"unquote\"", "\"a\""}}, macroexpand({"quasiquote", {"quasiquote", {"unquote", "a"}}})) then
    failed = failed + 1
    return "failed: expected " .. str({"%array", "\"quasiquote\"", {"%array", "\"unquote\"", "\"a\""}}) .. ", was " .. str(macroexpand({"quasiquote", {"quasiquote", {"unquote", "a"}}}))
  else
    passed = passed + 1
  end
  if not equal63({"%array", "\"quasiquote\"", {"%array", {"%array", "\"unquote\"", "\"x\""}}}, macroexpand({"quasiquote", {"quasiquote", {{"unquote", "x"}}}})) then
    failed = failed + 1
    return "failed: expected " .. str({"%array", "\"quasiquote\"", {"%array", {"%array", "\"unquote\"", "\"x\""}}}) .. ", was " .. str(macroexpand({"quasiquote", {"quasiquote", {{"unquote", "x"}}}}))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"calls", function ()
  local _f1 = function ()
    return 42
  end
  local _l1 = {_f1}
  local _o = {["f"] = _f1}
  if not equal63(42, _f1()) then
    failed = failed + 1
    return "failed: expected " .. str(42) .. ", was " .. str(_f1())
  else
    passed = passed + 1
  end
  if not equal63(42, _l1[1]()) then
    failed = failed + 1
    return "failed: expected " .. str(42) .. ", was " .. str(_l1[1]())
  else
    passed = passed + 1
  end
  if not equal63(42, _o.f()) then
    failed = failed + 1
    return "failed: expected " .. str(42) .. ", was " .. str(_o.f())
  else
    passed = passed + 1
  end
  if not equal63(nil, (function ()
    return
  end)()) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str((function ()
      return
    end)())
  else
    passed = passed + 1
  end
  if not equal63(10, (function (_)
    return _ - 2
  end)(12)) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str((function (_)
      return _ - 2
    end)(12))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"id", function ()
  local _a4 = 10
  local _b3 = {["x"] = 20}
  local _f2 = function ()
    return 30
  end
  if not equal63(10, _a4) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(_a4)
  else
    passed = passed + 1
  end
  if not equal63(20, _b3.x) then
    failed = failed + 1
    return "failed: expected " .. str(20) .. ", was " .. str(_b3.x)
  else
    passed = passed + 1
  end
  if not equal63(30, _f2()) then
    failed = failed + 1
    return "failed: expected " .. str(30) .. ", was " .. str(_f2())
  else
    passed = passed + 1
  end
  local x = 0
  x = x + 1
  x = x + 1
  local y = x
  if not equal63(2, y) then
    failed = failed + 1
    return "failed: expected " .. str(2) .. ", was " .. str(y)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"names", function ()
  local _a33 = 0
  local _b63 = 1
  local __37 = 2
  local _4242 = 3
  local _break = 4
  if not equal63(0, _a33) then
    failed = failed + 1
    return "failed: expected " .. str(0) .. ", was " .. str(_a33)
  else
    passed = passed + 1
  end
  if not equal63(1, _b63) then
    failed = failed + 1
    return "failed: expected " .. str(1) .. ", was " .. str(_b63)
  else
    passed = passed + 1
  end
  if not equal63(2, __37) then
    failed = failed + 1
    return "failed: expected " .. str(2) .. ", was " .. str(__37)
  else
    passed = passed + 1
  end
  if not equal63(3, _4242) then
    failed = failed + 1
    return "failed: expected " .. str(3) .. ", was " .. str(_4242)
  else
    passed = passed + 1
  end
  if not equal63(4, _break) then
    failed = failed + 1
    return "failed: expected " .. str(4) .. ", was " .. str(_break)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"assign", function ()
  local _a5 = 42
  _a5 = "bar"
  if not equal63("bar", _a5) then
    failed = failed + 1
    return "failed: expected " .. str("bar") .. ", was " .. str(_a5)
  else
    passed = passed + 1
  end
  _a5 = 10
  local _x515 = _a5
  if not equal63(10, _x515) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(_x515)
  else
    passed = passed + 1
  end
  if not equal63(10, _a5) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(_a5)
  else
    passed = passed + 1
  end
  _a5 = false
  if not equal63(false, _a5) then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(_a5)
  else
    passed = passed + 1
  end
  _a5 = nil
  if not equal63(nil, _a5) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(_a5)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"=", function ()
  local _a6 = 42
  local _b4 = 7
  _a6 = "foo"
  _b4 = "bar"
  if not equal63("foo", _a6) then
    failed = failed + 1
    return "failed: expected " .. str("foo") .. ", was " .. str(_a6)
  else
    passed = passed + 1
  end
  if not equal63("bar", _b4) then
    failed = failed + 1
    return "failed: expected " .. str("bar") .. ", was " .. str(_b4)
  else
    passed = passed + 1
  end
  _a6 = 10
  local _x517 = _a6
  if not equal63(10, _x517) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(_x517)
  else
    passed = passed + 1
  end
  if not equal63(10, _a6) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(_a6)
  else
    passed = passed + 1
  end
  _a6 = false
  if not equal63(false, _a6) then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(_a6)
  else
    passed = passed + 1
  end
  _a6 = nil
  if not equal63(nil, _a6) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(_a6)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"wipe", function ()
  local __x520 = {}
  __x520.a = true
  __x520.b = true
  __x520.c = true
  local _x519 = __x520
  _x519.a = nil
  if not equal63(nil, _x519.a) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(_x519.a)
  else
    passed = passed + 1
  end
  if not equal63(true, _x519.b) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(_x519.b)
  else
    passed = passed + 1
  end
  _x519.c = nil
  if not equal63(nil, _x519.c) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(_x519.c)
  else
    passed = passed + 1
  end
  if not equal63(true, _x519.b) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(_x519.b)
  else
    passed = passed + 1
  end
  _x519.b = nil
  if not equal63(nil, _x519.b) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(_x519.b)
  else
    passed = passed + 1
  end
  if not equal63({}, _x519) then
    failed = failed + 1
    return "failed: expected " .. str({}) .. ", was " .. str(_x519)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"do", function ()
  local _a7 = 17
  _a7 = 10
  if not equal63(10, _a7) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(_a7)
  else
    passed = passed + 1
  end
  if not equal63(10, _a7) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(_a7)
  else
    passed = passed + 1
  end
  _a7 = 2
  local _b5 = _a7 + 5
  if not equal63(_a7, 2) then
    failed = failed + 1
    return "failed: expected " .. str(_a7) .. ", was " .. str(2)
  else
    passed = passed + 1
  end
  if not equal63(_b5, 7) then
    failed = failed + 1
    return "failed: expected " .. str(_b5) .. ", was " .. str(7)
  else
    passed = passed + 1
  end
  _a7 = 10
  _a7 = 20
  if not equal63(20, _a7) then
    failed = failed + 1
    return "failed: expected " .. str(20) .. ", was " .. str(_a7)
  else
    passed = passed + 1
  end
  _a7 = 10
  _a7 = 20
  if not equal63(20, _a7) then
    failed = failed + 1
    _a7 = 10
    _a7 = 20
    return "failed: expected " .. str(20) .. ", was " .. str(_a7)
  else
    passed = passed + 1
  end
  if not equal63(42, (function ()
    local _e23
    if true then
      return 42
    else
      _e23 = 2
    end
    return _e23
  end)()) then
    failed = failed + 1
    return "failed: expected " .. str(42) .. ", was " .. str((function ()
      local _e24
      if true then
        return 42
      else
        _e24 = 2
      end
      return _e24
    end)())
  else
    passed = passed + 1
  end
  if not equal63(42, (function ()
    local _x522 = 1
    local _e25
    if true then
      _e25 = 42
    else
      _e25 = _x522
    end
    return _e25
  end)()) then
    failed = failed + 1
    return "failed: expected " .. str(42) .. ", was " .. str((function ()
      local _x523 = 1
      local _e26
      if true then
        _e26 = 42
      else
        _e26 = _x523
      end
      return _e26
    end)())
  else
    passed = passed + 1
  end
  if not equal63(42, (function ()
    local _x524 = 42
    while true do
      local _e27
      if true then
        break
      end
      if not _e27 then
        break
      end
    end
    return _x524
  end)()) then
    failed = failed + 1
    return "failed: expected " .. str(42) .. ", was " .. str((function ()
      local _x525 = 42
      while true do
        local _e28
        if true then
          break
        end
        if not _e28 then
          break
        end
      end
      return _x525
    end)())
  else
    passed = passed + 1
  end
  if not equal63(42, (function ()
    local _x526 = 42
    while true do
      local _e29
      if true then
        break
      end
      if not _e29 then
        break
      end
    end
    return _x526
  end)()) then
    failed = failed + 1
    return "failed: expected " .. str(42) .. ", was " .. str((function ()
      local _x527 = 42
      while true do
        local _e30
        if true then
          break
        end
        if not _e30 then
          break
        end
      end
      return _x527
    end)())
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"if", function ()
  if not equal63("a", macroexpand({"if", "a"})) then
    failed = failed + 1
    return "failed: expected " .. str("a") .. ", was " .. str(macroexpand({"if", "a"}))
  else
    passed = passed + 1
  end
  if not equal63({"%if", "a", "b"}, macroexpand({"if", "a", "b"})) then
    failed = failed + 1
    return "failed: expected " .. str({"%if", "a", "b"}) .. ", was " .. str(macroexpand({"if", "a", "b"}))
  else
    passed = passed + 1
  end
  if not equal63({"%if", "a", "b", "c"}, macroexpand({"if", "a", "b", "c"})) then
    failed = failed + 1
    return "failed: expected " .. str({"%if", "a", "b", "c"}) .. ", was " .. str(macroexpand({"if", "a", "b", "c"}))
  else
    passed = passed + 1
  end
  if not equal63({"%if", "a", "b", {"%if", "c", "d"}}, macroexpand({"if", "a", "b", "c", "d"})) then
    failed = failed + 1
    return "failed: expected " .. str({"%if", "a", "b", {"%if", "c", "d"}}) .. ", was " .. str(macroexpand({"if", "a", "b", "c", "d"}))
  else
    passed = passed + 1
  end
  if not equal63({"%if", "a", "b", {"%if", "c", "d", "e"}}, macroexpand({"if", "a", "b", "c", "d", "e"})) then
    failed = failed + 1
    return "failed: expected " .. str({"%if", "a", "b", {"%if", "c", "d", "e"}}) .. ", was " .. str(macroexpand({"if", "a", "b", "c", "d", "e"}))
  else
    passed = passed + 1
  end
  if true then
    if not equal63(true, true) then
      failed = failed + 1
      return "failed: expected " .. str(true) .. ", was " .. str(true)
    else
      passed = passed + 1
    end
  else
    if not equal63(true, false) then
      failed = failed + 1
      return "failed: expected " .. str(true) .. ", was " .. str(false)
    else
      passed = passed + 1
    end
  end
  if false then
    if not equal63(true, false) then
      failed = failed + 1
      return "failed: expected " .. str(true) .. ", was " .. str(false)
    else
      passed = passed + 1
    end
  else
    if false then
      if not equal63(false, true) then
        failed = failed + 1
        return "failed: expected " .. str(false) .. ", was " .. str(true)
      else
        passed = passed + 1
      end
    else
      if not equal63(true, true) then
        failed = failed + 1
        return "failed: expected " .. str(true) .. ", was " .. str(true)
      else
        passed = passed + 1
      end
    end
  end
  if false then
    if not equal63(true, false) then
      failed = failed + 1
      return "failed: expected " .. str(true) .. ", was " .. str(false)
    else
      passed = passed + 1
    end
  else
    if false then
      if not equal63(false, true) then
        failed = failed + 1
        return "failed: expected " .. str(false) .. ", was " .. str(true)
      else
        passed = passed + 1
      end
    else
      if false then
        if not equal63(false, true) then
          failed = failed + 1
          return "failed: expected " .. str(false) .. ", was " .. str(true)
        else
          passed = passed + 1
        end
      else
        if not equal63(true, true) then
          failed = failed + 1
          return "failed: expected " .. str(true) .. ", was " .. str(true)
        else
          passed = passed + 1
        end
      end
    end
  end
  if false then
    if not equal63(true, false) then
      failed = failed + 1
      return "failed: expected " .. str(true) .. ", was " .. str(false)
    else
      passed = passed + 1
    end
  else
    if true then
      if not equal63(true, true) then
        failed = failed + 1
        return "failed: expected " .. str(true) .. ", was " .. str(true)
      else
        passed = passed + 1
      end
    else
      if false then
        if not equal63(false, true) then
          failed = failed + 1
          return "failed: expected " .. str(false) .. ", was " .. str(true)
        else
          passed = passed + 1
        end
      else
        if not equal63(true, true) then
          failed = failed + 1
          return "failed: expected " .. str(true) .. ", was " .. str(true)
        else
          passed = passed + 1
        end
      end
    end
  end
  local _e31
  if true then
    _e31 = 1
  else
    _e31 = 2
  end
  if not equal63(1, _e31) then
    failed = failed + 1
    local _e32
    if true then
      _e32 = 1
    else
      _e32 = 2
    end
    return "failed: expected " .. str(1) .. ", was " .. str(_e32)
  else
    passed = passed + 1
  end
  local _e33
  local _a8 = 10
  if _a8 then
    _e33 = 1
  else
    _e33 = 2
  end
  if not equal63(1, _e33) then
    failed = failed + 1
    local _e34
    local _a9 = 10
    if _a9 then
      _e34 = 1
    else
      _e34 = 2
    end
    return "failed: expected " .. str(1) .. ", was " .. str(_e34)
  else
    passed = passed + 1
  end
  local _e35
  if true then
    local _a10 = 1
    _e35 = _a10
  else
    _e35 = 2
  end
  if not equal63(1, _e35) then
    failed = failed + 1
    local _e36
    if true then
      local _a11 = 1
      _e36 = _a11
    else
      _e36 = 2
    end
    return "failed: expected " .. str(1) .. ", was " .. str(_e36)
  else
    passed = passed + 1
  end
  local _e37
  if false then
    _e37 = 2
  else
    local _a12 = 1
    _e37 = _a12
  end
  if not equal63(1, _e37) then
    failed = failed + 1
    local _e38
    if false then
      _e38 = 2
    else
      local _a13 = 1
      _e38 = _a13
    end
    return "failed: expected " .. str(1) .. ", was " .. str(_e38)
  else
    passed = passed + 1
  end
  local _e39
  if false then
    _e39 = 2
  else
    local _e40
    if true then
      local _a14 = 1
      _e40 = _a14
    end
    _e39 = _e40
  end
  if not equal63(1, _e39) then
    failed = failed + 1
    local _e41
    if false then
      _e41 = 2
    else
      local _e42
      if true then
        local _a15 = 1
        _e42 = _a15
      end
      _e41 = _e42
    end
    return "failed: expected " .. str(1) .. ", was " .. str(_e41)
  else
    passed = passed + 1
  end
  local _e43
  if false then
    _e43 = 2
  else
    local _e44
    if false then
      _e44 = 3
    else
      local _a16 = 1
      _e44 = _a16
    end
    _e43 = _e44
  end
  if not equal63(1, _e43) then
    failed = failed + 1
    local _e45
    if false then
      _e45 = 2
    else
      local _e46
      if false then
        _e46 = 3
      else
        local _a17 = 1
        _e46 = _a17
      end
      _e45 = _e46
    end
    return "failed: expected " .. str(1) .. ", was " .. str(_e45)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"case", function ()
  local _x552 = 10
  local __e = _x552
  local _e47
  if 9 == __e then
    _e47 = 9
  else
    local _e48
    if 10 == __e then
      _e48 = 2
    else
      _e48 = 4
    end
    _e47 = _e48
  end
  if not equal63(2, _e47) then
    failed = failed + 1
    local __e1 = _x552
    local _e49
    if 9 == __e1 then
      _e49 = 9
    else
      local _e50
      if 10 == __e1 then
        _e50 = 2
      else
        _e50 = 4
      end
      _e49 = _e50
    end
    return "failed: expected " .. str(2) .. ", was " .. str(_e49)
  else
    passed = passed + 1
  end
  local _x553 = "z"
  local __e2 = _x553
  local _e51
  if "z" == __e2 then
    _e51 = 9
  else
    _e51 = 10
  end
  if not equal63(9, _e51) then
    failed = failed + 1
    local __e3 = _x553
    local _e52
    if "z" == __e3 then
      _e52 = 9
    else
      _e52 = 10
    end
    return "failed: expected " .. str(9) .. ", was " .. str(_e52)
  else
    passed = passed + 1
  end
  local __e4 = _x553
  local _e53
  if "a" == __e4 then
    _e53 = 1
  else
    local _e54
    if "b" == __e4 then
      _e54 = 2
    else
      _e54 = 7
    end
    _e53 = _e54
  end
  if not equal63(7, _e53) then
    failed = failed + 1
    local __e5 = _x553
    local _e55
    if "a" == __e5 then
      _e55 = 1
    else
      local _e56
      if "b" == __e5 then
        _e56 = 2
      else
        _e56 = 7
      end
      _e55 = _e56
    end
    return "failed: expected " .. str(7) .. ", was " .. str(_e55)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"while", function ()
  local _i1 = 0
  while _i1 < 5 do
    if _i1 == 3 then
      break
    else
      _i1 = _i1 + 1
    end
  end
  if not equal63(3, _i1) then
    failed = failed + 1
    return "failed: expected " .. str(3) .. ", was " .. str(_i1)
  else
    passed = passed + 1
  end
  while _i1 < 10 do
    _i1 = _i1 + 1
  end
  if not equal63(10, _i1) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(_i1)
  else
    passed = passed + 1
  end
  while _i1 < 15 do
    _i1 = _i1 + 1
  end
  local _a18
  if not equal63(nil, _a18) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(_a18)
  else
    passed = passed + 1
  end
  if not equal63(15, _i1) then
    failed = failed + 1
    return "failed: expected " .. str(15) .. ", was " .. str(_i1)
  else
    passed = passed + 1
  end
  while _i1 < 20 do
    if _i1 == 19 then
      break
    else
      _i1 = _i1 + 1
    end
  end
  local _b6
  if not equal63(nil, _b6) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(_b6)
  else
    passed = passed + 1
  end
  if not equal63(19, _i1) then
    failed = failed + 1
    return "failed: expected " .. str(19) .. ", was " .. str(_i1)
  else
    passed = passed + 1
  end
  while true do
    _i1 = _i1 + 1
    local _j = _i1
    if not( _j < 21) then
      break
    end
  end
  if not equal63(21, _i1) then
    failed = failed + 1
    return "failed: expected " .. str(21) .. ", was " .. str(_i1)
  else
    passed = passed + 1
  end
  while true do
    local _e57
    if false then
      _i1 = _i1 + 1
      _e57 = _i1
    end
    if not _e57 then
      break
    end
  end
  if not equal63(21, _i1) then
    failed = failed + 1
    return "failed: expected " .. str(21) .. ", was " .. str(_i1)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"for", function ()
  local _l2 = {}
  local _i2 = 0
  while _i2 < 5 do
    add(_l2, _i2)
    _i2 = _i2 + 1
  end
  if not equal63({0, 1, 2, 3, 4}, _l2) then
    failed = failed + 1
    return "failed: expected " .. str({0, 1, 2, 3, 4}) .. ", was " .. str(_l2)
  else
    passed = passed + 1
  end
  local _l3 = {}
  local _i3 = 0
  while _i3 < 2 do
    add(_l3, _i3)
    _i3 = _i3 + 1
  end
  if not equal63({0, 1}, _l3) then
    failed = failed + 1
    local _l4 = {}
    local _i4 = 0
    while _i4 < 2 do
      add(_l4, _i4)
      _i4 = _i4 + 1
    end
    return "failed: expected " .. str({0, 1}) .. ", was " .. str(_l4)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"table", function ()
  if not equal63(10, ({["a"] = 10}).a) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(({["a"] = 10}).a)
  else
    passed = passed + 1
  end
  if not equal63(true, ({["a"] = true}).a) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(({["a"] = true}).a)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"empty", function ()
  if not equal63(true, empty63({})) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(empty63({}))
  else
    passed = passed + 1
  end
  if not equal63(true, empty63({})) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(empty63({}))
  else
    passed = passed + 1
  end
  if not equal63(false, empty63({1})) then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(empty63({1}))
  else
    passed = passed + 1
  end
  local __x564 = {}
  __x564.a = true
  if not equal63(false, empty63(__x564)) then
    failed = failed + 1
    local __x565 = {}
    __x565.a = true
    return "failed: expected " .. str(false) .. ", was " .. str(empty63(__x565))
  else
    passed = passed + 1
  end
  if not equal63(false, empty63({["a"] = true})) then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(empty63({["a"] = true}))
  else
    passed = passed + 1
  end
  local __x566 = {}
  __x566.b = false
  if not equal63(false, empty63(__x566)) then
    failed = failed + 1
    local __x567 = {}
    __x567.b = false
    return "failed: expected " .. str(false) .. ", was " .. str(empty63(__x567))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"at", function ()
  local _l5 = {"a", "b", "c", "d"}
  if not equal63("a", _l5[1]) then
    failed = failed + 1
    return "failed: expected " .. str("a") .. ", was " .. str(_l5[1])
  else
    passed = passed + 1
  end
  if not equal63("a", _l5[1]) then
    failed = failed + 1
    return "failed: expected " .. str("a") .. ", was " .. str(_l5[1])
  else
    passed = passed + 1
  end
  if not equal63("b", _l5[2]) then
    failed = failed + 1
    return "failed: expected " .. str("b") .. ", was " .. str(_l5[2])
  else
    passed = passed + 1
  end
  if not equal63("d", _l5[#(_l5) + -1 + 1]) then
    failed = failed + 1
    return "failed: expected " .. str("d") .. ", was " .. str(_l5[#(_l5) + -1 + 1])
  else
    passed = passed + 1
  end
  if not equal63("c", _l5[#(_l5) + -2 + 1]) then
    failed = failed + 1
    return "failed: expected " .. str("c") .. ", was " .. str(_l5[#(_l5) + -2 + 1])
  else
    passed = passed + 1
  end
  _l5[1] = 9
  if not equal63(9, _l5[1]) then
    failed = failed + 1
    return "failed: expected " .. str(9) .. ", was " .. str(_l5[1])
  else
    passed = passed + 1
  end
  _l5[4] = 10
  if not equal63(10, _l5[4]) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(_l5[4])
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"get-=", function ()
  local _l6 = {}
  _l6.foo = "bar"
  if not equal63("bar", _l6.foo) then
    failed = failed + 1
    return "failed: expected " .. str("bar") .. ", was " .. str(_l6.foo)
  else
    passed = passed + 1
  end
  if not equal63("bar", _l6.foo) then
    failed = failed + 1
    return "failed: expected " .. str("bar") .. ", was " .. str(_l6.foo)
  else
    passed = passed + 1
  end
  if not equal63("bar", _l6.foo) then
    failed = failed + 1
    return "failed: expected " .. str("bar") .. ", was " .. str(_l6.foo)
  else
    passed = passed + 1
  end
  local _k = "foo"
  if not equal63("bar", _l6[_k]) then
    failed = failed + 1
    return "failed: expected " .. str("bar") .. ", was " .. str(_l6[_k])
  else
    passed = passed + 1
  end
  if not equal63("bar", _l6["f" .. "oo"]) then
    failed = failed + 1
    return "failed: expected " .. str("bar") .. ", was " .. str(_l6["f" .. "oo"])
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"each", function ()
  local __x572 = {1, 2, 3}
  __x572.a = true
  __x572.b = false
  local _l7 = __x572
  local _a19 = 0
  local _b7 = 0
  local __l8 = _l7
  local _k1 = nil
  for _k1 in next, __l8 do
    local _v = __l8[_k1]
    if type(_k1) == "number" then
      _a19 = _a19 + 1
    else
      _b7 = _b7 + 1
    end
  end
  if not equal63(3, _a19) then
    failed = failed + 1
    return "failed: expected " .. str(3) .. ", was " .. str(_a19)
  else
    passed = passed + 1
  end
  if not equal63(2, _b7) then
    failed = failed + 1
    return "failed: expected " .. str(2) .. ", was " .. str(_b7)
  else
    passed = passed + 1
  end
  local _a20 = 0
  local __l9 = _l7
  local __i6 = nil
  for __i6 in next, __l9 do
    local _x573 = __l9[__i6]
    _a20 = _a20 + 1
  end
  if not equal63(5, _a20) then
    failed = failed + 1
    return "failed: expected " .. str(5) .. ", was " .. str(_a20)
  else
    passed = passed + 1
  end
  local __x574 = {{1}, {2}}
  __x574.b = {3}
  local _l10 = __x574
  local __l11 = _l10
  local __i7 = nil
  for __i7 in next, __l11 do
    local _x578 = __l11[__i7]
    if not equal63(false, not( type(_x578) == "table")) then
      failed = failed + 1
      return "failed: expected " .. str(false) .. ", was " .. str(not( type(_x578) == "table"))
    else
      passed = passed + 1
    end
  end
  local __l12 = _l10
  local __i8 = nil
  for __i8 in next, __l12 do
    local _x579 = __l12[__i8]
    if not equal63(false, not( type(_x579) == "table")) then
      failed = failed + 1
      return "failed: expected " .. str(false) .. ", was " .. str(not( type(_x579) == "table"))
    else
      passed = passed + 1
    end
  end
  local __l13 = _l10
  local __i9 = nil
  for __i9 in next, __l13 do
    local __id4 = __l13[__i9]
    local _x580 = __id4[1]
    if not equal63(true, type(_x580) == "number") then
      failed = failed + 1
      return "failed: expected " .. str(true) .. ", was " .. str(type(_x580) == "number")
    else
      passed = passed + 1
    end
  end
end})
add(tests, {"fn", function (_)
  local _f3 = function (_)
    return _ + 10
  end
  if not equal63(20, _f3(10)) then
    failed = failed + 1
    return "failed: expected " .. str(20) .. ", was " .. str(_f3(10))
  else
    passed = passed + 1
  end
  if not equal63(30, _f3(20)) then
    failed = failed + 1
    return "failed: expected " .. str(30) .. ", was " .. str(_f3(20))
  else
    passed = passed + 1
  end
  if not equal63(40, (function (_)
    return _ + 10
  end)(30)) then
    failed = failed + 1
    return "failed: expected " .. str(40) .. ", was " .. str((function (_)
      return _ + 10
    end)(30))
  else
    passed = passed + 1
  end
  if not equal63({2, 3, 4}, map(function (_)
    return _ + 1
  end, {1, 2, 3})) then
    failed = failed + 1
    return "failed: expected " .. str({2, 3, 4}) .. ", was " .. str(map(function (_)
      return _ + 1
    end, {1, 2, 3}))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"define", function ()
  local x = 20
  local function f()
    return 42
  end
  if not equal63(20, x) then
    failed = failed + 1
    return "failed: expected " .. str(20) .. ", was " .. str(x)
  else
    passed = passed + 1
  end
  if not equal63(42, f()) then
    failed = failed + 1
    return "failed: expected " .. str(42) .. ", was " .. str(f())
  else
    passed = passed + 1
  end
  (function ()
    local function f()
      return 38
    end
    if not equal63(38, f()) then
      failed = failed + 1
      return "failed: expected " .. str(38) .. ", was " .. str(f())
    else
      passed = passed + 1
      return passed
    end
  end)()
  if not equal63(42, f()) then
    failed = failed + 1
    return "failed: expected " .. str(42) .. ", was " .. str(f())
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"return", function ()
  local _a21 = (function ()
    return 17
  end)()
  if not equal63(17, _a21) then
    failed = failed + 1
    return "failed: expected " .. str(17) .. ", was " .. str(_a21)
  else
    passed = passed + 1
  end
  local _a22 = (function ()
    if true then
      return 10
    else
      return 20
    end
  end)()
  if not equal63(10, _a22) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(_a22)
  else
    passed = passed + 1
  end
  local _a23 = (function ()
    while false do
      blah()
    end
  end)()
  if not equal63(nil, _a23) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(_a23)
  else
    passed = passed + 1
  end
  local _a24 = 11
  local _b8 = (function ()
    _a24 = _a24 + 1
    return _a24
  end)()
  if not equal63(12, _b8) then
    failed = failed + 1
    return "failed: expected " .. str(12) .. ", was " .. str(_b8)
  else
    passed = passed + 1
  end
  if not equal63(12, _a24) then
    failed = failed + 1
    return "failed: expected " .. str(12) .. ", was " .. str(_a24)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"guard", function ()
  local __x592 = nil
  local __msg3 = nil
  local __trace2 = nil
  local _e58
  if xpcall(function ()
    __x592 = 42
    return __x592
  end, function (_)
    __msg3 = clip(_, search(_, ": ") + 2)
    __trace2 = debug.traceback()
    return __trace2
  end) then
    _e58 = {true, __x592}
  else
    _e58 = {false, __msg3, __trace2}
  end
  if not equal63({true, 42}, cut(_e58, 0, 2)) then
    failed = failed + 1
    local __x596 = nil
    local __msg4 = nil
    local __trace3 = nil
    local _e59
    if xpcall(function ()
      __x596 = 42
      return __x596
    end, function (_)
      __msg4 = clip(_, search(_, ": ") + 2)
      __trace3 = debug.traceback()
      return __trace3
    end) then
      _e59 = {true, __x596}
    else
      _e59 = {false, __msg4, __trace3}
    end
    return "failed: expected " .. str({true, 42}) .. ", was " .. str(cut(_e59, 0, 2))
  else
    passed = passed + 1
  end
  local __x600 = nil
  local __msg5 = nil
  local __trace4 = nil
  local _e60
  if xpcall(function ()
    error("foo")
    __x600 = nil
    return __x600
  end, function (_)
    __msg5 = clip(_, search(_, ": ") + 2)
    __trace4 = debug.traceback()
    return __trace4
  end) then
    _e60 = {true, __x600}
  else
    _e60 = {false, __msg5, __trace4}
  end
  if not equal63({false, "foo"}, cut(_e60, 0, 2)) then
    failed = failed + 1
    local __x604 = nil
    local __msg6 = nil
    local __trace5 = nil
    local _e61
    if xpcall(function ()
      error("foo")
      __x604 = nil
      return __x604
    end, function (_)
      __msg6 = clip(_, search(_, ": ") + 2)
      __trace5 = debug.traceback()
      return __trace5
    end) then
      _e61 = {true, __x604}
    else
      _e61 = {false, __msg6, __trace5}
    end
    return "failed: expected " .. str({false, "foo"}) .. ", was " .. str(cut(_e61, 0, 2))
  else
    passed = passed + 1
  end
  local __x608 = nil
  local __msg7 = nil
  local __trace6 = nil
  local _e62
  if xpcall(function ()
    error("foo")
    error("baz")
    __x608 = nil
    return __x608
  end, function (_)
    __msg7 = clip(_, search(_, ": ") + 2)
    __trace6 = debug.traceback()
    return __trace6
  end) then
    _e62 = {true, __x608}
  else
    _e62 = {false, __msg7, __trace6}
  end
  if not equal63({false, "foo"}, cut(_e62, 0, 2)) then
    failed = failed + 1
    local __x612 = nil
    local __msg8 = nil
    local __trace7 = nil
    local _e63
    if xpcall(function ()
      error("foo")
      error("baz")
      __x612 = nil
      return __x612
    end, function (_)
      __msg8 = clip(_, search(_, ": ") + 2)
      __trace7 = debug.traceback()
      return __trace7
    end) then
      _e63 = {true, __x612}
    else
      _e63 = {false, __msg8, __trace7}
    end
    return "failed: expected " .. str({false, "foo"}) .. ", was " .. str(cut(_e63, 0, 2))
  else
    passed = passed + 1
  end
  local __x616 = nil
  local __msg9 = nil
  local __trace8 = nil
  local _e64
  if xpcall(function ()
    local __x617 = nil
    local __msg10 = nil
    local __trace9 = nil
    local _e65
    if xpcall(function ()
      error("foo")
      __x617 = nil
      return __x617
    end, function (_)
      __msg10 = clip(_, search(_, ": ") + 2)
      __trace9 = debug.traceback()
      return __trace9
    end) then
      _e65 = {true, __x617}
    else
      _e65 = {false, __msg10, __trace9}
    end
    cut(_e65, 0, 2)
    error("baz")
    __x616 = nil
    return __x616
  end, function (_)
    __msg9 = clip(_, search(_, ": ") + 2)
    __trace8 = debug.traceback()
    return __trace8
  end) then
    _e64 = {true, __x616}
  else
    _e64 = {false, __msg9, __trace8}
  end
  if not equal63({false, "baz"}, cut(_e64, 0, 2)) then
    failed = failed + 1
    local __x623 = nil
    local __msg11 = nil
    local __trace10 = nil
    local _e66
    if xpcall(function ()
      local __x624 = nil
      local __msg12 = nil
      local __trace11 = nil
      local _e67
      if xpcall(function ()
        error("foo")
        __x624 = nil
        return __x624
      end, function (_)
        __msg12 = clip(_, search(_, ": ") + 2)
        __trace11 = debug.traceback()
        return __trace11
      end) then
        _e67 = {true, __x624}
      else
        _e67 = {false, __msg12, __trace11}
      end
      cut(_e67, 0, 2)
      error("baz")
      __x623 = nil
      return __x623
    end, function (_)
      __msg11 = clip(_, search(_, ": ") + 2)
      __trace10 = debug.traceback()
      return __trace10
    end) then
      _e66 = {true, __x623}
    else
      _e66 = {false, __msg11, __trace10}
    end
    return "failed: expected " .. str({false, "baz"}) .. ", was " .. str(cut(_e66, 0, 2))
  else
    passed = passed + 1
  end
  local __x630 = nil
  local __msg13 = nil
  local __trace12 = nil
  local _e68
  if xpcall(function ()
    local _e69
    if true then
      _e69 = 42
    else
      error("baz")
      _e69 = nil
    end
    __x630 = _e69
    return __x630
  end, function (_)
    __msg13 = clip(_, search(_, ": ") + 2)
    __trace12 = debug.traceback()
    return __trace12
  end) then
    _e68 = {true, __x630}
  else
    _e68 = {false, __msg13, __trace12}
  end
  if not equal63({true, 42}, cut(_e68, 0, 2)) then
    failed = failed + 1
    local __x634 = nil
    local __msg14 = nil
    local __trace13 = nil
    local _e70
    if xpcall(function ()
      local _e71
      if true then
        _e71 = 42
      else
        error("baz")
        _e71 = nil
      end
      __x634 = _e71
      return __x634
    end, function (_)
      __msg14 = clip(_, search(_, ": ") + 2)
      __trace13 = debug.traceback()
      return __trace13
    end) then
      _e70 = {true, __x634}
    else
      _e70 = {false, __msg14, __trace13}
    end
    return "failed: expected " .. str({true, 42}) .. ", was " .. str(cut(_e70, 0, 2))
  else
    passed = passed + 1
  end
  local __x638 = nil
  local __msg15 = nil
  local __trace14 = nil
  local _e72
  if xpcall(function ()
    local _e73
    if false then
      _e73 = 42
    else
      error("baz")
      _e73 = nil
    end
    __x638 = _e73
    return __x638
  end, function (_)
    __msg15 = clip(_, search(_, ": ") + 2)
    __trace14 = debug.traceback()
    return __trace14
  end) then
    _e72 = {true, __x638}
  else
    _e72 = {false, __msg15, __trace14}
  end
  if not equal63({false, "baz"}, cut(_e72, 0, 2)) then
    failed = failed + 1
    local __x642 = nil
    local __msg16 = nil
    local __trace15 = nil
    local _e74
    if xpcall(function ()
      local _e75
      if false then
        _e75 = 42
      else
        error("baz")
        _e75 = nil
      end
      __x642 = _e75
      return __x642
    end, function (_)
      __msg16 = clip(_, search(_, ": ") + 2)
      __trace15 = debug.traceback()
      return __trace15
    end) then
      _e74 = {true, __x642}
    else
      _e74 = {false, __msg16, __trace15}
    end
    return "failed: expected " .. str({false, "baz"}) .. ", was " .. str(cut(_e74, 0, 2))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"let", function ()
  local _a25 = 10
  if not equal63(10, _a25) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(_a25)
  else
    passed = passed + 1
  end
  local _a26 = 10
  if not equal63(10, _a26) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(_a26)
  else
    passed = passed + 1
  end
  local _a27 = 11
  local _b9 = 12
  if not equal63(11, _a27) then
    failed = failed + 1
    return "failed: expected " .. str(11) .. ", was " .. str(_a27)
  else
    passed = passed + 1
  end
  if not equal63(12, _b9) then
    failed = failed + 1
    return "failed: expected " .. str(12) .. ", was " .. str(_b9)
  else
    passed = passed + 1
  end
  local _a28 = 1
  if not equal63(1, _a28) then
    failed = failed + 1
    return "failed: expected " .. str(1) .. ", was " .. str(_a28)
  else
    passed = passed + 1
  end
  local _a29 = 2
  if not equal63(2, _a29) then
    failed = failed + 1
    return "failed: expected " .. str(2) .. ", was " .. str(_a29)
  else
    passed = passed + 1
  end
  if not equal63(1, _a28) then
    failed = failed + 1
    return "failed: expected " .. str(1) .. ", was " .. str(_a28)
  else
    passed = passed + 1
  end
  local _a30 = 1
  local _a31 = 2
  local _a32 = 3
  if not equal63(_a32, 3) then
    failed = failed + 1
    return "failed: expected " .. str(_a32) .. ", was " .. str(3)
  else
    passed = passed + 1
  end
  if not equal63(_a31, 2) then
    failed = failed + 1
    return "failed: expected " .. str(_a31) .. ", was " .. str(2)
  else
    passed = passed + 1
  end
  if not equal63(_a30, 1) then
    failed = failed + 1
    return "failed: expected " .. str(_a30) .. ", was " .. str(1)
  else
    passed = passed + 1
  end
  local _a33 = 20
  if not equal63(20, _a33) then
    failed = failed + 1
    return "failed: expected " .. str(20) .. ", was " .. str(_a33)
  else
    passed = passed + 1
  end
  local _a34 = _a33 + 7
  if not equal63(27, _a34) then
    failed = failed + 1
    return "failed: expected " .. str(27) .. ", was " .. str(_a34)
  else
    passed = passed + 1
  end
  local _a35 = _a33 + 10
  if not equal63(30, _a35) then
    failed = failed + 1
    return "failed: expected " .. str(30) .. ", was " .. str(_a35)
  else
    passed = passed + 1
  end
  if not equal63(20, _a33) then
    failed = failed + 1
    return "failed: expected " .. str(20) .. ", was " .. str(_a33)
  else
    passed = passed + 1
  end
  local _a36 = 10
  if not equal63(10, _a36) then
    failed = failed + 1
    local _a37 = 10
    return "failed: expected " .. str(10) .. ", was " .. str(_a37)
  else
    passed = passed + 1
  end
  local _b10 = 12
  local _a38 = _b10
  if not equal63(12, _a38) then
    failed = failed + 1
    return "failed: expected " .. str(12) .. ", was " .. str(_a38)
  else
    passed = passed + 1
  end
  local _a40 = 10
  local _a39 = _a40
  if not equal63(10, _a39) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(_a39)
  else
    passed = passed + 1
  end
  local _a42 = 0
  _a42 = 10
  local _a41 = _a42 + 2 + 3
  if not equal63(_a41, 15) then
    failed = failed + 1
    return "failed: expected " .. str(_a41) .. ", was " .. str(15)
  else
    passed = passed + 1
  end
  (function (_)
    if not equal63(20, _) then
      failed = failed + 1
      return "failed: expected " .. str(20) .. ", was " .. str(_)
    else
      passed = passed + 1
    end
    local __ = 21
    if not equal63(21, __) then
      failed = failed + 1
      return "failed: expected " .. str(21) .. ", was " .. str(__)
    else
      passed = passed + 1
    end
    if not equal63(20, _) then
      failed = failed + 1
      return "failed: expected " .. str(20) .. ", was " .. str(_)
    else
      passed = passed + 1
      return passed
    end
  end)(20)
  local _q = 9
  return (function ()
    local _q1 = 10
    if not equal63(10, _q1) then
      failed = failed + 1
      return "failed: expected " .. str(10) .. ", was " .. str(_q1)
    else
      passed = passed + 1
    end
    if not equal63(9, _q) then
      failed = failed + 1
      return "failed: expected " .. str(9) .. ", was " .. str(_q)
    else
      passed = passed + 1
      return passed
    end
  end)()
end})
add(tests, {"with", function ()
  local _x647 = 9
  _x647 = _x647 + 1
  if not equal63(10, _x647) then
    failed = failed + 1
    local _x648 = 9
    _x648 = _x648 + 1
    return "failed: expected " .. str(10) .. ", was " .. str(_x648)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"whenlet", function ()
  local _frips = "a" == "b"
  local _e76
  if _frips then
    _e76 = 19
  end
  if not equal63(nil, _e76) then
    failed = failed + 1
    local _frips1 = "a" == "b"
    local _e77
    if _frips1 then
      _e77 = 19
    end
    return "failed: expected " .. str(nil) .. ", was " .. str(_e77)
  else
    passed = passed + 1
  end
  local _frips2 = 20
  local _e78
  if _frips2 then
    _e78 = _frips2 - 1
  end
  if not equal63(19, _e78) then
    failed = failed + 1
    local _frips3 = 20
    local _e79
    if _frips3 then
      _e79 = _frips3 - 1
    end
    return "failed: expected " .. str(19) .. ", was " .. str(_e79)
  else
    passed = passed + 1
  end
  local __if = {19, 20}
  local _e80
  if __if then
    local _a43 = __if[1]
    local _b11 = __if[2]
    _e80 = _b11
  end
  if not equal63(20, _e80) then
    failed = failed + 1
    local __if1 = {19, 20}
    local _e81
    if __if1 then
      local _a44 = __if1[1]
      local _b12 = __if1[2]
      _e81 = _b12
    end
    return "failed: expected " .. str(20) .. ", was " .. str(_e81)
  else
    passed = passed + 1
  end
  local __if2 = nil
  local _e82
  if __if2 then
    local _a45 = __if2[1]
    local _b13 = __if2[2]
    _e82 = _b13
  end
  if not equal63(nil, _e82) then
    failed = failed + 1
    local __if3 = nil
    local _e83
    if __if3 then
      local _a46 = __if3[1]
      local _b14 = __if3[2]
      _e83 = _b14
    end
    return "failed: expected " .. str(nil) .. ", was " .. str(_e83)
  else
    passed = passed + 1
    return passed
  end
end})
local zzop = 99
local zzap = 100
local _zzop = 10
local _zzap = _zzop + 10
local __x653 = {1, 2, 3}
__x653.a = 10
__x653.b = 20
local __id9 = __x653
local _zza = __id9[1]
local _zzb = __id9[2]
add(tests, {"let-toplevel1", function ()
  if not equal63(10, _zzop) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(_zzop)
  else
    passed = passed + 1
  end
  if not equal63(20, _zzap) then
    failed = failed + 1
    return "failed: expected " .. str(20) .. ", was " .. str(_zzap)
  else
    passed = passed + 1
  end
  if not equal63(1, _zza) then
    failed = failed + 1
    return "failed: expected " .. str(1) .. ", was " .. str(_zza)
  else
    passed = passed + 1
  end
  if not equal63(2, _zzb) then
    failed = failed + 1
    return "failed: expected " .. str(2) .. ", was " .. str(_zzb)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"let-toplevel", function ()
  if not equal63(99, zzop) then
    failed = failed + 1
    return "failed: expected " .. str(99) .. ", was " .. str(zzop)
  else
    passed = passed + 1
  end
  if not equal63(100, zzap) then
    failed = failed + 1
    return "failed: expected " .. str(100) .. ", was " .. str(zzap)
  else
    passed = passed + 1
    return passed
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
    return _if + _end + _return
  end
  if not equal63(6, _var(1, 2, 3)) then
    failed = failed + 1
    return "failed: expected " .. str(6) .. ", was " .. str(_var(1, 2, 3))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"destructuring", function ()
  local __id10 = {1, 2, 3}
  local _a47 = __id10[1]
  local _b15 = __id10[2]
  local _c2 = __id10[3]
  if not equal63(1, _a47) then
    failed = failed + 1
    return "failed: expected " .. str(1) .. ", was " .. str(_a47)
  else
    passed = passed + 1
  end
  if not equal63(2, _b15) then
    failed = failed + 1
    return "failed: expected " .. str(2) .. ", was " .. str(_b15)
  else
    passed = passed + 1
  end
  if not equal63(3, _c2) then
    failed = failed + 1
    return "failed: expected " .. str(3) .. ", was " .. str(_c2)
  else
    passed = passed + 1
  end
  local __id11 = {1, {2, {3}, 4}}
  local _w = __id11[1]
  local __id12 = __id11[2]
  local _x666 = __id12[1]
  local __id13 = __id12[2]
  local _y = __id13[1]
  local _z = __id12[3]
  if not equal63(1, _w) then
    failed = failed + 1
    return "failed: expected " .. str(1) .. ", was " .. str(_w)
  else
    passed = passed + 1
  end
  if not equal63(2, _x666) then
    failed = failed + 1
    return "failed: expected " .. str(2) .. ", was " .. str(_x666)
  else
    passed = passed + 1
  end
  if not equal63(3, _y) then
    failed = failed + 1
    return "failed: expected " .. str(3) .. ", was " .. str(_y)
  else
    passed = passed + 1
  end
  if not equal63(4, _z) then
    failed = failed + 1
    return "failed: expected " .. str(4) .. ", was " .. str(_z)
  else
    passed = passed + 1
  end
  local __id14 = {1, 2, 3, 4}
  local _a48 = __id14[1]
  local _b16 = __id14[2]
  local _c3 = cut(__id14, 2)
  if not equal63({3, 4}, _c3) then
    failed = failed + 1
    return "failed: expected " .. str({3, 4}) .. ", was " .. str(_c3)
  else
    passed = passed + 1
  end
  local __id15 = {1, {2, 3, 4}, 5, 6, 7}
  local _w1 = __id15[1]
  local __id16 = __id15[2]
  local _x675 = __id16[1]
  local _y1 = cut(__id16, 1)
  local _z1 = cut(__id15, 2)
  if not equal63({3, 4}, _y1) then
    failed = failed + 1
    return "failed: expected " .. str({3, 4}) .. ", was " .. str(_y1)
  else
    passed = passed + 1
  end
  if not equal63({5, 6, 7}, _z1) then
    failed = failed + 1
    return "failed: expected " .. str({5, 6, 7}) .. ", was " .. str(_z1)
  else
    passed = passed + 1
  end
  local __id17 = {["foo"] = 99}
  local _foo = __id17.foo
  if not equal63(99, _foo) then
    failed = failed + 1
    return "failed: expected " .. str(99) .. ", was " .. str(_foo)
  else
    passed = passed + 1
  end
  local __x681 = {}
  __x681.foo = 99
  local __id18 = __x681
  local _foo1 = __id18.foo
  if not equal63(99, _foo1) then
    failed = failed + 1
    return "failed: expected " .. str(99) .. ", was " .. str(_foo1)
  else
    passed = passed + 1
  end
  local __id19 = {["foo"] = 99}
  local _a49 = __id19.foo
  if not equal63(99, _a49) then
    failed = failed + 1
    return "failed: expected " .. str(99) .. ", was " .. str(_a49)
  else
    passed = passed + 1
  end
  local __id20 = {["foo"] = {98, 99}}
  local __id21 = __id20.foo
  local _a50 = __id21[1]
  local _b17 = __id21[2]
  if not equal63(98, _a50) then
    failed = failed + 1
    return "failed: expected " .. str(98) .. ", was " .. str(_a50)
  else
    passed = passed + 1
  end
  if not equal63(99, _b17) then
    failed = failed + 1
    return "failed: expected " .. str(99) .. ", was " .. str(_b17)
  else
    passed = passed + 1
  end
  local __x685 = {99}
  __x685.baz = true
  local __id22 = {["foo"] = 42, ["bar"] = __x685}
  local _foo2 = __id22.foo
  local __id23 = __id22.bar
  local _baz = __id23.baz
  if not equal63(42, _foo2) then
    failed = failed + 1
    return "failed: expected " .. str(42) .. ", was " .. str(_foo2)
  else
    passed = passed + 1
  end
  if not equal63(true, _baz) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(_baz)
  else
    passed = passed + 1
  end
  local __x690 = {20}
  __x690.foo = 17
  local __x689 = {10, __x690}
  __x689.bar = {1, 2, 3}
  local __id24 = __x689
  local _a51 = __id24[1]
  local __id25 = __id24[2]
  local _b18 = __id25[1]
  local _foo3 = __id25.foo
  local _bar = __id24.bar
  if not equal63(10, _a51) then
    failed = failed + 1
    return "failed: expected " .. str(10) .. ", was " .. str(_a51)
  else
    passed = passed + 1
  end
  if not equal63(20, _b18) then
    failed = failed + 1
    return "failed: expected " .. str(20) .. ", was " .. str(_b18)
  else
    passed = passed + 1
  end
  if not equal63(17, _foo3) then
    failed = failed + 1
    return "failed: expected " .. str(17) .. ", was " .. str(_foo3)
  else
    passed = passed + 1
  end
  if not equal63({1, 2, 3}, _bar) then
    failed = failed + 1
    return "failed: expected " .. str({1, 2, 3}) .. ", was " .. str(_bar)
  else
    passed = passed + 1
  end
  local _yy = {1, 2, 3}
  local __id26 = _yy
  local _xx = __id26[1]
  local _yy1 = __id26[2]
  local _zz = cut(__id26, 2)
  if not equal63(1, _xx) then
    failed = failed + 1
    return "failed: expected " .. str(1) .. ", was " .. str(_xx)
  else
    passed = passed + 1
  end
  if not equal63(2, _yy1) then
    failed = failed + 1
    return "failed: expected " .. str(2) .. ", was " .. str(_yy1)
  else
    passed = passed + 1
  end
  if not equal63({3}, _zz) then
    failed = failed + 1
    return "failed: expected " .. str({3}) .. ", was " .. str(_zz)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"w/mac", function ()
  if not equal63(17, 17) then
    failed = failed + 1
    return "failed: expected " .. str(17) .. ", was " .. str(17)
  else
    passed = passed + 1
  end
  if not equal63(42, 32 + 10) then
    failed = failed + 1
    return "failed: expected " .. str(42) .. ", was " .. str(32 + 10)
  else
    passed = passed + 1
  end
  if not equal63(1, 1) then
    failed = failed + 1
    return "failed: expected " .. str(1) .. ", was " .. str(1)
  else
    passed = passed + 1
  end
  if not equal63(17, 17) then
    failed = failed + 1
    return "failed: expected " .. str(17) .. ", was " .. str(17)
  else
    passed = passed + 1
  end
  local _b19 = function ()
    return 20
  end
  if not equal63(18, 18) then
    failed = failed + 1
    return "failed: expected " .. str(18) .. ", was " .. str(18)
  else
    passed = passed + 1
  end
  if not equal63(20, _b19()) then
    failed = failed + 1
    return "failed: expected " .. str(20) .. ", was " .. str(_b19())
  else
    passed = passed + 1
  end
  if not equal63(2, 1 + 1) then
    failed = failed + 1
    return "failed: expected " .. str(2) .. ", was " .. str(1 + 1)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"w/sym", function ()
  if not equal63(17, 17) then
    failed = failed + 1
    return "failed: expected " .. str(17) .. ", was " .. str(17)
  else
    passed = passed + 1
  end
  if not equal63(17, 10 + 7) then
    failed = failed + 1
    return "failed: expected " .. str(17) .. ", was " .. str(10 + 7)
  else
    passed = passed + 1
  end
  if not equal63(1, 1) then
    failed = failed + 1
    return "failed: expected " .. str(1) .. ", was " .. str(1)
  else
    passed = passed + 1
  end
  if not equal63(17, 17) then
    failed = failed + 1
    return "failed: expected " .. str(17) .. ", was " .. str(17)
  else
    passed = passed + 1
  end
  local _b20 = 20
  if not equal63(18, 18) then
    failed = failed + 1
    return "failed: expected " .. str(18) .. ", was " .. str(18)
  else
    passed = passed + 1
  end
  if not equal63(20, _b20) then
    failed = failed + 1
    return "failed: expected " .. str(20) .. ", was " .. str(_b20)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"defsym", function ()
  setenv("zzz", stash33({["symbol"] = 42, ["eval"] = true}))
  if not equal63(42, 42) then
    failed = failed + 1
    return "failed: expected " .. str(42) .. ", was " .. str(42)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"macros-and-symbols", function ()
  if not equal63(2, 2) then
    failed = failed + 1
    return "failed: expected " .. str(2) .. ", was " .. str(2)
  else
    passed = passed + 1
  end
  if not equal63(1, 1) then
    failed = failed + 1
    return "failed: expected " .. str(1) .. ", was " .. str(1)
  else
    passed = passed + 1
  end
  if not equal63(1, 1) then
    failed = failed + 1
    return "failed: expected " .. str(1) .. ", was " .. str(1)
  else
    passed = passed + 1
  end
  if not equal63(2, 2) then
    failed = failed + 1
    return "failed: expected " .. str(2) .. ", was " .. str(2)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"macros-and-let", function ()
  local _a52 = 10
  if not equal63(_a52, 10) then
    failed = failed + 1
    return "failed: expected " .. str(_a52) .. ", was " .. str(10)
  else
    passed = passed + 1
  end
  if not equal63(12, 12) then
    failed = failed + 1
    return "failed: expected " .. str(12) .. ", was " .. str(12)
  else
    passed = passed + 1
  end
  if not equal63(_a52, 10) then
    failed = failed + 1
    return "failed: expected " .. str(_a52) .. ", was " .. str(10)
  else
    passed = passed + 1
  end
  local _b21 = 20
  if not equal63(_b21, 20) then
    failed = failed + 1
    return "failed: expected " .. str(_b21) .. ", was " .. str(20)
  else
    passed = passed + 1
  end
  if not equal63(22, 22) then
    failed = failed + 1
    return "failed: expected " .. str(22) .. ", was " .. str(22)
  else
    passed = passed + 1
  end
  if not equal63(_b21, 20) then
    failed = failed + 1
    return "failed: expected " .. str(_b21) .. ", was " .. str(20)
  else
    passed = passed + 1
  end
  if not equal63(30, 30) then
    failed = failed + 1
    return "failed: expected " .. str(30) .. ", was " .. str(30)
  else
    passed = passed + 1
  end
  local _c4 = 32
  if not equal63(32, _c4) then
    failed = failed + 1
    return "failed: expected " .. str(32) .. ", was " .. str(_c4)
  else
    passed = passed + 1
  end
  if not equal63(30, 30) then
    failed = failed + 1
    return "failed: expected " .. str(30) .. ", was " .. str(30)
  else
    passed = passed + 1
  end
  if not equal63(40, 40) then
    failed = failed + 1
    return "failed: expected " .. str(40) .. ", was " .. str(40)
  else
    passed = passed + 1
  end
  local _d1 = 42
  if not equal63(42, _d1) then
    failed = failed + 1
    return "failed: expected " .. str(42) .. ", was " .. str(_d1)
  else
    passed = passed + 1
  end
  if not equal63(40, 40) then
    failed = failed + 1
    return "failed: expected " .. str(40) .. ", was " .. str(40)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"w/uniq", function ()
  local _ham = uniq("ham")
  local _chap = uniq("chap")
  if not equal63("_ham", _ham) then
    failed = failed + 1
    return "failed: expected " .. str("_ham") .. ", was " .. str(_ham)
  else
    passed = passed + 1
  end
  if not equal63("_chap", _chap) then
    failed = failed + 1
    return "failed: expected " .. str("_chap") .. ", was " .. str(_chap)
  else
    passed = passed + 1
  end
  local _ham1 = uniq("ham")
  if not equal63("_ham1", _ham1) then
    failed = failed + 1
    return "failed: expected " .. str("_ham1") .. ", was " .. str(_ham1)
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"literals", function ()
  if not equal63(true, true) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(true)
  else
    passed = passed + 1
  end
  if not equal63(false, false) then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(false)
  else
    passed = passed + 1
  end
  if not equal63(true, -inf < -10000000000) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(-inf < -10000000000)
  else
    passed = passed + 1
  end
  if not equal63(false, inf < -10000000000) then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(inf < -10000000000)
  else
    passed = passed + 1
  end
  if not equal63(false, nan == nan) then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(nan == nan)
  else
    passed = passed + 1
  end
  if not equal63(true, nan63(nan)) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(nan63(nan))
  else
    passed = passed + 1
  end
  if not equal63(true, nan63(nan * 20)) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(nan63(nan * 20))
  else
    passed = passed + 1
  end
  if not equal63(-inf, - inf) then
    failed = failed + 1
    return "failed: expected " .. str(-inf) .. ", was " .. str(- inf)
  else
    passed = passed + 1
  end
  if not equal63(inf, - -inf) then
    failed = failed + 1
    return "failed: expected " .. str(inf) .. ", was " .. str(- -inf)
  else
    passed = passed + 1
  end
  local _Inf = 1
  local _NaN = 2
  local __Inf = "a"
  local __NaN = "b"
  if not equal63(_Inf, 1) then
    failed = failed + 1
    return "failed: expected " .. str(_Inf) .. ", was " .. str(1)
  else
    passed = passed + 1
  end
  if not equal63(_NaN, 2) then
    failed = failed + 1
    return "failed: expected " .. str(_NaN) .. ", was " .. str(2)
  else
    passed = passed + 1
  end
  if not equal63(__Inf, "a") then
    failed = failed + 1
    return "failed: expected " .. str(__Inf) .. ", was " .. str("a")
  else
    passed = passed + 1
  end
  if not equal63(__NaN, "b") then
    failed = failed + 1
    return "failed: expected " .. str(__NaN) .. ", was " .. str("b")
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"add", function ()
  local _l14 = {}
  add(_l14, "a")
  add(_l14, "b")
  add(_l14, "c")
  if not equal63({"a", "b", "c"}, _l14) then
    failed = failed + 1
    return "failed: expected " .. str({"a", "b", "c"}) .. ", was " .. str(_l14)
  else
    passed = passed + 1
  end
  if not equal63(nil, add({}, "a")) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(add({}, "a"))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"drop", function ()
  local _l15 = {"a", "b", "c"}
  if not equal63("c", drop(_l15)) then
    failed = failed + 1
    return "failed: expected " .. str("c") .. ", was " .. str(drop(_l15))
  else
    passed = passed + 1
  end
  if not equal63("b", drop(_l15)) then
    failed = failed + 1
    return "failed: expected " .. str("b") .. ", was " .. str(drop(_l15))
  else
    passed = passed + 1
  end
  if not equal63("a", drop(_l15)) then
    failed = failed + 1
    return "failed: expected " .. str("a") .. ", was " .. str(drop(_l15))
  else
    passed = passed + 1
  end
  if not equal63(nil, drop(_l15)) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(drop(_l15))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"last", function ()
  if not equal63(3, last({1, 2, 3})) then
    failed = failed + 1
    return "failed: expected " .. str(3) .. ", was " .. str(last({1, 2, 3}))
  else
    passed = passed + 1
  end
  if not equal63(nil, last({})) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(last({}))
  else
    passed = passed + 1
  end
  if not equal63("c", last({"a", "b", "c"})) then
    failed = failed + 1
    return "failed: expected " .. str("c") .. ", was " .. str(last({"a", "b", "c"}))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"join", function ()
  if not equal63({1, 2, 3}, join({1, 2}, {3})) then
    failed = failed + 1
    return "failed: expected " .. str({1, 2, 3}) .. ", was " .. str(join({1, 2}, {3}))
  else
    passed = passed + 1
  end
  if not equal63({1, 2}, join({}, {1, 2})) then
    failed = failed + 1
    return "failed: expected " .. str({1, 2}) .. ", was " .. str(join({}, {1, 2}))
  else
    passed = passed + 1
  end
  if not equal63({}, join({}, {})) then
    failed = failed + 1
    return "failed: expected " .. str({}) .. ", was " .. str(join({}, {}))
  else
    passed = passed + 1
  end
  if not equal63({}, join(nil, nil)) then
    failed = failed + 1
    return "failed: expected " .. str({}) .. ", was " .. str(join(nil, nil))
  else
    passed = passed + 1
  end
  if not equal63({}, join(nil, {})) then
    failed = failed + 1
    return "failed: expected " .. str({}) .. ", was " .. str(join(nil, {}))
  else
    passed = passed + 1
  end
  if not equal63({}, join()) then
    failed = failed + 1
    return "failed: expected " .. str({}) .. ", was " .. str(join())
  else
    passed = passed + 1
  end
  if not equal63({}, join({})) then
    failed = failed + 1
    return "failed: expected " .. str({}) .. ", was " .. str(join({}))
  else
    passed = passed + 1
  end
  if not equal63({1}, join({1}, nil)) then
    failed = failed + 1
    return "failed: expected " .. str({1}) .. ", was " .. str(join({1}, nil))
  else
    passed = passed + 1
  end
  if not equal63({"a"}, join({"a"}, {})) then
    failed = failed + 1
    return "failed: expected " .. str({"a"}) .. ", was " .. str(join({"a"}, {}))
  else
    passed = passed + 1
  end
  if not equal63({"a"}, join(nil, {"a"})) then
    failed = failed + 1
    return "failed: expected " .. str({"a"}) .. ", was " .. str(join(nil, {"a"}))
  else
    passed = passed + 1
  end
  if not equal63({"a"}, join({"a"})) then
    failed = failed + 1
    return "failed: expected " .. str({"a"}) .. ", was " .. str(join({"a"}))
  else
    passed = passed + 1
  end
  local __x745 = {"a"}
  __x745.b = true
  if not equal63(__x745, join({"a"}, {["b"] = true})) then
    failed = failed + 1
    local __x747 = {"a"}
    __x747.b = true
    return "failed: expected " .. str(__x747) .. ", was " .. str(join({"a"}, {["b"] = true}))
  else
    passed = passed + 1
  end
  local __x749 = {"a", "b"}
  __x749.b = true
  local __x751 = {"b"}
  __x751.b = true
  if not equal63(__x749, join({"a"}, __x751)) then
    failed = failed + 1
    local __x752 = {"a", "b"}
    __x752.b = true
    local __x754 = {"b"}
    __x754.b = true
    return "failed: expected " .. str(__x752) .. ", was " .. str(join({"a"}, __x754))
  else
    passed = passed + 1
  end
  local __x755 = {"a"}
  __x755.b = 10
  local __x756 = {"a"}
  __x756.b = true
  if not equal63(__x755, join(__x756, {["b"] = 10})) then
    failed = failed + 1
    local __x757 = {"a"}
    __x757.b = 10
    local __x758 = {"a"}
    __x758.b = true
    return "failed: expected " .. str(__x757) .. ", was " .. str(join(__x758, {["b"] = 10}))
  else
    passed = passed + 1
  end
  local __x759 = {}
  __x759.b = 10
  local __x760 = {}
  __x760.b = 10
  if not equal63(__x759, join({["b"] = true}, __x760)) then
    failed = failed + 1
    local __x761 = {}
    __x761.b = 10
    local __x762 = {}
    __x762.b = 10
    return "failed: expected " .. str(__x761) .. ", was " .. str(join({["b"] = true}, __x762))
  else
    passed = passed + 1
  end
  local __x763 = {"a"}
  __x763.b = 1
  local __x764 = {"b"}
  __x764.c = 2
  local _l16 = join(__x763, __x764)
  if not equal63(1, _l16.b) then
    failed = failed + 1
    return "failed: expected " .. str(1) .. ", was " .. str(_l16.b)
  else
    passed = passed + 1
  end
  if not equal63(2, _l16.c) then
    failed = failed + 1
    return "failed: expected " .. str(2) .. ", was " .. str(_l16.c)
  else
    passed = passed + 1
  end
  if not equal63("b", _l16[2]) then
    failed = failed + 1
    return "failed: expected " .. str("b") .. ", was " .. str(_l16[2])
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"rev", function ()
  if not equal63({}, rev({})) then
    failed = failed + 1
    return "failed: expected " .. str({}) .. ", was " .. str(rev({}))
  else
    passed = passed + 1
  end
  if not equal63({3, 2, 1}, rev({1, 2, 3})) then
    failed = failed + 1
    return "failed: expected " .. str({3, 2, 1}) .. ", was " .. str(rev({1, 2, 3}))
  else
    passed = passed + 1
  end
  local __x770 = {3, 2, 1}
  __x770.a = true
  local __x771 = {1, 2, 3}
  __x771.a = true
  if not equal63(__x770, rev(__x771)) then
    failed = failed + 1
    local __x772 = {3, 2, 1}
    __x772.a = true
    local __x773 = {1, 2, 3}
    __x773.a = true
    return "failed: expected " .. str(__x772) .. ", was " .. str(rev(__x773))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"map", function (_)
  if not equal63({}, map(function (_)
    return _
  end, {})) then
    failed = failed + 1
    return "failed: expected " .. str({}) .. ", was " .. str(map(function (_)
      return _
    end, {}))
  else
    passed = passed + 1
  end
  if not equal63({1}, map(function (_)
    return _
  end, {1})) then
    failed = failed + 1
    return "failed: expected " .. str({1}) .. ", was " .. str(map(function (_)
      return _
    end, {1}))
  else
    passed = passed + 1
  end
  if not equal63({2, 3, 4}, map(function (_)
    return _ + 1
  end, {1, 2, 3})) then
    failed = failed + 1
    return "failed: expected " .. str({2, 3, 4}) .. ", was " .. str(map(function (_)
      return _ + 1
    end, {1, 2, 3}))
  else
    passed = passed + 1
  end
  local __x783 = {2, 3, 4}
  __x783.a = 5
  local __x784 = {1, 2, 3}
  __x784.a = 4
  if not equal63(__x783, map(function (_)
    return _ + 1
  end, __x784)) then
    failed = failed + 1
    local __x785 = {2, 3, 4}
    __x785.a = 5
    local __x786 = {1, 2, 3}
    __x786.a = 4
    return "failed: expected " .. str(__x785) .. ", was " .. str(map(function (_)
      return _ + 1
    end, __x786))
  else
    passed = passed + 1
  end
  local __x787 = {}
  __x787.a = true
  local __x788 = {}
  __x788.a = true
  if not equal63(__x787, map(function (_)
    return _
  end, __x788)) then
    failed = failed + 1
    local __x789 = {}
    __x789.a = true
    local __x790 = {}
    __x790.a = true
    return "failed: expected " .. str(__x789) .. ", was " .. str(map(function (_)
      return _
    end, __x790))
  else
    passed = passed + 1
  end
  local __x791 = {}
  __x791.b = false
  local __x792 = {}
  __x792.b = false
  if not equal63(__x791, map(function (_)
    return _
  end, __x792)) then
    failed = failed + 1
    local __x793 = {}
    __x793.b = false
    local __x794 = {}
    __x794.b = false
    return "failed: expected " .. str(__x793) .. ", was " .. str(map(function (_)
      return _
    end, __x794))
  else
    passed = passed + 1
  end
  local __x795 = {}
  __x795.a = true
  __x795.b = false
  local __x796 = {}
  __x796.a = true
  __x796.b = false
  if not equal63(__x795, map(function (_)
    return _
  end, __x796)) then
    failed = failed + 1
    local __x797 = {}
    __x797.a = true
    __x797.b = false
    local __x798 = {}
    __x798.a = true
    __x798.b = false
    return "failed: expected " .. str(__x797) .. ", was " .. str(map(function (_)
      return _
    end, __x798))
  else
    passed = passed + 1
  end
  local _evens = function (_)
    if _ % 2 == 0 then
      return _
    end
  end
  if not equal63({2, 4, 6}, map(_evens, {1, 2, 3, 4, 5, 6})) then
    failed = failed + 1
    return "failed: expected " .. str({2, 4, 6}) .. ", was " .. str(map(_evens, {1, 2, 3, 4, 5, 6}))
  else
    passed = passed + 1
  end
  local __x803 = {2, 4, 6}
  __x803.b = 8
  local __x804 = {1, 2, 3, 4, 5, 6}
  __x804.a = 7
  __x804.b = 8
  if not equal63(__x803, map(_evens, __x804)) then
    failed = failed + 1
    local __x805 = {2, 4, 6}
    __x805.b = 8
    local __x806 = {1, 2, 3, 4, 5, 6}
    __x806.a = 7
    __x806.b = 8
    return "failed: expected " .. str(__x805) .. ", was " .. str(map(_evens, __x806))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"cut", function ()
  if not equal63({}, cut({})) then
    failed = failed + 1
    return "failed: expected " .. str({}) .. ", was " .. str(cut({}))
  else
    passed = passed + 1
  end
  if not equal63({"a"}, cut({"a"})) then
    failed = failed + 1
    return "failed: expected " .. str({"a"}) .. ", was " .. str(cut({"a"}))
  else
    passed = passed + 1
  end
  if not equal63({"b", "c"}, cut({"a", "b", "c"}, 1)) then
    failed = failed + 1
    return "failed: expected " .. str({"b", "c"}) .. ", was " .. str(cut({"a", "b", "c"}, 1))
  else
    passed = passed + 1
  end
  if not equal63({"b", "c"}, cut({"a", "b", "c", "d"}, 1, 3)) then
    failed = failed + 1
    return "failed: expected " .. str({"b", "c"}) .. ", was " .. str(cut({"a", "b", "c", "d"}, 1, 3))
  else
    passed = passed + 1
  end
  if not equal63({1, 2, 3}, cut({1, 2, 3}, 0, 10)) then
    failed = failed + 1
    return "failed: expected " .. str({1, 2, 3}) .. ", was " .. str(cut({1, 2, 3}, 0, 10))
  else
    passed = passed + 1
  end
  if not equal63({1}, cut({1, 2, 3}, -4, 1)) then
    failed = failed + 1
    return "failed: expected " .. str({1}) .. ", was " .. str(cut({1, 2, 3}, -4, 1))
  else
    passed = passed + 1
  end
  if not equal63({1, 2, 3}, cut({1, 2, 3}, -4)) then
    failed = failed + 1
    return "failed: expected " .. str({1, 2, 3}) .. ", was " .. str(cut({1, 2, 3}, -4))
  else
    passed = passed + 1
  end
  local __x832 = {2}
  __x832.a = true
  local __x833 = {1, 2}
  __x833.a = true
  if not equal63(__x832, cut(__x833, 1)) then
    failed = failed + 1
    local __x834 = {2}
    __x834.a = true
    local __x835 = {1, 2}
    __x835.a = true
    return "failed: expected " .. str(__x834) .. ", was " .. str(cut(__x835, 1))
  else
    passed = passed + 1
  end
  local __x836 = {}
  __x836.a = true
  __x836.b = 2
  local __x837 = {}
  __x837.a = true
  __x837.b = 2
  if not equal63(__x836, cut(__x837)) then
    failed = failed + 1
    local __x838 = {}
    __x838.a = true
    __x838.b = 2
    local __x839 = {}
    __x839.a = true
    __x839.b = 2
    return "failed: expected " .. str(__x838) .. ", was " .. str(cut(__x839))
  else
    passed = passed + 1
  end
  local _l17 = {1, 2, 3}
  if not equal63({}, cut(_l17, #(_l17))) then
    failed = failed + 1
    return "failed: expected " .. str({}) .. ", was " .. str(cut(_l17, #(_l17)))
  else
    passed = passed + 1
  end
  local __x841 = {1, 2, 3}
  __x841.a = true
  local _l18 = __x841
  local __x842 = {}
  __x842.a = true
  if not equal63(__x842, cut(_l18, #(_l18))) then
    failed = failed + 1
    local __x843 = {}
    __x843.a = true
    return "failed: expected " .. str(__x843) .. ", was " .. str(cut(_l18, #(_l18)))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"clip", function ()
  if not equal63("uux", clip("quux", 1)) then
    failed = failed + 1
    return "failed: expected " .. str("uux") .. ", was " .. str(clip("quux", 1))
  else
    passed = passed + 1
  end
  if not equal63("uu", clip("quux", 1, 3)) then
    failed = failed + 1
    return "failed: expected " .. str("uu") .. ", was " .. str(clip("quux", 1, 3))
  else
    passed = passed + 1
  end
  if not equal63("", clip("quux", 5)) then
    failed = failed + 1
    return "failed: expected " .. str("") .. ", was " .. str(clip("quux", 5))
  else
    passed = passed + 1
  end
  if not equal63("ab", clip("ab", 0, 4)) then
    failed = failed + 1
    return "failed: expected " .. str("ab") .. ", was " .. str(clip("ab", 0, 4))
  else
    passed = passed + 1
  end
  if not equal63("ab", clip("ab", -4, 4)) then
    failed = failed + 1
    return "failed: expected " .. str("ab") .. ", was " .. str(clip("ab", -4, 4))
  else
    passed = passed + 1
  end
  if not equal63("a", clip("ab", -1, 1)) then
    failed = failed + 1
    return "failed: expected " .. str("a") .. ", was " .. str(clip("ab", -1, 1))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"search", function ()
  if not equal63(nil, search("", "a")) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(search("", "a"))
  else
    passed = passed + 1
  end
  if not equal63(0, search("", "")) then
    failed = failed + 1
    return "failed: expected " .. str(0) .. ", was " .. str(search("", ""))
  else
    passed = passed + 1
  end
  if not equal63(0, search("a", "")) then
    failed = failed + 1
    return "failed: expected " .. str(0) .. ", was " .. str(search("a", ""))
  else
    passed = passed + 1
  end
  if not equal63(0, search("abc", "a")) then
    failed = failed + 1
    return "failed: expected " .. str(0) .. ", was " .. str(search("abc", "a"))
  else
    passed = passed + 1
  end
  if not equal63(2, search("abcd", "cd")) then
    failed = failed + 1
    return "failed: expected " .. str(2) .. ", was " .. str(search("abcd", "cd"))
  else
    passed = passed + 1
  end
  if not equal63(nil, search("abcd", "ce")) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(search("abcd", "ce"))
  else
    passed = passed + 1
  end
  if not equal63(nil, search("abc", "z")) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(search("abc", "z"))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"split", function ()
  if not equal63({}, split("", "")) then
    failed = failed + 1
    return "failed: expected " .. str({}) .. ", was " .. str(split("", ""))
  else
    passed = passed + 1
  end
  if not equal63({}, split("", ",")) then
    failed = failed + 1
    return "failed: expected " .. str({}) .. ", was " .. str(split("", ","))
  else
    passed = passed + 1
  end
  if not equal63({"a"}, split("a", ",")) then
    failed = failed + 1
    return "failed: expected " .. str({"a"}) .. ", was " .. str(split("a", ","))
  else
    passed = passed + 1
  end
  if not equal63({"a", ""}, split("a,", ",")) then
    failed = failed + 1
    return "failed: expected " .. str({"a", ""}) .. ", was " .. str(split("a,", ","))
  else
    passed = passed + 1
  end
  if not equal63({"a", "b"}, split("a,b", ",")) then
    failed = failed + 1
    return "failed: expected " .. str({"a", "b"}) .. ", was " .. str(split("a,b", ","))
  else
    passed = passed + 1
  end
  if not equal63({"a", "b", ""}, split("a,b,", ",")) then
    failed = failed + 1
    return "failed: expected " .. str({"a", "b", ""}) .. ", was " .. str(split("a,b,", ","))
  else
    passed = passed + 1
  end
  if not equal63({"a", "b"}, split("azzb", "zz")) then
    failed = failed + 1
    return "failed: expected " .. str({"a", "b"}) .. ", was " .. str(split("azzb", "zz"))
  else
    passed = passed + 1
  end
  if not equal63({"a", "b", ""}, split("azzbzz", "zz")) then
    failed = failed + 1
    return "failed: expected " .. str({"a", "b", ""}) .. ", was " .. str(split("azzbzz", "zz"))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"reduce", function ()
  if not equal63("a", reduce(function (_0, _1)
    return _0 + _1
  end, {"a"})) then
    failed = failed + 1
    return "failed: expected " .. str("a") .. ", was " .. str(reduce(function (_0, _1)
      return _0 + _1
    end, {"a"}))
  else
    passed = passed + 1
  end
  if not equal63(6, reduce(function (_0, _1)
    return _0 + _1
  end, {1, 2, 3})) then
    failed = failed + 1
    return "failed: expected " .. str(6) .. ", was " .. str(reduce(function (_0, _1)
      return _0 + _1
    end, {1, 2, 3}))
  else
    passed = passed + 1
  end
  if not equal63({1, {2, 3}}, reduce(function (_0, _1)
    return {_0, _1}
  end, {1, 2, 3})) then
    failed = failed + 1
    return "failed: expected " .. str({1, {2, 3}}) .. ", was " .. str(reduce(function (_0, _1)
      return {_0, _1}
    end, {1, 2, 3}))
  else
    passed = passed + 1
  end
  if not equal63({1, 2, 3, 4, 5}, reduce(function (_0, _1)
    return join(_0, _1)
  end, {{1}, {2, 3}, {4, 5}})) then
    failed = failed + 1
    return "failed: expected " .. str({1, 2, 3, 4, 5}) .. ", was " .. str(reduce(function (_0, _1)
      return join(_0, _1)
    end, {{1}, {2, 3}, {4, 5}}))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"keep", function ()
  if not equal63({}, keep(function (_)
    return _
  end, {})) then
    failed = failed + 1
    return "failed: expected " .. str({}) .. ", was " .. str(keep(function (_)
      return _
    end, {}))
  else
    passed = passed + 1
  end
  local _even = function (_)
    return _ % 2 == 0
  end
  if not equal63({6}, keep(_even, {5, 6, 7})) then
    failed = failed + 1
    return "failed: expected " .. str({6}) .. ", was " .. str(keep(_even, {5, 6, 7}))
  else
    passed = passed + 1
  end
  if not equal63({{1}, {2, 3}}, keep(function (_)
    return #(_) > 0
  end, {{}, {1}, {}, {2, 3}})) then
    failed = failed + 1
    return "failed: expected " .. str({{1}, {2, 3}}) .. ", was " .. str(keep(function (_)
      return #(_) > 0
    end, {{}, {1}, {}, {2, 3}}))
  else
    passed = passed + 1
  end
  local _even63 = function (_)
    return _ % 2 == 0
  end
  if not equal63({2, 4, 6}, keep(_even63, {1, 2, 3, 4, 5, 6})) then
    failed = failed + 1
    return "failed: expected " .. str({2, 4, 6}) .. ", was " .. str(keep(_even63, {1, 2, 3, 4, 5, 6}))
  else
    passed = passed + 1
  end
  local __x907 = {2, 4, 6}
  __x907.b = 8
  local __x908 = {1, 2, 3, 4, 5, 6}
  __x908.a = 7
  __x908.b = 8
  if not equal63(__x907, keep(_even63, __x908)) then
    failed = failed + 1
    local __x909 = {2, 4, 6}
    __x909.b = 8
    local __x910 = {1, 2, 3, 4, 5, 6}
    __x910.a = 7
    __x910.b = 8
    return "failed: expected " .. str(__x909) .. ", was " .. str(keep(_even63, __x910))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"in?", function ()
  if not equal63(true, in63("x", {"x", "y", "z"})) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(in63("x", {"x", "y", "z"}))
  else
    passed = passed + 1
  end
  if not equal63(true, in63(7, {5, 6, 7})) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(in63(7, {5, 6, 7}))
  else
    passed = passed + 1
  end
  if not equal63(nil, in63("baz", {"no", "can", "do"})) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(in63("baz", {"no", "can", "do"}))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"find", function ()
  if not equal63(nil, find(function (_)
    return _
  end, {})) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(find(function (_)
      return _
    end, {}))
  else
    passed = passed + 1
  end
  if not equal63(7, find(function (_)
    return _
  end, {7})) then
    failed = failed + 1
    return "failed: expected " .. str(7) .. ", was " .. str(find(function (_)
      return _
    end, {7}))
  else
    passed = passed + 1
  end
  if not equal63(true, find(function (_)
    return _ == 7
  end, {2, 4, 7})) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(find(function (_)
      return _ == 7
    end, {2, 4, 7}))
  else
    passed = passed + 1
  end
  local __x923 = {2, 4}
  __x923.foo = 7
  if not equal63(true, find(function (_)
    return _ == 7
  end, __x923)) then
    failed = failed + 1
    local __x924 = {2, 4}
    __x924.foo = 7
    return "failed: expected " .. str(true) .. ", was " .. str(find(function (_)
      return _ == 7
    end, __x924))
  else
    passed = passed + 1
  end
  local __x925 = {2, 4}
  __x925.bar = true
  if not equal63(true, find(function (_)
    return _ == true
  end, __x925)) then
    failed = failed + 1
    local __x926 = {2, 4}
    __x926.bar = true
    return "failed: expected " .. str(true) .. ", was " .. str(find(function (_)
      return _ == true
    end, __x926))
  else
    passed = passed + 1
  end
  if not equal63(true, in63(7, {2, 4, 7})) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(in63(7, {2, 4, 7}))
  else
    passed = passed + 1
  end
  local __x929 = {2, 4}
  __x929.foo = 7
  if not equal63(true, in63(7, __x929)) then
    failed = failed + 1
    local __x930 = {2, 4}
    __x930.foo = 7
    return "failed: expected " .. str(true) .. ", was " .. str(in63(7, __x930))
  else
    passed = passed + 1
  end
  local __x931 = {2, 4}
  __x931.bar = true
  if not equal63(true, in63(true, __x931)) then
    failed = failed + 1
    local __x932 = {2, 4}
    __x932.bar = true
    return "failed: expected " .. str(true) .. ", was " .. str(in63(true, __x932))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"first", function ()
  if not equal63(nil, first(function (_)
    return _
  end, {})) then
    failed = failed + 1
    return "failed: expected " .. str(nil) .. ", was " .. str(first(function (_)
      return _
    end, {}))
  else
    passed = passed + 1
  end
  if not equal63(7, first(function (_)
    return _
  end, {7})) then
    failed = failed + 1
    return "failed: expected " .. str(7) .. ", was " .. str(first(function (_)
      return _
    end, {7}))
  else
    passed = passed + 1
  end
  if not equal63(true, first(function (_)
    return _ == 7
  end, {2, 4, 7})) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(first(function (_)
      return _ == 7
    end, {2, 4, 7}))
  else
    passed = passed + 1
  end
  if not equal63(4, first(function (_)
    return _ > 3 and _
  end, {1, 2, 3, 4, 5, 6})) then
    failed = failed + 1
    return "failed: expected " .. str(4) .. ", was " .. str(first(function (_)
      return _ > 3 and _
    end, {1, 2, 3, 4, 5, 6}))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"sort", function ()
  if not equal63({"a", "b", "c"}, sort({"c", "a", "b"})) then
    failed = failed + 1
    return "failed: expected " .. str({"a", "b", "c"}) .. ", was " .. str(sort({"c", "a", "b"}))
  else
    passed = passed + 1
  end
  if not equal63({3, 2, 1}, sort({1, 2, 3}, _62)) then
    failed = failed + 1
    return "failed: expected " .. str({3, 2, 1}) .. ", was " .. str(sort({1, 2, 3}, _62))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"type", function ()
  if not equal63(true, type("abc") == "string") then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(type("abc") == "string")
  else
    passed = passed + 1
  end
  if not equal63(false, type(17) == "string") then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(type(17) == "string")
  else
    passed = passed + 1
  end
  if not equal63(false, type({"a"}) == "string") then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(type({"a"}) == "string")
  else
    passed = passed + 1
  end
  if not equal63(false, type(true) == "string") then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(type(true) == "string")
  else
    passed = passed + 1
  end
  if not equal63(false, type({}) == "string") then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(type({}) == "string")
  else
    passed = passed + 1
  end
  if not equal63(false, type("abc") == "number") then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(type("abc") == "number")
  else
    passed = passed + 1
  end
  if not equal63(true, type(17) == "number") then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(type(17) == "number")
  else
    passed = passed + 1
  end
  if not equal63(false, type({"a"}) == "number") then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(type({"a"}) == "number")
  else
    passed = passed + 1
  end
  if not equal63(false, type(true) == "number") then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(type(true) == "number")
  else
    passed = passed + 1
  end
  if not equal63(false, type({}) == "number") then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(type({}) == "number")
  else
    passed = passed + 1
  end
  if not equal63(false, type("abc") == "boolean") then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(type("abc") == "boolean")
  else
    passed = passed + 1
  end
  if not equal63(false, type(17) == "boolean") then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(type(17) == "boolean")
  else
    passed = passed + 1
  end
  if not equal63(false, type({"a"}) == "boolean") then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(type({"a"}) == "boolean")
  else
    passed = passed + 1
  end
  if not equal63(true, type(true) == "boolean") then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(type(true) == "boolean")
  else
    passed = passed + 1
  end
  if not equal63(false, type({}) == "boolean") then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(type({}) == "boolean")
  else
    passed = passed + 1
  end
  if not equal63(true, not( type(nil) == "table")) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(not( type(nil) == "table"))
  else
    passed = passed + 1
  end
  if not equal63(true, not( type("abc") == "table")) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(not( type("abc") == "table"))
  else
    passed = passed + 1
  end
  if not equal63(true, not( type(42) == "table")) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(not( type(42) == "table"))
  else
    passed = passed + 1
  end
  if not equal63(true, not( type(true) == "table")) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(not( type(true) == "table"))
  else
    passed = passed + 1
  end
  if not equal63(true, not( type(function ()
  end) == "table")) then
    failed = failed + 1
    return "failed: expected " .. str(true) .. ", was " .. str(not( type(function ()
    end) == "table"))
  else
    passed = passed + 1
  end
  if not equal63(false, not( type({1}) == "table")) then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(not( type({1}) == "table"))
  else
    passed = passed + 1
  end
  if not equal63(false, not( type({}) == "table")) then
    failed = failed + 1
    return "failed: expected " .. str(false) .. ", was " .. str(not( type({}) == "table"))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"apply", function ()
  if not equal63(4, apply(function (_0, _1)
    return _0 + _1
  end, {2, 2})) then
    failed = failed + 1
    return "failed: expected " .. str(4) .. ", was " .. str(apply(function (_0, _1)
      return _0 + _1
    end, {2, 2}))
  else
    passed = passed + 1
  end
  if not equal63({2, 2}, apply(function (...)
    local _a53 = unstash({...})
    return _a53
  end, {2, 2})) then
    failed = failed + 1
    return "failed: expected " .. str({2, 2}) .. ", was " .. str(apply(function (...)
      local _a54 = unstash({...})
      return _a54
    end, {2, 2}))
  else
    passed = passed + 1
  end
  local _l19 = {1}
  _l19.foo = 17
  if not equal63(17, apply(function (...)
    local _a55 = unstash({...})
    return _a55.foo
  end, _l19)) then
    failed = failed + 1
    return "failed: expected " .. str(17) .. ", was " .. str(apply(function (...)
      local _a56 = unstash({...})
      return _a56.foo
    end, _l19))
  else
    passed = passed + 1
  end
  local __x971 = {}
  __x971.foo = 42
  if not equal63(42, apply(function (...)
    local __r199 = unstash({...})
    local _foo4 = __r199.foo
    return _foo4
  end, __x971)) then
    failed = failed + 1
    local __x973 = {}
    __x973.foo = 42
    return "failed: expected " .. str(42) .. ", was " .. str(apply(function (...)
      local __r200 = unstash({...})
      local _foo5 = __r200.foo
      return _foo5
    end, __x973))
  else
    passed = passed + 1
  end
  local __x976 = {}
  __x976.foo = 42
  if not equal63(42, apply(function (_x974)
    local _foo6 = _x974.foo
    return _foo6
  end, {__x976})) then
    failed = failed + 1
    local __x979 = {}
    __x979.foo = 42
    return "failed: expected " .. str(42) .. ", was " .. str(apply(function (_x977)
      local _foo7 = _x977.foo
      return _foo7
    end, {__x979}))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"eval", function ()
  local _eval = compiler.eval
  if not equal63(4, _eval({"+", 2, 2})) then
    failed = failed + 1
    return "failed: expected " .. str(4) .. ", was " .. str(_eval({"+", 2, 2}))
  else
    passed = passed + 1
  end
  if not equal63(5, _eval({"let", "a", 3, {"+", 2, "a"}})) then
    failed = failed + 1
    return "failed: expected " .. str(5) .. ", was " .. str(_eval({"let", "a", 3, {"+", 2, "a"}}))
  else
    passed = passed + 1
  end
  if not equal63(9, _eval({"do", {"var", "x", 7}, {"+", "x", 2}})) then
    failed = failed + 1
    return "failed: expected " .. str(9) .. ", was " .. str(_eval({"do", {"var", "x", 7}, {"+", "x", 2}}))
  else
    passed = passed + 1
  end
  if not equal63(6, _eval({"apply", "+", {"quote", {1, 2, 3}}})) then
    failed = failed + 1
    return "failed: expected " .. str(6) .. ", was " .. str(_eval({"apply", "+", {"quote", {1, 2, 3}}}))
  else
    passed = passed + 1
    return passed
  end
end})
add(tests, {"parameters", function ()
  if not equal63(42, (function (_x1000)
    local _a57 = _x1000[1]
    return _a57
  end)({42})) then
    failed = failed + 1
    return "failed: expected " .. str(42) .. ", was " .. str((function (_x1002)
      local _a58 = _x1002[1]
      return _a58
    end)({42}))
  else
    passed = passed + 1
  end
  local _f4 = function (a, _x1004)
    local _b22 = _x1004[1]
    local _c5 = _x1004[2]
    return {a, _b22, _c5}
  end
  if not equal63({1, 2, 3}, _f4(1, {2, 3})) then
    failed = failed + 1
    return "failed: expected " .. str({1, 2, 3}) .. ", was " .. str(_f4(1, {2, 3}))
  else
    passed = passed + 1
  end
  local _f5 = function (a, _x1010, ...)
    local _b23 = _x1010[1]
    local _c6 = cut(_x1010, 1)
    local __r208 = unstash({...})
    local _d2 = cut(__r208, 0)
    return {a, _b23, _c6, _d2}
  end
  if not equal63({1, 2, {3, 4}, {5, 6, 7}}, _f5(1, {2, 3, 4}, 5, 6, 7)) then
    failed = failed + 1
    return "failed: expected " .. str({1, 2, {3, 4}, {5, 6, 7}}) .. ", was " .. str(_f5(1, {2, 3, 4}, 5, 6, 7))
  else
    passed = passed + 1
  end
  local _f6 = function (a, _x1021, ...)
    local _b24 = _x1021[1]
    local _c7 = cut(_x1021, 1)
    local __r209 = unstash({...})
    local _d3 = cut(__r209, 0)
    return {a, _b24, _c7, _d3}
  end
  if not equal63({1, 2, {3, 4}, {5, 6, 7}}, apply(_f6, {1, {2, 3, 4}, 5, 6, 7})) then
    failed = failed + 1
    return "failed: expected " .. str({1, 2, {3, 4}, {5, 6, 7}}) .. ", was " .. str(apply(_f6, {1, {2, 3, 4}, 5, 6, 7}))
  else
    passed = passed + 1
  end
  if not equal63({3, 4}, (function (a, b, ...)
    local __r210 = unstash({...})
    local _c8 = cut(__r210, 0)
    return _c8
  end)(1, 2, 3, 4)) then
    failed = failed + 1
    return "failed: expected " .. str({3, 4}) .. ", was " .. str((function (a, b, ...)
      local __r211 = unstash({...})
      local _c9 = cut(__r211, 0)
      return _c9
    end)(1, 2, 3, 4))
  else
    passed = passed + 1
  end
  local _f7 = function (w, _x1038, ...)
    local _x1039 = _x1038[1]
    local _y2 = cut(_x1038, 1)
    local __r212 = unstash({...})
    local _z2 = cut(__r212, 0)
    return {_y2, _z2}
  end
  if not equal63({{3, 4}, {5, 6, 7}}, _f7(1, {2, 3, 4}, 5, 6, 7)) then
    failed = failed + 1
    return "failed: expected " .. str({{3, 4}, {5, 6, 7}}) .. ", was " .. str(_f7(1, {2, 3, 4}, 5, 6, 7))
  else
    passed = passed + 1
  end
  if not equal63(42, (function (...)
    local __r213 = unstash({...})
    local _foo8 = __r213.foo
    return _foo8
  end)(stash33({["foo"] = 42}))) then
    failed = failed + 1
    return "failed: expected " .. str(42) .. ", was " .. str((function (...)
      local __r214 = unstash({...})
      local _foo9 = __r214.foo
      return _foo9
    end)(stash33({["foo"] = 42})))
  else
    passed = passed + 1
  end
  local __x1053 = {}
  __x1053.foo = 42
  if not equal63(42, apply(function (...)
    local __r215 = unstash({...})
    local _foo10 = __r215.foo
    return _foo10
  end, __x1053)) then
    failed = failed + 1
    local __x1055 = {}
    __x1055.foo = 42
    return "failed: expected " .. str(42) .. ", was " .. str(apply(function (...)
      local __r216 = unstash({...})
      local _foo11 = __r216.foo
      return _foo11
    end, __x1055))
  else
    passed = passed + 1
  end
  local __x1057 = {}
  __x1057.foo = 42
  if not equal63(42, (function (_x1056)
    local _foo12 = _x1056.foo
    return _foo12
  end)(__x1057)) then
    failed = failed + 1
    local __x1059 = {}
    __x1059.foo = 42
    return "failed: expected " .. str(42) .. ", was " .. str((function (_x1058)
      local _foo13 = _x1058.foo
      return _foo13
    end)(__x1059))
  else
    passed = passed + 1
  end
  local _f8 = function (a, _x1060, ...)
    local _foo14 = _x1060.foo
    local __r219 = unstash({...})
    local _b25 = __r219.bar
    return {a, _b25, _foo14}
  end
  local __x1064 = {}
  __x1064.foo = 42
  if not equal63({10, 20, 42}, _f8(10, __x1064, stash33({["bar"] = 20}))) then
    failed = failed + 1
    local __x1066 = {}
    __x1066.foo = 42
    return "failed: expected " .. str({10, 20, 42}) .. ", was " .. str(_f8(10, __x1066, stash33({["bar"] = 20})))
  else
    passed = passed + 1
  end
  local _f9 = function (a, _x1067, ...)
    local _foo15 = _x1067.foo
    local __r220 = unstash({...})
    local _b26 = __r220.bar
    return {a, _b26, _foo15}
  end
  local __x1072 = {"list"}
  __x1072.foo = 42
  local __x1071 = {10, __x1072}
  __x1071.bar = 20
  if not equal63({10, 20, 42}, apply(_f9, __x1071)) then
    failed = failed + 1
    local __x1075 = {"list"}
    __x1075.foo = 42
    local __x1074 = {10, __x1075}
    __x1074.bar = 20
    return "failed: expected " .. str({10, 20, 42}) .. ", was " .. str(apply(_f9, __x1074))
  else
    passed = passed + 1
  end
  if not equal63(1, (function (a, ...)
    local __r221 = unstash({...})
    local _b27 = __r221.b
    return (a or 0) + _b27
  end)(stash33({["b"] = 1}))) then
    failed = failed + 1
    return "failed: expected " .. str(1) .. ", was " .. str((function (a, ...)
      local __r222 = unstash({...})
      local _b28 = __r222.b
      return (a or 0) + _b28
    end)(stash33({["b"] = 1})))
  else
    passed = passed + 1
  end
  local __x1079 = {}
  __x1079.b = 1
  if not equal63(1, apply(function (a, ...)
    local __r223 = unstash({...})
    local _b29 = __r223.b
    return (a or 0) + _b29
  end, __x1079)) then
    failed = failed + 1
    local __x1081 = {}
    __x1081.b = 1
    return "failed: expected " .. str(1) .. ", was " .. str(apply(function (a, ...)
      local __r224 = unstash({...})
      local _b30 = __r224.b
      return (a or 0) + _b30
    end, __x1081))
  else
    passed = passed + 1
  end
  local _l20 = {}
  local function f(...)
    local __r225 = unstash({...})
    local _a59 = __r225.a
    add(_l20, _a59)
    return _a59
  end
  local function g(a, b, ...)
    local __r226 = unstash({...})
    local _c10 = __r226.c
    add(_l20, {a, b, _c10})
    return _c10
  end
  local x = f(stash33({["a"] = g(f(stash33({["a"] = 10})), f(stash33({["a"] = 20})), stash33({["c"] = f(stash33({["a"] = 42}))}))}))
  if not equal63(42, x) then
    failed = failed + 1
    return "failed: expected " .. str(42) .. ", was " .. str(x)
  else
    passed = passed + 1
  end
  if not equal63({10, 20, 42, {10, 20, 42}, 42}, _l20) then
    failed = failed + 1
    return "failed: expected " .. str({10, 20, 42, {10, 20, 42}, 42}) .. ", was " .. str(_l20)
  else
    passed = passed + 1
  end
  local _f10 = function (...)
    local _args = unstash({...})
    return _args
  end
  if not equal63({1, 2, 3}, _f10(1, 2, 3)) then
    failed = failed + 1
    return "failed: expected " .. str({1, 2, 3}) .. ", was " .. str(_f10(1, 2, 3))
  else
    passed = passed + 1
  end
  if not equal63({1, 2, 3}, apply(_f10, {1, 2, 3})) then
    failed = failed + 1
    return "failed: expected " .. str({1, 2, 3}) .. ", was " .. str(apply(_f10, {1, 2, 3}))
  else
    passed = passed + 1
    return passed
  end
end})
if _x1096 == nil then
  _x1096 = true
  run_tests()
end
