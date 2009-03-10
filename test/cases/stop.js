var TestCases = {
    name: 'Stop Conditions',

    setup: function() {
    },

    teardown: function() {
    },

    testStopCondition: function() { with(this) {
        var stop = new Hybrid.Stop.Condition();
        assertTrue(stop.interrupt());
    }},

    testStopConditionClassHierarchy: function() { with(this) {
        var stop = new Hybrid.Stop.Condition();
        assertTrue(stop instanceof Hybrid.Stop.Condition);
        assertFalse(stop instanceof Hybrid.Stop.ElapsedGeneration);
    }},

    testElapsedGenerationStop: function() { with(this) {
        var elapsedStop = new Hybrid.Stop.ElapsedGeneration(10);

        var event = {
            population: {
                getGeneration: function() { return generations; }
            }
        };

        var generations = 5;
        assertFalse(elapsedStop.interrupt(event));

        generations = 10;
        assertTrue(elapsedStop.interrupt(event));

        generations = 15;
        assertTrue(elapsedStop.interrupt(event));
    }},

    testElapsedGenerationStopDefault: function() { with(this) {
        var elapsedStop = new Hybrid.Stop.ElapsedGeneration();

        var event = {
            population: {
                getGeneration: function() { return generations; }
            }
        };

        var generations = 10;
        assertFalse(elapsedStop.interrupt(event));

        generations = 100;
        assertTrue(elapsedStop.interrupt(event));

        generations = 110;
        assertTrue(elapsedStop.interrupt(event));
    }},

    testElapsedGenerationClassHierarchy: function() { with(this) {
        var elapsedStop = new Hybrid.Stop.ElapsedGeneration();

        assertTrue(elapsedStop instanceof Hybrid.Stop.Condition);
        assertTrue(elapsedStop instanceof Hybrid.Stop.ElapsedGeneration);
    }}
};

new Test.Unit.Runner(TestCases, {'testLog':'stopLog', 'logger':testLogger});

