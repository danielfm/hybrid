var TestCases = {
    name: 'Engine',

    setup: function() {
    },

    teardown: function() {
    },

    testEngineConstructorWithNoArgs: function() { with(this) {
    }},

    testEngineConstructor: function() { with(this) {
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

