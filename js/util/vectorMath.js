/*  util/vectorMath
    A vector is an object with an x and a y.
    This does math on them and helps with things like angle and direction. */
let VM = {
    vector: function (x, y) {
        // vector: Build a vector from an x and a y.
        return {x: x, y: y};
    },
    add: function (v, u) {
        // add: Vector addition. Just adds the components.
        // Returns the sum vector.
        return {x: v.x + u.x, y: v.y + u.y};
    },
    subtract: function (v, u) {
        // subtract: Vector subtraction. Subtracts the components.
        // Returns the difference vector.
        return {x: v.x - u.x, y: v.y - u.y};
    },
    angle: function (v) {
        // angle: Calculates the facing of the vector, in clockwise degrees
        // where 0deg = right.
        return Math.atan2(v.y, v.x)*180.0/Math.PI;
    },
    dot: function (v, u) {
        // dot: Dot product. Sum of the products of the components.
        return v.x*u.x + v.y*u.y;
    },
    scale: function (v, s) {
        // scale: Scales the vector by the given scalar. Returns the scaled vector.
        return {x: v.x*s, y: v.y*s};
    },
    magnitude: function (v) {
        // magnitude: Vector length. Square root of the scalar square of the vector.
        // For non-distance vectors, e.g. velocity and acceleration,
        // magnitude can be thought of as a component-agnostic description
        // of "how much" of that quantity there is,
        // e.g. if you have x velocity and y velocity,
        // then the magnitude of the velocity vector is speed.
        return Math.sqrt(VM.dot(v, v));
    },
    normalize: function (v) {
        // normalize: Vector normalization.
        // Returns the unit vector in the same direction as the argument.
        return VM.scale(v, 1.0/VM.magnitude(v));
    },
    project: function (v, u) {
        // project: Vector projection.
        // Treats the second vector as an axis,
        // and returns the first vector's component along that axis.
        return VM.scale(VM.normalize(u), VM.dot(v, VM.normalize(u)));
    },
    scalarProject: function (v, u) {
        // scalarProject: Scalar projection.
        // Treats the second vector as an axis,
        // and returns the first vector's component along that axis
        // AS A SCALAR.
        let d = VM.dot(v, u)*1.0/(VM.magnitude(v)*VM.magnitude(u));
        if (isNaN(d)) return 0;
        return d;
    },
    direction: function (v) {
        // direction: Decides which of the four keyboard directions
        // most closely aligns to the direction of the given vector.
        let a = VM.angle(v);
        if (a < -135) return 'left';
        else if (a < -45) return 'up';
        else if (a < 45) return 'right';
        else if (a < 135) return 'down';
        else return 'left';
    },
    unangle: function (a) {
        // unangle: Returns the unit vector whose angle in degrees is that given.
        return VM.normalize(VM.vector(Math.cos(a*Math.PI/180), Math.sin(a*Math.PI/180)));
    },
    rotate: function (v, a) {
        // rotate: Returns the given vector rotated clockwise by the given angle in degrees.
        return VM.scale(VM.unangle(VM.angle(v) + a), VM.magnitude(v));
    }
};
define(VM);
