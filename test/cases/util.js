var TestCases = {
    name: 'Util',
    
    setup: function() {
        this.randomizer = new Hybrid.Util.Randomizer();
    },
  
    teardown: function() {
    },
    
    testMapWithoutFunction: function() { with(this) {
        var array = [1, 2, 3, 4];
        assertEnumEqual([1, 2, 3, 4], Hybrid.Util.Array.map(array));
    }},
    
    testMapOdds: function() { with(this) {
        var array = [1, 2, 3, 4];
        assertEnumEqual([1, 3], Hybrid.Util.Array.map(array,
            function(element) {
                return (((element % 2) == 1) ? element : null);
            }
        ));
    }},
    
    testRangeConstructorWithNoArgs: function() { with(this) {
        var range = new Hybrid.Util.Range();
        assertEqual(0, range.getStart());
        assertEqual(0, range.getEnd());
    }},
    
    testRangeConstructorWithOneArg: function() { with(this) {
        var range = new Hybrid.Util.Range(10);
        assertEqual(0, range.getStart());
        assertEqual(10, range.getEnd());
    }},
    
    testRangeConstructorWithTwoArgs: function() { with(this) {
        var range = new Hybrid.Util.Range(5, 10);
        assertEqual(5, range.getStart());
        assertEqual(10, range.getEnd());
    }},
    
    testRangeConstructorWithSwappedArgs: function() { with(this) {
        var range = new Hybrid.Util.Range(15, 10);
        assertEqual(10, range.getStart());
        assertEqual(15, range.getEnd());
    }},
    
    testRangeDelta: function() { with(this) {
        var range = new Hybrid.Util.Range(6, 10);
        assertEqual(4, range.delta());
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
            assert(number >= 0 && number < 1);
        }
    }},
    
    testRandomizerNextWithinRange: function() { with(this) {
        for (var i = 0; i < 500; i++) {
            var number = randomizer.next(new Hybrid.Util.Range(3, 10));
            assert(number >= 3 && number < 10);
        }
    }},
    
    testRandomizerLowProbabilityEvent: function() { with(this) {
        var lessThanFifth = 0;
        for (var i = 0; i < 500; i++) {
            lessThanFifth += randomizer.probability(0.1) < 0.5 ? 1 : 0;
        }
        assert(lessThanFifth > 250);
    }},
    
    testRandomizerHighProbabilityEvent: function() { with(this) {
        var moreThanFifth = 0;
        for (var i = 0; i < 500; i++) {
            moreThanFifth += randomizer.probability(0.9) > 0.5 ? 1 : 0;
        }
        assert(moreThanFifth > 250);
    }}
};

new Test.Unit.Runner(TestCases, {'testLog':'utilLog', 'callback':testCallback});

