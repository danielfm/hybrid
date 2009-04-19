/*
 * JsUnitTest-Hamcrest v0.1
 * http://github.com/danielfm/jsunittest-hamcrest/tree/master
 *
 * Plug-in to JsUnitTest that adds a collection of useful matchers for building
 * test expressions.
 *
 * Copyright (c) 2009 Daniel Fernandes Martins
 * Licensed under the BSD license.
 *
 * Revision: be23e57a7706a2f179ee0c326e8715a7154fdf40
 * Date:     Tue Apr 14 20:29:37 2009 -0300
 */
 
/**
 * @fileOverview Provides the main namespace, along with core abstractions.
 */

/**
 * JsUnitTest main namespace.
 * @namespace
 */
JsUnitTest = JsUnitTest;

/**
 * Main namespace.
 * @namespace
 */
JsUnitTest.Hamcrest = {
    /**
     * Library version.
     */
    version: '0.1',

    /**
     * Copies the properties of the given objects to the
     * <code>JsUnitTest.Unit.Testcase</code> prototype.
     * @param {object} matchers Object that contains the matchers to be
     * installed.
     */
    installMatchers: function(matchers) {
        for (method in matchers) {
            JsUnitTest.Unit.Testcase.prototype[method] = matchers[method];
        }
    },

    /**
     * Returns if the given object is a matcher.
     * @param {object} obj Object.
     * @return {boolean} If the given object is a matcher.
     */
    isMatcher: function(obj) {
        return obj instanceof JsUnitTest.Hamcrest.SimpleMatcher;
    },

    /**
     * Returns if the given arrays are equivalent.
     * @param {array} array Array.
     * @param {array} anotherArray Another array.
     * @return {booelan} If the given arrays are equivalent.
     */
    isArraysEqual: function(array, anotherArray) {
        if (array instanceof Array || anotherArray instanceof Array) {
            if (array.length != anotherArray.length) {
                return false;
            }

            for (var i = 0; i < array.length; i++) {
                var a = array[i];
                var b = anotherArray[i];

                if (a instanceof Array || b instanceof Array) {
                    return JsUnitTest.Hamcrest.isArraysEqual(a, b);
                } else if (a != b) {
                    return false;
                }
            }
            return true;
        } else {
            return array == anotherArray;
        }
    },

    /**
     * Creates a simple matcher.
     * @class Builds a matcher object that uses external functions provided
     * by the caller in order to define the current matching logic.
     * @constructor
     * @param {object} params Configuration object.
     * @param {function} params.matches Matcher logic.
     * @param {function} params.describeTo Self description logic. This
     * function is used to create textual descriptions from matcher objects.
     */
    SimpleMatcher: function(params) {
        params = params || {};

        /**
         * Checks if this matcher matches the actual value.
         * @function
         * @param {object} actual Actual value.
         * @return {boolean} If they match or not.
         */
        this.matches = params.matches;

        /**
         * Describes this matcher's tasks to the given descriptor.
         * @function
         * @param {object} descriptor Descriptor.
         */
        this.describeTo = params.describeTo;
    },

    /**
     * Creates a combinable matcher.
     * @class Matcher that provides an easy way to wrap several matchers into
     * one.
     * @param {object} params Configuration object.
     * @param {function} params.matches Matcher logic.
     * @param {function} params.describeTo Self description logic. This
     * function is used to create textual descriptions from matcher objects.
     */
    CombinableMatcher: function(params) {
        // Call superclass' constructor
        JsUnitTest.Hamcrest.SimpleMatcher.apply(this, arguments);

        params = params || {};

        /**
         * Wraps this matcher with the given one in such a way that both
         * matchers must match the actual value to be successful.
         * @param {object} anotherMatcher Another matcher.
         * @return {JsUnitTest.Hamcrest.CombinableMatcher} Combinable matcher.
         */
        this.and = function(anotherMatcher) {
            var all = JsUnitTest.Hamcrest.Matchers.allOf(this, anotherMatcher);
            return new JsUnitTest.Hamcrest.CombinableMatcher({
                matches: all.matches,

                describeTo: function(description) {
                    description.appendDescriptionOf(all);
                }
            });
        };

        /**
         * Wraps this matcher with the given one in such a way that at least
         * one of the matchers must match the actual value to be successful.
         * @param {object} anotherMatcher Another matcher.
         * @return {JsUnitTest.Hamcrest.CombinableMatcher} Combinable matcher.
         */
        this.or = function(anotherMatcher) {
            var any = JsUnitTest.Hamcrest.Matchers.anyOf(this, anotherMatcher);
            return new JsUnitTest.Hamcrest.CombinableMatcher({
                matches: any.matches,

                describeTo: function(description) {
                    description.appendDescriptionOf(any);
                }
            });
        };
    },

    /**
     * Creates a description.
     * @class Description is the object that builds assertion error messages.
     * @constructor
     */
    Description: function() {
        /**
         * Current content of this description.
         * @property
         * @type string
         * @private
         */
        var value = '';

        /**
         * Gets the current content of this description.
         * @return {string} Current content of this description.
         */
        this.get = function() {
            return value;
        }

        /**
         * Appends the description a self describing object to this
         * description.
         * @param {object} selfDescribing Any object that have a
         * <code>describeTo</code> method that accepts a description object as
         * argument.
         * @return {JsUnitTest.Hamcrest.Description} this.
         */
        this.appendDescriptionOf = function(selfDescribing) {
            if (selfDescribing) {
                selfDescribing.describeTo(this);
            }
            return this;
        };

        /**
         * Appends a text to this description.
         * @param {string} text Text to append.
         * @return {JsUnitTest.Hamcrest.Description} this.
         */
        this.append = function(text) {
            if (text != null) {
                value += text;
            }
            return this;
        };

        /**
         * Appends a JavaScript language's literals to this description.
         * @param {object} literal Literal to append.
         * @return {JsUnitTest.Hamcrest.Description} this.
         */
        this.appendLiteral = function(literal) {
            if (literal === undefined) {
                this.append('<undefined>');
            } else if (literal === null) {
                this.append('<null>');
            } else if (literal instanceof Array) {
                this.appendValueList('[', ', ', ']', literal);
            } else if (typeof literal == 'number') {
                this.append(literal);
            } else if (typeof literal == 'string') {
                this.append('"' + literal + '"');
            } else if (literal instanceof Function) {
                this.append('<Function>');
            } else {
                this.append('{' + literal + '}');
            }
            return this;
        }

        /**
         * Appends a list of values to this description.
         * @param {string} start Start string.
         * @param {string} separator Separator string.
         * @param {string} end End string.
         * @param {array} list List of values.
         * @return {JsUnitTest.Hamcrest.Description} this.
         */
        this.appendValueList = function(start, separator, end, list) {
            this.append(start);
            for (var i = 0; i < list.length; i++) {
                if (i > 0) {
                    this.append(separator);
                }
                this.appendLiteral(list[i]);
            }
            this.append(end);
            return this;
        };

        /**
         * Appends a list of self describing objects to this description.
         * @param {string} start Start string.
         * @param {string} separator Separator string.
         * @param {string} end End string.
         * @param {array} list List of self describing objects. These objects
         * must that have a <code>describeTo</code> method that accepts a
         * description object as argument.
         * @return {JsUnitTest.Hamcrest.Description} this.
         */
        this.appendList = function(start, separator, end, list) {
            this.append(start);
            for (var i = 0; i < list.length; i++) {
                if (i > 0) {
                    this.append(separator);
                }
                this.appendDescriptionOf(list[i]);
            }
            this.append(end);
            return this;
        };
    }
};

