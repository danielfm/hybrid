/**
 * @fileOverview Provides a simple generalization/specialization model to
 * Hybrid classes.
 */

/**
 * Creates a new Hybrid class.
 * @class All Hybrid classes should extend this class.
 * @constructor
 */
Hybrid.Class = {};

/**
 * Extends a Hybrid class.
 * @param {object} baseConstructor Base class.
 * @param {object} constructor Class being created.
 * @return {object} <code>constructor</code>.
 * @static
 */
Hybrid.Class.extend = function(superConstructor, constructor) {
    var SurrogateConstructor = function() {
    };

    SurrogateConstructor.prototype = superConstructor.prototype;

    var prototypeObject = new SurrogateConstructor();
    prototypeObject.constructor = constructor;

    constructor.prototype = prototypeObject;
    constructor.superClass = superConstructor;

    return constructor;
};

