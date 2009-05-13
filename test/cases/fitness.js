new TestRunner({
    name: 'Fitness',

    setup: function() {
        this.fitnessEvaluator = new FitnessEvaluatorStub();
        this.fitnessComparator = new Hybrid.Fitness.Comparator();
        this.inverseFitnessComparator = new Hybrid.Fitness.Comparator(true);

        this.population = new Hybrid.Population({
            initialSize: 10,
            individualFactory: this.individualFactory,
            fitnessEvaluator: this.fitnessEvaluator
        });
    },

    teardown: function() {
    },

    testFitnessComparator: function() { with(this) {
        var first = {number:5};
        var second = {number:5};
        var third = {number:6};

        population.addAll([first, second, third]);

        assertThat(fitnessComparator.compare(first, second), 0);
        assertThat(fitnessComparator.compare(second, third), 1);
        assertThat(fitnessComparator.compare(third, second), -1);
    }},

    testInverseFitnessComparator: function() { with(this) {
        var first = {number:5};
        var second = {number:5};
        var third = {number:6};

        population.addAll([first, second, third]);

        assertThat(inverseFitnessComparator.compare(first, second), 0);
        assertThat(inverseFitnessComparator.compare(second, third), -1);
        assertThat(inverseFitnessComparator.compare(third, second), 1);
    }}
}, {'logger':testLogger, 'testLog':'fitnessLog'});

