/**
 * Rhino-based test suite.
 */

load('assets/jsunittest_rhino.js');

// Load Hybrid
load('../build/hybrid.js');

// Prepare a test logger to collect results
var testLogger = new JsUnitTest.Unit.Logger();

// Load test cases
load(
    'cases/hybrid.js',
    'cases/event.js',
    'cases/stop.js',
    'cases/population.js',
    'cases/individual.js',
    'cases/fitness.js',
    'cases/selection.js',
    'cases/reproduction.js',
    'cases/util.js'
);

testLogger.overallSummary();
System.exit(testLogger.hasErrors() ? 1 : 0);
