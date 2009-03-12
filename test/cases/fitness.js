var Fitness_FitnessEvaluator = function() {
    Fitness_FitnessEvaluator.superClass.apply(this, arguments);

    this.evaluate = function(individual, population) {
        if (!individual) {
            throw "Individual should not be null";
        }
        if (!population) {
            throw "Population should not be null";
        }

        return individual.number;
    };
};
Fitness_FitnessEvaluator = new Hybrid.Class({
    extend: Hybrid.Fitness.Evaluator,
    constructor: Fitness_FitnessEvaluator
});

var TestCases = {
    name: 'Fitness',

    setup: function() {
        this.fitnessEvaluator = new Fitness_FitnessEvaluator();
        this.fitnessComparator = new Hybrid.Fitness.Comparator();
        this.inverseFitnessComparator = new Hybrid.Fitness.Comparator(true);

        this.population = new Hybrid.Population({
            initialSize: 10,
            individualFactory: this.individualFactory,
            fitnessEvaluator: this.fitnessEvaluator
        });
    },

    teardown: function() {
    },

    testFitnessComparator: function() { with(this) {
        var first = {number:5};
        var second = {number:5};
        var third = {number:6};

        population.addAll([first, second, third]);

        assertEqual(0, fitnessComparator.compare(first, second));
        assertEqual(1, fitnessComparator.compare(second, third));
        assertEqual(-1, fitnessComparator.compare(third, second));
    }},

    testInverseFitnessComparator: function() { with(this) {
        var first = {number:5};
        var second = {number:5};
        var third = {number:6};

        population.addAll([first, second, third]);

        assertEqual(0, inverseFitnessComparator.compare(first, second));
        assertEqual(-1, inverseFitnessComparator.compare(second, third));
        assertEqual(1, inverseFitnessComparator.compare(third, second));
    }}
};

new Test.Unit.Runner(TestCases, {'testLog':'fitnessLog', 'logger':testLogger});

