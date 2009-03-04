// Load JsUnitTest for Rhino
load('assets/jsunittestRhino.js');

// Load Hybrid
load('../build/hybrid.js');

// Function to collect test results
var assertions = failures = errors = 0;
function testCallback(results) {
  for (var i = 0; i < results.length; i++) {
    var test = results[i];
    assertions += test.assertions;
    failures += test.failures;
    errors += test.errors;
  }
}

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

println('Test Suite summary');
println('------------------');
println('Assertions : ' + assertions);
println('Failures   : ' + failures);
println('Errors     : ' + errors);

// Exit with code 1 to warn the build script about failing tests
if (errors + failures > 0) {
  System.exit(1);
}
