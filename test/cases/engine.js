var TestCases = {
    name: 'Engine',

    setup: function() {
        this.randomizer = new RandomizerStub();
        this.individualFactory = new FactoryStub(10);
        this.fitnessEvaluator = new FitnessEvaluatorStub();

        this.population = new Hybrid.Population({
            individualFactory: this.individualFactory,
            fitnessEvaluator: this.fitnessEvaluator
        });

        this.engine = new Hybrid.Engine({
            population: this.population,
            randomizer: this.randomizer
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
        engine = new Hybrid.Engine({
        });
    }},

    testEngineListenerDelegates: function() { with(this) {
    }},

    testEvolve: function() { with(this) {
    }},

    testSetRandomizer: function() { with(this) {
    }},

    testSetSelection: function() { with(this) {
    }},

    testSetCrossover: function() { with(this) {
    }},

    testSetMutation: function() { with(this) {
    }}
};

new Test.Unit.Runner(TestCases, {'testLog':'engineLog', 'logger':testLogger});

