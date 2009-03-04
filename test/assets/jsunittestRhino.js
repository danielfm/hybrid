/*  Jsunittest for Rhino, version 0.1
 *  (c) 2009 Daniel Fernandes Martins
 *
 *  Based on Jsunittest, version 0.7.2
 *  (c) 2008 Dr Nic Williams
 *
 *  Jsunittest is freely distributable under
 *  the terms of an MIT-style license.
 *
 *--------------------------------------------------------------------------*/

importPackage(java.lang);

function print(obj) {
  return System.out.print(obj);
}

function println(obj) {
  return System.out.println(obj);
}

var JsUnitTest = {
  Unit: {},
  inspect: function(object) {
    try {
      if (typeof object == "undefined") return 'undefined';
      if (object === null) return 'null';
      if (typeof object == "string") {
        var useDoubleQuotes = arguments[1];
        var escapedString = this.gsub(object, /[\x00-\x1f\\]/, function(match) {
          var character = String.specialChar[match[0]];
          return character ? character : '\\u00' + match[0].charCodeAt().toPaddedString(2, 16);
        });
        if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
        return "'" + escapedString.replace(/'/g, '\\\'') + "'";
      };
      return String(object);
    } catch (e) {
      if (e instanceof RangeError) return '...';
      throw e;
    }
  },
  gsub: function(source, pattern, replacement) {
    var result = '', match;
    replacement = arguments.callee.prepareReplacement(replacement);

    while (source.length > 0) {
      if (match = source.match(pattern)) {
        result += source.slice(0, match.index);
        result += JsUnitTest.String.interpret(replacement(match));
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
  },
  scan: function(source, pattern, iterator) {
    this.gsub(source, pattern, iterator);
    return String(source);
  },
  arrayfromargs: function(args) {
  	var myarray = new Array();
  	var i;

  	for (i=0;i<args.length;i++)
  		myarray[i] = args[i];

  	return myarray;
  },
  hashToSortedArray: function(hash) {
    var results = [];
    for (key in hash) {
      results.push([key, hash[key]]);
    }
    return results.sort();
  },
  flattenArray: function(array) {
    var results = arguments[1] || [];
    for (var i=0; i < array.length; i++) {
      var object = array[i];
      if (object != null && typeof object == "object" &&
        'splice' in object && 'join' in object) {
          this.flattenArray(object, results);
      } else {
        results.push(object);
      }
    };
    return results;
  },

  String: {
    interpret: function(value) {
      return value == null ? '' : String(value);
    }
  }
};

JsUnitTest.gsub.prepareReplacement = function(replacement) {
  if (typeof replacement == "function") return replacement;
  var template = new Template(replacement);
  return function(match) { return template.evaluate(match) };
};

JsUnitTest.Version = '0.7.2';

JsUnitTest.Template = function(template, pattern) {
  this.template = template; //template.toString();
  this.pattern = pattern || JsUnitTest.Template.Pattern;
};

JsUnitTest.Template.prototype.evaluate = function(object) {
  if (typeof object.toTemplateReplacements == "function")
    object = object.toTemplateReplacements();

  return JsUnitTest.gsub(this.template, this.pattern, function(match) {
    if (object == null) return '';

    var before = match[1] || '';
    if (before == '\\') return match[2];

    var ctx = object, expr = match[3];
    var pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
    match = pattern.exec(expr);
    if (match == null) return before;

    while (match != null) {
      var comp = (match[1].indexOf('[]') === 0) ? match[2].gsub('\\\\]', ']') : match[1];
      ctx = ctx[comp];
      if (null == ctx || '' == match[3]) break;
      expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
      match = pattern.exec(expr);
    }

    return before + JsUnitTest.String.interpret(ctx);
  });
}

JsUnitTest.Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;

JsUnitTest.Unit.Logger = function() {};

JsUnitTest.Unit.Logger.prototype.startTestCase = function(name) {
  println('------------------------------------------------------------');
  println('');
  
  if (name) println('Running ' + name + ' Test Case:');
};

JsUnitTest.Unit.Logger.prototype.start = function(testName) {
  print('  ' + testName + '... ');
};

JsUnitTest.Unit.Logger.prototype.finish = function(status, summary) {
  println(status);
};

JsUnitTest.Unit.Logger.prototype.summary = function(summary) {
  println('Summary: ' + summary);
  println('');
};

JsUnitTest.Unit.MessageTemplate = function(string) {
  var parts = [];
  var str = JsUnitTest.scan((string || ''), /(?=[^\\])\?|(?:\\\?|[^\?])+/, function(part) {
    parts.push(part[0]);
  });
  this.parts = parts;
};

JsUnitTest.Unit.MessageTemplate.prototype.evaluate = function(params) {
  var results = [];
  for (var i=0; i < this.parts.length; i++) {
    var part = this.parts[i];
    var result = (part == '?') ? JsUnitTest.inspect(params.shift()) : part.replace(/\\\?/, '?');
    results.push(result);
  };
  return results.join('');
};

JsUnitTest.Unit.Assertions = {
  buildMessage: function(message, template) {
    var args = JsUnitTest.arrayfromargs(arguments).slice(2);
    return (message ? message + '\n' : '') +
      new JsUnitTest.Unit.MessageTemplate(template).evaluate(args);
  },

  flunk: function(message) {
    this.assertBlock(message || 'Flunked', function() { return false });
  },

  assertBlock: function(message, block) {
    try {
      block.call(this) ? this.pass() : this.fail(message);
    } catch(e) { this.error(e) }
  },

  assert: function(expression, message) {
    message = this.buildMessage(message || 'assert', 'got <?>', expression);
    this.assertBlock(message, function() { return expression });
  },
  
  assertFalse: function(expression, message) {
    message = this.buildMessage(message || 'assertFalse', 'got <?>', expression);
    this.assertBlock(message, function() { return expression == false });
  },
  
  assertTrue: function(expression, message) {
    message = this.buildMessage(message || 'assertTrue', 'got <?>', expression);
    this.assertBlock(message, function() { return expression == true });
  },

  assertEqual: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertEqual', 'expected <?>, actual: <?>', expected, actual);
    this.assertBlock(message, function() { return expected == actual });
  },

  assertNotEqual: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertNotEqual', 'expected <?>, actual: <?>', expected, actual);
    this.assertBlock(message, function() { return expected != actual });
  },

  assertEnumEqual: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertEnumEqual', 'expected <?>, actual: <?>', expected, actual);
    var expected_array = JsUnitTest.flattenArray(expected);
    var actual_array   = JsUnitTest.flattenArray(actual);
    this.assertBlock(message, function() {
      if (expected_array.length == actual_array.length) {
        for (var i=0; i < expected_array.length; i++) {
          if (expected_array[i] != actual_array[i]) return false;
        };
        return true;
      }
      return false;
    });
  },

  assertEnumNotEqual: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertEnumNotEqual', '<?> was the same as <?>', expected, actual);
    var expected_array = JsUnitTest.flattenArray(expected);
    var actual_array   = JsUnitTest.flattenArray(actual);
    this.assertBlock(message, function() {
      if (expected_array.length == actual_array.length) {
        for (var i=0; i < expected_array.length; i++) {
          if (expected_array[i] != actual_array[i]) return true;
        };
        return false;
      }
      return true;
    });
  },

  assertHashEqual: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertHashEqual', 'expected <?>, actual: <?>', expected, actual);
    var expected_array = JsUnitTest.flattenArray(JsUnitTest.hashToSortedArray(expected));
    var actual_array   = JsUnitTest.flattenArray(JsUnitTest.hashToSortedArray(actual));
    var block = function() {
      if (expected_array.length == actual_array.length) {
        for (var i=0; i < expected_array.length; i++) {
          if (expected_array[i] != actual_array[i]) return false;
        };
        return true;
      }
      return false;
    };
    this.assertBlock(message, block);
  },

  assertHashNotEqual: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertHashNotEqual', '<?> was the same as <?>', expected, actual);
    var expected_array = JsUnitTest.flattenArray(JsUnitTest.hashToSortedArray(expected));
    var actual_array   = JsUnitTest.flattenArray(JsUnitTest.hashToSortedArray(actual));
    // from now we recursively zip & compare nested arrays
    var block = function() {
      if (expected_array.length == actual_array.length) {
        for (var i=0; i < expected_array.length; i++) {
          if (expected_array[i] != actual_array[i]) return true;
        };
        return false;
      }
      return true;
    };
    this.assertBlock(message, block);
  },

  assertIdentical: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertIdentical', 'expected <?>, actual: <?>', expected, actual);
    this.assertBlock(message, function() { return expected === actual });
  },

  assertNotIdentical: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertNotIdentical', 'expected <?>, actual: <?>', expected, actual);
    this.assertBlock(message, function() { return expected !== actual });
  },

  assertNull: function(obj, message) {
    message = this.buildMessage(message || 'assertNull', 'got <?>', obj);
    this.assertBlock(message, function() { return obj === null });
  },

  assertNotNull: function(obj, message) {
    message = this.buildMessage(message || 'assertNotNull', 'got <?>', obj);
    this.assertBlock(message, function() { return obj !== null });
  },

  assertUndefined: function(obj, message) {
    message = this.buildMessage(message || 'assertUndefined', 'got <?>', obj);
    this.assertBlock(message, function() { return typeof obj == "undefined" });
  },

  assertNotUndefined: function(obj, message) {
    message = this.buildMessage(message || 'assertNotUndefined', 'got <?>', obj);
    this.assertBlock(message, function() { return typeof obj != "undefined" });
  },

  assertNullOrUndefined: function(obj, message) {
    message = this.buildMessage(message || 'assertNullOrUndefined', 'got <?>', obj);
    this.assertBlock(message, function() { return obj == null });
  },

  assertNotNullOrUndefined: function(obj, message) {
    message = this.buildMessage(message || 'assertNotNullOrUndefined', 'got <?>', obj);
    this.assertBlock(message, function() { return obj != null });
  },

  assertMatch: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertMatch', 'regex <?> did not match <?>', expected, actual);
    this.assertBlock(message, function() { return new RegExp(expected).exec(actual) });
  },

  assertNoMatch: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertNoMatch', 'regex <?> matched <?>', expected, actual);
    this.assertBlock(message, function() { return !(new RegExp(expected).exec(actual)) });
  },

  assertInstanceOf: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertInstanceOf', '<?> was not an instance of the expected type', actual);
    this.assertBlock(message, function() { return actual instanceof expected });
  },

  assertNotInstanceOf: function(expected, actual, message) {
    message = this.buildMessage(message || 'assertNotInstanceOf', '<?> was an instance of the expected type', actual);
    this.assertBlock(message, function() { return !(actual instanceof expected) });
  },

  assertRespondsTo: function(method, obj, message) {
    message = this.buildMessage(message || 'assertRespondsTo', 'object doesn\'t respond to <?>', method);
    this.assertBlock(message, function() { return (method in obj && typeof obj[method] == 'function') });
  },

  assertRaise: function(exception, method, message) {
    message = this.buildMessage(message || 'assertRaise', '<?> exception expected but none was raised', exception);
    var block = function() {
      try {
        method();
        return false;
      } catch(e) {
        if (e instanceof exception) return true;
        else throw e;
      }
    };
    this.assertBlock(message, block);
  },

  assertNothingRaised: function(method, message) {
    try {
      method();
      this.assert(true, "Expected nothing to be thrown");
    } catch(e) {
      message = this.buildMessage(message || 'assertNothingRaised', '<?> was thrown when nothing was expected.', e);
      this.flunk(message);
    }
  }
};
JsUnitTest.Unit.Runner = function(testcases, options) {
  var argumentOptions = arguments[1] || {};
  var options = this.options = {};
  options.callback = ('callback' in argumentOptions) ? argumentOptions.callback : null;

  var argumentOptions = arguments[1] || {};
  var options = this.options = {};
  options.callback = argumentOptions.callback;

  this.tests = this.getTests(testcases);
  this.currentTest = 0;
  this.logger = new JsUnitTest.Unit.Logger();

  this.logger.startTestCase(testcases.name);

  var results = [];
  this.runTests(results);

  if (options.callback && typeof options.callback == 'function') {
    options.callback(results);
  }
};

