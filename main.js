require("elf.js");
reader = require("reader");
compiler = require("compiler");
system = require("system");
var to_string = function (l) {
  var s = "";
  var sep;
  var _x = l;
  var _n = _x.length || 0;
  var _i = 0;
  while (_i < _n) {
    var x = _x[_i];
    if (sep) {
      s = s + sep;
    } else {
      sep = " ";
    }
    s = s + str(x);
    _i = _i + 1;
  }
  return(s);
};
if (typeof(pp) === "undefined" || pp === null) {
  pp = function () {
    var xs = unstash(Array.prototype.slice.call(arguments, 0));
    return(print(to_string(xs)));
  };
}
var eval_print = function (form) {
  compiler.reset();
  if (!( typeof(form) === "undefined" || form === null)) {
    var _id = (function () {
      try {
        return([true, compiler.eval(form)]);
      }
      catch (_e9) {
        return([false, _e9.message, _e9.stack]);
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
      return(pp(x));
    }
  }
};
var rep = function (s) {
  return(eval_print(reader["read-string"](s)));
};
repl = function () {
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
  var _id2 = str_ends63(path, ".e");
  var _e3;
  if (_id2) {
    _e3 = _id2;
  } else {
    var _id3 = system["file-exists?"](path);
    var _e5;
    if (_id3) {
      var s = system["read-file"](path);
      var _e6;
      if (s) {
        var bang = clip(s, 0, search(s, "\n"));
        _e6 = str_starts63(bang, "#!") && search(bang, "elf");
      }
      _e5 = _e6;
    } else {
      _e5 = _id3;
    }
    _e3 = _e5;
  }
  return(_e3);
};
var script_file63 = function (path) {
  return(str_ends63(path, "." + "js"));
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
    if (script_file63(arg)) {
      system.argv = cut(system.argv, 1);
      run_file(arg);
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
  var _x5 = pre;
  var _n1 = _x5.length || 0;
  var _i1 = 0;
  while (_i1 < _n1) {
    var file = _x5[_i1];
    run_file(file);
    _i1 = _i1 + 1;
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
  var _e7;
  if (typeof(module) === "string") {
    _e7 = require(module);
  } else {
    _e7 = module;
  }
  import37 = _e7;
  var e = ["do"];
  var _l = module;
  var k = undefined;
  for (k in _l) {
    var v = _l[k];
    var _e8;
    if (numeric63(k)) {
      _e8 = parseInt(k);
    } else {
      _e8 = k;
    }
    var _k = _e8;
    add(e, ["def", _k, ["get", "import%", ["quote", _k]]]);
  }
  compiler.eval(e);
  var _do1 = import37;
  delete import37;
  return(_do1);
};
if (typeof(_x10) === "undefined" || _x10 === null) {
  _x10 = true;
  elf_main();
}
