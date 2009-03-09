/**
 * @fileOverview Ready to use stop conditions.
 * @author <a href="mailto:daniel.tritone@gmail.com">Daniel Fernandes Martins</a>
 */

/**
 * Provides some default stop conditions you can use in your Genetic
 * Algorithms. A stop condition is a component that is used by
 * {@link Hybrid.Engine} to control the evolution interruption.
 * @namespace
 */
Hybrid.Stop = {};

/**
 * Creates a new generation-based stop condition.
 * @class Stop condition that evolves a population for the given number of
 * generations before interrupts the evolution.
 * @constructor
 * @param {number} [generations=100] Number of generations to evolve.
 */
Hybrid.Stop.ElapsedGeneration = function(generations) {

    /**
     * Number of generations to evolve before interrupt the evolution.
     * @private
     * @property
     * @type number
     */
    generations = ((!generations || generations < 0) ? 100 : generations);
    
    /**
     * Interrupts the evolution after evolving a given number of generations.
     * @param {object} event Event object provided by {@link Hybrid.Engine}.
     * @return {boolean} Whether the Genetic Algorithm should be interrupted
     * or not.
     */
    this.interrupt = function(event) {
        return (event.population.getGeneration() == generations);
    };
};

