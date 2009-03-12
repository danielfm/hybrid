/**
 * @fileOverview Provides a simple generalization/specialization model to
 * Hybrid classes.
 */

/**
 * Creates a new class.
 * @constructor Creates a new class.
 * @param {object} options Options.
 * @param {class} [options.extend=Object] Super class.
 * @param {function} [options.constructor=function(){}] Constructor function.
 * @return {function} <b>options.constructor</b>.
 */
Hybrid.Class = function(options) {
    options = options || {};

    var superConstructor = options.extend || Object;
    var constructor = options.constructor || function() { };

    var SurrogateConstructor = function() { };
    SurrogateConstructor.prototype = superConstructor.prototype;

    var prototypeObject = new SurrogateConstructor();
    prototypeObject.constructor = constructor;

    constructor.prototype = prototypeObject;
    constructor.superClass = superConstructor;

    return constructor;
};