// CombinableMatcher is a specialization of SimpleMatcher
JsUnitTest.Hamcrest.CombinableMatcher.prototype =
        new JsUnitTest.Hamcrest.SimpleMatcher();

/**
 * @fileOverview Provides core matchers.
 */

/**
 * Built-in matchers.
 * @namespace
 */
JsUnitTest.Hamcrest.Matchers = {};

/**
 * Assert method that is capable of handling matchers. If the given matcher
 * fails, this method registers a failed/error'd assertion within the current
 * TestCase object.
 * @param {object} actual Actual value under test.
 * @param {object} matcher Matcher to assert the correctness of the actual
 * value.
 * @param {string} message Message that describes the assertion, if necessary.
 * @return {JsUnitTest.Hamcrest.Description} Test result description.
 */
JsUnitTest.Hamcrest.Matchers.assertThat = function(actual, matcher, message) {
    var description = new JsUnitTest.Hamcrest.Description();

    // Creates a 'equalTo' matcher if 'matcher' is not a valid matcher
    if (!JsUnitTest.Hamcrest.isMatcher(matcher)) {
        matcher = JsUnitTest.Hamcrest.Matchers.equalTo(matcher);
    }

    if (!matcher.matches(actual)) {
        if (message) {
            description.append(message);
        }
        description.append('\nExpected: ');
        matcher.describeTo(description);
        description.append('\n     got: ').appendLiteral(actual).append('\n');
        this.fail(description.get());
    } else {
        description.append('Success');
        this.pass();
    }
    return description;
};

