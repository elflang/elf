require("elf")
reader = require("reader")
compiler = require("compiler")
system = require("system")
local function eval_print(form)
  if not( form == nil) then
    local _x3 = nil
    local _msg1 = nil
    local _trace1 = nil
    local _e
    if xpcall(function ()
      _x3 = compiler.eval(form)
      return(_x3)
    end, function (_)
      _msg1 = clip(_, search(_, ": ") + 2)
      _trace1 = debug.traceback()
      return(_trace1)
    end) then
      _e = {true, _x3}
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
      return(print(str(x)))
    end
  end
end
local function rep(s)
  return(eval_print(reader["read-string"](s)))
end
local function repl()
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
  while true do
    local s = io.read()
    if s then
      rep1(s .. "\n")
    else
      break
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
  local body = reader["read-all"](skip_shebang(s))
  local form = compiler.expand(join({"do"}, body))
  return(compiler.compile(form, stash33({stmt = true})))
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
  return(str_ends63(path, ".elf"))
end
function elf_main()
  local _y = system.argv[1]
  if _y then
    local arg = _y
    if in63(arg, {"-h", "--help"}) then
      elf_usage()
    end
    if elf_file63(arg) then
      system.argv = cut(system.argv, 1)
      load(arg)
      system.exit()
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
  local _x8 = pre
  local _n = #(_x8)
  local _i = 0
  while _i < _n do
    local file = _x8[_i + 1]
    run_file(file)
    _i = _i + 1
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
  local _e1
  if type(module) == "string" then
    _e1 = require(module)
  else
    _e1 = module
  end
  import37 = _e1
  local e = {"do"}
  local _l = module
  local k = nil
  for k in next, _l do
    local v = _l[k]
    add(e, {"def", k, {"get", "import%", {"quote", k}}})
  end
  eval(e)
  local x = import37
  import37 = nil
  return(x)
end
if _x13 == nil then
  _x13 = true
  elf_main()
end
