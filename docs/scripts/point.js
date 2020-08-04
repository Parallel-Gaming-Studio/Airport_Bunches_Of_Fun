// JavaScript Document

class POINT {
    // Overloaded constructor
    constructor(x, y) {
        if (typeof x !== "undefined" && typeof y !== "undefined") {
            this.x = x;
            this.y = y;
        } else {
            this.x = 0.0;
            this.y = 0.0;
        }
        const $this = this;
    }
}

class POINTS {
    // Overloaded constructor
    constructor(x, y) {
        if (typeof x !== "undefined" && typeof y !== "undefined") {
            this.x = x;
            this.y = y;
        } else {
            this.x = 0;
            this.y = 0;
        }
        const $this = this;
    }
}

// Returns if two POINT(s) are equal
function equalPOINT(a, b) {
    var test = false;

    if (a.x == b.x) {
        if (a.y == b.y) {
            test = true;
        }
    }

    return test;
}

// Returns if two POINTS(s) are equal
function equalPOINTS(a, b) {
    var test = false;

    if (a.x == b.x) {
        if (a.y == b.y) {
            test = true;
        }
    }

    return test;
}

// Returns if the POINT is zero
function isZeroPOINT(a) {
    return (a.x == 0 && a.y == 0);
}

// Returns if the POINTS is zero
function isZeroPOINTS(a) {
    return (a.x == 0 && a.y == 0);
}