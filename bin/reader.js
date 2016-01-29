setenv("define-reader", {_stash: true, macro: function (_x6) {
  var _id2 = _x6;
  var char = _id2[0];
  var s = _id2[1];
  var _r1 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id3 = _r1;
  var body = cut(_id3, 0);
  return(["set", ["get", "read-table", char], join(["fn", [s]], body)]);
}});
var delimiters = {"(": true, ")": true, "\n": true, ";": true};
var whitespace = {" ": true, "\n": true, "\t": true};
var stream = function (str, more) {
  return({more: more, pos: 0, len: _35(str), string: str});
};
var peek_char = function (s) {
  var _id4 = s;
  var pos = _id4.pos;
  var len = _id4.len;
  var string = _id4.string;
  if (pos < len) {
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
  while (true) {
    var c = peek_char(s);
    if (nil63(c)) {
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
  }
};
var read_table = {};
var eof = {};
var read = function (s) {
  skip_non_code(s);
  var c = peek_char(s);
  if (is63(c)) {
    return((read_table[c] || read_table[""])(s));
  } else {
    return(eof);
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
  return(string63(atom) && _35(atom) > 1 && char(atom, edge(atom)) === ":");
};
var flag63 = function (atom) {
  return(string63(atom) && _35(atom) > 1 && char(atom, 0) === ":");
};
var expected = function (s, c) {
  var _id5 = s;
  var more = _id5.more;
  var pos = _id5.pos;
  var _id6 = more;
  var _e;
  if (_id6) {
    _e = _id6;
  } else {
    throw new Error("Expected " + c + " at " + pos);
    _e = undefined;
  }
  return(_e);
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
  if (number_code63(code(str, edge(str)))) {
    return(number(str));
  }
};
var real63 = function (x) {
  return(number63(x) && ! nan63(x) && ! inf63(x));
};
var valid_access63 = function (str) {
  return(_35(str) > 2 && !( "." === char(str, 0)) && !( "." === char(str, edge(str))) && ! search(str, ".."));
};
var parse_access = function (str) {
  return(reduce(function (a, b) {
    var n = number(a);
    if (is63(n)) {
      return(["at", b, n]);
    } else {
      return(["get", b, ["quote", a]]);
    }
  }, reverse(split(str, "."))));
};
read_table[""] = function (s) {
  var str = "";
  var dot63 = false;
  while (true) {
    var c = peek_char(s);
    if (c && (! whitespace[c] && ! delimiters[c])) {
      if (c === ".") {
        dot63 = true;
      }
      str = str + read_char(s);
    } else {
      break;
    }
  }
  var _e1;
  if (str === "true") {
    _e1 = true;
  } else {
    var _e2;
    if (str === "false") {
      _e2 = false;
    } else {
      var _e3;
      if (str === "nan") {
        _e3 = nan;
      } else {
        var _e4;
        if (str === "-nan") {
          _e4 = nan;
        } else {
          var _e5;
          if (str === "inf") {
            _e5 = inf;
          } else {
            var _e6;
            if (str === "-inf") {
              _e6 = -inf;
            } else {
              var n = maybe_number(str);
              var _e7;
              if (real63(n)) {
                _e7 = n;
              } else {
                var _e8;
                if (dot63 && valid_access63(str)) {
                  _e8 = parse_access(str);
                } else {
                  _e8 = str;
                }
                _e7 = _e8;
              }
              _e6 = _e7;
            }
            _e5 = _e6;
          }
          _e4 = _e5;
        }
        _e3 = _e4;
      }
      _e2 = _e3;
    }
    _e1 = _e2;
  }
  var atom = _e1;
  while ("(" === peek_char(s)) {
    atom = join([atom], read(s));
  }
  return(atom);
};
read_table["("] = function (s) {
  read_char(s);
  var r = undefined;
  var l = [];
  while (nil63(r)) {
    skip_non_code(s);
    var c = peek_char(s);
    if (c === ")") {
      read_char(s);
      r = l;
    } else {
      if (nil63(c)) {
        r = expected(s, ")");
      } else {
        var x = read(s);
        if (key63(x)) {
          var k = clip(x, 0, edge(x));
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
read_table[")"] = function (s) {
  throw new Error("Unexpected ) at " + s.pos);
};
read_table["\""] = function (s) {
  read_char(s);
  var r = undefined;
  var str = "\"";
  while (nil63(r)) {
    var c = peek_char(s);
    if (c === "\"") {
      r = str + read_char(s);
    } else {
      if (nil63(c)) {
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
  while (nil63(r)) {
    var c = peek_char(s);
    if (c === "|") {
      r = str + read_char(s);
    } else {
      if (nil63(c)) {
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
exports.stream = stream;
exports.read = read;
exports["read-all"] = read_all;
exports["read-string"] = read_string;
exports["read-table"] = read_table;
