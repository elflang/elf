;; -*- mode: lisp -*-

(use reader)

(def getenv (k p)
  (when (str? k)
    (var i (edge environment*))
    (while (>= i 0)
      (let b (get (at environment* i) k)
        (if (~nil? b)
            (return (if p (get b p) b))))
      (-- i))))

(var macro-function (k)
  (getenv k 'macro))

(var macro? (k)
  (~nil? (macro-function k)))

(var special? (k)
  (~nil? (getenv k 'special)))

(var special-form? (form)
  (and (list? form) (special? (hd form))))

(var statement? (k)
  (and (special? k) (getenv k 'stmt)))

(var symbol-expansion (k)
  (getenv k 'symbol))

(var symbol? (k)
  (~nil? (symbol-expansion k)))

(var variable? (k)
  (let b (first [get _ k]
           (rev environment*))
    (and (list? b) (~nil? b.variable))))

(def bound? (x)
  (or (macro? x)
      (special? x)
      (symbol? x)
      (variable? x)))

(def quoted (form)
  (if (str? form) (escape form)
      (atom? form) form
    `(list ,@(map quoted form))))

(var literal (s)
  (if (string-literal? s) s (quoted s)))

(let (names (obj))
  (def uniq (x)
    (if (get names x)
        (let i (get names x)
          (++ (get names x))
          (uniq (cat x i)))
      (do (= (get names x) 1)
          (cat "_" x))))
  (var reset ()
    (= names (obj))))

(var stash* (args)
  (if (keys? args)
      (let l '(%object)
        (each (k v) args
          (unless (num? k)
            (add l (literal k))
            (add l v)))
        (join args `((stash! ,l))))
    args))

(var bias (k)
  (when (and (num? k) (~is target* (language)))
    (if js? (-- k) (++ k)))
  k)

(def bind (lh rh vars)
  (if (or (atom? lh) (is lh.0 'at) (is lh.0 'get)) ; setforms?
      `(,lh ,rh)
      (is (hd lh) 'o)
       (let ((_ var val) lh)
         (list var `(if (nil? ,rh) ,val ,rh)))
    (w/uniq id
      (with bs (list id rh)
        (if (and (atom? (macroexpand rh)) (~ontree [is _ rh] lh))
          (= bs () id rh)
          (when vars (add vars id)))
        (each (k v) lh
          (let x (if (is k 'rest)
                     `(cut ,id ,#lh)
                   `(get ,id ',(bias k)))
            (when (~nil? k)
              (let k (if (is v t) k v)
                (join! bs (bind k x vars))))))))))

(mac arguments% (from)
  `(Array.prototype.slice.call arguments ,from))

(def bind* (args body)
  (let args1 ()
    (var rest ()
      (if js? `(unstash (arguments% ,#args1))
        (do (add args1 '|...|) '(unstash (list |...|)))))
    (if (atom? args)
        (list args1 `(let ,(list args (rest)) ,@body))
      (let (bs () inits ())
        (w/uniq r
          (step v args
            (if (atom? v) (add args1 v)
                (is (hd v) 'o)
                (let ((_ var val) v)
                  (add args1 var)
                  (add inits `(if (nil? ,var) (= ,var ,val))))
              (w/uniq x
                (add args1 x)
                (join! bs (list v x)))))
          (when (keys? args)
            (join! bs (list r (rest)))
            (join! bs (list (keys args) r))))
        (list args1 `(let ,bs ,@inits ,@body))))))

(var quoting? (depth)
  (num? depth))

(var quasiquoting? (depth)
  (and (quoting? depth) (> depth 0)))

(var can-unquote? (depth)
  (and (quoting? depth) (is depth 1)))

(var quasisplice? (x depth)
  (and (can-unquote? depth)
       (list? x)
       (is (hd x) 'unquote-splicing)))

(var expand-local ((x name value))
  `(%local ,name ,(macroexpand value)))

(var expand-function ((x args rest: body))
  (w/bindings (args)
    `(%function ,args ,@(macroexpand body))))

(var expand-definition ((x name args rest: body))
  (w/bindings (args)
    `(,x ,name ,args ,@(macroexpand body))))

(var expand-macro ((name rest: body))
  (macroexpand (apply (macro-function name) body)))

(def macroexpand (form)
  (if (symbol? form)
      (macroexpand (symbol-expansion form))
      (atom? form) form
    (let x (hd form)
      (if (is x '%local) (expand-local form)
          (is x '%function) (expand-function form)
          (is x '%global-function) (expand-definition form)
          (is x '%local-function) (expand-definition form)
          (and (str? x) (is (char x 0) "~"))
          (macroexpand `(not (,(clip x 1) ,@(tl form))))
	  (macro? x) (expand-macro form)
        (map macroexpand form)))))

(var quasiquote-list (form depth)
  (let xs (list '(list))
    (each (k v) form
      (unless (num? k)
        (let v (if (quasisplice? v depth)
                   ;; don't splice, just expand
                   (quasiexpand (at v 1))
                 (quasiexpand v depth))
          (= (get (last xs) k) v))))
    ;; collect sibling lists
    (step x form
      (if (quasisplice? x depth)
          (let x (quasiexpand (at x 1))
            (add xs x)
            (add xs '(list)))
        (add (last xs) (quasiexpand x depth))))
    (let pruned
        (keep [or (> #_ 1)
                  (~is (hd _) 'list)
                  (keys? _)]
              xs)
      (if (one? pruned)
          (hd pruned)
        `(join ,@pruned)))))

(def quasiexpand (form depth)
  (if (quasiquoting? depth)
      (if (atom? form) (list 'quote form)
          ;; unquote
          (and (can-unquote? depth)
               (is (hd form) 'unquote))
          (quasiexpand (at form 1))
          ;; decrease quasiquoting depth
          (or (is (hd form) 'unquote)
              (is (hd form) 'unquote-splicing))
          (quasiquote-list form (- depth 1))
          ;; increase quasiquoting depth
          (is (hd form) 'quasiquote)
          (quasiquote-list form (+ depth 1))
        (quasiquote-list form depth))
      (atom? form) form
      (is (hd form) 'quote) form
      (is (hd form) 'quasiquote)
      ;; start quasiquoting
      (quasiexpand (at form 1) 1)
    (xform form (quasiexpand _ depth))))

(def expand-if ((a b rest: c))
  (if (~nil? b) `((%if ,a ,b ,@(expand-if c)))
      (~nil? a) (list a)))

(once
  (def indent-level* 0))

(def indentation ()
  (with s ""
    (for i indent-level*
      (cat! s "  "))))

(mac w/indent (form)
  (w/uniq x
    `(do (++ indent-level*)
         (with ,x ,form
           (-- indent-level*)))))

(var reserved
  (set-of "=" "==" "+" "-" "%" "*" "/" "<" ">" "<=" ">="
          ;; js
          "break" "case" "catch" "continue" "debugger"
          "default" "delete" "do" "else" "finally" "for"
          "function" "if" "import" "in" "instanceof" "new"
          "return" "switch" "this" "throw" "try" "typeof"
          "var" "void" "with"
          ;; lua
          "and" "end" "in" "repeat" "while" "break" "false"
          "local" "return" "do" "for" "nil" "then" "else"
          "function" "not" "true" "elseif" "if" "or" "until"))

(def reserved? (x)
  (get reserved x))

(var valid-code? (n)
  (or (number-code? n)         ; 0-9
      (and (> n 64) (< n 91))  ; A-Z
      (and (> n 96) (< n 123)) ; a-z
      (is n 95)))               ; _

(def valid-id? (id)
  (if (or (none? id) (reserved? id))
      false
    (do (for i #id
          (unless (valid-code? (code id i))
            (return false)))
        t)))

(def key (k)
  (let i (inner k)
    (if (valid-id? i) i
        js? k
      (cat "[" k "]"))))

(def mapo (f l)
  (with o ()
    (each (k v) l
      (let x (f v)
        (when (~nil? x)
          (add o (literal k))
          (add o x))))))

(var infix
  `((not: (js: ! lua: ,"not"))
    (:* :/ :%)
    (:+ :-)
    (cat: (js: + lua: ..))
    (:< :> :<= :>=)
    (is: (js: === lua: ==))
    (and: (js: && lua: and))
    (or: (js: ,"||" lua: or))))

(var unary? (form)
  (and (two? form) (in? (hd form) '(not -))))

(var index (k)
  (%js k)
  (%lua (when (num? k) (- k 1))))

(var precedence (form)
  (unless (or (atom? form) (unary? form))
    (each (k v) infix
      (if (get v (hd form)) (return (index k)))))
  0)

(var getop (op)
  (find [let x (get _ op)
          (if (is x t) op
            (~nil? x) (get x target*))]
        infix))

(var infix? (x)
  (~nil? (getop x)))

(var compile-args (args)
  (let (s "(" c "")
    (step x args
      (cat! s c (compile x))
      (= c ", "))
    (cat s ")")))

(var escape-newlines (s)
  (with s1 ""
    (for i #s
      (let c (char s i)
        (cat! s1 (if (is c "\n") "\\n" c))))))

(var id (id)
  (let id1 ""
    (for i #id
      (let (c (char id i)
            n (code c)
            c1 (if (is c "-") "_"
                   (valid-code? n) c
                   (is i 0) (cat "_" n)
                 n))
        (cat! id1 c1)))
    (if (reserved? id1)
        (cat "_" id1)
        id1)))

(var compile-atom (x)
  (if (and (is x "nil") lua?) x
      (is x "nil") "undefined"
      (id-literal? x) (inner x)
      (string-literal? x) (escape-newlines x)
      (str? x) (id x)
      (bool? x) (if x "true" "false")
      (nan? x) "nan"
      (is x inf) "inf"
      (is x -inf) "-inf"
      (num? x) (cat x "")
    (error (cat "Cannot compile atom: " (str x)))))

(var terminator (stmt?)
  (if (not stmt?) ""
      js? ";\n"
    "\n"))

(var compile-special (form stmt?)
  (let ((x rest: args) form
        (:special :stmt tr: self-tr?) (getenv x)
        tr (terminator (and stmt? (not self-tr?))))
    (cat (apply special args) tr)))

(var parenthesize-call? (x)
  (or (and (list? x)
           (is (hd x) '%function))
      (> (precedence x) 0)))

(var compile-call (form)
  (let (f (hd form)
        f1 (compile f)
        args (compile-args (stash* (tl form))))
    (if (parenthesize-call? f)
        (cat "(" f1 ")" args)
      (cat f1 args))))

(var op-delims (parent child :right)
  (if (if right
        (>= (precedence child) (precedence parent))
        (> (precedence child) (precedence parent)))
      (list "(" ")")
    (list "" "")))

(var compile-infix (form)
  (let ((op rest: (a b)) form
        (ao ac) (op-delims form a)
        (bo bc) (op-delims form b :right)
        a (compile a)
        b (compile b)
        op (getop op))
    (if (unary? form)
        (cat op ao " " a ac)
      (cat ao a ac " " op " " bo b bc))))

(def compile-function (args body :name :prefix)
  (let (id (if name (compile name) "")
        args (compile-args args)
        body (w/indent (compile body :stmt))
        ind (indentation)
        p (if prefix (cat prefix " ") "")
        tr (if js? "" "end"))
    (if name (cat! tr "\n"))
    (if js? (cat "function " id args " {\n" body ind "}" tr)
      (cat p "function " id args "\n" body ind tr))))

(var can-return? (form)
  (and (~nil? form)
       (or (atom? form)
           (and (~is (hd form) 'return)
                (~statement? (hd form))))))

(def compile (form :stmt)
  (if (nil? form) ""
      (special-form? form)
      (compile-special form stmt)
    (let (tr (terminator stmt)
          ind (if stmt (indentation) "")
          form (if (atom? form) (compile-atom form)
                   (infix? (hd form)) (compile-infix form)
                 (compile-call form)))
      (cat ind form tr))))

(var lower-statement (form tail?)
  (let (hoist () e (lower form hoist t tail?))
    (if (and (some? hoist) (~nil? e))
        `(do ,@hoist ,e)
        (~nil? e) e
        (> #hoist 1) `(do ,@hoist)
      (hd hoist))))

(var lower-body (body tail?)
  (lower-statement `(do ,@body) tail?))

(var literal? (form)
  (or (atom? form)
      (is (hd form) '%array)
      (is (hd form) '%object)))

(var standalone? (form)
  (or (and (list? form)
           (~infix? (hd form))
           (~literal? form)
           (~is 'get (hd form)))
      (id-literal? form)))

(var lower-do (args hoist stmt? tail?)
  (step x (almost args)
    (let e (lower x hoist stmt?)
      (when (standalone? e)
        (add hoist e))))
  (let e (lower (last args) hoist stmt? tail?)
    (if (and tail? (can-return? e))
        `(return ,e)
      e)))

(var lower-assign (args hoist stmt? tail?)
  (let ((lh rh) args)
    (add hoist `(assign ,lh ,(lower rh hoist)))
    (unless (and stmt? (not tail?))
      lh)))

(var lower-if (args hoist stmt? tail?)
  (let ((cond then else) args)
    (if (or stmt? tail?)
        (add hoist
             `(%if ,(lower cond hoist)
                   ,(lower-body (list then) tail?)
                   ,@(if else (list (lower-body (list else) tail?)))))
      (w/uniq e
        (add hoist `(%local ,e))
        (add hoist
             `(%if ,(lower cond hoist)
                   ,(lower `(assign ,e ,then))
                   ,@(if else
                         (list (lower `(assign ,e ,else))))))
        e))))

(var lower-short (x args hoist)
  (let ((a b) args
        hoist1 ()
        b1 (lower b hoist1))
    (if (some? hoist1)
        (w/uniq id
          (lower `(do (%local ,id ,a)
                      ,(if (is x 'and)
                           `(%if ,id ,b ,id)
                         `(%if ,id ,id ,b)))
                 hoist))
      `(,x ,(lower a hoist) ,b1))))

(var lower-try (args hoist tail?)
  (add hoist `(%try ,(lower-body args tail?))))

(var lower-while (args hoist)
  (let ((c rest: body) args
        hoist1 ()
        c (lower c hoist1))
    (add hoist
      (if (none? hoist1)
          `(while ,c ,(lower-body body))
          `(while true (do ,@hoist1
                           (%if (not ,c) (break))
                           ,(lower-body body)))))))

(var lower-for (args hoist)
  (let ((l k rest: body) args)
    (add hoist
         `(%for ,(lower l hoist) ,k
            ,(lower-body body)))))

(var lower-function (args)
  (let ((a rest: body) args)
    `(%function ,a ,(lower-body body t))))

(var lower-definition (kind args hoist)
  (let ((name args rest: body) args)
    (add hoist `(,kind ,name ,args ,(lower-body body t)))))

(var lower-call (form hoist)
  (let form (xform form (lower _ hoist))
    (if (some? form) form)))

(var lower-infix? (form)
  (and (infix? (hd form)) (> #form 3)))

(var lower-infix (form hoist)
  (let ((x rest: args) form)
    (lower (reduce [list x _1 _0]
                   (rev args))
           hoist)))

(var lower-special (form hoist)
  (let e (lower-call form hoist)
    (if e (add hoist e))))

(def lower (form hoist stmt? tail?)
  (if (atom? form) form
      (empty? form) '(%array)
      (nil? hoist) (lower-statement form)
      (lower-infix? form) (lower-infix form hoist)
    (let ((x rest: args) form)
      (if (is x 'do) (lower-do args hoist stmt? tail?)
          (is x 'assign) (lower-assign args hoist stmt? tail?)
          (is x '%if) (lower-if args hoist stmt? tail?)
          (is x '%try) (lower-try args hoist tail?)
          (is x 'while) (lower-while args hoist)
          (is x '%for) (lower-for args hoist)
          (is x '%function) (lower-function args)
          (or (is x '%local-function)
              (is x '%global-function))
          (lower-definition x args hoist)
          (in? x '(and or))
          (lower-short x args hoist)
          (statement? x) (lower-special form hoist)
        (lower-call form hoist)))))

(var expand (form)
  (lower (macroexpand form)))

(once
  (%js (unless (nil? global) (= global.require require)))
  (%js (= run-js (if (nil? global) window.eval global.eval)))
  (%lua (= run-lua loadstring)))

(%js
  (var run run-js))

(%lua
  (var run (code)
    (let |f,e| (run-lua code)
      (if f (f) (error (cat e " in " code))))))

(var eval (form)
  (let previous target*
    (= target* (language))
    (def %result)
    (let code (compile (expand `(assign %result ,form)))
      (= target* previous)
      (run code)
      %result)))

(defspecial do forms :stmt :tr
  (with s ""
    (step x forms
      (cat! s (compile x :stmt))
      (unless (atom? x)
        (if (or (is (hd x) 'return)
                (is (hd x) 'break))
            (break))))))

(defspecial %if (cond cons alt) :stmt :tr
  (let (cond (compile cond)
        cons (w/indent (compile cons :stmt))
        alt (if alt (w/indent (compile alt :stmt)))
        ind (indentation)
        s "")
    (if js? (cat! s ind "if (" cond ") {\n" cons ind "}")
      (cat! s ind "if " cond " then\n" cons))
    (if (and alt js?)
        (cat! s " else {\n" alt ind "}")
        alt (cat! s ind "else\n" alt))
    (if lua? (cat s ind "end\n")
      (cat s "\n"))))

(defspecial while (cond form) :stmt :tr
  (let (cond (compile cond)
        body (w/indent (compile form :stmt))
        ind (indentation))
    (if js? (cat ind "while (" cond ") {\n" body ind "}\n")
      (cat ind "while " cond " do\n" body ind "end\n"))))

(defspecial %for (l k form) :stmt :tr
  (let (l (compile l)
        ind (indentation)
        body (w/indent (compile form :stmt)))
    (if lua? (cat ind "for " k " in next, " l " do\n" body ind "end\n")
      (cat ind "for (" k " in " l ") {\n" body ind "}\n"))))

(defspecial %try (form) :stmt :tr
  (w/uniq e
    (let (ind (indentation)
          body (w/indent (compile form :stmt))
          hf `(return (%array false (get ,e "message") (get ,e "stack")))
          h (w/indent (compile hf :stmt)))
      (cat ind "try {\n" body ind "}\n"
           ind "catch (" e ") {\n" h ind "}\n"))))

(defspecial %delete (place) :stmt
  (cat (indentation) "delete " (compile place)))

(defspecial break () :stmt
  (cat (indentation) "break"))

(defspecial %function (args body)
  (compile-function args body))

(defspecial %global-function (name args body) :stmt :tr
  (if lua? (let x (compile-function args body name: name)
             (cat (indentation) x))
    (compile `(assign ,name (%function ,args ,body)) :stmt)))

(defspecial %local-function (name args body) :stmt :tr
  (if lua? (let x (compile-function args body name: name prefix: 'local)
             (cat (indentation) x))
    (compile `(%local ,name (%function ,args ,body)) :stmt)))

(defspecial return (x) :stmt
  (let x (if (nil? x)
             "return"
           (cat "return(" (compile x) ")"))
    (cat (indentation) x)))

(defspecial new (x)
  (cat "new " (compile x)))

(defspecial typeof (x)
  (cat "typeof(" (compile x) ")"))

(defspecial error (x) :stmt
  (let e (if js? (cat "throw " (compile `(new (Error ,x))))
           (cat "error(" (compile x) ")"))
    (cat (indentation) e)))

(defspecial %local (name value) :stmt
  (let (id (compile name)
        value1 (compile value)
        rh (if (~nil? value) (cat " = " value1) "")
	keyword (if js? "var " "local ")
        ind (indentation))
    (cat ind keyword id rh)))

(defspecial assign (lh rh) :stmt
  (let (lh (compile lh)
        rh (compile (if (nil? rh) 'nil rh)))
    (cat (indentation) lh " = " rh)))

(defspecial get (l k)
  (let (l (compile l)
	k1 (compile k))
    (when (and lua? (is (char l 0) "{"))
      (= l (cat "(" l ")")))
    (if (and (string-literal? k)
             (valid-id? (inner k)))
        (cat l "." (inner k))
      (cat l "[" k1 "]"))))

(defspecial %array forms
  (let (open (if lua? "{" "[")
	close (if lua? "}" "]")
	s "" c "")
    (each (k v) forms
      (when (num? k)
        (cat! s c (compile v))
        (= c ", ")))
    (cat open s close)))

(defspecial %object forms
  (let (s "{" c ""
        sep (if lua? " = " ": "))
    (each (k v) (pair forms)
      (when (num? k)
        (let ((k v) v)
          (unless (str? k)
            (error (cat "Illegal key: " (str k))))
          (cat! s c (key k) sep (compile v))
          (= c ", "))))
    (cat s "}")))

(export run
        eval
        expand
        compile
        reset)
