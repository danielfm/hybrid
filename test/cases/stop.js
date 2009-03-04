var TestCases = {
    name: 'Stop Conditions',
    
    setup: function() {
        this.stop = new Hybrid.Stop.ElapsedGeneration(10);
    },
  
    teardown: function() {
    },
    
    testElapsedGenerationStop: function() { with(this) {
        var event = {
            population: {
                getGeneration: function() { return 5; }
            }
        };
        assertFalse(stop.interrupt(event));
        
        event.population.getGeneration = function() {
            return 10;
        };
        assertTrue(stop.interrupt(event));
    }},
    
    testElapsedGenerationStopDefault: function() { with(this) {
        stop = new Hybrid.Stop.ElapsedGeneration();
        var event = {
            population: {
                getGeneration: function() { return 10; }
            }
        };
        assertFalse(stop.interrupt(event));
        
        event.population.getGeneration = function() {
            return 100;
        };
        assertTrue(stop.interrupt(event));
    }}
};

new Test.Unit.Runner(TestCases, {'testLog':'stopLog', 'callback':testCallback});