JsUnitTest.Unit.Runner.prototype.getTests = function(testcases) {
  var tests = [], options = this.options;
  if (options.tests) tests = options.tests;
  else if (options.test) tests = [option.test];
  else {
    for (testname in testcases) {
      if (testname.match(/^test/)) tests.push(testname);
    }
  }
  var results = [];
  for (var i=0; i < tests.length; i++) {
    var test = tests[i];
    if (testcases[test])
      results.push(
        new JsUnitTest.Unit.Testcase(test, testcases[test], testcases.setup, testcases.teardown)
      );
  };
  return results;
};

JsUnitTest.Unit.Runner.prototype.getResult = function() {
  var results = {
    tests: this.tests.length,
    assertions: 0,
    failures: 0,
    errors: 0,
  };

  for (var i=0; i < this.tests.length; i++) {
    var test = this.tests[i];
    results.assertions += test.assertions;
    results.failures   += test.failures;
    results.errors     += test.errors;
  };
  return results;
};

JsUnitTest.Unit.Runner.prototype.runTests = function(finished) {
  var test = this.tests[this.currentTest], actions;

  if (!test) return this.finish();
  this.logger.start(test.name);
  test.run();

  this.logger.finish(test.status(), test.summary());
  this.currentTest++;

  finished.push(test);

  // tail recursive, hopefully the browser will skip the stackframe
  this.runTests(finished);
};

