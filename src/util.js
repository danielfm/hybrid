/**
 * The Util module provides utilitary methods to be used throughout the
 * framework codebase.
 * @module util
 * @namespace Hybrid.Util
 * @title Util
 */

Hybrid.Util = {};

/**
 * Utilitary class that contains array-related functions.
 * @static
 * @class Array
 */
Hybrid.Util.Array = {
    /**
     * Returns an array with the results of applying the function to the items
     * of the given array. All null or undefined results are not added to the
     * result list.
     * @method filter
     * @param array {array} Array.
     * @param func {function} Function to be applied to the items of the array.
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
 * Class that makes it easy to deal with random numbers generation.
 * @class Randomizer
 * @constructor
 */
Hybrid.Util.Randomizer = function() {
    
    /**
     * Gets a random number between the given range. If this method is called
     * with no arguments, it returns a random number between 0 and 1.
     * @method next
     * @param range {Hybrid.Util.Range} Range. (Optional)
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
     * @param percent {number} Number between 0 and 1 that represents the
     * chances of some event to happen.
     * @return {boolean} Whether the event should happen or not.
     */
    this.probability = function(percent) {
        return this.next() <= percent;
    };
};

/**
 * Very simple class to express ranges between two numbers.
 * @class Range
 * @constructor
 * @param start {number} Range start.
 * @param end {number} Range end.
 */
Hybrid.Util.Range = function(start, end) {
    if (end == null) {
        end = (!start ? 0 : start);
        start = 0;
    }
    
    if (start > end) {
        var temp = start;
        start = end;
        end = temp;
    }
    
    /**
     * Range start.
     * @property start
     * @type number
     * @private
     */
    start;
    
    /**
     * Range end.
     * @property end
     * @type number
     * @private
     */
    end;
    
    /**
     * Gets the range start.
     * @method getStart
     * @return {number} Range start.
     */
    this.getStart = function() {
        return start;
    };
    
    /**
     * Gets the range end.
     * @method getEnd
     * @return {number} Range end.
     */
    this.getEnd = function() {
        return end;
    };
    
    /**
     * Checks if the given number is between the range's edges.
     * @method isMember
     * @param num {number} Number.
     * @return {boolean} Whether the given number is somewhere between the range's
     * edges.
     */
    this.isMember = function(num) {
        return num >= start && num <= end
    };
    
    /**
     * Gets the difference between the range's edges.
     * @method delta
     * @return {boolean} Difference between the range's edges.
     */
    this.delta = function() {
        return end - start;
    };
};

