require("elf");
reader = require("reader");
compiler = require("compiler");
system = require("system");
var eval_print = function (form) {
  var _id = (function () {
    try {
      return([true, compiler.eval(form)]);
    }
    catch (_e) {
      return([false, _e.message, _e.stack]);
    }
  })();
  var ok = _id[0];
  var x = _id[1];
  var trace = _id[2];
  if (! ok) {
    return(print(trace));
  } else {
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
compile_file = function (path) {
  var s = reader.stream(system["read-file"](path));
  var body = reader["read-all"](s);
  var form = compiler.expand(join(["do"], body));
  return(compiler.compile(form, {_stash: true, stmt: true}));
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
elf_main = function () {
  var arg = system.argv[0];
  if (arg === "-h" || arg === "--help") {
    elf_usage();
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
  var _x3 = pre;
  var _n = _x3.length || 0;
  var _i = 0;
  while (_i < _n) {
    var file = _x3[_i];
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
if (typeof(_x4) === "undefined" || _x4 === null) {
  _x4 = true;
  elf_main();
}
