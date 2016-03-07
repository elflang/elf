require("elf");
reader = require("reader");
compiler = require("compiler");
system = require("system");
var eval_print = function (form) {
  compiler.reset();
  if (!( typeof(form) === "undefined" || form === null)) {
    var _id = (function () {
      try {
        return([true, compiler.eval(form)]);
      }
      catch (_e2) {
        return([false, _e2.message, _e2.stack]);
      }
    })();
    var ok = _id[0];
    var x = _id[1];
    var trace = _id[2];
    if (! ok) {
      print(trace);
      return;
    }
    thatexpr = form;
    that = x;
    if (!( typeof(x) === "undefined" || x === null)) {
      return(print(str(x)));
    }
  }
};
var rep = function (s) {
  return(eval_print(reader["read-string"](s)));
};
var repl = function () {
  var buf = "";
  var rep1 = function (s) {
    buf = buf + s;
    var more = [];
    var form = reader["read-string"](buf, more);
    if (!( form === more)) {
      eval_print(form);
      buf = "";
      return(system.write("> "));
    }
  };
  system.write("> ");
  var _in = process.stdin;
  _in.setEncoding("utf8");
  return(_in.on("data", rep1));
};
var skip_shebang = function (s) {
  if (s) {
    if (! str_starts63(s, "#!")) {
      return(s);
    }
    var i = search(s, "\n");
    if (i) {
      return(clip(s, i + 1));
    } else {
      return("");
    }
  }
};
compile_string = function (s) {
  compiler.reset();
  var body = reader["read-all"](skip_shebang(s));
  var form = compiler.expand(join(["do"], body));
  var _do = compiler.compile(form, stash33({stmt: true}));
  compiler.reset();
  return(_do);
};
compile_file = function (path) {
  return(compile_string(system["read-file"](path)));
};
load = function (path) {
  return(compiler.run(compile_file(path)));
};
var run_file = function (path) {
  return(compiler.run(system["read-file"](path)));
};
elf_usage = function () {
  print("usage: elf [options] <object files>");
  print("options:");
  print("  -c <input>\tCompile input file");
  print("  -o <output>\tOutput file");
  print("  -t <target>\tTarget language (default: lua)");
  print("  -e <expr>\tExpression to evaluate");
  return(system.exit());
};
var elf_file63 = function (path) {
  return(str_ends63(path, ".elf"));
};
elf_main = function () {
  var arg = system.argv[0];
  if (arg) {
    if (in63(arg, ["-h", "--help"])) {
      elf_usage();
    }
    if (elf_file63(arg)) {
      system.argv = cut(system.argv, 1);
      load(arg);
      return;
    }
  }
  var pre = [];
  var input = undefined;
  var output = undefined;
  var target1 = undefined;
  var expr = undefined;
  var argv = system.argv;
  var n = argv.length || 0;
  var i = 0;
  while (i < n) {
    var a = argv[i];
    if (a === "-c" || a === "-o" || a === "-t" || a === "-e") {
      if (i === n - 1) {
        print("missing argument for " + a);
      } else {
        i = i + 1;
        var val = argv[i];
        if (a === "-c") {
          input = val;
        } else {
          if (a === "-o") {
            output = val;
          } else {
            if (a === "-t") {
              target1 = val;
            } else {
              if (a === "-e") {
                expr = val;
              }
            }
          }
        }
      }
    } else {
      if (!( "-" === char(a, 0))) {
        add(pre, a);
      }
    }
    i = i + 1;
  }
  var _x4 = pre;
  var _n = _x4.length || 0;
  var _i = 0;
  while (_i < _n) {
    var file = _x4[_i];
    run_file(file);
    _i = _i + 1;
  }
  if (typeof(input) === "undefined" || input === null) {
    if (expr) {
      return(rep(expr));
    } else {
      return(repl());
    }
  } else {
    if (target1) {
      target42 = target1;
    }
    var code = compile_file(input);
    if (typeof(output) === "undefined" || output === null || output === "-") {
      return(print(code));
    } else {
      return(system["write-file"](output, code));
    }
  }
};
str_starts63 = function (str, x) {
  if ((x.length || 0) > (str.length || 0)) {
    return(false);
  } else {
    return(x === clip(str, 0, x.length || 0));
  }
};
str_ends63 = function (str, x) {
  if ((x.length || 0) > (str.length || 0)) {
    return(false);
  } else {
    return(x === clip(str, (str.length || 0) - (x.length || 0)));
  }
};
import33 = function (module) {
  var _e;
  if (typeof(module) === "string") {
    _e = require(module);
  } else {
    _e = module;
  }
  import37 = _e;
  var e = ["do"];
  var _l = module;
  var k = undefined;
  for (k in _l) {
    var v = _l[k];
    var _e1;
    if (numeric63(k)) {
      _e1 = parseInt(k);
    } else {
      _e1 = k;
    }
    var _k = _e1;
    add(e, ["def", _k, ["get", "import%", ["quote", _k]]]);
  }
  eval(e);
  var _do1 = import37;
  delete import37;
  return(_do1);
};
if (typeof(_x9) === "undefined" || _x9 === null) {
  _x9 = true;
  elf_main();
}
