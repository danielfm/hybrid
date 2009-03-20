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
    }}
};

new Test.Unit.Runner(TestCases, {'testLog':'reproductionLog', 'logger':testLogger});

