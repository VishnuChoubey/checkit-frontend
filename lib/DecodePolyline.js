/* eslint-disable no-mixed-operators */
/* eslint-disable block-scoped-var */
/* eslint-disable no-sequences */
/* eslint-disable max-len */
/* eslint-disable no-bitwise */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
function decodePolyline(polyline) {
    const _ = {};

    _.Ya = function(a, b, c) {
        b != null && (a = Math.max(a, b));
        c != null && (a = Math.min(a, c));
        return a;
    };
    _.Za = function(a, b, c) {
        c -= b;
        return ((a - b) % c + c) % c + b;
    };
    _.w = function(a) {
        return a ? a.length : 0;
    };

    _.E = function(a, b, c) {
        a -= 0;
        b -= 0;
        c || (a = _.Ya(a, -90, 90), b !== 180 && (b = _.Za(b, -180, 180)));
        this.lat = function() {
            return a;
        };
        this.lng = function() {
            return b;
        };
    };

    function decodePath(a) {
        for (var b = _.w(a), c = Array(Math.floor(a.length / 2)), d = 0, e = 0, f = 0, g = 0; d < b; ++g) {
            let h = 1;
            let l = 0;
            let n;
            do n = a.charCodeAt(d++) - 63 - 1, h += n << l, l += 5; while (n >= 31);
            e += h & 1 ? ~(h >> 1) : h >> 1;
            h = 1;
            l = 0;
            do n = a.charCodeAt(d++) - 63 - 1, h += n << l, l += 5; while (n >= 31);
            f += h & 1 ? ~(h >> 1) : h >> 1;
            c[g] = new _.E(1E-5 * e, 1E-5 * f, !0);
        }
        c.length = g;
        return c;
    }
    const result = decodePath(polyline).map((el) => ({
        latitude: Number(el.lat().toFixed(5)),
        longitude: Number(el.lng().toFixed(5))
    }));

    return result;
}

export default decodePolyline;