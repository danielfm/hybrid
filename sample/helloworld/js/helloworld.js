/*
 * User interaction code.
 */
$('document').ready(function() {
    var selectionStrategy = $('#selectionStrategy');
    selectionStrategy.change(function() {
        var param = $('#selectionParam');
        if (selectionStrategy.val() == 2) {
            param.show();
        } else {
            param.hide();
        }
    });
});

/**
 * Only characters between 'a' and 'z'.
 * @param {Hybrid.Util.Randomizer} randomizer Randomizer.
 * @return {string} Random character between 'a' and 'z'.
 */
function getRandomChar(randomizer) {
    return String.fromCharCode(randomizer.next(new Hybrid.Util.Range(97, 123)));
};

/**
 * Creates a new word factory.
 * @class Factory used to create random words.
 * @constructor
 * @param {number} populationSize Population size.
 * @param {number} wordLength Word length in characters.
 */
var WordFactory = function(populationSize, wordLength) {
    WordFactory.superClass.apply(this, arguments);

    /**
     * Creates a random word.
     * @param {Hybrid.Util.Randomizer} randomizer Randomizer.
     * @param {Hybrid.Population} population Population.
     * @return {object} Random word.
     */
    this.createIndividual = function(randomizer, population) {
        var word = '';
        for (var i = 0; i < wordLength; i++) {
            word += getRandomChar(randomizer);
        }
        return {word: word};
    };
};
WordFactory = new Hybrid.Class({
    extend: Hybrid.Individual.Factory,
    constructor: WordFactory
});

/**
 * Creates a new word fitness evaluator.
 * @class The fitness value is calculated based on how similar a word is
 * compared to the expected one.
 * @constructor
 * @param {string} expectedWord Expected word to compare against.
 */
var WordFitnessEvaluator = function(expectedWord) {
    WordFitnessEvaluator.superClass.apply(this, arguments);

    /**
     * Calculates the fitness of a word.
     * @param {object} individual Word.
     * @param {Hybrid.Population} population Population.
     * @return {number} Fitness value.
     */
    this.evaluate = function(individual, population) {
        var fitness = 0;
        var size = individual.word.length;
        for (var i = 0; i < size; i++) {
            if (individual.word[i] == expectedWord[i]) {
                fitness++;
            }
        }
        return fitness;
    };
};
WordFitnessEvaluator = new Hybrid.Class({
    extend: Hybrid.Fitness.Evaluator,
    constructor: WordFitnessEvaluator 
});

/**
 * Creates a new word crossover strategy.
 * @class The crossover strategy consists in merging two words into one.
 * @constructor
 * @param {number} probability Number between 0.01 and 1.0.
 * @param {string} expectedWord Expected word.
 */
var WordCrossover = function(probability, expectedWord) {
    WordCrossover.superClass.apply(this, arguments);

    /**
     * Range that represents the length of the expected word.
     * @property
     * @type Hybrid.Util.Range
     * @private
     */
    expectedRange = new Hybrid.Util.Range(expectedWord.length);

    /**
     * Recombine two words.
     * @param {Hybrid.Util.Randomizer} randomizer Randomizer.
     * @param {object} mother Word.
     * @param {object} father Other word.
     * @return {object} Child word.
     */
    this.crossover = function(randomizer, mother, father) {
        var point = parseInt(randomizer.next(expectedRange));
        var word = father.word.substr(0, point);
        word += mother.word.substr(point);
        return {word: word};
    }
};
WordCrossover = new Hybrid.Class({
    extend: Hybrid.Reproduction.Crossover,
    constructor: WordCrossover 
});

/**
 * Creates a new word mutation strategy.
 * @class The mutation strategy consists in replacing a letter with a
 * randomly generated character.
 * @constructor
 * @param {number} probability Number between 0.0 and 1.0.
 * @param {string} expectedWord Expected word.
 */
var WordMutation = function(probability, expectedWord) {
    WordMutation.superClass.apply(this, arguments);

    /**
     * Range that represents the length of the expected word.
     * @property
     * @type Hybrid.Util.Range
     * @private
     */
    var expectedRange = new Hybrid.Util.Range(expectedWord.length);

    /**
     * Mutate a word.
     * @param {Hybrid.Util.Randomizer} randomizer Randomizer.
     * @param {object} individual Word.
     * @return {object} Mutated word.
     */
    this.mutate = function(randomizer, individual) {
        var word = individual.word;
        var point = parseInt(randomizer.next(expectedRange));
        word = word.substr(0, point) + getRandomChar(randomizer) + word.substr(point + 1);
        return {word:word};
    }
};
WordMutation = new Hybrid.Class({
    extend: Hybrid.Reproduction.Mutation,
    constructor: WordMutation 
});

/**
 * Creates a new stop condition.
 * @class We should keep the evolution running until we get the expected word.
 * @constructor
 * @param {string} expectedWord Expected word.
 */
var StopCondition = function(expectedWord) {
    StopCondition.superClass.apply(this, arguments);

    /**
     * Interrupts the evolution when the best word matches the expected word.
     * @param {object} event Event object.
     * @return {boolean} Whether the evolution should be interrupted.
     */
    this.interrupt = function(event) {
        var best = event.population.best();
        if (best.word == expectedWord) {
            $('#evolve').val('Start the evolution!').removeAttr('disabled');
            alert('The algorithm took ' + event.population.getGeneration() + ' generations to find your word.');
            return true;
        }
    };
};
StopCondition = new Hybrid.Class({
    extend: Hybrid.Stop.Condition,
    constructor: StopCondition 
});

/**
 * Evolves a population of random words.
 */
function evolve() {
    // Number of individuals of the population
    var populationSize = parseInt($('#populationSize').val());

    // Elitism size
    var elitismSize = parseInt($('#elitismSize').val());

    // Crossover probability (0%-100%)
    var crossoverProbability = parseFloat($('#crossoverProbability').val());

    // Mutation probability (0%-100%)
    var mutationProbability = parseFloat($('#mutationProbability').val());

    // Expected word that should be found by our genetic algorithm
    var expectedWord = $('#expected').val();
    if (!/^[a-z]+$/.test(expectedWord)) {
        alert('Only lowercase characters between "a" and "z" are allowed.');
        return;
    }

    // Selection strategy used to select individuals for breeding based on their fitness
    var selectionStrategy = $('#selectionStrategy').val();
    var selection = ((selectionStrategy == 1) ?
            new Hybrid.Selection.Ranking() :
            new Hybrid.Selection.Tournament(parseFloat($('#tournamentSize').val())));

    // Set up the population to be evolved
    var wordPopulation = new Hybrid.Population({
        elitismSize: elitismSize,
        factory: new WordFactory(populationSize, expectedWord.length),
        fitnessEvaluator: new WordFitnessEvaluator(expectedWord)
    });

    // Condition that specifies when the evolution should be interrupted
    var stopCondition = new StopCondition(expectedWord);

    // Crossover strategy
    var crossover = new WordCrossover(crossoverProbability/100, expectedWord);

    // Mutation strategy
    var mutation = new WordMutation(mutationProbability/100, expectedWord);

    // Create the evolution engine
    var engine = new Hybrid.Engine({
        stopCondition: stopCondition,
        population: wordPopulation,
        selection: selection,
        crossover: crossover,
        mutation: mutation
    });

    //  Start the evolution
    engine.evolve();
    $('#evolve').val('Please wait...').attr('disabled', 'disabled');
}

