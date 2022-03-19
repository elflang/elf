require("elf.js");
var reader = require("reader");
var compiler = require("compiler");
var passed = 0;
var failed = 0;
var tests = [];
var test__macro = function (x, msg) {
  return ["if", ["not", x], ["do", ["=", "failed", ["+", "failed", 1]], ["return", msg]], ["++", "passed"]];
};
setenv("test", stash33({["macro"]: test__macro}));
var eq__macro = function (a, b) {
  return ["test", ["equal?", a, b], ["cat", "\"failed: expected \"", ["str", a], "\", was \"", ["str", b]]];
};
setenv("eq", stash33({["macro"]: eq__macro}));
var deftest__macro = function (name) {
  var __r5 = unstash(Array.prototype.slice.call(arguments, 1));
  var _body1 = cut(__r5, 0);
  return ["add", "tests", ["list", ["quote", name], ["%fn", join(["do"], _body1)]]];
};
setenv("deftest", stash33({["macro"]: deftest__macro}));
var equal63 = function (a, b) {
  if (!( typeof(a) === "object")) {
    return a === b;
  } else {
    return str(a) === str(b);
  }
};
run_tests = function () {
  var __l = tests;
  var __i = undefined;
  for (__i in __l) {
    var __id2 = __l[__i];
    var _name = __id2[0];
    var _f = __id2[1];
    var _e6;
    if (numeric63(__i)) {
      _e6 = parseInt(__i);
    } else {
      _e6 = __i;
    }
    var __i1 = _e6;
    var _result = _f();
    if (typeof(_result) === "string") {
      print(" " + _name + " " + _result);
    }
  }
  return print(" " + passed + " passed, " + failed + " failed");
};
add(tests, ["reader", function () {
  var _read = reader["read-string"];
  if (! equal63(undefined, _read(""))) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(_read(""));
  } else {
    passed = passed + 1;
  }
  if (! equal63("nil", _read("nil"))) {
    failed = failed + 1;
    return "failed: expected " + str("nil") + ", was " + str(_read("nil"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, _read("17"))) {
    failed = failed + 1;
    return "failed: expected " + str(17) + ", was " + str(_read("17"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(0.015, _read("1.5e-2"))) {
    failed = failed + 1;
    return "failed: expected " + str(0.015) + ", was " + str(_read("1.5e-2"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, _read("true"))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(_read("true"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(! true, _read("false"))) {
    failed = failed + 1;
    return "failed: expected " + str(! true) + ", was " + str(_read("false"));
  } else {
    passed = passed + 1;
  }
  if (! equal63("hi", _read("hi"))) {
    failed = failed + 1;
    return "failed: expected " + str("hi") + ", was " + str(_read("hi"));
  } else {
    passed = passed + 1;
  }
  if (! equal63("\"hi\"", _read("\"hi\""))) {
    failed = failed + 1;
    return "failed: expected " + str("\"hi\"") + ", was " + str(_read("\"hi\""));
  } else {
    passed = passed + 1;
  }
  if (! equal63("|hi|", _read("|hi|"))) {
    failed = failed + 1;
    return "failed: expected " + str("|hi|") + ", was " + str(_read("|hi|"));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2], _read("(1 2)"))) {
    failed = failed + 1;
    return "failed: expected " + str([1, 2]) + ", was " + str(_read("(1 2)"));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, ["a"]], _read("(1 (a))"))) {
    failed = failed + 1;
    return "failed: expected " + str([1, ["a"]]) + ", was " + str(_read("(1 (a))"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quote", "a"], _read("'a"))) {
    failed = failed + 1;
    return "failed: expected " + str(["quote", "a"]) + ", was " + str(_read("'a"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", "a"], _read("`a"))) {
    failed = failed + 1;
    return "failed: expected " + str(["quasiquote", "a"]) + ", was " + str(_read("`a"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", ["unquote", "a"]], _read("`,a"))) {
    failed = failed + 1;
    return "failed: expected " + str(["quasiquote", ["unquote", "a"]]) + ", was " + str(_read("`,a"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", ["unquote-splicing", "a"]], _read("`,@a"))) {
    failed = failed + 1;
    return "failed: expected " + str(["quasiquote", ["unquote-splicing", "a"]]) + ", was " + str(_read("`,@a"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, _read("(1 2 a: 7)").length || 0)) {
    failed = failed + 1;
    return "failed: expected " + str(2) + ", was " + str(_read("(1 2 a: 7)").length || 0);
  } else {
    passed = passed + 1;
  }
  if (! equal63(7, _read("(1 2 a: 7)").a)) {
    failed = failed + 1;
    return "failed: expected " + str(7) + ", was " + str(_read("(1 2 a: 7)").a);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, _read("(:a)").a)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(_read("(:a)").a);
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, - -1)) {
    failed = failed + 1;
    return "failed: expected " + str(1) + ", was " + str(- -1);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, nan63(_read("nan")))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(nan63(_read("nan")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, nan63(_read("-nan")))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(nan63(_read("-nan")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, inf63(_read("inf")))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(inf63(_read("inf")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, inf63(_read("-inf")))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(inf63(_read("-inf")));
  } else {
    passed = passed + 1;
  }
  if (! equal63("0?", _read("0?"))) {
    failed = failed + 1;
    return "failed: expected " + str("0?") + ", was " + str(_read("0?"));
  } else {
    passed = passed + 1;
  }
  if (! equal63("0!", _read("0!"))) {
    failed = failed + 1;
    return "failed: expected " + str("0!") + ", was " + str(_read("0!"));
  } else {
    passed = passed + 1;
  }
  if (! equal63("0.", _read("0."))) {
    failed = failed + 1;
    return "failed: expected " + str("0.") + ", was " + str(_read("0."));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["read-more", function () {
  var _read1 = reader["read-string"];
  if (! equal63(17, _read1("17", true))) {
    failed = failed + 1;
    return "failed: expected " + str(17) + ", was " + str(_read1("17", true));
  } else {
    passed = passed + 1;
  }
  var _more = [];
  if (! equal63(_more, _read1("(open", _more))) {
    failed = failed + 1;
    return "failed: expected " + str(_more) + ", was " + str(_read1("(open", _more));
  } else {
    passed = passed + 1;
  }
  if (! equal63(_more, _read1("\"unterminated ", _more))) {
    failed = failed + 1;
    return "failed: expected " + str(_more) + ", was " + str(_read1("\"unterminated ", _more));
  } else {
    passed = passed + 1;
  }
  if (! equal63(_more, _read1("|identifier", _more))) {
    failed = failed + 1;
    return "failed: expected " + str(_more) + ", was " + str(_read1("|identifier", _more));
  } else {
    passed = passed + 1;
  }
  if (! equal63(_more, _read1("'(a b c", _more))) {
    failed = failed + 1;
    return "failed: expected " + str(_more) + ", was " + str(_read1("'(a b c", _more));
  } else {
    passed = passed + 1;
  }
  if (! equal63(_more, _read1("`(a b c", _more))) {
    failed = failed + 1;
    return "failed: expected " + str(_more) + ", was " + str(_read1("`(a b c", _more));
  } else {
    passed = passed + 1;
  }
  if (! equal63(_more, _read1("`(a b ,(z", _more))) {
    failed = failed + 1;
    return "failed: expected " + str(_more) + ", was " + str(_read1("`(a b ,(z", _more));
  } else {
    passed = passed + 1;
  }
  if (! equal63(_more, _read1("`\"biz", _more))) {
    failed = failed + 1;
    return "failed: expected " + str(_more) + ", was " + str(_read1("`\"biz", _more));
  } else {
    passed = passed + 1;
  }
  if (! equal63(_more, _read1("'\"boz", _more))) {
    failed = failed + 1;
    return "failed: expected " + str(_more) + ", was " + str(_read1("'\"boz", _more));
  } else {
    passed = passed + 1;
  }
  var __id3 = (function () {
    try {
      return [true, _read1("(open")];
    }
    catch (_e75) {
      return [false, _e75.message, _e75.stack];
    }
  })();
  var _ok = __id3[0];
  var _msg = __id3[1];
  if (! equal63(false, _ok)) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(_ok);
  } else {
    passed = passed + 1;
  }
  if (! equal63("Expected ) at 5", _msg)) {
    failed = failed + 1;
    return "failed: expected " + str("Expected ) at 5") + ", was " + str(_msg);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["bool", function () {
  if (! equal63(true, true || false)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(true || false);
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, false || false)) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(false || false);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, false || false || true)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(false || false || true);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, ! false)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(! false);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, !( false && true))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(!( false && true));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, !( false || true))) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(!( false || true));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, !( false && true))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(!( false && true));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, !( false || true))) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(!( false || true));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, true && true)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(true && true);
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, true && false)) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(true && false);
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, true && true && false)) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(true && true && false);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["short", function () {
  var _id58 = true;
  var _e7;
  if (_id58) {
    _e7 = _id58;
  } else {
    throw new Error("bad");
    _e7 = undefined;
  }
  if (! equal63(true, _e7)) {
    failed = failed + 1;
    var _id59 = true;
    var _e8;
    if (_id59) {
      _e8 = _id59;
    } else {
      throw new Error("bad");
      _e8 = undefined;
    }
    return "failed: expected " + str(true) + ", was " + str(_e8);
  } else {
    passed = passed + 1;
  }
  var _id60 = false;
  var _e9;
  if (_id60) {
    throw new Error("bad");
    _e9 = undefined;
  } else {
    _e9 = _id60;
  }
  if (! equal63(false, _e9)) {
    failed = failed + 1;
    var _id61 = false;
    var _e10;
    if (_id61) {
      throw new Error("bad");
      _e10 = undefined;
    } else {
      _e10 = _id61;
    }
    return "failed: expected " + str(false) + ", was " + str(_e10);
  } else {
    passed = passed + 1;
  }
  var _a = true;
  var _id62 = true;
  var _e11;
  if (_id62) {
    _e11 = _id62;
  } else {
    _a = false;
    _e11 = false;
  }
  if (! equal63(true, _e11)) {
    failed = failed + 1;
    var _id63 = true;
    var _e12;
    if (_id63) {
      _e12 = _id63;
    } else {
      _a = false;
      _e12 = false;
    }
    return "failed: expected " + str(true) + ", was " + str(_e12);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, _a)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(_a);
  } else {
    passed = passed + 1;
  }
  var _id64 = false;
  var _e13;
  if (_id64) {
    _a = false;
    _e13 = true;
  } else {
    _e13 = _id64;
  }
  if (! equal63(false, _e13)) {
    failed = failed + 1;
    var _id65 = false;
    var _e14;
    if (_id65) {
      _a = false;
      _e14 = true;
    } else {
      _e14 = _id65;
    }
    return "failed: expected " + str(false) + ", was " + str(_e14);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, _a)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(_a);
  } else {
    passed = passed + 1;
  }
  var _b = true;
  _b = false;
  var _id66 = false;
  var _e15;
  if (_id66) {
    _e15 = _id66;
  } else {
    _b = true;
    _e15 = _b;
  }
  if (! equal63(true, _e15)) {
    failed = failed + 1;
    _b = false;
    var _id67 = false;
    var _e16;
    if (_id67) {
      _e16 = _id67;
    } else {
      _b = true;
      _e16 = _b;
    }
    return "failed: expected " + str(true) + ", was " + str(_e16);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, _b)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(_b);
  } else {
    passed = passed + 1;
  }
  _b = true;
  var _id68 = _b;
  var _e17;
  if (_id68) {
    _e17 = _id68;
  } else {
    _b = true;
    _e17 = _b;
  }
  if (! equal63(true, _e17)) {
    failed = failed + 1;
    _b = true;
    var _id69 = _b;
    var _e18;
    if (_id69) {
      _e18 = _id69;
    } else {
      _b = true;
      _e18 = _b;
    }
    return "failed: expected " + str(true) + ", was " + str(_e18);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, _b)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(_b);
  } else {
    passed = passed + 1;
  }
  _b = false;
  var _id70 = true;
  var _e19;
  if (_id70) {
    _b = true;
    _e19 = _b;
  } else {
    _e19 = _id70;
  }
  if (! equal63(true, _e19)) {
    failed = failed + 1;
    _b = false;
    var _id71 = true;
    var _e20;
    if (_id71) {
      _b = true;
      _e20 = _b;
    } else {
      _e20 = _id71;
    }
    return "failed: expected " + str(true) + ", was " + str(_e20);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, _b)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(_b);
  } else {
    passed = passed + 1;
  }
  _b = false;
  var _id72 = _b;
  var _e21;
  if (_id72) {
    _b = true;
    _e21 = _b;
  } else {
    _e21 = _id72;
  }
  if (! equal63(false, _e21)) {
    failed = failed + 1;
    _b = false;
    var _id73 = _b;
    var _e22;
    if (_id73) {
      _b = true;
      _e22 = _b;
    } else {
      _e22 = _id73;
    }
    return "failed: expected " + str(false) + ", was " + str(_e22);
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, _b)) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(_b);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["numeric", function () {
  if (! equal63(4, 2 + 2)) {
    failed = failed + 1;
    return "failed: expected " + str(4) + ", was " + str(2 + 2);
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, apply(_43, [2, 2]))) {
    failed = failed + 1;
    return "failed: expected " + str(4) + ", was " + str(apply(_43, [2, 2]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(0, apply(_43, []))) {
    failed = failed + 1;
    return "failed: expected " + str(0) + ", was " + str(apply(_43, []));
  } else {
    passed = passed + 1;
  }
  if (! equal63(18, 18)) {
    failed = failed + 1;
    return "failed: expected " + str(18) + ", was " + str(18);
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, 7 - 3)) {
    failed = failed + 1;
    return "failed: expected " + str(4) + ", was " + str(7 - 3);
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, apply(_, [7, 3]))) {
    failed = failed + 1;
    return "failed: expected " + str(4) + ", was " + str(apply(_, [7, 3]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(0, apply(_, []))) {
    failed = failed + 1;
    return "failed: expected " + str(0) + ", was " + str(apply(_, []));
  } else {
    passed = passed + 1;
  }
  if (! equal63(5, 10 / 2)) {
    failed = failed + 1;
    return "failed: expected " + str(5) + ", was " + str(10 / 2);
  } else {
    passed = passed + 1;
  }
  if (! equal63(5, apply(_47, [10, 2]))) {
    failed = failed + 1;
    return "failed: expected " + str(5) + ", was " + str(apply(_47, [10, 2]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, apply(_47, []))) {
    failed = failed + 1;
    return "failed: expected " + str(1) + ", was " + str(apply(_47, []));
  } else {
    passed = passed + 1;
  }
  if (! equal63(6, 2 * 3)) {
    failed = failed + 1;
    return "failed: expected " + str(6) + ", was " + str(2 * 3);
  } else {
    passed = passed + 1;
  }
  if (! equal63(6, apply(_42, [2, 3]))) {
    failed = failed + 1;
    return "failed: expected " + str(6) + ", was " + str(apply(_42, [2, 3]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, apply(_42, []))) {
    failed = failed + 1;
    return "failed: expected " + str(1) + ", was " + str(apply(_42, []));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, 2.01 > 2)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(2.01 > 2);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, 5 >= 5)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(5 >= 5);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, 2100 > 2000)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(2100 > 2000);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, 0.002 < 0.0021)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(0.002 < 0.0021);
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, 2 < 2)) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(2 < 2);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, 2 <= 2)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(2 <= 2);
  } else {
    passed = passed + 1;
  }
  if (! equal63(-7, - 7)) {
    failed = failed + 1;
    return "failed: expected " + str(-7) + ", was " + str(- 7);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["math", function () {
  if (! equal63(3, max(1, 3))) {
    failed = failed + 1;
    return "failed: expected " + str(3) + ", was " + str(max(1, 3));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, min(2, 7))) {
    failed = failed + 1;
    return "failed: expected " + str(2) + ", was " + str(min(2, 7));
  } else {
    passed = passed + 1;
  }
  var _n1 = random();
  if (! equal63(true, _n1 > 0 && _n1 < 1)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(_n1 > 0 && _n1 < 1);
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, floor(4.78))) {
    failed = failed + 1;
    return "failed: expected " + str(4) + ", was " + str(floor(4.78));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["precedence", function () {
  if (! equal63(-3, -( 1 + 2))) {
    failed = failed + 1;
    return "failed: expected " + str(-3) + ", was " + str(-( 1 + 2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, 12 - (1 + 1))) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(12 - (1 + 1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(11, 12 - 1 * 1)) {
    failed = failed + 1;
    return "failed: expected " + str(11) + ", was " + str(12 - 1 * 1);
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, 4 / 2 + 8)) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(4 / 2 + 8);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["standalone", function () {
  if (! equal63(10, 10)) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(10);
  } else {
    passed = passed + 1;
  }
  var _x71 = undefined;
  _x71 = 10;
  if (! equal63(9, 9)) {
    failed = failed + 1;
    _x71 = 10;
    return "failed: expected " + str(9) + ", was " + str(9);
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, _x71)) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(_x71);
  } else {
    passed = passed + 1;
  }
  if (! equal63(12, 12)) {
    failed = failed + 1;
    return "failed: expected " + str(12) + ", was " + str(12);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["string", function () {
  if (! equal63(3, "foo".length || 0)) {
    failed = failed + 1;
    return "failed: expected " + str(3) + ", was " + str("foo".length || 0);
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, "\"a\"".length || 0)) {
    failed = failed + 1;
    return "failed: expected " + str(3) + ", was " + str("\"a\"".length || 0);
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", "a")) {
    failed = failed + 1;
    return "failed: expected " + str("a") + ", was " + str("a");
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", char("bar", 1))) {
    failed = failed + 1;
    return "failed: expected " + str("a") + ", was " + str(char("bar", 1));
  } else {
    passed = passed + 1;
  }
  var _s = "a\nb";
  if (! equal63(3, _s.length || 0)) {
    failed = failed + 1;
    return "failed: expected " + str(3) + ", was " + str(_s.length || 0);
  } else {
    passed = passed + 1;
  }
  var _s1 = "a\nb\nc";
  if (! equal63(5, _s1.length || 0)) {
    failed = failed + 1;
    return "failed: expected " + str(5) + ", was " + str(_s1.length || 0);
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, "a\nb".length || 0)) {
    failed = failed + 1;
    return "failed: expected " + str(3) + ", was " + str("a\nb".length || 0);
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, "a\\b".length || 0)) {
    failed = failed + 1;
    return "failed: expected " + str(3) + ", was " + str("a\\b".length || 0);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["quote", function () {
  if (! equal63(7, 7)) {
    failed = failed + 1;
    return "failed: expected " + str(7) + ", was " + str(7);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, true)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(true);
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, false)) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(false);
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", "a")) {
    failed = failed + 1;
    return "failed: expected " + str("a") + ", was " + str("a");
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quote", "a"], ["quote", "a"])) {
    failed = failed + 1;
    return "failed: expected " + str(["quote", "a"]) + ", was " + str(["quote", "a"]);
  } else {
    passed = passed + 1;
  }
  if (! equal63("\"a\"", "\"a\"")) {
    failed = failed + 1;
    return "failed: expected " + str("\"a\"") + ", was " + str("\"a\"");
  } else {
    passed = passed + 1;
  }
  if (! equal63("\"\\n\"", "\"\\n\"")) {
    failed = failed + 1;
    return "failed: expected " + str("\"\\n\"") + ", was " + str("\"\\n\"");
  } else {
    passed = passed + 1;
  }
  if (! equal63("\"\\\\\"", "\"\\\\\"")) {
    failed = failed + 1;
    return "failed: expected " + str("\"\\\\\"") + ", was " + str("\"\\\\\"");
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quote", "\"a\""], ["quote", "\"a\""])) {
    failed = failed + 1;
    return "failed: expected " + str(["quote", "\"a\""]) + ", was " + str(["quote", "\"a\""]);
  } else {
    passed = passed + 1;
  }
  if (! equal63("|(|", "|(|")) {
    failed = failed + 1;
    return "failed: expected " + str("|(|") + ", was " + str("|(|");
  } else {
    passed = passed + 1;
  }
  if (! equal63("unquote", "unquote")) {
    failed = failed + 1;
    return "failed: expected " + str("unquote") + ", was " + str("unquote");
  } else {
    passed = passed + 1;
  }
  if (! equal63(["unquote"], ["unquote"])) {
    failed = failed + 1;
    return "failed: expected " + str(["unquote"]) + ", was " + str(["unquote"]);
  } else {
    passed = passed + 1;
  }
  if (! equal63(["unquote", "a"], ["unquote", "a"])) {
    failed = failed + 1;
    return "failed: expected " + str(["unquote", "a"]) + ", was " + str(["unquote", "a"]);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["list", function () {
  if (! equal63([], [])) {
    failed = failed + 1;
    return "failed: expected " + str([]) + ", was " + str([]);
  } else {
    passed = passed + 1;
  }
  if (! equal63([], [])) {
    failed = failed + 1;
    return "failed: expected " + str([]) + ", was " + str([]);
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], ["a"])) {
    failed = failed + 1;
    return "failed: expected " + str(["a"]) + ", was " + str(["a"]);
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], ["a"])) {
    failed = failed + 1;
    return "failed: expected " + str(["a"]) + ", was " + str(["a"]);
  } else {
    passed = passed + 1;
  }
  if (! equal63([[]], [[]])) {
    failed = failed + 1;
    return "failed: expected " + str([[]]) + ", was " + str([[]]);
  } else {
    passed = passed + 1;
  }
  if (! equal63(0, [].length || 0)) {
    failed = failed + 1;
    return "failed: expected " + str(0) + ", was " + str([].length || 0);
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, [1, 2].length || 0)) {
    failed = failed + 1;
    return "failed: expected " + str(2) + ", was " + str([1, 2].length || 0);
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3], [1, 2, 3])) {
    failed = failed + 1;
    return "failed: expected " + str([1, 2, 3]) + ", was " + str([1, 2, 3]);
  } else {
    passed = passed + 1;
  }
  var __x123 = [];
  __x123.foo = 17;
  if (! equal63(17, __x123.foo)) {
    failed = failed + 1;
    var __x124 = [];
    __x124.foo = 17;
    return "failed: expected " + str(17) + ", was " + str(__x124.foo);
  } else {
    passed = passed + 1;
  }
  var __x125 = [1];
  __x125.foo = 17;
  if (! equal63(17, __x125.foo)) {
    failed = failed + 1;
    var __x126 = [1];
    __x126.foo = 17;
    return "failed: expected " + str(17) + ", was " + str(__x126.foo);
  } else {
    passed = passed + 1;
  }
  var __x127 = [];
  __x127.foo = true;
  if (! equal63(true, __x127.foo)) {
    failed = failed + 1;
    var __x128 = [];
    __x128.foo = true;
    return "failed: expected " + str(true) + ", was " + str(__x128.foo);
  } else {
    passed = passed + 1;
  }
  var __x129 = [];
  __x129.foo = true;
  if (! equal63(true, __x129.foo)) {
    failed = failed + 1;
    var __x130 = [];
    __x130.foo = true;
    return "failed: expected " + str(true) + ", was " + str(__x130.foo);
  } else {
    passed = passed + 1;
  }
  var __x132 = [];
  __x132.foo = true;
  if (! equal63(true, [__x132][0].foo)) {
    failed = failed + 1;
    var __x134 = [];
    __x134.foo = true;
    return "failed: expected " + str(true) + ", was " + str([__x134][0].foo);
  } else {
    passed = passed + 1;
  }
  var __x135 = [];
  __x135.a = true;
  var __x136 = [];
  __x136.a = true;
  if (! equal63(__x135, __x136)) {
    failed = failed + 1;
    var __x137 = [];
    __x137.a = true;
    var __x138 = [];
    __x138.a = true;
    return "failed: expected " + str(__x137) + ", was " + str(__x138);
  } else {
    passed = passed + 1;
  }
  var __x139 = [];
  __x139.b = false;
  var __x140 = [];
  __x140.b = false;
  if (! equal63(__x139, __x140)) {
    failed = failed + 1;
    var __x141 = [];
    __x141.b = false;
    var __x142 = [];
    __x142.b = false;
    return "failed: expected " + str(__x141) + ", was " + str(__x142);
  } else {
    passed = passed + 1;
  }
  var __x143 = [];
  __x143.c = 0;
  var __x144 = [];
  __x144.c = 0;
  if (! equal63(__x143, __x144)) {
    failed = failed + 1;
    var __x145 = [];
    __x145.c = 0;
    var __x146 = [];
    __x146.c = 0;
    return "failed: expected " + str(__x145) + ", was " + str(__x146);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["quasiquote", function () {
  if (! equal63("a", "a")) {
    failed = failed + 1;
    return "failed: expected " + str("a") + ", was " + str("a");
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", "a")) {
    failed = failed + 1;
    return "failed: expected " + str("a") + ", was " + str("a");
  } else {
    passed = passed + 1;
  }
  if (! equal63([], join())) {
    failed = failed + 1;
    return "failed: expected " + str([]) + ", was " + str(join());
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, 2)) {
    failed = failed + 1;
    return "failed: expected " + str(2) + ", was " + str(2);
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, undefined)) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(undefined);
  } else {
    passed = passed + 1;
  }
  var _a1 = 42;
  if (! equal63(42, _a1)) {
    failed = failed + 1;
    return "failed: expected " + str(42) + ", was " + str(_a1);
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, _a1)) {
    failed = failed + 1;
    return "failed: expected " + str(42) + ", was " + str(_a1);
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", ["unquote", "a"]], ["quasiquote", ["unquote", "a"]])) {
    failed = failed + 1;
    return "failed: expected " + str(["quasiquote", ["unquote", "a"]]) + ", was " + str(["quasiquote", ["unquote", "a"]]);
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", ["unquote", 42]], ["quasiquote", ["unquote", _a1]])) {
    failed = failed + 1;
    return "failed: expected " + str(["quasiquote", ["unquote", 42]]) + ", was " + str(["quasiquote", ["unquote", _a1]]);
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", ["quasiquote", ["unquote", ["unquote", "a"]]]], ["quasiquote", ["quasiquote", ["unquote", ["unquote", "a"]]]])) {
    failed = failed + 1;
    return "failed: expected " + str(["quasiquote", ["quasiquote", ["unquote", ["unquote", "a"]]]]) + ", was " + str(["quasiquote", ["quasiquote", ["unquote", ["unquote", "a"]]]]);
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", ["quasiquote", ["unquote", ["unquote", 42]]]], ["quasiquote", ["quasiquote", ["unquote", ["unquote", _a1]]]])) {
    failed = failed + 1;
    return "failed: expected " + str(["quasiquote", ["quasiquote", ["unquote", ["unquote", 42]]]]) + ", was " + str(["quasiquote", ["quasiquote", ["unquote", ["unquote", _a1]]]]);
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", ["quasiquote", ["b", ["unquote", "c"]]]], ["a", ["quasiquote", ["b", ["unquote", "c"]]]])) {
    failed = failed + 1;
    return "failed: expected " + str(["a", ["quasiquote", ["b", ["unquote", "c"]]]]) + ", was " + str(["a", ["quasiquote", ["b", ["unquote", "c"]]]]);
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", ["quasiquote", ["b", ["unquote", 42]]]], ["a", ["quasiquote", ["b", ["unquote", _a1]]]])) {
    failed = failed + 1;
    return "failed: expected " + str(["a", ["quasiquote", ["b", ["unquote", 42]]]]) + ", was " + str(["a", ["quasiquote", ["b", ["unquote", _a1]]]]);
  } else {
    passed = passed + 1;
  }
  var _b1 = "c";
  if (! equal63(["quote", "c"], ["quote", _b1])) {
    failed = failed + 1;
    return "failed: expected " + str(["quote", "c"]) + ", was " + str(["quote", _b1]);
  } else {
    passed = passed + 1;
  }
  if (! equal63([42], [_a1])) {
    failed = failed + 1;
    return "failed: expected " + str([42]) + ", was " + str([_a1]);
  } else {
    passed = passed + 1;
  }
  if (! equal63([[42]], [[_a1]])) {
    failed = failed + 1;
    return "failed: expected " + str([[42]]) + ", was " + str([[_a1]]);
  } else {
    passed = passed + 1;
  }
  if (! equal63([41, [42]], [41, [_a1]])) {
    failed = failed + 1;
    return "failed: expected " + str([41, [42]]) + ", was " + str([41, [_a1]]);
  } else {
    passed = passed + 1;
  }
  var _c = [1, 2, 3];
  if (! equal63([[1, 2, 3]], [_c])) {
    failed = failed + 1;
    return "failed: expected " + str([[1, 2, 3]]) + ", was " + str([_c]);
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3], _c)) {
    failed = failed + 1;
    return "failed: expected " + str([1, 2, 3]) + ", was " + str(_c);
  } else {
    passed = passed + 1;
  }
  if (! equal63([0, 1, 2, 3], join([0], _c))) {
    failed = failed + 1;
    return "failed: expected " + str([0, 1, 2, 3]) + ", was " + str(join([0], _c));
  } else {
    passed = passed + 1;
  }
  if (! equal63([0, 1, 2, 3, 4], join([0], _c, [4]))) {
    failed = failed + 1;
    return "failed: expected " + str([0, 1, 2, 3, 4]) + ", was " + str(join([0], _c, [4]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([0, [1, 2, 3], 4], [0, _c, 4])) {
    failed = failed + 1;
    return "failed: expected " + str([0, [1, 2, 3], 4]) + ", was " + str([0, _c, 4]);
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3, 1, 2, 3], join(_c, _c))) {
    failed = failed + 1;
    return "failed: expected " + str([1, 2, 3, 1, 2, 3]) + ", was " + str(join(_c, _c));
  } else {
    passed = passed + 1;
  }
  if (! equal63([[1, 2, 3], 1, 2, 3], join([_c], _c))) {
    failed = failed + 1;
    return "failed: expected " + str([[1, 2, 3], 1, 2, 3]) + ", was " + str(join([_c], _c));
  } else {
    passed = passed + 1;
  }
  var _a2 = 42;
  if (! equal63(["quasiquote", [["unquote-splicing", ["list", "a"]]]], ["quasiquote", [["unquote-splicing", ["list", "a"]]]])) {
    failed = failed + 1;
    return "failed: expected " + str(["quasiquote", [["unquote-splicing", ["list", "a"]]]]) + ", was " + str(["quasiquote", [["unquote-splicing", ["list", "a"]]]]);
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", [["unquote-splicing", ["list", 42]]]], ["quasiquote", [["unquote-splicing", ["list", _a2]]]])) {
    failed = failed + 1;
    return "failed: expected " + str(["quasiquote", [["unquote-splicing", ["list", 42]]]]) + ", was " + str(["quasiquote", [["unquote-splicing", ["list", _a2]]]]);
  } else {
    passed = passed + 1;
  }
  var __x317 = [];
  __x317.foo = true;
  if (! equal63(true, __x317.foo)) {
    failed = failed + 1;
    var __x318 = [];
    __x318.foo = true;
    return "failed: expected " + str(true) + ", was " + str(__x318.foo);
  } else {
    passed = passed + 1;
  }
  var _a3 = 17;
  var _b2 = [1, 2];
  var _c1 = {["a"]: 10};
  var __x320 = [];
  __x320.a = 10;
  var _d = __x320;
  var __x321 = [];
  __x321.foo = _a3;
  if (! equal63(17, __x321.foo)) {
    failed = failed + 1;
    var __x322 = [];
    __x322.foo = _a3;
    return "failed: expected " + str(17) + ", was " + str(__x322.foo);
  } else {
    passed = passed + 1;
  }
  var __x323 = [];
  __x323.foo = _a3;
  if (! equal63(2, join(__x323, _b2).length || 0)) {
    failed = failed + 1;
    var __x324 = [];
    __x324.foo = _a3;
    return "failed: expected " + str(2) + ", was " + str(join(__x324, _b2).length || 0);
  } else {
    passed = passed + 1;
  }
  var __x325 = [];
  __x325.foo = _a3;
  if (! equal63(17, __x325.foo)) {
    failed = failed + 1;
    var __x326 = [];
    __x326.foo = _a3;
    return "failed: expected " + str(17) + ", was " + str(__x326.foo);
  } else {
    passed = passed + 1;
  }
  var __x327 = [1];
  __x327.a = 10;
  if (! equal63(__x327, join([1], _c1))) {
    failed = failed + 1;
    var __x329 = [1];
    __x329.a = 10;
    return "failed: expected " + str(__x329) + ", was " + str(join([1], _c1));
  } else {
    passed = passed + 1;
  }
  var __x331 = [1];
  __x331.a = 10;
  if (! equal63(__x331, join([1], _d))) {
    failed = failed + 1;
    var __x333 = [1];
    __x333.a = 10;
    return "failed: expected " + str(__x333) + ", was " + str(join([1], _d));
  } else {
    passed = passed + 1;
  }
  var __x336 = [];
  __x336.foo = true;
  if (! equal63(true, [__x336][0].foo)) {
    failed = failed + 1;
    var __x338 = [];
    __x338.foo = true;
    return "failed: expected " + str(true) + ", was " + str([__x338][0].foo);
  } else {
    passed = passed + 1;
  }
  var __x340 = [];
  __x340.foo = true;
  if (! equal63(true, [__x340][0].foo)) {
    failed = failed + 1;
    var __x342 = [];
    __x342.foo = true;
    return "failed: expected " + str(true) + ", was " + str([__x342][0].foo);
  } else {
    passed = passed + 1;
  }
  var __x343 = [];
  __x343.foo = true;
  if (! equal63(true, __x343.foo)) {
    failed = failed + 1;
    var __x344 = [];
    __x344.foo = true;
    return "failed: expected " + str(true) + ", was " + str(__x344.foo);
  } else {
    passed = passed + 1;
  }
  var __x346 = [];
  __x346.foo = true;
  if (! equal63(true, join([1, 2, 3], __x346).foo)) {
    failed = failed + 1;
    var __x348 = [];
    __x348.foo = true;
    return "failed: expected " + str(true) + ", was " + str(join([1, 2, 3], __x348).foo);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, {["foo"]: true}.foo)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str({["foo"]: true}.foo);
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, {["bar"]: 17}.bar)) {
    failed = failed + 1;
    return "failed: expected " + str(17) + ", was " + str({["bar"]: 17}.bar);
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, {["baz"]: function () {
    return 17;
  }}.baz())) {
    failed = failed + 1;
    return "failed: expected " + str(17) + ", was " + str({["baz"]: function () {
      return 17;
    }}.baz());
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["quasiexpand", function () {
  if (! equal63("a", macroexpand("a"))) {
    failed = failed + 1;
    return "failed: expected " + str("a") + ", was " + str(macroexpand("a"));
  } else {
    passed = passed + 1;
  }
  if (! equal63([17], macroexpand([17]))) {
    failed = failed + 1;
    return "failed: expected " + str([17]) + ", was " + str(macroexpand([17]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, "z"], macroexpand([1, "z"]))) {
    failed = failed + 1;
    return "failed: expected " + str([1, "z"]) + ", was " + str(macroexpand([1, "z"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", 1, "\"z\""], macroexpand(["quasiquote", [1, "z"]]))) {
    failed = failed + 1;
    return "failed: expected " + str(["%array", 1, "\"z\""]) + ", was " + str(macroexpand(["quasiquote", [1, "z"]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", 1, "z"], macroexpand(["quasiquote", [["unquote", 1], ["unquote", "z"]]]))) {
    failed = failed + 1;
    return "failed: expected " + str(["%array", 1, "z"]) + ", was " + str(macroexpand(["quasiquote", [["unquote", 1], ["unquote", "z"]]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63("z", macroexpand(["quasiquote", [["unquote-splicing", "z"]]]))) {
    failed = failed + 1;
    return "failed: expected " + str("z") + ", was " + str(macroexpand(["quasiquote", [["unquote-splicing", "z"]]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["join", ["%array", 1], "z"], macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "z"]]]))) {
    failed = failed + 1;
    return "failed: expected " + str(["join", ["%array", 1], "z"]) + ", was " + str(macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "z"]]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["join", ["%array", 1], "x", "y"], macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "x"], ["unquote-splicing", "y"]]]))) {
    failed = failed + 1;
    return "failed: expected " + str(["join", ["%array", 1], "x", "y"]) + ", was " + str(macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "x"], ["unquote-splicing", "y"]]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["join", ["%array", 1], "z", ["%array", 2]], macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "z"], ["unquote", 2]]]))) {
    failed = failed + 1;
    return "failed: expected " + str(["join", ["%array", 1], "z", ["%array", 2]]) + ", was " + str(macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "z"], ["unquote", 2]]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["join", ["%array", 1], "z", ["%array", "\"a\""]], macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "z"], "a"]]))) {
    failed = failed + 1;
    return "failed: expected " + str(["join", ["%array", 1], "z", ["%array", "\"a\""]]) + ", was " + str(macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "z"], "a"]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63("\"x\"", macroexpand(["quasiquote", "x"]))) {
    failed = failed + 1;
    return "failed: expected " + str("\"x\"") + ", was " + str(macroexpand(["quasiquote", "x"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", "\"quasiquote\"", "\"x\""], macroexpand(["quasiquote", ["quasiquote", "x"]]))) {
    failed = failed + 1;
    return "failed: expected " + str(["%array", "\"quasiquote\"", "\"x\""]) + ", was " + str(macroexpand(["quasiquote", ["quasiquote", "x"]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", "\"quasiquote\"", ["%array", "\"quasiquote\"", "\"x\""]], macroexpand(["quasiquote", ["quasiquote", ["quasiquote", "x"]]]))) {
    failed = failed + 1;
    return "failed: expected " + str(["%array", "\"quasiquote\"", ["%array", "\"quasiquote\"", "\"x\""]]) + ", was " + str(macroexpand(["quasiquote", ["quasiquote", ["quasiquote", "x"]]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63("x", macroexpand(["quasiquote", ["unquote", "x"]]))) {
    failed = failed + 1;
    return "failed: expected " + str("x") + ", was " + str(macroexpand(["quasiquote", ["unquote", "x"]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", "\"quote\"", "x"], macroexpand(["quasiquote", ["quote", ["unquote", "x"]]]))) {
    failed = failed + 1;
    return "failed: expected " + str(["%array", "\"quote\"", "x"]) + ", was " + str(macroexpand(["quasiquote", ["quote", ["unquote", "x"]]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", "\"quasiquote\"", ["%array", "\"x\""]], macroexpand(["quasiquote", ["quasiquote", ["x"]]]))) {
    failed = failed + 1;
    return "failed: expected " + str(["%array", "\"quasiquote\"", ["%array", "\"x\""]]) + ", was " + str(macroexpand(["quasiquote", ["quasiquote", ["x"]]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", "\"quasiquote\"", ["%array", "\"unquote\"", "\"a\""]], macroexpand(["quasiquote", ["quasiquote", ["unquote", "a"]]]))) {
    failed = failed + 1;
    return "failed: expected " + str(["%array", "\"quasiquote\"", ["%array", "\"unquote\"", "\"a\""]]) + ", was " + str(macroexpand(["quasiquote", ["quasiquote", ["unquote", "a"]]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", "\"quasiquote\"", ["%array", ["%array", "\"unquote\"", "\"x\""]]], macroexpand(["quasiquote", ["quasiquote", [["unquote", "x"]]]]))) {
    failed = failed + 1;
    return "failed: expected " + str(["%array", "\"quasiquote\"", ["%array", ["%array", "\"unquote\"", "\"x\""]]]) + ", was " + str(macroexpand(["quasiquote", ["quasiquote", [["unquote", "x"]]]]));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["calls", function () {
  var _f1 = function () {
    return 42;
  };
  var _l1 = [_f1];
  var _o = {["f"]: _f1};
  if (! equal63(42, _f1())) {
    failed = failed + 1;
    return "failed: expected " + str(42) + ", was " + str(_f1());
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, _l1[0]())) {
    failed = failed + 1;
    return "failed: expected " + str(42) + ", was " + str(_l1[0]());
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, _o.f())) {
    failed = failed + 1;
    return "failed: expected " + str(42) + ", was " + str(_o.f());
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, (function () {
    return;
  })())) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str((function () {
      return;
    })());
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, (function (_) {
    return _ - 2;
  })(12))) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str((function (_) {
      return _ - 2;
    })(12));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["id", function () {
  var _a4 = 10;
  var _b3 = {["x"]: 20};
  var _f2 = function () {
    return 30;
  };
  if (! equal63(10, _a4)) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(_a4);
  } else {
    passed = passed + 1;
  }
  if (! equal63(20, _b3.x)) {
    failed = failed + 1;
    return "failed: expected " + str(20) + ", was " + str(_b3.x);
  } else {
    passed = passed + 1;
  }
  if (! equal63(30, _f2())) {
    failed = failed + 1;
    return "failed: expected " + str(30) + ", was " + str(_f2());
  } else {
    passed = passed + 1;
  }
  var x = 0;
  x = x + 1;
  x = x + 1;
  var y = x;
  if (! equal63(2, y)) {
    failed = failed + 1;
    return "failed: expected " + str(2) + ", was " + str(y);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["names", function () {
  var _a33 = 0;
  var _b63 = 1;
  var __37 = 2;
  var _4242 = 3;
  var _break = 4;
  if (! equal63(0, _a33)) {
    failed = failed + 1;
    return "failed: expected " + str(0) + ", was " + str(_a33);
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, _b63)) {
    failed = failed + 1;
    return "failed: expected " + str(1) + ", was " + str(_b63);
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, __37)) {
    failed = failed + 1;
    return "failed: expected " + str(2) + ", was " + str(__37);
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, _4242)) {
    failed = failed + 1;
    return "failed: expected " + str(3) + ", was " + str(_4242);
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, _break)) {
    failed = failed + 1;
    return "failed: expected " + str(4) + ", was " + str(_break);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["assign", function () {
  var _a5 = 42;
  _a5 = "bar";
  if (! equal63("bar", _a5)) {
    failed = failed + 1;
    return "failed: expected " + str("bar") + ", was " + str(_a5);
  } else {
    passed = passed + 1;
  }
  _a5 = 10;
  var _x510 = _a5;
  if (! equal63(10, _x510)) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(_x510);
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, _a5)) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(_a5);
  } else {
    passed = passed + 1;
  }
  _a5 = false;
  if (! equal63(false, _a5)) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(_a5);
  } else {
    passed = passed + 1;
  }
  _a5 = undefined;
  if (! equal63(undefined, _a5)) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(_a5);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["=", function () {
  var _a6 = 42;
  var _b4 = 7;
  _a6 = "foo";
  _b4 = "bar";
  if (! equal63("foo", _a6)) {
    failed = failed + 1;
    return "failed: expected " + str("foo") + ", was " + str(_a6);
  } else {
    passed = passed + 1;
  }
  if (! equal63("bar", _b4)) {
    failed = failed + 1;
    return "failed: expected " + str("bar") + ", was " + str(_b4);
  } else {
    passed = passed + 1;
  }
  _a6 = 10;
  var _x512 = _a6;
  if (! equal63(10, _x512)) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(_x512);
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, _a6)) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(_a6);
  } else {
    passed = passed + 1;
  }
  _a6 = false;
  if (! equal63(false, _a6)) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(_a6);
  } else {
    passed = passed + 1;
  }
  _a6 = undefined;
  if (! equal63(undefined, _a6)) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(_a6);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["wipe", function () {
  var __x515 = [];
  __x515.a = true;
  __x515.b = true;
  __x515.c = true;
  var _x514 = __x515;
  delete _x514.a;
  if (! equal63(undefined, _x514.a)) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(_x514.a);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, _x514.b)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(_x514.b);
  } else {
    passed = passed + 1;
  }
  delete _x514.c;
  if (! equal63(undefined, _x514.c)) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(_x514.c);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, _x514.b)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(_x514.b);
  } else {
    passed = passed + 1;
  }
  delete _x514.b;
  if (! equal63(undefined, _x514.b)) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(_x514.b);
  } else {
    passed = passed + 1;
  }
  if (! equal63([], _x514)) {
    failed = failed + 1;
    return "failed: expected " + str([]) + ", was " + str(_x514);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["do", function () {
  var _a7 = 17;
  _a7 = 10;
  if (! equal63(10, _a7)) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(_a7);
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, _a7)) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(_a7);
  } else {
    passed = passed + 1;
  }
  _a7 = 2;
  var _b5 = _a7 + 5;
  if (! equal63(_a7, 2)) {
    failed = failed + 1;
    return "failed: expected " + str(_a7) + ", was " + str(2);
  } else {
    passed = passed + 1;
  }
  if (! equal63(_b5, 7)) {
    failed = failed + 1;
    return "failed: expected " + str(_b5) + ", was " + str(7);
  } else {
    passed = passed + 1;
  }
  _a7 = 10;
  _a7 = 20;
  if (! equal63(20, _a7)) {
    failed = failed + 1;
    return "failed: expected " + str(20) + ", was " + str(_a7);
  } else {
    passed = passed + 1;
  }
  _a7 = 10;
  _a7 = 20;
  if (! equal63(20, _a7)) {
    failed = failed + 1;
    _a7 = 10;
    _a7 = 20;
    return "failed: expected " + str(20) + ", was " + str(_a7);
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, (function () {
    var _e23;
    if (true) {
      return 42;
    } else {
      _e23 = 2;
    }
    return _e23;
  })())) {
    failed = failed + 1;
    return "failed: expected " + str(42) + ", was " + str((function () {
      var _e24;
      if (true) {
        return 42;
      } else {
        _e24 = 2;
      }
      return _e24;
    })());
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, (function () {
    var _x517 = 1;
    var _e25;
    if (true) {
      _e25 = 42;
    } else {
      _e25 = _x517;
    }
    return _e25;
  })())) {
    failed = failed + 1;
    return "failed: expected " + str(42) + ", was " + str((function () {
      var _x518 = 1;
      var _e26;
      if (true) {
        _e26 = 42;
      } else {
        _e26 = _x518;
      }
      return _e26;
    })());
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, (function () {
    var _x519 = 42;
    while (true) {
      var _e27;
      if (true) {
        break;
      }
      if (! _e27) {
        break;
      }
    }
    return _x519;
  })())) {
    failed = failed + 1;
    return "failed: expected " + str(42) + ", was " + str((function () {
      var _x520 = 42;
      while (true) {
        var _e28;
        if (true) {
          break;
        }
        if (! _e28) {
          break;
        }
      }
      return _x520;
    })());
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, (function () {
    var _x521 = 42;
    while (true) {
      var _e29;
      if (true) {
        break;
      }
      if (! _e29) {
        break;
      }
    }
    return _x521;
  })())) {
    failed = failed + 1;
    return "failed: expected " + str(42) + ", was " + str((function () {
      var _x522 = 42;
      while (true) {
        var _e30;
        if (true) {
          break;
        }
        if (! _e30) {
          break;
        }
      }
      return _x522;
    })());
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["if", function () {
  if (! equal63("a", macroexpand(["if", "a"]))) {
    failed = failed + 1;
    return "failed: expected " + str("a") + ", was " + str(macroexpand(["if", "a"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%if", "a", "b"], macroexpand(["if", "a", "b"]))) {
    failed = failed + 1;
    return "failed: expected " + str(["%if", "a", "b"]) + ", was " + str(macroexpand(["if", "a", "b"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%if", "a", "b", "c"], macroexpand(["if", "a", "b", "c"]))) {
    failed = failed + 1;
    return "failed: expected " + str(["%if", "a", "b", "c"]) + ", was " + str(macroexpand(["if", "a", "b", "c"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%if", "a", "b", ["%if", "c", "d"]], macroexpand(["if", "a", "b", "c", "d"]))) {
    failed = failed + 1;
    return "failed: expected " + str(["%if", "a", "b", ["%if", "c", "d"]]) + ", was " + str(macroexpand(["if", "a", "b", "c", "d"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%if", "a", "b", ["%if", "c", "d", "e"]], macroexpand(["if", "a", "b", "c", "d", "e"]))) {
    failed = failed + 1;
    return "failed: expected " + str(["%if", "a", "b", ["%if", "c", "d", "e"]]) + ", was " + str(macroexpand(["if", "a", "b", "c", "d", "e"]));
  } else {
    passed = passed + 1;
  }
  if (true) {
    if (! equal63(true, true)) {
      failed = failed + 1;
      return "failed: expected " + str(true) + ", was " + str(true);
    } else {
      passed = passed + 1;
    }
  } else {
    if (! equal63(true, false)) {
      failed = failed + 1;
      return "failed: expected " + str(true) + ", was " + str(false);
    } else {
      passed = passed + 1;
    }
  }
  if (false) {
    if (! equal63(true, false)) {
      failed = failed + 1;
      return "failed: expected " + str(true) + ", was " + str(false);
    } else {
      passed = passed + 1;
    }
  } else {
    if (false) {
      if (! equal63(false, true)) {
        failed = failed + 1;
        return "failed: expected " + str(false) + ", was " + str(true);
      } else {
        passed = passed + 1;
      }
    } else {
      if (! equal63(true, true)) {
        failed = failed + 1;
        return "failed: expected " + str(true) + ", was " + str(true);
      } else {
        passed = passed + 1;
      }
    }
  }
  if (false) {
    if (! equal63(true, false)) {
      failed = failed + 1;
      return "failed: expected " + str(true) + ", was " + str(false);
    } else {
      passed = passed + 1;
    }
  } else {
    if (false) {
      if (! equal63(false, true)) {
        failed = failed + 1;
        return "failed: expected " + str(false) + ", was " + str(true);
      } else {
        passed = passed + 1;
      }
    } else {
      if (false) {
        if (! equal63(false, true)) {
          failed = failed + 1;
          return "failed: expected " + str(false) + ", was " + str(true);
        } else {
          passed = passed + 1;
        }
      } else {
        if (! equal63(true, true)) {
          failed = failed + 1;
          return "failed: expected " + str(true) + ", was " + str(true);
        } else {
          passed = passed + 1;
        }
      }
    }
  }
  if (false) {
    if (! equal63(true, false)) {
      failed = failed + 1;
      return "failed: expected " + str(true) + ", was " + str(false);
    } else {
      passed = passed + 1;
    }
  } else {
    if (true) {
      if (! equal63(true, true)) {
        failed = failed + 1;
        return "failed: expected " + str(true) + ", was " + str(true);
      } else {
        passed = passed + 1;
      }
    } else {
      if (false) {
        if (! equal63(false, true)) {
          failed = failed + 1;
          return "failed: expected " + str(false) + ", was " + str(true);
        } else {
          passed = passed + 1;
        }
      } else {
        if (! equal63(true, true)) {
          failed = failed + 1;
          return "failed: expected " + str(true) + ", was " + str(true);
        } else {
          passed = passed + 1;
        }
      }
    }
  }
  var _e31;
  if (true) {
    _e31 = 1;
  } else {
    _e31 = 2;
  }
  if (! equal63(1, _e31)) {
    failed = failed + 1;
    var _e32;
    if (true) {
      _e32 = 1;
    } else {
      _e32 = 2;
    }
    return "failed: expected " + str(1) + ", was " + str(_e32);
  } else {
    passed = passed + 1;
  }
  var _e33;
  var _a8 = 10;
  if (_a8) {
    _e33 = 1;
  } else {
    _e33 = 2;
  }
  if (! equal63(1, _e33)) {
    failed = failed + 1;
    var _e34;
    var _a9 = 10;
    if (_a9) {
      _e34 = 1;
    } else {
      _e34 = 2;
    }
    return "failed: expected " + str(1) + ", was " + str(_e34);
  } else {
    passed = passed + 1;
  }
  var _e35;
  if (true) {
    var _a10 = 1;
    _e35 = _a10;
  } else {
    _e35 = 2;
  }
  if (! equal63(1, _e35)) {
    failed = failed + 1;
    var _e36;
    if (true) {
      var _a11 = 1;
      _e36 = _a11;
    } else {
      _e36 = 2;
    }
    return "failed: expected " + str(1) + ", was " + str(_e36);
  } else {
    passed = passed + 1;
  }
  var _e37;
  if (false) {
    _e37 = 2;
  } else {
    var _a12 = 1;
    _e37 = _a12;
  }
  if (! equal63(1, _e37)) {
    failed = failed + 1;
    var _e38;
    if (false) {
      _e38 = 2;
    } else {
      var _a13 = 1;
      _e38 = _a13;
    }
    return "failed: expected " + str(1) + ", was " + str(_e38);
  } else {
    passed = passed + 1;
  }
  var _e39;
  if (false) {
    _e39 = 2;
  } else {
    var _e40;
    if (true) {
      var _a14 = 1;
      _e40 = _a14;
    }
    _e39 = _e40;
  }
  if (! equal63(1, _e39)) {
    failed = failed + 1;
    var _e41;
    if (false) {
      _e41 = 2;
    } else {
      var _e42;
      if (true) {
        var _a15 = 1;
        _e42 = _a15;
      }
      _e41 = _e42;
    }
    return "failed: expected " + str(1) + ", was " + str(_e41);
  } else {
    passed = passed + 1;
  }
  var _e43;
  if (false) {
    _e43 = 2;
  } else {
    var _e44;
    if (false) {
      _e44 = 3;
    } else {
      var _a16 = 1;
      _e44 = _a16;
    }
    _e43 = _e44;
  }
  if (! equal63(1, _e43)) {
    failed = failed + 1;
    var _e45;
    if (false) {
      _e45 = 2;
    } else {
      var _e46;
      if (false) {
        _e46 = 3;
      } else {
        var _a17 = 1;
        _e46 = _a17;
      }
      _e45 = _e46;
    }
    return "failed: expected " + str(1) + ", was " + str(_e45);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["case", function () {
  var _x547 = 10;
  var __e = _x547;
  var _e47;
  if (9 === __e) {
    _e47 = 9;
  } else {
    var _e48;
    if (10 === __e) {
      _e48 = 2;
    } else {
      _e48 = 4;
    }
    _e47 = _e48;
  }
  if (! equal63(2, _e47)) {
    failed = failed + 1;
    var __e1 = _x547;
    var _e49;
    if (9 === __e1) {
      _e49 = 9;
    } else {
      var _e50;
      if (10 === __e1) {
        _e50 = 2;
      } else {
        _e50 = 4;
      }
      _e49 = _e50;
    }
    return "failed: expected " + str(2) + ", was " + str(_e49);
  } else {
    passed = passed + 1;
  }
  var _x548 = "z";
  var __e2 = _x548;
  var _e51;
  if ("z" === __e2) {
    _e51 = 9;
  } else {
    _e51 = 10;
  }
  if (! equal63(9, _e51)) {
    failed = failed + 1;
    var __e3 = _x548;
    var _e52;
    if ("z" === __e3) {
      _e52 = 9;
    } else {
      _e52 = 10;
    }
    return "failed: expected " + str(9) + ", was " + str(_e52);
  } else {
    passed = passed + 1;
  }
  var __e4 = _x548;
  var _e53;
  if ("a" === __e4) {
    _e53 = 1;
  } else {
    var _e54;
    if ("b" === __e4) {
      _e54 = 2;
    } else {
      _e54 = 7;
    }
    _e53 = _e54;
  }
  if (! equal63(7, _e53)) {
    failed = failed + 1;
    var __e5 = _x548;
    var _e55;
    if ("a" === __e5) {
      _e55 = 1;
    } else {
      var _e56;
      if ("b" === __e5) {
        _e56 = 2;
      } else {
        _e56 = 7;
      }
      _e55 = _e56;
    }
    return "failed: expected " + str(7) + ", was " + str(_e55);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["while", function () {
  var _i1 = 0;
  while (_i1 < 5) {
    if (_i1 === 3) {
      break;
    } else {
      _i1 = _i1 + 1;
    }
  }
  if (! equal63(3, _i1)) {
    failed = failed + 1;
    return "failed: expected " + str(3) + ", was " + str(_i1);
  } else {
    passed = passed + 1;
  }
  while (_i1 < 10) {
    _i1 = _i1 + 1;
  }
  if (! equal63(10, _i1)) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(_i1);
  } else {
    passed = passed + 1;
  }
  while (_i1 < 15) {
    _i1 = _i1 + 1;
  }
  var _a18;
  if (! equal63(undefined, _a18)) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(_a18);
  } else {
    passed = passed + 1;
  }
  if (! equal63(15, _i1)) {
    failed = failed + 1;
    return "failed: expected " + str(15) + ", was " + str(_i1);
  } else {
    passed = passed + 1;
  }
  while (_i1 < 20) {
    if (_i1 === 19) {
      break;
    } else {
      _i1 = _i1 + 1;
    }
  }
  var _b6;
  if (! equal63(undefined, _b6)) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(_b6);
  } else {
    passed = passed + 1;
  }
  if (! equal63(19, _i1)) {
    failed = failed + 1;
    return "failed: expected " + str(19) + ", was " + str(_i1);
  } else {
    passed = passed + 1;
  }
  while (true) {
    _i1 = _i1 + 1;
    var _j = _i1;
    if (!( _j < 21)) {
      break;
    }
  }
  if (! equal63(21, _i1)) {
    failed = failed + 1;
    return "failed: expected " + str(21) + ", was " + str(_i1);
  } else {
    passed = passed + 1;
  }
  while (true) {
    var _e57;
    if (false) {
      _i1 = _i1 + 1;
      _e57 = _i1;
    }
    if (! _e57) {
      break;
    }
  }
  if (! equal63(21, _i1)) {
    failed = failed + 1;
    return "failed: expected " + str(21) + ", was " + str(_i1);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["for", function () {
  var _l2 = [];
  var _i2 = 0;
  while (_i2 < 5) {
    add(_l2, _i2);
    _i2 = _i2 + 1;
  }
  if (! equal63([0, 1, 2, 3, 4], _l2)) {
    failed = failed + 1;
    return "failed: expected " + str([0, 1, 2, 3, 4]) + ", was " + str(_l2);
  } else {
    passed = passed + 1;
  }
  var _l3 = [];
  var _i3 = 0;
  while (_i3 < 2) {
    add(_l3, _i3);
    _i3 = _i3 + 1;
  }
  if (! equal63([0, 1], _l3)) {
    failed = failed + 1;
    var _l4 = [];
    var _i4 = 0;
    while (_i4 < 2) {
      add(_l4, _i4);
      _i4 = _i4 + 1;
    }
    return "failed: expected " + str([0, 1]) + ", was " + str(_l4);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["table", function () {
  if (! equal63(10, {["a"]: 10}.a)) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str({["a"]: 10}.a);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, {["a"]: true}.a)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str({["a"]: true}.a);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["empty", function () {
  if (! equal63(true, empty63([]))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(empty63([]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, empty63({}))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(empty63({}));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, empty63([1]))) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(empty63([1]));
  } else {
    passed = passed + 1;
  }
  var __x559 = [];
  __x559.a = true;
  if (! equal63(false, empty63(__x559))) {
    failed = failed + 1;
    var __x560 = [];
    __x560.a = true;
    return "failed: expected " + str(false) + ", was " + str(empty63(__x560));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, empty63({["a"]: true}))) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(empty63({["a"]: true}));
  } else {
    passed = passed + 1;
  }
  var __x561 = [];
  __x561.b = false;
  if (! equal63(false, empty63(__x561))) {
    failed = failed + 1;
    var __x562 = [];
    __x562.b = false;
    return "failed: expected " + str(false) + ", was " + str(empty63(__x562));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["at", function () {
  var _l5 = ["a", "b", "c", "d"];
  if (! equal63("a", _l5[0])) {
    failed = failed + 1;
    return "failed: expected " + str("a") + ", was " + str(_l5[0]);
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", _l5[0])) {
    failed = failed + 1;
    return "failed: expected " + str("a") + ", was " + str(_l5[0]);
  } else {
    passed = passed + 1;
  }
  if (! equal63("b", _l5[1])) {
    failed = failed + 1;
    return "failed: expected " + str("b") + ", was " + str(_l5[1]);
  } else {
    passed = passed + 1;
  }
  if (! equal63("d", _l5[(_l5.length || 0) + -1])) {
    failed = failed + 1;
    return "failed: expected " + str("d") + ", was " + str(_l5[(_l5.length || 0) + -1]);
  } else {
    passed = passed + 1;
  }
  if (! equal63("c", _l5[(_l5.length || 0) + -2])) {
    failed = failed + 1;
    return "failed: expected " + str("c") + ", was " + str(_l5[(_l5.length || 0) + -2]);
  } else {
    passed = passed + 1;
  }
  _l5[0] = 9;
  if (! equal63(9, _l5[0])) {
    failed = failed + 1;
    return "failed: expected " + str(9) + ", was " + str(_l5[0]);
  } else {
    passed = passed + 1;
  }
  _l5[3] = 10;
  if (! equal63(10, _l5[3])) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(_l5[3]);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["get-=", function () {
  var _l6 = {};
  _l6.foo = "bar";
  if (! equal63("bar", _l6.foo)) {
    failed = failed + 1;
    return "failed: expected " + str("bar") + ", was " + str(_l6.foo);
  } else {
    passed = passed + 1;
  }
  if (! equal63("bar", _l6.foo)) {
    failed = failed + 1;
    return "failed: expected " + str("bar") + ", was " + str(_l6.foo);
  } else {
    passed = passed + 1;
  }
  if (! equal63("bar", _l6.foo)) {
    failed = failed + 1;
    return "failed: expected " + str("bar") + ", was " + str(_l6.foo);
  } else {
    passed = passed + 1;
  }
  var _k = "foo";
  if (! equal63("bar", _l6[_k])) {
    failed = failed + 1;
    return "failed: expected " + str("bar") + ", was " + str(_l6[_k]);
  } else {
    passed = passed + 1;
  }
  if (! equal63("bar", _l6["f" + "oo"])) {
    failed = failed + 1;
    return "failed: expected " + str("bar") + ", was " + str(_l6["f" + "oo"]);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["each", function () {
  var __x567 = [1, 2, 3];
  __x567.a = true;
  __x567.b = false;
  var _l7 = __x567;
  var _a19 = 0;
  var _b7 = 0;
  var __l8 = _l7;
  var _k1 = undefined;
  for (_k1 in __l8) {
    var _v = __l8[_k1];
    var _e58;
    if (numeric63(_k1)) {
      _e58 = parseInt(_k1);
    } else {
      _e58 = _k1;
    }
    var _k2 = _e58;
    if (typeof(_k2) === "number") {
      _a19 = _a19 + 1;
    } else {
      _b7 = _b7 + 1;
    }
  }
  if (! equal63(3, _a19)) {
    failed = failed + 1;
    return "failed: expected " + str(3) + ", was " + str(_a19);
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, _b7)) {
    failed = failed + 1;
    return "failed: expected " + str(2) + ", was " + str(_b7);
  } else {
    passed = passed + 1;
  }
  var _a20 = 0;
  var __l9 = _l7;
  var __i6 = undefined;
  for (__i6 in __l9) {
    var _x568 = __l9[__i6];
    var _e59;
    if (numeric63(__i6)) {
      _e59 = parseInt(__i6);
    } else {
      _e59 = __i6;
    }
    var __i61 = _e59;
    _a20 = _a20 + 1;
  }
  if (! equal63(5, _a20)) {
    failed = failed + 1;
    return "failed: expected " + str(5) + ", was " + str(_a20);
  } else {
    passed = passed + 1;
  }
  var __x569 = [[1], [2]];
  __x569.b = [3];
  var _l10 = __x569;
  var __l11 = _l10;
  var __i7 = undefined;
  for (__i7 in __l11) {
    var _x573 = __l11[__i7];
    var _e60;
    if (numeric63(__i7)) {
      _e60 = parseInt(__i7);
    } else {
      _e60 = __i7;
    }
    var __i71 = _e60;
    if (! equal63(false, !( typeof(_x573) === "object"))) {
      failed = failed + 1;
      return "failed: expected " + str(false) + ", was " + str(!( typeof(_x573) === "object"));
    } else {
      passed = passed + 1;
    }
  }
  var __l12 = _l10;
  var __i8 = undefined;
  for (__i8 in __l12) {
    var _x574 = __l12[__i8];
    var _e61;
    if (numeric63(__i8)) {
      _e61 = parseInt(__i8);
    } else {
      _e61 = __i8;
    }
    var __i81 = _e61;
    if (! equal63(false, !( typeof(_x574) === "object"))) {
      failed = failed + 1;
      return "failed: expected " + str(false) + ", was " + str(!( typeof(_x574) === "object"));
    } else {
      passed = passed + 1;
    }
  }
  var __l13 = _l10;
  var __i9 = undefined;
  for (__i9 in __l13) {
    var __id4 = __l13[__i9];
    var _x575 = __id4[0];
    var _e62;
    if (numeric63(__i9)) {
      _e62 = parseInt(__i9);
    } else {
      _e62 = __i9;
    }
    var __i91 = _e62;
    if (! equal63(true, typeof(_x575) === "number")) {
      failed = failed + 1;
      return "failed: expected " + str(true) + ", was " + str(typeof(_x575) === "number");
    } else {
      passed = passed + 1;
    }
  }
}]);
add(tests, ["fn", function (_) {
  var _f3 = function (_) {
    return _ + 10;
  };
  if (! equal63(20, _f3(10))) {
    failed = failed + 1;
    return "failed: expected " + str(20) + ", was " + str(_f3(10));
  } else {
    passed = passed + 1;
  }
  if (! equal63(30, _f3(20))) {
    failed = failed + 1;
    return "failed: expected " + str(30) + ", was " + str(_f3(20));
  } else {
    passed = passed + 1;
  }
  if (! equal63(40, (function (_) {
    return _ + 10;
  })(30))) {
    failed = failed + 1;
    return "failed: expected " + str(40) + ", was " + str((function (_) {
      return _ + 10;
    })(30));
  } else {
    passed = passed + 1;
  }
  if (! equal63([2, 3, 4], map(function (_) {
    return _ + 1;
  }, [1, 2, 3]))) {
    failed = failed + 1;
    return "failed: expected " + str([2, 3, 4]) + ", was " + str(map(function (_) {
      return _ + 1;
    }, [1, 2, 3]));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["define", function () {
  var x = 20;
  var f = function () {
    return 42;
  };
  if (! equal63(20, x)) {
    failed = failed + 1;
    return "failed: expected " + str(20) + ", was " + str(x);
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, f())) {
    failed = failed + 1;
    return "failed: expected " + str(42) + ", was " + str(f());
  } else {
    passed = passed + 1;
  }
  (function () {
    var f = function () {
      return 38;
    };
    if (! equal63(38, f())) {
      failed = failed + 1;
      return "failed: expected " + str(38) + ", was " + str(f());
    } else {
      passed = passed + 1;
      return passed;
    }
  })();
  if (! equal63(42, f())) {
    failed = failed + 1;
    return "failed: expected " + str(42) + ", was " + str(f());
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["return", function () {
  var _a21 = (function () {
    return 17;
  })();
  if (! equal63(17, _a21)) {
    failed = failed + 1;
    return "failed: expected " + str(17) + ", was " + str(_a21);
  } else {
    passed = passed + 1;
  }
  var _a22 = (function () {
    if (true) {
      return 10;
    } else {
      return 20;
    }
  })();
  if (! equal63(10, _a22)) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(_a22);
  } else {
    passed = passed + 1;
  }
  var _a23 = (function () {
    while (false) {
      blah();
    }
  })();
  if (! equal63(undefined, _a23)) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(_a23);
  } else {
    passed = passed + 1;
  }
  var _a24 = 11;
  var _b8 = (function () {
    _a24 = _a24 + 1;
    return _a24;
  })();
  if (! equal63(12, _b8)) {
    failed = failed + 1;
    return "failed: expected " + str(12) + ", was " + str(_b8);
  } else {
    passed = passed + 1;
  }
  if (! equal63(12, _a24)) {
    failed = failed + 1;
    return "failed: expected " + str(12) + ", was " + str(_a24);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["guard", function () {
  if (! equal63([true, 42], cut((function () {
    try {
      return [true, 42];
    }
    catch (_e76) {
      return [false, _e76.message, _e76.stack];
    }
  })(), 0, 2))) {
    failed = failed + 1;
    return "failed: expected " + str([true, 42]) + ", was " + str(cut((function () {
      try {
        return [true, 42];
      }
      catch (_e77) {
        return [false, _e77.message, _e77.stack];
      }
    })(), 0, 2));
  } else {
    passed = passed + 1;
  }
  if (! equal63([false, "foo"], cut((function () {
    try {
      throw new Error("foo");
      return [true];
    }
    catch (_e78) {
      return [false, _e78.message, _e78.stack];
    }
  })(), 0, 2))) {
    failed = failed + 1;
    return "failed: expected " + str([false, "foo"]) + ", was " + str(cut((function () {
      try {
        throw new Error("foo");
        return [true];
      }
      catch (_e79) {
        return [false, _e79.message, _e79.stack];
      }
    })(), 0, 2));
  } else {
    passed = passed + 1;
  }
  if (! equal63([false, "foo"], cut((function () {
    try {
      throw new Error("foo");
      throw new Error("baz");
      return [true];
    }
    catch (_e80) {
      return [false, _e80.message, _e80.stack];
    }
  })(), 0, 2))) {
    failed = failed + 1;
    return "failed: expected " + str([false, "foo"]) + ", was " + str(cut((function () {
      try {
        throw new Error("foo");
        throw new Error("baz");
        return [true];
      }
      catch (_e81) {
        return [false, _e81.message, _e81.stack];
      }
    })(), 0, 2));
  } else {
    passed = passed + 1;
  }
  if (! equal63([false, "baz"], cut((function () {
    try {
      cut((function () {
        try {
          throw new Error("foo");
          return [true];
        }
        catch (_e83) {
          return [false, _e83.message, _e83.stack];
        }
      })(), 0, 2);
      throw new Error("baz");
      return [true];
    }
    catch (_e82) {
      return [false, _e82.message, _e82.stack];
    }
  })(), 0, 2))) {
    failed = failed + 1;
    return "failed: expected " + str([false, "baz"]) + ", was " + str(cut((function () {
      try {
        cut((function () {
          try {
            throw new Error("foo");
            return [true];
          }
          catch (_e85) {
            return [false, _e85.message, _e85.stack];
          }
        })(), 0, 2);
        throw new Error("baz");
        return [true];
      }
      catch (_e84) {
        return [false, _e84.message, _e84.stack];
      }
    })(), 0, 2));
  } else {
    passed = passed + 1;
  }
  if (! equal63([true, 42], cut((function () {
    try {
      var _e63;
      if (true) {
        _e63 = 42;
      } else {
        throw new Error("baz");
        _e63 = undefined;
      }
      return [true, _e63];
    }
    catch (_e86) {
      return [false, _e86.message, _e86.stack];
    }
  })(), 0, 2))) {
    failed = failed + 1;
    return "failed: expected " + str([true, 42]) + ", was " + str(cut((function () {
      try {
        var _e64;
        if (true) {
          _e64 = 42;
        } else {
          throw new Error("baz");
          _e64 = undefined;
        }
        return [true, _e64];
      }
      catch (_e87) {
        return [false, _e87.message, _e87.stack];
      }
    })(), 0, 2));
  } else {
    passed = passed + 1;
  }
  if (! equal63([false, "baz"], cut((function () {
    try {
      var _e65;
      if (false) {
        _e65 = 42;
      } else {
        throw new Error("baz");
        _e65 = undefined;
      }
      return [true, _e65];
    }
    catch (_e88) {
      return [false, _e88.message, _e88.stack];
    }
  })(), 0, 2))) {
    failed = failed + 1;
    return "failed: expected " + str([false, "baz"]) + ", was " + str(cut((function () {
      try {
        var _e66;
        if (false) {
          _e66 = 42;
        } else {
          throw new Error("baz");
          _e66 = undefined;
        }
        return [true, _e66];
      }
      catch (_e89) {
        return [false, _e89.message, _e89.stack];
      }
    })(), 0, 2));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["let", function () {
  var _a25 = 10;
  if (! equal63(10, _a25)) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(_a25);
  } else {
    passed = passed + 1;
  }
  var _a26 = 10;
  if (! equal63(10, _a26)) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(_a26);
  } else {
    passed = passed + 1;
  }
  var _a27 = 11;
  var _b9 = 12;
  if (! equal63(11, _a27)) {
    failed = failed + 1;
    return "failed: expected " + str(11) + ", was " + str(_a27);
  } else {
    passed = passed + 1;
  }
  if (! equal63(12, _b9)) {
    failed = failed + 1;
    return "failed: expected " + str(12) + ", was " + str(_b9);
  } else {
    passed = passed + 1;
  }
  var _a28 = 1;
  if (! equal63(1, _a28)) {
    failed = failed + 1;
    return "failed: expected " + str(1) + ", was " + str(_a28);
  } else {
    passed = passed + 1;
  }
  var _a29 = 2;
  if (! equal63(2, _a29)) {
    failed = failed + 1;
    return "failed: expected " + str(2) + ", was " + str(_a29);
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, _a28)) {
    failed = failed + 1;
    return "failed: expected " + str(1) + ", was " + str(_a28);
  } else {
    passed = passed + 1;
  }
  var _a30 = 1;
  var _a31 = 2;
  var _a32 = 3;
  if (! equal63(_a32, 3)) {
    failed = failed + 1;
    return "failed: expected " + str(_a32) + ", was " + str(3);
  } else {
    passed = passed + 1;
  }
  if (! equal63(_a31, 2)) {
    failed = failed + 1;
    return "failed: expected " + str(_a31) + ", was " + str(2);
  } else {
    passed = passed + 1;
  }
  if (! equal63(_a30, 1)) {
    failed = failed + 1;
    return "failed: expected " + str(_a30) + ", was " + str(1);
  } else {
    passed = passed + 1;
  }
  var _a33 = 20;
  if (! equal63(20, _a33)) {
    failed = failed + 1;
    return "failed: expected " + str(20) + ", was " + str(_a33);
  } else {
    passed = passed + 1;
  }
  var _a34 = _a33 + 7;
  if (! equal63(27, _a34)) {
    failed = failed + 1;
    return "failed: expected " + str(27) + ", was " + str(_a34);
  } else {
    passed = passed + 1;
  }
  var _a35 = _a33 + 10;
  if (! equal63(30, _a35)) {
    failed = failed + 1;
    return "failed: expected " + str(30) + ", was " + str(_a35);
  } else {
    passed = passed + 1;
  }
  if (! equal63(20, _a33)) {
    failed = failed + 1;
    return "failed: expected " + str(20) + ", was " + str(_a33);
  } else {
    passed = passed + 1;
  }
  var _a36 = 10;
  if (! equal63(10, _a36)) {
    failed = failed + 1;
    var _a37 = 10;
    return "failed: expected " + str(10) + ", was " + str(_a37);
  } else {
    passed = passed + 1;
  }
  var _b10 = 12;
  var _a38 = _b10;
  if (! equal63(12, _a38)) {
    failed = failed + 1;
    return "failed: expected " + str(12) + ", was " + str(_a38);
  } else {
    passed = passed + 1;
  }
  var _a40 = 10;
  var _a39 = _a40;
  if (! equal63(10, _a39)) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(_a39);
  } else {
    passed = passed + 1;
  }
  var _a42 = 0;
  _a42 = 10;
  var _a41 = _a42 + 2 + 3;
  if (! equal63(_a41, 15)) {
    failed = failed + 1;
    return "failed: expected " + str(_a41) + ", was " + str(15);
  } else {
    passed = passed + 1;
  }
  (function (_) {
    if (! equal63(20, _)) {
      failed = failed + 1;
      return "failed: expected " + str(20) + ", was " + str(_);
    } else {
      passed = passed + 1;
    }
    var __ = 21;
    if (! equal63(21, __)) {
      failed = failed + 1;
      return "failed: expected " + str(21) + ", was " + str(__);
    } else {
      passed = passed + 1;
    }
    if (! equal63(20, _)) {
      failed = failed + 1;
      return "failed: expected " + str(20) + ", was " + str(_);
    } else {
      passed = passed + 1;
      return passed;
    }
  })(20);
  var _q = 9;
  return (function () {
    var _q1 = 10;
    if (! equal63(10, _q1)) {
      failed = failed + 1;
      return "failed: expected " + str(10) + ", was " + str(_q1);
    } else {
      passed = passed + 1;
    }
    if (! equal63(9, _q)) {
      failed = failed + 1;
      return "failed: expected " + str(9) + ", was " + str(_q);
    } else {
      passed = passed + 1;
      return passed;
    }
  })();
}]);
add(tests, ["with", function () {
  var _x614 = 9;
  _x614 = _x614 + 1;
  if (! equal63(10, _x614)) {
    failed = failed + 1;
    var _x615 = 9;
    _x615 = _x615 + 1;
    return "failed: expected " + str(10) + ", was " + str(_x615);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["whenlet", function () {
  var _frips = "a" === "b";
  var _e67;
  if (_frips) {
    _e67 = 19;
  }
  if (! equal63(undefined, _e67)) {
    failed = failed + 1;
    var _frips1 = "a" === "b";
    var _e68;
    if (_frips1) {
      _e68 = 19;
    }
    return "failed: expected " + str(undefined) + ", was " + str(_e68);
  } else {
    passed = passed + 1;
  }
  var _frips2 = 20;
  var _e69;
  if (_frips2) {
    _e69 = _frips2 - 1;
  }
  if (! equal63(19, _e69)) {
    failed = failed + 1;
    var _frips3 = 20;
    var _e70;
    if (_frips3) {
      _e70 = _frips3 - 1;
    }
    return "failed: expected " + str(19) + ", was " + str(_e70);
  } else {
    passed = passed + 1;
  }
  var __if = [19, 20];
  var _e71;
  if (__if) {
    var _a43 = __if[0];
    var _b11 = __if[1];
    _e71 = _b11;
  }
  if (! equal63(20, _e71)) {
    failed = failed + 1;
    var __if1 = [19, 20];
    var _e72;
    if (__if1) {
      var _a44 = __if1[0];
      var _b12 = __if1[1];
      _e72 = _b12;
    }
    return "failed: expected " + str(20) + ", was " + str(_e72);
  } else {
    passed = passed + 1;
  }
  var __if2 = undefined;
  var _e73;
  if (__if2) {
    var _a45 = __if2[0];
    var _b13 = __if2[1];
    _e73 = _b13;
  }
  if (! equal63(undefined, _e73)) {
    failed = failed + 1;
    var __if3 = undefined;
    var _e74;
    if (__if3) {
      var _a46 = __if3[0];
      var _b14 = __if3[1];
      _e74 = _b14;
    }
    return "failed: expected " + str(undefined) + ", was " + str(_e74);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
var zzop = 99;
var zzap = 100;
var _zzop = 10;
var _zzap = _zzop + 10;
var __x620 = [1, 2, 3];
__x620.a = 10;
__x620.b = 20;
var __id9 = __x620;
var _zza = __id9[0];
var _zzb = __id9[1];
add(tests, ["let-toplevel1", function () {
  if (! equal63(10, _zzop)) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(_zzop);
  } else {
    passed = passed + 1;
  }
  if (! equal63(20, _zzap)) {
    failed = failed + 1;
    return "failed: expected " + str(20) + ", was " + str(_zzap);
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, _zza)) {
    failed = failed + 1;
    return "failed: expected " + str(1) + ", was " + str(_zza);
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, _zzb)) {
    failed = failed + 1;
    return "failed: expected " + str(2) + ", was " + str(_zzb);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["let-toplevel", function () {
  if (! equal63(99, zzop)) {
    failed = failed + 1;
    return "failed: expected " + str(99) + ", was " + str(zzop);
  } else {
    passed = passed + 1;
  }
  if (! equal63(100, zzap)) {
    failed = failed + 1;
    return "failed: expected " + str(100) + ", was " + str(zzap);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["reserved", function () {
  var _end = "zz";
  var _try = "yy";
  var _return = 99;
  if (! equal63("zz", _end)) {
    failed = failed + 1;
    _return("failed: expected " + str("zz") + ", was " + str(_end));
  } else {
    passed = passed + 1;
  }
  if (! equal63("yy", _try)) {
    failed = failed + 1;
    _return("failed: expected " + str("yy") + ", was " + str(_try));
  } else {
    passed = passed + 1;
  }
  if (! equal63(99, _return)) {
    failed = failed + 1;
    _return("failed: expected " + str(99) + ", was " + str(_return));
  } else {
    passed = passed + 1;
  }
  var _var = function (_if, _end, _return) {
    return _if + _end + _return;
  };
  if (! equal63(6, _var(1, 2, 3))) {
    failed = failed + 1;
    return "failed: expected " + str(6) + ", was " + str(_var(1, 2, 3));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["destructuring", function () {
  var __id10 = [1, 2, 3];
  var _a47 = __id10[0];
  var _b15 = __id10[1];
  var _c2 = __id10[2];
  if (! equal63(1, _a47)) {
    failed = failed + 1;
    return "failed: expected " + str(1) + ", was " + str(_a47);
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, _b15)) {
    failed = failed + 1;
    return "failed: expected " + str(2) + ", was " + str(_b15);
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, _c2)) {
    failed = failed + 1;
    return "failed: expected " + str(3) + ", was " + str(_c2);
  } else {
    passed = passed + 1;
  }
  var __id11 = [1, [2, [3], 4]];
  var _w = __id11[0];
  var __id12 = __id11[1];
  var _x633 = __id12[0];
  var __id13 = __id12[1];
  var _y = __id13[0];
  var _z = __id12[2];
  if (! equal63(1, _w)) {
    failed = failed + 1;
    return "failed: expected " + str(1) + ", was " + str(_w);
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, _x633)) {
    failed = failed + 1;
    return "failed: expected " + str(2) + ", was " + str(_x633);
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, _y)) {
    failed = failed + 1;
    return "failed: expected " + str(3) + ", was " + str(_y);
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, _z)) {
    failed = failed + 1;
    return "failed: expected " + str(4) + ", was " + str(_z);
  } else {
    passed = passed + 1;
  }
  var __id14 = [1, 2, 3, 4];
  var _a48 = __id14[0];
  var _b16 = __id14[1];
  var _c3 = cut(__id14, 2);
  if (! equal63([3, 4], _c3)) {
    failed = failed + 1;
    return "failed: expected " + str([3, 4]) + ", was " + str(_c3);
  } else {
    passed = passed + 1;
  }
  var __id15 = [1, [2, 3, 4], 5, 6, 7];
  var _w1 = __id15[0];
  var __id16 = __id15[1];
  var _x642 = __id16[0];
  var _y1 = cut(__id16, 1);
  var _z1 = cut(__id15, 2);
  if (! equal63([3, 4], _y1)) {
    failed = failed + 1;
    return "failed: expected " + str([3, 4]) + ", was " + str(_y1);
  } else {
    passed = passed + 1;
  }
  if (! equal63([5, 6, 7], _z1)) {
    failed = failed + 1;
    return "failed: expected " + str([5, 6, 7]) + ", was " + str(_z1);
  } else {
    passed = passed + 1;
  }
  var __id17 = {["foo"]: 99};
  var _foo = __id17.foo;
  if (! equal63(99, _foo)) {
    failed = failed + 1;
    return "failed: expected " + str(99) + ", was " + str(_foo);
  } else {
    passed = passed + 1;
  }
  var __x648 = [];
  __x648.foo = 99;
  var __id18 = __x648;
  var _foo1 = __id18.foo;
  if (! equal63(99, _foo1)) {
    failed = failed + 1;
    return "failed: expected " + str(99) + ", was " + str(_foo1);
  } else {
    passed = passed + 1;
  }
  var __id19 = {["foo"]: 99};
  var _a49 = __id19.foo;
  if (! equal63(99, _a49)) {
    failed = failed + 1;
    return "failed: expected " + str(99) + ", was " + str(_a49);
  } else {
    passed = passed + 1;
  }
  var __id20 = {["foo"]: [98, 99]};
  var __id21 = __id20.foo;
  var _a50 = __id21[0];
  var _b17 = __id21[1];
  if (! equal63(98, _a50)) {
    failed = failed + 1;
    return "failed: expected " + str(98) + ", was " + str(_a50);
  } else {
    passed = passed + 1;
  }
  if (! equal63(99, _b17)) {
    failed = failed + 1;
    return "failed: expected " + str(99) + ", was " + str(_b17);
  } else {
    passed = passed + 1;
  }
  var __x652 = [99];
  __x652.baz = true;
  var __id22 = {["foo"]: 42, ["bar"]: __x652};
  var _foo2 = __id22.foo;
  var __id23 = __id22.bar;
  var _baz = __id23.baz;
  if (! equal63(42, _foo2)) {
    failed = failed + 1;
    return "failed: expected " + str(42) + ", was " + str(_foo2);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, _baz)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(_baz);
  } else {
    passed = passed + 1;
  }
  var __x657 = [20];
  __x657.foo = 17;
  var __x656 = [10, __x657];
  __x656.bar = [1, 2, 3];
  var __id24 = __x656;
  var _a51 = __id24[0];
  var __id25 = __id24[1];
  var _b18 = __id25[0];
  var _foo3 = __id25.foo;
  var _bar = __id24.bar;
  if (! equal63(10, _a51)) {
    failed = failed + 1;
    return "failed: expected " + str(10) + ", was " + str(_a51);
  } else {
    passed = passed + 1;
  }
  if (! equal63(20, _b18)) {
    failed = failed + 1;
    return "failed: expected " + str(20) + ", was " + str(_b18);
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, _foo3)) {
    failed = failed + 1;
    return "failed: expected " + str(17) + ", was " + str(_foo3);
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3], _bar)) {
    failed = failed + 1;
    return "failed: expected " + str([1, 2, 3]) + ", was " + str(_bar);
  } else {
    passed = passed + 1;
  }
  var _yy = [1, 2, 3];
  var __id26 = _yy;
  var _xx = __id26[0];
  var _yy1 = __id26[1];
  var _zz = cut(__id26, 2);
  if (! equal63(1, _xx)) {
    failed = failed + 1;
    return "failed: expected " + str(1) + ", was " + str(_xx);
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, _yy1)) {
    failed = failed + 1;
    return "failed: expected " + str(2) + ", was " + str(_yy1);
  } else {
    passed = passed + 1;
  }
  if (! equal63([3], _zz)) {
    failed = failed + 1;
    return "failed: expected " + str([3]) + ", was " + str(_zz);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["w/mac", function () {
  if (! equal63(17, 17)) {
    failed = failed + 1;
    return "failed: expected " + str(17) + ", was " + str(17);
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, 32 + 10)) {
    failed = failed + 1;
    return "failed: expected " + str(42) + ", was " + str(32 + 10);
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, 1)) {
    failed = failed + 1;
    return "failed: expected " + str(1) + ", was " + str(1);
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, 17)) {
    failed = failed + 1;
    return "failed: expected " + str(17) + ", was " + str(17);
  } else {
    passed = passed + 1;
  }
  var _b19 = function () {
    return 20;
  };
  if (! equal63(18, 18)) {
    failed = failed + 1;
    return "failed: expected " + str(18) + ", was " + str(18);
  } else {
    passed = passed + 1;
  }
  if (! equal63(20, _b19())) {
    failed = failed + 1;
    return "failed: expected " + str(20) + ", was " + str(_b19());
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, 1 + 1)) {
    failed = failed + 1;
    return "failed: expected " + str(2) + ", was " + str(1 + 1);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["w/sym", function () {
  if (! equal63(17, 17)) {
    failed = failed + 1;
    return "failed: expected " + str(17) + ", was " + str(17);
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, 10 + 7)) {
    failed = failed + 1;
    return "failed: expected " + str(17) + ", was " + str(10 + 7);
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, 1)) {
    failed = failed + 1;
    return "failed: expected " + str(1) + ", was " + str(1);
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, 17)) {
    failed = failed + 1;
    return "failed: expected " + str(17) + ", was " + str(17);
  } else {
    passed = passed + 1;
  }
  var _b20 = 20;
  if (! equal63(18, 18)) {
    failed = failed + 1;
    return "failed: expected " + str(18) + ", was " + str(18);
  } else {
    passed = passed + 1;
  }
  if (! equal63(20, _b20)) {
    failed = failed + 1;
    return "failed: expected " + str(20) + ", was " + str(_b20);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["defsym", function () {
  setenv("zzz", stash33({["symbol"]: 42, ["eval"]: true}));
  if (! equal63(42, 42)) {
    failed = failed + 1;
    return "failed: expected " + str(42) + ", was " + str(42);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["macros-and-symbols", function () {
  if (! equal63(2, 2)) {
    failed = failed + 1;
    return "failed: expected " + str(2) + ", was " + str(2);
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, 1)) {
    failed = failed + 1;
    return "failed: expected " + str(1) + ", was " + str(1);
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, 1)) {
    failed = failed + 1;
    return "failed: expected " + str(1) + ", was " + str(1);
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, 2)) {
    failed = failed + 1;
    return "failed: expected " + str(2) + ", was " + str(2);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["macros-and-let", function () {
  var _a52 = 10;
  if (! equal63(_a52, 10)) {
    failed = failed + 1;
    return "failed: expected " + str(_a52) + ", was " + str(10);
  } else {
    passed = passed + 1;
  }
  if (! equal63(12, 12)) {
    failed = failed + 1;
    return "failed: expected " + str(12) + ", was " + str(12);
  } else {
    passed = passed + 1;
  }
  if (! equal63(_a52, 10)) {
    failed = failed + 1;
    return "failed: expected " + str(_a52) + ", was " + str(10);
  } else {
    passed = passed + 1;
  }
  var _b21 = 20;
  if (! equal63(_b21, 20)) {
    failed = failed + 1;
    return "failed: expected " + str(_b21) + ", was " + str(20);
  } else {
    passed = passed + 1;
  }
  if (! equal63(22, 22)) {
    failed = failed + 1;
    return "failed: expected " + str(22) + ", was " + str(22);
  } else {
    passed = passed + 1;
  }
  if (! equal63(_b21, 20)) {
    failed = failed + 1;
    return "failed: expected " + str(_b21) + ", was " + str(20);
  } else {
    passed = passed + 1;
  }
  if (! equal63(30, 30)) {
    failed = failed + 1;
    return "failed: expected " + str(30) + ", was " + str(30);
  } else {
    passed = passed + 1;
  }
  var _c4 = 32;
  if (! equal63(32, _c4)) {
    failed = failed + 1;
    return "failed: expected " + str(32) + ", was " + str(_c4);
  } else {
    passed = passed + 1;
  }
  if (! equal63(30, 30)) {
    failed = failed + 1;
    return "failed: expected " + str(30) + ", was " + str(30);
  } else {
    passed = passed + 1;
  }
  if (! equal63(40, 40)) {
    failed = failed + 1;
    return "failed: expected " + str(40) + ", was " + str(40);
  } else {
    passed = passed + 1;
  }
  var _d1 = 42;
  if (! equal63(42, _d1)) {
    failed = failed + 1;
    return "failed: expected " + str(42) + ", was " + str(_d1);
  } else {
    passed = passed + 1;
  }
  if (! equal63(40, 40)) {
    failed = failed + 1;
    return "failed: expected " + str(40) + ", was " + str(40);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["w/uniq", function () {
  var _ham = uniq("ham");
  var _chap = uniq("chap");
  if (! equal63("_ham", _ham)) {
    failed = failed + 1;
    return "failed: expected " + str("_ham") + ", was " + str(_ham);
  } else {
    passed = passed + 1;
  }
  if (! equal63("_chap", _chap)) {
    failed = failed + 1;
    return "failed: expected " + str("_chap") + ", was " + str(_chap);
  } else {
    passed = passed + 1;
  }
  var _ham1 = uniq("ham");
  if (! equal63("_ham1", _ham1)) {
    failed = failed + 1;
    return "failed: expected " + str("_ham1") + ", was " + str(_ham1);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["literals", function () {
  if (! equal63(true, true)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(true);
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, false)) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(false);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, -inf < -10000000000)) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(-inf < -10000000000);
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, inf < -10000000000)) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(inf < -10000000000);
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, nan === nan)) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(nan === nan);
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, nan63(nan))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(nan63(nan));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, nan63(nan * 20))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(nan63(nan * 20));
  } else {
    passed = passed + 1;
  }
  if (! equal63(-inf, - inf)) {
    failed = failed + 1;
    return "failed: expected " + str(-inf) + ", was " + str(- inf);
  } else {
    passed = passed + 1;
  }
  if (! equal63(inf, - -inf)) {
    failed = failed + 1;
    return "failed: expected " + str(inf) + ", was " + str(- -inf);
  } else {
    passed = passed + 1;
  }
  var _Inf = 1;
  var _NaN = 2;
  var __Inf = "a";
  var __NaN = "b";
  if (! equal63(_Inf, 1)) {
    failed = failed + 1;
    return "failed: expected " + str(_Inf) + ", was " + str(1);
  } else {
    passed = passed + 1;
  }
  if (! equal63(_NaN, 2)) {
    failed = failed + 1;
    return "failed: expected " + str(_NaN) + ", was " + str(2);
  } else {
    passed = passed + 1;
  }
  if (! equal63(__Inf, "a")) {
    failed = failed + 1;
    return "failed: expected " + str(__Inf) + ", was " + str("a");
  } else {
    passed = passed + 1;
  }
  if (! equal63(__NaN, "b")) {
    failed = failed + 1;
    return "failed: expected " + str(__NaN) + ", was " + str("b");
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["add", function () {
  var _l14 = [];
  add(_l14, "a");
  add(_l14, "b");
  add(_l14, "c");
  if (! equal63(["a", "b", "c"], _l14)) {
    failed = failed + 1;
    return "failed: expected " + str(["a", "b", "c"]) + ", was " + str(_l14);
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, add([], "a"))) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(add([], "a"));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["drop", function () {
  var _l15 = ["a", "b", "c"];
  if (! equal63("c", drop(_l15))) {
    failed = failed + 1;
    return "failed: expected " + str("c") + ", was " + str(drop(_l15));
  } else {
    passed = passed + 1;
  }
  if (! equal63("b", drop(_l15))) {
    failed = failed + 1;
    return "failed: expected " + str("b") + ", was " + str(drop(_l15));
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", drop(_l15))) {
    failed = failed + 1;
    return "failed: expected " + str("a") + ", was " + str(drop(_l15));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, drop(_l15))) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(drop(_l15));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["last", function () {
  if (! equal63(3, last([1, 2, 3]))) {
    failed = failed + 1;
    return "failed: expected " + str(3) + ", was " + str(last([1, 2, 3]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, last([]))) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(last([]));
  } else {
    passed = passed + 1;
  }
  if (! equal63("c", last(["a", "b", "c"]))) {
    failed = failed + 1;
    return "failed: expected " + str("c") + ", was " + str(last(["a", "b", "c"]));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["join", function () {
  if (! equal63([1, 2, 3], join([1, 2], [3]))) {
    failed = failed + 1;
    return "failed: expected " + str([1, 2, 3]) + ", was " + str(join([1, 2], [3]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2], join([], [1, 2]))) {
    failed = failed + 1;
    return "failed: expected " + str([1, 2]) + ", was " + str(join([], [1, 2]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], join([], []))) {
    failed = failed + 1;
    return "failed: expected " + str([]) + ", was " + str(join([], []));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], join(undefined, undefined))) {
    failed = failed + 1;
    return "failed: expected " + str([]) + ", was " + str(join(undefined, undefined));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], join(undefined, []))) {
    failed = failed + 1;
    return "failed: expected " + str([]) + ", was " + str(join(undefined, []));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], join())) {
    failed = failed + 1;
    return "failed: expected " + str([]) + ", was " + str(join());
  } else {
    passed = passed + 1;
  }
  if (! equal63([], join([]))) {
    failed = failed + 1;
    return "failed: expected " + str([]) + ", was " + str(join([]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1], join([1], undefined))) {
    failed = failed + 1;
    return "failed: expected " + str([1]) + ", was " + str(join([1], undefined));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], join(["a"], []))) {
    failed = failed + 1;
    return "failed: expected " + str(["a"]) + ", was " + str(join(["a"], []));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], join(undefined, ["a"]))) {
    failed = failed + 1;
    return "failed: expected " + str(["a"]) + ", was " + str(join(undefined, ["a"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], join(["a"]))) {
    failed = failed + 1;
    return "failed: expected " + str(["a"]) + ", was " + str(join(["a"]));
  } else {
    passed = passed + 1;
  }
  var __x712 = ["a"];
  __x712.b = true;
  if (! equal63(__x712, join(["a"], {["b"]: true}))) {
    failed = failed + 1;
    var __x714 = ["a"];
    __x714.b = true;
    return "failed: expected " + str(__x714) + ", was " + str(join(["a"], {["b"]: true}));
  } else {
    passed = passed + 1;
  }
  var __x716 = ["a", "b"];
  __x716.b = true;
  var __x718 = ["b"];
  __x718.b = true;
  if (! equal63(__x716, join(["a"], __x718))) {
    failed = failed + 1;
    var __x719 = ["a", "b"];
    __x719.b = true;
    var __x721 = ["b"];
    __x721.b = true;
    return "failed: expected " + str(__x719) + ", was " + str(join(["a"], __x721));
  } else {
    passed = passed + 1;
  }
  var __x722 = ["a"];
  __x722.b = 10;
  var __x723 = ["a"];
  __x723.b = true;
  if (! equal63(__x722, join(__x723, {["b"]: 10}))) {
    failed = failed + 1;
    var __x724 = ["a"];
    __x724.b = 10;
    var __x725 = ["a"];
    __x725.b = true;
    return "failed: expected " + str(__x724) + ", was " + str(join(__x725, {["b"]: 10}));
  } else {
    passed = passed + 1;
  }
  var __x726 = [];
  __x726.b = 10;
  var __x727 = [];
  __x727.b = 10;
  if (! equal63(__x726, join({["b"]: true}, __x727))) {
    failed = failed + 1;
    var __x728 = [];
    __x728.b = 10;
    var __x729 = [];
    __x729.b = 10;
    return "failed: expected " + str(__x728) + ", was " + str(join({["b"]: true}, __x729));
  } else {
    passed = passed + 1;
  }
  var __x730 = ["a"];
  __x730.b = 1;
  var __x731 = ["b"];
  __x731.c = 2;
  var _l16 = join(__x730, __x731);
  if (! equal63(1, _l16.b)) {
    failed = failed + 1;
    return "failed: expected " + str(1) + ", was " + str(_l16.b);
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, _l16.c)) {
    failed = failed + 1;
    return "failed: expected " + str(2) + ", was " + str(_l16.c);
  } else {
    passed = passed + 1;
  }
  if (! equal63("b", _l16[1])) {
    failed = failed + 1;
    return "failed: expected " + str("b") + ", was " + str(_l16[1]);
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["rev", function () {
  if (! equal63([], rev([]))) {
    failed = failed + 1;
    return "failed: expected " + str([]) + ", was " + str(rev([]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([3, 2, 1], rev([1, 2, 3]))) {
    failed = failed + 1;
    return "failed: expected " + str([3, 2, 1]) + ", was " + str(rev([1, 2, 3]));
  } else {
    passed = passed + 1;
  }
  var __x737 = [3, 2, 1];
  __x737.a = true;
  var __x738 = [1, 2, 3];
  __x738.a = true;
  if (! equal63(__x737, rev(__x738))) {
    failed = failed + 1;
    var __x739 = [3, 2, 1];
    __x739.a = true;
    var __x740 = [1, 2, 3];
    __x740.a = true;
    return "failed: expected " + str(__x739) + ", was " + str(rev(__x740));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["map", function (_) {
  if (! equal63([], map(function (_) {
    return _;
  }, []))) {
    failed = failed + 1;
    return "failed: expected " + str([]) + ", was " + str(map(function (_) {
      return _;
    }, []));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1], map(function (_) {
    return _;
  }, [1]))) {
    failed = failed + 1;
    return "failed: expected " + str([1]) + ", was " + str(map(function (_) {
      return _;
    }, [1]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([2, 3, 4], map(function (_) {
    return _ + 1;
  }, [1, 2, 3]))) {
    failed = failed + 1;
    return "failed: expected " + str([2, 3, 4]) + ", was " + str(map(function (_) {
      return _ + 1;
    }, [1, 2, 3]));
  } else {
    passed = passed + 1;
  }
  var __x750 = [2, 3, 4];
  __x750.a = 5;
  var __x751 = [1, 2, 3];
  __x751.a = 4;
  if (! equal63(__x750, map(function (_) {
    return _ + 1;
  }, __x751))) {
    failed = failed + 1;
    var __x752 = [2, 3, 4];
    __x752.a = 5;
    var __x753 = [1, 2, 3];
    __x753.a = 4;
    return "failed: expected " + str(__x752) + ", was " + str(map(function (_) {
      return _ + 1;
    }, __x753));
  } else {
    passed = passed + 1;
  }
  var __x754 = [];
  __x754.a = true;
  var __x755 = [];
  __x755.a = true;
  if (! equal63(__x754, map(function (_) {
    return _;
  }, __x755))) {
    failed = failed + 1;
    var __x756 = [];
    __x756.a = true;
    var __x757 = [];
    __x757.a = true;
    return "failed: expected " + str(__x756) + ", was " + str(map(function (_) {
      return _;
    }, __x757));
  } else {
    passed = passed + 1;
  }
  var __x758 = [];
  __x758.b = false;
  var __x759 = [];
  __x759.b = false;
  if (! equal63(__x758, map(function (_) {
    return _;
  }, __x759))) {
    failed = failed + 1;
    var __x760 = [];
    __x760.b = false;
    var __x761 = [];
    __x761.b = false;
    return "failed: expected " + str(__x760) + ", was " + str(map(function (_) {
      return _;
    }, __x761));
  } else {
    passed = passed + 1;
  }
  var __x762 = [];
  __x762.a = true;
  __x762.b = false;
  var __x763 = [];
  __x763.a = true;
  __x763.b = false;
  if (! equal63(__x762, map(function (_) {
    return _;
  }, __x763))) {
    failed = failed + 1;
    var __x764 = [];
    __x764.a = true;
    __x764.b = false;
    var __x765 = [];
    __x765.a = true;
    __x765.b = false;
    return "failed: expected " + str(__x764) + ", was " + str(map(function (_) {
      return _;
    }, __x765));
  } else {
    passed = passed + 1;
  }
  var _evens = function (_) {
    if (_ % 2 === 0) {
      return _;
    }
  };
  if (! equal63([2, 4, 6], map(_evens, [1, 2, 3, 4, 5, 6]))) {
    failed = failed + 1;
    return "failed: expected " + str([2, 4, 6]) + ", was " + str(map(_evens, [1, 2, 3, 4, 5, 6]));
  } else {
    passed = passed + 1;
  }
  var __x770 = [2, 4, 6];
  __x770.b = 8;
  var __x771 = [1, 2, 3, 4, 5, 6];
  __x771.a = 7;
  __x771.b = 8;
  if (! equal63(__x770, map(_evens, __x771))) {
    failed = failed + 1;
    var __x772 = [2, 4, 6];
    __x772.b = 8;
    var __x773 = [1, 2, 3, 4, 5, 6];
    __x773.a = 7;
    __x773.b = 8;
    return "failed: expected " + str(__x772) + ", was " + str(map(_evens, __x773));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["cut", function () {
  if (! equal63([], cut([]))) {
    failed = failed + 1;
    return "failed: expected " + str([]) + ", was " + str(cut([]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], cut(["a"]))) {
    failed = failed + 1;
    return "failed: expected " + str(["a"]) + ", was " + str(cut(["a"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["b", "c"], cut(["a", "b", "c"], 1))) {
    failed = failed + 1;
    return "failed: expected " + str(["b", "c"]) + ", was " + str(cut(["a", "b", "c"], 1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["b", "c"], cut(["a", "b", "c", "d"], 1, 3))) {
    failed = failed + 1;
    return "failed: expected " + str(["b", "c"]) + ", was " + str(cut(["a", "b", "c", "d"], 1, 3));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3], cut([1, 2, 3], 0, 10))) {
    failed = failed + 1;
    return "failed: expected " + str([1, 2, 3]) + ", was " + str(cut([1, 2, 3], 0, 10));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1], cut([1, 2, 3], -4, 1))) {
    failed = failed + 1;
    return "failed: expected " + str([1]) + ", was " + str(cut([1, 2, 3], -4, 1));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3], cut([1, 2, 3], -4))) {
    failed = failed + 1;
    return "failed: expected " + str([1, 2, 3]) + ", was " + str(cut([1, 2, 3], -4));
  } else {
    passed = passed + 1;
  }
  var __x799 = [2];
  __x799.a = true;
  var __x800 = [1, 2];
  __x800.a = true;
  if (! equal63(__x799, cut(__x800, 1))) {
    failed = failed + 1;
    var __x801 = [2];
    __x801.a = true;
    var __x802 = [1, 2];
    __x802.a = true;
    return "failed: expected " + str(__x801) + ", was " + str(cut(__x802, 1));
  } else {
    passed = passed + 1;
  }
  var __x803 = [];
  __x803.a = true;
  __x803.b = 2;
  var __x804 = [];
  __x804.a = true;
  __x804.b = 2;
  if (! equal63(__x803, cut(__x804))) {
    failed = failed + 1;
    var __x805 = [];
    __x805.a = true;
    __x805.b = 2;
    var __x806 = [];
    __x806.a = true;
    __x806.b = 2;
    return "failed: expected " + str(__x805) + ", was " + str(cut(__x806));
  } else {
    passed = passed + 1;
  }
  var _l17 = [1, 2, 3];
  if (! equal63([], cut(_l17, _l17.length || 0))) {
    failed = failed + 1;
    return "failed: expected " + str([]) + ", was " + str(cut(_l17, _l17.length || 0));
  } else {
    passed = passed + 1;
  }
  var __x808 = [1, 2, 3];
  __x808.a = true;
  var _l18 = __x808;
  var __x809 = [];
  __x809.a = true;
  if (! equal63(__x809, cut(_l18, _l18.length || 0))) {
    failed = failed + 1;
    var __x810 = [];
    __x810.a = true;
    return "failed: expected " + str(__x810) + ", was " + str(cut(_l18, _l18.length || 0));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["clip", function () {
  if (! equal63("uux", clip("quux", 1))) {
    failed = failed + 1;
    return "failed: expected " + str("uux") + ", was " + str(clip("quux", 1));
  } else {
    passed = passed + 1;
  }
  if (! equal63("uu", clip("quux", 1, 3))) {
    failed = failed + 1;
    return "failed: expected " + str("uu") + ", was " + str(clip("quux", 1, 3));
  } else {
    passed = passed + 1;
  }
  if (! equal63("", clip("quux", 5))) {
    failed = failed + 1;
    return "failed: expected " + str("") + ", was " + str(clip("quux", 5));
  } else {
    passed = passed + 1;
  }
  if (! equal63("ab", clip("ab", 0, 4))) {
    failed = failed + 1;
    return "failed: expected " + str("ab") + ", was " + str(clip("ab", 0, 4));
  } else {
    passed = passed + 1;
  }
  if (! equal63("ab", clip("ab", -4, 4))) {
    failed = failed + 1;
    return "failed: expected " + str("ab") + ", was " + str(clip("ab", -4, 4));
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", clip("ab", -1, 1))) {
    failed = failed + 1;
    return "failed: expected " + str("a") + ", was " + str(clip("ab", -1, 1));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["search", function () {
  if (! equal63(undefined, search("", "a"))) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(search("", "a"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(0, search("", ""))) {
    failed = failed + 1;
    return "failed: expected " + str(0) + ", was " + str(search("", ""));
  } else {
    passed = passed + 1;
  }
  if (! equal63(0, search("a", ""))) {
    failed = failed + 1;
    return "failed: expected " + str(0) + ", was " + str(search("a", ""));
  } else {
    passed = passed + 1;
  }
  if (! equal63(0, search("abc", "a"))) {
    failed = failed + 1;
    return "failed: expected " + str(0) + ", was " + str(search("abc", "a"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, search("abcd", "cd"))) {
    failed = failed + 1;
    return "failed: expected " + str(2) + ", was " + str(search("abcd", "cd"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, search("abcd", "ce"))) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(search("abcd", "ce"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, search("abc", "z"))) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(search("abc", "z"));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["split", function () {
  if (! equal63([], split("", ""))) {
    failed = failed + 1;
    return "failed: expected " + str([]) + ", was " + str(split("", ""));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], split("", ","))) {
    failed = failed + 1;
    return "failed: expected " + str([]) + ", was " + str(split("", ","));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], split("a", ","))) {
    failed = failed + 1;
    return "failed: expected " + str(["a"]) + ", was " + str(split("a", ","));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", ""], split("a,", ","))) {
    failed = failed + 1;
    return "failed: expected " + str(["a", ""]) + ", was " + str(split("a,", ","));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", "b"], split("a,b", ","))) {
    failed = failed + 1;
    return "failed: expected " + str(["a", "b"]) + ", was " + str(split("a,b", ","));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", "b", ""], split("a,b,", ","))) {
    failed = failed + 1;
    return "failed: expected " + str(["a", "b", ""]) + ", was " + str(split("a,b,", ","));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", "b"], split("azzb", "zz"))) {
    failed = failed + 1;
    return "failed: expected " + str(["a", "b"]) + ", was " + str(split("azzb", "zz"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", "b", ""], split("azzbzz", "zz"))) {
    failed = failed + 1;
    return "failed: expected " + str(["a", "b", ""]) + ", was " + str(split("azzbzz", "zz"));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["reduce", function () {
  if (! equal63("a", reduce(function (_0, _1) {
    return _0 + _1;
  }, ["a"]))) {
    failed = failed + 1;
    return "failed: expected " + str("a") + ", was " + str(reduce(function (_0, _1) {
      return _0 + _1;
    }, ["a"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(6, reduce(function (_0, _1) {
    return _0 + _1;
  }, [1, 2, 3]))) {
    failed = failed + 1;
    return "failed: expected " + str(6) + ", was " + str(reduce(function (_0, _1) {
      return _0 + _1;
    }, [1, 2, 3]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, [2, 3]], reduce(function (_0, _1) {
    return [_0, _1];
  }, [1, 2, 3]))) {
    failed = failed + 1;
    return "failed: expected " + str([1, [2, 3]]) + ", was " + str(reduce(function (_0, _1) {
      return [_0, _1];
    }, [1, 2, 3]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3, 4, 5], reduce(function (_0, _1) {
    return join(_0, _1);
  }, [[1], [2, 3], [4, 5]]))) {
    failed = failed + 1;
    return "failed: expected " + str([1, 2, 3, 4, 5]) + ", was " + str(reduce(function (_0, _1) {
      return join(_0, _1);
    }, [[1], [2, 3], [4, 5]]));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["keep", function () {
  if (! equal63([], keep(function (_) {
    return _;
  }, []))) {
    failed = failed + 1;
    return "failed: expected " + str([]) + ", was " + str(keep(function (_) {
      return _;
    }, []));
  } else {
    passed = passed + 1;
  }
  var _even = function (_) {
    return _ % 2 === 0;
  };
  if (! equal63([6], keep(_even, [5, 6, 7]))) {
    failed = failed + 1;
    return "failed: expected " + str([6]) + ", was " + str(keep(_even, [5, 6, 7]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([[1], [2, 3]], keep(function (_) {
    return (_.length || 0) > 0;
  }, [[], [1], [], [2, 3]]))) {
    failed = failed + 1;
    return "failed: expected " + str([[1], [2, 3]]) + ", was " + str(keep(function (_) {
      return (_.length || 0) > 0;
    }, [[], [1], [], [2, 3]]));
  } else {
    passed = passed + 1;
  }
  var _even63 = function (_) {
    return _ % 2 === 0;
  };
  if (! equal63([2, 4, 6], keep(_even63, [1, 2, 3, 4, 5, 6]))) {
    failed = failed + 1;
    return "failed: expected " + str([2, 4, 6]) + ", was " + str(keep(_even63, [1, 2, 3, 4, 5, 6]));
  } else {
    passed = passed + 1;
  }
  var __x874 = [2, 4, 6];
  __x874.b = 8;
  var __x875 = [1, 2, 3, 4, 5, 6];
  __x875.a = 7;
  __x875.b = 8;
  if (! equal63(__x874, keep(_even63, __x875))) {
    failed = failed + 1;
    var __x876 = [2, 4, 6];
    __x876.b = 8;
    var __x877 = [1, 2, 3, 4, 5, 6];
    __x877.a = 7;
    __x877.b = 8;
    return "failed: expected " + str(__x876) + ", was " + str(keep(_even63, __x877));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["in?", function () {
  if (! equal63(true, in63("x", ["x", "y", "z"]))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(in63("x", ["x", "y", "z"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, in63(7, [5, 6, 7]))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(in63(7, [5, 6, 7]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, in63("baz", ["no", "can", "do"]))) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(in63("baz", ["no", "can", "do"]));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["find", function () {
  if (! equal63(undefined, find(function (_) {
    return _;
  }, []))) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(find(function (_) {
      return _;
    }, []));
  } else {
    passed = passed + 1;
  }
  if (! equal63(7, find(function (_) {
    return _;
  }, [7]))) {
    failed = failed + 1;
    return "failed: expected " + str(7) + ", was " + str(find(function (_) {
      return _;
    }, [7]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, find(function (_) {
    return _ === 7;
  }, [2, 4, 7]))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(find(function (_) {
      return _ === 7;
    }, [2, 4, 7]));
  } else {
    passed = passed + 1;
  }
  var __x890 = [2, 4];
  __x890.foo = 7;
  if (! equal63(true, find(function (_) {
    return _ === 7;
  }, __x890))) {
    failed = failed + 1;
    var __x891 = [2, 4];
    __x891.foo = 7;
    return "failed: expected " + str(true) + ", was " + str(find(function (_) {
      return _ === 7;
    }, __x891));
  } else {
    passed = passed + 1;
  }
  var __x892 = [2, 4];
  __x892.bar = true;
  if (! equal63(true, find(function (_) {
    return _ === true;
  }, __x892))) {
    failed = failed + 1;
    var __x893 = [2, 4];
    __x893.bar = true;
    return "failed: expected " + str(true) + ", was " + str(find(function (_) {
      return _ === true;
    }, __x893));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, in63(7, [2, 4, 7]))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(in63(7, [2, 4, 7]));
  } else {
    passed = passed + 1;
  }
  var __x896 = [2, 4];
  __x896.foo = 7;
  if (! equal63(true, in63(7, __x896))) {
    failed = failed + 1;
    var __x897 = [2, 4];
    __x897.foo = 7;
    return "failed: expected " + str(true) + ", was " + str(in63(7, __x897));
  } else {
    passed = passed + 1;
  }
  var __x898 = [2, 4];
  __x898.bar = true;
  if (! equal63(true, in63(true, __x898))) {
    failed = failed + 1;
    var __x899 = [2, 4];
    __x899.bar = true;
    return "failed: expected " + str(true) + ", was " + str(in63(true, __x899));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["first", function () {
  if (! equal63(undefined, first(function (_) {
    return _;
  }, []))) {
    failed = failed + 1;
    return "failed: expected " + str(undefined) + ", was " + str(first(function (_) {
      return _;
    }, []));
  } else {
    passed = passed + 1;
  }
  if (! equal63(7, first(function (_) {
    return _;
  }, [7]))) {
    failed = failed + 1;
    return "failed: expected " + str(7) + ", was " + str(first(function (_) {
      return _;
    }, [7]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, first(function (_) {
    return _ === 7;
  }, [2, 4, 7]))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(first(function (_) {
      return _ === 7;
    }, [2, 4, 7]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, first(function (_) {
    return _ > 3 && _;
  }, [1, 2, 3, 4, 5, 6]))) {
    failed = failed + 1;
    return "failed: expected " + str(4) + ", was " + str(first(function (_) {
      return _ > 3 && _;
    }, [1, 2, 3, 4, 5, 6]));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["sort", function () {
  if (! equal63(["a", "b", "c"], sort(["c", "a", "b"]))) {
    failed = failed + 1;
    return "failed: expected " + str(["a", "b", "c"]) + ", was " + str(sort(["c", "a", "b"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([3, 2, 1], sort([1, 2, 3], _62))) {
    failed = failed + 1;
    return "failed: expected " + str([3, 2, 1]) + ", was " + str(sort([1, 2, 3], _62));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["type", function () {
  if (! equal63(true, typeof("abc") === "string")) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(typeof("abc") === "string");
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof(17) === "string")) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(typeof(17) === "string");
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof(["a"]) === "string")) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(typeof(["a"]) === "string");
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof(true) === "string")) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(typeof(true) === "string");
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof({}) === "string")) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(typeof({}) === "string");
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof("abc") === "number")) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(typeof("abc") === "number");
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, typeof(17) === "number")) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(typeof(17) === "number");
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof(["a"]) === "number")) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(typeof(["a"]) === "number");
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof(true) === "number")) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(typeof(true) === "number");
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof({}) === "number")) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(typeof({}) === "number");
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof("abc") === "boolean")) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(typeof("abc") === "boolean");
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof(17) === "boolean")) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(typeof(17) === "boolean");
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof(["a"]) === "boolean")) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(typeof(["a"]) === "boolean");
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, typeof(true) === "boolean")) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(typeof(true) === "boolean");
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof({}) === "boolean")) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(typeof({}) === "boolean");
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, !( typeof(undefined) === "object"))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(!( typeof(undefined) === "object"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, !( typeof("abc") === "object"))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(!( typeof("abc") === "object"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, !( typeof(42) === "object"))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(!( typeof(42) === "object"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, !( typeof(true) === "object"))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(!( typeof(true) === "object"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, !( typeof(function () {
  }) === "object"))) {
    failed = failed + 1;
    return "failed: expected " + str(true) + ", was " + str(!( typeof(function () {
    }) === "object"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, !( typeof([1]) === "object"))) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(!( typeof([1]) === "object"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, !( typeof({}) === "object"))) {
    failed = failed + 1;
    return "failed: expected " + str(false) + ", was " + str(!( typeof({}) === "object"));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["apply", function () {
  if (! equal63(4, apply(function (_0, _1) {
    return _0 + _1;
  }, [2, 2]))) {
    failed = failed + 1;
    return "failed: expected " + str(4) + ", was " + str(apply(function (_0, _1) {
      return _0 + _1;
    }, [2, 2]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([2, 2], apply(function () {
    var _a53 = unstash(Array.prototype.slice.call(arguments, 0));
    return _a53;
  }, [2, 2]))) {
    failed = failed + 1;
    return "failed: expected " + str([2, 2]) + ", was " + str(apply(function () {
      var _a54 = unstash(Array.prototype.slice.call(arguments, 0));
      return _a54;
    }, [2, 2]));
  } else {
    passed = passed + 1;
  }
  var _l19 = [1];
  _l19.foo = 17;
  if (! equal63(17, apply(function () {
    var _a55 = unstash(Array.prototype.slice.call(arguments, 0));
    return _a55.foo;
  }, _l19))) {
    failed = failed + 1;
    return "failed: expected " + str(17) + ", was " + str(apply(function () {
      var _a56 = unstash(Array.prototype.slice.call(arguments, 0));
      return _a56.foo;
    }, _l19));
  } else {
    passed = passed + 1;
  }
  var __x933 = [];
  __x933.foo = 42;
  if (! equal63(42, apply(function () {
    var __r183 = unstash(Array.prototype.slice.call(arguments, 0));
    var _foo4 = __r183.foo;
    return _foo4;
  }, __x933))) {
    failed = failed + 1;
    var __x934 = [];
    __x934.foo = 42;
    return "failed: expected " + str(42) + ", was " + str(apply(function () {
      var __r184 = unstash(Array.prototype.slice.call(arguments, 0));
      var _foo5 = __r184.foo;
      return _foo5;
    }, __x934));
  } else {
    passed = passed + 1;
  }
  var __x937 = [];
  __x937.foo = 42;
  if (! equal63(42, apply(function (_x935) {
    var _foo6 = _x935.foo;
    return _foo6;
  }, [__x937]))) {
    failed = failed + 1;
    var __x940 = [];
    __x940.foo = 42;
    return "failed: expected " + str(42) + ", was " + str(apply(function (_x938) {
      var _foo7 = _x938.foo;
      return _foo7;
    }, [__x940]));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["eval", function () {
  var _eval = compiler.eval;
  if (! equal63(4, _eval(["+", 2, 2]))) {
    failed = failed + 1;
    return "failed: expected " + str(4) + ", was " + str(_eval(["+", 2, 2]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(5, _eval(["let", "a", 3, ["+", 2, "a"]]))) {
    failed = failed + 1;
    return "failed: expected " + str(5) + ", was " + str(_eval(["let", "a", 3, ["+", 2, "a"]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(9, _eval(["do", ["var", "x", 7], ["+", "x", 2]]))) {
    failed = failed + 1;
    return "failed: expected " + str(9) + ", was " + str(_eval(["do", ["var", "x", 7], ["+", "x", 2]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(6, _eval(["apply", "+", ["quote", [1, 2, 3]]]))) {
    failed = failed + 1;
    return "failed: expected " + str(6) + ", was " + str(_eval(["apply", "+", ["quote", [1, 2, 3]]]));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
add(tests, ["parameters", function () {
  if (! equal63(42, (function (_x961) {
    var _a57 = _x961[0];
    return _a57;
  })([42]))) {
    failed = failed + 1;
    return "failed: expected " + str(42) + ", was " + str((function (_x963) {
      var _a58 = _x963[0];
      return _a58;
    })([42]));
  } else {
    passed = passed + 1;
  }
  var _f4 = function (a, _x965) {
    var _b22 = _x965[0];
    var _c5 = _x965[1];
    return [a, _b22, _c5];
  };
  if (! equal63([1, 2, 3], _f4(1, [2, 3]))) {
    failed = failed + 1;
    return "failed: expected " + str([1, 2, 3]) + ", was " + str(_f4(1, [2, 3]));
  } else {
    passed = passed + 1;
  }
  var _f5 = function (a, _x971) {
    var _b23 = _x971[0];
    var _c6 = cut(_x971, 1);
    var __r192 = unstash(Array.prototype.slice.call(arguments, 2));
    var _d2 = cut(__r192, 0);
    return [a, _b23, _c6, _d2];
  };
  if (! equal63([1, 2, [3, 4], [5, 6, 7]], _f5(1, [2, 3, 4], 5, 6, 7))) {
    failed = failed + 1;
    return "failed: expected " + str([1, 2, [3, 4], [5, 6, 7]]) + ", was " + str(_f5(1, [2, 3, 4], 5, 6, 7));
  } else {
    passed = passed + 1;
  }
  var _f6 = function (a, _x981) {
    var _b24 = _x981[0];
    var _c7 = cut(_x981, 1);
    var __r193 = unstash(Array.prototype.slice.call(arguments, 2));
    var _d3 = cut(__r193, 0);
    return [a, _b24, _c7, _d3];
  };
  if (! equal63([1, 2, [3, 4], [5, 6, 7]], apply(_f6, [1, [2, 3, 4], 5, 6, 7]))) {
    failed = failed + 1;
    return "failed: expected " + str([1, 2, [3, 4], [5, 6, 7]]) + ", was " + str(apply(_f6, [1, [2, 3, 4], 5, 6, 7]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([3, 4], (function (a, b) {
    var __r194 = unstash(Array.prototype.slice.call(arguments, 2));
    var _c8 = cut(__r194, 0);
    return _c8;
  })(1, 2, 3, 4))) {
    failed = failed + 1;
    return "failed: expected " + str([3, 4]) + ", was " + str((function (a, b) {
      var __r195 = unstash(Array.prototype.slice.call(arguments, 2));
      var _c9 = cut(__r195, 0);
      return _c9;
    })(1, 2, 3, 4));
  } else {
    passed = passed + 1;
  }
  var _f7 = function (w, _x995) {
    var _x996 = _x995[0];
    var _y2 = cut(_x995, 1);
    var __r196 = unstash(Array.prototype.slice.call(arguments, 2));
    var _z2 = cut(__r196, 0);
    return [_y2, _z2];
  };
  if (! equal63([[3, 4], [5, 6, 7]], _f7(1, [2, 3, 4], 5, 6, 7))) {
    failed = failed + 1;
    return "failed: expected " + str([[3, 4], [5, 6, 7]]) + ", was " + str(_f7(1, [2, 3, 4], 5, 6, 7));
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, (function () {
    var __r197 = unstash(Array.prototype.slice.call(arguments, 0));
    var _foo8 = __r197.foo;
    return _foo8;
  })(stash33({["foo"]: 42})))) {
    failed = failed + 1;
    return "failed: expected " + str(42) + ", was " + str((function () {
      var __r198 = unstash(Array.prototype.slice.call(arguments, 0));
      var _foo9 = __r198.foo;
      return _foo9;
    })(stash33({["foo"]: 42})));
  } else {
    passed = passed + 1;
  }
  var __x1006 = [];
  __x1006.foo = 42;
  if (! equal63(42, apply(function () {
    var __r199 = unstash(Array.prototype.slice.call(arguments, 0));
    var _foo10 = __r199.foo;
    return _foo10;
  }, __x1006))) {
    failed = failed + 1;
    var __x1007 = [];
    __x1007.foo = 42;
    return "failed: expected " + str(42) + ", was " + str(apply(function () {
      var __r200 = unstash(Array.prototype.slice.call(arguments, 0));
      var _foo11 = __r200.foo;
      return _foo11;
    }, __x1007));
  } else {
    passed = passed + 1;
  }
  var __x1009 = [];
  __x1009.foo = 42;
  if (! equal63(42, (function (_x1008) {
    var _foo12 = _x1008.foo;
    return _foo12;
  })(__x1009))) {
    failed = failed + 1;
    var __x1011 = [];
    __x1011.foo = 42;
    return "failed: expected " + str(42) + ", was " + str((function (_x1010) {
      var _foo13 = _x1010.foo;
      return _foo13;
    })(__x1011));
  } else {
    passed = passed + 1;
  }
  var _f8 = function (a, _x1012) {
    var _foo14 = _x1012.foo;
    var __r203 = unstash(Array.prototype.slice.call(arguments, 2));
    var _b25 = __r203.bar;
    return [a, _b25, _foo14];
  };
  var __x1015 = [];
  __x1015.foo = 42;
  if (! equal63([10, 20, 42], _f8(10, __x1015, stash33({["bar"]: 20})))) {
    failed = failed + 1;
    var __x1017 = [];
    __x1017.foo = 42;
    return "failed: expected " + str([10, 20, 42]) + ", was " + str(_f8(10, __x1017, stash33({["bar"]: 20})));
  } else {
    passed = passed + 1;
  }
  var _f9 = function (a, _x1018) {
    var _foo15 = _x1018.foo;
    var __r204 = unstash(Array.prototype.slice.call(arguments, 2));
    var _b26 = __r204.bar;
    return [a, _b26, _foo15];
  };
  var __x1022 = ["list"];
  __x1022.foo = 42;
  var __x1021 = [10, __x1022];
  __x1021.bar = 20;
  if (! equal63([10, 20, 42], apply(_f9, __x1021))) {
    failed = failed + 1;
    var __x1025 = ["list"];
    __x1025.foo = 42;
    var __x1024 = [10, __x1025];
    __x1024.bar = 20;
    return "failed: expected " + str([10, 20, 42]) + ", was " + str(apply(_f9, __x1024));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, (function (a) {
    var __r205 = unstash(Array.prototype.slice.call(arguments, 1));
    var _b27 = __r205.b;
    return (a || 0) + _b27;
  })(stash33({["b"]: 1})))) {
    failed = failed + 1;
    return "failed: expected " + str(1) + ", was " + str((function (a) {
      var __r206 = unstash(Array.prototype.slice.call(arguments, 1));
      var _b28 = __r206.b;
      return (a || 0) + _b28;
    })(stash33({["b"]: 1})));
  } else {
    passed = passed + 1;
  }
  var __x1026 = [];
  __x1026.b = 1;
  if (! equal63(1, apply(function (a) {
    var __r207 = unstash(Array.prototype.slice.call(arguments, 1));
    var _b29 = __r207.b;
    return (a || 0) + _b29;
  }, __x1026))) {
    failed = failed + 1;
    var __x1027 = [];
    __x1027.b = 1;
    return "failed: expected " + str(1) + ", was " + str(apply(function (a) {
      var __r208 = unstash(Array.prototype.slice.call(arguments, 1));
      var _b30 = __r208.b;
      return (a || 0) + _b30;
    }, __x1027));
  } else {
    passed = passed + 1;
  }
  var _l20 = [];
  var f = function () {
    var __r209 = unstash(Array.prototype.slice.call(arguments, 0));
    var _a59 = __r209.a;
    add(_l20, _a59);
    return _a59;
  };
  var g = function (a, b) {
    var __r210 = unstash(Array.prototype.slice.call(arguments, 2));
    var _c10 = __r210.c;
    add(_l20, [a, b, _c10]);
    return _c10;
  };
  var x = f(stash33({["a"]: g(f(stash33({["a"]: 10})), f(stash33({["a"]: 20})), stash33({["c"]: f(stash33({["a"]: 42}))}))}));
  if (! equal63(42, x)) {
    failed = failed + 1;
    return "failed: expected " + str(42) + ", was " + str(x);
  } else {
    passed = passed + 1;
  }
  if (! equal63([10, 20, 42, [10, 20, 42], 42], _l20)) {
    failed = failed + 1;
    return "failed: expected " + str([10, 20, 42, [10, 20, 42], 42]) + ", was " + str(_l20);
  } else {
    passed = passed + 1;
  }
  var _f10 = function () {
    var _args = unstash(Array.prototype.slice.call(arguments, 0));
    return _args;
  };
  if (! equal63([1, 2, 3], _f10(1, 2, 3))) {
    failed = failed + 1;
    return "failed: expected " + str([1, 2, 3]) + ", was " + str(_f10(1, 2, 3));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3], apply(_f10, [1, 2, 3]))) {
    failed = failed + 1;
    return "failed: expected " + str([1, 2, 3]) + ", was " + str(apply(_f10, [1, 2, 3]));
  } else {
    passed = passed + 1;
    return passed;
  }
}]);
if (typeof(_x1039) === "undefined" || _x1039 === null) {
  _x1039 = true;
  run_tests();
}
