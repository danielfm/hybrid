/**
 * @fileOverview Provides a default implementation of a Genetic Algorithm
 * loop.
 */

/**
 * Creates a new evolution engine.
 * @class Basic implementation of the main loop of a Genetic Algorithm, which
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
 * @constructor
 * @param {object} options Engine configuration.
 * @param {Hybrid.Population} options.population Population to be evolved.
 * @param {Hybrid.Util.Randomizer}
 * [options.randomizer=new Hybrid.Util.Randomizer()] Randomizer instance.
 * @param {Hybrid.Selection} [options.selection=new Hybrid.Selection.Ranking()]
 * Selection strategy.
 * @param {Hybrid.Reproduction.Crossover} options.crossover Crossover strategy.
 * @param {Hybrid.Reproduction.Mutation} options.mutation Mutation strategy.
 * @param {Hybrid.Stop.Condition} options.stopCondition Stop condition used by
 * this engine to dermine when to interrupt the evolution.
 */
Hybrid.Engine = function(options) {
    var self = this;
    options = options || {};

    /**
     * Initializes the population and processes the evolution.
     */
    this.evolve = function() {
        population.initialize(randomizer);

        // Simple replacement for setTimeout when it's not available
        if (!setTimeout) {
            setTimeout = function(func, timeout) {
                func.apply(this);
            };
        }

        processEvolution();
    };

    /**
     * Processes the evolution. This method gets called until the stop
     * condition being used by this engine tells us to keep going.
     * @private
     */
    function processEvolution() {
        var size = population.getSize();

        self.notify('newGeneration', population.getStatistics());
        var breed = [];

        while (breed.length < size) {
            // selects two different individuals for breeding
            var father = selection.select(randomizer, population);
            var mother = null;
            do {
                mother = selection.select(randomizer, population);
            } while (mother === father);

            var child = crossover.execute(randomizer, mother, father, population);
            if (child) {
                var mutated = mutation.execute(randomizer, child, population);
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

        if (!stopCondition.interrupt(population.getStatistics())) {
            setTimeout(processEvolution);
        }
    };

    /**
     * Registers a listener to be called when the given event happens.
     * @param {string} eventType Event type.
     * @param {function} listener Listener to be invoked when the event
     * happens.
     * @param {object} [params=undefined] Object to be passed to the
     * listener when it's called.
     */
    this.on = function(eventType, listener, params) {
        eventHandler.addListener(eventType, listener, params);
    };

    /**
     * Removes the given listener.
     * @param {function} listener Listener to be removed.
     */
    this.unsubscribe = function(listener) {
        eventHandler.removeListener(listener);
    };

    /**
     * Notifies the listeners about the occurrence of some event.
     * @param {string} eventType Event type used to determine which listeners
     * should be notified.
     * @param {object} event Event object which usually contains useful
     * information about the triggered event.
     */
    this.notify = function(eventType, event) {
        eventHandler.notifyListeners(eventType, event);
    };

    /**
     * Gets the population being evolved by this engine.
     * @return {Hybrid.Population} Population.
     */
    this.getPopulation = function() {
        return population;
    };

    /**
     * Gets the event handler being used by this engine.
     * @return {Hybrid.EventHandler} The event handler.
     */
    this.getEventHandler = function() {
        return eventHandler;
    };

    /**
     * Gets the randomizer being used by this engine.
     * @return {Hybrid.Util.Randomizer} Randomizer being used by this engine.
     */
    this.getRandomizer = function() {
        return randomizer;
    };

    /**
     * Sets the randomizer to be used by this engine.
     * @param {Hybrid.Util.Randomizer} newRandomizer Randomizer to be used by
     * this engine.
     */
    this.setRandomizer = function(newRandomizer) {
        if (!(newRandomizer instanceof Hybrid.Util.Randomizer)) {
            throw new Hybrid.Error('Instance of Hybrid.Util.Randomizer expected');
        }
        randomizer = newRandomizer;
    };

    /**
     * Gets the selection strategy being used by this engine.
     * @return {Hybrid.Selection} Selection strategy being used by this engine.
     */
    this.getSelection = function() {
        return selection;
    };

    /**
     * Sets the selection strategy to be used by this engine.
     * @param {Hybrid.Selection} newSelection Selection strategy to be used by
     * this engine.
     */
    this.setSelection = function(newSelection) {
        if (!(newSelection instanceof Hybrid.Selection)) {
            throw new Hybrid.Error('Instance of Hybrid.Selection expected');
        }
        selection = newSelection;
    };

    /**
     * Gets the crossover strategy being used by this engine.
     * @return {Hybrid.Reproduction.Crossover} Crossover strategy being used by
     * this engine.
     */
    this.getCrossover = function() {
        return crossover;
    };

    /**
     * Sets the crossover strategy to be used by this engine.
     * @param {Hybrid.Reproduction.Crossover} newCrossover Crossover strategy
     * to be used by this engine.
     */
    this.setCrossover = function(newCrossover) {
        if (!(newCrossover instanceof Hybrid.Reproduction.Crossover)) {
            throw new Hybrid.Error('Instance of Hybrid.Reproduction.Crossover expected');
        }
        crossover = newCrossover;
    };

    /**
     * Gets the mutation strategy being used by this engine.
     * @return {Hybrid.Reproduction.Mutation} Mutation strategy being used by
     * this engine.
     */
    this.getMutation = function() {
        return mutation;
    };

    /**
     * Sets the mutation strategy to be used by this engine.
     * @param {Hybrid.Reproduction.Mutation} newMutation Mutation strategy
     * to be used by this engine.
     */
    this.setMutation = function(newMutation) {
        if (!(newMutation instanceof Hybrid.Reproduction.Mutation)) {
            throw new Hybrid.Error('Instance of Hybrid.Reproduction.Mudation expected');
        }
        mutation = newMutation;
    };

    /**
     * Sets the stop condition used to interrupt the evolution.
     * @return {Hybrid.Stop.Condition} Stop condition.
     */
    this.getStopCondition = function() {
        return stopCondition;
    };

    /**
     * Sets the stop condition used to interrupt the evolution.
     * @param {Hybrid.Stop.Condition} newStopCondition Stop condition.
     */
    this.setStopCondition = function(newStopCondition) {
        if (!(newStopCondition instanceof Hybrid.Stop.Condition)) {
            throw new Hybrid.Error('Instance of Hybrid.Stop.Condition expected');
        }
        stopCondition = newStopCondition;
    };
 
    /**
     * Randomizer object used by this engine to handle random number
     * generation.
     * @property
     * @type Hybrid.Util.Randomizer
     * @private
     */
    var randomizer = options.randomizer ||
        new Hybrid.Util.Randomizer();

    /**
     * Population to be evolved by this engine.
     * @property 
     * @type Hybrid.Population
     * @private
     */
    var population = options.population ||
        new Hybrid.Population();

    /**
     * Selection strategy used by this engine to select best-ranking
     * individuals to reproduce.
     * @property 
     * @type Hybrid.Selection
     * @private
     */
    var selection = options.selection ||
        new Hybrid.Selection.Ranking();

    /**
     * Crossover strategy used by this engine to create offspring based on
     * two parent individuals.
     * @property 
     * @type Hybrid.Reproduction.Crossover
     * @private
     */
    var crossover = options.crossover || 
        new Hybrid.Reproduction.Crossover();

    /**
     * Mutation strategy used by this engine to mutate individuals.
     * @property 
     * @type Hybrid.Reproduction.Mutation
     * @private
     */
    var mutation = options.mutation ||
        new Hybrid.Reproduction.Mutation();

    /**
     * Stop condition used by this engine to dermine when to interrupt the
     * evolution.
     * @property 
     * @type Hybrid.Stop.Condition
     * @private
     */
    var stopCondition = options.stopCondition ||
        new Hybrid.Stop.ElapsedGeneration();

    /**
     * Event handler used by this engine to notify third party objects about
     * the current state of the evolution.
     * @property
     * @type Hybrid.EventHandler
     * @private
     */
    var eventHandler = new Hybrid.EventHandler();
};
Hybrid.Engine = new Hybrid.Class({
    constructor: Hybrid.Engine
});

/**
 * Creates a Hybrid error.
 * @class This error is throw to alert the occurrence of some exceptional
 * event.
 * @constructor
 * @param {string} msg Error message
 */
Hybrid.Error = function(msg) {

    /**
     * Error name.
     * @property
     * @type string
     */
    this.name = 'Hybrid.Error';

    /**
     * Error message.
     * @property
     * @type string
     */
    this.message = msg;
};
Hybrid.Error = new Hybrid.Class({
    constructor: Hybrid.Error
});

