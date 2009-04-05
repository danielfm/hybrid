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


var testCasesDirectory = 'cases';
var testCases = [].concat(arguments);

// Bootstrap Jsunittest and Hybrid
load('assets/jsunittest_rhino.js');
load('../build/hybrid.js');

// Load test stubs
load('testStubs.js');

// If no test case is specified, all test cases are selected
testCases = JsUnitTest.loadTestCasesFromDirectory(arguments, testCasesDirectory);

// Test logger used to collect the results
var testLogger = new JsUnitTest.Unit.Logger();

// Runs the specified test cases
for (var i = 0; i < testCases.length; i++) {
    load(testCasesDirectory + '/' + testCases[i]);
}

// Prints the result and exits
testLogger.overallSummary();
System.exit(testLogger.hasErrors() ? 1 : 0);
