local function read_file(path)
  local f,e = io.open(path)
  if not f then
    error(e)
  end
  local s = f.read(f, "*a")
  f.close(f)
  return(s)
end
local function write_file(path, data)
  local f,e = io.open(path, "w")
  if not f then
    error(e)
  end
  local s = f.write(f, data)
  f.close(f)
  return(s)
end
local function file_exists63(path)
  local f = io.open(path)
  if not( f == nil) then
    f.close(f)
  end
  return(not( f == nil))
end
local path_separator = char(_G.package.config, 0)
local function get_environment_variable(name)
  return(os.getenv(name))
end
local function write(x)
  return(io.write(x))
end
local function exit(code)
  return(os.exit(code))
end
local _e
if arg == nil then
  _e = {}
else
  _e = cut(arg, 0)
end
local argv = _e
local function shell(cmd)
  local x = io.popen(cmd)
  return(x.read(x, "*a"))
end
local function path_join(...)
  local parts = unstash({...})
  return(reduce(function (_0, _1)
    return(_0 .. path_separator .. _1)
  end, parts) or "")
end
local function reload(module)
  package.loaded[module] = nil
  return(require(module))
end
local getenv = get_environment_variable
return({["write-file"] = write_file, write = write, ["path-separator"] = path_separator, ["read-file"] = read_file, argv = argv, ["get-environment-variable"] = get_environment_variable, reload = reload, ["path-join"] = path_join, ["file-exists?"] = file_exists63, exit = exit, shell = shell, getenv = getenv})
