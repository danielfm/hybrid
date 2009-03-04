var TestCases = {
    name: 'Individuals',
    
    setup: function() {
        var FitnessEvaluator = function() {
            this.evaluate = function(individual, population) {
                if (!individual) {
                    throw "Individual should not be null";
                }
                if (!population) {
                    throw "Population should not be null";
                }
                return individual.number;
            };
        };
        
        this.randomizer = new Hybrid.Util.Randomizer();
        this.fitnessEvaluator = new FitnessEvaluator();
        
        this.population = new Hybrid.Population({
            fitnessEvaluator: this.fitnessEvaluator
        });
    },
  
    teardown: function() {
    },
    
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

new Test.Unit.Runner(TestCases, {'testLog':'individualLog', 'callback':testCallback});

