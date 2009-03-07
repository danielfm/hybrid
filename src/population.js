/**
 * The Population module provides classes and methods to handle populations.
 * Genetic algorithms are implemented as a computer simulation in which a
 * population of abstract representations of candidate solutions (individuals)
 * to an optimization problem evolves toward better solutions.
 * @module population
 * @namespace Hybrid
 * @title Population
 */

/**
 * Default Population model that provides several methods to manage and monitor
 * the evolution of its individuals, as well as to define how the natural
 * selection should work.
 * @class Population
 * @constructor
 * @param options {object} Configuration object that might contain one or more
 * of the following attributes:
 * <ul>
 *   <li><code>generation</code>: Initial generation <code>number</code>;</li>
 *   <li><code>statisticsProvider</code>: Instance of <code>Hybrid.Population.StatisticsProvider</code>
 *   that should be used by this population to compute statistics for its
 *   individuals;</li>
 *   <li><code>individuals</code>: List of individuals to serve as the first
 *   generation;</li>
 *   <li><code>initialSize</code>: If the <code>individuals</code> parameter is
 *   provided, this attribute will be ignored. Otherwise, this attribute
 *   sets the number of individuals that this population should produce during
 *   its initialization;</li>
 *   <li><code>individualFactory</code>: Instance of <code>Hybrid.Individual.Factory</code>
 *   used to create the first generation of individuals;</li>
 *   <li><code>fitnessEvaluator</code>: Instance of <code>Hybrid.Fitness.Evaluator</code>
 *   used by this population to calculate the fitness for its individuals;</li>
 *   <li><code>fitnessComparator</code>: Instance of <code>Hybrid.Reproduction.Mutation</code>
 *   that should be used to sort this population's individuals according to
 *   their fitness.
 *   individuals;</li>
 * </ul>
 */
