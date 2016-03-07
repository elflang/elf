require("elf.js");
var reader = require("reader");
var compiler = require("compiler");
var passed = 0;
var failed = 0;
var tests = [];
setenv("test", stash33({macro: function (x, msg) {
  return(["if", ["not", x], ["do", ["=", "failed", ["+", "failed", 1]], ["return", msg]], ["++", "passed"]]);
}}));
var equal63 = function (a, b) {
  if (!( typeof(a) === "object")) {
    return(a === b);
  } else {
    return(str(a) === str(b));
  }
};
setenv("eq", stash33({macro: function (a, b) {
  return(["test", ["equal?", a, b], ["cat", "\"failed: expected \"", ["str", a], "\", was \"", ["str", b]]]);
}}));
setenv("deftest", stash33({macro: function (name) {
  var _r6 = unstash(Array.prototype.slice.call(arguments, 1));
  var body = cut(_r6, 0);
  return(["add", "tests", ["list", ["quote", name], ["%fn", join(["do"], body)]]]);
}}));
run_tests = function () {
  var _l = tests;
  var _i = undefined;
  for (_i in _l) {
    var _id2 = _l[_i];
    var name = _id2[0];
    var f = _id2[1];
    var _e6;
    if (numeric63(_i)) {
      _e6 = parseInt(_i);
    } else {
      _e6 = _i;
    }
    var __i = _e6;
    var result = f();
    if (typeof(result) === "string") {
      print(" " + name + " " + result);
    }
  }
  return(print(" " + passed + " passed, " + failed + " failed"));
};
add(tests, ["reader", function () {
  var read = reader["read-string"];
  if (! equal63(undefined, read(""))) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(read("")));
  } else {
    passed = passed + 1;
  }
  if (! equal63("nil", read("nil"))) {
    failed = failed + 1;
    return("failed: expected " + str("nil") + ", was " + str(read("nil")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, read("17"))) {
    failed = failed + 1;
    return("failed: expected " + str(17) + ", was " + str(read("17")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(0.015, read("1.5e-2"))) {
    failed = failed + 1;
    return("failed: expected " + str(0.015) + ", was " + str(read("1.5e-2")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, read("true"))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(read("true")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(! true, read("false"))) {
    failed = failed + 1;
    return("failed: expected " + str(! true) + ", was " + str(read("false")));
  } else {
    passed = passed + 1;
  }
  if (! equal63("hi", read("hi"))) {
    failed = failed + 1;
    return("failed: expected " + str("hi") + ", was " + str(read("hi")));
  } else {
    passed = passed + 1;
  }
  if (! equal63("\"hi\"", read("\"hi\""))) {
    failed = failed + 1;
    return("failed: expected " + str("\"hi\"") + ", was " + str(read("\"hi\"")));
  } else {
    passed = passed + 1;
  }
  if (! equal63("|hi|", read("|hi|"))) {
    failed = failed + 1;
    return("failed: expected " + str("|hi|") + ", was " + str(read("|hi|")));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2], read("(1 2)"))) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2]) + ", was " + str(read("(1 2)")));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, ["a"]], read("(1 (a))"))) {
    failed = failed + 1;
    return("failed: expected " + str([1, ["a"]]) + ", was " + str(read("(1 (a))")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quote", "a"], read("'a"))) {
    failed = failed + 1;
    return("failed: expected " + str(["quote", "a"]) + ", was " + str(read("'a")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", "a"], read("`a"))) {
    failed = failed + 1;
    return("failed: expected " + str(["quasiquote", "a"]) + ", was " + str(read("`a")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", ["unquote", "a"]], read("`,a"))) {
    failed = failed + 1;
    return("failed: expected " + str(["quasiquote", ["unquote", "a"]]) + ", was " + str(read("`,a")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", ["unquote-splicing", "a"]], read("`,@a"))) {
    failed = failed + 1;
    return("failed: expected " + str(["quasiquote", ["unquote-splicing", "a"]]) + ", was " + str(read("`,@a")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, read("(1 2 a: 7)").length || 0)) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(read("(1 2 a: 7)").length || 0));
  } else {
    passed = passed + 1;
  }
  if (! equal63(7, read("(1 2 a: 7)").a)) {
    failed = failed + 1;
    return("failed: expected " + str(7) + ", was " + str(read("(1 2 a: 7)").a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, read("(:a)").a)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(read("(:a)").a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, - -1)) {
    failed = failed + 1;
    return("failed: expected " + str(1) + ", was " + str(- -1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, nan63(read("nan")))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(nan63(read("nan"))));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, nan63(read("-nan")))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(nan63(read("-nan"))));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, inf63(read("inf")))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(inf63(read("inf"))));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, inf63(read("-inf")))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(inf63(read("-inf"))));
  } else {
    passed = passed + 1;
  }
  if (! equal63("0?", read("0?"))) {
    failed = failed + 1;
    return("failed: expected " + str("0?") + ", was " + str(read("0?")));
  } else {
    passed = passed + 1;
  }
  if (! equal63("0!", read("0!"))) {
    failed = failed + 1;
    return("failed: expected " + str("0!") + ", was " + str(read("0!")));
  } else {
    passed = passed + 1;
  }
  if (! equal63("0.", read("0."))) {
    failed = failed + 1;
    return("failed: expected " + str("0.") + ", was " + str(read("0.")));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["read-more", function () {
  var read = reader["read-string"];
  if (! equal63(17, read("17", true))) {
    failed = failed + 1;
    return("failed: expected " + str(17) + ", was " + str(read("17", true)));
  } else {
    passed = passed + 1;
  }
  var more = [];
  if (! equal63(more, read("(open", more))) {
    failed = failed + 1;
    return("failed: expected " + str(more) + ", was " + str(read("(open", more)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(more, read("\"unterminated ", more))) {
    failed = failed + 1;
    return("failed: expected " + str(more) + ", was " + str(read("\"unterminated ", more)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(more, read("|identifier", more))) {
    failed = failed + 1;
    return("failed: expected " + str(more) + ", was " + str(read("|identifier", more)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(more, read("'(a b c", more))) {
    failed = failed + 1;
    return("failed: expected " + str(more) + ", was " + str(read("'(a b c", more)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(more, read("`(a b c", more))) {
    failed = failed + 1;
    return("failed: expected " + str(more) + ", was " + str(read("`(a b c", more)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(more, read("`(a b ,(z", more))) {
    failed = failed + 1;
    return("failed: expected " + str(more) + ", was " + str(read("`(a b ,(z", more)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(more, read("`\"biz", more))) {
    failed = failed + 1;
    return("failed: expected " + str(more) + ", was " + str(read("`\"biz", more)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(more, read("'\"boz", more))) {
    failed = failed + 1;
    return("failed: expected " + str(more) + ", was " + str(read("'\"boz", more)));
  } else {
    passed = passed + 1;
  }
  var _id3 = (function () {
    try {
      return([true, read("(open")]);
    }
    catch (_e75) {
      return([false, _e75.message, _e75.stack]);
    }
  })();
  var ok = _id3[0];
  var msg = _id3[1];
  if (! equal63(false, ok)) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(ok));
  } else {
    passed = passed + 1;
  }
  if (! equal63("Expected ) at 5", msg)) {
    failed = failed + 1;
    return("failed: expected " + str("Expected ) at 5") + ", was " + str(msg));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["bool", function () {
  if (! equal63(true, true || false)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(true || false));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, false || false)) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(false || false));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, false || false || true)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(false || false || true));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, ! false)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(! false));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, !( false && true))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(!( false && true)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, !( false || true))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(!( false || true)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, !( false && true))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(!( false && true)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, !( false || true))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(!( false || true)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, true && true)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(true && true));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, true && false)) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(true && false));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, true && true && false)) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(true && true && false));
  } else {
    passed = passed + 1;
    return(passed);
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
    return("failed: expected " + str(true) + ", was " + str(_e8));
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
    return("failed: expected " + str(false) + ", was " + str(_e10));
  } else {
    passed = passed + 1;
  }
  var a = true;
  var _id62 = true;
  var _e11;
  if (_id62) {
    _e11 = _id62;
  } else {
    a = false;
    _e11 = false;
  }
  if (! equal63(true, _e11)) {
    failed = failed + 1;
    var _id63 = true;
    var _e12;
    if (_id63) {
      _e12 = _id63;
    } else {
      a = false;
      _e12 = false;
    }
    return("failed: expected " + str(true) + ", was " + str(_e12));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, a)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  var _id64 = false;
  var _e13;
  if (_id64) {
    a = false;
    _e13 = true;
  } else {
    _e13 = _id64;
  }
  if (! equal63(false, _e13)) {
    failed = failed + 1;
    var _id65 = false;
    var _e14;
    if (_id65) {
      a = false;
      _e14 = true;
    } else {
      _e14 = _id65;
    }
    return("failed: expected " + str(false) + ", was " + str(_e14));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, a)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  var b = true;
  b = false;
  var _id66 = false;
  var _e15;
  if (_id66) {
    _e15 = _id66;
  } else {
    b = true;
    _e15 = b;
  }
  if (! equal63(true, _e15)) {
    failed = failed + 1;
    b = false;
    var _id67 = false;
    var _e16;
    if (_id67) {
      _e16 = _id67;
    } else {
      b = true;
      _e16 = b;
    }
    return("failed: expected " + str(true) + ", was " + str(_e16));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, b)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(b));
  } else {
    passed = passed + 1;
  }
  b = true;
  var _id68 = b;
  var _e17;
  if (_id68) {
    _e17 = _id68;
  } else {
    b = true;
    _e17 = b;
  }
  if (! equal63(true, _e17)) {
    failed = failed + 1;
    b = true;
    var _id69 = b;
    var _e18;
    if (_id69) {
      _e18 = _id69;
    } else {
      b = true;
      _e18 = b;
    }
    return("failed: expected " + str(true) + ", was " + str(_e18));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, b)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(b));
  } else {
    passed = passed + 1;
  }
  b = false;
  var _id70 = true;
  var _e19;
  if (_id70) {
    b = true;
    _e19 = b;
  } else {
    _e19 = _id70;
  }
  if (! equal63(true, _e19)) {
    failed = failed + 1;
    b = false;
    var _id71 = true;
    var _e20;
    if (_id71) {
      b = true;
      _e20 = b;
    } else {
      _e20 = _id71;
    }
    return("failed: expected " + str(true) + ", was " + str(_e20));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, b)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(b));
  } else {
    passed = passed + 1;
  }
  b = false;
  var _id72 = b;
  var _e21;
  if (_id72) {
    b = true;
    _e21 = b;
  } else {
    _e21 = _id72;
  }
  if (! equal63(false, _e21)) {
    failed = failed + 1;
    b = false;
    var _id73 = b;
    var _e22;
    if (_id73) {
      b = true;
      _e22 = b;
    } else {
      _e22 = _id73;
    }
    return("failed: expected " + str(false) + ", was " + str(_e22));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, b)) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(b));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["numeric", function () {
  if (! equal63(4, 2 + 2)) {
    failed = failed + 1;
    return("failed: expected " + str(4) + ", was " + str(2 + 2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, apply(_43, [2, 2]))) {
    failed = failed + 1;
    return("failed: expected " + str(4) + ", was " + str(apply(_43, [2, 2])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(0, apply(_43, []))) {
    failed = failed + 1;
    return("failed: expected " + str(0) + ", was " + str(apply(_43, [])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(18, 18)) {
    failed = failed + 1;
    return("failed: expected " + str(18) + ", was " + str(18));
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, 7 - 3)) {
    failed = failed + 1;
    return("failed: expected " + str(4) + ", was " + str(7 - 3));
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, apply(_, [7, 3]))) {
    failed = failed + 1;
    return("failed: expected " + str(4) + ", was " + str(apply(_, [7, 3])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(0, apply(_, []))) {
    failed = failed + 1;
    return("failed: expected " + str(0) + ", was " + str(apply(_, [])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(5, 10 / 2)) {
    failed = failed + 1;
    return("failed: expected " + str(5) + ", was " + str(10 / 2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(5, apply(_47, [10, 2]))) {
    failed = failed + 1;
    return("failed: expected " + str(5) + ", was " + str(apply(_47, [10, 2])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, apply(_47, []))) {
    failed = failed + 1;
    return("failed: expected " + str(1) + ", was " + str(apply(_47, [])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(6, 2 * 3)) {
    failed = failed + 1;
    return("failed: expected " + str(6) + ", was " + str(2 * 3));
  } else {
    passed = passed + 1;
  }
  if (! equal63(6, apply(_42, [2, 3]))) {
    failed = failed + 1;
    return("failed: expected " + str(6) + ", was " + str(apply(_42, [2, 3])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, apply(_42, []))) {
    failed = failed + 1;
    return("failed: expected " + str(1) + ", was " + str(apply(_42, [])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, 2.01 > 2)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(2.01 > 2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, 5 >= 5)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(5 >= 5));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, 2100 > 2000)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(2100 > 2000));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, 0.002 < 0.0021)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(0.002 < 0.0021));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, 2 < 2)) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(2 < 2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, 2 <= 2)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(2 <= 2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(-7, - 7)) {
    failed = failed + 1;
    return("failed: expected " + str(-7) + ", was " + str(- 7));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["math", function () {
  if (! equal63(3, max(1, 3))) {
    failed = failed + 1;
    return("failed: expected " + str(3) + ", was " + str(max(1, 3)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, min(2, 7))) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(min(2, 7)));
  } else {
    passed = passed + 1;
  }
  var n = random();
  if (! equal63(true, n > 0 && n < 1)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(n > 0 && n < 1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, floor(4.78))) {
    failed = failed + 1;
    return("failed: expected " + str(4) + ", was " + str(floor(4.78)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["precedence", function () {
  if (! equal63(-3, -( 1 + 2))) {
    failed = failed + 1;
    return("failed: expected " + str(-3) + ", was " + str(-( 1 + 2)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, 12 - (1 + 1))) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(12 - (1 + 1)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(11, 12 - 1 * 1)) {
    failed = failed + 1;
    return("failed: expected " + str(11) + ", was " + str(12 - 1 * 1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, 4 / 2 + 8)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(4 / 2 + 8));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["standalone", function () {
  if (! equal63(10, 10)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(10));
  } else {
    passed = passed + 1;
  }
  var x = undefined;
  x = 10;
  if (! equal63(9, 9)) {
    failed = failed + 1;
    x = 10;
    return("failed: expected " + str(9) + ", was " + str(9));
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, x)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(x));
  } else {
    passed = passed + 1;
  }
  if (! equal63(12, 12)) {
    failed = failed + 1;
    return("failed: expected " + str(12) + ", was " + str(12));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["string", function () {
  if (! equal63(3, "foo".length || 0)) {
    failed = failed + 1;
    return("failed: expected " + str(3) + ", was " + str("foo".length || 0));
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, "\"a\"".length || 0)) {
    failed = failed + 1;
    return("failed: expected " + str(3) + ", was " + str("\"a\"".length || 0));
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", "a")) {
    failed = failed + 1;
    return("failed: expected " + str("a") + ", was " + str("a"));
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", char("bar", 1))) {
    failed = failed + 1;
    return("failed: expected " + str("a") + ", was " + str(char("bar", 1)));
  } else {
    passed = passed + 1;
  }
  var s = "a\nb";
  if (! equal63(3, s.length || 0)) {
    failed = failed + 1;
    return("failed: expected " + str(3) + ", was " + str(s.length || 0));
  } else {
    passed = passed + 1;
  }
  var _s = "a\nb\nc";
  if (! equal63(5, _s.length || 0)) {
    failed = failed + 1;
    return("failed: expected " + str(5) + ", was " + str(_s.length || 0));
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, "a\nb".length || 0)) {
    failed = failed + 1;
    return("failed: expected " + str(3) + ", was " + str("a\nb".length || 0));
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, "a\\b".length || 0)) {
    failed = failed + 1;
    return("failed: expected " + str(3) + ", was " + str("a\\b".length || 0));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["quote", function () {
  if (! equal63(7, 7)) {
    failed = failed + 1;
    return("failed: expected " + str(7) + ", was " + str(7));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, true)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(true));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, false)) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(false));
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", "a")) {
    failed = failed + 1;
    return("failed: expected " + str("a") + ", was " + str("a"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quote", "a"], ["quote", "a"])) {
    failed = failed + 1;
    return("failed: expected " + str(["quote", "a"]) + ", was " + str(["quote", "a"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63("\"a\"", "\"a\"")) {
    failed = failed + 1;
    return("failed: expected " + str("\"a\"") + ", was " + str("\"a\""));
  } else {
    passed = passed + 1;
  }
  if (! equal63("\"\\n\"", "\"\\n\"")) {
    failed = failed + 1;
    return("failed: expected " + str("\"\\n\"") + ", was " + str("\"\\n\""));
  } else {
    passed = passed + 1;
  }
  if (! equal63("\"\\\\\"", "\"\\\\\"")) {
    failed = failed + 1;
    return("failed: expected " + str("\"\\\\\"") + ", was " + str("\"\\\\\""));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quote", "\"a\""], ["quote", "\"a\""])) {
    failed = failed + 1;
    return("failed: expected " + str(["quote", "\"a\""]) + ", was " + str(["quote", "\"a\""]));
  } else {
    passed = passed + 1;
  }
  if (! equal63("|(|", "|(|")) {
    failed = failed + 1;
    return("failed: expected " + str("|(|") + ", was " + str("|(|"));
  } else {
    passed = passed + 1;
  }
  if (! equal63("unquote", "unquote")) {
    failed = failed + 1;
    return("failed: expected " + str("unquote") + ", was " + str("unquote"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["unquote"], ["unquote"])) {
    failed = failed + 1;
    return("failed: expected " + str(["unquote"]) + ", was " + str(["unquote"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["unquote", "a"], ["unquote", "a"])) {
    failed = failed + 1;
    return("failed: expected " + str(["unquote", "a"]) + ", was " + str(["unquote", "a"]));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["list", function () {
  if (! equal63([], [])) {
    failed = failed + 1;
    return("failed: expected " + str([]) + ", was " + str([]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], [])) {
    failed = failed + 1;
    return("failed: expected " + str([]) + ", was " + str([]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], ["a"])) {
    failed = failed + 1;
    return("failed: expected " + str(["a"]) + ", was " + str(["a"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], ["a"])) {
    failed = failed + 1;
    return("failed: expected " + str(["a"]) + ", was " + str(["a"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([[]], [[]])) {
    failed = failed + 1;
    return("failed: expected " + str([[]]) + ", was " + str([[]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(0, [].length || 0)) {
    failed = failed + 1;
    return("failed: expected " + str(0) + ", was " + str([].length || 0));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, [1, 2].length || 0)) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str([1, 2].length || 0));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3], [1, 2, 3])) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2, 3]) + ", was " + str([1, 2, 3]));
  } else {
    passed = passed + 1;
  }
  var _x122 = [];
  _x122.foo = 17;
  if (! equal63(17, _x122.foo)) {
    failed = failed + 1;
    var _x123 = [];
    _x123.foo = 17;
    return("failed: expected " + str(17) + ", was " + str(_x123.foo));
  } else {
    passed = passed + 1;
  }
  var _x124 = [1];
  _x124.foo = 17;
  if (! equal63(17, _x124.foo)) {
    failed = failed + 1;
    var _x125 = [1];
    _x125.foo = 17;
    return("failed: expected " + str(17) + ", was " + str(_x125.foo));
  } else {
    passed = passed + 1;
  }
  var _x126 = [];
  _x126.foo = true;
  if (! equal63(true, _x126.foo)) {
    failed = failed + 1;
    var _x127 = [];
    _x127.foo = true;
    return("failed: expected " + str(true) + ", was " + str(_x127.foo));
  } else {
    passed = passed + 1;
  }
  var _x128 = [];
  _x128.foo = true;
  if (! equal63(true, _x128.foo)) {
    failed = failed + 1;
    var _x129 = [];
    _x129.foo = true;
    return("failed: expected " + str(true) + ", was " + str(_x129.foo));
  } else {
    passed = passed + 1;
  }
  var _x131 = [];
  _x131.foo = true;
  if (! equal63(true, [_x131][0].foo)) {
    failed = failed + 1;
    var _x133 = [];
    _x133.foo = true;
    return("failed: expected " + str(true) + ", was " + str([_x133][0].foo));
  } else {
    passed = passed + 1;
  }
  var _x134 = [];
  _x134.a = true;
  var _x135 = [];
  _x135.a = true;
  if (! equal63(_x134, _x135)) {
    failed = failed + 1;
    var _x136 = [];
    _x136.a = true;
    var _x137 = [];
    _x137.a = true;
    return("failed: expected " + str(_x136) + ", was " + str(_x137));
  } else {
    passed = passed + 1;
  }
  var _x138 = [];
  _x138.b = false;
  var _x139 = [];
  _x139.b = false;
  if (! equal63(_x138, _x139)) {
    failed = failed + 1;
    var _x140 = [];
    _x140.b = false;
    var _x141 = [];
    _x141.b = false;
    return("failed: expected " + str(_x140) + ", was " + str(_x141));
  } else {
    passed = passed + 1;
  }
  var _x142 = [];
  _x142.c = 0;
  var _x143 = [];
  _x143.c = 0;
  if (! equal63(_x142, _x143)) {
    failed = failed + 1;
    var _x144 = [];
    _x144.c = 0;
    var _x145 = [];
    _x145.c = 0;
    return("failed: expected " + str(_x144) + ", was " + str(_x145));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["quasiquote", function () {
  if (! equal63("a", "a")) {
    failed = failed + 1;
    return("failed: expected " + str("a") + ", was " + str("a"));
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", "a")) {
    failed = failed + 1;
    return("failed: expected " + str("a") + ", was " + str("a"));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], join())) {
    failed = failed + 1;
    return("failed: expected " + str([]) + ", was " + str(join()));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, 2)) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, undefined)) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(undefined));
  } else {
    passed = passed + 1;
  }
  var a = 42;
  if (! equal63(42, a)) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, a)) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", ["unquote", "a"]], ["quasiquote", ["unquote", "a"]])) {
    failed = failed + 1;
    return("failed: expected " + str(["quasiquote", ["unquote", "a"]]) + ", was " + str(["quasiquote", ["unquote", "a"]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", ["unquote", 42]], ["quasiquote", ["unquote", a]])) {
    failed = failed + 1;
    return("failed: expected " + str(["quasiquote", ["unquote", 42]]) + ", was " + str(["quasiquote", ["unquote", a]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", ["quasiquote", ["unquote", ["unquote", "a"]]]], ["quasiquote", ["quasiquote", ["unquote", ["unquote", "a"]]]])) {
    failed = failed + 1;
    return("failed: expected " + str(["quasiquote", ["quasiquote", ["unquote", ["unquote", "a"]]]]) + ", was " + str(["quasiquote", ["quasiquote", ["unquote", ["unquote", "a"]]]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", ["quasiquote", ["unquote", ["unquote", 42]]]], ["quasiquote", ["quasiquote", ["unquote", ["unquote", a]]]])) {
    failed = failed + 1;
    return("failed: expected " + str(["quasiquote", ["quasiquote", ["unquote", ["unquote", 42]]]]) + ", was " + str(["quasiquote", ["quasiquote", ["unquote", ["unquote", a]]]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", ["quasiquote", ["b", ["unquote", "c"]]]], ["a", ["quasiquote", ["b", ["unquote", "c"]]]])) {
    failed = failed + 1;
    return("failed: expected " + str(["a", ["quasiquote", ["b", ["unquote", "c"]]]]) + ", was " + str(["a", ["quasiquote", ["b", ["unquote", "c"]]]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", ["quasiquote", ["b", ["unquote", 42]]]], ["a", ["quasiquote", ["b", ["unquote", a]]]])) {
    failed = failed + 1;
    return("failed: expected " + str(["a", ["quasiquote", ["b", ["unquote", 42]]]]) + ", was " + str(["a", ["quasiquote", ["b", ["unquote", a]]]]));
  } else {
    passed = passed + 1;
  }
  var b = "c";
  if (! equal63(["quote", "c"], ["quote", b])) {
    failed = failed + 1;
    return("failed: expected " + str(["quote", "c"]) + ", was " + str(["quote", b]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([42], [a])) {
    failed = failed + 1;
    return("failed: expected " + str([42]) + ", was " + str([a]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([[42]], [[a]])) {
    failed = failed + 1;
    return("failed: expected " + str([[42]]) + ", was " + str([[a]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([41, [42]], [41, [a]])) {
    failed = failed + 1;
    return("failed: expected " + str([41, [42]]) + ", was " + str([41, [a]]));
  } else {
    passed = passed + 1;
  }
  var c = [1, 2, 3];
  if (! equal63([[1, 2, 3]], [c])) {
    failed = failed + 1;
    return("failed: expected " + str([[1, 2, 3]]) + ", was " + str([c]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3], c)) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2, 3]) + ", was " + str(c));
  } else {
    passed = passed + 1;
  }
  if (! equal63([0, 1, 2, 3], join([0], c))) {
    failed = failed + 1;
    return("failed: expected " + str([0, 1, 2, 3]) + ", was " + str(join([0], c)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([0, 1, 2, 3, 4], join([0], c, [4]))) {
    failed = failed + 1;
    return("failed: expected " + str([0, 1, 2, 3, 4]) + ", was " + str(join([0], c, [4])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([0, [1, 2, 3], 4], [0, c, 4])) {
    failed = failed + 1;
    return("failed: expected " + str([0, [1, 2, 3], 4]) + ", was " + str([0, c, 4]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3, 1, 2, 3], join(c, c))) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2, 3, 1, 2, 3]) + ", was " + str(join(c, c)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([[1, 2, 3], 1, 2, 3], join([c], c))) {
    failed = failed + 1;
    return("failed: expected " + str([[1, 2, 3], 1, 2, 3]) + ", was " + str(join([c], c)));
  } else {
    passed = passed + 1;
  }
  var _a = 42;
  if (! equal63(["quasiquote", [["unquote-splicing", ["list", "a"]]]], ["quasiquote", [["unquote-splicing", ["list", "a"]]]])) {
    failed = failed + 1;
    return("failed: expected " + str(["quasiquote", [["unquote-splicing", ["list", "a"]]]]) + ", was " + str(["quasiquote", [["unquote-splicing", ["list", "a"]]]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", [["unquote-splicing", ["list", 42]]]], ["quasiquote", [["unquote-splicing", ["list", _a]]]])) {
    failed = failed + 1;
    return("failed: expected " + str(["quasiquote", [["unquote-splicing", ["list", 42]]]]) + ", was " + str(["quasiquote", [["unquote-splicing", ["list", _a]]]]));
  } else {
    passed = passed + 1;
  }
  var _x316 = [];
  _x316.foo = true;
  if (! equal63(true, _x316.foo)) {
    failed = failed + 1;
    var _x317 = [];
    _x317.foo = true;
    return("failed: expected " + str(true) + ", was " + str(_x317.foo));
  } else {
    passed = passed + 1;
  }
  var _a1 = 17;
  var b = [1, 2];
  var _c = {a: 10};
  var _x319 = [];
  _x319.a = 10;
  var d = _x319;
  var _x320 = [];
  _x320.foo = _a1;
  if (! equal63(17, _x320.foo)) {
    failed = failed + 1;
    var _x321 = [];
    _x321.foo = _a1;
    return("failed: expected " + str(17) + ", was " + str(_x321.foo));
  } else {
    passed = passed + 1;
  }
  var _x322 = [];
  _x322.foo = _a1;
  if (! equal63(2, join(_x322, b).length || 0)) {
    failed = failed + 1;
    var _x323 = [];
    _x323.foo = _a1;
    return("failed: expected " + str(2) + ", was " + str(join(_x323, b).length || 0));
  } else {
    passed = passed + 1;
  }
  var _x324 = [];
  _x324.foo = _a1;
  if (! equal63(17, _x324.foo)) {
    failed = failed + 1;
    var _x325 = [];
    _x325.foo = _a1;
    return("failed: expected " + str(17) + ", was " + str(_x325.foo));
  } else {
    passed = passed + 1;
  }
  var _x326 = [1];
  _x326.a = 10;
  if (! equal63(_x326, join([1], _c))) {
    failed = failed + 1;
    var _x328 = [1];
    _x328.a = 10;
    return("failed: expected " + str(_x328) + ", was " + str(join([1], _c)));
  } else {
    passed = passed + 1;
  }
  var _x330 = [1];
  _x330.a = 10;
  if (! equal63(_x330, join([1], d))) {
    failed = failed + 1;
    var _x332 = [1];
    _x332.a = 10;
    return("failed: expected " + str(_x332) + ", was " + str(join([1], d)));
  } else {
    passed = passed + 1;
  }
  var _x335 = [];
  _x335.foo = true;
  if (! equal63(true, [_x335][0].foo)) {
    failed = failed + 1;
    var _x337 = [];
    _x337.foo = true;
    return("failed: expected " + str(true) + ", was " + str([_x337][0].foo));
  } else {
    passed = passed + 1;
  }
  var _x339 = [];
  _x339.foo = true;
  if (! equal63(true, [_x339][0].foo)) {
    failed = failed + 1;
    var _x341 = [];
    _x341.foo = true;
    return("failed: expected " + str(true) + ", was " + str([_x341][0].foo));
  } else {
    passed = passed + 1;
  }
  var _x342 = [];
  _x342.foo = true;
  if (! equal63(true, _x342.foo)) {
    failed = failed + 1;
    var _x343 = [];
    _x343.foo = true;
    return("failed: expected " + str(true) + ", was " + str(_x343.foo));
  } else {
    passed = passed + 1;
  }
  var _x345 = [];
  _x345.foo = true;
  if (! equal63(true, join([1, 2, 3], _x345).foo)) {
    failed = failed + 1;
    var _x347 = [];
    _x347.foo = true;
    return("failed: expected " + str(true) + ", was " + str(join([1, 2, 3], _x347).foo));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, {foo: true}.foo)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str({foo: true}.foo));
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, {bar: 17}.bar)) {
    failed = failed + 1;
    return("failed: expected " + str(17) + ", was " + str({bar: 17}.bar));
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, {baz: function () {
    return(17);
  }}.baz())) {
    failed = failed + 1;
    return("failed: expected " + str(17) + ", was " + str({baz: function () {
      return(17);
    }}.baz()));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["quasiexpand", function () {
  if (! equal63("a", macroexpand("a"))) {
    failed = failed + 1;
    return("failed: expected " + str("a") + ", was " + str(macroexpand("a")));
  } else {
    passed = passed + 1;
  }
  if (! equal63([17], macroexpand([17]))) {
    failed = failed + 1;
    return("failed: expected " + str([17]) + ", was " + str(macroexpand([17])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, "z"], macroexpand([1, "z"]))) {
    failed = failed + 1;
    return("failed: expected " + str([1, "z"]) + ", was " + str(macroexpand([1, "z"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", 1, "\"z\""], macroexpand(["quasiquote", [1, "z"]]))) {
    failed = failed + 1;
    return("failed: expected " + str(["%array", 1, "\"z\""]) + ", was " + str(macroexpand(["quasiquote", [1, "z"]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", 1, "z"], macroexpand(["quasiquote", [["unquote", 1], ["unquote", "z"]]]))) {
    failed = failed + 1;
    return("failed: expected " + str(["%array", 1, "z"]) + ", was " + str(macroexpand(["quasiquote", [["unquote", 1], ["unquote", "z"]]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63("z", macroexpand(["quasiquote", [["unquote-splicing", "z"]]]))) {
    failed = failed + 1;
    return("failed: expected " + str("z") + ", was " + str(macroexpand(["quasiquote", [["unquote-splicing", "z"]]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["join", ["%array", 1], "z"], macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "z"]]]))) {
    failed = failed + 1;
    return("failed: expected " + str(["join", ["%array", 1], "z"]) + ", was " + str(macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "z"]]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["join", ["%array", 1], "x", "y"], macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "x"], ["unquote-splicing", "y"]]]))) {
    failed = failed + 1;
    return("failed: expected " + str(["join", ["%array", 1], "x", "y"]) + ", was " + str(macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "x"], ["unquote-splicing", "y"]]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["join", ["%array", 1], "z", ["%array", 2]], macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "z"], ["unquote", 2]]]))) {
    failed = failed + 1;
    return("failed: expected " + str(["join", ["%array", 1], "z", ["%array", 2]]) + ", was " + str(macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "z"], ["unquote", 2]]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["join", ["%array", 1], "z", ["%array", "\"a\""]], macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "z"], "a"]]))) {
    failed = failed + 1;
    return("failed: expected " + str(["join", ["%array", 1], "z", ["%array", "\"a\""]]) + ", was " + str(macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "z"], "a"]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63("\"x\"", macroexpand(["quasiquote", "x"]))) {
    failed = failed + 1;
    return("failed: expected " + str("\"x\"") + ", was " + str(macroexpand(["quasiquote", "x"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", "\"quasiquote\"", "\"x\""], macroexpand(["quasiquote", ["quasiquote", "x"]]))) {
    failed = failed + 1;
    return("failed: expected " + str(["%array", "\"quasiquote\"", "\"x\""]) + ", was " + str(macroexpand(["quasiquote", ["quasiquote", "x"]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", "\"quasiquote\"", ["%array", "\"quasiquote\"", "\"x\""]], macroexpand(["quasiquote", ["quasiquote", ["quasiquote", "x"]]]))) {
    failed = failed + 1;
    return("failed: expected " + str(["%array", "\"quasiquote\"", ["%array", "\"quasiquote\"", "\"x\""]]) + ", was " + str(macroexpand(["quasiquote", ["quasiquote", ["quasiquote", "x"]]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63("x", macroexpand(["quasiquote", ["unquote", "x"]]))) {
    failed = failed + 1;
    return("failed: expected " + str("x") + ", was " + str(macroexpand(["quasiquote", ["unquote", "x"]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", "\"quote\"", "x"], macroexpand(["quasiquote", ["quote", ["unquote", "x"]]]))) {
    failed = failed + 1;
    return("failed: expected " + str(["%array", "\"quote\"", "x"]) + ", was " + str(macroexpand(["quasiquote", ["quote", ["unquote", "x"]]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", "\"quasiquote\"", ["%array", "\"x\""]], macroexpand(["quasiquote", ["quasiquote", ["x"]]]))) {
    failed = failed + 1;
    return("failed: expected " + str(["%array", "\"quasiquote\"", ["%array", "\"x\""]]) + ", was " + str(macroexpand(["quasiquote", ["quasiquote", ["x"]]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", "\"quasiquote\"", ["%array", "\"unquote\"", "\"a\""]], macroexpand(["quasiquote", ["quasiquote", ["unquote", "a"]]]))) {
    failed = failed + 1;
    return("failed: expected " + str(["%array", "\"quasiquote\"", ["%array", "\"unquote\"", "\"a\""]]) + ", was " + str(macroexpand(["quasiquote", ["quasiquote", ["unquote", "a"]]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", "\"quasiquote\"", ["%array", ["%array", "\"unquote\"", "\"x\""]]], macroexpand(["quasiquote", ["quasiquote", [["unquote", "x"]]]]))) {
    failed = failed + 1;
    return("failed: expected " + str(["%array", "\"quasiquote\"", ["%array", ["%array", "\"unquote\"", "\"x\""]]]) + ", was " + str(macroexpand(["quasiquote", ["quasiquote", [["unquote", "x"]]]])));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["calls", function () {
  var f = function () {
    return(42);
  };
  var l = [f];
  var o = {f: f};
  if (! equal63(42, f())) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str(f()));
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, l[0]())) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str(l[0]()));
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, o.f())) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str(o.f()));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, (function () {
    return;
  })())) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str((function () {
      return;
    })()));
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, (function (_) {
    return(_ - 2);
  })(12))) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str((function (_) {
      return(_ - 2);
    })(12)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["id", function () {
  var a = 10;
  var b = {x: 20};
  var f = function () {
    return(30);
  };
  if (! equal63(10, a)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, a)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(20, b.x)) {
    failed = failed + 1;
    return("failed: expected " + str(20) + ", was " + str(b.x));
  } else {
    passed = passed + 1;
  }
  if (! equal63(30, f())) {
    failed = failed + 1;
    return("failed: expected " + str(30) + ", was " + str(f()));
  } else {
    passed = passed + 1;
  }
  var x = 0;
  x = x + 1;
  x = x + 1;
  var y = x;
  if (! equal63(2, y)) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(y));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["names", function () {
  var a33 = 0;
  var b63 = 1;
  var _37 = 2;
  var _4242 = 3;
  var _break = 4;
  if (! equal63(0, a33)) {
    failed = failed + 1;
    return("failed: expected " + str(0) + ", was " + str(a33));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, b63)) {
    failed = failed + 1;
    return("failed: expected " + str(1) + ", was " + str(b63));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, _37)) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(_37));
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, _4242)) {
    failed = failed + 1;
    return("failed: expected " + str(3) + ", was " + str(_4242));
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, _break)) {
    failed = failed + 1;
    return("failed: expected " + str(4) + ", was " + str(_break));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["assign", function () {
  var a = 42;
  a = "bar";
  if (! equal63("bar", a)) {
    failed = failed + 1;
    return("failed: expected " + str("bar") + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  a = 10;
  var x = a;
  if (! equal63(10, x)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(x));
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, a)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  a = false;
  if (! equal63(false, a)) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  a = undefined;
  if (! equal63(undefined, a)) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(a));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["=", function () {
  var a = 42;
  var b = 7;
  a = "foo";
  b = "bar";
  if (! equal63("foo", a)) {
    failed = failed + 1;
    return("failed: expected " + str("foo") + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63("bar", b)) {
    failed = failed + 1;
    return("failed: expected " + str("bar") + ", was " + str(b));
  } else {
    passed = passed + 1;
  }
  a = 10;
  var x = a;
  if (! equal63(10, x)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(x));
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, a)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  a = false;
  if (! equal63(false, a)) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  a = undefined;
  if (! equal63(undefined, a)) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(a));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["wipe", function () {
  var _x515 = [];
  _x515.b = true;
  _x515.a = true;
  _x515.c = true;
  var x = _x515;
  delete x.a;
  if (! equal63(undefined, x.a)) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(x.a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, x.b)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(x.b));
  } else {
    passed = passed + 1;
  }
  delete x.c;
  if (! equal63(undefined, x.c)) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(x.c));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, x.b)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(x.b));
  } else {
    passed = passed + 1;
  }
  delete x.b;
  if (! equal63(undefined, x.b)) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(x.b));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], x)) {
    failed = failed + 1;
    return("failed: expected " + str([]) + ", was " + str(x));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["do", function () {
  var a = 17;
  a = 10;
  if (! equal63(10, a)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, a)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  a = 2;
  var b = a + 5;
  if (! equal63(a, 2)) {
    failed = failed + 1;
    return("failed: expected " + str(a) + ", was " + str(2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(b, 7)) {
    failed = failed + 1;
    return("failed: expected " + str(b) + ", was " + str(7));
  } else {
    passed = passed + 1;
  }
  a = 10;
  a = 20;
  if (! equal63(20, a)) {
    failed = failed + 1;
    return("failed: expected " + str(20) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  a = 10;
  a = 20;
  if (! equal63(20, a)) {
    failed = failed + 1;
    a = 10;
    a = 20;
    return("failed: expected " + str(20) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, (function () {
    var _e23;
    if (true) {
      return(42);
    } else {
      _e23 = 2;
    }
    return(_e23);
  })())) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str((function () {
      var _e24;
      if (true) {
        return(42);
      } else {
        _e24 = 2;
      }
      return(_e24);
    })()));
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, (function () {
    var x = 1;
    var _e25;
    if (true) {
      _e25 = 42;
    } else {
      _e25 = x;
    }
    return(_e25);
  })())) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str((function () {
      var x = 1;
      var _e26;
      if (true) {
        _e26 = 42;
      } else {
        _e26 = x;
      }
      return(_e26);
    })()));
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, (function () {
    var x = 42;
    while (true) {
      var _e27;
      if (true) {
        break;
      }
      if (! _e27) {
        break;
      }
    }
    return(x);
  })())) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str((function () {
      var x = 42;
      while (true) {
        var _e28;
        if (true) {
          break;
        }
        if (! _e28) {
          break;
        }
      }
      return(x);
    })()));
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, (function () {
    var x = 42;
    while (true) {
      var _e29;
      if (true) {
        break;
      }
      if (! _e29) {
        break;
      }
    }
    return(x);
  })())) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str((function () {
      var x = 42;
      while (true) {
        var _e30;
        if (true) {
          break;
        }
        if (! _e30) {
          break;
        }
      }
      return(x);
    })()));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["if", function () {
  if (! equal63("a", macroexpand(["if", "a"]))) {
    failed = failed + 1;
    return("failed: expected " + str("a") + ", was " + str(macroexpand(["if", "a"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%if", "a", "b"], macroexpand(["if", "a", "b"]))) {
    failed = failed + 1;
    return("failed: expected " + str(["%if", "a", "b"]) + ", was " + str(macroexpand(["if", "a", "b"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%if", "a", "b", "c"], macroexpand(["if", "a", "b", "c"]))) {
    failed = failed + 1;
    return("failed: expected " + str(["%if", "a", "b", "c"]) + ", was " + str(macroexpand(["if", "a", "b", "c"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%if", "a", "b", ["%if", "c", "d"]], macroexpand(["if", "a", "b", "c", "d"]))) {
    failed = failed + 1;
    return("failed: expected " + str(["%if", "a", "b", ["%if", "c", "d"]]) + ", was " + str(macroexpand(["if", "a", "b", "c", "d"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%if", "a", "b", ["%if", "c", "d", "e"]], macroexpand(["if", "a", "b", "c", "d", "e"]))) {
    failed = failed + 1;
    return("failed: expected " + str(["%if", "a", "b", ["%if", "c", "d", "e"]]) + ", was " + str(macroexpand(["if", "a", "b", "c", "d", "e"])));
  } else {
    passed = passed + 1;
  }
  if (true) {
    if (! equal63(true, true)) {
      failed = failed + 1;
      return("failed: expected " + str(true) + ", was " + str(true));
    } else {
      passed = passed + 1;
    }
  } else {
    if (! equal63(true, false)) {
      failed = failed + 1;
      return("failed: expected " + str(true) + ", was " + str(false));
    } else {
      passed = passed + 1;
    }
  }
  if (false) {
    if (! equal63(true, false)) {
      failed = failed + 1;
      return("failed: expected " + str(true) + ", was " + str(false));
    } else {
      passed = passed + 1;
    }
  } else {
    if (false) {
      if (! equal63(false, true)) {
        failed = failed + 1;
        return("failed: expected " + str(false) + ", was " + str(true));
      } else {
        passed = passed + 1;
      }
    } else {
      if (! equal63(true, true)) {
        failed = failed + 1;
        return("failed: expected " + str(true) + ", was " + str(true));
      } else {
        passed = passed + 1;
      }
    }
  }
  if (false) {
    if (! equal63(true, false)) {
      failed = failed + 1;
      return("failed: expected " + str(true) + ", was " + str(false));
    } else {
      passed = passed + 1;
    }
  } else {
    if (false) {
      if (! equal63(false, true)) {
        failed = failed + 1;
        return("failed: expected " + str(false) + ", was " + str(true));
      } else {
        passed = passed + 1;
      }
    } else {
      if (false) {
        if (! equal63(false, true)) {
          failed = failed + 1;
          return("failed: expected " + str(false) + ", was " + str(true));
        } else {
          passed = passed + 1;
        }
      } else {
        if (! equal63(true, true)) {
          failed = failed + 1;
          return("failed: expected " + str(true) + ", was " + str(true));
        } else {
          passed = passed + 1;
        }
      }
    }
  }
  if (false) {
    if (! equal63(true, false)) {
      failed = failed + 1;
      return("failed: expected " + str(true) + ", was " + str(false));
    } else {
      passed = passed + 1;
    }
  } else {
    if (true) {
      if (! equal63(true, true)) {
        failed = failed + 1;
        return("failed: expected " + str(true) + ", was " + str(true));
      } else {
        passed = passed + 1;
      }
    } else {
      if (false) {
        if (! equal63(false, true)) {
          failed = failed + 1;
          return("failed: expected " + str(false) + ", was " + str(true));
        } else {
          passed = passed + 1;
        }
      } else {
        if (! equal63(true, true)) {
          failed = failed + 1;
          return("failed: expected " + str(true) + ", was " + str(true));
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
    return("failed: expected " + str(1) + ", was " + str(_e32));
  } else {
    passed = passed + 1;
  }
  var _e33;
  var a = 10;
  if (a) {
    _e33 = 1;
  } else {
    _e33 = 2;
  }
  if (! equal63(1, _e33)) {
    failed = failed + 1;
    var _e34;
    var _a2 = 10;
    if (_a2) {
      _e34 = 1;
    } else {
      _e34 = 2;
    }
    return("failed: expected " + str(1) + ", was " + str(_e34));
  } else {
    passed = passed + 1;
  }
  var _e35;
  if (true) {
    var _a3 = 1;
    _e35 = _a3;
  } else {
    _e35 = 2;
  }
  if (! equal63(1, _e35)) {
    failed = failed + 1;
    var _e36;
    if (true) {
      var _a4 = 1;
      _e36 = _a4;
    } else {
      _e36 = 2;
    }
    return("failed: expected " + str(1) + ", was " + str(_e36));
  } else {
    passed = passed + 1;
  }
  var _e37;
  if (false) {
    _e37 = 2;
  } else {
    var _a5 = 1;
    _e37 = _a5;
  }
  if (! equal63(1, _e37)) {
    failed = failed + 1;
    var _e38;
    if (false) {
      _e38 = 2;
    } else {
      var _a6 = 1;
      _e38 = _a6;
    }
    return("failed: expected " + str(1) + ", was " + str(_e38));
  } else {
    passed = passed + 1;
  }
  var _e39;
  if (false) {
    _e39 = 2;
  } else {
    var _e40;
    if (true) {
      var _a7 = 1;
      _e40 = _a7;
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
        var _a8 = 1;
        _e42 = _a8;
      }
      _e41 = _e42;
    }
    return("failed: expected " + str(1) + ", was " + str(_e41));
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
      var _a9 = 1;
      _e44 = _a9;
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
        var _a10 = 1;
        _e46 = _a10;
      }
      _e45 = _e46;
    }
    return("failed: expected " + str(1) + ", was " + str(_e45));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["case", function () {
  var x = 10;
  var _e = x;
  var _e47;
  if (9 === _e) {
    _e47 = 9;
  } else {
    var _e48;
    if (10 === _e) {
      _e48 = 2;
    } else {
      _e48 = 4;
    }
    _e47 = _e48;
  }
  if (! equal63(2, _e47)) {
    failed = failed + 1;
    var _e1 = x;
    var _e49;
    if (9 === _e1) {
      _e49 = 9;
    } else {
      var _e50;
      if (10 === _e1) {
        _e50 = 2;
      } else {
        _e50 = 4;
      }
      _e49 = _e50;
    }
    return("failed: expected " + str(2) + ", was " + str(_e49));
  } else {
    passed = passed + 1;
  }
  var _x541 = "z";
  var _e2 = _x541;
  var _e51;
  if ("z" === _e2) {
    _e51 = 9;
  } else {
    _e51 = 10;
  }
  if (! equal63(9, _e51)) {
    failed = failed + 1;
    var _e3 = _x541;
    var _e52;
    if ("z" === _e3) {
      _e52 = 9;
    } else {
      _e52 = 10;
    }
    return("failed: expected " + str(9) + ", was " + str(_e52));
  } else {
    passed = passed + 1;
  }
  var _e4 = _x541;
  var _e53;
  if ("a" === _e4) {
    _e53 = 1;
  } else {
    var _e54;
    if ("b" === _e4) {
      _e54 = 2;
    } else {
      _e54 = 7;
    }
    _e53 = _e54;
  }
  if (! equal63(7, _e53)) {
    failed = failed + 1;
    var _e5 = _x541;
    var _e55;
    if ("a" === _e5) {
      _e55 = 1;
    } else {
      var _e56;
      if ("b" === _e5) {
        _e56 = 2;
      } else {
        _e56 = 7;
      }
      _e55 = _e56;
    }
    return("failed: expected " + str(7) + ", was " + str(_e55));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["while", function () {
  var i = 0;
  while (i < 5) {
    if (i === 3) {
      break;
    } else {
      i = i + 1;
    }
  }
  if (! equal63(3, i)) {
    failed = failed + 1;
    return("failed: expected " + str(3) + ", was " + str(i));
  } else {
    passed = passed + 1;
  }
  while (i < 10) {
    i = i + 1;
  }
  if (! equal63(10, i)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(i));
  } else {
    passed = passed + 1;
  }
  while (i < 15) {
    i = i + 1;
  }
  var a;
  if (! equal63(undefined, a)) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(15, i)) {
    failed = failed + 1;
    return("failed: expected " + str(15) + ", was " + str(i));
  } else {
    passed = passed + 1;
  }
  while (i < 20) {
    if (i === 19) {
      break;
    } else {
      i = i + 1;
    }
  }
  var b;
  if (! equal63(undefined, a)) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(19, i)) {
    failed = failed + 1;
    return("failed: expected " + str(19) + ", was " + str(i));
  } else {
    passed = passed + 1;
  }
  while (true) {
    i = i + 1;
    var j = i;
    if (!( j < 21)) {
      break;
    }
  }
  if (! equal63(21, i)) {
    failed = failed + 1;
    return("failed: expected " + str(21) + ", was " + str(i));
  } else {
    passed = passed + 1;
  }
  while (true) {
    var _e57;
    if (false) {
      i = i + 1;
      _e57 = i;
    }
    if (! _e57) {
      break;
    }
  }
  if (! equal63(21, i)) {
    failed = failed + 1;
    return("failed: expected " + str(21) + ", was " + str(i));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["for", function () {
  var l = [];
  var i = 0;
  while (i < 5) {
    add(l, i);
    i = i + 1;
  }
  if (! equal63([0, 1, 2, 3, 4], l)) {
    failed = failed + 1;
    return("failed: expected " + str([0, 1, 2, 3, 4]) + ", was " + str(l));
  } else {
    passed = passed + 1;
  }
  var _l1 = [];
  var i = 0;
  while (i < 2) {
    add(_l1, i);
    i = i + 1;
  }
  if (! equal63([0, 1], _l1)) {
    failed = failed + 1;
    var _l2 = [];
    var i = 0;
    while (i < 2) {
      add(_l2, i);
      i = i + 1;
    }
    return("failed: expected " + str([0, 1]) + ", was " + str(_l2));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["table", function () {
  if (! equal63(10, {a: 10}.a)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str({a: 10}.a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, {a: true}.a)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str({a: true}.a));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["empty", function () {
  if (! equal63(true, empty63([]))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(empty63([])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, empty63({}))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(empty63({})));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, empty63([1]))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(empty63([1])));
  } else {
    passed = passed + 1;
  }
  var _x552 = [];
  _x552.a = true;
  if (! equal63(false, empty63(_x552))) {
    failed = failed + 1;
    var _x553 = [];
    _x553.a = true;
    return("failed: expected " + str(false) + ", was " + str(empty63(_x553)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, empty63({a: true}))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(empty63({a: true})));
  } else {
    passed = passed + 1;
  }
  var _x554 = [];
  _x554.b = false;
  if (! equal63(false, empty63(_x554))) {
    failed = failed + 1;
    var _x555 = [];
    _x555.b = false;
    return("failed: expected " + str(false) + ", was " + str(empty63(_x555)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["at", function () {
  var l = ["a", "b", "c", "d"];
  if (! equal63("a", l[0])) {
    failed = failed + 1;
    return("failed: expected " + str("a") + ", was " + str(l[0]));
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", l[0])) {
    failed = failed + 1;
    return("failed: expected " + str("a") + ", was " + str(l[0]));
  } else {
    passed = passed + 1;
  }
  if (! equal63("b", l[1])) {
    failed = failed + 1;
    return("failed: expected " + str("b") + ", was " + str(l[1]));
  } else {
    passed = passed + 1;
  }
  if (! equal63("d", l[(l.length || 0) + -1])) {
    failed = failed + 1;
    return("failed: expected " + str("d") + ", was " + str(l[(l.length || 0) + -1]));
  } else {
    passed = passed + 1;
  }
  if (! equal63("c", l[(l.length || 0) + -2])) {
    failed = failed + 1;
    return("failed: expected " + str("c") + ", was " + str(l[(l.length || 0) + -2]));
  } else {
    passed = passed + 1;
  }
  l[0] = 9;
  if (! equal63(9, l[0])) {
    failed = failed + 1;
    return("failed: expected " + str(9) + ", was " + str(l[0]));
  } else {
    passed = passed + 1;
  }
  l[3] = 10;
  if (! equal63(10, l[3])) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(l[3]));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["get-=", function () {
  var l = {};
  l.foo = "bar";
  if (! equal63("bar", l.foo)) {
    failed = failed + 1;
    return("failed: expected " + str("bar") + ", was " + str(l.foo));
  } else {
    passed = passed + 1;
  }
  if (! equal63("bar", l.foo)) {
    failed = failed + 1;
    return("failed: expected " + str("bar") + ", was " + str(l.foo));
  } else {
    passed = passed + 1;
  }
  if (! equal63("bar", l.foo)) {
    failed = failed + 1;
    return("failed: expected " + str("bar") + ", was " + str(l.foo));
  } else {
    passed = passed + 1;
  }
  var k = "foo";
  if (! equal63("bar", l[k])) {
    failed = failed + 1;
    return("failed: expected " + str("bar") + ", was " + str(l[k]));
  } else {
    passed = passed + 1;
  }
  if (! equal63("bar", l["f" + "oo"])) {
    failed = failed + 1;
    return("failed: expected " + str("bar") + ", was " + str(l["f" + "oo"]));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["each", function () {
  var _x560 = [1, 2, 3];
  _x560.a = true;
  _x560.b = false;
  var l = _x560;
  var a = 0;
  var b = 0;
  var _l3 = l;
  var k = undefined;
  for (k in _l3) {
    var v = _l3[k];
    var _e58;
    if (numeric63(k)) {
      _e58 = parseInt(k);
    } else {
      _e58 = k;
    }
    var _k = _e58;
    if (typeof(_k) === "number") {
      a = a + 1;
    } else {
      b = b + 1;
    }
  }
  if (! equal63(3, a)) {
    failed = failed + 1;
    return("failed: expected " + str(3) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, b)) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(b));
  } else {
    passed = passed + 1;
  }
  var _a11 = 0;
  var _l4 = l;
  var _i2 = undefined;
  for (_i2 in _l4) {
    var x = _l4[_i2];
    var _e59;
    if (numeric63(_i2)) {
      _e59 = parseInt(_i2);
    } else {
      _e59 = _i2;
    }
    var __i2 = _e59;
    _a11 = _a11 + 1;
  }
  if (! equal63(5, _a11)) {
    failed = failed + 1;
    return("failed: expected " + str(5) + ", was " + str(_a11));
  } else {
    passed = passed + 1;
  }
  var _x561 = [[1], [2]];
  _x561.b = [3];
  var _l5 = _x561;
  var _l6 = _l5;
  var _i3 = undefined;
  for (_i3 in _l6) {
    var x = _l6[_i3];
    var _e60;
    if (numeric63(_i3)) {
      _e60 = parseInt(_i3);
    } else {
      _e60 = _i3;
    }
    var __i3 = _e60;
    if (! equal63(false, !( typeof(x) === "object"))) {
      failed = failed + 1;
      return("failed: expected " + str(false) + ", was " + str(!( typeof(x) === "object")));
    } else {
      passed = passed + 1;
    }
  }
  var _l7 = _l5;
  var _i4 = undefined;
  for (_i4 in _l7) {
    var x = _l7[_i4];
    var _e61;
    if (numeric63(_i4)) {
      _e61 = parseInt(_i4);
    } else {
      _e61 = _i4;
    }
    var __i4 = _e61;
    if (! equal63(false, !( typeof(x) === "object"))) {
      failed = failed + 1;
      return("failed: expected " + str(false) + ", was " + str(!( typeof(x) === "object")));
    } else {
      passed = passed + 1;
    }
  }
  var _l8 = _l5;
  var _i5 = undefined;
  for (_i5 in _l8) {
    var _id4 = _l8[_i5];
    var x = _id4[0];
    var _e62;
    if (numeric63(_i5)) {
      _e62 = parseInt(_i5);
    } else {
      _e62 = _i5;
    }
    var __i5 = _e62;
    if (! equal63(true, typeof(x) === "number")) {
      failed = failed + 1;
      return("failed: expected " + str(true) + ", was " + str(typeof(x) === "number"));
    } else {
      passed = passed + 1;
    }
  }
}]);
add(tests, ["fn", function (_) {
  var f = function (_) {
    return(_ + 10);
  };
  if (! equal63(20, f(10))) {
    failed = failed + 1;
    return("failed: expected " + str(20) + ", was " + str(f(10)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(30, f(20))) {
    failed = failed + 1;
    return("failed: expected " + str(30) + ", was " + str(f(20)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(40, (function (_) {
    return(_ + 10);
  })(30))) {
    failed = failed + 1;
    return("failed: expected " + str(40) + ", was " + str((function (_) {
      return(_ + 10);
    })(30)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([2, 3, 4], map(function (_) {
    return(_ + 1);
  }, [1, 2, 3]))) {
    failed = failed + 1;
    return("failed: expected " + str([2, 3, 4]) + ", was " + str(map(function (_) {
      return(_ + 1);
    }, [1, 2, 3])));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["define", function () {
  var x = 20;
  var f = function () {
    return(42);
  };
  if (! equal63(20, x)) {
    failed = failed + 1;
    return("failed: expected " + str(20) + ", was " + str(x));
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, f())) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str(f()));
  } else {
    passed = passed + 1;
  }
  (function () {
    var f = function () {
      return(38);
    };
    if (! equal63(38, f())) {
      failed = failed + 1;
      return("failed: expected " + str(38) + ", was " + str(f()));
    } else {
      passed = passed + 1;
      return(passed);
    }
  })();
  if (! equal63(42, f())) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str(f()));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["return", function () {
  var a = (function () {
    return(17);
  })();
  if (! equal63(17, a)) {
    failed = failed + 1;
    return("failed: expected " + str(17) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  var _a12 = (function () {
    if (true) {
      return(10);
    } else {
      return(20);
    }
  })();
  if (! equal63(10, _a12)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(_a12));
  } else {
    passed = passed + 1;
  }
  var _a13 = (function () {
    while (false) {
      blah();
    }
  })();
  if (! equal63(undefined, _a13)) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(_a13));
  } else {
    passed = passed + 1;
  }
  var _a14 = 11;
  var b = (function () {
    _a14 = _a14 + 1;
    return(_a14);
  })();
  if (! equal63(12, b)) {
    failed = failed + 1;
    return("failed: expected " + str(12) + ", was " + str(b));
  } else {
    passed = passed + 1;
  }
  if (! equal63(12, _a14)) {
    failed = failed + 1;
    return("failed: expected " + str(12) + ", was " + str(_a14));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["guard", function () {
  if (! equal63([true, 42], cut((function () {
    try {
      return([true, 42]);
    }
    catch (_e76) {
      return([false, _e76.message, _e76.stack]);
    }
  })(), 0, 2))) {
    failed = failed + 1;
    return("failed: expected " + str([true, 42]) + ", was " + str(cut((function () {
      try {
        return([true, 42]);
      }
      catch (_e77) {
        return([false, _e77.message, _e77.stack]);
      }
    })(), 0, 2)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([false, "foo"], cut((function () {
    try {
      throw new Error("foo");
      return([true]);
    }
    catch (_e78) {
      return([false, _e78.message, _e78.stack]);
    }
  })(), 0, 2))) {
    failed = failed + 1;
    return("failed: expected " + str([false, "foo"]) + ", was " + str(cut((function () {
      try {
        throw new Error("foo");
        return([true]);
      }
      catch (_e79) {
        return([false, _e79.message, _e79.stack]);
      }
    })(), 0, 2)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([false, "foo"], cut((function () {
    try {
      throw new Error("foo");
      throw new Error("baz");
      return([true]);
    }
    catch (_e80) {
      return([false, _e80.message, _e80.stack]);
    }
  })(), 0, 2))) {
    failed = failed + 1;
    return("failed: expected " + str([false, "foo"]) + ", was " + str(cut((function () {
      try {
        throw new Error("foo");
        throw new Error("baz");
        return([true]);
      }
      catch (_e81) {
        return([false, _e81.message, _e81.stack]);
      }
    })(), 0, 2)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([false, "baz"], cut((function () {
    try {
      cut((function () {
        try {
          throw new Error("foo");
          return([true]);
        }
        catch (_e83) {
          return([false, _e83.message, _e83.stack]);
        }
      })(), 0, 2);
      throw new Error("baz");
      return([true]);
    }
    catch (_e82) {
      return([false, _e82.message, _e82.stack]);
    }
  })(), 0, 2))) {
    failed = failed + 1;
    return("failed: expected " + str([false, "baz"]) + ", was " + str(cut((function () {
      try {
        cut((function () {
          try {
            throw new Error("foo");
            return([true]);
          }
          catch (_e85) {
            return([false, _e85.message, _e85.stack]);
          }
        })(), 0, 2);
        throw new Error("baz");
        return([true]);
      }
      catch (_e84) {
        return([false, _e84.message, _e84.stack]);
      }
    })(), 0, 2)));
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
      return([true, _e63]);
    }
    catch (_e86) {
      return([false, _e86.message, _e86.stack]);
    }
  })(), 0, 2))) {
    failed = failed + 1;
    return("failed: expected " + str([true, 42]) + ", was " + str(cut((function () {
      try {
        var _e64;
        if (true) {
          _e64 = 42;
        } else {
          throw new Error("baz");
          _e64 = undefined;
        }
        return([true, _e64]);
      }
      catch (_e87) {
        return([false, _e87.message, _e87.stack]);
      }
    })(), 0, 2)));
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
      return([true, _e65]);
    }
    catch (_e88) {
      return([false, _e88.message, _e88.stack]);
    }
  })(), 0, 2))) {
    failed = failed + 1;
    return("failed: expected " + str([false, "baz"]) + ", was " + str(cut((function () {
      try {
        var _e66;
        if (false) {
          _e66 = 42;
        } else {
          throw new Error("baz");
          _e66 = undefined;
        }
        return([true, _e66]);
      }
      catch (_e89) {
        return([false, _e89.message, _e89.stack]);
      }
    })(), 0, 2)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["let", function () {
  var a = 10;
  if (! equal63(10, a)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  var _a15 = 10;
  if (! equal63(10, _a15)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(_a15));
  } else {
    passed = passed + 1;
  }
  var _a16 = 11;
  var b = 12;
  if (! equal63(11, _a16)) {
    failed = failed + 1;
    return("failed: expected " + str(11) + ", was " + str(_a16));
  } else {
    passed = passed + 1;
  }
  if (! equal63(12, b)) {
    failed = failed + 1;
    return("failed: expected " + str(12) + ", was " + str(b));
  } else {
    passed = passed + 1;
  }
  var _a17 = 1;
  if (! equal63(1, _a17)) {
    failed = failed + 1;
    return("failed: expected " + str(1) + ", was " + str(_a17));
  } else {
    passed = passed + 1;
  }
  var _a18 = 2;
  if (! equal63(2, _a18)) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(_a18));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, _a17)) {
    failed = failed + 1;
    return("failed: expected " + str(1) + ", was " + str(_a17));
  } else {
    passed = passed + 1;
  }
  var _a19 = 1;
  var _a20 = 2;
  var _a21 = 3;
  if (! equal63(_a21, 3)) {
    failed = failed + 1;
    return("failed: expected " + str(_a21) + ", was " + str(3));
  } else {
    passed = passed + 1;
  }
  if (! equal63(_a20, 2)) {
    failed = failed + 1;
    return("failed: expected " + str(_a20) + ", was " + str(2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(_a19, 1)) {
    failed = failed + 1;
    return("failed: expected " + str(_a19) + ", was " + str(1));
  } else {
    passed = passed + 1;
  }
  var _a22 = 20;
  if (! equal63(20, _a22)) {
    failed = failed + 1;
    return("failed: expected " + str(20) + ", was " + str(_a22));
  } else {
    passed = passed + 1;
  }
  var _a23 = _a22 + 7;
  if (! equal63(27, _a23)) {
    failed = failed + 1;
    return("failed: expected " + str(27) + ", was " + str(_a23));
  } else {
    passed = passed + 1;
  }
  var _a24 = _a22 + 10;
  if (! equal63(30, _a24)) {
    failed = failed + 1;
    return("failed: expected " + str(30) + ", was " + str(_a24));
  } else {
    passed = passed + 1;
  }
  if (! equal63(20, _a22)) {
    failed = failed + 1;
    return("failed: expected " + str(20) + ", was " + str(_a22));
  } else {
    passed = passed + 1;
  }
  var _a25 = 10;
  if (! equal63(10, _a25)) {
    failed = failed + 1;
    var _a26 = 10;
    return("failed: expected " + str(10) + ", was " + str(_a26));
  } else {
    passed = passed + 1;
  }
  var b = 12;
  var _a27 = b;
  if (! equal63(12, _a27)) {
    failed = failed + 1;
    return("failed: expected " + str(12) + ", was " + str(_a27));
  } else {
    passed = passed + 1;
  }
  var _a29 = 10;
  var _a28 = _a29;
  if (! equal63(10, _a28)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(_a28));
  } else {
    passed = passed + 1;
  }
  var _a31 = 0;
  _a31 = 10;
  var _a30 = _a31 + 2 + 3;
  if (! equal63(_a30, 15)) {
    failed = failed + 1;
    return("failed: expected " + str(_a30) + ", was " + str(15));
  } else {
    passed = passed + 1;
  }
  (function (_) {
    if (! equal63(20, _)) {
      failed = failed + 1;
      return("failed: expected " + str(20) + ", was " + str(_));
    } else {
      passed = passed + 1;
    }
    var __ = 21;
    if (! equal63(21, __)) {
      failed = failed + 1;
      return("failed: expected " + str(21) + ", was " + str(__));
    } else {
      passed = passed + 1;
    }
    if (! equal63(20, _)) {
      failed = failed + 1;
      return("failed: expected " + str(20) + ", was " + str(_));
    } else {
      passed = passed + 1;
      return(passed);
    }
  })(20);
  var q = 9;
  return((function () {
    var _q = 10;
    if (! equal63(10, _q)) {
      failed = failed + 1;
      return("failed: expected " + str(10) + ", was " + str(_q));
    } else {
      passed = passed + 1;
    }
    if (! equal63(9, q)) {
      failed = failed + 1;
      return("failed: expected " + str(9) + ", was " + str(q));
    } else {
      passed = passed + 1;
      return(passed);
    }
  })());
}]);
add(tests, ["with", function () {
  var x = 9;
  x = x + 1;
  if (! equal63(10, x)) {
    failed = failed + 1;
    var _x605 = 9;
    _x605 = _x605 + 1;
    return("failed: expected " + str(10) + ", was " + str(_x605));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["whenlet", function () {
  var frips = "a" === "b";
  var _e67;
  if (frips) {
    _e67 = 19;
  }
  if (! equal63(undefined, _e67)) {
    failed = failed + 1;
    var _frips = "a" === "b";
    var _e68;
    if (_frips) {
      _e68 = 19;
    }
    return("failed: expected " + str(undefined) + ", was " + str(_e68));
  } else {
    passed = passed + 1;
  }
  var _frips1 = 20;
  var _e69;
  if (_frips1) {
    _e69 = _frips1 - 1;
  }
  if (! equal63(19, _e69)) {
    failed = failed + 1;
    var _frips2 = 20;
    var _e70;
    if (_frips2) {
      _e70 = _frips2 - 1;
    }
    return("failed: expected " + str(19) + ", was " + str(_e70));
  } else {
    passed = passed + 1;
  }
  var _if = [19, 20];
  var _e71;
  if (_if) {
    var a = _if[0];
    var b = _if[1];
    _e71 = b;
  }
  if (! equal63(20, _e71)) {
    failed = failed + 1;
    var _if1 = [19, 20];
    var _e72;
    if (_if1) {
      var a = _if1[0];
      var b = _if1[1];
      _e72 = b;
    }
    return("failed: expected " + str(20) + ", was " + str(_e72));
  } else {
    passed = passed + 1;
  }
  var _if2 = undefined;
  var _e73;
  if (_if2) {
    var a = _if2[0];
    var b = _if2[1];
    _e73 = b;
  }
  if (! equal63(undefined, _e73)) {
    failed = failed + 1;
    var _if3 = undefined;
    var _e74;
    if (_if3) {
      var a = _if3[0];
      var b = _if3[1];
      _e74 = b;
    }
    return("failed: expected " + str(undefined) + ", was " + str(_e74));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
var zzop = 99;
var zzap = 100;
var _zzop = 10;
var _zzap = _zzop + 10;
var _x610 = [1, 2, 3];
_x610.a = 10;
_x610.b = 20;
var _id9 = _x610;
var zza = _id9[0];
var zzb = _id9[1];
add(tests, ["let-toplevel1", function () {
  if (! equal63(10, _zzop)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(_zzop));
  } else {
    passed = passed + 1;
  }
  if (! equal63(20, _zzap)) {
    failed = failed + 1;
    return("failed: expected " + str(20) + ", was " + str(_zzap));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, zza)) {
    failed = failed + 1;
    return("failed: expected " + str(1) + ", was " + str(zza));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, zzb)) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(zzb));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["let-toplevel", function () {
  if (! equal63(99, zzop)) {
    failed = failed + 1;
    return("failed: expected " + str(99) + ", was " + str(zzop));
  } else {
    passed = passed + 1;
  }
  if (! equal63(100, zzap)) {
    failed = failed + 1;
    return("failed: expected " + str(100) + ", was " + str(zzap));
  } else {
    passed = passed + 1;
    return(passed);
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
    return(_if + _end + _return);
  };
  if (! equal63(6, _var(1, 2, 3))) {
    failed = failed + 1;
    return("failed: expected " + str(6) + ", was " + str(_var(1, 2, 3)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["destructuring", function () {
  var _id10 = [1, 2, 3];
  var a = _id10[0];
  var b = _id10[1];
  var c = _id10[2];
  if (! equal63(1, a)) {
    failed = failed + 1;
    return("failed: expected " + str(1) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, b)) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(b));
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, c)) {
    failed = failed + 1;
    return("failed: expected " + str(3) + ", was " + str(c));
  } else {
    passed = passed + 1;
  }
  var _id11 = [1, [2, [3], 4]];
  var w = _id11[0];
  var _id12 = _id11[1];
  var x = _id12[0];
  var _id13 = _id12[1];
  var y = _id13[0];
  var z = _id12[2];
  if (! equal63(1, w)) {
    failed = failed + 1;
    return("failed: expected " + str(1) + ", was " + str(w));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, x)) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(x));
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, y)) {
    failed = failed + 1;
    return("failed: expected " + str(3) + ", was " + str(y));
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, z)) {
    failed = failed + 1;
    return("failed: expected " + str(4) + ", was " + str(z));
  } else {
    passed = passed + 1;
  }
  var _id14 = [1, 2, 3, 4];
  var a = _id14[0];
  var b = _id14[1];
  var c = cut(_id14, 2);
  if (! equal63([3, 4], c)) {
    failed = failed + 1;
    return("failed: expected " + str([3, 4]) + ", was " + str(c));
  } else {
    passed = passed + 1;
  }
  var _id15 = [1, [2, 3, 4], 5, 6, 7];
  var w = _id15[0];
  var _id16 = _id15[1];
  var x = _id16[0];
  var y = cut(_id16, 1);
  var z = cut(_id15, 2);
  if (! equal63([3, 4], y)) {
    failed = failed + 1;
    return("failed: expected " + str([3, 4]) + ", was " + str(y));
  } else {
    passed = passed + 1;
  }
  if (! equal63([5, 6, 7], z)) {
    failed = failed + 1;
    return("failed: expected " + str([5, 6, 7]) + ", was " + str(z));
  } else {
    passed = passed + 1;
  }
  var _id17 = {foo: 99};
  var foo = _id17.foo;
  if (! equal63(99, foo)) {
    failed = failed + 1;
    return("failed: expected " + str(99) + ", was " + str(foo));
  } else {
    passed = passed + 1;
  }
  var _x636 = [];
  _x636.foo = 99;
  var _id18 = _x636;
  var foo = _id18.foo;
  if (! equal63(99, foo)) {
    failed = failed + 1;
    return("failed: expected " + str(99) + ", was " + str(foo));
  } else {
    passed = passed + 1;
  }
  var _id19 = {foo: 99};
  var a = _id19.foo;
  if (! equal63(99, a)) {
    failed = failed + 1;
    return("failed: expected " + str(99) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  var _id20 = {foo: [98, 99]};
  var _id21 = _id20.foo;
  var a = _id21[0];
  var b = _id21[1];
  if (! equal63(98, a)) {
    failed = failed + 1;
    return("failed: expected " + str(98) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(99, b)) {
    failed = failed + 1;
    return("failed: expected " + str(99) + ", was " + str(b));
  } else {
    passed = passed + 1;
  }
  var _x640 = [99];
  _x640.baz = true;
  var _id22 = {foo: 42, bar: _x640};
  var foo = _id22.foo;
  var _id23 = _id22.bar;
  var baz = _id23.baz;
  if (! equal63(42, foo)) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str(foo));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, baz)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(baz));
  } else {
    passed = passed + 1;
  }
  var _x645 = [20];
  _x645.foo = 17;
  var _x644 = [10, _x645];
  _x644.bar = [1, 2, 3];
  var _id24 = _x644;
  var a = _id24[0];
  var _id25 = _id24[1];
  var b = _id25[0];
  var foo = _id25.foo;
  var bar = _id24.bar;
  if (! equal63(10, a)) {
    failed = failed + 1;
    return("failed: expected " + str(10) + ", was " + str(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(20, b)) {
    failed = failed + 1;
    return("failed: expected " + str(20) + ", was " + str(b));
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, foo)) {
    failed = failed + 1;
    return("failed: expected " + str(17) + ", was " + str(foo));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3], bar)) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2, 3]) + ", was " + str(bar));
  } else {
    passed = passed + 1;
  }
  var yy = [1, 2, 3];
  var _id26 = yy;
  var xx = _id26[0];
  var _yy = _id26[1];
  var zz = cut(_id26, 2);
  if (! equal63(1, xx)) {
    failed = failed + 1;
    return("failed: expected " + str(1) + ", was " + str(xx));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, _yy)) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(_yy));
  } else {
    passed = passed + 1;
  }
  if (! equal63([3], zz)) {
    failed = failed + 1;
    return("failed: expected " + str([3]) + ", was " + str(zz));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["w/mac", function () {
  if (! equal63(17, 17)) {
    failed = failed + 1;
    return("failed: expected " + str(17) + ", was " + str(17));
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, 32 + 10)) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str(32 + 10));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, 1)) {
    failed = failed + 1;
    return("failed: expected " + str(1) + ", was " + str(1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, 17)) {
    failed = failed + 1;
    return("failed: expected " + str(17) + ", was " + str(17));
  } else {
    passed = passed + 1;
  }
  var b = function () {
    return(20);
  };
  if (! equal63(18, 18)) {
    failed = failed + 1;
    return("failed: expected " + str(18) + ", was " + str(18));
  } else {
    passed = passed + 1;
  }
  if (! equal63(20, b())) {
    failed = failed + 1;
    return("failed: expected " + str(20) + ", was " + str(b()));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, 1 + 1)) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(1 + 1));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["w/sym", function () {
  if (! equal63(17, 17)) {
    failed = failed + 1;
    return("failed: expected " + str(17) + ", was " + str(17));
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, 10 + 7)) {
    failed = failed + 1;
    return("failed: expected " + str(17) + ", was " + str(10 + 7));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, 1)) {
    failed = failed + 1;
    return("failed: expected " + str(1) + ", was " + str(1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, 17)) {
    failed = failed + 1;
    return("failed: expected " + str(17) + ", was " + str(17));
  } else {
    passed = passed + 1;
  }
  var b = 20;
  if (! equal63(18, 18)) {
    failed = failed + 1;
    return("failed: expected " + str(18) + ", was " + str(18));
  } else {
    passed = passed + 1;
  }
  if (! equal63(20, b)) {
    failed = failed + 1;
    return("failed: expected " + str(20) + ", was " + str(b));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["defsym", function () {
  setenv("zzz", stash33({symbol: 42}));
  if (! equal63(42, 42)) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str(42));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["macros-and-symbols", function () {
  if (! equal63(2, 2)) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, 1)) {
    failed = failed + 1;
    return("failed: expected " + str(1) + ", was " + str(1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, 1)) {
    failed = failed + 1;
    return("failed: expected " + str(1) + ", was " + str(1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, 2)) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(2));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["macros-and-let", function () {
  var a = 10;
  if (! equal63(a, 10)) {
    failed = failed + 1;
    return("failed: expected " + str(a) + ", was " + str(10));
  } else {
    passed = passed + 1;
  }
  if (! equal63(12, 12)) {
    failed = failed + 1;
    return("failed: expected " + str(12) + ", was " + str(12));
  } else {
    passed = passed + 1;
  }
  if (! equal63(a, 10)) {
    failed = failed + 1;
    return("failed: expected " + str(a) + ", was " + str(10));
  } else {
    passed = passed + 1;
  }
  var b = 20;
  if (! equal63(b, 20)) {
    failed = failed + 1;
    return("failed: expected " + str(b) + ", was " + str(20));
  } else {
    passed = passed + 1;
  }
  if (! equal63(22, 22)) {
    failed = failed + 1;
    return("failed: expected " + str(22) + ", was " + str(22));
  } else {
    passed = passed + 1;
  }
  if (! equal63(b, 20)) {
    failed = failed + 1;
    return("failed: expected " + str(b) + ", was " + str(20));
  } else {
    passed = passed + 1;
  }
  if (! equal63(30, 30)) {
    failed = failed + 1;
    return("failed: expected " + str(30) + ", was " + str(30));
  } else {
    passed = passed + 1;
  }
  var _c1 = 32;
  if (! equal63(32, _c1)) {
    failed = failed + 1;
    return("failed: expected " + str(32) + ", was " + str(_c1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(30, 30)) {
    failed = failed + 1;
    return("failed: expected " + str(30) + ", was " + str(30));
  } else {
    passed = passed + 1;
  }
  if (! equal63(40, 40)) {
    failed = failed + 1;
    return("failed: expected " + str(40) + ", was " + str(40));
  } else {
    passed = passed + 1;
  }
  var _d = 42;
  if (! equal63(42, _d)) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str(_d));
  } else {
    passed = passed + 1;
  }
  if (! equal63(40, 40)) {
    failed = failed + 1;
    return("failed: expected " + str(40) + ", was " + str(40));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["w/uniq", function () {
  var ham = uniq("ham");
  var chap = uniq("chap");
  if (! equal63("_ham", ham)) {
    failed = failed + 1;
    return("failed: expected " + str("_ham") + ", was " + str(ham));
  } else {
    passed = passed + 1;
  }
  if (! equal63("_chap", chap)) {
    failed = failed + 1;
    return("failed: expected " + str("_chap") + ", was " + str(chap));
  } else {
    passed = passed + 1;
  }
  var _ham = uniq("ham");
  if (! equal63("_ham1", _ham)) {
    failed = failed + 1;
    return("failed: expected " + str("_ham1") + ", was " + str(_ham));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["literals", function () {
  if (! equal63(true, true)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(true));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, false)) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(false));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, -inf < -10000000000)) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(-inf < -10000000000));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, inf < -10000000000)) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(inf < -10000000000));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, nan === nan)) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(nan === nan));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, nan63(nan))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(nan63(nan)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, nan63(nan * 20))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(nan63(nan * 20)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(-inf, - inf)) {
    failed = failed + 1;
    return("failed: expected " + str(-inf) + ", was " + str(- inf));
  } else {
    passed = passed + 1;
  }
  if (! equal63(inf, - -inf)) {
    failed = failed + 1;
    return("failed: expected " + str(inf) + ", was " + str(- -inf));
  } else {
    passed = passed + 1;
  }
  var Inf = 1;
  var NaN = 2;
  var _Inf = "a";
  var _NaN = "b";
  if (! equal63(Inf, 1)) {
    failed = failed + 1;
    return("failed: expected " + str(Inf) + ", was " + str(1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(NaN, 2)) {
    failed = failed + 1;
    return("failed: expected " + str(NaN) + ", was " + str(2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(_Inf, "a")) {
    failed = failed + 1;
    return("failed: expected " + str(_Inf) + ", was " + str("a"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(_NaN, "b")) {
    failed = failed + 1;
    return("failed: expected " + str(_NaN) + ", was " + str("b"));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["add", function () {
  var l = [];
  add(l, "a");
  add(l, "b");
  add(l, "c");
  if (! equal63(["a", "b", "c"], l)) {
    failed = failed + 1;
    return("failed: expected " + str(["a", "b", "c"]) + ", was " + str(l));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, add([], "a"))) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(add([], "a")));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["drop", function () {
  var l = ["a", "b", "c"];
  if (! equal63("c", drop(l))) {
    failed = failed + 1;
    return("failed: expected " + str("c") + ", was " + str(drop(l)));
  } else {
    passed = passed + 1;
  }
  if (! equal63("b", drop(l))) {
    failed = failed + 1;
    return("failed: expected " + str("b") + ", was " + str(drop(l)));
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", drop(l))) {
    failed = failed + 1;
    return("failed: expected " + str("a") + ", was " + str(drop(l)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, drop(l))) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(drop(l)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["last", function () {
  if (! equal63(3, last([1, 2, 3]))) {
    failed = failed + 1;
    return("failed: expected " + str(3) + ", was " + str(last([1, 2, 3])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, last([]))) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(last([])));
  } else {
    passed = passed + 1;
  }
  if (! equal63("c", last(["a", "b", "c"]))) {
    failed = failed + 1;
    return("failed: expected " + str("c") + ", was " + str(last(["a", "b", "c"])));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["join", function () {
  if (! equal63([1, 2, 3], join([1, 2], [3]))) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2, 3]) + ", was " + str(join([1, 2], [3])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2], join([], [1, 2]))) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2]) + ", was " + str(join([], [1, 2])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], join([], []))) {
    failed = failed + 1;
    return("failed: expected " + str([]) + ", was " + str(join([], [])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], join(undefined, undefined))) {
    failed = failed + 1;
    return("failed: expected " + str([]) + ", was " + str(join(undefined, undefined)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], join(undefined, []))) {
    failed = failed + 1;
    return("failed: expected " + str([]) + ", was " + str(join(undefined, [])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], join())) {
    failed = failed + 1;
    return("failed: expected " + str([]) + ", was " + str(join()));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], join([]))) {
    failed = failed + 1;
    return("failed: expected " + str([]) + ", was " + str(join([])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1], join([1], undefined))) {
    failed = failed + 1;
    return("failed: expected " + str([1]) + ", was " + str(join([1], undefined)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], join(["a"], []))) {
    failed = failed + 1;
    return("failed: expected " + str(["a"]) + ", was " + str(join(["a"], [])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], join(undefined, ["a"]))) {
    failed = failed + 1;
    return("failed: expected " + str(["a"]) + ", was " + str(join(undefined, ["a"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], join(["a"]))) {
    failed = failed + 1;
    return("failed: expected " + str(["a"]) + ", was " + str(join(["a"])));
  } else {
    passed = passed + 1;
  }
  var _x703 = ["a"];
  _x703.b = true;
  if (! equal63(_x703, join(["a"], {b: true}))) {
    failed = failed + 1;
    var _x705 = ["a"];
    _x705.b = true;
    return("failed: expected " + str(_x705) + ", was " + str(join(["a"], {b: true})));
  } else {
    passed = passed + 1;
  }
  var _x707 = ["a", "b"];
  _x707.b = true;
  var _x709 = ["b"];
  _x709.b = true;
  if (! equal63(_x707, join(["a"], _x709))) {
    failed = failed + 1;
    var _x710 = ["a", "b"];
    _x710.b = true;
    var _x712 = ["b"];
    _x712.b = true;
    return("failed: expected " + str(_x710) + ", was " + str(join(["a"], _x712)));
  } else {
    passed = passed + 1;
  }
  var _x713 = ["a"];
  _x713.b = 10;
  var _x714 = ["a"];
  _x714.b = true;
  if (! equal63(_x713, join(_x714, {b: 10}))) {
    failed = failed + 1;
    var _x715 = ["a"];
    _x715.b = 10;
    var _x716 = ["a"];
    _x716.b = true;
    return("failed: expected " + str(_x715) + ", was " + str(join(_x716, {b: 10})));
  } else {
    passed = passed + 1;
  }
  var _x717 = [];
  _x717.b = 10;
  var _x718 = [];
  _x718.b = 10;
  if (! equal63(_x717, join({b: true}, _x718))) {
    failed = failed + 1;
    var _x719 = [];
    _x719.b = 10;
    var _x720 = [];
    _x720.b = 10;
    return("failed: expected " + str(_x719) + ", was " + str(join({b: true}, _x720)));
  } else {
    passed = passed + 1;
  }
  var _x721 = ["a"];
  _x721.b = 1;
  var _x722 = ["b"];
  _x722.c = 2;
  var l = join(_x721, _x722);
  if (! equal63(1, l.b)) {
    failed = failed + 1;
    return("failed: expected " + str(1) + ", was " + str(l.b));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, l.c)) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(l.c));
  } else {
    passed = passed + 1;
  }
  if (! equal63("b", l[1])) {
    failed = failed + 1;
    return("failed: expected " + str("b") + ", was " + str(l[1]));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["rev", function () {
  if (! equal63([], rev([]))) {
    failed = failed + 1;
    return("failed: expected " + str([]) + ", was " + str(rev([])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([3, 2, 1], rev([1, 2, 3]))) {
    failed = failed + 1;
    return("failed: expected " + str([3, 2, 1]) + ", was " + str(rev([1, 2, 3])));
  } else {
    passed = passed + 1;
  }
  var _x728 = [3, 2, 1];
  _x728.a = true;
  var _x729 = [1, 2, 3];
  _x729.a = true;
  if (! equal63(_x728, rev(_x729))) {
    failed = failed + 1;
    var _x730 = [3, 2, 1];
    _x730.a = true;
    var _x731 = [1, 2, 3];
    _x731.a = true;
    return("failed: expected " + str(_x730) + ", was " + str(rev(_x731)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["map", function (_) {
  if (! equal63([], map(function (_) {
    return(_);
  }, []))) {
    failed = failed + 1;
    return("failed: expected " + str([]) + ", was " + str(map(function (_) {
      return(_);
    }, [])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1], map(function (_) {
    return(_);
  }, [1]))) {
    failed = failed + 1;
    return("failed: expected " + str([1]) + ", was " + str(map(function (_) {
      return(_);
    }, [1])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([2, 3, 4], map(function (_) {
    return(_ + 1);
  }, [1, 2, 3]))) {
    failed = failed + 1;
    return("failed: expected " + str([2, 3, 4]) + ", was " + str(map(function (_) {
      return(_ + 1);
    }, [1, 2, 3])));
  } else {
    passed = passed + 1;
  }
  var _x741 = [2, 3, 4];
  _x741.a = 5;
  var _x742 = [1, 2, 3];
  _x742.a = 4;
  if (! equal63(_x741, map(function (_) {
    return(_ + 1);
  }, _x742))) {
    failed = failed + 1;
    var _x743 = [2, 3, 4];
    _x743.a = 5;
    var _x744 = [1, 2, 3];
    _x744.a = 4;
    return("failed: expected " + str(_x743) + ", was " + str(map(function (_) {
      return(_ + 1);
    }, _x744)));
  } else {
    passed = passed + 1;
  }
  var _x745 = [];
  _x745.a = true;
  var _x746 = [];
  _x746.a = true;
  if (! equal63(_x745, map(function (_) {
    return(_);
  }, _x746))) {
    failed = failed + 1;
    var _x747 = [];
    _x747.a = true;
    var _x748 = [];
    _x748.a = true;
    return("failed: expected " + str(_x747) + ", was " + str(map(function (_) {
      return(_);
    }, _x748)));
  } else {
    passed = passed + 1;
  }
  var _x749 = [];
  _x749.b = false;
  var _x750 = [];
  _x750.b = false;
  if (! equal63(_x749, map(function (_) {
    return(_);
  }, _x750))) {
    failed = failed + 1;
    var _x751 = [];
    _x751.b = false;
    var _x752 = [];
    _x752.b = false;
    return("failed: expected " + str(_x751) + ", was " + str(map(function (_) {
      return(_);
    }, _x752)));
  } else {
    passed = passed + 1;
  }
  var _x753 = [];
  _x753.a = true;
  _x753.b = false;
  var _x754 = [];
  _x754.a = true;
  _x754.b = false;
  if (! equal63(_x753, map(function (_) {
    return(_);
  }, _x754))) {
    failed = failed + 1;
    var _x755 = [];
    _x755.a = true;
    _x755.b = false;
    var _x756 = [];
    _x756.a = true;
    _x756.b = false;
    return("failed: expected " + str(_x755) + ", was " + str(map(function (_) {
      return(_);
    }, _x756)));
  } else {
    passed = passed + 1;
  }
  var evens = function (_) {
    if (_ % 2 === 0) {
      return(_);
    }
  };
  if (! equal63([2, 4, 6], map(evens, [1, 2, 3, 4, 5, 6]))) {
    failed = failed + 1;
    return("failed: expected " + str([2, 4, 6]) + ", was " + str(map(evens, [1, 2, 3, 4, 5, 6])));
  } else {
    passed = passed + 1;
  }
  var _x761 = [2, 4, 6];
  _x761.b = 8;
  var _x762 = [1, 2, 3, 4, 5, 6];
  _x762.a = 7;
  _x762.b = 8;
  if (! equal63(_x761, map(evens, _x762))) {
    failed = failed + 1;
    var _x763 = [2, 4, 6];
    _x763.b = 8;
    var _x764 = [1, 2, 3, 4, 5, 6];
    _x764.a = 7;
    _x764.b = 8;
    return("failed: expected " + str(_x763) + ", was " + str(map(evens, _x764)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["cut", function () {
  if (! equal63([], cut([]))) {
    failed = failed + 1;
    return("failed: expected " + str([]) + ", was " + str(cut([])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], cut(["a"]))) {
    failed = failed + 1;
    return("failed: expected " + str(["a"]) + ", was " + str(cut(["a"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["b", "c"], cut(["a", "b", "c"], 1))) {
    failed = failed + 1;
    return("failed: expected " + str(["b", "c"]) + ", was " + str(cut(["a", "b", "c"], 1)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["b", "c"], cut(["a", "b", "c", "d"], 1, 3))) {
    failed = failed + 1;
    return("failed: expected " + str(["b", "c"]) + ", was " + str(cut(["a", "b", "c", "d"], 1, 3)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3], cut([1, 2, 3], 0, 10))) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2, 3]) + ", was " + str(cut([1, 2, 3], 0, 10)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1], cut([1, 2, 3], -4, 1))) {
    failed = failed + 1;
    return("failed: expected " + str([1]) + ", was " + str(cut([1, 2, 3], -4, 1)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3], cut([1, 2, 3], -4))) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2, 3]) + ", was " + str(cut([1, 2, 3], -4)));
  } else {
    passed = passed + 1;
  }
  var _x790 = [2];
  _x790.a = true;
  var _x791 = [1, 2];
  _x791.a = true;
  if (! equal63(_x790, cut(_x791, 1))) {
    failed = failed + 1;
    var _x792 = [2];
    _x792.a = true;
    var _x793 = [1, 2];
    _x793.a = true;
    return("failed: expected " + str(_x792) + ", was " + str(cut(_x793, 1)));
  } else {
    passed = passed + 1;
  }
  var _x794 = [];
  _x794.a = true;
  _x794.b = 2;
  var _x795 = [];
  _x795.a = true;
  _x795.b = 2;
  if (! equal63(_x794, cut(_x795))) {
    failed = failed + 1;
    var _x796 = [];
    _x796.a = true;
    _x796.b = 2;
    var _x797 = [];
    _x797.a = true;
    _x797.b = 2;
    return("failed: expected " + str(_x796) + ", was " + str(cut(_x797)));
  } else {
    passed = passed + 1;
  }
  var l = [1, 2, 3];
  if (! equal63([], cut(l, l.length || 0))) {
    failed = failed + 1;
    return("failed: expected " + str([]) + ", was " + str(cut(l, l.length || 0)));
  } else {
    passed = passed + 1;
  }
  var _x799 = [1, 2, 3];
  _x799.a = true;
  var _l9 = _x799;
  var _x800 = [];
  _x800.a = true;
  if (! equal63(_x800, cut(_l9, _l9.length || 0))) {
    failed = failed + 1;
    var _x801 = [];
    _x801.a = true;
    return("failed: expected " + str(_x801) + ", was " + str(cut(_l9, _l9.length || 0)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["clip", function () {
  if (! equal63("uux", clip("quux", 1))) {
    failed = failed + 1;
    return("failed: expected " + str("uux") + ", was " + str(clip("quux", 1)));
  } else {
    passed = passed + 1;
  }
  if (! equal63("uu", clip("quux", 1, 3))) {
    failed = failed + 1;
    return("failed: expected " + str("uu") + ", was " + str(clip("quux", 1, 3)));
  } else {
    passed = passed + 1;
  }
  if (! equal63("", clip("quux", 5))) {
    failed = failed + 1;
    return("failed: expected " + str("") + ", was " + str(clip("quux", 5)));
  } else {
    passed = passed + 1;
  }
  if (! equal63("ab", clip("ab", 0, 4))) {
    failed = failed + 1;
    return("failed: expected " + str("ab") + ", was " + str(clip("ab", 0, 4)));
  } else {
    passed = passed + 1;
  }
  if (! equal63("ab", clip("ab", -4, 4))) {
    failed = failed + 1;
    return("failed: expected " + str("ab") + ", was " + str(clip("ab", -4, 4)));
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", clip("ab", -1, 1))) {
    failed = failed + 1;
    return("failed: expected " + str("a") + ", was " + str(clip("ab", -1, 1)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["search", function () {
  if (! equal63(undefined, search("", "a"))) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(search("", "a")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(0, search("", ""))) {
    failed = failed + 1;
    return("failed: expected " + str(0) + ", was " + str(search("", "")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(0, search("a", ""))) {
    failed = failed + 1;
    return("failed: expected " + str(0) + ", was " + str(search("a", "")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(0, search("abc", "a"))) {
    failed = failed + 1;
    return("failed: expected " + str(0) + ", was " + str(search("abc", "a")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, search("abcd", "cd"))) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(search("abcd", "cd")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, search("abcd", "ce"))) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(search("abcd", "ce")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, search("abc", "z"))) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(search("abc", "z")));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["split", function () {
  if (! equal63([], split("", ""))) {
    failed = failed + 1;
    return("failed: expected " + str([]) + ", was " + str(split("", "")));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], split("", ","))) {
    failed = failed + 1;
    return("failed: expected " + str([]) + ", was " + str(split("", ",")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], split("a", ","))) {
    failed = failed + 1;
    return("failed: expected " + str(["a"]) + ", was " + str(split("a", ",")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", ""], split("a,", ","))) {
    failed = failed + 1;
    return("failed: expected " + str(["a", ""]) + ", was " + str(split("a,", ",")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", "b"], split("a,b", ","))) {
    failed = failed + 1;
    return("failed: expected " + str(["a", "b"]) + ", was " + str(split("a,b", ",")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", "b", ""], split("a,b,", ","))) {
    failed = failed + 1;
    return("failed: expected " + str(["a", "b", ""]) + ", was " + str(split("a,b,", ",")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", "b"], split("azzb", "zz"))) {
    failed = failed + 1;
    return("failed: expected " + str(["a", "b"]) + ", was " + str(split("azzb", "zz")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", "b", ""], split("azzbzz", "zz"))) {
    failed = failed + 1;
    return("failed: expected " + str(["a", "b", ""]) + ", was " + str(split("azzbzz", "zz")));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["reduce", function () {
  if (! equal63("a", reduce(function (_0, _1) {
    return(_0 + _1);
  }, ["a"]))) {
    failed = failed + 1;
    return("failed: expected " + str("a") + ", was " + str(reduce(function (_0, _1) {
      return(_0 + _1);
    }, ["a"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(6, reduce(function (_0, _1) {
    return(_0 + _1);
  }, [1, 2, 3]))) {
    failed = failed + 1;
    return("failed: expected " + str(6) + ", was " + str(reduce(function (_0, _1) {
      return(_0 + _1);
    }, [1, 2, 3])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, [2, 3]], reduce(function (_0, _1) {
    return([_0, _1]);
  }, [1, 2, 3]))) {
    failed = failed + 1;
    return("failed: expected " + str([1, [2, 3]]) + ", was " + str(reduce(function (_0, _1) {
      return([_0, _1]);
    }, [1, 2, 3])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3, 4, 5], reduce(function (_0, _1) {
    return(join(_0, _1));
  }, [[1], [2, 3], [4, 5]]))) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2, 3, 4, 5]) + ", was " + str(reduce(function (_0, _1) {
      return(join(_0, _1));
    }, [[1], [2, 3], [4, 5]])));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["keep", function () {
  if (! equal63([], keep(function (_) {
    return(_);
  }, []))) {
    failed = failed + 1;
    return("failed: expected " + str([]) + ", was " + str(keep(function (_) {
      return(_);
    }, [])));
  } else {
    passed = passed + 1;
  }
  var even = function (_) {
    return(_ % 2 === 0);
  };
  if (! equal63([6], keep(even, [5, 6, 7]))) {
    failed = failed + 1;
    return("failed: expected " + str([6]) + ", was " + str(keep(even, [5, 6, 7])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([[1], [2, 3]], keep(function (_) {
    return((_.length || 0) > 0);
  }, [[], [1], [], [2, 3]]))) {
    failed = failed + 1;
    return("failed: expected " + str([[1], [2, 3]]) + ", was " + str(keep(function (_) {
      return((_.length || 0) > 0);
    }, [[], [1], [], [2, 3]])));
  } else {
    passed = passed + 1;
  }
  var even63 = function (_) {
    return(_ % 2 === 0);
  };
  if (! equal63([2, 4, 6], keep(even63, [1, 2, 3, 4, 5, 6]))) {
    failed = failed + 1;
    return("failed: expected " + str([2, 4, 6]) + ", was " + str(keep(even63, [1, 2, 3, 4, 5, 6])));
  } else {
    passed = passed + 1;
  }
  var _x865 = [2, 4, 6];
  _x865.b = 8;
  var _x866 = [1, 2, 3, 4, 5, 6];
  _x866.a = 7;
  _x866.b = 8;
  if (! equal63(_x865, keep(even63, _x866))) {
    failed = failed + 1;
    var _x867 = [2, 4, 6];
    _x867.b = 8;
    var _x868 = [1, 2, 3, 4, 5, 6];
    _x868.a = 7;
    _x868.b = 8;
    return("failed: expected " + str(_x867) + ", was " + str(keep(even63, _x868)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["in?", function () {
  if (! equal63(true, in63("x", ["x", "y", "z"]))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(in63("x", ["x", "y", "z"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, in63(7, [5, 6, 7]))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(in63(7, [5, 6, 7])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, in63("baz", ["no", "can", "do"]))) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(in63("baz", ["no", "can", "do"])));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["find", function () {
  if (! equal63(undefined, find(function (_) {
    return(_);
  }, []))) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(find(function (_) {
      return(_);
    }, [])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(7, find(function (_) {
    return(_);
  }, [7]))) {
    failed = failed + 1;
    return("failed: expected " + str(7) + ", was " + str(find(function (_) {
      return(_);
    }, [7])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, find(function (_) {
    return(_ === 7);
  }, [2, 4, 7]))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(find(function (_) {
      return(_ === 7);
    }, [2, 4, 7])));
  } else {
    passed = passed + 1;
  }
  var _x881 = [2, 4];
  _x881.foo = 7;
  if (! equal63(true, find(function (_) {
    return(_ === 7);
  }, _x881))) {
    failed = failed + 1;
    var _x882 = [2, 4];
    _x882.foo = 7;
    return("failed: expected " + str(true) + ", was " + str(find(function (_) {
      return(_ === 7);
    }, _x882)));
  } else {
    passed = passed + 1;
  }
  var _x883 = [2, 4];
  _x883.bar = true;
  if (! equal63(true, find(function (_) {
    return(_ === true);
  }, _x883))) {
    failed = failed + 1;
    var _x884 = [2, 4];
    _x884.bar = true;
    return("failed: expected " + str(true) + ", was " + str(find(function (_) {
      return(_ === true);
    }, _x884)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, in63(7, [2, 4, 7]))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(in63(7, [2, 4, 7])));
  } else {
    passed = passed + 1;
  }
  var _x887 = [2, 4];
  _x887.foo = 7;
  if (! equal63(true, in63(7, _x887))) {
    failed = failed + 1;
    var _x888 = [2, 4];
    _x888.foo = 7;
    return("failed: expected " + str(true) + ", was " + str(in63(7, _x888)));
  } else {
    passed = passed + 1;
  }
  var _x889 = [2, 4];
  _x889.bar = true;
  if (! equal63(true, in63(true, _x889))) {
    failed = failed + 1;
    var _x890 = [2, 4];
    _x890.bar = true;
    return("failed: expected " + str(true) + ", was " + str(in63(true, _x890)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["first", function () {
  if (! equal63(undefined, first(function (_) {
    return(_);
  }, []))) {
    failed = failed + 1;
    return("failed: expected " + str(undefined) + ", was " + str(first(function (_) {
      return(_);
    }, [])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(7, first(function (_) {
    return(_);
  }, [7]))) {
    failed = failed + 1;
    return("failed: expected " + str(7) + ", was " + str(first(function (_) {
      return(_);
    }, [7])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, first(function (_) {
    return(_ === 7);
  }, [2, 4, 7]))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(first(function (_) {
      return(_ === 7);
    }, [2, 4, 7])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, first(function (_) {
    return(_ > 3 && _);
  }, [1, 2, 3, 4, 5, 6]))) {
    failed = failed + 1;
    return("failed: expected " + str(4) + ", was " + str(first(function (_) {
      return(_ > 3 && _);
    }, [1, 2, 3, 4, 5, 6])));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["sort", function () {
  if (! equal63(["a", "b", "c"], sort(["c", "a", "b"]))) {
    failed = failed + 1;
    return("failed: expected " + str(["a", "b", "c"]) + ", was " + str(sort(["c", "a", "b"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([3, 2, 1], sort([1, 2, 3], _62))) {
    failed = failed + 1;
    return("failed: expected " + str([3, 2, 1]) + ", was " + str(sort([1, 2, 3], _62)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["type", function () {
  if (! equal63(true, typeof("abc") === "string")) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(typeof("abc") === "string"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof(17) === "string")) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(typeof(17) === "string"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof(["a"]) === "string")) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(typeof(["a"]) === "string"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof(true) === "string")) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(typeof(true) === "string"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof({}) === "string")) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(typeof({}) === "string"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof("abc") === "number")) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(typeof("abc") === "number"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, typeof(17) === "number")) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(typeof(17) === "number"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof(["a"]) === "number")) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(typeof(["a"]) === "number"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof(true) === "number")) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(typeof(true) === "number"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof({}) === "number")) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(typeof({}) === "number"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof("abc") === "boolean")) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(typeof("abc") === "boolean"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof(17) === "boolean")) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(typeof(17) === "boolean"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof(["a"]) === "boolean")) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(typeof(["a"]) === "boolean"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, typeof(true) === "boolean")) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(typeof(true) === "boolean"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, typeof({}) === "boolean")) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(typeof({}) === "boolean"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, !( typeof(undefined) === "object"))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(!( typeof(undefined) === "object")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, !( typeof("abc") === "object"))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(!( typeof("abc") === "object")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, !( typeof(42) === "object"))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(!( typeof(42) === "object")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, !( typeof(true) === "object"))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(!( typeof(true) === "object")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, !( typeof(function () {
  }) === "object"))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(!( typeof(function () {
    }) === "object")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, !( typeof([1]) === "object"))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(!( typeof([1]) === "object")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, !( typeof({}) === "object"))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(!( typeof({}) === "object")));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["apply", function () {
  if (! equal63(4, apply(function (_0, _1) {
    return(_0 + _1);
  }, [2, 2]))) {
    failed = failed + 1;
    return("failed: expected " + str(4) + ", was " + str(apply(function (_0, _1) {
      return(_0 + _1);
    }, [2, 2])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([2, 2], apply(function () {
    var a = unstash(Array.prototype.slice.call(arguments, 0));
    return(a);
  }, [2, 2]))) {
    failed = failed + 1;
    return("failed: expected " + str([2, 2]) + ", was " + str(apply(function () {
      var a = unstash(Array.prototype.slice.call(arguments, 0));
      return(a);
    }, [2, 2])));
  } else {
    passed = passed + 1;
  }
  var l = [1];
  l.foo = 17;
  if (! equal63(17, apply(function () {
    var a = unstash(Array.prototype.slice.call(arguments, 0));
    return(a.foo);
  }, l))) {
    failed = failed + 1;
    return("failed: expected " + str(17) + ", was " + str(apply(function () {
      var a = unstash(Array.prototype.slice.call(arguments, 0));
      return(a.foo);
    }, l)));
  } else {
    passed = passed + 1;
  }
  var _x924 = [];
  _x924.foo = 42;
  if (! equal63(42, apply(function () {
    var _r194 = unstash(Array.prototype.slice.call(arguments, 0));
    var foo = _r194.foo;
    return(foo);
  }, _x924))) {
    failed = failed + 1;
    var _x925 = [];
    _x925.foo = 42;
    return("failed: expected " + str(42) + ", was " + str(apply(function () {
      var _r195 = unstash(Array.prototype.slice.call(arguments, 0));
      var foo = _r195.foo;
      return(foo);
    }, _x925)));
  } else {
    passed = passed + 1;
  }
  var _x928 = [];
  _x928.foo = 42;
  if (! equal63(42, apply(function (_x926) {
    var foo = _x926.foo;
    return(foo);
  }, [_x928]))) {
    failed = failed + 1;
    var _x931 = [];
    _x931.foo = 42;
    return("failed: expected " + str(42) + ", was " + str(apply(function (_x929) {
      var foo = _x929.foo;
      return(foo);
    }, [_x931])));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["eval", function () {
  var eval = compiler.eval;
  if (! equal63(4, eval(["+", 2, 2]))) {
    failed = failed + 1;
    return("failed: expected " + str(4) + ", was " + str(eval(["+", 2, 2])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(5, eval(["let", "a", 3, ["+", 2, "a"]]))) {
    failed = failed + 1;
    return("failed: expected " + str(5) + ", was " + str(eval(["let", "a", 3, ["+", 2, "a"]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(9, eval(["do", ["var", "x", 7], ["+", "x", 2]]))) {
    failed = failed + 1;
    return("failed: expected " + str(9) + ", was " + str(eval(["do", ["var", "x", 7], ["+", "x", 2]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(6, eval(["apply", "+", ["quote", [1, 2, 3]]]))) {
    failed = failed + 1;
    return("failed: expected " + str(6) + ", was " + str(eval(["apply", "+", ["quote", [1, 2, 3]]])));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["parameters", function () {
  if (! equal63(42, (function (_x952) {
    var a = _x952[0];
    return(a);
  })([42]))) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str((function (_x954) {
      var a = _x954[0];
      return(a);
    })([42])));
  } else {
    passed = passed + 1;
  }
  var f = function (a, _x956) {
    var b = _x956[0];
    var c = _x956[1];
    return([a, b, c]);
  };
  if (! equal63([1, 2, 3], f(1, [2, 3]))) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2, 3]) + ", was " + str(f(1, [2, 3])));
  } else {
    passed = passed + 1;
  }
  var _f = function (a, _x962) {
    var b = _x962[0];
    var c = cut(_x962, 1);
    var _r203 = unstash(Array.prototype.slice.call(arguments, 2));
    var d = cut(_r203, 0);
    return([a, b, c, d]);
  };
  if (! equal63([1, 2, [3, 4], [5, 6, 7]], _f(1, [2, 3, 4], 5, 6, 7))) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2, [3, 4], [5, 6, 7]]) + ", was " + str(_f(1, [2, 3, 4], 5, 6, 7)));
  } else {
    passed = passed + 1;
  }
  var _f1 = function (a, _x972) {
    var b = _x972[0];
    var c = cut(_x972, 1);
    var _r204 = unstash(Array.prototype.slice.call(arguments, 2));
    var d = cut(_r204, 0);
    return([a, b, c, d]);
  };
  if (! equal63([1, 2, [3, 4], [5, 6, 7]], apply(_f1, [1, [2, 3, 4], 5, 6, 7]))) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2, [3, 4], [5, 6, 7]]) + ", was " + str(apply(_f1, [1, [2, 3, 4], 5, 6, 7])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([3, 4], (function (a, b) {
    var _r205 = unstash(Array.prototype.slice.call(arguments, 2));
    var c = cut(_r205, 0);
    return(c);
  })(1, 2, 3, 4))) {
    failed = failed + 1;
    return("failed: expected " + str([3, 4]) + ", was " + str((function (a, b) {
      var _r206 = unstash(Array.prototype.slice.call(arguments, 2));
      var c = cut(_r206, 0);
      return(c);
    })(1, 2, 3, 4)));
  } else {
    passed = passed + 1;
  }
  var _f2 = function (w, _x986) {
    var x = _x986[0];
    var y = cut(_x986, 1);
    var _r207 = unstash(Array.prototype.slice.call(arguments, 2));
    var z = cut(_r207, 0);
    return([y, z]);
  };
  if (! equal63([[3, 4], [5, 6, 7]], _f2(1, [2, 3, 4], 5, 6, 7))) {
    failed = failed + 1;
    return("failed: expected " + str([[3, 4], [5, 6, 7]]) + ", was " + str(_f2(1, [2, 3, 4], 5, 6, 7)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, (function () {
    var _r208 = unstash(Array.prototype.slice.call(arguments, 0));
    var foo = _r208.foo;
    return(foo);
  })(stash33({foo: 42})))) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str((function () {
      var _r209 = unstash(Array.prototype.slice.call(arguments, 0));
      var foo = _r209.foo;
      return(foo);
    })(stash33({foo: 42}))));
  } else {
    passed = passed + 1;
  }
  var _x996 = [];
  _x996.foo = 42;
  if (! equal63(42, apply(function () {
    var _r210 = unstash(Array.prototype.slice.call(arguments, 0));
    var foo = _r210.foo;
    return(foo);
  }, _x996))) {
    failed = failed + 1;
    var _x997 = [];
    _x997.foo = 42;
    return("failed: expected " + str(42) + ", was " + str(apply(function () {
      var _r211 = unstash(Array.prototype.slice.call(arguments, 0));
      var foo = _r211.foo;
      return(foo);
    }, _x997)));
  } else {
    passed = passed + 1;
  }
  var _x999 = [];
  _x999.foo = 42;
  if (! equal63(42, (function (_x998) {
    var foo = _x998.foo;
    return(foo);
  })(_x999))) {
    failed = failed + 1;
    var _x1001 = [];
    _x1001.foo = 42;
    return("failed: expected " + str(42) + ", was " + str((function (_x1000) {
      var foo = _x1000.foo;
      return(foo);
    })(_x1001)));
  } else {
    passed = passed + 1;
  }
  var _f3 = function (a, _x1002) {
    var foo = _x1002.foo;
    var _r214 = unstash(Array.prototype.slice.call(arguments, 2));
    var b = _r214.bar;
    return([a, b, foo]);
  };
  var _x1005 = [];
  _x1005.foo = 42;
  if (! equal63([10, 20, 42], _f3(10, _x1005, stash33({bar: 20})))) {
    failed = failed + 1;
    var _x1007 = [];
    _x1007.foo = 42;
    return("failed: expected " + str([10, 20, 42]) + ", was " + str(_f3(10, _x1007, stash33({bar: 20}))));
  } else {
    passed = passed + 1;
  }
  var _f4 = function (a, _x1008) {
    var foo = _x1008.foo;
    var _r215 = unstash(Array.prototype.slice.call(arguments, 2));
    var b = _r215.bar;
    return([a, b, foo]);
  };
  var _x1012 = ["list"];
  _x1012.foo = 42;
  var _x1011 = [10, _x1012];
  _x1011.bar = 20;
  if (! equal63([10, 20, 42], apply(_f4, _x1011))) {
    failed = failed + 1;
    var _x1015 = ["list"];
    _x1015.foo = 42;
    var _x1014 = [10, _x1015];
    _x1014.bar = 20;
    return("failed: expected " + str([10, 20, 42]) + ", was " + str(apply(_f4, _x1014)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, (function (a) {
    var _r216 = unstash(Array.prototype.slice.call(arguments, 1));
    var b = _r216.b;
    return((a || 0) + b);
  })(stash33({b: 1})))) {
    failed = failed + 1;
    return("failed: expected " + str(1) + ", was " + str((function (a) {
      var _r217 = unstash(Array.prototype.slice.call(arguments, 1));
      var b = _r217.b;
      return((a || 0) + b);
    })(stash33({b: 1}))));
  } else {
    passed = passed + 1;
  }
  var _x1016 = [];
  _x1016.b = 1;
  if (! equal63(1, apply(function (a) {
    var _r218 = unstash(Array.prototype.slice.call(arguments, 1));
    var b = _r218.b;
    return((a || 0) + b);
  }, _x1016))) {
    failed = failed + 1;
    var _x1017 = [];
    _x1017.b = 1;
    return("failed: expected " + str(1) + ", was " + str(apply(function (a) {
      var _r219 = unstash(Array.prototype.slice.call(arguments, 1));
      var b = _r219.b;
      return((a || 0) + b);
    }, _x1017)));
  } else {
    passed = passed + 1;
  }
  var l = [];
  var f = function () {
    var _r220 = unstash(Array.prototype.slice.call(arguments, 0));
    var a = _r220.a;
    add(l, a);
    return(a);
  };
  var g = function (a, b) {
    var _r221 = unstash(Array.prototype.slice.call(arguments, 2));
    var c = _r221.c;
    add(l, [a, b, c]);
    return(c);
  };
  var x = f(stash33({a: g(f(stash33({a: 10})), f(stash33({a: 20})), stash33({c: f(stash33({a: 42}))}))}));
  if (! equal63(42, x)) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str(x));
  } else {
    passed = passed + 1;
  }
  if (! equal63([10, 20, 42, [10, 20, 42], 42], l)) {
    failed = failed + 1;
    return("failed: expected " + str([10, 20, 42, [10, 20, 42], 42]) + ", was " + str(l));
  } else {
    passed = passed + 1;
  }
  var _f5 = function () {
    var args = unstash(Array.prototype.slice.call(arguments, 0));
    return(args);
  };
  if (! equal63([1, 2, 3], _f5(1, 2, 3))) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2, 3]) + ", was " + str(_f5(1, 2, 3)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3], apply(_f5, [1, 2, 3]))) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2, 3]) + ", was " + str(apply(_f5, [1, 2, 3])));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
if (typeof(_x1029) === "undefined" || _x1029 === null) {
  _x1029 = true;
  run_tests();
}
