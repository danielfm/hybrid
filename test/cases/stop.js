new TestRunner({
    name: 'Stop Conditions',

    setup: function() {
    },

    teardown: function() {
    },

    testStopCondition: function() { with(this) {
        var stop = new Hybrid.Stop.Condition();
        assert(stop.interrupt());
    }},

    testStopConditionClassHierarchy: function() { with(this) {
        var stop = new Hybrid.Stop.Condition();
        assert(stop instanceof Hybrid.Stop.Condition);
        assert(!(stop instanceof Hybrid.Stop.ElapsedGeneration));
    }},

    testElapsedGenerationStop: function() { with(this) {
        var elapsedStop = new Hybrid.Stop.ElapsedGeneration(10);

        var event = {
            population: {
                getGeneration: function() { return generations; }
            }
        };

        var generations = 5;
        assert(!(elapsedStop.interrupt(event)));

        generations = 10;
        assert(elapsedStop.interrupt(event));

        generations = 15;
        assert(elapsedStop.interrupt(event));
    }},

    testElapsedGenerationStopDefault: function() { with(this) {
        var elapsedStop = new Hybrid.Stop.ElapsedGeneration();

        var event = {
            population: {
                getGeneration: function() { return generations; }
            }
        };

        var generations = 10;
        assert(!(elapsedStop.interrupt(event)));

        generations = 100;
        assert(elapsedStop.interrupt(event));

        generations = 110;
        assert(elapsedStop.interrupt(event));
    }},

    testElapsedGenerationClassHierarchy: function() { with(this) {
        var elapsedStop = new Hybrid.Stop.ElapsedGeneration();

        assert(elapsedStop instanceof Hybrid.Stop.Condition);
        assert(elapsedStop instanceof Hybrid.Stop.ElapsedGeneration);
    }}
}, {'logger':testLogger, 'testLog':'stopLog'});

