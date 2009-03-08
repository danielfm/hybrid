/*
 * Hybrid, The Genetic Algorithm Framework v@VERSION
 * http://github.com/danielfm/hybrid/tree
 *
 * Copyright (c) 2009 Daniel Fernandes Martins
 * Licensed under the BSD license.
 *
 * Revision: @REV
 * Date:     @DATE
 */


/**
 * The Hybrid module provides a common implementation of the main loop of a
 * Genetic Algorithm.
 * @module hybrid
 * @namespace Hybrid
 * @title Hybrid
 */
Hybrid = {
    /**
     * This field is used to keep the build number that created the file.
     * @property version
     * @type string
     * @static
     */
    version: '@VERSION'
};

/**
 * Basic implementation of the main loop of a Genetic Algorithm, which
 * consists in:
 * <ol>
 *   <li>Produce initial population;</li>
 *   <li>Repeat until stop condition is satisfied:
 *   <ol>
 *     <li>Select best-ranking individuals to reproduce;</li>
 *     <li>Breed new generation through crossover and/or mutation and give
 *     birth to offspring;</li>
 *     <li>Replace partialy or entirely the population with offspring.</li>
 *   </ol>
 *   </li>
 * </ol>
 * @class Engine
 * @constructor
 * @param options {object} Configuration object that might contain one or more
 * of the following attributes:
 * <ul>
 *   <li><code>randomizer</code>: Instance of <code>Hybrid.Util.Randomizer</code>
 *   that should be used to handle random number generation;</li>
 *   <li><code>population</code>: Instance of <code>Hybrid.Population</code>
 *   that should be evolved;</li>
 *   <li><code>selection</code>: Instance of <code>Hybrid.Selection</code>
 *   that should be used as the selection strategy;</li>
 *   <li><code>crossover</code>: Instance of <code>Hybrid.Reproduction.Crossover</code>
 *   that should be used to perform the recombination of population's
 *   individuals;</li>
 *   <li><code>mutation</code>: Instance of <code>Hybrid.Reproduction.Mutation</code>
 *   that should be used to perform the mutation of population's
 *   individuals;</li>
 * </ul>
 */
