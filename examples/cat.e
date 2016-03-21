#!/usr/bin/env elf

(import! system)

(step path argv
  (write (read-file path)))

