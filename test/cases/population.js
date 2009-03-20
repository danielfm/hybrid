var TestCases = {
    name: 'Population',

    setup: function() {
        this.individualFactory = new IndividualFactoryStub();
        this.fitnessEvaluator = new FitnessEvaluatorStub();
        this.randomizer = new RandomizerStub();
        this.statisticsProvider = new Hybrid.Population.StatisticsProvider();
        this.fitnessComparator = new Hybrid.Fitness.Comparator();

        this.population = new Hybrid.Population({
            initialSize: 10,
            generation: 10,
            individualFactory: this.individualFactory,
            fitnessEvaluator: this.fitnessEvaluator
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

    testConstructorWithIndividuals: function() { with(this) {
        var args = {
            individuals: [{}, {}, {}],
            initialSize: 10
        };

        population = new Hybrid.Population(args);

        assertEnumEqual(args.individuals, population.getIndividuals());
        assertTrue(population.isInitialized());
        assertEqual(args.individuals.length, population.getInitialSize());
    }},

    testConstructorWithInvalidInitialSize: function() { with(this) {
        population = new Hybrid.Population({
            initialSize:0
        });
        assertTrue(population.getInitialSize() > 0);
    }},

    testConstructorWithInvalidGeneration: function() { with(this) {
        population = new Hybrid.Population({
            generation:-1
        });
        assertTrue(population.getGeneration() >= 0);
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

        for (var i = 0; i < population.getSize(); i++) {
            assert(population.getIndividual(i).fitness);
        }
    }},

    testInitializeTwice: function() { with(this) {
        population.initialize(randomizer);

        assertRaise(Hybrid.Error, function() {
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

    testAddAll: function() { with(this) {
        var individuals = [{}, {}];
        population.addAll(individuals);

        assertEqual(2, population.getSize());
        assertIdentical(population.getIndividual(0), individuals[0]);
        assertIdentical(population.getIndividual(1), individuals[1]);
    }},

    testAddAllWithInvalidArgument: function() { with(this) {
        assertRaise(Hybrid.Error, function() {
            population.addAll({});
        });
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

        assertEnumEqual([first, second], population.best(2));
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

        assertRaise(Hybrid.Error, function() {
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

    testElitismWithSizeZero: function() { with(this) {
        for (var i = 0; i < 10; i++) {
            population.add({number:i});
        }

        var breed = population.getIndividuals().slice(0, 5);
        var event = {
            population: population,
            breed: breed
        };

        Hybrid.Population.addElitism({
            to: population,
            size: 0
        });
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

        Hybrid.Population.addElitism({
            to: population,
            size: 2
        });
        population.notify('replaceGeneration', event);

        assertEqual(5, event.breed.length);
        assertEqual(2, event.breed[0].number);
        assertEqual(4, event.breed[2].number);
        assertEqual(9, event.breed[3].number);
        assertEqual(8, event.breed[4].number);
    }},

    testElitismWithMissingOptions: function() { with(this) {
        assertRaise(Hybrid.Error, function() {
            Hybrid.Population.addElitism();
        });

        assertRaise(Hybrid.Error, function() {
            Hybrid.Population.addElitism({
                to: population
            });
        });

        assertRaise(Hybrid.Error, function() {
            Hybrid.Population.addElitism({
                size: 2
            });
        });

        Hybrid.Population.addElitism({
            to: population,
            size: 2
        });
    }},

    testSetIndividualFactory: function() { with(this) {
        assertRaise(Hybrid.Error, function() {
            population.setIndividualFactory({});
        });

        assertRaise(Hybrid.Error, function() {
            new Hybrid.Population({
                individualFactory: {}
            });
        });

        population.setIndividualFactory(individualFactory);
        assertIdentical(individualFactory, population.getIndividualFactory());

        population = new Hybrid.Population({
            individualFactory: this.individualFactory
        });
        assertIdentical(individualFactory, population.getIndividualFactory());
    }},

    testSetFitnessEvaluator: function() { with(this) {
        assertRaise(Hybrid.Error, function() {
            population.setFitnessEvaluator({});
        });

        assertRaise(Hybrid.Error, function() {
            new Hybrid.Population({
                fitnessEvaluator: {}
            });
        });

        population.setFitnessEvaluator(this.fitnessEvaluator);
        assertIdentical(this.fitnessEvaluator, population.getFitnessEvaluator());

        population = new Hybrid.Population({
            fitnessEvaluator: this.fitnessEvaluator
        });
        assertIdentical(this.fitnessEvaluator, population.getFitnessEvaluator());
    }},

    testSetStatisticsProvider: function() { with(this) {
        assertRaise(Hybrid.Error, function() {
            population.setStatisticsProvider({});
        });

        assertRaise(Hybrid.Error, function() {
            new Hybrid.Population({
                statisticsProvider: {}
            });
        });

        population.setStatisticsProvider(this.statisticsProvider);
        assertIdentical(this.statisticsProvider, population.getStatisticsProvider());

        population = new Hybrid.Population({
            statisticsProvider: this.statisticsProvider
        });
        assertIdentical(this.statisticsProvider, population.getStatisticsProvider());
    }},

    testSetFitnessComparator: function() { with(this) {
        assertRaise(Hybrid.Error, function() {
            population.setFitnessComparator({});
        });

        assertRaise(Hybrid.Error, function() {
            new Hybrid.Population({
                fitnessComparator: {}
            });
        });

        population.setFitnessComparator(this.fitnessComparator);
        assertIdentical(this.fitnessComparator, population.getFitnessComparator());

        population = new Hybrid.Population({
            fitnessComparator: this.fitnessComparator
        });
        assertIdentical(this.fitnessComparator, population.getFitnessComparator());
    }}
};

new Test.Unit.Runner(TestCases, {'testLog':'populationLog', 'logger':testLogger});

