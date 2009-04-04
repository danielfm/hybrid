/**
 * @fileOverview The Selection module provides some default selection
 * strategies you can use in your Genetic Algorithms. In Genetic Algorithms,
 * during each successive generation, a proportion of the existing population
 * is selected to breed a new generation. Individual solutions are selected
 * through a fitness-based process, where fitter solutions (as measured by a
 * fitness function) are typically more likely to be selected.
 * @author <a href="mailto:daniel.tritone@gmail.com">Daniel Fernandes Martins</a>
 */

/**
 * Creates a new selection strategy.
 * @class Dummy selection strategy implementation that just returns a random
 * individual from the population without consider its fitness.
 * @constructor
 */
Hybrid.Selection = function() {

    /**
     * Returns a random individual.
     * @param {Hybrid.Util.Randomizer} randomizer Randomizer.
     * @param {Hybrid.Population} population Population.
     * @return {object} Random individual.
     */
    this.select = function(randomizer, population) {
        var range = new Hybrid.Util.Range(population.getSize());
        return population.getIndividual(randomizer.next(range));
    };
};
Hybrid.Selection = new Hybrid.Class({
    initializer: Hybrid.Selection
});

/**
 * Creates a new tournament selection.
 * @class Implementation of the Tournament selection, which runs a "tournament"
 * among a few individuals chosen at random from the population and selects the
 * @constructor
 * @param {number} [rate=0.1] Number between 0 and 1 that determines the number
 * of individuals that will compete in the tournament. For example, if your
 * population contains 100 individuals, 0.5 means that this selection strategy
 * will pick 50 random individuals and return the best one.
 */
Hybrid.Selection.Tournament = function(rate) {

    /**
     * Number between 0 and 1 that determines the number of individuals that
     * will compete in the tournament.
     * @property
     * @type number
     * @private
     */
    rate = ((!rate || rate < 0) ? 0.1 : (rate > 1 ? 1 : rate));

    /**
     * Selects some random individuals from the population and returns the best
     * one.
     * @param {Hybrid.Util.Randomizer} randomizer Randomizer.
     * @param {Hybrid.Population} population Population.
     * @return {object} Best selected individual.
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
};
Hybrid.Selection.Tournament = new Hybrid.Class({
    extend: Hybrid.Selection,
    initializer: Hybrid.Selection.Tournament
});

/**
 * Creates a new ranking selection.
 * @class Implementation of the Ranking selection. This selection strategy
 * first ranks the individuals in such a way that the worst will have fitness
 * 1, second worst 2 etc. and the best will have fitness N (number of
 * individuals in the population). This method can lead to slower convergence,
 * because best individuals do not differ so much from other ones.
 * @constructor
 */
Hybrid.Selection.Ranking = function() {

    /**
     * Sums all ranking positions.
     * @param {Hybrid.Population} population Population.
     * @return {number} Sum of all ranking positions.
     * @private
     */
    function getRankingSum(population) {
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
     * @param {Hybrid.Util.Randomizer} randomizer Randomizer object.
     * @param {Hybrid.Population} population Current population.
     * @return {object} Selected individual.
     */
    this.select = function(randomizer, population) {
        var currentSum = 0;

        var size = population.getSize();
        var rankingSum = getRankingSum(population);
        var point = randomizer.next(new Hybrid.Util.Range(rankingSum));
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
Hybrid.Selection.Ranking = new Hybrid.Class({
    extend: Hybrid.Selection,
    initializer: Hybrid.Selection.Ranking
});

