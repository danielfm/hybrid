var TestCases = {
    name: 'Reproduction',

    setup: function() {
        this.randomizer = new RandomizerStub();
        this.mutation = new Hybrid.Reproduction.Mutation();
        this.crossover = new Hybrid.Reproduction.Crossover();
    },

    teardown: function() {
    },

    testDefaultCrossover: function() { with(this) {
        assertNull(crossover.crossover(randomizer));
    }},

    testDefaultMutation: function() { with(this) {
        assertNull(mutation.mutate(randomizer));
    }},

    testMutationConstructor: function() { with(this) {
        mutation = new Hybrid.Reproduction.Mutation();
        assertEqual(0, mutation.getProbability());

        mutation = new Hybrid.Reproduction.Mutation(0);
        assertEqual(0, mutation.getProbability());

        mutation = new Hybrid.Reproduction.Mutation(2);
        assertEqual(1, mutation.getProbability());
    }},

    testCrossoverConstructor: function() { with(this) {
        crossover = new Hybrid.Reproduction.Crossover();
        assertEqual(0.01, crossover.getProbability());

        crossover = new Hybrid.Reproduction.Crossover(0);
        assertEqual(0.01, crossover.getProbability());

        crossover = new Hybrid.Reproduction.Crossover(2);
        assertEqual(1, crossover.getProbability());
    }},

    testCrossoverDelegation: function() { with(this) {
        crossover = new CrossoverStub(1);
        crossover.execute(randomizer, 1, 2, 3);

        assertEqual(randomizer, crossover.randomizer);
        assertEqual(1, crossover.mother);
        assertEqual(2, crossover.father);
        assertEqual(3, crossover.population);
    }},

    testMutationDelegation: function() { with(this) {
        mutation = new MutationStub(1);
        mutation.execute(randomizer, 1, 2);

        assertEqual(randomizer, mutation.randomizer);
        assertEqual(1, mutation.individual);
        assertEqual(2, mutation.population);
    }}
};

new Test.Unit.Runner(TestCases, {'testLog':'reproductionLog', 'logger':testLogger});