/**
 * Delegate-only matcher frequently used to improve readability. Ex: <p>
 *
 * <pre>
 * assertThat(10, is(10));
 * assertThat(10, is(equalTo(10)));
 * </pre>
 *
 * @param {object} matcher Delegate matcher.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'is' matcher.
 */
JsUnitTest.Hamcrest.Matchers.is = function(matcher) {
    // Uses 'equalTo' matcher if the given object is not a matcher
    if (!JsUnitTest.Hamcrest.isMatcher(matcher)) {
        matcher = JsUnitTest.Hamcrest.Matchers.equalTo(matcher);
    }

    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return matcher.matches(actual);
        },

        describeTo: function(description) {
            description.append('is ').appendDescriptionOf(matcher);
        }
    });
};

/**
 * The delegate matcher must not match to be successful. Ex: <p>
 *
 * <pre>
 * assertThat(10, not(20));
 * assertThat(10, not(equalTo(20)));
 * </pre>
 *
 * @param {object} matcher Delegate matcher.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'not' matcher.
 */
JsUnitTest.Hamcrest.Matchers.not = function(matcher) {
    // Uses 'equalTo' matcher if the given object is not a matcher
    if (!JsUnitTest.Hamcrest.isMatcher(matcher)) {
        matcher = JsUnitTest.Hamcrest.Matchers.equalTo(matcher);
    }

    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return !matcher.matches(actual);
        },

        describeTo: function(description) {
            description.append('not ').appendDescriptionOf(matcher);
        }
    });
};

/**
 * The actual number must be equal to the given number to be successful.
 * Ex: <p>
 *
 * <pre>
 * assertThat(10, equalTo('10'));
 * </pre>
 *
 * @param {object} expected value.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'equalTo' matcher.
 */
JsUnitTest.Hamcrest.Matchers.equalTo = function(expected) {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            if (expected instanceof Array || actual instanceof Array) {
                return JsUnitTest.Hamcrest.isArraysEqual(expected, actual);
            }
            return actual == expected;
        },

        describeTo: function(description) {
            description.append('equal to ').appendLiteral(expected);
        }
    });
};

/**
 * Useless always-match matcher. Ex: <p>
 *
 * <pre>
 * assertThat(myObj, is(anything())); // I don't actually care about myObj
 * </pre>
 *
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'anything' matcher.
 */
JsUnitTest.Hamcrest.Matchers.anything = function() {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return true;
        },

        describeTo: function(description) {
            description.append('anything');
        }
    });
};

/**
 * The actual value must be null (or undefined) to be successful. Ex: <p>
 *
 * <pre>
 * assertThat(myObj, nil()); // myObj should be null or undefined
 * </pre>
 *
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'nil' matcher.
 */
JsUnitTest.Hamcrest.Matchers.nil = function() {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual == null;
        },

        describeTo: function(description) {
            description.appendLiteral(null);
        }
    });
};

/**
 * The actual value must be the same as the given value to be successful.
 * Ex: <p>
 *
 * <pre>
 * assertThat(myObject, sameAs(anotherObj));
 * </pre>
 *
 * @param {object} expected Expected object.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'sameAs' matcher.
 */
JsUnitTest.Hamcrest.Matchers.sameAs = function(expected) {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual === expected;
        },

        describeTo: function(description) {
            description.append('same as ').appendLiteral(expected);
        }
    });
};

