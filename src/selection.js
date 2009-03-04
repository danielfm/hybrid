/**
 * The Selection module provides some default selection strategies you can
 * use in your Genetic Algorithms. In Genetic Algorithms, during each
 * successive generation, a proportion of the existing population is selected
 * to breed a new generation. Individual solutions are selected through a
 * fitness-based process, where fitter solutions (as measured by a fitness
 * function) are typically more likely to be selected.
 * @module selection
 * @namespace Hybrid
 * @title Selection
 */

/**
 * Dummy selection strategy implementation that just returns a random
 * individual from the population without consider its fitness.
 * @class Selection
 * @constructor
 */
Hybrid.Selection = function() {
    
    /**
     * Returns a random individual.
     * @method select
     * @param randomizer {Hybrid.Randomizer} Randomizer object.
     * @param population {Hybrid.Population} Current population.
     * @return {object} Random individual.
     */
    this.select = function(randomizer, population) {
        var range = new Hybrid.Util.Range(population.getSize());
        return population.getIndividual(randomizer.next(range));
    };
};

/**
 * Implementation of the Tournament selection, which runs a "tournament" among
 * a few individuals chosen at random from the population and selects the
 * winner (the one with the best fitness).
 * @class Selection.Tournament
 * @constructor
 * @param rate {number} Number between 0 and 1 that determines the number
 * of individuals that will compete in the tournament. For example, if your
 * population contains 100 individuals, 0.5 means that this selection strategy
 * will pick 50 random individuals and return the best one.
 */
Hybrid.Selection.Tournament = function(rate) {
    
    /**
     * Picks random individuals from the population and returns the best.
     * @method select
     * @param randomizer {Hybrid.Randomizer} Randomizer object.
     * @param population {Hybrid.Population} Current population.
     * @return {object} Selected individual.
     */
    this.select = function(randomizer, population) {
        var best = null;
        
        var size = population.getSize();
        var range = new Hybrid.Util.Range(size);
        var total = size * rate;
        
        for (var i = 0; i < total; i++) {
            var chosen = parseInt(randomizer.next(range));
            var individual = population.getIndividual(chosen);
            if (best == null || individual.fitness.isBetterThan(best)) {
                best = individual;
            }
        }
        
        return best;
    };
    
    /**
     * Number between 0 and 1 that determines the number of individuals that
     * will compete in the tournament.
     * @property rate
     * @private
     * @type number
     */
    rate = ((!rate || rate < 0) ? 0.1 : (rate > 1 ? 1 : rate));
};

/**
 * Implementation of the Ranking selection. This selection strategy first ranks
 * the individuals in such a way that the worst will have fitness 1, second
 * worst 2 etc. and the best will have fitness N (number of individuals in
 * the population). This method can lead to slower convergence, because best
 * individuals do not differ so much from other ones.
 * @class Selection.Ranking
 * @constructor
 */
Hybrid.Selection.Ranking = function() {
    
    /**
     * Gets the sum of rankings of all individuals of the given population.
     * @method getWheelSize
     * @param population {Hybrid.Population} Current population.
     * @return {number} Sum of rankings of all individuals of the given
     * population.
     * @private
     */
    function getWheelSize(population) {
        population.sort();
        
        var total = 0;
        var size = population.getSize();
        for (var i = 0; i < size; i++) {
            total += i;
        }
        return total;
    }
    
    /**
     * Picks a random individual from the population in such a way that
     * individuals with better fitness values are more likely to be selected
     * than other ones.
     * @method select
     * @param randomizer {Hybrid.Randomizer} Randomizer object.
     * @param population {Hybrid.Population} Current population.
     * @return {object} Selected individual.
     */
    this.select = function(randomizer, population) {
        var currentSum = 0;
        
        var size = population.getSize();
        var wheelSize = getWheelSize(population);
        var point = randomizer.next(new Hybrid.Util.Range(wheelSize));
        var last = size - 1;
        
        for (var i = 0; i < size; i++, last--) {
            currentSum += last;
            if (point < currentSum) {
                return population.getIndividual(i);
            }
        }
        
        return population.best();
    };
};
