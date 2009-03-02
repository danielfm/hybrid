/**
 * The Event module provides a simple implementation of the subject/observer
 * design pattern.
 * @module event
 * @namespace Hybrid.Event
 * @title Event
 */

/**
 * Implementation of the subject/observer design pattern that provides a simple
 * way to plug in functionality to an existing object.
 * @class Handler
 * @constructor
 */

Hybrid.Event = {};

Hybrid.Event.Handler = function() {
    
    /**
     * Registers a listener to be called when the given event happens.
     * @method addListener
     * @param type {string} Event type.
     * @param listener {function} Listener to be invoked when the event
     * happens.
     * @param params {object} Object that contains all parameters needed by
     * the listener.
     */
    this.addListener = function(type, listener, params) {
        if (type && listener) {
            listeners.push({
                listener: listener,
                type: type,
                params: params
            });
        }
    };
    
    /**
     * Removes the given listener.
     * @method removeListener
     * @param listener {function} Listener to be removed.
     */
    this.removeListener = function(listener) {
        var current = Hybrid.Util.Array.map(listeners, function(element) {
            return ((listener != element.listener) ? element : null);
        });
        listeners = current;
    };
    
    /**
     * Removes all listeners associated with the given event.
     * @method removeListenersByType
     * @param type {string} Event type.
     */
    this.removeListenersByType = function(type) {
        var byType = Hybrid.Util.Array.map(listeners, function(element) {
            return ((type != element.type) ? element : null);
        });
        listeners = byType;
    };
    
    /**
     * Gets all listeners associated with the given event.
     * @method getListenersByType
     * @param type {string} Event identifier.
     * @return {array} Array of listeners.
     */
    this.getListenersByType = function(type) {
        return Hybrid.Util.Array.map(listeners, function(element) {
            return ((type == element.type) ? element.listener : null);
        });
    };
    
    /**
     * Notifies the listeners about the ocurrence of some event.
     * @method notifyListeners
     * @param type {string} Event type used to determine which listeners
     * should be notified.
     * @param event {object} Event object which usually contains useful
     * information about the event in question.
     */
    this.notifyListeners = function(type, event) {
        var byType = Hybrid.Util.Array.map(listeners, function(element) {
            return ((element.type == type) ? element : null);
        });
        
        for (var i = 0; i < byType.length; i++) {
            var listener = byType[i];
            listener.listener(event, listener.params);
        }
    };
    
    /**
     * Return the list of registered listeners.
     * @method getListeners
     * @return {array} List of registered listeners.
     */
    this.getListeners = function() {
        return [].concat(listeners);
    };
    
    /**
     * Return the number of registered listeners.
     * @method getListenersCount
     * @return {number} Number of registered listeners.
     */
     this.getListenersCount = function() {
        return listeners.length;
     };
    
    /**
     * List of all registered listeners.
     * @property listeners
     * @type array
     * @private
     */
    var listeners = [];
};

