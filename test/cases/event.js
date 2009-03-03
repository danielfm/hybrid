var TestCases = {
    description: 'Event',
    
    setup: function() {
        this.handler = new Hybrid.Event.Handler();
    },
  
    teardown: function() {
    },
    
    testInitialState: function() { with(this) {
        assertEqual(0, handler.getListenersCount());
    }},
    
    testAddListener: function() { with(this) {
        var listener = {};
        var type = 'event type';
        
        handler.addListener(type, listener);
        assertEqual(1, this.handler.getListenersCount());
        
        var entry = handler.getListeners()[0];
        
        assertIdentical(listener, entry.listener);
        assertIdentical(type, entry.type);
    }},
    
    testAddListenerNone: function() { with(this) {
        var listener = {};
        
        handler.addListener();
        assertEqual(0, handler.getListenersCount());
        
        handler.addListener('event');
        assertEqual(0, handler.getListenersCount());
        
        handler.addListener(null, {});
        assertEqual(0, handler.getListenersCount());
    }},
    
    testRemoveListener: function() { with(this) {
        var listener = {};
        
        handler.addListener('event', listener);
        assertEqual(1, handler.getListenersCount());
        
        this.handler.removeListener(listener);
        assertEqual(0, handler.getListenersCount());
    }},
    
    testRemoveInexistentListener: function() { with(this) {
        handler.addListener('event', {});
        assertEqual(1, handler.getListenersCount());
        
        handler.removeListener({});
        assertEqual(1, handler.getListenersCount());
    }},
    
    testRemoveListenerNone: function() { with(this) {
        handler.addListener('event', {});
        assertEqual(1, handler.getListenersCount());
        
        handler.removeListener();
        assertEqual(1, handler.getListenersCount());
    }},
    
    testRemoveListenersByType: function() { with(this) {
        handler.addListener('event', {});
        handler.addListener('event', {});
        assertEqual(2, handler.getListenersCount());
        
        handler.removeListenersByType('event');
        assertEqual(0, handler.getListenersCount());
    }},
    
    testRemoveListenersByInexistentType: function() { with(this) {
        handler.addListener('event', {});
        assertEqual(1, handler.getListenersCount());
        
        handler.removeListenersByType('another event');
        assertEqual(1, handler.getListenersCount());
    }},
    
    testRemoveListenersByTypeNone: function() { with(this) {
        handler.addListener('event', {});
        assertEqual(1, handler.getListenersCount());
        
        handler.removeListenersByType();
        assertEqual(1, handler.getListenersCount());
    }},
    
    testGetListenersByType: function() { with(this) {
        var event = {};
        handler.addListener('event', event);
        
        var events = handler.getListenersByType('event');
        assertIdentical(event, events[0]);
    }},
    
    testGetListenersByInexistentType: function() { with(this) {
        var event = {};
        handler.addListener('event', event);
        
        var events = handler.getListenersByType('another event');
        assertEnumEqual([], events);
    }},
    
    testGetListenersByTypeNone: function() { with(this) {
        var events = handler.getListenersByType();
        assertEnumEqual([], events);
    }},
    
    testNotifyInexistentListeners: function() { with(this) {
        this.handler.notifyListeners('event', {});
    }},
    
    testNotifyListeners: function() { with(this) {
        var eventObject = {
            parameter: 'param'
        };
        
        var clickerCount = 0;
        var clicker = function(event, params) {
            assertEqual('param', params.value);
            assertEqual('param', event.parameter);
            clickerCount++;
        };
        
        handler.addListener('event', clicker, {value:'param'});
        handler.addListener('another_event', clicker);
        
        handler.notifyListeners('event', eventObject);
        assertEqual(1, clickerCount);
    }}
};

new Test.Unit.Runner(TestCases, {'testLog':'eventLog'});

