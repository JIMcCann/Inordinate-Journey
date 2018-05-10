/*  util/protofunc
    Streamlines defining "classes."
    It's called "protofunc" and not "class":
    * to avoid keyword collision in newer versions of JavaScript
    * because it's not technically a class */
define(function () {
    return function (a, b, c) {
        // assume the "superclass" is Object unless otherwise specified
        let super = Object, constructor = null, prototype = null;
        if (c == undefined) { // if we didn't get a third argument:
            // interpret the arguments as (constructor, prototype)
            constructor = a;
            prototype = b;
        } else { // if we DID get a third argument:
            // interpret the arguments as (superclass, constructor, prototype)
            super = a;
            constructor = b;
            prototype = c;
        }
        // the constructor's prototype inherits from the superclass's prototype
        // and adds all the properties of the additional prototype given
        constructor.prototype = Object.create(super.prototype, prototype);
        // also, any objects instantiated with this constructor
        // should recognize themselves as instances of it
        constructor.prototype.constructor = constructor;
        // the function exported by this module should then return the constructor
        // after all this
        return constructor;
    };
});
