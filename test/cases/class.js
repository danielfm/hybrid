var ParentClass = new Hybrid.Class({
    initializer: function() {
        this.variable = 'text';
        this.sayHelloTo = function(name) {
            return 'Hello, ' + name;
        };
        this.saySomething = function() {
            return 'Something';
        }
    }
});

var ChildClass = new Hybrid.Class({
    extend: ParentClass,
    initializer: function() {
        ChildClass.superClass.apply(this, arguments);

        this.variable = 'other';
        this.sayHelloTo = function(name) {
            return 'Hey, ' + name;
        }
    }
});

new TestRunner({
    name: 'Class',

    setup: function() {
    },

    teardown: function() {
    },

    testCreateEmptyBaseClass: function() { with(this) {
        var DefaultClass = new Hybrid.Class();
        var object = new DefaultClass();

        assert(object);
        assert(object instanceof Object);
        assert(!(object instanceof ChildClass));
        assert(!(object instanceof ParentClass));
    }},

    testParentClassInheritance: function() { with(this) {
        var object = new ParentClass();

        assert(!(object instanceof ChildClass));
        assert(object instanceof ParentClass);
        assert(object instanceof Object);

        assertEqual('text', object.variable);
        assertEqual('Hello, Stranger', object.sayHelloTo('Stranger'));
        assertEqual('Something', object.saySomething());
    }},

    testChildClassInheritance: function() { with(this) {
        var object = new ChildClass();

        assert(!(object instanceof Array));
        assert(object instanceof ChildClass);
        assert(object instanceof ParentClass);
        assert(object instanceof Object);

        assertEqual('other', object.variable);
        assertEqual('Hey, Stranger', object.sayHelloTo('Stranger'));
        assertEqual('Something', object.saySomething());
    }}
}, {'logger':testLogger, 'testLog':'classLog'});

