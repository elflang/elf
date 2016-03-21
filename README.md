Elf
=
Elf is a small, self-hosted Lisp for Lua and JavaScript. It provides a flexible compilation environment with an extensible reader, macros, and extensible special forms, but otherwise attempts to match the target runtime environment as closely as possible. You can get started by running `bin/elf` on a machine with Node.js, Lua, or LuaJIT installed.
## Install
You can install Elf using npm, Homebrew, or git. Once Elf is installed, `elf update` will overwrite Elf with the latest version.
### via Node
```
npm i elf -g
elf eg
elf eg express
elf eg notch
```
### via Homebrew
```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew update
brew install luajit lua rlwrap
brew install elflang/elf/elf 
elf eg
elf eg notch
```
### Unix and BSD
Install the prerequisites:
```
# Ubuntu
sudo apt-get install luajit rlwrap
# RHEL
sudo yum install luajit rlwrap
# FreeBSD
pkg install luajit
pkg install rlwrap
```
Then install Elf using Git.
### via Git
```
git clone https://github.com/elflang/elf ~/elf
cd ~/elf
# Run some demos
bin/elf eg
bin/elf eg notch
```
To install Elf globally, you can add `~/elf/bin` to your PATH:
```
cd ~/elf
echo 'export PATH="${PATH}:${HOME}/elf/bin"' >> ~/.bash_profile"
. ~/.bash_profile
```
Or you can symlink `~/elf/bin/elf` into a directory on your PATH:
```
mkdir -p ~/bin
echo 'export PATH="${PATH}:${HOME}/bin"' >> ~/.bash_profile"
. ~/.bash_profile
cd ~/elf
ln -s "$(pwd)/bin/elf" ~/bin/
```
One benefit of doing a global installation is that you can write executable Elf scripts:
```
cat <<'end' >./answer
#!/usr/bin/env elf
(print 42)
end
chmod +x ./answer
./answer
```
## Demos
Run `elf eg` to get a list of runnable examples. You can run one of them using `elf eg [name]`. The rest of the arguments will be passed to the program.
```
git clone https://github.com/elflang/elf
cd elf

# See which demos are available
bin/elf eg

# "Hello, world!"
bin/elf eg hello.e
bin/elf eg hello.e a b c
bin/elf eg hello.e ~/*

# A program similar to `/bin/cat`
bin/elf eg cat *.e

# Express.js demo (requires node)
bin/elf eg express

# Luvit demo (prompts to install luvit)
bin/elf eg luvit
y

# Game engine demo (prompts to install ufo framework; worth the wait)
bin/elf eg notch
y
```
## Troubleshooting
You can see debug output by setting `VERBOSE=1`:
```
VERBOSE=1 elf eg hello
```
To transform a list of questions into a list of answers, send them to `lelfjior@gmail.com`.
# Tutorial
## Introduction
Every piece of code in Elf is an expression, and expressions can be evaluated to give values. Elf has a few kinds of expressions that evaluate to themselves:
```
> 17
17
> -5e4
-5000
> true
true
> false
false
```

Strings are enclosed in quotation marks, and may contain newlines. Special characters are escaped using a backslash:
```
> "hi there"
"hi there"
> "one
two"
"one\ntwo"
> "a\"b"
"a\"b"
```

`nil` represents nothingness, and it isn't printed back at the command line:
```
> nil
>
```

Comments start with `;` and continue through the rest of the line:
```
> 7 ; everyone's favourite
7
```

Lists contain other values, and are written by enclosing expressions in parentheses. Operators are called by placing them at the beginning of a list expression, and list values can be constructed using the `list` operator:
```
> (+ 10 2)
12
> (abs -10)
10
> (/ 128 2 2 2)
16
> (list 1 2 3 4)
(1 2 3 4)
```

Lists can contain values that are identified by their position, as well as values that are identified in the list by a name:
```
> (list 1 2 3)
(1 2 3)
> (list 1 2 a: 10 b: 20)
(1 2 b: 20 a: 10)
```
Note that values identified by name, known as keys, don't show up in any particular order.

Positional values can be gotten out of lists using the `at` operator, and keys using the `get` operator:
```
> (at (list 1 2 3) 1)
2
> (get (list a: 10 b: 20) "b")
20
```

A shortcut for a key whose value is `true` looks like this, called a flag:
```
> (list :yes)
(yes: true)
```