/**
 * The actual value is a function and, when invoked, it should thrown an
 * exception with the given name to be successful. Ex: <p>
 *
 * <pre>
 * var MyException = function(message) {
 *   this.name = 'MyException';
 *   this.message = message;
 * };
 * 
 * var myFunction = function() {
 *   // Do something dangerous...
 *   throw new MyException('Unexpected error');
 * }
 *
 * assertThat(myFunction, raises('MyException'));
 * </pre>
 *
 * @param {string} exceptionName Name of the expected exception.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'raises' matcher
 */
JsUnitTest.Hamcrest.Matchers.raises = function(exceptionName) {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actualFunction) {
            try {
                actualFunction();
            } catch (e) {
                if (e.name == exceptionName) {
                    return true;
                } else {
                    throw e;
                }
            }
            return false;
        },

        describeTo: function(description) {
            description.append('raises ').append(exceptionName);
        }
    });
}

/**
 * Creates a combinable matcher where the actual value must match all matchers
 * to be successful. Ex: <p>
 *
 * <pre>
 * assertThat(10, both(greaterThan(5)).and(lessThan(20)));
 * </pre>
 *
 * @param {object} matcher Matcher that should be turn into a combinable
 * matcher.
 * @return {JsUnitTest.Hamcrest.CombinableMatcher} 'both' matcher.
 */
JsUnitTest.Hamcrest.Matchers.both = function(matcher) {
    return new JsUnitTest.Hamcrest.CombinableMatcher({
        matches: matcher.matches,

        describeTo: function(description) {
            description.append('both ').appendDescriptionOf(matcher);
        }
    });
};

/**
 * Creates a combinable matcher where the actual value must match at least one
 * matcher to be successful. Ex: <p>
 *
 * <pre>
 * assertThat(10, either(lessThan(20)).or(greaterThan(50)));
 * </pre>
 *
 * @param {object} matcher Matcher that should be turn into a combinable
 * matcher.
 * @return {JsUnitTest.Hamcrest.CombinableMatcher} 'either' matcher.
 */
JsUnitTest.Hamcrest.Matchers.either = function(matcher) {
    return new JsUnitTest.Hamcrest.CombinableMatcher({
        matches: matcher.matches,

        describeTo: function(description) {
            description.append('either ').appendDescriptionOf(matcher);
        }
    });
};

/**
 * All the given values or matchers should match the actual value to be
 * sucessful. This matcher behaves pretty much like the JavaScript &&
 * operator (short-circuiting). Ex: <p>
 *
 * <pre>
 * assertThat(5, allOf([equalTo(0), lessThan(10)]));
 * assertThat(5, allOf([0, lessThan(10)]));
 * assertThat(5, allOf(equalTo(0), lessThan(10)));
 * assertThat(5, allOf(0, lessThan(10)));
 * </pre>
 *
 * @param {array} arguments List of delegate matchers.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'allOf' matcher.
 */
JsUnitTest.Hamcrest.Matchers.allOf = function() {
    var args = arguments;
    if (args[0] instanceof Array) {
        args = args[0];
    }
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            for (var i = 0; i < args.length; i++) {
                var matcher = args[i];
                if (!JsUnitTest.Hamcrest.isMatcher(matcher)) {
                    matcher = JsUnitTest.Hamcrest.Matchers.equalTo(matcher);
                }
                if (!matcher.matches(actual)) {
                    return false;
                }
            }
            return true;
        },

        describeTo: function(description) {
            description.appendList('(', ' and ', ')', args);
        }
    });
};

/**
 * At least one of the given matchers should match the actual value to be
 * sucessful. This matcher behaves pretty much like the JavaScript ||
 * operator (short-circuiting). Ex: <p>
 *
 * <pre>
 * assertThat(5, not(anyOf(lessThan(0), greaterThan(100))));
 * </pre>
 *
 * @param {array} arguments List of delegate matchers.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'allOf' matcher.
 */
JsUnitTest.Hamcrest.Matchers.anyOf = function() {
    var args = arguments;
    if (args[0] instanceof Array) {
        args = args[0];
    }
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            for (var i = 0; i < args.length; i++) {
                var matcher = args[i];
                if (!JsUnitTest.Hamcrest.isMatcher(matcher)) {
                    matcher = JsUnitTest.Hamcrest.Matchers.equalTo(matcher);
                }
                if (matcher.matches(actual)) {
                    return true;
                }
            }
            return false;
        },

        describeTo: function(description) {
            description.appendList('(', ' or ', ')', args);
        }
    });
};

