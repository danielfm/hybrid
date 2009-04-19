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
        this.defaultObject = new (new Hybrid.Class())();
        this.parentObject = new ParentClass();
        this.childObject = new ChildClass();
    },

    teardown: function() {
    },

    "Instance": new JsContext({
        "should inherit from Object": function() { with(this) {
            assertThat(defaultObject, instanceOf(Object));
            assertThat(defaultObject, not(instanceOf(ChildClass)));
            assertThat(defaultObject, not(instanceOf(ParentClass)));
        }},

        "should inherit from Object and ParentClass": function() { with(this) {
            assertThat(parentObject, not(instanceOf(ChildClass)));
            assertThat(parentObject, instanceOf(ParentClass));
            assertThat(parentObject, instanceOf(Object));

            assertThat(parentObject.variable, equalTo('text'));
            assertThat(parentObject.sayHelloTo('Stranger'), equalTo('Hello, Stranger'));
            assertThat(parentObject.saySomething(), equalTo('Something'));
        }},

        "should inherit from Object, ParentClass and ChildClass": function() { with(this) {
            assertThat(childObject, not(instanceOf(Array)));
            assertThat(childObject, instanceOf(ChildClass));
            assertThat(childObject, instanceOf(ParentClass));
            assertThat(childObject, instanceOf(Object));

            assertThat(childObject.variable, equalTo('other'));
            assertThat(childObject.sayHelloTo('Stranger'), equalTo('Hey, Stranger'));
            assertThat(childObject.saySomething(), equalTo('Something'));
        }}
    })
}, {'logger':testLogger, 'testLog':'classLog'});

