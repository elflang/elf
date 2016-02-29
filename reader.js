setenv("defreader", stash33({macro: function (_x6) {
  var char = _x6[0];
  var s = _x6[1];
  var _r1 = unstash(Array.prototype.slice.call(arguments, 1));
  var body = cut(_r1, 0);
  return(["=", ["get", "read-table", char], join(["fn", [s]], body)]);
}}));
var delimiters = {"(": true, ")": true, ";": true, "]": true, "\n": true, "[": true};
var whitespace = {" ": true, "\n": true, "\t": true};
var stream = function (str, more) {
  return({more: more, pos: 0, len: str.length || 0, string: str});
};
var peek_char = function (s) {
  var pos = s.pos;
  var _len = s.len;
  var string = s.string;
  if (pos < _len) {
    return(char(string, pos));
  }
};
var read_char = function (s) {
  var c = peek_char(s);
  if (c) {
    s.pos = s.pos + 1;
    return(c);
  }
};
var skip_non_code = function (s) {
  var any63 = undefined;
  while (true) {
    var c = peek_char(s);
    if (typeof(c) === "undefined" || c === null) {
      break;
    } else {
      if (whitespace[c]) {
        read_char(s);
      } else {
        if (c === ";") {
          while (c && !( c === "\n")) {
            c = read_char(s);
          }
          skip_non_code(s);
        } else {
          break;
        }
      }
    }
    any63 = true;
  }
  return(any63);
};
var read_table = {};
var eof = {};
var read = function (s) {
  skip_non_code(s);
  var c = peek_char(s);
  if (typeof(c) === "undefined" || c === null) {
    return(eof);
  } else {
    return((read_table[c] || read_table[""])(s));
  }
};
var read_all = function (s) {
  var l = [];
  while (true) {
    var form = read(s);
    if (form === eof) {
      break;
    }
    add(l, form);
  }
  return(l);
};
var read_string = function (str, more) {
  var x = read(stream(str, more));
  if (!( x === eof)) {
    return(x);
  }
};
var key63 = function (atom) {
  return(typeof(atom) === "string" && (atom.length || 0) > 1 && char(atom, (atom.length || 0) - 1) === ":");
};
var flag63 = function (atom) {
  return(typeof(atom) === "string" && (atom.length || 0) > 1 && char(atom, 0) === ":");
};
var expected = function (s, c) {
  var more = s.more;
  var pos = s.pos;
  var _id7 = more;
  var _e1;
  if (_id7) {
    _e1 = _id7;
  } else {
    throw new Error("Expected " + c + " at " + pos);
    _e1 = undefined;
  }
  return(_e1);
};
var wrap = function (s, x) {
  var y = read(s);
  if (y === s.more) {
    return(y);
  } else {
    return([x, y]);
  }
};
var maybe_number = function (str) {
  if (number_code63(code(str, (str.length || 0) - 1))) {
    return(number(str));
  }
};
var real63 = function (x) {
  return(typeof(x) === "number" && ! nan63(x) && ! inf63(x));
};
var valid_access63 = function (str) {
  return((str.length || 0) > 2 && !( "." === char(str, 0)) && !( "." === char(str, (str.length || 0) - 1)) && ! search(str, ".."));
};
var parse_index = function (a, b) {
  var n = number(a);
  if (typeof(n) === "undefined" || n === null) {
    return(["get", b, ["quote", a]]);
  } else {
    return(["at", b, n]);
  }
};
var parse_access = function (str) {
  return(reduce(parse_index, rev(split(str, "."))));
};
var read_atom = function (s) {
  var str = "";
  var dot63 = false;
  while (true) {
    var c = peek_char(s);
    if (! c || whitespace[c] || delimiters[c]) {
      break;
    }
    if (c === ".") {
      dot63 = true;
    }
    str = str + read_char(s);
  }
  if (str === "true") {
    return(true);
  } else {
    if (str === "false") {
      return(false);
    } else {
      if (str === "nan") {
        return(nan);
      } else {
        if (str === "-nan") {
          return(nan);
        } else {
          if (str === "inf") {
            return(inf);
          } else {
            if (str === "-inf") {
              return(-inf);
            } else {
              var n = maybe_number(str);
              if (real63(n)) {
                return(n);
              } else {
                if (dot63 && valid_access63(str)) {
                  return(parse_access(str));
                } else {
                  return(str);
                }
              }
            }
          }
        }
      }
    }
  }
};
var read_list = function (s, ending) {
  read_char(s);
  var r = undefined;
  var l = [];
  while (typeof(r) === "undefined" || r === null) {
    skip_non_code(s);
    var c = peek_char(s);
    if (c === ending) {
      read_char(s);
      r = l;
    } else {
      if (typeof(c) === "undefined" || c === null) {
        r = expected(s, ending);
      } else {
        var x = read(s);
        if (key63(x)) {
          var k = clip(x, 0, (x.length || 0) - 1);
          var v = read(s);
          l[k] = v;
        } else {
          if (flag63(x)) {
            l[clip(x, 1)] = true;
          } else {
            add(l, x);
          }
        }
      }
    }
  }
  return(r);
};
var read_next = function (s, prev, ws63) {
  var _e = peek_char(s);
  if ("." === _e) {
    read_char(s);
    skip_non_code(s);
    if (! peek_char(s)) {
      return(s.more || eof);
    } else {
      var x = read_atom(s);
      if (x === eof || x === s.more) {
        return(x);
      } else {
        return(read_next(s, parse_index(x, prev)));
      }
    }
  } else {
    if ("(" === _e) {
      if (ws63) {
        return(prev);
      } else {
        var _x15 = read_list(s, ")");
        if (_x15 === s.more) {
          return(_x15);
        } else {
          return(read_next(s, join([prev], _x15), skip_non_code(s)));
        }
      }
    } else {
      return(prev);
    }
  }
};
read_table[""] = function (s) {
  return(read_next(s, read_atom(s)));
};
read_table["("] = function (s) {
  return(read_next(s, read_list(s, ")"), skip_non_code(s)));
};
read_table[")"] = function (s) {
  throw new Error("Unexpected ) at " + s.pos);
};
ontree = function (f, l) {
  var _r24 = unstash(Array.prototype.slice.call(arguments, 2));
  var skip = _r24.skip;
  if (!( skip && skip(l))) {
    var y = f(l);
    if (y) {
      return(y);
    }
    if (! !( typeof(l) === "object")) {
      var _l = l;
      var _i = undefined;
      for (_i in _l) {
        var x = _l[_i];
        var _e2;
        if (numeric63(_i)) {
          _e2 = parseInt(_i);
        } else {
          _e2 = _i;
        }
        var __i = _e2;
        var _y = ontree(f, x, stash33({skip: skip}));
        if (_y) {
          return(_y);
        }
      }
    }
  }
};
hd_is63 = function (l, val) {
  return(typeof(l) === "object" && l[0] === val);
};
setenv("%fn", stash33({macro: function (body) {
  var n = -1;
  var l = [];
  var any63 = undefined;
  ontree(function (_) {
    if (typeof(_) === "string" && (_.length || 0) <= 2 && code(_, 0) === 95) {
      any63 = true;
      var c = code(_, 1);
      if (c && c >= 48 && c <= 57) {
        while (n < c - 48) {
          n = n + 1;
          add(l, "_" + chr(48 + n));
        }
      }
      return(undefined);
    }
  }, body, stash33({skip: function (_) {
    return(hd_is63(_, "%fn"));
  }}));
  if (any63 && (l.length || 0) === 0) {
    add(l, "_");
  }
  return(["fn", l, body]);
}}));
read_table["["] = function (s) {
  var x = read_list(s, "]");
  if (x === s.more) {
    return(x);
  } else {
    return(read_next(s, ["%fn", x], skip_non_code(s)));
  }
};
read_table["]"] = function (s) {
  throw new Error("Unexpected ] at " + s.pos);
};
read_table["\""] = function (s) {
  read_char(s);
  var r = undefined;
  var str = "\"";
  while (typeof(r) === "undefined" || r === null) {
    var c = peek_char(s);
    if (c === "\"") {
      r = str + read_char(s);
    } else {
      if (typeof(c) === "undefined" || c === null) {
        r = expected(s, "\"");
      } else {
        if (c === "\\") {
          str = str + read_char(s);
        }
        str = str + read_char(s);
      }
    }
  }
  return(r);
};
read_table["|"] = function (s) {
  read_char(s);
  var r = undefined;
  var str = "|";
  while (typeof(r) === "undefined" || r === null) {
    var c = peek_char(s);
    if (c === "|") {
      r = str + read_char(s);
    } else {
      if (typeof(c) === "undefined" || c === null) {
        r = expected(s, "|");
      } else {
        str = str + read_char(s);
      }
    }
  }
  return(r);
};
read_table["'"] = function (s) {
  read_char(s);
  return(wrap(s, "quote"));
};
read_table["`"] = function (s) {
  read_char(s);
  return(wrap(s, "quasiquote"));
};
read_table[","] = function (s) {
  read_char(s);
  if (peek_char(s) === "@") {
    read_char(s);
    return(wrap(s, "unquote-splicing"));
  } else {
    return(wrap(s, "unquote"));
  }
};
read_table["#"] = function (s) {
  read_char(s);
  return(wrap(s, "len"));
};
exports.stream = stream;
exports.read = read;
exports["read-all"] = read_all;
exports["read-string"] = read_string;
exports["read-table"] = read_table;
