var TestCases = {
    name: 'Selection',

    setup: function() {
        var individuals = [];
        for (var i = 0; i < 10; i++) {
            individuals.push({number:i});
        }

        this.fitnessEvaluator = new function() {
            this.evaluate = function(individual, population) {
                return individual.number;
            };
        }();

        this.population = new Hybrid.Population({
            fitnessEvaluator: this.fitnessEvaluator,
            individuals: individuals
        });

        this.Randomizer = function(results) {
            this.current = 0;

            this.next = function(range) {
                return results[this.current++];
            }
        };
    },

    teardown: function() {
    },

    testDummySelect: function() { with(this) {
        var randomizer = new Randomizer([0, 4, 9]);
        var selection = new Hybrid.Selection();

        var individual = selection.select(randomizer, population);
        assertEqual(0, individual.number);

        individual = selection.select(randomizer, population);
        assertEqual(4, individual.number);

        individual = selection.select(randomizer, population);
        assertEqual(9, individual.number);
    }},

    testTournamentSelect: function() { with(this) {
        var randomizer = new Randomizer([2, 4, 3, 6, 4, 5, 8, 1, 9]);
        var selection = new Hybrid.Selection.Tournament(0.3);

        var individual = selection.select(randomizer, population);
        assertEqual(4, individual.number);

        individual = selection.select(randomizer, population);
        assertEqual(6, individual.number);

        individual = selection.select(randomizer, population);
        assertEqual(9, individual.number);
    }},

    testRankingSelect: function() { with(this) {
        var randomizer = new Randomizer([36, 16, 7, 44]);
        var selection = new Hybrid.Selection.Ranking();

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

new Test.Unit.Runner(TestCases, {'testLog':'selectionLog', 'logger':testLogger});

