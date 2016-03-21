if setfenv then
  _G._require = require
  setfenv(1, setmetatable({}, {__newindex = _G, __index = _G}))
  luvit63 = not( require == _G._require)
  require = _G._require
end
require("elf")
reader = require("reader")
compiler = require("compiler")
system = require("system")
local function to_string(l)
  local s = ""
  local sep
  local _x = l
  local _n = #(_x)
  local _i = 0
  while _i < _n do
    local x = _x[_i + 1]
    if sep then
      s = s .. sep
    else
      sep = " "
    end
    s = s .. str(x)
    _i = _i + 1
  end
  return(s)
end
if pp == nil then
  function pp(...)
    local xs = unstash({...})
    return(print(to_string(xs)))
  end
end
local function eval_print(form)
  compiler.reset()
  if not( form == nil) then
    local _x5 = nil
    local _msg1 = nil
    local _trace1 = nil
    local _e
    if xpcall(function ()
      _x5 = compiler.eval(form)
      return(_x5)
    end, function (_)
      _msg1 = clip(_, search(_, ": ") + 2)
      _trace1 = debug.traceback()
      return(_trace1)
    end) then
      _e = {true, _x5}
    else
      _e = {false, _msg1, _trace1}
    end
    local _id = _e
    local ok = _id[1]
    local x = _id[2]
    local trace = _id[3]
    if not ok then
      print("error: " .. x .. "\n" .. trace)
      return
    end
    thatexpr = form
    that = x
    if not( x == nil) then
      return(pp(x))
    end
  end
end
local function rep(s)
  return(eval_print(reader["read-string"](s)))
end
function repl()
  local buf = ""
  local function rep1(s)
    buf = buf .. s
    local more = {}
    local form = reader["read-string"](buf, more)
    if not( form == more) then
      eval_print(form)
      buf = ""
      return(system.write("> "))
    end
  end
  system.write("> ")
  if process then
    return(process.stdin.on(process.stdin, "data", rep1))
  else
    while true do
      local s = io.read()
      if s then
        rep1(s .. "\n")
      else
        break
      end
    end
  end
end
local function skip_shebang(s)
  if s then
    if not str_starts63(s, "#!") then
      return(s)
    end
    local i = search(s, "\n")
    if i then
      return(clip(s, i + 1))
    else
      return("")
    end
  end
end
function compile_string(s)
  compiler.reset()
  local body = reader["read-all"](skip_shebang(s))
  local form = compiler.expand(join({"do"}, body))
  local _do = compiler.compile(form, stash33({stmt = true}))
  compiler.reset()
  return(_do)
end
function compile_file(path)
  return(compile_string(system["read-file"](path)))
end
function load(path)
  return(compiler.run(compile_file(path)))
end
local function run_file(path)
  return(compiler.run(system["read-file"](path)))
end
function elf_usage()
  print("usage: elf [options] <object files>")
  print("options:")
  print("  -c <input>\tCompile input file")
  print("  -o <output>\tOutput file")
  print("  -t <target>\tTarget language (default: lua)")
  print("  -e <expr>\tExpression to evaluate")
  return(system.exit())
end
local function elf_file63(path)
  local _id2 = str_ends63(path, ".e")
  local _e4
  if _id2 then
    _e4 = _id2
  else
    local _id3 = system["file-exists?"](path)
    local _e6
    if _id3 then
      local s = system["read-file"](path)
      local _e7
      if s then
        local bang = clip(s, 0, search(s, "\n"))
        _e7 = str_starts63(bang, "#!") and search(bang, "elf")
      end
      _e6 = _e7
    else
      _e6 = _id3
    end
    _e4 = _e6
  end
  return(_e4)
end
local function script_file63(path)
  return(str_ends63(path, "." .. "lua"))
end
function elf_main()
  local arg = system.argv[1]
  if arg then
    if in63(arg, {"-h", "--help"}) then
      elf_usage()
    end
    if elf_file63(arg) then
      system.argv = cut(system.argv, 1)
      load(arg)
      return
    end
    if script_file63(arg) then
      system.argv = cut(system.argv, 1)
      run_file(arg)
      return
    end
  end
  local pre = {}
  local input = nil
  local output = nil
  local target1 = nil
  local expr = nil
  local argv = system.argv
  local n = #(argv)
  local i = 0
  while i < n do
    local a = argv[i + 1]
    if a == "-c" or a == "-o" or a == "-t" or a == "-e" then
      if i == n - 1 then
        print("missing argument for " .. a)
      else
        i = i + 1
        local val = argv[i + 1]
        if a == "-c" then
          input = val
        else
          if a == "-o" then
            output = val
          else
            if a == "-t" then
              target1 = val
            else
              if a == "-e" then
                expr = val
              end
            end
          end
        end
      end
    else
      if not( "-" == char(a, 0)) then
        add(pre, a)
      end
    end
    i = i + 1
  end
  local _x10 = pre
  local _n1 = #(_x10)
  local _i1 = 0
  while _i1 < _n1 do
    local file = _x10[_i1 + 1]
    run_file(file)
    _i1 = _i1 + 1
  end
  if input == nil then
    if expr then
      return(rep(expr))
    else
      return(repl())
    end
  else
    if target1 then
      target42 = target1
    end
    local code = compile_file(input)
    if output == nil or output == "-" then
      return(print(code))
    else
      return(system["write-file"](output, code))
    end
  end
end
function str_starts63(str, x)
  if #(x) > #(str) then
    return(false)
  else
    return(x == clip(str, 0, #(x)))
  end
end
function str_ends63(str, x)
  if #(x) > #(str) then
    return(false)
  else
    return(x == clip(str, #(str) - #(x)))
  end
end
function import33(module)
  local _e8
  if type(module) == "string" then
    _e8 = require(module)
  else
    _e8 = module
  end
  import37 = _e8
  local e = {"do"}
  local _l = module
  local k = nil
  for k in next, _l do
    local v = _l[k]
    add(e, {"def", k, {"get", "import%", {"quote", k}}})
  end
  compiler.eval(e)
  local _do1 = import37
  import37 = nil
  return(_do1)
end
if _x15 == nil then
  _x15 = true
  elf_main()
end
