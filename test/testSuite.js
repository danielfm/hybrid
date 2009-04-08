/**
 * Hybrid Test Suite.
 */

var testingWithRhino = true;
var testCasesDirectory = 'cases';

// Bootstrap Jsunittest and Hybrid
load('assets/env.js');
load('assets/jsunittest.js');
load('../build/hybrid.js');

// Load test stubs
load('testStubs.js');

// If no test case is specified, all test cases are selected

// Test logger used to collect the results
var testLogger = new JsUnitTest.Unit.RhinoTextLogger();

// Runs the specified test cases
JsUnitTest.loadTestCasesFromDirectory(testCasesDirectory);

// Prints the result and exits
testLogger.overallSummary();
System.exit(testLogger.hasErrors() ? 1 : 0);

