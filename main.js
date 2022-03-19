require("elf.js");
reader = require("reader");
compiler = require("compiler");
system = require("system");
var to_string = function (l) {
  var _s = "";
  var sep;
  var __x = l;
  var __n = __x.length || 0;
  var __i = 0;
  while (__i < __n) {
    var _x1 = __x[__i];
    if (sep) {
      _s = _s + sep;
    } else {
      sep = " ";
    }
    _s = _s + str(_x1);
    __i = __i + 1;
  }
  return _s;
};
if (typeof(pp) === "undefined" || pp === null) {
  pp = function () {
    var _xs = unstash(Array.prototype.slice.call(arguments, 0));
    return print(to_string(_xs));
  };
}
var eval_print = function (form) {
  compiler.reset();
  if (!( typeof(form) === "undefined" || form === null)) {
    var __id = (function () {
      try {
        return [true, compiler.eval(form)];
      }
      catch (_e10) {
        return [false, _e10.message, _e10.stack];
      }
    })();
    var _ok = __id[0];
    var _x4 = __id[1];
    var _trace = __id[2];
    if (! _ok) {
      print(_trace);
      return;
    }
    thatexpr = form;
    that = _x4;
    if (!( typeof(_x4) === "undefined" || _x4 === null)) {
      return pp(_x4);
    }
  }
};
var rep = function (s) {
  return eval_print(reader["read-string"](s));
};
repl = function () {
  var _buf = "";
  var rep1 = function (s) {
    _buf = _buf + s;
    var _more = [];
    var _form = reader["read-string"](_buf, _more);
    if (!( _form === _more)) {
      eval_print(_form);
      _buf = "";
      return system.write("> ");
    }
  };
  system.write("> ");
  var _in = process.stdin;
  _in.setEncoding("utf8");
  return _in.on("data", rep1);
};
var skip_shebang = function (s) {
  if (s) {
    if (! str_starts63(s, "#!")) {
      return s;
    }
    var _i1 = search(s, "\n");
    if (_i1) {
      return clip(s, _i1 + 1);
    } else {
      return "";
    }
  }
};
compile_string = function (s) {
  compiler.reset();
  var body = reader["read-all"](skip_shebang(s));
  var form = compiler.expand(join(["do"], body));
  var __do = compiler.compile(form, stash33({["stmt"]: true}));
  compiler.reset();
  return __do;
};
compile_file = function (path) {
  return compile_string(system["read-file"](path));
};
load = function (path) {
  return compiler.run(compile_file(path));
};
var run_file = function (path) {
  return compiler.run(system["read-file"](path), path);
};
elf_usage = function () {
  print("usage: elf [options] <object files>");
  print("options:");
  print("  -c <input>\tCompile input file");
  print("  -o <output>\tOutput file");
  print("  -t <target>\tTarget language (default: lua)");
  print("  -e <expr>\tExpression to evaluate");
  return system.exit();
};
var elf_file63 = function (path) {
  var _id2 = str_ends63(path, ".e");
  var _e4;
  if (_id2) {
    _e4 = _id2;
  } else {
    var _id3 = system["file-exists?"](path);
    var _e6;
    if (_id3) {
      var _s1 = system["read-file"](path);
      var _e7;
      if (_s1) {
        var _bang = clip(_s1, 0, search(_s1, "\n"));
        _e7 = str_starts63(_bang, "#!") && search(_bang, "elf");
      }
      _e6 = _e7;
    } else {
      _e6 = _id3;
    }
    _e4 = _e6;
  }
  return _e4;
};
var script_file63 = function (path) {
  return str_ends63(path, "." + "js");
};
elf_main = function () {
  var _arg = system.argv[0];
  if (_arg) {
    if (in63(_arg, ["-h", "--help"])) {
      elf_usage();
    }
    if (elf_file63(_arg)) {
      system.argv = cut(system.argv, 1);
      load(_arg);
      return;
    }
    if (script_file63(_arg)) {
      system.argv = cut(system.argv, 1);
      run_file(_arg);
      return;
    }
  }
  var _pre = [];
  var _input = undefined;
  var _output = undefined;
  var _target1 = undefined;
  var _expr = undefined;
  var _argv = system.argv;
  var _n1 = _argv.length || 0;
  var _i2 = 0;
  while (_i2 < _n1) {
    var _a = _argv[_i2];
    if (_a === "-c" || _a === "-o" || _a === "-t" || _a === "-e") {
      if (_i2 === _n1 - 1) {
        print("missing argument for " + _a);
      } else {
        _i2 = _i2 + 1;
        var _val = _argv[_i2];
        if (_a === "-c") {
          _input = _val;
        } else {
          if (_a === "-o") {
            _output = _val;
          } else {
            if (_a === "-t") {
              _target1 = _val;
            } else {
              if (_a === "-e") {
                _expr = _val;
              }
            }
          }
        }
      }
    } else {
      if (!( "-" === char(_a, 0))) {
        add(_pre, _a);
      }
    }
    _i2 = _i2 + 1;
  }
  var __x7 = _pre;
  var __n2 = __x7.length || 0;
  var __i3 = 0;
  while (__i3 < __n2) {
    var _file = __x7[__i3];
    run_file(_file);
    __i3 = __i3 + 1;
  }
  if (typeof(_input) === "undefined" || _input === null) {
    if (_expr) {
      return rep(_expr);
    } else {
      return repl();
    }
  } else {
    if (_target1) {
      target42 = _target1;
    }
    var _code = compile_file(_input);
    if (typeof(_output) === "undefined" || _output === null || _output === "-") {
      return print(_code);
    } else {
      return system["write-file"](_output, _code);
    }
  }
};
str_starts63 = function (str, x) {
  if ((x.length || 0) > (str.length || 0)) {
    return false;
  } else {
    return x === clip(str, 0, x.length || 0);
  }
};
str_ends63 = function (str, x) {
  if ((x.length || 0) > (str.length || 0)) {
    return false;
  } else {
    return x === clip(str, (str.length || 0) - (x.length || 0));
  }
};
import33 = function (module) {
  var _e8;
  if (typeof(module) === "string") {
    _e8 = require(module);
  } else {
    _e8 = module;
  }
  import37 = _e8;
  var _e = ["do"];
  var __l = module;
  var _k = undefined;
  for (_k in __l) {
    var _v = __l[_k];
    var _e9;
    if (numeric63(_k)) {
      _e9 = parseInt(_k);
    } else {
      _e9 = _k;
    }
    var _k1 = _e9;
    add(_e, ["def", _k1, ["get", "import%", ["quote", _k1]]]);
  }
  compiler.eval(_e);
  var __do1 = import37;
  delete import37;
  return __do1;
};
if (typeof(_x12) === "undefined" || _x12 === null) {
  _x12 = true;
  elf_main();
}
