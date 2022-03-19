local function setup()
  setenv("t", stash33({["symbol"] = true}))
  setenv("js?", stash33({["symbol"] = {"is", "target*", {"quote", "js"}}}))
  setenv("lua?", stash33({["symbol"] = {"is", "target*", {"quote", "lua"}}}))
  local __x4 = {"target"}
  __x4.lua = "_G"
  __x4.js = {"if", {"nil?", "global"}, "window", "global"}
  setenv("global*", stash33({["symbol"] = __x4}))
  local function _37compile_time__macro(...)
    local _forms = unstash({...})
    compiler.eval(join({"do"}, _forms))
    return nil
  end
  setenv("%compile-time", stash33({["macro"] = _37compile_time__macro}))
  local function when_compiling__macro(...)
    local _body = unstash({...})
    return compiler.eval(join({"do"}, _body))
  end
  setenv("when-compiling", stash33({["macro"] = when_compiling__macro}))
  local function during_compilation__macro(...)
    local _body1 = unstash({...})
    local _form = join({"do"}, _body1)
    compiler.eval(_form)
    return _form
  end
  setenv("during-compilation", stash33({["macro"] = during_compilation__macro}))
  local function _37js__macro(...)
    local _forms1 = unstash({...})
    if target42 == "js" then
      return join({"do"}, _forms1)
    end
  end
  setenv("%js", stash33({["macro"] = _37js__macro}))
  local function _37lua__macro(...)
    local _forms2 = unstash({...})
    if target42 == "lua" then
      return join({"do"}, _forms2)
    end
  end
  setenv("%lua", stash33({["macro"] = _37lua__macro}))
  local function quote__macro(form)
    return quoted(form)
  end
  setenv("quote", stash33({["macro"] = quote__macro}))
  local function quasiquote__macro(form)
    return quasiexpand(form, 1)
  end
  setenv("quasiquote", stash33({["macro"] = quasiquote__macro}))
  local function at__macro(l, i)
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
  end
  setenv("at", stash33({["macro"] = at__macro}))
  local function wipe__macro(place)
    if target42 == "lua" then
      return {"assign", place, "nil"}
    else
      return {"%delete", place}
    end
  end
  setenv("wipe", stash33({["macro"] = wipe__macro}))
  local function list__macro(...)
    local _body2 = unstash({...})
    local _x26 = uniq("x")
    local _l = {}
    local _forms3 = {}
    local __l1 = _body2
    local _k = nil
    for _k in next, __l1 do
      local _v = __l1[_k]
      if type(_k) == "number" then
        _l[_k] = _v
      else
        add(_forms3, {"assign", {"get", _x26, {"quote", _k}}, _v})
      end
    end
    if #(_forms3) > 0 then
      return join({"let", _x26, join({"%array"}, _l)}, _forms3, {_x26})
    else
      return join({"%array"}, _l)
    end
  end
  setenv("list", stash33({["macro"] = list__macro}))
  local function xform__macro(l, body)
    return {"map", {"%fn", {"do", body}}, l}
  end
  setenv("xform", stash33({["macro"] = xform__macro}))
  local function if__macro(...)
    local _branches = unstash({...})
    return expand_if(_branches)[1]
  end
  setenv("if", stash33({["macro"] = if__macro}))
  local function case__macro(x, ...)
    local __r6 = unstash({...})
    local _clauses = cut(__r6, 0)
    local _e = uniq("e")
    local _bs = map(function (_x39)
      local _a = _x39[1]
      local _b = _x39[2]
      if _b == nil then
        return {_a}
      else
        return {{"is", _a, _e}, _b}
      end
    end, pair(_clauses))
    return {"let", {_e, x}, join({"if"}, apply(join, _bs))}
  end
  setenv("case", stash33({["macro"] = case__macro}))
  local function when__macro(cond, ...)
    local __r8 = unstash({...})
    local _body3 = cut(__r8, 0)
    return {"if", cond, join({"do"}, _body3)}
  end
  setenv("when", stash33({["macro"] = when__macro}))
  local function unless__macro(cond, ...)
    local __r9 = unstash({...})
    local _body4 = cut(__r9, 0)
    return {"if", {"not", cond}, join({"do"}, _body4)}
  end
  setenv("unless", stash33({["macro"] = unless__macro}))
  local function assert__macro(cond)
    local _x54 = "assert: " .. str(cond)
    return {"unless", cond, {"error", {"quote", _x54}}}
  end
  setenv("assert", stash33({["macro"] = assert__macro}))
  local function obj__macro(...)
    local _body5 = unstash({...})
    return join({"%object"}, mapo(function (_)
      return _
    end, _body5))
  end
  setenv("obj", stash33({["macro"] = obj__macro}))
  local function let__macro(bs, ...)
    local __r12 = unstash({...})
    local _body6 = cut(__r12, 0)
    if not( type(bs) == "table") then
      return join({"let", {bs, _body6[1]}}, cut(_body6, 1))
    else
      if #(bs) == 0 then
        return join({"do"}, _body6)
      else
        local _lh = bs[1]
        local _rh = bs[2]
        local _bs2 = cut(bs, 2)
        local __id6 = bind(_lh, _rh)
        local _id7 = __id6[1]
        local _val = __id6[2]
        local _bs1 = cut(__id6, 2)
        local _id11 = uniq(_id7)
        return {"do", {"%local", _id11, _val}, {"w/sym", _id7, _id11, join({"let", join(_bs1, _bs2)}, _body6)}}
      end
    end
  end
  setenv("let", stash33({["macro"] = let__macro}))
  local function _61__macro(...)
    local _l2 = unstash({...})
    local __e1 = #(_l2)
    if 0 == __e1 then
      return nil
    else
      if 1 == __e1 then
        return join({"="}, _l2, {"nil"})
      else
        if 2 == __e1 then
          local _lh1 = _l2[1]
          local _rh1 = _l2[2]
          if not( type(_lh1) == "table") or _lh1[1] == "at" or _lh1[1] == "get" then
            return {"assign", _lh1, _rh1}
          else
            local _vars = {}
            local _forms4 = bind(_lh1, _rh1, _vars)
            return join({"do"}, map(function (_)
              return {"var", _}
            end, _vars), map(function (_x73)
              local _id10 = _x73[1]
              local _val1 = _x73[2]
              return {"=", _id10, _val1}
            end, pair(_forms4)))
          end
        else
          return join({"do"}, map(function (_)
            return join({"="}, _)
          end, pair(_l2)))
        end
      end
    end
  end
  setenv("=", stash33({["macro"] = _61__macro}))
  local function with__macro(x, v, ...)
    local __r16 = unstash({...})
    local _body7 = cut(__r16, 0)
    return join({"let", {x, v}}, _body7, {x})
  end
  setenv("with", stash33({["macro"] = with__macro}))
  local function iflet__macro(_var, expr, _then, ...)
    local __r17 = unstash({...})
    local _rest = cut(__r17, 0)
    if not( type(_var) == "table") then
      return {"let", _var, expr, join({"if", _var, _then}, _rest)}
    else
      local _gv = uniq("if")
      return {"let", _gv, expr, join({"if", _gv, {"let", {_var, _gv}, _then}}, _rest)}
    end
  end
  setenv("iflet", stash33({["macro"] = iflet__macro}))
  local function whenlet__macro(_var, expr, ...)
    local __r18 = unstash({...})
    local _body8 = cut(__r18, 0)
    return {"iflet", _var, expr, join({"do"}, _body8)}
  end
  setenv("whenlet", stash33({["macro"] = whenlet__macro}))
  local function do1__macro(x, ...)
    local __r19 = unstash({...})
    local _ys = cut(__r19, 0)
    local _g = uniq("do")
    return join({"let", _g, x}, _ys, {_g})
  end
  setenv("do1", stash33({["macro"] = do1__macro}))
  local function _37define__macro(kind, name, x, ...)
    local __r20 = unstash({...})
    local _e4
    if __r20.eval == nil then
      _e4 = nil
    else
      _e4 = __r20.eval
    end
    local _self_evaluating63 = _e4
    local _body9 = cut(__r20, 0)
    local _label = name .. "--" .. kind
    local _e5
    if #(_body9) == 0 then
      _e5 = {"quote", x}
    else
      local __x96 = {"fn", x}
      __x96.name = _label
      _e5 = join(__x96, _body9)
    end
    local _expansion = _e5
    local _form1 = join({"setenv", {"quote", name}}, {[kind] = _expansion}, keys(_body9))
    if _self_evaluating63 then
      return {"during-compilation", _form1}
    else
      return _form1
    end
  end
  setenv("%define", stash33({["macro"] = _37define__macro}))
  local function mac__macro(name, args, ...)
    local __r21 = unstash({...})
    local _body10 = cut(__r21, 0)
    return join({"%define", "macro", name, args}, _body10)
  end
  setenv("mac", stash33({["macro"] = mac__macro}))
  local function defspecial__macro(name, args, ...)
    local __r22 = unstash({...})
    local _body11 = cut(__r22, 0)
    return join({"%define", "special", name, args}, _body11)
  end
  setenv("defspecial", stash33({["macro"] = defspecial__macro}))
  local function deftransformer__macro(name, form, ...)
    local __r23 = unstash({...})
    local _body12 = cut(__r23, 0)
    return join({"%define", "transformer", name, {form}}, _body12)
  end
  setenv("deftransformer", stash33({["macro"] = deftransformer__macro}))
  local function defsym__macro(name, expansion, ...)
    local __r24 = unstash({...})
    local _props = cut(__r24, 0)
    return join({"%define", "symbol", name, expansion}, keys(_props))
  end
  setenv("defsym", stash33({["macro"] = defsym__macro}))
  local function var__macro(name, x, ...)
    local __r25 = unstash({...})
    local _body13 = cut(__r25, 0)
    setenv(name, stash33({["variable"] = true}))
    if #(_body13) > 0 then
      return join({"%local-function", name}, bind42(x, _body13))
    else
      return {"%local", name, x}
    end
  end
  setenv("var", stash33({["macro"] = var__macro}))
  local function def__macro(name, x, ...)
    local __r26 = unstash({...})
    local _body14 = cut(__r26, 0)
    setenv(name, stash33({["toplevel"] = true, ["variable"] = true}))
    if #(_body14) > 0 then
      return join({"%global-function", name}, bind42(x, _body14))
    else
      return {"=", name, x}
    end
  end
  setenv("def", stash33({["macro"] = def__macro}))
  local function w47frame__macro(...)
    local _body15 = unstash({...})
    local _x116 = uniq("x")
    return {"do", {"add", "environment*", {"obj"}}, {"with", _x116, join({"do"}, _body15), {"drop", "environment*"}}}
  end
  setenv("w/frame", stash33({["macro"] = w47frame__macro}))
  local function w47bindings__macro(_x123, ...)
    local _names = _x123[1]
    local __r27 = unstash({...})
    local _body16 = cut(__r27, 0)
    local _x125 = uniq("x")
    local __x128 = {"setenv", _x125}
    __x128.variable = true
    return join({"w/frame", {"each", _x125, _names, __x128}}, _body16)
  end
  setenv("w/bindings", stash33({["macro"] = w47bindings__macro}))
  local function _37scope__macro(...)
    local _body17 = unstash({...})
    add(environment42, {})
    local __x130 = {"%expansion", macroexpand(join({"do"}, _body17))}
    drop(environment42)
    return __x130
  end
  setenv("%scope", stash33({["macro"] = _37scope__macro}))
  local function w47mac__macro(name, args, definition, ...)
    local __r28 = unstash({...})
    local _body18 = cut(__r28, 0)
    return join({"%scope", {"%compile-time", {"mac", name, args, definition}}}, _body18)
  end
  setenv("w/mac", stash33({["macro"] = w47mac__macro}))
  local function w47sym__macro(expansions, ...)
    local __r29 = unstash({...})
    local _body19 = cut(__r29, 0)
    if not( type(expansions) == "table") then
      return join({"w/sym", {expansions, _body19[1]}}, cut(_body19, 1))
    else
      return join({"%scope", join({"%compile-time"}, map(function (_)
        return join({"defsym"}, _)
      end, pair(expansions)))}, _body19)
    end
  end
  setenv("w/sym", stash33({["macro"] = w47sym__macro}))
  local function w47uniq__macro(names, ...)
    local __r31 = unstash({...})
    local _body20 = cut(__r31, 0)
    if not( type(names) == "table") then
      names = {names}
    end
    return join({"let", apply(join, map(function (_)
      return {_, {"uniq", {"quote", _}}}
    end, names))}, _body20)
  end
  setenv("w/uniq", stash33({["macro"] = w47uniq__macro}))
  local function fn__macro(args, ...)
    local __r33 = unstash({...})
    local _name = __r33.name
    local _body21 = cut(__r33, 0)
    if _name == nil then
      return join({"%function"}, bind42(args, _body21))
    else
      return {"do", join({"%local-function", _name}, bind42(args, _body21)), _name}
    end
  end
  setenv("fn", stash33({["macro"] = fn__macro}))
  local function guard__macro(expr)
    if target42 == "js" then
      return {{"%fn", {"%try", {"list", "t", expr}}}}
    else
      local _x157 = uniq("x")
      local _msg = uniq("msg")
      local _trace = uniq("trace")
      return {"let", {_x157, "nil", _msg, "nil", _trace, "nil"}, {"if", {"xpcall", {"%fn", {"=", _x157, expr}}, {"%fn", {"do", {"=", _msg, {"clip", "_", {"+", {"search", "_", "\": \""}, 2}}}, {"=", _trace, {{"get", "debug", {"quote", "traceback"}}}}}}}, {"list", "t", _x157}, {"list", false, _msg, _trace}}}
    end
  end
  setenv("guard", stash33({["macro"] = guard__macro}))
  local function for__macro(i, n, ...)
    local __r35 = unstash({...})
    local _body22 = cut(__r35, 0)
    return {"let", i, 0, join({"while", {"<", i, n}}, _body22, {{"++", i}})}
  end
  setenv("for", stash33({["macro"] = for__macro}))
  local function step__macro(v, l, ...)
    local __r36 = unstash({...})
    local _body23 = cut(__r36, 0)
    local _index = __r36.index
    local _e6
    if _index == nil then
      _e6 = uniq("i")
    else
      _e6 = _index
    end
    local _i1 = _e6
    if _i1 == true then
      _i1 = "index"
    end
    local _x183 = uniq("x")
    local _n1 = uniq("n")
    return {"let", {_x183, l, _n1, {"len", _x183}}, {"for", _i1, _n1, join({"let", {v, {"at", _x183, _i1}}}, _body23)}}
  end
  setenv("step", stash33({["macro"] = step__macro}))
  local function each__macro(x, lst, ...)
    local __r37 = unstash({...})
    local _body24 = cut(__r37, 0)
    local _l3 = uniq("l")
    local _n2 = uniq("n")
    local _i2 = uniq("i")
    local _e7
    if not( type(x) == "table") then
      _e7 = {_i2, x}
    else
      local _e8
      if #(x) > 1 then
        _e8 = x
      else
        _e8 = {_i2, x[1]}
      end
      _e7 = _e8
    end
    local __id31 = _e7
    local _k1 = __id31[1]
    local _v1 = __id31[2]
    local _e9
    if target42 == "lua" then
      _e9 = _body24
    else
      _e9 = {join({"let", _k1, {"if", {"numeric?", _k1}, {"parseInt", _k1}, _k1}}, _body24)}
    end
    return {"let", {_l3, lst, _k1, "nil"}, {"%for", _l3, _k1, join({"let", {_v1, {"get", _l3, _k1}}}, _e9)}}
  end
  setenv("each", stash33({["macro"] = each__macro}))
  local function set_of__macro(...)
    local _xs = unstash({...})
    local _l4 = {}
    local __l5 = _xs
    local __i3 = nil
    for __i3 in next, __l5 do
      local _x208 = __l5[__i3]
      _l4[_x208] = true
    end
    return join({"obj"}, _l4)
  end
  setenv("set-of", stash33({["macro"] = set_of__macro}))
  local function language__macro()
    return {"quote", target42}
  end
  setenv("language", stash33({["macro"] = language__macro}))
  local function target__macro(...)
    local _clauses1 = unstash({...})
    return _clauses1[target42]
  end
  setenv("target", stash33({["macro"] = target__macro}))
  local function join33__macro(a, ...)
    local __r39 = unstash({...})
    local _bs11 = cut(__r39, 0)
    return {"=", a, join({"join", a}, _bs11)}
  end
  setenv("join!", stash33({["macro"] = join33__macro}))
  local function cat33__macro(a, ...)
    local __r40 = unstash({...})
    local _bs21 = cut(__r40, 0)
    return {"=", a, join({"cat", a}, _bs21)}
  end
  setenv("cat!", stash33({["macro"] = cat33__macro}))
  local function _4343__macro(n, by)
    if by == nil then
      by = 1
    end
    return {"=", n, {"+", n, by}}
  end
  setenv("++", stash33({["macro"] = _4343__macro}))
  local function ____macro(n, by)
    if by == nil then
      by = 1
    end
    return {"=", n, {"-", n, by}}
  end
  setenv("--", stash33({["macro"] = ____macro}))
  local function export__macro(...)
    local _names1 = unstash({...})
    if target42 == "js" then
      return join({"do"}, map(function (_)
        return {"=", {"get", "exports", {"quote", _}}, _}
      end, _names1))
    else
      local _x227 = {}
      local __l6 = _names1
      local __i4 = nil
      for __i4 in next, __l6 do
        local _k2 = __l6[__i4]
        _x227[_k2] = _k2
      end
      return {"return", join({"obj"}, _x227)}
    end
  end
  setenv("export", stash33({["macro"] = export__macro}))
  local function once__macro(...)
    local _forms5 = unstash({...})
    local _x231 = uniq("x")
    return {"when", {"nil?", _x231}, {"=", _x231, "t"}, join({"let", join()}, _forms5)}
  end
  setenv("once", stash33({["macro"] = once__macro}))
  local function elf__macro()
    local __x237 = {"target"}
    __x237.js = "\"elf.js\""
    __x237.lua = "\"elf\""
    return {"require", __x237}
  end
  setenv("elf", stash33({["macro"] = elf__macro}))
  local function lib__macro(...)
    local _modules = unstash({...})
    return join({"do"}, map(function (_)
      return {"def", _, {"require", {"quote", _}}}
    end, _modules))
  end
  setenv("lib", stash33({["macro"] = lib__macro}))
  local function use__macro(...)
    local _modules1 = unstash({...})
    return join({"do"}, map(function (_)
      return {"var", _, {"require", {"quote", _}}}
    end, _modules1))
  end
  setenv("use", stash33({["macro"] = use__macro}))
  local function nil63__macro(x)
    if target42 == "lua" then
      return {"is", x, "nil"}
    else
      if type(x) == "table" then
        return {"let", "x", x, {"nil?", "x"}}
      else
        return {"or", {"is", {"typeof", x}, {"quote", "undefined"}}, {"is", x, "null"}}
      end
    end
  end
  setenv("nil?", stash33({["macro"] = nil63__macro}))
  local function hd__macro(l)
    return {"at", l, 0}
  end
  setenv("hd", stash33({["macro"] = hd__macro}))
  local function tl__macro(l)
    return {"cut", l, 1}
  end
  setenv("tl", stash33({["macro"] = tl__macro}))
  local function _37len__special(x)
    return "#(" .. compile(x) .. ")"
  end
  setenv("%len", stash33({["special"] = _37len__special}))
  local function len__macro(x)
    local __x258 = {"target"}
    __x258.lua = {"%len", x}
    __x258.js = {"or", {"get", x, {"quote", "length"}}, 0}
    return __x258
  end
  setenv("len", stash33({["macro"] = len__macro}))
  local function edge__macro(x)
    return {"-", {"len", x}, 1}
  end
  setenv("edge", stash33({["macro"] = edge__macro}))
  local function one63__macro(x)
    return {"is", {"len", x}, 1}
  end
  setenv("one?", stash33({["macro"] = one63__macro}))
  local function two63__macro(x)
    return {"is", {"len", x}, 2}
  end
  setenv("two?", stash33({["macro"] = two63__macro}))
  local function some63__macro(x)
    return {">", {"len", x}, 0}
  end
  setenv("some?", stash33({["macro"] = some63__macro}))
  local function none63__macro(x)
    return {"is", {"len", x}, 0}
  end
  setenv("none?", stash33({["macro"] = none63__macro}))
  local function isa__macro(x, y)
    local __x275 = {"target"}
    __x275.js = "typeof"
    __x275.lua = "type"
    return {"is", {__x275, x}, y}
  end
  setenv("isa", stash33({["macro"] = isa__macro}))
  local function list63__macro(x)
    local __x277 = {"target"}
    __x277.js = {"quote", "object"}
    __x277.lua = {"quote", "table"}
    return {"isa", x, __x277}
  end
  setenv("list?", stash33({["macro"] = list63__macro}))
  local function atom63__macro(x)
    return {"~list?", x}
  end
  setenv("atom?", stash33({["macro"] = atom63__macro}))
  local function bool63__macro(x)
    return {"isa", x, {"quote", "boolean"}}
  end
  setenv("bool?", stash33({["macro"] = bool63__macro}))
  local function num63__macro(x)
    return {"isa", x, {"quote", "number"}}
  end
  setenv("num?", stash33({["macro"] = num63__macro}))
  local function str63__macro(x)
    return {"isa", x, {"quote", "string"}}
  end
  setenv("str?", stash33({["macro"] = str63__macro}))
  local function fn63__macro(x)
    return {"isa", x, {"quote", "function"}}
  end
  setenv("fn?", stash33({["macro"] = fn63__macro}))
  local function compose__transformer(_x289)
    local __id35 = _x289[1]
    local _compose = __id35[1]
    local _fns = cut(__id35, 1)
    local _body25 = cut(_x289, 1)
    local _e10
    if #(_fns) == 0 then
      _e10 = join({"do"}, _body25)
    else
      local _e11
      if #(_fns) == 1 then
        _e11 = join(_fns, _body25)
      else
        _e11 = {join({_compose}, almost(_fns)), join({last(_fns)}, _body25)}
      end
      _e10 = _e11
    end
    return macroexpand(_e10)
  end
  setenv("compose", stash33({["transformer"] = compose__transformer}))
  local function complement__transformer(_x294)
    local __id37 = _x294[1]
    local _complement = __id37[1]
    local _form2 = __id37[2]
    local _body26 = cut(_x294, 1)
    local _e12
    if hd63(_form2, "complement") then
      _e12 = join({_form2[2]}, _body26)
    else
      _e12 = {"not", join({_form2}, _body26)}
    end
    return macroexpand(_e12)
  end
  setenv("complement", stash33({["transformer"] = complement__transformer}))
  return nil