/**
 * @fileOverview Provides number-related matchers.
 */

/**
 * Asserts that the actual number is greater than the given threshold. Ex: <p>
 *
 * <pre>
 * assertThat(10, greaterThan(5));
 * </pre>
 *
 * @param {number} threshold Threshold number.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'greaterThan' matcher.
 */
JsUnitTest.Hamcrest.Matchers.greaterThan = function(threshold) {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual > threshold;
        },

        describeTo: function(description) {
            description.append('greater than ').appendLiteral(threshold);
        }
    });
};

/**
 * Asserts that the actual number is greater than or equal to the given
 * threshold. Ex: <p>
 *
 * <pre>
 * assertThat(10, greaterThanOrEqualTo(5));
 * </pre>
 *
 * @param {number} threshold Threshold number.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'greaterThanOrEqualTo' matcher.
 */
JsUnitTest.Hamcrest.Matchers.greaterThanOrEqualTo = function(threshold) {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual >= threshold;
        },

        describeTo: function(description) {
            description.append('greater than or equal to ')
                    .appendLiteral(threshold);
        }
    });
};

/**
 * Asserts that the actual number is less than the given threshold. Ex: <p>
 *
 * <pre>
 * assertThat(5, lessThan(10));
 * </pre>
 *
 * @param {number} threshold Threshold number.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'lessThan' matcher.
 */
JsUnitTest.Hamcrest.Matchers.lessThan = function(threshold) {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual < threshold;
        },

        describeTo: function(description) {
            description.append('less than ').appendLiteral(threshold);
        }
    });
};

/**
 * Asserts that the actual number is less than or equal to the given threshold.
 * Ex: <p>
 *
 * <pre>
 * assertThat(5, lessThanOrEqualTo(10));
 * </pre>
 *
 * @param {number} threshold Threshold number.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'lessThanOrEqualTo' matcher.
 */
JsUnitTest.Hamcrest.Matchers.lessThanOrEqualTo = function(threshold) {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual <= threshold;
        },

        describeTo: function(description) {
            description.append('less than or equal to ').append(threshold);
        }
    });
};

/**
 * Asserts that the actual value is not a number. Ex: <p>
 *
 * <pre>
 * assertThat(Math.sqrt(-1), notANumber());
 * </pre>
 *
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'notANumber' matcher.
 */
JsUnitTest.Hamcrest.Matchers.notANumber = function() {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return isNaN(actual);
        },

        describeTo: function(description) {
            description.append('not a number');
        }
    });
};

/**
 * Asserts that the actual value is even. Ex: <p>
 *
 * <pre>
 * assertThat(4, even());
 * </pre>
 *
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'even' matcher.
 */
JsUnitTest.Hamcrest.Matchers.even = function() {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual % 2 == 0;
        },

        describeTo: function(description) {
            description.append('even');
        }
    });
};

/**
 * Asserts that the actual value is odd. Ex: <p>
 *
 * <pre>
 * assertThat(3, odd());
 * </pre>
 *
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'odd' matcher.
 */
JsUnitTest.Hamcrest.Matchers.odd = function() {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual % 2 == 1;
        },

        describeTo: function(description) {
            description.append('odd');
        }
    });
};

/**
 * Asserts that the actual number is between a given inclusive range. Ex: <p>
 * 
 * <pre>
 * assertThat(5, between(4).and(7));
 * </pre>
 *
 * @param {number} number Range start.
 * @return {JsUnitTest.Hamcrest.RangeMatcherBuilder} 'between' matcher.
 */
JsUnitTest.Hamcrest.Matchers.between = function(number) {
    return new JsUnitTest.Hamcrest.RangeMatcherBuilder({
        start: number,
    });
};

/**
 * Creates a number range matcher builder.
 * @class Matcher builder that provides an easy way to create matchers for
 * number ranges.
 * @constructor
 * @param {object} param Configuration object.
 * @param {number} param.start Range start.
 */
