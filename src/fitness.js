/**
 * The Fitness module provides sample classes that shows how to implement the
 * fitness logic of a Genetic Algorithm. The fitness function is  defined over
 * the genetic representation and measures the quality of a given individual
 * (solution), and plays an important role during the natural selection since
 * fitter solutions (as measured by the fitness function) are typically more
 * likely to be selected.
 * @module fitness
 * @namespace Hybrid.Fitness
 * @title Fitness
 */
Hybrid.Fitness = {};

/**
 * Abstract class that shows how to define a fitness evaluator.
 * @class Evaluator
 * @constructor
 */
Hybrid.Fitness.Evaluator = function() {
    
    /**
     * Compute the fitness value of an individual.
     * @param individual {object} Individual.
     * @param population {Hybrid.Population} Population that holds the given
     * individual.
     * @return {number} Fitness value.
     */
    this.evaluate = function(individual, population) {
        return 0.0;
    };
};


/**
 * Default comparator used to sort the individuals according to its fitness.
 * @class Comparator
 * @constructor
 * @param inverse {boolean} By default, Hybrid considers greater fitness values
 * better than smaller fitness values, but this is not a rule. So, to make
 * Hybrid consider smaller fitness values better than greater ones, pass
 * <code>true</code> to this argument.
 */
Hybrid.Fitness.Comparator = function(inverse) {
    
    /**
     * Compares two individuals.
     * @param individual {object} First individual.
     * @param other {object} Other individual.
     * @return {number} Returns something smaller than zero if
     * <code>individual</code> is considered better than <code>other</code>.
     * Returns something greater than zero if <code>individual</code> is
     * considered worse than <code>other</code>. Returns zero if both
     * individuals are considered equivalent.
     */
    this.compare = function(individual, other) {
        return (other.fitness.get() - individual.fitness.get()) * ((inverse) ? -1 : 1);
    };
};

