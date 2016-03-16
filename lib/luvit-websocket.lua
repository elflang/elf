local path = luvi.path.join(system.getenv("ELF_HOME"), "libs", "luvit-websocket", "libs")
local r = require("require")(path)
return {
  createServer = r("server"),
}
-- usage:
--
--  local ws = require("luvit-websocket").createServer(31892)
--  ws:on("data", function(client, message) print(message) end)