JsUnitTest.Hamcrest.RangeMatcherBuilder = function(params) {
    params = params || {};

    /**
     * Range start.
     * @property
     * @type number
     * @private
     */
    var start = params.start;

    /**
     * Finishes to build the range matcher.
     * @param {number} end Range end.
     * @return {JsUnitTest.Hamcrest.SimpleMatcher} Range matcher.
     */
    this.and = function(end) {
        var greater = end;
        var lesser = start;

        if (start > end) {
            greater = start;
            lesser = end;
        }

        return new JsUnitTest.Hamcrest.Matchers.allOf(
            JsUnitTest.Hamcrest.Matchers.greaterThanOrEqualTo(lesser),
            JsUnitTest.Hamcrest.Matchers.lessThanOrEqualTo(greater)
        );
    }
};

/**
 * @fileOverview Provides string-related matchers.
 */

/**
 * Asserts that the two strings are equals, ignoring case. Ex: <p>
 *
 * <pre>
 * assertThat('str', equalIgnoringCase('Str'));
 * </pre>
 *
 * @param {string} String.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'equalIgnoringCase' matcher.
 */
JsUnitTest.Hamcrest.Matchers.equalIgnoringCase = function(str) {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual.toUpperCase() == str.toUpperCase();
        },

        describeTo: function(description) {
            description.append('equal ignoring case "').append(str).append('"');
        }
    });
};

/**
 * Asserts that the actual value have a substring equals to the given string.
 * Ex: <p>
 *
 * <pre>
 * assertThat('string', containsString('tri'));
 * </pre>
 *
 * @param {string} String.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'containsString' matcher.
 */
JsUnitTest.Hamcrest.Matchers.containsString = function(str) {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual.indexOf(str) >= 0;
        },

        describeTo: function(description) {
            description.append('contains string "').append(str).append('"');
        }
    });
};

/**
 * Asserts that the actual value starts with the given string. Ex: <p>
 *
 * <pre>
 * assertThat('string', startsWith('str'));
 * </pre>
 *
 * @param {string} String.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'startsWith' matcher.
 */
JsUnitTest.Hamcrest.Matchers.startsWith = function(str) {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual.indexOf(str) == 0;
        },

        describeTo: function(description) {
            description.append('starts with ').appendLiteral(str);
        }
    });
};

/**
 * Asserts that the actual value ends with the given string. Ex: <p>
 *
 * <pre>
 * assertThat('string', endsWith('ring'));
 * </pre>
 *
 * @param {string} String.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'endsWith' matcher.
 */
JsUnitTest.Hamcrest.Matchers.endsWith = function(str) {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual.lastIndexOf(str) + str.length == actual.length;
        },

        describeTo: function(description) {
            description.append('ends with ').appendLiteral(str);
        }
    });
};

/**
 * @fileOverview Provides object-related matchers.
 */

/**
 * Asserts that the actual object contains the given property. Ex: <p>
 *
 * <pre>
 * assertThat(myObj, hasProperty('name'));
 * </pre>
 *
 * @param {string} property Property name.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'hasProperty' matcher.
 */
JsUnitTest.Hamcrest.Matchers.hasProperty = function(property) {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            try {
                return property in actual;
            } catch (e) { }
            return false;
        },

        describeTo: function(description) {
            description.append('has property ').appendLiteral(property);
        }
    });
};

/**
 * Asserts that the actual object is instance of the given class. Ex: <p>
 *
 * <pre>
 * assertThat(myObj, instanceOf(Array));
 * </pre>
 *
 * @param {function} clazz Constructor function.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'instanceOf' matcher.
 */
JsUnitTest.Hamcrest.Matchers.instanceOf = function(clazz) {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return !!(actual instanceof clazz);
        },

        describeTo: function(description) {
            var className = clazz.name ? clazz.name : 'a class';
            description.append('instance of ').append(className);
        }
    });
};

/**
 * @fileOverview Provides collection-related matchers.
 */

/**
 * The actual value should be an array and it must contain at least one value
 * that matches the given value or matcher to be successful. Ex: <p>
 *
 * <pre>
 * assertThat([1,2,3], hasItem(3));
 * assertThat([1,2,3], hasItem(equalTo(3)));
 * </pre>
 *
 * @param {array} matcher Number or matcher.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'hasItem' matcher.
 */
