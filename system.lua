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
  local __id = {io.open(path)}
  local _f = __id[1]
  local _e = __id[2]
  if not _f then
    error(_e)
  end
  local _s = _f.read(_f, "*a")
  _f.close(_f)
  return _s
end
local function write_file(path, data)
  local __id1 = {io.open(path, "w")}
  local _f1 = __id1[1]
  local _e1 = __id1[2]
  if not _f1 then
    error(_e1)
  end
  local _s1 = _f1.write(_f1, data)
  _f1.close(_f1)
  return _s1
end
local function file_exists63(path)
  local _f2 = io.open(path)
  if not( _f2 == nil) then
    _f2.close(_f2)
  end
  return not( _f2 == nil)
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
  local _e2
  if args then
    _e2 = cut(args, 1)
  end
  argv = _e2
end
if argv == nil then
  argv = {}
end
argv = cut(argv, 0)
local function shell(cmd)
  local _x4 = io.popen(cmd)
  return _x4.read(_x4, "*a")
end
local function path_join(...)
  local _parts = unstash({...})
  return reduce(function (_0, _1)
    return _0 .. path_separator .. _1
  end, _parts) or ""
end
local function reload(module)
  package.loaded[module] = nil
  return require(module)
end
local getenv = get_environment_variable
return {["path-join"] = path_join, ["get-environment-variable"] = get_environment_variable, ["read-file"] = read_file, ["path-separator"] = path_separator, ["file-exists?"] = file_exists63, ["reload"] = reload, ["exit"] = exit, ["shell"] = shell, ["argv"] = argv, ["write"] = write, ["write-file"] = write_file, ["getenv"] = getenv}