end
if _x298 == nil then
  _x298 = true
  environment42 = {{}}
  target42 = "lua"
  keys42 = nil
end
function id(a, b)
  return a == b
end
function no(x)
  return x == nil or id(x, false)
end
function yes(x)
  return not no(x)
end
function obj63(x)
  return not( x == nil) and type(x) == "table"
end
function hd63(l, x)
  local _id41 = obj63(l)
  local _e15
  if _id41 then
    local _e16
    if type(x) == "function" then
      _e16 = x(l[1])
    else
      local _e17
      if x == nil then
        _e17 = l[1]
      else
        _e17 = l[1] == x
      end
      _e16 = _e17
    end
    _e15 = _e16
  else
    _e15 = _id41
  end
  return _e15
end
function complement(f)
  return function (...)
    local _args = unstash({...})
    return no(apply(f, _args))
  end
end
function idfn(x)
  return x
end
function compose(f, ...)
  local __r73 = unstash({...})
  local _fs = cut(__r73, 0)
  if f == nil then
    f = idfn
  end
  if #(_fs) == 0 then
    return f
  else
    local _g1 = apply(compose, _fs)
    return function (...)
      local _args1 = unstash({...})
      return f(apply(_g1, _args1))
    end
  end
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
  local _l7 = {}
  local j = 0
  local i = max(0, from)
  local to = min(#(x), upto)
  while i < to do
    _l7[j + 1] = x[i + 1]
    i = i + 1
    j = j + 1
  end
  local __l8 = x
  local _k3 = nil
  for _k3 in next, __l8 do
    local _v2 = __l8[_k3]
    if not( type(_k3) == "number") then
      _l7[_k3] = _v2
    end
  end
  return _l7
end
function keys(x)
  local _l9 = {}
  local __l10 = x
  local _k4 = nil
  for _k4 in next, __l10 do
    local _v3 = __l10[_k4]
    if not( type(_k4) == "number") then
      _l9[_k4] = _v3
    end
  end
  return _l9
end
function inner(x)
  return clip(x, 1, #(x) - 1)
end
function char(s, n)
  return clip(s, n, n + 1)
end
function code(s, n)
  local _e18
  if n then
    _e18 = n + 1
  end
  return string.byte(s, _e18)
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
  local _l11 = keys(l)
  local n = #(l) - 1
  local _i7 = 0
  while _i7 < #(l) do
    add(_l11, l[n - _i7 + 1])
    _i7 = _i7 + 1
  end
  return _l11
end
function reduce(f, x)
  local __e2 = #(x)
  if 0 == __e2 then
    return nil
  else
    if 1 == __e2 then
      return x[1]
    else
      return f(x[1], reduce(f, cut(x, 1)))
    end
  end
end
function join(...)
  local _ls = unstash({...})
  if #(_ls) == 2 then
    local _a1 = _ls[1]
    local _b1 = _ls[2]
    if _a1 and _b1 then
      local _c = {}
      local _o = #(_a1)
      local __l111 = _a1
      local _k5 = nil
      for _k5 in next, __l111 do
        local _v4 = __l111[_k5]
        _c[_k5] = _v4
      end
      local __l12 = _b1
      local _k6 = nil
      for _k6 in next, __l12 do
        local _v5 = __l12[_k6]
        if type(_k6) == "number" then
          _k6 = _k6 + _o
        end
        _c[_k6] = _v5
      end
      return _c
    else
      return _a1 or _b1 or {}
    end
  else
    return reduce(join, _ls) or {}
  end
end
function find(f, l)
  local __l13 = l
  local __i10 = nil
  for __i10 in next, __l13 do
    local _x304 = __l13[__i10]
    local _y = f(_x304)
    if _y then
      return _y
    end
  end
end
function first(f, l)
  local __x305 = l
  local __n10 = #(__x305)
  local __i11 = 0
  while __i11 < __n10 do
    local _x306 = __x305[__i11 + 1]
    local _y1 = f(_x306)
    if _y1 then
      return _y1
    end
    __i11 = __i11 + 1
  end
end
function in63(x, l)
  return find(function (_)
    return x == _
  end, l)
end
function pair(l)
  local _l121 = {}
  local _i12 = 0
  while _i12 < #(l) do
    add(_l121, {l[_i12 + 1], l[_i12 + 1 + 1]})
    _i12 = _i12 + 1
    _i12 = _i12 + 1
  end
  return _l121
end
function sort(l, f)
  table.sort(l, f)
  return l
end
function map(f, x)
  local _l14 = {}
  local __x308 = x
  local __n11 = #(__x308)
  local __i13 = 0
  while __i13 < __n11 do
    local _v6 = __x308[__i13 + 1]
    local _y2 = f(_v6)
    if not( _y2 == nil) then
      add(_l14, _y2)
    end
    __i13 = __i13 + 1
  end
  local __l15 = x
  local _k7 = nil
  for _k7 in next, __l15 do
    local _v7 = __l15[_k7]
    if not( type(_k7) == "number") then
      local _y3 = f(_v7)
      if not( _y3 == nil) then
        _l14[_k7] = _y3
      end
    end
  end
  return _l14
end
function keep(f, x)
  return map(function (_)
    if f(_) then
      return _
    end
  end, x)
end
function keys63(l)
  local __l16 = l
  local _k8 = nil
  for _k8 in next, __l16 do
    local _v8 = __l16[_k8]
    if not( type(_k8) == "number") then
      return true
    end
  end
  return false
end
function empty63(l)
  local __l17 = l
  local __i16 = nil
  for __i16 in next, __l17 do
    local _x309 = __l17[__i16]
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
    local __l18 = keys42
    local _k9 = nil
    for _k9 in next, __l18 do
      local _v9 = __l18[_k9]
      args[_k9] = _v9
    end
    keys42 = nil
  end
  return args
end
function search(s, pattern, start)
  local _e19
  if start then
    _e19 = start + 1
  end
  local start = _e19
  local i = string.find(s, pattern, start, true)
  return i and i - 1
end
function split(s, sep)
  if s == "" or sep == "" then
    return {}
  else
    local _l19 = {}
    local _n16 = #(sep)
    while true do
      local _i18 = search(s, sep)
      if _i18 == nil then
        break
      else
        add(_l19, clip(s, 0, _i18))
        s = clip(s, _i18 + _n16)
      end
    end
    add(_l19, s)
    return _l19
  end
end
function cat(...)
  local _xs1 = unstash({...})
  return reduce(function (_0, _1)
    return _0 .. _1
  end, _xs1) or ""
end
function _43(...)
  local _xs2 = unstash({...})
  return reduce(function (_0, _1)
    return _0 + _1
  end, _xs2) or 0
end
function _42(...)
  local _xs3 = unstash({...})
  return reduce(function (_0, _1)
    return _0 * _1
  end, _xs3) or 1
end
function _(...)
  local _xs4 = unstash({...})
  return reduce(function (_0, _1)
    return _1 - _0
  end, rev(_xs4)) or 0
end
function _47(...)
  local _xs5 = unstash({...})
  return reduce(function (_0, _1)
    return _1 / _0
  end, rev(_xs5)) or 1
end
function _37(...)
  local _xs6 = unstash({...})
  return reduce(function (_0, _1)
    return _1 % _0
  end, rev(_xs6)) or 1
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
  local _n17 = #(s)
  local _i19 = 0
  while _i19 < _n17 do
    if not number_code63(code(s, _i19)) then
      return false
    end
    _i19 = _i19 + 1
  end
  return true
end
function escape(s)
  local s1 = "\""
  local _i20 = 0
  while _i20 < #(s) do
    local c = char(s, _i20)
    local __e3 = c
    local _e20
    if "\n" == __e3 then
      _e20 = "\\n"
    else
      local _e21
      if "\"" == __e3 then
        _e21 = "\\\""
      else
        local _e22
        if "\\" == __e3 then
          _e22 = "\\\\"
        else
          _e22 = c
        end
        _e21 = _e22
      end
      _e20 = _e21
    end
    s1 = s1 .. _e20
    _i20 = _i20 + 1
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
                      local _s = "("
                      local _sp = ""
                      local _fs1 = {}
                      local _xs7 = {}
                      local _ks = {}
                      local _stack = stack or {}
                      add(_stack, x)
                      local __l20 = x
                      local _k10 = nil
                      for _k10 in next, __l20 do
                        local _v10 = __l20[_k10]
                        if type(_k10) == "number" then
                          _xs7[_k10 + 1] = str(_v10, _stack)
                        else
                          if type(_v10) == "function" then
                            add(_fs1, _k10)
                          else
                            add(_ks, _k10 .. ":")
                            add(_ks, str(_v10, _stack))
                          end
                        end
                      end
                      drop(_stack)
                      local __l21 = join(sort(_fs1), _xs7, _ks)
                      local __i22 = nil
                      for __i22 in next, __l21 do
                        local _v11 = __l21[__i22]
                        _s = _s .. _sp .. _v11
                        _sp = " "
                      end
                      return _s .. ")"
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
  local __r124 = unstash({...})
  local _keys = cut(__r124, 0)
  if type(k) == "string" then
    local _e23
    if _keys.toplevel then
      _e23 = environment42[1]
    else
      _e23 = last(environment42)
    end
    local _frame = _e23
    local _entry = _frame[k] or {}
    local __l22 = _keys
    local _k11 = nil
    for _k11 in next, __l22 do
      local _v12 = __l22[_k11]
      _entry[_k11] = _v12
    end
    _frame[k] = _entry
    return _frame[k]
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
