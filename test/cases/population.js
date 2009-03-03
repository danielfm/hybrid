var TestCases = {
    description: 'Population',
    
    setup: function() {
        var IndividualFactory = function() {
            this.create = function(randomizer, population) {
                if (!randomizer) {
                    throw "Randomizer should not be null";
                }
                if (!population) {
                    throw "Population should not be null";
                }
                
                this.factoryCount++;
                return {
                    number: randomizer.next()
                };
            };
        };
        
        var FitnessEvaluator = function() {
            this.evaluate = function(individual, population) {
                if (!individual) {
                    throw "Individual should not be null";
                }
                if (!population) {
                    throw "Population should not be null";
                }
                
                this.evaluator++;
                return individual.number;
            };
        };
        
        this.randomizer = new Hybrid.Util.Randomizer();
        this.individualFactory = new IndividualFactory();
        
        this.population = new Hybrid.Population({
            initialSize: 10,
            generation: 10,
            individualFactory: this.individualFactory,
            fitnessEvaluator: new FitnessEvaluator()
        });
    },
  
    teardown: function() {
    },
    
    testDefaultConstructor: function() { with(this) {
        population = new Hybrid.Population();
        
        assertEqual(0, population.getSize());
        assertFalse(population.isInitialized());
        assertEqual(100, population.getInitialSize());
        assertEqual(0, population.getGeneration());
        
        assert(population.getEventHandler());
        assert(population.getStatisticsProvider());
        assert(population.getIndividualFactory());
        assert(population.getFitnessEvaluator());
        assert(population.getFitnessComparator());
    }},
    
    testConstructorWithArgs: function() { with(this) {
        var args = {
            individuals: [{}, {}, {}],
            statisticsProvider: new Hybrid.Population.StatisticsProvider(),
            individualFactory: {},
            fitnessEvaluator: {},
            fitnessComparator: {},
            generation:19
        };
    
        population = new Hybrid.Population(args);
        
        assertEnumEqual(args.individuals, population.getIndividuals());
        assertTrue(population.isInitialized());
        assertEqual(args.individuals.length, population.getInitialSize());
        assertEqual(args.generation, population.getGeneration());
        
        assertIdentical(args.statisticsProvider, population.getStatisticsProvider());
        assertIdentical(args.individualFactory, population.getIndividualFactory());
        assertIdentical(args.fitnessEvaluator, population.getFitnessEvaluator());
        assertIdentical(args.fitnessComparator, population.getFitnessComparator());
    }},
    
    testInitialize: function() { with(this) {
        var before = 0;
        population.on('beforeInitialize', function(event) {
            assert(event);
            before++;
        });
        
        var after = 0;
        population.on('afterInitialize', function(event) {
            assert(event);
            after++;
        });
        
        assertEqual(10, population.getGeneration());
        
        population.initialize(randomizer);
        
        assertEqual(0, population.getGeneration());
        assertEqual(10, population.getSize());
        assertTrue(population.isInitialized());
        
        assertEqual(1, before);
        assertEqual(1, after);
        
        for (var i = 0; i < this.population.getSize(); i++) {
            assert(this.population.getIndividual(i).fitness);
        }
    }},
    
    testReset: function() { with(this) {
        population.initialize(randomizer);
        population.reset(2);
        
        assertEqual(0, population.getGeneration());
        assertEqual(0, population.getSize());
        assertFalse(population.isInitialized());
        
        population.initialize(randomizer);
        assertEqual(2, population.getSize());
    }},
    
    testInitializeTwice: function() { with(this) {
        population.initialize(randomizer);
        
        assertRaise(Hybrid.Population.AlreadyInitializedError, function() {
            population.initialize(randomizer);
        });
    }},
    
    testAdd: function() { with(this) {
        population.on('addIndividual', function(event) {
            event.individual.someProperty = 'abc';
        });
        
        population.add({});
        
        assertEqual(1, population.getSize());
        assertEqual('abc', population.getIndividual(0).someProperty);
    }},
    
    testSort: function() { with(this) {
        population.initialize(randomizer);
        population.sort();
        
        var individuals = population.getIndividuals();
        
        for (var i = 0; i < individuals.length - 1; i++) {
            assertTrue(individuals[i].fitness.get() >= individuals[i+1].fitness.get());
        }
    }},
    
    testBest: function() { with(this) {
        var best = {number: 3};
        
        population.initialize(randomizer);
        population.add(best);
        
        assertIdentical(best, population.best());
    }},
    
    testTwoBest: function() { with(this) {
        var first = {number: 3};
        var second = {number: 2};
        
        population.initialize(randomizer);
        population.addAll([second, first]);
        
        assertEnumEqual([first, second], this.population.best(2));
    }},
    
    testReplaceGenerationAndIncrement: function() { with(this) {
        population.initialize(randomizer);
        
        var breed = [];
        for (var i = 0; i < population.getSize(); i++) {
            breed.push(individualFactory.create(randomizer, population));
        }
        
        population.replaceGeneration(breed, true);
        assertEqual(1, population.getGeneration());
    }},
    
    testReplaceGenerationWithIncompatibleBreed: function() { with(this) {
        var count = 0;
        population.on('replaceGeneration', function(event) {
            assert(event);
            count++;
        });
        
        population.initialize(randomizer);
        
        var breed = [];
        for (var i = 0; i < population.getSize() / 2; i++) {
            breed.push(individualFactory.create(randomizer, population));
        }
        
        assertRaise(Hybrid.Population.IncompatibleBreedError, function() {
            population.replaceGeneration(breed);
        });
        assertEqual(0, count);
    }},
    
    testUnsubscribe: function() { with(this) {
        var count = population.getEventHandler().getListeners().length;
        
        var listener = function() {
        };
        
        population.on('some event', listener);
        assertEqual(count+1, population.getEventHandler().getListeners().length);
        
        population.unsubscribe(listener);
        assertEqual(count, population.getEventHandler().getListeners().length);
    }},
    
    testSetIndividualFactory: function() { with(this) {
        var factory = {};
        population.setIndividualFactory(factory);
        assertIdentical(factory, population.getIndividualFactory());
    }},
    
    testSetFitnessEvaluator: function() { with(this) {
        var evaluator = {};
        population.setFitnessEvaluator(evaluator);
        assertIdentical(evaluator, population.getFitnessEvaluator());
    }},
    
    testSetFitnessComparator: function() { with(this) {
        var comparator = {};
        population.setFitnessComparator(comparator);
        assertIdentical(comparator, population.getFitnessComparator());
    }},
    
    testSetStatisticsProvider: function() { with(this) {
        var provider = {};
        population.setStatisticsProvider(provider);
        assertIdentical(provider, population.getStatisticsProvider());
    }},
    
    testElitismWithSizeZero: function() { with(this) {
        for (var i = 0; i < 10; i++) {
            population.add({number:i});
        }
        
        var breed = population.getIndividuals().slice(0, 5);
        var event = {
            population: population,
            breed: breed
        };
        
        new Hybrid.Population.Elitism(0, population);
        population.notify('replaceGeneration', event);
        
        assertEqual(5, event.breed.length);
        assertEqual(0, event.breed[0].number);
        assertEqual(2, event.breed[2].number);
        assertEqual(4, event.breed[4].number);
    }},
    
    testElitism: function() { with(this) {
        for (var i = 0; i < 10; i++) {
            population.add({number:i});
        }
        
        var breed = population.getIndividuals().slice(0, 5);
        var event = {
            population: population,
            breed: breed
        };
        
        new Hybrid.Population.Elitism(2, population);
        population.notify('replaceGeneration', event);
        
        assertEqual(5, event.breed.length);
        assertEqual(2, event.breed[0].number);
        assertEqual(4, event.breed[2].number);
        assertEqual(9, event.breed[3].number);
        assertEqual(8, event.breed[4].number);
    }}
};

new Test.Unit.Runner(TestCases, {'testLog':'populationLog'});

