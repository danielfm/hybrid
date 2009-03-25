/**
 * @fileOverview Subject/observer design pattern implementation.
 * @author <a href="mailto:daniel.tritone@gmail.com">Daniel Fernandes Martins</a>
 */

/**
 * Creates a new event handler.
 * @class Implementation of the subject/observer design pattern that provides
 * a simple way to plug in functionality to an existing object.
 * @constructor
 * @depends Hybrid.Util
 */
Hybrid.EventHandler = function() {
    
    /**
     * Registers a listener to be called when the given event happens.
     * @param {object} eventType Event type.
     * @param {function} listener Listener to be invoked when the event
     * happens.
     * @param {object} [params=undefined] Object to be passed to the listener
     * when it's called.
     */
    this.addListener = function(eventType, listener, params) {
        if (eventType && listener) {
            listeners.push({
                listener: listener,
                type: eventType,
                params: params
            });
        }
    };
    
    /**
     * Removes the given listener.
     * @param {function} listener Listener to be removed.
     */
    this.removeListener = function(listener) {
        var current = Hybrid.Util.Array.map(listeners, function(element) {
            return ((listener != element.listener) ? element : null);
        });
        listeners = current;
    };
    
    /**
     * Removes all listeners associated with the given event.
     * @param {object} eventType Event type.
     */
    this.removeListenersByType = function(eventType) {
        var byType = Hybrid.Util.Array.map(listeners, function(element) {
            return ((eventType != element.type) ? element : null);
        });
        listeners = byType;
    };
    
    /**
     * Gets all listeners associated with the given event.
     * @param {object} eventType Event type.
     * @return {array} Array of listeners.
     */
    this.getListenersByType = function(eventType) {
        return Hybrid.Util.Array.map(listeners, function(element) {
            return ((eventType == element.type) ? element.listener : null);
        });
    };
    
    /**
     * Notifies the listeners about the occurrence of some event.
     * @param {object} eventType Event type used to determine which listeners
     * should be notified.
     * @param {object} event Event object which usually contains useful
     * information about the triggered event.
     */
    this.notifyListeners = function(eventType, event) {
        var byType = Hybrid.Util.Array.map(listeners, function(element) {
            return ((element.type == eventType) ? element : null);
        });
        
        for (var i = 0; i < byType.length; i++) {
            var listener = byType[i];
            listener.listener(event, listener.params);
        }
    };
    
    /**
     * Return the list of registered listeners.
     * @return {array} List of registered listeners.
     */
    this.getListeners = function() {
        return [].concat(listeners);
    };
    
    /**
     * Return the number of registered listeners.
     * @return {number} Number of registered listeners.
     */
     this.getListenersCount = function() {
        return listeners.length;
     };
    
    /**
     * List of all registered listeners.
     * @property
     * @type {array}
     * @private
     */
    var listeners = [];
};
Hybrid.EventHandler = new Hybrid.Class({
    constructor: Hybrid.EventHandler
});

