var TestCases = {
    name: 'Engine',

    setup: function() {
        this.randomizer = new RandomizerStub();
        this.factory = new FactoryStub(10);
        this.fitnessEvaluator = new FitnessEvaluatorStub();
        this.selection = new Hybrid.Selection.Ranking();
        this.mutation = new MutationStub(0.5);
        this.crossover = new CrossoverStub(0.5);
        this.stopCondition = new Hybrid.Stop.ElapsedGeneration(10);

        this.population = new Hybrid.Population({
            factory: this.factory,
            fitnessEvaluator: this.fitnessEvaluator
        });

        this.engine = new Hybrid.Engine({
            population: this.population,
            randomizer: this.randomizer,
            selection: this.selection,
            crossover: this.crossover,
            mutation: this.mutation,
            stopCondition: this.stopCondition
        });
    },

    teardown: function() {
    },

    testEngineConstructorWithNoArgs: function() { with(this) {
        engine = new Hybrid.Engine();

        assert(engine.getPopulation());
        assert(engine.getRandomizer());
        assert(engine.getSelection());
        assert(engine.getCrossover());
        assert(engine.getMutation());
        assert(engine.getStopCondition());
        assert(engine.getEventHandler());
    }},

    testEngineConstructor: function() { with(this) {
        assertIdentical(population, engine.getPopulation());
        assertIdentical(randomizer, engine.getRandomizer());
        assertIdentical(selection, engine.getSelection());
        assertIdentical(crossover, engine.getCrossover());
        assertIdentical(mutation, engine.getMutation());
        assertIdentical(stopCondition, engine.getStopCondition());
        assert(engine.getEventHandler());
    }},

    testGetEventHandler: function() { with(this) {
        assert(engine.getEventHandler());
    }},

    testListenerSubscription: function() { with(this) {
        var count = engine.getEventHandler().getListeners().length;

        var listener = function() {
        };

        engine.on('some event', listener);
        assertEqual(count+1, engine.getEventHandler().getListeners().length);

        engine.unsubscribe(listener);
        assertEqual(count, engine.getEventHandler().getListeners().length);
    }},

    testEvolve: function() { with(this) {
        engine.evolve({
            serial: true
        });

        var population = engine.getPopulation();
        assertEqual(10, population.getGeneration());
        assertEqual(10, population.getSize());

        assert(factory.invocations);
        assert(mutation.emptyReturns);
        assert(mutation.nonEmptyReturns);
        assert(crossover.emptyReturns);
        assert(crossover.nonEmptyReturns);
    }},

    testSetRandomizer: function() { with(this) {
        engine.setRandomizer(randomizer);
        assertIdentical(randomizer, engine.getRandomizer());
    }},

    testSetInvalidRandomizer: function() { with(this) {
        assertRaise('Hybrid.Error', function() {
            engine.setRandomizer({});
        });
    }},

    testSetSelection: function() { with(this) {
        engine.setSelection(selection);
        assertIdentical(selection, engine.getSelection());
    }},

    testInvalidSelection: function() { with(this) {
        assertRaise('Hybrid.Error', function() {
            engine.setSelection({});
        });
    }},

    testSetCrossover: function() { with(this) {
        engine.setCrossover(crossover);
        assertIdentical(crossover, engine.getCrossover());
    }},

    testSetInvalidCrossover: function() { with(this) {
        assertRaise('Hybrid.Error', function() {
            engine.setCrossover({});
        });
    }},

    testSetMutation: function() { with(this) {
        engine.setMutation(mutation);
        assertIdentical(mutation, engine.getMutation());
    }},

    testSetInvalidMutation: function() { with(this) {
        assertRaise('Hybrid.Error', function() {
            engine.setCrossover({});
        });
    }},

    testSetStopCondition: function() { with(this) {
        engine.setStopCondition(stopCondition);
        assertIdentical(stopCondition, engine.getStopCondition());
    }},

    testSetInvalidStopCondition: function() { with(this) {
        assertRaise('Hybrid.Error', function() {
            engine.setStopCondition({});
        });
    }}
};

if (testingWithRhino) {
    new Test.Unit.SimpleRunner(TestCases, {'logger':testLogger});
}
else {
    new Test.Unit.Runner(TestCases, {'testLog':'engineLog'});
}

