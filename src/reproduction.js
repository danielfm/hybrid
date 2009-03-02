/**
 * The Reproduction module provides examples on how to create crossover and
 * mutation strategies for your Genetic Algorithms.
 * @module reproduction
 * @namespace Hybrid.Reproduction
 * @title Reproduction
 */
Hybrid.Reproduction = {};

/**
 * Abstract class that shows how to implement a crossover strategy. In Genetic
 * Algorithms, the crossover is used to vary the programming of an individual
 * or individuals from one generation to the next. It is analogous to
 * reproduction and biological crossover, upon which Genetic Algorithms are
 * based.
 * @class Crossover
 * @constructor
 */
Hybrid.Reproduction.Crossover = function() {
    
    /**
     * Combines two individuals in order to produce a child individual that
     * shares many of the characteristics of its parents.
     * @method crossover
     * @param randomizer {Hybrid.Randomizer} Randomizer object.
     * @param mother {object} Individual.
     * @param father {object} Other individual.
     * @param population {Hybrid.Population} Current population.
     * @return {object} Child individual.
     */
    this.crossover = function(randomizer, mother, father, population) {
        return null;
    };
};

/**
 * Abstract class that shows how to implement a mutation strategy, which is
 * used to maintain genetic diversity from one generation of a population of
 * chromosomes to the next. It is analogous to biological mutation.
 * @class Mutation
 * @constructor
 */
Hybrid.Reproduction.Mutation = function() {
    
    /**
     * Returns a mutated copy of the given individual.
     * @method mutate
     * @param randomizer {Hybrid.Randomizer} Randomizer object.
     * @param individual {object} Individual.
     * @param population {Hybrid.Population} Current population.
     * @return {object} Mutated individual.
     */
    this.mutate = function(randomizer, individual, population) {
        return null;
    };
};

