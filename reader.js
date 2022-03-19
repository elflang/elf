var defreader__macro = function (_x) {
  var _char = _x[0];
  var _s = _x[1];
  var __r = unstash(Array.prototype.slice.call(arguments, 1));
  var _body = cut(__r, 0);
  return ["=", ["get", "read-table", _char], join(["fn", [_s]], _body)];
};
setenv("defreader", stash33({["macro"]: defreader__macro}));
var delimiters = {["["]: true, [")"]: true, ["}"]: true, [";"]: true, ["]"]: true, ["\n"]: true, ["\r"]: true, ["{"]: true, ["("]: true};
var whitespace = {["\t"]: true, ["\r"]: true, [" "]: true, ["\n"]: true};
var stream = function (str, more) {
  return {["len"]: str.length || 0, ["pos"]: 0, ["more"]: more, ["string"]: str};
};
var peek_char = function (s) {
  var _len = s.len;
  var _pos = s.pos;
  var _string = s.string;
  if (_pos < _len) {
    return char(_string, _pos);
  }
};
var read_char = function (s) {
  var _c = peek_char(s);
  if (_c) {
    s.pos = s.pos + 1;
    return _c;
  }
};
var skip_non_code = function (s) {
  var _any63 = undefined;
  while (true) {
    var _c1 = peek_char(s);
    if (typeof(_c1) === "undefined" || _c1 === null) {
      break;
    } else {
      if (whitespace[_c1]) {
        read_char(s);
      } else {
        if (_c1 === ";") {
          while (_c1 && !( _c1 === "\n")) {
            _c1 = read_char(s);
          }
          skip_non_code(s);
        } else {
          break;
        }
      }
    }
    _any63 = true;
  }
  return _any63;
};
var read_table = {};
var eof = {};
var read = function (s) {
  skip_non_code(s);
  var _c2 = peek_char(s);
  if (typeof(_c2) === "undefined" || _c2 === null) {
    return eof;
  } else {
    return (read_table[_c2] || read_table[""])(s);
  }
};
var read_all = function (s) {
  if (typeof(s) === "string") {
    s = stream(s);
  }
  var _l = [];
  while (true) {
    var _form = read(s);
    if (_form === eof) {
      break;
    }
    add(_l, _form);
  }
  return _l;
};
var read_string = function (str, more) {
  var _x5 = read(stream(str, more));
  if (!( _x5 === eof)) {
    return _x5;
  }
};
var key63 = function (atom) {
  return typeof(atom) === "string" && (atom.length || 0) > 1 && char(atom, (atom.length || 0) - 1) === ":";
};
var flag63 = function (atom) {
  return typeof(atom) === "string" && (atom.length || 0) > 1 && char(atom, 0) === ":";
};
var expected = function (s, c) {
  var _pos1 = s.pos;
  var _more = s.more;
  var _id6 = _more;
  var _e2;
  if (_id6) {
    _e2 = _id6;
  } else {
    throw new Error("Expected " + c + " at " + _pos1);
    _e2 = undefined;
  }
  return _e2;
};
var wrap = function (s, x) {
  var _y = read(s);
  if (_y === s.more) {
    return _y;
  } else {
    return [x, _y];
  }
};
var maybe_number = function (str) {
  if (number_code63(code(str, (str.length || 0) - 1))) {
    return number(str);
  }
};
var real63 = function (x) {
  return typeof(x) === "number" && ! nan63(x) && ! inf63(x);
};
var valid_access63 = function (str) {
  return (str.length || 0) > 2 && !( "." === char(str, 0)) && !( "." === char(str, (str.length || 0) - 1)) && ! search(str, "..");
};
var parse_index = function (a, b) {
  var _n = number(a);
  if (typeof(_n) === "undefined" || _n === null) {
    return ["get", b, ["quote", a]];
  } else {
    return ["at", b, _n];
  }
};
var parse_access = function (str, prev) {
  var _e3;
  if (prev) {
    _e3 = [prev];
  } else {
    _e3 = [];
  }
  var _parts = _e3;
  return reduce(parse_index, rev(join(_parts, split(str, "."))));
};
var read_atom = function (s, basic63) {
  var _str = "";
  var _dot63 = false;
  while (true) {
    var _c3 = peek_char(s);
    if (! _c3 || whitespace[_c3] || delimiters[_c3]) {
      break;
    }
    if (_c3 === ".") {
      _dot63 = true;
    }
    if (_c3 === "\\") {
      read_char(s);
    }
    _str = _str + read_char(s);
  }
  if (_str === "true") {
    return true;
  } else {
    if (_str === "false") {
      return false;
    } else {
      if (_str === "nan") {
        return nan;
      } else {
        if (_str === "-nan") {
          return nan;
        } else {
          if (_str === "inf") {
            return inf;
          } else {
            if (_str === "-inf") {
              return -inf;
            } else {
              if (basic63) {
                return _str;
              } else {
                var _n1 = maybe_number(_str);
                if (real63(_n1)) {
                  return _n1;
                } else {
                  if (_dot63 && valid_access63(_str)) {
                    return parse_access(_str);
                  } else {
                    return _str;
                  }
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
  var _r19 = undefined;
  var _l1 = [];
  while (typeof(_r19) === "undefined" || _r19 === null) {
    skip_non_code(s);
    var _c4 = peek_char(s);
    if (_c4 === ending) {
      read_char(s);
      _r19 = _l1;
    } else {
      if (typeof(_c4) === "undefined" || _c4 === null) {
        _r19 = expected(s, ending);
      } else {
        var _x11 = read(s);
        if (key63(_x11)) {
          var _k = clip(_x11, 0, (_x11.length || 0) - 1);
          var _v = read(s);
          _l1[_k] = _v;
        } else {
          if (flag63(_x11)) {
            _l1[clip(_x11, 1)] = true;
          } else {
            add(_l1, _x11);
          }
        }
      }
    }
  }
  return _r19;
};
var read_next = function (s, prev, ws63) {
  var __e = peek_char(s);
  if ("." === __e) {
    read_char(s);
    skip_non_code(s);
    if (! peek_char(s)) {
      return s.more || eof;
    } else {
      var _x12 = read_atom(s, true);
      if (_x12 === eof || _x12 === s.more) {
        return _x12;
      } else {
        return read_next(s, parse_access(_x12, prev));
      }
    }
  } else {
    if ("(" === __e) {
      if (ws63) {
        return prev;
      } else {
        var _x13 = read_list(s, ")");
        if (_x13 === s.more) {
          return _x13;
        } else {
          return read_next(s, join([prev], _x13), skip_non_code(s));
        }
      }
    } else {
      return prev;
    }
  }
};
read_table[""] = function (s) {
  return read_next(s, read_atom(s));
};
read_table["("] = function (s) {
  return read_next(s, read_list(s, ")"), skip_non_code(s));
};
read_table[")"] = function (s) {
  throw new Error("Unexpected ) at " + s.pos);
};
ontree = function (f, l) {
  var __r24 = unstash(Array.prototype.slice.call(arguments, 2));
  var _skip = __r24.skip;
  if (!( _skip && _skip(l))) {
    var _y1 = f(l);
    if (_y1) {
      return _y1;
    }
    if (! !( typeof(l) === "object")) {
      var __l2 = l;
      var __i = undefined;
      for (__i in __l2) {
        var _x15 = __l2[__i];
        var _e4;
        if (numeric63(__i)) {
          _e4 = parseInt(__i);
        } else {
          _e4 = __i;
        }
        var __i1 = _e4;
        var _y2 = ontree(f, _x15, stash33({["skip"]: _skip}));
        if (_y2) {
          return _y2;
        }
      }
    }
  }
};
hd_is63 = function (l, val) {
  return typeof(l) === "object" && l[0] === val;
};
var _37fn__macro = function (body) {
  var _n3 = -1;
  var _l3 = [];
  var _any631 = undefined;
  ontree(function (_) {
    if (typeof(_) === "string" && (_.length || 0) <= 2 && code(_, 0) === 95) {
      _any631 = true;
      var c = code(_, 1);
      if (c && c >= 48 && c <= 57) {
        while (_n3 < c - 48) {
          _n3 = _n3 + 1;
          add(_l3, "_" + chr(48 + _n3));
        }
      }
      return undefined;
    }
  }, body, stash33({["skip"]: function (_) {
    return hd_is63(_, "%fn");
  }}));
  if (_any631 && (_l3.length || 0) === 0) {
    add(_l3, "_");
  }
  return ["fn", _l3, body];
};
setenv("%fn", stash33({["macro"]: _37fn__macro}));
read_table["["] = function (s) {
  var _x17 = read_list(s, "]");
  if (_x17 === s.more) {
    return _x17;
  } else {
    return read_next(s, ["%fn", _x17], skip_non_code(s));
  }
};
read_table["]"] = function (s) {
  throw new Error("Unexpected ] at " + s.pos);
};
read_table["{"] = function (s) {
  var _x19 = read_list(s, "}");
  if (_x19 === s.more) {
    return _x19;
  } else {
    var _e1 = _x19[0];
    _x19 = cut(_x19, 1);
    while ((_x19.length || 0) > 1) {
      var _op = _x19[0];
      var _a = _x19[1];
      var _bs = cut(_x19, 2);
      _e1 = [_op, _e1, _a];
      _x19 = _bs;
    }
    return read_next(s, _e1, skip_non_code(s));
  }
};
read_table["}"] = function (s) {
  throw new Error("Unexpected } at " + s.pos);
};
read_table["\""] = function (s) {
  read_char(s);
  var _r34 = undefined;
  var _str1 = "\"";
  while (typeof(_r34) === "undefined" || _r34 === null) {
    var _c5 = peek_char(s);
    if (_c5 === "\"") {
      _r34 = _str1 + read_char(s);
    } else {
      if (typeof(_c5) === "undefined" || _c5 === null) {
        _r34 = expected(s, "\"");
      } else {
        if (_c5 === "\\") {
          _str1 = _str1 + read_char(s);
        }
        _str1 = _str1 + read_char(s);
      }
    }
  }
  return _r34;
};
read_table["|"] = function (s) {
  read_char(s);
  var _r36 = undefined;
  var _str2 = "|";
  while (typeof(_r36) === "undefined" || _r36 === null) {
    var _c6 = peek_char(s);
    if (_c6 === "|") {
      _r36 = _str2 + read_char(s);
    } else {
      if (typeof(_c6) === "undefined" || _c6 === null) {
        _r36 = expected(s, "|");
      } else {
        _str2 = _str2 + read_char(s);
      }
    }
  }
  return _r36;
};
read_table["'"] = function (s) {
  read_char(s);
  return wrap(s, "quote");
};
read_table["`"] = function (s) {
  read_char(s);
  return wrap(s, "quasiquote");
};
read_table[","] = function (s) {
  read_char(s);
  if (peek_char(s) === "@") {
    read_char(s);
    return wrap(s, "unquote-splicing");
  } else {
    return wrap(s, "unquote");
  }
};
exports.stream = stream;
exports.read = read;
exports["read-all"] = read_all;
exports["read-string"] = read_string;
exports["read-table"] = read_table;
