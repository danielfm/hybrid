var TestCases = {
    name: 'Selection',

    setup: function() {
        var individuals = [];
        for (var i = 0; i < 10; i++) {
            individuals.push({number:i});
        }

        this.fitnessEvaluator = new FitnessEvaluatorStub();
        this.randomizer = new RandomizerStub();

        this.population = new Hybrid.Population({
            fitnessEvaluator: this.fitnessEvaluator,
            individuals: individuals
        });
    },

    teardown: function() {
    },

    testDummySelect: function() { with(this) {
        var selection = new Hybrid.Selection();
        randomizer.setResults([0, 4, 9]);

        var individual = selection.select(randomizer, population);
        assertEqual(0, individual.number);

        individual = selection.select(randomizer, population);
        assertEqual(4, individual.number);

        individual = selection.select(randomizer, population);
        assertEqual(9, individual.number);
    }},

    testTournamentSelect: function() { with(this) {
        var selection = new Hybrid.Selection.Tournament(0.3);
        randomizer.setResults([2, 4, 3, 6, 4, 5, 8, 1, 9]);

        var individual = selection.select(randomizer, population);
        assertEqual(4, individual.number);

        individual = selection.select(randomizer, population);
        assertEqual(6, individual.number);

        individual = selection.select(randomizer, population);
        assertEqual(9, individual.number);
    }},

    testRankingSelect: function() { with(this) {
        var selection = new Hybrid.Selection.Ranking();
        randomizer.setResults([36, 16, 7, 44]);

        var individual = selection.select(randomizer, population);
        assertEqual(4, individual.number);

        individual = selection.select(randomizer, population);
        assertEqual(8, individual.number);

        individual = selection.select(randomizer, population);
        assertEqual(9, individual.number);

        individual = selection.select(randomizer, population);
        assertEqual(1, individual.number);
    }}
};

if (testingWithRhino) {
    new Test.Unit.SimpleRunner(TestCases, {'logger':testLogger});
} else {
    new Test.Unit.Runner(TestCases, {'testLog':'selectionLog'});
}

