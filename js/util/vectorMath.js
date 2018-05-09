/*  util/vectorMath
    A vector is an object with an x and a y.
    This does math on them and helps with things like angle and direction. */
let VM = {
    vector: function (x, y) {
        return {x: x, y: y};
    },
    add: function (v, u) {
        return {x: v.x + u.x, y: v.y + u.y};
    },
    subtract: function (v, u) {
        return {x: v.x - u.x, y: v.y - u.y};
    },
    angle: function (v) {
        return Math.atan2(v.y, v.x)*180/Math.PI;
    },
    dot: function (v, u) {
        return v.x*u.x + v.y*u.y;
    },
    scale: function (v, s) {
        return {x: v.x*s, y: v.y*s};
    },
    magnitude: function (v) {
        return Math.sqrt(VM.dot(v, v));
    },
    normalize: function (v) {
        return VM.scale(v, 1/VM.magnitude(v));
    },
    project: function (v, u) {
        return VM.scale(VM.normalize(u), VM.dot(v, VM.normalize(u)));
    },
    direction: function (v) {
        let a = VM.angle(v);
        if (a < -135) return 'left';
        else if (a < -45) return 'up';
        else if (a < 45) return 'right';
        else if (a < 135) return 'down';
        else return 'left';
    },
    unangle: function (a) {
        return VM.normalize(VM.vector(Math.cos(a*Math.PI/180), Math.sin(a*Math.PI/180)));
    },
    rotate: function (v, a) {
        return VM.scale(VM.unangle(VM.angle(v) + a), VM.magnitude(v));
    }
};
define(VM);
