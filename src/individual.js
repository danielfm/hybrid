/**
 * @fileOverview Provides classes to create and handle individuals. In
 * Genetic Algorithms, an individual is an abstract representation of a
 * candidate solution to an optimization problem that evolves toward better
 * solutions.
 * @author <a href="mailto:daniel.tritone@gmail.com">Daniel Fernandes Martins</a>
 */

/**
 * Provides methods to monkeypatch individuals in order to allow them to
 * easily calculate, cache and reset their fitness values.
 * @namespace
 * @static
 */
Hybrid.Individual = {

    /**
     * Adds some methods to the individual object in order to allow it to
     * easily calculate, cache and reset its fitness value.
     * @param {object} individual Individual.
     * @param {Hybrid.Population} population Current population.
     * @static
     */
    plugFitnessLogic: function(individual, population) {
        Hybrid.Individual.assertMonkeypatch(individual);

        var fitness = null;

        /**
         * All patched invididuals receive a <code>fitness</code> attribute,
         * which allows it to calculate its own fitness and compare itself
         * with other individuals without require any external dependencies
         * (such as the fitness comparator and the fitness evaluator).
         */
        var patch = {

            /**
             * This attribute is used to identify that an individual
             * has been patched successfully by this method.
             */
            _$: true,

            /**
             * Calculates the fitness for this individual.
             * @return {number} Fitness value.
             */
            get: function() {
                if (fitness != null) {
                    return fitness;
                }
                fitness = population.evaluateFitness(individual);
                return fitness;
            },

            /**
             * It's recommended to always work with <em>immutable</em>
             * individuals. However, in some situations, the individuals
             * must have the hability to change its internal state
             * during the evolution. Since all fitness values are
             * cached to improve performance, this method should be used
             * to invalidate the cached fitness.
             */
            reset: function() {
                fitness = null;
                population.expireCache();
            },

            /**
             * Compares this individual with another.
             * @param {object} other Other individual.
             * @return Whether this individual is considered better
             * than the other.
             */
            isBetterThan: function(other) {
                return population.compareIndividuals(other, individual) > 0;
            }
        };

        individual.fitness = patch;
    },

    /**
     * Check if the individual can be monkeypatched without override any
     * of its properties or methods.
     * @param {object} individual Individual.
     * @throws {Hybrid.Error} If the given individual cannot be patched.
     * @static
     */
    assertMonkeypatch: function(individual) {
        if (individual.fitness && !individual.fitness._$) {
            throw new Hybrid.Error('Cannot override individual attribute: fitness');
        }
    }
};

/**
 * Creates a new factory of individuals.
 * @class When a population is initialized, it uses an instance of this class
 * to produce an arbitrary number of random individuals to serve as the first
 * generation if none is given.
 * @constructor
 * @param {number} Number of individuals that should be created by this
 * factory during the population initialization.
 */
Hybrid.Individual.Factory = function(initialSize) {

    initialSize = ((!initialSize || initialSize < 0) ? 100 : initialSize);

    /**
     * Get the number of individuals that should be created by this factory
     * during the population initialization.
     * @return {number} Number of individuals.
     */
    this.getInitialSize = function() {
        return initialSize;
    };

    /**
     * Default method that fills the given population with an arbitrary
     * number of random individuals.
     * @param {Hybrid.Randomizer} randomizer Randomizer object.
     * @param {Hybrid.Population} population Current population.
     */
    this.createInitialPopulation = function(randomizer, population) {
        while (population.getSize() < initialSize) {
            var individual = this.createIndividual(randomizer, population);
            if (individual) {
                population.add(individual);
            }
        }
    };

    /**
     * Create a random individual. This method should be overriden by
     * subclasses.
     * @param {Hybrid.Util.Randomizer} randomizer Randomizer object.
     * @param {Hybrid.Population} population Current population.
     * @return {object} Individual.
     */
    this.createIndividual = function(randomizer, population) {
        return {};
    };
};

Hybrid.Individual.Factory = new Hybrid.Class({
    initializer: Hybrid.Individual.Factory
});

