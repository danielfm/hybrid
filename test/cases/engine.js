var Engine_IndividualFactory = function() {
    this.create = function(randomizer, population) {
        return {number: randomizer.next(10)};
    };
};
Engine_IndividualFactory = new Hybrid.Class({
    extend: Hybrid.Individual.Factory,
    constructor: Engine_IndividualFactory
});

var Engine_FitnessEvaluator = function() {
    this.evaluate = function(individual, population) {
        return individual.number;
    };
};
Engine_FitnessEvaluator = new Hybrid.Class({
    extend: Hybrid.Fitness.Evaluator,
    constructor: Engine_FitnessEvaluator
});

var Engine_Randomizer = function() {
    this.current = 0;
    this.results = [];

    this.setResults = function(results) {
        this.current = 0;
        this.results = results;
    };

    this.next = function(range) {
        return this.results[this.current++];
    }
};
Engine_Randomizer = new Hybrid.Class({
    extend: Hybrid.Util.Randomizer,
    constructor: Engine_Randomizer
});

var TestCases = {
    name: 'Engine',

    setup: function() {
        this.randomizer = new Engine_Randomizer();
        this.individualFactory = new Engine_IndividualFactory();
        this.fitnessEvaluator = new Engine_FitnessEvaluator();

        this.population = new Hybrid.Population({
            individualFactory: this.individualFactory,
            initialSize: 10,
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

