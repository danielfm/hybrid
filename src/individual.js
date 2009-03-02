/**
 * The Individual module provides classes to create and handle individuals. In
 * Genetic Algorithms, an individual is an abstract representation of a
 * candidate solution to an optimization problem that evolves toward better
 * solutions.
 * @module individual
 * @namespace Hybrid
 * @title Individual
 */

/**
 * This class provides methods to monkeypatch individuals in order to allow
 * them to easily calculate, cache and reset their fitness values.
 * @class Individual
 * @static
 */
Hybrid.Individual = {
    
    /**
     * Adds some methods to the individual object in order to allow it to
     * easily calculate, cache and reset its fitness value.
     * @method plugFitnessLogic
     * @param individual {object} Individual.
     * @param population {Hybrid.Population} Current population.
     * @static
     */
    plugFitnessLogic: function(individual, population) {
        Hybrid.Individual.assertMonkeypatch(individual);
        var fitness = null;
        
        individual.fitness = {
            _$: true,
            
            get: function() {
                if (fitness != null) {
                    return fitness;
                }
                fitness = population.evaluateFitness(individual);
                return fitness;
            },
            
            reset: function() {
                fitness = null;
                population.expireCache();
            },
            
            isBetterThan: function(other) {
                return population.compareIndividuals(other, individual) > 0;
            }
        };
    },
    
    /**
     * Check if the individual can be monkeypatched without override any
     * of its properties or methods.
     * @method assertMonkeypatch
     * @param individual {object} Individual.
     * @return {boolean} Whether the given individual can be patched or not.
     * @throws Hybrid.Individual.PlugFitnessError
     * @static
     */
    assertMonkeypatch: function(individual) {
        if (individual.fitness && !individual.fitness._$) {
            throw new Hybrid.Individual.PlugFitnessError('fitness');
        }
    }
};


/**
 * When a population is initialized, it uses an instance of this class to
 * produce an arbitrary number of random individuals to serve as the first
 * generation.
 * produce the first generation.
 * @class Individual.Factory
 * @constructor
 */
Hybrid.Individual.Factory = function() {
    
    /**
     * Creates a random individual.
     * @method create
     * @param randomizer {Hybrid.Randomizer} Randomizer object.
     * @param population {Hybrid.Population} Current population.
     * @return {object} Individual.
     */
    this.create = function(randomizer, population) {
        return null;
    };
};

/**
 * This error is thrown when an individual cannot be monkeypatched.
 * @class Individual.PlugFitnessError
 * @constructor
 * @param attr {string} Name of the attribute that is already being used by the
 * individual before the patching.
 */
Hybrid.Individual.PlugFitnessError = function(attr) {
    /**
     * Error message.
     * @property message
     * @type string
     */
    this.message = 'Cannot override individual attribute: ' + attr;
    
    /**
     * Error name.
     * @property name
     * @type string
     */
    this.name = 'PlugFitnessError';
};

