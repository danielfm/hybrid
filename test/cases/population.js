new TestRunner({
    name: 'Population',

    setup: function() {
        this.factory = new FactoryStub(10);
        this.fitnessEvaluator = new FitnessEvaluatorStub();
        this.randomizer = new RandomizerStub();
        this.statisticsProvider = new Hybrid.Population.StatisticsProvider();
        this.fitnessComparator = new Hybrid.Fitness.Comparator();

        this.population = new Hybrid.Population({
            generation: 10,
            factory: this.factory,
            fitnessEvaluator: this.fitnessEvaluator
        });
    },

    teardown: function() {
    },

    testDefaultConstructor: function() { with(this) {
        population = new Hybrid.Population();

        assertThat(population.getSize(), 0);
        assertThat(population.getGeneration(), 0);
        assert(!population.isInitialized());

        assert(population.getEventHandler());
        assert(population.getStatisticsProvider());
        assert(population.getFactory());
        assert(population.getFitnessEvaluator());
        assert(population.getFitnessComparator());
    }},

    testConstructorWithElitism: function() { with(this) {
        var defaultListeners = population.getEventHandler().getListenersCount();

        population = new Hybrid.Population({
            elitismSize: 10
        });

        assertThat(population.getEventHandler().getListenersCount(), defaultListeners+1);
    }},

    testConstructorWithIndividuals: function() { with(this) {
        var args = {
            individuals: [{}, {}, {}],
        };

        population = new Hybrid.Population(args);

        assertThat(population.getIndividuals(), args.individuals);
        assertThat(population.isInitialized(), true);
    }},

    testConstructorWithInvalidGeneration: function() { with(this) {
        population = new Hybrid.Population({
            generation:-1
        });
        assertThat(population.getGeneration(), greaterThanOrEqualTo(0));
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

        assertThat(population.getGeneration(), 10);

        population.initialize(randomizer);

        assertThat(population.getGeneration(), 0);
        assertThat(population.getSize(), 10);
        assertThat(population.isInitialized());

        assertThat(before, 1);
        assertThat(after, 1);

        for (var i = 0; i < population.getSize(); i++) {
            assert(population.getIndividual(i).fitness);
        }
    }},

    testInitializeTwice: function() { with(this) {
        population.initialize(randomizer);

        assertThat(function() {
            population.initialize(randomizer);
        }, raises('Hybrid.Error'));
    }},

    testAdd: function() { with(this) {
        population.on('addIndividual', function(event) {
            event.individual.someProperty = 'abc';
        });

        population.add({});

        assertThat(population.getSize(), 1);
        assertThat(population.getIndividual(0).someProperty, 'abc');
    }},

    testAddAll: function() { with(this) {
        var individuals = [{}, {}];
        population.addAll(individuals);

        assertThat(population.getSize(), 2);
        assertThat(population.getIndividual(0), sameAs(individuals[0]));
        assertThat(population.getIndividual(1), sameAs(individuals[1]));
    }},

    testAddAllWithInvalidArgument: function() { with(this) {
        assertThat(function() {
            population.addAll({});
        }, raises('Hybrid.Error'));
    }},

    testSort: function() { with(this) {
        population.initialize(randomizer);
        population.sort();

        var individuals = population.getIndividuals();

        for (var i = 0; i < individuals.length - 1; i++) {
            assertThat(individuals[i].fitness.get(), greaterThanOrEqualTo(individuals[i+1].fitness.get()));
        }
    }},

    testBest: function() { with(this) {
        var best = {number: 3};

        population.initialize(randomizer);
        population.add(best);

        assertThat(population.best(), sameAs(best));
    }},

    testTwoBest: function() { with(this) {
        var first = {number: 3};
        var second = {number: 2};

        population.initialize(randomizer);
        population.addAll([second, first]);

        assertThat(population.best(2), [first, second]);
    }},

    testReplaceGenerationAndIncrement: function() { with(this) {
        population.initialize(randomizer);

        var breed = [];
        for (var i = 0; i < population.getSize(); i++) {
            breed.push(factory.createIndividual(randomizer, population));
        }

        population.replaceGeneration(breed, true);
        assertThat(population.getGeneration(), 1);
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
            breed.push(factory.createIndividual(randomizer, population));
        }

        assertThat(function() {
            population.replaceGeneration(breed);
        }, raises('Hybrid.Error'));
        assertThat(count, 0);
    }},

    testListenerSubscription: function() { with(this) {
        var count = population.getEventHandler().getListeners().length;

        var listener = function() {
        };

        population.on('some event', listener);
        assertThat(population.getEventHandler().getListeners().length, count+1);

        population.unsubscribe(listener);
        assertThat(population.getEventHandler().getListeners().length, count);
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

        Hybrid.Population.setElitism({
            to: population,
            size: 0
        });
        population.notify('replaceGeneration', event);

        assertThat(event.breed.length, 5);
        assertThat(event.breed[0].number, 0);
        assertThat(event.breed[2].number, 2);
        assertThat(event.breed[4].number, 4);
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

        Hybrid.Population.setElitism({
            to: population,
            size: 2
        });
        population.notify('replaceGeneration', event);

        assertThat(event.breed.length, 5);
        assertThat(event.breed[0].number, 2);
        assertThat(event.breed[2].number, 4);
        assertThat(event.breed[3].number, 9);
        assertThat(event.breed[4].number, 8);
    }},

    testSetTwoElitismListeners: function() { with(this) {
        var breed = population.getIndividuals().slice(0, 5);
        var event = {
            population: population,
            breed: breed
        };

        for (var i = 0; i < 5; i++) {
            Hybrid.Population.setElitism({
                to: population,
                size: i
            });
        }

        var listeners = population.getEventHandler().getListenersByType('replaceGeneration');
        assertThat(listeners.length, 1);

        listeners[0](event);
    }},

    testElitismWithMissingOptions: function() { with(this) {
        assertThat(function() {
            Hybrid.Population.setElitism();
        }, raises('Hybrid.Error'));

        assertThat(function() {
            Hybrid.Population.setElitism({
                to: population
            });
        }, raises('Hybrid.Error'));

        assertThat(function() {
            Hybrid.Population.setElitism({
                size: 2
            });
        }, raises('Hybrid.Error'));

        Hybrid.Population.setElitism({
            to: population,
            size: 2
        });
    }},

    testSetElitism: function() { with(this) {
        var defaultListeners = population.getEventHandler().getListenersCount();
        population.setElitism(10);
        assertThat(population.getEventHandler().getListenersCount(), defaultListeners+1);
    }},

    testSetFactory: function() { with(this) {
        assertThat(function() {
            population.setFactory({});
        }, raises('Hybrid.Error'));

        assertThat(function() {
            new Hybrid.Population({
                factory: {}
            });
        }, raises('Hybrid.Error'));

        population.setFactory(factory);
        assertThat(population.getFactory(), sameAs(factory));

        population = new Hybrid.Population({
            factory: factory
        });
        assertThat(population.getFactory(), sameAs(factory));
    }},

    testSetFitnessEvaluator: function() { with(this) {
        assertThat(function() {
            population.setFitnessEvaluator({});
        }, raises('Hybrid.Error'));

        assertThat(function() {
            new Hybrid.Population({
                fitnessEvaluator: {}
            });
        }, raises('Hybrid.Error'));

        population.setFitnessEvaluator(fitnessEvaluator);
        assertThat(population.getFitnessEvaluator(), sameAs(fitnessEvaluator));

        population = new Hybrid.Population({
            fitnessEvaluator: fitnessEvaluator
        });
        assertThat(population.getFitnessEvaluator(), fitnessEvaluator);
    }},

    testSetStatisticsProvider: function() { with(this) {
        assertThat(function() {
            population.setStatisticsProvider({});
        }, raises('Hybrid.Error'));

        assertThat(function() {
            new Hybrid.Population({
                statisticsProvider: {}
            });
        }, raises('Hybrid.Error'));

        population.setStatisticsProvider(statisticsProvider);
        assertThat(population.getStatisticsProvider(), sameAs(statisticsProvider));

        population = new Hybrid.Population({
            statisticsProvider: statisticsProvider
        });
        assertThat(population.getStatisticsProvider(), statisticsProvider);
    }},

    testSetFitnessComparator: function() { with(this) {
        assertThat(function() {
            population.setFitnessComparator({});
        }, raises('Hybrid.Error'));

        assertThat(function() {
            new Hybrid.Population({
                fitnessComparator: {}
            });
        }, raises('Hybrid.Error'));

        population.setFitnessComparator(fitnessComparator);
        assertThat(population.getFitnessComparator(), sameAs(fitnessComparator));

        population = new Hybrid.Population({
            fitnessComparator: fitnessComparator
        });
        assertThat(population.getFitnessComparator(), sameAs(fitnessComparator));
    }}
}, {'logger':testLogger, 'testLog':'populationLog'});