JsUnitTest.Unit.Runner.prototype.finish = function() {
  this.logger.summary(this.summary());
};

JsUnitTest.Unit.Runner.prototype.summary = function() {
  return new JsUnitTest.Template('#{tests} tests, #{assertions} assertions, #{failures} failures, #{errors} errors').evaluate(this.getResult());
};
JsUnitTest.Unit.Testcase = function(name, test, setup, teardown) {
  this.name           = name;
  this.test           = test     || function() {};
  this.setup          = setup    || function() {};
  this.teardown       = teardown || function() {};
  this.messages       = [];
  this.actions        = {};
};
// import JsUnitTest.Unit.Assertions

for (method in JsUnitTest.Unit.Assertions) {
  JsUnitTest.Unit.Testcase.prototype[method] = JsUnitTest.Unit.Assertions[method];
}

JsUnitTest.Unit.Testcase.prototype.assertions        = 0;
JsUnitTest.Unit.Testcase.prototype.failures          = 0;
JsUnitTest.Unit.Testcase.prototype.errors            = 0;

JsUnitTest.Unit.Testcase.prototype.run = function(rethrow) {
  try {
    try {
      this.setup();
      this.test();
    } finally {
      this.teardown();
    }
  }
  catch(e) {
    if (rethrow) throw e;
    this.error(e, this);
  }
};

