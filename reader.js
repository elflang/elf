setenv("defreader", {_stash: true, macro: function (_x6) {
  var _id2 = _x6;
  var char = _id2[0];
  var s = _id2[1];
  var _r1 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id3 = _r1;
  var body = cut(_id3, 0);
  return(["=", ["get", "read-table", char], join(["fn", [s]], body)]);
}});
var delimiters = {"(": true, ")": true, ";": true, "]": true, "\n": true, "[": true};
var whitespace = {" ": true, "\n": true, "\t": true};
var stream = function (str, more) {
  return({more: more, pos: 0, len: str.length || 0, string: str});
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
  return(type(atom) === "string" && (atom.length || 0) > 1 && char(atom, edge(atom)) === ":");
};
var flag63 = function (atom) {
  return(type(atom) === "string" && (atom.length || 0) > 1 && char(atom, 0) === ":");
};
var expected = function (s, c) {
  var _id5 = s;
  var more = _id5.more;
  var pos = _id5.pos;
  var _id6 = more;
  var _e1;
  if (_id6) {
    _e1 = _id6;
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
  if (number_code63(code(str, edge(str)))) {
    return(number(str));
  }
};
var real63 = function (x) {
  return(type(x) === "number" && ! nan63(x) && ! inf63(x));
};
var valid_access63 = function (str) {
  return((str.length || 0) > 2 && !( "." === char(str, 0)) && !( "." === char(str, edge(str))) && ! search(str, ".."));
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
  return(reduce(parse_index, reverse(split(str, "."))));
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
var read_next = function (s, prev, ws63) {
  var _e = peek_char(s);
  if ("." === _e) {
    read_char(s);
    return(read_next(s, parse_index(read_atom(s), prev)));
  } else {
    if ("(" === _e) {
      if (ws63) {
        return(prev);
      } else {
        var x = join([prev], read_list(s, ")"));
        return(read_next(s, x, skip_non_code(s)));
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
setenv("%loading", {_stash: true, macro: function () {
  var forms = unstash(Array.prototype.slice.call(arguments, 0));
  var e = join(["do"], forms);
  eval(e);
  return(e);
}});
setenv("%fn", {_stash: true, macro: function (body) {
  var n = -1;
  var l = [];
  var any63 = undefined;
  treewise(cons, function (_) {
    if (type(_) === "string" && (_.length || 0) <= 2 && code(_, 0) === 95) {
      any63 = true;
      var c = code(_, 1);
      if (c && c >= 48 && c <= 57) {
        n = max(n, c - 48);
        return(n);
      }
    }
  }, body);
  if (any63) {
    var i = 0;
    while (i < n + 1) {
      add(l, "_" + chr(48 + i));
      i = i + 1;
    }
    if ((l.length || 0) === 0) {
      add(l, "_");
    }
  }
  return(["fn", l, body]);
}});
read_table["["] = function (s) {
  return(read_next(s, ["%fn", read_list(s, "]")], skip_non_code(s)));
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
exports.stream = stream;
exports.read = read;
exports["read-all"] = read_all;
exports["read-string"] = read_string;
exports["read-table"] = read_table;