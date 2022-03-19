if setfenv then
  _G._require = require
  setfenv(1, setmetatable({}, {["__newindex"] = _G, ["__index"] = _G}))
  luvit63 = not( require == _G._require)
  require = _G._require
end
require("elf")
reader = require("reader")
compiler = require("compiler")
system = require("system")
local function to_string(l)
  local _s = ""
  local sep
  local __x = l
  local __n = #(__x)
  local __i = 0
  while __i < __n do
    local _x1 = __x[__i + 1]
    if sep then
      _s = _s .. sep
    else
      sep = " "
    end
    _s = _s .. str(_x1)
    __i = __i + 1
  end
  return _s
end
if pp == nil then
  function pp(...)
    local _xs = unstash({...})
    return print(to_string(_xs))
  end
end
local function eval_print(form)
  compiler.reset()
  if not( form == nil) then
    local __x6 = nil
    local __msg1 = nil
    local __trace1 = nil
    local _e1
    if xpcall(function ()
      __x6 = compiler.eval(form)
      return __x6
    end, function (_)
      __msg1 = clip(_, search(_, ": ") + 2)
      __trace1 = debug.traceback()
      return __trace1
    end) then
      _e1 = {true, __x6}
    else
      _e1 = {false, __msg1, __trace1}
    end
    local __id = _e1
    local _ok = __id[1]
    local _x9 = __id[2]
    local _trace2 = __id[3]
    if not _ok then
      print("error: " .. _x9 .. "\n" .. _trace2)
      return
    end
    thatexpr = form
    that = _x9
    if not( _x9 == nil) then
      return pp(_x9)
    end
  end
end
local function rep(s)
  return eval_print(reader["read-string"](s))
end
function repl()
  local _buf = ""
  local function rep1(s)
    _buf = _buf .. s
    local _more = {}
    local _form = reader["read-string"](_buf, _more)
    if not( _form == _more) then
      eval_print(_form)
      _buf = ""
      return system.write("> ")
    end
  end
  system.write("> ")
  if process then
    return process.stdin.on(process.stdin, "data", rep1)
  else
    while true do
      local _s1 = io.read()
      if _s1 then
        rep1(_s1 .. "\n")
      else
        break
      end
    end
  end
end
local function skip_shebang(s)
  if s then
    if not str_starts63(s, "#!") then
      return s
    end
    local _i1 = search(s, "\n")
    if _i1 then
      return clip(s, _i1 + 1)
    else
      return ""
    end
  end
end
function compile_string(s)
  compiler.reset()
  local body = reader["read-all"](skip_shebang(s))
  local form = compiler.expand(join({"do"}, body))
  local __do = compiler.compile(form, stash33({["stmt"] = true}))
  compiler.reset()
  return __do
end
function compile_file(path)
  return compile_string(system["read-file"](path))
end
function load(path)
  return compiler.run(compile_file(path))
end
local function run_file(path)
  return compiler.run(system["read-file"](path), path)
end
function elf_usage()
  print("usage: elf [options] <object files>")
  print("options:")
  print("  -c <input>\tCompile input file")
  print("  -o <output>\tOutput file")
  print("  -t <target>\tTarget language (default: lua)")
  print("  -e <expr>\tExpression to evaluate")
  return system.exit()
end
local function elf_file63(path)
  local _id2 = str_ends63(path, ".e")
  local _e5
  if _id2 then
    _e5 = _id2
  else
    local _id3 = system["file-exists?"](path)
    local _e7
    if _id3 then
      local _s2 = system["read-file"](path)
      local _e8
      if _s2 then
        local _bang = clip(_s2, 0, search(_s2, "\n"))
        _e8 = str_starts63(_bang, "#!") and search(_bang, "elf")
      end
      _e7 = _e8
    else
      _e7 = _id3
    end
    _e5 = _e7
  end
  return _e5
end
local function script_file63(path)
  return str_ends63(path, "." .. "lua")
end
function elf_main()
  local _arg = system.argv[1]
  if _arg then
    if in63(_arg, {"-h", "--help"}) then
      elf_usage()
    end
    if elf_file63(_arg) then
      system.argv = cut(system.argv, 1)
      load(_arg)
      return
    end
    if script_file63(_arg) then
      system.argv = cut(system.argv, 1)
      run_file(_arg)
      return
    end
  end
  local _pre = {}
  local _input = nil
  local _output = nil
  local _target1 = nil
  local _expr = nil
  local _argv = system.argv
  local _n1 = #(_argv)
  local _i2 = 0
  while _i2 < _n1 do
    local _a = _argv[_i2 + 1]
    if _a == "-c" or _a == "-o" or _a == "-t" or _a == "-e" then
      if _i2 == _n1 - 1 then
        print("missing argument for " .. _a)
      else
        _i2 = _i2 + 1
        local _val = _argv[_i2 + 1]
        if _a == "-c" then
          _input = _val
        else
          if _a == "-o" then
            _output = _val
          else
            if _a == "-t" then
              _target1 = _val
            else
              if _a == "-e" then
                _expr = _val
              end
            end
          end
        end
      end
    else
      if not( "-" == char(_a, 0)) then
        add(_pre, _a)
      end
    end
    _i2 = _i2 + 1
  end
  local __x12 = _pre
  local __n2 = #(__x12)
  local __i3 = 0
  while __i3 < __n2 do
    local _file = __x12[__i3 + 1]
    run_file(_file)
    __i3 = __i3 + 1
  end
  if _input == nil then
    if _expr then
      return rep(_expr)
    else
      return repl()
    end
  else
    if _target1 then
      target42 = _target1
    end
    local _code = compile_file(_input)
    if _output == nil or _output == "-" then
      return print(_code)
    else
      return system["write-file"](_output, _code)
    end
  end
end
function str_starts63(str, x)
  if #(x) > #(str) then
    return false
  else
    return x == clip(str, 0, #(x))
  end
end
function str_ends63(str, x)
  if #(x) > #(str) then
    return false
  else
    return x == clip(str, #(str) - #(x))
  end
end
function import33(module)
  local _e9
  if type(module) == "string" then
    _e9 = require(module)
  else
    _e9 = module
  end
  import37 = _e9
  local _e = {"do"}
  local __l = module
  local _k = nil
  for _k in next, __l do
    local _v = __l[_k]
    add(_e, {"def", _k, {"get", "import%", {"quote", _k}}})
  end
  compiler.eval(_e)
  local __do1 = import37
  import37 = nil
  return __do1
end
if _x17 == nil then
  _x17 = true
  elf_main()
end
