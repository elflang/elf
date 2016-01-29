#!/usr/bin/env luajit
if elf42 == nil then
  elf42 = true
  package.path = package.path .. ";" .. (debug.getinfo(1, "S").source.match(debug.getinfo(1, "S").source, "[@]?(.*/)[^/]+[.]lua") or "./") .. "?.lua"
end
require("elf")
reader = require("reader")
compiler = require("compiler")
system = require("system")
local function eval_print(form)
  local _x = nil
  local _msg = nil
  local _trace = nil
  local _e
  if xpcall(function ()
    _x = compiler.eval(form)
    return(_x)
  end, function (m)
    _msg = clip(m, search(m, ": ") + 2)
    _trace = debug.traceback()
    return(_trace)
  end) then
    _e = {true, _x}
  else
    _e = {false, _msg, _trace}
  end
  local _id = _e
  local ok = _id[1]
  local x = _id[2]
  local trace = _id[3]
  if not ok then
    return(print("error: " .. x .. "\n" .. trace))
  else
    if is63(x) then
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
function compile_file(path)
  local s = reader.stream(system["read-file"](path))
  local body = reader["read-all"](s)
  local form = compiler.expand(join({"do"}, body))
  return(compiler.compile(form, {_stash = true, stmt = true}))
end
function load(path)
  return(compiler.run(compile_file(path)))
end
local function run_file(path)
  return(compiler.run(system["read-file"](path)))
end
local function usage()
  print("usage: elf [options] <object files>")
  print("options:")
  print("  -c <input>\tCompile input file")
  print("  -o <output>\tOutput file")
  print("  -t <target>\tTarget language (default: lua)")
  print("  -e <expr>\tExpression to evaluate")
  return(system.exit())
end
local function main()
  local arg = hd(system.argv)
  if arg == "-h" or arg == "--help" then
    usage()
  end
  local pre = {}
  local input = nil
  local output = nil
  local target1 = nil
  local expr = nil
  local argv = system.argv
  local n = _35(argv)
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
  local _x4 = pre
  local _n = _35(_x4)
  local _i = 0
  while _i < _n do
    local file = _x4[_i + 1]
    run_file(file)
    _i = _i + 1
  end
  if nil63(input) then
    if expr then
      return(rep(expr))
    else
      return(repl())
    end
  else
    if target1 then
      target = target1
    end
    local code = compile_file(input)
    if nil63(output) or output == "-" then
      return(print(code))
    else
      return(system["write-file"](output, code))
    end
  end
end
if _x5 == nil then
  _x5 = true
  main()
end
