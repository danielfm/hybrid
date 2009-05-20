new TestRunner({
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
        assertThat(engine.getPopulation(), sameAs(population));
        assertThat(engine.getRandomizer(), sameAs(randomizer));
        assertThat(engine.getSelection(), sameAs(selection));
        assertThat(engine.getCrossover(), sameAs(crossover));
        assertThat(engine.getMutation(), sameAs(mutation));
        assertThat(engine.getStopCondition(), sameAs(stopCondition));
        assert(engine.getEventHandler());
    }},

    testGetEventHandler: function() { with(this) {
        assert(engine.getEventHandler());
    }},

    testListenerSubscription: function() { with(this) {
        var listeners = engine.getEventHandler().getListeners;
        var count = listeners().length;
        var listener = function() { };

        engine.on('some event', listener);
        assertThat(listeners(), hasSize(count+1));

        engine.unsubscribe(listener);
        assertThat(listeners(), hasSize(count));
    }},

    testEvolve: function() { with(this) {
        engine.evolve({
            serial: true
        });

        var population = engine.getPopulation();
        assertThat(population.getGeneration(), 10);
        assertThat(population.getSize(), 10);
        assertThat(factory.invocations, greaterThan(0));

        assertThat(mutation.emptyReturns, greaterThan(0));
        assertThat(mutation.nonEmptyReturns, greaterThan(0));

        assertThat(crossover.emptyReturns, greaterThan(0));
        assertThat(crossover.nonEmptyReturns, greaterThan(0));
    }},

    testSetRandomizer: function() { with(this) {
        engine.setRandomizer(randomizer);
        assertThat(engine.getRandomizer(), sameAs(randomizer));
    }},

    testSetInvalidRandomizer: function() { with(this) {
        assertThat(function() {
            engine.setRandomizer({});
        }, raises('Hybrid.Error'));
    }},

    testSetSelection: function() { with(this) {
        engine.setSelection(selection);
        assertThat(engine.getSelection(), sameAs(selection));
    }},

    testInvalidSelection: function() { with(this) {
        assertThat(function() {
            engine.setSelection({});
        }, raises('Hybrid.Error'));
    }},

    testSetCrossover: function() { with(this) {
        engine.setCrossover(crossover);
        assertThat(engine.getCrossover(), sameAs(crossover));
    }},

    testSetInvalidCrossover: function() { with(this) {
        assertThat(function() {
            engine.setCrossover({});
        }, raises('Hybrid.Error'));
    }},

    testSetMutation: function() { with(this) {
        engine.setMutation(mutation);
        assertThat(engine.getMutation(), sameAs(mutation));
    }},

    testSetInvalidMutation: function() { with(this) {
        assertThat(function() {
            engine.setCrossover({});
        }, raises('Hybrid.Error'));
    }},

    testSetStopCondition: function() { with(this) {
        engine.setStopCondition(stopCondition);
        assertThat(engine.getStopCondition(), sameAs(stopCondition));
    }},

    testSetInvalidStopCondition: function() { with(this) {
        assertThat(function() {
            engine.setStopCondition({});
        }, raises('Hybrid.Error'));
    }}
}, {'logger':testLogger, 'testLog':'engineLog'});

