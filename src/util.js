/**
 * @fileOverview Utilitary classes and methods.
 * @author <a href="mailto:daniel.tritone@gmail.com">Daniel F. Martins</a>
 */

/**
 * Provides utilitary methods to be used throughout the framework codebase.
 * @namespace
 */
Hybrid.Util = {};

/**
 * Array util methods.
 * @static
 * @namespace
 */
Hybrid.Util.Array = {

    /**
     * Returns an array with the results of applying the function to the items
     * of the given array. All null or undefined results are not added to the
     * result list.
     * @param {array} array Array.
     * @param {function} func Function to be applied to the items of the array.
     * This function should accept an argument, which is the element being
     * processed.
     * @return {array} Result array.
     * @static
     */
    map: function(array, func) {
        var result = [];
        var size = array.length;

        for (var i = 0; i < size; i++) {
            var element = array[i];

            if (func) {
                var returnedValue = func(element);
                if (returnedValue != null) {
                    result.push(returnedValue);
                }
            }
            else {
                result.push(element);
            }
        }

        return result;
    }
};

/**
 * Creates a new randomizer.
 * @class Class that makes it easy to deal with random numbers.
 * @class Randomizer
 * @constructor
 */
Hybrid.Util.Randomizer = new Hybrid.Class.extend(Object, function() {

    /**
     * Gets a random number between the given range. If this method is called
     * with no arguments, it returns a random number between 0 and 1.
     * @param {Hybrid.Util.Range} [range=undefined] Range.
     * @return {number} If a range is provided, returns a random number between
     * the range. Otherwise returns a number between 0 and 1.
     */
    this.next = function(range) {
        if (typeof range == 'undefined') {
            return Math.random();
        }

        if (range.delta() < 0) {
            throw "'start' shouldn't be greater than 'end'";
        }
        return range.delta() * this.next() + range.getStart();
    };

    /**
     * Checks the probability of some event.
     * @param {number} percent Number between 0 and 1 that represents the
     * chances of some event to happen.
     * @return {boolean} Whether the event should happen or not.
     */
    this.probability = function(percent) {
        return this.next() <= percent;
    };
});

/**
 * Creates a new range.
 * @class Very simple class to express ranges between two numbers.
 * @constructor
 * @param {number} [start=0] Range start.
 * @param {number} end Range end.
 */
Hybrid.Util.Range = new Hybrid.Class.extend(Object, function(start, end) {

    /**
     * Range start.
     * @name start
     * @property
     * @type number
     * @private
     */
    if (end == null) {
        end = (!start ? 0 : start);
        start = 0;
    }

    /**
     * Range end.
     * @name end
     * @property
     * @type number
     * @private
     */
    if (start > end) {
        var temp = start;
        start = end;
        end = temp;
    }

    /**
     * Gets the range start.
     * @return {number} Range start.
     */
    this.getStart = function() {
        return start;
    };

    /**
     * Gets the range end.
     * @return {number} Range end.
     */
    this.getEnd = function() {
        return end;
    };

    /**
     * Checks if the given number is between the range's edges.
     * @param {number} num Number.
     * @return {boolean} Whether the given number is somewhere between the range's
     * edges.
     */
    this.isMember = function(num) {
        return num >= start && num <= end
    };

    /**
     * Gets the difference between the range's edges.
     * @return {boolean} Difference between the range's edges.
     */
    this.delta = function() {
        return end - start;
    };
});

