/**
 * @fileOverview Provides a simple generalization/specialization model to
 * Hybrid classes.
 */

/**
 * Creates a new class.
 * @constructor Creates a new class.
 * @param {object} options Options.
 * @param {class} [options.extend=Object] Super class.
 * @param {function} [options.initializer=function(){}] Constructor function.
 * @return {function} <b>options.initializer</b>.
 */
Hybrid.Class = function(options) {
    options = options || {};

    var superConstructor = options.extend || Object;
    var initializer = options.initializer || function() { };

    var SurrogateConstructor = function() { };
    SurrogateConstructor.prototype = superConstructor.prototype;

    var prototypeObject = new SurrogateConstructor();
    prototypeObject.constructor = initializer;

    initializer.prototype = prototypeObject;
    initializer.superClass = superConstructor;

    return initializer;
};

