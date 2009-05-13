new TestRunner({
    name: 'Event',

    setup: function() {
        this.handler = new Hybrid.EventHandler();
    },

    teardown: function() {
    },

    testInitialState: function() { with(this) {
        assertThat(handler.getListenersCount(), 0);
    }},

    testAddListener: function() { with(this) {
        var listener = {};
        var type = 'event type';

        handler.addListener(type, listener);
        assertThat(handler.getListenersCount(), 1);

        var entry = handler.getListeners()[0];

        assertThat(entry.listener, sameAs(listener));
        assertThat(entry.type, sameAs(type));
    }},

    testAddListenerNone: function() { with(this) {
        var listener = {};

        handler.addListener();
        assertThat(handler.getListenersCount(), 0);

        handler.addListener('event');
        assertThat(handler.getListenersCount(), 0);

        handler.addListener(null, {});
        assertThat(handler.getListenersCount(), 0);
    }},

    testRemoveListener: function() { with(this) {
        var listener = {};

        handler.addListener('event', listener);
        assertThat(handler.getListenersCount(), 1);

        handler.removeListener(listener);
        assertThat(handler.getListenersCount(), 0);
    }},

    testRemoveInexistentListener: function() { with(this) {
        handler.addListener('event', {});
        assertThat(handler.getListenersCount(), 1);

        handler.removeListener({});
        assertThat(handler.getListenersCount(), 1);
    }},

    testRemoveListenerNone: function() { with(this) {
        handler.addListener('event', {});
        assertThat(handler.getListenersCount(), 1);

        handler.removeListener();
        assertThat(handler.getListenersCount(), 1);
    }},

    testRemoveListenersByType: function() { with(this) {
        handler.addListener('event', {});
        handler.addListener('event', {});
        assertThat(handler.getListenersCount(), 2);

        handler.removeListenersByType('event');
        assertThat(handler.getListenersCount(), 0);
    }},

    testRemoveListenersByInexistentType: function() { with(this) {
        handler.addListener('event', {});
        assertThat(handler.getListenersCount(), 1);

        handler.removeListenersByType('another event');
        assertThat(handler.getListenersCount(), 1);
    }},

    testRemoveListenersByTypeNone: function() { with(this) {
        handler.addListener('event', {});
        assertThat(handler.getListenersCount(), 1);

        handler.removeListenersByType();
        assertThat(handler.getListenersCount(), 1);
    }},

    testGetListenersByType: function() { with(this) {
        var event = {};
        handler.addListener('event', event);

        var events = handler.getListenersByType('event');
        assertThat(events[0], sameAs(event));
    }},

    testGetListenersByInexistentType: function() { with(this) {
        var event = {};
        handler.addListener('event', event);

        var events = handler.getListenersByType('another event');
        assertThat(events, []);
    }},

    testGetListenersByTypeNone: function() { with(this) {
        var events = handler.getListenersByType();
        assertEnumEqual([], events);
    }},

    testNotifyInexistentListeners: function() { with(this) {
        handler.notifyListeners('event', {});
    }},

    testNotifyListeners: function() { with(this) {
        var eventObject = {
            parameter: 'param'
        };

        var clickerCount = 0;
        var clicker = function(event, params) {
            assertThat(params.value, 'param');
            assertThat(event.parameter, 'param');
            clickerCount++;
        };

        handler.addListener('event', clicker, {value:'param'});
        handler.addListener('another_event', clicker);

        handler.notifyListeners('event', eventObject);
        assertThat(clickerCount, 1);
    }}
}, {'logger':testLogger, 'testLog':'eventLog'});