Hybrid.Population = function(options) {
    var self = this;
    options = options || {};
    
    /**
     * Resets this population to allow it to restart the evolution.
     * @method reset
     * @param newInitialSize {number} Sets the new initial size to be used
     * during the initialization of this population.
     */
    this.reset = function(newInitialSize) {
        initialized = false;
        individuals = [];
        dirty = false;
        generation = 0;
        initialSize = newInitialSize;
    };
    
    /**
     * Initializes this population. This method raises the following events:
     * <ul>
     *   <li>beforeInitialize</li>
     *   <li>afterInitialize</li>
     * </ul>
     * @method initialize
     * @param randomizer {Hybrid.Util.Randomizer} Randomizer object being used
     * by the engine.
     * @throws {Hybrid.Population.AlreadyInitializedError} If this population
     * is already initialized
     */
    this.initialize = function(randomizer) {
        if (initialized) {
            throw new Hybrid.Population.AlreadyInitializedError();
        }
        
        generation = 0;
        this.notify('beforeInitialize', this.getStatistics());
        
        // create the individuals using the individual factory
        for (var i = 0; i < initialSize; i++) {
            var individual = individualFactory.create(randomizer, this);
            if (individual) {
                this.add(individual);
            }
        }
        
        initialSize = individuals.length;
        initialized = true;
        this.notify('afterInitialize', this.getStatistics());
    };
    
    /**
     * Replaces the population's individuals by the given individuals and
     * increments the generation counter. This method raises the following
     * events:
     * <ul>
     *   <li>replaceGeneration</li>
     * </ul>
     * @method replaceGeneration
     * @param newIndividuals {array} Array of individuals that should replace
     * the current population.
     */
    this.replaceGeneration = function(newIndividuals) {
        if (newIndividuals.length != individuals.length) {
            throw new Hybrid.Population.IncompatibleBreedError();
        }
        
        var statistics = this.getStatistics();
        statistics.breed = newIndividuals;
        
        this.notify('replaceGeneration', statistics);
        
        individuals = [];
        this.addAll(newIndividuals);
        
        dirty = true;
        generation++;
    };
    
    /**
     * Sorts this population's individuals according to their fitness.
     * @method sort
     */
    this.sort = function() {
        if (dirty) {
            dirty = false;
            individuals.sort(fitnessComparator.compare);
        }
    };
    
    /**
     * Adds an individual to this population.
     * @method add
     * @param individual {object} Individual.
     */
    this.add = function(individual) {
        this.notify('addIndividual', {
            individual: individual,
            population: this
        });
        individuals.push(individual);
        dirty = true;
    };
    
    /**
     * Adds all the given individuals to this population.
     * @method addAll
     * @param individuals {array} List of individuals.
     */
    this.addAll = function(individuals) {
        var size = individuals.length;
        for (var i = 0; i < size; i++) {
            this.add(individuals[i]);
        }
    };
    
    /**
     * Gets the current best individual
     * @method best
     * @return {object} Best individual.
     */
    this.best = function(n) {
        this.sort();
        
        if (n == null) {
            return individuals[0];
        }
        else {
            return individuals.slice(0, n);
        }
    };
    
    /**
     * Gets the number of individuals being managed by this population.
     * @method getSize
     * @return {number} Number of individuals.
     */
    this.getSize = function() {
        return individuals.length;
    };
    
    /**
     * Registers a listener to be called when the given event happens.
     * @method on
     * @param type {string} Event type.
     * @param listener {function} Listener to be invoked when the event happens.
     * @param params {object} Object that contains all parameters needed by
     * the listener.
     */
    this.on = function(type, listener, params) {
        eventHandler.addListener(type, listener, params);
    };
    
    /**
     * Removes the given listener.
     * @method unsubscribe
     * @param listener {function} Listener.
     */
    this.unsubscribe = function(listener) {
        eventHandler.removeListener(listener);
    };
    
    /**
     * Notifies the listeners about the ocurrence of some event.
     * @method notify
     * @param type {string} Event type used to determine which listeners
     * should be notified.
     * @param event {object} Event object which usually contains useful
     * information about the event in question.
     */
    this.notify = function(type, event) {
        eventHandler.notifyListeners(type, event);
    };
    
    /**
     * Gets the event handler being used by this population.
     * @method getEventHandler
     * @return {Hybrid.Event.Handler} Event handler.
     */
    this.getEventHandler = function() {
        return eventHandler;
    };
    
    /**
     * Gets the individual factory being used by this population.
     * @method getIndividualFactory
     * @return {Hybrid.Individual.Factory} Individual factory.
     */
    this.getIndividualFactory = function() {
        return individualFactory;
    };
    
    /**
     * Sets the individual factory to be used by this population.
     * @method setIndividualFactory
     * @param factory {Hybrid.Individual.Factory} Individual factory.
     */
    this.setIndividualFactory = function(factory) {
        individualFactory = factory;
    };
    
    /**
     * Evaluate the fitness values of the given individual.
     * @method evaluateFitness
     * @param individual {object} Individual.
     * @return {number} Fitness value.
     */
    this.evaluateFitness = function(individual) {
        return fitnessEvaluator.evaluate(individual, this);
    };
    
    /**
     * Gets the fitness evaluator being used by this population.
     * @method getFitnessEvaluator
     * @return {Hybrid.Fitness.Evaluator} Fitness evaluator.
     */
    this.getFitnessEvaluator = function() {
        return fitnessEvaluator;
    };
    
    /**
     * Sets the fitness evaluator to be used by this population.
     * @method setFitnessEvaluator
     * @param evaluator {Hybrid.Fitness.Evaluator} Fitness evaluator.
     */
    this.setFitnessEvaluator = function(evaluator) {
        fitnessEvaluator = evaluator;
    };
    
    /**
     * Compares the given individuals based on their fitness.
     * @method compareIndividuals
     * @param individual {object} Individual.
     * @param other {object} Other individual.
     * @return {number} Returns something smaller than zero if
     * <code>individual</code> is considered better than <code>other</code>.
     * Returns something greater than zero if <code>individual</code> is
     * considered worse than <code>other</code>. Returns zero if both
     * individuals are considered equivalent.
     */
    this.compareIndividuals = function(individual, other) {
        return fitnessComparator.compare(individual, other);
    };
    
    /**
     * Gets the fitness comparator being used by this population.
     * @method getFitnessComparator
     * @return {Hybrid.Fitness.Comparator} Fitness comparator.
     */
    this.getFitnessComparator = function() {
        return fitnessComparator;
    };
    
    /**
     * Sets the fitness comparator to be used by this population.
     * @method setFitnessComparator
     * @param comparator {Hybrid.Fitness.Comparator} Fitness comparator.
     */
    this.setFitnessComparator = function(comparator) {
        fitnessComparator = comparator;
    };
    
    /**
     * Gets the generation counter, which is a number that tells how many
     * generations have been processed so far.
     * @method getGeneration
     * @return {number} Number of generations proessed so far.
     */
    this.getGeneration = function() {
        return generation;
    };
    
    /**
     * Returns if this population is already initialized.
     * @method isInitialized
     * @return {boolean} If this population is already initialized.
     */
    this.isInitialized = function() {
        return initialized;
    };
    
    /**
     * This population avoids redundant sort operations in order to improve
     * performance, but when some individual's internal state is changed or
     * new individuals are added to this population, the cache should be
     * expired to avoid stale data.
     * @method expireCache
     */
    this.expireCache = function() {
        dirty = true;
    };
    
    /**
     * Gets the initial number of individuals this population should
     * produce during its initialization.
     * @method getInitialSize
     * @return {number} Initial number of individuals.
     */
    this.getInitialSize = function() {
        return initialSize;
    };
    
    /**
     * Gets the individual located at the given index.
     * @method getIndividual
     * @param i {number} Index.
     * @return {object} Individual.
     */
    this.getIndividual = function(i) {
        return individuals[i];
    };
    
    /**
     * Returns a copy of the current list of individuals.
     * @method getIndividuals
     * @return {array} List of individuals.
     */
    this.getIndividuals = function() {
        return [].concat(individuals);
    };
    
    /**
     * Computes and returns the current statistics for this population.
     * @method getStatistics
     * @return {object} Statistics.
     */
    this.getStatistics = function() {
        return statisticsProvider.compute(this);
    };
    
    /**
     * Gets the statistics provider being used by this population.
     * @method getStatisticsProvider
     * @return {Hybrid.Population.StatisticsProvider} Statistics provider.
     */
    this.getStatisticsProvider = function() {
        return statisticsProvider;
    };
    
    /**
     * Sets the statistics provider to be used by this population.
     * @method getStatisticsProvider
     * @param provider {Hybrid.Population.StatisticsProvider} Statistics
     * provider.
     */
    this.setStatisticsProvider = function(provider) {
        statisticsProvider = provider;
    };
    
    /**
     * Generation counter.
     * @property generation
     * @type number
     * @private
     */
    var generation = options.generation;
    
    if (!generation) {
        generation = 0;
    }
    
    /**
     * Event handler used by this population to notify third party objects
     * about the current state of the evolution.
     * @name eventHandler
     * @type Hybrid.Event.Handler
     * @private
     */
    var eventHandler = new Hybrid.Event.Handler();
    
    /**
     * Statistics provider used by this population to compute statistics for
     * its individuals.
     * @property statisticsProvider
     * @type Hybrid.Population.StatisticsProvider
     * @private
     */
    var statisticsProvider = options.statisticsProvider ||
        new Hybrid.Population.StatisticsProvider();
    
    /**
     * Number of individuals this population should produce during its
     * initialization.
     * @property initialSize
     * @type number
     * @private
     */
    var initialSize = ((options.individuals) ? options.individuals.length :
        ((options.initialSize) ? options.initialSize: 100));
    
    /**
     * Individual factory used to create the first generation of individuals.
     * @property individualFactory
     * @type Hybrid.Individual.Factory
     * @private
     */
    var individualFactory = options.individualFactory ||
        new Hybrid.Individual.Factory();
    
    /**
     * Fitness evaluator used to calculate the fitness value for this
     * population's individuals.
     * @property fitnessEvaluator
     * @type Hybrid.Fitness.Evaluator
     * @private
     */
    var fitnessEvaluator = options.fitnessEvaluator ||
        new Hybrid.Fitness.Evaluator();
    
    /**
     * Fitness comparator used to sort individuals according to their fitness.
     * @property fitnessComparator
     * @type Hybrid.Fitness.Comparator
     * @private
     */
    var fitnessComparator = options.fitnessComparator ||
        new Hybrid.Fitness.Comparator();
    
    /* monkeypatch individuals before add them to this population */
    this.on('addIndividual', function(event) {
        Hybrid.Individual.plugFitnessLogic(event.individual, self);
    });
    
    /**
     * List of individuals being managed by this population.
     * @property individuals
     * @type array
     * @private
     */
    var individuals =  [];
    if (options.individuals) {
        this.addAll(options.individuals);
    }
    
    /**
     * Indicates whether this population is initialized or not.
     * @property initialized
     * @type boolean
     * @private
     */
    var initialized = !!options.individuals;
    
    /**
     * Indicates the cache state.
     * @property dirty
     * @type boolean
     * @private
     */
    var dirty = initialized;
};

