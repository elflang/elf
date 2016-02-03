local function call_with_file(f, file)
  local h,e = file
  if not h then
    error(e)
  end
  local x = f(h)
  h.close(h)
  return(x)
end
local function read_file(path)
  return(call_with_file(function (f)
    return(f.read(f, "*a"))
  end, io.open(path)))
end
local function write_file(path, data)
  return(call_with_file(function (f)
    return(f.write(f, data))
  end, io.open(path, "w")))
end
local function file_exists63(path)
  return(call_with_file(function (f)
    return(not( f == nil))
  end, io.open(path)))
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
  local _l = {}
  local i = 0
  while i < #(arg) do
    add(_l, arg[i + 1])
    i = i + 1
  end
  _e = _l
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
return({["write-file"] = write_file, write = write, ["read-file"] = read_file, argv = argv, exit = exit, reload = reload, ["path-join"] = path_join, ["get-environment-variable"] = get_environment_variable, ["path-separator"] = path_separator, shell = shell, ["file-exists?"] = file_exists63})
