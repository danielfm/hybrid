new TestRunner({
    name: 'Reproduction',

    setup: function() {
        this.randomizer = new RandomizerStub();
        this.mutation = new Hybrid.Reproduction.Mutation();
        this.crossover = new Hybrid.Reproduction.Crossover();
    },

    teardown: function() {
    },

    testDefaultCrossover: function() { with(this) {
        assertThat(crossover.crossover(randomizer), nil());
    }},

    testDefaultMutation: function() { with(this) {
        assertThat(mutation.mutate(randomizer), nil());
    }},

    testMutationConstructor: function() { with(this) {
        mutation = new Hybrid.Reproduction.Mutation();
        assertThat(mutation.getProbability(), 0);

        mutation = new Hybrid.Reproduction.Mutation(0);
        assertThat(mutation.getProbability(), 0);

        mutation = new Hybrid.Reproduction.Mutation(2);
        assertThat(mutation.getProbability(), 1);
    }},

    testCrossoverConstructor: function() { with(this) {
        crossover = new Hybrid.Reproduction.Crossover();
        assertThat(crossover.getProbability(), 0.01);

        crossover = new Hybrid.Reproduction.Crossover(0);
        assertThat(crossover.getProbability(), 0.01);

        crossover = new Hybrid.Reproduction.Crossover(2);
        assertThat(crossover.getProbability(), 1);
    }},

    testCrossoverDelegation: function() { with(this) {
        crossover = new CrossoverStub(1);
        crossover.execute(randomizer, 1, 2, 3);

        assertThat(crossover.randomizer, sameAs(randomizer));
        assertThat(crossover.mother, 1);
        assertThat(crossover.father, 2);
        assertThat(crossover.population, 3);
    }},

    testMutationDelegation: function() { with(this) {
        mutation = new MutationStub(1);
        mutation.execute(randomizer, 1, 2);

        assertThat(mutation.randomizer, sameAs(randomizer));
        assertThat(mutation.individual, 1);
        assertThat(mutation.population, 2);
    }}
}, {'logger':testLogger, 'testLog':'reproductionLog'});

