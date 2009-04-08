new TestRunner({
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
        assertRaise('Hybrid.Error', function() {
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

        assert(individual.fitness.isBetterThan(other));
        assert(!(other.fitness.isBetterThan(individual)));
        assert(!(other.fitness.isBetterThan(other)));
    }},

    testFactoryConstructor: function() { with(this) {
        assertEqual(100, new Hybrid.Individual.Factory().getInitialSize());
        assertEqual(100, new Hybrid.Individual.Factory(0).getInitialSize());
        assertEqual(50, new Hybrid.Individual.Factory(50).getInitialSize());
    }},

    testDefaultFactory: function() { with(this) {
        assert(new Hybrid.Individual.Factory().createIndividual());
    }}
}, {'logger':testLogger, 'testLog':'individualLog'});

