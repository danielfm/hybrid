var TestCases = {
    name: 'Fitness',

    setup: function() {
        this.fitnessEvaluator = new FitnessEvaluatorStub();
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

if (testingWithRhino) {
    new Test.Unit.SimpleRunner(TestCases, {'logger':testLogger});
} else {
    new Test.Unit.Runner(TestCases, {'testLog':'fitnessLog'});
}

