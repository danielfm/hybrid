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
 * Only characters between 'a' and 'z'
 */
function getRandomChar(randomizer) {
    return String.fromCharCode(randomizer.next(new Hybrid.Util.Range(97, 123)));
};

/*
 * Factory used to create random words
 */
var WordFactory = function(size) {
    this.create = function(randomizer, population) {
        var word = '';
        for (var i = 0; i < size; i++) {
            word += getRandomChar(randomizer);
        }
        return {word: word};
    };
};

/*
 * The fitness value is calculated based on how similar a word is compared
 * to the expected one.
 */
var WordFitnessEvaluator = function(expected) {
    this.evaluate = function(individual, population) {
        var fitness = 0;
        var size = individual.word.length;
        for (var i = 0; i < size; i++) {
            if (individual.word[i] == expected[i]) {
                fitness++;
            }
        }
        return fitness;
    };
};

/*
 * The crossover strategy consists in merging two words into one.
 */
var WordCrossover = function(probability, expected) {
    this.expectedRange = new Hybrid.Util.Range(expected.length);
    
    this.crossover = function(randomizer, mother, father, population) {
        // We skip the crossover according to the configuration
        if (!randomizer.probability(probability)) {
            return null;
        }
        
        var point = parseInt(randomizer.next(this.expectedRange));
        var word = father.word.substr(0, point);
        word += mother.word.substr(point);
        return {word: word};
    }
};

/*
 * The mutation strategy consists in replacing a letter with a randomly
 * generated character.
 */
var WordMutation = function(probability, expected) {
    this.expectedRange = new Hybrid.Util.Range(expected.length);
    
    this.mutate = function(randomizer, individual, population) {
        // We skip the mutation according to the configuration
        if (!randomizer.probability(probability)) {
            return null;
        }
        
        var word = individual.word;
        var point = parseInt(randomizer.next(this.expectedRange));
        word = word.substr(0, point) + getRandomChar(randomizer) + word.substr(point + 1);
        return {word:word};
    }
};

/*
 * We should keep the evolution running until we get the expected word.
 */
var StopCondition = function(expected) {
    this.interrupt = function(event) {
        var best = event.population.best();
        if (best.word == expected) {
            // Re-enable the button and show a message
            $('#evolve').val('Start the evolution!').attr('disabled', false);
            alert('The algorithm took ' + event.population.getGeneration() + ' generations to find your word.');
            return true;
        }
    };
};

function evolve() {
    // Number of individuals of the population
    var populationSize = parseInt($('#populationSize').val());

    // Crossover probability (0%-100%)
    var crossoverProbability = parseFloat($('#crossoverProbability').val());

    // Mutation probability (0%-100%)
    var mutationProbability = parseFloat($('#mutationProbability').val());

    // Expected word that should be found by our genetic algorithm
    var expected = $('#expected').val();
    if (!/^[a-z]+$/.test(expected)) {
        alert('Only lowercase characters between "a" and "z" are allowed.');
        return;
    }
    
    // Selection strategy used to select individuals for breeding based on their fitness
    var selectionStrategy = $('#selectionStrategy').val();
    var selection = ((selectionStrategy == 1) ?
            new Hybrid.Selection.Ranking() :
            new Hybrid.Selection.Tournament(parseFloat($('#tournamentSize').val())));

    // Set up the opulation to be evolved
    var wordPopulation = new Hybrid.Population({
        initialSize: populationSize,
        individualFactory: new WordFactory(expected.length),
        fitnessEvaluator: new WordFitnessEvaluator(expected)
    });
    
    // Plug elitism listener if needed
    var elitismSize = parseInt($('#elitismSize').val());
    if (elitismSize > 0) {
        Hybrid.Population.addElitism({
            to: wordPopulation,
            size: elitismSize
        });
    }
    
    // Condition that specifies when the evolution should be interrupted
    var stopCondition = new StopCondition(expected);

    // Create the evolution engine
    var engine = new Hybrid.Engine({
        stopCondition: stopCondition,
        population: wordPopulation,
        selection: selection,
        crossover: new WordCrossover(crossoverProbability/100, expected),
        mutation: new WordMutation(mutationProbability/100, expected)
    });
    
    // Start the evolution and disable the button
    engine.evolve();
    $('#evolve').val('Please wait...').attr('disabled', true);
}
