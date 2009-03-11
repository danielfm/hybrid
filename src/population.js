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
 * first generation.
 * @param {Hybrid.Individual.Factory} options.individualFactory Factory used to
 * initialize this population. This attribute is only used if no individuals
 * are provided in <code>options.individuals</code>.
 * @param {number} [options.initialSize=100] Number of individuals to create
 * during the initialization of this population when no individuals are
 * provided in <code>options.individuals</code>.
 * @param {Hybrid.Fitness.Comparator}
 * [options.fitnessComparator=new Hybrid.Fitness.Comparator()] Fitness
 * comparator used to sort this population's individuals according to their
 * fitness.
 * @param {Hybrid.Fitness.Evaluator} options.fitnessEvaluator Fitness evaluator
 * used to calculate the fitness of each population's individuals.
 */
Hybrid.Population = new Hybrid.Class.extend(Object, function(options) {
    var self = this;
    options = options || {};

    /**
     * Initializes this population. This method raises the following events:
     * <ul>
     *   <li><code>beforeInitialize</code> - Before the ininitialization.</li>
     *   <li><code>afterInitialize</code> - After the initialization.</li>
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

        // create the individuals using the individual factory
        while (individuals.length < initialSize) {
            var individual = individualFactory.create(randomizer, this);
            if (individual) {
                this.add(individual);
            }
        }

        initialized = true;
        this.notify('afterInitialize', this.getStatistics());
    };

    /**
     * Replaces the population's individuals by the given individuals and
     * increments the generation counter. This method raises the following
     * events:
     * <ul>
     *   <li><code>replaceGeneration</code> - Before replace the current
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
     * if necessary.
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
     * Gets the current best individual.
     * @param {number} n Number of best individuals to get.
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
     * @return {number} Number of individuals.
     */
    this.getSize = function() {
        return individuals.length;
    };

    /**
     * Registers a listener to be called when the given event happens.
     * @param {object} eventType Event type.
     * @param {function} listener Listener to be invoked when the event happens.
     * @param {object} [params=undefined] Object that contains all parameters
     * needed by the listener.
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
     * information about the event in question.
     */
    this.notify = function(eventType, event) {
        eventHandler.notifyListeners(eventType, event);
    };

    /**
     * Gets the event handler being used by this population.
     * @return {Hybrid.Event.Handler} Event handler.
     */
    this.getEventHandler = function() {
        return eventHandler;
    };

    /**
     * Gets the individual factory being used by this population.
     * @return {Hybrid.Individual.Factory} Individual factory.
     */
    this.getIndividualFactory = function() {
        return individualFactory;
    };

    /**
     * Sets the individual factory to be used by this population.
     * @param {Hybrid.Individual.Factory} factory Individual factory.
     * @throws {Hybrid.Error} If the object is not a individual factory.
     */
    this.setIndividualFactory = function(factory) {
        if (!(factory instanceof Hybrid.Individual.Factory)) {
            throw new Hybrid.Error('Instance of Hybrid.Individual.Factory expected');
        }
        individualFactory = factory;
    };

    /**
     * Evaluate the fitness values of the given individual.
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
     * @return {number} Number of generations proessed so far.
     */
    this.getGeneration = function() {
        return generation;
    };

    /**
     * Returns if this population is already initialized.
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
     */
    this.expireCache = function() {
        dirty = true;
    };

    /**
     * Gets the initial number of individuals this population should
     * produce during its initialization.
     * @return {number} Initial number of individuals.
     */
    this.getInitialSize = function() {
        return initialSize;
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
     * @return {object} Statistics.
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
     * @type Hybrid.Event.Handler
     * @private
     */
    var eventHandler = new Hybrid.Event.Handler();

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
     * Number of individuals this population should produce during its
     * initialization.
     * @property
     * @type number
     * @private
     */
    var initialSize = ((options.individuals) ? options.individuals.length :
        ((options.initialSize && options.initialSize > 0)
            ? options.initialSize
            : 100));

    /**
     * Individual factory used to create the first generation of individuals.
     * @property
     * @type Hybrid.Individual.Factory
     * @private
     */
    var individualFactory;
    this.setIndividualFactory(options.individualFactory ||
        new Hybrid.Individual.Factory());

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
});

/**
 * Adds Elitism support to a population. Elitism is a technique in which the
 * best individual (or a few best individuals) is copied to the population
 * in the next  generation. Elitism can very rapidly increase performance of
 * the Genetic Algorithm, because it prevents losing the best found solution
 * to date.
 * @param {object} options Elitism parameters.
 * @param {Hybrid.Population} options.to Population that should support
 * elitism.
 * @param {number} options.size Number of best individuals to keep from
 * generation to generation.
 * @static
 * @throws {Hybrid.Error} If the given options are invalid.
 */
Hybrid.Population.addElitism = function(options) {
    options = options || {};

    var population = options.to;
    var size = options.size;

    if (population == null || size == null) {
        throw new Hybrid.Error('Population and elitism size are required');
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
 * Creates a new statistics provider.
 * @class Simple class that is used to get statistical data for a population.
 * @constructor
 */
Hybrid.Population.StatisticsProvider = new Hybrid.Class.extend(Object,
    function() {

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
    }
);

