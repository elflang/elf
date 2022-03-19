if luvit63 then
  uv = require("uv")
  luvi = require("luvi")
  pp = require("pretty-print").prettyPrint
  utils = require("utils")
  function luvit_require(path, file)
    return require("require")(path)(file)
  end
end
local function read_file(path)
  local f,e = io.open(path)
  if not f then
    error(e)
  end
  local s = f.read(f, "*a")
  f.close(f)
  return s
end
local function write_file(path, data)
  local f,e = io.open(path, "w")
  if not f then
    error(e)
  end
  local s = f.write(f, data)
  f.close(f)
  return s
end
local function file_exists63(path)
  local f = io.open(path)
  if not( f == nil) then
    f.close(f)
  end
  return not( f == nil)
end
local path_separator = char(_G.package.config or "/", 0)
local function get_environment_variable(name)
  return os.getenv(name)
end
local write
if uv then
  write = function (_)
    uv.write(process.stdout.handle, _)
    return nil
  end
else
  write = function (_)
    io.write(_)
    return nil
  end
end
local function exit(code)
  return os.exit(code)
end
local argv = arg
if argv == nil then
  local _e
  if args then
    _e = cut(args, 1)
  end
  argv = _e
end
if argv == nil then
  argv = {}
end
argv = cut(argv, 0)
local function shell(cmd)
  local x = io.popen(cmd)
  return x.read(x, "*a")
end
local function path_join(...)
  local parts = unstash({...})
  return reduce(function (_0, _1)
    return _0 .. path_separator .. _1
  end, parts) or ""
end
local function reload(module)
  package.loaded[module] = nil
  return require(module)
end
local getenv = get_environment_variable
return {["path-join"] = path_join, ["get-environment-variable"] = get_environment_variable, ["read-file"] = read_file, ["path-separator"] = path_separator, ["file-exists?"] = file_exists63, ["reload"] = reload, ["exit"] = exit, ["shell"] = shell, ["argv"] = argv, ["write"] = write, ["write-file"] = write_file, ["getenv"] = getenv}
