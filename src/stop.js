/**
 * The Stop module provides some default stop conditions you can use in your
 * Genetic Algorithms.
 * @module stop
 * @namespace Hybrid.Stop
 * @title Stop Condition
 */
Hybrid.Stop = {};

/**
 * Stop condition that evolves a population for the given number of
 * generations before interrupts the evolution.
 * @class ElapsedGeneration
 * @constructor
 * @param generations {number} Number of generations evolve.
 */
Hybrid.Stop.ElapsedGeneration = function(generations) {
    /**
     * Number of generations to evolve before interrupt the evolution.
     * @private
     * @property generations
     * @type number
     */
    generations = ((!generations || generations < 0) ? 100 : generations);
    
    /**
     * Interrupts the evolution after evolving a given number of generations.
     * @method interrupt
     * @param event {object} Event object provided by the engine.
     * @return {boolean} Whether the Genetic Algorithm should be interrupted
     * or not.
     */
    this.interrupt = function(event) {
        return (event.population.getGeneration() == generations);
    };
};

