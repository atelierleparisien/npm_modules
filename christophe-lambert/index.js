'use strict'

const pi = 3.14159265359;

module.exports = {
    wgs84ToLambertII: function(latitude, longitude) {
        var a = 6378137.0;
        var f = 1 / 298.257223563;
        var b = a * (1 - f);
        var e = Math.sqrt((a * a - b * b) / (a * a));
        var he = 0.0;
        var longitude = longitude * pi / 180;
        var latitude = latitude * pi / 180;

        var wgs84Cartesian = this.IGN_ALG009(longitude, latitude, he, a, e);

        var R = {};
        var T = {};

        var D = 0.00;
        R.X = 0.00;
        R.Y = 0.00;
        R.Z = 0.00;
        T.X = -168.00;
        T.Y = -60.00;
        T.Z = 320;

        var ntfCartesian = this.IGN_ALG063(T, D, R, wgs84Cartesian);

        a = 6378249.2;
        f = 1 / 293.46021;
        b = a * (1 - f);
        e = Math.sqrt((a * a - b * b) / (a * a));

        var ntfGeo = this.IGN_ALG012(a, e, ntfCartesian.X, ntfCartesian.Y, ntfCartesian.Z);

        var n = 0.7289686274;
        var C = 11745793.39;

        var Xs = 600000;
        var Ys = 8199695.768;

        var LambdaC = 2.337229167 * pi / 180.00;
        var Lambert = this.IGN_ALG003(e, n, C, LambdaC, Xs, Ys, ntfGeo.Lambda, ntfGeo.Phi);

        return Lambert;

    },
    lambertIIToWgs84: function(XLambert, YLambert) {
        var a = 6378249.2;
        var f = 1 / 293.466021;
        var b = a * (1 - f);
        var elambertIIToWgs84 = Math.sqrt((a * a - b * b) / (a * a));
        console.log("VALEUR DE e 1", elambertIIToWgs84);
        var he = 0.0;

        var n = 0.7289686274;
        var c = 11745793.39;

        var Xs = 600000;
        var Ys = 8199695.768;

        var LambdaC = 2.337229167 * pi / 180.00;
         
        var R1 = this.IGN_ALG004(XLambert, YLambert,n, c, Xs, Ys, LambdaC, elambertIIToWgs84);
        console.log("VALEUR DE e apres 004", elambertIIToWgs84);

        var ntfCartesian = this.IGN_ALG009(R1.Lambda, R1.Phi, he, a, elambertIIToWgs84);

        console.log("VALEUR DE e 009", elambertIIToWgs84);

        var D = 0.00;
        var R = {};

        var T = {};
        R.X = 0.00;
        R.Y = 0.00;
        R.Z = 0.00;
        T.X = -168.00;
        T.Y = -60.00;
        T.Z = 320;

        var wgs84Cartesian = this.IGN_ALG013(T, D, R, ntfCartesian);

        var a = 6378137.0;
        var f = 1 / 298.257223563;
        var b = a * (1 - f);
        var elambertIIToWgs84 = Math.sqrt((a * a - b * b) / (a * a));

        console.log("VALEUR DE e avant 012", elambertIIToWgs84);

        var LambdaPhi = this.IGN_ALG012(a, elambertIIToWgs84, wgs84Cartesian.X, wgs84Cartesian.Y, wgs84Cartesian.Z);
        console.log("VALEUR DE e apres 012", elambertIIToWgs84);

        var Result = {};
        Result.Longitude = LambdaPhi.Lambda * 180 / pi;
        Result.Latitude = LambdaPhi.Phi * 180 / pi;

        return Result;
    },
    IGN_ALG001: function(phi, e) {
        var terme1 = Math.tan(pi / 4 + phi / 2);
        var eSinPhi = e * Math.sin(phi);
        var terme2 = (1 - eSinPhi) / (1 + eSinPhi);
        terme2 = Math.pow(terme2, e / 2);

        return Math.log(terme1 * terme2);
    },
    IGN_ALG002: function(li, elambertIIToWgs84) {

        var Epsilon = Math.pow(10, -11);
        var ExpLi = Math.exp(li);
        var Phiim1 = 2 * Math.atan(ExpLi) - pi / 2;
        var ESinP = elambertIIToWgs84 * Math.sin(Phiim1);
        var Miaou = (1 + ESinP) / (1 - ESinP);
        var Miaou = Math.pow(Miaou, elambertIIToWgs84 / 2);

        var Phii = 2 * Math.atan((Miaou) * ExpLi) - pi / 2;

        while (Math.abs(Phii - Phiim1) > Epsilon) {
            var ESinP = elambertIIToWgs84 * Math.sin(Phii);
            var Miaou = (1 + ESinP) / (1 - ESinP);
            var Miaou = Math.pow(Miaou, elambertIIToWgs84 / 2);
            var Phiip1 = 2 * Math.atan((Miaou) * ExpLi) - pi / 2;
            Phiim1 = Phii;
            Phii = Phiip1;
        }
        return Phii;
    },
    IGN_ALG003: function(e, n, c, lambdaC, Xs, Ys, lambda, Phi)
    {
        var LatitudeIso = this.IGN_ALG001(Phi, e);

        var SubExpr01 = c * Math.exp(-n * LatitudeIso);

        var SubExpr02 = n * (lambda - lambdaC);

        var Result = {};
        Result.X = Xs + SubExpr01 * Math.sin(SubExpr02);
        Result.Y = Ys - SubExpr01 * Math.cos(SubExpr02);

        return Result;
    },
    IGN_ALG004: function(X, Y, n, c, Xs, Ys, LambdaC, elambertIIToWgs84) {
    	console.log("VALEUR DE e 004 inside", elambertIIToWgs84);

        var R = Math.hypot(X - Xs, Y - Ys);
        var Gamma = Math.atan((X - Xs) / (Ys - Y));

        var Result = {};
        Result.Lambda = LambdaC + Gamma / n;

        var L = (-1 / n) * Math.log(Math.abs(R / c));

        Result.Phi = this.IGN_ALG002(L, elambertIIToWgs84);


        return Result;
    },
    IGN_ALG009: function(Lambda, Phi, he, a, e) {
        var N = this.IGN_ALG021(Phi, a, e);
        var NHeCosPhi = (N + he) * Math.cos(Phi);
        var Result = {};
        Result.X = NHeCosPhi * Math.cos(Lambda);
        Result.Y = NHeCosPhi * Math.sin(Lambda);
        Result.Z = (N * (1 - e * e) + he) * Math.sin(Phi);
        return Result;
    },
    IGN_ALG012_Subex01: function(e, phi) {

        return Math.sqrt(1 - (e * Math.sin(phi)) * (e * Math.sin(phi)));
    },
    IGN_ALG012: function(a, e, X, Y, Z) {
        var Epsilon = Math.pow(10, -11);
        var Result = {};
        Result.Lambda = Math.atan(Y / X);
        var R2 = Math.hypot(X, Y);
        var R3 = Math.hypot(R2, Z);
        var ae2 = a * e * e;
        var Phi0 = Math.atan(Z / (R2 * (1 - ae2 / R3)));
        var Phi1 = Math.atan((Z / R2) * 1 / (1 - ae2 * Math.cos(Phi0) / (R2 * this.IGN_ALG012_Subex01(e, Phi0))));
        while (Math.abs(Phi1 - Phi0) > Epsilon) {
            Phi1 = Math.atan((Z / R2) * 1 / (1 - ae2 * Math.cos(Phi0) / (R2 * this.IGN_ALG012_Subex01(e, Phi0))));
            Phi0 = Phi1;
        }

        var Phi = Phi1;

        var h = (R2 / Math.cos(Phi)) - a / this.IGN_ALG012_Subex01(e, Phi);
        Result.Phi = Phi;
        Result.he = h;

        return Result;
    },
    IGN_ALG013: function(T, D, R, U) {
        var Dp1 = 1 + D;
        var Result = {};
        Result.X = T.X + U.X * Dp1 + U.Z * R.Y - U.Y * R.Z;
        Result.Y = T.Y + U.Y * Dp1 + U.X * R.Z - U.Z * R.X;
        Result.Z = T.Z + U.Z * Dp1 + U.Y * R.X - U.X * R.Y;

        return Result;
    },
    IGN_ALG021: function(Phi, a, e) {
        return a / Math.sqrt(1 - Math.pow(e * Math.sin(Phi), 2));
    },
    IGN_ALG063: function(T, D, R, V) {
        var W = {};
        var Result = {};
        W.X = V.X - T.X;
        W.Y = V.Y - T.Y;
        W.Z = V.Z - T.Z;
        var e = 1 + D;
        var det = e * (e * e + R.X * R.X + R.Y * R.Y + R.Z * R.Z);
        var e2Rx2 = e * e + R.X * R.X;
        var e2Ry2 = e * e + R.Y * R.Y;
        var e2Rz2 = e * e + R.Z * R.Z;
        var RxRy = R.X * R.Y;
        var RyRz = R.Y * R.Z;
        var RxRz = R.Z * R.X;
        Result.X = e2Rx2 * W.X + (RxRy + e * R.Z) * W.Y + (RxRz - e * R.Y) * W.Z;
        Result.Y = (RxRy - e * R.Z) * W.X + e2Ry2 * W.Y + (RyRz + e * R.X) * W.Z;
        Result.Z = (RxRz + e * R.Y) * W.X + (RyRz - e * R.X) * W.Y + e2Rz2 * W.Z;
        Result.X /= det;
        Result.Y /= det;
        Result.Z /= det;
        return Result;
    }
}