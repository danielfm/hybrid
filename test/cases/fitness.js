var TestCases = {
    description: 'Fitness',
    
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
        
        this.fitnessEvaluator = new FitnessEvaluator();
        
        this.population = new Hybrid.Population({
            initialSize: 10,
            individualFactory: this.individualFactory,
            fitnessEvaluator: this.fitnessEvaluator
        });
    },
  
    teardown: function() {
    },
    
    testFitnessComparator: function() { with(this) {
        var comparator = new Hybrid.Fitness.Comparator();
        
        var first = {number:5};
        var second = {number:5};
        var third = {number:6};
        
        population.addAll([first, second, third]);
        
        assertEqual(0, comparator.compare(first, second));
        assertEqual(1, comparator.compare(second, third));
        assertEqual(-1, comparator.compare(third, second));
    }},
    
    testReverseFitnessComparator: function() { with(this) {
        var comparator = new Hybrid.Fitness.Comparator(true);
        
        var first = {number:5};
        var second = {number:5};
        var third = {number:6};
        
        population.addAll([first, second, third]);
        
        assertEqual(0, comparator.compare(first, second));
        assertEqual(-1, comparator.compare(second, third));
        assertEqual(1, comparator.compare(third, second));
    }}
};

new Test.Unit.Runner(TestCases, {'testLog':'fitnessLog'});

