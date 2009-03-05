var TestCases = {
    name: 'Reproduction',
    
    setup: function() {
        this.mutation = new Hybrid.Reproduction.Mutation();
        this.crossover = new Hybrid.Reproduction.Crossover();
    },
  
    teardown: function() {
    },
    
    testDefaultCrossover: function() { with(this) {
        assertNull(crossover.crossover());
    }},
    
    testDefaultMutation: function() { with(this) {
        assertNull(mutation.mutate());
    }}
};

new Test.Unit.Runner(TestCases, {'testLog':'reproductionLog', 'logger':testLogger});