/**
 * Adds Elitism support to a population. Elitism is a technique in which the
 * best individual (or a few best individuals) is copied to the population
 * in the next  generation. Elitism can very rapidly increase performance of
 * the Genetic Algorithm, because it prevents losing the best found solution
 * to date.
 * @method addElitism
 * @param options {object} Configuration object that must provide the following
 * attributes:
 * <ul>
 *   <li>to: Instance of <code>Hybrid.Population</code> that should support
 *   elitism.</li>
 *   <li>size: Number of best individuals to keep from generation to
 *   generation.</li>
 * </ul>
 * @param population {Hybrid.Population} Population.
 * @static
 */
Hybrid.Population.addElitism = function(options) {
    options = options || {};

    var population = options.to;
    var size = options.size;

    if (population == null || size == null) {
        throw new Hybrid.Population.IllegalElitismOptionsError();
    }

    new (function() {
        population.on('replaceGeneration', function(event) {
            var breed = event.breed;
            
            breed = breed.slice(size);
            breed = breed.concat(event.population.best(size));
            
            event.breed = breed;
        });
    })();
};

/**
 * Simple class that is used to get statistical data for a population.
 * @class Population.StatisticsProvider
 * @constructor
 */
Hybrid.Population.StatisticsProvider = function() {
    
    /**
     * Returns statistical data for the given population.
     * @method compute
     * @param population {Hybrid.Population} Population.
     * @return {object}
     */
    this.compute = function(population) {
        return {
            population: population
        };
    };
};

/**
 * This exception is thrown when initializing an already initialized
 * population.
 * @class Population.AlreadyInitializedError
 * @constructor
 */
Hybrid.Population.AlreadyInitializedError = function() {};

/**
 * This exception is thrown when trying to replace the population's individuals
 * with a breed that contains a different number of individuals.
 * @class Population.IncompatibleBreedError
 * @constructor
 */
Hybrid.Population.IncompatibleBreedError = function() {};

/**
 * This exception is thrown when trying to add elitism support to a population
 * without specify either the population or the elitism size.
 * @class Population.IllegalElitismOptionsError
 * @constructor
 */
Hybrid.Population.IllegalElitismOptionsError = function() {};