#### Variables
Variables are declared using `var` and `def`. Variables declared with `var` are available for use anywhere in subsequent expressions in the same scope, and `def` makes them globally available.
```
> (def zzz "ho")
> zzz
"ho"
> (do (var x 10) (+ x 9))
19
```
`do` evaluates multiple expressions, and itself evaluates to the value of the last expression.

Variables for a limited scope are introduced using `let`:
```
> (let (x 10 y 20)
    (+ x y))
30
> (let x 41 (+ x 1))
42
> (let x 1
    (let x 2
      (print x))
    (print x))
2
1
```

You can see that `let` accepts a list of names and values, called bindings, or it can work with a single binding. More than one expression can follow the bindings, which works like `do`:
```
> (let (x 10 y 20)
    (print x)
    (+ x y))
10
30
> (let x 9
    (print "hi")
    (let y (+ x 1) y))
hi
10
```

It's common to access the values of a list variable where the position or key is known in advance, so there is a shorthand for that:		
```		
> (let x (list foo: 10 bar: 20)		
    x.bar)		
20		
> (let x (list foo: 10 bar: 20)		
    (get x "bar")) ; equivalent		
20		
> (let x (list 10 20 30)		
    x.2)		
30		
> (let x (list 10 20 30)		
    (at x 2)) ; equivalent		
30		
```		

#### Assignment
Variables and list values can be updated using `=`, which evaluates to the value that it updated:
```
> (let x 10
    (= x 15))
15
> (let x 10
    (= x 20)
    (+ x 5))
25
> (let a (list 1 2 3)
    (= (at a 1) "b")
    a)
(1 "b" 3)
> (let a (list foo: 17)
    (= (get a "foo") 19)
    a)
(foo: 19)
```

#### Conditionals
Conditional evaluation is done using an `if` expression. The value of an `if` expression is that of the branch whose condition evaluated to `true`:
```
> (if true 10 20)
10
> (if false 10 20)
20
> (+ (if false 10 20) 5)
25
```

`if` expressions can have any number of branches:
```
> (if true 10)
10
> (if false 10)
>
> (if false 1 false 2 false 3 true 10)
10
> (if false 1 false 2 false 3 10)
10
> (if true 9 (do (print 10) 11))
9
> (if false 9 (do (print 10) 11))
10
11
```

Comparing values is done using the `is` operator:
```
> (is 10 10)
true
> (if (is 10 10) "yes")
"yes"
> (if (is 10 "no") "yes")
>
```

Lists are values that have unique identity, so two separate lists that happen to contain the same values are not the same:
```
> (is (list 1 2 3) (list 1 2 3))
false
```

#### Functions
Functions in Elf are values, just like numbers and strings. Expressions that start with `fn` evaluate to functions:
```
> (fn () 10)
function
```

Functions can be called by placing them first in a list expression. The list that appears after the name `fn` identifies the function's parameters:
```
> (fn (a) (+ a 10))
function
> ((fn (a) (+ a 10)) 20)
30
> ((fn () 42))
42
> ((fn (a b) (+ a b)) 10 20)
30
```

Because functions are values, we can use variables to name them. The same rules apply when calling a function named by a variable:
```
> (let f (fn () 42)
    (f))
42
> (let plus (fn (a b) (+ a b))
    (plus 10 20))
30
```

The most common shortcut for defining functions is to use `var` and `def` in the following way:
```
> (def f (n)
    (* n 10))
> (f 3)
30
> (do (var f (n) (* n 10))
      (print (f 3))
      (print (f 4))
      (f 2.5))
30
40
25
```

A function's parameter list can contain both positional and key parameters, where the key's value is the name to bind:
```
> (let f (fn (a b: my-b) (+ a my-b))
    (f 13 b: 2))
15
```

If the key's value is `true`, the same name as the key is used to bind the parameter's value. This makes it easy to define named parameters with flags:
```
> (let f (fn (a b: true) (+ a b))
    (f 1 b: 2))
3
> (let f (fn (a :b) (+ a b)) ; use a flag
    (f 10 b: 20))
30
```

Parameters in Elf are always optional, and those without a supplied argument have the value `nil`:
```
> (let f (fn (a) a)
    (f))
>
> (let f (fn (:b) (if (is b nil) 10 20))
    (f a: 99))
10
```

