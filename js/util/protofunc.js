/*  util/protofunc
    Streamlines defining "classes."
    It's called "protofunc" and not "class":
    * to avoid keyword collision in newer versions of JavaScript
    * because it's not technically a class */
define(function () {
    return function (a, b, c) {
        let super = Object, constructor = null, prototype = null;
        if (c == undefined) {
            constructor = a;
            prototype = b;
        } else {
            super = a;
            constructor = b;
            prototype = c;
        }
        constructor.prototype = Object.create(super.prototype, prototype);
        constructor.prototype.constructor = constructor;
        return constructor;
    };
});