JsUnitTest.Unit.Testcase.prototype.summary = function() {
  var msg = '#{assertions} assertions, #{failures} failures, #{errors} errors\n';
  return new JsUnitTest.Template(msg).evaluate(this) +
    this.messages.join("\n");
};

JsUnitTest.Unit.Testcase.prototype.pass = function() {
  this.assertions++;
};

JsUnitTest.Unit.Testcase.prototype.fail = function(message) {
  this.failures++;
  var line = "";
  try {
    throw new Error("stack");
  } catch(e){
    line = (/\.html:(\d+)/.exec(e.stack || '') || ['',''])[1];
  }
  this.messages.push("Failure: " + message + (line ? " Line #" + line : ""));
};

JsUnitTest.Unit.Testcase.prototype.info = function(message) {
  this.messages.push("Info: " + message);
};

JsUnitTest.Unit.Testcase.prototype.error = function(error, test) {
  this.errors++;
  this.actions['retry with throw'] = function() { test.run(true) };
  this.messages.push(error.name + ": "+ error.message + "(" + JsUnitTest.inspect(error) + ")");
};

JsUnitTest.Unit.Testcase.prototype.status = function() {
  if (this.errors > 0) return 'ERROR!';
  if (this.failures > 0) return 'FAILED!';
  return 'ok';
};

Test = JsUnitTest
