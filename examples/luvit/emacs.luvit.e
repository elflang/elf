#!/usr/bin/env elf

(def srv* require("luvit-websocket").createServer(31820))

(srv*.on srv* "connect"
  [pp "Connected:" _])

(srv*.on srv* "disconnect"
  [pp "Disconnected:" _])

(srv*.on srv* "data"
  (fn (client data)
    (print data)
    (system.write "> ")))

(def el-eval strs
  (let s (apply cat strs)
    ;(pp 'el-eval s)
    (srv*.clients.-1.send srv*.clients.-1 s)))

(def el-print (message)
  (el-eval "(message \"%s\" " (str message) ")"))

(repl)

