#!/usr/bin/env elf

(var http (require "http"))

(var options (obj host: "luvit.io" port: 80 path: "/"))

(var req (http.request options (fn (res)
  (res.on res "data" (fn (chunk)
    (p "ondata" (obj chunk: chunk)))))))

req.done(req)


