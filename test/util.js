var FactoryStub = function(initialSize) {
    FactoryStub.superClass.apply(this, arguments);
    
    this.invocations = 0;

    this.createIndividual = function(randomizer, population) {
        if (!randomizer) {
            throw "Randomizer should not be null";
        }
        if (!population) {
            throw "Population should not be null";
        }

        this.invocations++;
        return {number: randomizer.next()};
    };
};
FactoryStub = new Hybrid.Class({
    extend: Hybrid.Individual.Factory,
    initializer: FactoryStub
});

var FitnessEvaluatorStub = function() {
    FitnessEvaluatorStub.superClass.apply(this, arguments);

    this.evaluate = function(individual, population) {
        if (!individual) {
            throw "Individual should not be null";
        }
        if (!population) {
            throw "Population should not be null";
        }
        return individual.number;
    };
};
FitnessEvaluatorStub = new Hybrid.Class({
    extend: Hybrid.Fitness.Evaluator,
    initializer: FitnessEvaluatorStub
});

var RandomizerStub = function() {
    RandomizerStub.superClass.apply(this, arguments);

    this.current = 0;
    this.results = [];
    this.randomizer = new Hybrid.Util.Randomizer();

    this.setResults = function(results) {
        this.current = 0;
        this.results = results;
    };

    this.next = function(range) {
        if (this.current >= this.results.length) {
            return this.randomizer.next(range);
        }
        return this.results[this.current++];
    };
};
RandomizerStub = new Hybrid.Class({
    extend: Hybrid.Util.Randomizer,
    initializer: RandomizerStub
});

var CrossoverStub = function(probability) {
    CrossoverStub.superClass.apply(this, arguments);

    this.emptyReturns = 0;
    this.nonEmptyReturns = 0;

    this.execute = function(randomizer, mother, father, population) {
        this.randomizer = randomizer;
        this.mother = mother;
        this.father = father;
        this.population = population;

        if (randomizer.probability(0.5)) {
            this.nonEmptyReturns++;
            return mother;
        }

        this.emptyReturns++;
    };
};
CrossoverStub = new Hybrid.Class({
    extend: Hybrid.Reproduction.Crossover,
    initializer: CrossoverStub 
});

var MutationStub = function(probability) {
    MutationStub.superClass.apply(this, arguments);

    this.emptyReturns = 0;
    this.nonEmptyReturns = 0;

    this.execute = function(randomizer, individual, population) {
        this.randomizer = randomizer;
        this.individual = individual;
        this.population = population;

        if (randomizer.probability(0.5)) {
            this.nonEmptyReturns++;
            return individual;
        }

        this.emptyReturns++;
    };
};
MutationStub = new Hybrid.Class({
    extend: Hybrid.Reproduction.Mutation,
    initializer: MutationStub 
});

