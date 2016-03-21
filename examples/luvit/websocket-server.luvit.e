#!/usr/bin/env elf

(def srv* require("luvit-websocket").createServer(31820))

(srv*.on srv* "connect"
  [pp "Connected:" _])

(srv*.on srv* "disconnect"
  [pp "Disconnected:" _])

(srv*.on srv* "data"
  (fn (client data)
    (pp "Data:" client data)))


