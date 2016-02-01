require("elf");
var reader = require("reader");
var compiler = require("compiler");
var passed = 0;
var failed = 0;
var tests = [];
setenv("test", {_stash: true, macro: function (x, msg) {
  return(["if", ["not", x], ["do", ["=", "failed", ["+", "failed", 1]], ["return", msg]], ["inc", "passed"]]);
}});
var equal63 = function (a, b) {
  if (atom63(a)) {
    return(a === b);
  } else {
    return(str(a) === str(b));
  }
};
setenv("eq", {_stash: true, macro: function (a, b) {
  return(["test", ["equal?", a, b], ["cat", "\"failed: expected \"", ["str", a], "\", was \"", ["str", b]]]);
}});
setenv("deftest", {_stash: true, macro: function (name) {
  var _r6 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id1 = _r6;
  var body = cut(_id1, 0);
  return(["add", "tests", ["list", ["quote", name], ["%fn", join(["do"], body)]]]);
}});
run_tests = function () {
  var _o = tests;
  var _i = undefined;
  for (_i in _o) {
    var _id2 = _o[_i];
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
    if (string63(result)) {
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
  if (! equal63(2, _35(read("(1 2 a: 7)")))) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(_35(read("(1 2 a: 7)"))));
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
    catch (_e66) {
      return([false, _e66.message, _e66.stack]);
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
add(tests, ["boolean", function () {
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
  var _id46 = true;
  var _e7;
  if (_id46) {
    _e7 = _id46;
  } else {
    throw new Error("bad");
    _e7 = undefined;
  }
  if (! equal63(true, _e7)) {
    failed = failed + 1;
    var _id47 = true;
    var _e8;
    if (_id47) {
      _e8 = _id47;
    } else {
      throw new Error("bad");
      _e8 = undefined;
    }
    return("failed: expected " + str(true) + ", was " + str(_e8));
  } else {
    passed = passed + 1;
  }
  var _id48 = false;
  var _e9;
  if (_id48) {
    throw new Error("bad");
    _e9 = undefined;
  } else {
    _e9 = _id48;
  }
  if (! equal63(false, _e9)) {
    failed = failed + 1;
    var _id49 = false;
    var _e10;
    if (_id49) {
      throw new Error("bad");
      _e10 = undefined;
    } else {
      _e10 = _id49;
    }
    return("failed: expected " + str(false) + ", was " + str(_e10));
  } else {
    passed = passed + 1;
  }
  var a = true;
  var _id50 = true;
  var _e11;
  if (_id50) {
    _e11 = _id50;
  } else {
    a = false;
    _e11 = false;
  }
  if (! equal63(true, _e11)) {
    failed = failed + 1;
    var _id51 = true;
    var _e12;
    if (_id51) {
      _e12 = _id51;
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
  var _id52 = false;
  var _e13;
  if (_id52) {
    a = false;
    _e13 = true;
  } else {
    _e13 = _id52;
  }
  if (! equal63(false, _e13)) {
    failed = failed + 1;
    var _id53 = false;
    var _e14;
    if (_id53) {
      a = false;
      _e14 = true;
    } else {
      _e14 = _id53;
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
  var _id54 = false;
  var _e15;
  if (_id54) {
    _e15 = _id54;
  } else {
    b = true;
    _e15 = b;
  }
  if (! equal63(true, _e15)) {
    failed = failed + 1;
    b = false;
    var _id55 = false;
    var _e16;
    if (_id55) {
      _e16 = _id55;
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
  var _id56 = b;
  var _e17;
  if (_id56) {
    _e17 = _id56;
  } else {
    b = true;
    _e17 = b;
  }
  if (! equal63(true, _e17)) {
    failed = failed + 1;
    b = true;
    var _id57 = b;
    var _e18;
    if (_id57) {
      _e18 = _id57;
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
  var _id58 = true;
  var _e19;
  if (_id58) {
    b = true;
    _e19 = b;
  } else {
    _e19 = _id58;
  }
  if (! equal63(true, _e19)) {
    failed = failed + 1;
    b = false;
    var _id59 = true;
    var _e20;
    if (_id59) {
      b = true;
      _e20 = b;
    } else {
      _e20 = _id59;
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
  var _id60 = b;
  var _e21;
  if (_id60) {
    b = true;
    _e21 = b;
  } else {
    _e21 = _id60;
  }
  if (! equal63(false, _e21)) {
    failed = failed + 1;
    b = false;
    var _id61 = b;
    var _e22;
    if (_id61) {
      b = true;
      _e22 = b;
    } else {
      _e22 = _id61;
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
  if (! equal63(3, _35("foo"))) {
    failed = failed + 1;
    return("failed: expected " + str(3) + ", was " + str(_35("foo")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, _35("\"a\""))) {
    failed = failed + 1;
    return("failed: expected " + str(3) + ", was " + str(_35("\"a\"")));
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
  if (! equal63(3, _35(s))) {
    failed = failed + 1;
    return("failed: expected " + str(3) + ", was " + str(_35(s)));
  } else {
    passed = passed + 1;
  }
  var _s = "a\nb\nc";
  if (! equal63(5, _35(_s))) {
    failed = failed + 1;
    return("failed: expected " + str(5) + ", was " + str(_35(_s)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, _35("a\nb"))) {
    failed = failed + 1;
    return("failed: expected " + str(3) + ", was " + str(_35("a\nb")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, _35("a\\b"))) {
    failed = failed + 1;
    return("failed: expected " + str(3) + ", was " + str(_35("a\\b")));
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
  if (! equal63(0, _35([]))) {
    failed = failed + 1;
    return("failed: expected " + str(0) + ", was " + str(_35([])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, _35([1, 2]))) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(_35([1, 2])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3], [1, 2, 3])) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2, 3]) + ", was " + str([1, 2, 3]));
  } else {
    passed = passed + 1;
  }
  var _x121 = [];
  _x121.foo = 17;
  if (! equal63(17, _x121.foo)) {
    failed = failed + 1;
    var _x122 = [];
    _x122.foo = 17;
    return("failed: expected " + str(17) + ", was " + str(_x122.foo));
  } else {
    passed = passed + 1;
  }
  var _x123 = [1];
  _x123.foo = 17;
  if (! equal63(17, _x123.foo)) {
    failed = failed + 1;
    var _x124 = [1];
    _x124.foo = 17;
    return("failed: expected " + str(17) + ", was " + str(_x124.foo));
  } else {
    passed = passed + 1;
  }
  var _x125 = [];
  _x125.foo = true;
  if (! equal63(true, _x125.foo)) {
    failed = failed + 1;
    var _x126 = [];
    _x126.foo = true;
    return("failed: expected " + str(true) + ", was " + str(_x126.foo));
  } else {
    passed = passed + 1;
  }
  var _x127 = [];
  _x127.foo = true;
  if (! equal63(true, _x127.foo)) {
    failed = failed + 1;
    var _x128 = [];
    _x128.foo = true;
    return("failed: expected " + str(true) + ", was " + str(_x128.foo));
  } else {
    passed = passed + 1;
  }
  var _x130 = [];
  _x130.foo = true;
  if (! equal63(true, hd([_x130]).foo)) {
    failed = failed + 1;
    var _x132 = [];
    _x132.foo = true;
    return("failed: expected " + str(true) + ", was " + str(hd([_x132]).foo));
  } else {
    passed = passed + 1;
  }
  var _x133 = [];
  _x133.a = true;
  var _x134 = [];
  _x134.a = true;
  if (! equal63(_x133, _x134)) {
    failed = failed + 1;
    var _x135 = [];
    _x135.a = true;
    var _x136 = [];
    _x136.a = true;
    return("failed: expected " + str(_x135) + ", was " + str(_x136));
  } else {
    passed = passed + 1;
  }
  var _x137 = [];
  _x137.b = false;
  var _x138 = [];
  _x138.b = false;
  if (! equal63(_x137, _x138)) {
    failed = failed + 1;
    var _x139 = [];
    _x139.b = false;
    var _x140 = [];
    _x140.b = false;
    return("failed: expected " + str(_x139) + ", was " + str(_x140));
  } else {
    passed = passed + 1;
  }
  var _x141 = [];
  _x141.c = 0;
  var _x142 = [];
  _x142.c = 0;
  if (! equal63(_x141, _x142)) {
    failed = failed + 1;
    var _x143 = [];
    _x143.c = 0;
    var _x144 = [];
    _x144.c = 0;
    return("failed: expected " + str(_x143) + ", was " + str(_x144));
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
  var _x315 = [];
  _x315.foo = true;
  if (! equal63(true, _x315.foo)) {
    failed = failed + 1;
    var _x316 = [];
    _x316.foo = true;
    return("failed: expected " + str(true) + ", was " + str(_x316.foo));
  } else {
    passed = passed + 1;
  }
  var _a1 = 17;
  var b = [1, 2];
  var _c = {a: 10};
  var _x318 = [];
  _x318.a = 10;
  var d = _x318;
  var _x319 = [];
  _x319.foo = _a1;
  if (! equal63(17, _x319.foo)) {
    failed = failed + 1;
    var _x320 = [];
    _x320.foo = _a1;
    return("failed: expected " + str(17) + ", was " + str(_x320.foo));
  } else {
    passed = passed + 1;
  }
  var _x321 = [];
  _x321.foo = _a1;
  if (! equal63(2, _35(join(_x321, b)))) {
    failed = failed + 1;
    var _x322 = [];
    _x322.foo = _a1;
    return("failed: expected " + str(2) + ", was " + str(_35(join(_x322, b))));
  } else {
    passed = passed + 1;
  }
  var _x323 = [];
  _x323.foo = _a1;
  if (! equal63(17, _x323.foo)) {
    failed = failed + 1;
    var _x324 = [];
    _x324.foo = _a1;
    return("failed: expected " + str(17) + ", was " + str(_x324.foo));
  } else {
    passed = passed + 1;
  }
  var _x325 = [1];
  _x325.a = 10;
  if (! equal63(_x325, join([1], _c))) {
    failed = failed + 1;
    var _x327 = [1];
    _x327.a = 10;
    return("failed: expected " + str(_x327) + ", was " + str(join([1], _c)));
  } else {
    passed = passed + 1;
  }
  var _x329 = [1];
  _x329.a = 10;
  if (! equal63(_x329, join([1], d))) {
    failed = failed + 1;
    var _x331 = [1];
    _x331.a = 10;
    return("failed: expected " + str(_x331) + ", was " + str(join([1], d)));
  } else {
    passed = passed + 1;
  }
  var _x334 = [];
  _x334.foo = true;
  if (! equal63(true, hd([_x334]).foo)) {
    failed = failed + 1;
    var _x336 = [];
    _x336.foo = true;
    return("failed: expected " + str(true) + ", was " + str(hd([_x336]).foo));
  } else {
    passed = passed + 1;
  }
  var _x338 = [];
  _x338.foo = true;
  if (! equal63(true, hd([_x338]).foo)) {
    failed = failed + 1;
    var _x340 = [];
    _x340.foo = true;
    return("failed: expected " + str(true) + ", was " + str(hd([_x340]).foo));
  } else {
    passed = passed + 1;
  }
  var _x341 = [];
  _x341.foo = true;
  if (! equal63(true, _x341.foo)) {
    failed = failed + 1;
    var _x342 = [];
    _x342.foo = true;
    return("failed: expected " + str(true) + ", was " + str(_x342.foo));
  } else {
    passed = passed + 1;
  }
  var _x344 = [];
  _x344.foo = true;
  if (! equal63(true, join([1, 2, 3], _x344).foo)) {
    failed = failed + 1;
    var _x346 = [];
    _x346.foo = true;
    return("failed: expected " + str(true) + ", was " + str(join([1, 2, 3], _x346).foo));
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
add(tests, ["calls", function (_) {
  var f = function () {
    return(42);
  };
  var l = [f];
  var t = {f: f};
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
  if (! equal63(42, t.f())) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str(t.f()));
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
  var _x514 = [];
  _x514.b = true;
  _x514.c = true;
  _x514.a = true;
  var x = _x514;
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
  var _e23;
  if (true) {
    _e23 = 1;
  } else {
    _e23 = 2;
  }
  if (! equal63(1, _e23)) {
    failed = failed + 1;
    var _e24;
    if (true) {
      _e24 = 1;
    } else {
      _e24 = 2;
    }
    return("failed: expected " + str(1) + ", was " + str(_e24));
  } else {
    passed = passed + 1;
  }
  var _e25;
  var a = 10;
  if (a) {
    _e25 = 1;
  } else {
    _e25 = 2;
  }
  if (! equal63(1, _e25)) {
    failed = failed + 1;
    var _e26;
    var _a2 = 10;
    if (_a2) {
      _e26 = 1;
    } else {
      _e26 = 2;
    }
    return("failed: expected " + str(1) + ", was " + str(_e26));
  } else {
    passed = passed + 1;
  }
  var _e27;
  if (true) {
    var _a3 = 1;
    _e27 = _a3;
  } else {
    _e27 = 2;
  }
  if (! equal63(1, _e27)) {
    failed = failed + 1;
    var _e28;
    if (true) {
      var _a4 = 1;
      _e28 = _a4;
    } else {
      _e28 = 2;
    }
    return("failed: expected " + str(1) + ", was " + str(_e28));
  } else {
    passed = passed + 1;
  }
  var _e29;
  if (false) {
    _e29 = 2;
  } else {
    var _a5 = 1;
    _e29 = _a5;
  }
  if (! equal63(1, _e29)) {
    failed = failed + 1;
    var _e30;
    if (false) {
      _e30 = 2;
    } else {
      var _a6 = 1;
      _e30 = _a6;
    }
    return("failed: expected " + str(1) + ", was " + str(_e30));
  } else {
    passed = passed + 1;
  }
  var _e31;
  if (false) {
    _e31 = 2;
  } else {
    var _e32;
    if (true) {
      var _a7 = 1;
      _e32 = _a7;
    }
    _e31 = _e32;
  }
  if (! equal63(1, _e31)) {
    failed = failed + 1;
    var _e33;
    if (false) {
      _e33 = 2;
    } else {
      var _e34;
      if (true) {
        var _a8 = 1;
        _e34 = _a8;
      }
      _e33 = _e34;
    }
    return("failed: expected " + str(1) + ", was " + str(_e33));
  } else {
    passed = passed + 1;
  }
  var _e35;
  if (false) {
    _e35 = 2;
  } else {
    var _e36;
    if (false) {
      _e36 = 3;
    } else {
      var _a9 = 1;
      _e36 = _a9;
    }
    _e35 = _e36;
  }
  if (! equal63(1, _e35)) {
    failed = failed + 1;
    var _e37;
    if (false) {
      _e37 = 2;
    } else {
      var _e38;
      if (false) {
        _e38 = 3;
      } else {
        var _a10 = 1;
        _e38 = _a10;
      }
      _e37 = _e38;
    }
    return("failed: expected " + str(1) + ", was " + str(_e37));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["case", function () {
  var x = 10;
  var _e = x;
  var _e39;
  if (9 === _e) {
    _e39 = 9;
  } else {
    var _e40;
    if (10 === _e) {
      _e40 = 2;
    } else {
      _e40 = 4;
    }
    _e39 = _e40;
  }
  if (! equal63(2, _e39)) {
    failed = failed + 1;
    var _e1 = x;
    var _e41;
    if (9 === _e1) {
      _e41 = 9;
    } else {
      var _e42;
      if (10 === _e1) {
        _e42 = 2;
      } else {
        _e42 = 4;
      }
      _e41 = _e42;
    }
    return("failed: expected " + str(2) + ", was " + str(_e41));
  } else {
    passed = passed + 1;
  }
  var _x540 = "z";
  var _e2 = _x540;
  var _e43;
  if ("z" === _e2) {
    _e43 = 9;
  } else {
    _e43 = 10;
  }
  if (! equal63(9, _e43)) {
    failed = failed + 1;
    var _e3 = _x540;
    var _e44;
    if ("z" === _e3) {
      _e44 = 9;
    } else {
      _e44 = 10;
    }
    return("failed: expected " + str(9) + ", was " + str(_e44));
  } else {
    passed = passed + 1;
  }
  var _e4 = _x540;
  var _e45;
  if ("a" === _e4) {
    _e45 = 1;
  } else {
    var _e46;
    if ("b" === _e4) {
      _e46 = 2;
    } else {
      _e46 = 7;
    }
    _e45 = _e46;
  }
  if (! equal63(7, _e45)) {
    failed = failed + 1;
    var _e5 = _x540;
    var _e47;
    if ("a" === _e5) {
      _e47 = 1;
    } else {
      var _e48;
      if ("b" === _e5) {
        _e48 = 2;
      } else {
        _e48 = 7;
      }
      _e47 = _e48;
    }
    return("failed: expected " + str(7) + ", was " + str(_e47));
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
  var _l = [];
  var i = 0;
  while (i < 2) {
    add(_l, i);
    i = i + 1;
  }
  if (! equal63([0, 1], _l)) {
    failed = failed + 1;
    var _l1 = [];
    var i = 0;
    while (i < 2) {
      add(_l1, i);
      i = i + 1;
    }
    return("failed: expected " + str([0, 1]) + ", was " + str(_l1));
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
  var _x551 = [];
  _x551.a = true;
  if (! equal63(false, empty63(_x551))) {
    failed = failed + 1;
    var _x552 = [];
    _x552.a = true;
    return("failed: expected " + str(false) + ", was " + str(empty63(_x552)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, empty63({a: true}))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(empty63({a: true})));
  } else {
    passed = passed + 1;
  }
  var _x553 = [];
  _x553.b = false;
  if (! equal63(false, empty63(_x553))) {
    failed = failed + 1;
    var _x554 = [];
    _x554.b = false;
    return("failed: expected " + str(false) + ", was " + str(empty63(_x554)));
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
  var t = {};
  t.foo = "bar";
  if (! equal63("bar", t.foo)) {
    failed = failed + 1;
    return("failed: expected " + str("bar") + ", was " + str(t.foo));
  } else {
    passed = passed + 1;
  }
  if (! equal63("bar", t.foo)) {
    failed = failed + 1;
    return("failed: expected " + str("bar") + ", was " + str(t.foo));
  } else {
    passed = passed + 1;
  }
  if (! equal63("bar", t.foo)) {
    failed = failed + 1;
    return("failed: expected " + str("bar") + ", was " + str(t.foo));
  } else {
    passed = passed + 1;
  }
  var k = "foo";
  if (! equal63("bar", t[k])) {
    failed = failed + 1;
    return("failed: expected " + str("bar") + ", was " + str(t[k]));
  } else {
    passed = passed + 1;
  }
  if (! equal63("bar", t["f" + "oo"])) {
    failed = failed + 1;
    return("failed: expected " + str("bar") + ", was " + str(t["f" + "oo"]));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["each", function () {
  var _x559 = [1, 2, 3];
  _x559.b = false;
  _x559.a = true;
  var t = _x559;
  var a = 0;
  var b = 0;
  var _o1 = t;
  var k = undefined;
  for (k in _o1) {
    var v = _o1[k];
    var _e49;
    if (numeric63(k)) {
      _e49 = parseInt(k);
    } else {
      _e49 = k;
    }
    var _k = _e49;
    if (number63(_k)) {
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
  var _o2 = t;
  var _i2 = undefined;
  for (_i2 in _o2) {
    var x = _o2[_i2];
    var _e50;
    if (numeric63(_i2)) {
      _e50 = parseInt(_i2);
    } else {
      _e50 = _i2;
    }
    var __i2 = _e50;
    _a11 = _a11 + 1;
  }
  if (! equal63(5, _a11)) {
    failed = failed + 1;
    return("failed: expected " + str(5) + ", was " + str(_a11));
  } else {
    passed = passed + 1;
  }
  var _x560 = [[1], [2]];
  _x560.b = [3];
  var _t = _x560;
  var _o3 = _t;
  var _i3 = undefined;
  for (_i3 in _o3) {
    var x = _o3[_i3];
    var _e51;
    if (numeric63(_i3)) {
      _e51 = parseInt(_i3);
    } else {
      _e51 = _i3;
    }
    var __i3 = _e51;
    if (! equal63(false, atom63(x))) {
      failed = failed + 1;
      return("failed: expected " + str(false) + ", was " + str(atom63(x)));
    } else {
      passed = passed + 1;
    }
  }
  var _o4 = _t;
  var _i4 = undefined;
  for (_i4 in _o4) {
    var x = _o4[_i4];
    var _e52;
    if (numeric63(_i4)) {
      _e52 = parseInt(_i4);
    } else {
      _e52 = _i4;
    }
    var __i4 = _e52;
    if (! equal63(false, atom63(x))) {
      failed = failed + 1;
      return("failed: expected " + str(false) + ", was " + str(atom63(x)));
    } else {
      passed = passed + 1;
    }
  }
  var _o5 = _t;
  var _i5 = undefined;
  for (_i5 in _o5) {
    var _id4 = _o5[_i5];
    var x = _id4[0];
    var _e53;
    if (numeric63(_i5)) {
      _e53 = parseInt(_i5);
    } else {
      _e53 = _i5;
    }
    var __i5 = _e53;
    if (! equal63(true, number63(x))) {
      failed = failed + 1;
      return("failed: expected " + str(true) + ", was " + str(number63(x)));
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
    catch (_e67) {
      return([false, _e67.message, _e67.stack]);
    }
  })(), 0, 2))) {
    failed = failed + 1;
    return("failed: expected " + str([true, 42]) + ", was " + str(cut((function () {
      try {
        return([true, 42]);
      }
      catch (_e68) {
        return([false, _e68.message, _e68.stack]);
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
    catch (_e69) {
      return([false, _e69.message, _e69.stack]);
    }
  })(), 0, 2))) {
    failed = failed + 1;
    return("failed: expected " + str([false, "foo"]) + ", was " + str(cut((function () {
      try {
        throw new Error("foo");
        return([true]);
      }
      catch (_e70) {
        return([false, _e70.message, _e70.stack]);
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
    catch (_e71) {
      return([false, _e71.message, _e71.stack]);
    }
  })(), 0, 2))) {
    failed = failed + 1;
    return("failed: expected " + str([false, "foo"]) + ", was " + str(cut((function () {
      try {
        throw new Error("foo");
        throw new Error("baz");
        return([true]);
      }
      catch (_e72) {
        return([false, _e72.message, _e72.stack]);
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
        catch (_e74) {
          return([false, _e74.message, _e74.stack]);
        }
      })(), 0, 2);
      throw new Error("baz");
      return([true]);
    }
    catch (_e73) {
      return([false, _e73.message, _e73.stack]);
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
          catch (_e76) {
            return([false, _e76.message, _e76.stack]);
          }
        })(), 0, 2);
        throw new Error("baz");
        return([true]);
      }
      catch (_e75) {
        return([false, _e75.message, _e75.stack]);
      }
    })(), 0, 2)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([true, 42], cut((function () {
    try {
      var _e54;
      if (true) {
        _e54 = 42;
      } else {
        throw new Error("baz");
        _e54 = undefined;
      }
      return([true, _e54]);
    }
    catch (_e77) {
      return([false, _e77.message, _e77.stack]);
    }
  })(), 0, 2))) {
    failed = failed + 1;
    return("failed: expected " + str([true, 42]) + ", was " + str(cut((function () {
      try {
        var _e55;
        if (true) {
          _e55 = 42;
        } else {
          throw new Error("baz");
          _e55 = undefined;
        }
        return([true, _e55]);
      }
      catch (_e78) {
        return([false, _e78.message, _e78.stack]);
      }
    })(), 0, 2)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([false, "baz"], cut((function () {
    try {
      var _e56;
      if (false) {
        _e56 = 42;
      } else {
        throw new Error("baz");
        _e56 = undefined;
      }
      return([true, _e56]);
    }
    catch (_e79) {
      return([false, _e79.message, _e79.stack]);
    }
  })(), 0, 2))) {
    failed = failed + 1;
    return("failed: expected " + str([false, "baz"]) + ", was " + str(cut((function () {
      try {
        var _e57;
        if (false) {
          _e57 = 42;
        } else {
          throw new Error("baz");
          _e57 = undefined;
        }
        return([true, _e57]);
      }
      catch (_e80) {
        return([false, _e80.message, _e80.stack]);
      }
    })(), 0, 2)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["let", function (_) {
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
    var _x604 = 9;
    _x604 = _x604 + 1;
    return("failed: expected " + str(10) + ", was " + str(_x604));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["let-when", function () {
  var _y = "a" === "b";
  var _e58;
  if (_y) {
    var frips = _y;
    _e58 = 19;
  }
  if (! equal63(undefined, _e58)) {
    failed = failed + 1;
    var _y1 = "a" === "b";
    var _e59;
    if (_y1) {
      var frips = _y1;
      _e59 = 19;
    }
    return("failed: expected " + str(undefined) + ", was " + str(_e59));
  } else {
    passed = passed + 1;
  }
  var _y2 = 20;
  var _e60;
  if (_y2) {
    var frips = _y2;
    _e60 = frips - 1;
  }
  if (! equal63(19, _e60)) {
    failed = failed + 1;
    var _y3 = 20;
    var _e61;
    if (_y3) {
      var frips = _y3;
      _e61 = frips - 1;
    }
    return("failed: expected " + str(19) + ", was " + str(_e61));
  } else {
    passed = passed + 1;
  }
  var _y4 = [19, 20];
  var _e62;
  if (_y4) {
    var _id5 = _y4;
    var a = _id5[0];
    var b = _id5[1];
    _e62 = b;
  }
  if (! equal63(20, _e62)) {
    failed = failed + 1;
    var _y5 = [19, 20];
    var _e63;
    if (_y5) {
      var _id6 = _y5;
      var a = _id6[0];
      var b = _id6[1];
      _e63 = b;
    }
    return("failed: expected " + str(20) + ", was " + str(_e63));
  } else {
    passed = passed + 1;
  }
  var _y6 = undefined;
  var _e64;
  if (_y6) {
    var _id7 = _y6;
    var a = _id7[0];
    var b = _id7[1];
    _e64 = b;
  }
  if (! equal63(undefined, _e64)) {
    failed = failed + 1;
    var _y7 = undefined;
    var _e65;
    if (_y7) {
      var _id8 = _y7;
      var a = _id8[0];
      var b = _id8[1];
      _e65 = b;
    }
    return("failed: expected " + str(undefined) + ", was " + str(_e65));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
var zzop = 99;
var zzap = 100;
var _zzop = 10;
var _zzap = _zzop + 10;
var _x608 = [1, 2, 3];
_x608.b = 20;
_x608.a = 10;
var _id9 = _x608;
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
  var _x626 = [];
  _x626.foo = 99;
  var _id18 = _x626;
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
  var _x628 = [99];
  _x628.baz = true;
  var _id22 = {foo: 42, bar: _x628};
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
  var _x630 = [20];
  _x630.foo = 17;
  var _x629 = [10, _x630];
  _x629.bar = [1, 2, 3];
  var _id24 = _x629;
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
add(tests, ["let-macro", function () {
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
add(tests, ["let-symbol", function () {
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
  setenv("zzz", {_stash: true, symbol: 42});
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
add(tests, ["let-unique", function () {
  var ham = unique("ham");
  var chap = unique("chap");
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
  var _ham = unique("ham");
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
  var _x688 = ["a"];
  _x688.b = true;
  if (! equal63(_x688, join(["a"], {b: true}))) {
    failed = failed + 1;
    var _x690 = ["a"];
    _x690.b = true;
    return("failed: expected " + str(_x690) + ", was " + str(join(["a"], {b: true})));
  } else {
    passed = passed + 1;
  }
  var _x692 = ["a", "b"];
  _x692.b = true;
  var _x694 = ["b"];
  _x694.b = true;
  if (! equal63(_x692, join(["a"], _x694))) {
    failed = failed + 1;
    var _x695 = ["a", "b"];
    _x695.b = true;
    var _x697 = ["b"];
    _x697.b = true;
    return("failed: expected " + str(_x695) + ", was " + str(join(["a"], _x697)));
  } else {
    passed = passed + 1;
  }
  var _x698 = ["a"];
  _x698.b = 10;
  var _x699 = ["a"];
  _x699.b = true;
  if (! equal63(_x698, join(_x699, {b: 10}))) {
    failed = failed + 1;
    var _x700 = ["a"];
    _x700.b = 10;
    var _x701 = ["a"];
    _x701.b = true;
    return("failed: expected " + str(_x700) + ", was " + str(join(_x701, {b: 10})));
  } else {
    passed = passed + 1;
  }
  var _x702 = [];
  _x702.b = 10;
  var _x703 = [];
  _x703.b = 10;
  if (! equal63(_x702, join({b: true}, _x703))) {
    failed = failed + 1;
    var _x704 = [];
    _x704.b = 10;
    var _x705 = [];
    _x705.b = 10;
    return("failed: expected " + str(_x704) + ", was " + str(join({b: true}, _x705)));
  } else {
    passed = passed + 1;
  }
  var _x706 = ["a"];
  _x706.b = 1;
  var _x707 = ["b"];
  _x707.c = 2;
  var t = join(_x706, _x707);
  if (! equal63(1, t.b)) {
    failed = failed + 1;
    return("failed: expected " + str(1) + ", was " + str(t.b));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, t.c)) {
    failed = failed + 1;
    return("failed: expected " + str(2) + ", was " + str(t.c));
  } else {
    passed = passed + 1;
  }
  if (! equal63("b", t[1])) {
    failed = failed + 1;
    return("failed: expected " + str("b") + ", was " + str(t[1]));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["reverse", function () {
  if (! equal63([], reverse([]))) {
    failed = failed + 1;
    return("failed: expected " + str([]) + ", was " + str(reverse([])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([3, 2, 1], reverse([1, 2, 3]))) {
    failed = failed + 1;
    return("failed: expected " + str([3, 2, 1]) + ", was " + str(reverse([1, 2, 3])));
  } else {
    passed = passed + 1;
  }
  var _x713 = [3, 2, 1];
  _x713.a = true;
  var _x714 = [1, 2, 3];
  _x714.a = true;
  if (! equal63(_x713, reverse(_x714))) {
    failed = failed + 1;
    var _x715 = [3, 2, 1];
    _x715.a = true;
    var _x716 = [1, 2, 3];
    _x716.a = true;
    return("failed: expected " + str(_x715) + ", was " + str(reverse(_x716)));
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
  var _x726 = [2, 3, 4];
  _x726.a = 5;
  var _x727 = [1, 2, 3];
  _x727.a = 4;
  if (! equal63(_x726, map(function (_) {
    return(_ + 1);
  }, _x727))) {
    failed = failed + 1;
    var _x728 = [2, 3, 4];
    _x728.a = 5;
    var _x729 = [1, 2, 3];
    _x729.a = 4;
    return("failed: expected " + str(_x728) + ", was " + str(map(function (_) {
      return(_ + 1);
    }, _x729)));
  } else {
    passed = passed + 1;
  }
  var _x730 = [];
  _x730.a = true;
  var _x731 = [];
  _x731.a = true;
  if (! equal63(_x730, map(function (_) {
    return(_);
  }, _x731))) {
    failed = failed + 1;
    var _x732 = [];
    _x732.a = true;
    var _x733 = [];
    _x733.a = true;
    return("failed: expected " + str(_x732) + ", was " + str(map(function (_) {
      return(_);
    }, _x733)));
  } else {
    passed = passed + 1;
  }
  var _x734 = [];
  _x734.b = false;
  var _x735 = [];
  _x735.b = false;
  if (! equal63(_x734, map(function (_) {
    return(_);
  }, _x735))) {
    failed = failed + 1;
    var _x736 = [];
    _x736.b = false;
    var _x737 = [];
    _x737.b = false;
    return("failed: expected " + str(_x736) + ", was " + str(map(function (_) {
      return(_);
    }, _x737)));
  } else {
    passed = passed + 1;
  }
  var _x738 = [];
  _x738.b = false;
  _x738.a = true;
  var _x739 = [];
  _x739.b = false;
  _x739.a = true;
  if (! equal63(_x738, map(function (_) {
    return(_);
  }, _x739))) {
    failed = failed + 1;
    var _x740 = [];
    _x740.b = false;
    _x740.a = true;
    var _x741 = [];
    _x741.b = false;
    _x741.a = true;
    return("failed: expected " + str(_x740) + ", was " + str(map(function (_) {
      return(_);
    }, _x741)));
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
  var _x746 = [2, 4, 6];
  _x746.b = 8;
  var _x747 = [1, 2, 3, 4, 5, 6];
  _x747.b = 8;
  _x747.a = 7;
  if (! equal63(_x746, map(evens, _x747))) {
    failed = failed + 1;
    var _x748 = [2, 4, 6];
    _x748.b = 8;
    var _x749 = [1, 2, 3, 4, 5, 6];
    _x749.b = 8;
    _x749.a = 7;
    return("failed: expected " + str(_x748) + ", was " + str(map(evens, _x749)));
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
  var _x775 = [2];
  _x775.a = true;
  var _x776 = [1, 2];
  _x776.a = true;
  if (! equal63(_x775, cut(_x776, 1))) {
    failed = failed + 1;
    var _x777 = [2];
    _x777.a = true;
    var _x778 = [1, 2];
    _x778.a = true;
    return("failed: expected " + str(_x777) + ", was " + str(cut(_x778, 1)));
  } else {
    passed = passed + 1;
  }
  var _x779 = [];
  _x779.b = 2;
  _x779.a = true;
  var _x780 = [];
  _x780.b = 2;
  _x780.a = true;
  if (! equal63(_x779, cut(_x780))) {
    failed = failed + 1;
    var _x781 = [];
    _x781.b = 2;
    _x781.a = true;
    var _x782 = [];
    _x782.b = 2;
    _x782.a = true;
    return("failed: expected " + str(_x781) + ", was " + str(cut(_x782)));
  } else {
    passed = passed + 1;
  }
  var t = [1, 2, 3];
  if (! equal63([], cut(t, _35(t)))) {
    failed = failed + 1;
    return("failed: expected " + str([]) + ", was " + str(cut(t, _35(t))));
  } else {
    passed = passed + 1;
  }
  var _x784 = [1, 2, 3];
  _x784.a = true;
  var _t1 = _x784;
  var _x785 = [];
  _x785.a = true;
  if (! equal63(_x785, cut(_t1, _35(_t1)))) {
    failed = failed + 1;
    var _x786 = [];
    _x786.a = true;
    return("failed: expected " + str(_x786) + ", was " + str(cut(_t1, _35(_t1))));
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
add(tests, ["reduce", function (_0, _1) {
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
add(tests, ["keep", function (_) {
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
  if (! equal63([[1], [2, 3]], keep(some63, [[], [1], [], [2, 3]]))) {
    failed = failed + 1;
    return("failed: expected " + str([[1], [2, 3]]) + ", was " + str(keep(some63, [[], [1], [], [2, 3]])));
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
  var _x850 = [2, 4, 6];
  _x850.b = 8;
  var _x851 = [1, 2, 3, 4, 5, 6];
  _x851.b = 8;
  _x851.a = 7;
  if (! equal63(_x850, keep(even63, _x851))) {
    failed = failed + 1;
    var _x852 = [2, 4, 6];
    _x852.b = 8;
    var _x853 = [1, 2, 3, 4, 5, 6];
    _x853.b = 8;
    _x853.a = 7;
    return("failed: expected " + str(_x852) + ", was " + str(keep(even63, _x853)));
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
add(tests, ["find", function (_) {
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
  var _x866 = [2, 4];
  _x866.foo = 7;
  if (! equal63(true, find(function (_) {
    return(_ === 7);
  }, _x866))) {
    failed = failed + 1;
    var _x867 = [2, 4];
    _x867.foo = 7;
    return("failed: expected " + str(true) + ", was " + str(find(function (_) {
      return(_ === 7);
    }, _x867)));
  } else {
    passed = passed + 1;
  }
  var _x868 = [2, 4];
  _x868.bar = true;
  if (! equal63(true, find(function (_) {
    return(_ === true);
  }, _x868))) {
    failed = failed + 1;
    var _x869 = [2, 4];
    _x869.bar = true;
    return("failed: expected " + str(true) + ", was " + str(find(function (_) {
      return(_ === true);
    }, _x869)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, in63(7, [2, 4, 7]))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(in63(7, [2, 4, 7])));
  } else {
    passed = passed + 1;
  }
  var _x872 = [2, 4];
  _x872.foo = 7;
  if (! equal63(true, in63(7, _x872))) {
    failed = failed + 1;
    var _x873 = [2, 4];
    _x873.foo = 7;
    return("failed: expected " + str(true) + ", was " + str(in63(7, _x873)));
  } else {
    passed = passed + 1;
  }
  var _x874 = [2, 4];
  _x874.bar = true;
  if (! equal63(true, in63(true, _x874))) {
    failed = failed + 1;
    var _x875 = [2, 4];
    _x875.bar = true;
    return("failed: expected " + str(true) + ", was " + str(in63(true, _x875)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["first", function (_) {
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
  if (! equal63(true, string63("abc"))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(string63("abc")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, string63(17))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(string63(17)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, string63(["a"]))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(string63(["a"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, string63(true))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(string63(true)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, string63({}))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(string63({})));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, number63("abc"))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(number63("abc")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, number63(17))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(number63(17)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, number63(["a"]))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(number63(["a"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, number63(true))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(number63(true)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, number63({}))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(number63({})));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, boolean63("abc"))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(boolean63("abc")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, boolean63(17))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(boolean63(17)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, boolean63(["a"]))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(boolean63(["a"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, boolean63(true))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(boolean63(true)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, boolean63({}))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(boolean63({})));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, atom63(undefined))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(atom63(undefined)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, atom63("abc"))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(atom63("abc")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, atom63(42))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(atom63(42)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, atom63(true))) {
    failed = failed + 1;
    return("failed: expected " + str(true) + ", was " + str(atom63(true)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, atom63(function () {
    return([]);
  }))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(atom63(function () {
      return([]);
    })));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, atom63([1]))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(atom63([1])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, atom63({}))) {
    failed = failed + 1;
    return("failed: expected " + str(false) + ", was " + str(atom63({})));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["apply", function (_0, _1) {
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
  var t = [1];
  t.foo = 17;
  if (! equal63(17, apply(function () {
    var a = unstash(Array.prototype.slice.call(arguments, 0));
    return(a.foo);
  }, t))) {
    failed = failed + 1;
    return("failed: expected " + str(17) + ", was " + str(apply(function () {
      var a = unstash(Array.prototype.slice.call(arguments, 0));
      return(a.foo);
    }, t)));
  } else {
    passed = passed + 1;
  }
  var _x909 = [];
  _x909.foo = 42;
  if (! equal63(42, apply(function () {
    var _r183 = unstash(Array.prototype.slice.call(arguments, 0));
    var _id27 = _r183;
    var foo = _id27.foo;
    return(foo);
  }, _x909))) {
    failed = failed + 1;
    var _x910 = [];
    _x910.foo = 42;
    return("failed: expected " + str(42) + ", was " + str(apply(function () {
      var _r184 = unstash(Array.prototype.slice.call(arguments, 0));
      var _id28 = _r184;
      var foo = _id28.foo;
      return(foo);
    }, _x910)));
  } else {
    passed = passed + 1;
  }
  var _x913 = [];
  _x913.foo = 42;
  if (! equal63(42, apply(function (_x911) {
    var _id29 = _x911;
    var foo = _id29.foo;
    return(foo);
  }, [_x913]))) {
    failed = failed + 1;
    var _x916 = [];
    _x916.foo = 42;
    return("failed: expected " + str(42) + ", was " + str(apply(function (_x914) {
      var _id30 = _x914;
      var foo = _id30.foo;
      return(foo);
    }, [_x916])));
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
add(tests, ["call", function () {
  var f = function () {
    return(42);
  };
  if (! equal63(42, call(f))) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str(call(f)));
  } else {
    passed = passed + 1;
  }
  var fs = [function () {
    return(1);
  }, function () {
    return(10);
  }];
  if (! equal63([1, 10], map(call, fs))) {
    failed = failed + 1;
    return("failed: expected " + str([1, 10]) + ", was " + str(map(call, fs)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["parameters", function () {
  if (! equal63(42, (function (_x941) {
    var _id31 = _x941;
    var a = _id31[0];
    return(a);
  })([42]))) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str((function (_x943) {
      var _id32 = _x943;
      var a = _id32[0];
      return(a);
    })([42])));
  } else {
    passed = passed + 1;
  }
  var f = function (a, _x945) {
    var _id33 = _x945;
    var b = _id33[0];
    var c = _id33[1];
    return([a, b, c]);
  };
  if (! equal63([1, 2, 3], f(1, [2, 3]))) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2, 3]) + ", was " + str(f(1, [2, 3])));
  } else {
    passed = passed + 1;
  }
  var _f = function (a, _x951) {
    var _id34 = _x951;
    var b = _id34[0];
    var c = cut(_id34, 1);
    var _r196 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id35 = _r196;
    var d = cut(_id35, 0);
    return([a, b, c, d]);
  };
  if (! equal63([1, 2, [3, 4], [5, 6, 7]], _f(1, [2, 3, 4], 5, 6, 7))) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2, [3, 4], [5, 6, 7]]) + ", was " + str(_f(1, [2, 3, 4], 5, 6, 7)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([3, 4], (function (a, b) {
    var _r197 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id36 = _r197;
    var c = cut(_id36, 0);
    return(c);
  })(1, 2, 3, 4))) {
    failed = failed + 1;
    return("failed: expected " + str([3, 4]) + ", was " + str((function (a, b) {
      var _r198 = unstash(Array.prototype.slice.call(arguments, 2));
      var _id37 = _r198;
      var c = cut(_id37, 0);
      return(c);
    })(1, 2, 3, 4)));
  } else {
    passed = passed + 1;
  }
  var _f1 = function (w, _x963) {
    var _id38 = _x963;
    var x = _id38[0];
    var y = cut(_id38, 1);
    var _r199 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id39 = _r199;
    var z = cut(_id39, 0);
    return([y, z]);
  };
  if (! equal63([[3, 4], [5, 6, 7]], _f1(1, [2, 3, 4], 5, 6, 7))) {
    failed = failed + 1;
    return("failed: expected " + str([[3, 4], [5, 6, 7]]) + ", was " + str(_f1(1, [2, 3, 4], 5, 6, 7)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, (function () {
    var _r200 = unstash(Array.prototype.slice.call(arguments, 0));
    var _id40 = _r200;
    var foo = _id40.foo;
    return(foo);
  })({_stash: true, foo: 42}))) {
    failed = failed + 1;
    return("failed: expected " + str(42) + ", was " + str((function () {
      var _r201 = unstash(Array.prototype.slice.call(arguments, 0));
      var _id41 = _r201;
      var foo = _id41.foo;
      return(foo);
    })({_stash: true, foo: 42})));
  } else {
    passed = passed + 1;
  }
  var _x974 = [];
  _x974.foo = 42;
  if (! equal63(42, (function (_x973) {
    var _id42 = _x973;
    var foo = _id42.foo;
    return(foo);
  })(_x974))) {
    failed = failed + 1;
    var _x976 = [];
    _x976.foo = 42;
    return("failed: expected " + str(42) + ", was " + str((function (_x975) {
      var _id43 = _x975;
      var foo = _id43.foo;
      return(foo);
    })(_x976)));
  } else {
    passed = passed + 1;
  }
  var _f2 = function (a, _x977) {
    var _id44 = _x977;
    var foo = _id44.foo;
    var _r204 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id45 = _r204;
    var b = _id45.bar;
    return([a, b, foo]);
  };
  var _x980 = [];
  _x980.foo = 42;
  if (! equal63([10, 20, 42], _f2(10, _x980, {_stash: true, bar: 20}))) {
    failed = failed + 1;
    var _x982 = [];
    _x982.foo = 42;
    return("failed: expected " + str([10, 20, 42]) + ", was " + str(_f2(10, _x982, {_stash: true, bar: 20})));
  } else {
    passed = passed + 1;
  }
  var _f3 = function () {
    var args = unstash(Array.prototype.slice.call(arguments, 0));
    return(args);
  };
  if (! equal63([1, 2, 3], _f3(1, 2, 3))) {
    failed = failed + 1;
    return("failed: expected " + str([1, 2, 3]) + ", was " + str(_f3(1, 2, 3)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
if (typeof(_x985) === "undefined") {
  _x985 = true;
  run_tests();
}
