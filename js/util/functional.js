/*  util/functional
    Some facilities for functional programming. */
define(function () {
    let F = {
        /*  arrayOf: * -> ... -> [*]
            Returns all arguments passed to it as an array.
            Does in fact build a proper array.
            Doesn't just return the (non-array) arguments object. */
        arrayOf: function () {
            let arr = [];
            for (let x of arguments) arr[arr.length] = x;
            return arr;
        },
        /*  using: * -> (* -> ...) -> *
            A better 'with'. */
        using: function (that, f) {
            return f.apply(that,
                F.arrayOf.apply(F, arguments).slice(2));
        },
        /*  curry: (* -> ...) -> * -> ... -> (* -> ...)
            Partially applies the function.
            The partially applied function is returned.
            Unlike with typical currying,
            if the function becomes fully applied by this means,
            the result is not returned.
            The function is still returned,
            but simply becomes nullary. */
        curry: function (f) {
            let curried =
                F.arrayOf.apply(F, arguments).slice(1);
            return function () {
                return f.apply(this,
                    curried.concat(
                        F.arrayOf.apply(F, arguments)));
            };
        },
        /*  curryr: (* -> ...) -> * -> ... -> (* -> ...)
            Backward currying. */
        curryr: function (f) {
            let curried =
                F.arrayOf.apply(F, arguments).slice(1);
            return function () {
                return f.apply(this,
                    F.arrayOf.apply(F,
                        arguments).concat(curried));
            }
        },
        /*  compose: (* -> *) -> ... -> (* -> *)
            Monadic composition.
            Stacks unary functions like legos. */
        compose: function () {
            let funcs =
                F.arrayOf.apply(F, arguments).reverse();
            return function (x) {
                for (let f of funcs) x = f(x);
                return x;
            }
        },
        /*  mapping: * -> (* -> *)
            Returns a function equivalent
            to indexing the given object. */
        mapping: function (x) {return function (k) {return k[x];};}
    };
    return F;
    /*  This module needs to be attached to a variable
        (hence "let F =").
        It can't be an anonymous object
        because it needs to be able to access itself
        even when it's not 'this'. */
});
