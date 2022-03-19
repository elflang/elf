;; -*- mode: lisp -*-

(%js

  (use fs path child_process)

  (var read-file (path)
    (fs.readFileSync path 'utf8))

  (var write-file (path data)
    (fs.writeFileSync path data 'utf8))

  (var file-exists? (path)
    (fs.existsSync path 'utf8))

  (var path-separator path.sep)

  (var get-environment-variable (name)
    (get process.env name))

  (var write (x)
    (process.stdout.write x))

  (var exit (code)
    (process.exit code))

  (var argv
    (cut process.argv 2))

  (var shell (cmd)
    (let x (child_process.execSync cmd)
      (x.toString))))

(%lua

  (when luvit?
    (def uv (require 'uv))
    (def luvi (require 'luvi))
    (def pp (require 'pretty-print).prettyPrint)
    (def utils (require 'utils))
    (def luvit-require (path file)
      (require 'require)(path)(file)))

  (var read-file (path)
    (let ((f e) (list (io.open path)))
      (unless f (error e))
      (with s (f.read f "*a")
        (f.close f))))

  (var write-file (path data)
    (let ((f e) (list (io.open path "w")))
      (unless f (error e))
      (with s (f.write f data)
        (f.close f))))

  (var file-exists? (path)
    (let f (io.open path)
      (if (~nil? f) (f.close f))
      (~nil? f)))

  (var path-separator (char (or _G.package.config "/") 0))

  (var get-environment-variable (name)
    (os.getenv name))

  (var write)
  (if uv
    (= write [do (uv.write process.stdout.handle _) nil])
    (= write [do (io.write _) nil]))

  (var exit (code)
    (os.exit code))

  (var argv arg)
  (if (nil? argv) (= argv (if args (cut args 1))))
  (if (nil? argv) (= argv ()))
  (= argv (cut argv 0))

  (var shell (cmd)
    (let x (io.popen cmd)
      (x.read x "*a"))))

(var path-join parts
  (or (reduce [cat _0 path-separator _1] parts) ""))

(var reload (module)
  (%lua (wipe (get package.loaded module)))
  (%js (wipe (get require.cache (require.resolve module))))
  (require module))

(var getenv get-environment-variable)

(export read-file
        write-file
        file-exists?
        path-separator
        path-join
        getenv get-environment-variable 
        write
        exit
        argv
        shell
        reload)