Functions can also take a variable number of arguments by either specifying a single parameter instead of a list, or by using the `rest` key:
```
> (let f (fn xs (last xs))
    (f 1 2 3))
3
> (let f (fn (a rest: as) (+ a (last as)))
    (f 10 11 12 13))
23
```

#### Destructuring
Variables can be bound to values in a list at certain positions or key:
```
> (let ((a b c) (list 1 2 3))
    b)
2
> ((fn ((a b c)) c) (list 1 2 3))
3
> (let ((a b: my-b) (list 1 b: 2))
    my-b)
2
> ((fn ((a b: my-b)) (list a my-b)) (list 1 b: 2))
(1 2)
> (let ((a :b) (list 1 b: 2))
    b)
2
```
The `rest` key works with destructuring as it does with function parameters, which binds the remainder of the list:
```
> (let ((a rest: as) (list 1 2 3))
    (list a as))
(1 (2 3))
> (let ((a :rest) (list 1 2 3))
    (list a rest))
(1 (2 3))
```

#### Iteration
There are several iteration mechanisms in Elf. The simplest is a `while` loop:
```
> (let i 3
    (while (> i 0)
      (print (-- i))))
2
1
0
```
The shorthand for iterating from 0 to N is `for`:
```
> (for i 3
    (print i))
0
1
2
```
You can enumerate the keys and values of a list with `each`:
```
> (each (k v) (list 1 2 a: 10 b: 20)
    (print (cat k " " v)))
1 1
2 2
b 20
a 10
> (each v (list 1 2 a: 10 b: 20) ; values only
    (print v))
1
2
20
10
> (each (k (a b)) ; destructuring
      (list (list 10 20) bar: (list "a" "b"))
    (print (cat k " " a " " b)))
1 10 20
bar a b
```
`each` will bind keys and values in any order. If you want only the positional values of a list, you can enumerate them in order using `step`:
```
> (step x (list 1 2 3)
    (print x))
1
2
3
> (step (a b) (list (list 1 2) (list 10 20)) ; destructuring
    (print a)
    (print b))
1
2
10
20
```

#### Quotation
Expressions can be prevented from being evaluated using the `quote` operator:
```
> (quote (1 2 3))
(1 2 3)
```

Expressions that evaluate to themselves are unaffected by quotation:
```
> (quote 10)
10
> (quote false)
false
```

Quoting names and strings results in strings that would evaluate to the quoted expression:
```
> (quote a)
"a"
> (quote "hereanother")
"\"hereanother\""
> (quote "two\nlines")
"\"two\\nlines\""
```

This is also true for expressions inside lists:
```
> (quote (a b c))
("a" "b" "c")
> (quote (1 2 b: baz z: "frob"))
(1 2 b: "baz" z: "\"frob\"")
```

The shorthand for quotation is use a single quote:
```
> '17
17
> '(1 2 3)
(1 2 3)
> '(a b c)
("a" "b" "c")
```

Another way to write many strings is to simply quote their name:
```
> 'a
"a"
> (let x '(a: 10 b: 20)
    (get x 'a))
10
```

When you want to quote some parts of an expression, but want other parts to be evaluated, use `quasiquote` and `unquote`:
```
> (let x 10
    (quasiquote (1 5 (unquote x))))
(1 5 10)
```

The shorthand for quasiquotation is `` ` `` for `quasiquote` and `,` for `unquote`:
```
> (let x 10 `(1 5 ,x))
(1 5 10)
```

A different way to unquote expressions is `unquote-splicing`, which takes the values contained in a nested list and places them in the enclosing one:
```
> (let a '(1 2 3)
    (quasiquote (9 8 (unquote-splicing a))))
(9 8 1 2 3)
```

The shorthand for `unquote-splicing` is `,@`:
```
> (let a '(1 2 3)
    `(9 8 ,@a))
(9 8 1 2 3)
```

#### Macros
Macros allow you to write functions that manipulate expressions before they have been evaluated. Macros take expressions as parameters and return an expression:
```
> (mac when (condition rest: body)
    `(if ,condition (do ,@body)))
(macro: function)
> (when true
    (print 'hi)
    (+ 10 20))
hi
30
```

##### Acknowledgements
Elf is a fork of [Lumen](https://github.com/sctb/lumen#acknowledgements).  The `elf` npm package was donated by [Mike Cantelon](http://mikecantelon.com/).

