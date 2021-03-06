/**
 * @fileOverview The Population module provides classes and methods to handle
 * populations. Genetic algorithms are implemented as a computer simulation in
 * which a population of abstract representations of candidate solutions
 * (individuals) to an optimization problem evolves toward better solutions.
 * @author <a href="mailto:daniel.tritone@gmail.com">Daniel Fernandes Martins</a>
 */

/**
 * Creates a new population.
 * @class Default Population model that provides several methods to manage and
 * monitor the evolution of its individuals, as well as to define how the
 * natural selection should work.
 * @constructor
 * @param {object} options Configuration object.
 * @param {number} [options.generation=0] Initial generation number.
 * @param {array} [options.individuals=[]] List of individuals to serve as the
 * first generation. If not provided, this engine will use an individual
 * factory create the first generation during its initialization.
 * @param {Hybrid.Individual.Factory} options.factory Factory used to
 * initialize this population. This attribute is only used if no individuals
 * are provided in <b>options.individuals</b>.
 * @param {Hybrid.Fitness.Comparator}
 * [options.fitnessComparator=new Hybrid.Fitness.Comparator()] Fitness
 * comparator used to sort this population's individuals according to their
 * fitness.
 * @param {Hybrid.Fitness.Evaluator} options.fitnessEvaluator Fitness evaluator
 * used to calculate the fitness of all individuals in this population.
 */
