new TestRunner({
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
        assertThat(individual.number, 0);

        individual = selection.select(randomizer, population);
        assertThat(individual.number, 4);

        individual = selection.select(randomizer, population);
        assertThat(individual.number, 9);
    }},

    testTournamentSelect: function() { with(this) {
        var selection = new Hybrid.Selection.Tournament(0.3);
        randomizer.setResults([2, 4, 3, 6, 4, 5, 8, 1, 9]);

        var individual = selection.select(randomizer, population);
        assertThat(individual.number, 4);

        individual = selection.select(randomizer, population);
        assertThat(individual.number, 6);

        individual = selection.select(randomizer, population);
        assertThat(individual.number, 9);
    }},

    testRankingSelect: function() { with(this) {
        var selection = new Hybrid.Selection.Ranking();
        randomizer.setResults([36, 16, 7, 44]);

        var individual = selection.select(randomizer, population);
        assertThat(individual.number, 4);

        individual = selection.select(randomizer, population);
        assertThat(individual.number, 8);

        individual = selection.select(randomizer, population);
        assertThat(individual.number, 9);

        individual = selection.select(randomizer, population);
        assertThat(individual.number, 1);
    }}
}, {'logger':testLogger, 'testLog':'selectionLog'});