JsUnitTest.Hamcrest.Matchers.hasItem = function(matcher) {
    // Uses 'equalTo' matcher if the given object is not a matcher
    if (!JsUnitTest.Hamcrest.isMatcher(matcher)) {
        matcher = JsUnitTest.Hamcrest.Matchers.equalTo(matcher);
    }

    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            // Should be an array
            if (!(actual instanceof Array)) {
                return false;
            }

            for (var i = 0; i < actual.length; i++) {
                if (matcher.matches(actual[i])) {
                    return true;
                }
            }
            return false;
        },

        describeTo: function(description) {
            description.append('array contains item ')
                    .appendDescriptionOf(matcher);
        }
    });
};

/**
 * The actual value should be an array and it must contain at least one value
 * that matches each given value or matcher to be sucessful. Ex: <p>
 *
 * <pre>
 * assertThat([1,2,3], hasItems(2, 3));
 * assertThat([1,2,3], hasItems(greaterThanOrEqualTo(2)));
 * </pre>
 *
 * @param {object...} arguments Values or matchers.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'hasItems' matcher.
 */
JsUnitTest.Hamcrest.Matchers.hasItems = function() {
    var items = [];
    for (var i = 0; i < arguments.length; i++) {
        items.push(JsUnitTest.Hamcrest.Matchers.hasItem(arguments[i]));
    }
    return JsUnitTest.Hamcrest.Matchers.allOf(items);
};

/**
 * The given array must contain the actual value to be successful. Ex: <p>
 * 
 * <pre>
 * assertThat(1, isIn([1,2,3]));
 * assertThat(1, isIn(1,2,3));
 * </pre>
 *
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'isIn' matcher.
 */
JsUnitTest.Hamcrest.Matchers.isIn = function() {
    var equalTo = JsUnitTest.Hamcrest.Matchers.equalTo;

    var args = arguments;
    if (args[0] instanceof Array) {
        args = args[0];
    }

    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            for (var i = 0; i < args.length; i++) {
                if (equalTo(args[i]).matches(actual)) {
                    return true;
                }
            }
            return false;
        },

        describeTo: function(description) {
            description.append('one of ').appendLiteral(args);
        }
    });
};

/**
 * The given array must contain the actual value to be successful. This is an
 * alias to 'isIn' matcher. Ex: <p>
 * <pre>
 * assertThat(1, oneOf([1,2,3]));
 * assertThat(1, oneOf(1,2,3));
 * </pre>
 *
 * @function
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'oneOf' matcher.
 */
JsUnitTest.Hamcrest.Matchers.oneOf = JsUnitTest.Hamcrest.Matchers.isIn;

/**
 * The actual value should be an array and it must be empty to be sucessful.
 * Ex: <p>
 *
 * <pre>
 * assertThat([], empty());
 * </pre>
 *
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'empty' matcher.
 */
JsUnitTest.Hamcrest.Matchers.empty = function() {
    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual instanceof Array && actual.length == 0;
        },

        describeTo: function(description) {
            description.append('empty');
        }
    });
};

/**
 * The actual value should be an array and its size must match the given value
 * or matcher to be sucessful. Ex: <p>
 *
 * <pre>
 * assertThat([1,2,3], hasSize(3));
 * assertThat([1,2,3], hasSize(lessThan(5)));
 * </pre>
 *
 * @param {object} matcher Number or matcher.
 * @return {JsUnitTest.Hamcrest.SimpleMatcher} 'hasSize' matcher.
 */
JsUnitTest.Hamcrest.Matchers.hasSize = function(matcher) {
    // Uses 'equalTo' matcher if the given object is not a matcher
    if (!JsUnitTest.Hamcrest.isMatcher(matcher)) {
        matcher = JsUnitTest.Hamcrest.Matchers.equalTo(matcher);
    }

    return new JsUnitTest.Hamcrest.SimpleMatcher({
        matches: function(actual) {
            return actual instanceof Array && matcher.matches(actual.length);
        },

        describeTo: function(description) {
            description.append('has size ').appendDescriptionOf(matcher);
        }
    });
};

/**
 * @fileOverview Executes the code that installs the built-in
 * matchers to JsUnitTest.
 */

// Install built-in matchers
JsUnitTest.Hamcrest.installMatchers(JsUnitTest.Hamcrest.Matchers);

