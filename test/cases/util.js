new TestRunner({
    name: 'Util',

    setup: function() {
        this.randomizer = new Hybrid.Util.Randomizer();
    },

    teardown: function() {
    },

    testMapWithoutFunction: function() { with(this) {
        var array = [1, 2, 3, 4];
        assertThat(Hybrid.Util.Array.map(array), [1,2,3,4]);
    }},

    testMapOdds: function() { with(this) {
        var array = [1, 2, 3, 4];
        assertThat(Hybrid.Util.Array.map(array,
            function(element) {
                return (((element % 2) == 1) ? element : null);
            }
        ), [1,3]);
    }},

    testRangeConstructorWithNoArgs: function() { with(this) {
        var range = new Hybrid.Util.Range();
        assertThat(range.getStart(), 0);
        assertThat(range.getEnd(), 0);
    }},

    testRangeConstructorWithOneArg: function() { with(this) {
        var range = new Hybrid.Util.Range(10);
        assertThat(range.getStart(), 0);
        assertThat(range.getEnd(), 10);
    }},

    testRangeConstructorWithTwoArgs: function() { with(this) {
        var range = new Hybrid.Util.Range(5, 10);
        assertThat(range.getStart(), 5);
        assertThat(range.getEnd(), 10);
    }},

    testRangeConstructorWithSwappedArgs: function() { with(this) {
        var range = new Hybrid.Util.Range(15, 10);
        assertThat(range.getStart(), 10);
        assertThat(range.getEnd(), 15);
    }},

    testRangeDelta: function() { with(this) {
        var range = new Hybrid.Util.Range(6, 10);
        assertThat(range.delta(), 4);
    }},

    testRangeIsMember: function() { with(this) {
        var range = new Hybrid.Util.Range(6, 10);
        assert(range.isMember(6));
        assert(range.isMember(8));
        assert(range.isMember(10));
    }},

    testRangeIsNotMember: function() { with(this) {
        var range = new Hybrid.Util.Range(6, 10);
        assert(!range.isMember(5));
        assert(!range.isMember(11));
    }},

    testRandomizerNext: function() { with(this) {
        for (var i = 0; i < 500; i++) {
            var number = randomizer.next();
            assertThat(number, between(0).and(1));
        }
    }},

    testRandomizerNextWithinRange: function() { with(this) {
        for (var i = 0; i < 500; i++) {
            var number = randomizer.next(new Hybrid.Util.Range(3, 10));
            assertThat(number, between(3).and(10));
        }
    }},

    testRandomizerLowProbabilityEvent: function() { with(this) {
        var lessThanFifth = 0;
        for (var i = 0; i < 500; i++) {
            lessThanFifth += randomizer.probability(0.1) < 0.5 ? 1 : 0;
        }
        assertThat(lessThanFifth, greaterThan(250));
    }},

    testRandomizerHighProbabilityEvent: function() { with(this) {
        var moreThanFifth = 0;
        for (var i = 0; i < 500; i++) {
            moreThanFifth += randomizer.probability(0.9) > 0.5 ? 1 : 0;
        }
        assertThat(moreThanFifth, greaterThan(250));
    }}
}, {'logger':testLogger, 'testLog':'utilLog'});

