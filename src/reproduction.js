/**
 * @fileOverview Provides base classes for genetic operators such as
 * crossover and mutation.
 * @author <a href="mailto:daniel.tritone@gmail.com">Daniel F. Martins</a>
 */

/**
 * Provides examples on how to create crossover and mutation strategies for
 * your Genetic Algorithms.
 * @namespace
 */
Hybrid.Reproduction = {};

/**
 * Creates a new dummy crossover strategy, which always returns
 * <code>null</code>.
 * @class Dummy class that shows how to implement a crossover strategy. In
 * Genetic Algorithms, the crossover is used to vary the programming of an
 * individual or individuals from one generation to the next. It is analogous
 * to reproduction and biological crossover, upon which Genetic Algorithms are
 * based.
 * @constructor
 * @param {number} probability Number between 0.01 and 1.0 that represents the
 * mutation probability.
 */
Hybrid.Reproduction.Crossover = function(probability) {

    probability = ((!probability || probability < 0.01) ? 0.01 :
          ((probability > 1) ? 1 : probability));

    /**
     * Get the probability.
     * @return {number} Number between 0.01 and 1.0 that represents the
     * mutation probability.
     */
    this.getProbability = function() {
        return probability;
    };

    /**
     * Executes the crossover logic according to probability.
     * @param {Hybrid.Randomizer} randomizer Randomizer object.
     * @param {object} mother Individual.
     * @param {object} father Other individual.
     * @param {Hybrid.Population} population Current population.
     * @return {object} Child individual.
     */
    this.execute = function(randomizer, mother, father, population) {
        if (randomizer.probability(probability)) {
            return this.crossover(randomizer, mother, father, population);
        }
        return null;
    };

    /**
     * Recombines two individuals and returns a child individual. This is a
     * do-nothing method and should be overriden by subclasses.
     * @param {Hybrid.Randomizer} randomizer Randomizer object.
     * @param {object} mother Individual.
     * @param {object} father Other individual.
     * @param {Hybrid.Population} population Current population.
     * @return {object} Child individual.
     */
    this.crossover = function(randomizer, individual, population) {
        return null;
    };
};
Hybrid.Reproduction.Crossover = new Hybrid.Class({
    constructor: Hybrid.Reproduction.Crossover
});

/**
 * Creates a new dummy mutation strategy, which always returns <code>null</code>.
 * @class Dummy class that shows how to implement a mutation strategy, which is
 * used to maintain genetic diversity from one generation of a population of
 * individuals to the next. It is analogous to biological mutation.
 * @constructor
 * @param {number} probability Number between 0.0 and 1.0 that represents the
 * mutation probability.
 */
Hybrid.Reproduction.Mutation = function(probability) {
 
    probability = ((!probability || probability < 0) ? 0 :
          ((probability > 1) ? 1 : probability));

    /**
     * Get the probability.
     * @return {number} Number between 0.01 and 1.0 that represents the
     * mutation probability.
     */
    this.getProbability = function() {
        return probability;
    };

    /**
     * Executes the mutation logic according to probability.
     * @param {Hybrid.Randomizer} randomizer Randomizer object.
     * @param {object} individual Individual.
     * @param {Hybrid.Population} population Current population.
     * @return {object} Mutated individual.
     */
    this.execute = function(randomizer, individual, population) {
        if (randomizer.probability(probability)) {
            return this.mutate(randomizer, individual, population);
        }
        return null;
    };

    /**
     * Returns a mutated copy of the given individual. This is a do-nothing
     * method and should be overriden by subclasses.
     * @param {Hybrid.Randomizer} randomizer Randomizer object.
     * @param {object} individual Individual.
     * @param {Hybrid.Population} population Current population.
     * @return {object} Mutated individual.
     */
    this.mutate = function(randomizer, individual, population) {
        return null;
    };
};

Hybrid.Reproduction.Mutation = new Hybrid.Class({
    constructor: Hybrid.Reproduction.Mutation
});

