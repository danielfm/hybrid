/**
 * Hybrid Test Suite.
 */

// Bootstrap Jsunittest and Hybrid
load('assets/env.js');
load('assets/jsunittest.js');
load('assets/jsunittest-hamcrest.js');
load('assets/jscontext.js');
load('../build/hybrid.js');

// Load test stubs
load('testStubs.js');

// Test logger used to collect the results
var testLogger = new Test.Unit.RhinoTextLogger();

// Test runner used to run the test cases
var TestRunner = Test.Unit.SimpleRunner;

// Runs the specified test cases
Test.loadTestCasesFromDirectory('cases');

// Prints the result and exits
testLogger.printSummaryAndExit();

