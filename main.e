;; -*- mode: lisp -*-

;; luvit fix.
(%lua
  (when setfenv
    (assign _G._require require)
    (setfenv 1 (setmetatable (obj) (obj __newindex: _G __index: _G)))
    (assign luvit? (~is require _G._require))
    (assign require _G._require)))

(elf)

(lib reader compiler system)

(var to-string (l)
  (with s ""
    (var sep)
    (step x l
      (if sep (cat! s sep) (= sep " "))
      (cat! s (str x)))))

(when (nil? pp)
  (def pp xs
    (print (to-string xs))))

(var eval-print (form)
  (compiler.reset)
  (unless (nil? form)
    (let ((ok x trace) (guard (compiler.eval form)))
      (unless ok
        (%js (print trace))
        (%lua (print (cat "error: " x "\n" trace)))
        (return))
      (def thatexpr form)
      (def that x)
      (unless (nil? x)
        (pp x)))))

(var rep (s)
  (eval-print (reader.read-string s)))

(def repl ()
  (let buf ""
    (var rep1 (s)
      (cat! buf s)
      (let (more () form (reader.read-string buf more))
          (unless (is form more)
            (eval-print form)
            (= buf "")
            (system.write "> ")))))
  (system.write "> ")
  (%js
    (let in process.stdin
      (in.setEncoding 'utf8)
      (in.on 'data rep1)))
  (%lua
    (if process
        (process.stdin.on process.stdin 'data rep1)
      (while t
        (let s (io.read)
          (if s (rep1 (cat s "\n"))
            (break)))))))

(var skip-shebang (s)
  (when s
    (unless (str-starts? s "#!")
      (return s))
    (iflet i (search s "\n")
      (clip s (+ i 1))
      "")))

(def compile-string (s)
  (compiler.reset)
  (var body (reader.read-all (skip-shebang s)))
  (var form (compiler.expand `(do ,@body)))
  (do1 (compiler.compile form :stmt)
    (compiler.reset)))

(def compile-file (path)
  (compile-string (system.read-file path)))

(def load (path)
  (compiler.run (compile-file path)))

(var run-file (path)
  (compiler.run (system.read-file path)))

(def elf-usage ()
  (print "usage: elf [options] <object files>")
  (print "options:")
  (print "  -c <input>\tCompile input file")
  (print "  -o <output>\tOutput file")
  (print "  -t <target>\tTarget language (default: lua)")
  (print "  -e <expr>\tExpression to evaluate")
  (system.exit))

(var elf-file? (path)
  (or (str-ends? path ".e")
      (and (system.file-exists? path)
           (whenlet s (system.read-file path)
             (let bang (clip s 0 (search s "\n"))
               (and (str-starts? bang "#!") (search bang "elf")))))))

(var script-file? (path)
  (str-ends? path (cat "." (language))))

(def elf-main ()
  (whenlet arg system.argv.0
    (when (in? arg '(-h --help))
      (elf-usage))
    (when (elf-file? arg)
      (= system.argv (cut system.argv 1))
      (load arg)
      (return))
    (when (script-file? arg)
      (= system.argv (cut system.argv 1))
      (run-file arg)
      (return)))
  (let (pre ()
        input nil
        output nil
        target1 nil
        expr nil
        argv system.argv
        n #argv)
    (for i n
      (let a (at argv i)
        (if (or (is a "-c") (is a "-o") (is a "-t") (is a "-e"))
            (if (is i (- n 1))
                (print (cat "missing argument for " a))
              (do (++ i)
                  (let val (at argv i)
                    (if (is a "-c") (= input val)
                        (is a "-o") (= output val)
                        (is a "-t") (= target1 val)
                        (is a "-e") (= expr val)))))
            (~is "-" (char a 0)) (add pre a))))
    (step file pre
      (run-file file))
    (if (nil? input) (if expr (rep expr) (repl))
      (do (if target1 (= target* target1))
          (let code (compile-file input)
            (if (or (nil? output) (is output "-"))
                (print code)
              (system.write-file output code)))))))

;; utilities

(def str-starts? (str x)
  (if (> #x #str) false
    (is x (clip str 0 #x))))

(def str-ends? (str x)
  (if (> #x #str) false
    (is x (clip str (- #str #x)))))

(def import! (module)
  (= import% (if (str? module) (require module) module))
  (let e `(do)
    (each (k v) module
      (add e `(def ,k (get import% ',k))))
    (compiler.eval e))
  (do1 import%
    (wipe import%)))

(once
  (elf-main))

