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
        assertThat(function() {
            population.add(individual);
        }, raises('Hybrid.Error'));
    }},

    testIndividualFitness: function() { with(this) {
        var individual = {number: 10};
        population.add(individual);
        assertThat(individual.fitness.get(), 10);
    }},

    testIndividualResetFitness: function() { with(this) {
        var individual = {number: 10};
        population.add(individual);

        population.sort();
        assertThat(individual.fitness.get(), 10);

        individual.number = 5;
        assertThat(individual.fitness.get(), 10);

        individual.fitness.reset();
        assertThat(individual.fitness.get(), 5);
    }},

    testIndividualIsBetterThan: function() { with(this) {
        var individual = {number: 10};
        var other = {number:5};
        population.add(individual);
        population.add(other);

        assertThat(individual.fitness.isBetterThan(other), true);
        assertThat(other.fitness.isBetterThan(individual), false);
        assertThat(other.fitness.isBetterThan(other), false);
    }},

    testFactoryConstructor: function() { with(this) {
        assertThat(new Hybrid.Individual.Factory().getInitialSize(), 100);
        assertThat(new Hybrid.Individual.Factory(0).getInitialSize(), 100);
        assertThat(new Hybrid.Individual.Factory(50).getInitialSize(), 50);
    }},

    testDefaultFactory: function() { with(this) {
        assert(new Hybrid.Individual.Factory().createIndividual());
    }}
}, {'logger':testLogger, 'testLog':'individualLog'});

