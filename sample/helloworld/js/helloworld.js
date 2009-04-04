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

/*
 * Returns a character between 'a' and 'z'.
 */
function getRandomChar(randomizer) {
    return String.fromCharCode(randomizer.next(new Hybrid.Util.Range(97, 123)));
};

/*
 * Factory used to create random words.
 */
var WordFactory = new Hybrid.Class({
    extend: Hybrid.Individual.Factory,
    initializer: function(populationSize, wordLength) {
        WordFactory.superClass.apply(this, arguments);

        this.createIndividual = function(randomizer, population) {
            var word = '';
            for (var i = 0; i < wordLength; i++) {
                word += getRandomChar(randomizer);
            }
            return {word: word};
        };
    }
});

/*
 * Fitness evaluator used to compare a word agains the expected one.
 */
var WordFitnessEvaluator = new Hybrid.Class({
    extend: Hybrid.Fitness.Evaluator,
    initializer: function(expectedWord) {
        WordFitnessEvaluator.superClass.apply(this, arguments);

        /*
         * Calculates the fitness of a word.
         */
        this.evaluate = function(individual) {
            var fitness = 0;
            var size = individual.word.length;
            for (var i = 0; i < size; i++) {
                if (individual.word[i] == expectedWord[i]) {
                    fitness++;
                }
            }
            return fitness;
        };
    }
});

/*
 * Crossover strategy that combines two words to produce a 'child'.
 */
var WordCrossover = new Hybrid.Class({
    extend: Hybrid.Reproduction.Crossover,
    initializer: function(probability, expectedWord) {
        WordCrossover.superClass.apply(this, arguments);

        /*
         * Range that represents the length of the expected word.
         */
        expectedRange = new Hybrid.Util.Range(expectedWord.length);

        /*
         * Recombine two words.
         */
        this.crossover = function(randomizer, mother, father) {
            var point = parseInt(randomizer.next(expectedRange));
            var word = father.word.substr(0, point);
            word += mother.word.substr(point);
            return {word: word};
        };
    }
});

/*
 * Mutation strategy that performs small changes to words to improve population
 * diversity.
 */
var WordMutation = new Hybrid.Class({
    extend: Hybrid.Reproduction.Mutation,
    initializer: function(probability, expectedWord) {
        WordMutation.superClass.apply(this, arguments);

        /*
         * Range that represents the length of the expected word.
         */
        var expectedRange = new Hybrid.Util.Range(expectedWord.length);

        /*
         * Mutate a word.
         */
        this.mutate = function(randomizer, individual) {
            var word = individual.word;
            var point = parseInt(randomizer.next(expectedRange));
            word = word.substr(0, point) + getRandomChar(randomizer) + word.substr(point + 1);
            return {word:word};
        };
    }
});

/*
 * Our GA must run until the expected word is found.
 */
var ExpectedWordStopCondition = new Hybrid.Class({
    extend: Hybrid.Stop.Condition,
    initializer: function(expectedWord) {
        ExpectedWordStopCondition.superClass.apply(this, arguments);

        /*
         * Interrupts the evolution when the best word matches the expected word.
         */
        this.interrupt = function(event) {
            var best = event.population.best();
            if (best.word == expectedWord) {
                $('#evolve').val('Start the evolution!').removeAttr('disabled');
                alert('The algorithm took ' + event.population.getGeneration() + ' generations to find your word.');
                return true;
            }
        };
    }
});

/*
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
    var chosenSelectionStrategy = $('#selectionStrategy').val();
    var selectionStrategy = ((chosenSelectionStrategy == 1) ?
            new Hybrid.Selection.Ranking() :
            new Hybrid.Selection.Tournament(parseFloat($('#tournamentSize').val())));

    // Set up the population to be evolved
    var wordPopulation = new Hybrid.Population({
        elitismSize: elitismSize,
        factory: new WordFactory(populationSize, expectedWord.length),
        fitnessEvaluator: new WordFitnessEvaluator(expectedWord)
    });

    // Condition that specifies when the evolution should be interrupted
    var expectedWordStopCondition = new ExpectedWordStopCondition(expectedWord);

    // Crossover strategy
    var wordCrossover = new WordCrossover(crossoverProbability/100, expectedWord);

    // Mutation strategy
    var wordMutation = new WordMutation(mutationProbability/100, expectedWord);

    // Create the evolution engine
    var engine = new Hybrid.Engine({
        stopCondition: expectedWordStopCondition,
        population: wordPopulation,
        selection: selectionStrategy,
        crossover: wordCrossover,
        mutation: wordMutation
    });

    // Start the evolution
    engine.evolve();
    $('#evolve').val('Please wait...').attr('disabled', 'disabled');
}