Hybrid.Engine = function(options) {
    var self = this;
    options = options || {};
    
    /**
     * Gets statistics for the current population.
     * @method getStatistics
     * @return {object} Statistics for the current population.
     * @private
     */
    function getStatistics() {
        var statistics = population.getStatistics();
        statistics.engine = self;
        return statistics;
    }
    
    /**
     * Initializes the population and processes the evolution.
     * @method evolve
     * by the algorithm.
     */
    this.evolve = function() {
        population.initialize(randomizer);
        processEvolution();
    }

    /**
     * Processes the evolution.
     * @method processEvolution
     * @private
     */
    function processEvolution() {
        var size = population.getInitialSize();
        
        self.notify('newGeneration', getStatistics());
        var breed = [];
        
        while (breed.length < size) {
            // selects two different individuals for breeding
            var father = selection.select(randomizer, population);
            var mother = null;
            do {
                mother = selection.select(randomizer, population);
            } while (mother === father);
            
            var child = crossover.crossover(randomizer, mother, father, population);
            if (child) {
                var mutated = mutation.mutate(randomizer, child, population);
                breed.push(((mutated) ? mutated : child));
            }
            else {
                // preserves the parents if the crossover produces no child
                breed.push(father);
                
                if (breed.length < size) {
                    breed.push(mother);
                }
            }
        }
        
        population.replaceGeneration(breed);

        if (!stopCondition.interrupt(getStatistics())) {
            setTimeout(processEvolution);
        }
    };
    
    /**
     * Registers a listener to be called when the given event happens.
     * @method on
     * @param type {string} Event type.
     * @param listener {function} Listener to be invoked when the event
     * happens.
     * @param params {object} Object that contains all parameters needed by
     * the listener.
     */
    this.on = function(type, listener, params) {
        eventHandler.addListener(type, listener, params);
    };
    
    /**
     * Removes the given listener.
     * @method unsubscribe
     * @param listener {function} Listener to be removed.
     */
    this.unsubscribe = function(listener) {
        eventHandler.removeListener(listener);
    };
    
    /**
     * Notifies the listeners about the ocurrence of some event.
     * @method notifyListeners
     * @param type {string} Event type used to determine which listeners
     * should be notified.
     * @param event {object} Event object which usually contains useful
     * information about the event in question.
     */
    this.notify = function(type, event) {
        eventHandler.notifyListeners(type, event);
    };
    
    /**
     * Gets the event handler being used by this engine.
     * @method getEventHandler
     * @return {Hybrid.Event.Handler} The event handler.
     */
    this.getEventHandler = function() {
        return eventHandler;
    };
    
    /**
     * Gets the randomizer being used by this engine.
     * @method getRandomizer
     * @return {Hybrid.Util.Randomizer} Randomizer being used by this engine.
     */
    this.getRandomizer = function() {
        return randomizer;
    };
    
    /**
     * Sets the randomizer to be used by this engine.
     * @method setRandomizer
     * @param newRandomizer {Hybrid.Util.Randomizer} Randomizer to be used by
     * this engine.
     */
    this.setRandomizer = function(newRandomizer) {
        randomizer = newRandomizer;
    };
    
    /**
     * Gets the selection strategy being used by this engine.
     * @method getSelection
     * @return {Hybrid.Selection} Selection strategy being used by this engine.
     */
    this.getSelection = function() {
        return selection;
    };
    
    /**
     * Sets the selection strategy to be used by this engine.
     * @method setSelection
     * @param newSelection {Hybrid.Selection} Selection strategy to be used by
     * this engine.
     */
    this.setSelection = function(newSelection) {
        selection = newSelection;
    };
    
    /**
     * Gets the crossover strategy being used by this engine.
     * @method getCrossover
     * @return {Hybrid.Reproduction.Crossover} Crossover strategy being used by
     * this engine.
     */
    this.getCrossover = function() {
        return crossover;
    };
    
    /**
     * Sets the crossover strategy to be used by this engine.
     * @method setCrossover
     * @param newCrossover {Hybrid.Reproduction.Crossover} Crossover strategy
     * to be used by this engine
     */
    this.setCrossover = function(newCrossover) {
        crossover = newCrossover;
    };
    
    /**
     * Gets the mutation strategy being used by this engine.
     * @method getMutation
     * @return {Hybrid.Reproduction.Mutation} Mutation strategy being used by
     * this engine.
     */
    this.getMutation = function() {
        return mutation;
    };
    
    /**
     * Sets the mutation strategy to be used by this engine.
     * @method setMutation
     * @param newMutation {Hybrid.Reproduction.Mutation} Mutation strategy
     * to be used by this engine
     */
    this.setMutation = function(newMutation) {
        mutation = newMutation;
    };
 
    /**
     * Randomizer object used by this engine to handle random number
     * generation.
     * @property randomizer
     * @type Hybrid.Util.Randomizer
     * @private
     */
    var randomizer = options.randomizer ||
        new Hybrid.Util.Randomizer();
    
    /**
     * Population to be evolved by this engine.
     * @property population
     * @type Hybrid.Population
     * @private
     */
    var population = options.population ||
        new Hybrid.Population();
    
    /**
     * Selection strategy used by this engine to select best-ranking
     * individuals to reproduce.
     * @property selection
     * @type Hybrid.Selection
     * @private
     */
    var selection = options.selection ||
        new Hybrid.Reproduction.RandomSelection();
    
    /**
     * Crossover strategy used by this engine to create offspring based on
     * two parent individuals.
     * @property crossover
     * @type Hybrid.Reproduction.Crossover
     * @private
     */
    var crossover = options.crossover || 
        new Hybrid.Reproduction.Crossover();
    
    /**
     * Mutation strategy used by this engine to mutate individuals.
     * @property mutation
     * @type Hybrid.Reproduction.Mutation
     * @private
     */
    var mutation = options.mutation ||
        new Hybrid.Reproduction.Mutation();
    
    /**
     * Stop condition used by this engine to dermine when to interrupt the
     * evolution.
     * @property stopCondition
     * @type Hybrid.Stop.Condition
     * @private
     */
    var stopCondition = options.stopCondition ||
        new Hybrid.Stop.ElapsedGeneration();

    /**
     * Event handler used by this engine to notify third party objects about
     * the current state of the evolution.
     * @name eventHandler
     * @type Hybrid.Event.Handler
     * @private
     */
    var eventHandler = new Hybrid.Event.Handler();
};

