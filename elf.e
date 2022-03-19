;; -*- mode: lisp -*-

(var setup ()

  (defsym t true)
  (defsym js? (is target* 'js))
  (defsym lua? (is target* 'lua))
  (defsym global* (target lua: _G js: (if (nil? global) window global)))

  (mac %compile-time forms
    (compiler.eval `(do ,@forms))
    nil)

  (mac when-compiling body
    (compiler.eval `(do ,@body)))

  (mac during-compilation body
    (with form `(do ,@body)
      (compiler.eval form)))

  (mac %js forms (if js? `(do ,@forms)))
  (mac %lua forms (if lua? `(do ,@forms)))

  (mac quote (form)
    (quoted form))

  (mac quasiquote (form)
    (quasiexpand form 1))

  (mac at (l i)
    (when (and (num? i) (< i 0))
      (if (list? l)
        (return `(let l ,l (at l ,i))))
      (assign i `(+ #,l ,i)))
    (when lua?
      (if (num? i) (++ i)
        (assign i `(+ ,i 1))))
    `(get ,l ,i))

  (mac wipe (place)
    (if lua?
        `(assign ,place nil)
      `(%delete ,place)))

  (mac list body
    (w/uniq x
      (let (l () forms ())
        (each (k v) body
          (if (num? k)
              (assign (get l k) v)
            (add forms `(assign (get ,x ',k) ,v))))
        (if (some? forms)
            `(let ,x (%array ,@l) ,@forms ,x)
          `(%array ,@l)))))

  (mac xform (l body)
    `(map [do ,body] ,l))

  (mac if branches
    (hd (expand-if branches)))

  (mac case (x rest: clauses)
    (w/uniq e
      (let bs (map (fn ((a b))
                     (if (nil? b)
                         (list a)
                       `((is ,a ,e) ,b)))
                   (pair clauses))
        `(let (,e ,x) (if ,@(apply join bs))))))

  (mac when (cond rest: body)
    `(if ,cond (do ,@body)))

  (mac unless (cond rest: body)
    `(if (not ,cond) (do ,@body)))

  (mac assert (cond)
    `(unless ,cond
       ,(let x (cat "assert: " (str cond))
         `(error ',x))))

  (mac obj body
    `(%object ,@(mapo [do _] body)))

  (mac let (bs rest: body)
    (if (toplevel?)
        (return (w/frame (macroexpand `(let ,bs ,@body)))))
    (if (atom? bs) `(let (,bs ,(hd body)) ,@(tl body))
        (none? bs) `(do ,@body)
      (let ((lh rh rest: bs2) bs
            (id val rest: bs1) (bind lh rh))
        (let renames ()
          (if (or (bound? id) (toplevel?))
              (let id1 (uniq id)
                (assign renames (list id id1))
                (assign id id1))
            (setenv id :variable))
          `(do (%local ,id ,val)
               (w/sym ,renames
                 (let ,(join bs1 bs2) ,@body)))))))

  (mac = l
    (case #l
      0 nil
      1 `(= ,@l nil)
      2 (let ((lh rh) l)
          (if (or (atom? lh) (is lh.0 'at) (is lh.0 'get)) ; setforms?
              `(assign ,lh ,rh)
              (let (vars () forms (bind lh rh vars))
                `(do ,@(xform vars
                         `(var ,_))
                     ,@(map (fn ((id val)) `(= ,id ,val))
                            (pair forms))))))
      `(do ,@(xform (pair l)
               `(= ,@_)))))

  (mac with (x v rest: body)
    `(let (,x ,v) ,@body ,x))

  (mac iflet (var expr then rest: rest)
    (if (atom? var)
        `(let ,var ,expr
           (if ,var ,then ,@rest))
      (let gv (uniq "if")
        `(let ,gv ,expr
           (if ,gv (let (,var ,gv) ,then) ,@rest)))))

  (mac whenlet (var expr rest: body)
    `(iflet ,var ,expr (do ,@body)))

  (mac do1 (x rest: ys)
    (let g (uniq "do")
      `(let ,g ,x
         ,@ys
         ,g)))

  (mac mac (name args rest: body)
    `(setenv ',name macro: (fn ,args ,@body) ,@(keys body)))

  (mac defspecial (name args rest: body)
    `(setenv ',name special: (fn ,args ,@body) ,@(keys body)))

  (mac defsym (name expansion rest: props)
    `(setenv ',name symbol: ',expansion ,@(keys props)))

  (mac var (name x rest: body)
    (setenv name :variable)
    (if (some? body)
        `(%local-function ,name ,@(bind* x body))
      `(%local ,name ,x)))

  (mac def (name x rest: body)
    (setenv name :toplevel :variable)
    (if (some? body)
        `(%global-function ,name ,@(bind* x body))
      `(= ,name ,x)))

  (mac w/frame body
    (w/uniq x
      `(do (add environment* (obj))
           (with ,x (do ,@body)
             (drop environment*)))))

  (mac w/bindings ((names) rest: body)
    (w/uniq x
     `(w/frame
        (each ,x ,names
          (setenv ,x :variable))
        ,@body)))

  (mac w/mac (name args definition rest: body)
    (w/frame
      (macroexpand
        `(do (%compile-time (mac ,name ,args ,definition))
             ,@body))))

  (mac w/sym (expansions rest: body)
    (if (atom? expansions)
        `(w/sym (,expansions ,(hd body)) ,@(tl body))
      (w/frame
        (macroexpand
          `(do (%compile-time
                 ,@(xform (pair expansions)
                          `(defsym ,@_)))
               ,@body)))))

  (mac w/uniq (names rest: body)
    (if (atom? names)
        (= names (list names)))
    `(let ,(apply join
             (xform names
               `(,_ (uniq ',_))))
       ,@body))

  (mac fn (args rest: body)
    `(%function ,@(bind* args body)))

  (mac guard (expr)
    (if js? `([%try (list t ,expr)])
      (w/uniq (x msg trace)
        `(let (,x nil ,msg nil ,trace nil)
           (if (xpcall
                [= ,x ,expr]
                [do (= ,msg (clip _ (+ (search _ ": ") 2)))
                    (= ,trace (debug.traceback))])
               (list t ,x)
             (list false ,msg ,trace))))))

  (mac for (i n rest: body)
    `(let ,i 0
       (while (< ,i ,n)
         ,@body
         (++ ,i))))

  (mac step (v l rest: body :index)
    (let ((o i (uniq 'i)) index)
      (if (is i t) (= i 'index))
      (w/uniq (x n)
        `(let (,x ,l ,n #,x)
           (for ,i ,n
             (let (,v (at ,x ,i))
               ,@body))))))

  (mac each (x lst rest: body)
    (w/uniq (l n i)
      (let ((k v) (if (atom? x) (list i x)
                      (> #x 1) x
                    (list i (hd x))))
        `(let (,l ,lst ,k nil)
           (%for ,l ,k
             (let (,v (get ,l ,k))
               ,@(if lua? body
                     `((let ,k (if (numeric? ,k) (parseInt ,k) ,k)
                         ,@body)))))))))

  (mac set-of xs
    (let l ()
      (each x xs
        (= (get l x) t))
      `(obj ,@l)))

  (mac language () `',target*)
  (mac target clauses (get clauses target*))

  (mac join! (a rest: bs) `(= ,a (join ,a ,@bs)))
  (mac cat!  (a rest: bs) `(= ,a (cat  ,a ,@bs)))

  (mac ++ (n by) `(= ,n (+ ,n ,(or by 1))))
  (mac -- (n by) `(= ,n (- ,n ,(or by 1))))

  (mac export names
    (if js? `(do ,@(xform names
                     `(= (get exports ',_) ,_)))
      (let x (obj)
        (each k names
          (= (get x k) k))
        `(return (obj ,@x)))))

  (mac once forms
    (w/uniq x
      `(when (nil? ,x)
         (= ,x t)
         (let ()
           ,@forms))))

  (mac elf () `(require (target js: "elf.js" lua: "elf")))
  (mac lib modules `(do ,@(xform modules `(def ,_ (require ',_)))))
  (mac use modules `(do ,@(xform modules `(var ,_ (require ',_)))))

  (mac nil? (x)
    (if lua?
       `(is ,x nil)
        (list? x)
       `(let x ,x (nil? x))
      `(or (is (typeof ,x) 'undefined)
           (is ,x null))))

  (mac hd (l) `(at ,l 0))
  (mac tl (l) `(cut ,l 1))

  (defspecial %len (x) (cat "#(" (compile x) ")"))

  (mac len (x) `(target lua: (%len ,x) js: (or (get ,x 'length) 0)))

  (mac edge (x) `(- #,x 1))
  (mac one? (x) `(is #,x 1))
  (mac two? (x) `(is #,x 2))
  (mac some? (x) `(> #,x 0))
  (mac none? (x) `(is #,x 0))

  (mac isa (x y) `(is ((target js: typeof lua: type) ,x) ,y))
  (mac list? (x) `(isa ,x (target js: 'object lua: 'table)))
  (mac atom? (x) `(~list? ,x))
  (mac bool? (x) `(isa ,x 'boolean))
  (mac num? (x) `(isa ,x 'number))
  (mac str? (x) `(isa ,x 'string))
  (mac fn? (x) `(isa ,x 'function))

  nil)

(once
  (def environment* (list (obj)))
  (def target* (language))
  (def keys*))

(def nan (/ 0 0))
(def inf (/ 1 0))

(def nan? (n) (~is n n))
(def inf? (n) (or (is n inf) (is n -inf)))

(def clip (s from upto)
  (%js (s.substring from upto))
  (%lua (string.sub s (+ from 1) upto)))

(def cut (x (o from 0) (o upto #x))
  (with l ()
    (var j 0)
    (var i (max 0 from))
    (var to (min #x upto))
    (while (< i to)
      (= (at l j) (at x i))
      (++ i)
      (++ j))
    (each (k v) x
      (unless (num? k)
        (= (get l k) v)))))

(def keys (x)
  (with l ()
    (each (k v) x
      (unless (num? k)
        (= (get l k) v)))))

(def inner (x)
  (clip x 1 (edge x)))

(def char (s n)
  (%js (s.charAt n))
  (%lua (clip s n (+ n 1))))

(def code (s n)
  (%js (s.charCodeAt n))
  (%lua (string.byte s (if n (+ n 1)))))

(def chr (c)
  (%js (String.fromCharCode c))
  (%lua (string.char c)))

(def string-literal? (x)
  (and (str? x) (is (char x 0) "\"")))

(def id-literal? (x)
  (and (str? x) (is (char x 0) "|")))

(def add (l x)
  (%js (do (l.push x) nil))
  (%lua (table.insert l x)))

(def drop (l)
  (%js (l.pop))
  (%lua (table.remove l)))

(def last (l)
  (at l (edge l)))

(def almost (l)
  (cut l 0 (edge l)))

(def rev (l)
  (with l1 (keys l)
    (var n (edge l))
    (for i #l
      (add l1 (at l (- n i))))))

(def reduce (f x)
  (case #x
    0 nil
    1 (hd x)
    (f (hd x) (reduce f (tl x)))))

(def join ls
  (if (two? ls)
      (let ((a b) ls)
        (if (and a b)
            (let (c () o #a)
              (each (k v) a
                (= (get c k) v))
              (each (k v) b
                (when (num? k)
                  (++ k o))
                (= (get c k) v))
              c)
          (or a b ())))
    (or (reduce join ls) ())))

(def find (f l)
  (each x l
    (let y (f x)
      (if y (return y)))))

(def first (f l)
  (step x l
    (let y (f x)
      (if y (return y)))))

(def in? (x l)
  (find [is x _] l))

(def pair (l)
  (with l1 ()
    (for i #l
      (add l1 (list (at l i) 
                    (at l (+ i 1))))
      (++ i))))

(def sort (l f)
  (%lua (do (table.sort l f) l))
  (%js (l.sort (when f [if (f _0 _1) -1 1]))))

(def map (f x)
  (with l ()
    (step v x
      (let y (f v)
        (unless (nil? y)
          (add l y))))
    (each (k v) x
      (unless (num? k)
        (let y (f v)
          (unless (nil? y)
            (= (get l k) y)))))))

(def keep (f x)
  (map [when (f _) _] x))

(def keys? (l)
  (each (k v) l
    (unless (num? k)
      (return t)))
  false)

(def empty? (l)
  (each x l
    (return false))
  t)

(def stash! (args)
  (= keys* args)
  nil)

(def unstash (args)
  (when keys*
    (each (k v) keys*
      (= (get args k) v))
    (= keys* nil))
  args)

(def search (s pattern start)
  (%js
    (var i (s.indexOf pattern start))
    (if (>= i 0) i))
  (%lua
    (var start (if start (+ start 1)))
    (var i (string.find s pattern start t))
    (and i (- i 1))))

(def split (s sep)
  (if (or (is s "") (is sep "")) ()
    (with l ()
      (let n #sep
        (while t
          (let i (search s sep)
            (if (nil? i) (break)
              (do (add l (clip s 0 i))
                  (= s (clip s (+ i n)))))))
        (add l s)))))

(def cat xs (or (reduce [cat _0 _1] xs) ""))
(def + xs (or (reduce [+ _0 _1] xs) 0))
(def * xs (or (reduce [* _0 _1] xs) 1))
(def - xs (or (reduce [- _1 _0] (rev xs)) 0))
(def / xs (or (reduce [/ _1 _0] (rev xs)) 1))
(def % xs (or (reduce [% _1 _0] (rev xs)) 1))

(def > (a b) (> a b))
(def < (a b) (< a b))
(def is (a b) (is a b))
(def >= (a b) (>= a b))
(def <= (a b) (<= a b))

(def number (s)
  (%lua (tonumber s))
  (%js (let n (parseFloat s)
         (unless (isNaN n) n))))

(def number-code? (n)
  (and (> n 47) (< n 58)))

(def numeric? (s)
  (let n #s
    (for i n
      (unless (number-code? (code s i))
        (return false))))
  t)

(%js (def tostring (x) (x.toString)))

(def escape (s)
  (var s1 "\"")
  (for i #s
    (var c (char s i))
    (cat! s1
      (case c
        "\n" "\\n"
        "\"" "\\\""
        "\\" "\\\\"
        c)))
  (cat s1 "\""))

(def str (x stack)
  (if (nil? x) "nil"
      (nan? x) "nan"
      (is x inf) "inf"
      (is x -inf) "-inf"
      (num? x) (tostring x)
      (bool? x) (if x "t" "false")
      (str? x) (escape x)
      (fn? x) "fn"
      (~isa x (target js: 'object lua: 'table)) (escape (tostring x))
      (and stack (in? x stack)) "circular"
    (let (s "(" sp "" fs () xs () ks () stack (or stack ()))
      (add stack x)
      (each (k v) x
        (if (num? k) (= (at xs k) (str v stack))
            (fn? v) (add fs k)
          (do (add ks (cat k ":"))
              (add ks (str v stack)))))
      (drop stack)
      (each v (join (sort fs) xs ks)
        (cat! s sp v)
        (= sp " "))
      (cat s  ")"))))

(%lua (= table.unpack (or table.unpack unpack)))

(def apply (f args)
  (stash! (keys args))
  (f (%unpack args)))

(def toplevel? ()
  (one? environment*))

(def setenv (k rest: keys)
  (when (str? k)
    (let (frame (if keys.toplevel
                    (hd environment*)
                  (last environment*))
          entry (or (get frame k) (obj)))
      (each (k v) keys
        (= (get entry k) v))
      (= (get frame k) entry))))

(%js (def print (x) (console.log x)))

(%js (var math Math))

(def abs math.abs)
(def acos math.acos)
(def asin math.asin)
(def atan math.atan)
(def atan2 math.atan2)
(def ceil math.ceil)
(def cos math.cos)
(def floor math.floor)
(def log math.log)
(def log10 math.log10)
(def max math.max)
(def min math.min)
(def pow math.pow)
(def random math.random)
(def sin math.sin)
(def sinh math.sinh)
(def sqrt math.sqrt)
(def tan math.tan)
(def tanh math.tanh)

(setup)

