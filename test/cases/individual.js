var TestCases = {
    name: 'Individuals',

    setup: function() {
        this.fitnessEvaluator = new FitnessEvaluatorStub();
        this.randomizer = new RandomizerStub();

        this.population = new Hybrid.Population({
            fitnessEvaluator: this.fitnessEvaluator
        });
    },

    teardown: function() {
    },

    testInvaldiIndividual: function() { with(this) {
        var individual = {number: 10, fitness:{}};
        assertRaise(Hybrid.Error, function() {
            population.add(individual);
        });
    }},

    testIndividualFitness: function() { with(this) {
        var individual = {number: 10};
        population.add(individual);
        assertEqual(10, individual.fitness.get());
    }},

    testIndividualResetFitness: function() { with(this) {
        var individual = {number: 10};
        population.add(individual);

        population.sort();
        assertEqual(10, individual.fitness.get());

        individual.number = 5;
        assertEqual(10, individual.fitness.get());

        individual.fitness.reset();
        assertEqual(5, individual.fitness.get());
    }},

    testIndividualIsBetterThan: function() { with(this) {
        var individual = {number: 10};
        var other = {number:5};
        population.add(individual);
        population.add(other);

        assertTrue(individual.fitness.isBetterThan(other));
        assertFalse(other.fitness.isBetterThan(individual));
        assertFalse(other.fitness.isBetterThan(other));
    }},

    testDefaultIndividualFactory: function() { with(this) {
        assertNull(new Hybrid.Individual.Factory().create());
    }}
};

new Test.Unit.Runner(TestCases, {'testLog':'individualLog', 'logger':testLogger});

