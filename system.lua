local function call_w47file(f, file)
  local h,e = file
  if not h then
    error(e)
  end
  local x = f(h)
  h.close(h)
  return(x)
end
local function read_file(path)
  return(call_w47file(function (f)
    return(f.read(f, "*a"))
  end, io.open(path)))
end
local function write_file(path, data)
  return(call_w47file(function (f)
    return(f.write(f, data))
  end, io.open(path, "w")))
end
local function file_exists63(path)
  return(call_w47file(function (f)
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
local _e1
if arg == nil then
  _e1 = {}
else
  local l = {}
  local i = 0
  while i < #(arg) do
    add(l, arg[i + 1])
    i = i + 1
  end
  _e1 = l
end
local argv = _e1
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