Hybrid.Population = function(options) {
    var self = this;
    options = options || {};

    /**
     * Initializes this population. This method is usually called by the
     * {@link Hybrid.Engine} when no initial generation is provided when
     * creating this population.<p>
     *
     * This method triggers the following events:
     * <ul>
     *   <li><b>beforeInitialize</b> - Before the ininitialization.</li>
     *   <li><b>afterInitialize</b> - After the initialization.</li>
     * </ul>
     * @param {Hybrid.Util.Randomizer} randomizer Randomizer object being used
     * by the engine.
     * @throws {Hybrid.Error} If this population
     * is already initialized
     */
    this.initialize = function(randomizer) {
        if (initialized) {
            throw new Hybrid.Error('Population already initialized');
        }

        generation = 0;
        this.notify('beforeInitialize', this.getStatistics());

        factory.createInitialPopulation(randomizer, this);

        initialized = true;
        this.notify('afterInitialize', this.getStatistics());
    };

    /**
     * Replaces this population's individuals by the given individuals and
     * increments the generation counter.<p>
     *
     * This method triggers the following events:
     * <ul>
     *   <li><b>replaceGeneration</b> - Before replace the current
     *   generation.</li>
     * </ul>
     * @param {array} newIndividuals Array of individuals that should replace
     * the current population.
     * @throws {Hybrid.Error} If the number of new individuals are incompatible
     * with the current population size.
     */
    this.replaceGeneration = function(newIndividuals) {
        if (newIndividuals.length != individuals.length) {
            throw new Hybrid.Error('Breed should have the same number of individuals of the current population');
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
     * Sorts this population's individuals according to their fitness
     * if necessary. The first element (index 0) will hold the best
     * individual, the second element (index 1) the second best and
     * so on.
     */
    this.sort = function() {
        if (dirty) {
            dirty = false;
            individuals.sort(fitnessComparator.compare);
        }
    };

    /**
     * Adds an individual to this population.
     * @param {object} individual Individual.
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
     * @param {array} individuals List of individuals.
     * @throws {Hybrid.Error} If the given object is not an array.
     */
    this.addAll = function(individuals) {
        if (!(individuals instanceof Array)) {
            throw new Hybrid.Error('Instance of Array expected');
        }

        var size = individuals.length;
        for (var i = 0; i < size; i++) {
            this.add(individuals[i]);
        }
    };

    /**
     * Gets the N best individuals.
     * @param {number} n Number of best individuals to get.
     * @return {object} Best individuals.
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
     * @return {number} Number of individuals.
     */
    this.getSize = function() {
        return individuals.length;
    };

    /**
     * Registers a listener to be called when the given event happens.
     * @param {object} eventType Event type.
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
     * @param {function} listener Listener.
     */
    this.unsubscribe = function(listener) {
        eventHandler.removeListener(listener);
    };

    /**
     * Notifies the listeners about the occurrence of some event.
     * @param {object} eventType Event type used to determine which listeners
     * should be notified.
     * @param {object} event Event object which usually contains useful
     * information about the triggered event.
     */
    this.notify = function(eventType, event) {
        eventHandler.notifyListeners(eventType, event);
    };

    /**
     * Adds elitism support to this population.
     * @param {number} size Number of best individuals to keep from
     * generation to generation.
     */
    this.setElitism = function(size) {
        Hybrid.Population.setElitism({
            to: this,
            size: size
        });
    };

    /**
     * Gets the event handler being used by this population.
     * @return {Hybrid.EventHandler} Event handler.
     */
    this.getEventHandler = function() {
        return eventHandler;
    };

    /**
     * Gets the factory being used by this population.
     * @return {Hybrid.Individual.Factory} Factory.
     */
    this.getFactory = function() {
        return factory;
    };

    /**
     * Sets the individual factory to be used by this population.
     * @param {Hybrid.Individual.Factory} factory Individual factory.
     * @throws {Hybrid.Error} If the object is not a individual factory.
     */
    this.setFactory = function(newFactory) {
        if (!(newFactory instanceof Hybrid.Individual.Factory)) {
            throw new Hybrid.Error('Instance of Hybrid.Individual.Factory expected');
        }
        factory = newFactory;
    };

    /**
     * Evaluates the fitness values of the given individual.
     * @param {object} individual Individual.
     * @return {number} Fitness value.
     */
    this.evaluateFitness = function(individual) {
        return fitnessEvaluator.evaluate(individual, this);
    };

    /**
     * Gets the fitness evaluator being used by this population.
     * @return {Hybrid.Fitness.Evaluator} Fitness evaluator.
     */
    this.getFitnessEvaluator = function() {
        return fitnessEvaluator;
    };

    /**
     * Sets the fitness evaluator to be used by this population.
     * @param {Hybrid.Fitness.Evaluator} evaluator Fitness evaluator.
     * @throws {Hybrid.Error} If the object is not a fitness evaluator.
     */
    this.setFitnessEvaluator = function(evaluator) {
        if (!(evaluator instanceof Hybrid.Fitness.Evaluator)) {
            throw new Hybrid.Error('Instance of Hybrid.Fitness.Evaluator expected');
        }
        fitnessEvaluator = evaluator;
    };

    /**
     * Compares the given individuals based on their fitness.
     * @param {object} individual Individual.
     * @param {object} other Other individual.
     * @return {number} Returns something smaller than zero if
     * <b>individual</b> is considered better than <b>other</b>.
     * Returns something greater than zero if <b>individual</b> is
     * considered worse than <b>other</b>. Returns zero if both
     * individuals are considered equivalent.
     */
    this.compareIndividuals = function(individual, other) {
        return fitnessComparator.compare(individual, other);
    };

    /**
     * Gets the fitness comparator being used by this population.
     * @return {Hybrid.Fitness.Comparator} Fitness comparator.
     */
    this.getFitnessComparator = function() {
        return fitnessComparator;
    };

    /**
     * Sets the fitness comparator to be used by this population.
     * @param {Hybrid.Fitness.Comparator} comparator Fitness comparator.
     * @throws {Hybrid.Error} If the object is not a fitness comparator.
     */
    this.setFitnessComparator = function(comparator) {
        if (!(comparator instanceof Hybrid.Fitness.Comparator)) {
            throw new Hybrid.Error('Instance of Hybrid.Fitness.Comparator expected');
        }
        fitnessComparator = comparator;
    };

    /**
     * Gets the generation counter, which is a number that tells how many
     * generations have been processed so far.
     * @return {number} Number of generations processed so far.
     */
    this.getGeneration = function() {
        return generation;
    };

    /**
     * Returns if this population is already initialized or not.
     * @return {boolean} If this population is already initialized or not.
     */
    this.isInitialized = function() {
        return initialized;
    };

    /**
     * This population avoids redundant sort operations in order to improve
     * performance, but when some individual's internal state is changed or
     * new individuals are added to this population, the cache should be
     * expired to avoid stale data.
     */
    this.expireCache = function() {
        dirty = true;
    };

    /**
     * Gets the individual located at the given index.
     * @param {number} i Index.
     * @return {object} Individual.
     */
    this.getIndividual = function(i) {
        return individuals[i];
    };

    /**
     * Returns a copy of the current list of individuals.
     * @return {array} List of individuals.
     */
    this.getIndividuals = function() {
        return [].concat(individuals);
    };

    /**
     * Computes and returns the current statistics for this population.
     * @return {object} Statistics for this population.
     */
    this.getStatistics = function() {
        return statisticsProvider.compute(this);
    };

    /**
     * Gets the statistics provider being used by this population.
     * @return {Hybrid.Population.StatisticsProvider} Statistics provider.
     */
    this.getStatisticsProvider = function() {
        return statisticsProvider;
    };

    /**
     * Sets the statistics provider to be used by this population.
     * @param {Hybrid.Population.StatisticsProvider} provider Statistics
     * provider.
     * @throws {Hybrid.Error} If the object is not a statistics provider.
     */
    this.setStatisticsProvider = function(provider) {
        if (!(provider instanceof Hybrid.Population.StatisticsProvider)) {
            throw new Hybrid.Error('Instance of Hybrid.Population.StatisticsProvider expected');
        }
        statisticsProvider = provider;
    };

    /**
     * Generation counter.
     * @property
     * @type number
     * @private
     */
    var generation = options.generation;

    if (!generation || generation < 0) {
        generation = 0;
    }

    /**
     * Event handler used by this population to notify third party objects
     * about the current state of the evolution.
     * @property
     * @type Hybrid.EventHandler
     * @private
     */
    var eventHandler = new Hybrid.EventHandler();

    /**
     * Statistics provider used by this population to compute statistics for
     * its individuals.
     * @property
     * @type Hybrid.Population.StatisticsProvider
     * @private
     */
    var statisticsProvider;
    this.setStatisticsProvider(options.statisticsProvider ||
        new Hybrid.Population.StatisticsProvider());

    /**
     * Factory used to create the first generation of individuals.
     * @property
     * @type Hybrid.Individual.Factory
     * @private
     */
    var factory;
    this.setFactory(options.factory || new Hybrid.Individual.Factory());

    /**
     * Fitness evaluator used to calculate the fitness value for this
     * population's individuals.
     * @property
     * @type Hybrid.Fitness.Evaluator
     * @private
     */
    var fitnessEvaluator;
    this.setFitnessEvaluator(options.fitnessEvaluator ||
        new Hybrid.Fitness.Evaluator());

    /**
     * Fitness comparator used to sort individuals according to their fitness.
     * @property
     * @type Hybrid.Fitness.Comparator
     * @private
     */
    var fitnessComparator;
    this.setFitnessComparator(options.fitnessComparator ||
        new Hybrid.Fitness.Comparator());

    /*
     * Monkeypatch individuals before add them to this population.
     */
    this.on('addIndividual', function(event) {
        Hybrid.Individual.plugFitnessLogic(event.individual, self);
    });

    if (options.elitismSize > 0) {
        this.setElitism(options.elitismSize);
    }

    /**
     * List of individuals being managed by this population.
     * @property
     * @type array
     * @private
     */
    var individuals =  [];
    if (options.individuals) {
        this.addAll(options.individuals);
    }

    /**
     * Indicates whether this population is initialized or not.
     * @property
     * @type boolean
     * @private
     */
    var initialized = !!options.individuals;

    /**
     * Indicates the cache state.
     * @property
     * @type boolean
     * @private
     */
    var dirty = initialized;
};
Hybrid.Population = new Hybrid.Class({
    initializer: Hybrid.Population
});

/**
 * Adds Elitism support to a population. Elitism is a technique in which the
 * best individual (or a few best individuals) is copied to the population
 * in the next  generation. Elitism can very rapidly increase performance of
 * the Genetic Algorithm, because it prevents losing the best found solutions
 * to date.
 * @param {object} options Elitism parameters.
 * @param {Hybrid.Population} options.to Population that should support
 * elitism.
 * @param {number} options.size Number of best individuals to keep from
 * generation to generation.
 * @static
 * @throws {Hybrid.Error} If the given options are invalid.
 */
Hybrid.Population.setElitism = function(options) {
    options = options || {};

    var population = options.to;
    var size = options.size;

    if (population == null || size == null) {
        throw new Hybrid.Error('Population and elitism size are required');
    }

    var handler = population.getEventHandler();

    // Remove any previously added elitism listeners from the population
    var listeners = handler.getListenersByType('replaceGeneration');
    for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        if (listener._isElitismListener) {
            handler.removeListener(listener);
        }
    }

    (function() {
        var listener = function(event) {
            var breed = event.breed;

            breed = breed.slice(size);
            breed = breed.concat(event.population.best(size));

            event.breed = breed;
        };
        listener._isElitismListener = true;
        population.on('replaceGeneration', listener);
    })();
};

/**
 * Creates a new statistics provider.
 * @class Simple class used to get statistical data for a population.
 * @constructor
 */
Hybrid.Population.StatisticsProvider = function() {

    /**
     * Returns statistical data for the given population.
     * @param {Hybrid.Population} population Population.
     * @return {object} Population statistics.
     */
    this.compute = function(population) {
        return {
            population: population
        };
    };
};
Hybrid.Population.StatisticsProvider = new Hybrid.Class({
    initializer: Hybrid.Population.StatisticsProvider
});

