/**
 * Hybrid test runner.
 *
 * Usage:
 * jrunscript testSuite.js
 *     - Runs all test cases.
 *
 * jrunscript testSuite.js case1.js case2.js caseN.js
 *     - Runs the specified test cases.
 */
var testCases = [].concat(arguments);

load('assets/jsunittest_rhino.js');
load('../build/hybrid.js');

load('util.js');

// If no test case is specified, all test cases are selected
if (!arguments.length) {
    var cases = new java.io.File('cases').listFiles();
    for (var i = 0; i < cases.length; i++) {
        var name = cases[i].name;
        if (name.search(/.*.js$/i) >= 0) {
            testCases.push(name);
        }
    }
}

// Test logger used to collect the results
var testLogger = new JsUnitTest.Unit.Logger();

// Runs the specified test cases
for (var i = 0; i < testCases.length; i++) {
    load('cases/' + testCases[i]);
}

// Prints the result and exits
testLogger.overallSummary();
System.exit(testLogger.hasErrors() ? 1 : 0);
